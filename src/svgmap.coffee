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
		me.container = cnt = $(container)
		me.viewport = vp = new svgmap.BBox 0,0,cnt.width(),cnt.height()
		me.paper = Raphael(cnt[0], vp.width, vp.height)
		me.layers = []
		me.markers = []
	
	
	loadMap: (mapurl, callback) ->
		# load svg map
		me = @
		me.mapLoadCallback = callback
		$.ajax 
			url: mapurl
			success: me.mapLoaded
			context: me
		return
	
	
	addLayer: (src_id, new_id) ->
		# add new layer
		me = @
		new_id ?= src_id

		me.layerPaths ?= {}
		me.layerPaths[new_id] = []

		svg = me.svgSrc
		$layer = $('g#'+src_id, svg)[0]
		$paths = $('path', $layer)

		for svg_path in $paths	
			layerPath = {}			
		
			# extract and convert path
			path_str = svg_path.getAttribute('d')
			path = svgmap.Path.fromSVG(path_str)
			layerPath.path = path
			
			layerPath.svgPath = me.paper.path(me.viewBC.projectPath(path).toSVG())
			layerPath.svgPath.node.setAttribute('class', 'polygon '+new_id)
			
			data = {}
			for i in [0..svg_path.attributes.length-1]
				attr = svg_path.attributes[i]
				if attr.name.substr(0,5) == "data-"
					data[attr.name.substr(5)] = attr.value
			layerPath.data = data
			
			me.layerPaths[new_id].push(layerPath)			

		layer = 
			id: new_id
			src: src_id
			#paths: p
			
		me.layers.push layer
	
	addMarker: (marker) ->
		me = @
		me.markers.push(marker)
		xy = me.viewBC.project me.viewAB.project me.proj.project marker.lonlat.lon, marker.lonlat.lat
		marker.render(xy[0],xy[1],me.container, me.paper)
		
	
	choropleth: (layer_id, data, id_col, data_col) ->
		me = @
		min = Number.MAX_VALUE
		max = Number.MAX_VALUE*-1
		pathData = {}
		for d in data
			pathData[d[id_col]] = d[data_col]
			if isNaN(d[data_col]) then continue
			min = Math.min(min, d[data_col])
			max = Math.max(max, d[data_col])
			
		paths = me.layerPaths[layer_id]
		for path in paths
			id = path.data[id_col]
			if pathData[id]?
				v = pathData[id]
				col = 'HSL(60,50%,'+(10+Math.round((1-v/max)*10)*(90/10))+'%)'
				path.svgPath.node.setAttribute('style', 'fill:'+col)
			else
				path.svgPath.node.setAttribute('style', 'fill:#ccc')
	
	
	#addGraticule: (step=15) ->
		# foo
		
	#addLayerPath: (layer_id, out_class, pathQuery) ->
	#	paths = me.layerPaths[layer_id]
	#	for path in paths
	#		# foo
	
	display: () ->
		###
		finally displays the svgmap, needs to be called after
		layer and marker setup is finished
		###
		@render()
	
	### 
	    end of public API
	###
	
	mapLoaded: (xml) ->
		me = @
		me.svgSrc = xml
		vp = me.viewport
		$view = $('view', xml)[0] # use first view
		me.viewAB = AB = svgmap.View.fromXML $view
		me.viewBC = new svgmap.View AB.asBBox(),vp.width,vp.height
		me.proj = svgmap.Proj.fromXML $('proj', $view)[0]		
		me.mapLoadCallback()
	
	loadCoastline: ->
		me = @
		$.ajax
			url: 'coastline.json'
			success: me.renderCoastline
			context: me
	
	renderCoastline: (coastlines) ->
		me = @
		P = me.proj
		vp = me.viewport
		view0 = me.viewAB
		view1 = me.viewBC

		for line in coastlines
			pathstr = ''
			for i in [0..line.length-2]
				p0 = line[i]
				p1 = line[i+1]
				d = 0
				# console.log(P._visible(-2.77, 42.1))
				if true and P._visible(p0[0],p0[1]) and P._visible(p1[0],p1[1])					
					p0 = view1.project(view0.project(P.project(p0[0],p0[1])))
					p1 = view1.project(view0.project(P.project(p1[0],p1[1])))
					if vp.inside(p0[0],p0[1]) or vp.inside(p1[0],p1[1])
						pathstr += 'M'+p0[0]+','+p0[1]+'L'+p1[0]+','+p1[1]	
			if pathstr != ""
				me.paper.path(pathstr).attr('opacity',.8)
		
		# for debugging purposes
	
	
	
	render: ->
		# render all layer
		
	project: (lon, lat) ->
		# 
		

svgmap.SVGMap = SVGMap


