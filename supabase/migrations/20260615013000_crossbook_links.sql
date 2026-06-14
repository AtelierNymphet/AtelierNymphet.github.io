create table public.crossbook_links (
  id uuid primary key default gen_random_uuid(),
  rel text not null default 'references',
  title text,
  note text,
  source_work_id uuid not null references public.works(id) on delete cascade,
  source_release_unit_id uuid references public.release_units(id) on delete set null,
  source_href text,
  source_cfi text,
  source_fragment text,
  source_label text,
  target_work_id uuid not null references public.works(id) on delete cascade,
  target_release_unit_id uuid references public.release_units(id) on delete set null,
  target_href text,
  target_cfi text,
  target_fragment text,
  target_label text,
  manifest_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crossbook_links_source_work_idx on public.crossbook_links(source_work_id);
create index crossbook_links_target_work_idx on public.crossbook_links(target_work_id);
create index crossbook_links_source_release_idx on public.crossbook_links(source_release_unit_id);
create index crossbook_links_target_release_idx on public.crossbook_links(target_release_unit_id);
create unique index crossbook_links_manifest_id_idx
on public.crossbook_links(manifest_id)
where manifest_id is not null;

alter table public.crossbook_links enable row level security;

create policy "crossbook links readable when source work is readable"
on public.crossbook_links for select
to anon, authenticated
using (
  exists (
    select 1
    from public.works w
    where w.id = crossbook_links.source_work_id
      and w.status in ('shell', 'serializing', 'published')
  )
);
