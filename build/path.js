(function() {

  /*
      kartograph - a svg mapping library 
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

  var Circle, Line, Path, kartograph, root, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref = root.kartograph) != null ? _ref : root.kartograph = {};

  if ((_ref2 = kartograph.geom) == null) kartograph.geom = {};

  Path = (function() {

    /*
    	represents complex polygons (aka multi-polygons)
    */

    function Path(type, contours, closed) {
      var self;
      if (closed == null) closed = true;
      self = this;
      self.type = type;
      self.contours = contours;
      self.closed = closed;
    }

    Path.prototype.clipToBBox = function(bbox) {
      throw "path clipping is not implemented yet";
    };

    Path.prototype.toSVG = function(paper) {
      /*
      		translates this path to a SVG path string
      */
      var str;
      str = this.svgString();
      return paper.path(str);
    };

    Path.prototype.svgString = function() {
      var contour, fst, glue, me, str, x, y, _i, _j, _len, _len2, _ref3, _ref4;
      me = this;
      str = "";
      glue = me.closed ? "Z M" : "M";
      _ref3 = me.contours;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        contour = _ref3[_i];
        fst = true;
        str += str === "" ? "M" : glue;
        for (_j = 0, _len2 = contour.length; _j < _len2; _j++) {
          _ref4 = contour[_j], x = _ref4[0], y = _ref4[1];
          if (!fst) str += "L";
          str += x + ',' + y;
          fst = false;
        }
      }
      if (me.closed) str += "Z";
      return str;
    };

    Path.prototype.area = function() {
      var area, cnt, i, me, _i, _len, _ref3, _ref4;
      me = this;
      if (me.areas != null) return me._area;
      me.areas = [];
      me._area = 0;
      _ref3 = me.contours;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        cnt = _ref3[_i];
        area = 0;
        for (i = 0, _ref4 = cnt.length - 2; 0 <= _ref4 ? i <= _ref4 : i >= _ref4; 0 <= _ref4 ? i++ : i--) {
          area += cnt[i][0] * cnt[i + 1][1] - cnt[i + 1][0] * cnt[i][1];
        }
        area *= .5;
        area = area;
        me.areas.push(area);
        me._area += area;
      }
      return me._area;
    };

    Path.prototype.centroid = function() {
      var a, area, cnt, cx, cy, i, j, k, me, x, y, _ref3, _ref4;
      me = this;
      if (me._centroid != null) return me._centroid;
      area = me.area();
      cx = cy = 0;
      for (i = 0, _ref3 = me.contours.length - 1; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
        cnt = me.contours[i];
        a = me.areas[i];
        x = y = 0;
        for (j = 0, _ref4 = cnt.length - 2; 0 <= _ref4 ? j <= _ref4 : j >= _ref4; 0 <= _ref4 ? j++ : j--) {
          k = cnt[j][0] * cnt[j + 1][1] - cnt[j + 1][0] * cnt[j][1];
          x += (cnt[j][0] + cnt[j + 1][0]) * k;
          y += (cnt[j][1] + cnt[j + 1][1]) * k;
        }
        k = 1 / (6 * a);
        x *= k;
        y *= k;
        k = a / area;
        cx += x * k;
        cy += y * k;
      }
      me._centroid = [cx, cy];
      return me._centroid;
    };

    return Path;

  })();

  kartograph.geom.Path = Path;

  Circle = (function() {

    __extends(Circle, Path);

    function Circle(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      Circle.__super__.constructor.call(this, 'circle', null, true);
    }

    Circle.prototype.toSVG = function(paper) {
      var me;
      me = this;
      return paper.circle(me.x, me.y, me.r);
    };

    Circle.prototype.centroid = function() {
      var me;
      me = this;
      return [me.x, me.y];
    };

    Circle.prototype.area = function() {
      var me;
      me = this;
      return Math.PI * me.r * m.r;
    };

    return Circle;

  })();

  kartograph.geom.Circle = Circle;

  Path.fromSVG = function(path) {
    /*
    	loads a path from a SVG path string
    */
    var closed, contour, contour_str, contours, cx, cy, path_str, pt_str, r, res, sep, type, x, y, _i, _j, _len, _len2, _ref3, _ref4, _ref5;
    contours = [];
    type = path.nodeName;
    res = null;
    if (type === "path") {
      path_str = path.getAttribute('d').trim();
      closed = path_str[path_str.length - 1] === "Z";
      sep = closed ? "Z M" : "M";
      path_str = path_str.substring(1, path_str.length - (closed ? 1 : 0));
      _ref3 = path_str.split(sep);
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        contour_str = _ref3[_i];
        contour = [];
        if (contour_str !== "") {
          _ref4 = contour_str.split('L');
          for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
            pt_str = _ref4[_j];
            _ref5 = pt_str.split(','), x = _ref5[0], y = _ref5[1];
            contour.push([Number(x), Number(y)]);
          }
          contours.push(contour);
        }
      }
      res = new kartograph.geom.Path(type, contours, closed);
    } else if (type === "circle") {
      cx = path.getAttribute("cx");
      cy = path.getAttribute("cy");
      r = path.getAttribute("r");
      res = new kartograph.geom.Circle(cx, cy, r);
    }
    return res;
  };

  Line = (function() {

    /*
    	represents simple lines
    */

    function Line(points) {
      this.points = points;
    }

    Line.prototype.clipToBBox = function(bbox) {
      var clip, i, last_in, lines, p0x, p0y, p1x, p1y, pts, self, x0, x1, y0, y1, _ref3, _ref4, _ref5, _ref6;
      self = this;
      clip = new kartograph.geom.clipping.CohenSutherland().clip;
      pts = [];
      lines = [];
      last_in = false;
      for (i = 0, _ref3 = self.points.length - 2; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
        _ref4 = self.points[i], p0x = _ref4[0], p0y = _ref4[1];
        _ref5 = self.points[i + 1], p1x = _ref5[0], p1y = _ref5[1];
        try {
          _ref6 = clip(bbox, p0x, p0y, p1x, p1y), x0 = _ref6[0], y0 = _ref6[1], x1 = _ref6[2], y1 = _ref6[3];
          last_in = true;
          pts.push([x0, y0]);
          if (p1x !== x1 || p1y !== y0 || i === len(self.points) - 2) {
            pts.push([x1, y1]);
          }
        } catch (err) {
          if (last_in && pts.length > 1) {
            lines.push(new Line(pts));
            pts = [];
          }
          last_in = false;
        }
      }
      if (pts.length > 1) lines.push(new Line(pts));
      return lines;
    };

    Line.prototype.toSVG = function() {
      var pts, self, x, y, _i, _len, _ref3, _ref4;
      self = this;
      pts = [];
      _ref3 = self.points;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        _ref4 = _ref3[_i], x = _ref4[0], y = _ref4[1];
        pts.push(x + ',' + y);
      }
      return 'M' + pts.join('L');
    };

    return Line;

  })();

  kartograph.geom.Line = Line;

}).call(this);
