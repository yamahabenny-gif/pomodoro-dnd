# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, nach Merge von PR #48 und PR #49  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Aktueller Stand

Der erste Teil der Phase-1-User-Journey ist jetzt auf `main`:

**Waldintro → Account → [nächster Schritt: Charakter]**

Abgeschlossen:
- [x] #4 / PR #45 – Next.js-/Design-Grundlage
- [x] #5 / PR #47 – Persistenz-Grundlage
- [x] #6 – serverzeitfähige Timer-Grundlage
- [x] #36 / PR #48 – Waldintro
- [x] #10 / PR #49 – Magic-Link-Account
- [x] #40/#41 / PR #44 – Phase-1-Art-/Audio-Produktionspaket geliefert

Noch offen im Phase-1-Vertical-Slice:
- [ ] #11 – minimale Charaktererstellung
- [ ] #29 – kleines Lager als diegetischer Hub
- [ ] #37 – Abenteuerbuch mit kuratierter erster Quest
- [ ] #38 – „Ein Licht im Unterholz“: Aufbruch und Questabschluss
- [ ] #12 – Fokus-Screen mit integriertem 15-Minuten-Timer
- [ ] #21 – ruhige Journey-Kulisse
- [ ] #13 – Rast vor der ersten Truhe
- [ ] #39 – deterministische Weglaterne und sichtbare Lagerveränderung
- [ ] #35 – End-to-End-Tracking und Produktabnahme

## Wer muss jetzt als Nächstes etwas tun?

### Developer — **JETZT AKTIV**
**Nächste Aufgabe: #11 – Minimale Charaktererstellung nach Concept V2.**

Verbindlicher Scope:
- fünf Völker: Mensch, Elf, Zwerg, Goblin, Ork
- Körperform / Silhouette
- Haut- bzw. Fantasyfarbe
- Frisur
- Haarfarbe
- Name
- vollständig tastaturbedienbar
- sehr lange Namen müssen sauber umbrechen
- Charakter persistent speichern
- Abschluss führt direkt in das kleine Lager (#29)

Nicht einbauen:
- keine Klassen
- keine Stats oder Boni
- keine Geschlechtsauswahl
- keine Tattoos, Narben, Pflaster/Patches, Make-up-Systeme oder Detailslider

Nach Umsetzung: Pull Request erstellen und an Technical Owner + Project Lead zur Prüfung geben.

### Technical Owner — **WARTET AUF #11-PR**
- Nichts entwickeln.
- Den nächsten Developer-PR zu #11 technisch gegen den aktuellen `main` prüfen.
- Besonders Persistenzanbindung an #5/#47, Accessibility, Scope-Trennung und Regressionen prüfen.
- Nur bei grünem technischen Ergebnis freigeben/weiterziehen.

### Senior Developer — **AKTUELL KEINE AKTIVE AUFGABE**
- Persistenz-Grundlage #5 ist abgeschlossen.
- Nur eingreifen, wenn #11 eine echte Architektur-, Persistenz-, RLS- oder Security-Nachbesserung an #5 benötigt.
- Keine parallele neue Feature-Entwicklung starten.

### Art / Audio — **AKTUELL KEINE NEUE PRODUKTION**
- Das Phase-1-Asset-Pack liegt auf `main`.
- Für #11 vorhandene fünf Race-Bases und Character-Variants-Guide verwenden.
- Nur konkrete Lücken/Nachbesserungen bearbeiten, wenn der Developer sie bei der Integration nachweist.

### Project Lead — **STEUERN + ABNEHMEN**
- #11 nach PR auf Produkt, Scope und Character-Art-Direction abnehmen.
- Keine Scope-Erweiterung zulassen.
- Nach Merge von #11 unmittelbar #29 als nächsten Developer-Schritt freigeben.
- Backlog und kritischen Pfad synchron halten.

## Kritischer Pfad ab jetzt

**#4 ✅ → #5 ✅ → #6 ✅ → #36 ✅ → #10 ✅ → #11 → #29 → #37 → #38 + #12 + #21 → #13 → #39 → #35 Abnahme**

## Reihenfolge der nächsten Developer-Pakete

1. **#11 Charaktererstellung** – jetzt
2. **#29 Kleines Lager** – direkt danach
3. **#37 Abenteuerbuch**
4. **#38 + #12 + #21** – Quest-Rahmen, Fokus-Screen und Journey als zusammenhängender Fokus-Abschnitt
5. **#13 Rast**
6. **#39 Weglaterne + sichtbare Lagerveränderung**
7. **#35 End-to-End-Abnahme**

## Phase-1-Abnahmekriterien für #35

Der Vertical Slice ist erst fertig, wenn:
- [ ] kompletter Weg ohne Sackgasse durchspielbar ist
- [ ] Desktop und Mobile funktionieren
- [ ] Reload/Hintergrund-Tab die Fokuszeit schützt
- [ ] Timer während Fokus sichtbar und in die Welt integriert bleibt
- [ ] Reduced Motion und Mute funktionieren
- [ ] erste Belohnung das Lager sichtbar verändert
- [ ] Art/Audio aus PR #44 konsistent wirken und Fokus nicht stören
- [ ] Produkt wie das Zielprodukt wirkt und nicht wie ein technischer Prototyp

## Späterer Backlog – nicht jetzt bearbeiten

### Phase 2
- #14
- #15
- #17
- #23
- #26

### Phase 3
- #22

### Phase 4
- #7
- #8
- #9
- #16

### Release-Gates
- #3 Deployment
- #18 Accessibility-Gesamtdurchgang
- #20 Datenschutz / Impressum / Export / Kontolöschung

Diese Aufgaben blockieren den internen Phase-1-Vertical-Slice aktuell nicht.

## Führungsregel

Der operative Engpass liegt jetzt vollständig bei **#11 Charaktererstellung**. Developer entwickelt. Technical Owner prüft nur. Senior Developer wartet auf echte Persistenz-/Security-Fragen. Art/Audio produziert nichts auf Vorrat. Nach erfolgreicher #11-Abnahme wird unmittelbar #29 Kleines Lager gestartet.