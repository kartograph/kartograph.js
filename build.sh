#!/bin/sh

# 
# builds all coffee script sources
# to one single minified js file
#
coffee -o build/ src/*.coffee
cat src/*.coffee | coffee -sp > tmp
cat src/license tmp > kartograph.js
rm tmp
uglifyjs kartograph.js > kartograph.min.js
cat lib/chroma.js >> kartograph.js
cat lib/chroma.js >> kartograph.min.js
echo "build complete"
node tests/*.js
