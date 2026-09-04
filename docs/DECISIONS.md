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

### ADR-007 · Keine Game-Engine
**Status:** angenommen · 2026-09-04
**Kontext:** Wanderung, Truhen und Kulissen brauchen Bewegung.
**Entscheidung:** SVG und CSS, dazu `motion` für Choreografie. Kein Phaser, kein PixiJS, kein Three.js.
**Alternative:** Eine der genannten Engines.
**Grund:** Ein WebGL-Canvas, der 50 Minuten am Stück rendert, ist in einer Fokus-App
ein Fehler — er zieht Akku, lässt den Lüfter angehen und holt sich Aufmerksamkeit, die
gerade woanders gebraucht wird. Dazu 150–600 kB Laufzeit für Physik, Sprite-Batching und
Szenengraph, von denen wir nichts nutzen.

### ADR-008 · Die Wanderung ist abgeleiteter Zustand
**Status:** angenommen · 2026-09-04
**Kontext:** Die Gruppe soll während der Quest sichtbar unterwegs sein.
**Entscheidung:** `Position = verstrichene Zeit / Quest-Dauer`. Keine eigene
Animationsschleife, keine gespeicherte Position.
**Alternative:** Eine Animation mit eigenem Zeitgeber, die bei Phasenwechseln
zurückgesetzt und über die Party synchronisiert wird.
**Grund:** Dieselbe Idee wie ADR-002. Damit ist die Wanderung nach Hintergrund-Tab,
Standby und für spät beitretende Mitglieder automatisch korrekt — ohne eine Zeile
Synchronisationscode. Die Alternative wäre ein zweites Sync-Problem neben dem, das
wir schon gelöst haben.

### ADR-009 · Rive nur für die Höhepunkte
**Status:** angenommen · 2026-09-04
**Kontext:** Die Truhe hat fünf Seltenheitsstufen mit derselben Choreografie.
**Entscheidung:** Rive für Truhe, Stufenaufstieg und Party-Truhe. Alles andere in CSS
und `motion`. Die Laufzeit wird erst bei `progress > 0.9` nachgeladen.
**Alternative:** Alles handanimiert, oder Lottie.
**Grund:** Fünf handanimierte Varianten derselben Choreografie laufen auseinander,
sobald jemand eine davon anfasst. Rives State Machine hält sie in einer Datei zusammen
und macht sie ohne Deployment änderbar. Der Preis — 200 kB WASM und ein Werkzeug, das
jemand bedienen muss — ist nur für diese wenigen Momente gerechtfertigt, nicht für
Übergänge oder Icons. Lottie bringt bei größerem Aufwand keinen Zusatznutzen, solange
niemand im Team ohnehin mit After Effects arbeitet.

### ADR-010 · Hybride Kunstrichtung mit scharfer Grenze
**Status:** angenommen · 2026-09-04
**Kontext:** Die Oberfläche ist Linienzeichnung, das Spiel braucht reichere Bilder.
**Entscheidung:** Oberfläche bleibt Linie. Illustration ausschließlich innerhalb
begrenzter Felder: Item-Kachel, Truhen-Podest, Wanderungs-Band.
**Alternative:** Alles illustrieren, alles Linie lassen, oder Pixel-Art.
**Grund:** Der Hybrid trägt nur, solange die Grenze scharf ist. Ein Verlauf zwischen
beiden Welten ist genau der Punkt, an dem so etwas nach zwei Projekten aussieht. Mit
Rahmen liest sich Illustration als *Abbildung eines Gegenstands* statt als Dekoration
der Oberfläche.

### ADR-011 · 576 Gegenstände aus 26 gezeichneten Teilen
**Status:** angenommen · 2026-09-04
**Kontext:** Der Spielinhalt braucht viele unterscheidbare Gegenstände.
**Entscheidung:** 12 Grundformen × 6 Materialien × 8 Embleme, deterministisch aus der
Item-Kennung abgeleitet. Ein optionales Feld `art` überschreibt mit einer Illustration.
**Alternative:** Jeden Gegenstand einzeln zeichnen, oder generieren lassen.
**Grund:** Bildwiederholung fällt weit weniger auf als Textwiederholung — genau umgekehrt
zu den Quests, die deshalb einzeln geschrieben sind. Der Baukasten geht sofort live und
bleibt automatisch auf Strichstärke; Illustrationen kommen nach Seltenheit priorisiert
dazu, ohne dass ein Screen darauf wartet. Generierte Icons scheiden aus, weil man
Seltenheit erkennen können muss und 576 Einzelgenerierungen nie zueinander passen.

