#!/bin/bash
yarn --frozen-lockfile --production=false --silent
npx nodemon --legacy-watch --watch yarn.lock --exec "yarn --frozen-lockfile --production=false --silent" &
npx lerna run --parallel start
