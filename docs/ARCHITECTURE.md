# Architektur

> Zuständigkeit: `#SENDEV` · Status: **Draft** · Entscheidungen: [DECISIONS.md](DECISIONS.md)

## Stack

| Ebene | Wahl | Begründung |
|---|---|---|
| Framework | **Next.js 15** (App Router, TypeScript) | Das Hosting-Team deployt auf Vercel; Next ist dort der Pfad des geringsten Widerstands. |
| Styling | **Tailwind CSS v4** + **shadcn/ui** | shadcn kopiert Komponenten ins Repo statt sie zu verstecken — bei einem so eigenwilligen Look wichtig, weil wir viel überschreiben. |
| Auth | **Supabase Auth** — Magic Link, Discord OAuth | Discord, weil die Zielgruppe dort ist. **Kein Gastzugang** — Konto und Charakter sind Pflicht, weil Fortschritt, Inventar und Level geräteübergreifend erhalten bleiben müssen (Entscheidung zu W5, Issue #30). |
| Datenbank | **Supabase Postgres** + Row Level Security | RLS macht die Zugriffsregeln zu Datenbank-Constraints statt zu Anwendungslogik. |
| Realtime | **Supabase Realtime** (Broadcast + Presence) | Siehe [SYNC-PROTOCOL.md](SYNC-PROTOCOL.md). |
| Hosting | **Vercel** → `pomodoro.lang-jamin.de` | Übergabe an das Hosting-Team, siehe unten. |
| Tests | **Vitest** (Logik) + **Playwright** (E2E, mehrere Kontexte) | Der Sync ist nur mit zwei echten Browser-Kontexten sinnvoll testbar. |

**Warum kein eigener WebSocket-Server?** Weil das Protokoll fast zustandslos ist. Wir
übertragen Phasenwechsel, keine Ticks — das sind ein paar Nachrichten pro halbe Stunde
und Party. Ein eigener Service wäre Infrastruktur, die niemand betreiben will, für eine
Last, die es nicht gibt. → ADR-001.

## Struktur

```
app/
  (marketing)/page.tsx        Landing Page
  (auth)/login/               Login / Tavernentür
  (app)/
    character/                Klassenwahl, Charakterbogen
    quest/                    Der Haupt-Timer (solo)
    party/[code]/             Party-Timer
    settings/
  api/time/                   Zeitstempel-Endpoint für den Uhren-Abgleich
lib/
  timer/                      Reine Zeit-Logik — komplett ohne React, voll unit-testbar
  party/                      Codes, Beitritt, Broadcast-Client
  loot/                       Truhen-Ziehung, XP-Berechnung
components/
  ui/                         shadcn-Basis
  quest/  party/  chest/      Feature-Komponenten
supabase/migrations/
```

**Eine Regel, die nicht verhandelbar ist:** `lib/timer/` enthält **keine** React-Imports
und **kein** `Date.now()`. Die Uhr wird hineingereicht. Nur so sind die Zeitfälle aus dem
Sync-Protokoll überhaupt testbar — sonst braucht jeder Test eine gefälschte Systemuhr.

```ts
// so, nicht anders:
export function remainingSeconds(phase: PartyPhase, now: number): number
```

## Datenmodell (Entwurf)

```sql
create table profiles (
  id           uuid primary key references auth.users on delete cascade,
  display_name text not null,
  volk_id      text not null default 'mensch',   -- Identität, keine Mechanik
  xp           integer not null default 0,
  gold         integer not null default 0,
  streak_days  integer not null default 0,
  created_at   timestamptz not null default now()
);

create table parties (
  code             text primary key,          -- 5 Zeichen, siehe SYNC-PROTOCOL
  dm_id            uuid references profiles(id) on delete set null,
  class_profile    text not null,             -- Timer-Profil der Party
  phase            text not null default 'idle',
  phase_started_at timestamptz,               -- ← die einzige Quelle der Wahrheit
  phase_duration_s integer,
  paused_at        timestamptz,
  cycle            smallint not null default 1,
  locked           boolean not null default false,
  last_active_at   timestamptz not null default now()
);

create table party_members (
  party_code   text references parties(code) on delete cascade,
  member_id    uuid not null references profiles(id) on delete cascade,
  joined_at    timestamptz not null default now(),
  primary key (party_code, member_id)
);

create table quest_log (
  id            bigserial primary key,
  profile_id    uuid references profiles(id) on delete cascade,
  party_code    text,
  focus_seconds integer not null,
  completed_at  timestamptz not null default now(),
  chest_rarity  text,
  chest_opened  boolean not null default false
);
```

**Kritisch:** `parties.phase_started_at` wird **ausschließlich** serverseitig gesetzt
(`now()` in Postgres, nie ein vom Client geschickter Zeitstempel). Sobald ein Client
seine eigene Zeit schreiben darf, ist der gesamte Sync manipulierbar.

## Sicherheit

- **RLS auf allen Tabellen.** Ein Party-Mitglied darf die Party lesen, aber nur der DM
  darf die Phase schreiben — als Policy, nicht als `if` im Frontend.
- **Jedes Mitglied hat ein Konto.** Es gibt keine anonymen Teilnehmer und damit auch
  keine Sonderpfade in den Policies — jede Zeile hängt an einer `profiles.id`.
- **Keine Service-Role-Keys im Client.** Alles, was erhöhte Rechte braucht, läuft in
  Route Handlers.
- **XP und Loot werden serverseitig berechnet.** Wenn der Client seine eigenen Belohnungen
  schickt, sind die Zahlen bedeutungslos.
- Rate-Limits auf Party-Beitritt (siehe Sync-Protokoll) und auf `/api/time`.

## Datenschutz

Das ist ein Fokus-Tool, kein Zeiterfassungssystem. Konkret:

- Wir speichern Fokus-**Dauern**, keine Inhalte. Es gibt kein Feld für "woran arbeitest du".
- Innerhalb der Party sehen andere: Anzeigename, Klasse, ob gerade aktiv. Sonst nichts.
- Kein Analytics-Tool mit Personenbezug. Falls Metriken gebraucht werden: Vercel
  Analytics ohne Cookies.
- Export und Löschung des eigenen Accounts sind Teil von M5, nicht "später".

## Übergabe an das Hosting-Team

Damit `pomodoro.lang-jamin.de` live gehen kann, braucht das Team:

1. **Vercel-Projekt** verbunden mit diesem Repo. Production-Branch: `main`.
2. **DNS**: `CNAME pomodoro → cname.vercel-dns.com` in der Zone `lang-jamin.de`.
3. **Supabase-Projekt** (Region `eu-central-1`, wegen DSGVO und Latenz).
4. **Environment-Variablen** — die vollständige Liste steht in `.env.example`.
5. **Migrationen**: `supabase db push` gegen das Produktions-Projekt.

Die genaue Checkliste inklusive Reihenfolge liegt als Issue
`#release #SENDEV Deployment-Setup pomodoro.lang-jamin.de`.
