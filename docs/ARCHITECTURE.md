# Architektur

> Zuständigkeit: `#SENDEV` · Status: **Draft** · Entscheidungen: [DECISIONS.md](DECISIONS.md)

## Stack

| Ebene | Wahl | Begründung |
|---|---|---|
| Framework | **Next.js 15** (App Router, TypeScript) | App Router, Route Handlers und serverseitige Ausführung passen zu Auth-, Zeit- und Reward-Pfaden. Das Framework bleibt unabhängig vom konkreten Hostinganbieter. |
| Styling | **Tailwind CSS v4** + **shadcn/ui** | shadcn kopiert Komponenten ins Repo statt sie zu verstecken — bei einem so eigenwilligen Look wichtig, weil wir viel überschreiben. |
| Auth | **Supabase Auth** — Magic Link, Discord OAuth | Discord, weil die Zielgruppe dort ist. **Kein Gastzugang** — Konto und Charakter sind Pflicht, weil Fortschritt, Inventar und Level geräteübergreifend erhalten bleiben müssen (Entscheidung zu W5, Issue #30). |
| Datenbank | **Supabase Postgres** + Row Level Security | RLS macht die Zugriffsregeln zu Datenbank-Constraints statt zu Anwendungslogik. |
| Realtime | **Supabase Realtime** (Broadcast + Presence) | Siehe [SYNC-PROTOCOL.md](SYNC-PROTOCOL.md). |
| Hosting | **Hostinger** → `focus.lang-jamin.de` | Zielarchitektur gemäß ADR-036 / Issue #3. Die Plattform-Kompatibilität ist in [HOSTINGER-RUNTIME-QUALIFICATION.md](HOSTINGER-RUNTIME-QUALIFICATION.md) belegt; der konkrete Account/Tarif bleibt vor Produktions-Cutover zu verifizieren. |
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
- Kein personenbezogenes Analytics ohne separate Datenschutz- und Architekturentscheidung.
  Hosting-Provider-Metriken oder externe Analytics dürfen nicht stillschweigend aktiviert werden.
- Export und Löschung des eigenen Accounts sind Teil von M5, nicht "später".

## Übergabe an das Hosting-Team

Öffentliches Produktionsziel ist `https://focus.lang-jamin.de`. Die Hostinger-Subdomain-
Infrastruktur ist bereits vorbereitet; das ist **noch kein App-Deployment**. Der kontrollierte
Produktions-Cutover bleibt in **Issue #3** gegatet.

Die dokumentierte Plattform-Kompatibilität liegt in
[HOSTINGER-RUNTIME-QUALIFICATION.md](HOSTINGER-RUNTIME-QUALIFICATION.md). Sie bestätigt,
dass Hostingers Managed-Node.js-Plattform die benötigte Next.js-Serverarchitektur grundsätzlich
tragen kann. Sie ersetzt **nicht** die noch ausstehende hPanel-Verifikation des konkreten Tarifs
und Zielbetriebs für `focus.lang-jamin.de`.

Vor dem Cutover müssen mindestens folgende Punkte nachgewiesen und dokumentiert sein:

1. **Vertical Slice #35** intern vollständig abgenommen.
2. **Hostinger-Zielbetrieb account-spezifisch qualifiziert:** konkreter Tarif/Betriebsmodus,
   tatsächlich auswählbare Node.js-Version, Build/Start-Einstellungen, Runtime-Logs und Rollback.
3. **Pre-Cutover-Backup/Snapshot** des aktuellen `focus`-Zustands erstellt und Wiederherstellung geprüft.
4. **Freigegebener Produktions-Build** aus einem dokumentierten Commit erzeugt.
5. **Secrets ausschließlich serverseitig:** `SUPABASE_SERVICE_ROLE_KEY` niemals als `NEXT_PUBLIC_*`,
   im Client-Bundle, Build-Artefakt oder Log veröffentlichen.
6. **Supabase Auth** auf `https://focus.lang-jamin.de` vorbereitet: Site URL und Redirect-Allowlist
   sowie Magic-Link-/OAuth-Flows end-to-end testen.
7. **HTTPS, Deep Links/Reload, serverseitige Endpunkte, kritische Assets und Supabase Realtime** testen.
8. **DNS-Zielwerte/TTL und Cutover-Fenster** erst aus dem tatsächlich qualifizierten Hostinger-Ziel ableiten;
   keine früheren Vercel-CNAME-Werte übernehmen.
9. **Technical Owner + Release-Team-Freigabe** in Issue #3 dokumentieren.

Bis die account-spezifische Laufzeitqualifikation vorliegt, werden `next.config.mjs`, `package.json`
und Deployment-CI nicht vorsorglich auf Hostinger-spezifische Annahmen umgebaut. Falls der verfügbare
Hostinger-Betrieb keine benötigte Next.js-Serverlaufzeit unterstützt, ist vor Implementierung eine
separate Architekturentscheidung nötig; ein statischer Export wird nicht implizit angenommen.

Supabase bleibt unabhängig vom Webhosting für Auth, Postgres und Realtime vorgesehen. Ein Hostingwechsel
erfordert nicht automatisch eine Schemaänderung; produktive Migrationen bleiben separat reproduzierbar,
RLS-geprüft und release-gegatet.
