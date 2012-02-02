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
cp kartograph.min.js kartograph-chroma.min.js
uglifyjs lib/chroma.js >> kartograph-chroma.min.js
uglifyjs lib/chroma.colors.js >> kartograph-chroma.min.js
echo "build complete"
node tests/*.js
mv kartograph*.js dist
