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
		console.log me.bbox
		
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
		
root = (exports ? this)	
root.svgmap ?= {}
root.svgmap.View = View