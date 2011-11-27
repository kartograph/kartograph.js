# svgmap.js API


### loadMap(svgurl, callback)
Loads a SVG map file created with svgmap.py.

* **svgurl** - SVG map url, must be on same server
* **callback** - will be called after the svg is loaded

Example:

	var map = new svgmap.SVGMap("#map");
	map.loadMap('world.svg', function(map) {
		// this is where you would do something with your map
		// like adding layers, etc
	});


### addLayer(src, layerId, pathId) 
SVG maps may contain several layers, but sometimes you don't need to display them all. In some cases it even makes sense to add the same layer more than once. 

* **src** - this is how the map layer is named in the SVG file, for instance: <g id="countries">...</g>
* **layerId** - this is how you want the layer to be named in the map application. every path in this layer will get this as a CSS class name
* **pathId** - if you want to add interactivity to the paths of this layer, you need to specify how to identify them. For instance, if your paths store attributes <path data-iso3="USA".. />, you want pathId to be "iso3".

Examples:
	
	map.addLayer('countries','background')	
	map.addLayer('graticule')
	map.addLayer('countries','countries','iso3')

### addLayerEvent(event, callback, layerId)
* **event** - any valid jQuery event type, like "click" or "mouseover"
* **callback** - the function that will be called when the event occurs
* **layerId**, the id of the layer the events shall be added to. defaults to the last added layer
	
			var onCountryClick = function(event) {
				var path = event.target;
				console.log(path.data['iso3']);		
			};
			map.addLayerEvent('click', onCountryClick, 'countries');

### choroplet(opts)
* **opts** - a dictionary of options, which are:
	* **layer** - the id of the layer the choropleth shall be applied to. defaults to the last added layer
	* **data** - the data dictionary, with path ids as keys and numbers or dictionaries of numbers as values. In the latter case, you need to provide a key, see next parameter.
			
			map.choroplet({
				data: { 
					'USA': 311484627, 
					'CAN': 34278406 
				}
			});

	* **key** - if the data dictionaries contains dictionaries of numbers, you need to specify the key. 
		
			map.choroplet({
				data: { 
					'USA': { 'population': 311484627, 'GDP': 14256 },
					'CAN': { 'population': 34278406, 'GDP': 1303 } 
				},
				key: 'GDP'
			});

	* **colorscale** - the colorscale, defaults to svgmap.color.scale.COOL

			map.choroplet({
				colorscale: new svgmap.color.scale.Ramp('#ffffff', '#883333')
			});

	* **noDataColor** - the color that should be used for paths that have no entry or NaN in the data dictionary. Defaults to '#cccccc'

### tooltips(opts)
Activate tooltips for a layer. The tooltips will be managed using the [http://craigsworks.com/projects/qtip2/docs/](jQuery.qtip plugin). If you want to add tooltips to your maps, you also need to include the tooltip.css to your HTML page.
* **opts** - a dictionary of options, which are:
	* **layer** - the id of the layer the choropleth shall be applied to. defaults to the last added layer
	* **tooltips** - either a dictionary with path ids as keys and tooltip HTML code as values or a function that returns the tooltip for a given path. The tooltip itself can be either a string or an array of two strings of which the first will be used as tooltip title and the second as tooltip body.

Examples:

	map.tooltips({
		tooltips: { 
			'USA': ['United States', 'GDP: $15.0 trilion'],				'CAN': ['Canada', 'GDP: $1.3 trilion'] 
		}
	}); 
	map.tooltips({
		tooltips: function(id, path) { 
			if (id == "USA") 
				return ['United States', 'GDP: $15.0 trilion'];
			if (id == "CAN")
				return ['Canada', 'GDP: $1.3 trilion'];
		}
	});

### addMarker(marker)
Add a marker to the map. 
Example: 
		
	var marker = new svgmap.marker.LabelMarker([-74.00597, 40.71427], 'New York City')
	map.addMarker(marker);
