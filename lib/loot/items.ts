/**
 * Gegenstände entstehen aus 26 gezeichneten Teilen, nicht aus 576 Zeichnungen.
 *
 *   12 Grundformen  ×  6 Materialien  ×  8 Embleme  =  576
 *
 * Das Aussehen ist deterministisch aus der Kennung abgeleitet: dieselbe Kennung
 * ergibt auf jedem Gerät denselben Gegenstand. Gespeichert wird nur die Kennung.
 *
 * Diese Datei ist rein — keine React-Importe, kein Zufall, keine Uhr.
 */

export const BASES = [
  'klinge', 'kelch', 'ring', 'foliant', 'mantel', 'laterne',
  'krone', 'schluessel', 'amulett', 'stab', 'maske', 'horn',
] as const

export const MATERIALS = [
  'eisen', 'bronze', 'silber', 'mondstein', 'glut', 'obsidian',
] as const

export const EMBLEMS = [
  'auge', 'flamme', 'welle', 'wurzel', 'stern', 'spirale', 'schwinge', 'riss',
] as const

export type Base = (typeof BASES)[number]
export type Material = (typeof MATERIALS)[number]
export type Emblem = (typeof EMBLEMS)[number]
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export interface Item {
  id: string
  base: Base
  material: Material
  emblem: Emblem
  rarity: Rarity
  name: string
  /** Pfad zu einer illustrierten Fassung. Fehlt sie, rendert der Baukasten. */
  art?: string
}

/* ------------------------------------------------------------------ *
 * Benennung — deutsche Komposita tragen das erstaunlich weit.
 * ------------------------------------------------------------------ */

const BASE_NOUN: Record<Base, string> = {
  klinge: 'klinge', kelch: 'kelch', ring: 'ring', foliant: 'foliant',
  mantel: 'mantel', laterne: 'laterne', krone: 'krone', schluessel: 'schlüssel',
  amulett: 'amulett', stab: 'stab', maske: 'maske', horn: 'horn',
}

const MATERIAL_PREFIX: Record<Material, string> = {
  eisen: 'Eisen', bronze: 'Bronze', silber: 'Silber',
  mondstein: 'Mondstein', glut: 'Glut', obsidian: 'Obsidian',
}

/** Genitiv des Emblems — im Deutschen die kürzeste Art, Zugehörigkeit zu zeigen. */
const EMBLEM_GENITIVE: Record<Emblem, string> = {
  auge: 'des Auges', flamme: 'der Flamme', welle: 'der Welle', wurzel: 'der Wurzel',
  stern: 'des Sterns', spirale: 'der Spirale', schwinge: 'der Schwinge', riss: 'des Risses',
}

export function itemName(base: Base, material: Material, emblem: Emblem): string {
  const noun = BASE_NOUN[base]
  return `${MATERIAL_PREFIX[material]}${noun} ${EMBLEM_GENITIVE[emblem]}`
}

/* ------------------------------------------------------------------ *
 * Ableitung aus der Kennung
 * ------------------------------------------------------------------ */

/** FNV-1a. Klein, stabil und ohne Abhängigkeit — hier reicht das völlig. */
function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

/**
 * Seltenheit steuert das Material, nicht umgekehrt: Ein legendärer Gegenstand ist
 * aus Obsidian oder Mondstein, ein gewöhnlicher aus Eisen oder Bronze. Sonst sähe
 * eine legendäre Eisenklinge aus wie der Wachsstummel daneben.
 */
const MATERIAL_BY_RARITY: Record<Rarity, readonly Material[]> = {
  common: ['eisen', 'bronze'],
  uncommon: ['bronze', 'silber'],
  rare: ['silber', 'mondstein'],
  epic: ['mondstein', 'glut'],
  legendary: ['glut', 'obsidian'],
}

/**
 * Totales Indexieren per Modulo. Ohne diesen Umweg müsste jede Stelle unten ein
 * `!` tragen — und `!` ist eine Behauptung, keine Garantie. Hier ist sie eine.
 */
function cyclic<T>(list: readonly T[], n: number): T {
  const first = list[0]
  if (first === undefined) throw new Error('cyclic() auf leerer Liste')
  return list[n % list.length] ?? first
}

export function itemFromId(id: string, rarity: Rarity): Item {
  const h = hash(id)
  const base = cyclic(BASES, h)
  const material = cyclic(MATERIAL_BY_RARITY[rarity], h >>> 8)
  const emblem = cyclic(EMBLEMS, h >>> 16)
  return { id, base, material, emblem, rarity, name: itemName(base, material, emblem) }
}

/** Wie viele Gegenstände der Baukasten überhaupt hergibt. */
export const ITEM_SPACE = BASES.length * MATERIALS.length * EMBLEMS.length // 576
