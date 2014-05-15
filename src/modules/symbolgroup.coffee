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


class SymbolGroup
    ### symbol groups

    Usage:
    new $K.SymbolGroup(options);
    map.addSymbols(options)
    ###
    me = null

    constructor: (opts) ->
        me = @
        required = ['data', 'location', 'type', 'map']
        optional = ['filter', 'tooltip', 'click', 'delay', 'sortBy', 'clustering', 'aggregate', 'clusteringOpts', 'mouseenter', 'mouseleave']

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
                me.add d, i if me.filter d, i
            else
                me.add d, i

        me.layout()
        me.render()
        me.map.addSymbolGroup(me)


    add: (data, key) ->
        ### adds a new symbol to this group ###
        me = @
        SymbolType = me.type
        ll = me._evaluate me.location,data,key
        if __type(ll) == 'array'
            ll = new LonLat ll[0],ll[1]

        sprops =
            layers: me.layers
            location: ll
            data: data
            key: key ? me.symbols.length
            map: me.map

        for p in SymbolType.props
            if me[p]?
                sprops[p] = me._evaluate me[p],data,key

        symbol = new SymbolType sprops
        me.symbols.push symbol
        symbol


    layout: () ->
        for s in me.symbols
            ll = s.location
            if __type(ll) == 'string'  # use layer path centroid as coordinates
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
        if me.clustering == 'k-means'
            me._kMeans()
        else if me.clustering == 'noverlap'
            me._noverlap()
        me

    render: () ->
        me = @
        # sort
        if me.sortBy
            sortDir = 'asc'
            if __type(me.sortBy) == "string"
                me.sortBy = me.sortBy.split ' ',2
                sortBy = me.sortBy[0]
                sortDir = me.sortBy[1] ? 'asc'

            me.symbols = me.symbols.sort (a,b) ->
                if __type(me.sortBy) == "function"
                    va = me.sortBy a.data, a
                    vb = me.sortBy b.data, b
                else
                    va = a[sortBy]
                    vb = b[sortBy]
                return 0 if va == vb
                m = if sortDir == 'asc' then 1 else -1
                return if va > vb then 1*m else -1*m

        # render
        for s in me.symbols
            s.render()
            for node in s.nodes()
                node.symbol = s

        # tooltips
        if __type(me.tooltip) == "function"
            me._initTooltips()

        # events
        $.each ['click', 'mouseenter', 'mouseleave'], (i, evt) ->
            if __type(me[evt]) == "function"
                for s in me.symbols
                    for node in s.nodes()
                        $(node)[evt] (e) =>
                            tgt = e.target
                            while not tgt.symbol
                                tgt = $(tgt).parent().get(0)
                            e.stopPropagation()
                            me[evt] tgt.symbol.data, tgt.symbol, e
        me

    tooltips: (cb) ->
        me = @
        me.tooltips = cb
        me._initTooltips()
        me

    remove: (filter) ->
        me = @
        kept = []
        for s in me.symbols
            if filter? and not filter(s.data)
                kept.push s
                continue
            try
                s.clear()
            catch error
                warn 'error: symbolgroup.remove'
        if not filter?
            for id,layer of me.layers
                if id != "mapcanvas"
                    layer.remove()
        else
            me.symbols = kept

    _evaluate: (prop, data, key) ->
        ### evaluates a property function or returns a static value ###
        if __type(prop) == 'function'
            val = prop data, key
        else
            val = prop

    _kMeans: () =>
        ###
        layouts symbols in this group, eventually adds new 'grouped' symbols
        map.addSymbols({
            layout: "k-means",
            aggregate: function(data) {
                // compresses a list of data objects into a single one
                // typically you want to calculate the mean position, sum value or something here
            }
        })
        ###
        me = @
        me.osymbols ?= me.symbols
        SymbolType = me.type
        if me.clusteringOpts?
            size = me.clusteringOpts.size
        size ?= 64

        cluster = kmeans().iterations(16).size(size)

        for s in me.osymbols
            cluster.add
                x: s.x
                y: s.y

        means = cluster.means()
        out = []
        for mean in means
            if mean.size == 0
                continue
            d = []
            for i in mean.indices
                d.push me.osymbols[i].data
            d = me.aggregate d

            sprops =
                layers: me.layers
                location: false
                data: d
                map: me.map

            for p in SymbolType.props
                if me[p]?
                    sprops[p] = me._evaluate me[p],d

            s = new SymbolType sprops
            s.x = mean.x
            s.y = mean.y
            out.push s

        me.symbols = out

    _noverlap: () =>
        me = @
        me.osymbols ?= me.symbols

        iterations = 3

        SymbolType = me.type
        if 'radius' not in SymbolType.props
            warn 'noverlap layout only available for symbols with property "radius"'
            return

        symbols = me.osymbols.slice()

        if me.clusteringOpts?
            tolerance = me.clusteringOpts.tolerance
            maxRatio = me.clusteringOpts.maxRatio
        tolerance ?= 0.05
        maxRatio ?= 0.8

        for i in [0..iterations-1]
            # sort by radius
            symbols.sort (a,b) ->
                return b.radius - a.radius
            l = symbols.length
            out = []
            for p in [0..l-3]
                s0 = symbols[p]
                if not s0
                    continue
                rad0 = s0.radius * (1-tolerance)
                l0 = s0.x - rad0
                r0 = s0.x + rad0
                t0 = s0.y - rad0
                b0 = s0.y + rad0
                intersects = []
                for q in [p+1..l-2]
                    #console.info p,q
                    s1 = symbols[q]
                    if not s1
                        continue
                    rad1 = s1.radius
                    l1 = s1.x - rad1
                    r1 = s1.x + rad1
                    t1 = s1.y - rad1
                    b1 = s1.y + rad1
                    if rad1 / s0.radius < maxRatio
                        if not (r0 < l1 or r1 < l0) and not (b0 < t1 or b1 < t0)
                            dx = (s1.x - s0.x)
                            dy = (s1.y - s0.y)
                            if dx * dx + dy * dy < (rad0 + rad1) * (rad0 + rad1)
                                intersects.push q

                if intersects.length > 0
                    d = [s0.data]
                    r = s0.radius * s0.radius
                    for i in intersects
                        d.push symbols[i].data
                        r += symbols[i].radius * symbols[i].radius
                    d = me.aggregate d

                    sprops =
                        layers: me.layers
                        location: false
                        data: d
                        map: me.map

                    for p in SymbolType.props
                        if me[p]?
                            sprops[p] = me._evaluate me[p],d

                    s = new SymbolType sprops
                    w = s0.radius * s0.radius / r
                    x = s0.x * w
                    y = s0.y * w
                    for i in intersects
                        s1 = symbols[i]
                        w = s1.radius * s1.radius / r
                        x += s1.x * w
                        y += s1.y * w
                        symbols[i] = undefined
                    s.x = x
                    s.y = y
                    symbols[p] = undefined
                    out.push s
                else
                    # no intersection with s0
                    out.push s0
            symbols = out
        me.symbols = symbols

    _initTooltips: () =>
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
                events:
                    show: (evt, api) ->
                        # make sure that two tooltips are never shown
                        # together at the same time
                        $('.qtip').filter () ->
                            this != api.elements.tooltip.get(0)
                        .hide()

            tt = tooltips s.data, s.key
            if __type(tt) == "string"
                cfg.content.text = tt
            else if __type(tt) == "array"
                cfg.content.title = tt[0]
                cfg.content.text = tt[1]

            for node in s.nodes()
                $(node).qtip(cfg)
        return


    onResize: () ->
        me = @
        me.layout()
        for s in me.symbols
            s.update()
        return


    update: (opts, duration, easing) ->
        me = @
        if not opts?
            opts = {}
        for s in me.symbols
            for p in me.type.props
                if opts[p]?
                    s[p] = me._evaluate opts[p],s.data
                else if me[p]?
                    s[p] = me._evaluate me[p],s.data
            s.update(duration, easing)
        me


