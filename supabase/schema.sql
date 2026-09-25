-- TutorEcon accounts: run this once in the Supabase SQL editor.
--
-- It creates one table that holds each person's study progress, locks it so
-- people can only read and write their own row, and adds a function that lets
-- someone delete their own account.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  -- Progress is small (tens of kilobytes). This stops anyone from using the
  -- table to store large files.
  constraint progress_size check (pg_column_size(data) < 262144)
);

alter table public.progress enable row level security;

drop policy if exists "Read own progress" on public.progress;
drop policy if exists "Add own progress" on public.progress;
drop policy if exists "Change own progress" on public.progress;
drop policy if exists "Remove own progress" on public.progress;

create policy "Read own progress" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Add own progress" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Change own progress" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Remove own progress" on public.progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Lets a signed-in person delete their own account. Their progress row goes
-- with it because of "on delete cascade" above.
create or replace function public.delete_my_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
