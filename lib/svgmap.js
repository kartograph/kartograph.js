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

  var Balloon, IconMarker, LabelMarker, LatLon, LonLat, MapMarker, SVGMap, root, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if ((_ref = root.svgmap) == null) root.svgmap = {};

  root.svgmap.version = "0.1.0";

  /*
  
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
      var me;
      me = this;
      me.container = $(container);
      me.layers = [];
    }

    SVGMap.prototype.loadMap = function(url, callback) {
      var me;
      me = this;
      me.mapLoadCallback = callback;
      return $.ajax({
        src: url,
        onSuccess: me.mapLoaded
      });
    };

    SVGMap.prototype.addLayer = function(id, new_id) {
      var layer;
      if (new_id == null) new_id = id;
      layer = {
        id: new_id,
        src: id,
        paths: p
      };
      return this.layers.push(layer);
    };

    SVGMap.prototype.addMarker = function(marker) {};

    SVGMap.prototype.display = function() {
      /*
      		finally displays the svgmap, needs to be called after
      		layer and marker setup is finished
      */
    };

    /*
    	end of public API
    */

    SVGMap.prototype.mapLoaded = function(response) {};

    SVGMap.prototype.render = function() {};

    SVGMap.prototype.project = function(lon, lat) {};

    return SVGMap;

  })();

  /*
  Marker concept:
  - markers have to be registered in SVGMap instance
  - markers render their own content (output html code)
  - SVGMap will position marker div over map
  - marker will handle events
  */

  MapMarker = (function() {

    function MapMarker(lonlat, content, offset) {
      if (offset == null) offset = [0, 0];
      /*
      		lonlat - array [lon,lat]
      		content - html code that will be placed inside a <div class="marker"> which then will be positioned at the corresponding map position
      		offset - x and y offset for the marker
      */
    }

    return MapMarker;

  })();

  LabelMarker = (function() {

    __extends(LabelMarker, MapMarker);

    /*
    	a simple label
    */

    function LabelMarker(lonlat, label) {}

    return LabelMarker;

  })();

  IconMarker = (function() {

    __extends(IconMarker, MapMarker);

    /*
    */

    function IconMarker(lonlat, icon) {}

    return IconMarker;

  })();

  Balloon = (function() {

    function Balloon() {}

    /*
    	opens a 'singleton' Balloon at a defined geo-location
    	balloons may contain arbitrary html content
    	balloons are 100% css-styled
    */

    return Balloon;

  })();

  LonLat = (function() {

    function LonLat(lon, lat) {
      this.lon = lon;
      this.lat = lat;
    }

    return LonLat;

  })();

  LatLon = (function() {

    __extends(LatLon, LonLat);

    function LatLon(lat, lon) {
      LatLon.__super__.constructor.call(this, lon, lat);
    }

    return LatLon;

  })();

  root.svgmap.LonLat = LonLat;

  root.svgmap.LatLon = LatLon;

}).call(this);
