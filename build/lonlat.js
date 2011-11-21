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

  var LatLon, LonLat, root, svgmap, _ref;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref = root.svgmap) != null ? _ref : root.svgmap = {};

  LonLat = (function() {

    /*
    	represents a Point
    */

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

  svgmap.LonLat = LonLat;

  svgmap.LatLon = LatLon;

}).call(this);
