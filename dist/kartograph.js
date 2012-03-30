/*!
 *
 *    kartograph - a svg mapping library 
 *    Copyright (C) 2011,2012  Gregor Aisch
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 
 */


(function() {

  /*
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
  */

  var Aitoff, Azimuthal, BBox, Balthasart, Behrmann, BlurFilter, Bubble, CEA, CantersModifiedSinusoidalI, Circle, CohenSutherland, Conic, Cylindrical, EckertIV, EquidistantAzimuthal, Equirectangular, Filter, GallPeters, GlowFilter, GoodeHomolosine, Hatano, HoboDyer, HtmlLabel, Icon, Kartograph, LAEA, LCC, LatLon, Line, LinearScale, LogScale, LonLat, Loximuthal, MapLayer, MapLayerPath, Mercator, Mollweide, NaturalEarth, Nicolosi, Orthographic, PanAndZoomControl, Path, PieChart, Proj, PseudoConic, PseudoCylindrical, QuantileScale, REbraces, REcomment_string, REfull, REmunged, Robinson, Satellite, Scale, Sinusoidal, StackedBarChart, Stereographic, SvgLabel, Symbol, SymbolGroup, View, WagnerIV, WagnerV, Winkel3, drawPieChart, filter, kartograph, log, map_layer_path_uid, munge, munged, parsedeclarations, restore, root, uid, warn, __point_in_polygon, __proj, __type, __verbose__, _base, _base2, _ref, _ref10, _ref11, _ref12, _ref13, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = root.$K = (_ref = root.kartograph) != null ? _ref : root.kartograph = {};

  kartograph.version = "0.1.6";

  __verbose__ = false && (typeof console !== "undefined" && console !== null);

  warn = function(s) {
    if (__verbose__) {
      return console.warn('kartograph (' + kartograph.version + '): ', s);
    }
  };

  log = function(s) {
    if (__verbose__) {
      return console.log('kartograph (' + kartograph.version + '): ', s);
    }
  };

  if ((_ref2 = (_base = String.prototype).trim) == null) {
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
    var classToType, name, _i, _len, _ref3;
    classToType = {};
    _ref3 = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      name = _ref3[_i];
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

  BBox = (function() {

    /*
        2D bounding box
    */

    function BBox(left, top, width, height) {
      var s;
      if (left == null) left = 0;
      if (top == null) top = 0;
      if (width == null) width = null;
      if (height == null) height = null;
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
      if (!(y != null)) {
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

  if ((_ref3 = kartograph.geom) == null) kartograph.geom = {};

  if ((_ref4 = (_base2 = kartograph.geom).clipping) == null) _base2.clipping = {};

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

  Kartograph = (function() {

    function Kartograph(container, width, height) {
      var cnt, me;
      me = this;
      me.container = cnt = $(container);
      if (width == null) width = cnt.width();
      if (height == null) height = cnt.height();
      if (height === 0) height = width * .5;
      me.viewport = new BBox(0, 0, width, height);
      me.paper = me.createSVGLayer();
      me.markers = [];
      me.pathById = {};
      me.container.addClass('kartograph');
    }

    Kartograph.prototype.createSVGLayer = function(id) {
      var about, cnt, lid, me, paper, svg, vp, _ref5;
      me = this;
      if ((_ref5 = me._layerCnt) == null) me._layerCnt = 0;
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
      var cnt, div, lid, me, vp, _ref5;
      me = this;
      vp = me.viewport;
      cnt = me.container;
      if ((_ref5 = me._layerCnt) == null) me._layerCnt = 0;
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

    Kartograph.prototype.loadMap = function(mapurl, callback, opts) {
      var me, _base3, _ref5;
      me = this;
      me.clear();
      me.opts = opts != null ? opts : {};
      if ((_ref5 = (_base3 = me.opts).zoom) == null) _base3.zoom = 1;
      me.mapLoadCallback = callback;
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
    };

    Kartograph.prototype._mapLoaded = function(xml) {
      var $view, AB, halign, me, padding, valign, vp, _ref5, _ref6, _ref7, _ref8;
      me = this;
      if (me.cacheMaps) {
        if ((_ref5 = kartograph.__mapCache) == null) kartograph.__mapCache = {};
        kartograph.__mapCache[me._lastMapUrl] = xml;
      }
      try {
        xml = $(xml);
      } catch (err) {
        warn('something went horribly wrong while parsing svg');
        return;
      }
      me.svgSrc = xml;
      vp = me.viewport;
      $view = $('view', xml)[0];
      me.viewAB = AB = kartograph.View.fromXML($view);
      padding = (_ref6 = me.opts.padding) != null ? _ref6 : 0;
      halign = (_ref7 = me.opts.halign) != null ? _ref7 : 'center';
      valign = (_ref8 = me.opts.valign) != null ? _ref8 : 'center';
      me.viewBC = new kartograph.View(AB.asBBox(), vp.width, vp.height, padding, halign, valign);
      me.proj = kartograph.Proj.fromXML($('proj', $view)[0]);
      return me.mapLoadCallback(me);
    };

    Kartograph.prototype.addLayer = function(src_id, layer_id, path_id) {
      /*
              add new layer
      */
      var $paths, checkEvents, evt, layer, me, opts, svgLayer, svg_path, titles, _i, _j, _len, _len2, _ref5, _ref6;
      me = this;
      if ((_ref5 = me.layerIds) == null) me.layerIds = [];
      if ((_ref6 = me.layers) == null) me.layers = {};
      if (__type(src_id) === 'object') {
        opts = src_id;
        src_id = opts.id;
        layer_id = opts.className;
        path_id = opts.key;
        titles = opts.title;
      } else {
        opts = {};
      }
      if (layer_id == null) layer_id = src_id;
      svgLayer = $('#' + src_id, me.svgSrc);
      if (svgLayer.length === 0) return;
      layer = new MapLayer(layer_id, path_id, me, opts.filter);
      $paths = $('*', svgLayer[0]);
      for (_i = 0, _len = $paths.length; _i < _len; _i++) {
        svg_path = $paths[_i];
        layer.addPath(svg_path, titles);
      }
      if (layer.paths.length > 0) {
        me.layers[layer_id] = layer;
        me.layerIds.push(layer_id);
      }
      checkEvents = ['click'];
      for (_j = 0, _len2 = checkEvents.length; _j < _len2; _j++) {
        evt = checkEvents[_j];
        if (__type(opts[evt]) === 'function') {
          me.onLayerEvent(evt, opts[evt], layer_id);
        }
      }
      if (opts.tooltip != null) me.tooltips(opts.tooltip);
      return me;
    };

    Kartograph.prototype.getLayer = function(layer_id) {
      /* returns a map layer
      */
      var me;
      me = this;
      if (!(me.layers[layer_id] != null)) warn('could not find layer ' + layer_id);
      return me.layers[layer_id];
    };

    Kartograph.prototype.getLayerPath = function(layer_id, path_id) {
      var me;
      me = this;
      if ((me.layers[layer_id] != null) && me.layers[layer_id].hasPath(path_id)) {
        return me.layers[layer_id].getPath(path_id);
      }
      return null;
    };

    Kartograph.prototype.onLayerEvent = function(event, callback, layerId) {
      var EventContext, ctx, me, path, paths, _i, _len, _results;
      me = this;
      me;
      if (layerId == null) layerId = me.layerIds[me.layerIds.length - 1];
      EventContext = (function() {

        function EventContext(type, cb, map) {
          this.type = type;
          this.cb = cb;
          this.map = map;
          this.handle = __bind(this.handle, this);
        }

        EventContext.prototype.handle = function(e) {
          var path;
          me = this;
          path = me.map.pathById[e.target.getAttribute('id')];
          return me.cb(path.data);
        };

        return EventContext;

      })();
      ctx = new EventContext(event, callback, me);
      if (me.layers[layerId] != null) {
        paths = me.layers[layerId].paths;
        _results = [];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          _results.push($(path.svgPath.node).bind(event, ctx.handle));
        }
        return _results;
      }
    };

    Kartograph.prototype.addMarker = function(marker) {
      var me, xy;
      me = this;
      me.markers.push(marker);
      xy = me.viewBC.project(me.viewAB.project(me.proj.project(marker.lonlat.lon, marker.lonlat.lat)));
      return marker.render(xy[0], xy[1], me.container, me.paper);
    };

    Kartograph.prototype.clearMarkers = function() {
      var marker, me, _i, _len, _ref5;
      me = this;
      _ref5 = me.markers;
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        marker = _ref5[_i];
        marker.clear();
      }
      return me.markers = [];
    };

    Kartograph.prototype.tooltips = function(opts) {
      var cfg, id, layer_id, me, path, paths, tooltips, tt, _ref5, _ref6, _results;
      me = this;
      tooltips = opts.content;
      layer_id = (_ref5 = opts.layer) != null ? _ref5 : me.layerIds[me.layerIds.length - 1];
      if (!me.layers.hasOwnProperty(layer_id)) {
        warn('tooltips error: layer "' + layer_id + '" not found');
        return;
      }
      _ref6 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref6) {
        paths = _ref6[id];
        _results.push((function() {
          var _i, _len, _ref7, _results2;
          _results2 = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            path = paths[_i];
            if ($.isFunction(tooltips)) {
              tt = tooltips(id, path);
            } else {
              tt = tooltips[id];
            }
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
                delay: (_ref7 = opts.delay) != null ? _ref7 : 20
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
            _results2.push($(path.svgPath.node).qtip(cfg));
          }
          return _results2;
        })());
      }
      return _results;
    };

    Kartograph.prototype.fadeIn = function(opts) {
      var dur, duration, id, layer_id, me, path, paths, _ref5, _ref6, _ref7, _results;
      if (opts == null) opts = {};
      me = this;
      layer_id = (_ref5 = opts.layer) != null ? _ref5 : me.layerIds[me.layerIds.length - 1];
      duration = (_ref6 = opts.duration) != null ? _ref6 : 500;
      _ref7 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref7) {
        paths = _ref7[id];
        _results.push((function() {
          var _i, _len, _results2;
          _results2 = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            path = paths[_i];
            if (__type(duration) === "function") {
              dur = duration(path.data);
            } else {
              dur = duration;
            }
            path.svgPath.attr('opacity', 0);
            _results2.push(path.svgPath.animate({
              opacity: 1
            }, dur));
          }
          return _results2;
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
      var cnt, halign, id, layer, me, padding, sg, valign, vp, zoom, _i, _len, _ref5, _ref6, _ref7, _ref8, _ref9;
      me = this;
      cnt = me.container;
      if (w == null) w = cnt.width();
      if (h == null) h = cnt.height();
      me.viewport = vp = new kartograph.BBox(0, 0, w, h);
      me.paper.setSize(vp.width, vp.height);
      vp = me.viewport;
      padding = (_ref5 = me.opts.padding) != null ? _ref5 : 0;
      halign = (_ref6 = me.opts.halign) != null ? _ref6 : 'center';
      valign = (_ref7 = me.opts.valign) != null ? _ref7 : 'center';
      zoom = me.opts.zoom;
      me.viewBC = new kartograph.View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
      _ref8 = me.layers;
      for (id in _ref8) {
        layer = _ref8[id];
        layer.setView(me.viewBC);
      }
      if (me.symbolGroups != null) {
        _ref9 = me.symbolGroups;
        for (_i = 0, _len = _ref9.length; _i < _len; _i++) {
          sg = _ref9[_i];
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

    Kartograph.prototype.showZoomControls = function() {
      var me;
      me = this;
      me.zc = new PanAndZoomControl(me);
      return me;
    };

    Kartograph.prototype.addSymbolGroup = function(symbolgroup) {
      var me, _ref5;
      me = this;
      if ((_ref5 = me.symbolGroups) == null) me.symbolGroups = [];
      return me.symbolGroups.push(symbolgroup);
    };

    Kartograph.prototype.clear = function() {
      var id, me, sg, _i, _len, _ref5;
      me = this;
      if (me.layers != null) {
        for (id in me.layers) {
          me.layers[id].remove();
        }
        me.layers = {};
        me.layerIds = [];
      }
      if (me.symbolGroups != null) {
        _ref5 = me.symbolGroups;
        for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
          sg = _ref5[_i];
          sg.remove();
        }
        return me.symbolGroups = [];
      }
    };

    Kartograph.prototype.loadStyles = function(url, callback) {
      /*
              loads a stylesheet
      */
      var me;
      me = this;
      if ($.browser.msie) {
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

    Kartograph.prototype.applyStyles = function(el, className) {
      /*
              applies pre-loaded css styles to
              raphael elements
      */
      var classes, k, me, p, props, sel, selectors, _i, _j, _len, _len2, _ref5, _ref6, _ref7, _ref8;
      me = this;
      if (!(me.styles != null)) return el;
      if ((_ref5 = me._pathTypes) == null) {
        me._pathTypes = ["path", "circle", "rectangle", "ellipse"];
      }
      if ((_ref6 = me._regardStyles) == null) {
        me._regardStyles = ["fill", "stroke", "fill-opacity", "stroke-width", "stroke-opacity"];
      }
      for (sel in me.styles) {
        p = sel;
        _ref7 = p.split(',');
        for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
          selectors = _ref7[_i];
          p = selectors.split(' ');
          p = p[p.length - 1];
          p = p.split(':');
          if (p.length > 1) continue;
          p = p[0].split('.');
          classes = p.slice(1);
          if (classes.length > 0 && classes.indexOf(className) < 0) continue;
          p = p[0];
          if (me._pathTypes.indexOf(p) >= 0 && p !== el.type) continue;
          props = me.styles[sel];
          _ref8 = me._regardStyles;
          for (_j = 0, _len2 = _ref8.length; _j < _len2; _j++) {
            k = _ref8[_j];
            if (props[k] != null) el.attr(k, props[k]);
          }
        }
      }
      return el;
    };

    return Kartograph;

  })();

  kartograph.Kartograph = Kartograph;

  kartograph.map = function(container, width, height) {
    /* short-hand constructor
    */    return new Kartograph(container, width, height);
  };

  kartograph.__mapCache = {};

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref5 = root.kartograph) != null ? _ref5 : root.kartograph = {};

  LonLat = (function() {

    /*
    	represents a Point
    */

    function LonLat(lon, lat, alt) {
      if (alt == null) alt = 0;
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

  LatLon = (function() {

    __extends(LatLon, LonLat);

    function LatLon(lat, lon, alt) {
      if (alt == null) alt = 0;
      LatLon.__super__.constructor.call(this, lon, lat, alt);
    }

    return LatLon;

  })();

  kartograph.LonLat = LonLat;

  kartograph.LatLon = LatLon;

  /*
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
  */

  MapLayer = (function() {

    function MapLayer(layer_id, path_id, map, filter) {
      var me;
      me = this;
      me.id = layer_id;
      me.path_id = path_id;
      me.paper = map.paper;
      me.view = map.viewBC;
      me.map = map;
      me.filter = filter;
    }

    MapLayer.prototype.addPath = function(svg_path, titles) {
      var layerPath, me, _base3, _name, _ref6, _ref7, _ref8;
      me = this;
      if ((_ref6 = me.paths) == null) me.paths = [];
      layerPath = new MapLayerPath(svg_path, me.id, me.map, titles);
      if (__type(me.filter) === 'function') {
        if (me.filter(layerPath.data) === false) {
          layerPath.remove();
          return;
        }
      }
      me.paths.push(layerPath);
      if (me.path_id != null) {
        if ((_ref7 = me.pathsById) == null) me.pathsById = {};
        if ((_ref8 = (_base3 = me.pathsById)[_name = layerPath.data[me.path_id]]) == null) {
          _base3[_name] = [];
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
      var me, path, pd, _i, _len, _ref6;
      me = this;
      pd = [];
      _ref6 = me.paths;
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        path = _ref6[_i];
        pd.push(path.data);
      }
      return pd;
    };

    MapLayer.prototype.getPath = function(id) {
      var me;
      me = this;
      if (me.hasPath(id)) return me.pathsById[id][0];
      throw 'path ' + id + ' not found';
    };

    MapLayer.prototype.setView = function(view) {
      /*
              # after resizing of the map, each layer gets a new view
      */
      var me, path, _i, _len, _ref6, _results;
      me = this;
      _ref6 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        path = _ref6[_i];
        _results.push(path.setView(view));
      }
      return _results;
    };

    MapLayer.prototype.remove = function() {
      /*
              removes every path
      */
      var me, path, _i, _len, _ref6, _results;
      me = this;
      _ref6 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        path = _ref6[_i];
        _results.push(path.remove());
      }
      return _results;
    };

    return MapLayer;

  })();

  map_layer_path_uid = 0;

  /*
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
  */

  MapLayerPath = (function() {

    function MapLayerPath(svg_path, layer_id, map, titles) {
      var attr, data, i, me, paper, path, title, uid, v, view, vn, _ref6;
      me = this;
      paper = map.paper;
      view = map.viewBC;
      me.path = path = kartograph.geom.Path.fromSVG(svg_path);
      me.vpath = view.projectPath(path);
      me.svgPath = me.vpath.toSVG(paper);
      if (!(map.styles != null)) {
        me.svgPath.node.setAttribute('class', layer_id);
      } else {
        map.applyStyles(me.svgPath, layer_id);
      }
      uid = 'path_' + map_layer_path_uid++;
      me.svgPath.node.setAttribute('id', uid);
      map.pathById[uid] = me;
      data = {};
      for (i = 0, _ref6 = svg_path.attributes.length - 1; 0 <= _ref6 ? i <= _ref6 : i >= _ref6; 0 <= _ref6 ? i++ : i--) {
        attr = svg_path.attributes[i];
        if (attr.name.substr(0, 5) === "data-") {
          v = attr.value;
          vn = Number(v);
          if (v.trim() !== "" && vn === v && !isNaN(vn)) v = vn;
          data[attr.name.substr(5)] = v;
        }
      }
      me.data = data;
      if (__type(titles) === 'string') {
        title = titles;
      } else if (__type(titles) === 'function') {
        title = titles(data);
      }
      if (title != null) me.svgPath.attr('title', title);
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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref6 = root.kartograph) != null ? _ref6 : root.kartograph = {};

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
    var css, k, props, ret, v, _i, _len, _ref7;
    ret = {};
    str = munge(str);
    _ref7 = str.split('`b%');
    for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
      css = _ref7[_i];
      css = css.split('%b`');
      if (css.length < 2) continue;
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
    var decl, parsed, str, _i, _len, _ref7;
    str = munged[index].replace(/^{|}$/g, '');
    str = munge(str);
    parsed = {};
    _ref7 = str.split(';');
    for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
      decl = _ref7[_i];
      decl = decl.split(':');
      if (decl.length < 2) continue;
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
      if (!string) return '';
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
    if (!(str != null)) return str;
    while (match = REmunged.exec(str)) {
      str = str.replace(REmunged, munged[match[1]]);
    }
    return str.trim();
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
      GNU General Public License for more details.
  
      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref7 = root.kartograph) != null ? _ref7 : root.kartograph = {};

  if ((_ref8 = kartograph.geom) == null) kartograph.geom = {};

  Path = (function() {

    /*
    	represents complex polygons (aka multi-polygons)
    */

    function Path(type, contours, closed) {
      var self;
      if (closed == null) closed = true;
      self = this;
      self.type = type;
      self.contours = contours;
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
      var contour, fst, glue, me, str, x, y, _i, _j, _len, _len2, _ref10, _ref9;
      me = this;
      str = "";
      glue = me.closed ? "Z M" : "M";
      _ref9 = me.contours;
      for (_i = 0, _len = _ref9.length; _i < _len; _i++) {
        contour = _ref9[_i];
        fst = true;
        str += str === "" ? "M" : glue;
        for (_j = 0, _len2 = contour.length; _j < _len2; _j++) {
          _ref10 = contour[_j], x = _ref10[0], y = _ref10[1];
          if (!fst) str += "L";
          str += x + ',' + y;
          fst = false;
        }
      }
      if (me.closed) str += "Z";
      return str;
    };

    Path.prototype.area = function() {
      var area, cnt, i, me, _i, _len, _ref10, _ref9;
      me = this;
      if (me.areas != null) return me._area;
      me.areas = [];
      me._area = 0;
      _ref9 = me.contours;
      for (_i = 0, _len = _ref9.length; _i < _len; _i++) {
        cnt = _ref9[_i];
        area = 0;
        for (i = 0, _ref10 = cnt.length - 2; 0 <= _ref10 ? i <= _ref10 : i >= _ref10; 0 <= _ref10 ? i++ : i--) {
          area += cnt[i][0] * cnt[i + 1][1] - cnt[i + 1][0] * cnt[i][1];
        }
        area *= .5;
        area = area;
        me.areas.push(area);
        me._area += area;
      }
      return me._area;
    };

    Path.prototype.centroid = function() {
      var a, area, cnt, cx, cy, dx, dy, i, j, k, l, len, me, p0, p1, total_len, w, x, y, _lengths, _ref10, _ref11, _ref9;
      me = this;
      if (me._centroid != null) return me._centroid;
      area = me.area();
      cx = cy = 0;
      for (i = 0, _ref9 = me.contours.length - 1; 0 <= _ref9 ? i <= _ref9 : i >= _ref9; 0 <= _ref9 ? i++ : i--) {
        cnt = me.contours[i];
        a = me.areas[i];
        x = y = 0;
        l = cnt.length;
        _lengths = [];
        total_len = 0;
        for (j = 0, _ref10 = l - 1; 0 <= _ref10 ? j <= _ref10 : j >= _ref10; 0 <= _ref10 ? j++ : j--) {
          p0 = cnt[j];
          p1 = cnt[(j + 1) % l];
          dx = p1[0] - p0[0];
          dy = p1[1] - p0[1];
          len = Math.sqrt(dx * dx + dy * dy);
          _lengths.push(len);
          total_len += len;
        }
        for (j = 0, _ref11 = l - 1; 0 <= _ref11 ? j <= _ref11 : j >= _ref11; 0 <= _ref11 ? j++ : j--) {
          p0 = cnt[j];
          p1 = cnt[(j + 1) % l];
          w = _lengths[j] / total_len;
          x += w * p0[0];
          y += w * p0[1];
        }
        k = a / area;
        cx += x * k;
        cy += y * k;
      }
      me._centroid = [cx, cy];
      return me._centroid;
    };

    Path.prototype.isInside = function(x, y) {
      var bbox, cnt, i, me, _ref9;
      me = this;
      bbox = me._bbox;
      if (x < bbox[0] || x > bbox[2] || y < bbox[1] || y > bbox[3]) return false;
      for (i = 0, _ref9 = me.contours.length - 1; 0 <= _ref9 ? i <= _ref9 : i >= _ref9; 0 <= _ref9 ? i++ : i--) {
        cnt = me.contours[i];
        if (__point_in_polygon(cnt, [x, y])) return true;
      }
      return false;
    };

    return Path;

  })();

  kartograph.geom.Path = Path;

  Circle = (function() {

    __extends(Circle, Path);

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

  })();

  kartograph.geom.Circle = Circle;

  Path.fromSVG = function(path) {
    /*
    	loads a path from a SVG path string
    */
    var closed, contour, contour_str, contours, cx, cy, path_str, pt_str, r, res, sep, type, x, y, _i, _j, _len, _len2, _ref10, _ref11, _ref9;
    contours = [];
    type = path.nodeName;
    res = null;
    if (type === "path") {
      path_str = path.getAttribute('d').trim();
      closed = path_str[path_str.length - 1] === "Z";
      sep = closed ? "Z M" : "M";
      path_str = path_str.substring(1, path_str.length - (closed ? 1 : 0));
      _ref9 = path_str.split(sep);
      for (_i = 0, _len = _ref9.length; _i < _len; _i++) {
        contour_str = _ref9[_i];
        contour = [];
        if (contour_str !== "") {
          _ref10 = contour_str.split('L');
          for (_j = 0, _len2 = _ref10.length; _j < _len2; _j++) {
            pt_str = _ref10[_j];
            _ref11 = pt_str.split(','), x = _ref11[0], y = _ref11[1];
            contour.push([Number(x), Number(y)]);
          }
          contours.push(contour);
        }
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
      var clip, i, last_in, lines, p0x, p0y, p1x, p1y, pts, self, x0, x1, y0, y1, _ref10, _ref11, _ref12, _ref9;
      self = this;
      clip = new kartograph.geom.clipping.CohenSutherland().clip;
      pts = [];
      lines = [];
      last_in = false;
      for (i = 0, _ref9 = self.points.length - 2; 0 <= _ref9 ? i <= _ref9 : i >= _ref9; 0 <= _ref9 ? i++ : i--) {
        _ref10 = self.points[i], p0x = _ref10[0], p0y = _ref10[1];
        _ref11 = self.points[i + 1], p1x = _ref11[0], p1y = _ref11[1];
        try {
          _ref12 = clip(bbox, p0x, p0y, p1x, p1y), x0 = _ref12[0], y0 = _ref12[1], x1 = _ref12[2], y1 = _ref12[3];
          last_in = true;
          pts.push([x0, y0]);
          if (p1x !== x1 || p1y !== y0 || i === len(self.points) - 2) {
            pts.push([x1, y1]);
          }
        } catch (err) {
          if (last_in && pts.length > 1) {
            lines.push(new Line(pts));
            pts = [];
          }
          last_in = false;
        }
      }
      if (pts.length > 1) lines.push(new Line(pts));
      return lines;
    };

    Line.prototype.toSVG = function() {
      var pts, self, x, y, _i, _len, _ref10, _ref9;
      self = this;
      pts = [];
      _ref9 = self.points;
      for (_i = 0, _len = _ref9.length; _i < _len; _i++) {
        _ref10 = _ref9[_i], x = _ref10[0], y = _ref10[1];
        pts.push(x + ',' + y);
      }
      return 'M' + pts.join('L');
    };

    return Line;

  })();

  kartograph.geom.Line = Line;

  __point_in_polygon = function(polygon, p) {
    var angle, atan2, dtheta, i, n, pi, theta1, theta2, twopi, x1, x2, y1, y2, _ref9;
    pi = Math.PI;
    atan2 = Math.atan2;
    twopi = pi * 2;
    n = polygon.length;
    angle = 0;
    for (i = 0, _ref9 = n - 1; 0 <= _ref9 ? i <= _ref9 : i >= _ref9; 0 <= _ref9 ? i++ : i--) {
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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref9 = root.kartograph) != null ? _ref9 : root.kartograph = {};

  __proj = kartograph.proj = {};

  Function.prototype.bind = function(scope) {
    var _function;
    _function = this;
    return function() {
      return _function.apply(scope, arguments);
    };
  };

  Proj = (function() {

    Proj.parameters = [];

    Proj.title = "Projection";

    function Proj(opts) {
      var me, _ref10, _ref11;
      me = this;
      me.lon0 = (_ref10 = opts.lon0) != null ? _ref10 : 0;
      me.lat0 = (_ref11 = opts.lat0) != null ? _ref11 : 0;
      me.PI = Math.PI;
      me.HALFPI = me.PI * .5;
      me.QUARTERPI = me.PI * .25;
      me.RAD = me.PI / 180;
      me.DEG = 180 / me.PI;
      me.lam0 = me.rad(this.lon0);
      me.phi0 = me.rad(this.lat0);
      me.minLat = -90;
      me.maxLat = 90;
    }

    Proj.prototype.rad = function(a) {
      return a * this.RAD;
    };

    Proj.prototype.deg = function(a) {
      return a * this.DEG;
    };

    Proj.prototype.plot = function(polygon, truncate) {
      var ignore, lat, lon, points, vis, x, y, _i, _len, _ref10, _ref11;
      if (truncate == null) truncate = true;
      points = [];
      ignore = true;
      for (_i = 0, _len = polygon.length; _i < _len; _i++) {
        _ref10 = polygon[_i], lon = _ref10[0], lat = _ref10[1];
        vis = this._visible(lon, lat);
        if (vis) ignore = false;
        _ref11 = this.project(lon, lat), x = _ref11[0], y = _ref11[1];
        if (!vis && truncate) {
          points.push(this._truncate(x, y));
        } else {
          points.push([x, y]);
        }
      }
      if (ignore) {
        return null;
      } else {
        return [points];
      }
    };

    Proj.prototype.sea = function() {
      var l0, lat, lon, o, p, s, _ref10, _ref11, _ref12, _ref13;
      s = this;
      p = s.project.bind(this);
      o = [];
      l0 = s.lon0;
      s.lon0 = 0;
      for (lon = -180; lon <= 180; lon++) {
        o.push(p(lon, s.maxLat));
      }
      for (lat = _ref10 = s.maxLat, _ref11 = s.minLat; _ref10 <= _ref11 ? lat <= _ref11 : lat >= _ref11; _ref10 <= _ref11 ? lat++ : lat--) {
        o.push(p(180, lat));
      }
      for (lon = 180; lon >= -180; lon--) {
        o.push(p(lon, s.minLat));
      }
      for (lat = _ref12 = s.minLat, _ref13 = s.maxLat; _ref12 <= _ref13 ? lat <= _ref13 : lat >= _ref13; _ref12 <= _ref13 ? lat++ : lat--) {
        o.push(p(-180, lat));
      }
      s.lon0 = l0;
      return o;
    };

    Proj.prototype.world_bbox = function() {
      var bbox, p, s, sea, _i, _len;
      p = this.project.bind(this);
      sea = this.sea();
      bbox = new kartograph.BBox();
      for (_i = 0, _len = sea.length; _i < _len; _i++) {
        s = sea[_i];
        bbox.update(s[0], s[1]);
      }
      return bbox;
    };

    Proj.prototype.toString = function() {
      var me;
      me = this;
      return '[Proj: ' + me.name + ']';
    };

    return Proj;

  })();

  Proj.fromXML = function(xml) {
    /*
        reconstructs a projection from xml description
    */
    var attr, i, id, opts, proj, _ref10;
    id = xml.getAttribute('id');
    opts = {};
    for (i = 0, _ref10 = xml.attributes.length - 1; 0 <= _ref10 ? i <= _ref10 : i >= _ref10; 0 <= _ref10 ? i++ : i--) {
      attr = xml.attributes[i];
      if (attr.name !== "id") opts[attr.name] = attr.value;
    }
    proj = new kartograph.proj[id](opts);
    proj.name = id;
    return proj;
  };

  kartograph.Proj = Proj;

  Cylindrical = (function() {

    __extends(Cylindrical, Proj);

    /*
        Base class for cylindrical projections
    */

    Cylindrical.parameters = ['lon0', 'flip'];

    Cylindrical.title = "Cylindrical Projection";

    function Cylindrical(opts) {
      var me, _ref10, _ref11;
      if (opts == null) opts = {};
      me = this;
      me.flip = Number((_ref10 = opts.flip) != null ? _ref10 : 0);
      if (me.flip === 1) opts.lon0 = (_ref11 = -opts.lon0) != null ? _ref11 : 0;
      Cylindrical.__super__.constructor.call(this, opts);
    }

    Cylindrical.prototype._visible = function(lon, lat) {
      return true;
    };

    Cylindrical.prototype.clon = function(lon) {
      lon -= this.lon0;
      if (lon < -180) {
        lon += 360;
      } else if (lon > 180) {
        lon -= 360;
      }
      return lon;
    };

    Cylindrical.prototype.ll = function(lon, lat) {
      if (this.flip === 1) {
        return [-lon, -lat];
      } else {
        return [lon, lat];
      }
    };

    return Cylindrical;

  })();

  Equirectangular = (function() {

    __extends(Equirectangular, Cylindrical);

    function Equirectangular() {
      Equirectangular.__super__.constructor.apply(this, arguments);
    }

    /*
        Equirectangular Projection aka Lonlat aka Plate Carree
    */

    Equirectangular.title = "Equirectangular Projection";

    Equirectangular.prototype.project = function(lon, lat) {
      var _ref10;
      _ref10 = this.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lon = this.clon(lon);
      return [lon * Math.cos(this.phi0) * 1000, lat * -1 * 1000];
    };

    return Equirectangular;

  })();

  __proj['lonlat'] = Equirectangular;

  CEA = (function() {

    __extends(CEA, Cylindrical);

    CEA.parameters = ['lon0', 'lat1', 'flip'];

    CEA.title = "Cylindrical Equal Area";

    function CEA(opts) {
      var _ref10;
      CEA.__super__.constructor.call(this, opts);
      this.lat1 = (_ref10 = opts.lat1) != null ? _ref10 : 0;
      this.phi1 = this.rad(this.lat1);
    }

    /*
        Cylindrical Equal Area Projection
    */

    CEA.prototype.project = function(lon, lat) {
      var lam, phi, x, y, _ref10;
      _ref10 = this.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lam = this.rad(this.clon(lon));
      phi = this.rad(lat * -1);
      x = lam * Math.cos(this.phi1);
      y = Math.sin(phi) / Math.cos(this.phi1);
      return [x * 1000, y * 1000];
    };

    return CEA;

  })();

  __proj['cea'] = CEA;

  GallPeters = (function() {

    __extends(GallPeters, CEA);

    /*
        Gall-Peters Projection
    */

    GallPeters.title = "Gall-Peters Projection";

    GallPeters.parameters = ['lon0', 'flip'];

    function GallPeters(opts) {
      opts.lat1 = 45;
      GallPeters.__super__.constructor.call(this, opts);
    }

    return GallPeters;

  })();

  __proj['gallpeters'] = GallPeters;

  HoboDyer = (function() {

    __extends(HoboDyer, CEA);

    /*
        Hobo-Dyer Projection
    */

    HoboDyer.title = "Hobo-Dyer Projection";

    HoboDyer.parameters = ['lon0', 'flip'];

    function HoboDyer(opts) {
      opts.lat1 = 37.7;
      HoboDyer.__super__.constructor.call(this, opts);
    }

    return HoboDyer;

  })();

  __proj['hobodyer'] = HoboDyer;

  Behrmann = (function() {

    __extends(Behrmann, CEA);

    /*
        Behrmann Projection
    */

    Behrmann.title = "Behrmann Projection";

    Behrmann.parameters = ['lon0', 'flip'];

    function Behrmann(opts) {
      opts.lat1 = 30;
      Behrmann.__super__.constructor.call(this, opts);
    }

    return Behrmann;

  })();

  __proj['behrmann'] = Behrmann;

  Balthasart = (function() {

    __extends(Balthasart, CEA);

    /*
        Balthasart Projection
    */

    Balthasart.title = "Balthasart Projection";

    Balthasart.parameters = ['lon0', 'flip'];

    function Balthasart(opts) {
      opts.lat1 = 50;
      Balthasart.__super__.constructor.call(this, opts);
    }

    return Balthasart;

  })();

  __proj['balthasart'] = Balthasart;

  Mercator = (function() {

    __extends(Mercator, Cylindrical);

    /*
        # you're not really into maps..
    */

    Mercator.title = "Mercator Projection";

    function Mercator(opts) {
      Mercator.__super__.constructor.call(this, opts);
      this.minLat = -85;
      this.maxLat = 85;
    }

    Mercator.prototype.project = function(lon, lat) {
      var lam, math, phi, s, x, y, _ref10;
      s = this;
      _ref10 = s.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      math = Math;
      lam = s.rad(s.clon(lon));
      phi = s.rad(lat * -1);
      x = lam * 1000;
      y = math.log((1 + math.sin(phi)) / math.cos(phi)) * 1000;
      return [x, y];
    };

    return Mercator;

  })();

  __proj['mercator'] = Mercator;

  PseudoCylindrical = (function() {

    __extends(PseudoCylindrical, Cylindrical);

    function PseudoCylindrical() {
      PseudoCylindrical.__super__.constructor.apply(this, arguments);
    }

    /*
        Base class for pseudo cylindrical projections
    */

    PseudoCylindrical.title = "Pseudo-Cylindrical Projection";

    return PseudoCylindrical;

  })();

  NaturalEarth = (function() {

    __extends(NaturalEarth, PseudoCylindrical);

    /*
        Natural Earth Projection
        see here http://www.shadedrelief.com/NE_proj/
    */

    NaturalEarth.title = "Natural Earth Projection";

    function NaturalEarth(opts) {
      var s;
      NaturalEarth.__super__.constructor.call(this, opts);
      s = this;
      s.A0 = 0.8707;
      s.A1 = -0.131979;
      s.A2 = -0.013791;
      s.A3 = 0.003971;
      s.A4 = -0.001529;
      s.B0 = 1.007226;
      s.B1 = 0.015085;
      s.B2 = -0.044475;
      s.B3 = 0.028874;
      s.B4 = -0.005916;
      s.C0 = s.B0;
      s.C1 = 3 * s.B1;
      s.C2 = 7 * s.B2;
      s.C3 = 9 * s.B3;
      s.C4 = 11 * s.B4;
      s.EPS = 1e-11;
      s.MAX_Y = 0.8707 * 0.52 * Math.PI;
      return;
    }

    NaturalEarth.prototype.project = function(lon, lat) {
      var lplam, lpphi, phi2, phi4, s, x, y, _ref10;
      s = this;
      _ref10 = s.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lplam = s.rad(s.clon(lon));
      lpphi = s.rad(lat * -1);
      phi2 = lpphi * lpphi;
      phi4 = phi2 * phi2;
      x = lplam * (s.A0 + phi2 * (s.A1 + phi2 * (s.A2 + phi4 * phi2 * (s.A3 + phi2 * s.A4)))) * 180 + 500;
      y = lpphi * (s.B0 + phi2 * (s.B1 + phi4 * (s.B2 + s.B3 * phi2 + s.B4 * phi4))) * 180 + 270;
      return [x, y];
    };

    return NaturalEarth;

  })();

  __proj['naturalearth'] = NaturalEarth;

  Robinson = (function() {

    __extends(Robinson, PseudoCylindrical);

    /*
        Robinson Projection
    */

    Robinson.title = "Robinson Projection";

    function Robinson(opts) {
      var s;
      Robinson.__super__.constructor.call(this, opts);
      s = this;
      s.X = [1, -5.67239e-12, -7.15511e-05, 3.11028e-06, 0.9986, -0.000482241, -2.4897e-05, -1.33094e-06, 0.9954, -0.000831031, -4.4861e-05, -9.86588e-07, 0.99, -0.00135363, -5.96598e-05, 3.67749e-06, 0.9822, -0.00167442, -4.4975e-06, -5.72394e-06, 0.973, -0.00214869, -9.03565e-05, 1.88767e-08, 0.96, -0.00305084, -9.00732e-05, 1.64869e-06, 0.9427, -0.00382792, -6.53428e-05, -2.61493e-06, 0.9216, -0.00467747, -0.000104566, 4.8122e-06, 0.8962, -0.00536222, -3.23834e-05, -5.43445e-06, 0.8679, -0.00609364, -0.0001139, 3.32521e-06, 0.835, -0.00698325, -6.40219e-05, 9.34582e-07, 0.7986, -0.00755337, -5.00038e-05, 9.35532e-07, 0.7597, -0.00798325, -3.59716e-05, -2.27604e-06, 0.7186, -0.00851366, -7.0112e-05, -8.63072e-06, 0.6732, -0.00986209, -0.000199572, 1.91978e-05, 0.6213, -0.010418, 8.83948e-05, 6.24031e-06, 0.5722, -0.00906601, 0.000181999, 6.24033e-06, 0.5322, 0, 0, 0];
      s.Y = [0, 0.0124, 3.72529e-10, 1.15484e-09, 0.062, 0.0124001, 1.76951e-08, -5.92321e-09, 0.124, 0.0123998, -7.09668e-08, 2.25753e-08, 0.186, 0.0124008, 2.66917e-07, -8.44523e-08, 0.248, 0.0123971, -9.99682e-07, 3.15569e-07, 0.31, 0.0124108, 3.73349e-06, -1.1779e-06, 0.372, 0.0123598, -1.3935e-05, 4.39588e-06, 0.434, 0.0125501, 5.20034e-05, -1.00051e-05, 0.4968, 0.0123198, -9.80735e-05, 9.22397e-06, 0.5571, 0.0120308, 4.02857e-05, -5.2901e-06, 0.6176, 0.0120369, -3.90662e-05, 7.36117e-07, 0.6769, 0.0117015, -2.80246e-05, -8.54283e-07, 0.7346, 0.0113572, -4.08389e-05, -5.18524e-07, 0.7903, 0.0109099, -4.86169e-05, -1.0718e-06, 0.8435, 0.0103433, -6.46934e-05, 5.36384e-09, 0.8936, 0.00969679, -6.46129e-05, -8.54894e-06, 0.9394, 0.00840949, -0.000192847, -4.21023e-06, 0.9761, 0.00616525, -0.000256001, -4.21021e-06, 1, 0, 0, 0];
      s.NODES = 18;
      s.FXC = 0.8487;
      s.FYC = 1.3523;
      s.C1 = 11.45915590261646417544;
      s.RC1 = 0.08726646259971647884;
      s.ONEEPS = 1.000001;
      s.EPS = 1e-8;
      return;
    }

    Robinson.prototype._poly = function(arr, offs, z) {
      return arr[offs] + z * (arr[offs + 1] + z * (arr[offs + 2] + z * arr[offs + 3]));
    };

    Robinson.prototype.project = function(lon, lat) {
      var i, lplam, lpphi, phi, s, x, y, _ref10;
      s = this;
      _ref10 = s.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lon = s.clon(lon);
      lplam = s.rad(lon);
      lpphi = s.rad(lat * -1);
      phi = Math.abs(lpphi);
      i = Math.floor(phi * s.C1);
      if (i >= s.NODES) i = s.NODES - 1;
      phi = s.deg(phi - s.RC1 * i);
      i *= 4;
      x = s._poly(s.X, i, phi) * s.FXC * lplam;
      y = s._poly(s.Y, i, phi) * s.FYC;
      if (lpphi < 0.0) y = -y;
      return [x, y];
    };

    return Robinson;

  })();

  __proj['robinson'] = Robinson;

  EckertIV = (function() {

    __extends(EckertIV, PseudoCylindrical);

    /*
        Eckert IV Projection
    */

    EckertIV.title = "Eckert IV Projection";

    function EckertIV(opts) {
      var me;
      EckertIV.__super__.constructor.call(this, opts);
      me = this;
      me.C_x = .42223820031577120149;
      me.C_y = 1.32650042817700232218;
      me.RC_y = .75386330736002178205;
      me.C_p = 3.57079632679489661922;
      me.RC_p = .28004957675577868795;
      me.EPS = 1e-7;
      me.NITER = 6;
    }

    EckertIV.prototype.project = function(lon, lat) {
      var V, c, i, lplam, lpphi, me, p, s, x, y, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lplam = me.rad(me.clon(lon));
      lpphi = me.rad(lat * -1);
      p = me.C_p * Math.sin(lpphi);
      V = lpphi * lpphi;
      lpphi *= 0.895168 + V * (0.0218849 + V * 0.00826809);
      i = me.NITER;
      while (i > 0) {
        c = Math.cos(lpphi);
        s = Math.sin(lpphi);
        V = (lpphi + s * (c + 2) - p) / (1 + c * (c + 2) - s * s);
        lpphi -= V;
        if (Math.abs(V) < me.EPS) break;
        i -= 1;
      }
      if (i === 0) {
        x = me.C_x * lplam;
        y = lpphi < 0 ? -me.C_y : me.C_y;
      } else {
        x = me.C_x * lplam * (1 + Math.cos(lpphi));
        y = me.C_y * Math.sin(lpphi);
      }
      return [x, y];
    };

    return EckertIV;

  })();

  __proj['eckert4'] = EckertIV;

  Sinusoidal = (function() {

    __extends(Sinusoidal, PseudoCylindrical);

    function Sinusoidal() {
      Sinusoidal.__super__.constructor.apply(this, arguments);
    }

    /*
        Sinusoidal Projection
    */

    Sinusoidal.title = "Sinusoidal Projection";

    Sinusoidal.prototype.project = function(lon, lat) {
      var lam, me, phi, x, y, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lam = me.rad(me.clon(lon));
      phi = me.rad(lat * -1);
      x = 1032 * lam * Math.cos(phi);
      y = 1032 * phi;
      return [x, y];
    };

    return Sinusoidal;

  })();

  __proj['sinusoidal'] = Sinusoidal;

  Mollweide = (function() {

    __extends(Mollweide, PseudoCylindrical);

    /*
        Mollweide Projection
    */

    Mollweide.title = "Mollweide Projection";

    function Mollweide(opts, p, cx, cy, cp) {
      var me, p2, r, sp;
      if (p == null) p = 1.5707963267948966;
      if (cx == null) cx = null;
      if (cy == null) cy = null;
      if (cp == null) cp = null;
      Mollweide.__super__.constructor.call(this, opts);
      me = this;
      me.MAX_ITER = 10;
      me.TOLERANCE = 1e-7;
      if (p != null) {
        p2 = p + p;
        sp = Math.sin(p);
        r = Math.sqrt(Math.PI * 2.0 * sp / (p2 + Math.sin(p2)));
        me.cx = 2 * r / Math.PI;
        me.cy = r / sp;
        me.cp = p2 + Math.sin(p2);
      } else if ((cx != null) && (cy != null) && (typeof cz !== "undefined" && cz !== null)) {
        me.cx = cx;
        me.cy = cy;
        me.cp = cp;
      } else {
        warn('kartograph.proj.Mollweide: either p or cx,cy,cp must be defined');
      }
    }

    Mollweide.prototype.project = function(lon, lat) {
      var abs, i, k, lam, math, me, phi, v, x, y, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      math = Math;
      abs = math.abs;
      lam = me.rad(me.clon(lon));
      phi = me.rad(lat);
      k = me.cp * math.sin(phi);
      i = me.MAX_ITER;
      while (i !== 0) {
        v = (phi + math.sin(phi) - k) / (1 + math.cos(phi));
        phi -= v;
        if (abs(v) < me.TOLERANCE) break;
        i -= 1;
      }
      if (i === 0) {
        phi = phi >= 0 ? me.HALFPI : -me.HALFPI;
      } else {
        phi *= 0.5;
      }
      x = 1000 * me.cx * lam * math.cos(phi);
      y = 1000 * me.cy * math.sin(phi);
      return [x, y * -1];
    };

    return Mollweide;

  })();

  __proj['mollweide'] = Mollweide;

  WagnerIV = (function() {

    __extends(WagnerIV, Mollweide);

    /*
        Wagner IV Projection
    */

    WagnerIV.title = "Wagner IV Projection";

    function WagnerIV(opts) {
      WagnerIV.__super__.constructor.call(this, opts, 1.0471975511965976);
    }

    return WagnerIV;

  })();

  __proj['wagner4'] = WagnerIV;

  WagnerV = (function() {

    __extends(WagnerV, Mollweide);

    /*
        Wagner V Projection
    */

    WagnerV.title = "Wagner V Projection";

    function WagnerV(opts) {
      WagnerV.__super__.constructor.call(this, opts, null, 0.90977, 1.65014, 3.00896);
    }

    return WagnerV;

  })();

  __proj['wagner5'] = WagnerV;

  Loximuthal = (function() {
    var maxLat, minLat;

    __extends(Loximuthal, PseudoCylindrical);

    function Loximuthal() {
      Loximuthal.__super__.constructor.apply(this, arguments);
    }

    minLat = -89;

    maxLat = 89;

    Loximuthal.parameters = ['lon0', 'lat0', 'flip'];

    Loximuthal.title = "Loximuthal Projection (equidistant)";

    Loximuthal.prototype.project = function(lon, lat) {
      var lam, math, me, phi, x, y, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      math = Math;
      lam = me.rad(me.clon(lon));
      phi = me.rad(lat);
      if (phi === me.phi0) {
        x = lam * math.cos(me.phi0);
      } else {
        x = lam * (phi - me.phi0) / (math.log(math.tan(me.QUARTERPI + phi * 0.5)) - math.log(math.tan(me.QUARTERPI + me.phi0 * 0.5)));
      }
      x *= 1000;
      y = 1000 * (phi - me.phi0);
      return [x, y * -1];
    };

    return Loximuthal;

  })();

  __proj['loximuthal'] = Loximuthal;

  CantersModifiedSinusoidalI = (function() {
    var C1, C3, C3x3, C5, C5x5;

    __extends(CantersModifiedSinusoidalI, PseudoCylindrical);

    function CantersModifiedSinusoidalI() {
      CantersModifiedSinusoidalI.__super__.constructor.apply(this, arguments);
    }

    /*
        Canters, F. (2002) Small-scale Map projection Design. p. 218-219.
        Modified Sinusoidal, equal-area.
    
        implementation borrowed from
        http://cartography.oregonstate.edu/temp/AdaptiveProjection/src/projections/Canters1.js
    */

    CantersModifiedSinusoidalI.title = "Canters Modified Sinusoidal I";

    CantersModifiedSinusoidalI.parameters = ['lon0'];

    C1 = 1.1966;

    C3 = -0.1290;

    C3x3 = 3 * C3;

    C5 = -0.0076;

    C5x5 = 5 * C5;

    CantersModifiedSinusoidalI.prototype.project = function(lon, lat) {
      var me, x, y, y2, y4, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lon = me.rad(me.clon(lon));
      lat = me.rad(lat);
      y2 = lat * lat;
      y4 = y2 * y2;
      x = 1000 * lon * Math.cos(lat) / (C1 + C3x3 * y2 + C5x5 * y4);
      y = 1000 * lat * (C1 + C3 * y2 + C5 * y4);
      return [x, y * -1];
    };

    return CantersModifiedSinusoidalI;

  })();

  __proj['canters1'] = CantersModifiedSinusoidalI;

  Hatano = (function() {
    var CN, CS, EPS, FXC, FYCN, FYCS, NITER, ONETOL, RCN, RCS, RXC, RYCN, RYCS;

    __extends(Hatano, PseudoCylindrical);

    Hatano.title = "Hatano Projection";

    NITER = 20;

    EPS = 1e-7;

    ONETOL = 1.000001;

    CN = 2.67595;

    CS = 2.43763;

    RCN = 0.37369906014686373063;

    RCS = 0.41023453108141924738;

    FYCN = 1.75859;

    FYCS = 1.93052;

    RYCN = 0.56863737426006061674;

    RYCS = 0.51799515156538134803;

    FXC = 0.85;

    RXC = 1.17647058823529411764;

    function Hatano(opts) {
      Hatano.__super__.constructor.call(this, opts);
    }

    Hatano.prototype.project = function(lon, lat) {
      var c, i, lam, me, phi, th1, x, y, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lam = me.rad(me.clon(lon));
      phi = me.rad(lat);
      c = Math.sin(phi) * (phi < 0.0 ? CS : CN);
      for (i = NITER; i >= 1; i += -1) {
        th1 = (phi + Math.sin(phi) - c) / (1.0 + Math.cos(phi));
        phi -= th1;
        if (Math.abs(th1) < EPS) break;
      }
      x = 1000 * FXC * lam * Math.cos(phi *= 0.5);
      y = 1000 * Math.sin(phi) * (phi < 0.0 ? FYCS : FYCN);
      return [x, y * -1];
    };

    return Hatano;

  })();

  __proj['hatano'] = Hatano;

  GoodeHomolosine = (function() {

    __extends(GoodeHomolosine, PseudoCylindrical);

    GoodeHomolosine.title = "Goode Homolosine Projection";

    GoodeHomolosine.parameters = ['lon0'];

    function GoodeHomolosine(opts) {
      var me;
      GoodeHomolosine.__super__.constructor.call(this, opts);
      me = this;
      me.lat1 = 41.737;
      me.p1 = new Mollweide();
      me.p0 = new Sinusoidal();
    }

    GoodeHomolosine.prototype.project = function(lon, lat) {
      var me, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lon = me.clon(lon);
      if (Math.abs(lat) > me.lat1) {
        return me.p1.project(lon, lat);
      } else {
        return me.p0.project(lon, lat);
      }
    };

    return GoodeHomolosine;

  })();

  __proj['goodehomolosine'] = GoodeHomolosine;

  Nicolosi = (function() {
    var EPS;

    __extends(Nicolosi, PseudoCylindrical);

    Nicolosi.title = "Nicolosi Globular Projection";

    Nicolosi.parameters = ['lon0'];

    EPS = 1e-10;

    function Nicolosi(opts) {
      Nicolosi.__super__.constructor.call(this, opts);
      this.r = this.HALFPI * 100;
    }

    Nicolosi.prototype._visible = function(lon, lat) {
      var me;
      me = this;
      lon = me.clon(lon);
      return lon > -90 && lon < 90;
    };

    Nicolosi.prototype.project = function(lon, lat) {
      var c, d, lam, m, me, n, phi, r2, sp, tb, x, y, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lam = me.rad(me.clon(lon));
      phi = me.rad(lat);
      if (Math.abs(lam) < EPS) {
        x = 0;
        y = phi;
      } else if (Math.abs(phi) < EPS) {
        x = lam;
        y = 0;
      } else if (Math.abs(Math.abs(lam) - me.HALFPI) < EPS) {
        x = lam * Math.cos(phi);
        y = me.HALFPI * Math.sin(phi);
      } else if (Math.abs(Math.abs(phi) - me.HALFPI) < EPS) {
        x = 0;
        y = phi;
      } else {
        tb = me.HALFPI / lam - lam / me.HALFPI;
        c = phi / me.HALFPI;
        sp = Math.sin(phi);
        d = (1 - c * c) / (sp - c);
        r2 = tb / d;
        r2 *= r2;
        m = (tb * sp / d - 0.5 * tb) / (1.0 + r2);
        n = (sp / r2 + 0.5 * d) / (1.0 + 1.0 / r2);
        x = Math.cos(phi);
        x = Math.sqrt(m * m + x * x / (1.0 + r2));
        x = me.HALFPI * (m + (lam < 0 ? -x : x));
        y = Math.sqrt(n * n - (sp * sp / r2 + d * sp - 1.0) / (1.0 + 1.0 / r2));
        y = me.HALFPI * (n + (phi < 0 ? y : -y));
      }
      return [x * 100, y * -100];
    };

    Nicolosi.prototype.sea = function() {
      var math, out, phi, r;
      out = [];
      r = this.r;
      math = Math;
      for (phi = 0; phi <= 360; phi++) {
        out.push([math.cos(this.rad(phi)) * r, math.sin(this.rad(phi)) * r]);
      }
      return out;
    };

    Nicolosi.prototype.world_bbox = function() {
      var r;
      r = this.r;
      return new kartograph.BBox(-r, -r, r * 2, r * 2);
    };

    return Nicolosi;

  })();

  __proj['nicolosi'] = Nicolosi;

  Azimuthal = (function() {

    __extends(Azimuthal, Proj);

    /*
        Base class for azimuthal projections
    */

    Azimuthal.parameters = ['lon0', 'lat0'];

    Azimuthal.title = "Azimuthal Projection";

    function Azimuthal(opts, rad) {
      var me;
      if (rad == null) rad = 1000;
      Azimuthal.__super__.constructor.call(this, opts);
      me = this;
      me.r = rad;
      me.elevation0 = me.to_elevation(me.lat0);
      me.azimuth0 = me.to_azimuth(me.lon0);
    }

    Azimuthal.prototype.to_elevation = function(lat) {
      var me;
      me = this;
      return ((lat + 90) / 180) * me.PI - me.HALFPI;
    };

    Azimuthal.prototype.to_azimuth = function(lon) {
      var me;
      me = this;
      return ((lon + 180) / 360) * me.PI * 2 - me.PI;
    };

    Azimuthal.prototype._visible = function(lon, lat) {
      var azimuth, cosc, elevation, math, me;
      me = this;
      math = Math;
      elevation = me.to_elevation(lat);
      azimuth = me.to_azimuth(lon);
      cosc = math.sin(elevation) * math.sin(me.elevation0) + math.cos(me.elevation0) * math.cos(elevation) * math.cos(azimuth - me.azimuth0);
      return cosc >= 0.0;
    };

    Azimuthal.prototype._truncate = function(x, y) {
      var math, r, theta, x1, y1;
      math = Math;
      r = this.r;
      theta = math.atan2(y - r, x - r);
      x1 = r + r * math.cos(theta);
      y1 = r + r * math.sin(theta);
      return [x1, y1];
    };

    Azimuthal.prototype.sea = function() {
      var math, out, phi, r;
      out = [];
      r = this.r;
      math = Math;
      for (phi = 0; phi <= 360; phi++) {
        out.push([r + math.cos(this.rad(phi)) * r, r + math.sin(this.rad(phi)) * r]);
      }
      return out;
    };

    Azimuthal.prototype.world_bbox = function() {
      var r;
      r = this.r;
      return new kartograph.BBox(0, 0, r * 2, r * 2);
    };

    return Azimuthal;

  })();

  Orthographic = (function() {

    __extends(Orthographic, Azimuthal);

    function Orthographic() {
      Orthographic.__super__.constructor.apply(this, arguments);
    }

    /*
        Orthographic Azimuthal Projection
    
        implementation taken from http://www.mccarroll.net/snippets/svgworld/
    */

    Orthographic.title = "Orthographic Projection";

    Orthographic.prototype.project = function(lon, lat) {
      var azimuth, elevation, math, me, x, xo, y, yo;
      me = this;
      math = Math;
      elevation = me.to_elevation(lat);
      azimuth = me.to_azimuth(lon);
      xo = me.r * math.cos(elevation) * math.sin(azimuth - me.azimuth0);
      yo = -me.r * (math.cos(me.elevation0) * math.sin(elevation) - math.sin(me.elevation0) * math.cos(elevation) * math.cos(azimuth - me.azimuth0));
      x = me.r + xo;
      y = me.r + yo;
      return [x, y];
    };

    return Orthographic;

  })();

  __proj['ortho'] = Orthographic;

  LAEA = (function() {

    __extends(LAEA, Azimuthal);

    /*
        Lambert Azimuthal Equal-Area Projection
    
        implementation taken from
        Snyder, Map projections - A working manual
    */

    LAEA.title = "Lambert Azimuthal Equal-Area Projection";

    function LAEA(opts) {
      LAEA.__super__.constructor.call(this, opts);
      this.scale = Math.sqrt(2) * 0.5;
    }

    LAEA.prototype.project = function(lon, lat) {
      var cos, k, lam, math, phi, sin, x, xo, y, yo;
      phi = this.rad(lat);
      lam = this.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      if (false && math.abs(lon - this.lon0) === 180) {
        xo = this.r * 2;
        yo = 0;
      } else {
        k = math.pow(2 / (1 + sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0)), .5);
        k *= this.scale;
        xo = this.r * k * cos(phi) * sin(lam - this.lam0);
        yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      }
      x = this.r + xo;
      y = this.r + yo;
      return [x, y];
    };

    return LAEA;

  })();

  __proj['laea'] = LAEA;

  Stereographic = (function() {

    __extends(Stereographic, Azimuthal);

    function Stereographic() {
      Stereographic.__super__.constructor.apply(this, arguments);
    }

    /*
        Stereographic projection
    
        implementation taken from
        Snyder, Map projections - A working manual
    */

    Stereographic.title = "Stereographic Projection";

    Stereographic.prototype.project = function(lon, lat) {
      var cos, k, k0, lam, math, phi, sin, x, xo, y, yo;
      phi = this.rad(lat);
      lam = this.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      k0 = 0.5;
      k = 2 * k0 / (1 + sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0));
      xo = this.r * k * cos(phi) * sin(lam - this.lam0);
      yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      x = this.r + xo;
      y = this.r + yo;
      return [x, y];
    };

    return Stereographic;

  })();

  __proj['stereo'] = Stereographic;

  Satellite = (function() {

    __extends(Satellite, Azimuthal);

    /*
        General perspective projection, aka Satellite projection
    
        implementation taken from
        Snyder, Map projections - A working manual
    
        up .. angle the camera is turned away from north (clockwise)
        tilt .. angle the camera is tilted
    */

    Satellite.parameters = ['lon0', 'lat0', 'tilt', 'dist', 'up'];

    Satellite.title = "Satellite Projection";

    function Satellite(opts) {
      var lat, lon, xmax, xmin, xy, _ref10, _ref11, _ref12;
      Satellite.__super__.constructor.call(this, {
        lon0: 0,
        lat0: 0
      });
      this.dist = (_ref10 = opts.dist) != null ? _ref10 : 3;
      this.up = this.rad((_ref11 = opts.up) != null ? _ref11 : 0);
      this.tilt = this.rad((_ref12 = opts.tilt) != null ? _ref12 : 0);
      this.scale = 1;
      xmin = Number.MAX_VALUE;
      xmax = Number.MAX_VALUE * -1;
      for (lat = 0; lat <= 179; lat++) {
        for (lon = 0; lon <= 360; lon++) {
          xy = this.project(lon - 180, lat - 90);
          xmin = Math.min(xy[0], xmin);
          xmax = Math.max(xy[0], xmax);
        }
      }
      this.scale = (this.r * 2) / (xmax - xmin);
      Satellite.__super__.constructor.call(this, opts);
      return;
    }

    Satellite.prototype.project = function(lon, lat, alt) {
      var A, H, cos, cos_c, cos_tilt, cos_up, k, lam, math, phi, r, ra, sin, sin_tilt, sin_up, x, xo, xt, y, yo, yt;
      if (alt == null) alt = 0;
      phi = this.rad(lat);
      lam = this.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      r = this.r;
      ra = r * (alt + 6371) / 3671;
      cos_c = sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0);
      k = (this.dist - 1) / (this.dist - cos_c);
      k = (this.dist - 1) / (this.dist - cos_c);
      k *= this.scale;
      xo = ra * k * cos(phi) * sin(lam - this.lam0);
      yo = -ra * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      cos_up = cos(this.up);
      sin_up = sin(this.up);
      cos_tilt = cos(this.tilt);
      sin_tilt = sin(this.tilt);
      H = ra * (this.dist - 1);
      A = ((yo * cos_up + xo * sin_up) * sin(this.tilt / H)) + cos_tilt;
      xt = (xo * cos_up - yo * sin_up) * cos(this.tilt / A);
      yt = (yo * cos_up + xo * sin_up) / A;
      x = r + xt;
      y = r + yt;
      return [x, y];
    };

    Satellite.prototype._visible = function(lon, lat) {
      var azimuth, cosc, elevation, math;
      elevation = this.to_elevation(lat);
      azimuth = this.to_azimuth(lon);
      math = Math;
      cosc = math.sin(elevation) * math.sin(this.elevation0) + math.cos(this.elevation0) * math.cos(elevation) * math.cos(azimuth - this.azimuth0);
      return cosc >= (1.0 / this.dist);
    };

    Satellite.prototype.sea = function() {
      var math, out, phi, r;
      out = [];
      r = this.r;
      math = Math;
      for (phi = 0; phi <= 360; phi++) {
        out.push([r + math.cos(this.rad(phi)) * r, r + math.sin(this.rad(phi)) * r]);
      }
      return out;
    };

    return Satellite;

  })();

  __proj['satellite'] = Satellite;

  EquidistantAzimuthal = (function() {

    __extends(EquidistantAzimuthal, Azimuthal);

    function EquidistantAzimuthal() {
      EquidistantAzimuthal.__super__.constructor.apply(this, arguments);
    }

    /*
        Equidistant projection
    
        implementation taken from
        Snyder, Map projections - A working manual
    */

    EquidistantAzimuthal.title = "Equidistant Azimuthal Projection";

    EquidistantAzimuthal.prototype.project = function(lon, lat) {
      var c, cos, cos_c, k, lam, math, me, phi, sin, x, xo, y, yo;
      me = this;
      phi = me.rad(lat);
      lam = me.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      cos_c = sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0);
      c = math.acos(cos_c);
      k = 0.325 * c / sin(c);
      xo = this.r * k * cos(phi) * sin(lam - this.lam0);
      yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      x = this.r + xo;
      y = this.r + yo;
      return [x, y];
    };

    EquidistantAzimuthal.prototype._visible = function(lon, lat) {
      return true;
    };

    return EquidistantAzimuthal;

  })();

  __proj['equi'] = EquidistantAzimuthal;

  Aitoff = (function() {
    var COSPHI1;

    __extends(Aitoff, PseudoCylindrical);

    /*
        Aitoff projection
    
        implementation taken from
        Snyder, Map projections - A working manual
    */

    Aitoff.title = "Aitoff Projection";

    Aitoff.parameters = ['lon0'];

    COSPHI1 = 0.636619772367581343;

    function Aitoff(opts) {
      var me;
      me = this;
      opts.lat0 = 0;
      Aitoff.__super__.constructor.call(this, opts);
      me.lam0 = 0;
    }

    Aitoff.prototype.project = function(lon, lat) {
      var c, d, lam, me, phi, x, y, _ref10;
      me = this;
      _ref10 = me.ll(lon, lat), lon = _ref10[0], lat = _ref10[1];
      lon = me.clon(lon);
      lam = me.rad(lon);
      phi = me.rad(lat);
      c = 0.5 * lam;
      d = Math.acos(Math.cos(phi) * Math.cos(c));
      if (d !== 0) {
        y = 1.0 / Math.sin(d);
        x = 2.0 * d * Math.cos(phi) * Math.sin(c) * y;
        y *= d * Math.sin(phi);
      } else {
        x = y = 0;
      }
      if (me.winkel) {
        x = (x + lam * COSPHI1) * 0.5;
        y = (y + phi) * 0.5;
      }
      return [x * 1000, y * -1000];
    };

    Aitoff.prototype._visible = function(lon, lat) {
      return true;
    };

    return Aitoff;

  })();

  __proj['aitoff'] = Aitoff;

  Winkel3 = (function() {

    __extends(Winkel3, Aitoff);

    Winkel3.title = "Winkel Tripel Projection";

    function Winkel3(opts) {
      Winkel3.__super__.constructor.call(this, opts);
      this.winkel = true;
    }

    return Winkel3;

  })();

  __proj['winkel3'] = Winkel3;

  Conic = (function() {

    __extends(Conic, Proj);

    Conic.title = "Conic Projection";

    Conic.parameters = ['lon0', 'lat0', 'lat1', 'lat2'];

    function Conic(opts) {
      var self, _ref10, _ref11;
      self = this;
      Conic.__super__.constructor.call(this, opts);
      self.lat1 = (_ref10 = opts.lat1) != null ? _ref10 : 30;
      self.phi1 = self.rad(self.lat1);
      self.lat2 = (_ref11 = opts.lat2) != null ? _ref11 : 50;
      self.phi2 = self.rad(self.lat2);
    }

    Conic.prototype._visible = function(lon, lat) {
      var self;
      self = this;
      return lat > self.minLat && lat < self.maxLat;
    };

    Conic.prototype._truncate = function(x, y) {
      return [x, y];
    };

    Conic.prototype.clon = function(lon) {
      lon -= this.lon0;
      if (lon < -180) {
        lon += 360;
      } else if (lon > 180) {
        lon -= 360;
      }
      return lon;
    };

    return Conic;

  })();

  LCC = (function() {

    __extends(LCC, Conic);

    /*
        Lambert Conformal Conic Projection (spherical)
    */

    LCC.title = "Lambert Conformal Conic Projection";

    function LCC(opts) {
      var abs, c, cos, cosphi, m, n, pow, secant, self, sin, sinphi, tan, _ref10;
      self = this;
      LCC.__super__.constructor.call(this, opts);
      m = Math;
      _ref10 = [m.sin, m.cos, m.abs, m.log, m.tan, m.pow], sin = _ref10[0], cos = _ref10[1], abs = _ref10[2], log = _ref10[3], tan = _ref10[4], pow = _ref10[5];
      self.n = n = sinphi = sin(self.phi1);
      cosphi = cos(self.phi1);
      secant = abs(self.phi1 - self.phi2) >= 1e-10;
      if (secant) {
        n = log(cosphi / cos(self.phi2)) / log(tan(self.QUARTERPI + 0.5 * self.phi2) / tan(self.QUARTERPI + 0.5 * self.phi1));
      }
      self.c = c = cosphi * pow(tan(self.QUARTERPI + .5 * self.phi1), n) / n;
      if (abs(abs(self.phi0) - self.HALFPI) < 1e-10) {
        self.rho0 = 0.0;
      } else {
        self.rho0 = c * pow(tan(self.QUARTERPI + .5 * self.phi0), -n);
      }
      self.minLat = -60;
      self.maxLat = 85;
    }

    LCC.prototype.project = function(lon, lat) {
      var abs, cos, lam, lam_, m, n, phi, pow, rho, self, sin, tan, x, y, _ref10;
      self = this;
      phi = self.rad(lat);
      lam = self.rad(self.clon(lon));
      m = Math;
      _ref10 = [m.sin, m.cos, m.abs, m.log, m.tan, m.pow], sin = _ref10[0], cos = _ref10[1], abs = _ref10[2], log = _ref10[3], tan = _ref10[4], pow = _ref10[5];
      n = self.n;
      if (abs(abs(phi) - self.HALFPI) < 1e-10) {
        rho = 0.0;
      } else {
        rho = self.c * pow(tan(self.QUARTERPI + 0.5 * phi), -n);
      }
      lam_ = lam * n;
      x = 1000 * rho * sin(lam_);
      y = 1000 * (self.rho0 - rho * cos(lam_));
      return [x, y * -1];
    };

    return LCC;

  })();

  __proj['lcc'] = LCC;

  PseudoConic = (function() {

    __extends(PseudoConic, Conic);

    function PseudoConic() {
      PseudoConic.__super__.constructor.apply(this, arguments);
    }

    return PseudoConic;

  })();

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
      if (!(y != null)) {
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
      var bbox, cont, contours, me, new_path, pcont, r, x, y, _i, _j, _len, _len2, _ref10, _ref11, _ref12, _ref13;
      me = this;
      if (path.type === "path") {
        contours = [];
        bbox = [99999, 99999, -99999, -99999];
        _ref10 = path.contours;
        for (_i = 0, _len = _ref10.length; _i < _len; _i++) {
          pcont = _ref10[_i];
          cont = [];
          for (_j = 0, _len2 = pcont.length; _j < _len2; _j++) {
            _ref11 = pcont[_j], x = _ref11[0], y = _ref11[1];
            _ref12 = me.project(x, y), x = _ref12[0], y = _ref12[1];
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
        _ref13 = me.project(path.x, path.y), x = _ref13[0], y = _ref13[1];
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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if ((_ref10 = root.kartograph) == null) root.kartograph = {};

  root.kartograph.View = View;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = root.$K = (_ref11 = root.kartograph) != null ? _ref11 : root.kartograph = {};

  kartograph.Kartograph.prototype.choropleth = function(opts) {
    var anim, col, colors, data, data_col, data_key, delay, dur, id, layer_id, me, ncol, path, pathData, paths, pd, row, _i, _j, _len, _len2, _ref12, _ref13, _ref14;
    me = this;
    layer_id = (_ref12 = opts.layer) != null ? _ref12 : me.layerIds[me.layerIds.length - 1];
    if (!me.layers.hasOwnProperty(layer_id)) {
      warn('choropleth error: layer "' + layer_ihad + '" not found');
      return;
    }
    data = opts.data;
    data_col = opts.value;
    data_key = opts.key;
    colors = opts.colors;
    pathData = {};
    if ((data_key != null) && __type(data) === "array") {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        row = data[_i];
        id = row[data_key];
        pathData[String(id)] = row;
      }
    } else if (__type(data) === "object") {
      for (id in data) {
        row = data[id];
        pathData[String(id)] = row;
      }
    }
    _ref13 = me.layers[layer_id].pathsById;
    for (id in _ref13) {
      paths = _ref13[id];
      for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
        path = paths[_j];
        if (!(data != null)) pd = path.data;
        if (__type(data) === "function") {
          pd = data(path.data);
        } else {
          pd = (_ref14 = pathData[id]) != null ? _ref14 : null;
        }
        col = colors(pd, path.data);
        if ((opts.duration != null) && opts.duration > 0) {
          if (__type(opts.duration) === "function") {
            dur = opts.duration(pd);
          } else {
            dur = opts.duration;
          }
          if (opts.delay != null) {
            if (__type(opts.delay) === 'function') {
              delay = opts.delay(pd);
            } else {
              delay = opts.delay;
            }
          } else {
            delay = 0;
          }
          if (path.svgPath.attrs['fill'] === "none") {
            ncol = colors(null, path.data);
            path.svgPath.attr('fill', ncol);
          }
          anim = Raphael.animation({
            fill: col
          }, dur);
          path.svgPath.animate(anim.delay(delay));
        } else {
          path.svgPath.attr('fill', col);
        }
      }
    }
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
      GNU General Public License for more details.
  
      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

  kartograph.Kartograph.prototype.dotgrid = function(opts) {
    var anim, data, data_col, data_key, delay, dly, dotgrid, dotstyle, ds, dur, f, g, gridsize, id, layer, layer_id, me, path, pathData, paths, pd, row, size, sizes, x, y, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21, _ref22, _ref23, _ref24;
    me = this;
    layer_id = (_ref12 = opts.layer) != null ? _ref12 : me.layerIds[me.layerIds.length - 1];
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
    dotstyle = (_ref13 = opts.style) != null ? _ref13 : {
      fill: 'black',
      stroke: 'none'
    };
    sizes = opts.size;
    gridsize = (_ref14 = opts.gridsize) != null ? _ref14 : 15;
    dotgrid = (_ref15 = layer.dotgrid) != null ? _ref15 : layer.dotgrid = {
      gridsize: gridsize,
      grid: []
    };
    if (dotgrid.gridsize !== gridsize) {
      _ref16 = dotgrid.grid;
      for (_j = 0, _len2 = _ref16.length; _j < _len2; _j++) {
        g = _ref16[_j];
        if (g.shape != null) {
          g.shape.remove();
          g.shape = null;
        }
      }
    }
    if (gridsize > 0) {
      if (dotgrid.grid.length === 0) {
        for (x = 0, _ref17 = me.viewport.width; 0 <= _ref17 ? x <= _ref17 : x >= _ref17; x += gridsize) {
          for (y = 0, _ref18 = me.viewport.height; 0 <= _ref18 ? y <= _ref18 : y >= _ref18; y += gridsize) {
            g = {
              x: x + (Math.random() - 0.5) * gridsize * 0.2,
              y: y + (Math.random() - 0.5) * gridsize * 0.2,
              pathid: false
            };
            f = false;
            _ref19 = layer.pathsById;
            for (id in _ref19) {
              paths = _ref19[id];
              for (_k = 0, _len3 = paths.length; _k < _len3; _k++) {
                path = paths[_k];
                if (path.vpath.isInside(g.x, g.y)) {
                  f = true;
                  pd = (_ref20 = pathData[id]) != null ? _ref20 : null;
                  size = sizes(pd);
                  g.pathid = id;
                  g.shape = layer.paper.circle(g.x, g.y, 1);
                  break;
                }
              }
              if (f) break;
            }
            dotgrid.grid.push(g);
          }
        }
      }
      _ref21 = dotgrid.grid;
      for (_l = 0, _len4 = _ref21.length; _l < _len4; _l++) {
        g = _ref21[_l];
        if (g.pathid) {
          pd = (_ref22 = pathData[g.pathid]) != null ? _ref22 : null;
          size = sizes(pd);
          dur = (_ref23 = opts.duration) != null ? _ref23 : 0;
          delay = (_ref24 = opts.delay) != null ? _ref24 : 0;
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

  filter = (_ref12 = kartograph.filter) != null ? _ref12 : kartograph.filter = {};

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

  kartograph.Kartograph.prototype.addFilter = function(id, type, params) {
    var doc, fltr, me;
    if (params == null) params = {};
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

  MapLayer.prototype.applyTexture = function(url, w, h, color) {
    var lp, me, _i, _len, _ref13, _results;
    if (color == null) color = '#fff';
    me = this;
    filter.__patternFills += 1;
    _ref13 = me.paths;
    _results = [];
    for (_i = 0, _len = _ref13.length; _i < _len; _i++) {
      lp = _ref13[_i];
      _results.push(lp.svgPath.attr({
        fill: 'url(' + url + ')'
      }));
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

  BlurFilter = (function() {

    __extends(BlurFilter, Filter);

    function BlurFilter() {
      BlurFilter.__super__.constructor.apply(this, arguments);
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

  })();

  filter.blur = BlurFilter;

  GlowFilter = (function() {

    __extends(GlowFilter, Filter);

    function GlowFilter() {
      GlowFilter.__super__.constructor.apply(this, arguments);
    }

    /* combined class for outer and inner glow filter
    */

    GlowFilter.prototype.buildFilter = function(fltr) {
      var alpha, blur, color, inner, knockout, me, rgb, strength, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18;
      me = this;
      blur = (_ref13 = me.params.blur) != null ? _ref13 : 4;
      strength = (_ref14 = me.params.strength) != null ? _ref14 : 1;
      color = (_ref15 = me.params.color) != null ? _ref15 : '#D1BEB0';
      if (typeof color === 'string') color = chroma.hex(color);
      rgb = color.rgb;
      inner = (_ref16 = me.params.inner) != null ? _ref16 : false;
      knockout = (_ref17 = me.params.knockout) != null ? _ref17 : false;
      alpha = (_ref18 = me.params.alpha) != null ? _ref18 : 1;
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

  })();

  filter.glow = GlowFilter;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = root.$K = (_ref13 = root.kartograph) != null ? _ref13 : root.kartograph = {};

  kartograph.Kartograph.prototype.addGeoPath = function(points, cmds, className) {
    var me, path, path_str;
    if (cmds == null) cmds = [];
    if (className == null) className = '';
    /* converts a set of
    */
    me = this;
    path_str = me.getGeoPathStr(points, cmds);
    path = me.paper.path(path_str);
    if (className !== '') path.node.setAttribute('class', className);
    return path;
  };

  kartograph.Kartograph.prototype.getGeoPathStr = function(points, cmds) {
    var cmd, i, me, path_str, pt, xy, _ref14;
    if (cmds == null) cmds = [];
    /* converts a set of
    */
    me = this;
    if (type(cmds) === 'string') cmds = cmds.split("");
    if (cmds.length === 0) cmds.push('M');
    path_str = '';
    for (i in points) {
      pt = points[i];
      cmd = (_ref14 = cmds[i]) != null ? _ref14 : 'L';
      xy = me.lonlat2xy(pt);
      if (isNaN(xy[0]) || isNaN(xy[1])) continue;
      path_str += cmd + xy[0] + ',' + xy[1];
    }
    return path_str;
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
      GNU General Public License for more details.
  
      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

  PanAndZoomControl = (function() {

    function PanAndZoomControl(map) {
      this.zoomOut = __bind(this.zoomOut, this);
      this.zoomIn = __bind(this.zoomIn, this);
      var c, div, mdown, me, mup, zc, zcm, zcp;
      me = this;
      me.map = map;
      c = map.container;
      div = function(className, childNodes) {
        var child, d, _i, _len;
        if (childNodes == null) childNodes = [];
        d = $('<div class="' + className + '" />');
        for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
          child = childNodes[_i];
          d.append(child);
        }
        return d;
      };
      mdown = function(evt) {
        return $(evt.target).addClass('md');
      };
      mup = function(evt) {
        return $(evt.target).removeClass('md');
      };
      zcp = div('plus');
      zcp.mousedown(mdown);
      zcp.mouseup(mup);
      zcp.click(me.zoomIn);
      zcm = div('minus');
      zcm.mousedown(mdown);
      zcm.mouseup(mup);
      zcm.click(me.zoomOut);
      zc = div('zoom-control', [zcp, zcm]);
      c.append(zc);
    }

    PanAndZoomControl.prototype.zoomIn = function(evt) {
      var me;
      me = this;
      me.map.opts.zoom += 1;
      return me.map.resize();
    };

    PanAndZoomControl.prototype.zoomOut = function(evt) {
      var me;
      me = this;
      me.map.opts.zoom -= 1;
      if (me.map.opts.zoom < 1) me.map.opts.zoom = 1;
      return me.map.resize();
    };

    return PanAndZoomControl;

  })();

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

  Scale = (function() {

    /* scales map values to [0..1]
    */

    function Scale(domain, prop, filter) {
      var i, me, val, values;
      if (domain == null) domain = [0, 1];
      if (prop == null) prop = null;
      if (filter == null) filter = null;
      this.scale = __bind(this.scale, this);
      me = this;
      values = [];
      for (i in domain) {
        if (__type(filter) === "function") {
          if (filter(domain[i]) === false) continue;
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
        if (!isNaN(val)) values.push(val);
      }
      values = values.sort(function(a, b) {
        return a - b;
      });
      me.values = values;
    }

    Scale.prototype.scale = function(x) {
      return x;
    };

    return Scale;

  })();

  LinearScale = (function() {

    __extends(LinearScale, Scale);

    function LinearScale() {
      this.scale = __bind(this.scale, this);
      LinearScale.__super__.constructor.apply(this, arguments);
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

  })();

  LogScale = (function() {

    __extends(LogScale, Scale);

    function LogScale() {
      this.scale = __bind(this.scale, this);
      LogScale.__super__.constructor.apply(this, arguments);
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

  })();

  QuantileScale = (function() {

    __extends(QuantileScale, Scale);

    function QuantileScale() {
      this.scale = __bind(this.scale, this);
      QuantileScale.__super__.constructor.apply(this, arguments);
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
        if (x === v) return i / k;
        if (i < k && x > v && x < nv) return i / k + (x - v) / (nv - v);
      }
    };

    return QuantileScale;

  })();

  kartograph.scale = {};

  kartograph.scale.identity = function(s) {
    return new Scale(domain, prop, filter).scale;
  };

  kartograph.scale.linear = function(domain, prop, filter) {
    return new LinearScale(domain, prop, filter).scale;
  };

  kartograph.scale.log = function(domain, prop, filter) {
    return new LogScale(domain, prop, filter).scale;
  };

  kartograph.scale.quantile = function(domain, prop, filter) {
    return new QuantileScale(domain, prop, filter).scale;
  };

  /*
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
      */      return me;
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
      type: kartograph.Bubble,
      radius: function(d) {
          return Math.sqrt(d.murder/d.pop)*5;
      },
      color: '#c00'
  })
  
  Instead of passing lonlat coords as location you may
  pass a string LAYERID.PATHID in order to attach the symbol
  to the center of a certain path.
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
      var SymbolType, d, i, id, l, layer, nid, node, optional, p, required, s, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _o, _ref14, _ref15, _ref16, _ref17, _ref18;
      var _this = this;
      me = this;
      required = ['data', 'location', 'type', 'map'];
      optional = ['filter', 'tooltip', 'layout', 'group', 'click'];
      for (_i = 0, _len = required.length; _i < _len; _i++) {
        p = required[_i];
        if (opts[p] != null) {
          me[p] = opts[p];
        } else {
          throw "SymbolGroup: missing argument '" + p + "'";
        }
      }
      for (_j = 0, _len2 = optional.length; _j < _len2; _j++) {
        p = optional[_j];
        if (opts[p] != null) me[p] = opts[p];
      }
      SymbolType = me.type;
      if (!(SymbolType != null)) {
        warn('could not resolve symbol type', me.type);
        return;
      }
      _ref14 = SymbolType.props;
      for (_k = 0, _len3 = _ref14.length; _k < _len3; _k++) {
        p = _ref14[_k];
        if (opts[p] != null) me[p] = opts[p];
      }
      me.layers = {
        mapcanvas: me.map.paper
      };
      _ref15 = SymbolType.layers;
      for (_l = 0, _len4 = _ref15.length; _l < _len4; _l++) {
        l = _ref15[_l];
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
      _ref16 = me.symbols;
      for (_m = 0, _len5 = _ref16.length; _m < _len5; _m++) {
        s = _ref16[_m];
        s.render();
      }
      if (__type(me.tooltip) === "function") me.initTooltips();
      if (__type(me.click) === "function") {
        _ref17 = me.symbols;
        for (_n = 0, _len6 = _ref17.length; _n < _len6; _n++) {
          s = _ref17[_n];
          _ref18 = s.nodes();
          for (_o = 0, _len7 = _ref18.length; _o < _len7; _o++) {
            node = _ref18[_o];
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
      /* adds a new symbol to this group
      */
      var SymbolType, ll, p, sprops, symbol, _i, _len, _ref14;
      me = this;
      SymbolType = me.type;
      ll = me._evaluate(me.location, data);
      if (__type(ll) === 'array') ll = new kartograph.LonLat(ll[0], ll[1]);
      sprops = {
        layers: me.layers,
        location: ll,
        data: data,
        map: me.map
      };
      _ref14 = SymbolType.props;
      for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
        p = _ref14[_i];
        if (me[p] != null) sprops[p] = me._evaluate(me[p], data);
      }
      symbol = new SymbolType(sprops);
      me.symbols.push(symbol);
      return symbol;
    };

    SymbolGroup.prototype._evaluate = function(prop, data) {
      /* evaluates a property function or returns a static value
      */
      var val;
      if (__type(prop) === 'function') {
        return val = prop(data);
      } else {
        return val = prop;
      }
    };

    SymbolGroup.prototype.layoutSymbols = function() {
      var layer_id, ll, path, path_id, s, xy, _i, _len, _ref14, _ref15;
      _ref14 = me.symbols;
      for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
        s = _ref14[_i];
        ll = s.location;
        if (__type(ll) === 'string') {
          _ref15 = ll.split('.'), layer_id = _ref15[0], path_id = _ref15[1];
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
      if (me.layout === 'group') return me.groupLayout();
    };

    SymbolGroup.prototype.groupLayout = function() {
      /*
              layouts symbols in this group, eventually adds new 'grouped' symbols
              map.addSymbols({
                  layout: "group",
                  group: function(data) {
                      // compresses a list of data objects into a single one
                      // typically you want to calculate the mean position, sum value or something here
                  }
              })
      */
      var overlap, _ref14;
      me = this;
      if ((_ref14 = me.gsymbols) == null) me.gsymbols = [];
      return overlap = true;
    };

    SymbolGroup.prototype.initTooltips = function() {
      var cfg, node, s, tooltips, tt, _i, _j, _len, _len2, _ref14, _ref15;
      me = this;
      tooltips = me.tooltip;
      _ref14 = me.symbols;
      for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
        s = _ref14[_i];
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
        _ref15 = s.nodes();
        for (_j = 0, _len2 = _ref15.length; _j < _len2; _j++) {
          node = _ref15[_j];
          $(node).qtip(cfg);
        }
      }
    };

    SymbolGroup.prototype.remove = function() {
      var id, layer, s, _i, _len, _ref14, _ref15, _results;
      me = this;
      _ref14 = me.symbols;
      for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
        s = _ref14[_i];
        try {
          s.clear();
        } catch (error) {
          warn('error: symbolgroup.remove');
        }
      }
      _ref15 = me.layers;
      _results = [];
      for (id in _ref15) {
        layer = _ref15[id];
        if (id !== "mapcanvas") {
          _results.push(layer.remove());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SymbolGroup.prototype.onResize = function() {
      var s, _i, _len, _ref14, _results;
      me = this;
      me.layoutSymbols();
      _ref14 = me.symbols;
      _results = [];
      for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
        s = _ref14[_i];
        _results.push(s.update());
      }
      return _results;
    };

    return SymbolGroup;

  })();

  SymbolGroup._layerid = 0;

  kartograph.SymbolGroup = SymbolGroup;

  kartograph.Kartograph.prototype.addSymbols = function(opts) {
    opts.map = this;
    return new SymbolGroup(opts);
  };

  /*
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
  */

  Bubble = (function() {

    __extends(Bubble, Symbol);

    function Bubble(opts) {
      var me, _ref14, _ref15, _ref16;
      me = this;
      Bubble.__super__.constructor.call(this, opts);
      me.radius = (_ref14 = opts.radius) != null ? _ref14 : 4;
      me.style = (_ref15 = opts.style) != null ? _ref15 : '';
      me.title = opts.title;
      me["class"] = (_ref16 = opts["class"]) != null ? _ref16 : 'bubble';
    }

    Bubble.prototype.overlaps = function(bubble) {
      var dx, dy, me, r1, r2, x1, x2, y1, y2, _ref14, _ref15;
      me = this;
      _ref14 = [me.x, me.y, me.radius], x1 = _ref14[0], y1 = _ref14[1], r1 = _ref14[2];
      _ref15 = [bubble.x, bubble.y, bubble.radius], x2 = _ref15[0], y2 = _ref15[1], r2 = _ref15[2];
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
      me.path = me.layers.mapcanvas.circle(me.x, me.y, me.radius);
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
      if (me.title != null) path.attr('title', me.title);
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

  Bubble.props = ['radius', 'style', 'class', 'title'];

  Bubble.layers = [];

  kartograph.Bubble = Bubble;

  /*
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
  */

  Icon = (function() {

    __extends(Icon, kartograph.Symbol);

    function Icon(opts) {
      var me, _ref14, _ref15, _ref16, _ref17, _ref18;
      me = this;
      Icon.__super__.constructor.call(this, opts);
      me.icon = (_ref14 = opts.icon) != null ? _ref14 : '';
      me.offset = (_ref15 = opts.offset) != null ? _ref15 : [0, 0];
      me.iconsize = (_ref16 = opts.iconsize) != null ? _ref16 : [10, 10];
      me["class"] = (_ref17 = opts["class"]) != null ? _ref17 : '';
      me.title = (_ref18 = opts.title) != null ? _ref18 : '';
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

  /*
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
  */

  SvgLabel = (function() {

    __extends(SvgLabel, kartograph.Symbol);

    function SvgLabel(opts) {
      var me, _ref14, _ref15, _ref16, _ref17;
      me = this;
      SvgLabel.__super__.constructor.call(this, opts);
      me.text = (_ref14 = opts.text) != null ? _ref14 : '';
      me.style = (_ref15 = opts.style) != null ? _ref15 : '';
      me["class"] = (_ref16 = opts["class"]) != null ? _ref16 : '';
      me.offset = (_ref17 = opts.offset) != null ? _ref17 : [0, 0];
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

  })();

  SvgLabel.props = ['text', 'style', 'class', 'offset'];

  SvgLabel.layers = [];

  kartograph.Label = SvgLabel;

  HtmlLabel = (function() {

    __extends(HtmlLabel, kartograph.Symbol);

    function HtmlLabel(opts) {
      var me, _ref14, _ref15, _ref16;
      me = this;
      HtmlLabel.__super__.constructor.call(this, opts);
      me.text = (_ref14 = opts.text) != null ? _ref14 : '';
      me.style = (_ref15 = opts.style) != null ? _ref15 : '';
      me["class"] = (_ref16 = opts["class"]) != null ? _ref16 : '';
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

  /*
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
  */

  PieChart = (function() {
    var me;

    __extends(PieChart, Symbol);

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
      var _base3, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21, _ref22;
      me = this;
      PieChart.__super__.constructor.call(this, opts);
      me.radius = (_ref14 = opts.radius) != null ? _ref14 : 4;
      me.styles = (_ref15 = opts.styles) != null ? _ref15 : '';
      me.colors = (_ref16 = opts.colors) != null ? _ref16 : ['#3cc', '#c3c', '#33c', '#cc3'];
      me.titles = (_ref17 = opts.titles) != null ? _ref17 : ['', '', '', '', ''];
      me.values = (_ref18 = opts.values) != null ? _ref18 : [];
      me.border = (_ref19 = opts.border) != null ? _ref19 : false;
      me.borderWidth = (_ref20 = opts.borderWidth) != null ? _ref20 : 2;
      me["class"] = (_ref21 = opts["class"]) != null ? _ref21 : 'piechart';
      if ((_ref22 = (_base3 = Raphael.fn).pieChart) == null) {
        _base3.pieChart = drawPieChart;
      }
    }

    PieChart.prototype.overlaps = function(bubble) {
      var dx, dy, r1, r2, x1, x2, y1, y2, _ref14, _ref15;
      _ref14 = [me.x, me.y, me.radius], x1 = _ref14[0], y1 = _ref14[1], r1 = _ref14[2];
      _ref15 = [bubble.x, bubble.y, bubble.radius], x2 = _ref15[0], y2 = _ref15[1], r2 = _ref15[2];
      if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
        return false;
      }
      dx = x1 - x2;
      dy = y1 - y2;
      if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) return false;
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
      if (me.title != null) path.attr('title', me.titles[0]);
      return me;
    };

    PieChart.prototype.clear = function() {
      var p, _i, _len, _ref14;
      me = this;
      _ref14 = me.chart;
      for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
        p = _ref14[_i];
        p.remove();
      }
      return me;
    };

    PieChart.prototype.nodes = function() {
      return [me.path.node];
    };

    return PieChart;

  })();

  PieChart.props = ['radius', 'values', 'styles', 'class', 'titles', 'colors', 'border', 'borderWidth'];

  PieChart.layers = [];

  kartograph.PieChart = PieChart;

  /*
  pie chart extension for RaphaelJS
  */

  drawPieChart = function(cx, cy, r, values, labels, colors, stroke) {
    var angle, chart, i, paper, process, rad, sector, total, v, _i, _len;
    if (isNaN(cx) || isNaN(cy) || isNaN(r)) return [];
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
  
  drawPieChart = function (cx, cy, r, values, labels, colors, stroke) {
      var paper = this,
          rad = Math.PI / 180,
          chart = this.set();
      function sector(cx, cy, r, startAngle, endAngle, params) {
          var x1 = cx + r * Math.cos(-startAngle * rad),
              x2 = cx + r * Math.cos(-endAngle * rad),
              y1 = cy + r * Math.sin(-startAngle * rad),
              y2 = cy + r * Math.sin(-endAngle * rad);
          return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
      }
      var angle = -270,
          total = 0,
          start = 1,
          process = function (j) {
              var value = values[j],
                  angleplus = 360 * value / total,
                  popangle = angle + (angleplus / 2),
                  color = colors[j],
                  ms = 500,
                  delta = 30,
                  bcolor = Raphael.hsb(start, .6, 1),
                  p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, stroke: stroke, "stroke-width": 1}),
                  txt = paper.text(cx + (r*1.5) * Math.cos(-popangle * rad), cy + (r *1.5) * Math.sin(-popangle * rad), labels[j]).attr({fill: "#000", stroke: "none", opacity: 0, "font-size": 13});
              p.mouseover(function () {
                  p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
                  txt.stop().animate({opacity: 1}, ms, "elastic");
              }).mouseout(function () {
                  p.stop().animate({transform: ""}, ms, "elastic");
                  txt.stop().animate({opacity: 0}, ms);
              });
              angle += angleplus;
              chart.push(p);
              chart.push(txt);
              start -= .4;
          };
      for (var i = 0, ii = values.length; i < ii; i++) {
          total += values[i];
      }
      for (i = ii-1; i >= 0; i--) {
          process(i);
      }
      return chart;
  };
  */

  /*
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

  StackedBarChart = (function() {

    __extends(StackedBarChart, kartograph.Symbol);

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
      var me, _base3, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref20, _ref21;
      me = this;
      StackedBarChart.__super__.constructor.call(this, opts);
      me.styles = (_ref14 = opts.styles) != null ? _ref14 : '';
      me.colors = (_ref15 = opts.colors) != null ? _ref15 : [];
      me.titles = (_ref16 = opts.titles) != null ? _ref16 : ['', '', '', '', ''];
      me.values = (_ref17 = opts.values) != null ? _ref17 : [];
      me.width = (_ref18 = opts.width) != null ? _ref18 : 17;
      me.height = (_ref19 = opts.height) != null ? _ref19 : 30;
      me["class"] = (_ref20 = opts["class"]) != null ? _ref20 : 'barchart';
      if ((_ref21 = (_base3 = Raphael.fn).drawStackedBarChart) == null) {
        _base3.drawStackedBarChart = drawStackedBars;
      }
    }

    StackedBarChart.prototype.overlaps = function(bubble) {
      var dx, dy, me, r1, r2, x1, x2, y1, y2, _ref14, _ref15;
      me = this;
      _ref14 = [me.x, me.y, me.radius], x1 = _ref14[0], y1 = _ref14[1], r1 = _ref14[2];
      _ref15 = [bubble.x, bubble.y, bubble.radius], x2 = _ref15[0], y2 = _ref15[1], r2 = _ref15[2];
      if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
        return false;
      }
      dx = x1 - x2;
      dy = y1 - y2;
      if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) return false;
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
      if (me.title != null) path.attr('title', me.titles[0]);
      return me;
    };

    StackedBarChart.prototype.clear = function() {
      var me, p, _i, _len, _ref14;
      me = this;
      _ref14 = me.chart;
      for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
        p = _ref14[_i];
        p.remove();
      }
      me.chart = [];
      return me;
    };

    StackedBarChart.prototype.nodes = function() {
      var me;
      me = this;
      return [me.path.node];
    };

    return StackedBarChart;

  })();

  StackedBarChart.props = ['values', 'styles', 'class', 'titles', 'colors', 'width', 'height'];

  StackedBarChart.layers = [];

  kartograph.StackedBarChart = StackedBarChart;

}).call(this);
