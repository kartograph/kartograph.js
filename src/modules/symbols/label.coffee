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

class SvgLabel extends kartograph.Symbol

    constructor: (opts) ->
        me = @
        super opts
        me.text = opts.text ? ''
        me.style = opts.style ? ''
        me.class = opts.class ? ''
        me.offset = opts.offset ? [0,0]

    render: (layers) ->
        me = @
        me.lbl = lbl = me.layers.mapcanvas.text me.x, me.y, me.text
        me.update()
        me

    update: () ->
        me = @
        me.lbl.attr
            x: me.x + me.offset[0]
            y: me.y + me.offset[1]
        me.lbl.node.setAttribute 'style',me.style
        me.lbl.node.setAttribute 'class',me.class

    clear: () ->
        me = @
        me.lbl.remove()
        me

    nodes: () ->
        me = @
        [me.lbl.node]

SvgLabel.props = ['text', 'style', 'class', 'offset']
SvgLabel.layers = []

root.kartograph.Label = SvgLabel



class HtmlLabel extends kartograph.Symbol

    constructor: (opts) ->
        me = @
        super opts
        me.text = opts.text ? ''
        me.css = opts.css ? ''
        me.class = opts.class ? ''

    render: (layers) ->
        me = @
        l = $ '<div>'+me.text+'</div>'
        l.css
            width: '80px'
            position: 'absolute'
            left: '-40px'
            'text-align': 'center'
        me.lbl = lbl = $ '<div class="label" />'
        lbl.append l
        me.layers.lbl.append lbl

        l.css
            height: l.height()+'px'
            top: (l.height()*-.4)+'px'

        me.update()
        me

    update: () ->
        me = @
        me.lbl.css
            position: 'absolute'
            left: me.x+'px'
            top: me.y+'px'
        me.lbl.css me.css


    clear: () ->
        me = @
        me.lbl.remove()
        me

    nodes: () ->
        me = @
        [me.lbl[0]]

HtmlLabel.props = ['text', 'css', 'class']
HtmlLabel.layers = [{ id: 'lbl', type: 'html' }]

root.kartograph.HtmlLabel = HtmlLabel


