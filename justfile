set shell := ["zsh", "-cu"]

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
