
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

class MapLayerPath

    constructor: (svg_path, layer_id, map, titles) ->
        me = @
        paper = map.paper
        view = map.viewBC
        me.path = path = kartograph.geom.Path.fromSVG(svg_path)
        me.vpath = view.projectPath(path)
        me.svgPath = me.vpath.toSVG(paper)
        if not map.styles?
            me.svgPath.node.setAttribute('class', layer_id)
        else
            map.applyStyles me.svgPath,layer_id

        uid = 'path_'+map_layer_path_uid++
        me.svgPath.node.setAttribute('id', uid)
        map.pathById[uid] = me
        data = {}
        for i in [0..svg_path.attributes.length-1]
            attr = svg_path.attributes[i]
            if attr.name.substr(0,5) == "data-"
                data[attr.name.substr(5)] = attr.value
        me.data = data
        if __type(titles) == 'string'
            title = titles
        else if __type(titles) == 'function'
            title = titles(data)

        if title?
            me.svgPath.attr 'title', title

    setView: (view) ->
        me = @
        path = view.projectPath(me.path)
        me.vpath = path
        if me.path.type == "path"
            path_str = path.svgString()
            me.svgPath.attr({ path: path_str })
        else if me.path.type == "circle"
            me.svgPath.attr({ cx: path.x, cy: path.y, r: path.r })

    remove: () ->
        me = @
        me.svgPath.remove()

