'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createSupabaseBrowserClient } from '../../../lib/supabase/client'
import { useSceneAudio } from '../../../lib/audio/use-scene-audio'
import { useReducedMotion } from '../../../lib/hooks/use-reduced-motion'
import { deriveQuestPhase, FocusSessionRow, toRestSession, toTimerSession } from '../../../lib/timer/first-light'
import { formatRemaining, snapshot } from '../../../lib/timer/session'
import { layerOffset } from '../../../lib/timer/journey'
import { withBasePath } from '../../../lib/base-path'
import styles from './first-light.module.css'

type SupabaseClient = ReturnType<typeof createSupabaseBrowserClient>

/**
 * `.rpc()` without a generated `Database` type has no way to know a given
 * function's return shape, and `.single()` only makes sense for a
 * `returns table(...)` function (PostgREST answers those as an array).
 * `start_first_light_session` & co. return a single `focus_sessions` row
 * directly — PostgREST already answers with one JSON object, not an array —
 * so this casts instead of risking a mismatched Accept header from `.single()`.
 */
async function callRpc<T>(
  client: SupabaseClient,
  fn: string,
  args?: Record<string, unknown>,
): Promise<{ data: T | null; error: { message: string } | null }> {
  const result = await client.rpc(fn, args ?? {})
  return result as unknown as { data: T | null; error: { message: string } | null }
}

const BEAT_COUNT = 4
const AUDIO = {
  departure: '/audio/audio-departure-motif-01.ogg',
  focus: '/audio/audio-focus-light-undergrowth-01.ogg',
  resolve: '/audio/audio-completion-resolve-01.ogg',
  rest: '/audio/audio-rest-campfire-ambience-01.ogg',
  chest: '/audio/sfx-chest-lantern-material-01.ogg',
} as const

type Stage = 'briefing' | 'departure' | 'focus' | 'resolution' | 'resting' | 'chest' | 'done'

function beatIndexFor(progress: number): number {
  return Math.min(BEAT_COUNT - 1, Math.floor(progress * BEAT_COUNT))
}

