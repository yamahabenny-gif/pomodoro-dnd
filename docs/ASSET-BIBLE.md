# Asset Bible

> Status: **verbindliche Produktionsleitlinie** · Stand 2026-09-04
>
> Gilt zusammen mit [CONCEPT.md](CONCEPT.md), [ART-DIRECTION.md](ART-DIRECTION.md), [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) und [MOTION-ENGINE.md](MOTION-ENGINE.md).
>
> Ziel: Assets so produzieren, dass Illustration, Animation und Audio wie **eine Welt** wirken und von der Anwendung modular, performant und barrierearm genutzt werden können.

---

## 1. Produktionsprinzip

Wir bauen **kein Spiel aus Einzelbildern**, sondern ein kleines wiederverwendbares Asset-System.

Die visuelle Leitidee bleibt:

> **Ein illustriertes Fantasy-Abenteuerbuch, dessen Seiten lebendig geworden sind.**

Ein Screen wird soweit sinnvoll aus Ebenen zusammengesetzt:

1. Hintergrund
2. Mittelgrund
3. Vordergrund
4. Charakter(e)
5. atmosphärische Overlays (Nebel, Licht, Blätter, Glut)
6. semantische UI

Bewegung entsteht überwiegend durch CSS/SVG/`motion` und zeitabhängige Zustände. Video ist kein Standardformat.

---

## 2. Asset-Kategorien

### 2.1 World Art
- Lager
- Regionen
- Quest-Szenen
- Übergangsszenen
- Rast
- besondere Meilensteine

### 2.2 Characters
- fünf Völker
- modulare Körper-/Silhouettenvarianten
- Haare und Haarfarben
- Ausrüstungsslots
- Idle-Posen

### 2.3 Items & Camp Props
- kosmetische Ausrüstung
- Relikte / Sets
- Lagerobjekte
- Händlerware
- Begleiter

### 2.4 UI Art
- Abenteuerbuch
- Rahmen / Paneele
- Icons
- Ornamente
- Karten- und Pergamentelemente

### 2.5 Motion Assets
- Aufbruch
- Questabschluss
- Truhe
- Level-Meilenstein
- Begleiter-Schlüpfen
- einzelne Ambient-Loops

### 2.6 Audio
- Musik
- Umgebung
- UI-/World-SFX
- Aufbruch-/Abschlussmotiv

---

## 3. Vertical-Slice-Assetpaket

Bevor weitere Regionen produziert werden, muss **ein vollständiges visuelles Referenzpaket** existieren.

Der Vertical Slice umfasst:

**Intro → Charakter → Startlager → „Ein Licht im Unterholz“ → Fokus → Rast → Truhe → Weglaterne im Lager**

Dieses Paket definiert den Qualitätsstandard für alles Weitere.

### 3.1 Benötigte Visual Assets

#### Intro / Wald
- `intro-forest-bg`
- `intro-forest-mid`
- `intro-forest-fg`
- `intro-camp-glow`
- optional: Nebel-/Partikelmaske

#### Startlager
- `camp-stage-01-bg`
- `camp-stage-01-mid`
- `camp-stage-01-fg`
- `camp-fire`
- `camp-tent-01`
- `camp-adventure-book`
- `camp-backpack`
- `camp-signal-horn`
- `camp-lantern-slot-empty`
- `camp-lantern-old-road`

#### Erste Quest „Ein Licht im Unterholz“
Vier Journey-Beats für die 15-Minuten-Quest:
1. Waldrand / Aufbruch
2. tieferer Wald
3. Licht zwischen den Bäumen
4. Fundort / Ziel

Jeder Beat muss als responsive Szene funktionieren und dieselbe Region erkennbar behalten.

#### Rast
- ruhiger Feuerplatz
- Character-rest pose
- optionale Holzscheit-Interaktion

#### Erste Truhe
- geschlossene Truhe
- geöffnete Truhe
- Licht-/Glanzmaske
- Reduced-Motion-Endzustand

#### Erster Fund
- `item-old-road-lantern`
- Darstellung als Fundstück
- Darstellung als Lagerobjekt

### 3.2 Charakter-Referenz

Für den Vertical Slice wird zunächst **ein vollständig ausgearbeiteter Referenzcharakter** benötigt. Die übrigen Völker werden erst danach final produziert.

Referenzset:
- Front-/3/4-Ansicht
- Camp Idle
- Walk/Departure Pose
- Focus-Journey Pose
- Rest Pose
- Return Pose

Erst wenn Stil, Proportionen und Layering funktionieren, wird auf Mensch, Elf, Zwerg, Goblin und Ork skaliert.

---

## 4. Bildformate und technische Vorgaben

### 4.1 Rasterillustrationen
Bevorzugt **WebP** oder **AVIF** für große Hintergründe. PNG nur bei echter Transparenzanforderung.

Master-Dateien dürfen höher aufgelöst sein; ausgelieferte Webassets werden optimiert.

### 4.2 Vektoren
**SVG** für:
- Icons
- UI-Linien
- einfache Props
- Masken
- dekorative Shapes
- animierbare geometrische Elemente

