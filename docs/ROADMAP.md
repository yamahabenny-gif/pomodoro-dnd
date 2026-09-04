# Roadmap – Concept V2

> Reihenfolge folgt der Produkthypothese: **erst beweisen, dass die Solo-Fokusreise emotional funktioniert; dann Tiefe und Multiplayer ergänzen.**

Die verbindlichen Produktentscheidungen stehen in [CONCEPT.md](CONCEPT.md). Diese Roadmap beschreibt nur die Umsetzungsreihenfolge.

## Phase 0 · Concept V2 & Konsolidierung

- Concept V2 als Source of Truth
- widersprüchliche Alt-Dokumentation markieren bzw. migrieren
- vorhandene Quest-, Loot-, Journey- und Sync-Logik gegen Concept V2 prüfen
- technische Grundlagen nicht neu erfinden, wenn vorhandene Implementierung kompatibel ist

**Abnahme:** Neue Entwicklung kann eine Produktfrage eindeutig aus `CONCEPT.md` beantworten.

---

## Phase 1 · Vertical Slice

Ein einziger, nahezu final wirkender Nutzerweg:

**Waldintro → Account → Charakter → kleines Lager → Abenteuerbuch → „Ein Licht im Unterholz“ → 15 Minuten Fokus → Questabschluss → Rast → deterministische Weglaterne → sichtbare Veränderung im Lager**

Enthalten:
- responsive Web-Grundlage
- minimale Charaktererstellung: Volk, Körperform, Haut-/Fantasyfarbe, Frisur, Haarfarbe, Name
- Lager als Hub
- integrierter, serverzeitfähiger Timer
- ruhige 2D-Journey
- Aufbruchs- und Abschlussritual
- XP/Gold
- Rast vor Truhe
- deterministischer erster Lootfund
- Basis-Audio
- Reduced Motion / Timerdarstellung / Mute

**Abnahme:** Der komplette erste 15-Minuten-Loop fühlt sich wie das Zielprodukt an und beweist die emotionale Kernhypothese.

---

## Phase 2 · Core MVP

Den Vertical Slice zu einer regelmäßig nutzbaren Solo-App ausbauen.

Enthalten:
- nachfüllendes Abenteuerbuch
- 15/25/50-Minuten-Quests
- mehrere Regionen
- persistente laufende Quests und Gerätewechsel
- XP- und Levelsystem
- Gold
- Truhen und No-Duplicate-Loot
- vier Seltenheitsstufen 60/27/11/2
- kosmetische Ausrüstung / freigeschaltete Looks
- Inventar / Sammlung-Grundlage
- erste Lagerprogression
- Settings und Accessibility vollständig für den MVP
- responsive Desktop-/Mobile-Komposition

**Abnahme:** Solo kann dauerhaft genutzt werden, ohne Party oder spätere Metasysteme zu benötigen.

---

## Phase 3 · Weltvertiefung

- Händlerwagen und kosmetische Gold-Economy
- thematische Sets
- Set-Abschlussbelohnungen
- weitere Regionen und Questinhalte
- kuratierte Lager-Dekorationsslots
- Lagerstufen: Kleines Lager → Reiselager → Abenteurerlager → Außenposten
- besondere Quest-Erinnerungen
- erster Begleiter und weitere Meilensteinmomente

**Abnahme:** Langfristiger Fortschritt wird im Lager sichtbar und erzählt persönliche Geschichte, ohne Power-Progression zu erzeugen.

---

## Phase 4 · Gemeinsam aufbrechen

Solo bleibt unverändert vollständig.

Enthalten:
- Signalhorn im Lager
- Einladungslink als Standard
- kurzer Party-Code als Fallback
- Account + Charakter verpflichtend
- optional „als Gefährten merken“ nach gemeinsamer Quest
- Bereitschaftsprüfung, kein Dungeon Master
- gemeinsame serverbasierte Uhr
- gemeinsame passive Journey
- kein Chat / keine Pings / keine Reactions während Fokus
- individueller Abbruch
- individuelle Rewards und Truhen
- optional kleiner additiver Goldbonus
- **keine Party-Truhe**
- kein erstmaliger Drop-in in eine laufende Quest; Reconnect bleibt möglich

**Abnahme:** Mehrere Personen können gemeinsam aufbrechen und synchron fokussieren, ohne dass Multiplayer Voraussetzung, Ablenkung oder Verpflichtung wird.

---

## Phase 5 · Epische Abenteuer

- 3 × 25 Minuten als ein erzählerischer Bogen
- Rast zwischen den Akten
- persistenter Aktfortschritt über Tage
- Boss / Höhepunkt in Akt III
- stärkere, aber weiterhin fokusfreundliche Inszenierung

**Abnahme:** Ein episches Abenteuer kann unterbrochen und später fortgesetzt werden, ohne Fortschrittsverlust oder FOMO.

---

## Phase 6 · Langfristige Welt

Mögliche Erweiterungen:
- weitere Begleiter
- neue Setlinien
- zusätzliche Regionen
- besondere Welt-/Lagerereignisse
- zusätzliche langfristige Meilensteine
- PWA-Verbesserungen und spätere Plattformoptionen

Neue Systeme müssen weiterhin die No-Dark-Patterns-Charta aus `CONCEPT.md` erfüllen.

---

## Technische Leitplanken über alle Phasen

- Web first, responsive von Beginn an
- serverseitige Account-Persistenz
- Timer als Zeit-/Sessionzustand, nicht als lokaler Countdown
- Journey als aus verstrichener Zeit abgeleiteter Zustand
- datengetriebener Content
- Fokuszeit bei Fehlern schützen
- progressive Asset-Ladung
- Accessibility von Beginn an
- keine Game Engine ohne neue, belegte Notwendigkeit

**Oberste Regel:** Die Fokuszeit der Person ist heiliger als die Spielinszenierung.
