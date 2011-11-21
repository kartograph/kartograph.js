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
		me.markers = []
	
	
	loadMap: (mapurl, callback) ->
		# load svg map
		me = @
		me.mapLoadCallback = callback
		console.log 'loadMap',mapurl
		$.ajax 
			url: mapurl
			success: me.mapLoaded
			context: me
		return
	
	
	addLayer: (id, new_id) ->
		# add new layer
		new_id ?= id

		layer = 
			id: new_id
			src: id
			paths: p
			
		@.layers.push layer
	
	
	addMarker: (marker) ->
		me = @
		me.markers.push(marker)
		
		
	display: () ->
		###
		finally displays the svgmap, needs to be called after
		layer and marker setup is finished
		###
		@render()
	
	### 
	end of public API
	### 
	
	mapLoaded: (response) ->
		me = @
		me.svgSrc = response
		console.log response
		me.proj = svgmap.Proj.fromXML $('proj', response)[0]
		# reconstruct projection
		
		# read layers
		
		me.mapLoadCallback()
	
	render: ->
		# render all layer
		
	project: (lon, lat) ->
		# 
		

svgmap.SVGMap = SVGMap
