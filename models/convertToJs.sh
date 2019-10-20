#!/bin/bash

model="$1"
if [ ! -e "$1" ]; then echo "file $1 doesn't exist!"; exit; fi
#transform vertexes into array (they start with 'v' and represent position in space)
cat $model | grep '^v ' | sed 's###g' | sed 's#v\ *##' | sed 's#\ #\,\ #g' | sed 's#$#,#' > "$1.vertexes_array"
#transform normals into array (they start with 'vn')
cat $model | grep '^vn ' | sed 's###g' | sed 's#vn\ *##' | sed 's#\ #\,\ #g' | sed 's#$#,#' > "$1.normals_array"
#transform textures (start with 'vt': u, v which are float in [-1..1]
cat $model | grep '^vt ' | sed 's###g' | sed 's#vt\ *##' | sed 's#\ #\,\ #g' | sed 's#$#,#' > "$1.vtextures_array"

#transform vertexes indices into array (start wth f and have format vertex1/text_coord1/normal1 vertex2/text_coord2/normal2 vertex3/text_coord3/normal3)
cat $model | grep '^f ' | sed 's###g' | sed 's#\ *$##'| sed 's#f\ ##' | sed 's#\/[0-9]*##g'  |perl -pe 's/(\d+)/$1-1/ge' |
sed 's#\ #\,\ #g' | sed 's#$#,#' > "$1.indices_vertexes_array"

#transform normals indices into array (start wth f and have format vertex1/text_coord1/normal1 vertex2/text_coord2/normal2 vertex3/text_coord3/normal3)
cat $model | grep '^f ' | sed 's###g' | sed 's#\ *$##'| sed 's#f##' | sed 's#[0-9]*\/##g' | sed 's#[0-9]*\/##g' | perl -pe 's/(\d+)/$1-1/ge' |
sed 's#^\ *##' | sed 's#\ #\,\ #g' | sed 's#$#,#' > "$1.indices_normals_array"

#transform texture indices into array (start wth f and have format vertex1/text_coord1/normal1 vertex2/text_coord2/normal2 vertex3/text_coord3/normal3)
cat $model | grep '^f ' | sed 's###g' | sed 's#\ *$##'| sed 's#f##' | sed 's# [0-9]*\/# #g' | sed 's#\/[0-9]*##g' | perl -pe 's/(\d+)/$1-1/ge' |
sed 's#^\ *##' | sed 's#\ #\,\ #g' | sed 's#$#,#' > "$1.indices_vtextures_array"
