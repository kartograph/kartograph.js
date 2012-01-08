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

  var REbraces, REcomment_string, REfull, REmunged, kartograph, munge, munged, parsedeclarations, restore, root, uid, _ref;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  kartograph = (_ref = root.kartograph) != null ? _ref : root.kartograph = {};

  /*
      This is a reduced version of Danial Wachsstocks jQuery based CSS parser
      Everything is removed but the core css-to-object parsing
  
      jQuery based CSS parser
      documentation: http://youngisrael-stl.org/wordpress/2009/01/16/jquery-css-parser/
      Version: 1.3
      Copyright (c) 2011 Daniel Wachsstock
      MIT license:
      Permission is hereby granted, free of charge, to any person
      obtaining a copy of this software and associated documentation
      files (the "Software"), to deal in the Software without
      restriction, including without limitation the rights to use,
      copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the
      Software is furnished to do so, subject to the following
      conditions:
  
      The above copyright notice and this permission notice shall be
      included in all copies or substantial portions of the Software.
  
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
      OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
      NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
      HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
      WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
      OTHER DEALINGS IN THE SOFTWARE.
  */

  kartograph.parsecss = function(str, callback) {
    var css, k, props, ret, v, _i, _len, _ref2;
    ret = {};
    str = munge(str);
    _ref2 = str.split('`b%');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      css = _ref2[_i];
      css = css.split('%b`');
      if (css.length < 2) continue;
      css[0] = restore(css[0]);
      props = parsedeclarations(css[1]);
      if (ret[css[0]] != null) {
        for (k in props) {
          v = props[k];
          ret[css[0]][k] = v;
        }
      } else {
        ret[css[0]] = props;
      }
    }
    if (type(callback) === 'function') {
      callback(ret);
    } else {
      return ret;
    }
  };

  munged = {};

  parsedeclarations = function(index) {
    var decl, parsed, str, _i, _len, _ref2;
    str = munged[index].replace(/^{|}$/g, '');
    str = munge(str);
    parsed = {};
    _ref2 = str.split(';');
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      decl = _ref2[_i];
      decl = decl.split(':');
      if (decl.length < 2) continue;
      parsed[restore(decl[0])] = restore(decl.slice(1).join(':'));
    }
    return parsed;
  };

  REbraces = /{[^{}]*}/;

  REfull = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/;

  REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;

  REmunged = /%\w`(\d+)`\w%/;

  uid = 0;

  munge = function(str, full) {
    var RE, match, replacement;
    str = str.replace(REcomment_string, function(s, string) {
      var replacement;
      if (!string) return '';
      replacement = '%s`' + (++uid) + '`s%';
      munged[uid] = string.replace(/^\\/, '');
      return replacement;
    });
    RE = full ? REfull : REbraces;
    while (match = RE.exec(str)) {
      replacement = '%b`' + (++uid) + '`b%';
      munged[uid] = match[0];
      str = str.replace(RE, replacement);
    }
    return str;
  };

  restore = function(str) {
    var match;
    if (!(str != null)) return str;
    while (match = REmunged.exec(str)) {
      str = str.replace(REmunged, munged[match[1]]);
    }
    return str.trim();
  };

}).call(this);
