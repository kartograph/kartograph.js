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

    View.prototype.projectPath = function(path) {
      var cont, contours, me, pcont, x, y, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      me = this;
      contours = [];
      _ref = path.contours;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pcont = _ref[_i];
        cont = [];
        for (_j = 0, _len2 = pcont.length; _j < _len2; _j++) {
          _ref2 = pcont[_j], x = _ref2[0], y = _ref2[1];
          _ref3 = me.project(x, y), x = _ref3[0], y = _ref3[1];
          cont.push([x, y]);
        }
        contours.push(cont);
      }
      return new svgmap.geom.Path(contours, path.closed);
    };

    View.prototype.asBBox = function() {
      var me;
      me = this;
      return new svgmap.BBox(0, 0, me.width, me.height);
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
    return new svgmap.View(bbox, w, h, pad);
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if ((_ref = root.svgmap) == null) root.svgmap = {};

  root.svgmap.View = View;

}).call(this);
