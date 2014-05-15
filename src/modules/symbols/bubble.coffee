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

class Bubble extends Symbol

    constructor: (opts) ->
        me = @
        super opts
        me.radius = opts.radius ? 4
        me.style = opts.style
        me.attrs = opts.attrs
        me.title = opts.title
        me.class = opts.class ? 'bubble'

    overlaps: (bubble) =>
        me = @
        # check bbox
        [x1,y1,r1] = [me.x, me.y, me.radius]
        [x2,y2,r2] = [bubble.x, bubble.y, bubble.radius]
        return false if x1 - r1 > x2 + r2 or x1 + r1 < x2 - r2 or y1 - r1 > y2 + r2 or y1 + r1 < y2 - r2
        dx = x1-x2
        dy = y1-y2
        if dx*dx+dy*dy > (r1+r2)*(r1+r2)
            return false
        true

    render: (layers) =>
        me = @
        if not me.path?
            me.path = me.layers.mapcanvas.circle me.x,me.y,me.radius
        me.update()
        me.map.applyCSS me.path
        me

    update: (duration=false, easing='expo-out') =>
        me = @
        path = me.path
        attrs =
            cx: me.x
            cy: me.y
            r: me.radius
        if me.attrs?
            attrs = $.extend attrs, me.attrs
        if not duration
            path.attr attrs
        else
            path.animate attrs, duration, easing
        if path.node?
            path.node.setAttribute 'style', me.style if me.style?
            path.node.setAttribute 'class', me.class if me.class?
        if me.title?
            path.attr 'title',me.title
        me

    clear: () =>
        me = @
        me.path.remove()
        me

    nodes: () =>
        me = @
        [me.path.node]



Bubble.props = ['radius','style','class','title','attrs']
Bubble.layers = [] # { id:'a', type: 'svg' }

root.kartograph.Bubble = Bubble

