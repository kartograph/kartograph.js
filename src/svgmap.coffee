###
    svgmap - a simple toolset that helps creating interactive thematic maps
    Copyright (C) 2011  Gregor Aisch

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
###

root = (exports ? this)	
svgmap = root.svgmap ?= {}
svgmap.version = "0.1.0"


###
Usage:

svgmap = new SVGMap(container);

// load a new map, will reset everything, so you need to setup the layers again

svgmap.loadMap('map.svg', function(layers) {
	svgmap.addLayer('sea');
	svgmap.addLayer('countries','country_bg');
	svgmap.addLayer('graticule');
	svgmap.addLayer('countries');
});

// setup layers

// load data

###

class SVGMap

	constructor: (container) ->
		#
		me = @
		me.container = $(container)
		me.layers = []
	
	loadMap: (url, callback) ->
		# load svg map
		me = @
		me.mapLoadCallback = callback
		$.ajax 
			src: url
			onSuccess: me.mapLoaded
	
	addLayer: (id, new_id) ->
		# add new layer
		new_id ?= id

		layer = 
			id: new_id
			src: id
			paths: p
			
		@.layers.push layer
	
	addMarker: (marker) ->
		#
		
	display: () ->
		###
		finally displays the svgmap, needs to be called after
		layer and marker setup is finished
		###
		
	
	###
	end of public API
	###
	
	mapLoaded: (response) ->
		# reconstruct projection
		# read layers
	
	render: ->
		# render all layer
		
	project: (lon, lat) ->
		# 
		
###
Marker concept:
- markers have to be registered in SVGMap instance
- markers render their own content (output html code)
- SVGMap will position marker div over map
- marker will handle events
###


class MapMarker
	constructor: (lonlat, content, offset = [0,0]) ->
		###
		lonlat - array [lon,lat]
		content - html code that will be placed inside a <div class="marker"> which then will be positioned at the corresponding map position
		offset - x and y offset for the marker
		###


class LabelMarker extends MapMarker
	###
	a simple label
	###
	constructor: (lonlat, label) ->
	

class IconMarker extends MapMarker
	###
	
	###
	constructor: (lonlat, icon) ->


class Balloon
	###
	opens a 'singleton' Balloon at a defined geo-location
	balloons may contain arbitrary html content
	balloons are 100% css-styled 
	###
	
	
