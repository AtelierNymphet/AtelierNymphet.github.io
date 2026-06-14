#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

repos=(
  Absinthe
  Brulee
  Camille
  CancelCult
  DiaryOfAStalker
  DiaryOfAYoungGirl
  Isibella
  IsibellaPuddleduck
  Juliette
  Lola
  Mircalla
  PetitMadeleine
  Playbill
  ReturnToTheChateau
  TheMysteryOfTheChateau
  TheOpera
  TheOriginalOfLaura
  Theatre
  ToddVampire
  TwentyDollarWords
  WeeChristopher
  WriteInRain-DeVisionQuest
  WriteInRain-ReVisionQuest
)

slug_for_repo() {
  case "$1" in
    DiaryOfAStalker) echo "diary-of-a-stalker" ;;
    DiaryOfAYoungGirl) echo "diary-of-a-young-girl" ;;
    IsibellaPuddleduck) echo "isibella-puddleduck" ;;
    PetitMadeleine) echo "petit-madeleine" ;;
    ReturnToTheChateau) echo "return-to-the-chateau" ;;
    TheMysteryOfTheChateau) echo "the-mystery-of-the-chateau" ;;
    TheOpera) echo "the-opera" ;;
    TheOriginalOfLaura) echo "the-original-of-laura" ;;
    ToddVampire) echo "todd-vampire" ;;
    TwentyDollarWords) echo "twenty-dollar-words" ;;
    WeeChristopher) echo "wee-christopher" ;;
    WriteInRain-DeVisionQuest) echo "de-vision-quest" ;;
    WriteInRain-ReVisionQuest) echo "re-vision-quest" ;;
    *) echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]' ;;
  esac
}

title_for_repo() {
  case "$1" in
    DiaryOfAStalker) echo "Diary of a Stalker" ;;
    DiaryOfAYoungGirl) echo "Diary of a Young Girl" ;;
    IsibellaPuddleduck) echo "Isibella Puddleduck" ;;
    PetitMadeleine) echo "Petit Madeleine" ;;
    ReturnToTheChateau) echo "Return to the Chateau" ;;
    TheMysteryOfTheChateau) echo "The Mystery of The Chateau" ;;
    TheOpera) echo "The Opera" ;;
    TheOriginalOfLaura) echo "Vol 0 - The Original of Laura" ;;
    ToddVampire) echo "Todd Vampire" ;;
    TwentyDollarWords) echo "Twenty Dollar Words" ;;
    WeeChristopher) echo "Wee Christopher" ;;
    WriteInRain-DeVisionQuest) echo "De/Vision Quest" ;;
    WriteInRain-ReVisionQuest) echo "Re/Vision Quest" ;;
    *) echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1 \2/g' ;;
  esac
}

for repo in "${repos[@]}"; do
  repo_dir="$root/$repo"
  [[ -d "$repo_dir/.git" ]] || {
    echo "Skipping $repo: no git repository"
    continue
  }

  mkdir -p "$repo_dir/.atelier" "$repo_dir/.github/workflows"
  cp "$root/scripts/templates/publish_to_supabase.sh" "$repo_dir/.atelier/publish_to_supabase.sh"
  cp "$root/scripts/templates/publish-supabase.yml" "$repo_dir/.github/workflows/publish-supabase.yml"
  if [[ ! -f "$repo_dir/.atelier/crossbook-links.json" ]]; then
    cp "$root/scripts/templates/crossbook-links.json" "$repo_dir/.atelier/crossbook-links.json"
  fi
  chmod +x "$repo_dir/.atelier/publish_to_supabase.sh"

  slug="$(slug_for_repo "$repo")"
  title="$(title_for_repo "$repo")"
  python3 - "$repo_dir/.atelier/publish-manifest.json" "$slug" "$title" "$repo" <<'PY'
import json, sys
path, slug, title, repo = sys.argv[1:]
manifest = {
    "work_slug": slug,
    "title": title,
    "repo_name": repo,
    "artifact_globs": [
        "dist/**",
        "releases/**"
    ]
}
with open(path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)
    f.write("\n")
PY
done

echo "Configured ${#repos[@]} book repositories for Supabase publishing."
