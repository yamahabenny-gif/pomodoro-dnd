export type TimerPhase = 'focus' | 'rest'

export interface TimerSession {
  phase: TimerPhase
  duration_s: number
  started_at: string
  accumulated_ms: number
  paused_at?: string | null
}

export interface TimerSnapshot {
  elapsed_ms: number
  remaining_ms: number
  progress: number
  is_paused: boolean
  is_complete: boolean
}

export const PHASE_ONE_DURATIONS = {
  focus_s: 15 * 60,
  rest_s: 5 * 60,
} as const

function parseTimestamp(value: string): number {
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid ISO timestamp: ${value}`)
  }
  return parsed
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function durationMs(session: TimerSession): number {
  return Math.max(0, session.duration_s * 1000)
}

export function createTimerSession(
  phase: TimerPhase,
  startedAt: string,
  durationS = phase === 'focus' ? PHASE_ONE_DURATIONS.focus_s : PHASE_ONE_DURATIONS.rest_s,
): TimerSession {
  parseTimestamp(startedAt)

  return {
    phase,
    duration_s: Math.max(0, durationS),
    started_at: startedAt,
    accumulated_ms: 0,
    paused_at: null,
  }
}

export function elapsedMs(session: TimerSession, now: number): number {
  const duration = durationMs(session)
  if (duration === 0) return 0

  const started = parseTimestamp(session.started_at)
  const paused = session.paused_at ? parseTimestamp(session.paused_at) : null
  const reference = paused ?? now
  const runningSegment = Math.max(0, reference - started)
  const accumulated = Math.max(0, session.accumulated_ms)

  return clamp(accumulated + runningSegment, 0, duration)
}

export function snapshot(session: TimerSession, now: number): TimerSnapshot {
  const duration = durationMs(session)
  const elapsed = elapsedMs(session, now)
  const remaining = Math.max(0, duration - elapsed)
  const progress = duration === 0 ? 1 : clamp(elapsed / duration, 0, 1)

  return {
    elapsed_ms: elapsed,
    remaining_ms: remaining,
    progress,
    is_paused: Boolean(session.paused_at),
    is_complete: remaining === 0,
  }
}

export function pauseSession(session: TimerSession, pausedAt: string): TimerSession {
  if (session.paused_at) return session

  const pausedMs = parseTimestamp(pausedAt)
  const startedMs = parseTimestamp(session.started_at)
  const runningSegment = Math.max(0, pausedMs - startedMs)
  const accumulated = clamp(
    Math.max(0, session.accumulated_ms) + runningSegment,
    0,
    durationMs(session),
  )

  return {
    ...session,
    accumulated_ms: accumulated,
    started_at: pausedAt,
    paused_at: pausedAt,
  }
}

export function resumeSession(session: TimerSession, resumedAt: string): TimerSession {
  parseTimestamp(resumedAt)
  if (!session.paused_at) return session

  return {
    ...session,
    started_at: resumedAt,
    paused_at: null,
  }
}

export function formatRemaining(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
