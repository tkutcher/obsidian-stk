#!/usr/bin/env bash
set -e

# First argument or $OBSIDIAN_PLUGIN_DIR env var
TARGET_DIR="${1:-$OBSIDIAN_PLUGIN_DIR}"

if [ -z "$TARGET_DIR" ]; then
  echo "Usage: ./install.sh /path/to/obsidian/plugins/my-plugin"
  echo "   or set OBSIDIAN_PLUGIN_DIR environment variable."
  exit 1
fi

echo "Installing to: $TARGET_DIR"

mkdir -p "$TARGET_DIR"
cp -r dist/* "$TARGET_DIR"

echo "✅ Installed plugin to $TARGET_DIR"
