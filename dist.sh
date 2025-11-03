#!/bin/sh

# Create dist directory if it doesn't exist
mkdir -p dist

# Clean existing contents
rm -rf dist/*

# Copy required files
cp manifest.json dist/
cp main.js dist/
[ -f styles.css ] && cp styles.css dist/
[ -f data.json ] && cp data.json dist/
