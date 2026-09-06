/**
 * Der zur Build-Zeit konfigurierte `basePath` (siehe next.config.mjs,
 * gesteuert über die Build-Zeit-Umgebungsvariable `NEXT_BASE_PATH`, z. B.
 * `/preview` oder `/uat`).
 *
 * Next.js hängt den `basePath` automatisch an alle `<Link>`-Navigationen
 * und an `redirect()`/`useRouter()` aus `next/navigation` an — dort ist
 * nichts weiter zu tun. Das passiert NICHT automatisch bei von Hand
 * zusammengesetzten absoluten URLs, zum Beispiel:
 *
 * - `${window.location.origin}/pfad` (z. B. Supabase `emailRedirectTo`)
 * - `NextResponse.redirect(...)` in Route Handlern
 * - eine direkte Zuweisung an `window.location.href = '/pfad'`
 *
 * Überall dort muss dieser Wert (bzw. `withBasePath`) explizit verwendet
 * werden, sonst zeigt die gebaute URL unter `/preview/` oder `/uat/` auf
 * den falschen (unpräfigierten) Pfad.
 *
 * Der Wert wird in next.config.mjs 1:1 in `NEXT_PUBLIC_BASE_PATH`
 * gespiegelt, damit Server- und Client-Code garantiert denselben Wert wie
 * die `basePath`-Konfiguration selbst sehen.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

/**
 * Baut einen absoluten Pfad inklusive `basePath`. `path` muss mit `/`
 * beginnen, z. B. `withBasePath('/auth/callback')`.
 */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`
}
