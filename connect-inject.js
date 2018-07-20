// https://github.com/danielhq/connect-inject
// Copyright (c) 2013 danielhq
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is furnished
// to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

module.exports = function inject(opt) {
    // options
    var opt = opt || {};
    var include = opt.include || "";
    var html = opt.html || _html;
    var rules = opt.rules || [{
      match: /<\/body>/,
      fn: prepend
    }, {
      match: /<\/html>/,
      fn: prepend
    }, {
      match: /<\!DOCTYPE.+>/,
      fn: append
    }];
    var snippetBuilder = function(snippet) {
      if (snippet) {
        if (snippet instanceof Array) {
          return snippet.join("");
        } else {
          return snippet;
        }
      } else {
        return "";
      }
    };
  
    var snippet = snippetBuilder(opt.snippet);
  
    var runAll = opt.runAll || false;
  
    // helper functions
    var regex = (function() {
      var matches = rules.map(function(item) {
        return item.match.source;
      }).join('|');
  
      return new RegExp(matches);
    })();
  
    function prepend(w, s) {
      return s + w;
    }
  
    function append(w, s) {
      return w + s;
    }
  
    function _html(str) {
      if (!str) return false;
      return /<[:_-\w\s\!\/\=\"\']+>/i.test(str);
    }
  
    function exists(body) {
      if (!body) return false;
      return regex.test(body);
    }
  
    function snip(body) {
      if (!body) return false;
      return (~body.lastIndexOf("/livereload.js"));
    }
  
    function snap(body) {
      var _body = body;
      rules.some(function(rule) {
        if (rule.match.test(_body)) {
          _body = _body.replace(rule.match, function(w) {
            return rule.fn(w, rule.snippet|| snippet);
          });
          if (runAll === false) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      });
      return _body;
    }
  
    function accept(req) {
      var ha = req.headers["accept"];
      if (!ha) return false;
      return (~ha.indexOf("html"));
    }
  
    function leave(req) {
      var url = req.url.toLowerCase();
      var ignored = false;
      if (!url) return true;

      if(url.toLowerCase().indexOf(include) === -1){
        ignored = true;
      } 

      return ignored;
    }
  
    // middleware
    return function inject(req, res, next) {
      if (res.inject) return next();
  
      var writeHead = res.writeHead;
      var write = res.write;
      var end = res.end;
  
      if (!accept(req) || leave(req)) {
        return next();
      }
  
      function restore() {
        res.writeHead = writeHead;
        res.write = write;
        res.end = end;
      }
  
      res.push = function(chunk) {
        res.data = (res.data || '') + chunk;
      };
  
      res.inject = res.write = function(string, encoding) {
        if (string !== undefined) {
          var body = string instanceof Buffer ? string.toString(encoding) : string;
          if (exists(body) && !snip(res.data)) {
            res.push(snap(body));
            return true;
          } else if (html(body) || html(res.data)) {
            res.push(body);
            return true;
          } else {
            restore();
            return write.call(res, string, encoding);
          }
        }
        return true;
      };
  
      res.writeHead = function() {};
  
      res.end = function(string, encoding) {
        restore();
        var result = res.inject(string, encoding);
        if (!result) return end.call(res, string, encoding);
        if (res.data !== undefined && !res._header) res.setHeader('content-length', Buffer.byteLength(res.data, encoding));
        res.end(res.data, encoding);
      };
      next();
    };
  
  }
  