# Supabase Setup

Supabase project: AtelierNymphet.

This folder tracks schema and deployment scaffolding only. Do not commit project URLs, anon keys, service role keys, S3 keys, or subscriber data.

## Local Setup

Copy the environment template:

```sh
cp .env.example .env
```

Fill in values from the Supabase dashboard:

- `SUPABASE_PROJECT_REF`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GITHUB_QUOTE_TOKEN` for the `quote-by-reference` Edge Function
- `ATELIER_RAG_INGEST_SECRET` for the `index-rag-chunk` Edge Function

Optional Storage S3 values can be filled in once S3 protocol access is enabled in Supabase Storage settings.

## Link Project

```sh
supabase login
supabase link --project-ref "$SUPABASE_PROJECT_REF"
```

## Apply Migrations

```sh
supabase db push
```

## Initial Model

The first migration creates:

- `reader_profiles`
- `works`
- `release_units`
- `offramps`
- `entitlements`
- `read_progress`

It also seeds the first shell works:

- `lola`
- `diary-of-a-young-girl`
- `diary-of-a-stalker`
- `absinthe`
- `mircalla`
- `twenty-dollar-words`

The quote-reference migration adds canonical quote metadata and the
`quote-by-reference` Edge Function.

The RAG migration adds:

- `rag_documents`
- `rag_chunks`
- `match_rag_chunks(...)`
- an HNSW pgvector index for semantic search
- `rag-search` for reader retrieval
- `index-rag-chunk` for admin ingestion

## Publishing Role

Supabase is the first candidate for:

- Auth
- entitlements
- release database
- admin UI
- Storage/S3 object bookshelf
- quote lookup by canonical EPUB/source reference
- retrieval-augmented search over canonical work chunks and private TDW/source
  lanes, with entitlement-aware RLS

See `../DEPLOYMENT_SUPABASE.md`.
