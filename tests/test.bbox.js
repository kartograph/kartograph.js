/*
 * test for kartograph.BBox
 */
 
var kartograph = require('../kartograph.js').kartograph;
var $ = require('jQuery');

try {
	var bbox = new kartograph.BBox();
	bbox.update(10,10);
	bbox.update(50,10);
	bbox.update(30,30);
	
	if (bbox.left != 10 || bbox.top != 10 || bbox.bottom != 30 || bbox.width != 40 || bbox.height != 20) {
		throw "wrong dimensions"
	}
		
	bbox = kartograph.BBox.fromXML($('<bbox y="888.75" h="107.86" w="108.98" x="983.48" />')[0]);
	if (bbox.top != 888.75) {
		console.log(bbox);
		throw "import from xml failed"
	}

} catch (er) {
	console.error('[kartograph.BBox] test failed: '+er);
}