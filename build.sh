#!/bin/sh

# 
# builds all coffee script sources
# to one single minified js file
#
coffee -o build/ src/*.coffee
cat src/*.coffee | coffee -sp > tmp
cat src/license tmp > svgmap.js
rm tmp
uglifyjs svgmap.js > svgmap.min.js
cat lib/chroma.js >> svgmap.js
cat lib/chroma.js >> svgmap.min.js
echo "build complete"
node tests/*.js
