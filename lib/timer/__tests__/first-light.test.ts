import { describe, expect, it } from 'vitest'
import { deriveQuestPhase, FocusSessionRow, toTimerSession } from '../first-light'
import { snapshot } from '../session'

const T0 = '2026-09-05T09:00:00.000Z'

function row(overrides: Partial<FocusSessionRow> = {}): FocusSessionRow {
  return {
    id: 'session-1',
    status: 'active',
    started_at: T0,
    duration_seconds: 900,
    accumulated_ms: 0,
    paused_at: null,
    completed_at: null,
    rewarded_at: null,
    rest_finished_at: null,
    chest_opened_at: null,
    ...overrides,
  }
}

describe('deriveQuestPhase', () => {
  it('shows the briefing when there is no session yet', () => {
    expect(deriveQuestPhase(null)).toBe('briefing')
  })

  it('treats a cancelled session like no session — no dead end', () => {
    expect(deriveQuestPhase(row({ status: 'cancelled' }))).toBe('briefing')
  })

  it('is the focus screen while the session is active, paused or not', () => {
    expect(deriveQuestPhase(row({ status: 'active' }))).toBe('focus')
    expect(deriveQuestPhase(row({ status: 'active', paused_at: T0 }))).toBe('focus')
  })

  it('moves through resolution, rest and the chest before done', () => {
    const completed = row({ status: 'completed', completed_at: T0, rewarded_at: T0 })
    expect(deriveQuestPhase(completed)).toBe('resolution')
    expect(deriveQuestPhase({ ...completed, rest_finished_at: T0 })).toBe('chest')
    expect(deriveQuestPhase({ ...completed, rest_finished_at: T0, chest_opened_at: T0 })).toBe('done')
  })
})

describe('toTimerSession', () => {
  it('carries the accumulated pause time into the reusable timer snapshot', () => {
    const session = toTimerSession(
      row({ started_at: T0, accumulated_ms: 30_000, paused_at: T0 }),
    )
    const state = snapshot(session, Date.parse(T0) + 60_000)

    // paused_at is set, so elapsed stays frozen at the accumulated amount
    // regardless of how much wall-clock time passes.
    expect(state.elapsed_ms).toBe(30_000)
    expect(state.is_paused).toBe(true)
  })

  it('keeps counting from accumulated_ms once resumed', () => {
    const session = toTimerSession(
      row({ started_at: T0, accumulated_ms: 30_000, paused_at: null }),
    )
    const state = snapshot(session, Date.parse(T0) + 10_000)

    expect(state.elapsed_ms).toBe(40_000)
  })
})
