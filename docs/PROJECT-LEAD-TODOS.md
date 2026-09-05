# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 05.09.2026  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Verbindliche Hosting-Entscheidung

**Hostinger ist der einzige Hosting-Pfad für Preview und Produktion. Vercel wird nicht verwendet.**

- Preview: Hostinger
- Produktion: Hostinger / `focus.lang-jamin.de`
- Supabase: Auth/Postgres/Realtime
- Vercel-Credentials und Vercel-Workflows sind obsolet und dürfen keine Voraussetzung mehr sein.

## Aktueller Produktstand

PR #65 ist gemergt und schließt #38, #12, #21, #13 und #39. Damit ist der geplante Phase-1-Vertical-Slice im Code vollständig vorhanden:

**Waldintro → Account → Charakter → Lager → Abenteuerbuch → Aufbruch → 15-Minuten-Fokus/Journey → Questabschluss → Rast → Truhe → Alte Weglaterne → Lager**

## Jetzt höchste Priorität: #51 Hostinger-Preview

### Developer / Technical Setup
- Vercel-spezifische Preview-Reste entfernen oder als obsolet markieren
- Hostinger-Preview für aktuellen `main` einrichten
- aktuelle Supabase-Migrationen anwenden, insbesondere `20260905090000_focus_session_pause.sql`
- Magic-Link/Auth in der Preview-Konfiguration funktionsfähig machen
- aktuellen `main` deployen
- HTTP-/Flow-Smoke-Test ausführen
- Preview-URL in #51 dokumentieren
- an Technical Owner und Project Lead übergeben

### Senior Developer / Architektur
- Hostinger-Laufzeit/Deployment unterstützen, falls Runtime-Fragen offen sind
- keine Rückkehr zu Vercel
- Produktions-Cutover weiter hinter #35 halten

### Technical Owner
- #51 nach Bereitstellung technisch prüfen
- Environment-/Secret-Trennung, Migration, Auth, Routing und Deployment-Verhalten validieren
- keine Eigenentwicklung

### Project Lead
- vollständige Browser-End-to-End-Abnahme gegen #35 durchführen
- Desktop/Mobile, Reload/Hintergrund-Tab, sichtbaren integrierten Timer, Journey, Pause, Reduced Motion, Mute, Questabschluss, Rast, Truhe und Laterne prüfen
- erst nach erfolgreicher Abnahme #35 freigeben/schließen

## Parallel: Audio-Lücke aus PR #65

PR #65 dokumentiert, dass die sechs im Phase-1-Handoff genannten Audio-Dateien aktuell nicht im Repository liegen. Der Loop ist deshalb technisch funktionsfähig, aber stumm.

### Art / Audio
- fehlende sechs Web-Audio-Dateien gemäß `docs/PHASE1-ART-AUDIO-HANDOFF.md` liefern
- keine Scope-Erweiterung

### Developer
- Audio-Dateien in vorhandene Audio-Verdrahtung integrieren/verifizieren

## Offener PR #64

PR #64 betrifft nur den statischen Placeholder für `focus.lang-jamin.de` und ist technisch vom Technical Owner freigegeben. Er ist **nicht** der Produktengpass und ersetzt #51 nicht.

## Kritischer Pfad

**Produkt:** #4 ✅ → #5 ✅ → #6 ✅ → #36 ✅ → #10 ✅ → #11 ✅ → #29 ✅ → #37 ✅ → #38/#12/#21/#13/#39 ✅ → #51 Hostinger-Preview → #35 Browser-Abnahme

**Danach Release:** #18 + #20 → Hostinger-Runtime-/Release-Gate #3 → kontrollierter öffentlicher Cutover auf `focus.lang-jamin.de`

## Führungsentscheidung

Der Engpass ist jetzt **Hostinger-Preview und echte Browser-Abnahme**, nicht weitere Feature-Entwicklung. Vercel ist aus dem Projektpfad gestrichen.