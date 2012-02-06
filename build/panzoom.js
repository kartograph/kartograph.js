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

  var PanAndZoomControl;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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

}).call(this);
