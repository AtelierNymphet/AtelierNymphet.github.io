#!/usr/bin/env bash
set -euo pipefail

manifest="${ATELIER_PUBLISH_MANIFEST:-.atelier/publish-manifest.json}"

if [[ ! -f "$manifest" ]]; then
  echo "Missing publish manifest: $manifest" >&2
  exit 1
fi

required=(
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
)

for name in "${required[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required environment variable: $name" >&2
    exit 1
  fi
done

bucket="${SUPABASE_STORAGE_BUCKET:-book-releases}"
release_slug="${ATELIER_RELEASE_SLUG:-${GITHUB_REF_NAME:-manual}}"
release_slug="$(printf '%s' "$release_slug" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9._-]+/-/g; s/^-+//; s/-+$//')"

work_slug="$(python3 - "$manifest" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as f:
    print(json.load(f)["work_slug"])
PY
)"

work_title="$(python3 - "$manifest" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as f:
    print(json.load(f).get("title", "Untitled"))
PY
)"

artifact_globs="$(python3 - "$manifest" <<'PY'
import json, sys
with open(sys.argv[1], encoding="utf-8") as f:
    manifest = json.load(f)
for pattern in manifest.get("artifact_globs", ["dist/**", "releases/**"]):
    print(pattern)
PY
)"

mapfile -t artifacts < <(
  python3 - "$manifest" <<'PY'
import glob, json, os, sys
with open(sys.argv[1], encoding="utf-8") as f:
    manifest = json.load(f)
files = []
for pattern in manifest.get("artifact_globs", ["dist/**", "releases/**"]):
    files.extend(glob.glob(pattern, recursive=True))
for path in sorted(set(files)):
    if os.path.isfile(path):
        print(path)
PY
)

if [[ "${#artifacts[@]}" -eq 0 ]]; then
  echo "No publish artifacts found for $work_slug." >&2
  echo "Add files under dist/ or releases/, or edit $manifest artifact_globs." >&2
  exit 1
fi

prefix="${work_slug}/${release_slug}"

json_escape() {
  python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'
}

urlencode() {
  python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.stdin.read().strip(), safe=""))'
}

api() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  if [[ -n "$body" ]]; then
    curl -fsS -X "$method" "${SUPABASE_URL}${path}" \
      -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=representation" \
      -d "$body"
  else
    curl -fsS -X "$method" "${SUPABASE_URL}${path}" \
      -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
  fi
}

encoded_work_slug="$(printf '%s' "$work_slug" | urlencode)"
work_response="$(api GET "/rest/v1/works?slug=eq.${encoded_work_slug}&select=id")"
work_id="$(printf '%s' "$work_response" | python3 -c 'import json,sys; rows=json.load(sys.stdin); print(rows[0]["id"] if rows else "")')"

if [[ -z "$work_id" ]]; then
  title_json="$(printf '%s' "$work_title" | json_escape)"
  repo_json="$(printf '%s' "${GITHUB_REPOSITORY##*/}" | json_escape)"
  body="{\"slug\":\"${work_slug}\",\"title\":${title_json},\"status\":\"shell\",\"repo_name\":${repo_json}}"
  work_response="$(api POST "/rest/v1/works?select=id" "$body")"
  work_id="$(printf '%s' "$work_response" | python3 -c 'import json,sys; rows=json.load(sys.stdin); print(rows[0]["id"])')"
fi

for file in "${artifacts[@]}"; do
  object_path="${prefix}/${file}"
  content_type="$(python3 - "$file" <<'PY'
import mimetypes, sys
print(mimetypes.guess_type(sys.argv[1])[0] or "application/octet-stream")
PY
)"
  echo "Uploading ${file} -> ${bucket}/${object_path}"
  curl -fsS -X POST "${SUPABASE_URL}/storage/v1/object/${bucket}/${object_path}" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "x-upsert: true" \
    -H "Content-Type: ${content_type}" \
    --data-binary @"${file}" >/dev/null
done

release_title="${work_title} ${release_slug}"
body="$(python3 - "$work_id" "$release_slug" "$release_title" "$bucket" "$prefix" <<'PY'
import json, sys
work_id, slug, title, bucket, prefix = sys.argv[1:]
print(json.dumps({
    "work_id": work_id,
    "slug": slug,
    "title": title,
    "visibility": "private",
    "artifact_mode": "supabase-storage",
    "storage_bucket": bucket,
    "storage_prefix": prefix,
}))
PY
)"

curl -fsS -X POST "${SUPABASE_URL}/rest/v1/release_units?on_conflict=work_id,slug" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d "$body" >/dev/null

echo "Published ${#artifacts[@]} artifact(s) for ${work_slug} at ${bucket}/${prefix}"
