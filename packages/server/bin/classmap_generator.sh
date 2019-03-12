#!/bin/sh

DIR="$(dirname "$0")"

for D in "${DIR}/../src/module/"*
do
    php "${DIR}/../src/vendor/zendframework/zendframework/bin/classmap_generator.php" -l "${D}/src" -o "${D}/autoload_classmap.php" -w
done
