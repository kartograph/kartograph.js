/*
 * test for svgmap.BBox
 */
 
var svgmap = require('../svgmap.js').svgmap;

var bbox = new svgmap.BBox();
bbox.update(10,10);
bbox.update(50,10);
bbox.update(30,30);

if (bbox.left != 10 || bbox.top != 10 || bbox.bottom != 30 || bbox.width != 40 || bbox.height != 20)
	console.error('[svgmap.BBox] test failed');
