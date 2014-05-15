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

class LabeledBubble extends Bubble

    constructor: (opts) ->
        me = @
        super opts
        me.labelattrs = opts.labelattrs ? {}
        me.buffer = opts.buffer
        me.center = opts.center ? true

    render: (layers) =>
        me = @
        if me.title? and String(me.title).trim() != ''
            if me.buffer
                me.bufferlabel = me.layers.mapcanvas.text me.x,me.y,me.title
            me.label = me.layers.mapcanvas.text me.x, me.y, me.title
        super layers
        me

    update: (duration=false, easing='expo-out') =>
        me = @
        super duration, easing
        if me.label?
            vp = me.map.viewport
            attrs = $.extend({}, me.labelattrs)
            x = me.x
            y = me.y
            if me.center
                y -= 0
            else if x > vp.width * 0.5
                attrs['text-anchor'] = 'end'
                x -= me.radius+5
            else if x < vp.width * 0.5
                attrs['text-anchor'] = 'start'
                x += me.radius+5
            attrs['x'] = x
            attrs['y'] = y
            if me.buffer
                me.bufferlabel.attr attrs
                me.bufferlabel.attr
                    stroke: '#fff'
                    fill: '#fff'
                    'stroke-linejoin': 'round'
                    'stroke-linecap': 'round'
                    'stroke-width': 6
            me.label.attr attrs
            me.label.toFront()
        me


    clear: () =>
        me = @
        super

    nodes: () =>
        me = @
        nodes = super
        nodes.push me.label.node if me.label
        nodes.push me.bufferlabel.node if me.bufferlabel
        nodes



LabeledBubble.props = ['radius','style','class','title','labelattrs','buffer','center','attrs']
LabeledBubble.layers = [] # { id:'a', type: 'svg' }

root.kartograph.LabeledBubble = LabeledBubble

