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

class LonLat
	###
	represents a Point
	###
	constructor: (lon, lat, alt = 0) ->
		@lon = Number(lon)
		@lat = Number(lat)
		@alt = Number(alt)
		
	distance: (ll) ->
		me = @
		R = 6371 # km
		deg2rad = Math.PI/180
		dLat = (ll.lat-me.lat)*deg2rad
		dLon = (ll.lon-me.lon)*deg2rad
		lat1 = me.lat*deg2rad
		lat2 = ll.lat*deg2rad
		a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		R * c
	
class LatLon extends LonLat
	constructor: (lat, lon, alt = 0) ->
		super lon, lat, alt
		
		
svgmap.LonLat = LonLat
svgmap.LatLon = LatLon


