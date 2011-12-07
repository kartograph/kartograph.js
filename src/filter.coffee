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
filter = svgmap.filter ?= {}

class Filter
	
	constructor: (@params = {}) ->
		
	getFilter: (id) ->
		me = @
		fltr = me.SVG 'filter',
			id: id
		me.buildFilter fltr
		fltr
	
	_getFilter: ->
		throw "not implemented"
	
	SVG: (el, attr) ->
		if typeof el == "string"
			el = window.document.createElementNS "http://www.w3.org/2000/svg", el
		if attr
			for key,val of attr 
				el.setAttribute key, val
		el
	
	
class BlurFilter extends Filter
	
	buildFilter: (fltr) ->
		me = @
		SVG = me.SVG
		blur = SVG 'feGaussianBlur',
			stdDeviation: me.params.size || 4
			result: 'blur'
		fltr.appendChild blur

filter.blur = BlurFilter


class GlowFilter extends Filter

	buildFilter: (fltr) ->
		me = @
		SVG = me.SVG
		size = me.params.size || 8
		color = me.params.color || '#D1BEB0'
		color = new svgmap.color.Color(color) if typeof color == 'string'
		rgb = color.rgb
		mat = SVG 'feColorMatrix',
			in: 'SourceGraphic'
			type: 'matrix'
			values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 500 0'
			result: 'mask'
		fltr.appendChild mat
		
		morph = SVG 'feMorphology',
			in: 'mask'
			radius: size
			operator: 'erode'
			result: 'r1'
		fltr.appendChild morph
	
		blur = SVG 'feGaussianBlur',
			in: 'r1'
			stdDeviation: size
			result: 'r2'
		fltr.appendChild blur

		mat = SVG 'feColorMatrix',
			type: 'matrix',
			in: 'r2'
			values: '1 0 0 0 '+(rgb[0]/255)+' 0 1 0 0 '+(rgb[1]/255)+' 0 0 1 0 '+(rgb[2]/255)+' 0 0 0 -1 1'
			result: 'r3'		
		fltr.appendChild mat
		
		comp = SVG 'feComposite',
			operator: 'in'
			in: 'r3'
			in2: 'mask'
			result: 'comp'
			
		fltr.appendChild comp

		merge = SVG 'feMerge'
		merge.appendChild SVG 'feMergeNode',
			'in': 'SourceGraphic'
		merge.appendChild SVG 'feMergeNode',
			'in': 'comp'
		fltr.appendChild merge
		

filter.glow = GlowFilter


