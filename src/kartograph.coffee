###
    kartograph - a svg mapping library 
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
kartograph = root.K = root.kartograph ?= {}

kartograph.version = "0.4.3"


warn = (s) ->
	console.warn('kartograph ('+kartograph.version+'): '+s)

log = (s) ->
	console.log('kartograph ('+kartograph.version+'): '+s)


class Kartograph

	constructor: (container) ->
		#
		me = @
		me.container = cnt = $(container)
		me.viewport = new kartograph.BBox 0,0,cnt.width(),cnt.height()
		me.paper = me.createSVGLayer()
		me.markers = []
		me.container.addClass 'kartograph'
		
	createSVGLayer: (id) ->
		me = @
		me._layerCnt ?= 0
		lid = me._layerCnt++
		vp = me.viewport
		cnt = me.container
		paper = Raphael cnt[0],vp.width,vp.height
		svg = $ paper.canvas
		svg.css
			position: 'absolute'
			top: '0px'
			left: '0px'
			'z-index': lid+5

		if cnt.css('position') == 'static'
			cnt.css 'position','relative'

		svg.addClass id			
		about = $('desc', paper.canvas).text()
		$('desc', paper.canvas).text(about.replace('with ', 'with kartograph '+kartograph.version+' and '))
		
		paper
		
	createHTMLLayer: (id) ->
		me = @
		vp = me.viewport
		cnt = me.container
		me._layerCnt ?= 0
		lid = me._layerCnt++
		div = $ '<div class="layer '+id+'" />'
		div.css
			position: 'absolute'
			top: '0px'
			left: '0px'
			width: vp.width+'px'
			height: vp.height+'px'
			'z-index': lid+5
		cnt.append div	
		div	

	loadMap: (mapurl, callback, opts) ->
		# load svg map
		me = @
		me.clear() 
		me.opts = opts ? {}
		me.opts.zoom ?= 1
		me.mapLoadCallback = callback
		$.ajax 
			url: mapurl
			dataType: if $.browser.msie then "text" else "xml"  
			success: me.mapLoaded
			context: me
		return
	
	
	addLayer: (src_id, layer_id, path_id) ->
		###
		add new layer 
		###
		me = @		
		me.layerIds ?= []
		me.layers ?= {}
		
		layer_id ?= src_id	
		svgLayer = $('#'+src_id, me.svgSrc)
		
		if svgLayer.length == 0
			warn 'didn\'t find any paths for layer "'+src_id+'"'
			console.log me.svgSrc
			window.t = me.svgSrc
			return
		
		layer = new MapLayer(layer_id, path_id, me.paper, me.viewBC)
		
		$paths = $('*', svgLayer[0])		
		
		for svg_path in $paths		
			layer.addPath(svg_path)
				
		if layer.paths.length > 0
			me.layers[layer_id] = layer
			me.layerIds.push layer_id
		else
			warn 'didn\'t find any paths for layer '+layer_id
		console.log 'E '
		return
		

	getLayerPath: (layer_id, path_id) ->
		me = @
		if me.layers[layer_id]? and me.layers[layer_id].hasPath(path_id)
			return me.layers[layer_id].getPath(path_id)
		null
			
	
	addCanvasLayer: (src_id, drawCallback) ->
		me = @
		if not me.canvas?
			canvas = $ '<canvas />'
			canvas.css
				position: 'absolute'
				top: '0px'
				left: '0px'
				
			canvas.attr
				width: me.viewport.width+'px'
				height: me.viewport.height+'px'
				
			me.container.append canvas
			me.canvas = canvas[0]
				
		svgLayer = $('g#'+src_id, me.svgSrc)
		if svgLayer.length == 0
			warn 'didn\'t find any paths for layer "'+layer_id+'"'
			return
		
		layer = new CanvasLayer(src_id, me.canvas, me.viewBC, drawCallback)

		$paths = $('*', svgLayer[0])		
		for svg_path in $paths				
			layer.addPath(svg_path)
			
		layer.render()
			
		
	addLayerEvent: (event, callback, layerId) ->
		me = @
		layerId ?= me.layerIds[me.layerIds.length-1]
		paths = me.layers[layerId].paths
		for path in paths
			$(path.svgPath.node).bind(event, callback)
			
	
	addMarker: (marker) ->
		me = @
		me.markers.push(marker)
		xy = me.viewBC.project me.viewAB.project me.proj.project marker.lonlat.lon, marker.lonlat.lat
		marker.render(xy[0],xy[1],me.container, me.paper)
		
	
	clearMarkers: () ->
		me = @
		for marker in me.markers
			marker.clear()
		me.markers = []
		
	
	choropleth: (opts) ->
		me = @	
		layer_id = opts.layer ? me.layerIds[me.layerIds.length-1]
		if not me.layers.hasOwnProperty layer_id
			warn 'choropleth error: layer "'+layer_ihad+'" not found'
			return

		data = opts.data
		data_col = opts.key
		no_data_color = opts.noDataColor ? '#ccc'
		colorscale = opts.colorscale
		
		pathData = {}
		
		for id, row of data
			pathData[id] = row[data_col]
			
		for id, paths of me.layers[layer_id].pathsById
			for path in paths
				if pathData[id]? and colorscale.validValue(pathData[id])
					v = pathData[id]
					col = colorscale.getColor(v)
					
					path.svgPath.node.setAttribute('style', 'fill:'+col)
				else
					path.svgPath.node.setAttribute('style', 'fill:'+no_data_color)
		return
		
	
	tooltips: (opts) ->
		me = @
		tooltips = opts.content
		layer_id = opts.layer ? me.layerIds[me.layerIds.length-1]
		if not me.layers.hasOwnProperty layer_id
			warn 'tooltips error: layer "'+layer_id+'" not found'
			return
			
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
					if globe._visible(lon, lat_)
						xy = v1.project(v0.project(globe.project(lon, lat_)))
						pts.push xy
					else
						if pts.length > 1
							line = new kartograph.geom.Line(pts)
							pts = []
							lines = lines.concat(line.clipToBBox(viewbox))
				
				if pts.length > 1
					line = new kartograph.geom.Line(pts)
					pts = []
					lines = lines.concat(line.clipToBBox(viewbox))
					
				for line in lines
					path = self.paper.path(line.toSVG())
					path.setAttribute('class', 'graticule latitude lat_'+Math.abs(lat_)+(if lat_ < 0 then 'W' else 'E'))
					grat_lines.push(path)		
					
	###
	
	display: () ->
		###
		finally displays the kartograph, needs to be called after
		layer and marker setup is finished
		###
		@render()
	

		
	
	### 
	    end of public API
	###
	
	mapLoaded: (xml) ->
		me = @
		xml = $(xml) if $.browser.msie		
		me.svgSrc = xml
		vp = me.viewport		
		$view = $('view', xml)[0] # use first view
		me.viewAB = AB = kartograph.View.fromXML $view
		padding = me.opts.padding ? 0
		halign = me.opts.halign ? 'center'
		valign = me.opts.valign ? 'center'
		me.viewBC = new kartograph.View AB.asBBox(),vp.width,vp.height, padding, halign, valign
		me.proj = kartograph.Proj.fromXML $('proj', $view)[0]
		me.mapLoadCallback(me)
	
	
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
				if true and P._visible(p0[0],p0[1]) and P._visible(p1[0],p1[1])					
					p0 = view1.project(view0.project(P.project(p0[0],p0[1])))
					p1 = view1.project(view0.project(P.project(p1[0],p1[1])))
					if vp.inside(p0[0],p0[1]) or vp.inside(p1[0],p1[1])
						pathstr += 'M'+p0[0]+','+p0[1]+'L'+p1[0]+','+p1[1]	
			if pathstr != ""
				me.paper.path(pathstr).attr('opacity',.8)
		
		# for debugging purposes

	
	
	resize: () ->
		###
		forces redraw of every layer
		###
		me = @
		cnt = me.container
		me.viewport = vp = new kartograph.BBox 0,0,cnt.width(),cnt.height()
		me.paper.setSize vp.width, vp.height
		vp = me.viewport		
		padding = me.opts.padding ? 0
		halign = me.opts.halign ? 'center'
		valign = me.opts.valign ? 'center'
		zoom = me.opts.zoom
		me.viewBC = new kartograph.View me.viewAB.asBBox(),vp.width*zoom,vp.height*zoom, padding,halign,valign
		for id,layer of me.layers
			layer.setView(me.viewBC)
		
		
	addFilter: (id, type, params = {}) ->
		me = @
		doc = window.document
		if kartograph.filter[type]?
			fltr = new kartograph.filter[type](params).getFilter(id)
		else
			throw 'unknown filter type '+type
		
		me.paper.defs.appendChild(fltr)
		
	
	applyFilter: (layer_id, filter_id) ->
		me = @
		$('.polygon.'+layer_id, me.paper.canvas).attr
			filter: 'url(#'+filter_id+')'
		
	lonlat2xy: (lonlat) ->
		me = @
		lonlat = new kartograph.LonLat(lonlat[0], lonlat[1]) if lonlat.length == 2
		lonlat = new kartograph.LonLat(lonlat[0], lonlat[1], lonlat[2]) if lonlat.length == 3
		a = me.proj.project(lonlat.lon, lonlat.lat, lonlat.alt)
		me.viewBC.project(me.viewAB.project(a))
		
		
	addGeoPath: (points, cmds=[], className = '') ->
		me = @
		if cmds.length == 0
			cmds.push 'M'
		
		path_str = ''
		for i of points
			pt = points[i]
			cmd = cmds[i] ? 'L'
			xy = me.lonlat2xy pt
			path_str += cmd+xy[0]+','+xy[1]
			
		path = me.paper.path path_str
		path.node.setAttribute 'class', className
		return
		
	showZoomControls: () ->
		me = @
		me.zc = new PanAndZoomControl me
		me
		
	addSymbolGroup: (symbolgroup) ->
		me = @
		me.symbolGroups ?= []
		me.symbolGroups.push(symbolgroup)
		
		
	clear: () ->
		me = @
		if me.layers?
			for id of me.layers
				me.layers[id].remove()
			me.layers = {}
			me.layerIds = []
		
		if me.symbolGroups?  
			for sg in me.symbolGroups
				sg.remove()
			me.symbolGroups = []
	
		
