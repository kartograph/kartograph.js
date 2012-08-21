###
    kartograph - a svg mapping library
    Copyright (C) 2011  Gregor Aisch

    This library is free software; you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public
    License as published by the Free Software Foundation; either
    version 2.1 of the License, or (at your option) any later version.

    This library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
    Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with this library. If not, see <http://www.gnu.org/licenses/>.
###


__proj = kartograph.proj = {}

Function::bind = (scope) ->
    _function = @
    ->
        _function.apply scope,arguments


class Proj

    @parameters = []
    @title = "Projection"

    constructor: (opts) ->
        me = @
        me.lon0 = opts.lon0 ? 0
        me.lat0 = opts.lat0 ? 0
        me.PI = Math.PI
        me.HALFPI = me.PI * .5
        me.QUARTERPI = me.PI * .25
        me.RAD = me.PI / 180
        me.DEG = 180 / me.PI
        me.lam0 = me.rad(@lon0)
        me.phi0 = me.rad(@lat0)
        me.minLat = -90
        me.maxLat = 90

    rad: (a) ->
        a * @RAD

    deg: (a) ->
        a * @DEG

    plot: (polygon, truncate=true) ->
        points = []
        ignore = true
        for [lon,lat] in polygon
            vis = @_visible lon,lat
            if vis
                ignore = false
            [x,y] = @project lon,lat
            if not vis and truncate
                points.push @_truncate x,y
            else
                points.push [x,y]
        if ignore then null else [points]

    sea: ->
        s = @
        p = s.project.bind @
        o = []
        l0 = s.lon0
        s.lon0 = 0
        o.push(p(lon, s.maxLat)) for lon in [-180..180]
        o.push(p(180,lat)) for lat in [s.maxLat..s.minLat]
        o.push(p(lon, s.minLat)) for lon in [180..-180]
        o.push(p(-180,lat)) for lat in [s.minLat..s.maxLat]
        s.lon0 = l0
        o

    world_bbox: ->
        p = @project.bind @
        sea = @sea()
        bbox = new kartograph.BBox()
        for s in sea
            bbox.update(s[0],s[1])
        bbox

    toString: ->
        me = @
        '[Proj: '+me.name+']'


Proj.fromXML = (xml) ->
    ###
    reconstructs a projection from xml description
    ###
    id = xml.getAttribute('id')
    opts = {}
    for i in [0..xml.attributes.length-1]
        attr = xml.attributes[i]
        if attr.name != "id"
            opts[attr.name] = attr.value
    proj = new kartograph.proj[id](opts)
    proj.name = id
    proj

kartograph.Proj = Proj

# ---------------------------------
# Family of Cylindrical Projecitons
# ---------------------------------

class Cylindrical extends Proj
    ###
    Base class for cylindrical projections
    ###
    @parameters = ['lon0', 'flip']
    @title = "Cylindrical Projection"

    constructor: (opts = {}) ->
        me = @
        me.flip = Number(opts.flip ? 0)
        if me.flip == 1
            opts.lon0 = -opts.lon0 ? 0

        super opts

    _visible: (lon, lat) ->
        true

    clon: (lon) ->
        lon -= @lon0
        if lon < -180
            lon += 360
        else if lon > 180
            lon -= 360
        lon

    ll: (lon, lat) ->
        if @flip == 1
            return [-lon,-lat]
        else
            return [lon, lat]


class Equirectangular extends Cylindrical
    ###
    Equirectangular Projection aka Lonlat aka Plate Carree
    ###
    @title = "Equirectangular Projection"
    project: (lon, lat) ->
        [lon, lat] = @ll(lon,lat)
        lon = @clon(lon)
        [(lon) * Math.cos(@phi0) * 1000, lat*-1*1000]

__proj['lonlat'] = Equirectangular


class CEA extends Cylindrical

    @parameters = ['lon0', 'lat1', 'flip']
    @title = "Cylindrical Equal Area"

    constructor: (opts) ->
        super opts
        @lat1 = opts.lat1 ? 0
        @phi1 = @rad(@lat1)

    ###
    Cylindrical Equal Area Projection
    ###
    project: (lon, lat) ->
        [lon, lat] = @ll(lon,lat)
        lam = @rad(@clon(lon))
        phi = @rad(lat*-1)
        x = (lam) * Math.cos(@phi1)
        y = Math.sin(phi) / Math.cos(@phi1)
        [x*1000,y*1000]

