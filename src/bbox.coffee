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

class BBox
	###
	2D bounding box
	###
	constructor: (left=0, top=0, width=null, height=null) ->
		s = @
		if width == null
			s.xmin = Number.MAX_VALUE
			s.xmax = Number.MAX_VALUE*-1
		else
			s.xmin = s.left = left
			s.xmax = s.right = left + width
			s.width = width
		if height == null
			s.ymin = Number.MAX_VALUE
			s.ymax = Number.MAX_VALUE*-1
		else
			s.ymin = s.top = top
			s.ymax = s.bottom = height + top
			s.height = height
		return
			
	update: (x, y) ->
		if not y?
			y = x[1]
			x = x[0]
		s = @
		s.xmin = Math.min(s.xmin, x)
		s.ymin = Math.min(s.ymin, y)
		s.xmax = Math.max(s.xmax, x)
		s.ymax = Math.max(s.ymax, y)
		
		s.left = s.xmin
		s.top = s.ymin
		s.right = s.xmax
		s.bottom = s.ymax
		s.width = s.xmax - s.xmin
		s.height = s.ymax - s.ymin
		@
		
	intersects: (bbox) ->
		bbox.left < s.right and bbox.right > s.left and bbox.top < s.bottom and bbox.bottom > s.top
				
	join: (bbox) ->
		s = @
		s.update(bbox.left, bbox.top)
		s.update(bbox.right, bbox.bottom)
		@
		
svgmap.BBox = BBox