### ADR-012 · 100 einzeln geschriebene Quests statt Textbausteinen
**Status:** angenommen · 2026-09-04
**Kontext:** In einem Arbeitstag laufen bis zu 16 Quests. Wiederholung fällt sofort auf.
**Entscheidung:** 100 von Hand geschriebene Quests in acht Regionen, mit je 3–5
Wegabschnitten, als `content/quests.de.json`. Auswahl deterministisch aus Party-Code
und Zyklus, zuletzt gespielte ausgeschlossen.
**Alternative:** Prozedural aus Satzbausteinen erzeugen.
**Grund:** Kombinierter Text liest sich nach dem dritten Mal wie kombinierter Text.
Das ist bei Bildern anders (siehe ADR-011) — bei Sprache merkt man das Raster sofort.
100 Quests decken auch einen sehr langen Tag ohne Wiederholung ab.

### ADR-013 · Ein Volk, dauerhaft, ohne Mechanik
**Status:** angenommen · 2026-09-04 (Issue #27)
**Kontext:** Konzept V1 §4 verlangt Völker ohne Klassen; das ursprüngliche Briefing
sprach von einer Klasse, die auf Quests geht.
**Entscheidung:** Ein Volk (Mensch, Elf, Zwerg, Goblin, Ork), einmal gewählt, dauerhaft.
Reine Identität — keine Zeiten, keine Attribute, keine angeborenen Fähigkeiten.
Besondere Fähigkeiten gibt es **als Gewinn**, nicht als Anlage.
**Alternative:** Sechs Klassen, die zugleich das Timer-Profil setzen.
**Grund:** Die Dauer gehört an die Quest, nicht an den Charakter. Wer heute fünfzehn
Minuten schafft und morgen fünfzig, soll nicht den Charakter wechseln müssen — gerade
bei einer Zielgruppe, deren Belastbarkeit von Tag zu Tag schwankt.

### ADR-014 · Kein Gastzugang
**Status:** angenommen · 2026-09-04 (Issue #30, W5)
**Kontext:** Ein Gastzugang senkt die Hürde für den Gruppenbeitritt erheblich.
**Entscheidung:** Konto und Charakter sind Pflicht. Kein anonymer Beitritt.
**Alternative:** Gast für die Sitzung, Belohnungen später gutschreiben.
**Grund:** Fortschritt, Inventar und Level müssen geräteübergreifend erhalten bleiben,
und der Charakter muss am Lagerfeuer sitzen können. Ein Gast ohne Charakter hat im
Lager keinen Platz — die Metapher trägt ihn nicht.
**Preis, den wir dafür zahlen:** Der Login ist die härteste Hürde der App und steht vor
dem ersten Erlebnis. Der Login-Screen trägt dafür besondere Verantwortung: kein Passwort,
keine Bestätigungsmail vor dem Betreten, und der Text nennt den Grund.

### ADR-015 · Bereitschaftsprüfung statt Dungeon Master
**Status:** angenommen · 2026-09-04 (Issue #28)
**Kontext:** Wer startet, pausiert und überspringt in einer Gruppe?
**Entscheidung:** Niemand. Aufbruch, wenn alle bereit sind; Rast folgt automatisch;
Abbruch gilt nur für einen selbst.
**Alternative:** Ein Dungeon Master steuert, die Rolle wandert beim Verlassen.
**Grund:** Beseitigt eine ganze Klasse von Problemen — keine Rolle, die weitergereicht
werden muss; keine Gruppe, die auf eine Person wartet; kein sozialer Druck durch eine
Person, die alle anderen steuert.

### ADR-016 · Das Abenteuerbuch läuft nie leer
**Status:** angenommen · 2026-09-04 (Issue #30, W2)
**Kontext:** Konzept V1 §5 sieht zehn Quests pro Woche vor.
**Entscheidung:** Zehn Quests als kuratierte Auswahl, aber abgeschlossene werden
**ersetzt, nicht gestrichen**. Der Wochenwechsel mischt neu und nimmt nichts weg; es
gibt keine Frist und keine Ablaufkommunikation.
**Alternative:** Feste zehn pro Woche, danach leeres Buch.
**Grund:** Bei sechs Quests am Tag wäre die Woche nach zwei Tagen vorbei — genau bei
den Nutzern, die am meisten arbeiten. Und „die Quests dieser Woche" erzeugt die Sorge,
etwas zu verpassen, die Konzept V1 §14 ausschließt.

### ADR-017 · Vier Quest-Längen, kürzeste 15 Minuten
**Status:** angenommen · 2026-09-04 (Issue #30, W3)
**Kontext:** Konzept V1 §6 bot 25, 50 und 90 Minuten an.
**Entscheidung:** Vier Stufen — Kundschaftergang 15, Kurze Quest 25, Mittlere Quest 50,
Epische Quest 90 (letztere noch in Klärung, Issue #32).
**Alternative:** Bei drei Stufen ab 25 Minuten bleiben.
**Grund:** Konzept V1 §1 adressiert ausdrücklich Menschen, die Schwierigkeiten haben,
lange fokussiert zu bleiben. Wäre 25 Minuten die kürzeste Stufe, wäre der Einstieg für
einen erheblichen Teil dieser Zielgruppe der erste Misserfolg.

### ADR-018 · Die epische Quest ist ein Bogen, kein Block
**Status:** angenommen · 2026-09-04 (Issue #32)
**Kontext:** Konzept V1 §6 setzte die epische Quest auf ca. 90 Minuten.
**Entscheidung:** Drei Fokusabschnitte à 25 Minuten mit Rasten dazwischen, erzählt als
**eine** Quest. Der Bosskampf ist der dritte Abschnitt. Gesamtfokuszeit 75 Minuten.
**Alternative:** Neunzig Minuten am Stück.
**Grund:** Ein ununterbrochener 90-Minuten-Block widerspricht dem Grundsatz, auf dem die
Methode beruht, und trifft ausgerechnet die Zielgruppe aus Konzept V1 §1. Das epische
Gefühl bleibt, die Pausen bleiben drin, und der Wiedereinstieg ist erzählerisch motiviert.
**Technische Folge:** `arcProgress()` rechnet den Fortschritt über alle drei Abschnitte.
Ohne das spränge die Kulisse bei jeder Rast an den Anfang zurück.

### ADR-019 · Ruhiger Ton bei kurz und mittel, laut nur beim Boss
**Status:** angenommen · 2026-09-04 (Issue #31)
**Kontext:** Konzept V1 fordert Cozy Fantasy mit Drachen; der vorhandene Questpool war
karg und ohne Kreaturen.
**Entscheidung:** Kundschaftergang, kurze und mittlere Quests behalten den ruhigen,
beobachtenden Ton. Epische Quests und Bosskämpfe dürfen laut sein.
**Alternative:** Durchgängig ein Ton.
**Grund:** Konzept V1 §15 macht die Unterscheidung selbst („Fokusoberfläche: ruhig",
„Bosskämpfe: deutlich epischer"). Kurze und mittlere Quests laufen nebenher, während
jemand arbeitet — dort ist Zurückhaltung keine Stilfrage, sondern Funktion. Epische
Quests sind eine pro Woche und dürfen tragen.
**Umsetzung:** Jede Region trägt `theme` (Zuordnung zu Konzept V1 §5) und `tone`.
Ein Test hält den lauten Wortschatz aus den nicht-epischen Quests heraus.

### ADR-020 · Mindestgrößen der Loot-Töpfe sind hergeleitet, nicht geschätzt
**Status:** angenommen · 2026-09-04 (Issue #33)
**Kontext:** „Keine Duplikate" hält nur, solange die Töpfe reichen.
**Entscheidung:** 40 gewöhnliche, 20 seltene, 12 epische und 12 legendäre Einträge je
Kategorie. Insgesamt 336 Einträge in 16 Töpfen.
**Grund:** Bei acht Quests am Tag und vier Kategorien zieht ein Topf
`8 × Wahrscheinlichkeit ÷ 4` Mal täglich — für gewöhnlich 1,2. Vierzig Einträge halten
damit gut einen Monat. Der erste Entwurf hatte zwanzig, und der Reichweiten-Test deckte
auf, dass es innerhalb von 30 Tagen 65-mal Gold statt eines Gegenstands gegeben hätte.
Die Zahl steht jetzt als Test, nicht als Annahme.
