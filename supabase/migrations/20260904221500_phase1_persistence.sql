-- Phase 1 persistence foundation for the solo vertical slice.
-- Scope: account/profile, minimal character, reload-safe focus session,
-- deterministic first-loop rewards and unlocks. No party/class dependencies.

create extension if not exists pgcrypto;

create type public.focus_session_status as enum ('active', 'completed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  xp integer not null default 0 check (xp >= 0),
  gold integer not null default 0 check (gold >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.characters (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  ancestry text not null check (ancestry in ('mensch', 'elf', 'zwerg', 'goblin', 'ork')),
  body_variant text not null,
  skin_variant text not null,
  hair_style text not null,
  hair_color text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  quest_key text not null,
  started_at timestamptz not null default now(),
  duration_seconds integer not null check (duration_seconds > 0),
  status public.focus_session_status not null default 'active',
  completed_at timestamptz,
  rewarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint focus_sessions_completion_consistency check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed' and completed_at is null)
  )
);

create unique index focus_sessions_one_active_per_profile
  on public.focus_sessions(profile_id)
  where status = 'active';

create table public.unlocks (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  unlock_key text not null,
  unlocked_at timestamptz not null default now(),
  primary key (profile_id, unlock_key)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger characters_set_updated_at
before update on public.characters
for each row execute function public.set_updated_at();

create trigger focus_sessions_set_updated_at
before update on public.focus_sessions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Atomic first-loop completion. Rewards are intentionally fixed to the Phase 1 quest.
-- Idempotency is provided by rewarded_at and unlocks' composite primary key.
create or replace function public.complete_first_light_session(p_session_id uuid)
returns table (xp integer, gold integer, lantern_unlocked boolean)
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
  from public.focus_sessions
  where id = p_session_id and profile_id = v_user_id
  for update;

  if not found then
    raise exception 'session not found';
  end if;

  if v_session.quest_key <> 'ein-licht-im-unterholz' then
    raise exception 'session is not the phase 1 quest';
  end if;

  if v_session.status = 'active' then
    if now() < v_session.started_at + make_interval(secs => v_session.duration_seconds) then
      raise exception 'focus duration not yet elapsed';
    end if;

    update public.focus_sessions
    set status = 'completed', completed_at = now()
    where id = p_session_id;
  elsif v_session.status <> 'completed' then
    raise exception 'session is not completable';
  end if;

  if v_session.rewarded_at is null then
    update public.profiles
    set xp = profiles.xp + 15,
        gold = profiles.gold + 3
    where profiles.id = v_user_id;

    insert into public.unlocks(profile_id, unlock_key)
    values (v_user_id, 'alte-weglaterne')
    on conflict do nothing;

    update public.focus_sessions
    set rewarded_at = now()
    where id = p_session_id and rewarded_at is null;
  end if;

  return query
  select p.xp,
         p.gold,
         exists(
           select 1 from public.unlocks u
           where u.profile_id = v_user_id and u.unlock_key = 'alte-weglaterne'
         )
  from public.profiles p
  where p.id = v_user_id;
end;
$$;

revoke all on function public.complete_first_light_session(uuid) from public;
grant execute on function public.complete_first_light_session(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.unlocks enable row level security;

create policy profiles_select_own
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy profiles_update_own
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy characters_select_own
on public.characters for select
to authenticated
using ((select auth.uid()) = profile_id);

create policy characters_insert_own
on public.characters for insert
to authenticated
with check ((select auth.uid()) = profile_id);

create policy characters_update_own
on public.characters for update
to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

create policy characters_delete_own
on public.characters for delete
to authenticated
using ((select auth.uid()) = profile_id);

create policy focus_sessions_select_own
on public.focus_sessions for select
to authenticated
using ((select auth.uid()) = profile_id);

create policy focus_sessions_insert_own
on public.focus_sessions for insert
to authenticated
with check ((select auth.uid()) = profile_id and status = 'active' and completed_at is null and rewarded_at is null);

create policy focus_sessions_cancel_own
on public.focus_sessions for update
to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id and status in ('active', 'cancelled') and rewarded_at is null);

create policy unlocks_select_own
on public.unlocks for select
to authenticated
using ((select auth.uid()) = profile_id);

-- No direct client insert/update policy exists for unlocks or rewards.
-- Reward mutation is only possible through complete_first_light_session().
