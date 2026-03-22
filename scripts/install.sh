#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-.}"
mkdir -p "$TARGET_DIR"
cp "$(dirname "$0")/../src/index.ts" "$TARGET_DIR/cliptype.ts"
echo "Installed cliptype to $TARGET_DIR/cliptype.ts"
