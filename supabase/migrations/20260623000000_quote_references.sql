create table public.quote_references (
  id uuid primary key default gen_random_uuid(),
  canonical_ref text not null unique,
  work_id uuid not null references public.works(id) on delete cascade,
  release_unit_id uuid references public.release_units(id) on delete set null,
  source_lane_slug text,
  canonical_epub_id text,
  canonical_tdw_id text,
  epub_available boolean not null default true,
  delivery_mode text not null default 'reader',
  canonical_url text not null,
  fragment text not null,
  github_owner text not null default 'AtelierNymphet',
  github_repo text not null,
  github_ref text not null default 'main',
  github_path text not null,
  content_sha text,
  char_start integer,
  char_end integer,
  quote_max_chars integer not null default 1200,
  visibility public.release_visibility not null default 'private',
  tdw_start text,
  tdw_finish text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_start is null or char_start >= 0),
  check (char_end is null or char_end >= 0),
  check (char_start is null or char_end is null or char_end >= char_start),
  check (quote_max_chars > 0 and quote_max_chars <= 4000),
  check (canonical_epub_id is not null or canonical_tdw_id is not null),
  check (delivery_mode in ('reader', 'quote_api_only')),
  check (tdw_start is null or tdw_start ~ '^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}$'),
  check (tdw_finish is null or tdw_finish ~ '^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}$')
);

create index quote_references_work_idx on public.quote_references(work_id);
create index quote_references_release_idx on public.quote_references(release_unit_id);
create index quote_references_fragment_idx on public.quote_references(fragment);
create index quote_references_github_idx on public.quote_references(github_owner, github_repo, github_ref, github_path);

alter table public.quote_references enable row level security;

create policy "public quote references are readable"
on public.quote_references for select
to anon, authenticated
using (visibility = 'public');

create policy "entitled quote references are readable"
on public.quote_references for select
to authenticated
using (
  visibility = 'subscriber'
  and exists (
    select 1
    from public.entitlements e
    where e.reader_id = auth.uid()
      and (
        e.release_unit_id = quote_references.release_unit_id
        or e.work_id = quote_references.work_id
      )
      and e.starts_at <= now()
      and (e.expires_at is null or e.expires_at > now())
  )
);

comment on table public.quote_references is
  'Canonical quote lookup metadata. Quote text remains in private GitHub; Supabase stores refs, policy, and extraction coordinates.';
