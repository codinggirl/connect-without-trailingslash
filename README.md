connect-without-trailingslash
===============

Let url with a trailing slash, a middleware for Connect and Express.js. Useful for creating canonical urls in your Node.js applications.

## Installation

```
$ npm install connect-with-trailingslash
```

## Usage

```javascript
var connect = require("connect")
  , slashes = require("connect-with-trailingslash");

connect() // or express()
  .use(connect.static())
  .use(slashes()) // must come after static middleware!
  .listen(3000);
```

## Additional settings

By default, all redirects are using the 301 Moved Permanently header. You can change this behavior by passing in the optional `code` option:

```javascript
.use(slashes(true, { code: 302 })); // 302 Temporary redirects
```

You can also set additional headers to the redirect response with the `headers` option:

```javascript
.use(slashes(true, { headers: { "Cache-Control": "public" } }));
```

## Notes

1. Only GET, HEAD, and OPTIONS requests will be redirected (to avoid losing POST/PUT data)
2. This middleware will append a trailing slash to all request urls. This includes filenames (/app.css => /app.css/), so it may break your static files. Make sure to `.use()` this middleware only after the `connect.static()` middleware.

## LICENSE

MIT
