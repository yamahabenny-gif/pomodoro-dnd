# GitHub-Handoff: Hostinger / `focus.lang-jamin.de`

> Adressaten: Technical-Hohner / Projektlead
> Owner: `#SENDEV`
> Follow-up: 2026-09-04, 20:30 CEST
> Status: **Hostinger-Subdomain-Infrastruktur bereits umgewidmet; Pomodoro-Architektur noch nicht zusammengeführt und App-Release noch nicht ausgerollt**

## Kanonischer Release-Tracker

Das bestehende offene **Issue #3**, aktuell `#release Deployment-Setup für öffentlichen Release`, bleibt der einzige Release-Tracker. Es trägt bereits die Labels `#release` und `#SENDEV`; Titel und Body werden für Hostinger / `focus.lang-jamin.de` aktualisiert. Für die Architekturentscheidung wird kein zusätzliches ADR-Issue angelegt.

Verbindliche Labels auf Issue #3: `#release`, `#SENDEV`; `decision` bei Bedarf ergänzen.

## Issue-Body (kopierfertig)

### Kontext

Die derzeit im Repository dokumentierte Architektur legt weiterhin Vercel und `pomodoro.lang-jamin.de` fest. Die davon getrennte Hostinger-Subdomain-Infrastruktur wurde bereits umgewidmet: `taskforcewohnung.lang-jamin.de` ist gelöscht, `focus.lang-jamin.de` existiert mit dem dedizierten Verzeichnis `/home/u589097474/domains/lang-jamin.de/public_html/focus`, und `bikepacking.lang-jamin.de` besteht unverändert mit `/home/u589097474/domains/lang-jamin.de/public_html/bikepacking` fort.

Diese vollzogene Infrastrukturänderung ist **kein Pomodoro-Deployment-Nachweis**. Es wurden weder Pomodoro-App noch -Content ausgerollt, weder Vercel-/DNS-CNAME-Migration noch GitHub-Merge oder Supabase-Cutover durchgeführt; die Projektarchitektur bleibt unzusammengeführt. Insbesondere sind Hostinger-Produkt/Tarif, Node.js-Laufzeitmodell, Build-/Startverfahren, persistente Prozesse und DNS-Zielwerte im Repository nicht belegt und dürfen nicht angenommen werden.

### Entscheidungsvorschlag

- Öffentliche Ziel-URL: `https://focus.lang-jamin.de`.
- Hosting-Anbieter: Hostinger, vorbehaltlich der technischen Laufzeitqualifikation unten.
- Supabase bleibt für Auth, Postgres und Realtime vorgesehen.
- Die Hostinger-Subdomain-Umwidmung ist bereits erfolgt: `taskforcewohnung.lang-jamin.de` wurde gelöscht und `focus.lang-jamin.de` mit eigenem `focus`-Verzeichnis angelegt; `bikepacking` blieb unverändert.
- Vercel und `pomodoro.lang-jamin.de` bleiben bis Merge und Release-Freigabe der im Repository dokumentierte Projektarchitektur-Stand. Die vorhandene `focus`-Infrastruktur darf nicht mit einem App-/Content-Deployment, einer DNS-CNAME-Migration oder einem Produktions-Cutover gleichgesetzt werden.
- Die interne Abnahme des Vertical Slice gemäß **Issue #35** ist ein zwingendes vorgelagertes Produkt-Gate. Ohne dokumentierte Erfüllung von #35 beginnen weder PR 2 noch Pomodoro-App-/Content-Deployment, DNS-CNAME-Migration, Supabase-Cutover oder Produktions-Cutover.

### Vor Umsetzung zu entscheidende technische Fragen

1. Welches konkrete Hostinger-Produkt und welcher Tarif stehen bereit?
2. Unterstützt dieser Zielbetrieb die vom Projekt benötigte Next.js-Serverlaufzeit mit `npm run build` und `npm run start`, inklusive Route Handlers und serverseitigen Secrets, oder nur statische Dateien?
3. Welche freigegebene Node.js-Version, Prozessverwaltung, Deployment-Methode, Log-/Monitoring-Schnittstelle und Rollback-Möglichkeit stellt der konkrete Zielbetrieb nachweislich bereit?
4. Welche DNS-Records verlangt der konkrete Zielbetrieb für `focus.lang-jamin.de`? Werte erst aus dem freigegebenen Hostinger-Ziel übernehmen; keine Vercel-Werte übertragen.
5. Soll die ehemalige TaskforceWohnung-Subdomain überhaupt wiederhergestellt werden? Da kein vor der Löschung erstelltes, wiederherstellbares Backup nachgewiesen ist, ist das eine separate Recovery-Entscheidung und kein impliziter Teil des Pomodoro-App-Rollbacks.

