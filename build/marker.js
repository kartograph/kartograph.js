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

  var BubbleMarker, DotMarker, IconMarker, LabelMarker, MapMarker, root, svgmap, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref = root.svgmap) != null ? _ref : root.svgmap = {};

  if ((_ref2 = svgmap.marker) == null) svgmap.marker = {};

  /*
  Marker concept:
  - markers have to be registered in SVGMap instance
  - markers render their own content (output html code)
  - SVGMap will position marker div over map
  - marker will handle events
  */

  MapMarker = (function() {

    function MapMarker(ll) {
      /*
      		lonlat - LonLat instance
      		content - html code that will be placed inside a <div class="marker"> which then will be positioned at the corresponding map position
      		offset - x and y offset for the marker
      */
      var me;
      me = this;
      me.lonlat = ll;
      me.visible = true;
    }

    MapMarker.prototype.render = function(x, y, cont, paper) {
      /*
      		this function will be called by svgmap to render the marker
      */
    };

    return MapMarker;

  })();

  svgmap.marker.MapMarker = MapMarker;

  LabelMarker = (function() {

    __extends(LabelMarker, MapMarker);

    /*
    	a simple label
    */

    function LabelMarker(ll, label) {
      LabelMarker.__super__.constructor.call(this, ll);
      this.label = label;
    }

    return LabelMarker;

  })();

  svgmap.marker.LabelMarker = LabelMarker;

  DotMarker = (function() {

    __extends(DotMarker, LabelMarker);

    function DotMarker(ll, label, rad) {
      DotMarker.__super__.constructor.call(this, ll, label);
      this.rad = rad;
    }

    DotMarker.prototype.render = function(x, y, cont, paper) {
      var node;
      node = paper.circle(x, y, this.rad).node;
      node.setAttribute('class', 'dotMarker');
      return node.setAttribute('title', this.label);
    };

    return DotMarker;

  })();

  svgmap.marker.DotMarker = DotMarker;

  IconMarker = (function() {

    __extends(IconMarker, MapMarker);

    /*
    */

    function IconMarker(ll, icon) {}

    return IconMarker;

  })();

  svgmap.marker.IconMarker = IconMarker;

  BubbleMarker = (function() {

    __extends(BubbleMarker, MapMarker);

    /*
    	will display a bubble centered on the marker position
    */

    function BubbleMarker(ll, size, cssClass) {
      if (cssClass == null) cssClass = 'bubble';
      BubbleMarker.__super__.constructor.call(this, ll);
    }

    return BubbleMarker;

  })();

}).call(this);
