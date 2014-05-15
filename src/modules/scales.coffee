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

# concept slightly borrowed from Mike Bostock's d3


class Scale
	### scales map values to [0..1] ###
	constructor: (domain=[0,1], prop=null, filter=null) ->
		me = @
		values = []
		for i of domain
			if __type(filter) == "function"
				if filter(domain[i]) == false
					continue
			if prop?
				if __type(prop) == "function"
					val = prop domain[i]
				else
					val = domain[i][prop]
			else
				val = domain[i]
			values.push val if not isNaN val
		values = values.sort (a,b)->
			a-b
		me.values = values

		me._range = [0, 1]
		me.rangedScale.range = (_r) =>
			me._range = _r
			me.rangedScale

	scale: (x) =>
		x

	rangedScale: (x) =>
		me = @
		x = me.scale(x)
		r = me._range
		x * (r[1] - r[0]) + r[0]


class LinearScale extends Scale
	### liniear scale ###
	scale: (x) =>
		me = @
		vals = me.values
		(x - vals[0]) / (vals[vals.length-1] - vals[0])


class LogScale extends Scale
	### logatithmic scale ###
	scale: (x) =>
		me = @
		vals = me.values
		log = Math.log
		(log(x) - log(vals[0])) / (log(vals[vals.length-1]) - log(vals[0]))


class SqrtScale extends Scale
	### square root scale ###
	scale: (x) =>
		me = @
		vals = me.values
		Math.sqrt (x - vals[0]) / (vals[vals.length-1] - vals[0])


class QuantileScale extends Scale
	### quantiles scale ###
	scale: (x) =>
		me = @
		vals = me.values
		k = vals.length-1
		for i of vals
			v = vals[Number(i)]
			nv = vals[Number(i)+1]
			if x == v
				return i/k
			if i < k and x > v and x < nv
				return i/k + (x-v)/(nv-v)


# short-hand functions

scale = root.kartograph.scale = {}

scale.identity = (s) ->
	new Scale(domain, prop, filter).rangedScale

scale.linear = (domain, prop, filter) ->
	new LinearScale(domain, prop, filter).rangedScale

scale.log = (domain, prop, filter) ->
	new LogScale(domain, prop, filter).rangedScale

scale.sqrt = (domain, prop, filter) ->
	new SqrtScale(domain, prop, filter).rangedScale

scale.quantile = (domain, prop, filter) ->
	new QuantileScale(domain, prop, filter).rangedScale

