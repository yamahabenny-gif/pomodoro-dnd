import { describe, expect, it } from 'vitest'
import {
  MIN_POOL_SIZE, RARITIES, RARITY_CHANCE,
  drawLoot, drawsRemaining, setCompletedBy,
  type CatalogueItem, type Category, type Rarity,
} from '../draw'

const cat = (
  id: string, category: Category, rarity: Rarity, set?: string,
): CatalogueItem => ({ id, category, rarity, name: id, ...(set ? { set } : {}) })

const catalogue: CatalogueItem[] = [
  ...Array.from({ length: 5 }, (_, i) => cat(`c-gew-${i}`, 'charakter', 'gewoehnlich')),
  ...Array.from({ length: 3 }, (_, i) => cat(`c-sel-${i}`, 'charakter', 'selten')),
  ...Array.from({ length: 2 }, (_, i) => cat(`c-epi-${i}`, 'charakter', 'episch')),
  cat('c-leg-0', 'charakter', 'legendaer'),
  ...Array.from({ length: 4 }, (_, i) => cat(`l-gew-${i}`, 'lager', 'gewoehnlich')),
  cat('set-a', 'lager', 'selten', 'wachfeuer'),
  cat('set-b', 'lager', 'selten', 'wachfeuer'),
  cat('set-c', 'lager', 'selten', 'wachfeuer'),
]

describe('Seltenheiten', () => {
  it('hat vier Stufen nach Konzept V1 §10', () => {
    expect(RARITIES).toHaveLength(4)
  })

  it('summiert die Wahrscheinlichkeiten auf 1', () => {
    const sum = RARITIES.reduce((s, r) => s + RARITY_CHANCE[r], 0)
    expect(sum).toBeCloseTo(1, 10)
  })

  it('macht seltenere Stufen auch seltener', () => {
    for (let i = 1; i < RARITIES.length; i++) {
      expect(RARITY_CHANCE[RARITIES[i]!]).toBeLessThan(RARITY_CHANCE[RARITIES[i - 1]!])
    }
  })
})

describe('drawLoot — die zentrale Regel: keine Duplikate', () => {
  it('gibt niemals etwas heraus, das schon besessen wird', () => {
    const owned = new Set<string>()
    for (let i = 0; i < 200; i++) {
      const d = drawLoot(catalogue, owned, 'gewoehnlich', 'charakter', `s${i}`)
      if (d.item) {
        expect(owned.has(d.item.id)).toBe(false)
        owned.add(d.item.id)
      }
    }
  })

  it('leert einen Topf vollständig, bevor er aufgibt', () => {
    const owned = new Set<string>()
    const got: string[] = []
    for (let i = 0; i < 50; i++) {
      const d = drawLoot(catalogue, owned, 'gewoehnlich', 'lager', `s${i}`)
      if (d.item) { got.push(d.item.id); owned.add(d.item.id) }
    }
    expect(new Set(got).size).toBe(4) // alle vier Lager-Gegenstände, keiner doppelt
  })

  it('weicht bei leerem Topf nach unten aus, nicht nach oben', () => {
    // Beide epischen Charakter-Gegenstände sind weg.
    const owned = new Set(['c-epi-0', 'c-epi-1'])
    const d = drawLoot(catalogue, owned, 'episch', 'charakter', 'seed')
    expect(d.item).not.toBeNull()
    expect(d.item!.rarity).toBe('selten')
    expect(d.item!.rarity).not.toBe('legendaer')
  })

  it('gibt Gold statt eines Duplikats, wenn alles leer ist', () => {
    const owned = new Set(catalogue.map((c) => c.id))
    const d = drawLoot(catalogue, owned, 'legendaer', 'charakter', 'seed')
    expect(d.item).toBeNull()
    expect(d.goldInstead).toBeGreaterThan(0)
  })

  it('gibt allen Party-Mitgliedern dieselbe Party-Truhe', () => {
    const owned = new Set<string>()
    const a = drawLoot(catalogue, owned, 'selten', 'charakter', 'H26HE:2026-09-04T10:00Z')
    const b = drawLoot(catalogue, owned, 'selten', 'charakter', 'H26HE:2026-09-04T10:00Z')
    expect(a.item?.id).toBe(b.item?.id)
  })

  it('bleibt in der verlangten Kategorie', () => {
    const owned = new Set<string>()
    for (let i = 0; i < 100; i++) {
      const d = drawLoot(catalogue, owned, 'gewoehnlich', 'lager', `s${i}`)
      if (d.item) { expect(d.item.category).toBe('lager'); owned.add(d.item.id) }
    }
  })
})

describe('Sammlungssets', () => {
  it('meldet das Set genau beim letzten fehlenden Stück', () => {
    const zwei = new Set(['set-a', 'set-b'])
    const letzte = catalogue.find((c) => c.id === 'set-c')!
    expect(setCompletedBy(catalogue, zwei, letzte)).toBe('wachfeuer')
  })

  it('meldet nichts, solange noch etwas fehlt', () => {
    const eins = new Set(['set-a'])
    const zweite = catalogue.find((c) => c.id === 'set-b')!
    expect(setCompletedBy(catalogue, eins, zweite)).toBeUndefined()
  })

  it('meldet nichts für Gegenstände ohne Set', () => {
    const ohne = catalogue.find((c) => c.id === 'c-gew-0')!
    expect(setCompletedBy(catalogue, new Set(), ohne)).toBeUndefined()
  })

  it('meldet die Vervollständigung auch aus einer echten Ziehung heraus', () => {
    const owned = new Set(['set-a', 'set-b'])
    const d = drawLoot(catalogue, owned, 'selten', 'lager', 'seed')
    expect(d.item?.id).toBe('set-c')
    expect(d.completedSet).toBe('wachfeuer')
  })
})

describe('Reichweite der Töpfe', () => {
  it('zählt, wie viele Ziehungen ein Topf noch hergibt', () => {
    expect(drawsRemaining(catalogue, new Set(), 'gewoehnlich', 'charakter')).toBe(5)
    expect(drawsRemaining(catalogue, new Set(['c-gew-0']), 'gewoehnlich', 'charakter')).toBe(4)
  })

  it('benennt Mindestgrößen für alle vier Stufen', () => {
    // Konzept V1 verlangt „keine Duplikate", sagt aber nicht, wie groß die Töpfe
    // sein müssen. Ohne diese Zahlen greift die Regel nach zwei Wochen ins Leere.
    for (const r of RARITIES) expect(MIN_POOL_SIZE[r]).toBeGreaterThanOrEqual(12)
  })

  it('reicht bei acht Quests am Tag über einen Monat', () => {
    // Acht Quests täglich, 60 % davon gewöhnlich → rund 4,8 Ziehungen pro Tag
    // aus vier Kategorien, also rund 1,2 je Kategorie und Tag.
    const proTagUndKategorie = (8 * RARITY_CHANCE.gewoehnlich) / 4
    const tage = MIN_POOL_SIZE.gewoehnlich / proTagUndKategorie
    expect(tage).toBeGreaterThan(30)
  })
})
