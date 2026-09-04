# Bewegung und Grafik

> Zuständigkeit: Architektur + Design/Frontend
> Gilt zusammen mit [CONCEPT.md](CONCEPT.md), [ART-DIRECTION.md](ART-DIRECTION.md) und [ASSET-BIBLE.md](ASSET-BIBLE.md).

## Der Grundsatz

**Animation bekommt keine eigene fachliche Uhr.**

```text
Journey-Fortschritt = verstrichene Fokuszeit / Quest-Dauer
```

Die Reise ist abgeleiteter Zustand. Dadurch ist sie nach Hintergrund-Tab, Standby, Reload oder Gerätewechsel sofort an der richtigen Stelle, ohne dass eine zweite Animations-Zeitachse synchronisiert werden muss.

Bei Gruppenquests sehen wiederverbundene Mitglieder denselben Fortschritt. Ein erstmaliger Drop-in in eine bereits laufende Quest ist nach Concept V2 nicht vorgesehen.

---

## Keine Game Engine

Phaser, PixiJS und Three.js sind für das Kernprodukt unnötig. Wir brauchen keine Physik, kein Echtzeit-Kampfsystem und keinen permanent rendernden Szenengraphen.

Bevorzugt werden:
- CSS für kleine Ambient-Effekte
- SVG für einfache World-/UI-Elemente
- `motion` für Übergänge und leichte Transforms
- zeitabhängige Layer-/Szenenwechsel für Quest-Journeys
- Rive nur dort, wo eine echte State-Machine-Animation einen klaren Mehrwert hat

Die Fokusphase soll CPU- und akkusparend bleiben.

---

## Ebenenmodell

Ein Quest- oder Lagerbild kann aus mehreren 2D-Ebenen bestehen:

1. Hintergrund
2. Mittelgrund
3. Vordergrund
4. Charakter(e)
5. atmosphärische Ebene (Nebel, Licht, Blätter, Glut)
6. UI

Die Ebenen dürfen sich mit unterschiedlichen, sehr kleinen Geschwindigkeiten bewegen. Bewegung bleibt unterstützend und nie aufmerksamkeitsfordernd.

---

## Journey-Beats

Questtypen können unterschiedliche Beat-Zahlen haben:
- Kundschaftergang 15 min: ca. 3–4 Zustände
- Kurze Quest 25 min: ca. 4 Zustände
- Mittlere Quest 50 min: ca. 5 Zustände
- Epische Quest: pro 25-Minuten-Akt eigene Zustände; Arc-Fortschritt bleibt über Akte persistent

Ein Beat ist kein zwingend komplett neues Vollbild. Oft reicht ein anderer Vordergrund, Lichtzustand, Questdetail oder Ausschnitt derselben Region.

---

## Aufbruch

Aufbruch ist ein 3–5 Sekunden langes Ritual:
- Charakter richtet sich auf / nimmt Ausrüstung
- Scene/Audio wechselt
- kurze Kamerabewegung oder Überblendung
- Fokuszeit beginnt

Reduced Motion: statischer Zustandswechsel mit kurzer Überblendung.

---

## Fokusphase

Während Fokus gilt:
- keine hektischen Animationen
- keine dauernden UI-Pulse
- keine Bildschirmerschütterungen
- keine Action-Choreografie, die Aufmerksamkeit verlangt
- keine nötige Interaktion

Ambient Motion darf laufen, muss aber klein und pausierbar sein.

### Ruhiger Fokus
Im Modus „Ruhiger Fokus“ werden Szenenwechsel und Ambient Motion weiter reduziert. Die fachliche Journey und Rewards bleiben unverändert.

---

## Questabschluss

Der Questabschluss ist kurz, eindeutig und wärmer/größer als die Fokusphase:
- Zielzustand der Szene
- musikalische Auflösung
- XP/Gold/Truhe verdient
- Übergang zur Rast

Die Truhe wird **nicht vor der Rast geöffnet**.

---

## Rast

Rast ist der visuell ruhigste Zustand:
- keine Journey-Bewegung
- Feuer/Umgebung nur subtil
- Musik stark reduziert oder aus
- eine optionale kleine Handlung
- aktive Einladung, den Bildschirm zu verlassen

---

## Truhe

Die Truhe ist ein hochwertiger Discovery-Moment nach der Rast.

Rive ist möglich, aber nicht verpflichtend. Wenn Rive eingesetzt wird, muss:
- die Runtime lazy geladen werden
- die Animation alle vier Seltenheiten unterstützen
- ein CSS-/statischer Fallback existieren
- Reduced Motion einen gleichwertigen Endzustand erhalten

Keine Party-Truhe. Gruppenmitglieder erhalten individuelle Rewards.

---

## Reduced Motion

`prefers-reduced-motion` wird respektiert und durch eine In-App-Einstellung ergänzt.

Reduziert/entfernt werden insbesondere:
- Parallax
- große Kamerafahrten
- Zooms
- starke Transform-Animationen

Atmosphäre bleibt über Illustration, Licht und sanfte Fades erhalten.

---

## Performance-Leitplanken

- keine Game Engine im Quest-Screen
- große World-Assets responsive und komprimiert ausliefern
- nur aktuelle Region und nächste Beats priorisiert laden
- Audio erst bei Bedarf und nach Nutzerinteraktion laden
- Hero-Motion-Runtimes nie in den initialen Bundle-Pfad zwingen
- Animation darf Fokusfunktion nie blockieren

Die konkreten Assetformate, Layer-Konventionen und Produktionsschritte stehen in [ASSET-BIBLE.md](ASSET-BIBLE.md).

> **Wenn Motion ausfällt, muss der Timer trotzdem perfekt funktionieren.**
