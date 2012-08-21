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

###
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

###

kartograph.parsecss = (str, callback) ->
	ret = {}
	str = munge(str)
	for css in str.split '`b%'
		css = css.split '%b`'
		if css.length < 2 then continue
		css[0] = restore css[0]
		props = parsedeclarations(css[1])
		if ret[css[0]]?
			for k,v of props
				ret[css[0]][k] = v
		else
			ret[css[0]] = props
	if __type(callback) == 'function'
		callback ret
		return
	else
		return ret

munged = {} # cache

parsedeclarations = (index) ->
	str = munged[index].replace(/^{|}$/g, '')
	str = munge(str)
	parsed = {}
	for decl in str.split(';')
		decl = decl.split(':')
		if decl.length < 2 then continue
		parsed[restore(decl[0])] = restore(decl.slice(1).join(':'))
	parsed

REbraces = /{[^{}]*}/
REfull = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/
REcomment_string = /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g
REmunged = /%\w`(\d+)`\w%/
uid = 0; 

munge = (str, full) ->
	str = str.replace REcomment_string, (s, string) ->
		if !string then return ''
		replacement = '%s`'+(++uid)+'`s%'
		munged[uid] = string.replace(/^\\/,'')
		replacement
	RE = if full then REfull else REbraces
	while match = RE.exec(str)
		replacement = '%b`'+(++uid)+'`b%'
		munged[uid] = match[0]
		str = str.replace(RE, replacement)
	str

restore = (str) ->
	if not str? then return str
	while match = REmunged.exec(str)
		str = str.replace(REmunged, munged[match[1]])
	str.trim()

