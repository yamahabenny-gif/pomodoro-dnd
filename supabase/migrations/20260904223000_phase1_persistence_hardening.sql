-- Harden Phase 1 persistence: progress/session outcome must not be directly client-writable.

create or replace function public.cancel_focus_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  update public.focus_sessions
  set status = 'cancelled'
  where id = p_session_id
    and profile_id = v_user_id
    and status = 'active'
    and rewarded_at is null;
end;
$$;

revoke all on function public.cancel_focus_session(uuid) from public;
grant execute on function public.cancel_focus_session(uuid) to authenticated;

-- The broad update policies from the foundation migration are intentionally removed.
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists focus_sessions_cancel_own on public.focus_sessions;

-- RLS + privileges: clients may read their own rows, edit only character customization,
-- and create a new active session. XP/gold, completion timestamps and unlocks are RPC-only.
revoke insert, update, delete on public.profiles from authenticated;
revoke update, delete on public.focus_sessions from authenticated;
revoke insert, update, delete on public.unlocks from authenticated;

grant select on public.profiles, public.characters, public.focus_sessions, public.unlocks to authenticated;
grant insert, update, delete on public.characters to authenticated;
grant insert on public.focus_sessions to authenticated;
