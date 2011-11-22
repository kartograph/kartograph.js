/*
 * test for svgmap projections
 */
 
var svgmap = exports.svgmap = require('../svgmap.js').svgmap;

try {
	var ll = new svgmap.LonLat(10.1, 52.0);
	var mark = new svgmap.marker.MapMarker(ll, 'hello world');	
} catch (er) {
	console.log('[svgmap.Marker] test failed: '+er)
}

