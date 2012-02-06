/*
 * test for kartograph.View
 */
 
var kartograph = require('../dist/kartograph.js').kartograph;
var $ = require('jQuery');

try {
	var bbox = new kartograph.BBox(0,0,600,400);
	var view = new kartograph.View(bbox, 400, 200);
	
	view = kartograph.View.fromXML($('<view padding="20.0" h="990.747434199" w="1000"><proj lon0="-2.77033344746" id="laea" lat0="42.1716125761" /><bbox y="888.75" h="107.86" w="108.98" x="983.48" /></view>')[0]);
	if (view.height != 990.747434199) {
		console.log(view);
		throw "import from xml failed"
	}
	
} catch (er) {
	console.error('[kartograph.View] test failed: '+er);
}