#!/usr/bin/env bash

set -euo pipefail

DEST="../vicinae-extensions/extensions/timer"

mkdir -p "$DEST"
cp -r assets src package.json package-lock.json README.md tsconfig.json LICENSE "$DEST/"

echo "Copied publishing files to $DEST"
