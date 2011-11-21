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
      GNU General Public License for more detailme.
  
      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

  var View, root, _ref;

  View = (function() {

    /*
    	2D coordinate transfomation
    */

    function View(bbox, width, height, padding) {
      var me;
      if (padding == null) padding = 0;
      me = this;
      me.bbox = bbox;
      me.width = width;
      me.padding = padding;
      me.height = height;
      me.scale = Math.min((width - padding * 2) / bbox.width, (height - padding * 2) / bbox.height);
    }

    View.prototype.project = function(x, y) {
      var bbox, h, me, s, w;
      if (!(y != null)) {
        y = x[1];
        x = x[0];
      }
      me = this;
      s = me.scale;
      bbox = me.bbox;
      h = me.height;
      w = me.width;
      x = (x - bbox.left) * s + (w - bbox.width * s) * .5;
      y = (y - bbox.top) * s + (h - bbox.height * s) * .5;
      return [x, y];
    };

    return View;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if ((_ref = root.svgmap) == null) root.svgmap = {};

  root.svgmap.View = View;

}).call(this);
