# Roadmap

Jeder Meilenstein existiert als GitHub-Milestone. Aufgaben liegen als Issues darunter.

## M0 · Draft & Freigabe ← **hier stehen wir**
Konzept, Architektur, Sync-Protokoll und Design-System sind dokumentiert; der visuelle
Draft aller Screens liegt vor. **Ergebnis:** Freigabe des Konzepts durch das Release Team.

## M1 · Fundament `#SENDEV`
Next.js-Projekt, Tailwind, shadcn/ui, Design-Tokens aus dem Design-System, Supabase
angebunden, Migrationen, RLS-Policies, CI (Lint, Typecheck, Tests).

## M2 · Solo-Timer `#SENDEV` `#junDev`
`lib/timer/` als reine, getestete Logik. Quest-, Rast- und Lange-Rast-Zyklus.
Klassenwahl. Zustand übersteht Reload und Standby.
**Abnahme:** Der Timer stimmt nach einem Standby über eine ganze Phase.

## M3 · Party-Sync `#SENDEV`
Party-Codes, Beitritt mit und ohne Account, Broadcast, Presence, Clock-Skew-Abgleich,
DM-Rolle. **Abnahme:** alle Testfälle aus [SYNC-PROTOCOL.md](SYNC-PROTOCOL.md) grün.

## M4 · Spiel-Ebene `#junDev`
Truhen mit serverseitiger Ziehung, Loot, XP, Streaks, Charakterbogen, Inventar,
Party-Truhe. Die Truhen-Animation samt Reduced-Motion-Fassung.

## M5 · Release `#release`
Barrierefreiheits-Durchgang, Performance-Budget, Landing Page, Impressum und
Datenschutzerklärung, Datenexport und Kontolöschung, Domain `pomodoro.lang-jamin.de`,
Monitoring. **Abnahme:** Freigabe durch das Release Team.
