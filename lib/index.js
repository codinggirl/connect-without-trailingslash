/**
 * connect-with-trailingslash
 * Let url with a trailing slash, a middleware for Connect
 * https://github.com/codinggirl/connect-with-trailingslash
 * 
 * Folked from <https://github.com/avinoamr/connect-slashes>
 * 
 * The MIT License
 *
 * Copyright (c) 2019 Richard Libre.
 * Copyright (c) 2010-2012 Roi Avinoam <avinoamr@gmail.com> and connect-slashes authors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

var allowedMethods = ['GET', 'HEAD', 'OPTIONS']

// options.status
// options.headers
var withSlash = function (options) {
    options = options || {}
    return function withSlash(req, res, next) {
        if (allowedMethods.includes(req.method)) {
            // Use originalUrl when defined ( for express compatibility);
            var originalUrl = (req.originalUrl || req.url)
            var url = new URL(originalUrl, 'http://localhost')
            if (!url.pathname.endsWith('/')) {
                url.pathname += "/"
                const redirectPath = `${url.pathname}${url.search}`
                const status = options.status || 301
                const headers = Object.assign({}, options.headers)
                res.writeHead(status, headers)
                res.redirect(status, redirectPath)
                res.end()
                return
            }
        }
        next()
    }
}

module.exports = withSlash