### 4.3 Keine Textinhalte im Bild
Questnamen, Timer, Buttons und erzählerischer Text werden **nie in die Illustration eingebrannt**. Texte bleiben HTML, damit sie responsiv, übersetzbar und zugänglich sind.

### 4.4 Transparenz
Transparente Charakter-/Prop-Layer bekommen ausreichend Rand, damit Idle-Bewegungen nicht abgeschnitten werden.

### 4.5 Farbraum
sRGB für Webausgabe.

---

## 5. Responsive Komposition

Desktop und Mobile nutzen dieselbe Welt, aber nicht zwingend denselben Zuschnitt.

Für zentrale Szenen werden mindestens zwei Kompositionsvarianten geplant:

- **Landscape:** 16:9 bzw. breite Desktop-Komposition
- **Portrait:** 9:16 bzw. mobile Komposition

Wo möglich werden Ebenen statt zwei komplett unterschiedlicher Bilder verwendet. Der Code darf Position, Skalierung und Cropping der Layer pro Breakpoint verändern.

### Safe Zones
Keine narrativ wichtigen Details in äußerste 10 % der Bildränder legen. Timer-/Textzone muss vorab definiert sein.

---

## 6. Layer-Konvention für Quest-Szenen

Eine Region kann aus wiederverwendbaren Layern bestehen:

```text
regions/
  whispering-forest/
    background.webp
    midground.webp
    foreground.webp
    fog.webp
    light-mask.webp
    beats/
      scout-light-01.webp
      scout-light-02.webp
      scout-light-03.webp
      scout-light-04.webp
```

Nicht jede Quest braucht vier komplett neue Vollbilder. Bevorzugt werden:
- gemeinsamer Region-Hintergrund
- austauschbare Mittel-/Vordergründe
- questbezogene Detail-Layer
- Licht-/Wetterzustände

So können viele Quests aus wenigen hochwertigen Bausteinen entstehen.

---

## 7. Charakter-Layering

Charaktere müssen kosmetische Ausrüstung ermöglichen.

Empfohlene Renderreihenfolge:

```text
back-item
body
legs
shoes
upper-body
hair-back
head
face
hair-front
head-item
hand-item
accessory
foreground-effect
```

Alle Völker verwenden dieselben logischen Slots. Ein Item kann pro Volk eine angepasste Transform-/Anchor-Konfiguration bekommen.

### Wichtig
Nicht sofort den gesamten Itemkatalog illustrieren. Zuerst Körper, Silhouetten und wenige repräsentative Gegenstände stabilisieren.

---

## 8. Motion-System

### 8.1 Ambient Motion
Beispiele:
- Feuerflackern
- Rauch
- Blätter
- Nebel
- Stoff
- Haare
- Atmung
- Lichtpuls

Diese Bewegungen sind langsam, klein und unterbrechbar.

### 8.2 Journey Motion
Die Reise folgt der Fokuszeit. Szenenwechsel werden aus dem Questfortschritt abgeleitet, nicht von einem eigenen Timer.

### 8.3 Hero Motion
Stärkere Animation ist reserviert für:
- Aufbruch
- Questabschluss
- Truhe
- Level-Meilenstein
- Lagerentwicklung
- Begleiter erscheint

### 8.4 Reduced Motion
Für jede Hero-Animation muss vor Produktionsfreigabe ein statischer bzw. Fade-basierter Reduced-Motion-Endzustand definiert sein.

### 8.5 Formatwahl
- CSS / `motion`: UI, Fades, leichte Transforms
- SVG: einfache animierte World-/UI-Elemente
- Rive: nur dort, wo echte State-Machine-Animation einen Mehrwert hat
- Video: Ausnahme, nicht Standard

---

## 9. Truhenanimation

Die Truhe ist ein hochwertiger, aber **nicht casinoartiger** Moment.

Ablauf:
1. Truhe setzt sich / kurzer Materialimpuls
2. Verschluss öffnet
3. Deckel bewegt sich
4. warmes Licht tritt aus
5. Gegenstand wird präsentiert
6. UI blendet Fundinformationen ein

Keine Slotmachine-Sounds, kein Near-Miss, keine blinkenden Jackpotfarben.

Die vier Seltenheiten verändern nur Intensität, Materialakzent und Inszenierung – nicht die Dauer drastisch.

---

## 10. Audio-Bible

### 10.1 Grundsatz
Audio trägt Identität, ist aber niemals für Bedienung erforderlich.

### 10.2 Startpaket Musik
Für den Vertical Slice reichen zunächst:
1. **Camp Theme** – warm, ruhig, 3–6 min nahtlos loopbar
2. **Adventure Focus Theme** – zurückhaltend, 5–10 min loopbar
3. **Rest Ambience** – primär Umgebung, kaum Musik
4. **Departure Motif** – ca. 3 s
5. **Arrival / Completion Resolve** – ca. 3–5 s, musikalisch verwandt mit Departure

### 10.3 Startpaket Umgebung
- Lagerfeuer
- Nachtwald
- leichter Wind
- Blätter
- optional Eule / ferne Naturereignisse, sehr sparsam

