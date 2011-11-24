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
svgmap.color ?= {}


class Color
	###
	data type for colors
	
	eg.
	new Color() // white
	new Color(255,0,0) // defaults to rgb color
	new Color([255,0,0]) // this also works
	new Color(0,1,.5,'hsl') // same color using HSL
	new Color('#ff0000') // or hex value
	
	###
	constructor: (x,y,z,m) ->
		me = @
		x ?= [255,255,255]
		if x.length == 3
			m = y
			[x,y,z] = x
		
		if x.length == 7
			m = 'hex'
		else 
			m ?= 'rgb'

		if m == 'rgb'
			me.rgb = [x,y,z]
		else if m == 'hsl'
			me.rgb = Color.hsl2rgb(x,y,z)
		else if m == 'hex'
			me.rgb = Color.hex2rgb(x)
		
	toString: ->
		Color.rgb2hex(@rgb)
		
	hsl: ->
		Color.rgb2hsl(@rgb)
		
	interpolate: (f, col, m) ->
		###
		interpolates between two colors
		eg
		new Color('#ff0000').interpolate(0.5, new Color('#0000ff')) == '0xffff00'
		###
		me = @
		m ?= 'hsl'
		
		if m == 'hsl' # or hsv or hsb...
			if m == 'hsl'
				xyz0 = me.hsl()
				xyz1 = col.hsl()
		
			[hue0, sat0, lbv0] = xyz0
			[hue1, sat1, lbv1] = xyz1
					
			if not isNaN(hue0) and not isNaN(hue1)
				if hue1 > hue0 and hue1 - hue0 > 180
					dh = hue1-(hue0+360)
				else if hue1 < hue0 and hue0 - hue1 > 180
					dh = hue1+360-hue0
				else
					dh = hue1 - hue0
				hue = hue0+f*dh
			else if not isNaN(hue0)
				hue = hue0
				sat = sat0 if lbv1 == 1 or lbv1 == 0
			else if not isNaN(hue1)
				hue = hue1
				sat = sat1 if lbv0 == 1 or lbv0 == 0
			else
				hue = undefined
				
			sat ?= sat0 + f*(sat1 - sat0)
			
			lbv = lbv0 + f*(lbv1-lbv0)
		
			new Color(hue, sat, lbv, m)
			
		else if m == 'rgb'
			xyz0 = me.rgb
			xyz1 = col.rgb
			new Color(xyz0[0]+f*f*(xyz1[0]-xyz0[0]), xyz0[1] + f*(xyz1[1]-xyz0[1]), xyz0[2] + f*(xyz1[2]-xyz0[2]), m)
			
		else
			throw "color mode "+m+" is not supported"

Color.hex2rgb = (hex) ->
	u = parseInt(hex.substr(1), 16)
	r = u >> 16
	g = u >> 8 & 0xFF
	b = u & 0xFF
	[r,g,b]
	

Color.rgb2hex = (r,g,b) ->
	if r.length == 3
		[r,g,b] = r
	u = r << 16 | g << 8 | b
	str = "000000" + u.toString(16).toUpperCase()
	"#" + str.substr(str.length - 6)


Color.hsl2rgb = (h,s,l) ->
	if h.length == 3
		[h,s,l] = h
	if s == 0
		r = g = b = l*255
	else
		t3 = [0,0,0]
		c = [0,0,0]
		t2 = if l < 0.5 then l * (1+s) else l+s-l*s
		t1 = 2 * l - t2
		h /= 360
		t3[0] = h + 1/3
		t3[1] = h
		t3[2] = h - 1/3
		for i in [0..2]
			t3[i] += 1 if t3[i] < 0
			t3[i] -= 1 if t3[i] > 1
			if 6 * t3[i] < 1
				c[i] = t1 + (t2 - t1) * 6 * t3[i]
			else if 2 * t3[i] < 1
				c[i] = t2
			else if 3 * t3[i] < 2
				c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6
			else 
				c[i] = t1
		[r,g,b] = [Math.round(c[0]*255),Math.round(c[1]*255),Math.round(c[2]*255)]
	[r,g,b]	



Color.rgb2hsl = (r,g,b) ->
	if r.length == 3
		[r,g,b] = r
	r /= 255
	g /= 255
	b /= 255
	min = Math.min(r, g, b)
	max = Math.max(r, g, b)

	l = (max + min) / 2
	
	if max == min
		s = 0
		h = undefined
	else
		s = if l < 0.5 then (max - min) / (max + min) else (max - min) / (2 - max - min)

	if r == max then h = (g - b) / (max - min)
	else if (g == max) then h = 2 + (b - r) / (max - min)
	else if (b == max) then h = 4 + (r - g) / (max - min)
	
	h *= 60;
	h += 360 if h < 0
	[h,s,l]
	

svgmap.color.Color = Color	
	

class ColorScale
	###
	base class for color scales
	###
	getColor: (value) ->
		'#eee'
		
	parseData: (data, data_col) ->
		me = @
		min = Number.MAX_VALUE
		max = Number.MAX_VALUE*-1
		sum = 0
		values = []
		for d in data
			val = if data_col? then d[data_col] else d
			if isNaN(val) 
				continue
			min = Math.min(min, val)
			max = Math.max(max, val)
			values.push(val)
			sum += val
		values = values.sort()
		if values.length % 2 == 1
			me.median = values[Math.floor(values.length*0.5)]
		else
			h = values.length*0.5
			me.median = values[h-1]*0.5 + values[h]*0.5
		me.mean = sum/values.length
		me.min = min
		me.max = max
		

class Ramp extends ColorScale
	
	constructor: (col0='#fe0000', col1='#feeeee') ->
		col0 = new Color(col0) if typeof(col0) == "string"
		col1 = new Color(col1) if typeof(col1) == "string"
		me=@
		me.c0 = col0
		me.c1 = col1
		
	getColor: (value) ->
		me = @
		if isNaN(value)
			console.log('NaN..')
			return new Color('#dddddd')
			
		f = (value - me.min) / (me.max - me.min) 
		me.c0.interpolate(f, me.c1)


svgmap.color.Ramp = Ramp


class Diverging extends ColorScale
	
	constructor: (col0='#d73027', col1='#ffffbf', col2='#1E6189', center='median',mode='hsl') ->
		col0 = new Color(col0) if typeof(col0) == "string"
		col1 = new Color(col1) if typeof(col1) == "string"
		col2 = new Color(col2) if typeof(col2) == "string"
		me=@
		me.c0 = col0
		me.c1 = col1
		me.c2 = col2
		me.mode = mode
		me.center = center
		
	getColor: (value) ->
		me = @
		if isNaN(value)
			return new Color('#dddddd')
		
		c = me.center
		if c == 'median'
			c = me.median
		else if c == 'mean'
			c = me.mean
		
		if value < c
			f = (value - me.min) / (c - me.min)
			col = me.c0.interpolate(f, me.c1, me.mode)
		else if value > c
			f = (value - c) / (me.max - c)
			col = me.c1.interpolate(f, me.c2, me.mode)
		else
			col = me.c1
		col

svgmap.color.Diverging = Diverging

