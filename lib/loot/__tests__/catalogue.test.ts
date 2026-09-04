/**
 * Der Katalog ist Inhalt, und die Keine-Duplikate-Regel steht und fällt mit ihm.
 * Läuft ein Topf leer, greift die Regel ins Leere — deshalb sind die Mindestgrößen
 * hier festgeschrieben und nicht bloß angenommen.
 */
import { describe, expect, it } from 'vitest'
import catalogue from '../../../content/items.de.json'
import {
  MIN_POOL_SIZE, RARITIES, RARITY_CHANCE, drawLoot, drawsRemaining,
  type CatalogueItem, type Category, type Rarity,
} from '../draw'

const items = catalogue as CatalogueItem[]
const CATEGORIES: Category[] = ['charakter', 'lager', 'begleiter', 'atmosphaere']

describe('Item-Katalog', () => {
  it('füllt alle sechzehn Töpfe', () => {
    for (const c of CATEGORIES) {
      for (const r of RARITIES) {
        expect(drawsRemaining(items, new Set(), r, c), `${c}/${r}`).toBeGreaterThan(0)
      }
    }
  })

  it('hält die Mindestgröße in jedem Topf ein', () => {
    for (const c of CATEGORIES) {
      for (const r of RARITIES) {
        expect(drawsRemaining(items, new Set(), r, c), `${c}/${r}`)
          .toBeGreaterThanOrEqual(MIN_POOL_SIZE[r])
      }
    }
  })

  it('hat eindeutige Kennungen und Namen', () => {
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length)
    expect(new Set(items.map((i) => i.name)).size).toBe(items.length)
  })

  it('kennt nur die vier Kategorien und vier Stufen', () => {
    for (const i of items) {
      expect(CATEGORIES).toContain(i.category)
      expect(RARITIES).toContain(i.rarity)
    }
  })

  it('schreibt Namen ohne doppelte Leerzeichen und Umlaut-Pannen', () => {
    for (const i of items) {
      expect(i.name).not.toMatch(/ {2}/)
      expect(i.name).not.toMatch(/^\s|\s$/)
      expect(i.name[0]).toBe(i.name[0]?.toUpperCase())
    }
  })

  it('hält jedes Set vollständig im Katalog', () => {
    const sets = new Map<string, number>()
    for (const i of items) if (i.set) sets.set(i.set, (sets.get(i.set) ?? 0) + 1)
    expect(sets.size).toBeGreaterThan(0)
    for (const [name, n] of sets) expect(n, `Set ${name}`).toBeGreaterThanOrEqual(3)
  })

  it('hält Sets innerhalb einer sinnvollen Größe', () => {
    const sets = new Map<string, number>()
    for (const i of items) if (i.set) sets.set(i.set, (sets.get(i.set) ?? 0) + 1)
    for (const [name, n] of sets) expect(n, `Set ${name}`).toBeLessThanOrEqual(5)
  })
})

describe('Reichweite unter echter Nutzung', () => {
  it('hält bei acht Quests am Tag über einen Monat ohne Duplikat durch', () => {
    const owned = new Set<string>()
    let goldStattItem = 0
    // 30 Tage × 8 Quests, Kategorie rotiert, Seltenheit nach den Wahrscheinlichkeiten
    for (let tag = 0; tag < 30; tag++) {
      for (let q = 0; q < 8; q++) {
        const n = tag * 8 + q
        const cat = CATEGORIES[n % CATEGORIES.length]!
        const roll = ((n * 37) % 100) / 100
        let acc = 0
        let rar: Rarity = 'gewoehnlich'
        for (const r of RARITIES) { acc += RARITY_CHANCE[r]; if (roll < acc) { rar = r; break } }

        const d = drawLoot(items, owned, rar, cat, `tag${tag}-q${q}`)
        if (d.item) {
          expect(owned.has(d.item.id)).toBe(false)
          owned.add(d.item.id)
        } else {
          goldStattItem++
        }
      }
    }
    // Kein einziges Duplikat in 240 Truhen — das ist die Regel aus Konzept V1 §10.
    expect(goldStattItem).toBe(0)
    expect(owned.size).toBe(240)
  })

  it('gibt nie ein Duplikat aus, auch wenn fast alles gesammelt ist', () => {
    const alleBisAufEins = new Set(items.slice(1).map((i) => i.id))
    const übrig = items[0]!
    const d = drawLoot(items, alleBisAufEins, übrig.rarity, übrig.category, 'seed')
    if (d.item) expect(d.item.id).toBe(übrig.id)
    else expect(d.goldInstead).toBeGreaterThan(0)
  })
})
