/**
 * Der Questpool. Reine Daten und reine Funktionen — kein React, keine Uhr.
 *
 * Ein Wegabschnitt (Beat) wird nicht gespeichert, sondern aus dem Fortschritt
 * berechnet. Genau wie die Restzeit selbst: Damit ist die Wanderung nach einem
 * Hintergrund-Tab, nach Standby und für ein spät beitretendes Party-Mitglied
 * automatisch korrekt, ohne eine Zeile Synchronisationscode.
 * Siehe docs/MOTION-ENGINE.md.
 */

/**
 * Vier Stufen. Die Dauer hängt an der **Quest**, nicht am Charakter — der Charakter
 * ist Identität und levelt, mehr nicht (Entscheidung zu K1, Issue #27).
 *
 * `kundschaft` gibt es, weil Konzept V1 §1 ausdrücklich Menschen adressiert, die
 * Schwierigkeiten haben, lange fokussiert zu bleiben — und §6 als kürzeste Stufe
 * 25 Minuten anbot. Für einen Teil dieser Zielgruppe wäre das der erste Misserfolg
 * gewesen (W3, Issue #30).
 */
export type QuestLength = 'kundschaft' | 'kurz' | 'mittel' | 'episch'

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
  kundschaft: 3,
  kurz: 4,
  mittel: 5,
  episch: 6,
}

/**
 * Fokusminuten **je Abschnitt**. Bei allen Stufen außer `episch` ist das zugleich die
 * ganze Quest.
 */
export const MINUTES_PER_LENGTH: Record<QuestLength, number> = {
  kundschaft: 15,
  kurz: 25,
  mittel: 50,
  episch: 25,
}

/**
 * Aus wie vielen Fokusabschnitten eine Quest besteht.
 *
 * Die epische Quest ist ein **Bogen aus drei Abschnitten** mit Rasten dazwischen, nicht
 * ein Block von 90 Minuten (Entscheidung zu K11, Issue #32). Neunzig Minuten ohne
 * Unterbrechung widersprechen dem Grundsatz, auf dem die Methode beruht — und träfen
 * ausgerechnet die Zielgruppe, die Schwierigkeiten hat, lange fokussiert zu bleiben.
 *
 * Erzählt wird trotzdem **eine** Quest: Der Bosskampf ist der dritte Abschnitt, und die
 * Rasten dazwischen sind Teil der Geschichte („die Gruppe sammelt sich vor dem Tor").
 */
export const SEGMENTS_PER_LENGTH: Record<QuestLength, number> = {
  kundschaft: 1,
  kurz: 1,
  mittel: 1,
  episch: 3,
}

/** Gesamte Fokuszeit einer Quest, über alle Abschnitte. */
export function totalFocusMinutes(length: QuestLength): number {
  return MINUTES_PER_LENGTH[length] * SEGMENTS_PER_LENGTH[length]
}

