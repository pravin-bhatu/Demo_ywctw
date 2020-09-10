!function() {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c)
                        return c(i, !0);
                    if (u)
                        return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND",
                    a
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function(r) {
                    return o(e[i][1][r] || r)
                }, p, p.exports, r, e, n, t)
            }
            return n[i].exports
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)
            o(t[i]);
        return o
    }
    return r
}()({
    1: [function(require, module, exports) {
        function changeElementState(elements, disabled) {
            _.each(elements, function(element) {
                element.prop("disabled", disabled)
            })
        }
        var request = require("superagent")
          , _ = require("underscore");
        module.exports = window.$(document).ready(function() {
            $("#formMarketplaceOnboard").submit(function(event) {
                event.preventDefault();
                var errorElements = {
                    box: $("#errorBox"),
                    text: $("#errorText")
                }
                  , elements = {
                    firstName: $("#firstName"),
                    lastName: $("#lastName"),
                    email: $("#email"),
                    phone: $("#phone"),
                    dateOfBirth: $("#dateOfBirth"),
                    ssn: $("#ssn"),
                    streetAddress: $("#streetAddress"),
                    city: $("#city"),
                    state: $("#state"),
                    zip: $("#zip"),
                    businessLegal: $("#businessLegal"),
                    businessDBA: $("#businessDBA"),
                    businessTaxId: $("#businessTaxId"),
                    businessStreetAddress: $("#businessStreetAddress"),
                    businessCity: $("#businessCity"),
                    businessState: $("#businessState"),
                    businessZip: $("#businessZip"),
                    paymentAccount: $("#paymentAccount"),
                    paymentRouting: $("#paymentRouting"),
                    tosAccepted: $("#tosAccepted"),
                    submitButton: $("#formSubmit")
                };
                changeElementState(elements, !0);
                var data = _.mapObject(elements, function(element) {
                    return element.val()
                });
                data.tosAccepted = elements.tosAccepted.prop("checked"),
                request.post("/dashboard/marketplace/onboard").send(data).end(function(error, response) {
                    response.body && response.body.success ? (errorElements.box.hide(),
                    window.location.replace("/dashboard")) : (errorElements.text.html(response.body.error || "Oops, something went wrong. Please try again."),
                    errorElements.box.show(),
                    changeElementState(elements, !1)),
                    console.log(response)
                })
            }),
            $("#amboPayoutDataForm").submit(function(event) {
                event.preventDefault();
                var errorElements = {
                    box: $("#errorBox"),
                    text: $("#errorText")
                }
                  , elements = {
                    firstName: $("#firstName"),
                    lastName: $("#lastName"),
                    email: $("#email"),
                    phone: $("#phone"),
                    dateOfBirth: $("#dateOfBirth"),
                    streetAddress: $("#streetAddress"),
                    city: $("#city"),
                    state: $("#state"),
                    zip: $("#zip"),
                    paypal: $("#paypal"),
                    submitButton: $("#formSubmit")
                };
                changeElementState(elements, !0);
                var data = _.mapObject(elements, function(element) {
                    return element.val()
                });
                request.post("/affiliates/program/onboard").send(data).end(function(error, response) {
                    console.log("RESPONSE :: " + JSON.stringify(response)),
                    response.body ? (errorElements.box.hide(),
                    alert("Profile Successfully updated"),
                    window.location.replace("/affiliates/program/profile")) : (errorElements.text.html("Oops, something went wrong. Please try again."),
                    errorElements.box.show(),
                    changeElementState(elements, !1)),
                    console.log(response)
                })
            })
        })
    }
    , {
        superagent: 5,
        underscore: 6
    }],
    2: [function(require, module, exports) {
        window.$(document).ready(function() {
            require("./forms/marketplace-onboard.js")
        })
    }
    , {
        "./forms/marketplace-onboard.js": 1
    }],
    3: [function(require, module, exports) {
        function Emitter(obj) {
            if (obj)
                return mixin(obj)
        }
        function mixin(obj) {
            for (var key in Emitter.prototype)
                obj[key] = Emitter.prototype[key];
            return obj
        }
        module.exports = Emitter,
        Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
            return this._callbacks = this._callbacks || {},
            (this._callbacks[event] = this._callbacks[event] || []).push(fn),
            this
        }
        ,
        Emitter.prototype.once = function(event, fn) {
            function on() {
                self.off(event, on),
                fn.apply(this, arguments)
            }
            var self = this;
            return this._callbacks = this._callbacks || {},
            on.fn = fn,
            this.on(event, on),
            this
        }
        ,
        Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
            if (this._callbacks = this._callbacks || {},
            0 == arguments.length)
                return this._callbacks = {},
                this;
            var callbacks = this._callbacks[event];
            if (!callbacks)
                return this;
            if (1 == arguments.length)
                return delete this._callbacks[event],
                this;
            for (var cb, i = 0; i < callbacks.length; i++)
                if ((cb = callbacks[i]) === fn || cb.fn === fn) {
                    callbacks.splice(i, 1);
                    break
                }
            return this
        }
        ,
        Emitter.prototype.emit = function(event) {
            this._callbacks = this._callbacks || {};
            var args = [].slice.call(arguments, 1)
              , callbacks = this._callbacks[event];
            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i)
                    callbacks[i].apply(this, args)
            }
            return this
        }
        ,
        Emitter.prototype.listeners = function(event) {
            return this._callbacks = this._callbacks || {},
            this._callbacks[event] || []
        }
        ,
        Emitter.prototype.hasListeners = function(event) {
            return !!this.listeners(event).length
        }
    }
    , {}],
    4: [function(require, module, exports) {
        module.exports = function(arr, fn, initial) {
            for (var idx = 0, len = arr.length, curr = 3 == arguments.length ? initial : arr[idx++]; idx < len; )
                curr = fn.call(null, curr, arr[idx], ++idx, arr);
            return curr
        }
    }
    , {}],
    5: [function(require, module, exports) {
        function noop() {}
        function isHost(obj) {
            switch ({}.toString.call(obj)) {
            case "[object File]":
            case "[object Blob]":
            case "[object FormData]":
                return !0;
            default:
                return !1
            }
        }
        function isObject(obj) {
            return obj === Object(obj)
        }
        function serialize(obj) {
            if (!isObject(obj))
                return obj;
            var pairs = [];
            for (var key in obj)
                null != obj[key] && pushEncodedKeyValuePair(pairs, key, obj[key]);
            return pairs.join("&")
        }
        function pushEncodedKeyValuePair(pairs, key, val) {
            if (Array.isArray(val))
                return val.forEach(function(v) {
                    pushEncodedKeyValuePair(pairs, key, v)
                });
            pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(val))
        }
        function parseString(str) {
            for (var parts, pair, obj = {}, pairs = str.split("&"), i = 0, len = pairs.length; i < len; ++i)
                pair = pairs[i],
                parts = pair.split("="),
                obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            return obj
        }
        function parseHeader(str) {
            var index, line, field, val, lines = str.split(/\r?\n/), fields = {};
            lines.pop();
            for (var i = 0, len = lines.length; i < len; ++i)
                line = lines[i],
                index = line.indexOf(":"),
                field = line.slice(0, index).toLowerCase(),
                val = trim(line.slice(index + 1)),
                fields[field] = val;
            return fields
        }
        function isJSON(mime) {
            return /[\/+]json\b/.test(mime)
        }
        function type(str) {
            return str.split(/ *; */).shift()
        }
        function params(str) {
            return reduce(str.split(/ *; */), function(obj, str) {
                var parts = str.split(/ *= */)
                  , key = parts.shift()
                  , val = parts.shift();
                return key && val && (obj[key] = val),
                obj
            }, {})
        }
        function Response(req, options) {
            options = options || {},
            this.req = req,
            this.xhr = this.req.xhr,
            this.text = "HEAD" != this.req.method && ("" === this.xhr.responseType || "text" === this.xhr.responseType) || void 0 === this.xhr.responseType ? this.xhr.responseText : null,
            this.statusText = this.req.xhr.statusText,
            this.setStatusProperties(this.xhr.status),
            this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders()),
            this.header["content-type"] = this.xhr.getResponseHeader("content-type"),
            this.setHeaderProperties(this.header),
            this.body = "HEAD" != this.req.method ? this.parseBody(this.text ? this.text : this.xhr.response) : null
        }
        function Request(method, url) {
            var self = this;
            Emitter.call(this),
            this._query = this._query || [],
            this.method = method,
            this.url = url,
            this.header = {},
            this._header = {},
            this.on("end", function() {
                var err = null
                  , res = null;
                try {
                    res = new Response(self)
                } catch (e) {
                    return err = new Error("Parser is unable to parse the response"),
                    err.parse = !0,
                    err.original = e,
                    err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null,
                    self.callback(err)
                }
                if (self.emit("response", res),
                err)
                    return self.callback(err, res);
                if (res.status >= 200 && res.status < 300)
                    return self.callback(err, res);
                var new_err = new Error(res.statusText || "Unsuccessful HTTP response");
                new_err.original = err,
                new_err.response = res,
                new_err.status = res.status,
                self.callback(new_err, res)
            })
        }
        function request(method, url) {
            return "function" == typeof url ? new Request("GET",method).end(url) : 1 == arguments.length ? new Request("GET",method) : new Request(method,url)
        }
        function del(url, fn) {
            var req = request("DELETE", url);
            return fn && req.end(fn),
            req
        }
        var root, Emitter = require("emitter"), reduce = require("reduce");
        root = "undefined" != typeof window ? window : "undefined" != typeof self ? self : this,
        request.getXHR = function() {
            if (!(!root.XMLHttpRequest || root.location && "file:" == root.location.protocol && root.ActiveXObject))
                return new XMLHttpRequest;
            try {
                return new ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP")
            } catch (e) {}
            return !1
        }
        ;
        var trim = "".trim ? function(s) {
            return s.trim()
        }
        : function(s) {
            return s.replace(/(^\s*|\s*$)/g, "")
        }
        ;
        request.serializeObject = serialize,
        request.parseString = parseString,
        request.types = {
            html: "text/html",
            json: "application/json",
            xml: "application/xml",
            urlencoded: "application/x-www-form-urlencoded",
            form: "application/x-www-form-urlencoded",
            "form-data": "application/x-www-form-urlencoded"
        },
        request.serialize = {
            "application/x-www-form-urlencoded": serialize,
            "application/json": JSON.stringify
        },
        request.parse = {
            "application/x-www-form-urlencoded": parseString,
            "application/json": JSON.parse
        },
        Response.prototype.get = function(field) {
            return this.header[field.toLowerCase()]
        }
        ,
        Response.prototype.setHeaderProperties = function(header) {
            var ct = this.header["content-type"] || "";
            this.type = type(ct);
            var obj = params(ct);
            for (var key in obj)
                this[key] = obj[key]
        }
        ,
        Response.prototype.parseBody = function(str) {
            var parse = request.parse[this.type];
            return parse && str && (str.length || str instanceof Object) ? parse(str) : null
        }
        ,
        Response.prototype.setStatusProperties = function(status) {
            1223 === status && (status = 204);
            var type = status / 100 | 0;
            this.status = this.statusCode = status,
            this.statusType = type,
            this.info = 1 == type,
            this.ok = 2 == type,
            this.clientError = 4 == type,
            this.serverError = 5 == type,
            this.error = (4 == type || 5 == type) && this.toError(),
            this.accepted = 202 == status,
            this.noContent = 204 == status,
            this.badRequest = 400 == status,
            this.unauthorized = 401 == status,
            this.notAcceptable = 406 == status,
            this.notFound = 404 == status,
            this.forbidden = 403 == status
        }
        ,
        Response.prototype.toError = function() {
            var req = this.req
              , method = req.method
              , url = req.url
              , msg = "cannot " + method + " " + url + " (" + this.status + ")"
              , err = new Error(msg);
            return err.status = this.status,
            err.method = method,
            err.url = url,
            err
        }
        ,
        request.Response = Response,
        Emitter(Request.prototype),
        Request.prototype.use = function(fn) {
            return fn(this),
            this
        }
        ,
        Request.prototype.timeout = function(ms) {
            return this._timeout = ms,
            this
        }
        ,
        Request.prototype.clearTimeout = function() {
            return this._timeout = 0,
            clearTimeout(this._timer),
            this
        }
        ,
        Request.prototype.abort = function() {
            if (!this.aborted)
                return this.aborted = !0,
                this.xhr.abort(),
                this.clearTimeout(),
                this.emit("abort"),
                this
        }
        ,
        Request.prototype.set = function(field, val) {
            if (isObject(field)) {
                for (var key in field)
                    this.set(key, field[key]);
                return this
            }
            return this._header[field.toLowerCase()] = val,
            this.header[field] = val,
            this
        }
        ,
        Request.prototype.unset = function(field) {
            return delete this._header[field.toLowerCase()],
            delete this.header[field],
            this
        }
        ,
        Request.prototype.getHeader = function(field) {
            return this._header[field.toLowerCase()]
        }
        ,
        Request.prototype.type = function(type) {
            return this.set("Content-Type", request.types[type] || type),
            this
        }
        ,
        Request.prototype.parse = function(fn) {
            return this._parser = fn,
            this
        }
        ,
        Request.prototype.accept = function(type) {
            return this.set("Accept", request.types[type] || type),
            this
        }
        ,
        Request.prototype.auth = function(user, pass) {
            var str = btoa(user + ":" + pass);
            return this.set("Authorization", "Basic " + str),
            this
        }
        ,
        Request.prototype.query = function(val) {
            return "string" != typeof val && (val = serialize(val)),
            val && this._query.push(val),
            this
        }
        ,
        Request.prototype.field = function(name, val) {
            return this._formData || (this._formData = new root.FormData),
            this._formData.append(name, val),
            this
        }
        ,
        Request.prototype.attach = function(field, file, filename) {
            return this._formData || (this._formData = new root.FormData),
            this._formData.append(field, file, filename),
            this
        }
        ,
        Request.prototype.send = function(data) {
            var obj = isObject(data)
              , type = this.getHeader("Content-Type");
            if (obj && isObject(this._data))
                for (var key in data)
                    this._data[key] = data[key];
            else
                "string" == typeof data ? (type || this.type("form"),
                type = this.getHeader("Content-Type"),
                this._data = "application/x-www-form-urlencoded" == type ? this._data ? this._data + "&" + data : data : (this._data || "") + data) : this._data = data;
            return !obj || isHost(data) ? this : (type || this.type("json"),
            this)
        }
        ,
        Request.prototype.callback = function(err, res) {
            var fn = this._callback;
            this.clearTimeout(),
            fn(err, res)
        }
        ,
        Request.prototype.crossDomainError = function() {
            var err = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");
            err.crossDomain = !0,
            err.status = this.status,
            err.method = this.method,
            err.url = this.url,
            this.callback(err)
        }
        ,
        Request.prototype.timeoutError = function() {
            var timeout = this._timeout
              , err = new Error("timeout of " + timeout + "ms exceeded");
            err.timeout = timeout,
            this.callback(err)
        }
        ,
        Request.prototype.withCredentials = function() {
            return this._withCredentials = !0,
            this
        }
        ,
        Request.prototype.end = function(fn) {
            var self = this
              , xhr = this.xhr = request.getXHR()
              , query = this._query.join("&")
              , timeout = this._timeout
              , data = this._formData || this._data;
            this._callback = fn || noop,
            xhr.onreadystatechange = function() {
                if (4 == xhr.readyState) {
                    var status;
                    try {
                        status = xhr.status
                    } catch (e) {
                        status = 0
                    }
                    if (0 == status) {
                        if (self.timedout)
                            return self.timeoutError();
                        if (self.aborted)
                            return;
                        return self.crossDomainError()
                    }
                    self.emit("end")
                }
            }
            ;
            var handleProgress = function(e) {
                e.total > 0 && (e.percent = e.loaded / e.total * 100),
                self.emit("progress", e)
            };
            this.hasListeners("progress") && (xhr.onprogress = handleProgress);
            try {
                xhr.upload && this.hasListeners("progress") && (xhr.upload.onprogress = handleProgress)
            } catch (e) {}
            if (timeout && !this._timer && (this._timer = setTimeout(function() {
                self.timedout = !0,
                self.abort()
            }, timeout)),
            query && (query = request.serializeObject(query),
            this.url += ~this.url.indexOf("?") ? "&" + query : "?" + query),
            xhr.open(this.method, this.url, !0),
            this._withCredentials && (xhr.withCredentials = !0),
            "GET" != this.method && "HEAD" != this.method && "string" != typeof data && !isHost(data)) {
                var contentType = this.getHeader("Content-Type")
                  , serialize = this._parser || request.serialize[contentType ? contentType.split(";")[0] : ""];
                !serialize && isJSON(contentType) && (serialize = request.serialize["application/json"]),
                serialize && (data = serialize(data))
            }
            for (var field in this.header)
                null != this.header[field] && xhr.setRequestHeader(field, this.header[field]);
            return this.emit("request", this),
            xhr.send(void 0 !== data ? data : null),
            this
        }
        ,
        Request.prototype.then = function(fulfill, reject) {
            return this.end(function(err, res) {
                err ? reject(err) : fulfill(res)
            })
        }
        ,
        request.Request = Request,
        request.get = function(url, data, fn) {
            var req = request("GET", url);
            return "function" == typeof data && (fn = data,
            data = null),
            data && req.query(data),
            fn && req.end(fn),
            req
        }
        ,
        request.head = function(url, data, fn) {
            var req = request("HEAD", url);
            return "function" == typeof data && (fn = data,
            data = null),
            data && req.send(data),
            fn && req.end(fn),
            req
        }
        ,
        request.del = del,
        request.delete = del,
        request.patch = function(url, data, fn) {
            var req = request("PATCH", url);
            return "function" == typeof data && (fn = data,
            data = null),
            data && req.send(data),
            fn && req.end(fn),
            req
        }
        ,
        request.post = function(url, data, fn) {
            var req = request("POST", url);
            return "function" == typeof data && (fn = data,
            data = null),
            data && req.send(data),
            fn && req.end(fn),
            req
        }
        ,
        request.put = function(url, data, fn) {
            var req = request("PUT", url);
            return "function" == typeof data && (fn = data,
            data = null),
            data && req.send(data),
            fn && req.end(fn),
            req
        }
        ,
        module.exports = request
    }
    , {
        emitter: 3,
        reduce: 4
    }],
    6: [function(require, module, exports) {
        (function() {
            function createReduce(dir) {
                function iterator(obj, iteratee, memo, keys, index, length) {
                    for (; index >= 0 && index < length; index += dir) {
                        var currentKey = keys ? keys[index] : index;
                        memo = iteratee(memo, obj[currentKey], currentKey, obj)
                    }
                    return memo
                }
                return function(obj, iteratee, memo, context) {
                    iteratee = optimizeCb(iteratee, context, 4);
                    var keys = !isArrayLike(obj) && _.keys(obj)
                      , length = (keys || obj).length
                      , index = dir > 0 ? 0 : length - 1;
                    return arguments.length < 3 && (memo = obj[keys ? keys[index] : index],
                    index += dir),
                    iterator(obj, iteratee, memo, keys, index, length)
                }
            }
            function createPredicateIndexFinder(dir) {
                return function(array, predicate, context) {
                    predicate = cb(predicate, context);
                    for (var length = getLength(array), index = dir > 0 ? 0 : length - 1; index >= 0 && index < length; index += dir)
                        if (predicate(array[index], index, array))
                            return index;
                    return -1
                }
            }
            function createIndexFinder(dir, predicateFind, sortedIndex) {
                return function(array, item, idx) {
                    var i = 0
                      , length = getLength(array);
                    if ("number" == typeof idx)
                        dir > 0 ? i = idx >= 0 ? idx : Math.max(idx + length, i) : length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                    else if (sortedIndex && idx && length)
                        return idx = sortedIndex(array, item),
                        array[idx] === item ? idx : -1;
                    if (item !== item)
                        return idx = predicateFind(slice.call(array, i, length), _.isNaN),
                        idx >= 0 ? idx + i : -1;
                    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir)
                        if (array[idx] === item)
                            return idx;
                    return -1
                }
            }
            function collectNonEnumProps(obj, keys) {
                var nonEnumIdx = nonEnumerableProps.length
                  , constructor = obj.constructor
                  , proto = _.isFunction(constructor) && constructor.prototype || ObjProto
                  , prop = "constructor";
                for (_.has(obj, prop) && !_.contains(keys, prop) && keys.push(prop); nonEnumIdx--; )
                    (prop = nonEnumerableProps[nonEnumIdx])in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop) && keys.push(prop)
            }
            var root = this
              , previousUnderscore = root._
              , ArrayProto = Array.prototype
              , ObjProto = Object.prototype
              , FuncProto = Function.prototype
              , push = ArrayProto.push
              , slice = ArrayProto.slice
              , toString = ObjProto.toString
              , hasOwnProperty = ObjProto.hasOwnProperty
              , nativeIsArray = Array.isArray
              , nativeKeys = Object.keys
              , nativeBind = FuncProto.bind
              , nativeCreate = Object.create
              , Ctor = function() {}
              , _ = function(obj) {
                return obj instanceof _ ? obj : this instanceof _ ? void (this._wrapped = obj) : new _(obj)
            };
            void 0 !== exports ? (void 0 !== module && module.exports && (exports = module.exports = _),
            exports._ = _) : root._ = _,
            _.VERSION = "1.8.3";
            var optimizeCb = function(func, context, argCount) {
                if (void 0 === context)
                    return func;
                switch (null == argCount ? 3 : argCount) {
                case 1:
                    return function(value) {
                        return func.call(context, value)
                    }
                    ;
                case 2:
                    return function(value, other) {
                        return func.call(context, value, other)
                    }
                    ;
                case 3:
                    return function(value, index, collection) {
                        return func.call(context, value, index, collection)
                    }
                    ;
                case 4:
                    return function(accumulator, value, index, collection) {
                        return func.call(context, accumulator, value, index, collection)
                    }
                }
                return function() {
                    return func.apply(context, arguments)
                }
            }
              , cb = function(value, context, argCount) {
                return null == value ? _.identity : _.isFunction(value) ? optimizeCb(value, context, argCount) : _.isObject(value) ? _.matcher(value) : _.property(value)
            };
            _.iteratee = function(value, context) {
                return cb(value, context, 1 / 0)
            }
            ;
            var createAssigner = function(keysFunc, undefinedOnly) {
                return function(obj) {
                    var length = arguments.length;
                    if (length < 2 || null == obj)
                        return obj;
                    for (var index = 1; index < length; index++)
                        for (var source = arguments[index], keys = keysFunc(source), l = keys.length, i = 0; i < l; i++) {
                            var key = keys[i];
                            undefinedOnly && void 0 !== obj[key] || (obj[key] = source[key])
                        }
                    return obj
                }
            }
              , baseCreate = function(prototype) {
                if (!_.isObject(prototype))
                    return {};
                if (nativeCreate)
                    return nativeCreate(prototype);
                Ctor.prototype = prototype;
                var result = new Ctor;
                return Ctor.prototype = null,
                result
            }
              , property = function(key) {
                return function(obj) {
                    return null == obj ? void 0 : obj[key]
                }
            }
              , MAX_ARRAY_INDEX = Math.pow(2, 53) - 1
              , getLength = property("length")
              , isArrayLike = function(collection) {
                var length = getLength(collection);
                return "number" == typeof length && length >= 0 && length <= MAX_ARRAY_INDEX
            };
            _.each = _.forEach = function(obj, iteratee, context) {
                iteratee = optimizeCb(iteratee, context);
                var i, length;
                if (isArrayLike(obj))
                    for (i = 0,
                    length = obj.length; i < length; i++)
                        iteratee(obj[i], i, obj);
                else {
                    var keys = _.keys(obj);
                    for (i = 0,
                    length = keys.length; i < length; i++)
                        iteratee(obj[keys[i]], keys[i], obj)
                }
                return obj
            }
            ,
            _.map = _.collect = function(obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, results = Array(length), index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    results[index] = iteratee(obj[currentKey], currentKey, obj)
                }
                return results
            }
            ,
            _.reduce = _.foldl = _.inject = createReduce(1),
            _.reduceRight = _.foldr = createReduce(-1),
            _.find = _.detect = function(obj, predicate, context) {
                var key;
                if (void 0 !== (key = isArrayLike(obj) ? _.findIndex(obj, predicate, context) : _.findKey(obj, predicate, context)) && -1 !== key)
                    return obj[key]
            }
            ,
            _.filter = _.select = function(obj, predicate, context) {
                var results = [];
                return predicate = cb(predicate, context),
                _.each(obj, function(value, index, list) {
                    predicate(value, index, list) && results.push(value)
                }),
                results
            }
            ,
            _.reject = function(obj, predicate, context) {
                return _.filter(obj, _.negate(cb(predicate)), context)
            }
            ,
            _.every = _.all = function(obj, predicate, context) {
                predicate = cb(predicate, context);
                for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    if (!predicate(obj[currentKey], currentKey, obj))
                        return !1
                }
                return !0
            }
            ,
            _.some = _.any = function(obj, predicate, context) {
                predicate = cb(predicate, context);
                for (var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, index = 0; index < length; index++) {
                    var currentKey = keys ? keys[index] : index;
                    if (predicate(obj[currentKey], currentKey, obj))
                        return !0
                }
                return !1
            }
            ,
            _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
                return isArrayLike(obj) || (obj = _.values(obj)),
                ("number" != typeof fromIndex || guard) && (fromIndex = 0),
                _.indexOf(obj, item, fromIndex) >= 0
            }
            ,
            _.invoke = function(obj, method) {
                var args = slice.call(arguments, 2)
                  , isFunc = _.isFunction(method);
                return _.map(obj, function(value) {
                    var func = isFunc ? method : value[method];
                    return null == func ? func : func.apply(value, args)
                })
            }
            ,
            _.pluck = function(obj, key) {
                return _.map(obj, _.property(key))
            }
            ,
            _.where = function(obj, attrs) {
                return _.filter(obj, _.matcher(attrs))
            }
            ,
            _.findWhere = function(obj, attrs) {
                return _.find(obj, _.matcher(attrs))
            }
            ,
            _.max = function(obj, iteratee, context) {
                var value, computed, result = -1 / 0, lastComputed = -1 / 0;
                if (null == iteratee && null != obj) {
                    obj = isArrayLike(obj) ? obj : _.values(obj);
                    for (var i = 0, length = obj.length; i < length; i++)
                        (value = obj[i]) > result && (result = value)
                } else
                    iteratee = cb(iteratee, context),
                    _.each(obj, function(value, index, list) {
                        ((computed = iteratee(value, index, list)) > lastComputed || computed === -1 / 0 && result === -1 / 0) && (result = value,
                        lastComputed = computed)
                    });
                return result
            }
            ,
            _.min = function(obj, iteratee, context) {
                var value, computed, result = 1 / 0, lastComputed = 1 / 0;
                if (null == iteratee && null != obj) {
                    obj = isArrayLike(obj) ? obj : _.values(obj);
                    for (var i = 0, length = obj.length; i < length; i++)
                        (value = obj[i]) < result && (result = value)
                } else
                    iteratee = cb(iteratee, context),
                    _.each(obj, function(value, index, list) {
                        ((computed = iteratee(value, index, list)) < lastComputed || computed === 1 / 0 && result === 1 / 0) && (result = value,
                        lastComputed = computed)
                    });
                return result
            }
            ,
            _.shuffle = function(obj) {
                for (var rand, set = isArrayLike(obj) ? obj : _.values(obj), length = set.length, shuffled = Array(length), index = 0; index < length; index++)
                    rand = _.random(0, index),
                    rand !== index && (shuffled[index] = shuffled[rand]),
                    shuffled[rand] = set[index];
                return shuffled
            }
            ,
            _.sample = function(obj, n, guard) {
                return null == n || guard ? (isArrayLike(obj) || (obj = _.values(obj)),
                obj[_.random(obj.length - 1)]) : _.shuffle(obj).slice(0, Math.max(0, n))
            }
            ,
            _.sortBy = function(obj, iteratee, context) {
                return iteratee = cb(iteratee, context),
                _.pluck(_.map(obj, function(value, index, list) {
                    return {
                        value: value,
                        index: index,
                        criteria: iteratee(value, index, list)
                    }
                }).sort(function(left, right) {
                    var a = left.criteria
                      , b = right.criteria;
                    if (a !== b) {
                        if (a > b || void 0 === a)
                            return 1;
                        if (a < b || void 0 === b)
                            return -1
                    }
                    return left.index - right.index
                }), "value")
            }
            ;
            var group = function(behavior) {
                return function(obj, iteratee, context) {
                    var result = {};
                    return iteratee = cb(iteratee, context),
                    _.each(obj, function(value, index) {
                        var key = iteratee(value, index, obj);
                        behavior(result, value, key)
                    }),
                    result
                }
            };
            _.groupBy = group(function(result, value, key) {
                _.has(result, key) ? result[key].push(value) : result[key] = [value]
            }),
            _.indexBy = group(function(result, value, key) {
                result[key] = value
            }),
            _.countBy = group(function(result, value, key) {
                _.has(result, key) ? result[key]++ : result[key] = 1
            }),
            _.toArray = function(obj) {
                return obj ? _.isArray(obj) ? slice.call(obj) : isArrayLike(obj) ? _.map(obj, _.identity) : _.values(obj) : []
            }
            ,
            _.size = function(obj) {
                return null == obj ? 0 : isArrayLike(obj) ? obj.length : _.keys(obj).length
            }
            ,
            _.partition = function(obj, predicate, context) {
                predicate = cb(predicate, context);
                var pass = []
                  , fail = [];
                return _.each(obj, function(value, key, obj) {
                    (predicate(value, key, obj) ? pass : fail).push(value)
                }),
                [pass, fail]
            }
            ,
            _.first = _.head = _.take = function(array, n, guard) {
                if (null != array)
                    return null == n || guard ? array[0] : _.initial(array, array.length - n)
            }
            ,
            _.initial = function(array, n, guard) {
                return slice.call(array, 0, Math.max(0, array.length - (null == n || guard ? 1 : n)))
            }
            ,
            _.last = function(array, n, guard) {
                if (null != array)
                    return null == n || guard ? array[array.length - 1] : _.rest(array, Math.max(0, array.length - n))
            }
            ,
            _.rest = _.tail = _.drop = function(array, n, guard) {
                return slice.call(array, null == n || guard ? 1 : n)
            }
            ,
            _.compact = function(array) {
                return _.filter(array, _.identity)
            }
            ;
            var flatten = function(input, shallow, strict, startIndex) {
                for (var output = [], idx = 0, i = startIndex || 0, length = getLength(input); i < length; i++) {
                    var value = input[i];
                    if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                        shallow || (value = flatten(value, shallow, strict));
                        var j = 0
                          , len = value.length;
                        for (output.length += len; j < len; )
                            output[idx++] = value[j++]
                    } else
                        strict || (output[idx++] = value)
                }
                return output
            };
            _.flatten = function(array, shallow) {
                return flatten(array, shallow, !1)
            }
            ,
            _.without = function(array) {
                return _.difference(array, slice.call(arguments, 1))
            }
            ,
            _.uniq = _.unique = function(array, isSorted, iteratee, context) {
                _.isBoolean(isSorted) || (context = iteratee,
                iteratee = isSorted,
                isSorted = !1),
                null != iteratee && (iteratee = cb(iteratee, context));
                for (var result = [], seen = [], i = 0, length = getLength(array); i < length; i++) {
                    var value = array[i]
                      , computed = iteratee ? iteratee(value, i, array) : value;
                    isSorted ? (i && seen === computed || result.push(value),
                    seen = computed) : iteratee ? _.contains(seen, computed) || (seen.push(computed),
                    result.push(value)) : _.contains(result, value) || result.push(value)
                }
                return result
            }
            ,
            _.union = function() {
                return _.uniq(flatten(arguments, !0, !0))
            }
            ,
            _.intersection = function(array) {
                for (var result = [], argsLength = arguments.length, i = 0, length = getLength(array); i < length; i++) {
                    var item = array[i];
                    if (!_.contains(result, item)) {
                        for (var j = 1; j < argsLength && _.contains(arguments[j], item); j++)
                            ;
                        j === argsLength && result.push(item)
                    }
                }
                return result
            }
            ,
            _.difference = function(array) {
                var rest = flatten(arguments, !0, !0, 1);
                return _.filter(array, function(value) {
                    return !_.contains(rest, value)
                })
            }
            ,
            _.zip = function() {
                return _.unzip(arguments)
            }
            ,
            _.unzip = function(array) {
                for (var length = array && _.max(array, getLength).length || 0, result = Array(length), index = 0; index < length; index++)
                    result[index] = _.pluck(array, index);
                return result
            }
            ,
            _.object = function(list, values) {
                for (var result = {}, i = 0, length = getLength(list); i < length; i++)
                    values ? result[list[i]] = values[i] : result[list[i][0]] = list[i][1];
                return result
            }
            ,
            _.findIndex = createPredicateIndexFinder(1),
            _.findLastIndex = createPredicateIndexFinder(-1),
            _.sortedIndex = function(array, obj, iteratee, context) {
                iteratee = cb(iteratee, context, 1);
                for (var value = iteratee(obj), low = 0, high = getLength(array); low < high; ) {
                    var mid = Math.floor((low + high) / 2);
                    iteratee(array[mid]) < value ? low = mid + 1 : high = mid
                }
                return low
            }
            ,
            _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex),
            _.lastIndexOf = createIndexFinder(-1, _.findLastIndex),
            _.range = function(start, stop, step) {
                null == stop && (stop = start || 0,
                start = 0),
                step = step || 1;
                for (var length = Math.max(Math.ceil((stop - start) / step), 0), range = Array(length), idx = 0; idx < length; idx++,
                start += step)
                    range[idx] = start;
                return range
            }
            ;
            var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
                if (!(callingContext instanceof boundFunc))
                    return sourceFunc.apply(context, args);
                var self = baseCreate(sourceFunc.prototype)
                  , result = sourceFunc.apply(self, args);
                return _.isObject(result) ? result : self
            };
            _.bind = function(func, context) {
                if (nativeBind && func.bind === nativeBind)
                    return nativeBind.apply(func, slice.call(arguments, 1));
                if (!_.isFunction(func))
                    throw new TypeError("Bind must be called on a function");
                var args = slice.call(arguments, 2)
                  , bound = function() {
                    return executeBound(func, bound, context, this, args.concat(slice.call(arguments)))
                };
                return bound
            }
            ,
            _.partial = function(func) {
                var boundArgs = slice.call(arguments, 1)
                  , bound = function() {
                    for (var position = 0, length = boundArgs.length, args = Array(length), i = 0; i < length; i++)
                        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
                    for (; position < arguments.length; )
                        args.push(arguments[position++]);
                    return executeBound(func, bound, this, this, args)
                };
                return bound
            }
            ,
            _.bindAll = function(obj) {
                var i, key, length = arguments.length;
                if (length <= 1)
                    throw new Error("bindAll must be passed function names");
                for (i = 1; i < length; i++)
                    key = arguments[i],
                    obj[key] = _.bind(obj[key], obj);
                return obj
            }
            ,
            _.memoize = function(func, hasher) {
                var memoize = function(key) {
                    var cache = memoize.cache
                      , address = "" + (hasher ? hasher.apply(this, arguments) : key);
                    return _.has(cache, address) || (cache[address] = func.apply(this, arguments)),
                    cache[address]
                };
                return memoize.cache = {},
                memoize
            }
            ,
            _.delay = function(func, wait) {
                var args = slice.call(arguments, 2);
                return setTimeout(function() {
                    return func.apply(null, args)
                }, wait)
            }
            ,
            _.defer = _.partial(_.delay, _, 1),
            _.throttle = function(func, wait, options) {
                var context, args, result, timeout = null, previous = 0;
                options || (options = {});
                var later = function() {
                    previous = !1 === options.leading ? 0 : _.now(),
                    timeout = null,
                    result = func.apply(context, args),
                    timeout || (context = args = null)
                };
                return function() {
                    var now = _.now();
                    previous || !1 !== options.leading || (previous = now);
                    var remaining = wait - (now - previous);
                    return context = this,
                    args = arguments,
                    remaining <= 0 || remaining > wait ? (timeout && (clearTimeout(timeout),
                    timeout = null),
                    previous = now,
                    result = func.apply(context, args),
                    timeout || (context = args = null)) : timeout || !1 === options.trailing || (timeout = setTimeout(later, remaining)),
                    result
                }
            }
            ,
            _.debounce = function(func, wait, immediate) {
                var timeout, args, context, timestamp, result, later = function() {
                    var last = _.now() - timestamp;
                    last < wait && last >= 0 ? timeout = setTimeout(later, wait - last) : (timeout = null,
                    immediate || (result = func.apply(context, args),
                    timeout || (context = args = null)))
                };
                return function() {
                    context = this,
                    args = arguments,
                    timestamp = _.now();
                    var callNow = immediate && !timeout;
                    return timeout || (timeout = setTimeout(later, wait)),
                    callNow && (result = func.apply(context, args),
                    context = args = null),
                    result
                }
            }
            ,
            _.wrap = function(func, wrapper) {
                return _.partial(wrapper, func)
            }
            ,
            _.negate = function(predicate) {
                return function() {
                    return !predicate.apply(this, arguments)
                }
            }
            ,
            _.compose = function() {
                var args = arguments
                  , start = args.length - 1;
                return function() {
                    for (var i = start, result = args[start].apply(this, arguments); i--; )
                        result = args[i].call(this, result);
                    return result
                }
            }
            ,
            _.after = function(times, func) {
                return function() {
                    if (--times < 1)
                        return func.apply(this, arguments)
                }
            }
            ,
            _.before = function(times, func) {
                var memo;
                return function() {
                    return --times > 0 && (memo = func.apply(this, arguments)),
                    times <= 1 && (func = null),
                    memo
                }
            }
            ,
            _.once = _.partial(_.before, 2);
            var hasEnumBug = !{
                toString: null
            }.propertyIsEnumerable("toString")
              , nonEnumerableProps = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
            _.keys = function(obj) {
                if (!_.isObject(obj))
                    return [];
                if (nativeKeys)
                    return nativeKeys(obj);
                var keys = [];
                for (var key in obj)
                    _.has(obj, key) && keys.push(key);
                return hasEnumBug && collectNonEnumProps(obj, keys),
                keys
            }
            ,
            _.allKeys = function(obj) {
                if (!_.isObject(obj))
                    return [];
                var keys = [];
                for (var key in obj)
                    keys.push(key);
                return hasEnumBug && collectNonEnumProps(obj, keys),
                keys
            }
            ,
            _.values = function(obj) {
                for (var keys = _.keys(obj), length = keys.length, values = Array(length), i = 0; i < length; i++)
                    values[i] = obj[keys[i]];
                return values
            }
            ,
            _.mapObject = function(obj, iteratee, context) {
                iteratee = cb(iteratee, context);
                for (var currentKey, keys = _.keys(obj), length = keys.length, results = {}, index = 0; index < length; index++)
                    currentKey = keys[index],
                    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
                return results
            }
            ,
            _.pairs = function(obj) {
                for (var keys = _.keys(obj), length = keys.length, pairs = Array(length), i = 0; i < length; i++)
                    pairs[i] = [keys[i], obj[keys[i]]];
                return pairs
            }
            ,
            _.invert = function(obj) {
                for (var result = {}, keys = _.keys(obj), i = 0, length = keys.length; i < length; i++)
                    result[obj[keys[i]]] = keys[i];
                return result
            }
            ,
            _.functions = _.methods = function(obj) {
                var names = [];
                for (var key in obj)
                    _.isFunction(obj[key]) && names.push(key);
                return names.sort()
            }
            ,
            _.extend = createAssigner(_.allKeys),
            _.extendOwn = _.assign = createAssigner(_.keys),
            _.findKey = function(obj, predicate, context) {
                predicate = cb(predicate, context);
                for (var key, keys = _.keys(obj), i = 0, length = keys.length; i < length; i++)
                    if (key = keys[i],
                    predicate(obj[key], key, obj))
                        return key
            }
            ,
            _.pick = function(object, oiteratee, context) {
                var iteratee, keys, result = {}, obj = object;
                if (null == obj)
                    return result;
                _.isFunction(oiteratee) ? (keys = _.allKeys(obj),
                iteratee = optimizeCb(oiteratee, context)) : (keys = flatten(arguments, !1, !1, 1),
                iteratee = function(value, key, obj) {
                    return key in obj
                }
                ,
                obj = Object(obj));
                for (var i = 0, length = keys.length; i < length; i++) {
                    var key = keys[i]
                      , value = obj[key];
                    iteratee(value, key, obj) && (result[key] = value)
                }
                return result
            }
            ,
            _.omit = function(obj, iteratee, context) {
                if (_.isFunction(iteratee))
                    iteratee = _.negate(iteratee);
                else {
                    var keys = _.map(flatten(arguments, !1, !1, 1), String);
                    iteratee = function(value, key) {
                        return !_.contains(keys, key)
                    }
                }
                return _.pick(obj, iteratee, context)
            }
            ,
            _.defaults = createAssigner(_.allKeys, !0),
            _.create = function(prototype, props) {
                var result = baseCreate(prototype);
                return props && _.extendOwn(result, props),
                result
            }
            ,
            _.clone = function(obj) {
                return _.isObject(obj) ? _.isArray(obj) ? obj.slice() : _.extend({}, obj) : obj
            }
            ,
            _.tap = function(obj, interceptor) {
                return interceptor(obj),
                obj
            }
            ,
            _.isMatch = function(object, attrs) {
                var keys = _.keys(attrs)
                  , length = keys.length;
                if (null == object)
                    return !length;
                for (var obj = Object(object), i = 0; i < length; i++) {
                    var key = keys[i];
                    if (attrs[key] !== obj[key] || !(key in obj))
                        return !1
                }
                return !0
            }
            ;
            var eq = function(a, b, aStack, bStack) {
                if (a === b)
                    return 0 !== a || 1 / a == 1 / b;
                if (null == a || null == b)
                    return a === b;
                a instanceof _ && (a = a._wrapped),
                b instanceof _ && (b = b._wrapped);
                var className = toString.call(a);
                if (className !== toString.call(b))
                    return !1;
                switch (className) {
                case "[object RegExp]":
                case "[object String]":
                    return "" + a == "" + b;
                case "[object Number]":
                    return +a != +a ? +b != +b : 0 == +a ? 1 / +a == 1 / b : +a == +b;
                case "[object Date]":
                case "[object Boolean]":
                    return +a == +b
                }
                var areArrays = "[object Array]" === className;
                if (!areArrays) {
                    if ("object" != typeof a || "object" != typeof b)
                        return !1;
                    var aCtor = a.constructor
                      , bCtor = b.constructor;
                    if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor) && "constructor"in a && "constructor"in b)
                        return !1
                }
                aStack = aStack || [],
                bStack = bStack || [];
                for (var length = aStack.length; length--; )
                    if (aStack[length] === a)
                        return bStack[length] === b;
                if (aStack.push(a),
                bStack.push(b),
                areArrays) {
                    if ((length = a.length) !== b.length)
                        return !1;
                    for (; length--; )
                        if (!eq(a[length], b[length], aStack, bStack))
                            return !1
                } else {
                    var key, keys = _.keys(a);
                    if (length = keys.length,
                    _.keys(b).length !== length)
                        return !1;
                    for (; length--; )
                        if (key = keys[length],
                        !_.has(b, key) || !eq(a[key], b[key], aStack, bStack))
                            return !1
                }
                return aStack.pop(),
                bStack.pop(),
                !0
            };
            _.isEqual = function(a, b) {
                return eq(a, b)
            }
            ,
            _.isEmpty = function(obj) {
                return null == obj || (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) ? 0 === obj.length : 0 === _.keys(obj).length)
            }
            ,
            _.isElement = function(obj) {
                return !(!obj || 1 !== obj.nodeType)
            }
            ,
            _.isArray = nativeIsArray || function(obj) {
                return "[object Array]" === toString.call(obj)
            }
            ,
            _.isObject = function(obj) {
                var type = typeof obj;
                return "function" === type || "object" === type && !!obj
            }
            ,
            _.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(name) {
                _["is" + name] = function(obj) {
                    return toString.call(obj) === "[object " + name + "]"
                }
            }),
            _.isArguments(arguments) || (_.isArguments = function(obj) {
                return _.has(obj, "callee")
            }
            ),
            "function" != typeof /./ && "object" != typeof Int8Array && (_.isFunction = function(obj) {
                return "function" == typeof obj || !1
            }
            ),
            _.isFinite = function(obj) {
                return isFinite(obj) && !isNaN(parseFloat(obj))
            }
            ,
            _.isNaN = function(obj) {
                return _.isNumber(obj) && obj !== +obj
            }
            ,
            _.isBoolean = function(obj) {
                return !0 === obj || !1 === obj || "[object Boolean]" === toString.call(obj)
            }
            ,
            _.isNull = function(obj) {
                return null === obj
            }
            ,
            _.isUndefined = function(obj) {
                return void 0 === obj
            }
            ,
            _.has = function(obj, key) {
                return null != obj && hasOwnProperty.call(obj, key)
            }
            ,
            _.noConflict = function() {
                return root._ = previousUnderscore,
                this
            }
            ,
            _.identity = function(value) {
                return value
            }
            ,
            _.constant = function(value) {
                return function() {
                    return value
                }
            }
            ,
            _.noop = function() {}
            ,
            _.property = property,
            _.propertyOf = function(obj) {
                return null == obj ? function() {}
                : function(key) {
                    return obj[key]
                }
            }
            ,
            _.matcher = _.matches = function(attrs) {
                return attrs = _.extendOwn({}, attrs),
                function(obj) {
                    return _.isMatch(obj, attrs)
                }
            }
            ,
            _.times = function(n, iteratee, context) {
                var accum = Array(Math.max(0, n));
                iteratee = optimizeCb(iteratee, context, 1);
                for (var i = 0; i < n; i++)
                    accum[i] = iteratee(i);
                return accum
            }
            ,
            _.random = function(min, max) {
                return null == max && (max = min,
                min = 0),
                min + Math.floor(Math.random() * (max - min + 1))
            }
            ,
            _.now = Date.now || function() {
                return (new Date).getTime()
            }
            ;
            var escapeMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            }
              , unescapeMap = _.invert(escapeMap)
              , createEscaper = function(map) {
                var escaper = function(match) {
                    return map[match]
                }
                  , source = "(?:" + _.keys(map).join("|") + ")"
                  , testRegexp = RegExp(source)
                  , replaceRegexp = RegExp(source, "g");
                return function(string) {
                    return string = null == string ? "" : "" + string,
                    testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string
                }
            };
            _.escape = createEscaper(escapeMap),
            _.unescape = createEscaper(unescapeMap),
            _.result = function(object, property, fallback) {
                var value = null == object ? void 0 : object[property];
                return void 0 === value && (value = fallback),
                _.isFunction(value) ? value.call(object) : value
            }
            ;
            var idCounter = 0;
            _.uniqueId = function(prefix) {
                var id = ++idCounter + "";
                return prefix ? prefix + id : id
            }
            ,
            _.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var noMatch = /(.)^/
              , escapes = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\u2028": "u2028",
                "\u2029": "u2029"
            }
              , escaper = /\\|'|\r|\n|\u2028|\u2029/g
              , escapeChar = function(match) {
                return "\\" + escapes[match]
            };
            _.template = function(text, settings, oldSettings) {
                !settings && oldSettings && (settings = oldSettings),
                settings = _.defaults({}, settings, _.templateSettings);
                var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join("|") + "|$", "g")
                  , index = 0
                  , source = "__p+='";
                text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
                    return source += text.slice(index, offset).replace(escaper, escapeChar),
                    index = offset + match.length,
                    escape ? source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'" : interpolate ? source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'" : evaluate && (source += "';\n" + evaluate + "\n__p+='"),
                    match
                }),
                source += "';\n",
                settings.variable || (source = "with(obj||{}){\n" + source + "}\n"),
                source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
                try {
                    var render = new Function(settings.variable || "obj","_",source)
                } catch (e) {
                    throw e.source = source,
                    e
                }
                var template = function(data) {
                    return render.call(this, data, _)
                };
                return template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}",
                template
            }
            ,
            _.chain = function(obj) {
                var instance = _(obj);
                return instance._chain = !0,
                instance
            }
            ;
            var result = function(instance, obj) {
                return instance._chain ? _(obj).chain() : obj
            };
            _.mixin = function(obj) {
                _.each(_.functions(obj), function(name) {
                    var func = _[name] = obj[name];
                    _.prototype[name] = function() {
                        var args = [this._wrapped];
                        return push.apply(args, arguments),
                        result(this, func.apply(_, args))
                    }
                })
            }
            ,
            _.mixin(_),
            _.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
                var method = ArrayProto[name];
                _.prototype[name] = function() {
                    var obj = this._wrapped;
                    return method.apply(obj, arguments),
                    "shift" !== name && "splice" !== name || 0 !== obj.length || delete obj[0],
                    result(this, obj)
                }
            }),
            _.each(["concat", "join", "slice"], function(name) {
                var method = ArrayProto[name];
                _.prototype[name] = function() {
                    return result(this, method.apply(this._wrapped, arguments))
                }
            }),
            _.prototype.value = function() {
                return this._wrapped
            }
            ,
            _.prototype.valueOf = _.prototype.toJSON = _.prototype.value,
            _.prototype.toString = function() {
                return "" + this._wrapped
            }
            ,
            "function" == typeof define && define.amd && define("underscore", [], function() {
                return _
            })
        }
        ).call(this)
    }
    , {}]
}, {}, [2]);
