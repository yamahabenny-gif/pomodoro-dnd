/**
 * Truhenziehung nach der zentralen Loot-Regel aus Concept V2, docs/CONCEPT.md §4:
 *
 *   „Wenn eine Truhe ein Item enthält, ist es neu. Keine Duplikate."
 *
 * Das ist der Grund, warum Gegenstände nicht mehr aus einer Kennung errechnet
 * werden können (so machte es lib/loot/items.ts): Gezogen wird aus einem Katalog,
 * und zwar aus dem, was noch nicht besessen wird. Der Baukasten aus items.ts
 * bleibt — er liefert jetzt das Aussehen eines Katalogeintrags ohne Illustration.
 *
 * Rein: keine React-Importe, kein Math.random(), keine Uhr. Die Ziehung ist
 * deterministisch aus einem Seed — dieselbe Eingabe ergibt reproduzierbar dasselbe
 * Ergebnis, was eine serverseitige Ziehung testbar und nachvollziehbar macht. Das
 * ist unabhängig von Party-Fragen: Nach ADR-025 gibt es keine Party-Truhe, jede
 * Person erhält eine eigene, individuelle Ziehung.
 */

export type Category = 'charakter' | 'lager' | 'begleiter' | 'atmosphaere'

/** Vier Stufen nach Concept V2, ADR-021. */
export type Rarity = 'gewoehnlich' | 'ungewoehnlich' | 'selten' | 'aussergewoehnlich'

export const RARITIES: readonly Rarity[] = [
  'gewoehnlich', 'ungewoehnlich', 'selten', 'aussergewoehnlich',
]

/** Summiert sich auf 1. Werte nach ADR-021: 60 / 27 / 11 / 2 %. */
export const RARITY_CHANCE: Record<Rarity, number> = {
  gewoehnlich: 0.6,
  ungewoehnlich: 0.27,
  selten: 0.11,
  aussergewoehnlich: 0.02,
}

export interface CatalogueItem {
  id: string
  category: Category
  rarity: Rarity
  name: string
  /** Sammlungsset, dem der Gegenstand angehört. */
  set?: string
  /** Illustrierte Fassung. Fehlt sie, rendert der Baukasten aus items.ts. */
  art?: string
}

/**
 * Was eine Truhe hergibt.
 *
 * `item: null` heißt: Der Topf ist leer. Dann gibt es Gold statt eines Gegenstands —
 * niemals ein Duplikat. Dieser Fall ist in docs/CONCEPT.md nicht spezifiziert; die
 * Herleitung der Ersatzregel steht in docs/KONZEPT-ABGLEICH.md, W4.
 */
export interface Drop {
  item: CatalogueItem | null
  /** Ersatz-Gold, wenn der Topf leer war. */
  goldInstead: number
  /** Set, das mit diesem Gegenstand vollständig wurde. */
  completedSet?: string
}

