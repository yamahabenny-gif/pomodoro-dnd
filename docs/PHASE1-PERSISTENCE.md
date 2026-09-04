# Phase 1 Persistence Contract

**Issue:** #5  
**Scope:** Solo vertical slice only. No party, class, DM or guest-token model.

## Persisted data

- `profiles`: one row per `auth.users` account; XP and Gold live here.
- `characters`: one character configuration per profile for the minimal Phase-1 creator.
- `focus_sessions`: authoritative server start, duration, completion, rest and chest timestamps.
- `unlocks`: durable feature/cosmetic unlock keys; Phase 1 uses `alte-weglaterne` only after the first chest is opened.

## Server-authoritative session flow

1. Call `start_first_light_session()` as an authenticated user.
   - Reuses an already-active session after reload/reconnect.
   - Otherwise creates `ein-licht-im-unterholz` with database `now()` and exactly `900` seconds.
2. Reconstruct remaining time from `started_at + duration_seconds` rather than a client countdown snapshot.
3. Optional abort uses `cancel_focus_session(session_id)`.
4. Successful focus completion uses `complete_first_light_session(session_id)`.
   - It rejects completion before the server-side end time.
   - It atomically adds **15 XP** and **3 Gold**.
   - It marks the first chest as earned by virtue of the rewarded completed session.
   - It does **not** unlock the lantern.
5. After the normal rest or an explicit rest skip, call `finish_first_light_rest(session_id)`.
   - This persists `rest_finished_at` only for an already completed and rewarded session.
6. The chest step calls `open_first_light_chest(session_id)`.
   - It rejects opening before `rest_finished_at` exists.
   - It deterministically inserts `alte-weglaterne` into `unlocks`.
   - It persists `chest_opened_at`.
   - Repeating the call is idempotent and cannot duplicate the unlock.

The persistence sequence is therefore: **focus completion → XP/Gold + chest earned → rest/skip → chest opened → lantern unlocked**.

## Security model

All four Phase-1 tables have RLS enabled. Authenticated users can select only rows tied to their own `auth.uid()`.

Direct client writes are deliberately narrow:

- profile progress is not directly writable;
- focus session outcome/rest/chest timestamps are not directly writable;
- unlocks are not directly writable;
- character customization is user-writable under owner-only RLS.

Session start, cancellation, completion, rest completion and chest opening are `security definer` RPCs that derive identity from `auth.uid()` and never trust a user id sent by the client.

## Acceptance mapping

| Issue #5 criterion | Implementation |
|---|---|
| Account uniquely assigned | `profiles.id -> auth.users.id`, PK + auth trigger |
| Character persists | `characters.profile_id` PK/FK + owner RLS |
| Session reload-safe | persisted `started_at`, `duration_seconds`, `status`; active-session reuse |
| 15 XP / 3 Gold persists | atomic completion RPC updates `profiles` |
| Old Way Lantern persists | `open_first_light_chest()` inserts durable `unlocks(profile_id, unlock_key)` only after rest |
| Reward order survives reload | `rewarded_at`, `rest_finished_at`, `chest_opened_at` persist each step |
| Cross-user access blocked | RLS on every user-related table |
| No Phase-4 concepts | no party, class, DM or guest-token columns/tables |

## Integration handoff

- Issue #10 wires Supabase Auth to the existing `.env.example` variables.
- Issue #11 writes the `characters` row.
- Issues #12/#38 call `start_first_light_session()` / `complete_first_light_session()`.
- Issue #13 calls `finish_first_light_rest()` after the rest or explicit skip.
- Issue #39 calls `open_first_light_chest()` when the first chest is actually opened, then reads `unlocks` to render the lantern in the camp.