SymbolGroup._layerid = 0
kartograph.SymbolGroup = SymbolGroup

Kartograph::addSymbols = (opts) ->
    opts.map = @
    new SymbolGroup(opts)




#
# Code for k-means clustering is taken from
# http://polymaps.org/ex/kmeans.js
#
`
/*
    Copyright (c) 2010, SimpleGeo and Stamen Design
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
        * Redistributions of source code must retain the above copyright
          notice, this list of conditions and the following disclaimer.
        * Redistributions in binary form must reproduce the above copyright
          notice, this list of conditions and the following disclaimer in the
          documentation and/or other materials provided with the distribution.
        * Neither the name of SimpleGeo nor the
          names of its contributors may be used to endorse or promote products
          derived from this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL SIMPLEGEO BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// k-means clustering
function kmeans() {
  var kmeans = {},
      points = [],
      iterations = 1,
      size = 1;

  kmeans.size = function(x) {
    if (!arguments.length) return size;
    size = x;
    return kmeans;
  };

  kmeans.iterations = function(x) {
    if (!arguments.length) return iterations;
    iterations = x;
    return kmeans;
  };

  kmeans.add = function(x) {
    points.push(x);
    return kmeans;
  };

  kmeans.means = function() {
    var means = [],
        seen = {},
        n = Math.min(size, points.length);

    // Initialize k random (unique!) means.
    for (var i = 0, m = 2 * n; i < m; i++) {
      var p = points[~~(Math.random() * points.length)], id = p.x + "/" + p.y;
      if (!(id in seen)) {
        seen[id] = 1;
        if (means.push({x: p.x, y: p.y}) >= n) break;
      }
    }
    n = means.length;

    // For each iteration, create a kd-tree of the current means.
    for (var j = 0; j < iterations; j++) {
      var kd = kdtree().points(means);

      // Clear the state.
      for (var i = 0; i < n; i++) {
        var mean = means[i];
        mean.sumX = 0;
        mean.sumY = 0;
        mean.size = 0;
        mean.points = [];
        mean.indices = [];
      }

      // Find the mean closest to each point.
      for (var i = 0; i < points.length; i++) {
        var point = points[i], mean = kd.find(point);
        mean.sumX += point.x;
        mean.sumY += point.y;
        mean.size++;
        mean.points.push(point);
        mean.indices.push(i);
      }

      // Compute the new means.
      for (var i = 0; i < n; i++) {
        var mean = means[i];
        if (!mean.size) continue; // overlapping mean
        mean.x = mean.sumX / mean.size;
        mean.y = mean.sumY / mean.size;
      }
    }

    return means;
  };

  return kmeans;
}

// kd-tree
function kdtree() {
  var kdtree = {},
      axes = ["x", "y"],
      root,
      points = [];

  kdtree.axes = function(x) {
    if (!arguments.length) return axes;
    axes = x;
    return kdtree;
  };

  kdtree.points = function(x) {
    if (!arguments.length) return points;
    points = x;
    root = null;
    return kdtree;
  };

  kdtree.find = function(x) {
    return find(kdtree.root(), x, root).point;
  };

  kdtree.root = function(x) {
    return root || (root = node(points, 0));
  };

  function node(points, depth) {
    if (!points.length) return;
    var axis = axes[depth % axes.length], median = points.length >> 1;
    points.sort(order(axis)); // could use random sample to speed up here
    return {
      axis: axis,
      point: points[median],
      left: node(points.slice(0, median), depth + 1),
      right: node(points.slice(median + 1), depth + 1)
    };
  }

  function distance(a, b) {
    var sum = 0;
    for (var i = 0; i < axes.length; i++) {
      var axis = axes[i], d = a[axis] - b[axis];
      sum += d * d;
    }
    return sum;
  }

  function order(axis) {
    return function(a, b) {
      a = a[axis];
      b = b[axis];
      return a < b ? -1 : a > b ? 1 : 0;
    };
  }

  function find(node, point, best) {
    if (distance(node.point, point) < distance(best.point, point)) best = node;
    if (node.left) best = find(node.left, point, best);
    if (node.right) {
      var d = node.point[node.axis] - point[node.axis];
      if (d * d < distance(best.point, point)) best = find(node.right, point, best);
    }
    return best;
  }

  return kdtree;
}
`

