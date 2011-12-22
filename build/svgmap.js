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

  var CanvasLayer, MapLayer, MapLayerPath, PanAndZoomControl, SVGMap, log, root, svgmap, warn, _ref;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref = root.svgmap) != null ? _ref : root.svgmap = {};

  svgmap.version = "0.4.2";

  warn = function(s) {
    return console.warn('svgmap (' + svgmap.version + '): ' + s);
  };

  log = function(s) {
    return console.log('svgmap (' + svgmap.version + '): ' + s);
  };

  SVGMap = (function() {

    function SVGMap(container) {
      var cnt, me;
      me = this;
      me.container = cnt = $(container);
      me.viewport = new svgmap.BBox(0, 0, cnt.width(), cnt.height());
      me.paper = me.createSVGLayer();
      me.markers = [];
      me.container.addClass('svgmap');
    }

    SVGMap.prototype.createSVGLayer = function(id) {
      var about, cnt, lid, me, paper, svg, vp, _ref2;
      me = this;
      if ((_ref2 = me._layerCnt) == null) me._layerCnt = 0;
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
      if (cnt.css('position') === 'static') cnt.css('position', 'relative');
      svg.addClass(id);
      about = $('desc', paper.canvas).text();
      $('desc', paper.canvas).text(about.replace('with ', 'with svgmap ' + svgmap.version + ' and '));
      return paper;
    };

    SVGMap.prototype.createHTMLLayer = function(id) {
      var cnt, div, me, vp;
      me = this;
      vp = me.viewport;
      cnt = me.container;
      div = $('<div class="layer ' + id + '" />');
      div.css({
        width: vp.width() + 'px',
        height: vp.height() + 'px'
      });
      cnt.append(div);
      return div;
    };

    SVGMap.prototype.loadMap = function(mapurl, callback, opts) {
      var me, _base, _ref2;
      me = this;
      me.opts = opts != null ? opts : {};
      if ((_ref2 = (_base = me.opts).zoom) == null) _base.zoom = 1;
      me.mapLoadCallback = callback;
      $.ajax({
        url: mapurl,
        success: me.mapLoaded,
        context: me
      });
    };

    SVGMap.prototype.addLayer = function(src_id, layer_id, path_id) {
      /*
      		add new layer
      */
      var $paths, layer, me, svgLayer, svg_path, _i, _len, _ref2, _ref3;
      me = this;
      if ((_ref2 = me.layerIds) == null) me.layerIds = [];
      if ((_ref3 = me.layers) == null) me.layers = {};
      if (layer_id == null) layer_id = src_id;
      svgLayer = $('g#' + src_id, me.svgSrc);
      if (svgLayer.length === 0) {
        warn('didn\'t find any paths for layer "' + layer_id + '"');
        return;
      }
      layer = new MapLayer(layer_id, path_id, me.paper, me.viewBC);
      $paths = $('*', svgLayer[0]);
      for (_i = 0, _len = $paths.length; _i < _len; _i++) {
        svg_path = $paths[_i];
        layer.addPath(svg_path);
      }
      if (layer.paths.length > 0) {
        me.layers[layer_id] = layer;
        me.layerIds.push(layer_id);
      } else {
        warn('didn\'t find any paths for layer ' + layer_id);
      }
    };

    SVGMap.prototype.addCanvasLayer = function(src_id, drawCallback) {
      var $paths, canvas, layer, me, svgLayer, svg_path, _i, _len;
      me = this;
      if (!(me.canvas != null)) {
        canvas = $('<canvas />');
        canvas.css({
          position: 'absolute',
          top: '0px',
          left: '0px'
        });
        canvas.attr({
          width: me.viewport.width + 'px',
          height: me.viewport.height + 'px'
        });
        me.container.append(canvas);
        me.canvas = canvas[0];
      }
      svgLayer = $('g#' + src_id, me.svgSrc);
      if (svgLayer.length === 0) {
        warn('didn\'t find any paths for layer "' + layer_id + '"');
        return;
      }
      layer = new CanvasLayer(src_id, me.canvas, me.viewBC, drawCallback);
      $paths = $('*', svgLayer[0]);
      for (_i = 0, _len = $paths.length; _i < _len; _i++) {
        svg_path = $paths[_i];
        layer.addPath(svg_path);
      }
      return layer.render();
    };

    SVGMap.prototype.addLayerEvent = function(event, callback, layerId) {
      var me, path, paths, _i, _len, _results;
      me = this;
      if (layerId == null) layerId = me.layerIds[me.layerIds.length - 1];
      paths = me.layers[layerId].paths;
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push($(path.svgPath.node).bind(event, callback));
      }
      return _results;
    };

    SVGMap.prototype.addMarker = function(marker) {
      var me, xy;
      me = this;
      me.markers.push(marker);
      xy = me.viewBC.project(me.viewAB.project(me.proj.project(marker.lonlat.lon, marker.lonlat.lat)));
      return marker.render(xy[0], xy[1], me.container, me.paper);
    };

    SVGMap.prototype.clearMarkers = function() {
      var marker, me, _i, _len, _ref2;
      me = this;
      _ref2 = me.markers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        marker = _ref2[_i];
        marker.clear();
      }
      return me.markers = [];
    };

    SVGMap.prototype.choropleth = function(opts) {
      var col, colorscale, data, data_col, id, layer_id, me, no_data_color, path, pathData, paths, row, v, _i, _len, _ref2, _ref3, _ref4;
      me = this;
      layer_id = (_ref2 = opts.layer) != null ? _ref2 : me.layerIds[me.layerIds.length - 1];
      if (!me.layers.hasOwnProperty(layer_id)) {
        warn('choropleth error: layer "' + layer_id + '" not found');
        return;
      }
      data = opts.data;
      data_col = opts.key;
      no_data_color = (_ref3 = opts.noDataColor) != null ? _ref3 : '#ccc';
      colorscale = opts.colorscale;
      pathData = {};
      for (id in data) {
        row = data[id];
        pathData[id] = row[data_col];
      }
      _ref4 = me.layers[layer_id].pathsById;
      for (id in _ref4) {
        paths = _ref4[id];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          if ((pathData[id] != null) && colorscale.validValue(pathData[id])) {
            v = pathData[id];
            col = colorscale.getColor(v);
            path.svgPath.node.setAttribute('style', 'fill:' + col);
          } else {
            path.svgPath.node.setAttribute('style', 'fill:' + no_data_color);
          }
        }
      }
    };

    SVGMap.prototype.tooltips = function(opts) {
      var cfg, id, layer_id, me, path, paths, tooltips, tt, _ref2, _ref3, _results;
      me = this;
      tooltips = opts.content;
      layer_id = (_ref2 = opts.layer) != null ? _ref2 : me.layerIds[me.layerIds.length - 1];
      if (!me.layers.hasOwnProperty(layer_id)) {
        warn('tooltips error: layer "' + layer_id + '" not found');
        return;
      }
      _ref3 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref3) {
        paths = _ref3[id];
        _results.push((function() {
          var _i, _len, _results2;
          _results2 = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            path = paths[_i];
            if ($.isFunction(tooltips)) {
              tt = tooltips(id, path);
            } else {
              tt = tooltips[id];
            }
            if (tt != null) {
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
              if (typeof tt === "string") {
                cfg.content.text = tt;
              } else if ($.isArray(tt)) {
                cfg.content.title = tt[0];
                cfg.content.text = tt[1];
              }
              _results2.push($(path.svgPath.node).qtip(cfg));
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        })());
      }
      return _results;
    };

    /*
    		for some reasons, this runs horribly slow in Firefox
    		will use pre-calculated graticules instead
    
    	addGraticule: (lon_step=15, lat_step) ->	
    		self = @
    		lat_step ?= lon_step
    		globe = self.proj
    		v0 = self.viewAB
    		v1 = self.viewBC
    		viewbox = v1.asBBox()
    		
    		grat_lines = []
    		
    		for lat in [0..90] by lat_step
    			lats = if lat == 0 then [0] else [lat, -lat]
    			for lat_ in lats
    				if lat_ < globe.minLat or lat_ > globe.maxLat
    					continue
    				pts = []
    				lines = []
    				for lon in [-180..180]
    					if globe._visible(lon, lat_)
    						xy = v1.project(v0.project(globe.project(lon, lat_)))
    						pts.push xy
    					else
    						if pts.length > 1
    							line = new svgmap.geom.Line(pts)
    							pts = []
    							lines = lines.concat(line.clipToBBox(viewbox))
    				
    				if pts.length > 1
    					line = new svgmap.geom.Line(pts)
    					pts = []
    					lines = lines.concat(line.clipToBBox(viewbox))
    					
    				for line in lines
    					path = self.paper.path(line.toSVG())
    					path.setAttribute('class', 'graticule latitude lat_'+Math.abs(lat_)+(if lat_ < 0 then 'W' else 'E'))
    					grat_lines.push(path)
    */

    SVGMap.prototype.display = function() {
      /*
      		finally displays the svgmap, needs to be called after
      		layer and marker setup is finished
      */      return this.render();
    };

    /* 
    	    end of public API
    */

    SVGMap.prototype.mapLoaded = function(xml) {
      var $view, AB, halign, me, padding, valign, vp, _ref2, _ref3, _ref4;
      me = this;
      me.svgSrc = xml;
      vp = me.viewport;
      $view = $('view', xml)[0];
      me.viewAB = AB = svgmap.View.fromXML($view);
      padding = (_ref2 = me.opts.padding) != null ? _ref2 : 0;
      halign = (_ref3 = me.opts.halign) != null ? _ref3 : 'center';
      valign = (_ref4 = me.opts.valign) != null ? _ref4 : 'center';
      me.viewBC = new svgmap.View(AB.asBBox(), vp.width, vp.height, padding, halign, valign);
      me.proj = svgmap.Proj.fromXML($('proj', $view)[0]);
      return me.mapLoadCallback(me);
    };

    SVGMap.prototype.loadCoastline = function() {
      var me;
      me = this;
      return $.ajax({
        url: 'coastline.json',
        success: me.renderCoastline,
        context: me
      });
    };

    SVGMap.prototype.renderCoastline = function(coastlines) {
      var P, d, i, line, me, p0, p1, pathstr, view0, view1, vp, _i, _len, _ref2, _results;
      me = this;
      P = me.proj;
      vp = me.viewport;
      view0 = me.viewAB;
      view1 = me.viewBC;
      _results = [];
      for (_i = 0, _len = coastlines.length; _i < _len; _i++) {
        line = coastlines[_i];
        pathstr = '';
        for (i = 0, _ref2 = line.length - 2; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
          p0 = line[i];
          p1 = line[i + 1];
          d = 0;
          if (true && P._visible(p0[0], p0[1]) && P._visible(p1[0], p1[1])) {
            p0 = view1.project(view0.project(P.project(p0[0], p0[1])));
            p1 = view1.project(view0.project(P.project(p1[0], p1[1])));
            if (vp.inside(p0[0], p0[1]) || vp.inside(p1[0], p1[1])) {
              pathstr += 'M' + p0[0] + ',' + p0[1] + 'L' + p1[0] + ',' + p1[1];
            }
          }
        }
        if (pathstr !== "") {
          _results.push(me.paper.path(pathstr).attr('opacity', .8));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SVGMap.prototype.onPathEvent = function(evt) {
      /*
      		forwards path events to their callbacks, but attaches the path to
      		the event object
      */
      var me, path;
      me = this;
      path = evt.target.path;
      return me.layerEventCallbacks[path.layer][evt.type](path);
    };

    SVGMap.prototype.resize = function() {
      /*
      		forces redraw of every layer
      */
      var cnt, halign, id, layer, me, padding, valign, vp, zoom, _ref2, _ref3, _ref4, _ref5, _results;
      me = this;
      cnt = me.container;
      me.viewport = vp = new svgmap.BBox(0, 0, cnt.width(), cnt.height());
      me.paper.setSize(vp.width, vp.height);
      vp = me.viewport;
      padding = (_ref2 = me.opts.padding) != null ? _ref2 : 0;
      halign = (_ref3 = me.opts.halign) != null ? _ref3 : 'center';
      valign = (_ref4 = me.opts.valign) != null ? _ref4 : 'center';
      zoom = me.opts.zoom;
      me.viewBC = new svgmap.View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
      _ref5 = me.layers;
      _results = [];
      for (id in _ref5) {
        layer = _ref5[id];
        _results.push(layer.setView(me.viewBC));
      }
      return _results;
    };

    SVGMap.prototype.addFilter = function(id, type, params) {
      var doc, fltr, me;
      if (params == null) params = {};
      me = this;
      doc = window.document;
      if (svgmap.filter[type] != null) {
        fltr = new svgmap.filter[type](params).getFilter(id);
      } else {
        throw 'unknown filter type ' + type;
      }
      return me.paper.defs.appendChild(fltr);
    };

    SVGMap.prototype.applyFilter = function(layer_id, filter_id) {
      var me;
      me = this;
      return $('.polygon.' + layer_id, me.paper.canvas).attr({
        filter: 'url(#' + filter_id + ')'
      });
    };

    SVGMap.prototype.lonlat2xy = function(lonlat) {
      var a, me;
      me = this;
      if (lonlat.length === 2) lonlat = new svgmap.LonLat(lonlat[0], lonlat[1]);
      if (lonlat.length === 3) {
        lonlat = new svgmap.LonLat(lonlat[0], lonlat[1], lonlat[2]);
      }
      a = me.proj.project(lonlat.lon, lonlat.lat, lonlat.alt);
      return me.viewBC.project(me.viewAB.project(a));
    };

    SVGMap.prototype.addGeoPath = function(points, cmds, className) {
      var cmd, i, me, path, path_str, pt, xy, _ref2;
      if (cmds == null) cmds = [];
      if (className == null) className = '';
      me = this;
      if (cmds.length === 0) cmds.push('M');
      path_str = '';
      for (i in points) {
        pt = points[i];
        cmd = (_ref2 = cmds[i]) != null ? _ref2 : 'L';
        xy = me.lonlat2xy(pt);
        path_str += cmd + xy[0] + ',' + xy[1];
      }
      path = me.paper.path(path_str);
      path.node.setAttribute('class', className);
    };

    SVGMap.prototype.showZoomControls = function() {
      var me;
      me = this;
      me.zc = new PanAndZoomControl(me);
      return me;
    };

    return SVGMap;

  })();

  svgmap.SVGMap = SVGMap;

  MapLayer = (function() {

    function MapLayer(layer_id, path_id, paper, view) {
      var me;
      me = this;
      me.id = layer_id;
      me.path_id = path_id;
      me.paper = paper;
      me.view = view;
    }

    MapLayer.prototype.addPath = function(svg_path) {
      var layerPath, me, _base, _name, _ref2, _ref3, _ref4;
      me = this;
      if ((_ref2 = me.paths) == null) me.paths = [];
      layerPath = new MapLayerPath(svg_path, me.id, me.paper, me.view);
      me.paths.push(layerPath);
      if (me.path_id != null) {
        if ((_ref3 = me.pathsById) == null) me.pathsById = {};
        if ((_ref4 = (_base = me.pathsById)[_name = layerPath.data[me.path_id]]) == null) {
          _base[_name] = [];
        }
        return me.pathsById[layerPath.data[me.path_id]].push(layerPath);
      }
    };

    MapLayer.prototype.setView = function(view) {
      /*
      		# after resizing of the map, each layer gets a new view
      */
      var me, path, _i, _len, _ref2, _results;
      me = this;
      _ref2 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        path = _ref2[_i];
        _results.push(path.setView(view));
      }
      return _results;
    };

    return MapLayer;

  })();

  MapLayerPath = (function() {

    function MapLayerPath(svg_path, layer_id, paper, view) {
      var attr, data, i, me, path, _ref2;
      me = this;
      me.path = path = svgmap.geom.Path.fromSVG(svg_path);
      me.svgPath = view.projectPath(path).toSVG(paper);
      me.baseClass = 'polygon ' + layer_id;
      me.svgPath.node.setAttribute('class', me.baseClass);
      me.svgPath.node.path = me;
      data = {};
      for (i = 0, _ref2 = svg_path.attributes.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        attr = svg_path.attributes[i];
        if (attr.name.substr(0, 5) === "data-") {
          data[attr.name.substr(5)] = attr.value;
        }
      }
      me.data = data;
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
      var me, path, _ref2;
      me = this;
      if ((_ref2 = me.paths) == null) me.paths = [];
      path = svgmap.geom.Path.fromSVG(svg_path);
      return me.paths.push(path);
    };

    CanvasLayer.prototype.render = function() {
      var me, path, paths, _i, _len, _ref2;
      me = this;
      paths = [];
      _ref2 = me.paths;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        path = _ref2[_i];
        paths.push(me.view.projectPath(path));
      }
      return me.renderCallback(me, paths);
    };

    CanvasLayer.prototype.drawPaths = function() {
      var c, contour, me, path, pt, _i, _len, _ref2, _results;
      me = this;
      c = me.canvas.getContext('2d');
      _ref2 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        path = _ref2[_i];
        path = me.view.projectPath(path);
        _results.push((function() {
          var _j, _len2, _ref3, _results2;
          _ref3 = path.contours;
          _results2 = [];
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            contour = _ref3[_j];
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

}).call(this);
