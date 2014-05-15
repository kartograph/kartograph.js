###
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
###

geom = kartograph.geom ?= {}

class Path
	###
	represents complex polygons (aka multi-polygons)
	###
	constructor: (type, contours, closed=true) ->
		self = @
		self.type = type
		self.contours = []
		for cnt in contours
			if not __is_clockwise cnt
				cnt.reverse()
			self.contours.push cnt
		self.closed = closed

	clipToBBox: (bbox) ->
		# still needs to be implemented
		throw "path clipping is not implemented yet"

	toSVG: (paper) ->
		### translates this path to a SVG path string ###
		str = @svgString()
		paper.path(str)

	svgString: ->
		# returns this path as svg string
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
		# computes the area of this path
		me = @
		if me.areas?
			return me._area
		me.areas = []
		me._area = 0
		for cnt in me.contours
			area = __area cnt
			me.areas.push area
			me._area += area
		me._area

	centroid: ->
		# computes the center of this path
		me = @
		if me._centroid?
			return me._centroid
		area = me.area()

		cx = cy = 0
		for i in [0..me.contours.length-1]
			cnt_orig = me.contours[i]
			cnt = []
			l = cnt_orig.length

			a = me.areas[i]
			k = a/area
			if k == 0
				continue

			for j in [0..l-1]
				p0 = cnt_orig[j]
				p1 = cnt_orig[(j+1)%l]
				diff = 0
				cnt.push p0
				if p0[0] == p1[0]
					diff = Math.abs p0[1] - p1[1]
				if p0[1] == p1[1]
					diff = Math.abs p0[0] - p1[0]
				if diff > 10
					S = Math.floor diff*2
					for s in [1..S-1]
						sp = [p0[0] + s/S * (p1[0] - p0[0]), p0[1] + s/S * (p1[1] - p0[1])]
						cnt.push sp
					# insert new points in between

			x = y = x_ = y_ = 0
			l = cnt.length
			# at first compute total edge length
			_lengths = []
			total_len = 0
			for j in [0..l-1]
				p0 = cnt[j]
				p1 = cnt[(j+1)%l]
				dx = p1[0]-p0[0]
				dy = p1[1]-p0[1]
				len = Math.sqrt dx*dx + dy*dy
				_lengths.push(len)
				total_len += len

			for j in [0..l-1]
				p0 = cnt[j]
				w = _lengths[j]/total_len
				x += w * p0[0]
				y += w * p0[1]

			cx += x * k
			cy += y * k
		me._centroid = [cx,cy]
		me._centroid


	isInside: (x,y) ->
		# checks wether a given point is inside this path or not
		me = @
		bbox = me._bbox
		if x < bbox[0] or x > bbox[2] or y < bbox[1] or y > bbox[3]
			return false

		for i in [0..me.contours.length-1]
			cnt = me.contours[i]
			if __point_in_polygon(cnt, [x,y])
				return true
		return false



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
		path_data = Raphael.parsePathString path_str
		closed = path_data[path_data.length-1] == "Z"
		#closed = path_str[path_str.length-1] == "Z"
		sep = if closed then "Z M" else "M"
		#path_str = path_str.substring(1, path_str.length-(if closed then 1 else 0))
		contour = []
		for cmd in path_data
			if cmd.length == 0
				continue
			if cmd[0] == "M"
				if contour.length > 2
					contours.push contour
					contour = []
				contour.push [cmd[1], cmd[2]]
			else if cmd[0] == "L"
				contour.push [cmd[1], cmd[2]]
			else if cmd[0] == "Z"
				if contour.length > 2
					contours.push contour
					contour = []
		if contour.length >= 2
			contours.push contour
			contour = []

		res = new geom.Path(type, contours, closed)

	else if type == "circle"

		cx = path.getAttribute "cx"
		cy = path.getAttribute "cy"
		r = path.getAttribute "r"

		res = new geom.Circle(cx,cy,r)

	res



class Line
	###
	represents simple lines
	###
	constructor: (@points) ->

	clipToBBox: (bbox) ->
		self = @
		# line clipping here
		clip = new geom.clipping.CohenSutherland().clip
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


__point_in_polygon = (polygon, p) ->
	pi = Math.PI
	atan2 = Math.atan2
	twopi = pi*2
	n = polygon.length
	angle = 0
	for i in [0..n-1]
		x1 = polygon[i][0] - p[0]
		y1 = polygon[i][1] - p[1]
		x2 = polygon[(i+1)%n][0] - p[0]
		y2 = polygon[(i+1)%n][1] - p[1]
		theta1 = atan2(y1,x1)
		theta2 = atan2(y2,x2)
		dtheta = theta2 - theta1
		while dtheta > pi
			dtheta -= twopi
		while dtheta < -pi
			dtheta += twopi
		angle += dtheta
	Math.abs(angle) >= pi


__is_clockwise = (contour) ->
	__area(contour) > 0


__area = (contour) ->
	s = 0
	n = contour.length
	for i in [0...n]
		x1 = contour[i][0]
		y1 = contour[i][1]
		x2 = contour[(i+1)%n][0]
		y2 = contour[(i+1)%n][1]
		s += x1 * y2 - x2 * y1
	s *= 0.5

