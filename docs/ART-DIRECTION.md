# Kunstrichtung

> Zuständigkeit: `#junDev` · Ergänzt [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md), ersetzt es nicht.

## Die Grenze

Zwei Welten, und die Grenze zwischen ihnen wird **scharf** gezogen — nicht weich.
Ein Verlauf zwischen den beiden ist genau der Punkt, an dem so ein Hybrid nach zwei
Projekten aussieht.

| | Bedienoberfläche | Gegenstände und Kulisse |
|---|---|---|
| **Was** | Knöpfe, Felder, Timer, Listen, Navigation, Klassen-Sigel | Items, Truhen, Wanderungs-Kulisse, Regionen |
| **Wie** | Gezeichnete SVG-Linie, 1,5&nbsp;px, runde Enden | Illustriert, mit Fläche und Tonwert |
| **Farbe** | Ausschließlich Tokens | Eigene, gedeckte Palette in der Nähe der Tokens |
| **Wo** | überall | **nur innerhalb eines Rahmens** |

**Die Regel, die den Hybrid trägt:** Illustration erscheint nie frei auf der Fläche.
Sie sitzt immer in einem klar begrenzten Feld — der Item-Kachel, dem Truhen-Podest, dem
Wanderungs-Band. Außerhalb dieser Felder gibt es ausschließlich Linie. Damit liest sich
die Illustration als *Abbildung eines Gegenstands*, nicht als Dekoration der Oberfläche.

## Gegenstände: ein Baukasten, keine 576 Zeichnungen

576 unterscheidbare Gegenstände entstehen aus **26 gezeichneten Teilen**:

```
12 Grundformen  ×  6 Materialien  ×  8 Embleme  =  576
```

| | |
|---|---|
| **Grundformen** | Klinge · Kelch · Ring · Foliant · Mantel · Laterne · Krone · Schlüssel · Amulett · Stab · Maske · Horn |
| **Materialien** | Eisen · Bronze · Silber · Mondstein · Glut · Obsidian |
| **Embleme** | Auge · Flamme · Welle · Wurzel · Stern · Spirale · Schwinge · Riss |

Das Aussehen ist **deterministisch aus der Item-Kennung** abgeleitet — dieselbe Kennung
ergibt auf jedem Gerät und in jeder Sitzung denselben Gegenstand. Es wird nichts
gewürfelt und nichts gespeichert außer der Kennung.

Der Name entsteht mit: `Mondsteinlaterne der Schwinge`, `Glutklinge des Risses`.
Deutsche Komposita tragen das erstaunlich weit.

### Wie der Hybrid hier greift

Jeder Gegenstand hat ein optionales Feld `art`. Ist es leer, rendert der Baukasten eine
Liniengrafik — vollwertig, auf System, sofort verfügbar. Ist es gesetzt, ersetzt die
Illustration sie.

Das ist kein Platzhalter-Kompromiss, sondern die Reihenfolge, in der man so etwas baut:
**Der Baukasten geht zuerst live, die Illustrationen kommen Stück für Stück dazu** —
priorisiert nach Seltenheit. Eine legendäre Krone wird zuerst illustriert, ein
gewöhnlicher Wachsstummel vielleicht nie. Kein Screen wartet auf eine Zeichnung.

## Wanderungs-Kulisse

Drei SVG-Ebenen mit unterschiedlicher Geschwindigkeit — Horizont, Mittelgrund, Weg —
plus die Gruppe als Sigel-Reihe darauf. Bewegt wird ausschließlich mit
`transform: translateX`, gesteuert vom Quest-Fortschritt.

Acht Regionen, je eine Kulisse. Welche Region gezeigt wird, bestimmt die Quest.

**Für die Kulissen — und nur für sie — sind generierte Hintergründe vorgesehen.**
Sie sind großflächig, tonwertig und tragen keine Bedeutung; dort fällt eine
Ungenauigkeit nicht auf. Für Item-Icons gilt das ausdrücklich **nicht**: 576 einzeln
generierte Gegenstände würden nie zueinander passen, und Seltenheit muss man erkennen,
nicht erahnen.

## Was nicht passiert

| Nicht | Warum |
|---|---|
| Pixel-Art neben Linien-Icons | Zwei Rasterlogiken auf einem Screen sehen nach zwei Projekten aus |
| Illustration in der Navigation | Die Grenze verwischt, der Hybrid fällt auseinander |
| Generierte Item-Icons | Seltenheit muss erkennbar sein, nicht ahnbar |
| Bewegte Kulisse während der Rast | Die Rast ist der Ort, an dem nichts wandert |