kartograph.Kartograph = Kartograph


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
		
	
	hasPath: (id) ->
		me = @
		me.pathsById? and me.pathsById[id]?
		 
	getPath: (id) ->
		me = @
		if me.hasPath id
			return me.pathsById[id][0]
		throw 'path '+id+' not found'
		

	setView: (view) ->
		###
		# after resizing of the map, each layer gets a new view
		###
		me = @
		for path in me.paths
			path.setView(view)
			
	remove: ->
		###
		removes every path
		###
		me = @
		for path in me.paths
			path.remove()
			
		
class MapLayerPath

	constructor: (svg_path, layer_id, paper, view) ->
		me = @		
		me.path = path = kartograph.geom.Path.fromSVG(svg_path)	
		me.svgPath = view.projectPath(path).toSVG(paper)
		me.svgPath.attr 'fill','#ccb'
		me.svgPath.attr 'stroke','#fff'
		me.baseClass = 'polygon '+layer_id
		# me.svgPath.node.setAttribute('class', me.baseClass)
		me.svgPath.node.path = me # store reference to this path
		
		data = {}
		for i in [0..svg_path.attributes.length-1]
			attr = svg_path.attributes[i]
			if attr.name.substr(0,5) == "data-"
				data[attr.name.substr(5)] = attr.value
		me.data = data
		
	setView: (view) ->
		me = @
		path = view.projectPath(me.path)
		if me.path.type == "path"
			path_str = path.svgString()
			me.svgPath.attr({ path: path_str }) 
		else if me.path.type == "circle"
			me.svgPath.attr({ cx: path.x, cy: path.y, r: path.r })
			
	remove: () ->
		me = @
		me.svgPath.remove()
			
			
