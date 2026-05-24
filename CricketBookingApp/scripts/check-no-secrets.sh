#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PATTERN='AIza[0-9A-Za-z_-]{20,}|[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com|com\.googleusercontent\.apps\.[0-9]+-[a-z0-9]+'

is_allowed() {
  case "$1" in
    *.example|*firebase.example.ts|*check-no-secrets.sh|*SECRETS.md|*sync-ios-url-scheme.js)
      return 0
      ;;
  esac
  return 1
}

if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || true)
  if [ -z "$FILES" ]; then
    echo "No staged files — secret scan skipped."
    exit 0
  fi

  FOUND=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    is_allowed "$file" && continue
    if [ -f "$file" ] && grep -qE "$PATTERN" "$file" 2>/dev/null; then
      echo "ERROR: Possible secret in staged file: $file"
      grep -nE "$PATTERN" "$file" || true
      FOUND=1
    fi
  done <<< "$FILES"

  if [ "$FOUND" -eq 1 ]; then
    echo ""
    echo "Remove secrets before commit. See SECRETS.md"
    exit 1
  fi

  echo "Secret scan passed (staged changes)."
  exit 0
fi

echo "Secret scan passed."
