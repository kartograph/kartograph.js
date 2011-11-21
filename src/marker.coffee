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


###
Marker concept:
- markers have to be registered in SVGMap instance
- markers render their own content (output html code)
- SVGMap will position marker div over map
- marker will handle events
###

class MapMarker
	
	constructor: (ll, content = '', offset = [0,0]) ->
		###
		lonlat - LonLat instance
		content - html code that will be placed inside a <div class="marker"> which then will be positioned at the corresponding map position
		offset - x and y offset for the marker
		###
		me = @
		me.visible = true
	
svgmap.MapMarker = MapMarker


class LabelMarker extends MapMarker
	###
	a simple label
	###
	constructor: (ll, label) ->
	
svgmap.LabelMarker = LabelMarker


class IconMarker extends MapMarker
	###
	
	###
	constructor: (ll, icon) ->

svgmap.IconMarker = IconMarker


class BubbleMarker extends MapMarker
	###
	will display a bubble centered on the marker position
	###
	constructor: (ll, size, cssClass='bubble') ->
		super ll
		