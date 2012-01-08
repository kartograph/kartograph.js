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
kartograph.geom ?= {} 

class Path
	###
	represents complex polygons (aka multi-polygons)
	###
	constructor: (type, contours, closed=true) ->
		self = @
		self.type = type
		self.contours = contours
		self.closed = closed
	
	clipToBBox: (bbox) ->
		# still needs to be implemented
		throw "path clipping is not implemented yet"
	
	toSVG: (paper) ->
		###
		translates this path to a SVG path string
		###
		str = @svgString()
		paper.path(str)
		
	svgString: ->
		me = @
		str = ""
		glue = if me.closed then "Z M" else "M"
		for contour in me.contours
			fst = true
			str += if str == "" then "M" else glue
			for [x,y] in contour
				str += "L" if not fst
				str += x+','+y
				fst = false
		str += "Z" if me.closed
		str
		
	area: ->
		me = @
		if me.areas?
			return me._area
		me.areas = []
		me._area = 0
		for cnt in me.contours
			area = 0
			for i in [0..cnt.length-2]
				area += cnt[i][0]*cnt[i+1][1] - cnt[i+1][0]*cnt[i][1]
			area *= .5
			area = area
			me.areas.push area
			me._area += area
		me._area
		
	centroid: ->
		me = @
		if me._centroid?
			return me._centroid
		area = me.area()
		cx = cy = 0
		for i in [0..me.contours.length-1]
			cnt = me.contours[i]
			a = me.areas[i]
			x = y = 0
			for j in [0..cnt.length-2]
				k = (cnt[j][0]*cnt[j+1][1] - cnt[j+1][0]*cnt[j][1])
				x += (cnt[j][0]+cnt[j+1][0]) * k
				y += (cnt[j][1]+cnt[j+1][1]) * k
			k = 1/(6*a)
			x *= k
			y *= k
			k = a/area
			cx += x * k
			cy += y * k
		me._centroid = [cx,cy]
		me._centroid
			
				
				

kartograph.geom.Path = Path

class Circle extends Path

	constructor: (@x,@y,@r) ->
		super 'circle',null,true
		
	toSVG: (paper) ->
		me = @
		paper.circle(me.x, me.y, me.r)
		
	centroid: ->
		me = @
		[me.x, me.y]
	
	area: ->
		me = @
		Math.PI * me.r*m.r

kartograph.geom.Circle = Circle

Path.fromSVG = (path) ->
	###
	loads a path from a SVG path string
	###
	contours = []
	type = path.nodeName

	res = null
	if type == "path"
		path_str = path.getAttribute('d').trim()
		closed = path_str[path_str.length-1] == "Z"
		sep = if closed then "Z M" else "M"
		path_str = path_str.substring(1, path_str.length-(if closed then 1 else 0)) 
		
		for contour_str in path_str.split(sep)
			contour = []
			if contour_str != ""
				for pt_str in contour_str.split('L')
					[x,y] = pt_str.split(',')
					contour.push([Number(x), Number(y)])
				contours.push(contour)	
		
		res = new kartograph.geom.Path(type, contours, closed)	
		
	else if type == "circle"
		
		cx = path.getAttribute "cx"
		cy = path.getAttribute "cy"
		r = path.getAttribute "r"
		
		res = new kartograph.geom.Circle(cx,cy,r)
		
	res
		


class Line
	###
	represents simple lines
	###
	constructor: (@points) ->
		
	clipToBBox: (bbox) ->
		self = @
		# line clipping here
		clip = new kartograph.geom.clipping.CohenSutherland().clip
		pts = []
		lines = []
		last_in = false
		for i in [0..self.points.length-2]
			[p0x, p0y] = self.points[i]
			[p1x, p1y] = self.points[i+1]
			try
				[x0,y0,x1,y1] = clip(bbox, p0x, p0y, p1x, p1y)
				last_in = true
				pts.push([x0, y0])
				if p1x != x1 or p1y != y0 or i == len(self.points)-2
					pts.push([x1, y1])
			catch err
				if last_in and pts.length > 1 
					lines.push(new Line(pts))
					pts = []
				last_in = false

		if pts.length > 1
			lines.push(new Line(pts))
		lines
		
	toSVG: ->
		self = @
		pts = []
		for [x,y] in self.points
			pts.push x+','+y 
		'M' + pts.join 'L'
		
kartograph.geom.Line = Line


