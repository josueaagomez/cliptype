#!/usr/bin/env bash
set -euo pipefail

RAW_URL="https://raw.githubusercontent.com/josueaagomez/cliptype/main/src/index.ts"
TARGET_PATH="${1:-./src/lib/cliptype.ts}"

mkdir -p "$(dirname "$TARGET_PATH")"
curl -fsSL "$RAW_URL" -o "$TARGET_PATH"

echo "Installed cliptype to $TARGET_PATH"
