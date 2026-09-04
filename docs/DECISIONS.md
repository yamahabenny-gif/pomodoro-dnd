# Architecture Decision Records

Kurz halten. Vier Zeilen reichen. Der Zweck ist, dass in sechs Monaten niemand eine
Entscheidung zurückdreht, ohne den Grund zu kennen — und dass das übernehmende Team
nicht raten muss.

Format: **Kontext · Entscheidung · Alternative · Grund** — plus Status.

---

### ADR-001 · Supabase Realtime statt eigenem WebSocket-Server
**Status:** angenommen · 2026-09-04
**Kontext:** Die Party braucht Echtzeit-Synchronisation.
**Entscheidung:** Supabase Realtime Broadcast.
**Alternative:** Eigener Node/Bun-WebSocket-Service mit Redis.
**Grund:** Das Protokoll überträgt Phasenwechsel, keine Ticks — wenige Nachrichten pro
halbe Stunde und Party. Ein eigener Service wäre Infrastruktur ohne passende Last, und
das übernehmende Team müsste ihn betreiben.

### ADR-002 · Der Timer ist ein Zeitstempel, kein Countdown
**Status:** angenommen · 2026-09-04
**Kontext:** Alle Mitglieder müssen dieselbe Zeit sehen.
**Entscheidung:** Server hält `phase_started_at` + `phase_duration_s`; Clients rechnen
die Restzeit selbst aus und korrigieren über einen gemessenen Uhren-Offset.
**Alternative:** Server sendet jede Sekunde die Restzeit.
**Grund:** Übernimmt das Prinzip des Referenzprojekts (Zustand an der Wanduhr verankert).
Überlebt Reconnects, Hintergrund-Tabs und Standby ohne Sonderbehandlung, und ein später
beitretendes Mitglied ist sofort korrekt. Sekündliches Senden wäre teurer *und* fragiler.

### ADR-003 · Fünfstelliger Code aus 32 Zeichen ohne I, L, O, U
**Status:** angenommen · 2026-09-04
**Kontext:** Der Code wird vorgelesen und abgetippt.
**Entscheidung:** `0-9 A-Z` ohne `I L O U`, Länge 5 → 33,5 Mio. Kombinationen.
**Alternative:** UUID-Kurzform oder sechs Zeichen.
**Grund:** `I/L/1` und `O/0` sind beim Vorlesen nicht unterscheidbar; ohne `U` entstehen
keine ungewollten Wörter. Fünf Zeichen bleiben am Telefon durchsagbar. Gegen das Erraten
schützen Rate-Limits, nicht die Länge.

### ADR-004 · Verpasste Phasen — nachholen oder verfallen?
**Status:** **offen** — Entscheidung im Review von M3
**Kontext:** Waren alle Clients über einen Phasenwechsel offline, ist unklar, was gilt.
**Empfehlung:** Verfallen, Party geht in `idle`. Nachträgliches Gutschreiben lädt dazu
ein, Fortschritt durch Wegklicken zu erzeugen — und entwertet damit die Belohnung.

### ADR-005 · Dunkel als Standard
**Status:** angenommen · 2026-09-04
**Kontext:** Welcher Modus ist voreingestellt?
**Entscheidung:** Dunkel, mit vollwertigem hellen Modus und System-Erkennung.
**Alternative:** Hell, oder ausschließlich System.
**Grund:** Aus der Nutzungssituation, nicht aus Geschmack: Der Timer steht stundenlang
im Randblickfeld, oft abends. Eine helle Fläche, die 25 Minuten leuchtet, ermüdet.

### ADR-006 · Loot ist kosmetisch und nicht kaufbar
**Status:** angenommen · 2026-09-04
**Kontext:** Was steckt in den Truhen?
**Entscheidung:** XP, Gold und rein kosmetische Fundstücke. Kein Kauf, keine Spielvorteile.
**Alternative:** Freischaltbare Funktionen oder Premium-Inhalte.
**Grund:** Loot ist hier Rückmeldung für getane Arbeit. Sobald man es kaufen kann, ist
es keine Rückmeldung mehr, sondern eine Währung — und die Motivation kippt.
