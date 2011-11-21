/*
 * test for svgmap projections
 */
 
var svgmap = exports.svgmap = require('../svgmap.js').svgmap;


for (var p in svgmap.proj) {
	try {
	
		var proj = new svgmap.proj[p](10, 40);
		var xy = proj.project(0,20);
		if (isNaN(xy[0]) || isNaN(xy[1])) {
			throw "projection is NaN "+xy;	
		}
		var sea = proj.sea();
		if (sea == null || sea.length == 0) {
			throw "sea is null or empty"
		}
		var bbox = proj.world_bbox();
		if (bbox == null || isNaN(bbox.width)) {
			throw "bbox is null or empty"
		}

	} catch (er) {
		console.log('[svgmap.proj.'+p+'] test failed: '+er)
	}
}

