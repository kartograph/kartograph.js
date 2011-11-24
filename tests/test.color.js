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
	
	
} catch (er) {
	console.log('[svgmap.color] test failed: '+er);
	console.log(er.stack);
}
