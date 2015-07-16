# Kartograph.js

This project is not maintained anymore. The original author decided to move on with his life. 

Here are a few reasons why I stopped working on kartograph.js:

* there's no need to support non-SVG browsers anymore, so if I would touch kartograph.js again I would through out the Raphael.js dependency, which would result in a complete re-write which I don't want to spend my time on, because...
* D3.js is an amazing library that can do all the vector mapping that you need! Also d3.js has much more map projections and is more fun to work with.
* Finally, TopoJSON beats SVG as vector geo data format.

So, thanks for the good time we had!

Of course, if you still want to take over from here, kartograph.js is all yours. Just send me an email.



-------------

Kartograph.js is a JavaScript library that renders [SVG maps](https://github.com/kartograph/kartograph.py/) in web browsers. It is built on top of [jQuery](http://jquery.com) and [RaphaelJS](http://raphaeljs.com). Please have a look at the [API docs](https://github.com/kartograph/kartograph.js/wiki/API) for more details. 

Initializing a new map

````javascript
map = $K.map('#map', 600, 400);
map.loadMap('world.svg', function() {
	map.addLayer('countries', {
		styles: {
			fill: '#ee9900'
		},
		title: function(d) {
			return d.countryName;
		}
	});
});
```

Choropleth maps (aka coloring map polygons based on data):

```javascript
pop_density = { 'USA': 123455, 'CAN': 232323, ... };

colorscale = new chroma.ColorScale({
	colors: chroma.brewer.YlOrRd,
	limits: chroma.limits(chroma.analyze(pop_density), 'k-means', 9)
});

map.getLayer('countries').style('fill', function(data) {
	return colorscale.get(pop_density[data.iso]);
});
```

Adding symbols is easy, too:

```javascript
cities = [{ lat: 43, lon: -75, label: 'New York', population: 19465197 }];

map.addSymbols({
	data: cities,
	location: function(d) {
		return [d.lon, d.lat];
	},
	type: Kartograph.Bubble,
	radius: function(d) {
		return Math.sqrt(d.population) * 0.001;
	}
})
```

### Author

Kartograph was created by [Gregor Aisch](http://github.com/gka/). It is supported by [Piwik Web Analytics](http://piwik.org) and the [Open Knowledge Foundation](http://okfn.org).

### License

Kartograph.js is licensed under [LGPL](http://www.gnu.org/licenses/lgpl-3.0.txt)

