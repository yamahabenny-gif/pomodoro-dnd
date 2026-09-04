# Roadmap

Jeder Meilenstein existiert als GitHub-Milestone. Aufgaben liegen als Issues darunter.

Reihenfolge nach der Entscheidung zu K3 (Issue #28): **Solo ist der Normalzustand**,
die Gruppe kommt danach. Eine Gruppenfunktion ohne Lager hätte keinen Ort, an dem sie
stattfindet — das Signalhorn steht im Lager.

## M0 · Draft & Freigabe ← **hier stehen wir**
Konzept, Architektur, Sync-Protokoll, Design-System und der Abgleich mit Konzept V1
liegen vor. **Offen:** K10 (Ton der Quests, #31), K11 (90 Minuten, #32), Produktname.

## M1 · Fundament `#SENDEV`
Next.js, Tailwind, shadcn/ui, Design-Tokens, Supabase, Migrationen, RLS, CI.

## M2 · Lager und Solo-Schleife `#SENDEV` `#junDev`
Das Lager als Hub — „die Welt ist das Menü". Abenteuerbuch mit Wochenpool,
Charaktererstellung (Volk + Name), `lib/timer/` als reine Logik, Quest, Rast, Wanderung.
**Abnahme:** Man kann sich anmelden, einen Charakter anlegen, eine Quest wählen, sie
absolvieren und zurück ins Lager kommen — allein, ohne dass irgendwo eine Gruppe nötig wäre.

## M3 · Progression `#SENDEV` `#junDev`
XP, Level, Gold, Truhen mit der Keine-Duplikate-Ziehung, Item-Katalog, Sammlungssets,
Inventar, erste Lager-Ausbaustufen.
**Abnahme:** Fokuszeit erzeugt sichtbaren Fortschritt an Charakter **und** Lager.

## M4 · Gruppe `#SENDEV`
Signalhorn im Lager, Party-Codes, Bereitschaftsprüfung, Broadcast, Presence,
Clock-Skew-Abgleich. Gefährten sitzen sichtbar am Feuer.
**Abnahme:** alle Testfälle aus [SYNC-PROTOCOL.md](SYNC-PROTOCOL.md) grün.

## M5 · Release `#release`
Barrierefreiheits-Durchgang, Performance-Budget, Landing Page, Impressum und
Datenschutzerklärung, Datenexport und Kontolöschung, Domain `pomodoro.lang-jamin.de`,
Monitoring. **Abnahme:** Freigabe durch das Release Team.

## M6 · Artwork `#junDev`
Illustrierte Items, Rive-Animationen, acht Regionen-Kulissen, Lager-Ausbaustufen.
Läuft ab M2 parallel, blockiert nichts — der Item-Baukasten liefert vom ersten Tag an
vollwertige Liniengrafiken.
