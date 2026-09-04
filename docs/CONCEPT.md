# Concept V2

> Status: **verbindliche Produktspezifikation** · Stand 2026-09-04
>
> Dieses Dokument ist die Source of Truth für **Was** und **Warum** des Produkts. Detailumsetzung liegt in `SCREENS.md`, `DESIGN-SYSTEM.md`, `ART-DIRECTION.md`, `ARCHITECTURE.md` und `SYNC-PROTOCOL.md`.

## 1. Vision & Produktstrategie

Das Produkt ist eine gamifizierte Fokus-Anwendung in einer lebendigen Cozy-Fantasy-Welt. Reale Fokuszeit treibt die virtuelle Reise voran: Nutzer wählen keine abstrakte Timerdauer, sondern eine Quest. Während sie im echten Leben konzentriert arbeiten, reist ihr Charakter automatisch durch eine Fantasywelt. Nach erfolgreichem Fokus kehrt er mit Erfahrung, Gold, Geschichten und gelegentlichen Fundstücken zurück.

**One-Liner:** Arbeit wird zum Abenteuer: Wähle eine Quest, fokussiere dich und lass mit deiner echten Zeit eine persönliche Fantasywelt wachsen.

### Zielgruppe
Menschen, denen Anfangen, Strukturieren oder längeres Fokussieren schwerfällt und für die klassische Produktivitätsanwendungen zu nüchtern oder druckorientiert sind. Fantasy-, Pen-&-Paper-, Gaming- oder Brettspielaffinität hilft, ist aber keine Voraussetzung.

### Kernemotionen
**Geborgenheit → Eintauchen → Vorfreude**.

### Designprinzipien
- **Die Welt ist das Menü.**
- **Fokus vor Gamification.** Während Fokus keine nötige Interaktion.
- **Sanfte Verbindlichkeit statt Zwang.** Keine Strafen, keine Schuldkommunikation.
- **Reale Zeit ist der Fortschritt.**
- **Solo ist vollständig.** Multiplayer ist optional.
- **Progression bedeutet Geschichte, nicht Macht.**
- **Belohnung ohne Manipulation.** Keine bezahlten Lootboxen, keine FOMO-Mechaniken.

### Anti-Ziele
Kein komplexes RPG, kein Tamagotchi, kein Housing-Editor, kein Taskmanager, kein soziales Netzwerk, kein Produktivitätswettbewerb, kein Überwachungswerkzeug.

### Ton
Warm, ruhig, charmant, leicht humorvoll, nie albern oder pathetisch. Beispiel: „Ah. Da bist du ja. Das Feuer wusste offenbar, dass du wiederkommst.“

---

## 2. Welt & Lager

Das persönliche **Lager** ist Heimat, Navigation, Fortschrittsanzeige und Erinnerung an vergangene Abenteuer.

### Diegetische Navigation
- Abenteuerbuch → Quests & Fokus
- Charakter / Rucksack → Ausrüstung & Profil
- Sammlung → Sets, Relikte, besondere Funde
- Signalhorn → Gefährten & Party
- Händlerwagen → kosmetische Käufe mit Gold
- Einstellungen bleiben als konventionelles Zahnrad erreichbar

### Lagerentwicklung
Das Lager ist von Anfang an schön und gemütlich. Fortschritt bedeutet **klein → gewachsen → persönlich → voller Erinnerungen**, nicht „hässlich → hübsch“.

Stufen:
1. Kleines Lager
2. Reiselager
3. Abenteurerlager
4. Außenposten

Das strukturelle Wachstum endet bewusst; danach wächst vor allem die persönliche Geschichte.

### Individualisierung
Kuratierte Dekorationsslots statt freier Platzierung, z. B. Feuerstelle, Zelt, Licht, Sitzbereich, Banner, kleine Deko, großes Erinnerungsstück, Begleiterplatz.

### Erinnerungen
Besondere Quests, Sets und Meilensteine können dauerhafte Spuren im Lager hinterlassen: Karten, Relikte, Pflanzen, Trophäen, Begleiterplätze.

