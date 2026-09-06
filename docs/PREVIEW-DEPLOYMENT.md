# Internes Phase-1-Preview

> **Aktueller Preview-Pfad: Ionos-VPS mit Plesk (befristete Dev-Preview, ADR-039).**
> Produktionsziel bleibt Hostinger / `focus.lang-jamin.de` (ADR-036) — daran ändert
> die VPS-Übergangslösung nichts, Ionos und Hostinger sind zwei unabhängige
> Anbieter. Sobald der Produktions-Cutover ansteht (Issue #3), wird auf
> Hostinger als tatsächliches Deployment-Ziel umgestellt.

Dieses Dokument ist der technische Handoff für den internen Preview-Stand. Der Developer bereitet den deploybaren Stand im Repository vor; die Einrichtung des jeweiligen Hosting-Accounts erfolgt durch die dafür zuständige Person (aktuell: Ionos-VPS/Plesk-Einrichtung, später: Webdesigner für Hostinger).

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

Damit Magic-Link-/Auth-Callbacks funktionieren, muss die jeweilige Preview-URL in Supabase Auth als erlaubtes Redirect-Ziel hinterlegt werden. Der Callback-Pfad der Anwendung bleibt `/auth/callback`.

Unabhängig vom Hosting-Pfad muss vor dem ersten Test die Migration `20260905090000_focus_session_pause.sql` auf die Supabase-Instanz angewendet werden (ergänzt Pause/Resume auf `focus_sessions`).

---

## Ionos VPS mit Plesk (befristete Dev-Preview, ADR-039)

Grund für diesen Pfad: ein Ionos-VPS (Ubuntu 24.04, Plesk, 4 vCore, 4 GB RAM, 120 GB NVMe SSD) ist bereits vorhanden — kostenlos nutzbar, kein Cold-Start wie bei einem Free-Tier, volle Kontrolle über die Node.js-Laufzeit. Details siehe ADR-039 in `docs/DECISIONS.md`.

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

Damit verbleibt für #35 nur noch die tatsächliche Browser-Abnahme durch den Project Lead — technisch ist der Pfad vollständig. Die VPS-Einrichtung (Plesk, Node.js-App, Environment-Variablen) steht noch aus (siehe oben).

## Nicht Bestandteil dieses Handoffs

- kein Vercel (ADR-037 bleibt in Kraft)
- kein Render (ADR-038 durch ADR-039 abgelöst)
- kein automatisches Deployment aus GitHub Actions
- keine produktive DNS-/Domain-Umschaltung
- keine Veröffentlichung als öffentlicher Release
- keine Secrets im Repository

## Erfolgskriterium für #51

#51 ist technisch erst dann vollständig abgeschlossen, wenn der aktuelle `main`-Stand tatsächlich auf dem Ionos-VPS bereitgestellt und eine funktionierende Browser-URL zurückgemeldet wurde. Der Repo-Anteil des Developers besteht in einem sauberen, dokumentierten und deploybaren Handoff (dieses Dokument + `server.js`).
