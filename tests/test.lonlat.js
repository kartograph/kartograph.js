/*
 * test for svgmap.LonLat
 */
 
var svgmap = require('../svgmap.js').svgmap;

var ll = new svgmap.LonLat(12, 34);
if (ll.lon != 12 || ll.lat != 34)
	console.error('[svgmap.LonLat] test failed');

ll = new svgmap.LatLon(34, 12);
if (ll.lon != 12 || ll.lat != 34)
	console.error('[svgmap.LatLon] test failed');
