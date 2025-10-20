#!/bin/bash

VERSION=$(jq -r '.version' manifest.json)
DIST=dist/obsidian-stk-"$VERSION"

mkdir -p "$DIST"
npm run build
cp LICENSE main.js manifest.json package.json package-lock.json README.md styles.css versions.json \
	"$DIST/"
