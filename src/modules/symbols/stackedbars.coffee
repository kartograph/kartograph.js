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

`

drawStackedBars = function (cx, cy, w, h, values, labels, colors, stroke) {
    var paper = this,
        chart = this.set();
    function bar(x, y, w, h, params) {
        return paper.rect(x,y,w,h).attr(params);
    }
    var yo = 0,
        total = 0,
        process = function (j) {
            var value = values[j],
                bh = h * value / total,
                x = cx - w*0.5,
                y = cy + h*0.5 - yo,
                bw = w,
                color = colors[j],
                ms = 500,
                delta = 30,
                p = bar(x, y-bh, bw, bh, {fill: color, stroke: stroke, "stroke-width": 1});
            
            yo += bh;
            
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "elastic");
                
            });
            chart.push(p);
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};

`

class StackedBarChart extends kartograph.Symbol
    ###
    usage:
    new SymbolMap({
        map: map,
        radius: 10
        data: [25,75],
        colors: ['red', 'blue'],
        titles: ['red pie', 'blue pie']
    })
    ###
    constructor: (opts) ->
        me = @
        super opts
        me.styles = opts.styles ? ''
        me.colors = opts.colors ? []
        me.titles = opts.titles ? ['','','','','']
        me.values = opts.values ? [] 
        me.width = opts.width ? 17
        me.height = opts.height ? 30
        me.class = opts.class ? 'barchart'
        Raphael.fn.drawStackedBarChart ?= drawStackedBars

    overlaps: (bubble) ->
        me = @
        # check bbox
        [x1,y1,r1] = [me.x, me.y, me.radius]
        [x2,y2,r2] = [bubble.x, bubble.y, bubble.radius]
        return false if x1 - r1 > x2 + r2 or x1 + r1 < x2 - r2 or y1 - r1 > y2 + r2 or y1 + r1 < y2 - r2
        dx = x1-x2
        dy = y1-y2
        if dx*dx+dy*dy > (r1+r2)*(r1+r2)
            return false
        true

    render: (layers) ->
        me = @
        #me.path = me.layers.mapcanvas.circle me.x,me.y,me.radius
        w = me.width
        h = me.height
        x = me.x
        y = me.y
        bg = me.layers.mapcanvas.rect(x-w*0.5-2,y-h*0.5-2,w+4,h+4).attr
            stroke: 'none'
            fill: '#fff'

        me.chart = me.layers.mapcanvas.drawStackedBarChart me.x, me.y, me.width, me.height, me.values, me.titles, me.colors, "none"
        me.chart.push bg

        #me.update()
        #me.map.applyStyles(me.path)
        me

    update: () ->
        me = @
        return
        me.path.attr 
            x: me.x
            y: me.y
            r: me.radius
        path = me.path
        path.node.setAttribute 'style', me.styles[0]
        path.node.setAttribute 'class', me.class
        if me.title?
            path.attr 'title',me.titles[0]
        me
    clear: () ->
        me = @
        for p in me.chart
            p.remove()
        me.chart = []
        me

    nodes: () ->
        me = @
        for el in me.chart
            el.node


StackedBarChart.props = ['values','styles','class','titles','colors','width','height']
StackedBarChart.layers = [] #{ id:'a', type: 'svg' }

root.kartograph.StackedBarChart = StackedBarChart


