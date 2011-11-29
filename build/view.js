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

    function View(bbox, width, height, padding, halign, valign) {
      var me;
      me = this;
      me.bbox = bbox;
      me.width = width;
      me.padding = padding != null ? padding : 0;
      me.halign = halign != null ? halign : 'center';
      me.valign = valign != null ? valign : 'center';
      me.height = height;
      me.scale = Math.min((width - padding * 2) / bbox.width, (height - padding * 2) / bbox.height);
    }

    View.prototype.project = function(x, y) {
      var bbox, h, me, s, w, xf, yf;
      if (!(y != null)) {
        y = x[1];
        x = x[0];
      }
      me = this;
      s = me.scale;
      bbox = me.bbox;
      h = me.height;
      w = me.width;
      xf = me.halign === "center" ? (w - bbox.width * s) * 0.5 : me.halign === "left" ? me.padding * s : w - (bbox.width - me.padding) * s;
      yf = me.valign === "center" ? (h - bbox.height * s) * 0.5 : me.valign === "top" ? me.padding * s : 0;
      x = (x - bbox.left) * s + xf;
      y = (y - bbox.top) * s + yf;
      return [x, y];
    };

    View.prototype.projectPath = function(path) {
      var cont, contours, me, pcont, r, x, y, _i, _j, _len, _len2, _ref, _ref2, _ref3, _ref4;
      me = this;
      if (path.type === "path") {
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
        return new svgmap.geom.Path(path.type, contours, path.closed);
      } else if (path.type === "circle") {
        _ref4 = me.project(path.x, path.y), x = _ref4[0], y = _ref4[1];
        r = path.r * me.scale;
        return new svgmap.geom.Circle(x, y, r);
      }
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
