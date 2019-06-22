#!/bin/bash

DIR="$(dirname "$0")"

for D in "${DIR}/../src/module/"*
do
    if [ -d "${D}/view" ]; then
        php "${DIR}/../src/vendor/zendframework/zendframework/bin/templatemap_generator.php" -l "${D}" -v "${D}/view" -o "${D}/template_map.php" -w
    fi
    if [ -d "${D}/templates" ]; then
        php "${DIR}/../src/vendor/zendframework/zendframework/bin/templatemap_generator.php" -l "${D}" -v "${D}/templates" -o "${D}/template_map.php" -w
    fi
done
