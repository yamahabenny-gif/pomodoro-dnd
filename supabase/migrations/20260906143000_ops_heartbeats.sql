-- Retrofit: dokumentiert im Repo, was HERMES (Webadmin) am 2026-09-06 bereits
-- direkt gegen die Live-Instanz angewendet hat (siehe Kommentare auf #51,
-- 14:29-15:46 Uhr). Ohne diese Datei war das Schema der Datenbank nicht mehr
-- deckungsgleich mit dem, was im Repository nachvollziehbar ist - genau das
-- widerspricht docs/WORKFLOW.md ("Ergebnisse ins Repo schreiben, nicht nur
-- in den Chat"). `if not exists`/idempotente Grants, damit ein erneutes
-- Anwenden gegen die bereits laufende Instanz nicht fehlschlaegt.
--
-- Zweck: alle drei Kalendertage ein Betriebs-Heartbeat, damit das Supabase-
-- Free-Plan-Projekt nicht wegen Inaktivitaet automatisch pausiert wird
-- (Supabase pausiert Free-Projekte nach sieben Tagen ohne Aktivitaet).
-- Beruehrt ausschliesslich diesen einen dedizierten Datensatz - keine
-- fachlichen Tabellen (profiles/characters/focus_sessions/unlocks).

create table if not exists public.ops_heartbeats (
  service text primary key,
  commit_sha text not null,
  source text not null,
  touched_at timestamptz not null
);

alter table public.ops_heartbeats enable row level security;

revoke all on public.ops_heartbeats from public, anon, authenticated;
grant select, insert, update on public.ops_heartbeats to service_role;