Falls der konkrete Zielbetrieb keine passende Next.js-Serverlaufzeit bereitstellt, ist **vor Implementierung** eine separate Architekturentscheidung nötig: geeigneten Hostinger-Betriebsmodus wählen oder die Anwendung mit dokumentierten Funktionsverlusten auf statischen Export umgestalten. Ein statischer Export darf nicht implizit beschlossen werden, weil die Architektur Route Handlers, serverseitige Secrets sowie serverseitige XP-/Loot-Logik vorsieht.

### Auswirkungen auf Next.js und Supabase

- Next.js: Der aktuelle `origin/main`-Stand besitzt `build`/`start`-Skripte und eine minimale `next.config.mjs`, aber keine Hostinger-spezifische Deployment-Konfiguration. Anbieterabhängige Optionen wie ein anderes Output-Format erst nach Laufzeitqualifikation ergänzen.
- Serverseitige Pfade: Route Handlers und alle Operationen mit erhöhten Rechten müssen serverseitig bleiben. `SUPABASE_SERVICE_ROLE_KEY` darf weder als `NEXT_PUBLIC_*` gesetzt noch in Build-Logs, Client-Bundle oder statische Artefakte gelangen.
- Supabase Auth: Site URL und erlaubte Redirect-URLs auf `https://focus.lang-jamin.de` umstellen bzw. ergänzen. Magic-Link- und Discord-OAuth-Flows anschließend gegen die Produktionsdomain end-to-end testen. Die genauen Dashboard-Felder und Callback-Werte anhand der eingesetzten Supabase-/OAuth-Konfiguration verifizieren, nicht aus diesem Issue ableiten.
- Öffentliche Konfiguration: `NEXT_PUBLIC_SITE_URL` für Produktion explizit auf `https://focus.lang-jamin.de` setzen. Beachten, dass `NEXT_PUBLIC_*`-Werte beim Build in Client-Code eingehen können; Build und Runtime müssen dieselbe freigegebene Zielumgebung abbilden.
- Realtime: Browser verbinden sich weiterhin mit Supabase Realtime. Produktionsnetz, Browser-Sicherheitsrichtlinien und WSS-Verbindung im Smoke-/E2E-Test verifizieren; keine Hostinger-WebSocket-Funktion voraussetzen.
- Datenbank: Der Hostingwechsel erfordert nicht automatisch eine Supabase-Schemaänderung. Migrationen nur separat, reproduzierbar und mit RLS-Prüfung ausrollen.
- Monitoring/Analytics: Die Vercel-Analytics-Nennung ist nicht auf Hostinger übertragbar. Vor Ersatz Datenschutz, Personenbezug, Aufbewahrung und technische Verfügbarkeit entscheiden.

### Betroffene Repository-Stellen

Verbindlich im Architektur-PR anzupassen:

- `docs/DECISIONS.md`: neuen ADR mit Kontext, Entscheidung, Alternative Vercel/beibehaltenem Ist-Stand und Begründung ergänzen.
- `docs/ARCHITECTURE.md:9`: Vercel-spezifische Begründung für Next.js durch eine anbieterneutrale technische Begründung ersetzen.
- `docs/ARCHITECTURE.md:14`: Hostingziel auf Hostinger / `focus.lang-jamin.de` ändern.
- `docs/ARCHITECTURE.md:119-120`: Vercel-Analytics-Verweis entfernen oder durch eine separat geprüfte, anbieterneutrale Monitoring-/Analytics-Entscheidung ersetzen.
- `docs/ARCHITECTURE.md:123-134`: Hosting-Übergabe vollständig neu schreiben; Vercel-Projekt, `cname.vercel-dns.com`, alte Domain und den nur textuell referenzierten Deployment-Issue-Titel entfernen.
- `README.md:5`: Ziel-Domain auf `focus.lang-jamin.de` ändern.
- `docs/WORKFLOW.md:55` und `docs/WORKFLOW.md:74`: Release-Beispiele auf die neue Domain, den kanonischen Tracker Issue #3 und dessen Labels `#release` / `#SENDEV` aktualisieren; keinen vermeintlichen Issue-Titel `#release #SENDEV` übernehmen.
- `design/README.md:14`: Domainreferenz des Landing-Artboards aktualisieren; dabei nicht Issue #19 reaktivieren.
- `.env.example:13`: lokalen Default beibehalten, aber den Produktionswert `https://focus.lang-jamin.de` und seine Deployment-Verantwortung als Kommentar dokumentieren.

