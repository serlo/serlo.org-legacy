#!/bin/sh

cd "$(dirname "$0")"
sh classmap_generator.sh
sh templatemap_generator.sh
