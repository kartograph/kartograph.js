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

root = (exports ? this)
kartograph = root.$K = root.kartograph ?= {}

kartograph.Kartograph::tooltips = (opts) ->
    me = @
    content = opts.content
    layer_id = opts.layer ? me.layerIds[me.layerIds.length-1]
    if not me.layers.hasOwnProperty layer_id
        warn 'tooltips error: layer "'+layer_id+'" not found'
        return
    layer = me.layers[layer_id]

    setTooltip = (path, tt) ->
        cfg = {
            position: {
                target: 'mouse',
                viewport: $(window),
                adjust: { x:7, y:7}
            },
            show: {
                delay: opts.delay ? 20
            },
            content: {}
        };

        if tt?
            if typeof(tt) == "string"
                cfg.content.text = tt
            else if $.isArray tt
                cfg.content.title = tt[0]
                cfg.content.text = tt[1]
        else
            cfg.content.text = 'n/a'
        $(path.svgPath.node).qtip(cfg);

    if $.isFunction content
        for path in layer.paths
            tt = content path.data, if layer.path_id? then path.data[layer.path_id] else undefined
            setTooltip path, tt
    else
        for id, paths of layer.pathsById
            for path in paths
                tt = tooltips[id]
                setTooltip path, tt