__proj['cea'] = CEA


class GallPeters extends CEA
    ###
    Gall-Peters Projection
    ###
    @title = "Gall-Peters Projection"
    @parameters = ['lon0', 'flip']
    constructor: (opts) ->
        opts.lat1 = 45
        super opts

__proj['gallpeters'] = GallPeters


class HoboDyer extends CEA
    ###
    Hobo-Dyer Projection
    ###
    @title = "Hobo-Dyer Projection"
    @parameters = ['lon0', 'flip']
    constructor: (opts) ->
        opts.lat1 = 37.7
        super opts

__proj['hobodyer'] = HoboDyer


class Behrmann extends CEA
    ###
    Behrmann Projection
    ###
    @title = "Behrmann Projection"
    @parameters = ['lon0', 'flip']
    constructor: (opts) ->
        opts.lat1 = 30
        super opts

__proj['behrmann'] = Behrmann


class Balthasart extends CEA
    ###
    Balthasart Projection
    ###
    @title = "Balthasart Projection"
    @parameters = ['lon0', 'flip']
    constructor: (opts) ->
        opts.lat1 = 50
        super opts

__proj['balthasart'] = Balthasart


class Mercator extends Cylindrical
    ###
    # you're not really into maps..
    ###
    @title = "Mercator Projection"
    constructor: (opts) ->
        super opts
        @minLat = -85
        @maxLat = 85

    project: (lon, lat) ->
        s = @
        [lon, lat] = s.ll(lon,lat)
        math = Math
        lam = s.rad(s.clon(lon))
        phi = s.rad(lat*-1)
        x = lam * 1000
        y = math.log((1+math.sin(phi)) / math.cos(phi)) * 1000
        [x,y]

__proj['mercator'] = Mercator



# ----------------------------------------
# Family of Pseudo-Cylindrical Projecitons
# ----------------------------------------

class PseudoCylindrical extends Cylindrical
    ###
    Base class for pseudo cylindrical projections
    ###
    @title = "Pseudo-Cylindrical Projection"


class NaturalEarth extends PseudoCylindrical
    ###
    Natural Earth Projection
    see here http://www.shadedrelief.com/NE_proj/
    ###
    @title = "Natural Earth Projection"

    constructor: (opts) ->
        super opts
        s = @
        s.A0 = 0.8707
        s.A1 = -0.131979
        s.A2 = -0.013791
        s.A3 = 0.003971
        s.A4 = -0.001529
        s.B0 = 1.007226
        s.B1 = 0.015085
        s.B2 = -0.044475
        s.B3 = 0.028874
        s.B4 = -0.005916
        s.C0 = s.B0
        s.C1 = 3 * s.B1
        s.C2 = 7 * s.B2
        s.C3 = 9 * s.B3
        s.C4 = 11 * s.B4
        s.EPS = 1e-11
        s.MAX_Y = 0.8707 * 0.52 * Math.PI
        return

    project: (lon, lat) ->
        s = @
        [lon, lat] = s.ll(lon,lat)
        lplam = s.rad(s.clon(lon))
        lpphi = s.rad(lat*-1)
        phi2 = lpphi * lpphi
        phi4 = phi2 * phi2
        # console.log phi2,phi4,@A0,@A1,@A2,@A3,@A4
        x = lplam * (s.A0 + phi2 * (s.A1 + phi2 * (s.A2 + phi4 * phi2 * (s.A3 + phi2 * s.A4)))) * 180 + 500
        y = lpphi * (s.B0 + phi2 * (s.B1 + phi4 * (s.B2 + s.B3 * phi2 + s.B4 * phi4))) * 180 + 270
        [x,y]

__proj['naturalearth'] = NaturalEarth


