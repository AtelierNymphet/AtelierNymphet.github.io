#!/usr/bin/env bash
set -euo pipefail

manifest="${ATELIER_PUBLISH_MANIFEST:-.atelier/publish-manifest.json}"
crossbook_manifest="${ATELIER_CROSSBOOK_MANIFEST:-.atelier/crossbook-links.json}"

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

release_response="$(api GET "/rest/v1/release_units?work_id=eq.${work_id}&slug=eq.${release_slug}&select=id")"
release_unit_id="$(printf '%s' "$release_response" | python3 -c 'import json,sys; rows=json.load(sys.stdin); print(rows[0]["id"] if rows else "")')"

if [[ -f "$crossbook_manifest" ]]; then
  echo "Uploading ${crossbook_manifest} -> ${bucket}/${prefix}/crossbook-links.json"
  curl -fsS -X POST "${SUPABASE_URL}/storage/v1/object/${bucket}/${prefix}/crossbook-links.json" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "x-upsert: true" \
    -H "Content-Type: application/json" \
    --data-binary @"${crossbook_manifest}" >/dev/null

  SUPABASE_URL="$SUPABASE_URL" \
  SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  ATELIER_SOURCE_WORK_SLUG="$work_slug" \
  ATELIER_SOURCE_RELEASE_SLUG="$release_slug" \
  ATELIER_SOURCE_WORK_ID="$work_id" \
  ATELIER_SOURCE_RELEASE_UNIT_ID="$release_unit_id" \
  python3 - "$crossbook_manifest" <<'PY'
import json
import os
import sys
import urllib.parse
import urllib.request

manifest_path = sys.argv[1]
with open(manifest_path, encoding="utf-8") as f:
    manifest = json.load(f)

links = manifest.get("links", [])
if not links:
    raise SystemExit(0)

supabase_url = os.environ["SUPABASE_URL"].rstrip("/")
service_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
source_work_slug = os.environ["ATELIER_SOURCE_WORK_SLUG"]
source_release_slug = os.environ["ATELIER_SOURCE_RELEASE_SLUG"]
source_work_id = os.environ["ATELIER_SOURCE_WORK_ID"]
source_release_unit_id = os.environ.get("ATELIER_SOURCE_RELEASE_UNIT_ID") or None

headers = {
    "apikey": service_key,
    "Authorization": f"Bearer {service_key}",
    "Content-Type": "application/json",
}

def request(method, path, body=None, prefer=None):
    req_headers = dict(headers)
    if prefer:
        req_headers["Prefer"] = prefer
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(f"{supabase_url}{path}", data=data, headers=req_headers, method=method)
    with urllib.request.urlopen(req) as response:
        raw = response.read().decode("utf-8")
    return json.loads(raw) if raw else None

def quote(value):
    return urllib.parse.quote(str(value), safe="")

work_cache = {source_work_slug: source_work_id}
release_cache = {(source_work_slug, source_release_slug): source_release_unit_id}

def get_work_id(slug):
    if not slug:
        return None
    if slug in work_cache:
        return work_cache[slug]
    rows = request("GET", f"/rest/v1/works?slug=eq.{quote(slug)}&select=id")
    work_cache[slug] = rows[0]["id"] if rows else None
    return work_cache[slug]

def get_release_id(work_slug, release_slug):
    if not work_slug or not release_slug:
        return None
    key = (work_slug, release_slug)
    if key in release_cache:
        return release_cache[key]
    work_id = get_work_id(work_slug)
    if not work_id:
        release_cache[key] = None
        return None
    rows = request(
        "GET",
        f"/rest/v1/release_units?work_id=eq.{quote(work_id)}&slug=eq.{quote(release_slug)}&select=id",
    )
    release_cache[key] = rows[0]["id"] if rows else None
    return release_cache[key]

def clean_location(location, fallback_work_slug=None, fallback_release_slug=None):
    location = location or {}
    work_slug = location.get("workSlug") or fallback_work_slug
    release_slug = location.get("releaseSlug") or fallback_release_slug
    return {
        "work_slug": work_slug,
        "release_slug": release_slug,
        "work_id": get_work_id(work_slug),
        "release_unit_id": get_release_id(work_slug, release_slug),
        "href": location.get("href") or None,
        "cfi": location.get("cfi") or None,
        "fragment": location.get("fragment") or None,
        "label": location.get("label") or None,
    }

rows = []
for link in links:
    source = clean_location(link.get("source"), source_work_slug, source_release_slug)
    target = clean_location(link.get("target"))
    if not source["work_id"] or not target["work_id"]:
        print(f"Skipping crossbook link with unresolved work: {link.get('id')}", file=sys.stderr)
        continue
    rows.append({
        "manifest_id": link.get("id"),
        "rel": link.get("rel") or "references",
        "title": link.get("title") or None,
        "note": link.get("note") or None,
        "source_work_id": source["work_id"],
        "source_release_unit_id": source["release_unit_id"],
        "source_href": source["href"],
        "source_cfi": source["cfi"],
        "source_fragment": source["fragment"],
        "source_label": source["label"],
        "target_work_id": target["work_id"],
        "target_release_unit_id": target["release_unit_id"],
        "target_href": target["href"],
        "target_cfi": target["cfi"],
        "target_fragment": target["fragment"],
        "target_label": target["label"],
    })

if rows:
    request(
        "POST",
        "/rest/v1/crossbook_links?on_conflict=manifest_id",
        rows,
        prefer="resolution=merge-duplicates",
    )
    print(f"Upserted {len(rows)} crossbook link(s).")
PY
fi

echo "Published ${#artifacts[@]} artifact(s) for ${work_slug} at ${bucket}/${prefix}"