class CanvasLayer

	constructor: (layer_id, canvas, view, renderCallback) ->
		me = @
		me.layer_id = layer_id
		me.canvas = canvas
		me.view = view
		me.renderCallback = renderCallback
		
		
	addPath: (svg_path) ->
		me = @
		me.paths ?= []
		path = kartograph.geom.Path.fromSVG(svg_path)	
		me.paths.push path
		
		
	render: () ->
		me = @
		paths = []
		for path in me.paths
			paths.push me.view.projectPath path
		me.renderCallback me, paths
		
		
	drawPaths: () ->
		me = @
		c = me.canvas.getContext '2d'
		
		for path in me.paths
			path = me.view.projectPath path
			#c.fillStyle = '#f00'
		
			for contour in path.contours
				contour.reverse()
				for pt in contour
					if pt == contour[0]
						c.moveTo pt[0],pt[1]
					else
						c.lineTo pt[0],pt[1]
		


class PanAndZoomControl
	
	constructor: (map) ->
		me = @
		me.map = map
		c = map.container
		div = (className, childNodes = []) ->
			d = $('<div class="'+className+'" />')
			for child in childNodes
				d.append child
			d
		mdown = (evt) ->
			$(evt.target).addClass 'md'
		mup = (evt) ->
			$(evt.target).removeClass 'md'
			
		zcp = div 'plus'
		zcp.mousedown mdown
		zcp.mouseup mup
		zcp.click me.zoomIn
		zcm = div 'minus'
		zcm.mousedown mdown
		zcm.mouseup mup
		zcm.click me.zoomOut
		zc = div 'zoom-control', [zcp, zcm]
		c.append zc
		
	zoomIn: (evt) =>
		me = @ 
		me.map.opts.zoom += 1
		me.map.resize()
		
	zoomOut: (evt) =>
		me = @ 
		me.map.opts.zoom -= 1
		me.map.opts.zoom = 1 if me.map.opts.zoom < 1
		me.map.resize()
	