class Robinson extends PseudoCylindrical
    ###
    Robinson Projection
    ###
    @title = "Robinson Projection"

    constructor: (opts) ->
        super opts
        s = @

        s.X = [1, -5.67239e-12, -7.15511e-05, 3.11028e-06,  0.9986, -0.000482241, -2.4897e-05, -1.33094e-06, 0.9954, -0.000831031, -4.4861e-05, -9.86588e-07, 0.99, -0.00135363, -5.96598e-05, 3.67749e-06, 0.9822, -0.00167442, -4.4975e-06, -5.72394e-06, 0.973, -0.00214869, -9.03565e-05, 1.88767e-08, 0.96, -0.00305084, -9.00732e-05, 1.64869e-06, 0.9427, -0.00382792, -6.53428e-05, -2.61493e-06, 0.9216, -0.00467747, -0.000104566, 4.8122e-06, 0.8962, -0.00536222, -3.23834e-05, -5.43445e-06, 0.8679, -0.00609364, -0.0001139, 3.32521e-06, 0.835, -0.00698325, -6.40219e-05, 9.34582e-07, 0.7986, -0.00755337, -5.00038e-05, 9.35532e-07, 0.7597, -0.00798325, -3.59716e-05, -2.27604e-06, 0.7186, -0.00851366, -7.0112e-05, -8.63072e-06, 0.6732, -0.00986209, -0.000199572, 1.91978e-05, 0.6213, -0.010418, 8.83948e-05, 6.24031e-06, 0.5722, -0.00906601, 0.000181999, 6.24033e-06, 0.5322,  0,  0,  0]
        s.Y = [0, 0.0124, 3.72529e-10, 1.15484e-09, 0.062, 0.0124001, 1.76951e-08, -5.92321e-09, 0.124, 0.0123998, -7.09668e-08, 2.25753e-08, 0.186, 0.0124008, 2.66917e-07, -8.44523e-08, 0.248, 0.0123971, -9.99682e-07, 3.15569e-07, 0.31, 0.0124108, 3.73349e-06, -1.1779e-06, 0.372, 0.0123598, -1.3935e-05, 4.39588e-06, 0.434, 0.0125501, 5.20034e-05, -1.00051e-05, 0.4968, 0.0123198, -9.80735e-05, 9.22397e-06, 0.5571, 0.0120308, 4.02857e-05, -5.2901e-06, 0.6176, 0.0120369, -3.90662e-05, 7.36117e-07, 0.6769, 0.0117015, -2.80246e-05, -8.54283e-07, 0.7346, 0.0113572, -4.08389e-05, -5.18524e-07, 0.7903, 0.0109099, -4.86169e-05, -1.0718e-06, 0.8435, 0.0103433, -6.46934e-05, 5.36384e-09, 0.8936, 0.00969679, -6.46129e-05, -8.54894e-06, 0.9394, 0.00840949, -0.000192847, -4.21023e-06, 0.9761, 0.00616525, -0.000256001, -4.21021e-06, 1,  0,  0,  0]
        s.NODES = 18
        s.FXC = 0.8487
        s.FYC = 1.3523
        s.C1 = 11.45915590261646417544
        s.RC1 = 0.08726646259971647884
        s.ONEEPS = 1.000001
        s.EPS = 1e-8
        return

    _poly: (arr, offs, z) ->
        arr[offs]+z * (arr[offs+1]+z * (arr[offs+2]+z * (arr[offs+3])))

    project: (lon, lat) ->
        s = @
        [lon, lat] = s.ll(lon,lat)
        lon = s.clon(lon)

        lplam = s.rad lon
        lpphi = s.rad lat*-1
        phi = Math.abs lpphi
        i = Math.floor phi * s.C1
        if i >= s.NODES
            i = s.NODES - 1
        phi = s.deg phi - s.RC1 * i
        i *= 4
        x = s._poly(s.X, i, phi) * s.FXC * lplam;
        y = s._poly(s.Y, i, phi) * s.FYC;
        if lpphi < 0.0
            y = -y
        [x ,y]

__proj['robinson'] = Robinson


