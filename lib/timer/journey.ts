/**
 * Die Wanderung — abgeleiteter Zustand, keine eigene Uhr.
 *
 *   Position auf dem Weg  =  verstrichene Zeit / Quest-Dauer
 *
 * Dasselbe Prinzip wie beim Timer. Deshalb ist die Wanderung nach einem
 * Hintergrund-Tab, nach Standby und für ein spät beitretendes Party-Mitglied
 * automatisch korrekt — ohne eine Zeile Synchronisationscode.
 *
 * Rein: keine React-Importe, kein Date.now(). Die Uhr wird hereingereicht.
 * Siehe docs/MOTION-ENGINE.md und docs/SYNC-PROTOCOL.md.
 */

export interface PhaseLike {
  /** ISO-8601 UTC, ausschließlich serverseitig gesetzt. */
  phase_started_at: string
  phase_duration_s: number
  /** Gesetzt, solange pausiert wird. Die Wanderung steht dann still. */
  paused_at?: string | null
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  return n < 0 ? 0 : n > 1 ? 1 : n
}

/**
 * Fortschritt zwischen 0 und 1.
 *
 * `now` ist die **korrigierte** Serverzeit aus dem Uhren-Abgleich, nicht
 * Date.now() — sonst wandert die Gruppe auf einem Gerät mit falsch gestellter
 * Uhr an einer anderen Stelle als bei allen anderen.
 */
export function journeyProgress(phase: PhaseLike, now: number): number {
  const duration = phase.phase_duration_s * 1000
  if (duration <= 0) return 1

  const started = Date.parse(phase.phase_started_at)
  if (Number.isNaN(started)) return 0

  // Pausiert: die Wanderung steht dort, wo sie beim Anhalten stand.
  const at = phase.paused_at ? Date.parse(phase.paused_at) : now
  const reference = Number.isNaN(at) ? now : at

  return clamp01((reference - started) / duration)
}

/**
 * Position einer Kulissen-Ebene in Pixeln.
 *
 * Parallaxe entsteht über `depth`: der Horizont bewegt sich langsam, der Weg
 * schnell. Bewegt wird ausschließlich `transform: translateX` — das läuft im
 * Compositor und kostet auf dem Hauptthread nichts.
 */
export function layerOffset(progress: number, travel: number, depth: number): number {
  const x = -clamp01(progress) * travel * depth
  // Ohne das kommt bei Fortschritt 0 ein negatives Null heraus. In CSS ist das
  // egal, in Tests und Vergleichen nicht — also hier einmal geradeziehen.
  return x === 0 ? 0 : x
}
