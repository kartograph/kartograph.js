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

  var SVGMap, root, svgmap, _ref;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref = root.svgmap) != null ? _ref : root.svgmap = {};

  svgmap.version = "0.1.0";

  /*
  Usage:
  
  svgmap = new SVGMap(container);
  
  // load a new map, will reset everything, so you need to setup the layers again
  
  svgmap.loadMap('map.svg', function(layers) {
  	svgmap.addLayer('sea');
  	svgmap.addLayer('countries','country_bg');
  	svgmap.addLayer('graticule');
  	svgmap.addLayer('countries');
  });
  
  // setup layers
  
  // load data
  */

  SVGMap = (function() {

    function SVGMap(container) {
      var cnt, me, vp;
      me = this;
      me.container = cnt = $(container);
      me.viewport = vp = new svgmap.BBox(0, 0, cnt.width(), cnt.height());
      me.paper = Raphael(cnt[0], vp.width, vp.height);
      me.layers = [];
      me.markers = [];
    }

    SVGMap.prototype.loadMap = function(mapurl, callback) {
      var me;
      me = this;
      me.mapLoadCallback = callback;
      $.ajax({
        url: mapurl,
        success: me.mapLoaded,
        context: me
      });
    };

    SVGMap.prototype.addLayer = function(src_id, layer_id) {
      var $layer, $paths, attr, data, i, layerPath, me, path, path_str, svg, svg_path, _i, _len, _ref2, _ref3, _results;
      me = this;
      if (layer_id == null) layer_id = src_id;
      if ((_ref2 = me.layerPaths) == null) me.layerPaths = {};
      me.layerPaths[layer_id] = [];
      svg = me.svgSrc;
      $layer = $('g#' + src_id, svg)[0];
      $paths = $('path', $layer);
      _results = [];
      for (_i = 0, _len = $paths.length; _i < _len; _i++) {
        svg_path = $paths[_i];
        layerPath = {
          layer: layer_id
        };
        path_str = svg_path.getAttribute('d');
        path = svgmap.Path.fromSVG(path_str);
        layerPath.path = path;
        layerPath.svgPath = me.paper.path(me.viewBC.projectPath(path).toSVG());
        layerPath.svgPath.node.setAttribute('class', 'polygon ' + layer_id);
        layerPath.svgPath.node.path = layerPath;
        data = {};
        for (i = 0, _ref3 = svg_path.attributes.length - 1; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
          attr = svg_path.attributes[i];
          if (attr.name.substr(0, 5) === "data-") {
            data[attr.name.substr(5)] = attr.value;
          }
        }
        layerPath.data = data;
        _results.push(me.layerPaths[layer_id].push(layerPath));
      }
      return _results;
    };

    SVGMap.prototype.addLayerEvent = function(layer_id, event, callback) {
      var me, path, paths, _i, _len, _results;
      me = this;
      /*
      		me.layerEventCallbacks ?= {}
      		me.layerEventCallbacks[layer_id] ?= {}
      		me.layerEventCallbacks[layer_id][event] = callback
      */
      paths = me.layerPaths[layer_id];
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

    SVGMap.prototype.choropleth = function(layer_id, data, id_col, data_col, colorscale) {
      var col, d, id, me, path, pathData, paths, v, _i, _j, _len, _len2, _results;
      me = this;
      colorscale.parseData(data, data_col);
      pathData = {};
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        pathData[d[id_col]] = d[data_col];
      }
      paths = me.layerPaths[layer_id];
      _results = [];
      for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
        path = paths[_j];
        id = path.data[id_col];
        if (pathData[id] != null) {
          v = pathData[id];
          col = colorscale.getColor(v);
          _results.push(path.svgPath.node.setAttribute('style', 'fill:' + col));
        } else {
          _results.push(path.svgPath.node.setAttribute('style', 'fill:#ccc'));
        }
      }
      return _results;
    };

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
      var $view, AB, me, vp;
      me = this;
      me.svgSrc = xml;
      vp = me.viewport;
      $view = $('view', xml)[0];
      me.viewAB = AB = svgmap.View.fromXML($view);
      me.viewBC = new svgmap.View(AB.asBBox(), vp.width, vp.height);
      me.proj = svgmap.Proj.fromXML($('proj', $view)[0]);
      return me.mapLoadCallback();
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

    return SVGMap;

  })();

  svgmap.SVGMap = SVGMap;

}).call(this);
