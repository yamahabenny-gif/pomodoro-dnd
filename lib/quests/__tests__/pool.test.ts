/**
 * Der Questpool ist Inhalt, und Inhalt verrutscht. Diese Tests halten ihn fest,
 * damit ein Beitrag mit einer vergessenen Zeile nicht unbemerkt durchgeht.
 */
import { describe, expect, it } from 'vitest'
import quests from '../../../content/quests.de.json'
import regions from '../../../content/regions.de.json'
import { BEATS_PER_LENGTH, beatIndexAt, pickQuest, type Quest } from '../schema'

const pool = quests as Quest[]

describe('Questpool', () => {
  it('enthält mindestens 100 Quests', () => {
    expect(pool.length).toBeGreaterThanOrEqual(100)
  })

  it('hat eindeutige Kennungen und Titel', () => {
    expect(new Set(pool.map((q) => q.id)).size).toBe(pool.length)
    expect(new Set(pool.map((q) => q.title)).size).toBe(pool.length)
  })

  it('kennt nur Regionen, die es gibt', () => {
    const known = Object.keys(regions)
    for (const q of pool) expect(known).toContain(q.region)
  })

  it('hat je Länge die richtige Zahl an Wegabschnitten', () => {
    for (const q of pool) expect(q.beats).toHaveLength(BEATS_PER_LENGTH[q.length])
  })

  it('hält Wegabschnitte kurz genug für eine Zeile', () => {
    for (const q of pool) {
      for (const b of q.beats) expect(b.length).toBeLessThanOrEqual(78)
    }
  })

  it('bietet zu jeder Länge genug Auswahl für einen Tag ohne Wiederholung', () => {
    for (const len of ['short', 'standard', 'long'] as const) {
      expect(pool.filter((q) => q.length === len).length).toBeGreaterThanOrEqual(10)
    }
  })

  it('gibt jeder Region mindestens acht Quests', () => {
    const count = new Map<string, number>()
    for (const q of pool) count.set(q.region, (count.get(q.region) ?? 0) + 1)
    for (const [, n] of count) expect(n).toBeGreaterThanOrEqual(8)
  })
})

describe('beatIndexAt', () => {
  const q = pool.find((x) => x.length === 'long')!

  it('beginnt beim ersten und endet beim letzten Abschnitt', () => {
    expect(beatIndexAt(q, 0)).toBe(0)
    expect(beatIndexAt(q, 1)).toBe(q.beats.length - 1)
  })

  it('läuft nie über den Pool hinaus, auch nicht bei Zeitsprüngen', () => {
    for (const p of [-5, -0.001, 0.5, 0.9999, 1, 2, 1e6]) {
      const i = beatIndexAt(q, p)
      expect(i).toBeGreaterThanOrEqual(0)
      expect(i).toBeLessThan(q.beats.length)
    }
  })

  it('schreitet monoton voran', () => {
    let last = -1
    for (let p = 0; p <= 1; p += 0.01) {
      const i = beatIndexAt(q, p)
      expect(i).toBeGreaterThanOrEqual(last)
      last = i
    }
  })
})

describe('pickQuest', () => {
  it('gibt allen Party-Mitgliedern dieselbe Quest', () => {
    const a = pickQuest(pool, 'standard', 'H26HE:2026-09-04T10:00:00Z')
    const b = pickQuest(pool, 'standard', 'H26HE:2026-09-04T10:00:00Z')
    expect(a.id).toBe(b.id)
  })

  it('wählt nur Quests der verlangten Länge', () => {
    for (let i = 0; i < 200; i++) {
      expect(pickQuest(pool, 'short', `seed-${i}`).length).toBe('short')
    }
  })

  it('wiederholt nichts, solange der Pool noch frisch ist', () => {
    const seen: string[] = []
    for (let i = 0; i < 10; i++) {
      const q = pickQuest(pool, 'long', `seed-${i}`, seen)
      expect(seen).not.toContain(q.id)
      seen.push(q.id)
    }
  })

  it('fängt von vorn an, statt aufzugeben, wenn alles gespielt ist', () => {
    const all = pool.filter((q) => q.length === 'long').map((q) => q.id)
    expect(() => pickQuest(pool, 'long', 'seed', all)).not.toThrow()
  })
})
