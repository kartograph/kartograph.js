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

  var CanvasLayer, Kartograph, MapLayer, MapLayerPath, kartograph, log, map_layer_path_uid, root, warn, __type, _base, _ref, _ref2, _ref3;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = root.$K = (_ref = root.kartograph) != null ? _ref : root.kartograph = {};

  kartograph.version = "0.4.6";

  warn = function(s) {
    return console.warn('kartograph (' + kartograph.version + '): ' + s);
  };

  log = function(s) {
    return console.log('kartograph (' + kartograph.version + '): ' + s);
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

  Kartograph = (function() {

    function Kartograph(container, width, height) {
      var cnt, me;
      me = this;
      me.container = cnt = $(container);
      if (width == null) width = cnt.width();
      if (height == null) height = cnt.height();
      if (height === 0) height = width * .5;
      me.viewport = new kartograph.BBox(0, 0, width, height);
      me.paper = me.createSVGLayer();
      me.markers = [];
      me.pathById = {};
      me.container.addClass('kartograph');
    }

    Kartograph.prototype.createSVGLayer = function(id) {
      var about, cnt, lid, me, paper, svg, vp, _ref3;
      me = this;
      if ((_ref3 = me._layerCnt) == null) me._layerCnt = 0;
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
      var cnt, div, lid, me, vp, _ref3;
      me = this;
      vp = me.viewport;
      cnt = me.container;
      if ((_ref3 = me._layerCnt) == null) me._layerCnt = 0;
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
      var me, _base2, _ref3;
      me = this;
      me.clear();
      me.opts = opts != null ? opts : {};
      if ((_ref3 = (_base2 = me.opts).zoom) == null) _base2.zoom = 1;
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
      var $view, AB, halign, me, padding, valign, vp, _ref3, _ref4, _ref5, _ref6;
      me = this;
      if (me.cacheMaps) {
        if ((_ref3 = kartograph.__mapCache) == null) kartograph.__mapCache = {};
        kartograph.__mapCache[me._lastMapUrl] = xml;
      }
      try {
        xml = $(xml);
      } catch (err) {
        console.error('something went wrong while parsing svg');
        return;
      }
      me.svgSrc = xml;
      vp = me.viewport;
      $view = $('view', xml)[0];
      me.viewAB = AB = kartograph.View.fromXML($view);
      padding = (_ref4 = me.opts.padding) != null ? _ref4 : 0;
      halign = (_ref5 = me.opts.halign) != null ? _ref5 : 'center';
      valign = (_ref6 = me.opts.valign) != null ? _ref6 : 'center';
      me.viewBC = new kartograph.View(AB.asBBox(), vp.width, vp.height, padding, halign, valign);
      me.proj = kartograph.Proj.fromXML($('proj', $view)[0]);
      return me.mapLoadCallback(me);
    };

    Kartograph.prototype.addLayer = function(src_id, layer_id, path_id) {
      /*
      		add new layer
      */
      var $paths, checkEvents, evt, layer, me, opts, svgLayer, svg_path, titles, _i, _j, _len, _len2, _ref3, _ref4;
      me = this;
      if ((_ref3 = me.layerIds) == null) me.layerIds = [];
      if ((_ref4 = me.layers) == null) me.layers = {};
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
      var marker, me, _i, _len, _ref3;
      me = this;
      _ref3 = me.markers;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        marker = _ref3[_i];
        marker.clear();
      }
      return me.markers = [];
    };

    Kartograph.prototype.tooltips = function(opts) {
      var cfg, id, layer_id, me, path, paths, tooltips, tt, _ref3, _ref4, _results;
      me = this;
      tooltips = opts.content;
      layer_id = (_ref3 = opts.layer) != null ? _ref3 : me.layerIds[me.layerIds.length - 1];
      if (!me.layers.hasOwnProperty(layer_id)) {
        warn('tooltips error: layer "' + layer_id + '" not found');
        return;
      }
      _ref4 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref4) {
        paths = _ref4[id];
        _results.push((function() {
          var _i, _len, _ref5, _results2;
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
                delay: (_ref5 = opts.delay) != null ? _ref5 : 20
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
      var dur, duration, id, layer_id, me, path, paths, _ref3, _ref4, _ref5, _results;
      if (opts == null) opts = {};
      me = this;
      layer_id = (_ref3 = opts.layer) != null ? _ref3 : me.layerIds[me.layerIds.length - 1];
      duration = (_ref4 = opts.duration) != null ? _ref4 : 500;
      _ref5 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref5) {
        paths = _ref5[id];
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
      var cnt, halign, id, layer, me, padding, sg, valign, vp, zoom, _i, _len, _ref3, _ref4, _ref5, _ref6, _ref7;
      me = this;
      cnt = me.container;
      if (w == null) w = cnt.width();
      if (h == null) h = cnt.height();
      me.viewport = vp = new kartograph.BBox(0, 0, w, h);
      me.paper.setSize(vp.width, vp.height);
      vp = me.viewport;
      padding = (_ref3 = me.opts.padding) != null ? _ref3 : 0;
      halign = (_ref4 = me.opts.halign) != null ? _ref4 : 'center';
      valign = (_ref5 = me.opts.valign) != null ? _ref5 : 'center';
      zoom = me.opts.zoom;
      me.viewBC = new kartograph.View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
      _ref6 = me.layers;
      for (id in _ref6) {
        layer = _ref6[id];
        layer.setView(me.viewBC);
      }
      if (me.symbolGroups != null) {
        _ref7 = me.symbolGroups;
        for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
          sg = _ref7[_i];
          sg.onResize();
        }
      }
    };

    Kartograph.prototype.addFilter = function(id, type, params) {
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

    Kartograph.prototype.applyFilter = function(layer_id, filter_id) {
      var me;
      me = this;
      return $('.polygon.' + layer_id, me.paper.canvas).attr({
        filter: 'url(#' + filter_id + ')'
      });
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

    Kartograph.prototype.addGeoPath = function(points, cmds, className) {
      var cmd, i, me, path, path_str, pt, xy, _ref3;
      if (cmds == null) cmds = [];
      if (className == null) className = '';
      me = this;
      if (cmds.length === 0) cmds.push('M');
      path_str = '';
      for (i in points) {
        pt = points[i];
        cmd = (_ref3 = cmds[i]) != null ? _ref3 : 'L';
        xy = me.lonlat2xy(pt);
        path_str += cmd + xy[0] + ',' + xy[1];
      }
      path = me.paper.path(path_str);
      path.node.setAttribute('class', className);
    };

    Kartograph.prototype.showZoomControls = function() {
      var me;
      me = this;
      me.zc = new PanAndZoomControl(me);
      return me;
    };

    Kartograph.prototype.addSymbolGroup = function(symbolgroup) {
      var me, _ref3;
      me = this;
      if ((_ref3 = me.symbolGroups) == null) me.symbolGroups = [];
      return me.symbolGroups.push(symbolgroup);
    };

    Kartograph.prototype.clear = function() {
      var id, me, sg, _i, _len, _ref3;
      me = this;
      if (me.layers != null) {
        for (id in me.layers) {
          me.layers[id].remove();
        }
        me.layers = {};
        me.layerIds = [];
      }
      if (me.symbolGroups != null) {
        _ref3 = me.symbolGroups;
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          sg = _ref3[_i];
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
      var classes, k, me, p, props, sel, selectors, _i, _j, _len, _len2, _ref3, _ref4, _ref5, _ref6;
      me = this;
      if (!(me.styles != null)) return el;
      if ((_ref3 = me._pathTypes) == null) {
        me._pathTypes = ["path", "circle", "rectangle", "ellipse"];
      }
      if ((_ref4 = me._regardStyles) == null) {
        me._regardStyles = ["fill", "stroke", "fill-opacity", "stroke-width", "stroke-opacity"];
      }
      for (sel in me.styles) {
        p = sel;
        _ref5 = p.split(',');
        for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
          selectors = _ref5[_i];
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
          _ref6 = me._regardStyles;
          for (_j = 0, _len2 = _ref6.length; _j < _len2; _j++) {
            k = _ref6[_j];
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
    return new Kartograph(container, width, height);
  };

  kartograph.__mapCache = {};

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
      var layerPath, me, _base2, _name, _ref3, _ref4, _ref5;
      me = this;
      if ((_ref3 = me.paths) == null) me.paths = [];
      layerPath = new MapLayerPath(svg_path, me.id, me.map, titles);
      if (__type(me.filter) === 'function') {
        if (me.filter(layerPath.data) === false) {
          layerPath.remove();
          return;
        }
      }
      me.paths.push(layerPath);
      if (me.path_id != null) {
        if ((_ref4 = me.pathsById) == null) me.pathsById = {};
        if ((_ref5 = (_base2 = me.pathsById)[_name = layerPath.data[me.path_id]]) == null) {
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
      var me, path, _i, _len, _ref3, _results;
      me = this;
      _ref3 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        path = _ref3[_i];
        _results.push(path.setView(view));
      }
      return _results;
    };

    MapLayer.prototype.remove = function() {
      /*
      		removes every path
      */
      var me, path, _i, _len, _ref3, _results;
      me = this;
      _ref3 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        path = _ref3[_i];
        _results.push(path.remove());
      }
      return _results;
    };

    return MapLayer;

  })();

  map_layer_path_uid = 0;

  MapLayerPath = (function() {

    function MapLayerPath(svg_path, layer_id, map, titles) {
      var attr, data, i, me, paper, path, title, uid, view, _ref3;
      me = this;
      paper = map.paper;
      view = map.viewBC;
      me.path = path = kartograph.geom.Path.fromSVG(svg_path);
      me.svgPath = view.projectPath(path).toSVG(paper);
      if (!(map.styles != null)) {
        me.svgPath.node.setAttribute('class', layer_id);
      } else {
        map.applyStyles(me.svgPath, layer_id);
      }
      uid = 'path_' + map_layer_path_uid++;
      me.svgPath.node.setAttribute('id', uid);
      map.pathById[uid] = me;
      data = {};
      for (i = 0, _ref3 = svg_path.attributes.length - 1; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
        attr = svg_path.attributes[i];
        if (attr.name.substr(0, 5) === "data-") {
          data[attr.name.substr(5)] = attr.value;
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

  CanvasLayer = (function() {

    function CanvasLayer(layer_id, canvas, view, renderCallback) {
      var me;
      me = this;
      me.layer_id = layer_id;
      me.canvas = canvas;
      me.view = view;
      me.renderCallback = renderCallback;
    }

    CanvasLayer.prototype.addPath = function(svg_path) {
      var me, path, _ref3;
      me = this;
      if ((_ref3 = me.paths) == null) me.paths = [];
      path = kartograph.geom.Path.fromSVG(svg_path);
      return me.paths.push(path);
    };

    CanvasLayer.prototype.render = function() {
      var me, path, paths, _i, _len, _ref3;
      me = this;
      paths = [];
      _ref3 = me.paths;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        path = _ref3[_i];
        paths.push(me.view.projectPath(path));
      }
      return me.renderCallback(me, paths);
    };

    CanvasLayer.prototype.drawPaths = function() {
      var c, contour, me, path, pt, _i, _len, _ref3, _results;
      me = this;
      c = me.canvas.getContext('2d');
      _ref3 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        path = _ref3[_i];
        path = me.view.projectPath(path);
        _results.push((function() {
          var _j, _len2, _ref4, _results2;
          _ref4 = path.contours;
          _results2 = [];
          for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
            contour = _ref4[_j];
            contour.reverse();
            _results2.push((function() {
              var _k, _len3, _results3;
              _results3 = [];
              for (_k = 0, _len3 = contour.length; _k < _len3; _k++) {
                pt = contour[_k];
                if (pt === contour[0]) {
                  _results3.push(c.moveTo(pt[0], pt[1]));
                } else {
                  _results3.push(c.lineTo(pt[0], pt[1]));
                }
              }
              return _results3;
            })());
          }
          return _results2;
        })());
      }
      return _results;
    };

    return CanvasLayer;

  })();

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

  if ((_ref3 = root.__type) == null) root.__type = __type;

}).call(this);
