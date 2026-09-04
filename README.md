# ⚔️ pomodoro-dnd

> Ein Pomodoro-Timer im D&D-Stil. Arbeiten heißt **auf Quest gehen**, Pause heißt **rasten**,
> und nach jeder Quest darfst du eine **Truhe öffnen**. Allein — oder als **Party** mit einem
> 5-stelligen Code, bei der alle dieselbe Uhr sehen.

**Ziel-Domain:** `pomodoro.lang-jamin.de`
**Status:** 🎨 Draft / Design-Review — noch keine Implementierung
**Owner:** @yamahabenny-gif · **Freigabe:** Release Team (`#release`)

---

## Inhaltsverzeichnis

| Dokument | Inhalt |
|---|---|
| [docs/CONCEPT.md](docs/CONCEPT.md) | Spielkonzept: Klassen, Quests, Rast, Truhen, Loot |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Tech-Stack, Datenmodell, Deployment |
| [docs/SYNC-PROTOCOL.md](docs/SYNC-PROTOCOL.md) | **Kernstück:** wie die Party dieselbe Uhr sieht |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Farben, Typografie, Spacing, Motion, A11y |
| [docs/SCREENS.md](docs/SCREENS.md) | Alle Screens von Login bis Charakterbogen |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Hashtags, Branches, Reviews, Release-Freigabe |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Meilensteine M0–M5 |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Architecture Decision Records (ADR) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Wie hier gearbeitet wird — **bitte zuerst lesen** |

---

## Das Konzept in 60 Sekunden

Ein klassischer Pomodoro-Timer zählt runter. Dieser hier erzählt dabei eine Geschichte:

1. **Charakter wählen.** Sechs Klassen — jede bringt ein *anderes Timer-Profil* mit.
   Der Magier arbeitet 50/10, der Schurke sprintet 15/3. Die Klassenwahl ist keine
   Kosmetik, sie ist die Timer-Konfiguration.
2. **Quest starten.** Der Fokus-Block ist eine Quest. Der Charakter ist unterwegs,
   die UI wird ruhig, Benachrichtigungen gehen aus (Auto-DND, wie im Referenzprojekt).
3. **Rasten.** Der Break ist eine Rast am Lagerfeuer. Jede vierte Rast ist eine
   **Lange Rast** in der Taverne.
4. **Truhe öffnen.** Nach jeder abgeschlossenen Quest gibt es eine Truhe: XP, Gold,
   ein Item. Fünf Seltenheitsstufen von *Gewöhnlich* bis *Legendär*.
5. **Party bilden.** Ein 5-stelliger Code — z. B. `H26HE` — und ihr seid synchron.
   Dieselbe Quest, dieselbe verbleibende Zeit, gemeinsame Party-Truhe am Ende.

## Warum "gleiche Uhrzeit" nicht trivial ist

Die naive Lösung — jeder Client startet ein `setInterval` — driftet innerhalb weniger
Minuten sichtbar auseinander und bricht komplett, sobald ein Tab in den Hintergrund geht.

Wir übernehmen stattdessen den Ansatz des Referenzprojekts
[devmobasa/omarchy-pomodoro](https://github.com/devmobasa/omarchy-pomodoro) und
verallgemeinern ihn: **Der Timer ist kein Countdown, sondern ein Zeitstempel.**

Der Server hält pro Party genau einen `phase_started_at` (UTC) plus `phase_duration_s`.
Jeder Client rechnet daraus lokal seine Restzeit aus und korrigiert seine eigene Uhr
über einen gemessenen Server-Offset. Es gibt keinen "Tick" über die Leitung — nur
Phasenwechsel. Das ist billig, robust gegen Reconnects, und ein neu beigetretenes
Mitglied ist sofort synchron.

→ Vollständige Spezifikation in [docs/SYNC-PROTOCOL.md](docs/SYNC-PROTOCOL.md)

---

## Für Mitwirkende

**Alles wird hier dokumentiert.** Kein Wissen in DMs, keine ToDos im Kopf.

- Jede Aufgabe ist ein **GitHub Issue**. Kein Issue → keine Arbeit.
- Jedes Issue trägt genau einen **Zuständigkeits-Hashtag**: `#SENDEV` oder `#junDev`.
- Alles, was nach außen geht, trägt zusätzlich `#release` und wartet auf das Release Team.
- Jede Architektur-Entscheidung wird als ADR in [docs/DECISIONS.md](docs/DECISIONS.md) festgehalten.

Details: [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/WORKFLOW.md](docs/WORKFLOW.md)

## Lizenz

MIT — siehe [LICENSE](LICENSE).
