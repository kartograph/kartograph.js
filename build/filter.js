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

  var BlurFilter, Filter, GlowFilter, filter, root, svgmap, _ref, _ref2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  svgmap = (_ref = root.svgmap) != null ? _ref : root.svgmap = {};

  filter = (_ref2 = svgmap.filter) != null ? _ref2 : svgmap.filter = {};

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
      var SVG, blur, color, comp, mat, me, merge, morph, rgb, size;
      me = this;
      SVG = me.SVG;
      size = me.params.size || 8;
      color = me.params.color || '#D1BEB0';
      if (typeof color === 'string') color = new svgmap.color.Color(color);
      rgb = color.rgb;
      mat = SVG('feColorMatrix', {
        "in": 'SourceGraphic',
        type: 'matrix',
        values: '0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 500 0',
        result: 'mask'
      });
      fltr.appendChild(mat);
      morph = SVG('feMorphology', {
        "in": 'mask',
        radius: size,
        operator: 'erode',
        result: 'r1'
      });
      fltr.appendChild(morph);
      blur = SVG('feGaussianBlur', {
        "in": 'r1',
        stdDeviation: size,
        result: 'r2'
      });
      fltr.appendChild(blur);
      mat = SVG('feColorMatrix', {
        type: 'matrix',
        "in": 'r2',
        values: '1 0 0 0 ' + (rgb[0] / 255) + ' 0 1 0 0 ' + (rgb[1] / 255) + ' 0 0 1 0 ' + (rgb[2] / 255) + ' 0 0 0 -1 1',
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
      merge.appendChild(SVG('feMergeNode', {
        'in': 'SourceGraphic'
      }));
      merge.appendChild(SVG('feMergeNode', {
        'in': 'comp'
      }));
      return fltr.appendChild(merge);
    };

    return GlowFilter;

  })();

  filter.glow = GlowFilter;

}).call(this);
