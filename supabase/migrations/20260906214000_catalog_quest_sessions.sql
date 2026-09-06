-- M4 #26: server-authoritative 15/25/50 minute catalog sessions.
-- Keeps focus_sessions as the single source of truth for elapsed time.

create or replace function public.start_catalog_quest_session(
  p_quest_key text,
  p_duration_seconds integer
)
returns public.focus_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.focus_sessions%rowtype;
begin
  if v_user_id is null then raise exception 'authentication required'; end if;

  if (p_quest_key, p_duration_seconds) not in (
    ('moos-am-alten-steg', 900),
    ('kartenrand-im-farn', 1500),
    ('teehaus-hinter-den-birken', 1500),
    ('pfad-der-stillen-steine', 3000),
    ('laternen-am-waldrand', 3000)
  ) then
    raise exception 'unknown catalog quest or duration';
  end if;

  insert into public.focus_sessions(profile_id, quest_key, started_at, duration_seconds, status)
  values (v_user_id, p_quest_key, now(), p_duration_seconds, 'active')
  on conflict (profile_id) where status = 'active' do nothing;

  select * into v_session
  from public.focus_sessions fs
  where fs.profile_id = v_user_id and fs.status = 'active'
  order by fs.created_at desc
  limit 1;

  if v_session.quest_key <> p_quest_key or v_session.duration_seconds <> p_duration_seconds then
    raise exception 'another focus session is already active';
  end if;

  return v_session;
end;
$$;

create or replace function public.complete_catalog_quest_session(p_session_id uuid)
returns public.focus_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_session public.focus_sessions%rowtype;
  v_elapsed_ms bigint;
begin
  if v_user_id is null then raise exception 'authentication required'; end if;

  select * into v_session
  from public.focus_sessions fs
  where fs.id = p_session_id and fs.profile_id = v_user_id
  for update;

  if not found then raise exception 'session not found'; end if;
  if v_session.quest_key = 'ein-licht-im-unterholz' then raise exception 'phase 1 quest uses its existing completion flow'; end if;
  if v_session.duration_seconds not in (900, 1500, 3000) then raise exception 'unsupported catalog duration'; end if;

  if v_session.status = 'active' then
    v_elapsed_ms := v_session.accumulated_ms;
    if v_session.paused_at is null then
      v_elapsed_ms := v_elapsed_ms + greatest(0, floor(extract(epoch from (now() - v_session.started_at)) * 1000))::bigint;
    end if;
    if v_elapsed_ms < v_session.duration_seconds::bigint * 1000 then raise exception 'focus duration not yet elapsed'; end if;

    update public.focus_sessions fs
    set status = 'completed', completed_at = now()
    where fs.id = p_session_id
    returning * into v_session;
  elsif v_session.status <> 'completed' then
    raise exception 'session is not completable';
  end if;

  return v_session;
end;
$$;

revoke all on function public.start_catalog_quest_session(text, integer) from public;
revoke all on function public.complete_catalog_quest_session(uuid) from public;
grant execute on function public.start_catalog_quest_session(text, integer) to authenticated;
grant execute on function public.complete_catalog_quest_session(uuid) to authenticated;