Nach der Laufzeitqualifikation bedingt anzupassen:

- `next.config.mjs`: nur nachgewiesene, für den gewählten Hostinger-Betrieb erforderliche Optionen.
- `package.json`: nur nachgewiesene Build-/Startbefehle; vorhandene Next.js-Skripte nicht vorsorglich ersetzen.
- `.github/workflows/ci.yml`: CI behält Lint, Typecheck, Tests und Build. Ein Deploy-Job ist ein eigener kontrollierter `#release #SENDEV`-Schritt mit geschützten Credentials und Freigabegate, nicht Teil eines bloßen Dokumentations-PRs.
- `app/layout.tsx`: `metadataBase`, Canonical-/Open-Graph-URLs ergänzen, sobald öffentliche Metadaten eingeführt werden; aktuell existieren dort keine hart codierten Domain-URLs.
- Auth-/Supabase-Konfiguration außerhalb des Repos: Site URL, Redirect-Allowlist, Discord-OAuth-Produktionsfluss und Secrets.
- Hostinger/DNS außerhalb des Repos: vorhandenes `focus`-Deploymentziel, Prozesskonfiguration, TLS, DNS und Monitoring; vor einem App-Release ist ein eigener Pre-Cutover-Backup-/Snapshot-Stand anzulegen.

Bewusst **nicht** pauschal umzubenennen:

- `.gitignore` enthält `.vercel` als harmlose Schutzregel für lokale Artefakte.
- `docs/AGENT-SKILLS.md` und `skills-lock.json` nennen von `vercel-labs` veröffentlichte Skills bzw. Quellen; diese Herkunftsnamen sind keine Hostingentscheidung.
- `docs/DESIGN-SYSTEM.md` nennt Vercel Web Interface Guidelines als Prüfquelle; auch das ist kein Deploymentziel.

### Bestehende GitHub-Issues

- **Issue #3**, `#release Deployment-Setup für öffentlichen Release`, ist offen und trägt bereits `#SENDEV` und `#release`. Es ist der einzige kanonische Release-Tracker: Titel/Body dort auf Hostinger, `focus.lang-jamin.de`, die bereits vollzogene Subdomain-Umwidmung, einen eigenen Pre-Cutover-Backup-Stand für den App-Release, Laufzeitqualifikation, Auth-Redirects, das vorgelagerte Gate #35, kontrollierten Cutover und Rollback konkretisieren. Kein separates ADR-Issue anlegen und #3 nicht duplizieren.
- **Issue #35**, Vertical-Slice-Abnahme, ist eine zwingende Abhängigkeit des App-Rollouts. Seine interne Abnahme muss in Issue #3 nachvollziehbar dokumentiert sein, bevor PR 2 beginnt oder Pomodoro-App/-Content, DNS-CNAME, Supabase beziehungsweise Produktion verändert werden. Die bereits vollzogene Hostinger-Subdomain-Umwidmung ist davon getrennt zu dokumentieren.
- **Issue #19**, `#release #junDev Landing Page fuer pomodoro.lang-jamin.de`, ist geschlossen (`not_planned`) und durch Concept V2 überholt. Nicht wieder öffnen; höchstens einen historischen Verweis auf die neue Domainentscheidung ergänzen.
- **Issue #4 / PR #45** belegen die Next.js-Grundlage, entscheiden aber nicht über Hostinger. Keine nachträgliche Umschreibung geschlossener Historie nötig.

### Akzeptanzkriterien für den Architektur-PR

