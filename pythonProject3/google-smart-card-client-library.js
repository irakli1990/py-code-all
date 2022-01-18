(function () {
    var b = b || {};
    b.scope = {};
    b.arrayIteratorImpl = function (a) {
        var c = 0;
        return function () {
            return c < a.length ? {done: !1, value: a[c++]} : {done: !0}
        }
    };
    b.arrayIterator = function (a) {
        return {next: b.arrayIteratorImpl(a)}
    };
    b.makeIterator = function (a) {
        var c = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
        return c ? c.call(a) : b.arrayIterator(a)
    };
    b.findInternal = function (a, c, d) {
        a instanceof String && (a = String(a));
        for (var f = a.length, g = 0; g < f; g++) {
            var h = a[g];
            if (c.call(d, h, g, a)) return {i: g, v: h}
        }
        return {i: -1, v: void 0}
    };
    b.ASSUME_ES5 = !1;
    b.ASSUME_NO_NATIVE_MAP = !1;
    b.ASSUME_NO_NATIVE_SET = !1;
    b.SIMPLE_FROUND_POLYFILL = !1;
    b.defineProperty = b.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, c, d) {
        a != Array.prototype && a != Object.prototype && (a[c] = d.value)
    };
    b.getGlobal = function (a) {
        return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
    };
    b.global = b.getGlobal(this);
    b.polyfill = function (a, c) {
        if (c) {
            var d = b.global;
            a = a.split(".");
            for (var f = 0; f < a.length - 1; f++) {
                var g = a[f];
                g in d || (d[g] = {});
                d = d[g]
            }
            a = a[a.length - 1];
            f = d[a];
            c = c(f);
            c != f && null != c && b.defineProperty(d, a, {configurable: !0, writable: !0, value: c})
        }
    };
    b.checkStringArgs = function (a, c, d) {
        if (null == a) throw new TypeError("The 'this' value for String.prototype." + d + " must not be null or undefined");
        if (c instanceof RegExp) throw new TypeError("First argument to String.prototype." + d + " must not be a regular expression");
        return a + ""
    };
    b.polyfill("String.prototype.repeat", function (a) {
        return a ? a : function (a) {
            var c = b.checkStringArgs(this, null, "repeat");
            if (0 > a || 1342177279 < a) throw new RangeError("Invalid count value");
            a |= 0;
            for (var f = ""; a;) if (a & 1 && (f += c), a >>>= 1) c += c;
            return f
        }
    }, "es6", "es3");
    b.checkEs6ConformanceViaProxy = function () {
        try {
            var a = {}, c = Object.create(new b.global.Proxy(a, {
                get: function (d, f, g) {
                    return d == a && "q" == f && g == c
                }
            }));
            return !0 === c.q
        } catch (d) {
            return !1
        }
    };
    b.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
    b.ES6_CONFORMANCE = b.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS && b.checkEs6ConformanceViaProxy();
    b.SYMBOL_PREFIX = "jscomp_symbol_";
    b.initSymbol = function () {
        b.initSymbol = function () {
        };
        b.global.Symbol || (b.global.Symbol = b.Symbol)
    };
    b.SymbolClass = function (a, c) {
        this.$jscomp$symbol$id_ = a;
        b.defineProperty(this, "description", {configurable: !0, writable: !0, value: c})
    };
    b.SymbolClass.prototype.toString = function () {
        return this.$jscomp$symbol$id_
    };
    b.Symbol = function () {
        function a(d) {
            if (this instanceof a) throw new TypeError("Symbol is not a constructor");
            return new b.SymbolClass(b.SYMBOL_PREFIX + (d || "") + "_" + c++, d)
        }

        var c = 0;
        return a
    }();
    b.initSymbolIterator = function () {
        b.initSymbol();
        var a = b.global.Symbol.iterator;
        a || (a = b.global.Symbol.iterator = b.global.Symbol("Symbol.iterator"));
        "function" != typeof Array.prototype[a] && b.defineProperty(Array.prototype, a, {
            configurable: !0,
            writable: !0,
            value: function () {
                return b.iteratorPrototype(b.arrayIteratorImpl(this))
            }
        });
        b.initSymbolIterator = function () {
        }
    };
    b.initSymbolAsyncIterator = function () {
        b.initSymbol();
        var a = b.global.Symbol.asyncIterator;
        a || (a = b.global.Symbol.asyncIterator = b.global.Symbol("Symbol.asyncIterator"));
        b.initSymbolAsyncIterator = function () {
        }
    };
    b.iteratorPrototype = function (a) {
        b.initSymbolIterator();
        a = {next: a};
        a[b.global.Symbol.iterator] = function () {
            return this
        };
        return a
    };
    b.owns = function (a, c) {
        return Object.prototype.hasOwnProperty.call(a, c)
    };
    b.polyfill("WeakMap", function (a) {
        function c(a) {
            this.id_ = (n += Math.random() + 1).toString();
            if (a) {
                a = b.makeIterator(a);
                for (var c; !(c = a.next()).done;) c = c.value, this.set(c[0], c[1])
            }
        }

        function d() {
            if (!a || !Object.seal) return !1;
            try {
                var c = Object.seal({}), d = Object.seal({}), f = new a([[c, 2], [d, 3]]);
                if (2 != f.get(c) || 3 != f.get(d)) return !1;
                f.delete(c);
                f.set(d, 4);
                return !f.has(c) && 4 == f.get(d)
            } catch (u) {
                return !1
            }
        }

        function f() {
        }

        function g(a) {
            var c = typeof a;
            return "object" === c && null !== a || "function" === c
        }

        function h(a) {
            if (!b.owns(a,
                m)) {
                var c = new f;
                b.defineProperty(a, m, {value: c})
            }
        }

        function l(a) {
            var c = Object[a];
            c && (Object[a] = function (a) {
                if (a instanceof f) return a;
                h(a);
                return c(a)
            })
        }

        if (b.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
            if (a && b.ES6_CONFORMANCE) return a
        } else if (d()) return a;
        var m = "$jscomp_hidden_" + Math.random();
        l("freeze");
        l("preventExtensions");
        l("seal");
        var n = 0;
        c.prototype.set = function (a, c) {
            if (!g(a)) throw Error("Invalid WeakMap key");
            h(a);
            if (!b.owns(a, m)) throw Error("WeakMap key fail: " + a);
            a[m][this.id_] = c;
            return this
        };
        c.prototype.get =
            function (a) {
                return g(a) && b.owns(a, m) ? a[m][this.id_] : void 0
            };
        c.prototype.has = function (a) {
            return g(a) && b.owns(a, m) && b.owns(a[m], this.id_)
        };
        c.prototype.delete = function (a) {
            return g(a) && b.owns(a, m) && b.owns(a[m], this.id_) ? delete a[m][this.id_] : !1
        };
        return c
    }, "es6", "es3");
    b.MapEntry = function () {
    };
    b.polyfill("Map", function (a) {
        function c() {
            var a = {};
            return a.previous = a.next = a.head = a
        }

        function d(a, c) {
            var d = a.head_;
            return b.iteratorPrototype(function () {
                if (d) {
                    for (; d.head != a.head_;) d = d.previous;
                    for (; d.next != d.head;) return d = d.next, {done: !1, value: c(d)};
                    d = null
                }
                return {done: !0, value: void 0}
            })
        }

        function f(a, c) {
            var d = c && typeof c;
            "object" == d || "function" == d ? l.has(c) ? d = l.get(c) : (d = "" + ++m, l.set(c, d)) : d = "p_" + c;
            var f = a.data_[d];
            if (f && b.owns(a.data_, d)) for (a = 0; a < f.length; a++) {
                var g = f[a];
                if (c !== c && g.key !== g.key ||
                    c === g.key) return {id: d, list: f, index: a, entry: g}
            }
            return {id: d, list: f, index: -1, entry: void 0}
        }

        function g(a) {
            this.data_ = {};
            this.head_ = c();
            this.size = 0;
            if (a) {
                a = b.makeIterator(a);
                for (var d; !(d = a.next()).done;) d = d.value, this.set(d[0], d[1])
            }
        }

        function h() {
            if (b.ASSUME_NO_NATIVE_MAP || !a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) return !1;
            try {
                var c = Object.seal({x: 4}), d = new a(b.makeIterator([[c, "s"]]));
                if ("s" != d.get(c) || 1 != d.size || d.get({x: 4}) || d.set({x: 4}, "t") != d || 2 != d.size) return !1;
                var f = d.entries(), g = f.next();
                if (g.done || g.value[0] != c || "s" != g.value[1]) return !1;
                g = f.next();
                return g.done || 4 != g.value[0].x || "t" != g.value[1] || !f.next().done ? !1 : !0
            } catch (u) {
                return !1
            }
        }

        if (b.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
            if (a && b.ES6_CONFORMANCE) return a
        } else if (h()) return a;
        b.initSymbolIterator();
        var l = new WeakMap;
        g.prototype.set = function (a, c) {
            a = 0 === a ? 0 : a;
            var d = f(this, a);
            d.list || (d.list = this.data_[d.id] = []);
            d.entry ? d.entry.value = c : (d.entry = {
                next: this.head_, previous: this.head_.previous, head: this.head_,
                key: a, value: c
            }, d.list.push(d.entry), this.head_.previous.next = d.entry, this.head_.previous = d.entry, this.size++);
            return this
        };
        g.prototype.delete = function (a) {
            a = f(this, a);
            return a.entry && a.list ? (a.list.splice(a.index, 1), a.list.length || delete this.data_[a.id], a.entry.previous.next = a.entry.next, a.entry.next.previous = a.entry.previous, a.entry.head = null, this.size--, !0) : !1
        };
        g.prototype.clear = function () {
            this.data_ = {};
            this.head_ = this.head_.previous = c();
            this.size = 0
        };
        g.prototype.has = function (a) {
            return !!f(this, a).entry
        };
        g.prototype.get = function (a) {
            return (a = f(this, a).entry) && a.value
        };
        g.prototype.entries = function () {
            return d(this, function (a) {
                return [a.key, a.value]
            })
        };
        g.prototype.keys = function () {
            return d(this, function (a) {
                return a.key
            })
        };
        g.prototype.values = function () {
            return d(this, function (a) {
                return a.value
            })
        };
        g.prototype.forEach = function (a, c) {
            for (var d = this.entries(), f; !(f = d.next()).done;) f = f.value, a.call(c, f[1], f[0], this)
        };
        g.prototype[Symbol.iterator] = g.prototype.entries;
        var m = 0;
        return g
    }, "es6", "es3");
    b.polyfill("Set", function (a) {
        function c(a) {
            this.map_ = new Map;
            if (a) {
                a = b.makeIterator(a);
                for (var c; !(c = a.next()).done;) this.add(c.value)
            }
            this.size = this.map_.size
        }

        function d() {
            if (b.ASSUME_NO_NATIVE_SET || !a || "function" != typeof a || !a.prototype.entries || "function" != typeof Object.seal) return !1;
            try {
                var c = Object.seal({x: 4}), d = new a(b.makeIterator([c]));
                if (!d.has(c) || 1 != d.size || d.add(c) != d || 1 != d.size || d.add({x: 4}) != d || 2 != d.size) return !1;
                var h = d.entries(), l = h.next();
                if (l.done || l.value[0] != c || l.value[1] != c) return !1;
                l = h.next();
                return l.done || l.value[0] == c || 4 != l.value[0].x || l.value[1] != l.value[0] ? !1 : h.next().done
            } catch (m) {
                return !1
            }
        }

        if (b.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS) {
            if (a && b.ES6_CONFORMANCE) return a
        } else if (d()) return a;
        b.initSymbolIterator();
        c.prototype.add = function (a) {
            a = 0 === a ? 0 : a;
            this.map_.set(a, a);
            this.size = this.map_.size;
            return this
        };
        c.prototype.delete = function (a) {
            a = this.map_.delete(a);
            this.size = this.map_.size;
            return a
        };
        c.prototype.clear = function () {
            this.map_.clear();
            this.size = 0
        };
        c.prototype.has = function (a) {
            return this.map_.has(a)
        };
        c.prototype.entries = function () {
            return this.map_.entries()
        };
        c.prototype.values = function () {
            return this.map_.values()
        };
        c.prototype.keys = c.prototype.values;
        c.prototype[Symbol.iterator] = c.prototype.values;
        c.prototype.forEach = function (a, c) {
            var d = this;
            this.map_.forEach(function (f) {
                return a.call(c, f, f, d)
            })
        };
        return c
    }, "es6", "es3");
    b.polyfill("Array.from", function (a) {
        return a ? a : function (a, d, f) {
            d = null != d ? d : function (a) {
                return a
            };
            var c = [], h = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
            if ("function" == typeof h) {
                a = h.call(a);
                for (var l = 0; !(h = a.next()).done;) c.push(d.call(f, h.value, l++))
            } else for (h = a.length, l = 0; l < h; l++) c.push(d.call(f, a[l], l));
            return c
        }
    }, "es6", "es3");
    b.iteratorFromArray = function (a, c) {
        b.initSymbolIterator();
        a instanceof String && (a += "");
        var d = 0, f = {
            next: function () {
                if (d < a.length) {
                    var g = d++;
                    return {value: c(g, a[g]), done: !1}
                }
                f.next = function () {
                    return {done: !0, value: void 0}
                };
                return f.next()
            }
        };
        f[Symbol.iterator] = function () {
            return f
        };
        return f
    };
    b.polyfill("Math.trunc", function (a) {
        return a ? a : function (a) {
            a = Number(a);
            if (isNaN(a) || Infinity === a || -Infinity === a || 0 === a) return a;
            var c = Math.floor(Math.abs(a));
            return 0 > a ? -c : c
        }
    }, "es6", "es3");
    b.FORCE_POLYFILL_PROMISE = !1;
    b.polyfill("Promise", function (a) {
        function c(a) {
            this.state_ = 0;
            this.result_ = void 0;
            this.onSettledCallbacks_ = [];
            var c = this.createResolveAndReject_();
            try {
                a(c.resolve, c.reject)
            } catch (n) {
                c.reject(n)
            }
        }

        function d() {
            this.batch_ = null
        }

        function f(a) {
            return a instanceof c ? a : new c(function (c) {
                c(a)
            })
        }

        if (a && !b.FORCE_POLYFILL_PROMISE) return a;
        d.prototype.asyncExecute = function (a) {
            if (null == this.batch_) {
                this.batch_ = [];
                var c = this;
                this.asyncExecuteFunction(function () {
                    c.executeBatch_()
                })
            }
            this.batch_.push(a)
        };
        var g = b.global.setTimeout;
        d.prototype.asyncExecuteFunction = function (a) {
            g(a, 0)
        };
        d.prototype.executeBatch_ = function () {
            for (; this.batch_ && this.batch_.length;) {
                var a = this.batch_;
                this.batch_ = [];
                for (var c = 0; c < a.length; ++c) {
                    var d = a[c];
                    a[c] = null;
                    try {
                        d()
                    } catch (p) {
                        this.asyncThrow_(p)
                    }
                }
            }
            this.batch_ = null
        };
        d.prototype.asyncThrow_ = function (a) {
            this.asyncExecuteFunction(function () {
                throw a;
            })
        };
        c.prototype.createResolveAndReject_ = function () {
            function a(a) {
                return function (f) {
                    d || (d = !0, a.call(c, f))
                }
            }

            var c = this, d = !1;
            return {
                resolve: a(this.resolveTo_),
                reject: a(this.reject_)
            }
        };
        c.prototype.resolveTo_ = function (a) {
            if (a === this) this.reject_(new TypeError("A Promise cannot resolve to itself")); else if (a instanceof c) this.settleSameAsPromise_(a); else {
                a:switch (typeof a) {
                    case "object":
                        var d = null != a;
                        break a;
                    case "function":
                        d = !0;
                        break a;
                    default:
                        d = !1
                }
                d ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a)
            }
        };
        c.prototype.resolveToNonPromiseObj_ = function (a) {
            var c = void 0;
            try {
                c = a.then
            } catch (n) {
                this.reject_(n);
                return
            }
            "function" == typeof c ? this.settleSameAsThenable_(c,
                a) : this.fulfill_(a)
        };
        c.prototype.reject_ = function (a) {
            this.settle_(2, a)
        };
        c.prototype.fulfill_ = function (a) {
            this.settle_(1, a)
        };
        c.prototype.settle_ = function (a, c) {
            if (0 != this.state_) throw Error("Cannot settle(" + a + ", " + c + "): Promise already settled in state" + this.state_);
            this.state_ = a;
            this.result_ = c;
            this.executeOnSettledCallbacks_()
        };
        c.prototype.executeOnSettledCallbacks_ = function () {
            if (null != this.onSettledCallbacks_) {
                for (var a = 0; a < this.onSettledCallbacks_.length; ++a) h.asyncExecute(this.onSettledCallbacks_[a]);
                this.onSettledCallbacks_ = null
            }
        };
        var h = new d;
        c.prototype.settleSameAsPromise_ = function (a) {
            var c = this.createResolveAndReject_();
            a.callWhenSettled_(c.resolve, c.reject)
        };
        c.prototype.settleSameAsThenable_ = function (a, c) {
            var d = this.createResolveAndReject_();
            try {
                a.call(c, d.resolve, d.reject)
            } catch (p) {
                d.reject(p)
            }
        };
        c.prototype.then = function (a, d) {
            function f(a, c) {
                return "function" == typeof a ? function (c) {
                    try {
                        g(a(c))
                    } catch (v) {
                        h(v)
                    }
                } : c
            }

            var g, h, l = new c(function (a, c) {
                g = a;
                h = c
            });
            this.callWhenSettled_(f(a, g), f(d, h));
            return l
        };
        c.prototype.catch = function (a) {
            return this.then(void 0, a)
        };
        c.prototype.callWhenSettled_ = function (a, c) {
            function d() {
                switch (f.state_) {
                    case 1:
                        a(f.result_);
                        break;
                    case 2:
                        c(f.result_);
                        break;
                    default:
                        throw Error("Unexpected state: " + f.state_);
                }
            }

            var f = this;
            null == this.onSettledCallbacks_ ? h.asyncExecute(d) : this.onSettledCallbacks_.push(d)
        };
        c.resolve = f;
        c.reject = function (a) {
            return new c(function (c, d) {
                d(a)
            })
        };
        c.race = function (a) {
            return new c(function (c, d) {
                for (var g = b.makeIterator(a), h = g.next(); !h.done; h = g.next()) f(h.value).callWhenSettled_(c,
                    d)
            })
        };
        c.all = function (a) {
            var d = b.makeIterator(a), g = d.next();
            return g.done ? f([]) : new c(function (a, c) {
                function h(c) {
                    return function (d) {
                        l[c] = d;
                        m--;
                        0 == m && a(l)
                    }
                }

                var l = [], m = 0;
                do l.push(void 0), m++, f(g.value).callWhenSettled_(h(l.length - 1), c), g = d.next(); while (!g.done)
            })
        };
        return c
    }, "es6", "es3");
    b.polyfill("Number.isFinite", function (a) {
        return a ? a : function (a) {
            return "number" !== typeof a ? !1 : !isNaN(a) && Infinity !== a && -Infinity !== a
        }
    }, "es6", "es3");
    b.polyfill("Number.isInteger", function (a) {
        return a ? a : function (a) {
            return Number.isFinite(a) ? a === Math.floor(a) : !1
        }
    }, "es6", "es3");
    var e = e || {};
    e.global = this || self;
    e.isDef = function (a) {
        return void 0 !== a
    };
    e.isString = function (a) {
        return "string" == typeof a
    };
    e.isBoolean = function (a) {
        return "boolean" == typeof a
    };
    e.isNumber = function (a) {
        return "number" == typeof a
    };
    e.exportPath_ = function (a, c, d) {
        a = a.split(".");
        d = d || e.global;
        a[0] in d || "undefined" == typeof d.execScript || d.execScript("var " + a[0]);
        for (var f; a.length && (f = a.shift());) a.length || void 0 === c ? d = d[f] && d[f] !== Object.prototype[f] ? d[f] : d[f] = {} : d[f] = c
    };
    e.define = function (a, c) {
        return c
    };
    e.FEATURESET_YEAR = 2012;
    e.DEBUG = !1;
    e.LOCALE = "en";
    e.TRUSTED_SITE = !0;
    e.STRICT_MODE_COMPATIBLE = !1;
    e.DISALLOW_TEST_ONLY_CODE = !0;
    e.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !0;
    e.provide = function (a) {
        if (e.isInModuleLoader_()) throw Error("goog.provide cannot be used within a module.");
        e.constructNamespace_(a)
    };
    e.constructNamespace_ = function (a, c) {
        e.exportPath_(a, c)
    };
    e.getScriptNonce = function (a) {
        if (a && a != e.global) return e.getScriptNonce_(a.document);
        null === e.cspNonce_ && (e.cspNonce_ = e.getScriptNonce_(e.global.document));
        return e.cspNonce_
    };
    e.NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;
    e.cspNonce_ = null;
    e.getScriptNonce_ = function (a) {
        return (a = a.querySelector && a.querySelector("script[nonce]")) && (a = a.nonce || a.getAttribute("nonce")) && e.NONCE_PATTERN_.test(a) ? a : ""
    };
    e.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
    e.module = function (a) {
        if ("string" !== typeof a || !a || -1 == a.search(e.VALID_MODULE_RE_)) throw Error("Invalid module identifier");
        if (!e.isInGoogModuleLoader_()) throw Error("Module " + a + " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
        if (e.moduleLoaderState_.moduleName) throw Error("goog.module may only be called once per module.");
        e.moduleLoaderState_.moduleName = a
    };
    e.module.get = function (a) {
        return e.module.getInternal_(a)
    };
    e.module.getInternal_ = function () {
        return null
    };
    e.ModuleType = {ES6: "es6", GOOG: "goog"};
    e.moduleLoaderState_ = null;
    e.isInModuleLoader_ = function () {
        return e.isInGoogModuleLoader_() || e.isInEs6ModuleLoader_()
    };
    e.isInGoogModuleLoader_ = function () {
        return !!e.moduleLoaderState_ && e.moduleLoaderState_.type == e.ModuleType.GOOG
    };
    e.isInEs6ModuleLoader_ = function () {
        if (e.moduleLoaderState_ && e.moduleLoaderState_.type == e.ModuleType.ES6) return !0;
        var a = e.global.$jscomp;
        return a ? "function" != typeof a.getCurrentModulePath ? !1 : !!a.getCurrentModulePath() : !1
    };
    e.module.declareLegacyNamespace = function () {
        e.moduleLoaderState_.declareLegacyNamespace = !0
    };
    e.declareModuleId = function (a) {
        if (e.moduleLoaderState_) e.moduleLoaderState_.moduleName = a; else {
            var c = e.global.$jscomp;
            if (!c || "function" != typeof c.getCurrentModulePath) throw Error('Module with namespace "' + a + '" has been loaded incorrectly.');
            c = c.require(c.getCurrentModulePath());
            e.loadedModules_[a] = {exports: c, type: e.ModuleType.ES6, moduleId: a}
        }
    };
    e.setTestOnly = function (a) {
        if (e.DISALLOW_TEST_ONLY_CODE) throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
    };
    e.forwardDeclare = function () {
    };
    e.getObjectByName = function (a, c) {
        a = a.split(".");
        c = c || e.global;
        for (var d = 0; d < a.length; d++) if (c = c[a[d]], null == c) return null;
        return c
    };
    e.globalize = function (a, c) {
        c = c || e.global;
        for (var d in a) c[d] = a[d]
    };
    e.addDependency = function () {
    };
    e.ENABLE_DEBUG_LOADER = !1;
    e.logToConsole_ = function (a) {
        e.global.console && e.global.console.error(a)
    };
    e.require = function () {
    };
    e.requireType = function () {
        return {}
    };
    e.basePath = "";
    e.nullFunction = function () {
    };
    e.abstractMethod = function () {
        throw Error("unimplemented abstract method");
    };
    e.addSingletonGetter = function (a) {
        a.instance_ = void 0;
        a.getInstance = function () {
            if (a.instance_) return a.instance_;
            e.DEBUG && (e.instantiatedSingletons_[e.instantiatedSingletons_.length] = a);
            return a.instance_ = new a
        }
    };
    e.instantiatedSingletons_ = [];
    e.LOAD_MODULE_USING_EVAL = !1;
    e.SEAL_MODULE_EXPORTS = e.DEBUG;
    e.loadedModules_ = {};
    e.DEPENDENCIES_ENABLED = !1;
    e.TRANSPILE = "detect";
    e.ASSUME_ES_MODULES_TRANSPILED = !1;
    e.TRANSPILE_TO_LANGUAGE = "";
    e.TRANSPILER = "transpile.js";
    e.hasBadLetScoping = null;
    e.useSafari10Workaround = function () {
        if (null == e.hasBadLetScoping) {
            try {
                var a = !eval('"use strict";let x = 1; function f() { return typeof x; };f() == "number";')
            } catch (c) {
                a = !1
            }
            e.hasBadLetScoping = a
        }
        return e.hasBadLetScoping
    };
    e.workaroundSafari10EvalBug = function (a) {
        return "(function(){" + a + "\n;})();\n"
    };
    e.loadModule = function (a) {
        var c = e.moduleLoaderState_;
        try {
            e.moduleLoaderState_ = {moduleName: "", declareLegacyNamespace: !1, type: e.ModuleType.GOOG};
            if (e.isFunction(a)) var d = a.call(void 0, {}); else if ("string" === typeof a) e.useSafari10Workaround() && (a = e.workaroundSafari10EvalBug(a)), d = e.loadModuleFromSource_.call(void 0, a); else throw Error("Invalid module definition");
            var f = e.moduleLoaderState_.moduleName;
            if ("string" === typeof f && f) e.moduleLoaderState_.declareLegacyNamespace ? e.constructNamespace_(f, d) : e.SEAL_MODULE_EXPORTS &&
                Object.seal && "object" == typeof d && null != d && Object.seal(d), e.loadedModules_[f] = {
                exports: d,
                type: e.ModuleType.GOOG,
                moduleId: e.moduleLoaderState_.moduleName
            }; else throw Error('Invalid module name "' + f + '"');
        } finally {
            e.moduleLoaderState_ = c
        }
    };
    e.loadModuleFromSource_ = function (a) {
        eval(a);
        return {}
    };
    e.normalizePath_ = function (a) {
        a = a.split("/");
        for (var c = 0; c < a.length;) "." == a[c] ? a.splice(c, 1) : c && ".." == a[c] && a[c - 1] && ".." != a[c - 1] ? a.splice(--c, 2) : c++;
        return a.join("/")
    };
    e.loadFileSync_ = function (a) {
        if (e.global.CLOSURE_LOAD_FILE_SYNC) return e.global.CLOSURE_LOAD_FILE_SYNC(a);
        try {
            var c = new e.global.XMLHttpRequest;
            c.open("get", a, !1);
            c.send();
            return 0 == c.status || 200 == c.status ? c.responseText : null
        } catch (d) {
            return null
        }
    };
    e.transpile_ = function (a, c, d) {
        var f = e.global.$jscomp;
        f || (e.global.$jscomp = f = {});
        var g = f.transpile;
        if (!g) {
            var h = e.basePath + e.TRANSPILER, l = e.loadFileSync_(h);
            if (l) {
                (function () {
                    (0, eval)(l + "\n//# sourceURL=" + h)
                }).call(e.global);
                if (e.global.$gwtExport && e.global.$gwtExport.$jscomp && !e.global.$gwtExport.$jscomp.transpile) throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: ' + JSON.stringify(e.global.$gwtExport));
                e.global.$jscomp.transpile = e.global.$gwtExport.$jscomp.transpile;
                f = e.global.$jscomp;
                g = f.transpile
            }
        }
        g || (g = f.transpile = function (a, c) {
            e.logToConsole_(c + " requires transpilation but no transpiler was found.");
            return a
        });
        return g(a, c, d)
    };
    e.typeOf = function (a) {
        var c = typeof a;
        if ("object" == c) if (a) {
            if (a instanceof Array) return "array";
            if (a instanceof Object) return c;
            var d = Object.prototype.toString.call(a);
            if ("[object Window]" == d) return "object";
            if ("[object Array]" == d || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
            if ("[object Function]" == d || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
        } else return "null";
        else if ("function" == c && "undefined" == typeof a.call) return "object";
        return c
    };
    e.isNull = function (a) {
        return null === a
    };
    e.isDefAndNotNull = function (a) {
        return null != a
    };
    e.isArray = function (a) {
        return "array" == e.typeOf(a)
    };
    e.isArrayLike = function (a) {
        var c = e.typeOf(a);
        return "array" == c || "object" == c && "number" == typeof a.length
    };
    e.isDateLike = function (a) {
        return e.isObject(a) && "function" == typeof a.getFullYear
    };
    e.isFunction = function (a) {
        return "function" == e.typeOf(a)
    };
    e.isObject = function (a) {
        var c = typeof a;
        return "object" == c && null != a || "function" == c
    };
    e.getUid = function (a) {
        return a[e.UID_PROPERTY_] || (a[e.UID_PROPERTY_] = ++e.uidCounter_)
    };
    e.hasUid = function (a) {
        return !!a[e.UID_PROPERTY_]
    };
    e.removeUid = function (a) {
        null !== a && "removeAttribute" in a && a.removeAttribute(e.UID_PROPERTY_);
        try {
            delete a[e.UID_PROPERTY_]
        } catch (c) {
        }
    };
    e.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
    e.uidCounter_ = 0;
    e.getHashCode = e.getUid;
    e.removeHashCode = e.removeUid;
    e.cloneObject = function (a) {
        var c = e.typeOf(a);
        if ("object" == c || "array" == c) {
            if ("function" === typeof a.clone) return a.clone();
            c = "array" == c ? [] : {};
            for (var d in a) c[d] = e.cloneObject(a[d]);
            return c
        }
        return a
    };
    e.bindNative_ = function (a, c, d) {
        return a.call.apply(a.bind, arguments)
    };
    e.bindJs_ = function (a, c, d) {
        if (!a) throw Error();
        if (2 < arguments.length) {
            var f = Array.prototype.slice.call(arguments, 2);
            return function () {
                var d = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(d, f);
                return a.apply(c, d)
            }
        }
        return function () {
            return a.apply(c, arguments)
        }
    };
    e.bind = function (a, c, d) {
        Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? e.bind = e.bindNative_ : e.bind = e.bindJs_;
        return e.bind.apply(null, arguments)
    };
    e.partial = function (a, c) {
        var d = Array.prototype.slice.call(arguments, 1);
        return function () {
            var c = d.slice();
            c.push.apply(c, arguments);
            return a.apply(this, c)
        }
    };
    e.mixin = function (a, c) {
        for (var d in c) a[d] = c[d]
    };
    e.now = e.TRUSTED_SITE && Date.now || function () {
        return +new Date
    };
    e.globalEval = function (a) {
        if (e.global.execScript) e.global.execScript(a, "JavaScript"); else if (e.global.eval) {
            if (null == e.evalWorksForGlobals_) {
                try {
                    e.global.eval("var _evalTest_ = 1;")
                } catch (f) {
                }
                if ("undefined" != typeof e.global._evalTest_) {
                    try {
                        delete e.global._evalTest_
                    } catch (f) {
                    }
                    e.evalWorksForGlobals_ = !0
                } else e.evalWorksForGlobals_ = !1
            }
            if (e.evalWorksForGlobals_) e.global.eval(a); else {
                var c = e.global.document, d = c.createElement("script");
                d.type = "text/javascript";
                d.defer = !1;
                d.appendChild(c.createTextNode(a));
                c.head.appendChild(d);
                c.head.removeChild(d)
            }
        } else throw Error("goog.globalEval not available");
    };
    e.evalWorksForGlobals_ = null;
    e.getCssName = function (a, c) {
        function d(a) {
            a = a.split("-");
            for (var c = [], d = 0; d < a.length; d++) c.push(f(a[d]));
            return c.join("-")
        }

        function f(a) {
            return e.cssNameMapping_[a] || a
        }

        if ("." == String(a).charAt(0)) throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + a);
        var g = e.cssNameMapping_ ? "BY_WHOLE" == e.cssNameMappingStyle_ ? f : d : function (a) {
            return a
        };
        a = c ? a + "-" + g(c) : g(a);
        return e.global.CLOSURE_CSS_NAME_MAP_FN ? e.global.CLOSURE_CSS_NAME_MAP_FN(a) : a
    };
    e.setCssNameMapping = function (a, c) {
        e.cssNameMapping_ = a;
        e.cssNameMappingStyle_ = c
    };
    e.getMsg = function (a, c, d) {
        d && d.html && (a = a.replace(/</g, "&lt;"));
        c && (a = a.replace(/\{\$([^}]+)}/g, function (a, d) {
            return null != c && d in c ? c[d] : a
        }));
        return a
    };
    e.getMsgWithFallback = function (a) {
        return a
    };
    e.exportSymbol = function (a, c, d) {
        e.exportPath_(a, c, d)
    };
    e.exportProperty = function (a, c, d) {
        a[c] = d
    };
    e.inherits = function (a, c) {
        function d() {
        }

        d.prototype = c.prototype;
        a.superClass_ = c.prototype;
        a.prototype = new d;
        a.prototype.constructor = a;
        a.base = function (a, d, h) {
            for (var f = Array(arguments.length - 2), g = 2; g < arguments.length; g++) f[g - 2] = arguments[g];
            return c.prototype[d].apply(a, f)
        }
    };
    e.base = function (a, c, d) {
        var f = arguments.callee.caller;
        if (e.STRICT_MODE_COMPATIBLE || e.DEBUG && !f) throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
        if ("undefined" !== typeof f.superClass_) {
            for (var g = Array(arguments.length - 1), h = 1; h < arguments.length; h++) g[h - 1] = arguments[h];
            return f.superClass_.constructor.apply(a, g)
        }
        if ("string" != typeof c && "symbol" != typeof c) throw Error("method names provided to goog.base must be a string or a symbol");
        g = Array(arguments.length - 2);
        for (h = 2; h < arguments.length; h++) g[h - 2] = arguments[h];
        h = !1;
        for (var l = a.constructor.prototype; l; l = Object.getPrototypeOf(l)) if (l[c] === f) h = !0; else if (h) return l[c].apply(a, g);
        if (a[c] === f) return a.constructor.prototype[c].apply(a, g);
        throw Error("goog.base called from a method of one name to a method of a different name");
    };
    e.scope = function (a) {
        if (e.isInModuleLoader_()) throw Error("goog.scope is not supported within a module.");
        a.call(e.global)
    };
    e.defineClass = function (a, c) {
        var d = c.constructor, f = c.statics;
        d && d != Object.prototype.constructor || (d = function () {
            throw Error("cannot instantiate an interface (no constructor defined).");
        });
        d = e.defineClass.createSealingConstructor_(d, a);
        a && e.inherits(d, a);
        delete c.constructor;
        delete c.statics;
        e.defineClass.applyProperties_(d.prototype, c);
        null != f && (f instanceof Function ? f(d) : e.defineClass.applyProperties_(d, f));
        return d
    };
    e.defineClass.SEAL_CLASS_INSTANCES = e.DEBUG;
    e.defineClass.createSealingConstructor_ = function (a, c) {
        function d() {
            var c = a.apply(this, arguments) || this;
            c[e.UID_PROPERTY_] = c[e.UID_PROPERTY_];
            this.constructor === d && f && Object.seal instanceof Function && Object.seal(c);
            return c
        }

        if (!e.defineClass.SEAL_CLASS_INSTANCES) return a;
        var f = !e.defineClass.isUnsealable_(c);
        return d
    };
    e.defineClass.isUnsealable_ = function (a) {
        return a && a.prototype && a.prototype[e.UNSEALABLE_CONSTRUCTOR_PROPERTY_]
    };
    e.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
    e.defineClass.applyProperties_ = function (a, c) {
        for (var d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
        for (var f = 0; f < e.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; f++) d = e.defineClass.OBJECT_PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
    };
    e.tagUnsealableClass = function () {
    };
    e.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
    e.TRUSTED_TYPES_POLICY_NAME = "";
    e.identity_ = function (a) {
        return a
    };
    e.createTrustedTypesPolicy = function (a) {
        var c = null, d = e.global.trustedTypes || e.global.TrustedTypes;
        if (!d || !d.createPolicy) return c;
        try {
            c = d.createPolicy(a, {
                createHTML: e.identity_,
                createScript: e.identity_,
                createScriptURL: e.identity_,
                createURL: e.identity_
            })
        } catch (f) {
            e.logToConsole_(f.message)
        }
        return c
    };
    e.TRUSTED_TYPES_POLICY_ = e.TRUSTED_TYPES_POLICY_NAME ? e.createTrustedTypesPolicy(e.TRUSTED_TYPES_POLICY_NAME + "#base") : null;
    e.disposable = {};
    e.disposable.IDisposable = function () {
    };
    e.disposable.IDisposable.prototype.dispose = e.abstractMethod;
    e.disposable.IDisposable.prototype.isDisposed = e.abstractMethod;
    e.Disposable = function () {
        e.Disposable.MONITORING_MODE != e.Disposable.MonitoringMode.OFF && (e.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), e.Disposable.instances_[e.getUid(this)] = this);
        this.disposed_ = this.disposed_;
        this.onDisposeCallbacks_ = this.onDisposeCallbacks_
    };
    e.Disposable.MonitoringMode = {OFF: 0, PERMANENT: 1, INTERACTIVE: 2};
    e.Disposable.MONITORING_MODE = 0;
    e.Disposable.INCLUDE_STACK_ON_CREATION = !0;
    e.Disposable.instances_ = {};
    e.Disposable.getUndisposedObjects = function () {
        var a = [], c;
        for (c in e.Disposable.instances_) e.Disposable.instances_.hasOwnProperty(c) && a.push(e.Disposable.instances_[Number(c)]);
        return a
    };
    e.Disposable.clearUndisposedObjects = function () {
        e.Disposable.instances_ = {}
    };
    e.Disposable.prototype.disposed_ = !1;
    e.Disposable.prototype.isDisposed = function () {
        return this.disposed_
    };
    e.Disposable.prototype.getDisposed = e.Disposable.prototype.isDisposed;
    e.Disposable.prototype.dispose = function () {
        if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), e.Disposable.MONITORING_MODE != e.Disposable.MonitoringMode.OFF)) {
            var a = e.getUid(this);
            if (e.Disposable.MONITORING_MODE == e.Disposable.MonitoringMode.PERMANENT && !e.Disposable.instances_.hasOwnProperty(a)) throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
            if (e.Disposable.MONITORING_MODE != e.Disposable.MonitoringMode.OFF && this.onDisposeCallbacks_ &&
                0 < this.onDisposeCallbacks_.length) throw Error(this + " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method.");
            delete e.Disposable.instances_[a]
        }
    };
    e.Disposable.prototype.registerDisposable = function (a) {
        this.addOnDisposeCallback(e.partial(e.dispose, a))
    };
    e.Disposable.prototype.addOnDisposeCallback = function (a, c) {
        this.disposed_ ? void 0 !== c ? a.call(c) : a() : (this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []), this.onDisposeCallbacks_.push(void 0 !== c ? e.bind(a, c) : a))
    };
    e.Disposable.prototype.disposeInternal = function () {
        if (this.onDisposeCallbacks_) for (; this.onDisposeCallbacks_.length;) this.onDisposeCallbacks_.shift()()
    };
    e.Disposable.isDisposed = function (a) {
        return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1
    };
    e.dispose = function (a) {
        a && "function" == typeof a.dispose && a.dispose()
    };
    e.disposeAll = function (a) {
        for (var c = 0, d = arguments.length; c < d; ++c) {
            var f = arguments[c];
            e.isArrayLike(f) ? e.disposeAll.apply(null, f) : e.dispose(f)
        }
    };
    e.debug = {};
    e.debug.Error = function (a) {
        if (Error.captureStackTrace) Error.captureStackTrace(this, e.debug.Error); else {
            var c = Error().stack;
            c && (this.stack = c)
        }
        a && (this.message = String(a));
        this.reportErrorToServer = !0
    };
    e.inherits(e.debug.Error, Error);
    e.debug.Error.prototype.name = "CustomError";
    e.dom = {};
    e.dom.NodeType = {
        ELEMENT: 1,
        ATTRIBUTE: 2,
        TEXT: 3,
        CDATA_SECTION: 4,
        ENTITY_REFERENCE: 5,
        ENTITY: 6,
        PROCESSING_INSTRUCTION: 7,
        COMMENT: 8,
        DOCUMENT: 9,
        DOCUMENT_TYPE: 10,
        DOCUMENT_FRAGMENT: 11,
        NOTATION: 12
    };
    e.asserts = {};
    e.asserts.ENABLE_ASSERTS = !0;
    e.asserts.AssertionError = function (a, c) {
        e.debug.Error.call(this, e.asserts.subs_(a, c));
        this.messagePattern = a
    };
    e.inherits(e.asserts.AssertionError, e.debug.Error);
    e.asserts.AssertionError.prototype.name = "AssertionError";
    e.asserts.DEFAULT_ERROR_HANDLER = function (a) {
        throw a;
    };
    e.asserts.errorHandler_ = e.asserts.DEFAULT_ERROR_HANDLER;
    e.asserts.subs_ = function (a, c) {
        a = a.split("%s");
        for (var d = "", f = a.length - 1, g = 0; g < f; g++) d += a[g] + (g < c.length ? c[g] : "%s");
        return d + a[f]
    };
    e.asserts.doAssertFailure_ = function (a, c, d, f) {
        var g = "Assertion failed";
        if (d) {
            g += ": " + d;
            var h = f
        } else a && (g += ": " + a, h = c);
        a = new e.asserts.AssertionError("" + g, h || []);
        e.asserts.errorHandler_(a)
    };
    e.asserts.setErrorHandler = function (a) {
        e.asserts.ENABLE_ASSERTS && (e.asserts.errorHandler_ = a)
    };
    e.asserts.assert = function (a, c, d) {
        e.asserts.ENABLE_ASSERTS && !a && e.asserts.doAssertFailure_("", null, c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertExists = function (a, c, d) {
        e.asserts.ENABLE_ASSERTS && null == a && e.asserts.doAssertFailure_("Expected to exist: %s.", [a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.fail = function (a, c) {
        e.asserts.ENABLE_ASSERTS && e.asserts.errorHandler_(new e.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)))
    };
    e.asserts.assertNumber = function (a, c, d) {
        e.asserts.ENABLE_ASSERTS && "number" !== typeof a && e.asserts.doAssertFailure_("Expected number but got %s: %s.", [e.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertString = function (a, c, d) {
        e.asserts.ENABLE_ASSERTS && "string" !== typeof a && e.asserts.doAssertFailure_("Expected string but got %s: %s.", [e.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertFunction = function (a, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isFunction(a) && e.asserts.doAssertFailure_("Expected function but got %s: %s.", [e.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertObject = function (a, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isObject(a) && e.asserts.doAssertFailure_("Expected object but got %s: %s.", [e.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertArray = function (a, c, d) {
        e.asserts.ENABLE_ASSERTS && !e.isArray(a) && e.asserts.doAssertFailure_("Expected array but got %s: %s.", [e.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertBoolean = function (a, c, d) {
        e.asserts.ENABLE_ASSERTS && "boolean" !== typeof a && e.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [e.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertElement = function (a, c, d) {
        !e.asserts.ENABLE_ASSERTS || e.isObject(a) && a.nodeType == e.dom.NodeType.ELEMENT || e.asserts.doAssertFailure_("Expected Element but got %s: %s.", [e.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertInstanceof = function (a, c, d, f) {
        !e.asserts.ENABLE_ASSERTS || a instanceof c || e.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [e.asserts.getType_(c), e.asserts.getType_(a)], d, Array.prototype.slice.call(arguments, 3));
        return a
    };
    e.asserts.assertFinite = function (a, c, d) {
        !e.asserts.ENABLE_ASSERTS || "number" == typeof a && isFinite(a) || e.asserts.doAssertFailure_("Expected %s to be a finite number but it is not.", [a], c, Array.prototype.slice.call(arguments, 2));
        return a
    };
    e.asserts.assertObjectPrototypeIsIntact = function () {
        for (var a in Object.prototype) e.asserts.fail(a + " should not be enumerable in Object.prototype.")
    };
    e.asserts.getType_ = function (a) {
        return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a
    };
    e.array = {};
    e.NATIVE_ARRAY_PROTOTYPES = e.TRUSTED_SITE;
    e.array.ASSUME_NATIVE_FUNCTIONS = 2012 < e.FEATURESET_YEAR;
    e.array.peek = function (a) {
        return a[a.length - 1]
    };
    e.array.last = e.array.peek;
    e.array.indexOf = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function (a, c, d) {
        e.asserts.assert(null != a.length);
        return Array.prototype.indexOf.call(a, c, d)
    } : function (a, c, d) {
        d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
        if ("string" === typeof a) return "string" !== typeof c || 1 != c.length ? -1 : a.indexOf(c, d);
        for (; d < a.length; d++) if (d in a && a[d] === c) return d;
        return -1
    };
    e.array.lastIndexOf = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function (a, c, d) {
        e.asserts.assert(null != a.length);
        return Array.prototype.lastIndexOf.call(a, c, null == d ? a.length - 1 : d)
    } : function (a, c, d) {
        d = null == d ? a.length - 1 : d;
        0 > d && (d = Math.max(0, a.length + d));
        if ("string" === typeof a) return "string" !== typeof c || 1 != c.length ? -1 : a.lastIndexOf(c, d);
        for (; 0 <= d; d--) if (d in a && a[d] === c) return d;
        return -1
    };
    e.array.forEach = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function (a, c, d) {
        e.asserts.assert(null != a.length);
        Array.prototype.forEach.call(a, c, d)
    } : function (a, c, d) {
        for (var f = a.length, g = "string" === typeof a ? a.split("") : a, h = 0; h < f; h++) h in g && c.call(d, g[h], h, a)
    };
    e.array.forEachRight = function (a, c, d) {
        var f = a.length, g = "string" === typeof a ? a.split("") : a;
        for (--f; 0 <= f; --f) f in g && c.call(d, g[f], f, a)
    };
    e.array.filter = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function (a, c, d) {
        e.asserts.assert(null != a.length);
        return Array.prototype.filter.call(a, c, d)
    } : function (a, c, d) {
        for (var f = a.length, g = [], h = 0, l = "string" === typeof a ? a.split("") : a, m = 0; m < f; m++) if (m in l) {
            var n = l[m];
            c.call(d, n, m, a) && (g[h++] = n)
        }
        return g
    };
    e.array.map = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function (a, c, d) {
        e.asserts.assert(null != a.length);
        return Array.prototype.map.call(a, c, d)
    } : function (a, c, d) {
        for (var f = a.length, g = Array(f), h = "string" === typeof a ? a.split("") : a, l = 0; l < f; l++) l in h && (g[l] = c.call(d, h[l], l, a));
        return g
    };
    e.array.reduce = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function (a, c, d, f) {
        e.asserts.assert(null != a.length);
        f && (c = e.bind(c, f));
        return Array.prototype.reduce.call(a, c, d)
    } : function (a, c, d, f) {
        var g = d;
        e.array.forEach(a, function (d, l) {
            g = c.call(f, g, d, l, a)
        });
        return g
    };
    e.array.reduceRight = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function (a, c, d, f) {
        e.asserts.assert(null != a.length);
        e.asserts.assert(null != c);
        f && (c = e.bind(c, f));
        return Array.prototype.reduceRight.call(a, c, d)
    } : function (a, c, d, f) {
        var g = d;
        e.array.forEachRight(a, function (d, l) {
            g = c.call(f, g, d, l, a)
        });
        return g
    };
    e.array.some = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function (a, c, d) {
        e.asserts.assert(null != a.length);
        return Array.prototype.some.call(a, c, d)
    } : function (a, c, d) {
        for (var f = a.length, g = "string" === typeof a ? a.split("") : a, h = 0; h < f; h++) if (h in g && c.call(d, g[h], h, a)) return !0;
        return !1
    };
    e.array.every = e.NATIVE_ARRAY_PROTOTYPES && (e.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function (a, c, d) {
        e.asserts.assert(null != a.length);
        return Array.prototype.every.call(a, c, d)
    } : function (a, c, d) {
        for (var f = a.length, g = "string" === typeof a ? a.split("") : a, h = 0; h < f; h++) if (h in g && !c.call(d, g[h], h, a)) return !1;
        return !0
    };
    e.array.count = function (a, c, d) {
        var f = 0;
        e.array.forEach(a, function (a, h, l) {
            c.call(d, a, h, l) && ++f
        }, d);
        return f
    };
    e.array.find = function (a, c, d) {
        c = e.array.findIndex(a, c, d);
        return 0 > c ? null : "string" === typeof a ? a.charAt(c) : a[c]
    };
    e.array.findIndex = function (a, c, d) {
        for (var f = a.length, g = "string" === typeof a ? a.split("") : a, h = 0; h < f; h++) if (h in g && c.call(d, g[h], h, a)) return h;
        return -1
    };
    e.array.findRight = function (a, c, d) {
        c = e.array.findIndexRight(a, c, d);
        return 0 > c ? null : "string" === typeof a ? a.charAt(c) : a[c]
    };
    e.array.findIndexRight = function (a, c, d) {
        var f = a.length, g = "string" === typeof a ? a.split("") : a;
        for (--f; 0 <= f; f--) if (f in g && c.call(d, g[f], f, a)) return f;
        return -1
    };
    e.array.contains = function (a, c) {
        return 0 <= e.array.indexOf(a, c)
    };
    e.array.isEmpty = function (a) {
        return 0 == a.length
    };
    e.array.clear = function (a) {
        if (!e.isArray(a)) for (var c = a.length - 1; 0 <= c; c--) delete a[c];
        a.length = 0
    };
    e.array.insert = function (a, c) {
        e.array.contains(a, c) || a.push(c)
    };
    e.array.insertAt = function (a, c, d) {
        e.array.splice(a, d, 0, c)
    };
    e.array.insertArrayAt = function (a, c, d) {
        e.partial(e.array.splice, a, d, 0).apply(null, c)
    };
    e.array.insertBefore = function (a, c, d) {
        var f;
        2 == arguments.length || 0 > (f = e.array.indexOf(a, d)) ? a.push(c) : e.array.insertAt(a, c, f)
    };
    e.array.remove = function (a, c) {
        c = e.array.indexOf(a, c);
        var d;
        (d = 0 <= c) && e.array.removeAt(a, c);
        return d
    };
    e.array.removeLast = function (a, c) {
        c = e.array.lastIndexOf(a, c);
        return 0 <= c ? (e.array.removeAt(a, c), !0) : !1
    };
    e.array.removeAt = function (a, c) {
        e.asserts.assert(null != a.length);
        return 1 == Array.prototype.splice.call(a, c, 1).length
    };
    e.array.removeIf = function (a, c, d) {
        c = e.array.findIndex(a, c, d);
        return 0 <= c ? (e.array.removeAt(a, c), !0) : !1
    };
    e.array.removeAllIf = function (a, c, d) {
        var f = 0;
        e.array.forEachRight(a, function (g, h) {
            c.call(d, g, h, a) && e.array.removeAt(a, h) && f++
        });
        return f
    };
    e.array.concat = function (a) {
        return Array.prototype.concat.apply([], arguments)
    };
    e.array.join = function (a) {
        return Array.prototype.concat.apply([], arguments)
    };
    e.array.toArray = function (a) {
        var c = a.length;
        if (0 < c) {
            for (var d = Array(c), f = 0; f < c; f++) d[f] = a[f];
            return d
        }
        return []
    };
    e.array.clone = e.array.toArray;
    e.array.extend = function (a, c) {
        for (var d = 1; d < arguments.length; d++) {
            var f = arguments[d];
            if (e.isArrayLike(f)) {
                var g = a.length || 0, h = f.length || 0;
                a.length = g + h;
                for (var l = 0; l < h; l++) a[g + l] = f[l]
            } else a.push(f)
        }
    };
    e.array.splice = function (a, c, d, f) {
        e.asserts.assert(null != a.length);
        return Array.prototype.splice.apply(a, e.array.slice(arguments, 1))
    };
    e.array.slice = function (a, c, d) {
        e.asserts.assert(null != a.length);
        return 2 >= arguments.length ? Array.prototype.slice.call(a, c) : Array.prototype.slice.call(a, c, d)
    };
    e.array.removeDuplicates = function (a, c, d) {
        function f(a) {
            return e.isObject(a) ? "o" + e.getUid(a) : (typeof a).charAt(0) + a
        }

        c = c || a;
        d = d || f;
        for (var g = {}, h = 0, l = 0; l < a.length;) {
            var m = a[l++], n = d(m);
            Object.prototype.hasOwnProperty.call(g, n) || (g[n] = !0, c[h++] = m)
        }
        c.length = h
    };
    e.array.binarySearch = function (a, c, d) {
        return e.array.binarySearch_(a, d || e.array.defaultCompare, !1, c)
    };
    e.array.binarySelect = function (a, c, d) {
        return e.array.binarySearch_(a, c, !0, void 0, d)
    };
    e.array.binarySearch_ = function (a, c, d, f, g) {
        for (var h = 0, l = a.length, m; h < l;) {
            var n = h + (l - h >>> 1);
            var p = d ? c.call(g, a[n], n, a) : c(f, a[n]);
            0 < p ? h = n + 1 : (l = n, m = !p)
        }
        return m ? h : -h - 1
    };
    e.array.sort = function (a, c) {
        a.sort(c || e.array.defaultCompare)
    };
    e.array.stableSort = function (a, c) {
        for (var d = Array(a.length), f = 0; f < a.length; f++) d[f] = {index: f, value: a[f]};
        var g = c || e.array.defaultCompare;
        e.array.sort(d, function (a, c) {
            return g(a.value, c.value) || a.index - c.index
        });
        for (f = 0; f < a.length; f++) a[f] = d[f].value
    };
    e.array.sortByKey = function (a, c, d) {
        var f = d || e.array.defaultCompare;
        e.array.sort(a, function (a, d) {
            return f(c(a), c(d))
        })
    };
    e.array.sortObjectsByKey = function (a, c, d) {
        e.array.sortByKey(a, function (a) {
            return a[c]
        }, d)
    };
    e.array.isSorted = function (a, c, d) {
        c = c || e.array.defaultCompare;
        for (var f = 1; f < a.length; f++) {
            var g = c(a[f - 1], a[f]);
            if (0 < g || 0 == g && d) return !1
        }
        return !0
    };
    e.array.equals = function (a, c, d) {
        if (!e.isArrayLike(a) || !e.isArrayLike(c) || a.length != c.length) return !1;
        var f = a.length;
        d = d || e.array.defaultCompareEquality;
        for (var g = 0; g < f; g++) if (!d(a[g], c[g])) return !1;
        return !0
    };
    e.array.compare3 = function (a, c, d) {
        d = d || e.array.defaultCompare;
        for (var f = Math.min(a.length, c.length), g = 0; g < f; g++) {
            var h = d(a[g], c[g]);
            if (0 != h) return h
        }
        return e.array.defaultCompare(a.length, c.length)
    };
    e.array.defaultCompare = function (a, c) {
        return a > c ? 1 : a < c ? -1 : 0
    };
    e.array.inverseDefaultCompare = function (a, c) {
        return -e.array.defaultCompare(a, c)
    };
    e.array.defaultCompareEquality = function (a, c) {
        return a === c
    };
    e.array.binaryInsert = function (a, c, d) {
        d = e.array.binarySearch(a, c, d);
        return 0 > d ? (e.array.insertAt(a, c, -(d + 1)), !0) : !1
    };
    e.array.binaryRemove = function (a, c, d) {
        c = e.array.binarySearch(a, c, d);
        return 0 <= c ? e.array.removeAt(a, c) : !1
    };
    e.array.bucket = function (a, c, d) {
        for (var f = {}, g = 0; g < a.length; g++) {
            var h = a[g], l = c.call(d, h, g, a);
            void 0 !== l && (f[l] || (f[l] = [])).push(h)
        }
        return f
    };
    e.array.toObject = function (a, c, d) {
        var f = {};
        e.array.forEach(a, function (g, h) {
            f[c.call(d, g, h, a)] = g
        });
        return f
    };
    e.array.range = function (a, c, d) {
        var f = [], g = 0, h = a;
        d = d || 1;
        void 0 !== c && (g = a, h = c);
        if (0 > d * (h - g)) return [];
        if (0 < d) for (a = g; a < h; a += d) f.push(a); else for (a = g; a > h; a += d) f.push(a);
        return f
    };
    e.array.repeat = function (a, c) {
        for (var d = [], f = 0; f < c; f++) d[f] = a;
        return d
    };
    e.array.flatten = function (a) {
        for (var c = [], d = 0; d < arguments.length; d++) {
            var f = arguments[d];
            if (e.isArray(f)) for (var g = 0; g < f.length; g += 8192) {
                var h = e.array.slice(f, g, g + 8192);
                h = e.array.flatten.apply(null, h);
                for (var l = 0; l < h.length; l++) c.push(h[l])
            } else c.push(f)
        }
        return c
    };
    e.array.rotate = function (a, c) {
        e.asserts.assert(null != a.length);
        a.length && (c %= a.length, 0 < c ? Array.prototype.unshift.apply(a, a.splice(-c, c)) : 0 > c && Array.prototype.push.apply(a, a.splice(0, -c)));
        return a
    };
    e.array.moveItem = function (a, c, d) {
        e.asserts.assert(0 <= c && c < a.length);
        e.asserts.assert(0 <= d && d < a.length);
        c = Array.prototype.splice.call(a, c, 1);
        Array.prototype.splice.call(a, d, 0, c[0])
    };
    e.array.zip = function (a) {
        if (!arguments.length) return [];
        for (var c = [], d = arguments[0].length, f = 1; f < arguments.length; f++) arguments[f].length < d && (d = arguments[f].length);
        for (f = 0; f < d; f++) {
            for (var g = [], h = 0; h < arguments.length; h++) g.push(arguments[h][f]);
            c.push(g)
        }
        return c
    };
    e.array.shuffle = function (a, c) {
        c = c || Math.random;
        for (var d = a.length - 1; 0 < d; d--) {
            var f = Math.floor(c() * (d + 1)), g = a[d];
            a[d] = a[f];
            a[f] = g
        }
    };
    e.array.copyByIndex = function (a, c) {
        var d = [];
        e.array.forEach(c, function (c) {
            d.push(a[c])
        });
        return d
    };
    e.array.concatMap = function (a, c, d) {
        return e.array.concat.apply([], e.array.map(a, c, d))
    };
    e.functions = {};
    e.functions.constant = function (a) {
        return function () {
            return a
        }
    };
    e.functions.FALSE = function () {
        return !1
    };
    e.functions.TRUE = function () {
        return !0
    };
    e.functions.NULL = function () {
        return null
    };
    e.functions.identity = function (a) {
        return a
    };
    e.functions.error = function (a) {
        return function () {
            throw Error(a);
        }
    };
    e.functions.fail = function (a) {
        return function () {
            throw a;
        }
    };
    e.functions.lock = function (a, c) {
        c = c || 0;
        return function () {
            return a.apply(this, Array.prototype.slice.call(arguments, 0, c))
        }
    };
    e.functions.nth = function (a) {
        return function () {
            return arguments[a]
        }
    };
    e.functions.partialRight = function (a, c) {
        var d = Array.prototype.slice.call(arguments, 1);
        return function () {
            var c = Array.prototype.slice.call(arguments);
            c.push.apply(c, d);
            return a.apply(this, c)
        }
    };
    e.functions.withReturnValue = function (a, c) {
        return e.functions.sequence(a, e.functions.constant(c))
    };
    e.functions.equalTo = function (a, c) {
        return function (d) {
            return c ? a == d : a === d
        }
    };
    e.functions.compose = function (a, c) {
        var d = arguments, f = d.length;
        return function () {
            var a;
            f && (a = d[f - 1].apply(this, arguments));
            for (var c = f - 2; 0 <= c; c--) a = d[c].call(this, a);
            return a
        }
    };
    e.functions.sequence = function (a) {
        var c = arguments, d = c.length;
        return function () {
            for (var a, g = 0; g < d; g++) a = c[g].apply(this, arguments);
            return a
        }
    };
    e.functions.and = function (a) {
        var c = arguments, d = c.length;
        return function () {
            for (var a = 0; a < d; a++) if (!c[a].apply(this, arguments)) return !1;
            return !0
        }
    };
    e.functions.or = function (a) {
        var c = arguments, d = c.length;
        return function () {
            for (var a = 0; a < d; a++) if (c[a].apply(this, arguments)) return !0;
            return !1
        }
    };
    e.functions.not = function (a) {
        return function () {
            return !a.apply(this, arguments)
        }
    };
    e.functions.create = function (a, c) {
        function d() {
        }

        d.prototype = a.prototype;
        var f = new d;
        a.apply(f, Array.prototype.slice.call(arguments, 1));
        return f
    };
    e.functions.CACHE_RETURN_VALUE = !0;
    e.functions.cacheReturnValue = function (a) {
        var c = !1, d;
        return function () {
            if (!e.functions.CACHE_RETURN_VALUE) return a();
            c || (d = a(), c = !0);
            return d
        }
    };
    e.functions.once = function (a) {
        var c = a;
        return function () {
            if (c) {
                var a = c;
                c = null;
                a()
            }
        }
    };
    e.functions.debounce = function (a, c, d) {
        var f = 0;
        return function (g) {
            e.global.clearTimeout(f);
            var h = arguments;
            f = e.global.setTimeout(function () {
                a.apply(d, h)
            }, c)
        }
    };
    e.functions.throttle = function (a, c, d) {
        function f() {
            h = e.global.setTimeout(g, c);
            a.apply(d, m)
        }

        function g() {
            h = 0;
            l && (l = !1, f())
        }

        var h = 0, l = !1, m = [];
        return function (a) {
            m = arguments;
            h ? l = !0 : f()
        }
    };
    e.functions.rateLimit = function (a, c, d) {
        function f() {
            g = 0
        }

        var g = 0;
        return function (h) {
            g || (g = e.global.setTimeout(f, c), a.apply(d, arguments))
        }
    };
    e.math = {};
    e.math.randomInt = function (a) {
        return Math.floor(Math.random() * a)
    };
    e.math.uniformRandom = function (a, c) {
        return a + Math.random() * (c - a)
    };
    e.math.clamp = function (a, c, d) {
        return Math.min(Math.max(a, c), d)
    };
    e.math.modulo = function (a, c) {
        a %= c;
        return 0 > a * c ? a + c : a
    };
    e.math.lerp = function (a, c, d) {
        return a + d * (c - a)
    };
    e.math.nearlyEquals = function (a, c, d) {
        return Math.abs(a - c) <= (d || 1E-6)
    };
    e.math.standardAngle = function (a) {
        return e.math.modulo(a, 360)
    };
    e.math.standardAngleInRadians = function (a) {
        return e.math.modulo(a, 2 * Math.PI)
    };
    e.math.toRadians = function (a) {
        return a * Math.PI / 180
    };
    e.math.toDegrees = function (a) {
        return 180 * a / Math.PI
    };
    e.math.angleDx = function (a, c) {
        return c * Math.cos(e.math.toRadians(a))
    };
    e.math.angleDy = function (a, c) {
        return c * Math.sin(e.math.toRadians(a))
    };
    e.math.angle = function (a, c, d, f) {
        return e.math.standardAngle(e.math.toDegrees(Math.atan2(f - c, d - a)))
    };
    e.math.angleDifference = function (a, c) {
        a = e.math.standardAngle(c) - e.math.standardAngle(a);
        180 < a ? a -= 360 : -180 >= a && (a = 360 + a);
        return a
    };
    e.math.sign = function (a) {
        return 0 < a ? 1 : 0 > a ? -1 : a
    };
    e.math.longestCommonSubsequence = function (a, c, d, f) {
        d = d || function (a, c) {
            return a == c
        };
        f = f || function (c) {
            return a[c]
        };
        for (var g = a.length, h = c.length, l = [], m = 0; m < g + 1; m++) l[m] = [], l[m][0] = 0;
        for (var n = 0; n < h + 1; n++) l[0][n] = 0;
        for (m = 1; m <= g; m++) for (n = 1; n <= h; n++) d(a[m - 1], c[n - 1]) ? l[m][n] = l[m - 1][n - 1] + 1 : l[m][n] = Math.max(l[m - 1][n], l[m][n - 1]);
        var p = [];
        m = g;
        for (n = h; 0 < m && 0 < n;) d(a[m - 1], c[n - 1]) ? (p.unshift(f(m - 1, n - 1)), m--, n--) : l[m - 1][n] > l[m][n - 1] ? m-- : n--;
        return p
    };
    e.math.sum = function (a) {
        return e.array.reduce(arguments, function (a, d) {
            return a + d
        }, 0)
    };
    e.math.average = function (a) {
        return e.math.sum.apply(null, arguments) / arguments.length
    };
    e.math.sampleVariance = function (a) {
        var c = arguments.length;
        if (2 > c) return 0;
        var d = e.math.average.apply(null, arguments);
        return e.math.sum.apply(null, e.array.map(arguments, function (a) {
            return Math.pow(a - d, 2)
        })) / (c - 1)
    };
    e.math.standardDeviation = function (a) {
        return Math.sqrt(e.math.sampleVariance.apply(null, arguments))
    };
    e.math.isInt = function (a) {
        return isFinite(a) && 0 == a % 1
    };
    e.math.isFiniteNumber = function (a) {
        return isFinite(a)
    };
    e.math.isNegativeZero = function (a) {
        return 0 == a && 0 > 1 / a
    };
    e.math.log10Floor = function (a) {
        if (0 < a) {
            var c = Math.round(Math.log(a) * Math.LOG10E);
            return c - (parseFloat("1e" + c) > a ? 1 : 0)
        }
        return 0 == a ? -Infinity : NaN
    };
    e.math.safeFloor = function (a, c) {
        e.asserts.assert(void 0 === c || 0 < c);
        return Math.floor(a + (c || 2E-15))
    };
    e.math.safeCeil = function (a, c) {
        e.asserts.assert(void 0 === c || 0 < c);
        return Math.ceil(a - (c || 2E-15))
    };
    e.iter = {};
    e.iter.StopIteration = "StopIteration" in e.global ? e.global.StopIteration : {message: "StopIteration", stack: ""};
    e.iter.Iterator = function () {
    };
    e.iter.Iterator.prototype.next = function () {
        throw e.iter.StopIteration;
    };
    e.iter.Iterator.prototype.__iterator__ = function () {
        return this
    };
    e.iter.toIterator = function (a) {
        if (a instanceof e.iter.Iterator) return a;
        if ("function" == typeof a.__iterator__) return a.__iterator__(!1);
        if (e.isArrayLike(a)) {
            var c = 0, d = new e.iter.Iterator;
            d.next = function () {
                for (; ;) {
                    if (c >= a.length) throw e.iter.StopIteration;
                    if (c in a) return a[c++];
                    c++
                }
            };
            return d
        }
        throw Error("Not implemented");
    };
    e.iter.forEach = function (a, c, d) {
        if (e.isArrayLike(a)) try {
            e.array.forEach(a, c, d)
        } catch (f) {
            if (f !== e.iter.StopIteration) throw f;
        } else {
            a = e.iter.toIterator(a);
            try {
                for (; ;) c.call(d, a.next(), void 0, a)
            } catch (f) {
                if (f !== e.iter.StopIteration) throw f;
            }
        }
    };
    e.iter.filter = function (a, c, d) {
        var f = e.iter.toIterator(a);
        a = new e.iter.Iterator;
        a.next = function () {
            for (; ;) {
                var a = f.next();
                if (c.call(d, a, void 0, f)) return a
            }
        };
        return a
    };
    e.iter.filterFalse = function (a, c, d) {
        return e.iter.filter(a, e.functions.not(c), d)
    };
    e.iter.range = function (a, c, d) {
        var f = 0, g = a, h = d || 1;
        1 < arguments.length && (f = a, g = +c);
        if (0 == h) throw Error("Range step argument must not be zero");
        var l = new e.iter.Iterator;
        l.next = function () {
            if (0 < h && f >= g || 0 > h && f <= g) throw e.iter.StopIteration;
            var a = f;
            f += h;
            return a
        };
        return l
    };
    e.iter.join = function (a, c) {
        return e.iter.toArray(a).join(c)
    };
    e.iter.map = function (a, c, d) {
        var f = e.iter.toIterator(a);
        a = new e.iter.Iterator;
        a.next = function () {
            var a = f.next();
            return c.call(d, a, void 0, f)
        };
        return a
    };
    e.iter.reduce = function (a, c, d, f) {
        var g = d;
        e.iter.forEach(a, function (a) {
            g = c.call(f, g, a)
        });
        return g
    };
    e.iter.some = function (a, c, d) {
        a = e.iter.toIterator(a);
        try {
            for (; ;) if (c.call(d, a.next(), void 0, a)) return !0
        } catch (f) {
            if (f !== e.iter.StopIteration) throw f;
        }
        return !1
    };
    e.iter.every = function (a, c, d) {
        a = e.iter.toIterator(a);
        try {
            for (; ;) if (!c.call(d, a.next(), void 0, a)) return !1
        } catch (f) {
            if (f !== e.iter.StopIteration) throw f;
        }
        return !0
    };
    e.iter.chain = function (a) {
        return e.iter.chainFromIterable(arguments)
    };
    e.iter.chainFromIterable = function (a) {
        var c = e.iter.toIterator(a);
        a = new e.iter.Iterator;
        var d = null;
        a.next = function () {
            for (; ;) {
                if (null == d) {
                    var a = c.next();
                    d = e.iter.toIterator(a)
                }
                try {
                    return d.next()
                } catch (g) {
                    if (g !== e.iter.StopIteration) throw g;
                    d = null
                }
            }
        };
        return a
    };
    e.iter.dropWhile = function (a, c, d) {
        var f = e.iter.toIterator(a);
        a = new e.iter.Iterator;
        var g = !0;
        a.next = function () {
            for (; ;) {
                var a = f.next();
                if (!g || !c.call(d, a, void 0, f)) return g = !1, a
            }
        };
        return a
    };
    e.iter.takeWhile = function (a, c, d) {
        var f = e.iter.toIterator(a);
        a = new e.iter.Iterator;
        a.next = function () {
            var a = f.next();
            if (c.call(d, a, void 0, f)) return a;
            throw e.iter.StopIteration;
        };
        return a
    };
    e.iter.toArray = function (a) {
        if (e.isArrayLike(a)) return e.array.toArray(a);
        a = e.iter.toIterator(a);
        var c = [];
        e.iter.forEach(a, function (a) {
            c.push(a)
        });
        return c
    };
    e.iter.equals = function (a, c, d) {
        a = e.iter.zipLongest({}, a, c);
        var f = d || e.array.defaultCompareEquality;
        return e.iter.every(a, function (a) {
            return f(a[0], a[1])
        })
    };
    e.iter.nextOrValue = function (a, c) {
        try {
            return e.iter.toIterator(a).next()
        } catch (d) {
            if (d != e.iter.StopIteration) throw d;
            return c
        }
    };
    e.iter.product = function (a) {
        if (e.array.some(arguments, function (a) {
            return !a.length
        }) || !arguments.length) return new e.iter.Iterator;
        var c = new e.iter.Iterator, d = arguments, f = e.array.repeat(0, d.length);
        c.next = function () {
            if (f) {
                for (var a = e.array.map(f, function (a, c) {
                    return d[c][a]
                }), c = f.length - 1; 0 <= c; c--) {
                    e.asserts.assert(f);
                    if (f[c] < d[c].length - 1) {
                        f[c]++;
                        break
                    }
                    if (0 == c) {
                        f = null;
                        break
                    }
                    f[c] = 0
                }
                return a
            }
            throw e.iter.StopIteration;
        };
        return c
    };
    e.iter.cycle = function (a) {
        var c = e.iter.toIterator(a), d = [], f = 0;
        a = new e.iter.Iterator;
        var g = !1;
        a.next = function () {
            var a = null;
            if (!g) try {
                return a = c.next(), d.push(a), a
            } catch (l) {
                if (l != e.iter.StopIteration || e.array.isEmpty(d)) throw l;
                g = !0
            }
            a = d[f];
            f = (f + 1) % d.length;
            return a
        };
        return a
    };
    e.iter.count = function (a, c) {
        var d = a || 0, f = void 0 !== c ? c : 1;
        a = new e.iter.Iterator;
        a.next = function () {
            var a = d;
            d += f;
            return a
        };
        return a
    };
    e.iter.repeat = function (a) {
        var c = new e.iter.Iterator;
        c.next = e.functions.constant(a);
        return c
    };
    e.iter.accumulate = function (a) {
        var c = e.iter.toIterator(a), d = 0;
        a = new e.iter.Iterator;
        a.next = function () {
            return d += c.next()
        };
        return a
    };
    e.iter.zip = function (a) {
        var c = arguments, d = new e.iter.Iterator;
        if (0 < c.length) {
            var f = e.array.map(c, e.iter.toIterator);
            d.next = function () {
                return e.array.map(f, function (a) {
                    return a.next()
                })
            }
        }
        return d
    };
    e.iter.zipLongest = function (a, c) {
        var d = e.array.slice(arguments, 1), f = new e.iter.Iterator;
        if (0 < d.length) {
            var g = e.array.map(d, e.iter.toIterator);
            f.next = function () {
                var c = !1, d = e.array.map(g, function (d) {
                    try {
                        var f = d.next();
                        c = !0
                    } catch (p) {
                        if (p !== e.iter.StopIteration) throw p;
                        f = a
                    }
                    return f
                });
                if (!c) throw e.iter.StopIteration;
                return d
            }
        }
        return f
    };
    e.iter.compress = function (a, c) {
        var d = e.iter.toIterator(c);
        return e.iter.filter(a, function () {
            return !!d.next()
        })
    };
    e.iter.GroupByIterator_ = function (a, c) {
        this.iterator = e.iter.toIterator(a);
        this.keyFunc = c || e.functions.identity
    };
    e.inherits(e.iter.GroupByIterator_, e.iter.Iterator);
    e.iter.GroupByIterator_.prototype.next = function () {
        for (; this.currentKey == this.targetKey;) this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
        this.targetKey = this.currentKey;
        return [this.currentKey, this.groupItems_(this.targetKey)]
    };
    e.iter.GroupByIterator_.prototype.groupItems_ = function (a) {
        for (var c = []; this.currentKey == a;) {
            c.push(this.currentValue);
            try {
                this.currentValue = this.iterator.next()
            } catch (d) {
                if (d !== e.iter.StopIteration) throw d;
                break
            }
            this.currentKey = this.keyFunc(this.currentValue)
        }
        return c
    };
    e.iter.groupBy = function (a, c) {
        return new e.iter.GroupByIterator_(a, c)
    };
    e.iter.starMap = function (a, c, d) {
        var f = e.iter.toIterator(a);
        a = new e.iter.Iterator;
        a.next = function () {
            var a = e.iter.toArray(f.next());
            return c.apply(d, e.array.concat(a, void 0, f))
        };
        return a
    };
    e.iter.tee = function (a, c) {
        function d() {
            var a = f.next();
            e.array.forEach(g, function (c) {
                c.push(a)
            })
        }

        var f = e.iter.toIterator(a), g = e.array.map(e.array.range("number" === typeof c ? c : 2), function () {
            return []
        });
        return e.array.map(g, function (a) {
            var c = new e.iter.Iterator;
            c.next = function () {
                e.array.isEmpty(a) && d();
                e.asserts.assert(!e.array.isEmpty(a));
                return a.shift()
            };
            return c
        })
    };
    e.iter.enumerate = function (a, c) {
        return e.iter.zip(e.iter.count(c), a)
    };
    e.iter.limit = function (a, c) {
        e.asserts.assert(e.math.isInt(c) && 0 <= c);
        var d = e.iter.toIterator(a);
        a = new e.iter.Iterator;
        var f = c;
        a.next = function () {
            if (0 < f--) return d.next();
            throw e.iter.StopIteration;
        };
        return a
    };
    e.iter.consume = function (a, c) {
        e.asserts.assert(e.math.isInt(c) && 0 <= c);
        for (a = e.iter.toIterator(a); 0 < c--;) e.iter.nextOrValue(a, null);
        return a
    };
    e.iter.slice = function (a, c, d) {
        e.asserts.assert(e.math.isInt(c) && 0 <= c);
        a = e.iter.consume(a, c);
        "number" === typeof d && (e.asserts.assert(e.math.isInt(d) && d >= c), a = e.iter.limit(a, d - c));
        return a
    };
    e.iter.hasDuplicates_ = function (a) {
        var c = [];
        e.array.removeDuplicates(a, c);
        return a.length != c.length
    };
    e.iter.permutations = function (a, c) {
        a = e.iter.toArray(a);
        c = e.array.repeat(a, "number" === typeof c ? c : a.length);
        c = e.iter.product.apply(void 0, c);
        return e.iter.filter(c, function (a) {
            return !e.iter.hasDuplicates_(a)
        })
    };
    e.iter.combinations = function (a, c) {
        function d(a) {
            return f[a]
        }

        var f = e.iter.toArray(a);
        a = e.iter.range(f.length);
        c = e.iter.permutations(a, c);
        var g = e.iter.filter(c, function (a) {
            return e.array.isSorted(a)
        });
        c = new e.iter.Iterator;
        c.next = function () {
            return e.array.map(g.next(), d)
        };
        return c
    };
    e.iter.combinationsWithReplacement = function (a, c) {
        function d(a) {
            return f[a]
        }

        var f = e.iter.toArray(a);
        a = e.array.range(f.length);
        c = e.array.repeat(a, c);
        c = e.iter.product.apply(void 0, c);
        var g = e.iter.filter(c, function (a) {
            return e.array.isSorted(a)
        });
        c = new e.iter.Iterator;
        c.next = function () {
            return e.array.map(g.next(), d)
        };
        return c
    };
    e.json = {};
    e.json.USE_NATIVE_JSON = !1;
    e.json.TRY_NATIVE_JSON = !1;
    e.json.isValid = function (a) {
        return /^\s*$/.test(a) ? !1 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))
    };
    e.json.errorLogger_ = e.nullFunction;
    e.json.setErrorLogger = function (a) {
        e.json.errorLogger_ = a
    };
    e.json.parse = e.json.USE_NATIVE_JSON ? e.global.JSON.parse : function (a) {
        if (e.json.TRY_NATIVE_JSON) try {
            return e.global.JSON.parse(a)
        } catch (f) {
            var c = f
        }
        a = String(a);
        if (e.json.isValid(a)) try {
            var d = eval("(" + a + ")");
            c && e.json.errorLogger_("Invalid JSON: " + a, c);
            return d
        } catch (f) {
        }
        throw Error("Invalid JSON string: " + a);
    };
    e.json.serialize = e.json.USE_NATIVE_JSON ? e.global.JSON.stringify : function (a, c) {
        return (new e.json.Serializer(c)).serialize(a)
    };
    e.json.Serializer = function (a) {
        this.replacer_ = a
    };
    e.json.Serializer.prototype.serialize = function (a) {
        var c = [];
        this.serializeInternal(a, c);
        return c.join("")
    };
    e.json.Serializer.prototype.serializeInternal = function (a, c) {
        if (null == a) c.push("null"); else {
            if ("object" == typeof a) {
                if (e.isArray(a)) {
                    this.serializeArray(a, c);
                    return
                }
                if (a instanceof String || a instanceof Number || a instanceof Boolean) a = a.valueOf(); else {
                    this.serializeObject_(a, c);
                    return
                }
            }
            switch (typeof a) {
                case "string":
                    this.serializeString_(a, c);
                    break;
                case "number":
                    this.serializeNumber_(a, c);
                    break;
                case "boolean":
                    c.push(String(a));
                    break;
                case "function":
                    c.push("null");
                    break;
                default:
                    throw Error("Unknown type: " +
                        typeof a);
            }
        }
    };
    e.json.Serializer.charToJsonCharCache_ = {
        '"': '\\"',
        "\\": "\\\\",
        "/": "\\/",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\x0B": "\\u000b"
    };
    e.json.Serializer.charsToReplace_ = /\uffff/.test("\uffff") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;
    e.json.Serializer.prototype.serializeString_ = function (a, c) {
        c.push('"', a.replace(e.json.Serializer.charsToReplace_, function (a) {
            var c = e.json.Serializer.charToJsonCharCache_[a];
            c || (c = "\\u" + (a.charCodeAt(0) | 65536).toString(16).substr(1), e.json.Serializer.charToJsonCharCache_[a] = c);
            return c
        }), '"')
    };
    e.json.Serializer.prototype.serializeNumber_ = function (a, c) {
        c.push(isFinite(a) && !isNaN(a) ? String(a) : "null")
    };
    e.json.Serializer.prototype.serializeArray = function (a, c) {
        var d = a.length;
        c.push("[");
        for (var f = "", g = 0; g < d; g++) c.push(f), f = a[g], this.serializeInternal(this.replacer_ ? this.replacer_.call(a, String(g), f) : f, c), f = ",";
        c.push("]")
    };
    e.json.Serializer.prototype.serializeObject_ = function (a, c) {
        c.push("{");
        var d = "", f;
        for (f in a) if (Object.prototype.hasOwnProperty.call(a, f)) {
            var g = a[f];
            "function" != typeof g && (c.push(d), this.serializeString_(f, c), c.push(":"), this.serializeInternal(this.replacer_ ? this.replacer_.call(a, f, g) : g, c), d = ",")
        }
        c.push("}")
    };
    e.object = {};
    e.object.is = function (a, c) {
        return a === c ? 0 !== a || 1 / a === 1 / c : a !== a && c !== c
    };
    e.object.forEach = function (a, c, d) {
        for (var f in a) c.call(d, a[f], f, a)
    };
    e.object.filter = function (a, c, d) {
        var f = {}, g;
        for (g in a) c.call(d, a[g], g, a) && (f[g] = a[g]);
        return f
    };
    e.object.map = function (a, c, d) {
        var f = {}, g;
        for (g in a) f[g] = c.call(d, a[g], g, a);
        return f
    };
    e.object.some = function (a, c, d) {
        for (var f in a) if (c.call(d, a[f], f, a)) return !0;
        return !1
    };
    e.object.every = function (a, c, d) {
        for (var f in a) if (!c.call(d, a[f], f, a)) return !1;
        return !0
    };
    e.object.getCount = function (a) {
        var c = 0, d;
        for (d in a) c++;
        return c
    };
    e.object.getAnyKey = function (a) {
        for (var c in a) return c
    };
    e.object.getAnyValue = function (a) {
        for (var c in a) return a[c]
    };
    e.object.contains = function (a, c) {
        return e.object.containsValue(a, c)
    };
    e.object.getValues = function (a) {
        var c = [], d = 0, f;
        for (f in a) c[d++] = a[f];
        return c
    };
    e.object.getKeys = function (a) {
        var c = [], d = 0, f;
        for (f in a) c[d++] = f;
        return c
    };
    e.object.getValueByKeys = function (a, c) {
        var d = e.isArrayLike(c), f = d ? c : arguments;
        for (d = d ? 0 : 1; d < f.length; d++) {
            if (null == a) return;
            a = a[f[d]]
        }
        return a
    };
    e.object.containsKey = function (a, c) {
        return null !== a && c in a
    };
    e.object.containsValue = function (a, c) {
        for (var d in a) if (a[d] == c) return !0;
        return !1
    };
    e.object.findKey = function (a, c, d) {
        for (var f in a) if (c.call(d, a[f], f, a)) return f
    };
    e.object.findValue = function (a, c, d) {
        return (c = e.object.findKey(a, c, d)) && a[c]
    };
    e.object.isEmpty = function (a) {
        for (var c in a) return !1;
        return !0
    };
    e.object.clear = function (a) {
        for (var c in a) delete a[c]
    };
    e.object.remove = function (a, c) {
        var d;
        (d = c in a) && delete a[c];
        return d
    };
    e.object.add = function (a, c, d) {
        if (null !== a && c in a) throw Error('The object already contains the key "' + c + '"');
        e.object.set(a, c, d)
    };
    e.object.get = function (a, c, d) {
        return null !== a && c in a ? a[c] : d
    };
    e.object.set = function (a, c, d) {
        a[c] = d
    };
    e.object.setIfUndefined = function (a, c, d) {
        return c in a ? a[c] : a[c] = d
    };
    e.object.setWithReturnValueIfNotSet = function (a, c, d) {
        if (c in a) return a[c];
        d = d();
        return a[c] = d
    };
    e.object.equals = function (a, c) {
        for (var d in a) if (!(d in c) || a[d] !== c[d]) return !1;
        for (var f in c) if (!(f in a)) return !1;
        return !0
    };
    e.object.clone = function (a) {
        var c = {}, d;
        for (d in a) c[d] = a[d];
        return c
    };
    e.object.unsafeClone = function (a) {
        var c = e.typeOf(a);
        if ("object" == c || "array" == c) {
            if (e.isFunction(a.clone)) return a.clone();
            c = "array" == c ? [] : {};
            for (var d in a) c[d] = e.object.unsafeClone(a[d]);
            return c
        }
        return a
    };
    e.object.transpose = function (a) {
        var c = {}, d;
        for (d in a) c[a[d]] = d;
        return c
    };
    e.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
    e.object.extend = function (a, c) {
        for (var d, f, g = 1; g < arguments.length; g++) {
            f = arguments[g];
            for (d in f) a[d] = f[d];
            for (var h = 0; h < e.object.PROTOTYPE_FIELDS_.length; h++) d = e.object.PROTOTYPE_FIELDS_[h], Object.prototype.hasOwnProperty.call(f, d) && (a[d] = f[d])
        }
    };
    e.object.create = function (a) {
        var c = arguments.length;
        if (1 == c && e.isArray(arguments[0])) return e.object.create.apply(null, arguments[0]);
        if (c % 2) throw Error("Uneven number of arguments");
        for (var d = {}, f = 0; f < c; f += 2) d[arguments[f]] = arguments[f + 1];
        return d
    };
    e.object.createSet = function (a) {
        var c = arguments.length;
        if (1 == c && e.isArray(arguments[0])) return e.object.createSet.apply(null, arguments[0]);
        for (var d = {}, f = 0; f < c; f++) d[arguments[f]] = !0;
        return d
    };
    e.object.createImmutableView = function (a) {
        var c = a;
        Object.isFrozen && !Object.isFrozen(a) && (c = Object.create(a), Object.freeze(c));
        return c
    };
    e.object.isImmutableView = function (a) {
        return !!Object.isFrozen && Object.isFrozen(a)
    };
    e.object.getAllPropertyNames = function (a, c, d) {
        if (!a) return [];
        if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) return e.object.getKeys(a);
        for (var f = {}; a && (a !== Object.prototype || c) && (a !== Function.prototype || d);) {
            for (var g = Object.getOwnPropertyNames(a), h = 0; h < g.length; h++) f[g[h]] = !0;
            a = Object.getPrototypeOf(a)
        }
        return e.object.getKeys(f)
    };
    e.object.getSuperClass = function (a) {
        return (a = Object.getPrototypeOf(a.prototype)) && a.constructor
    };
    e.dom.asserts = {};
    e.dom.asserts.assertIsLocation = function (a) {
        if (e.asserts.ENABLE_ASSERTS) {
            var c = e.dom.asserts.getWindow_(a);
            c && (!a || !(a instanceof c.Location) && a instanceof c.Element) && e.asserts.fail("Argument is not a Location (or a non-Element mock); got: %s", e.dom.asserts.debugStringForType_(a))
        }
        return a
    };
    e.dom.asserts.assertIsElementType_ = function (a, c) {
        if (e.asserts.ENABLE_ASSERTS) {
            var d = e.dom.asserts.getWindow_(a);
            d && "undefined" != typeof d[c] && (a && (a instanceof d[c] || !(a instanceof d.Location || a instanceof d.Element)) || e.asserts.fail("Argument is not a %s (or a non-Element, non-Location mock); got: %s", c, e.dom.asserts.debugStringForType_(a)))
        }
        return a
    };
    e.dom.asserts.assertIsHTMLAnchorElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLAnchorElement")
    };
    e.dom.asserts.assertIsHTMLButtonElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLButtonElement")
    };
    e.dom.asserts.assertIsHTMLLinkElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLLinkElement")
    };
    e.dom.asserts.assertIsHTMLImageElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLImageElement")
    };
    e.dom.asserts.assertIsHTMLAudioElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLAudioElement")
    };
    e.dom.asserts.assertIsHTMLVideoElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLVideoElement")
    };
    e.dom.asserts.assertIsHTMLInputElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLInputElement")
    };
    e.dom.asserts.assertIsHTMLTextAreaElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLTextAreaElement")
    };
    e.dom.asserts.assertIsHTMLCanvasElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLCanvasElement")
    };
    e.dom.asserts.assertIsHTMLEmbedElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLEmbedElement")
    };
    e.dom.asserts.assertIsHTMLFormElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLFormElement")
    };
    e.dom.asserts.assertIsHTMLFrameElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLFrameElement")
    };
    e.dom.asserts.assertIsHTMLIFrameElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLIFrameElement")
    };
    e.dom.asserts.assertIsHTMLObjectElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLObjectElement")
    };
    e.dom.asserts.assertIsHTMLScriptElement = function (a) {
        return e.dom.asserts.assertIsElementType_(a, "HTMLScriptElement")
    };
    e.dom.asserts.debugStringForType_ = function (a) {
        if (e.isObject(a)) try {
            return a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a)
        } catch (c) {
            return "<object could not be stringified>"
        } else return void 0 === a ? "undefined" : null === a ? "null" : typeof a
    };
    e.dom.asserts.getWindow_ = function (a) {
        try {
            var c = a && a.ownerDocument, d = c && (c.defaultView || c.parentWindow);
            d = d || e.global;
            if (d.Element && d.Location) return d
        } catch (f) {
        }
        return null
    };
    e.dom.HtmlElement = function () {
    };
    e.dom.TagName = function (a) {
        this.tagName_ = a
    };
    e.dom.TagName.prototype.toString = function () {
        return this.tagName_
    };
    e.dom.TagName.A = new e.dom.TagName("A");
    e.dom.TagName.ABBR = new e.dom.TagName("ABBR");
    e.dom.TagName.ACRONYM = new e.dom.TagName("ACRONYM");
    e.dom.TagName.ADDRESS = new e.dom.TagName("ADDRESS");
    e.dom.TagName.APPLET = new e.dom.TagName("APPLET");
    e.dom.TagName.AREA = new e.dom.TagName("AREA");
    e.dom.TagName.ARTICLE = new e.dom.TagName("ARTICLE");
    e.dom.TagName.ASIDE = new e.dom.TagName("ASIDE");
    e.dom.TagName.AUDIO = new e.dom.TagName("AUDIO");
    e.dom.TagName.B = new e.dom.TagName("B");
    e.dom.TagName.BASE = new e.dom.TagName("BASE");
    e.dom.TagName.BASEFONT = new e.dom.TagName("BASEFONT");
    e.dom.TagName.BDI = new e.dom.TagName("BDI");
    e.dom.TagName.BDO = new e.dom.TagName("BDO");
    e.dom.TagName.BIG = new e.dom.TagName("BIG");
    e.dom.TagName.BLOCKQUOTE = new e.dom.TagName("BLOCKQUOTE");
    e.dom.TagName.BODY = new e.dom.TagName("BODY");
    e.dom.TagName.BR = new e.dom.TagName("BR");
    e.dom.TagName.BUTTON = new e.dom.TagName("BUTTON");
    e.dom.TagName.CANVAS = new e.dom.TagName("CANVAS");
    e.dom.TagName.CAPTION = new e.dom.TagName("CAPTION");
    e.dom.TagName.CENTER = new e.dom.TagName("CENTER");
    e.dom.TagName.CITE = new e.dom.TagName("CITE");
    e.dom.TagName.CODE = new e.dom.TagName("CODE");
    e.dom.TagName.COL = new e.dom.TagName("COL");
    e.dom.TagName.COLGROUP = new e.dom.TagName("COLGROUP");
    e.dom.TagName.COMMAND = new e.dom.TagName("COMMAND");
    e.dom.TagName.DATA = new e.dom.TagName("DATA");
    e.dom.TagName.DATALIST = new e.dom.TagName("DATALIST");
    e.dom.TagName.DD = new e.dom.TagName("DD");
    e.dom.TagName.DEL = new e.dom.TagName("DEL");
    e.dom.TagName.DETAILS = new e.dom.TagName("DETAILS");
    e.dom.TagName.DFN = new e.dom.TagName("DFN");
    e.dom.TagName.DIALOG = new e.dom.TagName("DIALOG");
    e.dom.TagName.DIR = new e.dom.TagName("DIR");
    e.dom.TagName.DIV = new e.dom.TagName("DIV");
    e.dom.TagName.DL = new e.dom.TagName("DL");
    e.dom.TagName.DT = new e.dom.TagName("DT");
    e.dom.TagName.EM = new e.dom.TagName("EM");
    e.dom.TagName.EMBED = new e.dom.TagName("EMBED");
    e.dom.TagName.FIELDSET = new e.dom.TagName("FIELDSET");
    e.dom.TagName.FIGCAPTION = new e.dom.TagName("FIGCAPTION");
    e.dom.TagName.FIGURE = new e.dom.TagName("FIGURE");
    e.dom.TagName.FONT = new e.dom.TagName("FONT");
    e.dom.TagName.FOOTER = new e.dom.TagName("FOOTER");
    e.dom.TagName.FORM = new e.dom.TagName("FORM");
    e.dom.TagName.FRAME = new e.dom.TagName("FRAME");
    e.dom.TagName.FRAMESET = new e.dom.TagName("FRAMESET");
    e.dom.TagName.H1 = new e.dom.TagName("H1");
    e.dom.TagName.H2 = new e.dom.TagName("H2");
    e.dom.TagName.H3 = new e.dom.TagName("H3");
    e.dom.TagName.H4 = new e.dom.TagName("H4");
    e.dom.TagName.H5 = new e.dom.TagName("H5");
    e.dom.TagName.H6 = new e.dom.TagName("H6");
    e.dom.TagName.HEAD = new e.dom.TagName("HEAD");
    e.dom.TagName.HEADER = new e.dom.TagName("HEADER");
    e.dom.TagName.HGROUP = new e.dom.TagName("HGROUP");
    e.dom.TagName.HR = new e.dom.TagName("HR");
    e.dom.TagName.HTML = new e.dom.TagName("HTML");
    e.dom.TagName.I = new e.dom.TagName("I");
    e.dom.TagName.IFRAME = new e.dom.TagName("IFRAME");
    e.dom.TagName.IMG = new e.dom.TagName("IMG");
    e.dom.TagName.INPUT = new e.dom.TagName("INPUT");
    e.dom.TagName.INS = new e.dom.TagName("INS");
    e.dom.TagName.ISINDEX = new e.dom.TagName("ISINDEX");
    e.dom.TagName.KBD = new e.dom.TagName("KBD");
    e.dom.TagName.KEYGEN = new e.dom.TagName("KEYGEN");
    e.dom.TagName.LABEL = new e.dom.TagName("LABEL");
    e.dom.TagName.LEGEND = new e.dom.TagName("LEGEND");
    e.dom.TagName.LI = new e.dom.TagName("LI");
    e.dom.TagName.LINK = new e.dom.TagName("LINK");
    e.dom.TagName.MAIN = new e.dom.TagName("MAIN");
    e.dom.TagName.MAP = new e.dom.TagName("MAP");
    e.dom.TagName.MARK = new e.dom.TagName("MARK");
    e.dom.TagName.MATH = new e.dom.TagName("MATH");
    e.dom.TagName.MENU = new e.dom.TagName("MENU");
    e.dom.TagName.MENUITEM = new e.dom.TagName("MENUITEM");
    e.dom.TagName.META = new e.dom.TagName("META");
    e.dom.TagName.METER = new e.dom.TagName("METER");
    e.dom.TagName.NAV = new e.dom.TagName("NAV");
    e.dom.TagName.NOFRAMES = new e.dom.TagName("NOFRAMES");
    e.dom.TagName.NOSCRIPT = new e.dom.TagName("NOSCRIPT");
    e.dom.TagName.OBJECT = new e.dom.TagName("OBJECT");
    e.dom.TagName.OL = new e.dom.TagName("OL");
    e.dom.TagName.OPTGROUP = new e.dom.TagName("OPTGROUP");
    e.dom.TagName.OPTION = new e.dom.TagName("OPTION");
    e.dom.TagName.OUTPUT = new e.dom.TagName("OUTPUT");
    e.dom.TagName.P = new e.dom.TagName("P");
    e.dom.TagName.PARAM = new e.dom.TagName("PARAM");
    e.dom.TagName.PICTURE = new e.dom.TagName("PICTURE");
    e.dom.TagName.PRE = new e.dom.TagName("PRE");
    e.dom.TagName.PROGRESS = new e.dom.TagName("PROGRESS");
    e.dom.TagName.Q = new e.dom.TagName("Q");
    e.dom.TagName.RP = new e.dom.TagName("RP");
    e.dom.TagName.RT = new e.dom.TagName("RT");
    e.dom.TagName.RTC = new e.dom.TagName("RTC");
    e.dom.TagName.RUBY = new e.dom.TagName("RUBY");
    e.dom.TagName.S = new e.dom.TagName("S");
    e.dom.TagName.SAMP = new e.dom.TagName("SAMP");
    e.dom.TagName.SCRIPT = new e.dom.TagName("SCRIPT");
    e.dom.TagName.SECTION = new e.dom.TagName("SECTION");
    e.dom.TagName.SELECT = new e.dom.TagName("SELECT");
    e.dom.TagName.SMALL = new e.dom.TagName("SMALL");
    e.dom.TagName.SOURCE = new e.dom.TagName("SOURCE");
    e.dom.TagName.SPAN = new e.dom.TagName("SPAN");
    e.dom.TagName.STRIKE = new e.dom.TagName("STRIKE");
    e.dom.TagName.STRONG = new e.dom.TagName("STRONG");
    e.dom.TagName.STYLE = new e.dom.TagName("STYLE");
    e.dom.TagName.SUB = new e.dom.TagName("SUB");
    e.dom.TagName.SUMMARY = new e.dom.TagName("SUMMARY");
    e.dom.TagName.SUP = new e.dom.TagName("SUP");
    e.dom.TagName.SVG = new e.dom.TagName("SVG");
    e.dom.TagName.TABLE = new e.dom.TagName("TABLE");
    e.dom.TagName.TBODY = new e.dom.TagName("TBODY");
    e.dom.TagName.TD = new e.dom.TagName("TD");
    e.dom.TagName.TEMPLATE = new e.dom.TagName("TEMPLATE");
    e.dom.TagName.TEXTAREA = new e.dom.TagName("TEXTAREA");
    e.dom.TagName.TFOOT = new e.dom.TagName("TFOOT");
    e.dom.TagName.TH = new e.dom.TagName("TH");
    e.dom.TagName.THEAD = new e.dom.TagName("THEAD");
    e.dom.TagName.TIME = new e.dom.TagName("TIME");
    e.dom.TagName.TITLE = new e.dom.TagName("TITLE");
    e.dom.TagName.TR = new e.dom.TagName("TR");
    e.dom.TagName.TRACK = new e.dom.TagName("TRACK");
    e.dom.TagName.TT = new e.dom.TagName("TT");
    e.dom.TagName.U = new e.dom.TagName("U");
    e.dom.TagName.UL = new e.dom.TagName("UL");
    e.dom.TagName.VAR = new e.dom.TagName("VAR");
    e.dom.TagName.VIDEO = new e.dom.TagName("VIDEO");
    e.dom.TagName.WBR = new e.dom.TagName("WBR");
    e.dom.tags = {};
    e.dom.tags.VOID_TAGS_ = {
        area: !0,
        base: !0,
        br: !0,
        col: !0,
        command: !0,
        embed: !0,
        hr: !0,
        img: !0,
        input: !0,
        keygen: !0,
        link: !0,
        meta: !0,
        param: !0,
        source: !0,
        track: !0,
        wbr: !0
    };
    e.dom.tags.isVoidTag = function (a) {
        return !0 === e.dom.tags.VOID_TAGS_[a]
    };
    e.html = {};
    e.html.trustedtypes = {};
    e.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY = e.TRUSTED_TYPES_POLICY_NAME ? e.createTrustedTypesPolicy(e.TRUSTED_TYPES_POLICY_NAME + "#html") : null;
    e.string = {};
    e.string.TypedString = function () {
    };
    e.string.Const = function (a, c) {
        this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = a === e.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ && c || "";
        this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = e.string.Const.TYPE_MARKER_
    };
    e.string.Const.prototype.implementsGoogStringTypedString = !0;
    e.string.Const.prototype.getTypedStringValue = function () {
        return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_
    };
    e.DEBUG && (e.string.Const.prototype.toString = function () {
        return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}"
    });
    e.string.Const.unwrap = function (a) {
        if (a instanceof e.string.Const && a.constructor === e.string.Const && a.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === e.string.Const.TYPE_MARKER_) return a.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
        e.asserts.fail("expected object of type Const, got '" + a + "'");
        return "type_error:Const"
    };
    e.string.Const.from = function (a) {
        return new e.string.Const(e.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_, a)
    };
    e.string.Const.TYPE_MARKER_ = {};
    e.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ = {};
    e.string.Const.EMPTY = e.string.Const.from("");
    e.html.SafeScript = function () {
        this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "";
        this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.SafeScript.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeScript.fromConstant = function (a) {
        a = e.string.Const.unwrap(a);
        return 0 === a.length ? e.html.SafeScript.EMPTY : e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeScript.fromConstantAndArgs = function (a, c) {
        for (var d = [], f = 1; f < arguments.length; f++) d.push(e.html.SafeScript.stringify_(arguments[f]));
        return e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("(" + e.string.Const.unwrap(a) + ")(" + d.join(", ") + ");")
    };
    e.html.SafeScript.fromJson = function (a) {
        return e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(e.html.SafeScript.stringify_(a))
    };
    e.html.SafeScript.prototype.getTypedStringValue = function () {
        return this.privateDoNotAccessOrElseSafeScriptWrappedValue_.toString()
    };
    e.DEBUG && (e.html.SafeScript.prototype.toString = function () {
        return "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}"
    });
    e.html.SafeScript.unwrap = function (a) {
        return e.html.SafeScript.unwrapTrustedScript(a).toString()
    };
    e.html.SafeScript.unwrapTrustedScript = function (a) {
        if (a instanceof e.html.SafeScript && a.constructor === e.html.SafeScript && a.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseSafeScriptWrappedValue_;
        e.asserts.fail("expected object of type SafeScript, got '" + a + "' of type " + e.typeOf(a));
        return "type_error:SafeScript"
    };
    e.html.SafeScript.stringify_ = function (a) {
        return JSON.stringify(a).replace(/</g, "\\x3c")
    };
    e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse = function (a) {
        return (new e.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(a)
    };
    e.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_ = function (a) {
        this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = e.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY ? e.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY.createScript(a) : a;
        return this
    };
    e.html.SafeScript.EMPTY = e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("");
    e.fs = {};
    e.fs.url = {};
    e.fs.url.createObjectUrl = function (a) {
        return e.fs.url.getUrlObject_().createObjectURL(a)
    };
    e.fs.url.revokeObjectUrl = function (a) {
        e.fs.url.getUrlObject_().revokeObjectURL(a)
    };
    e.fs.url.getUrlObject_ = function () {
        var a = e.fs.url.findUrlObject_();
        if (null != a) return a;
        throw Error("This browser doesn't seem to support blob URLs");
    };
    e.fs.url.findUrlObject_ = function () {
        return void 0 !== e.global.URL && void 0 !== e.global.URL.createObjectURL ? e.global.URL : void 0 !== e.global.webkitURL && void 0 !== e.global.webkitURL.createObjectURL ? e.global.webkitURL : void 0 !== e.global.createObjectURL ? e.global : null
    };
    e.fs.url.browserSupportsObjectUrls = function () {
        return null != e.fs.url.findUrlObject_()
    };
    e.i18n = {};
    e.i18n.bidi = {};
    e.i18n.bidi.FORCE_RTL = !1;
    e.i18n.bidi.IS_RTL = e.i18n.bidi.FORCE_RTL || ("ar" == e.LOCALE.substring(0, 2).toLowerCase() || "fa" == e.LOCALE.substring(0, 2).toLowerCase() || "he" == e.LOCALE.substring(0, 2).toLowerCase() || "iw" == e.LOCALE.substring(0, 2).toLowerCase() || "ps" == e.LOCALE.substring(0, 2).toLowerCase() || "sd" == e.LOCALE.substring(0, 2).toLowerCase() || "ug" == e.LOCALE.substring(0, 2).toLowerCase() || "ur" == e.LOCALE.substring(0, 2).toLowerCase() || "yi" == e.LOCALE.substring(0, 2).toLowerCase()) && (2 == e.LOCALE.length || "-" == e.LOCALE.substring(2, 3) || "_" ==
        e.LOCALE.substring(2, 3)) || 3 <= e.LOCALE.length && "ckb" == e.LOCALE.substring(0, 3).toLowerCase() && (3 == e.LOCALE.length || "-" == e.LOCALE.substring(3, 4) || "_" == e.LOCALE.substring(3, 4)) || 7 <= e.LOCALE.length && ("-" == e.LOCALE.substring(2, 3) || "_" == e.LOCALE.substring(2, 3)) && ("adlm" == e.LOCALE.substring(3, 7).toLowerCase() || "arab" == e.LOCALE.substring(3, 7).toLowerCase() || "hebr" == e.LOCALE.substring(3, 7).toLowerCase() || "nkoo" == e.LOCALE.substring(3, 7).toLowerCase() || "rohg" == e.LOCALE.substring(3, 7).toLowerCase() || "thaa" == e.LOCALE.substring(3,
        7).toLowerCase()) || 8 <= e.LOCALE.length && ("-" == e.LOCALE.substring(3, 4) || "_" == e.LOCALE.substring(3, 4)) && ("adlm" == e.LOCALE.substring(4, 8).toLowerCase() || "arab" == e.LOCALE.substring(4, 8).toLowerCase() || "hebr" == e.LOCALE.substring(4, 8).toLowerCase() || "nkoo" == e.LOCALE.substring(4, 8).toLowerCase() || "rohg" == e.LOCALE.substring(4, 8).toLowerCase() || "thaa" == e.LOCALE.substring(4, 8).toLowerCase());
    e.i18n.bidi.Format = {LRE: "\u202a", RLE: "\u202b", PDF: "\u202c", LRM: "\u200e", RLM: "\u200f"};
    e.i18n.bidi.Dir = {LTR: 1, RTL: -1, NEUTRAL: 0};
    e.i18n.bidi.RIGHT = "right";
    e.i18n.bidi.LEFT = "left";
    e.i18n.bidi.I18N_RIGHT = e.i18n.bidi.IS_RTL ? e.i18n.bidi.LEFT : e.i18n.bidi.RIGHT;
    e.i18n.bidi.I18N_LEFT = e.i18n.bidi.IS_RTL ? e.i18n.bidi.RIGHT : e.i18n.bidi.LEFT;
    e.i18n.bidi.toDir = function (a, c) {
        return "number" == typeof a ? 0 < a ? e.i18n.bidi.Dir.LTR : 0 > a ? e.i18n.bidi.Dir.RTL : c ? null : e.i18n.bidi.Dir.NEUTRAL : null == a ? null : a ? e.i18n.bidi.Dir.RTL : e.i18n.bidi.Dir.LTR
    };
    e.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
    e.i18n.bidi.rtlChars_ = "\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc";
    e.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
    e.i18n.bidi.stripHtmlIfNeeded_ = function (a, c) {
        return c ? a.replace(e.i18n.bidi.htmlSkipReg_, "") : a
    };
    e.i18n.bidi.rtlCharReg_ = new RegExp("[" + e.i18n.bidi.rtlChars_ + "]");
    e.i18n.bidi.ltrCharReg_ = new RegExp("[" + e.i18n.bidi.ltrChars_ + "]");
    e.i18n.bidi.hasAnyRtl = function (a, c) {
        return e.i18n.bidi.rtlCharReg_.test(e.i18n.bidi.stripHtmlIfNeeded_(a, c))
    };
    e.i18n.bidi.hasRtlChar = e.i18n.bidi.hasAnyRtl;
    e.i18n.bidi.hasAnyLtr = function (a, c) {
        return e.i18n.bidi.ltrCharReg_.test(e.i18n.bidi.stripHtmlIfNeeded_(a, c))
    };
    e.i18n.bidi.ltrRe_ = new RegExp("^[" + e.i18n.bidi.ltrChars_ + "]");
    e.i18n.bidi.rtlRe_ = new RegExp("^[" + e.i18n.bidi.rtlChars_ + "]");
    e.i18n.bidi.isRtlChar = function (a) {
        return e.i18n.bidi.rtlRe_.test(a)
    };
    e.i18n.bidi.isLtrChar = function (a) {
        return e.i18n.bidi.ltrRe_.test(a)
    };
    e.i18n.bidi.isNeutralChar = function (a) {
        return !e.i18n.bidi.isLtrChar(a) && !e.i18n.bidi.isRtlChar(a)
    };
    e.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + e.i18n.bidi.rtlChars_ + "]*[" + e.i18n.bidi.ltrChars_ + "]");
    e.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + e.i18n.bidi.ltrChars_ + "]*[" + e.i18n.bidi.rtlChars_ + "]");
    e.i18n.bidi.startsWithRtl = function (a, c) {
        return e.i18n.bidi.rtlDirCheckRe_.test(e.i18n.bidi.stripHtmlIfNeeded_(a, c))
    };
    e.i18n.bidi.isRtlText = e.i18n.bidi.startsWithRtl;
    e.i18n.bidi.startsWithLtr = function (a, c) {
        return e.i18n.bidi.ltrDirCheckRe_.test(e.i18n.bidi.stripHtmlIfNeeded_(a, c))
    };
    e.i18n.bidi.isLtrText = e.i18n.bidi.startsWithLtr;
    e.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
    e.i18n.bidi.isNeutralText = function (a, c) {
        a = e.i18n.bidi.stripHtmlIfNeeded_(a, c);
        return e.i18n.bidi.isRequiredLtrRe_.test(a) || !e.i18n.bidi.hasAnyLtr(a) && !e.i18n.bidi.hasAnyRtl(a)
    };
    e.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + e.i18n.bidi.ltrChars_ + "][^" + e.i18n.bidi.rtlChars_ + "]*$");
    e.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + e.i18n.bidi.rtlChars_ + "][^" + e.i18n.bidi.ltrChars_ + "]*$");
    e.i18n.bidi.endsWithLtr = function (a, c) {
        return e.i18n.bidi.ltrExitDirCheckRe_.test(e.i18n.bidi.stripHtmlIfNeeded_(a, c))
    };
    e.i18n.bidi.isLtrExitText = e.i18n.bidi.endsWithLtr;
    e.i18n.bidi.endsWithRtl = function (a, c) {
        return e.i18n.bidi.rtlExitDirCheckRe_.test(e.i18n.bidi.stripHtmlIfNeeded_(a, c))
    };
    e.i18n.bidi.isRtlExitText = e.i18n.bidi.endsWithRtl;
    e.i18n.bidi.rtlLocalesRe_ = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
    e.i18n.bidi.isRtlLanguage = function (a) {
        return e.i18n.bidi.rtlLocalesRe_.test(a)
    };
    e.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
    e.i18n.bidi.guardBracketInText = function (a, c) {
        c = (void 0 === c ? e.i18n.bidi.hasAnyRtl(a) : c) ? e.i18n.bidi.Format.RLM : e.i18n.bidi.Format.LRM;
        return a.replace(e.i18n.bidi.bracketGuardTextRe_, c + "$&" + c)
    };
    e.i18n.bidi.enforceRtlInHtml = function (a) {
        return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + a + "</span>"
    };
    e.i18n.bidi.enforceRtlInText = function (a) {
        return e.i18n.bidi.Format.RLE + a + e.i18n.bidi.Format.PDF
    };
    e.i18n.bidi.enforceLtrInHtml = function (a) {
        return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + a + "</span>"
    };
    e.i18n.bidi.enforceLtrInText = function (a) {
        return e.i18n.bidi.Format.LRE + a + e.i18n.bidi.Format.PDF
    };
    e.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
    e.i18n.bidi.leftRe_ = /left/gi;
    e.i18n.bidi.rightRe_ = /right/gi;
    e.i18n.bidi.tempRe_ = /%%%%/g;
    e.i18n.bidi.mirrorCSS = function (a) {
        return a.replace(e.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(e.i18n.bidi.leftRe_, "%%%%").replace(e.i18n.bidi.rightRe_, e.i18n.bidi.LEFT).replace(e.i18n.bidi.tempRe_, e.i18n.bidi.RIGHT)
    };
    e.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
    e.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
    e.i18n.bidi.normalizeHebrewQuote = function (a) {
        return a.replace(e.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(e.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3")
    };
    e.i18n.bidi.wordSeparatorRe_ = /\s+/;
    e.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;
    e.i18n.bidi.rtlDetectionThreshold_ = .4;
    e.i18n.bidi.estimateDirection = function (a, c) {
        var d = 0, f = 0, g = !1;
        a = e.i18n.bidi.stripHtmlIfNeeded_(a, c).split(e.i18n.bidi.wordSeparatorRe_);
        for (c = 0; c < a.length; c++) {
            var h = a[c];
            e.i18n.bidi.startsWithRtl(h) ? (d++, f++) : e.i18n.bidi.isRequiredLtrRe_.test(h) ? g = !0 : e.i18n.bidi.hasAnyLtr(h) ? f++ : e.i18n.bidi.hasNumeralsRe_.test(h) && (g = !0)
        }
        return 0 == f ? g ? e.i18n.bidi.Dir.LTR : e.i18n.bidi.Dir.NEUTRAL : d / f > e.i18n.bidi.rtlDetectionThreshold_ ? e.i18n.bidi.Dir.RTL : e.i18n.bidi.Dir.LTR
    };
    e.i18n.bidi.detectRtlDirectionality = function (a, c) {
        return e.i18n.bidi.estimateDirection(a, c) == e.i18n.bidi.Dir.RTL
    };
    e.i18n.bidi.setElementDirAndAlign = function (a, c) {
        a && (c = e.i18n.bidi.toDir(c)) && (a.style.textAlign = c == e.i18n.bidi.Dir.RTL ? e.i18n.bidi.RIGHT : e.i18n.bidi.LEFT, a.dir = c == e.i18n.bidi.Dir.RTL ? "rtl" : "ltr")
    };
    e.i18n.bidi.setElementDirByTextDirectionality = function (a, c) {
        switch (e.i18n.bidi.estimateDirection(c)) {
            case e.i18n.bidi.Dir.LTR:
                a.dir = "ltr";
                break;
            case e.i18n.bidi.Dir.RTL:
                a.dir = "rtl";
                break;
            default:
                a.removeAttribute("dir")
        }
    };
    e.i18n.bidi.DirectionalString = function () {
    };
    e.html.TrustedResourceUrl = function (a, c) {
        this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = a === e.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_ && c || "";
        this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = !0;
    e.html.TrustedResourceUrl.prototype.getTypedStringValue = function () {
        return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_.toString()
    };
    e.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
    e.html.TrustedResourceUrl.prototype.getDirection = function () {
        return e.i18n.bidi.Dir.LTR
    };
    e.html.TrustedResourceUrl.prototype.cloneWithParams = function (a, c) {
        var d = e.html.TrustedResourceUrl.unwrap(this);
        d = e.html.TrustedResourceUrl.URL_PARAM_PARSER_.exec(d);
        var f = d[3] || "";
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(d[1] + e.html.TrustedResourceUrl.stringifyParams_("?", d[2] || "", a) + e.html.TrustedResourceUrl.stringifyParams_("#", f, c))
    };
    e.DEBUG && (e.html.TrustedResourceUrl.prototype.toString = function () {
        return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}"
    });
    e.html.TrustedResourceUrl.unwrap = function (a) {
        return e.html.TrustedResourceUrl.unwrapTrustedScriptURL(a).toString()
    };
    e.html.TrustedResourceUrl.unwrapTrustedScriptURL = function (a) {
        if (a instanceof e.html.TrustedResourceUrl && a.constructor === e.html.TrustedResourceUrl && a.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
        e.asserts.fail("expected object of type TrustedResourceUrl, got '" + a + "' of type " + e.typeOf(a));
        return "type_error:TrustedResourceUrl"
    };
    e.html.TrustedResourceUrl.format = function (a, c) {
        var d = e.string.Const.unwrap(a);
        if (!e.html.TrustedResourceUrl.BASE_URL_.test(d)) throw Error("Invalid TrustedResourceUrl format: " + d);
        a = d.replace(e.html.TrustedResourceUrl.FORMAT_MARKER_, function (a, g) {
            if (!Object.prototype.hasOwnProperty.call(c, g)) throw Error('Found marker, "' + g + '", in format string, "' + d + '", but no valid label mapping found in args: ' + JSON.stringify(c));
            a = c[g];
            return a instanceof e.string.Const ? e.string.Const.unwrap(a) : encodeURIComponent(String(a))
        });
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.TrustedResourceUrl.FORMAT_MARKER_ = /%{(\w+)}/g;
    e.html.TrustedResourceUrl.BASE_URL_ = /^((https:)?\/\/[0-9a-z.:[\]-]+\/|\/[^/\\]|[^:/\\%]+\/|[^:/\\%]*[?#]|about:blank#)/i;
    e.html.TrustedResourceUrl.URL_PARAM_PARSER_ = /^([^?#]*)(\?[^#]*)?(#[\s\S]*)?/;
    e.html.TrustedResourceUrl.formatWithParams = function (a, c, d, f) {
        return e.html.TrustedResourceUrl.format(a, c).cloneWithParams(d, f)
    };
    e.html.TrustedResourceUrl.fromConstant = function (a) {
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(e.string.Const.unwrap(a))
    };
    e.html.TrustedResourceUrl.fromConstants = function (a) {
        for (var c = "", d = 0; d < a.length; d++) c += e.string.Const.unwrap(a[d]);
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function (a) {
        a = e.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY ? e.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY.createScriptURL(a) : a;
        return new e.html.TrustedResourceUrl(e.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_, a)
    };
    e.html.TrustedResourceUrl.stringifyParams_ = function (a, c, d) {
        if (null == d) return c;
        if ("string" === typeof d) return d ? a + encodeURIComponent(d) : "";
        for (var f in d) {
            var g = d[f];
            g = e.isArray(g) ? g : [g];
            for (var h = 0; h < g.length; h++) {
                var l = g[h];
                null != l && (c || (c = a), c += (c.length > a.length ? "&" : "") + encodeURIComponent(f) + "=" + encodeURIComponent(String(l)))
            }
        }
        return c
    };
    e.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
    e.string.internal = {};
    e.string.internal.startsWith = function (a, c) {
        return 0 == a.lastIndexOf(c, 0)
    };
    e.string.internal.endsWith = function (a, c) {
        var d = a.length - c.length;
        return 0 <= d && a.indexOf(c, d) == d
    };
    e.string.internal.caseInsensitiveStartsWith = function (a, c) {
        return 0 == e.string.internal.caseInsensitiveCompare(c, a.substr(0, c.length))
    };
    e.string.internal.caseInsensitiveEndsWith = function (a, c) {
        return 0 == e.string.internal.caseInsensitiveCompare(c, a.substr(a.length - c.length, c.length))
    };
    e.string.internal.caseInsensitiveEquals = function (a, c) {
        return a.toLowerCase() == c.toLowerCase()
    };
    e.string.internal.isEmptyOrWhitespace = function (a) {
        return /^[\s\xa0]*$/.test(a)
    };
    e.string.internal.trim = e.TRUSTED_SITE && String.prototype.trim ? function (a) {
        return a.trim()
    } : function (a) {
        return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
    };
    e.string.internal.caseInsensitiveCompare = function (a, c) {
        a = String(a).toLowerCase();
        c = String(c).toLowerCase();
        return a < c ? -1 : a == c ? 0 : 1
    };
    e.string.internal.newLineToBr = function (a, c) {
        return a.replace(/(\r\n|\r|\n)/g, c ? "<br />" : "<br>")
    };
    e.string.internal.htmlEscape = function (a, c) {
        if (c) a = a.replace(e.string.internal.AMP_RE_, "&amp;").replace(e.string.internal.LT_RE_, "&lt;").replace(e.string.internal.GT_RE_, "&gt;").replace(e.string.internal.QUOT_RE_, "&quot;").replace(e.string.internal.SINGLE_QUOTE_RE_, "&#39;").replace(e.string.internal.NULL_RE_, "&#0;"); else {
            if (!e.string.internal.ALL_RE_.test(a)) return a;
            -1 != a.indexOf("&") && (a = a.replace(e.string.internal.AMP_RE_, "&amp;"));
            -1 != a.indexOf("<") && (a = a.replace(e.string.internal.LT_RE_, "&lt;"));
            -1 != a.indexOf(">") && (a = a.replace(e.string.internal.GT_RE_, "&gt;"));
            -1 != a.indexOf('"') && (a = a.replace(e.string.internal.QUOT_RE_, "&quot;"));
            -1 != a.indexOf("'") && (a = a.replace(e.string.internal.SINGLE_QUOTE_RE_, "&#39;"));
            -1 != a.indexOf("\x00") && (a = a.replace(e.string.internal.NULL_RE_, "&#0;"))
        }
        return a
    };
    e.string.internal.AMP_RE_ = /&/g;
    e.string.internal.LT_RE_ = /</g;
    e.string.internal.GT_RE_ = />/g;
    e.string.internal.QUOT_RE_ = /"/g;
    e.string.internal.SINGLE_QUOTE_RE_ = /'/g;
    e.string.internal.NULL_RE_ = /\x00/g;
    e.string.internal.ALL_RE_ = /[\x00&<>"']/;
    e.string.internal.whitespaceEscape = function (a, c) {
        return e.string.internal.newLineToBr(a.replace(/  /g, " &#160;"), c)
    };
    e.string.internal.contains = function (a, c) {
        return -1 != a.indexOf(c)
    };
    e.string.internal.caseInsensitiveContains = function (a, c) {
        return e.string.internal.contains(a.toLowerCase(), c.toLowerCase())
    };
    e.string.internal.compareVersions = function (a, c) {
        var d = 0;
        a = e.string.internal.trim(String(a)).split(".");
        c = e.string.internal.trim(String(c)).split(".");
        for (var f = Math.max(a.length, c.length), g = 0; 0 == d && g < f; g++) {
            var h = a[g] || "", l = c[g] || "";
            do {
                h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
                l = /(\d*)(\D*)(.*)/.exec(l) || ["", "", "", ""];
                if (0 == h[0].length && 0 == l[0].length) break;
                d = 0 == h[1].length ? 0 : parseInt(h[1], 10);
                var m = 0 == l[1].length ? 0 : parseInt(l[1], 10);
                d = e.string.internal.compareElements_(d, m) || e.string.internal.compareElements_(0 ==
                    h[2].length, 0 == l[2].length) || e.string.internal.compareElements_(h[2], l[2]);
                h = h[3];
                l = l[3]
            } while (0 == d)
        }
        return d
    };
    e.string.internal.compareElements_ = function (a, c) {
        return a < c ? -1 : a > c ? 1 : 0
    };
    e.html.SafeUrl = function (a, c) {
        this.privateDoNotAccessOrElseSafeUrlWrappedValue_ = a === e.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_ && c || "";
        this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
    e.html.SafeUrl.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeUrl.prototype.getTypedStringValue = function () {
        return this.privateDoNotAccessOrElseSafeUrlWrappedValue_.toString()
    };
    e.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
    e.html.SafeUrl.prototype.getDirection = function () {
        return e.i18n.bidi.Dir.LTR
    };
    e.DEBUG && (e.html.SafeUrl.prototype.toString = function () {
        return "SafeUrl{" + this.privateDoNotAccessOrElseSafeUrlWrappedValue_ + "}"
    });
    e.html.SafeUrl.unwrap = function (a) {
        if (a instanceof e.html.SafeUrl && a.constructor === e.html.SafeUrl && a.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseSafeUrlWrappedValue_;
        e.asserts.fail("expected object of type SafeUrl, got '" + a + "' of type " + e.typeOf(a));
        return "type_error:SafeUrl"
    };
    e.html.SafeUrl.fromConstant = function (a) {
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(e.string.Const.unwrap(a))
    };
    e.html.SAFE_MIME_TYPE_PATTERN_ = /^(?:audio\/(?:3gpp2|3gpp|aac|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-wav|wav|webm)|image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon)|text\/csv|video\/(?:mpeg|mp4|ogg|webm|quicktime))(?:;\w+=(?:\w+|"[\w;=]+"))*$/i;
    e.html.SafeUrl.isSafeMimeType = function (a) {
        return e.html.SAFE_MIME_TYPE_PATTERN_.test(a)
    };
    e.html.SafeUrl.fromBlob = function (a) {
        a = e.html.SAFE_MIME_TYPE_PATTERN_.test(a.type) ? e.fs.url.createObjectUrl(a) : e.html.SafeUrl.INNOCUOUS_STRING;
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.DATA_URL_PATTERN_ = /^data:([^,]*);base64,[a-z0-9+\/]+=*$/i;
    e.html.SafeUrl.fromDataUrl = function (a) {
        a = a.replace(/(%0A|%0D)/g, "");
        var c = a.match(e.html.DATA_URL_PATTERN_);
        c = c && e.html.SAFE_MIME_TYPE_PATTERN_.test(c[1]);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(c ? a : e.html.SafeUrl.INNOCUOUS_STRING)
    };
    e.html.SafeUrl.fromTelUrl = function (a) {
        e.string.internal.caseInsensitiveStartsWith(a, "tel:") || (a = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SIP_URL_PATTERN_ = /^sip[s]?:[+a-z0-9_.!$%&'*\/=^`{|}~-]+@([a-z0-9-]+\.)+[a-z0-9]{2,63}$/i;
    e.html.SafeUrl.fromSipUrl = function (a) {
        e.html.SIP_URL_PATTERN_.test(decodeURIComponent(a)) || (a = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeUrl.fromFacebookMessengerUrl = function (a) {
        e.string.internal.caseInsensitiveStartsWith(a, "fb-messenger://share") || (a = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeUrl.fromWhatsAppUrl = function (a) {
        e.string.internal.caseInsensitiveStartsWith(a, "whatsapp://send") || (a = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeUrl.fromSmsUrl = function (a) {
        e.string.internal.caseInsensitiveStartsWith(a, "sms:") && e.html.SafeUrl.isSmsUrlBodyValid_(a) || (a = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeUrl.isSmsUrlBodyValid_ = function (a) {
        var c = a.indexOf("#");
        0 < c && (a = a.substring(0, c));
        c = a.match(/[?&]body=/gi);
        if (!c) return !0;
        if (1 < c.length) return !1;
        a = a.match(/[?&]body=([^&]*)/)[1];
        if (!a) return !0;
        try {
            decodeURIComponent(a)
        } catch (d) {
            return !1
        }
        return /^(?:[a-z0-9\-_.~]|%[0-9a-f]{2})+$/i.test(a)
    };
    e.html.SafeUrl.fromSshUrl = function (a) {
        e.string.internal.caseInsensitiveStartsWith(a, "ssh://") || (a = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeUrl.sanitizeChromeExtensionUrl = function (a, c) {
        return e.html.SafeUrl.sanitizeExtensionUrl_(/^chrome-extension:\/\/([^\/]+)\//, a, c)
    };
    e.html.SafeUrl.sanitizeFirefoxExtensionUrl = function (a, c) {
        return e.html.SafeUrl.sanitizeExtensionUrl_(/^moz-extension:\/\/([^\/]+)\//, a, c)
    };
    e.html.SafeUrl.sanitizeEdgeExtensionUrl = function (a, c) {
        return e.html.SafeUrl.sanitizeExtensionUrl_(/^ms-browser-extension:\/\/([^\/]+)\//, a, c)
    };
    e.html.SafeUrl.sanitizeExtensionUrl_ = function (a, c, d) {
        (a = a.exec(c)) ? (a = a[1], -1 == (d instanceof e.string.Const ? [e.string.Const.unwrap(d)] : d.map(function (a) {
            return e.string.Const.unwrap(a)
        })).indexOf(a) && (c = e.html.SafeUrl.INNOCUOUS_STRING)) : c = e.html.SafeUrl.INNOCUOUS_STRING;
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.SafeUrl.fromTrustedResourceUrl = function (a) {
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(e.html.TrustedResourceUrl.unwrap(a))
    };
    e.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
    e.html.SafeUrl.SAFE_URL_PATTERN = e.html.SAFE_URL_PATTERN_;
    e.html.SafeUrl.sanitize = function (a) {
        if (a instanceof e.html.SafeUrl) return a;
        a = "object" == typeof a && a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
        e.html.SAFE_URL_PATTERN_.test(a) || (a = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeUrl.sanitizeAssertUnchanged = function (a, c) {
        if (a instanceof e.html.SafeUrl) return a;
        a = "object" == typeof a && a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
        if (c && /^data:/i.test(a) && (c = e.html.SafeUrl.fromDataUrl(a), c.getTypedStringValue() == a)) return c;
        e.asserts.assert(e.html.SAFE_URL_PATTERN_.test(a), "%s does not match the safe URL pattern", a) || (a = e.html.SafeUrl.INNOCUOUS_STRING);
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function (a) {
        return new e.html.SafeUrl(e.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_, a)
    };
    e.html.SafeUrl.ABOUT_BLANK = e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse("about:blank");
    e.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_ = {};
    e.html.SafeStyle = function () {
        this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
        this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeStyle.fromConstant = function (a) {
        a = e.string.Const.unwrap(a);
        if (0 === a.length) return e.html.SafeStyle.EMPTY;
        e.asserts.assert(e.string.internal.endsWith(a, ";"), "Last character of style string is not ';': " + a);
        e.asserts.assert(e.string.internal.contains(a, ":"), "Style string must contain at least one ':', to specify a \"name: value\" pair: " + a);
        return e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeStyle.prototype.getTypedStringValue = function () {
        return this.privateDoNotAccessOrElseSafeStyleWrappedValue_
    };
    e.DEBUG && (e.html.SafeStyle.prototype.toString = function () {
        return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}"
    });
    e.html.SafeStyle.unwrap = function (a) {
        if (a instanceof e.html.SafeStyle && a.constructor === e.html.SafeStyle && a.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseSafeStyleWrappedValue_;
        e.asserts.fail("expected object of type SafeStyle, got '" + a + "' of type " + e.typeOf(a));
        return "type_error:SafeStyle"
    };
    e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function (a) {
        return (new e.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(a)
    };
    e.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_ = function (a) {
        this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = a;
        return this
    };
    e.html.SafeStyle.EMPTY = e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");
    e.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
    e.html.SafeStyle.create = function (a) {
        var c = "", d;
        for (d in a) {
            if (!/^[-_a-zA-Z0-9]+$/.test(d)) throw Error("Name allows only [-_a-zA-Z0-9], got: " + d);
            var f = a[d];
            null != f && (f = e.isArray(f) ? e.array.map(f, e.html.SafeStyle.sanitizePropertyValue_).join(" ") : e.html.SafeStyle.sanitizePropertyValue_(f), c += d + ":" + f + ";")
        }
        return c ? e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(c) : e.html.SafeStyle.EMPTY
    };
    e.html.SafeStyle.sanitizePropertyValue_ = function (a) {
        if (a instanceof e.html.SafeUrl) return 'url("' + e.html.SafeUrl.unwrap(a).replace(/</g, "%3c").replace(/[\\"]/g, "\\$&") + '")';
        a = a instanceof e.string.Const ? e.string.Const.unwrap(a) : e.html.SafeStyle.sanitizePropertyValueString_(String(a));
        if (/[{;}]/.test(a)) throw new e.asserts.AssertionError("Value does not allow [{;}], got: %s.", [a]);
        return a
    };
    e.html.SafeStyle.sanitizePropertyValueString_ = function (a) {
        var c = a.replace(e.html.SafeStyle.FUNCTIONS_RE_, "$1").replace(e.html.SafeStyle.FUNCTIONS_RE_, "$1").replace(e.html.SafeStyle.URL_RE_, "url");
        if (e.html.SafeStyle.VALUE_RE_.test(c)) {
            if (e.html.SafeStyle.COMMENT_RE_.test(a)) return e.asserts.fail("String value disallows comments, got: " + a), e.html.SafeStyle.INNOCUOUS_STRING;
            if (!e.html.SafeStyle.hasBalancedQuotes_(a)) return e.asserts.fail("String value requires balanced quotes, got: " + a), e.html.SafeStyle.INNOCUOUS_STRING;
            if (!e.html.SafeStyle.hasBalancedSquareBrackets_(a)) return e.asserts.fail("String value requires balanced square brackets and one identifier per pair of brackets, got: " + a), e.html.SafeStyle.INNOCUOUS_STRING
        } else return e.asserts.fail("String value allows only " + e.html.SafeStyle.VALUE_ALLOWED_CHARS_ + " and simple functions, got: " + a), e.html.SafeStyle.INNOCUOUS_STRING;
        return e.html.SafeStyle.sanitizeUrl_(a)
    };
    e.html.SafeStyle.hasBalancedQuotes_ = function (a) {
        for (var c = !0, d = !0, f = 0; f < a.length; f++) {
            var g = a.charAt(f);
            "'" == g && d ? c = !c : '"' == g && c && (d = !d)
        }
        return c && d
    };
    e.html.SafeStyle.hasBalancedSquareBrackets_ = function (a) {
        for (var c = !0, d = /^[-_a-zA-Z0-9]$/, f = 0; f < a.length; f++) {
            var g = a.charAt(f);
            if ("]" == g) {
                if (c) return !1;
                c = !0
            } else if ("[" == g) {
                if (!c) return !1;
                c = !1
            } else if (!c && !d.test(g)) return !1
        }
        return c
    };
    e.html.SafeStyle.VALUE_ALLOWED_CHARS_ = "[-,.\"'%_!# a-zA-Z0-9\\[\\]]";
    e.html.SafeStyle.VALUE_RE_ = new RegExp("^" + e.html.SafeStyle.VALUE_ALLOWED_CHARS_ + "+$");
    e.html.SafeStyle.URL_RE_ = /\b(url\([ \t\n]*)('[ -&(-\[\]-~]*'|"[ !#-\[\]-~]*"|[!#-&*-\[\]-~]*)([ \t\n]*\))/g;
    e.html.SafeStyle.ALLOWED_FUNCTIONS_ = "calc cubic-bezier fit-content hsl hsla matrix minmax repeat rgb rgba (rotate|scale|translate)(X|Y|Z|3d)?".split(" ");
    e.html.SafeStyle.FUNCTIONS_RE_ = new RegExp("\\b(" + e.html.SafeStyle.ALLOWED_FUNCTIONS_.join("|") + ")\\([-+*/0-9a-z.%\\[\\], ]+\\)", "g");
    e.html.SafeStyle.COMMENT_RE_ = /\/\*/;
    e.html.SafeStyle.sanitizeUrl_ = function (a) {
        return a.replace(e.html.SafeStyle.URL_RE_, function (a, d, f, g) {
            var c = "";
            f = f.replace(/^(['"])(.*)\1$/, function (a, d, f) {
                c = d;
                return f
            });
            a = e.html.SafeUrl.sanitize(f).getTypedStringValue();
            return d + c + a + c + g
        })
    };
    e.html.SafeStyle.concat = function (a) {
        function c(a) {
            e.isArray(a) ? e.array.forEach(a, c) : d += e.html.SafeStyle.unwrap(a)
        }

        var d = "";
        e.array.forEach(arguments, c);
        return d ? e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(d) : e.html.SafeStyle.EMPTY
    };
    e.html.SafeStyleSheet = function () {
        this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "";
        this.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_
    };
    e.html.SafeStyleSheet.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeStyleSheet.createRule = function (a, c) {
        if (e.string.internal.contains(a, "<")) throw Error("Selector does not allow '<', got: " + a);
        var d = a.replace(/('|")((?!\1)[^\r\n\f\\]|\\[\s\S])*\1/g, "");
        if (!/^[-_a-zA-Z0-9#.:* ,>+~[\]()=^$|]+$/.test(d)) throw Error("Selector allows only [-_a-zA-Z0-9#.:* ,>+~[\\]()=^$|] and strings, got: " + a);
        if (!e.html.SafeStyleSheet.hasBalancedBrackets_(d)) throw Error("() and [] in selector must be balanced, got: " + a);
        c instanceof e.html.SafeStyle || (c = e.html.SafeStyle.create(c));
        a = a + "{" + e.html.SafeStyle.unwrap(c).replace(/</g, "\\3C ") + "}";
        return e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeStyleSheet.hasBalancedBrackets_ = function (a) {
        for (var c = {"(": ")", "[": "]"}, d = [], f = 0; f < a.length; f++) {
            var g = a[f];
            if (c[g]) d.push(c[g]); else if (e.object.contains(c, g) && d.pop() != g) return !1
        }
        return 0 == d.length
    };
    e.html.SafeStyleSheet.concat = function (a) {
        function c(a) {
            e.isArray(a) ? e.array.forEach(a, c) : d += e.html.SafeStyleSheet.unwrap(a)
        }

        var d = "";
        e.array.forEach(arguments, c);
        return e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(d)
    };
    e.html.SafeStyleSheet.fromConstant = function (a) {
        a = e.string.Const.unwrap(a);
        if (0 === a.length) return e.html.SafeStyleSheet.EMPTY;
        e.asserts.assert(!e.string.internal.contains(a, "<"), "Forbidden '<' character in style sheet string: " + a);
        return e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a)
    };
    e.html.SafeStyleSheet.prototype.getTypedStringValue = function () {
        return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_
    };
    e.DEBUG && (e.html.SafeStyleSheet.prototype.toString = function () {
        return "SafeStyleSheet{" + this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ + "}"
    });
    e.html.SafeStyleSheet.unwrap = function (a) {
        if (a instanceof e.html.SafeStyleSheet && a.constructor === e.html.SafeStyleSheet && a.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
        e.asserts.fail("expected object of type SafeStyleSheet, got '" + a + "' of type " + e.typeOf(a));
        return "type_error:SafeStyleSheet"
    };
    e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse = function (a) {
        return (new e.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(a)
    };
    e.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_ = function (a) {
        this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = a;
        return this
    };
    e.html.SafeStyleSheet.EMPTY = e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse("");
    e.labs = {};
    e.labs.userAgent = {};
    e.labs.userAgent.util = {};
    e.labs.userAgent.util.getNativeUserAgentString_ = function () {
        var a = e.labs.userAgent.util.getNavigator_();
        return a && (a = a.userAgent) ? a : ""
    };
    e.labs.userAgent.util.getNavigator_ = function () {
        return e.global.navigator
    };
    e.labs.userAgent.util.userAgent_ = e.labs.userAgent.util.getNativeUserAgentString_();
    e.labs.userAgent.util.setUserAgent = function (a) {
        e.labs.userAgent.util.userAgent_ = a || e.labs.userAgent.util.getNativeUserAgentString_()
    };
    e.labs.userAgent.util.getUserAgent = function () {
        return e.labs.userAgent.util.userAgent_
    };
    e.labs.userAgent.util.matchUserAgent = function (a) {
        var c = e.labs.userAgent.util.getUserAgent();
        return e.string.internal.contains(c, a)
    };
    e.labs.userAgent.util.matchUserAgentIgnoreCase = function (a) {
        var c = e.labs.userAgent.util.getUserAgent();
        return e.string.internal.caseInsensitiveContains(c, a)
    };
    e.labs.userAgent.util.extractVersionTuples = function (a) {
        for (var c = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, d = [], f; f = c.exec(a);) d.push([f[1], f[2], f[3] || void 0]);
        return d
    };
    e.labs.userAgent.browser = {};
    e.labs.userAgent.browser.matchOpera_ = function () {
        return e.labs.userAgent.util.matchUserAgent("Opera")
    };
    e.labs.userAgent.browser.matchIE_ = function () {
        return e.labs.userAgent.util.matchUserAgent("Trident") || e.labs.userAgent.util.matchUserAgent("MSIE")
    };
    e.labs.userAgent.browser.matchEdgeHtml_ = function () {
        return e.labs.userAgent.util.matchUserAgent("Edge")
    };
    e.labs.userAgent.browser.matchEdgeChromium_ = function () {
        return e.labs.userAgent.util.matchUserAgent("Edg/")
    };
    e.labs.userAgent.browser.matchOperaChromium_ = function () {
        return e.labs.userAgent.util.matchUserAgent("OPR")
    };
    e.labs.userAgent.browser.matchFirefox_ = function () {
        return e.labs.userAgent.util.matchUserAgent("Firefox") || e.labs.userAgent.util.matchUserAgent("FxiOS")
    };
    e.labs.userAgent.browser.matchSafari_ = function () {
        return e.labs.userAgent.util.matchUserAgent("Safari") && !(e.labs.userAgent.browser.matchChrome_() || e.labs.userAgent.browser.matchCoast_() || e.labs.userAgent.browser.matchOpera_() || e.labs.userAgent.browser.matchEdgeHtml_() || e.labs.userAgent.browser.matchEdgeChromium_() || e.labs.userAgent.browser.matchOperaChromium_() || e.labs.userAgent.browser.matchFirefox_() || e.labs.userAgent.browser.isSilk() || e.labs.userAgent.util.matchUserAgent("Android"))
    };
    e.labs.userAgent.browser.matchCoast_ = function () {
        return e.labs.userAgent.util.matchUserAgent("Coast")
    };
    e.labs.userAgent.browser.matchIosWebview_ = function () {
        return (e.labs.userAgent.util.matchUserAgent("iPad") || e.labs.userAgent.util.matchUserAgent("iPhone")) && !e.labs.userAgent.browser.matchSafari_() && !e.labs.userAgent.browser.matchChrome_() && !e.labs.userAgent.browser.matchCoast_() && !e.labs.userAgent.browser.matchFirefox_() && e.labs.userAgent.util.matchUserAgent("AppleWebKit")
    };
    e.labs.userAgent.browser.matchChrome_ = function () {
        return (e.labs.userAgent.util.matchUserAgent("Chrome") || e.labs.userAgent.util.matchUserAgent("CriOS")) && !e.labs.userAgent.browser.matchEdgeHtml_()
    };
    e.labs.userAgent.browser.matchAndroidBrowser_ = function () {
        return e.labs.userAgent.util.matchUserAgent("Android") && !(e.labs.userAgent.browser.isChrome() || e.labs.userAgent.browser.isFirefox() || e.labs.userAgent.browser.isOpera() || e.labs.userAgent.browser.isSilk())
    };
    e.labs.userAgent.browser.isOpera = e.labs.userAgent.browser.matchOpera_;
    e.labs.userAgent.browser.isIE = e.labs.userAgent.browser.matchIE_;
    e.labs.userAgent.browser.isEdge = e.labs.userAgent.browser.matchEdgeHtml_;
    e.labs.userAgent.browser.isEdgeChromium = e.labs.userAgent.browser.matchEdgeChromium_;
    e.labs.userAgent.browser.isOperaChromium = e.labs.userAgent.browser.matchOperaChromium_;
    e.labs.userAgent.browser.isFirefox = e.labs.userAgent.browser.matchFirefox_;
    e.labs.userAgent.browser.isSafari = e.labs.userAgent.browser.matchSafari_;
    e.labs.userAgent.browser.isCoast = e.labs.userAgent.browser.matchCoast_;
    e.labs.userAgent.browser.isIosWebview = e.labs.userAgent.browser.matchIosWebview_;
    e.labs.userAgent.browser.isChrome = e.labs.userAgent.browser.matchChrome_;
    e.labs.userAgent.browser.isAndroidBrowser = e.labs.userAgent.browser.matchAndroidBrowser_;
    e.labs.userAgent.browser.isSilk = function () {
        return e.labs.userAgent.util.matchUserAgent("Silk")
    };
    e.labs.userAgent.browser.getVersion = function () {
        function a(a) {
            a = e.array.find(a, f);
            return d[a] || ""
        }

        var c = e.labs.userAgent.util.getUserAgent();
        if (e.labs.userAgent.browser.isIE()) return e.labs.userAgent.browser.getIEVersion_(c);
        c = e.labs.userAgent.util.extractVersionTuples(c);
        var d = {};
        e.array.forEach(c, function (a) {
            d[a[0]] = a[1]
        });
        var f = e.partial(e.object.containsKey, d);
        return e.labs.userAgent.browser.isOpera() ? a(["Version", "Opera"]) : e.labs.userAgent.browser.isEdge() ? a(["Edge"]) : e.labs.userAgent.browser.isEdgeChromium() ?
            a(["Edg"]) : e.labs.userAgent.browser.isChrome() ? a(["Chrome", "CriOS"]) : (c = c[2]) && c[1] || ""
    };
    e.labs.userAgent.browser.isVersionOrHigher = function (a) {
        return 0 <= e.string.internal.compareVersions(e.labs.userAgent.browser.getVersion(), a)
    };
    e.labs.userAgent.browser.getIEVersion_ = function (a) {
        var c = /rv: *([\d\.]*)/.exec(a);
        if (c && c[1]) return c[1];
        c = "";
        var d = /MSIE +([\d\.]+)/.exec(a);
        if (d && d[1]) if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == d[1]) if (a && a[1]) switch (a[1]) {
            case "4.0":
                c = "8.0";
                break;
            case "5.0":
                c = "9.0";
                break;
            case "6.0":
                c = "10.0";
                break;
            case "7.0":
                c = "11.0"
        } else c = "7.0"; else c = d[1];
        return c
    };
    e.html.SafeHtml = function () {
        this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
        this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = e.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
        this.dir_ = null
    };
    e.html.SafeHtml.ENABLE_ERROR_MESSAGES = e.DEBUG;
    e.html.SafeHtml.SUPPORT_STYLE_ATTRIBUTE = !0;
    e.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = !0;
    e.html.SafeHtml.prototype.getDirection = function () {
        return this.dir_
    };
    e.html.SafeHtml.prototype.implementsGoogStringTypedString = !0;
    e.html.SafeHtml.prototype.getTypedStringValue = function () {
        return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_.toString()
    };
    e.DEBUG && (e.html.SafeHtml.prototype.toString = function () {
        return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}"
    });
    e.html.SafeHtml.unwrap = function (a) {
        return e.html.SafeHtml.unwrapTrustedHTML(a).toString()
    };
    e.html.SafeHtml.unwrapTrustedHTML = function (a) {
        if (a instanceof e.html.SafeHtml && a.constructor === e.html.SafeHtml && a.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === e.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
        e.asserts.fail("expected object of type SafeHtml, got '" + a + "' of type " + e.typeOf(a));
        return "type_error:SafeHtml"
    };
    e.html.SafeHtml.htmlEscape = function (a) {
        if (a instanceof e.html.SafeHtml) return a;
        var c = "object" == typeof a, d = null;
        c && a.implementsGoogI18nBidiDirectionalString && (d = a.getDirection());
        a = c && a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e.string.internal.htmlEscape(a), d)
    };
    e.html.SafeHtml.htmlEscapePreservingNewlines = function (a) {
        if (a instanceof e.html.SafeHtml) return a;
        a = e.html.SafeHtml.htmlEscape(a);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e.string.internal.newLineToBr(e.html.SafeHtml.unwrap(a)), a.getDirection())
    };
    e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function (a) {
        if (a instanceof e.html.SafeHtml) return a;
        a = e.html.SafeHtml.htmlEscape(a);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e.string.internal.whitespaceEscape(e.html.SafeHtml.unwrap(a)), a.getDirection())
    };
    e.html.SafeHtml.from = e.html.SafeHtml.htmlEscape;
    e.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
    e.html.SafeHtml.URL_ATTRIBUTES_ = {
        action: !0,
        cite: !0,
        data: !0,
        formaction: !0,
        href: !0,
        manifest: !0,
        poster: !0,
        src: !0
    };
    e.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = {
        APPLET: !0,
        BASE: !0,
        EMBED: !0,
        IFRAME: !0,
        LINK: !0,
        MATH: !0,
        META: !0,
        OBJECT: !0,
        SCRIPT: !0,
        STYLE: !0,
        SVG: !0,
        TEMPLATE: !0
    };
    e.html.SafeHtml.create = function (a, c, d) {
        e.html.SafeHtml.verifyTagName(String(a));
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(String(a), c, d)
    };
    e.html.SafeHtml.verifyTagName = function (a) {
        if (!e.html.SafeHtml.VALID_NAMES_IN_TAG_.test(a)) throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? "Invalid tag name <" + a + ">." : "");
        if (a.toUpperCase() in e.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? "Tag name <" + a + "> is not allowed for SafeHtml." : "");
    };
    e.html.SafeHtml.createIframe = function (a, c, d, f) {
        a && e.html.TrustedResourceUrl.unwrap(a);
        var g = {};
        g.src = a || null;
        g.srcdoc = c && e.html.SafeHtml.unwrap(c);
        a = e.html.SafeHtml.combineAttributes(g, {sandbox: ""}, d);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", a, f)
    };
    e.html.SafeHtml.createSandboxIframe = function (a, c, d, f) {
        if (!e.html.SafeHtml.canUseSandboxIframe()) throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? "The browser does not support sandboxed iframes." : "");
        var g = {};
        g.src = a ? e.html.SafeUrl.unwrap(e.html.SafeUrl.sanitize(a)) : null;
        g.srcdoc = c || null;
        g.sandbox = "";
        a = e.html.SafeHtml.combineAttributes(g, {}, d);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", a, f)
    };
    e.html.SafeHtml.canUseSandboxIframe = function () {
        return e.global.HTMLIFrameElement && "sandbox" in e.global.HTMLIFrameElement.prototype
    };
    e.html.SafeHtml.createScriptSrc = function (a, c) {
        e.html.TrustedResourceUrl.unwrap(a);
        a = e.html.SafeHtml.combineAttributes({src: a}, {}, c);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", a)
    };
    e.html.SafeHtml.createScript = function (a, c) {
        for (var d in c) {
            var f = d.toLowerCase();
            if ("language" == f || "src" == f || "text" == f || "type" == f) throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? 'Cannot set "' + f + '" attribute' : "");
        }
        d = "";
        a = e.array.concat(a);
        for (f = 0; f < a.length; f++) d += e.html.SafeScript.unwrap(a[f]);
        a = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(d, e.i18n.bidi.Dir.NEUTRAL);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", c, a)
    };
    e.html.SafeHtml.createStyle = function (a, c) {
        c = e.html.SafeHtml.combineAttributes({type: "text/css"}, {}, c);
        var d = "";
        a = e.array.concat(a);
        for (var f = 0; f < a.length; f++) d += e.html.SafeStyleSheet.unwrap(a[f]);
        a = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(d, e.i18n.bidi.Dir.NEUTRAL);
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", c, a)
    };
    e.html.SafeHtml.createMetaRefresh = function (a, c) {
        a = e.html.SafeUrl.unwrap(e.html.SafeUrl.sanitize(a));
        (e.labs.userAgent.browser.isIE() || e.labs.userAgent.browser.isEdge()) && e.string.internal.contains(a, ";") && (a = "'" + a.replace(/'/g, "%27") + "'");
        return e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("meta", {
            "http-equiv": "refresh",
            content: (c || 0) + "; url=" + a
        })
    };
    e.html.SafeHtml.getAttrNameAndValue_ = function (a, c, d) {
        if (d instanceof e.string.Const) d = e.string.Const.unwrap(d); else if ("style" == c.toLowerCase()) if (e.html.SafeHtml.SUPPORT_STYLE_ATTRIBUTE) d = e.html.SafeHtml.getStyleValue_(d); else throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? 'Attribute "style" not supported.' : ""); else {
            if (/^on/i.test(c)) throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? 'Attribute "' + c + '" requires goog.string.Const value, "' + d + '" given.' : "");
            if (c.toLowerCase() in e.html.SafeHtml.URL_ATTRIBUTES_) if (d instanceof
                e.html.TrustedResourceUrl) d = e.html.TrustedResourceUrl.unwrap(d); else if (d instanceof e.html.SafeUrl) d = e.html.SafeUrl.unwrap(d); else if ("string" === typeof d) d = e.html.SafeUrl.sanitize(d).getTypedStringValue(); else throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? 'Attribute "' + c + '" on tag "' + a + '" requires goog.html.SafeUrl, goog.string.Const, or string, value "' + d + '" given.' : "");
        }
        d.implementsGoogStringTypedString && (d = d.getTypedStringValue());
        e.asserts.assert("string" === typeof d || "number" === typeof d,
            "String or number value expected, got " + typeof d + " with value: " + d);
        return c + '="' + e.string.internal.htmlEscape(String(d)) + '"'
    };
    e.html.SafeHtml.getStyleValue_ = function (a) {
        if (!e.isObject(a)) throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? 'The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof a + " given: " + a : "");
        a instanceof e.html.SafeStyle || (a = e.html.SafeStyle.create(a));
        return e.html.SafeStyle.unwrap(a)
    };
    e.html.SafeHtml.createWithDir = function (a, c, d, f) {
        c = e.html.SafeHtml.create(c, d, f);
        c.dir_ = a;
        return c
    };
    e.html.SafeHtml.join = function (a, c) {
        function d(a) {
            e.isArray(a) ? e.array.forEach(a, d) : (a = e.html.SafeHtml.htmlEscape(a), g.push(e.html.SafeHtml.unwrap(a)), a = a.getDirection(), f == e.i18n.bidi.Dir.NEUTRAL ? f = a : a != e.i18n.bidi.Dir.NEUTRAL && f != a && (f = null))
        }

        a = e.html.SafeHtml.htmlEscape(a);
        var f = a.getDirection(), g = [];
        e.array.forEach(c, d);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(g.join(e.html.SafeHtml.unwrap(a)), f)
    };
    e.html.SafeHtml.concat = function (a) {
        return e.html.SafeHtml.join(e.html.SafeHtml.EMPTY, Array.prototype.slice.call(arguments))
    };
    e.html.SafeHtml.concatWithDir = function (a, c) {
        var d = e.html.SafeHtml.concat(e.array.slice(arguments, 1));
        d.dir_ = a;
        return d
    };
    e.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
    e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function (a, c) {
        return (new e.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(a, c)
    };
    e.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_ = function (a, c) {
        this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = e.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY ? e.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY.createHTML(a) : a;
        this.dir_ = c;
        return this
    };
    e.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function (a, c, d) {
        var f = null;
        var g = "<" + a + e.html.SafeHtml.stringifyAttributes(a, c);
        null == d ? d = [] : e.isArray(d) || (d = [d]);
        e.dom.tags.isVoidTag(a.toLowerCase()) ? (e.asserts.assert(!d.length, "Void tag <" + a + "> does not allow content."), g += ">") : (f = e.html.SafeHtml.concat(d), g += ">" + e.html.SafeHtml.unwrap(f) + "</" + a + ">", f = f.getDirection());
        (a = c && c.dir) && (f = /^(ltr|rtl|auto)$/i.test(a) ? e.i18n.bidi.Dir.NEUTRAL : null);
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(g,
            f)
    };
    e.html.SafeHtml.stringifyAttributes = function (a, c) {
        var d = "";
        if (c) for (var f in c) {
            if (!e.html.SafeHtml.VALID_NAMES_IN_TAG_.test(f)) throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? 'Invalid attribute name "' + f + '".' : "");
            var g = c[f];
            null != g && (d += " " + e.html.SafeHtml.getAttrNameAndValue_(a, f, g))
        }
        return d
    };
    e.html.SafeHtml.combineAttributes = function (a, c, d) {
        var f = {}, g;
        for (g in a) e.asserts.assert(g.toLowerCase() == g, "Must be lower case"), f[g] = a[g];
        for (g in c) e.asserts.assert(g.toLowerCase() == g, "Must be lower case"), f[g] = c[g];
        if (d) for (g in d) {
            var h = g.toLowerCase();
            if (h in a) throw Error(e.html.SafeHtml.ENABLE_ERROR_MESSAGES ? 'Cannot override "' + h + '" attribute, got "' + g + '" with value "' + d[g] + '"' : "");
            h in c && delete f[h];
            f[g] = d[g]
        }
        return f
    };
    e.html.SafeHtml.DOCTYPE_HTML = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>", e.i18n.bidi.Dir.NEUTRAL);
    e.html.SafeHtml.EMPTY = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("", e.i18n.bidi.Dir.NEUTRAL);
    e.html.SafeHtml.BR = e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<br>", e.i18n.bidi.Dir.NEUTRAL);
    e.html.uncheckedconversions = {};
    e.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function (a, c, d) {
        e.asserts.assertString(e.string.Const.unwrap(a), "must provide justification");
        e.asserts.assert(!e.string.internal.isEmptyOrWhitespace(e.string.Const.unwrap(a)), "must provide non-empty justification");
        return e.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, d || null)
    };
    e.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract = function (a, c) {
        e.asserts.assertString(e.string.Const.unwrap(a), "must provide justification");
        e.asserts.assert(!e.string.internal.isEmptyOrWhitespace(e.string.Const.unwrap(a)), "must provide non-empty justification");
        return e.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function (a, c) {
        e.asserts.assertString(e.string.Const.unwrap(a), "must provide justification");
        e.asserts.assert(!e.string.internal.isEmptyOrWhitespace(e.string.Const.unwrap(a)), "must provide non-empty justification");
        return e.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract = function (a, c) {
        e.asserts.assertString(e.string.Const.unwrap(a), "must provide justification");
        e.asserts.assert(!e.string.internal.isEmptyOrWhitespace(e.string.Const.unwrap(a)), "must provide non-empty justification");
        return e.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function (a, c) {
        e.asserts.assertString(e.string.Const.unwrap(a), "must provide justification");
        e.asserts.assert(!e.string.internal.isEmptyOrWhitespace(e.string.Const.unwrap(a)), "must provide non-empty justification");
        return e.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(c)
    };
    e.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function (a, c) {
        e.asserts.assertString(e.string.Const.unwrap(a), "must provide justification");
        e.asserts.assert(!e.string.internal.isEmptyOrWhitespace(e.string.Const.unwrap(a)), "must provide non-empty justification");
        return e.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(c)
    };
    e.dom.safe = {};
    e.dom.safe.InsertAdjacentHtmlPosition = {
        AFTERBEGIN: "afterbegin",
        AFTEREND: "afterend",
        BEFOREBEGIN: "beforebegin",
        BEFOREEND: "beforeend"
    };
    e.dom.safe.insertAdjacentHtml = function (a, c, d) {
        a.insertAdjacentHTML(c, e.html.SafeHtml.unwrapTrustedHTML(d))
    };
    e.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_ = {MATH: !0, SCRIPT: !0, STYLE: !0, SVG: !0, TEMPLATE: !0};
    e.dom.safe.isInnerHtmlCleanupRecursive_ = e.functions.cacheReturnValue(function () {
        if (e.DEBUG && "undefined" === typeof document) return !1;
        var a = document.createElement("div"), c = document.createElement("div");
        c.appendChild(document.createElement("div"));
        a.appendChild(c);
        if (e.DEBUG && !a.firstChild) return !1;
        c = a.firstChild.firstChild;
        a.innerHTML = e.html.SafeHtml.unwrapTrustedHTML(e.html.SafeHtml.EMPTY);
        return !c.parentElement
    });
    e.dom.safe.unsafeSetInnerHtmlDoNotUseOrElse = function (a, c) {
        if (e.dom.safe.isInnerHtmlCleanupRecursive_()) for (; a.lastChild;) a.removeChild(a.lastChild);
        a.innerHTML = e.html.SafeHtml.unwrapTrustedHTML(c)
    };
    e.dom.safe.setInnerHtml = function (a, c) {
        if (e.asserts.ENABLE_ASSERTS) {
            var d = a.tagName.toUpperCase();
            if (e.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_[d]) throw Error("goog.dom.safe.setInnerHtml cannot be used to set content of " + a.tagName + ".");
        }
        e.dom.safe.unsafeSetInnerHtmlDoNotUseOrElse(a, c)
    };
    e.dom.safe.setOuterHtml = function (a, c) {
        a.outerHTML = e.html.SafeHtml.unwrapTrustedHTML(c)
    };
    e.dom.safe.setFormElementAction = function (a, c) {
        c = c instanceof e.html.SafeUrl ? c : e.html.SafeUrl.sanitizeAssertUnchanged(c);
        e.dom.asserts.assertIsHTMLFormElement(a).action = e.html.SafeUrl.unwrap(c)
    };
    e.dom.safe.setButtonFormAction = function (a, c) {
        c = c instanceof e.html.SafeUrl ? c : e.html.SafeUrl.sanitizeAssertUnchanged(c);
        e.dom.asserts.assertIsHTMLButtonElement(a).formAction = e.html.SafeUrl.unwrap(c)
    };
    e.dom.safe.setInputFormAction = function (a, c) {
        c = c instanceof e.html.SafeUrl ? c : e.html.SafeUrl.sanitizeAssertUnchanged(c);
        e.dom.asserts.assertIsHTMLInputElement(a).formAction = e.html.SafeUrl.unwrap(c)
    };
    e.dom.safe.setStyle = function (a, c) {
        a.style.cssText = e.html.SafeStyle.unwrap(c)
    };
    e.dom.safe.documentWrite = function (a, c) {
        a.write(e.html.SafeHtml.unwrapTrustedHTML(c))
    };
    e.dom.safe.setAnchorHref = function (a, c) {
        e.dom.asserts.assertIsHTMLAnchorElement(a);
        c = c instanceof e.html.SafeUrl ? c : e.html.SafeUrl.sanitizeAssertUnchanged(c);
        a.href = e.html.SafeUrl.unwrap(c)
    };
    e.dom.safe.setImageSrc = function (a, c) {
        e.dom.asserts.assertIsHTMLImageElement(a);
        if (!(c instanceof e.html.SafeUrl)) {
            var d = /^data:image\//i.test(c);
            c = e.html.SafeUrl.sanitizeAssertUnchanged(c, d)
        }
        a.src = e.html.SafeUrl.unwrap(c)
    };
    e.dom.safe.setAudioSrc = function (a, c) {
        e.dom.asserts.assertIsHTMLAudioElement(a);
        if (!(c instanceof e.html.SafeUrl)) {
            var d = /^data:audio\//i.test(c);
            c = e.html.SafeUrl.sanitizeAssertUnchanged(c, d)
        }
        a.src = e.html.SafeUrl.unwrap(c)
    };
    e.dom.safe.setVideoSrc = function (a, c) {
        e.dom.asserts.assertIsHTMLVideoElement(a);
        if (!(c instanceof e.html.SafeUrl)) {
            var d = /^data:video\//i.test(c);
            c = e.html.SafeUrl.sanitizeAssertUnchanged(c, d)
        }
        a.src = e.html.SafeUrl.unwrap(c)
    };
    e.dom.safe.setEmbedSrc = function (a, c) {
        e.dom.asserts.assertIsHTMLEmbedElement(a);
        a.src = e.html.TrustedResourceUrl.unwrapTrustedScriptURL(c)
    };
    e.dom.safe.setFrameSrc = function (a, c) {
        e.dom.asserts.assertIsHTMLFrameElement(a);
        a.src = e.html.TrustedResourceUrl.unwrap(c)
    };
    e.dom.safe.setIframeSrc = function (a, c) {
        e.dom.asserts.assertIsHTMLIFrameElement(a);
        a.src = e.html.TrustedResourceUrl.unwrap(c)
    };
    e.dom.safe.setIframeSrcdoc = function (a, c) {
        e.dom.asserts.assertIsHTMLIFrameElement(a);
        a.srcdoc = e.html.SafeHtml.unwrapTrustedHTML(c)
    };
    e.dom.safe.setLinkHrefAndRel = function (a, c, d) {
        e.dom.asserts.assertIsHTMLLinkElement(a);
        a.rel = d;
        e.string.internal.caseInsensitiveContains(d, "stylesheet") ? (e.asserts.assert(c instanceof e.html.TrustedResourceUrl, 'URL must be TrustedResourceUrl because "rel" contains "stylesheet"'), a.href = e.html.TrustedResourceUrl.unwrap(c)) : a.href = c instanceof e.html.TrustedResourceUrl ? e.html.TrustedResourceUrl.unwrap(c) : c instanceof e.html.SafeUrl ? e.html.SafeUrl.unwrap(c) : e.html.SafeUrl.unwrap(e.html.SafeUrl.sanitizeAssertUnchanged(c))
    };
    e.dom.safe.setObjectData = function (a, c) {
        e.dom.asserts.assertIsHTMLObjectElement(a);
        a.data = e.html.TrustedResourceUrl.unwrapTrustedScriptURL(c)
    };
    e.dom.safe.setScriptSrc = function (a, c) {
        e.dom.asserts.assertIsHTMLScriptElement(a);
        a.src = e.html.TrustedResourceUrl.unwrapTrustedScriptURL(c);
        (c = e.getScriptNonce()) && a.setAttribute("nonce", c)
    };
    e.dom.safe.setScriptContent = function (a, c) {
        e.dom.asserts.assertIsHTMLScriptElement(a);
        a.text = e.html.SafeScript.unwrapTrustedScript(c);
        (c = e.getScriptNonce()) && a.setAttribute("nonce", c)
    };
    e.dom.safe.setLocationHref = function (a, c) {
        e.dom.asserts.assertIsLocation(a);
        c = c instanceof e.html.SafeUrl ? c : e.html.SafeUrl.sanitizeAssertUnchanged(c);
        a.href = e.html.SafeUrl.unwrap(c)
    };
    e.dom.safe.assignLocation = function (a, c) {
        e.dom.asserts.assertIsLocation(a);
        c = c instanceof e.html.SafeUrl ? c : e.html.SafeUrl.sanitizeAssertUnchanged(c);
        a.assign(e.html.SafeUrl.unwrap(c))
    };
    e.dom.safe.replaceLocation = function (a, c) {
        e.dom.asserts.assertIsLocation(a);
        c = c instanceof e.html.SafeUrl ? c : e.html.SafeUrl.sanitizeAssertUnchanged(c);
        a.replace(e.html.SafeUrl.unwrap(c))
    };
    e.dom.safe.openInWindow = function (a, c, d, f, g) {
        a = a instanceof e.html.SafeUrl ? a : e.html.SafeUrl.sanitizeAssertUnchanged(a);
        return (c || e.global).open(e.html.SafeUrl.unwrap(a), d ? e.string.Const.unwrap(d) : "", f, g)
    };
    e.dom.safe.parseFromStringHtml = function (a, c) {
        return e.dom.safe.parseFromString(a, c, "text/html")
    };
    e.dom.safe.parseFromString = function (a, c, d) {
        return a.parseFromString(e.html.SafeHtml.unwrapTrustedHTML(c), d)
    };
    e.dom.safe.createImageFromBlob = function (a) {
        if (!/^image\/.*/g.test(a.type)) throw Error("goog.dom.safe.createImageFromBlob only accepts MIME type image/.*.");
        var c = e.global.URL.createObjectURL(a);
        a = new e.global.Image;
        a.onload = function () {
            e.global.URL.revokeObjectURL(c)
        };
        e.dom.safe.setImageSrc(a, e.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(e.string.Const.from("Image blob URL."), c));
        return a
    };
    e.string.DETECT_DOUBLE_ESCAPING = !1;
    e.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
    e.string.Unicode = {NBSP: "\u00a0"};
    e.string.startsWith = e.string.internal.startsWith;
    e.string.endsWith = e.string.internal.endsWith;
    e.string.caseInsensitiveStartsWith = e.string.internal.caseInsensitiveStartsWith;
    e.string.caseInsensitiveEndsWith = e.string.internal.caseInsensitiveEndsWith;
    e.string.caseInsensitiveEquals = e.string.internal.caseInsensitiveEquals;
    e.string.subs = function (a, c) {
        for (var d = a.split("%s"), f = "", g = Array.prototype.slice.call(arguments, 1); g.length && 1 < d.length;) f += d.shift() + g.shift();
        return f + d.join("%s")
    };
    e.string.collapseWhitespace = function (a) {
        return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
    };
    e.string.isEmptyOrWhitespace = e.string.internal.isEmptyOrWhitespace;
    e.string.isEmptyString = function (a) {
        return 0 == a.length
    };
    e.string.isEmpty = e.string.isEmptyOrWhitespace;
    e.string.isEmptyOrWhitespaceSafe = function (a) {
        return e.string.isEmptyOrWhitespace(e.string.makeSafe(a))
    };
    e.string.isEmptySafe = e.string.isEmptyOrWhitespaceSafe;
    e.string.isBreakingWhitespace = function (a) {
        return !/[^\t\n\r ]/.test(a)
    };
    e.string.isAlpha = function (a) {
        return !/[^a-zA-Z]/.test(a)
    };
    e.string.isNumeric = function (a) {
        return !/[^0-9]/.test(a)
    };
    e.string.isAlphaNumeric = function (a) {
        return !/[^a-zA-Z0-9]/.test(a)
    };
    e.string.isSpace = function (a) {
        return " " == a
    };
    e.string.isUnicodeChar = function (a) {
        return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
    };
    e.string.stripNewlines = function (a) {
        return a.replace(/(\r\n|\r|\n)+/g, " ")
    };
    e.string.canonicalizeNewlines = function (a) {
        return a.replace(/(\r\n|\r|\n)/g, "\n")
    };
    e.string.normalizeWhitespace = function (a) {
        return a.replace(/\xa0|\s/g, " ")
    };
    e.string.normalizeSpaces = function (a) {
        return a.replace(/\xa0|[ \t]+/g, " ")
    };
    e.string.collapseBreakingSpaces = function (a) {
        return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
    };
    e.string.trim = e.string.internal.trim;
    e.string.trimLeft = function (a) {
        return a.replace(/^[\s\xa0]+/, "")
    };
    e.string.trimRight = function (a) {
        return a.replace(/[\s\xa0]+$/, "")
    };
    e.string.caseInsensitiveCompare = e.string.internal.caseInsensitiveCompare;
    e.string.numberAwareCompare_ = function (a, c, d) {
        if (a == c) return 0;
        if (!a) return -1;
        if (!c) return 1;
        for (var f = a.toLowerCase().match(d), g = c.toLowerCase().match(d), h = Math.min(f.length, g.length), l = 0; l < h; l++) {
            d = f[l];
            var m = g[l];
            if (d != m) return a = parseInt(d, 10), !isNaN(a) && (c = parseInt(m, 10), !isNaN(c) && a - c) ? a - c : d < m ? -1 : 1
        }
        return f.length != g.length ? f.length - g.length : a < c ? -1 : 1
    };
    e.string.intAwareCompare = function (a, c) {
        return e.string.numberAwareCompare_(a, c, /\d+|\D+/g)
    };
    e.string.floatAwareCompare = function (a, c) {
        return e.string.numberAwareCompare_(a, c, /\d+|\.\d+|\D+/g)
    };
    e.string.numerateCompare = e.string.floatAwareCompare;
    e.string.urlEncode = function (a) {
        return encodeURIComponent(String(a))
    };
    e.string.urlDecode = function (a) {
        return decodeURIComponent(a.replace(/\+/g, " "))
    };
    e.string.newLineToBr = e.string.internal.newLineToBr;
    e.string.htmlEscape = function (a, c) {
        a = e.string.internal.htmlEscape(a, c);
        e.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(e.string.E_RE_, "&#101;"));
        return a
    };
    e.string.E_RE_ = /e/g;
    e.string.unescapeEntities = function (a) {
        return e.string.contains(a, "&") ? !e.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in e.global ? e.string.unescapeEntitiesUsingDom_(a) : e.string.unescapePureXmlEntities_(a) : a
    };
    e.string.unescapeEntitiesWithDocument = function (a, c) {
        return e.string.contains(a, "&") ? e.string.unescapeEntitiesUsingDom_(a, c) : a
    };
    e.string.unescapeEntitiesUsingDom_ = function (a, c) {
        var d = {"&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"'};
        var f = c ? c.createElement("div") : e.global.document.createElement("div");
        return a.replace(e.string.HTML_ENTITY_PATTERN_, function (a, c) {
            var g = d[a];
            if (g) return g;
            "#" == c.charAt(0) && (c = Number("0" + c.substr(1)), isNaN(c) || (g = String.fromCharCode(c)));
            g || (e.dom.safe.setInnerHtml(f, e.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(e.string.Const.from("Single HTML entity."), a + " ")), g = f.firstChild.nodeValue.slice(0,
                -1));
            return d[a] = g
        })
    };
    e.string.unescapePureXmlEntities_ = function (a) {
        return a.replace(/&([^;]+);/g, function (a, d) {
            switch (d) {
                case "amp":
                    return "&";
                case "lt":
                    return "<";
                case "gt":
                    return ">";
                case "quot":
                    return '"';
                default:
                    return "#" != d.charAt(0) || (d = Number("0" + d.substr(1)), isNaN(d)) ? a : String.fromCharCode(d)
            }
        })
    };
    e.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
    e.string.whitespaceEscape = function (a, c) {
        return e.string.newLineToBr(a.replace(/  /g, " &#160;"), c)
    };
    e.string.preserveSpaces = function (a) {
        return a.replace(/(^|[\n ]) /g, "$1" + e.string.Unicode.NBSP)
    };
    e.string.stripQuotes = function (a, c) {
        for (var d = c.length, f = 0; f < d; f++) {
            var g = 1 == d ? c : c.charAt(f);
            if (a.charAt(0) == g && a.charAt(a.length - 1) == g) return a.substring(1, a.length - 1)
        }
        return a
    };
    e.string.truncate = function (a, c, d) {
        d && (a = e.string.unescapeEntities(a));
        a.length > c && (a = a.substring(0, c - 3) + "...");
        d && (a = e.string.htmlEscape(a));
        return a
    };
    e.string.truncateMiddle = function (a, c, d, f) {
        d && (a = e.string.unescapeEntities(a));
        if (f && a.length > c) {
            f > c && (f = c);
            var g = a.length - f;
            a = a.substring(0, c - f) + "..." + a.substring(g)
        } else a.length > c && (f = Math.floor(c / 2), g = a.length - f, a = a.substring(0, f + c % 2) + "..." + a.substring(g));
        d && (a = e.string.htmlEscape(a));
        return a
    };
    e.string.specialEscapeChars_ = {
        "\x00": "\\0",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\x0B": "\\x0B",
        '"': '\\"',
        "\\": "\\\\",
        "<": "\\u003C"
    };
    e.string.jsEscapeCache_ = {"'": "\\'"};
    e.string.quote = function (a) {
        a = String(a);
        for (var c = ['"'], d = 0; d < a.length; d++) {
            var f = a.charAt(d), g = f.charCodeAt(0);
            c[d + 1] = e.string.specialEscapeChars_[f] || (31 < g && 127 > g ? f : e.string.escapeChar(f))
        }
        c.push('"');
        return c.join("")
    };
    e.string.escapeString = function (a) {
        for (var c = [], d = 0; d < a.length; d++) c[d] = e.string.escapeChar(a.charAt(d));
        return c.join("")
    };
    e.string.escapeChar = function (a) {
        if (a in e.string.jsEscapeCache_) return e.string.jsEscapeCache_[a];
        if (a in e.string.specialEscapeChars_) return e.string.jsEscapeCache_[a] = e.string.specialEscapeChars_[a];
        var c = a.charCodeAt(0);
        if (31 < c && 127 > c) var d = a; else {
            if (256 > c) {
                if (d = "\\x", 16 > c || 256 < c) d += "0"
            } else d = "\\u", 4096 > c && (d += "0");
            d += c.toString(16).toUpperCase()
        }
        return e.string.jsEscapeCache_[a] = d
    };
    e.string.contains = e.string.internal.contains;
    e.string.caseInsensitiveContains = e.string.internal.caseInsensitiveContains;
    e.string.countOf = function (a, c) {
        return a && c ? a.split(c).length - 1 : 0
    };
    e.string.removeAt = function (a, c, d) {
        var f = a;
        0 <= c && c < a.length && 0 < d && (f = a.substr(0, c) + a.substr(c + d, a.length - c - d));
        return f
    };
    e.string.remove = function (a, c) {
        return a.replace(c, "")
    };
    e.string.removeAll = function (a, c) {
        c = new RegExp(e.string.regExpEscape(c), "g");
        return a.replace(c, "")
    };
    e.string.replaceAll = function (a, c, d) {
        c = new RegExp(e.string.regExpEscape(c), "g");
        return a.replace(c, d.replace(/\$/g, "$$$$"))
    };
    e.string.regExpEscape = function (a) {
        return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
    };
    e.string.repeat = String.prototype.repeat ? function (a, c) {
        return a.repeat(c)
    } : function (a, c) {
        return Array(c + 1).join(a)
    };
    e.string.padNumber = function (a, c, d) {
        a = void 0 !== d ? a.toFixed(d) : String(a);
        d = a.indexOf(".");
        -1 == d && (d = a.length);
        return e.string.repeat("0", Math.max(0, c - d)) + a
    };
    e.string.makeSafe = function (a) {
        return null == a ? "" : String(a)
    };
    e.string.buildString = function (a) {
        return Array.prototype.join.call(arguments, "")
    };
    e.string.getRandomString = function () {
        return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ e.now()).toString(36)
    };
    e.string.compareVersions = e.string.internal.compareVersions;
    e.string.hashCode = function (a) {
        for (var c = 0, d = 0; d < a.length; ++d) c = 31 * c + a.charCodeAt(d) >>> 0;
        return c
    };
    e.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
    e.string.createUniqueString = function () {
        return "goog_" + e.string.uniqueStringCounter_++
    };
    e.string.toNumber = function (a) {
        var c = Number(a);
        return 0 == c && e.string.isEmptyOrWhitespace(a) ? NaN : c
    };
    e.string.isLowerCamelCase = function (a) {
        return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
    };
    e.string.isUpperCamelCase = function (a) {
        return /^([A-Z][a-z]*)+$/.test(a)
    };
    e.string.toCamelCase = function (a) {
        return String(a).replace(/\-([a-z])/g, function (a, d) {
            return d.toUpperCase()
        })
    };
    e.string.toSelectorCase = function (a) {
        return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
    };
    e.string.toTitleCase = function (a, c) {
        c = "string" === typeof c ? e.string.regExpEscape(c) : "\\s";
        return a.replace(new RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function (a, c, g) {
            return c + g.toUpperCase()
        })
    };
    e.string.capitalize = function (a) {
        return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase()
    };
    e.string.parseInt = function (a) {
        isFinite(a) && (a = String(a));
        return "string" === typeof a ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
    };
    e.string.splitLimit = function (a, c, d) {
        a = a.split(c);
        for (var f = []; 0 < d && a.length;) f.push(a.shift()), d--;
        a.length && f.push(a.join(c));
        return f
    };
    e.string.lastComponent = function (a, c) {
        if (c) "string" == typeof c && (c = [c]); else return a;
        for (var d = -1, f = 0; f < c.length; f++) if ("" != c[f]) {
            var g = a.lastIndexOf(c[f]);
            g > d && (d = g)
        }
        return -1 == d ? a : a.slice(d + 1)
    };
    e.string.editDistance = function (a, c) {
        var d = [], f = [];
        if (a == c) return 0;
        if (!a.length || !c.length) return Math.max(a.length, c.length);
        for (var g = 0; g < c.length + 1; g++) d[g] = g;
        for (g = 0; g < a.length; g++) {
            f[0] = g + 1;
            for (var h = 0; h < c.length; h++) f[h + 1] = Math.min(f[h] + 1, d[h + 1] + 1, d[h] + Number(a[g] != c[h]));
            for (h = 0; h < d.length; h++) d[h] = f[h]
        }
        return f[c.length]
    };/*

 Copyright 2016 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
    var k = {DebugDump: {}};
    b.scope.dump = function (a) {
        return Document && a instanceof Document ? "<Document>" : Window && a instanceof Window ? "<Window>" : NodeList && a instanceof NodeList ? "<NodeList>" : HTMLCollection && a instanceof HTMLCollection ? "<HTMLCollection>" : Node && a instanceof Node ? "<Node>" : a instanceof e.Disposable ? "<Class>" : void 0 === a ? "undefined" : null === a ? "null" : "number" === typeof a ? (0, b.scope.dumpNumber)(a) : "string" === typeof a ? (0, b.scope.dumpString)(a) : e.isArray(a) ? (0, b.scope.dumpArray)(a) : e.isFunction(a) ? (0, b.scope.dumpFunction)(a) : a instanceof
        ArrayBuffer ? (0, b.scope.dumpArrayBuffer)(a) : a instanceof Map ? (0, b.scope.dumpMap)(a) : a instanceof Set ? (0, b.scope.dumpSet)(a) : e.isObject(a) ? (0, b.scope.dumpObject)(a) : (0, b.scope.encodeJson)(a)
    };
    b.scope.dumpObject = function (a) {
        var c = [];
        e.object.forEach(a, function (a, f) {
            c.push([f, a])
        });
        return "{" + (0, b.scope.dumpMappingItems)(c) + "}"
    };
    b.scope.dumpSet = function (a) {
        return "Set{" + (0, b.scope.dumpSequenceItems)(Array.from(a)) + "}"
    };
    b.scope.dumpMap = function (a) {
        return "Map{" + (0, b.scope.dumpMappingItems)(Array.from(a.entries())) + "}"
    };
    b.scope.dumpArrayBuffer = function (a) {
        return "ArrayBuffer[" + (0, b.scope.dumpSequenceItems)(new Uint8Array(a)) + "]"
    };
    b.scope.dumpFunction = function () {
        return "<Function>"
    };
    b.scope.dumpArray = function (a) {
        return "[" + (0, b.scope.dumpSequenceItems)(a) + "]"
    };
    b.scope.dumpString = function (a) {
        return '"' + a + '"'
    };
    b.scope.dumpNumber = function (a) {
        if (!isFinite(a)) return a.toString();
        if (!e.math.isInt(a)) return (0, b.scope.encodeJson)(a);
        var c = (0, b.scope.guessIntegerBitLength)(a);
        if (!c) return (0, b.scope.encodeJson)(a);
        0 > a && (a += Math.pow(2, c));
        a = a.toString(16).toUpperCase();
        return "0x" + e.string.repeat("0", c / 4 - a.length) + a
    };
    b.scope.dumpMappingItems = function (a) {
        a = e.array.map(a, function (a) {
            return k.DebugDump.dump(a[0]) + ": " + k.DebugDump.dump(a[1])
        });
        return e.iter.join(a, ", ")
    };
    b.scope.dumpSequenceItems = function (a) {
        a = e.iter.map(a, k.DebugDump.dump);
        return e.iter.join(a, ", ")
    };
    b.scope.guessIntegerBitLength = function (a) {
        var c = null;
        e.array.forEach([8, 32, 64], function (d) {
            var f = Math.pow(2, d);
            -Math.pow(2, d - 1) <= a && a < f && null === c && (c = d)
        });
        return c
    };
    b.scope.encodeJson = function (a) {
        return e.json.serialize(a) || "null"
    };
    k.DebugDump.dump = function (a) {
        if (e.DEBUG) return (0, b.scope.dump)(a);
        try {
            return (0, b.scope.dump)(a)
        } catch (c) {
            return "<failed to dump the value>"
        }
    };
    k.DebugDump.debugDump = function (a) {
        return e.DEBUG ? k.DebugDump.dump(a) : "<stripped value>"
    };
    e.reflect = {};
    e.reflect.object = function (a, c) {
        return c
    };
    e.reflect.objectProperty = function (a) {
        return a
    };
    e.reflect.sinkValue = function (a) {
        e.reflect.sinkValue[" "](a);
        return a
    };
    e.reflect.sinkValue[" "] = e.nullFunction;
    e.reflect.canAccessProperty = function (a, c) {
        try {
            return e.reflect.sinkValue(a[c]), !0
        } catch (d) {
        }
        return !1
    };
    e.reflect.cache = function (a, c, d, f) {
        f = f ? f(c) : c;
        return Object.prototype.hasOwnProperty.call(a, f) ? a[f] : a[f] = d(c)
    };
    e.math.Integer = function (a, c) {
        this.sign_ = c;
        for (var d = [], f = !0, g = a.length - 1; 0 <= g; g--) {
            var h = a[g] | 0;
            f && h == c || (d[g] = h, f = !1)
        }
        this.bits_ = d
    };
    e.math.Integer.IntCache_ = {};
    e.math.Integer.fromInt = function (a) {
        return -128 <= a && 128 > a ? e.reflect.cache(e.math.Integer.IntCache_, a, function (a) {
            return new e.math.Integer([a | 0], 0 > a ? -1 : 0)
        }) : new e.math.Integer([a | 0], 0 > a ? -1 : 0)
    };
    e.math.Integer.fromNumber = function (a) {
        if (isNaN(a) || !isFinite(a)) return e.math.Integer.ZERO;
        if (0 > a) return e.math.Integer.fromNumber(-a).negate();
        for (var c = [], d = 1, f = 0; a >= d; f++) c[f] = a / d | 0, d *= e.math.Integer.TWO_PWR_32_DBL_;
        return new e.math.Integer(c, 0)
    };
    e.math.Integer.fromBits = function (a) {
        return new e.math.Integer(a, a[a.length - 1] & -2147483648 ? -1 : 0)
    };
    e.math.Integer.fromString = function (a, c) {
        if (0 == a.length) throw Error("number format error: empty string");
        c = c || 10;
        if (2 > c || 36 < c) throw Error("radix out of range: " + c);
        if ("-" == a.charAt(0)) return e.math.Integer.fromString(a.substring(1), c).negate();
        if (0 <= a.indexOf("-")) throw Error('number format error: interior "-" character');
        for (var d = e.math.Integer.fromNumber(Math.pow(c, 8)), f = e.math.Integer.ZERO, g = 0; g < a.length; g += 8) {
            var h = Math.min(8, a.length - g), l = parseInt(a.substring(g, g + h), c);
            8 > h ? (h = e.math.Integer.fromNumber(Math.pow(c,
                h)), f = f.multiply(h).add(e.math.Integer.fromNumber(l))) : (f = f.multiply(d), f = f.add(e.math.Integer.fromNumber(l)))
        }
        return f
    };
    e.math.Integer.TWO_PWR_32_DBL_ = 4294967296;
    e.math.Integer.ZERO = e.math.Integer.fromInt(0);
    e.math.Integer.ONE = e.math.Integer.fromInt(1);
    e.math.Integer.TWO_PWR_24_ = e.math.Integer.fromInt(16777216);
    e.math.Integer.prototype.toInt = function () {
        return 0 < this.bits_.length ? this.bits_[0] : this.sign_
    };
    e.math.Integer.prototype.toNumber = function () {
        if (this.isNegative()) return -this.negate().toNumber();
        for (var a = 0, c = 1, d = 0; d < this.bits_.length; d++) a += this.getBitsUnsigned(d) * c, c *= e.math.Integer.TWO_PWR_32_DBL_;
        return a
    };
    e.math.Integer.prototype.toString = function (a) {
        a = a || 10;
        if (2 > a || 36 < a) throw Error("radix out of range: " + a);
        if (this.isZero()) return "0";
        if (this.isNegative()) return "-" + this.negate().toString(a);
        for (var c = e.math.Integer.fromNumber(Math.pow(a, 6)), d = this, f = ""; ;) {
            var g = d.divide(c), h = (d.subtract(g.multiply(c)).toInt() >>> 0).toString(a);
            d = g;
            if (d.isZero()) return h + f;
            for (; 6 > h.length;) h = "0" + h;
            f = "" + h + f
        }
    };
    e.math.Integer.prototype.getBits = function (a) {
        return 0 > a ? 0 : a < this.bits_.length ? this.bits_[a] : this.sign_
    };
    e.math.Integer.prototype.getBitsUnsigned = function (a) {
        a = this.getBits(a);
        return 0 <= a ? a : e.math.Integer.TWO_PWR_32_DBL_ + a
    };
    e.math.Integer.prototype.getSign = function () {
        return this.sign_
    };
    e.math.Integer.prototype.isZero = function () {
        if (0 != this.sign_) return !1;
        for (var a = 0; a < this.bits_.length; a++) if (0 != this.bits_[a]) return !1;
        return !0
    };
    e.math.Integer.prototype.isNegative = function () {
        return -1 == this.sign_
    };
    e.math.Integer.prototype.isOdd = function () {
        return 0 == this.bits_.length && -1 == this.sign_ || 0 < this.bits_.length && 0 != (this.bits_[0] & 1)
    };
    e.math.Integer.prototype.equals = function (a) {
        if (this.sign_ != a.sign_) return !1;
        for (var c = Math.max(this.bits_.length, a.bits_.length), d = 0; d < c; d++) if (this.getBits(d) != a.getBits(d)) return !1;
        return !0
    };
    e.math.Integer.prototype.notEquals = function (a) {
        return !this.equals(a)
    };
    e.math.Integer.prototype.greaterThan = function (a) {
        return 0 < this.compare(a)
    };
    e.math.Integer.prototype.greaterThanOrEqual = function (a) {
        return 0 <= this.compare(a)
    };
    e.math.Integer.prototype.lessThan = function (a) {
        return 0 > this.compare(a)
    };
    e.math.Integer.prototype.lessThanOrEqual = function (a) {
        return 0 >= this.compare(a)
    };
    e.math.Integer.prototype.compare = function (a) {
        a = this.subtract(a);
        return a.isNegative() ? -1 : a.isZero() ? 0 : 1
    };
    e.math.Integer.prototype.shorten = function (a) {
        var c = a - 1 >> 5;
        a = (a - 1) % 32;
        for (var d = [], f = 0; f < c; f++) d[f] = this.getBits(f);
        f = 31 == a ? 4294967295 : (1 << a + 1) - 1;
        var g = this.getBits(c) & f;
        if (g & 1 << a) return d[c] = g | 4294967295 - f, new e.math.Integer(d, -1);
        d[c] = g;
        return new e.math.Integer(d, 0)
    };
    e.math.Integer.prototype.negate = function () {
        return this.not().add(e.math.Integer.ONE)
    };
    e.math.Integer.prototype.abs = function () {
        return this.isNegative() ? this.negate() : this
    };
    e.math.Integer.prototype.add = function (a) {
        for (var c = Math.max(this.bits_.length, a.bits_.length), d = [], f = 0, g = 0; g <= c; g++) {
            var h = this.getBits(g) >>> 16, l = this.getBits(g) & 65535, m = a.getBits(g) >>> 16,
                n = a.getBits(g) & 65535;
            l = f + l + n;
            h = (l >>> 16) + h + m;
            f = h >>> 16;
            l &= 65535;
            h &= 65535;
            d[g] = h << 16 | l
        }
        return e.math.Integer.fromBits(d)
    };
    e.math.Integer.prototype.subtract = function (a) {
        return this.add(a.negate())
    };
    e.math.Integer.prototype.multiply = function (a) {
        if (this.isZero() || a.isZero()) return e.math.Integer.ZERO;
        if (this.isNegative()) return a.isNegative() ? this.negate().multiply(a.negate()) : this.negate().multiply(a).negate();
        if (a.isNegative()) return this.multiply(a.negate()).negate();
        if (this.lessThan(e.math.Integer.TWO_PWR_24_) && a.lessThan(e.math.Integer.TWO_PWR_24_)) return e.math.Integer.fromNumber(this.toNumber() * a.toNumber());
        for (var c = this.bits_.length + a.bits_.length, d = [], f = 0; f < 2 * c; f++) d[f] = 0;
        for (f = 0; f <
        this.bits_.length; f++) for (var g = 0; g < a.bits_.length; g++) {
            var h = this.getBits(f) >>> 16, l = this.getBits(f) & 65535, m = a.getBits(g) >>> 16,
                n = a.getBits(g) & 65535;
            d[2 * f + 2 * g] += l * n;
            e.math.Integer.carry16_(d, 2 * f + 2 * g);
            d[2 * f + 2 * g + 1] += h * n;
            e.math.Integer.carry16_(d, 2 * f + 2 * g + 1);
            d[2 * f + 2 * g + 1] += l * m;
            e.math.Integer.carry16_(d, 2 * f + 2 * g + 1);
            d[2 * f + 2 * g + 2] += h * m;
            e.math.Integer.carry16_(d, 2 * f + 2 * g + 2)
        }
        for (f = 0; f < c; f++) d[f] = d[2 * f + 1] << 16 | d[2 * f];
        for (f = c; f < 2 * c; f++) d[f] = 0;
        return new e.math.Integer(d, 0)
    };
    e.math.Integer.carry16_ = function (a, c) {
        for (; (a[c] & 65535) != a[c];) a[c + 1] += a[c] >>> 16, a[c] &= 65535, c++
    };
    e.math.Integer.prototype.slowDivide_ = function (a) {
        if (this.isNegative() || a.isNegative()) throw Error("slowDivide_ only works with positive integers.");
        for (var c = e.math.Integer.ONE, d = a; d.lessThanOrEqual(this);) c = c.shiftLeft(1), d = d.shiftLeft(1);
        var f = c.shiftRight(1), g = d.shiftRight(1);
        d = d.shiftRight(2);
        for (c = c.shiftRight(2); !d.isZero();) {
            var h = g.add(d);
            h.lessThanOrEqual(this) && (f = f.add(c), g = h);
            d = d.shiftRight(1);
            c = c.shiftRight(1)
        }
        a = this.subtract(f.multiply(a));
        return new e.math.Integer.DivisionResult(f,
            a)
    };
    e.math.Integer.prototype.divide = function (a) {
        return this.divideAndRemainder(a).quotient
    };
    e.math.Integer.DivisionResult = function (a, c) {
        this.quotient = a;
        this.remainder = c
    };
    e.math.Integer.prototype.divideAndRemainder = function (a) {
        if (a.isZero()) throw Error("division by zero");
        if (this.isZero()) return new e.math.Integer.DivisionResult(e.math.Integer.ZERO, e.math.Integer.ZERO);
        if (this.isNegative()) return a = this.negate().divideAndRemainder(a), new e.math.Integer.DivisionResult(a.quotient.negate(), a.remainder.negate());
        if (a.isNegative()) return a = this.divideAndRemainder(a.negate()), new e.math.Integer.DivisionResult(a.quotient.negate(), a.remainder);
        if (30 < this.bits_.length) return this.slowDivide_(a);
        for (var c = e.math.Integer.ZERO, d = this; d.greaterThanOrEqual(a);) {
            var f = Math.max(1, Math.floor(d.toNumber() / a.toNumber())), g = Math.ceil(Math.log(f) / Math.LN2);
            g = 48 >= g ? 1 : Math.pow(2, g - 48);
            for (var h = e.math.Integer.fromNumber(f), l = h.multiply(a); l.isNegative() || l.greaterThan(d);) f -= g, h = e.math.Integer.fromNumber(f), l = h.multiply(a);
            h.isZero() && (h = e.math.Integer.ONE);
            c = c.add(h);
            d = d.subtract(l)
        }
        return new e.math.Integer.DivisionResult(c, d)
    };
    e.math.Integer.prototype.modulo = function (a) {
        return this.divideAndRemainder(a).remainder
    };
    e.math.Integer.prototype.not = function () {
        for (var a = this.bits_.length, c = [], d = 0; d < a; d++) c[d] = ~this.bits_[d];
        return new e.math.Integer(c, ~this.sign_)
    };
    e.math.Integer.prototype.and = function (a) {
        for (var c = Math.max(this.bits_.length, a.bits_.length), d = [], f = 0; f < c; f++) d[f] = this.getBits(f) & a.getBits(f);
        return new e.math.Integer(d, this.sign_ & a.sign_)
    };
    e.math.Integer.prototype.or = function (a) {
        for (var c = Math.max(this.bits_.length, a.bits_.length), d = [], f = 0; f < c; f++) d[f] = this.getBits(f) | a.getBits(f);
        return new e.math.Integer(d, this.sign_ | a.sign_)
    };
    e.math.Integer.prototype.xor = function (a) {
        for (var c = Math.max(this.bits_.length, a.bits_.length), d = [], f = 0; f < c; f++) d[f] = this.getBits(f) ^ a.getBits(f);
        return new e.math.Integer(d, this.sign_ ^ a.sign_)
    };
    e.math.Integer.prototype.shiftLeft = function (a) {
        var c = a >> 5;
        a %= 32;
        for (var d = this.bits_.length + c + (0 < a ? 1 : 0), f = [], g = 0; g < d; g++) f[g] = 0 < a ? this.getBits(g - c) << a | this.getBits(g - c - 1) >>> 32 - a : this.getBits(g - c);
        return new e.math.Integer(f, this.sign_)
    };
    e.math.Integer.prototype.shiftRight = function (a) {
        var c = a >> 5;
        a %= 32;
        for (var d = this.bits_.length - c, f = [], g = 0; g < d; g++) f[g] = 0 < a ? this.getBits(g + c) >>> a | this.getBits(g + c + 1) << 32 - a : this.getBits(g + c);
        return new e.math.Integer(f, this.sign_)
    };
    k.FixedSizeInteger = {};
    k.FixedSizeInteger.castToInt32 = function (a) {
        return e.math.Integer.fromNumber(a).toInt()
    };
    e.structs = {};
    e.structs.getCount = function (a) {
        return a.getCount && "function" == typeof a.getCount ? a.getCount() : e.isArrayLike(a) || "string" === typeof a ? a.length : e.object.getCount(a)
    };
    e.structs.getValues = function (a) {
        if (a.getValues && "function" == typeof a.getValues) return a.getValues();
        if ("string" === typeof a) return a.split("");
        if (e.isArrayLike(a)) {
            for (var c = [], d = a.length, f = 0; f < d; f++) c.push(a[f]);
            return c
        }
        return e.object.getValues(a)
    };
    e.structs.getKeys = function (a) {
        if (a.getKeys && "function" == typeof a.getKeys) return a.getKeys();
        if (!a.getValues || "function" != typeof a.getValues) {
            if (e.isArrayLike(a) || "string" === typeof a) {
                var c = [];
                a = a.length;
                for (var d = 0; d < a; d++) c.push(d);
                return c
            }
            return e.object.getKeys(a)
        }
    };
    e.structs.contains = function (a, c) {
        return a.contains && "function" == typeof a.contains ? a.contains(c) : a.containsValue && "function" == typeof a.containsValue ? a.containsValue(c) : e.isArrayLike(a) || "string" === typeof a ? e.array.contains(a, c) : e.object.containsValue(a, c)
    };
    e.structs.isEmpty = function (a) {
        return a.isEmpty && "function" == typeof a.isEmpty ? a.isEmpty() : e.isArrayLike(a) || "string" === typeof a ? e.array.isEmpty(a) : e.object.isEmpty(a)
    };
    e.structs.clear = function (a) {
        a.clear && "function" == typeof a.clear ? a.clear() : e.isArrayLike(a) ? e.array.clear(a) : e.object.clear(a)
    };
    e.structs.forEach = function (a, c, d) {
        if (a.forEach && "function" == typeof a.forEach) a.forEach(c, d); else if (e.isArrayLike(a) || "string" === typeof a) e.array.forEach(a, c, d); else for (var f = e.structs.getKeys(a), g = e.structs.getValues(a), h = g.length, l = 0; l < h; l++) c.call(d, g[l], f && f[l], a)
    };
    e.structs.filter = function (a, c, d) {
        if ("function" == typeof a.filter) return a.filter(c, d);
        if (e.isArrayLike(a) || "string" === typeof a) return e.array.filter(a, c, d);
        var f = e.structs.getKeys(a), g = e.structs.getValues(a), h = g.length;
        if (f) {
            var l = {};
            for (var m = 0; m < h; m++) c.call(d, g[m], f[m], a) && (l[f[m]] = g[m])
        } else for (l = [], m = 0; m < h; m++) c.call(d, g[m], void 0, a) && l.push(g[m]);
        return l
    };
    e.structs.map = function (a, c, d) {
        if ("function" == typeof a.map) return a.map(c, d);
        if (e.isArrayLike(a) || "string" === typeof a) return e.array.map(a, c, d);
        var f = e.structs.getKeys(a), g = e.structs.getValues(a), h = g.length;
        if (f) {
            var l = {};
            for (var m = 0; m < h; m++) l[f[m]] = c.call(d, g[m], f[m], a)
        } else for (l = [], m = 0; m < h; m++) l[m] = c.call(d, g[m], void 0, a);
        return l
    };
    e.structs.some = function (a, c, d) {
        if ("function" == typeof a.some) return a.some(c, d);
        if (e.isArrayLike(a) || "string" === typeof a) return e.array.some(a, c, d);
        for (var f = e.structs.getKeys(a), g = e.structs.getValues(a), h = g.length, l = 0; l < h; l++) if (c.call(d, g[l], f && f[l], a)) return !0;
        return !1
    };
    e.structs.every = function (a, c, d) {
        if ("function" == typeof a.every) return a.every(c, d);
        if (e.isArrayLike(a) || "string" === typeof a) return e.array.every(a, c, d);
        for (var f = e.structs.getKeys(a), g = e.structs.getValues(a), h = g.length, l = 0; l < h; l++) if (!c.call(d, g[l], f && f[l], a)) return !1;
        return !0
    };
    e.structs.Map = function (a, c) {
        this.map_ = {};
        this.keys_ = [];
        this.version_ = this.count_ = 0;
        var d = arguments.length;
        if (1 < d) {
            if (d % 2) throw Error("Uneven number of arguments");
            for (var f = 0; f < d; f += 2) this.set(arguments[f], arguments[f + 1])
        } else a && this.addAll(a)
    };
    e.structs.Map.prototype.getCount = function () {
        return this.count_
    };
    e.structs.Map.prototype.getValues = function () {
        this.cleanupKeysArray_();
        for (var a = [], c = 0; c < this.keys_.length; c++) a.push(this.map_[this.keys_[c]]);
        return a
    };
    e.structs.Map.prototype.getKeys = function () {
        this.cleanupKeysArray_();
        return this.keys_.concat()
    };
    e.structs.Map.prototype.containsKey = function (a) {
        return e.structs.Map.hasKey_(this.map_, a)
    };
    e.structs.Map.prototype.containsValue = function (a) {
        for (var c = 0; c < this.keys_.length; c++) {
            var d = this.keys_[c];
            if (e.structs.Map.hasKey_(this.map_, d) && this.map_[d] == a) return !0
        }
        return !1
    };
    e.structs.Map.prototype.equals = function (a, c) {
        if (this === a) return !0;
        if (this.count_ != a.getCount()) return !1;
        c = c || e.structs.Map.defaultEquals;
        this.cleanupKeysArray_();
        for (var d, f = 0; d = this.keys_[f]; f++) if (!c(this.get(d), a.get(d))) return !1;
        return !0
    };
    e.structs.Map.defaultEquals = function (a, c) {
        return a === c
    };
    e.structs.Map.prototype.isEmpty = function () {
        return 0 == this.count_
    };
    e.structs.Map.prototype.clear = function () {
        this.map_ = {};
        this.version_ = this.count_ = this.keys_.length = 0
    };
    e.structs.Map.prototype.remove = function (a) {
        return e.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1
    };
    e.structs.Map.prototype.cleanupKeysArray_ = function () {
        if (this.count_ != this.keys_.length) {
            for (var a = 0, c = 0; a < this.keys_.length;) {
                var d = this.keys_[a];
                e.structs.Map.hasKey_(this.map_, d) && (this.keys_[c++] = d);
                a++
            }
            this.keys_.length = c
        }
        if (this.count_ != this.keys_.length) {
            var f = {};
            for (c = a = 0; a < this.keys_.length;) d = this.keys_[a], e.structs.Map.hasKey_(f, d) || (this.keys_[c++] = d, f[d] = 1), a++;
            this.keys_.length = c
        }
    };
    e.structs.Map.prototype.get = function (a, c) {
        return e.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : c
    };
    e.structs.Map.prototype.set = function (a, c) {
        e.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
        this.map_[a] = c
    };
    e.structs.Map.prototype.addAll = function (a) {
        if (a instanceof e.structs.Map) for (var c = a.getKeys(), d = 0; d < c.length; d++) this.set(c[d], a.get(c[d])); else for (c in a) this.set(c, a[c])
    };
    e.structs.Map.prototype.forEach = function (a, c) {
        for (var d = this.getKeys(), f = 0; f < d.length; f++) {
            var g = d[f], h = this.get(g);
            a.call(c, h, g, this)
        }
    };
    e.structs.Map.prototype.clone = function () {
        return new e.structs.Map(this)
    };
    e.structs.Map.prototype.transpose = function () {
        for (var a = new e.structs.Map, c = 0; c < this.keys_.length; c++) {
            var d = this.keys_[c];
            a.set(this.map_[d], d)
        }
        return a
    };
    e.structs.Map.prototype.toObject = function () {
        this.cleanupKeysArray_();
        for (var a = {}, c = 0; c < this.keys_.length; c++) {
            var d = this.keys_[c];
            a[d] = this.map_[d]
        }
        return a
    };
    e.structs.Map.prototype.getKeyIterator = function () {
        return this.__iterator__(!0)
    };
    e.structs.Map.prototype.getValueIterator = function () {
        return this.__iterator__(!1)
    };
    e.structs.Map.prototype.__iterator__ = function (a) {
        this.cleanupKeysArray_();
        var c = 0, d = this.version_, f = this, g = new e.iter.Iterator;
        g.next = function () {
            if (d != f.version_) throw Error("The map has changed since the iterator was created");
            if (c >= f.keys_.length) throw e.iter.StopIteration;
            var g = f.keys_[c++];
            return a ? g : f.map_[g]
        };
        return g
    };
    e.structs.Map.hasKey_ = function (a, c) {
        return Object.prototype.hasOwnProperty.call(a, c)
    };
    e.uri = {};
    e.uri.utils = {};
    e.uri.utils.CharCode_ = {AMPERSAND: 38, EQUAL: 61, HASH: 35, QUESTION: 63};
    e.uri.utils.buildFromEncodedParts = function (a, c, d, f, g, h, l) {
        var m = "";
        a && (m += a + ":");
        d && (m += "//", c && (m += c + "@"), m += d, f && (m += ":" + f));
        g && (m += g);
        h && (m += "?" + h);
        l && (m += "#" + l);
        return m
    };
    e.uri.utils.splitRe_ = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
    e.uri.utils.ComponentIndex = {SCHEME: 1, USER_INFO: 2, DOMAIN: 3, PORT: 4, PATH: 5, QUERY_DATA: 6, FRAGMENT: 7};
    e.uri.utils.split = function (a) {
        return a.match(e.uri.utils.splitRe_)
    };
    e.uri.utils.decodeIfPossible_ = function (a, c) {
        return a ? c ? decodeURI(a) : decodeURIComponent(a) : a
    };
    e.uri.utils.getComponentByIndex_ = function (a, c) {
        return e.uri.utils.split(c)[a] || null
    };
    e.uri.utils.getScheme = function (a) {
        return e.uri.utils.getComponentByIndex_(e.uri.utils.ComponentIndex.SCHEME, a)
    };
    e.uri.utils.getEffectiveScheme = function (a) {
        a = e.uri.utils.getScheme(a);
        !a && e.global.self && e.global.self.location && (a = e.global.self.location.protocol, a = a.substr(0, a.length - 1));
        return a ? a.toLowerCase() : ""
    };
    e.uri.utils.getUserInfoEncoded = function (a) {
        return e.uri.utils.getComponentByIndex_(e.uri.utils.ComponentIndex.USER_INFO, a)
    };
    e.uri.utils.getUserInfo = function (a) {
        return e.uri.utils.decodeIfPossible_(e.uri.utils.getUserInfoEncoded(a))
    };
    e.uri.utils.getDomainEncoded = function (a) {
        return e.uri.utils.getComponentByIndex_(e.uri.utils.ComponentIndex.DOMAIN, a)
    };
    e.uri.utils.getDomain = function (a) {
        return e.uri.utils.decodeIfPossible_(e.uri.utils.getDomainEncoded(a), !0)
    };
    e.uri.utils.getPort = function (a) {
        return Number(e.uri.utils.getComponentByIndex_(e.uri.utils.ComponentIndex.PORT, a)) || null
    };
    e.uri.utils.getPathEncoded = function (a) {
        return e.uri.utils.getComponentByIndex_(e.uri.utils.ComponentIndex.PATH, a)
    };
    e.uri.utils.getPath = function (a) {
        return e.uri.utils.decodeIfPossible_(e.uri.utils.getPathEncoded(a), !0)
    };
    e.uri.utils.getQueryData = function (a) {
        return e.uri.utils.getComponentByIndex_(e.uri.utils.ComponentIndex.QUERY_DATA, a)
    };
    e.uri.utils.getFragmentEncoded = function (a) {
        var c = a.indexOf("#");
        return 0 > c ? null : a.substr(c + 1)
    };
    e.uri.utils.setFragmentEncoded = function (a, c) {
        return e.uri.utils.removeFragment(a) + (c ? "#" + c : "")
    };
    e.uri.utils.getFragment = function (a) {
        return e.uri.utils.decodeIfPossible_(e.uri.utils.getFragmentEncoded(a))
    };
    e.uri.utils.getHost = function (a) {
        a = e.uri.utils.split(a);
        return e.uri.utils.buildFromEncodedParts(a[e.uri.utils.ComponentIndex.SCHEME], a[e.uri.utils.ComponentIndex.USER_INFO], a[e.uri.utils.ComponentIndex.DOMAIN], a[e.uri.utils.ComponentIndex.PORT])
    };
    e.uri.utils.getOrigin = function (a) {
        a = e.uri.utils.split(a);
        return e.uri.utils.buildFromEncodedParts(a[e.uri.utils.ComponentIndex.SCHEME], null, a[e.uri.utils.ComponentIndex.DOMAIN], a[e.uri.utils.ComponentIndex.PORT])
    };
    e.uri.utils.getPathAndAfter = function (a) {
        a = e.uri.utils.split(a);
        return e.uri.utils.buildFromEncodedParts(null, null, null, null, a[e.uri.utils.ComponentIndex.PATH], a[e.uri.utils.ComponentIndex.QUERY_DATA], a[e.uri.utils.ComponentIndex.FRAGMENT])
    };
    e.uri.utils.removeFragment = function (a) {
        var c = a.indexOf("#");
        return 0 > c ? a : a.substr(0, c)
    };
    e.uri.utils.haveSameDomain = function (a, c) {
        a = e.uri.utils.split(a);
        c = e.uri.utils.split(c);
        return a[e.uri.utils.ComponentIndex.DOMAIN] == c[e.uri.utils.ComponentIndex.DOMAIN] && a[e.uri.utils.ComponentIndex.SCHEME] == c[e.uri.utils.ComponentIndex.SCHEME] && a[e.uri.utils.ComponentIndex.PORT] == c[e.uri.utils.ComponentIndex.PORT]
    };
    e.uri.utils.assertNoFragmentsOrQueries_ = function (a) {
        e.asserts.assert(0 > a.indexOf("#") && 0 > a.indexOf("?"), "goog.uri.utils: Fragment or query identifiers are not supported: [%s]", a)
    };
    e.uri.utils.parseQueryData = function (a, c) {
        if (a) {
            a = a.split("&");
            for (var d = 0; d < a.length; d++) {
                var f = a[d].indexOf("="), g = null;
                if (0 <= f) {
                    var h = a[d].substring(0, f);
                    g = a[d].substring(f + 1)
                } else h = a[d];
                c(h, g ? e.string.urlDecode(g) : "")
            }
        }
    };
    e.uri.utils.splitQueryData_ = function (a) {
        var c = a.indexOf("#");
        0 > c && (c = a.length);
        var d = a.indexOf("?");
        if (0 > d || d > c) {
            d = c;
            var f = ""
        } else f = a.substring(d + 1, c);
        return [a.substr(0, d), f, a.substr(c)]
    };
    e.uri.utils.joinQueryData_ = function (a) {
        return a[0] + (a[1] ? "?" + a[1] : "") + a[2]
    };
    e.uri.utils.appendQueryData_ = function (a, c) {
        return c ? a ? a + "&" + c : c : a
    };
    e.uri.utils.appendQueryDataToUri_ = function (a, c) {
        if (!c) return a;
        a = e.uri.utils.splitQueryData_(a);
        a[1] = e.uri.utils.appendQueryData_(a[1], c);
        return e.uri.utils.joinQueryData_(a)
    };
    e.uri.utils.appendKeyValuePairs_ = function (a, c, d) {
        e.asserts.assertString(a);
        if (e.isArray(c)) {
            e.asserts.assertArray(c);
            for (var f = 0; f < c.length; f++) e.uri.utils.appendKeyValuePairs_(a, String(c[f]), d)
        } else null != c && d.push(a + ("" === c ? "" : "=" + e.string.urlEncode(c)))
    };
    e.uri.utils.buildQueryData = function (a, c) {
        e.asserts.assert(0 == Math.max(a.length - (c || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
        var d = [];
        for (c = c || 0; c < a.length; c += 2) e.uri.utils.appendKeyValuePairs_(a[c], a[c + 1], d);
        return d.join("&")
    };
    e.uri.utils.buildQueryDataFromMap = function (a) {
        var c = [], d;
        for (d in a) e.uri.utils.appendKeyValuePairs_(d, a[d], c);
        return c.join("&")
    };
    e.uri.utils.appendParams = function (a, c) {
        var d = 2 == arguments.length ? e.uri.utils.buildQueryData(arguments[1], 0) : e.uri.utils.buildQueryData(arguments, 1);
        return e.uri.utils.appendQueryDataToUri_(a, d)
    };
    e.uri.utils.appendParamsFromMap = function (a, c) {
        c = e.uri.utils.buildQueryDataFromMap(c);
        return e.uri.utils.appendQueryDataToUri_(a, c)
    };
    e.uri.utils.appendParam = function (a, c, d) {
        d = null != d ? "=" + e.string.urlEncode(d) : "";
        return e.uri.utils.appendQueryDataToUri_(a, c + d)
    };
    e.uri.utils.findParam_ = function (a, c, d, f) {
        for (var g = d.length; 0 <= (c = a.indexOf(d, c)) && c < f;) {
            var h = a.charCodeAt(c - 1);
            if (h == e.uri.utils.CharCode_.AMPERSAND || h == e.uri.utils.CharCode_.QUESTION) if (h = a.charCodeAt(c + g), !h || h == e.uri.utils.CharCode_.EQUAL || h == e.uri.utils.CharCode_.AMPERSAND || h == e.uri.utils.CharCode_.HASH) return c;
            c += g + 1
        }
        return -1
    };
    e.uri.utils.hashOrEndRe_ = /#|$/;
    e.uri.utils.hasParam = function (a, c) {
        return 0 <= e.uri.utils.findParam_(a, 0, c, a.search(e.uri.utils.hashOrEndRe_))
    };
    e.uri.utils.getParamValue = function (a, c) {
        var d = a.search(e.uri.utils.hashOrEndRe_), f = e.uri.utils.findParam_(a, 0, c, d);
        if (0 > f) return null;
        var g = a.indexOf("&", f);
        if (0 > g || g > d) g = d;
        f += c.length + 1;
        return e.string.urlDecode(a.substr(f, g - f))
    };
    e.uri.utils.getParamValues = function (a, c) {
        for (var d = a.search(e.uri.utils.hashOrEndRe_), f = 0, g, h = []; 0 <= (g = e.uri.utils.findParam_(a, f, c, d));) {
            f = a.indexOf("&", g);
            if (0 > f || f > d) f = d;
            g += c.length + 1;
            h.push(e.string.urlDecode(a.substr(g, f - g)))
        }
        return h
    };
    e.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
    e.uri.utils.removeParam = function (a, c) {
        for (var d = a.search(e.uri.utils.hashOrEndRe_), f = 0, g, h = []; 0 <= (g = e.uri.utils.findParam_(a, f, c, d));) h.push(a.substring(f, g)), f = Math.min(a.indexOf("&", g) + 1 || d, d);
        h.push(a.substr(f));
        return h.join("").replace(e.uri.utils.trailingQueryPunctuationRe_, "$1")
    };
    e.uri.utils.setParam = function (a, c, d) {
        return e.uri.utils.appendParam(e.uri.utils.removeParam(a, c), c, d)
    };
    e.uri.utils.setParamsFromMap = function (a, c) {
        a = e.uri.utils.splitQueryData_(a);
        var d = a[1], f = [];
        d && e.array.forEach(d.split("&"), function (a) {
            var d = a.indexOf("=");
            d = 0 <= d ? a.substr(0, d) : a;
            c.hasOwnProperty(d) || f.push(a)
        });
        a[1] = e.uri.utils.appendQueryData_(f.join("&"), e.uri.utils.buildQueryDataFromMap(c));
        return e.uri.utils.joinQueryData_(a)
    };
    e.uri.utils.appendPath = function (a, c) {
        e.uri.utils.assertNoFragmentsOrQueries_(a);
        e.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
        e.string.startsWith(c, "/") && (c = c.substr(1));
        return e.string.buildString(a, "/", c)
    };
    e.uri.utils.setPath = function (a, c) {
        e.string.startsWith(c, "/") || (c = "/" + c);
        a = e.uri.utils.split(a);
        return e.uri.utils.buildFromEncodedParts(a[e.uri.utils.ComponentIndex.SCHEME], a[e.uri.utils.ComponentIndex.USER_INFO], a[e.uri.utils.ComponentIndex.DOMAIN], a[e.uri.utils.ComponentIndex.PORT], c, a[e.uri.utils.ComponentIndex.QUERY_DATA], a[e.uri.utils.ComponentIndex.FRAGMENT])
    };
    e.uri.utils.StandardQueryParam = {RANDOM: "zx"};
    e.uri.utils.makeUnique = function (a) {
        return e.uri.utils.setParam(a, e.uri.utils.StandardQueryParam.RANDOM, e.string.getRandomString())
    };
    e.Uri = function (a, c) {
        this.domain_ = this.userInfo_ = this.scheme_ = "";
        this.port_ = null;
        this.fragment_ = this.path_ = "";
        this.ignoreCase_ = this.isReadOnly_ = !1;
        var d;
        a instanceof e.Uri ? (this.ignoreCase_ = void 0 !== c ? c : a.getIgnoreCase(), this.setScheme(a.getScheme()), this.setUserInfo(a.getUserInfo()), this.setDomain(a.getDomain()), this.setPort(a.getPort()), this.setPath(a.getPath()), this.setQueryData(a.getQueryData().clone()), this.setFragment(a.getFragment())) : a && (d = e.uri.utils.split(String(a))) ? (this.ignoreCase_ = !!c,
            this.setScheme(d[e.uri.utils.ComponentIndex.SCHEME] || "", !0), this.setUserInfo(d[e.uri.utils.ComponentIndex.USER_INFO] || "", !0), this.setDomain(d[e.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(d[e.uri.utils.ComponentIndex.PORT]), this.setPath(d[e.uri.utils.ComponentIndex.PATH] || "", !0), this.setQueryData(d[e.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(d[e.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.ignoreCase_ = !!c, this.queryData_ = new e.Uri.QueryData(null, null, this.ignoreCase_))
    };
    e.Uri.RANDOM_PARAM = e.uri.utils.StandardQueryParam.RANDOM;
    e.Uri.prototype.toString = function () {
        var a = [], c = this.getScheme();
        c && a.push(e.Uri.encodeSpecialChars_(c, e.Uri.reDisallowedInSchemeOrUserInfo_, !0), ":");
        var d = this.getDomain();
        if (d || "file" == c) a.push("//"), (c = this.getUserInfo()) && a.push(e.Uri.encodeSpecialChars_(c, e.Uri.reDisallowedInSchemeOrUserInfo_, !0), "@"), a.push(e.Uri.removeDoubleEncoding_(e.string.urlEncode(d))), d = this.getPort(), null != d && a.push(":", String(d));
        if (d = this.getPath()) this.hasDomain() && "/" != d.charAt(0) && a.push("/"), a.push(e.Uri.encodeSpecialChars_(d,
            "/" == d.charAt(0) ? e.Uri.reDisallowedInAbsolutePath_ : e.Uri.reDisallowedInRelativePath_, !0));
        (d = this.getEncodedQuery()) && a.push("?", d);
        (d = this.getFragment()) && a.push("#", e.Uri.encodeSpecialChars_(d, e.Uri.reDisallowedInFragment_));
        return a.join("")
    };
    e.Uri.prototype.resolve = function (a) {
        var c = this.clone(), d = a.hasScheme();
        d ? c.setScheme(a.getScheme()) : d = a.hasUserInfo();
        d ? c.setUserInfo(a.getUserInfo()) : d = a.hasDomain();
        d ? c.setDomain(a.getDomain()) : d = a.hasPort();
        var f = a.getPath();
        if (d) c.setPort(a.getPort()); else if (d = a.hasPath()) {
            if ("/" != f.charAt(0)) if (this.hasDomain() && !this.hasPath()) f = "/" + f; else {
                var g = c.getPath().lastIndexOf("/");
                -1 != g && (f = c.getPath().substr(0, g + 1) + f)
            }
            f = e.Uri.removeDotSegments(f)
        }
        d ? c.setPath(f) : d = a.hasQuery();
        d ? c.setQueryData(a.getQueryData().clone()) :
            d = a.hasFragment();
        d && c.setFragment(a.getFragment());
        return c
    };
    e.Uri.prototype.clone = function () {
        return new e.Uri(this)
    };
    e.Uri.prototype.getScheme = function () {
        return this.scheme_
    };
    e.Uri.prototype.setScheme = function (a, c) {
        this.enforceReadOnly();
        if (this.scheme_ = c ? e.Uri.decodeOrEmpty_(a, !0) : a) this.scheme_ = this.scheme_.replace(/:$/, "");
        return this
    };
    e.Uri.prototype.hasScheme = function () {
        return !!this.scheme_
    };
    e.Uri.prototype.getUserInfo = function () {
        return this.userInfo_
    };
    e.Uri.prototype.setUserInfo = function (a, c) {
        this.enforceReadOnly();
        this.userInfo_ = c ? e.Uri.decodeOrEmpty_(a) : a;
        return this
    };
    e.Uri.prototype.hasUserInfo = function () {
        return !!this.userInfo_
    };
    e.Uri.prototype.getDomain = function () {
        return this.domain_
    };
    e.Uri.prototype.setDomain = function (a, c) {
        this.enforceReadOnly();
        this.domain_ = c ? e.Uri.decodeOrEmpty_(a, !0) : a;
        return this
    };
    e.Uri.prototype.hasDomain = function () {
        return !!this.domain_
    };
    e.Uri.prototype.getPort = function () {
        return this.port_
    };
    e.Uri.prototype.setPort = function (a) {
        this.enforceReadOnly();
        if (a) {
            a = Number(a);
            if (isNaN(a) || 0 > a) throw Error("Bad port number " + a);
            this.port_ = a
        } else this.port_ = null;
        return this
    };
    e.Uri.prototype.hasPort = function () {
        return null != this.port_
    };
    e.Uri.prototype.getPath = function () {
        return this.path_
    };
    e.Uri.prototype.setPath = function (a, c) {
        this.enforceReadOnly();
        this.path_ = c ? e.Uri.decodeOrEmpty_(a, !0) : a;
        return this
    };
    e.Uri.prototype.hasPath = function () {
        return !!this.path_
    };
    e.Uri.prototype.hasQuery = function () {
        return "" !== this.queryData_.toString()
    };
    e.Uri.prototype.setQueryData = function (a, c) {
        this.enforceReadOnly();
        a instanceof e.Uri.QueryData ? (this.queryData_ = a, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (c || (a = e.Uri.encodeSpecialChars_(a, e.Uri.reDisallowedInQuery_)), this.queryData_ = new e.Uri.QueryData(a, null, this.ignoreCase_));
        return this
    };
    e.Uri.prototype.setQuery = function (a, c) {
        return this.setQueryData(a, c)
    };
    e.Uri.prototype.getEncodedQuery = function () {
        return this.queryData_.toString()
    };
    e.Uri.prototype.getDecodedQuery = function () {
        return this.queryData_.toDecodedString()
    };
    e.Uri.prototype.getQueryData = function () {
        return this.queryData_
    };
    e.Uri.prototype.getQuery = function () {
        return this.getEncodedQuery()
    };
    e.Uri.prototype.setParameterValue = function (a, c) {
        this.enforceReadOnly();
        this.queryData_.set(a, c);
        return this
    };
    e.Uri.prototype.setParameterValues = function (a, c) {
        this.enforceReadOnly();
        e.isArray(c) || (c = [String(c)]);
        this.queryData_.setValues(a, c);
        return this
    };
    e.Uri.prototype.getParameterValues = function (a) {
        return this.queryData_.getValues(a)
    };
    e.Uri.prototype.getParameterValue = function (a) {
        return this.queryData_.get(a)
    };
    e.Uri.prototype.getFragment = function () {
        return this.fragment_
    };
    e.Uri.prototype.setFragment = function (a, c) {
        this.enforceReadOnly();
        this.fragment_ = c ? e.Uri.decodeOrEmpty_(a) : a;
        return this
    };
    e.Uri.prototype.hasFragment = function () {
        return !!this.fragment_
    };
    e.Uri.prototype.hasSameDomainAs = function (a) {
        return (!this.hasDomain() && !a.hasDomain() || this.getDomain() == a.getDomain()) && (!this.hasPort() && !a.hasPort() || this.getPort() == a.getPort())
    };
    e.Uri.prototype.makeUnique = function () {
        this.enforceReadOnly();
        this.setParameterValue(e.Uri.RANDOM_PARAM, e.string.getRandomString());
        return this
    };
    e.Uri.prototype.removeParameter = function (a) {
        this.enforceReadOnly();
        this.queryData_.remove(a);
        return this
    };
    e.Uri.prototype.setReadOnly = function (a) {
        this.isReadOnly_ = a;
        return this
    };
    e.Uri.prototype.isReadOnly = function () {
        return this.isReadOnly_
    };
    e.Uri.prototype.enforceReadOnly = function () {
        if (this.isReadOnly_) throw Error("Tried to modify a read-only Uri");
    };
    e.Uri.prototype.setIgnoreCase = function (a) {
        this.ignoreCase_ = a;
        this.queryData_ && this.queryData_.setIgnoreCase(a);
        return this
    };
    e.Uri.prototype.getIgnoreCase = function () {
        return this.ignoreCase_
    };
    e.Uri.parse = function (a, c) {
        return a instanceof e.Uri ? a.clone() : new e.Uri(a, c)
    };
    e.Uri.create = function (a, c, d, f, g, h, l, m) {
        m = new e.Uri(null, m);
        a && m.setScheme(a);
        c && m.setUserInfo(c);
        d && m.setDomain(d);
        f && m.setPort(f);
        g && m.setPath(g);
        h && m.setQueryData(h);
        l && m.setFragment(l);
        return m
    };
    e.Uri.resolve = function (a, c) {
        a instanceof e.Uri || (a = e.Uri.parse(a));
        c instanceof e.Uri || (c = e.Uri.parse(c));
        return a.resolve(c)
    };
    e.Uri.removeDotSegments = function (a) {
        if (".." == a || "." == a) return "";
        if (e.string.contains(a, "./") || e.string.contains(a, "/.")) {
            var c = e.string.startsWith(a, "/");
            a = a.split("/");
            for (var d = [], f = 0; f < a.length;) {
                var g = a[f++];
                "." == g ? c && f == a.length && d.push("") : ".." == g ? ((1 < d.length || 1 == d.length && "" != d[0]) && d.pop(), c && f == a.length && d.push("")) : (d.push(g), c = !0)
            }
            return d.join("/")
        }
        return a
    };
    e.Uri.decodeOrEmpty_ = function (a, c) {
        return a ? c ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : ""
    };
    e.Uri.encodeSpecialChars_ = function (a, c, d) {
        return "string" === typeof a ? (a = encodeURI(a).replace(c, e.Uri.encodeChar_), d && (a = e.Uri.removeDoubleEncoding_(a)), a) : null
    };
    e.Uri.encodeChar_ = function (a) {
        a = a.charCodeAt(0);
        return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
    };
    e.Uri.removeDoubleEncoding_ = function (a) {
        return a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")
    };
    e.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
    e.Uri.reDisallowedInRelativePath_ = /[#\?:]/g;
    e.Uri.reDisallowedInAbsolutePath_ = /[#\?]/g;
    e.Uri.reDisallowedInQuery_ = /[#\?@]/g;
    e.Uri.reDisallowedInFragment_ = /#/g;
    e.Uri.haveSameDomain = function (a, c) {
        a = e.uri.utils.split(a);
        c = e.uri.utils.split(c);
        return a[e.uri.utils.ComponentIndex.DOMAIN] == c[e.uri.utils.ComponentIndex.DOMAIN] && a[e.uri.utils.ComponentIndex.PORT] == c[e.uri.utils.ComponentIndex.PORT]
    };
    e.Uri.QueryData = function (a, c, d) {
        this.count_ = this.keyMap_ = null;
        this.encodedQuery_ = a || null;
        this.ignoreCase_ = !!d
    };
    e.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function () {
        if (!this.keyMap_ && (this.keyMap_ = new e.structs.Map, this.count_ = 0, this.encodedQuery_)) {
            var a = this;
            e.uri.utils.parseQueryData(this.encodedQuery_, function (c, d) {
                a.add(e.string.urlDecode(c), d)
            })
        }
    };
    e.Uri.QueryData.createFromMap = function (a, c, d) {
        c = e.structs.getKeys(a);
        if ("undefined" == typeof c) throw Error("Keys are undefined");
        d = new e.Uri.QueryData(null, null, d);
        a = e.structs.getValues(a);
        for (var f = 0; f < c.length; f++) {
            var g = c[f], h = a[f];
            e.isArray(h) ? d.setValues(g, h) : d.add(g, h)
        }
        return d
    };
    e.Uri.QueryData.createFromKeysValues = function (a, c, d, f) {
        if (a.length != c.length) throw Error("Mismatched lengths for keys/values");
        d = new e.Uri.QueryData(null, null, f);
        for (f = 0; f < a.length; f++) d.add(a[f], c[f]);
        return d
    };
    e.Uri.QueryData.prototype.getCount = function () {
        this.ensureKeyMapInitialized_();
        return this.count_
    };
    e.Uri.QueryData.prototype.add = function (a, c) {
        this.ensureKeyMapInitialized_();
        this.invalidateCache_();
        a = this.getKeyName_(a);
        var d = this.keyMap_.get(a);
        d || this.keyMap_.set(a, d = []);
        d.push(c);
        this.count_ = e.asserts.assertNumber(this.count_) + 1;
        return this
    };
    e.Uri.QueryData.prototype.remove = function (a) {
        this.ensureKeyMapInitialized_();
        a = this.getKeyName_(a);
        return this.keyMap_.containsKey(a) ? (this.invalidateCache_(), this.count_ = e.asserts.assertNumber(this.count_) - this.keyMap_.get(a).length, this.keyMap_.remove(a)) : !1
    };
    e.Uri.QueryData.prototype.clear = function () {
        this.invalidateCache_();
        this.keyMap_ = null;
        this.count_ = 0
    };
    e.Uri.QueryData.prototype.isEmpty = function () {
        this.ensureKeyMapInitialized_();
        return 0 == this.count_
    };
    e.Uri.QueryData.prototype.containsKey = function (a) {
        this.ensureKeyMapInitialized_();
        a = this.getKeyName_(a);
        return this.keyMap_.containsKey(a)
    };
    e.Uri.QueryData.prototype.containsValue = function (a) {
        var c = this.getValues();
        return e.array.contains(c, a)
    };
    e.Uri.QueryData.prototype.forEach = function (a, c) {
        this.ensureKeyMapInitialized_();
        this.keyMap_.forEach(function (d, f) {
            e.array.forEach(d, function (d) {
                a.call(c, d, f, this)
            }, this)
        }, this)
    };
    e.Uri.QueryData.prototype.getKeys = function () {
        this.ensureKeyMapInitialized_();
        for (var a = this.keyMap_.getValues(), c = this.keyMap_.getKeys(), d = [], f = 0; f < c.length; f++) for (var g = a[f], h = 0; h < g.length; h++) d.push(c[f]);
        return d
    };
    e.Uri.QueryData.prototype.getValues = function (a) {
        this.ensureKeyMapInitialized_();
        var c = [];
        if ("string" === typeof a) this.containsKey(a) && (c = e.array.concat(c, this.keyMap_.get(this.getKeyName_(a)))); else {
            a = this.keyMap_.getValues();
            for (var d = 0; d < a.length; d++) c = e.array.concat(c, a[d])
        }
        return c
    };
    e.Uri.QueryData.prototype.set = function (a, c) {
        this.ensureKeyMapInitialized_();
        this.invalidateCache_();
        a = this.getKeyName_(a);
        this.containsKey(a) && (this.count_ = e.asserts.assertNumber(this.count_) - this.keyMap_.get(a).length);
        this.keyMap_.set(a, [c]);
        this.count_ = e.asserts.assertNumber(this.count_) + 1;
        return this
    };
    e.Uri.QueryData.prototype.get = function (a, c) {
        if (!a) return c;
        a = this.getValues(a);
        return 0 < a.length ? String(a[0]) : c
    };
    e.Uri.QueryData.prototype.setValues = function (a, c) {
        this.remove(a);
        0 < c.length && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(a), e.array.clone(c)), this.count_ = e.asserts.assertNumber(this.count_) + c.length)
    };
    e.Uri.QueryData.prototype.toString = function () {
        if (this.encodedQuery_) return this.encodedQuery_;
        if (!this.keyMap_) return "";
        for (var a = [], c = this.keyMap_.getKeys(), d = 0; d < c.length; d++) {
            var f = c[d], g = e.string.urlEncode(f);
            f = this.getValues(f);
            for (var h = 0; h < f.length; h++) {
                var l = g;
                "" !== f[h] && (l += "=" + e.string.urlEncode(f[h]));
                a.push(l)
            }
        }
        return this.encodedQuery_ = a.join("&")
    };
    e.Uri.QueryData.prototype.toDecodedString = function () {
        return e.Uri.decodeOrEmpty_(this.toString())
    };
    e.Uri.QueryData.prototype.invalidateCache_ = function () {
        this.encodedQuery_ = null
    };
    e.Uri.QueryData.prototype.filterKeys = function (a) {
        this.ensureKeyMapInitialized_();
        this.keyMap_.forEach(function (c, d) {
            e.array.contains(a, d) || this.remove(d)
        }, this);
        return this
    };
    e.Uri.QueryData.prototype.clone = function () {
        var a = new e.Uri.QueryData;
        a.encodedQuery_ = this.encodedQuery_;
        this.keyMap_ && (a.keyMap_ = this.keyMap_.clone(), a.count_ = this.count_);
        return a
    };
    e.Uri.QueryData.prototype.getKeyName_ = function (a) {
        a = String(a);
        this.ignoreCase_ && (a = a.toLowerCase());
        return a
    };
    e.Uri.QueryData.prototype.setIgnoreCase = function (a) {
        a && !this.ignoreCase_ && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), this.keyMap_.forEach(function (a, d) {
            var c = d.toLowerCase();
            d != c && (this.remove(d), this.setValues(c, a))
        }, this));
        this.ignoreCase_ = a
    };
    e.Uri.QueryData.prototype.extend = function (a) {
        for (var c = 0; c < arguments.length; c++) e.structs.forEach(arguments[c], function (a, c) {
            this.add(c, a)
        }, this)
    };
    e.debug.errorcontext = {};
    e.debug.errorcontext.addErrorContext = function (a, c, d) {
        a[e.debug.errorcontext.CONTEXT_KEY_] || (a[e.debug.errorcontext.CONTEXT_KEY_] = {});
        a[e.debug.errorcontext.CONTEXT_KEY_][c] = d
    };
    e.debug.errorcontext.getErrorContext = function (a) {
        return a[e.debug.errorcontext.CONTEXT_KEY_] || {}
    };
    e.debug.errorcontext.CONTEXT_KEY_ = "__closure__error__context__984382";
    e.labs.userAgent.engine = {};
    e.labs.userAgent.engine.isPresto = function () {
        return e.labs.userAgent.util.matchUserAgent("Presto")
    };
    e.labs.userAgent.engine.isTrident = function () {
        return e.labs.userAgent.util.matchUserAgent("Trident") || e.labs.userAgent.util.matchUserAgent("MSIE")
    };
    e.labs.userAgent.engine.isEdge = function () {
        return e.labs.userAgent.util.matchUserAgent("Edge")
    };
    e.labs.userAgent.engine.isWebKit = function () {
        return e.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !e.labs.userAgent.engine.isEdge()
    };
    e.labs.userAgent.engine.isGecko = function () {
        return e.labs.userAgent.util.matchUserAgent("Gecko") && !e.labs.userAgent.engine.isWebKit() && !e.labs.userAgent.engine.isTrident() && !e.labs.userAgent.engine.isEdge()
    };
    e.labs.userAgent.engine.getVersion = function () {
        var a = e.labs.userAgent.util.getUserAgent();
        if (a) {
            a = e.labs.userAgent.util.extractVersionTuples(a);
            var c = e.labs.userAgent.engine.getEngineTuple_(a);
            if (c) return "Gecko" == c[0] ? e.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : c[1];
            a = a[0];
            var d;
            if (a && (d = a[2]) && (d = /Trident\/([^\s;]+)/.exec(d))) return d[1]
        }
        return ""
    };
    e.labs.userAgent.engine.getEngineTuple_ = function (a) {
        if (!e.labs.userAgent.engine.isEdge()) return a[1];
        for (var c = 0; c < a.length; c++) {
            var d = a[c];
            if ("Edge" == d[0]) return d
        }
    };
    e.labs.userAgent.engine.isVersionOrHigher = function (a) {
        return 0 <= e.string.compareVersions(e.labs.userAgent.engine.getVersion(), a)
    };
    e.labs.userAgent.engine.getVersionForKey_ = function (a, c) {
        return (a = e.array.find(a, function (a) {
            return c == a[0]
        })) && a[1] || ""
    };
    e.labs.userAgent.platform = {};
    e.labs.userAgent.platform.isAndroid = function () {
        return e.labs.userAgent.util.matchUserAgent("Android")
    };
    e.labs.userAgent.platform.isIpod = function () {
        return e.labs.userAgent.util.matchUserAgent("iPod")
    };
    e.labs.userAgent.platform.isIphone = function () {
        return e.labs.userAgent.util.matchUserAgent("iPhone") && !e.labs.userAgent.util.matchUserAgent("iPod") && !e.labs.userAgent.util.matchUserAgent("iPad")
    };
    e.labs.userAgent.platform.isIpad = function () {
        return e.labs.userAgent.util.matchUserAgent("iPad")
    };
    e.labs.userAgent.platform.isIos = function () {
        return e.labs.userAgent.platform.isIphone() || e.labs.userAgent.platform.isIpad() || e.labs.userAgent.platform.isIpod()
    };
    e.labs.userAgent.platform.isMacintosh = function () {
        return e.labs.userAgent.util.matchUserAgent("Macintosh")
    };
    e.labs.userAgent.platform.isLinux = function () {
        return e.labs.userAgent.util.matchUserAgent("Linux")
    };
    e.labs.userAgent.platform.isWindows = function () {
        return e.labs.userAgent.util.matchUserAgent("Windows")
    };
    e.labs.userAgent.platform.isChromeOS = function () {
        return e.labs.userAgent.util.matchUserAgent("CrOS")
    };
    e.labs.userAgent.platform.isChromecast = function () {
        return e.labs.userAgent.util.matchUserAgent("CrKey")
    };
    e.labs.userAgent.platform.isKaiOS = function () {
        return e.labs.userAgent.util.matchUserAgentIgnoreCase("KaiOS")
    };
    e.labs.userAgent.platform.isGo2Phone = function () {
        return e.labs.userAgent.util.matchUserAgentIgnoreCase("GAFP")
    };
    e.labs.userAgent.platform.getVersion = function () {
        var a = e.labs.userAgent.util.getUserAgent(), c = "";
        e.labs.userAgent.platform.isWindows() ? (c = /Windows (?:NT|Phone) ([0-9.]+)/, c = (a = c.exec(a)) ? a[1] : "0.0") : e.labs.userAgent.platform.isIos() ? (c = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, c = (a = c.exec(a)) && a[1].replace(/_/g, ".")) : e.labs.userAgent.platform.isMacintosh() ? (c = /Mac OS X ([0-9_.]+)/, c = (a = c.exec(a)) ? a[1].replace(/_/g, ".") : "10") : e.labs.userAgent.platform.isKaiOS() ? (c = /(?:KaiOS)\/(\S+)/i, c = (a = c.exec(a)) &&
            a[1]) : e.labs.userAgent.platform.isAndroid() ? (c = /Android\s+([^\);]+)(\)|;)/, c = (a = c.exec(a)) && a[1]) : e.labs.userAgent.platform.isChromeOS() && (c = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, c = (a = c.exec(a)) && a[1]);
        return c || ""
    };
    e.labs.userAgent.platform.isVersionOrHigher = function (a) {
        return 0 <= e.string.compareVersions(e.labs.userAgent.platform.getVersion(), a)
    };
    e.userAgent = {};
    e.userAgent.ASSUME_IE = !1;
    e.userAgent.ASSUME_EDGE = !1;
    e.userAgent.ASSUME_GECKO = !1;
    e.userAgent.ASSUME_WEBKIT = !1;
    e.userAgent.ASSUME_MOBILE_WEBKIT = !1;
    e.userAgent.ASSUME_OPERA = !1;
    e.userAgent.ASSUME_ANY_VERSION = !1;
    e.userAgent.BROWSER_KNOWN_ = e.userAgent.ASSUME_IE || e.userAgent.ASSUME_EDGE || e.userAgent.ASSUME_GECKO || e.userAgent.ASSUME_MOBILE_WEBKIT || e.userAgent.ASSUME_WEBKIT || e.userAgent.ASSUME_OPERA;
    e.userAgent.getUserAgentString = function () {
        return e.labs.userAgent.util.getUserAgent()
    };
    e.userAgent.getNavigatorTyped = function () {
        return e.global.navigator || null
    };
    e.userAgent.getNavigator = function () {
        return e.userAgent.getNavigatorTyped()
    };
    e.userAgent.OPERA = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_OPERA : e.labs.userAgent.browser.isOpera();
    e.userAgent.IE = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_IE : e.labs.userAgent.browser.isIE();
    e.userAgent.EDGE = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_EDGE : e.labs.userAgent.engine.isEdge();
    e.userAgent.EDGE_OR_IE = e.userAgent.EDGE || e.userAgent.IE;
    e.userAgent.GECKO = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_GECKO : e.labs.userAgent.engine.isGecko();
    e.userAgent.WEBKIT = e.userAgent.BROWSER_KNOWN_ ? e.userAgent.ASSUME_WEBKIT || e.userAgent.ASSUME_MOBILE_WEBKIT : e.labs.userAgent.engine.isWebKit();
    e.userAgent.isMobile_ = function () {
        return e.userAgent.WEBKIT && e.labs.userAgent.util.matchUserAgent("Mobile")
    };
    e.userAgent.MOBILE = e.userAgent.ASSUME_MOBILE_WEBKIT || e.userAgent.isMobile_();
    e.userAgent.SAFARI = e.userAgent.WEBKIT;
    e.userAgent.determinePlatform_ = function () {
        var a = e.userAgent.getNavigatorTyped();
        return a && a.platform || ""
    };
    e.userAgent.PLATFORM = e.userAgent.determinePlatform_();
    e.userAgent.ASSUME_MAC = !1;
    e.userAgent.ASSUME_WINDOWS = !1;
    e.userAgent.ASSUME_LINUX = !1;
    e.userAgent.ASSUME_X11 = !1;
    e.userAgent.ASSUME_ANDROID = !1;
    e.userAgent.ASSUME_IPHONE = !1;
    e.userAgent.ASSUME_IPAD = !1;
    e.userAgent.ASSUME_IPOD = !1;
    e.userAgent.ASSUME_KAIOS = !1;
    e.userAgent.ASSUME_GO2PHONE = !1;
    e.userAgent.PLATFORM_KNOWN_ = e.userAgent.ASSUME_MAC || e.userAgent.ASSUME_WINDOWS || e.userAgent.ASSUME_LINUX || e.userAgent.ASSUME_X11 || e.userAgent.ASSUME_ANDROID || e.userAgent.ASSUME_IPHONE || e.userAgent.ASSUME_IPAD || e.userAgent.ASSUME_IPOD;
    e.userAgent.MAC = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_MAC : e.labs.userAgent.platform.isMacintosh();
    e.userAgent.WINDOWS = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_WINDOWS : e.labs.userAgent.platform.isWindows();
    e.userAgent.isLegacyLinux_ = function () {
        return e.labs.userAgent.platform.isLinux() || e.labs.userAgent.platform.isChromeOS()
    };
    e.userAgent.LINUX = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_LINUX : e.userAgent.isLegacyLinux_();
    e.userAgent.isX11_ = function () {
        var a = e.userAgent.getNavigatorTyped();
        return !!a && e.string.contains(a.appVersion || "", "X11")
    };
    e.userAgent.X11 = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_X11 : e.userAgent.isX11_();
    e.userAgent.ANDROID = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_ANDROID : e.labs.userAgent.platform.isAndroid();
    e.userAgent.IPHONE = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_IPHONE : e.labs.userAgent.platform.isIphone();
    e.userAgent.IPAD = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_IPAD : e.labs.userAgent.platform.isIpad();
    e.userAgent.IPOD = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_IPOD : e.labs.userAgent.platform.isIpod();
    e.userAgent.IOS = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_IPHONE || e.userAgent.ASSUME_IPAD || e.userAgent.ASSUME_IPOD : e.labs.userAgent.platform.isIos();
    e.userAgent.KAIOS = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_KAIOS : e.labs.userAgent.platform.isKaiOS();
    e.userAgent.GO2PHONE = e.userAgent.PLATFORM_KNOWN_ ? e.userAgent.ASSUME_GO2PHONE : e.labs.userAgent.platform.isGo2Phone();
    e.userAgent.determineVersion_ = function () {
        var a = "", c = e.userAgent.getVersionRegexResult_();
        c && (a = c ? c[1] : "");
        return e.userAgent.IE && (c = e.userAgent.getDocumentMode_(), null != c && c > parseFloat(a)) ? String(c) : a
    };
    e.userAgent.getVersionRegexResult_ = function () {
        var a = e.userAgent.getUserAgentString();
        if (e.userAgent.GECKO) return /rv:([^\);]+)(\)|;)/.exec(a);
        if (e.userAgent.EDGE) return /Edge\/([\d\.]+)/.exec(a);
        if (e.userAgent.IE) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
        if (e.userAgent.WEBKIT) return /WebKit\/(\S+)/.exec(a);
        if (e.userAgent.OPERA) return /(?:Version)[ \/]?(\S+)/.exec(a)
    };
    e.userAgent.getDocumentMode_ = function () {
        var a = e.global.document;
        return a ? a.documentMode : void 0
    };
    e.userAgent.VERSION = e.userAgent.determineVersion_();
    e.userAgent.compare = function (a, c) {
        return e.string.compareVersions(a, c)
    };
    e.userAgent.isVersionOrHigherCache_ = {};
    e.userAgent.isVersionOrHigher = function (a) {
        return e.userAgent.ASSUME_ANY_VERSION || e.reflect.cache(e.userAgent.isVersionOrHigherCache_, a, function () {
            return 0 <= e.string.compareVersions(e.userAgent.VERSION, a)
        })
    };
    e.userAgent.isVersion = e.userAgent.isVersionOrHigher;
    e.userAgent.isDocumentModeOrHigher = function (a) {
        return Number(e.userAgent.DOCUMENT_MODE) >= a
    };
    e.userAgent.isDocumentMode = e.userAgent.isDocumentModeOrHigher;
    var r = e.userAgent, w;
    w = e.global.document && e.userAgent.IE ? e.userAgent.getDocumentMode_() : void 0;
    r.DOCUMENT_MODE = w;
    e.debug.LOGGING_ENABLED = !0;
    e.debug.FORCE_SLOPPY_STACKS = !1;
    e.debug.catchErrors = function (a, c, d) {
        d = d || e.global;
        var f = d.onerror, g = !!c;
        e.userAgent.WEBKIT && !e.userAgent.isVersionOrHigher("535.3") && (g = !g);
        d.onerror = function (c, d, m, n, p) {
            f && f(c, d, m, n, p);
            a({message: c, fileName: d, line: m, lineNumber: m, col: n, error: p});
            return g
        }
    };
    e.debug.expose = function (a, c) {
        if ("undefined" == typeof a) return "undefined";
        if (null == a) return "NULL";
        var d = [], f;
        for (f in a) if (c || !e.isFunction(a[f])) {
            var g = f + " = ";
            try {
                g += a[f]
            } catch (h) {
                g += "*** " + h + " ***"
            }
            d.push(g)
        }
        return d.join("\n")
    };
    e.debug.deepExpose = function (a, c) {
        function d(a, m) {
            var l = m + "  ";
            try {
                if (void 0 === a) f.push("undefined"); else if (null === a) f.push("NULL"); else if ("string" === typeof a) f.push('"' + a.replace(/\n/g, "\n" + m) + '"'); else if (e.isFunction(a)) f.push(String(a).replace(/\n/g, "\n" + m)); else if (e.isObject(a)) {
                    e.hasUid(a) || g.push(a);
                    var p = e.getUid(a);
                    if (h[p]) f.push("*** reference loop detected (id=" + p + ") ***"); else {
                        h[p] = !0;
                        f.push("{");
                        for (var q in a) if (c || !e.isFunction(a[q])) f.push("\n"), f.push(l), f.push(q + " = "), d(a[q],
                            l);
                        f.push("\n" + m + "}");
                        delete h[p]
                    }
                } else f.push(a)
            } catch (t) {
                f.push("*** " + t + " ***")
            }
        }

        var f = [], g = [], h = {};
        d(a, "");
        for (a = 0; a < g.length; a++) e.removeUid(g[a]);
        return f.join("")
    };
    e.debug.exposeArray = function (a) {
        for (var c = [], d = 0; d < a.length; d++) e.isArray(a[d]) ? c.push(e.debug.exposeArray(a[d])) : c.push(a[d]);
        return "[ " + c.join(", ") + " ]"
    };
    e.debug.normalizeErrorObject = function (a) {
        var c = e.getObjectByName("window.location.href");
        null == a && (a = 'Unknown Error of type "null/undefined"');
        if ("string" === typeof a) return {
            message: a,
            name: "Unknown error",
            lineNumber: "Not available",
            fileName: c,
            stack: "Not available"
        };
        var d = !1;
        try {
            var f = a.lineNumber || a.line || "Not available"
        } catch (h) {
            f = "Not available", d = !0
        }
        try {
            var g = a.fileName || a.filename || a.sourceURL || e.global.$googDebugFname || c
        } catch (h) {
            g = "Not available", d = !0
        }
        return !d && a.lineNumber && a.fileName && a.stack &&
        a.message && a.name ? a : (c = a.message, null == c && (c = a.constructor && a.constructor instanceof Function ? 'Unknown Error of type "' + (a.constructor.name ? a.constructor.name : e.debug.getFunctionName(a.constructor)) + '"' : "Unknown Error of unknown type"), {
            message: c,
            name: a.name || "UnknownError",
            lineNumber: f,
            fileName: g,
            stack: a.stack || "Not available"
        })
    };
    e.debug.enhanceError = function (a, c) {
        a instanceof Error || (a = Error(a), Error.captureStackTrace && Error.captureStackTrace(a, e.debug.enhanceError));
        a.stack || (a.stack = e.debug.getStacktrace(e.debug.enhanceError));
        if (c) {
            for (var d = 0; a["message" + d];) ++d;
            a["message" + d] = String(c)
        }
        return a
    };
    e.debug.enhanceErrorWithContext = function (a, c) {
        a = e.debug.enhanceError(a);
        if (c) for (var d in c) e.debug.errorcontext.addErrorContext(a, d, c[d]);
        return a
    };
    e.debug.getStacktraceSimple = function (a) {
        if (!e.debug.FORCE_SLOPPY_STACKS) {
            var c = e.debug.getNativeStackTrace_(e.debug.getStacktraceSimple);
            if (c) return c
        }
        c = [];
        for (var d = arguments.callee.caller, f = 0; d && (!a || f < a);) {
            c.push(e.debug.getFunctionName(d));
            c.push("()\n");
            try {
                d = d.caller
            } catch (g) {
                c.push("[exception trying to get caller]\n");
                break
            }
            f++;
            if (f >= e.debug.MAX_STACK_DEPTH) {
                c.push("[...long stack...]");
                break
            }
        }
        a && f >= a ? c.push("[...reached max depth limit...]") : c.push("[end]");
        return c.join("")
    };
    e.debug.MAX_STACK_DEPTH = 50;
    e.debug.getNativeStackTrace_ = function (a) {
        var c = Error();
        if (Error.captureStackTrace) return Error.captureStackTrace(c, a), String(c.stack);
        try {
            throw c;
        } catch (d) {
            c = d
        }
        return (a = c.stack) ? String(a) : null
    };
    e.debug.getStacktrace = function (a) {
        var c;
        e.debug.FORCE_SLOPPY_STACKS || (c = e.debug.getNativeStackTrace_(a || e.debug.getStacktrace));
        c || (c = e.debug.getStacktraceHelper_(a || arguments.callee.caller, []));
        return c
    };
    e.debug.getStacktraceHelper_ = function (a, c) {
        var d = [];
        if (e.array.contains(c, a)) d.push("[...circular reference...]"); else if (a && c.length < e.debug.MAX_STACK_DEPTH) {
            d.push(e.debug.getFunctionName(a) + "(");
            for (var f = a.arguments, g = 0; f && g < f.length; g++) {
                0 < g && d.push(", ");
                var h = f[g];
                switch (typeof h) {
                    case "object":
                        h = h ? "object" : "null";
                        break;
                    case "string":
                        break;
                    case "number":
                        h = String(h);
                        break;
                    case "boolean":
                        h = h ? "true" : "false";
                        break;
                    case "function":
                        h = (h = e.debug.getFunctionName(h)) ? h : "[fn]";
                        break;
                    default:
                        h = typeof h
                }
                40 <
                h.length && (h = h.substr(0, 40) + "...");
                d.push(h)
            }
            c.push(a);
            d.push(")\n");
            try {
                d.push(e.debug.getStacktraceHelper_(a.caller, c))
            } catch (l) {
                d.push("[exception trying to get caller]\n")
            }
        } else a ? d.push("[...long stack...]") : d.push("[end]");
        return d.join("")
    };
    e.debug.getFunctionName = function (a) {
        if (e.debug.fnNameCache_[a]) return e.debug.fnNameCache_[a];
        a = String(a);
        if (!e.debug.fnNameCache_[a]) {
            var c = /function\s+([^\(]+)/m.exec(a);
            e.debug.fnNameCache_[a] = c ? c[1] : "[Anonymous]"
        }
        return e.debug.fnNameCache_[a]
    };
    e.debug.makeWhitespaceVisible = function (a) {
        return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]")
    };
    e.debug.runtimeType = function (a) {
        return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a
    };
    e.debug.fnNameCache_ = {};
    e.debug.freezeInternal_ = e.DEBUG && Object.freeze || function (a) {
        return a
    };
    e.debug.freeze = function (a) {
        return e.debug.freezeInternal_(a)
    };
    e.debug.LogRecord = function (a, c, d, f, g) {
        this.reset(a, c, d, f, g)
    };
    e.debug.LogRecord.prototype.sequenceNumber_ = 0;
    e.debug.LogRecord.prototype.exception_ = null;
    e.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
    e.debug.LogRecord.nextSequenceNumber_ = 0;
    e.debug.LogRecord.prototype.reset = function (a, c, d, f, g) {
        e.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && (this.sequenceNumber_ = "number" == typeof g ? g : e.debug.LogRecord.nextSequenceNumber_++);
        this.time_ = f || e.now();
        this.level_ = a;
        this.msg_ = c;
        this.loggerName_ = d;
        delete this.exception_
    };
    e.debug.LogRecord.prototype.getLoggerName = function () {
        return this.loggerName_
    };
    e.debug.LogRecord.prototype.getException = function () {
        return this.exception_
    };
    e.debug.LogRecord.prototype.setException = function (a) {
        this.exception_ = a
    };
    e.debug.LogRecord.prototype.setLoggerName = function (a) {
        this.loggerName_ = a
    };
    e.debug.LogRecord.prototype.getLevel = function () {
        return this.level_
    };
    e.debug.LogRecord.prototype.setLevel = function (a) {
        this.level_ = a
    };
    e.debug.LogRecord.prototype.getMessage = function () {
        return this.msg_
    };
    e.debug.LogRecord.prototype.setMessage = function (a) {
        this.msg_ = a
    };
    e.debug.LogRecord.prototype.getMillis = function () {
        return this.time_
    };
    e.debug.LogRecord.prototype.setMillis = function (a) {
        this.time_ = a
    };
    e.debug.LogRecord.prototype.getSequenceNumber = function () {
        return this.sequenceNumber_
    };
    e.debug.LogBuffer = function () {
        e.asserts.assert(e.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
        this.clear()
    };
    e.debug.LogBuffer.getInstance = function () {
        e.debug.LogBuffer.instance_ || (e.debug.LogBuffer.instance_ = new e.debug.LogBuffer);
        return e.debug.LogBuffer.instance_
    };
    e.debug.LogBuffer.CAPACITY = 0;
    e.debug.LogBuffer.prototype.addRecord = function (a, c, d) {
        var f = (this.curIndex_ + 1) % e.debug.LogBuffer.CAPACITY;
        this.curIndex_ = f;
        if (this.isFull_) return f = this.buffer_[f], f.reset(a, c, d), f;
        this.isFull_ = f == e.debug.LogBuffer.CAPACITY - 1;
        return this.buffer_[f] = new e.debug.LogRecord(a, c, d)
    };
    e.debug.LogBuffer.isBufferingEnabled = function () {
        return 0 < e.debug.LogBuffer.CAPACITY
    };
    e.debug.LogBuffer.prototype.clear = function () {
        this.buffer_ = Array(e.debug.LogBuffer.CAPACITY);
        this.curIndex_ = -1;
        this.isFull_ = !1
    };
    e.debug.LogBuffer.prototype.forEachRecord = function (a) {
        var c = this.buffer_;
        if (c[0]) {
            var d = this.curIndex_, f = this.isFull_ ? d : -1;
            do f = (f + 1) % e.debug.LogBuffer.CAPACITY, a(c[f]); while (f != d)
        }
    };
    e.debug.Logger = function (a) {
        this.name_ = a;
        this.handlers_ = this.children_ = this.level_ = this.parent_ = null
    };
    e.debug.Logger.ROOT_LOGGER_NAME = "";
    e.debug.Logger.ENABLE_HIERARCHY = !0;
    e.debug.Logger.ENABLE_PROFILER_LOGGING = !1;
    e.debug.Logger.ENABLE_HIERARCHY || (e.debug.Logger.rootHandlers_ = []);
    e.debug.Logger.Level = function (a, c) {
        this.name = a;
        this.value = c
    };
    e.debug.Logger.Level.prototype.toString = function () {
        return this.name
    };
    e.debug.Logger.Level.OFF = new e.debug.Logger.Level("OFF", Infinity);
    e.debug.Logger.Level.SHOUT = new e.debug.Logger.Level("SHOUT", 1200);
    e.debug.Logger.Level.SEVERE = new e.debug.Logger.Level("SEVERE", 1E3);
    e.debug.Logger.Level.WARNING = new e.debug.Logger.Level("WARNING", 900);
    e.debug.Logger.Level.INFO = new e.debug.Logger.Level("INFO", 800);
    e.debug.Logger.Level.CONFIG = new e.debug.Logger.Level("CONFIG", 700);
    e.debug.Logger.Level.FINE = new e.debug.Logger.Level("FINE", 500);
    e.debug.Logger.Level.FINER = new e.debug.Logger.Level("FINER", 400);
    e.debug.Logger.Level.FINEST = new e.debug.Logger.Level("FINEST", 300);
    e.debug.Logger.Level.ALL = new e.debug.Logger.Level("ALL", 0);
    e.debug.Logger.Level.PREDEFINED_LEVELS = [e.debug.Logger.Level.OFF, e.debug.Logger.Level.SHOUT, e.debug.Logger.Level.SEVERE, e.debug.Logger.Level.WARNING, e.debug.Logger.Level.INFO, e.debug.Logger.Level.CONFIG, e.debug.Logger.Level.FINE, e.debug.Logger.Level.FINER, e.debug.Logger.Level.FINEST, e.debug.Logger.Level.ALL];
    e.debug.Logger.Level.predefinedLevelsCache_ = null;
    e.debug.Logger.Level.createPredefinedLevelsCache_ = function () {
        e.debug.Logger.Level.predefinedLevelsCache_ = {};
        for (var a = 0, c; c = e.debug.Logger.Level.PREDEFINED_LEVELS[a]; a++) e.debug.Logger.Level.predefinedLevelsCache_[c.value] = c, e.debug.Logger.Level.predefinedLevelsCache_[c.name] = c
    };
    e.debug.Logger.Level.getPredefinedLevel = function (a) {
        e.debug.Logger.Level.predefinedLevelsCache_ || e.debug.Logger.Level.createPredefinedLevelsCache_();
        return e.debug.Logger.Level.predefinedLevelsCache_[a] || null
    };
    e.debug.Logger.Level.getPredefinedLevelByValue = function (a) {
        e.debug.Logger.Level.predefinedLevelsCache_ || e.debug.Logger.Level.createPredefinedLevelsCache_();
        if (a in e.debug.Logger.Level.predefinedLevelsCache_) return e.debug.Logger.Level.predefinedLevelsCache_[a];
        for (var c = 0; c < e.debug.Logger.Level.PREDEFINED_LEVELS.length; ++c) {
            var d = e.debug.Logger.Level.PREDEFINED_LEVELS[c];
            if (d.value <= a) return d
        }
        return null
    };
    e.debug.Logger.getLogger = function (a) {
        return e.debug.LogManager.getLogger(a)
    };
    e.debug.Logger.logToProfilers = function (a) {
        if (e.debug.Logger.ENABLE_PROFILER_LOGGING) {
            var c = e.global.msWriteProfilerMark;
            c ? c(a) : (c = e.global.console) && c.timeStamp && c.timeStamp(a)
        }
    };
    e.debug.Logger.prototype.getName = function () {
        return this.name_
    };
    e.debug.Logger.prototype.addHandler = function (a) {
        e.debug.LOGGING_ENABLED && (e.debug.Logger.ENABLE_HIERARCHY ? (this.handlers_ || (this.handlers_ = []), this.handlers_.push(a)) : (e.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), e.debug.Logger.rootHandlers_.push(a)))
    };
    e.debug.Logger.prototype.removeHandler = function (a) {
        if (e.debug.LOGGING_ENABLED) {
            var c = e.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : e.debug.Logger.rootHandlers_;
            return !!c && e.array.remove(c, a)
        }
        return !1
    };
    e.debug.Logger.prototype.getParent = function () {
        return this.parent_
    };
    e.debug.Logger.prototype.getChildren = function () {
        this.children_ || (this.children_ = {});
        return this.children_
    };
    e.debug.Logger.prototype.setLevel = function (a) {
        e.debug.LOGGING_ENABLED && (e.debug.Logger.ENABLE_HIERARCHY ? this.level_ = a : (e.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), e.debug.Logger.rootLevel_ = a))
    };
    e.debug.Logger.prototype.getLevel = function () {
        return e.debug.LOGGING_ENABLED ? this.level_ : e.debug.Logger.Level.OFF
    };
    e.debug.Logger.prototype.getEffectiveLevel = function () {
        if (!e.debug.LOGGING_ENABLED) return e.debug.Logger.Level.OFF;
        if (!e.debug.Logger.ENABLE_HIERARCHY) return e.debug.Logger.rootLevel_;
        if (this.level_) return this.level_;
        if (this.parent_) return this.parent_.getEffectiveLevel();
        e.asserts.fail("Root logger has no level set.");
        return null
    };
    e.debug.Logger.prototype.isLoggable = function (a) {
        return e.debug.LOGGING_ENABLED && a.value >= this.getEffectiveLevel().value
    };
    e.debug.Logger.prototype.log = function (a, c, d) {
        e.debug.LOGGING_ENABLED && this.isLoggable(a) && (e.isFunction(c) && (c = c()), this.doLogRecord_(this.getLogRecord(a, c, d)))
    };
    e.debug.Logger.prototype.getLogRecord = function (a, c, d) {
        a = e.debug.LogBuffer.isBufferingEnabled() ? e.debug.LogBuffer.getInstance().addRecord(a, c, this.name_) : new e.debug.LogRecord(a, String(c), this.name_);
        d && a.setException(d);
        return a
    };
    e.debug.Logger.prototype.shout = function (a, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.SHOUT, a, c)
    };
    e.debug.Logger.prototype.severe = function (a, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.SEVERE, a, c)
    };
    e.debug.Logger.prototype.warning = function (a, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.WARNING, a, c)
    };
    e.debug.Logger.prototype.info = function (a, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.INFO, a, c)
    };
    e.debug.Logger.prototype.config = function (a, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.CONFIG, a, c)
    };
    e.debug.Logger.prototype.fine = function (a, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.FINE, a, c)
    };
    e.debug.Logger.prototype.finer = function (a, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.FINER, a, c)
    };
    e.debug.Logger.prototype.finest = function (a, c) {
        e.debug.LOGGING_ENABLED && this.log(e.debug.Logger.Level.FINEST, a, c)
    };
    e.debug.Logger.prototype.logRecord = function (a) {
        e.debug.LOGGING_ENABLED && this.isLoggable(a.getLevel()) && this.doLogRecord_(a)
    };
    e.debug.Logger.prototype.doLogRecord_ = function (a) {
        e.debug.Logger.ENABLE_PROFILER_LOGGING && e.debug.Logger.logToProfilers("log:" + a.getMessage());
        if (e.debug.Logger.ENABLE_HIERARCHY) for (var c = this; c;) c.callPublish_(a), c = c.getParent(); else {
            c = 0;
            for (var d; d = e.debug.Logger.rootHandlers_[c++];) d(a)
        }
    };
    e.debug.Logger.prototype.callPublish_ = function (a) {
        if (this.handlers_) for (var c = 0, d; d = this.handlers_[c]; c++) d(a)
    };
    e.debug.Logger.prototype.setParent_ = function (a) {
        this.parent_ = a
    };
    e.debug.Logger.prototype.addChild_ = function (a, c) {
        this.getChildren()[a] = c
    };
    e.debug.LogManager = {};
    e.debug.LogManager.loggers_ = {};
    e.debug.LogManager.rootLogger_ = null;
    e.debug.LogManager.initialize = function () {
        e.debug.LogManager.rootLogger_ || (e.debug.LogManager.rootLogger_ = new e.debug.Logger(e.debug.Logger.ROOT_LOGGER_NAME), e.debug.LogManager.loggers_[e.debug.Logger.ROOT_LOGGER_NAME] = e.debug.LogManager.rootLogger_, e.debug.LogManager.rootLogger_.setLevel(e.debug.Logger.Level.CONFIG))
    };
    e.debug.LogManager.getLoggers = function () {
        return e.debug.LogManager.loggers_
    };
    e.debug.LogManager.getRoot = function () {
        e.debug.LogManager.initialize();
        return e.debug.LogManager.rootLogger_
    };
    e.debug.LogManager.getLogger = function (a) {
        e.debug.LogManager.initialize();
        return e.debug.LogManager.loggers_[a] || e.debug.LogManager.createLogger_(a)
    };
    e.debug.LogManager.createFunctionForCatchErrors = function (a) {
        return function (c) {
            (a || e.debug.LogManager.getRoot()).severe("Error: " + c.message + " (" + c.fileName + " @ Line: " + c.line + ")")
        }
    };
    e.debug.LogManager.createLogger_ = function (a) {
        var c = new e.debug.Logger(a);
        if (e.debug.Logger.ENABLE_HIERARCHY) {
            var d = a.lastIndexOf("."), f = a.substr(0, d);
            d = a.substr(d + 1);
            f = e.debug.LogManager.getLogger(f);
            f.addChild_(d, c);
            c.setParent_(f)
        }
        return e.debug.LogManager.loggers_[a] = c
    };
    e.debug.RelativeTimeProvider = function () {
        this.relativeTimeStart_ = e.now()
    };
    e.debug.RelativeTimeProvider.defaultInstance_ = null;
    e.debug.RelativeTimeProvider.prototype.set = function (a) {
        this.relativeTimeStart_ = a
    };
    e.debug.RelativeTimeProvider.prototype.reset = function () {
        this.set(e.now())
    };
    e.debug.RelativeTimeProvider.prototype.get = function () {
        return this.relativeTimeStart_
    };
    e.debug.RelativeTimeProvider.getDefaultInstance = function () {
        e.debug.RelativeTimeProvider.defaultInstance_ || (e.debug.RelativeTimeProvider.defaultInstance_ = new e.debug.RelativeTimeProvider);
        return e.debug.RelativeTimeProvider.defaultInstance_
    };
    e.debug.Formatter = function (a) {
        this.prefix_ = a || "";
        this.startTimeProvider_ = e.debug.RelativeTimeProvider.getDefaultInstance()
    };
    e.debug.Formatter.prototype.appendNewline = !0;
    e.debug.Formatter.prototype.showAbsoluteTime = !0;
    e.debug.Formatter.prototype.showRelativeTime = !0;
    e.debug.Formatter.prototype.showLoggerName = !0;
    e.debug.Formatter.prototype.showExceptionText = !1;
    e.debug.Formatter.prototype.showSeverityLevel = !1;
    e.debug.Formatter.prototype.formatRecord = e.abstractMethod;
    e.debug.Formatter.prototype.formatRecordAsHtml = e.abstractMethod;
    e.debug.Formatter.prototype.setStartTimeProvider = function (a) {
        this.startTimeProvider_ = a
    };
    e.debug.Formatter.prototype.getStartTimeProvider = function () {
        return this.startTimeProvider_
    };
    e.debug.Formatter.prototype.resetRelativeTimeStart = function () {
        this.startTimeProvider_.reset()
    };
    e.debug.Formatter.getDateTimeStamp_ = function (a) {
        a = new Date(a.getMillis());
        return e.debug.Formatter.getTwoDigitString_(a.getFullYear() - 2E3) + e.debug.Formatter.getTwoDigitString_(a.getMonth() + 1) + e.debug.Formatter.getTwoDigitString_(a.getDate()) + " " + e.debug.Formatter.getTwoDigitString_(a.getHours()) + ":" + e.debug.Formatter.getTwoDigitString_(a.getMinutes()) + ":" + e.debug.Formatter.getTwoDigitString_(a.getSeconds()) + "." + e.debug.Formatter.getTwoDigitString_(Math.floor(a.getMilliseconds() / 10))
    };
    e.debug.Formatter.getTwoDigitString_ = function (a) {
        return 10 > a ? "0" + a : String(a)
    };
    e.debug.Formatter.getRelativeTime_ = function (a, c) {
        a = (a.getMillis() - c) / 1E3;
        c = a.toFixed(3);
        var d = 0;
        if (1 > a) d = 2; else for (; 100 > a;) d++, a *= 10;
        for (; 0 < d--;) c = " " + c;
        return c
    };
    e.debug.HtmlFormatter = function (a) {
        e.debug.Formatter.call(this, a)
    };
    e.inherits(e.debug.HtmlFormatter, e.debug.Formatter);
    e.debug.HtmlFormatter.exposeException = function (a, c) {
        a = e.debug.HtmlFormatter.exposeExceptionAsHtml(a, c);
        return e.html.SafeHtml.unwrap(a)
    };
    e.debug.HtmlFormatter.exposeExceptionAsHtml = function (a, c) {
        try {
            var d = e.debug.normalizeErrorObject(a), f = e.debug.HtmlFormatter.createViewSourceUrl_(d.fileName);
            return e.html.SafeHtml.concat(e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Message: " + d.message + "\nUrl: "), e.html.SafeHtml.create("a", {
                href: f,
                target: "_new"
            }, d.fileName), e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("\nLine: " + d.lineNumber + "\n\nBrowser stack:\n" + d.stack + "-> [end]\n\nJS stack traversal:\n" + e.debug.getStacktrace(c) +
                "-> "))
        } catch (g) {
            return e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces("Exception trying to expose exception! You win, we lose. " + g)
        }
    };
    e.debug.HtmlFormatter.createViewSourceUrl_ = function (a) {
        null == a && (a = "");
        if (!/^https?:\/\//i.test(a)) return e.html.SafeUrl.fromConstant(e.string.Const.from("sanitizedviewsrc"));
        a = e.html.SafeUrl.sanitize(a);
        return e.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(e.string.Const.from("view-source scheme plus HTTP/HTTPS URL"), "view-source:" + e.html.SafeUrl.unwrap(a))
    };
    e.debug.HtmlFormatter.prototype.showExceptionText = !0;
    e.debug.HtmlFormatter.prototype.formatRecord = function (a) {
        return a ? this.formatRecordAsHtml(a).getTypedStringValue() : ""
    };
    e.debug.HtmlFormatter.prototype.formatRecordAsHtml = function (a) {
        if (!a) return e.html.SafeHtml.EMPTY;
        switch (a.getLevel().value) {
            case e.debug.Logger.Level.SHOUT.value:
                var c = "dbg-sh";
                break;
            case e.debug.Logger.Level.SEVERE.value:
                c = "dbg-sev";
                break;
            case e.debug.Logger.Level.WARNING.value:
                c = "dbg-w";
                break;
            case e.debug.Logger.Level.INFO.value:
                c = "dbg-i";
                break;
            default:
                c = "dbg-f"
        }
        var d = [];
        d.push(this.prefix_, " ");
        this.showAbsoluteTime && d.push("[", e.debug.Formatter.getDateTimeStamp_(a), "] ");
        this.showRelativeTime &&
        d.push("[", e.debug.Formatter.getRelativeTime_(a, this.startTimeProvider_.get()), "s] ");
        this.showLoggerName && d.push("[", a.getLoggerName(), "] ");
        this.showSeverityLevel && d.push("[", a.getLevel().name, "] ");
        d = e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(d.join(""));
        var f = e.html.SafeHtml.EMPTY;
        this.showExceptionText && a.getException() && (f = e.html.SafeHtml.concat(e.html.SafeHtml.BR, e.debug.HtmlFormatter.exposeExceptionAsHtml(a.getException())));
        a = e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(a.getMessage());
        c = e.html.SafeHtml.create("span", {"class": c}, e.html.SafeHtml.concat(a, f));
        return this.appendNewline ? e.html.SafeHtml.concat(d, c, e.html.SafeHtml.BR) : e.html.SafeHtml.concat(d, c)
    };
    e.debug.TextFormatter = function (a) {
        e.debug.Formatter.call(this, a)
    };
    e.inherits(e.debug.TextFormatter, e.debug.Formatter);
    e.debug.TextFormatter.prototype.formatRecord = function (a) {
        var c = [];
        c.push(this.prefix_, " ");
        this.showAbsoluteTime && c.push("[", e.debug.Formatter.getDateTimeStamp_(a), "] ");
        this.showRelativeTime && c.push("[", e.debug.Formatter.getRelativeTime_(a, this.startTimeProvider_.get()), "s] ");
        this.showLoggerName && c.push("[", a.getLoggerName(), "] ");
        this.showSeverityLevel && c.push("[", a.getLevel().name, "] ");
        c.push(a.getMessage());
        this.showExceptionText && (a = a.getException()) && c.push("\n", a instanceof Error ? a.message :
            a.toString());
        this.appendNewline && c.push("\n");
        return c.join("")
    };
    e.debug.TextFormatter.prototype.formatRecordAsHtml = function (a) {
        return e.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces(e.debug.TextFormatter.prototype.formatRecord(a))
    };
    e.log = {};
    e.log.ENABLED = e.debug.LOGGING_ENABLED;
    e.log.ROOT_LOGGER_NAME = e.debug.Logger.ROOT_LOGGER_NAME;
    e.log.Logger = e.debug.Logger;
    e.log.Level = e.debug.Logger.Level;
    e.log.LogRecord = e.debug.LogRecord;
    e.log.getLogger = function (a, c) {
        return e.log.ENABLED ? (a = e.debug.LogManager.getLogger(a), c && a && a.setLevel(c), a) : null
    };
    e.log.addHandler = function (a, c) {
        e.log.ENABLED && a && a.addHandler(c)
    };
    e.log.removeHandler = function (a, c) {
        return e.log.ENABLED && a ? a.removeHandler(c) : !1
    };
    e.log.log = function (a, c, d, f) {
        e.log.ENABLED && a && a.log(c, d, f)
    };
    e.log.error = function (a, c, d) {
        e.log.ENABLED && a && a.severe(c, d)
    };
    e.log.warning = function (a, c, d) {
        e.log.ENABLED && a && a.warning(c, d)
    };
    e.log.info = function (a, c, d) {
        e.log.ENABLED && a && a.info(c, d)
    };
    e.log.fine = function (a, c, d) {
        e.log.ENABLED && a && a.fine(c, d)
    };/*

 Copyright 2020 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
    k.LogFormatting = {};
    b.scope.prefixLogRecord = function (a, c, d) {
        var f = [];
        (a = (0, b.scope.getFormattedDocumentLocation)(a, d)) && f.push(a);
        c.getLoggerName() && f.push(c.getLoggerName());
        f = f.join(".");
        return new e.log.LogRecord(c.getLevel(), c.getMessage(), f, c.getMillis(), c.getSequenceNumber())
    };
    b.scope.getFormattedDocumentLocation = function (a, c) {
        if (!c) return "<" + a + ">";
        try {
            var d = e.Uri.parse(a)
        } catch (f) {
            return "<" + a + ">"
        }
        return "/_generated_background_page.html" == d.getPath() ? "" : "<" + d.getPath() + ">"
    };
    b.scope.textFormatter = new e.debug.TextFormatter;
    b.scope.textFormatter.showAbsoluteTime = !0;
    b.scope.textFormatter.showSeverityLevel = !0;
    k.LogFormatting.formatLogRecord = function (a, c) {
        return b.scope.textFormatter.formatRecord((0, b.scope.prefixLogRecord)(a, c, !1))
    };
    k.LogFormatting.formatLogRecordCompact = function (a, c) {
        return b.scope.textFormatter.formatRecord((0, b.scope.prefixLogRecord)(a, c, !0))
    };
    e.structs.CircularBuffer = function (a) {
        this.nextPtr_ = 0;
        this.maxSize_ = a || 100;
        this.buff_ = []
    };
    e.structs.CircularBuffer.prototype.add = function (a) {
        var c = this.buff_[this.nextPtr_];
        this.buff_[this.nextPtr_] = a;
        this.nextPtr_ = (this.nextPtr_ + 1) % this.maxSize_;
        return c
    };
    e.structs.CircularBuffer.prototype.get = function (a) {
        a = this.normalizeIndex_(a);
        return this.buff_[a]
    };
    e.structs.CircularBuffer.prototype.set = function (a, c) {
        a = this.normalizeIndex_(a);
        this.buff_[a] = c
    };
    e.structs.CircularBuffer.prototype.getCount = function () {
        return this.buff_.length
    };
    e.structs.CircularBuffer.prototype.isEmpty = function () {
        return 0 == this.buff_.length
    };
    e.structs.CircularBuffer.prototype.clear = function () {
        this.nextPtr_ = this.buff_.length = 0
    };
    e.structs.CircularBuffer.prototype.getValues = function () {
        return this.getNewestValues(this.getCount())
    };
    e.structs.CircularBuffer.prototype.getNewestValues = function (a) {
        var c = this.getCount(), d = [];
        for (a = this.getCount() - a; a < c; a++) d.push(this.get(a));
        return d
    };
    e.structs.CircularBuffer.prototype.getKeys = function () {
        for (var a = [], c = this.getCount(), d = 0; d < c; d++) a[d] = d;
        return a
    };
    e.structs.CircularBuffer.prototype.containsKey = function (a) {
        return a < this.getCount()
    };
    e.structs.CircularBuffer.prototype.containsValue = function (a) {
        for (var c = this.getCount(), d = 0; d < c; d++) if (this.get(d) == a) return !0;
        return !1
    };
    e.structs.CircularBuffer.prototype.getLast = function () {
        return 0 == this.getCount() ? null : this.get(this.getCount() - 1)
    };
    e.structs.CircularBuffer.prototype.normalizeIndex_ = function (a) {
        if (a >= this.buff_.length) throw Error("Out of bounds exception");
        return this.buff_.length < this.maxSize_ ? a : (this.nextPtr_ + Number(a)) % this.maxSize_
    };
    k.LogBuffer = function (a) {
        e.Disposable.call(this);
        this.capacity_ = a;
        this.size_ = 0;
        this.logsPrefixCapacity_ = Math.trunc(a / 2);
        this.formattedLogsPrefix_ = [];
        this.observers_ = [];
        this.formattedLogsSuffix_ = new e.structs.CircularBuffer(a - this.logsPrefixCapacity_)
    };
    e.inherits(k.LogBuffer, e.Disposable);
    e.exportSymbol("GoogleSmartCard.LogBuffer", k.LogBuffer);
    k.LogBuffer.prototype.getCapacity = function () {
        return this.capacity_
    };
    e.exportProperty(k.LogBuffer.prototype, "getCapacity", k.LogBuffer.prototype.getCapacity);
    k.LogBuffer.prototype.attachToLogger = function (a, c) {
        a.addHandler(this.onLogRecordObserved_.bind(this, c))
    };
    e.exportProperty(k.LogBuffer.prototype, "attachToLogger", k.LogBuffer.prototype.attachToLogger);
    k.LogBuffer.State = function (a, c, d, f) {
        this.logCount = a;
        this.formattedLogsPrefix = c;
        this.skippedLogCount = d;
        this.formattedLogsSuffix = f
    };
    e.exportProperty(k.LogBuffer, "State", k.LogBuffer.State);
    k.LogBuffer.State.prototype.getAsText = function () {
        var a = e.iter.join(this.formattedLogsPrefix, ""), c = e.iter.join(this.formattedLogsSuffix, "");
        this.skippedLogCount && (a += "\n... skipped " + this.skippedLogCount + " messages ...\n\n");
        return a + c
    };
    e.exportProperty(k.LogBuffer.State.prototype, "getAsText", k.LogBuffer.State.prototype.getAsText);
    k.LogBuffer.prototype.getState = function () {
        return new k.LogBuffer.State(this.size_, e.array.clone(this.formattedLogsPrefix_), this.size_ - this.formattedLogsPrefix_.length - this.formattedLogsSuffix_.getCount(), this.formattedLogsSuffix_.getValues())
    };
    e.exportProperty(k.LogBuffer.prototype, "getState", k.LogBuffer.prototype.getState);
    k.LogBuffer.prototype.addObserver = function (a) {
        this.observers_.push(a)
    };
    k.LogBuffer.prototype.removeObserver = function (a) {
        this.observers_ = this.observers_.filter(function (c) {
            return c !== a
        })
    };
    k.LogBuffer.prototype.onLogRecordObserved_ = function (a, c) {
        for (var d = b.makeIterator(this.observers_), f = d.next(); !f.done; f = d.next()) f = f.value, f(a, c);
        a = k.LogFormatting.formatLogRecordCompact(a, c);
        this.formattedLogsPrefix_.length < this.logsPrefixCapacity_ ? this.formattedLogsPrefix_.push(a) : this.formattedLogsSuffix_.add(a);
        ++this.size_
    };
    k.Logging = {};
    k.Logging.CrashLoopDetection = {};
    b.scope.ignoreChromeRuntimeLastError = function () {
    };
    b.scope.storeNewCrashTimestamps = function (a) {
        var c = Date.now(), d = c - b.scope.CRASH_LOOP_WINDOW_MILLISECONDS, f = a.filter(function (a) {
            return d <= a && a <= c
        });
        f.length >= b.scope.CRASH_LOOP_THRESHOLD_COUNT && (f = f.slice(-b.scope.CRASH_LOOP_THRESHOLD_COUNT + 1));
        f.push(c);
        if (!chrome || !chrome.storage || !chrome.storage.local) return Promise.resolve(f);
        var g = {};
        g[b.scope.STORAGE_KEY] = f;
        return new Promise(function (a) {
            chrome.storage.local.set(g, function () {
                chrome.runtime.lastError && (0, b.scope.ignoreChromeRuntimeLastError)();
                a(f)
            })
        })
    };
    b.scope.loadRecentCrashTimestamps = function () {
        return chrome && chrome.storage && chrome.storage.local ? new Promise(function (a) {
            chrome.storage.local.get(b.scope.STORAGE_KEY, function (c) {
                !chrome.runtime.lastError && c.hasOwnProperty(b.scope.STORAGE_KEY) && Array.isArray(c[b.scope.STORAGE_KEY]) ? a(c[b.scope.STORAGE_KEY].filter(function (a) {
                    return Number.isInteger(a)
                })) : a([])
            })
        }) : Promise.resolve([])
    };
    b.scope.STORAGE_KEY = "crash_timestamps";
    b.scope.CRASH_LOOP_WINDOW_MILLISECONDS = 6E4;
    b.scope.CRASH_LOOP_THRESHOLD_COUNT = 4;
    b.scope.crashing = !1;
    k.Logging.CrashLoopDetection.handleImminentCrash = function () {
        if (b.scope.crashing) return Promise.reject(Error("Already crashing"));
        b.scope.crashing = !0;
        return (0, b.scope.loadRecentCrashTimestamps)().then(function (a) {
            return (0, b.scope.storeNewCrashTimestamps)(a)
        }).then(function (a) {
            return Promise.resolve(a.length >= b.scope.CRASH_LOOP_THRESHOLD_COUNT)
        })
    };
    k.Logging.CrashLoopDetection.resetForTesting = function () {
        b.scope.crashing = !1
    };
    e.debug.Console = function () {
        this.publishHandler_ = e.bind(this.addLogRecord, this);
        this.formatter_ = new e.debug.TextFormatter;
        this.formatter_.showAbsoluteTime = !1;
        this.formatter_.showExceptionText = !1;
        this.isCapturing_ = this.formatter_.appendNewline = !1;
        this.logBuffer_ = "";
        this.filteredLoggers_ = {}
    };
    e.debug.Console.prototype.getFormatter = function () {
        return this.formatter_
    };
    e.debug.Console.prototype.setCapturing = function (a) {
        if (a != this.isCapturing_) {
            var c = e.debug.LogManager.getRoot();
            a ? c.addHandler(this.publishHandler_) : c.removeHandler(this.publishHandler_);
            this.isCapturing_ = a
        }
    };
    e.debug.Console.prototype.addLogRecord = function (a) {
        function c(a) {
            if (a) {
                if (a.value >= e.debug.Logger.Level.SEVERE.value) return "error";
                if (a.value >= e.debug.Logger.Level.WARNING.value) return "warn";
                if (a.value >= e.debug.Logger.Level.CONFIG.value) return "log"
            }
            return "debug"
        }

        if (!this.filteredLoggers_[a.getLoggerName()]) {
            var d = this.formatter_.formatRecord(a), f = e.debug.Console.console_;
            if (f) {
                var g = c(a.getLevel());
                e.debug.Console.logToConsole_(f, g, d, a.getException())
            } else this.logBuffer_ += d
        }
    };
    e.debug.Console.prototype.addFilter = function (a) {
        this.filteredLoggers_[a] = !0
    };
    e.debug.Console.prototype.removeFilter = function (a) {
        delete this.filteredLoggers_[a]
    };
    e.debug.Console.instance = null;
    e.debug.Console.console_ = e.global.console;
    e.debug.Console.setConsole = function (a) {
        e.debug.Console.console_ = a
    };
    e.debug.Console.autoInstall = function () {
        e.debug.Console.instance || (e.debug.Console.instance = new e.debug.Console);
        e.global.location && -1 != e.global.location.href.indexOf("Debug=true") && e.debug.Console.instance.setCapturing(!0)
    };
    e.debug.Console.show = function () {
        alert(e.debug.Console.instance.logBuffer_)
    };
    e.debug.Console.logToConsole_ = function (a, c, d, f) {
        if (a[c]) a[c](d, f || ""); else a.log(d, f || "")
    };
    b.scope.setupLogBuffer = function () {
        if (e.object.containsKey(window, k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME)) {
            var a = window[k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME];
            b.scope.logger.fine("Detected an existing log buffer instance, attaching it to the root logger")
        } else a = new k.LogBuffer(b.scope.LOG_BUFFER_CAPACITY), window[k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME] = a, b.scope.logger.fine("Created a new log buffer instance, attaching it to the root logger");
        a.attachToLogger(b.scope.rootLogger, document.location.href)
    };
    b.scope.setupRootLoggerLevel = function () {
        b.scope.rootLogger.setLevel(b.scope.ROOT_LOGGER_LEVEL)
    };
    b.scope.setupConsoleLogging = function () {
        var a = new e.debug.Console;
        a.getFormatter().showAbsoluteTime = !0;
        a.setCapturing(!0)
    };
    b.scope.reloadApp = function () {
        chrome.runtime.reload();
        chrome.runtime.restart()
    };
    b.scope.scheduleAppReloadIfAllowed = function () {
        !e.DEBUG && k.Logging.SELF_RELOAD_ON_FATAL_ERROR && k.Logging.CrashLoopDetection.handleImminentCrash().then(function (a) {
            a ? b.scope.rootLogger.info("Crash loop detected. The application is defunct, but the execution state is kept in order to retain the failure logs.") : (b.scope.rootLogger.info("Reloading the application due to the fatal error..."), (0, b.scope.reloadApp)())
        }).catch(function () {
        })
    };
    k.Logging.USE_SCOPED_LOGGERS = !0;
    k.Logging.SELF_RELOAD_ON_FATAL_ERROR = !1;
    b.scope.LOGGER_SCOPE = "GoogleSmartCard";
    b.scope.ROOT_LOGGER_LEVEL = e.DEBUG ? e.log.Level.FINE : e.log.Level.INFO;
    b.scope.LOG_BUFFER_CAPACITY = e.DEBUG ? 1E4 : 1E3;
    b.scope.rootLogger = e.asserts.assert(e.log.getLogger(e.log.ROOT_LOGGER_NAME));
    b.scope.logger = k.Logging.USE_SCOPED_LOGGERS ? e.asserts.assert(e.log.getLogger(b.scope.LOGGER_SCOPE)) : b.scope.rootLogger;
    b.scope.wasLoggingSetUp = !1;
    k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME = "googleSmartCardLogBuffer";
    k.Logging.setupLogging = function () {
        b.scope.wasLoggingSetUp || (b.scope.wasLoggingSetUp = !0, (0, b.scope.setupConsoleLogging)(), (0, b.scope.setupRootLoggerLevel)(), b.scope.logger.fine("Logging was set up with level=" + b.scope.ROOT_LOGGER_LEVEL.name + " and enabled logging to JS console"), (0, b.scope.setupLogBuffer)())
    };
    k.Logging.getLogger = function (a, c) {
        a = e.log.getLogger(a, c);
        k.Logging.check(a);
        e.asserts.assert(a);
        return a
    };
    k.Logging.getScopedLogger = function (a, c) {
        return k.Logging.getLogger(k.Logging.USE_SCOPED_LOGGERS && a ? b.scope.LOGGER_SCOPE + "." + a : k.Logging.USE_SCOPED_LOGGERS ? b.scope.LOGGER_SCOPE : a, c)
    };
    k.Logging.getChildLogger = function (a, c) {
        return k.Logging.getLogger(a.getName() + "." + c)
    };
    k.Logging.setLoggerVerbosityAtMost = function (a, c) {
        var d = a.getEffectiveLevel();
        (!d || d.value < c.value) && a.setLevel(c)
    };
    k.Logging.check = function (a, c) {
        a || k.Logging.fail(c)
    };
    k.Logging.checkWithLogger = function (a, c, d) {
        c || k.Logging.failWithLogger(a, d)
    };
    k.Logging.fail = function (a) {
        a = a ? a : "Failure";
        b.scope.rootLogger.severe(a);
        (0, b.scope.scheduleAppReloadIfAllowed)();
        throw Error(a);
    };
    k.Logging.failWithLogger = function (a, c) {
        a = "Failure in " + a.getName();
        void 0 !== c ? k.Logging.fail(a + ": " + c) : k.Logging.fail(a)
    };
    k.Logging.getLogBuffer = function () {
        return window[k.Logging.GLOBAL_LOG_BUFFER_VARIABLE_NAME]
    };
    k.Logging.setupLogging();/*

 Copyright 2016 Google Inc.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:

 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
    k.PcscLiteCommon = {};
    k.PcscLiteCommon.Constants = {};
    k.PcscLiteCommon.Constants.SERVER_OFFICIAL_APP_ID = "khpfeaanjngmcnplbdlpegiifgpfgdco";
    e.exportSymbol("GoogleSmartCard.PcscLiteCommon.Constants.SERVER_OFFICIAL_APP_ID", k.PcscLiteCommon.Constants.SERVER_OFFICIAL_APP_ID);
    k.PcscLiteCommon.Constants.REQUESTER_TITLE = "pcsc_lite_function_call";
    b.scope.FUNCTION_NAME_MESSAGE_KEY = "function_name";
    b.scope.ARGUMENTS_MESSAGE_KEY = "arguments";
    k.RemoteCallMessage = function (a, c) {
        this.functionName = a;
        this.functionArguments = c
    };
    k.RemoteCallMessage.parseRequestPayload = function (a) {
        return 2 == e.object.getCount(a) && e.object.containsKey(a, b.scope.FUNCTION_NAME_MESSAGE_KEY) && "string" === typeof a[b.scope.FUNCTION_NAME_MESSAGE_KEY] && e.object.containsKey(a, b.scope.ARGUMENTS_MESSAGE_KEY) && e.isArray(a[b.scope.ARGUMENTS_MESSAGE_KEY]) ? new k.RemoteCallMessage(a[b.scope.FUNCTION_NAME_MESSAGE_KEY], a[b.scope.ARGUMENTS_MESSAGE_KEY]) : null
    };
    k.RemoteCallMessage.prototype.makeRequestPayload = function () {
        return e.object.create(b.scope.FUNCTION_NAME_MESSAGE_KEY, this.functionName, b.scope.ARGUMENTS_MESSAGE_KEY, this.functionArguments)
    };
    k.RemoteCallMessage.prototype.getDebugRepresentation = function () {
        return e.string.subs("%s(%s)", this.functionName, e.iter.join(e.iter.map(this.functionArguments, k.DebugDump.debugDump), ", "))
    };
    k.RequesterMessage = {};
    b.scope.REQUEST_MESSAGE_TYPE_SUFFIX = "::request";
    b.scope.RESPONSE_MESSAGE_TYPE_SUFFIX = "::response";
    b.scope.REQUEST_ID_MESSAGE_KEY = "request_id";
    b.scope.PAYLOAD_MESSAGE_KEY = "payload";
    b.scope.ERROR_MESSAGE_KEY = "error";
    k.RequesterMessage.getRequestMessageType = function (a) {
        return a + b.scope.REQUEST_MESSAGE_TYPE_SUFFIX
    };
    k.RequesterMessage.getResponseMessageType = function (a) {
        return a + b.scope.RESPONSE_MESSAGE_TYPE_SUFFIX
    };
    k.RequesterMessage.RequestMessageData = function (a, c) {
        this.requestId = a;
        this.payload = c
    };
    k.RequesterMessage.RequestMessageData.parseMessageData = function (a) {
        return 2 == e.object.getCount(a) && e.object.containsKey(a, b.scope.REQUEST_ID_MESSAGE_KEY) && "number" === typeof a[b.scope.REQUEST_ID_MESSAGE_KEY] && e.object.containsKey(a, b.scope.PAYLOAD_MESSAGE_KEY) && e.isObject(a[b.scope.PAYLOAD_MESSAGE_KEY]) ? new k.RequesterMessage.RequestMessageData(a[b.scope.REQUEST_ID_MESSAGE_KEY], a[b.scope.PAYLOAD_MESSAGE_KEY]) : null
    };
    k.RequesterMessage.RequestMessageData.prototype.makeMessageData = function () {
        return e.object.create(b.scope.REQUEST_ID_MESSAGE_KEY, this.requestId, b.scope.PAYLOAD_MESSAGE_KEY, this.payload)
    };
    k.RequesterMessage.ResponseMessageData = function (a, c, d) {
        this.requestId = a;
        this.payload = c;
        this.errorMessage = d;
        k.Logging.checkWithLogger(this.logger, void 0 === c || void 0 === d)
    };
    k.RequesterMessage.ResponseMessageData.prototype.logger = k.Logging.getScopedLogger("RequesterMessage.ResponseMessageData");
    k.RequesterMessage.ResponseMessageData.prototype.isSuccessful = function () {
        return void 0 === this.errorMessage
    };
    k.RequesterMessage.ResponseMessageData.prototype.getPayload = function () {
        k.Logging.checkWithLogger(this.logger, this.isSuccessful());
        return this.payload
    };
    k.RequesterMessage.ResponseMessageData.prototype.getErrorMessage = function () {
        k.Logging.checkWithLogger(this.logger, !this.isSuccessful());
        k.Logging.checkWithLogger(this.logger, "string" === typeof this.errorMessage);
        e.asserts.assertString(this.errorMessage);
        return this.errorMessage
    };
    k.RequesterMessage.ResponseMessageData.parseMessageData = function (a) {
        if (2 != e.object.getCount(a) || !e.object.containsKey(a, b.scope.REQUEST_ID_MESSAGE_KEY) || "number" !== typeof a[b.scope.REQUEST_ID_MESSAGE_KEY]) return null;
        var c = a[b.scope.REQUEST_ID_MESSAGE_KEY];
        return e.object.containsKey(a, b.scope.PAYLOAD_MESSAGE_KEY) ? new k.RequesterMessage.ResponseMessageData(c, a[b.scope.PAYLOAD_MESSAGE_KEY]) : e.object.containsKey(a, b.scope.ERROR_MESSAGE_KEY) && "string" === typeof a[b.scope.ERROR_MESSAGE_KEY] ? new k.RequesterMessage.ResponseMessageData(c,
            void 0, a[b.scope.ERROR_MESSAGE_KEY]) : null
    };
    k.RequesterMessage.ResponseMessageData.prototype.makeMessageData = function () {
        var a = [b.scope.REQUEST_ID_MESSAGE_KEY, this.requestId];
        this.isSuccessful() ? (a.push(b.scope.PAYLOAD_MESSAGE_KEY), a.push(this.getPayload())) : (a.push(b.scope.ERROR_MESSAGE_KEY), a.push(this.getErrorMessage()));
        return e.object.create(a)
    };
    e.Thenable = function () {
    };
    e.Thenable.prototype.then = function () {
    };
    e.Thenable.IMPLEMENTED_BY_PROP = "$goog_Thenable";
    e.Thenable.addImplementation = function (a) {
        a.prototype[e.Thenable.IMPLEMENTED_BY_PROP] = !0
    };
    e.Thenable.isImplementedBy = function (a) {
        if (!a) return !1;
        try {
            return !!a[e.Thenable.IMPLEMENTED_BY_PROP]
        } catch (c) {
            return !1
        }
    };
    e.async = {};
    e.async.FreeList = function (a, c, d) {
        this.limit_ = d;
        this.create_ = a;
        this.reset_ = c;
        this.occupants_ = 0;
        this.head_ = null
    };
    e.async.FreeList.prototype.get = function () {
        if (0 < this.occupants_) {
            this.occupants_--;
            var a = this.head_;
            this.head_ = a.next;
            a.next = null
        } else a = this.create_();
        return a
    };
    e.async.FreeList.prototype.put = function (a) {
        this.reset_(a);
        this.occupants_ < this.limit_ && (this.occupants_++, a.next = this.head_, this.head_ = a)
    };
    e.async.FreeList.prototype.occupants = function () {
        return this.occupants_
    };
    e.async.WorkQueue = function () {
        this.workTail_ = this.workHead_ = null
    };
    e.async.WorkQueue.DEFAULT_MAX_UNUSED = 100;
    e.async.WorkQueue.freelist_ = new e.async.FreeList(function () {
        return new e.async.WorkItem
    }, function (a) {
        a.reset()
    }, e.async.WorkQueue.DEFAULT_MAX_UNUSED);
    e.async.WorkQueue.prototype.add = function (a, c) {
        var d = this.getUnusedItem_();
        d.set(a, c);
        this.workTail_ ? this.workTail_.next = d : (e.asserts.assert(!this.workHead_), this.workHead_ = d);
        this.workTail_ = d
    };
    e.async.WorkQueue.prototype.remove = function () {
        var a = null;
        this.workHead_ && (a = this.workHead_, this.workHead_ = this.workHead_.next, this.workHead_ || (this.workTail_ = null), a.next = null);
        return a
    };
    e.async.WorkQueue.prototype.returnUnused = function (a) {
        e.async.WorkQueue.freelist_.put(a)
    };
    e.async.WorkQueue.prototype.getUnusedItem_ = function () {
        return e.async.WorkQueue.freelist_.get()
    };
    e.async.WorkItem = function () {
        this.next = this.scope = this.fn = null
    };
    e.async.WorkItem.prototype.set = function (a, c) {
        this.fn = a;
        this.scope = c;
        this.next = null
    };
    e.async.WorkItem.prototype.reset = function () {
        this.next = this.scope = this.fn = null
    };
    e.debug.entryPointRegistry = {};
    e.debug.EntryPointMonitor = function () {
    };
    e.debug.entryPointRegistry.refList_ = [];
    e.debug.entryPointRegistry.monitors_ = [];
    e.debug.entryPointRegistry.monitorsMayExist_ = !1;
    e.debug.entryPointRegistry.register = function (a) {
        e.debug.entryPointRegistry.refList_[e.debug.entryPointRegistry.refList_.length] = a;
        if (e.debug.entryPointRegistry.monitorsMayExist_) for (var c = e.debug.entryPointRegistry.monitors_, d = 0; d < c.length; d++) a(e.bind(c[d].wrap, c[d]))
    };
    e.debug.entryPointRegistry.monitorAll = function (a) {
        e.debug.entryPointRegistry.monitorsMayExist_ = !0;
        for (var c = e.bind(a.wrap, a), d = 0; d < e.debug.entryPointRegistry.refList_.length; d++) e.debug.entryPointRegistry.refList_[d](c);
        e.debug.entryPointRegistry.monitors_.push(a)
    };
    e.debug.entryPointRegistry.unmonitorAllIfPossible = function (a) {
        var c = e.debug.entryPointRegistry.monitors_;
        e.asserts.assert(a == c[c.length - 1], "Only the most recent monitor can be unwrapped.");
        a = e.bind(a.unwrap, a);
        for (var d = 0; d < e.debug.entryPointRegistry.refList_.length; d++) e.debug.entryPointRegistry.refList_[d](a);
        c.length--
    };
    e.dom.BrowserFeature = {};
    e.dom.BrowserFeature.ASSUME_NO_OFFSCREEN_CANVAS = !1;
    e.dom.BrowserFeature.ASSUME_OFFSCREEN_CANVAS = !1;
    e.dom.BrowserFeature.detectOffscreenCanvas_ = function (a) {
        try {
            return !!(new self.OffscreenCanvas(0, 0)).getContext(a)
        } catch (c) {
        }
        return !1
    };
    e.dom.BrowserFeature.OFFSCREEN_CANVAS_2D = !e.dom.BrowserFeature.ASSUME_NO_OFFSCREEN_CANVAS && (e.dom.BrowserFeature.ASSUME_OFFSCREEN_CANVAS || e.dom.BrowserFeature.detectOffscreenCanvas_("2d"));
    e.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES = !e.userAgent.IE || e.userAgent.isDocumentModeOrHigher(9);
    e.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE = !e.userAgent.GECKO && !e.userAgent.IE || e.userAgent.IE && e.userAgent.isDocumentModeOrHigher(9) || e.userAgent.GECKO && e.userAgent.isVersionOrHigher("1.9.1");
    e.dom.BrowserFeature.CAN_USE_INNER_TEXT = e.userAgent.IE && !e.userAgent.isVersionOrHigher("9");
    e.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY = e.userAgent.IE || e.userAgent.OPERA || e.userAgent.WEBKIT;
    e.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT = e.userAgent.IE;
    e.dom.BrowserFeature.LEGACY_IE_RANGES = e.userAgent.IE && !e.userAgent.isDocumentModeOrHigher(9);
    e.math.Coordinate = function (a, c) {
        this.x = void 0 !== a ? a : 0;
        this.y = void 0 !== c ? c : 0
    };
    e.math.Coordinate.prototype.clone = function () {
        return new e.math.Coordinate(this.x, this.y)
    };
    e.DEBUG && (e.math.Coordinate.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ")"
    });
    e.math.Coordinate.prototype.equals = function (a) {
        return a instanceof e.math.Coordinate && e.math.Coordinate.equals(this, a)
    };
    e.math.Coordinate.equals = function (a, c) {
        return a == c ? !0 : a && c ? a.x == c.x && a.y == c.y : !1
    };
    e.math.Coordinate.distance = function (a, c) {
        var d = a.x - c.x;
        a = a.y - c.y;
        return Math.sqrt(d * d + a * a)
    };
    e.math.Coordinate.magnitude = function (a) {
        return Math.sqrt(a.x * a.x + a.y * a.y)
    };
    e.math.Coordinate.azimuth = function (a) {
        return e.math.angle(0, 0, a.x, a.y)
    };
    e.math.Coordinate.squaredDistance = function (a, c) {
        var d = a.x - c.x;
        a = a.y - c.y;
        return d * d + a * a
    };
    e.math.Coordinate.difference = function (a, c) {
        return new e.math.Coordinate(a.x - c.x, a.y - c.y)
    };
    e.math.Coordinate.sum = function (a, c) {
        return new e.math.Coordinate(a.x + c.x, a.y + c.y)
    };
    e.math.Coordinate.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this
    };
    e.math.Coordinate.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this
    };
    e.math.Coordinate.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this
    };
    e.math.Coordinate.prototype.translate = function (a, c) {
        a instanceof e.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += Number(a), "number" === typeof c && (this.y += c));
        return this
    };
    e.math.Coordinate.prototype.scale = function (a, c) {
        this.x *= a;
        this.y *= "number" === typeof c ? c : a;
        return this
    };
    e.math.Coordinate.prototype.rotateRadians = function (a, c) {
        c = c || new e.math.Coordinate(0, 0);
        var d = this.x, f = this.y, g = Math.cos(a);
        a = Math.sin(a);
        this.x = (d - c.x) * g - (f - c.y) * a + c.x;
        this.y = (d - c.x) * a + (f - c.y) * g + c.y
    };
    e.math.Coordinate.prototype.rotateDegrees = function (a, c) {
        this.rotateRadians(e.math.toRadians(a), c)
    };
    e.math.Size = function (a, c) {
        this.width = a;
        this.height = c
    };
    e.math.Size.equals = function (a, c) {
        return a == c ? !0 : a && c ? a.width == c.width && a.height == c.height : !1
    };
    e.math.Size.prototype.clone = function () {
        return new e.math.Size(this.width, this.height)
    };
    e.DEBUG && (e.math.Size.prototype.toString = function () {
        return "(" + this.width + " x " + this.height + ")"
    });
    e.math.Size.prototype.getLongest = function () {
        return Math.max(this.width, this.height)
    };
    e.math.Size.prototype.getShortest = function () {
        return Math.min(this.width, this.height)
    };
    e.math.Size.prototype.area = function () {
        return this.width * this.height
    };
    e.math.Size.prototype.perimeter = function () {
        return 2 * (this.width + this.height)
    };
    e.math.Size.prototype.aspectRatio = function () {
        return this.width / this.height
    };
    e.math.Size.prototype.isEmpty = function () {
        return !this.area()
    };
    e.math.Size.prototype.ceil = function () {
        this.width = Math.ceil(this.width);
        this.height = Math.ceil(this.height);
        return this
    };
    e.math.Size.prototype.fitsInside = function (a) {
        return this.width <= a.width && this.height <= a.height
    };
    e.math.Size.prototype.floor = function () {
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        return this
    };
    e.math.Size.prototype.round = function () {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this
    };
    e.math.Size.prototype.scale = function (a, c) {
        this.width *= a;
        this.height *= "number" === typeof c ? c : a;
        return this
    };
    e.math.Size.prototype.scaleToCover = function (a) {
        a = this.aspectRatio() <= a.aspectRatio() ? a.width / this.width : a.height / this.height;
        return this.scale(a)
    };
    e.math.Size.prototype.scaleToFit = function (a) {
        a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
        return this.scale(a)
    };
    e.dom.ASSUME_QUIRKS_MODE = !1;
    e.dom.ASSUME_STANDARDS_MODE = !1;
    e.dom.COMPAT_MODE_KNOWN_ = e.dom.ASSUME_QUIRKS_MODE || e.dom.ASSUME_STANDARDS_MODE;
    e.dom.getDomHelper = function (a) {
        return a ? new e.dom.DomHelper(e.dom.getOwnerDocument(a)) : e.dom.defaultDomHelper_ || (e.dom.defaultDomHelper_ = new e.dom.DomHelper)
    };
    e.dom.getDocument = function () {
        return document
    };
    e.dom.getElement = function (a) {
        return e.dom.getElementHelper_(document, a)
    };
    e.dom.getElementHelper_ = function (a, c) {
        return "string" === typeof c ? a.getElementById(c) : c
    };
    e.dom.getRequiredElement = function (a) {
        return e.dom.getRequiredElementHelper_(document, a)
    };
    e.dom.getRequiredElementHelper_ = function (a, c) {
        e.asserts.assertString(c);
        a = e.dom.getElementHelper_(a, c);
        return a = e.asserts.assertElement(a, "No element found with id: " + c)
    };
    e.dom.$ = e.dom.getElement;
    e.dom.getElementsByTagName = function (a, c) {
        return (c || document).getElementsByTagName(String(a))
    };
    e.dom.getElementsByTagNameAndClass = function (a, c, d) {
        return e.dom.getElementsByTagNameAndClass_(document, a, c, d)
    };
    e.dom.getElementByTagNameAndClass = function (a, c, d) {
        return e.dom.getElementByTagNameAndClass_(document, a, c, d)
    };
    e.dom.getElementsByClass = function (a, c) {
        var d = c || document;
        return e.dom.canUseQuerySelector_(d) ? d.querySelectorAll("." + a) : e.dom.getElementsByTagNameAndClass_(document, "*", a, c)
    };
    e.dom.getElementByClass = function (a, c) {
        var d = c || document;
        return (d.getElementsByClassName ? d.getElementsByClassName(a)[0] : e.dom.getElementByTagNameAndClass_(document, "*", a, c)) || null
    };
    e.dom.getRequiredElementByClass = function (a, c) {
        c = e.dom.getElementByClass(a, c);
        return e.asserts.assert(c, "No element found with className: " + a)
    };
    e.dom.canUseQuerySelector_ = function (a) {
        return !(!a.querySelectorAll || !a.querySelector)
    };
    e.dom.getElementsByTagNameAndClass_ = function (a, c, d, f) {
        a = f || a;
        c = c && "*" != c ? String(c).toUpperCase() : "";
        if (e.dom.canUseQuerySelector_(a) && (c || d)) return a.querySelectorAll(c + (d ? "." + d : ""));
        if (d && a.getElementsByClassName) {
            a = a.getElementsByClassName(d);
            if (c) {
                f = {};
                for (var g = 0, h = 0, l; l = a[h]; h++) c == l.nodeName && (f[g++] = l);
                f.length = g;
                return f
            }
            return a
        }
        a = a.getElementsByTagName(c || "*");
        if (d) {
            f = {};
            for (h = g = 0; l = a[h]; h++) c = l.className, "function" == typeof c.split && e.array.contains(c.split(/\s+/), d) && (f[g++] = l);
            f.length =
                g;
            return f
        }
        return a
    };
    e.dom.getElementByTagNameAndClass_ = function (a, c, d, f) {
        var g = f || a, h = c && "*" != c ? String(c).toUpperCase() : "";
        return e.dom.canUseQuerySelector_(g) && (h || d) ? g.querySelector(h + (d ? "." + d : "")) : e.dom.getElementsByTagNameAndClass_(a, c, d, f)[0] || null
    };
    e.dom.$$ = e.dom.getElementsByTagNameAndClass;
    e.dom.setProperties = function (a, c) {
        e.object.forEach(c, function (c, f) {
            c && "object" == typeof c && c.implementsGoogStringTypedString && (c = c.getTypedStringValue());
            "style" == f ? a.style.cssText = c : "class" == f ? a.className = c : "for" == f ? a.htmlFor = c : e.dom.DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(f) ? a.setAttribute(e.dom.DIRECT_ATTRIBUTE_MAP_[f], c) : e.string.startsWith(f, "aria-") || e.string.startsWith(f, "data-") ? a.setAttribute(f, c) : a[f] = c
        })
    };
    e.dom.DIRECT_ATTRIBUTE_MAP_ = {
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        colspan: "colSpan",
        frameborder: "frameBorder",
        height: "height",
        maxlength: "maxLength",
        nonce: "nonce",
        role: "role",
        rowspan: "rowSpan",
        type: "type",
        usemap: "useMap",
        valign: "vAlign",
        width: "width"
    };
    e.dom.getViewportSize = function (a) {
        return e.dom.getViewportSize_(a || window)
    };
    e.dom.getViewportSize_ = function (a) {
        a = a.document;
        a = e.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
        return new e.math.Size(a.clientWidth, a.clientHeight)
    };
    e.dom.getDocumentHeight = function () {
        return e.dom.getDocumentHeight_(window)
    };
    e.dom.getDocumentHeightForWindow = function (a) {
        return e.dom.getDocumentHeight_(a)
    };
    e.dom.getDocumentHeight_ = function (a) {
        var c = a.document, d = 0;
        if (c) {
            d = c.body;
            var f = c.documentElement;
            if (!f || !d) return 0;
            a = e.dom.getViewportSize_(a).height;
            if (e.dom.isCss1CompatMode_(c) && f.scrollHeight) d = f.scrollHeight != a ? f.scrollHeight : f.offsetHeight; else {
                c = f.scrollHeight;
                var g = f.offsetHeight;
                f.clientHeight != g && (c = d.scrollHeight, g = d.offsetHeight);
                d = c > a ? c > g ? c : g : c < g ? c : g
            }
        }
        return d
    };
    e.dom.getPageScroll = function (a) {
        return e.dom.getDomHelper((a || e.global || window).document).getDocumentScroll()
    };
    e.dom.getDocumentScroll = function () {
        return e.dom.getDocumentScroll_(document)
    };
    e.dom.getDocumentScroll_ = function (a) {
        var c = e.dom.getDocumentScrollElement_(a);
        a = e.dom.getWindow_(a);
        return e.userAgent.IE && e.userAgent.isVersionOrHigher("10") && a.pageYOffset != c.scrollTop ? new e.math.Coordinate(c.scrollLeft, c.scrollTop) : new e.math.Coordinate(a.pageXOffset || c.scrollLeft, a.pageYOffset || c.scrollTop)
    };
    e.dom.getDocumentScrollElement = function () {
        return e.dom.getDocumentScrollElement_(document)
    };
    e.dom.getDocumentScrollElement_ = function (a) {
        return a.scrollingElement ? a.scrollingElement : !e.userAgent.WEBKIT && e.dom.isCss1CompatMode_(a) ? a.documentElement : a.body || a.documentElement
    };
    e.dom.getWindow = function (a) {
        return a ? e.dom.getWindow_(a) : window
    };
    e.dom.getWindow_ = function (a) {
        return a.parentWindow || a.defaultView
    };
    e.dom.createDom = function (a, c, d) {
        return e.dom.createDom_(document, arguments)
    };
    e.dom.createDom_ = function (a, c) {
        var d = String(c[0]), f = c[1];
        if (!e.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && f && (f.name || f.type)) {
            d = ["<", d];
            f.name && d.push(' name="', e.string.htmlEscape(f.name), '"');
            if (f.type) {
                d.push(' type="', e.string.htmlEscape(f.type), '"');
                var g = {};
                e.object.extend(g, f);
                delete g.type;
                f = g
            }
            d.push(">");
            d = d.join("")
        }
        d = e.dom.createElement_(a, d);
        f && ("string" === typeof f ? d.className = f : e.isArray(f) ? d.className = f.join(" ") : e.dom.setProperties(d, f));
        2 < c.length && e.dom.append_(a, d, c, 2);
        return d
    };
    e.dom.append_ = function (a, c, d, f) {
        function g(d) {
            d && c.appendChild("string" === typeof d ? a.createTextNode(d) : d)
        }

        for (; f < d.length; f++) {
            var h = d[f];
            e.isArrayLike(h) && !e.dom.isNodeLike(h) ? e.array.forEach(e.dom.isNodeList(h) ? e.array.toArray(h) : h, g) : g(h)
        }
    };
    e.dom.$dom = e.dom.createDom;
    e.dom.createElement = function (a) {
        return e.dom.createElement_(document, a)
    };
    e.dom.createElement_ = function (a, c) {
        c = String(c);
        "application/xhtml+xml" === a.contentType && (c = c.toLowerCase());
        return a.createElement(c)
    };
    e.dom.createTextNode = function (a) {
        return document.createTextNode(String(a))
    };
    e.dom.createTable = function (a, c, d) {
        return e.dom.createTable_(document, a, c, !!d)
    };
    e.dom.createTable_ = function (a, c, d, f) {
        for (var g = e.dom.createElement_(a, "TABLE"), h = g.appendChild(e.dom.createElement_(a, "TBODY")), l = 0; l < c; l++) {
            for (var m = e.dom.createElement_(a, "TR"), n = 0; n < d; n++) {
                var p = e.dom.createElement_(a, "TD");
                f && e.dom.setTextContent(p, e.string.Unicode.NBSP);
                m.appendChild(p)
            }
            h.appendChild(m)
        }
        return g
    };
    e.dom.constHtmlToNode = function (a) {
        var c = e.array.map(arguments, e.string.Const.unwrap);
        c = e.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(e.string.Const.from("Constant HTML string, that gets turned into a Node later, so it will be automatically balanced."), c.join(""));
        return e.dom.safeHtmlToNode(c)
    };
    e.dom.safeHtmlToNode = function (a) {
        return e.dom.safeHtmlToNode_(document, a)
    };
    e.dom.safeHtmlToNode_ = function (a, c) {
        var d = e.dom.createElement_(a, "DIV");
        e.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (e.dom.safe.setInnerHtml(d, e.html.SafeHtml.concat(e.html.SafeHtml.BR, c)), d.removeChild(e.asserts.assert(d.firstChild))) : e.dom.safe.setInnerHtml(d, c);
        return e.dom.childrenToNode_(a, d)
    };
    e.dom.childrenToNode_ = function (a, c) {
        if (1 == c.childNodes.length) return c.removeChild(e.asserts.assert(c.firstChild));
        for (a = a.createDocumentFragment(); c.firstChild;) a.appendChild(c.firstChild);
        return a
    };
    e.dom.isCss1CompatMode = function () {
        return e.dom.isCss1CompatMode_(document)
    };
    e.dom.isCss1CompatMode_ = function (a) {
        return e.dom.COMPAT_MODE_KNOWN_ ? e.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
    };
    e.dom.canHaveChildren = function (a) {
        if (a.nodeType != e.dom.NodeType.ELEMENT) return !1;
        switch (a.tagName) {
            case "APPLET":
            case "AREA":
            case "BASE":
            case "BR":
            case "COL":
            case "COMMAND":
            case "EMBED":
            case "FRAME":
            case "HR":
            case "IMG":
            case "INPUT":
            case "IFRAME":
            case "ISINDEX":
            case "KEYGEN":
            case "LINK":
            case "NOFRAMES":
            case "NOSCRIPT":
            case "META":
            case "OBJECT":
            case "PARAM":
            case "SCRIPT":
            case "SOURCE":
            case "STYLE":
            case "TRACK":
            case "WBR":
                return !1
        }
        return !0
    };
    e.dom.appendChild = function (a, c) {
        e.asserts.assert(null != a && null != c, "goog.dom.appendChild expects non-null arguments");
        a.appendChild(c)
    };
    e.dom.append = function (a, c) {
        e.dom.append_(e.dom.getOwnerDocument(a), a, arguments, 1)
    };
    e.dom.removeChildren = function (a) {
        for (var c; c = a.firstChild;) a.removeChild(c)
    };
    e.dom.insertSiblingBefore = function (a, c) {
        e.asserts.assert(null != a && null != c, "goog.dom.insertSiblingBefore expects non-null arguments");
        c.parentNode && c.parentNode.insertBefore(a, c)
    };
    e.dom.insertSiblingAfter = function (a, c) {
        e.asserts.assert(null != a && null != c, "goog.dom.insertSiblingAfter expects non-null arguments");
        c.parentNode && c.parentNode.insertBefore(a, c.nextSibling)
    };
    e.dom.insertChildAt = function (a, c, d) {
        e.asserts.assert(null != a, "goog.dom.insertChildAt expects a non-null parent");
        a.insertBefore(c, a.childNodes[d] || null)
    };
    e.dom.removeNode = function (a) {
        return a && a.parentNode ? a.parentNode.removeChild(a) : null
    };
    e.dom.replaceNode = function (a, c) {
        e.asserts.assert(null != a && null != c, "goog.dom.replaceNode expects non-null arguments");
        var d = c.parentNode;
        d && d.replaceChild(a, c)
    };
    e.dom.flattenElement = function (a) {
        var c, d = a.parentNode;
        if (d && d.nodeType != e.dom.NodeType.DOCUMENT_FRAGMENT) {
            if (a.removeNode) return a.removeNode(!1);
            for (; c = a.firstChild;) d.insertBefore(c, a);
            return e.dom.removeNode(a)
        }
    };
    e.dom.getChildren = function (a) {
        return e.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : e.array.filter(a.childNodes, function (a) {
            return a.nodeType == e.dom.NodeType.ELEMENT
        })
    };
    e.dom.getFirstElementChild = function (a) {
        return void 0 !== a.firstElementChild ? a.firstElementChild : e.dom.getNextElementNode_(a.firstChild, !0)
    };
    e.dom.getLastElementChild = function (a) {
        return void 0 !== a.lastElementChild ? a.lastElementChild : e.dom.getNextElementNode_(a.lastChild, !1)
    };
    e.dom.getNextElementSibling = function (a) {
        return void 0 !== a.nextElementSibling ? a.nextElementSibling : e.dom.getNextElementNode_(a.nextSibling, !0)
    };
    e.dom.getPreviousElementSibling = function (a) {
        return void 0 !== a.previousElementSibling ? a.previousElementSibling : e.dom.getNextElementNode_(a.previousSibling, !1)
    };
    e.dom.getNextElementNode_ = function (a, c) {
        for (; a && a.nodeType != e.dom.NodeType.ELEMENT;) a = c ? a.nextSibling : a.previousSibling;
        return a
    };
    e.dom.getNextNode = function (a) {
        if (!a) return null;
        if (a.firstChild) return a.firstChild;
        for (; a && !a.nextSibling;) a = a.parentNode;
        return a ? a.nextSibling : null
    };
    e.dom.getPreviousNode = function (a) {
        if (!a) return null;
        if (!a.previousSibling) return a.parentNode;
        for (a = a.previousSibling; a && a.lastChild;) a = a.lastChild;
        return a
    };
    e.dom.isNodeLike = function (a) {
        return e.isObject(a) && 0 < a.nodeType
    };
    e.dom.isElement = function (a) {
        return e.isObject(a) && a.nodeType == e.dom.NodeType.ELEMENT
    };
    e.dom.isWindow = function (a) {
        return e.isObject(a) && a.window == a
    };
    e.dom.getParentElement = function (a) {
        var c;
        if (e.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(e.userAgent.IE && e.userAgent.isVersionOrHigher("9") && !e.userAgent.isVersionOrHigher("10") && e.global.SVGElement && a instanceof e.global.SVGElement) && (c = a.parentElement)) return c;
        c = a.parentNode;
        return e.dom.isElement(c) ? c : null
    };
    e.dom.contains = function (a, c) {
        if (!a || !c) return !1;
        if (a.contains && c.nodeType == e.dom.NodeType.ELEMENT) return a == c || a.contains(c);
        if ("undefined" != typeof a.compareDocumentPosition) return a == c || !!(a.compareDocumentPosition(c) & 16);
        for (; c && a != c;) c = c.parentNode;
        return c == a
    };
    e.dom.compareNodeOrder = function (a, c) {
        if (a == c) return 0;
        if (a.compareDocumentPosition) return a.compareDocumentPosition(c) & 2 ? 1 : -1;
        if (e.userAgent.IE && !e.userAgent.isDocumentModeOrHigher(9)) {
            if (a.nodeType == e.dom.NodeType.DOCUMENT) return -1;
            if (c.nodeType == e.dom.NodeType.DOCUMENT) return 1
        }
        if ("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
            var d = a.nodeType == e.dom.NodeType.ELEMENT, f = c.nodeType == e.dom.NodeType.ELEMENT;
            if (d && f) return a.sourceIndex - c.sourceIndex;
            var g = a.parentNode, h = c.parentNode;
            return g == h ? e.dom.compareSiblingOrder_(a, c) : !d && e.dom.contains(g, c) ? -1 * e.dom.compareParentsDescendantNodeIe_(a, c) : !f && e.dom.contains(h, a) ? e.dom.compareParentsDescendantNodeIe_(c, a) : (d ? a.sourceIndex : g.sourceIndex) - (f ? c.sourceIndex : h.sourceIndex)
        }
        f = e.dom.getOwnerDocument(a);
        d = f.createRange();
        d.selectNode(a);
        d.collapse(!0);
        a = f.createRange();
        a.selectNode(c);
        a.collapse(!0);
        return d.compareBoundaryPoints(e.global.Range.START_TO_END, a)
    };
    e.dom.compareParentsDescendantNodeIe_ = function (a, c) {
        var d = a.parentNode;
        if (d == c) return -1;
        for (; c.parentNode != d;) c = c.parentNode;
        return e.dom.compareSiblingOrder_(c, a)
    };
    e.dom.compareSiblingOrder_ = function (a, c) {
        for (; c = c.previousSibling;) if (c == a) return -1;
        return 1
    };
    e.dom.findCommonAncestor = function (a) {
        var c, d = arguments.length;
        if (!d) return null;
        if (1 == d) return arguments[0];
        var f = [], g = Infinity;
        for (c = 0; c < d; c++) {
            for (var h = [], l = arguments[c]; l;) h.unshift(l), l = l.parentNode;
            f.push(h);
            g = Math.min(g, h.length)
        }
        h = null;
        for (c = 0; c < g; c++) {
            l = f[0][c];
            for (var m = 1; m < d; m++) if (l != f[m][c]) return h;
            h = l
        }
        return h
    };
    e.dom.isInDocument = function (a) {
        return 16 == (a.ownerDocument.compareDocumentPosition(a) & 16)
    };
    e.dom.getOwnerDocument = function (a) {
        e.asserts.assert(a, "Node cannot be null or undefined.");
        return a.nodeType == e.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
    };
    e.dom.getFrameContentDocument = function (a) {
        return a.contentDocument || a.contentWindow.document
    };
    e.dom.getFrameContentWindow = function (a) {
        try {
            return a.contentWindow || (a.contentDocument ? e.dom.getWindow(a.contentDocument) : null)
        } catch (c) {
        }
        return null
    };
    e.dom.setTextContent = function (a, c) {
        e.asserts.assert(null != a, "goog.dom.setTextContent expects a non-null value for node");
        if ("textContent" in a) a.textContent = c; else if (a.nodeType == e.dom.NodeType.TEXT) a.data = String(c); else if (a.firstChild && a.firstChild.nodeType == e.dom.NodeType.TEXT) {
            for (; a.lastChild != a.firstChild;) a.removeChild(e.asserts.assert(a.lastChild));
            a.firstChild.data = String(c)
        } else {
            e.dom.removeChildren(a);
            var d = e.dom.getOwnerDocument(a);
            a.appendChild(d.createTextNode(String(c)))
        }
    };
    e.dom.getOuterHtml = function (a) {
        e.asserts.assert(null !== a, "goog.dom.getOuterHtml expects a non-null value for element");
        if ("outerHTML" in a) return a.outerHTML;
        var c = e.dom.getOwnerDocument(a);
        c = e.dom.createElement_(c, "DIV");
        c.appendChild(a.cloneNode(!0));
        return c.innerHTML
    };
    e.dom.findNode = function (a, c) {
        var d = [];
        return e.dom.findNodes_(a, c, d, !0) ? d[0] : void 0
    };
    e.dom.findNodes = function (a, c) {
        var d = [];
        e.dom.findNodes_(a, c, d, !1);
        return d
    };
    e.dom.findNodes_ = function (a, c, d, f) {
        if (null != a) for (a = a.firstChild; a;) {
            if (c(a) && (d.push(a), f) || e.dom.findNodes_(a, c, d, f)) return !0;
            a = a.nextSibling
        }
        return !1
    };
    e.dom.findElement = function (a, c) {
        for (a = e.dom.getChildrenReverse_(a); 0 < a.length;) {
            var d = a.pop();
            if (c(d)) return d;
            for (d = d.lastElementChild; d; d = d.previousElementSibling) a.push(d)
        }
        return null
    };
    e.dom.findElements = function (a, c) {
        var d = [];
        for (a = e.dom.getChildrenReverse_(a); 0 < a.length;) {
            var f = a.pop();
            c(f) && d.push(f);
            for (f = f.lastElementChild; f; f = f.previousElementSibling) a.push(f)
        }
        return d
    };
    e.dom.getChildrenReverse_ = function (a) {
        if (a.nodeType == e.dom.NodeType.DOCUMENT) return [a.documentElement];
        var c = [];
        for (a = a.lastElementChild; a; a = a.previousElementSibling) c.push(a);
        return c
    };
    e.dom.TAGS_TO_IGNORE_ = {SCRIPT: 1, STYLE: 1, HEAD: 1, IFRAME: 1, OBJECT: 1};
    e.dom.PREDEFINED_TAG_VALUES_ = {IMG: " ", BR: "\n"};
    e.dom.isFocusableTabIndex = function (a) {
        return e.dom.hasSpecifiedTabIndex_(a) && e.dom.isTabIndexFocusable_(a)
    };
    e.dom.setFocusableTabIndex = function (a, c) {
        c ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
    };
    e.dom.isFocusable = function (a) {
        var c;
        return (c = e.dom.nativelySupportsFocus_(a) ? !a.disabled && (!e.dom.hasSpecifiedTabIndex_(a) || e.dom.isTabIndexFocusable_(a)) : e.dom.isFocusableTabIndex(a)) && e.userAgent.IE ? e.dom.hasNonZeroBoundingRect_(a) : c
    };
    e.dom.hasSpecifiedTabIndex_ = function (a) {
        return e.userAgent.IE && !e.userAgent.isVersionOrHigher("9") ? (a = a.getAttributeNode("tabindex"), null != a && a.specified) : a.hasAttribute("tabindex")
    };
    e.dom.isTabIndexFocusable_ = function (a) {
        a = a.tabIndex;
        return "number" === typeof a && 0 <= a && 32768 > a
    };
    e.dom.nativelySupportsFocus_ = function (a) {
        return "A" == a.tagName && a.hasAttribute("href") || "INPUT" == a.tagName || "TEXTAREA" == a.tagName || "SELECT" == a.tagName || "BUTTON" == a.tagName
    };
    e.dom.hasNonZeroBoundingRect_ = function (a) {
        a = !e.isFunction(a.getBoundingClientRect) || e.userAgent.IE && null == a.parentElement ? {
            height: a.offsetHeight,
            width: a.offsetWidth
        } : a.getBoundingClientRect();
        return null != a && 0 < a.height && 0 < a.width
    };
    e.dom.getTextContent = function (a) {
        if (e.dom.BrowserFeature.CAN_USE_INNER_TEXT && null !== a && "innerText" in a) a = e.string.canonicalizeNewlines(a.innerText); else {
            var c = [];
            e.dom.getTextContent_(a, c, !0);
            a = c.join("")
        }
        a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
        a = a.replace(/\u200B/g, "");
        e.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
        " " != a && (a = a.replace(/^\s*/, ""));
        return a
    };
    e.dom.getRawTextContent = function (a) {
        var c = [];
        e.dom.getTextContent_(a, c, !1);
        return c.join("")
    };
    e.dom.getTextContent_ = function (a, c, d) {
        if (!(a.nodeName in e.dom.TAGS_TO_IGNORE_)) if (a.nodeType == e.dom.NodeType.TEXT) d ? c.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : c.push(a.nodeValue); else if (a.nodeName in e.dom.PREDEFINED_TAG_VALUES_) c.push(e.dom.PREDEFINED_TAG_VALUES_[a.nodeName]); else for (a = a.firstChild; a;) e.dom.getTextContent_(a, c, d), a = a.nextSibling
    };
    e.dom.getNodeTextLength = function (a) {
        return e.dom.getTextContent(a).length
    };
    e.dom.getNodeTextOffset = function (a, c) {
        c = c || e.dom.getOwnerDocument(a).body;
        for (var d = []; a && a != c;) {
            for (var f = a; f = f.previousSibling;) d.unshift(e.dom.getTextContent(f));
            a = a.parentNode
        }
        return e.string.trimLeft(d.join("")).replace(/ +/g, " ").length
    };
    e.dom.getNodeAtOffset = function (a, c, d) {
        a = [a];
        for (var f = 0, g = null; 0 < a.length && f < c;) if (g = a.pop(), !(g.nodeName in e.dom.TAGS_TO_IGNORE_)) if (g.nodeType == e.dom.NodeType.TEXT) {
            var h = g.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
            f += h.length
        } else if (g.nodeName in e.dom.PREDEFINED_TAG_VALUES_) f += e.dom.PREDEFINED_TAG_VALUES_[g.nodeName].length; else for (h = g.childNodes.length - 1; 0 <= h; h--) a.push(g.childNodes[h]);
        e.isObject(d) && (d.remainder = g ? g.nodeValue.length + c - f - 1 : 0, d.node = g);
        return g
    };
    e.dom.isNodeList = function (a) {
        if (a && "number" == typeof a.length) {
            if (e.isObject(a)) return "function" == typeof a.item || "string" == typeof a.item;
            if (e.isFunction(a)) return "function" == typeof a.item
        }
        return !1
    };
    e.dom.getAncestorByTagNameAndClass = function (a, c, d, f) {
        if (!c && !d) return null;
        var g = c ? String(c).toUpperCase() : null;
        return e.dom.getAncestor(a, function (a) {
            return (!g || a.nodeName == g) && (!d || "string" === typeof a.className && e.array.contains(a.className.split(/\s+/), d))
        }, !0, f)
    };
    e.dom.getAncestorByClass = function (a, c, d) {
        return e.dom.getAncestorByTagNameAndClass(a, null, c, d)
    };
    e.dom.getAncestor = function (a, c, d, f) {
        a && !d && (a = a.parentNode);
        for (d = 0; a && (null == f || d <= f);) {
            e.asserts.assert("parentNode" != a.name);
            if (c(a)) return a;
            a = a.parentNode;
            d++
        }
        return null
    };
    e.dom.getActiveElement = function (a) {
        try {
            var c = a && a.activeElement;
            return c && c.nodeName ? c : null
        } catch (d) {
            return null
        }
    };
    e.dom.getPixelRatio = function () {
        var a = e.dom.getWindow();
        return void 0 !== a.devicePixelRatio ? a.devicePixelRatio : a.matchMedia ? e.dom.matchesPixelRatio_(3) || e.dom.matchesPixelRatio_(2) || e.dom.matchesPixelRatio_(1.5) || e.dom.matchesPixelRatio_(1) || .75 : 1
    };
    e.dom.matchesPixelRatio_ = function (a) {
        return e.dom.getWindow().matchMedia("(min-resolution: " + a + "dppx),(min--moz-device-pixel-ratio: " + a + "),(min-resolution: " + 96 * a + "dpi)").matches ? a : 0
    };
    e.dom.getCanvasContext2D = function (a) {
        return a.getContext("2d")
    };
    e.dom.DomHelper = function (a) {
        this.document_ = a || e.global.document || document
    };
    e.dom.DomHelper.prototype.getDomHelper = e.dom.getDomHelper;
    e.dom.DomHelper.prototype.setDocument = function (a) {
        this.document_ = a
    };
    e.dom.DomHelper.prototype.getDocument = function () {
        return this.document_
    };
    e.dom.DomHelper.prototype.getElement = function (a) {
        return e.dom.getElementHelper_(this.document_, a)
    };
    e.dom.DomHelper.prototype.getRequiredElement = function (a) {
        return e.dom.getRequiredElementHelper_(this.document_, a)
    };
    e.dom.DomHelper.prototype.$ = e.dom.DomHelper.prototype.getElement;
    e.dom.DomHelper.prototype.getElementsByTagName = function (a, c) {
        return (c || this.document_).getElementsByTagName(String(a))
    };
    e.dom.DomHelper.prototype.getElementsByTagNameAndClass = function (a, c, d) {
        return e.dom.getElementsByTagNameAndClass_(this.document_, a, c, d)
    };
    e.dom.DomHelper.prototype.getElementByTagNameAndClass = function (a, c, d) {
        return e.dom.getElementByTagNameAndClass_(this.document_, a, c, d)
    };
    e.dom.DomHelper.prototype.getElementsByClass = function (a, c) {
        return e.dom.getElementsByClass(a, c || this.document_)
    };
    e.dom.DomHelper.prototype.getElementByClass = function (a, c) {
        return e.dom.getElementByClass(a, c || this.document_)
    };
    e.dom.DomHelper.prototype.getRequiredElementByClass = function (a, c) {
        return e.dom.getRequiredElementByClass(a, c || this.document_)
    };
    e.dom.DomHelper.prototype.$$ = e.dom.DomHelper.prototype.getElementsByTagNameAndClass;
    e.dom.DomHelper.prototype.setProperties = e.dom.setProperties;
    e.dom.DomHelper.prototype.getViewportSize = function (a) {
        return e.dom.getViewportSize(a || this.getWindow())
    };
    e.dom.DomHelper.prototype.getDocumentHeight = function () {
        return e.dom.getDocumentHeight_(this.getWindow())
    };
    e.dom.DomHelper.prototype.createDom = function (a, c, d) {
        return e.dom.createDom_(this.document_, arguments)
    };
    e.dom.DomHelper.prototype.$dom = e.dom.DomHelper.prototype.createDom;
    e.dom.DomHelper.prototype.createElement = function (a) {
        return e.dom.createElement_(this.document_, a)
    };
    e.dom.DomHelper.prototype.createTextNode = function (a) {
        return this.document_.createTextNode(String(a))
    };
    e.dom.DomHelper.prototype.createTable = function (a, c, d) {
        return e.dom.createTable_(this.document_, a, c, !!d)
    };
    e.dom.DomHelper.prototype.safeHtmlToNode = function (a) {
        return e.dom.safeHtmlToNode_(this.document_, a)
    };
    e.dom.DomHelper.prototype.isCss1CompatMode = function () {
        return e.dom.isCss1CompatMode_(this.document_)
    };
    e.dom.DomHelper.prototype.getWindow = function () {
        return e.dom.getWindow_(this.document_)
    };
    e.dom.DomHelper.prototype.getDocumentScrollElement = function () {
        return e.dom.getDocumentScrollElement_(this.document_)
    };
    e.dom.DomHelper.prototype.getDocumentScroll = function () {
        return e.dom.getDocumentScroll_(this.document_)
    };
    e.dom.DomHelper.prototype.getActiveElement = function (a) {
        return e.dom.getActiveElement(a || this.document_)
    };
    e.dom.DomHelper.prototype.appendChild = e.dom.appendChild;
    e.dom.DomHelper.prototype.append = e.dom.append;
    e.dom.DomHelper.prototype.canHaveChildren = e.dom.canHaveChildren;
    e.dom.DomHelper.prototype.removeChildren = e.dom.removeChildren;
    e.dom.DomHelper.prototype.insertSiblingBefore = e.dom.insertSiblingBefore;
    e.dom.DomHelper.prototype.insertSiblingAfter = e.dom.insertSiblingAfter;
    e.dom.DomHelper.prototype.insertChildAt = e.dom.insertChildAt;
    e.dom.DomHelper.prototype.removeNode = e.dom.removeNode;
    e.dom.DomHelper.prototype.replaceNode = e.dom.replaceNode;
    e.dom.DomHelper.prototype.flattenElement = e.dom.flattenElement;
    e.dom.DomHelper.prototype.getChildren = e.dom.getChildren;
    e.dom.DomHelper.prototype.getFirstElementChild = e.dom.getFirstElementChild;
    e.dom.DomHelper.prototype.getLastElementChild = e.dom.getLastElementChild;
    e.dom.DomHelper.prototype.getNextElementSibling = e.dom.getNextElementSibling;
    e.dom.DomHelper.prototype.getPreviousElementSibling = e.dom.getPreviousElementSibling;
    e.dom.DomHelper.prototype.getNextNode = e.dom.getNextNode;
    e.dom.DomHelper.prototype.getPreviousNode = e.dom.getPreviousNode;
    e.dom.DomHelper.prototype.isNodeLike = e.dom.isNodeLike;
    e.dom.DomHelper.prototype.isElement = e.dom.isElement;
    e.dom.DomHelper.prototype.isWindow = e.dom.isWindow;
    e.dom.DomHelper.prototype.getParentElement = e.dom.getParentElement;
    e.dom.DomHelper.prototype.contains = e.dom.contains;
    e.dom.DomHelper.prototype.compareNodeOrder = e.dom.compareNodeOrder;
    e.dom.DomHelper.prototype.findCommonAncestor = e.dom.findCommonAncestor;
    e.dom.DomHelper.prototype.getOwnerDocument = e.dom.getOwnerDocument;
    e.dom.DomHelper.prototype.getFrameContentDocument = e.dom.getFrameContentDocument;
    e.dom.DomHelper.prototype.getFrameContentWindow = e.dom.getFrameContentWindow;
    e.dom.DomHelper.prototype.setTextContent = e.dom.setTextContent;
    e.dom.DomHelper.prototype.getOuterHtml = e.dom.getOuterHtml;
    e.dom.DomHelper.prototype.findNode = e.dom.findNode;
    e.dom.DomHelper.prototype.findNodes = e.dom.findNodes;
    e.dom.DomHelper.prototype.isFocusableTabIndex = e.dom.isFocusableTabIndex;
    e.dom.DomHelper.prototype.setFocusableTabIndex = e.dom.setFocusableTabIndex;
    e.dom.DomHelper.prototype.isFocusable = e.dom.isFocusable;
    e.dom.DomHelper.prototype.getTextContent = e.dom.getTextContent;
    e.dom.DomHelper.prototype.getNodeTextLength = e.dom.getNodeTextLength;
    e.dom.DomHelper.prototype.getNodeTextOffset = e.dom.getNodeTextOffset;
    e.dom.DomHelper.prototype.getNodeAtOffset = e.dom.getNodeAtOffset;
    e.dom.DomHelper.prototype.isNodeList = e.dom.isNodeList;
    e.dom.DomHelper.prototype.getAncestorByTagNameAndClass = e.dom.getAncestorByTagNameAndClass;
    e.dom.DomHelper.prototype.getAncestorByClass = e.dom.getAncestorByClass;
    e.dom.DomHelper.prototype.getAncestor = e.dom.getAncestor;
    e.dom.DomHelper.prototype.getCanvasContext2D = e.dom.getCanvasContext2D;
    e.async.throwException = function (a) {
        e.global.setTimeout(function () {
            throw a;
        }, 0)
    };
    e.async.nextTick = function (a, c, d) {
        var f = a;
        c && (f = e.bind(a, c));
        f = e.async.nextTick.wrapCallback_(f);
        e.isFunction(e.global.setImmediate) && (d || e.async.nextTick.useSetImmediate_()) ? e.global.setImmediate(f) : (e.async.nextTick.setImmediate_ || (e.async.nextTick.setImmediate_ = e.async.nextTick.getSetImmediateEmulator_()), e.async.nextTick.setImmediate_(f))
    };
    e.async.nextTick.useSetImmediate_ = function () {
        return e.global.Window && e.global.Window.prototype && !e.labs.userAgent.browser.isEdge() && e.global.Window.prototype.setImmediate == e.global.setImmediate ? !1 : !0
    };
    e.async.nextTick.getSetImmediateEmulator_ = function () {
        var a = e.global.MessageChannel;
        "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !e.labs.userAgent.engine.isPresto() && (a = function () {
            var a = e.dom.createElement("IFRAME");
            a.style.display = "none";
            e.dom.safe.setIframeSrc(a, e.html.TrustedResourceUrl.fromConstant(e.string.Const.EMPTY));
            document.documentElement.appendChild(a);
            var c = a.contentWindow;
            a = c.document;
            a.open();
            e.dom.safe.documentWrite(a, e.html.SafeHtml.EMPTY);
            a.close();
            var d = "callImmediate" + Math.random(),
                f = "file:" == c.location.protocol ? "*" : c.location.protocol + "//" + c.location.host;
            a = e.bind(function (a) {
                if (("*" == f || a.origin == f) && a.data == d) this.port1.onmessage()
            }, this);
            c.addEventListener("message", a, !1);
            this.port1 = {};
            this.port2 = {
                postMessage: function () {
                    c.postMessage(d, f)
                }
            }
        });
        if ("undefined" !== typeof a && !e.labs.userAgent.browser.isIE()) {
            var c = new a, d = {}, f = d;
            c.port1.onmessage = function () {
                if (void 0 !== d.next) {
                    d = d.next;
                    var a = d.cb;
                    d.cb = null;
                    a()
                }
            };
            return function (a) {
                f.next =
                    {cb: a};
                f = f.next;
                c.port2.postMessage(0)
            }
        }
        return "undefined" !== typeof document && "onreadystatechange" in e.dom.createElement("SCRIPT") ? function (a) {
            var c = e.dom.createElement("SCRIPT");
            c.onreadystatechange = function () {
                c.onreadystatechange = null;
                c.parentNode.removeChild(c);
                c = null;
                a();
                a = null
            };
            document.documentElement.appendChild(c)
        } : function (a) {
            e.global.setTimeout(a, 0)
        }
    };
    e.async.nextTick.wrapCallback_ = e.functions.identity;
    e.debug.entryPointRegistry.register(function (a) {
        e.async.nextTick.wrapCallback_ = a
    });
    e.ASSUME_NATIVE_PROMISE = !1;
    e.async.run = function (a, c) {
        e.async.run.schedule_ || e.async.run.initializeRunner_();
        e.async.run.workQueueScheduled_ || (e.async.run.schedule_(), e.async.run.workQueueScheduled_ = !0);
        e.async.run.workQueue_.add(a, c)
    };
    e.async.run.initializeRunner_ = function () {
        if (e.ASSUME_NATIVE_PROMISE || e.global.Promise && e.global.Promise.resolve) {
            var a = e.global.Promise.resolve(void 0);
            e.async.run.schedule_ = function () {
                a.then(e.async.run.processWorkQueue)
            }
        } else e.async.run.schedule_ = function () {
            e.async.nextTick(e.async.run.processWorkQueue)
        }
    };
    e.async.run.forceNextTick = function (a) {
        e.async.run.schedule_ = function () {
            e.async.nextTick(e.async.run.processWorkQueue);
            a && a(e.async.run.processWorkQueue)
        }
    };
    e.async.run.workQueueScheduled_ = !1;
    e.async.run.workQueue_ = new e.async.WorkQueue;
    e.DEBUG && (e.async.run.resetQueue = function () {
        e.async.run.workQueueScheduled_ = !1;
        e.async.run.workQueue_ = new e.async.WorkQueue
    });
    e.async.run.processWorkQueue = function () {
        for (var a; a = e.async.run.workQueue_.remove();) {
            try {
                a.fn.call(a.scope)
            } catch (c) {
                e.async.throwException(c)
            }
            e.async.run.workQueue_.returnUnused(a)
        }
        e.async.run.workQueueScheduled_ = !1
    };
    e.promise = {};
    e.promise.Resolver = function () {
    };
    e.Promise = function (a, c) {
        this.state_ = e.Promise.State_.PENDING;
        this.result_ = void 0;
        this.callbackEntriesTail_ = this.callbackEntries_ = this.parent_ = null;
        this.executing_ = !1;
        0 < e.Promise.UNHANDLED_REJECTION_DELAY ? this.unhandledRejectionId_ = 0 : 0 == e.Promise.UNHANDLED_REJECTION_DELAY && (this.hadUnhandledRejection_ = !1);
        e.Promise.LONG_STACK_TRACES && (this.stack_ = [], this.addStackTrace_(Error("created")), this.currentStep_ = 0);
        if (a != e.nullFunction) try {
            var d = this;
            a.call(c, function (a) {
                d.resolve_(e.Promise.State_.FULFILLED,
                    a)
            }, function (a) {
                if (e.DEBUG && !(a instanceof e.Promise.CancellationError)) try {
                    if (a instanceof Error) throw a;
                    throw Error("Promise rejected.");
                } catch (g) {
                }
                d.resolve_(e.Promise.State_.REJECTED, a)
            })
        } catch (f) {
            this.resolve_(e.Promise.State_.REJECTED, f)
        }
    };
    e.Promise.LONG_STACK_TRACES = !1;
    e.Promise.UNHANDLED_REJECTION_DELAY = 0;
    e.Promise.State_ = {PENDING: 0, BLOCKED: 1, FULFILLED: 2, REJECTED: 3};
    e.Promise.CallbackEntry_ = function () {
        this.next = this.context = this.onRejected = this.onFulfilled = this.child = null;
        this.always = !1
    };
    e.Promise.CallbackEntry_.prototype.reset = function () {
        this.context = this.onRejected = this.onFulfilled = this.child = null;
        this.always = !1
    };
    e.Promise.DEFAULT_MAX_UNUSED = 100;
    e.Promise.freelist_ = new e.async.FreeList(function () {
        return new e.Promise.CallbackEntry_
    }, function (a) {
        a.reset()
    }, e.Promise.DEFAULT_MAX_UNUSED);
    e.Promise.getCallbackEntry_ = function (a, c, d) {
        var f = e.Promise.freelist_.get();
        f.onFulfilled = a;
        f.onRejected = c;
        f.context = d;
        return f
    };
    e.Promise.returnEntry_ = function (a) {
        e.Promise.freelist_.put(a)
    };
    e.Promise.resolve = function (a) {
        if (a instanceof e.Promise) return a;
        var c = new e.Promise(e.nullFunction);
        c.resolve_(e.Promise.State_.FULFILLED, a);
        return c
    };
    e.Promise.reject = function (a) {
        return new e.Promise(function (c, d) {
            d(a)
        })
    };
    e.Promise.resolveThen_ = function (a, c, d) {
        e.Promise.maybeThen_(a, c, d, null) || e.async.run(e.partial(c, a))
    };
    e.Promise.race = function (a) {
        return new e.Promise(function (c, d) {
            a.length || c(void 0);
            for (var f = 0, g; f < a.length; f++) g = a[f], e.Promise.resolveThen_(g, c, d)
        })
    };
    e.Promise.all = function (a) {
        return new e.Promise(function (c, d) {
            var f = a.length, g = [];
            if (f) for (var h = function (a, d) {
                f--;
                g[a] = d;
                0 == f && c(g)
            }, l = function (a) {
                d(a)
            }, m = 0, n; m < a.length; m++) n = a[m], e.Promise.resolveThen_(n, e.partial(h, m), l); else c(g)
        })
    };
    e.Promise.allSettled = function (a) {
        return new e.Promise(function (c) {
            var d = a.length, f = [];
            if (d) for (var g = function (a, g, h) {
                d--;
                f[a] = g ? {fulfilled: !0, value: h} : {fulfilled: !1, reason: h};
                0 == d && c(f)
            }, h = 0, l; h < a.length; h++) l = a[h], e.Promise.resolveThen_(l, e.partial(g, h, !0), e.partial(g, h, !1)); else c(f)
        })
    };
    e.Promise.firstFulfilled = function (a) {
        return new e.Promise(function (c, d) {
            var f = a.length, g = [];
            if (f) for (var h = function (a) {
                c(a)
            }, l = function (a, c) {
                f--;
                g[a] = c;
                0 == f && d(g)
            }, m = 0, n; m < a.length; m++) n = a[m], e.Promise.resolveThen_(n, h, e.partial(l, m)); else c(void 0)
        })
    };
    e.Promise.withResolver = function () {
        var a, c, d = new e.Promise(function (d, g) {
            a = d;
            c = g
        });
        return new e.Promise.Resolver_(d, a, c)
    };
    e.Promise.prototype.then = function (a, c, d) {
        null != a && e.asserts.assertFunction(a, "opt_onFulfilled should be a function.");
        null != c && e.asserts.assertFunction(c, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
        e.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
        return this.addChildPromise_(e.isFunction(a) ? a : null, e.isFunction(c) ? c : null, d)
    };
    e.Thenable.addImplementation(e.Promise);
    e.Promise.prototype.thenVoid = function (a, c, d) {
        null != a && e.asserts.assertFunction(a, "opt_onFulfilled should be a function.");
        null != c && e.asserts.assertFunction(c, "opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");
        e.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("then"));
        this.addCallbackEntry_(e.Promise.getCallbackEntry_(a || e.nullFunction, c || null, d))
    };
    e.Promise.prototype.thenAlways = function (a, c) {
        e.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("thenAlways"));
        a = e.Promise.getCallbackEntry_(a, a, c);
        a.always = !0;
        this.addCallbackEntry_(a);
        return this
    };
    e.Promise.prototype.thenCatch = function (a, c) {
        e.Promise.LONG_STACK_TRACES && this.addStackTrace_(Error("thenCatch"));
        return this.addChildPromise_(null, a, c)
    };
    e.Promise.prototype.cancel = function (a) {
        if (this.state_ == e.Promise.State_.PENDING) {
            var c = new e.Promise.CancellationError(a);
            e.async.run(function () {
                this.cancelInternal_(c)
            }, this)
        }
    };
    e.Promise.prototype.cancelInternal_ = function (a) {
        this.state_ == e.Promise.State_.PENDING && (this.parent_ ? (this.parent_.cancelChild_(this, a), this.parent_ = null) : this.resolve_(e.Promise.State_.REJECTED, a))
    };
    e.Promise.prototype.cancelChild_ = function (a, c) {
        if (this.callbackEntries_) {
            for (var d = 0, f = null, g = null, h = this.callbackEntries_; h && (h.always || (d++, h.child == a && (f = h), !(f && 1 < d))); h = h.next) f || (g = h);
            f && (this.state_ == e.Promise.State_.PENDING && 1 == d ? this.cancelInternal_(c) : (g ? this.removeEntryAfter_(g) : this.popEntry_(), this.executeCallback_(f, e.Promise.State_.REJECTED, c)))
        }
    };
    e.Promise.prototype.addCallbackEntry_ = function (a) {
        this.hasEntry_() || this.state_ != e.Promise.State_.FULFILLED && this.state_ != e.Promise.State_.REJECTED || this.scheduleCallbacks_();
        this.queueEntry_(a)
    };
    e.Promise.prototype.addChildPromise_ = function (a, c, d) {
        var f = e.Promise.getCallbackEntry_(null, null, null);
        f.child = new e.Promise(function (g, h) {
            f.onFulfilled = a ? function (c) {
                try {
                    var f = a.call(d, c);
                    g(f)
                } catch (n) {
                    h(n)
                }
            } : g;
            f.onRejected = c ? function (a) {
                try {
                    var f = c.call(d, a);
                    void 0 === f && a instanceof e.Promise.CancellationError ? h(a) : g(f)
                } catch (n) {
                    h(n)
                }
            } : h
        });
        f.child.parent_ = this;
        this.addCallbackEntry_(f);
        return f.child
    };
    e.Promise.prototype.unblockAndFulfill_ = function (a) {
        e.asserts.assert(this.state_ == e.Promise.State_.BLOCKED);
        this.state_ = e.Promise.State_.PENDING;
        this.resolve_(e.Promise.State_.FULFILLED, a)
    };
    e.Promise.prototype.unblockAndReject_ = function (a) {
        e.asserts.assert(this.state_ == e.Promise.State_.BLOCKED);
        this.state_ = e.Promise.State_.PENDING;
        this.resolve_(e.Promise.State_.REJECTED, a)
    };
    e.Promise.prototype.resolve_ = function (a, c) {
        this.state_ == e.Promise.State_.PENDING && (this === c && (a = e.Promise.State_.REJECTED, c = new TypeError("Promise cannot resolve to itself")), this.state_ = e.Promise.State_.BLOCKED, e.Promise.maybeThen_(c, this.unblockAndFulfill_, this.unblockAndReject_, this) || (this.result_ = c, this.state_ = a, this.parent_ = null, this.scheduleCallbacks_(), a != e.Promise.State_.REJECTED || c instanceof e.Promise.CancellationError || e.Promise.addUnhandledRejection_(this, c)))
    };
    e.Promise.maybeThen_ = function (a, c, d, f) {
        if (a instanceof e.Promise) return a.thenVoid(c, d, f), !0;
        if (e.Thenable.isImplementedBy(a)) return a.then(c, d, f), !0;
        if (e.isObject(a)) try {
            var g = a.then;
            if (e.isFunction(g)) return e.Promise.tryThen_(a, g, c, d, f), !0
        } catch (h) {
            return d.call(f, h), !0
        }
        return !1
    };
    e.Promise.tryThen_ = function (a, c, d, f, g) {
        function h(a) {
            m || (m = !0, f.call(g, a))
        }

        function l(a) {
            m || (m = !0, d.call(g, a))
        }

        var m = !1;
        try {
            c.call(a, l, h)
        } catch (n) {
            h(n)
        }
    };
    e.Promise.prototype.scheduleCallbacks_ = function () {
        this.executing_ || (this.executing_ = !0, e.async.run(this.executeCallbacks_, this))
    };
    e.Promise.prototype.hasEntry_ = function () {
        return !!this.callbackEntries_
    };
    e.Promise.prototype.queueEntry_ = function (a) {
        e.asserts.assert(null != a.onFulfilled);
        this.callbackEntriesTail_ ? this.callbackEntriesTail_.next = a : this.callbackEntries_ = a;
        this.callbackEntriesTail_ = a
    };
    e.Promise.prototype.popEntry_ = function () {
        var a = null;
        this.callbackEntries_ && (a = this.callbackEntries_, this.callbackEntries_ = a.next, a.next = null);
        this.callbackEntries_ || (this.callbackEntriesTail_ = null);
        null != a && e.asserts.assert(null != a.onFulfilled);
        return a
    };
    e.Promise.prototype.removeEntryAfter_ = function (a) {
        e.asserts.assert(this.callbackEntries_);
        e.asserts.assert(null != a);
        a.next == this.callbackEntriesTail_ && (this.callbackEntriesTail_ = a);
        a.next = a.next.next
    };
    e.Promise.prototype.executeCallbacks_ = function () {
        for (var a; a = this.popEntry_();) e.Promise.LONG_STACK_TRACES && this.currentStep_++, this.executeCallback_(a, this.state_, this.result_);
        this.executing_ = !1
    };
    e.Promise.prototype.executeCallback_ = function (a, c, d) {
        c == e.Promise.State_.REJECTED && a.onRejected && !a.always && this.removeUnhandledRejection_();
        if (a.child) a.child.parent_ = null, e.Promise.invokeCallback_(a, c, d); else try {
            a.always ? a.onFulfilled.call(a.context) : e.Promise.invokeCallback_(a, c, d)
        } catch (f) {
            e.Promise.handleRejection_.call(null, f)
        }
        e.Promise.returnEntry_(a)
    };
    e.Promise.invokeCallback_ = function (a, c, d) {
        c == e.Promise.State_.FULFILLED ? a.onFulfilled.call(a.context, d) : a.onRejected && a.onRejected.call(a.context, d)
    };
    e.Promise.prototype.addStackTrace_ = function (a) {
        if (e.Promise.LONG_STACK_TRACES && "string" === typeof a.stack) {
            var c = a.stack.split("\n", 4)[3];
            a = a.message;
            a += Array(11 - a.length).join(" ");
            this.stack_.push(a + c)
        }
    };
    e.Promise.prototype.appendLongStack_ = function (a) {
        if (e.Promise.LONG_STACK_TRACES && a && "string" === typeof a.stack && this.stack_.length) {
            for (var c = ["Promise trace:"], d = this; d; d = d.parent_) {
                for (var f = this.currentStep_; 0 <= f; f--) c.push(d.stack_[f]);
                c.push("Value: [" + (d.state_ == e.Promise.State_.REJECTED ? "REJECTED" : "FULFILLED") + "] <" + String(d.result_) + ">")
            }
            a.stack += "\n\n" + c.join("\n")
        }
    };
    e.Promise.prototype.removeUnhandledRejection_ = function () {
        if (0 < e.Promise.UNHANDLED_REJECTION_DELAY) for (var a = this; a && a.unhandledRejectionId_; a = a.parent_) e.global.clearTimeout(a.unhandledRejectionId_), a.unhandledRejectionId_ = 0; else if (0 == e.Promise.UNHANDLED_REJECTION_DELAY) for (a = this; a && a.hadUnhandledRejection_; a = a.parent_) a.hadUnhandledRejection_ = !1
    };
    e.Promise.addUnhandledRejection_ = function (a, c) {
        0 < e.Promise.UNHANDLED_REJECTION_DELAY ? a.unhandledRejectionId_ = e.global.setTimeout(function () {
            a.appendLongStack_(c);
            e.Promise.handleRejection_.call(null, c)
        }, e.Promise.UNHANDLED_REJECTION_DELAY) : 0 == e.Promise.UNHANDLED_REJECTION_DELAY && (a.hadUnhandledRejection_ = !0, e.async.run(function () {
            a.hadUnhandledRejection_ && (a.appendLongStack_(c), e.Promise.handleRejection_.call(null, c))
        }))
    };
    e.Promise.handleRejection_ = e.async.throwException;
    e.Promise.setUnhandledRejectionHandler = function (a) {
        e.Promise.handleRejection_ = a
    };
    e.Promise.CancellationError = function (a) {
        e.debug.Error.call(this, a)
    };
    e.inherits(e.Promise.CancellationError, e.debug.Error);
    e.Promise.CancellationError.prototype.name = "cancel";
    e.Promise.Resolver_ = function (a, c, d) {
        this.promise = a;
        this.resolve = c;
        this.reject = d
    };
    e.messaging = {};
    e.messaging.MessageChannel = function () {
    };
    e.messaging.MessageChannel.prototype.connect = function () {
    };
    e.messaging.MessageChannel.prototype.isConnected = function () {
    };
    e.messaging.MessageChannel.prototype.registerService = function () {
    };
    e.messaging.MessageChannel.prototype.registerDefaultService = function () {
    };
    e.messaging.MessageChannel.prototype.send = function () {
    };
    e.messaging.AbstractChannel = function () {
        e.Disposable.call(this);
        this.services_ = {}
    };
    e.inherits(e.messaging.AbstractChannel, e.Disposable);
    e.messaging.AbstractChannel.prototype.logger = e.log.getLogger("goog.messaging.AbstractChannel");
    e.messaging.AbstractChannel.prototype.connect = function (a) {
        a && a()
    };
    e.messaging.AbstractChannel.prototype.isConnected = function () {
        return !0
    };
    e.messaging.AbstractChannel.prototype.registerService = function (a, c, d) {
        this.services_[a] = {callback: c, objectPayload: !!d}
    };
    e.messaging.AbstractChannel.prototype.registerDefaultService = function (a) {
        this.defaultService_ = a
    };
    e.messaging.AbstractChannel.prototype.send = e.abstractMethod;
    e.messaging.AbstractChannel.prototype.deliver = function (a, c) {
        var d = this.getService(a, c);
        d && (a = this.decodePayload(a, c, d.objectPayload), null != a && d.callback(a))
    };
    e.messaging.AbstractChannel.prototype.getService = function (a, c) {
        var d = this.services_[a];
        if (d) return d;
        if (this.defaultService_) return a = e.partial(this.defaultService_, a), c = e.isObject(c), {
            callback: a,
            objectPayload: c
        };
        e.log.warning(this.logger, 'Unknown service name "' + a + '"');
        return null
    };
    e.messaging.AbstractChannel.prototype.decodePayload = function (a, c, d) {
        if (d && "string" === typeof c) try {
            return JSON.parse(c)
        } catch (f) {
            return e.log.warning(this.logger, "Expected JSON payload for " + a + ', was "' + c + '"'), null
        } else if (!d && "string" !== typeof c) return e.json.serialize(c);
        return c
    };
    e.messaging.AbstractChannel.prototype.disposeInternal = function () {
        e.messaging.AbstractChannel.superClass_.disposeInternal.call(this);
        delete this.services_;
        delete this.defaultService_
    };
    k.Requester = function (a, c) {
        e.Disposable.call(this);
        this.logger = k.Logging.getScopedLogger('Requester<"' + a + '">');
        this.name_ = a;
        this.messageChannel_ = c;
        this.requestIdGenerator_ = e.iter.count();
        this.requestIdToPromiseResolverMap_ = new Map;
        this.registerResponseMessagesService_();
        this.addChannelDisposedListener_()
    };
    e.inherits(k.Requester, e.Disposable);
    k.Requester.prototype.postRequest = function (a) {
        var c = this.requestIdGenerator_.next();
        this.logger.fine("Starting a request with identifier " + c + ", the payload is: " + k.DebugDump.debugDump(a));
        var d = e.Promise.withResolver();
        if (this.isDisposed()) return this.rejectRequest_(c, "The requester is already disposed"), d.promise;
        k.Logging.checkWithLogger(this.logger, !this.requestIdToPromiseResolverMap_.has(c));
        this.requestIdToPromiseResolverMap_.set(c, d);
        a = (new k.RequesterMessage.RequestMessageData(c, a)).makeMessageData();
        c = k.RequesterMessage.getRequestMessageType(this.name_);
        this.messageChannel_.send(c, a);
        return d.promise
    };
    k.Requester.prototype.disposeInternal = function () {
        var a = Array.from(this.requestIdToPromiseResolverMap_.keys());
        e.array.sort(a);
        e.array.forEach(a, function (a) {
            this.rejectRequest_(e.string.parseInt(a), "The requester is disposed")
        }, this);
        this.messageChannel_ = this.requestIdToPromiseResolverMap_ = null;
        this.logger.fine("Disposed");
        k.Requester.superClass_.disposeInternal.call(this)
    };
    k.Requester.prototype.registerResponseMessagesService_ = function () {
        var a = k.RequesterMessage.getResponseMessageType(this.name_);
        this.messageChannel_.registerService(a, this.responseMessageReceivedListener_.bind(this), !0)
    };
    k.Requester.prototype.addChannelDisposedListener_ = function () {
        this.messageChannel_.addOnDisposeCallback(this.channelDisposedListener_.bind(this))
    };
    k.Requester.prototype.channelDisposedListener_ = function () {
        this.isDisposed() || (this.logger.info("Message channel was disposed, disposing..."), this.dispose())
    };
    k.Requester.prototype.responseMessageReceivedListener_ = function (a) {
        k.Logging.checkWithLogger(this.logger, e.isObject(a));
        e.asserts.assertObject(a);
        if (!this.isDisposed()) {
            var c = k.RequesterMessage.ResponseMessageData.parseMessageData(a);
            null === c && k.Logging.failWithLogger(this.logger, "Failed to parse the received response message: " + k.DebugDump.debugDump(a));
            a = c.requestId;
            this.requestIdToPromiseResolverMap_.has(a) || k.Logging.failWithLogger(this.logger, "Received a response for unknown request with identifier " +
                a);
            c.isSuccessful() ? this.resolveRequest_(a, c.getPayload()) : this.rejectRequest_(a, c.getErrorMessage())
        }
    };
    k.Requester.prototype.resolveRequest_ = function (a, c) {
        this.logger.fine("The request with identifier " + a + " succeeded with the following result: " + k.DebugDump.debugDump(c));
        this.popRequestPromiseResolver_(a).resolve(c)
    };
    k.Requester.prototype.rejectRequest_ = function (a, c) {
        this.logger.fine("The request with identifier " + a + " failed: " + c);
        this.popRequestPromiseResolver_(a).reject(Error(c))
    };
    k.Requester.prototype.popRequestPromiseResolver_ = function (a) {
        var c = this.requestIdToPromiseResolverMap_.get(a);
        k.Logging.checkWithLogger(this.logger, void 0 !== c);
        this.requestIdToPromiseResolverMap_.delete(a);
        return c
    };
    k.PcscLiteClient = {};
    k.PcscLiteClient.API = function (a) {
        e.Disposable.call(this);
        this.logger = k.Logging.getScopedLogger("PcscLiteClient.API");
        this.messageChannel_ = a;
        this.messageChannel_.addOnDisposeCallback(this.messageChannelDisposedListener_.bind(this));
        this.requester_ = new k.Requester(k.PcscLiteCommon.Constants.REQUESTER_TITLE, this.messageChannel_);
        this.logger.fine("Initialized")
    };
    e.inherits(k.PcscLiteClient.API, e.Disposable);
    e.exportSymbol("GoogleSmartCard.PcscLiteClient.API", k.PcscLiteClient.API);
    k.PcscLiteClient.API.MAX_ATR_SIZE = 33;
    e.exportProperty(k.PcscLiteClient.API, "MAX_ATR_SIZE", k.PcscLiteClient.API.MAX_ATR_SIZE);
    k.PcscLiteClient.API.SCARD_S_SUCCESS = (0, k.FixedSizeInteger.castToInt32)(0);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_S_SUCCESS", k.PcscLiteClient.API.SCARD_S_SUCCESS);
    k.PcscLiteClient.API.SCARD_F_INTERNAL_ERROR = (0, k.FixedSizeInteger.castToInt32)(2148532225);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_F_INTERNAL_ERROR", k.PcscLiteClient.API.SCARD_F_INTERNAL_ERROR);
    k.PcscLiteClient.API.SCARD_E_CANCELLED = (0, k.FixedSizeInteger.castToInt32)(2148532226);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_CANCELLED", k.PcscLiteClient.API.SCARD_E_CANCELLED);
    k.PcscLiteClient.API.SCARD_E_INVALID_HANDLE = (0, k.FixedSizeInteger.castToInt32)(2148532227);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_HANDLE", k.PcscLiteClient.API.SCARD_E_INVALID_HANDLE);
    k.PcscLiteClient.API.SCARD_E_INVALID_PARAMETER = (0, k.FixedSizeInteger.castToInt32)(2148532228);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_PARAMETER", k.PcscLiteClient.API.SCARD_E_INVALID_PARAMETER);
    k.PcscLiteClient.API.SCARD_E_INVALID_TARGET = (0, k.FixedSizeInteger.castToInt32)(2148532229);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_TARGET", k.PcscLiteClient.API.SCARD_E_INVALID_TARGET);
    k.PcscLiteClient.API.SCARD_E_NO_MEMORY = (0, k.FixedSizeInteger.castToInt32)(2148532230);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_MEMORY", k.PcscLiteClient.API.SCARD_E_NO_MEMORY);
    k.PcscLiteClient.API.SCARD_F_WAITED_TOO_LONG = (0, k.FixedSizeInteger.castToInt32)(2148532231);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_F_WAITED_TOO_LONG", k.PcscLiteClient.API.SCARD_F_WAITED_TOO_LONG);
    k.PcscLiteClient.API.SCARD_E_INSUFFICIENT_BUFFER = (0, k.FixedSizeInteger.castToInt32)(2148532232);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INSUFFICIENT_BUFFER", k.PcscLiteClient.API.SCARD_E_INSUFFICIENT_BUFFER);
    k.PcscLiteClient.API.SCARD_E_UNKNOWN_READER = (0, k.FixedSizeInteger.castToInt32)(2148532233);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNKNOWN_READER", k.PcscLiteClient.API.SCARD_E_UNKNOWN_READER);
    k.PcscLiteClient.API.SCARD_E_TIMEOUT = (0, k.FixedSizeInteger.castToInt32)(2148532234);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_TIMEOUT", k.PcscLiteClient.API.SCARD_E_TIMEOUT);
    k.PcscLiteClient.API.SCARD_E_SHARING_VIOLATION = (0, k.FixedSizeInteger.castToInt32)(2148532235);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_SHARING_VIOLATION", k.PcscLiteClient.API.SCARD_E_SHARING_VIOLATION);
    k.PcscLiteClient.API.SCARD_E_NO_SMARTCARD = (0, k.FixedSizeInteger.castToInt32)(2148532236);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_SMARTCARD", k.PcscLiteClient.API.SCARD_E_NO_SMARTCARD);
    k.PcscLiteClient.API.SCARD_E_UNKNOWN_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532237);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNKNOWN_CARD", k.PcscLiteClient.API.SCARD_E_UNKNOWN_CARD);
    k.PcscLiteClient.API.SCARD_E_CANT_DISPOSE = (0, k.FixedSizeInteger.castToInt32)(2148532238);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_CANT_DISPOSE", k.PcscLiteClient.API.SCARD_E_CANT_DISPOSE);
    k.PcscLiteClient.API.SCARD_E_PROTO_MISMATCH = (0, k.FixedSizeInteger.castToInt32)(2148532239);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_PROTO_MISMATCH", k.PcscLiteClient.API.SCARD_E_PROTO_MISMATCH);
    k.PcscLiteClient.API.SCARD_E_NOT_READY = (0, k.FixedSizeInteger.castToInt32)(2148532240);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NOT_READY", k.PcscLiteClient.API.SCARD_E_NOT_READY);
    k.PcscLiteClient.API.SCARD_E_INVALID_VALUE = (0, k.FixedSizeInteger.castToInt32)(2148532241);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_VALUE", k.PcscLiteClient.API.SCARD_E_INVALID_VALUE);
    k.PcscLiteClient.API.SCARD_E_SYSTEM_CANCELLED = (0, k.FixedSizeInteger.castToInt32)(2148532242);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_SYSTEM_CANCELLED", k.PcscLiteClient.API.SCARD_E_SYSTEM_CANCELLED);
    k.PcscLiteClient.API.SCARD_F_COMM_ERROR = (0, k.FixedSizeInteger.castToInt32)(2148532243);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_F_COMM_ERROR", k.PcscLiteClient.API.SCARD_F_COMM_ERROR);
    k.PcscLiteClient.API.SCARD_F_UNKNOWN_ERROR = (0, k.FixedSizeInteger.castToInt32)(2148532244);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_F_UNKNOWN_ERROR", k.PcscLiteClient.API.SCARD_F_UNKNOWN_ERROR);
    k.PcscLiteClient.API.SCARD_E_INVALID_ATR = (0, k.FixedSizeInteger.castToInt32)(2148532245);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_ATR", k.PcscLiteClient.API.SCARD_E_INVALID_ATR);
    k.PcscLiteClient.API.SCARD_E_NOT_TRANSACTED = (0, k.FixedSizeInteger.castToInt32)(2148532246);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NOT_TRANSACTED", k.PcscLiteClient.API.SCARD_E_NOT_TRANSACTED);
    k.PcscLiteClient.API.SCARD_E_READER_UNAVAILABLE = (0, k.FixedSizeInteger.castToInt32)(2148532247);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_READER_UNAVAILABLE", k.PcscLiteClient.API.SCARD_E_READER_UNAVAILABLE);
    k.PcscLiteClient.API.SCARD_P_SHUTDOWN = (0, k.FixedSizeInteger.castToInt32)(2148532248);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_P_SHUTDOWN", k.PcscLiteClient.API.SCARD_P_SHUTDOWN);
    k.PcscLiteClient.API.SCARD_E_PCI_TOO_SMALL = (0, k.FixedSizeInteger.castToInt32)(2148532249);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_PCI_TOO_SMALL", k.PcscLiteClient.API.SCARD_E_PCI_TOO_SMALL);
    k.PcscLiteClient.API.SCARD_E_READER_UNSUPPORTED = (0, k.FixedSizeInteger.castToInt32)(2148532250);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_READER_UNSUPPORTED", k.PcscLiteClient.API.SCARD_E_READER_UNSUPPORTED);
    k.PcscLiteClient.API.SCARD_E_DUPLICATE_READER = (0, k.FixedSizeInteger.castToInt32)(2148532251);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_DUPLICATE_READER", k.PcscLiteClient.API.SCARD_E_DUPLICATE_READER);
    k.PcscLiteClient.API.SCARD_E_CARD_UNSUPPORTED = (0, k.FixedSizeInteger.castToInt32)(2148532252);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_CARD_UNSUPPORTED", k.PcscLiteClient.API.SCARD_E_CARD_UNSUPPORTED);
    k.PcscLiteClient.API.SCARD_E_NO_SERVICE = (0, k.FixedSizeInteger.castToInt32)(2148532253);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_SERVICE", k.PcscLiteClient.API.SCARD_E_NO_SERVICE);
    k.PcscLiteClient.API.SCARD_E_SERVICE_STOPPED = (0, k.FixedSizeInteger.castToInt32)(2148532254);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_SERVICE_STOPPED", k.PcscLiteClient.API.SCARD_E_SERVICE_STOPPED);
    k.PcscLiteClient.API.SCARD_E_UNEXPECTED = (0, k.FixedSizeInteger.castToInt32)(2148532255);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNEXPECTED", k.PcscLiteClient.API.SCARD_E_UNEXPECTED);
    k.PcscLiteClient.API.SCARD_E_UNSUPPORTED_FEATURE = (0, k.FixedSizeInteger.castToInt32)(2148532255);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNSUPPORTED_FEATURE", k.PcscLiteClient.API.SCARD_E_UNSUPPORTED_FEATURE);
    k.PcscLiteClient.API.SCARD_E_ICC_INSTALLATION = (0, k.FixedSizeInteger.castToInt32)(2148532256);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_ICC_INSTALLATION", k.PcscLiteClient.API.SCARD_E_ICC_INSTALLATION);
    k.PcscLiteClient.API.SCARD_E_ICC_CREATEORDER = (0, k.FixedSizeInteger.castToInt32)(2148532257);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_ICC_CREATEORDER", k.PcscLiteClient.API.SCARD_E_ICC_CREATEORDER);
    k.PcscLiteClient.API.SCARD_E_DIR_NOT_FOUND = (0, k.FixedSizeInteger.castToInt32)(2148532259);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_DIR_NOT_FOUND", k.PcscLiteClient.API.SCARD_E_DIR_NOT_FOUND);
    k.PcscLiteClient.API.SCARD_E_FILE_NOT_FOUND = (0, k.FixedSizeInteger.castToInt32)(2148532260);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_FILE_NOT_FOUND", k.PcscLiteClient.API.SCARD_E_FILE_NOT_FOUND);
    k.PcscLiteClient.API.SCARD_E_NO_DIR = (0, k.FixedSizeInteger.castToInt32)(2148532261);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_DIR", k.PcscLiteClient.API.SCARD_E_NO_DIR);
    k.PcscLiteClient.API.SCARD_E_NO_FILE = (0, k.FixedSizeInteger.castToInt32)(2148532262);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_FILE", k.PcscLiteClient.API.SCARD_E_NO_FILE);
    k.PcscLiteClient.API.SCARD_E_NO_ACCESS = (0, k.FixedSizeInteger.castToInt32)(2148532263);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_ACCESS", k.PcscLiteClient.API.SCARD_E_NO_ACCESS);
    k.PcscLiteClient.API.SCARD_E_WRITE_TOO_MANY = (0, k.FixedSizeInteger.castToInt32)(2148532264);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_WRITE_TOO_MANY", k.PcscLiteClient.API.SCARD_E_WRITE_TOO_MANY);
    k.PcscLiteClient.API.SCARD_E_BAD_SEEK = (0, k.FixedSizeInteger.castToInt32)(2148532265);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_BAD_SEEK", k.PcscLiteClient.API.SCARD_E_BAD_SEEK);
    k.PcscLiteClient.API.SCARD_E_INVALID_CHV = (0, k.FixedSizeInteger.castToInt32)(2148532266);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_INVALID_CHV", k.PcscLiteClient.API.SCARD_E_INVALID_CHV);
    k.PcscLiteClient.API.SCARD_E_UNKNOWN_RES_MNG = (0, k.FixedSizeInteger.castToInt32)(2148532267);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_UNKNOWN_RES_MNG", k.PcscLiteClient.API.SCARD_E_UNKNOWN_RES_MNG);
    k.PcscLiteClient.API.SCARD_E_NO_SUCH_CERTIFICATE = (0, k.FixedSizeInteger.castToInt32)(2148532268);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_SUCH_CERTIFICATE", k.PcscLiteClient.API.SCARD_E_NO_SUCH_CERTIFICATE);
    k.PcscLiteClient.API.SCARD_E_CERTIFICATE_UNAVAILABLE = (0, k.FixedSizeInteger.castToInt32)(2148532269);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_CERTIFICATE_UNAVAILABLE", k.PcscLiteClient.API.SCARD_E_CERTIFICATE_UNAVAILABLE);
    k.PcscLiteClient.API.SCARD_E_NO_READERS_AVAILABLE = (0, k.FixedSizeInteger.castToInt32)(2148532270);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_READERS_AVAILABLE", k.PcscLiteClient.API.SCARD_E_NO_READERS_AVAILABLE);
    k.PcscLiteClient.API.SCARD_E_COMM_DATA_LOST = (0, k.FixedSizeInteger.castToInt32)(2148532271);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_COMM_DATA_LOST", k.PcscLiteClient.API.SCARD_E_COMM_DATA_LOST);
    k.PcscLiteClient.API.SCARD_E_NO_KEY_CONTAINER = (0, k.FixedSizeInteger.castToInt32)(2148532272);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_NO_KEY_CONTAINER", k.PcscLiteClient.API.SCARD_E_NO_KEY_CONTAINER);
    k.PcscLiteClient.API.SCARD_E_SERVER_TOO_BUSY = (0, k.FixedSizeInteger.castToInt32)(2148532273);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_E_SERVER_TOO_BUSY", k.PcscLiteClient.API.SCARD_E_SERVER_TOO_BUSY);
    k.PcscLiteClient.API.SCARD_W_UNSUPPORTED_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532325);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_UNSUPPORTED_CARD", k.PcscLiteClient.API.SCARD_W_UNSUPPORTED_CARD);
    k.PcscLiteClient.API.SCARD_W_UNRESPONSIVE_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532326);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_UNRESPONSIVE_CARD", k.PcscLiteClient.API.SCARD_W_UNRESPONSIVE_CARD);
    k.PcscLiteClient.API.SCARD_W_UNPOWERED_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532327);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_UNPOWERED_CARD", k.PcscLiteClient.API.SCARD_W_UNPOWERED_CARD);
    k.PcscLiteClient.API.SCARD_W_RESET_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532328);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_RESET_CARD", k.PcscLiteClient.API.SCARD_W_RESET_CARD);
    k.PcscLiteClient.API.SCARD_W_REMOVED_CARD = (0, k.FixedSizeInteger.castToInt32)(2148532329);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_REMOVED_CARD", k.PcscLiteClient.API.SCARD_W_REMOVED_CARD);
    k.PcscLiteClient.API.SCARD_W_SECURITY_VIOLATION = (0, k.FixedSizeInteger.castToInt32)(2148532330);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_SECURITY_VIOLATION", k.PcscLiteClient.API.SCARD_W_SECURITY_VIOLATION);
    k.PcscLiteClient.API.SCARD_W_WRONG_CHV = (0, k.FixedSizeInteger.castToInt32)(2148532331);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_WRONG_CHV", k.PcscLiteClient.API.SCARD_W_WRONG_CHV);
    k.PcscLiteClient.API.SCARD_W_CHV_BLOCKED = (0, k.FixedSizeInteger.castToInt32)(2148532332);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_CHV_BLOCKED", k.PcscLiteClient.API.SCARD_W_CHV_BLOCKED);
    k.PcscLiteClient.API.SCARD_W_EOF = (0, k.FixedSizeInteger.castToInt32)(2148532333);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_EOF", k.PcscLiteClient.API.SCARD_W_EOF);
    k.PcscLiteClient.API.SCARD_W_CANCELLED_BY_USER = (0, k.FixedSizeInteger.castToInt32)(2148532334);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_CANCELLED_BY_USER", k.PcscLiteClient.API.SCARD_W_CANCELLED_BY_USER);
    k.PcscLiteClient.API.SCARD_W_CARD_NOT_AUTHENTICATED = (0, k.FixedSizeInteger.castToInt32)(2148532335);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_W_CARD_NOT_AUTHENTICATED", k.PcscLiteClient.API.SCARD_W_CARD_NOT_AUTHENTICATED);
    k.PcscLiteClient.API.SCARD_AUTOALLOCATE = (0, k.FixedSizeInteger.castToInt32)(4294967295);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_AUTOALLOCATE", k.PcscLiteClient.API.SCARD_AUTOALLOCATE);
    k.PcscLiteClient.API.SCARD_SCOPE_USER = 0;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SCOPE_USER", k.PcscLiteClient.API.SCARD_SCOPE_USER);
    k.PcscLiteClient.API.SCARD_SCOPE_TERMINAL = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SCOPE_TERMINAL", k.PcscLiteClient.API.SCARD_SCOPE_TERMINAL);
    k.PcscLiteClient.API.SCARD_SCOPE_SYSTEM = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SCOPE_SYSTEM", k.PcscLiteClient.API.SCARD_SCOPE_SYSTEM);
    k.PcscLiteClient.API.SCARD_PROTOCOL_UNDEFINED = 0;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_UNDEFINED", k.PcscLiteClient.API.SCARD_PROTOCOL_UNDEFINED);
    k.PcscLiteClient.API.SCARD_PROTOCOL_UNSET = k.PcscLiteClient.API.SCARD_PROTOCOL_UNDEFINED;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_UNSET", k.PcscLiteClient.API.SCARD_PROTOCOL_UNSET);
    k.PcscLiteClient.API.SCARD_PROTOCOL_T0 = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_T0", k.PcscLiteClient.API.SCARD_PROTOCOL_T0);
    k.PcscLiteClient.API.SCARD_PROTOCOL_T1 = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_T1", k.PcscLiteClient.API.SCARD_PROTOCOL_T1);
    k.PcscLiteClient.API.SCARD_PROTOCOL_RAW = 4;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_RAW", k.PcscLiteClient.API.SCARD_PROTOCOL_RAW);
    k.PcscLiteClient.API.SCARD_PROTOCOL_T15 = 8;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_T15", k.PcscLiteClient.API.SCARD_PROTOCOL_T15);
    k.PcscLiteClient.API.SCARD_PROTOCOL_ANY = k.PcscLiteClient.API.SCARD_PROTOCOL_T0 | k.PcscLiteClient.API.SCARD_PROTOCOL_T1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PROTOCOL_ANY", k.PcscLiteClient.API.SCARD_PROTOCOL_ANY);
    k.PcscLiteClient.API.SCARD_SHARE_EXCLUSIVE = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SHARE_EXCLUSIVE", k.PcscLiteClient.API.SCARD_SHARE_EXCLUSIVE);
    k.PcscLiteClient.API.SCARD_SHARE_SHARED = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SHARE_SHARED", k.PcscLiteClient.API.SCARD_SHARE_SHARED);
    k.PcscLiteClient.API.SCARD_SHARE_DIRECT = 3;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SHARE_DIRECT", k.PcscLiteClient.API.SCARD_SHARE_DIRECT);
    k.PcscLiteClient.API.SCARD_LEAVE_CARD = 0;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_LEAVE_CARD", k.PcscLiteClient.API.SCARD_LEAVE_CARD);
    k.PcscLiteClient.API.SCARD_RESET_CARD = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_RESET_CARD", k.PcscLiteClient.API.SCARD_RESET_CARD);
    k.PcscLiteClient.API.SCARD_UNPOWER_CARD = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_UNPOWER_CARD", k.PcscLiteClient.API.SCARD_UNPOWER_CARD);
    k.PcscLiteClient.API.SCARD_EJECT_CARD = 3;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_EJECT_CARD", k.PcscLiteClient.API.SCARD_EJECT_CARD);
    k.PcscLiteClient.API.SCARD_UNKNOWN = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_UNKNOWN", k.PcscLiteClient.API.SCARD_UNKNOWN);
    k.PcscLiteClient.API.SCARD_ABSENT = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ABSENT", k.PcscLiteClient.API.SCARD_ABSENT);
    k.PcscLiteClient.API.SCARD_PRESENT = 4;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PRESENT", k.PcscLiteClient.API.SCARD_PRESENT);
    k.PcscLiteClient.API.SCARD_SWALLOWED = 8;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SWALLOWED", k.PcscLiteClient.API.SCARD_SWALLOWED);
    k.PcscLiteClient.API.SCARD_POWERED = 16;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_POWERED", k.PcscLiteClient.API.SCARD_POWERED);
    k.PcscLiteClient.API.SCARD_NEGOTIABLE = 32;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_NEGOTIABLE", k.PcscLiteClient.API.SCARD_NEGOTIABLE);
    k.PcscLiteClient.API.SCARD_SPECIFIC = 64;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_SPECIFIC", k.PcscLiteClient.API.SCARD_SPECIFIC);
    k.PcscLiteClient.API.SCARD_STATE_UNAWARE = 0;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_UNAWARE", k.PcscLiteClient.API.SCARD_STATE_UNAWARE);
    k.PcscLiteClient.API.SCARD_STATE_IGNORE = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_IGNORE", k.PcscLiteClient.API.SCARD_STATE_IGNORE);
    k.PcscLiteClient.API.SCARD_STATE_CHANGED = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_CHANGED", k.PcscLiteClient.API.SCARD_STATE_CHANGED);
    k.PcscLiteClient.API.SCARD_STATE_UNKNOWN = 4;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_UNKNOWN", k.PcscLiteClient.API.SCARD_STATE_UNKNOWN);
    k.PcscLiteClient.API.SCARD_STATE_UNAVAILABLE = 8;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_UNAVAILABLE", k.PcscLiteClient.API.SCARD_STATE_UNAVAILABLE);
    k.PcscLiteClient.API.SCARD_STATE_EMPTY = 16;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_EMPTY", k.PcscLiteClient.API.SCARD_STATE_EMPTY);
    k.PcscLiteClient.API.SCARD_STATE_PRESENT = 32;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_PRESENT", k.PcscLiteClient.API.SCARD_STATE_PRESENT);
    k.PcscLiteClient.API.SCARD_STATE_ATRMATCH = 64;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_ATRMATCH", k.PcscLiteClient.API.SCARD_STATE_ATRMATCH);
    k.PcscLiteClient.API.SCARD_STATE_EXCLUSIVE = 128;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_EXCLUSIVE", k.PcscLiteClient.API.SCARD_STATE_EXCLUSIVE);
    k.PcscLiteClient.API.SCARD_STATE_INUSE = 256;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_INUSE", k.PcscLiteClient.API.SCARD_STATE_INUSE);
    k.PcscLiteClient.API.SCARD_STATE_MUTE = 512;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_MUTE", k.PcscLiteClient.API.SCARD_STATE_MUTE);
    k.PcscLiteClient.API.SCARD_STATE_UNPOWERED = 1024;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_STATE_UNPOWERED", k.PcscLiteClient.API.SCARD_STATE_UNPOWERED);
    k.PcscLiteClient.API.INFINITE = 4294967295;
    e.exportProperty(k.PcscLiteClient.API, "INFINITE", k.PcscLiteClient.API.INFINITE);
    k.PcscLiteClient.API.PCSCLITE_MAX_READERS_CONTEXTS = 16;
    e.exportProperty(k.PcscLiteClient.API, "PCSCLITE_MAX_READERS_CONTEXTS", k.PcscLiteClient.API.PCSCLITE_MAX_READERS_CONTEXTS);
    k.PcscLiteClient.API.MAX_READERNAME = 128;
    e.exportProperty(k.PcscLiteClient.API, "MAX_READERNAME", k.PcscLiteClient.API.MAX_READERNAME);
    k.PcscLiteClient.API.SCARD_ATR_LENGTH = k.PcscLiteClient.API.MAX_ATR_SIZE;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATR_LENGTH", k.PcscLiteClient.API.MAX_ATR_SIZE);
    k.PcscLiteClient.API.MAX_BUFFER_SIZE = 264;
    e.exportProperty(k.PcscLiteClient.API, "MAX_BUFFER_SIZE", k.PcscLiteClient.API.MAX_BUFFER_SIZE);
    k.PcscLiteClient.API.MAX_BUFFER_SIZE_EXTENDED = 65548;
    e.exportProperty(k.PcscLiteClient.API, "MAX_BUFFER_SIZE_EXTENDED", k.PcscLiteClient.API.MAX_BUFFER_SIZE_EXTENDED);
    k.PcscLiteClient.API.SCARD_ATTR_VALUE = function (a, c) {
        return a << 16 | c
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VALUE", k.PcscLiteClient.API.SCARD_ATTR_VALUE);
    k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO = 1;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_VENDOR_INFO", k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO);
    k.PcscLiteClient.API.SCARD_CLASS_COMMUNICATIONS = 2;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_COMMUNICATIONS", k.PcscLiteClient.API.SCARD_CLASS_COMMUNICATIONS);
    k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL = 3;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_PROTOCOL", k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL);
    k.PcscLiteClient.API.SCARD_CLASS_POWER_MGMT = 4;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_POWER_MGMT", k.PcscLiteClient.API.SCARD_CLASS_POWER_MGMT);
    k.PcscLiteClient.API.SCARD_CLASS_SECURITY = 5;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_SECURITY", k.PcscLiteClient.API.SCARD_CLASS_SECURITY);
    k.PcscLiteClient.API.SCARD_CLASS_MECHANICAL = 6;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_MECHANICAL", k.PcscLiteClient.API.SCARD_CLASS_MECHANICAL);
    k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED = 7;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_VENDOR_DEFINED", k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED);
    k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL = 8;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_IFD_PROTOCOL", k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL);
    k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE = 9;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_ICC_STATE", k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE);
    k.PcscLiteClient.API.SCARD_CLASS_SYSTEM = 32767;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CLASS_SYSTEM", k.PcscLiteClient.API.SCARD_CLASS_SYSTEM);
    k.PcscLiteClient.API.SCARD_ATTR_VENDOR_NAME = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO, 256);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VENDOR_NAME", k.PcscLiteClient.API.SCARD_ATTR_VENDOR_NAME);
    k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_TYPE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO, 257);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VENDOR_IFD_TYPE", k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_TYPE);
    k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_VERSION = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO, 258);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VENDOR_IFD_VERSION", k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_VERSION);
    k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_SERIAL_NO = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_INFO, 259);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_VENDOR_IFD_SERIAL_NO", k.PcscLiteClient.API.SCARD_ATTR_VENDOR_IFD_SERIAL_NO);
    k.PcscLiteClient.API.SCARD_ATTR_CHANNEL_ID = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_COMMUNICATIONS, 272);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CHANNEL_ID", k.PcscLiteClient.API.SCARD_ATTR_CHANNEL_ID);
    k.PcscLiteClient.API.SCARD_ATTR_ASYNC_PROTOCOL_TYPES = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 288);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ASYNC_PROTOCOL_TYPES", k.PcscLiteClient.API.SCARD_ATTR_ASYNC_PROTOCOL_TYPES);
    k.PcscLiteClient.API.SCARD_ATTR_DEFAULT_CLK = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 289);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEFAULT_CLK", k.PcscLiteClient.API.SCARD_ATTR_DEFAULT_CLK);
    k.PcscLiteClient.API.SCARD_ATTR_MAX_CLK = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 290);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_MAX_CLK", k.PcscLiteClient.API.SCARD_ATTR_MAX_CLK);
    k.PcscLiteClient.API.SCARD_ATTR_DEFAULT_DATA_RATE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 291);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEFAULT_DATA_RATE", k.PcscLiteClient.API.SCARD_ATTR_DEFAULT_DATA_RATE);
    k.PcscLiteClient.API.SCARD_ATTR_MAX_DATA_RATE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 292);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_MAX_DATA_RATE", k.PcscLiteClient.API.SCARD_ATTR_MAX_DATA_RATE);
    k.PcscLiteClient.API.SCARD_ATTR_MAX_IFSD = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 293);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_MAX_IFSD", k.PcscLiteClient.API.SCARD_ATTR_MAX_IFSD);
    k.PcscLiteClient.API.SCARD_ATTR_SYNC_PROTOCOL_TYPES = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_PROTOCOL, 294);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_SYNC_PROTOCOL_TYPES", k.PcscLiteClient.API.SCARD_ATTR_SYNC_PROTOCOL_TYPES);
    k.PcscLiteClient.API.SCARD_ATTR_POWER_MGMT_SUPPORT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_POWER_MGMT, 305);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_POWER_MGMT_SUPPORT", k.PcscLiteClient.API.SCARD_ATTR_POWER_MGMT_SUPPORT);
    k.PcscLiteClient.API.SCARD_ATTR_USER_TO_CARD_AUTH_DEVICE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SECURITY, 320);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_USER_TO_CARD_AUTH_DEVICE", k.PcscLiteClient.API.SCARD_ATTR_USER_TO_CARD_AUTH_DEVICE);
    k.PcscLiteClient.API.SCARD_ATTR_USER_AUTH_INPUT_DEVICE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SECURITY, 322);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_USER_AUTH_INPUT_DEVICE", k.PcscLiteClient.API.SCARD_ATTR_USER_AUTH_INPUT_DEVICE);
    k.PcscLiteClient.API.SCARD_ATTR_CHARACTERISTICS = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_MECHANICAL, 336);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CHARACTERISTICS", k.PcscLiteClient.API.SCARD_ATTR_CHARACTERISTICS);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_PROTOCOL_TYPE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 513);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_PROTOCOL_TYPE", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_PROTOCOL_TYPE);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_CLK = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 514);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_CLK", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_CLK);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_F = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 515);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_F", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_F);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_D = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 516);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_D", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_D);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_N = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 517);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_N", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_N);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_W = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 518);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_W", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_W);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IFSC = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 519);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_IFSC", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IFSC);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IFSD = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 520);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_IFSD", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IFSD);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_BWT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 521);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_BWT", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_BWT);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_CWT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 522);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_CWT", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_CWT);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_EBC_ENCODING = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 523);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_EBC_ENCODING", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_EBC_ENCODING);
    k.PcscLiteClient.API.SCARD_ATTR_EXTENDED_BWT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_IFD_PROTOCOL, 524);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_EXTENDED_BWT", k.PcscLiteClient.API.SCARD_ATTR_EXTENDED_BWT);
    k.PcscLiteClient.API.SCARD_ATTR_ICC_PRESENCE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 768);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ICC_PRESENCE", k.PcscLiteClient.API.SCARD_ATTR_ICC_PRESENCE);
    k.PcscLiteClient.API.SCARD_ATTR_ICC_INTERFACE_STATUS = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 769);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ICC_INTERFACE_STATUS", k.PcscLiteClient.API.SCARD_ATTR_ICC_INTERFACE_STATUS);
    k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IO_STATE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 770);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_CURRENT_IO_STATE", k.PcscLiteClient.API.SCARD_ATTR_CURRENT_IO_STATE);
    k.PcscLiteClient.API.SCARD_ATTR_ATR_STRING = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 771);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ATR_STRING", k.PcscLiteClient.API.SCARD_ATTR_ATR_STRING);
    k.PcscLiteClient.API.SCARD_ATTR_ICC_TYPE_PER_ATR = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_ICC_STATE, 772);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ICC_TYPE_PER_ATR", k.PcscLiteClient.API.SCARD_ATTR_ICC_TYPE_PER_ATR);
    k.PcscLiteClient.API.SCARD_ATTR_ESC_RESET = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED, 40960);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ESC_RESET", k.PcscLiteClient.API.SCARD_ATTR_ESC_RESET);
    k.PcscLiteClient.API.SCARD_ATTR_ESC_CANCEL = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED, 40963);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ESC_CANCEL", k.PcscLiteClient.API.SCARD_ATTR_ESC_CANCEL);
    k.PcscLiteClient.API.SCARD_ATTR_ESC_AUTHREQUEST = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED, 40965);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_ESC_AUTHREQUEST", k.PcscLiteClient.API.SCARD_ATTR_ESC_AUTHREQUEST);
    k.PcscLiteClient.API.SCARD_ATTR_MAXINPUT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_VENDOR_DEFINED, 40967);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_MAXINPUT", k.PcscLiteClient.API.SCARD_ATTR_MAXINPUT);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_UNIT = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 1);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_UNIT", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_UNIT);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_IN_USE = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 2);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_IN_USE", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_IN_USE);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_A = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 3);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_FRIENDLY_NAME_A", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_A);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_A = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 4);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_SYSTEM_NAME_A", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_A);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_W = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 5);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_FRIENDLY_NAME_W", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_W);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_W = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 6);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_SYSTEM_NAME_W", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_W);
    k.PcscLiteClient.API.SCARD_ATTR_SUPRESS_T1_IFS_REQUEST = k.PcscLiteClient.API.SCARD_ATTR_VALUE(k.PcscLiteClient.API.SCARD_CLASS_SYSTEM, 7);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_SUPRESS_T1_IFS_REQUEST", k.PcscLiteClient.API.SCARD_ATTR_SUPRESS_T1_IFS_REQUEST);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME = k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME_W;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_FRIENDLY_NAME", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_FRIENDLY_NAME);
    k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME = k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME_W;
    e.exportProperty(k.PcscLiteClient.API, "SCARD_ATTR_DEVICE_SYSTEM_NAME", k.PcscLiteClient.API.SCARD_ATTR_DEVICE_SYSTEM_NAME);
    k.PcscLiteClient.API.SCARD_CTL_CODE = function (a) {
        return (0, k.FixedSizeInteger.castToInt32)(1107296256) + a
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_CTL_CODE", k.PcscLiteClient.API.SCARD_CTL_CODE);
    k.PcscLiteClient.API.CM_IOCTL_GET_FEATURE_REQUEST = k.PcscLiteClient.API.SCARD_CTL_CODE(3400);
    e.exportProperty(k.PcscLiteClient.API, "CM_IOCTL_GET_FEATURE_REQUEST", k.PcscLiteClient.API.CM_IOCTL_GET_FEATURE_REQUEST);
    k.PcscLiteClient.API.FEATURE_VERIFY_PIN_START = 1;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_VERIFY_PIN_START", k.PcscLiteClient.API.FEATURE_VERIFY_PIN_START);
    k.PcscLiteClient.API.FEATURE_VERIFY_PIN_FINISH = 2;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_VERIFY_PIN_FINISH", k.PcscLiteClient.API.FEATURE_VERIFY_PIN_FINISH);
    k.PcscLiteClient.API.FEATURE_MODIFY_PIN_START = 3;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MODIFY_PIN_START", k.PcscLiteClient.API.FEATURE_MODIFY_PIN_START);
    k.PcscLiteClient.API.FEATURE_MODIFY_PIN_FINISH = 4;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MODIFY_PIN_FINISH", k.PcscLiteClient.API.FEATURE_MODIFY_PIN_FINISH);
    k.PcscLiteClient.API.FEATURE_GET_KEY_PRESSED = 5;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_GET_KEY_PRESSED", k.PcscLiteClient.API.FEATURE_GET_KEY_PRESSED);
    k.PcscLiteClient.API.FEATURE_VERIFY_PIN_DIRECT = 6;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_VERIFY_PIN_DIRECT", k.PcscLiteClient.API.FEATURE_VERIFY_PIN_DIRECT);
    k.PcscLiteClient.API.FEATURE_MODIFY_PIN_DIRECT = 7;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MODIFY_PIN_DIRECT", k.PcscLiteClient.API.FEATURE_MODIFY_PIN_DIRECT);
    k.PcscLiteClient.API.FEATURE_MCT_READER_DIRECT = 8;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MCT_READER_DIRECT", k.PcscLiteClient.API.FEATURE_MCT_READER_DIRECT);
    k.PcscLiteClient.API.FEATURE_MCT_UNIVERSAL = 9;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MCT_UNIVERSAL", k.PcscLiteClient.API.FEATURE_MCT_UNIVERSAL);
    k.PcscLiteClient.API.FEATURE_IFD_PIN_PROPERTIES = 10;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_IFD_PIN_PROPERTIES", k.PcscLiteClient.API.FEATURE_IFD_PIN_PROPERTIES);
    k.PcscLiteClient.API.FEATURE_ABORT = 11;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_ABORT", k.PcscLiteClient.API.FEATURE_ABORT);
    k.PcscLiteClient.API.FEATURE_SET_SPE_MESSAGE = 12;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_SET_SPE_MESSAGE", k.PcscLiteClient.API.FEATURE_SET_SPE_MESSAGE);
    k.PcscLiteClient.API.FEATURE_VERIFY_PIN_DIRECT_APP_ID = 13;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_VERIFY_PIN_DIRECT_APP_ID", k.PcscLiteClient.API.FEATURE_VERIFY_PIN_DIRECT_APP_ID);
    k.PcscLiteClient.API.FEATURE_MODIFY_PIN_DIRECT_APP_ID = 14;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_MODIFY_PIN_DIRECT_APP_ID", k.PcscLiteClient.API.FEATURE_MODIFY_PIN_DIRECT_APP_ID);
    k.PcscLiteClient.API.FEATURE_WRITE_DISPLAY = 15;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_WRITE_DISPLAY", k.PcscLiteClient.API.FEATURE_WRITE_DISPLAY);
    k.PcscLiteClient.API.FEATURE_GET_KEY = 16;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_GET_KEY", k.PcscLiteClient.API.FEATURE_GET_KEY);
    k.PcscLiteClient.API.FEATURE_IFD_DISPLAY_PROPERTIES = 17;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_IFD_DISPLAY_PROPERTIES", k.PcscLiteClient.API.FEATURE_IFD_DISPLAY_PROPERTIES);
    k.PcscLiteClient.API.FEATURE_GET_TLV_PROPERTIES = 18;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_GET_TLV_PROPERTIES", k.PcscLiteClient.API.FEATURE_GET_TLV_PROPERTIES);
    k.PcscLiteClient.API.FEATURE_CCID_ESC_COMMAND = 19;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_CCID_ESC_COMMAND", k.PcscLiteClient.API.FEATURE_CCID_ESC_COMMAND);
    k.PcscLiteClient.API.FEATURE_EXECUTE_PACE = 32;
    e.exportProperty(k.PcscLiteClient.API, "FEATURE_EXECUTE_PACE", k.PcscLiteClient.API.FEATURE_EXECUTE_PACE);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdLayout = 1;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wLcdLayout", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdLayout);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bEntryValidationCondition = 2;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bEntryValidationCondition", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bEntryValidationCondition);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bTimeOut2 = 3;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bTimeOut2", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bTimeOut2);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdMaxCharacters = 4;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wLcdMaxCharacters", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdMaxCharacters);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdMaxLines = 5;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wLcdMaxLines", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wLcdMaxLines);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bMinPINSize = 6;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bMinPINSize", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bMinPINSize);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bMaxPINSize = 7;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bMaxPINSize", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bMaxPINSize);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_sFirmwareID = 8;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_sFirmwareID", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_sFirmwareID);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bPPDUSupport = 9;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_bPPDUSupport", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_bPPDUSupport);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_dwMaxAPDUDataSize = 10;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_dwMaxAPDUDataSize", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_dwMaxAPDUDataSize);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wIdVendor = 11;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wIdVendor", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wIdVendor);
    k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wIdProduct = 12;
    e.exportProperty(k.PcscLiteClient.API, "PCSCv2_PART10_PROPERTY_wIdProduct", k.PcscLiteClient.API.PCSCv2_PART10_PROPERTY_wIdProduct);
    k.PcscLiteClient.API.SCARD_IO_REQUEST = function (a) {
        this.protocol = a
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_IO_REQUEST", k.PcscLiteClient.API.SCARD_IO_REQUEST);
    k.PcscLiteClient.API.SCARD_PCI_T0 = new k.PcscLiteClient.API.SCARD_IO_REQUEST(k.PcscLiteClient.API.SCARD_PROTOCOL_T0);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PCI_T0", k.PcscLiteClient.API.SCARD_PCI_T0);
    k.PcscLiteClient.API.SCARD_PCI_T1 = new k.PcscLiteClient.API.SCARD_IO_REQUEST(k.PcscLiteClient.API.SCARD_PROTOCOL_T1);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PCI_T1", k.PcscLiteClient.API.SCARD_PCI_T1);
    k.PcscLiteClient.API.SCARD_PCI_RAW = new k.PcscLiteClient.API.SCARD_IO_REQUEST(k.PcscLiteClient.API.SCARD_PROTOCOL_RAW);
    e.exportProperty(k.PcscLiteClient.API, "SCARD_PCI_RAW", k.PcscLiteClient.API.SCARD_PCI_RAW);
    k.PcscLiteClient.API.SCARD_READERSTATE_IN = function (a, c, d) {
        this.reader_name = a;
        this.current_state = c;
        void 0 !== d && (this.user_data = d)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_READERSTATE_IN", k.PcscLiteClient.API.SCARD_READERSTATE_IN);
    k.PcscLiteClient.API.createSCardReaderStateIn = function (a, c, d) {
        return new k.PcscLiteClient.API.SCARD_READERSTATE_IN(a, c, d)
    };
    k.PcscLiteClient.API.SCARD_READERSTATE_OUT = function (a, c, d, f, g) {
        this.reader_name = a;
        this.current_state = c;
        this.event_state = d;
        this.atr = f;
        void 0 !== g && (this.user_data = g)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCARD_READERSTATE_OUT", k.PcscLiteClient.API.SCARD_READERSTATE_OUT);
    k.PcscLiteClient.API.createSCardReaderStateOut = function (a, c, d, f, g) {
        return new k.PcscLiteClient.API.SCARD_READERSTATE_OUT(a, c, d, f, g)
    };
    k.PcscLiteClient.API.ResultOrErrorCode = function (a) {
        k.Logging.checkWithLogger(this.logger, 1 <= a.length);
        this.responseItems = a;
        this.errorCode = a[0];
        this.resultItems = void 0;
        this.isSuccessful() && (this.resultItems = e.array.slice(a, 1))
    };
    e.exportProperty(k.PcscLiteClient.API, "ResultOrErrorCode", k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.logger = k.Logging.getScopedLogger("PcscLiteClient.API.ResultOrErrorCode");
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.getBase = function (a, c, d, f) {
        this.isSuccessful() ? (k.Logging.checkWithLogger(this.logger, this.resultItems.length == a), c && c.apply(f, this.resultItems)) : d && d.apply(f, [this.errorCode])
    };
    e.exportProperty(k.PcscLiteClient.API.ResultOrErrorCode.prototype, "getBase", k.PcscLiteClient.API.ResultOrErrorCode.prototype.getBase);
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.isSuccessful = function () {
        return this.errorCode == k.PcscLiteClient.API.SCARD_S_SUCCESS
    };
    e.exportProperty(k.PcscLiteClient.API.ResultOrErrorCode.prototype, "isSuccessful", k.PcscLiteClient.API.ResultOrErrorCode.prototype.isSuccessful);
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.getResult = function () {
        k.Logging.checkWithLogger(this.logger, this.isSuccessful());
        k.Logging.checkWithLogger(this.logger, void 0 !== this.resultItems);
        e.asserts.assert(this.resultItems);
        return this.resultItems
    };
    e.exportProperty(k.PcscLiteClient.API.ResultOrErrorCode.prototype, "getResult", k.PcscLiteClient.API.ResultOrErrorCode.prototype.getResult);
    k.PcscLiteClient.API.ResultOrErrorCode.prototype.getDebugRepresentation = function () {
        return this.errorCode == k.PcscLiteClient.API.SCARD_S_SUCCESS ? "SCARD_S_SUCCESS" + (this.resultItems && this.resultItems.length ? " " + k.DebugDump.debugDump(this.resultItems) : "") : "error " + k.DebugDump.dump(this.errorCode)
    };
    e.exportProperty(k.PcscLiteClient.API.ResultOrErrorCode.prototype, "getDebugRepresentation", k.PcscLiteClient.API.ResultOrErrorCode.prototype.getDebugRepresentation);
    k.PcscLiteClient.API.prototype.pcsc_stringify_error = function (a) {
        var c = this.logger;
        return this.postRequest_("pcsc_stringify_error", [a], function (a) {
            k.Logging.checkWithLogger(c, 1 == a.length);
            k.Logging.checkWithLogger(c, "string" === typeof a[0]);
            return a[0]
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "pcsc_stringify_error", k.PcscLiteClient.API.prototype.pcsc_stringify_error);
    k.PcscLiteClient.API.prototype.SCardEstablishContext = function (a, c, d) {
        void 0 === c && (c = null);
        void 0 === d && (d = null);
        return this.postRequest_("SCardEstablishContext", [a, c, d], function (a) {
            return new k.PcscLiteClient.API.SCardEstablishContextResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardEstablishContext", k.PcscLiteClient.API.prototype.SCardEstablishContext);
    k.PcscLiteClient.API.SCardEstablishContextResult = function (a) {
        k.PcscLiteClient.API.ResultOrErrorCode.call(this, a)
    };
    e.inherits(k.PcscLiteClient.API.SCardEstablishContextResult, k.PcscLiteClient.API.ResultOrErrorCode);
    e.exportProperty(k.PcscLiteClient.API, "SCardEstablishContextResult", k.PcscLiteClient.API.SCardEstablishContextResult);
    k.PcscLiteClient.API.SCardEstablishContextResult.prototype.get = function (a, c, d) {
        this.getBase(1, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardEstablishContextResult.prototype, "get", k.PcscLiteClient.API.SCardEstablishContextResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardReleaseContext = function (a) {
        return this.postRequest_("SCardReleaseContext", [a], function (a) {
            return new k.PcscLiteClient.API.SCardReleaseContextResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardReleaseContext", k.PcscLiteClient.API.prototype.SCardReleaseContext);
    k.PcscLiteClient.API.SCardReleaseContextResult = function (a) {
        k.PcscLiteClient.API.ResultOrErrorCode.call(this, a)
    };
    e.inherits(k.PcscLiteClient.API.SCardReleaseContextResult, k.PcscLiteClient.API.ResultOrErrorCode);
    e.exportProperty(k.PcscLiteClient.API, "SCardReleaseContextResult", k.PcscLiteClient.API.SCardReleaseContextResult);
    k.PcscLiteClient.API.SCardReleaseContextResult.prototype.get = function (a, c, d) {
        this.getBase(0, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardReleaseContextResult.prototype, "get", k.PcscLiteClient.API.SCardReleaseContextResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardConnect = function (a, c, d, f) {
        return this.postRequest_("SCardConnect", [a, c, d, f], function (a) {
            return new k.PcscLiteClient.API.SCardConnectResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardConnect", k.PcscLiteClient.API.prototype.SCardConnect);
    k.PcscLiteClient.API.SCardConnectResult = function (a) {
        k.PcscLiteClient.API.SCardConnectResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardConnectResult", k.PcscLiteClient.API.SCardConnectResult);
    e.inherits(k.PcscLiteClient.API.SCardConnectResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardConnectResult.prototype.get = function (a, c, d) {
        this.getBase(2, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardConnectResult.prototype, "get", k.PcscLiteClient.API.SCardConnectResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardReconnect = function (a, c, d, f) {
        return this.postRequest_("SCardReconnect", [a, c, d, f], function (a) {
            return new k.PcscLiteClient.API.SCardReconnectResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardReconnect", k.PcscLiteClient.API.prototype.SCardReconnect);
    k.PcscLiteClient.API.SCardReconnectResult = function (a) {
        k.PcscLiteClient.API.SCardReconnectResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardReconnectResult", k.PcscLiteClient.API.SCardReconnectResult);
    e.inherits(k.PcscLiteClient.API.SCardReconnectResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardReconnectResult.prototype.get = function (a, c, d) {
        this.getBase(1, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardReconnectResult.prototype, "get", k.PcscLiteClient.API.SCardReconnectResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardDisconnect = function (a, c) {
        return this.postRequest_("SCardDisconnect", [a, c], function (a) {
            return new k.PcscLiteClient.API.SCardDisconnectResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardDisconnect", k.PcscLiteClient.API.prototype.SCardDisconnect);
    k.PcscLiteClient.API.SCardDisconnectResult = function (a) {
        k.PcscLiteClient.API.SCardDisconnectResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardDisconnectResult", k.PcscLiteClient.API.SCardDisconnectResult);
    e.inherits(k.PcscLiteClient.API.SCardDisconnectResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardDisconnectResult.prototype.get = function (a, c, d) {
        this.getBase(0, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardDisconnectResult.prototype, "get", k.PcscLiteClient.API.SCardDisconnectResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardBeginTransaction = function (a) {
        return this.postRequest_("SCardBeginTransaction", [a], function (a) {
            return new k.PcscLiteClient.API.SCardBeginTransactionResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardBeginTransaction", k.PcscLiteClient.API.prototype.SCardBeginTransaction);
    k.PcscLiteClient.API.SCardBeginTransactionResult = function (a) {
        k.PcscLiteClient.API.SCardBeginTransactionResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardBeginTransactionResult", k.PcscLiteClient.API.SCardBeginTransactionResult);
    e.inherits(k.PcscLiteClient.API.SCardBeginTransactionResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardBeginTransactionResult.prototype.get = function (a, c, d) {
        this.getBase(0, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardBeginTransactionResult.prototype, "get", k.PcscLiteClient.API.SCardBeginTransactionResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardEndTransaction = function (a, c) {
        return this.postRequest_("SCardEndTransaction", [a, c], function (a) {
            return new k.PcscLiteClient.API.SCardEndTransactionResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardEndTransaction", k.PcscLiteClient.API.prototype.SCardEndTransaction);
    k.PcscLiteClient.API.SCardEndTransactionResult = function (a) {
        k.PcscLiteClient.API.SCardEndTransactionResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardEndTransactionResult", k.PcscLiteClient.API.SCardEndTransactionResult);
    e.inherits(k.PcscLiteClient.API.SCardEndTransactionResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardEndTransactionResult.prototype.get = function (a, c, d) {
        this.getBase(0, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardEndTransactionResult.prototype, "get", k.PcscLiteClient.API.SCardEndTransactionResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardStatus = function (a) {
        return this.postRequest_("SCardStatus", [a], function (a) {
            return new k.PcscLiteClient.API.SCardStatusResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardStatus", k.PcscLiteClient.API.prototype.SCardStatus);
    k.PcscLiteClient.API.SCardStatusResult = function (a) {
        k.PcscLiteClient.API.SCardStatusResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardStatusResult", k.PcscLiteClient.API.SCardStatusResult);
    e.inherits(k.PcscLiteClient.API.SCardStatusResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardStatusResult.prototype.get = function (a, c, d) {
        this.getBase(4, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardStatusResult.prototype, "get", k.PcscLiteClient.API.SCardStatusResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardGetStatusChange = function (a, c, d) {
        return this.postRequest_("SCardGetStatusChange", [a, c, d], function (a) {
            return new k.PcscLiteClient.API.SCardGetStatusChangeResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardGetStatusChange", k.PcscLiteClient.API.prototype.SCardGetStatusChange);
    k.PcscLiteClient.API.SCardGetStatusChangeResult = function (a) {
        k.PcscLiteClient.API.SCardGetStatusChangeResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardGetStatusChangeResult", k.PcscLiteClient.API.SCardGetStatusChangeResult);
    e.inherits(k.PcscLiteClient.API.SCardGetStatusChangeResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardGetStatusChangeResult.prototype.get = function (a, c, d) {
        this.getBase(1, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardGetStatusChangeResult.prototype, "get", k.PcscLiteClient.API.SCardGetStatusChangeResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardControl = function (a, c, d) {
        return this.postRequest_("SCardControl", [a, c, d], function (a) {
            return new k.PcscLiteClient.API.SCardControlResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardControl", k.PcscLiteClient.API.prototype.SCardControl);
    k.PcscLiteClient.API.SCardControlResult = function (a) {
        k.PcscLiteClient.API.SCardControlResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardControlResult", k.PcscLiteClient.API.SCardControlResult);
    e.inherits(k.PcscLiteClient.API.SCardControlResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardControlResult.prototype.get = function (a, c, d) {
        this.getBase(1, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardControlResult.prototype, "get", k.PcscLiteClient.API.SCardControlResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardGetAttrib = function (a, c) {
        return this.postRequest_("SCardGetAttrib", [a, c], function (a) {
            return new k.PcscLiteClient.API.SCardGetAttribResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardGetAttrib", k.PcscLiteClient.API.prototype.SCardGetAttrib);
    k.PcscLiteClient.API.SCardGetAttribResult = function (a) {
        k.PcscLiteClient.API.SCardGetAttribResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardGetAttribResult", k.PcscLiteClient.API.SCardGetAttribResult);
    e.inherits(k.PcscLiteClient.API.SCardGetAttribResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardGetAttribResult.prototype.get = function (a, c, d) {
        this.getBase(1, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardGetAttribResult.prototype, "get", k.PcscLiteClient.API.SCardGetAttribResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardSetAttrib = function (a, c, d) {
        return this.postRequest_("SCardSetAttrib", [a, c, d], function (a) {
            return new k.PcscLiteClient.API.SCardSetAttribResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardSetAttrib", k.PcscLiteClient.API.prototype.SCardSetAttrib);
    k.PcscLiteClient.API.SCardSetAttribResult = function (a) {
        k.PcscLiteClient.API.SCardSetAttribResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardSetAttribResult", k.PcscLiteClient.API.SCardSetAttribResult);
    e.inherits(k.PcscLiteClient.API.SCardSetAttribResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardSetAttribResult.prototype.get = function (a, c, d) {
        this.getBase(0, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardSetAttribResult.prototype, "get", k.PcscLiteClient.API.SCardSetAttribResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardTransmit = function (a, c, d, f) {
        return this.postRequest_("SCardTransmit", [a, c, d, f], function (a) {
            return new k.PcscLiteClient.API.SCardTransmitResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardTransmit", k.PcscLiteClient.API.prototype.SCardTransmit);
    k.PcscLiteClient.API.SCardTransmitResult = function (a) {
        k.PcscLiteClient.API.SCardTransmitResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardTransmitResult", k.PcscLiteClient.API.SCardTransmitResult);
    e.inherits(k.PcscLiteClient.API.SCardTransmitResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardTransmitResult.prototype.get = function (a, c, d) {
        this.getBase(2, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardTransmitResult.prototype, "get", k.PcscLiteClient.API.SCardTransmitResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardListReaders = function (a, c) {
        return this.postRequest_("SCardListReaders", [a, c], function (a) {
            return new k.PcscLiteClient.API.SCardListReadersResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardListReaders", k.PcscLiteClient.API.prototype.SCardListReaders);
    k.PcscLiteClient.API.SCardListReadersResult = function (a) {
        k.PcscLiteClient.API.SCardListReadersResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardListReadersResult", k.PcscLiteClient.API.SCardListReadersResult);
    e.inherits(k.PcscLiteClient.API.SCardListReadersResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardListReadersResult.prototype.get = function (a, c, d) {
        this.getBase(1, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardListReadersResult.prototype, "get", k.PcscLiteClient.API.SCardListReadersResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardListReaderGroups = function (a) {
        return this.postRequest_("SCardListReaderGroups", [a], function (a) {
            return new k.PcscLiteClient.API.SCardListReaderGroupsResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardListReaderGroups", k.PcscLiteClient.API.prototype.SCardListReaderGroups);
    k.PcscLiteClient.API.SCardListReaderGroupsResult = function (a) {
        k.PcscLiteClient.API.SCardListReaderGroupsResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardListReaderGroupsResult", k.PcscLiteClient.API.SCardListReaderGroupsResult);
    e.inherits(k.PcscLiteClient.API.SCardListReaderGroupsResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardListReaderGroupsResult.prototype.get = function (a, c, d) {
        this.getBase(1, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardListReaderGroupsResult.prototype, "get", k.PcscLiteClient.API.SCardListReaderGroupsResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardCancel = function (a) {
        return this.postRequest_("SCardCancel", [a], function (a) {
            return new k.PcscLiteClient.API.SCardCancelResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardCancel", k.PcscLiteClient.API.prototype.SCardCancel);
    k.PcscLiteClient.API.SCardCancelResult = function (a) {
        k.PcscLiteClient.API.SCardCancelResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardCancelResult", k.PcscLiteClient.API.SCardCancelResult);
    e.inherits(k.PcscLiteClient.API.SCardCancelResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardCancelResult.prototype.get = function (a, c, d) {
        this.getBase(0, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardCancelResult.prototype, "get", k.PcscLiteClient.API.SCardCancelResult.prototype.get);
    k.PcscLiteClient.API.prototype.SCardIsValidContext = function (a) {
        return this.postRequest_("SCardIsValidContext", [a], function (a) {
            return new k.PcscLiteClient.API.SCardIsValidContextResult(a)
        })
    };
    e.exportProperty(k.PcscLiteClient.API.prototype, "SCardIsValidContext", k.PcscLiteClient.API.prototype.SCardIsValidContext);
    k.PcscLiteClient.API.SCardIsValidContextResult = function (a) {
        k.PcscLiteClient.API.SCardIsValidContextResult.base(this, "constructor", a)
    };
    e.exportProperty(k.PcscLiteClient.API, "SCardIsValidContextResult", k.PcscLiteClient.API.SCardIsValidContextResult);
    e.inherits(k.PcscLiteClient.API.SCardIsValidContextResult, k.PcscLiteClient.API.ResultOrErrorCode);
    k.PcscLiteClient.API.SCardIsValidContextResult.prototype.get = function (a, c, d) {
        this.getBase(0, a, c, d)
    };
    e.exportProperty(k.PcscLiteClient.API.SCardIsValidContextResult.prototype, "get", k.PcscLiteClient.API.SCardIsValidContextResult.prototype.get);
    k.PcscLiteClient.API.prototype.disposeInternal = function () {
        this.requester_.dispose();
        this.messageChannel_ = this.requester_ = null;
        this.logger.fine("Disposed");
        k.PcscLiteClient.API.superClass_.disposeInternal.call(this)
    };
    k.PcscLiteClient.API.prototype.messageChannelDisposedListener_ = function () {
        this.isDisposed() || (this.logger.info("Message channel was disposed, disposing..."), this.dispose())
    };
    k.PcscLiteClient.API.prototype.postRequest_ = function (a, c, d) {
        if (this.isDisposed()) return e.Promise.reject(Error("The API instance is already disposed"));
        a = (new k.RemoteCallMessage(a, c)).makeRequestPayload();
        return this.requester_.postRequest(a).then(d)
    };
    k.Random = {};
    b.scope.RANDOM_INTEGER_BYTE_COUNT = 6;
    k.Random.randomIntegerNumber = function () {
        var a = new Uint8Array(b.scope.RANDOM_INTEGER_BYTE_COUNT);
        window.crypto.getRandomValues(a);
        var c = 0;
        e.array.forEach(a, function (a) {
            c = 256 * c + a
        });
        return c
    };
    e.events = {};
    b.scope.purify = function (a) {
        return {valueOf: a}.valueOf()
    };
    e.events.BrowserFeature = {
        HAS_W3C_BUTTON: !e.userAgent.IE || e.userAgent.isDocumentModeOrHigher(9),
        HAS_W3C_EVENT_SUPPORT: !e.userAgent.IE || e.userAgent.isDocumentModeOrHigher(9),
        SET_KEY_CODE_TO_PREVENT_DEFAULT: e.userAgent.IE && !e.userAgent.isVersionOrHigher("9"),
        HAS_NAVIGATOR_ONLINE_PROPERTY: !e.userAgent.WEBKIT || e.userAgent.isVersionOrHigher("528"),
        HAS_HTML5_NETWORK_EVENT_SUPPORT: e.userAgent.GECKO && e.userAgent.isVersionOrHigher("1.9b") || e.userAgent.IE && e.userAgent.isVersionOrHigher("8") || e.userAgent.OPERA &&
            e.userAgent.isVersionOrHigher("9.5") || e.userAgent.WEBKIT && e.userAgent.isVersionOrHigher("528"),
        HTML5_NETWORK_EVENTS_FIRE_ON_BODY: e.userAgent.GECKO && !e.userAgent.isVersionOrHigher("8") || e.userAgent.IE && !e.userAgent.isVersionOrHigher("9"),
        TOUCH_ENABLED: "ontouchstart" in e.global || !!(e.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!e.global.navigator || !e.global.navigator.maxTouchPoints && !e.global.navigator.msMaxTouchPoints),
        POINTER_EVENTS: "PointerEvent" in e.global,
        MSPOINTER_EVENTS: "MSPointerEvent" in e.global && !(!e.global.navigator || !e.global.navigator.msPointerEnabled),
        PASSIVE_EVENTS: (0, b.scope.purify)(function () {
            if (!e.global.addEventListener || !Object.defineProperty) return !1;
            var a = !1, c = Object.defineProperty({}, "passive", {
                get: function () {
                    a = !0
                }
            });
            try {
                e.global.addEventListener("test", e.nullFunction, c), e.global.removeEventListener("test", e.nullFunction, c)
            } catch (d) {
            }
            return a
        })
    };
    e.events.EventId = function (a) {
        this.id = a
    };
    e.events.EventId.prototype.toString = function () {
        return this.id
    };
    e.events.Event = function (a, c) {
        this.type = a instanceof e.events.EventId ? String(a) : a;
        this.currentTarget = this.target = c;
        this.defaultPrevented = this.propagationStopped_ = !1;
        this.returnValue_ = !0
    };
    e.events.Event.prototype.stopPropagation = function () {
        this.propagationStopped_ = !0
    };
    e.events.Event.prototype.preventDefault = function () {
        this.defaultPrevented = !0;
        this.returnValue_ = !1
    };
    e.events.Event.stopPropagation = function (a) {
        a.stopPropagation()
    };
    e.events.Event.preventDefault = function (a) {
        a.preventDefault()
    };
    e.events.getVendorPrefixedName_ = function (a) {
        return e.userAgent.WEBKIT ? "webkit" + a : e.userAgent.OPERA ? "o" + a.toLowerCase() : a.toLowerCase()
    };
    e.events.EventType = {
        CLICK: "click",
        RIGHTCLICK: "rightclick",
        DBLCLICK: "dblclick",
        AUXCLICK: "auxclick",
        MOUSEDOWN: "mousedown",
        MOUSEUP: "mouseup",
        MOUSEOVER: "mouseover",
        MOUSEOUT: "mouseout",
        MOUSEMOVE: "mousemove",
        MOUSEENTER: "mouseenter",
        MOUSELEAVE: "mouseleave",
        MOUSECANCEL: "mousecancel",
        SELECTIONCHANGE: "selectionchange",
        SELECTSTART: "selectstart",
        WHEEL: "wheel",
        KEYPRESS: "keypress",
        KEYDOWN: "keydown",
        KEYUP: "keyup",
        BLUR: "blur",
        FOCUS: "focus",
        DEACTIVATE: "deactivate",
        FOCUSIN: "focusin",
        FOCUSOUT: "focusout",
        CHANGE: "change",
        RESET: "reset",
        SELECT: "select",
        SUBMIT: "submit",
        INPUT: "input",
        PROPERTYCHANGE: "propertychange",
        DRAGSTART: "dragstart",
        DRAG: "drag",
        DRAGENTER: "dragenter",
        DRAGOVER: "dragover",
        DRAGLEAVE: "dragleave",
        DROP: "drop",
        DRAGEND: "dragend",
        TOUCHSTART: "touchstart",
        TOUCHMOVE: "touchmove",
        TOUCHEND: "touchend",
        TOUCHCANCEL: "touchcancel",
        BEFOREUNLOAD: "beforeunload",
        CONSOLEMESSAGE: "consolemessage",
        CONTEXTMENU: "contextmenu",
        DEVICECHANGE: "devicechange",
        DEVICEMOTION: "devicemotion",
        DEVICEORIENTATION: "deviceorientation",
        DOMCONTENTLOADED: "DOMContentLoaded",
        ERROR: "error",
        HELP: "help",
        LOAD: "load",
        LOSECAPTURE: "losecapture",
        ORIENTATIONCHANGE: "orientationchange",
        READYSTATECHANGE: "readystatechange",
        RESIZE: "resize",
        SCROLL: "scroll",
        UNLOAD: "unload",
        CANPLAY: "canplay",
        CANPLAYTHROUGH: "canplaythrough",
        DURATIONCHANGE: "durationchange",
        EMPTIED: "emptied",
        ENDED: "ended",
        LOADEDDATA: "loadeddata",
        LOADEDMETADATA: "loadedmetadata",
        PAUSE: "pause",
        PLAY: "play",
        PLAYING: "playing",
        PROGRESS: "progress",
        RATECHANGE: "ratechange",
        SEEKED: "seeked",
        SEEKING: "seeking",
        STALLED: "stalled",
        SUSPEND: "suspend",
        TIMEUPDATE: "timeupdate",
        VOLUMECHANGE: "volumechange",
        WAITING: "waiting",
        SOURCEOPEN: "sourceopen",
        SOURCEENDED: "sourceended",
        SOURCECLOSED: "sourceclosed",
        ABORT: "abort",
        UPDATE: "update",
        UPDATESTART: "updatestart",
        UPDATEEND: "updateend",
        HASHCHANGE: "hashchange",
        PAGEHIDE: "pagehide",
        PAGESHOW: "pageshow",
        POPSTATE: "popstate",
        COPY: "copy",
        PASTE: "paste",
        CUT: "cut",
        BEFORECOPY: "beforecopy",
        BEFORECUT: "beforecut",
        BEFOREPASTE: "beforepaste",
        ONLINE: "online",
        OFFLINE: "offline",
        MESSAGE: "message",
        CONNECT: "connect",
        INSTALL: "install",
        ACTIVATE: "activate",
        FETCH: "fetch",
        FOREIGNFETCH: "foreignfetch",
        MESSAGEERROR: "messageerror",
        STATECHANGE: "statechange",
        UPDATEFOUND: "updatefound",
        CONTROLLERCHANGE: "controllerchange",
        ANIMATIONSTART: e.events.getVendorPrefixedName_("AnimationStart"),
        ANIMATIONEND: e.events.getVendorPrefixedName_("AnimationEnd"),
        ANIMATIONITERATION: e.events.getVendorPrefixedName_("AnimationIteration"),
        TRANSITIONEND: e.events.getVendorPrefixedName_("TransitionEnd"),
        POINTERDOWN: "pointerdown",
        POINTERUP: "pointerup",
        POINTERCANCEL: "pointercancel",
        POINTERMOVE: "pointermove",
        POINTEROVER: "pointerover",
        POINTEROUT: "pointerout",
        POINTERENTER: "pointerenter",
        POINTERLEAVE: "pointerleave",
        GOTPOINTERCAPTURE: "gotpointercapture",
        LOSTPOINTERCAPTURE: "lostpointercapture",
        MSGESTURECHANGE: "MSGestureChange",
        MSGESTUREEND: "MSGestureEnd",
        MSGESTUREHOLD: "MSGestureHold",
        MSGESTURESTART: "MSGestureStart",
        MSGESTURETAP: "MSGestureTap",
        MSGOTPOINTERCAPTURE: "MSGotPointerCapture",
        MSINERTIASTART: "MSInertiaStart",
        MSLOSTPOINTERCAPTURE: "MSLostPointerCapture",
        MSPOINTERCANCEL: "MSPointerCancel",
        MSPOINTERDOWN: "MSPointerDown",
        MSPOINTERENTER: "MSPointerEnter",
        MSPOINTERHOVER: "MSPointerHover",
        MSPOINTERLEAVE: "MSPointerLeave",
        MSPOINTERMOVE: "MSPointerMove",
        MSPOINTEROUT: "MSPointerOut",
        MSPOINTEROVER: "MSPointerOver",
        MSPOINTERUP: "MSPointerUp",
        TEXT: "text",
        TEXTINPUT: e.userAgent.IE ? "textinput" : "textInput",
        COMPOSITIONSTART: "compositionstart",
        COMPOSITIONUPDATE: "compositionupdate",
        COMPOSITIONEND: "compositionend",
        BEFOREINPUT: "beforeinput",
        EXIT: "exit",
        LOADABORT: "loadabort",
        LOADCOMMIT: "loadcommit",
        LOADREDIRECT: "loadredirect",
        LOADSTART: "loadstart",
        LOADSTOP: "loadstop",
        RESPONSIVE: "responsive",
        SIZECHANGED: "sizechanged",
        UNRESPONSIVE: "unresponsive",
        VISIBILITYCHANGE: "visibilitychange",
        STORAGE: "storage",
        DOMSUBTREEMODIFIED: "DOMSubtreeModified",
        DOMNODEINSERTED: "DOMNodeInserted",
        DOMNODEREMOVED: "DOMNodeRemoved",
        DOMNODEREMOVEDFROMDOCUMENT: "DOMNodeRemovedFromDocument",
        DOMNODEINSERTEDINTODOCUMENT: "DOMNodeInsertedIntoDocument",
        DOMATTRMODIFIED: "DOMAttrModified",
        DOMCHARACTERDATAMODIFIED: "DOMCharacterDataModified",
        BEFOREPRINT: "beforeprint",
        AFTERPRINT: "afterprint",
        BEFOREINSTALLPROMPT: "beforeinstallprompt",
        APPINSTALLED: "appinstalled"
    };
    e.events.getPointerFallbackEventName_ = function (a, c, d) {
        return e.events.BrowserFeature.POINTER_EVENTS ? a : e.events.BrowserFeature.MSPOINTER_EVENTS ? c : d
    };
    e.events.PointerFallbackEventType = {
        POINTERDOWN: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERDOWN, e.events.EventType.MSPOINTERDOWN, e.events.EventType.MOUSEDOWN),
        POINTERUP: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERUP, e.events.EventType.MSPOINTERUP, e.events.EventType.MOUSEUP),
        POINTERCANCEL: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERCANCEL, e.events.EventType.MSPOINTERCANCEL, e.events.EventType.MOUSECANCEL),
        POINTERMOVE: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERMOVE,
            e.events.EventType.MSPOINTERMOVE, e.events.EventType.MOUSEMOVE),
        POINTEROVER: e.events.getPointerFallbackEventName_(e.events.EventType.POINTEROVER, e.events.EventType.MSPOINTEROVER, e.events.EventType.MOUSEOVER),
        POINTEROUT: e.events.getPointerFallbackEventName_(e.events.EventType.POINTEROUT, e.events.EventType.MSPOINTEROUT, e.events.EventType.MOUSEOUT),
        POINTERENTER: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERENTER, e.events.EventType.MSPOINTERENTER, e.events.EventType.MOUSEENTER),
        POINTERLEAVE: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERLEAVE,
            e.events.EventType.MSPOINTERLEAVE, e.events.EventType.MOUSELEAVE)
    };
    e.events.PointerTouchFallbackEventType = {
        POINTERDOWN: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERDOWN, e.events.EventType.MSPOINTERDOWN, e.events.EventType.TOUCHSTART),
        POINTERUP: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERUP, e.events.EventType.MSPOINTERUP, e.events.EventType.TOUCHEND),
        POINTERCANCEL: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERCANCEL, e.events.EventType.MSPOINTERCANCEL, e.events.EventType.TOUCHCANCEL),
        POINTERMOVE: e.events.getPointerFallbackEventName_(e.events.EventType.POINTERMOVE,
            e.events.EventType.MSPOINTERMOVE, e.events.EventType.TOUCHMOVE)
    };
    e.events.PointerAsMouseEventType = {
        MOUSEDOWN: e.events.PointerFallbackEventType.POINTERDOWN,
        MOUSEUP: e.events.PointerFallbackEventType.POINTERUP,
        MOUSECANCEL: e.events.PointerFallbackEventType.POINTERCANCEL,
        MOUSEMOVE: e.events.PointerFallbackEventType.POINTERMOVE,
        MOUSEOVER: e.events.PointerFallbackEventType.POINTEROVER,
        MOUSEOUT: e.events.PointerFallbackEventType.POINTEROUT,
        MOUSEENTER: e.events.PointerFallbackEventType.POINTERENTER,
        MOUSELEAVE: e.events.PointerFallbackEventType.POINTERLEAVE
    };
    e.events.MouseAsMouseEventType = {
        MOUSEDOWN: e.events.EventType.MOUSEDOWN,
        MOUSEUP: e.events.EventType.MOUSEUP,
        MOUSECANCEL: e.events.EventType.MOUSECANCEL,
        MOUSEMOVE: e.events.EventType.MOUSEMOVE,
        MOUSEOVER: e.events.EventType.MOUSEOVER,
        MOUSEOUT: e.events.EventType.MOUSEOUT,
        MOUSEENTER: e.events.EventType.MOUSEENTER,
        MOUSELEAVE: e.events.EventType.MOUSELEAVE
    };
    e.events.PointerAsTouchEventType = {
        TOUCHCANCEL: e.events.PointerTouchFallbackEventType.POINTERCANCEL,
        TOUCHEND: e.events.PointerTouchFallbackEventType.POINTERUP,
        TOUCHMOVE: e.events.PointerTouchFallbackEventType.POINTERMOVE,
        TOUCHSTART: e.events.PointerTouchFallbackEventType.POINTERDOWN
    };
    e.events.USE_LAYER_XY_AS_OFFSET_XY = !1;
    e.events.BrowserEvent = function (a, c) {
        e.events.Event.call(this, a ? a.type : "");
        this.relatedTarget = this.currentTarget = this.target = null;
        this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
        this.key = "";
        this.charCode = this.keyCode = 0;
        this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
        this.state = null;
        this.platformModifierKey = !1;
        this.pointerId = 0;
        this.pointerType = "";
        this.event_ = null;
        a && this.init(a, c)
    };
    e.inherits(e.events.BrowserEvent, e.events.Event);
    e.events.BrowserEvent.MouseButton = {LEFT: 0, MIDDLE: 1, RIGHT: 2};
    e.events.BrowserEvent.PointerType = {MOUSE: "mouse", PEN: "pen", TOUCH: "touch"};
    e.events.BrowserEvent.IEButtonMap = e.debug.freeze([1, 4, 2]);
    e.events.BrowserEvent.IE_BUTTON_MAP = e.events.BrowserEvent.IEButtonMap;
    e.events.BrowserEvent.IE_POINTER_TYPE_MAP = e.debug.freeze({
        2: e.events.BrowserEvent.PointerType.TOUCH,
        3: e.events.BrowserEvent.PointerType.PEN,
        4: e.events.BrowserEvent.PointerType.MOUSE
    });
    e.events.BrowserEvent.prototype.init = function (a, c) {
        var d = this.type = a.type, f = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
        this.target = a.target || a.srcElement;
        this.currentTarget = c;
        (c = a.relatedTarget) ? e.userAgent.GECKO && (e.reflect.canAccessProperty(c, "nodeName") || (c = null)) : d == e.events.EventType.MOUSEOVER ? c = a.fromElement : d == e.events.EventType.MOUSEOUT && (c = a.toElement);
        this.relatedTarget = c;
        f ? (this.clientX = void 0 !== f.clientX ? f.clientX : f.pageX, this.clientY = void 0 !== f.clientY ? f.clientY :
            f.pageY, this.screenX = f.screenX || 0, this.screenY = f.screenY || 0) : (e.events.USE_LAYER_XY_AS_OFFSET_XY ? (this.offsetX = void 0 !== a.layerX ? a.layerX : a.offsetX, this.offsetY = void 0 !== a.layerY ? a.layerY : a.offsetY) : (this.offsetX = e.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = e.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY), this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
        this.button =
            a.button;
        this.keyCode = a.keyCode || 0;
        this.key = a.key || "";
        this.charCode = a.charCode || ("keypress" == d ? a.keyCode : 0);
        this.ctrlKey = a.ctrlKey;
        this.altKey = a.altKey;
        this.shiftKey = a.shiftKey;
        this.metaKey = a.metaKey;
        this.platformModifierKey = e.userAgent.MAC ? a.metaKey : a.ctrlKey;
        this.pointerId = a.pointerId || 0;
        this.pointerType = e.events.BrowserEvent.getPointerType_(a);
        this.state = a.state;
        this.event_ = a;
        a.defaultPrevented && this.preventDefault()
    };
    e.events.BrowserEvent.prototype.isButton = function (a) {
        return e.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == e.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & e.events.BrowserEvent.IE_BUTTON_MAP[a])
    };
    e.events.BrowserEvent.prototype.isMouseActionButton = function () {
        return this.isButton(e.events.BrowserEvent.MouseButton.LEFT) && !(e.userAgent.WEBKIT && e.userAgent.MAC && this.ctrlKey)
    };
    e.events.BrowserEvent.prototype.stopPropagation = function () {
        e.events.BrowserEvent.superClass_.stopPropagation.call(this);
        this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
    };
    e.events.BrowserEvent.prototype.preventDefault = function () {
        e.events.BrowserEvent.superClass_.preventDefault.call(this);
        var a = this.event_;
        if (a.preventDefault) a.preventDefault(); else if (a.returnValue = !1, e.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) try {
            if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1
        } catch (c) {
        }
    };
    e.events.BrowserEvent.prototype.getBrowserEvent = function () {
        return this.event_
    };
    e.events.BrowserEvent.getPointerType_ = function (a) {
        return "string" === typeof a.pointerType ? a.pointerType : e.events.BrowserEvent.IE_POINTER_TYPE_MAP[a.pointerType] || ""
    };
    e.events.Listenable = function () {
    };
    e.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
    e.events.Listenable.addImplementation = function (a) {
        a.prototype[e.events.Listenable.IMPLEMENTED_BY_PROP] = !0
    };
    e.events.Listenable.isImplementedBy = function (a) {
        return !(!a || !a[e.events.Listenable.IMPLEMENTED_BY_PROP])
    };
    e.events.ListenableKey = function () {
    };
    e.events.ListenableKey.counter_ = 0;
    e.events.ListenableKey.reserveKey = function () {
        return ++e.events.ListenableKey.counter_
    };
    e.events.Listener = function (a, c, d, f, g, h) {
        e.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack);
        this.listener = a;
        this.proxy = c;
        this.src = d;
        this.type = f;
        this.capture = !!g;
        this.handler = h;
        this.key = e.events.ListenableKey.reserveKey();
        this.removed = this.callOnce = !1
    };
    e.events.Listener.ENABLE_MONITORING = !1;
    e.events.Listener.prototype.markAsRemoved = function () {
        this.removed = !0;
        this.handler = this.src = this.proxy = this.listener = null
    };
    e.events.ListenerMap = function (a) {
        this.src = a;
        this.listeners = {};
        this.typeCount_ = 0
    };
    e.events.ListenerMap.prototype.getTypeCount = function () {
        return this.typeCount_
    };
    e.events.ListenerMap.prototype.getListenerCount = function () {
        var a = 0, c;
        for (c in this.listeners) a += this.listeners[c].length;
        return a
    };
    e.events.ListenerMap.prototype.add = function (a, c, d, f, g) {
        var h = a.toString();
        a = this.listeners[h];
        a || (a = this.listeners[h] = [], this.typeCount_++);
        var l = e.events.ListenerMap.findListenerIndex_(a, c, f, g);
        -1 < l ? (c = a[l], d || (c.callOnce = !1)) : (c = new e.events.Listener(c, null, this.src, h, !!f, g), c.callOnce = d, a.push(c));
        return c
    };
    e.events.ListenerMap.prototype.remove = function (a, c, d, f) {
        a = a.toString();
        if (!(a in this.listeners)) return !1;
        var g = this.listeners[a];
        c = e.events.ListenerMap.findListenerIndex_(g, c, d, f);
        return -1 < c ? (g[c].markAsRemoved(), e.array.removeAt(g, c), 0 == g.length && (delete this.listeners[a], this.typeCount_--), !0) : !1
    };
    e.events.ListenerMap.prototype.removeByKey = function (a) {
        var c = a.type;
        if (!(c in this.listeners)) return !1;
        var d = e.array.remove(this.listeners[c], a);
        d && (a.markAsRemoved(), 0 == this.listeners[c].length && (delete this.listeners[c], this.typeCount_--));
        return d
    };
    e.events.ListenerMap.prototype.removeAll = function (a) {
        a = a && a.toString();
        var c = 0, d;
        for (d in this.listeners) if (!a || d == a) {
            for (var f = this.listeners[d], g = 0; g < f.length; g++) ++c, f[g].markAsRemoved();
            delete this.listeners[d];
            this.typeCount_--
        }
        return c
    };
    e.events.ListenerMap.prototype.getListeners = function (a, c) {
        a = this.listeners[a.toString()];
        var d = [];
        if (a) for (var f = 0; f < a.length; ++f) {
            var g = a[f];
            g.capture == c && d.push(g)
        }
        return d
    };
    e.events.ListenerMap.prototype.getListener = function (a, c, d, f) {
        a = this.listeners[a.toString()];
        var g = -1;
        a && (g = e.events.ListenerMap.findListenerIndex_(a, c, d, f));
        return -1 < g ? a[g] : null
    };
    e.events.ListenerMap.prototype.hasListener = function (a, c) {
        var d = void 0 !== a, f = d ? a.toString() : "", g = void 0 !== c;
        return e.object.some(this.listeners, function (a) {
            for (var h = 0; h < a.length; ++h) if (!(d && a[h].type != f || g && a[h].capture != c)) return !0;
            return !1
        })
    };
    e.events.ListenerMap.findListenerIndex_ = function (a, c, d, f) {
        for (var g = 0; g < a.length; ++g) {
            var h = a[g];
            if (!h.removed && h.listener == c && h.capture == !!d && h.handler == f) return g
        }
        return -1
    };
    e.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1E6 * Math.random() | 0);
    e.events.onString_ = "on";
    e.events.onStringMap_ = {};
    e.events.CaptureSimulationMode = {OFF_AND_FAIL: 0, OFF_AND_SILENT: 1, ON: 2};
    e.events.CAPTURE_SIMULATION_MODE = 2;
    e.events.listenerCountEstimate_ = 0;
    e.events.listen = function (a, c, d, f, g) {
        if (f && f.once) return e.events.listenOnce(a, c, d, f, g);
        if (e.isArray(c)) {
            for (var h = 0; h < c.length; h++) e.events.listen(a, c[h], d, f, g);
            return null
        }
        d = e.events.wrapListener(d);
        return e.events.Listenable.isImplementedBy(a) ? (f = e.isObject(f) ? !!f.capture : !!f, a.listen(c, d, f, g)) : e.events.listen_(a, c, d, !1, f, g)
    };
    e.events.listen_ = function (a, c, d, f, g, h) {
        if (!c) throw Error("Invalid event type");
        var l = e.isObject(g) ? !!g.capture : !!g;
        if (l && !e.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
            if (e.events.CAPTURE_SIMULATION_MODE == e.events.CaptureSimulationMode.OFF_AND_FAIL) return e.asserts.fail("Can not register capture listener in IE8-."), null;
            if (e.events.CAPTURE_SIMULATION_MODE == e.events.CaptureSimulationMode.OFF_AND_SILENT) return null
        }
        var m = e.events.getListenerMap_(a);
        m || (a[e.events.LISTENER_MAP_PROP_] = m = new e.events.ListenerMap(a));
        d = m.add(c, d, f, l, h);
        if (d.proxy) return d;
        f = e.events.getProxy();
        d.proxy = f;
        f.src = a;
        f.listener = d;
        if (a.addEventListener) e.events.BrowserFeature.PASSIVE_EVENTS || (g = l), void 0 === g && (g = !1), a.addEventListener(c.toString(), f, g); else if (a.attachEvent) a.attachEvent(e.events.getOnString_(c.toString()), f); else if (a.addListener && a.removeListener) e.asserts.assert("change" === c, "MediaQueryList only has a change event"), a.addListener(f); else throw Error("addEventListener and attachEvent are unavailable.");
        e.events.listenerCountEstimate_++;
        return d
    };
    e.events.getProxy = function () {
        var a = e.events.handleBrowserEvent_, c = e.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function (d) {
            return a.call(c.src, c.listener, d)
        } : function (d) {
            d = a.call(c.src, c.listener, d);
            if (!d) return d
        };
        return c
    };
    e.events.listenOnce = function (a, c, d, f, g) {
        if (e.isArray(c)) {
            for (var h = 0; h < c.length; h++) e.events.listenOnce(a, c[h], d, f, g);
            return null
        }
        d = e.events.wrapListener(d);
        return e.events.Listenable.isImplementedBy(a) ? (f = e.isObject(f) ? !!f.capture : !!f, a.listenOnce(c, d, f, g)) : e.events.listen_(a, c, d, !0, f, g)
    };
    e.events.listenWithWrapper = function (a, c, d, f, g) {
        c.listen(a, d, f, g)
    };
    e.events.unlisten = function (a, c, d, f, g) {
        if (e.isArray(c)) {
            for (var h = 0; h < c.length; h++) e.events.unlisten(a, c[h], d, f, g);
            return null
        }
        f = e.isObject(f) ? !!f.capture : !!f;
        d = e.events.wrapListener(d);
        if (e.events.Listenable.isImplementedBy(a)) return a.unlisten(c, d, f, g);
        if (!a) return !1;
        if (a = e.events.getListenerMap_(a)) if (c = a.getListener(c, d, f, g)) return e.events.unlistenByKey(c);
        return !1
    };
    e.events.unlistenByKey = function (a) {
        if ("number" === typeof a || !a || a.removed) return !1;
        var c = a.src;
        if (e.events.Listenable.isImplementedBy(c)) return c.unlistenByKey(a);
        var d = a.type, f = a.proxy;
        c.removeEventListener ? c.removeEventListener(d, f, a.capture) : c.detachEvent ? c.detachEvent(e.events.getOnString_(d), f) : c.addListener && c.removeListener && c.removeListener(f);
        e.events.listenerCountEstimate_--;
        (d = e.events.getListenerMap_(c)) ? (d.removeByKey(a), 0 == d.getTypeCount() && (d.src = null, c[e.events.LISTENER_MAP_PROP_] =
            null)) : a.markAsRemoved();
        return !0
    };
    e.events.unlistenWithWrapper = function (a, c, d, f, g) {
        c.unlisten(a, d, f, g)
    };
    e.events.removeAll = function (a, c) {
        if (!a) return 0;
        if (e.events.Listenable.isImplementedBy(a)) return a.removeAllListeners(c);
        a = e.events.getListenerMap_(a);
        if (!a) return 0;
        var d = 0;
        c = c && c.toString();
        for (var f in a.listeners) if (!c || f == c) for (var g = a.listeners[f].concat(), h = 0; h < g.length; ++h) e.events.unlistenByKey(g[h]) && ++d;
        return d
    };
    e.events.getListeners = function (a, c, d) {
        return e.events.Listenable.isImplementedBy(a) ? a.getListeners(c, d) : a ? (a = e.events.getListenerMap_(a)) ? a.getListeners(c, d) : [] : []
    };
    e.events.getListener = function (a, c, d, f, g) {
        d = e.events.wrapListener(d);
        f = !!f;
        return e.events.Listenable.isImplementedBy(a) ? a.getListener(c, d, f, g) : a ? (a = e.events.getListenerMap_(a)) ? a.getListener(c, d, f, g) : null : null
    };
    e.events.hasListener = function (a, c, d) {
        if (e.events.Listenable.isImplementedBy(a)) return a.hasListener(c, d);
        a = e.events.getListenerMap_(a);
        return !!a && a.hasListener(c, d)
    };
    e.events.expose = function (a) {
        var c = [], d;
        for (d in a) a[d] && a[d].id ? c.push(d + " = " + a[d] + " (" + a[d].id + ")") : c.push(d + " = " + a[d]);
        return c.join("\n")
    };
    e.events.getOnString_ = function (a) {
        return a in e.events.onStringMap_ ? e.events.onStringMap_[a] : e.events.onStringMap_[a] = e.events.onString_ + a
    };
    e.events.fireListeners = function (a, c, d, f) {
        return e.events.Listenable.isImplementedBy(a) ? a.fireListeners(c, d, f) : e.events.fireListeners_(a, c, d, f)
    };
    e.events.fireListeners_ = function (a, c, d, f) {
        var g = !0;
        if (a = e.events.getListenerMap_(a)) if (c = a.listeners[c.toString()]) for (c = c.concat(), a = 0; a < c.length; a++) {
            var h = c[a];
            h && h.capture == d && !h.removed && (h = e.events.fireListener(h, f), g = g && !1 !== h)
        }
        return g
    };
    e.events.fireListener = function (a, c) {
        var d = a.listener, f = a.handler || a.src;
        a.callOnce && e.events.unlistenByKey(a);
        return d.call(f, c)
    };
    e.events.getTotalListenerCount = function () {
        return e.events.listenerCountEstimate_
    };
    e.events.dispatchEvent = function (a, c) {
        e.asserts.assert(e.events.Listenable.isImplementedBy(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
        return a.dispatchEvent(c)
    };
    e.events.protectBrowserEventEntryPoint = function (a) {
        e.events.handleBrowserEvent_ = a.protectEntryPoint(e.events.handleBrowserEvent_)
    };
    e.events.handleBrowserEvent_ = function (a, c) {
        if (a.removed) return !0;
        if (!e.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
            var d = c || e.getObjectByName("window.event");
            c = new e.events.BrowserEvent(d, this);
            var f = !0;
            if (e.events.CAPTURE_SIMULATION_MODE == e.events.CaptureSimulationMode.ON) {
                if (!e.events.isMarkedIeEvent_(d)) {
                    e.events.markIeEvent_(d);
                    d = [];
                    for (var g = c.currentTarget; g; g = g.parentNode) d.push(g);
                    a = a.type;
                    for (g = d.length - 1; !c.propagationStopped_ && 0 <= g; g--) {
                        c.currentTarget = d[g];
                        var h = e.events.fireListeners_(d[g],
                            a, !0, c);
                        f = f && h
                    }
                    for (g = 0; !c.propagationStopped_ && g < d.length; g++) c.currentTarget = d[g], h = e.events.fireListeners_(d[g], a, !1, c), f = f && h
                }
            } else f = e.events.fireListener(a, c);
            return f
        }
        return e.events.fireListener(a, new e.events.BrowserEvent(c, this))
    };
    e.events.markIeEvent_ = function (a) {
        var c = !1;
        if (0 == a.keyCode) try {
            a.keyCode = -1;
            return
        } catch (d) {
            c = !0
        }
        if (c || void 0 == a.returnValue) a.returnValue = !0
    };
    e.events.isMarkedIeEvent_ = function (a) {
        return 0 > a.keyCode || void 0 != a.returnValue
    };
    e.events.uniqueIdCounter_ = 0;
    e.events.getUniqueId = function (a) {
        return a + "_" + e.events.uniqueIdCounter_++
    };
    e.events.getListenerMap_ = function (a) {
        a = a[e.events.LISTENER_MAP_PROP_];
        return a instanceof e.events.ListenerMap ? a : null
    };
    e.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
    e.events.wrapListener = function (a) {
        e.asserts.assert(a, "Listener can not be null.");
        if (e.isFunction(a)) return a;
        e.asserts.assert(a.handleEvent, "An object listener must have handleEvent method.");
        a[e.events.LISTENER_WRAPPER_PROP_] || (a[e.events.LISTENER_WRAPPER_PROP_] = function (c) {
            return a.handleEvent(c)
        });
        return a[e.events.LISTENER_WRAPPER_PROP_]
    };
    e.debug.entryPointRegistry.register(function (a) {
        e.events.handleBrowserEvent_ = a(e.events.handleBrowserEvent_)
    });
    e.events.EventTarget = function () {
        e.Disposable.call(this);
        this.eventTargetListeners_ = new e.events.ListenerMap(this);
        this.actualEventTarget_ = this;
        this.parentEventTarget_ = null
    };
    e.inherits(e.events.EventTarget, e.Disposable);
    e.events.Listenable.addImplementation(e.events.EventTarget);
    e.events.EventTarget.MAX_ANCESTORS_ = 1E3;
    e.events.EventTarget.prototype.getParentEventTarget = function () {
        return this.parentEventTarget_
    };
    e.events.EventTarget.prototype.setParentEventTarget = function (a) {
        this.parentEventTarget_ = a
    };
    e.events.EventTarget.prototype.addEventListener = function (a, c, d, f) {
        e.events.listen(this, a, c, d, f)
    };
    e.events.EventTarget.prototype.removeEventListener = function (a, c, d, f) {
        e.events.unlisten(this, a, c, d, f)
    };
    e.events.EventTarget.prototype.dispatchEvent = function (a) {
        this.assertInitialized_();
        var c = this.getParentEventTarget();
        if (c) {
            var d = [];
            for (var f = 1; c; c = c.getParentEventTarget()) d.push(c), e.asserts.assert(++f < e.events.EventTarget.MAX_ANCESTORS_, "infinite loop")
        }
        return e.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, a, d)
    };
    e.events.EventTarget.prototype.disposeInternal = function () {
        e.events.EventTarget.superClass_.disposeInternal.call(this);
        this.removeAllListeners();
        this.parentEventTarget_ = null
    };
    e.events.EventTarget.prototype.listen = function (a, c, d, f) {
        this.assertInitialized_();
        return this.eventTargetListeners_.add(String(a), c, !1, d, f)
    };
    e.events.EventTarget.prototype.listenOnce = function (a, c, d, f) {
        return this.eventTargetListeners_.add(String(a), c, !0, d, f)
    };
    e.events.EventTarget.prototype.unlisten = function (a, c, d, f) {
        return this.eventTargetListeners_.remove(String(a), c, d, f)
    };
    e.events.EventTarget.prototype.unlistenByKey = function (a) {
        return this.eventTargetListeners_.removeByKey(a)
    };
    e.events.EventTarget.prototype.removeAllListeners = function (a) {
        return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(a) : 0
    };
    e.events.EventTarget.prototype.fireListeners = function (a, c, d) {
        a = this.eventTargetListeners_.listeners[String(a)];
        if (!a) return !0;
        a = a.concat();
        for (var f = !0, g = 0; g < a.length; ++g) {
            var h = a[g];
            if (h && !h.removed && h.capture == c) {
                var l = h.listener, m = h.handler || h.src;
                h.callOnce && this.unlistenByKey(h);
                f = !1 !== l.call(m, d) && f
            }
        }
        return f && 0 != d.returnValue_
    };
    e.events.EventTarget.prototype.getListeners = function (a, c) {
        return this.eventTargetListeners_.getListeners(String(a), c)
    };
    e.events.EventTarget.prototype.getListener = function (a, c, d, f) {
        return this.eventTargetListeners_.getListener(String(a), c, d, f)
    };
    e.events.EventTarget.prototype.hasListener = function (a, c) {
        return this.eventTargetListeners_.hasListener(void 0 !== a ? String(a) : void 0, c)
    };
    e.events.EventTarget.prototype.setTargetForTesting = function (a) {
        this.actualEventTarget_ = a
    };
    e.events.EventTarget.prototype.assertInitialized_ = function () {
        e.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")
    };
    e.events.EventTarget.dispatchEventInternal_ = function (a, c, d) {
        var f = c.type || c;
        if ("string" === typeof c) c = new e.events.Event(c, a); else if (c instanceof e.events.Event) c.target = c.target || a; else {
            var g = c;
            c = new e.events.Event(f, a);
            e.object.extend(c, g)
        }
        g = !0;
        if (d) for (var h = d.length - 1; !c.propagationStopped_ && 0 <= h; h--) {
            var l = c.currentTarget = d[h];
            g = l.fireListeners(f, !0, c) && g
        }
        c.propagationStopped_ || (l = c.currentTarget = a, g = l.fireListeners(f, !0, c) && g, c.propagationStopped_ || (g = l.fireListeners(f, !1, c) && g));
        if (d) for (h =
                        0; !c.propagationStopped_ && h < d.length; h++) l = c.currentTarget = d[h], g = l.fireListeners(f, !1, c) && g;
        return g
    };
    e.Timer = function (a, c) {
        e.events.EventTarget.call(this);
        this.interval_ = a || 1;
        this.timerObject_ = c || e.Timer.defaultTimerObject;
        this.boundTick_ = e.bind(this.tick_, this);
        this.last_ = e.now()
    };
    e.inherits(e.Timer, e.events.EventTarget);
    e.Timer.MAX_TIMEOUT_ = 2147483647;
    e.Timer.INVALID_TIMEOUT_ID_ = -1;
    e.Timer.prototype.enabled = !1;
    e.Timer.defaultTimerObject = e.global;
    e.Timer.intervalScale = .8;
    e.Timer.prototype.timer_ = null;
    e.Timer.prototype.getInterval = function () {
        return this.interval_
    };
    e.Timer.prototype.setInterval = function (a) {
        this.interval_ = a;
        this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop()
    };
    e.Timer.prototype.tick_ = function () {
        if (this.enabled) {
            var a = e.now() - this.last_;
            0 < a && a < this.interval_ * e.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - a) : (this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null), this.dispatchTick(), this.enabled && (this.stop(), this.start()))
        }
    };
    e.Timer.prototype.dispatchTick = function () {
        this.dispatchEvent(e.Timer.TICK)
    };
    e.Timer.prototype.start = function () {
        this.enabled = !0;
        this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = e.now())
    };
    e.Timer.prototype.stop = function () {
        this.enabled = !1;
        this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null)
    };
    e.Timer.prototype.disposeInternal = function () {
        e.Timer.superClass_.disposeInternal.call(this);
        this.stop();
        delete this.timerObject_
    };
    e.Timer.TICK = "tick";
    e.Timer.callOnce = function (a, c, d) {
        if (e.isFunction(a)) d && (a = e.bind(a, d)); else if (a && "function" == typeof a.handleEvent) a = e.bind(a.handleEvent, a); else throw Error("Invalid listener argument");
        return Number(c) > e.Timer.MAX_TIMEOUT_ ? e.Timer.INVALID_TIMEOUT_ID_ : e.Timer.defaultTimerObject.setTimeout(a, c || 0)
    };
    e.Timer.clear = function (a) {
        e.Timer.defaultTimerObject.clearTimeout(a)
    };
    e.Timer.promise = function (a, c) {
        var d = null;
        return (new e.Promise(function (f, g) {
            d = e.Timer.callOnce(function () {
                f(c)
            }, a);
            d == e.Timer.INVALID_TIMEOUT_ID_ && g(Error("Failed to schedule timer."))
        })).thenCatch(function (a) {
            e.Timer.clear(d);
            throw a;
        })
    };
    k.MessageChannelPinging = {};
    b.scope.PINGER_LOGGER_TITLE = "Pinger";
    b.scope.PING_RESPONDER_LOGGER_TITLE = "PingResponder";
    b.scope.CHANNEL_ID_MESSAGE_KEY = "channel_id";
    k.MessageChannelPinging.Pinger = function (a, c, d) {
        e.Disposable.call(this);
        this.logger = k.Logging.getChildLogger(c, b.scope.PINGER_LOGGER_TITLE);
        this.messageChannel_ = a;
        this.messageChannel_.registerService(k.MessageChannelPinging.PingResponder.SERVICE_NAME, this.serviceCallback_.bind(this), !0);
        this.onEstablished_ = void 0 !== d ? d : null;
        this.timeoutTimerId_ = this.previousRemoteEndChannelId_ = null;
        this.scheduleTimeoutTimer_();
        e.async.nextTick(this.postPingMessageAndScheduleNext_, this)
    };
    e.inherits(k.MessageChannelPinging.Pinger, e.Disposable);
    k.MessageChannelPinging.Pinger.TIMEOUT_MILLISECONDS = e.DEBUG ? 2E4 : 6E5;
    k.MessageChannelPinging.Pinger.INTERVAL_MILLISECONDS = e.DEBUG ? 1E3 : 1E4;
    k.MessageChannelPinging.Pinger.SERVICE_NAME = "ping";
    k.MessageChannelPinging.Pinger.createMessageData = function () {
        return {}
    };
    k.MessageChannelPinging.Pinger.prototype.postPingMessage = function () {
        this.isDisposed() || (this.logger.finest("Sending a ping request..."), this.messageChannel_.send(k.MessageChannelPinging.Pinger.SERVICE_NAME, k.MessageChannelPinging.Pinger.createMessageData()))
    };
    k.MessageChannelPinging.Pinger.prototype.disposeInternal = function () {
        this.clearTimeoutTimer_();
        this.messageChannel_ = this.onEstablished_ = null;
        this.logger.fine("Disposed");
        k.MessageChannelPinging.Pinger.superClass_.disposeInternal.call(this)
    };
    k.MessageChannelPinging.Pinger.prototype.serviceCallback_ = function (a) {
        k.Logging.checkWithLogger(this.logger, e.isObject(a));
        e.asserts.assertObject(a);
        this.isDisposed() || (e.object.containsKey(a, b.scope.CHANNEL_ID_MESSAGE_KEY) ? (a = a[b.scope.CHANNEL_ID_MESSAGE_KEY], "number" !== typeof a ? (this.logger.warning("Received pong message has wrong format: channel id is not a number. Disposing..."), this.disposeChannelAndSelf_()) : null === this.previousRemoteEndChannelId_ ? (this.logger.fine("Received the first pong response (remote channel id is " +
            a + "). The message channel is considered established"), this.previousRemoteEndChannelId_ = a, this.onEstablished_ && (this.onEstablished_(), this.onEstablished_ = null)) : this.previousRemoteEndChannelId_ == a ? (this.logger.finest("Received a pong response with the correct channel id, so the remote end considered alive"), this.clearTimeoutTimer_(), this.scheduleTimeoutTimer_()) : (this.logger.warning("Received a pong response with a channel id different from the expected one (expected " + this.previousRemoteEndChannelId_ +
            ", received " + a + "). Disposing..."), this.disposeChannelAndSelf_())) : (this.logger.warning('Received pong message has wrong format: no "' + b.scope.CHANNEL_ID_MESSAGE_KEY + '" field is present. Disposing...'), this.disposeChannelAndSelf_()))
    };
    k.MessageChannelPinging.Pinger.prototype.disposeChannelAndSelf_ = function () {
        this.logger.fine("Disposing the message channel and self");
        this.messageChannel_.dispose();
        this.dispose()
    };
    k.MessageChannelPinging.Pinger.prototype.postPingMessageAndScheduleNext_ = function () {
        this.postPingMessage();
        this.schedulePostingPingMessage_()
    };
    k.MessageChannelPinging.Pinger.prototype.schedulePostingPingMessage_ = function () {
        this.isDisposed() || e.Timer.callOnce(this.postPingMessageAndScheduleNext_, k.MessageChannelPinging.Pinger.INTERVAL_MILLISECONDS, this)
    };
    k.MessageChannelPinging.Pinger.prototype.scheduleTimeoutTimer_ = function () {
        k.Logging.checkWithLogger(this.logger, null === this.timeoutTimerId_);
        this.timeoutTimerId_ = e.Timer.callOnce(this.timeoutCallback_.bind(this), k.MessageChannelPinging.Pinger.TIMEOUT_MILLISECONDS, this)
    };
    k.MessageChannelPinging.Pinger.prototype.clearTimeoutTimer_ = function () {
        null !== this.timeoutTimerId_ && (e.Timer.clear(this.timeoutTimerId_), this.timeoutTimerId_ = null)
    };
    k.MessageChannelPinging.Pinger.prototype.timeoutCallback_ = function () {
        this.isDisposed() || (this.logger.warning("No pong response received in time, the remote end is dead. Disposing..."), this.disposeChannelAndSelf_())
    };
    k.MessageChannelPinging.PingResponder = function (a, c, d) {
        e.Disposable.call(this);
        this.logger = k.Logging.getChildLogger(c, b.scope.PING_RESPONDER_LOGGER_TITLE);
        this.messageChannel_ = a;
        this.messageChannel_.registerService(k.MessageChannelPinging.Pinger.SERVICE_NAME, this.serviceCallback_.bind(this), !0);
        this.onPingReceivedListener_ = d;
        this.logger.fine("Initialized (generated channel id is " + k.MessageChannelPinging.PingResponder.CHANNEL_ID + ")")
    };
    e.inherits(k.MessageChannelPinging.PingResponder, e.Disposable);
    k.MessageChannelPinging.PingResponder.SERVICE_NAME = "pong";
    k.MessageChannelPinging.PingResponder.generateChannelId = function () {
        return k.Random.randomIntegerNumber()
    };
    k.MessageChannelPinging.PingResponder.CHANNEL_ID = k.MessageChannelPinging.PingResponder.generateChannelId();
    k.MessageChannelPinging.PingResponder.createMessageData = function (a) {
        return e.object.create(b.scope.CHANNEL_ID_MESSAGE_KEY, a)
    };
    k.MessageChannelPinging.PingResponder.prototype.serviceCallback_ = function () {
        if (!this.isDisposed() && (this.logger.finest("Received a ping request, sending pong response..."), this.messageChannel_.send(k.MessageChannelPinging.PingResponder.SERVICE_NAME, k.MessageChannelPinging.PingResponder.createMessageData(k.MessageChannelPinging.PingResponder.CHANNEL_ID)), this.onPingReceivedListener_)) this.onPingReceivedListener_()
    };
    k.MessageChannelPinging.PingResponder.prototype.disposeInternal = function () {
        this.onPingReceivedListener_ = this.messageChannel_ = null;
        this.logger.fine("Disposed");
        k.MessageChannelPinging.PingResponder.superClass_.disposeInternal.call(this)
    };
    b.scope.TYPE_MESSAGE_KEY = "type";
    b.scope.DATA_MESSAGE_KEY = "data";
    k.TypedMessage = function (a, c) {
        this.type = a;
        this.data = c
    };
    k.TypedMessage.parseTypedMessage = function (a) {
        return e.isObject(a) && 2 == e.object.getCount(a) && e.object.containsKey(a, b.scope.TYPE_MESSAGE_KEY) && "string" === typeof a[b.scope.TYPE_MESSAGE_KEY] && e.object.containsKey(a, b.scope.DATA_MESSAGE_KEY) && e.isObject(a[b.scope.DATA_MESSAGE_KEY]) ? new k.TypedMessage(a[b.scope.TYPE_MESSAGE_KEY], a[b.scope.DATA_MESSAGE_KEY]) : null
    };
    k.TypedMessage.prototype.makeMessage = function () {
        return e.object.create(b.scope.TYPE_MESSAGE_KEY, this.type, b.scope.DATA_MESSAGE_KEY, this.data)
    };
    k.PortMessageChannel = function (a, c) {
        e.messaging.AbstractChannel.call(this);
        this.port_ = a;
        this.extensionId = this.getPortExtensionId_(a);
        this.logger = k.Logging.getScopedLogger('PortMessageChannel<"' + a.name + '"' + (null === this.extensionId ? "" : ', id="' + this.extensionId + '"') + ">");
        this.boundDisconnectEventHandler_ = this.disconnectEventHandler_.bind(this);
        this.port_.onDisconnect.addListener(this.boundDisconnectEventHandler_);
        this.boundMessageEventHandler_ = this.messageEventHandler_.bind(this);
        this.port_.onMessage.addListener(this.boundMessageEventHandler_);
        this.registerDefaultService(this.defaultServiceCallback_.bind(this));
        this.pingResponder_ = new k.MessageChannelPinging.PingResponder(this, this.logger);
        this.pinger_ = new k.MessageChannelPinging.Pinger(this, this.logger, c);
        this.logger.fine("Initialized successfully")
    };
    e.inherits(k.PortMessageChannel, e.messaging.AbstractChannel);
    k.PortMessageChannel.prototype.send = function (a, c) {
        k.Logging.checkWithLogger(this.logger, e.isObject(c));
        e.asserts.assertObject(c);
        a = (new k.TypedMessage(a, c)).makeMessage();
        this.logger.finest("Posting a message: " + k.DebugDump.debugDump(a));
        this.isDisposed() && k.Logging.failWithLogger(this.logger, "Failed to post message: the channel is already disposed");
        try {
            this.port_.postMessage(a)
        } catch (d) {
            this.dispose(), k.Logging.failWithLogger(this.logger, "Failed to post message: " + d)
        }
    };
    k.PortMessageChannel.prototype.disposeInternal = function () {
        this.pinger_.dispose();
        this.pinger_ = null;
        this.pingResponder_.dispose();
        this.pingResponder_ = null;
        this.port_.onMessage.removeListener(this.boundMessageEventHandler_);
        this.boundMessageEventHandler_ = null;
        this.port_.onDisconnect.removeListener(this.boundDisconnectEventHandler_);
        this.boundDisconnectEventHandler_ = null;
        this.port_.disconnect();
        this.port_ = null;
        this.logger.fine("Disposed");
        k.PortMessageChannel.superClass_.disposeInternal.call(this)
    };
    k.PortMessageChannel.prototype.getPortExtensionId_ = function (a) {
        if (!e.object.containsKey(a, "sender")) return null;
        a = a.sender;
        if (void 0 === a) return null;
        k.Logging.checkWithLogger(this.logger, e.isObject(a));
        if (!e.object.containsKey(a, "id")) return null;
        a = a.id;
        if (void 0 === a) return null;
        k.Logging.checkWithLogger(this.logger, "string" === typeof a);
        return a
    };
    k.PortMessageChannel.prototype.disconnectEventHandler_ = function () {
        this.logger.fine("Port was disconnected, disposing...");
        this.dispose()
    };
    k.PortMessageChannel.prototype.messageEventHandler_ = function (a) {
        this.logger.finest("Received a message: " + k.DebugDump.debugDump(a));
        var c = k.TypedMessage.parseTypedMessage(a);
        c || k.Logging.failWithLogger(this.logger, "Failed to parse the received message: " + k.DebugDump.debugDump(a));
        this.deliver(c.type, c.data)
    };
    k.PortMessageChannel.prototype.defaultServiceCallback_ = function (a, c) {
        k.Logging.failWithLogger(this.logger, 'Unhandled message received: serviceName="' + a + '", payload=' + k.DebugDump.debugDump(c))
    };
    k.PcscLiteClient.Context = function (a, c) {
        e.Disposable.call(this);
        this.api = null;
        this.clientTitle = a;
        this.serverAppId_ = void 0;
        void 0 === c ? this.serverAppId_ = k.PcscLiteCommon.Constants.SERVER_OFFICIAL_APP_ID : null !== c && (this.serverAppId_ = c);
        this.channel_ = null;
        this.onInitializedCallbacks_ = [];
        this.logger.fine("Constructed")
    };
    e.inherits(k.PcscLiteClient.Context, e.Disposable);
    e.exportSymbol("GoogleSmartCard.PcscLiteClient.Context", k.PcscLiteClient.Context);
    k.PcscLiteClient.Context.prototype.logger = k.Logging.getScopedLogger("PcscLiteClient.Context");
    e.exportProperty(k.PcscLiteClient.Context.prototype, "logger", k.PcscLiteClient.Context.prototype.logger);
    k.PcscLiteClient.Context.prototype.initialize = function (a) {
        void 0 !== a ? (this.channel_ = a, e.async.nextTick(this.messageChannelEstablishedListener_, this)) : (this.logger.fine("Opening a connection to the server app " + (void 0 !== this.serverAppId_ ? '(extension id is "' + this.serverAppId_ + '")' : "(which is the own app)") + "..."), a = {name: this.clientTitle}, a = void 0 !== this.serverAppId_ ? chrome.runtime.connect(this.serverAppId_, a) : chrome.runtime.connect(a), this.channel_ = new k.PortMessageChannel(a, this.messageChannelEstablishedListener_.bind(this)));
        this.channel_.addOnDisposeCallback(this.messageChannelDisposedListener_.bind(this))
    };
    e.exportProperty(k.PcscLiteClient.Context.prototype, "initialize", k.PcscLiteClient.Context.prototype.initialize);
    k.PcscLiteClient.Context.prototype.addOnInitializedCallback = function (a) {
        null !== this.api ? a(this.api) : this.onInitializedCallbacks_.push(a)
    };
    e.exportProperty(k.PcscLiteClient.Context.prototype, "addOnInitializedCallback", k.PcscLiteClient.Context.prototype.addOnInitializedCallback);
    k.PcscLiteClient.Context.prototype.getApi = function () {
        return this.api
    };
    e.exportProperty(k.PcscLiteClient.Context.prototype, "getApi", k.PcscLiteClient.Context.prototype.getApi);
    k.PcscLiteClient.Context.prototype.getClientTitle = function () {
        return this.clientTitle
    };
    e.exportProperty(k.PcscLiteClient.Context.prototype, "getClientTitle", k.PcscLiteClient.Context.prototype.getClientTitle);
    k.PcscLiteClient.Context.prototype.disposeInternal = function () {
        this.api && (this.api.dispose(), this.api = null);
        this.channel_ && (this.channel_.dispose(), this.channel_ = null);
        this.logger.fine("Disposed");
        k.PcscLiteClient.Context.superClass_.disposeInternal.call(this)
    };
    k.PcscLiteClient.Context.prototype.messageChannelEstablishedListener_ = function () {
        if (!this.isDisposed() && !this.channel_.isDisposed()) {
            this.logger.fine("Message channel was established successfully");
            k.Logging.checkWithLogger(this.logger, null === this.api);
            k.Logging.checkWithLogger(this.logger, null !== this.channel_);
            e.asserts.assert(this.channel_);
            var a = new k.PcscLiteClient.API(this.channel_);
            this.api = a;
            e.array.forEach(this.onInitializedCallbacks_, function (c) {
                c(a)
            });
            this.onInitializedCallbacks_ = []
        }
    };
    k.PcscLiteClient.Context.prototype.messageChannelDisposedListener_ = function () {
        this.logger.fine("Message channel was disposed, disposing...");
        this.dispose()
    };
})();
