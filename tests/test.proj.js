/*
 * test for kartograph projections
 */
 
var kartograph = exports.kartograph = require('../dist/kartograph.js').kartograph;


for (var p in kartograph.proj) {
	try {
	
		var proj = new kartograph.proj[p]({ lon0: 10, lat0: 40 });
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
		console.log('[kartograph.proj.'+p+'] test failed: '+er)
	}
}

