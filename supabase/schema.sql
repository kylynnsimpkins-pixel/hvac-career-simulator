create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  xp integer not null default 0,
  level integer not null default 1,
  career_path text,
  contractor_score integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists certifications (
  id serial primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  cert_id text not null check (cert_id in ('epa608', 'nate', 'osha10', 'osha30')),
  earned_at timestamptz not null default now(),
  unique (profile_id, cert_id)
);

create table if not exists questions (
  id text primary key,
  category text not null,
  prompt text not null,
  choices jsonb not null,
  answer_index integer not null,
  xp integer not null default 10
);

create table if not exists assignments (
  id serial primary key,
  title text not null,
  due_date date
);

create table if not exists grades (
  id serial primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  assignment_id integer not null references assignments(id) on delete cascade,
  score integer not null
);

create table if not exists cloud_saves (
  player_name text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Demo policy: anyone with the anon key can read/write saves. Tighten with auth before production.
alter table cloud_saves enable row level security;
create policy "anon saves" on cloud_saves for all using (true) with check (true);
