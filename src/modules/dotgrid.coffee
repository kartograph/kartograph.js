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


Kartograph::dotgrid = (opts) ->
    me = @
    # use specified layer or the last added
    layer_id = opts.layer ? me.layerIds[me.layerIds.length-1]

    if not me.layers.hasOwnProperty layer_id
        warn 'dotgrid error: layer "'+layer_id+'" not found'
        return

    layer = me.layers[layer_id]

    # initialize path data dictionary

    data = opts.data
    data_col = opts.value
    data_key = opts.key

    pathData = {}
    if data_key? and __type(data) == "array"
        for row in data
            id = row[data_key]
            pathData[String(id)] = row
    else
        for id, row of data
            pathData[String(id)] = row


    # initialize grid

    dotstyle = opts.style ? { fill: 'black', stroke: 'none' }
    sizes = opts.size
    gridsize = opts.gridsize ? 15
    dotgrid = layer.dotgrid ?= { gridsize: gridsize, grid: [] }

    if dotgrid.gridsize != gridsize
        # assigning a new grid with a different grid size
        # remove all grid shapes
        for g in dotgrid.grid
            if g.shape?
                g.shape.remove()
                g.shape = null

    if gridsize > 0
        # a grid size of 0 will be ignored

        if dotgrid.grid.length == 0
            # the grid was not yet initialised
            for x in [0..me.viewport.width] by gridsize
                for y in [0..me.viewport.height] by gridsize
                    g =
                        x: x+(Math.random()-0.5)*gridsize*0.2
                        y: y+(Math.random()-0.5)*gridsize*0.2
                        pathid: false
                    # assign path id
                    f = false
                    for id, paths of layer.pathsById
                        for path in paths
                            if path.vpath.isInside g.x,g.y
                                f = true
                                pd = pathData[id] ? null
                                size = sizes(pd)
                                g.pathid = id
                                g.shape = layer.paper.circle(g.x,g.y,1)
                                break
                        if f then break
                    dotgrid.grid.push g

        for g in dotgrid.grid
            if g.pathid
                pd = pathData[g.pathid] ? null
                size = sizes(pd)
                dur = opts.duration ? 0
                delay = opts.delay ? 0
                if __type(delay) == "function"
                    dly = delay(pd)
                else
                    dly = delay
                if dur > 0 and Raphael.svg
                    anim = Raphael.animation({r: size*0.5}, dur)
                    g.shape.animate(anim.delay(dly))
                else
                    g.shape.attr {r: size * 0.5}
                if __type(dotstyle) == "function"
                    ds = dotstyle(pd)
                else
                    ds = dotstyle
                g.shape.attr ds

    return


