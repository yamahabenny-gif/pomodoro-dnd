import { describe, expect, it } from 'vitest'
import {
  createTimerSession,
  elapsedMs,
  formatRemaining,
  pauseSession,
  PHASE_ONE_DURATIONS,
  resumeSession,
  snapshot,
} from '../session'

const T0 = '2026-09-04T18:00:00.000Z'
const at = (seconds: number) => Date.parse(T0) + seconds * 1000
const iso = (seconds: number) => new Date(at(seconds)).toISOString()

describe('phase-one timer session', () => {
  it('uses the Concept V2 focus and rest durations', () => {
    expect(createTimerSession('focus', T0).duration_s).toBe(PHASE_ONE_DURATIONS.focus_s)
    expect(createTimerSession('rest', T0).duration_s).toBe(PHASE_ONE_DURATIONS.rest_s)
    expect(PHASE_ONE_DURATIONS.focus_s).toBe(900)
    expect(PHASE_ONE_DURATIONS.rest_s).toBe(300)
  })

  it('derives elapsed and remaining time from timestamps instead of ticks', () => {
    const session = createTimerSession('focus', T0)
    const state = snapshot(session, at(123))

    expect(state.elapsed_ms).toBe(123_000)
    expect(state.remaining_ms).toBe(777_000)
    expect(state.progress).toBeCloseTo(123 / 900)
    expect(state.is_complete).toBe(false)
  })

  it('survives a reload or background jump because now is supplied externally', () => {
    const persisted = createTimerSession('focus', T0)

    expect(snapshot(persisted, at(5)).remaining_ms).toBe(895_000)
    expect(snapshot(persisted, at(605)).remaining_ms).toBe(295_000)
  })

  it('stops exactly at zero and never becomes negative', () => {
    const session = createTimerSession('focus', T0)

    expect(snapshot(session, at(900)).remaining_ms).toBe(0)
    expect(snapshot(session, at(900)).is_complete).toBe(true)
    expect(snapshot(session, at(9_000)).remaining_ms).toBe(0)
    expect(snapshot(session, at(9_000)).progress).toBe(1)
  })

  it('does not count time before the server-side start timestamp', () => {
    const session = createTimerSession('focus', T0)
    expect(elapsedMs(session, at(-30))).toBe(0)
  })

  it('pauses without losing focused time and ignores time spent paused', () => {
    const original = createTimerSession('focus', T0)
    const paused = pauseSession(original, iso(120))

    expect(snapshot(paused, at(120)).elapsed_ms).toBe(120_000)
    expect(snapshot(paused, at(600)).elapsed_ms).toBe(120_000)
    expect(snapshot(paused, at(600)).is_paused).toBe(true)

    const resumed = resumeSession(paused, iso(600))
    expect(snapshot(resumed, at(660)).elapsed_ms).toBe(180_000)
    expect(snapshot(resumed, at(660)).remaining_ms).toBe(720_000)
  })

  it('keeps paused progress stable across reloads', () => {
    const paused = pauseSession(createTimerSession('focus', T0), iso(300))
    const reloaded = JSON.parse(JSON.stringify(paused)) as typeof paused

    expect(snapshot(reloaded, at(3_000)).progress).toBeCloseTo(1 / 3)
    expect(snapshot(reloaded, at(3_000)).remaining_ms).toBe(600_000)
  })

  it('is idempotent when pause or resume is requested twice', () => {
    const session = createTimerSession('focus', T0)
    const paused = pauseSession(session, iso(60))
    expect(pauseSession(paused, iso(90))).toEqual(paused)

    const resumed = resumeSession(paused, iso(120))
    expect(resumeSession(resumed, iso(180))).toEqual(resumed)
  })

  it('formats display time with stable mm:ss digits', () => {
    expect(formatRemaining(900_000)).toBe('15:00')
    expect(formatRemaining(61_000)).toBe('01:01')
    expect(formatRemaining(999)).toBe('00:01')
    expect(formatRemaining(0)).toBe('00:00')
    expect(formatRemaining(-5_000)).toBe('00:00')
  })

  it('rejects malformed timestamps instead of silently inventing local truth', () => {
    expect(() => createTimerSession('focus', 'not-a-date')).toThrow(/Invalid ISO timestamp/)
  })
})
