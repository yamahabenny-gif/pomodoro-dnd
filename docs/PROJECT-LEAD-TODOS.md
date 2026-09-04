# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, TO-Reviewstand nach PRs #47–#49  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Wer soll gerade was tun?

### Developer — **jetzt aktiv**
**Primäre Aufgabe: #36 Waldintro nach Art-/Audio-Hinweisen nachbessern.**

- PR #48 ist technisch sauber und CI-grün.
- Vor Merge sind die bereits dokumentierten Art-/Audio-/Produktnachbesserungen umzusetzen:
  - Narrationsbereich weniger wie klassische Web-Card gestalten.
  - Theme-/Darstellungssteuerung im Einstieg visuell zurücknehmen.
  - Diegetischen Eindruck „lebendiges illustriertes Fantasy-Abenteuerbuch“ stärken.
- Reduced Motion, Tastaturbedienbarkeit und direkte Weiterleitung zu #10 beibehalten.

**#10 / PR #49 ist technisch freigabefähig, wird aber noch nicht am kritischen Pfad vorbeigemerged.**

### Senior Developer — **jetzt aktiv**
**Primäre Aufgabe: #5 / PR #47 Persistenz-Grundlage nachbessern.**

- CI ist grün und die Security-Grundlage ist grundsätzlich sauber.
- Blocker: `Alte Weglaterne` wird aktuell bereits beim Fokusabschluss persistent freigeschaltet.
- Concept V2 verlangt verbindlich: **Questabschluss → Rast → Truhe → Weglaterne**.
- Die Persistenzlogik muss diese Reihenfolge abbilden; Fokusabschluss darf die Laterne noch nicht endgültig freischalten.
- RLS, serverautoritatives `started_at`, idempotente Rewards und fehlende Party-/Klassen-/DM-Abhängigkeiten beibehalten.

### Art / Audio — **Review-Hinweise offen, keine neue Produktionslinie**
Das Phase-1-Produktionspaket ist über PR #44 geliefert.

- Für PR #48 sind konkrete Nachbesserungshinweise dokumentiert.
- Keine neuen unabhängigen Assets anfangen.
- Nach Developer-Nachbesserung erneute visuelle/produktseitige Abnahme von #48.

### Technical Owner — **aktuell prüfen / auf Wiedervorlage warten**
Aktueller Reviewstand:

- **PR #47 — BLOCKIERT:** Concept-/Sequenzabweichung bei Weglaternen-Unlock. Re-Review nach Senior-Developer-Fix.
- **PR #48 — TECHNISCH SAUBER, NOCH NICHT MERGEBEREIT:** CI grün; wartet auf Art-/Audio-/Produktnachbesserung und vorgesehene Product-Lead-Abnahme.
- **PR #49 — TECHNISCH FREIGABEFÄHIG:** CI grün, Scope-konform, Magic Link ohne Gastmodus; noch nicht gemerged, solange #47 als vorgelagerter kritischer Schritt blockiert ist.

Regel bleibt:
- Keine Eigenentwicklung.
- Nur prüfen, kommentieren, blockieren/freigeben und bei vollständig erfülltem Pfad mergen.
- Keine nachgelagerten PRs an einem blockierten vorgelagerten kritischen Schritt vorbeiziehen.

### Project Lead — **aktuell steuern und abnehmen**
- Kritischen Pfad sauber halten.
- #48 nach Developer-Nachbesserung produktseitig auf Ton, Einstieg und Art Direction abnehmen.
- #47 nach Senior-Developer-Fix erneut zum TO-Re-Review geben.
- #49 erst nach Freigabe des vorgelagerten Pfads mergen lassen.
- Danach den ersten vollständigen User-Journey-Abschnitt gezielt weiterführen.

## Aktueller kritischer Pfad

**#47 / #5 Fix + #48 / #36 Nachbesserung → #49 / #10 Merge → #11 → #29 → #37 → #38/#12/#21 → #13 → #39 → #35 Abnahme**

## Aktuelle TO-Ergebnisse

### PR #47 — Phase 1 Persistence Foundation (#5)
**Status: BLOCKIERT**

Positiv:
- CI grün.
- Profile 1:1 zu `auth.users`.
- RLS auf nutzerbezogenen Tabellen.
- Serverautoritatives Session-`started_at` via Datenbankzeit.
- Client kann XP/Gold, Session-Outcomes und Unlocks nicht direkt schreiben.
- Keine Party-, Klassen-, DM- oder Gast-Token-Abhängigkeiten.

Blocker:
- `complete_first_light_session()` vergibt aktuell XP/Gold **und** legt sofort `alte-weglaterne` in `unlocks` an.
- Das verletzt die verbindliche Produktsequenz **Fokusabschluss → Rast → Truhe → Laterne**.
- Nachbesserung wurde im PR dokumentiert; Re-Review erforderlich.

### PR #48 — Waldintro für Phase 1 (#36)
**Status: technisch sauber, noch nicht mergebereit**

Positiv:
- CI grün.
- Direkter Einstieg in die Fantasywelt, kein Marketing-Hero.
- Semantischer Übergang zu `/account`.
- Responsive, tastaturbedienbar, Reduced Motion vorhanden.

Offene Abnahme-/Nachbesserungspunkte:
- Narrationsbereich weniger wie klassische Web-Card.
- ThemeSwitcher im ersten Moment visuell zurücknehmen.
- Stärker diegetische Darstellung gemäß „Die Welt ist das Menü“.
- Product-/Art-Abnahme nicht umgehen.

### PR #49 — Magic-Link-Account (#10)
**Status: technisch freigabefähig, noch nicht gemerged**

Positiv:
- CI grün.
- Magic-Link-Login via Supabase Auth.
- Kein Gastmodus.
- Zustände für Laden, Link verschickt, abgelaufen/ungültig, offline und Fehler vorhanden.
- Tastaturbedienbares Formular mit verständlichen Inline-Statusmeldungen.
- PKCE-Callback führt zu `/character`.
- Keine Änderungen an Persistenzschema, RLS oder Reward-/Session-RPCs aus #47.

Merge-Entscheidung:
- Noch nicht mergen, solange #47 als vorgelagerter Schritt im kritischen Pfad blockiert ist.

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

Es laufen weiterhin zwei kontrollierte Umsetzungsstränge: **Senior Developer behebt #47/#5**, **Developer bessert #48/#36 gemäß Art-/Produktreview nach**. PR #49 bleibt technisch freigabefähig in Wartestellung. Der Technical Owner entwickelt nicht, sondern prüft nur eingehende PRs und hält die Reihenfolge des kritischen Pfads ein.
