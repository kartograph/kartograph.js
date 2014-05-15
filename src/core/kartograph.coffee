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


class Kartograph

    constructor: (container, width, height) ->
        # instantiates a new map
        me = @
        me.container = cnt = $(container)
        width ?= cnt.width()
        height ?= cnt.height()
        if height == 0
            height = 'auto'
        me.size =
            h: height
            w: width
        me.markers = []
        me.pathById = {}
        me.container.addClass 'kartograph'


    createSVGLayer: (id) ->
        me = @
        me._layerCnt ?= 0
        lid = me._layerCnt++
        vp = me.viewport
        cnt = me.container
        paper = Raphael cnt[0],vp.width,vp.height
        svg = $ paper.canvas
        svg.css
            position: 'absolute'
            top: '0px'
            left: '0px'
            'z-index': lid+5

        if cnt.css('position') == 'static'
            cnt.css
                position: 'relative'
                height: vp.height+'px'

        svg.addClass id
        about = $('desc', paper.canvas).text()
        $('desc', paper.canvas).text(about.replace('with ', 'with kartograph '+kartograph.version+' and '))
        paper

    createHTMLLayer: (id) ->
        me = @
        vp = me.viewport
        cnt = me.container
        me._layerCnt ?= 0
        lid = me._layerCnt++
        div = $ '<div class="layer '+id+'" />'
        div.css
            position: 'absolute'
            top: '0px'
            left: '0px'
            width: vp.width+'px'
            height: vp.height+'px'
            'z-index': lid+5
        cnt.append div
        div

    load: (mapurl, callback, opts) ->
        # load svg map
        me = @
        # line 95
        def = $.Deferred()
        me.clear()
        me.opts = opts ? {}
        me.opts.zoom ?= 1
        me.mapLoadCallback = callback
        me._loadMapDeferred = def
        me._lastMapUrl = mapurl # store last map url for map cache

        if me.cacheMaps and kartograph.__mapCache[mapurl]?
            # use map from cache
            me._mapLoaded kartograph.__mapCache[mapurl]
        else
            # load map from url
            $.ajax
                url: mapurl
                dataType: "text"
                success: me._mapLoaded
                context: me
                error: (a,b,c) ->
                    warn a,b,c
        return def.promise()

    loadMap: () ->
        @load.apply @, arguments


    setMap: (svg, opts) ->
        me = @
        me.opts = opts ? {}
        me.opts.zoom ?= 1
        me._lastMapUrl = 'string'
        me._mapLoaded svg
        return


    _mapLoaded: (xml) ->
        me = @

        if me.cacheMaps
            # cache map svg (as string)
            kartograph.__mapCache ?= {}
            kartograph.__mapCache[me._lastMapUrl] = xml

        try
            xml = $(xml) # if $.browser.msie
        catch err
            warn 'something went horribly wrong while parsing svg'
            me._loadMapDeferred.reject('could not parse svg')
            return

        me.svgSrc = xml
        $view = $('view', xml) # use first view

        if not me.paper?
            w = me.size.w
            h = me.size.h
            if h == 'auto'
                ratio = $view.attr('w') / $view.attr('h')
                h = w / ratio
            me.viewport = new BBox 0, 0, w, h

        vp = me.viewport
        me.viewAB = AB = View.fromXML $view[0]
        padding = me.opts.padding ? 0
        halign = me.opts.halign ? 'center'
        valign = me.opts.valign ? 'center'
        # me.viewBC = new View AB.asBBox(),vp.width,vp.height, padding, halign, valign
        zoom = me.opts.zoom ? 1
        me.viewBC = new View me.viewAB.asBBox(), vp.width*zoom, vp.height*zoom, padding,halign,valign
        me.proj = kartograph.Proj.fromXML $('proj', $view)[0]
        if me.mapLoadCallback?
            me.mapLoadCallback me
        if me._loadMapDeferred?
            me._loadMapDeferred.resolve me
        return


    addLayer: (id, opts={}) ->
        ###
        add new layer
        ###
        me = @
        me.layerIds ?= []
        me.layers ?= {}

        if not me.paper?
            me.paper = me.createSVGLayer()

        src_id = id
        if __type(opts) == 'object'
            layer_id = opts.name
            path_id = opts.key
            titles = opts.title
        else
            opts = {}

        layer_paper = me.paper
        if opts.add_svg_layer
            layer_paper = me.createSVGLayer()

        layer_id ?= src_id
        svgLayer = $('#'+src_id, me.svgSrc)

        if svgLayer.length == 0
            # warn 'didn\'t find any paths for layer "'+src_id+'"'
            return

        layer = new MapLayer(layer_id, path_id, me, opts.filter, layer_paper)

        $paths = $('*', svgLayer[0])

        rows = $paths.length
        chunkSize = opts.chunks ? rows
        iter = 0

        nextPaths = () ->
            base = (chunkSize) * iter
            for i in [0...chunkSize]
                if base + i < rows
                    layer.addPath $paths.get(base+i), titles
            if opts.styles?
                for prop, val of opts.styles
                    layer.style prop, val
            iter++
            if iter * chunkSize < rows
                setTimeout nextPaths, 0
            else
                moveOn()

        moveOn = () ->
            if layer.paths.length > 0
                me.layers[layer_id] = layer
                me.layerIds.push layer_id
            # add event handlers
            checkEvents = ['click', 'mouseenter', 'mouseleave', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout']
            for evt in checkEvents
                if __type(opts[evt]) == 'function'
                    layer.on evt, opts[evt]
            if opts.tooltips?
                layer.tooltips opts.tooltips
            if opts.done?
                opts.done()

        if opts.chunks?
            setTimeout nextPaths, 0
        else
            nextPaths()
        me


    getLayer: (layer_id) ->
        ### returns a map layer ###
        me = @
        if not me.layers[layer_id]?
            warn 'could not find layer ' + layer_id
            return null
        me.layers[layer_id]

    getLayerPath: (layer_id, path_id) ->
        me = @
        layer = me.getLayer layer_id
        if layer?
            if __type(path_id) == 'object'
                return layer.getPaths(path_id)[0]
            else
                return layer.getPath path_id
        null

    onLayerEvent: (event, callback, layerId) ->
        # DEPRECATED!
        me = @
        me.getLayer(layerId).on event, callback
        me


    addMarker: (marker) ->
        me = @
        me.markers.push(marker)
        xy = me.viewBC.project me.viewAB.project me.proj.project marker.lonlat.lon, marker.lonlat.lat
        marker.render(xy[0],xy[1],me.container, me.paper)


    clearMarkers: () ->
        me = @
        for marker in me.markers
            marker.clear()
        me.markers = []


    fadeIn: (opts = {}) ->
        me = @
        layer_id = opts.layer ? me.layerIds[me.layerIds.length-1]
        duration = opts.duration ? 500

        for id, paths of me.layers[layer_id].pathsById
            for path in paths
                if __type(duration) == "function"
                    dur = duration(path.data)
                else
                    dur = duration
                path.svgPath.attr 'opacity',0
                path.svgPath.animate {opacity:1}, dur



    ###
        end of public API
    ###

    loadCoastline: ->
        me = @
        $.ajax
            url: 'coastline.json'
            success: me.renderCoastline
            context: me


    resize: (w, h) ->
        ###
        forces redraw of every layer
        ###
        me = @
        cnt = me.container
        w ?= cnt.width()
        h ?= cnt.height()
        me.viewport = vp = new BBox 0,0,w,h
        if me.paper?
            me.paper.setSize vp.width, vp.height
        # update size for other svg layers as well
        for id,layer of me.layers
            if layer.paper? and layer.paper != me.paper
                layer.paper.setSize vp.width, vp.height
        padding = me.opts.padding ? 0
        halign = me.opts.halign ? 'center'
        valign = me.opts.valign ? 'center'
        zoom = me.opts.zoom
        me.viewBC = new View me.viewAB.asBBox(),vp.width*zoom,vp.height*zoom, padding,halign,valign
        for id,layer of me.layers
            layer.setView(me.viewBC)

        if me.symbolGroups?
            for sg in me.symbolGroups
                sg.onResize()
        return


    lonlat2xy: (lonlat) ->
        me = @
        lonlat = new LonLat(lonlat[0], lonlat[1]) if lonlat.length == 2
        lonlat = new LonLat(lonlat[0], lonlat[1], lonlat[2]) if lonlat.length == 3
        a = me.proj.project(lonlat.lon, lonlat.lat, lonlat.alt)
        me.viewBC.project(me.viewAB.project(a))



    addSymbolGroup: (symbolgroup) ->
        me = @
        me.symbolGroups ?= []
        me.symbolGroups.push(symbolgroup)

    removeSymbols: (index) ->
        me = @
        if index?
            me.symbolGroups[index].remove()
        else
            for sg in me.symbolGroups
                sg.remove()

    clear: () ->
        me = @
        if me.layers?
            for id of me.layers
                me.layers[id].remove()
            me.layers = {}
            me.layerIds = []

        if me.symbolGroups?
            for sg in me.symbolGroups
                sg.remove()
            me.symbolGroups = []

        if me.paper?
            $(me.paper.canvas).remove()
            me.paper = undefined


    loadCSS: (url, callback) ->
        ###
        loads a stylesheet
        ###
        me = @
        if not Raphael.svg
            $.ajax
                url: url
                dataType: 'text'
                success: (resp) ->
                    me.styles = kartograph.parsecss resp
                    callback()
                error: (a,b,c) ->
                    warn 'error while loading '+url, a,b,c

        else
            $('body').append '<link rel="stylesheet" href="'+url+'" />'
            callback()


    applyCSS: (el, className) ->
        ###
        applies pre-loaded css styles to
        raphael elements
        ###
        me = @
        if not me.styles?
            return el

        me._pathTypes ?= ["path", "circle", "rectangle", "ellipse"]
        me._regardStyles ?= ["fill", "stroke", "fill-opacity", "stroke-width", "stroke-opacity"]
        for sel of me.styles
            p = sel
            for selectors in p.split ','
                p = selectors.split ' ' # ignore hierarchy
                p = p[p.length-1]
                p = p.split ':' # check pseudo classes
                if p.length > 1
                    continue
                p = p[0].split '.' # check classes
                classes = p.slice(1)
                if classes.length > 0 and classes.indexOf(className) < 0
                    continue
                p = p[0]
                if me._pathTypes.indexOf(p) >= 0 and p != el.type
                    continue
                # if we made it until here, the styles can be applied 
                props = me.styles[sel]
                for k in me._regardStyles
                    if props[k]?
                        el.attr k,props[k]
        el

    style: (layer, prop, value, duration, delay) ->
        me = @
        layer = me.getLayer(layer)
        if layer?
            layer.style prop, value, duration, delay


K = kartograph

root.kartograph = (container, width, height) ->
    new Kartograph container, width, height

kartograph.map = (container, width, height) ->
    new Kartograph container, width, height


kartograph.__mapCache = {} # will store svg files

$.extend root.kartograph, K
