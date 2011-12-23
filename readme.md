kartograph
======

**kartograph** is a simple toolset that helps creating interactive thematic maps that run across multiple browsers without using tile-based mapping environments like Google Maps or OpenStreetMaps. Think of it as OpenLayers, but *a lot* more simple to use.

## How it works

Basically, a Python script generates SVG files that are loaded and rendered by a JS class.

### The Python side

**kartograph.py** is a small Python script that renders SVG maps out of shapefiles. At the moment it can be used from the command line.

For instance, if you want an SVG map of Brazil you type:

	kartograph.py country BRA --o Brazil.svg

Of course, there are plenty of possible options, see readme in kartograph.py directory.

### The JavaScript side

**kartograph.js** will then load the SVG maps and allows to connect the maps with some data. You can color the map polygons (which could be countries, for instance) to get a chloropleth map, or you can add labels or charts at geo-locations etc.

Again, see readme in kartograph.js directory to get more information.


### License

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

### About the Maps

The maps are taken from [Natural Earth](http://www.naturalearthdata.com) project.

![made with Natural Earth](http://www.naturalearthdata.com/wp-content/uploads/2009/08/NEV-Logo-Black_sm.png)

