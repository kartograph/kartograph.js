/*!
 *
 *    kartograph - a svg mapping library 
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

  var Aitoff, Azimuthal, BBox, Balthasart, Behrmann, BlurFilter, Bubble, BubbleMarker, CEA, CanvasLayer, Circle, CohenSutherland, Conic, Cylindrical, DotMarker, EckertIV, EquidistantAzimuthal, Equirectangular, Filter, GallPeters, GlowFilter, HoboDyer, HtmlLabel, Icon, IconMarker, Kartograph, LAEA, LCC, LabelMarker, LabeledIconMarker, LatLon, Line, LonLat, Loximuthal, MapLayer, MapLayerPath, MapMarker, Mercator, Mollweide, NaturalEarth, Orthographic, PanAndZoomControl, Path, Proj, PseudoConic, PseudoCylindrical, Robinson, Satellite, Sinusoidal, Stereographic, SvgLabel, Symbol, SymbolGroup, View, WagnerIV, WagnerV, filter, kartograph, log, root, warn, __proj, _base, _ref, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref = root.kartograph) != null ? _ref : root.kartograph = {};

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
    return new kartograph.BBox(x, y, w, h);
  };

  kartograph.BBox = BBox;

  "kartograph - a svg mapping library \nCopyright (C) 2011  Gregor Aisch\n\nThis program is free software: you can redistribute it and/or modify\nit under the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\n\nThis program is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\nGNU General Public License for more details.\n\nYou should have received a copy of the GNU General Public License\nalong with this program.  If not, see <http://www.gnu.org/licenses/>.";

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref2 = root.kartograph) != null ? _ref2 : root.kartograph = {};

  if ((_ref3 = kartograph.geom) == null) kartograph.geom = {};

  if ((_ref4 = (_base = kartograph.geom).clipping) == null) _base.clipping = {};

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

  kartograph.geom.clipping.CohenSutherland = CohenSutherland;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref5 = root.kartograph) != null ? _ref5 : root.kartograph = {};

  filter = (_ref6 = kartograph.filter) != null ? _ref6 : kartograph.filter = {};

  Filter = (function() {

    function Filter(params) {
      this.params = params != null ? params : {};
    }

    Filter.prototype.getFilter = function(id) {
      var fltr, me;
      me = this;
      fltr = me.SVG('filter', {
        id: id
      });
      me.buildFilter(fltr);
      return fltr;
    };

    Filter.prototype._getFilter = function() {
      throw "not implemented";
    };

    Filter.prototype.SVG = function(el, attr) {
      var key, val;
      if (typeof el === "string") {
        el = window.document.createElementNS("http://www.w3.org/2000/svg", el);
      }
      if (attr) {
        for (key in attr) {
          val = attr[key];
          el.setAttribute(key, val);
        }
      }
      return el;
    };

    return Filter;

  })();

  BlurFilter = (function() {

    __extends(BlurFilter, Filter);

    function BlurFilter() {
      BlurFilter.__super__.constructor.apply(this, arguments);
    }

    BlurFilter.prototype.buildFilter = function(fltr) {
      var SVG, blur, me;
      me = this;
      SVG = me.SVG;
      blur = SVG('feGaussianBlur', {
        stdDeviation: me.params.size || 4,
        result: 'blur'
      });
      return fltr.appendChild(blur);
    };

    return BlurFilter;

  })();

  filter.blur = BlurFilter;

  GlowFilter = (function() {

    __extends(GlowFilter, Filter);

    function GlowFilter() {
      GlowFilter.__super__.constructor.apply(this, arguments);
    }

    GlowFilter.prototype.buildFilter = function(fltr) {
      var alpha, blur, color, inner, knockout, me, rgb, strength, _ref10, _ref11, _ref12, _ref7, _ref8, _ref9;
      me = this;
      blur = (_ref7 = me.params.blur) != null ? _ref7 : 4;
      strength = (_ref8 = me.params.strength) != null ? _ref8 : 1;
      color = (_ref9 = me.params.color) != null ? _ref9 : '#D1BEB0';
      if (typeof color === 'string') color = chroma.hex(color);
      rgb = color.rgb;
      inner = (_ref10 = me.params.inner) != null ? _ref10 : false;
      knockout = (_ref11 = me.params.knockout) != null ? _ref11 : false;
      alpha = (_ref12 = me.params.alpha) != null ? _ref12 : 1;
      if (inner) {
        me.innerGlow(fltr, blur, strength, rgb, alpha, knockout);
      } else {
        me.outerGlow(fltr, blur, strength, rgb, alpha, knockout);
      }
    };

    GlowFilter.prototype.outerGlow = function(fltr, _blur, _strength, rgb, alpha, knockout) {
      var SVG, blur, comp, mat, me, merge, morph;
      me = this;
      SVG = me.SVG;
      mat = SVG('feColorMatrix', {
        "in": 'SourceGraphic',
        type: 'matrix',
        values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0',
        result: 'mask'
      });
      fltr.appendChild(mat);
      if (_strength > 0) {
        morph = SVG('feMorphology', {
          "in": 'mask',
          radius: _strength,
          operator: 'dilate',
          result: 'mask'
        });
        fltr.appendChild(morph);
      }
      mat = SVG('feColorMatrix', {
        "in": 'mask',
        type: 'matrix',
        values: '0 0 0 0 ' + (rgb[0] / 255) + ' 0 0 0 0 ' + (rgb[1] / 255) + ' 0 0 0 0 ' + (rgb[2] / 255) + '  0 0 0 1 0',
        result: 'r0'
      });
      fltr.appendChild(mat);
      blur = SVG('feGaussianBlur', {
        "in": 'r0',
        stdDeviation: _blur,
        result: 'r1'
      });
      fltr.appendChild(blur);
      comp = SVG('feComposite', {
        operator: 'out',
        "in": 'r1',
        in2: 'mask',
        result: 'comp'
      });
      fltr.appendChild(comp);
      merge = SVG('feMerge');
      if (!knockout) {
        merge.appendChild(SVG('feMergeNode', {
          'in': 'SourceGraphic'
        }));
      }
      merge.appendChild(SVG('feMergeNode', {
        'in': 'r1'
      }));
      return fltr.appendChild(merge);
    };

    GlowFilter.prototype.innerGlow = function(fltr, _blur, _strength, rgb, alpha, knockout) {
      var SVG, blur, comp, mat, me, merge, morph;
      me = this;
      SVG = me.SVG;
      console.log('innerglow');
      mat = SVG('feColorMatrix', {
        "in": 'SourceGraphic',
        type: 'matrix',
        values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 500 0',
        result: 'mask'
      });
      fltr.appendChild(mat);
      morph = SVG('feMorphology', {
        "in": 'mask',
        radius: _strength,
        operator: 'erode',
        result: 'r1'
      });
      fltr.appendChild(morph);
      blur = SVG('feGaussianBlur', {
        "in": 'r1',
        stdDeviation: _blur,
        result: 'r2'
      });
      fltr.appendChild(blur);
      mat = SVG('feColorMatrix', {
        type: 'matrix',
        "in": 'r2',
        values: '1 0 0 0 ' + (rgb[0] / 255) + ' 0 1 0 0 ' + (rgb[1] / 255) + ' 0 0 1 0 ' + (rgb[2] / 255) + ' 0 0 0 -1 ' + alpha,
        result: 'r3'
      });
      fltr.appendChild(mat);
      comp = SVG('feComposite', {
        operator: 'in',
        "in": 'r3',
        in2: 'mask',
        result: 'comp'
      });
      fltr.appendChild(comp);
      merge = SVG('feMerge');
      if (!knockout) {
        merge.appendChild(SVG('feMergeNode', {
          'in': 'SourceGraphic'
        }));
      }
      merge.appendChild(SVG('feMergeNode', {
        'in': 'comp'
      }));
      return fltr.appendChild(merge);
    };

    return GlowFilter;

  })();

  filter.glow = GlowFilter;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = root.K = (_ref7 = root.kartograph) != null ? _ref7 : root.kartograph = {};

  kartograph.version = "0.4.2";

  warn = function(s) {
    return console.warn('kartograph (' + kartograph.version + '): ' + s);
  };

  log = function(s) {
    return console.log('kartograph (' + kartograph.version + '): ' + s);
  };

  Kartograph = (function() {

    function Kartograph(container) {
      var cnt, me;
      me = this;
      me.container = cnt = $(container);
      me.viewport = new kartograph.BBox(0, 0, cnt.width(), cnt.height());
      me.paper = me.createSVGLayer();
      me.markers = [];
      me.container.addClass('kartograph');
    }

    Kartograph.prototype.createSVGLayer = function(id) {
      var about, cnt, lid, me, paper, svg, vp, _ref8;
      me = this;
      if ((_ref8 = me._layerCnt) == null) me._layerCnt = 0;
      lid = me._layerCnt++;
      vp = me.viewport;
      cnt = me.container;
      paper = Raphael(cnt[0], vp.width, vp.height);
      svg = $(paper.canvas);
      svg.css({
        position: 'absolute',
        top: '0px',
        left: '0px',
        'z-index': lid + 5
      });
      if (cnt.css('position') === 'static') cnt.css('position', 'relative');
      svg.addClass(id);
      about = $('desc', paper.canvas).text();
      $('desc', paper.canvas).text(about.replace('with ', 'with kartograph ' + kartograph.version + ' and '));
      return paper;
    };

    Kartograph.prototype.createHTMLLayer = function(id) {
      var cnt, div, lid, me, vp, _ref8;
      me = this;
      vp = me.viewport;
      cnt = me.container;
      if ((_ref8 = me._layerCnt) == null) me._layerCnt = 0;
      lid = me._layerCnt++;
      div = $('<div class="layer ' + id + '" />');
      div.css({
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: vp.width + 'px',
        height: vp.height + 'px',
        'z-index': lid + 5
      });
      cnt.append(div);
      return div;
    };

    Kartograph.prototype.loadMap = function(mapurl, callback, opts) {
      var me, _base2, _ref8;
      me = this;
      me.opts = opts != null ? opts : {};
      if ((_ref8 = (_base2 = me.opts).zoom) == null) _base2.zoom = 1;
      me.mapLoadCallback = callback;
      $.ajax({
        url: mapurl,
        success: me.mapLoaded,
        context: me
      });
    };

    Kartograph.prototype.addLayer = function(src_id, layer_id, path_id) {
      /*
      		add new layer
      */
      var $paths, layer, me, svgLayer, svg_path, _i, _len, _ref8, _ref9;
      me = this;
      if ((_ref8 = me.layerIds) == null) me.layerIds = [];
      if ((_ref9 = me.layers) == null) me.layers = {};
      if (layer_id == null) layer_id = src_id;
      svgLayer = $('g#' + src_id, me.svgSrc);
      if (svgLayer.length === 0) {
        warn('didn\'t find any paths for layer "' + layer_id + '"');
        return;
      }
      layer = new MapLayer(layer_id, path_id, me.paper, me.viewBC);
      $paths = $('*', svgLayer[0]);
      for (_i = 0, _len = $paths.length; _i < _len; _i++) {
        svg_path = $paths[_i];
        layer.addPath(svg_path);
      }
      if (layer.paths.length > 0) {
        me.layers[layer_id] = layer;
        me.layerIds.push(layer_id);
      } else {
        warn('didn\'t find any paths for layer ' + layer_id);
      }
    };

    Kartograph.prototype.getLayerPath = function(layer_id, path_id) {
      var me;
      me = this;
      if ((me.layers[layer_id] != null) && me.layers[layer_id].hasPath(path_id)) {
        return me.layers[layer_id].getPath(path_id);
      }
      return null;
    };

    Kartograph.prototype.addCanvasLayer = function(src_id, drawCallback) {
      var $paths, canvas, layer, me, svgLayer, svg_path, _i, _len;
      me = this;
      if (!(me.canvas != null)) {
        canvas = $('<canvas />');
        canvas.css({
          position: 'absolute',
          top: '0px',
          left: '0px'
        });
        canvas.attr({
          width: me.viewport.width + 'px',
          height: me.viewport.height + 'px'
        });
        me.container.append(canvas);
        me.canvas = canvas[0];
      }
      svgLayer = $('g#' + src_id, me.svgSrc);
      if (svgLayer.length === 0) {
        warn('didn\'t find any paths for layer "' + layer_id + '"');
        return;
      }
      layer = new CanvasLayer(src_id, me.canvas, me.viewBC, drawCallback);
      $paths = $('*', svgLayer[0]);
      for (_i = 0, _len = $paths.length; _i < _len; _i++) {
        svg_path = $paths[_i];
        layer.addPath(svg_path);
      }
      return layer.render();
    };

    Kartograph.prototype.addLayerEvent = function(event, callback, layerId) {
      var me, path, paths, _i, _len, _results;
      me = this;
      if (layerId == null) layerId = me.layerIds[me.layerIds.length - 1];
      paths = me.layers[layerId].paths;
      _results = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        _results.push($(path.svgPath.node).bind(event, callback));
      }
      return _results;
    };

    Kartograph.prototype.addMarker = function(marker) {
      var me, xy;
      me = this;
      me.markers.push(marker);
      xy = me.viewBC.project(me.viewAB.project(me.proj.project(marker.lonlat.lon, marker.lonlat.lat)));
      return marker.render(xy[0], xy[1], me.container, me.paper);
    };

    Kartograph.prototype.clearMarkers = function() {
      var marker, me, _i, _len, _ref8;
      me = this;
      _ref8 = me.markers;
      for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
        marker = _ref8[_i];
        marker.clear();
      }
      return me.markers = [];
    };

    Kartograph.prototype.choropleth = function(opts) {
      var col, colorscale, data, data_col, id, layer_id, me, no_data_color, path, pathData, paths, row, v, _i, _len, _ref10, _ref8, _ref9;
      me = this;
      layer_id = (_ref8 = opts.layer) != null ? _ref8 : me.layerIds[me.layerIds.length - 1];
      if (!me.layers.hasOwnProperty(layer_id)) {
        warn('choropleth error: layer "' + layer_ihad + '" not found');
        return;
      }
      data = opts.data;
      data_col = opts.key;
      no_data_color = (_ref9 = opts.noDataColor) != null ? _ref9 : '#ccc';
      colorscale = opts.colorscale;
      pathData = {};
      for (id in data) {
        row = data[id];
        pathData[id] = row[data_col];
      }
      _ref10 = me.layers[layer_id].pathsById;
      for (id in _ref10) {
        paths = _ref10[id];
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          if ((pathData[id] != null) && colorscale.validValue(pathData[id])) {
            v = pathData[id];
            col = colorscale.getColor(v);
            path.svgPath.node.setAttribute('style', 'fill:' + col);
          } else {
            path.svgPath.node.setAttribute('style', 'fill:' + no_data_color);
          }
        }
      }
    };

    Kartograph.prototype.tooltips = function(opts) {
      var cfg, id, layer_id, me, path, paths, tooltips, tt, _ref8, _ref9, _results;
      me = this;
      tooltips = opts.content;
      layer_id = (_ref8 = opts.layer) != null ? _ref8 : me.layerIds[me.layerIds.length - 1];
      if (!me.layers.hasOwnProperty(layer_id)) {
        warn('tooltips error: layer "' + layer_id + '" not found');
        return;
      }
      _ref9 = me.layers[layer_id].pathsById;
      _results = [];
      for (id in _ref9) {
        paths = _ref9[id];
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
    					if globe._visible(lon, lat_)
    						xy = v1.project(v0.project(globe.project(lon, lat_)))
    						pts.push xy
    					else
    						if pts.length > 1
    							line = new kartograph.geom.Line(pts)
    							pts = []
    							lines = lines.concat(line.clipToBBox(viewbox))
    				
    				if pts.length > 1
    					line = new kartograph.geom.Line(pts)
    					pts = []
    					lines = lines.concat(line.clipToBBox(viewbox))
    					
    				for line in lines
    					path = self.paper.path(line.toSVG())
    					path.setAttribute('class', 'graticule latitude lat_'+Math.abs(lat_)+(if lat_ < 0 then 'W' else 'E'))
    					grat_lines.push(path)
    */

    Kartograph.prototype.display = function() {
      /*
      		finally displays the kartograph, needs to be called after
      		layer and marker setup is finished
      */      return this.render();
    };

    /* 
    	    end of public API
    */

    Kartograph.prototype.mapLoaded = function(xml) {
      var $view, AB, halign, me, padding, valign, vp, _ref10, _ref8, _ref9;
      me = this;
      me.svgSrc = xml;
      vp = me.viewport;
      $view = $('view', xml)[0];
      me.viewAB = AB = kartograph.View.fromXML($view);
      padding = (_ref8 = me.opts.padding) != null ? _ref8 : 0;
      halign = (_ref9 = me.opts.halign) != null ? _ref9 : 'center';
      valign = (_ref10 = me.opts.valign) != null ? _ref10 : 'center';
      me.viewBC = new kartograph.View(AB.asBBox(), vp.width, vp.height, padding, halign, valign);
      me.proj = kartograph.Proj.fromXML($('proj', $view)[0]);
      return me.mapLoadCallback(me);
    };

    Kartograph.prototype.loadCoastline = function() {
      var me;
      me = this;
      return $.ajax({
        url: 'coastline.json',
        success: me.renderCoastline,
        context: me
      });
    };

    Kartograph.prototype.renderCoastline = function(coastlines) {
      var P, d, i, line, me, p0, p1, pathstr, view0, view1, vp, _i, _len, _ref8, _results;
      me = this;
      P = me.proj;
      vp = me.viewport;
      view0 = me.viewAB;
      view1 = me.viewBC;
      _results = [];
      for (_i = 0, _len = coastlines.length; _i < _len; _i++) {
        line = coastlines[_i];
        pathstr = '';
        for (i = 0, _ref8 = line.length - 2; 0 <= _ref8 ? i <= _ref8 : i >= _ref8; 0 <= _ref8 ? i++ : i--) {
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

    Kartograph.prototype.onPathEvent = function(evt) {
      /*
      		forwards path events to their callbacks, but attaches the path to
      		the event object
      */
      var me, path;
      me = this;
      path = evt.target.path;
      return me.layerEventCallbacks[path.layer][evt.type](path);
    };

    Kartograph.prototype.resize = function() {
      /*
      		forces redraw of every layer
      */
      var cnt, halign, id, layer, me, padding, valign, vp, zoom, _ref10, _ref11, _ref8, _ref9, _results;
      me = this;
      cnt = me.container;
      me.viewport = vp = new kartograph.BBox(0, 0, cnt.width(), cnt.height());
      me.paper.setSize(vp.width, vp.height);
      vp = me.viewport;
      padding = (_ref8 = me.opts.padding) != null ? _ref8 : 0;
      halign = (_ref9 = me.opts.halign) != null ? _ref9 : 'center';
      valign = (_ref10 = me.opts.valign) != null ? _ref10 : 'center';
      zoom = me.opts.zoom;
      me.viewBC = new kartograph.View(me.viewAB.asBBox(), vp.width * zoom, vp.height * zoom, padding, halign, valign);
      _ref11 = me.layers;
      _results = [];
      for (id in _ref11) {
        layer = _ref11[id];
        _results.push(layer.setView(me.viewBC));
      }
      return _results;
    };

    Kartograph.prototype.addFilter = function(id, type, params) {
      var doc, fltr, me;
      if (params == null) params = {};
      me = this;
      doc = window.document;
      if (kartograph.filter[type] != null) {
        fltr = new kartograph.filter[type](params).getFilter(id);
      } else {
        throw 'unknown filter type ' + type;
      }
      return me.paper.defs.appendChild(fltr);
    };

    Kartograph.prototype.applyFilter = function(layer_id, filter_id) {
      var me;
      me = this;
      return $('.polygon.' + layer_id, me.paper.canvas).attr({
        filter: 'url(#' + filter_id + ')'
      });
    };

    Kartograph.prototype.lonlat2xy = function(lonlat) {
      var a, me;
      me = this;
      if (lonlat.length === 2) {
        lonlat = new kartograph.LonLat(lonlat[0], lonlat[1]);
      }
      if (lonlat.length === 3) {
        lonlat = new kartograph.LonLat(lonlat[0], lonlat[1], lonlat[2]);
      }
      a = me.proj.project(lonlat.lon, lonlat.lat, lonlat.alt);
      return me.viewBC.project(me.viewAB.project(a));
    };

    Kartograph.prototype.addGeoPath = function(points, cmds, className) {
      var cmd, i, me, path, path_str, pt, xy, _ref8;
      if (cmds == null) cmds = [];
      if (className == null) className = '';
      me = this;
      if (cmds.length === 0) cmds.push('M');
      path_str = '';
      for (i in points) {
        pt = points[i];
        cmd = (_ref8 = cmds[i]) != null ? _ref8 : 'L';
        xy = me.lonlat2xy(pt);
        path_str += cmd + xy[0] + ',' + xy[1];
      }
      path = me.paper.path(path_str);
      path.node.setAttribute('class', className);
    };

    Kartograph.prototype.showZoomControls = function() {
      var me;
      me = this;
      me.zc = new PanAndZoomControl(me);
      return me;
    };

    return Kartograph;

  })();

  kartograph.Kartograph = Kartograph;

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
      var layerPath, me, _base2, _name, _ref10, _ref8, _ref9;
      me = this;
      if ((_ref8 = me.paths) == null) me.paths = [];
      layerPath = new MapLayerPath(svg_path, me.id, me.paper, me.view);
      me.paths.push(layerPath);
      if (me.path_id != null) {
        if ((_ref9 = me.pathsById) == null) me.pathsById = {};
        if ((_ref10 = (_base2 = me.pathsById)[_name = layerPath.data[me.path_id]]) == null) {
          _base2[_name] = [];
        }
        return me.pathsById[layerPath.data[me.path_id]].push(layerPath);
      }
    };

    MapLayer.prototype.hasPath = function(id) {
      var me;
      me = this;
      return (me.pathsById != null) && (me.pathsById[id] != null);
    };

    MapLayer.prototype.getPath = function(id) {
      var me;
      me = this;
      if (me.hasPath(id)) return me.pathsById[id][0];
      throw 'path ' + id + ' not found';
    };

    MapLayer.prototype.setView = function(view) {
      /*
      		# after resizing of the map, each layer gets a new view
      */
      var me, path, _i, _len, _ref8, _results;
      me = this;
      _ref8 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
        path = _ref8[_i];
        _results.push(path.setView(view));
      }
      return _results;
    };

    return MapLayer;

  })();

  MapLayerPath = (function() {

    function MapLayerPath(svg_path, layer_id, paper, view) {
      var attr, data, i, me, path, _ref8;
      me = this;
      me.path = path = kartograph.geom.Path.fromSVG(svg_path);
      me.svgPath = view.projectPath(path).toSVG(paper);
      me.baseClass = 'polygon ' + layer_id;
      me.svgPath.node.setAttribute('class', me.baseClass);
      me.svgPath.node.path = me;
      data = {};
      for (i = 0, _ref8 = svg_path.attributes.length - 1; 0 <= _ref8 ? i <= _ref8 : i >= _ref8; 0 <= _ref8 ? i++ : i--) {
        attr = svg_path.attributes[i];
        if (attr.name.substr(0, 5) === "data-") {
          data[attr.name.substr(5)] = attr.value;
        }
      }
      me.data = data;
    }

    MapLayerPath.prototype.setView = function(view) {
      var me, path, path_str;
      me = this;
      path = view.projectPath(me.path);
      if (me.path.type === "path") {
        path_str = path.svgString();
        return me.svgPath.attr({
          path: path_str
        });
      } else if (me.path.type === "circle") {
        return me.svgPath.attr({
          cx: path.x,
          cy: path.y,
          r: path.r
        });
      }
    };

    return MapLayerPath;

  })();

  CanvasLayer = (function() {

    function CanvasLayer(layer_id, canvas, view, renderCallback) {
      var me;
      me = this;
      me.layer_id = layer_id;
      me.canvas = canvas;
      me.view = view;
      me.renderCallback = renderCallback;
    }

    CanvasLayer.prototype.addPath = function(svg_path) {
      var me, path, _ref8;
      me = this;
      if ((_ref8 = me.paths) == null) me.paths = [];
      path = kartograph.geom.Path.fromSVG(svg_path);
      return me.paths.push(path);
    };

    CanvasLayer.prototype.render = function() {
      var me, path, paths, _i, _len, _ref8;
      me = this;
      paths = [];
      _ref8 = me.paths;
      for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
        path = _ref8[_i];
        paths.push(me.view.projectPath(path));
      }
      return me.renderCallback(me, paths);
    };

    CanvasLayer.prototype.drawPaths = function() {
      var c, contour, me, path, pt, _i, _len, _ref8, _results;
      me = this;
      c = me.canvas.getContext('2d');
      _ref8 = me.paths;
      _results = [];
      for (_i = 0, _len = _ref8.length; _i < _len; _i++) {
        path = _ref8[_i];
        path = me.view.projectPath(path);
        _results.push((function() {
          var _j, _len2, _ref9, _results2;
          _ref9 = path.contours;
          _results2 = [];
          for (_j = 0, _len2 = _ref9.length; _j < _len2; _j++) {
            contour = _ref9[_j];
            contour.reverse();
            _results2.push((function() {
              var _k, _len3, _results3;
              _results3 = [];
              for (_k = 0, _len3 = contour.length; _k < _len3; _k++) {
                pt = contour[_k];
                if (pt === contour[0]) {
                  _results3.push(c.moveTo(pt[0], pt[1]));
                } else {
                  _results3.push(c.lineTo(pt[0], pt[1]));
                }
              }
              return _results3;
            })());
          }
          return _results2;
        })());
      }
      return _results;
    };

    return CanvasLayer;

  })();

  PanAndZoomControl = (function() {

    function PanAndZoomControl(map) {
      this.zoomOut = __bind(this.zoomOut, this);
      this.zoomIn = __bind(this.zoomIn, this);
      var c, div, mdown, me, mup, zc, zcm, zcp;
      me = this;
      me.map = map;
      c = map.container;
      div = function(className, childNodes) {
        var child, d, _i, _len;
        if (childNodes == null) childNodes = [];
        d = $('<div class="' + className + '" />');
        for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
          child = childNodes[_i];
          d.append(child);
        }
        return d;
      };
      mdown = function(evt) {
        return $(evt.target).addClass('md');
      };
      mup = function(evt) {
        return $(evt.target).removeClass('md');
      };
      zcp = div('plus');
      zcp.mousedown(mdown);
      zcp.mouseup(mup);
      zcp.click(me.zoomIn);
      zcm = div('minus');
      zcm.mousedown(mdown);
      zcm.mouseup(mup);
      zcm.click(me.zoomOut);
      zc = div('zoom-control', [zcp, zcm]);
      c.append(zc);
    }

    PanAndZoomControl.prototype.zoomIn = function(evt) {
      var me;
      me = this;
      me.map.opts.zoom += 1;
      return me.map.resize();
    };

    PanAndZoomControl.prototype.zoomOut = function(evt) {
      var me;
      me = this;
      me.map.opts.zoom -= 1;
      if (me.map.opts.zoom < 1) me.map.opts.zoom = 1;
      return me.map.resize();
    };

    return PanAndZoomControl;

  })();

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref8 = root.kartograph) != null ? _ref8 : root.kartograph = {};

  LonLat = (function() {

    /*
    	represents a Point
    */

    function LonLat(lon, lat, alt) {
      if (alt == null) alt = 0;
      this.lon = Number(lon);
      this.lat = Number(lat);
      this.alt = Number(alt);
    }

    LonLat.prototype.distance = function(ll) {
      var R, a, c, dLat, dLon, deg2rad, lat1, lat2, me;
      me = this;
      R = 6371;
      deg2rad = Math.PI / 180;
      dLat = (ll.lat - me.lat) * deg2rad;
      dLon = (ll.lon - me.lon) * deg2rad;
      lat1 = me.lat * deg2rad;
      lat2 = ll.lat * deg2rad;
      a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return LonLat;

  })();

  LatLon = (function() {

    __extends(LatLon, LonLat);

    function LatLon(lat, lon, alt) {
      if (alt == null) alt = 0;
      LatLon.__super__.constructor.call(this, lon, lat, alt);
    }

    return LatLon;

  })();

  kartograph.LonLat = LonLat;

  kartograph.LatLon = LatLon;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref9 = root.kartograph) != null ? _ref9 : root.kartograph = {};

  if ((_ref10 = kartograph.marker) == null) kartograph.marker = {};

  /*
  New API
  
  sg = new SymbolGroup({
  	data: crimeRatesPerCity,
  	location: function(d) {
  		return [d.lon, d.lat]];
  	},
  	filter: function(d) {
  		return !isNaN(d.pop);
  	},
  	layout: 'group',
  	group: function(list) {
  		var s=0,p=0,i,d,g = {},lat=0,lon=0;
  		for (i in list) {
  			d = list[i];
  			s += d.murder;
  			p += d.pop;
  		}
  		for (i in list) {
  			d = list[i];
  			lon += d.ll[0] * d.pop/p;
  			lat += d.ll[1] * d.pop/p;
  		}
  		g.murder = s;
  		g.pop = p;
  		g.ll = [lon,lat];
  		return g;
  	},
  	// type specific options
  	type: 'Bubble',
  	radius: function(d) {
  		return Math.sqrt(d.murder/d.pop)*5;
  	},
  	color: '#c00'
  })
  */

  SymbolGroup = (function() {

    function SymbolGroup(opts) {
      var SymbolType, d, i, id, l, layer, me, nid, optional, p, required, s, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _m, _ref11, _ref12, _ref13;
      me = this;
      required = ['data', 'location', 'type', 'map'];
      optional = ['filter', 'tooltip', 'layout', 'group'];
      for (_i = 0, _len = required.length; _i < _len; _i++) {
        p = required[_i];
        if (opts[p] != null) {
          me[p] = opts[p];
        } else {
          throw "SymbolGroup: missing argument " + p;
        }
      }
      for (_j = 0, _len2 = optional.length; _j < _len2; _j++) {
        p = optional[_j];
        if (opts[p] != null) me[p] = opts[p];
      }
      SymbolType = me.type;
      _ref11 = SymbolType.props;
      for (_k = 0, _len3 = _ref11.length; _k < _len3; _k++) {
        p = _ref11[_k];
        if (opts[p] != null) me[p] = opts[p];
      }
      me.layers = {
        mapcanvas: me.map.paper
      };
      _ref12 = SymbolType.layers;
      for (_l = 0, _len4 = _ref12.length; _l < _len4; _l++) {
        l = _ref12[_l];
        nid = SymbolGroup._layerid++;
        id = 'sl_' + nid;
        if (l.type === 'svg') {
          layer = me.map.createSVGLayer(id);
        } else if (l.type === 'html') {
          layer = me.map.createHTMLLayer(id);
        }
        me.layers[l.id] = layer;
      }
      for (i in me.data) {
        d = me.data[i];
        if (type(me.filter) === "function") {
          if (me.filter(d)) me.addSymbol(d);
        } else {
          me.addSymbol(d);
        }
      }
      me.layoutSymbols();
      _ref13 = me.symbols;
      for (_m = 0, _len5 = _ref13.length; _m < _len5; _m++) {
        s = _ref13[_m];
        s.render();
      }
      if (type(me.tooltip) === "function") me.initTooltips();
    }

    SymbolGroup.prototype.addSymbol = function(data) {
      /*
      		adds a new symbol to this group
      */
      var SymbolType, ll, me, p, sprops, symbol, _i, _len, _ref11, _ref12;
      me = this;
      if ((_ref11 = me.symbols) == null) me.symbols = [];
      SymbolType = me.type;
      ll = me.evaluate(me.location, data);
      if (type(ll) === 'array') ll = new kartograph.LonLat(ll[0], ll[1]);
      sprops = {
        layers: me.layers,
        location: ll,
        data: data
      };
      _ref12 = SymbolType.props;
      for (_i = 0, _len = _ref12.length; _i < _len; _i++) {
        p = _ref12[_i];
        if (me[p] != null) sprops[p] = me.evaluate(me[p], data);
      }
      symbol = new SymbolType(sprops);
      me.symbols.push(symbol);
      return symbol;
    };

    SymbolGroup.prototype.evaluate = function(prop, data) {
      /*
      		evaluates a property function or returns a static value
      */
      var val;
      if (type(prop) === 'function') {
        return val = prop(data);
      } else {
        return val = prop;
      }
    };

    SymbolGroup.prototype.layoutSymbols = function() {
      var layer_id, ll, me, path, path_id, s, xy, _i, _len, _ref11, _ref12;
      me = this;
      _ref11 = me.symbols;
      for (_i = 0, _len = _ref11.length; _i < _len; _i++) {
        s = _ref11[_i];
        ll = s.location;
        if (type(ll) === 'string') {
          _ref12 = ll.split('.'), layer_id = _ref12[0], path_id = _ref12[1];
          path = me.map.getLayerPath(layer_id, path_id);
          if (path != null) {
            xy = me.map.viewBC.project(path.path.centroid());
          } else {
            continue;
          }
        } else {
          xy = me.map.lonlat2xy(ll);
        }
        s.x = xy[0];
        s.y = xy[1];
      }
      if (me.layout === 'group') return me.groupLayout();
    };

    SymbolGroup.prototype.groupLayout = function() {
      /*
      		layouts symbols in this group, eventually adds new 'grouped' symbols
      */
      var me, overlap, _ref11;
      me = this;
      if ((_ref11 = me.gsymbols) == null) me.gsymbols = [];
      return overlap = true;
    };

    SymbolGroup.prototype.initTooltips = function() {
      var cfg, me, node, s, tooltips, tt, _i, _j, _len, _len2, _ref11, _ref12;
      me = this;
      tooltips = me.tooltip;
      _ref11 = me.symbols;
      for (_i = 0, _len = _ref11.length; _i < _len; _i++) {
        s = _ref11[_i];
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
        console.log(s, s.data);
        tt = tooltips(s.data);
        if (type(tt) === "string") {
          cfg.content.text = tt;
        } else if (type(tt) === "array") {
          cfg.content.title = tt[0];
          cfg.content.text = tt[1];
        }
        _ref12 = s.nodes();
        for (_j = 0, _len2 = _ref12.length; _j < _len2; _j++) {
          node = _ref12[_j];
          $(node).qtip(cfg);
        }
      }
    };

    return SymbolGroup;

  })();

  SymbolGroup._layerid = 0;

  kartograph.SymbolGroup = SymbolGroup;

  Symbol = (function() {

    function Symbol(opts) {
      var me;
      me = this;
      me.location = opts.location;
      me.data = opts.data;
      me.layers = opts.layers;
      me.x = opts.x;
      me.y = opts.y;
    }

    Symbol.prototype.init = function() {};

    Symbol.prototype.overlaps = function(symbol) {
      return false;
    };

    Symbol.prototype.nodes = function() {
      return [];
    };

    return Symbol;

  })();

  Bubble = (function() {

    __extends(Bubble, Symbol);

    function Bubble(opts) {
      var me, _ref11, _ref12, _ref13;
      me = this;
      Bubble.__super__.constructor.call(this, opts);
      me.radius = (_ref11 = opts.radius) != null ? _ref11 : 4;
      me.style = (_ref12 = opts.style) != null ? _ref12 : '';
      me["class"] = (_ref13 = opts["class"]) != null ? _ref13 : '';
    }

    Bubble.prototype.overlaps = function(bubble) {
      var dx, dy, me, r1, r2, x1, x2, y1, y2, _ref11, _ref12;
      me = this;
      _ref11 = [me.x, me.y, me.radius], x1 = _ref11[0], y1 = _ref11[1], r1 = _ref11[2];
      _ref12 = [bubble.x, bubble.y, bubble.radius], x2 = _ref12[0], y2 = _ref12[1], r2 = _ref12[2];
      if (x1 - r1 > x2 + r2 || x1 + r1 < x2 - r2 || y1 - r1 > y2 + r2 || y1 + r1 < y2 - r2) {
        return false;
      }
      dx = x1 - x2;
      dy = y1 - y2;
      if (dx * dx + dy * dy > (r1 + r2) * (r1 + r2)) return false;
      return true;
    };

    Bubble.prototype.render = function(layers) {
      var me;
      me = this;
      me.path = me.layers.a.circle(me.x, me.y, me.radius);
      me.update();
      return me;
    };

    Bubble.prototype.update = function() {
      var me, path;
      me = this;
      me.path.attr({
        x: me.x,
        y: me.y,
        r: me.radius
      });
      path = me.path;
      path.node.setAttribute('style', me.style);
      path.node.setAttribute('class', me["class"]);
      return me;
    };

    Bubble.prototype.clear = function() {
      var me;
      me = this;
      me.path.remove();
      return me;
    };

    Bubble.prototype.nodes = function() {
      var me;
      me = this;
      return [me.path.node];
    };

    return Bubble;

  })();

  Bubble.props = ['radius', 'style', 'class'];

  Bubble.layers = [
    {
      id: 'a',
      type: 'svg'
    }
  ];

  kartograph.Bubble = Bubble;

  HtmlLabel = (function() {

    __extends(HtmlLabel, Symbol);

    function HtmlLabel(opts) {
      var me, _ref11, _ref12, _ref13;
      me = this;
      HtmlLabel.__super__.constructor.call(this, opts);
      me.text = (_ref11 = opts.text) != null ? _ref11 : '';
      me.style = (_ref12 = opts.style) != null ? _ref12 : '';
      me["class"] = (_ref13 = opts["class"]) != null ? _ref13 : '';
    }

    HtmlLabel.prototype.render = function(layers) {
      var l, lbl, me;
      me = this;
      l = $('<div>' + me.text + '</div>');
      l.css({
        width: '50px',
        position: 'absolute',
        left: '-25px',
        'text-align': 'center'
      });
      me.lbl = lbl = $('<div class="label" />');
      lbl.append(l);
      me.layers.lbl.append(lbl);
      l.css({
        height: l.height() + 'px',
        top: (l.height() * -.4) + 'px'
      });
      me.update();
      return me;
    };

    HtmlLabel.prototype.update = function() {
      var me;
      me = this;
      return me.lbl.css({
        position: 'absolute',
        left: me.x + 'px',
        top: me.y + 'px'
      });
    };

    HtmlLabel.prototype.clear = function() {
      var me;
      me = this;
      me.lbl.remove();
      return me;
    };

    HtmlLabel.prototype.nodes = function() {
      var me;
      me = this;
      return [me.lbl[0]];
    };

    return HtmlLabel;

  })();

  HtmlLabel.props = ['text', 'style', 'class'];

  HtmlLabel.layers = [
    {
      id: 'lbl',
      type: 'html'
    }
  ];

  kartograph.HtmlLabel = HtmlLabel;

  SvgLabel = (function() {

    __extends(SvgLabel, Symbol);

    function SvgLabel(opts) {
      var me, _ref11, _ref12, _ref13;
      me = this;
      SvgLabel.__super__.constructor.call(this, opts);
      me.text = (_ref11 = opts.text) != null ? _ref11 : '';
      me.style = (_ref12 = opts.style) != null ? _ref12 : '';
      me["class"] = (_ref13 = opts["class"]) != null ? _ref13 : '';
    }

    SvgLabel.prototype.render = function(layers) {
      var lbl, me;
      me = this;
      me.lbl = lbl = me.layers.mapcanvas.text(me.x, me.y, me.text);
      me.update();
      return me;
    };

    SvgLabel.prototype.update = function() {
      var me;
      me = this;
      me.lbl.attr({
        x: me.x,
        y: me.y
      });
      me.lbl.node.setAttribute('style', me.style);
      return me.lbl.node.setAttribute('class', me["class"]);
    };

    SvgLabel.prototype.clear = function() {
      var me;
      me = this;
      me.lbl.remove();
      return me;
    };

    SvgLabel.prototype.nodes = function() {
      var me;
      me = this;
      return [me.lbl.node];
    };

    return SvgLabel;

  })();

  SvgLabel.props = ['text', 'style', 'class'];

  SvgLabel.layers = [];

  kartograph.Label = SvgLabel;

  Icon = (function() {

    __extends(Icon, Symbol);

    function Icon() {
      Icon.__super__.constructor.apply(this, arguments);
    }

    return Icon;

  })();

  Icon.props = ['icon'];

  Icon.layer = ['html'];

  MapMarker = (function() {

    function MapMarker(ll) {
      /*
      		lonlat - LonLat instance
      		content - html code that will be placed inside a <div class="marker"> which then will be positioned at the corresponding map position
      		offset - x and y offset for the marker
      */
      var me;
      me = this;
      if (ll.length === 2) ll = new kartograph.LonLat(ll[0], ll[1]);
      me.lonlat = ll;
      me.visible = true;
    }

    MapMarker.prototype.render = function(x, y, cont, paper) {
      /*
      		this function will be called by kartograph to render the marker
      */
    };

    return MapMarker;

  })();

  kartograph.marker.MapMarker = MapMarker;

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

  kartograph.marker.LabelMarker = LabelMarker;

  DotMarker = (function() {

    __extends(DotMarker, LabelMarker);

    function DotMarker(ll, label, rad, color) {
      if (color == null) color = null;
      DotMarker.__super__.constructor.call(this, ll, label);
      this.rad = rad;
      this.color = color;
    }

    DotMarker.prototype.render = function(x, y, cont, paper) {
      var me, node;
      me = this;
      me.path = paper.circle(x, y, this.rad);
      node = me.path.node;
      node.setAttribute('class', 'dotMarker');
      node.setAttribute('title', this.label);
      if (this.color != null) {
        return node.setAttribute('style', 'fill:' + this.color);
      }
    };

    DotMarker.prototype.clear = function() {
      return this.path.remove();
    };

    return DotMarker;

  })();

  kartograph.marker.DotMarker = DotMarker;

  IconMarker = (function() {

    __extends(IconMarker, MapMarker);

    /*
    */

    function IconMarker(ll, icon) {}

    return IconMarker;

  })();

  kartograph.marker.IconMarker = IconMarker;

  LabeledIconMarker = (function() {

    __extends(LabeledIconMarker, MapMarker);

    function LabeledIconMarker(params) {
      var me, _ref11, _ref12, _ref13;
      me = this;
      LabeledIconMarker.__super__.constructor.call(this, params.ll);
      me.icon_src = params.icon;
      me.label_txt = params.label;
      me.className = (_ref11 = params.className) != null ? _ref11 : 'marker';
      me.dx = (_ref12 = params.dx) != null ? _ref12 : 0;
      me.dy = (_ref13 = params.dy) != null ? _ref13 : 0;
    }

    LabeledIconMarker.prototype.render = function(x, y, cont, paper) {
      var me;
      me = this;
      if (!me.markerDiv) {
        me.icon = $('<img src="' + me.icon_src + '" class="icon"/>');
        me.label = $('<div class="label">' + me.label_txt + '</div>');
        me.markerDiv = $('<div class="' + me.className + '" />');
        me.markerDiv.append(me.icon);
        me.markerDiv.append(me.label);
        cont.append(me.markerDiv);
      }
      return me.markerDiv.css({
        position: 'absolute',
        left: (x + me.dx) + 'px',
        top: (y + me.dy) + 'px'
      });
    };

    return LabeledIconMarker;

  })();

  kartograph.marker.LabeledIconMarker = LabeledIconMarker;

  BubbleMarker = (function() {

    __extends(BubbleMarker, MapMarker);

    /*
    	will display a bubble centered on the marker position
    */

    function BubbleMarker(ll, size, cssClass) {
      if (cssClass == null) cssClass = 'bubble';
      BubbleMarker.__super__.constructor.call(this, ll);
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
    }

    return BubbleMarker;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref11 = root.kartograph) != null ? _ref11 : root.kartograph = {};

  if ((_ref12 = kartograph.geom) == null) kartograph.geom = {};

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

    Path.prototype.area = function() {
      var area, cnt, i, me, _i, _len, _ref13, _ref14;
      me = this;
      if (me.areas != null) return me._area;
      me.areas = [];
      me._area = 0;
      _ref13 = me.contours;
      for (_i = 0, _len = _ref13.length; _i < _len; _i++) {
        cnt = _ref13[_i];
        area = 0;
        for (i = 0, _ref14 = cnt.length - 2; 0 <= _ref14 ? i <= _ref14 : i >= _ref14; 0 <= _ref14 ? i++ : i--) {
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
      var a, area, cnt, cx, cy, i, j, k, me, x, y, _ref13, _ref14;
      me = this;
      if (me._centroid != null) return me._centroid;
      area = me.area();
      cx = cy = 0;
      for (i = 0, _ref13 = me.contours.length - 1; 0 <= _ref13 ? i <= _ref13 : i >= _ref13; 0 <= _ref13 ? i++ : i--) {
        cnt = me.contours[i];
        a = me.areas[i];
        x = y = 0;
        for (j = 0, _ref14 = cnt.length - 2; 0 <= _ref14 ? j <= _ref14 : j >= _ref14; 0 <= _ref14 ? j++ : j--) {
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
    var closed, contour, contour_str, contours, cx, cy, path_str, pt_str, r, res, sep, type, x, y, _i, _j, _len, _len2, _ref13, _ref14, _ref15;
    contours = [];
    type = path.nodeName;
    res = null;
    if (type === "path") {
      path_str = path.getAttribute('d').trim();
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
      var clip, i, last_in, lines, p0x, p0y, p1x, p1y, pts, self, x0, x1, y0, y1, _ref13, _ref14, _ref15, _ref16;
      self = this;
      clip = new kartograph.geom.clipping.CohenSutherland().clip;
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

  kartograph.geom.Line = Line;

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

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref13 = root.kartograph) != null ? _ref13 : root.kartograph = {};

  __proj = kartograph.proj = {};

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
      bbox = new kartograph.BBox();
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
    return new kartograph.proj[id](opts);
  };

  kartograph.Proj = Proj;

  Cylindrical = (function() {

    __extends(Cylindrical, Proj);

    /*
    	Base class for cylindrical projections
    */

    function Cylindrical(opts) {
      var me, _ref14;
      me = this;
      me.flip = Number(opts.flip) || 0;
      if (me.flip === 1) opts.lon0 = (_ref14 = -opts.lon0) != null ? _ref14 : 0;
      Cylindrical.__super__.constructor.call(this, opts);
    }

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

    Cylindrical.prototype.ll = function(lon, lat) {
      if (this.flip === 1) {
        return [-lon, -lat];
      } else {
        return [lon, lat];
      }
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
      var _ref14;
      _ref14 = this.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
      var lam, phi, x, y, _ref14;
      _ref14 = this.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
      var lam, math, phi, s, x, y, _ref14;
      s = this;
      _ref14 = s.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
      var lplam, lpphi, phi2, phi4, s, x, y, _ref14;
      s = this;
      _ref14 = s.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
      var i, lplam, lpphi, phi, s, x, y, _ref14;
      s = this;
      _ref14 = s.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
      var V, c, i, lplam, lpphi, me, p, s, x, y, _ref14;
      me = this;
      _ref14 = me.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
      var lam, me, phi, x, y, _ref14;
      me = this;
      _ref14 = me.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
        console.error('kartograph.proj.Mollweide: either p or cx,cy,cp must be defined');
      }
    }

    Mollweide.prototype.project = function(lon, lat) {
      var abs, i, k, lam, math, me, phi, v, x, y, _ref14;
      me = this;
      _ref14 = me.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
      var lam, math, me, phi, x, y, _ref14;
      me = this;
      _ref14 = me.ll(lon, lat), lon = _ref14[0], lat = _ref14[1];
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
      return new kartograph.BBox(0, 0, r * 2, r * 2);
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

    Satellite.prototype.project = function(lon, lat, alt) {
      var A, H, cos, cos_c, cos_tilt, cos_up, k, lam, math, phi, r, ra, sin, sin_tilt, sin_up, x, xo, xt, y, yo, yt;
      if (alt == null) alt = 0;
      phi = this.rad(lat);
      lam = this.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      r = this.r;
      ra = r * (alt + 6371) / 3671;
      cos_c = sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0);
      k = (this.dist - 1) / (this.dist - cos_c);
      k = (this.dist - 1) / (this.dist - cos_c);
      k *= this.scale;
      xo = ra * k * cos(phi) * sin(lam - this.lam0);
      yo = -ra * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      cos_up = cos(this.up);
      sin_up = sin(this.up);
      cos_tilt = cos(this.tilt);
      sin_tilt = sin(this.tilt);
      H = ra * (this.dist - 1);
      A = ((yo * cos_up + xo * sin_up) * sin(this.tilt / H)) + cos_tilt;
      xt = (xo * cos_up - yo * sin_up) * cos(this.tilt / A);
      yt = (yo * cos_up + xo * sin_up) / A;
      x = r + xt;
      y = r + yt;
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

    Satellite.prototype.sea = function() {
      var math, out, phi, r;
      out = [];
      r = this.r;
      math = Math;
      for (phi = 0; phi <= 360; phi++) {
        out.push([r + math.cos(this.rad(phi)) * r, r + math.sin(this.rad(phi)) * r]);
      }
      return out;
    };

    return Satellite;

  })();

  __proj['satellite'] = Satellite;

  EquidistantAzimuthal = (function() {

    __extends(EquidistantAzimuthal, Azimuthal);

    function EquidistantAzimuthal() {
      EquidistantAzimuthal.__super__.constructor.apply(this, arguments);
    }

    /*
    	Equidistant projection
    	
    	implementation taken from 
    	Snyder, Map projections - A working manual
    */

    EquidistantAzimuthal.prototype.project = function(lon, lat) {
      var c, cos, cos_c, k, lam, math, phi, sin, x, xo, y, yo;
      phi = this.rad(lat);
      lam = this.rad(lon);
      math = Math;
      sin = math.sin;
      cos = math.cos;
      cos_c = sin(this.phi0) * sin(phi) + cos(this.phi0) * cos(phi) * cos(lam - this.lam0);
      c = math.acos(cos_c);
      k = 0.325 * c / sin(c);
      xo = this.r * k * cos(phi) * sin(lam - this.lam0);
      yo = -this.r * k * (cos(this.phi0) * sin(phi) - sin(this.phi0) * cos(phi) * cos(lam - this.lam0));
      x = this.r + xo;
      y = this.r + yo;
      return [x, y];
    };

    EquidistantAzimuthal.prototype._visible = function(lon, lat) {
      return true;
    };

    return EquidistantAzimuthal;

  })();

  __proj['equi'] = EquidistantAzimuthal;

  Aitoff = (function() {

    __extends(Aitoff, EquidistantAzimuthal);

    function Aitoff() {
      Aitoff.__super__.constructor.apply(this, arguments);
    }

    /*
    	Aitoff projection
    	
    	implementation taken from 
    	Snyder, Map projections - A working manual
    */

    Aitoff.prototype.project = function(lon, lat) {
      return [x, y];
    };

    Aitoff.prototype._visible = function(lon, lat) {
      return true;
    };

    return Aitoff;

  })();

  __proj['aitoff'] = Aitoff;

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
      var abs, c, cos, cosphi, m, n, pow, secant, self, sin, sinphi, tan, _ref14;
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
      var abs, cos, lam, lam_, m, n, phi, pow, rho, self, sin, tan, x, y, _ref14;
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

  PseudoConic = (function() {

    __extends(PseudoConic, Conic);

    function PseudoConic() {
      PseudoConic.__super__.constructor.apply(this, arguments);
    }

    return PseudoConic;

  })();

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
      GNU General Public License for more detailme.
  
      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */

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
      var cont, contours, me, pcont, r, x, y, _i, _j, _len, _len2, _ref14, _ref15, _ref16, _ref17;
      me = this;
      if (path.type === "path") {
        contours = [];
        _ref14 = path.contours;
        for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
          pcont = _ref14[_i];
          cont = [];
          for (_j = 0, _len2 = pcont.length; _j < _len2; _j++) {
            _ref15 = pcont[_j], x = _ref15[0], y = _ref15[1];
            _ref16 = me.project(x, y), x = _ref16[0], y = _ref16[1];
            cont.push([x, y]);
          }
          contours.push(cont);
        }
        return new kartograph.geom.Path(path.type, contours, path.closed);
      } else if (path.type === "circle") {
        _ref17 = me.project(path.x, path.y), x = _ref17[0], y = _ref17[1];
        r = path.r * me.scale;
        return new kartograph.geom.Circle(x, y, r);
      }
    };

    View.prototype.asBBox = function() {
      var me;
      me = this;
      return new kartograph.BBox(0, 0, me.width, me.height);
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
    return new kartograph.View(bbox, w, h, pad);
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  if ((_ref14 = root.kartograph) == null) root.kartograph = {};

  root.kartograph.View = View;

}).call(this);
(function() {

  /**
      chroma.js - a neat JS lib for color conversions
      Copyright (C) 2011  Gregor Aisch
  
  	The JavaScript code in this page is free software: you can
      redistribute it and/or modify it under the terms of the GNU
      General Public License (GNU GPL) as published by the Free Software
      Foundation, either version 3 of the License, or (at your option)
      any later version.  The code is distributed WITHOUT ANY WARRANTY;
      without even the implied warranty of MERCHANTABILITY or FITNESS
      FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
  
      As additional permission under GNU GPL version 3 section 7, you
      may distribute non-source (e.g., minimized or compacted) forms of
      that code without the copy of the GNU GPL normally required by
      section 4, provided you include this license notice and a URL
      through which recipients can access the Corresponding Source.  
      
      @source: https://github.com/gka/chroma.js
  */

  var CSSColors, Categories, Color, ColorScale, Diverging, Ramp, chroma, root, type, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  chroma = (_ref = root.chroma) != null ? _ref : root.chroma = {};

  chroma.version = "0.2.5";

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
      var me, _ref2;
      me = this;
      if (!(x != null) && !(y != null) && !(z != null) && !(m != null)) {
        x = [255, 0, 255];
      }
      if (type(x) === "array" && x.length === 3) {
        if (m == null) m = y;
        _ref2 = x, x = _ref2[0], y = _ref2[1], z = _ref2[2];
      }
      if (type(x) === "string") {
        m = 'hex';
      } else {
        if (m == null) m = 'rgb';
      }
      if (m === 'rgb') {
        me.rgb = [x, y, z];
      } else if (m === 'hsl') {
        me.rgb = Color.hsl2rgb(x, y, z);
      } else if (m === 'hsv') {
        me.rgb = Color.hsv2rgb(x, y, z);
      } else if (m === 'hex') {
        me.rgb = Color.hex2rgb(x);
      } else if (m === 'lab') {
        me.rgb = Color.lab2rgb(x, y, z);
      } else if (m === 'csl') {
        me.rgb = Color.csl2rgb(x, y, z);
      } else if (m === 'hsi') {
        me.rgb = Color.hsi2rgb(x, y, z);
      }
    }

    Color.prototype.hex = function() {
      return Color.rgb2hex(this.rgb);
    };

    Color.prototype.toString = function() {
      return this.hex();
    };

    Color.prototype.hsl = function() {
      return Color.rgb2hsl(this.rgb);
    };

    Color.prototype.hsv = function() {
      return Color.rgb2hsv(this.rgb);
    };

    Color.prototype.lab = function() {
      return Color.rgb2lab(this.rgb);
    };

    Color.prototype.csl = function() {
      return Color.rgb2csl(this.rgb);
    };

    Color.prototype.hsi = function() {
      return Color.rgb2hsi(this.rgb);
    };

    Color.prototype.interpolate = function(f, col, m) {
      /*
      		interpolates between colors
      */
      var dh, hue, hue0, hue1, lbv, lbv0, lbv1, me, sat, sat0, sat1, xyz0, xyz1;
      me = this;
      if (m == null) m = 'rgb';
      if (type(col) === "string") col = new Color(col);
      if (m === 'hsl' || m === 'hsv' || m === 'csl' || m === 'hsi') {
        if (m === 'hsl') {
          xyz0 = me.hsl();
          xyz1 = col.hsl();
        } else if (m === 'hsv') {
          xyz0 = me.hsv();
          xyz1 = col.hsv();
        } else if (m === 'csl') {
          xyz0 = me.csl();
          xyz1 = col.csl();
        } else if (m === 'hsi') {
          xyz0 = me.hsi();
          xyz1 = col.hsi();
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
        return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
      } else if (m === 'lab') {
        xyz0 = me.lab();
        xyz1 = col.lab();
        return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
      } else {
        throw "color mode " + m + " is not supported";
      }
    };

    return Color;

  })();

  Color.hex2rgb = function(hex) {
    var b, g, r, u;
    if (!hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      if ((chroma.colors != null) && chroma.colors[hex]) {
        hex = chroma.colors[hex];
      } else {
        throw "unknown color format: " + hex;
      }
    }
    if (hex.length === 4 || hex.length === 7) hex = hex.substr(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    u = parseInt(hex, 16);
    r = u >> 16;
    g = u >> 8 & 0xFF;
    b = u & 0xFF;
    return [r, g, b];
  };

  Color.rgb2hex = function(r, g, b) {
    var str, u, _ref2;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    u = r << 16 | g << 8 | b;
    str = "000000" + u.toString(16).toUpperCase();
    return "#" + str.substr(str.length - 6);
  };

  Color.hsv2rgb = function(h, s, v) {
    var b, f, g, i, l, p, q, r, t, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    if (type(h) === "array" && h.length === 3) {
      _ref2 = h, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    }
    v *= 255;
    if (s === 0 && isNaN(h)) {
      r = g = b = v;
    } else {
      if (h === 360) h = 0;
      if (h > 360) h -= 360;
      if (h < 0) h += 360;
      h /= 60;
      i = Math.floor(h);
      f = h - i;
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - s * (1 - f));
      switch (i) {
        case 0:
          _ref3 = [v, t, p], r = _ref3[0], g = _ref3[1], b = _ref3[2];
          break;
        case 1:
          _ref4 = [q, v, p], r = _ref4[0], g = _ref4[1], b = _ref4[2];
          break;
        case 2:
          _ref5 = [p, v, t], r = _ref5[0], g = _ref5[1], b = _ref5[2];
          break;
        case 3:
          _ref6 = [p, q, v], r = _ref6[0], g = _ref6[1], b = _ref6[2];
          break;
        case 4:
          _ref7 = [t, p, v], r = _ref7[0], g = _ref7[1], b = _ref7[2];
          break;
        case 5:
          _ref8 = [v, p, q], r = _ref8[0], g = _ref8[1], b = _ref8[2];
      }
    }
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return [r, g, b];
  };

  Color.rgb2hsv = function(r, g, b) {
    var delta, h, max, min, s, v, _ref2;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;
    v = max / 255.0;
    s = delta / max;
    if (s === 0) {
      h = void 0;
      s = 0;
    } else {
      if (r === max) h = (g - b) / delta;
      if (g === max) h = 2 + (b - r) / delta;
      if (b === max) h = 4 + (r - g) / delta;
      h *= 60;
      if (h < 0) h += 360;
    }
    return [h, s, v];
  };

  Color.hsl2rgb = function(h, s, l) {
    var b, c, g, i, r, t1, t2, t3, _ref2, _ref3;
    if (h !== void 0 && h.length === 3) {
      _ref2 = h, h = _ref2[0], s = _ref2[1], l = _ref2[2];
    }
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
      _ref3 = [Math.round(c[0] * 255), Math.round(c[1] * 255), Math.round(c[2] * 255)], r = _ref3[0], g = _ref3[1], b = _ref3[2];
    }
    return [r, g, b];
  };

  Color.rgb2hsl = function(r, g, b) {
    var h, l, max, min, s, _ref2;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
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

  Color.lab2xyz = function(l, a, b) {
    /*
    	Convert from L*a*b* doubles to XYZ doubles
    	Formulas drawn from http://en.wikipedia.org/wiki/Lab_color_spaces
    */
    var finv, ill, sl, x, y, z, _ref2;
    if (type(l) === "array" && l.length === 3) {
      _ref2 = l, l = _ref2[0], a = _ref2[1], b = _ref2[2];
    }
    finv = function(t) {
      if (t > (6.0 / 29.0)) {
        return t * t * t;
      } else {
        return 3 * (6.0 / 29.0) * (6.0 / 29.0) * (t - 4.0 / 29.0);
      }
    };
    sl = (l + 0.16) / 1.16;
    ill = [0.96421, 1.00000, 0.82519];
    y = ill[1] * finv(sl);
    x = ill[0] * finv(sl + (a / 5.0));
    z = ill[2] * finv(sl - (b / 2.0));
    return [x, y, z];
  };

  Color.xyz2rgb = function(x, y, z) {
    /*
    	Convert from XYZ doubles to sRGB bytes
    	Formulas drawn from http://en.wikipedia.org/wiki/Srgb
    */
    var b, bl, clip, correct, g, gl, r, rl, _ref2, _ref3;
    if (type(x) === "array" && x.length === 3) {
      _ref2 = x, x = _ref2[0], y = _ref2[1], z = _ref2[2];
    }
    rl = 3.2406 * x - 1.5372 * y - 0.4986 * z;
    gl = -0.9689 * x + 1.8758 * y + 0.0415 * z;
    bl = 0.0557 * x - 0.2040 * y + 1.0570 * z;
    clip = Math.min(rl, gl, bl) < -0.001 || Math.max(rl, gl, bl) > 1.001;
    if (clip) {
      rl = rl < 0.0 ? 0.0 : rl > 1.0 ? 1.0 : rl;
      gl = gl < 0.0 ? 0.0 : gl > 1.0 ? 1.0 : gl;
      bl = bl < 0.0 ? 0.0 : bl > 1.0 ? 1.0 : bl;
    }
    if (clip) {
      _ref3 = [void 0, void 0, void 0], rl = _ref3[0], gl = _ref3[1], bl = _ref3[2];
    }
    correct = function(cl) {
      var a;
      a = 0.055;
      if (cl <= 0.0031308) {
        return 12.92 * cl;
      } else {
        return (1 + a) * Math.pow(cl, 1 / 2.4) - a;
      }
    };
    r = Math.round(255.0 * correct(rl));
    g = Math.round(255.0 * correct(gl));
    b = Math.round(255.0 * correct(bl));
    return [r, g, b];
  };

  Color.lab2rgb = function(l, a, b) {
    /*
    	Convert from LAB doubles to sRGB bytes 
    	(just composing the above transforms)
    */
    var x, y, z, _ref2, _ref3, _ref4;
    if (l !== void 0 && l.length === 3) {
      _ref2 = l, l = _ref2[0], a = _ref2[1], b = _ref2[2];
    }
    if (l !== void 0 && l.length === 3) {
      _ref3 = l, l = _ref3[0], a = _ref3[1], b = _ref3[2];
    }
    _ref4 = Color.lab2xyz(l, a, b), x = _ref4[0], y = _ref4[1], z = _ref4[2];
    return Color.xyz2rgb(x, y, z);
  };

  Color.csl2lab = function(c, s, l) {
    /*
    	Convert from a qualitative parameter c and a quantitative parameter l to a 24-bit pixel. These formulas were invented by David Dalrymple to obtain maximum contrast without going out of gamut if the parameters are in the range 0-1.
    	
    	A saturation multiplier was added by Gregor Aisch
    */
    var L, TAU, a, angle, b, r, _ref2;
    if (type(c) === "array" && c.length === 3) {
      _ref2 = c, c = _ref2[0], s = _ref2[1], l = _ref2[2];
    }
    c /= 360.0;
    TAU = 6.283185307179586476925287;
    L = l * 0.61 + 0.09;
    angle = TAU / 6.0 - c * TAU;
    r = (l * 0.311 + 0.125) * s;
    a = Math.sin(angle) * r;
    b = Math.cos(angle) * r;
    return [L, a, b];
  };

  Color.csl2rgb = function(c, s, l) {
    var L, a, b, _ref2;
    _ref2 = Color.csl2lab(c, s, l), L = _ref2[0], a = _ref2[1], b = _ref2[2];
    return Color.lab2rgb(L, a, b);
  };

  Color.rgb2xyz = function(r, g, b) {
    var bl, correct, gl, rl, x, y, z, _ref2;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    correct = function(c) {
      var a;
      a = 0.055;
      if (c <= 0.04045) {
        return c / 12.92;
      } else {
        return Math.pow((c + a) / (1 + a), 2.4);
      }
    };
    rl = correct(r / 255.0);
    gl = correct(g / 255.0);
    bl = correct(b / 255.0);
    x = 0.4124 * rl + 0.3576 * gl + 0.1805 * bl;
    y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
    z = 0.0193 * rl + 0.1192 * gl + 0.9505 * bl;
    return [x, y, z];
  };

  Color.xyz2lab = function(x, y, z) {
    var a, b, f, ill, l, _ref2;
    if (x !== void 0 && x.length === 3) {
      _ref2 = x, x = _ref2[0], y = _ref2[1], z = _ref2[2];
    }
    ill = [0.96421, 1.00000, 0.82519];
    f = function(t) {
      if (t > Math.pow(6.0 / 29.0, 3)) {
        return Math.pow(t, 1 / 3);
      } else {
        return (1 / 3) * (29 / 6) * (29 / 6) * t + 4.0 / 29.0;
      }
    };
    l = 1.16 * f(y / ill[1]) - 0.16;
    a = 5 * (f(x / ill[0]) - f(y / ill[1]));
    b = 2 * (f(y / ill[1]) - f(z / ill[2]));
    return [l, a, b];
  };

  Color.rgb2lab = function(r, g, b) {
    var x, y, z, _ref2, _ref3;
    if (r !== void 0 && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    _ref3 = Color.rgb2xyz(r, g, b), x = _ref3[0], y = _ref3[1], z = _ref3[2];
    return Color.xyz2lab(x, y, z);
  };

  Color.lab2csl = function(l, a, b) {
    /*
    	Convert from a qualitative parameter c and a quantitative parameter l to a 24-bit pixel. These formulas were invented by David Dalrymple to obtain maximum contrast without going out of gamut if the parameters are in the range 0-1.
    	
    	A saturation multiplier was added by Gregor Aisch
    */
    var L, TAU, angle, c, r, s, _ref2;
    if (type(l) === "array" && l.length === 3) {
      _ref2 = l, l = _ref2[0], a = _ref2[1], b = _ref2[2];
    }
    L = l;
    l = (l - 0.09) / 0.61;
    r = Math.sqrt(a * a + b * b);
    s = r / (l * 0.311 + 0.125);
    TAU = 6.283185307179586476925287;
    angle = Math.atan2(a, b);
    c = (TAU / 6 - angle) / TAU;
    c *= 360;
    if (c < 0) c += 360;
    return [c, s, l];
  };

  Color.rgb2csl = function(r, g, b) {
    var a, l, _ref2, _ref3;
    if (type(r) === "array" && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    _ref3 = Color.rgb2lab(r, g, b), l = _ref3[0], a = _ref3[1], b = _ref3[2];
    return Color.lab2csl(l, a, b);
  };

  Color.rgb2hsi = function(r, g, b) {
    /*
    	borrowed from here:
    	http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
    */
    var TWOPI, h, i, min, s, _ref2;
    if (type(r) === "array" && r.length === 3) {
      _ref2 = r, r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    TWOPI = Math.PI * 2;
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    i = (r + g + b) / 3;
    s = 1 - min / i;
    if (s === 0) {
      h = 0;
    } else {
      h = ((r - g) + (r - b)) / 2;
      h /= Math.sqrt((r - g) * (r - g) + (r - b) * (g - b));
      h = Math.acos(h);
      if (b > g) h = TWOPI - h;
      h /= TWOPI;
    }
    return [h * 360, s, i];
  };

  Color.hsi2rgb = function(h, s, i) {
    /*
    	borrowed from here:
    	http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
    */
    var PITHIRD, TWOPI, b, cos, g, r, _ref2;
    if (type(h) === "array" && h.length === 3) {
      _ref2 = h, h = _ref2[0], s = _ref2[1], i = _ref2[2];
    }
    TWOPI = Math.PI * 2;
    PITHIRD = Math.PI / 3;
    cos = Math.cos;
    if (h < 0) h += 360;
    if (h > 360) h -= 360;
    h /= 360;
    if (h < 1 / 3) {
      b = (1 - s) / 3;
      r = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      g = 1 - (b + r);
    } else if (h < 2 / 3) {
      h -= 1 / 3;
      r = (1 - s) / 3;
      g = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      b = 1 - (r + g);
    } else {
      h -= 2 / 3;
      g = (1 - s) / 3;
      b = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      r = 1 - (g + b);
    }
    r = i * r * 3;
    g = i * g * 3;
    b = i * b * 3;
    return [r * 255, g * 255, b * 255];
  };

  chroma.Color = Color;

  chroma.hsl = function(h, s, l) {
    return new Color(h, s, l, 'hsl');
  };

  chroma.hsv = function(h, s, v) {
    return new Color(h, s, v, 'hsv');
  };

  chroma.rgb = function(r, g, b) {
    return new Color(r, g, b, 'rgb');
  };

  chroma.hex = function(x) {
    return new Color(x);
  };

  chroma.lab = function(l, a, b) {
    return new Color(l, a, b, 'lab');
  };

  chroma.csl = function(c, s, l) {
    return new Color(c, s, l, 'csl');
  };

  chroma.hsi = function(h, s, i) {
    return new Color(h, s, i, 'hsi');
  };

  chroma.interpolate = function(a, b, f, m) {
    if (type(a) === 'string') a = new Color(a);
    if (type(b) === 'string') b = new Color(b);
    return a.interpolate(f, b, m);
  };

  ColorScale = (function() {

    /*
    	base class for color scales
    */

    function ColorScale(opts) {
      var c, col, cols, me, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      me = this;
      me.colors = cols = (_ref2 = opts.colors) != null ? _ref2 : ['#ddd', '#222'];
      for (c = 0, _ref3 = cols.length - 1; 0 <= _ref3 ? c <= _ref3 : c >= _ref3; 0 <= _ref3 ? c++ : c--) {
        col = cols[c];
        if (type(col) === "string") cols[c] = new Color(col);
      }
      if (opts.positions != null) {
        me.pos = opts.positions;
      } else {
        me.pos = [];
        for (c = 0, _ref4 = cols.length - 1; 0 <= _ref4 ? c <= _ref4 : c >= _ref4; 0 <= _ref4 ? c++ : c--) {
          me.pos.push(c / (cols.length - 1));
        }
      }
      me.mode = (_ref5 = opts.mode) != null ? _ref5 : 'hsv';
      me.nacol = (_ref6 = opts.nacol) != null ? _ref6 : '#ccc';
      me.setClasses((_ref7 = opts.limits) != null ? _ref7 : [0, 1]);
      me;
    }

    ColorScale.prototype.getColor = function(value) {
      var c, f, f0, me;
      me = this;
      if (isNaN(value)) return me.nacol;
      if (me.classLimits.length > 2) {
        c = me.getClass(value);
        f = c / (me.numClasses - 1);
      } else {
        f = f0 = (value - me.min) / (me.max - me.min);
        f = Math.min(1, Math.max(0, f));
      }
      return me.fColor(f);
    };

    ColorScale.prototype.fColor = function(f) {
      var col, cols, i, me, p, _ref2;
      me = this;
      cols = me.colors;
      for (i = 0, _ref2 = me.pos.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        p = me.pos[i];
        if (f <= p) {
          col = cols[i];
          break;
        }
        if (f >= p && i === me.pos.length - 1) {
          col = cols[i];
          break;
        }
        if (f > p && f < me.pos[i + 1]) {
          f = (f - p) / (me.pos[i + 1] - p);
          col = chroma.interpolate(cols[i], cols[i + 1], f, me.mode);
          break;
        }
      }
      return col;
    };

    ColorScale.prototype.classifyValue = function(value) {
      var i, limits, maxc, minc, n, self;
      self = this;
      limits = self.classLimits;
      if (limits.length > 2) {
        n = limits.length - 1;
        i = self.getClass(value);
        value = limits[i] + (limits[i + 1] - limits[i]) * 0.5;
        minc = limits[0];
        maxc = limits[n - 1];
        value = self.min + ((value - minc) / (maxc - minc)) * (self.max - self.min);
      }
      return value;
    };

    ColorScale.prototype.setClasses = function(limits) {
      var me;
      if (limits == null) limits = [];
      /*
      		# use this if you want to display a limited number of data classes
      		# possible methods are "equalinterval", "quantiles", "custom"
      */
      me = this;
      me.classLimits = limits;
      me.min = limits[0];
      me.max = limits[limits.length - 1];
      if (limits.length === 2) {
        return me.numClasses = 0;
      } else {
        return me.numClasses = limits.length - 1;
      }
    };

    ColorScale.prototype.getClass = function(value) {
      var i, limits, n, self;
      self = this;
      limits = self.classLimits;
      if (limits != null) {
        n = limits.length - 1;
        i = 0;
        while (i < n && value >= limits[i]) {
          i++;
        }
        return i - 1;
      }
    };

    ColorScale.prototype.validValue = function(value) {
      return !isNaN(value);
    };

    return ColorScale;

  })();

  chroma.ColorScale = ColorScale;

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

  chroma.Ramp = Ramp;

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

  chroma.Diverging = Diverging;

  Categories = (function() {

    __extends(Categories, ColorScale);

    function Categories(colors) {
      var me;
      me = this;
      me.colors = colors;
    }

    Categories.prototype.parseData = function(data, data_col) {};

    Categories.prototype.getColor = function(value) {
      var me;
      me = this;
      if (me.colors.hasOwnProperty(value)) {
        return me.colors[value];
      } else {
        return '#cccccc';
      }
    };

    Categories.prototype.validValue = function(value) {
      return this.colors.hasOwnProperty(value);
    };

    return Categories;

  })();

  chroma.Categories = Categories;

  CSSColors = (function() {

    __extends(CSSColors, ColorScale);

    function CSSColors(name) {
      var me;
      me = this;
      me.name = name;
      me.setClasses(7);
      me;
    }

    CSSColors.prototype.getColor = function(value) {
      var c, me;
      me = this;
      c = me.getClass(value);
      return me.name + ' l' + me.numClasses + ' c' + c;
    };

    return CSSColors;

  })();

  chroma.CSSColors = CSSColors;

  if ((_ref2 = chroma.scales) == null) chroma.scales = {};

  chroma.scales.cool = function() {
    return new Ramp(chroma.hsl(180, 1, .9), chroma.hsl(250, .7, .4));
  };

  chroma.scales.hot = function() {
    return new ColorScale({
      colors: ['#000000', '#ff0000', '#ffff00', '#ffffff'],
      positions: [0, .25, .75, 1],
      mode: 'rgb'
    });
  };

  chroma.scales.BlWhOr = function() {
    return new Diverging(chroma.hsl(30, 1, .55), '#ffffff', new Color(220, 1, .55));
  };

  chroma.scales.GrWhPu = function() {
    return new Diverging(chroma.hsl(120, .8, .4), '#ffffff', new Color(280, .8, .4));
  };

  chroma.limits = function(data, mode, num, prop) {
    var assignments, best, centroids, cluster, clusterSizes, dist, i, j, k, kClusters, limits, max, min, mindist, n, nb_iters, newCentroids, p, pb, pr, repeat, sum, tmpKMeansBreaks, val, value, values, _i, _j, _len, _len2, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    if (mode == null) mode = 'equal';
    if (num == null) num = 7;
    if (prop == null) prop = null;
    min = Number.MAX_VALUE;
    max = Number.MAX_VALUE * -1;
    sum = 0;
    values = [];
    if (type(data) === "array") {
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        val = data[_i];
        if (!isNaN(val)) values.push(val);
      }
    } else if (type(data) === "object") {
      for (k in data) {
        val = data[k];
        if (type(val) === "object" && type(prop) === "string") {
          if (!isNaN(val[prop])) values.push(val[prop]);
        } else if (type(val) === "number") {
          if (!isNaN(val)) values.push(val);
        }
      }
    }
    for (_j = 0, _len2 = values.length; _j < _len2; _j++) {
      val = values[_j];
      if (!!isNaN(val)) continue;
      if (val < min) min = val;
      if (val > max) max = val;
      sum += val;
    }
    values = values.sort();
    limits = [];
    if (mode.substr(0, 1) === 'c') {
      limits.push(min);
      limits.push(max);
    }
    if (mode.substr(0, 1) === 'e') {
      limits.push(min);
      for (i = 1, _ref3 = num - 1; 1 <= _ref3 ? i <= _ref3 : i >= _ref3; 1 <= _ref3 ? i++ : i--) {
        limits.push(min + (i / num) * (max - min));
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'q') {
      limits.push(min);
      for (i = 1, _ref4 = num - 1; 1 <= _ref4 ? i <= _ref4 : i >= _ref4; 1 <= _ref4 ? i++ : i--) {
        p = values.length * i / num;
        pb = Math.floor(p);
        if (pb === p) {
          limits.push(values[pb]);
        } else {
          pr = p - pb;
          limits.push(values[pb] * pr + values[pb + 1] * (1 - pr));
        }
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'k') {
      /*
      		implementation based on
      		http://code.google.com/p/figue/source/browse/trunk/figue.js#336
      		simplified for 1-d input values
      */
      n = values.length;
      assignments = new Array(n);
      clusterSizes = new Array(num);
      repeat = true;
      nb_iters = 0;
      centroids = null;
      centroids = [];
      centroids.push(min);
      for (i = 1, _ref5 = num - 1; 1 <= _ref5 ? i <= _ref5 : i >= _ref5; 1 <= _ref5 ? i++ : i--) {
        centroids.push(min + (i / num) * (max - min));
      }
      centroids.push(max);
      while (repeat) {
        for (j = 0, _ref6 = num - 1; 0 <= _ref6 ? j <= _ref6 : j >= _ref6; 0 <= _ref6 ? j++ : j--) {
          clusterSizes[j] = 0;
        }
        for (i = 0, _ref7 = n - 1; 0 <= _ref7 ? i <= _ref7 : i >= _ref7; 0 <= _ref7 ? i++ : i--) {
          value = values[i];
          mindist = Number.MAX_VALUE;
          for (j = 0, _ref8 = num - 1; 0 <= _ref8 ? j <= _ref8 : j >= _ref8; 0 <= _ref8 ? j++ : j--) {
            dist = Math.abs(centroids[j] - value);
            if (dist < mindist) {
              mindist = dist;
              best = j;
            }
          }
          clusterSizes[best]++;
          assignments[i] = best;
        }
        newCentroids = new Array(num);
        for (j = 0, _ref9 = num - 1; 0 <= _ref9 ? j <= _ref9 : j >= _ref9; 0 <= _ref9 ? j++ : j--) {
          newCentroids[j] = null;
        }
        for (i = 0, _ref10 = n - 1; 0 <= _ref10 ? i <= _ref10 : i >= _ref10; 0 <= _ref10 ? i++ : i--) {
          cluster = assignments[i];
          if (newCentroids[cluster] === null) {
            newCentroids[cluster] = values[i];
          } else {
            newCentroids[cluster] += values[i];
          }
        }
        for (j = 0, _ref11 = num - 1; 0 <= _ref11 ? j <= _ref11 : j >= _ref11; 0 <= _ref11 ? j++ : j--) {
          newCentroids[j] *= 1 / clusterSizes[j];
        }
        repeat = false;
        for (j = 0, _ref12 = num - 1; 0 <= _ref12 ? j <= _ref12 : j >= _ref12; 0 <= _ref12 ? j++ : j--) {
          if (newCentroids[j] !== centroids[i]) {
            repeat = true;
            break;
          }
        }
        centroids = newCentroids;
        nb_iters++;
        if (nb_iters > 200) repeat = false;
      }
      kClusters = {};
      for (j = 0, _ref13 = num - 1; 0 <= _ref13 ? j <= _ref13 : j >= _ref13; 0 <= _ref13 ? j++ : j--) {
        kClusters[j] = [];
      }
      for (i = 0, _ref14 = n - 1; 0 <= _ref14 ? i <= _ref14 : i >= _ref14; 0 <= _ref14 ? i++ : i--) {
        cluster = assignments[i];
        kClusters[cluster].push(values[i]);
      }
      tmpKMeansBreaks = [];
      for (j = 0, _ref15 = num - 1; 0 <= _ref15 ? j <= _ref15 : j >= _ref15; 0 <= _ref15 ? j++ : j--) {
        tmpKMeansBreaks.push(kClusters[j][0]);
        tmpKMeansBreaks.push(kClusters[j][kClusters[j].length - 1]);
      }
      tmpKMeansBreaks = tmpKMeansBreaks.sort(function(a, b) {
        return a - b;
      });
      limits.push(tmpKMeansBreaks[0]);
      for (i = 1, _ref16 = tmpKMeansBreaks.length - 1; i <= _ref16; i += 2) {
        if (!isNaN(tmpKMeansBreaks[i])) limits.push(tmpKMeansBreaks[i]);
      }
    }
    return limits;
  };

  /*
  utils.coffee
  */

  type = (function() {
    /*
    	for browser-safe type checking+
    	ported from jQuery's $.type
    */
    var classToType, name, _i, _len, _ref3;
    classToType = {};
    _ref3 = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      name = _ref3[_i];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    return function(obj) {
      var strType;
      strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object";
    };
  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.type = type;

  Array.max = function(array) {
    return Math.max.apply(Math, array);
  };

  Array.min = function(array) {
    return Math.min.apply(Math, array);
  };

}).call(this);
