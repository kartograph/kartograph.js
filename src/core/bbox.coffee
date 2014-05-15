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


class BBox
    ###
    2D bounding box
    ###
    constructor: (left=0, top=0, width=null, height=null) ->
        s = @
        if width == null
            s.xmin = Number.MAX_VALUE
            s.xmax = Number.MAX_VALUE*-1
        else
            s.xmin = s.left = left
            s.xmax = s.right = left + width
            s.width = width
        if height == null
            s.ymin = Number.MAX_VALUE
            s.ymax = Number.MAX_VALUE*-1
        else
            s.ymin = s.top = top
            s.ymax = s.bottom = height + top
            s.height = height
        return

    update: (x, y) ->
        if not y?
            y = x[1]
            x = x[0]
        s = @
        s.xmin = Math.min(s.xmin, x)
        s.ymin = Math.min(s.ymin, y)
        s.xmax = Math.max(s.xmax, x)
        s.ymax = Math.max(s.ymax, y)

        s.left = s.xmin
        s.top = s.ymin
        s.right = s.xmax
        s.bottom = s.ymax
        s.width = s.xmax - s.xmin
        s.height = s.ymax - s.ymin
        @

    intersects: (bbox) ->
        bbox.left < s.right and bbox.right > s.left and bbox.top < s.bottom and bbox.bottom > s.top

    inside: (x,y) ->
        s = @
        x >= s.left and x <= s.right and y >= s.top and y <= s.bottom

    join: (bbox) ->
        s = @
        s.update(bbox.left, bbox.top)
        s.update(bbox.right, bbox.bottom)
        @


BBox.fromXML = (xml) ->
    x = Number(xml.getAttribute('x'))
    y = Number(xml.getAttribute('y'))
    w = Number(xml.getAttribute('w'))
    h = Number(xml.getAttribute('h'))
    new BBox x,y,w,h


kartograph.BBox = BBox

