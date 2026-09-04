# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, nach Merge von PR #50  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Aktueller Stand

Der erste Teil der Phase-1-User-Journey ist jetzt auf `main`:

**Waldintro → Account → Charakter → [nächster sichtbarer Schritt: Preview + Lager]**

Abgeschlossen:
- [x] #4 / PR #45 – Next.js-/Design-Grundlage
- [x] #5 / PR #47 – Persistenz-Grundlage
- [x] #6 – serverzeitfähige Timer-Grundlage
- [x] #36 / PR #48 – Waldintro
- [x] #10 / PR #49 – Magic-Link-Account
- [x] #11 / PR #50 – minimale visuelle Charaktererstellung
- [x] #40/#41 / PR #44 – Phase-1-Art-/Audio-Produktionspaket geliefert

Jetzt unmittelbar offen:
- [ ] #51 – internes Preview-Deployment für laufende Phase 1
- [ ] #29 – kleines Lager als diegetischer Hub

Danach offen im Phase-1-Vertical-Slice:
- [ ] #37 – Abenteuerbuch mit kuratierter erster Quest
- [ ] #38 – „Ein Licht im Unterholz“: Aufbruch und Questabschluss
- [ ] #12 – Fokus-Screen mit integriertem 15-Minuten-Timer
- [ ] #21 – ruhige Journey-Kulisse
- [ ] #13 – Rast vor der ersten Truhe
- [ ] #39 – deterministische Weglaterne und sichtbare Lagerveränderung
- [ ] #35 – End-to-End-Tracking und Produktabnahme

## Wer muss jetzt als Nächstes etwas tun?

### Developer / Technical Setup — **JETZT AKTIV**
**Nächste Aufgabe: #51 – Internes Preview-Deployment einrichten.**

Ziel:
- aktuellen `main` über eine Browser-URL testbar machen
- Preview/Test klar von späterer Produktion trennen
- Account-/Auth-Flow und Charaktererstellung real testbar machen
- keine Secrets im Repository oder Client offenlegen
- Preview-URL an Project Lead übergeben
- nach weiteren Phase-1-Merges den Preview-Stand fortlaufend aktualisieren

**Direkt danach:** #29 – Kleines Lager als diegetischer Hub.

### Technical Owner — **PRÜFT #51 TECHNISCH**
- Nichts entwickeln.
- Preview-Setup auf saubere Environment-/Secret-Trennung und sichere Auth-Konfiguration prüfen.
- Danach die folgenden Feature-PRs jeweils gegen aktuellen `main` prüfen.

### Senior Developer — **AKTUELL KEINE AKTIVE AUFGABE**
- Persistenz-Grundlage #5 ist abgeschlossen.
- Nur eingreifen, wenn Preview/Auth oder weitere Integration eine echte Architektur-, RLS-, Persistenz- oder Security-Nachbesserung benötigt.

### Art / Audio — **AKTUELL KEINE NEUE PRODUKTION**
- Das Phase-1-Asset-Pack liegt auf `main`.
- Bei #29 und den folgenden visuellen Schritten vorhandene Assets integrieren.
- Nur konkrete fehlende Assets oder notwendige Nachbesserungen produzieren.

### Project Lead — **PREVIEW ABNEHMEN + PFAD STEUERN**
- #51 nach Bereitstellung im Browser prüfen.
- Danach #29 produkt-/artseitig begleiten und abnehmen.
- Backlog, Tracking #35 und kritischen Pfad synchron halten.

## Kritischer Pfad ab jetzt

**#4 ✅ → #5 ✅ → #6 ✅ → #36 ✅ → #10 ✅ → #11 ✅ → #51 Preview → #29 → #37 → #38 + #12 + #21 → #13 → #39 → #35 Abnahme**

## Reihenfolge der nächsten Developer-Pakete

1. **#51 Internes Preview-Deployment** – jetzt
2. **#29 Kleines Lager** – direkt danach
3. **#37 Abenteuerbuch**
4. **#38 + #12 + #21** – Quest-Rahmen, Fokus-Screen und Journey
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
- #3 öffentliches Deployment
- #18 Accessibility-Gesamtdurchgang
- #20 Datenschutz / Impressum / Export / Kontolöschung

Diese Aufgaben blockieren den internen Phase-1-Vertical-Slice aktuell nicht.

## Führungsregel

PR #50 / #11 ist abgeschlossen und gemerged. Der operative Engpass liegt jetzt bei **#51 internes Preview-Deployment**. Sobald eine Browser-URL verfügbar und technisch sauber geprüft ist, geht der Developer unmittelbar weiter mit **#29 Kleines Lager**. Der Technical Owner prüft nur; Senior Developer und Art/Audio warten auf konkrete Integrationsbedarfe.