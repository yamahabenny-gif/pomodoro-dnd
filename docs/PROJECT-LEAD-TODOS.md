# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, nach Merge von PR #57  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Aktueller Stand

Der sichtbare Phase-1-Pfad auf `main` reicht jetzt bis ins Lager:

**Waldintro → Account → Charakter → Lager**

Abgeschlossen:
- [x] #4 / PR #45 – Next.js-/Design-Grundlage
- [x] #5 / PR #47 – Persistenz-Grundlage
- [x] #6 – serverzeitfähige Timer-Grundlage
- [x] #36 / PR #48 – Waldintro
- [x] #10 / PR #49 – Magic-Link-Account
- [x] #11 / PR #50 – minimale visuelle Charaktererstellung
- [x] #29 / PR #57 – kleines Lager als diegetischer Hub
- [x] #40/#41 / PR #44 – Phase-1-Art-/Audio-Produktionspaket geliefert
- [x] PR #53 – Hostinger-/`focus.lang-jamin.de`-Architektur- und Release-Handoff

Aktuell gibt es **keinen offenen Pull Request**. Damit wartet gerade keine Freigabe bei Project Lead oder Technical Owner.

## Jetzt unmittelbar offen

1. [ ] **#51 – internes Preview-Deployment**: höchste operative Priorität, damit der aktuelle Stand endlich im Browser testbar wird.
2. [ ] **#37 – Abenteuerbuch mit kuratierter erster Quest**: nächster Feature-Schritt im Produktpfad.
3. [ ] **Architektur-Follow-up aus PR #53**: Hostinger-/`focus.lang-jamin.de`-Dokumentation konsolidieren und technische Runtime-Qualifikation vorbereiten.

Danach:
- [ ] #38 – „Ein Licht im Unterholz“: Aufbruch und Questabschluss
- [ ] #12 – Fokus-Screen mit integriertem 15-Minuten-Timer
- [ ] #21 – ruhige Journey-Kulisse
- [ ] #13 – Rast vor der ersten Truhe
- [ ] #39 – deterministische Weglaterne und sichtbare Lagerveränderung
- [ ] #35 – End-to-End-Tracking und Produktabnahme

## Wer muss jetzt was tun?

### Developer / Technical Setup — **PRIORITÄT 1: #51 PREVIEW**
- #51 jetzt tatsächlich technisch umsetzen; nicht nur vorbereiten.
- aktuellen `main` über eine Browser-URL bereitstellen.
- Preview/Test klar von späterer Produktion auf `focus.lang-jamin.de` trennen.
- Auth, Charakter und Lager in der Preview real testbar machen.
- keine Secrets im Repository oder Client offenlegen.
- Preview-URL an Project Lead übergeben.
- danach Preview bei weiteren Phase-1-Merges fortlaufend aktualisieren.

### Developer / Feature — **PRIORITÄT 2: #37 ABENTEUERBUCH**
Sobald #51 nicht mehr den Feature-Developer blockiert bzw. parallel technisch betreut werden kann:
- #37 auf aktuellem `main` umsetzen.
- geliefertes Abenteuerbuch-Artwork tatsächlich integrieren.
- erste Quest „Ein Licht im Unterholz“ mit 15 Minuten prominent anbieten.
- keine abstrakte Timer-Konfiguration, keine Deadline/FOMO.
- CTA führt in den Aufbruch-/Questpfad.
- responsive, semantisch und tastaturbedienbar.
- danach PR zur TO- und Project-Lead-Abnahme geben.

### Senior Developer / Architektur — **PR #53 FOLLOW-UP**
- Architektur-Handoff aus #53 umsetzen.
- `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `README.md`, `docs/WORKFLOW.md`, `design/README.md` und `.env.example` konsolidieren.
- Hostinger-Next.js-Laufzeit qualifizieren, bevor anbieterabhängige Runtime-/CI-Änderungen erfolgen.
- keine Produktionsmigration vor #35.
- Ergebnis als PR an Technical Owner geben.

### Technical Owner — **AKTUELL WARTEN / NUR PRÜFEN**
- Es gibt aktuell keinen offenen PR zur technischen Freigabe.
- Sobald #51, #37 oder der Architektur-Follow-up als PR vorliegt: technisch prüfen.
- insbesondere bei #51 Environment-/Secret-Trennung, Auth und Deployment-Verhalten prüfen.
- keine Eigenentwicklung.

### Art / Audio — **AKTUELL WARTEN**
- Keine neue spekulative Produktion.
- vorhandenes Phase-1-Pack ist die Quelle für #37 und folgende Screens.
- nur reagieren, wenn bei Integration eine konkrete Asset-Lücke oder Qualitätsabweichung sichtbar wird.

### Project Lead — **AKTUELL WARTEN AUF PREVIEW/PRS**
- keine offene Freigabe.
- #51 nach Übergabe der Browser-URL produktseitig testen.
- #37 nach TO-Prüfung produkt-/artseitig abnehmen.
- kritischen Pfad und #35 synchron halten.
- `focus.lang-jamin.de` weiterhin vor vorzeitigem Produktions-Cutover schützen.

## Kritischer Produktpfad

**#4 ✅ → #5 ✅ → #6 ✅ → #36 ✅ → #10 ✅ → #11 ✅ → #29 ✅ → #37 → #38 + #12 + #21 → #13 → #39 → #35 Abnahme**

Parallel und jetzt dringend sichtbar:

**#51 Preview → Browser-Test durch Project Lead**

## Release-/Architekturpfad

**PR #53 ✅ → Architektur-Follow-up → Hostinger-Laufzeitqualifikation → #35 ✅ → #3 App/DNS/Supabase-Cutover auf `focus.lang-jamin.de`**

## Führungsentscheidung

PR #57 ist nicht mehr der Engpass: Es gibt aktuell keinen offenen PR. Der operative Engpass ist jetzt **#51**, weil der bereits vorhandene Produktstand sonst für den Project Lead nicht real im Browser prüfbar ist. Feature-seitig folgt **#37 Abenteuerbuch**. Senior Developer kann den Hostinger-Architekturpfad parallel bearbeiten, ohne den Phase-1-Produktpfad anzuhalten.