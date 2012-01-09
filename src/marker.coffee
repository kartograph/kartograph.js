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
kartograph = root.kartograph ?= {}
kartograph.marker ?= {}

###
New API

sg = new SymbolGroup({
	data: crimeRatesPerCity,
	location: function(d) {
		return [d.lon, d.lat]];
	},
	filter: function(d) {
		return !isNaN(d.pop);
	},
	layout: 'group',
	group: function(list) {
		var s=0,p=0,i,d,g = {},lat=0,lon=0;
		for (i in list) {
			d = list[i];
			s += d.murder;
			p += d.pop;
		}
		for (i in list) {
			d = list[i];
			lon += d.ll[0] * d.pop/p;
			lat += d.ll[1] * d.pop/p;
		}
		g.murder = s;
		g.pop = p;
		g.ll = [lon,lat];
		return g;
	},
	// type specific options
	type: 'Bubble',
	radius: function(d) {
		return Math.sqrt(d.murder/d.pop)*5;
	},
	color: '#c00'
})

###

class SymbolGroup

	constructor: (opts) ->
		me = @
		required = ['data','location','type','map']
		optional = ['filter', 'tooltip', 'layout', 'group','click']
		
		for p in required
			if opts[p]?
				me[p] = opts[p]
			else
				throw "SymbolGroup: missing argument "+p
		
		for p in optional
			if opts[p]?
				me[p] = opts[p]
		
		SymbolType = me.type
		
		# init symbol properties
		for p in SymbolType.props
			if opts[p]?
				me[p] = opts[p]
		
		# init layer
		me.layers = 
			mapcanvas: me.map.paper
			
		for l in SymbolType.layers
			nid = SymbolGroup._layerid++
			id = 'sl_'+nid
			if l.type == 'svg'
				layer = me.map.createSVGLayer id
			else if l.type == 'html'
				layer = me.map.createHTMLLayer id
			me.layers[l.id] = layer
		
		# add symbols
		me.symbols = [] 
		for i of me.data
			d = me.data[i]
			if type(me.filter) == "function"
				me.addSymbol d if me.filter d
			else
				me.addSymbol d
				
		# layout symbols
		me.layoutSymbols()
		
		# render symbols
		for s in me.symbols
			s.render()
			
		if type(me.tooltip) == "function"
			me.initTooltips()
			
		if type(me.click) == "function"
			for s in me.symbols
				for node in s.nodes()
					node.symbol = s
					$(node).click (e) =>
						me.click e.target.symbol.data
			
		me.map.addSymbolGroup(me)
		
	addSymbol: (data) ->
		###
		adds a new symbol to this group
		###
		me = @
		SymbolType = me.type
		ll = me.evaluate me.location,data
		if type(ll) == 'array'
			ll = new kartograph.LonLat ll[0],ll[1]
		
		sprops = 
			layers: me.layers
			location: ll
			data: data
			map: me.map
			
		for p in SymbolType.props
			if me[p]?
				sprops[p] = me.evaluate me[p],data
				
		symbol = new SymbolType sprops
		me.symbols.push(symbol)
		symbol
			
	evaluate: (prop, data) ->
		###
		evaluates a property function or returns a static value
		###
		if type(prop) == 'function'
			val = prop(data)
		else
			val = prop
	
	layoutSymbols: () ->
		me = @
		for s in me.symbols
			ll = s.location
			if type(ll) == 'string'
				[layer_id, path_id] = ll.split('.')
				path = me.map.getLayerPath(layer_id, path_id)
				if path?
					xy = me.map.viewBC.project path.path.centroid()
				else
					continue
			else
				xy = me.map.lonlat2xy ll
			s.x = xy[0]
			s.y = xy[1]
		if me.layout == 'group'
			me.groupLayout()
	
	groupLayout: () ->
		###
		layouts symbols in this group, eventually adds new 'grouped' symbols
		###
		me = @
		me.gsymbols ?= []
		overlap = true
		
	initTooltips: () ->
		me = @
		tooltips = me.tooltip	
		for s in me.symbols
			cfg = 
				position:
					target: 'mouse'
					viewport: $(window)
					adjust: 
						x:7
						y:7
				show: 
					delay: 20 
				content: {}
			tt = tooltips(s.data)
			if type(tt) == "string"
				cfg.content.text = tt
			else if type(tt) == "array"
				cfg.content.title = tt[0]
				cfg.content.text = tt[1]
			
			for node in s.nodes()
				$(node).qtip(cfg)
		return
				
	remove: () ->
		me = @
		for s in me.symbols
			s.clear()
		for id,layer of me.layers
			if id != "mapcanvas"
				layer.remove()
		
SymbolGroup._layerid = 0
kartograph.SymbolGroup = SymbolGroup		

class Symbol

	constructor: (opts) ->
		me = @
		me.location = opts.location
		me.data = opts.data
		me.map = opts.map
		me.layers = opts.layers
		me.x = opts.x
		me.y = opts.y
		
	init: () ->
		return
		
	overlaps: (symbol) ->
		false
		
	nodes: () ->
		[]
		
	clear: () ->
		return

	
