/**
 * Allgemeine Belohnungsformel nach ADR-030 und docs/CONCEPT.md §4:
 *
 *   XP:   1 tatsächlich fokussierte Minute = 1 XP.
 *   Gold: 1 Gold pro 5 erfolgreich abgeschlossenen Fokusminuten.
 *
 * Keine Klassen-Passive, keine Charakter-Boni, keine XP-Multiplikatoren (#15).
 *
 * Abbruch erhält XP für tatsächlich fokussierte Minuten, aber kein
 * Questabschluss-Gold und keine Truhe (ADR-030). Das ist bereits so in der
 * Supabase-RPC `complete_first_light_session` (supabase/migrations/) für die
 * erste, deterministische Quest umgesetzt. Diese Datei bildet dafür nur die
 * allgemeine, wiederverwendbare Formel für künftige Quests ab — sie kennt
 * selbst keinen Abbruch-Zustand, weil es dafür nichts zu berechnen gibt: Ein
 * Abbruch ruft `questCompletionXp` mit den tatsächlich fokussierten Minuten auf
 * und `questCompletionGold` schlicht gar nicht.
 *
 * Rein: keine React-Importe, kein Zugriff auf Datenbank oder Uhr.
 */

/** 1 XP pro tatsächlich fokussierter Minute — unabhängig von Erfolg oder Abbruch. */
export function questCompletionXp(focusedMinutes: number): number {
  if (focusedMinutes <= 0) return 0
  return focusedMinutes
}

/**
 * 1 Gold pro 5 erfolgreich abgeschlossenen Fokusminuten, abgerundet.
 *
 * Nur für einen tatsächlichen Questabschluss aufrufen — bei Abbruch gibt es
 * kein Questabschluss-Gold (ADR-030), diese Funktion also gar nicht erst rufen.
 */
export function questCompletionGold(durationMinutes: number): number {
  if (durationMinutes <= 0) return 0
  return Math.floor(durationMinutes / 5)
}
