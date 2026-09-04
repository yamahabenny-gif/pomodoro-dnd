# Project Lead – aktueller Arbeitsstand

**Projekt:** D&D Pomodoro Timer  
**Repository:** `yamahabenny-gif/pomodoro-dnd`  
**Stand:** 04.09.2026, aktueller TO-Reviewstand  
**Source of Truth:** `docs/CONCEPT.md` + `docs/ROADMAP.md`

## Wer soll gerade was tun?

### Developer — **jetzt aktiv**
**Primäre Aufgabe: #36 / PR #48 Waldintro nach Art-/Audio-Hinweisen nachbessern.**

- Technische Grundlage ist sauber und CI-grün.
- Vor Merge sind die bereits dokumentierten Produkt-/Art-Nachbesserungen umzusetzen:
  - Narrationsbereich weniger wie klassische Web-Card gestalten.
  - Theme-/Darstellungssteuerung im Einstieg visuell zurücknehmen.
  - Diegetischen Eindruck „lebendiges illustriertes Fantasy-Abenteuerbuch“ stärken.
- Reduced Motion, Tastaturbedienbarkeit und direkte Weiterleitung zu #10 beibehalten.
- PR #48 ist aktuell außerdem nicht mergeable und muss vor finaler Freigabe auf den aktuellen `main`-Stand gebracht werden.

**#10 / PR #49 ist technisch freigabefähig, bleibt aber bis zur Freigabe von #48 nachgelagert.**

### Senior Developer — **aktuell erledigt / wartet**
**#5 / PR #47 Persistenz-Grundlage ist nach TO-Re-Review freigegeben und gemerged.**

- Der frühere Sequenzblocker ist behoben.
- `complete_first_light_session()` verbucht nur Fokusabschluss sowie 15 XP / 3 Gold.
- `finish_first_light_rest()` persistiert Rast bzw. expliziten Skip.
- Erst `open_first_light_chest()` schaltet `alte-weglaterne` frei.
- RLS und RPC-only Schreibpfade bleiben erhalten.
- Serverzeit und `auth.uid()` bleiben autoritativ.
- Keine Party-, Klassen-, DM- oder Gast-Token-Abhängigkeiten.

### Art / Audio — **Review-Hinweise offen, keine neue Produktionslinie**
Das Phase-1-Produktionspaket ist über PR #44 geliefert.

- Für PR #48 bleiben konkrete Nachbesserungshinweise offen.
- Keine neuen unabhängigen Assets anfangen.
- Nach Developer-Nachbesserung erneute visuelle/produktseitige Abnahme von #48.

### Technical Owner — **aktuell warten / erneut prüfen sobald #48 nachgebessert ist**
Aktueller Reviewstand:

- **PR #47 — GEMERGED:** Sequenzfehler behoben, Security/RLS sauber, CI grün.
- **PR #48 — TECHNISCH SAUBER, NOCH NICHT MERGEBEREIT:** wartet auf Produkt-/Art-Nachbesserung und ist aktuell nicht mergeable gegen `main`.
- **PR #49 — TECHNISCH FREIGABEFÄHIG:** CI grün, Scope-konform, Magic Link ohne Gastmodus; bleibt nachgelagert, bis #48 freigegeben ist.

Regel bleibt:
- Keine Eigenentwicklung.
- Nur prüfen, kommentieren, blockieren/freigeben und bei vollständig erfülltem Pfad mergen.
- Keine nachgelagerten PRs an einem blockierten vorgelagerten kritischen Schritt vorbeiziehen.

### Project Lead — **aktuell steuern und abnehmen**
- Kritischen Pfad sauber halten.
- #48 nach Developer-Nachbesserung produktseitig auf Ton, Einstieg und Art Direction abnehmen.
- Nach Freigabe von #48 kann #49 als nächster User-Journey-Schritt gemerged werden.
- Danach den ersten vollständigen User-Journey-Abschnitt gezielt weiterführen.

## Aktueller kritischer Pfad

**#47 / #5 ✅ → #48 / #36 Nachbesserung + Produktabnahme → #49 / #10 Merge → #11 → #29 → #37 → #38/#12/#21 → #13 → #39 → #35 Abnahme**

## Aktuelle TO-Ergebnisse

### PR #47 — Phase 1 Persistence Foundation (#5)
**Status: GEMERGED**

Ergebnis:
- CI grün.
- Profile 1:1 zu `auth.users`.
- RLS auf nutzerbezogenen Tabellen.
- Serverautoritatives Session-`started_at` via Datenbankzeit.
- Client kann XP/Gold, Session-Outcomes, Rest-/Chest-Timestamps und Unlocks nicht direkt schreiben.
- Keine Party-, Klassen-, DM- oder Gast-Token-Abhängigkeiten.
- Reward-Reihenfolge jetzt Concept-V2-konform: **Fokusabschluss → XP/Gold + Truhe verdient → Rast/Skip → Truhe öffnen → Weglaterne**.

Merge:
- PR #47 per Squash gemerged.
- Merge-Commit: `d541ccdbc5e3ae1b7c086eb5c160f9c468176161`.

### PR #48 — Waldintro für Phase 1 (#36)
**Status: technisch sauber, noch nicht mergebereit**

Positiv:
- CI grün.
- Direkter Einstieg in die Fantasywelt, kein Marketing-Hero.
- Semantischer Übergang zu `/account`.
- Responsive, tastaturbedienbar, Reduced Motion vorhanden.

Offen:
- Narrationsbereich weniger wie klassische Web-Card.
- ThemeSwitcher im ersten Moment visuell zurücknehmen.
- Stärker diegetische Darstellung gemäß „Die Welt ist das Menü“.
- Product-/Art-Abnahme nicht umgehen.
- PR ist aktuell nicht mergeable gegen den aktuellen `main`-Stand; Rebase/Update durch den Developer erforderlich.

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
- Noch nicht mergen, solange #48 / #36 als vorgelagerter User-Journey-Schritt nicht produktseitig freigegeben und mergebar ist.

## Bereits erledigt

- #4 / PR #45 — Next.js-/Design-Grundlage gemergt.
- #5 / PR #47 — Persistenz-Grundlage gemergt.
- #6 — serverzeitfähige Timer-Grundlage abgeschlossen.
- #40/#41 — Art-/Audio-Produktionspaket via PR #44 geliefert.
- #1 — Phase 0 abgeschlossen.

## Nicht jetzt bearbeiten

- **Phase 2:** #14, #15, #17, #23, #26.
- **Phase 3:** #22.
- **Phase 4:** #7, #8, #9, #16.
- **Release-Gates:** #3, #18, #20 erst später.

## Führungsregel

Der Senior-Developer-Strang #5 ist abgeschlossen. Der operative Engpass liegt jetzt vollständig bei **#48 / #36 Waldintro**: Developer-Nachbesserung, Branch-Aktualisierung und Produkt-/Art-Abnahme. PR #49 bleibt technisch bereit in Wartestellung. Der Technical Owner entwickelt nicht, sondern prüft nur eingehende PRs und hält die Reihenfolge des kritischen Pfads ein.