### Regionen
Mehrere visuell und erzählerisch unterschiedliche Regionen. Keine lineare Levelleiter, keine Power-Gates. Regionen bleiben langfristig relevant.

### Rückkehr
Abwesenheit hat keine negativen Folgen. Nichts verfällt, kein Begleiter wird traurig, kein Lager verwahrlost.

---

## 3. Gameplay & Quests

### Core Loop
**Lager → Abenteuerbuch → Quest wählen → Aufbrechen → Fokus → Questabschluss → Rast → Truhe → Lager**

Die reale Fokusarbeit ist die eigentliche Spielhandlung. Wer während einer Quest nicht auf den Bildschirm schaut, verpasst nichts Notwendiges.

### Abenteuerbuch
Nachfüllender Questpool, ungefähr zehn Quests sichtbar. Keine Fristen, kein Ablauf, kein Leerstand. Dauer immer prominent.

Filter/Lesezeichen: **15 · 25 · 50 · Episch**.

### Questtypen
| Typ | Fokusdauer | Struktur |
|---|---:|---|
| Kundschaftergang | 15 min | kleine Begegnung / Erkundung |
| Kurze Quest | 25 min | normaler Fokusblock |
| Mittlere Quest | 50 min | größere Reise |
| Epische Quest | 3 × 25 min | drei Akte mit Rasten; Boss in Akt III |

Epische Akte werden gespeichert und können an verschiedenen Tagen fortgesetzt werden.

### Quest-Erzählstruktur
1. **Vorher:** 1–2 Sätze Auftrag
2. **Während:** visuelle, automatische Reise ohne nötige Interaktion
3. **Nachher:** kurze erzählerische Auflösung

### Aufbruch
3–5 Sekunden Ritual: Charakter steht auf, nimmt Ausrüstung, Audio wechselt, Timer beginnt.

### Fokus-Screen
- Questname
- dominante 2D-Abenteuerszene
- sichtbarer, integrierter Timer
- atmosphärischer Fortschrittsindikator
- Pause
- Audio
- optional Vollbild
- Quest verlassen

**Der Timer ist Teil der Abenteuerwelt, nicht ein Overlay auf der Abenteuerwelt.**

Keine Inventar-, Händler-, Sammlungs-, Chat- oder Interaktionsmechaniken während Fokus.

### Questabschluss
Bei `00:00` löst sich die Szene selbst auf. Kein schriller Alarm.

Belohnung:
- XP
- Gold
- Truhe verdient

**Wichtig:** Die Reihenfolge ist **Questabschluss → Rast → Truhe öffnen**.

### Rast
Normal ca. 5 Minuten, lange Rast perspektivisch nach kumulierter Fokuszeit statt nach Questanzahl. Eine kleine optionale Handlung (z. B. Holz auflegen), danach aktive Einladung, den Bildschirm zu verlassen. Rast kann ohne Strafe übersprungen werden.

### Abbruch
Neutraler Dialog: bisherige Fokuszeit bleibt erhalten, Quest wird nicht abgeschlossen. Tatsächlich fokussierte Minuten geben XP; kein Questabschluss-Gold, keine Truhe.

---

## 4. Progression, Economy & Loot

### XP
**1 tatsächlich fokussierte Minute = 1 XP.**

Keine Daily-XP, Streak-Boni, Längenmultiplikatoren oder „Perfect Focus“-Boni.

### Level-Zielwerte
| Level | kumulierte Fokuszeit |
|---:|---:|
| 2 | 30 min |
| 5 | ca. 3 h |
| 10 | ca. 10 h |
| 20 | ca. 30 h |
| 30 | ca. 60 h |
| 50 | ca. 150 h |
| 75 | ca. 300 h |
| 100 | ca. 500 h |

Kein hartes Max-Level. Level geben keine Produktivitätsvorteile.

### Level-Meilensteine
- normale Level: kleine kosmetische Belohnung
- alle 5 Level: stärkere kosmetische Belohnung
- alle 10 Level: großer sichtbarer Welt-/Charaktermoment, z. B. Begleiter oder Lagerentwicklung

