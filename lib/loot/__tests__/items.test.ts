import { describe, expect, it } from 'vitest'
import {
  BASES, EMBLEMS, ITEM_SPACE, MATERIALS,
  itemFromId, itemName, type Rarity,
} from '../items'
import { MATERIAL_PALETTE } from '../palette'

const RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary']

describe('Item-Baukasten', () => {
  it('ergibt 576 Gegenstände aus 26 Teilen', () => {
    expect(BASES.length + MATERIALS.length + EMBLEMS.length).toBe(26)
    expect(ITEM_SPACE).toBe(576)
  })

  it('liefert für dieselbe Kennung immer denselben Gegenstand', () => {
    for (const r of RARITIES) {
      const a = itemFromId('quest-4711', r)
      const b = itemFromId('quest-4711', r)
      expect(a).toEqual(b)
    }
  })

  it('gibt jedem Material eine vollständige Palette', () => {
    for (const m of MATERIALS) {
      const p = MATERIAL_PALETTE[m]
      for (const tone of [p.dark, p.body, p.light]) {
        expect(tone).toMatch(/^#[0-9A-F]{6}$/i)
      }
    }
  })

  it('macht Seltenheit am Material erkennbar, nicht nur am Etikett', () => {
    // Eine legendäre Eisenklinge sähe aus wie der Wachsstummel daneben.
    const legendary = new Set(
      Array.from({ length: 400 }, (_, i) => itemFromId(`x${i}`, 'legendary').material),
    )
    const common = new Set(
      Array.from({ length: 400 }, (_, i) => itemFromId(`x${i}`, 'common').material),
    )
    for (const m of legendary) expect(common.has(m)).toBe(false)
  })

  it('nutzt bei genug Ziehungen den ganzen Formvorrat', () => {
    const bases = new Set(
      Array.from({ length: 3000 }, (_, i) => itemFromId(`item-${i}`, 'rare').base),
    )
    expect(bases.size).toBe(BASES.length)
  })

  it('bildet lesbare deutsche Namen', () => {
    expect(itemName('laterne', 'mondstein', 'schwinge')).toBe('Mondsteinlaterne der Schwinge')
    expect(itemName('klinge', 'glut', 'riss')).toBe('Glutklinge des Risses')
    expect(itemName('schluessel', 'eisen', 'auge')).toBe('Eisenschlüssel des Auges')
  })

  it('erzeugt keinen Namen mit Umlaut-Panne oder doppeltem Leerzeichen', () => {
    for (const b of BASES) for (const m of MATERIALS) for (const e of EMBLEMS) {
      const n = itemName(b, m, e)
      expect(n).not.toMatch(/ {2}/)
      expect(n).not.toMatch(/ae|oe|ue/)
      expect(n[0]).toBe(n[0]?.toUpperCase())
    }
  })

  it('verteilt sich einigermaßen gleichmäßig über die Formen', () => {
    const counts = new Map<string, number>()
    const n = 12_000
    for (let i = 0; i < n; i++) {
      const b = itemFromId(`s${i}`, 'epic').base
      counts.set(b, (counts.get(b) ?? 0) + 1)
    }
    const expected = n / BASES.length
    for (const [, c] of counts) {
      expect(c).toBeGreaterThan(expected * 0.6)
      expect(c).toBeLessThan(expected * 1.4)
    }
  })
})
