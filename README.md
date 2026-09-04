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
2. **Im Lager ankommen.** Das Lager ist Home-Screen und Navigation: Abenteuerbuch, Rucksack, Sammlung, Signalhorn und Händler sind Teil der Welt.
3. **Quest wählen.** 15, 25 oder 50 Minuten; später epische Abenteuer als 3×25-Minuten-Bogen. Die Quest ist die Timer-Konfiguration.
4. **Fokussieren.** Der Charakter reist automatisch durch eine 2D-Fantasywelt. Der Timer bleibt lesbar in die Welt integriert. Während Fokus ist keine Spielinteraktion nötig.
5. **Ankommen und rasten.** XP und Gold werden vergeben, eine Truhe wird verdient. Erst kommt die reale Pause, danach darf die Truhe geöffnet werden.
6. **Welt wachsen lassen.** Loot ist kosmetisch und ohne Duplikate. Gold gibt Wahlfreiheit beim Händler. Sets, Erinnerungen, Begleiter und Lagerentwicklung erzählen langfristig die Geschichte investierter Fokuszeit.
7. **Optional gemeinsam aufbrechen.** Solo ist vollständig. Party-Einladung erfolgt bevorzugt per Link, ein kurzer Code bleibt Fallback. Alle bestätigen Bereitschaft, sehen dieselbe Uhr und arbeiten dann „zusammen allein“ – ohne Chat oder Pings während Fokus.

### Leitplanken

- **Die Welt ist das Menü.**
- **Fokus vor Gamification.**
- **1 Fokusminute = 1 XP.**
- **Keine Streaks, Daily Rewards, FOMO oder Schuldmechaniken.**
- **Keine Power-Progression.**
- **Keine Party-Truhe oder sozialen Leistungsrankings.**
- **Accessibility verändert nie Rewards.**
- **Die Fokuszeit der Person ist heiliger als die Spielinszenierung.**

---

## Fokuszeiten und Economy

| Quest | Fokus | Basisgold |
|---|---:|---:|
| Kundschaftergang | 15 min | 3 |
| Kurze Quest | 25 min | 5 |
| Mittlere Quest | 50 min | 10 |
| Episches Abenteuer | 3 × 25 min | 15 gesamt |

XP entstehen pro tatsächlich fokussierter Minute. Bei vorzeitigem Abbruch bleiben diese XP erhalten; Questabschluss-Gold und Truhe gibt es nur für einen abgeschlossenen Fokusabschnitt.

Loot nutzt vier Seltenheitsstufen: **Gewöhnlich 60 % · Ungewöhnlich 27 % · Selten 11 % · Außergewöhnlich 2 %**. Wenn eine Truhe ein Item enthält, ist es neu.

---

## Aktueller Content und vorhandene Logik

Das Repository enthält bereits einen umfangreichen Content- und Logikbestand, darunter Quest-/Regionsdaten, Itemkataloge, Lootlogik und zeitbasierte Journey-Logik. Bestehender Content darf weiterverwendet werden, sofern er Concept V2 entspricht; widersprechende Texte, Tests und Annahmen werden schrittweise migriert.

```bash
npm test
npm run typecheck
```

---

## Umsetzungsreihenfolge

1. **Vertical Slice:** Einstieg → Account → Charakter → Lager → „Ein Licht im Unterholz“ → 15 Minuten Fokus → Abschluss → Rast → deterministische Weglaterne.
2. **Core MVP:** 15/25/50-Quests, Progression, Loot, Ausrüstung, erste Lagerentwicklung, Settings, responsive Nutzung.
3. **Weltvertiefung:** Händler, Sets, Begleiter, weitere Regionen und Lagerstufen.
4. **Party:** Signalhorn, Einladungslink + Code-Fallback, Ready Check, gemeinsame Uhr, individuelle Rewards.
5. **Epische Abenteuer:** 3×25 Minuten mit persistentem Aktfortschritt.
6. **Langfristige Welt:** weitere Inhalte, Events und Plattformoptionen.

---

## Für Mitwirkende

Vor Produktentscheidungen zuerst [docs/CONCEPT.md](docs/CONCEPT.md) lesen. Bei einem Widerspruch zwischen älteren Dokumenten und Concept V2 gilt Concept V2; der Widerspruch soll im selben Change bereinigt oder explizit als Migration dokumentiert werden.

Details zum Entwicklungsworkflow: [CONTRIBUTING.md](CONTRIBUTING.md) · [docs/WORKFLOW.md](docs/WORKFLOW.md)

## Lizenz

MIT — siehe [LICENSE](LICENSE).
