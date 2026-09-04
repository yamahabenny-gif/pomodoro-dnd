# Phase 1 Persistence Contract

**Issue:** #5  
**Scope:** Solo vertical slice only. No party, class, DM or guest-token model.

## Persisted data

- `profiles`: one row per `auth.users` account; XP and Gold live here.
- `characters`: one character configuration per profile for the minimal Phase-1 creator.
- `focus_sessions`: authoritative server start, duration and completion/reward timestamps.
- `unlocks`: durable feature/cosmetic unlock keys; Phase 1 uses `alte-weglaterne`.

## Server-authoritative session flow

1. Call `start_first_light_session()` as an authenticated user.
   - Reuses an already-active session after reload/reconnect.
   - Otherwise creates `ein-licht-im-unterholz` with database `now()` and exactly `900` seconds.
2. Reconstruct remaining time from `started_at + duration_seconds` rather than a client countdown snapshot.
3. Optional abort uses `cancel_focus_session(session_id)`.
4. Successful completion uses `complete_first_light_session(session_id)`.
   - It rejects completion before the server-side end time.
   - It atomically adds **15 XP** and **3 Gold**.
   - It unlocks `alte-weglaterne`.
   - Repeating the completion call does not duplicate rewards.

## Security model

All four Phase-1 tables have RLS enabled. Authenticated users can select only rows tied to their own `auth.uid()`.

Direct client writes are deliberately narrow:

- profile progress is not directly writable;
- focus session outcome/timestamps are not directly writable;
- unlocks are not directly writable;
- character customization is user-writable under owner-only RLS.

Session start, cancellation and successful reward mutation are `security definer` RPCs that derive identity from `auth.uid()` and never trust a user id sent by the client.

## Acceptance mapping

| Issue #5 criterion | Implementation |
|---|---|
| Account uniquely assigned | `profiles.id -> auth.users.id`, PK + auth trigger |
| Character persists | `characters.profile_id` PK/FK + owner RLS |
| Session reload-safe | persisted `started_at`, `duration_seconds`, `status`; active-session reuse |
| 15 XP / 3 Gold persists | atomic completion RPC updates `profiles` |
| Old Way Lantern persists | durable `unlocks(profile_id, unlock_key)` |
| Cross-user access blocked | RLS on every user-related table |
| No Phase-4 concepts | no party, class, DM or guest-token columns/tables |

## Integration handoff

Issue #10 should wire Supabase Auth to the existing `.env.example` variables. Issue #11 writes the `characters` row. Issues #12/#38 call the session RPCs. Issue #39 reads `unlocks` to render the deterministic lantern state.
