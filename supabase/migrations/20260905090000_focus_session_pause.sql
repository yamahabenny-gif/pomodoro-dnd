-- Adds pause/resume support to the phase-1 focus session, mirroring the
-- already-tested accumulated_ms algebra in lib/timer/session.ts. Required by
-- #12 ("Steuerung: Pause"): without server-authoritative pause, a reload
-- during a pause would silently resume counting down.

alter table public.focus_sessions
  add column paused_at timestamptz,
  add column accumulated_ms bigint not null default 0 check (accumulated_ms >= 0);

create or replace function public.pause_focus_session(p_session_id uuid)
returns public.focus_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.focus_sessions%rowtype;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  select * into v_session
  from public.focus_sessions fs
  where fs.id = p_session_id and fs.profile_id = v_user_id
  for update;

  if not found then
    raise exception 'session not found';
  end if;

  if v_session.status <> 'active' then
    raise exception 'only an active session can be paused';
  end if;

  if v_session.paused_at is null then
    update public.focus_sessions fs
    set accumulated_ms = fs.accumulated_ms
        + greatest(0, floor(extract(epoch from (now() - fs.started_at)) * 1000))::bigint,
        paused_at = now()
    where fs.id = p_session_id
    returning * into v_session;
  end if;

  return v_session;
end;
$$;

create or replace function public.resume_focus_session(p_session_id uuid)
returns public.focus_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.focus_sessions%rowtype;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  select * into v_session
  from public.focus_sessions fs
  where fs.id = p_session_id and fs.profile_id = v_user_id
  for update;

  if not found then
    raise exception 'session not found';
  end if;

  if v_session.status <> 'active' then
    raise exception 'only an active session can be resumed';
  end if;

  if v_session.paused_at is not null then
    update public.focus_sessions fs
    set started_at = now(),
        paused_at = null
    where fs.id = p_session_id
    returning * into v_session;
  end if;

  return v_session;
end;
$$;

-- complete_first_light_session compared `now()` against
-- `started_at + duration`, which ignored accumulated_ms and paused time.
-- Recreated here so a pause no longer lets the quest finish early or forces
-- the person to wait out time they already spent paused.
create or replace function public.complete_first_light_session(p_session_id uuid)
returns table (xp integer, gold integer, chest_earned boolean)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.focus_sessions%rowtype;
  v_elapsed_ms bigint;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  select * into v_session
  from public.focus_sessions fs
  where fs.id = p_session_id and fs.profile_id = v_user_id
  for update;

  if not found then
    raise exception 'session not found';
  end if;

  if v_session.quest_key <> 'ein-licht-im-unterholz' or v_session.duration_seconds <> 900 then
    raise exception 'session is not the phase 1 quest';
  end if;

  if v_session.status = 'active' then
    v_elapsed_ms := v_session.accumulated_ms;
    if v_session.paused_at is null then
      v_elapsed_ms := v_elapsed_ms
        + greatest(0, floor(extract(epoch from (now() - v_session.started_at)) * 1000))::bigint;
    end if;

    if v_elapsed_ms < v_session.duration_seconds::bigint * 1000 then
      raise exception 'focus duration not yet elapsed';
    end if;

    update public.focus_sessions fs
    set status = 'completed', completed_at = now()
    where fs.id = p_session_id;
  elsif v_session.status <> 'completed' then
    raise exception 'session is not completable';
  end if;

  if v_session.rewarded_at is null then
    update public.profiles p
    set xp = p.xp + 15,
        gold = p.gold + 3
    where p.id = v_user_id;

    update public.focus_sessions fs
    set rewarded_at = now()
    where fs.id = p_session_id and fs.rewarded_at is null;
  end if;

  return query
  select p.xp, p.gold, true
  from public.profiles p
  where p.id = v_user_id;
end;
$$;

revoke all on function public.pause_focus_session(uuid) from public;
revoke all on function public.resume_focus_session(uuid) from public;
grant execute on function public.pause_focus_session(uuid) to authenticated;
grant execute on function public.resume_focus_session(uuid) to authenticated;
