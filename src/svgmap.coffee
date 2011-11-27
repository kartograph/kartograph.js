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
	
	
	addLayer: (src_id, layer_id, path_id) ->
		# add new layer
		me = @
		layer_id ?= src_id

		me.layerIds ?= []
		me.layerIds.push(layer_id)
		
		layer = new MapLayer(layer_id, path_id, me.paper, me.viewBC)
		me.layers ?= {}
		me.layers[layer_id] = layer
		
		$paths = $('path', $('g#'+src_id, me.svgSrc)[0])		
		for svg_path in $paths				
			layer.addPath(svg_path)

		
		
	addLayerEvent: (layer_id, event, callback) ->
		me = @
		paths = me.layers[layer_id].paths
		for path in paths
			$(path.svgPath.node).bind(event, callback)
			
	
	addMarker: (marker) ->
		me = @
		me.markers.push(marker)
		xy = me.viewBC.project me.viewAB.project me.proj.project marker.lonlat.lon, marker.lonlat.lat
		marker.render(xy[0],xy[1],me.container, me.paper)
		
	
	choropleth: (opts) ->
		me = @	
		layer_id = opts.layer ? me.layerIds[me.layerIds.length-1]
		data = opts.data
		data_col = opts.prop
		no_data_color = opts.nodata ? '#ccc'
		colorscale = opts.colorscale ? svgmap.color.scale.COOL
		
		colorscale.parseData(data, data_col)
		pathData = {}
		for id, row of data
			pathData[id] = row[data_col]
			
		for id, paths of me.layers[layer_id].pathsById
			for path in paths
				if pathData[id]?
					v = pathData[id]
					col = colorscale.getColor(v)
					path.svgPath.node.setAttribute('style', 'fill:'+col)
				else
					path.svgPath.node.setAttribute('style', 'fill:'+no_data_color)

	
	tooltips: (opts) ->
		me = @
		tooltips = opts.content
		id_col = opts.id
		layer_id = opts.layer ? me.layerIds[me.layerIds.length-1]
		
		for id, paths of me.layers[layer_id].pathsById
			for path in paths			
				if $.isFunction tooltips
					tt = tooltips(id, path)
				else
					tt = tooltips[id]
					
				if tt?
					cfg = {
						position: { 
							target: 'mouse', 
							viewport: $(window), 
							adjust: { x:7, y:7}
						},
						show: { 
							delay: 20 
						},
						content: {}
					};
					
					if typeof(tt) == "string"
						cfg.content.text = tt
					else if $.isArray tt
						cfg.content.title = tt[0]
						cfg.content.text = tt[1]
					
					$(path.svgPath.node).qtip(cfg);
		
	###
		for some reasons, this runs horribly slow in Firefox
		will use pre-calculated graticules instead

	addGraticule: (lon_step=15, lat_step) ->
		
		self = @
		lat_step ?= lon_step
		globe = self.proj
		v0 = self.viewAB
		v1 = self.viewBC
		viewbox = v1.asBBox()
		
		grat_lines = []
		
		for lat in [0..90] by lat_step
			lats = if lat == 0 then [0] else [lat, -lat]
			for lat_ in lats
				if lat_ < globe.minLat or lat_ > globe.maxLat
					continue
				pts = []
				lines = []
				for lon in [-180..180]
					console.log lat_,lon
					if globe._visible(lon, lat_)
						xy = v1.project(v0.project(globe.project(lon, lat_)))
						pts.push xy
					else
						if pts.length > 1
							line = new svgmap.geom.Line(pts)
							pts = []
							lines = lines.concat(line.clipToBBox(viewbox))
				
				if pts.length > 1
					line = new svgmap.geom.Line(pts)
					pts = []
					lines = lines.concat(line.clipToBBox(viewbox))
					
				for line in lines
					path = self.paper.path(line.toSVG())
					path.setAttribute('class', 'graticule latitude lat_'+Math.abs(lat_)+(if lat_ < 0 then 'W' else 'E'))
					grat_lines.push(path)		
					
	###
	
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
	
	
	onPathEvent: (evt) ->
		###
		forwards path events to their callbacks, but attaches the path to
		the event object
		###
		me = @
		path = evt.target.path
		me.layerEventCallbacks[path.layer][evt.type](path)
	
	
		
svgmap.SVGMap = SVGMap


class MapLayer
	
	constructor: (layer_id, path_id, paper, view)->
		me = @
		me.id = layer_id
		me.path_id = path_id
		me.paper = paper
		me.view = view
		
	addPath: (svg_path) ->
		me = @
		me.paths ?= []
		
		layerPath = new MapLayerPath(svg_path, me.id, me.paper, me.view)
		
		me.paths.push(layerPath)
		
		if me.path_id?
			me.pathsById ?= {}
			me.pathsById[layerPath.data[me.path_id]] ?= []
			me.pathsById[layerPath.data[me.path_id]].push(layerPath)
	
	
class MapLayerPath

	constructor: (svg_path, layer_id, paper, view) ->
		me = @
		path_str = svg_path.getAttribute('d')
		me.path = path = svgmap.geom.Path.fromSVG(path_str)
		
		me.svgPath = paper.path(view.projectPath(path).toSVG())
		me.svgPath.node.setAttribute('class', 'polygon '+layer_id)
		me.svgPath.node.path = me # store reference to this path
		
		data = {}
		for i in [0..svg_path.attributes.length-1]
			attr = svg_path.attributes[i]
			if attr.name.substr(0,5) == "data-"
				data[attr.name.substr(5)] = attr.value
		me.data = data