export function QuestRunner({
  characterName,
  initialSession,
}: {
  characterName: string
  initialSession: FocusSessionRow | null
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const reducedMotion = useReducedMotion()

  const [session, setSession] = useState(initialSession)
  const [departing, setDeparting] = useState(false)
  const [restStartedAt, setRestStartedAt] = useState<number | null>(null)
  const [reward, setReward] = useState<{ xp: number; gold: number } | null>(null)
  const [woodAdded, setWoodAdded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [error, setError] = useState<string | null>(null)
  const [liveMessage, setLiveMessage] = useState('')
  const stageRef = useRef<HTMLDivElement | null>(null)
  const completingRef = useRef(false)
  const lastAnnouncedMinuteRef = useRef<number | null>(null)

  const dbPhase = deriveQuestPhase(session)
  const stage: Stage = departing
    ? 'departure'
    : dbPhase === 'resolution' && restStartedAt !== null
      ? 'resting'
      : dbPhase

  // Eine Sekunde Auflösung reicht für einen Countdown; niemand braucht hier
  // 60fps, und weniger Ticks schonen den Akku während der Fokuszeit.
  useEffect(() => {
    if (stage !== 'focus' && stage !== 'resting') return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [stage])

  const focusSnapshot = useMemo(() => {
    if (!session || dbPhase !== 'focus') return null
    return snapshot(toTimerSession(session), now)
  }, [session, dbPhase, now])

  const restSnapshot = useMemo(() => {
    if (restStartedAt === null) return null
    return snapshot(toRestSession(new Date(restStartedAt).toISOString()), now)
  }, [restStartedAt, now])

  const completeFocusSession = useCallback(async () => {
    if (!session || completingRef.current) return
    completingRef.current = true

    const { data, error: rpcError } = await callRpc<
      { xp: number; gold: number; chest_earned: boolean }[]
    >(supabase, 'complete_first_light_session', { p_session_id: session.id })

    completingRef.current = false

    const row = data?.[0]
    if (rpcError || !row) {
      setError('Der Questabschluss konnte nicht gespeichert werden. Bitte versuch es gleich noch einmal.')
      return
    }

    setReward({ xp: row.xp, gold: row.gold })
    setSession((current) =>
      current ? { ...current, status: 'completed', completed_at: new Date().toISOString(), rewarded_at: new Date().toISOString() } : current,
    )
  }, [session, supabase])

  useEffect(() => {
    if (focusSnapshot?.is_complete) {
      void completeFocusSession()
    }
  }, [focusSnapshot?.is_complete, completeFocusSession])

  // aria-live meldet Phasenwechsel und grobe 5-Minuten-Marken — nicht jede
  // Sekunde. Screenreader-Nutzer:innen bekommen sonst einen Countdown vorgelesen.
  useEffect(() => {
    const announcements: Record<Stage, string> = {
      briefing: '',
      departure: 'Du brichst auf.',
      focus: 'Fokus beginnt. Fünfzehn Minuten Weg liegen vor dir.',
      resolution: 'Die Quest ist abgeschlossen.',
      resting: 'Die Rast beginnt.',
      chest: 'Deine Truhe ist bereit.',
      done: 'Zurück im Lager.',
    }
    if (announcements[stage]) setLiveMessage(announcements[stage])
    lastAnnouncedMinuteRef.current = null
  }, [stage])

  useEffect(() => {
    if (!focusSnapshot || focusSnapshot.is_paused) return
    const minutesLeft = Math.ceil(focusSnapshot.remaining_ms / 60000)
    if (minutesLeft > 0 && minutesLeft % 5 === 0 && lastAnnouncedMinuteRef.current !== minutesLeft) {
      lastAnnouncedMinuteRef.current = minutesLeft
      setLiveMessage(`Noch ${minutesLeft} Minuten.`)
    }
  }, [focusSnapshot])

  async function startDeparture() {
    setError(null)
    setDeparting(true)

    const { data, error: rpcError } = await callRpc<FocusSessionRow>(supabase, 'start_first_light_session')

    if (rpcError || !data) {
      setDeparting(false)
      setError('Der Aufbruch ist gerade nicht möglich. Bitte versuch es noch einmal.')
      return
    }

    window.setTimeout(() => {
      setSession(data)
      setDeparting(false)
    }, 4000)
  }

  async function togglePause() {
    if (!session) return
    const rpcName = focusSnapshot?.is_paused ? 'resume_focus_session' : 'pause_focus_session'
    const { data, error: rpcError } = await callRpc<FocusSessionRow>(supabase, rpcName, { p_session_id: session.id })
    if (!rpcError && data) setSession(data)
  }

  async function leaveQuest() {
    if (!session) return
    await callRpc(supabase, 'cancel_focus_session', { p_session_id: session.id })
    window.location.href = withBasePath('/camp')
  }

  async function finishRest() {
    if (!session) return
    const { data, error: rpcError } = await callRpc<string>(supabase, 'finish_first_light_rest', {
      p_session_id: session.id,
    })
    if (rpcError || !data) return
    setSession((current) => (current ? { ...current, rest_finished_at: data } : current))
  }

  useEffect(() => {
    if (stage === 'resting' && restSnapshot?.is_complete) {
      void finishRest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, restSnapshot?.is_complete])

  async function openChest() {
    if (!session) return
    const { error: rpcError } = await callRpc<boolean>(supabase, 'open_first_light_chest', {
      p_session_id: session.id,
    })
    if (rpcError) return
    setSession((current) => (current ? { ...current, chest_opened_at: new Date().toISOString() } : current))
  }

  async function toggleFullscreen() {
    if (!stageRef.current) return
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {})
    } else {
      await stageRef.current.requestFullscreen().catch(() => {})
    }
  }

  useSceneAudio(AUDIO.departure, stage === 'departure', muted)
  useSceneAudio(AUDIO.focus, stage === 'focus', muted)
  useSceneAudio(AUDIO.rest, stage === 'resting', muted)

  useEffect(() => {
    if (stage !== 'resolution' || muted) return
    new Audio(AUDIO.resolve).play().catch(() => {})
  }, [stage, muted])

  return (
    <main id="main-content" className={styles.shell} ref={stageRef} data-stage={stage}>
      <div role="status" aria-live="polite" className={styles.visuallyHidden}>
        {liveMessage}
      </div>

      {error ? (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}

      {stage === 'briefing' ? <Briefing onDepart={startDeparture} /> : null}
      {stage === 'departure' ? <Departure /> : null}
      {stage === 'focus' && focusSnapshot ? (
        <FocusScene
          snapshot={focusSnapshot}
          reducedMotion={reducedMotion}
          muted={muted}
          onToggleMute={() => setMuted((value) => !value)}
          onTogglePause={togglePause}
          onLeave={leaveQuest}
          onToggleFullscreen={toggleFullscreen}
        />
      ) : null}
      {stage === 'resolution' ? (
        <Resolution characterName={characterName} reward={reward} onContinue={() => setRestStartedAt(Date.now())} />
      ) : null}
      {stage === 'resting' && restSnapshot ? (
        <Rest
          snapshot={restSnapshot}
          reducedMotion={reducedMotion}
          woodAdded={woodAdded}
          onAddWood={() => setWoodAdded(true)}
          onSkip={finishRest}
        />
      ) : null}
      {stage === 'chest' ? <ChestReady onOpen={openChest} /> : null}
      {stage === 'done' ? <Done /> : null}
    </main>
  )
}

function Briefing({ onDepart }: { onDepart: () => void }) {
  return (
    <section className={styles.card} aria-labelledby="briefing-title">
      <p className="eyebrow">Auftrag</p>
      <h1 id="briefing-title">Ein Licht im Unterholz</h1>
      <p>
        Zwischen den Farnen flackert etwas. Fünfzehn ruhige Minuten reichen, um ihm ein Stück zu folgen — mehr
        verlangt dieser Weg nicht von dir.
      </p>
      <button type="button" onClick={onDepart}>
        Aufbrechen
      </button>
    </section>
  )
}

function Departure() {
  return (
    <section className={styles.departure} aria-labelledby="departure-title">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
        className={styles.departureArt}
      >
        <use href="/assets/phase1-art-pack.svg#quest-light-undergrowth-beat-01" />
      </svg>
      <div className={styles.departureCopy}>
        <p className="eyebrow">Aufbruch</p>
        <h1 id="departure-title">Du nimmst deine Ausrüstung und trittst zwischen die Bäume.</h1>
      </div>
    </section>
  )
}

function FocusScene({
  snapshot: snap,
  reducedMotion,
  muted,
  onToggleMute,
  onTogglePause,
  onLeave,
  onToggleFullscreen,
}: {
  snapshot: ReturnType<typeof snapshot>
  reducedMotion: boolean
  muted: boolean
  onToggleMute: () => void
  onTogglePause: () => void
  onLeave: () => void
  onToggleFullscreen: () => void
}) {
  const beat = beatIndexFor(snap.progress)
  const silhouetteX = reducedMotion ? 0 : layerOffset(snap.progress, 120, 1)

  return (
    <section className={styles.focusStage} aria-labelledby="focus-title">
      <div className={styles.beatLayer} aria-hidden="true">
        {Array.from({ length: BEAT_COUNT }, (_, index) => (
          <svg
            key={index}
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            className={styles.beat}
            data-active={index === beat}
          >
            <use href={`/assets/phase1-art-pack.svg#quest-light-undergrowth-beat-0${index + 1}`} />
          </svg>
        ))}
      </div>

      <svg
        viewBox="0 0 220 260"
        aria-hidden="true"
        focusable="false"
        className={styles.silhouette}
        style={{ transform: `translateX(${silhouetteX}px)` }}
      >
        <use href="/assets/phase1-art-pack.svg#journey-silhouette" />
      </svg>

      <div className={styles.timerPanel}>
        <p className="eyebrow" id="focus-title">
          Ein Licht im Unterholz
        </p>
        <p className={styles.timer} aria-hidden="true">
          {formatRemaining(snap.remaining_ms)}
        </p>
        <div className={styles.controls}>
          <button type="button" onClick={onTogglePause}>
            {snap.is_paused ? 'Weiter' : 'Pause'}
          </button>
          <button type="button" onClick={onToggleMute} aria-pressed={muted}>
            {muted ? 'Ton an' : 'Ton aus'}
          </button>
          <button type="button" onClick={onToggleFullscreen}>
            Vollbild
          </button>
          <button type="button" className={styles.leave} onClick={onLeave}>
            Quest verlassen
          </button>
        </div>
      </div>
    </section>
  )
}

function Resolution({
  characterName,
  reward,
  onContinue,
}: {
  characterName: string
  reward: { xp: number; gold: number } | null
  onContinue: () => void
}) {
  return (
    <section className={styles.card} aria-labelledby="resolution-title">
      <svg viewBox="0 0 1600 900" aria-hidden="true" focusable="false" className={styles.resolutionArt}>
        <use href="/assets/phase1-art-pack.svg#quest-light-undergrowth-beat-04" />
      </svg>
      <p className="eyebrow">Questabschluss</p>
      <h1 id="resolution-title">Das Licht ist erreicht.</h1>
      <p>{characterName} bleibt einen Moment stehen. Genug für heute — der Weg zurück kann warten.</p>
      <dl className={styles.rewardList}>
        <div>
          <dt>XP</dt>
          <dd>+{reward?.xp ?? 15}</dd>
        </div>
        <div>
          <dt>Gold</dt>
          <dd>+{reward?.gold ?? 3}</dd>
        </div>
        <div>
          <dt>Truhe</dt>
          <dd>verdient — öffnet nach der Rast</dd>
        </div>
      </dl>
      <button type="button" onClick={onContinue}>
        Weiter zur Rast
      </button>
    </section>
  )
}

function Rest({
  snapshot: snap,
  reducedMotion,
  woodAdded,
  onAddWood,
  onSkip,
}: {
  snapshot: ReturnType<typeof snapshot>
  reducedMotion: boolean
  woodAdded: boolean
  onAddWood: () => void
  onSkip: () => void
}) {
  return (
    <section className={styles.restStage} aria-labelledby="rest-title" data-reduced={reducedMotion} data-fed={woodAdded}>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
        className={styles.restArt}
      >
        <use href="/assets/phase1-art-pack.svg#rest-campfire" />
      </svg>
      <div className={styles.restCopy}>
        <p className="eyebrow" id="rest-title">
          Rast
        </p>
        <p>Das Feuer knistert. Es gibt gerade nichts zu tun, und das ist genau richtig so.</p>
        <p className={styles.timer} aria-hidden="true">
          {formatRemaining(snap.remaining_ms)}
        </p>
        <div className={styles.controls}>
          {!woodAdded ? (
            <button type="button" onClick={onAddWood}>
              Holz auflegen
            </button>
          ) : null}
          <button type="button" className={styles.leave} onClick={onSkip}>
            Rast überspringen
          </button>
        </div>
      </div>
    </section>
  )
}

function ChestReady({ onOpen }: { onOpen: () => void }) {
  return (
    <section className={styles.card} aria-labelledby="chest-title">
      <svg viewBox="0 0 1600 900" aria-hidden="true" focusable="false" className={styles.chestArt}>
        <use href="/assets/phase1-art-pack.svg#chest-closed" />
      </svg>
      <p className="eyebrow">Nach der Rast</p>
      <h1 id="chest-title">Deine erste Truhe wartet.</h1>
      <button type="button" onClick={onOpen}>
        Truhe öffnen
      </button>
    </section>
  )
}

function Done() {
  return (
    <section className={styles.card} aria-labelledby="done-title">
      <svg viewBox="0 0 1600 900" aria-hidden="true" focusable="false" className={styles.chestArt}>
        <use href="/assets/phase1-art-pack.svg#chest-open" />
      </svg>
      <p className="eyebrow">Alte Weglaterne gefunden</p>
      <h1 id="done-title">Der Weg zurück ist erhellt.</h1>
      <p>Die Laterne steht ab jetzt in deinem Lager. Der Bildschirm hat für heute nichts mehr für dich.</p>
      <Link href="/camp">Zurück ins Lager</Link>
    </section>
  )
}
