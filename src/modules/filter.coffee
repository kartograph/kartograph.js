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

#kartograph = root.$K = root.kartograph ?= {}
filter = kartograph.filter ?= {}

filter.__knownFilter = {}
filter.__patternFills = 0

MapLayer::SVG = (el, attr) ->
    if typeof el == "string"
        el = window.document.createElementNS "http://www.w3.org/2000/svg", el
    if attr
        for key,val of attr
            el.setAttribute key, val
    el

Kartograph::addFilter = (id, type, params = {}) ->
    me = @
    doc = window.document
    if kartograph.filter[type]?
        fltr = new filter[type](params).getFilter(id)
    else
        throw 'unknown filter type '+type

    me.paper.defs.appendChild(fltr)


MapLayer::applyFilter = (filter_id) ->
    me = @
    $('.' + me.id, me.paper.canvas).attr
        filter: 'url(#'+filter_id+')'


MapLayer::applyTexture = (url, filt=false, defCol='#000') ->
    me = @
    filter.__patternFills += 1
    for lp in me.paths
        if not filt or filt(lp.data)
            lp.svgPath.attr
                fill: 'url('+url+')'
        else
            lp.svgPath.attr 'fill', defCol

class Filter
    ### base class for all svg filter ###
    constructor: (@params = {}) ->

    getFilter: (id) ->
        me = @
        fltr = me.SVG 'filter',
            id: id
        me.buildFilter fltr
        fltr

    _getFilter: ->
        throw "not implemented"

    SVG: (el, attr) ->
        if typeof el == "string"
            el = window.document.createElementNS "http://www.w3.org/2000/svg", el
        if attr
            for key,val of attr
                el.setAttribute key, val
        el


class BlurFilter extends Filter
    ### simple gaussian blur filter ###
    buildFilter: (fltr) ->
        me = @
        SVG = me.SVG
        blur = SVG 'feGaussianBlur',
            stdDeviation: me.params.size || 4
            result: 'blur'
        fltr.appendChild blur

filter.blur = BlurFilter


hex2rgb = (hex) ->
    if hex.trim().match /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        if hex.length == 4 or hex.length == 7
            hex = hex.substr(1)
        if hex.length == 3
            hex = hex.split("")
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
        u = parseInt(hex, 16)
        r = u >> 16
        g = u >> 8 & 0xFF
        b = u & 0xFF
        return [r,g,b]
    throw 'unknown color format: "'+hex+'"'


class GlowFilter extends Filter
    ### combined class for outer and inner glow filter ###
    buildFilter: (fltr) ->
        me = @
        blur = me.params.blur ? 4
        strength = me.params.strength ? 1
        rgb = me.params.color ? '#D1BEB0'
        rgb = hex2rgb(rgb) if __type(rgb) == 'string'
        inner = me.params.inner ? false
        knockout = me.params.knockout ? false
        alpha = me.params.alpha ? 1
        if inner
            me.innerGlow fltr, blur, strength,  rgb, alpha, knockout
        else
            me.outerGlow fltr, blur, strength,  rgb, alpha, knockout
        return

    outerGlow: (fltr, _blur, _strength,  rgb, alpha, knockout) ->
        me = @
        SVG = me.SVG

        mat = SVG 'feColorMatrix',
            in: 'SourceGraphic'
            type: 'matrix'
            values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0'
            result: 'mask'
        fltr.appendChild mat

        if _strength > 0
            morph = SVG 'feMorphology',
                in: 'mask'
                radius: _strength
                operator: 'dilate'
                result: 'mask'
            fltr.appendChild morph

        mat = SVG 'feColorMatrix',
            in: 'mask'
            type: 'matrix'
            values: '0 0 0 0 '+(rgb[0]/255)+' 0 0 0 0 '+(rgb[1]/255)+' 0 0 0 0 '+(rgb[2]/255)+'  0 0 0 1 0'
            result: 'r0'
        fltr.appendChild mat

        blur = SVG 'feGaussianBlur',
            in: 'r0'
            stdDeviation: _blur
            result: 'r1'
        fltr.appendChild blur

        comp = SVG 'feComposite',
            operator: 'out'
            in: 'r1'
            in2: 'mask'
            result: 'comp'
        fltr.appendChild comp

        merge = SVG 'feMerge'
        if not knockout
            merge.appendChild SVG 'feMergeNode',
                'in': 'SourceGraphic'
        merge.appendChild SVG 'feMergeNode',
            'in': 'r1'
        fltr.appendChild merge


    innerGlow: (fltr, _blur, _strength,  rgb, alpha, knockout) ->
        me = @
        SVG = me.SVG
        log 'innerglow'
        mat = SVG 'feColorMatrix',
            in: 'SourceGraphic'
            type: 'matrix'
            values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 500 0'
            result: 'mask'
        fltr.appendChild mat

        morph = SVG 'feMorphology',
            in: 'mask'
            radius: _strength
            operator: 'erode'
            result: 'r1'
        fltr.appendChild morph

        blur = SVG 'feGaussianBlur',
            in: 'r1'
            stdDeviation: _blur
            result: 'r2'
        fltr.appendChild blur

        mat = SVG 'feColorMatrix',
            type: 'matrix',
            in: 'r2'
            values: '1 0 0 0 '+(rgb[0]/255)+' 0 1 0 0 '+(rgb[1]/255)+' 0 0 1 0 '+(rgb[2]/255)+' 0 0 0 -1 1'
            result: 'r3'
        fltr.appendChild mat

        comp = SVG 'feComposite',
            operator: 'in'
            in: 'r3'
            in2: 'mask'
            result: 'comp'

        fltr.appendChild comp

        merge = SVG 'feMerge'
        if not knockout
            merge.appendChild SVG 'feMergeNode',
                'in': 'SourceGraphic'
        merge.appendChild SVG 'feMergeNode',
            'in': 'comp'
        fltr.appendChild merge


filter.glow = GlowFilter


