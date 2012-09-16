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


class Symbol
    ### base class for all symbols ###
    me = null

    constructor: (opts) ->
        me = @
        me.location = opts.location
        me.data = opts.data
        me.map = opts.map
        me.layers = opts.layers
        me.key = opts.key
        me.x = opts.x
        me.y = opts.y

    init: () ->
        me

    overlaps: (symbol) ->
        false

    update: (opts) ->
        ### once the data has changed ###
        me

    nodes: () ->
        []

    clear: () ->
        me

kartograph.Symbol = Symbol