class EckertIV extends PseudoCylindrical
    ###
    Eckert IV Projection
    ###
    @title = "Eckert IV Projection"

    constructor: (opts) ->
        super opts
        me = @
        me.C_x = .42223820031577120149
        me.C_y = 1.32650042817700232218
        me.RC_y = .75386330736002178205
        me.C_p = 3.57079632679489661922
        me.RC_p = .28004957675577868795
        me.EPS = 1e-7
        me.NITER = 6

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)
        lplam = me.rad(me.clon(lon))
        lpphi = me.rad(lat*-1)

        p = me.C_p * Math.sin(lpphi)
        V = lpphi * lpphi
        lpphi *= 0.895168 + V * ( 0.0218849 + V * 0.00826809 )

        i = me.NITER
        while i>0
            c = Math.cos(lpphi)
            s = Math.sin(lpphi)
            V = (lpphi + s * (c + 2) - p) / (1 + c * (c + 2) - s * s)
            lpphi -= V
            if Math.abs(V) < me.EPS
                break
            i -= 1

        if i == 0
            x = me.C_x * lplam
            y = if lpphi < 0 then -me.C_y else me.C_y
        else
            x = me.C_x * lplam * (1 + Math.cos(lpphi))
            y = me.C_y * Math.sin(lpphi);
        [x,y]

__proj['eckert4'] = EckertIV


class Sinusoidal extends PseudoCylindrical
    ###
    Sinusoidal Projection
    ###
    @title = "Sinusoidal Projection"

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)
        lam = me.rad(me.clon(lon))
        phi = me.rad(lat*-1)
        x = 1032 * lam * Math.cos(phi)
        y = 1032 * phi
        [x,y]

__proj['sinusoidal'] = Sinusoidal


class Mollweide extends PseudoCylindrical
    ###
    Mollweide Projection
    ###
    @title = "Mollweide Projection"

    constructor: (opts, p=1.5707963267948966, cx=null, cy=null, cp=null) ->
        super opts
        me = @
        me.MAX_ITER = 10
        me.TOLERANCE = 1e-7

        if p?
            p2 = p + p
            sp = Math.sin(p)
            r = Math.sqrt(Math.PI*2.0 * sp / (p2 + Math.sin(p2)))
            me.cx = 2 * r / Math.PI
            me.cy = r / sp
            me.cp = p2 + Math.sin(p2)
        else if cx? and cy? and cz?
            me.cx = cx
            me.cy = cy
            me.cp = cp
        else
            warn('kartograph.proj.Mollweide: either p or cx,cy,cp must be defined')

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)
        math = Math
        abs = math.abs
        lam = me.rad(me.clon(lon))
        phi = me.rad(lat)

        k = me.cp * math.sin(phi)
        i = me.MAX_ITER
        while i != 0
            v = (phi + math.sin(phi) - k) / (1 + math.cos(phi))
            phi -= v
            if abs(v) < me.TOLERANCE
                break
            i -= 1

        if i == 0
            phi = if phi>=0 then me.HALFPI else -me.HALFPI
        else
            phi *= 0.5

        x = 1000 * me.cx * lam * math.cos(phi)
        y = 1000 * me.cy * math.sin(phi)
        [x,y*-1]

__proj['mollweide'] = Mollweide


class WagnerIV extends Mollweide
    ###
    Wagner IV Projection
    ###
    @title = "Wagner IV Projection"

    constructor: (opts) ->
        # p=math.pi/3
        super opts, 1.0471975511965976

__proj['wagner4'] = WagnerIV


class WagnerV extends Mollweide
    ###
    Wagner V Projection
    ###
    @title = "Wagner V Projection"

    constructor: (opts) ->
        # p=math.pi/3
        super opts,null,0.90977,1.65014,3.00896

__proj['wagner5'] = WagnerV


class Loximuthal extends PseudoCylindrical

    minLat = -89
    maxLat = 89

    @parameters = ['lon0', 'lat0', 'flip']
    @title = "Loximuthal Projection (equidistant)"

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)
        math = Math
        lam = me.rad(me.clon(lon))
        phi = me.rad(lat)

        if phi == me.phi0
            x = lam * math.cos(me.phi0)
        else
            x = lam * (phi - me.phi0) / (math.log(math.tan(me.QUARTERPI + phi*0.5)) - math.log(math.tan(me.QUARTERPI + me.phi0*0.5)))
        x *= 1000
        y = 1000 * (phi - me.phi0)
        [x,y*-1]

__proj['loximuthal'] = Loximuthal


