/*
 * test for kartograph.LonLat
 */
 
var kartograph = require('../dist/kartograph.js').kartograph;

var ll = new kartograph.LonLat(12, 34);
if (ll.lon != 12 || ll.lat != 34)
	console.error('[kartograph.LonLat] test failed');

ll = new kartograph.LatLon(34, 12);
if (ll.lon != 12 || ll.lat != 34)
	console.error('[kartograph.LatLon] test failed');
