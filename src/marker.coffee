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
svgmap.marker ?= {}

###
Marker concept:
- markers have to be registered in SVGMap instance
- markers render their own content (output html code)
- SVGMap will position marker div over map
- marker will handle events
###

class MapMarker
	
	constructor: (ll) ->
		###
		lonlat - LonLat instance
		content - html code that will be placed inside a <div class="marker"> which then will be positioned at the corresponding map position
		offset - x and y offset for the marker
		###
		me = @
		ll = new svgmap.LonLat(ll[0], ll[1]) if ll.length == 2
		me.lonlat = ll
		me.visible = true
		
	render: (x,y,cont,paper) ->
		###
		this function will be called by svgmap to render the marker
		###
	
svgmap.marker.MapMarker = MapMarker



class LabelMarker extends MapMarker
	###
	a simple label
	###
	constructor: (ll, label) ->
		super ll
		@label = label
	
svgmap.marker.LabelMarker = LabelMarker



class DotMarker extends LabelMarker
	
	constructor: (ll, label, rad) ->
		super ll, label
		@rad = rad
	
	render: (x,y,cont,paper) ->
		node = paper.circle(x,y,@rad).node
		node.setAttribute('class', 'dotMarker')
		node.setAttribute('title', @label)

svgmap.marker.DotMarker = DotMarker



class IconMarker extends MapMarker
	###
	
	###
	constructor: (ll, icon) ->

svgmap.marker.IconMarker = IconMarker


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

svgmap.marker.LabeledIconMarker = LabeledIconMarker
		
		


class BubbleMarker extends MapMarker
	###
	will display a bubble centered on the marker position
	###
	constructor: (ll, size, cssClass='bubble') ->
		super ll
		