class CantersModifiedSinusoidalI extends PseudoCylindrical
    ###
    Canters, F. (2002) Small-scale Map projection Design. p. 218-219.
    Modified Sinusoidal, equal-area.

    implementation borrowed from
    http://cartography.oregonstate.edu/temp/AdaptiveProjection/src/projections/Canters1.js
    ###

    @title = "Canters Modified Sinusoidal I"
    @parameters = ['lon0']

    C1 = 1.1966
    C3 = -0.1290
    C3x3 = 3 * C3
    C5 = -0.0076
    C5x5 = 5 * C5

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)

        lon = me.rad(me.clon(lon))
        lat = me.rad(lat)

        y2 = lat * lat
        y4 = y2 * y2
        x = 1000 * lon * Math.cos(lat) / (C1 + C3x3 * y2 + C5x5 * y4)
        y = 1000 * lat * (C1 + C3 * y2 + C5 * y4)
        [x,y*-1]

__proj['canters1'] = CantersModifiedSinusoidalI


class Hatano extends PseudoCylindrical

    @title = "Hatano Projection"

    NITER = 20
    EPS = 1e-7
    ONETOL = 1.000001
    CN = 2.67595
    CS = 2.43763
    RCN = 0.37369906014686373063
    RCS = 0.41023453108141924738
    FYCN = 1.75859
    FYCS = 1.93052
    RYCN = 0.56863737426006061674
    RYCS = 0.51799515156538134803
    FXC = 0.85
    RXC = 1.17647058823529411764

    constructor: (opts) ->
        super opts

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)
        lam = me.rad(me.clon(lon))
        phi = me.rad(lat)
        c = Math.sin(phi) * (if phi < 0.0 then CS else CN)
        for i in [NITER..1] by -1
            th1 = (phi + Math.sin(phi) - c) / (1.0 + Math.cos(phi))
            phi -= th1
            if Math.abs(th1) < EPS
                break
        x = 1000 * FXC * lam * Math.cos(phi *= 0.5)
        y = 1000 * Math.sin(phi) * (if phi < 0.0 then FYCS else FYCN)
        return [x, y*-1]

__proj['hatano'] = Hatano


class GoodeHomolosine extends PseudoCylindrical

    @title = "Goode Homolosine Projection"
    @parameters = ['lon0']

    constructor: (opts) ->
        super opts
        me = @
        me.lat1 = 41.737
        me.p1 = new Mollweide()
        me.p0 = new Sinusoidal()

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)
        lon = me.clon(lon)
        if Math.abs(lat) > me.lat1
            return me.p1.project(lon, lat)
        else
            return me.p0.project(lon, lat)

__proj['goodehomolosine'] = GoodeHomolosine


class Nicolosi extends PseudoCylindrical

    @title = "Nicolosi Globular Projection"
    @parameters = ['lon0']

    EPS = 1e-10

    constructor: (opts) ->
        super opts
        @r = @HALFPI*100

    _visible: (lon, lat) ->
        me = @
        lon = me.clon(lon)
        lon > -90 and lon < 90

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)
        lam = me.rad(me.clon(lon))
        phi = me.rad(lat)
        if Math.abs(lam) < EPS
            x = 0
            y = phi
        else if Math.abs(phi) < EPS
            x = lam
            y = 0
        else if Math.abs(Math.abs(lam) - me.HALFPI) < EPS
            x = lam * Math.cos(phi)
            y = me.HALFPI * Math.sin(phi)
        else if Math.abs(Math.abs(phi) - me.HALFPI) < EPS
            x = 0
            y = phi
        else
            tb = me.HALFPI / lam - lam / me.HALFPI
            c = phi / me.HALFPI
            sp = Math.sin(phi)
            d = (1 - c * c) / (sp - c)
            r2 = tb / d
            r2 *= r2
            m = (tb * sp / d - 0.5 * tb)/(1.0 + r2)
            n = (sp / r2 + 0.5 * d)/(1.0 + 1.0/r2)
            x = Math.cos(phi)
            x = Math.sqrt(m * m + x * x / (1.0 + r2))
            x = me.HALFPI * (m + if lam < 0 then -x else x)
            y = Math.sqrt(n * n - (sp * sp / r2 + d * sp - 1.0) / (1.0 + 1.0/r2))
            y = me.HALFPI * (n + if phi < 0 then y else -y)
        return [x*100,y*-100]

    sea: ->
        out = []
        r = @r
        math = Math
        for phi in [0..360]
            out.push([math.cos(@rad(phi)) * r, math.sin(@rad(phi)) * r])
        out

    world_bbox: ->
        r = @r
        new kartograph.BBox(-r,-r,r*2, r*2)

