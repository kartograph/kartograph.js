/*!
 *
 *    svgmap - a simple toolset that helps creating interactive thematic maps
 *    Copyright (C) 2011  Gregor Aisch
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 
 */


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

  var Azimuthal, BBox, Balthasart, Behrmann, BubbleMarker, CEA, CohenSutherland, Color, ColorScale, Conic, Cylindrical, Diverging, DotMarker, EckertIV, Equirectangular, GallPeters, HoboDyer, IconMarker, LAEA, LCC, LabelMarker, LatLon, Line, LonLat, Loximuthal, MapLayer, MapLayerPath, MapMarker, Mercator, Mollweide, NaturalEarth, Orthographic, Path, Proj, PseudoCylindrical, Ramp, Robinson, SVGMap, Satellite, Sinusoidal, Stereographic, View, WagnerIV, WagnerV, root, svgmap, __proj, _base, _base2, _ref, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref = root.svgmap) != null ? _ref : root.svgmap = {};

  BBox = (function() {

    /*
    	2D bounding box
    */

    function BBox(left, top, width, height) {
      var s;
      if (left == null) left = 0;
      if (top == null) top = 0;
      if (width == null) width = null;
      if (height == null) height = null;
      s = this;
      if (width === null) {
        s.xmin = Number.MAX_VALUE;
        s.xmax = Number.MAX_VALUE * -1;
      } else {
        s.xmin = s.left = left;
        s.xmax = s.right = left + width;
        s.width = width;
      }
      if (height === null) {
        s.ymin = Number.MAX_VALUE;
        s.ymax = Number.MAX_VALUE * -1;
      } else {
        s.ymin = s.top = top;
        s.ymax = s.bottom = height + top;
        s.height = height;
      }
      return;
    }

    BBox.prototype.update = function(x, y) {
      var s;
      if (!(y != null)) {
        y = x[1];
        x = x[0];
      }
      s = this;
      s.xmin = Math.min(s.xmin, x);
      s.ymin = Math.min(s.ymin, y);
      s.xmax = Math.max(s.xmax, x);
      s.ymax = Math.max(s.ymax, y);
      s.left = s.xmin;
      s.top = s.ymin;
      s.right = s.xmax;
      s.bottom = s.ymax;
      s.width = s.xmax - s.xmin;
      s.height = s.ymax - s.ymin;
      return this;
    };

    BBox.prototype.intersects = function(bbox) {
      return bbox.left < s.right && bbox.right > s.left && bbox.top < s.bottom && bbox.bottom > s.top;
    };

    BBox.prototype.inside = function(x, y) {
      var s;
      s = this;
      return x >= s.left && x <= s.right && y >= s.top && y <= s.bottom;
    };

    BBox.prototype.join = function(bbox) {
      var s;
      s = this;
      s.update(bbox.left, bbox.top);
      s.update(bbox.right, bbox.bottom);
      return this;
    };

    return BBox;

  })();

  BBox.fromXML = function(xml) {
    var h, w, x, y;
    x = Number(xml.getAttribute('x'));
    y = Number(xml.getAttribute('y'));
    w = Number(xml.getAttribute('w'));
    h = Number(xml.getAttribute('h'));
    return new svgmap.BBox(x, y, w, h);
  };

  svgmap.BBox = BBox;

  "svgmap - a simple toolset that helps creating interactive thematic maps\nCopyright (C) 2011  Gregor Aisch\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU General Public License for more details.\n\nYou should have received a copy of the GNU General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.";

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref2 = root.svgmap) != null ? _ref2 : root.svgmap = {};

  if ((_ref3 = svgmap.geom) == null) svgmap.geom = {};

  if ((_ref4 = (_base = svgmap.geom).clipping) == null) _base.clipping = {};

  CohenSutherland = (function() {
    var BOTTOM, INSIDE, LEFT, RIGHT, TOP;

    function CohenSutherland() {}

    INSIDE = 0;

    LEFT = 1;

    RIGHT = 2;

    BOTTOM = 4;

    TOP = 8;

    CohenSutherland.prototype.compute_out_code = function(bbox, x, y) {
      var code, self;
      self = this;
      code = self.INSIDE;
      if (x < bbox.left) {
        code |= self.LEFT;
      } else if (x > bbox.right) {
        code |= self.RIGHT;
      }
      if (y < bbox.top) {
        code |= self.TOP;
      } else if (y > bbox.bottom) {
        code |= self.BOTTOM;
      }
      return code;
    };

    CohenSutherland.prototype.clip = function(bbox, x0, y0, x1, y1) {
      var accept, code0, code1, cout, self, x, y;
      self = this;
      code0 = self.compute_out_code(bbox, x0, y0);
      code1 = self.compute_out_code(bbox, x1, y1);
      accept = False;
      while (True) {
        if (!(code0 | code1)) {
          accept = True;
          break;
        } else if (code0 & code1) {
          break;
        } else {
          cout = code === 0 ? code1 : code0;
          if (cout & self.TOP) {
            x = x0 + (x1 - x0) * (bbox.top - y0) / (y1 - y0);
            y = bbox.top;
          } else if (cout & self.BOTTOM) {
            x = x0 + (x1 - x0) * (bbox.bottom - y0) / (y1 - y0);
            y = bbox.bottom;
          } else if (cout & self.RIGHT) {
            y = y0 + (y1 - y0) * (bbox.right - x0) / (x1 - x0);
            x = bbox.right;
          } else if (cout & self.LEFT) {
            y = y0 + (y1 - y0) * (bbox.left - x0) / (x1 - x0);
            x = bbox.left;
          }
          if (cout === code0) {
            x0 = x;
            y0 = y;
            code0 = self.compute_out_code(bbox, x0, y0);
          } else {
            x1 = x;
            y1 = y;
            code1 = self.compute_out_code(bbox, x1, y1);
          }
        }
      }
      if (accept) {
        return [x0, y0, x1, y1];
      } else {
        return null;
      }
    };

    return CohenSutherland;

  })();

  svgmap.geom.clipping.CohenSutherland = CohenSutherland;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref5 = root.svgmap) != null ? _ref5 : root.svgmap = {};

  if ((_ref6 = svgmap.color) == null) svgmap.color = {};

  Color = (function() {

    /*
    	data type for colors
    	
    	eg.
    	new Color() // white
    	new Color(120,.8,.5) // defaults to hsl color
    	new Color([120,.8,.5]) // this also works
    	new Color(255,100,50,'rgb') //  color using RGB
    	new Color('#ff0000') // or hex value
    */

    function Color(x, y, z, m) {
      var me, _ref7;
      me = this;
      if (x == null) x = [255, 255, 255];
      if (x.length === 3) {
        m = y;
        _ref7 = x, x = _ref7[0], y = _ref7[1], z = _ref7[2];
      }
      if (x.length === 7) {
        m = 'hex';
      } else {
        if (m == null) m = 'hsl';
      }
      if (m === 'rgb') {
        me.rgb = [x, y, z];
      } else if (m === 'hsl') {
        me.rgb = Color.hsl2rgb(x, y, z);
      } else if (m === 'hex') {
        me.rgb = Color.hex2rgb(x);
      }
    }

    Color.prototype.toString = function() {
      return Color.rgb2hex(this.rgb);
    };

    Color.prototype.hsl = function() {
      return Color.rgb2hsl(this.rgb);
    };

    Color.prototype.interpolate = function(f, col, m) {
      /*
      		interpolates between two colors
      		eg
      		new Color('#ff0000').interpolate(0.5, new Color('#0000ff')) == '0xffff00'
      */
      var dh, hue, hue0, hue1, lbv, lbv0, lbv1, me, sat, sat0, sat1, xyz0, xyz1;
      me = this;
      if (m == null) m = 'hsl';
      if (m === 'hsl') {
        if (m === 'hsl') {
          xyz0 = me.hsl();
          xyz1 = col.hsl();
        }
        hue0 = xyz0[0], sat0 = xyz0[1], lbv0 = xyz0[2];
        hue1 = xyz1[0], sat1 = xyz1[1], lbv1 = xyz1[2];
        if (!isNaN(hue0) && !isNaN(hue1)) {
          if (hue1 > hue0 && hue1 - hue0 > 180) {
            dh = hue1 - (hue0 + 360);
          } else if (hue1 < hue0 && hue0 - hue1 > 180) {
            dh = hue1 + 360 - hue0;
          } else {
            dh = hue1 - hue0;
          }
          hue = hue0 + f * dh;
        } else if (!isNaN(hue0)) {
          hue = hue0;
          if (lbv1 === 1 || lbv1 === 0) sat = sat0;
        } else if (!isNaN(hue1)) {
          hue = hue1;
          if (lbv0 === 1 || lbv0 === 0) sat = sat1;
        } else {
          hue = void 0;
        }
        if (sat == null) sat = sat0 + f * (sat1 - sat0);
        lbv = lbv0 + f * (lbv1 - lbv0);
        return new Color(hue, sat, lbv, m);
      } else if (m === 'rgb') {
        xyz0 = me.rgb;
        xyz1 = col.rgb;
        return new Color(xyz0[0] + f * f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
      } else {
        throw "color mode " + m + " is not supported";
      }
    };

    return Color;

  })();

  Color.hex2rgb = function(hex) {
    var b, g, r, u;
    u = parseInt(hex.substr(1), 16);
    r = u >> 16;
    g = u >> 8 & 0xFF;
    b = u & 0xFF;
    return [r, g, b];
  };

  Color.rgb2hex = function(r, g, b) {
    var str, u, _ref7;
    if (r.length === 3) _ref7 = r, r = _ref7[0], g = _ref7[1], b = _ref7[2];
    u = r << 16 | g << 8 | b;
    str = "000000" + u.toString(16).toUpperCase();
    return "#" + str.substr(str.length - 6);
  };

  Color.hsl2rgb = function(h, s, l) {
    var b, c, g, i, r, t1, t2, t3, _ref7, _ref8;
    if (h.length === 3) _ref7 = h, h = _ref7[0], s = _ref7[1], l = _ref7[2];
    if (s === 0) {
      r = g = b = l * 255;
    } else {
      t3 = [0, 0, 0];
      c = [0, 0, 0];
      t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      t1 = 2 * l - t2;
      h /= 360;
      t3[0] = h + 1 / 3;
      t3[1] = h;
      t3[2] = h - 1 / 3;
      for (i = 0; i <= 2; i++) {
        if (t3[i] < 0) t3[i] += 1;
        if (t3[i] > 1) t3[i] -= 1;
        if (6 * t3[i] < 1) {
          c[i] = t1 + (t2 - t1) * 6 * t3[i];
        } else if (2 * t3[i] < 1) {
          c[i] = t2;
        } else if (3 * t3[i] < 2) {
          c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6;
        } else {
          c[i] = t1;
        }
      }
      _ref8 = [Math.round(c[0] * 255), Math.round(c[1] * 255), Math.round(c[2] * 255)], r = _ref8[0], g = _ref8[1], b = _ref8[2];
    }
    return [r, g, b];
  };

  Color.rgb2hsl = function(r, g, b) {
    var h, l, max, min, s, _ref7;
    if (r.length === 3) _ref7 = r, r = _ref7[0], g = _ref7[1], b = _ref7[2];
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = void 0;
    } else {
      s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
    }
    if (r === max) {
      h = (g - b) / (max - min);
    } else if (g === max) {
      h = 2 + (b - r) / (max - min);
    } else if (b === max) {
      h = 4 + (r - g) / (max - min);
    }
    h *= 60;
    if (h < 0) h += 360;
    return [h, s, l];
  };

  Color.hsl = function(h, s, l) {
    return new Color(h, s, l, 'hsl');
  };

  Color.rgb = function(r, g, b) {
    return new Color(r, g, b, 'rgb');
  };

  Color.hex = function(x) {
    return new Color(x);
  };

  svgmap.color.Color = Color;

  ColorScale = (function() {

    /*
    	base class for color scales
    */

    function ColorScale(colors, positions, mode, nacol) {
      var c, me, _ref7;
      if (nacol == null) nacol = '#cccccc';
      me = this;
      for (c = 0, _ref7 = colors.length - 1; 0 <= _ref7 ? c <= _ref7 : c >= _ref7; 0 <= _ref7 ? c++ : c--) {
        if (typeof colors[c] === "string") colors[c] = new Color(colors[c]);
      }
      me.colors = colors;
      me.pos = positions;
      me.mode = mode;
      me.nacol = nacol;
    }

    ColorScale.prototype.getColor = function(value) {
      var col, f, f0, i, me, p, _ref7;
      me = this;
      if (isNaN(value)) return me.nacol;
      value = me.classifyValue(value);
      f = f0 = (value - me.min) / (me.max - me.min);
      f = Math.min(1, Math.max(0, f));
      for (i = 0, _ref7 = me.pos.length - 1; 0 <= _ref7 ? i <= _ref7 : i >= _ref7; 0 <= _ref7 ? i++ : i--) {
        p = me.pos[i];
        if (f <= p) {
          col = me.colors[i];
          break;
        }
        if (f >= p && i === me.pos.length - 1) {
          col = me.colors[i];
          break;
        }
        if (f > p && f < me.pos[i + 1]) {
          f = (f - p) / (me.pos[i + 1] - p);
          col = me.colors[i].interpolate(f, me.colors[i + 1], me.mode);
          break;
        }
      }
      return col;
    };

    ColorScale.prototype.setClasses = function(numClasses, method, limits) {
      var self;
      if (numClasses == null) numClasses = 5;
      if (method == null) method = 'equalinterval';
      if (limits == null) limits = [];
      /*
      		# use this if you want to display a limited number of data classes
      		# possible methods are "equalinterval", "quantiles", "custom"
      */
      self = this;
      self.classMethod = method;
      self.numClasses = numClasses;
      self.classLimits = limits;
    };

    ColorScale.prototype.parseData = function(data, data_col) {
      var h, i, id, limits, max, method, min, num, p, pb, pr, row, self, sum, val, values, _ref7, _ref8;
      self = this;
      min = Number.MAX_VALUE;
      max = Number.MAX_VALUE * -1;
      sum = 0;
      values = [];
      for (id in data) {
        row = data[id];
        val = data_col != null ? row[data_col] : row;
        if (isNaN(val)) continue;
        min = Math.min(min, val);
        max = Math.max(max, val);
        values.push(val);
        sum += val;
      }
      values = values.sort();
      if (values.length % 2 === 1) {
        self.median = values[Math.floor(values.length * 0.5)];
      } else {
        h = values.length * 0.5;
        self.median = values[h - 1] * 0.5 + values[h] * 0.5;
      }
      self.values = values;
      self.mean = sum / values.length;
      self.min = min;
      self.max = max;
      method = self.classMethod;
      num = self.numClasses;
      limits = self.classLimits;
      if (method != null) {
        if (method === "equalinterval") {
          for (i = 1, _ref7 = num - 1; 1 <= _ref7 ? i <= _ref7 : i >= _ref7; 1 <= _ref7 ? i++ : i--) {
            limits.push(min + (i / num) * (max - min));
          }
        } else if (method === "quantiles") {
          for (i = 1, _ref8 = num - 1; 1 <= _ref8 ? i <= _ref8 : i >= _ref8; 1 <= _ref8 ? i++ : i--) {
            p = values.length * i / num;
            pb = Math.floor(p);
            if (pb === p) {
              limits.push(values[pb]);
            } else {
              pr = p - pb;
              limits.push(values[pb] * pr + values[pb + 1] * (1 - pr));
            }
          }
        }
        limits.unshift(min);
        limits.push(max);
      }
    };

    ColorScale.prototype.classifyValue = function(value) {
      var i, limits, maxc, minc, n, self;
      self = this;
      limits = self.classLimits;
      if (limits != null) {
        n = limits.length - 1;
        i = 0;
        while (i < n && value >= limits[i]) {
          i++;
        }
        value = limits[i - 1] + (limits[i] - limits[i - 1]) * 0.5;
        minc = limits[0] + (limits[1] - limits[0]) * 0.3;
        maxc = limits[n - 1] + (limits[n] - limits[n - 1]) * 0.7;
        value = self.min + ((value - minc) / (maxc - minc)) * (self.max - self.min);
      }
      return value;
    };

    return ColorScale;

  })();

  if ((_ref7 = (_base2 = svgmap.color).scale) == null) _base2.scale = {};

  Ramp = (function() {

    __extends(Ramp, ColorScale);

    function Ramp(col0, col1, mode) {
      if (col0 == null) col0 = '#fe0000';
      if (col1 == null) col1 = '#feeeee';
      if (mode == null) mode = 'hsl';
      Ramp.__super__.constructor.call(this, [col0, col1], [0, 1], mode);
    }

    return Ramp;

  })();

  svgmap.color.scale.Ramp = Ramp;

  Diverging = (function() {

    __extends(Diverging, ColorScale);

    function Diverging(col0, col1, col2, center, mode) {
      var me;
      if (col0 == null) col0 = '#d73027';
      if (col1 == null) col1 = '#ffffbf';
      if (col2 == null) col2 = '#1E6189';
      if (center == null) center = 'mean';
      if (mode == null) mode = 'hsl';
      me = this;
      me.mode = mode;
      me.center = center;
      Diverging.__super__.constructor.call(this, [col0, col1, col2], [0, .5, 1], mode);
    }

    Diverging.prototype.parseData = function(data, data_col) {
      var c, me;
      Diverging.__super__.parseData.call(this, data, data_col);
      me = this;
      c = me.center;
      if (c === 'median') {
        c = me.median;
      } else if (c === 'mean') {
        c = me.mean;
      }
      return me.pos[1] = (c - me.min) / (me.max - me.min);
    };

    return Diverging;

  })();

  svgmap.color.scale.Diverging = Diverging;

  svgmap.color.scale.COOL = new Ramp(Color.hsl(180, 1, .9), Color.hsl(250, .7, .4));

  svgmap.color.scale.HOT = new ColorScale(['#000000', '#ff0000', '#ffff00', '#ffffff'], [0, .25, .75, 1], 'rgb');

  svgmap.color.scale.BWO = new Diverging(Color.hsl(30, 1, .6), '#ffffff', new Color(220, 1, .6));

  svgmap.color.scale.GWP = new Diverging(Color.hsl(120, .8, .4), '#ffffff', new Color(280, .8, .4));

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref8 = root.svgmap) != null ? _ref8 : root.svgmap = {};

  LonLat = (function() {

    /*
    	represents a Point
    */

    function LonLat(lon, lat) {
      this.lon = Number(lon);
      this.lat = Number(lat);
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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref9 = root.svgmap) != null ? _ref9 : root.svgmap = {};

  if ((_ref10 = svgmap.marker) == null) svgmap.marker = {};

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
    }

    return BubbleMarker;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref11 = root.svgmap) != null ? _ref11 : root.svgmap = {};

  if ((_ref12 = svgmap.geom) == null) svgmap.geom = {};

  Path = (function() {

    /*
    	represents complex polygons (aka multi-polygons)
    */

    function Path(contours, closed) {
      this.contours = contours;
      this.closed = closed != null ? closed : true;
    }

    Path.prototype.clipToBBox = function(bbox) {
      throw "path clipping is not implemented yet";
    };

    Path.prototype.toSVG = function() {
      /*
      		translates this path to a SVG path string
      */
      var contour, fst, glue, me, str, x, y, _i, _j, _len, _len2, _ref13, _ref14;
      me = this;
      str = "";
      glue = me.closed ? "Z M" : "M";
      _ref13 = me.contours;
      for (_i = 0, _len = _ref13.length; _i < _len; _i++) {
        contour = _ref13[_i];
        fst = true;
        str += str === "" ? "M" : glue;
        for (_j = 0, _len2 = contour.length; _j < _len2; _j++) {
          _ref14 = contour[_j], x = _ref14[0], y = _ref14[1];
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
    var closed, contour, contour_str, contours, pt_str, sep, x, y, _i, _j, _len, _len2, _ref13, _ref14, _ref15;
    contours = [];
    path_str = path_str.trim();
    closed = path_str[path_str.length - 1] === "Z";
    sep = closed ? "Z M" : "M";
    path_str = path_str.substring(1, path_str.length - (closed ? 1 : 0));
    _ref13 = path_str.split(sep);
    for (_i = 0, _len = _ref13.length; _i < _len; _i++) {
      contour_str = _ref13[_i];
      contour = [];
      if (contour_str !== "") {
        _ref14 = contour_str.split('L');
        for (_j = 0, _len2 = _ref14.length; _j < _len2; _j++) {
          pt_str = _ref14[_j];
          _ref15 = pt_str.split(','), x = _ref15[0], y = _ref15[1];
          contour.push([Number(x), Number(y)]);
        }
        contours.push(contour);
      }
    }
    return new svgmap.geom.Path(contours, closed);
  };

  svgmap.geom.Path = Path;

  Line = (function() {

    /*
    	represents simple lines
    */

    function Line(points) {
      this.points = points;
    }

    Line.prototype.clipToBBox = function(bbox) {
      var clip, i, last_in, lines, p0x, p0y, p1x, p1y, pts, self, x0, x1, y0, y1, _ref13, _ref14, _ref15, _ref16;
      self = this;
      clip = new svgmap.geom.clipping.CohenSutherland().clip;
      pts = [];
      lines = [];
      last_in = false;
      for (i = 0, _ref13 = self.points.length - 2; 0 <= _ref13 ? i <= _ref13 : i >= _ref13; 0 <= _ref13 ? i++ : i--) {
        _ref14 = self.points[i], p0x = _ref14[0], p0y = _ref14[1];
        _ref15 = self.points[i + 1], p1x = _ref15[0], p1y = _ref15[1];
        try {
          _ref16 = clip(bbox, p0x, p0y, p1x, p1y), x0 = _ref16[0], y0 = _ref16[1], x1 = _ref16[2], y1 = _ref16[3];
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
      var pts, self, x, y, _i, _len, _ref13, _ref14;
      self = this;
      pts = [];
      _ref13 = self.points;
      for (_i = 0, _len = _ref13.length; _i < _len; _i++) {
        _ref14 = _ref13[_i], x = _ref14[0], y = _ref14[1];
        pts.push(x + ',' + y);
      }
      return 'M' + pts.join('L');
    };

    return Line;

  })();

  svgmap.geom.Line = Line;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref13 = root.svgmap) != null ? _ref13 : root.svgmap = {};

  __proj = svgmap.proj = {};

  Function.prototype.bind = function(scope) {
    var _function;
    _function = this;
    return function() {
      return _function.apply(scope, arguments);
    };
  };

  Proj = (function() {

    function Proj(opts) {
      var me, _ref14, _ref15;
      me = this;
      me.lon0 = (_ref14 = opts.lon0) != null ? _ref14 : 0;
      me.lat0 = (_ref15 = opts.lat0) != null ? _ref15 : 0;
      me.PI = Math.PI;
      me.HALFPI = me.PI * .5;
      me.QUARTERPI = me.PI * .25;
      me.RAD = me.PI / 180;
      me.DEG = 180 / me.PI;
      me.lam0 = me.rad(this.lon0);
      me.phi0 = me.rad(this.lat0);
      me.minLat = -90;
      me.maxLat = 90;
    }

    Proj.prototype.rad = function(a) {
      return a * this.RAD;
    };

    Proj.prototype.deg = function(a) {
      return a * this.DEG;
    };

    Proj.prototype.plot = function(polygon, truncate) {
      var ignore, lat, lon, points, vis, x, y, _i, _len, _ref14, _ref15;
      if (truncate == null) truncate = true;
      points = [];
      ignore = true;
      for (_i = 0, _len = polygon.length; _i < _len; _i++) {
        _ref14 = polygon[_i], lon = _ref14[0], lat = _ref14[1];
        vis = this._visible(lon, lat);
        if (vis) ignore = false;
        _ref15 = this.project(lon, lat), x = _ref15[0], y = _ref15[1];
        if (!vis && truncate) {
          points.push(this._truncate(x, y));
        } else {
          points.push([x, y]);
        }
      }
      if (ignore) {
        return null;
      } else {
        return [points];
      }
    };

    Proj.prototype.sea = function() {
      var l0, lat, lon, o, p, s, _ref14, _ref15, _ref16, _ref17;
      s = this;
      p = s.project.bind(this);
      o = [];
      l0 = s.lon0;
      s.lon0 = 0;
      for (lon = -180; lon <= 180; lon++) {
        o.push(p(lon, s.maxLat));
      }
      for (lat = _ref14 = s.maxLat, _ref15 = s.minLat; _ref14 <= _ref15 ? lat <= _ref15 : lat >= _ref15; _ref14 <= _ref15 ? lat++ : lat--) {
        o.push(p(180, lat));
      }
      for (lon = 180; lon >= -180; lon--) {
        o.push(p(lon, s.minLat));
      }
      for (lat = _ref16 = s.minLat, _ref17 = s.maxLat; _ref16 <= _ref17 ? lat <= _ref17 : lat >= _ref17; _ref16 <= _ref17 ? lat++ : lat--) {
        o.push(p(-180, lat));
      }
      s.lon0 = l0;
      return o;
    };

    Proj.prototype.world_bbox = function() {
      var bbox, p, s, sea, _i, _len;
      p = this.project.bind(this);
      sea = this.sea();
      bbox = new svgmap.BBox();
      for (_i = 0, _len = sea.length; _i < _len; _i++) {
        s = sea[_i];
        bbox.update(s[0], s[1]);
      }
      return bbox;
    };

    return Proj;

  })();

  Proj.fromXML = function(xml) {
    /*
    	reconstructs a projection from xml description
    */
    var attr, i, id, opts, _ref14;
    id = xml.getAttribute('id');
    opts = {};
    for (i = 0, _ref14 = xml.attributes.length - 1; 0 <= _ref14 ? i <= _ref14 : i >= _ref14; 0 <= _ref14 ? i++ : i--) {
      attr = xml.attributes[i];
      if (attr.name !== "id") opts[attr.name] = attr.value;
    }
    return new svgmap.proj[id](opts);
  };

  svgmap.Proj = Proj;

  Cylindrical = (function() {

    __extends(Cylindrical, Proj);

    function Cylindrical() {
      Cylindrical.__super__.constructor.apply(this, arguments);
    }

    /*
    	Base class for cylindrical projections
    */

    Cylindrical.prototype._visible = function(lon, lat) {
      return true;
    };

    Cylindrical.prototype.clon = function(lon) {
      lon -= this.lon0;
      if (lon < -180) {
        lon += 360;
      } else if (lon > 180) {
        lon -= 360;
      }
      return lon;
    };

    return Cylindrical;

  })();

  Equirectangular = (function() {

    __extends(Equirectangular, Cylindrical);

    function Equirectangular() {
      Equirectangular.__super__.constructor.apply(this, arguments);
    }

    /*
    	Equirectangular Projection aka Lonlat aka Plate Carree
    */

    Equirectangular.prototype.project = function(lon, lat) {
      lon = this.clon(lon);
      return [lon * Math.cos(this.phi0) * 1000, lat * -1 * 1000];
    };

    return Equirectangular;

  })();

  __proj['lonlat'] = Equirectangular;

  CEA = (function() {

    __extends(CEA, Cylindrical);

    function CEA(opts) {
      var _ref14;
      CEA.__super__.constructor.call(this, opts);
      this.lat1 = (_ref14 = opts.lat1) != null ? _ref14 : 0;
      this.phi1 = this.rad(this.lat1);
    }

    /*
    	Cylindrical Equal Area Projection
    */

    CEA.prototype.project = function(lon, lat) {
      var lam, phi, x, y;
      lam = this.rad(this.clon(lon));
      phi = this.rad(lat * -1);
      x = lam * Math.cos(this.phi1);
      y = Math.sin(phi) / Math.cos(this.phi1);
      return [x * 1000, y * 1000];
    };

    return CEA;

  })();

  __proj['cea'] = CEA;

  GallPeters = (function() {

    __extends(GallPeters, CEA);

    /*
    	Gall-Peters Projection
    */

    function GallPeters(lon0, lat0) {
      GallPeters.__super__.constructor.call(this, lon0, 45);
    }

    return GallPeters;

  })();

  __proj['gallpeters'] = GallPeters;

  HoboDyer = (function() {

    __extends(HoboDyer, CEA);

    /*
    	Hobo-Dyer Projection
    */

    function HoboDyer(opts) {
      opts.lat0 = 37.7;
      HoboDyer.__super__.constructor.call(this, opts);
    }

    return HoboDyer;

  })();

  __proj['hobodyer'] = HoboDyer;

  Behrmann = (function() {

    __extends(Behrmann, CEA);

    /*
    	Behrmann Projection
    */

    function Behrmann(opts) {
      opts.lat0 = 30;
      Behrmann.__super__.constructor.call(this, opts);
    }

    return Behrmann;

  })();

  __proj['behrmann'] = Behrmann;

  Balthasart = (function() {

    __extends(Balthasart, CEA);

    /*
    	Balthasart Projection
    */

    function Balthasart(opts) {
      opts.lat0 = 50;
      Balthasart.__super__.constructor.call(this, opts);
    }

    return Balthasart;

  })();

  __proj['balthasart'] = Balthasart;

  Mercator = (function() {

    __extends(Mercator, Cylindrical);

    /*
    	# you're not really into maps..
    */

    function Mercator(opts) {
      Mercator.__super__.constructor.call(this, opts);
      this.minLat = -85;
      this.maxLat = 85;
    }

    Mercator.prototype.project = function(lon, lat) {
      var lam, math, phi, s, x, y;
      s = this;
      math = Math;
      lam = s.rad(s.clon(lon));
      phi = s.rad(lat * -1);
      x = lam * 1000;
      y = math.log((1 + math.sin(phi)) / math.cos(phi)) * 1000;
      return [x, y];
    };

    return Mercator;

  })();

  __proj['mercator'] = Mercator;

  PseudoCylindrical = (function() {

    __extends(PseudoCylindrical, Cylindrical);

    function PseudoCylindrical() {
      PseudoCylindrical.__super__.constructor.apply(this, arguments);
    }

    /*
    	Base class for pseudo cylindrical projections
    */

    return PseudoCylindrical;

  })();

  NaturalEarth = (function() {

    __extends(NaturalEarth, PseudoCylindrical);

    /*
    	Natural Earth Projection
    	see here http://www.shadedrelief.com/NE_proj/
    */

    function NaturalEarth(opts) {
      var s;
      NaturalEarth.__super__.constructor.call(this, opts);
      s = this;
      s.A0 = 0.8707;
      s.A1 = -0.131979;
      s.A2 = -0.013791;
      s.A3 = 0.003971;
      s.A4 = -0.001529;
      s.B0 = 1.007226;
      s.B1 = 0.015085;
      s.B2 = -0.044475;
      s.B3 = 0.028874;
      s.B4 = -0.005916;
      s.C0 = s.B0;
      s.C1 = 3 * s.B1;
      s.C2 = 7 * s.B2;
      s.C3 = 9 * s.B3;
      s.C4 = 11 * s.B4;
      s.EPS = 1e-11;
      s.MAX_Y = 0.8707 * 0.52 * Math.PI;
      return;
    }

    NaturalEarth.prototype.project = function(lon, lat) {
      var lplam, lpphi, phi2, phi4, s, x, y;
      s = this;
      lplam = s.rad(s.clon(lon));
      lpphi = s.rad(lat * -1);
      phi2 = lpphi * lpphi;
      phi4 = phi2 * phi2;
      x = lplam * (s.A0 + phi2 * (s.A1 + phi2 * (s.A2 + phi4 * phi2 * (s.A3 + phi2 * s.A4)))) * 180 + 500;
      y = lpphi * (s.B0 + phi2 * (s.B1 + phi4 * (s.B2 + s.B3 * phi2 + s.B4 * phi4))) * 180 + 270;
      return [x, y];
    };

    return NaturalEarth;

  })();

  __proj['naturalearth'] = NaturalEarth;

  Robinson = (function() {

    __extends(Robinson, PseudoCylindrical);

    /*
    	Robinson Projection
    */

    function Robinson(opts) {
      var s;
      Robinson.__super__.constructor.call(this, opts);
      s = this;
      s.X = [1, -5.67239e-12, -7.15511e-05, 3.11028e-06, 0.9986, -0.000482241, -2.4897e-05, -1.33094e-06, 0.9954, -0.000831031, -4.4861e-05, -9.86588e-07, 0.99, -0.00135363, -5.96598e-05, 3.67749e-06, 0.9822, -0.00167442, -4.4975e-06, -5.72394e-06, 0.973, -0.00214869, -9.03565e-05, 1.88767e-08, 0.96, -0.00305084, -9.00732e-05, 1.64869e-06, 0.9427, -0.00382792, -6.53428e-05, -2.61493e-06, 0.9216, -0.00467747, -0.000104566, 4.8122e-06, 0.8962, -0.00536222, -3.23834e-05, -5.43445e-06, 0.8679, -0.00609364, -0.0001139, 3.32521e-06, 0.835, -0.00698325, -6.40219e-05, 9.34582e-07, 0.7986, -0.00755337, -5.00038e-05, 9.35532e-07, 0.7597, -0.00798325, -3.59716e-05, -2.27604e-06, 0.7186, -0.00851366, -7.0112e-05, -8.63072e-06, 0.6732, -0.00986209, -0.000199572, 1.91978e-05, 0.6213, -0.010418, 8.83948e-05, 6.24031e-06, 0.5722, -0.00906601, 0.000181999, 6.24033e-06, 0.5322, 0, 0, 0];
      s.Y = [0, 0.0124, 3.72529e-10, 1.15484e-09, 0.062, 0.0124001, 1.76951e-08, -5.92321e-09, 0.124, 0.0123998, -7.09668e-08, 2.25753e-08, 0.186, 0.0124008, 2.66917e-07, -8.44523e-08, 0.248, 0.0123971, -9.99682e-07, 3.15569e-07, 0.31, 0.0124108, 3.73349e-06, -1.1779e-06, 0.372, 0.0123598, -1.3935e-05, 4.39588e-06, 0.434, 0.0125501, 5.20034e-05, -1.00051e-05, 0.4968, 0.0123198, -9.80735e-05, 9.22397e-06, 0.5571, 0.0120308, 4.02857e-05, -5.2901e-06, 0.6176, 0.0120369, -3.90662e-05, 7.36117e-07, 0.6769, 0.0117015, -2.80246e-05, -8.54283e-07, 0.7346, 0.0113572, -4.08389e-05, -5.18524e-07, 0.7903, 0.0109099, -4.86169e-05, -1.0718e-06, 0.8435, 0.0103433, -6.46934e-05, 5.36384e-09, 0.8936, 0.00969679, -6.46129e-05, -8.54894e-06, 0.9394, 0.00840949, -0.000192847, -4.21023e-06, 0.9761, 0.00616525, -0.000256001, -4.21021e-06, 1, 0, 0, 0];
      s.NODES = 18;
      s.FXC = 0.8487;
      s.FYC = 1.3523;
      s.C1 = 11.45915590261646417544;
      s.RC1 = 0.08726646259971647884;
      s.ONEEPS = 1.000001;
      s.EPS = 1e-8;
      return;
    }

    Robinson.prototype._poly = function(arr, offs, z) {
      return arr[offs] + z * (arr[offs + 1] + z * (arr[offs + 2] + z * arr[offs + 3]));
    };

    Robinson.prototype.project = function(lon, lat) {
      var i, lplam, lpphi, phi, s, x, y;
      s = this;
      lon = s.clon(lon);
      lplam = s.rad(lon);
      lpphi = s.rad(lat * -1);
      phi = Math.abs(lpphi);
      i = Math.floor(phi * s.C1);
      if (i >= s.NODES) i = s.NODES - 1;
      phi = s.deg(phi - s.RC1 * i);
      i *= 4;
      x = s._poly(s.X, i, phi) * s.FXC * lplam;
      y = s._poly(s.Y, i, phi) * s.FYC;
      if (lpphi < 0.0) y = -y;
      return [x, y];
    };

    return Robinson;

  })();

  __proj['robinson'] = Robinson;

  EckertIV = (function() {

    __extends(EckertIV, PseudoCylindrical);

    /*
    	Eckert IV Projection
    */

    function EckertIV(opts) {
      var me;
      EckertIV.__super__.constructor.call(this, opts);
      me = this;
      me.C_x = .42223820031577120149;
      me.C_y = 1.32650042817700232218;
      me.RC_y = .75386330736002178205;
      me.C_p = 3.57079632679489661922;
      me.RC_p = .28004957675577868795;
      me.EPS = 1e-7;
      me.NITER = 6;
    }

    EckertIV.prototype.project = function(lon, lat) {
      var V, c, i, lplam, lpphi, me, p, s, x, y;
      me = this;
      lplam = me.rad(me.clon(lon));
      lpphi = me.rad(lat * -1);
      p = me.C_p * Math.sin(lpphi);
      V = lpphi * lpphi;
      lpphi *= 0.895168 + V * (0.0218849 + V * 0.00826809);
      i = me.NITER;
      while (i > 0) {
        c = Math.cos(lpphi);
        s = Math.sin(lpphi);
        V = (lpphi + s * (c + 2) - p) / (1 + c * (c + 2) - s * s);
        lpphi -= V;
        if (Math.abs(V) < me.EPS) break;
        i -= 1;
      }
      if (i === 0) {
        x = me.C_x * lplam;
        y = lpphi < 0 ? -me.C_y : me.C_y;
      } else {
        x = me.C_x * lplam * (1 + Math.cos(lpphi));
        y = me.C_y * Math.sin(lpphi);
      }
      return [x, y];
    };

    return EckertIV;

  })();

  __proj['eckert4'] = EckertIV;

  Sinusoidal = (function() {

    __extends(Sinusoidal, PseudoCylindrical);

    function Sinusoidal() {
      Sinusoidal.__super__.constructor.apply(this, arguments);
    }

    /*
    	Sinusoidal Projection
    */

    Sinusoidal.prototype.project = function(lon, lat) {
      var lam, me, phi, x, y;
      me = this;
      lam = me.rad(me.clon(lon));
      phi = me.rad(lat * -1);
      x = lam * Math.cos(phi);
      y = phi;
      return [x, y];
    };

    return Sinusoidal;

  })();

  __proj['sinusoidal'] = Sinusoidal;

  Mollweide = (function() {

    __extends(Mollweide, PseudoCylindrical);

    /*
    	Mollweide Projection
    */

    function Mollweide(opts, p, cx, cy, cp) {
      var me, p2, r, sp;
      if (p == null) p = 1.5707963267948966;
      if (cx == null) cx = null;
      if (cy == null) cy = null;
      if (cp == null) cp = null;
      Mollweide.__super__.constructor.call(this, opts);
      me = this;
      me.MAX_ITER = 10;
      me.TOLERANCE = 1e-7;
      if (p != null) {
        p2 = p + p;
        sp = Math.sin(p);
        r = Math.sqrt(Math.PI * 2.0 * sp / (p2 + Math.sin(p2)));
        me.cx = 2 * r / Math.PI;
        me.cy = r / sp;
        me.cp = p2 + Math.sin(p2);
      } else if ((cx != null) && (cy != null) && (typeof cz !== "undefined" && cz !== null)) {
        me.cx = cx;
        me.cy = cy;
        me.cp = cp;
      } else {
        console.error('svgmap.proj.Mollweide: either p or cx,cy,cp must be defined');
      }
    }

    Mollweide.prototype.project = function(lon, lat) {
      var abs, i, k, lam, math, me, phi, v, x, y;
      me = this;
      math = Math;
      abs = math.abs;
      lam = me.rad(me.clon(lon));
      phi = me.rad(lat);
      k = me.cp * math.sin(phi);
      i = me.MAX_ITER;
      while (i !== 0) {
        v = (phi + math.sin(phi) - k) / (1 + math.cos(phi));
        phi -= v;
        if (abs(v) < me.TOLERANCE) break;
        i -= 1;
      }
      if (i === 0) {
        phi = phi >= 0 ? me.HALFPI : -me.HALFPI;
      } else {
        phi *= 0.5;
      }
      x = 1000 * me.cx * lam * math.cos(phi);
      y = 1000 * me.cy * math.sin(phi);
      return [x, y * -1];
    };

    return Mollweide;

  })();

  __proj['mollweide'] = Mollweide;

  WagnerIV = (function() {

    __extends(WagnerIV, Mollweide);

    /*
    	Wagner IV Projection
    */

    function WagnerIV(opts) {
      WagnerIV.__super__.constructor.call(this, opts, 1.0471975511965976);
    }

    return WagnerIV;

  })();

  __proj['wagner4'] = WagnerIV;

  WagnerV = (function() {

    __extends(WagnerV, Mollweide);

    /*
    	Wagner V Projection
    */

    function WagnerV(opts) {
      WagnerV.__super__.constructor.call(this, opts, null, 0.90977, 1.65014, 3.00896);
    }

    return WagnerV;

  })();

  __proj['wagner5'] = WagnerV;

  Loximuthal = (function() {
    var maxLat, minLat;

    __extends(Loximuthal, PseudoCylindrical);

    function Loximuthal() {
      Loximuthal.__super__.constructor.apply(this, arguments);
    }

    minLat = -89;

    maxLat = 89;

    Loximuthal.prototype.project = function(lon, lat) {
      var lam, math, me, phi, x, y;
      me = this;
      math = Math;
      lam = me.rad(me.clon(lon));
      phi = me.rad(lat);
      if (phi === me.phi0) {
        x = lam * math.cos(me.phi0);
      } else {
        x = lam * (phi - me.phi0) / (math.log(math.tan(me.QUARTERPI + phi * 0.5)) - math.log(math.tan(me.QUARTERPI + me.phi0 * 0.5)));
      }
      x *= 1000;
      y = 1000 * (phi - me.phi0);
      return [x, y * -1];
    };

    return Loximuthal;

  })();

  __proj['loximuthal'] = Loximuthal;

  Azimuthal = (function() {

    __extends(Azimuthal, Proj);

    /*
    	Base class for azimuthal projections
    */

    function Azimuthal(opts, rad) {
      var me;
      if (rad == null) rad = 1000;
      Azimuthal.__super__.constructor.call(this, opts);
      me = this;
      me.r = rad;
      me.elevation0 = me.to_elevation(me.lat0);
      me.azimuth0 = me.to_azimuth(me.lon0);
    }

    Azimuthal.prototype.to_elevation = function(lat) {
      var me;
      me = this;
      return ((lat + 90) / 180) * me.PI - me.HALFPI;
    };

    Azimuthal.prototype.to_azimuth = function(lon) {
      var me;
      me = this;
      return ((lon + 180) / 360) * me.PI * 2 - me.PI;
    };

    Azimuthal.prototype._visible = function(lon, lat) {
      var azimuth, cosc, elevation, math, me;
      me = this;
      math = Math;
      elevation = me.to_elevation(lat);
      azimuth = me.to_azimuth(lon);
      cosc = math.sin(elevation) * math.sin(me.elevation0) + math.cos(me.elevation0) * math.cos(elevation) * math.cos(azimuth - me.azimuth0);
      return cosc >= 0.0;
    };

    Azimuthal.prototype._truncate = function(x, y) {
      var math, r, theta, x1, y1;
      math = Math;
      r = this.r;
      theta = math.atan2(y - r, x - r);
      x1 = r + r * math.cos(theta);
      y1 = r + r * math.sin(theta);
      return [x1, y1];
    };

    Azimuthal.prototype.sea = function() {
      var math, out, phi, r;
      out = [];
      r = this.r;
      math = Math;
      for (phi = 0; phi <= 360; phi++) {
        out.push([r + math.cos(this.rad(phi)) * r, r + math.sin(this.rad(phi)) * r]);
      }
      return out;
    };

    Azimuthal.prototype.world_bbox = function() {
      var r;
      r = this.r;
      return new svgmap.BBox(0, 0, r * 2, r * 2);
    };

    return Azimuthal;

  })();

  Orthographic = (function() {

    __extends(Orthographic, Azimuthal);

    function Orthographic() {
      Orthographic.__super__.constructor.apply(this, arguments);
    }

    /*
    	Orthographic Azimuthal Projection
    	
    	implementation taken from http://www.mccarroll.net/snippets/svgworld/
    */

    Orthographic.prototype.project = function(lon, lat) {
      var azimuth, elevation, math, me, x, xo, y, yo;
      me = this;
      math = Math;
      elevation = me.to_elevation(lat);
      azimuth = me.to_azimuth(lon);
      xo = me.r * math.cos(elevation) * math.sin(azimuth - me.azimuth0);
      yo = -me.r * (math.cos(me.elevation0) * math.sin(elevation) - math.sin(me.elevation0) * math.cos(elevation) * math.cos(azimuth - me.azimuth0));
      x = me.r + xo;
      y = me.r + yo;
      return [x, y];
    };

    return Orthographic;

  })();

  __proj['ortho'] = Orthographic;

  LAEA = (function() {

    __extends(LAEA, Azimuthal);

    /*
    	Lambert Azimuthal Equal-Area Projection
    	
    	implementation taken from 
    	Snyder, Map projections - A working manual
    */

    function LAEA(opts) {
      LAEA.__super__.constructor.call(this, opts);
      this.scale = Math.sqrt(2) * 0.5;
    }

    LAEA.prototype.project = function(lon, lat) {
      var cos, k, lam, math, phi, sin, x, xo, y, yo;
      phi = this.rad(lat);
      lam = this.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      if (false && math.abs(lon - this.lon0) === 180) {
        xo = this.r * 2;
        yo = 0;
      } else {
        k = math.pow(2 / (1 + sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0)), .5);
        k *= this.scale;
        xo = this.r * k * cos(phi) * sin(lam - this.lam0);
        yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      }
      x = this.r + xo;
      y = this.r + yo;
      return [x, y];
    };

    return LAEA;

  })();

  __proj['laea'] = LAEA;

  Stereographic = (function() {

    __extends(Stereographic, Azimuthal);

    function Stereographic() {
      Stereographic.__super__.constructor.apply(this, arguments);
    }

    /*
    	Stereographic projection
    	
    	implementation taken from 
    	Snyder, Map projections - A working manual
    */

    Stereographic.prototype.project = function(lon, lat) {
      var cos, k, k0, lam, math, phi, sin, x, xo, y, yo;
      phi = this.rad(lat);
      lam = this.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      k0 = 0.5;
      k = 2 * k0 / (1 + sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0));
      xo = this.r * k * cos(phi) * sin(lam - this.lam0);
      yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      x = this.r + xo;
      y = this.r + yo;
      return [x, y];
    };

    return Stereographic;

  })();

  __proj['stereo'] = Stereographic;

  Satellite = (function() {

    __extends(Satellite, Azimuthal);

    /*
    	General perspective projection, aka Satellite projection
    	
    	implementation taken from 
    	Snyder, Map projections - A working manual
    	
    	up .. angle the camera is turned away from north (clockwise)
    	tilt .. angle the camera is tilted
    */

    function Satellite(opts) {
      var lat, lon, xmax, xmin, xy, _ref14, _ref15, _ref16;
      Satellite.__super__.constructor.call(this, {
        lon0: 0,
        lat0: 0
      });
      this.dist = (_ref14 = opts.dist) != null ? _ref14 : 3;
      this.up = this.rad((_ref15 = opts.up) != null ? _ref15 : 0);
      this.tilt = this.rad((_ref16 = opts.tilt) != null ? _ref16 : 0);
      this.scale = 1;
      xmin = Number.MAX_VALUE;
      xmax = Number.MAX_VALUE * -1;
      for (lat = 0; lat <= 179; lat++) {
        for (lon = 0; lon <= 360; lon++) {
          xy = this.project(lon - 180, lat - 90);
          xmin = Math.min(xy[0], xmin);
          xmax = Math.max(xy[0], xmax);
        }
      }
      this.scale = (this.r * 2) / (xmax - xmin);
      Satellite.__super__.constructor.call(this, opts);
      return;
    }

    Satellite.prototype.project = function(lon, lat) {
      var A, H, cos, cos_c, cos_tilt, cos_up, k, lam, math, phi, sin, sin_tilt, sin_up, x, xo, xt, y, yo, yt;
      phi = this.rad(lat);
      lam = this.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      cos_c = sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0);
      k = (this.dist - 1) / (this.dist - cos_c);
      k = (this.dist - 1) / (this.dist - cos_c);
      k *= this.scale;
      xo = this.r * k * cos(phi) * sin(lam - this.lam0);
      yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      cos_up = cos(this.up);
      sin_up = sin(this.up);
      cos_tilt = cos(this.tilt);
      sin_tilt = sin(this.tilt);
      H = this.r * (this.dist - 1);
      A = ((yo * cos_up + xo * sin_up) * sin(this.tilt / H)) + cos_tilt;
      xt = (xo * cos_up - yo * sin_up) * cos(this.tilt / A);
      yt = (yo * cos_up + xo * sin_up) / A;
      x = this.r + xt;
      y = this.r + yt;
      return [x, y];
    };

    Satellite.prototype._visible = function(lon, lat) {
      var azimuth, cosc, elevation, math;
      elevation = this.to_elevation(lat);
      azimuth = this.to_azimuth(lon);
      math = Math;
      cosc = math.sin(elevation) * math.sin(this.elevation0) + math.cos(this.elevation0) * math.cos(elevation) * math.cos(azimuth - this.azimuth0);
      return cosc >= (1.0 / this.dist);
    };

    return Satellite;

  })();

  __proj['satellite'] = Satellite;

  Conic = (function() {

    __extends(Conic, Proj);

    function Conic(opts) {
      var self, _ref14, _ref15;
      self = this;
      Conic.__super__.constructor.call(this, opts);
      self.lat1 = (_ref14 = opts.lat1) != null ? _ref14 : 30;
      self.phi1 = self.rad(self.lat1);
      self.lat2 = (_ref15 = opts.lat2) != null ? _ref15 : 50;
      self.phi2 = self.rad(self.lat2);
    }

    Conic.prototype._visible = function(lon, lat) {
      return true;
    };

    Conic.prototype._truncate = function(x, y) {
      return [x, y];
    };

    Conic.prototype.clon = function(lon) {
      lon -= this.lon0;
      if (lon < -180) {
        lon += 360;
      } else if (lon > 180) {
        lon -= 360;
      }
      return lon;
    };

    return Conic;

  })();

  LCC = (function() {

    __extends(LCC, Conic);

    "Lambert Conformal Conic Projection (spherical)";

    function LCC(opts) {
      var abs, c, cos, cosphi, log, m, n, pow, secant, self, sin, sinphi, tan, _ref14;
      self = this;
      LCC.__super__.constructor.call(this, opts);
      m = Math;
      _ref14 = [m.sin, m.cos, m.abs, m.log, m.tan, m.pow], sin = _ref14[0], cos = _ref14[1], abs = _ref14[2], log = _ref14[3], tan = _ref14[4], pow = _ref14[5];
      self.n = n = sinphi = sin(self.phi1);
      cosphi = cos(self.phi1);
      secant = abs(self.phi1 - self.phi2) >= 1e-10;
      if (secant) {
        n = log(cosphi / cos(self.phi2)) / log(tan(self.QUARTERPI + 0.5 * self.phi2) / tan(self.QUARTERPI + 0.5 * self.phi1));
      }
      self.c = c = cosphi * pow(tan(self.QUARTERPI + .5 * self.phi1), n) / n;
      if (abs(abs(self.phi0) - self.HALFPI) < 1e-10) {
        self.rho0 = 0;
      } else {
        self.rho0 = c * pow(tan(self.QUARTERPI + .5 * self.phi0), -n);
      }
      self.minLat = -60;
      self.maxLat = 85;
    }

    LCC.prototype.project = function(lon, lat) {
      var abs, cos, lam, lam_, log, m, n, phi, pow, rho, self, sin, tan, x, y, _ref14;
      self = this;
      phi = self.rad(lat);
      lam = self.rad(self.clon(lon));
      m = Math;
      _ref14 = [m.sin, m.cos, m.abs, m.log, m.tan, m.pow], sin = _ref14[0], cos = _ref14[1], abs = _ref14[2], log = _ref14[3], tan = _ref14[4], pow = _ref14[5];
      n = self.n;
      if (abs(abs(phi) - self.HALFPI) < 1e-10) {
        rho = 0.0;
      } else {
        rho = self.c * pow(tan(self.QUARTERPI + 0.5 * phi), -n);
      }
      lam_ = lam * n;
      x = 1000 * rho * sin(lam_);
      y = 1000 * self.rho0 - rho * cos(lam_);
      return [x, y * -1];
    };

    return LCC;

  })();

  __proj['lcc'] = LCC;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref14 = root.svgmap) != null ? _ref14 : root.svgmap = {};

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
      me.markers = [];
    }

    SVGMap.prototype.loadMap = function(mapurl, callback) {
      var me;
      me = this;
      me.mapLoadCallback = callback;
      $.ajax({
        url: mapurl,
        success: me.mapLoaded,
        context: me
      });
    };

    SVGMap.prototype.addLayer = function(src_id, layer_id, path_id) {
      var $paths, layer, me, svg_path, _i, _len, _ref15, _ref16, _results;
      me = this;
      if (layer_id == null) layer_id = src_id;
      if ((_ref15 = me.layerIds) == null) me.layerIds = [];
      me.layerIds.push(layer_id);
      layer = new MapLayer(layer_id, path_id, me.paper, me.viewBC);
      if ((_ref16 = me.layers) == null) me.layers = {};
      me.layers[layer_id] = layer;
      $paths = $('path', $('g#' + src_id, me.svgSrc)[0]);
      _results = [];
      for (_i = 0, _len = $paths.length; _i < _len; _i++) {
        svg_path = $paths[_i];
        _results.push(layer.addPath(svg_path));
      }
      return _results;
    };

    SVGMap.prototype.addLayerEvent = function(layer_id, event, callback) {
      var me, path, paths, _i, _len, _results;
      me = this;
      paths = me.layers[layer_id].paths;
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push($(path.svgPath.node).bind(event, callback));
      }
      return _results;
    };

    SVGMap.prototype.addMarker = function(marker) {
      var me, xy;
      me = this;
      me.markers.push(marker);
      xy = me.viewBC.project(me.viewAB.project(me.proj.project(marker.lonlat.lon, marker.lonlat.lat)));
      return marker.render(xy[0], xy[1], me.container, me.paper);
    };

    SVGMap.prototype.choropleth = function(opts) {
      var col, colorscale, data, data_col, id, layer_id, me, no_data_color, path, pathData, paths, row, v, _ref15, _ref16, _ref17, _ref18, _results;
      me = this;
      layer_id = (_ref15 = opts.layer) != null ? _ref15 : me.layerIds[me.layerIds.length - 1];
      data = opts.data;
      data_col = opts.prop;
      no_data_color = (_ref16 = opts.nodata) != null ? _ref16 : '#ccc';
      colorscale = (_ref17 = opts.colorscale) != null ? _ref17 : svgmap.color.scale.COOL;
      colorscale.parseData(data, data_col);
      pathData = {};
      for (id in data) {
        row = data[id];
        pathData[id] = row[data_col];
      }
      _ref18 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref18) {
        paths = _ref18[id];
        _results.push((function() {
          var _i, _len, _results2;
          _results2 = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            path = paths[_i];
            if (pathData[id] != null) {
              v = pathData[id];
              col = colorscale.getColor(v);
              _results2.push(path.svgPath.node.setAttribute('style', 'fill:' + col));
            } else {
              _results2.push(path.svgPath.node.setAttribute('style', 'fill:' + no_data_color));
            }
          }
          return _results2;
        })());
      }
      return _results;
    };

    SVGMap.prototype.tooltips = function(opts) {
      var cfg, id, id_col, layer_id, me, path, paths, tooltips, tt, _ref15, _ref16, _results;
      me = this;
      tooltips = opts.content;
      id_col = opts.id;
      layer_id = (_ref15 = opts.layer) != null ? _ref15 : me.layerIds[me.layerIds.length - 1];
      _ref16 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref16) {
        paths = _ref16[id];
        _results.push((function() {
          var _i, _len, _results2;
          _results2 = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            path = paths[_i];
            if ($.isFunction(tooltips)) {
              tt = tooltips(id, path);
            } else {
              tt = tooltips[id];
            }
            if (tt != null) {
              cfg = {
                position: {
                  target: 'mouse',
                  viewport: $(window),
                  adjust: {
                    x: 7,
                    y: 7
                  }
                },
                show: {
                  delay: 20
                },
                content: {}
              };
              if (typeof tt === "string") {
                cfg.content.text = tt;
              } else if ($.isArray(tt)) {
                cfg.content.title = tt[0];
                cfg.content.text = tt[1];
              }
              _results2.push($(path.svgPath.node).qtip(cfg));
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        })());
      }
      return _results;
    };

    /*
    		for some reasons, this runs horribly slow in Firefox
    		will use pre-calculated graticules instead
    
    	addGraticule: (lon_step=15, lat_step) ->
    		
    		self = @
    		lat_step ?= lon_step
    		globe = self.proj
    		v0 = self.viewAB
    		v1 = self.viewBC
    		viewbox = v1.asBBox()
    		
    		grat_lines = []
    		
    		for lat in [0..90] by lat_step
    			lats = if lat == 0 then [0] else [lat, -lat]
    			for lat_ in lats
    				if lat_ < globe.minLat or lat_ > globe.maxLat
    					continue
    				pts = []
    				lines = []
    				for lon in [-180..180]
    					console.log lat_,lon
    					if globe._visible(lon, lat_)
    						xy = v1.project(v0.project(globe.project(lon, lat_)))
    						pts.push xy
    					else
    						if pts.length > 1
    							line = new svgmap.geom.Line(pts)
    							pts = []
    							lines = lines.concat(line.clipToBBox(viewbox))
    				
    				if pts.length > 1
    					line = new svgmap.geom.Line(pts)
    					pts = []
    					lines = lines.concat(line.clipToBBox(viewbox))
    					
    				for line in lines
    					path = self.paper.path(line.toSVG())
    					path.setAttribute('class', 'graticule latitude lat_'+Math.abs(lat_)+(if lat_ < 0 then 'W' else 'E'))
    					grat_lines.push(path)
    */

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
      var P, d, i, line, me, p0, p1, pathstr, view0, view1, vp, _i, _len, _ref15, _results;
      me = this;
      P = me.proj;
      vp = me.viewport;
      view0 = me.viewAB;
      view1 = me.viewBC;
      _results = [];
      for (_i = 0, _len = coastlines.length; _i < _len; _i++) {
        line = coastlines[_i];
        pathstr = '';
        for (i = 0, _ref15 = line.length - 2; 0 <= _ref15 ? i <= _ref15 : i >= _ref15; 0 <= _ref15 ? i++ : i--) {
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

    SVGMap.prototype.onPathEvent = function(evt) {
      /*
      		forwards path events to their callbacks, but attaches the path to
      		the event object
      */
      var me, path;
      me = this;
      path = evt.target.path;
      return me.layerEventCallbacks[path.layer][evt.type](path);
    };

    return SVGMap;

  })();

  svgmap.SVGMap = SVGMap;

  MapLayer = (function() {

    function MapLayer(layer_id, path_id, paper, view) {
      var me;
      me = this;
      me.id = layer_id;
      me.path_id = path_id;
      me.paper = paper;
      me.view = view;
    }

    MapLayer.prototype.addPath = function(svg_path) {
      var layerPath, me, _base3, _name, _ref15, _ref16, _ref17;
      me = this;
      if ((_ref15 = me.paths) == null) me.paths = [];
      layerPath = new MapLayerPath(svg_path, me.id, me.paper, me.view);
      me.paths.push(layerPath);
      if (me.path_id != null) {
        if ((_ref16 = me.pathsById) == null) me.pathsById = {};
        if ((_ref17 = (_base3 = me.pathsById)[_name = layerPath.data[me.path_id]]) == null) {
          _base3[_name] = [];
        }
        return me.pathsById[layerPath.data[me.path_id]].push(layerPath);
      }
    };

    return MapLayer;

  })();

  MapLayerPath = (function() {

    function MapLayerPath(svg_path, layer_id, paper, view) {
      var attr, data, i, me, path, path_str, _ref15;
      me = this;
      path_str = svg_path.getAttribute('d');
      me.path = path = svgmap.geom.Path.fromSVG(path_str);
      me.svgPath = paper.path(view.projectPath(path).toSVG());
      me.svgPath.node.setAttribute('class', 'polygon ' + layer_id);
      me.svgPath.node.path = me;
      data = {};
      for (i = 0, _ref15 = svg_path.attributes.length - 1; 0 <= _ref15 ? i <= _ref15 : i >= _ref15; 0 <= _ref15 ? i++ : i--) {
        attr = svg_path.attributes[i];
        if (attr.name.substr(0, 5) === "data-") {
          data[attr.name.substr(5)] = attr.value;
        }
      }
      me.data = data;
    }

    return MapLayerPath;

  })();

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
      var cont, contours, me, pcont, x, y, _i, _j, _len, _len2, _ref15, _ref16, _ref17;
      me = this;
      contours = [];
      _ref15 = path.contours;
      for (_i = 0, _len = _ref15.length; _i < _len; _i++) {
        pcont = _ref15[_i];
        cont = [];
        for (_j = 0, _len2 = pcont.length; _j < _len2; _j++) {
          _ref16 = pcont[_j], x = _ref16[0], y = _ref16[1];
          _ref17 = me.project(x, y), x = _ref17[0], y = _ref17[1];
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

  if ((_ref15 = root.svgmap) == null) root.svgmap = {};

  root.svgmap.View = View;

}).call(this);
