# Kartograph.js

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

