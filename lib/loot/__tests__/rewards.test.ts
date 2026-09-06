/**
 * Deckt die im Issue #15 genannten Fälle exakt ab: 15/25/50-Minuten-Quests
 * ergeben 3/5/10 Gold, XP ist 1:1 zu den tatsächlich fokussierten Minuten.
 */
import { describe, expect, it } from 'vitest'
import { questCompletionGold, questCompletionXp } from '../rewards'

describe('questCompletionXp', () => {
  it('gibt 1 XP pro tatsächlich fokussierter Minute', () => {
    expect(questCompletionXp(15)).toBe(15)
    expect(questCompletionXp(25)).toBe(25)
    expect(questCompletionXp(50)).toBe(50)
    expect(questCompletionXp(1)).toBe(1)
  })

  it('kennt keine Boni oder Multiplikatoren', () => {
    // Keine Klassen-Passive, keine XP-Multiplikatoren (#15) — die Formel ist
    // strikt linear, unabhängig von Länge oder Häufigkeit.
    expect(questCompletionXp(10)).toBe(10)
    expect(questCompletionXp(100)).toBe(100)
  })

  it('gibt bei nicht-positiven Minuten 0 XP', () => {
    expect(questCompletionXp(0)).toBe(0)
    expect(questCompletionXp(-5)).toBe(0)
  })
})

describe('questCompletionGold', () => {
  it('ergibt für 15/25/50-Minuten-Quests 3/5/10 Gold — die Fälle aus #15', () => {
    expect(questCompletionGold(15)).toBe(3)
    expect(questCompletionGold(25)).toBe(5)
    expect(questCompletionGold(50)).toBe(10)
  })

  it('rundet ab, statt aufzurunden', () => {
    // 1 Gold pro 5 erfolgreich abgeschlossenen Fokusminuten (ADR-030) — angebrochene
    // Fünf-Minuten-Blöcke geben kein anteiliges Gold.
    expect(questCompletionGold(19)).toBe(3)
    expect(questCompletionGold(4)).toBe(0)
  })

  it('gibt bei nicht-positiver Dauer 0 Gold', () => {
    expect(questCompletionGold(0)).toBe(0)
    expect(questCompletionGold(-10)).toBe(0)
  })
})
