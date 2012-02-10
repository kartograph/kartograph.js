(function() {

  /*
      kartograph - a svg mapping library 
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

  var Bubble, HtmlLabel, Icon, SvgLabel, Symbol, SymbolGroup, kartograph, root, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref = root.kartograph) != null ? _ref : root.kartograph = {};

  if ((_ref2 = kartograph.marker) == null) kartograph.marker = {};

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
      var SymbolType, d, i, id, l, layer, me, nid, node, optional, p, required, s, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _o, _ref3, _ref4, _ref5, _ref6, _ref7;
      var _this = this;
      me = this;
      required = ['data', 'location', 'type', 'map'];
      optional = ['filter', 'tooltip', 'layout', 'group', 'click'];
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
      if (__type(me.type) === "string") {
        SymbolType = kartograph[me.type];
      } else {
        SymbolType = me.type;
      }
      if (!(SymbolType != null)) {
        warn('could not resolve symbol type', me.type);
        return;
      }
      _ref3 = SymbolType.props;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        p = _ref3[_k];
        if (opts[p] != null) me[p] = opts[p];
      }
      me.layers = {
        mapcanvas: me.map.paper
      };
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
      me.symbols = [];
      for (i in me.data) {
        d = me.data[i];
        if (__type(me.filter) === "function") {
          if (me.filter(d)) me.addSymbol(d);
        } else {
          me.addSymbol(d);
        }
      }
      me.layoutSymbols();
      _ref5 = me.symbols;
      for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
        s = _ref5[_m];
        s.render();
      }
      if (__type(me.tooltip) === "function") me.initTooltips();
      if (__type(me.click) === "function") {
        _ref6 = me.symbols;
        for (_n = 0, _len6 = _ref6.length; _n < _len6; _n++) {
          s = _ref6[_n];
          _ref7 = s.nodes();
          for (_o = 0, _len7 = _ref7.length; _o < _len7; _o++) {
            node = _ref7[_o];
            node.symbol = s;
            $(node).click(function(e) {
              e.stopPropagation();
              return me.click(e.target.symbol.data);
            });
          }
        }
      }
      me.map.addSymbolGroup(me);
    }

    SymbolGroup.prototype.addSymbol = function(data) {
      /*
      		adds a new symbol to this group
      */
      var SymbolType, ll, me, p, sprops, symbol, _i, _len, _ref3;
      me = this;
      SymbolType = me.type;
      ll = me.evaluate(me.location, data);
      if (__type(ll) === 'array') ll = new kartograph.LonLat(ll[0], ll[1]);
      sprops = {
        layers: me.layers,
        location: ll,
        data: data,
        map: me.map
      };
      _ref3 = SymbolType.props;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        p = _ref3[_i];
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
      if (__type(prop) === 'function') {
        return val = prop(data);
      } else {
        return val = prop;
      }
    };

    SymbolGroup.prototype.layoutSymbols = function() {
      var layer_id, ll, me, path, path_id, s, xy, _i, _len, _ref3, _ref4;
      me = this;
      _ref3 = me.symbols;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        s = _ref3[_i];
        ll = s.location;
        if (__type(ll) === 'string') {
          _ref4 = ll.split('.'), layer_id = _ref4[0], path_id = _ref4[1];
          path = me.map.getLayerPath(layer_id, path_id);
          if (path != null) {
            xy = me.map.viewBC.project(path.path.centroid());
          } else {
            continue;
          }
        } else {
          xy = me.map.lonlat2xy(ll);
        }
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

    SymbolGroup.prototype.initTooltips = function() {
      var cfg, me, node, s, tooltips, tt, _i, _j, _len, _len2, _ref3, _ref4;
      me = this;
      tooltips = me.tooltip;
      _ref3 = me.symbols;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        s = _ref3[_i];
        cfg = {
          position: {
            target: 'mouse',
            viewport: $(window),
            adjust: {
              x: 7,
              y: 7
            }
          },
          show: {
            delay: 20
          },
          content: {}
        };
        tt = tooltips(s.data);
        if (__type(tt) === "string") {
          cfg.content.text = tt;
        } else if (__type(tt) === "array") {
          cfg.content.title = tt[0];
          cfg.content.text = tt[1];
        }
        _ref4 = s.nodes();
        for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
          node = _ref4[_j];
          $(node).qtip(cfg);
        }
      }
    };

    SymbolGroup.prototype.remove = function() {
      var id, layer, me, s, _i, _len, _ref3, _ref4, _results;
      me = this;
      _ref3 = me.symbols;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        s = _ref3[_i];
        s.clear();
      }
      _ref4 = me.layers;
      _results = [];
      for (id in _ref4) {
        layer = _ref4[id];
        if (id !== "mapcanvas") {
          _results.push(layer.remove());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SymbolGroup.prototype.onResize = function() {
      var me, s, _i, _len, _ref3, _results;
      me = this;
      me.layoutSymbols();
      _ref3 = me.symbols;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        s = _ref3[_i];
        _results.push(s.update());
      }
      return _results;
    };

    return SymbolGroup;

  })();

  SymbolGroup._layerid = 0;

  kartograph.SymbolGroup = SymbolGroup;

  Symbol = (function() {

    function Symbol(opts) {
      var me;
      me = this;
      me.location = opts.location;
      me.data = opts.data;
      me.map = opts.map;
      me.layers = opts.layers;
      me.x = opts.x;
      me.y = opts.y;
    }

    Symbol.prototype.init = function() {};

    Symbol.prototype.overlaps = function(symbol) {
      return false;
    };

    Symbol.prototype.nodes = function() {
      return [];
    };

    Symbol.prototype.clear = function() {};

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
      me.map.applyStyles(me.path);
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

    Bubble.prototype.nodes = function() {
      var me;
      me = this;
      return [me.path.node];
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

  kartograph.Bubble = Bubble;

  HtmlLabel = (function() {

    __extends(HtmlLabel, Symbol);

    function HtmlLabel(opts) {
      var me, _ref3, _ref4, _ref5;
      me = this;
      HtmlLabel.__super__.constructor.call(this, opts);
      me.text = (_ref3 = opts.text) != null ? _ref3 : '';
      me.style = (_ref4 = opts.style) != null ? _ref4 : '';
      me["class"] = (_ref5 = opts["class"]) != null ? _ref5 : '';
    }

    HtmlLabel.prototype.render = function(layers) {
      var l, lbl, me;
      me = this;
      l = $('<div>' + me.text + '</div>');
      l.css({
        width: '50px',
        position: 'absolute',
        left: '-25px',
        'text-align': 'center'
      });
      me.lbl = lbl = $('<div class="label" />');
      lbl.append(l);
      me.layers.lbl.append(lbl);
      l.css({
        height: l.height() + 'px',
        top: (l.height() * -.4) + 'px'
      });
      me.update();
      return me;
    };

    HtmlLabel.prototype.update = function() {
      var me;
      me = this;
      return me.lbl.css({
        position: 'absolute',
        left: me.x + 'px',
        top: me.y + 'px'
      });
    };

    HtmlLabel.prototype.clear = function() {
      var me;
      me = this;
      me.lbl.remove();
      return me;
    };

    HtmlLabel.prototype.nodes = function() {
      var me;
      me = this;
      return [me.lbl[0]];
    };

    return HtmlLabel;

  })();

  HtmlLabel.props = ['text', 'style', 'class'];

  HtmlLabel.layers = [
    {
      id: 'lbl',
      type: 'html'
    }
  ];

  kartograph.HtmlLabel = HtmlLabel;

  SvgLabel = (function() {

    __extends(SvgLabel, Symbol);

    function SvgLabel(opts) {
      var me, _ref3, _ref4, _ref5;
      me = this;
      SvgLabel.__super__.constructor.call(this, opts);
      me.text = (_ref3 = opts.text) != null ? _ref3 : '';
      me.style = (_ref4 = opts.style) != null ? _ref4 : '';
      me["class"] = (_ref5 = opts["class"]) != null ? _ref5 : '';
    }

    SvgLabel.prototype.render = function(layers) {
      var lbl, me;
      me = this;
      me.lbl = lbl = me.layers.mapcanvas.text(me.x, me.y, me.text);
      me.update();
      return me;
    };

    SvgLabel.prototype.update = function() {
      var me;
      me = this;
      me.lbl.attr({
        x: me.x,
        y: me.y
      });
      me.lbl.node.setAttribute('style', me.style);
      return me.lbl.node.setAttribute('class', me["class"]);
    };

    SvgLabel.prototype.clear = function() {
      var me;
      me = this;
      me.lbl.remove();
      return me;
    };

    SvgLabel.prototype.nodes = function() {
      var me;
      me = this;
      return [me.lbl.node];
    };

    return SvgLabel;

  })();

  SvgLabel.props = ['text', 'style', 'class'];

  SvgLabel.layers = [];

  kartograph.Label = SvgLabel;

  Icon = (function() {

    __extends(Icon, Symbol);

    function Icon(opts) {
      var me, _ref3, _ref4, _ref5, _ref6, _ref7;
      me = this;
      Icon.__super__.constructor.call(this, opts);
      me.icon = (_ref3 = opts.icon) != null ? _ref3 : '';
      me.offset = (_ref4 = opts.offset) != null ? _ref4 : [0, 0];
      me.iconsize = (_ref5 = opts.iconsize) != null ? _ref5 : [10, 10];
      me["class"] = (_ref6 = opts["class"]) != null ? _ref6 : '';
      me.title = (_ref7 = opts.title) != null ? _ref7 : '';
      console.log(me.iconsize, 'width="' + me.iconsize[0] + '" height="' + me.iconsize[1] + '"');
    }

    Icon.prototype.render = function(layers) {
      var cont, me;
      me = this;
      cont = me.map.container;
      me.img = $('<img />');
      me.img.attr({
        src: me.icon,
        title: me.title,
        alt: me.title,
        width: me.iconsize[0],
        height: me.iconsize[1]
      });
      me.img.addClass(me["class"]);
      me.img.css({
        position: 'absolute',
        'z-index': 1000,
        cursor: 'pointer'
      });
      me.img[0].symbol = me;
      cont.append(me.img);
      return me.update();
    };

    Icon.prototype.update = function() {
      var me;
      me = this;
      return me.img.css({
        left: (me.x + me.offset[0]) + 'px',
        top: (me.y + me.offset[1]) + 'px'
      });
    };

    Icon.prototype.clear = function() {
      var me;
      me = this;
      me.img.remove();
      return me;
    };

    Icon.prototype.nodes = function() {
      var me;
      me = this;
      return [me.img];
    };

    return Icon;

  })();

  Icon.props = ['icon', 'offset', 'class', 'title', 'iconsize'];

  Icon.layers = [];

  kartograph.Icon = Icon;

}).call(this);
