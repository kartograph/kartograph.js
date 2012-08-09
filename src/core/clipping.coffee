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

kartograph.geom ?= {}
kartograph.geom.clipping ?= {}

class CohenSutherland

    INSIDE = 0
    LEFT = 1
    RIGHT = 2
    BOTTOM = 4
    TOP = 8

    compute_out_code: (bbox, x, y) ->
        self = @
        code = self.INSIDE
        if x < bbox.left then code |= self.LEFT
        else if x > bbox.right then code |= self.RIGHT
        if y < bbox.top then code |= self.TOP
        else if y > bbox.bottom
            code |= self.BOTTOM
        code

    clip: (bbox, x0, y0, x1, y1) ->
        self = @
        code0 = self.compute_out_code(bbox, x0, y0)
        code1 = self.compute_out_code(bbox, x1, y1)
        accept = False
        while True
            if not (code0 | code1)
                # Bitwise OR is 0. Trivially accept and get out of loop
                accept = True
                break
            else if code0 & code1
                # Bitwise AND is not 0. Trivially reject and get out of loop
                break
            else
                # At least one endpoint is outside the clip rectangle; pick it
                cout = if code == 0 then code1 else code0
                # Now find the intersection point;
                # use formulas y = y0 + slope * (x - x0), x = x0 + (1 / slope) * (y - y0)
                if cout & self.TOP
                    # point is above the clip rectangle
                    x = x0 + (x1 - x0) * (bbox.top - y0) / (y1 - y0)
                    y = bbox.top
                else if cout & self.BOTTOM
                    # point is below the clip rectangle
                    x = x0 + (x1 - x0) * (bbox.bottom - y0) / (y1 - y0)
                    y = bbox.bottom
                else if cout & self.RIGHT
                    # point is to the right of clip rectangle
                    y = y0 + (y1 - y0) * (bbox.right - x0) / (x1 - x0)
                    x = bbox.right
                else if cout & self.LEFT
                    # point is to the left of clip rectangle
                    y = y0 + (y1 - y0) * (bbox.left - x0) / (x1 - x0)
                    x = bbox.left
                # Now we move outside point to intersection point to clip
                # and get ready for next pass.
                if cout == code0
                    x0 = x
                    y0 = y
                    code0 = self.compute_out_code(bbox, x0, y0)
                else
                    x1 = x
                    y1 = y
                    code1 = self.compute_out_code(bbox, x1, y1)

        if accept then [x0, y0, x1, y1] else null


kartograph.geom.clipping.CohenSutherland = CohenSutherland


