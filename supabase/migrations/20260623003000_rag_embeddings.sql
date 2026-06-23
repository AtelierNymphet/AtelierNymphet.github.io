create extension if not exists vector;

insert into public.works (slug, title, episode, form, status, repo_name, subdomain, description)
values
  ('la-recherche', 'La Recherche', 'Dissertation frame', 'multi-volume dissertation', 'shell', 'LaRecherche', null, 'Daniel''s dissertation before Faerie: the record of learning how to guide through wonder with humility, thresholds, restraint, and answerability.'),
  ('absinthe', 'Absinthe', 'Episode I', 'Second Life comic/novel', 'shell', 'Absinthe', 'absinthe.ateliernymphet.com', 'Second Life, Absinthe Nosferatu, and Isibella origin.'),
  ('isibella', 'Isibella', 'Episode II', 'Chateau/modeling company novel', 'shell', 'Isibella', 'isibella.ateliernymphet.com', 'The Chateau, modeling, Juliette, and the life with Isibella.'),
  ('brulee', 'Brulee', 'Episode II / Episode III overlap', 'theme camp book', 'shell', 'Brulee', null, 'Burning Man, Christopher, and the public ritual machinery that overlaps Isibella and Mircalla.'),
  ('mircalla', 'Mircalla', 'Episode III', 'Dracula/Carmilla-style Victorian Romance', 'shell', 'Mircalla', 'mircalla.ateliernymphet.com', 'Vampire events, Isibella, Todd Vampire, and ritual performance.'),
  ('return-to-the-chateau', 'Return to the Chateau', 'End of Episode III', 'Olympia Press vein', 'shell', 'ReturnToTheChateau', null, 'The leaving-Faerie and after-weather chamber after Mircalla.'),
  ('lola', 'Lola', 'Episode IV', 'jail novel with synthetic screenshots', 'shell', 'Lola', 'lola.ateliernymphet.com', 'The Episode IV tragic love story and annotated message novel.'),
  ('the-trial', 'The Trial', 'Episode IV', 'court novel', 'shell', 'TheTrial', null, 'The mortal court pressure around Lola.'),
  ('diary-of-a-young-girl', 'Diary of a Young Girl', 'Episode IV companion', 'diary-novel', 'shell', 'DiaryOfAYoungGirl', null, 'Lola-side diary novel from the January Pinterest prohibition.'),
  ('diary-of-a-stalker', 'Diary of a Stalker', 'Episode IV companion', 'epistolary monologue', 'shell', 'DiaryOfAStalker', null, 'Daniel-side March/April epistolary response.'),
  ('the-sentence', 'The Sentence', 'Episode V', 'court, Fae court, jail transcripts and writings', 'shell', 'TheSentence', null, 'The mortal court, the Fae court, and jail transcripts/writings before sentence is delivered.'),
  ('camille', 'Camille', 'Episode VI', 'letters and calls from jail', 'shell', 'Camille', null, 'Letters, calls, self-marriage, and the conception of Finn and Aleia.'),
  ('the-appeal', 'The Appeal', 'Post-sentence mature practice', 'household and wardship novel', 'shell', 'TheAppeal', null, 'Daniel taking on Camille, Finn, Aleia, household ritual, legal weather, and wardship without turning them into proof.'),
  ('juliette', 'Juliette', 'Episode II side story', 'side story', 'shell', 'Juliette', null, 'A Chateau model side story that later resurfaces.'),
  ('the-opera', 'The Opera', 'Post-graduate studies', 'opera', 'shell', 'TheOpera', null, 'Post-graduate work after the La Recherche dissertation arc.'),
  ('twenty-dollar-words', 'Twenty Dollar Words', 'Source imprint', 'private source editions', 'shell', 'TwentyDollarWords', 'source.ateliernymphet.com', 'Source-only indexed messages and emails. No commentary; quote API only.')
on conflict (slug) do update
set
  title = excluded.title,
  episode = excluded.episode,
  form = excluded.form,
  status = excluded.status,
  repo_name = excluded.repo_name,
  subdomain = excluded.subdomain,
  description = excluded.description,
  updated_at = now();

create table public.rag_documents (
  id uuid primary key default gen_random_uuid(),
  canonical_url text not null unique,
  work_id uuid not null references public.works(id) on delete cascade,
  release_unit_id uuid references public.release_units(id) on delete set null,
  title text not null,
  document_kind text not null default 'work',
  canonical_epub_id text,
  canonical_tdw_id text,
  epub_available boolean not null default true,
  delivery_mode text not null default 'reader',
  github_owner text not null default 'AtelierNymphet',
  github_repo text not null,
  github_ref text not null default 'main',
  github_path text,
  visibility public.release_visibility not null default 'private',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (document_kind in ('work', 'source_lane', 'manifest', 'critical_note')),
  check (canonical_epub_id is not null or canonical_tdw_id is not null),
  check (delivery_mode in ('reader', 'quote_api_only'))
);

