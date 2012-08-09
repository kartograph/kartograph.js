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


# experimental

class PanAndZoomControl
	
	constructor: (map) ->
		me = @
		me.map = map
		c = map.container
		div = (className, childNodes = []) ->
			d = $('<div class="'+className+'" />')
			for child in childNodes
				d.append child
			d
		mdown = (evt) ->
			$(evt.target).addClass 'md'
		mup = (evt) ->
			$(evt.target).removeClass 'md'
			
		zcp = div 'plus'
		zcp.mousedown mdown
		zcp.mouseup mup
		zcp.click me.zoomIn
		zcm = div 'minus'
		zcm.mousedown mdown
		zcm.mouseup mup
		zcm.click me.zoomOut
		zc = div 'zoom-control', [zcp, zcm]
		c.append zc
		
	zoomIn: (evt) =>
		me = @ 
		me.map.opts.zoom += 1
		me.map.resize()
		
	zoomOut: (evt) =>
		me = @ 
		me.map.opts.zoom -= 1
		me.map.opts.zoom = 1 if me.map.opts.zoom < 1
		me.map.resize()


