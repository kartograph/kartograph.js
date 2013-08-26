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


Kartograph::addGeoPath = (points, cmds=[], className = '') ->
    ### converts a set of ###
    me = @
    path_str = me.getGeoPathStr points,cmds
    path = me.paper.path path_str
    path.node.setAttribute 'class', className if className != ''
    return path


Kartograph::getGeoPathStr = (points, cmds=[]) ->
    ### converts a set of ###
    me = @
    if __type(cmds) == 'string'
        cmds = cmds.split("")
    if cmds.length == 0
        cmds.push 'M'

    path_str = ''
    for i of points
        pt = points[i]
        cmd = cmds[i] ? 'L'
        xy = me.lonlat2xy pt
        if isNaN(xy[0]) or isNaN(xy[1])
            continue
        path_str += cmd+xy[0]+','+xy[1]

    return path_str


Kartograph::addGeoPolygon = (points, className) ->
    ### converts a set of ###
    me = @
    cmds = ['M']
    for i of points
        cmds.push 'L'
    cmds.push 'Z'
    me.addGeoPath points, cmds, className
