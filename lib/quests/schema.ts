/**
 * Der Questpool. Reine Daten und reine Funktionen — kein React, keine Uhr.
 *
 * Ein Wegabschnitt (Beat) wird nicht gespeichert, sondern aus dem Fortschritt
 * berechnet. Genau wie die Restzeit selbst: Damit ist die Wanderung nach einem
 * Hintergrund-Tab, nach Standby und für ein spät beitretendes Party-Mitglied
 * automatisch korrekt, ohne eine Zeile Synchronisationscode.
 * Siehe docs/MOTION-ENGINE.md.
 */

export type QuestLength = 'short' | 'standard' | 'long'

export interface Quest {
  id: string
  title: string
  region: string
  length: QuestLength
  beats: string[]
}

export interface Region {
  name: string
  blurb: string
  /** Drei Töne für die Kulissen-Ebenen: Horizont, Mittelgrund, Weg. */
  palette: [string, string, string]
}

/** Wie viele Wegabschnitte eine Quest je Länge hat. In Tests erzwungen. */
export const BEATS_PER_LENGTH: Record<QuestLength, number> = {
  short: 3,
  standard: 4,
  long: 5,
}

/** Welche Quest-Länge zu einem Klassenprofil passt. */
export function lengthForMinutes(workMinutes: number): QuestLength {
  if (workMinutes <= 20) return 'short'
  if (workMinutes <= 35) return 'standard'
  return 'long'
}

/**
 * Welcher Wegabschnitt bei diesem Fortschritt sichtbar ist.
 * `progress` liegt zwischen 0 und 1 und kommt aus journeyProgress().
 */
export function beatIndexAt(quest: Quest, progress: number): number {
  const p = Math.min(0.999999, Math.max(0, progress))
  return Math.floor(p * quest.beats.length)
}

/**
 * Wählt eine Quest deterministisch aus Party-Code und Zyklus-Zeitstempel.
 *
 * Deterministisch, damit alle Party-Mitglieder dieselbe Quest sehen, ohne dass sie
 * jemand verteilen muss — dieselbe Idee wie beim Timer. `recent` schließt zuletzt
 * gespielte Quests aus, damit sich in einem Durchlauf nichts wiederholt.
 */
export function pickQuest(
  pool: Quest[],
  length: QuestLength,
  seed: string,
  recent: string[] = [],
): Quest {
  const candidates = pool.filter((q) => q.length === length)
  if (candidates.length === 0) throw new Error(`Keine Quest der Länge ${length} im Pool`)

  const fresh = candidates.filter((q) => !recent.includes(q.id))
  // Sind alle durch, fängt der Pool von vorn an — aber erst dann.
  const from = fresh.length > 0 ? fresh : candidates

  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  const picked = from[h % from.length]
  if (picked === undefined) throw new Error('Questpool ist leer')
  return picked
}
