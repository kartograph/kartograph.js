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


class Symbol
    ### base class for all symbols ###
    me = null

    constructor: (opts) ->
        me = @
        me.location = opts.location
        me.data = opts.data
        me.map = opts.map
        me.layers = opts.layers
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