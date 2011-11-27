/*
 * test for svgmap.color.Color
 */
 
var svgmap = exports.svgmap = require('../svgmap.js').svgmap;
	
function assert(chk, msg) {
	if (chk === false) throw msg
};
	
try {
	
	var Color_ = svgmap.color.Color;
	new Color_();
	
	var col = new Color_('#ff0000');
	
	assert(Color_.rgb2hex(240,20,20) == "#F01414", "rgb2hex failure");
	assert(Color_.rgb2hex([240,20,20]) == "#F01414", "rgb2hex failure #2");
	var hsl = Color_.rgb2hsl(255,0,0);
	assert(hsl[0]==0 && hsl[1]==1 && hsl[2]==0.5, "rgb2hsl failure "+hsl);
	var rgb = Color_.hsl2rgb(0,1,0);
	
	assert(rgb[0]==0 && rgb[1]==0 && rgb[2]==0, "hsl2rgb failure "+rgb);
	
	
	// now test color classes
	var s = new svgmap.color.scale.Ramp();
	s.setClasses();
	s.parseData([1000,8000,1200,1002,1004,1006,1400,1800,2500,2223])
	s.classifyValue(1110);
	
	s = new svgmap.color.scale.Ramp();
	s.setClasses(5, 'quantiles');
	s.parseData([1000,8000,1200,1002,1004,1006,1400,1800,2500,2223])

} catch (er) {
	console.log('[svgmap.color] test failed: '+er);
	console.log(er.stack);
}
