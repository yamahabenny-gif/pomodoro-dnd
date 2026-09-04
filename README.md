# ⚔️ pomodoro-dnd

> Eine Cozy-Fantasy-Fokus-App: Arbeit wird zur Quest, echte Fokuszeit bewegt den Charakter durch eine illustrierte Welt und lässt das persönliche Lager wachsen.

**Ziel-Domain:** `pomodoro.lang-jamin.de`  
**Status:** Concept V2 ist die verbindliche Produktspezifikation; Umsetzung startet mit einem Vertical Slice.  
**Owner:** @yamahabenny-gif

---

## Source of Truth

**[docs/CONCEPT.md](docs/CONCEPT.md)** ist die verbindliche Quelle für Produktvision, Gameplay, Progression, Charaktere, Party, UX, Art Direction, Accessibility und MVP/Roadmap.

Detaildokumente konkretisieren das Konzept, dürfen ihm aber nicht widersprechen:

| Dokument | Inhalt |
|---|---|
| [docs/CONCEPT.md](docs/CONCEPT.md) | **Concept V2 – Was und Warum** |
| [docs/SCREENS.md](docs/SCREENS.md) | Screen- und UX-Spezifikation |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Komponenten, Tokens, Typografie, A11y |
| [docs/ART-DIRECTION.md](docs/ART-DIRECTION.md) | visuelle Umsetzung der Cozy-Fantasy-Welt |
| [docs/ASSET-BIBLE.md](docs/ASSET-BIBLE.md) | **Produktion, Formate, Layering, Audio und Motion-Assets** |
| [docs/MOTION-ENGINE.md](docs/MOTION-ENGINE.md) | technische Bewegungslogik |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | technische Architektur |
| [docs/SYNC-PROTOCOL.md](docs/SYNC-PROTOCOL.md) | Zeit- und Party-Synchronisation |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Umsetzungsphasen |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Architecture/Product Decision Records |
| [docs/KONZEPT-ABGLEICH.md](docs/KONZEPT-ABGLEICH.md) | historischer Abgleich V1 / früherer Draft |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Entwicklungsworkflow |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Mitarbeit am Repository |

---

## Das Produkt in 60 Sekunden

1. **Charakter erstellen.** Mensch, Elf, Zwerg, Goblin oder Ork. Keine Klassen, keine Stats, keine Geschlechtsauswahl. Die Figur ist Identität, kein Build.
2. **Im Lager ankommen.** Das Lager ist Heimat, Navigation und sichtbare Geschichte. Das Abenteuerbuch startet Quests, das Signalhorn verbindet Gefährten, der Händler bringt Kosmetik.
3. **Quest wählen.** Kundschaftergang 15, kurze Quest 25, mittlere Quest 50. Epische Abenteuer kommen später als 3×25-Minuten-Bogen.
4. **Fokussieren.** Während real gearbeitet wird, reist die Figur automatisch durch eine ruhige 2D-Fantasywelt. Keine Interaktion ist nötig.
5. **Abschließen und rasten.** Fokuszeit gibt XP, eine abgeschlossene Quest Gold und eine Truhe. Die Rast kommt **vor** der Truhenöffnung.
6. **Welt wachsen lassen.** Neue Looks, Relikte, Sets, Lagerobjekte und später Begleiter erzählen die investierte Zeit weiter.
7. **Optional gemeinsam.** Solo ist vollständig. Später ermöglicht das Signalhorn synchronen Gruppenfokus ohne Chat, Dungeon Master oder Leistungsranking.

---

## Produktregeln

- **1 fokussierte Minute = 1 XP**
- Gold: **1 pro 5 erfolgreich abgeschlossenen Fokusminuten**
- Loot ist kosmetisch und hat **keine Duplikate**
- vier Seltenheiten: **60 / 27 / 11 / 2 %**
- keine Streak-Pflicht, Daily Rewards, Countdown-Shops oder Produktivitätsrankings
- Accessibility-Einstellungen verändern niemals Rewards
- Abwesenheit wird niemals bestraft

---

## Vertical Slice zuerst

Die erste Umsetzung beweist den kompletten emotionalen Kern mit nur einem Weg:

**Waldintro → Account → Charakter → kleines Lager → „Ein Licht im Unterholz“ → 15 Minuten Fokus → Questabschluss → Rast → erste Truhe → Alte Weglaterne erscheint im Lager.**

Erst wenn dieser Weg visuell, akustisch und funktional trägt, wird auf weitere Regionen, Quests und Langzeitsysteme skaliert.

---

## Bestehender Content & Core

Im Repository liegen bereits Quest-, Regionen-, Item- und Timerbausteine. Sie sind wertvolles Material, aber nicht automatisch verbindliche Produktlogik. Wo bestehender Content oder Code Concept V2 widerspricht, wird er schrittweise migriert statt das Konzept zurückzubiegen.

Besonders wiederverwendbar sind:

- `content/quests.de.json`
- `content/regions.de.json`
- `content/items.de.json`
- `lib/quests/`
- `lib/loot/`
- `lib/timer/journey.ts`
- `docs/SYNC-PROTOCOL.md`

```bash
npm test
npm run typecheck
```

---

## Entwicklungsprinzip

**So einfach wie technisch möglich, so immersiv wie gestalterisch nötig.**

Keine Game Engine, kein komplexes RPG und kein Feature um seiner selbst willen. Die technische Priorität ist Zuverlässigkeit, Synchronisation, schnelle Ladezeit, Accessibility und eine störungsfreie Fokusphase.

> **Die Fokuszeit der Person ist heiliger als die Spielinszenierung.**

---

## Lizenz

MIT — siehe [LICENSE](LICENSE).
