# Bewegung und Grafik

> Zuständigkeit: `#SENDEV` (Architektur) · `#junDev` (Umsetzung)
> Entscheidungen: ADR-007 bis ADR-010 in [DECISIONS.md](DECISIONS.md)

## Der Grundsatz

**Animation bekommt keine eigene Uhr.**

```
Position der Gruppe auf dem Weg  =  verstrichene Zeit / Quest-Dauer
```

Das ist dasselbe Prinzip wie beim Timer selbst — abgeleiteter Zustand statt laufender
Schleife. Die Wanderung ist damit kein Zustand, der gepflegt werden muss, sondern ein
Wert, der berechnet wird.

Die Folgen sind der eigentliche Gewinn:

| Situation | Verhalten |
|---|---|
| Tab 20 Minuten im Hintergrund | Beim Zurückkehren steht die Gruppe sofort an der richtigen Stelle |
| Laptop-Standby über eine halbe Quest | Korrekt, ohne Aufholen |
| Mitglied tritt bei Minute 17 bei | Sieht die Gruppe genau dort, wo sie ist |
| Zwei Geräte derselben Party | Zeigen dieselbe Stelle des Weges, ohne einen einzigen Sync-Aufruf |

Es kostet nichts, weil es auf demselben `requestAnimationFrame`-Tick mitläuft, der
ohnehin den Timer zeichnet. Es gibt keine zweite Schleife.

```ts
// lib/timer/ — rein, ohne React, ohne Date.now()
export function journeyProgress(phase: PartyPhase, now: number): number {
  const elapsed = now - Date.parse(phase.phase_started_at)
  return clamp01(elapsed / (phase.phase_duration_s * 1000))
}
```

## Was wir bewusst nicht laden

**Keine Game-Engine.** Phaser, PixiJS und Three.js sind hier die falsche Antwort.

Ein WebGL-Canvas, der 50 Minuten am Stück rendert, ist genau das, was eine Fokus-App
nicht tun darf: Er zieht Akku, lässt den Lüfter angehen und holt sich Aufmerksamkeit,
die der Nutzer gerade woanders braucht. Dazu kämen 150–600&nbsp;kB Laufzeit für
Fähigkeiten — Physik, Sprite-Batching, Szenengraph — von denen wir keine einzige nutzen.

Was wir tatsächlich brauchen, ist eine Kulisse, die sich sehr langsam bewegt, und
**einen** Moment, der aufwendig ist. Dafür reichen SVG und CSS.

## Die drei Ebenen

| Ebene | Womit | Wo |
|---|---|---|
| **Ruhige Kulisse** | SVG-Ebenen, `transform: translateX`, gesteuert vom Fortschritt | Wanderung während der Quest, Lagerfeuer während der Rast |
| **Übergänge** | `motion` (motion.dev), 120–600&nbsp;ms | Phasenwechsel, Panels, Listen |
| **Der eine Moment** | **Rive**, State Machine | Truhe öffnen, Stufenaufstieg, Party-Truhe |

### Warum Rive für die Truhe

Die Truhe hat fünf Seltenheitsstufen. Handanimiert wären das fünf Varianten derselben
Choreografie, die auseinanderlaufen, sobald jemand eine davon anfasst.

Rive löst das über eine **State Machine**: ein Asset, ein Eingang `rarity` (0–4), und
die Übergänge gehören zur Datei statt zum Code. Eine Designerin ändert das Timing, ohne
dass jemand ein Deployment braucht.

Der Preis ist ehrlich zu nennen: rund 200&nbsp;kB WASM und die Voraussetzung, dass
jemand im Team den Rive-Editor bedient. Deshalb ist Rive **nur** für die Höhepunkte
vorgesehen — nicht für Übergänge, nicht für die Kulisse, nicht für Icons.

**Ladeverhalten:** Die Rive-Laufzeit wird erst geladen, wenn die erste Quest fast
vorbei ist (`progress > 0.9`), nicht beim Seitenaufruf. Wer die App öffnet, um zu
arbeiten, soll keine Animationslaufzeit herunterladen.

**Fallback ist Pflicht, nicht Kür:** Lädt Rive nicht, öffnet sich die Truhe als
CSS-Überblendung mit demselben Ergebnis. Dieselbe Fassung dient unter
`prefers-reduced-motion`.

## Budget

Verbindlich, wird in CI geprüft:

| | |
|---|---|
| JavaScript auf dem Quest-Screen | ≤ 120&nbsp;kB gzip, **ohne** Rive |
| Rive-Laufzeit | nachgeladen, nie im ersten Bundle |
| Bilder im Erstaufruf | ≤ 250&nbsp;kB |
| CPU während einer laufenden Quest | < 2&nbsp;% auf einem Laptop von 2020 |

Der letzte Punkt ist der wichtigste und der einzige, den man nicht messen kann, ohne
es zu versuchen. Er gehört in jedes Review eines Animations-PRs.