- [ ] ADR nennt Hostinger / `focus.lang-jamin.de`, Alternativen, Konsequenzen und den noch ausstehenden Runtime-Nachweis.
- [ ] Alle aktiven, hostingbezogenen Vercel-/`pomodoro.lang-jamin.de`-Annahmen in den oben genannten Dateien sind bereinigt.
- [ ] Herkunftsnamen von Skills/Guidelines bleiben unverändert.
- [ ] Issue #3 ist als einziger `#release`-/`#SENDEV`-Tracker auf den neuen Zielbetrieb ausgerichtet und referenziert die Architekturänderung sowie das Pflicht-Gate #35; es wurde kein doppeltes ADR-Issue angelegt.
- [ ] Die interne Vertical-Slice-Abnahme aus Issue #35 ist dokumentiert erfüllt, bevor PR 2 begonnen oder Pomodoro-App/-Content, DNS-CNAME, Supabase beziehungsweise Produktion verändert werden.
- [ ] `npm run lint`, `npm run typecheck`, `npm test` und `npm run build` sind grün auf dem dann aktuellen `main`.
- [ ] Unabhängiger `#junDev`-Review prüft Domain-Vollständigkeit und Verständlichkeit.
- [ ] Ein anderer technischer Reviewer prüft die `#SENDEV`-Architektur; Eigenreview des Owners zählt nicht.
- [ ] Danach bestätigt `#Tester` den dokumentierten Abnahmeplan und später den Staging-/Produktionsnachweis.
- [ ] Release Team erteilt vor Merge bzw. spätestens vor jeder extern wirksamen Änderung die nach `docs/WORKFLOW.md` erforderliche ausdrückliche Freigabe als PR-Kommentar; ein Approve allein reicht nicht.

### App-Release-, Migrations- und Cutover-Gate

Die Hostinger-Subdomain-Umwidmung ist bereits erfolgt und wird durch dieses Gate nicht rückwirkend als ausstehend beschrieben. Vor Pomodoro-App-/Content-Deployment, DNS-CNAME-Migration oder Supabase-Cutover müssen alle Punkte nachgewiesen sein:

- [ ] Issue #35 (interne Vertical-Slice-Abnahme) ist erfüllt und der Nachweis im kanonischen Release-Tracker Issue #3 verlinkt.
- [ ] Der aktuelle `focus`-Ausgangszustand, seine Konfiguration und Abhängigkeiten sind inventarisiert.
- [ ] Ein eigener wiederherstellbarer Pre-Cutover-Backup/Snapshot für den App-Release ist erstellt und testweise lesbar bzw. wiederherstellbar geprüft. Dieses Gate behauptet ausdrücklich kein fehlendes Backup aus der Zeit vor der Löschung von `taskforcewohnung.lang-jamin.de`.
- [ ] Reproduzierbares Pomodoro-Build aus einem freigegebenen Commit erzeugt.
- [ ] Next.js-Laufzeit, Serverpfade, Umgebungsvariablen und Logs auf dem konkreten Zielbetrieb verifiziert.
- [ ] Supabase RLS aktiv; Service-Role-Key fehlt nachweislich im Client-Bundle.
- [ ] Site URL/Redirect-Allowlist vorbereitet; Login, Magic Link und Discord OAuth auf der Ziel-URL getestet.
- [ ] HTTPS, Hauptseite, kritische Assets, Reload/Deep-Link, serverseitige Endpunkte und Supabase-Realtime-Verbindung getestet.
- [ ] DNS-Zielwerte und TTL dokumentiert; Cutover-Fenster und verantwortliche Person benannt.
- [ ] `#release #SENDEV`, unabhängiger `#junDev`-Review und `#Tester`-Gate dokumentiert.

### Rollback-Auslöser und Vorgehen

Rollback auslösen bei fehlendem/ungültigem HTTPS, nicht startender oder instabiler Next.js-Laufzeit, fehlgeschlagenem Login/OAuth, unerreichbaren serverseitigen Endpunkten, Secret-Leak, fehlerhafter RLS, Datenintegritätsproblem, kritischem Realtime-/Asset-Fehler oder nicht innerhalb des vereinbarten Fensters behebbarer DNS-Fehlleitung.

Rollback-Reihenfolge:

1. Weitere Migrationen und Schreibzugriffe stoppen; Ursache und Zeitpunkt protokollieren.
2. DNS auf den dokumentierten vorherigen Zustand zurücksetzen, sofern DNS bereits geändert wurde.
3. Den unmittelbar vor dem App-Cutover gesicherten `focus`-Ausgangszustand oder den vorherigen verifizierten Pomodoro-Build aus dem eigenen Pre-Cutover-Backup wiederherstellen.
4. Supabase Site URL/Redirect-Allowlist auf den dokumentierten vorherigen Zustand zurücksetzen, falls diese Änderung den Fehler verursacht oder alte Flows blockiert.
5. HTTPS, alte Zielerreichbarkeit und Auth erneut smoke-testen.
6. Erst nach Incident-Review und neuer `#release`-Freigabe erneut schneiden.

