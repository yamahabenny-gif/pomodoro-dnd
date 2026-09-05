/**
 * "Ein Licht im Unterholz" — Ableitung des UI-Zustands aus dem
 * `focus_sessions`-Datensatz. Reine Funktionen, kein React, kein Date.now():
 * dieselbe Grundregel wie in session.ts und journey.ts. Das ist, was einen
 * Reload oder einen Hintergrund-Tab automatisch korrekt macht — es gibt
 * keinen zweiten, clientseitigen Zustand, der aus dem Tritt geraten könnte.
 */

import { PHASE_ONE_DURATIONS, TimerSession } from './session'

export type FocusSessionStatus = 'active' | 'completed' | 'cancelled'

export interface FocusSessionRow {
  id: string
  status: FocusSessionStatus
  started_at: string
  duration_seconds: number
  accumulated_ms: number
  paused_at: string | null
  completed_at: string | null
  rewarded_at: string | null
  rest_finished_at: string | null
  chest_opened_at: string | null
}

export type QuestPhase = 'briefing' | 'focus' | 'resolution' | 'chest' | 'done'

/**
 * Welche Phase die Oberfläche gerade zeigen muss. `departure` kommt hier nie
 * heraus — das kurze Aufbruchsritual ist rein clientseitige Inszenierung
 * *bevor* die Session existiert und wird vom aufrufenden Code selbst gesteuert.
 */
export function deriveQuestPhase(session: FocusSessionRow | null): QuestPhase {
  if (!session || session.status === 'cancelled') return 'briefing'
  if (session.status === 'active') return 'focus'

  // status === 'completed'
  if (session.chest_opened_at) return 'done'
  if (session.rest_finished_at) return 'chest'
  return 'resolution'
}

export function toTimerSession(session: FocusSessionRow): TimerSession {
  return {
    phase: 'focus',
    duration_s: session.duration_seconds,
    started_at: session.started_at,
    accumulated_ms: session.accumulated_ms,
    paused_at: session.paused_at,
  }
}

export function toRestSession(restStartedAt: string): TimerSession {
  return {
    phase: 'rest',
    duration_s: PHASE_ONE_DURATIONS.rest_s,
    started_at: restStartedAt,
    accumulated_ms: 0,
    paused_at: null,
  }
}
