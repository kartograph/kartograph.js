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

  var Path, root, svgmap, _ref;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref = root.svgmap) != null ? _ref : root.svgmap = {};

  Path = (function() {

    function Path(contours, closed) {
      this.contours = contours;
      this.closed = closed != null ? closed : true;
    }

    Path.prototype.toSVG = function() {
      /*
      		translates this path to a SVG path string
      */
      var contour, fst, glue, me, str, x, y, _i, _j, _len, _len2, _ref2, _ref3;
      me = this;
      str = "";
      glue = me.closed ? "Z M" : "M";
      _ref2 = me.contours;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        contour = _ref2[_i];
        fst = true;
        str += str === "" ? "M" : glue;
        for (_j = 0, _len2 = contour.length; _j < _len2; _j++) {
          _ref3 = contour[_j], x = _ref3[0], y = _ref3[1];
          if (!fst) str += "L";
          str += x + ',' + y;
          fst = false;
        }
      }
      if (me.closed) str += "Z";
      return str;
    };

    return Path;

  })();

  Path.fromSVG = function(path_str) {
    /*
    	loads a path from a SVG path string
    */
    var closed, contour, contour_str, contours, pt_str, sep, x, y, _i, _j, _len, _len2, _ref2, _ref3, _ref4;
    contours = [];
    path_str = path_str.trim();
    closed = path_str[path_str.length - 1] === "Z";
    sep = closed ? "Z M" : "M";
    path_str = path_str.substring(1, path_str.length - (closed ? 1 : 0));
    _ref2 = path_str.split(sep);
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      contour_str = _ref2[_i];
      contour = [];
      if (contour_str !== "") {
        _ref3 = contour_str.split('L');
        for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
          pt_str = _ref3[_j];
          _ref4 = pt_str.split(','), x = _ref4[0], y = _ref4[1];
          contour.push([Number(x), Number(y)]);
        }
        contours.push(contour);
      }
    }
    return new svgmap.Path(contours, closed);
  };

  svgmap.Path = Path;

}).call(this);
