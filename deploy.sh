
cp -R . /var/www/html 2>/dev/null
cd /var/www/html/js || echo "Can't cd to /var" >&2

mv main.js main.c
gcc -E --no-warnings main.c | sed '/^#.*/d' > main.js

