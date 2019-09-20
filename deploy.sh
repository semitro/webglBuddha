
cp -R . /var/www/html
cd /var/www/html/js || echo "Can't cd to /var" >&2

mv main.js main.c
gcc -E --no-warnings main.c | sed '/^#.*/d' > main.js
cat main.js
