create extension if not exists "pgcrypto";

create type public.work_status as enum (
  'shell',
  'drafting',
  'serializing',
  'published',
  'archived'
);

create type public.release_visibility as enum (
  'public',
  'subscriber',
  'private',
  'forthcoming'
);

create type public.entitlement_source as enum (
  'admin',
  'subscription',
  'invite',
  'purchase'
);

create table public.reader_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.works (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  episode text,
  form text,
  status public.work_status not null default 'shell',
  description text,
  repo_name text,
  subdomain text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.release_units (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  slug text not null,
  title text not null,
  sequence numeric(10, 3) not null default 0,
  visibility public.release_visibility not null default 'forthcoming',
  artifact_mode text,
  dominant_question text,
  unresolved_pressure text,
  storage_bucket text,
  storage_prefix text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (work_id, slug)
);

create table public.offramps (
  id uuid primary key default gen_random_uuid(),
  from_release_unit_id uuid not null references public.release_units(id) on delete cascade,
  to_work_id uuid references public.works(id) on delete set null,
  label text not null,
  description text,
  target_url text,
  created_at timestamptz not null default now()
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  reader_id uuid not null references auth.users(id) on delete cascade,
  work_id uuid references public.works(id) on delete cascade,
  release_unit_id uuid references public.release_units(id) on delete cascade,
  source public.entitlement_source not null default 'admin',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  check (work_id is not null or release_unit_id is not null)
);

create table public.read_progress (
  reader_id uuid not null references auth.users(id) on delete cascade,
  release_unit_id uuid not null references public.release_units(id) on delete cascade,
  last_position jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (reader_id, release_unit_id)
);

create index release_units_work_sequence_idx on public.release_units(work_id, sequence);
create index entitlements_reader_idx on public.entitlements(reader_id);
create index entitlements_work_idx on public.entitlements(work_id);
create index entitlements_release_unit_idx on public.entitlements(release_unit_id);

alter table public.reader_profiles enable row level security;
alter table public.works enable row level security;
alter table public.release_units enable row level security;
alter table public.offramps enable row level security;
alter table public.entitlements enable row level security;
alter table public.read_progress enable row level security;

create policy "read own profile"
on public.reader_profiles for select
to authenticated
using (id = auth.uid());

create policy "update own profile"
on public.reader_profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "public works are readable"
on public.works for select
to anon, authenticated
using (status in ('shell', 'serializing', 'published'));

create policy "public release units are readable"
on public.release_units for select
to anon, authenticated
using (visibility = 'public');

create policy "entitled release units are readable"
on public.release_units for select
to authenticated
using (
  visibility = 'subscriber'
  and exists (
    select 1
    from public.entitlements e
    where e.reader_id = auth.uid()
      and (e.release_unit_id = release_units.id or e.work_id = release_units.work_id)
      and e.starts_at <= now()
      and (e.expires_at is null or e.expires_at > now())
  )
);

create policy "offramps readable when source release is readable"
on public.offramps for select
to anon, authenticated
using (
  exists (
    select 1
    from public.release_units ru
    where ru.id = offramps.from_release_unit_id
      and ru.visibility = 'public'
  )
  or (
    auth.uid() is not null
    and exists (
      select 1
      from public.release_units ru
      join public.entitlements e
        on e.reader_id = auth.uid()
       and (e.release_unit_id = ru.id or e.work_id = ru.work_id)
      where ru.id = offramps.from_release_unit_id
        and e.starts_at <= now()
        and (e.expires_at is null or e.expires_at > now())
    )
  )
);

create policy "read own entitlements"
on public.entitlements for select
to authenticated
using (reader_id = auth.uid());

create policy "read own progress"
on public.read_progress for select
to authenticated
using (reader_id = auth.uid());

create policy "upsert own progress"
on public.read_progress for all
to authenticated
using (reader_id = auth.uid())
with check (reader_id = auth.uid());

insert into public.works (slug, title, episode, form, status, repo_name, subdomain, description)
values
  ('lola', 'Lola', 'Episode IV', 'jail novel with synthetic screenshots', 'shell', 'Lola', 'lola.ateliernymphet.com', 'The Episode IV tragic love story and annotated message novel.'),
  ('diary-of-a-young-girl', 'Diary of a Young Girl', 'Episode IV companion', 'diary-novel', 'shell', 'DiaryOfAYoungGirl', null, 'Lola-side diary novel from the January Pinterest prohibition.'),
  ('diary-of-a-stalker', 'Diary of a Stalker', 'Episode IV companion', 'epistolary monologue', 'shell', 'DiaryOfAStalker', null, 'Daniel-side March/April epistolary response.'),
  ('absinthe', 'Absinthe', 'Episode I', 'Second Life comic/novel', 'shell', 'Absinthe', 'absinthe.ateliernymphet.com', 'Second Life, Absinthe Nosferatu, and Isibella origin.'),
  ('mircalla', 'Mircalla', 'Episode III', 'Dracula/Carmilla-style Victorian Romance', 'shell', 'Mircalla', 'mircalla.ateliernymphet.com', 'Vampire events, Isibella, Todd Vampire, and ritual performance.'),
  ('twenty-dollar-words', 'Twenty Dollar Words', 'Imprint', 'source editions', 'shell', 'TwentyDollarWords', 'source.ateliernymphet.com', 'Text-message/source editions. No judgment, just conversation.');
