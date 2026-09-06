# Internes Phase-1-Preview

> **Aktueller Preview-Pfad: Ionos-VPS, Ubuntu 24.04 + Node.js 22 + NGINX direkt
> (befristete Dev-Preview, ADR-039).**
> Der ursprüngliche Handoff ging von Plesk auf diesem VPS aus. Der tatsächliche
> Read-back durch HERMES auf dem realen Zielsystem (Issue #51) hat gezeigt:
> **kein Plesk installiert** (kein `/usr/local/psa`, kein `psa`-Paket, keine
> Plesk-Prozesse/-Ports). HERMES ist deshalb bewusst auf die in diesem
> Dokument bereits als Alternative vorgesehene direkte Ubuntu-Variante
> umgeschwenkt: Node.js 22 + NGINX ohne Plesk-Panel, Repo unter
> `/srv/pomodoro-dnd`. Das ist der Weg, der tatsächlich läuft — der
> Plesk-Abschnitt weiter unten bleibt als Referenz stehen, falls auf diesem
> oder einem anderen VPS später doch Plesk zur Verfügung steht, ist aber
> **nicht der aktuelle Stand**.
>
> Produktionsziel bleibt Hostinger / `focus.lang-jamin.de` (ADR-036) — daran
> ändert die VPS-Übergangslösung nichts, Ionos und Hostinger sind zwei
> unabhängige Anbieter. Sobald der Produktions-Cutover ansteht (Issue #3),
> wird auf Hostinger als tatsächliches Deployment-Ziel umgestellt.
>
> Die gewünschte Topologie ist **kein separates Sub-Domain-Deployment**,
> sondern zwei Pfade unter derselben Domain: `focus.lang-jamin.de/preview/`
> (laufende Entwicklung) und `focus.lang-jamin.de/uat/` (finale
> Freigabeprüfung durch Daisy als Super User). Siehe Abschnitt
> "Zwei Pfade unter einer Domain: `/preview/` und `/uat/`" weiter unten für
> das konkrete Muster.

Dieses Dokument ist der technische Handoff für den internen Preview-Stand. Der Developer bereitet den deploybaren Stand im Repository vor; die Einrichtung des jeweiligen Hosting-Accounts erfolgt durch die dafür zuständige Person (aktuell: Ionos-VPS-Einrichtung durch HERMES, später: Webdesigner für Hostinger).

## Ziel

Der interne Browser-Teststand soll den jeweils freigegebenen `main`-Stand bereitstellen, damit Waldintro → Account → Charakter → Lager und die folgenden Phase-1-Schritte real im Browser getestet werden können.

Das ist **kein öffentlicher Produktiv-Release** und ersetzt nicht das spätere Produktions-/Release-Gate aus Issue #3.

## Verantwortungsgrenze

### Developer / Technical Setup

- hält `main` buildbar und CI-grün,
- liefert die für den jeweiligen Preview-Host nötigen Build-/Start-Kommandos bzw. Startdateien (`server.js` für Plesk),
- dokumentiert die benötigten Environment-Variablen,
- legt keine Secrets im Repository ab,
- dokumentiert, welcher Commit/`main`-Stand deployt werden soll.

### Account-Owner (VPS/Plesk bzw. später Webdesigner für Hostinger)

- übernimmt die tatsächliche Account-/Service-Einrichtung,
- hinterlegt die Preview-/Test-Environment-Variablen serverseitig (nie im Repo),
- trägt die Preview-URL als Supabase-Auth-Redirect ein,
- stellt die Browser-URL bereit,
- meldet Deployment- oder Laufzeitfehler zurück.

### Technical Owner

- prüft den technischen Handoff bzw. notwendige Repo-Anpassungen,
- entwickelt das Deployment nicht selbst.

### Project Lead

- prüft den bereitgestellten Browser-Stand visuell und produktseitig.

## Build- und Startkommandos

Das Projekt ist eine Next.js-Anwendung und verwendet die vorhandenen Scripts aus `package.json`:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

`next start` liest den `PORT`, den der jeweilige Host vorgibt, automatisch — keine Code-Anpassung nötig. Für Hosts, die eine **Startdatei statt eines Startkommandos** verlangen (Plesk/Passenger, siehe unten), gibt es zusätzlich `npm run start:plesk` (`node server.js`), ein minimaler Next.js Custom Server. Beide Wege nutzen denselben `npm run build`-Output.

### `basePath` für `/preview/` und `/uat/` — Build-Zeit-Variable `NEXT_BASE_PATH`

`next.config.mjs` liest `basePath` aus der Build-Zeit-Umgebungsvariable
`NEXT_BASE_PATH`:

```js
const basePath = process.env.NEXT_BASE_PATH || ''
```

Next.js liest `basePath` beim Build aus und kann ihn zur Laufzeit nicht mehr
ändern. Ohne die Variable (lokal, oder für einen künftigen
Produktions-Cutover ohne Pfadpräfix) bleibt `basePath` leer wie bisher —
`npm run build` ohne `NEXT_BASE_PATH` verhält sich unverändert.

Für zwei gleichzeitig laufende Instanzen unter derselben Domain
(`/preview/` und `/uat/`) bedeutet das zwingend **zwei separate Builds**:

```bash
NEXT_BASE_PATH=/preview npm run build   # → eigenes Build-Verzeichnis/eigener Prozess/Port
NEXT_BASE_PATH=/uat     npm run build   # → eigenes Build-Verzeichnis/eigener Prozess/Port
```

Jeder Build erzeugt sein eigenes `.next`-Verzeichnis mit den `/_next`-Asset-
Pfaden bereits korrekt auf `/preview` bzw. `/uat` präfigiert. Es reicht daher
**nicht**, einen einzigen Build zu bauen und per NGINX-Pfad-Rewrite auf zwei
Locations zu verteilen — die beiden `basePath`-Werte gehören zu zwei
inhaltlich unterschiedlichen Builds. Details zum Prozess-/NGINX-Muster:
Abschnitt "Zwei Pfade unter einer Domain: `/preview/` und `/uat/`" weiter unten.

Absolute URLs, die die Anwendung selbst zusammenbaut (Supabase-Magic-Link-
Redirect, der `/auth/callback`-Route-Handler), verwenden dafür die zentrale
Konstante `lib/base-path.ts` (`BASE_PATH` / `withBasePath()`), die denselben
Wert über `NEXT_PUBLIC_BASE_PATH` im Client- wie im Server-Code liefert.
`<Link>` und `redirect()` aus `next/navigation` benötigen das nicht — die
hängen den `basePath` bereits automatisch an.

## Benötigte Environment-Variablen

Für Account- und Charakter-Flow werden mindestens benötigt:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` muss auf die konkrete Preview-URL des jeweiligen Hosts gesetzt werden.

Falls serverseitige Funktionen später einen Service-Role-Key benötigen, darf dieser ausschließlich serverseitig gesetzt werden:

```text
SUPABASE_SERVICE_ROLE_KEY
```

Dieser Wert darf niemals im Client, Build-Output oder Repository erscheinen.

## Supabase Auth

Damit Magic-Link-/Auth-Callbacks funktionieren, muss die jeweilige Preview-URL in Supabase Auth als erlaubtes Redirect-Ziel hinterlegt werden. Der Callback-Pfad der Anwendung bleibt `/auth/callback`, jeweils unter dem `basePath` des Builds.

Für die aktuelle `/preview/`- und `/uat/`-Topologie unter `focus.lang-jamin.de` müssen **beide** folgenden URLs in Supabase unter Authentication → URL Configuration → Redirect URLs eingetragen werden — nicht nur eine:

```text
https://focus.lang-jamin.de/preview/auth/callback
https://focus.lang-jamin.de/uat/auth/callback
```

Fehlt einer der beiden Einträge, schlägt der Magic-Link-Login auf dem jeweils fehlenden Pfad fehl, auch wenn der andere Pfad funktioniert.

Unabhängig vom Hosting-Pfad muss vor dem ersten Test die Migration `20260905090000_focus_session_pause.sql` auf die Supabase-Instanz angewendet werden (ergänzt Pause/Resume auf `focus_sessions`).

---

## Ionos VPS: Ubuntu 24.04 + Node.js 22 + NGINX, ohne Plesk (aktueller Weg, ADR-039)

Grund für diesen Pfad: ein Ionos-VPS (Ubuntu 24.04, 4 vCore, 4 GB RAM, 120 GB NVMe SSD) ist bereits vorhanden — kostenlos nutzbar, kein Cold-Start wie bei einem Free-Tier, volle Kontrolle über die Node.js-Laufzeit. Details siehe ADR-039 in `docs/DECISIONS.md`.

Der Handoff, der zu ADR-039 führte, ging von vorinstalliertem Plesk aus. Der direkte Read-back auf dem realen VPS durch HERMES (Issue #51) hat gezeigt, dass **kein Plesk vorhanden ist**. HERMES hat daraufhin bewusst die in der ursprünglichen Fassung dieses Dokuments bereits als Alternative genannte direkte Variante gewählt und bereits erfolgreich begonnen:

- Node.js `v22.23.2` installiert (offizieller SHA-256-Download verifiziert), npm `10.9.8`
- NGINX installiert, aktiviert, aktiv
- Repo unter `/srv/pomodoro-dnd`, `npm ci` und `npm run build` liefen bereits erfolgreich

Der fehlende Baustein war bislang `basePath`-Unterstützung im Repository für die gewünschte `/preview/` + `/uat/`-Pfadstruktur unter derselben Domain — das liefert dieser PR (siehe Abschnitt "`basePath` für `/preview/` und `/uat/` — Build-Zeit-Variable `NEXT_BASE_PATH`" oben und das konkrete Setup direkt im Anschluss).

### Zwei Pfade unter einer Domain: `/preview/` und `/uat/`

`focus.lang-jamin.de/preview/` (laufende Entwicklung) und `focus.lang-jamin.de/uat/` (finale Freigabeprüfung durch Daisy als Super User) laufen als **zwei unabhängige Next.js-Prozesse** auf demselben VPS, jeweils mit ihrem eigenen `basePath`-Build, ihrem eigenen Port und ihrem eigenen NGINX-`location`-Block. DNS bzw. die gemeinsame Frontdoor route­n nach Pfad, nicht nach Subdomain — deshalb übernimmt NGINX auf dem VPS diese Aufteilung.

**Schritt 1 — zwei Builds.** Am einfachsten mit zwei getrennten Checkouts (robuster für dauerhaften Betrieb, weil `preview` und `uat` unabhängig voneinander aktualisiert werden können, ohne den jeweils anderen Prozess zu unterbrechen); `node_modules` kann zwischen ihnen per Symlink geteilt werden:

```bash
# einmalig
git clone <repo-url> /srv/pomodoro-dnd-preview
git clone <repo-url> /srv/pomodoro-dnd-uat

# je Deployment, für jeden Checkout:
cd /srv/pomodoro-dnd-preview
git pull                       # jeweils freigegebener main-Commit
NEXT_BASE_PATH=/preview \
NEXT_PUBLIC_SUPABASE_URL=... \
NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
npm ci && npm run build

cd /srv/pomodoro-dnd-uat
git pull
NEXT_BASE_PATH=/uat \
NEXT_PUBLIC_SUPABASE_URL=... \
NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
npm ci && npm run build
```

`NEXT_BASE_PATH` muss beim Build gesetzt sein — ohne die Variable baut `npm run build` wie bisher ohne `basePath`.

**Schritt 2 — zwei laufende Prozesse auf zwei Ports**, `NEXT_BASE_PATH` beim Start identisch zum Build-Wert, damit `next start` seine eigenen Assets unter dem richtigen Präfix erwartet:

```bash
cd /srv/pomodoro-dnd-preview && NEXT_BASE_PATH=/preview PORT=3001 NODE_ENV=production npm run start
cd /srv/pomodoro-dnd-uat     && NEXT_BASE_PATH=/uat     PORT=3002 NODE_ENV=production npm run start
```

Für dauerhaften Betrieb je ein systemd-Service (oder `pm2`) pro Prozess mit Auto-Restart, z. B.:

```ini
# /etc/systemd/system/pomodoro-preview.service
[Unit]
Description=pomodoro-dnd preview
After=network.target

[Service]
WorkingDirectory=/srv/pomodoro-dnd-preview
Environment=NEXT_BASE_PATH=/preview
Environment=PORT=3001
Environment=NODE_ENV=production
Environment=NEXT_PUBLIC_SUPABASE_URL=...
Environment=NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ExecStart=/usr/bin/npm run start
Restart=on-failure
User=hermes-admin

[Install]
WantedBy=multi-user.target
```

Analog `pomodoro-uat.service` mit `NEXT_BASE_PATH=/uat`, `PORT=3002` und `WorkingDirectory=/srv/pomodoro-dnd-uat`. Secrets/Env-Werte gehören in die systemd-Unit oder eine per `EnvironmentFile=` eingebundene Datei außerhalb des Repos — nie im Repository.

**Schritt 3 — NGINX-`location`-Blöcke ohne Pfad-Rewriting.** Weil jeder Build seinen `basePath` bereits selbst kennt (alle `/_next`-Assets, internen Links und der Auth-Callback werden bereits unter `/preview/*` bzw. `/uat/*` gerendert), muss NGINX **nur an den richtigen Port weiterleiten, den Pfad aber nicht umschreiben**:

```nginx
server {
    listen 443 ssl;
    server_name focus.lang-jamin.de;

    # ... bestehende TLS-Konfiguration, bestehender Root-/Placeholder-Pfad ...

    location /preview/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uat/ {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Wichtig: **kein** trailing slash bei `proxy_pass` (also nicht `proxy_pass http://127.0.0.1:3001/;`) und **kein** `rewrite ^/preview/(.*)$ /$1 break;` davor — beides würde den Pfad abschneiden, den der Next.js-Prozess aber selbst inklusive `basePath` erwartet und rendert. Der bestehende Root-Placeholder von `focus.lang-jamin.de` (der eigene `location / { ... }`-Block) bleibt unverändert bestehen; die beiden neuen `location`-Blöcke kommen nur dazu.

**Schritt 4 — Verifikation**, genau wie lokal in diesem Repo vor dem PR getestet:

```bash
curl -I https://focus.lang-jamin.de/preview/
curl -I https://focus.lang-jamin.de/uat/
curl -s https://focus.lang-jamin.de/preview/ | grep -o '/preview/_next/[^"]*' | head -3
curl -s https://focus.lang-jamin.de/uat/ | grep -o '/uat/_next/[^"]*' | head -3
```

Beide sollten `200` liefern; die `/_next`-Asset-Pfade im HTML müssen mit `/preview/_next/` bzw. `/uat/_next/` beginnen. Zusätzlich: Supabase-Redirect-URLs für beide Pfade eintragen (siehe Abschnitt "Supabase Auth" oben), danach den Magic-Link-Login auf beiden Pfaden real testen.

### Plesk-Setup (Referenz — aktuell nicht der verwendete Weg)

Der ursprüngliche ADR-039-Handoff ging von vorinstalliertem Plesk aus. Dieser Abschnitt bleibt als Referenz stehen, falls Plesk auf diesem oder einem anderen VPS später doch verfügbar wird — für den aktuellen VPS gilt stattdessen der Abschnitt "Zwei Pfade unter einer Domain" oben.

Setup (einmalig, durch den Account-Owner mit Plesk-/SSH-Zugriff):

1. **Node.js-Extension in Plesk aktivieren** (falls nicht vorhanden): Plesk → Extensions → "Node.js" installieren.
2. **Subdomain/Domain anlegen** für die Preview (z. B. `preview.<eure-domain>` oder direkt über die VPS-IP `87.106.24.22`), Dokumentenstamm auf ein Verzeichnis setzen, in das das Repo deployt wird.
3. **Repo auf den VPS bringen**, z. B. per Plesk-Git-Extension (Pull-Deployment bei Push) oder manuell per `git clone`/`git pull` über SSH. Deployment-Quelle: der jeweils freigegebene `main`-Commit.
4. Im Domain-Verzeichnis: `npm ci && npm run build`.
5. In Plesk unter "Node.js" für diese Domain:
   - **Application Root**: Repo-Verzeichnis (wo `package.json` und `.next/` liegen)
   - **Application Startup File**: `server.js`
   - **Application Mode**: production
   - Die drei `NEXT_PUBLIC_*`-Variablen (siehe oben) als Environment-Variablen in Plesk eintragen — nicht im Repo.
6. `NEXT_PUBLIC_SITE_URL` auf die tatsächliche Preview-URL setzen, danach neu builden falls das Panel keinen automatischen Rebuild bei Env-Änderung macht.
7. Diese URL + `/auth/callback` als Supabase-Auth-Redirect eintragen.
8. Firewall/Plesk-Regeln prüfen: nur der für die Domain nötige Port (i. d. R. 80/443 über Plesks eigenen Reverse-Proxy/nginx) muss erreichbar sein, nicht der interne Node-Port direkt.

Falls Plesks Node.js-Panel für den App-Router unhandlich ist, ist die robuste Alternative: SSH-Zugriff, `pm2 start server.js` (oder ein systemd-Service) für den Node-Prozess, plus eine einfache Nginx-Reverse-Proxy-Regel in Plesk, die die Domain auf `localhost:<PORT>` weiterleitet. In dem Fall genügt auch `npm run start` (next start) statt `server.js`.

Sichtbarkeit: Die VPS-/Domain-URL ist technisch öffentlich erreichbar, aber unverlinkt. Falls ein härterer Zugriffsschutz gewünscht ist, kann eine einfache HTTP-Basic-Auth-Middleware ergänzt oder eine Plesk-eigene IP-Beschränkung gesetzt werden — dafür bitte ein eigenes Issue anlegen, das ist aktuell nicht Teil dieses Handoffs.

---

## Hostinger (Produktionsziel, ADR-036 — aktuell nicht der Preview-Pfad)

Für den späteren Produktions-Cutover (Issue #3) bleibt Hostinger das Ziel. Die Laufzeitqualifikation dafür ist in `docs/HOSTINGER-RUNTIME-QUALIFICATION.md` dokumentiert; der offene Punkt daraus (konkretes Node.js-Web-App-Produkt im hPanel) ist in #51 nachgetragen.

Sobald der Cutover ansteht, gilt für Hostinger derselbe Build-/Start-Vertrag (`npm run build` / `npm run start`) und dieselbe Environment-Variablen-Liste wie oben.

---

## Aktueller Handoff-Stand

Der komplette Vertical-Slice-Pfad ist in `main` enthalten. Der aktuelle Testpfad ist damit:

**Waldintro → Account → Charakter → Lager → Abenteuerbuch → Aufbruch → 15-Minuten-Fokus → Questabschluss → Rast → Truhe → Weglaterne im Lager**

Damit ist der in #35 beschriebene Vertical Slice erstmals von vorn bis hinten durchspielbar. Migration `20260905090000_focus_session_pause.sql` muss vor dem Deployment auf die Supabase-Instanz angewendet werden (ergänzt Pause/Resume-Spalten und -Funktionen auf `focus_sessions`).

Damit verbleibt für #35 nur noch die tatsächliche Browser-Abnahme durch den Project Lead — technisch ist der Pfad vollständig. Die App unterstützt jetzt `basePath` per `NEXT_BASE_PATH` (siehe oben); die tatsächliche VPS-Einrichtung (zwei Builds/Prozesse, systemd, NGINX-`location`-Blöcke, DNS-Umschaltung, Environment-Variablen) steht noch aus und liegt bei HERMES (siehe Abschnitt "Ionos VPS: Ubuntu 24.04 + Node.js 22 + NGINX, ohne Plesk" oben).

## Nicht Bestandteil dieses Handoffs

- kein Vercel (ADR-037 bleibt in Kraft)
- kein Render (ADR-038 durch ADR-039 abgelöst)
- kein automatisches Deployment aus GitHub Actions
- keine produktive DNS-/Domain-Umschaltung
- keine Veröffentlichung als öffentlicher Release
- keine Secrets im Repository

## Erfolgskriterium für #51

#51 ist technisch erst dann vollständig abgeschlossen, wenn der aktuelle `main`-Stand tatsächlich auf dem Ionos-VPS unter `/preview/` **und** `/uat/` bereitgestellt und funktionierende Browser-URLs zurückgemeldet wurden. Der Repo-Anteil des Developers besteht in einem sauberen, dokumentierten und deploybaren Handoff (dieses Dokument, `server.js`, `next.config.mjs`/`lib/base-path.ts` für `basePath`) — das Umsetzen von Build/Prozessen/NGINX auf dem VPS bleibt weiterhin Aufgabe des Account-Owners (HERMES).