### Gold
**1 Gold pro 5 erfolgreich abgeschlossenen Fokusminuten.**

| Quest | Gold |
|---|---:|
| 15 min | 3 |
| 25 min | 5 |
| 50 min | 10 |
| Epic 3×25 | 15 gesamt |

Kleine narrative Bonusbeträge sind erlaubt. Gold kauft ausschließlich Kosmetik.

### Loot
Jede erfolgreich abgeschlossene Quest bzw. jeder entsprechende Questabschnitt erzeugt eine Truhe. Wenn eine Truhe ein Item enthält, ist es **neu**. Keine Duplikate.

Vier Seltenheitsstufen:
- Gewöhnlich 60 %
- Ungewöhnlich 27 %
- Selten 11 %
- Außergewöhnlich 2 %

Seltenheit ist rein kosmetisch und inszenatorisch.

### Drei Herkunftsbereiche
1. **Abenteuerfunde** – quest-only
2. **Händlerwaren** – mit Gold auswählbar
3. **Meilensteinobjekte** – weder normal kaufbar noch lootbar

### Sets
Thematische Sets mit sichtbarem Fortschritt, z. B. „Relikte des Flüsterwaldes 3/5“. Set-Abschluss kann Begleiter, Lagerobjekt oder besondere kosmetische Belohnung geben.

### Ausrüstung
Kosmetische Slots: Kopf, Oberkörper, Beine, Schuhe, Rücken, Hand/Werkzeug/Waffe, Accessoire. Ein Item funktioniert für alle Völker mit proportionaler Anpassung. Freigeschaltete Looks bleiben dauerhaft verfügbar; kein Auto-Equip.

---

## 5. Charaktere & Individualisierung

### Völker
**Mensch · Elf · Zwerg · Goblin · Ork**

Reine Identität, keine Stats, keine Timerprofile, keine Boni.

### Keine Klassen
Es gibt keine Klassen und keine mechanischen Builds.

### Keine Geschlechtsauswahl
Die Anwendung fragt nicht nach Geschlecht/Gender. Körperform, Frisur, Bart, Farben und Ausrüstung sind frei kombinierbar.

### V1-Charaktererstellung
- Volk
- Körperform / Silhouette
- Haut- bzw. Fantasyfarbe
- Frisur
- Haarfarbe
- Name

Keine Tattoos, Narben, Patches, Make-up-Systeme oder Detailslider.

### Stil
Stilisierte 2D-Fantasyfiguren, erwachsene Cozy Fantasy, nicht chibi. Mensch bodenständig, Elf elegant/naturverbunden, Zwerg kompakt/gemütlich, Goblin neugierig/expressiv, Ork stark aber warm („sanfter Riese“). Das sind Art-Tendenzen, keine vorgeschriebenen Persönlichkeiten.

### Begleiter
Rein kosmetisch-emotional, keine Werte, keine Bedürfnisse, keine Schuldmechanik. Können aus Meilensteinen, Sets oder besonderen Quests stammen.

---

## 6. Solo, Gefährten & Party

Solo ist Standard und vollständig.

### Einladung
Signalhorn im Lager. **Einladungslink ist Standard**, kurzer Party-Code bleibt Fallback. Konto + Charakter sind Pflicht.

Keine Freundesanfrage nötig. Nach einer gemeinsamen Quest kann man jemanden optional **als Gefährten merken**.

### Gemeinsame Quest
- eine gemeinsame Quest
- eine gemeinsame Uhr
- Bereitschaftsprüfung für alle
- kein Dungeon Master
- keine automatische Countdown-Startlogik
- alle Charaktere sichtbar in derselben Szene

### Fokus
**Kein Chat, keine Emojis, keine Pings, keine Reactions.** Leitidee: **Zusammen allein.**

### Abbruch
Gilt nur für die eigene Person. Andere laufen weiter und verlieren nichts.

### Rewards
Individuelle Belohnungen und individuelle Truhen. **Keine Party-Truhe.** Optional kleiner additiver Goldbonus, kein XP-Multiplikator, keine besseren Lootchancen.

