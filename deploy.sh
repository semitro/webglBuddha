#!/usr/bin/env bash
# This script make using macro include is possible in js
# First,  it moves all the files into apache server
# Second, it preprocesses several js files

cp -R . /var/www/html 2>/dev/null
cd /var/www/html/js || echo "Can't cd to /var" >&2

# use C preprocessor on js files to use include macro in them
preprocess() {
  filename="$1"
  mv "$filename.js" "$filename.c"
  gcc -E --no-warnings "$filename.c" | sed '/^#.*/d' > "$filename.js"
  rm "$filename.c"
}

preprocess model
preprocess render
preprocess main

echo "$0 done"
