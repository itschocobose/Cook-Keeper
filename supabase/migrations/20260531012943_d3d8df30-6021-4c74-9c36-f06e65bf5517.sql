create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  constraint feedback_message_length check (char_length(message) between 10 and 1000)
);

grant insert on public.feedback to anon, authenticated;
grant all on public.feedback to service_role;

alter table public.feedback enable row level security;

create policy "Anyone can submit feedback"
  on public.feedback
  for insert
  to anon, authenticated
  with check (char_length(message) between 10 and 1000);

create index feedback_created_at_idx on public.feedback (created_at desc);