### Laufende Quest
Kein erstmaliger Drop-in mitten in eine laufende Quest. Eingeladene warten auf die nächste Quest. Reconnect/Reload ist dagegen eine Wiederherstellung und muss funktionieren.

---

## 7. UX, Onboarding & User Journey

### Einstieg
Erster Besuch beginnt in der Welt, nicht auf einer Marketingfolie.

> „Ah. Da bist du ja.“
>
> „Wir haben noch einen Platz am Feuer.“

Danach minimaler Account und minimale Charaktererstellung.

### Erstes Lager
Bereits gemütlich, aber klein. Das Abenteuerbuch lenkt subtil Aufmerksamkeit auf sich.

### Erste Quest
Kuratiert: **„Ein Licht im Unterholz“ · 15 Minuten**. Es ist eine echte Quest, kein Tutorial-Simulator.

### Erstes Erlebnis
Aufbruch → Fokus → Abschluss → XP/Gold + Truhe → Rast → erste Truhe.

Die erste Truhe ist **deterministisch**, z. B. **Alte Weglaterne**. Danach erscheint das Objekt sichtbar im Lager. So lernt die Person: **Meine echte Fokuszeit verändert diese Welt.**

### Progressive Discovery
Sammlung, Händler, Sets und Begleiter werden erst dann sichtbar/erklärt, wenn sie relevant werden.

### Wiederkehrende Nutzung
Lager → Quest → Aufbrechen soll bei klarer Absicht in ca. 10–15 Sekunden möglich sein.

### Gerätewechsel
Laufende Quest kann auf anderem Gerät mit korrekter Restzeit fortgesetzt werden: „Du bist noch unterwegs.“

---

## 8. Art Direction, Motion & Audio

### Visuelle Leitidee
**Ein illustriertes Fantasy-Abenteuerbuch, dessen Seiten lebendig geworden sind.**

2D-Illustration mit leicht erhöhter diagonaler 2.5D-/Diorama-Perspektive. Kein echtes 3D.

### Zielästhetik
Adult Cozy Fantasy mit Pen-&-Paper-Seele. Nicht chibi, nicht fotorealistisch-düster, nicht Mobile-Game-glitzernd, nicht SaaS mit Fantasy-Skin.

### Farb- und Materialwelt
Draußen tiefe Blau-, Grün-, Grau- und Violetttöne. Lager warm mit Feuer, Bernstein, Messing, Leder, Holz und Pergament. Materialien: Pergament, Holz, Leder, Stoff, patiniertes Metall, Stein, Tinte.

### Licht
Licht ist UX-Mittel: Buch, Händler, neue Funde oder wichtige Orte können durch Licht statt Badges/Pfeile geführt werden.

### Typografie
Charaktervolle Serifenschrift für Titel/Narration, sehr gut lesbare funktionale Schrift für Timer, Zahlen, Einstellungen und längere Texte.

### Motion
Lebendes Bilderbuch: Feuer, Blätter, Stoff, Haare, Atmung, Licht. Große Bewegungen nur für bedeutende Momente. Fokusphase bleibt ruhig.

### Audio
Drei getrennte Ebenen: Musik, Umgebung, Effekte. Camp ruhig und atmosphärisch. Kurzes wiederkehrendes Aufbruchsmotiv. Fokus-Modi: Abenteuermusik, Natur, Lagerfeuer/Ambiente, Stille. Questende löst das Motiv auf statt zu piepen. Truhen klingen materiell, nicht wie Glücksspiel.

---

## 9. Accessibility, Settings & Schutzmechanismen

Accessibility ist Bestandteil des Designs.

### Verbindlich
- semantische HTML-Strukturen
- sinnvolle Accessible Names
- vollständige Tastaturbedienung
- sichtbare Fokuszustände
- Informationen nie nur über Farbe
- ausreichend große Touch-Ziele
- Browser-Zoom und größere Schrift müssen funktionieren
- `prefers-reduced-motion` respektieren + In-App-Option
- wichtige Informationen nie nur per Audio

### Timerdarstellung
- exakt: `18:42`
- vereinfacht: „Noch etwa 20 Minuten“
- atmosphärisch: nur visueller Reisefortschritt