__proj['nicolosi'] = Nicolosi

# -------------------------------
# Family of Azimuthal Projecitons
# -------------------------------


class Azimuthal extends Proj
    ###
    Base class for azimuthal projections
    ###
    @parameters = ['lon0', 'lat0']
    @title = "Azimuthal Projection"

    constructor: (opts, rad=1000) ->
        super opts
        me = @
        me.r = rad
        me.elevation0 = me.to_elevation(me.lat0)
        me.azimuth0 = me.to_azimuth(me.lon0)

    to_elevation: (lat) ->
        me = @
        ((lat + 90) / 180) * me.PI - me.HALFPI

    to_azimuth: (lon) ->
        me = @
        ((lon + 180) / 360) * me.PI *2 - me.PI

    _visible: (lon, lat) ->
        me = @
        math = Math
        elevation = me.to_elevation(lat)
        azimuth = me.to_azimuth(lon)
        # work out if the point is visible
        cosc = math.sin(elevation)*math.sin(me.elevation0)+math.cos(me.elevation0)*math.cos(elevation)*math.cos(azimuth-me.azimuth0)
        cosc >= 0.0

    _truncate: (x, y) ->
        math = Math
        r = @r
        theta = math.atan2(y-r,x-r)
        x1 = r + r * math.cos(theta)
        y1 = r + r * math.sin(theta)
        [x1,y1]

    sea: ->
        out = []
        r = @r
        math = Math
        for phi in [0..360]
            out.push([r + math.cos(@rad(phi)) * r, r + math.sin(@rad(phi)) * r])
        out

    world_bbox: ->
        r = @r
        new kartograph.BBox(0,0,r*2, r*2)


class Orthographic extends Azimuthal
    ###
    Orthographic Azimuthal Projection

    implementation taken from http://www.mccarroll.net/snippets/svgworld/
    ###
    @title = "Orthographic Projection"

    project: (lon, lat) ->
        me = @
        math = Math
        elevation = me.to_elevation(lat)
        azimuth = me.to_azimuth(lon)
        xo = me.r*math.cos(elevation)*math.sin(azimuth-me.azimuth0)
        yo = -me.r*(math.cos(me.elevation0)*math.sin(elevation)-math.sin(me.elevation0)*math.cos(elevation)*math.cos(azimuth-me.azimuth0))
        x = me.r + xo
        y = me.r + yo
        [x,y]

__proj['ortho'] = Orthographic



class LAEA extends Azimuthal
    ###
    Lambert Azimuthal Equal-Area Projection

    implementation taken from
    Snyder, Map projections - A working manual
    ###
    @title = "Lambert Azimuthal Equal-Area Projection"

    constructor: (opts) ->
        super opts
        @scale = Math.sqrt(2)*0.5


    project: (lon, lat) ->
        phi = @rad(lat)
        lam = @rad(lon)
        math = Math
        sin = math.sin
        cos = math.cos

        if false and math.abs(lon - @lon0) == 180
            xo = @r*2
            yo = 0
        else
            k = math.pow(2 / (1 + sin(@phi0) * sin(phi) + cos(@phi0)*cos(phi)*cos(lam - @lam0)), .5)
            k *= @scale#.70738033

            xo = @r * k * cos(phi) * sin(lam - @lam0)
            yo = -@r * k * ( cos(@phi0)*sin(phi) - sin(@phi0)*cos(phi)*cos(lam - @lam0) )

        x = @r + xo
        y = @r + yo
        [x,y]

__proj['laea'] = LAEA


