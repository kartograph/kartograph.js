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
    GNU General Public License for more detailme.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
###

class View
	###
	2D coordinate transfomation
	###
	constructor: (bbox, width, height, padding, halign, valign) ->
		me = @
		me.bbox = bbox
		me.width = width
		me.padding = padding ? 0
		me.halign = halign ? 'center'
		me.valign = valign ? 'center'
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
		xf = 
			if me.halign == "center"  
				(w - bbox.width * s) * 0.5 
			else if me.halign == "left" 
				me.padding * s
			else
				# todo: align right needs a fix
				w - (bbox.width - me.padding) * s
		
		yf = 
			if me.valign == "center"
				(h - bbox.height * s) * 0.5 
			else if me.valign == "top"
				me.padding * s
			else 
				# todo: align bottom needs a fix
				0
		
		x = (x - bbox.left) * s + xf 
		y = (y - bbox.top) * s + yf
		[x,y]
		
	
	projectPath: (path) ->
		me = @
		if path.type == "path"
			contours = []
			bbox = [99999,99999,-99999,-99999] #minx miny maxx maxy
			for pcont in path.contours
				cont = []
				for [x,y] in pcont
					[x,y] = me.project x,y
					cont.push([x,y])
					bbox[0] = Math.min bbox[0],x
					bbox[1] = Math.min bbox[1],y
					bbox[2] = Math.max bbox[2],x
					bbox[3] = Math.max bbox[3],y
				contours.push(cont)
			new_path = new geom.Path path.type,contours, path.closed
			new_path._bbox = bbox
			new_path
		else if path.type == "circle"
			[x,y] = me.project path.x,path.y
			r = path.r * me.scale
			new geom.Circle x,y,r

	asBBox: ->
		me = @
		new BBox 0,0,me.width,me.height

View.fromXML = (xml) ->
	###
	constructs a view from XML
	###
	w = Number(xml.getAttribute('w'))
	h = Number(xml.getAttribute('h'))
	pad = Number(xml.getAttribute('padding'))
	bbox_xml = xml.getElementsByTagName('bbox')[0]
	bbox = BBox.fromXML bbox_xml
	new View bbox,w,h,pad

root.kartograph.View = View