Keine Auswirkung auf Rewards.

### Ruhiger Fokus
Reduzierte visuelle Veränderung, keine schlechteren Belohnungen.

### No-Dark-Patterns-Charta
- keine Streak-Pflicht
- keine Daily Rewards
- keine künstliche Verknappung
- keine Countdown-Shops
- keine bezahlten Lootboxen
- keine absichtlichen Duplikate
- keine Vernachlässigungsmechaniken
- keine Schuldkommunikation
- keine Produktivitätsrankings
- keine Nachteile für Accessibility-Einstellungen
- keine Mechanik, die Menschen absichtlich länger am Bildschirm hält

**Leitregel:** Die Anwendung respektiert Aufmerksamkeit als begrenzte Ressource – sie versucht nicht, sie zu besitzen.

---

## 10. Technische Leitplanken, MVP & Roadmap

### Web First
Responsive Web-App, Desktop als größte Bühne, Mobile voll funktionsfähig. Native Apps nicht im initialen Scope.

### Persistenz
Account-basierte serverseitige Persistenz für Charakter, XP, Level, Gold, Inventar, Sammlung, Lager, Begleiter, Questfortschritt und relevante Einstellungen.

### Zeitmodell
Der Timer zeigt Zustand an, er ist nicht selbst der Zustand. Laufende Quest basiert auf autoritativer Zeitinformation und überlebt Reload, Gerätewechsel und kurze Verbindungsabbrüche.

### Journey statt Game Engine
Visuelle Reise wird aus `elapsed / duration` abgeleitet. Keine Physik- oder Kampf-Simulation notwendig.

### Content datengetrieben
Quests, Regionen, Items, Sets und Lootpools sollen aus Daten statt hart verdrahteter UI-Logik entstehen.

### Loot zuverlässig
Reward-Ereignisse autoritativ und nachvollziehbar; Besitzstand verhindert Duplikate.

### Party-Sync
Gemeinsame Session mit Mitgliedern, Bereitschaft, Quest, Startzeit und Status. Reconnect ist Wiederherstellung, kein neuer Beitritt.

### Progressive Loading
Nur aktuelle/relevante Assets priorisieren. Fokusfunktion muss robuster sein als Animation, Audio oder dekorative Assets.

### MVP
Zwingend:
- Account & Login
- minimale Charaktererstellung mit fünf Völkern
- Startlager
- Abenteuerbuch
- 15/25/50-Minuten-Quests
- Aufbruchsritual
- Fokus-Screen mit integriertem Timer
- Pause & Abbruch
- XP, Gold, Questabschluss
- Rast vor Truhe
- No-Duplicate-Loot
- Inventar / kosmetische Ausrüstung
- erste sichtbare Lagerprogression
- Basis-Audio
- Accessibility-Grundfunktionen
- responsive Desktop/Mobile Experience

Nicht im ersten MVP:
- Party
- Gefährtenliste
- großer Händlerumfang
- große Set-Sammlung
- Begleitersystem
- vollständige Lagerstufen
- epische Quests
- native Apps/PWA-Extras

### Roadmap
1. **Vertical Slice:** Waldintro → Account → Charakter → Lager → „Ein Licht im Unterholz“ → 15 Min Fokus → Abschluss → Rast → deterministische Weglaterne.
2. **Core MVP:** mehrere Regionen, 15/25/50, XP/Level/Gold/Loot/Ausrüstung, erste Lagerentwicklung, Settings, Sync.
3. **Weltvertiefung:** Händler, Sets, Begleiter, mehr Regionen, Lagerstufen.
4. **Gemeinsam aufbrechen:** Signalhorn, Link/Code, Ready Check, gemeinsame Uhr, Gefährten.
5. **Epische Abenteuer:** 3×25 mit persistentem Aktfortschritt.
6. **Langfristige Welt:** weitere Begleiter, Sets, Regionen, Events, PWA/weitere Plattformen.

### Oberste technische Leitregel
**Die Fokuszeit der Person ist heiliger als die Spielinszenierung.**
