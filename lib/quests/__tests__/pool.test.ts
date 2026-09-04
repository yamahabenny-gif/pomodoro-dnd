/**
 * Der Questpool ist Inhalt, und Inhalt verrutscht. Diese Tests halten ihn fest,
 * damit ein Beitrag mit einer vergessenen Zeile nicht unbemerkt durchgeht.
 */
import { describe, expect, it } from 'vitest'
import quests from '../../../content/quests.de.json'
import regions from '../../../content/regions.de.json'
import {
  BEATS_PER_LENGTH, BOOK_COMPOSITION, LENGTH_LABEL, MINUTES_PER_LENGTH,
  assembleBook, beatIndexAt, pickQuest, type Quest, type QuestLength,
} from '../schema'

const LENGTHS: QuestLength[] = ['kundschaft', 'kurz', 'mittel', 'episch']

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

  it('bietet zu jeder geschriebenen Länge genug Auswahl', () => {
    // `episch` ist noch nicht geschrieben — siehe Issue #32.
    for (const len of ['kundschaft', 'kurz', 'mittel'] as const) {
      expect(pool.filter((q) => q.length === len).length).toBeGreaterThanOrEqual(10)
    }
  })

  it('kennt nur die vier definierten Längen', () => {
    for (const q of pool) expect(LENGTHS).toContain(q.length)
  })

  it('gibt jeder Region mindestens acht Quests', () => {
    const count = new Map<string, number>()
    for (const q of pool) count.set(q.region, (count.get(q.region) ?? 0) + 1)
    for (const [, n] of count) expect(n).toBeGreaterThanOrEqual(8)
  })
})

describe('Längen', () => {
  it('gibt jeder Stufe Minuten und einen Anzeigenamen', () => {
    for (const len of LENGTHS) {
      expect(MINUTES_PER_LENGTH[len]).toBeGreaterThan(0)
      expect(LENGTH_LABEL[len].length).toBeGreaterThan(0)
    }
  })

  it('steigt in Minuten und Wegabschnitten gleichsinnig an', () => {
    for (let i = 1; i < LENGTHS.length; i++) {
      expect(MINUTES_PER_LENGTH[LENGTHS[i]!]).toBeGreaterThan(MINUTES_PER_LENGTH[LENGTHS[i - 1]!])
      expect(BEATS_PER_LENGTH[LENGTHS[i]!]).toBeGreaterThan(BEATS_PER_LENGTH[LENGTHS[i - 1]!])
    }
  })

  it('bietet einen Einstieg unter 25 Minuten', () => {
    // Konzept V1 §1 adressiert Menschen, die lange Fokusblöcke nicht schaffen.
    // Wäre 25 die kürzeste Stufe, wäre der Einstieg der erste Misserfolg.
    expect(Math.min(...LENGTHS.map((l) => MINUTES_PER_LENGTH[l]))).toBeLessThanOrEqual(15)
  })

  it('nennt nirgends eine Technik statt eines Abenteuers', () => {
    for (const len of LENGTHS) {
      expect(LENGTH_LABEL[len].toLowerCase()).not.toContain('pomodoro')
      expect(LENGTH_LABEL[len]).not.toMatch(/\d/)
    }
  })
})

describe('Abenteuerbuch', () => {
  const week = '2026-W36'

  it('stellt zehn Quests zusammen, sobald alle Stufen geschrieben sind', () => {
    const soll = Object.values(BOOK_COMPOSITION).reduce((a, b) => a + b, 0)
    expect(soll).toBe(10)
  })

  it('zeigt dieselbe Woche allen gleich', () => {
    const a = assembleBook(pool, { week }).map((q) => q.id)
    const b = assembleBook(pool, { week }).map((q) => q.id)
    expect(a).toEqual(b)
  })

  it('mischt zur nächsten Woche neu', () => {
    const a = assembleBook(pool, { week: '2026-W36' }).map((q) => q.id)
    const b = assembleBook(pool, { week: '2026-W37' }).map((q) => q.id)
    expect(a).not.toEqual(b)
  })

  it('führt keine Quest doppelt', () => {
    const ids = assembleBook(pool, { week }).map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('läuft nie leer — das Buch füllt nach', () => {
    // Der Fall, den Konzept V1 offenlässt: jemand arbeitet die Woche in zwei Tagen ab.
    const completed: string[] = []
    for (let runde = 0; runde < 40; runde++) {
      const book = assembleBook(pool, { week, completed })
      expect(book.length).toBeGreaterThan(0)
      for (const q of book) if (!completed.includes(q.id)) completed.push(q.id)
    }
    expect(completed.length).toBeGreaterThan(30)
  })

  it('zeigt nichts erneut, was in dieser Woche schon geschafft wurde', () => {
    const completed = assembleBook(pool, { week }).map((q) => q.id)
    const zweites = assembleBook(pool, { week, completed })
    for (const q of zweites) expect(completed).not.toContain(q.id)
  })

  it('hält die vorgesehene Mischung ein, solange der Pool reicht', () => {
    const book = assembleBook(pool, { week })
    for (const len of ['kundschaft', 'kurz', 'mittel'] as const) {
      expect(book.filter((q) => q.length === len)).toHaveLength(BOOK_COMPOSITION[len])
    }
  })
})

describe('beatIndexAt', () => {
  const q = pool.find((x) => x.length === 'mittel')!

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
    const a = pickQuest(pool, 'kurz', 'H26HE:2026-09-04T10:00:00Z')
    const b = pickQuest(pool, 'kurz', 'H26HE:2026-09-04T10:00:00Z')
    expect(a.id).toBe(b.id)
  })

  it('wählt nur Quests der verlangten Länge', () => {
    for (let i = 0; i < 200; i++) {
      expect(pickQuest(pool, 'kundschaft', `seed-${i}`).length).toBe('kundschaft')
    }
  })

  it('wiederholt nichts, solange der Pool noch frisch ist', () => {
    const seen: string[] = []
    for (let i = 0; i < 10; i++) {
      const q = pickQuest(pool, 'mittel', `seed-${i}`, seen)
      expect(seen).not.toContain(q.id)
      seen.push(q.id)
    }
  })

  it('fängt von vorn an, statt aufzugeben, wenn alles gespielt ist', () => {
    const all = pool.filter((q) => q.length === 'mittel').map((q) => q.id)
    expect(() => pickQuest(pool, 'mittel', 'seed', all)).not.toThrow()
  })
})
