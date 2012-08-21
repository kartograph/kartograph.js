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

class MapLayer

    constructor: (layer_id, path_id, map, filter)->
        me = @
        me.id = layer_id
        me.path_id = path_id
        me.paper = map.paper
        me.view = map.viewBC
        me.map = map
        me.filter = filter


    addPath: (svg_path, titles) ->
        me = @
        me.paths ?= []
        layerPath = new MapLayerPath(svg_path, me.id, me.map, titles)
        if __type(me.filter) == 'function'
            if me.filter(layerPath.data) == false
                layerPath.remove()
                return

        me.paths.push(layerPath)

        if me.path_id?
            me.pathsById ?= {}
            me.pathsById[layerPath.data[me.path_id]] ?= []
            me.pathsById[layerPath.data[me.path_id]].push(layerPath)


    hasPath: (id) ->
        me = @
        me.pathsById? and me.pathsById[id]?


    getPathsData: () ->
        ### returns a list of all shape data dictionaries ###
        me = @
        pd = []
        for path in me.paths
            pd.push path.data
        pd


    getPath: (id) ->
        me = @
        if me.hasPath id
            return me.pathsById[id][0]
        throw 'path '+id+' not found'


    setView: (view) ->
        ###
        # after resizing of the map, each layer gets a new view
        ###
        me = @
        for path in me.paths
            path.setView(view)

    remove: ->
        ###
        removes every path
        ###
        me = @
        for path in me.paths
            path.remove()

    style: (prop, value, duration, delay) ->
        me = @
        duration ?= 0
        delay ?= 0
        for path in me.paths
            val = resolve(value, path.data)
            dur = resolve(duration, path.data)
            dly = resolve(delay, path.data)

            if dur > 0
                at = {}
                at[prop] = val
                anim = Raphael.animation(at, dur * 1000)
                path.svgPath.animate(anim.delay(dly * 1000))
            else
                path.svgPath.attr(prop, val)
        me

    on: (event, callback) ->
        me = @

        class EventContext
            constructor: (@type, @cb, @layer) ->
            handle: (e) =>
                me = @
                path = me.layer.map.pathById[e.target.getAttribute('id')]
                me.cb path.data, path.svgPath, e

        ctx = new EventContext(event, callback, me)
        for path in me.paths
            $(path.svgPath.node).bind event, ctx.handle


resolve = (prop, data) ->
    if type(prop) == 'function'
        return prop data
    return prop

map_layer_path_uid = 0


