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
    GNU General Public License for more detailme.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
###

class View
	###
	2D coordinate transfomation
	###
	constructor: (bbox, width, height, padding=0) ->
		me = @
		me.bbox = bbox
		me.width = width
		me.padding = padding
		me.height = height
		me.scale = Math.min (width-padding*2) / bbox.width, (height-padding*2) / bbox.height
		
	project: (x, y) ->
		if not y?
			y = x[1]
			x = x[0]
		me = @
		s = me.scale
		bbox = me.bbox
		h = me.height
		w = me.width
		x = (x - bbox.left) * s + (w - bbox.width * s) * .5
		y = (y - bbox.top) * s + (h - bbox.height * s) * .5
		[x,y]
		
	projectPath: (path) ->
		me = @
		contours = []
		for pcont in path.contours
			cont = []
			for [x,y] in pcont
				[x,y] = me.project x,y
				cont.push([x,y])
			contours.push(cont)
		new svgmap.geom.Path contours,path.closed
		
	asBBox: ->
		me = @
		new svgmap.BBox 0,0,me.width,me.height

View.fromXML = (xml) ->
	###
	constructs a view from XML
	###
	w = Number(xml.getAttribute('w'))
	h = Number(xml.getAttribute('h'))
	pad = Number(xml.getAttribute('padding'))
	bbox_xml = xml.getElementsByTagName('bbox')[0]
	bbox = BBox.fromXML(bbox_xml)
	new svgmap.View bbox,w,h,pad
		
root = (exports ? this)	
root.svgmap ?= {}
root.svgmap.View = View