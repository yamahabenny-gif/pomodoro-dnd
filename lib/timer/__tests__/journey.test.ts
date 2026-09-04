import { describe, expect, it } from 'vitest'
import { journeyProgress, layerOffset, type PhaseLike } from '../journey'

const START = '2026-09-04T10:00:00.000Z'
const T0 = Date.parse(START)
const phase = (over: Partial<PhaseLike> = {}): PhaseLike => ({
  phase_started_at: START,
  phase_duration_s: 3000, // 50 min
  ...over,
})

describe('journeyProgress', () => {
  it('beginnt bei 0 und endet bei 1', () => {
    expect(journeyProgress(phase(), T0)).toBe(0)
    expect(journeyProgress(phase(), T0 + 3000 * 1000)).toBe(1)
  })

  it('läuft linear durch die Mitte', () => {
    expect(journeyProgress(phase(), T0 + 1500 * 1000)).toBeCloseTo(0.5, 10)
  })

  it('läuft nicht über 1 hinaus, wenn der Server den Wechsel noch nicht gemeldet hat', () => {
    // Der wichtigste Fall: Der Timer steht bei 00:00 und wartet auf die Party.
    // Die Gruppe darf dann nicht aus dem Bild wandern.
    expect(journeyProgress(phase(), T0 + 99_999 * 1000)).toBe(1)
  })

  it('geht nicht ins Negative, wenn die Client-Uhr nachgeht', () => {
    expect(journeyProgress(phase(), T0 - 600_000)).toBe(0)
  })

  it('steht still, solange pausiert wird', () => {
    const p = phase({ paused_at: new Date(T0 + 600 * 1000).toISOString() })
    const während = journeyProgress(p, T0 + 600 * 1000)
    const vielSpäter = journeyProgress(p, T0 + 2900 * 1000)
    expect(während).toBeCloseTo(0.2, 10)
    expect(vielSpäter).toBe(während)
  })

  it('ist nach einem Standby sofort richtig, ohne aufzuholen', () => {
    // Kein Zwischenschritt, kein Nachlaufen: derselbe Wert wie bei durchgehendem Lauf.
    const durchgehend = journeyProgress(phase(), T0 + 2400 * 1000)
    const nachStandby = journeyProgress(phase(), T0 + 2400 * 1000)
    expect(nachStandby).toBe(durchgehend)
    expect(durchgehend).toBeCloseTo(0.8, 10)
  })

  it('zeigt einem spät beitretenden Mitglied dieselbe Stelle', () => {
    const alle = journeyProgress(phase(), T0 + 1020 * 1000) // Minute 17
    const neu = journeyProgress(phase(), T0 + 1020 * 1000)
    expect(neu).toBe(alle)
  })

  it('bleibt bei kaputten Eingaben in Grenzen, statt NaN zu liefern', () => {
    expect(journeyProgress(phase({ phase_started_at: 'kaputt' }), T0)).toBe(0)
    expect(journeyProgress(phase({ phase_duration_s: 0 }), T0)).toBe(1)
    expect(journeyProgress(phase({ phase_duration_s: -5 }), T0)).toBe(1)
    expect(journeyProgress(phase({ paused_at: 'kaputt' }), T0 + 750_000)).toBeCloseTo(0.25, 10)
  })
})

describe('layerOffset', () => {
  it('bewegt tiefe Ebenen langsamer als nahe', () => {
    const horizont = layerOffset(0.5, 1200, 0.2)
    const weg = layerOffset(0.5, 1200, 1)
    expect(Math.abs(horizont)).toBeLessThan(Math.abs(weg))
  })

  it('startet bei 0 und läuft nur in eine Richtung', () => {
    expect(layerOffset(0, 1200, 1)).toBe(0)
    expect(layerOffset(1, 1200, 1)).toBe(-1200)
  })

  it('bleibt in Grenzen, auch wenn der Fortschritt überläuft', () => {
    expect(layerOffset(5, 1200, 1)).toBe(-1200)
    expect(layerOffset(-5, 1200, 1)).toBe(0)
  })
})
