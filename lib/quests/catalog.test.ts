import { describe, expect, it } from 'vitest'
import { getQuestByKey, QUEST_CATALOG } from './catalog'

describe('QUEST_CATALOG', () => {
  it('contains exactly two quests for each supported duration', () => {
    expect(QUEST_CATALOG).toHaveLength(6)
    expect(QUEST_CATALOG.filter((quest) => quest.durationMinutes === 15)).toHaveLength(2)
    expect(QUEST_CATALOG.filter((quest) => quest.durationMinutes === 25)).toHaveLength(2)
    expect(QUEST_CATALOG.filter((quest) => quest.durationMinutes === 50)).toHaveLength(2)
  })

  it('keeps stable unique keys and the phase-1 quest', () => {
    expect(new Set(QUEST_CATALOG.map((quest) => quest.key)).size).toBe(6)
    expect(getQuestByKey('ein-licht-im-unterholz')?.durationMinutes).toBe(15)
  })

  it('keeps all catalog data required by the adventure book and journey', () => {
    for (const quest of QUEST_CATALOG) {
      expect(quest.title.length).toBeGreaterThan(0)
      expect(quest.assignment[0].length).toBeGreaterThan(0)
      expect(quest.region.length).toBeGreaterThan(0)
      expect(quest.location.length).toBeGreaterThan(0)
      expect(quest.journeyRef).toBe('unterholz')
      expect(quest.href.startsWith('/quest/')).toBe(true)
    }
  })
})
