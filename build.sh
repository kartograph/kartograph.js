#!/bin/sh

# 
# builds all coffee script sources
# to one single minified js file
#
coffee -o build/ src/*.coffee
cat build/*.js > svgmap.js
uglifyjs svgmap.js > svgmap.min.js
node tests/*.js