kartograph.dorlingLayout = (symbolgroup, iterations=40) ->
    nodes = []
    $.each symbolgroup.symbols, (i, s) ->
        nodes.push
            i: i
            x: s.path.attrs.cx
            y: s.path.attrs.cy
            r: s.path.attrs.r
    nodes.sort (a,b) ->
        b.r - a.r

    apply = () ->
        for n in nodes
            symbolgroup.symbols[n.i].path.attr
                cx: n.x
                cy: n.y
        return

    for r in [1..iterations]  # run 10 times
        for i of nodes
            for j of nodes
                if j > i
                    A = nodes[i]
                    B = nodes[j]
                    if A.x + A.r < B.x - B.r or A.x - A.r > B.x + B.r
                        continue
                    if A.y + A.r < B.y - B.r or A.y - A.r > B.y + B.r
                        continue
                    dx = (A.x - B.x)
                    dy = (A.y - B.y)
                    ds = dx * dx + dy * dy
                    rd = A.r + B.r
                    rs = rd * rd
                    if ds < rs
                        d = Math.sqrt ds
                        f = 10 / d
                        A.x += dx * f * (1-(A.r / rd))
                        A.y += dy * f * (1-(A.r / rd))
                        B.x -= dx * f * (1-(B.r / rd))
                        B.y -= dy * f * (1-(B.r / rd))
                        # overlap! move away from each other
    apply()

