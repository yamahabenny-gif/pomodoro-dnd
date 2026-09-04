# Phase 1 Art/Audio Handoff

> Rolle: Art/Asset Creator + Audio/Asset Creator
> Stand: 2026-09-04
> Scope: Issues #40 und #41, ausschließlich Vertical Slice.

## Audio – produziert

Referenzpaket erzeugt und lokal als WAV-Master + OGG/Opus-Webfassung geprüft:

- `audio-camp-forest-ambience-01` – warme Lager-/Waldatmosphäre
- `audio-departure-motif-01` – wiederkehrendes Aufbruchsmotiv (~3 s)
- `audio-focus-light-undergrowth-01` – dezente Fokus-Ambience
- `audio-completion-resolve-01` – ruhige musikalische Auflösung
- `audio-rest-campfire-ambience-01` – Rast mit deutlich reduzierter Musik
- `sfx-chest-lantern-material-01` – Holz/Metall/Laterne, bewusst nicht casinoartig

Der reproduzierbare Quellgenerator liegt unter `design/source/audio/generate-phase1.py`. Es werden keine Drittanbieteraufnahmen oder fremde Musik verwendet.

### Audio-Abnahme gegen #40

- Startpegel bewusst niedrig; keine überraschenden Peaks.
- Fokus-Asset ist zurückhaltend und loop-orientiert.
- Departure und Completion sind motivisch verwandt.
- Rest priorisiert Umgebung statt Musik.
- Reward-SFX verwendet Materialklänge statt Jackpot-/Slotmachine-Sprache.
- Musik, Ambience und SFX sind als getrennte Dateien vorgesehen und damit separat regelbar/mutebar.

## Visual Art – Produktionssatz

Die visuelle Produktion folgt `docs/ART-DIRECTION.md` und `docs/ASSET-BIBLE.md`:

1. Intro-/Wald-Style-Frame
2. Startlager-Style-Frame
3. Referenzcharakter-Style-Frame
4. Quest-Style-Frame „Ein Licht im Unterholz“
5. danach Layer-Schnitt für Journey, Rast, Truhe und Weglaterne

### Verbindliche Charaktergrenzen

Keine Tattoos, Narben, Pflaster/Patches, Make-up-Systeme oder kleinteilige Körper-Detail-Slider. Adult Cozy Fantasy, stilisierte 2D-Figur, nicht chibi.

### Kompositionsregeln

- lebendig gewordenes illustriertes Abenteuerbuch
- 2D/2.5D-Diorama, kein echtes 3D
- gedeckte Nacht-/Waldpalette mit warmen Lichtankern
- Welt zuerst, UI danach
- Fokus-Szene ruhig; Hero-Motion nur für Aufbruch, Abschluss und Reward
- wichtige Inhalte außerhalb der äußeren 10 %
- Timer-/Textzone bleibt frei und wird nicht in Bilder eingebrannt
- Landscape und Portrait werden als eigene Kompositionen behandelt

## Nächster Integrationsschritt

Developer integriert nach Art-/Audio-Abnahme die Webassets unter `public/assets/...` und verdrahtet sie über ein typisiertes Asset-Manifest. Der Art/Audio-Owner produziert keine Timer-/Anwendungslogik.