class Stereographic extends Azimuthal
    ###
    Stereographic projection

    implementation taken from
    Snyder, Map projections - A working manual
    ###
    @title = "Stereographic Projection"

    project: (lon, lat) ->
        phi = @rad(lat)
        lam = @rad(lon)
        math = Math
        sin = math.sin
        cos = math.cos

        k0 = 0.5
        k = 2*k0 / (1 + sin(@phi0) * sin(phi) + cos(@phi0)*cos(phi)*cos(lam - @lam0))

        xo = @r * k * cos(phi) * sin(lam - @lam0)
        yo = -@r * k * ( cos(@phi0)*sin(phi) - sin(@phi0)*cos(phi)*cos(lam - @lam0) )

        x = @r + xo
        y = @r + yo
        [x,y]

__proj['stereo'] = Stereographic



class Satellite extends Azimuthal
    ###
    General perspective projection, aka Satellite projection

    implementation taken from
    Snyder, Map projections - A working manual

    up .. angle the camera is turned away from north (clockwise)
    tilt .. angle the camera is tilted
    ###
    @parameters = ['lon0', 'lat0', 'tilt', 'dist', 'up']
    @title = "Satellite Projection"

    constructor: (opts) ->
        super { lon0: 0, lat0: 0 }
        @dist = opts.dist ? 3
        @up = @rad(opts.up ? 0)
        @tilt = @rad(opts.tilt ? 0)

        @scale = 1
        xmin = Number.MAX_VALUE
        xmax = Number.MAX_VALUE*-1
        for lat in [0..179]
            for lon in [0..360]
                xy = @project(lon-180,lat-90)
                xmin = Math.min(xy[0], xmin)
                xmax = Math.max(xy[0], xmax)
        @scale = (@r*2)/(xmax-xmin)
        super opts
        return


    project: (lon, lat, alt = 0) ->

        phi = @rad(lat)
        lam = @rad(lon)
        math = Math
        sin = math.sin
        cos = math.cos
        r = @r
        ra = r * (alt+6371)/3671

        cos_c = sin(@phi0) * sin(phi) + cos(@phi0) * cos(phi) * cos(lam - @lam0)
        k = (@dist - 1) / (@dist - cos_c)
        k = (@dist - 1) / (@dist - cos_c)

        k *= @scale

        xo = ra * k * cos(phi) * sin(lam - @lam0)
        yo = -ra * k * ( cos(@phi0)*sin(phi) - sin(@phi0)*cos(phi)*cos(lam - @lam0) )

        # tilt
        cos_up = cos(@up)
        sin_up = sin(@up)
        cos_tilt = cos(@tilt)
        sin_tilt = sin(@tilt)

        H = ra * (@dist - 1)
        A = ((yo * cos_up + xo * sin_up) * sin(@tilt/H)) + cos_tilt
        xt = (xo * cos_up - yo * sin_up) * cos(@tilt/A)
        yt = (yo * cos_up + xo * sin_up) / A

        x = r + xt
        y = r + yt

        [x,y]

    _visible: (lon, lat) ->
        elevation = @to_elevation(lat)
        azimuth = @to_azimuth(lon)
        math = Math
        # work out if the point is visible
        cosc = math.sin(elevation)*math.sin(@elevation0)+math.cos(@elevation0)*math.cos(elevation)*math.cos(azimuth-@azimuth0)
        cosc >= (1.0/@dist)

    sea: ->
        out = []
        r = @r
        math = Math
        for phi in [0..360]
            out.push([r + math.cos(@rad(phi)) * r, r + math.sin(@rad(phi)) * r])
        out

__proj['satellite'] = Satellite



class EquidistantAzimuthal extends Azimuthal
    ###
    Equidistant projection

    implementation taken from
    Snyder, Map projections - A working manual
    ###
    @title = "Equidistant Azimuthal Projection"

    project: (lon, lat) ->
        me = @
        phi = me.rad(lat)
        lam = me.rad(lon)
        math = Math
        sin = math.sin
        cos = math.cos

        cos_c = sin(@phi0) * sin(phi) + cos(@phi0) * cos(phi) * cos(lam - @lam0)
        c = math.acos(cos_c)
        k = 0.325 * c/sin(c)

        xo = @r * k * cos(phi) * sin(lam - @lam0)
        yo = -@r * k * ( cos(@phi0)*sin(phi) - sin(@phi0)*cos(phi)*cos(lam - @lam0) )

        x = @r + xo
        y = @r + yo
        [x,y]

    _visible: (lon, lat) ->
        true

