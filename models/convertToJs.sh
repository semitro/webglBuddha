#!/bin/bash

model="$1"
if [ ! -e "$1" ]; then echo "file $1 doesn't exist!"; exit; fi
#transform vertexes into array
cat $model | grep '^v ' | sed 's###g' | sed 's#v\ *##' | sed 's#\ #\,\ #g' | sed 's#$#,#' > "$1.vertexes_array"

#transform indices into array

cat $model | grep '^f ' | sed 's###g' | sed 's#\ *$##'|sed 's#f\ ##' | sed 's#\/[0-9]*##g'  |perl -pe 's/(\d+)/$1-1/ge' |
sed 's#\ #\,\ #g' | sed 's#$#,#' > "$1.indices_array"


