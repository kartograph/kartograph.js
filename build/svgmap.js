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
      console.log('loadMap', mapurl);
      $.ajax({
        url: mapurl,
        success: me.mapLoaded,
        context: me
      });
    };

    SVGMap.prototype.addLayer = function(src_id, new_id) {
      var $layer, $paths, contour_str, layer, me, out_contour, out_contours, out_path, path, path_str, pt_str, svg, x, xy, y, _i, _j, _k, _len, _len2, _len3, _ref2, _ref3, _ref4;
      me = this;
      if (new_id == null) new_id = src_id;
      svg = me.svgSrc;
      $layer = $('g#' + src_id, svg)[0];
      $paths = $('path', $layer);
      for (_i = 0, _len = $paths.length; _i < _len; _i++) {
        path = $paths[_i];
        path_str = path.getAttribute('d');
        out_contours = [];
        _ref2 = path_str.split('M');
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          contour_str = _ref2[_j];
          out_contour = '';
          if (contour_str !== "") {
            _ref3 = contour_str.substr(0, contour_str.length - 1).split('L');
            for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
              pt_str = _ref3[_k];
              _ref4 = pt_str.split(','), x = _ref4[0], y = _ref4[1];
              xy = me.viewBC.project(x, y);
              if (out_contour !== "") out_contour += 'L';
              out_contour += xy[0] + ',' + xy[1];
            }
          }
          out_contours.push(out_contour);
        }
        out_path = out_contours.join('M') + 'Z';
        me.paper.path(out_path).node.setAttribute('class', 'polygon ' + new_id);
      }
      layer = {
        id: new_id,
        src: src_id
      };
      return me.layers.push(layer);
    };

    SVGMap.prototype.addMarker = function(marker) {
      var me, xy;
      me = this;
      me.markers.push(marker);
      xy = me.viewBC.project(me.viewAB.project(me.proj.project(marker.lonlat.lon, marker.lonlat.lat)));
      return marker.render(xy[0], xy[1], me.container, me.paper);
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
      console.log(me.viewAB, me.viewBC);
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

    SVGMap.prototype.render = function() {};

    SVGMap.prototype.project = function(lon, lat) {};

    return SVGMap;

  })();

  svgmap.SVGMap = SVGMap;

}).call(this);
