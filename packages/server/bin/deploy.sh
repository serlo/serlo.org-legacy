#!/bin/bash

# load nvm env vars
source ~/.profile

cd "$(dirname "$0")"

git status
git pull
git submodule update --init --recursive
sh templatemap_generator.sh
sh build.sh

pm2 stop index
pm2 delete index
cd ../src/athene2-editor-server
npm install
pm2 start src/index.js

cd ..

pm2 status

cd ..
php composer.phar update -o --no-dev

rm src/data/twig src/data/zfc* src/data/*.php src/data/*.cache -Rf
rm src/data/*.php -Rf
php src/public/index.php pagespeed build