__proj['equi'] = EquidistantAzimuthal



class Aitoff extends PseudoCylindrical
    ###
    Aitoff projection

    implementation taken from
    Snyder, Map projections - A working manual
    ###
    @title = "Aitoff Projection"
    @parameters = ['lon0']

    COSPHI1 = 0.636619772367581343

    constructor: (opts) ->
        me = @
        opts.lat0 = 0
        super opts
        me.lam0 = 0

    project: (lon, lat) ->
        me = @
        [lon, lat] = me.ll(lon,lat)
        lon = me.clon(lon)
        lam = me.rad(lon)
        phi = me.rad(lat)
        c = 0.5 * lam
        d = Math.acos(Math.cos(phi) * Math.cos(c))
        if d != 0
            y = 1.0 / Math.sin(d)
            x = 2.0 * d * Math.cos(phi) * Math.sin(c) * y
            y *= d * Math.sin(phi)
        else
            x = y = 0
        if me.winkel
            x = (x + lam * COSPHI1) * 0.5
            y = (y + phi) * 0.5
        [x*1000, y*-1000]

    _visible: (lon, lat) ->
        true

__proj['aitoff'] = Aitoff


class Winkel3 extends Aitoff

    @title = "Winkel Tripel Projection"

    constructor: (opts) ->
        super opts
        @winkel = true


__proj['winkel3'] = Winkel3

# -------------------------------
# Family of Conic Projecitons
# -------------------------------


class Conic extends Proj

    @title = "Conic Projection"
    @parameters = ['lon0', 'lat0', 'lat1', 'lat2']

    constructor: (opts) ->
        self = @
        super opts
        self.lat1 = opts.lat1 ? 30
        self.phi1 = self.rad(self.lat1)
        self.lat2 = opts.lat2 ? 50
        self.phi2 = self.rad(self.lat2)

    _visible: (lon, lat) ->
        self = @
        lat > self.minLat and lat < self.maxLat

    _truncate: (x,y) ->
        [x,y]

    clon: (lon) ->
        lon -= @lon0
        if lon < -180
            lon += 360
        else if lon > 180
            lon -= 360
        lon


class LCC extends Conic
    ###
    Lambert Conformal Conic Projection (spherical)
    ###
    @title = "Lambert Conformal Conic Projection"
    constructor: (opts) ->
        self = @
        super opts
        m = Math
        [sin,cos,abs,log,tan,pow] = [m.sin,m.cos,m.abs,m.log,m.tan,m.pow]
        self.n = n = sinphi = sin(self.phi1)
        cosphi = cos(self.phi1)
        secant = abs(self.phi1 - self.phi2) >= 1e-10

        if secant
            n = log(cosphi / cos(self.phi2)) / log(tan(self.QUARTERPI + 0.5 * self.phi2) / tan(self.QUARTERPI + 0.5 * self.phi1))
        self.c = c = cosphi * pow(tan(self.QUARTERPI + .5 * self.phi1), n) / n
        if abs(abs(self.phi0) - self.HALFPI) < 1e-10
            self.rho0 = 0.0
        else
            self.rho0 = c * pow(tan(self.QUARTERPI + .5 * self.phi0), -n)

        self.minLat = -60
        self.maxLat = 85


    project: (lon, lat) ->
        self = @
        phi = self.rad(lat)
        lam = self.rad(self.clon(lon))
        m = Math
        [sin,cos,abs,log,tan,pow] = [m.sin,m.cos,m.abs,m.log,m.tan,m.pow]

        n = self.n
        if abs(abs(phi) - self.HALFPI) < 1e-10
            rho = 0.0
        else
            rho = self.c * pow(tan(self.QUARTERPI + 0.5 * phi), -n)
        lam_ = (lam) * n
        x = 1000 * rho * sin(lam_)
        y = 1000 * (self.rho0 - rho * cos(lam_))

        [x,y*-1]

#too buggy
__proj['lcc'] = LCC


class PseudoConic extends Conic