class Bubble extends Symbol

	constructor: (opts) ->
		me = @
		super opts
		me.radius = opts.radius ? 4
		me.style = opts.style ? ''
		me.class = opts.class ? ''
				
	overlaps: (bubble) ->
		me = @
		# check bbox
		[x1,y1,r1] = [me.x, me.y, me.radius]
		[x2,y2,r2] = [bubble.x, bubble.y, bubble.radius]
		return false if x1 - r1 > x2 + r2 or x1 + r1 < x2 - r2 or y1 - r1 > y2 + r2 or y1 + r1 < y2 - r2
		dx = x1-x2
		dy = y1-y2
		if dx*dx+dy*dy > (r1+r2)*(r1+r2)
			return false
		true

	render: (layers) ->
		me = @
		me.path = me.layers.a.circle(me.x,me.y,me.radius)
		me.update()
		me.map.applyStyles(me.path)
		me
		
	update: () ->
		me = @
		me.path.attr 
			x: me.x
			y: me.y
			r: me.radius
		path = me.path
		path.node.setAttribute 'style', me.style
		path.node.setAttribute 'class', me.class
		me
	
	clear: () ->
		me = @
		me.path.remove()
		me
		
	nodes: () ->
		me = @
		[me.path.node]
		
	
		
		

Bubble.props = ['radius','style','class']
Bubble.layers = [{ id:'a', type: 'svg' }]

kartograph.Bubble = Bubble


class HtmlLabel extends Symbol

	constructor: (opts) ->
		me = @
		super opts
		me.text = opts.text ? ''
		me.style = opts.style ? ''
		me.class = opts.class ? ''

	render: (layers) ->
		me = @
		l = $ '<div>'+me.text+'</div>'
		l.css
			width: '50px'
			position: 'absolute'
			left: '-25px'
			'text-align': 'center'
		me.lbl = lbl = $ '<div class="label" />'
		lbl.append l
		me.layers.lbl.append lbl
		
		l.css
			height: l.height()+'px'
			top: (l.height()*-.4)+'px'
		
		me.update()
		me

	update: () ->
		me = @
		me.lbl.css
			position: 'absolute'
			left: me.x+'px'
			top: me.y+'px'

	clear: () ->
		me = @
		me.lbl.remove()
		me
		
	nodes: () ->
		me = @
		[me.lbl[0]]

HtmlLabel.props = ['text', 'style', 'class']
HtmlLabel.layers = [{ id: 'lbl', type: 'html' }]

kartograph.HtmlLabel = HtmlLabel


class SvgLabel extends Symbol

	constructor: (opts) ->
		me = @
		super opts
		me.text = opts.text ? ''
		me.style = opts.style ? ''
		me.class = opts.class ? ''

	render: (layers) ->
		me = @
		me.lbl = lbl = me.layers.mapcanvas.text me.x, me.y, me.text		
		me.update()
		me

	update: () ->
		me = @
		me.lbl.attr
			x: me.x
			y: me.y
		me.lbl.node.setAttribute 'style',me.style
		me.lbl.node.setAttribute 'class',me.class

	clear: () ->
		me = @
		me.lbl.remove()
		me
		
	nodes: () ->
		me = @
		[me.lbl.node]

SvgLabel.props = ['text', 'style', 'class']
SvgLabel.layers = []

kartograph.Label = SvgLabel




class Icon extends Symbol


Icon.props = ['icon']
Icon.layer = ['html']



class MapMarker
	
	constructor: (ll) ->
		###
		lonlat - LonLat instance
		content - html code that will be placed inside a <div class="marker"> which then will be positioned at the corresponding map position
		offset - x and y offset for the marker
		###
		me = @
		ll = new kartograph.LonLat(ll[0], ll[1]) if ll.length == 2
		me.lonlat = ll
		me.visible = true
		
	render: (x,y,cont,paper) ->
		###
		this function will be called by kartograph to render the marker
		###
	
kartograph.marker.MapMarker = MapMarker



class LabelMarker extends MapMarker
	###
	a simple label
	###
	constructor: (ll, label) ->
		super ll
		@label = label
	
kartograph.marker.LabelMarker = LabelMarker



class DotMarker extends LabelMarker
	
	constructor: (ll, label, rad, color=null) ->
		super ll, label
		@rad = rad
		@color = color
	
	render: (x,y,cont,paper) ->
		me = @
		me.path = paper.circle(x,y,@rad)
		node = me.path.node
		node.setAttribute('class', 'dotMarker')
		node.setAttribute('title', @label)
		if @color?
			node.setAttribute('style', 'fill:'+@color)
			
	clear: () ->
		@path.remove()
		

kartograph.marker.DotMarker = DotMarker



class IconMarker extends MapMarker
	###
	
	###
	constructor: (ll, icon) ->

kartograph.marker.IconMarker = IconMarker


class LabeledIconMarker extends MapMarker
	
	constructor: (params) ->
		me = @
		super params.ll
		me.icon_src = params.icon
		me.label_txt = params.label
		me.className = params.className ? 'marker'
		me.dx = params.dx ? 0
		me.dy = params.dy ? 0
		
	render: (x,y,cont,paper) ->
		me = @
		if not me.markerDiv
			me.icon = $('<img src="'+me.icon_src+'" class="icon"/>')
			me.label = $('<div class="label">'+me.label_txt+'</div>')
			me.markerDiv = $('<div class="'+me.className+'" />')
			me.markerDiv.append me.icon
			me.markerDiv.append me.label
			
			cont.append me.markerDiv
		
		me.markerDiv.css
			position: 'absolute'
			left: (x+me.dx)+'px'
			top: (y+me.dy)+'px'

kartograph.marker.LabeledIconMarker = LabeledIconMarker
		
		


class BubbleMarker extends MapMarker
	###
	will display a bubble centered on the marker position
	###
	constructor: (ll, size, cssClass='bubble') ->
		super ll
		