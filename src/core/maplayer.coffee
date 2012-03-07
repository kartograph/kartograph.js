###
    kartograph - a svg mapping library 
    Copyright (C) 2011,2012  Gregor Aisch

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

map_layer_path_uid = 0


