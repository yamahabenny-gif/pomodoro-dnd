-- Phase 1 focus sessions start on the database clock; clients cannot forge started_at/duration.

create or replace function public.start_first_light_session()
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

  if not exists (select 1 from public.profiles where id = v_user_id) then
    raise exception 'profile not found';
  end if;

  select * into v_session
  from public.focus_sessions
  where profile_id = v_user_id and status = 'active'
  limit 1;

  if found then
    return v_session;
  end if;

  insert into public.focus_sessions (
    profile_id,
    quest_key,
    started_at,
    duration_seconds,
    status
  ) values (
    v_user_id,
    'ein-licht-im-unterholz',
    now(),
    900,
    'active'
  )
  returning * into v_session;

  return v_session;
end;
$$;

revoke all on function public.start_first_light_session() from public;
grant execute on function public.start_first_light_session() to authenticated;

-- Direct inserts are no longer needed: the start RPC is the sole creation path.
revoke insert on public.focus_sessions from authenticated;
drop policy if exists focus_sessions_insert_own on public.focus_sessions;
