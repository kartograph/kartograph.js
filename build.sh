#!/bin/sh

# 
# builds all coffee script sources
# to one single minified js file
#
coffee -o build/ src/*.coffee
cat build/*.js | uglifyjs > svgmap.js
node tests/*.js
