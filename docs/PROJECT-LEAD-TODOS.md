# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, nach Merge von PR #53  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Aktueller Stand

Der erste Teil der Phase-1-User-Journey ist auf `main`:

**Waldintro → Account → Charakter → [nächster sichtbarer Schritt: Preview + Lager]**

Abgeschlossen:
- [x] #4 / PR #45 – Next.js-/Design-Grundlage
- [x] #5 / PR #47 – Persistenz-Grundlage
- [x] #6 – serverzeitfähige Timer-Grundlage
- [x] #36 / PR #48 – Waldintro
- [x] #10 / PR #49 – Magic-Link-Account
- [x] #11 / PR #50 – minimale visuelle Charaktererstellung
- [x] #40/#41 / PR #44 – Phase-1-Art-/Audio-Produktionspaket geliefert
- [x] PR #53 – Hostinger-/`focus.lang-jamin.de`-Architektur- und Release-Handoff dokumentiert und gemerged

Wichtig zu PR #53:
- `focus.lang-jamin.de` ist jetzt die dokumentierte Zielrichtung für den späteren öffentlichen Release.
- PR #53 war **nur Handoff/Dokumentation**. Er hat keine Pomodoro-App, DNS-, Supabase- oder Produktionsumstellung ausgerollt.
- Issue #3 ist auf Hostinger / `focus.lang-jamin.de` aktualisiert und bleibt der kanonische Release-Tracker.
- #35 bleibt zwingendes Produkt-Gate vor dem späteren Hostinger-/DNS-/App-Cutover.

Jetzt unmittelbar offen:
- [ ] #51 – internes Preview-Deployment für laufende Phase 1
- [ ] #29 – kleines Lager als diegetischer Hub
- [ ] Architektur-Follow-up aus PR #53 – Repo-Dokumente/ADR auf Hostinger-Zielrichtung bringen; technische Runtime-Entscheidung nur nach Hostinger-Qualifikation

Danach offen im Phase-1-Vertical-Slice:
- [ ] #37 – Abenteuerbuch mit kuratierter erster Quest
- [ ] #38 – „Ein Licht im Unterholz“: Aufbruch und Questabschluss
- [ ] #12 – Fokus-Screen mit integriertem 15-Minuten-Timer
- [ ] #21 – ruhige Journey-Kulisse
- [ ] #13 – Rast vor der ersten Truhe
- [ ] #39 – deterministische Weglaterne und sichtbare Lagerveränderung
- [ ] #35 – End-to-End-Tracking und Produktabnahme

## Wer muss jetzt als Nächstes etwas tun?

### Senior Developer / Architektur — **PR #53 FOLLOW-UP**
- Den im Handoff beschriebenen Architektur-PR erstellen.
- `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `README.md`, `docs/WORKFLOW.md`, `design/README.md` und `.env.example` auf Hostinger / `focus.lang-jamin.de` konsolidieren.
- Keine anbieterabhängigen Änderungen an `next.config.mjs`, `package.json` oder Deployment-CI ohne belegte Hostinger-Next.js-Laufzeit.
- Danach an Technical Owner zur technischen Prüfung geben.

### Developer / Technical Setup — **#51 PREVIEW**
- Internes Preview weiter vorbereiten, aber klar von `focus.lang-jamin.de` und dem späteren Produktions-Cutover trennen.
- Keine Produktions-DNS-/Supabase-Umstellung vor #35.
- Ziel bleibt: Browser-URL für laufende Produkt-/Art-Abnahme.
- Danach #29 – kleines Lager.

### Technical Owner — **PRÜFT, ENTWICKELT NICHT**
- Architektur-Follow-up aus PR #53 technisch prüfen.
- #51 Preview auf Environment-/Secret-Trennung und sichere Auth-Konfiguration prüfen.
- Keine Eigenentwicklung.

### Art / Audio — **KEINE NEUE PRODUKTION**
- Phase-1-Asset-Pack liegt vor.
- Bei #29 und folgenden visuellen Schritten vorhandene Assets integrieren.
- Nur konkrete Lücken nach Integration bearbeiten.

### Project Lead — **STEUERN + ABNEHMEN**
- PR #53 ist release-seitig freigegeben und gemerged.
- Issue #3 ist auf Hostinger / `focus.lang-jamin.de` aktualisiert.
- #51 als interne Preview klar vom späteren Produktionsweg trennen.
- Architektur-Follow-up und #29 jeweils nach Review weiterziehen.
- #35 als zwingendes Produkt-Gate schützen.

## Kritischer Produktpfad

**#4 ✅ → #5 ✅ → #6 ✅ → #36 ✅ → #10 ✅ → #11 ✅ → #51 Preview → #29 → #37 → #38 + #12 + #21 → #13 → #39 → #35 Abnahme**

## Release-/Architekturpfad parallel dazu

**PR #53 ✅ → Architektur-Follow-up → Hostinger-Laufzeitqualifikation → #35 ✅ → #3 App/DNS/Supabase-Cutover auf `focus.lang-jamin.de`**

## Führungsregel

PR #53 ist erledigt. Der Handoff darf nicht mit einer bereits erfolgten technischen Migration verwechselt werden. Produktseitig bleibt #51 → #29 der nächste sichtbare Pfad. Architektur und Release laufen parallel, aber der öffentliche Hostinger-Cutover bleibt bis zur vollständigen #35-Abnahme gesperrt.