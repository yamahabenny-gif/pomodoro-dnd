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
//
// NODE_ENV muss vor dem Laden von `next`/`react-dom` auf 'production'
// stehen, sonst wählt Reacts eigenes gebündeltes react-dom den langsameren
// Dev-SSR-Build — unabhängig vom `dev: false` unten (Technical-Owner-Review
// auf PR #72 hat das per Code-Analyse und Live-Test bestätigt). In ESM
// werden statische `import`-Anweisungen vor dem restlichen Modulkörper
// ausgeführt, ein `process.env.NODE_ENV = ...` VOR einem `import next
// from 'next'` würde also zu spät kommen. Deshalb hier ein dynamischer
// Import nach dem Setzen der Variable — bewusst kein Bootstrap-Zweitfile.
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const { createServer } = await import('node:http')
const { default: next } = await import('next')

const port = Number(process.env.PORT) || 3000
const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Ready on port ${port} (NODE_ENV=${process.env.NODE_ENV})`)
  })
})