create table public.rag_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.rag_documents(id) on delete cascade,
  canonical_ref text not null unique,
  work_id uuid not null references public.works(id) on delete cascade,
  release_unit_id uuid references public.release_units(id) on delete set null,
  source_lane_slug text,
  chunk_index integer not null,
  section_title text,
  fragment text not null,
  content text not null,
  token_count integer,
  embedding_model text not null default 'gte-small',
  embedding vector(384) not null,
  github_owner text not null default 'AtelierNymphet',
  github_repo text not null,
  github_ref text not null default 'main',
  github_path text,
  char_start integer,
  char_end integer,
  visibility public.release_visibility not null default 'private',
  canonical_epub_id text,
  canonical_tdw_id text,
  epub_available boolean not null default true,
  delivery_mode text not null default 'reader',
  tdw_start text,
  tdw_finish text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (chunk_index >= 0),
  check (char_start is null or char_start >= 0),
  check (char_end is null or char_end >= 0),
  check (char_start is null or char_end is null or char_end >= char_start),
  check (canonical_epub_id is not null or canonical_tdw_id is not null),
  check (delivery_mode in ('reader', 'quote_api_only')),
  check (tdw_start is null or tdw_start ~ '^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}$'),
  check (tdw_finish is null or tdw_finish ~ '^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}\.[0-9]{2}$')
);

create index rag_documents_work_idx on public.rag_documents(work_id);
create index rag_documents_release_idx on public.rag_documents(release_unit_id);
create index rag_documents_visibility_idx on public.rag_documents(visibility);

create index rag_chunks_document_idx on public.rag_chunks(document_id);
create index rag_chunks_work_idx on public.rag_chunks(work_id);
create index rag_chunks_release_idx on public.rag_chunks(release_unit_id);
create index rag_chunks_visibility_idx on public.rag_chunks(visibility);
create index rag_chunks_embedding_idx
  on public.rag_chunks using hnsw (embedding vector_cosine_ops);

alter table public.rag_documents enable row level security;
alter table public.rag_chunks enable row level security;

create policy "public rag documents are readable"
on public.rag_documents for select
to anon, authenticated
using (visibility = 'public');

create policy "entitled rag documents are readable"
on public.rag_documents for select
to authenticated
using (
  visibility = 'subscriber'
  and exists (
    select 1
    from public.entitlements e
    where e.reader_id = auth.uid()
      and (
        e.release_unit_id = rag_documents.release_unit_id
        or e.work_id = rag_documents.work_id
      )
      and e.starts_at <= now()
      and (e.expires_at is null or e.expires_at > now())
  )
);

create policy "public rag chunks are readable"
on public.rag_chunks for select
to anon, authenticated
using (visibility = 'public');

create policy "entitled rag chunks are readable"
on public.rag_chunks for select
to authenticated
using (
  visibility = 'subscriber'
  and exists (
    select 1
    from public.entitlements e
    where e.reader_id = auth.uid()
      and (
        e.release_unit_id = rag_chunks.release_unit_id
        or e.work_id = rag_chunks.work_id
      )
      and e.starts_at <= now()
      and (e.expires_at is null or e.expires_at > now())
  )
);

create or replace function public.match_rag_chunks(
  query_embedding vector(384),
  match_count integer default 12,
  min_similarity double precision default 0.2,
  filter_work_slug text default null,
  include_tdw boolean default false
)
returns table (
  id uuid,
  canonical_ref text,
  canonical_url text,
  fragment text,
  work_slug text,
  work_title text,
  release_unit_id uuid,
  source_lane_slug text,
  section_title text,
  content text,
  similarity double precision,
  canonical_epub_id text,
  canonical_tdw_id text,
  epub_available boolean,
  delivery_mode text,
  tdw_start text,
  tdw_finish text,
  metadata jsonb
)
language sql
stable
as $$
  select
    rc.id,
    rc.canonical_ref,
    rd.canonical_url,
    rc.fragment,
    w.slug as work_slug,
    w.title as work_title,
    rc.release_unit_id,
    rc.source_lane_slug,
    rc.section_title,
    rc.content,
    1 - (rc.embedding <=> query_embedding) as similarity,
    rc.canonical_epub_id,
    rc.canonical_tdw_id,
    rc.epub_available,
    rc.delivery_mode,
    rc.tdw_start,
    rc.tdw_finish,
    rc.metadata
  from public.rag_chunks rc
  join public.rag_documents rd on rd.id = rc.document_id
  join public.works w on w.id = rc.work_id
  where (filter_work_slug is null or w.slug = filter_work_slug)
    and (include_tdw or rc.delivery_mode <> 'quote_api_only')
    and 1 - (rc.embedding <=> query_embedding) >= min_similarity
  order by rc.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 50);
$$;

comment on table public.rag_documents is
  'RAG document registry for reader works and private TDW/source lanes. Text visibility follows release-unit entitlement rules.';

comment on table public.rag_chunks is
  'Embedded retrieval chunks for La Recherche. TDW chunks may exist privately but are not public EPUB artifacts.';

comment on function public.match_rag_chunks is
  'Vector search over readable RAG chunks. RLS on rag_chunks/rag_documents controls which rows a caller can retrieve.';
