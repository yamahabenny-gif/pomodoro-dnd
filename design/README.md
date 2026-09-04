# Visueller Draft

Die Screens aus [`docs/SCREENS.md`](../docs/SCREENS.md) als bearbeitbare Design-Canvas.

**Canvas:** https://claude.ai/code/artifact/671894a8-8452-4e21-a32d-c48e88dea90e

Jede `.dc.html` in diesem Ordner ist ein Artboard; [`canvas.json`](canvas.json) legt
Position, Titel und die Notizzettel fest. Die veröffentlichte Canvas-Datei selbst liegt
nicht im Repo — sie enthält rund 2 MB Editor-Code und wird aus diesen Quelldateien neu
erzeugt.

| Artboard | Screen |
|---|---|
| `Landing.dc.html` | Landing für `focus.lang-jamin.de` |
| `Login.dc.html` | Login — „Die Tavernentür" |
| `Klassen.dc.html` | Klassenwahl |
| `Main.dc.html` | Quest-Screen (Haupt-Timer) |
| `Rast.dc.html` | Rast am Lagerfeuer |
| `Truhe.dc.html` | Truhe geöffnet |
| `PartyHub.dc.html` | Gruppe gründen / beitreten |
| `PartyQuest.dc.html` | Gemeinsame Quest mit Mitgliederliste |
| `Charakterbogen.dc.html` | Charakterbogen mit Gepäck |
| `Einstellungen.dc.html` | Einstellungen |
| `Designsystem.dc.html` | Token-, Schrift- und Sigel-Übersicht |

## Stand des Drafts

- Alle Screens im **dunklen Modus**. Der helle Modus ist in
  [`docs/DESIGN-SYSTEM.md`](../docs/DESIGN-SYSTEM.md) als Token-Satz mit nachgerechneten
  Kontrasten spezifiziert, aber noch nicht gezeichnet.
- Die **Wortmarke ist ein Platzhalter** — der Produktname steht noch aus.
- Alle Klassen-Sigel sind gezeichnete SVGs mit 1,5&nbsp;px Strichstärke. Kein Emoji.
- Der Timer zeigt auf Solo-, Party- und Landing-Screen bewusst dieselbe Zahl:
  eine Uhr, aus einem Server-Zeitstempel berechnet.

Änderungen gehören in die `.dc.html`-Dateien und werden anschließend neu veröffentlicht;
Diskussion im Issue [#2](https://github.com/yamahabenny-gif/pomodoro-dnd/issues/2).
