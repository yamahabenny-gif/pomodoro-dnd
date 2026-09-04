# Screens

> Der visuelle Draft liegt als Claude-Design-Canvas vor (Link im Issue
> `#release Design-Draft Review`). Diese Seite ist die textliche Referenz dazu.

Reihenfolge entspricht dem Nutzerweg — von der Tavernentür bis zum Charakterbogen.

---

## 1 · Landing (`/`)
**Modus: Überzeugen.** Öffentlich, unter `pomodoro.lang-jamin.de`.

Erklärt das Produkt in einem Bildschirm: die Quest-Metapher, die Klassen und das
Party-Feature. Der Beweis ist ein **echter, laufender Timer** in der Hero-Fläche —
kein Screenshot, kein Video. Wer die Seite öffnet, sieht das Produkt arbeiten.

Zwei Handlungsangebote, klar gewichtet: *Quest beginnen* (primär) und
*Party beitreten* mit direktem Code-Feld (sekundär, aber sofort bedienbar). Der
häufigste Besucher hat einen Code von einer Freundin bekommen — der darf nicht
hinter einem Login liegen.

## 2 · Login (`/login`) — „Die Tavernentür"
Zwei Wege:

1. **Discord** — die Zielgruppe hat dort schon einen Account.
2. **Magic Link** per E-Mail — kein Passwort, das jemand vergessen kann.

**Kein Gastzugang.** Konto und Charakter sind Pflicht, damit Fortschritt, Inventar und
Level geräteübergreifend erhalten bleiben (Entscheidung zu W5, Issue #30).

Weil das die härteste Hürde der App ist und direkt vor dem ersten Erlebnis steht, trägt
dieser Screen die entsprechende Verantwortung: kein Passwort, keine Bestätigungsmail vor
dem Betreten, und der Text sagt, **warum** — nicht „Registrieren", sondern „Damit dein
Charakter dir auf jedem Gerät folgt."

Zustände: `lädt` · `Magic Link verschickt` · `Link abgelaufen` · `OAuth abgebrochen`
· `offline`.

## 3 · Charakter (`/character`)
**Fünf Völker:** Mensch, Elf, Zwerg, Goblin, Ork. Dazu ein Name.

Die Wahl ist **Identität, keine Mechanik**. Sie bringt keine Fähigkeiten und keine
Zeiten mit — besondere Fähigkeiten werden später *erspielt*, nicht gewählt
(Entscheidung zu K1, Issue #27). Der Charakter bleibt dauerhaft, geht auf alle Quests
und levelt.

Weil die Karten damit nichts Zählbares mehr zeigen, tragen sie das Volk selbst: Figur,
eine Zeile Charakter, sonst nichts. Kein Raster gleich großer Icon-Karten — die gewählte
Figur wird groß und steht neben dem Namensfeld.

**Die Dauer hängt nicht mehr hier, sondern an der Quest.** Man wählt „Der verlassene
Wachtturm · Mittlere Quest · 50 Minuten" im Abenteuerbuch — und das ist die Einstellung.

## 4 · Quest läuft (`/quest`) — Hauptscreen
Der Bildschirm, den man 25 Minuten lang ansieht. Deshalb: **ruhig**.

- Der Timer beherrscht die Fläche. Große Ziffern, `tabular-nums`, Messing auf warmem
  Schwarz.
- Ein Fortschrittsring als Fassung — die einzige Ornamentik.
- Darunter klein: welche Quest im Zyklus (2 von 4), die Klasse, der Streak.
- Steuerung: *Pausieren* und *Aufgeben*. Mehr nicht. Alles Weitere liegt hinter einem
  Menü und stört den Fokus nicht.
- Auto-DND-Status als schlichte Zeile, nicht als Banner.

Zustände: `läuft` · `pausiert` · `letzte Minute` (der Ring wechselt die Farbe,
kein Blinken) · `abgeschlossen`.

## 5 · Rast (`/quest` — Pausenphase)
Sichtbar anderer Ort. Warme Ember-Töne statt Messing, ein Lagerfeuer mit ruhiger
Atem-Animation (4 s, unter `reduce` stillstehend).

Der Text lädt zur Pause ein, statt sie zu überwachen: „Deine Gruppe rastet. Steh auf,
trink was." Der *Rast überspringen*-Button existiert, ist aber sekundär — Pausen zu
überspringen ist der häufigste Fehler beim Pomodoro.

## 6 · Truhe (`/quest` — nach der Quest)
**Der Moment.** Die Truhe erscheint mittig, das Umfeld tritt zurück.

Öffnen ist eine bewusste Handlung — Klick, Leertaste oder Enter. Dann die
Choreografie: Ruck, Riss, Lichtschein in der Seltenheitsfarbe, Inhalt steigt auf,
Zahlen zählen hoch (`tabular-nums`, damit nichts zappelt).

Unter `prefers-reduced-motion` gibt es dieselbe Belohnung als Überblendung — gleicher
Inhalt, gleicher Beat, keine Bewegung. Ungeöffnete Truhen wandern ins Inventar und
gehen nicht verloren.

## 7 · Party-Hub (`/party`)
Zwei gleichwertige Hälften: **Party gründen** und **Party beitreten**.

Beim Gründen erscheint der Code groß und gesperrt gesetzt — `H 2 6 H E` — mit einem
Kopieren-Button, der den Erfolg auch bestätigt.

Beim Beitreten ein Fünf-Zeichen-Feld: Einfügen erlaubt, Groß-/Kleinschreibung egal,
`I`/`L`→`1` und `O`→`0` werden automatisch gemappt. Fehlermeldung nennt den nächsten
Schritt, nicht nur das Problem.

## 8 · Party-Quest (`/party/[code]`)
Derselbe ruhige Timer wie im Solo-Modus — **eine Uhr, die für alle gilt** — plus die
Mitgliederliste seitlich.

Jedes Mitglied: Name, Klassen-Sigel, Status (unterwegs / rastet / weg). Der Dungeon
Master ist markiert; nur er sieht die Steuerung, alle anderen sehen an ihrer Stelle,
wer steuert.

Zustände, die gestaltet sein müssen: `wartet auf Start` · `ein Mitglied` ·
`zwölf Mitglieder` · `Mitglied verbindet neu` · `DM hat verlassen, Rolle wandert` ·
`eigene Verbindung weg` (deutlicher Hinweis — die angezeigte Zeit könnte veraltet sein).

## 9 · Charakterbogen (`/character/sheet`)
Kein Dashboard voller Kacheln. Ein **Bogen**: Klasse, Stufe, XP-Balken, Gold,
Streak-Tage, absolvierte Quests, Inventar der Fundstücke.

Die Fokus-Historie als schlichte Wochenansicht — informativ, ohne Druck zu erzeugen.
Es gibt bewusst keine roten Lücken für ausgelassene Tage.

## 10 · Einstellungen (`/settings`)
Eigene Zeiten, Ton, Systembenachrichtigungen, Auto-DND, Design (Dunkel / Hell /
System), Bewegung reduzieren, Sprache. Dazu Datenexport und Kontolöschung — sichtbar,
nicht versteckt.

---

## Für jeden Screen verbindlich

| | |
|---|---|
| Zustände | leer · lädt · Fehler · offline — keine Ausnahme |
| Tastatur | vollständig bedienbar, sichtbarer Fokusring |
| Responsiv | 360 px bis 1920 px, ohne horizontales Scrollen |
| Themes | dunkel **und** hell, beide geprüft |
| Texte | Problem **und** nächster Schritt bei jedem Fehler |
| URL | Zustand steckt in der URL — Party-Code ist teilbar |
