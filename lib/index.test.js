const withSlash = require("..")

// default middleware without options (or with default options)
const _mw = withSlash()

// res mock object
const _res = (opts) => Object.assign({}, {
    writeHead: () => { },
    redirect: (status, path) => { },
    end: () => { }
}, opts)

const _pathname = (pathString) => new URL(pathString, 'http://localhost').pathname

// default middleware test wrapper
const _test_mw = (req, res, next) => {
    _mw(req, _res(res), next || (() => { }))
}

test('creation: middleware is a function', () => {
    const mw = withSlash()
    expect(typeof mw).toEqual('function')
    const mw2 = withSlash({})
    expect(typeof mw2).toEqual('function')
    const mw3 = withSlash(null)
    expect(typeof mw3).toEqual('function')
    const mw4 = withSlash({
        status: 200,
        headers: {
            'powered-by': 'super trailing slash'
        }
    })
    expect(typeof mw4).toEqual('function')
})

test("POST should not redirect", function (done) {
    _test_mw({
        method: 'POST',
        url: '/foo'
    }, {
        end: done
    }, done)
})

test("shouldn't redirect slashes for PUT requests", function (done) {
    const req = {
        method: 'PUT',
        url: '/foo'
    }
    const res = _res({
        writeHead: jest.fn(),
        end: done
    })
    _mw(req, res, done)
    expect(res.writeHead).not.toBeCalled()
})

test("should append slashes for GET requests", function (done) {
    _test_mw({
        method: "GET",
        url: "/foo"
    }, {
        redirect: (status, path) => {
            expect(status).toEqual(301)
            expect(_pathname(path)).toEqual('/foo/')
        },
        end: done
    }, function () {
        assert(false); // no redirect took place
    })
})

test("should append slashes for HEAD requests", function (done) {
    _test_mw({
        method: "HEAD",
        url: "/foo"
    }, {
        redirect: (status, path) => {
            expect(status).toEqual(301)
            expect(_pathname(path)).toEqual('/foo/')
        },
        end: done
    }, function () {
        assert(false); // no redirect took place
    });
})

test("should append slashes for OPTIONS requests", function (done) {
    _mw({
        method: "OPTIONS",
        url: "/foo"
    }, _res({
        redirect: (status, path) => {
            expect(status).toEqual(301)
            expect(_pathname(path)).toEqual('/foo/')
        },
        end: done
    }), function () {
        assert(false); // no redirect took place
    });
})

test("should append slashes for GET requests using originalUrl", function (done) {
    _mw({
        method: "GET",
        originalUrl: "/foo"
    }, _res({
        redirect: (status, path) => {
            expect(status).toEqual(301)
            expect(_pathname(path)).toEqual('/foo/')
        },
        end: done
    }), function () {
        assert(false); // no redirect took place
    })
})

test("should move permanenetly (301)", function (done) {
    _mw({
        method: "GET",
        url: "/foo"
    }, _res({
        redirect: (status, path) => {
            expect(status).toEqual(301)
            expect(_pathname(path)).toEqual('/foo/')
        },
        end: done
    }), function () {
        assert(false); // no redirect took place
    });
})

test("should control the redirect status code", function (done) {
    const mw =
        withSlash({ status: 305 })

    mw({
        method: "GET",
        url: "/foo"
    }, _res({
        redirect: (status, path) => {
            expect(status).toEqual(305)
            expect(_pathname(path)).toEqual('/foo/')
        },
        end: done
    }), function () {

    });
})

test("should forward GET arguments", function (done) {
    _mw({
        method: "GET",
        url: "/foo?hello=world&foo=bar"
    }, _res({
        redirect: (status, path) => {
            expect(status).toEqual(301)
            expect(_pathname(path)).toEqual('/foo/')
        },
        end: done
    }), function () {

    })
})

test("should forward (weird) GET arguments", function (done) {
    _mw({
        method: "GET",
        url: "/foo&hello=world&foo=bar"
    }, _res({
        redirect: (status, path) => {
            expect(status).toEqual(301)
            expect(_pathname(path)).toEqual('/foo&hello=world&foo=bar/')
        },
        end: done
    }))
})

test("should set headers", function (done) {
    const mw = withSlash({
        headers: {
            "Cache-Control": "public"
        }
    })
    mw({
        method: 'GET',
        url: '/foo'
    }, _res({
        writeHead: (status, headers) => {
            expect(headers['Cache-Control'] === 'public')
            expect(status).toEqual(301)
        },
        redirect: (status, path) => {
            expect(status).toEqual(301)
            expect(_pathname(path)).toEqual('/foo/')
        },
        end: done
    }))
})
