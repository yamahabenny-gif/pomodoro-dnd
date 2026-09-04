# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 05.09.2026, nach Backlog-Bereinigung und Merge von PR #61  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Aktueller Stand

Der sichtbare Phase-1-Pfad auf `main` reicht jetzt bis zum Abenteuerbuch:

**Waldintro → Account → Charakter → Lager → Abenteuerbuch**

Abgeschlossen:
- [x] #4 / PR #45 – Next.js-/Design-Grundlage
- [x] #5 / PR #47 – Persistenz-Grundlage
- [x] #6 – serverzeitfähige Timer-Grundlage
- [x] #36 / PR #48 – Waldintro
- [x] #10 / PR #49 – Magic-Link-Account
- [x] #11 / PR #50 – minimale visuelle Charaktererstellung
- [x] #29 / PR #57 – kleines Lager als diegetischer Hub
- [x] #37 / PR #61 – Abenteuerbuch mit erster kuratierter Quest
- [x] #40 / PR #44 – Basis-Audio produziert; Issue geschlossen, Integration in Feature-Issues
- [x] #41 / PR #44 – Phase-1-Asset-Pack produziert; Issue geschlossen, Integration in Feature-Issues
- [x] PR #53 – Hostinger-/`focus.lang-jamin.de`-Architektur- und Release-Handoff

Backlog-Hygiene erledigt:
- [x] #35 auf aktuellen Merge-Stand und kritischen Pfad aktualisiert
- [x] #40 und #41 als abgeschlossene Produktions-Issues geschlossen
- [x] #51 auf den aktuellen Preview-Scope bis Abenteuerbuch aktualisiert
- [x] #62 öffentliche Platzhalter-Seite als **nicht geplant** geschlossen; öffentliche Sichtbarkeit läuft ausschließlich kontrolliert über #3
- [x] altes Concept-V1-Item-Issue #33 ist bereits geschlossen und bleibt historisch; nicht reaktivieren

## Jetzt unmittelbar offen

### Priorität 1 – #51 internes Preview-Deployment
Der bereits gebaute Produktpfad muss endlich im Browser testbar werden.

Akzeptanzziel:
**Waldintro → Account → Charakter → Lager → Abenteuerbuch** über eine interne Browser-URL.

### Priorität 2 – #38 + #12 + #21 als zusammenhängendes Fokus-Paket
Nächster echter Produktblock:
- #38 Aufbruch + Questabschluss
- #12 sichtbarer, integrierter 15-Minuten-Fokus-Screen
- #21 ruhige Journey-Kulisse

Diese drei Issues bilden gemeinsam das erste vollständige Fokus-Erlebnis und sollen koordiniert umgesetzt werden, damit keine getrennten Wahrheiten für Timer, Journey und Narrative entstehen.

### Danach
1. #13 – Rast vor der ersten Truhe
2. #39 – deterministische Weglaterne + sichtbare Lagerveränderung
3. #35 – End-to-End-Abnahme des vollständigen Vertical Slice

## Wer muss jetzt was tun?

### Developer / Technical Setup — **JETZT: #51**
- internes Preview des aktuellen `main` bereitstellen
- Preview/Test klar von späterer Produktion auf `focus.lang-jamin.de` trennen
- Auth, Charakter, Lager und Abenteuerbuch real testbar machen
- keine Secrets im Client/Repository
- Preview-URL an Project Lead übergeben
- Preview nach weiteren Phase-1-Merges laufend aktualisieren

### Developer / Feature — **DANACH/PARALLEL: #38 + #12 + #21**
- Aufbruch, Fokus und Journey als ein konsistentes Paket umsetzen
- Timer bleibt sichtbar und Teil der Welt
- Journey ausschließlich aus Session-/Zeitfortschritt ableiten
- bestehende Art-/Audio-Assets aus PR #44 integrieren
- keine Inventar-/Shop-/Chat-Ablenkung im Fokus
- 00:00 löst ruhig in Questabschluss auf
- Responsive, Keyboard, Reduced Motion, Reload/Hintergrund-Tab sauber
- danach PR zur technischen und Produkt-/Art-Abnahme geben

### Senior Developer / Architektur — **PARALLEL**
- Architektur-Follow-up aus PR #53 weiterführen
- Hostinger-/`focus.lang-jamin.de`-Dokumentation konsolidieren
- konkrete Next.js-Laufzeit auf Hostinger qualifizieren
- keine anbieterabhängigen Runtime-/CI-Änderungen ohne Nachweis
- kein Produktions-Cutover vor #35

### Technical Owner — **WARTET AUF NÄCHSTEN PR**
- nichts entwickeln
- #51-PR auf Environment-/Secret-Trennung, Auth und Deployment-Verhalten prüfen
- #38/#12/#21 technisch als zusammenhängendes Fokus-Paket prüfen
- bei Architektur-Follow-up nur technisch prüfen

### Art / Audio — **WARTEN / NUR KONKRETE LÜCKEN**
- keine neue spekulative Produktion
- Phase-1-Pack aus PR #44 ist die Quelle
- nur nachbessern, wenn Integration eine konkrete Asset-/Audio-Lücke zeigt

### Project Lead — **AKTUELL KEINE OFFENE FREIGABE**
- #51 nach Übergabe der Preview-URL im Browser abnehmen
- nächsten Fokus-/Journey-PR (#38/#12/#21) auf Produkt, Ton und Art prüfen
- #35 synchron halten
- öffentliche Domain weiterhin ausschließlich über #3 nach vollständigem Produkt-Gate steuern

## Kritischer Produktpfad

**#4 ✅ → #5 ✅ → #6 ✅ → #36 ✅ → #10 ✅ → #11 ✅ → #29 ✅ → #37 ✅ → #38 + #12 + #21 → #13 → #39 → #35 Abnahme**

Parallel und operativ dringend:

**#51 Preview → Browser-Test durch Project Lead**

## Release-/Architekturpfad

**PR #53 ✅ → Architektur-Follow-up → Hostinger-Laufzeitqualifikation → #35 ✅ → #3 kontrollierter App/DNS/Supabase-Cutover auf `focus.lang-jamin.de`**

## Späterer Backlog – bewusst nicht jetzt

### Phase 2
- #14 Truhen-Inszenierung mit vier Seltenheiten
- #15 Loot-/XP-/Gold-Logik
- #17 Charakterbogen / Fokus-Historie
- #23 kosmetischer Item-Baukasten
- #26 Questpool erweitern

### Phase 3
- #22 weitere Regionen

### Phase 4
- #7 Clock-Skew
- #8 Party-Sync
- #9 Party-Code-Fallback
- #16 Signalhorn / Einladung / gemeinsame Quest

### Release-Gates
- #18 Accessibility-Gesamtdurchgang
- #20 Datenschutz / Impressum / Export / Löschung
- #3 öffentlicher Hostinger-Release

## Führungsentscheidung

Der Backlog ist jetzt bereinigt. Es gibt keine offenen Produktions-Issues für bereits gelieferte Art-/Audio-Pakete und keine unnötige öffentliche Platzhalter-Aufgabe mehr. Operativ hat **#51 internes Preview** höchste Priorität; produktseitig folgt **#38 + #12 + #21** als nächster zusammenhängender Vertical-Slice-Block.