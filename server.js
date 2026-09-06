// Next.js Custom Server — nur für Hosts, die eine Startdatei statt eines
// Startkommandos verlangen (Plesk/Passenger-Node.js-Apps, siehe ADR-039 und
// docs/PREVIEW-DEPLOYMENT.md, Abschnitt "Ionos VPS").
//
// Lokal, auf Render und auf Hostingers Node.js-Produkt bleibt `npm start`
// (next start) der Weg — diese Datei ist zusätzlich, ersetzt nichts.
//
// Voraussetzung: `npm run build` ist vorher gelaufen. Der Prozess muss aus
// dem Repo-Root heraus gestartet werden (wo `.next/` und `package.json`
// liegen), sonst findet `next()` das Build-Ergebnis nicht.

import { createServer } from 'http'
import next from 'next'

const port = Number(process.env.PORT) || 3000
const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Ready on port ${port}`)
  })
})
