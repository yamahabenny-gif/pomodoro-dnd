# Internes Phase-1-Preview

Dieses Preview ist ein interner Teststand für den jeweils aktuellen `main` und ausdrücklich **kein** öffentlicher Produktionsrelease.

## Ziel

Der Workflow `.github/workflows/preview.yml` deployt jeden Push auf `main` sowie manuelle Läufe als Vercel-Preview. Der erzeugte Link wird im GitHub-Actions-Run unter **Summary** ausgegeben und anschließend per HTTP-Smoke-Test geprüft.

## Einmalige Einrichtung

1. Das Repository als eigenes Vercel-Projekt importieren bzw. mit einem bestehenden Vercel-Projekt verknüpfen.
2. In Vercel für die Umgebung **Preview** folgende Supabase-Werte hinterlegen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In der Supabase-Preview-/Testinstanz unter **Authentication → URL Configuration** die Vercel-Preview-URL(s) als erlaubte Redirect-Ziele eintragen, damit Magic-Link-Login und Callback funktionieren.
4. In GitHub die Environment **preview** verwenden und dort folgende Secrets hinterlegen:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. Keine Supabase-Service-Role-Keys oder sonstigen produktiven Secrets in Git oder als `NEXT_PUBLIC_*`-Variable speichern.

## Laufender Betrieb

Nach jedem Merge in `main` startet der Preview-Workflow automatisch. Dadurch wächst der interne Browser-Teststand mit #29, #37, #38/#12/#21, #13 und #39 mit, ohne einen öffentlichen Release auszulösen.

Ein manueller Lauf ist über **Actions → Internal Preview → Run workflow** möglich.

## Abnahme

Ein Lauf ist erfolgreich, wenn:
- Lint, Typecheck und Tests grün sind,
- Vercel das Projekt für die Preview-Umgebung baut,
- ein Deployment-Link ausgegeben wird,
- der HTTP-Smoke-Test auf diesen Link erfolgreich antwortet,
- Account- und Charakterfluss mit der Preview-Supabase-Konfiguration im Browser getestet werden können.

## Sicherheitsgrenzen

- `.vercel` und lokale `.env`-Dateien bleiben über `.gitignore` aus dem Repository ausgeschlossen.
- Preview und spätere Produktion verwenden getrennte Environment-Konfigurationen.
- Dieses Setup ersetzt weder #3 noch spätere Release-, Domain-, Datenschutz- oder Monitoring-Gates.
