set shell := ["zsh", "-cu"]

default: help

help:
  @cat docs/justfile.txt

install:
  npm install

build:
  npm run build

test:
  npm run test

lint:
  npm run lint

format:
  npm run format

typecheck:
  npm run typecheck
