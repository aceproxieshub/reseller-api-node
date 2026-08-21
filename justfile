set shell := ["zsh", "-cu"]

default: help

help:
  @cat docs/justfile.txt

install:
  npm install

build:
  node --eval "require('node:fs').rmSync('dist', { recursive: true, force: true })"
  npx tsc -p tsconfig.build.json

test:
  npx vitest run --coverage

mutation:
  npm run test:mutation

lint:
  npx eslint .

format:
  npx prettier --write .

format-check:
  npx prettier --check .

typecheck:
  npx tsc -p tsconfig.json --noEmit
