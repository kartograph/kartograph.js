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


class Path
	constructor: (@contours, @closed=true) ->
		
	toSVG: ->
		###
		translates this path to a SVG path string
		###
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


Path.fromSVG = (path_str) ->
	###
	loads a path from a SVG path string
	###
	contours = []
	path_str = path_str.trim()
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
	new svgmap.Path(contours, closed)


svgmap.Path = Path

