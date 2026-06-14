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

## Publishing Role

Supabase is the first candidate for:

- Auth
- entitlements
- release database
- admin UI
- Storage/S3 object bookshelf

See `../DEPLOYMENT_SUPABASE.md`.
