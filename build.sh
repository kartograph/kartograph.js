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
mv kartograph*.js dist
echo "build complete"

cp dist/kartograph.* ~/Incubator/maps/unrefugee/his.locsis.com/js
cp dist/kartograph.* ~/Incubator/maps/kenya/demo/js/lib
cp dist/kartograph.* ~/Incubator/okfn/_yourtopia/italymap/   
