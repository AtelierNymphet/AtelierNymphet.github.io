insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tdw-private',
  'tdw-private',
  false,
  524288000,
  array[
    'application/epub+zip',
    'application/octet-stream',
    'text/markdown',
    'text/plain',
    'application/json',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'audio/mpeg',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "tdw private objects are service-role only"
on storage.objects for all
to service_role
using (bucket_id = 'tdw-private')
with check (bucket_id = 'tdw-private');
