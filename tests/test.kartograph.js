/*
 * test for kartograph.kartograph
 */
 
var kartograph = exports.kartograph = require('../dist/kartograph.js').kartograph,
	$ = exports.$ = require('jQuery');
	
try {
//	var map = new kartograph.kartograph('cont');

	
} catch (er) {
	console.log('[kartograph.kartograph] test failed: '+er);
}
