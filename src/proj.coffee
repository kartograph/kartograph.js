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

root = exports ? this
__proj = root.proj = {}


class Proj
	
	constructor: (@lon0 = 0, @lat0 = 0) ->
		@HALFPI = Math.PI * .5
		@QUARTERPI = Math.PI * .25
		@RAD = Math.PI / 180
		@lam0 = @rad(@lon0)
		@phi0 = @rad(@lat0)
		
	rad: (a) ->
		a * @RAD
		
	@projections = {}
	
	plot: (polygon, truncate=true) ->
		points = []
		ignore = true
		for [lon,lat] in polygon
			vis = @_visible lon,lat
			if vis
				ignore = false
			[x,y] = @project lon,lat
			if not vis and truncate
				points.push @_truncate x,y
			else
				points.push [x,y]
		if ignore then null else [points]
	
	
class Cylindrical extends Proj
	###
	Base class for cylindrical projections
	###
	_visible: (lon, lat) ->
		true
	
	
class Equirectangular extends Cylindrical
	###
	Equirectangular Projection aka Lonlat aka Plate Carree
	###
	project: (lon, lat) ->
		[(lon+180) * Math.cos(@phi0)*2.777, (lat*-1+90)*2.7777]

__proj['lonlat'] = Equirectangular
	

class CEA extends Cylindrical
	###
	Cylindrical Equal Area Projection
	###
	project: (lon, lat) ->
		lam = @rad(lon)
		phi = @rad(lat*-1)
		x = (lam - @lam0) * Math.cos(@phi0)
		y = Math.sin(phi) / Math.cos(@phi0)
		[x*1000,y*1000]

__proj['cea'] = CEA


class GallPeters extends CEA
	###
	Gall-Peters Projection
	###
	constructor: (lon0, lat0) ->
		super lon0,45

__proj['gallpeters'] = GallPeters


class HoboDyer extends CEA
	###
	Hobo-Dyer Projection
	###
	constructor: (lon0, lat0) ->
		super lon0,37.7

__proj['hobodyer'] = HoboDyer


class Behrmann extends CEA
	###
	Behrmann Projection
	###
	constructor: (lon0, lat0) ->
		super lon0,30
		
__proj['behrmann'] = Behrmann

	
class Balthasart extends CEA
	###
	Balthasart Projection
	###
	constructor: (lon0, lat0) ->
		super lon0,50
	
__proj['balthasart'] = Balthasart


class PseudoCylindrical extends Cylindrical
	###
	Base class for pseudo cylindrical projections
	###
	

class NaturalEarth extends PseudoCylindrical
	###
	Natural Earth Projection
	see here http://www.shadedrelief.com/NE_proj/
	###
	construct: (lon0, lat0) ->
		super lon0,lat0
		s = @
		s.A0 = 0.8707
		s.A1 = -0.131979
		s.A2 = -0.013791
		s.A3 = 0.003971
		s.A4 = -0.001529
		s.B0 = 1.007226
		s.B1 = 0.015085
		s.B2 = -0.044475
		s.B3 = 0.028874
		s.B4 = -0.005916
		s.C0 = s.B0
		s.C1 = 3 * s.B1
		s.C2 = 7 * s.B2
		s.C3 = 9 * s.B3
		s.C4 = 11 * s.B4
		s.EPS = 1e-11
		s.MAX_Y = 0.8707 * 0.52 * Math.PI
		return
		
	project: (lon, lat) ->
		lplam = @rad(lon)
		lpphi = @rad(lat*-1)
		phi2 = lpphi * lpphi
		phi4 = phi2 * phi2
		x = lplam * (@A0 + phi2 * (@A1 + phi2 * (@A2 + phi4 * phi2 * (@A3 + phi2 * @A4)))) * 1000
		y = lpphi * (@B0 + phi2 * (@B1 + phi4 * (@B2 + @B3 * phi2 + @B4 * phi4))) * 1000
		[x,y]

__proj['naturalearth'] = NaturalEarth
	

	
###	

###