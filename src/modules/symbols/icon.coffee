###
    kartograph - a svg mapping library 
    Copyright (C) 2011,2012  Gregor Aisch

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

class Icon extends kartograph.Symbol

	constructor: (opts) ->
		me = @
		super opts
		me.icon = opts.icon ? ''
		me.offset = opts.offset ? [0,0]
		me.iconsize = opts.iconsize ? [10,10]
		me.class = opts.class ? ''
		me.title = opts.title ? ''

	render: (layers) ->
		me = @
		cont = me.map.container
		me.img = $ '<img />'
		me.img.attr
			src: me.icon
			title: me.title
			alt: me.title
			width: me.iconsize[0]
			height: me.iconsize[1]

		me.img.addClass me.class

		me.img.css
			position: 'absolute'
			'z-index': 1000
			cursor: 'pointer'

		me.img[0].symbol = me
		cont.append me.img
		me.update()

	update: () ->
		me = @
		me.img.css
			left: (me.x+me.offset[0])+'px'
			top: (me.y+me.offset[1])+'px'

	clear: () ->
		me = @
		me.img.remove()
		me

	nodes: () ->
		me = @
		[me.img]


Icon.props = ['icon','offset','class','title','iconsize']
Icon.layers = []

root.kartograph.Icon = Icon


