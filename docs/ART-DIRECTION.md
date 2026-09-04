# Art Direction

> Status: verbindlich · ergänzt [CONCEPT.md](CONCEPT.md), [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) und [ASSET-BIBLE.md](ASSET-BIBLE.md).

## Leitidee

> **Ein illustriertes Fantasy-Abenteuerbuch, dessen Seiten lebendig geworden sind.**

Die Anwendung ist eine **2D-illustrierte Adult-Cozy-Fantasy-Welt mit Pen-&-Paper-Seele**. Sie darf warm, geheimnisvoll und detailreich sein, aber nie kindlich, hektisch oder wie ein Mobile-RPG wirken.

Nicht gewollt:
- Chibi-/Kawaii-Proportionen
- fotorealistische Dark Fantasy
- neonfarbene Mobile-Game-Raritätsästhetik
- SaaS-Dashboards mit aufgeklebten Fantasytexturen
- UI, die wichtiger wirkt als die Welt

---

## Welt zuerst, UI danach

**Die Welt ist das Menü.** Das Lager ist nicht Illustration hinter einer Navigation, sondern die eigentliche Bühne für Navigation.

Diegetische Elemente wie Abenteuerbuch, Signalhorn, Rucksack, Sammlung und Händler sind visuell Teil der Szene. Technisch bleiben sie semantische, zugängliche Bedienelemente.

Fantasy-Metaphern dürfen niemals Bedienbarkeit verschlechtern. Einstellungen dürfen ein konventionelles Zahnrad sein; ein Zurück-Button darf wie ein Zurück-Button funktionieren.

---

## Perspektive

Lager und zentrale World-Screens nutzen eine leicht erhöhte diagonale **2.5D-/Diorama-Perspektive aus 2D-Art**.

Kein echtes 3D, kein City-Builder-Topdown.

Tiefe entsteht durch:
- Layer
- Überlagerung
- Größenunterschiede
- Licht
- Schatten
- atmosphärische Perspektive
- sehr zurückhaltende Parallax-Bewegung

Desktop darf breiter und panoramischer sein; Mobile wird neu komponiert statt nur verkleinert.

---

## Farbwelt

### Außenwelt
Tiefe, gedeckte Farben:
- Nachtblau
- Waldgrün
- Nebelgrau
- dunkles Violett
- Moos
- Erde
- Stein

### Lager
Warme Gegengewichte:
- Feuerlicht
- Bernstein
- Messing
- dunkles Holz
- Leder
- warmes Pergament
- Kerzenlicht

Licht übernimmt einen Teil der UX-Hierarchie. Interessante Orte dürfen durch warmes Licht, Reflexion oder kleine atmosphärische Veränderungen geführt werden statt durch rote Badges und Tutorial-Pfeile.

---

## Materialien

Die Welt fühlt sich handgemacht und benutzt an:

**Pergament · Holz · Leder · Stoff · patiniertes Metall · Stein · Tinte**

Ornamentik bleibt zurückhaltend. Nicht jeder Button braucht Goldrand, Runen und Schwerter.

---

## Typografie

Zwei Rollen:

### Narrativ
Charaktervolle buchartige Serifenschrift für Questnamen, Überschriften und kurze Erzählertexte.

### Funktional
Sehr gut lesbare Schrift für Timer, Zahlen, Einstellungen, längere Texte und Accessibility-Informationen.

Lesbarkeit steht immer über Atmosphäre.

---

## Charaktere

Stilisierte 2D-Fantasyfiguren, nicht chibi. Köpfe dürfen leicht größer als realistisch sein, damit Gesichter, Haare und Kosmetik bei kleiner Darstellung lesbar bleiben.

Silhouetten sollen die fünf Völker unterscheiden:
- Mensch: vielseitig, bodenständig
- Elf: elegant, naturverbunden
- Zwerg: kompakt, geerdet, gemütlich
- Goblin: klein, neugierig, expressiv
- Ork: kräftig, warm, Richtung „sanfter Riese“

Diese Merkmale sind visuelle Tendenzen, keine Persönlichkeitsvorgaben.

---

## Quest- und Regionenbilder

Jede Region besitzt eine erkennbare Identität über:
- Licht
- Vegetation
- Wetter
- Landschaft
- Architektur
- Farbtemperatur
- regionale Requisiten

Questbilder werden soweit sinnvoll **modular aus Ebenen** gebaut. Nicht jede Quest benötigt ein vollständig neues Gemälde. Ein Regionshintergrund kann mit unterschiedlichen Vordergründen, Lichtzuständen, Wetter- und Questdetails mehrere Geschichten tragen.

Produktionsdetails stehen in [ASSET-BIBLE.md](ASSET-BIBLE.md).

---

## UI & Icons

Icons dürfen leicht handgezeichnet bzw. graviert wirken, müssen aber auch klein eindeutig bleiben.

Funktionale Standards bleiben Standards. Ein Lautsprecher, Zahnrad oder Zurück-Pfeil muss nicht durch eine komplizierte Fantasy-Metapher ersetzt werden.

Overlays werden sparsam verwendet. Der Screen soll zuerst als Welt und erst danach als Interface gelesen werden.

---

## Rarität

Rarität wird ruhig inszeniert. Die vier Stufen dürfen eigene Akzentfarben und Material-/Lichtintensitäten haben, aber keine Neonränder, dauernden Partikel oder Slotmachine-Ästhetik.

Rarität wird nie ausschließlich durch Farbe kommuniziert.

---

## Motion

Leitbild: **lebendes Bilderbuch**.

Ambient Motion:
- Feuer
- Blätter
- Rauch
- Stoff
- Haare
- Atmung
- Licht
- Nebel

Motion belohnt einen Blick, fordert ihn aber nicht ein.

Stärkere Bewegung bleibt für Aufbruch, Questabschluss, Truhe, Level-Meilenstein, Lagerentwicklung und Begleiter reserviert.

Während Fokus bleibt alles langsam und zurückhaltend. Keine hektischen Kämpfe, kein permanentes Pulsieren, keine Partikelüberladung.

Reduced Motion erhält gleichwertige statische/Fade-basierte Zustände.

---

## Audio

Audio ist ein Teil der Identität, aber nie Voraussetzung.

- Camp: warme Musik + Ambiente
- Fokus: Abenteuer, Natur, Lagerfeuer/Ambiente oder Stille
- Aufbruch: wiederkehrendes ca. 3-Sekunden-Motiv
- Questabschluss: musikalische Auflösung statt Standard-Beep
- Rast: Musik deutlich reduzieren, Umgebung stehen lassen
- Truhe: Holz, Metall, Verschluss, kurzer Fundakzent – kein Glücksspielklang

Musik, Umgebung und Effekte sind getrennt regelbar.

Die Produktionsanforderungen und das erste konkrete Assetpaket stehen in [ASSET-BIBLE.md](ASSET-BIBLE.md).

---

## Art-Direction-Prüffragen

Vor Freigabe jedes Assets:

> **Könnte dieses Element eine Seite unseres lebendig gewordenen Abenteuerbuchs sein?**

und

> **Hilft es der Atmosphäre, ohne um Aufmerksamkeit zu kämpfen?**

Wenn eine der Antworten Nein ist, wird das Asset überarbeitet.
