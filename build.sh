#!/bin/sh
BUILD=tmp
VERSION=$(node -e "console.log(require('./package.json').version);")
OUT=dist/kartograph.js
OUTMIN=dist/kartograph.min.js
#
# builds all coffee script sources
# to one single minified js file
#
rm dist/kartograph*.js
cat src/core.coffee > $BUILD
cat src/core/*.coffee >> $BUILD
cat src/modules/*.coffee >> $BUILD
cat src/modules/symbols/*.coffee >> $BUILD
cat $BUILD | coffee -sp > $OUT
uglifyjs -cm -o $OUTMIN $OUT
rm $BUILD
echo "build complete"
