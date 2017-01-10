echo "> Start transpiling ES2015 & React"
echo ""
./node_modules/.bin/babel src --ignore __tests__ --out-dir ./dist
echo ""
echo "> Complete transpiling ES2015 & React"
