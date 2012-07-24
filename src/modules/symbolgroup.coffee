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

###
New API

sg = new SymbolGroup({
    data: crimeRatesPerCity,
    location: function(d) {
        return [d.lon, d.lat]];
    },
    filter: function(d) {
        return !isNaN(d.pop);
    },
    layout: 'group',
    group: function(list) {
        var s=0,p=0,i,d,g = {},lat=0,lon=0;
        for (i in list) {
            d = list[i];
            s += d.murder;
            p += d.pop;
        }
        for (i in list) {
            d = list[i];
            lon += d.ll[0] * d.pop/p;
            lat += d.ll[1] * d.pop/p;
        }
        g.murder = s;
        g.pop = p;
        g.ll = [lon,lat];
        return g;
    },
    // type specific options
    type: kartograph.Bubble,
    radius: function(d) {
        return Math.sqrt(d.murder/d.pop)*5;
    },
    color: '#c00'
})

Instead of passing lonlat coords as location you may
pass a string LAYERID.PATHID in order to attach the symbol
to the center of a certain path.
###

class SymbolGroup
    ### symbol groups

    Usage:
    new $K.SymbolGroup(options);
    map.addSymbols(options)
    ###
    me = null

    constructor: (opts) ->
        me = @
        required = ['data','location','type','map']
        optional = ['filter', 'tooltip', 'layout', 'group','click']

        for p in required
            if opts[p]?
                me[p] = opts[p]
            else
                throw "SymbolGroup: missing argument '"+p+"'"

        for p in optional
            if opts[p]?
                me[p] = opts[p]

        SymbolType = me.type

        if not SymbolType?
            warn 'could not resolve symbol type', me.type
            return

        # init symbol properties
        for p in SymbolType.props
            if opts[p]?
                me[p] = opts[p]

        # init layer
        me.layers =
            mapcanvas: me.map.paper

        for l in SymbolType.layers
            nid = SymbolGroup._layerid++
            id = 'sl_'+nid
            if l.type == 'svg'
                layer = me.map.createSVGLayer id
            else if l.type == 'html'
                layer = me.map.createHTMLLayer id
            me.layers[l.id] = layer

        # add symbols
        me.symbols = []
        for i of me.data
            d = me.data[i]
            if __type(me.filter) == "function"
                me.addSymbol d if me.filter d
            else
                me.addSymbol d

        # layout symbols
        me.layoutSymbols()

        # render symbols
        for s in me.symbols
            s.render()

        if __type(me.tooltip) == "function"
            me.initTooltips()

        if __type(me.click) == "function"
            for s in me.symbols
                for node in s.nodes()
                    node.symbol = s
                    $(node).click (e) =>
                        e.stopPropagation()
                        me.click e.target.symbol.data

        me.map.addSymbolGroup(me)


    addSymbol: (data) ->
        ### adds a new symbol to this group ###
        me = @
        SymbolType = me.type
        ll = me._evaluate me.location,data
        if __type(ll) == 'array'
            ll = new kartograph.LonLat ll[0],ll[1]

        sprops =
            layers: me.layers
            location: ll
            data: data
            map: me.map

        for p in SymbolType.props
            if me[p]?
                sprops[p] = me._evaluate me[p],data

        symbol = new SymbolType sprops
        me.symbols.push(symbol)
        symbol

    _evaluate: (prop, data) ->
        ### evaluates a property function or returns a static value ###
        if __type(prop) == 'function'
            val = prop(data)
        else
            val = prop

    layoutSymbols: () ->
        for s in me.symbols
            ll = s.location
            if __type(ll) == 'string'
                [layer_id, path_id] = ll.split('.')
                path = me.map.getLayerPath(layer_id, path_id)
                if path?
                    xy = me.map.viewBC.project path.path.centroid()
                else
                    warn 'could not find layer path '+layer_id+'.'+path_id
                    continue
            else
                xy = me.map.lonlat2xy ll
            s.x = xy[0]
            s.y = xy[1]
        if me.layout == 'group'
            me.groupLayout()

    groupLayout: () ->
        ###
        layouts symbols in this group, eventually adds new 'grouped' symbols
        map.addSymbols({
            layout: "group",
            group: function(data) {
                // compresses a list of data objects into a single one
                // typically you want to calculate the mean position, sum value or something here
            }
        })
        ###
        me = @
        me.gsymbols ?= []
        overlap = true

    initTooltips: () ->
        me = @
        tooltips = me.tooltip
        for s in me.symbols
            cfg =
                position:
                    target: 'mouse'
                    viewport: $(window)
                    adjust:
                        x:7
                        y:7
                show:
                    delay: 20
                content: {}
            tt = tooltips(s.data)
            if __type(tt) == "string"
                cfg.content.text = tt
            else if __type(tt) == "array"
                cfg.content.title = tt[0]
                cfg.content.text = tt[1]

            for node in s.nodes()
                $(node).qtip(cfg)
        return

    remove: () ->
        me = @
        for s in me.symbols
            try
                s.clear()
            catch error
                warn 'error: symbolgroup.remove'
        for id,layer of me.layers
            if id != "mapcanvas"
                layer.remove()

    onResize: () ->
        me = @
        me.layoutSymbols()
        for s in me.symbols
            s.update()
        return


SymbolGroup._layerid = 0
kartograph.SymbolGroup = SymbolGroup

kartograph.Kartograph::addSymbols = (opts) ->
    opts.map = @
    new SymbolGroup(opts)


