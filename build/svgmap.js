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
      var me;
      me = this;
      me.container = $(container);
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

    SVGMap.prototype.addMarker = function(marker) {
      var me;
      me = this;
      return me.markers.push(marker);
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

    SVGMap.prototype.mapLoaded = function(response) {
      var me;
      me = this;
      me.svgSrc = response;
      console.log(response);
      me.proj = svgmap.Proj.fromXML($('proj', response)[0]);
      return me.mapLoadCallback();
    };

    SVGMap.prototype.render = function() {};

    SVGMap.prototype.project = function(lon, lat) {};

    return SVGMap;

  })();

  svgmap.SVGMap = SVGMap;

}).call(this);
