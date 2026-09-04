# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, nach Merge von PR #44 und PR #45  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Aktueller Stand

- PR #45 / Issue #4: **erledigt und gemergt** – Next.js-/Design-Grundlage steht.
- Issue #6: **erledigt** – serverzeitfähige Timer-Kernlogik steht.
- PR #44: **gemergt** – vollständiges Phase-1-Art-/Audio-Produktionspaket steht auf `main`.
- `docs/PHASE1-ART-AUDIO-HANDOFF.md` dokumentiert die Asset- und Audio-Integration.
- PR #43: geschlossen, nicht gemergt; durch PR #44 ersetzt.
- Phase 0 / Issue #1: **abgeschlossen**.
- Es gibt aktuell **keinen offenen Pull Request**.
- Tracking für Phase 1: #35.

## Nächste Schritte – verbindliche Reihenfolge

### Jetzt parallel starten

1. **#36 Waldintro**  
   Umsetzer: Developer  
   Review: Technical Owner technisch, Project Lead Produkt/Ton.  
   Assets dafür liegen bereits aus PR #44 vor.

2. **#5 Persistenz-Grundlage**  
   Umsetzer: Senior Developer  
   Review: Technical Owner.  
   Grund: Account, Charakter, Sessionzustand, XP/Gold und Weglaterne benötigen eine saubere Solo-Persistenz.

### Danach

3. **#10 Account** – Developer; baut auf #5 auf.  
4. **#11 minimale Charaktererstellung** – Developer; Art-Assets aus PR #44 integrieren, Persistenz über #5.  
5. **#29 kleines Lager** – Developer; Lager-/Laternen-Assets aus PR #44 integrieren.  
6. **#37 Abenteuerbuch** – Developer; Book-Asset aus PR #44 integrieren.  
7. **#38 erste Quest / Aufbruch / Abschluss** – Developer; Audio-/Journey-Handoff nutzen.  
8. **#12 Fokus-Screen + #21 Journey** – Developer; Timer #6 und Journey-Assets aus PR #44 integrieren.  
9. **#13 Rast** – Developer; Rast-/Audio-Assets integrieren.  
10. **#39 deterministische Weglaterne** – Developer; Persistenz über #5 und vorhandene Lager-/Laternen-Assets.  
11. **#35 End-to-End-Abnahme** – Project Lead + Technical Owner.

## Neuigkeiten seit letztem Check

- Art/Audio-Produktion ist **nicht mehr offen**. #40 und #41 sind produktionsseitig durch PR #44 erledigt.
- Offen bleibt nur die Integration der gelieferten Assets in die jeweiligen Feature-Issues.
- Der kritische Pfad wird dadurch kürzer: Es gibt keinen separaten Asset-Produktionsblocker mehr.
- Aktuell wartet kein PR auf Review; der nächste sichtbare Fortschritt muss aus #36 und/oder #5 kommen.

## Backlog-Bereinigung – durchgeführt

- #1 geschlossen: Phase 0 ist abgeschlossen.
- #2 geschlossen: alter Screen-Draft mit Klassen/Party-Hub ist durch Concept V2 überholt.
- #5 auf Solo-Persistenz für Phase 1 umgeschrieben.
- #17 auf Phase 2 bereinigt.
- #19 geschlossen: Marketing-Landingpage widerspricht dem weltbasierten Einstieg.
- #20 auf aktuellen Datenschutz-/Release-Scope bereinigt.
- #22 auf Phase 3 verschoben.
- #23 auf Phase 2 und vier Concept-V2-Seltenheiten umgeschrieben.
- #25 geschlossen: alte fünfstufige Rive-Truhe ersetzt.
- #26 auf Phase 2 bereinigt.
- #29 als echtes Phase-1-Lager-Implementierungsissue geöffnet.
- #35 aktualisiert: #4, #6, #40 und #41 erledigt; kritischer Pfad aktualisiert.

## Nicht jetzt bearbeiten

- **Phase 2:** #14, #15, #17, #23, #26 und weitere Core-MVP-Erweiterungen.
- **Phase 3:** #22 und weitere Welt-/Regionsausbauten.
- **Phase 4:** #7, #8, #9, #16 – Party/Multiplayer.
- **Release-Gates:** #3, #18, #20 erst vor öffentlichem Release bzw. als spätere Gesamtprüfung.

## Kritischer Pfad

**#36 + #5 parallel → #10 → #11 → #29 → #37 → #38/#12/#21 → #13 → #39 → #35 Abnahme**

Die Art-/Audio-Produktion ist abgeschlossen; die Assets werden jetzt innerhalb der jeweiligen Feature-Issues integriert.

## Project-Lead-Regel

Der Project Lead hält Scope und Reihenfolge sauber und nimmt Produktwirkung ab. Der Technical Owner prüft technische Umsetzungen und entwickelt selbst nicht. Development implementiert und integriert die bereits gelieferten Assets. Phase-2+-Arbeit beginnt nicht, solange #35 nicht vollständig abgenommen ist.
