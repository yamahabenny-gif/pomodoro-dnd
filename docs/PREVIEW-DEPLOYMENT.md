# Internes Phase-1-Preview auf Hostinger

Dieses Dokument ist der technische Handoff für den Webdesigner. Der Developer bereitet den deploybaren Stand im Repository vor; der eigentliche Push bzw. das Deployment auf Hostinger wird durch den Webdesigner durchgeführt.

## Ziel

Der interne Browser-Teststand soll den jeweils freigegebenen `main`-Stand bereitstellen, damit Waldintro → Account → Charakter → Lager und die folgenden Phase-1-Schritte real im Browser getestet werden können.

Das ist **kein öffentlicher Produktiv-Release** und ersetzt nicht das spätere Produktions-/Release-Gate aus Issue #3.

## Verantwortungsgrenze

### Developer / Technical Setup

- hält `main` buildbar und CI-grün,
- liefert die für Hostinger nötigen Build-/Start-Kommandos,
- dokumentiert die benötigten Environment-Variablen,
- legt keine Secrets im Repository ab,
- dokumentiert, welcher Commit/`main`-Stand deployt werden soll.

### Webdesigner

- übernimmt den tatsächlichen Push bzw. das Deployment auf Hostinger,
- richtet dort die Laufzeit/Umgebung ein,
- hinterlegt die Preview-/Test-Environment-Variablen serverseitig,
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

Für den Hostinger-Teststand muss die dort genutzte Node.js-Laufzeit mit der Next.js-Version des Projekts kompatibel sein. Vor einem späteren Produktions-Cutover bleibt die vollständige Hostinger-Laufzeitqualifikation Bestandteil von Issue #3.

## Benötigte Environment-Variablen

Für Account- und Charakter-Flow werden mindestens benötigt:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

`NEXT_PUBLIC_SITE_URL` muss auf die konkrete interne Hostinger-Test-URL gesetzt werden.

Falls serverseitige Funktionen später einen Service-Role-Key benötigen, darf dieser ausschließlich serverseitig gesetzt werden:

```text
SUPABASE_SERVICE_ROLE_KEY
```

Dieser Wert darf niemals im Client, Build-Output oder Repository erscheinen.

## Supabase Auth

Damit Magic-Link-/Auth-Callbacks funktionieren, muss die vom Webdesigner bereitgestellte Hostinger-Test-URL in Supabase Auth als erlaubtes Redirect-Ziel hinterlegt werden. Der Callback-Pfad der Anwendung bleibt `/auth/callback`.

## Ablauf nach neuen Phase-1-Merges

1. Nur freigegebene Änderungen nach `main` mergen.
2. CI auf `main` prüfen.
3. Webdesigner erhält den aktuellen `main`-Stand bzw. Commit-SHA als Deployment-Quelle.
4. Webdesigner aktualisiert den Hostinger-Teststand.
5. Browser-URL prüfen: Startseite, Account, Charakter und Lager müssen erreichbar sein.
6. Project Lead führt die Produkt-/Art-Abnahme im Browser durch.

## Aktueller Handoff-Stand

Der Lager-Hub aus #29 / PR #57 ist in `main` enthalten. Der aktuelle Testpfad ist damit:

**Waldintro → Account → Charakter → Lager**

Der nächste Feature-Schritt #37 ergänzt anschließend das Abenteuerbuch.

## Nicht Bestandteil dieses Handoffs

- kein Vercel
- kein automatisches Deployment aus GitHub Actions
- keine produktive DNS-/Domain-Umschaltung
- keine Veröffentlichung als öffentlicher Release
- keine Secrets im Repository

## Erfolgskriterium für #51

#51 ist technisch erst dann vollständig abgeschlossen, wenn der Webdesigner diesen vorbereiteten Stand tatsächlich auf Hostinger bereitgestellt und eine funktionierende Browser-URL zurückgemeldet hat. Der Repo-Anteil des Developers besteht in einem sauberen, dokumentierten und deploybaren Handoff.