function hash(seed: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

/**
 * Würfelt deterministisch aus einem Seed eine Seltenheitsstufe, gewichtet nach
 * RARITY_CHANCE (ADR-021: 60 / 27 / 11 / 2 %).
 *
 * Wie `hash()` selbst: kein `Math.random()`, derselbe Seed ergibt immer dieselbe
 * Stufe. Das macht die Ziehung serverseitig nachvollziehbar und die Verteilung
 * automatisiert testbar (Akzeptanzkriterium aus #15) — mit `Math.random()` ließe
 * sich zwar auch eine korrekte Verteilung erzeugen, aber kein einzelnes Ergebnis
 * im Nachhinein reproduzieren oder in einem Test gezielt herbeiführen.
 */
export function rollRarity(seed: string): Rarity {
  // hash() liefert einen vollen 32-Bit-Wert; Teilen durch 2^32 ergibt eine Zahl
  // in [0, 1) — dieselbe Bühne, auf der RARITY_CHANCE seine Prozente definiert.
  const roll = hash(seed) / 0x1_0000_0000
  let acc = 0
  for (const step of RARITIES) {
    acc += RARITY_CHANCE[step]
    if (roll < acc) return step
  }
  // Nur als Schutz gegen Gleitkomma-Rundung, falls acc knapp unter 1 bleibt.
  return RARITIES[RARITIES.length - 1] ?? 'gewoehnlich'
}

/**
 * Zieht einen noch nicht besessenen Gegenstand.
 *
 * Läuft der verlangte Topf leer, wird **nicht** auf ein Duplikat ausgewichen. Es
 * wird zuerst in der nächstniedrigeren Stufe derselben Kategorie gesucht — wer eine
 * seltene Truhe öffnet, soll nicht leer ausgehen, nur weil die seltenen Umhänge alle
 * sind. Erst wenn auch dort nichts frei ist, gibt es Gold.
 */
export function drawLoot(
  catalogue: readonly CatalogueItem[],
  owned: ReadonlySet<string>,
  rarity: Rarity,
  category: Category,
  seed: string,
): Drop {
  const goldFor: Record<Rarity, number> = {
    gewoehnlich: 20, ungewoehnlich: 60, selten: 160, aussergewoehnlich: 400,
  }

  // Von der verlangten Stufe abwärts, nie aufwärts: eine leere seltene Kiste
  // darf keinen außergewöhnlichen Gegenstand ausschütten.
  const start = RARITIES.indexOf(rarity)
  for (let i = start; i >= 0; i--) {
    const step = RARITIES[i]
    if (step === undefined) continue

    const free = catalogue.filter(
      (c) => c.category === category && c.rarity === step && !owned.has(c.id),
    )
    if (free.length === 0) continue

    const picked = free[hash(`${seed}:${step}`) % free.length]
    if (picked === undefined) continue

    return {
      item: picked,
      goldInstead: 0,
      completedSet: setCompletedBy(catalogue, owned, picked),
    }
  }

  return { item: null, goldInstead: goldFor[rarity] }
}

/**
 * Nennt das Set, das durch genau diesen Gegenstand vollständig wird — sonst undefined.
 * Muss vor dem Eintragen in `owned` aufgerufen werden.
 */
export function setCompletedBy(
  catalogue: readonly CatalogueItem[],
  owned: ReadonlySet<string>,
  picked: CatalogueItem,
): string | undefined {
  if (!picked.set) return undefined
  const members = catalogue.filter((c) => c.set === picked.set)
  const missing = members.filter((c) => c.id !== picked.id && !owned.has(c.id))
  return missing.length === 0 ? picked.set : undefined
}

/**
 * Wie lange die Keine-Duplikate-Regel in einem Topf noch trägt.
 *
 * Concept V2 verlangt die Regel (docs/CONCEPT.md §4), sagt aber nicht, wie groß die
 * Töpfe sein müssen. Vier Kategorien × vier Stufen sind sechzehn Töpfe; bei acht
 * Quests am Tag ist ein Topf mit zwanzig Einträgen in gut zwei Wochen leer. Diese
 * Funktion macht das messbar, statt es zu schätzen — sie gehört in einen Test,
 * nicht in eine Annahme.
 */
export function drawsRemaining(
  catalogue: readonly CatalogueItem[],
  owned: ReadonlySet<string>,
  rarity: Rarity,
  category: Category,
): number {
  return catalogue.filter(
    (c) => c.category === category && c.rarity === rarity && !owned.has(c.id),
  ).length
}

/**
 * Mindestgrößen je Topf, damit die Regel nicht nach zwei Wochen ins Leere greift.
 *
 * Hergeleitet, nicht geraten: Bei acht Quests am Tag und vier Kategorien zieht ein
 * einzelner Topf `8 × Wahrscheinlichkeit ÷ 4` Mal pro Tag. Für `gewoehnlich` sind das
 * 1,2 Ziehungen täglich — vierzig Einträge halten damit gut einen Monat, zwanzig nur
 * gut zwei Wochen. Genau das hat der Reichweiten-Test aufgedeckt, als die Töpfe noch
 * halb so groß waren: 65-mal Gold statt eines Gegenstands innerhalb von 30 Tagen.
 */
export const MIN_POOL_SIZE: Record<Rarity, number> = {
  gewoehnlich: 40,
  ungewoehnlich: 20,
  selten: 12,
  aussergewoehnlich: 12,
}