Rollback gilt erst als erfolgreich, wenn der vorherige Dienstzustand technisch erreichbar ist, seine kritischen Flows geprüft sind und kein Secret-/Datenintegritätsvorfall offen bleibt.

Die Wiederherstellung der ehemaligen `taskforcewohnung.lang-jamin.de`-Subdomain ist kein zugesicherter Rollback-Pfad: Ein vor ihrer Löschung erstelltes Backup ist nicht nachgewiesen. Eine Rekonstruktion der Subdomain, ihrer Konfiguration oder früherer Inhalte erfordert daher eine separate Recovery-Entscheidung mit eigener Quelle, Freigabe und Verifikation.

## PR-Plan

### PR 1 — Architektur und Dokumentation

Titel: `#release #SENDEV Hostinger und focus.lang-jamin.de als Zielarchitektur festlegen`

Branch für den bestehenden Tracker: `docs/3-hostinger-focus-architecture`

Scope:

1. ADR in `docs/DECISIONS.md`.
2. Architektur-/Hostingübergabe in `docs/ARCHITECTURE.md`.
3. Domainreferenzen in `README.md`, `docs/WORKFLOW.md`, `design/README.md`.
4. Produktionshinweis in `.env.example`.
5. Verweis auf aktualisiertes Issue #3.

Kein Scope dieses PRs: weitere DNS-/Hostinger-Mutationen, App-/Content-Deployment, Secrets, Supabase-Produktion, Deployment-Workflow oder Provider-spezifische Next-Konfiguration. Die bereits erfolgte Subdomain-Umwidmung wird lediglich als Ist-Fakt dokumentiert.

PR-Body muss `Refs #3` beziehungsweise `Updates #3` enthalten, `#SENDEV` und `#release` markieren, Risiko **mittel/hoch** benennen und auf den unten getrennten Rollout-PR verweisen. PR 1 schließt keinen neu angelegten Tracker; Fortschritt und Review-Nachweise werden im bestehenden Issue #3 aktualisiert.

Review-Reihenfolge: unabhängiger `#junDev`-Review → anderer technischer Reviewer für `#SENDEV` → `#Tester`-Gate → ausdrücklicher Release-Team-Kommentar.

### PR 2 — Zielbetrieb und kontrollierter Rollout

Erst nach beantworteter Laufzeitqualifikation, aktualisiertem Issue #3 und dokumentiert erfüllter interner Vertical-Slice-Abnahme aus Issue #35. Ohne #35-Gate kein PR 2, kein Pomodoro-App-/Content-Deployment, keine DNS-CNAME-Migration, kein Supabase-Cutover und kein Produktions-Cutover. Das beschreibt die noch ausstehende App-Freigabe, nicht die bereits vollzogene Hostinger-Subdomain-Umwidmung.

Titel: `#release #SENDEV Hostinger-Deployment für focus.lang-jamin.de implementieren`

Scope nur nach belegtem Zielbetrieb festlegen: notwendige Next-/Startkonfiguration, geschützter Deploypfad, Betriebsdokumentation, Smoke-/Rollback-Skripte. Noch ausstehende DNS-CNAME-, Hostinger-App-Deployment-, Supabase-Dashboard- und Secret-Schritte sind externe Release-Schritte mit protokolliertem Vier-Augen-Prinzip; keine geheimen Werte in GitHub-Issue, PR oder Logs.

Review-/Release-Reihenfolge wie PR 1; Produktion erst nach erfolgreichem Test auf dem qualifizierten Zielbetrieb und dokumentiertem Rollback-Nachweis.

## Quellenstand

Geprüft gegen `origin/main` nach Fetch, Commit `45bc670` (`docs: add current project lead next steps`), sowie die öffentliche GitHub-Issue-API am 2026-09-04. Der lokale Workspace-Checkout lag zu Prüfzeitpunkt vier Commits hinter `origin/main`; deshalb wurden aktuelle Dateien read-only direkt aus `origin/main` bewertet. Ein anschließender unabhängiger, ausschließlich lesender Hostinger-API-Readback bestätigte als aktuellen Infrastrukturstand genau `focus` und unverändert `bikepacking` unter `lang-jamin.de`; `taskforcewohnung` ist nicht vorhanden. Die Handoff-Korrektur selbst verändert keine GitHub-Issues, PRs, Kommentare, Branches, DNS-, Hostinger- oder Supabase-Einstellungen.