/** Anzeigename für die Oberfläche. Nie „25-Minuten-Pomodoro" (Konzept V1 §6). */
export const LENGTH_LABEL: Record<QuestLength, string> = {
  kundschaft: 'Kundschaftergang',
  kurz: 'Kurze Quest',
  mittel: 'Mittlere Quest',
  episch: 'Epische Quest',
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
 * Fortschritt über den **ganzen Bogen**, nicht nur den laufenden Abschnitt.
 *
 * Bei einer epischen Quest wandert die Gruppe über drei Fokusabschnitte hinweg weiter.
 * Ohne das würde die Kulisse bei jeder Rast an den Anfang zurückspringen — und der
 * Bosskampf begänne dort, wo der erste Abschnitt begann.
 *
 * `segment` ist zerobasiert; `segmentProgress` kommt aus journeyProgress().
 */
export function arcProgress(
  length: QuestLength,
  segment: number,
  segmentProgress: number,
): number {
  const total = SEGMENTS_PER_LENGTH[length]
  const done = Math.min(Math.max(segment, 0), total - 1)
  const within = Math.min(Math.max(segmentProgress, 0), 1)
  return (done + within) / total
}

/**
 * Welche Wegabschnitte in diesem Fokusabschnitt erzählt werden.
 *
 * Sechs Abschnitte auf drei Segmente: zwei je Segment. Der Bosskampf sind die letzten
 * beiden.
 */
export function beatsForSegment(quest: Quest, segment: number): string[] {
  const total = SEGMENTS_PER_LENGTH[quest.length]
  const perSegment = Math.ceil(quest.beats.length / total)
  const from = Math.min(Math.max(segment, 0), total - 1) * perSegment
  return quest.beats.slice(from, from + perSegment)
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

/* ------------------------------------------------------------------ *
 * Das Abenteuerbuch — der Wochenpool
 * ------------------------------------------------------------------ */

/**
 * Wie viele Quests je Stufe im Abenteuerbuch stehen.
 *
 * Konzept V1 §5 nennt 4 kurz / 4 mittel / 2 episch. Mit der vierten Stufe aus W3
 * wird daraus die Aufteilung unten — die Gesamtzahl von zehn bleibt, weil eine
 * überschaubare Auswahl für die Zielgruppe der Punkt der ganzen Mechanik ist.
 */
export const BOOK_COMPOSITION: Record<QuestLength, number> = {
  kundschaft: 2,
  kurz: 4,
  mittel: 3,
  episch: 1,
}

export interface BookOptions {
  /** Kennung der Woche, z. B. "2026-W36". Bestimmt die Auswahl. */
  week: string
  /** Bereits in dieser Woche abgeschlossene Quests. */
  completed?: readonly string[]
  /** Länger zurückliegende Quests, die nicht sofort wiederkommen sollen. */
  recent?: readonly string[]
}

/**
 * Stellt das Abenteuerbuch zusammen.
 *
 * **Das Buch läuft nie leer.** Konzept V1 §5 sagt, was passiert, wenn jemand nicht
 * alle zehn schafft — nicht, was passiert, wenn er sie aufbraucht. Bei sechs Quests
 * am Tag wäre die Woche nach zwei Tagen vorbei. Abgeschlossene Quests werden deshalb
 * ersetzt, nicht gestrichen (W2, Issue #30).
 *
 * Und es gibt keinen Ablauf: Der Wochenwechsel mischt neu, er nimmt nichts weg.
 * Was fehlt, ist eine Frist — genau die erzeugt die Sorge, die V1 §14 ausschließt.
 */
export function assembleBook(pool: readonly Quest[], opts: BookOptions): Quest[] {
  const completed = new Set(opts.completed ?? [])
  const recent = new Set(opts.recent ?? [])
  const book: Quest[] = []

  for (const length of ['kundschaft', 'kurz', 'mittel', 'episch'] as const) {
    const slots = BOOK_COMPOSITION[length]
    const ofLength = pool.filter((q) => q.length === length)
    if (ofLength.length === 0) continue

    // Erst alles, was weder abgeschlossen noch kürzlich dran war. Reicht das nicht,
    // kommen zuletzt gespielte wieder in Frage — nur Abgeschlossenes dieser Woche
    // bleibt draußen, sonst stünde es sofort wieder im Buch.
    const fresh = ofLength.filter((q) => !completed.has(q.id) && !recent.has(q.id))
    const fallback = ofLength.filter((q) => !completed.has(q.id))
    const source = fresh.length >= slots ? fresh : fallback.length > 0 ? fallback : ofLength

    // Ohne Zurücklegen ziehen. Zöge man mit, träfe derselbe Hash zweimal dieselbe
    // Quest, und das Buch käme mit weniger Einträgen heraus als vorgesehen —
    // ein Fehler, den man erst bemerkt, wenn das Buch beim Nutzer zu kurz ist.
    const remaining = [...source]
    for (let i = 0; i < slots && remaining.length > 0; i++) {
      const at = hashSeed(`${opts.week}:${length}:${i}:${completed.size}`) % remaining.length
      const [picked] = remaining.splice(at, 1)
      if (picked) book.push(picked)
    }
  }
  return book
}

function hashSeed(seed: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}
