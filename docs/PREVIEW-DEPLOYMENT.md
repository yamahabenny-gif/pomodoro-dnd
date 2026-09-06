# Internes Phase-1-Preview

> **Aktueller Preview-Pfad: Render.com (befristete Dev-Preview, ADR-038).**
> Produktionsziel bleibt Hostinger / `focus.lang-jamin.de` (ADR-036) — daran ändert
> die Render-Übergangslösung nichts. Sobald der Produktions-Cutover ansteht
> (Issue #3), wird auf Hostinger als tatsächliches Deployment-Ziel umgestellt.

Dieses Dokument ist der technische Handoff für den internen Preview-Stand. Der Developer bereitet den deploybaren Stand im Repository vor; die Einrichtung des jeweiligen Hosting-Accounts erfolgt durch die dafür zuständige Person (aktuell: Render-Account-Einrichtung, später: Webdesigner für Hostinger).

## Ziel

Der interne Browser-Teststand soll den jeweils freigegebenen `main`-Stand bereitstellen, damit Waldintro → Account → Charakter → Lager und die folgenden Phase-1-Schritte real im Browser getestet werden können.

Das ist **kein öffentlicher Produktiv-Release** und ersetzt nicht das spätere Produktions-/Release-Gate aus Issue #3.

## Verantwortungsgrenze

### Developer / Technical Setup

- hält `main` buildbar und CI-grün,
- liefert die für den jeweiligen Preview-Host nötigen Build-/Start-Kommandos (`render.yaml` für Render),
- dokumentiert die benötigten Environment-Variablen,
- legt keine Secrets im Repository ab,
- dokumentiert, welcher Commit/`main`-Stand deployt werden soll.

### Account-Owner (Render bzw. Webdesigner für Hostinger)

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

`next start` liest den `PORT`, den der jeweilige Host vorgibt, automatisch — keine Code-Anpassung nötig.

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

## Render (befristete Dev-Preview, ADR-038)

Grund für diesen Pfad: Hostingers Node.js-Hosting-Produkt kostet bei monatlicher Laufzeit 18 €/Monat (der beworbene 3,99-€-Preis gilt nur bei 48 Monaten Bindung) — für die laufende Entwicklungsphase unverhältnismäßig. Details siehe ADR-038 in `docs/DECISIONS.md`.

Setup (einmalig, durch den Account-Owner):

1. Kostenlosen Account auf render.com anlegen, per "Sign in with GitHub".
2. Repository `yamahabenny-gif/pomodoro-dnd` autorisieren.
3. "New Web Service" → Repo auswählen, Branch `main`. Render erkennt `render.yaml` im Repo-Root automatisch als Blueprint; alternativ manuell:
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm run start`
   - Instance Type: **Free**
4. Die drei `NEXT_PUBLIC_*`-Variablen (siehe oben) im Render-Dashboard eintragen — `render.yaml` fragt danach (`sync: false`), committet aber keine Werte.
5. `NEXT_PUBLIC_SITE_URL` auf die von Render vergebene URL setzen (Format `https://<service-name>.onrender.com`).
6. Diese URL + `/auth/callback` als Supabase-Auth-Redirect eintragen.
7. Auto-Deploy bei Push auf `main` kann aktiv bleiben — `main` ist durch Pflicht-CI geschützt.

Bekannte Einschränkung: Der Free-Tier schläft nach ca. 15 Minuten Inaktivität; der nächste Aufruf braucht dann ~30–60 Sekunden zum Aufwachen. Für eine interne Abnahme ist das kein Blocker.

Sichtbarkeit: Die `onrender.com`-URL ist technisch öffentlich erreichbar, aber unverlinkt/nicht auffindbar. Falls ein härterer Zugriffsschutz gewünscht ist, kann eine einfache HTTP-Basic-Auth-Middleware ergänzt werden — dafür bitte ein eigenes Issue anlegen, das ist aktuell nicht Teil dieses Handoffs.

---

## Hostinger (Produktionsziel, ADR-036 — aktuell nicht der Preview-Pfad)

Für den späteren Produktions-Cutover (Issue #3) bleibt Hostinger das Ziel. Die Laufzeitqualifikation dafür ist in `docs/HOSTINGER-RUNTIME-QUALIFICATION.md` dokumentiert; der offene Punkt daraus (konkretes Node.js-Web-App-Produkt im hPanel) ist in #51 nachgetragen.

Sobald der Cutover ansteht, gilt für Hostinger derselbe Build-/Start-Vertrag (`npm run build` / `npm run start`) und dieselbe Environment-Variablen-Liste wie oben.

---

## Aktueller Handoff-Stand

Der komplette Vertical-Slice-Pfad ist in `main` enthalten. Der aktuelle Testpfad ist damit:

**Waldintro → Account → Charakter → Lager → Abenteuerbuch → Aufbruch → 15-Minuten-Fokus → Questabschluss → Rast → Truhe → Weglaterne im Lager**

Damit ist der in #35 beschriebene Vertical Slice erstmals von vorn bis hinten durchspielbar. Migration `20260905090000_focus_session_pause.sql` muss vor dem Deployment auf die Supabase-Instanz angewendet werden (ergänzt Pause/Resume-Spalten und -Funktionen auf `focus_sessions`).

Damit verbleibt für #35 nur noch die tatsächliche Browser-Abnahme durch den Project Lead — technisch ist der Pfad vollständig. Die Render-Account-Einrichtung steht noch aus (siehe oben).

## Nicht Bestandteil dieses Handoffs

- kein Vercel (ADR-037 bleibt in Kraft)
- kein automatisches Deployment aus GitHub Actions
- keine produktive DNS-/Domain-Umschaltung
- keine Veröffentlichung als öffentlicher Release
- keine Secrets im Repository

## Erfolgskriterium für #51

#51 ist technisch erst dann vollständig abgeschlossen, wenn der aktuelle `main`-Stand tatsächlich auf Render bereitgestellt und eine funktionierende Browser-URL zurückgemeldet wurde. Der Repo-Anteil des Developers besteht in einem sauberen, dokumentierten und deploybaren Handoff (dieses Dokument + `render.yaml`).
