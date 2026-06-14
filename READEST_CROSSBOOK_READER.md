# Readest Cross-Book Reader

Atelier uses a Readest-derived reader for the private library, with Castalia
Scriptorium's CrossPoint idea adapted as Atelier Crossbook.

## Reader Shape

- Readest remains the EPUB/PDF rendering engine.
- Supabase remains the catalog, entitlement, release, and storage origin.
- Each book repository can publish artifacts to `book-releases`.
- Each book repository can also publish `.atelier/crossbook-links.json`.
- The reader resolves cross-book links through Supabase and then opens the
  target work/release in Readest.

## Link Manifest

Book repos may include `.atelier/crossbook-links.json`:

```json
{
  "schema": "atelier.crossbook-links.v1",
  "updatedAt": "2026-06-15T00:00:00.000Z",
  "links": [
    {
      "id": "lola-act-i-to-absinthe-chess-table",
      "rel": "echoes",
      "title": "The chess table before Lola",
      "source": {
        "workSlug": "lola",
        "releaseSlug": "act-i",
        "label": "Act I"
      },
      "target": {
        "workSlug": "absinthe",
        "label": "The chess table",
        "href": "chapter-01.xhtml"
      }
    }
  ]
}
```

Locations may use any combination of:

- `workSlug`
- `releaseSlug`
- `href`
- `cfi`
- `fragment`
- `label`

Prefer `cfi` when we need exact passage navigation. Use `href` for a section
or chapter. Use `label` when the destination is still a shell.

## URL Forms

Canonical web form:

```text
https://reader.ateliernymphet.com/o/work/lola/release/act-i?cfi=...
```

App/deep-link form:

```text
atelier://work/lola/release/act-i?cfi=...
```

Until the branded reader is deployed, manifests and Supabase rows are the
source of truth. The URL forms are the stable contract for generated EPUB
links and future native/PWA deep links.

## Supabase

The `crossbook_links` table stores the resolved link graph. The raw manifest is
also uploaded to:

```text
book-releases/<work-slug>/<release-slug>/crossbook-links.json
```

That gives us both:

- a queryable graph for the reader/sidebar/annotations
- a portable manifest for EPUB packages and future offline bundles