### 10.4 Startpaket Effekte
- Buch öffnen / Seite
- Button / Auswahl sehr dezent
- Schritte / Ausrüstung beim Aufbruch
- Holzscheit
- Truhenverschluss
- Truhendeckel
- Item-Fund
- Gold
- Level-up später

### 10.5 Audio-Qualität
- keine abrupten Loop-Nähte
- keine dominanten Peaks während Fokus
- kein permanentes hochfrequentes Glitzern
- Lautheit zwischen Tracks konsistent
- Musik, Umgebung und Effekte getrennt steuerbar

### 10.6 Formate
Webauslieferung bevorzugt Opus/WebM oder AAC/M4A je Browserstrategie; Produktionsmaster verlustfrei archivieren (z. B. WAV).

### 10.7 Rechte
Jedes externe oder beauftragte Audioasset braucht dokumentierte Nutzungsrechte. Keine zufälligen YouTube-/Streaming-/Game-Tracks in Produktbuilds.

---

## 11. Asset Naming

Dateinamen: englisch, lowercase, kebab-case, ohne Leerzeichen.

Schema:

```text
<domain>-<context>-<name>-<variant>.<ext>
```

Beispiele:
- `camp-stage-01-background.webp`
- `camp-stage-01-fire.svg`
- `region-whispering-forest-background.webp`
- `quest-light-undergrowth-beat-02.webp`
- `character-goblin-hair-03.svg`
- `item-old-road-lantern.webp`
- `audio-camp-theme-01.ogg`
- `sfx-chest-latch-01.ogg`

---

## 12. Ordnerstruktur

Zielstruktur für auslieferbare Assets:

```text
public/
  assets/
    world/
      intro/
      camp/
      regions/
      quests/
    characters/
      human/
      elf/
      dwarf/
      goblin/
      orc/
      equipment/
    items/
    companions/
    ui/
      icons/
      frames/
      ornaments/
    motion/
    audio/
      music/
      ambience/
      sfx/
```

Quell-/Masterdateien gehören nicht zwingend in `public/`. Falls sie im Repo versioniert werden, liegen sie getrennt unter `design/source/` oder werden über ein klar benanntes externes Design-Repository/Storage verwaltet.

---

## 13. Asset Manifest

Assets werden nicht überall als freie Pfade in Komponenten verteilt. Spätestens mit dem Vertical Slice wird ein typisiertes Manifest eingeführt.

Beispiel:

```ts
export const assets = {
  camp: {
    stage01: {
      background: '/assets/world/camp/stage-01/background.webp',
      fire: '/assets/world/camp/stage-01/fire.svg',
    },
  },
} as const
```

Ziel:
- fehlende Assets früh erkennen
- Preloading gezielt steuern
- Varianten pro Breakpoint/Reduced Motion sauber abbilden
- spätere CDN-Migration vereinfachen

---

## 14. Performance-Budgets

Assets werden nach Nutzung priorisiert geladen.

### Initiale Seite
Intro/Lager soll auf typischer Verbindung schnell sichtbar werden. Große Hintergrundassets werden komprimiert und responsive ausgeliefert.

### Quest
Nur die aktuelle Region plus nächster Journey-Beat wird priorisiert. Spätere Beats werden während des laufenden Fokusblocks nachgeladen.

### Audio
Musik wird erst nach Nutzerinteraktion gestartet und bei Bedarf geladen. Keine komplette Audio-Bibliothek beim ersten Besuch.

### Hero Motion
Rive oder vergleichbare Runtime niemals in den initialen Bundle-Pfad zwingen, wenn sie erst später benötigt wird.

---

## 15. Qualitätscheck pro Asset

Ein Asset ist erst freigegeben, wenn folgende Fragen mit Ja beantwortet werden können:

- Sieht es nach derselben Welt wie unser Referenzlager aus?
- Passt es zur Adult-Cozy-Fantasy-Richtung?
- Ist es ruhig genug für eine Fokus-App?
- Funktioniert es in Desktop und Mobile?
- Sind wichtige Informationen nicht im Bild eingebrannt?
- Funktioniert die Szene ohne Animation?
- Gibt es bei wichtiger Animation einen Reduced-Motion-Zustand?
- Ist die Datei sinnvoll optimiert?
- Sind Nutzungsrechte geklärt?
- Ist der Dateiname und Speicherort konform?

---

## 16. Produktionsreihenfolge

**Nicht zuerst 11 Regionen produzieren.**

Verbindliche Reihenfolge:

1. Style Frames für Intro, Lager, Charakter und erste Quest
2. einen Referenzcharakter finalisieren
3. Startlager finalisieren
4. „Ein Licht im Unterholz“ mit vier Journey-Beats finalisieren
5. Rast finalisieren
6. erste Truhe + Weglaterne finalisieren
7. Departure-/Completion-Audio finalisieren
8. Camp-/Focus-Audio finalisieren
9. alles im Vertical Slice integrieren
10. erst nach visueller Abnahme auf weitere Völker, Regionen und Loot skalieren

Das Vertical-Slice-Paket ist die **visuelle Definition of Done** für die Welt.
