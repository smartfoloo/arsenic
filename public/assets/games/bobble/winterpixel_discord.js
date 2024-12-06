var DiscordSDK = (function (exports) {
    'use strict';

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
        return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var eventemitter3 = {exports: {}};

    (function (module) {

        var has = Object.prototype.hasOwnProperty
          , prefix = '~';

        /**
         * Constructor to create a storage for our `EE` objects.
         * An `Events` instance is a plain object whose properties are event names.
         *
         * @constructor
         * @private
         */
        function Events() {}

        //
        // We try to not inherit from `Object.prototype`. In some engines creating an
        // instance in this way is faster than calling `Object.create(null)` directly.
        // If `Object.create(null)` is not supported we prefix the event names with a
        // character to make sure that the built-in object properties are not
        // overridden or used as an attack vector.
        //
        if (Object.create) {
          Events.prototype = Object.create(null);

          //
          // This hack is needed because the `__proto__` property is still inherited in
          // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
          //
          if (!new Events().__proto__) prefix = false;
        }

        /**
         * Representation of a single event listener.
         *
         * @param {Function} fn The listener function.
         * @param {*} context The context to invoke the listener with.
         * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
         * @constructor
         * @private
         */
        function EE(fn, context, once) {
          this.fn = fn;
          this.context = context;
          this.once = once || false;
        }

        /**
         * Add a listener for a given event.
         *
         * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
         * @param {(String|Symbol)} event The event name.
         * @param {Function} fn The listener function.
         * @param {*} context The context to invoke the listener with.
         * @param {Boolean} once Specify if the listener is a one-time listener.
         * @returns {EventEmitter}
         * @private
         */
        function addListener(emitter, event, fn, context, once) {
          if (typeof fn !== 'function') {
            throw new TypeError('The listener must be a function');
          }

          var listener = new EE(fn, context || emitter, once)
            , evt = prefix ? prefix + event : event;

          if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
          else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
          else emitter._events[evt] = [emitter._events[evt], listener];

          return emitter;
        }

        /**
         * Clear event by name.
         *
         * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
         * @param {(String|Symbol)} evt The Event name.
         * @private
         */
        function clearEvent(emitter, evt) {
          if (--emitter._eventsCount === 0) emitter._events = new Events();
          else delete emitter._events[evt];
        }

        /**
         * Minimal `EventEmitter` interface that is molded against the Node.js
         * `EventEmitter` interface.
         *
         * @constructor
         * @public
         */
        function EventEmitter() {
          this._events = new Events();
          this._eventsCount = 0;
        }

        /**
         * Return an array listing the events for which the emitter has registered
         * listeners.
         *
         * @returns {Array}
         * @public
         */
        EventEmitter.prototype.eventNames = function eventNames() {
          var names = []
            , events
            , name;

          if (this._eventsCount === 0) return names;

          for (name in (events = this._events)) {
            if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
          }

          if (Object.getOwnPropertySymbols) {
            return names.concat(Object.getOwnPropertySymbols(events));
          }

          return names;
        };

        /**
         * Return the listeners registered for a given event.
         *
         * @param {(String|Symbol)} event The event name.
         * @returns {Array} The registered listeners.
         * @public
         */
        EventEmitter.prototype.listeners = function listeners(event) {
          var evt = prefix ? prefix + event : event
            , handlers = this._events[evt];

          if (!handlers) return [];
          if (handlers.fn) return [handlers.fn];

          for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
            ee[i] = handlers[i].fn;
          }

          return ee;
        };

        /**
         * Return the number of listeners listening to a given event.
         *
         * @param {(String|Symbol)} event The event name.
         * @returns {Number} The number of listeners.
         * @public
         */
        EventEmitter.prototype.listenerCount = function listenerCount(event) {
          var evt = prefix ? prefix + event : event
            , listeners = this._events[evt];

          if (!listeners) return 0;
          if (listeners.fn) return 1;
          return listeners.length;
        };

        /**
         * Calls each of the listeners registered for a given event.
         *
         * @param {(String|Symbol)} event The event name.
         * @returns {Boolean} `true` if the event had listeners, else `false`.
         * @public
         */
        EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
          var evt = prefix ? prefix + event : event;

          if (!this._events[evt]) return false;

          var listeners = this._events[evt]
            , len = arguments.length
            , args
            , i;

          if (listeners.fn) {
            if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

            switch (len) {
              case 1: return listeners.fn.call(listeners.context), true;
              case 2: return listeners.fn.call(listeners.context, a1), true;
              case 3: return listeners.fn.call(listeners.context, a1, a2), true;
              case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
              case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
              case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
            }

            for (i = 1, args = new Array(len -1); i < len; i++) {
              args[i - 1] = arguments[i];
            }

            listeners.fn.apply(listeners.context, args);
          } else {
            var length = listeners.length
              , j;

            for (i = 0; i < length; i++) {
              if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

              switch (len) {
                case 1: listeners[i].fn.call(listeners[i].context); break;
                case 2: listeners[i].fn.call(listeners[i].context, a1); break;
                case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
                case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
                default:
                  if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                    args[j - 1] = arguments[j];
                  }

                  listeners[i].fn.apply(listeners[i].context, args);
              }
            }
          }

          return true;
        };

        /**
         * Add a listener for a given event.
         *
         * @param {(String|Symbol)} event The event name.
         * @param {Function} fn The listener function.
         * @param {*} [context=this] The context to invoke the listener with.
         * @returns {EventEmitter} `this`.
         * @public
         */
        EventEmitter.prototype.on = function on(event, fn, context) {
          return addListener(this, event, fn, context, false);
        };

        /**
         * Add a one-time listener for a given event.
         *
         * @param {(String|Symbol)} event The event name.
         * @param {Function} fn The listener function.
         * @param {*} [context=this] The context to invoke the listener with.
         * @returns {EventEmitter} `this`.
         * @public
         */
        EventEmitter.prototype.once = function once(event, fn, context) {
          return addListener(this, event, fn, context, true);
        };

        /**
         * Remove the listeners of a given event.
         *
         * @param {(String|Symbol)} event The event name.
         * @param {Function} fn Only remove the listeners that match this function.
         * @param {*} context Only remove the listeners that have this context.
         * @param {Boolean} once Only remove one-time listeners.
         * @returns {EventEmitter} `this`.
         * @public
         */
        EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
          var evt = prefix ? prefix + event : event;

          if (!this._events[evt]) return this;
          if (!fn) {
            clearEvent(this, evt);
            return this;
          }

          var listeners = this._events[evt];

          if (listeners.fn) {
            if (
              listeners.fn === fn &&
              (!once || listeners.once) &&
              (!context || listeners.context === context)
            ) {
              clearEvent(this, evt);
            }
          } else {
            for (var i = 0, events = [], length = listeners.length; i < length; i++) {
              if (
                listeners[i].fn !== fn ||
                (once && !listeners[i].once) ||
                (context && listeners[i].context !== context)
              ) {
                events.push(listeners[i]);
              }
            }

            //
            // Reset the array, or remove it completely if we have no more listeners.
            //
            if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
            else clearEvent(this, evt);
          }

          return this;
        };

        /**
         * Remove all listeners, or those of the specified event.
         *
         * @param {(String|Symbol)} [event] The event name.
         * @returns {EventEmitter} `this`.
         * @public
         */
        EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
          var evt;

          if (event) {
            evt = prefix ? prefix + event : event;
            if (this._events[evt]) clearEvent(this, evt);
          } else {
            this._events = new Events();
            this._eventsCount = 0;
          }

          return this;
        };

        //
        // Alias methods names because people roll like that.
        //
        EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
        EventEmitter.prototype.addListener = EventEmitter.prototype.on;

        //
        // Expose the prefix.
        //
        EventEmitter.prefixed = prefix;

        //
        // Allow `EventEmitter` to be imported as module namespace.
        //
        EventEmitter.EventEmitter = EventEmitter;

        //
        // Expose the module.
        //
        {
          module.exports = EventEmitter;
        }
    } (eventemitter3));

    var eventemitter3Exports = eventemitter3.exports;
    var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventemitter3Exports);

    var util;
    (function (util) {
        util.assertEqual = (val) => val;
        function assertIs(_arg) { }
        util.assertIs = assertIs;
        function assertNever(_x) {
            throw new Error();
        }
        util.assertNever = assertNever;
        util.arrayToEnum = (items) => {
            const obj = {};
            for (const item of items) {
                obj[item] = item;
            }
            return obj;
        };
        util.getValidEnumValues = (obj) => {
            const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
            const filtered = {};
            for (const k of validKeys) {
                filtered[k] = obj[k];
            }
            return util.objectValues(filtered);
        };
        util.objectValues = (obj) => {
            return util.objectKeys(obj).map(function (e) {
                return obj[e];
            });
        };
        util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
            ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
            : (object) => {
                const keys = [];
                for (const key in object) {
                    if (Object.prototype.hasOwnProperty.call(object, key)) {
                        keys.push(key);
                    }
                }
                return keys;
            };
        util.find = (arr, checker) => {
            for (const item of arr) {
                if (checker(item))
                    return item;
            }
            return undefined;
        };
        util.isInteger = typeof Number.isInteger === "function"
            ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
            : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
        function joinValues(array, separator = " | ") {
            return array
                .map((val) => (typeof val === "string" ? `'${val}'` : val))
                .join(separator);
        }
        util.joinValues = joinValues;
        util.jsonStringifyReplacer = (_, value) => {
            if (typeof value === "bigint") {
                return value.toString();
            }
            return value;
        };
    })(util || (util = {}));
    var objectUtil;
    (function (objectUtil) {
        objectUtil.mergeShapes = (first, second) => {
            return {
                ...first,
                ...second, // second overwrites first
            };
        };
    })(objectUtil || (objectUtil = {}));
    const ZodParsedType = util.arrayToEnum([
        "string",
        "nan",
        "number",
        "integer",
        "float",
        "boolean",
        "date",
        "bigint",
        "symbol",
        "function",
        "undefined",
        "null",
        "array",
        "object",
        "unknown",
        "promise",
        "void",
        "never",
        "map",
        "set",
    ]);
    const getParsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "undefined":
                return ZodParsedType.undefined;
            case "string":
                return ZodParsedType.string;
            case "number":
                return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
            case "boolean":
                return ZodParsedType.boolean;
            case "function":
                return ZodParsedType.function;
            case "bigint":
                return ZodParsedType.bigint;
            case "symbol":
                return ZodParsedType.symbol;
            case "object":
                if (Array.isArray(data)) {
                    return ZodParsedType.array;
                }
                if (data === null) {
                    return ZodParsedType.null;
                }
                if (data.then &&
                    typeof data.then === "function" &&
                    data.catch &&
                    typeof data.catch === "function") {
                    return ZodParsedType.promise;
                }
                if (typeof Map !== "undefined" && data instanceof Map) {
                    return ZodParsedType.map;
                }
                if (typeof Set !== "undefined" && data instanceof Set) {
                    return ZodParsedType.set;
                }
                if (typeof Date !== "undefined" && data instanceof Date) {
                    return ZodParsedType.date;
                }
                return ZodParsedType.object;
            default:
                return ZodParsedType.unknown;
        }
    };

    const ZodIssueCode = util.arrayToEnum([
        "invalid_type",
        "invalid_literal",
        "custom",
        "invalid_union",
        "invalid_union_discriminator",
        "invalid_enum_value",
        "unrecognized_keys",
        "invalid_arguments",
        "invalid_return_type",
        "invalid_date",
        "invalid_string",
        "too_small",
        "too_big",
        "invalid_intersection_types",
        "not_multiple_of",
        "not_finite",
    ]);
    const quotelessJson = (obj) => {
        const json = JSON.stringify(obj, null, 2);
        return json.replace(/"([^"]+)":/g, "$1:");
    };
    class ZodError extends Error {
        constructor(issues) {
            super();
            this.issues = [];
            this.addIssue = (sub) => {
                this.issues = [...this.issues, sub];
            };
            this.addIssues = (subs = []) => {
                this.issues = [...this.issues, ...subs];
            };
            const actualProto = new.target.prototype;
            if (Object.setPrototypeOf) {
                // eslint-disable-next-line ban/ban
                Object.setPrototypeOf(this, actualProto);
            }
            else {
                this.__proto__ = actualProto;
            }
            this.name = "ZodError";
            this.issues = issues;
        }
        get errors() {
            return this.issues;
        }
        format(_mapper) {
            const mapper = _mapper ||
                function (issue) {
                    return issue.message;
                };
            const fieldErrors = { _errors: [] };
            const processError = (error) => {
                for (const issue of error.issues) {
                    if (issue.code === "invalid_union") {
                        issue.unionErrors.map(processError);
                    }
                    else if (issue.code === "invalid_return_type") {
                        processError(issue.returnTypeError);
                    }
                    else if (issue.code === "invalid_arguments") {
                        processError(issue.argumentsError);
                    }
                    else if (issue.path.length === 0) {
                        fieldErrors._errors.push(mapper(issue));
                    }
                    else {
                        let curr = fieldErrors;
                        let i = 0;
                        while (i < issue.path.length) {
                            const el = issue.path[i];
                            const terminal = i === issue.path.length - 1;
                            if (!terminal) {
                                curr[el] = curr[el] || { _errors: [] };
                                // if (typeof el === "string") {
                                //   curr[el] = curr[el] || { _errors: [] };
                                // } else if (typeof el === "number") {
                                //   const errorArray: any = [];
                                //   errorArray._errors = [];
                                //   curr[el] = curr[el] || errorArray;
                                // }
                            }
                            else {
                                curr[el] = curr[el] || { _errors: [] };
                                curr[el]._errors.push(mapper(issue));
                            }
                            curr = curr[el];
                            i++;
                        }
                    }
                }
            };
            processError(this);
            return fieldErrors;
        }
        toString() {
            return this.message;
        }
        get message() {
            return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
        }
        get isEmpty() {
            return this.issues.length === 0;
        }
        flatten(mapper = (issue) => issue.message) {
            const fieldErrors = {};
            const formErrors = [];
            for (const sub of this.issues) {
                if (sub.path.length > 0) {
                    fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                    fieldErrors[sub.path[0]].push(mapper(sub));
                }
                else {
                    formErrors.push(mapper(sub));
                }
            }
            return { formErrors, fieldErrors };
        }
        get formErrors() {
            return this.flatten();
        }
    }
    ZodError.create = (issues) => {
        const error = new ZodError(issues);
        return error;
    };

    const errorMap = (issue, _ctx) => {
        let message;
        switch (issue.code) {
            case ZodIssueCode.invalid_type:
                if (issue.received === ZodParsedType.undefined) {
                    message = "Required";
                }
                else {
                    message = `Expected ${issue.expected}, received ${issue.received}`;
                }
                break;
            case ZodIssueCode.invalid_literal:
                message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
                break;
            case ZodIssueCode.unrecognized_keys:
                message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
                break;
            case ZodIssueCode.invalid_union:
                message = `Invalid input`;
                break;
            case ZodIssueCode.invalid_union_discriminator:
                message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
                break;
            case ZodIssueCode.invalid_enum_value:
                message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
                break;
            case ZodIssueCode.invalid_arguments:
                message = `Invalid function arguments`;
                break;
            case ZodIssueCode.invalid_return_type:
                message = `Invalid function return type`;
                break;
            case ZodIssueCode.invalid_date:
                message = `Invalid date`;
                break;
            case ZodIssueCode.invalid_string:
                if (typeof issue.validation === "object") {
                    if ("includes" in issue.validation) {
                        message = `Invalid input: must include "${issue.validation.includes}"`;
                        if (typeof issue.validation.position === "number") {
                            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                        }
                    }
                    else if ("startsWith" in issue.validation) {
                        message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                    }
                    else if ("endsWith" in issue.validation) {
                        message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                    }
                    else {
                        util.assertNever(issue.validation);
                    }
                }
                else if (issue.validation !== "regex") {
                    message = `Invalid ${issue.validation}`;
                }
                else {
                    message = "Invalid";
                }
                break;
            case ZodIssueCode.too_small:
                if (issue.type === "array")
                    message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
                else if (issue.type === "string")
                    message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
                else if (issue.type === "number")
                    message = `Number must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${issue.minimum}`;
                else if (issue.type === "date")
                    message = `Date must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${new Date(Number(issue.minimum))}`;
                else
                    message = "Invalid input";
                break;
            case ZodIssueCode.too_big:
                if (issue.type === "array")
                    message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
                else if (issue.type === "string")
                    message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
                else if (issue.type === "number")
                    message = `Number must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
                else if (issue.type === "bigint")
                    message = `BigInt must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
                else if (issue.type === "date")
                    message = `Date must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `smaller than or equal to`
                        : `smaller than`} ${new Date(Number(issue.maximum))}`;
                else
                    message = "Invalid input";
                break;
            case ZodIssueCode.custom:
                message = `Invalid input`;
                break;
            case ZodIssueCode.invalid_intersection_types:
                message = `Intersection results could not be merged`;
                break;
            case ZodIssueCode.not_multiple_of:
                message = `Number must be a multiple of ${issue.multipleOf}`;
                break;
            case ZodIssueCode.not_finite:
                message = "Number must be finite";
                break;
            default:
                message = _ctx.defaultError;
                util.assertNever(issue);
        }
        return { message };
    };

    let overrideErrorMap = errorMap;
    function setErrorMap(map) {
        overrideErrorMap = map;
    }
    function getErrorMap() {
        return overrideErrorMap;
    }

    const makeIssue = (params) => {
        const { data, path, errorMaps, issueData } = params;
        const fullPath = [...path, ...(issueData.path || [])];
        const fullIssue = {
            ...issueData,
            path: fullPath,
        };
        let errorMessage = "";
        const maps = errorMaps
            .filter((m) => !!m)
            .slice()
            .reverse();
        for (const map of maps) {
            errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
        }
        return {
            ...issueData,
            path: fullPath,
            message: issueData.message || errorMessage,
        };
    };
    const EMPTY_PATH = [];
    function addIssueToContext(ctx, issueData) {
        const issue = makeIssue({
            issueData: issueData,
            data: ctx.data,
            path: ctx.path,
            errorMaps: [
                ctx.common.contextualErrorMap,
                ctx.schemaErrorMap,
                getErrorMap(),
                errorMap, // then global default map
            ].filter((x) => !!x),
        });
        ctx.common.issues.push(issue);
    }
    class ParseStatus {
        constructor() {
            this.value = "valid";
        }
        dirty() {
            if (this.value === "valid")
                this.value = "dirty";
        }
        abort() {
            if (this.value !== "aborted")
                this.value = "aborted";
        }
        static mergeArray(status, results) {
            const arrayValue = [];
            for (const s of results) {
                if (s.status === "aborted")
                    return INVALID;
                if (s.status === "dirty")
                    status.dirty();
                arrayValue.push(s.value);
            }
            return { status: status.value, value: arrayValue };
        }
        static async mergeObjectAsync(status, pairs) {
            const syncPairs = [];
            for (const pair of pairs) {
                syncPairs.push({
                    key: await pair.key,
                    value: await pair.value,
                });
            }
            return ParseStatus.mergeObjectSync(status, syncPairs);
        }
        static mergeObjectSync(status, pairs) {
            const finalObject = {};
            for (const pair of pairs) {
                const { key, value } = pair;
                if (key.status === "aborted")
                    return INVALID;
                if (value.status === "aborted")
                    return INVALID;
                if (key.status === "dirty")
                    status.dirty();
                if (value.status === "dirty")
                    status.dirty();
                if (key.value !== "__proto__" &&
                    (typeof value.value !== "undefined" || pair.alwaysSet)) {
                    finalObject[key.value] = value.value;
                }
            }
            return { status: status.value, value: finalObject };
        }
    }
    const INVALID = Object.freeze({
        status: "aborted",
    });
    const DIRTY = (value) => ({ status: "dirty", value });
    const OK = (value) => ({ status: "valid", value });
    const isAborted = (x) => x.status === "aborted";
    const isDirty = (x) => x.status === "dirty";
    const isValid = (x) => x.status === "valid";
    const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

    var errorUtil;
    (function (errorUtil) {
        errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
        errorUtil.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
    })(errorUtil || (errorUtil = {}));

    class ParseInputLazyPath {
        constructor(parent, value, path, key) {
            this._cachedPath = [];
            this.parent = parent;
            this.data = value;
            this._path = path;
            this._key = key;
        }
        get path() {
            if (!this._cachedPath.length) {
                if (this._key instanceof Array) {
                    this._cachedPath.push(...this._path, ...this._key);
                }
                else {
                    this._cachedPath.push(...this._path, this._key);
                }
            }
            return this._cachedPath;
        }
    }
    const handleResult = (ctx, result) => {
        if (isValid(result)) {
            return { success: true, data: result.value };
        }
        else {
            if (!ctx.common.issues.length) {
                throw new Error("Validation failed but no issues detected.");
            }
            return {
                success: false,
                get error() {
                    if (this._error)
                        return this._error;
                    const error = new ZodError(ctx.common.issues);
                    this._error = error;
                    return this._error;
                },
            };
        }
    };
    function processCreateParams(params) {
        if (!params)
            return {};
        const { errorMap, invalid_type_error, required_error, description } = params;
        if (errorMap && (invalid_type_error || required_error)) {
            throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
        }
        if (errorMap)
            return { errorMap: errorMap, description };
        const customMap = (iss, ctx) => {
            if (iss.code !== "invalid_type")
                return { message: ctx.defaultError };
            if (typeof ctx.data === "undefined") {
                return { message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError };
            }
            return { message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError };
        };
        return { errorMap: customMap, description };
    }
    class ZodType {
        constructor(def) {
            /** Alias of safeParseAsync */
            this.spa = this.safeParseAsync;
            this._def = def;
            this.parse = this.parse.bind(this);
            this.safeParse = this.safeParse.bind(this);
            this.parseAsync = this.parseAsync.bind(this);
            this.safeParseAsync = this.safeParseAsync.bind(this);
            this.spa = this.spa.bind(this);
            this.refine = this.refine.bind(this);
            this.refinement = this.refinement.bind(this);
            this.superRefine = this.superRefine.bind(this);
            this.optional = this.optional.bind(this);
            this.nullable = this.nullable.bind(this);
            this.nullish = this.nullish.bind(this);
            this.array = this.array.bind(this);
            this.promise = this.promise.bind(this);
            this.or = this.or.bind(this);
            this.and = this.and.bind(this);
            this.transform = this.transform.bind(this);
            this.brand = this.brand.bind(this);
            this.default = this.default.bind(this);
            this.catch = this.catch.bind(this);
            this.describe = this.describe.bind(this);
            this.pipe = this.pipe.bind(this);
            this.readonly = this.readonly.bind(this);
            this.isNullable = this.isNullable.bind(this);
            this.isOptional = this.isOptional.bind(this);
        }
        get description() {
            return this._def.description;
        }
        _getType(input) {
            return getParsedType(input.data);
        }
        _getOrReturnCtx(input, ctx) {
            return (ctx || {
                common: input.parent.common,
                data: input.data,
                parsedType: getParsedType(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent,
            });
        }
        _processInputParams(input) {
            return {
                status: new ParseStatus(),
                ctx: {
                    common: input.parent.common,
                    data: input.data,
                    parsedType: getParsedType(input.data),
                    schemaErrorMap: this._def.errorMap,
                    path: input.path,
                    parent: input.parent,
                },
            };
        }
        _parseSync(input) {
            const result = this._parse(input);
            if (isAsync(result)) {
                throw new Error("Synchronous parse encountered promise.");
            }
            return result;
        }
        _parseAsync(input) {
            const result = this._parse(input);
            return Promise.resolve(result);
        }
        parse(data, params) {
            const result = this.safeParse(data, params);
            if (result.success)
                return result.data;
            throw result.error;
        }
        safeParse(data, params) {
            var _a;
            const ctx = {
                common: {
                    issues: [],
                    async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
                    contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                },
                path: (params === null || params === void 0 ? void 0 : params.path) || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data,
                parsedType: getParsedType(data),
            };
            const result = this._parseSync({ data, path: ctx.path, parent: ctx });
            return handleResult(ctx, result);
        }
        async parseAsync(data, params) {
            const result = await this.safeParseAsync(data, params);
            if (result.success)
                return result.data;
            throw result.error;
        }
        async safeParseAsync(data, params) {
            const ctx = {
                common: {
                    issues: [],
                    contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                    async: true,
                },
                path: (params === null || params === void 0 ? void 0 : params.path) || [],
                schemaErrorMap: this._def.errorMap,
                parent: null,
                data,
                parsedType: getParsedType(data),
            };
            const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
            const result = await (isAsync(maybeAsyncResult)
                ? maybeAsyncResult
                : Promise.resolve(maybeAsyncResult));
            return handleResult(ctx, result);
        }
        refine(check, message) {
            const getIssueProperties = (val) => {
                if (typeof message === "string" || typeof message === "undefined") {
                    return { message };
                }
                else if (typeof message === "function") {
                    return message(val);
                }
                else {
                    return message;
                }
            };
            return this._refinement((val, ctx) => {
                const result = check(val);
                const setError = () => ctx.addIssue({
                    code: ZodIssueCode.custom,
                    ...getIssueProperties(val),
                });
                if (typeof Promise !== "undefined" && result instanceof Promise) {
                    return result.then((data) => {
                        if (!data) {
                            setError();
                            return false;
                        }
                        else {
                            return true;
                        }
                    });
                }
                if (!result) {
                    setError();
                    return false;
                }
                else {
                    return true;
                }
            });
        }
        refinement(check, refinementData) {
            return this._refinement((val, ctx) => {
                if (!check(val)) {
                    ctx.addIssue(typeof refinementData === "function"
                        ? refinementData(val, ctx)
                        : refinementData);
                    return false;
                }
                else {
                    return true;
                }
            });
        }
        _refinement(refinement) {
            return new ZodEffects({
                schema: this,
                typeName: ZodFirstPartyTypeKind.ZodEffects,
                effect: { type: "refinement", refinement },
            });
        }
        superRefine(refinement) {
            return this._refinement(refinement);
        }
        optional() {
            return ZodOptional.create(this, this._def);
        }
        nullable() {
            return ZodNullable.create(this, this._def);
        }
        nullish() {
            return this.nullable().optional();
        }
        array() {
            return ZodArray.create(this, this._def);
        }
        promise() {
            return ZodPromise.create(this, this._def);
        }
        or(option) {
            return ZodUnion.create([this, option], this._def);
        }
        and(incoming) {
            return ZodIntersection.create(this, incoming, this._def);
        }
        transform(transform) {
            return new ZodEffects({
                ...processCreateParams(this._def),
                schema: this,
                typeName: ZodFirstPartyTypeKind.ZodEffects,
                effect: { type: "transform", transform },
            });
        }
        default(def) {
            const defaultValueFunc = typeof def === "function" ? def : () => def;
            return new ZodDefault({
                ...processCreateParams(this._def),
                innerType: this,
                defaultValue: defaultValueFunc,
                typeName: ZodFirstPartyTypeKind.ZodDefault,
            });
        }
        brand() {
            return new ZodBranded({
                typeName: ZodFirstPartyTypeKind.ZodBranded,
                type: this,
                ...processCreateParams(this._def),
            });
        }
        catch(def) {
            const catchValueFunc = typeof def === "function" ? def : () => def;
            return new ZodCatch({
                ...processCreateParams(this._def),
                innerType: this,
                catchValue: catchValueFunc,
                typeName: ZodFirstPartyTypeKind.ZodCatch,
            });
        }
        describe(description) {
            const This = this.constructor;
            return new This({
                ...this._def,
                description,
            });
        }
        pipe(target) {
            return ZodPipeline.create(this, target);
        }
        readonly() {
            return ZodReadonly.create(this);
        }
        isOptional() {
            return this.safeParse(undefined).success;
        }
        isNullable() {
            return this.safeParse(null).success;
        }
    }
    const cuidRegex = /^c[^\s-]{8,}$/i;
    const cuid2Regex = /^[a-z][a-z0-9]*$/;
    const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    // const uuidRegex =
    //   /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
    const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    // from https://stackoverflow.com/a/46181/1550155
    // old version: too slow, didn't support unicode
    // const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    //old email regex
    // const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
    // eslint-disable-next-line
    // const emailRegex =
    //   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
    // const emailRegex =
    //   /^[a-zA-Z0-9\.\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // const emailRegex =
    //   /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
    const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
    // const emailRegex =
    //   /^[a-z0-9.!#$%&â€™*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9\-]+)*$/i;
    // from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
    const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    let emojiRegex;
    const ipv4Regex = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;
    const ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
    // Adapted from https://stackoverflow.com/a/3143231
    const datetimeRegex = (args) => {
        if (args.precision) {
            if (args.offset) {
                return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
            }
            else {
                return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
            }
        }
        else if (args.precision === 0) {
            if (args.offset) {
                return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
            }
            else {
                return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
            }
        }
        else {
            if (args.offset) {
                return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
            }
            else {
                return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
            }
        }
    };
    function isValidIP(ip, version) {
        if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
            return true;
        }
        if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
            return true;
        }
        return false;
    }
    class ZodString extends ZodType {
        _parse(input) {
            if (this._def.coerce) {
                input.data = String(input.data);
            }
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.string) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.string,
                    received: ctx.parsedType,
                }
                //
                );
                return INVALID;
            }
            const status = new ParseStatus();
            let ctx = undefined;
            for (const check of this._def.checks) {
                if (check.kind === "min") {
                    if (input.data.length < check.value) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            minimum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: false,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "max") {
                    if (input.data.length > check.value) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            maximum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: false,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "length") {
                    const tooBig = input.data.length > check.value;
                    const tooSmall = input.data.length < check.value;
                    if (tooBig || tooSmall) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        if (tooBig) {
                            addIssueToContext(ctx, {
                                code: ZodIssueCode.too_big,
                                maximum: check.value,
                                type: "string",
                                inclusive: true,
                                exact: true,
                                message: check.message,
                            });
                        }
                        else if (tooSmall) {
                            addIssueToContext(ctx, {
                                code: ZodIssueCode.too_small,
                                minimum: check.value,
                                type: "string",
                                inclusive: true,
                                exact: true,
                                message: check.message,
                            });
                        }
                        status.dirty();
                    }
                }
                else if (check.kind === "email") {
                    if (!emailRegex.test(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "email",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "emoji") {
                    if (!emojiRegex) {
                        emojiRegex = new RegExp(_emojiRegex, "u");
                    }
                    if (!emojiRegex.test(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "emoji",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "uuid") {
                    if (!uuidRegex.test(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "uuid",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "cuid") {
                    if (!cuidRegex.test(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "cuid",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "cuid2") {
                    if (!cuid2Regex.test(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "cuid2",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "ulid") {
                    if (!ulidRegex.test(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "ulid",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "url") {
                    try {
                        new URL(input.data);
                    }
                    catch (_a) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "url",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "regex") {
                    check.regex.lastIndex = 0;
                    const testResult = check.regex.test(input.data);
                    if (!testResult) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "regex",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "trim") {
                    input.data = input.data.trim();
                }
                else if (check.kind === "includes") {
                    if (!input.data.includes(check.value, check.position)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.invalid_string,
                            validation: { includes: check.value, position: check.position },
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "toLowerCase") {
                    input.data = input.data.toLowerCase();
                }
                else if (check.kind === "toUpperCase") {
                    input.data = input.data.toUpperCase();
                }
                else if (check.kind === "startsWith") {
                    if (!input.data.startsWith(check.value)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.invalid_string,
                            validation: { startsWith: check.value },
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "endsWith") {
                    if (!input.data.endsWith(check.value)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.invalid_string,
                            validation: { endsWith: check.value },
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "datetime") {
                    const regex = datetimeRegex(check);
                    if (!regex.test(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.invalid_string,
                            validation: "datetime",
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "ip") {
                    if (!isValidIP(input.data, check.version)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            validation: "ip",
                            code: ZodIssueCode.invalid_string,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else {
                    util.assertNever(check);
                }
            }
            return { status: status.value, value: input.data };
        }
        _regex(regex, validation, message) {
            return this.refinement((data) => regex.test(data), {
                validation,
                code: ZodIssueCode.invalid_string,
                ...errorUtil.errToObj(message),
            });
        }
        _addCheck(check) {
            return new ZodString({
                ...this._def,
                checks: [...this._def.checks, check],
            });
        }
        email(message) {
            return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
        }
        url(message) {
            return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
        }
        emoji(message) {
            return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
        }
        uuid(message) {
            return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
        }
        cuid(message) {
            return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
        }
        cuid2(message) {
            return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
        }
        ulid(message) {
            return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
        }
        ip(options) {
            return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
        }
        datetime(options) {
            var _a;
            if (typeof options === "string") {
                return this._addCheck({
                    kind: "datetime",
                    precision: null,
                    offset: false,
                    message: options,
                });
            }
            return this._addCheck({
                kind: "datetime",
                precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
                offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
                ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
            });
        }
        regex(regex, message) {
            return this._addCheck({
                kind: "regex",
                regex: regex,
                ...errorUtil.errToObj(message),
            });
        }
        includes(value, options) {
            return this._addCheck({
                kind: "includes",
                value: value,
                position: options === null || options === void 0 ? void 0 : options.position,
                ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
            });
        }
        startsWith(value, message) {
            return this._addCheck({
                kind: "startsWith",
                value: value,
                ...errorUtil.errToObj(message),
            });
        }
        endsWith(value, message) {
            return this._addCheck({
                kind: "endsWith",
                value: value,
                ...errorUtil.errToObj(message),
            });
        }
        min(minLength, message) {
            return this._addCheck({
                kind: "min",
                value: minLength,
                ...errorUtil.errToObj(message),
            });
        }
        max(maxLength, message) {
            return this._addCheck({
                kind: "max",
                value: maxLength,
                ...errorUtil.errToObj(message),
            });
        }
        length(len, message) {
            return this._addCheck({
                kind: "length",
                value: len,
                ...errorUtil.errToObj(message),
            });
        }
        /**
         * @deprecated Use z.string().min(1) instead.
         * @see {@link ZodString.min}
         */
        nonempty(message) {
            return this.min(1, errorUtil.errToObj(message));
        }
        trim() {
            return new ZodString({
                ...this._def,
                checks: [...this._def.checks, { kind: "trim" }],
            });
        }
        toLowerCase() {
            return new ZodString({
                ...this._def,
                checks: [...this._def.checks, { kind: "toLowerCase" }],
            });
        }
        toUpperCase() {
            return new ZodString({
                ...this._def,
                checks: [...this._def.checks, { kind: "toUpperCase" }],
            });
        }
        get isDatetime() {
            return !!this._def.checks.find((ch) => ch.kind === "datetime");
        }
        get isEmail() {
            return !!this._def.checks.find((ch) => ch.kind === "email");
        }
        get isURL() {
            return !!this._def.checks.find((ch) => ch.kind === "url");
        }
        get isEmoji() {
            return !!this._def.checks.find((ch) => ch.kind === "emoji");
        }
        get isUUID() {
            return !!this._def.checks.find((ch) => ch.kind === "uuid");
        }
        get isCUID() {
            return !!this._def.checks.find((ch) => ch.kind === "cuid");
        }
        get isCUID2() {
            return !!this._def.checks.find((ch) => ch.kind === "cuid2");
        }
        get isULID() {
            return !!this._def.checks.find((ch) => ch.kind === "ulid");
        }
        get isIP() {
            return !!this._def.checks.find((ch) => ch.kind === "ip");
        }
        get minLength() {
            let min = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "min") {
                    if (min === null || ch.value > min)
                        min = ch.value;
                }
            }
            return min;
        }
        get maxLength() {
            let max = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "max") {
                    if (max === null || ch.value < max)
                        max = ch.value;
                }
            }
            return max;
        }
    }
    ZodString.create = (params) => {
        var _a;
        return new ZodString({
            checks: [],
            typeName: ZodFirstPartyTypeKind.ZodString,
            coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
            ...processCreateParams(params),
        });
    };
    // https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
    function floatSafeRemainder(val, step) {
        const valDecCount = (val.toString().split(".")[1] || "").length;
        const stepDecCount = (step.toString().split(".")[1] || "").length;
        const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
        const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
        const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
        return (valInt % stepInt) / Math.pow(10, decCount);
    }
    class ZodNumber extends ZodType {
        constructor() {
            super(...arguments);
            this.min = this.gte;
            this.max = this.lte;
            this.step = this.multipleOf;
        }
        _parse(input) {
            if (this._def.coerce) {
                input.data = Number(input.data);
            }
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.number) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.number,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            let ctx = undefined;
            const status = new ParseStatus();
            for (const check of this._def.checks) {
                if (check.kind === "int") {
                    if (!util.isInteger(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.invalid_type,
                            expected: "integer",
                            received: "float",
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "min") {
                    const tooSmall = check.inclusive
                        ? input.data < check.value
                        : input.data <= check.value;
                    if (tooSmall) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            minimum: check.value,
                            type: "number",
                            inclusive: check.inclusive,
                            exact: false,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "max") {
                    const tooBig = check.inclusive
                        ? input.data > check.value
                        : input.data >= check.value;
                    if (tooBig) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            maximum: check.value,
                            type: "number",
                            inclusive: check.inclusive,
                            exact: false,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "multipleOf") {
                    if (floatSafeRemainder(input.data, check.value) !== 0) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.not_multiple_of,
                            multipleOf: check.value,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "finite") {
                    if (!Number.isFinite(input.data)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.not_finite,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else {
                    util.assertNever(check);
                }
            }
            return { status: status.value, value: input.data };
        }
        gte(value, message) {
            return this.setLimit("min", value, true, errorUtil.toString(message));
        }
        gt(value, message) {
            return this.setLimit("min", value, false, errorUtil.toString(message));
        }
        lte(value, message) {
            return this.setLimit("max", value, true, errorUtil.toString(message));
        }
        lt(value, message) {
            return this.setLimit("max", value, false, errorUtil.toString(message));
        }
        setLimit(kind, value, inclusive, message) {
            return new ZodNumber({
                ...this._def,
                checks: [
                    ...this._def.checks,
                    {
                        kind,
                        value,
                        inclusive,
                        message: errorUtil.toString(message),
                    },
                ],
            });
        }
        _addCheck(check) {
            return new ZodNumber({
                ...this._def,
                checks: [...this._def.checks, check],
            });
        }
        int(message) {
            return this._addCheck({
                kind: "int",
                message: errorUtil.toString(message),
            });
        }
        positive(message) {
            return this._addCheck({
                kind: "min",
                value: 0,
                inclusive: false,
                message: errorUtil.toString(message),
            });
        }
        negative(message) {
            return this._addCheck({
                kind: "max",
                value: 0,
                inclusive: false,
                message: errorUtil.toString(message),
            });
        }
        nonpositive(message) {
            return this._addCheck({
                kind: "max",
                value: 0,
                inclusive: true,
                message: errorUtil.toString(message),
            });
        }
        nonnegative(message) {
            return this._addCheck({
                kind: "min",
                value: 0,
                inclusive: true,
                message: errorUtil.toString(message),
            });
        }
        multipleOf(value, message) {
            return this._addCheck({
                kind: "multipleOf",
                value: value,
                message: errorUtil.toString(message),
            });
        }
        finite(message) {
            return this._addCheck({
                kind: "finite",
                message: errorUtil.toString(message),
            });
        }
        safe(message) {
            return this._addCheck({
                kind: "min",
                inclusive: true,
                value: Number.MIN_SAFE_INTEGER,
                message: errorUtil.toString(message),
            })._addCheck({
                kind: "max",
                inclusive: true,
                value: Number.MAX_SAFE_INTEGER,
                message: errorUtil.toString(message),
            });
        }
        get minValue() {
            let min = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "min") {
                    if (min === null || ch.value > min)
                        min = ch.value;
                }
            }
            return min;
        }
        get maxValue() {
            let max = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "max") {
                    if (max === null || ch.value < max)
                        max = ch.value;
                }
            }
            return max;
        }
        get isInt() {
            return !!this._def.checks.find((ch) => ch.kind === "int" ||
                (ch.kind === "multipleOf" && util.isInteger(ch.value)));
        }
        get isFinite() {
            let max = null, min = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "finite" ||
                    ch.kind === "int" ||
                    ch.kind === "multipleOf") {
                    return true;
                }
                else if (ch.kind === "min") {
                    if (min === null || ch.value > min)
                        min = ch.value;
                }
                else if (ch.kind === "max") {
                    if (max === null || ch.value < max)
                        max = ch.value;
                }
            }
            return Number.isFinite(min) && Number.isFinite(max);
        }
    }
    ZodNumber.create = (params) => {
        return new ZodNumber({
            checks: [],
            typeName: ZodFirstPartyTypeKind.ZodNumber,
            coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
            ...processCreateParams(params),
        });
    };
    class ZodBigInt extends ZodType {
        constructor() {
            super(...arguments);
            this.min = this.gte;
            this.max = this.lte;
        }
        _parse(input) {
            if (this._def.coerce) {
                input.data = BigInt(input.data);
            }
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.bigint) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.bigint,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            let ctx = undefined;
            const status = new ParseStatus();
            for (const check of this._def.checks) {
                if (check.kind === "min") {
                    const tooSmall = check.inclusive
                        ? input.data < check.value
                        : input.data <= check.value;
                    if (tooSmall) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            type: "bigint",
                            minimum: check.value,
                            inclusive: check.inclusive,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "max") {
                    const tooBig = check.inclusive
                        ? input.data > check.value
                        : input.data >= check.value;
                    if (tooBig) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            type: "bigint",
                            maximum: check.value,
                            inclusive: check.inclusive,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "multipleOf") {
                    if (input.data % check.value !== BigInt(0)) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.not_multiple_of,
                            multipleOf: check.value,
                            message: check.message,
                        });
                        status.dirty();
                    }
                }
                else {
                    util.assertNever(check);
                }
            }
            return { status: status.value, value: input.data };
        }
        gte(value, message) {
            return this.setLimit("min", value, true, errorUtil.toString(message));
        }
        gt(value, message) {
            return this.setLimit("min", value, false, errorUtil.toString(message));
        }
        lte(value, message) {
            return this.setLimit("max", value, true, errorUtil.toString(message));
        }
        lt(value, message) {
            return this.setLimit("max", value, false, errorUtil.toString(message));
        }
        setLimit(kind, value, inclusive, message) {
            return new ZodBigInt({
                ...this._def,
                checks: [
                    ...this._def.checks,
                    {
                        kind,
                        value,
                        inclusive,
                        message: errorUtil.toString(message),
                    },
                ],
            });
        }
        _addCheck(check) {
            return new ZodBigInt({
                ...this._def,
                checks: [...this._def.checks, check],
            });
        }
        positive(message) {
            return this._addCheck({
                kind: "min",
                value: BigInt(0),
                inclusive: false,
                message: errorUtil.toString(message),
            });
        }
        negative(message) {
            return this._addCheck({
                kind: "max",
                value: BigInt(0),
                inclusive: false,
                message: errorUtil.toString(message),
            });
        }
        nonpositive(message) {
            return this._addCheck({
                kind: "max",
                value: BigInt(0),
                inclusive: true,
                message: errorUtil.toString(message),
            });
        }
        nonnegative(message) {
            return this._addCheck({
                kind: "min",
                value: BigInt(0),
                inclusive: true,
                message: errorUtil.toString(message),
            });
        }
        multipleOf(value, message) {
            return this._addCheck({
                kind: "multipleOf",
                value,
                message: errorUtil.toString(message),
            });
        }
        get minValue() {
            let min = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "min") {
                    if (min === null || ch.value > min)
                        min = ch.value;
                }
            }
            return min;
        }
        get maxValue() {
            let max = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "max") {
                    if (max === null || ch.value < max)
                        max = ch.value;
                }
            }
            return max;
        }
    }
    ZodBigInt.create = (params) => {
        var _a;
        return new ZodBigInt({
            checks: [],
            typeName: ZodFirstPartyTypeKind.ZodBigInt,
            coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
            ...processCreateParams(params),
        });
    };
    class ZodBoolean extends ZodType {
        _parse(input) {
            if (this._def.coerce) {
                input.data = Boolean(input.data);
            }
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.boolean) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.boolean,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            return OK(input.data);
        }
    }
    ZodBoolean.create = (params) => {
        return new ZodBoolean({
            typeName: ZodFirstPartyTypeKind.ZodBoolean,
            coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
            ...processCreateParams(params),
        });
    };
    class ZodDate extends ZodType {
        _parse(input) {
            if (this._def.coerce) {
                input.data = new Date(input.data);
            }
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.date) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.date,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            if (isNaN(input.data.getTime())) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_date,
                });
                return INVALID;
            }
            const status = new ParseStatus();
            let ctx = undefined;
            for (const check of this._def.checks) {
                if (check.kind === "min") {
                    if (input.data.getTime() < check.value) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            message: check.message,
                            inclusive: true,
                            exact: false,
                            minimum: check.value,
                            type: "date",
                        });
                        status.dirty();
                    }
                }
                else if (check.kind === "max") {
                    if (input.data.getTime() > check.value) {
                        ctx = this._getOrReturnCtx(input, ctx);
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            message: check.message,
                            inclusive: true,
                            exact: false,
                            maximum: check.value,
                            type: "date",
                        });
                        status.dirty();
                    }
                }
                else {
                    util.assertNever(check);
                }
            }
            return {
                status: status.value,
                value: new Date(input.data.getTime()),
            };
        }
        _addCheck(check) {
            return new ZodDate({
                ...this._def,
                checks: [...this._def.checks, check],
            });
        }
        min(minDate, message) {
            return this._addCheck({
                kind: "min",
                value: minDate.getTime(),
                message: errorUtil.toString(message),
            });
        }
        max(maxDate, message) {
            return this._addCheck({
                kind: "max",
                value: maxDate.getTime(),
                message: errorUtil.toString(message),
            });
        }
        get minDate() {
            let min = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "min") {
                    if (min === null || ch.value > min)
                        min = ch.value;
                }
            }
            return min != null ? new Date(min) : null;
        }
        get maxDate() {
            let max = null;
            for (const ch of this._def.checks) {
                if (ch.kind === "max") {
                    if (max === null || ch.value < max)
                        max = ch.value;
                }
            }
            return max != null ? new Date(max) : null;
        }
    }
    ZodDate.create = (params) => {
        return new ZodDate({
            checks: [],
            coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
            typeName: ZodFirstPartyTypeKind.ZodDate,
            ...processCreateParams(params),
        });
    };
    class ZodSymbol extends ZodType {
        _parse(input) {
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.symbol) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.symbol,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            return OK(input.data);
        }
    }
    ZodSymbol.create = (params) => {
        return new ZodSymbol({
            typeName: ZodFirstPartyTypeKind.ZodSymbol,
            ...processCreateParams(params),
        });
    };
    class ZodUndefined extends ZodType {
        _parse(input) {
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.undefined) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.undefined,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            return OK(input.data);
        }
    }
    ZodUndefined.create = (params) => {
        return new ZodUndefined({
            typeName: ZodFirstPartyTypeKind.ZodUndefined,
            ...processCreateParams(params),
        });
    };
    class ZodNull extends ZodType {
        _parse(input) {
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.null) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.null,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            return OK(input.data);
        }
    }
    ZodNull.create = (params) => {
        return new ZodNull({
            typeName: ZodFirstPartyTypeKind.ZodNull,
            ...processCreateParams(params),
        });
    };
    class ZodAny extends ZodType {
        constructor() {
            super(...arguments);
            // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
            this._any = true;
        }
        _parse(input) {
            return OK(input.data);
        }
    }
    ZodAny.create = (params) => {
        return new ZodAny({
            typeName: ZodFirstPartyTypeKind.ZodAny,
            ...processCreateParams(params),
        });
    };
    class ZodUnknown extends ZodType {
        constructor() {
            super(...arguments);
            // required
            this._unknown = true;
        }
        _parse(input) {
            return OK(input.data);
        }
    }
    ZodUnknown.create = (params) => {
        return new ZodUnknown({
            typeName: ZodFirstPartyTypeKind.ZodUnknown,
            ...processCreateParams(params),
        });
    };
    class ZodNever extends ZodType {
        _parse(input) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.never,
                received: ctx.parsedType,
            });
            return INVALID;
        }
    }
    ZodNever.create = (params) => {
        return new ZodNever({
            typeName: ZodFirstPartyTypeKind.ZodNever,
            ...processCreateParams(params),
        });
    };
    class ZodVoid extends ZodType {
        _parse(input) {
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.undefined) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.void,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            return OK(input.data);
        }
    }
    ZodVoid.create = (params) => {
        return new ZodVoid({
            typeName: ZodFirstPartyTypeKind.ZodVoid,
            ...processCreateParams(params),
        });
    };
    class ZodArray extends ZodType {
        _parse(input) {
            const { ctx, status } = this._processInputParams(input);
            const def = this._def;
            if (ctx.parsedType !== ZodParsedType.array) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.array,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            if (def.exactLength !== null) {
                const tooBig = ctx.data.length > def.exactLength.value;
                const tooSmall = ctx.data.length < def.exactLength.value;
                if (tooBig || tooSmall) {
                    addIssueToContext(ctx, {
                        code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
                        minimum: (tooSmall ? def.exactLength.value : undefined),
                        maximum: (tooBig ? def.exactLength.value : undefined),
                        type: "array",
                        inclusive: true,
                        exact: true,
                        message: def.exactLength.message,
                    });
                    status.dirty();
                }
            }
            if (def.minLength !== null) {
                if (ctx.data.length < def.minLength.value) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: def.minLength.value,
                        type: "array",
                        inclusive: true,
                        exact: false,
                        message: def.minLength.message,
                    });
                    status.dirty();
                }
            }
            if (def.maxLength !== null) {
                if (ctx.data.length > def.maxLength.value) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: def.maxLength.value,
                        type: "array",
                        inclusive: true,
                        exact: false,
                        message: def.maxLength.message,
                    });
                    status.dirty();
                }
            }
            if (ctx.common.async) {
                return Promise.all([...ctx.data].map((item, i) => {
                    return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
                })).then((result) => {
                    return ParseStatus.mergeArray(status, result);
                });
            }
            const result = [...ctx.data].map((item, i) => {
                return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
            });
            return ParseStatus.mergeArray(status, result);
        }
        get element() {
            return this._def.type;
        }
        min(minLength, message) {
            return new ZodArray({
                ...this._def,
                minLength: { value: minLength, message: errorUtil.toString(message) },
            });
        }
        max(maxLength, message) {
            return new ZodArray({
                ...this._def,
                maxLength: { value: maxLength, message: errorUtil.toString(message) },
            });
        }
        length(len, message) {
            return new ZodArray({
                ...this._def,
                exactLength: { value: len, message: errorUtil.toString(message) },
            });
        }
        nonempty(message) {
            return this.min(1, message);
        }
    }
    ZodArray.create = (schema, params) => {
        return new ZodArray({
            type: schema,
            minLength: null,
            maxLength: null,
            exactLength: null,
            typeName: ZodFirstPartyTypeKind.ZodArray,
            ...processCreateParams(params),
        });
    };
    function deepPartialify(schema) {
        if (schema instanceof ZodObject) {
            const newShape = {};
            for (const key in schema.shape) {
                const fieldSchema = schema.shape[key];
                newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
            }
            return new ZodObject({
                ...schema._def,
                shape: () => newShape,
            });
        }
        else if (schema instanceof ZodArray) {
            return new ZodArray({
                ...schema._def,
                type: deepPartialify(schema.element),
            });
        }
        else if (schema instanceof ZodOptional) {
            return ZodOptional.create(deepPartialify(schema.unwrap()));
        }
        else if (schema instanceof ZodNullable) {
            return ZodNullable.create(deepPartialify(schema.unwrap()));
        }
        else if (schema instanceof ZodTuple) {
            return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
        }
        else {
            return schema;
        }
    }
    class ZodObject extends ZodType {
        constructor() {
            super(...arguments);
            this._cached = null;
            /**
             * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
             * If you want to pass through unknown properties, use `.passthrough()` instead.
             */
            this.nonstrict = this.passthrough;
            // extend<
            //   Augmentation extends ZodRawShape,
            //   NewOutput extends util.flatten<{
            //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
            //       ? Augmentation[k]["_output"]
            //       : k extends keyof Output
            //       ? Output[k]
            //       : never;
            //   }>,
            //   NewInput extends util.flatten<{
            //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
            //       ? Augmentation[k]["_input"]
            //       : k extends keyof Input
            //       ? Input[k]
            //       : never;
            //   }>
            // >(
            //   augmentation: Augmentation
            // ): ZodObject<
            //   extendShape<T, Augmentation>,
            //   UnknownKeys,
            //   Catchall,
            //   NewOutput,
            //   NewInput
            // > {
            //   return new ZodObject({
            //     ...this._def,
            //     shape: () => ({
            //       ...this._def.shape(),
            //       ...augmentation,
            //     }),
            //   }) as any;
            // }
            /**
             * @deprecated Use `.extend` instead
             *  */
            this.augment = this.extend;
        }
        _getCached() {
            if (this._cached !== null)
                return this._cached;
            const shape = this._def.shape();
            const keys = util.objectKeys(shape);
            return (this._cached = { shape, keys });
        }
        _parse(input) {
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.object) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.object,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            const { status, ctx } = this._processInputParams(input);
            const { shape, keys: shapeKeys } = this._getCached();
            const extraKeys = [];
            if (!(this._def.catchall instanceof ZodNever &&
                this._def.unknownKeys === "strip")) {
                for (const key in ctx.data) {
                    if (!shapeKeys.includes(key)) {
                        extraKeys.push(key);
                    }
                }
            }
            const pairs = [];
            for (const key of shapeKeys) {
                const keyValidator = shape[key];
                const value = ctx.data[key];
                pairs.push({
                    key: { status: "valid", value: key },
                    value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
                    alwaysSet: key in ctx.data,
                });
            }
            if (this._def.catchall instanceof ZodNever) {
                const unknownKeys = this._def.unknownKeys;
                if (unknownKeys === "passthrough") {
                    for (const key of extraKeys) {
                        pairs.push({
                            key: { status: "valid", value: key },
                            value: { status: "valid", value: ctx.data[key] },
                        });
                    }
                }
                else if (unknownKeys === "strict") {
                    if (extraKeys.length > 0) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.unrecognized_keys,
                            keys: extraKeys,
                        });
                        status.dirty();
                    }
                }
                else if (unknownKeys === "strip") ;
                else {
                    throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
                }
            }
            else {
                // run catchall validation
                const catchall = this._def.catchall;
                for (const key of extraKeys) {
                    const value = ctx.data[key];
                    pairs.push({
                        key: { status: "valid", value: key },
                        value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                        ),
                        alwaysSet: key in ctx.data,
                    });
                }
            }
            if (ctx.common.async) {
                return Promise.resolve()
                    .then(async () => {
                    const syncPairs = [];
                    for (const pair of pairs) {
                        const key = await pair.key;
                        syncPairs.push({
                            key,
                            value: await pair.value,
                            alwaysSet: pair.alwaysSet,
                        });
                    }
                    return syncPairs;
                })
                    .then((syncPairs) => {
                    return ParseStatus.mergeObjectSync(status, syncPairs);
                });
            }
            else {
                return ParseStatus.mergeObjectSync(status, pairs);
            }
        }
        get shape() {
            return this._def.shape();
        }
        strict(message) {
            errorUtil.errToObj;
            return new ZodObject({
                ...this._def,
                unknownKeys: "strict",
                ...(message !== undefined
                    ? {
                        errorMap: (issue, ctx) => {
                            var _a, _b, _c, _d;
                            const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                            if (issue.code === "unrecognized_keys")
                                return {
                                    message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError,
                                };
                            return {
                                message: defaultError,
                            };
                        },
                    }
                    : {}),
            });
        }
        strip() {
            return new ZodObject({
                ...this._def,
                unknownKeys: "strip",
            });
        }
        passthrough() {
            return new ZodObject({
                ...this._def,
                unknownKeys: "passthrough",
            });
        }
        // const AugmentFactory =
        //   <Def extends ZodObjectDef>(def: Def) =>
        //   <Augmentation extends ZodRawShape>(
        //     augmentation: Augmentation
        //   ): ZodObject<
        //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
        //     Def["unknownKeys"],
        //     Def["catchall"]
        //   > => {
        //     return new ZodObject({
        //       ...def,
        //       shape: () => ({
        //         ...def.shape(),
        //         ...augmentation,
        //       }),
        //     }) as any;
        //   };
        extend(augmentation) {
            return new ZodObject({
                ...this._def,
                shape: () => ({
                    ...this._def.shape(),
                    ...augmentation,
                }),
            });
        }
        /**
         * Prior to zod@1.0.12 there was a bug in the
         * inferred type of merged objects. Please
         * upgrade if you are experiencing issues.
         */
        merge(merging) {
            const merged = new ZodObject({
                unknownKeys: merging._def.unknownKeys,
                catchall: merging._def.catchall,
                shape: () => ({
                    ...this._def.shape(),
                    ...merging._def.shape(),
                }),
                typeName: ZodFirstPartyTypeKind.ZodObject,
            });
            return merged;
        }
        // merge<
        //   Incoming extends AnyZodObject,
        //   Augmentation extends Incoming["shape"],
        //   NewOutput extends {
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   },
        //   NewInput extends {
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }
        // >(
        //   merging: Incoming
        // ): ZodObject<
        //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
        //   Incoming["_def"]["unknownKeys"],
        //   Incoming["_def"]["catchall"],
        //   NewOutput,
        //   NewInput
        // > {
        //   const merged: any = new ZodObject({
        //     unknownKeys: merging._def.unknownKeys,
        //     catchall: merging._def.catchall,
        //     shape: () =>
        //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
        //     typeName: ZodFirstPartyTypeKind.ZodObject,
        //   }) as any;
        //   return merged;
        // }
        setKey(key, schema) {
            return this.augment({ [key]: schema });
        }
        // merge<Incoming extends AnyZodObject>(
        //   merging: Incoming
        // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
        // ZodObject<
        //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
        //   Incoming["_def"]["unknownKeys"],
        //   Incoming["_def"]["catchall"]
        // > {
        //   // const mergedShape = objectUtil.mergeShapes(
        //   //   this._def.shape(),
        //   //   merging._def.shape()
        //   // );
        //   const merged: any = new ZodObject({
        //     unknownKeys: merging._def.unknownKeys,
        //     catchall: merging._def.catchall,
        //     shape: () =>
        //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
        //     typeName: ZodFirstPartyTypeKind.ZodObject,
        //   }) as any;
        //   return merged;
        // }
        catchall(index) {
            return new ZodObject({
                ...this._def,
                catchall: index,
            });
        }
        pick(mask) {
            const shape = {};
            util.objectKeys(mask).forEach((key) => {
                if (mask[key] && this.shape[key]) {
                    shape[key] = this.shape[key];
                }
            });
            return new ZodObject({
                ...this._def,
                shape: () => shape,
            });
        }
        omit(mask) {
            const shape = {};
            util.objectKeys(this.shape).forEach((key) => {
                if (!mask[key]) {
                    shape[key] = this.shape[key];
                }
            });
            return new ZodObject({
                ...this._def,
                shape: () => shape,
            });
        }
        /**
         * @deprecated
         */
        deepPartial() {
            return deepPartialify(this);
        }
        partial(mask) {
            const newShape = {};
            util.objectKeys(this.shape).forEach((key) => {
                const fieldSchema = this.shape[key];
                if (mask && !mask[key]) {
                    newShape[key] = fieldSchema;
                }
                else {
                    newShape[key] = fieldSchema.optional();
                }
            });
            return new ZodObject({
                ...this._def,
                shape: () => newShape,
            });
        }
        required(mask) {
            const newShape = {};
            util.objectKeys(this.shape).forEach((key) => {
                if (mask && !mask[key]) {
                    newShape[key] = this.shape[key];
                }
                else {
                    const fieldSchema = this.shape[key];
                    let newField = fieldSchema;
                    while (newField instanceof ZodOptional) {
                        newField = newField._def.innerType;
                    }
                    newShape[key] = newField;
                }
            });
            return new ZodObject({
                ...this._def,
                shape: () => newShape,
            });
        }
        keyof() {
            return createZodEnum(util.objectKeys(this.shape));
        }
    }
    ZodObject.create = (shape, params) => {
        return new ZodObject({
            shape: () => shape,
            unknownKeys: "strip",
            catchall: ZodNever.create(),
            typeName: ZodFirstPartyTypeKind.ZodObject,
            ...processCreateParams(params),
        });
    };
    ZodObject.strictCreate = (shape, params) => {
        return new ZodObject({
            shape: () => shape,
            unknownKeys: "strict",
            catchall: ZodNever.create(),
            typeName: ZodFirstPartyTypeKind.ZodObject,
            ...processCreateParams(params),
        });
    };
    ZodObject.lazycreate = (shape, params) => {
        return new ZodObject({
            shape,
            unknownKeys: "strip",
            catchall: ZodNever.create(),
            typeName: ZodFirstPartyTypeKind.ZodObject,
            ...processCreateParams(params),
        });
    };
    class ZodUnion extends ZodType {
        _parse(input) {
            const { ctx } = this._processInputParams(input);
            const options = this._def.options;
            function handleResults(results) {
                // return first issue-free validation if it exists
                for (const result of results) {
                    if (result.result.status === "valid") {
                        return result.result;
                    }
                }
                for (const result of results) {
                    if (result.result.status === "dirty") {
                        // add issues from dirty option
                        ctx.common.issues.push(...result.ctx.common.issues);
                        return result.result;
                    }
                }
                // return invalid
                const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_union,
                    unionErrors,
                });
                return INVALID;
            }
            if (ctx.common.async) {
                return Promise.all(options.map(async (option) => {
                    const childCtx = {
                        ...ctx,
                        common: {
                            ...ctx.common,
                            issues: [],
                        },
                        parent: null,
                    };
                    return {
                        result: await option._parseAsync({
                            data: ctx.data,
                            path: ctx.path,
                            parent: childCtx,
                        }),
                        ctx: childCtx,
                    };
                })).then(handleResults);
            }
            else {
                let dirty = undefined;
                const issues = [];
                for (const option of options) {
                    const childCtx = {
                        ...ctx,
                        common: {
                            ...ctx.common,
                            issues: [],
                        },
                        parent: null,
                    };
                    const result = option._parseSync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: childCtx,
                    });
                    if (result.status === "valid") {
                        return result;
                    }
                    else if (result.status === "dirty" && !dirty) {
                        dirty = { result, ctx: childCtx };
                    }
                    if (childCtx.common.issues.length) {
                        issues.push(childCtx.common.issues);
                    }
                }
                if (dirty) {
                    ctx.common.issues.push(...dirty.ctx.common.issues);
                    return dirty.result;
                }
                const unionErrors = issues.map((issues) => new ZodError(issues));
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_union,
                    unionErrors,
                });
                return INVALID;
            }
        }
        get options() {
            return this._def.options;
        }
    }
    ZodUnion.create = (types, params) => {
        return new ZodUnion({
            options: types,
            typeName: ZodFirstPartyTypeKind.ZodUnion,
            ...processCreateParams(params),
        });
    };
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    //////////                                 //////////
    //////////      ZodDiscriminatedUnion      //////////
    //////////                                 //////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    const getDiscriminator = (type) => {
        if (type instanceof ZodLazy) {
            return getDiscriminator(type.schema);
        }
        else if (type instanceof ZodEffects) {
            return getDiscriminator(type.innerType());
        }
        else if (type instanceof ZodLiteral) {
            return [type.value];
        }
        else if (type instanceof ZodEnum) {
            return type.options;
        }
        else if (type instanceof ZodNativeEnum) {
            // eslint-disable-next-line ban/ban
            return Object.keys(type.enum);
        }
        else if (type instanceof ZodDefault) {
            return getDiscriminator(type._def.innerType);
        }
        else if (type instanceof ZodUndefined) {
            return [undefined];
        }
        else if (type instanceof ZodNull) {
            return [null];
        }
        else {
            return null;
        }
    };
    class ZodDiscriminatedUnion extends ZodType {
        _parse(input) {
            const { ctx } = this._processInputParams(input);
            if (ctx.parsedType !== ZodParsedType.object) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.object,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            const discriminator = this.discriminator;
            const discriminatorValue = ctx.data[discriminator];
            const option = this.optionsMap.get(discriminatorValue);
            if (!option) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_union_discriminator,
                    options: Array.from(this.optionsMap.keys()),
                    path: [discriminator],
                });
                return INVALID;
            }
            if (ctx.common.async) {
                return option._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
            }
            else {
                return option._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
            }
        }
        get discriminator() {
            return this._def.discriminator;
        }
        get options() {
            return this._def.options;
        }
        get optionsMap() {
            return this._def.optionsMap;
        }
        /**
         * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
         * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
         * have a different value for each object in the union.
         * @param discriminator the name of the discriminator property
         * @param types an array of object schemas
         * @param params
         */
        static create(discriminator, options, params) {
            // Get all the valid discriminator values
            const optionsMap = new Map();
            // try {
            for (const type of options) {
                const discriminatorValues = getDiscriminator(type.shape[discriminator]);
                if (!discriminatorValues) {
                    throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
                }
                for (const value of discriminatorValues) {
                    if (optionsMap.has(value)) {
                        throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                    }
                    optionsMap.set(value, type);
                }
            }
            return new ZodDiscriminatedUnion({
                typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
                discriminator,
                options,
                optionsMap,
                ...processCreateParams(params),
            });
        }
    }
    function mergeValues(a, b) {
        const aType = getParsedType(a);
        const bType = getParsedType(b);
        if (a === b) {
            return { valid: true, data: a };
        }
        else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
            const bKeys = util.objectKeys(b);
            const sharedKeys = util
                .objectKeys(a)
                .filter((key) => bKeys.indexOf(key) !== -1);
            const newObj = { ...a, ...b };
            for (const key of sharedKeys) {
                const sharedValue = mergeValues(a[key], b[key]);
                if (!sharedValue.valid) {
                    return { valid: false };
                }
                newObj[key] = sharedValue.data;
            }
            return { valid: true, data: newObj };
        }
        else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
            if (a.length !== b.length) {
                return { valid: false };
            }
            const newArray = [];
            for (let index = 0; index < a.length; index++) {
                const itemA = a[index];
                const itemB = b[index];
                const sharedValue = mergeValues(itemA, itemB);
                if (!sharedValue.valid) {
                    return { valid: false };
                }
                newArray.push(sharedValue.data);
            }
            return { valid: true, data: newArray };
        }
        else if (aType === ZodParsedType.date &&
            bType === ZodParsedType.date &&
            +a === +b) {
            return { valid: true, data: a };
        }
        else {
            return { valid: false };
        }
    }
    class ZodIntersection extends ZodType {
        _parse(input) {
            const { status, ctx } = this._processInputParams(input);
            const handleParsed = (parsedLeft, parsedRight) => {
                if (isAborted(parsedLeft) || isAborted(parsedRight)) {
                    return INVALID;
                }
                const merged = mergeValues(parsedLeft.value, parsedRight.value);
                if (!merged.valid) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_intersection_types,
                    });
                    return INVALID;
                }
                if (isDirty(parsedLeft) || isDirty(parsedRight)) {
                    status.dirty();
                }
                return { status: status.value, value: merged.data };
            };
            if (ctx.common.async) {
                return Promise.all([
                    this._def.left._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx,
                    }),
                    this._def.right._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx,
                    }),
                ]).then(([left, right]) => handleParsed(left, right));
            }
            else {
                return handleParsed(this._def.left._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }), this._def.right._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }));
            }
        }
    }
    ZodIntersection.create = (left, right, params) => {
        return new ZodIntersection({
            left: left,
            right: right,
            typeName: ZodFirstPartyTypeKind.ZodIntersection,
            ...processCreateParams(params),
        });
    };
    class ZodTuple extends ZodType {
        _parse(input) {
            const { status, ctx } = this._processInputParams(input);
            if (ctx.parsedType !== ZodParsedType.array) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.array,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            if (ctx.data.length < this._def.items.length) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: this._def.items.length,
                    inclusive: true,
                    exact: false,
                    type: "array",
                });
                return INVALID;
            }
            const rest = this._def.rest;
            if (!rest && ctx.data.length > this._def.items.length) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: this._def.items.length,
                    inclusive: true,
                    exact: false,
                    type: "array",
                });
                status.dirty();
            }
            const items = [...ctx.data]
                .map((item, itemIndex) => {
                const schema = this._def.items[itemIndex] || this._def.rest;
                if (!schema)
                    return null;
                return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
            })
                .filter((x) => !!x); // filter nulls
            if (ctx.common.async) {
                return Promise.all(items).then((results) => {
                    return ParseStatus.mergeArray(status, results);
                });
            }
            else {
                return ParseStatus.mergeArray(status, items);
            }
        }
        get items() {
            return this._def.items;
        }
        rest(rest) {
            return new ZodTuple({
                ...this._def,
                rest,
            });
        }
    }
    ZodTuple.create = (schemas, params) => {
        if (!Array.isArray(schemas)) {
            throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
        }
        return new ZodTuple({
            items: schemas,
            typeName: ZodFirstPartyTypeKind.ZodTuple,
            rest: null,
            ...processCreateParams(params),
        });
    };
    class ZodRecord extends ZodType {
        get keySchema() {
            return this._def.keyType;
        }
        get valueSchema() {
            return this._def.valueType;
        }
        _parse(input) {
            const { status, ctx } = this._processInputParams(input);
            if (ctx.parsedType !== ZodParsedType.object) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.object,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            const pairs = [];
            const keyType = this._def.keyType;
            const valueType = this._def.valueType;
            for (const key in ctx.data) {
                pairs.push({
                    key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                    value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
                });
            }
            if (ctx.common.async) {
                return ParseStatus.mergeObjectAsync(status, pairs);
            }
            else {
                return ParseStatus.mergeObjectSync(status, pairs);
            }
        }
        get element() {
            return this._def.valueType;
        }
        static create(first, second, third) {
            if (second instanceof ZodType) {
                return new ZodRecord({
                    keyType: first,
                    valueType: second,
                    typeName: ZodFirstPartyTypeKind.ZodRecord,
                    ...processCreateParams(third),
                });
            }
            return new ZodRecord({
                keyType: ZodString.create(),
                valueType: first,
                typeName: ZodFirstPartyTypeKind.ZodRecord,
                ...processCreateParams(second),
            });
        }
    }
    class ZodMap extends ZodType {
        get keySchema() {
            return this._def.keyType;
        }
        get valueSchema() {
            return this._def.valueType;
        }
        _parse(input) {
            const { status, ctx } = this._processInputParams(input);
            if (ctx.parsedType !== ZodParsedType.map) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.map,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            const keyType = this._def.keyType;
            const valueType = this._def.valueType;
            const pairs = [...ctx.data.entries()].map(([key, value], index) => {
                return {
                    key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                    value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
                };
            });
            if (ctx.common.async) {
                const finalMap = new Map();
                return Promise.resolve().then(async () => {
                    for (const pair of pairs) {
                        const key = await pair.key;
                        const value = await pair.value;
                        if (key.status === "aborted" || value.status === "aborted") {
                            return INVALID;
                        }
                        if (key.status === "dirty" || value.status === "dirty") {
                            status.dirty();
                        }
                        finalMap.set(key.value, value.value);
                    }
                    return { status: status.value, value: finalMap };
                });
            }
            else {
                const finalMap = new Map();
                for (const pair of pairs) {
                    const key = pair.key;
                    const value = pair.value;
                    if (key.status === "aborted" || value.status === "aborted") {
                        return INVALID;
                    }
                    if (key.status === "dirty" || value.status === "dirty") {
                        status.dirty();
                    }
                    finalMap.set(key.value, value.value);
                }
                return { status: status.value, value: finalMap };
            }
        }
    }
    ZodMap.create = (keyType, valueType, params) => {
        return new ZodMap({
            valueType,
            keyType,
            typeName: ZodFirstPartyTypeKind.ZodMap,
            ...processCreateParams(params),
        });
    };
    class ZodSet extends ZodType {
        _parse(input) {
            const { status, ctx } = this._processInputParams(input);
            if (ctx.parsedType !== ZodParsedType.set) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.set,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            const def = this._def;
            if (def.minSize !== null) {
                if (ctx.data.size < def.minSize.value) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: def.minSize.value,
                        type: "set",
                        inclusive: true,
                        exact: false,
                        message: def.minSize.message,
                    });
                    status.dirty();
                }
            }
            if (def.maxSize !== null) {
                if (ctx.data.size > def.maxSize.value) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: def.maxSize.value,
                        type: "set",
                        inclusive: true,
                        exact: false,
                        message: def.maxSize.message,
                    });
                    status.dirty();
                }
            }
            const valueType = this._def.valueType;
            function finalizeSet(elements) {
                const parsedSet = new Set();
                for (const element of elements) {
                    if (element.status === "aborted")
                        return INVALID;
                    if (element.status === "dirty")
                        status.dirty();
                    parsedSet.add(element.value);
                }
                return { status: status.value, value: parsedSet };
            }
            const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
            if (ctx.common.async) {
                return Promise.all(elements).then((elements) => finalizeSet(elements));
            }
            else {
                return finalizeSet(elements);
            }
        }
        min(minSize, message) {
            return new ZodSet({
                ...this._def,
                minSize: { value: minSize, message: errorUtil.toString(message) },
            });
        }
        max(maxSize, message) {
            return new ZodSet({
                ...this._def,
                maxSize: { value: maxSize, message: errorUtil.toString(message) },
            });
        }
        size(size, message) {
            return this.min(size, message).max(size, message);
        }
        nonempty(message) {
            return this.min(1, message);
        }
    }
    ZodSet.create = (valueType, params) => {
        return new ZodSet({
            valueType,
            minSize: null,
            maxSize: null,
            typeName: ZodFirstPartyTypeKind.ZodSet,
            ...processCreateParams(params),
        });
    };
    class ZodFunction extends ZodType {
        constructor() {
            super(...arguments);
            this.validate = this.implement;
        }
        _parse(input) {
            const { ctx } = this._processInputParams(input);
            if (ctx.parsedType !== ZodParsedType.function) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.function,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            function makeArgsIssue(args, error) {
                return makeIssue({
                    data: args,
                    path: ctx.path,
                    errorMaps: [
                        ctx.common.contextualErrorMap,
                        ctx.schemaErrorMap,
                        getErrorMap(),
                        errorMap,
                    ].filter((x) => !!x),
                    issueData: {
                        code: ZodIssueCode.invalid_arguments,
                        argumentsError: error,
                    },
                });
            }
            function makeReturnsIssue(returns, error) {
                return makeIssue({
                    data: returns,
                    path: ctx.path,
                    errorMaps: [
                        ctx.common.contextualErrorMap,
                        ctx.schemaErrorMap,
                        getErrorMap(),
                        errorMap,
                    ].filter((x) => !!x),
                    issueData: {
                        code: ZodIssueCode.invalid_return_type,
                        returnTypeError: error,
                    },
                });
            }
            const params = { errorMap: ctx.common.contextualErrorMap };
            const fn = ctx.data;
            if (this._def.returns instanceof ZodPromise) {
                // Would love a way to avoid disabling this rule, but we need
                // an alias (using an arrow function was what caused 2651).
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const me = this;
                return OK(async function (...args) {
                    const error = new ZodError([]);
                    const parsedArgs = await me._def.args
                        .parseAsync(args, params)
                        .catch((e) => {
                        error.addIssue(makeArgsIssue(args, e));
                        throw error;
                    });
                    const result = await Reflect.apply(fn, this, parsedArgs);
                    const parsedReturns = await me._def.returns._def.type
                        .parseAsync(result, params)
                        .catch((e) => {
                        error.addIssue(makeReturnsIssue(result, e));
                        throw error;
                    });
                    return parsedReturns;
                });
            }
            else {
                // Would love a way to avoid disabling this rule, but we need
                // an alias (using an arrow function was what caused 2651).
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const me = this;
                return OK(function (...args) {
                    const parsedArgs = me._def.args.safeParse(args, params);
                    if (!parsedArgs.success) {
                        throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
                    }
                    const result = Reflect.apply(fn, this, parsedArgs.data);
                    const parsedReturns = me._def.returns.safeParse(result, params);
                    if (!parsedReturns.success) {
                        throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
                    }
                    return parsedReturns.data;
                });
            }
        }
        parameters() {
            return this._def.args;
        }
        returnType() {
            return this._def.returns;
        }
        args(...items) {
            return new ZodFunction({
                ...this._def,
                args: ZodTuple.create(items).rest(ZodUnknown.create()),
            });
        }
        returns(returnType) {
            return new ZodFunction({
                ...this._def,
                returns: returnType,
            });
        }
        implement(func) {
            const validatedFunc = this.parse(func);
            return validatedFunc;
        }
        strictImplement(func) {
            const validatedFunc = this.parse(func);
            return validatedFunc;
        }
        static create(args, returns, params) {
            return new ZodFunction({
                args: (args
                    ? args
                    : ZodTuple.create([]).rest(ZodUnknown.create())),
                returns: returns || ZodUnknown.create(),
                typeName: ZodFirstPartyTypeKind.ZodFunction,
                ...processCreateParams(params),
            });
        }
    }
    class ZodLazy extends ZodType {
        get schema() {
            return this._def.getter();
        }
        _parse(input) {
            const { ctx } = this._processInputParams(input);
            const lazySchema = this._def.getter();
            return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
        }
    }
    ZodLazy.create = (getter, params) => {
        return new ZodLazy({
            getter: getter,
            typeName: ZodFirstPartyTypeKind.ZodLazy,
            ...processCreateParams(params),
        });
    };
    class ZodLiteral extends ZodType {
        _parse(input) {
            if (input.data !== this._def.value) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    received: ctx.data,
                    code: ZodIssueCode.invalid_literal,
                    expected: this._def.value,
                });
                return INVALID;
            }
            return { status: "valid", value: input.data };
        }
        get value() {
            return this._def.value;
        }
    }
    ZodLiteral.create = (value, params) => {
        return new ZodLiteral({
            value: value,
            typeName: ZodFirstPartyTypeKind.ZodLiteral,
            ...processCreateParams(params),
        });
    };
    function createZodEnum(values, params) {
        return new ZodEnum({
            values,
            typeName: ZodFirstPartyTypeKind.ZodEnum,
            ...processCreateParams(params),
        });
    }
    class ZodEnum extends ZodType {
        _parse(input) {
            if (typeof input.data !== "string") {
                const ctx = this._getOrReturnCtx(input);
                const expectedValues = this._def.values;
                addIssueToContext(ctx, {
                    expected: util.joinValues(expectedValues),
                    received: ctx.parsedType,
                    code: ZodIssueCode.invalid_type,
                });
                return INVALID;
            }
            if (this._def.values.indexOf(input.data) === -1) {
                const ctx = this._getOrReturnCtx(input);
                const expectedValues = this._def.values;
                addIssueToContext(ctx, {
                    received: ctx.data,
                    code: ZodIssueCode.invalid_enum_value,
                    options: expectedValues,
                });
                return INVALID;
            }
            return OK(input.data);
        }
        get options() {
            return this._def.values;
        }
        get enum() {
            const enumValues = {};
            for (const val of this._def.values) {
                enumValues[val] = val;
            }
            return enumValues;
        }
        get Values() {
            const enumValues = {};
            for (const val of this._def.values) {
                enumValues[val] = val;
            }
            return enumValues;
        }
        get Enum() {
            const enumValues = {};
            for (const val of this._def.values) {
                enumValues[val] = val;
            }
            return enumValues;
        }
        extract(values) {
            return ZodEnum.create(values);
        }
        exclude(values) {
            return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)));
        }
    }
    ZodEnum.create = createZodEnum;
    class ZodNativeEnum extends ZodType {
        _parse(input) {
            const nativeEnumValues = util.getValidEnumValues(this._def.values);
            const ctx = this._getOrReturnCtx(input);
            if (ctx.parsedType !== ZodParsedType.string &&
                ctx.parsedType !== ZodParsedType.number) {
                const expectedValues = util.objectValues(nativeEnumValues);
                addIssueToContext(ctx, {
                    expected: util.joinValues(expectedValues),
                    received: ctx.parsedType,
                    code: ZodIssueCode.invalid_type,
                });
                return INVALID;
            }
            if (nativeEnumValues.indexOf(input.data) === -1) {
                const expectedValues = util.objectValues(nativeEnumValues);
                addIssueToContext(ctx, {
                    received: ctx.data,
                    code: ZodIssueCode.invalid_enum_value,
                    options: expectedValues,
                });
                return INVALID;
            }
            return OK(input.data);
        }
        get enum() {
            return this._def.values;
        }
    }
    ZodNativeEnum.create = (values, params) => {
        return new ZodNativeEnum({
            values: values,
            typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
            ...processCreateParams(params),
        });
    };
    class ZodPromise extends ZodType {
        unwrap() {
            return this._def.type;
        }
        _parse(input) {
            const { ctx } = this._processInputParams(input);
            if (ctx.parsedType !== ZodParsedType.promise &&
                ctx.common.async === false) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.promise,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            const promisified = ctx.parsedType === ZodParsedType.promise
                ? ctx.data
                : Promise.resolve(ctx.data);
            return OK(promisified.then((data) => {
                return this._def.type.parseAsync(data, {
                    path: ctx.path,
                    errorMap: ctx.common.contextualErrorMap,
                });
            }));
        }
    }
    ZodPromise.create = (schema, params) => {
        return new ZodPromise({
            type: schema,
            typeName: ZodFirstPartyTypeKind.ZodPromise,
            ...processCreateParams(params),
        });
    };
    class ZodEffects extends ZodType {
        innerType() {
            return this._def.schema;
        }
        sourceType() {
            return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
                ? this._def.schema.sourceType()
                : this._def.schema;
        }
        _parse(input) {
            const { status, ctx } = this._processInputParams(input);
            const effect = this._def.effect || null;
            const checkCtx = {
                addIssue: (arg) => {
                    addIssueToContext(ctx, arg);
                    if (arg.fatal) {
                        status.abort();
                    }
                    else {
                        status.dirty();
                    }
                },
                get path() {
                    return ctx.path;
                },
            };
            checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
            if (effect.type === "preprocess") {
                const processed = effect.transform(ctx.data, checkCtx);
                if (ctx.common.issues.length) {
                    return {
                        status: "dirty",
                        value: ctx.data,
                    };
                }
                if (ctx.common.async) {
                    return Promise.resolve(processed).then((processed) => {
                        return this._def.schema._parseAsync({
                            data: processed,
                            path: ctx.path,
                            parent: ctx,
                        });
                    });
                }
                else {
                    return this._def.schema._parseSync({
                        data: processed,
                        path: ctx.path,
                        parent: ctx,
                    });
                }
            }
            if (effect.type === "refinement") {
                const executeRefinement = (acc
                // effect: RefinementEffect<any>
                ) => {
                    const result = effect.refinement(acc, checkCtx);
                    if (ctx.common.async) {
                        return Promise.resolve(result);
                    }
                    if (result instanceof Promise) {
                        throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                    }
                    return acc;
                };
                if (ctx.common.async === false) {
                    const inner = this._def.schema._parseSync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx,
                    });
                    if (inner.status === "aborted")
                        return INVALID;
                    if (inner.status === "dirty")
                        status.dirty();
                    // return value is ignored
                    executeRefinement(inner.value);
                    return { status: status.value, value: inner.value };
                }
                else {
                    return this._def.schema
                        ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                        .then((inner) => {
                        if (inner.status === "aborted")
                            return INVALID;
                        if (inner.status === "dirty")
                            status.dirty();
                        return executeRefinement(inner.value).then(() => {
                            return { status: status.value, value: inner.value };
                        });
                    });
                }
            }
            if (effect.type === "transform") {
                if (ctx.common.async === false) {
                    const base = this._def.schema._parseSync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx,
                    });
                    if (!isValid(base))
                        return base;
                    const result = effect.transform(base.value, checkCtx);
                    if (result instanceof Promise) {
                        throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                    }
                    return { status: status.value, value: result };
                }
                else {
                    return this._def.schema
                        ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                        .then((base) => {
                        if (!isValid(base))
                            return base;
                        return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
                    });
                }
            }
            util.assertNever(effect);
        }
    }
    ZodEffects.create = (schema, effect, params) => {
        return new ZodEffects({
            schema,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect,
            ...processCreateParams(params),
        });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
        return new ZodEffects({
            schema,
            effect: { type: "preprocess", transform: preprocess },
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            ...processCreateParams(params),
        });
    };
    class ZodOptional extends ZodType {
        _parse(input) {
            const parsedType = this._getType(input);
            if (parsedType === ZodParsedType.undefined) {
                return OK(undefined);
            }
            return this._def.innerType._parse(input);
        }
        unwrap() {
            return this._def.innerType;
        }
    }
    ZodOptional.create = (type, params) => {
        return new ZodOptional({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodOptional,
            ...processCreateParams(params),
        });
    };
    class ZodNullable extends ZodType {
        _parse(input) {
            const parsedType = this._getType(input);
            if (parsedType === ZodParsedType.null) {
                return OK(null);
            }
            return this._def.innerType._parse(input);
        }
        unwrap() {
            return this._def.innerType;
        }
    }
    ZodNullable.create = (type, params) => {
        return new ZodNullable({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodNullable,
            ...processCreateParams(params),
        });
    };
    class ZodDefault extends ZodType {
        _parse(input) {
            const { ctx } = this._processInputParams(input);
            let data = ctx.data;
            if (ctx.parsedType === ZodParsedType.undefined) {
                data = this._def.defaultValue();
            }
            return this._def.innerType._parse({
                data,
                path: ctx.path,
                parent: ctx,
            });
        }
        removeDefault() {
            return this._def.innerType;
        }
    }
    ZodDefault.create = (type, params) => {
        return new ZodDefault({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodDefault,
            defaultValue: typeof params.default === "function"
                ? params.default
                : () => params.default,
            ...processCreateParams(params),
        });
    };
    class ZodCatch extends ZodType {
        _parse(input) {
            const { ctx } = this._processInputParams(input);
            // newCtx is used to not collect issues from inner types in ctx
            const newCtx = {
                ...ctx,
                common: {
                    ...ctx.common,
                    issues: [],
                },
            };
            const result = this._def.innerType._parse({
                data: newCtx.data,
                path: newCtx.path,
                parent: {
                    ...newCtx,
                },
            });
            if (isAsync(result)) {
                return result.then((result) => {
                    return {
                        status: "valid",
                        value: result.status === "valid"
                            ? result.value
                            : this._def.catchValue({
                                get error() {
                                    return new ZodError(newCtx.common.issues);
                                },
                                input: newCtx.data,
                            }),
                    };
                });
            }
            else {
                return {
                    status: "valid",
                    value: result.status === "valid"
                        ? result.value
                        : this._def.catchValue({
                            get error() {
                                return new ZodError(newCtx.common.issues);
                            },
                            input: newCtx.data,
                        }),
                };
            }
        }
        removeCatch() {
            return this._def.innerType;
        }
    }
    ZodCatch.create = (type, params) => {
        return new ZodCatch({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodCatch,
            catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
            ...processCreateParams(params),
        });
    };
    class ZodNaN extends ZodType {
        _parse(input) {
            const parsedType = this._getType(input);
            if (parsedType !== ZodParsedType.nan) {
                const ctx = this._getOrReturnCtx(input);
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_type,
                    expected: ZodParsedType.nan,
                    received: ctx.parsedType,
                });
                return INVALID;
            }
            return { status: "valid", value: input.data };
        }
    }
    ZodNaN.create = (params) => {
        return new ZodNaN({
            typeName: ZodFirstPartyTypeKind.ZodNaN,
            ...processCreateParams(params),
        });
    };
    const BRAND = Symbol("zod_brand");
    class ZodBranded extends ZodType {
        _parse(input) {
            const { ctx } = this._processInputParams(input);
            const data = ctx.data;
            return this._def.type._parse({
                data,
                path: ctx.path,
                parent: ctx,
            });
        }
        unwrap() {
            return this._def.type;
        }
    }
    class ZodPipeline extends ZodType {
        _parse(input) {
            const { status, ctx } = this._processInputParams(input);
            if (ctx.common.async) {
                const handleAsync = async () => {
                    const inResult = await this._def.in._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: ctx,
                    });
                    if (inResult.status === "aborted")
                        return INVALID;
                    if (inResult.status === "dirty") {
                        status.dirty();
                        return DIRTY(inResult.value);
                    }
                    else {
                        return this._def.out._parseAsync({
                            data: inResult.value,
                            path: ctx.path,
                            parent: ctx,
                        });
                    }
                };
                return handleAsync();
            }
            else {
                const inResult = this._def.in._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inResult.status === "aborted")
                    return INVALID;
                if (inResult.status === "dirty") {
                    status.dirty();
                    return {
                        status: "dirty",
                        value: inResult.value,
                    };
                }
                else {
                    return this._def.out._parseSync({
                        data: inResult.value,
                        path: ctx.path,
                        parent: ctx,
                    });
                }
            }
        }
        static create(a, b) {
            return new ZodPipeline({
                in: a,
                out: b,
                typeName: ZodFirstPartyTypeKind.ZodPipeline,
            });
        }
    }
    class ZodReadonly extends ZodType {
        _parse(input) {
            const result = this._def.innerType._parse(input);
            if (isValid(result)) {
                result.value = Object.freeze(result.value);
            }
            return result;
        }
    }
    ZodReadonly.create = (type, params) => {
        return new ZodReadonly({
            innerType: type,
            typeName: ZodFirstPartyTypeKind.ZodReadonly,
            ...processCreateParams(params),
        });
    };
    const custom = (check, params = {},
    /**
     * @deprecated
     *
     * Pass `fatal` into the params object instead:
     *
     * ```ts
     * z.string().custom((val) => val.length > 5, { fatal: false })
     * ```
     *
     */
    fatal) => {
        if (check)
            return ZodAny.create().superRefine((data, ctx) => {
                var _a, _b;
                if (!check(data)) {
                    const p = typeof params === "function"
                        ? params(data)
                        : typeof params === "string"
                            ? { message: params }
                            : params;
                    const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
                    const p2 = typeof p === "string" ? { message: p } : p;
                    ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
                }
            });
        return ZodAny.create();
    };
    const late = {
        object: ZodObject.lazycreate,
    };
    var ZodFirstPartyTypeKind;
    (function (ZodFirstPartyTypeKind) {
        ZodFirstPartyTypeKind["ZodString"] = "ZodString";
        ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
        ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
        ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
        ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
        ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
        ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
        ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
        ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
        ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
        ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
        ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
        ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
        ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
        ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
        ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
        ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
        ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
        ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
        ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
        ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
        ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
        ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
        ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
        ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
        ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
        ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
        ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
        ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
        ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
        ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
        ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
        ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
        ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
        ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
        ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
    })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
    const instanceOfType = (
    // const instanceOfType = <T extends new (...args: any[]) => any>(
    cls, params = {
        message: `Input not instance of ${cls.name}`,
    }) => custom((data) => data instanceof cls, params);
    const stringType = ZodString.create;
    const numberType = ZodNumber.create;
    const nanType = ZodNaN.create;
    const bigIntType = ZodBigInt.create;
    const booleanType = ZodBoolean.create;
    const dateType = ZodDate.create;
    const symbolType = ZodSymbol.create;
    const undefinedType = ZodUndefined.create;
    const nullType = ZodNull.create;
    const anyType = ZodAny.create;
    const unknownType = ZodUnknown.create;
    const neverType = ZodNever.create;
    const voidType = ZodVoid.create;
    const arrayType = ZodArray.create;
    const objectType = ZodObject.create;
    const strictObjectType = ZodObject.strictCreate;
    const unionType = ZodUnion.create;
    const discriminatedUnionType = ZodDiscriminatedUnion.create;
    const intersectionType = ZodIntersection.create;
    const tupleType = ZodTuple.create;
    const recordType = ZodRecord.create;
    const mapType = ZodMap.create;
    const setType = ZodSet.create;
    const functionType = ZodFunction.create;
    const lazyType = ZodLazy.create;
    const literalType = ZodLiteral.create;
    const enumType = ZodEnum.create;
    const nativeEnumType = ZodNativeEnum.create;
    const promiseType = ZodPromise.create;
    const effectsType = ZodEffects.create;
    const optionalType = ZodOptional.create;
    const nullableType = ZodNullable.create;
    const preprocessType = ZodEffects.createWithPreprocess;
    const pipelineType = ZodPipeline.create;
    const ostring = () => stringType().optional();
    const onumber = () => numberType().optional();
    const oboolean = () => booleanType().optional();
    const coerce = {
        string: ((arg) => ZodString.create({ ...arg, coerce: true })),
        number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
        boolean: ((arg) => ZodBoolean.create({
            ...arg,
            coerce: true,
        })),
        bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
        date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
    };
    const NEVER = INVALID;

    var z = /*#__PURE__*/Object.freeze({
        __proto__: null,
        defaultErrorMap: errorMap,
        setErrorMap: setErrorMap,
        getErrorMap: getErrorMap,
        makeIssue: makeIssue,
        EMPTY_PATH: EMPTY_PATH,
        addIssueToContext: addIssueToContext,
        ParseStatus: ParseStatus,
        INVALID: INVALID,
        DIRTY: DIRTY,
        OK: OK,
        isAborted: isAborted,
        isDirty: isDirty,
        isValid: isValid,
        isAsync: isAsync,
        get util () { return util; },
        get objectUtil () { return objectUtil; },
        ZodParsedType: ZodParsedType,
        getParsedType: getParsedType,
        ZodType: ZodType,
        ZodString: ZodString,
        ZodNumber: ZodNumber,
        ZodBigInt: ZodBigInt,
        ZodBoolean: ZodBoolean,
        ZodDate: ZodDate,
        ZodSymbol: ZodSymbol,
        ZodUndefined: ZodUndefined,
        ZodNull: ZodNull,
        ZodAny: ZodAny,
        ZodUnknown: ZodUnknown,
        ZodNever: ZodNever,
        ZodVoid: ZodVoid,
        ZodArray: ZodArray,
        ZodObject: ZodObject,
        ZodUnion: ZodUnion,
        ZodDiscriminatedUnion: ZodDiscriminatedUnion,
        ZodIntersection: ZodIntersection,
        ZodTuple: ZodTuple,
        ZodRecord: ZodRecord,
        ZodMap: ZodMap,
        ZodSet: ZodSet,
        ZodFunction: ZodFunction,
        ZodLazy: ZodLazy,
        ZodLiteral: ZodLiteral,
        ZodEnum: ZodEnum,
        ZodNativeEnum: ZodNativeEnum,
        ZodPromise: ZodPromise,
        ZodEffects: ZodEffects,
        ZodTransformer: ZodEffects,
        ZodOptional: ZodOptional,
        ZodNullable: ZodNullable,
        ZodDefault: ZodDefault,
        ZodCatch: ZodCatch,
        ZodNaN: ZodNaN,
        BRAND: BRAND,
        ZodBranded: ZodBranded,
        ZodPipeline: ZodPipeline,
        ZodReadonly: ZodReadonly,
        custom: custom,
        Schema: ZodType,
        ZodSchema: ZodType,
        late: late,
        get ZodFirstPartyTypeKind () { return ZodFirstPartyTypeKind; },
        coerce: coerce,
        any: anyType,
        array: arrayType,
        bigint: bigIntType,
        boolean: booleanType,
        date: dateType,
        discriminatedUnion: discriminatedUnionType,
        effect: effectsType,
        'enum': enumType,
        'function': functionType,
        'instanceof': instanceOfType,
        intersection: intersectionType,
        lazy: lazyType,
        literal: literalType,
        map: mapType,
        nan: nanType,
        nativeEnum: nativeEnumType,
        never: neverType,
        'null': nullType,
        nullable: nullableType,
        number: numberType,
        object: objectType,
        oboolean: oboolean,
        onumber: onumber,
        optional: optionalType,
        ostring: ostring,
        pipeline: pipelineType,
        preprocess: preprocessType,
        promise: promiseType,
        record: recordType,
        set: setType,
        strictObject: strictObjectType,
        string: stringType,
        symbol: symbolType,
        transformer: effectsType,
        tuple: tupleType,
        'undefined': undefinedType,
        union: unionType,
        unknown: unknownType,
        'void': voidType,
        NEVER: NEVER,
        ZodIssueCode: ZodIssueCode,
        quotelessJson: quotelessJson,
        ZodError: ZodError
    });

    var BigInteger = {exports: {}};

    (function (module) {
        var bigInt = (function (undefined$1) {

            var BASE = 1e7,
                LOG_BASE = 7,
                MAX_INT = 9007199254740992,
                MAX_INT_ARR = smallToArray(MAX_INT),
                DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

            var supportsNativeBigInt = typeof BigInt === "function";

            function Integer(v, radix, alphabet, caseSensitive) {
                if (typeof v === "undefined") return Integer[0];
                if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
                return parseValue(v);
            }

            function BigInteger(value, sign) {
                this.value = value;
                this.sign = sign;
                this.isSmall = false;
            }
            BigInteger.prototype = Object.create(Integer.prototype);

            function SmallInteger(value) {
                this.value = value;
                this.sign = value < 0;
                this.isSmall = true;
            }
            SmallInteger.prototype = Object.create(Integer.prototype);

            function NativeBigInt(value) {
                this.value = value;
            }
            NativeBigInt.prototype = Object.create(Integer.prototype);

            function isPrecise(n) {
                return -MAX_INT < n && n < MAX_INT;
            }

            function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
                if (n < 1e7)
                    return [n];
                if (n < 1e14)
                    return [n % 1e7, Math.floor(n / 1e7)];
                return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
            }

            function arrayToSmall(arr) { // If BASE changes this function may need to change
                trim(arr);
                var length = arr.length;
                if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
                    switch (length) {
                        case 0: return 0;
                        case 1: return arr[0];
                        case 2: return arr[0] + arr[1] * BASE;
                        default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
                    }
                }
                return arr;
            }

            function trim(v) {
                var i = v.length;
                while (v[--i] === 0);
                v.length = i + 1;
            }

            function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
                var x = new Array(length);
                var i = -1;
                while (++i < length) {
                    x[i] = 0;
                }
                return x;
            }

            function truncate(n) {
                if (n > 0) return Math.floor(n);
                return Math.ceil(n);
            }

            function add(a, b) { // assumes a and b are arrays with a.length >= b.length
                var l_a = a.length,
                    l_b = b.length,
                    r = new Array(l_a),
                    carry = 0,
                    base = BASE,
                    sum, i;
                for (i = 0; i < l_b; i++) {
                    sum = a[i] + b[i] + carry;
                    carry = sum >= base ? 1 : 0;
                    r[i] = sum - carry * base;
                }
                while (i < l_a) {
                    sum = a[i] + carry;
                    carry = sum === base ? 1 : 0;
                    r[i++] = sum - carry * base;
                }
                if (carry > 0) r.push(carry);
                return r;
            }

            function addAny(a, b) {
                if (a.length >= b.length) return add(a, b);
                return add(b, a);
            }

            function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
                var l = a.length,
                    r = new Array(l),
                    base = BASE,
                    sum, i;
                for (i = 0; i < l; i++) {
                    sum = a[i] - base + carry;
                    carry = Math.floor(sum / base);
                    r[i] = sum - carry * base;
                    carry += 1;
                }
                while (carry > 0) {
                    r[i++] = carry % base;
                    carry = Math.floor(carry / base);
                }
                return r;
            }

            BigInteger.prototype.add = function (v) {
                var n = parseValue(v);
                if (this.sign !== n.sign) {
                    return this.subtract(n.negate());
                }
                var a = this.value, b = n.value;
                if (n.isSmall) {
                    return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
                }
                return new BigInteger(addAny(a, b), this.sign);
            };
            BigInteger.prototype.plus = BigInteger.prototype.add;

            SmallInteger.prototype.add = function (v) {
                var n = parseValue(v);
                var a = this.value;
                if (a < 0 !== n.sign) {
                    return this.subtract(n.negate());
                }
                var b = n.value;
                if (n.isSmall) {
                    if (isPrecise(a + b)) return new SmallInteger(a + b);
                    b = smallToArray(Math.abs(b));
                }
                return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
            };
            SmallInteger.prototype.plus = SmallInteger.prototype.add;

            NativeBigInt.prototype.add = function (v) {
                return new NativeBigInt(this.value + parseValue(v).value);
            };
            NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

            function subtract(a, b) { // assumes a and b are arrays with a >= b
                var a_l = a.length,
                    b_l = b.length,
                    r = new Array(a_l),
                    borrow = 0,
                    base = BASE,
                    i, difference;
                for (i = 0; i < b_l; i++) {
                    difference = a[i] - borrow - b[i];
                    if (difference < 0) {
                        difference += base;
                        borrow = 1;
                    } else borrow = 0;
                    r[i] = difference;
                }
                for (i = b_l; i < a_l; i++) {
                    difference = a[i] - borrow;
                    if (difference < 0) difference += base;
                    else {
                        r[i++] = difference;
                        break;
                    }
                    r[i] = difference;
                }
                for (; i < a_l; i++) {
                    r[i] = a[i];
                }
                trim(r);
                return r;
            }

            function subtractAny(a, b, sign) {
                var value;
                if (compareAbs(a, b) >= 0) {
                    value = subtract(a, b);
                } else {
                    value = subtract(b, a);
                    sign = !sign;
                }
                value = arrayToSmall(value);
                if (typeof value === "number") {
                    if (sign) value = -value;
                    return new SmallInteger(value);
                }
                return new BigInteger(value, sign);
            }

            function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
                var l = a.length,
                    r = new Array(l),
                    carry = -b,
                    base = BASE,
                    i, difference;
                for (i = 0; i < l; i++) {
                    difference = a[i] + carry;
                    carry = Math.floor(difference / base);
                    difference %= base;
                    r[i] = difference < 0 ? difference + base : difference;
                }
                r = arrayToSmall(r);
                if (typeof r === "number") {
                    if (sign) r = -r;
                    return new SmallInteger(r);
                } return new BigInteger(r, sign);
            }

            BigInteger.prototype.subtract = function (v) {
                var n = parseValue(v);
                if (this.sign !== n.sign) {
                    return this.add(n.negate());
                }
                var a = this.value, b = n.value;
                if (n.isSmall)
                    return subtractSmall(a, Math.abs(b), this.sign);
                return subtractAny(a, b, this.sign);
            };
            BigInteger.prototype.minus = BigInteger.prototype.subtract;

            SmallInteger.prototype.subtract = function (v) {
                var n = parseValue(v);
                var a = this.value;
                if (a < 0 !== n.sign) {
                    return this.add(n.negate());
                }
                var b = n.value;
                if (n.isSmall) {
                    return new SmallInteger(a - b);
                }
                return subtractSmall(b, Math.abs(a), a >= 0);
            };
            SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

            NativeBigInt.prototype.subtract = function (v) {
                return new NativeBigInt(this.value - parseValue(v).value);
            };
            NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

            BigInteger.prototype.negate = function () {
                return new BigInteger(this.value, !this.sign);
            };
            SmallInteger.prototype.negate = function () {
                var sign = this.sign;
                var small = new SmallInteger(-this.value);
                small.sign = !sign;
                return small;
            };
            NativeBigInt.prototype.negate = function () {
                return new NativeBigInt(-this.value);
            };

            BigInteger.prototype.abs = function () {
                return new BigInteger(this.value, false);
            };
            SmallInteger.prototype.abs = function () {
                return new SmallInteger(Math.abs(this.value));
            };
            NativeBigInt.prototype.abs = function () {
                return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
            };


            function multiplyLong(a, b) {
                var a_l = a.length,
                    b_l = b.length,
                    l = a_l + b_l,
                    r = createArray(l),
                    base = BASE,
                    product, carry, i, a_i, b_j;
                for (i = 0; i < a_l; ++i) {
                    a_i = a[i];
                    for (var j = 0; j < b_l; ++j) {
                        b_j = b[j];
                        product = a_i * b_j + r[i + j];
                        carry = Math.floor(product / base);
                        r[i + j] = product - carry * base;
                        r[i + j + 1] += carry;
                    }
                }
                trim(r);
                return r;
            }

            function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
                var l = a.length,
                    r = new Array(l),
                    base = BASE,
                    carry = 0,
                    product, i;
                for (i = 0; i < l; i++) {
                    product = a[i] * b + carry;
                    carry = Math.floor(product / base);
                    r[i] = product - carry * base;
                }
                while (carry > 0) {
                    r[i++] = carry % base;
                    carry = Math.floor(carry / base);
                }
                return r;
            }

            function shiftLeft(x, n) {
                var r = [];
                while (n-- > 0) r.push(0);
                return r.concat(x);
            }

            function multiplyKaratsuba(x, y) {
                var n = Math.max(x.length, y.length);

                if (n <= 30) return multiplyLong(x, y);
                n = Math.ceil(n / 2);

                var b = x.slice(n),
                    a = x.slice(0, n),
                    d = y.slice(n),
                    c = y.slice(0, n);

                var ac = multiplyKaratsuba(a, c),
                    bd = multiplyKaratsuba(b, d),
                    abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

                var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
                trim(product);
                return product;
            }

            // The following function is derived from a surface fit of a graph plotting the performance difference
            // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
            function useKaratsuba(l1, l2) {
                return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
            }

            BigInteger.prototype.multiply = function (v) {
                var n = parseValue(v),
                    a = this.value, b = n.value,
                    sign = this.sign !== n.sign,
                    abs;
                if (n.isSmall) {
                    if (b === 0) return Integer[0];
                    if (b === 1) return this;
                    if (b === -1) return this.negate();
                    abs = Math.abs(b);
                    if (abs < BASE) {
                        return new BigInteger(multiplySmall(a, abs), sign);
                    }
                    b = smallToArray(abs);
                }
                if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
                    return new BigInteger(multiplyKaratsuba(a, b), sign);
                return new BigInteger(multiplyLong(a, b), sign);
            };

            BigInteger.prototype.times = BigInteger.prototype.multiply;

            function multiplySmallAndArray(a, b, sign) { // a >= 0
                if (a < BASE) {
                    return new BigInteger(multiplySmall(b, a), sign);
                }
                return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
            }
            SmallInteger.prototype._multiplyBySmall = function (a) {
                if (isPrecise(a.value * this.value)) {
                    return new SmallInteger(a.value * this.value);
                }
                return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
            };
            BigInteger.prototype._multiplyBySmall = function (a) {
                if (a.value === 0) return Integer[0];
                if (a.value === 1) return this;
                if (a.value === -1) return this.negate();
                return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
            };
            SmallInteger.prototype.multiply = function (v) {
                return parseValue(v)._multiplyBySmall(this);
            };
            SmallInteger.prototype.times = SmallInteger.prototype.multiply;

            NativeBigInt.prototype.multiply = function (v) {
                return new NativeBigInt(this.value * parseValue(v).value);
            };
            NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

            function square(a) {
                //console.assert(2 * BASE * BASE < MAX_INT);
                var l = a.length,
                    r = createArray(l + l),
                    base = BASE,
                    product, carry, i, a_i, a_j;
                for (i = 0; i < l; i++) {
                    a_i = a[i];
                    carry = 0 - a_i * a_i;
                    for (var j = i; j < l; j++) {
                        a_j = a[j];
                        product = 2 * (a_i * a_j) + r[i + j] + carry;
                        carry = Math.floor(product / base);
                        r[i + j] = product - carry * base;
                    }
                    r[i + l] = carry;
                }
                trim(r);
                return r;
            }

            BigInteger.prototype.square = function () {
                return new BigInteger(square(this.value), false);
            };

            SmallInteger.prototype.square = function () {
                var value = this.value * this.value;
                if (isPrecise(value)) return new SmallInteger(value);
                return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
            };

            NativeBigInt.prototype.square = function (v) {
                return new NativeBigInt(this.value * this.value);
            };

            function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
                var a_l = a.length,
                    b_l = b.length,
                    base = BASE,
                    result = createArray(b.length),
                    divisorMostSignificantDigit = b[b_l - 1],
                    // normalization
                    lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
                    remainder = multiplySmall(a, lambda),
                    divisor = multiplySmall(b, lambda),
                    quotientDigit, shift, carry, borrow, i, l, q;
                if (remainder.length <= a_l) remainder.push(0);
                divisor.push(0);
                divisorMostSignificantDigit = divisor[b_l - 1];
                for (shift = a_l - b_l; shift >= 0; shift--) {
                    quotientDigit = base - 1;
                    if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                        quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
                    }
                    // quotientDigit <= base - 1
                    carry = 0;
                    borrow = 0;
                    l = divisor.length;
                    for (i = 0; i < l; i++) {
                        carry += quotientDigit * divisor[i];
                        q = Math.floor(carry / base);
                        borrow += remainder[shift + i] - (carry - q * base);
                        carry = q;
                        if (borrow < 0) {
                            remainder[shift + i] = borrow + base;
                            borrow = -1;
                        } else {
                            remainder[shift + i] = borrow;
                            borrow = 0;
                        }
                    }
                    while (borrow !== 0) {
                        quotientDigit -= 1;
                        carry = 0;
                        for (i = 0; i < l; i++) {
                            carry += remainder[shift + i] - base + divisor[i];
                            if (carry < 0) {
                                remainder[shift + i] = carry + base;
                                carry = 0;
                            } else {
                                remainder[shift + i] = carry;
                                carry = 1;
                            }
                        }
                        borrow += carry;
                    }
                    result[shift] = quotientDigit;
                }
                // denormalization
                remainder = divModSmall(remainder, lambda)[0];
                return [arrayToSmall(result), arrayToSmall(remainder)];
            }

            function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
                // Performs faster than divMod1 on larger input sizes.
                var a_l = a.length,
                    b_l = b.length,
                    result = [],
                    part = [],
                    base = BASE,
                    guess, xlen, highx, highy, check;
                while (a_l) {
                    part.unshift(a[--a_l]);
                    trim(part);
                    if (compareAbs(part, b) < 0) {
                        result.push(0);
                        continue;
                    }
                    xlen = part.length;
                    highx = part[xlen - 1] * base + part[xlen - 2];
                    highy = b[b_l - 1] * base + b[b_l - 2];
                    if (xlen > b_l) {
                        highx = (highx + 1) * base;
                    }
                    guess = Math.ceil(highx / highy);
                    do {
                        check = multiplySmall(b, guess);
                        if (compareAbs(check, part) <= 0) break;
                        guess--;
                    } while (guess);
                    result.push(guess);
                    part = subtract(part, check);
                }
                result.reverse();
                return [arrayToSmall(result), arrayToSmall(part)];
            }

            function divModSmall(value, lambda) {
                var length = value.length,
                    quotient = createArray(length),
                    base = BASE,
                    i, q, remainder, divisor;
                remainder = 0;
                for (i = length - 1; i >= 0; --i) {
                    divisor = remainder * base + value[i];
                    q = truncate(divisor / lambda);
                    remainder = divisor - q * lambda;
                    quotient[i] = q | 0;
                }
                return [quotient, remainder | 0];
            }

            function divModAny(self, v) {
                var value, n = parseValue(v);
                if (supportsNativeBigInt) {
                    return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
                }
                var a = self.value, b = n.value;
                var quotient;
                if (b === 0) throw new Error("Cannot divide by zero");
                if (self.isSmall) {
                    if (n.isSmall) {
                        return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
                    }
                    return [Integer[0], self];
                }
                if (n.isSmall) {
                    if (b === 1) return [self, Integer[0]];
                    if (b == -1) return [self.negate(), Integer[0]];
                    var abs = Math.abs(b);
                    if (abs < BASE) {
                        value = divModSmall(a, abs);
                        quotient = arrayToSmall(value[0]);
                        var remainder = value[1];
                        if (self.sign) remainder = -remainder;
                        if (typeof quotient === "number") {
                            if (self.sign !== n.sign) quotient = -quotient;
                            return [new SmallInteger(quotient), new SmallInteger(remainder)];
                        }
                        return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
                    }
                    b = smallToArray(abs);
                }
                var comparison = compareAbs(a, b);
                if (comparison === -1) return [Integer[0], self];
                if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

                // divMod1 is faster on smaller input sizes
                if (a.length + b.length <= 200)
                    value = divMod1(a, b);
                else value = divMod2(a, b);

                quotient = value[0];
                var qSign = self.sign !== n.sign,
                    mod = value[1],
                    mSign = self.sign;
                if (typeof quotient === "number") {
                    if (qSign) quotient = -quotient;
                    quotient = new SmallInteger(quotient);
                } else quotient = new BigInteger(quotient, qSign);
                if (typeof mod === "number") {
                    if (mSign) mod = -mod;
                    mod = new SmallInteger(mod);
                } else mod = new BigInteger(mod, mSign);
                return [quotient, mod];
            }

            BigInteger.prototype.divmod = function (v) {
                var result = divModAny(this, v);
                return {
                    quotient: result[0],
                    remainder: result[1]
                };
            };
            NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


            BigInteger.prototype.divide = function (v) {
                return divModAny(this, v)[0];
            };
            NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
                return new NativeBigInt(this.value / parseValue(v).value);
            };
            SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

            BigInteger.prototype.mod = function (v) {
                return divModAny(this, v)[1];
            };
            NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
                return new NativeBigInt(this.value % parseValue(v).value);
            };
            SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

            BigInteger.prototype.pow = function (v) {
                var n = parseValue(v),
                    a = this.value,
                    b = n.value,
                    value, x, y;
                if (b === 0) return Integer[1];
                if (a === 0) return Integer[0];
                if (a === 1) return Integer[1];
                if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
                if (n.sign) {
                    return Integer[0];
                }
                if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
                if (this.isSmall) {
                    if (isPrecise(value = Math.pow(a, b)))
                        return new SmallInteger(truncate(value));
                }
                x = this;
                y = Integer[1];
                while (true) {
                    if (b & 1 === 1) {
                        y = y.times(x);
                        --b;
                    }
                    if (b === 0) break;
                    b /= 2;
                    x = x.square();
                }
                return y;
            };
            SmallInteger.prototype.pow = BigInteger.prototype.pow;

            NativeBigInt.prototype.pow = function (v) {
                var n = parseValue(v);
                var a = this.value, b = n.value;
                var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
                if (b === _0) return Integer[1];
                if (a === _0) return Integer[0];
                if (a === _1) return Integer[1];
                if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
                if (n.isNegative()) return new NativeBigInt(_0);
                var x = this;
                var y = Integer[1];
                while (true) {
                    if ((b & _1) === _1) {
                        y = y.times(x);
                        --b;
                    }
                    if (b === _0) break;
                    b /= _2;
                    x = x.square();
                }
                return y;
            };

            BigInteger.prototype.modPow = function (exp, mod) {
                exp = parseValue(exp);
                mod = parseValue(mod);
                if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
                var r = Integer[1],
                    base = this.mod(mod);
                if (exp.isNegative()) {
                    exp = exp.multiply(Integer[-1]);
                    base = base.modInv(mod);
                }
                while (exp.isPositive()) {
                    if (base.isZero()) return Integer[0];
                    if (exp.isOdd()) r = r.multiply(base).mod(mod);
                    exp = exp.divide(2);
                    base = base.square().mod(mod);
                }
                return r;
            };
            NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

            function compareAbs(a, b) {
                if (a.length !== b.length) {
                    return a.length > b.length ? 1 : -1;
                }
                for (var i = a.length - 1; i >= 0; i--) {
                    if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
                }
                return 0;
            }

            BigInteger.prototype.compareAbs = function (v) {
                var n = parseValue(v),
                    a = this.value,
                    b = n.value;
                if (n.isSmall) return 1;
                return compareAbs(a, b);
            };
            SmallInteger.prototype.compareAbs = function (v) {
                var n = parseValue(v),
                    a = Math.abs(this.value),
                    b = n.value;
                if (n.isSmall) {
                    b = Math.abs(b);
                    return a === b ? 0 : a > b ? 1 : -1;
                }
                return -1;
            };
            NativeBigInt.prototype.compareAbs = function (v) {
                var a = this.value;
                var b = parseValue(v).value;
                a = a >= 0 ? a : -a;
                b = b >= 0 ? b : -b;
                return a === b ? 0 : a > b ? 1 : -1;
            };

            BigInteger.prototype.compare = function (v) {
                // See discussion about comparison with Infinity:
                // https://github.com/peterolson/BigInteger.js/issues/61
                if (v === Infinity) {
                    return -1;
                }
                if (v === -Infinity) {
                    return 1;
                }

                var n = parseValue(v),
                    a = this.value,
                    b = n.value;
                if (this.sign !== n.sign) {
                    return n.sign ? 1 : -1;
                }
                if (n.isSmall) {
                    return this.sign ? -1 : 1;
                }
                return compareAbs(a, b) * (this.sign ? -1 : 1);
            };
            BigInteger.prototype.compareTo = BigInteger.prototype.compare;

            SmallInteger.prototype.compare = function (v) {
                if (v === Infinity) {
                    return -1;
                }
                if (v === -Infinity) {
                    return 1;
                }

                var n = parseValue(v),
                    a = this.value,
                    b = n.value;
                if (n.isSmall) {
                    return a == b ? 0 : a > b ? 1 : -1;
                }
                if (a < 0 !== n.sign) {
                    return a < 0 ? -1 : 1;
                }
                return a < 0 ? 1 : -1;
            };
            SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

            NativeBigInt.prototype.compare = function (v) {
                if (v === Infinity) {
                    return -1;
                }
                if (v === -Infinity) {
                    return 1;
                }
                var a = this.value;
                var b = parseValue(v).value;
                return a === b ? 0 : a > b ? 1 : -1;
            };
            NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

            BigInteger.prototype.equals = function (v) {
                return this.compare(v) === 0;
            };
            NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

            BigInteger.prototype.notEquals = function (v) {
                return this.compare(v) !== 0;
            };
            NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

            BigInteger.prototype.greater = function (v) {
                return this.compare(v) > 0;
            };
            NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

            BigInteger.prototype.lesser = function (v) {
                return this.compare(v) < 0;
            };
            NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

            BigInteger.prototype.greaterOrEquals = function (v) {
                return this.compare(v) >= 0;
            };
            NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

            BigInteger.prototype.lesserOrEquals = function (v) {
                return this.compare(v) <= 0;
            };
            NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

            BigInteger.prototype.isEven = function () {
                return (this.value[0] & 1) === 0;
            };
            SmallInteger.prototype.isEven = function () {
                return (this.value & 1) === 0;
            };
            NativeBigInt.prototype.isEven = function () {
                return (this.value & BigInt(1)) === BigInt(0);
            };

            BigInteger.prototype.isOdd = function () {
                return (this.value[0] & 1) === 1;
            };
            SmallInteger.prototype.isOdd = function () {
                return (this.value & 1) === 1;
            };
            NativeBigInt.prototype.isOdd = function () {
                return (this.value & BigInt(1)) === BigInt(1);
            };

            BigInteger.prototype.isPositive = function () {
                return !this.sign;
            };
            SmallInteger.prototype.isPositive = function () {
                return this.value > 0;
            };
            NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

            BigInteger.prototype.isNegative = function () {
                return this.sign;
            };
            SmallInteger.prototype.isNegative = function () {
                return this.value < 0;
            };
            NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

            BigInteger.prototype.isUnit = function () {
                return false;
            };
            SmallInteger.prototype.isUnit = function () {
                return Math.abs(this.value) === 1;
            };
            NativeBigInt.prototype.isUnit = function () {
                return this.abs().value === BigInt(1);
            };

            BigInteger.prototype.isZero = function () {
                return false;
            };
            SmallInteger.prototype.isZero = function () {
                return this.value === 0;
            };
            NativeBigInt.prototype.isZero = function () {
                return this.value === BigInt(0);
            };

            BigInteger.prototype.isDivisibleBy = function (v) {
                var n = parseValue(v);
                if (n.isZero()) return false;
                if (n.isUnit()) return true;
                if (n.compareAbs(2) === 0) return this.isEven();
                return this.mod(n).isZero();
            };
            NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

            function isBasicPrime(v) {
                var n = v.abs();
                if (n.isUnit()) return false;
                if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
                if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
                if (n.lesser(49)) return true;
                // we don't know if it's prime: let the other functions figure it out
            }

            function millerRabinTest(n, a) {
                var nPrev = n.prev(),
                    b = nPrev,
                    r = 0,
                    d, i, x;
                while (b.isEven()) b = b.divide(2), r++;
                next: for (i = 0; i < a.length; i++) {
                    if (n.lesser(a[i])) continue;
                    x = bigInt(a[i]).modPow(b, n);
                    if (x.isUnit() || x.equals(nPrev)) continue;
                    for (d = r - 1; d != 0; d--) {
                        x = x.square().mod(n);
                        if (x.isUnit()) return false;
                        if (x.equals(nPrev)) continue next;
                    }
                    return false;
                }
                return true;
            }

            // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
            BigInteger.prototype.isPrime = function (strict) {
                var isPrime = isBasicPrime(this);
                if (isPrime !== undefined$1) return isPrime;
                var n = this.abs();
                var bits = n.bitLength();
                if (bits <= 64)
                    return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
                var logN = Math.log(2) * bits.toJSNumber();
                var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
                for (var a = [], i = 0; i < t; i++) {
                    a.push(bigInt(i + 2));
                }
                return millerRabinTest(n, a);
            };
            NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

            BigInteger.prototype.isProbablePrime = function (iterations, rng) {
                var isPrime = isBasicPrime(this);
                if (isPrime !== undefined$1) return isPrime;
                var n = this.abs();
                var t = iterations === undefined$1 ? 5 : iterations;
                for (var a = [], i = 0; i < t; i++) {
                    a.push(bigInt.randBetween(2, n.minus(2), rng));
                }
                return millerRabinTest(n, a);
            };
            NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

            BigInteger.prototype.modInv = function (n) {
                var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
                while (!newR.isZero()) {
                    q = r.divide(newR);
                    lastT = t;
                    lastR = r;
                    t = newT;
                    r = newR;
                    newT = lastT.subtract(q.multiply(newT));
                    newR = lastR.subtract(q.multiply(newR));
                }
                if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
                if (t.compare(0) === -1) {
                    t = t.add(n);
                }
                if (this.isNegative()) {
                    return t.negate();
                }
                return t;
            };

            NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

            BigInteger.prototype.next = function () {
                var value = this.value;
                if (this.sign) {
                    return subtractSmall(value, 1, this.sign);
                }
                return new BigInteger(addSmall(value, 1), this.sign);
            };
            SmallInteger.prototype.next = function () {
                var value = this.value;
                if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
                return new BigInteger(MAX_INT_ARR, false);
            };
            NativeBigInt.prototype.next = function () {
                return new NativeBigInt(this.value + BigInt(1));
            };

            BigInteger.prototype.prev = function () {
                var value = this.value;
                if (this.sign) {
                    return new BigInteger(addSmall(value, 1), true);
                }
                return subtractSmall(value, 1, this.sign);
            };
            SmallInteger.prototype.prev = function () {
                var value = this.value;
                if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
                return new BigInteger(MAX_INT_ARR, true);
            };
            NativeBigInt.prototype.prev = function () {
                return new NativeBigInt(this.value - BigInt(1));
            };

            var powersOfTwo = [1];
            while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
            var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

            function shift_isSmall(n) {
                return Math.abs(n) <= BASE;
            }

            BigInteger.prototype.shiftLeft = function (v) {
                var n = parseValue(v).toJSNumber();
                if (!shift_isSmall(n)) {
                    throw new Error(String(n) + " is too large for shifting.");
                }
                if (n < 0) return this.shiftRight(-n);
                var result = this;
                if (result.isZero()) return result;
                while (n >= powers2Length) {
                    result = result.multiply(highestPower2);
                    n -= powers2Length - 1;
                }
                return result.multiply(powersOfTwo[n]);
            };
            NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

            BigInteger.prototype.shiftRight = function (v) {
                var remQuo;
                var n = parseValue(v).toJSNumber();
                if (!shift_isSmall(n)) {
                    throw new Error(String(n) + " is too large for shifting.");
                }
                if (n < 0) return this.shiftLeft(-n);
                var result = this;
                while (n >= powers2Length) {
                    if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
                    remQuo = divModAny(result, highestPower2);
                    result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
                    n -= powers2Length - 1;
                }
                remQuo = divModAny(result, powersOfTwo[n]);
                return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            };
            NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

            function bitwise(x, y, fn) {
                y = parseValue(y);
                var xSign = x.isNegative(), ySign = y.isNegative();
                var xRem = xSign ? x.not() : x,
                    yRem = ySign ? y.not() : y;
                var xDigit = 0, yDigit = 0;
                var xDivMod = null, yDivMod = null;
                var result = [];
                while (!xRem.isZero() || !yRem.isZero()) {
                    xDivMod = divModAny(xRem, highestPower2);
                    xDigit = xDivMod[1].toJSNumber();
                    if (xSign) {
                        xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
                    }

                    yDivMod = divModAny(yRem, highestPower2);
                    yDigit = yDivMod[1].toJSNumber();
                    if (ySign) {
                        yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
                    }

                    xRem = xDivMod[0];
                    yRem = yDivMod[0];
                    result.push(fn(xDigit, yDigit));
                }
                var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
                for (var i = result.length - 1; i >= 0; i -= 1) {
                    sum = sum.multiply(highestPower2).add(bigInt(result[i]));
                }
                return sum;
            }

            BigInteger.prototype.not = function () {
                return this.negate().prev();
            };
            NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

            BigInteger.prototype.and = function (n) {
                return bitwise(this, n, function (a, b) { return a & b; });
            };
            NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

            BigInteger.prototype.or = function (n) {
                return bitwise(this, n, function (a, b) { return a | b; });
            };
            NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

            BigInteger.prototype.xor = function (n) {
                return bitwise(this, n, function (a, b) { return a ^ b; });
            };
            NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

            var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
            function roughLOB(n) { // get lowestOneBit (rough)
                // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
                // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
                var v = n.value,
                    x = typeof v === "number" ? v | LOBMASK_I :
                        typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                            v[0] + v[1] * BASE | LOBMASK_BI;
                return x & -x;
            }

            function integerLogarithm(value, base) {
                if (base.compareTo(value) <= 0) {
                    var tmp = integerLogarithm(value, base.square(base));
                    var p = tmp.p;
                    var e = tmp.e;
                    var t = p.multiply(base);
                    return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
                }
                return { p: bigInt(1), e: 0 };
            }

            BigInteger.prototype.bitLength = function () {
                var n = this;
                if (n.compareTo(bigInt(0)) < 0) {
                    n = n.negate().subtract(bigInt(1));
                }
                if (n.compareTo(bigInt(0)) === 0) {
                    return bigInt(0);
                }
                return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
            };
            NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

            function max(a, b) {
                a = parseValue(a);
                b = parseValue(b);
                return a.greater(b) ? a : b;
            }
            function min(a, b) {
                a = parseValue(a);
                b = parseValue(b);
                return a.lesser(b) ? a : b;
            }
            function gcd(a, b) {
                a = parseValue(a).abs();
                b = parseValue(b).abs();
                if (a.equals(b)) return a;
                if (a.isZero()) return b;
                if (b.isZero()) return a;
                var c = Integer[1], d, t;
                while (a.isEven() && b.isEven()) {
                    d = min(roughLOB(a), roughLOB(b));
                    a = a.divide(d);
                    b = b.divide(d);
                    c = c.multiply(d);
                }
                while (a.isEven()) {
                    a = a.divide(roughLOB(a));
                }
                do {
                    while (b.isEven()) {
                        b = b.divide(roughLOB(b));
                    }
                    if (a.greater(b)) {
                        t = b; b = a; a = t;
                    }
                    b = b.subtract(a);
                } while (!b.isZero());
                return c.isUnit() ? a : a.multiply(c);
            }
            function lcm(a, b) {
                a = parseValue(a).abs();
                b = parseValue(b).abs();
                return a.divide(gcd(a, b)).multiply(b);
            }
            function randBetween(a, b, rng) {
                a = parseValue(a);
                b = parseValue(b);
                var usedRNG = rng || Math.random;
                var low = min(a, b), high = max(a, b);
                var range = high.subtract(low).add(1);
                if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
                var digits = toBase(range, BASE).value;
                var result = [], restricted = true;
                for (var i = 0; i < digits.length; i++) {
                    var top = restricted ? digits[i] : BASE;
                    var digit = truncate(usedRNG() * top);
                    result.push(digit);
                    if (digit < top) restricted = false;
                }
                return low.add(Integer.fromArray(result, BASE, false));
            }

            var parseBase = function (text, base, alphabet, caseSensitive) {
                alphabet = alphabet || DEFAULT_ALPHABET;
                text = String(text);
                if (!caseSensitive) {
                    text = text.toLowerCase();
                    alphabet = alphabet.toLowerCase();
                }
                var length = text.length;
                var i;
                var absBase = Math.abs(base);
                var alphabetValues = {};
                for (i = 0; i < alphabet.length; i++) {
                    alphabetValues[alphabet[i]] = i;
                }
                for (i = 0; i < length; i++) {
                    var c = text[i];
                    if (c === "-") continue;
                    if (c in alphabetValues) {
                        if (alphabetValues[c] >= absBase) {
                            if (c === "1" && absBase === 1) continue;
                            throw new Error(c + " is not a valid digit in base " + base + ".");
                        }
                    }
                }
                base = parseValue(base);
                var digits = [];
                var isNegative = text[0] === "-";
                for (i = isNegative ? 1 : 0; i < text.length; i++) {
                    var c = text[i];
                    if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
                    else if (c === "<") {
                        var start = i;
                        do { i++; } while (text[i] !== ">" && i < text.length);
                        digits.push(parseValue(text.slice(start + 1, i)));
                    }
                    else throw new Error(c + " is not a valid character");
                }
                return parseBaseFromArray(digits, base, isNegative);
            };

            function parseBaseFromArray(digits, base, isNegative) {
                var val = Integer[0], pow = Integer[1], i;
                for (i = digits.length - 1; i >= 0; i--) {
                    val = val.add(digits[i].times(pow));
                    pow = pow.times(base);
                }
                return isNegative ? val.negate() : val;
            }

            function stringify(digit, alphabet) {
                alphabet = alphabet || DEFAULT_ALPHABET;
                if (digit < alphabet.length) {
                    return alphabet[digit];
                }
                return "<" + digit + ">";
            }

            function toBase(n, base) {
                base = bigInt(base);
                if (base.isZero()) {
                    if (n.isZero()) return { value: [0], isNegative: false };
                    throw new Error("Cannot convert nonzero numbers to base 0.");
                }
                if (base.equals(-1)) {
                    if (n.isZero()) return { value: [0], isNegative: false };
                    if (n.isNegative())
                        return {
                            value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                                .map(Array.prototype.valueOf, [1, 0])
                            ),
                            isNegative: false
                        };

                    var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                        .map(Array.prototype.valueOf, [0, 1]);
                    arr.unshift([1]);
                    return {
                        value: [].concat.apply([], arr),
                        isNegative: false
                    };
                }

                var neg = false;
                if (n.isNegative() && base.isPositive()) {
                    neg = true;
                    n = n.abs();
                }
                if (base.isUnit()) {
                    if (n.isZero()) return { value: [0], isNegative: false };

                    return {
                        value: Array.apply(null, Array(n.toJSNumber()))
                            .map(Number.prototype.valueOf, 1),
                        isNegative: neg
                    };
                }
                var out = [];
                var left = n, divmod;
                while (left.isNegative() || left.compareAbs(base) >= 0) {
                    divmod = left.divmod(base);
                    left = divmod.quotient;
                    var digit = divmod.remainder;
                    if (digit.isNegative()) {
                        digit = base.minus(digit).abs();
                        left = left.next();
                    }
                    out.push(digit.toJSNumber());
                }
                out.push(left.toJSNumber());
                return { value: out.reverse(), isNegative: neg };
            }

            function toBaseString(n, base, alphabet) {
                var arr = toBase(n, base);
                return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
                    return stringify(x, alphabet);
                }).join('');
            }

            BigInteger.prototype.toArray = function (radix) {
                return toBase(this, radix);
            };

            SmallInteger.prototype.toArray = function (radix) {
                return toBase(this, radix);
            };

            NativeBigInt.prototype.toArray = function (radix) {
                return toBase(this, radix);
            };

            BigInteger.prototype.toString = function (radix, alphabet) {
                if (radix === undefined$1) radix = 10;
                if (radix !== 10) return toBaseString(this, radix, alphabet);
                var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
                while (--l >= 0) {
                    digit = String(v[l]);
                    str += zeros.slice(digit.length) + digit;
                }
                var sign = this.sign ? "-" : "";
                return sign + str;
            };

            SmallInteger.prototype.toString = function (radix, alphabet) {
                if (radix === undefined$1) radix = 10;
                if (radix != 10) return toBaseString(this, radix, alphabet);
                return String(this.value);
            };

            NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

            NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); };

            BigInteger.prototype.valueOf = function () {
                return parseInt(this.toString(), 10);
            };
            BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

            SmallInteger.prototype.valueOf = function () {
                return this.value;
            };
            SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
            NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
                return parseInt(this.toString(), 10);
            };

            function parseStringValue(v) {
                if (isPrecise(+v)) {
                    var x = +v;
                    if (x === truncate(x))
                        return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
                    throw new Error("Invalid integer: " + v);
                }
                var sign = v[0] === "-";
                if (sign) v = v.slice(1);
                var split = v.split(/e/i);
                if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
                if (split.length === 2) {
                    var exp = split[1];
                    if (exp[0] === "+") exp = exp.slice(1);
                    exp = +exp;
                    if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
                    var text = split[0];
                    var decimalPlace = text.indexOf(".");
                    if (decimalPlace >= 0) {
                        exp -= text.length - decimalPlace - 1;
                        text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
                    }
                    if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
                    text += (new Array(exp + 1)).join("0");
                    v = text;
                }
                var isValid = /^([0-9][0-9]*)$/.test(v);
                if (!isValid) throw new Error("Invalid integer: " + v);
                if (supportsNativeBigInt) {
                    return new NativeBigInt(BigInt(sign ? "-" + v : v));
                }
                var r = [], max = v.length, l = LOG_BASE, min = max - l;
                while (max > 0) {
                    r.push(+v.slice(min, max));
                    min -= l;
                    if (min < 0) min = 0;
                    max -= l;
                }
                trim(r);
                return new BigInteger(r, sign);
            }

            function parseNumberValue(v) {
                if (supportsNativeBigInt) {
                    return new NativeBigInt(BigInt(v));
                }
                if (isPrecise(v)) {
                    if (v !== truncate(v)) throw new Error(v + " is not an integer.");
                    return new SmallInteger(v);
                }
                return parseStringValue(v.toString());
            }

            function parseValue(v) {
                if (typeof v === "number") {
                    return parseNumberValue(v);
                }
                if (typeof v === "string") {
                    return parseStringValue(v);
                }
                if (typeof v === "bigint") {
                    return new NativeBigInt(v);
                }
                return v;
            }
            // Pre-define numbers in range [-999,999]
            for (var i = 0; i < 1000; i++) {
                Integer[i] = parseValue(i);
                if (i > 0) Integer[-i] = parseValue(-i);
            }
            // Backwards compatibility
            Integer.one = Integer[1];
            Integer.zero = Integer[0];
            Integer.minusOne = Integer[-1];
            Integer.max = max;
            Integer.min = min;
            Integer.gcd = gcd;
            Integer.lcm = lcm;
            Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
            Integer.randBetween = randBetween;

            Integer.fromArray = function (digits, base, isNegative) {
                return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
            };

            return Integer;
        })();

        // Node.js check
        if (module.hasOwnProperty("exports")) {
            module.exports = bigInt;
        }
    } (BigInteger));

    var BigIntegerExports = BigInteger.exports;
    var bigInt = /*@__PURE__*/getDefaultExportFromCjs(BigIntegerExports);

    /**
     * Context: Due to Discord supporting more than 32 permissions, permission calculation has become more complicated than naive
     * bit operations on `number`s. To support this generically, we have created BigFlagUtils to work with bit-flags greater
     * than 32-bits in size.
     *
     * Ideally, we would like to use BigInt, which is pretty efficient, but some JavaScript engines do not support it.
     *
     * This file is intended to be a set of lower-level operators that act directly on "BigFlags".
     *
     * If you're working with permissions, in most cases you can probably use PermissionUtils.
     */
    const MAX_BIG_INT = 64;
    const SMALL_INT = 16;
    const PARTS = MAX_BIG_INT / SMALL_INT;
    function checkBrowserSupportsBigInt() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            BigInt;
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Takes the sliced output of `toHexReverseArray` and converts hex to decimal.
     */
    function fromHexReverseArray(hexValues, start, size) {
        let value = 0;
        for (let i = 0; i < size; i++) {
            const byte = hexValues[start + i];
            if (byte === undefined) {
                break;
            }
            value += byte * 16 ** i;
        }
        return value;
    }
    /**
     * Converts a number string to array of hex bytes based on the implementation found at
     * https://stackoverflow.com/questions/18626844/convert-a-large-integer-to-a-hex-string-in-javascript
     *
     * To avoid extra allocations it returns the values in reverse.
     */
    function toHexReverseArray(value) {
        const sum = [];
        for (let i = 0; i < value.length; i++) {
            let s = Number(value[i]);
            for (let j = 0; s || j < sum.length; j++) {
                s += (sum[j] || 0) * 10;
                sum[j] = s % 16;
                s = (s - sum[j]) / 16;
            }
        }
        return sum;
    }
    /**
     * Splits a big integers into array of small integers to perform fast bitwise operations.
     */
    function splitBigInt(value) {
        const sum = toHexReverseArray(value);
        const parts = Array(PARTS);
        for (let i = 0; i < PARTS; i++) {
            // Highest bits to lowest bits.
            parts[PARTS - 1 - i] = fromHexReverseArray(sum, i * PARTS, PARTS);
        }
        return parts;
    }
    class HighLow {
        static fromString(value) {
            return new HighLow(splitBigInt(value), value);
        }
        static fromBit(index) {
            const parts = Array(PARTS);
            const offset = Math.floor(index / SMALL_INT);
            for (let i = 0; i < PARTS; i++) {
                // Highest bits to lowest bits.
                parts[PARTS - 1 - i] = i === offset ? 1 << (index - offset * SMALL_INT) : 0;
            }
            return new HighLow(parts);
        }
        constructor(parts, str) {
            this.parts = parts;
            this.str = str;
        }
        and({ parts }) {
            return new HighLow(this.parts.map((v, i) => v & parts[i]));
        }
        or({ parts }) {
            return new HighLow(this.parts.map((v, i) => v | parts[i]));
        }
        xor({ parts }) {
            return new HighLow(this.parts.map((v, i) => v ^ parts[i]));
        }
        not() {
            return new HighLow(this.parts.map((v) => ~v));
        }
        equals({ parts }) {
            return this.parts.every((v, i) => v === parts[i]);
        }
        /**
         * For the average case the string representation is provided, but
         * when we need to convert high and low to string we just let the
         * slower big-integer library do it.
         */
        toString() {
            if (this.str != null) {
                return this.str;
            }
            const array = new Array(MAX_BIG_INT / 4);
            this.parts.forEach((value, offset) => {
                const hex = toHexReverseArray(value.toString());
                for (let i = 0; i < 4; i++) {
                    array[i + offset * 4] = hex[4 - 1 - i] || 0;
                }
            });
            return (this.str = bigInt.fromArray(array, 16).toString());
        }
        toJSON() {
            return this.toString();
        }
    }
    const SUPPORTS_BIGINT = checkBrowserSupportsBigInt();
    // Polyfill toJSON on BigInt if necessary.
    if (SUPPORTS_BIGINT && BigInt.prototype.toJSON == null) {
        BigInt.prototype.toJSON = function () {
            return this.toString();
        };
    }
    const HIGH_LOW_CACHE = {};
    const convertToBigFlag = SUPPORTS_BIGINT
        ? function convertToBigFlagBigInt(value) {
            return BigInt(value);
        }
        : function convertToBigFlagHighLow(value) {
            if (value instanceof HighLow) {
                return value;
            }
            if (typeof value === 'number') {
                value = value.toString();
            }
            // These type assertions are ugly, but there doesn't seem to be a
            // runtime costless way to do a type assertion above.
            if (HIGH_LOW_CACHE[value] != null) {
                return HIGH_LOW_CACHE[value];
            }
            HIGH_LOW_CACHE[value] = HighLow.fromString(value);
            return HIGH_LOW_CACHE[value];
        };
    const EMPTY_FLAG = convertToBigFlag(0);
    const flagAnd = SUPPORTS_BIGINT
        ? function flagAndBigInt(first = EMPTY_FLAG, second = EMPTY_FLAG) {
            return first & second;
        }
        : function flagAndHighLow(first = EMPTY_FLAG, second = EMPTY_FLAG) {
            return first.and(second);
        };
    const flagOr = SUPPORTS_BIGINT
        ? function flagOrBigInt(first = EMPTY_FLAG, second = EMPTY_FLAG) {
            return first | second;
        }
        : function flagOrHighLow(first = EMPTY_FLAG, second = EMPTY_FLAG) {
            return first.or(second);
        };
    const flagXor = SUPPORTS_BIGINT
        ? function flagXorBigInt(first = EMPTY_FLAG, second = EMPTY_FLAG) {
            return first ^ second;
        }
        : function flagXorHighLow(first = EMPTY_FLAG, second = EMPTY_FLAG) {
            return first.xor(second);
        };
    const flagNot = SUPPORTS_BIGINT
        ? function flagNotBigInt(first = EMPTY_FLAG) {
            return ~first;
        }
        : function flagNotHighLow(first = EMPTY_FLAG) {
            return first.not();
        };
    const flagEquals = SUPPORTS_BIGINT
        ? function flagEqualsBigInt(first, second) {
            return first === second;
        }
        : function flagEqualsHighLow(first, second) {
            if (first == null || second == null) {
                // eslint-disable-next-line eqeqeq
                return first == second;
            }
            return first.equals(second);
        };
    function flagOrMultiple(...flags) {
        let result = flags[0];
        for (let i = 1; i < flags.length; i++) {
            result = flagOr(result, flags[i]);
        }
        return result;
    }
    function flagHas(base, flag) {
        return flagEquals(flagAnd(base, flag), flag);
    }
    function flagHasAny(base, flag) {
        return !flagEquals(flagAnd(base, flag), EMPTY_FLAG);
    }
    function flagAdd(base, flag) {
        return flag === EMPTY_FLAG ? base : flagOr(base, flag);
    }
    function flagRemove(base, flag) {
        return flag === EMPTY_FLAG ? base : flagXor(base, flagAnd(base, flag));
    }
    const getFlag = SUPPORTS_BIGINT
        ? function getFlagBigInt(index) {
            return BigInt(1) << BigInt(index);
        }
        : function getFlagHighLow(index) {
            return HighLow.fromBit(index);
        };
    var BigFlagUtils = {
        combine: flagOrMultiple,
        add: flagAdd,
        remove: flagRemove,
        filter: flagAnd,
        invert: flagNot,
        has: flagHas,
        hasAny: flagHasAny,
        equals: flagEquals,
        deserialize: convertToBigFlag,
        getFlag: getFlag,
    };

    exports.RPCCloseCodes = void 0;
    (function (RPCCloseCodes) {
        RPCCloseCodes[RPCCloseCodes["CLOSE_NORMAL"] = 1000] = "CLOSE_NORMAL";
        RPCCloseCodes[RPCCloseCodes["CLOSE_UNSUPPORTED"] = 1003] = "CLOSE_UNSUPPORTED";
        RPCCloseCodes[RPCCloseCodes["CLOSE_ABNORMAL"] = 1006] = "CLOSE_ABNORMAL";
        RPCCloseCodes[RPCCloseCodes["INVALID_CLIENTID"] = 4000] = "INVALID_CLIENTID";
        RPCCloseCodes[RPCCloseCodes["INVALID_ORIGIN"] = 4001] = "INVALID_ORIGIN";
        RPCCloseCodes[RPCCloseCodes["RATELIMITED"] = 4002] = "RATELIMITED";
        RPCCloseCodes[RPCCloseCodes["TOKEN_REVOKED"] = 4003] = "TOKEN_REVOKED";
        RPCCloseCodes[RPCCloseCodes["INVALID_VERSION"] = 4004] = "INVALID_VERSION";
        RPCCloseCodes[RPCCloseCodes["INVALID_ENCODING"] = 4005] = "INVALID_ENCODING";
    })(exports.RPCCloseCodes || (exports.RPCCloseCodes = {}));
    exports.RPCErrorCodes = void 0;
    (function (RPCErrorCodes) {
        RPCErrorCodes[RPCErrorCodes["INVALID_PAYLOAD"] = 4000] = "INVALID_PAYLOAD";
        RPCErrorCodes[RPCErrorCodes["INVALID_COMMAND"] = 4002] = "INVALID_COMMAND";
        RPCErrorCodes[RPCErrorCodes["INVALID_EVENT"] = 4004] = "INVALID_EVENT";
        RPCErrorCodes[RPCErrorCodes["INVALID_PERMISSIONS"] = 4006] = "INVALID_PERMISSIONS";
    })(exports.RPCErrorCodes || (exports.RPCErrorCodes = {}));
    /**
     * @deprecated use OrientationTypeObject instead
     */
    exports.Orientation = void 0;
    (function (Orientation) {
        Orientation["LANDSCAPE"] = "landscape";
        Orientation["PORTRAIT"] = "portrait";
    })(exports.Orientation || (exports.Orientation = {}));
    exports.Platform = void 0;
    (function (Platform) {
        Platform["MOBILE"] = "mobile";
        Platform["DESKTOP"] = "desktop";
    })(exports.Platform || (exports.Platform = {}));
    const Permissions = Object.freeze({
        CREATE_INSTANT_INVITE: BigFlagUtils.getFlag(0),
        ADMINISTRATOR: BigFlagUtils.getFlag(3),
    });

    /**
     * This is a helper function which coerces an unsupported arg value to the key/value UNHANDLED: -1
     * This is necessary to handle a scenario where a new enum value is added in the Discord Client,
     * so that the sdk will not throw an error when given a (newly) valid enum value.
     *
     * To remove the requirement for consumers of this sdk to import an enum when parsing data,
     * we instead use an object cast as const (readonly). This maintains parity with the previous
     * schema (which used zod.enum), and behaves more like a union type, i.e. 'foo' | 'bar' | -1
     *
     * @param inputObject This object must include the key/value pair UNHANDLED = -1
     */
    function zodCoerceUnhandledValue(inputObject) {
        return preprocessType((arg) => {
            var _a;
            const [objectKey] = (_a = Object.entries(inputObject).find(([, value]) => value === arg)) !== null && _a !== void 0 ? _a : [];
            if (arg != null && objectKey === undefined) {
                return inputObject.UNHANDLED;
            }
            return arg;
        }, stringType().or(numberType()));
    }
    /**
     * Fallback to the default zod value if parsing fails.
     */
    function fallbackToDefault(schema) {
        const transform = custom().transform((data) => {
            const res = schema.safeParse(data);
            if (res.success) {
                return res.data;
            }
            return schema._def.defaultValue();
        });
        // Must set this inner schema so inspection works correctly
        transform.overlayType = schema;
        // transform._def.schema = schema;
        return transform;
    }

    /**
     * This file is generated.
     * Run "pnpm sync" to regenerate file.
     * @generated
     */
    // INITIATE_IMAGE_UPLOAD
    const InitiateImageUploadResponseSchema = z.object({ image_url: z.string() });
    // OPEN_SHARE_MOMENT_DIALOG
    const OpenShareMomentDialogRequestSchema = z.object({ mediaUrl: z.string().max(1024) });
    // AUTHENTICATE
    const AuthenticateRequestSchema = z.object({ access_token: z.union([z.string(), z.null()]).optional() });
    const AuthenticateResponseSchema = z.object({
        access_token: z.string(),
        user: z.object({
            username: z.string(),
            discriminator: z.string(),
            id: z.string(),
            avatar: z.union([z.string(), z.null()]).optional(),
            public_flags: z.number(),
            global_name: z.union([z.string(), z.null()]).optional(),
        }),
        scopes: z.array(fallbackToDefault(z
            .enum([
            'identify',
            'email',
            'connections',
            'guilds',
            'guilds.join',
            'guilds.members.read',
            'gdm.join',
            'rpc',
            'rpc.notifications.read',
            'rpc.voice.read',
            'rpc.voice.write',
            'rpc.video.read',
            'rpc.video.write',
            'rpc.screenshare.read',
            'rpc.screenshare.write',
            'rpc.activities.write',
            'bot',
            'webhook.incoming',
            'messages.read',
            'applications.builds.upload',
            'applications.builds.read',
            'applications.commands',
            'applications.commands.update',
            'applications.commands.permissions.update',
            'applications.store.update',
            'applications.entitlements',
            'activities.read',
            'activities.write',
            'relationships.read',
            'voice',
            'dm_channels.read',
            'role_connections.write',
        ])
            .or(z.literal(-1))
            .default(-1))),
        expires: z.string(),
        application: z.object({
            description: z.string(),
            icon: z.union([z.string(), z.null()]).optional(),
            id: z.string(),
            rpc_origins: z.array(z.string()).optional(),
            name: z.string(),
        }),
    });
    // GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS
    const GetActivityInstanceConnectedParticipantsResponseSchema = z.object({
        participants: z.array(z.object({
            id: z.string(),
            username: z.string(),
            global_name: z.union([z.string(), z.null()]).optional(),
            discriminator: z.string(),
            avatar: z.union([z.string(), z.null()]).optional(),
            flags: z.number(),
            bot: z.boolean(),
            avatar_decoration_data: z
                .union([z.object({ asset: z.string(), skuId: z.string().optional() }), z.null()])
                .optional(),
            premium_type: z.union([z.number(), z.null()]).optional(),
            nickname: z.string().optional(),
        })),
    });
    /**
     * RPC Commands which support schemas.
     */
    var Command;
    (function (Command) {
        Command["INITIATE_IMAGE_UPLOAD"] = "INITIATE_IMAGE_UPLOAD";
        Command["OPEN_SHARE_MOMENT_DIALOG"] = "OPEN_SHARE_MOMENT_DIALOG";
        Command["AUTHENTICATE"] = "AUTHENTICATE";
        Command["GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS"] = "GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS";
    })(Command || (Command = {}));
    const emptyResponseSchema = z.object({}).optional().nullable();
    const emptyRequestSchema = z.void();
    /**
     * Request & Response schemas for each supported RPC Command.
     */
    const Schemas = {
        [Command.INITIATE_IMAGE_UPLOAD]: {
            request: emptyRequestSchema,
            response: InitiateImageUploadResponseSchema,
        },
        [Command.OPEN_SHARE_MOMENT_DIALOG]: {
            request: OpenShareMomentDialogRequestSchema,
            response: emptyResponseSchema,
        },
        [Command.AUTHENTICATE]: {
            request: AuthenticateRequestSchema,
            response: AuthenticateResponseSchema,
        },
        [Command.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS]: {
            request: emptyRequestSchema,
            response: GetActivityInstanceConnectedParticipantsResponseSchema,
        },
    };

    // DISPATCH is sent as cmd but is a special case, so is excluded from Commands enum
    const DISPATCH = 'DISPATCH';
    var Commands$1;
    (function (Commands) {
        Commands["AUTHORIZE"] = "AUTHORIZE";
        Commands["AUTHENTICATE"] = "AUTHENTICATE";
        Commands["GET_GUILDS"] = "GET_GUILDS";
        Commands["GET_GUILD"] = "GET_GUILD";
        Commands["GET_CHANNEL"] = "GET_CHANNEL";
        Commands["GET_CHANNELS"] = "GET_CHANNELS";
        Commands["SELECT_VOICE_CHANNEL"] = "SELECT_VOICE_CHANNEL";
        Commands["SELECT_TEXT_CHANNEL"] = "SELECT_TEXT_CHANNEL";
        Commands["SUBSCRIBE"] = "SUBSCRIBE";
        Commands["UNSUBSCRIBE"] = "UNSUBSCRIBE";
        Commands["CAPTURE_SHORTCUT"] = "CAPTURE_SHORTCUT";
        Commands["SET_CERTIFIED_DEVICES"] = "SET_CERTIFIED_DEVICES";
        Commands["SET_ACTIVITY"] = "SET_ACTIVITY";
        Commands["GET_SKUS"] = "GET_SKUS";
        Commands["GET_ENTITLEMENTS"] = "GET_ENTITLEMENTS";
        Commands["GET_SKUS_EMBEDDED"] = "GET_SKUS_EMBEDDED";
        Commands["GET_ENTITLEMENTS_EMBEDDED"] = "GET_ENTITLEMENTS_EMBEDDED";
        Commands["START_PURCHASE"] = "START_PURCHASE";
        Commands["SET_CONFIG"] = "SET_CONFIG";
        Commands["SEND_ANALYTICS_EVENT"] = "SEND_ANALYTICS_EVENT";
        Commands["USER_SETTINGS_GET_LOCALE"] = "USER_SETTINGS_GET_LOCALE";
        Commands["OPEN_EXTERNAL_LINK"] = "OPEN_EXTERNAL_LINK";
        Commands["ENCOURAGE_HW_ACCELERATION"] = "ENCOURAGE_HW_ACCELERATION";
        Commands["CAPTURE_LOG"] = "CAPTURE_LOG";
        Commands["SET_ORIENTATION_LOCK_STATE"] = "SET_ORIENTATION_LOCK_STATE";
        Commands["OPEN_INVITE_DIALOG"] = "OPEN_INVITE_DIALOG";
        Commands["GET_PLATFORM_BEHAVIORS"] = "GET_PLATFORM_BEHAVIORS";
        Commands["GET_CHANNEL_PERMISSIONS"] = "GET_CHANNEL_PERMISSIONS";
        Commands["OPEN_SHARE_MOMENT_DIALOG"] = "OPEN_SHARE_MOMENT_DIALOG";
        Commands["INITIATE_IMAGE_UPLOAD"] = "INITIATE_IMAGE_UPLOAD";
        Commands["GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS"] = "GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS";
    })(Commands$1 || (Commands$1 = {}));
    const ReceiveFramePayload = objectType({
        cmd: stringType(),
        data: unknownType(),
        evt: nullType(),
        nonce: stringType(),
    })
        .passthrough();
    const ScopesObject = Object.assign(Object.assign({}, AuthenticateResponseSchema.shape.scopes.element.overlayType._def.innerType.options[0].Values), { UNHANDLED: -1 });
    const Scopes = zodCoerceUnhandledValue(ScopesObject);
    const User = objectType({
        id: stringType(),
        username: stringType(),
        discriminator: stringType(),
        global_name: stringType().optional().nullable(),
        avatar: stringType().optional().nullable(),
        avatar_decoration_data: objectType({
            asset: stringType(),
            sku_id: stringType().optional(),
        })
            .nullable(),
        bot: booleanType(),
        flags: numberType().optional().nullable(),
        premium_type: numberType().optional().nullable(),
    });
    const GuildMember = objectType({
        user: User,
        nick: stringType().optional().nullable(),
        roles: arrayType(stringType()),
        joined_at: stringType(),
        deaf: booleanType(),
        mute: booleanType(),
    });
    const Emoji = objectType({
        id: stringType(),
        name: stringType().optional().nullable(),
        roles: arrayType(stringType()).optional().nullable(),
        user: User.optional().nullable(),
        require_colons: booleanType().optional().nullable(),
        managed: booleanType().optional().nullable(),
        animated: booleanType().optional().nullable(),
        available: booleanType().optional().nullable(),
    });
    const VoiceState = objectType({
        mute: booleanType(),
        deaf: booleanType(),
        self_mute: booleanType(),
        self_deaf: booleanType(),
        suppress: booleanType(),
    });
    const UserVoiceState = objectType({
        mute: booleanType(),
        nick: stringType(),
        user: User,
        voice_state: VoiceState,
        volume: numberType(),
    });
    const StatusObject = {
        UNHANDLED: -1,
        IDLE: 'idle',
        DND: 'dnd',
        ONLINE: 'online',
        OFFLINE: 'offline',
    };
    const Status = zodCoerceUnhandledValue(StatusObject);
    const Activity = objectType({
        name: stringType(),
        type: numberType(),
        url: stringType().optional().nullable(),
        created_at: numberType().optional().nullable(),
        timestamps: objectType({
            start: numberType(),
            end: numberType(),
        })
            .partial()
            .optional()
            .nullable(),
        application_id: stringType().optional().nullable(),
        details: stringType().optional().nullable(),
        state: stringType().optional().nullable(),
        emoji: Emoji.optional().nullable(),
        party: objectType({
            id: stringType().optional().nullable(),
            size: arrayType(numberType()).optional().nullable(),
        })
            .optional()
            .nullable(),
        assets: objectType({
            large_image: stringType().nullable(),
            large_text: stringType().nullable(),
            small_image: stringType().nullable(),
            small_text: stringType().nullable(),
        })
            .partial()
            .optional()
            .nullable(),
        secrets: objectType({
            join: stringType(),
            match: stringType(),
        })
            .partial()
            .optional()
            .nullable(),
        instance: booleanType().optional().nullable(),
        flags: numberType().optional().nullable(),
    });
    const PermissionOverwriteTypeObject = {
        UNHANDLED: -1,
        ROLE: 0,
        MEMBER: 1,
    };
    const PermissionOverwrite = objectType({
        id: stringType(),
        type: zodCoerceUnhandledValue(PermissionOverwriteTypeObject),
        allow: stringType(),
        deny: stringType(),
    });
    const ChannelTypesObject = {
        UNHANDLED: -1,
        DM: 1,
        GROUP_DM: 3,
        GUILD_TEXT: 0,
        GUILD_VOICE: 2,
        GUILD_CATEGORY: 4,
        GUILD_ANNOUNCEMENT: 5,
        GUILD_STORE: 6,
        ANNOUNCEMENT_THREAD: 10,
        PUBLIC_THREAD: 11,
        PRIVATE_THREAD: 12,
        GUILD_STAGE_VOICE: 13,
        GUILD_DIRECTORY: 14,
        GUILD_FORUM: 15,
    };
    const Channel = objectType({
        id: stringType(),
        type: zodCoerceUnhandledValue(ChannelTypesObject),
        guild_id: stringType().optional().nullable(),
        position: numberType().optional().nullable(),
        permission_overwrites: arrayType(PermissionOverwrite).optional().nullable(),
        name: stringType().optional().nullable(),
        topic: stringType().optional().nullable(),
        nsfw: booleanType().optional().nullable(),
        last_message_id: stringType().optional().nullable(),
        bitrate: numberType().optional().nullable(),
        user_limit: numberType().optional().nullable(),
        rate_limit_per_user: numberType().optional().nullable(),
        recipients: arrayType(User).optional().nullable(),
        icon: stringType().optional().nullable(),
        owner_id: stringType().optional().nullable(),
        application_id: stringType().optional().nullable(),
        parent_id: stringType().optional().nullable(),
        last_pin_timestamp: stringType().optional().nullable(),
    });
    const PresenceUpdate = objectType({
        user: User,
        guild_id: stringType(),
        status: Status,
        activities: arrayType(Activity),
        client_status: objectType({
            desktop: Status,
            mobile: Status,
            web: Status,
        })
            .partial(),
    });
    const Role = objectType({
        id: stringType(),
        name: stringType(),
        color: numberType(),
        hoist: booleanType(),
        position: numberType(),
        permissions: stringType(),
        managed: booleanType(),
        mentionable: booleanType(),
    });
    const Guild = objectType({
        id: stringType(),
        name: stringType(),
        owner_id: stringType(),
        icon: stringType().nullable(),
        icon_hash: stringType().optional().nullable(),
        splash: stringType().nullable(),
        discovery_splash: stringType().nullable(),
        owner: booleanType().optional().nullable(),
        permissions: stringType().optional().nullable(),
        region: stringType(),
        afk_channel_id: stringType().nullable(),
        afk_timeout: numberType(),
        widget_enabled: booleanType().optional().nullable(),
        widget_channel_id: stringType().optional().nullable(),
        verification_level: numberType(),
        default_message_notifications: numberType(),
        explicit_content_filter: numberType(),
        roles: arrayType(Role),
        emojis: arrayType(Emoji),
        features: arrayType(stringType()),
        mfa_level: numberType(),
        application_id: stringType().nullable(),
        system_channel_id: stringType().nullable(),
        system_channel_flags: numberType(),
        rules_channel_id: stringType().nullable(),
        joined_at: stringType().optional().nullable(),
        large: booleanType().optional().nullable(),
        unavailable: booleanType().optional().nullable(),
        member_count: numberType().optional().nullable(),
        voice_states: arrayType(VoiceState).optional().nullable(),
        members: arrayType(GuildMember).optional().nullable(),
        channels: arrayType(Channel).optional().nullable(),
        presences: arrayType(PresenceUpdate).optional().nullable(),
        max_presences: numberType().optional().nullable(),
        max_members: numberType().optional().nullable(),
        vanity_url_code: stringType().nullable(),
        description: stringType().nullable(),
        banner: stringType().nullable(),
        premium_tier: numberType(),
        premium_subscription_count: numberType().optional().nullable(),
        preferred_locale: stringType(),
        public_updates_channel_id: stringType().nullable(),
        max_video_channel_users: numberType().optional().nullable(),
        approximate_member_count: numberType().optional().nullable(),
        approximate_presence_count: numberType().optional().nullable(),
    });
    const ChannelMention = objectType({
        id: stringType(),
        guild_id: stringType(),
        type: numberType(),
        name: stringType(),
    });
    const Attachment = objectType({
        id: stringType(),
        filename: stringType(),
        size: numberType(),
        url: stringType(),
        proxy_url: stringType(),
        height: numberType().optional().nullable(),
        width: numberType().optional().nullable(),
    });
    const EmbedFooter = objectType({
        text: stringType(),
        icon_url: stringType().optional().nullable(),
        proxy_icon_url: stringType().optional().nullable(),
    });
    const Image = objectType({
        url: stringType().optional().nullable(),
        proxy_url: stringType().optional().nullable(),
        height: numberType().optional().nullable(),
        width: numberType().optional().nullable(),
    });
    const Video = Image.omit({ proxy_url: true });
    const EmbedProvider = objectType({
        name: stringType().optional().nullable(),
        url: stringType().optional().nullable(),
    });
    const EmbedAuthor = objectType({
        name: stringType().optional().nullable(),
        url: stringType().optional().nullable(),
        icon_url: stringType().optional().nullable(),
        proxy_icon_url: stringType().optional().nullable(),
    });
    const EmbedField = objectType({
        name: stringType(),
        value: stringType(),
        inline: booleanType(),
    });
    const Embed = objectType({
        title: stringType().optional().nullable(),
        type: stringType().optional().nullable(),
        description: stringType().optional().nullable(),
        url: stringType().optional().nullable(),
        timestamp: stringType().optional().nullable(),
        color: numberType().optional().nullable(),
        footer: EmbedFooter.optional().nullable(),
        image: Image.optional().nullable(),
        thumbnail: Image.optional().nullable(),
        video: Video.optional().nullable(),
        provider: EmbedProvider.optional().nullable(),
        author: EmbedAuthor.optional().nullable(),
        fields: arrayType(EmbedField).optional().nullable(),
    });
    const Reaction = objectType({
        count: numberType(),
        me: booleanType(),
        emoji: Emoji,
    });
    const MessageActivity = objectType({
        type: numberType(),
        party_id: stringType().optional().nullable(),
    });
    const MessageApplication = objectType({
        id: stringType(),
        cover_image: stringType().optional().nullable(),
        description: stringType(),
        icon: stringType().optional().nullable(),
        name: stringType(),
    });
    const MessageReference = objectType({
        message_id: stringType().optional().nullable(),
        channel_id: stringType().optional().nullable(),
        guild_id: stringType().optional().nullable(),
    });
    const Message = objectType({
        id: stringType(),
        channel_id: stringType(),
        guild_id: stringType().optional().nullable(),
        author: User.optional().nullable(),
        member: GuildMember.optional().nullable(),
        content: stringType(),
        timestamp: stringType(),
        edited_timestamp: stringType().optional().nullable(),
        tts: booleanType(),
        mention_everyone: booleanType(),
        mentions: arrayType(User),
        mention_roles: arrayType(stringType()),
        mention_channels: arrayType(ChannelMention),
        attachments: arrayType(Attachment),
        embeds: arrayType(Embed),
        reactions: arrayType(Reaction).optional().nullable(),
        nonce: unionType([stringType(), numberType()]).optional().nullable(),
        pinned: booleanType(),
        webhook_id: stringType().optional().nullable(),
        type: numberType(),
        activity: MessageActivity.optional().nullable(),
        application: MessageApplication.optional().nullable(),
        message_reference: MessageReference.optional().nullable(),
        flags: numberType().optional().nullable(),
        stickers: arrayType(unknownType()).optional().nullable(),
        // Cannot self reference, but this is possibly a Message
        referenced_message: unknownType().optional().nullable(),
    });
    const VoiceDevice = objectType({
        id: stringType(),
        name: stringType(),
    });
    const KeyTypesObject = {
        UNHANDLED: -1,
        KEYBOARD_KEY: 0,
        MOUSE_BUTTON: 1,
        KEYBOARD_MODIFIER_KEY: 2,
        GAMEPAD_BUTTON: 3,
    };
    const ShortcutKey = objectType({
        type: zodCoerceUnhandledValue(KeyTypesObject),
        code: numberType(),
        name: stringType(),
    });
    const VoiceSettingModeTypeObject = {
        UNHANDLED: -1,
        PUSH_TO_TALK: 'PUSH_TO_TALK',
        VOICE_ACTIVITY: 'VOICE_ACTIVITY',
    };
    const VoiceSettingsMode = objectType({
        type: zodCoerceUnhandledValue(VoiceSettingModeTypeObject),
        auto_threshold: booleanType(),
        threshold: numberType(),
        shortcut: arrayType(ShortcutKey),
        delay: numberType(),
    });
    const VoiceSettingsIO = objectType({
        device_id: stringType(),
        volume: numberType(),
        available_devices: arrayType(VoiceDevice),
    });
    const CertifiedDeviceTypeObject = {
        UNHANDLED: -1,
        AUDIO_INPUT: 'AUDIO_INPUT',
        AUDIO_OUTPUT: 'AUDIO_OUTPUT',
        VIDEO_INPUT: 'VIDEO_INPUT',
    };
    const CertifiedDevice = objectType({
        type: zodCoerceUnhandledValue(CertifiedDeviceTypeObject),
        id: stringType(),
        vendor: objectType({
            name: stringType(),
            url: stringType(),
        }),
        model: objectType({
            name: stringType(),
            url: stringType(),
        }),
        related: arrayType(stringType()),
        echo_cancellation: booleanType().optional().nullable(),
        noise_suppression: booleanType().optional().nullable(),
        automatic_gain_control: booleanType().optional().nullable(),
        hardware_mute: booleanType().optional().nullable(),
    });
    const SkuTypeObject = {
        UNHANDLED: -1,
        APPLICATION: 1,
        DLC: 2,
        CONSUMABLE: 3,
        BUNDLE: 4,
        SUBSCRIPTION: 5,
    };
    const Sku = objectType({
        id: stringType(),
        name: stringType(),
        type: zodCoerceUnhandledValue(SkuTypeObject),
        price: objectType({
            amount: numberType(),
            currency: stringType(),
        }),
        application_id: stringType(),
        flags: numberType(),
        release_date: stringType().nullable(),
    });
    const EntitlementTypesObject = {
        UNHANDLED: -1,
        PURCHASE: 1,
        PREMIUM_SUBSCRIPTION: 2,
        DEVELOPER_GIFT: 3,
        TEST_MODE_PURCHASE: 4,
        FREE_PURCHASE: 5,
        USER_GIFT: 6,
        PREMIUM_PURCHASE: 7,
    };
    const Entitlement = objectType({
        id: stringType(),
        sku_id: stringType(),
        application_id: stringType(),
        user_id: stringType(),
        gift_code_flags: numberType(),
        type: zodCoerceUnhandledValue(EntitlementTypesObject),
        gifter_user_id: stringType().optional().nullable(),
        branches: arrayType(stringType()).optional().nullable(),
        starts_at: stringType().optional().nullable(),
        ends_at: stringType().optional().nullable(),
        parent_id: stringType().optional().nullable(),
        consumed: booleanType().optional().nullable(),
        deleted: booleanType().optional().nullable(),
        gift_code_batch_id: stringType().optional().nullable(),
    });
    const OrientationLockStateTypeObject = {
        UNHANDLED: -1,
        UNLOCKED: 1,
        PORTRAIT: 2,
        LANDSCAPE: 3,
    };
    const OrientationLockState = zodCoerceUnhandledValue(OrientationLockStateTypeObject);
    const ThermalStateTypeObject = {
        UNHANDLED: -1,
        NOMINAL: 0,
        FAIR: 1,
        SERIOUS: 2,
        CRITICAL: 3,
    };
    const ThermalState = zodCoerceUnhandledValue(ThermalStateTypeObject);
    const OrientationTypeObject = {
        UNHANDLED: -1,
        PORTRAIT: 0,
        LANDSCAPE: 1,
    };
    const Orientation = zodCoerceUnhandledValue(OrientationTypeObject);
    const LayoutModeTypeObject = {
        UNHANDLED: -1,
        FOCUSED: 0,
        PIP: 1,
        GRID: 2,
    };
    const LayoutMode = zodCoerceUnhandledValue(LayoutModeTypeObject);

    var Common = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Activity: Activity,
        Attachment: Attachment,
        CertifiedDevice: CertifiedDevice,
        CertifiedDeviceTypeObject: CertifiedDeviceTypeObject,
        Channel: Channel,
        ChannelMention: ChannelMention,
        ChannelTypesObject: ChannelTypesObject,
        get Commands () { return Commands$1; },
        DISPATCH: DISPATCH,
        Embed: Embed,
        EmbedAuthor: EmbedAuthor,
        EmbedField: EmbedField,
        EmbedFooter: EmbedFooter,
        EmbedProvider: EmbedProvider,
        Emoji: Emoji,
        Entitlement: Entitlement,
        EntitlementTypesObject: EntitlementTypesObject,
        Guild: Guild,
        GuildMember: GuildMember,
        Image: Image,
        KeyTypesObject: KeyTypesObject,
        LayoutMode: LayoutMode,
        LayoutModeTypeObject: LayoutModeTypeObject,
        Message: Message,
        MessageActivity: MessageActivity,
        MessageApplication: MessageApplication,
        MessageReference: MessageReference,
        Orientation: Orientation,
        OrientationLockState: OrientationLockState,
        OrientationLockStateTypeObject: OrientationLockStateTypeObject,
        OrientationTypeObject: OrientationTypeObject,
        PermissionOverwrite: PermissionOverwrite,
        PermissionOverwriteTypeObject: PermissionOverwriteTypeObject,
        PresenceUpdate: PresenceUpdate,
        Reaction: Reaction,
        ReceiveFramePayload: ReceiveFramePayload,
        Role: Role,
        Scopes: Scopes,
        ScopesObject: ScopesObject,
        ShortcutKey: ShortcutKey,
        Sku: Sku,
        SkuTypeObject: SkuTypeObject,
        Status: Status,
        StatusObject: StatusObject,
        ThermalState: ThermalState,
        ThermalStateTypeObject: ThermalStateTypeObject,
        User: User,
        UserVoiceState: UserVoiceState,
        Video: Video,
        VoiceDevice: VoiceDevice,
        VoiceSettingModeTypeObject: VoiceSettingModeTypeObject,
        VoiceSettingsIO: VoiceSettingsIO,
        VoiceSettingsMode: VoiceSettingsMode,
        VoiceState: VoiceState
    });

    // ERROR is sent as evt but is a special case, so is excluded from Events enum
    const ERROR = 'ERROR';
    exports.Events = void 0;
    (function (Events) {
        Events["READY"] = "READY";
        Events["VOICE_STATE_UPDATE"] = "VOICE_STATE_UPDATE";
        Events["SPEAKING_START"] = "SPEAKING_START";
        Events["SPEAKING_STOP"] = "SPEAKING_STOP";
        Events["ACTIVITY_LAYOUT_MODE_UPDATE"] = "ACTIVITY_LAYOUT_MODE_UPDATE";
        Events["ORIENTATION_UPDATE"] = "ORIENTATION_UPDATE";
        Events["CURRENT_USER_UPDATE"] = "CURRENT_USER_UPDATE";
        Events["ENTITLEMENT_CREATE"] = "ENTITLEMENT_CREATE";
        Events["THERMAL_STATE_UPDATE"] = "THERMAL_STATE_UPDATE";
        Events["ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE"] = "ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE";
    })(exports.Events || (exports.Events = {}));
    const DispatchEventFrame = ReceiveFramePayload.extend({
        evt: nativeEnumType(exports.Events),
        nonce: stringType().nullable(),
        cmd: literalType(DISPATCH),
        data: objectType({}).passthrough(),
    });
    const ErrorEvent = ReceiveFramePayload.extend({
        evt: literalType(ERROR),
        data: objectType({
            code: numberType(),
            message: stringType().optional(),
        })
            .passthrough(),
        cmd: nativeEnumType(Commands$1),
        nonce: stringType().nullable(),
    });
    const OtherEvent = DispatchEventFrame.extend({
        evt: stringType(),
    });
    const EventFrame = unionType([DispatchEventFrame, OtherEvent, ErrorEvent]);
    function parseEventPayload(data) {
        const event = data.evt;
        if (!(event in exports.Events)) {
            throw new Error(`Unrecognized event type ${data.evt}`);
        }
        const eventSchema = EventSchema[event];
        return eventSchema.payload.parse(data);
    }
    const EventSchema = {
        /**
         * @description
         * The READY event is emitted by Discord's RPC server in reply to a client
         * initiating the RPC handshake. The event includes information about
         * - the rpc server version
         * - the discord client configuration
         * - the (basic) user object
         *
         * Unlike other events, READY will only be omitted once, immediately after the
         * Embedded App SDK is initialized
         *
         * # Supported Platforms
         * | Web | iOS | Android |
         * |-----|-----|---------|
         * | âœ…  | âœ…  | âœ…      |
         *
         * Required scopes: []
         *
         */
        [exports.Events.READY]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.READY),
                data: objectType({
                    v: numberType(),
                    config: objectType({
                        cdn_host: stringType().optional(),
                        api_endpoint: stringType(),
                        environment: stringType(),
                    }),
                    user: objectType({
                        id: stringType(),
                        username: stringType(),
                        discriminator: stringType(),
                        avatar: stringType().optional(),
                    })
                        .optional(),
                }),
            }),
        },
        [exports.Events.VOICE_STATE_UPDATE]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.VOICE_STATE_UPDATE),
                data: UserVoiceState,
            }),
            subscribeArgs: objectType({
                channel_id: stringType(),
            }),
        },
        [exports.Events.SPEAKING_START]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.SPEAKING_START),
                data: objectType({
                    lobby_id: stringType().optional(),
                    channel_id: stringType().optional(),
                    user_id: stringType(),
                }),
            }),
            subscribeArgs: objectType({
                lobby_id: stringType().nullable().optional(),
                channel_id: stringType().nullable().optional(),
            }),
        },
        [exports.Events.SPEAKING_STOP]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.SPEAKING_STOP),
                data: objectType({
                    lobby_id: stringType().optional(),
                    channel_id: stringType().optional(),
                    user_id: stringType(),
                }),
            }),
            subscribeArgs: objectType({
                lobby_id: stringType().nullable().optional(),
                channel_id: stringType().nullable().optional(),
            }),
        },
        [exports.Events.ACTIVITY_LAYOUT_MODE_UPDATE]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.ACTIVITY_LAYOUT_MODE_UPDATE),
                data: objectType({
                    layout_mode: zodCoerceUnhandledValue(LayoutModeTypeObject),
                }),
            }),
        },
        [exports.Events.ORIENTATION_UPDATE]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.ORIENTATION_UPDATE),
                data: objectType({
                    screen_orientation: zodCoerceUnhandledValue(OrientationTypeObject),
                    /**
                     * @deprecated use screen_orientation instead
                     */
                    orientation: nativeEnumType(exports.Orientation),
                }),
            }),
        },
        [exports.Events.CURRENT_USER_UPDATE]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.CURRENT_USER_UPDATE),
                data: User,
            }),
        },
        [exports.Events.ENTITLEMENT_CREATE]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.ENTITLEMENT_CREATE),
                data: objectType({ entitlement: Entitlement }),
            }),
        },
        [exports.Events.THERMAL_STATE_UPDATE]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.THERMAL_STATE_UPDATE),
                data: objectType({ thermal_state: ThermalState }),
            }),
        },
        [exports.Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE]: {
            payload: DispatchEventFrame.extend({
                evt: literalType(exports.Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE),
                data: objectType({
                    participants: GetActivityInstanceConnectedParticipantsResponseSchema.shape.participants,
                }),
            }),
        },
    };

    /**
     * Assets x is statically unreachable at build-time,
     * and throws at runtime if data is dynamic.
     */
    function assertUnreachable(_x, runtimeError) {
        throw runtimeError;
    }

    const EmptyResponse = objectType({}).nullable();
    const AuthorizeResponse = objectType({
        code: stringType(),
    });
    const GetGuildsResponse = objectType({
        guilds: arrayType(objectType({
            id: stringType(),
            name: stringType(),
        })),
    });
    const GetGuildResponse = objectType({
        id: stringType(),
        name: stringType(),
        icon_url: stringType().optional(),
        members: arrayType(GuildMember),
    });
    const GetChannelResponse = objectType({
        id: stringType(),
        type: zodCoerceUnhandledValue(ChannelTypesObject),
        guild_id: stringType().optional().nullable(),
        name: stringType().optional().nullable(),
        topic: stringType().optional().nullable(),
        bitrate: numberType().optional().nullable(),
        user_limit: numberType().optional().nullable(),
        position: numberType().optional().nullable(),
        voice_states: arrayType(UserVoiceState),
        messages: arrayType(Message),
    });
    const GetChannelsResponse = objectType({
        channels: arrayType(Channel),
    });
    const NullableChannelResponse = GetChannelResponse.nullable();
    const SelectVoiceChannelResponse = GetChannelResponse.nullable();
    const SelectTextChannelResponse = GetChannelResponse.nullable();
    const VoiceSettingsResponse = objectType({
        input: VoiceSettingsIO,
        output: VoiceSettingsIO,
        mode: VoiceSettingsMode,
        automatic_gain_control: booleanType(),
        echo_cancellation: booleanType(),
        noise_suppression: booleanType(),
        qos: booleanType(),
        silence_warning: booleanType(),
        deaf: booleanType(),
        mute: booleanType(),
    });
    const SubscribeResponse = objectType({
        evt: stringType(),
    });
    const CaptureShortcutResponse = objectType({ shortcut: ShortcutKey });
    const SetActivityResponse = Activity;
    const GetSkusResponse = objectType({ skus: arrayType(Sku) });
    const GetEntitlementsResponse = objectType({ entitlements: arrayType(Entitlement) });
    const StartPurchaseResponse = arrayType(Entitlement).nullable();
    const SetConfigResponse = objectType({
        use_interactive_pip: booleanType(),
    });
    const UserSettingsGetLocaleResponse = objectType({
        locale: stringType(),
    });
    const EncourageHardwareAccelerationResponse = objectType({
        enabled: booleanType(),
    });
    const GetChannelPermissionsResponse = objectType({
        permissions: bigIntType().or(stringType()),
    });
    /**
     * Because of the nature of Platform Behavior changes
     * every key/value is optional and may eventually be removed
     */
    const GetPlatformBehaviorsResponse = objectType({
        iosKeyboardResizesView: optionalType(booleanType()),
    });
    const ResponseFrame = ReceiveFramePayload.extend({
        cmd: nativeEnumType(Commands$1),
        evt: nullType(),
    });
    function parseResponseData({ cmd, data }) {
        switch (cmd) {
            case Commands$1.AUTHORIZE:
                return AuthorizeResponse.parse(data);
            case Commands$1.CAPTURE_SHORTCUT:
                return CaptureShortcutResponse.parse(data);
            case Commands$1.ENCOURAGE_HW_ACCELERATION:
                return EncourageHardwareAccelerationResponse.parse(data);
            case Commands$1.GET_CHANNEL:
                return GetChannelResponse.parse(data);
            case Commands$1.GET_CHANNELS:
                return GetChannelsResponse.parse(data);
            case Commands$1.GET_CHANNEL_PERMISSIONS:
                return GetChannelPermissionsResponse.parse(data);
            case Commands$1.GET_GUILD:
                return GetGuildResponse.parse(data);
            case Commands$1.GET_GUILDS:
                return GetGuildsResponse.parse(data);
            case Commands$1.GET_PLATFORM_BEHAVIORS:
                return GetPlatformBehaviorsResponse.parse(data);
            case Commands$1.GET_CHANNEL:
                return GetChannelResponse.parse(data);
            case Commands$1.SELECT_TEXT_CHANNEL:
                return SelectTextChannelResponse.parse(data);
            case Commands$1.SELECT_VOICE_CHANNEL:
                return SelectVoiceChannelResponse.parse(data);
            case Commands$1.SET_ACTIVITY:
                return SetActivityResponse.parse(data);
            case Commands$1.GET_SKUS_EMBEDDED:
                return GetSkusResponse.parse(data);
            case Commands$1.GET_ENTITLEMENTS_EMBEDDED:
                return GetEntitlementsResponse.parse(data);
            case Commands$1.SET_CONFIG:
                return SetConfigResponse.parse(data);
            case Commands$1.START_PURCHASE:
                return StartPurchaseResponse.parse(data);
            case Commands$1.SUBSCRIBE:
            case Commands$1.UNSUBSCRIBE:
                return SubscribeResponse.parse(data);
            case Commands$1.USER_SETTINGS_GET_LOCALE:
                return UserSettingsGetLocaleResponse.parse(data);
            // Empty Responses
            case Commands$1.OPEN_EXTERNAL_LINK:
            case Commands$1.SET_ORIENTATION_LOCK_STATE:
            case Commands$1.SET_CERTIFIED_DEVICES:
            case Commands$1.SEND_ANALYTICS_EVENT:
            case Commands$1.OPEN_INVITE_DIALOG:
            case Commands$1.CAPTURE_LOG:
            case Commands$1.GET_SKUS:
            case Commands$1.GET_ENTITLEMENTS:
                return EmptyResponse.parse(data);
            // Generated Responses
            case Commands$1.AUTHENTICATE:
            case Commands$1.INITIATE_IMAGE_UPLOAD:
            case Commands$1.OPEN_SHARE_MOMENT_DIALOG:
            case Commands$1.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS:
                const { response } = Schemas[cmd];
                return response.parse(data);
            default:
                assertUnreachable(cmd, new Error(`Unrecognized command ${cmd}`));
        }
    }
    function parseResponsePayload(payload) {
        return Object.assign(Object.assign({}, payload), { data: parseResponseData(payload) });
    }

    var responses = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AuthenticateResponse: AuthenticateResponseSchema,
        AuthorizeResponse: AuthorizeResponse,
        CaptureShortcutResponse: CaptureShortcutResponse,
        EmptyResponse: EmptyResponse,
        EncourageHardwareAccelerationResponse: EncourageHardwareAccelerationResponse,
        GetChannelPermissionsResponse: GetChannelPermissionsResponse,
        GetChannelResponse: GetChannelResponse,
        GetChannelsResponse: GetChannelsResponse,
        GetEntitlementsResponse: GetEntitlementsResponse,
        GetGuildResponse: GetGuildResponse,
        GetGuildsResponse: GetGuildsResponse,
        GetPlatformBehaviorsResponse: GetPlatformBehaviorsResponse,
        GetSkusResponse: GetSkusResponse,
        InitiateImageUploadResponse: InitiateImageUploadResponseSchema,
        NullableChannelResponse: NullableChannelResponse,
        ResponseFrame: ResponseFrame,
        SelectTextChannelResponse: SelectTextChannelResponse,
        SelectVoiceChannelResponse: SelectVoiceChannelResponse,
        SetActivityResponse: SetActivityResponse,
        SetConfigResponse: SetConfigResponse,
        StartPurchaseResponse: StartPurchaseResponse,
        SubscribeResponse: SubscribeResponse,
        UserSettingsGetLocaleResponse: UserSettingsGetLocaleResponse,
        VoiceSettingsResponse: VoiceSettingsResponse,
        parseResponsePayload: parseResponsePayload
    });

    objectType({
        frame_id: stringType(),
        platform: nativeEnumType(exports.Platform).optional().nullable(),
    });
    objectType({
        v: literalType(1),
        encoding: literalType('json').optional(),
        client_id: stringType(),
        frame_id: stringType(),
    });
    const ClosePayload = objectType({
        code: numberType(),
        message: stringType().optional(),
    });
    const IncomingPayload = objectType({
        evt: stringType().nullable(),
        nonce: stringType().nullable(),
        data: unknownType().nullable(),
        cmd: stringType(),
    })
        .passthrough();
    function parseIncomingPayload(payload) {
        const incoming = IncomingPayload.parse(payload);
        if (incoming.evt != null) {
            if (incoming.evt === ERROR) {
                return ErrorEvent.parse(incoming);
            }
            return parseEventPayload(EventFrame.parse(incoming));
        }
        else {
            return parseResponsePayload(ResponseFrame.passthrough().parse(incoming));
        }
    }

    function commandFactory(sendCommand, cmd, response, transferTransform = () => undefined) {
        const payload = ReceiveFramePayload.extend({
            cmd: literalType(cmd),
            data: response,
        });
        return async (args) => {
            const reply = await sendCommand({ cmd, args, transfer: transferTransform(args) });
            const parsed = payload.parse(reply);
            return parsed.data;
        };
    }
    function schemaCommandFactory(cmd, transferTransform = () => undefined) {
        const response = Schemas[cmd].response;
        const payload = ReceiveFramePayload.extend({
            cmd: literalType(cmd),
            data: response,
        });
        return (sendCommand) => async (args) => {
            const reply = await sendCommand({
                // @ts-expect-error - Merge commands
                cmd: cmd,
                args,
                transfer: transferTransform(args),
            });
            const parsed = payload.parse(reply);
            return parsed.data;
        };
    }

    /**
     * Authenticate Activity
     */
    const authenticate = schemaCommandFactory(Command.AUTHENTICATE);

    /**
     * Should be called directly after a `ready` payload is received from the
     * Discord client. It includes a list of all scopes that your activity would
     * like to be authorized to use. If the user does not yet have a valid token
     * for all scopes requested, this command will open an OAuth modal. Once an
     * authorized token is available, it will be returned in the command response.
     */
    const authorize = (sendCommand) => commandFactory(sendCommand, Commands$1.AUTHORIZE, AuthorizeResponse);

    /**
     *
     */
    const captureLog = (sendCommand) => commandFactory(sendCommand, Commands$1.CAPTURE_LOG, EmptyResponse);

    /**
     *
     */
    const encourageHardwareAcceleration = (sendCommand) => commandFactory(sendCommand, Commands$1.ENCOURAGE_HW_ACCELERATION, EncourageHardwareAccelerationResponse);

    /**
     *
     */
    const getEntitlements = (sendCommand) => commandFactory(sendCommand, Commands$1.GET_ENTITLEMENTS_EMBEDDED, GetEntitlementsResponse);

    /*
     *
     */
    const getSkus = (sendCommand) => commandFactory(sendCommand, Commands$1.GET_SKUS_EMBEDDED, GetSkusResponse);

    /**
     * Returns a bigint representing Permissions for the current user in the currently connected channel. Use PermissionsUtils to calculate if a user has a particular permission.
     * Always returns `0n` (no valid permissions) in a (G)DM context, so is unnecessary to call when discordSdk.guildId == null.
     */
    const getChannelPermissions = (sendCommand) => commandFactory(sendCommand, Commands$1.GET_CHANNEL_PERMISSIONS, GetChannelPermissionsResponse);

    /**
     * Returns an object with information about platform behaviors
     * This command can be utilized to inform and react to a breaking change in platform behavior
     *
     * @returns {GetPlatformBehaviorsPayload} payload - The command return value
     * @returns {boolean} payload.data.iosKeyboardResizesView - If on iOS the webview is resized when the keyboard is opened
     */
    const getPlatformBehaviors = (sendCommand) => commandFactory(sendCommand, Commands$1.GET_PLATFORM_BEHAVIORS, GetPlatformBehaviorsResponse);

    /**
     *
     */
    const openExternalLink = (sendCommand) => commandFactory(sendCommand, Commands$1.OPEN_EXTERNAL_LINK, EmptyResponse);

    /**
     * Opens the invite dialog within the discord client, allowing users to share invite links to friends.
     * Does not work in (G)DM contexts (throws RPCError.INVALID_CHANNEL), so should not be called if discordSdk.guildId == null
     * Similarly, if the user does not have Permissions.CREATE_INSTANT_INVITE this command throws RPCErrors.INVALID_PERMISSIONS, so checking the user's permissions via getChannelPermissions is highly recommended.
     */
    const openInviteDialog = (sendCommand) => commandFactory(sendCommand, Commands$1.OPEN_INVITE_DIALOG, EmptyResponse);

    /**
     * Opens the Share Moment Dialog in the user's client, allowing them to share the media at mediaUrl as a message.
     *
     * @param {string} mediaUrl - a Discord CDN URL for the piece of media to be shared.
     * @returns {Promise<void>}
     */
    const openShareMomentDialog = schemaCommandFactory(Command.OPEN_SHARE_MOMENT_DIALOG);

    Activity.pick({
        state: true,
        details: true,
        timestamps: true,
        assets: true,
        party: true,
        secrets: true,
        buttons: true,
        instance: true,
        supported_platforms: true,
        type: true,
    })
        .extend({
        type: Activity.shape.type.optional(),
        instance: Activity.shape.instance.optional(),
    })
        .nullable();
    /**
     *
     * @description
     * RPC documentation here: https://discord.com/developers/docs/topics/rpc#setactivity
     * Calling setActivity allows modifying how your activity's rich presence is displayed in the Discord App
     *
     * Supported Platforms
     * | Web | iOS | Android |
     * |-----|-----|---------|
     * | âœ…  | âœ…  | âœ…      |
     *
     * Required scopes: [rpc.activities.write]
     *
     * @example
     * await discordSdk.commands.setActivity({
     *   activity: {
     *     type: 0,
     *     details: 'Details',
     *     state: 'Playing',
     *   },
     * });
     */
    const setActivity = (sendCommand) => commandFactory(sendCommand, Commands$1.SET_ACTIVITY, SetActivityResponse);

    /**
     *
     */
    const setConfig = (sendCommand) => commandFactory(sendCommand, Commands$1.SET_CONFIG, SetConfigResponse);

    /**
     * @args - the primary args to send with the command.
     * @fallbackArgs - the args to try the command with in the case where an old Discord
     *  client doesn't support one of the new args.
     */
    function compatCommandFactory({ sendCommand, cmd, response, fallbackTransform, transferTransform = () => undefined, }) {
        const payload = ReceiveFramePayload.extend({
            cmd: literalType(cmd),
            data: response,
        });
        return async (args) => {
            try {
                const reply = await sendCommand({ cmd, args, transfer: transferTransform(args) });
                const parsed = payload.parse(reply);
                return parsed.data;
            }
            catch (error) {
                if (error.code === exports.RPCErrorCodes.INVALID_PAYLOAD) {
                    const fallbackArgs = fallbackTransform(args);
                    const reply = await sendCommand({ cmd, args: fallbackArgs, transfer: transferTransform(fallbackArgs) });
                    const parsed = payload.parse(reply);
                    return parsed.data;
                }
                else {
                    throw error;
                }
            }
        };
    }

    const fallbackTransform = (args) => {
        return {
            lock_state: args.lock_state,
            picture_in_picture_lock_state: args.picture_in_picture_lock_state,
        };
    };
    const setOrientationLockState = (sendCommand) => compatCommandFactory({
        sendCommand,
        cmd: Commands$1.SET_ORIENTATION_LOCK_STATE,
        response: EmptyResponse,
        fallbackTransform,
    });

    /**
     *
     */
    const startPurchase = (sendCommand) => commandFactory(sendCommand, Commands$1.START_PURCHASE, StartPurchaseResponse);

    /**
     *
     */
    const userSettingsGetLocale = (sendCommand) => commandFactory(sendCommand, Commands$1.USER_SETTINGS_GET_LOCALE, UserSettingsGetLocaleResponse);

    /**
     * Triggers the file upload flow in the Discord app. The user will be prompted to select a valid image file
     * and then it will be uploaded on the app side to the Discord CDN.
     *
     * NOTE: The URL provided by the API is an ephemeral attachment URL, so the image will not be permanently
     * accessible at the link provided.
     *
     * @returns {Promise<{image_url: string}>}
     */
    const initiateImageUpload = schemaCommandFactory(Command.INITIATE_IMAGE_UPLOAD);

    /**
     *
     * @description
     * RPC documentation here: https://discord.com/developers/docs/topics/rpc#getchannel
     * Calling getChannel gets info about the requested channel such as the channel name.
     *
     * Supported Platforms
     * | Web | iOS | Android |
     * |-----|-----|---------|
     * | âœ…  | âœ…  | âœ…      |
     *
     * Required scopes:
     * - [guilds] for guild channels
     * - [guilds, dm_channels.read] for GDM channels. dm_channels.read requires approval from Discord.
     *
     * @example
     * await discordSdk.commands.getActivity({
     *   channel_id: discordSdk.channelId,
     * });
     */
    const getChannel = (sendCommand) => commandFactory(sendCommand, Commands$1.GET_CHANNEL, GetChannelResponse);

    /**
     * Gets all participants connected to the instance
     */
    const getInstanceConnectedParticipants = schemaCommandFactory(Command.GET_ACTIVITY_INSTANCE_CONNECTED_PARTICIPANTS);

    function commands(sendCommand) {
        return {
            authenticate: authenticate(sendCommand),
            authorize: authorize(sendCommand),
            captureLog: captureLog(sendCommand),
            encourageHardwareAcceleration: encourageHardwareAcceleration(sendCommand),
            getChannel: getChannel(sendCommand),
            getChannelPermissions: getChannelPermissions(sendCommand),
            getEntitlements: getEntitlements(sendCommand),
            getPlatformBehaviors: getPlatformBehaviors(sendCommand),
            getSkus: getSkus(sendCommand),
            openExternalLink: openExternalLink(sendCommand),
            openInviteDialog: openInviteDialog(sendCommand),
            openShareMomentDialog: openShareMomentDialog(sendCommand),
            setActivity: setActivity(sendCommand),
            setConfig: setConfig(sendCommand),
            setOrientationLockState: setOrientationLockState(sendCommand),
            startPurchase: startPurchase(sendCommand),
            userSettingsGetLocale: userSettingsGetLocale(sendCommand),
            initiateImageUpload: initiateImageUpload(sendCommand),
            getInstanceConnectedParticipants: getInstanceConnectedParticipants(sendCommand),
        };
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    let getRandomValues;
    const rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    const byteToHex = [];

    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).slice(1));
    }

    function unsafeStringify(arr, offset = 0) {
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
    }

    const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
    var native = {
      randomUUID
    };

    function v4(options, buf, offset) {
      if (native.randomUUID && !buf && !options) {
        return native.randomUUID();
      }

      options = options || {};
      const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (let i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return unsafeStringify(rnds);
    }

    class SDKError extends Error {
        constructor(code, message = '') {
            super(message);
            this.code = code;
            this.message = message;
            this.name = 'Discord SDK Error';
        }
    }

    function getDefaultSdkConfiguration() {
        return {
            disableConsoleLogOverride: false,
        };
    }

    const consoleLevels = ['log', 'warn', 'debug', 'info', 'error'];
    function wrapConsoleMethod(console, level, callback) {
        const _consoleMethod = console[level];
        const _console = console;
        if (!_consoleMethod) {
            return;
        }
        console[level] = function () {
            const args = [].slice.call(arguments);
            const message = '' + args.join(' ');
            callback(level, message);
            _consoleMethod.apply(_console, args);
        };
    }

    var Opcodes;
    (function (Opcodes) {
        Opcodes[Opcodes["HANDSHAKE"] = 0] = "HANDSHAKE";
        Opcodes[Opcodes["FRAME"] = 1] = "FRAME";
        Opcodes[Opcodes["CLOSE"] = 2] = "CLOSE";
        Opcodes[Opcodes["HELLO"] = 3] = "HELLO";
    })(Opcodes || (Opcodes = {}));
    const ALLOWED_ORIGINS = new Set(getAllowedOrigins());
    function getAllowedOrigins() {
        if (typeof window === 'undefined')
            return [];
        return [
            window.location.origin,
            'https://discord.com',
            'https://discordapp.com',
            'https://ptb.discord.com',
            'https://ptb.discordapp.com',
            'https://canary.discord.com',
            'https://canary.discordapp.com',
            'https://staging.discord.co',
            'http://localhost:3333',
            'https://pax.discord.com',
            'null',
        ];
    }
    /**
     * The embedded application is running in an IFrame either within the main Discord client window or in a popout. The RPC server is always running in the main Discord client window. In either case, the referrer is the correct origin.
     */
    function getRPCServerSource() {
        var _a;
        return [(_a = window.parent.opener) !== null && _a !== void 0 ? _a : window.parent, !!document.referrer ? document.referrer : '*'];
    }
    class DiscordSDK {
        getTransfer(payload) {
            var _a;
            switch (payload.cmd) {
                case Commands$1.SUBSCRIBE:
                case Commands$1.UNSUBSCRIBE:
                    return undefined;
                default:
                    return (_a = payload.transfer) !== null && _a !== void 0 ? _a : undefined;
            }
        }
        constructor(clientId, configuration) {
            this.source = null;
            this.sourceOrigin = '';
            this.eventBus = new EventEmitter();
            this.pendingCommands = new Map();
            this.sendCommand = (payload) => {
                var _a;
                if (this.source == null)
                    throw new Error('Attempting to send message before initialization');
                const nonce = v4();
                (_a = this.source) === null || _a === void 0 ? void 0 : _a.postMessage([Opcodes.FRAME, Object.assign(Object.assign({}, payload), { nonce })], this.sourceOrigin, this.getTransfer(payload));
                const promise = new Promise((resolve, reject) => {
                    this.pendingCommands.set(nonce, { resolve, reject });
                });
                return promise;
            };
            this.commands = commands(this.sendCommand);
            /**
             * WARNING - All "console" logs are emitted as messages to the Discord client
             *  If you write "console.log" anywhere in handleMessage or subsequent message handling
             * there is a good chance you will cause an infinite loop where you receive a message
             * which causes "console.log" which sends a message, which causes the discord client to
             * send a reply which causes handleMessage to fire again, and again to inifinity
             *
             * If you need to log within handleMessage, consider setting
             * config.disableConsoleLogOverride to true when initializing the SDK
             */
            this.handleMessage = (event) => {
                if (!ALLOWED_ORIGINS.has(event.origin))
                    return;
                const tuple = event.data;
                if (!Array.isArray(tuple)) {
                    return;
                }
                const [opcode, data] = tuple;
                switch (opcode) {
                    case Opcodes.HELLO:
                        // backwards compat; the Discord client will still send HELLOs for old applications.
                        //
                        // TODO: figure out compatibility approach; it would be easier to maintain compatibility at the SDK level, not the underlying RPC protocol level...
                        return;
                    case Opcodes.CLOSE:
                        return this.handleClose(data);
                    case Opcodes.HANDSHAKE:
                        return this.handleHandshake();
                    case Opcodes.FRAME:
                        return this.handleFrame(data);
                    default:
                        throw new Error('Invalid message format');
                }
            };
            this.isReady = false;
            this.clientId = clientId;
            this.configuration = configuration !== null && configuration !== void 0 ? configuration : getDefaultSdkConfiguration();
            if (typeof window !== 'undefined') {
                window.addEventListener('message', this.handleMessage);
            }
            if (typeof window === 'undefined') {
                this.frameId = '';
                this.instanceId = '';
                this.platform = exports.Platform.DESKTOP;
                this.guildId = null;
                this.channelId = null;
                return;
            }
            // START Capture URL Query Params
            const urlParams = new URLSearchParams(this._getSearch());
            const frameId = urlParams.get('frame_id');
            if (!frameId) {
                throw new Error('frame_id query param is not defined');
            }
            this.frameId = frameId;
            const instanceId = urlParams.get('instance_id');
            if (!instanceId) {
                throw new Error('instance_id query param is not defined');
            }
            this.instanceId = instanceId;
            const platform = urlParams.get('platform');
            if (!platform) {
                throw new Error('platform query param is not defined');
            }
            else if (platform !== exports.Platform.DESKTOP && platform !== exports.Platform.MOBILE) {
                throw new Error(`Invalid query param "platform" of "${platform}". Valid values are "${exports.Platform.DESKTOP}" or "${exports.Platform.MOBILE}"`);
            }
            this.platform = platform;
            this.guildId = urlParams.get('guild_id');
            this.channelId = urlParams.get('channel_id');
            // END Capture URL Query Params
            [this.source, this.sourceOrigin] = getRPCServerSource();
            this.addOnReadyListener();
            this.handshake();
        }
        close(code, message) {
            var _a;
            window.removeEventListener('message', this.handleMessage);
            const nonce = v4();
            (_a = this.source) === null || _a === void 0 ? void 0 : _a.postMessage([Opcodes.CLOSE, { code, message, nonce }], this.sourceOrigin);
        }
        async subscribe(event, listener, ...rest) {
            const [subscribeArgs] = rest;
            const listenerCount = this.eventBus.listenerCount(event);
            const emitter = this.eventBus.on(event, listener);
            // If first subscription, subscribe via RPC
            if (Object.values(exports.Events).includes(event) && event !== exports.Events.READY && listenerCount === 0) {
                await this.sendCommand({
                    cmd: Commands$1.SUBSCRIBE,
                    args: subscribeArgs,
                    evt: event,
                });
            }
            return emitter;
        }
        async unsubscribe(event, listener, ...rest) {
            const [unsubscribeArgs] = rest;
            if (event !== exports.Events.READY && this.eventBus.listenerCount(event) === 1) {
                await this.sendCommand({
                    cmd: Commands$1.UNSUBSCRIBE,
                    evt: event,
                    args: unsubscribeArgs,
                });
            }
            return this.eventBus.off(event, listener);
        }
        async ready() {
            if (this.isReady) {
                return;
            }
            else {
                await new Promise((resolve) => {
                    this.eventBus.once(exports.Events.READY, resolve);
                });
            }
        }
        handshake() {
            var _a;
            (_a = this.source) === null || _a === void 0 ? void 0 : _a.postMessage([
                Opcodes.HANDSHAKE,
                {
                    v: 1,
                    encoding: 'json',
                    client_id: this.clientId,
                    frame_id: this.frameId,
                },
            ], this.sourceOrigin);
        }
        addOnReadyListener() {
            this.eventBus.once(exports.Events.READY, () => {
                this.overrideConsoleLogging();
                this.isReady = true;
            });
        }
        overrideConsoleLogging() {
            if (this.configuration.disableConsoleLogOverride)
                return;
            const sendCaptureLogCommand = (level, message) => {
                this.commands.captureLog({
                    level,
                    message,
                });
            };
            consoleLevels.forEach((level) => {
                wrapConsoleMethod(console, level, sendCaptureLogCommand);
            });
        }
        handleClose(data) {
            ClosePayload.parse(data);
        }
        handleHandshake() { }
        handleFrame(payload) {
            var _a, _b;
            let parsed;
            try {
                parsed = parseIncomingPayload(payload);
            }
            catch (e) {
                console.error('Failed to parse', payload);
                console.error(e);
                return;
            }
            if (parsed.cmd === 'DISPATCH') {
                this.eventBus.emit(parsed.evt, parsed.data);
            }
            else {
                if (parsed.evt === ERROR) {
                    // In response to a command
                    if (parsed.nonce != null) {
                        (_a = this.pendingCommands.get(parsed.nonce)) === null || _a === void 0 ? void 0 : _a.reject(parsed.data);
                        this.pendingCommands.delete(parsed.nonce);
                        return;
                    }
                    // General error
                    this.eventBus.emit('error', new SDKError(parsed.data.code, parsed.data.message));
                }
                if (parsed.nonce == null) {
                    console.error('Missing nonce', payload);
                    return;
                }
                (_b = this.pendingCommands.get(parsed.nonce)) === null || _b === void 0 ? void 0 : _b.resolve(parsed);
                this.pendingCommands.delete(parsed.nonce);
            }
        }
        _getSearch() {
            return typeof window === 'undefined' ? '' : window.location.search;
        }
    }

    function can(permission, permissions) {
        return BigFlagUtils.has(BigFlagUtils.deserialize(permissions), permission);
    }
    var PermissionUtils = {
        can,
    };

    /*
     *  decimal.js-light v2.5.0
     *  An arbitrary-precision Decimal type for JavaScript.
     *  https://github.com/MikeMcl/decimal.js-light
     *  Copyright (c) 2018 Michael Mclaughlin <M8ch88l@gmail.com>
     *  MIT Expat Licence
     */


    // ------------------------------------  EDITABLE DEFAULTS  ------------------------------------- //


    // The limit on the value of `precision`, and on the value of the first argument to
    // `toDecimalPlaces`, `toExponential`, `toFixed`, `toPrecision` and `toSignificantDigits`.
    var MAX_DIGITS = 1e9,                        // 0 to 1e9


      // The initial configuration properties of the Decimal constructor.
      defaults = {

        // These values must be integers within the stated ranges (inclusive).
        // Most of these values can be changed during run-time using `Decimal.config`.

        // The maximum number of significant digits of the result of a calculation or base conversion.
        // E.g. `Decimal.config({ precision: 20 });`
        precision: 20,                         // 1 to MAX_DIGITS

        // The rounding mode used by default by `toInteger`, `toDecimalPlaces`, `toExponential`,
        // `toFixed`, `toPrecision` and `toSignificantDigits`.
        //
        // ROUND_UP         0 Away from zero.
        // ROUND_DOWN       1 Towards zero.
        // ROUND_CEIL       2 Towards +Infinity.
        // ROUND_FLOOR      3 Towards -Infinity.
        // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
        // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
        // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
        // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
        // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
        //
        // E.g.
        // `Decimal.rounding = 4;`
        // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
        rounding: 4,                           // 0 to 8

        // The exponent value at and beneath which `toString` returns exponential notation.
        // JavaScript numbers: -7
        toExpNeg: -7,                          // 0 to -MAX_E

        // The exponent value at and above which `toString` returns exponential notation.
        // JavaScript numbers: 21
        toExpPos:  21,                         // 0 to MAX_E

        // The natural logarithm of 10.
        // 115 digits
        LN10: '2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286'
      },


    // ------------------------------------ END OF EDITABLE DEFAULTS -------------------------------- //


      Decimal,
      external = true,

      decimalError = '[DecimalError] ',
      invalidArgument = decimalError + 'Invalid argument: ',
      exponentOutOfRange = decimalError + 'Exponent out of range: ',

      mathfloor = Math.floor,
      mathpow = Math.pow,

      isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,

      ONE,
      BASE = 1e7,
      LOG_BASE = 7,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_E = mathfloor(MAX_SAFE_INTEGER / LOG_BASE),    // 1286742750677284

      // Decimal.prototype object
      P = {};


    // Decimal prototype methods


    /*
     *  absoluteValue                       abs
     *  comparedTo                          cmp
     *  decimalPlaces                       dp
     *  dividedBy                           div
     *  dividedToIntegerBy                  idiv
     *  equals                              eq
     *  exponent
     *  greaterThan                         gt
     *  greaterThanOrEqualTo                gte
     *  isInteger                           isint
     *  isNegative                          isneg
     *  isPositive                          ispos
     *  isZero
     *  lessThan                            lt
     *  lessThanOrEqualTo                   lte
     *  logarithm                           log
     *  minus                               sub
     *  modulo                              mod
     *  naturalExponential                  exp
     *  naturalLogarithm                    ln
     *  negated                             neg
     *  plus                                add
     *  precision                           sd
     *  squareRoot                          sqrt
     *  times                               mul
     *  toDecimalPlaces                     todp
     *  toExponential
     *  toFixed
     *  toInteger                           toint
     *  toNumber
     *  toPower                             pow
     *  toPrecision
     *  toSignificantDigits                 tosd
     *  toString
     *  valueOf                             val
     */


    /*
     * Return a new Decimal whose value is the absolute value of this Decimal.
     *
     */
    P.absoluteValue = P.abs = function () {
      var x = new this.constructor(this);
      if (x.s) x.s = 1;
      return x;
    };


    /*
     * Return
     *   1    if the value of this Decimal is greater than the value of `y`,
     *  -1    if the value of this Decimal is less than the value of `y`,
     *   0    if they have the same value
     *
     */
    P.comparedTo = P.cmp = function (y) {
      var i, j, xdL, ydL,
        x = this;

      y = new x.constructor(y);

      // Signs differ?
      if (x.s !== y.s) return x.s || -y.s;

      // Compare exponents.
      if (x.e !== y.e) return x.e > y.e ^ x.s < 0 ? 1 : -1;

      xdL = x.d.length;
      ydL = y.d.length;

      // Compare digit by digit.
      for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) {
        if (x.d[i] !== y.d[i]) return x.d[i] > y.d[i] ^ x.s < 0 ? 1 : -1;
      }

      // Compare lengths.
      return xdL === ydL ? 0 : xdL > ydL ^ x.s < 0 ? 1 : -1;
    };


    /*
     * Return the number of decimal places of the value of this Decimal.
     *
     */
    P.decimalPlaces = P.dp = function () {
      var x = this,
        w = x.d.length - 1,
        dp = (w - x.e) * LOG_BASE;

      // Subtract the number of trailing zeros of the last word.
      w = x.d[w];
      if (w) for (; w % 10 == 0; w /= 10) dp--;

      return dp < 0 ? 0 : dp;
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal divided by `y`, truncated to
     * `precision` significant digits.
     *
     */
    P.dividedBy = P.div = function (y) {
      return divide(this, new this.constructor(y));
    };


    /*
     * Return a new Decimal whose value is the integer part of dividing the value of this Decimal
     * by the value of `y`, truncated to `precision` significant digits.
     *
     */
    P.dividedToIntegerBy = P.idiv = function (y) {
      var x = this,
        Ctor = x.constructor;
      return round(divide(x, new Ctor(y), 0, 1), Ctor.precision);
    };


    /*
     * Return true if the value of this Decimal is equal to the value of `y`, otherwise return false.
     *
     */
    P.equals = P.eq = function (y) {
      return !this.cmp(y);
    };


    /*
     * Return the (base 10) exponent value of this Decimal (this.e is the base 10000000 exponent).
     *
     */
    P.exponent = function () {
      return getBase10Exponent(this);
    };


    /*
     * Return true if the value of this Decimal is greater than the value of `y`, otherwise return
     * false.
     *
     */
    P.greaterThan = P.gt = function (y) {
      return this.cmp(y) > 0;
    };


    /*
     * Return true if the value of this Decimal is greater than or equal to the value of `y`,
     * otherwise return false.
     *
     */
    P.greaterThanOrEqualTo = P.gte = function (y) {
      return this.cmp(y) >= 0;
    };


    /*
     * Return true if the value of this Decimal is an integer, otherwise return false.
     *
     */
    P.isInteger = P.isint = function () {
      return this.e > this.d.length - 2;
    };


    /*
     * Return true if the value of this Decimal is negative, otherwise return false.
     *
     */
    P.isNegative = P.isneg = function () {
      return this.s < 0;
    };


    /*
     * Return true if the value of this Decimal is positive, otherwise return false.
     *
     */
    P.isPositive = P.ispos = function () {
      return this.s > 0;
    };


    /*
     * Return true if the value of this Decimal is 0, otherwise return false.
     *
     */
    P.isZero = function () {
      return this.s === 0;
    };


    /*
     * Return true if the value of this Decimal is less than `y`, otherwise return false.
     *
     */
    P.lessThan = P.lt = function (y) {
      return this.cmp(y) < 0;
    };


    /*
     * Return true if the value of this Decimal is less than or equal to `y`, otherwise return false.
     *
     */
    P.lessThanOrEqualTo = P.lte = function (y) {
      return this.cmp(y) < 1;
    };


    /*
     * Return the logarithm of the value of this Decimal to the specified base, truncated to
     * `precision` significant digits.
     *
     * If no base is specified, return log[10](x).
     *
     * log[base](x) = ln(x) / ln(base)
     *
     * The maximum error of the result is 1 ulp (unit in the last place).
     *
     * [base] {number|string|Decimal} The base of the logarithm.
     *
     */
    P.logarithm = P.log = function (base) {
      var r,
        x = this,
        Ctor = x.constructor,
        pr = Ctor.precision,
        wpr = pr + 5;

      // Default base is 10.
      if (base === void 0) {
        base = new Ctor(10);
      } else {
        base = new Ctor(base);

        // log[-b](x) = NaN
        // log[0](x)  = NaN
        // log[1](x)  = NaN
        if (base.s < 1 || base.eq(ONE)) throw Error(decimalError + 'NaN');
      }

      // log[b](-x) = NaN
      // log[b](0) = -Infinity
      if (x.s < 1) throw Error(decimalError + (x.s ? 'NaN' : '-Infinity'));

      // log[b](1) = 0
      if (x.eq(ONE)) return new Ctor(0);

      external = false;
      r = divide(ln(x, wpr), ln(base, wpr), wpr);
      external = true;

      return round(r, pr);
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal minus `y`, truncated to
     * `precision` significant digits.
     *
     */
    P.minus = P.sub = function (y) {
      var x = this;
      y = new x.constructor(y);
      return x.s == y.s ? subtract(x, y) : add(x, (y.s = -y.s, y));
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal modulo `y`, truncated to
     * `precision` significant digits.
     *
     */
    P.modulo = P.mod = function (y) {
      var q,
        x = this,
        Ctor = x.constructor,
        pr = Ctor.precision;

      y = new Ctor(y);

      // x % 0 = NaN
      if (!y.s) throw Error(decimalError + 'NaN');

      // Return x if x is 0.
      if (!x.s) return round(new Ctor(x), pr);

      // Prevent rounding of intermediate calculations.
      external = false;
      q = divide(x, y, 0, 1).times(y);
      external = true;

      return x.minus(q);
    };


    /*
     * Return a new Decimal whose value is the natural exponential of the value of this Decimal,
     * i.e. the base e raised to the power the value of this Decimal, truncated to `precision`
     * significant digits.
     *
     */
    P.naturalExponential = P.exp = function () {
      return exp(this);
    };


    /*
     * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
     * truncated to `precision` significant digits.
     *
     */
    P.naturalLogarithm = P.ln = function () {
      return ln(this);
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if multiplied by
     * -1.
     *
     */
    P.negated = P.neg = function () {
      var x = new this.constructor(this);
      x.s = -x.s || 0;
      return x;
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal plus `y`, truncated to
     * `precision` significant digits.
     *
     */
    P.plus = P.add = function (y) {
      var x = this;
      y = new x.constructor(y);
      return x.s == y.s ? add(x, y) : subtract(x, (y.s = -y.s, y));
    };


    /*
     * Return the number of significant digits of the value of this Decimal.
     *
     * [z] {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
     *
     */
    P.precision = P.sd = function (z) {
      var e, sd, w,
        x = this;

      if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);

      e = getBase10Exponent(x) + 1;
      w = x.d.length - 1;
      sd = w * LOG_BASE + 1;
      w = x.d[w];

      // If non-zero...
      if (w) {

        // Subtract the number of trailing zeros of the last word.
        for (; w % 10 == 0; w /= 10) sd--;

        // Add the number of digits of the first word.
        for (w = x.d[0]; w >= 10; w /= 10) sd++;
      }

      return z && e > sd ? e : sd;
    };


    /*
     * Return a new Decimal whose value is the square root of this Decimal, truncated to `precision`
     * significant digits.
     *
     */
    P.squareRoot = P.sqrt = function () {
      var e, n, pr, r, s, t, wpr,
        x = this,
        Ctor = x.constructor;

      // Negative or zero?
      if (x.s < 1) {
        if (!x.s) return new Ctor(0);

        // sqrt(-x) = NaN
        throw Error(decimalError + 'NaN');
      }

      e = getBase10Exponent(x);
      external = false;

      // Initial estimate.
      s = Math.sqrt(+x);

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
      if (s == 0 || s == 1 / 0) {
        n = digitsToString(x.d);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(n);
        e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '1e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new Ctor(n);
      } else {
        r = new Ctor(s.toString());
      }

      pr = Ctor.precision;
      s = wpr = pr + 3;

      // Newton-Raphson iteration.
      for (;;) {
        t = r;
        r = t.plus(divide(x, t, wpr + 2)).times(0.5);

        if (digitsToString(t.d).slice(0, wpr) === (n = digitsToString(r.d)).slice(0, wpr)) {
          n = n.slice(wpr - 3, wpr + 1);

          // The 4th rounding digit may be in error by -1 so if the 4 rounding digits are 9999 or
          // 4999, i.e. approaching a rounding boundary, continue the iteration.
          if (s == wpr && n == '4999') {

            // On the first iteration only, check to see if rounding up gives the exact result as the
            // nines may infinitely repeat.
            round(t, pr + 1, 0);

            if (t.times(t).eq(x)) {
              r = t;
              break;
            }
          } else if (n != '9999') {
            break;
          }

          wpr += 4;
        }
      }

      external = true;

      return round(r, pr);
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal times `y`, truncated to
     * `precision` significant digits.
     *
     */
    P.times = P.mul = function (y) {
      var carry, e, i, k, r, rL, t, xdL, ydL,
        x = this,
        Ctor = x.constructor,
        xd = x.d,
        yd = (y = new Ctor(y)).d;

      // Return 0 if either is 0.
      if (!x.s || !y.s) return new Ctor(0);

      y.s *= x.s;
      e = x.e + y.e;
      xdL = xd.length;
      ydL = yd.length;

      // Ensure xd points to the longer array.
      if (xdL < ydL) {
        r = xd;
        xd = yd;
        yd = r;
        rL = xdL;
        xdL = ydL;
        ydL = rL;
      }

      // Initialise the result array with zeros.
      r = [];
      rL = xdL + ydL;
      for (i = rL; i--;) r.push(0);

      // Multiply!
      for (i = ydL; --i >= 0;) {
        carry = 0;
        for (k = xdL + i; k > i;) {
          t = r[k] + yd[i] * xd[k - i - 1] + carry;
          r[k--] = t % BASE | 0;
          carry = t / BASE | 0;
        }

        r[k] = (r[k] + carry) % BASE | 0;
      }

      // Remove trailing zeros.
      for (; !r[--rL];) r.pop();

      if (carry) ++e;
      else r.shift();

      y.d = r;
      y.e = e;

      return external ? round(y, Ctor.precision) : y;
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `dp`
     * decimal places using rounding mode `rm` or `rounding` if `rm` is omitted.
     *
     * If `dp` is omitted, return a new Decimal whose value is the value of this Decimal.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     */
    P.toDecimalPlaces = P.todp = function (dp, rm) {
      var x = this,
        Ctor = x.constructor;

      x = new Ctor(x);
      if (dp === void 0) return x;

      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      return round(x, dp + getBase10Exponent(x) + 1, rm);
    };


    /*
     * Return a string representing the value of this Decimal in exponential notation rounded to
     * `dp` fixed decimal places using rounding mode `rounding`.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     */
    P.toExponential = function (dp, rm) {
      var str,
        x = this,
        Ctor = x.constructor;

      if (dp === void 0) {
        str = toString(x, true);
      } else {
        checkInt32(dp, 0, MAX_DIGITS);

        if (rm === void 0) rm = Ctor.rounding;
        else checkInt32(rm, 0, 8);

        x = round(new Ctor(x), dp + 1, rm);
        str = toString(x, true, dp + 1);
      }

      return str;
    };


    /*
     * Return a string representing the value of this Decimal in normal (fixed-point) notation to
     * `dp` fixed decimal places and rounded using rounding mode `rm` or `rounding` if `rm` is
     * omitted.
     *
     * As with JavaScript numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
     * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
     * (-0).toFixed(3) is '0.000'.
     * (-0.5).toFixed(0) is '-0'.
     *
     */
    P.toFixed = function (dp, rm) {
      var str, y,
        x = this,
        Ctor = x.constructor;

      if (dp === void 0) return toString(x);

      checkInt32(dp, 0, MAX_DIGITS);

      if (rm === void 0) rm = Ctor.rounding;
      else checkInt32(rm, 0, 8);

      y = round(new Ctor(x), dp + getBase10Exponent(x) + 1, rm);
      str = toString(y.abs(), false, dp + getBase10Exponent(y) + 1);

      // To determine whether to add the minus sign look at the value before it was rounded,
      // i.e. look at `x` rather than `y`.
      return x.isneg() && !x.isZero() ? '-' + str : str;
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
     * rounding mode `rounding`.
     *
     */
    P.toInteger = P.toint = function () {
      var x = this,
        Ctor = x.constructor;
      return round(new Ctor(x), getBase10Exponent(x) + 1, Ctor.rounding);
    };


    /*
     * Return the value of this Decimal converted to a number primitive.
     *
     */
    P.toNumber = function () {
      return +this;
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal raised to the power `y`,
     * truncated to `precision` significant digits.
     *
     * For non-integer or very large exponents pow(x, y) is calculated using
     *
     *   x^y = exp(y*ln(x))
     *
     * The maximum error is 1 ulp (unit in last place).
     *
     * y {number|string|Decimal} The power to which to raise this Decimal.
     *
     */
    P.toPower = P.pow = function (y) {
      var e, k, pr, r, sign, yIsInt,
        x = this,
        Ctor = x.constructor,
        guard = 12,
        yn = +(y = new Ctor(y));

      // pow(x, 0) = 1
      if (!y.s) return new Ctor(ONE);

      x = new Ctor(x);

      // pow(0, y > 0) = 0
      // pow(0, y < 0) = Infinity
      if (!x.s) {
        if (y.s < 1) throw Error(decimalError + 'Infinity');
        return x;
      }

      // pow(1, y) = 1
      if (x.eq(ONE)) return x;

      pr = Ctor.precision;

      // pow(x, 1) = x
      if (y.eq(ONE)) return round(x, pr);

      e = y.e;
      k = y.d.length - 1;
      yIsInt = e >= k;
      sign = x.s;

      if (!yIsInt) {

        // pow(x < 0, y non-integer) = NaN
        if (sign < 0) throw Error(decimalError + 'NaN');

      // If y is a small integer use the 'exponentiation by squaring' algorithm.
      } else if ((k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
        r = new Ctor(ONE);

        // Max k of 9007199254740991 takes 53 loop iterations.
        // Maximum digits array length; leaves [28, 34] guard digits.
        e = Math.ceil(pr / LOG_BASE + 4);

        external = false;

        for (;;) {
          if (k % 2) {
            r = r.times(x);
            truncate(r.d, e);
          }

          k = mathfloor(k / 2);
          if (k === 0) break;

          x = x.times(x);
          truncate(x.d, e);
        }

        external = true;

        return y.s < 0 ? new Ctor(ONE).div(r) : round(r, pr);
      }

      // Result is negative if x is negative and the last digit of integer y is odd.
      sign = sign < 0 && y.d[Math.max(e, k)] & 1 ? -1 : 1;

      x.s = 1;
      external = false;
      r = y.times(ln(x, pr + guard));
      external = true;
      r = exp(r);
      r.s = sign;

      return r;
    };


    /*
     * Return a string representing the value of this Decimal rounded to `sd` significant digits
     * using rounding mode `rounding`.
     *
     * Return exponential notation if `sd` is less than the number of digits necessary to represent
     * the integer part of the value in normal notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     */
    P.toPrecision = function (sd, rm) {
      var e, str,
        x = this,
        Ctor = x.constructor;

      if (sd === void 0) {
        e = getBase10Exponent(x);
        str = toString(x, e <= Ctor.toExpNeg || e >= Ctor.toExpPos);
      } else {
        checkInt32(sd, 1, MAX_DIGITS);

        if (rm === void 0) rm = Ctor.rounding;
        else checkInt32(rm, 0, 8);

        x = round(new Ctor(x), sd, rm);
        e = getBase10Exponent(x);
        str = toString(x, sd <= e || e <= Ctor.toExpNeg, sd);
      }

      return str;
    };


    /*
     * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of `sd`
     * significant digits using rounding mode `rm`, or to `precision` and `rounding` respectively if
     * omitted.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     */
    P.toSignificantDigits = P.tosd = function (sd, rm) {
      var x = this,
        Ctor = x.constructor;

      if (sd === void 0) {
        sd = Ctor.precision;
        rm = Ctor.rounding;
      } else {
        checkInt32(sd, 1, MAX_DIGITS);

        if (rm === void 0) rm = Ctor.rounding;
        else checkInt32(rm, 0, 8);
      }

      return round(new Ctor(x), sd, rm);
    };


    /*
     * Return a string representing the value of this Decimal.
     *
     * Return exponential notation if this Decimal has a positive exponent equal to or greater than
     * `toExpPos`, or a negative exponent equal to or less than `toExpNeg`.
     *
     */
    P.toString = P.valueOf = P.val = P.toJSON = P[Symbol.for('nodejs.util.inspect.custom')] = function () {
      var x = this,
        e = getBase10Exponent(x),
        Ctor = x.constructor;

      return toString(x, e <= Ctor.toExpNeg || e >= Ctor.toExpPos);
    };


    // Helper functions for Decimal.prototype (P) and/or Decimal methods, and their callers.


    /*
     *  add                 P.minus, P.plus
     *  checkInt32          P.todp, P.toExponential, P.toFixed, P.toPrecision, P.tosd
     *  digitsToString      P.log, P.sqrt, P.pow, toString, exp, ln
     *  divide              P.div, P.idiv, P.log, P.mod, P.sqrt, exp, ln
     *  exp                 P.exp, P.pow
     *  getBase10Exponent   P.exponent, P.sd, P.toint, P.sqrt, P.todp, P.toFixed, P.toPrecision,
     *                      P.toString, divide, round, toString, exp, ln
     *  getLn10             P.log, ln
     *  getZeroString       digitsToString, toString
     *  ln                  P.log, P.ln, P.pow, exp
     *  parseDecimal        Decimal
     *  round               P.abs, P.idiv, P.log, P.minus, P.mod, P.neg, P.plus, P.toint, P.sqrt,
     *                      P.times, P.todp, P.toExponential, P.toFixed, P.pow, P.toPrecision, P.tosd,
     *                      divide, getLn10, exp, ln
     *  subtract            P.minus, P.plus
     *  toString            P.toExponential, P.toFixed, P.toPrecision, P.toString, P.valueOf
     *  truncate            P.pow
     *
     *  Throws:             P.log, P.mod, P.sd, P.sqrt, P.pow,  checkInt32, divide, round,
     *                      getLn10, exp, ln, parseDecimal, Decimal, config
     */


    function add(x, y) {
      var carry, d, e, i, k, len, xd, yd,
        Ctor = x.constructor,
        pr = Ctor.precision;

      // If either is zero...
      if (!x.s || !y.s) {

        // Return x if y is zero.
        // Return y if y is non-zero.
        if (!y.s) y = new Ctor(x);
        return external ? round(y, pr) : y;
      }

      xd = x.d;
      yd = y.d;

      // x and y are finite, non-zero numbers with the same sign.

      k = x.e;
      e = y.e;
      xd = xd.slice();
      i = k - e;

      // If base 1e7 exponents differ...
      if (i) {
        if (i < 0) {
          d = xd;
          i = -i;
          len = yd.length;
        } else {
          d = yd;
          e = k;
          len = xd.length;
        }

        // Limit number of zeros prepended to max(ceil(pr / LOG_BASE), len) + 1.
        k = Math.ceil(pr / LOG_BASE);
        len = k > len ? k + 1 : len + 1;

        if (i > len) {
          i = len;
          d.length = 1;
        }

        // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.
        d.reverse();
        for (; i--;) d.push(0);
        d.reverse();
      }

      len = xd.length;
      i = yd.length;

      // If yd is longer than xd, swap xd and yd so xd points to the longer array.
      if (len - i < 0) {
        i = len;
        d = yd;
        yd = xd;
        xd = d;
      }

      // Only start adding at yd.length - 1 as the further digits of xd can be left as they are.
      for (carry = 0; i;) {
        carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
        xd[i] %= BASE;
      }

      if (carry) {
        xd.unshift(carry);
        ++e;
      }

      // Remove trailing zeros.
      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      for (len = xd.length; xd[--len] == 0;) xd.pop();

      y.d = xd;
      y.e = e;

      return external ? round(y, pr) : y;
    }


    function checkInt32(i, min, max) {
      if (i !== ~~i || i < min || i > max) {
        throw Error(invalidArgument + i);
      }
    }


    function digitsToString(d) {
      var i, k, ws,
        indexOfLastWord = d.length - 1,
        str = '',
        w = d[0];

      if (indexOfLastWord > 0) {
        str += w;
        for (i = 1; i < indexOfLastWord; i++) {
          ws = d[i] + '';
          k = LOG_BASE - ws.length;
          if (k) str += getZeroString(k);
          str += ws;
        }

        w = d[i];
        ws = w + '';
        k = LOG_BASE - ws.length;
        if (k) str += getZeroString(k);
      } else if (w === 0) {
        return '0';
      }

      // Remove trailing zeros of last w.
      for (; w % 10 === 0;) w /= 10;

      return str + w;
    }


    var divide = (function () {

      // Assumes non-zero x and k, and hence non-zero result.
      function multiplyInteger(x, k) {
        var temp,
          carry = 0,
          i = x.length;

        for (x = x.slice(); i--;) {
          temp = x[i] * k + carry;
          x[i] = temp % BASE | 0;
          carry = temp / BASE | 0;
        }

        if (carry) x.unshift(carry);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, r;

        if (aL != bL) {
          r = aL > bL ? 1 : -1;
        } else {
          for (i = r = 0; i < aL; i++) {
            if (a[i] != b[i]) {
              r = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return r;
      }

      function subtract(a, b, aL) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * BASE + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1;) a.shift();
      }

      return function (x, y, pr, dp) {
        var cmp, e, i, k, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz,
          Ctor = x.constructor,
          sign = x.s == y.s ? 1 : -1,
          xd = x.d,
          yd = y.d;

        // Either 0?
        if (!x.s) return new Ctor(x);
        if (!y.s) throw Error(decimalError + 'Division by zero');

        e = x.e - y.e;
        yL = yd.length;
        xL = xd.length;
        q = new Ctor(sign);
        qd = q.d = [];

        // Result exponent may be one less than e.
        for (i = 0; yd[i] == (xd[i] || 0); ) ++i;
        if (yd[i] > (xd[i] || 0)) --e;

        if (pr == null) {
          sd = pr = Ctor.precision;
        } else if (dp) {
          sd = pr + (getBase10Exponent(x) - getBase10Exponent(y)) + 1;
        } else {
          sd = pr;
        }

        if (sd < 0) return new Ctor(0);

        // Convert precision in number of base 10 digits to base 1e7 digits.
        sd = sd / LOG_BASE + 2 | 0;
        i = 0;

        // divisor < 1e7
        if (yL == 1) {
          k = 0;
          yd = yd[0];
          sd++;

          // k is the carry.
          for (; (i < xL || k) && sd--; i++) {
            t = k * BASE + (xd[i] || 0);
            qd[i] = t / yd | 0;
            k = t % yd | 0;
          }

        // divisor >= 1e7
        } else {

          // Normalise xd and yd so highest order digit of yd is >= BASE/2
          k = BASE / (yd[0] + 1) | 0;

          if (k > 1) {
            yd = multiplyInteger(yd, k);
            xd = multiplyInteger(xd, k);
            yL = yd.length;
            xL = xd.length;
          }

          xi = yL;
          rem = xd.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL;) rem[remL++] = 0;

          yz = yd.slice();
          yz.unshift(0);
          yd0 = yd[0];

          if (yd[1] >= BASE / 2) ++yd0;

          do {
            k = 0;

            // Compare divisor and remainder.
            cmp = compare(yd, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, k.
              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * BASE + (rem[1] || 0);

              // k will be how many times the divisor goes into the current remainder.
              k = rem0 / yd0 | 0;

              //  Algorithm:
              //  1. product = divisor * trial digit (k)
              //  2. if product > remainder: product -= divisor, k--
              //  3. remainder -= product
              //  4. if product was < remainder at 2:
              //    5. compare new remainder and divisor
              //    6. If remainder > divisor: remainder -= divisor, k++

              if (k > 1) {
                if (k >= BASE) k = BASE - 1;

                // product = divisor * trial digit.
                prod = multiplyInteger(yd, k);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                cmp = compare(prod, rem, prodL, remL);

                // product > remainder.
                if (cmp == 1) {
                  k--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yd, prodL);
                }
              } else {

                // cmp is -1.
                // If k is 0, there is no need to compare yd and rem again below, so change cmp to 1
                // to avoid it. If k is 1 there is a need to compare yd and rem again below.
                if (k == 0) cmp = k = 1;
                prod = yd.slice();
              }

              prodL = prod.length;
              if (prodL < remL) prod.unshift(0);

              // Subtract product from remainder.
              subtract(rem, prod, remL);

              // If product was < previous remainder.
              if (cmp == -1) {
                remL = rem.length;

                // Compare divisor and new remainder.
                cmp = compare(yd, rem, yL, remL);

                // If divisor < new remainder, subtract divisor from remainder.
                if (cmp < 1) {
                  k++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yd, remL);
                }
              }

              remL = rem.length;
            } else if (cmp === 0) {
              k++;
              rem = [0];
            }    // if cmp === 1, k will be 0

            // Add the next digit, k, to the result array.
            qd[i++] = k;

            // Update the remainder.
            if (cmp && rem[0]) {
              rem[remL++] = xd[xi] || 0;
            } else {
              rem = [xd[xi]];
              remL = 1;
            }

          } while ((xi++ < xL || rem[0] !== void 0) && sd--);
        }

        // Leading zero?
        if (!qd[0]) qd.shift();

        q.e = e;

        return round(q, dp ? pr + getBase10Exponent(q) + 1 : pr);
      };
    })();


    /*
     * Return a new Decimal whose value is the natural exponential of `x` truncated to `sd`
     * significant digits.
     *
     * Taylor/Maclaurin series.
     *
     * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
     *
     * Argument reduction:
     *   Repeat x = x / 32, k += 5, until |x| < 0.1
     *   exp(x) = exp(x / 2^k)^(2^k)
     *
     * Previously, the argument was initially reduced by
     * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
     * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
     * found to be slower than just dividing repeatedly by 32 as above.
     *
     * (Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324)
     *
     *  exp(x) is non-terminating for any finite, non-zero x.
     *
     */
    function exp(x, sd) {
      var denominator, guard, pow, sum, t, wpr,
        i = 0,
        k = 0,
        Ctor = x.constructor,
        pr = Ctor.precision;

      if (getBase10Exponent(x) > 16) throw Error(exponentOutOfRange + getBase10Exponent(x));

      // exp(0) = 1
      if (!x.s) return new Ctor(ONE);

      if (sd == null) {
        external = false;
        wpr = pr;
      } else {
        wpr = sd;
      }

      t = new Ctor(0.03125);

      while (x.abs().gte(0.1)) {
        x = x.times(t);    // x = x / 2^5
        k += 5;
      }

      // Estimate the precision increase necessary to ensure the first 4 rounding digits are correct.
      guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
      wpr += guard;
      denominator = pow = sum = new Ctor(ONE);
      Ctor.precision = wpr;

      for (;;) {
        pow = round(pow.times(x), wpr);
        denominator = denominator.times(++i);
        t = sum.plus(divide(pow, denominator, wpr));

        if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
          while (k--) sum = round(sum.times(sum), wpr);
          Ctor.precision = pr;
          return sd == null ? (external = true, round(sum, pr)) : sum;
        }

        sum = t;
      }
    }


    // Calculate the base 10 exponent from the base 1e7 exponent.
    function getBase10Exponent(x) {
      var e = x.e * LOG_BASE,
        w = x.d[0];

      // Add the number of digits of the first word of the digits array.
      for (; w >= 10; w /= 10) e++;
      return e;
    }


    function getLn10(Ctor, sd, pr) {

      if (sd > Ctor.LN10.sd()) {


        // Reset global state in case the exception is caught.
        external = true;
        if (pr) Ctor.precision = pr;
        throw Error(decimalError + 'LN10 precision limit exceeded');
      }

      return round(new Ctor(Ctor.LN10), sd);
    }


    function getZeroString(k) {
      var zs = '';
      for (; k--;) zs += '0';
      return zs;
    }


    /*
     * Return a new Decimal whose value is the natural logarithm of `x` truncated to `sd` significant
     * digits.
     *
     *  ln(n) is non-terminating (n != 1)
     *
     */
    function ln(y, sd) {
      var c, c0, denominator, e, numerator, sum, t, wpr, x2,
        n = 1,
        guard = 10,
        x = y,
        xd = x.d,
        Ctor = x.constructor,
        pr = Ctor.precision;

      // ln(-x) = NaN
      // ln(0) = -Infinity
      if (x.s < 1) throw Error(decimalError + (x.s ? 'NaN' : '-Infinity'));

      // ln(1) = 0
      if (x.eq(ONE)) return new Ctor(0);

      if (sd == null) {
        external = false;
        wpr = pr;
      } else {
        wpr = sd;
      }

      if (x.eq(10)) {
        if (sd == null) external = true;
        return getLn10(Ctor, wpr);
      }

      wpr += guard;
      Ctor.precision = wpr;
      c = digitsToString(xd);
      c0 = c.charAt(0);
      e = getBase10Exponent(x);

      if (Math.abs(e) < 1.5e15) {

        // Argument reduction.
        // The series converges faster the closer the argument is to 1, so using
        // ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
        // multiply the argument by itself until the leading digits of the significand are 7, 8, 9,
        // 10, 11, 12 or 13, recording the number of multiplications so the sum of the series can
        // later be divided by this number, then separate out the power of 10 using
        // ln(a*10^b) = ln(a) + b*ln(10).

        // max n is 21 (gives 0.9, 1.0 or 1.1) (9e15 / 21 = 4.2e14).
        //while (c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1) {
        // max n is 6 (gives 0.7 - 1.3)
        while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
          x = x.times(y);
          c = digitsToString(x.d);
          c0 = c.charAt(0);
          n++;
        }

        e = getBase10Exponent(x);

        if (c0 > 1) {
          x = new Ctor('0.' + c);
          e++;
        } else {
          x = new Ctor(c0 + '.' + c.slice(1));
        }
      } else {

        // The argument reduction method above may result in overflow if the argument y is a massive
        // number with exponent >= 1500000000000000 (9e15 / 6 = 1.5e15), so instead recall this
        // function using ln(x*10^e) = ln(x) + e*ln(10).
        t = getLn10(Ctor, wpr + 2, pr).times(e + '');
        x = ln(new Ctor(c0 + '.' + c.slice(1)), wpr - guard).plus(t);

        Ctor.precision = pr;
        return sd == null ? (external = true, round(x, pr)) : x;
      }

      // x is reduced to a value near 1.

      // Taylor series.
      // ln(y) = ln((1 + x)/(1 - x)) = 2(x + x^3/3 + x^5/5 + x^7/7 + ...)
      // where x = (y - 1)/(y + 1)    (|x| < 1)
      sum = numerator = x = divide(x.minus(ONE), x.plus(ONE), wpr);
      x2 = round(x.times(x), wpr);
      denominator = 3;

      for (;;) {
        numerator = round(numerator.times(x2), wpr);
        t = sum.plus(divide(numerator, new Ctor(denominator), wpr));

        if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
          sum = sum.times(2);

          // Reverse the argument reduction.
          if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ''));
          sum = divide(sum, new Ctor(n), wpr);

          Ctor.precision = pr;
          return sd == null ? (external = true, round(sum, pr)) : sum;
        }

        sum = t;
        denominator += 2;
      }
    }


    /*
     * Parse the value of a new Decimal `x` from string `str`.
     */
    function parseDecimal(x, str) {
      var e, i, len;

      // Decimal point?
      if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

      // Exponential form?
      if ((i = str.search(/e/i)) > 0) {

        // Determine exponent.
        if (e < 0) e = i;
        e += +str.slice(i + 1);
        str = str.substring(0, i);
      } else if (e < 0) {

        // Integer.
        e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48;) ++i;

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(len - 1) === 48;) --len;
      str = str.slice(i, len);

      if (str) {
        len -= i;
        e = e - i - 1;
        x.e = mathfloor(e / LOG_BASE);
        x.d = [];

        // Transform base

        // e is the base 10 exponent.
        // i is where to slice str to get the first word of the digits array.
        i = (e + 1) % LOG_BASE;
        if (e < 0) i += LOG_BASE;

        if (i < len) {
          if (i) x.d.push(+str.slice(0, i));
          for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));
          str = str.slice(i);
          i = LOG_BASE - str.length;
        } else {
          i -= len;
        }

        for (; i--;) str += '0';
        x.d.push(+str);

        if (external && (x.e > MAX_E || x.e < -MAX_E)) throw Error(exponentOutOfRange + e);
      } else {

        // Zero.
        x.s = 0;
        x.e = 0;
        x.d = [0];
      }

      return x;
    }


    /*
     * Round `x` to `sd` significant digits, using rounding mode `rm` if present (truncate otherwise).
     */
     function round(x, sd, rm) {
      var i, j, k, n, rd, doRound, w, xdi,
        xd = x.d;

      // rd: the rounding digit, i.e. the digit after the digit that may be rounded up.
      // w: the word of xd which contains the rounding digit, a base 1e7 number.
      // xdi: the index of w within xd.
      // n: the number of digits of w.
      // i: what would be the index of rd within w if all the numbers were 7 digits long (i.e. if
      // they had leading zeros)
      // j: if > 0, the actual index of rd within w (if < 0, rd is a leading zero).

      // Get the length of the first word of the digits array xd.
      for (n = 1, k = xd[0]; k >= 10; k /= 10) n++;
      i = sd - n;

      // Is the rounding digit in the first word of xd?
      if (i < 0) {
        i += LOG_BASE;
        j = sd;
        w = xd[xdi = 0];
      } else {
        xdi = Math.ceil((i + 1) / LOG_BASE);
        k = xd.length;
        if (xdi >= k) return x;
        w = k = xd[xdi];

        // Get the number of digits of w.
        for (n = 1; k >= 10; k /= 10) n++;

        // Get the index of rd within w.
        i %= LOG_BASE;

        // Get the index of rd within w, adjusted for leading zeros.
        // The number of leading zeros of w is given by LOG_BASE - n.
        j = i - LOG_BASE + n;
      }

      if (rm !== void 0) {
        k = mathpow(10, n - j - 1);

        // Get the rounding digit at index j of w.
        rd = w / k % 10 | 0;

        // Are there any non-zero digits after the rounding digit?
        doRound = sd < 0 || xd[xdi + 1] !== void 0 || w % k;

        // The expression `w % mathpow(10, n - j - 1)` returns all the digits of w to the right of the
        // digit at (left-to-right) index j, e.g. if w is 908714 and j is 2, the expression will give
        // 714.

        doRound = rm < 4
          ? (rd || doRound) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
          : rd > 5 || rd == 5 && (rm == 4 || doRound || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? w / mathpow(10, n - j) : 0 : xd[xdi - 1]) % 10) & 1 ||
              rm == (x.s < 0 ? 8 : 7));
      }

      if (sd < 1 || !xd[0]) {
        if (doRound) {
          k = getBase10Exponent(x);
          xd.length = 1;

          // Convert sd to decimal places.
          sd = sd - k - 1;

          // 1, 0.1, 0.01, 0.001, 0.0001 etc.
          xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
          x.e = mathfloor(-sd / LOG_BASE) || 0;
        } else {
          xd.length = 1;

          // Zero.
          xd[0] = x.e = x.s = 0;
        }

        return x;
      }

      // Remove excess digits.
      if (i == 0) {
        xd.length = xdi;
        k = 1;
        xdi--;
      } else {
        xd.length = xdi + 1;
        k = mathpow(10, LOG_BASE - i);

        // E.g. 56700 becomes 56000 if 7 is the rounding digit.
        // j > 0 means i > number of leading zeros of w.
        xd[xdi] = j > 0 ? (w / mathpow(10, n - j) % mathpow(10, j) | 0) * k : 0;
      }

      if (doRound) {
        for (;;) {

          // Is the digit to be rounded up in the first word of xd?
          if (xdi == 0) {
            if ((xd[0] += k) == BASE) {
              xd[0] = 1;
              ++x.e;
            }

            break;
          } else {
            xd[xdi] += k;
            if (xd[xdi] != BASE) break;
            xd[xdi--] = 0;
            k = 1;
          }
        }
      }

      // Remove trailing zeros.
      for (i = xd.length; xd[--i] === 0;) xd.pop();

      if (external && (x.e > MAX_E || x.e < -MAX_E)) {
        throw Error(exponentOutOfRange + getBase10Exponent(x));
      }

      return x;
    }


    function subtract(x, y) {
      var d, e, i, j, k, len, xd, xe, xLTy, yd,
        Ctor = x.constructor,
        pr = Ctor.precision;

      // Return y negated if x is zero.
      // Return x if y is zero and x is non-zero.
      if (!x.s || !y.s) {
        if (y.s) y.s = -y.s;
        else y = new Ctor(x);
        return external ? round(y, pr) : y;
      }

      xd = x.d;
      yd = y.d;

      // x and y are non-zero numbers with the same sign.

      e = y.e;
      xe = x.e;
      xd = xd.slice();
      k = xe - e;

      // If exponents differ...
      if (k) {
        xLTy = k < 0;

        if (xLTy) {
          d = xd;
          k = -k;
          len = yd.length;
        } else {
          d = yd;
          e = xe;
          len = xd.length;
        }

        // Numbers with massively different exponents would result in a very high number of zeros
        // needing to be prepended, but this can be avoided while still ensuring correct rounding by
        // limiting the number of zeros to `Math.ceil(pr / LOG_BASE) + 2`.
        i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;

        if (k > i) {
          k = i;
          d.length = 1;
        }

        // Prepend zeros to equalise exponents.
        d.reverse();
        for (i = k; i--;) d.push(0);
        d.reverse();

      // Base 1e7 exponents equal.
      } else {

        // Check digits to determine which is the bigger number.

        i = xd.length;
        len = yd.length;
        xLTy = i < len;
        if (xLTy) len = i;

        for (i = 0; i < len; i++) {
          if (xd[i] != yd[i]) {
            xLTy = xd[i] < yd[i];
            break;
          }
        }

        k = 0;
      }

      if (xLTy) {
        d = xd;
        xd = yd;
        yd = d;
        y.s = -y.s;
      }

      len = xd.length;

      // Append zeros to xd if shorter.
      // Don't add zeros to yd if shorter as subtraction only needs to start at yd length.
      for (i = yd.length - len; i > 0; --i) xd[len++] = 0;

      // Subtract yd from xd.
      for (i = yd.length; i > k;) {
        if (xd[--i] < yd[i]) {
          for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;
          --xd[j];
          xd[i] += BASE;
        }

        xd[i] -= yd[i];
      }

      // Remove trailing zeros.
      for (; xd[--len] === 0;) xd.pop();

      // Remove leading zeros and adjust exponent accordingly.
      for (; xd[0] === 0; xd.shift()) --e;

      // Zero?
      if (!xd[0]) return new Ctor(0);

      y.d = xd;
      y.e = e;

      //return external && xd.length >= pr / LOG_BASE ? round(y, pr) : y;
      return external ? round(y, pr) : y;
    }


    function toString(x, isExp, sd) {
      var k,
        e = getBase10Exponent(x),
        str = digitsToString(x.d),
        len = str.length;

      if (isExp) {
        if (sd && (k = sd - len) > 0) {
          str = str.charAt(0) + '.' + str.slice(1) + getZeroString(k);
        } else if (len > 1) {
          str = str.charAt(0) + '.' + str.slice(1);
        }

        str = str + (e < 0 ? 'e' : 'e+') + e;
      } else if (e < 0) {
        str = '0.' + getZeroString(-e - 1) + str;
        if (sd && (k = sd - len) > 0) str += getZeroString(k);
      } else if (e >= len) {
        str += getZeroString(e + 1 - len);
        if (sd && (k = sd - e - 1) > 0) str = str + '.' + getZeroString(k);
      } else {
        if ((k = e + 1) < len) str = str.slice(0, k) + '.' + str.slice(k);
        if (sd && (k = sd - len) > 0) {
          if (e + 1 === len) str += '.';
          str += getZeroString(k);
        }
      }

      return x.s < 0 ? '-' + str : str;
    }


    // Does not strip trailing zeros.
    function truncate(arr, len) {
      if (arr.length > len) {
        arr.length = len;
        return true;
      }
    }


    // Decimal methods


    /*
     *  clone
     *  config/set
     */


    /*
     * Create and return a Decimal constructor with the same configuration properties as this Decimal
     * constructor.
     *
     */
    function clone(obj) {
      var i, p, ps;

      /*
       * The Decimal constructor and exported function.
       * Return a new Decimal instance.
       *
       * value {number|string|Decimal} A numeric value.
       *
       */
      function Decimal(value) {
        var x = this;

        // Decimal called without new.
        if (!(x instanceof Decimal)) return new Decimal(value);

        // Retain a reference to this Decimal constructor, and shadow Decimal.prototype.constructor
        // which points to Object.
        x.constructor = Decimal;

        // Duplicate.
        if (value instanceof Decimal) {
          x.s = value.s;
          x.e = value.e;
          x.d = (value = value.d) ? value.slice() : value;
          return;
        }

        if (typeof value === 'number') {

          // Reject Infinity/NaN.
          if (value * 0 !== 0) {
            throw Error(invalidArgument + value);
          }

          if (value > 0) {
            x.s = 1;
          } else if (value < 0) {
            value = -value;
            x.s = -1;
          } else {
            x.s = 0;
            x.e = 0;
            x.d = [0];
            return;
          }

          // Fast path for small integers.
          if (value === ~~value && value < 1e7) {
            x.e = 0;
            x.d = [value];
            return;
          }

          return parseDecimal(x, value.toString());
        } else if (typeof value !== 'string') {
          throw Error(invalidArgument + value);
        }

        // Minus sign?
        if (value.charCodeAt(0) === 45) {
          value = value.slice(1);
          x.s = -1;
        } else {
          x.s = 1;
        }

        if (isDecimal.test(value)) parseDecimal(x, value);
        else throw Error(invalidArgument + value);
      }

      Decimal.prototype = P;

      Decimal.ROUND_UP = 0;
      Decimal.ROUND_DOWN = 1;
      Decimal.ROUND_CEIL = 2;
      Decimal.ROUND_FLOOR = 3;
      Decimal.ROUND_HALF_UP = 4;
      Decimal.ROUND_HALF_DOWN = 5;
      Decimal.ROUND_HALF_EVEN = 6;
      Decimal.ROUND_HALF_CEIL = 7;
      Decimal.ROUND_HALF_FLOOR = 8;

      Decimal.clone = clone;
      Decimal.config = Decimal.set = config;

      if (obj === void 0) obj = {};
      if (obj) {
        ps = ['precision', 'rounding', 'toExpNeg', 'toExpPos', 'LN10'];
        for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
      }

      Decimal.config(obj);

      return Decimal;
    }


    /*
     * Configure global settings for a Decimal constructor.
     *
     * `obj` is an object with one or more of the following properties,
     *
     *   precision  {number}
     *   rounding   {number}
     *   toExpNeg   {number}
     *   toExpPos   {number}
     *
     * E.g. Decimal.config({ precision: 20, rounding: 4 })
     *
     */
    function config(obj) {
      if (!obj || typeof obj !== 'object') {
        throw Error(decimalError + 'Object expected');
      }
      var i, p, v,
        ps = [
          'precision', 1, MAX_DIGITS,
          'rounding', 0, 8,
          'toExpNeg', -1 / 0, 0,
          'toExpPos', 0, 1 / 0
        ];

      for (i = 0; i < ps.length; i += 3) {
        if ((v = obj[p = ps[i]]) !== void 0) {
          if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
          else throw Error(invalidArgument + p + ': ' + v);
        }
      }

      if ((v = obj[p = 'LN10']) !== void 0) {
          if (v == Math.LN10) this[p] = new this(v);
          else throw Error(invalidArgument + p + ': ' + v);
      }

      return this;
    }


    // Create and configure initial Decimal constructor.
    var Decimal = clone(defaults);

    // Internal constant.
    ONE = new Decimal(1);

    var Decimal$1 = Decimal;

    var CurrencyCodes;
    (function (CurrencyCodes) {
        CurrencyCodes["AED"] = "aed";
        CurrencyCodes["AFN"] = "afn";
        CurrencyCodes["ALL"] = "all";
        CurrencyCodes["AMD"] = "amd";
        CurrencyCodes["ANG"] = "ang";
        CurrencyCodes["AOA"] = "aoa";
        CurrencyCodes["ARS"] = "ars";
        CurrencyCodes["AUD"] = "aud";
        CurrencyCodes["AWG"] = "awg";
        CurrencyCodes["AZN"] = "azn";
        CurrencyCodes["BAM"] = "bam";
        CurrencyCodes["BBD"] = "bbd";
        CurrencyCodes["BDT"] = "bdt";
        CurrencyCodes["BGN"] = "bgn";
        CurrencyCodes["BHD"] = "bhd";
        CurrencyCodes["BIF"] = "bif";
        CurrencyCodes["BMD"] = "bmd";
        CurrencyCodes["BND"] = "bnd";
        CurrencyCodes["BOB"] = "bob";
        CurrencyCodes["BOV"] = "bov";
        CurrencyCodes["BRL"] = "brl";
        CurrencyCodes["BSD"] = "bsd";
        CurrencyCodes["BTN"] = "btn";
        CurrencyCodes["BWP"] = "bwp";
        CurrencyCodes["BYN"] = "byn";
        CurrencyCodes["BYR"] = "byr";
        CurrencyCodes["BZD"] = "bzd";
        CurrencyCodes["CAD"] = "cad";
        CurrencyCodes["CDF"] = "cdf";
        CurrencyCodes["CHE"] = "che";
        CurrencyCodes["CHF"] = "chf";
        CurrencyCodes["CHW"] = "chw";
        CurrencyCodes["CLF"] = "clf";
        CurrencyCodes["CLP"] = "clp";
        CurrencyCodes["CNY"] = "cny";
        CurrencyCodes["COP"] = "cop";
        CurrencyCodes["COU"] = "cou";
        CurrencyCodes["CRC"] = "crc";
        CurrencyCodes["CUC"] = "cuc";
        CurrencyCodes["CUP"] = "cup";
        CurrencyCodes["CVE"] = "cve";
        CurrencyCodes["CZK"] = "czk";
        CurrencyCodes["DJF"] = "djf";
        CurrencyCodes["DKK"] = "dkk";
        CurrencyCodes["DOP"] = "dop";
        CurrencyCodes["DZD"] = "dzd";
        CurrencyCodes["EGP"] = "egp";
        CurrencyCodes["ERN"] = "ern";
        CurrencyCodes["ETB"] = "etb";
        CurrencyCodes["EUR"] = "eur";
        CurrencyCodes["FJD"] = "fjd";
        CurrencyCodes["FKP"] = "fkp";
        CurrencyCodes["GBP"] = "gbp";
        CurrencyCodes["GEL"] = "gel";
        CurrencyCodes["GHS"] = "ghs";
        CurrencyCodes["GIP"] = "gip";
        CurrencyCodes["GMD"] = "gmd";
        CurrencyCodes["GNF"] = "gnf";
        CurrencyCodes["GTQ"] = "gtq";
        CurrencyCodes["GYD"] = "gyd";
        CurrencyCodes["HKD"] = "hkd";
        CurrencyCodes["HNL"] = "hnl";
        CurrencyCodes["HRK"] = "hrk";
        CurrencyCodes["HTG"] = "htg";
        CurrencyCodes["HUF"] = "huf";
        CurrencyCodes["IDR"] = "idr";
        CurrencyCodes["ILS"] = "ils";
        CurrencyCodes["INR"] = "inr";
        CurrencyCodes["IQD"] = "iqd";
        CurrencyCodes["IRR"] = "irr";
        CurrencyCodes["ISK"] = "isk";
        CurrencyCodes["JMD"] = "jmd";
        CurrencyCodes["JOD"] = "jod";
        CurrencyCodes["JPY"] = "jpy";
        CurrencyCodes["KES"] = "kes";
        CurrencyCodes["KGS"] = "kgs";
        CurrencyCodes["KHR"] = "khr";
        CurrencyCodes["KMF"] = "kmf";
        CurrencyCodes["KPW"] = "kpw";
        CurrencyCodes["KRW"] = "krw";
        CurrencyCodes["KWD"] = "kwd";
        CurrencyCodes["KYD"] = "kyd";
        CurrencyCodes["KZT"] = "kzt";
        CurrencyCodes["LAK"] = "lak";
        CurrencyCodes["LBP"] = "lbp";
        CurrencyCodes["LKR"] = "lkr";
        CurrencyCodes["LRD"] = "lrd";
        CurrencyCodes["LSL"] = "lsl";
        CurrencyCodes["LTL"] = "ltl";
        CurrencyCodes["LVL"] = "lvl";
        CurrencyCodes["LYD"] = "lyd";
        CurrencyCodes["MAD"] = "mad";
        CurrencyCodes["MDL"] = "mdl";
        CurrencyCodes["MGA"] = "mga";
        CurrencyCodes["MKD"] = "mkd";
        CurrencyCodes["MMK"] = "mmk";
        CurrencyCodes["MNT"] = "mnt";
        CurrencyCodes["MOP"] = "mop";
        CurrencyCodes["MRO"] = "mro";
        CurrencyCodes["MUR"] = "mur";
        CurrencyCodes["MVR"] = "mvr";
        CurrencyCodes["MWK"] = "mwk";
        CurrencyCodes["MXN"] = "mxn";
        CurrencyCodes["MXV"] = "mxv";
        CurrencyCodes["MYR"] = "myr";
        CurrencyCodes["MZN"] = "mzn";
        CurrencyCodes["NAD"] = "nad";
        CurrencyCodes["NGN"] = "ngn";
        CurrencyCodes["NIO"] = "nio";
        CurrencyCodes["NOK"] = "nok";
        CurrencyCodes["NPR"] = "npr";
        CurrencyCodes["NZD"] = "nzd";
        CurrencyCodes["OMR"] = "omr";
        CurrencyCodes["PAB"] = "pab";
        CurrencyCodes["PEN"] = "pen";
        CurrencyCodes["PGK"] = "pgk";
        CurrencyCodes["PHP"] = "php";
        CurrencyCodes["PKR"] = "pkr";
        CurrencyCodes["PLN"] = "pln";
        CurrencyCodes["PYG"] = "pyg";
        CurrencyCodes["QAR"] = "qar";
        CurrencyCodes["RON"] = "ron";
        CurrencyCodes["RSD"] = "rsd";
        CurrencyCodes["RUB"] = "rub";
        CurrencyCodes["RWF"] = "rwf";
        CurrencyCodes["SAR"] = "sar";
        CurrencyCodes["SBD"] = "sbd";
        CurrencyCodes["SCR"] = "scr";
        CurrencyCodes["SDG"] = "sdg";
        CurrencyCodes["SEK"] = "sek";
        CurrencyCodes["SGD"] = "sgd";
        CurrencyCodes["SHP"] = "shp";
        CurrencyCodes["SLL"] = "sll";
        CurrencyCodes["SOS"] = "sos";
        CurrencyCodes["SRD"] = "srd";
        CurrencyCodes["SSP"] = "ssp";
        CurrencyCodes["STD"] = "std";
        CurrencyCodes["SVC"] = "svc";
        CurrencyCodes["SYP"] = "syp";
        CurrencyCodes["SZL"] = "szl";
        CurrencyCodes["THB"] = "thb";
        CurrencyCodes["TJS"] = "tjs";
        CurrencyCodes["TMT"] = "tmt";
        CurrencyCodes["TND"] = "tnd";
        CurrencyCodes["TOP"] = "top";
        CurrencyCodes["TRY"] = "try";
        CurrencyCodes["TTD"] = "ttd";
        CurrencyCodes["TWD"] = "twd";
        CurrencyCodes["TZS"] = "tzs";
        CurrencyCodes["UAH"] = "uah";
        CurrencyCodes["UGX"] = "ugx";
        CurrencyCodes["USD"] = "usd";
        CurrencyCodes["USN"] = "usn";
        CurrencyCodes["USS"] = "uss";
        CurrencyCodes["UYI"] = "uyi";
        CurrencyCodes["UYU"] = "uyu";
        CurrencyCodes["UZS"] = "uzs";
        CurrencyCodes["VEF"] = "vef";
        CurrencyCodes["VND"] = "vnd";
        CurrencyCodes["VUV"] = "vuv";
        CurrencyCodes["WST"] = "wst";
        CurrencyCodes["XAF"] = "xaf";
        CurrencyCodes["XAG"] = "xag";
        CurrencyCodes["XAU"] = "xau";
        CurrencyCodes["XBA"] = "xba";
        CurrencyCodes["XBB"] = "xbb";
        CurrencyCodes["XBC"] = "xbc";
        CurrencyCodes["XBD"] = "xbd";
        CurrencyCodes["XCD"] = "xcd";
        CurrencyCodes["XDR"] = "xdr";
        CurrencyCodes["XFU"] = "xfu";
        CurrencyCodes["XOF"] = "xof";
        CurrencyCodes["XPD"] = "xpd";
        CurrencyCodes["XPF"] = "xpf";
        CurrencyCodes["XPT"] = "xpt";
        CurrencyCodes["XSU"] = "xsu";
        CurrencyCodes["XTS"] = "xts";
        CurrencyCodes["XUA"] = "xua";
        CurrencyCodes["YER"] = "yer";
        CurrencyCodes["ZAR"] = "zar";
        CurrencyCodes["ZMW"] = "zmw";
        CurrencyCodes["ZWL"] = "zwl";
    })(CurrencyCodes || (CurrencyCodes = {}));
    const CurrencyExponents = {
        [CurrencyCodes.AED]: 2,
        [CurrencyCodes.AFN]: 2,
        [CurrencyCodes.ALL]: 2,
        [CurrencyCodes.AMD]: 2,
        [CurrencyCodes.ANG]: 2,
        [CurrencyCodes.AOA]: 2,
        [CurrencyCodes.ARS]: 2,
        [CurrencyCodes.AUD]: 2,
        [CurrencyCodes.AWG]: 2,
        [CurrencyCodes.AZN]: 2,
        [CurrencyCodes.BAM]: 2,
        [CurrencyCodes.BBD]: 2,
        [CurrencyCodes.BDT]: 2,
        [CurrencyCodes.BGN]: 2,
        [CurrencyCodes.BHD]: 3,
        [CurrencyCodes.BIF]: 0,
        [CurrencyCodes.BMD]: 2,
        [CurrencyCodes.BND]: 2,
        [CurrencyCodes.BOB]: 2,
        [CurrencyCodes.BOV]: 2,
        [CurrencyCodes.BRL]: 2,
        [CurrencyCodes.BSD]: 2,
        [CurrencyCodes.BTN]: 2,
        [CurrencyCodes.BWP]: 2,
        [CurrencyCodes.BYR]: 0,
        [CurrencyCodes.BYN]: 2,
        [CurrencyCodes.BZD]: 2,
        [CurrencyCodes.CAD]: 2,
        [CurrencyCodes.CDF]: 2,
        [CurrencyCodes.CHE]: 2,
        [CurrencyCodes.CHF]: 2,
        [CurrencyCodes.CHW]: 2,
        [CurrencyCodes.CLF]: 0,
        [CurrencyCodes.CLP]: 0,
        [CurrencyCodes.CNY]: 2,
        [CurrencyCodes.COP]: 2,
        [CurrencyCodes.COU]: 2,
        [CurrencyCodes.CRC]: 2,
        [CurrencyCodes.CUC]: 2,
        [CurrencyCodes.CUP]: 2,
        [CurrencyCodes.CVE]: 2,
        [CurrencyCodes.CZK]: 2,
        [CurrencyCodes.DJF]: 0,
        [CurrencyCodes.DKK]: 2,
        [CurrencyCodes.DOP]: 2,
        [CurrencyCodes.DZD]: 2,
        [CurrencyCodes.EGP]: 2,
        [CurrencyCodes.ERN]: 2,
        [CurrencyCodes.ETB]: 2,
        [CurrencyCodes.EUR]: 2,
        [CurrencyCodes.FJD]: 2,
        [CurrencyCodes.FKP]: 2,
        [CurrencyCodes.GBP]: 2,
        [CurrencyCodes.GEL]: 2,
        [CurrencyCodes.GHS]: 2,
        [CurrencyCodes.GIP]: 2,
        [CurrencyCodes.GMD]: 2,
        [CurrencyCodes.GNF]: 0,
        [CurrencyCodes.GTQ]: 2,
        [CurrencyCodes.GYD]: 2,
        [CurrencyCodes.HKD]: 2,
        [CurrencyCodes.HNL]: 2,
        [CurrencyCodes.HRK]: 2,
        [CurrencyCodes.HTG]: 2,
        [CurrencyCodes.HUF]: 2,
        [CurrencyCodes.IDR]: 2,
        [CurrencyCodes.ILS]: 2,
        [CurrencyCodes.INR]: 2,
        [CurrencyCodes.IQD]: 3,
        [CurrencyCodes.IRR]: 2,
        [CurrencyCodes.ISK]: 0,
        [CurrencyCodes.JMD]: 2,
        [CurrencyCodes.JOD]: 3,
        [CurrencyCodes.JPY]: 0,
        [CurrencyCodes.KES]: 2,
        [CurrencyCodes.KGS]: 2,
        [CurrencyCodes.KHR]: 2,
        [CurrencyCodes.KMF]: 0,
        [CurrencyCodes.KPW]: 2,
        [CurrencyCodes.KRW]: 0,
        [CurrencyCodes.KWD]: 3,
        [CurrencyCodes.KYD]: 2,
        [CurrencyCodes.KZT]: 2,
        [CurrencyCodes.LAK]: 2,
        [CurrencyCodes.LBP]: 2,
        [CurrencyCodes.LKR]: 2,
        [CurrencyCodes.LRD]: 2,
        [CurrencyCodes.LSL]: 2,
        [CurrencyCodes.LTL]: 2,
        [CurrencyCodes.LVL]: 2,
        [CurrencyCodes.LYD]: 3,
        [CurrencyCodes.MAD]: 2,
        [CurrencyCodes.MDL]: 2,
        [CurrencyCodes.MGA]: 2,
        [CurrencyCodes.MKD]: 2,
        [CurrencyCodes.MMK]: 2,
        [CurrencyCodes.MNT]: 2,
        [CurrencyCodes.MOP]: 2,
        [CurrencyCodes.MRO]: 2,
        [CurrencyCodes.MUR]: 2,
        [CurrencyCodes.MVR]: 2,
        [CurrencyCodes.MWK]: 2,
        [CurrencyCodes.MXN]: 2,
        [CurrencyCodes.MXV]: 2,
        [CurrencyCodes.MYR]: 2,
        [CurrencyCodes.MZN]: 2,
        [CurrencyCodes.NAD]: 2,
        [CurrencyCodes.NGN]: 2,
        [CurrencyCodes.NIO]: 2,
        [CurrencyCodes.NOK]: 2,
        [CurrencyCodes.NPR]: 2,
        [CurrencyCodes.NZD]: 2,
        [CurrencyCodes.OMR]: 3,
        [CurrencyCodes.PAB]: 2,
        [CurrencyCodes.PEN]: 2,
        [CurrencyCodes.PGK]: 2,
        [CurrencyCodes.PHP]: 2,
        [CurrencyCodes.PKR]: 2,
        [CurrencyCodes.PLN]: 2,
        [CurrencyCodes.PYG]: 0,
        [CurrencyCodes.QAR]: 2,
        [CurrencyCodes.RON]: 2,
        [CurrencyCodes.RSD]: 2,
        [CurrencyCodes.RUB]: 2,
        [CurrencyCodes.RWF]: 0,
        [CurrencyCodes.SAR]: 2,
        [CurrencyCodes.SBD]: 2,
        [CurrencyCodes.SCR]: 2,
        [CurrencyCodes.SDG]: 2,
        [CurrencyCodes.SEK]: 2,
        [CurrencyCodes.SGD]: 2,
        [CurrencyCodes.SHP]: 2,
        [CurrencyCodes.SLL]: 2,
        [CurrencyCodes.SOS]: 2,
        [CurrencyCodes.SRD]: 2,
        [CurrencyCodes.SSP]: 2,
        [CurrencyCodes.STD]: 2,
        [CurrencyCodes.SVC]: 2,
        [CurrencyCodes.SYP]: 2,
        [CurrencyCodes.SZL]: 2,
        [CurrencyCodes.THB]: 2,
        [CurrencyCodes.TJS]: 2,
        [CurrencyCodes.TMT]: 2,
        [CurrencyCodes.TND]: 3,
        [CurrencyCodes.TOP]: 2,
        [CurrencyCodes.TRY]: 2,
        [CurrencyCodes.TTD]: 2,
        [CurrencyCodes.TWD]: 2,
        [CurrencyCodes.TZS]: 2,
        [CurrencyCodes.UAH]: 2,
        [CurrencyCodes.UGX]: 0,
        [CurrencyCodes.USD]: 2,
        [CurrencyCodes.USN]: 2,
        [CurrencyCodes.USS]: 2,
        [CurrencyCodes.UYI]: 0,
        [CurrencyCodes.UYU]: 2,
        [CurrencyCodes.UZS]: 2,
        [CurrencyCodes.VEF]: 2,
        [CurrencyCodes.VND]: 0,
        [CurrencyCodes.VUV]: 0,
        [CurrencyCodes.WST]: 2,
        [CurrencyCodes.XAF]: 0,
        [CurrencyCodes.XAG]: 0,
        [CurrencyCodes.XAU]: 0,
        [CurrencyCodes.XBA]: 0,
        [CurrencyCodes.XBB]: 0,
        [CurrencyCodes.XBC]: 0,
        [CurrencyCodes.XBD]: 0,
        [CurrencyCodes.XCD]: 2,
        [CurrencyCodes.XDR]: 0,
        [CurrencyCodes.XFU]: 0,
        [CurrencyCodes.XOF]: 0,
        [CurrencyCodes.XPD]: 0,
        [CurrencyCodes.XPF]: 0,
        [CurrencyCodes.XPT]: 0,
        [CurrencyCodes.XSU]: 0,
        [CurrencyCodes.XTS]: 0,
        [CurrencyCodes.XUA]: 0,
        [CurrencyCodes.YER]: 2,
        [CurrencyCodes.ZAR]: 2,
        [CurrencyCodes.ZMW]: 2,
        [CurrencyCodes.ZWL]: 2,
    };

    function formatPrice(price, locale = 'en-US') {
        const { amount, currency } = price;
        const formatter = Intl.NumberFormat(locale, { style: 'currency', currency });
        return formatter.format(convertToMajorCurrencyUnits(amount, currency));
    }
    function convertToMajorCurrencyUnits(minorUnitValue, currency) {
        const exponent = CurrencyExponents[currency];
        if (exponent == null) {
            console.warn(`Unexpected currency ${currency}`);
            return minorUnitValue;
        }
        const minorUnit = new Decimal$1(minorUnitValue);
        return minorUnit.dividedBy(10 ** exponent).toNumber();
    }
    var PriceUtils = {
        formatPrice,
    };

    var lodash_transform = {exports: {}};

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */
    lodash_transform.exports;

    (function (module, exports) {
        /** Used as the size to enable large array optimizations. */
        var LARGE_ARRAY_SIZE = 200;

        /** Used as the `TypeError` message for "Functions" methods. */
        var FUNC_ERROR_TEXT = 'Expected a function';

        /** Used to stand-in for `undefined` hash values. */
        var HASH_UNDEFINED = '__lodash_hash_undefined__';

        /** Used to compose bitmasks for comparison styles. */
        var UNORDERED_COMPARE_FLAG = 1,
            PARTIAL_COMPARE_FLAG = 2;

        /** Used as references for various `Number` constants. */
        var INFINITY = 1 / 0,
            MAX_SAFE_INTEGER = 9007199254740991;

        /** `Object#toString` result references. */
        var argsTag = '[object Arguments]',
            arrayTag = '[object Array]',
            boolTag = '[object Boolean]',
            dateTag = '[object Date]',
            errorTag = '[object Error]',
            funcTag = '[object Function]',
            genTag = '[object GeneratorFunction]',
            mapTag = '[object Map]',
            numberTag = '[object Number]',
            objectTag = '[object Object]',
            promiseTag = '[object Promise]',
            regexpTag = '[object RegExp]',
            setTag = '[object Set]',
            stringTag = '[object String]',
            symbolTag = '[object Symbol]',
            weakMapTag = '[object WeakMap]';

        var arrayBufferTag = '[object ArrayBuffer]',
            dataViewTag = '[object DataView]',
            float32Tag = '[object Float32Array]',
            float64Tag = '[object Float64Array]',
            int8Tag = '[object Int8Array]',
            int16Tag = '[object Int16Array]',
            int32Tag = '[object Int32Array]',
            uint8Tag = '[object Uint8Array]',
            uint8ClampedTag = '[object Uint8ClampedArray]',
            uint16Tag = '[object Uint16Array]',
            uint32Tag = '[object Uint32Array]';

        /** Used to match property names within property paths. */
        var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
            reIsPlainProp = /^\w*$/,
            reLeadingDot = /^\./,
            rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

        /**
         * Used to match `RegExp`
         * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
         */
        var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

        /** Used to match backslashes in property paths. */
        var reEscapeChar = /\\(\\)?/g;

        /** Used to detect host constructors (Safari). */
        var reIsHostCtor = /^\[object .+?Constructor\]$/;

        /** Used to detect unsigned integer values. */
        var reIsUint = /^(?:0|[1-9]\d*)$/;

        /** Used to identify `toStringTag` values of typed arrays. */
        var typedArrayTags = {};
        typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
        typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
        typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
        typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
        typedArrayTags[uint32Tag] = true;
        typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
        typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
        typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
        typedArrayTags[errorTag] = typedArrayTags[funcTag] =
        typedArrayTags[mapTag] = typedArrayTags[numberTag] =
        typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
        typedArrayTags[setTag] = typedArrayTags[stringTag] =
        typedArrayTags[weakMapTag] = false;

        /** Detect free variable `global` from Node.js. */
        var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

        /** Detect free variable `self`. */
        var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

        /** Used as a reference to the global object. */
        var root = freeGlobal || freeSelf || Function('return this')();

        /** Detect free variable `exports`. */
        var freeExports = exports && !exports.nodeType && exports;

        /** Detect free variable `module`. */
        var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

        /** Detect the popular CommonJS extension `module.exports`. */
        var moduleExports = freeModule && freeModule.exports === freeExports;

        /** Detect free variable `process` from Node.js. */
        var freeProcess = moduleExports && freeGlobal.process;

        /** Used to access faster Node.js helpers. */
        var nodeUtil = (function() {
          try {
            return freeProcess && freeProcess.binding('util');
          } catch (e) {}
        }());

        /* Node.js helper references. */
        var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

        /**
         * A specialized version of `_.forEach` for arrays without support for
         * iteratee shorthands.
         *
         * @private
         * @param {Array} [array] The array to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Array} Returns `array`.
         */
        function arrayEach(array, iteratee) {
          var index = -1,
              length = array ? array.length : 0;

          while (++index < length) {
            if (iteratee(array[index], index, array) === false) {
              break;
            }
          }
          return array;
        }

        /**
         * A specialized version of `_.some` for arrays without support for iteratee
         * shorthands.
         *
         * @private
         * @param {Array} [array] The array to iterate over.
         * @param {Function} predicate The function invoked per iteration.
         * @returns {boolean} Returns `true` if any element passes the predicate check,
         *  else `false`.
         */
        function arraySome(array, predicate) {
          var index = -1,
              length = array ? array.length : 0;

          while (++index < length) {
            if (predicate(array[index], index, array)) {
              return true;
            }
          }
          return false;
        }

        /**
         * The base implementation of `_.property` without support for deep paths.
         *
         * @private
         * @param {string} key The key of the property to get.
         * @returns {Function} Returns the new accessor function.
         */
        function baseProperty(key) {
          return function(object) {
            return object == null ? undefined : object[key];
          };
        }

        /**
         * The base implementation of `_.times` without support for iteratee shorthands
         * or max array length checks.
         *
         * @private
         * @param {number} n The number of times to invoke `iteratee`.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Array} Returns the array of results.
         */
        function baseTimes(n, iteratee) {
          var index = -1,
              result = Array(n);

          while (++index < n) {
            result[index] = iteratee(index);
          }
          return result;
        }

        /**
         * The base implementation of `_.unary` without support for storing metadata.
         *
         * @private
         * @param {Function} func The function to cap arguments for.
         * @returns {Function} Returns the new capped function.
         */
        function baseUnary(func) {
          return function(value) {
            return func(value);
          };
        }

        /**
         * Gets the value at `key` of `object`.
         *
         * @private
         * @param {Object} [object] The object to query.
         * @param {string} key The key of the property to get.
         * @returns {*} Returns the property value.
         */
        function getValue(object, key) {
          return object == null ? undefined : object[key];
        }

        /**
         * Checks if `value` is a host object in IE < 9.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
         */
        function isHostObject(value) {
          // Many host objects are `Object` objects that can coerce to strings
          // despite having improperly defined `toString` methods.
          var result = false;
          if (value != null && typeof value.toString != 'function') {
            try {
              result = !!(value + '');
            } catch (e) {}
          }
          return result;
        }

        /**
         * Converts `map` to its key-value pairs.
         *
         * @private
         * @param {Object} map The map to convert.
         * @returns {Array} Returns the key-value pairs.
         */
        function mapToArray(map) {
          var index = -1,
              result = Array(map.size);

          map.forEach(function(value, key) {
            result[++index] = [key, value];
          });
          return result;
        }

        /**
         * Creates a unary function that invokes `func` with its argument transformed.
         *
         * @private
         * @param {Function} func The function to wrap.
         * @param {Function} transform The argument transform.
         * @returns {Function} Returns the new function.
         */
        function overArg(func, transform) {
          return function(arg) {
            return func(transform(arg));
          };
        }

        /**
         * Converts `set` to an array of its values.
         *
         * @private
         * @param {Object} set The set to convert.
         * @returns {Array} Returns the values.
         */
        function setToArray(set) {
          var index = -1,
              result = Array(set.size);

          set.forEach(function(value) {
            result[++index] = value;
          });
          return result;
        }

        /** Used for built-in method references. */
        var arrayProto = Array.prototype,
            funcProto = Function.prototype,
            objectProto = Object.prototype;

        /** Used to detect overreaching core-js shims. */
        var coreJsData = root['__core-js_shared__'];

        /** Used to detect methods masquerading as native. */
        var maskSrcKey = (function() {
          var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
          return uid ? ('Symbol(src)_1.' + uid) : '';
        }());

        /** Used to resolve the decompiled source of functions. */
        var funcToString = funcProto.toString;

        /** Used to check objects for own properties. */
        var hasOwnProperty = objectProto.hasOwnProperty;

        /**
         * Used to resolve the
         * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
         * of values.
         */
        var objectToString = objectProto.toString;

        /** Used to detect if a method is native. */
        var reIsNative = RegExp('^' +
          funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
        );

        /** Built-in value references. */
        var Symbol = root.Symbol,
            Uint8Array = root.Uint8Array,
            getPrototype = overArg(Object.getPrototypeOf, Object),
            objectCreate = Object.create,
            propertyIsEnumerable = objectProto.propertyIsEnumerable,
            splice = arrayProto.splice;

        /* Built-in method references for those with the same name as other `lodash` methods. */
        var nativeKeys = overArg(Object.keys, Object);

        /* Built-in method references that are verified to be native. */
        var DataView = getNative(root, 'DataView'),
            Map = getNative(root, 'Map'),
            Promise = getNative(root, 'Promise'),
            Set = getNative(root, 'Set'),
            WeakMap = getNative(root, 'WeakMap'),
            nativeCreate = getNative(Object, 'create');

        /** Used to detect maps, sets, and weakmaps. */
        var dataViewCtorString = toSource(DataView),
            mapCtorString = toSource(Map),
            promiseCtorString = toSource(Promise),
            setCtorString = toSource(Set),
            weakMapCtorString = toSource(WeakMap);

        /** Used to convert symbols to primitives and strings. */
        var symbolProto = Symbol ? Symbol.prototype : undefined,
            symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
            symbolToString = symbolProto ? symbolProto.toString : undefined;

        /**
         * Creates a hash object.
         *
         * @private
         * @constructor
         * @param {Array} [entries] The key-value pairs to cache.
         */
        function Hash(entries) {
          var index = -1,
              length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
         * Removes all key-value entries from the hash.
         *
         * @private
         * @name clear
         * @memberOf Hash
         */
        function hashClear() {
          this.__data__ = nativeCreate ? nativeCreate(null) : {};
        }

        /**
         * Removes `key` and its value from the hash.
         *
         * @private
         * @name delete
         * @memberOf Hash
         * @param {Object} hash The hash to modify.
         * @param {string} key The key of the value to remove.
         * @returns {boolean} Returns `true` if the entry was removed, else `false`.
         */
        function hashDelete(key) {
          return this.has(key) && delete this.__data__[key];
        }

        /**
         * Gets the hash value for `key`.
         *
         * @private
         * @name get
         * @memberOf Hash
         * @param {string} key The key of the value to get.
         * @returns {*} Returns the entry value.
         */
        function hashGet(key) {
          var data = this.__data__;
          if (nativeCreate) {
            var result = data[key];
            return result === HASH_UNDEFINED ? undefined : result;
          }
          return hasOwnProperty.call(data, key) ? data[key] : undefined;
        }

        /**
         * Checks if a hash value for `key` exists.
         *
         * @private
         * @name has
         * @memberOf Hash
         * @param {string} key The key of the entry to check.
         * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
         */
        function hashHas(key) {
          var data = this.__data__;
          return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
        }

        /**
         * Sets the hash `key` to `value`.
         *
         * @private
         * @name set
         * @memberOf Hash
         * @param {string} key The key of the value to set.
         * @param {*} value The value to set.
         * @returns {Object} Returns the hash instance.
         */
        function hashSet(key, value) {
          var data = this.__data__;
          data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
          return this;
        }

        // Add methods to `Hash`.
        Hash.prototype.clear = hashClear;
        Hash.prototype['delete'] = hashDelete;
        Hash.prototype.get = hashGet;
        Hash.prototype.has = hashHas;
        Hash.prototype.set = hashSet;

        /**
         * Creates an list cache object.
         *
         * @private
         * @constructor
         * @param {Array} [entries] The key-value pairs to cache.
         */
        function ListCache(entries) {
          var index = -1,
              length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
         * Removes all key-value entries from the list cache.
         *
         * @private
         * @name clear
         * @memberOf ListCache
         */
        function listCacheClear() {
          this.__data__ = [];
        }

        /**
         * Removes `key` and its value from the list cache.
         *
         * @private
         * @name delete
         * @memberOf ListCache
         * @param {string} key The key of the value to remove.
         * @returns {boolean} Returns `true` if the entry was removed, else `false`.
         */
        function listCacheDelete(key) {
          var data = this.__data__,
              index = assocIndexOf(data, key);

          if (index < 0) {
            return false;
          }
          var lastIndex = data.length - 1;
          if (index == lastIndex) {
            data.pop();
          } else {
            splice.call(data, index, 1);
          }
          return true;
        }

        /**
         * Gets the list cache value for `key`.
         *
         * @private
         * @name get
         * @memberOf ListCache
         * @param {string} key The key of the value to get.
         * @returns {*} Returns the entry value.
         */
        function listCacheGet(key) {
          var data = this.__data__,
              index = assocIndexOf(data, key);

          return index < 0 ? undefined : data[index][1];
        }

        /**
         * Checks if a list cache value for `key` exists.
         *
         * @private
         * @name has
         * @memberOf ListCache
         * @param {string} key The key of the entry to check.
         * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
         */
        function listCacheHas(key) {
          return assocIndexOf(this.__data__, key) > -1;
        }

        /**
         * Sets the list cache `key` to `value`.
         *
         * @private
         * @name set
         * @memberOf ListCache
         * @param {string} key The key of the value to set.
         * @param {*} value The value to set.
         * @returns {Object} Returns the list cache instance.
         */
        function listCacheSet(key, value) {
          var data = this.__data__,
              index = assocIndexOf(data, key);

          if (index < 0) {
            data.push([key, value]);
          } else {
            data[index][1] = value;
          }
          return this;
        }

        // Add methods to `ListCache`.
        ListCache.prototype.clear = listCacheClear;
        ListCache.prototype['delete'] = listCacheDelete;
        ListCache.prototype.get = listCacheGet;
        ListCache.prototype.has = listCacheHas;
        ListCache.prototype.set = listCacheSet;

        /**
         * Creates a map cache object to store key-value pairs.
         *
         * @private
         * @constructor
         * @param {Array} [entries] The key-value pairs to cache.
         */
        function MapCache(entries) {
          var index = -1,
              length = entries ? entries.length : 0;

          this.clear();
          while (++index < length) {
            var entry = entries[index];
            this.set(entry[0], entry[1]);
          }
        }

        /**
         * Removes all key-value entries from the map.
         *
         * @private
         * @name clear
         * @memberOf MapCache
         */
        function mapCacheClear() {
          this.__data__ = {
            'hash': new Hash,
            'map': new (Map || ListCache),
            'string': new Hash
          };
        }

        /**
         * Removes `key` and its value from the map.
         *
         * @private
         * @name delete
         * @memberOf MapCache
         * @param {string} key The key of the value to remove.
         * @returns {boolean} Returns `true` if the entry was removed, else `false`.
         */
        function mapCacheDelete(key) {
          return getMapData(this, key)['delete'](key);
        }

        /**
         * Gets the map value for `key`.
         *
         * @private
         * @name get
         * @memberOf MapCache
         * @param {string} key The key of the value to get.
         * @returns {*} Returns the entry value.
         */
        function mapCacheGet(key) {
          return getMapData(this, key).get(key);
        }

        /**
         * Checks if a map value for `key` exists.
         *
         * @private
         * @name has
         * @memberOf MapCache
         * @param {string} key The key of the entry to check.
         * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
         */
        function mapCacheHas(key) {
          return getMapData(this, key).has(key);
        }

        /**
         * Sets the map `key` to `value`.
         *
         * @private
         * @name set
         * @memberOf MapCache
         * @param {string} key The key of the value to set.
         * @param {*} value The value to set.
         * @returns {Object} Returns the map cache instance.
         */
        function mapCacheSet(key, value) {
          getMapData(this, key).set(key, value);
          return this;
        }

        // Add methods to `MapCache`.
        MapCache.prototype.clear = mapCacheClear;
        MapCache.prototype['delete'] = mapCacheDelete;
        MapCache.prototype.get = mapCacheGet;
        MapCache.prototype.has = mapCacheHas;
        MapCache.prototype.set = mapCacheSet;

        /**
         *
         * Creates an array cache object to store unique values.
         *
         * @private
         * @constructor
         * @param {Array} [values] The values to cache.
         */
        function SetCache(values) {
          var index = -1,
              length = values ? values.length : 0;

          this.__data__ = new MapCache;
          while (++index < length) {
            this.add(values[index]);
          }
        }

        /**
         * Adds `value` to the array cache.
         *
         * @private
         * @name add
         * @memberOf SetCache
         * @alias push
         * @param {*} value The value to cache.
         * @returns {Object} Returns the cache instance.
         */
        function setCacheAdd(value) {
          this.__data__.set(value, HASH_UNDEFINED);
          return this;
        }

        /**
         * Checks if `value` is in the array cache.
         *
         * @private
         * @name has
         * @memberOf SetCache
         * @param {*} value The value to search for.
         * @returns {number} Returns `true` if `value` is found, else `false`.
         */
        function setCacheHas(value) {
          return this.__data__.has(value);
        }

        // Add methods to `SetCache`.
        SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
        SetCache.prototype.has = setCacheHas;

        /**
         * Creates a stack cache object to store key-value pairs.
         *
         * @private
         * @constructor
         * @param {Array} [entries] The key-value pairs to cache.
         */
        function Stack(entries) {
          this.__data__ = new ListCache(entries);
        }

        /**
         * Removes all key-value entries from the stack.
         *
         * @private
         * @name clear
         * @memberOf Stack
         */
        function stackClear() {
          this.__data__ = new ListCache;
        }

        /**
         * Removes `key` and its value from the stack.
         *
         * @private
         * @name delete
         * @memberOf Stack
         * @param {string} key The key of the value to remove.
         * @returns {boolean} Returns `true` if the entry was removed, else `false`.
         */
        function stackDelete(key) {
          return this.__data__['delete'](key);
        }

        /**
         * Gets the stack value for `key`.
         *
         * @private
         * @name get
         * @memberOf Stack
         * @param {string} key The key of the value to get.
         * @returns {*} Returns the entry value.
         */
        function stackGet(key) {
          return this.__data__.get(key);
        }

        /**
         * Checks if a stack value for `key` exists.
         *
         * @private
         * @name has
         * @memberOf Stack
         * @param {string} key The key of the entry to check.
         * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
         */
        function stackHas(key) {
          return this.__data__.has(key);
        }

        /**
         * Sets the stack `key` to `value`.
         *
         * @private
         * @name set
         * @memberOf Stack
         * @param {string} key The key of the value to set.
         * @param {*} value The value to set.
         * @returns {Object} Returns the stack cache instance.
         */
        function stackSet(key, value) {
          var cache = this.__data__;
          if (cache instanceof ListCache) {
            var pairs = cache.__data__;
            if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
              pairs.push([key, value]);
              return this;
            }
            cache = this.__data__ = new MapCache(pairs);
          }
          cache.set(key, value);
          return this;
        }

        // Add methods to `Stack`.
        Stack.prototype.clear = stackClear;
        Stack.prototype['delete'] = stackDelete;
        Stack.prototype.get = stackGet;
        Stack.prototype.has = stackHas;
        Stack.prototype.set = stackSet;

        /**
         * Creates an array of the enumerable property names of the array-like `value`.
         *
         * @private
         * @param {*} value The value to query.
         * @param {boolean} inherited Specify returning inherited property names.
         * @returns {Array} Returns the array of property names.
         */
        function arrayLikeKeys(value, inherited) {
          // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
          // Safari 9 makes `arguments.length` enumerable in strict mode.
          var result = (isArray(value) || isArguments(value))
            ? baseTimes(value.length, String)
            : [];

          var length = result.length,
              skipIndexes = !!length;

          for (var key in value) {
            if ((inherited || hasOwnProperty.call(value, key)) &&
                !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
              result.push(key);
            }
          }
          return result;
        }

        /**
         * Gets the index at which the `key` is found in `array` of key-value pairs.
         *
         * @private
         * @param {Array} array The array to inspect.
         * @param {*} key The key to search for.
         * @returns {number} Returns the index of the matched value, else `-1`.
         */
        function assocIndexOf(array, key) {
          var length = array.length;
          while (length--) {
            if (eq(array[length][0], key)) {
              return length;
            }
          }
          return -1;
        }

        /**
         * The base implementation of `_.create` without support for assigning
         * properties to the created object.
         *
         * @private
         * @param {Object} prototype The object to inherit from.
         * @returns {Object} Returns the new object.
         */
        function baseCreate(proto) {
          return isObject(proto) ? objectCreate(proto) : {};
        }

        /**
         * The base implementation of `baseForOwn` which iterates over `object`
         * properties returned by `keysFunc` and invokes `iteratee` for each property.
         * Iteratee functions may exit iteration early by explicitly returning `false`.
         *
         * @private
         * @param {Object} object The object to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @param {Function} keysFunc The function to get the keys of `object`.
         * @returns {Object} Returns `object`.
         */
        var baseFor = createBaseFor();

        /**
         * The base implementation of `_.forOwn` without support for iteratee shorthands.
         *
         * @private
         * @param {Object} object The object to iterate over.
         * @param {Function} iteratee The function invoked per iteration.
         * @returns {Object} Returns `object`.
         */
        function baseForOwn(object, iteratee) {
          return object && baseFor(object, iteratee, keys);
        }

        /**
         * The base implementation of `_.get` without support for default values.
         *
         * @private
         * @param {Object} object The object to query.
         * @param {Array|string} path The path of the property to get.
         * @returns {*} Returns the resolved value.
         */
        function baseGet(object, path) {
          path = isKey(path, object) ? [path] : castPath(path);

          var index = 0,
              length = path.length;

          while (object != null && index < length) {
            object = object[toKey(path[index++])];
          }
          return (index && index == length) ? object : undefined;
        }

        /**
         * The base implementation of `getTag`.
         *
         * @private
         * @param {*} value The value to query.
         * @returns {string} Returns the `toStringTag`.
         */
        function baseGetTag(value) {
          return objectToString.call(value);
        }

        /**
         * The base implementation of `_.hasIn` without support for deep paths.
         *
         * @private
         * @param {Object} [object] The object to query.
         * @param {Array|string} key The key to check.
         * @returns {boolean} Returns `true` if `key` exists, else `false`.
         */
        function baseHasIn(object, key) {
          return object != null && key in Object(object);
        }

        /**
         * The base implementation of `_.isEqual` which supports partial comparisons
         * and tracks traversed objects.
         *
         * @private
         * @param {*} value The value to compare.
         * @param {*} other The other value to compare.
         * @param {Function} [customizer] The function to customize comparisons.
         * @param {boolean} [bitmask] The bitmask of comparison flags.
         *  The bitmask may be composed of the following flags:
         *     1 - Unordered comparison
         *     2 - Partial comparison
         * @param {Object} [stack] Tracks traversed `value` and `other` objects.
         * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
         */
        function baseIsEqual(value, other, customizer, bitmask, stack) {
          if (value === other) {
            return true;
          }
          if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
            return value !== value && other !== other;
          }
          return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
        }

        /**
         * A specialized version of `baseIsEqual` for arrays and objects which performs
         * deep comparisons and tracks traversed objects enabling objects with circular
         * references to be compared.
         *
         * @private
         * @param {Object} object The object to compare.
         * @param {Object} other The other object to compare.
         * @param {Function} equalFunc The function to determine equivalents of values.
         * @param {Function} [customizer] The function to customize comparisons.
         * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
         *  for more details.
         * @param {Object} [stack] Tracks traversed `object` and `other` objects.
         * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
         */
        function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
          var objIsArr = isArray(object),
              othIsArr = isArray(other),
              objTag = arrayTag,
              othTag = arrayTag;

          if (!objIsArr) {
            objTag = getTag(object);
            objTag = objTag == argsTag ? objectTag : objTag;
          }
          if (!othIsArr) {
            othTag = getTag(other);
            othTag = othTag == argsTag ? objectTag : othTag;
          }
          var objIsObj = objTag == objectTag && !isHostObject(object),
              othIsObj = othTag == objectTag && !isHostObject(other),
              isSameTag = objTag == othTag;

          if (isSameTag && !objIsObj) {
            stack || (stack = new Stack);
            return (objIsArr || isTypedArray(object))
              ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
              : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
          }
          if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
            var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
                othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

            if (objIsWrapped || othIsWrapped) {
              var objUnwrapped = objIsWrapped ? object.value() : object,
                  othUnwrapped = othIsWrapped ? other.value() : other;

              stack || (stack = new Stack);
              return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
            }
          }
          if (!isSameTag) {
            return false;
          }
          stack || (stack = new Stack);
          return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
        }

        /**
         * The base implementation of `_.isMatch` without support for iteratee shorthands.
         *
         * @private
         * @param {Object} object The object to inspect.
         * @param {Object} source The object of property values to match.
         * @param {Array} matchData The property names, values, and compare flags to match.
         * @param {Function} [customizer] The function to customize comparisons.
         * @returns {boolean} Returns `true` if `object` is a match, else `false`.
         */
        function baseIsMatch(object, source, matchData, customizer) {
          var index = matchData.length,
              length = index,
              noCustomizer = !customizer;

          if (object == null) {
            return !length;
          }
          object = Object(object);
          while (index--) {
            var data = matchData[index];
            if ((noCustomizer && data[2])
                  ? data[1] !== object[data[0]]
                  : !(data[0] in object)
                ) {
              return false;
            }
          }
          while (++index < length) {
            data = matchData[index];
            var key = data[0],
                objValue = object[key],
                srcValue = data[1];

            if (noCustomizer && data[2]) {
              if (objValue === undefined && !(key in object)) {
                return false;
              }
            } else {
              var stack = new Stack;
              if (customizer) {
                var result = customizer(objValue, srcValue, key, object, source, stack);
              }
              if (!(result === undefined
                    ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
                    : result
                  )) {
                return false;
              }
            }
          }
          return true;
        }

        /**
         * The base implementation of `_.isNative` without bad shim checks.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a native function,
         *  else `false`.
         */
        function baseIsNative(value) {
          if (!isObject(value) || isMasked(value)) {
            return false;
          }
          var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
          return pattern.test(toSource(value));
        }

        /**
         * The base implementation of `_.isTypedArray` without Node.js optimizations.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
         */
        function baseIsTypedArray(value) {
          return isObjectLike(value) &&
            isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
        }

        /**
         * The base implementation of `_.iteratee`.
         *
         * @private
         * @param {*} [value=_.identity] The value to convert to an iteratee.
         * @returns {Function} Returns the iteratee.
         */
        function baseIteratee(value) {
          // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
          // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
          if (typeof value == 'function') {
            return value;
          }
          if (value == null) {
            return identity;
          }
          if (typeof value == 'object') {
            return isArray(value)
              ? baseMatchesProperty(value[0], value[1])
              : baseMatches(value);
          }
          return property(value);
        }

        /**
         * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         */
        function baseKeys(object) {
          if (!isPrototype(object)) {
            return nativeKeys(object);
          }
          var result = [];
          for (var key in Object(object)) {
            if (hasOwnProperty.call(object, key) && key != 'constructor') {
              result.push(key);
            }
          }
          return result;
        }

        /**
         * The base implementation of `_.matches` which doesn't clone `source`.
         *
         * @private
         * @param {Object} source The object of property values to match.
         * @returns {Function} Returns the new spec function.
         */
        function baseMatches(source) {
          var matchData = getMatchData(source);
          if (matchData.length == 1 && matchData[0][2]) {
            return matchesStrictComparable(matchData[0][0], matchData[0][1]);
          }
          return function(object) {
            return object === source || baseIsMatch(object, source, matchData);
          };
        }

        /**
         * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
         *
         * @private
         * @param {string} path The path of the property to get.
         * @param {*} srcValue The value to match.
         * @returns {Function} Returns the new spec function.
         */
        function baseMatchesProperty(path, srcValue) {
          if (isKey(path) && isStrictComparable(srcValue)) {
            return matchesStrictComparable(toKey(path), srcValue);
          }
          return function(object) {
            var objValue = get(object, path);
            return (objValue === undefined && objValue === srcValue)
              ? hasIn(object, path)
              : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
          };
        }

        /**
         * A specialized version of `baseProperty` which supports deep paths.
         *
         * @private
         * @param {Array|string} path The path of the property to get.
         * @returns {Function} Returns the new accessor function.
         */
        function basePropertyDeep(path) {
          return function(object) {
            return baseGet(object, path);
          };
        }

        /**
         * The base implementation of `_.toString` which doesn't convert nullish
         * values to empty strings.
         *
         * @private
         * @param {*} value The value to process.
         * @returns {string} Returns the string.
         */
        function baseToString(value) {
          // Exit early for strings to avoid a performance hit in some environments.
          if (typeof value == 'string') {
            return value;
          }
          if (isSymbol(value)) {
            return symbolToString ? symbolToString.call(value) : '';
          }
          var result = (value + '');
          return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
        }

        /**
         * Casts `value` to a path array if it's not one.
         *
         * @private
         * @param {*} value The value to inspect.
         * @returns {Array} Returns the cast property path array.
         */
        function castPath(value) {
          return isArray(value) ? value : stringToPath(value);
        }

        /**
         * Creates a base function for methods like `_.forIn` and `_.forOwn`.
         *
         * @private
         * @param {boolean} [fromRight] Specify iterating from right to left.
         * @returns {Function} Returns the new base function.
         */
        function createBaseFor(fromRight) {
          return function(object, iteratee, keysFunc) {
            var index = -1,
                iterable = Object(object),
                props = keysFunc(object),
                length = props.length;

            while (length--) {
              var key = props[fromRight ? length : ++index];
              if (iteratee(iterable[key], key, iterable) === false) {
                break;
              }
            }
            return object;
          };
        }

        /**
         * A specialized version of `baseIsEqualDeep` for arrays with support for
         * partial deep comparisons.
         *
         * @private
         * @param {Array} array The array to compare.
         * @param {Array} other The other array to compare.
         * @param {Function} equalFunc The function to determine equivalents of values.
         * @param {Function} customizer The function to customize comparisons.
         * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
         *  for more details.
         * @param {Object} stack Tracks traversed `array` and `other` objects.
         * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
         */
        function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
              arrLength = array.length,
              othLength = other.length;

          if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(array);
          if (stacked && stack.get(other)) {
            return stacked == other;
          }
          var index = -1,
              result = true,
              seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

          stack.set(array, other);
          stack.set(other, array);

          // Ignore non-index properties.
          while (++index < arrLength) {
            var arrValue = array[index],
                othValue = other[index];

            if (customizer) {
              var compared = isPartial
                ? customizer(othValue, arrValue, index, other, array, stack)
                : customizer(arrValue, othValue, index, array, other, stack);
            }
            if (compared !== undefined) {
              if (compared) {
                continue;
              }
              result = false;
              break;
            }
            // Recursively compare arrays (susceptible to call stack limits).
            if (seen) {
              if (!arraySome(other, function(othValue, othIndex) {
                    if (!seen.has(othIndex) &&
                        (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
                      return seen.add(othIndex);
                    }
                  })) {
                result = false;
                break;
              }
            } else if (!(
                  arrValue === othValue ||
                    equalFunc(arrValue, othValue, customizer, bitmask, stack)
                )) {
              result = false;
              break;
            }
          }
          stack['delete'](array);
          stack['delete'](other);
          return result;
        }

        /**
         * A specialized version of `baseIsEqualDeep` for comparing objects of
         * the same `toStringTag`.
         *
         * **Note:** This function only supports comparing values with tags of
         * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
         *
         * @private
         * @param {Object} object The object to compare.
         * @param {Object} other The other object to compare.
         * @param {string} tag The `toStringTag` of the objects to compare.
         * @param {Function} equalFunc The function to determine equivalents of values.
         * @param {Function} customizer The function to customize comparisons.
         * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
         *  for more details.
         * @param {Object} stack Tracks traversed `object` and `other` objects.
         * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
         */
        function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
          switch (tag) {
            case dataViewTag:
              if ((object.byteLength != other.byteLength) ||
                  (object.byteOffset != other.byteOffset)) {
                return false;
              }
              object = object.buffer;
              other = other.buffer;

            case arrayBufferTag:
              if ((object.byteLength != other.byteLength) ||
                  !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
                return false;
              }
              return true;

            case boolTag:
            case dateTag:
            case numberTag:
              // Coerce booleans to `1` or `0` and dates to milliseconds.
              // Invalid dates are coerced to `NaN`.
              return eq(+object, +other);

            case errorTag:
              return object.name == other.name && object.message == other.message;

            case regexpTag:
            case stringTag:
              // Coerce regexes to strings and treat strings, primitives and objects,
              // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
              // for more details.
              return object == (other + '');

            case mapTag:
              var convert = mapToArray;

            case setTag:
              var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
              convert || (convert = setToArray);

              if (object.size != other.size && !isPartial) {
                return false;
              }
              // Assume cyclic values are equal.
              var stacked = stack.get(object);
              if (stacked) {
                return stacked == other;
              }
              bitmask |= UNORDERED_COMPARE_FLAG;

              // Recursively compare objects (susceptible to call stack limits).
              stack.set(object, other);
              var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
              stack['delete'](object);
              return result;

            case symbolTag:
              if (symbolValueOf) {
                return symbolValueOf.call(object) == symbolValueOf.call(other);
              }
          }
          return false;
        }

        /**
         * A specialized version of `baseIsEqualDeep` for objects with support for
         * partial deep comparisons.
         *
         * @private
         * @param {Object} object The object to compare.
         * @param {Object} other The other object to compare.
         * @param {Function} equalFunc The function to determine equivalents of values.
         * @param {Function} customizer The function to customize comparisons.
         * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
         *  for more details.
         * @param {Object} stack Tracks traversed `object` and `other` objects.
         * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
         */
        function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
          var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
              objProps = keys(object),
              objLength = objProps.length,
              othProps = keys(other),
              othLength = othProps.length;

          if (objLength != othLength && !isPartial) {
            return false;
          }
          var index = objLength;
          while (index--) {
            var key = objProps[index];
            if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
              return false;
            }
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked && stack.get(other)) {
            return stacked == other;
          }
          var result = true;
          stack.set(object, other);
          stack.set(other, object);

          var skipCtor = isPartial;
          while (++index < objLength) {
            key = objProps[index];
            var objValue = object[key],
                othValue = other[key];

            if (customizer) {
              var compared = isPartial
                ? customizer(othValue, objValue, key, other, object, stack)
                : customizer(objValue, othValue, key, object, other, stack);
            }
            // Recursively compare objects (susceptible to call stack limits).
            if (!(compared === undefined
                  ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
                  : compared
                )) {
              result = false;
              break;
            }
            skipCtor || (skipCtor = key == 'constructor');
          }
          if (result && !skipCtor) {
            var objCtor = object.constructor,
                othCtor = other.constructor;

            // Non `Object` object instances with different constructors are not equal.
            if (objCtor != othCtor &&
                ('constructor' in object && 'constructor' in other) &&
                !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
                  typeof othCtor == 'function' && othCtor instanceof othCtor)) {
              result = false;
            }
          }
          stack['delete'](object);
          stack['delete'](other);
          return result;
        }

        /**
         * Gets the data for `map`.
         *
         * @private
         * @param {Object} map The map to query.
         * @param {string} key The reference key.
         * @returns {*} Returns the map data.
         */
        function getMapData(map, key) {
          var data = map.__data__;
          return isKeyable(key)
            ? data[typeof key == 'string' ? 'string' : 'hash']
            : data.map;
        }

        /**
         * Gets the property names, values, and compare flags of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @returns {Array} Returns the match data of `object`.
         */
        function getMatchData(object) {
          var result = keys(object),
              length = result.length;

          while (length--) {
            var key = result[length],
                value = object[key];

            result[length] = [key, value, isStrictComparable(value)];
          }
          return result;
        }

        /**
         * Gets the native function at `key` of `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @param {string} key The key of the method to get.
         * @returns {*} Returns the function if it's native, else `undefined`.
         */
        function getNative(object, key) {
          var value = getValue(object, key);
          return baseIsNative(value) ? value : undefined;
        }

        /**
         * Gets the `toStringTag` of `value`.
         *
         * @private
         * @param {*} value The value to query.
         * @returns {string} Returns the `toStringTag`.
         */
        var getTag = baseGetTag;

        // Fallback for data views, maps, sets, and weak maps in IE 11,
        // for data views in Edge < 14, and promises in Node.js.
        if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
            (Map && getTag(new Map) != mapTag) ||
            (Promise && getTag(Promise.resolve()) != promiseTag) ||
            (Set && getTag(new Set) != setTag) ||
            (WeakMap && getTag(new WeakMap) != weakMapTag)) {
          getTag = function(value) {
            var result = objectToString.call(value),
                Ctor = result == objectTag ? value.constructor : undefined,
                ctorString = Ctor ? toSource(Ctor) : undefined;

            if (ctorString) {
              switch (ctorString) {
                case dataViewCtorString: return dataViewTag;
                case mapCtorString: return mapTag;
                case promiseCtorString: return promiseTag;
                case setCtorString: return setTag;
                case weakMapCtorString: return weakMapTag;
              }
            }
            return result;
          };
        }

        /**
         * Checks if `path` exists on `object`.
         *
         * @private
         * @param {Object} object The object to query.
         * @param {Array|string} path The path to check.
         * @param {Function} hasFunc The function to check properties.
         * @returns {boolean} Returns `true` if `path` exists, else `false`.
         */
        function hasPath(object, path, hasFunc) {
          path = isKey(path, object) ? [path] : castPath(path);

          var result,
              index = -1,
              length = path.length;

          while (++index < length) {
            var key = toKey(path[index]);
            if (!(result = object != null && hasFunc(object, key))) {
              break;
            }
            object = object[key];
          }
          if (result) {
            return result;
          }
          var length = object ? object.length : 0;
          return !!length && isLength(length) && isIndex(key, length) &&
            (isArray(object) || isArguments(object));
        }

        /**
         * Checks if `value` is a valid array-like index.
         *
         * @private
         * @param {*} value The value to check.
         * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
         * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
         */
        function isIndex(value, length) {
          length = length == null ? MAX_SAFE_INTEGER : length;
          return !!length &&
            (typeof value == 'number' || reIsUint.test(value)) &&
            (value > -1 && value % 1 == 0 && value < length);
        }

        /**
         * Checks if `value` is a property name and not a property path.
         *
         * @private
         * @param {*} value The value to check.
         * @param {Object} [object] The object to query keys on.
         * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
         */
        function isKey(value, object) {
          if (isArray(value)) {
            return false;
          }
          var type = typeof value;
          if (type == 'number' || type == 'symbol' || type == 'boolean' ||
              value == null || isSymbol(value)) {
            return true;
          }
          return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
            (object != null && value in Object(object));
        }

        /**
         * Checks if `value` is suitable for use as unique object key.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
         */
        function isKeyable(value) {
          var type = typeof value;
          return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
            ? (value !== '__proto__')
            : (value === null);
        }

        /**
         * Checks if `func` has its source masked.
         *
         * @private
         * @param {Function} func The function to check.
         * @returns {boolean} Returns `true` if `func` is masked, else `false`.
         */
        function isMasked(func) {
          return !!maskSrcKey && (maskSrcKey in func);
        }

        /**
         * Checks if `value` is likely a prototype object.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
         */
        function isPrototype(value) {
          var Ctor = value && value.constructor,
              proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

          return value === proto;
        }

        /**
         * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` if suitable for strict
         *  equality comparisons, else `false`.
         */
        function isStrictComparable(value) {
          return value === value && !isObject(value);
        }

        /**
         * A specialized version of `matchesProperty` for source values suitable
         * for strict equality comparisons, i.e. `===`.
         *
         * @private
         * @param {string} key The key of the property to get.
         * @param {*} srcValue The value to match.
         * @returns {Function} Returns the new spec function.
         */
        function matchesStrictComparable(key, srcValue) {
          return function(object) {
            if (object == null) {
              return false;
            }
            return object[key] === srcValue &&
              (srcValue !== undefined || (key in Object(object)));
          };
        }

        /**
         * Converts `string` to a property path array.
         *
         * @private
         * @param {string} string The string to convert.
         * @returns {Array} Returns the property path array.
         */
        var stringToPath = memoize(function(string) {
          string = toString(string);

          var result = [];
          if (reLeadingDot.test(string)) {
            result.push('');
          }
          string.replace(rePropName, function(match, number, quote, string) {
            result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
          });
          return result;
        });

        /**
         * Converts `value` to a string key if it's not a string or symbol.
         *
         * @private
         * @param {*} value The value to inspect.
         * @returns {string|symbol} Returns the key.
         */
        function toKey(value) {
          if (typeof value == 'string' || isSymbol(value)) {
            return value;
          }
          var result = (value + '');
          return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
        }

        /**
         * Converts `func` to its source code.
         *
         * @private
         * @param {Function} func The function to process.
         * @returns {string} Returns the source code.
         */
        function toSource(func) {
          if (func != null) {
            try {
              return funcToString.call(func);
            } catch (e) {}
            try {
              return (func + '');
            } catch (e) {}
          }
          return '';
        }

        /**
         * Creates a function that memoizes the result of `func`. If `resolver` is
         * provided, it determines the cache key for storing the result based on the
         * arguments provided to the memoized function. By default, the first argument
         * provided to the memoized function is used as the map cache key. The `func`
         * is invoked with the `this` binding of the memoized function.
         *
         * **Note:** The cache is exposed as the `cache` property on the memoized
         * function. Its creation may be customized by replacing the `_.memoize.Cache`
         * constructor with one whose instances implement the
         * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
         * method interface of `delete`, `get`, `has`, and `set`.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Function
         * @param {Function} func The function to have its output memoized.
         * @param {Function} [resolver] The function to resolve the cache key.
         * @returns {Function} Returns the new memoized function.
         * @example
         *
         * var object = { 'a': 1, 'b': 2 };
         * var other = { 'c': 3, 'd': 4 };
         *
         * var values = _.memoize(_.values);
         * values(object);
         * // => [1, 2]
         *
         * values(other);
         * // => [3, 4]
         *
         * object.a = 2;
         * values(object);
         * // => [1, 2]
         *
         * // Modify the result cache.
         * values.cache.set(object, ['a', 'b']);
         * values(object);
         * // => ['a', 'b']
         *
         * // Replace `_.memoize.Cache`.
         * _.memoize.Cache = WeakMap;
         */
        function memoize(func, resolver) {
          if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          var memoized = function() {
            var args = arguments,
                key = resolver ? resolver.apply(this, args) : args[0],
                cache = memoized.cache;

            if (cache.has(key)) {
              return cache.get(key);
            }
            var result = func.apply(this, args);
            memoized.cache = cache.set(key, result);
            return result;
          };
          memoized.cache = new (memoize.Cache || MapCache);
          return memoized;
        }

        // Assign cache to `_.memoize`.
        memoize.Cache = MapCache;

        /**
         * Performs a
         * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
         * comparison between two values to determine if they are equivalent.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to compare.
         * @param {*} other The other value to compare.
         * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
         * @example
         *
         * var object = { 'a': 1 };
         * var other = { 'a': 1 };
         *
         * _.eq(object, object);
         * // => true
         *
         * _.eq(object, other);
         * // => false
         *
         * _.eq('a', 'a');
         * // => true
         *
         * _.eq('a', Object('a'));
         * // => false
         *
         * _.eq(NaN, NaN);
         * // => true
         */
        function eq(value, other) {
          return value === other || (value !== value && other !== other);
        }

        /**
         * Checks if `value` is likely an `arguments` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an `arguments` object,
         *  else `false`.
         * @example
         *
         * _.isArguments(function() { return arguments; }());
         * // => true
         *
         * _.isArguments([1, 2, 3]);
         * // => false
         */
        function isArguments(value) {
          // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
          return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
            (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
        }

        /**
         * Checks if `value` is classified as an `Array` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an array, else `false`.
         * @example
         *
         * _.isArray([1, 2, 3]);
         * // => true
         *
         * _.isArray(document.body.children);
         * // => false
         *
         * _.isArray('abc');
         * // => false
         *
         * _.isArray(_.noop);
         * // => false
         */
        var isArray = Array.isArray;

        /**
         * Checks if `value` is array-like. A value is considered array-like if it's
         * not a function and has a `value.length` that's an integer greater than or
         * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
         * @example
         *
         * _.isArrayLike([1, 2, 3]);
         * // => true
         *
         * _.isArrayLike(document.body.children);
         * // => true
         *
         * _.isArrayLike('abc');
         * // => true
         *
         * _.isArrayLike(_.noop);
         * // => false
         */
        function isArrayLike(value) {
          return value != null && isLength(value.length) && !isFunction(value);
        }

        /**
         * This method is like `_.isArrayLike` except that it also checks if `value`
         * is an object.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an array-like object,
         *  else `false`.
         * @example
         *
         * _.isArrayLikeObject([1, 2, 3]);
         * // => true
         *
         * _.isArrayLikeObject(document.body.children);
         * // => true
         *
         * _.isArrayLikeObject('abc');
         * // => false
         *
         * _.isArrayLikeObject(_.noop);
         * // => false
         */
        function isArrayLikeObject(value) {
          return isObjectLike(value) && isArrayLike(value);
        }

        /**
         * Checks if `value` is classified as a `Function` object.
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a function, else `false`.
         * @example
         *
         * _.isFunction(_);
         * // => true
         *
         * _.isFunction(/abc/);
         * // => false
         */
        function isFunction(value) {
          // The use of `Object#toString` avoids issues with the `typeof` operator
          // in Safari 8-9 which returns 'object' for typed array and other constructors.
          var tag = isObject(value) ? objectToString.call(value) : '';
          return tag == funcTag || tag == genTag;
        }

        /**
         * Checks if `value` is a valid array-like length.
         *
         * **Note:** This method is loosely based on
         * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
         * @example
         *
         * _.isLength(3);
         * // => true
         *
         * _.isLength(Number.MIN_VALUE);
         * // => false
         *
         * _.isLength(Infinity);
         * // => false
         *
         * _.isLength('3');
         * // => false
         */
        function isLength(value) {
          return typeof value == 'number' &&
            value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
        }

        /**
         * Checks if `value` is the
         * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
         * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
         *
         * @static
         * @memberOf _
         * @since 0.1.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an object, else `false`.
         * @example
         *
         * _.isObject({});
         * // => true
         *
         * _.isObject([1, 2, 3]);
         * // => true
         *
         * _.isObject(_.noop);
         * // => true
         *
         * _.isObject(null);
         * // => false
         */
        function isObject(value) {
          var type = typeof value;
          return !!value && (type == 'object' || type == 'function');
        }

        /**
         * Checks if `value` is object-like. A value is object-like if it's not `null`
         * and has a `typeof` result of "object".
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
         * @example
         *
         * _.isObjectLike({});
         * // => true
         *
         * _.isObjectLike([1, 2, 3]);
         * // => true
         *
         * _.isObjectLike(_.noop);
         * // => false
         *
         * _.isObjectLike(null);
         * // => false
         */
        function isObjectLike(value) {
          return !!value && typeof value == 'object';
        }

        /**
         * Checks if `value` is classified as a `Symbol` primitive or object.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
         * @example
         *
         * _.isSymbol(Symbol.iterator);
         * // => true
         *
         * _.isSymbol('abc');
         * // => false
         */
        function isSymbol(value) {
          return typeof value == 'symbol' ||
            (isObjectLike(value) && objectToString.call(value) == symbolTag);
        }

        /**
         * Checks if `value` is classified as a typed array.
         *
         * @static
         * @memberOf _
         * @since 3.0.0
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
         * @example
         *
         * _.isTypedArray(new Uint8Array);
         * // => true
         *
         * _.isTypedArray([]);
         * // => false
         */
        var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

        /**
         * Converts `value` to a string. An empty string is returned for `null`
         * and `undefined` values. The sign of `-0` is preserved.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Lang
         * @param {*} value The value to process.
         * @returns {string} Returns the string.
         * @example
         *
         * _.toString(null);
         * // => ''
         *
         * _.toString(-0);
         * // => '-0'
         *
         * _.toString([1, 2, 3]);
         * // => '1,2,3'
         */
        function toString(value) {
          return value == null ? '' : baseToString(value);
        }

        /**
         * Gets the value at `path` of `object`. If the resolved value is
         * `undefined`, the `defaultValue` is returned in its place.
         *
         * @static
         * @memberOf _
         * @since 3.7.0
         * @category Object
         * @param {Object} object The object to query.
         * @param {Array|string} path The path of the property to get.
         * @param {*} [defaultValue] The value returned for `undefined` resolved values.
         * @returns {*} Returns the resolved value.
         * @example
         *
         * var object = { 'a': [{ 'b': { 'c': 3 } }] };
         *
         * _.get(object, 'a[0].b.c');
         * // => 3
         *
         * _.get(object, ['a', '0', 'b', 'c']);
         * // => 3
         *
         * _.get(object, 'a.b.c', 'default');
         * // => 'default'
         */
        function get(object, path, defaultValue) {
          var result = object == null ? undefined : baseGet(object, path);
          return result === undefined ? defaultValue : result;
        }

        /**
         * Checks if `path` is a direct or inherited property of `object`.
         *
         * @static
         * @memberOf _
         * @since 4.0.0
         * @category Object
         * @param {Object} object The object to query.
         * @param {Array|string} path The path to check.
         * @returns {boolean} Returns `true` if `path` exists, else `false`.
         * @example
         *
         * var object = _.create({ 'a': _.create({ 'b': 2 }) });
         *
         * _.hasIn(object, 'a');
         * // => true
         *
         * _.hasIn(object, 'a.b');
         * // => true
         *
         * _.hasIn(object, ['a', 'b']);
         * // => true
         *
         * _.hasIn(object, 'b');
         * // => false
         */
        function hasIn(object, path) {
          return object != null && hasPath(object, path, baseHasIn);
        }

        /**
         * Creates an array of the own enumerable property names of `object`.
         *
         * **Note:** Non-object values are coerced to objects. See the
         * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
         * for more details.
         *
         * @static
         * @since 0.1.0
         * @memberOf _
         * @category Object
         * @param {Object} object The object to query.
         * @returns {Array} Returns the array of property names.
         * @example
         *
         * function Foo() {
         *   this.a = 1;
         *   this.b = 2;
         * }
         *
         * Foo.prototype.c = 3;
         *
         * _.keys(new Foo);
         * // => ['a', 'b'] (iteration order is not guaranteed)
         *
         * _.keys('hi');
         * // => ['0', '1']
         */
        function keys(object) {
          return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
        }

        /**
         * An alternative to `_.reduce`; this method transforms `object` to a new
         * `accumulator` object which is the result of running each of its own
         * enumerable string keyed properties thru `iteratee`, with each invocation
         * potentially mutating the `accumulator` object. If `accumulator` is not
         * provided, a new object with the same `[[Prototype]]` will be used. The
         * iteratee is invoked with four arguments: (accumulator, value, key, object).
         * Iteratee functions may exit iteration early by explicitly returning `false`.
         *
         * @static
         * @memberOf _
         * @since 1.3.0
         * @category Object
         * @param {Object} object The object to iterate over.
         * @param {Function} [iteratee=_.identity] The function invoked per iteration.
         * @param {*} [accumulator] The custom accumulator value.
         * @returns {*} Returns the accumulated value.
         * @example
         *
         * _.transform([2, 3, 4], function(result, n) {
         *   result.push(n *= n);
         *   return n % 2 == 0;
         * }, []);
         * // => [4, 9]
         *
         * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
         *   (result[value] || (result[value] = [])).push(key);
         * }, {});
         * // => { '1': ['a', 'c'], '2': ['b'] }
         */
        function transform(object, iteratee, accumulator) {
          var isArr = isArray(object) || isTypedArray(object);
          iteratee = baseIteratee(iteratee);

          if (accumulator == null) {
            if (isArr || isObject(object)) {
              var Ctor = object.constructor;
              if (isArr) {
                accumulator = isArray(object) ? new Ctor : [];
              } else {
                accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
              }
            } else {
              accumulator = {};
            }
          }
          (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
            return iteratee(accumulator, value, index, object);
          });
          return accumulator;
        }

        /**
         * This method returns the first argument it receives.
         *
         * @static
         * @since 0.1.0
         * @memberOf _
         * @category Util
         * @param {*} value Any value.
         * @returns {*} Returns `value`.
         * @example
         *
         * var object = { 'a': 1 };
         *
         * console.log(_.identity(object) === object);
         * // => true
         */
        function identity(value) {
          return value;
        }

        /**
         * Creates a function that returns the value at `path` of a given object.
         *
         * @static
         * @memberOf _
         * @since 2.4.0
         * @category Util
         * @param {Array|string} path The path of the property to get.
         * @returns {Function} Returns the new accessor function.
         * @example
         *
         * var objects = [
         *   { 'a': { 'b': 2 } },
         *   { 'a': { 'b': 1 } }
         * ];
         *
         * _.map(objects, _.property('a.b'));
         * // => [2, 1]
         *
         * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
         * // => [1, 2]
         */
        function property(path) {
          return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
        }

        module.exports = transform;
    } (lodash_transform, lodash_transform.exports));

    var lodash_transformExports = lodash_transform.exports;
    var transform = /*@__PURE__*/getDefaultExportFromCjs(lodash_transformExports);

    class DiscordSDKMock {
        constructor(clientId, guildId, channelId) {
            this.platform = exports.Platform.DESKTOP;
            this.instanceId = '123456789012345678';
            this.configuration = getDefaultSdkConfiguration();
            this.source = null;
            this.sourceOrigin = '';
            this.frameId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
            this.eventBus = new EventEmitter();
            this.clientId = clientId;
            this.commands = this._updateCommandMocks({});
            this.guildId = guildId;
            this.channelId = channelId;
        }
        _updateCommandMocks(newCommands) {
            // Wrap all the command functions with logging
            this.commands = transform(Object.assign({}, commandsMockDefault, newCommands), (mock, func, name) => {
                mock[name] = async (...args) => {
                    console.info(`DiscordSDKMock: ${String(name)}(${JSON.stringify(args)})`);
                    return await func(...args);
                };
            });
            // redundant return here to satisfy the constructor defining commands
            return this.commands;
        }
        emitReady() {
            this.emitEvent('READY', undefined);
        }
        close(...args) {
            console.info(`DiscordSDKMock: close(${JSON.stringify(args)})`);
        }
        ready() {
            return Promise.resolve();
        }
        async subscribe(event, listener, ..._subscribeArgs) {
            return await this.eventBus.on(event, listener);
        }
        async unsubscribe(event, listener, ..._unsubscribeArgs) {
            return await this.eventBus.off(event, listener);
        }
        emitEvent(event, data) {
            this.eventBus.emit(event, data);
        }
    }
    /** Default return values for all discord SDK commands */
    const commandsMockDefault = {
        authorize: () => Promise.resolve({ code: 'mock_code' }),
        authenticate: () => Promise.resolve({
            access_token: 'mock_token',
            user: {
                username: 'mock_user_username',
                discriminator: 'mock_user_discriminator',
                id: 'mock_user_id',
                avatar: null,
                public_flags: 1,
            },
            scopes: [],
            expires: new Date(2121, 1, 1).toString(),
            application: {
                description: 'mock_app_description',
                icon: 'mock_app_icon',
                id: 'mock_app_id',
                name: 'mock_app_name',
            },
        }),
        setActivity: () => Promise.resolve({
            name: 'mock_activity_name',
            type: 0,
        }),
        getChannel: () => Promise.resolve({
            id: 'mock_channel_id',
            name: 'mock_channel_name',
            type: ChannelTypesObject.GUILD_TEXT,
            voice_states: [],
            messages: [],
        }),
        getSkus: () => Promise.resolve({ skus: [] }),
        getEntitlements: () => Promise.resolve({ entitlements: [] }),
        startPurchase: () => Promise.resolve([]),
        setConfig: () => Promise.resolve({ use_interactive_pip: false }),
        userSettingsGetLocale: () => Promise.resolve({ locale: '' }),
        openExternalLink: () => Promise.resolve(null),
        encourageHardwareAcceleration: () => Promise.resolve({ enabled: true }),
        captureLog: () => Promise.resolve(null),
        setOrientationLockState: () => Promise.resolve(null),
        openInviteDialog: () => Promise.resolve(null),
        getPlatformBehaviors: () => Promise.resolve({
            iosKeyboardResizesView: true,
        }),
        getChannelPermissions: () => Promise.resolve({ permissions: bigInt(1234567890) }),
        openShareMomentDialog: () => Promise.resolve(null),
        initiateImageUpload: () => Promise.resolve({
            image_url: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0b52aa9e99b832574a53_full_logo_blurple_RGB.png',
        }),
        getInstanceConnectedParticipants: () => Promise.resolve({ participants: [] }),
    };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol */


    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * Creates a regular expression from a target string. The target string
     * may contain `{name}` tokens which will end up being translated to
     * a named group match for a series of word characters with the group named `name`
     * The substitution pattern is {a-z} because the named groups must be valid JS identifiers,
     * making items like {0} invalid.
     *
     * @returns a RegExp object
     **/
    const SUBSTITUTION_REGEX = /\{([a-z]+)\}/g;
    function regexFromTarget(target) {
        const regexString = target.replace(SUBSTITUTION_REGEX, (match, name) => `(?<${name}>[\\w-]+)`);
        return new RegExp(`${regexString}(/|$)`);
    }
    /**
     *
     * Attempts to map the actual url (i.e. google.com) to a url path, per the url
     * mappings set up in the embedded application. If the target contains `{foo}`
     * tokens, they will be replace with the values contained in the original URL,
     * via the pattern described in the prefix
     *
     * @returns  null if URL doesn't match prefix, otherwise return rewritten URL
     */
    function matchAndRewriteURL({ originalURL, prefix, prefixHost, target }) {
        // coerce url with filler https protocol so we can retrieve host and pathname from target
        const targetURL = new URL(`https://${target}`);
        // Depending on the environment, the URL constructor may turn `{` and `}` into `%7B` and `%7D`, respectively
        const targetRegEx = regexFromTarget(targetURL.host.replace(/%7B/g, '{').replace(/%7D/g, '}'));
        const match = originalURL.toString().match(targetRegEx);
        // Null match indicates that this target is not relevant
        if (match == null)
            return originalURL;
        const newURL = new URL(originalURL.toString());
        newURL.host = prefixHost;
        newURL.pathname = prefix.replace(SUBSTITUTION_REGEX, (_, matchName) => {
            var _a;
            const replaceValue = (_a = match.groups) === null || _a === void 0 ? void 0 : _a[matchName];
            if (replaceValue == null)
                throw new Error('Misconfigured route.');
            return replaceValue;
        });
        // Append the original path
        newURL.pathname += newURL.pathname === '/' ? originalURL.pathname.slice(1) : originalURL.pathname;
        // Remove the target's path from the new url path
        newURL.pathname = newURL.pathname.replace(targetURL.pathname, '');
        // Add a trailing slash if original url had it, and if it doesn't already have one or if matches filename regex
        if (originalURL.pathname.endsWith('/') && !newURL.pathname.endsWith('/')) {
            newURL.pathname += '/';
        }
        return newURL;
    }
    function absoluteURL(url, protocol = window.location.protocol, host = window.location.host) {
        // If the first arg is a complete url, it will ignore the second arg
        // This call structure lets us set relative urls to have a full url with the proper protocol and host
        return new URL(url, `${protocol}//${host}`);
    }

    function patchUrlMappings(mappings, { patchFetch = true, patchWebSocket = true, patchXhr = true, patchSrcAttributes = false } = {}) {
        // Bail out if we're not in a browser
        if (typeof window === 'undefined')
            return;
        if (patchFetch) {
            const fetchImpl = window.fetch;
            // fetch is a duplex, but this is consistent
            window.fetch = function (input, init) {
                // If fetch has Request as input, we need to resolve any stream
                // before we create a new request with the mapped url
                if (input instanceof Request) {
                    const newUrl = attemptRemap({ url: absoluteURL(input.url), mappings });
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const _a = (init !== null && init !== void 0 ? init : {}), newInit = __rest(_a, ["url"]);
                    Object.keys(Request.prototype).forEach((value) => {
                        if (value === 'url')
                            return;
                        try {
                            // @ts-expect-error
                            newInit[value] = input[value];
                        }
                        catch (ex) {
                            console.warn(`Remapping fetch request key "${value}" failed`, ex);
                        }
                    });
                    return new Promise((resolve, reject) => {
                        try {
                            input.blob().then((blob) => {
                                if (input.method.toUpperCase() !== 'HEAD' && input.method.toUpperCase() !== 'GET' && blob.size > 0) {
                                    newInit.body = blob;
                                }
                                resolve(fetchImpl(new Request(newUrl, newInit)));
                            });
                        }
                        catch (ex) {
                            reject(ex);
                        }
                    });
                }
                // Assuming a generic url or string
                const remapped = attemptRemap({ url: input instanceof URL ? input : absoluteURL(input), mappings });
                return fetchImpl(remapped, init);
            };
        }
        if (patchWebSocket) {
            class WebSocketProxy extends WebSocket {
                constructor(url, protocols) {
                    const remapped = attemptRemap({ url: url instanceof URL ? url : absoluteURL(url), mappings });
                    super(remapped, protocols);
                }
            }
            window.WebSocket = WebSocketProxy;
        }
        if (patchXhr) {
            const openImpl = XMLHttpRequest.prototype.open;
            // @ts-expect-error - the ts interface exports two 'open' methods
            XMLHttpRequest.prototype.open = function (method, url, async, username, password) {
                const remapped = attemptRemap({ url: absoluteURL(url), mappings });
                openImpl.apply(this, [method, remapped, async, username, password]);
            };
        }
        if (patchSrcAttributes) {
            const callback = function (mutationsList) {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                        attemptSetNodeSrc(mutation.target, mappings);
                    }
                    else if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => recursivelyRemapChildNodes(node, mappings));
                    }
                }
            };
            const observer = new MutationObserver(callback);
            const config = {
                attributeFilter: ['src'],
                childList: true,
                subtree: true,
            };
            observer.observe(window.document, config);
            window.document.querySelectorAll('[src]').forEach((node) => {
                attemptSetNodeSrc(node, mappings);
            });
        }
    }
    function recursivelyRemapChildNodes(node, mappings) {
        if (node.hasChildNodes()) {
            node.childNodes.forEach((child) => {
                attemptSetNodeSrc(child, mappings);
                recursivelyRemapChildNodes(child, mappings);
            });
        }
    }
    function attemptSetNodeSrc(node, mappings) {
        var _a;
        if (node instanceof HTMLElement && node.hasAttribute('src')) {
            const url = absoluteURL((_a = node.getAttribute('src')) !== null && _a !== void 0 ? _a : '');
            if (url.host === window.location.host)
                return;
            node.setAttribute('src', attemptRemap({ url, mappings }).toString());
        }
    }
    function attemptRemap({ url, mappings }) {
        for (const mapping of mappings) {
            const mapped = matchAndRewriteURL({
                originalURL: url,
                prefix: mapping.prefix,
                target: mapping.target,
                prefixHost: window.location.host,
            });
            if (mapped != null && (mapped === null || mapped === void 0 ? void 0 : mapped.toString()) !== url.toString()) {
                return mapped;
            }
        }
        return url;
    }

    const { Commands } = Common;

    exports.Commands = Commands;
    exports.Common = Common;
    exports.DiscordSDK = DiscordSDK;
    exports.DiscordSDKMock = DiscordSDKMock;
    exports.PermissionUtils = PermissionUtils;
    exports.Permissions = Permissions;
    exports.PriceUtils = PriceUtils;
    exports.Responses = responses;
    exports.attemptRemap = attemptRemap;
    exports.patchUrlMappings = patchUrlMappings;

    return exports;

})({});


////////////////////////////////////////////
// WINTERPIXEL IMPL
////////////////////////////////////////////


var discordSdk, discordEvents, discordPriceUtils;
var discordCallbacks = {
	registerCallback: function(key, obj) {
		console.log("[DiscordHTML] registerCallback: " + key);
		this[key] = obj;
	}
};
window["discordCallbacks"] = discordCallbacks;
async function initializeDiscord(oauth_client_id) {
	console.log("[DiscordHTML] initializeDiscord() " + oauth_client_id);
	try {
		console.log("[DiscordHTML] initializeDiscord()");
		// console.log(DiscordSDK);
		discordSdk = new DiscordSDK.DiscordSDK(oauth_client_id);
		discordEvents = DiscordSDK.Events;
		discordPriceUtils = DiscordSDK.PriceUtils;
		console.log("[DiscordHTML] initializeDiscord() awaiting ready()");
		// Wait for READY payload from the discord client
		await discordSdk.ready();
		
		console.log("[DiscordHTML] initializeDiscord() ready()");
		console.log (JSON.stringify(discordCallbacks));
		console.log(discordCallbacks);
		console.log(discordCallbacks.on_discordReady);
		discordCallbacks.on_discordReady(true);
	} catch(error) {
		console.error('[DiscordHTMl] initializeDiscord() error: ' + error);
		discordCallbacks.on_discordReady(); // empty is error
	}
}

async function authorizeDiscord(oauth_client_id) {
	console.log("[DiscordHTML] authorizeDiscord() " + oauth_client_id);
	try {
		// Pop open the OAuth permission modal and request for access to scopes listed in scope array below
		console.log("[DiscordHTML] authorizeDiscord() authorizing.");
		const {code} = await discordSdk.commands.authorize({
			client_id: oauth_client_id,
			response_type: 'code',
			state: '',
			prompt: 'none',
			scope: ['identify', 'guilds.members.read'],
		});
		console.log("[DiscordHTML] authorized. code " + code);
		discordCallbacks.on_discordAuthorized(code);
	} catch(error) {
		console.error('[DiscordHTMl] authorizeDiscord() error: ' + error + ' stringified error: ' + JSON.stringify(error));
		discordCallbacks.on_discordAuthorized(); // empty is error
		discordSdk.close(1000, "Unauthorized")
	}
};

async function authenticateDiscord(access_token) {
	console.log("[DiscordHTML] authenticateDiscord()");
	// Authenticate with Discord client (using the access_token)
	try {
		var user = await discordSdk.commands.authenticate({access_token});
		var userJson = JSON.stringify(user);
		console.log("[DiscordHTML] authenticated. user: " + userJson);
		discordCallbacks.on_discordAuthenticated(userJson);
		discordConnectParticipantsChanged();
		discordConnectPurchaseCallback();
		//discordLoadSkus();
	} catch (error) {
		console.error("[DiscordHTML] authenticateDiscord() error: " + error);
		discordCallbacks.on_discordAuthenticated(); // empty is error
	}
};

function discordOpenURL(url) {
	console.log("[DiscordHTML] discordOpenURL " + url);
	discordSdk.commands.openExternalLink({url:url})
};

function discordUpdateParticipants(participants) {
	console.log("[Discord] discordUpdateParticipants");
	var participantsJsonString = JSON.stringify(participants);
	console.log("[Discord] participants: " + participantsJsonString);
	discordCallbacks.on_discordParticipantsChanged(participantsJsonString);
}

async function discordGetParticipants() {
	console.log("[DiscordHTML] discordGetInstanceConnectedParticipants()");
	try {
		var participantData = await discordSdk.commands.getInstanceConnectedParticipants();
		discordUpdateParticipants(participantData);
	} catch (error) {
		console.log("[DiscordHTML] discordGetInstanceConnectedParticipants() error " + error);
	}
	return []
};

function discordConnectParticipantsChanged() {
	try {
		console.log("[DiscordHTML] discordConnectParticipantsChanged() subscribing to participants update");
		discordSdk.subscribe(discordEvents.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, discordUpdateParticipants);
		console.log("[DiscordHTML] discordConnectParticipantsChanged() subscribed to participants update");
	} catch (error) {
		console.log("[DiscordHTML] discordConnectParticipantsChanged() error processing participants: " + JSON.stringify(error));
	}
}

function discordQueryPurchases() {
	try {

	} catch (error) {
		console.log("[DiscordHTML] discordQueryPurchases() error " + error);
	}
}

function discordConnectPurchaseCallback() {
	try {
		console.log("[DiscordHTML] discordConnectPurchaseCallback()");
		discordSdk.subscribe('ENTITLEMENT_CREATE', () =>{
			console.log("[DiscordHTML] discord purchaseCallback()");
			discordCallbacks.on_purchaseCallback();
		});
	} catch (error) {
		console.log("[DiscordHTML] discordConnectPurchaseCallback() error: " + error);
	}
}

async function discordLoadSkus() {
	try {
		console.log("[DiscordHTML] discordLoadSkus()");
		const skus = await discordSdk.commands.getSkus();
		// console.log("[DiscordHTML] skus: " + skus);
		skus.skus.forEach(skuInfo => {
			// console.log("[DiscordHTML] formatting price: " + skuInfo.price);
			var formattedPrice = discordPriceUtils.formatPrice(skuInfo.price);
			// console.log("[DiscordHTML] formated to: " + formattedPrice);
			skuInfo.formatted_price = formattedPrice;
		})
		const skusJson = JSON.stringify(skus);
		// console.log("[DiscordHTML] skus jsonified: " + JSON.stringify(skus));
		discordCallbacks.on_skusLoaded(skusJson);
	} catch (error) {
		console.log("[DiscordHTML] discordLoadSkus() error: " + error);
	}
}

async function discordPurchaseSku(sku) {
	try {
		console.log("[DiscordHTML] discordPurchaseSku(" + sku + ")");
		await discordSdk.commands.startPurchase({sku_id: sku});
		console.log("[DiscordHTML] discordPurchaseSku(" + sku + ") finished");
	} catch (error) {
		console.log("[DiscordHTML] discordPurchaseSku(" + sku + ") error: " + error + " error json: " + JSON.stringify(error));
	}
}
