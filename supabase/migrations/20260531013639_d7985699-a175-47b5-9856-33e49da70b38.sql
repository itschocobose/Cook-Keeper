-- Role enum
create type public.app_role as enum ('admin', 'user');

-- user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (user_id = auth.uid());

-- security-definer role check
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Admin policies on feedback
grant select, delete on public.feedback to authenticated;

create policy "Admins can view feedback"
  on public.feedback
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete feedback"
  on public.feedback
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));