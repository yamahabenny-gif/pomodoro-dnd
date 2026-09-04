# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, nach Merge von PR #45  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Aktueller Stand

- PR #45 / Issue #4: **erledigt und gemergt** – Next.js-/Design-Grundlage steht.
- Issue #6: **erledigt** – serverzeitfähige Timer-Kernlogik steht.
- Phase 0 / Issue #1: **abgeschlossen**.
- Es gibt aktuell **keinen offenen Pull Request**.
- Tracking für Phase 1: #35.

## Nächste Schritte – verbindliche Reihenfolge

### Jetzt parallel starten

1. **#36 Waldintro**  
   Umsetzer: Developer  
   Review: Technical Owner technisch, Project Lead Produkt/Ton.  
   Grund: erstes noch fehlendes sichtbares Element des User Journeys; keine Persistenz-Abhängigkeit.

2. **#5 Persistenz-Grundlage**  
   Umsetzer: Senior Developer  
   Review: Technical Owner.  
   Grund: Account, Charakter, Sessionzustand, XP/Gold und Weglaterne benötigen eine saubere Solo-Persistenz. Party ist ausdrücklich nicht Teil von Phase 1.

3. **#41 Vertical-Slice-Asset-Pack und #40 Basis-Audio**  
   Umsetzer: Art/Asset Creator + Audio/Asset Creator.  
   Integration: Developer.  
   Review: Project Lead Wirkung/Art; Technical Owner Integration.  
   Läuft parallel zum Development.

### Danach

4. **#10 Account** – Developer; baut auf #5 auf.  
5. **#11 minimale Charaktererstellung** – Developer + Art; Persistenz über #5.  
6. **#29 kleines Lager** – Developer + Art; wurde als echtes Phase-1-Implementierungsissue wieder geöffnet und Concept-V2-konform geschnitten.  
7. **#37 Abenteuerbuch** – Developer.  
8. **#38 erste Quest / Aufbruch / Abschluss** – Developer.  
9. **#12 Fokus-Screen + #21 Journey** – Developer + Art; Timer #6 ist bereits vorhanden.  
10. **#13 Rast** – Developer + Art.  
11. **#39 deterministische Weglaterne** – Developer + Art; Persistenz über #5.  
12. **#35 End-to-End-Abnahme** – Project Lead + Technical Owner.

## Backlog-Bereinigung – durchgeführt

- #1 geschlossen: Phase 0 ist abgeschlossen.
- #2 geschlossen: alter Screen-Draft mit Klassen/Party-Hub ist durch Concept V2 überholt.
- #5 vollständig auf Solo-Persistenz für Phase 1 umgeschrieben; alte DM/Gast/Party-Anforderungen entfernt.
- #17 auf Phase 2 umgeschrieben; Klassen entfernt, sanfte Fokus-Historie beibehalten.
- #19 geschlossen: Marketing-Landingpage widerspricht dem weltbasierten Einstieg; Phase 1 startet mit #36.
- #20 auf aktuellen Datenschutz-/Release-Scope ohne Gast/Klassen bereinigt.
- #22 auf Phase 3 verschoben und von der ersten Journey entkoppelt.
- #23 auf Phase 2 und vier Concept-V2-Seltenheiten umgeschrieben; 576 Items sind kein Pflichtumfang mehr.
- #25 geschlossen: alte fünfstufige Rive-Truhe ist durch #14/#39 ersetzt.
- #26 auf Phase 2 umgeschrieben; Klassenreferenzen entfernt.
- #29 wieder geöffnet und als echtes Phase-1-Lager-Implementierungsissue geschnitten.
- #35 aktualisiert: #4 und #6 erledigt; #5 ergänzt; kritischer Pfad dokumentiert.

## Nicht jetzt bearbeiten

- **Phase 2:** #14, #15, #17, #23, #26 und weitere Core-MVP-Erweiterungen.
- **Phase 3:** #22 und weitere Welt-/Regionsausbauten.
- **Phase 4:** #7, #8, #9, #16 – Party/Multiplayer.
- **Release-Gates:** #3, #18, #20 erst vor öffentlichem Release bzw. als spätere Gesamtprüfung.

## Kritischer Pfad

**#36 + #5 parallel → #10 → #11 → #29 → #37 → #38/#12/#21 → #13 → #39 → #35 Abnahme**

Art/Audio (#40/#41) läuft parallel und darf den Aufbau des funktionalen User Journeys nicht unnötig blockieren.

## Project-Lead-Regel

Der Project Lead hält Scope und Reihenfolge sauber und nimmt Produktwirkung ab. Der Technical Owner prüft technische Umsetzungen und entwickelt selbst nicht. Development implementiert; Art/Audio produziert die benötigten Assets. Phase-2+-Arbeit beginnt nicht, solange #35 nicht vollständig abgenommen ist.
