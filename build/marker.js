(function() {

  /*
      svgmap - a simple toolset that helps creating interactive thematic maps
      Copyright (C) 2011  Gregor Aisch
  
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
  */

  var Bubble, BubbleMarker, DotMarker, Icon, IconMarker, LabelMarker, LabeledIconMarker, MapMarker, Symbol, SymbolGroup, root, svgmap, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref = root.svgmap) != null ? _ref : root.svgmap = {};

  if ((_ref2 = svgmap.marker) == null) svgmap.marker = {};

  /*
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
  	type: 'Bubble',
  	radius: function(d) {
  		return Math.sqrt(d.murder/d.pop)*5;
  	},
  	color: '#c00'
  })
  */

  SymbolGroup = (function() {

    function SymbolGroup(opts) {
      var SymbolType, d, id, l, layer, me, nid, optional, p, required, s, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _m, _n, _ref3, _ref4, _ref5, _ref6;
      me = this;
      required = ['data', 'location', 'type', 'map'];
      optional = ['filter', 'tooltips', 'layout', 'group'];
      for (_i = 0, _len = required.length; _i < _len; _i++) {
        p = required[_i];
        if (opts[p] != null) {
          me[p] = opts[p];
        } else {
          throw "SymbolGroup: missing argument " + p;
        }
      }
      for (_j = 0, _len2 = optional.length; _j < _len2; _j++) {
        p = optional[_j];
        if (opts[p] != null) me[p] = opts[p];
      }
      SymbolType = me.type;
      _ref3 = SymbolType.props;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        p = _ref3[_k];
        if (opts[p] != null) me[p] = opts[p];
      }
      me.layers = {};
      _ref4 = SymbolType.layers;
      for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
        l = _ref4[_l];
        nid = SymbolGroup._layerid++;
        id = 'sl_' + nid;
        if (l.type === 'svg') {
          layer = me.map.createSVGLayer(id);
        } else if (l.type === 'html') {
          layer = me.map.createHTMLLayer(id);
        }
        me.layers[l.id] = layer;
      }
      _ref5 = me.data;
      for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
        d = _ref5[_m];
        if (type(me.filter) === "function") {
          if (me.filter(d)) me.addSymbol(d);
        } else {
          me.addSymbol(d);
        }
      }
      me.layoutSymbols();
      _ref6 = me.symbols;
      for (_n = 0, _len6 = _ref6.length; _n < _len6; _n++) {
        s = _ref6[_n];
        s.render();
      }
    }

    SymbolGroup.prototype.addSymbol = function(data) {
      /*
      		adds a new symbol to this group
      */
      var SymbolType, ll, me, p, sprops, symbol, _i, _len, _ref3, _ref4;
      me = this;
      if ((_ref3 = me.symbols) == null) me.symbols = [];
      SymbolType = me.type;
      ll = me.evaluate(me.location, data);
      if (type(ll) === 'array') ll = new svgmap.LonLat(ll[0], ll[1]);
      sprops = {
        layers: me.layers,
        location: ll
      };
      _ref4 = SymbolType.props;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        p = _ref4[_i];
        if (me[p] != null) sprops[p] = me.evaluate(me[p], data);
      }
      symbol = new SymbolType(sprops);
      me.symbols.push(symbol);
      return symbol;
    };

    SymbolGroup.prototype.evaluate = function(prop, data) {
      /*
      		evaluates a property function or returns a static value
      */
      var val;
      if (type(prop) === 'function') {
        return val = prop(data);
      } else {
        return val = prop;
      }
    };

    SymbolGroup.prototype.layoutSymbols = function() {
      var ll, me, s, xy, _i, _len, _ref3;
      me = this;
      _ref3 = me.symbols;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        s = _ref3[_i];
        ll = s.location;
        xy = me.map.lonlat2xy(ll);
        s.x = xy[0];
        s.y = xy[1];
      }
      if (me.layout === 'group') return me.groupLayout();
    };

    SymbolGroup.prototype.groupLayout = function() {
      /*
      		layouts symbols in this group, eventually adds new 'grouped' symbols
      */
      var me, overlap, _ref3;
      me = this;
      if ((_ref3 = me.gsymbols) == null) me.gsymbols = [];
      return overlap = true;
    };

    return SymbolGroup;

  })();

  SymbolGroup._layerid = 0;

  svgmap.SymbolGroup = SymbolGroup;

  Symbol = (function() {

    function Symbol(opts) {
      var me;
      me = this;
      me.location = opts.location;
      me.data = opts.data;
      me.layers = opts.layers;
      me.x = opts.x;
      me.y = opts.y;
    }

    Symbol.prototype.init = function() {};

    Symbol.prototype.overlaps = function(symbol) {
      return false;
    };

    return Symbol;

  })();

  Bubble = (function() {

    __extends(Bubble, Symbol);

    function Bubble(opts) {
      var me, _ref3, _ref4, _ref5;
      me = this;
      Bubble.__super__.constructor.call(this, opts);
      me.radius = (_ref3 = opts.radius) != null ? _ref3 : 4;
      me.style = (_ref4 = opts.style) != null ? _ref4 : '';
      me["class"] = (_ref5 = opts["class"]) != null ? _ref5 : '';
    }

    Bubble.prototype.overlaps = function(bubble) {
      var dx, dy, me, r1, r2, x1, x2, y1, y2, _ref3, _ref4;
      me = this;
      _ref3 = [me.x, me.y, me.radius], x1 = _ref3[0], y1 = _ref3[1], r1 = _ref3[2];
      _ref4 = [bubble.x, bubble.y, bubble.radius], x2 = _ref4[0], y2 = _ref4[1], r2 = _ref4[2];
      if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
        return false;
      }
      dx = x1 - x2;
      dy = y1 - y2;
      if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) return false;
      return true;
    };

    Bubble.prototype.render = function(layers) {
      var me;
      me = this;
      me.path = me.layers.a.circle(me.x, me.y, me.radius);
      me.update();
      return me;
    };

    Bubble.prototype.update = function() {
      var me, path;
      me = this;
      me.path.attr({
        x: me.x,
        y: me.y,
        r: me.radius
      });
      path = me.path;
      path.node.setAttribute('style', me.style);
      path.node.setAttribute('class', me["class"]);
      return me;
    };

    Bubble.prototype.clear = function() {
      var me;
      me = this;
      me.path.remove();
      return me;
    };

    return Bubble;

  })();

  Bubble.props = ['radius', 'style', 'class'];

  Bubble.layers = [
    {
      id: 'a',
      type: 'svg'
    }
  ];

  svgmap.Bubble = Bubble;

  Icon = (function() {

    __extends(Icon, Symbol);

    function Icon() {
      Icon.__super__.constructor.apply(this, arguments);
    }

    return Icon;

  })();

  Icon.props = ['icon'];

  Icon.layer = ['html'];

  MapMarker = (function() {

    function MapMarker(ll) {
      /*
      		lonlat - LonLat instance
      		content - html code that will be placed inside a <div class="marker"> which then will be positioned at the corresponding map position
      		offset - x and y offset for the marker
      */
      var me;
      me = this;
      if (ll.length === 2) ll = new svgmap.LonLat(ll[0], ll[1]);
      me.lonlat = ll;
      me.visible = true;
    }

    MapMarker.prototype.render = function(x, y, cont, paper) {
      /*
      		this function will be called by svgmap to render the marker
      */
    };

    return MapMarker;

  })();

  svgmap.marker.MapMarker = MapMarker;

  LabelMarker = (function() {

    __extends(LabelMarker, MapMarker);

    /*
    	a simple label
    */

    function LabelMarker(ll, label) {
      LabelMarker.__super__.constructor.call(this, ll);
      this.label = label;
    }

    return LabelMarker;

  })();

  svgmap.marker.LabelMarker = LabelMarker;

  DotMarker = (function() {

    __extends(DotMarker, LabelMarker);

    function DotMarker(ll, label, rad, color) {
      if (color == null) color = null;
      DotMarker.__super__.constructor.call(this, ll, label);
      this.rad = rad;
      this.color = color;
    }

    DotMarker.prototype.render = function(x, y, cont, paper) {
      var me, node;
      me = this;
      me.path = paper.circle(x, y, this.rad);
      node = me.path.node;
      node.setAttribute('class', 'dotMarker');
      node.setAttribute('title', this.label);
      if (this.color != null) {
        return node.setAttribute('style', 'fill:' + this.color);
      }
    };

    DotMarker.prototype.clear = function() {
      return this.path.remove();
    };

    return DotMarker;

  })();

  svgmap.marker.DotMarker = DotMarker;

  IconMarker = (function() {

    __extends(IconMarker, MapMarker);

    /*
    */

    function IconMarker(ll, icon) {}

    return IconMarker;

  })();

  svgmap.marker.IconMarker = IconMarker;

  LabeledIconMarker = (function() {

    __extends(LabeledIconMarker, MapMarker);

    function LabeledIconMarker(params) {
      var me, _ref3, _ref4, _ref5;
      me = this;
      LabeledIconMarker.__super__.constructor.call(this, params.ll);
      me.icon_src = params.icon;
      me.label_txt = params.label;
      me.className = (_ref3 = params.className) != null ? _ref3 : 'marker';
      me.dx = (_ref4 = params.dx) != null ? _ref4 : 0;
      me.dy = (_ref5 = params.dy) != null ? _ref5 : 0;
    }

    LabeledIconMarker.prototype.render = function(x, y, cont, paper) {
      var me;
      me = this;
      if (!me.markerDiv) {
        me.icon = $('<img src="' + me.icon_src + '" class="icon"/>');
        me.label = $('<div class="label">' + me.label_txt + '</div>');
        me.markerDiv = $('<div class="' + me.className + '" />');
        me.markerDiv.append(me.icon);
        me.markerDiv.append(me.label);
        cont.append(me.markerDiv);
      }
      return me.markerDiv.css({
        position: 'absolute',
        left: (x + me.dx) + 'px',
        top: (y + me.dy) + 'px'
      });
    };

    return LabeledIconMarker;

  })();

  svgmap.marker.LabeledIconMarker = LabeledIconMarker;

  BubbleMarker = (function() {

    __extends(BubbleMarker, MapMarker);

    /*
    	will display a bubble centered on the marker position
    */

    function BubbleMarker(ll, size, cssClass) {
      if (cssClass == null) cssClass = 'bubble';
      BubbleMarker.__super__.constructor.call(this, ll);
    }

    return BubbleMarker;

  })();

}).call(this);
