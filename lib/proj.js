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

  var Balthasart, Behrmann, CEA, Cylindrical, Equirectangular, GallPeters, HoboDyer, NaturalEarth, Proj, PseudoCylindrical, root, __proj;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  __proj = root.proj = {};

  Proj = (function() {

    function Proj(lon0, lat0) {
      this.lon0 = lon0 != null ? lon0 : 0;
      this.lat0 = lat0 != null ? lat0 : 0;
      this.HALFPI = Math.PI * .5;
      this.QUARTERPI = Math.PI * .25;
      this.RAD = Math.PI / 180;
      this.lam0 = this.rad(this.lon0);
      this.phi0 = this.rad(this.lat0);
    }

    Proj.prototype.rad = function(a) {
      return a * this.RAD;
    };

    Proj.projections = {};

    Proj.prototype.plot = function(polygon, truncate) {
      var ignore, lat, lon, points, vis, x, y, _i, _len, _ref, _ref2;
      if (truncate == null) truncate = true;
      points = [];
      ignore = true;
      for (_i = 0, _len = polygon.length; _i < _len; _i++) {
        _ref = polygon[_i], lon = _ref[0], lat = _ref[1];
        vis = this._visible(lon, lat);
        if (vis) ignore = false;
        _ref2 = this.project(lon, lat), x = _ref2[0], y = _ref2[1];
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

    return Proj;

  })();

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
      return [(lon + 180) * Math.cos(this.phi0) * 2.777, (lat * -1 + 90) * 2.7777];
    };

    return Equirectangular;

  })();

  __proj['lonlat'] = Equirectangular;

  CEA = (function() {

    __extends(CEA, Cylindrical);

    function CEA() {
      CEA.__super__.constructor.apply(this, arguments);
    }

    /*
    	Cylindrical Equal Area Projection
    */

    CEA.prototype.project = function(lon, lat) {
      var lam, phi, x, y;
      lam = this.rad(lon);
      phi = this.rad(lat * -1);
      x = (lam - this.lam0) * Math.cos(this.phi0);
      y = Math.sin(phi) / Math.cos(this.phi0);
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

    function HoboDyer(lon0, lat0) {
      HoboDyer.__super__.constructor.call(this, lon0, 37.7);
    }

    return HoboDyer;

  })();

  __proj['hobodyer'] = HoboDyer;

  Behrmann = (function() {

    __extends(Behrmann, CEA);

    /*
    	Behrmann Projection
    */

    function Behrmann(lon0, lat0) {
      Behrmann.__super__.constructor.call(this, lon0, 30);
    }

    return Behrmann;

  })();

  __proj['behrmann'] = Behrmann;

  Balthasart = (function() {

    __extends(Balthasart, CEA);

    /*
    	Balthasart Projection
    */

    function Balthasart(lon0, lat0) {
      Balthasart.__super__.constructor.call(this, lon0, 50);
    }

    return Balthasart;

  })();

  __proj['balthasart'] = Balthasart;

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

    function NaturalEarth() {
      NaturalEarth.__super__.constructor.apply(this, arguments);
    }

    /*
    	Natural Earth Projection
    	see here http://www.shadedrelief.com/NE_proj/
    */

    NaturalEarth.prototype.construct = function(lon0, lat0) {
      var s;
      NaturalEarth.__super__.construct.call(this, lon0, lat0);
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
    };

    NaturalEarth.prototype.project = function(lon, lat) {
      var lplam, lpphi, phi2, phi4, x, y;
      lplam = this.rad(lon);
      lpphi = this.rad(lat * -1);
      phi2 = lpphi * lpphi;
      phi4 = phi2 * phi2;
      x = lplam * (this.A0 + phi2 * (this.A1 + phi2 * (this.A2 + phi4 * phi2 * (this.A3 + phi2 * this.A4)))) * 1000;
      y = lpphi * (this.B0 + phi2 * (this.B1 + phi4 * (this.B2 + this.B3 * phi2 + this.B4 * phi4))) * 1000;
      return [x, y];
    };

    return NaturalEarth;

  })();

  __proj['naturalearth'] = NaturalEarth;

  /*
  */

}).call(this);
