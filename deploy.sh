#!/usr/bin/env bash

cp -R . /var/www/html 2>/dev/null
cd /var/www/html/js || echo "Can't cd to /var" >&2

preprocess() {
  filename="$1"
  mv "$filename.js" "$filename.c"
  gcc -E --no-warnings main.c | sed '/^#.*/d' > "$filename.js"

}

