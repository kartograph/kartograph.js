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
	new Color(120,.8,.5) // defaults to hsl color
	new Color([120,.8,.5]) // this also works
	new Color(255,100,50,'rgb') //  color using RGB
	new Color('#ff0000') // or hex value
	
	###
	constructor: (x,y,z,m) ->
		me = @
		if not x? and not y? and not z? and not m?
			x = [0,1,1]
			
		if typeof(x) == "object" and x.length == 3
			m = y
			[x,y,z] = x
		
		if  typeof(x) == "string" and x.length == 7
			m = 'hex'
		else 
			m ?= 'hsl'

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
			new Color(xyz0[0]+f*(xyz1[0]-xyz0[0]), xyz0[1] + f*(xyz1[1]-xyz0[1]), xyz0[2] + f*(xyz1[2]-xyz0[2]), m)
			
		else
			throw "color mode "+m+" is not supported"

Color.hex2rgb = (hex) ->
	u = parseInt(hex.substr(1), 16)
	r = u >> 16
	g = u >> 8 & 0xFF
	b = u & 0xFF
	[r,g,b]
	

Color.rgb2hex = (r,g,b) ->
	if r != undefined and r.length == 3
		[r,g,b] = r
	u = r << 16 | g << 8 | b
	str = "000000" + u.toString(16).toUpperCase()
	"#" + str.substr(str.length - 6)


Color.hsl2rgb = (h,s,l) ->
	if h != undefined and h.length == 3
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
	if r != undefined and r.length == 3
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
	

Color.hsl = (h,s,l) ->
	new Color(h,s,l,'hsl')

Color.rgb = (r,g,b) ->
	new Color(r,g,b,'rgb')

Color.hex = (x) ->
	new Color(x)
	

svgmap.color.Color = Color	
	

class ColorScale
	###
	base class for color scales
	###
	constructor: (colors, positions, mode, nacol='#cccccc') ->
		me = @
		for c in [0..colors.length-1]
			colors[c] = new Color(colors[c]) if typeof(colors[c]) == "string"
		me.colors = colors
		me.pos = positions
		me.mode = mode
		me.nacol = nacol
		
	
	getColor: (value) ->
		me = @
		if isNaN(value) then return me.nacol
		value = me.classifyValue value	
		f = f0 = (value - me.min) / (me.max - me.min)
		f = Math.min(1, Math.max(0, f))
		for i in [0..me.pos.length-1]
			p = me.pos[i]
			if f <= p
				col = me.colors[i]
				break			
			if f >= p and i == me.pos.length-1
				col = me.colors[i]
				break
			if f > p and f < me.pos[i+1]
				f = (f-p)/(me.pos[i+1]-p)
				col = me.colors[i].interpolate(f, me.colors[i+1], me.mode)
				break
		col
	
	setClasses: (numClasses = 5, method='equalinterval', limits = []) ->
		###
		# use this if you want to display a limited number of data classes
		# possible methods are "equalinterval", "quantiles", "custom"
		###
		self = @
		self.classMethod = method
		self.numClasses = numClasses
		self.classLimits = limits
		return	
			
	parseData: (data, data_col) ->
		self = @
		min = Number.MAX_VALUE
		max = Number.MAX_VALUE*-1
		sum = 0
		values = []
		for id,row of data
			val = if data_col? then row[data_col] else row
			if not self.validValue(val) 
				continue
			min = Math.min(min, val)
			max = Math.max(max, val)
			values.push(val)
			sum += val
		values = values.sort()
		if values.length % 2 == 1
			self.median = values[Math.floor(values.length*0.5)]
		else
			h = values.length*0.5
			self.median = values[h-1]*0.5 + values[h]*0.5
		self.values = values
		self.mean = sum/values.length
		self.min = min
		self.max = max
		
		method = self.classMethod
		num = self.numClasses
		limits = self.classLimits
		if method?
			if method == "equalinterval"
				for i in [1..num-1]
					limits.push min+(i/num)*(max-min) 
			else if method == "quantiles"
				for i in [1..num-1] 
					p = values.length * i/num
					pb = Math.floor(p)
					if pb == p
						limits.push values[pb] 
					else # p > pb 
						pr = p - pb
						limits.push values[pb]*pr + values[pb+1]*(1-pr)
			limits.unshift(min)
			limits.push(max)
		return
						
						
	classifyValue: (value) ->
		self = @ 
		limits = self.classLimits
		if limits?
			n = limits.length-1
			i = 0
			while i < n and value >= limits[i]
				i++
			value = limits[i-1] + (limits[i] - limits[i-1]) * 0.5
			
			minc = limits[0] + (limits[1]-limits[0])*0.3
			maxc = limits[n-1] + (limits[n]-limits[n-1])*0.7
			value = self.min + ((value - minc) / (maxc-minc)) * (self.max - self.min)
		value
		
	validValue: (value) ->
		not isNaN(value)

svgmap.color.scale ?= {}


class Ramp extends ColorScale
	
	constructor: (col0='#fe0000', col1='#feeeee', mode='hsl') ->
		super [col0,col1], [0,1], mode

svgmap.color.scale.Ramp = Ramp


class Diverging extends ColorScale
	
	constructor: (col0='#d73027', col1='#ffffbf', col2='#1E6189', center='mean', mode='hsl') ->
		me=@
		me.mode = mode
		me.center = center
		super [col0,col1,col2], [0,.5,1], mode
	
	parseData: (data, data_col) ->
		super data, data_col
		me = @
		c = me.center
		if c == 'median'
			c = me.median
		else if c == 'mean'
			c = me.mean	
		me.pos[1] = (c-me.min)/(me.max-me.min)
	

svgmap.color.scale.Diverging = Diverging


class Categories extends ColorScale

	constructor: (colors) ->
		# colors: dictionary of id: colors
		me = @
		me.colors = colors
		
	parseData: (data, data_col) ->
		# nothing to do here..
		
	getColor: (value) ->
		me = @
		if me.colors.hasOwnProperty value
			return me.colors[value]
		else
			return '#cccccc'
	
	validValue: (value) ->
		@colors.hasOwnProperty value
		
svgmap.color.scale.Categories = Categories
	
# some pre-defined color scales:

# Generates a color palette that uses a "cool", blue-heavy color scheme.
svgmap.color.scale.COOL = new Ramp(Color.hsl(180,1,.9), Color.hsl(250,.7,.4))
svgmap.color.scale.HOT = new ColorScale(['#000000','#ff0000','#ffff00','#ffffff'],[0,.25,.75,1],'rgb')
svgmap.color.scale.BWO = new Diverging(Color.hsl(30,1,.6),'#ffffff', new Color(220,1,.6))
svgmap.color.scale.GWP = new Diverging(Color.hsl(120,.8,.4),'#ffffff', new Color(280,.8,.4))

