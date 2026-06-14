insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'book-releases',
  'book-releases',
  false,
  104857600,
  array[
    'application/pdf',
    'application/epub+zip',
    'application/zip',
    'application/json',
    'text/plain',
    'text/markdown',
    'text/html',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into public.works (slug, title, episode, form, status, repo_name, subdomain, description)
values
  ('brulee', 'Brulee', 'Side story', 'theme camp book', 'shell', 'Brulee', null, 'The Burning Man theme camp on Esplanade.'),
  ('camille', 'Camille', 'Episode VI', 'letters and calls from jail', 'shell', 'Camille', null, 'Letters, calls, self-marriage, and the conception of Finn and Aleia.'),
  ('cancel-cult', 'Cancel Cult', 'After Puddleduck', 'source-linked account', 'shell', 'CancelCult', null, 'The later cancellation of Isibella and The Chateau.'),
  ('isibella', 'Isibella', 'Episode II', 'Chateau/modeling company novel', 'shell', 'Isibella', 'isibella.ateliernymphet.com', 'The Chateau, modeling, Juliette, and the life with Isibella.'),
  ('isibella-puddleduck', 'Isibella Puddleduck', 'After Episode III', 'Beatrix Potter-style illustrated square book', 'shell', 'IsibellaPuddleduck', null, 'The story of Isibella leaving Daniel for the handsome wolf.'),
  ('juliette', 'Juliette', 'Episode II side story', 'side story', 'shell', 'Juliette', null, 'A Chateau model side story that later resurfaces.'),
  ('petit-madeleine', 'Petit Madeleine', 'Twenty Dollar Words', 'conversation/source edition', 'shell', 'PetitMadeleine', null, 'A source conversation about accusation, responsibility, and what should have been done.'),
  ('playbill', 'Playbill', 'Episode IV companion', 'Playbill-style critical booklets', 'shell', 'Playbill', null, 'Magic Flute, Nutcracker, and Phantom booklets from the New York trip.'),
  ('return-to-the-chateau', 'Return to the Chateau', 'Later work', 'Olympia Press vein', 'shell', 'ReturnToTheChateau', null, 'A return-work in the Olympia Press vein.'),
  ('the-mystery-of-the-chateau', 'The Mystery of The Chateau', 'Episode IV context', 'Nancy Drew form factor', 'shell', 'TheMysteryOfTheChateau', null, 'Juliette, El Paso County, and Deputy Dan.'),
  ('the-opera', 'The Opera', 'Lola companion', 'Romeo and Juliet-style opera', 'shell', 'TheOpera', null, 'The Lola tale in opera form, derived from poems and plays.'),
  ('the-original-of-laura', 'Vol 0 - The Original of Laura', 'Episode 0', 'index cards with memories', 'shell', 'TheOriginalOfLaura', null, '1993-2007, presented as index cards with memories.'),
  ('theatre', 'Theatre', 'Quarto series', 'screenplays and plays', 'shell', 'Theatre', null, 'Quarto-style editions of plays and screenplays.'),
  ('todd-vampire', 'Todd Vampire', 'Episode III side story', 'Beatrix Potter-style illustrated square book', 'shell', 'ToddVampire', null, 'Isibella’s vampire obsession.'),
  ('wee-christopher', 'Wee Christopher', 'Brulee/Puddleduck context', 'Beatrix Potter-style illustrated square book', 'shell', 'WeeChristopher', null, 'The trip to Burning Man, Christopher, and the hidden wound.'),
  ('de-vision-quest', 'De/Vision Quest', 'After Mircalla', 'Rite in the Rain-style field journal', 'shell', 'WriteInRain-DeVisionQuest', null, 'The September New Mexico vision quest after the divorce.'),
  ('re-vision-quest', 'Re/Vision Quest', 'Episode IV entr''acte', 'illustrated field journal', 'shell', 'WriteInRain-ReVisionQuest', null, 'Thanksgiving 2021 in New Mexico, Ojo Caliente, Abiquiu, Sandia, La Madera, cholla, pinon, and juniper.')
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
