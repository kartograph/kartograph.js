/*
 *  Kartograph - a svg mapping library
 *  Copyright (C) 2011-2013  Gregor Aisch
 *
 *  This library is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU Lesser General Public
 *  License as published by the Free Software Foundation; either
 *  version 2.1 of the License, or (at your option) any later version.
 *
 *  This library is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public
 *  License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
*/


(function() {
  var $, BBox, BlurFilter, Bubble, Circle, CohenSutherland, Filter, GlowFilter, HtmlLabel, Icon, K, Kartograph, LabeledBubble, LatLon, Line, LinearScale, LogScale, LonLat, MapLayer, MapLayerPath, Path, PieChart, QuantileScale, REbraces, REcomment_string, REfull, REmunged, Scale, SqrtScale, StackedBarChart, SvgLabel, Symbol, SymbolGroup, View, drawPieChart, filter, hex2rgb, kartograph, log, map_layer_path_uid, munge, munged, parsedeclarations, resolve, restore, root, uid, warn, __area, __is_clockwise, __point_in_polygon, __type, _base, _base1, _ref, _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = root.$K = (_ref = root.kartograph) != null ? _ref : root.kartograph = {};

  kartograph.version = "0.8.3";

  $ = root.jQuery;

  kartograph.__verbose = false;

  warn = function(s) {
    var e;

    try {
      return console.warn.apply(console, arguments);
    } catch (_error) {
      e = _error;
      try {
        return opera.postError.apply(opera, arguments);
      } catch (_error) {
        e = _error;
        return alert(Array.prototype.join.call(arguments, ' '));
      }
    }
  };

  log = function(s) {
    var e;

    if (kartograph.__verbose) {
      try {
        return console.debug.apply(console, arguments);
      } catch (_error) {
        e = _error;
        try {
          return opera.postError.apply(opera, arguments);
        } catch (_error) {
          e = _error;
          return alert(Array.prototype.join.call(arguments, ' '));
        }
      }
    }
  };

  if ((_ref1 = (_base = String.prototype).trim) == null) {
    _base.trim = function() {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
};

  __type = (function() {
    /*
    for browser-safe type checking+
    ported from jQuery's $.type
    */

    var classToType, name, _i, _len, _ref2;

    classToType = {};
    _ref2 = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      name = _ref2[_i];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    return function(obj) {
      var strType;

      strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object";
    };
  })();

  /*
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
  */


  BBox = (function() {
    /*
    2D bounding box
    */
    function BBox(left, top, width, height) {
      var s;

      if (left == null) {
        left = 0;
      }
      if (top == null) {
        top = 0;
      }
      if (width == null) {
        width = null;
      }
      if (height == null) {
        height = null;
      }
      s = this;
      if (width === null) {
        s.xmin = Number.MAX_VALUE;
        s.xmax = Number.MAX_VALUE * -1;
      } else {
        s.xmin = s.left = left;
        s.xmax = s.right = left + width;
        s.width = width;
      }
      if (height === null) {
        s.ymin = Number.MAX_VALUE;
        s.ymax = Number.MAX_VALUE * -1;
      } else {
        s.ymin = s.top = top;
        s.ymax = s.bottom = height + top;
        s.height = height;
      }
      return;
    }

    BBox.prototype.update = function(x, y) {
      var s;

      if (y == null) {
        y = x[1];
        x = x[0];
      }
      s = this;
      s.xmin = Math.min(s.xmin, x);
      s.ymin = Math.min(s.ymin, y);
      s.xmax = Math.max(s.xmax, x);
      s.ymax = Math.max(s.ymax, y);
      s.left = s.xmin;
      s.top = s.ymin;
      s.right = s.xmax;
      s.bottom = s.ymax;
      s.width = s.xmax - s.xmin;
      s.height = s.ymax - s.ymin;
      return this;
    };

    BBox.prototype.intersects = function(bbox) {
      return bbox.left < s.right && bbox.right > s.left && bbox.top < s.bottom && bbox.bottom > s.top;
    };

    BBox.prototype.inside = function(x, y) {
      var s;

      s = this;
      return x >= s.left && x <= s.right && y >= s.top && y <= s.bottom;
    };

    BBox.prototype.join = function(bbox) {
      var s;

      s = this;
      s.update(bbox.left, bbox.top);
      s.update(bbox.right, bbox.bottom);
      return this;
    };

    return BBox;

  })();

  BBox.fromXML = function(xml) {
    var h, w, x, y;

    x = Number(xml.getAttribute('x'));
    y = Number(xml.getAttribute('y'));
    w = Number(xml.getAttribute('w'));
    h = Number(xml.getAttribute('h'));
    return new kartograph.BBox(x, y, w, h);
  };

  kartograph.BBox = BBox;

  /*
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
  */


  if ((_ref2 = kartograph.geom) == null) {
    kartograph.geom = {};
  }

  if ((_ref3 = (_base1 = kartograph.geom).clipping) == null) {
    _base1.clipping = {};
  }

  CohenSutherland = (function() {
    var BOTTOM, INSIDE, LEFT, RIGHT, TOP;

    function CohenSutherland() {}

    INSIDE = 0;

    LEFT = 1;

    RIGHT = 2;

    BOTTOM = 4;

    TOP = 8;

    CohenSutherland.prototype.compute_out_code = function(bbox, x, y) {
      var code, self;

      self = this;
      code = self.INSIDE;
      if (x < bbox.left) {
        code |= self.LEFT;
      } else if (x > bbox.right) {
        code |= self.RIGHT;
      }
      if (y < bbox.top) {
        code |= self.TOP;
      } else if (y > bbox.bottom) {
        code |= self.BOTTOM;
      }
      return code;
    };

    CohenSutherland.prototype.clip = function(bbox, x0, y0, x1, y1) {
      var accept, code0, code1, cout, self, x, y;

      self = this;
      code0 = self.compute_out_code(bbox, x0, y0);
      code1 = self.compute_out_code(bbox, x1, y1);
      accept = False;
      while (True) {
        if (!(code0 | code1)) {
          accept = True;
          break;
        } else if (code0 & code1) {
          break;
        } else {
          cout = code === 0 ? code1 : code0;
          if (cout & self.TOP) {
            x = x0 + (x1 - x0) * (bbox.top - y0) / (y1 - y0);
            y = bbox.top;
          } else if (cout & self.BOTTOM) {
            x = x0 + (x1 - x0) * (bbox.bottom - y0) / (y1 - y0);
            y = bbox.bottom;
          } else if (cout & self.RIGHT) {
            y = y0 + (y1 - y0) * (bbox.right - x0) / (x1 - x0);
            x = bbox.right;
          } else if (cout & self.LEFT) {
            y = y0 + (y1 - y0) * (bbox.left - x0) / (x1 - x0);
            x = bbox.left;
          }
          if (cout === code0) {
            x0 = x;
            y0 = y;
            code0 = self.compute_out_code(bbox, x0, y0);
          } else {
            x1 = x;
            y1 = y;
            code1 = self.compute_out_code(bbox, x1, y1);
          }
        }
      }
      if (accept) {
        return [x0, y0, x1, y1];
      } else {
        return null;
      }
    };

    return CohenSutherland;

  })();

  kartograph.geom.clipping.CohenSutherland = CohenSutherland;

  /*
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
  */


  Kartograph = (function() {
    function Kartograph(container, width, height) {
      var cnt, me;

      me = this;
      me.container = cnt = $(container);
      if (width == null) {
        width = cnt.width();
      }
      if (height == null) {
        height = cnt.height();
      }
      if (height === 0) {
        height = 'auto';
      }
      me.size = {
        h: height,
        w: width
      };
      me.markers = [];
      me.pathById = {};
      me.container.addClass('kartograph');
    }

    Kartograph.prototype.createSVGLayer = function(id) {
      var about, cnt, lid, me, paper, svg, vp, _ref4;

      me = this;
      if ((_ref4 = me._layerCnt) == null) {
        me._layerCnt = 0;
      }
      lid = me._layerCnt++;
      vp = me.viewport;
      cnt = me.container;
      paper = Raphael(cnt[0], vp.width, vp.height);
      svg = $(paper.canvas);
      svg.css({
        position: 'absolute',
        top: '0px',
        left: '0px',
        'z-index': lid + 5
      });
      if (cnt.css('position') === 'static') {
        cnt.css({
          position: 'relative',
          height: vp.height + 'px'
        });
      }
      svg.addClass(id);
      about = $('desc', paper.canvas).text();
      $('desc', paper.canvas).text(about.replace('with ', 'with kartograph ' + kartograph.version + ' and '));
      return paper;
    };

    Kartograph.prototype.createHTMLLayer = function(id) {
      var cnt, div, lid, me, vp, _ref4;

      me = this;
      vp = me.viewport;
      cnt = me.container;
      if ((_ref4 = me._layerCnt) == null) {
        me._layerCnt = 0;
      }
      lid = me._layerCnt++;
      div = $('<div class="layer ' + id + '" />');
      div.css({
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: vp.width + 'px',
        height: vp.height + 'px',
        'z-index': lid + 5
      });
      cnt.append(div);
      return div;
    };

    Kartograph.prototype.load = function(mapurl, callback, opts) {
      var def, me, _base2, _ref4;

      me = this;
      def = $.Deferred();
      me.clear();
      me.opts = opts != null ? opts : {};
      if ((_ref4 = (_base2 = me.opts).zoom) == null) {
        _base2.zoom = 1;
      }
      me.mapLoadCallback = callback;
      me._loadMapDeferred = def;
      me._lastMapUrl = mapurl;
      if (me.cacheMaps && (kartograph.__mapCache[mapurl] != null)) {
        me._mapLoaded(kartograph.__mapCache[mapurl]);
      } else {
        $.ajax({
          url: mapurl,
          dataType: "text",
          success: me._mapLoaded,
          context: me,
          error: function(a, b, c) {
            return warn(a, b, c);
          }
        });
      }
      return def.promise();
    };

    Kartograph.prototype.loadMap = function() {
      return this.load.apply(this, arguments);
    };

    Kartograph.prototype.setMap = function(svg, opts) {
      var me, _base2, _ref4;

      me = this;
      me.opts = opts != null ? opts : {};
      if ((_ref4 = (_base2 = me.opts).zoom) == null) {
        _base2.zoom = 1;
      }
      me._lastMapUrl = 'string';
      me._mapLoaded(svg);
    };

    Kartograph.prototype._mapLoaded = function(xml) {
      var $view, AB, err, h, halign, me, padding, ratio, valign, vp, w, zoom, _ref4, _ref5, _ref6, _ref7, _ref8;

      me = this;
      if (me.cacheMaps) {
        if ((_ref4 = kartograph.__mapCache) == null) {
          kartograph.__mapCache = {};
        }
        kartograph.__mapCache[me._lastMapUrl] = xml;
      }
      try {
        xml = $(xml);
      } catch (_error) {
        err = _error;
        warn('something went horribly wrong while parsing svg');
        me._loadMapDeferred.reject('could not parse svg');
        return;
      }
      me.svgSrc = xml;
      $view = $('view', xml);
      if (me.paper == null) {
        w = me.size.w;
        h = me.size.h;
        if (h === 'auto') {
          ratio = $view.attr('w') / $view.attr('h');
          h = w / ratio;
        }
        me.viewport = new BBox(0, 0, w, h);
      }
      vp = me.viewport;
      me.viewAB = AB = kartograph.View.fromXML($view[0]);
      padding = (_ref5 = me.opts.padding) != null ? _ref5 : 0;
      halign = (_ref6 = me.opts.halign) != null ? _ref6 : 'center';
      valign = (_ref7 = me.opts.valign) != null ? _ref7 : 'center';
      zoom = (_ref8 = me.opts.zoom) != null ? _ref8 : 1;
      me.viewBC = new kartograph.View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
      me.proj = kartograph.Proj.fromXML($('proj', $view)[0]);
      if (me.mapLoadCallback != null) {
        me.mapLoadCallback(me);
      }
      if (me._loadMapDeferred != null) {
        me._loadMapDeferred.resolve(me);
      }
    };

    Kartograph.prototype.addLayer = function(id, opts) {
      var $paths, chunkSize, iter, layer, layer_id, layer_paper, me, moveOn, nextPaths, path_id, rows, src_id, svgLayer, titles, _ref4, _ref5, _ref6;

      if (opts == null) {
        opts = {};
      }
      /*
      add new layer
      */

      me = this;
      if ((_ref4 = me.layerIds) == null) {
        me.layerIds = [];
      }
      if ((_ref5 = me.layers) == null) {
        me.layers = {};
      }
      if (me.paper == null) {
        me.paper = me.createSVGLayer();
      }
      src_id = id;
      if (__type(opts) === 'object') {
        layer_id = opts.name;
        path_id = opts.key;
        titles = opts.title;
      } else {
        opts = {};
      }
      layer_paper = me.paper;
      if (opts.add_svg_layer) {
        layer_paper = me.createSVGLayer();
      }
      if (layer_id == null) {
        layer_id = src_id;
      }
      svgLayer = $('#' + src_id, me.svgSrc);
      if (svgLayer.length === 0) {
        return;
      }
      layer = new MapLayer(layer_id, path_id, me, opts.filter, layer_paper);
      $paths = $('*', svgLayer[0]);
      rows = $paths.length;
      chunkSize = (_ref6 = opts.chunks) != null ? _ref6 : rows;
      iter = 0;
      nextPaths = function() {
        var base, i, prop, val, _i, _ref7;

        base = chunkSize * iter;
        for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
          if (base + i < rows) {
            layer.addPath($paths.get(base + i), titles);
          }
        }
        if (opts.styles != null) {
          _ref7 = opts.styles;
          for (prop in _ref7) {
            val = _ref7[prop];
            layer.style(prop, val);
          }
        }
        iter++;
        if (iter * chunkSize < rows) {
          return setTimeout(nextPaths, 0);
        } else {
          return moveOn();
        }
      };
      moveOn = function() {
        var checkEvents, evt, _i, _len;

        if (layer.paths.length > 0) {
          me.layers[layer_id] = layer;
          me.layerIds.push(layer_id);
        }
        checkEvents = ['click', 'mouseenter', 'mouseleave', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout'];
        for (_i = 0, _len = checkEvents.length; _i < _len; _i++) {
          evt = checkEvents[_i];
          if (__type(opts[evt]) === 'function') {
            layer.on(evt, opts[evt]);
          }
        }
        if (opts.tooltips != null) {
          layer.tooltips(opts.tooltips);
        }
        if (opts.done != null) {
          return opts.done();
        }
      };
      if (opts.chunks != null) {
        setTimeout(nextPaths, 0);
      } else {
        nextPaths();
      }
      return me;
    };

    Kartograph.prototype.getLayer = function(layer_id) {
      /* returns a map layer
      */

      var me;

      me = this;
      if (me.layers[layer_id] == null) {
        warn('could not find layer ' + layer_id);
        return null;
      }
      return me.layers[layer_id];
    };

    Kartograph.prototype.getLayerPath = function(layer_id, path_id) {
      var layer, me;

      me = this;
      layer = me.getLayer(layer_id);
      if (layer != null) {
        if (__type(path_id) === 'object') {
          return layer.getPaths(path_id)[0];
        } else {
          return layer.getPath(path_id);
        }
      }
      return null;
    };

    Kartograph.prototype.onLayerEvent = function(event, callback, layerId) {
      var me;

      me = this;
      me.getLayer(layerId).on(event, callback);
      return me;
    };

    Kartograph.prototype.addMarker = function(marker) {
      var me, xy;

      me = this;
      me.markers.push(marker);
      xy = me.viewBC.project(me.viewAB.project(me.proj.project(marker.lonlat.lon, marker.lonlat.lat)));
      return marker.render(xy[0], xy[1], me.container, me.paper);
    };

    Kartograph.prototype.clearMarkers = function() {
      var marker, me, _i, _len, _ref4;

      me = this;
      _ref4 = me.markers;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        marker = _ref4[_i];
        marker.clear();
      }
      return me.markers = [];
    };

    Kartograph.prototype.fadeIn = function(opts) {
      var dur, duration, id, layer_id, me, path, paths, _ref4, _ref5, _ref6, _results;

      if (opts == null) {
        opts = {};
      }
      me = this;
      layer_id = (_ref4 = opts.layer) != null ? _ref4 : me.layerIds[me.layerIds.length - 1];
      duration = (_ref5 = opts.duration) != null ? _ref5 : 500;
      _ref6 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref6) {
        paths = _ref6[id];
        _results.push((function() {
          var _i, _len, _results1;

          _results1 = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            path = paths[_i];
            if (__type(duration) === "function") {
              dur = duration(path.data);
            } else {
              dur = duration;
            }
            path.svgPath.attr('opacity', 0);
            _results1.push(path.svgPath.animate({
              opacity: 1
            }, dur));
          }
          return _results1;
        })());
      }
      return _results;
    };

    /*
        end of public API
    */


    Kartograph.prototype.loadCoastline = function() {
      var me;

      me = this;
      return $.ajax({
        url: 'coastline.json',
        success: me.renderCoastline,
        context: me
      });
    };

    Kartograph.prototype.resize = function(w, h) {
      /*
      forces redraw of every layer
      */

      var cnt, halign, id, layer, me, padding, sg, valign, vp, zoom, _i, _len, _ref4, _ref5, _ref6, _ref7, _ref8;

      me = this;
      cnt = me.container;
      if (w == null) {
        w = cnt.width();
      }
      if (h == null) {
        h = cnt.height();
      }
      me.viewport = vp = new kartograph.BBox(0, 0, w, h);
      if (me.paper != null) {
        me.paper.setSize(vp.width, vp.height);
      }
      vp = me.viewport;
      padding = (_ref4 = me.opts.padding) != null ? _ref4 : 0;
      halign = (_ref5 = me.opts.halign) != null ? _ref5 : 'center';
      valign = (_ref6 = me.opts.valign) != null ? _ref6 : 'center';
      zoom = me.opts.zoom;
      me.viewBC = new kartograph.View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
      _ref7 = me.layers;
      for (id in _ref7) {
        layer = _ref7[id];
        layer.setView(me.viewBC);
      }
      if (me.symbolGroups != null) {
        _ref8 = me.symbolGroups;
        for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
          sg = _ref8[_i];
          sg.onResize();
        }
      }
    };

    Kartograph.prototype.lonlat2xy = function(lonlat) {
      var a, me;

      me = this;
      if (lonlat.length === 2) {
        lonlat = new kartograph.LonLat(lonlat[0], lonlat[1]);
      }
      if (lonlat.length === 3) {
        lonlat = new kartograph.LonLat(lonlat[0], lonlat[1], lonlat[2]);
      }
      a = me.proj.project(lonlat.lon, lonlat.lat, lonlat.alt);
      return me.viewBC.project(me.viewAB.project(a));
    };

    Kartograph.prototype.addSymbolGroup = function(symbolgroup) {
      var me, _ref4;

      me = this;
      if ((_ref4 = me.symbolGroups) == null) {
        me.symbolGroups = [];
      }
      return me.symbolGroups.push(symbolgroup);
    };

    Kartograph.prototype.removeSymbols = function(index) {
      var me, sg, _i, _len, _ref4, _results;

      me = this;
      if (index != null) {
        return me.symbolGroups[index].remove();
      } else {
        _ref4 = me.symbolGroups;
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          sg = _ref4[_i];
          _results.push(sg.remove());
        }
        return _results;
      }
    };

    Kartograph.prototype.clear = function() {
      var id, me, sg, _i, _len, _ref4;

      me = this;
      if (me.layers != null) {
        for (id in me.layers) {
          me.layers[id].remove();
        }
        me.layers = {};
        me.layerIds = [];
      }
      if (me.symbolGroups != null) {
        _ref4 = me.symbolGroups;
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          sg = _ref4[_i];
          sg.remove();
        }
        me.symbolGroups = [];
      }
      if (me.paper != null) {
        $(me.paper.canvas).remove();
        return me.paper = void 0;
      }
    };

    Kartograph.prototype.loadCSS = function(url, callback) {
      /*
      loads a stylesheet
      */

      var me;

      me = this;
      if (!Raphael.svg) {
        return $.ajax({
          url: url,
          dataType: 'text',
          success: function(resp) {
            me.styles = kartograph.parsecss(resp);
            return callback();
          },
          error: function(a, b, c) {
            return warn('error while loading ' + url, a, b, c);
          }
        });
      } else {
        $('body').append('<link rel="stylesheet" href="' + url + '" />');
        return callback();
      }
    };

    Kartograph.prototype.applyCSS = function(el, className) {
      /*
      applies pre-loaded css styles to
      raphael elements
      */

      var classes, k, me, p, props, sel, selectors, _i, _j, _len, _len1, _ref4, _ref5, _ref6, _ref7;

      me = this;
      if (me.styles == null) {
        return el;
      }
      if ((_ref4 = me._pathTypes) == null) {
        me._pathTypes = ["path", "circle", "rectangle", "ellipse"];
      }
      if ((_ref5 = me._regardStyles) == null) {
        me._regardStyles = ["fill", "stroke", "fill-opacity", "stroke-width", "stroke-opacity"];
      }
      for (sel in me.styles) {
        p = sel;
        _ref6 = p.split(',');
        for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
          selectors = _ref6[_i];
          p = selectors.split(' ');
          p = p[p.length - 1];
          p = p.split(':');
          if (p.length > 1) {
            continue;
          }
          p = p[0].split('.');
          classes = p.slice(1);
          if (classes.length > 0 && classes.indexOf(className) < 0) {
            continue;
          }
          p = p[0];
          if (me._pathTypes.indexOf(p) >= 0 && p !== el.type) {
            continue;
          }
          props = me.styles[sel];
          _ref7 = me._regardStyles;
          for (_j = 0, _len1 = _ref7.length; _j < _len1; _j++) {
            k = _ref7[_j];
            if (props[k] != null) {
              el.attr(k, props[k]);
            }
          }
        }
      }
      return el;
    };

    Kartograph.prototype.style = function(layer, prop, value, duration, delay) {
      var me;

      me = this;
      layer = me.getLayer(layer);
      if (layer != null) {
        return layer.style(prop, value, duration, delay);
      }
    };

    return Kartograph;

  })();

  K = kartograph;

  root.kartograph = function(container, width, height) {
    return new Kartograph(container, width, height);
  };

  kartograph.map = function(container, width, height) {
    return new Kartograph(container, width, height);
  };

  kartograph.__mapCache = {};

  $.extend(root.kartograph, K);

  /*
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
  */


  LonLat = (function() {
    /*
    	represents a Point
    */
    function LonLat(lon, lat, alt) {
      if (alt == null) {
        alt = 0;
      }
      this.lon = Number(lon);
      this.lat = Number(lat);
      this.alt = Number(alt);
    }

    LonLat.prototype.distance = function(ll) {
      var R, a, c, dLat, dLon, deg2rad, lat1, lat2, me;

      me = this;
      R = 6371;
      deg2rad = Math.PI / 180;
      dLat = (ll.lat - me.lat) * deg2rad;
      dLon = (ll.lon - me.lon) * deg2rad;
      lat1 = me.lat * deg2rad;
      lat2 = ll.lat * deg2rad;
      a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return LonLat;

  })();

  LatLon = (function(_super) {
    __extends(LatLon, _super);

    function LatLon(lat, lon, alt) {
      if (alt == null) {
        alt = 0;
      }
      LatLon.__super__.constructor.call(this, lon, lat, alt);
    }

    return LatLon;

  })(LonLat);

  kartograph.LonLat = LonLat;

  kartograph.LatLon = LatLon;

  /*
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
  */


  MapLayer = (function() {
    function MapLayer(layer_id, path_id, map, filter, paper) {
      var me;

      me = this;
      me.id = layer_id;
      me.path_id = path_id;
      me.paper = paper != null ? paper : map.paper;
      me.view = map.viewBC;
      me.map = map;
      me.filter = filter;
    }

    MapLayer.prototype.addPath = function(svg_path, titles) {
      var layerPath, me, _base2, _name, _ref4, _ref5, _ref6;

      me = this;
      if ((_ref4 = me.paths) == null) {
        me.paths = [];
      }
      layerPath = new MapLayerPath(svg_path, me.id, me, titles);
      if (__type(me.filter) === 'function') {
        if (me.filter(layerPath.data) === false) {
          layerPath.remove();
          return;
        }
      }
      me.paths.push(layerPath);
      if (me.path_id != null) {
        if ((_ref5 = me.pathsById) == null) {
          me.pathsById = {};
        }
        if ((_ref6 = (_base2 = me.pathsById)[_name = layerPath.data[me.path_id]]) == null) {
          _base2[_name] = [];
        }
        return me.pathsById[layerPath.data[me.path_id]].push(layerPath);
      }
    };

    MapLayer.prototype.hasPath = function(id) {
      var me;

      me = this;
      return (me.pathsById != null) && (me.pathsById[id] != null);
    };

    MapLayer.prototype.getPathsData = function() {
      /* returns a list of all shape data dictionaries
      */

      var me, path, pd, _i, _len, _ref4;

      me = this;
      pd = [];
      _ref4 = me.paths;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        path = _ref4[_i];
        pd.push(path.data);
      }
      return pd;
    };

    MapLayer.prototype.getPath = function(id) {
      var me;

      me = this;
      if (me.hasPath(id)) {
        return me.pathsById[id][0];
      }
      return null;
    };

    MapLayer.prototype.getPaths = function(query) {
      var key, match, matches, me, path, _i, _len, _ref4;

      me = this;
      matches = [];
      if (__type(query) === 'object') {
        _ref4 = me.paths;
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          path = _ref4[_i];
          match = true;
          for (key in query) {
            match = match && path.data[key] === query[key];
          }
          if (match) {
            matches.push(path);
          }
        }
      }
      return matches;
    };

    MapLayer.prototype.setView = function(view) {
      /*
      # after resizing of the map, each layer gets a new view
      */

      var me, path, _i, _len, _ref4;

      me = this;
      _ref4 = me.paths;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        path = _ref4[_i];
        path.setView(view);
      }
      return me;
    };

    MapLayer.prototype.remove = function() {
      /*
      removes every path
      */

      var me, path, _i, _len, _ref4, _results;

      me = this;
      _ref4 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        path = _ref4[_i];
        _results.push(path.remove());
      }
      return _results;
    };

    MapLayer.prototype.style = function(props, value, duration, delay) {
      var key, me;

      me = this;
      if (__type(props) === "string") {
        key = props;
        props = {};
        props[key] = value;
      } else if (__type(props) === "object") {
        delay = duration;
        duration = value;
      }
      if (duration == null) {
        duration = 0;
      }
      $.each(me.paths, function(i, path) {
        var anim, attrs, dly, dur, prop, val;

        attrs = {};
        for (prop in props) {
          val = props[prop];
          attrs[prop] = resolve(val, path.data);
        }
        dur = resolve(duration, path.data);
        dly = resolve(delay, path.data);
        if (dly == null) {
          dly = 0;
        }
        if (dur > 0) {
          anim = Raphael.animation(attrs, dur * 1000);
          return path.svgPath.animate(anim.delay(dly * 1000));
        } else {
          if (delay === 0) {
            return setTimeout(function() {
              return path.svgPath.attr(attrs);
            }, 0);
          } else {
            return path.svgPath.attr(attrs);
          }
        }
      });
      return me;
    };

    MapLayer.prototype.on = function(event, callback) {
      var EventContext, ctx, me, path, _i, _len, _ref4;

      me = this;
      EventContext = (function() {
        function EventContext(type, cb, layer) {
          this.type = type;
          this.cb = cb;
          this.layer = layer;
          this.handle = __bind(this.handle, this);
        }

        EventContext.prototype.handle = function(e) {
          var path;

          me = this;
          path = me.layer.map.pathById[e.target.getAttribute('id')];
          return me.cb(path.data, path.svgPath, e);
        };

        return EventContext;

      })();
      ctx = new EventContext(event, callback, me);
      _ref4 = me.paths;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        path = _ref4[_i];
        $(path.svgPath.node).bind(event, ctx.handle);
      }
      return me;
    };

    MapLayer.prototype.tooltips = function(content, delay) {
      var me, path, setTooltip, tt, _i, _len, _ref4;

      me = this;
      setTooltip = function(path, tt) {
        var cfg;

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
            delay: delay != null ? delay : 20
          },
          events: {
            show: function(evt, api) {
              return $('.qtip').filter(function() {
                return this !== api.elements.tooltip.get(0);
              }).hide();
            }
          },
          content: {}
        };
        if (tt != null) {
          if (typeof tt === "string") {
            cfg.content.text = tt;
          } else if ($.isArray(tt)) {
            cfg.content.title = tt[0];
            cfg.content.text = tt[1];
          }
        } else {
          cfg.content.text = 'n/a';
        }
        return $(path.svgPath.node).qtip(cfg);
      };
      _ref4 = me.paths;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        path = _ref4[_i];
        tt = resolve(content, path.data);
        setTooltip(path, tt);
      }
      return me;
    };

    MapLayer.prototype.sort = function(sortBy) {
      var lp, me, path, _i, _len, _ref4;

      me = this;
      me.paths.sort(function(a, b) {
        var av, bv, _ref4;

        av = sortBy(a.data);
        bv = sortBy(b.data);
        if (av === bv) {
          return 0;
        }
        return (_ref4 = av > bv) != null ? _ref4 : {
          1: -1
        };
      });
      lp = false;
      _ref4 = me.paths;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        path = _ref4[_i];
        if (lp) {
          path.svgPath.insertAfter(lp.svgPath);
        }
        lp = path;
      }
      return me;
    };

    return MapLayer;

  })();

  resolve = function(prop, data) {
    if (__type(prop) === 'function') {
      return prop(data);
    }
    return prop;
  };

  map_layer_path_uid = 0;

  /*
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
  */


  MapLayerPath = (function() {
    function MapLayerPath(svg_path, layer_id, layer, titles) {
      var attr, data, i, map, me, paper, path, title, uid, v, view, vn, _i, _ref4;

      me = this;
      paper = layer.paper;
      map = layer.map;
      view = map.viewBC;
      me.path = path = kartograph.geom.Path.fromSVG(svg_path);
      me.vpath = view.projectPath(path);
      me.svgPath = me.vpath.toSVG(paper);
      me.svgPath.data('path', me);
      if (map.styles == null) {
        if (Raphael.svg) {
          me.svgPath.node.setAttribute('class', layer_id);
        }
      } else {
        map.applyCSS(me.svgPath, layer_id);
      }
      uid = 'path_' + map_layer_path_uid++;
      me.svgPath.node.setAttribute('id', uid);
      map.pathById[uid] = me;
      data = {};
      for (i = _i = 0, _ref4 = svg_path.attributes.length - 1; 0 <= _ref4 ? _i <= _ref4 : _i >= _ref4; i = 0 <= _ref4 ? ++_i : --_i) {
        attr = svg_path.attributes[i];
        if (attr.name.substr(0, 5) === "data-") {
          v = attr.value;
          vn = Number(v);
          if (v.trim() !== "" && vn === v && !isNaN(vn)) {
            v = vn;
          }
          data[attr.name.substr(5)] = v;
        }
      }
      me.data = data;
      if (__type(titles) === 'string') {
        title = titles;
      } else if (__type(titles) === 'function') {
        title = titles(data);
      }
      if (title != null) {
        me.svgPath.attr('title', title);
      }
    }

    MapLayerPath.prototype.setView = function(view) {
      var me, path, path_str;

      me = this;
      path = view.projectPath(me.path);
      me.vpath = path;
      if (me.path.type === "path") {
        path_str = path.svgString();
        return me.svgPath.attr({
          path: path_str
        });
      } else if (me.path.type === "circle") {
        return me.svgPath.attr({
          cx: path.x,
          cy: path.y,
          r: path.r
        });
      }
    };

    MapLayerPath.prototype.remove = function() {
      var me;

      me = this;
      return me.svgPath.remove();
    };

    return MapLayerPath;

  })();

  /*
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
  */


  /*
      This is a reduced version of Danial Wachsstocks jQuery based CSS parser
      Everything is removed but the core css-to-object parsing
  
      jQuery based CSS parser
      documentation: http://youngisrael-stl.org/wordpress/2009/01/16/jquery-css-parser/
      Version: 1.3
      Copyright (c) 2011 Daniel Wachsstock
      MIT license:
      Permission is hereby granted, free of charge, to any person
      obtaining a copy of this software and associated documentation
      files (the "Software"), to deal in the Software without
      restriction, including without limitation the rights to use,
      copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the
      Software is furnished to do so, subject to the following
      conditions:
  
      The above copyright notice and this permission notice shall be
      included in all copies or substantial portions of the Software.
  
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
      OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
      NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
      HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
      WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
      OTHER DEALINGS IN THE SOFTWARE.
  */


  kartograph.parsecss = function(str, callback) {
    var css, k, props, ret, v, _i, _len, _ref4;

    ret = {};
    str = munge(str);
    _ref4 = str.split('`b%');
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      css = _ref4[_i];
      css = css.split('%b`');
      if (css.length < 2) {
        continue;
      }
      css[0] = restore(css[0]);
      props = parsedeclarations(css[1]);
      if (ret[css[0]] != null) {
        for (k in props) {
          v = props[k];
          ret[css[0]][k] = v;
        }
      } else {
        ret[css[0]] = props;
      }
    }
    if (__type(callback) === 'function') {
      callback(ret);
    } else {
      return ret;
    }
  };

  munged = {};

  parsedeclarations = function(index) {
    var decl, parsed, str, _i, _len, _ref4;

    str = munged[index].replace(/^{|}$/g, '');
    str = munge(str);
    parsed = {};
    _ref4 = str.split(';');
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      decl = _ref4[_i];
      decl = decl.split(':');
      if (decl.length < 2) {
        continue;
      }
      parsed[restore(decl[0])] = restore(decl.slice(1).join(':'));
    }
    return parsed;
  };

  REbraces = /{[^{}]*}/;

  REfull = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/;

  REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;

  REmunged = /%\w`(\d+)`\w%/;

  uid = 0;

  munge = function(str, full) {
    var RE, match, replacement;

    str = str.replace(REcomment_string, function(s, string) {
      var replacement;

      if (!string) {
        return '';
      }
      replacement = '%s`' + (++uid) + '`s%';
      munged[uid] = string.replace(/^\\/, '');
      return replacement;
    });
    RE = full ? REfull : REbraces;
    while (match = RE.exec(str)) {
      replacement = '%b`' + (++uid) + '`b%';
      munged[uid] = match[0];
      str = str.replace(RE, replacement);
    }
    return str;
  };

  restore = function(str) {
    var match;

    if (str == null) {
      return str;
    }
    while (match = REmunged.exec(str)) {
      str = str.replace(REmunged, munged[match[1]]);
    }
    return str.trim();
  };

  /*
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
  */


  if ((_ref4 = kartograph.geom) == null) {
    kartograph.geom = {};
  }

  Path = (function() {
    /*
    	represents complex polygons (aka multi-polygons)
    */
    function Path(type, contours, closed) {
      var cnt, self, _i, _len;

      if (closed == null) {
        closed = true;
      }
      self = this;
      self.type = type;
      self.contours = [];
      for (_i = 0, _len = contours.length; _i < _len; _i++) {
        cnt = contours[_i];
        if (!__is_clockwise(cnt)) {
          cnt.reverse();
        }
        self.contours.push(cnt);
      }
      self.closed = closed;
    }

    Path.prototype.clipToBBox = function(bbox) {
      throw "path clipping is not implemented yet";
    };

    Path.prototype.toSVG = function(paper) {
      /* translates this path to a SVG path string
      */

      var str;

      str = this.svgString();
      return paper.path(str);
    };

    Path.prototype.svgString = function() {
      var contour, fst, glue, me, str, x, y, _i, _j, _len, _len1, _ref5, _ref6;

      me = this;
      str = "";
      glue = me.closed ? "Z M" : "M";
      _ref5 = me.contours;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        contour = _ref5[_i];
        fst = true;
        str += str === "" ? "M" : glue;
        for (_j = 0, _len1 = contour.length; _j < _len1; _j++) {
          _ref6 = contour[_j], x = _ref6[0], y = _ref6[1];
          if (!fst) {
            str += "L";
          }
          str += x + ',' + y;
          fst = false;
        }
      }
      if (me.closed) {
        str += "Z";
      }
      return str;
    };

    Path.prototype.area = function() {
      var area, cnt, me, _i, _len, _ref5;

      me = this;
      if (me.areas != null) {
        return me._area;
      }
      me.areas = [];
      me._area = 0;
      _ref5 = me.contours;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        cnt = _ref5[_i];
        area = __area(cnt);
        me.areas.push(area);
        me._area += area;
      }
      return me._area;
    };

    Path.prototype.centroid = function() {
      var S, a, area, cnt, cnt_orig, cx, cy, diff, dx, dy, i, j, k, l, len, me, p0, p1, s, sp, total_len, w, x, x_, y, y_, _i, _j, _k, _l, _lengths, _m, _ref5, _ref6, _ref7, _ref8, _ref9;

      me = this;
      if (me._centroid != null) {
        return me._centroid;
      }
      area = me.area();
      cx = cy = 0;
      for (i = _i = 0, _ref5 = me.contours.length - 1; 0 <= _ref5 ? _i <= _ref5 : _i >= _ref5; i = 0 <= _ref5 ? ++_i : --_i) {
        cnt_orig = me.contours[i];
        cnt = [];
        l = cnt_orig.length;
        a = me.areas[i];
        k = a / area;
        if (k === 0) {
          continue;
        }
        for (j = _j = 0, _ref6 = l - 1; 0 <= _ref6 ? _j <= _ref6 : _j >= _ref6; j = 0 <= _ref6 ? ++_j : --_j) {
          p0 = cnt_orig[j];
          p1 = cnt_orig[(j + 1) % l];
          diff = 0;
          cnt.push(p0);
          if (p0[0] === p1[0]) {
            diff = Math.abs(p0[1] - p1[1]);
          }
          if (p0[1] === p1[1]) {
            diff = Math.abs(p0[0] - p1[0]);
          }
          if (diff > 10) {
            S = Math.floor(diff * 2);
            for (s = _k = 1, _ref7 = S - 1; 1 <= _ref7 ? _k <= _ref7 : _k >= _ref7; s = 1 <= _ref7 ? ++_k : --_k) {
              sp = [p0[0] + s / S * (p1[0] - p0[0]), p0[1] + s / S * (p1[1] - p0[1])];
              cnt.push(sp);
            }
          }
        }
        x = y = x_ = y_ = 0;
        l = cnt.length;
        _lengths = [];
        total_len = 0;
        for (j = _l = 0, _ref8 = l - 1; 0 <= _ref8 ? _l <= _ref8 : _l >= _ref8; j = 0 <= _ref8 ? ++_l : --_l) {
          p0 = cnt[j];
          p1 = cnt[(j + 1) % l];
          dx = p1[0] - p0[0];
          dy = p1[1] - p0[1];
          len = Math.sqrt(dx * dx + dy * dy);
          _lengths.push(len);
          total_len += len;
        }
        for (j = _m = 0, _ref9 = l - 1; 0 <= _ref9 ? _m <= _ref9 : _m >= _ref9; j = 0 <= _ref9 ? ++_m : --_m) {
          p0 = cnt[j];
          w = _lengths[j] / total_len;
          x += w * p0[0];
          y += w * p0[1];
        }
        cx += x * k;
        cy += y * k;
      }
      me._centroid = [cx, cy];
      return me._centroid;
    };

    Path.prototype.isInside = function(x, y) {
      var bbox, cnt, i, me, _i, _ref5;

      me = this;
      bbox = me._bbox;
      if (x < bbox[0] || x > bbox[2] || y < bbox[1] || y > bbox[3]) {
        return false;
      }
      for (i = _i = 0, _ref5 = me.contours.length - 1; 0 <= _ref5 ? _i <= _ref5 : _i >= _ref5; i = 0 <= _ref5 ? ++_i : --_i) {
        cnt = me.contours[i];
        if (__point_in_polygon(cnt, [x, y])) {
          return true;
        }
      }
      return false;
    };

    return Path;

  })();

  kartograph.geom.Path = Path;

  Circle = (function(_super) {
    __extends(Circle, _super);

    function Circle(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      Circle.__super__.constructor.call(this, 'circle', null, true);
    }

    Circle.prototype.toSVG = function(paper) {
      var me;

      me = this;
      return paper.circle(me.x, me.y, me.r);
    };

    Circle.prototype.centroid = function() {
      var me;

      me = this;
      return [me.x, me.y];
    };

    Circle.prototype.area = function() {
      var me;

      me = this;
      return Math.PI * me.r * m.r;
    };

    return Circle;

  })(Path);

  kartograph.geom.Circle = Circle;

  Path.fromSVG = function(path) {
    /*
    	loads a path from a SVG path string
    */

    var closed, cmd, contour, contours, cx, cy, path_data, path_str, r, res, sep, type, _i, _len;

    contours = [];
    type = path.nodeName;
    res = null;
    if (type === "path") {
      path_str = path.getAttribute('d').trim();
      path_data = Raphael.parsePathString(path_str);
      closed = path_data[path_data.length - 1] === "Z";
      sep = closed ? "Z M" : "M";
      contour = [];
      for (_i = 0, _len = path_data.length; _i < _len; _i++) {
        cmd = path_data[_i];
        if (cmd.length === 0) {
          continue;
        }
        if (cmd[0] === "M") {
          if (contour.length > 2) {
            contours.push(contour);
            contour = [];
          }
          contour.push([cmd[1], cmd[2]]);
        } else if (cmd[0] === "L") {
          contour.push([cmd[1], cmd[2]]);
        } else if (cmd[0] === "Z") {
          if (contour.length > 2) {
            contours.push(contour);
            contour = [];
          }
        }
      }
      if (contour.length >= 2) {
        contours.push(contour);
        contour = [];
      }
      res = new kartograph.geom.Path(type, contours, closed);
    } else if (type === "circle") {
      cx = path.getAttribute("cx");
      cy = path.getAttribute("cy");
      r = path.getAttribute("r");
      res = new kartograph.geom.Circle(cx, cy, r);
    }
    return res;
  };

  Line = (function() {
    /*
    	represents simple lines
    */
    function Line(points) {
      this.points = points;
    }

    Line.prototype.clipToBBox = function(bbox) {
      var clip, err, i, last_in, lines, p0x, p0y, p1x, p1y, pts, self, x0, x1, y0, y1, _i, _ref5, _ref6, _ref7, _ref8;

      self = this;
      clip = new kartograph.geom.clipping.CohenSutherland().clip;
      pts = [];
      lines = [];
      last_in = false;
      for (i = _i = 0, _ref5 = self.points.length - 2; 0 <= _ref5 ? _i <= _ref5 : _i >= _ref5; i = 0 <= _ref5 ? ++_i : --_i) {
        _ref6 = self.points[i], p0x = _ref6[0], p0y = _ref6[1];
        _ref7 = self.points[i + 1], p1x = _ref7[0], p1y = _ref7[1];
        try {
          _ref8 = clip(bbox, p0x, p0y, p1x, p1y), x0 = _ref8[0], y0 = _ref8[1], x1 = _ref8[2], y1 = _ref8[3];
          last_in = true;
          pts.push([x0, y0]);
          if (p1x !== x1 || p1y !== y0 || i === len(self.points) - 2) {
            pts.push([x1, y1]);
          }
        } catch (_error) {
          err = _error;
          if (last_in && pts.length > 1) {
            lines.push(new Line(pts));
            pts = [];
          }
          last_in = false;
        }
      }
      if (pts.length > 1) {
        lines.push(new Line(pts));
      }
      return lines;
    };

    Line.prototype.toSVG = function() {
      var pts, self, x, y, _i, _len, _ref5, _ref6;

      self = this;
      pts = [];
      _ref5 = self.points;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        _ref6 = _ref5[_i], x = _ref6[0], y = _ref6[1];
        pts.push(x + ',' + y);
      }
      return 'M' + pts.join('L');
    };

    return Line;

  })();

  kartograph.geom.Line = Line;

  __point_in_polygon = function(polygon, p) {
    var angle, atan2, dtheta, i, n, pi, theta1, theta2, twopi, x1, x2, y1, y2, _i, _ref5;

    pi = Math.PI;
    atan2 = Math.atan2;
    twopi = pi * 2;
    n = polygon.length;
    angle = 0;
    for (i = _i = 0, _ref5 = n - 1; 0 <= _ref5 ? _i <= _ref5 : _i >= _ref5; i = 0 <= _ref5 ? ++_i : --_i) {
      x1 = polygon[i][0] - p[0];
      y1 = polygon[i][1] - p[1];
      x2 = polygon[(i + 1) % n][0] - p[0];
      y2 = polygon[(i + 1) % n][1] - p[1];
      theta1 = atan2(y1, x1);
      theta2 = atan2(y2, x2);
      dtheta = theta2 - theta1;
      while (dtheta > pi) {
        dtheta -= twopi;
      }
      while (dtheta < -pi) {
        dtheta += twopi;
      }
      angle += dtheta;
    }
    return Math.abs(angle) >= pi;
  };

  __is_clockwise = function(contour) {
    return __area(contour) > 0;
  };

  __area = function(contour) {
    var i, n, s, x1, x2, y1, y2, _i;

    s = 0;
    n = contour.length;
    for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
      x1 = contour[i][0];
      y1 = contour[i][1];
      x2 = contour[(i + 1) % n][0];
      y2 = contour[(i + 1) % n][1];
      s += x1 * y2 - x2 * y1;
    }
    return s *= 0.5;
  };

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
      GNU General Public License for more detailme.
  
      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */


  View = (function() {
    /*
    	2D coordinate transfomation
    */
    function View(bbox, width, height, padding, halign, valign) {
      var me;

      me = this;
      me.bbox = bbox;
      me.width = width;
      me.padding = padding != null ? padding : 0;
      me.halign = halign != null ? halign : 'center';
      me.valign = valign != null ? valign : 'center';
      me.height = height;
      me.scale = Math.min((width - padding * 2) / bbox.width, (height - padding * 2) / bbox.height);
    }

    View.prototype.project = function(x, y) {
      var bbox, h, me, s, w, xf, yf;

      if (y == null) {
        y = x[1];
        x = x[0];
      }
      me = this;
      s = me.scale;
      bbox = me.bbox;
      h = me.height;
      w = me.width;
      xf = me.halign === "center" ? (w - bbox.width * s) * 0.5 : me.halign === "left" ? me.padding * s : w - (bbox.width - me.padding) * s;
      yf = me.valign === "center" ? (h - bbox.height * s) * 0.5 : me.valign === "top" ? me.padding * s : 0;
      x = (x - bbox.left) * s + xf;
      y = (y - bbox.top) * s + yf;
      return [x, y];
    };

    View.prototype.projectPath = function(path) {
      var bbox, cont, contours, me, new_path, pcont, r, x, y, _i, _j, _len, _len1, _ref5, _ref6, _ref7, _ref8;

      me = this;
      if (path.type === "path") {
        contours = [];
        bbox = [99999, 99999, -99999, -99999];
        _ref5 = path.contours;
        for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
          pcont = _ref5[_i];
          cont = [];
          for (_j = 0, _len1 = pcont.length; _j < _len1; _j++) {
            _ref6 = pcont[_j], x = _ref6[0], y = _ref6[1];
            _ref7 = me.project(x, y), x = _ref7[0], y = _ref7[1];
            cont.push([x, y]);
            bbox[0] = Math.min(bbox[0], x);
            bbox[1] = Math.min(bbox[1], y);
            bbox[2] = Math.max(bbox[2], x);
            bbox[3] = Math.max(bbox[3], y);
          }
          contours.push(cont);
        }
        new_path = new kartograph.geom.Path(path.type, contours, path.closed);
        new_path._bbox = bbox;
        return new_path;
      } else if (path.type === "circle") {
        _ref8 = me.project(path.x, path.y), x = _ref8[0], y = _ref8[1];
        r = path.r * me.scale;
        return new kartograph.geom.Circle(x, y, r);
      }
    };

    View.prototype.asBBox = function() {
      var me;

      me = this;
      return new kartograph.BBox(0, 0, me.width, me.height);
    };

    return View;

  })();

  View.fromXML = function(xml) {
    /*
    	constructs a view from XML
    */

    var bbox, bbox_xml, h, pad, w;

    w = Number(xml.getAttribute('w'));
    h = Number(xml.getAttribute('h'));
    pad = Number(xml.getAttribute('padding'));
    bbox_xml = xml.getElementsByTagName('bbox')[0];
    bbox = BBox.fromXML(bbox_xml);
    return new kartograph.View(bbox, w, h, pad);
  };

  kartograph.View = View;

  /*
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
  */


  Kartograph.prototype.dotgrid = function(opts) {
    var anim, data, data_col, data_key, delay, dly, dotgrid, dotstyle, ds, dur, f, g, gridsize, id, layer, layer_id, me, path, pathData, paths, pd, row, size, sizes, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref5, _ref6, _ref7, _ref8, _ref9;

    me = this;
    layer_id = (_ref5 = opts.layer) != null ? _ref5 : me.layerIds[me.layerIds.length - 1];
    if (!me.layers.hasOwnProperty(layer_id)) {
      warn('dotgrid error: layer "' + layer_id + '" not found');
      return;
    }
    layer = me.layers[layer_id];
    data = opts.data;
    data_col = opts.value;
    data_key = opts.key;
    pathData = {};
    if ((data_key != null) && __type(data) === "array") {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        row = data[_i];
        id = row[data_key];
        pathData[String(id)] = row;
      }
    } else {
      for (id in data) {
        row = data[id];
        pathData[String(id)] = row;
      }
    }
    dotstyle = (_ref6 = opts.style) != null ? _ref6 : {
      fill: 'black',
      stroke: 'none'
    };
    sizes = opts.size;
    gridsize = (_ref7 = opts.gridsize) != null ? _ref7 : 15;
    dotgrid = (_ref8 = layer.dotgrid) != null ? _ref8 : layer.dotgrid = {
      gridsize: gridsize,
      grid: []
    };
    if (dotgrid.gridsize !== gridsize) {
      _ref9 = dotgrid.grid;
      for (_j = 0, _len1 = _ref9.length; _j < _len1; _j++) {
        g = _ref9[_j];
        if (g.shape != null) {
          g.shape.remove();
          g.shape = null;
        }
      }
    }
    if (gridsize > 0) {
      if (dotgrid.grid.length === 0) {
        for (x = _k = 0, _ref10 = me.viewport.width; gridsize > 0 ? _k <= _ref10 : _k >= _ref10; x = _k += gridsize) {
          for (y = _l = 0, _ref11 = me.viewport.height; gridsize > 0 ? _l <= _ref11 : _l >= _ref11; y = _l += gridsize) {
            g = {
              x: x + (Math.random() - 0.5) * gridsize * 0.2,
              y: y + (Math.random() - 0.5) * gridsize * 0.2,
              pathid: false
            };
            f = false;
            _ref12 = layer.pathsById;
            for (id in _ref12) {
              paths = _ref12[id];
              for (_m = 0, _len2 = paths.length; _m < _len2; _m++) {
                path = paths[_m];
                if (path.vpath.isInside(g.x, g.y)) {
                  f = true;
                  pd = (_ref13 = pathData[id]) != null ? _ref13 : null;
                  size = sizes(pd);
                  g.pathid = id;
                  g.shape = layer.paper.circle(g.x, g.y, 1);
                  break;
                }
              }
              if (f) {
                break;
              }
            }
            dotgrid.grid.push(g);
          }
        }
      }
      _ref14 = dotgrid.grid;
      for (_n = 0, _len3 = _ref14.length; _n < _len3; _n++) {
        g = _ref14[_n];
        if (g.pathid) {
          pd = (_ref15 = pathData[g.pathid]) != null ? _ref15 : null;
          size = sizes(pd);
          dur = (_ref16 = opts.duration) != null ? _ref16 : 0;
          delay = (_ref17 = opts.delay) != null ? _ref17 : 0;
          if (__type(delay) === "function") {
            dly = delay(pd);
          } else {
            dly = delay;
          }
          if (dur > 0 && Raphael.svg) {
            anim = Raphael.animation({
              r: size * 0.5
            }, dur);
            g.shape.animate(anim.delay(dly));
          } else {
            g.shape.attr({
              r: size * 0.5
            });
          }
          if (__type(dotstyle) === "function") {
            ds = dotstyle(pd);
          } else {
            ds = dotstyle;
          }
          g.shape.attr(ds);
        }
      }
    }
  };

  /*
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
  */


  filter = (_ref5 = kartograph.filter) != null ? _ref5 : kartograph.filter = {};

  filter.__knownFilter = {};

  filter.__patternFills = 0;

  MapLayer.prototype.SVG = function(el, attr) {
    var key, val;

    if (typeof el === "string") {
      el = window.document.createElementNS("http://www.w3.org/2000/svg", el);
    }
    if (attr) {
      for (key in attr) {
        val = attr[key];
        el.setAttribute(key, val);
      }
    }
    return el;
  };

  Kartograph.prototype.addFilter = function(id, type, params) {
    var doc, fltr, me;

    if (params == null) {
      params = {};
    }
    me = this;
    doc = window.document;
    if (kartograph.filter[type] != null) {
      fltr = new kartograph.filter[type](params).getFilter(id);
    } else {
      throw 'unknown filter type ' + type;
    }
    return me.paper.defs.appendChild(fltr);
  };

  MapLayer.prototype.applyFilter = function(filter_id) {
    var me;

    me = this;
    return $('.' + me.id, me.paper.canvas).attr({
      filter: 'url(#' + filter_id + ')'
    });
  };

  MapLayer.prototype.applyTexture = function(url, filt, defCol) {
    var lp, me, _i, _len, _ref6, _results;

    if (filt == null) {
      filt = false;
    }
    if (defCol == null) {
      defCol = '#000';
    }
    me = this;
    filter.__patternFills += 1;
    _ref6 = me.paths;
    _results = [];
    for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
      lp = _ref6[_i];
      if (!filt || filt(lp.data)) {
        _results.push(lp.svgPath.attr({
          fill: 'url(' + url + ')'
        }));
      } else {
        _results.push(lp.svgPath.attr('fill', defCol));
      }
    }
    return _results;
  };

  Filter = (function() {
    /* base class for all svg filter
    */
    function Filter(params) {
      this.params = params != null ? params : {};
    }

    Filter.prototype.getFilter = function(id) {
      var fltr, me;

      me = this;
      fltr = me.SVG('filter', {
        id: id
      });
      me.buildFilter(fltr);
      return fltr;
    };

    Filter.prototype._getFilter = function() {
      throw "not implemented";
    };

    Filter.prototype.SVG = function(el, attr) {
      var key, val;

      if (typeof el === "string") {
        el = window.document.createElementNS("http://www.w3.org/2000/svg", el);
      }
      if (attr) {
        for (key in attr) {
          val = attr[key];
          el.setAttribute(key, val);
        }
      }
      return el;
    };

    return Filter;

  })();

  BlurFilter = (function(_super) {
    __extends(BlurFilter, _super);

    function BlurFilter() {
      _ref6 = BlurFilter.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    /* simple gaussian blur filter
    */


    BlurFilter.prototype.buildFilter = function(fltr) {
      var SVG, blur, me;

      me = this;
      SVG = me.SVG;
      blur = SVG('feGaussianBlur', {
        stdDeviation: me.params.size || 4,
        result: 'blur'
      });
      return fltr.appendChild(blur);
    };

    return BlurFilter;

  })(Filter);

  filter.blur = BlurFilter;

  hex2rgb = function(hex) {
    var b, g, r, u;

    if (hex.trim().match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      if (hex.length === 4 || hex.length === 7) {
        hex = hex.substr(1);
      }
      if (hex.length === 3) {
        hex = hex.split("");
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      u = parseInt(hex, 16);
      r = u >> 16;
      g = u >> 8 & 0xFF;
      b = u & 0xFF;
      return [r, g, b];
    }
    throw 'unknown color format: "' + hex + '"';
  };

  GlowFilter = (function(_super) {
    __extends(GlowFilter, _super);

    function GlowFilter() {
      _ref7 = GlowFilter.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    /* combined class for outer and inner glow filter
    */


    GlowFilter.prototype.buildFilter = function(fltr) {
      var alpha, blur, inner, knockout, me, rgb, strength, _ref10, _ref11, _ref12, _ref13, _ref8, _ref9;

      me = this;
      blur = (_ref8 = me.params.blur) != null ? _ref8 : 4;
      strength = (_ref9 = me.params.strength) != null ? _ref9 : 1;
      rgb = (_ref10 = me.params.color) != null ? _ref10 : '#D1BEB0';
      if (__type(rgb) === 'string') {
        rgb = hex2rgb(rgb);
      }
      inner = (_ref11 = me.params.inner) != null ? _ref11 : false;
      knockout = (_ref12 = me.params.knockout) != null ? _ref12 : false;
      alpha = (_ref13 = me.params.alpha) != null ? _ref13 : 1;
      if (inner) {
        me.innerGlow(fltr, blur, strength, rgb, alpha, knockout);
      } else {
        me.outerGlow(fltr, blur, strength, rgb, alpha, knockout);
      }
    };

    GlowFilter.prototype.outerGlow = function(fltr, _blur, _strength, rgb, alpha, knockout) {
      var SVG, blur, comp, mat, me, merge, morph;

      me = this;
      SVG = me.SVG;
      mat = SVG('feColorMatrix', {
        "in": 'SourceGraphic',
        type: 'matrix',
        values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0',
        result: 'mask'
      });
      fltr.appendChild(mat);
      if (_strength > 0) {
        morph = SVG('feMorphology', {
          "in": 'mask',
          radius: _strength,
          operator: 'dilate',
          result: 'mask'
        });
        fltr.appendChild(morph);
      }
      mat = SVG('feColorMatrix', {
        "in": 'mask',
        type: 'matrix',
        values: '0 0 0 0 ' + (rgb[0] / 255) + ' 0 0 0 0 ' + (rgb[1] / 255) + ' 0 0 0 0 ' + (rgb[2] / 255) + '  0 0 0 1 0',
        result: 'r0'
      });
      fltr.appendChild(mat);
      blur = SVG('feGaussianBlur', {
        "in": 'r0',
        stdDeviation: _blur,
        result: 'r1'
      });
      fltr.appendChild(blur);
      comp = SVG('feComposite', {
        operator: 'out',
        "in": 'r1',
        in2: 'mask',
        result: 'comp'
      });
      fltr.appendChild(comp);
      merge = SVG('feMerge');
      if (!knockout) {
        merge.appendChild(SVG('feMergeNode', {
          'in': 'SourceGraphic'
        }));
      }
      merge.appendChild(SVG('feMergeNode', {
        'in': 'r1'
      }));
      return fltr.appendChild(merge);
    };

    GlowFilter.prototype.innerGlow = function(fltr, _blur, _strength, rgb, alpha, knockout) {
      var SVG, blur, comp, mat, me, merge, morph;

      me = this;
      SVG = me.SVG;
      log('innerglow');
      mat = SVG('feColorMatrix', {
        "in": 'SourceGraphic',
        type: 'matrix',
        values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 500 0',
        result: 'mask'
      });
      fltr.appendChild(mat);
      morph = SVG('feMorphology', {
        "in": 'mask',
        radius: _strength,
        operator: 'erode',
        result: 'r1'
      });
      fltr.appendChild(morph);
      blur = SVG('feGaussianBlur', {
        "in": 'r1',
        stdDeviation: _blur,
        result: 'r2'
      });
      fltr.appendChild(blur);
      mat = SVG('feColorMatrix', {
        type: 'matrix',
        "in": 'r2',
        values: '1 0 0 0 ' + (rgb[0] / 255) + ' 0 1 0 0 ' + (rgb[1] / 255) + ' 0 0 1 0 ' + (rgb[2] / 255) + ' 0 0 0 -1 1',
        result: 'r3'
      });
      fltr.appendChild(mat);
      comp = SVG('feComposite', {
        operator: 'in',
        "in": 'r3',
        in2: 'mask',
        result: 'comp'
      });
      fltr.appendChild(comp);
      merge = SVG('feMerge');
      if (!knockout) {
        merge.appendChild(SVG('feMergeNode', {
          'in': 'SourceGraphic'
        }));
      }
      merge.appendChild(SVG('feMergeNode', {
        'in': 'comp'
      }));
      return fltr.appendChild(merge);
    };

    return GlowFilter;

  })(Filter);

  filter.glow = GlowFilter;

  /*
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
  */


  Kartograph.prototype.addGeoPath = function(points, cmds, className) {
    var me, path, path_str;

    if (cmds == null) {
      cmds = [];
    }
    if (className == null) {
      className = '';
    }
    /* converts a set of
    */

    me = this;
    path_str = me.getGeoPathStr(points, cmds);
    path = me.paper.path(path_str);
    if (className !== '') {
      path.node.setAttribute('class', className);
    }
    return path;
  };

  Kartograph.prototype.getGeoPathStr = function(points, cmds) {
    var cmd, i, me, path_str, pt, xy, _ref8;

    if (cmds == null) {
      cmds = [];
    }
    /* converts a set of
    */

    me = this;
    if (__type(cmds) === 'string') {
      cmds = cmds.split("");
    }
    if (cmds.length === 0) {
      cmds.push('M');
    }
    path_str = '';
    for (i in points) {
      pt = points[i];
      cmd = (_ref8 = cmds[i]) != null ? _ref8 : 'L';
      xy = me.lonlat2xy(pt);
      if (isNaN(xy[0]) || isNaN(xy[1])) {
        continue;
      }
      path_str += cmd + xy[0] + ',' + xy[1];
    }
    return path_str;
  };

  Kartograph.prototype.addGeoPolygon = function(points, className) {
    /* converts a set of
    */

    var cmds, i, me;

    me = this;
    cmds = ['M'];
    for (i in points) {
      cmds.push('L');
    }
    cmds.push('Z');
    return me.addGeoPath(points, cmds, className);
  };

  /*
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
  */


  Scale = (function() {
    /* scales map values to [0..1]
    */
    function Scale(domain, prop, filter) {
      var i, me, val, values,
        _this = this;

      if (domain == null) {
        domain = [0, 1];
      }
      if (prop == null) {
        prop = null;
      }
      if (filter == null) {
        filter = null;
      }
      this.rangedScale = __bind(this.rangedScale, this);
      this.scale = __bind(this.scale, this);
      me = this;
      values = [];
      for (i in domain) {
        if (__type(filter) === "function") {
          if (filter(domain[i]) === false) {
            continue;
          }
        }
        if (prop != null) {
          if (__type(prop) === "function") {
            val = prop(domain[i]);
          } else {
            val = domain[i][prop];
          }
        } else {
          val = domain[i];
        }
        if (!isNaN(val)) {
          values.push(val);
        }
      }
      values = values.sort(function(a, b) {
        return a - b;
      });
      me.values = values;
      me._range = [0, 1];
      me.rangedScale.range = function(_r) {
        me._range = _r;
        return me.rangedScale;
      };
    }

    Scale.prototype.scale = function(x) {
      return x;
    };

    Scale.prototype.rangedScale = function(x) {
      var me, r;

      me = this;
      x = me.scale(x);
      r = me._range;
      return x * (r[1] - r[0]) + r[0];
    };

    return Scale;

  })();

  LinearScale = (function(_super) {
    __extends(LinearScale, _super);

    function LinearScale() {
      this.scale = __bind(this.scale, this);      _ref8 = LinearScale.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    /* liniear scale
    */


    LinearScale.prototype.scale = function(x) {
      var me, vals;

      me = this;
      vals = me.values;
      return (x - vals[0]) / (vals[vals.length - 1] - vals[0]);
    };

    return LinearScale;

  })(Scale);

  LogScale = (function(_super) {
    __extends(LogScale, _super);

    function LogScale() {
      this.scale = __bind(this.scale, this);      _ref9 = LogScale.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    /* logatithmic scale
    */


    LogScale.prototype.scale = function(x) {
      var me, vals;

      me = this;
      vals = me.values;
      log = Math.log;
      return (log(x) - log(vals[0])) / (log(vals[vals.length - 1]) - log(vals[0]));
    };

    return LogScale;

  })(Scale);

  SqrtScale = (function(_super) {
    __extends(SqrtScale, _super);

    function SqrtScale() {
      this.scale = __bind(this.scale, this);      _ref10 = SqrtScale.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    /* square root scale
    */


    SqrtScale.prototype.scale = function(x) {
      var me, vals;

      me = this;
      vals = me.values;
      return Math.sqrt((x - vals[0]) / (vals[vals.length - 1] - vals[0]));
    };

    return SqrtScale;

  })(Scale);

  QuantileScale = (function(_super) {
    __extends(QuantileScale, _super);

    function QuantileScale() {
      this.scale = __bind(this.scale, this);      _ref11 = QuantileScale.__super__.constructor.apply(this, arguments);
      return _ref11;
    }

    /* quantiles scale
    */


    QuantileScale.prototype.scale = function(x) {
      var i, k, me, nv, v, vals;

      me = this;
      vals = me.values;
      k = vals.length - 1;
      for (i in vals) {
        v = vals[Number(i)];
        nv = vals[Number(i) + 1];
        if (x === v) {
          return i / k;
        }
        if (i < k && x > v && x < nv) {
          return i / k + (x - v) / (nv - v);
        }
      }
    };

    return QuantileScale;

  })(Scale);

  kartograph.scale = {};

  kartograph.scale.identity = function(s) {
    return new Scale(domain, prop, filter).rangedScale;
  };

  kartograph.scale.linear = function(domain, prop, filter) {
    return new LinearScale(domain, prop, filter).rangedScale;
  };

  kartograph.scale.log = function(domain, prop, filter) {
    return new LogScale(domain, prop, filter).rangedScale;
  };

  kartograph.scale.sqrt = function(domain, prop, filter) {
    return new SqrtScale(domain, prop, filter).rangedScale;
  };

  kartograph.scale.quantile = function(domain, prop, filter) {
    return new QuantileScale(domain, prop, filter).rangedScale;
  };

  /*
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
  */


  Symbol = (function() {
    /* base class for all symbols
    */

    var me;

    me = null;

    function Symbol(opts) {
      me = this;
      me.location = opts.location;
      me.data = opts.data;
      me.map = opts.map;
      me.layers = opts.layers;
      me.key = opts.key;
      me.x = opts.x;
      me.y = opts.y;
    }

    Symbol.prototype.init = function() {
      return me;
    };

    Symbol.prototype.overlaps = function(symbol) {
      return false;
    };

    Symbol.prototype.update = function(opts) {
      /* once the data has changed
      */
      return me;
    };

    Symbol.prototype.nodes = function() {
      return [];
    };

    Symbol.prototype.clear = function() {
      return me;
    };

    return Symbol;

  })();

  kartograph.Symbol = Symbol;

  /*
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
  */


  SymbolGroup = (function() {
    /* symbol groups
    
    Usage:
    new $K.SymbolGroup(options);
    map.addSymbols(options)
    */

    var me;

    me = null;

    function SymbolGroup(opts) {
      this._initTooltips = __bind(this._initTooltips, this);
      this._noverlap = __bind(this._noverlap, this);
      this._kMeans = __bind(this._kMeans, this);
      var SymbolType, d, i, id, l, layer, nid, optional, p, required, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref12, _ref13;

      me = this;
      required = ['data', 'location', 'type', 'map'];
      optional = ['filter', 'tooltip', 'click', 'delay', 'sortBy', 'clustering', 'aggregate', 'clusteringOpts', 'mouseenter', 'mouseleave'];
      for (_i = 0, _len = required.length; _i < _len; _i++) {
        p = required[_i];
        if (opts[p] != null) {
          me[p] = opts[p];
        } else {
          throw "SymbolGroup: missing argument '" + p + "'";
        }
      }
      for (_j = 0, _len1 = optional.length; _j < _len1; _j++) {
        p = optional[_j];
        if (opts[p] != null) {
          me[p] = opts[p];
        }
      }
      SymbolType = me.type;
      if (SymbolType == null) {
        warn('could not resolve symbol type', me.type);
        return;
      }
      _ref12 = SymbolType.props;
      for (_k = 0, _len2 = _ref12.length; _k < _len2; _k++) {
        p = _ref12[_k];
        if (opts[p] != null) {
          me[p] = opts[p];
        }
      }
      me.layers = {
        mapcanvas: me.map.paper
      };
      _ref13 = SymbolType.layers;
      for (_l = 0, _len3 = _ref13.length; _l < _len3; _l++) {
        l = _ref13[_l];
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
          if (me.filter(d, i)) {
            me.add(d, i);
          }
        } else {
          me.add(d, i);
        }
      }
      me.layout();
      me.render();
      me.map.addSymbolGroup(me);
    }

    SymbolGroup.prototype.add = function(data, key) {
      /* adds a new symbol to this group
      */

      var SymbolType, ll, p, sprops, symbol, _i, _len, _ref12;

      me = this;
      SymbolType = me.type;
      ll = me._evaluate(me.location, data, key);
      if (__type(ll) === 'array') {
        ll = new kartograph.LonLat(ll[0], ll[1]);
      }
      sprops = {
        layers: me.layers,
        location: ll,
        data: data,
        key: key != null ? key : me.symbols.length,
        map: me.map
      };
      _ref12 = SymbolType.props;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        p = _ref12[_i];
        if (me[p] != null) {
          sprops[p] = me._evaluate(me[p], data, key);
        }
      }
      symbol = new SymbolType(sprops);
      me.symbols.push(symbol);
      return symbol;
    };

    SymbolGroup.prototype.layout = function() {
      var layer_id, ll, path, path_id, s, xy, _i, _len, _ref12, _ref13;

      _ref12 = me.symbols;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        s = _ref12[_i];
        ll = s.location;
        if (__type(ll) === 'string') {
          _ref13 = ll.split('.'), layer_id = _ref13[0], path_id = _ref13[1];
          path = me.map.getLayerPath(layer_id, path_id);
          if (path != null) {
            xy = me.map.viewBC.project(path.path.centroid());
          } else {
            warn('could not find layer path ' + layer_id + '.' + path_id);
            continue;
          }
        } else {
          xy = me.map.lonlat2xy(ll);
        }
        s.x = xy[0];
        s.y = xy[1];
      }
      if (me.clustering === 'k-means') {
        me._kMeans();
      } else if (me.clustering === 'noverlap') {
        me._noverlap();
      }
      return me;
    };

    SymbolGroup.prototype.render = function() {
      var node, s, sortBy, sortDir, _i, _j, _len, _len1, _ref12, _ref13, _ref14;

      me = this;
      if (me.sortBy) {
        sortDir = 'asc';
        if (__type(me.sortBy) === "string") {
          me.sortBy = me.sortBy.split(' ', 2);
          sortBy = me.sortBy[0];
          sortDir = (_ref12 = me.sortBy[1]) != null ? _ref12 : 'asc';
        }
        me.symbols = me.symbols.sort(function(a, b) {
          var m, va, vb;

          if (__type(me.sortBy) === "function") {
            va = me.sortBy(a.data, a);
            vb = me.sortBy(b.data, b);
          } else {
            va = a[sortBy];
            vb = b[sortBy];
          }
          if (va === vb) {
            return 0;
          }
          m = sortDir === 'asc' ? 1 : -1;
          if (va > vb) {
            return 1 * m;
          } else {
            return -1 * m;
          }
        });
      }
      _ref13 = me.symbols;
      for (_i = 0, _len = _ref13.length; _i < _len; _i++) {
        s = _ref13[_i];
        s.render();
        _ref14 = s.nodes();
        for (_j = 0, _len1 = _ref14.length; _j < _len1; _j++) {
          node = _ref14[_j];
          node.symbol = s;
        }
      }
      if (__type(me.tooltip) === "function") {
        me._initTooltips();
      }
      $.each(['click', 'mouseenter', 'mouseleave'], function(i, evt) {
        var _k, _len2, _ref15, _results;

        if (__type(me[evt]) === "function") {
          _ref15 = me.symbols;
          _results = [];
          for (_k = 0, _len2 = _ref15.length; _k < _len2; _k++) {
            s = _ref15[_k];
            _results.push((function() {
              var _l, _len3, _ref16, _results1,
                _this = this;

              _ref16 = s.nodes();
              _results1 = [];
              for (_l = 0, _len3 = _ref16.length; _l < _len3; _l++) {
                node = _ref16[_l];
                _results1.push($(node)[evt](function(e) {
                  var tgt;

                  tgt = e.target;
                  while (!tgt.symbol) {
                    tgt = $(tgt).parent().get(0);
                  }
                  e.stopPropagation();
                  return me[evt](tgt.symbol.data, tgt.symbol, e);
                }));
              }
              return _results1;
            }).call(this));
          }
          return _results;
        }
      });
      return me;
    };

    SymbolGroup.prototype.tooltips = function(cb) {
      me = this;
      me.tooltips = cb;
      me._initTooltips();
      return me;
    };

    SymbolGroup.prototype.remove = function(filter) {
      var error, id, kept, layer, s, _i, _len, _ref12, _ref13, _results;

      me = this;
      kept = [];
      _ref12 = me.symbols;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        s = _ref12[_i];
        if ((filter != null) && !filter(s.data)) {
          kept.push(s);
          continue;
        }
        try {
          s.clear();
        } catch (_error) {
          error = _error;
          warn('error: symbolgroup.remove');
        }
      }
      if (filter == null) {
        _ref13 = me.layers;
        _results = [];
        for (id in _ref13) {
          layer = _ref13[id];
          if (id !== "mapcanvas") {
            _results.push(layer.remove());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        return me.symbols = kept;
      }
    };

    SymbolGroup.prototype._evaluate = function(prop, data, key) {
      /* evaluates a property function or returns a static value
      */

      var val;

      if (__type(prop) === 'function') {
        return val = prop(data, key);
      } else {
        return val = prop;
      }
    };

    SymbolGroup.prototype._kMeans = function() {
      /*
      layouts symbols in this group, eventually adds new 'grouped' symbols
      map.addSymbols({
          layout: "k-means",
          aggregate: function(data) {
              // compresses a list of data objects into a single one
              // typically you want to calculate the mean position, sum value or something here
          }
      })
      */

      var SymbolType, cluster, d, i, mean, means, out, p, s, size, sprops, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref12, _ref13, _ref14, _ref15;

      me = this;
      if ((_ref12 = me.osymbols) == null) {
        me.osymbols = me.symbols;
      }
      SymbolType = me.type;
      if (me.clusteringOpts != null) {
        size = me.clusteringOpts.size;
      }
      if (size == null) {
        size = 64;
      }
      cluster = kmeans().iterations(16).size(size);
      _ref13 = me.osymbols;
      for (_i = 0, _len = _ref13.length; _i < _len; _i++) {
        s = _ref13[_i];
        cluster.add({
          x: s.x,
          y: s.y
        });
      }
      means = cluster.means();
      out = [];
      for (_j = 0, _len1 = means.length; _j < _len1; _j++) {
        mean = means[_j];
        if (mean.size === 0) {
          continue;
        }
        d = [];
        _ref14 = mean.indices;
        for (_k = 0, _len2 = _ref14.length; _k < _len2; _k++) {
          i = _ref14[_k];
          d.push(me.osymbols[i].data);
        }
        d = me.aggregate(d);
        sprops = {
          layers: me.layers,
          location: false,
          data: d,
          map: me.map
        };
        _ref15 = SymbolType.props;
        for (_l = 0, _len3 = _ref15.length; _l < _len3; _l++) {
          p = _ref15[_l];
          if (me[p] != null) {
            sprops[p] = me._evaluate(me[p], d);
          }
        }
        s = new SymbolType(sprops);
        s.x = mean.x;
        s.y = mean.y;
        out.push(s);
      }
      return me.symbols = out;
    };

    SymbolGroup.prototype._noverlap = function() {
      var SymbolType, b0, b1, d, dx, dy, i, intersects, iterations, l, l0, l1, maxRatio, out, p, q, r, r0, r1, rad0, rad1, s, s0, s1, sprops, symbols, t0, t1, tolerance, w, x, y, _i, _j, _k, _l, _len, _len1, _len2, _m, _n, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17;

      me = this;
      if ((_ref12 = me.osymbols) == null) {
        me.osymbols = me.symbols;
      }
      iterations = 3;
      SymbolType = me.type;
      if (__indexOf.call(SymbolType.props, 'radius') < 0) {
        warn('noverlap layout only available for symbols with property "radius"');
        return;
      }
      symbols = me.osymbols.slice();
      if (me.clusteringOpts != null) {
        tolerance = me.clusteringOpts.tolerance;
        maxRatio = me.clusteringOpts.maxRatio;
      }
      if (tolerance == null) {
        tolerance = 0.05;
      }
      if (maxRatio == null) {
        maxRatio = 0.8;
      }
      for (i = _i = 0, _ref13 = iterations - 1; 0 <= _ref13 ? _i <= _ref13 : _i >= _ref13; i = 0 <= _ref13 ? ++_i : --_i) {
        symbols.sort(function(a, b) {
          return b.radius - a.radius;
        });
        l = symbols.length;
        out = [];
        for (p = _j = 0, _ref14 = l - 3; 0 <= _ref14 ? _j <= _ref14 : _j >= _ref14; p = 0 <= _ref14 ? ++_j : --_j) {
          s0 = symbols[p];
          if (!s0) {
            continue;
          }
          rad0 = s0.radius * (1 - tolerance);
          l0 = s0.x - rad0;
          r0 = s0.x + rad0;
          t0 = s0.y - rad0;
          b0 = s0.y + rad0;
          intersects = [];
          for (q = _k = _ref15 = p + 1, _ref16 = l - 2; _ref15 <= _ref16 ? _k <= _ref16 : _k >= _ref16; q = _ref15 <= _ref16 ? ++_k : --_k) {
            s1 = symbols[q];
            if (!s1) {
              continue;
            }
            rad1 = s1.radius;
            l1 = s1.x - rad1;
            r1 = s1.x + rad1;
            t1 = s1.y - rad1;
            b1 = s1.y + rad1;
            if (rad1 / s0.radius < maxRatio) {
              if (!(r0 < l1 || r1 < l0) && !(b0 < t1 || b1 < t0)) {
                dx = s1.x - s0.x;
                dy = s1.y - s0.y;
                if (dx * dx + dy * dy < (rad0 + rad1) * (rad0 + rad1)) {
                  intersects.push(q);
                }
              }
            }
          }
          if (intersects.length > 0) {
            d = [s0.data];
            r = s0.radius * s0.radius;
            for (_l = 0, _len = intersects.length; _l < _len; _l++) {
              i = intersects[_l];
              d.push(symbols[i].data);
              r += symbols[i].radius * symbols[i].radius;
            }
            d = me.aggregate(d);
            sprops = {
              layers: me.layers,
              location: false,
              data: d,
              map: me.map
            };
            _ref17 = SymbolType.props;
            for (_m = 0, _len1 = _ref17.length; _m < _len1; _m++) {
              p = _ref17[_m];
              if (me[p] != null) {
                sprops[p] = me._evaluate(me[p], d);
              }
            }
            s = new SymbolType(sprops);
            w = s0.radius * s0.radius / r;
            x = s0.x * w;
            y = s0.y * w;
            for (_n = 0, _len2 = intersects.length; _n < _len2; _n++) {
              i = intersects[_n];
              s1 = symbols[i];
              w = s1.radius * s1.radius / r;
              x += s1.x * w;
              y += s1.y * w;
              symbols[i] = void 0;
            }
            s.x = x;
            s.y = y;
            symbols[p] = void 0;
            out.push(s);
          } else {
            out.push(s0);
          }
        }
        symbols = out;
      }
      return me.symbols = symbols;
    };

    SymbolGroup.prototype._initTooltips = function() {
      var cfg, node, s, tooltips, tt, _i, _j, _len, _len1, _ref12, _ref13;

      me = this;
      tooltips = me.tooltip;
      _ref12 = me.symbols;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        s = _ref12[_i];
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
          content: {},
          events: {
            show: function(evt, api) {
              return $('.qtip').filter(function() {
                return this !== api.elements.tooltip.get(0);
              }).hide();
            }
          }
        };
        tt = tooltips(s.data, s.key);
        if (__type(tt) === "string") {
          cfg.content.text = tt;
        } else if (__type(tt) === "array") {
          cfg.content.title = tt[0];
          cfg.content.text = tt[1];
        }
        _ref13 = s.nodes();
        for (_j = 0, _len1 = _ref13.length; _j < _len1; _j++) {
          node = _ref13[_j];
          $(node).qtip(cfg);
        }
      }
    };

    SymbolGroup.prototype.onResize = function() {
      var s, _i, _len, _ref12;

      me = this;
      me.layout();
      _ref12 = me.symbols;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        s = _ref12[_i];
        s.update();
      }
    };

    SymbolGroup.prototype.update = function(opts, duration, easing) {
      var p, s, _i, _j, _len, _len1, _ref12, _ref13;

      me = this;
      if (opts == null) {
        opts = {};
      }
      _ref12 = me.symbols;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        s = _ref12[_i];
        _ref13 = me.type.props;
        for (_j = 0, _len1 = _ref13.length; _j < _len1; _j++) {
          p = _ref13[_j];
          if (opts[p] != null) {
            s[p] = me._evaluate(opts[p], s.data);
          } else if (me[p] != null) {
            s[p] = me._evaluate(me[p], s.data);
          }
        }
        s.update(duration, easing);
      }
      return me;
    };

    return SymbolGroup;

  })();

  SymbolGroup._layerid = 0;

  kartograph.SymbolGroup = SymbolGroup;

  Kartograph.prototype.addSymbols = function(opts) {
    opts.map = this;
    return new SymbolGroup(opts);
  };

  
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
;

  kartograph.dorlingLayout = function(symbolgroup, iterations) {
    var A, B, apply, d, ds, dx, dy, f, i, j, nodes, r, rd, rs, _i;

    if (iterations == null) {
      iterations = 40;
    }
    nodes = [];
    $.each(symbolgroup.symbols, function(i, s) {
      return nodes.push({
        i: i,
        x: s.path.attrs.cx,
        y: s.path.attrs.cy,
        r: s.path.attrs.r
      });
    });
    nodes.sort(function(a, b) {
      return b.r - a.r;
    });
    apply = function() {
      var n, _i, _len;

      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        n = nodes[_i];
        symbolgroup.symbols[n.i].path.attr({
          cx: n.x,
          cy: n.y
        });
      }
    };
    for (r = _i = 1; 1 <= iterations ? _i <= iterations : _i >= iterations; r = 1 <= iterations ? ++_i : --_i) {
      for (i in nodes) {
        for (j in nodes) {
          if (j > i) {
            A = nodes[i];
            B = nodes[j];
            if (A.x + A.r < B.x - B.r || A.x - A.r > B.x + B.r) {
              continue;
            }
            if (A.y + A.r < B.y - B.r || A.y - A.r > B.y + B.r) {
              continue;
            }
            dx = A.x - B.x;
            dy = A.y - B.y;
            ds = dx * dx + dy * dy;
            rd = A.r + B.r;
            rs = rd * rd;
            if (ds < rs) {
              d = Math.sqrt(ds);
              f = 10 / d;
              A.x += dx * f * (1 - (A.r / rd));
              A.y += dy * f * (1 - (A.r / rd));
              B.x -= dx * f * (1 - (B.r / rd));
              B.y -= dy * f * (1 - (B.r / rd));
            }
          }
        }
      }
    }
    return apply();
  };

  /*
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
  */


  Bubble = (function(_super) {
    __extends(Bubble, _super);

    function Bubble(opts) {
      this.nodes = __bind(this.nodes, this);
      this.clear = __bind(this.clear, this);
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      this.overlaps = __bind(this.overlaps, this);
      var me, _ref12, _ref13;

      me = this;
      Bubble.__super__.constructor.call(this, opts);
      me.radius = (_ref12 = opts.radius) != null ? _ref12 : 4;
      me.style = opts.style;
      me.attrs = opts.attrs;
      me.title = opts.title;
      me["class"] = (_ref13 = opts["class"]) != null ? _ref13 : 'bubble';
    }

    Bubble.prototype.overlaps = function(bubble) {
      var dx, dy, me, r1, r2, x1, x2, y1, y2, _ref12, _ref13;

      me = this;
      _ref12 = [me.x, me.y, me.radius], x1 = _ref12[0], y1 = _ref12[1], r1 = _ref12[2];
      _ref13 = [bubble.x, bubble.y, bubble.radius], x2 = _ref13[0], y2 = _ref13[1], r2 = _ref13[2];
      if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
        return false;
      }
      dx = x1 - x2;
      dy = y1 - y2;
      if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) {
        return false;
      }
      return true;
    };

    Bubble.prototype.render = function(layers) {
      var me;

      me = this;
      if (me.path == null) {
        me.path = me.layers.mapcanvas.circle(me.x, me.y, me.radius);
      }
      me.update();
      me.map.applyCSS(me.path);
      return me;
    };

    Bubble.prototype.update = function(duration, easing) {
      var attrs, me, path;

      if (duration == null) {
        duration = false;
      }
      if (easing == null) {
        easing = 'expo-out';
      }
      me = this;
      path = me.path;
      attrs = {
        cx: me.x,
        cy: me.y,
        r: me.radius
      };
      if (me.attrs != null) {
        attrs = $.extend(attrs, me.attrs);
      }
      if (!duration) {
        path.attr(attrs);
      } else {
        path.animate(attrs, duration, easing);
      }
      if (path.node != null) {
        if (me.style != null) {
          path.node.setAttribute('style', me.style);
        }
        if (me["class"] != null) {
          path.node.setAttribute('class', me["class"]);
        }
      }
      if (me.title != null) {
        path.attr('title', me.title);
      }
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

  })(Symbol);

  Bubble.props = ['radius', 'style', 'class', 'title', 'attrs'];

  Bubble.layers = [];

  kartograph.Bubble = Bubble;

  /*
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
  */


  Icon = (function(_super) {
    __extends(Icon, _super);

    function Icon(opts) {
      var me, _ref12, _ref13, _ref14, _ref15, _ref16;

      me = this;
      Icon.__super__.constructor.call(this, opts);
      me.icon = (_ref12 = opts.icon) != null ? _ref12 : '';
      me.offset = (_ref13 = opts.offset) != null ? _ref13 : [0, 0];
      me.iconsize = (_ref14 = opts.iconsize) != null ? _ref14 : [10, 10];
      me["class"] = (_ref15 = opts["class"]) != null ? _ref15 : '';
      me.title = (_ref16 = opts.title) != null ? _ref16 : '';
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

  })(kartograph.Symbol);

  Icon.props = ['icon', 'offset', 'class', 'title', 'iconsize'];

  Icon.layers = [];

  kartograph.Icon = Icon;

  /*
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
  */


  SvgLabel = (function(_super) {
    __extends(SvgLabel, _super);

    function SvgLabel(opts) {
      var me, _ref12, _ref13, _ref14, _ref15;

      me = this;
      SvgLabel.__super__.constructor.call(this, opts);
      me.text = (_ref12 = opts.text) != null ? _ref12 : '';
      me.style = (_ref13 = opts.style) != null ? _ref13 : '';
      me["class"] = (_ref14 = opts["class"]) != null ? _ref14 : '';
      me.offset = (_ref15 = opts.offset) != null ? _ref15 : [0, 0];
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
        x: me.x + me.offset[0],
        y: me.y + me.offset[1]
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

  })(kartograph.Symbol);

  SvgLabel.props = ['text', 'style', 'class', 'offset'];

  SvgLabel.layers = [];

  kartograph.Label = SvgLabel;

  HtmlLabel = (function(_super) {
    __extends(HtmlLabel, _super);

    function HtmlLabel(opts) {
      var me, _ref12, _ref13, _ref14;

      me = this;
      HtmlLabel.__super__.constructor.call(this, opts);
      me.text = (_ref12 = opts.text) != null ? _ref12 : '';
      me.css = (_ref13 = opts.css) != null ? _ref13 : '';
      me["class"] = (_ref14 = opts["class"]) != null ? _ref14 : '';
    }

    HtmlLabel.prototype.render = function(layers) {
      var l, lbl, me;

      me = this;
      l = $('<div>' + me.text + '</div>');
      l.css({
        width: '80px',
        position: 'absolute',
        left: '-40px',
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
      me.lbl.css({
        position: 'absolute',
        left: me.x + 'px',
        top: me.y + 'px'
      });
      return me.lbl.css(me.css);
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

  })(kartograph.Symbol);

  HtmlLabel.props = ['text', 'css', 'class'];

  HtmlLabel.layers = [
    {
      id: 'lbl',
      type: 'html'
    }
  ];

  kartograph.HtmlLabel = HtmlLabel;

  /*
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
  */


  LabeledBubble = (function(_super) {
    __extends(LabeledBubble, _super);

    function LabeledBubble(opts) {
      this.nodes = __bind(this.nodes, this);
      this.clear = __bind(this.clear, this);
      this.update = __bind(this.update, this);
      this.render = __bind(this.render, this);
      var me, _ref12, _ref13;

      me = this;
      LabeledBubble.__super__.constructor.call(this, opts);
      me.labelattrs = (_ref12 = opts.labelattrs) != null ? _ref12 : {};
      me.buffer = opts.buffer;
      me.center = (_ref13 = opts.center) != null ? _ref13 : true;
    }

    LabeledBubble.prototype.render = function(layers) {
      var me;

      me = this;
      if ((me.title != null) && String(me.title).trim() !== '') {
        if (me.buffer) {
          me.bufferlabel = me.layers.mapcanvas.text(me.x, me.y, me.title);
        }
        me.label = me.layers.mapcanvas.text(me.x, me.y, me.title);
      }
      LabeledBubble.__super__.render.call(this, layers);
      return me;
    };

    LabeledBubble.prototype.update = function(duration, easing) {
      var attrs, me, vp, x, y;

      if (duration == null) {
        duration = false;
      }
      if (easing == null) {
        easing = 'expo-out';
      }
      me = this;
      LabeledBubble.__super__.update.call(this, duration, easing);
      if (me.label != null) {
        vp = me.map.viewport;
        attrs = $.extend({}, me.labelattrs);
        x = me.x;
        y = me.y;
        if (me.center) {
          y -= 0;
        } else if (x > vp.width * 0.5) {
          attrs['text-anchor'] = 'end';
          x -= me.radius + 5;
        } else if (x < vp.width * 0.5) {
          attrs['text-anchor'] = 'start';
          x += me.radius + 5;
        }
        attrs['x'] = x;
        attrs['y'] = y;
        if (me.buffer) {
          me.bufferlabel.attr(attrs);
          me.bufferlabel.attr({
            stroke: '#fff',
            fill: '#fff',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round',
            'stroke-width': 6
          });
        }
        me.label.attr(attrs);
        me.label.toFront();
      }
      return me;
    };

    LabeledBubble.prototype.clear = function() {
      var me;

      me = this;
      return LabeledBubble.__super__.clear.apply(this, arguments);
    };

    LabeledBubble.prototype.nodes = function() {
      var me, nodes;

      me = this;
      nodes = LabeledBubble.__super__.nodes.apply(this, arguments);
      if (me.label) {
        nodes.push(me.label.node);
      }
      if (me.bufferlabel) {
        nodes.push(me.bufferlabel.node);
      }
      return nodes;
    };

    return LabeledBubble;

  })(Bubble);

  LabeledBubble.props = ['radius', 'style', 'class', 'title', 'labelattrs', 'buffer', 'center', 'attrs'];

  LabeledBubble.layers = [];

  kartograph.LabeledBubble = LabeledBubble;

  /*
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
  */


  PieChart = (function(_super) {
    var me;

    __extends(PieChart, _super);

    /*
    usage:
    new SymbolMap({
        map: map,
        radius: 10
        data: [25,75],
        colors: ['red', 'blue'],
        titles: ['red pie', 'blue pie']
    })
    */


    me = null;

    function PieChart(opts) {
      var _base2, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20;

      me = this;
      PieChart.__super__.constructor.call(this, opts);
      me.radius = (_ref12 = opts.radius) != null ? _ref12 : 4;
      me.styles = (_ref13 = opts.styles) != null ? _ref13 : '';
      me.colors = (_ref14 = opts.colors) != null ? _ref14 : ['#3cc', '#c3c', '#33c', '#cc3'];
      me.titles = (_ref15 = opts.titles) != null ? _ref15 : ['', '', '', '', ''];
      me.values = (_ref16 = opts.values) != null ? _ref16 : [];
      me.border = (_ref17 = opts.border) != null ? _ref17 : false;
      me.borderWidth = (_ref18 = opts.borderWidth) != null ? _ref18 : 2;
      me["class"] = (_ref19 = opts["class"]) != null ? _ref19 : 'piechart';
      if ((_ref20 = (_base2 = Raphael.fn).pieChart) == null) {
        _base2.pieChart = drawPieChart;
      }
    }

    PieChart.prototype.overlaps = function(bubble) {
      var dx, dy, r1, r2, x1, x2, y1, y2, _ref12, _ref13;

      _ref12 = [me.x, me.y, me.radius], x1 = _ref12[0], y1 = _ref12[1], r1 = _ref12[2];
      _ref13 = [bubble.x, bubble.y, bubble.radius], x2 = _ref13[0], y2 = _ref13[1], r2 = _ref13[2];
      if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
        return false;
      }
      dx = x1 - x2;
      dy = y1 - y2;
      if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) {
        return false;
      }
      return true;
    };

    PieChart.prototype.render = function(layers) {
      var bg;

      me = this;
      if (me.border != null) {
        bg = me.layers.mapcanvas.circle(me.x, me.y, me.radius + me.borderWidth).attr({
          stroke: 'none',
          fill: me.border
        });
      }
      me.chart = me.layers.mapcanvas.pieChart(me.x, me.y, me.radius, me.values, me.titles, me.colors, "none");
      me.chart.push(bg);
      return me;
    };

    PieChart.prototype.update = function(opts) {
      var path;

      return;
      me.path.attr({
        x: me.x,
        y: me.y,
        r: me.radius
      });
      path = me.path;
      path.node.setAttribute('style', me.styles[0]);
      path.node.setAttribute('class', me["class"]);
      if (me.title != null) {
        path.attr('title', me.titles[0]);
      }
      return me;
    };

    PieChart.prototype.clear = function() {
      var p, _i, _len, _ref12;

      me = this;
      _ref12 = me.chart;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        p = _ref12[_i];
        p.remove();
      }
      return me;
    };

    PieChart.prototype.nodes = function() {
      var el, _i, _len, _ref12, _results;

      _ref12 = me.chart;
      _results = [];
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        el = _ref12[_i];
        _results.push(el.node);
      }
      return _results;
    };

    return PieChart;

  })(Symbol);

  PieChart.props = ['radius', 'values', 'styles', 'class', 'titles', 'colors', 'border', 'borderWidth'];

  PieChart.layers = [];

  kartograph.PieChart = PieChart;

  /*
  pie chart extension for RaphaelJS
  */


  drawPieChart = function(cx, cy, r, values, labels, colors, stroke) {
    var angle, chart, i, paper, process, rad, sector, total, v, _i, _len;

    if (isNaN(cx) || isNaN(cy) || isNaN(r)) {
      return [];
    }
    paper = this;
    rad = Math.PI / 180;
    chart = paper.set();
    sector = function(cx, cy, r, startAngle, endAngle, params) {
      var x1, x2, y1, y2;

      x1 = cx + r * Math.cos(-startAngle * rad);
      x2 = cx + r * Math.cos(-endAngle * rad);
      y1 = cy + r * Math.sin(-startAngle * rad);
      y2 = cy + r * Math.sin(-endAngle * rad);
      return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    };
    angle = -270;
    total = 0;
    process = function(j) {
      var angleplus, color, delta, ms, p, popangle, value;

      value = values[j];
      angleplus = 360 * value / total;
      popangle = angle + (angleplus * 0.5);
      color = colors[j];
      ms = 500;
      delta = 30;
      p = sector(cx, cy, r, angle, angle + angleplus, {
        fill: color,
        stroke: stroke,
        'stroke-width': 1
      });
      p.mouseover(function() {
        p.stop().animate({
          transform: "s1.1 1.1 " + cx + " " + cy
        }, ms, "elastic");
      });
      p.mouseout(function() {
        p.stop().animate({
          transform: ""
        }, ms, "elastic");
      });
      angle += angleplus;
      chart.push(p);
    };
    for (_i = 0, _len = values.length; _i < _len; _i++) {
      v = values[_i];
      total += v;
    }
    for (i in values) {
      process(i);
    }
    return chart;
  };

  /*
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
  */


  

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

;

  StackedBarChart = (function(_super) {
    __extends(StackedBarChart, _super);

    /*
    usage:
    new SymbolMap({
        map: map,
        radius: 10
        data: [25,75],
        colors: ['red', 'blue'],
        titles: ['red pie', 'blue pie']
    })
    */


    function StackedBarChart(opts) {
      var me, _base2, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19;

      me = this;
      StackedBarChart.__super__.constructor.call(this, opts);
      me.styles = (_ref12 = opts.styles) != null ? _ref12 : '';
      me.colors = (_ref13 = opts.colors) != null ? _ref13 : [];
      me.titles = (_ref14 = opts.titles) != null ? _ref14 : ['', '', '', '', ''];
      me.values = (_ref15 = opts.values) != null ? _ref15 : [];
      me.width = (_ref16 = opts.width) != null ? _ref16 : 17;
      me.height = (_ref17 = opts.height) != null ? _ref17 : 30;
      me["class"] = (_ref18 = opts["class"]) != null ? _ref18 : 'barchart';
      if ((_ref19 = (_base2 = Raphael.fn).drawStackedBarChart) == null) {
        _base2.drawStackedBarChart = drawStackedBars;
      }
    }

    StackedBarChart.prototype.overlaps = function(bubble) {
      var dx, dy, me, r1, r2, x1, x2, y1, y2, _ref12, _ref13;

      me = this;
      _ref12 = [me.x, me.y, me.radius], x1 = _ref12[0], y1 = _ref12[1], r1 = _ref12[2];
      _ref13 = [bubble.x, bubble.y, bubble.radius], x2 = _ref13[0], y2 = _ref13[1], r2 = _ref13[2];
      if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
        return false;
      }
      dx = x1 - x2;
      dy = y1 - y2;
      if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) {
        return false;
      }
      return true;
    };

    StackedBarChart.prototype.render = function(layers) {
      var bg, h, me, w, x, y;

      me = this;
      w = me.width;
      h = me.height;
      x = me.x;
      y = me.y;
      bg = me.layers.mapcanvas.rect(x - w * 0.5 - 2, y - h * 0.5 - 2, w + 4, h + 4).attr({
        stroke: 'none',
        fill: '#fff'
      });
      me.chart = me.layers.mapcanvas.drawStackedBarChart(me.x, me.y, me.width, me.height, me.values, me.titles, me.colors, "none");
      me.chart.push(bg);
      return me;
    };

    StackedBarChart.prototype.update = function() {
      var me, path;

      me = this;
      return;
      me.path.attr({
        x: me.x,
        y: me.y,
        r: me.radius
      });
      path = me.path;
      path.node.setAttribute('style', me.styles[0]);
      path.node.setAttribute('class', me["class"]);
      if (me.title != null) {
        path.attr('title', me.titles[0]);
      }
      return me;
    };

    StackedBarChart.prototype.clear = function() {
      var me, p, _i, _len, _ref12;

      me = this;
      _ref12 = me.chart;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        p = _ref12[_i];
        p.remove();
      }
      me.chart = [];
      return me;
    };

    StackedBarChart.prototype.nodes = function() {
      var el, me, _i, _len, _ref12, _results;

      me = this;
      _ref12 = me.chart;
      _results = [];
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        el = _ref12[_i];
        _results.push(el.node);
      }
      return _results;
    };

    return StackedBarChart;

  })(kartograph.Symbol);

  StackedBarChart.props = ['values', 'styles', 'class', 'titles', 'colors', 'width', 'height'];

  StackedBarChart.layers = [];

  kartograph.StackedBarChart = StackedBarChart;

}).call(this);
