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
kartograph = root.$K = root.kartograph ?= {}

kartograph.version = "0.4.4"

warn = (s) ->
	console.warn('kartograph ('+kartograph.version+'): '+s)

log = (s) ->
	console.log('kartograph ('+kartograph.version+'): '+s)

String::trim ?= () ->
	this.replace /^\s+|\s+$/g,""
	
`if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}`


class Kartograph

	constructor: (container, width, height) ->
		me = @
		me.container = cnt = $(container)
		width ?= cnt.width()
		height ?= cnt.height()
		if height == 0
			height = width * .5
		me.viewport = new kartograph.BBox 0,0,width,height
		me.paper = me.createSVGLayer()
		me.markers = []
		me.pathById = {}
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
			error: (a,b,c) ->
				warn a,b,c 
		return
	
	
	addLayer: (src_id, layer_id, path_id) ->
		###
		add new layer 
		###
		me = @		
		me.layerIds ?= []
		me.layers ?= {}
		
		if __type(src_id) == 'object'
			opts = src_id
			src_id = opts.id
			layer_id = opts.className
			path_id = opts.key
			titles = opts.title
		else
			opts = {}
			
		layer_id ?= src_id	
		svgLayer = $('#'+src_id, me.svgSrc)
		
		if svgLayer.length == 0
			# warn 'didn\'t find any paths for layer "'+src_id+'"'
			return
		
		layer = new MapLayer(layer_id, path_id, me, opts.filter)
		
		$paths = $('*', svgLayer[0])
		
		for svg_path in $paths		
			layer.addPath(svg_path, titles)
				
		if layer.paths.length > 0
			me.layers[layer_id] = layer
			me.layerIds.push layer_id
		
		# add event handlers
		checkEvents = ['click']
		for evt in checkEvents
			if __type(opts[evt]) == 'function'
				me.onLayerEvent evt, opts[evt], layer_id
		
		return
		

	getLayerPath: (layer_id, path_id) ->
		me = @
		if me.layers[layer_id]? and me.layers[layer_id].hasPath(path_id)
			return me.layers[layer_id].getPath(path_id)
		null
					
		
	onLayerEvent: (event, callback, layerId) ->
		me = @
		me
		layerId ?= me.layerIds[me.layerIds.length-1]
		
		class EventContext
			constructor: (@type, @cb, @map) ->

			handle: (e) =>
				me = @
				path = me.map.pathById[e.target.getAttribute('id')]
				me.cb path.data
		
		ctx = new EventContext(event, callback, me)
		
		if me.layers[layerId]?
			paths = me.layers[layerId].paths
			for path in paths
				$(path.svgPath.node).bind event, ctx.handle
				
	
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
		data_col = opts.value
		data_key = opts.key
		colors = opts.colors
		
		pathData = {}
		
		if data_key? and __type(data) == "array"
			for row in data
				id = row[data_key]
				pathData[id] = row
		else 
			for id, row of data
				pathData[id] = row
				
		for id, paths of me.layers[layer_id].pathsById
			for path in paths
				pd = pathData[id] ? null				
				col = colors(pd)
				
				if opts.duration?
					if __type(opts.duration) == "function"
						dur = opts.duration(pd)
					else
						dur = opts.duration
					if opts.delay?
						if __type(opts.delay) == 'function'
							delay = opts.delay(pd)
						else
							delay = opts.delay
					else
						delay = 0
					ncol = colors(null)
					path.svgPath.attr('fill',ncol)
					anim = Raphael.animation({fill: col}, dur)
					path.svgPath.animate(anim.delay(delay))
				else
					path.svgPath.attr('fill', col)
				#path.svgPath.node.setAttribute('style', 'fill:'+col) 
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
	
	
	fadeIn: (opts = {}) ->
		me = @
		layer_id = opts.layer ? me.layerIds[me.layerIds.length-1]
		duration = opts.duration ? 500
		
		for id, paths of me.layers[layer_id].pathsById
			for path in paths
				if __type(duration) == "function"
					dur = duration(path.data)
				else
					dur = duration
				path.svgPath.attr 'opacity',0
				path.svgPath.animate {opacity:1}, dur
				
		

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
			
	
	loadStyles: (url, callback) ->
		###
		loads a stylesheet
		###
		me = @
		if $.browser.msie
			$.ajax
				url: url
				dataType: 'text'
				success: (resp) ->
					me.styles = kartograph.parsecss resp
					callback()
				error: (a,b,c) ->
					warn 'error while loading '+url, a,b,c
					
		else
			$('body').append '<link rel="stylesheet" href="'+url+'" />'
			callback()
	
	
	applyStyles: (el) ->
		###
		applies pre-loaded css styles to
		raphael elements
		###
		me = @
		if not me.styles?
			return el
			
		me._pathTypes ?= ["path", "circle", "rectangle", "ellipse"]
		me._regardStyles ?= ["fill", "stroke", "fill-opacity", "stroke-width", "stroke-opacity"]
		className = el.node.getAttribute('class')
		for sel of me.styles
			p = sel
			for selectors in p.split ','				
				p = selectors.split ' ' # ignore hierarchy
				p = p[p.length-1]
				p = p.split ':' # check pseudo classes
				if p.length > 1
					continue
				p = p[0].split '.' # check classes
				classes = p.slice(1)
				if classes.length > 0 and classes.indexOf(className) < 0
					continue
				p = p[0]
				if me._pathTypes.indexOf(p) >= 0 and p != el.type
					continue
				# if we made it until here, the styles can be applied
				props = me.styles[sel]
				for k in me._regardStyles
					if props[k]?
						el.attr k,props[k]
		el

	
		
kartograph.Kartograph = Kartograph

kartograph.map = (container, width, height) ->
	new Kartograph container, width, height


class MapLayer
	
	constructor: (layer_id, path_id, map, filter)->
		me = @
		me.id = layer_id
		me.path_id = path_id
		me.paper = map.paper
		me.view = map.viewBC
		me.map = map
		me.filter = filter
		
				
	addPath: (svg_path, titles) ->
		me = @
		me.paths ?= []
		layerPath = new MapLayerPath(svg_path, me.id, me.map, titles)
		if __type(me.filter) == 'function'
			if me.filter(layerPath.data) == false
				layerPath.remove()
				return
		
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

map_layer_path_uid = 0			
		
class MapLayerPath

	constructor: (svg_path, layer_id, map, titles) ->
		me = @		
		paper = map.paper
		view = map.viewBC
		me.path = path = kartograph.geom.Path.fromSVG(svg_path)	
		me.svgPath = view.projectPath(path).toSVG(paper)
		me.svgPath.node.setAttribute('class', layer_id)
		map.applyStyles me.svgPath
		uid = 'path_'+map_layer_path_uid++
		me.svgPath.node.setAttribute('id', uid)	
		map.pathById[uid] = me
		data = {}
		for i in [0..svg_path.attributes.length-1]
			attr = svg_path.attributes[i]
			if attr.name.substr(0,5) == "data-"
				data[attr.name.substr(5)] = attr.value
		me.data = data
		if __type(titles) == 'string'
			title = titles
		else if __type(titles) == 'function'
			title = titles(data)
		
		if title?
			me.svgPath.attr('title', title)
		
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


__type = do ->
	###
	for browser-safe type checking+
	ported from jQuery's $.type
	###
	classToType = {}
	for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
		classToType["[object " + name + "]"] = name.toLowerCase()
	
	(obj) ->
		strType = Object::toString.call(obj)
		classToType[strType] or "object"
    
root.__type ?= __type


