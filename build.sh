#!/bin/sh

# 
# builds all coffee script sources
# to one single minified js file
#
cat src/core/*.coffee | coffee -sp > tmp
cat src/modules/*.coffee | coffee -sp >> tmp
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
cp dist/kartograph.* ~/Incubator/libraries/kartograph/website/js/
