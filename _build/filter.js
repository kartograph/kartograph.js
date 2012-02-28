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

  var BlurFilter, Filter, GlowFilter, filter, kartograph, root, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref = root.kartograph) != null ? _ref : root.kartograph = {};

  filter = (_ref2 = kartograph.filter) != null ? _ref2 : kartograph.filter = {};

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
      var alpha, blur, color, inner, knockout, me, rgb, strength, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      me = this;
      blur = (_ref3 = me.params.blur) != null ? _ref3 : 4;
      strength = (_ref4 = me.params.strength) != null ? _ref4 : 1;
      color = (_ref5 = me.params.color) != null ? _ref5 : '#D1BEB0';
      if (typeof color === 'string') color = chroma.hex(color);
      rgb = color.rgb;
      inner = (_ref6 = me.params.inner) != null ? _ref6 : false;
      knockout = (_ref7 = me.params.knockout) != null ? _ref7 : false;
      alpha = (_ref8 = me.params.alpha) != null ? _ref8 : 1;
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

}).call(this);
