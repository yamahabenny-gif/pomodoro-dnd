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
Drei Wege, bewusst in dieser Reihenfolge:

1. **Discord** — die Zielgruppe hat dort schon einen Account.
2. **Magic Link** per E-Mail — kein Passwort, das jemand vergessen kann.
3. **Als Gast** — nur ein Charaktername. Führt direkt in eine Session.

Der Gast-Weg ist gleichwertig gestaltet, nicht kleingedruckt. Ein Login, der zwischen
einem Menschen und einer gemeinsamen Fokus-Session steht, kostet die Session.

Zustände: `lädt` · `Magic Link verschickt` · `Link abgelaufen` · `OAuth abgebrochen`
· `offline`.

## 3 · Klassenwahl (`/character`)
Sechs Klassen. Jede Karte zeigt **das Timer-Profil als Hauptinformation** — „50 / 10"
groß, das Passiv darunter. Denn genau das wählt man hier aus: einen Arbeitsrhythmus.

Kein Raster gleich großer Icon-Karten. Die gewählte Klasse wächst und zeigt eine
Vorschau des Zyklus als kleine Zeitleiste.

Unten, unaufdringlich: *Eigene Zeiten festlegen* — für alle, die genau wissen, was
sie wollen.

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
