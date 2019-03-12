#!/bin/sh

initAthene() {
    cd "/vagrant/src/assets"

    npm install
    bower --config.analytics=false install
    grunt build
}

startEditor() {
    pm2 start /vagrant/src/assets/athene2-editor/server/server.js --node-args="--expose_gc --gc_global"
}

initEditor() {
    cd "/vagrant/src/assets/athene2-editor"

    npm install
    bower --config.analytics=false install
    grunt build
    startEditor
}
