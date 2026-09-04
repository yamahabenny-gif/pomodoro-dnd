# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, aktuelle Rollenverteilung  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Wer soll gerade was tun?

### Developer — **jetzt aktiv**
**Primäre Aufgabe: #36 Waldintro und Übergang zum Account.**

- Waldintro auf Basis der bereits gemergten Art-Assets aus PR #44 umsetzen.
- Warmen, ruhigen Erzähler-Ton aus Concept V2 treffen.
- Responsive, tastaturbedienbar, Reduced Motion.
- Übergang sauber zu #10 vorbereiten.

**Noch nicht parallel vorziehen:** #10, #11, #29, #37, #38, #12, #21, #13, #39. Diese folgen entlang des kritischen Pfads und sollen nicht gleichzeitig angefangen werden, solange #36 nicht sauber geliefert ist.

### Senior Developer — **jetzt aktiv**
**Primäre Aufgabe: #5 Persistenz-Grundlage für Account, Charakter und Fortschritt.**

- Solo-Persistenz für Profil/Account, Charakter, Sessionzustand, XP/Gold und Weglaterne.
- Row-Level-Security.
- Keine Party-, Gast-, Klassen- oder Dungeon-Master-Abhängigkeiten in Phase 1.
- Muss rechtzeitig stehen, bevor #10/#11/#39 integriert werden.

### Art / Audio — **aktuell keine neue Produktionsaufgabe**
Das Phase-1-Produktionspaket ist über PR #44 geliefert.

- Keine neuen Assets anfangen.
- Nur bei konkreten Integrationsproblemen oder Product-Lead-Nachbesserung wieder aktiv werden.
- #40/#41 sind produktionsseitig erledigt.

### Technical Owner — **aktuell warten / nur prüfen**
Es gibt aktuell keinen offenen Pull Request.

- Keine Eigenentwicklung.
- Sobald #36 oder #5 als PR geliefert werden: technische Prüfung gegen Issue, Concept V2 und bestehende Architektur.
- Besonders auf Accessibility, Reload-/Persistenzverhalten, Scope-Verstöße und unnötige Party-Abhängigkeiten achten.

### Project Lead — **aktuell steuern und abnehmen**
- Scope und Reihenfolge halten.
- Kein Vorziehen von Phase 2+ zulassen.
- #36 produktseitig auf Ton, Einstieg und User Journey prüfen, sobald geliefert.
- #5 auf Scope-Konformität prüfen; technische Abnahme bleibt beim TO.
- Backlog und #35 aktuell halten.
- Danach Developer gezielt auf #10 schicken.

## Aktueller kritischer Pfad

**#36 + #5 parallel → #10 → #11 → #29 → #37 → #38/#12/#21 → #13 → #39 → #35 Abnahme**

## Bereits erledigt

- #4 / PR #45 — Next.js-/Design-Grundlage gemergt.
- #6 — serverzeitfähige Timer-Grundlage abgeschlossen.
- #40/#41 — Art-/Audio-Produktionspaket via PR #44 geliefert.
- #1 — Phase 0 abgeschlossen.

## Nicht jetzt bearbeiten

- **Phase 2:** #14, #15, #17, #23, #26.
- **Phase 3:** #22.
- **Phase 4:** #7, #8, #9, #16.
- **Release-Gates:** #3, #18, #20 erst später.

## Führungsregel

Es sollen momentan genau zwei Umsetzungsstränge parallel laufen: **Developer auf #36** und **Senior Developer auf #5**. Art/Audio wartet. Der Technical Owner entwickelt nicht, sondern prüft nur eingehende PRs. Der Project Lead hält den Pfad sauber und gibt nach Abnahme jeweils den nächsten Schritt frei.
