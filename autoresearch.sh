#!/usr/bin/env bash
# Autoresearch benchmark entrypoint: medical/health website feel score.
# Deterministic: parses committed files only. No network, no time deps.
set -euo pipefail
cd "$(dirname "$0")"

TARGET="${AUTORESEARCH_TARGET:-platform.html}"

# Pick the first interpreter that can import PIL (needed for reference
# palette extraction); fall back to any python-ish interpreter.
pick_python() {
  local candidates=("python.exe" "python" "python3" "py.exe" "py")
  local fallback=()
  local c
  for c in "${candidates[@]}"; do
    command -v "$c" >/dev/null 2>&1 || continue
    if "$c" -c "import PIL" >/dev/null 2>&1; then
      printf '%s\n' "$c"
      return 0
    fi
    fallback+=("$c")
  done
  if [ "${#fallback[@]}" -gt 0 ]; then
    printf '%s\n' "${fallback[0]}"
    return 0
  fi
  return 1
}

PYC="$(pick_python)" || { echo "ERROR: no python interpreter found" >&2; exit 1; }

"$PYC" tools/medical_feel.py --target "$TARGET" --ref-dir ref
