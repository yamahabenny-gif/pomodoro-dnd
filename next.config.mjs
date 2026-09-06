// `basePath` wird von Next.js zur BUILD-Zeit ausgelesen und kann zur
// Laufzeit nicht mehr variieren. Für zwei gleichzeitig laufende Instanzen
// unter derselben Domain (`/preview/` und `/uat/`, siehe Issue #51 und
// docs/PREVIEW-DEPLOYMENT.md) sind das folgerichtig zwei separate Builds:
//
//   NEXT_BASE_PATH=/preview npm run build   # eigener Prozess/Port
//   NEXT_BASE_PATH=/uat     npm run build   # eigener Prozess/Port
//
// Ohne die Variable (z. B. lokal oder für einen späteren Produktions-
// Cutover ohne Pfadpräfix) bleibt `basePath` leer wie bisher.
const basePath = process.env.NEXT_BASE_PATH || ''

// Next.js inlined `NEXT_PUBLIC_*`-Variablen zur Build-Zeit in den
// Client-Bundle. Wir spiegeln den `basePath`-Wert hier explizit in eine
// solche Variable, damit lib/base-path.ts denselben Wert sowohl im
// Server- als auch im Client-Code liefert, ohne ihn doppelt pflegen zu
// müssen.
process.env.NEXT_PUBLIC_BASE_PATH = basePath

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
}

export default nextConfig
