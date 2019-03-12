#!/bin/sh

DIR="$(dirname "$0")"

for D in "${DIR}/src/module/"*
do
    rm "${D}/autoload_classmap.php" 2>/dev/null
    rm "${D}/template_map.php" 2>/dev/null
done
