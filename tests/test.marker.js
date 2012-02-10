/*
 * test for kartograph projections
 */
 
var kartograph = exports.kartograph = require('../dist/kartograph.js');

try {
	//var ll = new kartograph.LonLat(10.1, 52.0);
	//var mark = new kartograph.marker.MapMarker(ll, 'hello world');	
} catch (er) {
	console.log('[kartograph.Marker] test failed: '+er)
}

