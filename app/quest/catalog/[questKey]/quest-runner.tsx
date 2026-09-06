'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createSupabaseBrowserClient } from '../../../../lib/supabase/client'
import { useReducedMotion } from '../../../../lib/hooks/use-reduced-motion'
import { FocusSessionRow, toTimerSession } from '../../../../lib/timer/first-light'
import { formatRemaining, snapshot } from '../../../../lib/timer/session'
import { layerOffset } from '../../../../lib/timer/journey'
import { QuestDefinition } from '../../../../lib/quests/catalog'
import { withBasePath } from '../../../../lib/base-path'
import styles from '../../first-light/first-light.module.css'

type SupabaseClient = ReturnType<typeof createSupabaseBrowserClient>
type Stage = 'briefing' | 'departure' | 'focus' | 'resolution'

async function callRpc<T>(
  client: SupabaseClient,
  fn: string,
  args?: Record<string, unknown>,
): Promise<{ data: T | null; error: { message: string } | null }> {
  const result = await client.rpc(fn, args ?? {})
  return result as unknown as { data: T | null; error: { message: string } | null }
}

export function CatalogQuestRunner({ quest, initialSession }: { quest: QuestDefinition; initialSession: FocusSessionRow | null }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const reducedMotion = useReducedMotion()
  const [session, setSession] = useState(initialSession)
  const [departing, setDeparting] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [error, setError] = useState<string | null>(null)
  const [liveMessage, setLiveMessage] = useState('')
  const completingRef = useRef(false)

  const stage: Stage = departing
    ? 'departure'
    : !session || session.status === 'cancelled'
      ? 'briefing'
      : session.status === 'active'
        ? 'focus'
        : 'resolution'

  useEffect(() => {
    if (stage !== 'focus') return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [stage])

  const focusSnapshot = useMemo(() => {
    if (!session || session.status !== 'active') return null
    return snapshot(toTimerSession(session), now)
  }, [session, now])

  const completeSession = useCallback(async () => {
    if (!session || completingRef.current) return
    completingRef.current = true
    const { data, error: rpcError } = await callRpc<FocusSessionRow>(supabase, 'complete_catalog_quest_session', {
      p_session_id: session.id,
    })
    completingRef.current = false
    if (rpcError || !data) {
      setError('Der Weg konnte noch nicht abgeschlossen werden. Bitte versuch es gleich noch einmal.')
      return
    }
    setSession(data)
  }, [session, supabase])

  useEffect(() => {
    if (focusSnapshot?.is_complete) void completeSession()
  }, [focusSnapshot?.is_complete, completeSession])

  useEffect(() => {
    if (stage === 'departure') setLiveMessage('Du brichst auf.')
    if (stage === 'focus') setLiveMessage(`Fokus beginnt. ${quest.durationMinutes} Minuten Weg liegen vor dir.`)
    if (stage === 'resolution') setLiveMessage('Die Quest ist abgeschlossen.')
  }, [stage, quest.durationMinutes])

  async function startDeparture() {
    setError(null)
    setDeparting(true)
    const { data, error: rpcError } = await callRpc<FocusSessionRow>(supabase, 'start_catalog_quest_session', {
      p_quest_key: quest.key,
      p_duration_seconds: quest.durationMinutes * 60,
    })
    if (rpcError || !data) {
      setDeparting(false)
      setError('Der Aufbruch ist gerade nicht möglich. Vielleicht ist noch ein anderer Weg offen.')
      return
    }
    window.setTimeout(() => {
      setSession(data)
      setDeparting(false)
    }, 3000)
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
    window.location.href = withBasePath('/adventure-book')
  }

  const beat = focusSnapshot ? Math.min(3, Math.floor(focusSnapshot.progress * 4)) : 0
  const silhouetteX = focusSnapshot && !reducedMotion ? layerOffset(focusSnapshot.progress, 120, 1) : 0

  return (
    <main id="main-content" className={styles.shell} data-stage={stage}>
      <div role="status" aria-live="polite" className={styles.visuallyHidden}>{liveMessage}</div>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}

      {stage === 'briefing' ? (
        <section className={styles.card} aria-labelledby="catalog-briefing-title">
          <p className="eyebrow">{quest.region} · {quest.location}</p>
          <h1 id="catalog-briefing-title">{quest.title}</h1>
          {quest.assignment.map((paragraph) => paragraph ? <p key={paragraph}>{paragraph}</p> : null)}
          <p>{quest.durationMinutes} Minuten Weg.</p>
          <button type="button" onClick={startDeparture}>Aufbrechen</button>
        </section>
      ) : null}

      {stage === 'departure' ? (
        <section className={styles.departure} aria-labelledby="catalog-departure-title">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className={styles.departureArt}>
            <use href={withBasePath('/assets/phase1-art-pack.svg#quest-light-undergrowth-beat-01')} />
          </svg>
          <div className={styles.departureCopy}>
            <p className="eyebrow">Aufbruch</p>
            <h1 id="catalog-departure-title">Du machst dich auf den Weg.</h1>
          </div>
        </section>
      ) : null}

      {stage === 'focus' && focusSnapshot ? (
        <section className={styles.focusStage} aria-labelledby="catalog-focus-title">
          <div className={styles.beatLayer} aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <svg key={index} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false" className={styles.beat} data-active={index === beat}>
                <use href={withBasePath(`/assets/phase1-art-pack.svg#quest-light-undergrowth-beat-0${index + 1}`)} />
              </svg>
            ))}
          </div>
          <svg viewBox="0 0 220 260" aria-hidden="true" focusable="false" className={styles.silhouette} style={{ transform: `translateX(${silhouetteX}px)` }}>
            <use href={withBasePath('/assets/phase1-art-pack.svg#journey-silhouette')} />
          </svg>
          <div className={styles.timerPanel}>
            <p className="eyebrow" id="catalog-focus-title">{quest.title}</p>
            <p className={styles.timer} aria-hidden="true">{formatRemaining(focusSnapshot.remaining_ms)}</p>
            <div className={styles.controls}>
              <button type="button" onClick={togglePause}>{focusSnapshot.is_paused ? 'Weiter' : 'Pause'}</button>
              <button type="button" className={styles.leave} onClick={leaveQuest}>Quest verlassen</button>
            </div>
          </div>
        </section>
      ) : null}

      {stage === 'resolution' ? (
        <section className={styles.card} aria-labelledby="catalog-resolution-title">
          <p className="eyebrow">Questabschluss</p>
          <h1 id="catalog-resolution-title">Dieser Weg ist geschafft.</h1>
          <p>Du kannst den Gedanken hier ablegen. Der Wald merkt sich keine offenen Tabs.</p>
          <Link href="/adventure-book">Zurück zum Abenteuerbuch</Link>
        </section>
      ) : null}
    </main>
  )
}
