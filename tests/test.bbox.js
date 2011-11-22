/*
 * test for svgmap.BBox
 */
 
var svgmap = require('../svgmap.js').svgmap;
var $ = require('jQuery');

try {
	var bbox = new svgmap.BBox();
	bbox.update(10,10);
	bbox.update(50,10);
	bbox.update(30,30);
	
	if (bbox.left != 10 || bbox.top != 10 || bbox.bottom != 30 || bbox.width != 40 || bbox.height != 20) {
		throw "wrong dimensions"
	}
		
	bbox = svgmap.BBox.fromXML($('<bbox y="888.75" h="107.86" w="108.98" x="983.48" />')[0]);
	if (bbox.top != 888.75) {
		console.log(bbox);
		throw "import from xml failed"
	}

} catch (er) {
	console.error('[svgmap.BBox] test failed: '+er);
}