require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PageName;
(function (PageName) {
    var _a;
    PageName.pagesNames = [
        "login",
        "register",
        "manager",
        "webphone",
        "subscription",
        "shop",
        "webviewphone"
    ];
    _a = __read(PageName.pagesNames, 7), PageName.login = _a[0], PageName.register = _a[1], PageName.manager = _a[2], PageName.webphone = _a[3], PageName.subscription = _a[4], PageName.shop = _a[5], PageName.webviewphone = _a[6];
})(PageName = exports.PageName || (exports.PageName = {}));

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildUrl(urlPath, params) {
    return urlPath + "?" + Object.keys(params)
        .filter(function (key) { return params[key] !== undefined; })
        .map(function (key) { return key + "=" + encodeURIComponent(params[key]); })
        .join("&");
}
exports.buildUrl = buildUrl;
function parseUrl(url) {
    if (url === void 0) { url = location.href; }
    var sPageURL = url.split("?")[1];
    if (sPageURL === undefined) {
        return {};
    }
    var sURLVariables = sPageURL.split("&");
    var out = {};
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split("=");
        out[sParameterName[0]] = decodeURIComponent(sParameterName[1]);
    }
    return out;
}
exports.parseUrl = parseUrl;

},{}],3:[function(require,module,exports){
"use strict";
/* NOTE: Used in the browser. */
Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = require("crypto-lib/dist/async/serializer");
var urlSafeBase64encoderDecoder_1 = require("./urlSafeBase64encoderDecoder");
//NOTE: Transpiled to ES3.
var stringTransform = require("transfer-tools/dist/lib/stringTransform");
//NOTE: Exported for semasim-mobile
var getIndexedHeaderName = function (i) { return "Bundled-Data-" + i; };
function smuggleBundledDataInHeaders(data, encryptor, headers) {
    if (headers === void 0) { headers = {}; }
    var followUp = function (value) {
        var split = stringTransform.textSplit(125, urlSafeBase64encoderDecoder_1.urlSafeB64.enc(value));
        for (var i = 0; i < split.length; i++) {
            headers[getIndexedHeaderName(i)] = split[i];
        }
        return headers;
    };
    var prValueOrValue = serializer_1.stringifyThenEncryptFactory(encryptor)(data);
    return (typeof prValueOrValue === "string" ?
        followUp(prValueOrValue) :
        prValueOrValue.then(function (value) { return followUp(value); }));
}
exports.smuggleBundledDataInHeaders = smuggleBundledDataInHeaders;
var BundledDataSipHeaders;
(function (BundledDataSipHeaders) {
    function build(getHeaderValue) {
        var headersValues = [];
        var i = 0;
        while (true) {
            var headerName = getIndexedHeaderName(i++);
            var headerValue = getHeaderValue(headerName) ||
                getHeaderValue(headerName.toLocaleLowerCase());
            if (!headerValue) {
                break;
            }
            headersValues.push(headerValue);
        }
        return headersValues;
    }
    BundledDataSipHeaders.build = build;
})(BundledDataSipHeaders = exports.BundledDataSipHeaders || (exports.BundledDataSipHeaders = {}));
function extractBundledDataFromHeaders(headers, decryptor) {
    var split = headers instanceof Array ?
        headers :
        BundledDataSipHeaders.build(function (headerName) { return headers[headerName] || null; });
    if (!split.length) {
        throw new Error("No bundled data in header");
    }
    return serializer_1.decryptThenParseFactory(decryptor)(urlSafeBase64encoderDecoder_1.urlSafeB64.dec(split.join("")));
}
exports.extractBundledDataFromHeaders = extractBundledDataFromHeaders;

},{"./urlSafeBase64encoderDecoder":4,"crypto-lib/dist/async/serializer":7,"transfer-tools/dist/lib/stringTransform":14}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//NOTE: Transpiled to ES3.
var stringTransform = require("transfer-tools/dist/lib/stringTransform");
exports.urlSafeB64 = stringTransform.transcode("base64", {
    "=": "_",
    "/": "-"
});

},{"transfer-tools/dist/lib/stringTransform":14}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiPath = "/api";
var version;
(function (version) {
    version.methodName = "version";
})(version = exports.version || (exports.version = {}));

},{}],7:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toBuffer_1 = require("../sync/utils/toBuffer");
var ttJC = require("transfer-tools/dist/lib/JSON_CUSTOM");
function matchPromise(prOrValue) {
    return "then" in prOrValue;
}
var stringRepresentationEncoding = "base64";
function stringifyThenEncryptFactory(encryptor) {
    var stringify = ttJC.get().stringify;
    return function stringifyThenEncrypt(value) {
        var prOrValue = encryptor.encrypt(Buffer.from([
            stringify(value),
            (new Array(9 + Math.floor(Math.random() * 20)))
                .fill(" ")
                .join("")
        ].join(""), "utf8"));
        var finalize = function (value) { return toBuffer_1.toBuffer(value).toString(stringRepresentationEncoding); };
        return (matchPromise(prOrValue) ?
            prOrValue.then(function (value) { return finalize(value); }) :
            finalize(prOrValue));
    };
}
exports.stringifyThenEncryptFactory = stringifyThenEncryptFactory;
function decryptThenParseFactory(decryptor) {
    var parse = ttJC.get().parse;
    return function decryptThenParse(encryptedValue) {
        var prOrValue = decryptor.decrypt(Buffer.from(encryptedValue, stringRepresentationEncoding));
        var finalize = function (value) { return parse(toBuffer_1.toBuffer(value).toString("utf8")); };
        return matchPromise(prOrValue) ?
            prOrValue.then(function (value) { return finalize(value); }) :
            finalize(prOrValue);
    };
}
exports.decryptThenParseFactory = decryptThenParseFactory;

}).call(this,require("buffer").Buffer)
},{"../sync/utils/toBuffer":8,"buffer":25,"transfer-tools/dist/lib/JSON_CUSTOM":13}],8:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The returned object is an instance of the global Buffer class.
 * ( toBuffer(data) instanceof Buffer === true )
 */
function toBuffer(uint8Array) {
    return Buffer.from(uint8Array.buffer, uint8Array.byteOffset, uint8Array.length);
}
exports.toBuffer = toBuffer;

}).call(this,require("buffer").Buffer)
},{"buffer":25}],9:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],10:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":9}],11:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":10}],12:[function(require,module,exports){
(function (global){
"use strict";
var has = require('has');

var toString = Object.prototype.toString;
var keys = Object.keys;
var jsonParse = JSON.parse;
var jsonStringify = JSON.stringify;
var identifierFormat = '[a-zA-Z_$][0-9a-zA-Z_$]*';
var identifierPattern = new RegExp('^' + identifierFormat + '$');
var functionPattern = new RegExp(
  '^\\s*function(?:\\s+' + identifierFormat  + ')?\\s*' +
  '\\(\\s*(?:(' + identifierFormat + ')' +
  '((?:\\s*,\\s*' + identifierFormat + ')*)?)?\\s*\\)\\s*' + 
  '\\{([\\s\\S]*)\\}\\s*', 'm');
var nativeFunctionBodyPattern = /^\s\[native\scode\]\s$/;

function isArray(obj) {
  return toString.call(obj) === '[object Array]';
}

function escapeForRegExp(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function isReplaceable(obj) {
  /*jshint -W122 */
  return (typeof obj === 'object' && obj !== null) ||
    typeof obj === 'function' || typeof obj === 'symbol';
}

var dateSerializer = {
  serialize: function(date) {
    return [date.getTime()];
  },
  deserialize: function(time) {
    return new Date(time);
  },
  isInstance: function(obj) {
    return obj instanceof Date;
  },
  name: 'Date'
};

var regExpSerializer = {
  serialize: function(regExp) {
    var flags = '';
    if (regExp.global) flags += 'g';
    if (regExp.multiline) flags += 'm';
    if (regExp.ignoreCase) flags += 'i';
    return [regExp.source, flags];
  },
  deserialize: function(source, flags) {
    return new RegExp(source, flags);
  },
  isInstance: function(obj) {
    return obj instanceof RegExp;
  },
  name: 'RegExp'
};

var functionSerializer = {
  serialize: function(f) {
    var firstArg, functionBody, parts, remainingArgs;
    var args = '';

    parts = functionPattern.exec(f.toString());

    if (!parts)
      throw new Error('Functions must have a working toString method' +
                      'in order to be serialized');

    firstArg = parts[1];
    remainingArgs = parts[2];
    functionBody = parts[3];

    if (nativeFunctionBodyPattern.test(functionBody))
      throw new Error('Native functions cannot be serialized');
    
    if (firstArg)
      args += firstArg.trim();

    if (remainingArgs) {
      remainingArgs = remainingArgs.split(',').slice(1);
      for (var i = 0; i < remainingArgs.length; i += 1) {
        args += ', ' + remainingArgs[i].trim();
      }
    }

    return [args, functionBody];
  },
  deserialize: function(args, functionBody) {
    var rv = new Function(args, functionBody);
    return rv;
  },
  isInstance: function(obj) {
    return typeof obj === 'function';
  },
  name: 'Function'
};

var symbolSerializer;

if (typeof global.Symbol !== 'undefined') {
  (function(Symbol) {
   /*jshint -W122 */
    // add symbol serializer for es6. this will probably break for private
    // symbols.
    symbolSerializer = {
      serialize: function(sym) {
        var key = Symbol.keyFor(sym);
        if (typeof key === 'string') {
          // symbol registered globally
          return [key, 0, 0];
        }
        var symStr = sym.toString();
        var match = /^Symbol\(Symbol\.([^)]+)\)$/.exec(symStr);
        if (match && has(Symbol, match[1])) {
          // well known symbol, return the key in the Symbol object
          return [0, match[1], 0];
        }
        match = /^Symbol\(([^)]*)\)$/.exec(symStr);
        return [0, 0, match[1]];
      },
      deserialize: function(key, wellKnownKey, description) {
        if (key) {
          return Symbol.for(key);
        } else if (wellKnownKey) {
          return Symbol[wellKnownKey];
        }
        return Symbol(description);
      },
      isInstance: function(obj) {
        return typeof obj === 'symbol';
      },
      name: 'Symbol'
    };
  })(global.Symbol);
}

var defaultOpts = {
  magic: '#!',
  serializers: [dateSerializer, regExpSerializer, functionSerializer]
};

if (symbolSerializer)
  defaultOpts.serializers.push(symbolSerializer);

function create(options) {
  var magic = escapeForRegExp((options && options.magic) ||
                              defaultOpts.magic);
  var initialSerializers = (options && options.serializers) ||
    defaultOpts.serializers;
  var serializers = [];
  var magicEscaper = new RegExp('([' + magic + '])', 'g');
  var magicUnescaper = new RegExp('([' + magic + '])\\1', 'g');
  var superJsonStringPattern = new RegExp('^([' + magic + ']+)' +
                                    '(' + identifierFormat +
                                    '\\[.*\\])$');
  var superJsonPattern = new RegExp('^' + magic +
                                    '(' + identifierFormat + ')' +
                                    '(\\[.*\\])$');


  function installSerializer(serializer) {
    if (typeof serializer.name === 'function') {
      if (serializer.deserialize) {
        throw new Error('Serializers with a function name should not define ' +
                        'a deserialize function');
      }
    } else {
      if (!identifierPattern.test(serializer.name))
        throw new Error("Serializers must have a 'name' property " +
                        'that is a valid javascript identifier.');

      if (typeof serializer.deserialize !== 'function' &&
          typeof serializer.replace !== 'function')
        throw new Error("Serializers must have a 'deserialize' function " +
                        'that when passed the arguments generated by ' +
                        "'serialize' will return a instance that is equal " +
                        'to the one serialized');
    }

    if (typeof serializer.serialize !== 'function' &&
        typeof serializer.replace !== 'function')
      throw new Error("Serializers must have a 'serialize' function " +
                      'that will receive an instance and return an array ' +
                      'of arguments necessary to reconstruct the object ' +
                      'state.');

    if (typeof serializer.isInstance !== 'function')
      throw new Error("Serializers must have a 'isInstance' function " +
                      'that tells if an object is an instance of the ' +
                      'type represented by the serializer');

    serializers.push(serializer);
  }

  function stringify(obj, userReplacer, indent) {
    function replaceValue(value) {
      var match;

      if (typeof value === 'string' && 
          (match = superJsonStringPattern.exec(value))) {
        // Escape magic string at the start only
        return match[1].replace(magicEscaper, '$1$1') + match[2];
      } else {
        for (var i = 0; i < serializers.length; i++) {
          var serializer = serializers[i];
          if (serializer.isInstance(value)) {
            if (typeof serializer.replace === 'function') {
              return serializer.replace(value);
            }
            var name;
            if (typeof serializer.name === 'function')
              name = serializer.name(value);
            else
              name = serializer.name;
            var args = serializer.serialize(value);
            if (!isArray(args))
              throw new Error("'serialize' function must return an array " +
                              "containing arguments for 'deserialize'");
              return magic + name + jsonStringify(args);
          }
        }
      }
    }

    function replacer(key, value) {
      var rv = null;

      if (isReplaceable(value)) {
        if (isArray(value)) {
          rv = [];
          value.forEach(function(v) {
            var replacedValue = replaceValue(v);
            if (replacedValue === undefined) replacedValue = v;
            rv.push(replacedValue);
          });
        } else {
          rv = {};
          keys(value).forEach(function(k) {
            var v = value[k];
            var replacedValue = replaceValue(v);
            if (replacedValue === undefined) replacedValue = v;
            rv[k] = replacedValue;
          });
        }
      }

      if (!rv) return value;
      return rv;
    }

    var rv;

    if (typeof userReplacer === 'number') 
      indent = userReplacer;

    if (!userReplacer && isReplaceable(obj))
      rv = replaceValue(obj);

    if (rv) 
      return jsonStringify(rv, null, indent);

    return jsonStringify(obj, typeof userReplacer === 'function' ?
                         userReplacer : replacer, indent);
  }

  function parse(json, userReviver) {
    var revived = [];

    function reviveValue(value) {
      var args, match, name;

      if ((match = superJsonPattern.exec(value))) {
        name = match[1];
        try {
          args = jsonParse(match[2]);
        } catch (e) {
          // Ignore parse errors
          return;
        }
        for (var i = 0; i < serializers.length; i += 1) {
          var serializer = serializers[i];
          if (name === serializer.name)
            return serializer.deserialize.apply(serializer, args);
        }
      } else if ((match = superJsonStringPattern.exec(value))) {
        return match[1].replace(magicUnescaper, '$1') + match[2];
      }
    }

    function reviver(key, value) {
      if (typeof value === 'object' && value && revived.indexOf(value) === -1) {
        keys(value).forEach(function(k) {
          var revivedValue;
          var v = value[k];
          if (typeof v === 'string')
            revivedValue = reviveValue(v);
          if (revivedValue) revived.push(revivedValue);
          else revivedValue = v;
          value[k] = revivedValue;
        });
      }

      return value;
    }

    var rv;
    var parsed = jsonParse(json, typeof userReviver === 'function' ?
                          userReviver : reviver);

    if (typeof parsed === 'string') rv = reviveValue(parsed);
    if (!rv) rv = parsed;
    return rv;
  }

  initialSerializers.forEach(installSerializer);

  return {
    stringify: stringify,
    parse: parse,
    installSerializer: installSerializer
  };
}

exports.dateSerializer = dateSerializer;
exports.regExpSerializer = regExpSerializer;
exports.functionSerializer = functionSerializer;
if (symbolSerializer) exports.symbolSerializer = symbolSerializer;
exports.create = create;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"has":11}],13:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var superJson = require("super-json");
/** Support undefined and Date by default*/
function get(serializers) {
    if (serializers === void 0) { serializers = []; }
    var myJson = superJson.create({
        "magic": '#!',
        "serializers": __spread([
            superJson.dateSerializer
        ], serializers)
    });
    return {
        "stringify": function (obj) {
            if (obj === undefined) {
                return "undefined";
            }
            return myJson.stringify([obj]);
        },
        "parse": function (str) {
            if (str === "undefined") {
                return undefined;
            }
            return myJson.parse(str).pop();
        }
    };
}
exports.get = get;

},{"super-json":12}],14:[function(require,module,exports){
(function (Buffer){
"use strict";
exports.__esModule = true;
function safeBufferFromTo(str, fromEnc, toEnc) {
    try {
        return Buffer.from(str, fromEnc).toString(toEnc);
    }
    catch (_a) {
        return (new Buffer(str, fromEnc)).toString(toEnc);
    }
}
exports.safeBufferFromTo = safeBufferFromTo;
function transcode(encoding, alphabetMap) {
    if (alphabetMap === void 0) { alphabetMap = {}; }
    var reverseAlphabetMap = {};
    for (var char in alphabetMap) {
        reverseAlphabetMap[alphabetMap[char]] = char;
    }
    return {
        "enc": function (str) { return transcode.applyNewAlphabet(safeBufferFromTo(str, "utf8", encoding), alphabetMap); },
        "dec": function (encStr) { return safeBufferFromTo(transcode.applyNewAlphabet(encStr, reverseAlphabetMap), encoding, "utf8"); }
    };
}
exports.transcode = transcode;
(function (transcode) {
    var regExpCache = {};
    function applyNewAlphabet(str, alphabetMap) {
        for (var char in alphabetMap) {
            var regExp = regExpCache[char];
            if (!regExp) {
                regExp = new RegExp("\\" + char, "g");
                regExpCache[char] = regExp;
            }
            str = str.replace(regExp, alphabetMap[char]);
        }
        return str;
    }
    transcode.applyNewAlphabet = applyNewAlphabet;
})(transcode = exports.transcode || (exports.transcode = {}));
/**
 * partLength correspond to string length not byte
 * but in base 64 all char are ascii so partMaxLength <=> partMaxBytes
 **/
function textSplit(partMaxLength, text) {
    var parts = [];
    var rest = text;
    while (rest) {
        if (partMaxLength >= rest.length) {
            parts.push(rest);
            rest = "";
        }
        else {
            parts.push(rest.substring(0, partMaxLength));
            rest = rest.substring(partMaxLength, rest.length);
        }
    }
    return parts;
}
exports.textSplit = textSplit;

}).call(this,require("buffer").Buffer)
},{"buffer":25}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urlGetParameters_1 = require("../../frontend/shared/dist/tools/urlGetParameters");
exports.buildUrl = urlGetParameters_1.buildUrl;
var availablePages = require("../../frontend/shared/dist/lib/availablePages");
exports.availablePages = availablePages;

},{"../../frontend/shared/dist/lib/availablePages":1,"../../frontend/shared/dist/tools/urlGetParameters":2}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("../../gateway/dist/lib/types");
exports.types = types;
var bundledData_1 = require("../../gateway/dist/lib/misc/bundledData");
exports.smuggleBundledDataInHeaders = bundledData_1.smuggleBundledDataInHeaders;
exports.extractBundledDataFromHeaders = bundledData_1.extractBundledDataFromHeaders;
exports.BundledDataSipHeaders = bundledData_1.BundledDataSipHeaders;
var urlSafeBase64encoderDecoder_1 = require("../../gateway/dist/lib/misc/urlSafeBase64encoderDecoder");
exports.urlSafeB64 = urlSafeBase64encoderDecoder_1.urlSafeB64;
var web_api_declaration_1 = require("../../gateway/dist/web_api_declaration");
exports.webApiPath = web_api_declaration_1.apiPath;

},{"../../gateway/dist/lib/misc/bundledData":3,"../../gateway/dist/lib/misc/urlSafeBase64encoderDecoder":4,"../../gateway/dist/lib/types":5,"../../gateway/dist/web_api_declaration":6}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserSimInfos;
(function (UserSimInfos) {
    UserSimInfos.key = "user_sim_infos";
})(UserSimInfos = exports.UserSimInfos || (exports.UserSimInfos = {}));
;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gateway_1 = require("../../gateway");
var type = require("../UserSimInfos");
var UserSimInfos;
(function (UserSimInfos) {
    /**
     *
     * @param contactsParameters  "enc_email=am9zZXBoLmdhcnJvbmUuZ2pAZ21haWwuY29t;iso=fr;number=0769365812"
     * (in ini: contact_parameters=enc_email=am9zZXBoLmdhcnJvbmUuZ2pAZ21haWwuY29t;iso=fr;number=0769365812 )
     *
     * return UserSimInfo stringified
     */
    function parse(contactsParameters) {
        return JSON.parse(gateway_1.urlSafeB64.dec(contactsParameters.split(";")
            .find(function (param) { return param.startsWith(type.UserSimInfos.key); })
            .split("=")[1]));
    }
    UserSimInfos.parse = parse;
})(UserSimInfos = exports.UserSimInfos || (exports.UserSimInfos = {}));
;

},{"../../gateway":16,"../UserSimInfos":17}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frontend_1 = require("../frontend");
var gateway_1 = require("../gateway");
var webApiDeclaration = require("../web_api_declaration");
/** absolutePath should be preceded of "/" eg: "/api/linphonerc" or "/login" */
var buildUrlPath = function (baseDomain, absolutePath) { return "https://web." + baseDomain + absolutePath; };
exports.buildLinphonercUrl = (function () {
    var methodName = webApiDeclaration.linphonerc.methodName;
    return function (baseDomain, params) { return frontend_1.buildUrl(buildUrlPath(baseDomain, gateway_1.webApiPath + "/" + methodName), params); };
})();
function buildLoginPageUrl(baseDomain, email) {
    return frontend_1.buildUrl(buildUrlPath(baseDomain, "/" + frontend_1.availablePages.PageName.login), { "webview": "true", email: email });
}
exports.buildLoginPageUrl = buildLoginPageUrl;
function buildManagerPageUrl(baseDomain) {
    return frontend_1.buildUrl(buildUrlPath(baseDomain, "/" + frontend_1.availablePages.PageName.manager), { "webview": "true" });
}
exports.buildManagerPageUrl = buildManagerPageUrl;
function buildWebviewphoneUrl(baseDomain) {
    return frontend_1.buildUrl(buildUrlPath(baseDomain, "/" + frontend_1.availablePages.PageName.webviewphone), { "webview": "true" });
}
exports.buildWebviewphoneUrl = buildWebviewphoneUrl;
function buildSubscriptionPageUrl(baseDomain) {
    return frontend_1.buildUrl(buildUrlPath(baseDomain, "/" + frontend_1.availablePages.PageName.subscription), { "webview": "true" });
}
exports.buildSubscriptionPageUrl = buildSubscriptionPageUrl;

},{"../frontend":15,"../gateway":16,"../web_api_declaration":23}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encryptorDecryptorFactoryStatic_1 = require("./encryptorDecryptorFactoryStatic");
var gateway = require("../gateway");
/** Return Record<string, string> stringified */
function smuggleBundledDataInHeaders(data, towardSimEncryptKeyStr) {
    return gateway.smuggleBundledDataInHeaders(data, encryptorDecryptorFactoryStatic_1.getEncryptorStatic(towardSimEncryptKeyStr));
}
exports.smuggleBundledDataInHeaders = smuggleBundledDataInHeaders;
//NOTE: The headers need to be extracted first in the main thread.
exports.buildBundledDataSipHeaders = gateway.BundledDataSipHeaders.build;
function extractBundledDataFromHeaders(bundledDataSipHeaders, towardUserDecryptKeyStr) {
    return gateway.extractBundledDataFromHeaders(bundledDataSipHeaders, encryptorDecryptorFactoryStatic_1.getDecryptorStatic(towardUserDecryptKeyStr));
}
exports.extractBundledDataFromHeaders = extractBundledDataFromHeaders;

},{"../gateway":16,"./encryptorDecryptorFactoryStatic":22}],21:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encryptorDecryptorFactoryStatic_1 = require("./encryptorDecryptorFactoryStatic");
var cryptoLib = require("crypto-lib");
/** Return outputDataB64 */
function encryptOrDecrypt(action, keyStr, inputDataB64) {
    return cryptoLib.toBuffer((function (inputData) {
        switch (action) {
            case "ENCRYPT": return encryptorDecryptorFactoryStatic_1.getEncryptorStatic(keyStr).encrypt(inputData);
            case "DECRYPT": return encryptorDecryptorFactoryStatic_1.getDecryptorStatic(keyStr).decrypt(inputData);
        }
    })(Buffer.from(inputDataB64, "base64"))).toString("base64");
}
exports.encryptOrDecrypt = encryptOrDecrypt;

}).call(this,require("buffer").Buffer)
},{"./encryptorDecryptorFactoryStatic":22,"buffer":25,"crypto-lib":30}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cryptoLib = require("crypto-lib");
var encryptorMap = new Map();
function getEncryptorStatic(encryptKeyStr) {
    var encryptor = encryptorMap.get(encryptKeyStr);
    if (encryptor === undefined) {
        encryptor = cryptoLib.rsa.syncEncryptorFactory(cryptoLib.RsaKey.parse(encryptKeyStr));
        encryptorMap.set(encryptKeyStr, encryptor);
    }
    return encryptor;
}
exports.getEncryptorStatic = getEncryptorStatic;
var decryptorMap = new Map();
function getDecryptorStatic(decryptKeyStr) {
    var decryptor = decryptorMap.get(decryptKeyStr);
    if (decryptor === undefined) {
        decryptor = cryptoLib.rsa.syncDecryptorFactory(cryptoLib.RsaKey.parse(decryptKeyStr));
        decryptorMap.set(decryptKeyStr, decryptor);
    }
    return decryptor;
}
exports.getDecryptorStatic = getDecryptorStatic;

},{"crypto-lib":30}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linphonerc;
(function (linphonerc) {
    linphonerc.methodName = "linphonerc";
})(linphonerc = exports.linphonerc || (exports.linphonerc = {}));

},{}],24:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],25:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this,require("buffer").Buffer)
},{"base64-js":24,"buffer":25,"ieee754":39}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environnement_1 = require("../sync/utils/environnement");
var web_1 = require("./WorkerThread/web");
var node_1 = require("./WorkerThread/node");
var simulated_1 = require("./WorkerThread/simulated");
var WorkerThread;
(function (WorkerThread) {
    function factory(source, isMultithreadingEnabled) {
        return function () {
            if (environnement_1.environnement.type === "LIQUID CORE") {
                throw new Error("LiquidCore cant fork");
            }
            if (!isMultithreadingEnabled()) {
                return simulated_1.spawn(source);
            }
            switch (environnement_1.environnement.type) {
                case "BROWSER": return web_1.spawn(source);
                case "NODE": return node_1.spawn(source);
            }
        };
    }
    WorkerThread.factory = factory;
})(WorkerThread = exports.WorkerThread || (exports.WorkerThread = {}));

},{"../sync/utils/environnement":34,"./WorkerThread/node":27,"./WorkerThread/simulated":28,"./WorkerThread/web":29}],27:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_events_extended_1 = require("ts-events-extended");
var ThreadMessage_1 = require("../../sync/_worker_thread/ThreadMessage");
var path = require("path");
function spawn(source) {
    var child_process = require("child_process" + "");
    var fs = require("fs" + "");
    var random_file_path = (function () {
        var getRandom = (function () {
            var crypto = require("crypto" + "");
            var base_path = (function () {
                var out = path.join("/", "tmp");
                if (!fs.existsSync(out)) {
                    out = path.join(".");
                }
                return out;
            })();
            return function () { return path.join(base_path, ".tmp_crypto-lib_you_can_remove_me_" + crypto
                .randomBytes(4)
                .toString("hex") + ".js"); };
        })();
        var out = getRandom();
        while (fs.existsSync(out)) {
            out = getRandom();
        }
        return out;
    })();
    fs.writeFileSync(random_file_path, Buffer.from([
        "console.log(\"__LOADED__\");",
        "process.title = \"crypto worker\";",
        "var __process_node= process;",
        source
    ].join("\n"), "utf8"));
    var childProcess = child_process.fork(random_file_path, [], { "silent": true });
    childProcess.stdout.once("data", function () { return fs.unlink(random_file_path, function () { }); });
    var evtResponse = new ts_events_extended_1.SyncEvent();
    childProcess.on("message", function (message) { return evtResponse.post(ThreadMessage_1.transfer.restore(message)); });
    return {
        evtResponse: evtResponse,
        "send": function (action) { return childProcess.send(ThreadMessage_1.transfer.prepare(action)); },
        "terminate": function () { return childProcess.kill(); }
    };
}
exports.spawn = spawn;

}).call(this,require("buffer").Buffer)
},{"../../sync/_worker_thread/ThreadMessage":32,"buffer":25,"path":43,"ts-events-extended":53}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_events_extended_1 = require("ts-events-extended");
function spawn(source) {
    var evtResponse = new ts_events_extended_1.SyncEvent();
    var actionListener;
    //@ts-ignore
    var __simulatedMainThreadApi = {
        "sendResponse": function (response) { return setTimeout(function () { return evtResponse.post(response); }, 0); },
        "setActionListener": function (actionListener_) { return actionListener = actionListener_; }
    };
    eval(source);
    return {
        evtResponse: evtResponse,
        "send": function (action) { return actionListener(action); },
        "terminate": function () { }
    };
}
exports.spawn = spawn;

},{"ts-events-extended":53}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_events_extended_1 = require("ts-events-extended");
function spawn(source) {
    var evtResponse = new ts_events_extended_1.SyncEvent();
    var worker = new Worker(URL.createObjectURL(new Blob([source], { "type": 'text/javascript' })));
    worker.addEventListener("message", function (_a) {
        var data = _a.data;
        return evtResponse.post(data);
    });
    return {
        evtResponse: evtResponse,
        "send": function (action, transfer) {
            worker.postMessage(action, transfer || []);
        },
        "terminate": function () { return worker.terminate(); }
    };
}
exports.spawn = spawn;

},{"ts-events-extended":53}],30:[function(require,module,exports){
(function (Buffer){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Map_1 = require("minimal-polyfills/dist/lib/Map");
var Set_1 = require("minimal-polyfills/dist/lib/Set");
require("minimal-polyfills/dist/lib/Array.from");
var runExclusive = require("run-exclusive");
var WorkerThread_1 = require("./WorkerThread");
var environnement_1 = require("../sync/utils/environnement");
var bundle_source = (function () {
    
    var path = require("path");
    return Buffer("KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoIkNhbm5vdCBmaW5kIG1vZHVsZSAnIitpKyInIik7dGhyb3cgYS5jb2RlPSJNT0RVTEVfTk9UX0ZPVU5EIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7dmFyIGVudmlyb25uZW1lbnRfMT1yZXF1aXJlKCIuLi91dGlscy9lbnZpcm9ubmVtZW50Iik7dmFyIHRvQnVmZmVyXzE9cmVxdWlyZSgiLi4vdXRpbHMvdG9CdWZmZXIiKTt2YXIgdHJhbnNmZXI7KGZ1bmN0aW9uKHRyYW5zZmVyKXt2YXIgU2VyaWFsaXphYmxlVWludDhBcnJheTsoZnVuY3Rpb24oU2VyaWFsaXphYmxlVWludDhBcnJheSl7ZnVuY3Rpb24gbWF0Y2godmFsdWUpe3JldHVybiB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCYmdmFsdWUudHlwZT09PSJVaW50OEFycmF5IiYmdHlwZW9mIHZhbHVlLmRhdGE9PT0ic3RyaW5nIn1TZXJpYWxpemFibGVVaW50OEFycmF5Lm1hdGNoPW1hdGNoO2Z1bmN0aW9uIGJ1aWxkKHZhbHVlKXtyZXR1cm57dHlwZToiVWludDhBcnJheSIsZGF0YTp0b0J1ZmZlcl8xLnRvQnVmZmVyKHZhbHVlKS50b1N0cmluZygiYmluYXJ5Iil9fVNlcmlhbGl6YWJsZVVpbnQ4QXJyYXkuYnVpbGQ9YnVpbGQ7ZnVuY3Rpb24gcmVzdG9yZSh2YWx1ZSl7cmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlLmRhdGEsImJpbmFyeSIpfVNlcmlhbGl6YWJsZVVpbnQ4QXJyYXkucmVzdG9yZT1yZXN0b3JlfSkoU2VyaWFsaXphYmxlVWludDhBcnJheXx8KFNlcmlhbGl6YWJsZVVpbnQ4QXJyYXk9e30pKTtmdW5jdGlvbiBwcmVwYXJlKHRocmVhZE1lc3NhZ2Upe2lmKGVudmlyb25uZW1lbnRfMS5lbnZpcm9ubmVtZW50LnR5cGUhPT0iTk9ERSIpe3Rocm93IG5ldyBFcnJvcigib25seSBmb3Igbm9kZSIpfXZhciBtZXNzYWdlPWZ1bmN0aW9uKCl7aWYodGhyZWFkTWVzc2FnZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpe3JldHVybiBTZXJpYWxpemFibGVVaW50OEFycmF5LmJ1aWxkKHRocmVhZE1lc3NhZ2UpfWVsc2UgaWYodGhyZWFkTWVzc2FnZSBpbnN0YW5jZW9mIEFycmF5KXtyZXR1cm4gdGhyZWFkTWVzc2FnZS5tYXAoZnVuY3Rpb24oZW50cnkpe3JldHVybiBwcmVwYXJlKGVudHJ5KX0pfWVsc2UgaWYodGhyZWFkTWVzc2FnZSBpbnN0YW5jZW9mIE9iamVjdCl7dmFyIG91dD17fTtmb3IodmFyIGtleSBpbiB0aHJlYWRNZXNzYWdlKXtvdXRba2V5XT1wcmVwYXJlKHRocmVhZE1lc3NhZ2Vba2V5XSl9cmV0dXJuIG91dH1lbHNle3JldHVybiB0aHJlYWRNZXNzYWdlfX0oKTtyZXR1cm4gbWVzc2FnZX10cmFuc2Zlci5wcmVwYXJlPXByZXBhcmU7ZnVuY3Rpb24gcmVzdG9yZShtZXNzYWdlKXtpZihlbnZpcm9ubmVtZW50XzEuZW52aXJvbm5lbWVudC50eXBlIT09Ik5PREUiKXt0aHJvdyBuZXcgRXJyb3IoIm9ubHkgZm9yIG5vZGUiKX12YXIgdGhyZWFkTWVzc2FnZT1mdW5jdGlvbigpe2lmKFNlcmlhbGl6YWJsZVVpbnQ4QXJyYXkubWF0Y2gobWVzc2FnZSkpe3JldHVybiBTZXJpYWxpemFibGVVaW50OEFycmF5LnJlc3RvcmUobWVzc2FnZSl9ZWxzZSBpZihtZXNzYWdlIGluc3RhbmNlb2YgQXJyYXkpe3JldHVybiBtZXNzYWdlLm1hcChmdW5jdGlvbihlbnRyeSl7cmV0dXJuIHJlc3RvcmUoZW50cnkpfSl9ZWxzZSBpZihtZXNzYWdlIGluc3RhbmNlb2YgT2JqZWN0KXt2YXIgb3V0PXt9O2Zvcih2YXIga2V5IGluIG1lc3NhZ2Upe291dFtrZXldPXJlc3RvcmUobWVzc2FnZVtrZXldKX1yZXR1cm4gb3V0fWVsc2V7cmV0dXJuIG1lc3NhZ2V9fSgpO3JldHVybiB0aHJlYWRNZXNzYWdlfXRyYW5zZmVyLnJlc3RvcmU9cmVzdG9yZX0pKHRyYW5zZmVyPWV4cG9ydHMudHJhbnNmZXJ8fChleHBvcnRzLnRyYW5zZmVyPXt9KSl9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi91dGlscy9lbnZpcm9ubmVtZW50IjoxMCwiLi4vdXRpbHMvdG9CdWZmZXIiOjEyLGJ1ZmZlcjoyN31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTtyZXF1aXJlKCJtaW5pbWFsLXBvbHlmaWxscy9kaXN0L2xpYi9BcnJheUJ1ZmZlci5pc1ZpZXciKTt2YXIgTWFwXzE9cmVxdWlyZSgibWluaW1hbC1wb2x5ZmlsbHMvZGlzdC9saWIvTWFwIik7dmFyIGNyeXB0b0xpYj1yZXF1aXJlKCIuLi9pbmRleCIpO3ZhciBlbnZpcm9ubmVtZW50XzE9cmVxdWlyZSgiLi4vdXRpbHMvZW52aXJvbm5lbWVudCIpO3ZhciBUaHJlYWRNZXNzYWdlXzE9cmVxdWlyZSgiLi9UaHJlYWRNZXNzYWdlIik7aWYoZnVuY3Rpb24oKXtpZih0eXBlb2YgX19zaW11bGF0ZWRNYWluVGhyZWFkQXBpIT09InVuZGVmaW5lZCIpe3JldHVybiBmYWxzZX12YXIgaXNNYWluVGhlYWQ9ZW52aXJvbm5lbWVudF8xLmVudmlyb25uZW1lbnQuaXNNYWluVGhyZWFkIT09dW5kZWZpbmVkP2Vudmlyb25uZW1lbnRfMS5lbnZpcm9ubmVtZW50LmlzTWFpblRocmVhZDp0eXBlb2YgX19wcm9jZXNzX25vZGU9PT0idW5kZWZpbmVkIjtyZXR1cm4gaXNNYWluVGhlYWR9KCkpe19fY3J5cHRvTGliPWNyeXB0b0xpYn1lbHNle3ZhciBtYWluVGhyZWFkQXBpXzE9dHlwZW9mIF9fc2ltdWxhdGVkTWFpblRocmVhZEFwaSE9PSJ1bmRlZmluZWQiP19fc2ltdWxhdGVkTWFpblRocmVhZEFwaTp0eXBlb2YgX19wcm9jZXNzX25vZGU9PT0idW5kZWZpbmVkIj97c2VuZFJlc3BvbnNlOnNlbGYucG9zdE1lc3NhZ2UuYmluZChzZWxmKSxzZXRBY3Rpb25MaXN0ZW5lcjpmdW5jdGlvbihhY3Rpb25MaXN0ZW5lcil7cmV0dXJuIGFkZEV2ZW50TGlzdGVuZXIoIm1lc3NhZ2UiLGZ1bmN0aW9uKF9hKXt2YXIgZGF0YT1fYS5kYXRhO3JldHVybiBhY3Rpb25MaXN0ZW5lcihkYXRhKX0pfX06e3NlbmRSZXNwb25zZTpmdW5jdGlvbihyZXNwb25zZSl7cmV0dXJuIF9fcHJvY2Vzc19ub2RlLnNlbmQoVGhyZWFkTWVzc2FnZV8xLnRyYW5zZmVyLnByZXBhcmUocmVzcG9uc2UpKX0sc2V0QWN0aW9uTGlzdGVuZXI6ZnVuY3Rpb24oYWN0aW9uTGlzdGVuZXIpe3JldHVybiBfX3Byb2Nlc3Nfbm9kZS5vbigibWVzc2FnZSIsZnVuY3Rpb24obWVzc2FnZSl7cmV0dXJuIGFjdGlvbkxpc3RlbmVyKFRocmVhZE1lc3NhZ2VfMS50cmFuc2Zlci5yZXN0b3JlKG1lc3NhZ2UpKX0pfX07dmFyIGNpcGhlckluc3RhbmNlc18xPW5ldyBNYXBfMS5Qb2x5ZmlsbDttYWluVGhyZWFkQXBpXzEuc2V0QWN0aW9uTGlzdGVuZXIoZnVuY3Rpb24oYWN0aW9uKXt2YXIgX2EsX2I7c3dpdGNoKGFjdGlvbi5hY3Rpb24pe2Nhc2UiR2VuZXJhdGVSc2FLZXlzIjptYWluVGhyZWFkQXBpXzEuc2VuZFJlc3BvbnNlKGZ1bmN0aW9uKCl7dmFyIF9hO3ZhciByZXNwb25zZT17YWN0aW9uSWQ6YWN0aW9uLmFjdGlvbklkLG91dHB1dHM6KF9hPWNyeXB0b0xpYi5yc2EpLnN5bmNHZW5lcmF0ZUtleXMuYXBwbHkoX2EsYWN0aW9uLnBhcmFtcyl9O3JldHVybiByZXNwb25zZX0oKSk7YnJlYWs7Y2FzZSJDaXBoZXJGYWN0b3J5IjpjaXBoZXJJbnN0YW5jZXNfMS5zZXQoYWN0aW9uLmNpcGhlckluc3RhbmNlUmVmLChfYT1jcnlwdG9MaWJbYWN0aW9uLmNpcGhlck5hbWVdKVtmdW5jdGlvbigpe3N3aXRjaChhY3Rpb24uY29tcG9uZW50cyl7Y2FzZSJEZWNyeXB0b3IiOnJldHVybiJzeW5jRGVjcnlwdG9yRmFjdG9yeSI7Y2FzZSJFbmNyeXB0b3IiOnJldHVybiJzeW5jRW5jcnlwdG9yRmFjdG9yeSI7Y2FzZSJFbmNyeXB0b3JEZWNyeXB0b3IiOnJldHVybiJzeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeSJ9fSgpXS5hcHBseShfYSxhY3Rpb24ucGFyYW1zKSk7YnJlYWs7Y2FzZSJFbmNyeXB0T3JEZWNyeXB0Ijp7dmFyIG91dHB1dF8xPWNpcGhlckluc3RhbmNlc18xLmdldChhY3Rpb24uY2lwaGVySW5zdGFuY2VSZWYpW2FjdGlvbi5tZXRob2RdKGFjdGlvbi5pbnB1dCk7bWFpblRocmVhZEFwaV8xLnNlbmRSZXNwb25zZShmdW5jdGlvbigpe3ZhciByZXNwb25zZT17YWN0aW9uSWQ6YWN0aW9uLmFjdGlvbklkLG91dHB1dDpvdXRwdXRfMX07cmV0dXJuIHJlc3BvbnNlfSgpLFtvdXRwdXRfMS5idWZmZXJdKX1icmVhaztjYXNlIlNjcnlwdEhhc2giOnt2YXIgZGlnZXN0XzE9KF9iPWNyeXB0b0xpYi5zY3J5cHQpLnN5bmNIYXNoLmFwcGx5KF9iLGFjdGlvbi5wYXJhbXMuY29uY2F0KFtmdW5jdGlvbihwZXJjZW50KXtyZXR1cm4gbWFpblRocmVhZEFwaV8xLnNlbmRSZXNwb25zZShmdW5jdGlvbigpe3ZhciByZXNwb25zZT17YWN0aW9uSWQ6YWN0aW9uLmFjdGlvbklkLHBlcmNlbnQ6cGVyY2VudH07cmV0dXJuIHJlc3BvbnNlfSgpKX1dKSk7bWFpblRocmVhZEFwaV8xLnNlbmRSZXNwb25zZShmdW5jdGlvbigpe3ZhciByZXNwb25zZT17YWN0aW9uSWQ6YWN0aW9uLmFjdGlvbklkLGRpZ2VzdDpkaWdlc3RfMX07cmV0dXJuIHJlc3BvbnNlfSgpLFtkaWdlc3RfMS5idWZmZXJdKX1icmVha319KX19LHsiLi4vaW5kZXgiOjYsIi4uL3V0aWxzL2Vudmlyb25uZW1lbnQiOjEwLCIuL1RocmVhZE1lc3NhZ2UiOjEsIm1pbmltYWwtcG9seWZpbGxzL2Rpc3QvbGliL0FycmF5QnVmZmVyLmlzVmlldyI6NDAsIm1pbmltYWwtcG9seWZpbGxzL2Rpc3QvbGliL01hcCI6NDF9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7dmFyIGFlc2pzPXJlcXVpcmUoImFlcy1qcyIpO3ZhciByYW5kb21CeXRlc18xPXJlcXVpcmUoIi4uL3V0aWxzL3JhbmRvbUJ5dGVzIik7dmFyIGJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzE9cmVxdWlyZSgiLi4vdXRpbHMvYmluYXJ5RGF0YU1hbmlwdWxhdGlvbnMiKTtmdW5jdGlvbiBzeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeShrZXkpe3JldHVybntlbmNyeXB0OmZ1bmN0aW9uKCl7dmFyIGdldEl2PWZ1bmN0aW9uKCl7dmFyIGl2MD1yYW5kb21CeXRlc18xLnJhbmRvbUJ5dGVzKDE2KTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYmluYXJ5RGF0YU1hbmlwdWxhdGlvbnNfMS5sZWZ0U2hpZnQoaXYwKX19KCk7cmV0dXJuIGZ1bmN0aW9uKHBsYWluRGF0YSl7dmFyIGl2PWdldEl2KCk7dmFyIG9yaWdpbmFsTGVuZ3RoQXNCeXRlPWJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzEuYWRkUGFkZGluZygiTEVGVCIsYmluYXJ5RGF0YU1hbmlwdWxhdGlvbnNfMS5udW1iZXJUb1VpbnQ4QXJyYXkocGxhaW5EYXRhLmxlbmd0aCksNCk7dmFyIHBsYWluRGF0YU11bHRpcGxlT2YxNkJ5dGVzPWJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzEuYWRkUGFkZGluZygiUklHSFQiLHBsYWluRGF0YSxwbGFpbkRhdGEubGVuZ3RoKygxNi1wbGFpbkRhdGEubGVuZ3RoJTE2KSk7dmFyIGVuY3J5cHRlZERhdGFQYXlsb2FkPW5ldyBhZXNqcy5Nb2RlT2ZPcGVyYXRpb24uY2JjKGtleSxpdikuZW5jcnlwdChwbGFpbkRhdGFNdWx0aXBsZU9mMTZCeXRlcyk7cmV0dXJuIGJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzEuY29uY2F0VWludDhBcnJheShpdixvcmlnaW5hbExlbmd0aEFzQnl0ZSxlbmNyeXB0ZWREYXRhUGF5bG9hZCl9fSgpLGRlY3J5cHQ6ZnVuY3Rpb24oZW5jcnlwdGVkRGF0YSl7dmFyIGl2PWVuY3J5cHRlZERhdGEuc2xpY2UoMCwxNik7dmFyIG9yaWdpbmFsTGVuZ3RoQXNCeXRlPWVuY3J5cHRlZERhdGEuc2xpY2UoMTYsMTYrNCk7dmFyIG9yaWdpbmFsTGVuZ3RoPWJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzEudWludDhBcnJheVRvTnVtYmVyKG9yaWdpbmFsTGVuZ3RoQXNCeXRlKTtyZXR1cm4gbmV3IGFlc2pzLk1vZGVPZk9wZXJhdGlvbi5jYmMoa2V5LGl2KS5kZWNyeXB0KGVuY3J5cHRlZERhdGEuc2xpY2UoMTYrNCkpLnNsaWNlKDAsb3JpZ2luYWxMZW5ndGgpfX19ZXhwb3J0cy5zeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeT1zeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeTtmdW5jdGlvbiBnZW5lcmF0ZUtleSgpe3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7cmV0dXJuIHJhbmRvbUJ5dGVzXzEucmFuZG9tQnl0ZXMoMzIsZnVuY3Rpb24oZXJyLGJ1Zil7aWYoISFlcnIpe3JlamVjdChlcnIpfWVsc2V7cmVzb2x2ZShidWYpfX0pfSl9ZXhwb3J0cy5nZW5lcmF0ZUtleT1nZW5lcmF0ZUtleTtmdW5jdGlvbiBnZXRUZXN0S2V5KCl7cmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgVWludDhBcnJheShbMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMCwyMSwyMiwyMywyNCwyNSwyNiwyNywyOCwyOSwzMCwzMV0pKX1leHBvcnRzLmdldFRlc3RLZXk9Z2V0VGVzdEtleX0seyIuLi91dGlscy9iaW5hcnlEYXRhTWFuaXB1bGF0aW9ucyI6OSwiLi4vdXRpbHMvcmFuZG9tQnl0ZXMiOjExLCJhZXMtanMiOjEzfV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO2Z1bmN0aW9uIHN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5KCl7cmV0dXJue2VuY3J5cHQ6ZnVuY3Rpb24ocGxhaW5EYXRhKXtyZXR1cm4gcGxhaW5EYXRhfSxkZWNyeXB0OmZ1bmN0aW9uKGVuY3J5cHRlZERhdGEpe3JldHVybiBlbmNyeXB0ZWREYXRhfX19ZXhwb3J0cy5zeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeT1zeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeX0se31dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpeyJ1c2Ugc3RyaWN0Ijt2YXIgX19hc3NpZ249dGhpcyYmdGhpcy5fX2Fzc2lnbnx8ZnVuY3Rpb24oKXtfX2Fzc2lnbj1PYmplY3QuYXNzaWdufHxmdW5jdGlvbih0KXtmb3IodmFyIHMsaT0xLG49YXJndW1lbnRzLmxlbmd0aDtpPG47aSsrKXtzPWFyZ3VtZW50c1tpXTtmb3IodmFyIHAgaW4gcylpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocyxwKSl0W3BdPXNbcF19cmV0dXJuIHR9O3JldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO3ZhciB0eXBlc18xPXJlcXVpcmUoIi4uL3R5cGVzIik7dmFyIE5vZGVSU0E9cmVxdWlyZSgibm9kZS1yc2EiKTt2YXIgZW52aXJvbm5lbWVudF8xPXJlcXVpcmUoIi4uL3V0aWxzL2Vudmlyb25uZW1lbnQiKTt2YXIgdG9CdWZmZXJfMT1yZXF1aXJlKCIuLi91dGlscy90b0J1ZmZlciIpO3ZhciB0YXJnZXRlZEVudmlyb25uZW1lbnQ9ZW52aXJvbm5lbWVudF8xLmVudmlyb25uZW1lbnQudHlwZT09PSJOT0RFIj8ibm9kZSI6ImJyb3dzZXIiO3ZhciBuZXdOb2RlUlNBPWZ1bmN0aW9uKGtleSl7cmV0dXJuIG5ldyBOb2RlUlNBKEJ1ZmZlci5mcm9tKGtleS5kYXRhKSxrZXkuZm9ybWF0LHtlbnZpcm9ubWVudDp0YXJnZXRlZEVudmlyb25uZW1lbnR9KX07ZnVuY3Rpb24gc3luY0VuY3J5cHRvckZhY3RvcnkoZW5jcnlwdEtleSl7cmV0dXJue2VuY3J5cHQ6ZnVuY3Rpb24oKXt2YXIgZW5jcnlwdE5vZGVSU0E9bmV3Tm9kZVJTQShlbmNyeXB0S2V5KTt2YXIgZW5jcnlwdE1ldGhvZD10eXBlc18xLlJzYUtleS5Qcml2YXRlLm1hdGNoKGVuY3J5cHRLZXkpPyJlbmNyeXB0UHJpdmF0ZSI6ImVuY3J5cHQiO3JldHVybiBmdW5jdGlvbihwbGFpbkRhdGEpe3JldHVybiBlbmNyeXB0Tm9kZVJTQVtlbmNyeXB0TWV0aG9kXSh0b0J1ZmZlcl8xLnRvQnVmZmVyKHBsYWluRGF0YSkpfX0oKX19ZXhwb3J0cy5zeW5jRW5jcnlwdG9yRmFjdG9yeT1zeW5jRW5jcnlwdG9yRmFjdG9yeTtmdW5jdGlvbiBzeW5jRGVjcnlwdG9yRmFjdG9yeShkZWNyeXB0S2V5KXtyZXR1cm57ZGVjcnlwdDpmdW5jdGlvbigpe3ZhciBkZWNyeXB0Tm9kZVJTQT1uZXdOb2RlUlNBKGRlY3J5cHRLZXkpO3ZhciBkZWNyeXB0TWV0aG9kPXR5cGVzXzEuUnNhS2V5LlB1YmxpYy5tYXRjaChkZWNyeXB0S2V5KT8iZGVjcnlwdFB1YmxpYyI6ImRlY3J5cHQiO3JldHVybiBmdW5jdGlvbihlbmNyeXB0ZWREYXRhKXtyZXR1cm4gZGVjcnlwdE5vZGVSU0FbZGVjcnlwdE1ldGhvZF0odG9CdWZmZXJfMS50b0J1ZmZlcihlbmNyeXB0ZWREYXRhKSl9fSgpfX1leHBvcnRzLnN5bmNEZWNyeXB0b3JGYWN0b3J5PXN5bmNEZWNyeXB0b3JGYWN0b3J5O2Z1bmN0aW9uIHN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5KGVuY3J5cHRLZXksZGVjcnlwdEtleSl7cmV0dXJuIF9fYXNzaWduKHt9LHN5bmNFbmNyeXB0b3JGYWN0b3J5KGVuY3J5cHRLZXkpLHN5bmNEZWNyeXB0b3JGYWN0b3J5KGRlY3J5cHRLZXkpKX1leHBvcnRzLnN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5PXN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5O2Z1bmN0aW9uIHN5bmNHZW5lcmF0ZUtleXMoc2VlZCxrZXlzTGVuZ3RoQnl0ZXMpe2lmKGtleXNMZW5ndGhCeXRlcz09PXZvaWQgMCl7a2V5c0xlbmd0aEJ5dGVzPTgwfXZhciBub2RlUlNBPU5vZGVSU0EuZ2VuZXJhdGVLZXlQYWlyRnJvbVNlZWQoc2VlZCw4KmtleXNMZW5ndGhCeXRlcyx1bmRlZmluZWQsdGFyZ2V0ZWRFbnZpcm9ubmVtZW50KTtmdW5jdGlvbiBidWlsZEtleShmb3JtYXQpe3JldHVybntmb3JtYXQ6Zm9ybWF0LGRhdGE6bm9kZVJTQS5leHBvcnRLZXkoZm9ybWF0KX19cmV0dXJue3B1YmxpY0tleTpidWlsZEtleSgicGtjczEtcHVibGljLWRlciIpLHByaXZhdGVLZXk6YnVpbGRLZXkoInBrY3MxLXByaXZhdGUtZGVyIil9fWV4cG9ydHMuc3luY0dlbmVyYXRlS2V5cz1zeW5jR2VuZXJhdGVLZXlzfSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vdHlwZXMiOjgsIi4uL3V0aWxzL2Vudmlyb25uZW1lbnQiOjEwLCIuLi91dGlscy90b0J1ZmZlciI6MTIsYnVmZmVyOjI3LCJub2RlLXJzYSI6NDJ9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gX19leHBvcnQobSl7Zm9yKHZhciBwIGluIG0paWYoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpZXhwb3J0c1twXT1tW3BdfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO19fZXhwb3J0KHJlcXVpcmUoIi4vdHlwZXMiKSk7dmFyIHNjcnlwdD1yZXF1aXJlKCIuL3NjcnlwdCIpO2V4cG9ydHMuc2NyeXB0PXNjcnlwdDt2YXIgYWVzPXJlcXVpcmUoIi4vY2lwaGVyL2FlcyIpO2V4cG9ydHMuYWVzPWFlczt2YXIgcnNhPXJlcXVpcmUoIi4vY2lwaGVyL3JzYSIpO2V4cG9ydHMucnNhPXJzYTt2YXIgcGxhaW49cmVxdWlyZSgiLi9jaXBoZXIvcGxhaW4iKTtleHBvcnRzLnBsYWluPXBsYWlufSx7Ii4vY2lwaGVyL2FlcyI6MywiLi9jaXBoZXIvcGxhaW4iOjQsIi4vY2lwaGVyL3JzYSI6NSwiLi9zY3J5cHQiOjcsIi4vdHlwZXMiOjh9XSw3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIF9fYXNzaWduPXRoaXMmJnRoaXMuX19hc3NpZ258fGZ1bmN0aW9uKCl7X19hc3NpZ249T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24odCl7Zm9yKHZhciBzLGk9MSxuPWFyZ3VtZW50cy5sZW5ndGg7aTxuO2krKyl7cz1hcmd1bWVudHNbaV07Zm9yKHZhciBwIGluIHMpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMscCkpdFtwXT1zW3BdfXJldHVybiB0fTtyZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcyxhcmd1bWVudHMpfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTt2YXIgc2NyeXB0c3k9cmVxdWlyZSgic2NyeXB0c3kiKTtleHBvcnRzLmRlZmF1bHRQYXJhbXM9e246MTMscjo4LHA6MSxkaWdlc3RMZW5ndGhCeXRlczoyNTR9O2Z1bmN0aW9uIHN5bmNIYXNoKHRleHQsc2FsdCxwYXJhbXMscHJvZ3Jlc3Mpe2lmKHBhcmFtcz09PXZvaWQgMCl7cGFyYW1zPXt9fXZhciBfYT1mdW5jdGlvbigpe3ZhciBvdXQ9X19hc3NpZ24oe30sZXhwb3J0cy5kZWZhdWx0UGFyYW1zKTtPYmplY3Qua2V5cyhwYXJhbXMpLmZpbHRlcihmdW5jdGlvbihrZXkpe3JldHVybiBwYXJhbXNba2V5XSE9PXVuZGVmaW5lZH0pLmZvckVhY2goZnVuY3Rpb24oa2V5KXtyZXR1cm4gb3V0W2tleV09cGFyYW1zW2tleV19KTtyZXR1cm4gb3V0fSgpLG49X2EubixyPV9hLnIscD1fYS5wLGRpZ2VzdExlbmd0aEJ5dGVzPV9hLmRpZ2VzdExlbmd0aEJ5dGVzO3JldHVybiBzY3J5cHRzeSh0ZXh0LHNhbHQsTWF0aC5wb3coMixuKSxyLHAsZGlnZXN0TGVuZ3RoQnl0ZXMscHJvZ3Jlc3MhPT11bmRlZmluZWQ/ZnVuY3Rpb24oX2Epe3ZhciBwZXJjZW50PV9hLnBlcmNlbnQ7cmV0dXJuIHByb2dyZXNzKHBlcmNlbnQpfTp1bmRlZmluZWQpfWV4cG9ydHMuc3luY0hhc2g9c3luY0hhc2h9LHtzY3J5cHRzeTo4NH1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpeyJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTt2YXIgdG9CdWZmZXJfMT1yZXF1aXJlKCIuL3V0aWxzL3RvQnVmZmVyIik7dmFyIFJzYUtleTsoZnVuY3Rpb24oUnNhS2V5KXtmdW5jdGlvbiBzdHJpbmdpZnkocnNhS2V5KXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoW3JzYUtleS5mb3JtYXQsdG9CdWZmZXJfMS50b0J1ZmZlcihyc2FLZXkuZGF0YSkudG9TdHJpbmcoImJhc2U2NCIpXSl9UnNhS2V5LnN0cmluZ2lmeT1zdHJpbmdpZnk7ZnVuY3Rpb24gcGFyc2Uoc3RyaW5naWZpZWRSc2FLZXkpe3ZhciBfYT1KU09OLnBhcnNlKHN0cmluZ2lmaWVkUnNhS2V5KSxmb3JtYXQ9X2FbMF0sc3RyRGF0YT1fYVsxXTtyZXR1cm57Zm9ybWF0OmZvcm1hdCxkYXRhOm5ldyBVaW50OEFycmF5KEJ1ZmZlci5mcm9tKHN0ckRhdGEsImJhc2U2NCIpKX19UnNhS2V5LnBhcnNlPXBhcnNlO3ZhciBQdWJsaWM7KGZ1bmN0aW9uKFB1YmxpYyl7ZnVuY3Rpb24gbWF0Y2gocnNhS2V5KXtyZXR1cm4gcnNhS2V5LmZvcm1hdD09PSJwa2NzMS1wdWJsaWMtZGVyIn1QdWJsaWMubWF0Y2g9bWF0Y2h9KShQdWJsaWM9UnNhS2V5LlB1YmxpY3x8KFJzYUtleS5QdWJsaWM9e30pKTt2YXIgUHJpdmF0ZTsoZnVuY3Rpb24oUHJpdmF0ZSl7ZnVuY3Rpb24gbWF0Y2gocnNhS2V5KXtyZXR1cm4gcnNhS2V5LmZvcm1hdD09PSJwa2NzMS1wcml2YXRlLWRlciJ9UHJpdmF0ZS5tYXRjaD1tYXRjaH0pKFByaXZhdGU9UnNhS2V5LlByaXZhdGV8fChSc2FLZXkuUHJpdmF0ZT17fSkpfSkoUnNhS2V5PWV4cG9ydHMuUnNhS2V5fHwoZXhwb3J0cy5Sc2FLZXk9e30pKX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4vdXRpbHMvdG9CdWZmZXIiOjEyLGJ1ZmZlcjoyN31dLDk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTtmdW5jdGlvbiBjb25jYXRVaW50OEFycmF5KCl7dmFyIHVpbnQ4QXJyYXlzPVtdO2Zvcih2YXIgX2k9MDtfaTxhcmd1bWVudHMubGVuZ3RoO19pKyspe3VpbnQ4QXJyYXlzW19pXT1hcmd1bWVudHNbX2ldfXZhciBvdXQ9bmV3IFVpbnQ4QXJyYXkodWludDhBcnJheXMubWFwKGZ1bmN0aW9uKF9hKXt2YXIgbGVuZ3RoPV9hLmxlbmd0aDtyZXR1cm4gbGVuZ3RofSkucmVkdWNlKGZ1bmN0aW9uKHByZXYsY3Vycil7cmV0dXJuIHByZXYrY3Vycn0sMCkpO3ZhciBvZmZzZXQ9MDtmb3IodmFyIGk9MDtpPHVpbnQ4QXJyYXlzLmxlbmd0aDtpKyspe3ZhciB1aW50OEFycmF5PXVpbnQ4QXJyYXlzW2ldO291dC5zZXQodWludDhBcnJheSxvZmZzZXQpO29mZnNldCs9dWludDhBcnJheS5sZW5ndGh9cmV0dXJuIG91dH1leHBvcnRzLmNvbmNhdFVpbnQ4QXJyYXk9Y29uY2F0VWludDhBcnJheTtmdW5jdGlvbiBhZGRQYWRkaW5nKHBvc2l0aW9uLHVpbnQ4QXJyYXksdGFyZ2V0TGVuZ3RoQnl0ZXMpe3ZhciBwYWRkaW5nQnl0ZXM9bmV3IFVpbnQ4QXJyYXkodGFyZ2V0TGVuZ3RoQnl0ZXMtdWludDhBcnJheS5sZW5ndGgpLmZpbGwoMCk7cmV0dXJuIGNvbmNhdFVpbnQ4QXJyYXkuYXBwbHkodm9pZCAwLGZ1bmN0aW9uKCl7c3dpdGNoKHBvc2l0aW9uKXtjYXNlIkxFRlQiOnJldHVybltwYWRkaW5nQnl0ZXMsdWludDhBcnJheV07Y2FzZSJSSUdIVCI6cmV0dXJuW3VpbnQ4QXJyYXkscGFkZGluZ0J5dGVzXX19KCkpfWV4cG9ydHMuYWRkUGFkZGluZz1hZGRQYWRkaW5nO2Z1bmN0aW9uIG51bWJlclRvVWludDhBcnJheShuKXt2YXIgc3RyPW4udG9TdHJpbmcoMTYpO3ZhciBhcnI9W107dmFyIGN1cnI9IiI7Zm9yKHZhciBpPXN0ci5sZW5ndGgtMTtpPj0wO2ktLSl7Y3Vycj1zdHJbaV0rY3VycjtpZihjdXJyLmxlbmd0aD09PTJ8fGk9PT0wKXthcnI9W3BhcnNlSW50KGN1cnIsMTYpXS5jb25jYXQoYXJyKTtjdXJyPSIifX1yZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJyKX1leHBvcnRzLm51bWJlclRvVWludDhBcnJheT1udW1iZXJUb1VpbnQ4QXJyYXk7ZnVuY3Rpb24gdWludDhBcnJheVRvTnVtYmVyKHVpbnQ4QXJyYXkpe3ZhciBuPTA7dmFyIGV4cD0wO2Zvcih2YXIgaT11aW50OEFycmF5Lmxlbmd0aC0xO2k+PTA7aS0tKXtuKz11aW50OEFycmF5W2ldKk1hdGgucG93KDI1NixleHArKyl9cmV0dXJuIG59ZXhwb3J0cy51aW50OEFycmF5VG9OdW1iZXI9dWludDhBcnJheVRvTnVtYmVyO2Z1bmN0aW9uIGxlZnRTaGlmdCh1aW50OEFycmF5KXt2YXIgYz10cnVlO2Zvcih2YXIgaT11aW50OEFycmF5Lmxlbmd0aC0xO2MmJmk+PTA7aS0tKXtpZigrK3VpbnQ4QXJyYXlbaV0hPT0yNTYpe2M9ZmFsc2V9fXJldHVybiB1aW50OEFycmF5fWV4cG9ydHMubGVmdFNoaWZ0PWxlZnRTaGlmdH0se31dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5lbnZpcm9ubmVtZW50PWZ1bmN0aW9uKCl7aWYodHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiKXtyZXR1cm57dHlwZToiQlJPV1NFUiIsaXNNYWluVGhyZWFkOnRydWV9fWVsc2UgaWYodHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIiYmISFzZWxmLnBvc3RNZXNzYWdlKXtyZXR1cm57dHlwZToiQlJPV1NFUiIsaXNNYWluVGhyZWFkOmZhbHNlfX1lbHNlIGlmKHR5cGVvZiBzZXRUaW1lb3V0PT09InVuZGVmaW5lZCIpe3JldHVybnt0eXBlOiJMSVFVSUQgQ09SRSIsaXNNYWluVGhyZWFkOnRydWV9fWVsc2V7cmV0dXJue3R5cGU6Ik5PREUiLGlzTWFpblRocmVhZDp1bmRlZmluZWR9fX0oKX0se31dLDExOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7dmFyIGVudmlyb25uZW1lbnRfMT1yZXF1aXJlKCIuL2Vudmlyb25uZW1lbnQiKTtmdW5jdGlvbiByYW5kb21CeXRlcyhzaXplLGNhbGxiYWNrKXt2YXIgTUFYX1VJTlQzMj1yYW5kb21CeXRlcy5NQVhfVUlOVDMyLE1BWF9CWVRFUz1yYW5kb21CeXRlcy5NQVhfQllURVMsZ2V0UmFuZG9tVmFsdWVzPXJhbmRvbUJ5dGVzLmdldFJhbmRvbVZhbHVlcyxnZXROb2RlUmFuZG9tQnl0ZXM9cmFuZG9tQnl0ZXMuZ2V0Tm9kZVJhbmRvbUJ5dGVzO2lmKGVudmlyb25uZW1lbnRfMS5lbnZpcm9ubmVtZW50LnR5cGU9PT0iTk9ERSIpe3ZhciBub2RlQnVmZmVySW5zdD1nZXROb2RlUmFuZG9tQnl0ZXMoKShzaXplKTtyZXR1cm4gQnVmZmVyLmZyb20obm9kZUJ1ZmZlckluc3QuYnVmZmVyLG5vZGVCdWZmZXJJbnN0LmJ5dGVPZmZzZXQsbm9kZUJ1ZmZlckluc3QubGVuZ3RoKX1pZihzaXplPk1BWF9VSU5UMzIpe3Rocm93IG5ldyBSYW5nZUVycm9yKCJyZXF1ZXN0ZWQgdG9vIG1hbnkgcmFuZG9tIGJ5dGVzIil9dmFyIGJ5dGVzPUJ1ZmZlci5hbGxvY1Vuc2FmZShzaXplKTtpZihzaXplPjApe2lmKHNpemU+TUFYX0JZVEVTKXtmb3IodmFyIGdlbmVyYXRlZD0wO2dlbmVyYXRlZDxzaXplO2dlbmVyYXRlZCs9TUFYX0JZVEVTKXtnZXRSYW5kb21WYWx1ZXMoYnl0ZXMuc2xpY2UoZ2VuZXJhdGVkLGdlbmVyYXRlZCtNQVhfQllURVMpKX19ZWxzZXtnZXRSYW5kb21WYWx1ZXMoYnl0ZXMpfX1pZih0eXBlb2YgY2FsbGJhY2s9PT0iZnVuY3Rpb24iKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cmV0dXJuIGNhbGxiYWNrKG51bGwsYnl0ZXMpfSwwKTtyZXR1cm59cmV0dXJuIGJ5dGVzfWV4cG9ydHMucmFuZG9tQnl0ZXM9cmFuZG9tQnl0ZXM7KGZ1bmN0aW9uKHJhbmRvbUJ5dGVzKXtyYW5kb21CeXRlcy5NQVhfQllURVM9NjU1MzY7cmFuZG9tQnl0ZXMuTUFYX1VJTlQzMj00Mjk0OTY3Mjk1O3JhbmRvbUJ5dGVzLmdldFJhbmRvbVZhbHVlcz1mdW5jdGlvbigpe3ZhciBub25DcnlwdG9ncmFwaGljR2V0UmFuZG9tVmFsdWU9ZnVuY3Rpb24oYWJ2KXt2YXIgbD1hYnYubGVuZ3RoO3doaWxlKGwtLSl7YWJ2W2xdPU1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyNTYpfXJldHVybiBhYnZ9O3ZhciBicm93c2VyR2V0UmFuZG9tVmFsdWVzPWZ1bmN0aW9uKCl7aWYodHlwZW9mIGNyeXB0bz09PSJvYmplY3QiJiYhIWNyeXB0by5nZXRSYW5kb21WYWx1ZXMpe3JldHVybiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKX1lbHNlIGlmKHR5cGVvZiBtc0NyeXB0bz09PSJvYmplY3QiJiYhIW1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyl7cmV0dXJuIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKX1lbHNlIGlmKHR5cGVvZiBzZWxmPT09Im9iamVjdCImJnR5cGVvZiBzZWxmLmNyeXB0bz09PSJvYmplY3QiJiYhIXNlbGYuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyl7cmV0dXJuIHNlbGYuY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKHNlbGYuY3J5cHRvKX1lbHNle3JldHVybiB1bmRlZmluZWR9fSgpO3JldHVybiEhYnJvd3NlckdldFJhbmRvbVZhbHVlcz9icm93c2VyR2V0UmFuZG9tVmFsdWVzOm5vbkNyeXB0b2dyYXBoaWNHZXRSYW5kb21WYWx1ZX0oKTtyYW5kb21CeXRlcy5nZXROb2RlUmFuZG9tQnl0ZXM9ZnVuY3Rpb24oKXt2YXIgbm9kZVJhbmRvbUJ5dGVzPXVuZGVmaW5lZDtyZXR1cm4gZnVuY3Rpb24oKXtpZihub2RlUmFuZG9tQnl0ZXM9PT11bmRlZmluZWQpe25vZGVSYW5kb21CeXRlcz1yZXF1aXJlKCJjcnlwdG8iKyIiKS5yYW5kb21CeXRlc31yZXR1cm4gbm9kZVJhbmRvbUJ5dGVzfX0oKX0pKHJhbmRvbUJ5dGVzPWV4cG9ydHMucmFuZG9tQnl0ZXN8fChleHBvcnRzLnJhbmRvbUJ5dGVzPXt9KSl9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuL2Vudmlyb25uZW1lbnQiOjEwLGJ1ZmZlcjoyN31dLDEyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7ZnVuY3Rpb24gdG9CdWZmZXIodWludDhBcnJheSl7cmV0dXJuIEJ1ZmZlci5mcm9tKHVpbnQ4QXJyYXkuYnVmZmVyLHVpbnQ4QXJyYXkuYnl0ZU9mZnNldCx1aW50OEFycmF5Lmxlbmd0aCl9ZXhwb3J0cy50b0J1ZmZlcj10b0J1ZmZlcn0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7YnVmZmVyOjI3fV0sMTM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihyb290KXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gY2hlY2tJbnQodmFsdWUpe3JldHVybiBwYXJzZUludCh2YWx1ZSk9PT12YWx1ZX1mdW5jdGlvbiBjaGVja0ludHMoYXJyYXlpc2gpe2lmKCFjaGVja0ludChhcnJheWlzaC5sZW5ndGgpKXtyZXR1cm4gZmFsc2V9Zm9yKHZhciBpPTA7aTxhcnJheWlzaC5sZW5ndGg7aSsrKXtpZighY2hlY2tJbnQoYXJyYXlpc2hbaV0pfHxhcnJheWlzaFtpXTwwfHxhcnJheWlzaFtpXT4yNTUpe3JldHVybiBmYWxzZX19cmV0dXJuIHRydWV9ZnVuY3Rpb24gY29lcmNlQXJyYXkoYXJnLGNvcHkpe2lmKGFyZy5idWZmZXImJmFyZy5uYW1lPT09IlVpbnQ4QXJyYXkiKXtpZihjb3B5KXtpZihhcmcuc2xpY2Upe2FyZz1hcmcuc2xpY2UoKX1lbHNle2FyZz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmcpfX1yZXR1cm4gYXJnfWlmKEFycmF5LmlzQXJyYXkoYXJnKSl7aWYoIWNoZWNrSW50cyhhcmcpKXt0aHJvdyBuZXcgRXJyb3IoIkFycmF5IGNvbnRhaW5zIGludmFsaWQgdmFsdWU6ICIrYXJnKX1yZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJnKX1pZihjaGVja0ludChhcmcubGVuZ3RoKSYmY2hlY2tJbnRzKGFyZykpe3JldHVybiBuZXcgVWludDhBcnJheShhcmcpfXRocm93IG5ldyBFcnJvcigidW5zdXBwb3J0ZWQgYXJyYXktbGlrZSBvYmplY3QiKX1mdW5jdGlvbiBjcmVhdGVBcnJheShsZW5ndGgpe3JldHVybiBuZXcgVWludDhBcnJheShsZW5ndGgpfWZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2VBcnJheSx0YXJnZXRBcnJheSx0YXJnZXRTdGFydCxzb3VyY2VTdGFydCxzb3VyY2VFbmQpe2lmKHNvdXJjZVN0YXJ0IT1udWxsfHxzb3VyY2VFbmQhPW51bGwpe2lmKHNvdXJjZUFycmF5LnNsaWNlKXtzb3VyY2VBcnJheT1zb3VyY2VBcnJheS5zbGljZShzb3VyY2VTdGFydCxzb3VyY2VFbmQpfWVsc2V7c291cmNlQXJyYXk9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc291cmNlQXJyYXksc291cmNlU3RhcnQsc291cmNlRW5kKX19dGFyZ2V0QXJyYXkuc2V0KHNvdXJjZUFycmF5LHRhcmdldFN0YXJ0KX12YXIgY29udmVydFV0Zjg9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0b0J5dGVzKHRleHQpe3ZhciByZXN1bHQ9W10saT0wO3RleHQ9ZW5jb2RlVVJJKHRleHQpO3doaWxlKGk8dGV4dC5sZW5ndGgpe3ZhciBjPXRleHQuY2hhckNvZGVBdChpKyspO2lmKGM9PT0zNyl7cmVzdWx0LnB1c2gocGFyc2VJbnQodGV4dC5zdWJzdHIoaSwyKSwxNikpO2krPTJ9ZWxzZXtyZXN1bHQucHVzaChjKX19cmV0dXJuIGNvZXJjZUFycmF5KHJlc3VsdCl9ZnVuY3Rpb24gZnJvbUJ5dGVzKGJ5dGVzKXt2YXIgcmVzdWx0PVtdLGk9MDt3aGlsZShpPGJ5dGVzLmxlbmd0aCl7dmFyIGM9Ynl0ZXNbaV07aWYoYzwxMjgpe3Jlc3VsdC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYykpO2krK31lbHNlIGlmKGM+MTkxJiZjPDIyNCl7cmVzdWx0LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZSgoYyYzMSk8PDZ8Ynl0ZXNbaSsxXSY2MykpO2krPTJ9ZWxzZXtyZXN1bHQucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKChjJjE1KTw8MTJ8KGJ5dGVzW2krMV0mNjMpPDw2fGJ5dGVzW2krMl0mNjMpKTtpKz0zfX1yZXR1cm4gcmVzdWx0LmpvaW4oIiIpfXJldHVybnt0b0J5dGVzOnRvQnl0ZXMsZnJvbUJ5dGVzOmZyb21CeXRlc319KCk7dmFyIGNvbnZlcnRIZXg9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0b0J5dGVzKHRleHQpe3ZhciByZXN1bHQ9W107Zm9yKHZhciBpPTA7aTx0ZXh0Lmxlbmd0aDtpKz0yKXtyZXN1bHQucHVzaChwYXJzZUludCh0ZXh0LnN1YnN0cihpLDIpLDE2KSl9cmV0dXJuIHJlc3VsdH12YXIgSGV4PSIwMTIzNDU2Nzg5YWJjZGVmIjtmdW5jdGlvbiBmcm9tQnl0ZXMoYnl0ZXMpe3ZhciByZXN1bHQ9W107Zm9yKHZhciBpPTA7aTxieXRlcy5sZW5ndGg7aSsrKXt2YXIgdj1ieXRlc1tpXTtyZXN1bHQucHVzaChIZXhbKHYmMjQwKT4+NF0rSGV4W3YmMTVdKX1yZXR1cm4gcmVzdWx0LmpvaW4oIiIpfXJldHVybnt0b0J5dGVzOnRvQnl0ZXMsZnJvbUJ5dGVzOmZyb21CeXRlc319KCk7dmFyIG51bWJlck9mUm91bmRzPXsxNjoxMCwyNDoxMiwzMjoxNH07dmFyIHJjb249WzEsMiw0LDgsMTYsMzIsNjQsMTI4LDI3LDU0LDEwOCwyMTYsMTcxLDc3LDE1NCw0Nyw5NCwxODgsOTksMTk4LDE1MSw1MywxMDYsMjEyLDE3OSwxMjUsMjUwLDIzOSwxOTcsMTQ1XTt2YXIgUz1bOTksMTI0LDExOSwxMjMsMjQyLDEwNywxMTEsMTk3LDQ4LDEsMTAzLDQzLDI1NCwyMTUsMTcxLDExOCwyMDIsMTMwLDIwMSwxMjUsMjUwLDg5LDcxLDI0MCwxNzMsMjEyLDE2MiwxNzUsMTU2LDE2NCwxMTQsMTkyLDE4MywyNTMsMTQ3LDM4LDU0LDYzLDI0NywyMDQsNTIsMTY1LDIyOSwyNDEsMTEzLDIxNiw0OSwyMSw0LDE5OSwzNSwxOTUsMjQsMTUwLDUsMTU0LDcsMTgsMTI4LDIyNiwyMzUsMzksMTc4LDExNyw5LDEzMSw0NCwyNiwyNywxMTAsOTAsMTYwLDgyLDU5LDIxNCwxNzksNDEsMjI3LDQ3LDEzMiw4MywyMDksMCwyMzcsMzIsMjUyLDE3Nyw5MSwxMDYsMjAzLDE5MCw1Nyw3NCw3Niw4OCwyMDcsMjA4LDIzOSwxNzAsMjUxLDY3LDc3LDUxLDEzMyw2OSwyNDksMiwxMjcsODAsNjAsMTU5LDE2OCw4MSwxNjMsNjQsMTQzLDE0NiwxNTcsNTYsMjQ1LDE4OCwxODIsMjE4LDMzLDE2LDI1NSwyNDMsMjEwLDIwNSwxMiwxOSwyMzYsOTUsMTUxLDY4LDIzLDE5NiwxNjcsMTI2LDYxLDEwMCw5MywyNSwxMTUsOTYsMTI5LDc5LDIyMCwzNCw0MiwxNDQsMTM2LDcwLDIzOCwxODQsMjAsMjIyLDk0LDExLDIxOSwyMjQsNTAsNTgsMTAsNzMsNiwzNiw5MiwxOTQsMjExLDE3Miw5OCwxNDUsMTQ5LDIyOCwxMjEsMjMxLDIwMCw1NSwxMDksMTQxLDIxMyw3OCwxNjksMTA4LDg2LDI0NCwyMzQsMTAxLDEyMiwxNzQsOCwxODYsMTIwLDM3LDQ2LDI4LDE2NiwxODAsMTk4LDIzMiwyMjEsMTE2LDMxLDc1LDE4OSwxMzksMTM4LDExMiw2MiwxODEsMTAyLDcyLDMsMjQ2LDE0LDk3LDUzLDg3LDE4NSwxMzQsMTkzLDI5LDE1OCwyMjUsMjQ4LDE1MiwxNywxMDUsMjE3LDE0MiwxNDgsMTU1LDMwLDEzNSwyMzMsMjA2LDg1LDQwLDIyMywxNDAsMTYxLDEzNywxMywxOTEsMjMwLDY2LDEwNCw2NSwxNTMsNDUsMTUsMTc2LDg0LDE4NywyMl07dmFyIFNpPVs4Miw5LDEwNiwyMTMsNDgsNTQsMTY1LDU2LDE5MSw2NCwxNjMsMTU4LDEyOSwyNDMsMjE1LDI1MSwxMjQsMjI3LDU3LDEzMCwxNTUsNDcsMjU1LDEzNSw1MiwxNDIsNjcsNjgsMTk2LDIyMiwyMzMsMjAzLDg0LDEyMywxNDgsNTAsMTY2LDE5NCwzNSw2MSwyMzgsNzYsMTQ5LDExLDY2LDI1MCwxOTUsNzgsOCw0NiwxNjEsMTAyLDQwLDIxNywzNiwxNzgsMTE4LDkxLDE2Miw3MywxMDksMTM5LDIwOSwzNywxMTQsMjQ4LDI0NiwxMDAsMTM0LDEwNCwxNTIsMjIsMjEyLDE2NCw5MiwyMDQsOTMsMTAxLDE4MiwxNDYsMTA4LDExMiw3Miw4MCwyNTMsMjM3LDE4NSwyMTgsOTQsMjEsNzAsODcsMTY3LDE0MSwxNTcsMTMyLDE0NCwyMTYsMTcxLDAsMTQwLDE4OCwyMTEsMTAsMjQ3LDIyOCw4OCw1LDE4NCwxNzksNjksNiwyMDgsNDQsMzAsMTQzLDIwMiw2MywxNSwyLDE5MywxNzUsMTg5LDMsMSwxOSwxMzgsMTA3LDU4LDE0NSwxNyw2NSw3OSwxMDMsMjIwLDIzNCwxNTEsMjQyLDIwNywyMDYsMjQwLDE4MCwyMzAsMTE1LDE1MCwxNzIsMTE2LDM0LDIzMSwxNzMsNTMsMTMzLDIyNiwyNDksNTUsMjMyLDI4LDExNywyMjMsMTEwLDcxLDI0MSwyNiwxMTMsMjksNDEsMTk3LDEzNywxMTEsMTgzLDk4LDE0LDE3MCwyNCwxOTAsMjcsMjUyLDg2LDYyLDc1LDE5OCwyMTAsMTIxLDMyLDE1NCwyMTksMTkyLDI1NCwxMjAsMjA1LDkwLDI0NCwzMSwyMjEsMTY4LDUxLDEzNiw3LDE5OSw0OSwxNzcsMTgsMTYsODksMzksMTI4LDIzNiw5NSw5Niw4MSwxMjcsMTY5LDI1LDE4MSw3NCwxMyw0NSwyMjksMTIyLDE1OSwxNDcsMjAxLDE1NiwyMzksMTYwLDIyNCw1OSw3NywxNzQsNDIsMjQ1LDE3NiwyMDAsMjM1LDE4Nyw2MCwxMzEsODMsMTUzLDk3LDIzLDQzLDQsMTI2LDE4NiwxMTksMjE0LDM4LDIyNSwxMDUsMjAsOTksODUsMzMsMTIsMTI1XTt2YXIgVDE9WzMzMjg0MDIzNDEsNDE2ODkwNzkwOCw0MDAwODA2ODA5LDQxMzUyODc2OTMsNDI5NDExMTc1NywzNTk3MzY0MTU3LDM3MzE4NDUwNDEsMjQ0NTY1NzQyOCwxNjEzNzcwODMyLDMzNjIwMjI3LDM0NjI4ODMyNDEsMTQ0NTY2OTc1NywzODkyMjQ4MDg5LDMwNTA4MjE0NzQsMTMwMzA5NjI5NCwzOTY3MTg2NTg2LDI0MTI0MzE5NDEsNTI4NjQ2ODEzLDIzMTE3MDI4NDgsNDIwMjUyODEzNSw0MDI2MjAyNjQ1LDI5OTIyMDAxNzEsMjM4NzAzNjEwNSw0MjI2ODcxMzA3LDExMDE5MDEyOTIsMzAxNzA2OTY3MSwxNjA0NDk0MDc3LDExNjkxNDE3MzgsNTk3NDY2MzAzLDE0MDMyOTkwNjMsMzgzMjcwNTY4NiwyNjEzMTAwNjM1LDE5NzQ5NzQ0MDIsMzc5MTUxOTAwNCwxMDMzMDgxNzc0LDEyNzc1Njg2MTgsMTgxNTQ5MjE4NiwyMTE4MDc0MTc3LDQxMjY2Njg1NDYsMjIxMTIzNjk0MywxNzQ4MjUxNzQwLDEzNjk4MTA0MjAsMzUyMTUwNDU2NCw0MTkzMzgyNjY0LDM3OTkwODU0NTksMjg4MzExNTEyMywxNjQ3MzkxMDU5LDcwNjAyNDc2NywxMzQ0ODA5MDgsMjUxMjg5Nzg3NCwxMTc2NzA3OTQxLDI2NDY4NTI0NDYsODA2ODg1NDE2LDkzMjYxNTg0MSwxNjgxMDExMzUsNzk4NjYxMzAxLDIzNTM0MTU3Nyw2MDUxNjQwODYsNDYxNDA2MzYzLDM3NTYxODgyMjEsMzQ1NDc5MDQzOCwxMzExMTg4ODQxLDIxNDI0MTc2MTMsMzkzMzU2NjM2NywzMDI1ODIwNDMsNDk1MTU4MTc0LDE0NzkyODk5NzIsODc0MTI1ODcwLDkwNzc0NjA5MywzNjk4MjI0ODE4LDMwMjU4MjAzOTgsMTUzNzI1MzYyNywyNzU2ODU4NjE0LDE5ODM1OTMyOTMsMzA4NDMxMDExMywyMTA4OTI4OTc0LDEzNzg0MjkzMDcsMzcyMjY5OTU4MiwxNTgwMTUwNjQxLDMyNzQ1MTc5OSwyNzkwNDc4ODM3LDMxMTc1MzU1OTIsMCwzMjUzNTk1NDM2LDEwNzU4NDcyNjQsMzgyNTAwNzY0NywyMDQxNjg4NTIwLDMwNTk0NDA2MjEsMzU2Mzc0MzkzNCwyMzc4OTQzMzAyLDE3NDA1NTM5NDUsMTkxNjM1Mjg0MywyNDg3ODk2Nzk4LDI1NTUxMzcyMzYsMjk1ODU3OTk0NCwyMjQ0OTg4NzQ2LDMxNTEwMjQyMzUsMzMyMDgzNTg4MiwxMzM2NTg0OTMzLDM5OTI3MTQwMDYsMjI1MjU1NTIwNSwyNTg4NzU3NDYzLDE3MTQ2MzE1MDksMjkzOTYzMTU2LDIzMTk3OTU2NjMsMzkyNTQ3MzU1Miw2NzI0MDQ1NCw0MjY5NzY4NTc3LDI2ODk2MTgxNjAsMjAxNzIxMzUwOCw2MzEyMTgxMDYsMTI2OTM0NDQ4MywyNzIzMjM4Mzg3LDE1NzEwMDU0MzgsMjE1MTY5NDUyOCw5MzI5NDQ3NCwxMDY2NTcwNDEzLDU2Mzk3NzY2MCwxODgyNzMyNjE2LDQwNTk0MjgxMDAsMTY3MzMxMzUwMywyMDA4NDYzMDQxLDI5NTAzNTU1NzMsMTEwOTQ2NzQ5MSw1Mzc5MjM2MzIsMzg1ODc1OTQ1MCw0MjYwNjIzMTE4LDMyMTgyNjQ2ODUsMjE3Nzc0ODMwMCw0MDM0NDI3MDgsNjM4Nzg0MzA5LDMyODcwODQwNzksMzE5MzkyMTUwNSw4OTkxMjcyMDIsMjI4NjE3NTQzNiw3NzMyNjUyMDksMjQ3OTE0NjA3MSwxNDM3MDUwODY2LDQyMzYxNDgzNTQsMjA1MDgzMzczNSwzMzYyMDIyNTcyLDMxMjY2ODEwNjMsODQwNTA1NjQzLDM4NjYzMjU5MDksMzIyNzU0MTY2NCw0Mjc5MTc3MjAsMjY1NTk5NzkwNSwyNzQ5MTYwNTc1LDExNDMwODc3MTgsMTQxMjA0OTUzNCw5OTkzMjk5NjMsMTkzNDk3MjE5LDIzNTM0MTU4ODIsMzM1NDMyNDUyMSwxODA3MjY4MDUxLDY3MjQwNDU0MCwyODE2NDAxMDE3LDMxNjAzMDEyODIsMzY5ODIyNDkzLDI5MTY4NjY5MzQsMzY4ODk0Nzc3MSwxNjgxMDExMjg2LDE5NDk5NzMwNzAsMzM2MjAyMjcwLDI0NTQyNzY1NzEsMjAxNzIxMzU0LDEyMTAzMjgxNzIsMzA5MzA2MDgzNiwyNjgwMzQxMDg1LDMxODQ3NzYwNDYsMTEzNTM4OTkzNSwzMjk0NzgyMTE4LDk2NTg0MTMyMCw4MzE4ODY3NTYsMzU1NDk5MzIwNyw0MDY4MDQ3MjQzLDM1ODg3NDUwMTAsMjM0NTE5MTQ5MSwxODQ5MTEyNDA5LDM2NjQ2MDQ1OTksMjYwNTQwMjgsMjk4MzU4MTAyOCwyNjIyMzc3NjgyLDEyMzU4NTU4NDAsMzYzMDk4NDM3MiwyODkxMzM5NTE0LDQwOTI5MTY3NDMsMzQ4ODI3OTA3NywzMzk1NjQyNzk5LDQxMDE2Njc0NzAsMTIwMjYzMDM3NywyNjg5NjE4MTYsMTg3NDUwODUwMSw0MDM0NDI3MDE2LDEyNDM5NDgzOTksMTU0NjUzMDQxOCw5NDEzNjYzMDgsMTQ3MDUzOTUwNSwxOTQxMjIyNTk5LDI1NDYzODY1MTMsMzQyMTAzODYyNywyNzE1NjcxOTMyLDM4OTk5NDYxNDAsMTA0MjIyNjk3NywyNTIxNTE3MDIxLDE2Mzk4MjQ4NjAsMjI3MjQ5MDMwLDI2MDczNzY2OSwzNzY1NDY1MjMyLDIwODQ0NTM5NTQsMTkwNzczMzk1NiwzNDI5MjYzMDE4LDI0MjA2NTYzNDQsMTAwODYwNjc3LDQxNjAxNTcxODUsNDcwNjgzMTU0LDMyNjExNjE4OTEsMTc4MTg3MTk2NywyOTI0OTU5NzM3LDE3NzM3Nzk0MDgsMzk0NjkyMjQxLDI1Nzk2MTE5OTIsOTc0OTg2NTM1LDY2NDcwNjc0NSwzNjU1NDU5MTI4LDM5NTg5NjIxOTUsNzMxNDIwODUxLDU3MTU0Mzg1OSwzNTMwMTIzNzA3LDI4NDk2MjY0ODAsMTI2NzgzMTEzLDg2NTM3NTM5OSw3NjUxNzI2NjIsMTAwODYwNjc1NCwzNjEyMDM2MDIsMzM4NzU0OTk4NCwyMjc4NDc3Mzg1LDI4NTc3MTkyOTUsMTM0NDgwOTA4MCwyNzgyOTEyMzc4LDU5NTQyNjcxLDE1MDM3NjQ5ODQsMTYwMDA4NTc2LDQzNzA2MjkzNSwxNzA3MDY1MzA2LDM2MjIyMzM2NDksMjIxODkzNDk4MiwzNDk2NTAzNDgwLDIxODUzMTQ3NTUsNjk3OTMyMjA4LDE1MTI5MTAxOTksNTA0MzAzMzc3LDIwNzUxNzcxNjMsMjgyNDA5OTA2OCwxODQxMDE5ODYyLDczOTY0NDk4Nl07dmFyIFQyPVsyNzgxMjQyMjExLDIyMzA4NzczMDgsMjU4MjU0MjE5OSwyMzgxNzQwOTIzLDIzNDg3NzY4MiwzMTg0OTQ2MDI3LDI5ODQxNDQ3NTEsMTQxODgzOTQ5MywxMzQ4NDgxMDcyLDUwNDYyOTc3LDI4NDg4NzYzOTEsMjEwMjc5OTE0Nyw0MzQ2MzQ0OTQsMTY1NjA4NDQzOSwzODYzODQ5ODk5LDI1OTkxODgwODYsMTE2NzA1MTQ2NiwyNjM2MDg3OTM4LDEwODI3NzE5MTMsMjI4MTM0MDI4NSwzNjgwNDg4OTAsMzk1NDMzNDA0MSwzMzgxNTQ0Nzc1LDIwMTA2MDU5MiwzOTYzNzI3Mjc3LDE3Mzk4Mzg2NzYsNDI1MDkwMzIwMiwzOTMwNDM1NTAzLDMyMDY3ODIxMDgsNDE0OTQ1Mzk4OCwyNTMxNTUzOTA2LDE1MzY5MzQwODAsMzI2MjQ5NDY0Nyw0ODQ1NzI2NjksMjkyMzI3MTA1OSwxNzgzMzc1Mzk4LDE1MTcwNDEyMDYsMTA5ODc5Mjc2Nyw0OTY3NDIzMSwxMzM0MDM3NzA4LDE1NTAzMzI5ODAsNDA5ODk5MTUyNSw4ODYxNzExMDksMTUwNTk4MTI5LDI0ODEwOTA5MjksMTk0MDY0MjAwOCwxMzk4OTQ0MDQ5LDEwNTk3MjI1MTcsMjAxODUxOTA4LDEzODU1NDc3MTksMTY5OTA5NTMzMSwxNTg3Mzk3NTcxLDY3NDI0MDUzNiwyNzA0Nzc0ODA2LDI1MjMxNDg4NSwzMDM5Nzk1ODY2LDE1MTkxNDI0Nyw5MDgzMzM1ODYsMjYwMjI3MDg0OCwxMDM4MDgyNzg2LDY1MTAyOTQ4MywxNzY2NzI5NTExLDM0NDc2OTgwOTgsMjY4Mjk0MjgzNyw0NTQxNjY3OTMsMjY1MjczNDMzOSwxOTUxOTM1NTMyLDc3NTE2NjQ5MCw3NTg1MjA2MDMsMzAwMDc5MDYzOCw0MDA0Nzk3MDE4LDQyMTcwODYxMTIsNDEzNzk2NDExNCwxMjk5NTk0MDQzLDE2Mzk0MzgwMzgsMzQ2NDM0NDQ5OSwyMDY4OTgyMDU3LDEwNTQ3MjkxODcsMTkwMTk5Nzg3MSwyNTM0NjM4NzI0LDQxMjEzMTgyMjcsMTc1NzAwODMzNywwLDc1MDkwNjg2MSwxNjE0ODE1MjY0LDUzNTAzNTEzMiwzMzYzNDE4NTQ1LDM5ODgxNTExMzEsMzIwMTU5MTkxNCwxMTgzNjk3ODY3LDM2NDc0NTQ5MTAsMTI2NTc3Njk1MywzNzM0MjYwMjk4LDM1NjY3NTA3OTYsMzkwMzg3MTA2NCwxMjUwMjgzNDcxLDE4MDc0NzA4MDAsNzE3NjE1MDg3LDM4NDcyMDM0OTgsMzg0Njk1MjkxLDMzMTM5MTA1OTUsMzYxNzIxMzc3MywxNDMyNzYxMTM5LDI0ODQxNzYyNjEsMzQ4MTk0NTQxMywyODM3NjkzMzcsMTAwOTI1OTU0LDIxODA5Mzk2NDcsNDAzNzAzODE2MCwxMTQ4NzMwNDI4LDMxMjMwMjc4NzEsMzgxMzM4NjQwOCw0MDg3NTAxMTM3LDQyNjc1NDk2MDMsMzIyOTYzMDUyOCwyMzE1NjIwMjM5LDI5MDY2MjQ2NTgsMzE1NjMxOTY0NSwxMjE1MzEzOTc2LDgyOTY2MDA1LDM3NDc4NTU1NDgsMzI0NTg0ODI0NiwxOTc0NDU5MDk4LDE2NjUyNzgyNDEsODA3NDA3NjMyLDQ1MTI4MDg5NSwyNTE1MjQwODMsMTg0MTI4Nzg5MCwxMjgzNTc1MjQ1LDMzNzEyMDI2OCw4OTE2ODc2OTksODAxMzY5MzI0LDM3ODczNDk4NTUsMjcyMTQyMTIwNywzNDMxNDgyNDM2LDk1OTMyMTg3OSwxNDY5MzAxOTU2LDQwNjU2OTk3NTEsMjE5NzU4NTUzNCwxMTk5MTkzNDA1LDI4OTg4MTQwNTIsMzg4Nzc1MDQ5Myw3MjQ3MDM1MTMsMjUxNDkwODAxOSwyNjk2OTYyMTQ0LDI1NTE4MDgzODUsMzUxNjgxMzEzNSwyMTQxNDQ1MzQwLDE3MTU3NDEyMTgsMjExOTQ0NTAzNCwyODcyODA3NTY4LDIxOTg1NzExNDQsMzM5ODE5MDY2Miw3MDA5Njg2ODYsMzU0NzA1MjIxNiwxMDA5MjU5NTQwLDIwNDEwNDQ3MDIsMzgwMzk5NTc0Miw0ODc5ODM4ODMsMTk5MTEwNTQ5OSwxMDA0MjY1Njk2LDE0NDk0MDcwMjYsMTMxNjIzOTkzMCw1MDQ2Mjk3NzAsMzY4Mzc5NzMyMSwxNjg1NjAxMzQsMTgxNjY2NzE3MiwzODM3Mjg3NTE2LDE1NzA3NTExNzAsMTg1NzkzNDI5MSw0MDE0MTg5NzQwLDI3OTc4ODgwOTgsMjgyMjM0NTEwNSwyNzU0NzEyOTgxLDkzNjYzMzU3MiwyMzQ3OTIzODMzLDg1Mjg3OTMzNSwxMTMzMjM0Mzc2LDE1MDAzOTUzMTksMzA4NDU0NTM4OSwyMzQ4OTEyMDEzLDE2ODkzNzYyMTMsMzUzMzQ1OTAyMiwzNzYyOTIzOTQ1LDMwMzQwODI0MTIsNDIwNTU5ODI5NCwxMzM0Mjg0NjgsNjM0MzgzMDgyLDI5NDkyNzcwMjksMjM5ODM4NjgxMCwzOTEzNzg5MTAyLDQwMzcwMzgxNiwzNTgwODY5MzA2LDIyOTc0NjA4NTYsMTg2NzEzMDE0OSwxOTE4NjQzNzU4LDYwNzY1Njk4OCw0MDQ5MDUzMzUwLDMzNDYyNDg4ODQsMTM2ODkwMTMxOCw2MDA1NjU5OTIsMjA5MDk4Mjg3NywyNjMyNDc5ODYwLDU1NzcxOTMyNywzNzE3NjE0NDExLDM2OTczOTMwODUsMjI0OTAzNDYzNSwyMjMyMzg4MjM0LDI0MzA2Mjc5NTIsMTExNTQzODY1NCwzMjk1Nzg2NDIxLDI4NjU1MjIyNzgsMzYzMzMzNDM0NCw4NDI4MDA2NywzMzAyNzgzMCwzMDM4Mjg0OTQsMjc0NzQyNTEyMSwxNjAwNzk1OTU3LDQxODg5NTI0MDcsMzQ5NjU4OTc1MywyNDM0MjM4MDg2LDE0ODY0NzE2MTcsNjU4MTE5OTY1LDMxMDYzODE0NzAsOTUzODAzMjMzLDMzNDIzMTgwMCwzMDA1OTc4Nzc2LDg1Nzg3MDYwOSwzMTUxMTI4OTM3LDE4OTAxNzk1NDUsMjI5ODk3MzgzOCwyODA1MTc1NDQ0LDMwNTY0NDIyNjcsNTc0MzY1MjE0LDI0NTA4ODQ0ODcsNTUwMTAzNTI5LDEyMzM2MzcwNzAsNDI4OTM1MzA0NSwyMDE4NTE5MDgwLDIwNTc2OTExMDMsMjM5OTM3NDQ3Niw0MTY2NjIzNjQ5LDIxNDgxMDg2ODEsMzg3NTgzMjQ1LDM2NjQxMDEzMTEsODM2MjMyOTM0LDMzMzA1NTY0ODIsMzEwMDY2NTk2MCwzMjgwMDkzNTA1LDI5NTU1MTYzMTMsMjAwMjM5ODUwOSwyODcxODI2MDcsMzQxMzg4MTAwOCw0MjM4ODkwMDY4LDM1OTc1MTU3MDcsOTc1OTY3NzY2XTt2YXIgVDM9WzE2NzE4MDg2MTEsMjA4OTA4OTE0OCwyMDA2NTc2NzU5LDIwNzI5MDEyNDMsNDA2MTAwMzc2MiwxODA3NjAzMzA3LDE4NzM5Mjc3OTEsMzMxMDY1Mzg5Myw4MTA1NzM4NzIsMTY5NzQzMzcsMTczOTE4MTY3MSw3Mjk2MzQzNDcsNDI2MzExMDY1NCwzNjEzNTcwNTE5LDI4ODM5OTcwOTksMTk4OTg2NDU2NiwzMzkzNTU2NDI2LDIxOTEzMzUyOTgsMzM3NjQ0OTk5MywyMTA2MDYzNDg1LDQxOTU3NDE2OTAsMTUwODYxODg0MSwxMjA0MzkxNDk1LDQwMjczMTcyMzIsMjkxNzk0MTY3NywzNTYzNTY2MDM2LDI3MzQ1MTQwODIsMjk1MTM2NjA2MywyNjI5NzcyMTg4LDI3Njc2NzIyMjgsMTkyMjQ5MTUwNiwzMjI3MjI5MTIwLDMwODI5NzQ2NDcsNDI0NjUyODUwOSwyNDc3NjY5Nzc5LDY0NDUwMDUxOCw5MTE4OTU2MDYsMTA2MTI1Njc2Nyw0MTQ0MTY2MzkxLDM0Mjc3NjMxNDgsODc4NDcxMjIwLDI3ODQyNTIzMjUsMzg0NTQ0NDA2OSw0MDQzODk3MzI5LDE5MDU1MTcxNjksMzYzMTQ1OTI4OCw4Mjc1NDgyMDksMzU2NDYxMDc3LDY3ODk3MzQ4LDMzNDQwNzgyNzksNTkzODM5NjUxLDMyNzc3NTc4OTEsNDA1Mjg2OTM2LDI1MjcxNDc5MjYsODQ4NzE2ODUsMjU5NTU2NTQ2NiwxMTgwMzM5MjcsMzA1NTM4MDY2LDIxNTc2NDg3NjgsMzc5NTcwNTgyNiwzOTQ1MTg4ODQzLDY2MTIxMjcxMSwyOTk5ODEyMDE4LDE5NzM0MTQ1MTcsMTUyNzY5MDMzLDIyMDgxNzc1MzksNzQ1ODIyMjUyLDQzOTIzNTYxMCw0NTU5NDc4MDMsMTg1NzIxNTU5OCwxNTI1NTkzMTc4LDI3MDA4Mjc1NTIsMTM5MTg5NTYzNCw5OTQ5MzIyODMsMzU5NjcyODI3OCwzMDE2NjU0MjU5LDY5NTk0NzgxNywzODEyNTQ4MDY3LDc5NTk1ODgzMSwyMjI0NDkzNDQ0LDE0MDg2MDc4MjcsMzUxMzMwMTQ1NywwLDM5NzkxMzM0MjEsNTQzMTc4Nzg0LDQyMjk5NDg0MTIsMjk4MjcwNTU4NSwxNTQyMzA1MzcxLDE3OTA4OTExMTQsMzQxMDM5ODY2NywzMjAxOTE4OTEwLDk2MTI0NTc1MywxMjU2MTAwOTM4LDEyODkwMDEwMzYsMTQ5MTY0NDUwNCwzNDc3NzY3NjMxLDM0OTY3MjEzNjAsNDAxMjU1NzgwNywyODY3MTU0ODU4LDQyMTI1ODM5MzEsMTEzNzAxODQzNSwxMzA1OTc1MzczLDg2MTIzNDczOSwyMjQxMDczNTQxLDExNzEyMjkyNTMsNDE3ODYzNTI1NywzMzk0ODY3NCwyMTM5MjI1NzI3LDEzNTc5NDY5NjAsMTAxMTEyMDE4OCwyNjc5Nzc2NjcxLDI4MzM0NjgzMjgsMTM3NDkyMTI5NywyNzUxMzU2MzIzLDEwODYzNTc1NjgsMjQwODE4NzI3OSwyNDYwODI3NTM4LDI2NDYzNTIyODUsOTQ0MjcxNDE2LDQxMTA3NDIwMDUsMzE2ODc1NjY2OCwzMDY2MTMyNDA2LDM2NjUxNDU4MTgsNTYwMTUzMTIxLDI3MTU4OTM5Miw0Mjc5OTUyODk1LDQwNzc4NDYwMDMsMzUzMDQwNzg5MCwzNDQ0MzQzMjQ1LDIwMjY0MzQ2OCwzMjIyNTAyNTksMzk2MjU1MzMyNCwxNjA4NjI5ODU1LDI1NDM5OTAxNjcsMTE1NDI1NDkxNiwzODk2MjMzMTksMzI5NDA3Mzc5NiwyODE3Njc2NzExLDIxMjI1MTM1MzQsMTAyODA5NDUyNSwxNjg5MDQ1MDkyLDE1NzU0Njc2MTMsNDIyMjYxMjczLDE5MzkyMDM2OTksMTYyMTE0Nzc0NCwyMTc0MjI4ODY1LDEzMzkxMzc2MTUsMzY5OTM1MjU0MCw1NzcxMjc0NTgsNzEyOTIyMTU0LDI0MjcxNDEwMDgsMjI5MDI4OTU0NCwxMTg3Njc5MzAyLDM5OTU3MTU1NjYsMzEwMDg2MzQxNiwzMzk0ODY3NDAsMzczMjUxNDc4MiwxNTkxOTE3NjYyLDE4NjQ1NTU2MywzNjgxOTg4MDU5LDM3NjIwMTkyOTYsODQ0NTIyNTQ2LDk3ODIyMDA5MCwxNjk3NDMzNzAsMTIzOTEyNjYwMSwxMDEzMjE3MzQsNjExMDc2MTMyLDE1NTg0OTMyNzYsMzI2MDkxNTY1MCwzNTQ3MjUwMTMxLDI5MDEzNjE1ODAsMTY1NTA5NjQxOCwyNDQzNzIxMTA1LDI1MTA1NjU3ODEsMzgyODg2Mzk3MiwyMDM5MjE0NzEzLDM4Nzg4Njg0NTUsMzM1OTg2OTg5Niw5Mjg2MDc3OTksMTg0MDc2NTU0OSwyMzc0NzYyODkzLDM1ODAxNDYxMzMsMTMyMjQyNTQyMiwyODUwMDQ4NDI1LDE4MjM3OTEyMTIsMTQ1OTI2ODY5NCw0MDk0MTYxOTA4LDM5MjgzNDY2MDIsMTcwNjAxOTQyOSwyMDU2MTg5MDUwLDI5MzQ1MjM4MjIsMTM1Nzk0Njk2LDMxMzQ1NDk5NDYsMjAyMjI0MDM3Niw2MjgwNTA0NjksNzc5MjQ2NjM4LDQ3MjEzNTcwOCwyODAwODM0NDcwLDMwMzI5NzAxNjQsMzMyNzIzNjAzOCwzODk0NjYwMDcyLDM3MTU5MzI2MzcsMTk1NjQ0MDE4MCw1MjIyNzIyODcsMTI3MjgxMzEzMSwzMTg1MzM2NzY1LDIzNDA4MTgzMTUsMjMyMzk3NjA3NCwxODg4NTQyODMyLDEwNDQ1NDQ1NzQsMzA0OTU1MDI2MSwxNzIyNDY5NDc4LDEyMjIxNTIyNjQsNTA2NjA4NjcsNDEyNzMyNDE1MCwyMzYwNjc4NTQsMTYzODEyMjA4MSw4OTU0NDU1NTcsMTQ3NTk4MDg4NywzMTE3NDQzNTEzLDIyNTc2NTU2ODYsMzI0MzgwOTIxNyw0ODkxMTAwNDUsMjY2MjkzNDQzMCwzNzc4NTk5MzkzLDQxNjIwNTUxNjAsMjU2MTg3ODkzNiwyODg1NjM3MjksMTc3MzkxNjc3NywzNjQ4MDM5Mzg1LDIzOTEzNDUwMzgsMjQ5Mzk4NTY4NCwyNjEyNDA3NzA3LDUwNTU2MDA5NCwyMjc0NDk3OTI3LDM5MTEyNDAxNjksMzQ2MDkyNTM5MCwxNDQyODE4NjQ1LDY3ODk3MzQ4MCwzNzQ5MzU3MDIzLDIzNTgxODI3OTYsMjcxNzQwNzY0OSwyMzA2ODY5NjQxLDIxOTYxNzgwNSwzMjE4NzYxMTUxLDM4NjIwMjYyMTQsMTEyMDMwNjI0MiwxNzU2OTQyNDQwLDExMDMzMzE5MDUsMjU3ODQ1OTAzMyw3NjI3OTY1ODksMjUyNzgwMDQ3LDI5NjYxMjU0ODgsMTQyNTg0NDMwOCwzMTUxMzkyMTg3LDM3MjkxMTEyNl07dmFyIFQ0PVsxNjY3NDc0ODg2LDIwODg1MzUyODgsMjAwNDMyNjg5NCwyMDcxNjk0ODM4LDQwNzU5NDk1NjcsMTgwMjIyMzA2MiwxODY5NTkxMDA2LDMzMTgwNDM3OTMsODA4NDcyNjcyLDE2ODQzNTIyLDE3MzQ4NDY5MjYsNzI0MjcwNDIyLDQyNzgwNjU2MzksMzYyMTIxNjk0OSwyODgwMTY5NTQ5LDE5ODc0ODQzOTYsMzQwMjI1MzcxMSwyMTg5NTk3OTgzLDMzODU0MDk2NzMsMjEwNTM3ODgxMCw0MjEwNjkzNjE1LDE0OTkwNjUyNjYsMTE5NTg4Njk5MCw0MDQyMjYzNTQ3LDI5MTM4NTY1NzcsMzU3MDY4OTk3MSwyNzI4NTkwNjg3LDI5NDc1NDE1NzMsMjYyNzUxODI0MywyNzYyMjc0NjQzLDE5MjAxMTIzNTYsMzIzMzgzMTgzNSwzMDgyMjczMzk3LDQyNjEyMjM2NDksMjQ3NTkyOTE0OSw2NDAwNTE3ODgsOTA5NTMxNzU2LDEwNjExMTAxNDIsNDE2MDE2MDUwMSwzNDM1OTQxNzYzLDg3NTg0Njc2MCwyNzc5MTE2NjI1LDM4NTcwMDM3MjksNDA1OTEwNTUyOSwxOTAzMjY4ODM0LDM2MzgwNjQwNDMsODI1MzE2MTk0LDM1MzcxMzk2Miw2NzM3NDA4OCwzMzUxNzI4Nzg5LDU4OTUyMjI0NiwzMjg0MzYwODYxLDQwNDIzNjMzNiwyNTI2NDU0MDcxLDg0MjE3NjEwLDI1OTM4MzAxOTEsMTE3OTAxNTgyLDMwMzE4MzM5NiwyMTU1OTExOTYzLDM4MDY0Nzc3OTEsMzk1ODA1NjY1Myw2NTY4OTQyODYsMjk5ODA2MjQ2MywxOTcwNjQyOTIyLDE1MTU5MTY5OCwyMjA2NDQwOTg5LDc0MTExMDg3Miw0Mzc5MjMzODAsNDU0NzY1ODc4LDE4NTI3NDg1MDgsMTUxNTkwODc4OCwyNjk0OTA0NjY3LDEzODExNjg4MDQsOTkzNzQyMTk4LDM2MDQzNzM5NDMsMzAxNDkwNTQ2OSw2OTA1ODQ0MDIsMzgyMzMyMDc5Nyw3OTE2MzgzNjYsMjIyMzI4MTkzOSwxMzk4MDExMzAyLDM1MjAxNjE5NzcsMCwzOTkxNzQzNjgxLDUzODk5MjcwNCw0MjQ0MzgxNjY3LDI5ODEyMTg0MjUsMTUzMjc1MTI4NiwxNzg1MzgwNTY0LDM0MTkwOTY3MTcsMzIwMDE3ODUzNSw5NjAwNTYxNzgsMTI0NjQyMDYyOCwxMjgwMTAzNTc2LDE0ODIyMjE3NDQsMzQ4NjQ2ODc0MSwzNTAzMzE5OTk1LDQwMjU0Mjg2NzcsMjg2MzMyNjU0Myw0MjI3NTM2NjIxLDExMjg1MTQ5NTAsMTI5Njk0NzA5OCw4NTkwMDIyMTQsMjI0MDEyMzkyMSwxMTYyMjAzMDE4LDQxOTM4NDk1NzcsMzM2ODcwNDQsMjEzOTA2Mjc4MiwxMzQ3NDgxNzYwLDEwMTA1ODI2NDgsMjY3ODA0NTIyMSwyODI5NjQwNTIzLDEzNjQzMjUyODIsMjc0NTQzMzY5MywxMDc3OTg1NDA4LDI0MDg1NDg4NjksMjQ1OTA4NjE0MywyNjQ0MzYwMjI1LDk0MzIxMjY1Niw0MTI2NDc1NTA1LDMxNjY0OTQ1NjMsMzA2NTQzMDM5MSwzNjcxNzUwMDYzLDU1NTgzNjIyNiwyNjk0OTYzNTIsNDI5NDkwODY0NSw0MDkyNzkyNTczLDM1MzcwMDYwMTUsMzQ1Mjc4Mzc0NSwyMDIxMTgxNjgsMzIwMDI1ODk0LDM5NzQ5MDE2OTksMTYwMDExOTIzMCwyNTQzMjk3MDc3LDExNDUzNTk0OTYsMzg3Mzk3OTM0LDMzMDEyMDE4MTEsMjgxMjgwMTYyMSwyMTIyMjIwMjg0LDEwMjc0MjYxNzAsMTY4NDMxOTQzMiwxNTY2NDM1MjU4LDQyMTA3OTg1OCwxOTM2OTU0ODU0LDE2MTY5NDUzNDQsMjE3Mjc1Mzk0NSwxMzMwNjMxMDcwLDM3MDU0MzgxMTUsNTcyNjc5NzQ4LDcwNzQyNzkyNCwyNDI1NDAwMTIzLDIyOTA2NDc4MTksMTE3OTA0NDQ5Miw0MDA4NTg1NjcxLDMwOTkxMjA0OTEsMzM2ODcwNDQwLDM3MzkxMjIwODcsMTU4MzI3NjczMiwxODUyNzc3MTgsMzY4ODU5MzA2OSwzNzcyNzkxNzcxLDg0MjE1OTcxNiw5NzY4OTk3MDAsMTY4NDM1MjIwLDEyMjk1NzcxMDYsMTAxMDU5MDg0LDYwNjM2Njc5MiwxNTQ5NTkxNzM2LDMyNjc1MTc4NTUsMzU1Mzg0OTAyMSwyODk3MDE0NTk1LDE2NTA2MzIzODgsMjQ0MjI0MjEwNSwyNTA5NjEyMDgxLDM4NDAxNjE3NDcsMjAzODAwODgxOCwzODkwNjg4NzI1LDMzNjg1Njc2OTEsOTI2Mzc0MjU0LDE4MzU5MDcwMzQsMjM3NDg2Mzg3MywzNTg3NTMxOTUzLDEzMTM3ODg1NzIsMjg0NjQ4MjUwNSwxODE5MDYzNTEyLDE0NDg1NDA4NDQsNDEwOTYzMzUyMywzOTQxMjEzNjQ3LDE3MDExNjI5NTQsMjA1NDg1MjM0MCwyOTMwNjk4NTY3LDEzNDc0ODE3NiwzMTMyODA2NTExLDIwMjExNjUyOTYsNjIzMjEwMzE0LDc3NDc5NTg2OCw0NzE2MDYzMjgsMjc5NTk1ODYxNSwzMDMxNzQ2NDE5LDMzMzQ4ODU3ODMsMzkwNzUyNzYyNywzNzIyMjgwMDk3LDE5NTM3OTk0MDAsNTIyMTMzODIyLDEyNjMyNjMxMjYsMzE4MzMzNjU0NSwyMzQxMTc2ODQ1LDIzMjQzMzM4MzksMTg4NjQyNTMxMiwxMDQ0MjY3NjQ0LDMwNDg1ODg0MDEsMTcxODAwNDQyOCwxMjEyNzMzNTg0LDUwNTI5NTQyLDQxNDMzMTc0OTUsMjM1ODAzMTY0LDE2MzM3ODg4NjYsODkyNjkwMjgyLDE0NjUzODMzNDIsMzExNTk2MjQ3MywyMjU2OTY1OTExLDMyNTA2NzM4MTcsNDg4NDQ5ODUwLDI2NjEyMDIyMTUsMzc4OTYzMzc1Myw0MTc3MDA3NTk1LDI1NjAxNDQxNzEsMjg2MzM5ODc0LDE3Njg1MzcwNDIsMzY1NDkwNjAyNSwyMzkxNzA1ODYzLDI0OTI3NzAwOTksMjYxMDY3MzE5Nyw1MDUyOTEzMjQsMjI3MzgwODkxNywzOTI0MzY5NjA5LDM0Njk2MjU3MzUsMTQzMTY5OTM3MCw2NzM3NDA4ODAsMzc1NTk2NTA5MywyMzU4MDIxODkxLDI3MTE3NDY2NDksMjMwNzQ4OTgwMSwyMTg5NjE2OTAsMzIxNzAyMTU0MSwzODczODQ1NzE5LDExMTE2NzI0NTIsMTc1MTY5MzUyMCwxMDk0ODI4OTMwLDI1NzY5ODYxNTMsNzU3OTU0Mzk0LDI1MjY0NTY2MiwyOTY0Mzc2NDQzLDE0MTQ4NTU4NDgsMzE0OTY0OTUxNywzNzA1NTU0MzZdO3ZhciBUNT1bMTM3NDk4ODExMiwyMTE4MjE0OTk1LDQzNzc1NzEyMyw5NzU2NTg2NDYsMTAwMTA4OTk5NSw1MzA0MDA3NTMsMjkwMjA4Nzg1MSwxMjczMTY4Nzg3LDU0MDA4MDcyNSwyOTEwMjE5NzY2LDIyOTUxMDEwNzMsNDExMDU2ODQ4NSwxMzQwNDYzMTAwLDMzMDc5MTYyNDcsNjQxMDI1MTUyLDMwNDMxNDA0OTUsMzczNjE2NDkzNyw2MzI5NTM3MDMsMTE3Mjk2NzA2NCwxNTc2OTc2NjA5LDMyNzQ2NjcyNjYsMjE2OTMwMzA1OCwyMzcwMjEzNzk1LDE4MDkwNTQxNTAsNTk3Mjc4NDcsMzYxOTI5ODc3LDMyMTE2MjMxNDcsMjUwNTIwMjEzOCwzNTY5MjU1MjEzLDE0ODQwMDU4NDMsMTIzOTQ0Mzc1MywyMzk1NTg4Njc2LDE5NzU2ODM0MzQsNDEwMjk3NzkxMiwyNTcyNjk3MTk1LDY2NjQ2NDczMywzMjAyNDM3MDQ2LDQwMzU0ODkwNDcsMzM3NDM2MTcwMiwyMTEwNjY3NDQ0LDE2NzU1Nzc4ODAsMzg0MzY5OTA3NCwyNTM4NjgxMTg0LDE2NDk2MzkyMzcsMjk3NjE1MTUyMCwzMTQ0Mzk2NDIwLDQyNjk5MDc5OTYsNDE3ODA2MjIyOCwxODgzNzkzNDk2LDI0MDM3Mjg2NjUsMjQ5NzYwNDc0MywxMzgzODU2MzExLDI4NzY0OTQ2MjcsMTkxNzUxODU2MiwzODEwNDk2MzQzLDE3MTY4OTA0MTAsMzAwMTc1NTY1NSw4MDA0NDA4MzUsMjI2MTA4OTE3OCwzNTQzNTk5MjY5LDgwNzk2MjYxMCw1OTk3NjIzNTQsMzM3NzgzNjIsMzk3NzY3NTM1NiwyMzI4ODI4OTcxLDI4MDk3NzExNTQsNDA3NzM4NDQzMiwxMzE1NTYyMTQ1LDE3MDg4NDgzMzMsMTAxMDM5ODI5LDM1MDk4NzExMzUsMzI5OTI3ODQ3NCw4NzU0NTEyOTMsMjczMzg1NjE2MCw5Mjk4NzY5OCwyNzY3NjQ1NTU3LDE5MzE5NTA2NSwxMDgwMDk0NjM0LDE1ODQ1MDQ1ODIsMzE3ODEwNjk2MSwxMDQyMzg1NjU3LDI1MzEwNjc0NTMsMzcxMTgyOTQyMiwxMzA2OTY3MzY2LDI0MzgyMzc2MjEsMTkwODY5NDI3Nyw2NzU1NjQ2MywxNjE1ODYxMjQ3LDQyOTQ1NjE2NCwzNjAyNzcwMzI3LDIzMDI2OTAyNTIsMTc0MjMxNTEyNywyOTY4MDExNDUzLDEyNjQ1NDY2NCwzODc3MTk4NjQ4LDIwNDMyMTE0ODMsMjcwOTI2MDg3MSwyMDg0NzA0MjMzLDQxNjk0MDgyMDEsMCwxNTk0MTc5ODcsODQxNzM5NTkyLDUwNDQ1OTQzNiwxODE3ODY2ODMwLDQyNDU2MTg2ODMsMjYwMzg4OTUwLDEwMzQ4Njc5OTgsOTA4OTMzNDE1LDE2ODgxMDg1MiwxNzUwOTAyMzA1LDI2MDY0NTM5NjksNjA3NTMwNTU0LDIwMjAwODQ5NywyNDcyMDExNTM1LDMwMzU1MzUwNTgsNDYzMTgwMTkwLDIxNjAxMTcwNzEsMTY0MTgxNjIyNiwxNTE3NzY3NTI5LDQ3MDk0ODM3NCwzODAxMzMyMjM0LDMyMzE3MjIyMTMsMTAwODkxODU5NSwzMDM3NjUyNzcsMjM1NDc0MTg3LDQwNjkyNDY4OTMsNzY2OTQ1NDY1LDMzNzU1Mzg2NCwxNDc1NDE4NTAxLDI5NDM2ODIzODAsNDAwMzA2MTE3OSwyNzQzMDM0MTA5LDQxNDQwNDc3NzUsMTU1MTAzNzg4NCwxMTQ3NTUwNjYxLDE1NDMyMDg1MDAsMjMzNjQzNDU1MCwzNDA4MTE5NTE2LDMwNjkwNDk5NjAsMzEwMjAxMTc0NywzNjEwMzY5MjI2LDExMTM4MTgzODQsMzI4NjcxODA4LDIyMjc1NzMwMjQsMjIzNjIyODczMywzNTM1NDg2NDU2LDI5MzU1NjY4NjUsMzM0MTM5NDI4NSw0OTY5MDYwNTksMzcwMjY2NTQ1OSwyMjY5MDY4NjAsMjAwOTE5NTQ3Miw3MzMxNTY5NzIsMjg0MjczNzA0OSwyOTQ5MzA2ODIsMTIwNjQ3Nzg1OCwyODM1MTIzMzk2LDI3MDAwOTkzNTQsMTQ1MTA0NDA1Niw1NzM4MDQ3ODMsMjI2OTcyODQ1NSwzNjQ0Mzc5NTg1LDIzNjIwOTAyMzgsMjU2NDAzMzMzNCwyODAxMTA3NDA3LDI3NzYyOTI5MDQsMzY2OTQ2MjU2NiwxMDY4MzUxMzk2LDc0MjAzOTAxMiwxMzUwMDc4OTg5LDE3ODQ2NjMxOTUsMTQxNzU2MTY5OCw0MTM2NDQwNzcwLDI0MzAxMjIyMTYsNzc1NTUwODE0LDIxOTM4NjI2NDUsMjY3MzcwNTE1MCwxNzc1Mjc2OTI0LDE4NzYyNDE4MzMsMzQ3NTMxMzMzMSwzMzY2NzU0NjE5LDI3MDA0MDQ4NywzOTAyNTYzMTgyLDM2NzgxMjQ5MjMsMzQ0MTg1MDM3NywxODUxMzMyODUyLDM5Njk1NjIzNjksMjIwMzAzMjIzMiwzODY4NTUyODA1LDI4Njg4OTc0MDYsNTY2MDIxODk2LDQwMTExOTA1MDIsMzEzNTc0MDg4OSwxMjQ4ODAyNTEwLDM5MzYyOTEyODQsNjk5NDMyMTUwLDgzMjg3NzIzMSw3MDg3ODA4NDksMzMzMjc0MDE0NCw4OTk4MzU1ODQsMTk1MTMxNzA0Nyw0MjM2NDI5OTkwLDM3Njc1ODY5OTIsODY2NjM3ODQ1LDQwNDM2MTAxODYsMTEwNjA0MTU5MSwyMTQ0MTYxODA2LDM5NTQ0MTcxMSwxOTg0ODEyNjg1LDExMzk3ODE3MDksMzQzMzcxMjk4MCwzODM1MDM2ODk1LDI2NjQ1NDM3MTUsMTI4MjA1MDA3NSwzMjQwODk0MzkyLDExODEwNDUxMTksMjY0MDI0MzIwNCwyNTk2NTkxNyw0MjAzMTgxMTcxLDQyMTE4MTg3OTgsMzAwOTg3OTM4NiwyNDYzODc5NzYyLDM5MTAxNjE5NzEsMTg0Mjc1OTQ0MywyNTk3ODA2NDc2LDkzMzMwMTM3MCwxNTA5NDMwNDE0LDM5NDM5MDY0NDEsMzQ2NzE5MjMwMiwzMDc2NjM5MDI5LDM3NzY3Njc0NjksMjA1MTUxODc4MCwyNjMxMDY1NDMzLDE0NDE5NTI1NzUsNDA0MDE2NzYxLDE5NDI0MzU3NzUsMTQwODc0OTAzNCwxNjEwNDU5NzM5LDM3NDUzNDUzMDAsMjAxNzc3ODU2NiwzNDAwNTI4NzY5LDMxMTA2NTA5NDIsOTQxODk2NzQ4LDMyNjU0Nzg3NTEsMzcxMDQ5MzMwLDMxNjg5MzcyMjgsNjc1MDM5NjI3LDQyNzkwODAyNTcsOTY3MzExNzI5LDEzNTA1MDIwNiwzNjM1NzMzNjYwLDE2ODM0MDcyNDgsMjA3NjkzNTI2NSwzNTc2ODcwNTEyLDEyMTUwNjExMDgsMzUwMTc0MTg5MF07dmFyIFQ2PVsxMzQ3NTQ4MzI3LDE0MDA3ODMyMDUsMzI3MzI2NzEwOCwyNTIwMzkzNTY2LDM0MDk2ODUzNTUsNDA0NTM4MDkzMywyODgwMjQwMjE2LDI0NzEyMjQwNjcsMTQyODE3MzA1MCw0MTM4NTYzMTgxLDI0NDE2NjE1NTgsNjM2ODEzOTAwLDQyMzMwOTQ2MTUsMzYyMDAyMjk4NywyMTQ5OTg3NjUyLDI0MTEwMjkxNTUsMTIzOTMzMTE2MiwxNzMwNTI1NzIzLDI1NTQ3MTg3MzQsMzc4MTAzMzY2NCw0NjM0NjEwMSwzMTA0NjM3MjgsMjc0Mzk0NDg1NSwzMzI4OTU1Mzg1LDM4NzU3NzAyMDcsMjUwMTIxODk3MiwzOTU1MTkxMTYyLDM2NjcyMTkwMzMsNzY4OTE3MTIzLDM1NDU3ODk0NzMsNjkyNzA3NDMzLDExNTAyMDg0NTYsMTc4NjEwMjQwOSwyMDI5MjkzMTc3LDE4MDUyMTE3MTAsMzcxMDM2ODExMywzMDY1OTYyODMxLDQwMTYzOTU5NywxNzI0NDU3MTMyLDMwMjgxNDM2NzQsNDA5MTk4NDEwLDIxOTYwNTI1MjksMTYyMDUyOTQ1OSwxMTY0MDcxODA3LDM3Njk3MjE5NzUsMjIyNjg3NTMxMCw0ODY0NDEzNzYsMjQ5OTM0ODUyMywxNDgzNzUzNTc2LDQyODgxOTk2NSwyMjc0NjgwNDI4LDMwNzU2MzYyMTYsNTk4NDM4ODY3LDM3OTkxNDExMjIsMTQ3NDUwMjU0Myw3MTEzNDk2NzUsMTI5MTY2MTIwLDUzNDU4MzcwLDI1OTI1MjM2NDMsMjc4MjA4MjgyNCw0MDYzMjQyMzc1LDI5ODg2ODcyNjksMzEyMDY5NDEyMiwxNTU5MDQxNjY2LDczMDUxNzI3NiwyNDYwNDQ5MjA0LDQwNDI0NTkxMjIsMjcwNjI3MDY5MCwzNDQ2MDA0NDY4LDM1NzM5NDE2OTQsNTMzODA0MTMwLDIzMjgxNDM2MTQsMjYzNzQ0MjY0MywyNjk1MDMzNjg1LDgzOTIyNDAzMywxOTczNzQ1Mzg3LDk1NzA1NTk4MCwyODU2MzQ1ODM5LDEwNjg1Mjc2NywxMzcxMzY4OTc2LDQxODE1OTg2MDIsMTAzMzI5NzE1OCwyOTMzNzM0OTE3LDExNzk1MTA0NjEsMzA0NjIwMDQ2MSw5MTM0MTkxNywxODYyNTM0ODY4LDQyODQ1MDIwMzcsNjA1NjU3MzM5LDI1NDc0MzI5MzcsMzQzMTU0Njk0NywyMDAzMjk0NjIyLDMxODI0ODc2MTgsMjI4MjE5NTMzOSw5NTQ2Njk0MDMsMzY4MjE5MTU5OCwxMjAxNzY1Mzg2LDM5MTcyMzQ3MDMsMzM4ODUwNzE2NiwwLDIxOTg0MzgwMjIsMTIxMTI0NzU5NywyODg3NjUxNjk2LDEzMTU3MjM4OTAsNDIyNzY2NTY2MywxNDQzODU3NzIwLDUwNzM1ODkzMyw2NTc4NjE5NDUsMTY3ODM4MTAxNyw1NjA0ODc1OTAsMzUxNjYxOTYwNCw5NzU0NTE2OTQsMjk3MDM1NjMyNywyNjEzMTQ1MzUsMzUzNTA3MjkxOCwyNjUyNjA5NDI1LDEzMzM4MzgwMjEsMjcyNDMyMjMzNiwxNzY3NTM2NDU5LDM3MDkzODM5NCwxODI2MjExMTQsMzg1NDYwNjM3OCwxMTI4MDE0NTYwLDQ4NzcyNTg0NywxODU0NjkxOTcsMjkxODM1Mzg2MywzMTA2NzgwODQwLDMzNTY3NjE3NjksMjIzNzEzMzA4MSwxMjg2NTY3MTc1LDMxNTI5NzYzNDksNDI1NTM1MDYyNCwyNjgzNzY1MDMwLDMxNjAxNzUzNDksMzMwOTU5NDE3MSw4Nzg0NDMzOTAsMTk4ODgzODE4NSwzNzA0MzAwNDg2LDE3NTY4MTg5NDAsMTY3MzA2MTYxNywzNDAzMTAwNjM2LDI3Mjc4NjMwOSwxMDc1MDI1Njk4LDU0NTU3MjM2OSwyMTA1ODg3MjY4LDQxNzQ1NjAwNjEsMjk2Njc5NzMwLDE4NDE3Njg4NjUsMTI2MDIzMjIzOSw0MDkxMzI3MDI0LDM5NjAzMDkzMzAsMzQ5NzUwOTM0NywxODE0ODAzMjIyLDI1NzgwMTg0ODksNDE5NTQ1NjA3Miw1NzUxMzgxNDgsMzI5OTQwOTAzNiw0NDY3NTQ4NzksMzYyOTU0Njc5Niw0MDExOTk2MDQ4LDMzNDc1MzIxMTAsMzI1MjIzODU0NSw0MjcwNjM5Nzc4LDkxNTk4NTQxOSwzNDgzODI1NTM3LDY4MTkzMzUzNCw2NTE4NjgwNDYsMjc1NTYzNjY3MSwzODI4MTAzODM3LDIyMzM3NzU1NCwyNjA3NDM5ODIwLDE2NDk3MDQ1MTgsMzI3MDkzNzg3NSwzOTAxODA2Nzc2LDE1ODAwODc3OTksNDExODk4NzY5NSwzMTk4MTE1MjAwLDIwODczMDk0NTksMjg0MjY3ODU3MywzMDE2Njk3MTA2LDEwMDMwMDcxMjksMjgwMjg0OTkxNywxODYwNzM4MTQ3LDIwNzc5NjUyNDMsMTY0NDM5NjcyLDQxMDA4NzI0NzIsMzIyODMzMTksMjgyNzE3Nzg4MiwxNzA5NjEwMzUwLDIxMjUxMzU4NDYsMTM2NDI4NzUxLDM4NzQ0MjgzOTIsMzY1MjkwNDg1OSwzNDYwOTg0NjMwLDM1NzIxNDU5MjksMzU5MzA1NjM4MCwyOTM5MjY2MjI2LDgyNDg1MjI1OSw4MTgzMjQ4ODQsMzIyNDc0MDQ1NCw5MzAzNjkyMTIsMjgwMTU2NjQxMCwyOTY3NTA3MTUyLDM1NTcwNjg0MCwxMjU3MzA5MzM2LDQxNDgyOTI4MjYsMjQzMjU2NjU2LDc5MDA3Mzg0NiwyMzczMzQwNjMwLDEyOTYyOTc5MDQsMTQyMjY5OTA4NSwzNzU2Mjk5NzgwLDM4MTg4MzY0MDUsNDU3OTkyODQwLDMwOTk2Njc0ODcsMjEzNTMxOTg4OSw3NzQyMjMxNCwxNTYwMzgyNTE3LDE5NDU3OTg1MTYsNzg4MjA0MzUzLDE1MjE3MDY3ODEsMTM4NTM1NjI0Miw4NzA5MTIwODYsMzI1OTY1MzgzLDIzNTg5NTc5MjEsMjA1MDQ2NjA2MCwyMzg4MjYwODg0LDIzMTM4ODQ0NzYsNDAwNjUyMTEyNyw5MDEyMTA1NjksMzk5MDk1MzE4OSwxMDE0NjQ2NzA1LDE1MDM0NDk4MjMsMTA2MjU5NzIzNSwyMDMxNjIxMzI2LDMyMTIwMzU4OTUsMzkzMTM3MTQ2OSwxNTMzMDE3NTE0LDM1MDE3NDU3NSwyMjU2MDI4ODkxLDIxNzc1NDQxNzksMTA1MjMzODM3Miw3NDE4NzY3ODgsMTYwNjU5MTI5NiwxOTE0MDUyMDM1LDIxMzcwNTI1MywyMzM0NjY5ODk3LDExMDcyMzQxOTcsMTg5OTYwMzk2OSwzNzI1MDY5NDkxLDI2MzE0NDc3ODAsMjQyMjQ5NDkxMywxNjM1NTAyOTgwLDE4OTMwMjAzNDIsMTk1MDkwMzM4OCwxMTIwOTc0OTM1XTt2YXIgVDc9WzI4MDcwNTg5MzIsMTY5OTk3MDYyNSwyNzY0MjQ5NjIzLDE1ODY5MDM1OTEsMTgwODQ4MTE5NSwxMTczNDMwMTczLDE0ODc2NDU5NDYsNTk5ODQ4NjcsNDE5OTg4MjgwMCwxODQ0ODgyODA2LDE5ODkyNDkyMjgsMTI3NzU1NTk3MCwzNjIzNjM2OTY1LDM0MTk5MTU1NjIsMTE0OTI0OTA3NywyNzQ0MTA0MjkwLDE1MTQ3OTA1NzcsNDU5NzQ0Njk4LDI0NDg2MDM5NCwzMjM1OTk1MTM0LDE5NjMxMTUzMTEsNDAyNzc0NDU4OCwyNTQ0MDc4MTUwLDQxOTA1MzA1MTUsMTYwODk3NTI0NywyNjI3MDE2MDgyLDIwNjIyNzAzMTcsMTUwNzQ5NzI5OCwyMjAwODE4ODc4LDU2NzQ5ODg2OCwxNzY0MzEzNTY4LDMzNTk5MzYyMDEsMjMwNTQ1NTU1NCwyMDM3OTcwMDYyLDEwNDcyMzllMywxOTEwMzE5MDMzLDEzMzczNzY0ODEsMjkwNDAyNzI3MiwyODkyNDE3MzEyLDk4NDkwNzIxNCwxMjQzMTEyNDE1LDgzMDY2MTkxNCw4NjE5NjgyMDksMjEzNTI1MzU4NywyMDExMjE0MTgwLDI5Mjc5MzQzMTUsMjY4NjI1NDcyMSw3MzExODMzNjgsMTc1MDYyNjM3Niw0MjQ2MzEwNzI1LDE4MjA4MjQ3OTgsNDE3Mjc2Mzc3MSwzNTQyMzMwMjI3LDQ4Mzk0ODI3LDI0MDQ5MDE2NjMsMjg3MTY4MjY0NSw2NzE1OTMxOTUsMzI1NDk4ODcyNSwyMDczNzI0NjEzLDE0NTA4NTIzOSwyMjgwNzk2MjAwLDI3Nzk5MTUxOTksMTc5MDU3NTEwNywyMTg3MTI4MDg2LDQ3MjYxNTYzMSwzMDI5NTEwMDA5LDQwNzU4NzcxMjcsMzgwMjIyMjE4NSw0MTA3MTAxNjU4LDMyMDE2MzE3NDksMTY0NjI1MjM0MCw0MjcwNTA3MTc0LDE0MDI4MTE0MzgsMTQzNjU5MDgzNSwzNzc4MTUxODE4LDM5NTAzNTU3MDIsMzk2MzE2MTQ3NSw0MDIwOTEyMjI0LDI2Njc5OTQ3MzcsMjczNzkyMzY2LDIzMzE1OTAxNzcsMTA0Njk5NjEzLDk1MzQ1OTgyLDMxNzU1MDEyODYsMjM3NzQ4NjY3NiwxNTYwNjM3ODkyLDM1NjQwNDUzMTgsMzY5MDU3ODcyLDQyMTM0NDcwNjQsMzkxOTA0MjIzNywxMTM3NDc3OTUyLDI2NTg2MjU0OTcsMTExOTcyNzg0OCwyMzQwOTQ3ODQ5LDE1MzA0NTU4MzMsNDAwNzM2MDk2OCwxNzI0NjY1NTYsMjY2OTU5OTM4LDUxNjU1MjgzNiwwLDIyNTY3MzQ1OTIsMzk4MDkzMTYyNywxODkwMzI4MDgxLDE5MTc3NDIxNzAsNDI5NDcwNDM5OCw5NDUxNjQxNjUsMzU3NTUyODg3OCw5NTg4NzEwODUsMzY0NzIxMjA0NywyNzg3MjA3MjYwLDE0MjMwMjI5MzksNzc1NTYyMjk0LDE3Mzk2NTYyMDIsMzg3NjU1NzY1NSwyNTMwMzkxMjc4LDI0NDMwNTgwNzUsMzMxMDMyMTg1Niw1NDc1MTI3OTYsMTI2NTE5NTYzOSw0Mzc2NTY1OTQsMzEyMTI3NTUzOSw3MTk3MDAxMjgsMzc2MjUwMjY5MCwzODc3ODExNDcsMjE4ODI4Mjk3LDMzNTAwNjU4MDMsMjgzMDcwODE1MCwyODQ4NDYxODU0LDQyODE2OTIwMSwxMjI0NjYxNjUsMzcyMDA4MTA0OSwxNjI3MjM1MTk5LDY0ODAxNzY2NSw0MTIyNzYyMzU0LDEwMDI3ODM4NDYsMjExNzM2MDYzNSw2OTU2MzQ3NTUsMzMzNjM1ODY5MSw0MjM0NzIxMDA1LDQwNDk4NDQ0NTIsMzcwNDI4MDg4MSwyMjMyNDM1Mjk5LDU3NDYyNDY2MywyODczNDM4MTQsNjEyMjA1ODk4LDEwMzk3MTcwNTEsODQwMDE5NzA1LDI3MDgzMjYxODUsNzkzNDUxOTM0LDgyMTI4ODExNCwxMzkxMjAxNjcwLDM4MjIwOTAxNzcsMzc2MTg3ODI3LDMxMTM4NTUzNDQsMTIyNDM0ODA1MiwxNjc5OTY4MjMzLDIzNjE2OTg1NTYsMTA1ODcwOTc0NCw3NTIzNzU0MjEsMjQzMTU5MDk2MywxMzIxNjk5MTQ1LDM1MTkxNDIyMDAsMjczNDU5MTE3OCwxODgxMjc0NDQsMjE3Nzg2OTU1NywzNzI3MjA1NzU0LDIzODQ5MTEwMzEsMzIxNTIxMjQ2MSwyNjQ4OTc2NDQyLDI0NTAzNDYxMDQsMzQzMjczNzM3NSwxMTgwODQ5Mjc4LDMzMTU0NDIwNSwzMTAyMjQ5MTc2LDQxNTAxNDQ1NjksMjk1MjEwMjU5NSwyMTU5OTc2Mjg1LDI0NzQ0MDQzMDQsNzY2MDc4OTMzLDMxMzc3Mzg2MSwyNTcwODMyMDQ0LDIxMDgxMDA2MzIsMTY2ODIxMjg5MiwzMTQ1NDU2NDQzLDIwMTM5MDgyNjIsNDE4NjcyMjE3LDMwNzAzNTY2MzQsMjU5NDczNDkyNywxODUyMTcxOTI1LDM4NjcwNjA5OTEsMzQ3MzQxNjYzNiwzOTA3NDQ4NTk3LDI2MTQ3Mzc2MzksOTE5NDg5MTM1LDE2NDk0ODYzOSwyMDk0NDEwMTYwLDI5OTc4MjU5NTYsNTkwNDI0NjM5LDI0ODYyMjQ1NDksMTcyMzg3MjY3NCwzMTU3NzUwODYyLDMzOTk5NDEyNTAsMzUwMTI1Mjc1MiwzNjI1MjY4MTM1LDI1NTUwNDgxOTYsMzY3MzYzNzM1NiwxMzQzMTI3NTAxLDQxMzAyODEzNjEsMzU5OTU5NTA4NSwyOTU3ODUzNjc5LDEyOTc0MDMwNTAsODE3ODE5MTAsMzA1MTU5MzQyNSwyMjgzNDkwNDEwLDUzMjIwMTc3MiwxMzY3Mjk1NTg5LDM5MjYxNzA5NzQsODk1Mjg3NjkyLDE5NTM3NTc4MzEsMTA5MzU5Nzk2Myw0OTI0ODM0MzEsMzUyODYyNjkwNywxNDQ2MjQyNTc2LDExOTI0NTU2MzgsMTYzNjYwNDYzMSwyMDkzMzYyMjUsMzQ0ODczNDY0LDEwMTU2NzE1NzEsNjY5OTYxODk3LDMzNzU3NDA3NjksMzg1NzU3MjEyNCwyOTczNTMwNjk1LDM3NDcxOTIwMTgsMTkzMzUzMDYxMCwzNDY0MDQyNTE2LDkzNTI5Mzg5NSwzNDU0Njg2MTk5LDI4NTgxMTUwNjksMTg2MzYzODg0NSwzNjgzMDIyOTE2LDQwODUzNjk1MTksMzI5MjQ0NTAzMiw4NzUzMTMxODgsMTA4MDAxNzU3MSwzMjc5MDMzODg1LDYyMTU5MTc3OCwxMjMzODU2NTcyLDI1MDQxMzAzMTcsMjQxOTc1NDQsMzAxNzY3MjcxNiwzODM1NDg0MzQwLDMyNDc0NjU1NTgsMjIyMDk4MTE5NSwzMDYwODQ3OTIyLDE1NTExMjQ1ODgsMTQ2Mzk5NjYwMF07dmFyIFQ4PVs0MTA0NjA1Nzc3LDEwOTcxNTk1NTAsMzk2NjczODE4LDY2MDUxMDI2NiwyODc1OTY4MzE1LDI2Mzg2MDY2MjMsNDIwMDExNTExNiwzODA4NjYyMzQ3LDgyMTcxMjE2MCwxOTg2OTE4MDYxLDM0MzAzMjI1NjgsMzg1NDQ4ODUsMzg1NjEzNzI5NSw3MTgwMDIxMTcsODkzNjgxNzAyLDE2NTQ4ODYzMjUsMjk3NTQ4NDM4MiwzMTIyMzU4MDUzLDM5MjY4MjUwMjksNDI3NDA1MzQ2OSw3OTYxOTc1NzEsMTI5MDgwMTc5MywxMTg0MzQyOTI1LDM1NTYzNjE4MzUsMjQwNTQyNjk0NywyNDU5NzM1MzE3LDE4MzY3NzIyODcsMTM4MTYyMDM3MywzMTk2MjY3OTg4LDE5NDgzNzM4NDgsMzc2NDk4ODIzMywzMzg1MzQ1MTY2LDMyNjM3ODU1ODksMjM5MDMyNTQ5MiwxNDgwNDg1Nzg1LDMxMTEyNDcxNDMsMzc4MDA5NzcyNiwyMjkzMDQ1MjMyLDU0ODE2OTQxNywzNDU5OTUzNzg5LDM3NDYxNzUwNzUsNDM5NDUyMzg5LDEzNjIzMjE1NTksMTQwMDg0OTc2MiwxNjg1NTc3OTA1LDE4MDY1OTkzNTUsMjE3NDc1NDA0NiwxMzcwNzM5MTMsMTIxNDc5NzkzNiwxMTc0MjE1MDU1LDM3MzE2NTQ1NDgsMjA3OTg5NzQyNiwxOTQzMjE3MDY3LDEyNTg0ODAyNDIsNTI5NDg3ODQzLDE0MzcyODA4NzAsMzk0NTI2OTE3MCwzMDQ5MzkwODk1LDMzMTMyMTIwMzgsOTIzMzEzNjE5LDY3OTk5OGUzLDMyMTUzMDcyOTksNTczMjYwODIsMzc3NjQyMjIxLDM0NzQ3Mjk4NjYsMjA0MTg3NzE1OSwxMzMzNjE5MDcsMTc3NjQ2MDExMCwzNjczNDc2NDUzLDk2MzkyNDU0LDg3ODg0NTkwNSwyODAxNjk5NTI0LDc3NzIzMTY2OCw0MDgyNDc1MTcwLDIzMzAwMTQyMTMsNDE0MjYyNjIxMiwyMjEzMjk2Mzk1LDE2MjYzMTk0MjQsMTkwNjI0NzI2MiwxODQ2NTYzMjYxLDU2Mjc1NTkwMiwzNzA4MTczNzE4LDEwNDA1NTk4MzcsMzg3MTE2Mzk4MSwxNDE4NTczMjAxLDMyOTQ0MzA1NzcsMTE0NTg1MzQ4LDEzNDM2MTg5MTIsMjU2NjU5NTYwOSwzMTg2MjAyNTgyLDEwNzgxODUwOTcsMzY1MTA0MTEyNywzODk2Njg4MDQ4LDIzMDc2MjI5MTksNDI1NDA4NzQzLDMzNzEwOTY5NTMsMjA4MTA0ODQ4MSwxMTA4MzM5MDY4LDIyMTY2MTAyOTYsMCwyMTU2Mjk5MDE3LDczNjk3MDgwMiwyOTI1OTY3NjYsMTUxNzQ0MDYyMCwyNTE2NTcyMTMsMjIzNTA2MTc3NSwyOTMzMjAyNDkzLDc1ODcyMDMxMCwyNjU5MDUxNjIsMTU1NDM5MTQwMCwxNTMyMjg1MzM5LDkwODk5OTIwNCwxNzQ1Njc2OTIsMTQ3NDc2MDU5NSw0MDAyODYxNzQ4LDI2MTAwMTE2NzUsMzIzNDE1NjQxNiwzNjkzMTI2MjQxLDIwMDE0MzA4NzQsMzAzNjk5NDg0LDI0Nzg0NDMyMzQsMjY4NzE2NTg4OCw1ODUxMjI2MjAsNDU0NDk5NjAyLDE1MTg0OTc0MiwyMzQ1MTE5MjE4LDMwNjQ1MTA3NjUsNTE0NDQzMjg0LDQwNDQ5ODE1OTEsMTk2MzQxMjY1NSwyNTgxNDQ1NjE0LDIxMzcwNjI4MTksMTkzMDg1MzUsMTkyODcwNzE2NCwxNzE1MTkzMTU2LDQyMTkzNTIxNTUsMTEyNjc5MDc5NSw2MDAyMzUyMTEsMzk5Mjc0MjA3MCwzODQxMDI0OTUyLDgzNjU1MzQzMSwxNjY5NjY0ODM0LDI1MzU2MDQyNDMsMzMyMzAxMTIwNCwxMjQzOTA1NDEzLDMxNDE0MDA3ODYsNDE4MDgwODExMCw2OTg0NDUyNTUsMjY1Mzg5OTU0OSwyOTg5NTUyNjA0LDIyNTM1ODEzMjUsMzI1MjkzMjcyNywzMDA0NTkxMTQ3LDE4OTEyMTE2ODksMjQ4NzgxMDU3NywzOTE1NjUzNzAzLDQyMzcwODM4MTYsNDAzMDY2NzQyNCwyMTAwMDkwOTY2LDg2NTEzNjQxOCwxMjI5ODk5NjU1LDk1MzI3MDc0NSwzMzk5Njc5NjI4LDM1NTc1MDQ2NjQsNDExODkyNTIyMiwyMDYxMzc5NzQ5LDMwNzk1NDY1ODYsMjkxNTAxNzc5MSw5ODM0MjYwOTIsMjAyMjgzNzU4NCwxNjA3MjQ0NjUwLDIxMTg1NDE5MDgsMjM2Njg4MjU1MCwzNjM1OTk2ODE2LDk3MjUxMjgxNCwzMjgzMDg4NzcwLDE1Njg3MTg0OTUsMzQ5OTMyNjU2OSwzNTc2NTM5NTAzLDYyMTk4MjY3MSwyODk1NzIzNDY0LDQxMDg4Nzk1MiwyNjIzNzYyMTUyLDEwMDIxNDI2ODMsNjQ1NDAxMDM3LDE0OTQ4MDc2NjIsMjU5NTY4NDg0NCwxMzM1NTM1NzQ3LDI1MDcwNDAyMzAsNDI5MzI5NTc4NiwzMTY3Njg0NjQxLDM2NzU4NTAwNywzODg1NzUwNzE0LDE4NjU4NjI3MzAsMjY2ODIyMTY3NCwyOTYwOTcxMzA1LDI3NjMxNzM2ODEsMTA1OTI3MDk1NCwyNzc3OTUyNDU0LDI3MjQ2NDI4NjksMTMyMDk1NzgxMiwyMTk0MzE5MTAwLDI0Mjk1OTU4NzIsMjgxNTk1NjI3NSw3NzA4OTUyMSwzOTczNzczMTIxLDM0NDQ1NzU4NzEsMjQ0ODgzMDIzMSwxMzA1OTA2NTUwLDQwMjEzMDg3MzksMjg1NzE5NDcwMCwyNTE2OTAxODYwLDM1MTgzNTg0MzAsMTc4NzMwNDc4MCw3NDAyNzY0MTcsMTY5OTgzOTgxNCwxNTkyMzk0OTA5LDIzNTIzMDc0NTcsMjI3MjU1NjAyNiwxODg4MjEyNDMsMTcyOTk3NzAxMSwzNjg3OTk0MDAyLDI3NDA4NDg0MSwzNTk0OTgyMjUzLDM2MTM0OTQ0MjYsMjcwMTk0OTQ5NSw0MTYyMDk2NzI5LDMyMjczNDU3MSwyODM3OTY2NTQyLDE2NDA1NzY0MzksNDg0ODMwNjg5LDEyMDI3OTc2OTAsMzUzNzg1MjgyOCw0MDY3NjM5MTI1LDM0OTA3NTczNiwzMzQyMzE5NDc1LDQxNTc0NjcyMTksNDI1NTgwMDE1OSwxMDMwNjkwMDE1LDExNTUyMzc0OTYsMjk1MTk3MTI3NCwxNzU3NjkxNTc3LDYwNzM5ODk2OCwyNzM4OTA1MDI2LDQ5OTM0Nzk5MCwzNzk0MDc4OTA4LDEwMTE0NTI3MTIsMjI3ODg1NTY3LDI4MTg2NjY4MDksMjEzMTE0Mzc2LDMwMzQ4ODEyNDAsMTQ1NTUyNTk4OCwzNDE0NDUwNTU1LDg1MDgxNzIzNywxODE3OTk4NDA4LDMwOTI3MjY0ODBdO3ZhciBVMT1bMCwyMzU0NzQxODcsNDcwOTQ4Mzc0LDMwMzc2NTI3Nyw5NDE4OTY3NDgsOTA4OTMzNDE1LDYwNzUzMDU1NCw3MDg3ODA4NDksMTg4Mzc5MzQ5NiwyMTE4MjE0OTk1LDE4MTc4NjY4MzAsMTY0OTYzOTIzNywxMjE1MDYxMTA4LDExODEwNDUxMTksMTQxNzU2MTY5OCwxNTE3NzY3NTI5LDM3Njc1ODY5OTIsNDAwMzA2MTE3OSw0MjM2NDI5OTkwLDQwNjkyNDY4OTMsMzYzNTczMzY2MCwzNjAyNzcwMzI3LDMyOTkyNzg0NzQsMzQwMDUyODc2OSwyNDMwMTIyMjE2LDI2NjQ1NDM3MTUsMjM2MjA5MDIzOCwyMTkzODYyNjQ1LDI4MzUxMjMzOTYsMjgwMTEwNzQwNywzMDM1NTM1MDU4LDMxMzU3NDA4ODksMzY3ODEyNDkyMywzNTc2ODcwNTEyLDMzNDEzOTQyODUsMzM3NDM2MTcwMiwzODEwNDk2MzQzLDM5Nzc2NzUzNTYsNDI3OTA4MDI1Nyw0MDQzNjEwMTg2LDI4NzY0OTQ2MjcsMjc3NjI5MjkwNCwzMDc2NjM5MDI5LDMxMTA2NTA5NDIsMjQ3MjAxMTUzNSwyNjQwMjQzMjA0LDI0MDM3Mjg2NjUsMjE2OTMwMzA1OCwxMDAxMDg5OTk1LDg5OTgzNTU4NCw2NjY0NjQ3MzMsNjk5NDMyMTUwLDU5NzI3ODQ3LDIyNjkwNjg2MCw1MzA0MDA3NTMsMjk0OTMwNjgyLDEyNzMxNjg3ODcsMTE3Mjk2NzA2NCwxNDc1NDE4NTAxLDE1MDk0MzA0MTQsMTk0MjQzNTc3NSwyMTEwNjY3NDQ0LDE4NzYyNDE4MzMsMTY0MTgxNjIyNiwyOTEwMjE5NzY2LDI3NDMwMzQxMDksMjk3NjE1MTUyMCwzMjExNjIzMTQ3LDI1MDUyMDIxMzgsMjYwNjQ1Mzk2OSwyMzAyNjkwMjUyLDIyNjk3Mjg0NTUsMzcxMTgyOTQyMiwzNTQzNTk5MjY5LDMyNDA4OTQzOTIsMzQ3NTMxMzMzMSwzODQzNjk5MDc0LDM5NDM5MDY0NDEsNDE3ODA2MjIyOCw0MTQ0MDQ3Nzc1LDEzMDY5NjczNjYsMTEzOTc4MTcwOSwxMzc0OTg4MTEyLDE2MTA0NTk3MzksMTk3NTY4MzQzNCwyMDc2OTM1MjY1LDE3NzUyNzY5MjQsMTc0MjMxNTEyNywxMDM0ODY3OTk4LDg2NjYzNzg0NSw1NjYwMjE4OTYsODAwNDQwODM1LDkyOTg3Njk4LDE5MzE5NTA2NSw0Mjk0NTYxNjQsMzk1NDQxNzExLDE5ODQ4MTI2ODUsMjAxNzc3ODU2NiwxNzg0NjYzMTk1LDE2ODM0MDcyNDgsMTMxNTU2MjE0NSwxMDgwMDk0NjM0LDEzODM4NTYzMTEsMTU1MTAzNzg4NCwxMDEwMzk4MjksMTM1MDUwMjA2LDQzNzc1NzEyMywzMzc1NTM4NjQsMTA0MjM4NTY1Nyw4MDc5NjI2MTAsNTczODA0NzgzLDc0MjAzOTAxMiwyNTMxMDY3NDUzLDI1NjQwMzMzMzQsMjMyODgyODk3MSwyMjI3NTczMDI0LDI5MzU1NjY4NjUsMjcwMDA5OTM1NCwzMDAxNzU1NjU1LDMxNjg5MzcyMjgsMzg2ODU1MjgwNSwzOTAyNTYzMTgyLDQyMDMxODExNzEsNDEwMjk3NzkxMiwzNzM2MTY0OTM3LDM1MDE3NDE4OTAsMzI2NTQ3ODc1MSwzNDMzNzEyOTgwLDExMDYwNDE1OTEsMTM0MDQ2MzEwMCwxNTc2OTc2NjA5LDE0MDg3NDkwMzQsMjA0MzIxMTQ4MywyMDA5MTk1NDcyLDE3MDg4NDgzMzMsMTgwOTA1NDE1MCw4MzI4NzcyMzEsMTA2ODM1MTM5Niw3NjY5NDU0NjUsNTk5NzYyMzU0LDE1OTQxNzk4NywxMjY0NTQ2NjQsMzYxOTI5ODc3LDQ2MzE4MDE5MCwyNzA5MjYwODcxLDI5NDM2ODIzODAsMzE3ODEwNjk2MSwzMDA5ODc5Mzg2LDI1NzI2OTcxOTUsMjUzODY4MTE4NCwyMjM2MjI4NzMzLDIzMzY0MzQ1NTAsMzUwOTg3MTEzNSwzNzQ1MzQ1MzAwLDM0NDE4NTAzNzcsMzI3NDY2NzI2NiwzOTEwMTYxOTcxLDM4NzcxOTg2NDgsNDExMDU2ODQ4NSw0MjExODE4Nzk4LDI1OTc4MDY0NzYsMjQ5NzYwNDc0MywyMjYxMDg5MTc4LDIyOTUxMDEwNzMsMjczMzg1NjE2MCwyOTAyMDg3ODUxLDMyMDI0MzcwNDYsMjk2ODAxMTQ1MywzOTM2MjkxMjg0LDM4MzUwMzY4OTUsNDEzNjQ0MDc3MCw0MTY5NDA4MjAxLDM1MzU0ODY0NTYsMzcwMjY2NTQ1OSwzNDY3MTkyMzAyLDMyMzE3MjIyMTMsMjA1MTUxODc4MCwxOTUxMzE3MDQ3LDE3MTY4OTA0MTAsMTc1MDkwMjMwNSwxMTEzODE4Mzg0LDEyODIwNTAwNzUsMTU4NDUwNDU4MiwxMzUwMDc4OTg5LDE2ODgxMDg1Miw2NzU1NjQ2MywzNzEwNDkzMzAsNDA0MDE2NzYxLDg0MTczOTU5MiwxMDA4OTE4NTk1LDc3NTU1MDgxNCw1NDAwODA3MjUsMzk2OTU2MjM2OSwzODAxMzMyMjM0LDQwMzU0ODkwNDcsNDI2OTkwNzk5NiwzNTY5MjU1MjEzLDM2Njk0NjI1NjYsMzM2Njc1NDYxOSwzMzMyNzQwMTQ0LDI2MzEwNjU0MzMsMjQ2Mzg3OTc2MiwyMTYwMTE3MDcxLDIzOTU1ODg2NzYsMjc2NzY0NTU1NywyODY4ODk3NDA2LDMxMDIwMTE3NDcsMzA2OTA0OTk2MCwyMDIwMDg0OTcsMzM3NzgzNjIsMjcwMDQwNDg3LDUwNDQ1OTQzNiw4NzU0NTEyOTMsOTc1NjU4NjQ2LDY3NTAzOTYyNyw2NDEwMjUxNTIsMjA4NDcwNDIzMywxOTE3NTE4NTYyLDE2MTU4NjEyNDcsMTg1MTMzMjg1MiwxMTQ3NTUwNjYxLDEyNDg4MDI1MTAsMTQ4NDAwNTg0MywxNDUxMDQ0MDU2LDkzMzMwMTM3MCw5NjczMTE3MjksNzMzMTU2OTcyLDYzMjk1MzcwMywyNjAzODg5NTAsMjU5NjU5MTcsMzI4NjcxODA4LDQ5NjkwNjA1OSwxMjA2NDc3ODU4LDEyMzk0NDM3NTMsMTU0MzIwODUwMCwxNDQxOTUyNTc1LDIxNDQxNjE4MDYsMTkwODY5NDI3NywxNjc1NTc3ODgwLDE4NDI3NTk0NDMsMzYxMDM2OTIyNiwzNjQ0Mzc5NTg1LDM0MDgxMTk1MTYsMzMwNzkxNjI0Nyw0MDExMTkwNTAyLDM3NzY3Njc0NjksNDA3NzM4NDQzMiw0MjQ1NjE4NjgzLDI4MDk3NzExNTQsMjg0MjczNzA0OSwzMTQ0Mzk2NDIwLDMwNDMxNDA0OTUsMjY3MzcwNTE1MCwyNDM4MjM3NjIxLDIyMDMwMzIyMzIsMjM3MDIxMzc5NV07dmFyIFUyPVswLDE4NTQ2OTE5NywzNzA5MzgzOTQsNDg3NzI1ODQ3LDc0MTg3Njc4OCw2NTc4NjE5NDUsOTc1NDUxNjk0LDgyNDg1MjI1OSwxNDgzNzUzNTc2LDE0MDA3ODMyMDUsMTMxNTcyMzg5MCwxMTY0MDcxODA3LDE5NTA5MDMzODgsMjEzNTMxOTg4OSwxNjQ5NzA0NTE4LDE3Njc1MzY0NTksMjk2NzUwNzE1MiwzMTUyOTc2MzQ5LDI4MDE1NjY0MTAsMjkxODM1Mzg2MywyNjMxNDQ3NzgwLDI1NDc0MzI5MzcsMjMyODE0MzYxNCwyMTc3NTQ0MTc5LDM5MDE4MDY3NzYsMzgxODgzNjQwNSw0MjcwNjM5Nzc4LDQxMTg5ODc2OTUsMzI5OTQwOTAzNiwzNDgzODI1NTM3LDM1MzUwNzI5MTgsMzY1MjkwNDg1OSwyMDc3OTY1MjQzLDE4OTMwMjAzNDIsMTg0MTc2ODg2NSwxNzI0NDU3MTMyLDE0NzQ1MDI1NDMsMTU1OTA0MTY2NiwxMTA3MjM0MTk3LDEyNTczMDkzMzYsNTk4NDM4ODY3LDY4MTkzMzUzNCw5MDEyMTA1NjksMTA1MjMzODM3MiwyNjEzMTQ1MzUsNzc0MjIzMTQsNDI4ODE5OTY1LDMxMDQ2MzcyOCwzNDA5Njg1MzU1LDMyMjQ3NDA0NTQsMzcxMDM2ODExMywzNTkzMDU2MzgwLDM4NzU3NzAyMDcsMzk2MDMwOTMzMCw0MDQ1MzgwOTMzLDQxOTU0NTYwNzIsMjQ3MTIyNDA2NywyNTU0NzE4NzM0LDIyMzcxMzMwODEsMjM4ODI2MDg4NCwzMjEyMDM1ODk1LDMwMjgxNDM2NzQsMjg0MjY3ODU3MywyNzI0MzIyMzM2LDQxMzg1NjMxODEsNDI1NTM1MDYyNCwzNzY5NzIxOTc1LDM5NTUxOTExNjIsMzY2NzIxOTAzMywzNTE2NjE5NjA0LDM0MzE1NDY5NDcsMzM0NzUzMjExMCwyOTMzNzM0OTE3LDI3ODIwODI4MjQsMzA5OTY2NzQ4NywzMDE2Njk3MTA2LDIxOTYwNTI1MjksMjMxMzg4NDQ3NiwyNDk5MzQ4NTIzLDI2ODM3NjUwMzAsMTE3OTUxMDQ2MSwxMjk2Mjk3OTA0LDEzNDc1NDgzMjcsMTUzMzAxNzUxNCwxNzg2MTAyNDA5LDE2MzU1MDI5ODAsMjA4NzMwOTQ1OSwyMDAzMjk0NjIyLDUwNzM1ODkzMywzNTU3MDY4NDAsMTM2NDI4NzUxLDUzNDU4MzcwLDgzOTIyNDAzMyw5NTcwNTU5ODAsNjA1NjU3MzM5LDc5MDA3Mzg0NiwyMzczMzQwNjMwLDIyNTYwMjg4OTEsMjYwNzQzOTgyMCwyNDIyNDk0OTEzLDI3MDYyNzA2OTAsMjg1NjM0NTgzOSwzMDc1NjM2MjE2LDMxNjAxNzUzNDksMzU3Mzk0MTY5NCwzNzI1MDY5NDkxLDMyNzMyNjcxMDgsMzM1Njc2MTc2OSw0MTgxNTk4NjAyLDQwNjMyNDIzNzUsNDAxMTk5NjA0OCwzODI4MTAzODM3LDEwMzMyOTcxNTgsOTE1OTg1NDE5LDczMDUxNzI3Niw1NDU1NzIzNjksMjk2Njc5NzMwLDQ0Njc1NDg3OSwxMjkxNjYxMjAsMjEzNzA1MjUzLDE3MDk2MTAzNTAsMTg2MDczODE0NywxOTQ1Nzk4NTE2LDIwMjkyOTMxNzcsMTIzOTMzMTE2MiwxMTIwOTc0OTM1LDE2MDY1OTEyOTYsMTQyMjY5OTA4NSw0MTQ4MjkyODI2LDQyMzMwOTQ2MTUsMzc4MTAzMzY2NCwzOTMxMzcxNDY5LDM2ODIxOTE1OTgsMzQ5NzUwOTM0NywzNDQ2MDA0NDY4LDMzMjg5NTUzODUsMjkzOTI2NjIyNiwyNzU1NjM2NjcxLDMxMDY3ODA4NDAsMjk4ODY4NzI2OSwyMTk4NDM4MDIyLDIyODIxOTUzMzksMjUwMTIxODk3MiwyNjUyNjA5NDI1LDEyMDE3NjUzODYsMTI4NjU2NzE3NSwxMzcxMzY4OTc2LDE1MjE3MDY3ODEsMTgwNTIxMTcxMCwxNjIwNTI5NDU5LDIxMDU4ODcyNjgsMTk4ODgzODE4NSw1MzM4MDQxMzAsMzUwMTc0NTc1LDE2NDQzOTY3Miw0NjM0NjEwMSw4NzA5MTIwODYsOTU0NjY5NDAzLDYzNjgxMzkwMCw3ODgyMDQzNTMsMjM1ODk1NzkyMSwyMjc0NjgwNDI4LDI1OTI1MjM2NDMsMjQ0MTY2MTU1OCwyNjk1MDMzNjg1LDI4ODAyNDAyMTYsMzA2NTk2MjgzMSwzMTgyNDg3NjE4LDM1NzIxNDU5MjksMzc1NjI5OTc4MCwzMjcwOTM3ODc1LDMzODg1MDcxNjYsNDE3NDU2MDA2MSw0MDkxMzI3MDI0LDQwMDY1MjExMjcsMzg1NDYwNjM3OCwxMDE0NjQ2NzA1LDkzMDM2OTIxMiw3MTEzNDk2NzUsNTYwNDg3NTkwLDI3Mjc4NjMwOSw0NTc5OTI4NDAsMTA2ODUyNzY3LDIyMzM3NzU1NCwxNjc4MzgxMDE3LDE4NjI1MzQ4NjgsMTkxNDA1MjAzNSwyMDMxNjIxMzI2LDEyMTEyNDc1OTcsMTEyODAxNDU2MCwxNTgwMDg3Nzk5LDE0MjgxNzMwNTAsMzIyODMzMTksMTgyNjIxMTE0LDQwMTYzOTU5Nyw0ODY0NDEzNzYsNzY4OTE3MTIzLDY1MTg2ODA0NiwxMDAzMDA3MTI5LDgxODMyNDg4NCwxNTAzNDQ5ODIzLDEzODUzNTYyNDIsMTMzMzgzODAyMSwxMTUwMjA4NDU2LDE5NzM3NDUzODcsMjEyNTEzNTg0NiwxNjczMDYxNjE3LDE3NTY4MTg5NDAsMjk3MDM1NjMyNywzMTIwNjk0MTIyLDI4MDI4NDk5MTcsMjg4NzY1MTY5NiwyNjM3NDQyNjQzLDI1MjAzOTM1NjYsMjMzNDY2OTg5NywyMTQ5OTg3NjUyLDM5MTcyMzQ3MDMsMzc5OTE0MTEyMiw0Mjg0NTAyMDM3LDQxMDA4NzI0NzIsMzMwOTU5NDE3MSwzNDYwOTg0NjMwLDM1NDU3ODk0NzMsMzYyOTU0Njc5NiwyMDUwNDY2MDYwLDE4OTk2MDM5NjksMTgxNDgwMzIyMiwxNzMwNTI1NzIzLDE0NDM4NTc3MjAsMTU2MDM4MjUxNywxMDc1MDI1Njk4LDEyNjAyMzIyMzksNTc1MTM4MTQ4LDY5MjcwNzQzMyw4Nzg0NDMzOTAsMTA2MjU5NzIzNSwyNDMyNTY2NTYsOTEzNDE5MTcsNDA5MTk4NDEwLDMyNTk2NTM4MywzNDAzMTAwNjM2LDMyNTIyMzg1NDUsMzcwNDMwMDQ4NiwzNjIwMDIyOTg3LDM4NzQ0MjgzOTIsMzk5MDk1MzE4OSw0MDQyNDU5MTIyLDQyMjc2NjU2NjMsMjQ2MDQ0OTIwNCwyNTc4MDE4NDg5LDIyMjY4NzUzMTAsMjQxMTAyOTE1NSwzMTk4MTE1MjAwLDMwNDYyMDA0NjEsMjgyNzE3Nzg4MiwyNzQzOTQ0ODU1XTt2YXIgVTM9WzAsMjE4ODI4Mjk3LDQzNzY1NjU5NCwzODc3ODExNDcsODc1MzEzMTg4LDk1ODg3MTA4NSw3NzU1NjIyOTQsNTkwNDI0NjM5LDE3NTA2MjYzNzYsMTY5OTk3MDYyNSwxOTE3NzQyMTcwLDIxMzUyNTM1ODcsMTU1MTEyNDU4OCwxMzY3Mjk1NTg5LDExODA4NDkyNzgsMTI2NTE5NTYzOSwzNTAxMjUyNzUyLDM3MjAwODEwNDksMzM5OTk0MTI1MCwzMzUwMDY1ODAzLDM4MzU0ODQzNDAsMzkxOTA0MjIzNyw0MjcwNTA3MTc0LDQwODUzNjk1MTksMzEwMjI0OTE3NiwzMDUxNTkzNDI1LDI3MzQ1OTExNzgsMjk1MjEwMjU5NSwyMzYxNjk4NTU2LDIxNzc4Njk1NTcsMjUzMDM5MTI3OCwyNjE0NzM3NjM5LDMxNDU0NTY0NDMsMzA2MDg0NzkyMiwyNzA4MzI2MTg1LDI4OTI0MTczMTIsMjQwNDkwMTY2MywyMTg3MTI4MDg2LDI1MDQxMzAzMTcsMjU1NTA0ODE5NiwzNTQyMzMwMjI3LDM3MjcyMDU3NTQsMzM3NTc0MDc2OSwzMjkyNDQ1MDMyLDM4NzY1NTc2NTUsMzkyNjE3MDk3NCw0MjQ2MzEwNzI1LDQwMjc3NDQ1ODgsMTgwODQ4MTE5NSwxNzIzODcyNjc0LDE5MTAzMTkwMzMsMjA5NDQxMDE2MCwxNjA4OTc1MjQ3LDEzOTEyMDE2NzAsMTE3MzQzMDE3MywxMjI0MzQ4MDUyLDU5OTg0ODY3LDI0NDg2MDM5NCw0MjgxNjkyMDEsMzQ0ODczNDY0LDkzNTI5Mzg5NSw5ODQ5MDcyMTQsNzY2MDc4OTMzLDU0NzUxMjc5NiwxODQ0ODgyODA2LDE2MjcyMzUxOTksMjAxMTIxNDE4MCwyMDYyMjcwMzE3LDE1MDc0OTcyOTgsMTQyMzAyMjkzOSwxMTM3NDc3OTUyLDEzMjE2OTkxNDUsOTUzNDU5ODIsMTQ1MDg1MjM5LDUzMjIwMTc3MiwzMTM3NzM4NjEsODMwNjYxOTE0LDEwMTU2NzE1NzEsNzMxMTgzMzY4LDY0ODAxNzY2NSwzMTc1NTAxMjg2LDI5NTc4NTM2NzksMjgwNzA1ODkzMiwyODU4MTE1MDY5LDIzMDU0NTU1NTQsMjIyMDk4MTE5NSwyNDc0NDA0MzA0LDI2NTg2MjU0OTcsMzU3NTUyODg3OCwzNjI1MjY4MTM1LDM0NzM0MTY2MzYsMzI1NDk4ODcyNSwzNzc4MTUxODE4LDM5NjMxNjE0NzUsNDIxMzQ0NzA2NCw0MTMwMjgxMzYxLDM1OTk1OTUwODUsMzY4MzAyMjkxNiwzNDMyNzM3Mzc1LDMyNDc0NjU1NTgsMzgwMjIyMjE4NSw0MDIwOTEyMjI0LDQxNzI3NjM3NzEsNDEyMjc2MjM1NCwzMjAxNjMxNzQ5LDMwMTc2NzI3MTYsMjc2NDI0OTYyMywyODQ4NDYxODU0LDIzMzE1OTAxNzcsMjI4MDc5NjIwMCwyNDMxNTkwOTYzLDI2NDg5NzY0NDIsMTA0Njk5NjEzLDE4ODEyNzQ0NCw0NzI2MTU2MzEsMjg3MzQzODE0LDg0MDAxOTcwNSwxMDU4NzA5NzQ0LDY3MTU5MzE5NSw2MjE1OTE3NzgsMTg1MjE3MTkyNSwxNjY4MjEyODkyLDE5NTM3NTc4MzEsMjAzNzk3MDA2MiwxNTE0NzkwNTc3LDE0NjM5OTY2MDAsMTA4MDAxNzU3MSwxMjk3NDAzMDUwLDM2NzM2MzczNTYsMzYyMzYzNjk2NSwzMjM1OTk1MTM0LDM0NTQ2ODYxOTksNDAwNzM2MDk2OCwzODIyMDkwMTc3LDQxMDcxMDE2NTgsNDE5MDUzMDUxNSwyOTk3ODI1OTU2LDMyMTUyMTI0NjEsMjgzMDcwODE1MCwyNzc5OTE1MTk5LDIyNTY3MzQ1OTIsMjM0MDk0Nzg0OSwyNjI3MDE2MDgyLDI0NDMwNTgwNzUsMTcyNDY2NTU2LDEyMjQ2NjE2NSwyNzM3OTIzNjYsNDkyNDgzNDMxLDEwNDcyMzllMyw4NjE5NjgyMDksNjEyMjA1ODk4LDY5NTYzNDc1NSwxNjQ2MjUyMzQwLDE4NjM2Mzg4NDUsMjAxMzkwODI2MiwxOTYzMTE1MzExLDE0NDYyNDI1NzYsMTUzMDQ1NTgzMywxMjc3NTU1OTcwLDEwOTM1OTc5NjMsMTYzNjYwNDYzMSwxODIwODI0Nzk4LDIwNzM3MjQ2MTMsMTk4OTI0OTIyOCwxNDM2NTkwODM1LDE0ODc2NDU5NDYsMTMzNzM3NjQ4MSwxMTE5NzI3ODQ4LDE2NDk0ODYzOSw4MTc4MTkxMCwzMzE1NDQyMDUsNTE2NTUyODM2LDEwMzk3MTcwNTEsODIxMjg4MTE0LDY2OTk2MTg5Nyw3MTk3MDAxMjgsMjk3MzUzMDY5NSwzMTU3NzUwODYyLDI4NzE2ODI2NDUsMjc4NzIwNzI2MCwyMjMyNDM1Mjk5LDIyODM0OTA0MTAsMjY2Nzk5NDczNywyNDUwMzQ2MTA0LDM2NDcyMTIwNDcsMzU2NDA0NTMxOCwzMjc5MDMzODg1LDM0NjQwNDI1MTYsMzk4MDkzMTYyNywzNzYyNTAyNjkwLDQxNTAxNDQ1NjksNDE5OTg4MjgwMCwzMDcwMzU2NjM0LDMxMjEyNzU1MzksMjkwNDAyNzI3MiwyNjg2MjU0NzIxLDIyMDA4MTg4NzgsMjM4NDkxMTAzMSwyNTcwODMyMDQ0LDI0ODYyMjQ1NDksMzc0NzE5MjAxOCwzNTI4NjI2OTA3LDMzMTAzMjE4NTYsMzM1OTkzNjIwMSwzOTUwMzU1NzAyLDM4NjcwNjA5OTEsNDA0OTg0NDQ1Miw0MjM0NzIxMDA1LDE3Mzk2NTYyMDIsMTc5MDU3NTEwNywyMTA4MTAwNjMyLDE4OTAzMjgwODEsMTQwMjgxMTQzOCwxNTg2OTAzNTkxLDEyMzM4NTY1NzIsMTE0OTI0OTA3NywyNjY5NTk5MzgsNDgzOTQ4MjcsMzY5MDU3ODcyLDQxODY3MjIxNywxMDAyNzgzODQ2LDkxOTQ4OTEzNSw1Njc0OTg4NjgsNzUyMzc1NDIxLDIwOTMzNjIyNSwyNDE5NzU0NCwzNzYxODc4MjcsNDU5NzQ0Njk4LDk0NTE2NDE2NSw4OTUyODc2OTIsNTc0NjI0NjYzLDc5MzQ1MTkzNCwxNjc5OTY4MjMzLDE3NjQzMTM1NjgsMjExNzM2MDYzNSwxOTMzNTMwNjEwLDEzNDMxMjc1MDEsMTU2MDYzNzg5MiwxMjQzMTEyNDE1LDExOTI0NTU2MzgsMzcwNDI4MDg4MSwzNTE5MTQyMjAwLDMzMzYzNTg2OTEsMzQxOTkxNTU2MiwzOTA3NDQ4NTk3LDM4NTc1NzIxMjQsNDA3NTg3NzEyNyw0Mjk0NzA0Mzk4LDMwMjk1MTAwMDksMzExMzg1NTM0NCwyOTI3OTM0MzE1LDI3NDQxMDQyOTAsMjE1OTk3NjI4NSwyMzc3NDg2Njc2LDI1OTQ3MzQ5MjcsMjU0NDA3ODE1MF07dmFyIFU0PVswLDE1MTg0OTc0MiwzMDM2OTk0ODQsNDU0NDk5NjAyLDYwNzM5ODk2OCw3NTg3MjAzMTAsOTA4OTk5MjA0LDEwNTkyNzA5NTQsMTIxNDc5NzkzNiwxMDk3MTU5NTUwLDE1MTc0NDA2MjAsMTQwMDg0OTc2MiwxODE3OTk4NDA4LDE2OTk4Mzk4MTQsMjExODU0MTkwOCwyMDAxNDMwODc0LDI0Mjk1OTU4NzIsMjU4MTQ0NTYxNCwyMTk0MzE5MTAwLDIzNDUxMTkyMTgsMzAzNDg4MTI0MCwzMTg2MjAyNTgyLDI4MDE2OTk1MjQsMjk1MTk3MTI3NCwzNjM1OTk2ODE2LDM1MTgzNTg0MzAsMzM5OTY3OTYyOCwzMjgzMDg4NzcwLDQyMzcwODM4MTYsNDExODkyNTIyMiw0MDAyODYxNzQ4LDM4ODU3NTA3MTQsMTAwMjE0MjY4Myw4NTA4MTcyMzcsNjk4NDQ1MjU1LDU0ODE2OTQxNyw1Mjk0ODc4NDMsMzc3NjQyMjIxLDIyNzg4NTU2Nyw3NzA4OTUyMSwxOTQzMjE3MDY3LDIwNjEzNzk3NDksMTY0MDU3NjQzOSwxNzU3NjkxNTc3LDE0NzQ3NjA1OTUsMTU5MjM5NDkwOSwxMTc0MjE1MDU1LDEyOTA4MDE3OTMsMjg3NTk2ODMxNSwyNzI0NjQyODY5LDMxMTEyNDcxNDMsMjk2MDk3MTMwNSwyNDA1NDI2OTQ3LDIyNTM1ODEzMjUsMjYzODYwNjYyMywyNDg3ODEwNTc3LDM4MDg2NjIzNDcsMzkyNjgyNTAyOSw0MDQ0OTgxNTkxLDQxNjIwOTY3MjksMzM0MjMxOTQ3NSwzNDU5OTUzNzg5LDM1NzY1Mzk1MDMsMzY5MzEyNjI0MSwxOTg2OTE4MDYxLDIxMzcwNjI4MTksMTY4NTU3NzkwNSwxODM2NzcyMjg3LDEzODE2MjAzNzMsMTUzMjI4NTMzOSwxMDc4MTg1MDk3LDEyMjk4OTk2NTUsMTA0MDU1OTgzNyw5MjMzMTM2MTksNzQwMjc2NDE3LDYyMTk4MjY3MSw0Mzk0NTIzODksMzIyNzM0NTcxLDEzNzA3MzkxMywxOTMwODUzNSwzODcxMTYzOTgxLDQwMjEzMDg3MzksNDEwNDYwNTc3Nyw0MjU1ODAwMTU5LDMyNjM3ODU1ODksMzQxNDQ1MDU1NSwzNDk5MzI2NTY5LDM2NTEwNDExMjcsMjkzMzIwMjQ5MywyODE1OTU2Mjc1LDMxNjc2ODQ2NDEsMzA0OTM5MDg5NSwyMzMwMDE0MjEzLDIyMTMyOTYzOTUsMjU2NjU5NTYwOSwyNDQ4ODMwMjMxLDEzMDU5MDY1NTAsMTE1NTIzNzQ5NiwxNjA3MjQ0NjUwLDE0NTU1MjU5ODgsMTc3NjQ2MDExMCwxNjI2MzE5NDI0LDIwNzk4OTc0MjYsMTkyODcwNzE2NCw5NjM5MjQ1NCwyMTMxMTQzNzYsMzk2NjczODE4LDUxNDQ0MzI4NCw1NjI3NTU5MDIsNjc5OTk4ZTMsODY1MTM2NDE4LDk4MzQyNjA5MiwzNzA4MTczNzE4LDM1NTc1MDQ2NjQsMzQ3NDcyOTg2NiwzMzIzMDExMjA0LDQxODA4MDgxMTAsNDAzMDY2NzQyNCwzOTQ1MjY5MTcwLDM3OTQwNzg5MDgsMjUwNzA0MDIzMCwyNjIzNzYyMTUyLDIyNzI1NTYwMjYsMjM5MDMyNTQ5MiwyOTc1NDg0MzgyLDMwOTI3MjY0ODAsMjczODkwNTAyNiwyODU3MTk0NzAwLDM5NzM3NzMxMjEsMzg1NjEzNzI5NSw0Mjc0MDUzNDY5LDQxNTc0NjcyMTksMzM3MTA5Njk1MywzMjUyOTMyNzI3LDM2NzM0NzY0NTMsMzU1NjM2MTgzNSwyNzYzMTczNjgxLDI5MTUwMTc3OTEsMzA2NDUxMDc2NSwzMjE1MzA3Mjk5LDIxNTYyOTkwMTcsMjMwNzYyMjkxOSwyNDU5NzM1MzE3LDI2MTAwMTE2NzUsMjA4MTA0ODQ4MSwxOTYzNDEyNjU1LDE4NDY1NjMyNjEsMTcyOTk3NzAxMSwxNDgwNDg1Nzg1LDEzNjIzMjE1NTksMTI0MzkwNTQxMywxMTI2NzkwNzk1LDg3ODg0NTkwNSwxMDMwNjkwMDE1LDY0NTQwMTAzNyw3OTYxOTc1NzEsMjc0MDg0ODQxLDQyNTQwODc0MywzODU0NDg4NSwxODg4MjEyNDMsMzYxMzQ5NDQyNiwzNzMxNjU0NTQ4LDMzMTMyMTIwMzgsMzQzMDMyMjU2OCw0MDgyNDc1MTcwLDQyMDAxMTUxMTYsMzc4MDA5NzcyNiwzODk2Njg4MDQ4LDI2NjgyMjE2NzQsMjUxNjkwMTg2MCwyMzY2ODgyNTUwLDIyMTY2MTAyOTYsMzE0MTQwMDc4NiwyOTg5NTUyNjA0LDI4Mzc5NjY1NDIsMjY4NzE2NTg4OCwxMjAyNzk3NjkwLDEzMjA5NTc4MTIsMTQzNzI4MDg3MCwxNTU0MzkxNDAwLDE2Njk2NjQ4MzQsMTc4NzMwNDc4MCwxOTA2MjQ3MjYyLDIwMjI4Mzc1ODQsMjY1OTA1MTYyLDExNDU4NTM0OCw0OTkzNDc5OTAsMzQ5MDc1NzM2LDczNjk3MDgwMiw1ODUxMjI2MjAsOTcyNTEyODE0LDgyMTcxMjE2MCwyNTk1Njg0ODQ0LDI0Nzg0NDMyMzQsMjI5MzA0NTIzMiwyMTc0NzU0MDQ2LDMxOTYyNjc5ODgsMzA3OTU0NjU4NiwyODk1NzIzNDY0LDI3Nzc5NTI0NTQsMzUzNzg1MjgyOCwzNjg3OTk0MDAyLDMyMzQxNTY0MTYsMzM4NTM0NTE2Niw0MTQyNjI2MjEyLDQyOTMyOTU3ODYsMzg0MTAyNDk1MiwzOTkyNzQyMDcwLDE3NDU2NzY5Miw1NzMyNjA4Miw0MTA4ODc5NTIsMjkyNTk2NzY2LDc3NzIzMTY2OCw2NjA1MTAyNjYsMTAxMTQ1MjcxMiw4OTM2ODE3MDIsMTEwODMzOTA2OCwxMjU4NDgwMjQyLDEzNDM2MTg5MTIsMTQ5NDgwNzY2MiwxNzE1MTkzMTU2LDE4NjU4NjI3MzAsMTk0ODM3Mzg0OCwyMTAwMDkwOTY2LDI3MDE5NDk0OTUsMjgxODY2NjgwOSwzMDA0NTkxMTQ3LDMxMjIzNTgwNTMsMjIzNTA2MTc3NSwyMzUyMzA3NDU3LDI1MzU2MDQyNDMsMjY1Mzg5OTU0OSwzOTE1NjUzNzAzLDM3NjQ5ODgyMzMsNDIxOTM1MjE1NSw0MDY3NjM5MTI1LDM0NDQ1NzU4NzEsMzI5NDQzMDU3NywzNzQ2MTc1MDc1LDM1OTQ5ODIyNTMsODM2NTUzNDMxLDk1MzI3MDc0NSw2MDAyMzUyMTEsNzE4MDAyMTE3LDM2NzU4NTAwNyw0ODQ4MzA2ODksMTMzMzYxOTA3LDI1MTY1NzIxMywyMDQxODc3MTU5LDE4OTEyMTE2ODksMTgwNjU5OTM1NSwxNjU0ODg2MzI1LDE1Njg3MTg0OTUsMTQxODU3MzIwMSwxMzM1NTM1NzQ3LDExODQzNDI5MjVdO2Z1bmN0aW9uIGNvbnZlcnRUb0ludDMyKGJ5dGVzKXt2YXIgcmVzdWx0PVtdO2Zvcih2YXIgaT0wO2k8Ynl0ZXMubGVuZ3RoO2krPTQpe3Jlc3VsdC5wdXNoKGJ5dGVzW2ldPDwyNHxieXRlc1tpKzFdPDwxNnxieXRlc1tpKzJdPDw4fGJ5dGVzW2krM10pfXJldHVybiByZXN1bHR9dmFyIEFFUz1mdW5jdGlvbihrZXkpe2lmKCEodGhpcyBpbnN0YW5jZW9mIEFFUykpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJrZXkiLHt2YWx1ZTpjb2VyY2VBcnJheShrZXksdHJ1ZSl9KTt0aGlzLl9wcmVwYXJlKCl9O0FFUy5wcm90b3R5cGUuX3ByZXBhcmU9ZnVuY3Rpb24oKXt2YXIgcm91bmRzPW51bWJlck9mUm91bmRzW3RoaXMua2V5Lmxlbmd0aF07aWYocm91bmRzPT1udWxsKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQga2V5IHNpemUgKG11c3QgYmUgMTYsIDI0IG9yIDMyIGJ5dGVzKSIpfXRoaXMuX0tlPVtdO3RoaXMuX0tkPVtdO2Zvcih2YXIgaT0wO2k8PXJvdW5kcztpKyspe3RoaXMuX0tlLnB1c2goWzAsMCwwLDBdKTt0aGlzLl9LZC5wdXNoKFswLDAsMCwwXSl9dmFyIHJvdW5kS2V5Q291bnQ9KHJvdW5kcysxKSo0O3ZhciBLQz10aGlzLmtleS5sZW5ndGgvNDt2YXIgdGs9Y29udmVydFRvSW50MzIodGhpcy5rZXkpO3ZhciBpbmRleDtmb3IodmFyIGk9MDtpPEtDO2krKyl7aW5kZXg9aT4+Mjt0aGlzLl9LZVtpbmRleF1baSU0XT10a1tpXTt0aGlzLl9LZFtyb3VuZHMtaW5kZXhdW2klNF09dGtbaV19dmFyIHJjb25wb2ludGVyPTA7dmFyIHQ9S0MsdHQ7d2hpbGUodDxyb3VuZEtleUNvdW50KXt0dD10a1tLQy0xXTt0a1swXV49U1t0dD4+MTYmMjU1XTw8MjReU1t0dD4+OCYyNTVdPDwxNl5TW3R0JjI1NV08PDheU1t0dD4+MjQmMjU1XV5yY29uW3Jjb25wb2ludGVyXTw8MjQ7cmNvbnBvaW50ZXIrPTE7aWYoS0MhPTgpe2Zvcih2YXIgaT0xO2k8S0M7aSsrKXt0a1tpXV49dGtbaS0xXX19ZWxzZXtmb3IodmFyIGk9MTtpPEtDLzI7aSsrKXt0a1tpXV49dGtbaS0xXX10dD10a1tLQy8yLTFdO3RrW0tDLzJdXj1TW3R0JjI1NV1eU1t0dD4+OCYyNTVdPDw4XlNbdHQ+PjE2JjI1NV08PDE2XlNbdHQ+PjI0JjI1NV08PDI0O2Zvcih2YXIgaT1LQy8yKzE7aTxLQztpKyspe3RrW2ldXj10a1tpLTFdfX12YXIgaT0wLHIsYzt3aGlsZShpPEtDJiZ0PHJvdW5kS2V5Q291bnQpe3I9dD4+MjtjPXQlNDt0aGlzLl9LZVtyXVtjXT10a1tpXTt0aGlzLl9LZFtyb3VuZHMtcl1bY109dGtbaSsrXTt0Kyt9fWZvcih2YXIgcj0xO3I8cm91bmRzO3IrKyl7Zm9yKHZhciBjPTA7Yzw0O2MrKyl7dHQ9dGhpcy5fS2Rbcl1bY107dGhpcy5fS2Rbcl1bY109VTFbdHQ+PjI0JjI1NV1eVTJbdHQ+PjE2JjI1NV1eVTNbdHQ+PjgmMjU1XV5VNFt0dCYyNTVdfX19O0FFUy5wcm90b3R5cGUuZW5jcnlwdD1mdW5jdGlvbihwbGFpbnRleHQpe2lmKHBsYWludGV4dC5sZW5ndGghPTE2KXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpIil9dmFyIHJvdW5kcz10aGlzLl9LZS5sZW5ndGgtMTt2YXIgYT1bMCwwLDAsMF07dmFyIHQ9Y29udmVydFRvSW50MzIocGxhaW50ZXh0KTtmb3IodmFyIGk9MDtpPDQ7aSsrKXt0W2ldXj10aGlzLl9LZVswXVtpXX1mb3IodmFyIHI9MTtyPHJvdW5kcztyKyspe2Zvcih2YXIgaT0wO2k8NDtpKyspe2FbaV09VDFbdFtpXT4+MjQmMjU1XV5UMlt0WyhpKzEpJTRdPj4xNiYyNTVdXlQzW3RbKGkrMiklNF0+PjgmMjU1XV5UNFt0WyhpKzMpJTRdJjI1NV1edGhpcy5fS2Vbcl1baV19dD1hLnNsaWNlKCl9dmFyIHJlc3VsdD1jcmVhdGVBcnJheSgxNiksdHQ7Zm9yKHZhciBpPTA7aTw0O2krKyl7dHQ9dGhpcy5fS2Vbcm91bmRzXVtpXTtyZXN1bHRbNCppXT0oU1t0W2ldPj4yNCYyNTVdXnR0Pj4yNCkmMjU1O3Jlc3VsdFs0KmkrMV09KFNbdFsoaSsxKSU0XT4+MTYmMjU1XV50dD4+MTYpJjI1NTtyZXN1bHRbNCppKzJdPShTW3RbKGkrMiklNF0+PjgmMjU1XV50dD4+OCkmMjU1O3Jlc3VsdFs0KmkrM109KFNbdFsoaSszKSU0XSYyNTVdXnR0KSYyNTV9cmV0dXJuIHJlc3VsdH07QUVTLnByb3RvdHlwZS5kZWNyeXB0PWZ1bmN0aW9uKGNpcGhlcnRleHQpe2lmKGNpcGhlcnRleHQubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSAxNiBieXRlcykiKX12YXIgcm91bmRzPXRoaXMuX0tkLmxlbmd0aC0xO3ZhciBhPVswLDAsMCwwXTt2YXIgdD1jb252ZXJ0VG9JbnQzMihjaXBoZXJ0ZXh0KTtmb3IodmFyIGk9MDtpPDQ7aSsrKXt0W2ldXj10aGlzLl9LZFswXVtpXX1mb3IodmFyIHI9MTtyPHJvdW5kcztyKyspe2Zvcih2YXIgaT0wO2k8NDtpKyspe2FbaV09VDVbdFtpXT4+MjQmMjU1XV5UNlt0WyhpKzMpJTRdPj4xNiYyNTVdXlQ3W3RbKGkrMiklNF0+PjgmMjU1XV5UOFt0WyhpKzEpJTRdJjI1NV1edGhpcy5fS2Rbcl1baV19dD1hLnNsaWNlKCl9dmFyIHJlc3VsdD1jcmVhdGVBcnJheSgxNiksdHQ7Zm9yKHZhciBpPTA7aTw0O2krKyl7dHQ9dGhpcy5fS2Rbcm91bmRzXVtpXTtyZXN1bHRbNCppXT0oU2lbdFtpXT4+MjQmMjU1XV50dD4+MjQpJjI1NTtyZXN1bHRbNCppKzFdPShTaVt0WyhpKzMpJTRdPj4xNiYyNTVdXnR0Pj4xNikmMjU1O3Jlc3VsdFs0KmkrMl09KFNpW3RbKGkrMiklNF0+PjgmMjU1XV50dD4+OCkmMjU1O3Jlc3VsdFs0KmkrM109KFNpW3RbKGkrMSklNF0mMjU1XV50dCkmMjU1fXJldHVybiByZXN1bHR9O3ZhciBNb2RlT2ZPcGVyYXRpb25FQ0I9ZnVuY3Rpb24oa2V5KXtpZighKHRoaXMgaW5zdGFuY2VvZiBNb2RlT2ZPcGVyYXRpb25FQ0IpKXt0aHJvdyBFcnJvcigiQUVTIG11c3QgYmUgaW5zdGFuaXRhdGVkIHdpdGggYG5ld2AiKX10aGlzLmRlc2NyaXB0aW9uPSJFbGVjdHJvbmljIENvZGUgQmxvY2siO3RoaXMubmFtZT0iZWNiIjt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25FQ0IucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXtwbGFpbnRleHQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0KTtpZihwbGFpbnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIHBsYWludGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBjaXBoZXJ0ZXh0PWNyZWF0ZUFycmF5KHBsYWludGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPTE2KXtjb3B5QXJyYXkocGxhaW50ZXh0LGJsb2NrLDAsaSxpKzE2KTtibG9jaz10aGlzLl9hZXMuZW5jcnlwdChibG9jayk7Y29weUFycmF5KGJsb2NrLGNpcGhlcnRleHQsaSl9cmV0dXJuIGNpcGhlcnRleHR9O01vZGVPZk9wZXJhdGlvbkVDQi5wcm90b3R5cGUuZGVjcnlwdD1mdW5jdGlvbihjaXBoZXJ0ZXh0KXtjaXBoZXJ0ZXh0PWNvZXJjZUFycmF5KGNpcGhlcnRleHQpO2lmKGNpcGhlcnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSBtdWx0aXBsZSBvZiAxNiBieXRlcykiKX12YXIgcGxhaW50ZXh0PWNyZWF0ZUFycmF5KGNpcGhlcnRleHQubGVuZ3RoKTt2YXIgYmxvY2s9Y3JlYXRlQXJyYXkoMTYpO2Zvcih2YXIgaT0wO2k8Y2lwaGVydGV4dC5sZW5ndGg7aSs9MTYpe2NvcHlBcnJheShjaXBoZXJ0ZXh0LGJsb2NrLDAsaSxpKzE2KTtibG9jaz10aGlzLl9hZXMuZGVjcnlwdChibG9jayk7Y29weUFycmF5KGJsb2NrLHBsYWludGV4dCxpKX1yZXR1cm4gcGxhaW50ZXh0fTt2YXIgTW9kZU9mT3BlcmF0aW9uQ0JDPWZ1bmN0aW9uKGtleSxpdil7aWYoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ0JDKSl7dGhyb3cgRXJyb3IoIkFFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgIil9dGhpcy5kZXNjcmlwdGlvbj0iQ2lwaGVyIEJsb2NrIENoYWluaW5nIjt0aGlzLm5hbWU9ImNiYyI7aWYoIWl2KXtpdj1jcmVhdGVBcnJheSgxNil9ZWxzZSBpZihpdi5sZW5ndGghPTE2KXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgaW5pdGlhbGF0aW9uIHZlY3RvciBzaXplIChtdXN0IGJlIDE2IGJ5dGVzKSIpfXRoaXMuX2xhc3RDaXBoZXJibG9jaz1jb2VyY2VBcnJheShpdix0cnVlKTt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25DQkMucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXtwbGFpbnRleHQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0KTtpZihwbGFpbnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIHBsYWludGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBjaXBoZXJ0ZXh0PWNyZWF0ZUFycmF5KHBsYWludGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPTE2KXtjb3B5QXJyYXkocGxhaW50ZXh0LGJsb2NrLDAsaSxpKzE2KTtmb3IodmFyIGo9MDtqPDE2O2orKyl7YmxvY2tbal1ePXRoaXMuX2xhc3RDaXBoZXJibG9ja1tqXX10aGlzLl9sYXN0Q2lwaGVyYmxvY2s9dGhpcy5fYWVzLmVuY3J5cHQoYmxvY2spO2NvcHlBcnJheSh0aGlzLl9sYXN0Q2lwaGVyYmxvY2ssY2lwaGVydGV4dCxpKX1yZXR1cm4gY2lwaGVydGV4dH07TW9kZU9mT3BlcmF0aW9uQ0JDLnByb3RvdHlwZS5kZWNyeXB0PWZ1bmN0aW9uKGNpcGhlcnRleHQpe2NpcGhlcnRleHQ9Y29lcmNlQXJyYXkoY2lwaGVydGV4dCk7aWYoY2lwaGVydGV4dC5sZW5ndGglMTYhPT0wKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgY2lwaGVydGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBwbGFpbnRleHQ9Y3JlYXRlQXJyYXkoY2lwaGVydGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxjaXBoZXJ0ZXh0Lmxlbmd0aDtpKz0xNil7Y29weUFycmF5KGNpcGhlcnRleHQsYmxvY2ssMCxpLGkrMTYpO2Jsb2NrPXRoaXMuX2Flcy5kZWNyeXB0KGJsb2NrKTtmb3IodmFyIGo9MDtqPDE2O2orKyl7cGxhaW50ZXh0W2kral09YmxvY2tbal1edGhpcy5fbGFzdENpcGhlcmJsb2NrW2pdfWNvcHlBcnJheShjaXBoZXJ0ZXh0LHRoaXMuX2xhc3RDaXBoZXJibG9jaywwLGksaSsxNil9cmV0dXJuIHBsYWludGV4dH07dmFyIE1vZGVPZk9wZXJhdGlvbkNGQj1mdW5jdGlvbihrZXksaXYsc2VnbWVudFNpemUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbkNGQikpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfXRoaXMuZGVzY3JpcHRpb249IkNpcGhlciBGZWVkYmFjayI7dGhpcy5uYW1lPSJjZmIiO2lmKCFpdil7aXY9Y3JlYXRlQXJyYXkoMTYpfWVsc2UgaWYoaXYubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGluaXRpYWxhdGlvbiB2ZWN0b3Igc2l6ZSAobXVzdCBiZSAxNiBzaXplKSIpfWlmKCFzZWdtZW50U2l6ZSl7c2VnbWVudFNpemU9MX10aGlzLnNlZ21lbnRTaXplPXNlZ21lbnRTaXplO3RoaXMuX3NoaWZ0UmVnaXN0ZXI9Y29lcmNlQXJyYXkoaXYsdHJ1ZSk7dGhpcy5fYWVzPW5ldyBBRVMoa2V5KX07TW9kZU9mT3BlcmF0aW9uQ0ZCLnByb3RvdHlwZS5lbmNyeXB0PWZ1bmN0aW9uKHBsYWludGV4dCl7aWYocGxhaW50ZXh0Lmxlbmd0aCV0aGlzLnNlZ21lbnRTaXplIT0wKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgc2VnbWVudFNpemUgYnl0ZXMpIil9dmFyIGVuY3J5cHRlZD1jb2VyY2VBcnJheShwbGFpbnRleHQsdHJ1ZSk7dmFyIHhvclNlZ21lbnQ7Zm9yKHZhciBpPTA7aTxlbmNyeXB0ZWQubGVuZ3RoO2krPXRoaXMuc2VnbWVudFNpemUpe3hvclNlZ21lbnQ9dGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fc2hpZnRSZWdpc3Rlcik7Zm9yKHZhciBqPTA7ajx0aGlzLnNlZ21lbnRTaXplO2orKyl7ZW5jcnlwdGVkW2kral1ePXhvclNlZ21lbnRbal19Y29weUFycmF5KHRoaXMuX3NoaWZ0UmVnaXN0ZXIsdGhpcy5fc2hpZnRSZWdpc3RlciwwLHRoaXMuc2VnbWVudFNpemUpO2NvcHlBcnJheShlbmNyeXB0ZWQsdGhpcy5fc2hpZnRSZWdpc3RlciwxNi10aGlzLnNlZ21lbnRTaXplLGksaSt0aGlzLnNlZ21lbnRTaXplKX1yZXR1cm4gZW5jcnlwdGVkfTtNb2RlT2ZPcGVyYXRpb25DRkIucHJvdG90eXBlLmRlY3J5cHQ9ZnVuY3Rpb24oY2lwaGVydGV4dCl7aWYoY2lwaGVydGV4dC5sZW5ndGgldGhpcy5zZWdtZW50U2l6ZSE9MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSBzZWdtZW50U2l6ZSBieXRlcykiKX12YXIgcGxhaW50ZXh0PWNvZXJjZUFycmF5KGNpcGhlcnRleHQsdHJ1ZSk7dmFyIHhvclNlZ21lbnQ7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPXRoaXMuc2VnbWVudFNpemUpe3hvclNlZ21lbnQ9dGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fc2hpZnRSZWdpc3Rlcik7Zm9yKHZhciBqPTA7ajx0aGlzLnNlZ21lbnRTaXplO2orKyl7cGxhaW50ZXh0W2kral1ePXhvclNlZ21lbnRbal19Y29weUFycmF5KHRoaXMuX3NoaWZ0UmVnaXN0ZXIsdGhpcy5fc2hpZnRSZWdpc3RlciwwLHRoaXMuc2VnbWVudFNpemUpO2NvcHlBcnJheShjaXBoZXJ0ZXh0LHRoaXMuX3NoaWZ0UmVnaXN0ZXIsMTYtdGhpcy5zZWdtZW50U2l6ZSxpLGkrdGhpcy5zZWdtZW50U2l6ZSl9cmV0dXJuIHBsYWludGV4dH07dmFyIE1vZGVPZk9wZXJhdGlvbk9GQj1mdW5jdGlvbihrZXksaXYpe2lmKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbk9GQikpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfXRoaXMuZGVzY3JpcHRpb249Ik91dHB1dCBGZWVkYmFjayI7dGhpcy5uYW1lPSJvZmIiO2lmKCFpdil7aXY9Y3JlYXRlQXJyYXkoMTYpfWVsc2UgaWYoaXYubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGluaXRpYWxhdGlvbiB2ZWN0b3Igc2l6ZSAobXVzdCBiZSAxNiBieXRlcykiKX10aGlzLl9sYXN0UHJlY2lwaGVyPWNvZXJjZUFycmF5KGl2LHRydWUpO3RoaXMuX2xhc3RQcmVjaXBoZXJJbmRleD0xNjt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25PRkIucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXt2YXIgZW5jcnlwdGVkPWNvZXJjZUFycmF5KHBsYWludGV4dCx0cnVlKTtmb3IodmFyIGk9MDtpPGVuY3J5cHRlZC5sZW5ndGg7aSsrKXtpZih0aGlzLl9sYXN0UHJlY2lwaGVySW5kZXg9PT0xNil7dGhpcy5fbGFzdFByZWNpcGhlcj10aGlzLl9hZXMuZW5jcnlwdCh0aGlzLl9sYXN0UHJlY2lwaGVyKTt0aGlzLl9sYXN0UHJlY2lwaGVySW5kZXg9MH1lbmNyeXB0ZWRbaV1ePXRoaXMuX2xhc3RQcmVjaXBoZXJbdGhpcy5fbGFzdFByZWNpcGhlckluZGV4KytdfXJldHVybiBlbmNyeXB0ZWR9O01vZGVPZk9wZXJhdGlvbk9GQi5wcm90b3R5cGUuZGVjcnlwdD1Nb2RlT2ZPcGVyYXRpb25PRkIucHJvdG90eXBlLmVuY3J5cHQ7dmFyIENvdW50ZXI9ZnVuY3Rpb24oaW5pdGlhbFZhbHVlKXtpZighKHRoaXMgaW5zdGFuY2VvZiBDb3VudGVyKSl7dGhyb3cgRXJyb3IoIkNvdW50ZXIgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfWlmKGluaXRpYWxWYWx1ZSE9PTAmJiFpbml0aWFsVmFsdWUpe2luaXRpYWxWYWx1ZT0xfWlmKHR5cGVvZiBpbml0aWFsVmFsdWU9PT0ibnVtYmVyIil7dGhpcy5fY291bnRlcj1jcmVhdGVBcnJheSgxNik7dGhpcy5zZXRWYWx1ZShpbml0aWFsVmFsdWUpfWVsc2V7dGhpcy5zZXRCeXRlcyhpbml0aWFsVmFsdWUpfX07Q291bnRlci5wcm90b3R5cGUuc2V0VmFsdWU9ZnVuY3Rpb24odmFsdWUpe2lmKHR5cGVvZiB2YWx1ZSE9PSJudW1iZXIifHxwYXJzZUludCh2YWx1ZSkhPXZhbHVlKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgY291bnRlciB2YWx1ZSAobXVzdCBiZSBhbiBpbnRlZ2VyKSIpfWlmKHZhbHVlPk51bWJlci5NQVhfU0FGRV9JTlRFR0VSKXt0aHJvdyBuZXcgRXJyb3IoImludGVnZXIgdmFsdWUgb3V0IG9mIHNhZmUgcmFuZ2UiKX1mb3IodmFyIGluZGV4PTE1O2luZGV4Pj0wOy0taW5kZXgpe3RoaXMuX2NvdW50ZXJbaW5kZXhdPXZhbHVlJTI1Njt2YWx1ZT1wYXJzZUludCh2YWx1ZS8yNTYpfX07Q291bnRlci5wcm90b3R5cGUuc2V0Qnl0ZXM9ZnVuY3Rpb24oYnl0ZXMpe2J5dGVzPWNvZXJjZUFycmF5KGJ5dGVzLHRydWUpO2lmKGJ5dGVzLmxlbmd0aCE9MTYpe3Rocm93IG5ldyBFcnJvcigiaW52YWxpZCBjb3VudGVyIGJ5dGVzIHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpIil9dGhpcy5fY291bnRlcj1ieXRlc307Q291bnRlci5wcm90b3R5cGUuaW5jcmVtZW50PWZ1bmN0aW9uKCl7Zm9yKHZhciBpPTE1O2k+PTA7aS0tKXtpZih0aGlzLl9jb3VudGVyW2ldPT09MjU1KXt0aGlzLl9jb3VudGVyW2ldPTB9ZWxzZXt0aGlzLl9jb3VudGVyW2ldKys7YnJlYWt9fX07dmFyIE1vZGVPZk9wZXJhdGlvbkNUUj1mdW5jdGlvbihrZXksY291bnRlcil7aWYoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ1RSKSl7dGhyb3cgRXJyb3IoIkFFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgIil9dGhpcy5kZXNjcmlwdGlvbj0iQ291bnRlciI7dGhpcy5uYW1lPSJjdHIiO2lmKCEoY291bnRlciBpbnN0YW5jZW9mIENvdW50ZXIpKXtjb3VudGVyPW5ldyBDb3VudGVyKGNvdW50ZXIpfXRoaXMuX2NvdW50ZXI9Y291bnRlcjt0aGlzLl9yZW1haW5pbmdDb3VudGVyPW51bGw7dGhpcy5fcmVtYWluaW5nQ291bnRlckluZGV4PTE2O3RoaXMuX2Flcz1uZXcgQUVTKGtleSl9O01vZGVPZk9wZXJhdGlvbkNUUi5wcm90b3R5cGUuZW5jcnlwdD1mdW5jdGlvbihwbGFpbnRleHQpe3ZhciBlbmNyeXB0ZWQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0LHRydWUpO2Zvcih2YXIgaT0wO2k8ZW5jcnlwdGVkLmxlbmd0aDtpKyspe2lmKHRoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleD09PTE2KXt0aGlzLl9yZW1haW5pbmdDb3VudGVyPXRoaXMuX2Flcy5lbmNyeXB0KHRoaXMuX2NvdW50ZXIuX2NvdW50ZXIpO3RoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleD0wO3RoaXMuX2NvdW50ZXIuaW5jcmVtZW50KCl9ZW5jcnlwdGVkW2ldXj10aGlzLl9yZW1haW5pbmdDb3VudGVyW3RoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleCsrXX1yZXR1cm4gZW5jcnlwdGVkfTtNb2RlT2ZPcGVyYXRpb25DVFIucHJvdG90eXBlLmRlY3J5cHQ9TW9kZU9mT3BlcmF0aW9uQ1RSLnByb3RvdHlwZS5lbmNyeXB0O2Z1bmN0aW9uIHBrY3M3cGFkKGRhdGEpe2RhdGE9Y29lcmNlQXJyYXkoZGF0YSx0cnVlKTt2YXIgcGFkZGVyPTE2LWRhdGEubGVuZ3RoJTE2O3ZhciByZXN1bHQ9Y3JlYXRlQXJyYXkoZGF0YS5sZW5ndGgrcGFkZGVyKTtjb3B5QXJyYXkoZGF0YSxyZXN1bHQpO2Zvcih2YXIgaT1kYXRhLmxlbmd0aDtpPHJlc3VsdC5sZW5ndGg7aSsrKXtyZXN1bHRbaV09cGFkZGVyfXJldHVybiByZXN1bHR9ZnVuY3Rpb24gcGtjczdzdHJpcChkYXRhKXtkYXRhPWNvZXJjZUFycmF5KGRhdGEsdHJ1ZSk7aWYoZGF0YS5sZW5ndGg8MTYpe3Rocm93IG5ldyBFcnJvcigiUEtDUyM3IGludmFsaWQgbGVuZ3RoIil9dmFyIHBhZGRlcj1kYXRhW2RhdGEubGVuZ3RoLTFdO2lmKHBhZGRlcj4xNil7dGhyb3cgbmV3IEVycm9yKCJQS0NTIzcgcGFkZGluZyBieXRlIG91dCBvZiByYW5nZSIpfXZhciBsZW5ndGg9ZGF0YS5sZW5ndGgtcGFkZGVyO2Zvcih2YXIgaT0wO2k8cGFkZGVyO2krKyl7aWYoZGF0YVtsZW5ndGgraV0hPT1wYWRkZXIpe3Rocm93IG5ldyBFcnJvcigiUEtDUyM3IGludmFsaWQgcGFkZGluZyBieXRlIil9fXZhciByZXN1bHQ9Y3JlYXRlQXJyYXkobGVuZ3RoKTtjb3B5QXJyYXkoZGF0YSxyZXN1bHQsMCwwLGxlbmd0aCk7cmV0dXJuIHJlc3VsdH12YXIgYWVzanM9e0FFUzpBRVMsQ291bnRlcjpDb3VudGVyLE1vZGVPZk9wZXJhdGlvbjp7ZWNiOk1vZGVPZk9wZXJhdGlvbkVDQixjYmM6TW9kZU9mT3BlcmF0aW9uQ0JDLGNmYjpNb2RlT2ZPcGVyYXRpb25DRkIsb2ZiOk1vZGVPZk9wZXJhdGlvbk9GQixjdHI6TW9kZU9mT3BlcmF0aW9uQ1RSfSx1dGlsczp7aGV4OmNvbnZlcnRIZXgsdXRmODpjb252ZXJ0VXRmOH0scGFkZGluZzp7cGtjczc6e3BhZDpwa2NzN3BhZCxzdHJpcDpwa2NzN3N0cmlwfX0sX2FycmF5VGVzdDp7Y29lcmNlQXJyYXk6Y29lcmNlQXJyYXksY3JlYXRlQXJyYXk6Y3JlYXRlQXJyYXksY29weUFycmF5OmNvcHlBcnJheX19O2lmKHR5cGVvZiBleHBvcnRzIT09InVuZGVmaW5lZCIpe21vZHVsZS5leHBvcnRzPWFlc2pzfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PSJmdW5jdGlvbiImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmdW5jdGlvbigpe3JldHVybiBhZXNqc30pfWVsc2V7aWYocm9vdC5hZXNqcyl7YWVzanMuX2Flc2pzPXJvb3QuYWVzanN9cm9vdC5hZXNqcz1hZXNqc319KSh0aGlzKX0se31dLDE0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz17bmV3SW52YWxpZEFzbjFFcnJvcjpmdW5jdGlvbihtc2cpe3ZhciBlPW5ldyBFcnJvcjtlLm5hbWU9IkludmFsaWRBc24xRXJyb3IiO2UubWVzc2FnZT1tc2d8fCIiO3JldHVybiBlfX19LHt9XSwxNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGVycm9ycz1yZXF1aXJlKCIuL2Vycm9ycyIpO3ZhciB0eXBlcz1yZXF1aXJlKCIuL3R5cGVzIik7dmFyIFJlYWRlcj1yZXF1aXJlKCIuL3JlYWRlciIpO3ZhciBXcml0ZXI9cmVxdWlyZSgiLi93cml0ZXIiKTttb2R1bGUuZXhwb3J0cz17UmVhZGVyOlJlYWRlcixXcml0ZXI6V3JpdGVyfTtmb3IodmFyIHQgaW4gdHlwZXMpe2lmKHR5cGVzLmhhc093blByb3BlcnR5KHQpKW1vZHVsZS5leHBvcnRzW3RdPXR5cGVzW3RdfWZvcih2YXIgZSBpbiBlcnJvcnMpe2lmKGVycm9ycy5oYXNPd25Qcm9wZXJ0eShlKSltb2R1bGUuZXhwb3J0c1tlXT1lcnJvcnNbZV19fSx7Ii4vZXJyb3JzIjoxNCwiLi9yZWFkZXIiOjE2LCIuL3R5cGVzIjoxNywiLi93cml0ZXIiOjE4fV0sMTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBhc3NlcnQ9cmVxdWlyZSgiYXNzZXJ0Iik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlci1idWZmZXIiKS5CdWZmZXI7dmFyIEFTTjE9cmVxdWlyZSgiLi90eXBlcyIpO3ZhciBlcnJvcnM9cmVxdWlyZSgiLi9lcnJvcnMiKTt2YXIgbmV3SW52YWxpZEFzbjFFcnJvcj1lcnJvcnMubmV3SW52YWxpZEFzbjFFcnJvcjtmdW5jdGlvbiBSZWFkZXIoZGF0YSl7aWYoIWRhdGF8fCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpdGhyb3cgbmV3IFR5cGVFcnJvcigiZGF0YSBtdXN0IGJlIGEgbm9kZSBCdWZmZXIiKTt0aGlzLl9idWY9ZGF0YTt0aGlzLl9zaXplPWRhdGEubGVuZ3RoO3RoaXMuX2xlbj0wO3RoaXMuX29mZnNldD0wfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkZXIucHJvdG90eXBlLCJsZW5ndGgiLHtlbnVtZXJhYmxlOnRydWUsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xlbn19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwib2Zmc2V0Iix7ZW51bWVyYWJsZTp0cnVlLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9vZmZzZXR9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRlci5wcm90b3R5cGUsInJlbWFpbiIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zaXplLXRoaXMuX29mZnNldH19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwiYnVmZmVyIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2J1Zi5zbGljZSh0aGlzLl9vZmZzZXQpfX0pO1JlYWRlci5wcm90b3R5cGUucmVhZEJ5dGU9ZnVuY3Rpb24ocGVlayl7aWYodGhpcy5fc2l6ZS10aGlzLl9vZmZzZXQ8MSlyZXR1cm4gbnVsbDt2YXIgYj10aGlzLl9idWZbdGhpcy5fb2Zmc2V0XSYyNTU7aWYoIXBlZWspdGhpcy5fb2Zmc2V0Kz0xO3JldHVybiBifTtSZWFkZXIucHJvdG90eXBlLnBlZWs9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZWFkQnl0ZSh0cnVlKX07UmVhZGVyLnByb3RvdHlwZS5yZWFkTGVuZ3RoPWZ1bmN0aW9uKG9mZnNldCl7aWYob2Zmc2V0PT09dW5kZWZpbmVkKW9mZnNldD10aGlzLl9vZmZzZXQ7aWYob2Zmc2V0Pj10aGlzLl9zaXplKXJldHVybiBudWxsO3ZhciBsZW5CPXRoaXMuX2J1ZltvZmZzZXQrK10mMjU1O2lmKGxlbkI9PT1udWxsKXJldHVybiBudWxsO2lmKChsZW5CJjEyOCk9PT0xMjgpe2xlbkImPTEyNztpZihsZW5CPT09MCl0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCJJbmRlZmluaXRlIGxlbmd0aCBub3Qgc3VwcG9ydGVkIik7aWYobGVuQj40KXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoImVuY29kaW5nIHRvbyBsb25nIik7aWYodGhpcy5fc2l6ZS1vZmZzZXQ8bGVuQilyZXR1cm4gbnVsbDt0aGlzLl9sZW49MDtmb3IodmFyIGk9MDtpPGxlbkI7aSsrKXRoaXMuX2xlbj0odGhpcy5fbGVuPDw4KSsodGhpcy5fYnVmW29mZnNldCsrXSYyNTUpfWVsc2V7dGhpcy5fbGVuPWxlbkJ9cmV0dXJuIG9mZnNldH07UmVhZGVyLnByb3RvdHlwZS5yZWFkU2VxdWVuY2U9ZnVuY3Rpb24odGFnKXt2YXIgc2VxPXRoaXMucGVlaygpO2lmKHNlcT09PW51bGwpcmV0dXJuIG51bGw7aWYodGFnIT09dW5kZWZpbmVkJiZ0YWchPT1zZXEpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiRXhwZWN0ZWQgMHgiK3RhZy50b1N0cmluZygxNikrIjogZ290IDB4IitzZXEudG9TdHJpbmcoMTYpKTt2YXIgbz10aGlzLnJlYWRMZW5ndGgodGhpcy5fb2Zmc2V0KzEpO2lmKG89PT1udWxsKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO3JldHVybiBzZXF9O1JlYWRlci5wcm90b3R5cGUucmVhZEludD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkVGFnKEFTTjEuSW50ZWdlcil9O1JlYWRlci5wcm90b3R5cGUucmVhZEJvb2xlYW49ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVhZFRhZyhBU04xLkJvb2xlYW4pPT09MD9mYWxzZTp0cnVlfTtSZWFkZXIucHJvdG90eXBlLnJlYWRFbnVtZXJhdGlvbj1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkVGFnKEFTTjEuRW51bWVyYXRpb24pfTtSZWFkZXIucHJvdG90eXBlLnJlYWRTdHJpbmc9ZnVuY3Rpb24odGFnLHJldGJ1Zil7aWYoIXRhZyl0YWc9QVNOMS5PY3RldFN0cmluZzt2YXIgYj10aGlzLnBlZWsoKTtpZihiPT09bnVsbClyZXR1cm4gbnVsbDtpZihiIT09dGFnKXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoIkV4cGVjdGVkIDB4Iit0YWcudG9TdHJpbmcoMTYpKyI6IGdvdCAweCIrYi50b1N0cmluZygxNikpO3ZhciBvPXRoaXMucmVhZExlbmd0aCh0aGlzLl9vZmZzZXQrMSk7aWYobz09PW51bGwpcmV0dXJuIG51bGw7aWYodGhpcy5sZW5ndGg+dGhpcy5fc2l6ZS1vKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO2lmKHRoaXMubGVuZ3RoPT09MClyZXR1cm4gcmV0YnVmP0J1ZmZlci5hbGxvYygwKToiIjt2YXIgc3RyPXRoaXMuX2J1Zi5zbGljZSh0aGlzLl9vZmZzZXQsdGhpcy5fb2Zmc2V0K3RoaXMubGVuZ3RoKTt0aGlzLl9vZmZzZXQrPXRoaXMubGVuZ3RoO3JldHVybiByZXRidWY/c3RyOnN0ci50b1N0cmluZygidXRmOCIpfTtSZWFkZXIucHJvdG90eXBlLnJlYWRPSUQ9ZnVuY3Rpb24odGFnKXtpZighdGFnKXRhZz1BU04xLk9JRDt2YXIgYj10aGlzLnJlYWRTdHJpbmcodGFnLHRydWUpO2lmKGI9PT1udWxsKXJldHVybiBudWxsO3ZhciB2YWx1ZXM9W107dmFyIHZhbHVlPTA7Zm9yKHZhciBpPTA7aTxiLmxlbmd0aDtpKyspe3ZhciBieXRlPWJbaV0mMjU1O3ZhbHVlPDw9Nzt2YWx1ZSs9Ynl0ZSYxMjc7aWYoKGJ5dGUmMTI4KT09PTApe3ZhbHVlcy5wdXNoKHZhbHVlKTt2YWx1ZT0wfX12YWx1ZT12YWx1ZXMuc2hpZnQoKTt2YWx1ZXMudW5zaGlmdCh2YWx1ZSU0MCk7dmFsdWVzLnVuc2hpZnQodmFsdWUvNDA+PjApO3JldHVybiB2YWx1ZXMuam9pbigiLiIpfTtSZWFkZXIucHJvdG90eXBlLl9yZWFkVGFnPWZ1bmN0aW9uKHRhZyl7YXNzZXJ0Lm9rKHRhZyE9PXVuZGVmaW5lZCk7dmFyIGI9dGhpcy5wZWVrKCk7aWYoYj09PW51bGwpcmV0dXJuIG51bGw7aWYoYiE9PXRhZyl0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCJFeHBlY3RlZCAweCIrdGFnLnRvU3RyaW5nKDE2KSsiOiBnb3QgMHgiK2IudG9TdHJpbmcoMTYpKTt2YXIgbz10aGlzLnJlYWRMZW5ndGgodGhpcy5fb2Zmc2V0KzEpO2lmKG89PT1udWxsKXJldHVybiBudWxsO2lmKHRoaXMubGVuZ3RoPjQpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiSW50ZWdlciB0b28gbG9uZzogIit0aGlzLmxlbmd0aCk7aWYodGhpcy5sZW5ndGg+dGhpcy5fc2l6ZS1vKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO3ZhciBmYj10aGlzLl9idWZbdGhpcy5fb2Zmc2V0XTt2YXIgdmFsdWU9MDtmb3IodmFyIGk9MDtpPHRoaXMubGVuZ3RoO2krKyl7dmFsdWU8PD04O3ZhbHVlfD10aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdJjI1NX1pZigoZmImMTI4KT09PTEyOCYmaSE9PTQpdmFsdWUtPTE8PGkqODtyZXR1cm4gdmFsdWU+PjB9O21vZHVsZS5leHBvcnRzPVJlYWRlcn0seyIuL2Vycm9ycyI6MTQsIi4vdHlwZXMiOjE3LGFzc2VydDoyMCwic2FmZXItYnVmZmVyIjo4M31dLDE3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz17RU9DOjAsQm9vbGVhbjoxLEludGVnZXI6MixCaXRTdHJpbmc6MyxPY3RldFN0cmluZzo0LE51bGw6NSxPSUQ6NixPYmplY3REZXNjcmlwdG9yOjcsRXh0ZXJuYWw6OCxSZWFsOjksRW51bWVyYXRpb246MTAsUERWOjExLFV0ZjhTdHJpbmc6MTIsUmVsYXRpdmVPSUQ6MTMsU2VxdWVuY2U6MTYsU2V0OjE3LE51bWVyaWNTdHJpbmc6MTgsUHJpbnRhYmxlU3RyaW5nOjE5LFQ2MVN0cmluZzoyMCxWaWRlb3RleFN0cmluZzoyMSxJQTVTdHJpbmc6MjIsVVRDVGltZToyMyxHZW5lcmFsaXplZFRpbWU6MjQsR3JhcGhpY1N0cmluZzoyNSxWaXNpYmxlU3RyaW5nOjI2LEdlbmVyYWxTdHJpbmc6MjgsVW5pdmVyc2FsU3RyaW5nOjI5LENoYXJhY3RlclN0cmluZzozMCxCTVBTdHJpbmc6MzEsQ29uc3RydWN0b3I6MzIsQ29udGV4dDoxMjh9fSx7fV0sMTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBhc3NlcnQ9cmVxdWlyZSgiYXNzZXJ0Iik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlci1idWZmZXIiKS5CdWZmZXI7dmFyIEFTTjE9cmVxdWlyZSgiLi90eXBlcyIpO3ZhciBlcnJvcnM9cmVxdWlyZSgiLi9lcnJvcnMiKTt2YXIgbmV3SW52YWxpZEFzbjFFcnJvcj1lcnJvcnMubmV3SW52YWxpZEFzbjFFcnJvcjt2YXIgREVGQVVMVF9PUFRTPXtzaXplOjEwMjQsZ3Jvd3RoRmFjdG9yOjh9O2Z1bmN0aW9uIG1lcmdlKGZyb20sdG8pe2Fzc2VydC5vayhmcm9tKTthc3NlcnQuZXF1YWwodHlwZW9mIGZyb20sIm9iamVjdCIpO2Fzc2VydC5vayh0byk7YXNzZXJ0LmVxdWFsKHR5cGVvZiB0bywib2JqZWN0Iik7dmFyIGtleXM9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZnJvbSk7a2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7aWYodG9ba2V5XSlyZXR1cm47dmFyIHZhbHVlPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZnJvbSxrZXkpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0byxrZXksdmFsdWUpfSk7cmV0dXJuIHRvfWZ1bmN0aW9uIFdyaXRlcihvcHRpb25zKXtvcHRpb25zPW1lcmdlKERFRkFVTFRfT1BUUyxvcHRpb25zfHx7fSk7dGhpcy5fYnVmPUJ1ZmZlci5hbGxvYyhvcHRpb25zLnNpemV8fDEwMjQpO3RoaXMuX3NpemU9dGhpcy5fYnVmLmxlbmd0aDt0aGlzLl9vZmZzZXQ9MDt0aGlzLl9vcHRpb25zPW9wdGlvbnM7dGhpcy5fc2VxPVtdfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0ZXIucHJvdG90eXBlLCJidWZmZXIiLHtnZXQ6ZnVuY3Rpb24oKXtpZih0aGlzLl9zZXEubGVuZ3RoKXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IodGhpcy5fc2VxLmxlbmd0aCsiIHVuZW5kZWQgc2VxdWVuY2UocykiKTtyZXR1cm4gdGhpcy5fYnVmLnNsaWNlKDAsdGhpcy5fb2Zmc2V0KX19KTtXcml0ZXIucHJvdG90eXBlLndyaXRlQnl0ZT1mdW5jdGlvbihiKXtpZih0eXBlb2YgYiE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTt0aGlzLl9lbnN1cmUoMSk7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT1ifTtXcml0ZXIucHJvdG90eXBlLndyaXRlSW50PWZ1bmN0aW9uKGksdGFnKXtpZih0eXBlb2YgaSE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuSW50ZWdlcjt2YXIgc3o9NDt3aGlsZSgoKGkmNDI4NjU3ODY4OCk9PT0wfHwoaSY0Mjg2NTc4Njg4KT09PTQyODY1Nzg2ODg+PjApJiZzej4xKXtzei0tO2k8PD04fWlmKHN6PjQpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiQkVSIGludHMgY2Fubm90IGJlID4gMHhmZmZmZmZmZiIpO3RoaXMuX2Vuc3VyZSgyK3N6KTt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPXRhZzt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPXN6O3doaWxlKHN6LS0gPjApe3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109KGkmNDI3ODE5MDA4MCk+Pj4yNDtpPDw9OH19O1dyaXRlci5wcm90b3R5cGUud3JpdGVOdWxsPWZ1bmN0aW9uKCl7dGhpcy53cml0ZUJ5dGUoQVNOMS5OdWxsKTt0aGlzLndyaXRlQnl0ZSgwKX07V3JpdGVyLnByb3RvdHlwZS53cml0ZUVudW1lcmF0aW9uPWZ1bmN0aW9uKGksdGFnKXtpZih0eXBlb2YgaSE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuRW51bWVyYXRpb247cmV0dXJuIHRoaXMud3JpdGVJbnQoaSx0YWcpfTtXcml0ZXIucHJvdG90eXBlLndyaXRlQm9vbGVhbj1mdW5jdGlvbihiLHRhZyl7aWYodHlwZW9mIGIhPT0iYm9vbGVhbiIpdGhyb3cgbmV3IFR5cGVFcnJvcigiYXJndW1lbnQgbXVzdCBiZSBhIEJvb2xlYW4iKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuQm9vbGVhbjt0aGlzLl9lbnN1cmUoMyk7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT10YWc7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT0xO3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109Yj8yNTU6MH07V3JpdGVyLnByb3RvdHlwZS53cml0ZVN0cmluZz1mdW5jdGlvbihzLHRhZyl7aWYodHlwZW9mIHMhPT0ic3RyaW5nIil0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nICh3YXM6ICIrdHlwZW9mIHMrIikiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuT2N0ZXRTdHJpbmc7dmFyIGxlbj1CdWZmZXIuYnl0ZUxlbmd0aChzKTt0aGlzLndyaXRlQnl0ZSh0YWcpO3RoaXMud3JpdGVMZW5ndGgobGVuKTtpZihsZW4pe3RoaXMuX2Vuc3VyZShsZW4pO3RoaXMuX2J1Zi53cml0ZShzLHRoaXMuX29mZnNldCk7dGhpcy5fb2Zmc2V0Kz1sZW59fTtXcml0ZXIucHJvdG90eXBlLndyaXRlQnVmZmVyPWZ1bmN0aW9uKGJ1Zix0YWcpe2lmKHR5cGVvZiB0YWchPT0ibnVtYmVyIil0aHJvdyBuZXcgVHlwZUVycm9yKCJ0YWcgbXVzdCBiZSBhIG51bWJlciIpO2lmKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSl0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgYnVmZmVyIik7dGhpcy53cml0ZUJ5dGUodGFnKTt0aGlzLndyaXRlTGVuZ3RoKGJ1Zi5sZW5ndGgpO3RoaXMuX2Vuc3VyZShidWYubGVuZ3RoKTtidWYuY29weSh0aGlzLl9idWYsdGhpcy5fb2Zmc2V0LDAsYnVmLmxlbmd0aCk7dGhpcy5fb2Zmc2V0Kz1idWYubGVuZ3RofTtXcml0ZXIucHJvdG90eXBlLndyaXRlU3RyaW5nQXJyYXk9ZnVuY3Rpb24oc3RyaW5ncyl7aWYoIXN0cmluZ3MgaW5zdGFuY2VvZiBBcnJheSl0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5W1N0cmluZ10iKTt2YXIgc2VsZj10aGlzO3N0cmluZ3MuZm9yRWFjaChmdW5jdGlvbihzKXtzZWxmLndyaXRlU3RyaW5nKHMpfSl9O1dyaXRlci5wcm90b3R5cGUud3JpdGVPSUQ9ZnVuY3Rpb24ocyx0YWcpe2lmKHR5cGVvZiBzIT09InN0cmluZyIpdGhyb3cgbmV3IFR5cGVFcnJvcigiYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZyIpO2lmKHR5cGVvZiB0YWchPT0ibnVtYmVyIil0YWc9QVNOMS5PSUQ7aWYoIS9eKFswLTldK1wuKXszLH1bMC05XSskLy50ZXN0KHMpKXRocm93IG5ldyBFcnJvcigiYXJndW1lbnQgaXMgbm90IGEgdmFsaWQgT0lEIHN0cmluZyIpO2Z1bmN0aW9uIGVuY29kZU9jdGV0KGJ5dGVzLG9jdGV0KXtpZihvY3RldDwxMjgpe2J5dGVzLnB1c2gob2N0ZXQpfWVsc2UgaWYob2N0ZXQ8MTYzODQpe2J5dGVzLnB1c2gob2N0ZXQ+Pj43fDEyOCk7Ynl0ZXMucHVzaChvY3RldCYxMjcpfWVsc2UgaWYob2N0ZXQ8MjA5NzE1Mil7Ynl0ZXMucHVzaChvY3RldD4+PjE0fDEyOCk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj43fDEyOCkmMjU1KTtieXRlcy5wdXNoKG9jdGV0JjEyNyl9ZWxzZSBpZihvY3RldDwyNjg0MzU0NTYpe2J5dGVzLnB1c2gob2N0ZXQ+Pj4yMXwxMjgpO2J5dGVzLnB1c2goKG9jdGV0Pj4+MTR8MTI4KSYyNTUpO2J5dGVzLnB1c2goKG9jdGV0Pj4+N3wxMjgpJjI1NSk7Ynl0ZXMucHVzaChvY3RldCYxMjcpfWVsc2V7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4yOHwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4yMXwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4xNHwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj43fDEyOCkmMjU1KTtieXRlcy5wdXNoKG9jdGV0JjEyNyl9fXZhciB0bXA9cy5zcGxpdCgiLiIpO3ZhciBieXRlcz1bXTtieXRlcy5wdXNoKHBhcnNlSW50KHRtcFswXSwxMCkqNDArcGFyc2VJbnQodG1wWzFdLDEwKSk7dG1wLnNsaWNlKDIpLmZvckVhY2goZnVuY3Rpb24oYil7ZW5jb2RlT2N0ZXQoYnl0ZXMscGFyc2VJbnQoYiwxMCkpfSk7dmFyIHNlbGY9dGhpczt0aGlzLl9lbnN1cmUoMitieXRlcy5sZW5ndGgpO3RoaXMud3JpdGVCeXRlKHRhZyk7dGhpcy53cml0ZUxlbmd0aChieXRlcy5sZW5ndGgpO2J5dGVzLmZvckVhY2goZnVuY3Rpb24oYil7c2VsZi53cml0ZUJ5dGUoYil9KX07V3JpdGVyLnByb3RvdHlwZS53cml0ZUxlbmd0aD1mdW5jdGlvbihsZW4pe2lmKHR5cGVvZiBsZW4hPT0ibnVtYmVyIil0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgTnVtYmVyIik7dGhpcy5fZW5zdXJlKDQpO2lmKGxlbjw9MTI3KXt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPWxlbn1lbHNlIGlmKGxlbjw9MjU1KXt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPTEyOTt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPWxlbn1lbHNlIGlmKGxlbjw9NjU1MzUpe3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109MTMwO3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVuPj44O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVufWVsc2UgaWYobGVuPD0xNjc3NzIxNSl7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT0xMzE7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT1sZW4+PjE2O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVuPj44O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVufWVsc2V7dGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiTGVuZ3RoIHRvbyBsb25nICg+IDQgYnl0ZXMpIil9fTtXcml0ZXIucHJvdG90eXBlLnN0YXJ0U2VxdWVuY2U9ZnVuY3Rpb24odGFnKXtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuU2VxdWVuY2V8QVNOMS5Db25zdHJ1Y3Rvcjt0aGlzLndyaXRlQnl0ZSh0YWcpO3RoaXMuX3NlcS5wdXNoKHRoaXMuX29mZnNldCk7dGhpcy5fZW5zdXJlKDMpO3RoaXMuX29mZnNldCs9M307V3JpdGVyLnByb3RvdHlwZS5lbmRTZXF1ZW5jZT1mdW5jdGlvbigpe3ZhciBzZXE9dGhpcy5fc2VxLnBvcCgpO3ZhciBzdGFydD1zZXErMzt2YXIgbGVuPXRoaXMuX29mZnNldC1zdGFydDtpZihsZW48PTEyNyl7dGhpcy5fc2hpZnQoc3RhcnQsbGVuLC0yKTt0aGlzLl9idWZbc2VxXT1sZW59ZWxzZSBpZihsZW48PTI1NSl7dGhpcy5fc2hpZnQoc3RhcnQsbGVuLC0xKTt0aGlzLl9idWZbc2VxXT0xMjk7dGhpcy5fYnVmW3NlcSsxXT1sZW59ZWxzZSBpZihsZW48PTY1NTM1KXt0aGlzLl9idWZbc2VxXT0xMzA7dGhpcy5fYnVmW3NlcSsxXT1sZW4+Pjg7dGhpcy5fYnVmW3NlcSsyXT1sZW59ZWxzZSBpZihsZW48PTE2Nzc3MjE1KXt0aGlzLl9zaGlmdChzdGFydCxsZW4sMSk7dGhpcy5fYnVmW3NlcV09MTMxO3RoaXMuX2J1ZltzZXErMV09bGVuPj4xNjt0aGlzLl9idWZbc2VxKzJdPWxlbj4+ODt0aGlzLl9idWZbc2VxKzNdPWxlbn1lbHNle3Rocm93IG5ld0ludmFsaWRBc24xRXJyb3IoIlNlcXVlbmNlIHRvbyBsb25nIil9fTtXcml0ZXIucHJvdG90eXBlLl9zaGlmdD1mdW5jdGlvbihzdGFydCxsZW4sc2hpZnQpe2Fzc2VydC5vayhzdGFydCE9PXVuZGVmaW5lZCk7YXNzZXJ0Lm9rKGxlbiE9PXVuZGVmaW5lZCk7YXNzZXJ0Lm9rKHNoaWZ0KTt0aGlzLl9idWYuY29weSh0aGlzLl9idWYsc3RhcnQrc2hpZnQsc3RhcnQsc3RhcnQrbGVuKTt0aGlzLl9vZmZzZXQrPXNoaWZ0fTtXcml0ZXIucHJvdG90eXBlLl9lbnN1cmU9ZnVuY3Rpb24obGVuKXthc3NlcnQub2sobGVuKTtpZih0aGlzLl9zaXplLXRoaXMuX29mZnNldDxsZW4pe3ZhciBzej10aGlzLl9zaXplKnRoaXMuX29wdGlvbnMuZ3Jvd3RoRmFjdG9yO2lmKHN6LXRoaXMuX29mZnNldDxsZW4pc3orPWxlbjt2YXIgYnVmPUJ1ZmZlci5hbGxvYyhzeik7dGhpcy5fYnVmLmNvcHkoYnVmLDAsMCx0aGlzLl9vZmZzZXQpO3RoaXMuX2J1Zj1idWY7dGhpcy5fc2l6ZT1zen19O21vZHVsZS5leHBvcnRzPVdyaXRlcn0seyIuL2Vycm9ycyI6MTQsIi4vdHlwZXMiOjE3LGFzc2VydDoyMCwic2FmZXItYnVmZmVyIjo4M31dLDE5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgQmVyPXJlcXVpcmUoIi4vYmVyL2luZGV4Iik7bW9kdWxlLmV4cG9ydHM9e0JlcjpCZXIsQmVyUmVhZGVyOkJlci5SZWFkZXIsQmVyV3JpdGVyOkJlci5Xcml0ZXJ9fSx7Ii4vYmVyL2luZGV4IjoxNX1dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXsidXNlIHN0cmljdCI7dmFyIG9iamVjdEFzc2lnbj1yZXF1aXJlKCJvYmplY3QtYXNzaWduIik7ZnVuY3Rpb24gY29tcGFyZShhLGIpe2lmKGE9PT1iKXtyZXR1cm4gMH12YXIgeD1hLmxlbmd0aDt2YXIgeT1iLmxlbmd0aDtmb3IodmFyIGk9MCxsZW49TWF0aC5taW4oeCx5KTtpPGxlbjsrK2kpe2lmKGFbaV0hPT1iW2ldKXt4PWFbaV07eT1iW2ldO2JyZWFrfX1pZih4PHkpe3JldHVybi0xfWlmKHk8eCl7cmV0dXJuIDF9cmV0dXJuIDB9ZnVuY3Rpb24gaXNCdWZmZXIoYil7aWYoZ2xvYmFsLkJ1ZmZlciYmdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXI9PT0iZnVuY3Rpb24iKXtyZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKX1yZXR1cm4hIShiIT1udWxsJiZiLl9pc0J1ZmZlcil9dmFyIHV0aWw9cmVxdWlyZSgidXRpbC8iKTt2YXIgaGFzT3duPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7dmFyIHBTbGljZT1BcnJheS5wcm90b3R5cGUuc2xpY2U7dmFyIGZ1bmN0aW9uc0hhdmVOYW1lcz1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbiBmb28oKXt9Lm5hbWU9PT0iZm9vIn0oKTtmdW5jdGlvbiBwVG9TdHJpbmcob2JqKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iail9ZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zil7aWYoaXNCdWZmZXIoYXJyYnVmKSl7cmV0dXJuIGZhbHNlfWlmKHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIhPT0iZnVuY3Rpb24iKXtyZXR1cm4gZmFsc2V9aWYodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldz09PSJmdW5jdGlvbiIpe3JldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKX1pZighYXJyYnVmKXtyZXR1cm4gZmFsc2V9aWYoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpe3JldHVybiB0cnVlfWlmKGFycmJ1Zi5idWZmZXImJmFycmJ1Zi5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7cmV0dXJuIHRydWV9cmV0dXJuIGZhbHNlfXZhciBhc3NlcnQ9bW9kdWxlLmV4cG9ydHM9b2s7dmFyIHJlZ2V4PS9ccypmdW5jdGlvblxzKyhbXlwoXHNdKilccyovO2Z1bmN0aW9uIGdldE5hbWUoZnVuYyl7aWYoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSl7cmV0dXJufWlmKGZ1bmN0aW9uc0hhdmVOYW1lcyl7cmV0dXJuIGZ1bmMubmFtZX12YXIgc3RyPWZ1bmMudG9TdHJpbmcoKTt2YXIgbWF0Y2g9c3RyLm1hdGNoKHJlZ2V4KTtyZXR1cm4gbWF0Y2gmJm1hdGNoWzFdfWFzc2VydC5Bc3NlcnRpb25FcnJvcj1mdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKXt0aGlzLm5hbWU9IkFzc2VydGlvbkVycm9yIjt0aGlzLmFjdHVhbD1vcHRpb25zLmFjdHVhbDt0aGlzLmV4cGVjdGVkPW9wdGlvbnMuZXhwZWN0ZWQ7dGhpcy5vcGVyYXRvcj1vcHRpb25zLm9wZXJhdG9yO2lmKG9wdGlvbnMubWVzc2FnZSl7dGhpcy5tZXNzYWdlPW9wdGlvbnMubWVzc2FnZTt0aGlzLmdlbmVyYXRlZE1lc3NhZ2U9ZmFsc2V9ZWxzZXt0aGlzLm1lc3NhZ2U9Z2V0TWVzc2FnZSh0aGlzKTt0aGlzLmdlbmVyYXRlZE1lc3NhZ2U9dHJ1ZX12YXIgc3RhY2tTdGFydEZ1bmN0aW9uPW9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9ufHxmYWlsO2lmKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKXtFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLHN0YWNrU3RhcnRGdW5jdGlvbil9ZWxzZXt2YXIgZXJyPW5ldyBFcnJvcjtpZihlcnIuc3RhY2spe3ZhciBvdXQ9ZXJyLnN0YWNrO3ZhciBmbl9uYW1lPWdldE5hbWUoc3RhY2tTdGFydEZ1bmN0aW9uKTt2YXIgaWR4PW91dC5pbmRleE9mKCJcbiIrZm5fbmFtZSk7aWYoaWR4Pj0wKXt2YXIgbmV4dF9saW5lPW91dC5pbmRleE9mKCJcbiIsaWR4KzEpO291dD1vdXQuc3Vic3RyaW5nKG5leHRfbGluZSsxKX10aGlzLnN0YWNrPW91dH19fTt1dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvcixFcnJvcik7ZnVuY3Rpb24gdHJ1bmNhdGUocyxuKXtpZih0eXBlb2Ygcz09PSJzdHJpbmciKXtyZXR1cm4gcy5sZW5ndGg8bj9zOnMuc2xpY2UoMCxuKX1lbHNle3JldHVybiBzfX1mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZyl7aWYoZnVuY3Rpb25zSGF2ZU5hbWVzfHwhdXRpbC5pc0Z1bmN0aW9uKHNvbWV0aGluZykpe3JldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKX12YXIgcmF3bmFtZT1nZXROYW1lKHNvbWV0aGluZyk7dmFyIG5hbWU9cmF3bmFtZT8iOiAiK3Jhd25hbWU6IiI7cmV0dXJuIltGdW5jdGlvbiIrbmFtZSsiXSJ9ZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKXtyZXR1cm4gdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmFjdHVhbCksMTI4KSsiICIrc2VsZi5vcGVyYXRvcisiICIrdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwxMjgpfWZ1bmN0aW9uIGZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Usb3BlcmF0b3Isc3RhY2tTdGFydEZ1bmN0aW9uKXt0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHttZXNzYWdlOm1lc3NhZ2UsYWN0dWFsOmFjdHVhbCxleHBlY3RlZDpleHBlY3RlZCxvcGVyYXRvcjpvcGVyYXRvcixzdGFja1N0YXJ0RnVuY3Rpb246c3RhY2tTdGFydEZ1bmN0aW9ufSl9YXNzZXJ0LmZhaWw9ZmFpbDtmdW5jdGlvbiBvayh2YWx1ZSxtZXNzYWdlKXtpZighdmFsdWUpZmFpbCh2YWx1ZSx0cnVlLG1lc3NhZ2UsIj09Iixhc3NlcnQub2spfWFzc2VydC5vaz1vazthc3NlcnQuZXF1YWw9ZnVuY3Rpb24gZXF1YWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Upe2lmKGFjdHVhbCE9ZXhwZWN0ZWQpZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiPT0iLGFzc2VydC5lcXVhbCl9O2Fzc2VydC5ub3RFcXVhbD1mdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsPT1leHBlY3RlZCl7ZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiIT0iLGFzc2VydC5ub3RFcXVhbCl9fTthc3NlcnQuZGVlcEVxdWFsPWZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoIV9kZWVwRXF1YWwoYWN0dWFsLGV4cGVjdGVkLGZhbHNlKSl7ZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiZGVlcEVxdWFsIixhc3NlcnQuZGVlcEVxdWFsKX19O2Fzc2VydC5kZWVwU3RyaWN0RXF1YWw9ZnVuY3Rpb24gZGVlcFN0cmljdEVxdWFsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlKXtpZighX2RlZXBFcXVhbChhY3R1YWwsZXhwZWN0ZWQsdHJ1ZSkpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsImRlZXBTdHJpY3RFcXVhbCIsYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCl9fTtmdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxzdHJpY3QsbWVtb3Mpe2lmKGFjdHVhbD09PWV4cGVjdGVkKXtyZXR1cm4gdHJ1ZX1lbHNlIGlmKGlzQnVmZmVyKGFjdHVhbCkmJmlzQnVmZmVyKGV4cGVjdGVkKSl7cmV0dXJuIGNvbXBhcmUoYWN0dWFsLGV4cGVjdGVkKT09PTB9ZWxzZSBpZih1dGlsLmlzRGF0ZShhY3R1YWwpJiZ1dGlsLmlzRGF0ZShleHBlY3RlZCkpe3JldHVybiBhY3R1YWwuZ2V0VGltZSgpPT09ZXhwZWN0ZWQuZ2V0VGltZSgpfWVsc2UgaWYodXRpbC5pc1JlZ0V4cChhY3R1YWwpJiZ1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSl7cmV0dXJuIGFjdHVhbC5zb3VyY2U9PT1leHBlY3RlZC5zb3VyY2UmJmFjdHVhbC5nbG9iYWw9PT1leHBlY3RlZC5nbG9iYWwmJmFjdHVhbC5tdWx0aWxpbmU9PT1leHBlY3RlZC5tdWx0aWxpbmUmJmFjdHVhbC5sYXN0SW5kZXg9PT1leHBlY3RlZC5sYXN0SW5kZXgmJmFjdHVhbC5pZ25vcmVDYXNlPT09ZXhwZWN0ZWQuaWdub3JlQ2FzZX1lbHNlIGlmKChhY3R1YWw9PT1udWxsfHx0eXBlb2YgYWN0dWFsIT09Im9iamVjdCIpJiYoZXhwZWN0ZWQ9PT1udWxsfHx0eXBlb2YgZXhwZWN0ZWQhPT0ib2JqZWN0Iikpe3JldHVybiBzdHJpY3Q/YWN0dWFsPT09ZXhwZWN0ZWQ6YWN0dWFsPT1leHBlY3RlZH1lbHNlIGlmKGlzVmlldyhhY3R1YWwpJiZpc1ZpZXcoZXhwZWN0ZWQpJiZwVG9TdHJpbmcoYWN0dWFsKT09PXBUb1N0cmluZyhleHBlY3RlZCkmJiEoYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5fHxhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDY0QXJyYXkpKXtyZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKT09PTB9ZWxzZSBpZihpc0J1ZmZlcihhY3R1YWwpIT09aXNCdWZmZXIoZXhwZWN0ZWQpKXtyZXR1cm4gZmFsc2V9ZWxzZXttZW1vcz1tZW1vc3x8e2FjdHVhbDpbXSxleHBlY3RlZDpbXX07dmFyIGFjdHVhbEluZGV4PW1lbW9zLmFjdHVhbC5pbmRleE9mKGFjdHVhbCk7aWYoYWN0dWFsSW5kZXghPT0tMSl7aWYoYWN0dWFsSW5kZXg9PT1tZW1vcy5leHBlY3RlZC5pbmRleE9mKGV4cGVjdGVkKSl7cmV0dXJuIHRydWV9fW1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7bWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7cmV0dXJuIG9iakVxdWl2KGFjdHVhbCxleHBlY3RlZCxzdHJpY3QsbWVtb3MpfX1mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3Qpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KT09IltvYmplY3QgQXJndW1lbnRzXSJ9ZnVuY3Rpb24gb2JqRXF1aXYoYSxiLHN0cmljdCxhY3R1YWxWaXNpdGVkT2JqZWN0cyl7aWYoYT09PW51bGx8fGE9PT11bmRlZmluZWR8fGI9PT1udWxsfHxiPT09dW5kZWZpbmVkKXJldHVybiBmYWxzZTtpZih1dGlsLmlzUHJpbWl0aXZlKGEpfHx1dGlsLmlzUHJpbWl0aXZlKGIpKXJldHVybiBhPT09YjtpZihzdHJpY3QmJk9iamVjdC5nZXRQcm90b3R5cGVPZihhKSE9PU9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlyZXR1cm4gZmFsc2U7dmFyIGFJc0FyZ3M9aXNBcmd1bWVudHMoYSk7dmFyIGJJc0FyZ3M9aXNBcmd1bWVudHMoYik7aWYoYUlzQXJncyYmIWJJc0FyZ3N8fCFhSXNBcmdzJiZiSXNBcmdzKXJldHVybiBmYWxzZTtpZihhSXNBcmdzKXthPXBTbGljZS5jYWxsKGEpO2I9cFNsaWNlLmNhbGwoYik7cmV0dXJuIF9kZWVwRXF1YWwoYSxiLHN0cmljdCl9dmFyIGthPW9iamVjdEtleXMoYSk7dmFyIGtiPW9iamVjdEtleXMoYik7dmFyIGtleSxpO2lmKGthLmxlbmd0aCE9PWtiLmxlbmd0aClyZXR1cm4gZmFsc2U7a2Euc29ydCgpO2tiLnNvcnQoKTtmb3IoaT1rYS5sZW5ndGgtMTtpPj0wO2ktLSl7aWYoa2FbaV0hPT1rYltpXSlyZXR1cm4gZmFsc2V9Zm9yKGk9a2EubGVuZ3RoLTE7aT49MDtpLS0pe2tleT1rYVtpXTtpZighX2RlZXBFcXVhbChhW2tleV0sYltrZXldLHN0cmljdCxhY3R1YWxWaXNpdGVkT2JqZWN0cykpcmV0dXJuIGZhbHNlfXJldHVybiB0cnVlfWFzc2VydC5ub3REZWVwRXF1YWw9ZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlKXtpZihfZGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxmYWxzZSkpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIm5vdERlZXBFcXVhbCIsYXNzZXJ0Lm5vdERlZXBFcXVhbCl9fTthc3NlcnQubm90RGVlcFN0cmljdEVxdWFsPW5vdERlZXBTdHJpY3RFcXVhbDtmdW5jdGlvbiBub3REZWVwU3RyaWN0RXF1YWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Upe2lmKF9kZWVwRXF1YWwoYWN0dWFsLGV4cGVjdGVkLHRydWUpKXtmYWlsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlLCJub3REZWVwU3RyaWN0RXF1YWwiLG5vdERlZXBTdHJpY3RFcXVhbCl9fWFzc2VydC5zdHJpY3RFcXVhbD1mdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsIT09ZXhwZWN0ZWQpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIj09PSIsYXNzZXJ0LnN0cmljdEVxdWFsKX19O2Fzc2VydC5ub3RTdHJpY3RFcXVhbD1mdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsPT09ZXhwZWN0ZWQpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIiE9PSIsYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKX19O2Z1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCxleHBlY3RlZCl7aWYoIWFjdHVhbHx8IWV4cGVjdGVkKXtyZXR1cm4gZmFsc2V9aWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKT09IltvYmplY3QgUmVnRXhwXSIpe3JldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCl9dHJ5e2lmKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKXtyZXR1cm4gdHJ1ZX19Y2F0Y2goZSl7fWlmKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKXtyZXR1cm4gZmFsc2V9cmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sYWN0dWFsKT09PXRydWV9ZnVuY3Rpb24gX3RyeUJsb2NrKGJsb2NrKXt2YXIgZXJyb3I7dHJ5e2Jsb2NrKCl9Y2F0Y2goZSl7ZXJyb3I9ZX1yZXR1cm4gZXJyb3J9ZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdyxibG9jayxleHBlY3RlZCxtZXNzYWdlKXt2YXIgYWN0dWFsO2lmKHR5cGVvZiBibG9jayE9PSJmdW5jdGlvbiIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJibG9jayIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyl9aWYodHlwZW9mIGV4cGVjdGVkPT09InN0cmluZyIpe21lc3NhZ2U9ZXhwZWN0ZWQ7ZXhwZWN0ZWQ9bnVsbH1hY3R1YWw9X3RyeUJsb2NrKGJsb2NrKTttZXNzYWdlPShleHBlY3RlZCYmZXhwZWN0ZWQubmFtZT8iICgiK2V4cGVjdGVkLm5hbWUrIikuIjoiLiIpKyhtZXNzYWdlPyIgIittZXNzYWdlOiIuIik7aWYoc2hvdWxkVGhyb3cmJiFhY3R1YWwpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLCJNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbiIrbWVzc2FnZSl9dmFyIHVzZXJQcm92aWRlZE1lc3NhZ2U9dHlwZW9mIG1lc3NhZ2U9PT0ic3RyaW5nIjt2YXIgaXNVbndhbnRlZEV4Y2VwdGlvbj0hc2hvdWxkVGhyb3cmJnV0aWwuaXNFcnJvcihhY3R1YWwpO3ZhciBpc1VuZXhwZWN0ZWRFeGNlcHRpb249IXNob3VsZFRocm93JiZhY3R1YWwmJiFleHBlY3RlZDtpZihpc1Vud2FudGVkRXhjZXB0aW9uJiZ1c2VyUHJvdmlkZWRNZXNzYWdlJiZleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsZXhwZWN0ZWQpfHxpc1VuZXhwZWN0ZWRFeGNlcHRpb24pe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLCJHb3QgdW53YW50ZWQgZXhjZXB0aW9uIittZXNzYWdlKX1pZihzaG91bGRUaHJvdyYmYWN0dWFsJiZleHBlY3RlZCYmIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCxleHBlY3RlZCl8fCFzaG91bGRUaHJvdyYmYWN0dWFsKXt0aHJvdyBhY3R1YWx9fWFzc2VydC50aHJvd3M9ZnVuY3Rpb24oYmxvY2ssZXJyb3IsbWVzc2FnZSl7X3Rocm93cyh0cnVlLGJsb2NrLGVycm9yLG1lc3NhZ2UpfTthc3NlcnQuZG9lc05vdFRocm93PWZ1bmN0aW9uKGJsb2NrLGVycm9yLG1lc3NhZ2Upe190aHJvd3MoZmFsc2UsYmxvY2ssZXJyb3IsbWVzc2FnZSl9O2Fzc2VydC5pZkVycm9yPWZ1bmN0aW9uKGVycil7aWYoZXJyKXRocm93IGVycn07ZnVuY3Rpb24gc3RyaWN0KHZhbHVlLG1lc3NhZ2Upe2lmKCF2YWx1ZSlmYWlsKHZhbHVlLHRydWUsbWVzc2FnZSwiPT0iLHN0cmljdCl9YXNzZXJ0LnN0cmljdD1vYmplY3RBc3NpZ24oc3RyaWN0LGFzc2VydCx7ZXF1YWw6YXNzZXJ0LnN0cmljdEVxdWFsLGRlZXBFcXVhbDphc3NlcnQuZGVlcFN0cmljdEVxdWFsLG5vdEVxdWFsOmFzc2VydC5ub3RTdHJpY3RFcXVhbCxub3REZWVwRXF1YWw6YXNzZXJ0Lm5vdERlZXBTdHJpY3RFcXVhbH0pO2Fzc2VydC5zdHJpY3Quc3RyaWN0PWFzc2VydC5zdHJpY3Q7dmFyIG9iamVjdEtleXM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uKG9iail7dmFyIGtleXM9W107Zm9yKHZhciBrZXkgaW4gb2JqKXtpZihoYXNPd24uY2FsbChvYmosa2V5KSlrZXlzLnB1c2goa2V5KX1yZXR1cm4ga2V5c319KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCE9PSJ1bmRlZmluZWQiP2dsb2JhbDp0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiP3dpbmRvdzp7fSl9LHsib2JqZWN0LWFzc2lnbiI6NTksInV0aWwvIjoyM31dLDIxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtpZih0eXBlb2YgT2JqZWN0LmNyZWF0ZT09PSJmdW5jdGlvbiIpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGluaGVyaXRzKGN0b3Isc3VwZXJDdG9yKXtjdG9yLnN1cGVyXz1zdXBlckN0b3I7Y3Rvci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6Y3RvcixlbnVtZXJhYmxlOmZhbHNlLHdyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWV9fSl9fWVsc2V7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaW5oZXJpdHMoY3RvcixzdXBlckN0b3Ipe2N0b3Iuc3VwZXJfPXN1cGVyQ3Rvcjt2YXIgVGVtcEN0b3I9ZnVuY3Rpb24oKXt9O1RlbXBDdG9yLnByb3RvdHlwZT1zdXBlckN0b3IucHJvdG90eXBlO2N0b3IucHJvdG90eXBlPW5ldyBUZW1wQ3RvcjtjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1jdG9yfX19LHt9XSwyMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaXNCdWZmZXIoYXJnKXtyZXR1cm4gYXJnJiZ0eXBlb2YgYXJnPT09Im9iamVjdCImJnR5cGVvZiBhcmcuY29weT09PSJmdW5jdGlvbiImJnR5cGVvZiBhcmcuZmlsbD09PSJmdW5jdGlvbiImJnR5cGVvZiBhcmcucmVhZFVJbnQ4PT09ImZ1bmN0aW9uIn19LHt9XSwyMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MsZ2xvYmFsKXt2YXIgZm9ybWF0UmVnRXhwPS8lW3NkaiVdL2c7ZXhwb3J0cy5mb3JtYXQ9ZnVuY3Rpb24oZil7aWYoIWlzU3RyaW5nKGYpKXt2YXIgb2JqZWN0cz1bXTtmb3IodmFyIGk9MDtpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXtvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKX1yZXR1cm4gb2JqZWN0cy5qb2luKCIgIil9dmFyIGk9MTt2YXIgYXJncz1hcmd1bWVudHM7dmFyIGxlbj1hcmdzLmxlbmd0aDt2YXIgc3RyPVN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCxmdW5jdGlvbih4KXtpZih4PT09IiUlIilyZXR1cm4iJSI7aWYoaT49bGVuKXJldHVybiB4O3N3aXRjaCh4KXtjYXNlIiVzIjpyZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7Y2FzZSIlZCI6cmV0dXJuIE51bWJlcihhcmdzW2krK10pO2Nhc2UiJWoiOnRyeXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKX1jYXRjaChfKXtyZXR1cm4iW0NpcmN1bGFyXSJ9ZGVmYXVsdDpyZXR1cm4geH19KTtmb3IodmFyIHg9YXJnc1tpXTtpPGxlbjt4PWFyZ3NbKytpXSl7aWYoaXNOdWxsKHgpfHwhaXNPYmplY3QoeCkpe3N0cis9IiAiK3h9ZWxzZXtzdHIrPSIgIitpbnNwZWN0KHgpfX1yZXR1cm4gc3RyfTtleHBvcnRzLmRlcHJlY2F0ZT1mdW5jdGlvbihmbixtc2cpe2lmKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLG1zZykuYXBwbHkodGhpcyxhcmd1bWVudHMpfX1pZihwcm9jZXNzLm5vRGVwcmVjYXRpb249PT10cnVlKXtyZXR1cm4gZm59dmFyIHdhcm5lZD1mYWxzZTtmdW5jdGlvbiBkZXByZWNhdGVkKCl7aWYoIXdhcm5lZCl7aWYocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKXt0aHJvdyBuZXcgRXJyb3IobXNnKX1lbHNlIGlmKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbil7Y29uc29sZS50cmFjZShtc2cpfWVsc2V7Y29uc29sZS5lcnJvcihtc2cpfXdhcm5lZD10cnVlfXJldHVybiBmbi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9cmV0dXJuIGRlcHJlY2F0ZWR9O3ZhciBkZWJ1Z3M9e307dmFyIGRlYnVnRW52aXJvbjtleHBvcnRzLmRlYnVnbG9nPWZ1bmN0aW9uKHNldCl7aWYoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlkZWJ1Z0Vudmlyb249cHJvY2Vzcy5lbnYuTk9ERV9ERUJVR3x8IiI7c2V0PXNldC50b1VwcGVyQ2FzZSgpO2lmKCFkZWJ1Z3Nbc2V0XSl7aWYobmV3IFJlZ0V4cCgiXFxiIitzZXQrIlxcYiIsImkiKS50ZXN0KGRlYnVnRW52aXJvbikpe3ZhciBwaWQ9cHJvY2Vzcy5waWQ7ZGVidWdzW3NldF09ZnVuY3Rpb24oKXt2YXIgbXNnPWV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKTtjb25zb2xlLmVycm9yKCIlcyAlZDogJXMiLHNldCxwaWQsbXNnKX19ZWxzZXtkZWJ1Z3Nbc2V0XT1mdW5jdGlvbigpe319fXJldHVybiBkZWJ1Z3Nbc2V0XX07ZnVuY3Rpb24gaW5zcGVjdChvYmosb3B0cyl7dmFyIGN0eD17c2VlbjpbXSxzdHlsaXplOnN0eWxpemVOb0NvbG9yfTtpZihhcmd1bWVudHMubGVuZ3RoPj0zKWN0eC5kZXB0aD1hcmd1bWVudHNbMl07aWYoYXJndW1lbnRzLmxlbmd0aD49NCljdHguY29sb3JzPWFyZ3VtZW50c1szXTtpZihpc0Jvb2xlYW4ob3B0cykpe2N0eC5zaG93SGlkZGVuPW9wdHN9ZWxzZSBpZihvcHRzKXtleHBvcnRzLl9leHRlbmQoY3R4LG9wdHMpfWlmKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSljdHguc2hvd0hpZGRlbj1mYWxzZTtpZihpc1VuZGVmaW5lZChjdHguZGVwdGgpKWN0eC5kZXB0aD0yO2lmKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKWN0eC5jb2xvcnM9ZmFsc2U7aWYoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKWN0eC5jdXN0b21JbnNwZWN0PXRydWU7aWYoY3R4LmNvbG9ycyljdHguc3R5bGl6ZT1zdHlsaXplV2l0aENvbG9yO3JldHVybiBmb3JtYXRWYWx1ZShjdHgsb2JqLGN0eC5kZXB0aCl9ZXhwb3J0cy5pbnNwZWN0PWluc3BlY3Q7aW5zcGVjdC5jb2xvcnM9e2JvbGQ6WzEsMjJdLGl0YWxpYzpbMywyM10sdW5kZXJsaW5lOls0LDI0XSxpbnZlcnNlOls3LDI3XSx3aGl0ZTpbMzcsMzldLGdyZXk6WzkwLDM5XSxibGFjazpbMzAsMzldLGJsdWU6WzM0LDM5XSxjeWFuOlszNiwzOV0sZ3JlZW46WzMyLDM5XSxtYWdlbnRhOlszNSwzOV0scmVkOlszMSwzOV0seWVsbG93OlszMywzOV19O2luc3BlY3Quc3R5bGVzPXtzcGVjaWFsOiJjeWFuIixudW1iZXI6InllbGxvdyIsYm9vbGVhbjoieWVsbG93Iix1bmRlZmluZWQ6ImdyZXkiLG51bGw6ImJvbGQiLHN0cmluZzoiZ3JlZW4iLGRhdGU6Im1hZ2VudGEiLHJlZ2V4cDoicmVkIn07ZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsc3R5bGVUeXBlKXt2YXIgc3R5bGU9aW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtpZihzdHlsZSl7cmV0dXJuIhtbIitpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0rIm0iK3N0cisiG1siK2luc3BlY3QuY29sb3JzW3N0eWxlXVsxXSsibSJ9ZWxzZXtyZXR1cm4gc3RyfX1mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsc3R5bGVUeXBlKXtyZXR1cm4gc3RyfWZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KXt2YXIgaGFzaD17fTthcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCxpZHgpe2hhc2hbdmFsXT10cnVlfSk7cmV0dXJuIGhhc2h9ZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyl7aWYoY3R4LmN1c3RvbUluc3BlY3QmJnZhbHVlJiZpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpJiZ2YWx1ZS5pbnNwZWN0IT09ZXhwb3J0cy5pbnNwZWN0JiYhKHZhbHVlLmNvbnN0cnVjdG9yJiZ2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGU9PT12YWx1ZSkpe3ZhciByZXQ9dmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsY3R4KTtpZighaXNTdHJpbmcocmV0KSl7cmV0PWZvcm1hdFZhbHVlKGN0eCxyZXQscmVjdXJzZVRpbWVzKX1yZXR1cm4gcmV0fXZhciBwcmltaXRpdmU9Zm9ybWF0UHJpbWl0aXZlKGN0eCx2YWx1ZSk7aWYocHJpbWl0aXZlKXtyZXR1cm4gcHJpbWl0aXZlfXZhciBrZXlzPU9iamVjdC5rZXlzKHZhbHVlKTt2YXIgdmlzaWJsZUtleXM9YXJyYXlUb0hhc2goa2V5cyk7aWYoY3R4LnNob3dIaWRkZW4pe2tleXM9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpfWlmKGlzRXJyb3IodmFsdWUpJiYoa2V5cy5pbmRleE9mKCJtZXNzYWdlIik+PTB8fGtleXMuaW5kZXhPZigiZGVzY3JpcHRpb24iKT49MCkpe3JldHVybiBmb3JtYXRFcnJvcih2YWx1ZSl9aWYoa2V5cy5sZW5ndGg9PT0wKXtpZihpc0Z1bmN0aW9uKHZhbHVlKSl7dmFyIG5hbWU9dmFsdWUubmFtZT8iOiAiK3ZhbHVlLm5hbWU6IiI7cmV0dXJuIGN0eC5zdHlsaXplKCJbRnVuY3Rpb24iK25hbWUrIl0iLCJzcGVjaWFsIil9aWYoaXNSZWdFeHAodmFsdWUpKXtyZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwicmVnZXhwIil9aWYoaXNEYXRlKHZhbHVlKSl7cmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCJkYXRlIil9aWYoaXNFcnJvcih2YWx1ZSkpe3JldHVybiBmb3JtYXRFcnJvcih2YWx1ZSl9fXZhciBiYXNlPSIiLGFycmF5PWZhbHNlLGJyYWNlcz1bInsiLCJ9Il07aWYoaXNBcnJheSh2YWx1ZSkpe2FycmF5PXRydWU7YnJhY2VzPVsiWyIsIl0iXX1pZihpc0Z1bmN0aW9uKHZhbHVlKSl7dmFyIG49dmFsdWUubmFtZT8iOiAiK3ZhbHVlLm5hbWU6IiI7YmFzZT0iIFtGdW5jdGlvbiIrbisiXSJ9aWYoaXNSZWdFeHAodmFsdWUpKXtiYXNlPSIgIitSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpfWlmKGlzRGF0ZSh2YWx1ZSkpe2Jhc2U9IiAiK0RhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpfWlmKGlzRXJyb3IodmFsdWUpKXtiYXNlPSIgIitmb3JtYXRFcnJvcih2YWx1ZSl9aWYoa2V5cy5sZW5ndGg9PT0wJiYoIWFycmF5fHx2YWx1ZS5sZW5ndGg9PTApKXtyZXR1cm4gYnJhY2VzWzBdK2Jhc2UrYnJhY2VzWzFdfWlmKHJlY3Vyc2VUaW1lczwwKXtpZihpc1JlZ0V4cCh2YWx1ZSkpe3JldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCJyZWdleHAiKX1lbHNle3JldHVybiBjdHguc3R5bGl6ZSgiW09iamVjdF0iLCJzcGVjaWFsIil9fWN0eC5zZWVuLnB1c2godmFsdWUpO3ZhciBvdXRwdXQ7aWYoYXJyYXkpe291dHB1dD1mb3JtYXRBcnJheShjdHgsdmFsdWUscmVjdXJzZVRpbWVzLHZpc2libGVLZXlzLGtleXMpfWVsc2V7b3V0cHV0PWtleXMubWFwKGZ1bmN0aW9uKGtleSl7cmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCx2YWx1ZSxyZWN1cnNlVGltZXMsdmlzaWJsZUtleXMsa2V5LGFycmF5KX0pfWN0eC5zZWVuLnBvcCgpO3JldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsYmFzZSxicmFjZXMpfWZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsdmFsdWUpe2lmKGlzVW5kZWZpbmVkKHZhbHVlKSlyZXR1cm4gY3R4LnN0eWxpemUoInVuZGVmaW5lZCIsInVuZGVmaW5lZCIpO2lmKGlzU3RyaW5nKHZhbHVlKSl7dmFyIHNpbXBsZT0iJyIrSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL14ifCIkL2csIiIpLnJlcGxhY2UoLycvZywiXFwnIikucmVwbGFjZSgvXFwiL2csJyInKSsiJyI7cmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwic3RyaW5nIil9aWYoaXNOdW1iZXIodmFsdWUpKXJldHVybiBjdHguc3R5bGl6ZSgiIit2YWx1ZSwibnVtYmVyIik7aWYoaXNCb29sZWFuKHZhbHVlKSlyZXR1cm4gY3R4LnN0eWxpemUoIiIrdmFsdWUsImJvb2xlYW4iKTtpZihpc051bGwodmFsdWUpKXJldHVybiBjdHguc3R5bGl6ZSgibnVsbCIsIm51bGwiKX1mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSl7cmV0dXJuIlsiK0Vycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSsiXSJ9ZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXlzKXt2YXIgb3V0cHV0PVtdO2Zvcih2YXIgaT0wLGw9dmFsdWUubGVuZ3RoO2k8bDsrK2kpe2lmKGhhc093blByb3BlcnR5KHZhbHVlLFN0cmluZyhpKSkpe291dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCx2YWx1ZSxyZWN1cnNlVGltZXMsdmlzaWJsZUtleXMsU3RyaW5nKGkpLHRydWUpKX1lbHNle291dHB1dC5wdXNoKCIiKX19a2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7aWYoIWtleS5tYXRjaCgvXlxkKyQvKSl7b3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXksdHJ1ZSkpfX0pO3JldHVybiBvdXRwdXR9ZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXksYXJyYXkpe3ZhciBuYW1lLHN0cixkZXNjO2Rlc2M9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSxrZXkpfHx7dmFsdWU6dmFsdWVba2V5XX07aWYoZGVzYy5nZXQpe2lmKGRlc2Muc2V0KXtzdHI9Y3R4LnN0eWxpemUoIltHZXR0ZXIvU2V0dGVyXSIsInNwZWNpYWwiKX1lbHNle3N0cj1jdHguc3R5bGl6ZSgiW0dldHRlcl0iLCJzcGVjaWFsIil9fWVsc2V7aWYoZGVzYy5zZXQpe3N0cj1jdHguc3R5bGl6ZSgiW1NldHRlcl0iLCJzcGVjaWFsIil9fWlmKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cyxrZXkpKXtuYW1lPSJbIitrZXkrIl0ifWlmKCFzdHIpe2lmKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSk8MCl7aWYoaXNOdWxsKHJlY3Vyc2VUaW1lcykpe3N0cj1mb3JtYXRWYWx1ZShjdHgsZGVzYy52YWx1ZSxudWxsKX1lbHNle3N0cj1mb3JtYXRWYWx1ZShjdHgsZGVzYy52YWx1ZSxyZWN1cnNlVGltZXMtMSl9aWYoc3RyLmluZGV4T2YoIlxuIik+LTEpe2lmKGFycmF5KXtzdHI9c3RyLnNwbGl0KCJcbiIpLm1hcChmdW5jdGlvbihsaW5lKXtyZXR1cm4iICAiK2xpbmV9KS5qb2luKCJcbiIpLnN1YnN0cigyKX1lbHNle3N0cj0iXG4iK3N0ci5zcGxpdCgiXG4iKS5tYXAoZnVuY3Rpb24obGluZSl7cmV0dXJuIiAgICIrbGluZX0pLmpvaW4oIlxuIil9fX1lbHNle3N0cj1jdHguc3R5bGl6ZSgiW0NpcmN1bGFyXSIsInNwZWNpYWwiKX19aWYoaXNVbmRlZmluZWQobmFtZSkpe2lmKGFycmF5JiZrZXkubWF0Y2goL15cZCskLykpe3JldHVybiBzdHJ9bmFtZT1KU09OLnN0cmluZ2lmeSgiIitrZXkpO2lmKG5hbWUubWF0Y2goL14iKFthLXpBLVpfXVthLXpBLVpfMC05XSopIiQvKSl7bmFtZT1uYW1lLnN1YnN0cigxLG5hbWUubGVuZ3RoLTIpO25hbWU9Y3R4LnN0eWxpemUobmFtZSwibmFtZSIpfWVsc2V7bmFtZT1uYW1lLnJlcGxhY2UoLycvZywiXFwnIikucmVwbGFjZSgvXFwiL2csJyInKS5yZXBsYWNlKC8oXiJ8IiQpL2csIiciKTtuYW1lPWN0eC5zdHlsaXplKG5hbWUsInN0cmluZyIpfX1yZXR1cm4gbmFtZSsiOiAiK3N0cn1mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsYmFzZSxicmFjZXMpe3ZhciBudW1MaW5lc0VzdD0wO3ZhciBsZW5ndGg9b3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LGN1cil7bnVtTGluZXNFc3QrKztpZihjdXIuaW5kZXhPZigiXG4iKT49MCludW1MaW5lc0VzdCsrO3JldHVybiBwcmV2K2N1ci5yZXBsYWNlKC9cdTAwMWJcW1xkXGQ/bS9nLCIiKS5sZW5ndGgrMX0sMCk7aWYobGVuZ3RoPjYwKXtyZXR1cm4gYnJhY2VzWzBdKyhiYXNlPT09IiI/IiI6YmFzZSsiXG4gIikrIiAiK291dHB1dC5qb2luKCIsXG4gICIpKyIgIiticmFjZXNbMV19cmV0dXJuIGJyYWNlc1swXStiYXNlKyIgIitvdXRwdXQuam9pbigiLCAiKSsiICIrYnJhY2VzWzFdfWZ1bmN0aW9uIGlzQXJyYXkoYXIpe3JldHVybiBBcnJheS5pc0FycmF5KGFyKX1leHBvcnRzLmlzQXJyYXk9aXNBcnJheTtmdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJib29sZWFuIn1leHBvcnRzLmlzQm9vbGVhbj1pc0Jvb2xlYW47ZnVuY3Rpb24gaXNOdWxsKGFyZyl7cmV0dXJuIGFyZz09PW51bGx9ZXhwb3J0cy5pc051bGw9aXNOdWxsO2Z1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09bnVsbH1leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkPWlzTnVsbE9yVW5kZWZpbmVkO2Z1bmN0aW9uIGlzTnVtYmVyKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ibnVtYmVyIn1leHBvcnRzLmlzTnVtYmVyPWlzTnVtYmVyO2Z1bmN0aW9uIGlzU3RyaW5nKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3RyaW5nIn1leHBvcnRzLmlzU3RyaW5nPWlzU3RyaW5nO2Z1bmN0aW9uIGlzU3ltYm9sKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3ltYm9sIn1leHBvcnRzLmlzU3ltYm9sPWlzU3ltYm9sO2Z1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09PXZvaWQgMH1leHBvcnRzLmlzVW5kZWZpbmVkPWlzVW5kZWZpbmVkO2Z1bmN0aW9uIGlzUmVnRXhwKHJlKXtyZXR1cm4gaXNPYmplY3QocmUpJiZvYmplY3RUb1N0cmluZyhyZSk9PT0iW29iamVjdCBSZWdFeHBdIn1leHBvcnRzLmlzUmVnRXhwPWlzUmVnRXhwO2Z1bmN0aW9uIGlzT2JqZWN0KGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ib2JqZWN0IiYmYXJnIT09bnVsbH1leHBvcnRzLmlzT2JqZWN0PWlzT2JqZWN0O2Z1bmN0aW9uIGlzRGF0ZShkKXtyZXR1cm4gaXNPYmplY3QoZCkmJm9iamVjdFRvU3RyaW5nKGQpPT09IltvYmplY3QgRGF0ZV0ifWV4cG9ydHMuaXNEYXRlPWlzRGF0ZTtmdW5jdGlvbiBpc0Vycm9yKGUpe3JldHVybiBpc09iamVjdChlKSYmKG9iamVjdFRvU3RyaW5nKGUpPT09IltvYmplY3QgRXJyb3JdInx8ZSBpbnN0YW5jZW9mIEVycm9yKX1leHBvcnRzLmlzRXJyb3I9aXNFcnJvcjtmdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0iZnVuY3Rpb24ifWV4cG9ydHMuaXNGdW5jdGlvbj1pc0Z1bmN0aW9uO2Z1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZyl7cmV0dXJuIGFyZz09PW51bGx8fHR5cGVvZiBhcmc9PT0iYm9vbGVhbiJ8fHR5cGVvZiBhcmc9PT0ibnVtYmVyInx8dHlwZW9mIGFyZz09PSJzdHJpbmcifHx0eXBlb2YgYXJnPT09InN5bWJvbCJ8fHR5cGVvZiBhcmc9PT0idW5kZWZpbmVkIn1leHBvcnRzLmlzUHJpbWl0aXZlPWlzUHJpbWl0aXZlO2V4cG9ydHMuaXNCdWZmZXI9cmVxdWlyZSgiLi9zdXBwb3J0L2lzQnVmZmVyIik7ZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobyl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKX1mdW5jdGlvbiBwYWQobil7cmV0dXJuIG48MTA/IjAiK24udG9TdHJpbmcoMTApOm4udG9TdHJpbmcoMTApfXZhciBtb250aHM9WyJKYW4iLCJGZWIiLCJNYXIiLCJBcHIiLCJNYXkiLCJKdW4iLCJKdWwiLCJBdWciLCJTZXAiLCJPY3QiLCJOb3YiLCJEZWMiXTtmdW5jdGlvbiB0aW1lc3RhbXAoKXt2YXIgZD1uZXcgRGF0ZTt2YXIgdGltZT1bcGFkKGQuZ2V0SG91cnMoKSkscGFkKGQuZ2V0TWludXRlcygpKSxwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCI6Iik7cmV0dXJuW2QuZ2V0RGF0ZSgpLG1vbnRoc1tkLmdldE1vbnRoKCldLHRpbWVdLmpvaW4oIiAiKX1leHBvcnRzLmxvZz1mdW5jdGlvbigpe2NvbnNvbGUubG9nKCIlcyAtICVzIix0aW1lc3RhbXAoKSxleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLGFyZ3VtZW50cykpfTtleHBvcnRzLmluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7ZXhwb3J0cy5fZXh0ZW5kPWZ1bmN0aW9uKG9yaWdpbixhZGQpe2lmKCFhZGR8fCFpc09iamVjdChhZGQpKXJldHVybiBvcmlnaW47dmFyIGtleXM9T2JqZWN0LmtleXMoYWRkKTt2YXIgaT1rZXlzLmxlbmd0aDt3aGlsZShpLS0pe29yaWdpbltrZXlzW2ldXT1hZGRba2V5c1tpXV19cmV0dXJuIG9yaWdpbn07ZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLHByb3Ape3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLHByb3ApfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJfcHJvY2VzcyIpLHR5cGVvZiBnbG9iYWwhPT0idW5kZWZpbmVkIj9nbG9iYWw6dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIj9zZWxmOnR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkIj93aW5kb3c6e30pfSx7Ii4vc3VwcG9ydC9pc0J1ZmZlciI6MjIsX3Byb2Nlc3M6NjYsaW5oZXJpdHM6MjF9XSwyNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO2V4cG9ydHMuYnl0ZUxlbmd0aD1ieXRlTGVuZ3RoO2V4cG9ydHMudG9CeXRlQXJyYXk9dG9CeXRlQXJyYXk7ZXhwb3J0cy5mcm9tQnl0ZUFycmF5PWZyb21CeXRlQXJyYXk7dmFyIGxvb2t1cD1bXTt2YXIgcmV2TG9va3VwPVtdO3ZhciBBcnI9dHlwZW9mIFVpbnQ4QXJyYXkhPT0idW5kZWZpbmVkIj9VaW50OEFycmF5OkFycmF5O3ZhciBjb2RlPSJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvIjtmb3IodmFyIGk9MCxsZW49Y29kZS5sZW5ndGg7aTxsZW47KytpKXtsb29rdXBbaV09Y29kZVtpXTtyZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXT1pfXJldkxvb2t1cFsiLSIuY2hhckNvZGVBdCgwKV09NjI7cmV2TG9va3VwWyJfIi5jaGFyQ29kZUF0KDApXT02MztmdW5jdGlvbiBnZXRMZW5zKGI2NCl7dmFyIGxlbj1iNjQubGVuZ3RoO2lmKGxlbiU0PjApe3Rocm93IG5ldyBFcnJvcigiSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCIpfXZhciB2YWxpZExlbj1iNjQuaW5kZXhPZigiPSIpO2lmKHZhbGlkTGVuPT09LTEpdmFsaWRMZW49bGVuO3ZhciBwbGFjZUhvbGRlcnNMZW49dmFsaWRMZW49PT1sZW4/MDo0LXZhbGlkTGVuJTQ7cmV0dXJuW3ZhbGlkTGVuLHBsYWNlSG9sZGVyc0xlbl19ZnVuY3Rpb24gYnl0ZUxlbmd0aChiNjQpe3ZhciBsZW5zPWdldExlbnMoYjY0KTt2YXIgdmFsaWRMZW49bGVuc1swXTt2YXIgcGxhY2VIb2xkZXJzTGVuPWxlbnNbMV07cmV0dXJuKHZhbGlkTGVuK3BsYWNlSG9sZGVyc0xlbikqMy80LXBsYWNlSG9sZGVyc0xlbn1mdW5jdGlvbiBfYnl0ZUxlbmd0aChiNjQsdmFsaWRMZW4scGxhY2VIb2xkZXJzTGVuKXtyZXR1cm4odmFsaWRMZW4rcGxhY2VIb2xkZXJzTGVuKSozLzQtcGxhY2VIb2xkZXJzTGVufWZ1bmN0aW9uIHRvQnl0ZUFycmF5KGI2NCl7dmFyIHRtcDt2YXIgbGVucz1nZXRMZW5zKGI2NCk7dmFyIHZhbGlkTGVuPWxlbnNbMF07dmFyIHBsYWNlSG9sZGVyc0xlbj1sZW5zWzFdO3ZhciBhcnI9bmV3IEFycihfYnl0ZUxlbmd0aChiNjQsdmFsaWRMZW4scGxhY2VIb2xkZXJzTGVuKSk7dmFyIGN1ckJ5dGU9MDt2YXIgbGVuPXBsYWNlSG9sZGVyc0xlbj4wP3ZhbGlkTGVuLTQ6dmFsaWRMZW47Zm9yKHZhciBpPTA7aTxsZW47aSs9NCl7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDE4fHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzEpXTw8MTJ8cmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkrMildPDw2fHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzMpXTthcnJbY3VyQnl0ZSsrXT10bXA+PjE2JjI1NTthcnJbY3VyQnl0ZSsrXT10bXA+PjgmMjU1O2FycltjdXJCeXRlKytdPXRtcCYyNTV9aWYocGxhY2VIb2xkZXJzTGVuPT09Mil7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDJ8cmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkrMSldPj40O2FycltjdXJCeXRlKytdPXRtcCYyNTV9aWYocGxhY2VIb2xkZXJzTGVuPT09MSl7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDEwfHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzEpXTw8NHxyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSsyKV0+PjI7YXJyW2N1ckJ5dGUrK109dG1wPj44JjI1NTthcnJbY3VyQnl0ZSsrXT10bXAmMjU1fXJldHVybiBhcnJ9ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0KG51bSl7cmV0dXJuIGxvb2t1cFtudW0+PjE4JjYzXStsb29rdXBbbnVtPj4xMiY2M10rbG9va3VwW251bT4+NiY2M10rbG9va3VwW251bSY2M119ZnVuY3Rpb24gZW5jb2RlQ2h1bmsodWludDgsc3RhcnQsZW5kKXt2YXIgdG1wO3ZhciBvdXRwdXQ9W107Zm9yKHZhciBpPXN0YXJ0O2k8ZW5kO2krPTMpe3RtcD0odWludDhbaV08PDE2JjE2NzExNjgwKSsodWludDhbaSsxXTw8OCY2NTI4MCkrKHVpbnQ4W2krMl0mMjU1KTtvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSl9cmV0dXJuIG91dHB1dC5qb2luKCIiKX1mdW5jdGlvbiBmcm9tQnl0ZUFycmF5KHVpbnQ4KXt2YXIgdG1wO3ZhciBsZW49dWludDgubGVuZ3RoO3ZhciBleHRyYUJ5dGVzPWxlbiUzO3ZhciBwYXJ0cz1bXTt2YXIgbWF4Q2h1bmtMZW5ndGg9MTYzODM7Zm9yKHZhciBpPTAsbGVuMj1sZW4tZXh0cmFCeXRlcztpPGxlbjI7aSs9bWF4Q2h1bmtMZW5ndGgpe3BhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsaSxpK21heENodW5rTGVuZ3RoPmxlbjI/bGVuMjppK21heENodW5rTGVuZ3RoKSl9aWYoZXh0cmFCeXRlcz09PTEpe3RtcD11aW50OFtsZW4tMV07cGFydHMucHVzaChsb29rdXBbdG1wPj4yXStsb29rdXBbdG1wPDw0JjYzXSsiPT0iKX1lbHNlIGlmKGV4dHJhQnl0ZXM9PT0yKXt0bXA9KHVpbnQ4W2xlbi0yXTw8OCkrdWludDhbbGVuLTFdO3BhcnRzLnB1c2gobG9va3VwW3RtcD4+MTBdK2xvb2t1cFt0bXA+PjQmNjNdK2xvb2t1cFt0bXA8PDImNjNdKyI9Iil9cmV0dXJuIHBhcnRzLmpvaW4oIiIpfX0se31dLDI1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgYmlnSW50PWZ1bmN0aW9uKHVuZGVmaW5lZCl7InVzZSBzdHJpY3QiO3ZhciBCQVNFPTFlNyxMT0dfQkFTRT03LE1BWF9JTlQ9OTAwNzE5OTI1NDc0MDk5MixNQVhfSU5UX0FSUj1zbWFsbFRvQXJyYXkoTUFYX0lOVCksREVGQVVMVF9BTFBIQUJFVD0iMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Ijt2YXIgc3VwcG9ydHNOYXRpdmVCaWdJbnQ9dHlwZW9mIEJpZ0ludD09PSJmdW5jdGlvbiI7ZnVuY3Rpb24gSW50ZWdlcih2LHJhZGl4LGFscGhhYmV0LGNhc2VTZW5zaXRpdmUpe2lmKHR5cGVvZiB2PT09InVuZGVmaW5lZCIpcmV0dXJuIEludGVnZXJbMF07aWYodHlwZW9mIHJhZGl4IT09InVuZGVmaW5lZCIpcmV0dXJuK3JhZGl4PT09MTAmJiFhbHBoYWJldD9wYXJzZVZhbHVlKHYpOnBhcnNlQmFzZSh2LHJhZGl4LGFscGhhYmV0LGNhc2VTZW5zaXRpdmUpO3JldHVybiBwYXJzZVZhbHVlKHYpfWZ1bmN0aW9uIEJpZ0ludGVnZXIodmFsdWUsc2lnbil7dGhpcy52YWx1ZT12YWx1ZTt0aGlzLnNpZ249c2lnbjt0aGlzLmlzU21hbGw9ZmFsc2V9QmlnSW50ZWdlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gU21hbGxJbnRlZ2VyKHZhbHVlKXt0aGlzLnZhbHVlPXZhbHVlO3RoaXMuc2lnbj12YWx1ZTwwO3RoaXMuaXNTbWFsbD10cnVlfVNtYWxsSW50ZWdlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gTmF0aXZlQmlnSW50KHZhbHVlKXt0aGlzLnZhbHVlPXZhbHVlfU5hdGl2ZUJpZ0ludC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gaXNQcmVjaXNlKG4pe3JldHVybi1NQVhfSU5UPG4mJm48TUFYX0lOVH1mdW5jdGlvbiBzbWFsbFRvQXJyYXkobil7aWYobjwxZTcpcmV0dXJuW25dO2lmKG48MWUxNClyZXR1cm5bbiUxZTcsTWF0aC5mbG9vcihuLzFlNyldO3JldHVybltuJTFlNyxNYXRoLmZsb29yKG4vMWU3KSUxZTcsTWF0aC5mbG9vcihuLzFlMTQpXX1mdW5jdGlvbiBhcnJheVRvU21hbGwoYXJyKXt0cmltKGFycik7dmFyIGxlbmd0aD1hcnIubGVuZ3RoO2lmKGxlbmd0aDw0JiZjb21wYXJlQWJzKGFycixNQVhfSU5UX0FSUik8MCl7c3dpdGNoKGxlbmd0aCl7Y2FzZSAwOnJldHVybiAwO2Nhc2UgMTpyZXR1cm4gYXJyWzBdO2Nhc2UgMjpyZXR1cm4gYXJyWzBdK2FyclsxXSpCQVNFO2RlZmF1bHQ6cmV0dXJuIGFyclswXSsoYXJyWzFdK2FyclsyXSpCQVNFKSpCQVNFfX1yZXR1cm4gYXJyfWZ1bmN0aW9uIHRyaW0odil7dmFyIGk9di5sZW5ndGg7d2hpbGUodlstLWldPT09MCk7di5sZW5ndGg9aSsxfWZ1bmN0aW9uIGNyZWF0ZUFycmF5KGxlbmd0aCl7dmFyIHg9bmV3IEFycmF5KGxlbmd0aCk7dmFyIGk9LTE7d2hpbGUoKytpPGxlbmd0aCl7eFtpXT0wfXJldHVybiB4fWZ1bmN0aW9uIHRydW5jYXRlKG4pe2lmKG4+MClyZXR1cm4gTWF0aC5mbG9vcihuKTtyZXR1cm4gTWF0aC5jZWlsKG4pfWZ1bmN0aW9uIGFkZChhLGIpe3ZhciBsX2E9YS5sZW5ndGgsbF9iPWIubGVuZ3RoLHI9bmV3IEFycmF5KGxfYSksY2Fycnk9MCxiYXNlPUJBU0Usc3VtLGk7Zm9yKGk9MDtpPGxfYjtpKyspe3N1bT1hW2ldK2JbaV0rY2Fycnk7Y2Fycnk9c3VtPj1iYXNlPzE6MDtyW2ldPXN1bS1jYXJyeSpiYXNlfXdoaWxlKGk8bF9hKXtzdW09YVtpXStjYXJyeTtjYXJyeT1zdW09PT1iYXNlPzE6MDtyW2krK109c3VtLWNhcnJ5KmJhc2V9aWYoY2Fycnk+MClyLnB1c2goY2FycnkpO3JldHVybiByfWZ1bmN0aW9uIGFkZEFueShhLGIpe2lmKGEubGVuZ3RoPj1iLmxlbmd0aClyZXR1cm4gYWRkKGEsYik7cmV0dXJuIGFkZChiLGEpfWZ1bmN0aW9uIGFkZFNtYWxsKGEsY2Fycnkpe3ZhciBsPWEubGVuZ3RoLHI9bmV3IEFycmF5KGwpLGJhc2U9QkFTRSxzdW0saTtmb3IoaT0wO2k8bDtpKyspe3N1bT1hW2ldLWJhc2UrY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihzdW0vYmFzZSk7cltpXT1zdW0tY2FycnkqYmFzZTtjYXJyeSs9MX13aGlsZShjYXJyeT4wKXtyW2krK109Y2FycnklYmFzZTtjYXJyeT1NYXRoLmZsb29yKGNhcnJ5L2Jhc2UpfXJldHVybiByfUJpZ0ludGVnZXIucHJvdG90eXBlLmFkZD1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO2lmKHRoaXMuc2lnbiE9PW4uc2lnbil7cmV0dXJuIHRoaXMuc3VidHJhY3Qobi5uZWdhdGUoKSl9dmFyIGE9dGhpcy52YWx1ZSxiPW4udmFsdWU7aWYobi5pc1NtYWxsKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoYWRkU21hbGwoYSxNYXRoLmFicyhiKSksdGhpcy5zaWduKX1yZXR1cm4gbmV3IEJpZ0ludGVnZXIoYWRkQW55KGEsYiksdGhpcy5zaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUucGx1cz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGQ7U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KTt2YXIgYT10aGlzLnZhbHVlO2lmKGE8MCE9PW4uc2lnbil7cmV0dXJuIHRoaXMuc3VidHJhY3Qobi5uZWdhdGUoKSl9dmFyIGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe2lmKGlzUHJlY2lzZShhK2IpKXJldHVybiBuZXcgU21hbGxJbnRlZ2VyKGErYik7Yj1zbWFsbFRvQXJyYXkoTWF0aC5hYnMoYikpfXJldHVybiBuZXcgQmlnSW50ZWdlcihhZGRTbWFsbChiLE1hdGguYWJzKGEpKSxhPDApfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnBsdXM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5hZGQ7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZStwYXJzZVZhbHVlKHYpLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5wbHVzPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUuYWRkO2Z1bmN0aW9uIHN1YnRyYWN0KGEsYil7dmFyIGFfbD1hLmxlbmd0aCxiX2w9Yi5sZW5ndGgscj1uZXcgQXJyYXkoYV9sKSxib3Jyb3c9MCxiYXNlPUJBU0UsaSxkaWZmZXJlbmNlO2ZvcihpPTA7aTxiX2w7aSsrKXtkaWZmZXJlbmNlPWFbaV0tYm9ycm93LWJbaV07aWYoZGlmZmVyZW5jZTwwKXtkaWZmZXJlbmNlKz1iYXNlO2JvcnJvdz0xfWVsc2UgYm9ycm93PTA7cltpXT1kaWZmZXJlbmNlfWZvcihpPWJfbDtpPGFfbDtpKyspe2RpZmZlcmVuY2U9YVtpXS1ib3Jyb3c7aWYoZGlmZmVyZW5jZTwwKWRpZmZlcmVuY2UrPWJhc2U7ZWxzZXtyW2krK109ZGlmZmVyZW5jZTticmVha31yW2ldPWRpZmZlcmVuY2V9Zm9yKDtpPGFfbDtpKyspe3JbaV09YVtpXX10cmltKHIpO3JldHVybiByfWZ1bmN0aW9uIHN1YnRyYWN0QW55KGEsYixzaWduKXt2YXIgdmFsdWU7aWYoY29tcGFyZUFicyhhLGIpPj0wKXt2YWx1ZT1zdWJ0cmFjdChhLGIpfWVsc2V7dmFsdWU9c3VidHJhY3QoYixhKTtzaWduPSFzaWdufXZhbHVlPWFycmF5VG9TbWFsbCh2YWx1ZSk7aWYodHlwZW9mIHZhbHVlPT09Im51bWJlciIpe2lmKHNpZ24pdmFsdWU9LXZhbHVlO3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKHZhbHVlKX1yZXR1cm4gbmV3IEJpZ0ludGVnZXIodmFsdWUsc2lnbil9ZnVuY3Rpb24gc3VidHJhY3RTbWFsbChhLGIsc2lnbil7dmFyIGw9YS5sZW5ndGgscj1uZXcgQXJyYXkobCksY2Fycnk9LWIsYmFzZT1CQVNFLGksZGlmZmVyZW5jZTtmb3IoaT0wO2k8bDtpKyspe2RpZmZlcmVuY2U9YVtpXStjYXJyeTtjYXJyeT1NYXRoLmZsb29yKGRpZmZlcmVuY2UvYmFzZSk7ZGlmZmVyZW5jZSU9YmFzZTtyW2ldPWRpZmZlcmVuY2U8MD9kaWZmZXJlbmNlK2Jhc2U6ZGlmZmVyZW5jZX1yPWFycmF5VG9TbWFsbChyKTtpZih0eXBlb2Ygcj09PSJudW1iZXIiKXtpZihzaWduKXI9LXI7cmV0dXJuIG5ldyBTbWFsbEludGVnZXIocil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHIsc2lnbil9QmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3Q9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KTtpZih0aGlzLnNpZ24hPT1uLnNpZ24pe3JldHVybiB0aGlzLmFkZChuLm5lZ2F0ZSgpKX12YXIgYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZihuLmlzU21hbGwpcmV0dXJuIHN1YnRyYWN0U21hbGwoYSxNYXRoLmFicyhiKSx0aGlzLnNpZ24pO3JldHVybiBzdWJ0cmFjdEFueShhLGIsdGhpcy5zaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUubWludXM9QmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3Q7U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5zdWJ0cmFjdD1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO3ZhciBhPXRoaXMudmFsdWU7aWYoYTwwIT09bi5zaWduKXtyZXR1cm4gdGhpcy5hZGQobi5uZWdhdGUoKSl9dmFyIGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKGEtYil9cmV0dXJuIHN1YnRyYWN0U21hbGwoYixNYXRoLmFicyhhKSxhPj0wKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5taW51cz1TbWFsbEludGVnZXIucHJvdG90eXBlLnN1YnRyYWN0O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc3VidHJhY3Q9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZS1wYXJzZVZhbHVlKHYpLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5taW51cz1OYXRpdmVCaWdJbnQucHJvdG90eXBlLnN1YnRyYWN0O0JpZ0ludGVnZXIucHJvdG90eXBlLm5lZ2F0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgQmlnSW50ZWdlcih0aGlzLnZhbHVlLCF0aGlzLnNpZ24pfTtTbWFsbEludGVnZXIucHJvdG90eXBlLm5lZ2F0ZT1mdW5jdGlvbigpe3ZhciBzaWduPXRoaXMuc2lnbjt2YXIgc21hbGw9bmV3IFNtYWxsSW50ZWdlcigtdGhpcy52YWx1ZSk7c21hbGwuc2lnbj0hc2lnbjtyZXR1cm4gc21hbGx9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubmVnYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoLXRoaXMudmFsdWUpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hYnM9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIodGhpcy52YWx1ZSxmYWxzZSl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuYWJzPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBTbWFsbEludGVnZXIoTWF0aC5hYnModGhpcy52YWx1ZSkpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmFicz1mdW5jdGlvbigpe3JldHVybiBuZXcgTmF0aXZlQmlnSW50KHRoaXMudmFsdWU+PTA/dGhpcy52YWx1ZTotdGhpcy52YWx1ZSl9O2Z1bmN0aW9uIG11bHRpcGx5TG9uZyhhLGIpe3ZhciBhX2w9YS5sZW5ndGgsYl9sPWIubGVuZ3RoLGw9YV9sK2JfbCxyPWNyZWF0ZUFycmF5KGwpLGJhc2U9QkFTRSxwcm9kdWN0LGNhcnJ5LGksYV9pLGJfajtmb3IoaT0wO2k8YV9sOysraSl7YV9pPWFbaV07Zm9yKHZhciBqPTA7ajxiX2w7KytqKXtiX2o9YltqXTtwcm9kdWN0PWFfaSpiX2orcltpK2pdO2NhcnJ5PU1hdGguZmxvb3IocHJvZHVjdC9iYXNlKTtyW2kral09cHJvZHVjdC1jYXJyeSpiYXNlO3JbaStqKzFdKz1jYXJyeX19dHJpbShyKTtyZXR1cm4gcn1mdW5jdGlvbiBtdWx0aXBseVNtYWxsKGEsYil7dmFyIGw9YS5sZW5ndGgscj1uZXcgQXJyYXkobCksYmFzZT1CQVNFLGNhcnJ5PTAscHJvZHVjdCxpO2ZvcihpPTA7aTxsO2krKyl7cHJvZHVjdD1hW2ldKmIrY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihwcm9kdWN0L2Jhc2UpO3JbaV09cHJvZHVjdC1jYXJyeSpiYXNlfXdoaWxlKGNhcnJ5PjApe3JbaSsrXT1jYXJyeSViYXNlO2NhcnJ5PU1hdGguZmxvb3IoY2FycnkvYmFzZSl9cmV0dXJuIHJ9ZnVuY3Rpb24gc2hpZnRMZWZ0KHgsbil7dmFyIHI9W107d2hpbGUobi0tID4wKXIucHVzaCgwKTtyZXR1cm4gci5jb25jYXQoeCl9ZnVuY3Rpb24gbXVsdGlwbHlLYXJhdHN1YmEoeCx5KXt2YXIgbj1NYXRoLm1heCh4Lmxlbmd0aCx5Lmxlbmd0aCk7aWYobjw9MzApcmV0dXJuIG11bHRpcGx5TG9uZyh4LHkpO249TWF0aC5jZWlsKG4vMik7dmFyIGI9eC5zbGljZShuKSxhPXguc2xpY2UoMCxuKSxkPXkuc2xpY2UobiksYz15LnNsaWNlKDAsbik7dmFyIGFjPW11bHRpcGx5S2FyYXRzdWJhKGEsYyksYmQ9bXVsdGlwbHlLYXJhdHN1YmEoYixkKSxhYmNkPW11bHRpcGx5S2FyYXRzdWJhKGFkZEFueShhLGIpLGFkZEFueShjLGQpKTt2YXIgcHJvZHVjdD1hZGRBbnkoYWRkQW55KGFjLHNoaWZ0TGVmdChzdWJ0cmFjdChzdWJ0cmFjdChhYmNkLGFjKSxiZCksbikpLHNoaWZ0TGVmdChiZCwyKm4pKTt0cmltKHByb2R1Y3QpO3JldHVybiBwcm9kdWN0fWZ1bmN0aW9uIHVzZUthcmF0c3ViYShsMSxsMil7cmV0dXJuLS4wMTIqbDEtLjAxMipsMisxNWUtNipsMSpsMj4wfUJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5PWZ1bmN0aW9uKHYpe3ZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZSxzaWduPXRoaXMuc2lnbiE9PW4uc2lnbixhYnM7aWYobi5pc1NtYWxsKXtpZihiPT09MClyZXR1cm4gSW50ZWdlclswXTtpZihiPT09MSlyZXR1cm4gdGhpcztpZihiPT09LTEpcmV0dXJuIHRoaXMubmVnYXRlKCk7YWJzPU1hdGguYWJzKGIpO2lmKGFiczxCQVNFKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIobXVsdGlwbHlTbWFsbChhLGFicyksc2lnbil9Yj1zbWFsbFRvQXJyYXkoYWJzKX1pZih1c2VLYXJhdHN1YmEoYS5sZW5ndGgsYi5sZW5ndGgpKXJldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseUthcmF0c3ViYShhLGIpLHNpZ24pO3JldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseUxvbmcoYSxiKSxzaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUudGltZXM9QmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHk7ZnVuY3Rpb24gbXVsdGlwbHlTbWFsbEFuZEFycmF5KGEsYixzaWduKXtpZihhPEJBU0Upe3JldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseVNtYWxsKGIsYSksc2lnbil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKG11bHRpcGx5TG9uZyhiLHNtYWxsVG9BcnJheShhKSksc2lnbil9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5fbXVsdGlwbHlCeVNtYWxsPWZ1bmN0aW9uKGEpe2lmKGlzUHJlY2lzZShhLnZhbHVlKnRoaXMudmFsdWUpKXtyZXR1cm4gbmV3IFNtYWxsSW50ZWdlcihhLnZhbHVlKnRoaXMudmFsdWUpfXJldHVybiBtdWx0aXBseVNtYWxsQW5kQXJyYXkoTWF0aC5hYnMoYS52YWx1ZSksc21hbGxUb0FycmF5KE1hdGguYWJzKHRoaXMudmFsdWUpKSx0aGlzLnNpZ24hPT1hLnNpZ24pfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5fbXVsdGlwbHlCeVNtYWxsPWZ1bmN0aW9uKGEpe2lmKGEudmFsdWU9PT0wKXJldHVybiBJbnRlZ2VyWzBdO2lmKGEudmFsdWU9PT0xKXJldHVybiB0aGlzO2lmKGEudmFsdWU9PT0tMSlyZXR1cm4gdGhpcy5uZWdhdGUoKTtyZXR1cm4gbXVsdGlwbHlTbWFsbEFuZEFycmF5KE1hdGguYWJzKGEudmFsdWUpLHRoaXMudmFsdWUsdGhpcy5zaWduIT09YS5zaWduKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbih2KXtyZXR1cm4gcGFyc2VWYWx1ZSh2KS5fbXVsdGlwbHlCeVNtYWxsKHRoaXMpfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnRpbWVzPVNtYWxsSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHk7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbih2KXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlKnBhcnNlVmFsdWUodikudmFsdWUpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLnRpbWVzPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubXVsdGlwbHk7ZnVuY3Rpb24gc3F1YXJlKGEpe3ZhciBsPWEubGVuZ3RoLHI9Y3JlYXRlQXJyYXkobCtsKSxiYXNlPUJBU0UscHJvZHVjdCxjYXJyeSxpLGFfaSxhX2o7Zm9yKGk9MDtpPGw7aSsrKXthX2k9YVtpXTtjYXJyeT0wLWFfaSphX2k7Zm9yKHZhciBqPWk7ajxsO2orKyl7YV9qPWFbal07cHJvZHVjdD0yKihhX2kqYV9qKStyW2kral0rY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihwcm9kdWN0L2Jhc2UpO3JbaStqXT1wcm9kdWN0LWNhcnJ5KmJhc2V9cltpK2xdPWNhcnJ5fXRyaW0ocik7cmV0dXJuIHJ9QmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHNxdWFyZSh0aGlzLnZhbHVlKSxmYWxzZSl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlPWZ1bmN0aW9uKCl7dmFyIHZhbHVlPXRoaXMudmFsdWUqdGhpcy52YWx1ZTtpZihpc1ByZWNpc2UodmFsdWUpKXJldHVybiBuZXcgU21hbGxJbnRlZ2VyKHZhbHVlKTtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoc3F1YXJlKHNtYWxsVG9BcnJheShNYXRoLmFicyh0aGlzLnZhbHVlKSkpLGZhbHNlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5zcXVhcmU9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZSp0aGlzLnZhbHVlKX07ZnVuY3Rpb24gZGl2TW9kMShhLGIpe3ZhciBhX2w9YS5sZW5ndGgsYl9sPWIubGVuZ3RoLGJhc2U9QkFTRSxyZXN1bHQ9Y3JlYXRlQXJyYXkoYi5sZW5ndGgpLGRpdmlzb3JNb3N0U2lnbmlmaWNhbnREaWdpdD1iW2JfbC0xXSxsYW1iZGE9TWF0aC5jZWlsKGJhc2UvKDIqZGl2aXNvck1vc3RTaWduaWZpY2FudERpZ2l0KSkscmVtYWluZGVyPW11bHRpcGx5U21hbGwoYSxsYW1iZGEpLGRpdmlzb3I9bXVsdGlwbHlTbWFsbChiLGxhbWJkYSkscXVvdGllbnREaWdpdCxzaGlmdCxjYXJyeSxib3Jyb3csaSxsLHE7aWYocmVtYWluZGVyLmxlbmd0aDw9YV9sKXJlbWFpbmRlci5wdXNoKDApO2Rpdmlzb3IucHVzaCgwKTtkaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQ9ZGl2aXNvcltiX2wtMV07Zm9yKHNoaWZ0PWFfbC1iX2w7c2hpZnQ+PTA7c2hpZnQtLSl7cXVvdGllbnREaWdpdD1iYXNlLTE7aWYocmVtYWluZGVyW3NoaWZ0K2JfbF0hPT1kaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQpe3F1b3RpZW50RGlnaXQ9TWF0aC5mbG9vcigocmVtYWluZGVyW3NoaWZ0K2JfbF0qYmFzZStyZW1haW5kZXJbc2hpZnQrYl9sLTFdKS9kaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQpfWNhcnJ5PTA7Ym9ycm93PTA7bD1kaXZpc29yLmxlbmd0aDtmb3IoaT0wO2k8bDtpKyspe2NhcnJ5Kz1xdW90aWVudERpZ2l0KmRpdmlzb3JbaV07cT1NYXRoLmZsb29yKGNhcnJ5L2Jhc2UpO2JvcnJvdys9cmVtYWluZGVyW3NoaWZ0K2ldLShjYXJyeS1xKmJhc2UpO2NhcnJ5PXE7aWYoYm9ycm93PDApe3JlbWFpbmRlcltzaGlmdCtpXT1ib3Jyb3crYmFzZTtib3Jyb3c9LTF9ZWxzZXtyZW1haW5kZXJbc2hpZnQraV09Ym9ycm93O2JvcnJvdz0wfX13aGlsZShib3Jyb3chPT0wKXtxdW90aWVudERpZ2l0LT0xO2NhcnJ5PTA7Zm9yKGk9MDtpPGw7aSsrKXtjYXJyeSs9cmVtYWluZGVyW3NoaWZ0K2ldLWJhc2UrZGl2aXNvcltpXTtpZihjYXJyeTwwKXtyZW1haW5kZXJbc2hpZnQraV09Y2FycnkrYmFzZTtjYXJyeT0wfWVsc2V7cmVtYWluZGVyW3NoaWZ0K2ldPWNhcnJ5O2NhcnJ5PTF9fWJvcnJvdys9Y2Fycnl9cmVzdWx0W3NoaWZ0XT1xdW90aWVudERpZ2l0fXJlbWFpbmRlcj1kaXZNb2RTbWFsbChyZW1haW5kZXIsbGFtYmRhKVswXTtyZXR1cm5bYXJyYXlUb1NtYWxsKHJlc3VsdCksYXJyYXlUb1NtYWxsKHJlbWFpbmRlcildfWZ1bmN0aW9uIGRpdk1vZDIoYSxiKXt2YXIgYV9sPWEubGVuZ3RoLGJfbD1iLmxlbmd0aCxyZXN1bHQ9W10scGFydD1bXSxiYXNlPUJBU0UsZ3Vlc3MseGxlbixoaWdoeCxoaWdoeSxjaGVjazt3aGlsZShhX2wpe3BhcnQudW5zaGlmdChhWy0tYV9sXSk7dHJpbShwYXJ0KTtpZihjb21wYXJlQWJzKHBhcnQsYik8MCl7cmVzdWx0LnB1c2goMCk7Y29udGludWV9eGxlbj1wYXJ0Lmxlbmd0aDtoaWdoeD1wYXJ0W3hsZW4tMV0qYmFzZStwYXJ0W3hsZW4tMl07aGlnaHk9YltiX2wtMV0qYmFzZStiW2JfbC0yXTtpZih4bGVuPmJfbCl7aGlnaHg9KGhpZ2h4KzEpKmJhc2V9Z3Vlc3M9TWF0aC5jZWlsKGhpZ2h4L2hpZ2h5KTtkb3tjaGVjaz1tdWx0aXBseVNtYWxsKGIsZ3Vlc3MpO2lmKGNvbXBhcmVBYnMoY2hlY2sscGFydCk8PTApYnJlYWs7Z3Vlc3MtLX13aGlsZShndWVzcyk7cmVzdWx0LnB1c2goZ3Vlc3MpO3BhcnQ9c3VidHJhY3QocGFydCxjaGVjayl9cmVzdWx0LnJldmVyc2UoKTtyZXR1cm5bYXJyYXlUb1NtYWxsKHJlc3VsdCksYXJyYXlUb1NtYWxsKHBhcnQpXX1mdW5jdGlvbiBkaXZNb2RTbWFsbCh2YWx1ZSxsYW1iZGEpe3ZhciBsZW5ndGg9dmFsdWUubGVuZ3RoLHF1b3RpZW50PWNyZWF0ZUFycmF5KGxlbmd0aCksYmFzZT1CQVNFLGkscSxyZW1haW5kZXIsZGl2aXNvcjtyZW1haW5kZXI9MDtmb3IoaT1sZW5ndGgtMTtpPj0wOy0taSl7ZGl2aXNvcj1yZW1haW5kZXIqYmFzZSt2YWx1ZVtpXTtxPXRydW5jYXRlKGRpdmlzb3IvbGFtYmRhKTtyZW1haW5kZXI9ZGl2aXNvci1xKmxhbWJkYTtxdW90aWVudFtpXT1xfDB9cmV0dXJuW3F1b3RpZW50LHJlbWFpbmRlcnwwXX1mdW5jdGlvbiBkaXZNb2RBbnkoc2VsZix2KXt2YXIgdmFsdWUsbj1wYXJzZVZhbHVlKHYpO2lmKHN1cHBvcnRzTmF0aXZlQmlnSW50KXtyZXR1cm5bbmV3IE5hdGl2ZUJpZ0ludChzZWxmLnZhbHVlL24udmFsdWUpLG5ldyBOYXRpdmVCaWdJbnQoc2VsZi52YWx1ZSVuLnZhbHVlKV19dmFyIGE9c2VsZi52YWx1ZSxiPW4udmFsdWU7dmFyIHF1b3RpZW50O2lmKGI9PT0wKXRocm93IG5ldyBFcnJvcigiQ2Fubm90IGRpdmlkZSBieSB6ZXJvIik7aWYoc2VsZi5pc1NtYWxsKXtpZihuLmlzU21hbGwpe3JldHVybltuZXcgU21hbGxJbnRlZ2VyKHRydW5jYXRlKGEvYikpLG5ldyBTbWFsbEludGVnZXIoYSViKV19cmV0dXJuW0ludGVnZXJbMF0sc2VsZl19aWYobi5pc1NtYWxsKXtpZihiPT09MSlyZXR1cm5bc2VsZixJbnRlZ2VyWzBdXTtpZihiPT0tMSlyZXR1cm5bc2VsZi5uZWdhdGUoKSxJbnRlZ2VyWzBdXTt2YXIgYWJzPU1hdGguYWJzKGIpO2lmKGFiczxCQVNFKXt2YWx1ZT1kaXZNb2RTbWFsbChhLGFicyk7cXVvdGllbnQ9YXJyYXlUb1NtYWxsKHZhbHVlWzBdKTt2YXIgcmVtYWluZGVyPXZhbHVlWzFdO2lmKHNlbGYuc2lnbilyZW1haW5kZXI9LXJlbWFpbmRlcjtpZih0eXBlb2YgcXVvdGllbnQ9PT0ibnVtYmVyIil7aWYoc2VsZi5zaWduIT09bi5zaWduKXF1b3RpZW50PS1xdW90aWVudDtyZXR1cm5bbmV3IFNtYWxsSW50ZWdlcihxdW90aWVudCksbmV3IFNtYWxsSW50ZWdlcihyZW1haW5kZXIpXX1yZXR1cm5bbmV3IEJpZ0ludGVnZXIocXVvdGllbnQsc2VsZi5zaWduIT09bi5zaWduKSxuZXcgU21hbGxJbnRlZ2VyKHJlbWFpbmRlcildfWI9c21hbGxUb0FycmF5KGFicyl9dmFyIGNvbXBhcmlzb249Y29tcGFyZUFicyhhLGIpO2lmKGNvbXBhcmlzb249PT0tMSlyZXR1cm5bSW50ZWdlclswXSxzZWxmXTtpZihjb21wYXJpc29uPT09MClyZXR1cm5bSW50ZWdlcltzZWxmLnNpZ249PT1uLnNpZ24/MTotMV0sSW50ZWdlclswXV07aWYoYS5sZW5ndGgrYi5sZW5ndGg8PTIwMCl2YWx1ZT1kaXZNb2QxKGEsYik7ZWxzZSB2YWx1ZT1kaXZNb2QyKGEsYik7cXVvdGllbnQ9dmFsdWVbMF07dmFyIHFTaWduPXNlbGYuc2lnbiE9PW4uc2lnbixtb2Q9dmFsdWVbMV0sbVNpZ249c2VsZi5zaWduO2lmKHR5cGVvZiBxdW90aWVudD09PSJudW1iZXIiKXtpZihxU2lnbilxdW90aWVudD0tcXVvdGllbnQ7cXVvdGllbnQ9bmV3IFNtYWxsSW50ZWdlcihxdW90aWVudCl9ZWxzZSBxdW90aWVudD1uZXcgQmlnSW50ZWdlcihxdW90aWVudCxxU2lnbik7aWYodHlwZW9mIG1vZD09PSJudW1iZXIiKXtpZihtU2lnbiltb2Q9LW1vZDttb2Q9bmV3IFNtYWxsSW50ZWdlcihtb2QpfWVsc2UgbW9kPW5ldyBCaWdJbnRlZ2VyKG1vZCxtU2lnbik7cmV0dXJuW3F1b3RpZW50LG1vZF19QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2bW9kPWZ1bmN0aW9uKHYpe3ZhciByZXN1bHQ9ZGl2TW9kQW55KHRoaXMsdik7cmV0dXJue3F1b3RpZW50OnJlc3VsdFswXSxyZW1haW5kZXI6cmVzdWx0WzFdfX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5kaXZtb2Q9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5kaXZtb2Q9QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2bW9kO0JpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZT1mdW5jdGlvbih2KXtyZXR1cm4gZGl2TW9kQW55KHRoaXMsdilbMF19O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUub3Zlcj1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmRpdmlkZT1mdW5jdGlvbih2KXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlL3BhcnNlVmFsdWUodikudmFsdWUpfTtTbWFsbEludGVnZXIucHJvdG90eXBlLm92ZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGU9QmlnSW50ZWdlci5wcm90b3R5cGUub3Zlcj1CaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGU7QmlnSW50ZWdlci5wcm90b3R5cGUubW9kPWZ1bmN0aW9uKHYpe3JldHVybiBkaXZNb2RBbnkodGhpcyx2KVsxXX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5tb2Q9TmF0aXZlQmlnSW50LnByb3RvdHlwZS5yZW1haW5kZXI9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZSVwYXJzZVZhbHVlKHYpLnZhbHVlKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5yZW1haW5kZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5tb2Q9QmlnSW50ZWdlci5wcm90b3R5cGUucmVtYWluZGVyPUJpZ0ludGVnZXIucHJvdG90eXBlLm1vZDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5wb3c9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KSxhPXRoaXMudmFsdWUsYj1uLnZhbHVlLHZhbHVlLHgseTtpZihiPT09MClyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09MClyZXR1cm4gSW50ZWdlclswXTtpZihhPT09MSlyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09LTEpcmV0dXJuIG4uaXNFdmVuKCk/SW50ZWdlclsxXTpJbnRlZ2VyWy0xXTtpZihuLnNpZ24pe3JldHVybiBJbnRlZ2VyWzBdfWlmKCFuLmlzU21hbGwpdGhyb3cgbmV3IEVycm9yKCJUaGUgZXhwb25lbnQgIituLnRvU3RyaW5nKCkrIiBpcyB0b28gbGFyZ2UuIik7aWYodGhpcy5pc1NtYWxsKXtpZihpc1ByZWNpc2UodmFsdWU9TWF0aC5wb3coYSxiKSkpcmV0dXJuIG5ldyBTbWFsbEludGVnZXIodHJ1bmNhdGUodmFsdWUpKX14PXRoaXM7eT1JbnRlZ2VyWzFdO3doaWxlKHRydWUpe2lmKGImMT09PTEpe3k9eS50aW1lcyh4KTstLWJ9aWYoYj09PTApYnJlYWs7Yi89Mjt4PXguc3F1YXJlKCl9cmV0dXJuIHl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUucG93PUJpZ0ludGVnZXIucHJvdG90eXBlLnBvdztOYXRpdmVCaWdJbnQucHJvdG90eXBlLnBvdz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO3ZhciBhPXRoaXMudmFsdWUsYj1uLnZhbHVlO3ZhciBfMD1CaWdJbnQoMCksXzE9QmlnSW50KDEpLF8yPUJpZ0ludCgyKTtpZihiPT09XzApcmV0dXJuIEludGVnZXJbMV07aWYoYT09PV8wKXJldHVybiBJbnRlZ2VyWzBdO2lmKGE9PT1fMSlyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09QmlnSW50KC0xKSlyZXR1cm4gbi5pc0V2ZW4oKT9JbnRlZ2VyWzFdOkludGVnZXJbLTFdO2lmKG4uaXNOZWdhdGl2ZSgpKXJldHVybiBuZXcgTmF0aXZlQmlnSW50KF8wKTt2YXIgeD10aGlzO3ZhciB5PUludGVnZXJbMV07d2hpbGUodHJ1ZSl7aWYoKGImXzEpPT09XzEpe3k9eS50aW1lcyh4KTstLWJ9aWYoYj09PV8wKWJyZWFrO2IvPV8yO3g9eC5zcXVhcmUoKX1yZXR1cm4geX07QmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93PWZ1bmN0aW9uKGV4cCxtb2Qpe2V4cD1wYXJzZVZhbHVlKGV4cCk7bW9kPXBhcnNlVmFsdWUobW9kKTtpZihtb2QuaXNaZXJvKCkpdGhyb3cgbmV3IEVycm9yKCJDYW5ub3QgdGFrZSBtb2RQb3cgd2l0aCBtb2R1bHVzIDAiKTt2YXIgcj1JbnRlZ2VyWzFdLGJhc2U9dGhpcy5tb2QobW9kKTtpZihleHAuaXNOZWdhdGl2ZSgpKXtleHA9ZXhwLm11bHRpcGx5KEludGVnZXJbLTFdKTtiYXNlPWJhc2UubW9kSW52KG1vZCl9d2hpbGUoZXhwLmlzUG9zaXRpdmUoKSl7aWYoYmFzZS5pc1plcm8oKSlyZXR1cm4gSW50ZWdlclswXTtpZihleHAuaXNPZGQoKSlyPXIubXVsdGlwbHkoYmFzZSkubW9kKG1vZCk7ZXhwPWV4cC5kaXZpZGUoMik7YmFzZT1iYXNlLnNxdWFyZSgpLm1vZChtb2QpfXJldHVybiByfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm1vZFBvdz1TbWFsbEludGVnZXIucHJvdG90eXBlLm1vZFBvdz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3c7ZnVuY3Rpb24gY29tcGFyZUFicyhhLGIpe2lmKGEubGVuZ3RoIT09Yi5sZW5ndGgpe3JldHVybiBhLmxlbmd0aD5iLmxlbmd0aD8xOi0xfWZvcih2YXIgaT1hLmxlbmd0aC0xO2k+PTA7aS0tKXtpZihhW2ldIT09YltpXSlyZXR1cm4gYVtpXT5iW2ldPzE6LTF9cmV0dXJuIDB9QmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZUFicz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpLGE9dGhpcy52YWx1ZSxiPW4udmFsdWU7aWYobi5pc1NtYWxsKXJldHVybiAxO3JldHVybiBjb21wYXJlQWJzKGEsYil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZUFicz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpLGE9TWF0aC5hYnModGhpcy52YWx1ZSksYj1uLnZhbHVlO2lmKG4uaXNTbWFsbCl7Yj1NYXRoLmFicyhiKTtyZXR1cm4gYT09PWI/MDphPmI/MTotMX1yZXR1cm4tMX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5jb21wYXJlQWJzPWZ1bmN0aW9uKHYpe3ZhciBhPXRoaXMudmFsdWU7dmFyIGI9cGFyc2VWYWx1ZSh2KS52YWx1ZTthPWE+PTA/YTotYTtiPWI+PTA/YjotYjtyZXR1cm4gYT09PWI/MDphPmI/MTotMX07QmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZT1mdW5jdGlvbih2KXtpZih2PT09SW5maW5pdHkpe3JldHVybi0xfWlmKHY9PT0tSW5maW5pdHkpe3JldHVybiAxfXZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZih0aGlzLnNpZ24hPT1uLnNpZ24pe3JldHVybiBuLnNpZ24/MTotMX1pZihuLmlzU21hbGwpe3JldHVybiB0aGlzLnNpZ24/LTE6MX1yZXR1cm4gY29tcGFyZUFicyhhLGIpKih0aGlzLnNpZ24/LTE6MSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb21wYXJlO1NtYWxsSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZT1mdW5jdGlvbih2KXtpZih2PT09SW5maW5pdHkpe3JldHVybi0xfWlmKHY9PT0tSW5maW5pdHkpe3JldHVybiAxfXZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe3JldHVybiBhPT1iPzA6YT5iPzE6LTF9aWYoYTwwIT09bi5zaWduKXtyZXR1cm4gYTwwPy0xOjF9cmV0dXJuIGE8MD8xOi0xfTtTbWFsbEludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbz1TbWFsbEludGVnZXIucHJvdG90eXBlLmNvbXBhcmU7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5jb21wYXJlPWZ1bmN0aW9uKHYpe2lmKHY9PT1JbmZpbml0eSl7cmV0dXJuLTF9aWYodj09PS1JbmZpbml0eSl7cmV0dXJuIDF9dmFyIGE9dGhpcy52YWx1ZTt2YXIgYj1wYXJzZVZhbHVlKHYpLnZhbHVlO3JldHVybiBhPT09Yj8wOmE+Yj8xOi0xfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmNvbXBhcmVUbz1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmNvbXBhcmU7QmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik9PT0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmVxPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUuZXF1YWxzPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5lcXVhbHM9QmlnSW50ZWdlci5wcm90b3R5cGUuZXE9QmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzO0JpZ0ludGVnZXIucHJvdG90eXBlLm5vdEVxdWFscz1mdW5jdGlvbih2KXtyZXR1cm4gdGhpcy5jb21wYXJlKHYpIT09MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5uZXE9TmF0aXZlQmlnSW50LnByb3RvdHlwZS5ub3RFcXVhbHM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5uZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5ub3RFcXVhbHM9QmlnSW50ZWdlci5wcm90b3R5cGUubmVxPUJpZ0ludGVnZXIucHJvdG90eXBlLm5vdEVxdWFscztCaWdJbnRlZ2VyLnByb3RvdHlwZS5ncmVhdGVyPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik+MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5ndD1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmdyZWF0ZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5ndD1TbWFsbEludGVnZXIucHJvdG90eXBlLmdyZWF0ZXI9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3Q9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3JlYXRlcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXI9ZnVuY3Rpb24odil7cmV0dXJuIHRoaXMuY29tcGFyZSh2KTwwfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmx0PU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVzc2VyPVNtYWxsSW50ZWdlci5wcm90b3R5cGUubHQ9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXI9QmlnSW50ZWdlci5wcm90b3R5cGUubHQ9QmlnSW50ZWdlci5wcm90b3R5cGUubGVzc2VyO0JpZ0ludGVnZXIucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1mdW5jdGlvbih2KXtyZXR1cm4gdGhpcy5jb21wYXJlKHYpPj0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmdlcT1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1TbWFsbEludGVnZXIucHJvdG90eXBlLmdlcT1TbWFsbEludGVnZXIucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5nZXE9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3JlYXRlck9yRXF1YWxzO0JpZ0ludGVnZXIucHJvdG90eXBlLmxlc3Nlck9yRXF1YWxzPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik8PTB9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVxPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVzc2VyT3JFcXVhbHM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXJPckVxdWFscz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5sZXE9QmlnSW50ZWdlci5wcm90b3R5cGUubGVzc2VyT3JFcXVhbHM7QmlnSW50ZWdlci5wcm90b3R5cGUuaXNFdmVuPWZ1bmN0aW9uKCl7cmV0dXJuKHRoaXMudmFsdWVbMF0mMSk9PT0wfTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzRXZlbj1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJjEpPT09MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc0V2ZW49ZnVuY3Rpb24oKXtyZXR1cm4odGhpcy52YWx1ZSZCaWdJbnQoMSkpPT09QmlnSW50KDApfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlWzBdJjEpPT09MX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJjEpPT09MX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJkJpZ0ludCgxKSk9PT1CaWdJbnQoMSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLmlzUG9zaXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4hdGhpcy5zaWdufTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzUG9zaXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZT4wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzUG9zaXRpdmU9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc1Bvc2l0aXZlO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzTmVnYXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zaWdufTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzTmVnYXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZTwwfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzTmVnYXRpdmU9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc05lZ2F0aXZlO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzVW5pdD1mdW5jdGlvbigpe3JldHVybiBmYWxzZX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc1VuaXQ9ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5hYnModGhpcy52YWx1ZSk9PT0xfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzVW5pdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFicygpLnZhbHVlPT09QmlnSW50KDEpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1plcm89ZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2V9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNaZXJvPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmFsdWU9PT0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzWmVybz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZhbHVlPT09QmlnSW50KDApfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5PWZ1bmN0aW9uKHYpe3ZhciBuPXBhcnNlVmFsdWUodik7aWYobi5pc1plcm8oKSlyZXR1cm4gZmFsc2U7aWYobi5pc1VuaXQoKSlyZXR1cm4gdHJ1ZTtpZihuLmNvbXBhcmVBYnMoMik9PT0wKXJldHVybiB0aGlzLmlzRXZlbigpO3JldHVybiB0aGlzLm1vZChuKS5pc1plcm8oKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5PVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNEaXZpc2libGVCeT1CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5O2Z1bmN0aW9uIGlzQmFzaWNQcmltZSh2KXt2YXIgbj12LmFicygpO2lmKG4uaXNVbml0KCkpcmV0dXJuIGZhbHNlO2lmKG4uZXF1YWxzKDIpfHxuLmVxdWFscygzKXx8bi5lcXVhbHMoNSkpcmV0dXJuIHRydWU7aWYobi5pc0V2ZW4oKXx8bi5pc0RpdmlzaWJsZUJ5KDMpfHxuLmlzRGl2aXNpYmxlQnkoNSkpcmV0dXJuIGZhbHNlO2lmKG4ubGVzc2VyKDQ5KSlyZXR1cm4gdHJ1ZX1mdW5jdGlvbiBtaWxsZXJSYWJpblRlc3QobixhKXt2YXIgblByZXY9bi5wcmV2KCksYj1uUHJldixyPTAsZCx0LGkseDt3aGlsZShiLmlzRXZlbigpKWI9Yi5kaXZpZGUoMikscisrO25leHQ6Zm9yKGk9MDtpPGEubGVuZ3RoO2krKyl7aWYobi5sZXNzZXIoYVtpXSkpY29udGludWU7eD1iaWdJbnQoYVtpXSkubW9kUG93KGIsbik7aWYoeC5pc1VuaXQoKXx8eC5lcXVhbHMoblByZXYpKWNvbnRpbnVlO2ZvcihkPXItMTtkIT0wO2QtLSl7eD14LnNxdWFyZSgpLm1vZChuKTtpZih4LmlzVW5pdCgpKXJldHVybiBmYWxzZTtpZih4LmVxdWFscyhuUHJldikpY29udGludWUgbmV4dH1yZXR1cm4gZmFsc2V9cmV0dXJuIHRydWV9QmlnSW50ZWdlci5wcm90b3R5cGUuaXNQcmltZT1mdW5jdGlvbihzdHJpY3Qpe3ZhciBpc1ByaW1lPWlzQmFzaWNQcmltZSh0aGlzKTtpZihpc1ByaW1lIT09dW5kZWZpbmVkKXJldHVybiBpc1ByaW1lO3ZhciBuPXRoaXMuYWJzKCk7dmFyIGJpdHM9bi5iaXRMZW5ndGgoKTtpZihiaXRzPD02NClyZXR1cm4gbWlsbGVyUmFiaW5UZXN0KG4sWzIsMyw1LDcsMTEsMTMsMTcsMTksMjMsMjksMzEsMzddKTt2YXIgbG9nTj1NYXRoLmxvZygyKSpiaXRzLnRvSlNOdW1iZXIoKTt2YXIgdD1NYXRoLmNlaWwoc3RyaWN0PT09dHJ1ZT8yKk1hdGgucG93KGxvZ04sMik6bG9nTik7Zm9yKHZhciBhPVtdLGk9MDtpPHQ7aSsrKXthLnB1c2goYmlnSW50KGkrMikpfXJldHVybiBtaWxsZXJSYWJpblRlc3QobixhKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc1ByaW1lPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNQcmltZT1CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1ByaW1lO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZT1mdW5jdGlvbihpdGVyYXRpb25zKXt2YXIgaXNQcmltZT1pc0Jhc2ljUHJpbWUodGhpcyk7aWYoaXNQcmltZSE9PXVuZGVmaW5lZClyZXR1cm4gaXNQcmltZTt2YXIgbj10aGlzLmFicygpO3ZhciB0PWl0ZXJhdGlvbnM9PT11bmRlZmluZWQ/NTppdGVyYXRpb25zO2Zvcih2YXIgYT1bXSxpPTA7aTx0O2krKyl7YS5wdXNoKGJpZ0ludC5yYW5kQmV0d2VlbigyLG4ubWludXMoMikpKX1yZXR1cm4gbWlsbGVyUmFiaW5UZXN0KG4sYSl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lPUJpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnY9ZnVuY3Rpb24obil7dmFyIHQ9YmlnSW50Lnplcm8sbmV3VD1iaWdJbnQub25lLHI9cGFyc2VWYWx1ZShuKSxuZXdSPXRoaXMuYWJzKCkscSxsYXN0VCxsYXN0Ujt3aGlsZSghbmV3Ui5pc1plcm8oKSl7cT1yLmRpdmlkZShuZXdSKTtsYXN0VD10O2xhc3RSPXI7dD1uZXdUO3I9bmV3UjtuZXdUPWxhc3RULnN1YnRyYWN0KHEubXVsdGlwbHkobmV3VCkpO25ld1I9bGFzdFIuc3VidHJhY3QocS5tdWx0aXBseShuZXdSKSl9aWYoIXIuaXNVbml0KCkpdGhyb3cgbmV3IEVycm9yKHRoaXMudG9TdHJpbmcoKSsiIGFuZCAiK24udG9TdHJpbmcoKSsiIGFyZSBub3QgY28tcHJpbWUiKTtpZih0LmNvbXBhcmUoMCk9PT0tMSl7dD10LmFkZChuKX1pZih0aGlzLmlzTmVnYXRpdmUoKSl7cmV0dXJuIHQubmVnYXRlKCl9cmV0dXJuIHR9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubW9kSW52PVNtYWxsSW50ZWdlci5wcm90b3R5cGUubW9kSW52PUJpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIHZhbHVlPXRoaXMudmFsdWU7aWYodGhpcy5zaWduKXtyZXR1cm4gc3VidHJhY3RTbWFsbCh2YWx1ZSwxLHRoaXMuc2lnbil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKGFkZFNtYWxsKHZhbHVlLDEpLHRoaXMuc2lnbil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe3ZhciB2YWx1ZT10aGlzLnZhbHVlO2lmKHZhbHVlKzE8TUFYX0lOVClyZXR1cm4gbmV3IFNtYWxsSW50ZWdlcih2YWx1ZSsxKTtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoTUFYX0lOVF9BUlIsZmFsc2UpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlK0JpZ0ludCgxKSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXt2YXIgdmFsdWU9dGhpcy52YWx1ZTtpZih0aGlzLnNpZ24pe3JldHVybiBuZXcgQmlnSW50ZWdlcihhZGRTbWFsbCh2YWx1ZSwxKSx0cnVlKX1yZXR1cm4gc3VidHJhY3RTbWFsbCh2YWx1ZSwxLHRoaXMuc2lnbil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe3ZhciB2YWx1ZT10aGlzLnZhbHVlO2lmKHZhbHVlLTE+LU1BWF9JTlQpcmV0dXJuIG5ldyBTbWFsbEludGVnZXIodmFsdWUtMSk7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKE1BWF9JTlRfQVJSLHRydWUpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlLUJpZ0ludCgxKSl9O3ZhciBwb3dlcnNPZlR3bz1bMV07d2hpbGUoMipwb3dlcnNPZlR3b1twb3dlcnNPZlR3by5sZW5ndGgtMV08PUJBU0UpcG93ZXJzT2ZUd28ucHVzaCgyKnBvd2Vyc09mVHdvW3Bvd2Vyc09mVHdvLmxlbmd0aC0xXSk7dmFyIHBvd2VyczJMZW5ndGg9cG93ZXJzT2ZUd28ubGVuZ3RoLGhpZ2hlc3RQb3dlcjI9cG93ZXJzT2ZUd29bcG93ZXJzMkxlbmd0aC0xXTtmdW5jdGlvbiBzaGlmdF9pc1NtYWxsKG4pe3JldHVybiBNYXRoLmFicyhuKTw9QkFTRX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdExlZnQ9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KS50b0pTTnVtYmVyKCk7aWYoIXNoaWZ0X2lzU21hbGwobikpe3Rocm93IG5ldyBFcnJvcihTdHJpbmcobikrIiBpcyB0b28gbGFyZ2UgZm9yIHNoaWZ0aW5nLiIpfWlmKG48MClyZXR1cm4gdGhpcy5zaGlmdFJpZ2h0KC1uKTt2YXIgcmVzdWx0PXRoaXM7aWYocmVzdWx0LmlzWmVybygpKXJldHVybiByZXN1bHQ7d2hpbGUobj49cG93ZXJzMkxlbmd0aCl7cmVzdWx0PXJlc3VsdC5tdWx0aXBseShoaWdoZXN0UG93ZXIyKTtuLT1wb3dlcnMyTGVuZ3RoLTF9cmV0dXJuIHJlc3VsdC5tdWx0aXBseShwb3dlcnNPZlR3b1tuXSl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc2hpZnRMZWZ0PVNtYWxsSW50ZWdlci5wcm90b3R5cGUuc2hpZnRMZWZ0PUJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0TGVmdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdFJpZ2h0PWZ1bmN0aW9uKHYpe3ZhciByZW1RdW87dmFyIG49cGFyc2VWYWx1ZSh2KS50b0pTTnVtYmVyKCk7aWYoIXNoaWZ0X2lzU21hbGwobikpe3Rocm93IG5ldyBFcnJvcihTdHJpbmcobikrIiBpcyB0b28gbGFyZ2UgZm9yIHNoaWZ0aW5nLiIpfWlmKG48MClyZXR1cm4gdGhpcy5zaGlmdExlZnQoLW4pO3ZhciByZXN1bHQ9dGhpczt3aGlsZShuPj1wb3dlcnMyTGVuZ3RoKXtpZihyZXN1bHQuaXNaZXJvKCl8fHJlc3VsdC5pc05lZ2F0aXZlKCkmJnJlc3VsdC5pc1VuaXQoKSlyZXR1cm4gcmVzdWx0O3JlbVF1bz1kaXZNb2RBbnkocmVzdWx0LGhpZ2hlc3RQb3dlcjIpO3Jlc3VsdD1yZW1RdW9bMV0uaXNOZWdhdGl2ZSgpP3JlbVF1b1swXS5wcmV2KCk6cmVtUXVvWzBdO24tPXBvd2VyczJMZW5ndGgtMX1yZW1RdW89ZGl2TW9kQW55KHJlc3VsdCxwb3dlcnNPZlR3b1tuXSk7cmV0dXJuIHJlbVF1b1sxXS5pc05lZ2F0aXZlKCk/cmVtUXVvWzBdLnByZXYoKTpyZW1RdW9bMF19O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc2hpZnRSaWdodD1TbWFsbEludGVnZXIucHJvdG90eXBlLnNoaWZ0UmlnaHQ9QmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRSaWdodDtmdW5jdGlvbiBiaXR3aXNlKHgseSxmbil7eT1wYXJzZVZhbHVlKHkpO3ZhciB4U2lnbj14LmlzTmVnYXRpdmUoKSx5U2lnbj15LmlzTmVnYXRpdmUoKTt2YXIgeFJlbT14U2lnbj94Lm5vdCgpOngseVJlbT15U2lnbj95Lm5vdCgpOnk7dmFyIHhEaWdpdD0wLHlEaWdpdD0wO3ZhciB4RGl2TW9kPW51bGwseURpdk1vZD1udWxsO3ZhciByZXN1bHQ9W107d2hpbGUoIXhSZW0uaXNaZXJvKCl8fCF5UmVtLmlzWmVybygpKXt4RGl2TW9kPWRpdk1vZEFueSh4UmVtLGhpZ2hlc3RQb3dlcjIpO3hEaWdpdD14RGl2TW9kWzFdLnRvSlNOdW1iZXIoKTtpZih4U2lnbil7eERpZ2l0PWhpZ2hlc3RQb3dlcjItMS14RGlnaXR9eURpdk1vZD1kaXZNb2RBbnkoeVJlbSxoaWdoZXN0UG93ZXIyKTt5RGlnaXQ9eURpdk1vZFsxXS50b0pTTnVtYmVyKCk7aWYoeVNpZ24pe3lEaWdpdD1oaWdoZXN0UG93ZXIyLTEteURpZ2l0fXhSZW09eERpdk1vZFswXTt5UmVtPXlEaXZNb2RbMF07cmVzdWx0LnB1c2goZm4oeERpZ2l0LHlEaWdpdCkpfXZhciBzdW09Zm4oeFNpZ24/MTowLHlTaWduPzE6MCkhPT0wP2JpZ0ludCgtMSk6YmlnSW50KDApO2Zvcih2YXIgaT1yZXN1bHQubGVuZ3RoLTE7aT49MDtpLT0xKXtzdW09c3VtLm11bHRpcGx5KGhpZ2hlc3RQb3dlcjIpLmFkZChiaWdJbnQocmVzdWx0W2ldKSl9cmV0dXJuIHN1bX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5ub3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uZWdhdGUoKS5wcmV2KCl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubm90PVNtYWxsSW50ZWdlci5wcm90b3R5cGUubm90PUJpZ0ludGVnZXIucHJvdG90eXBlLm5vdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQ9ZnVuY3Rpb24obil7cmV0dXJuIGJpdHdpc2UodGhpcyxuLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEmYn0pfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmFuZD1TbWFsbEludGVnZXIucHJvdG90eXBlLmFuZD1CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQ7QmlnSW50ZWdlci5wcm90b3R5cGUub3I9ZnVuY3Rpb24obil7cmV0dXJuIGJpdHdpc2UodGhpcyxuLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGF8Yn0pfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm9yPVNtYWxsSW50ZWdlci5wcm90b3R5cGUub3I9QmlnSW50ZWdlci5wcm90b3R5cGUub3I7QmlnSW50ZWdlci5wcm90b3R5cGUueG9yPWZ1bmN0aW9uKG4pe3JldHVybiBiaXR3aXNlKHRoaXMsbixmdW5jdGlvbihhLGIpe3JldHVybiBhXmJ9KX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS54b3I9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS54b3I9QmlnSW50ZWdlci5wcm90b3R5cGUueG9yO3ZhciBMT0JNQVNLX0k9MTw8MzAsTE9CTUFTS19CST0oQkFTRSYtQkFTRSkqKEJBU0UmLUJBU0UpfExPQk1BU0tfSTtmdW5jdGlvbiByb3VnaExPQihuKXt2YXIgdj1uLnZhbHVlLHg9dHlwZW9mIHY9PT0ibnVtYmVyIj92fExPQk1BU0tfSTp0eXBlb2Ygdj09PSJiaWdpbnQiP3Z8QmlnSW50KExPQk1BU0tfSSk6dlswXSt2WzFdKkJBU0V8TE9CTUFTS19CSTtyZXR1cm4geCYteH1mdW5jdGlvbiBpbnRlZ2VyTG9nYXJpdGhtKHZhbHVlLGJhc2Upe2lmKGJhc2UuY29tcGFyZVRvKHZhbHVlKTw9MCl7dmFyIHRtcD1pbnRlZ2VyTG9nYXJpdGhtKHZhbHVlLGJhc2Uuc3F1YXJlKGJhc2UpKTt2YXIgcD10bXAucDt2YXIgZT10bXAuZTt2YXIgdD1wLm11bHRpcGx5KGJhc2UpO3JldHVybiB0LmNvbXBhcmVUbyh2YWx1ZSk8PTA/e3A6dCxlOmUqMisxfTp7cDpwLGU6ZSoyfX1yZXR1cm57cDpiaWdJbnQoMSksZTowfX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGg9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO2lmKG4uY29tcGFyZVRvKGJpZ0ludCgwKSk8MCl7bj1uLm5lZ2F0ZSgpLnN1YnRyYWN0KGJpZ0ludCgxKSl9aWYobi5jb21wYXJlVG8oYmlnSW50KDApKT09PTApe3JldHVybiBiaWdJbnQoMCl9cmV0dXJuIGJpZ0ludChpbnRlZ2VyTG9nYXJpdGhtKG4sYmlnSW50KDIpKS5lKS5hZGQoYmlnSW50KDEpKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5iaXRMZW5ndGg9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGg9QmlnSW50ZWdlci5wcm90b3R5cGUuYml0TGVuZ3RoO2Z1bmN0aW9uIG1heChhLGIpe2E9cGFyc2VWYWx1ZShhKTtiPXBhcnNlVmFsdWUoYik7cmV0dXJuIGEuZ3JlYXRlcihiKT9hOmJ9ZnVuY3Rpb24gbWluKGEsYil7YT1wYXJzZVZhbHVlKGEpO2I9cGFyc2VWYWx1ZShiKTtyZXR1cm4gYS5sZXNzZXIoYik/YTpifWZ1bmN0aW9uIGdjZChhLGIpe2E9cGFyc2VWYWx1ZShhKS5hYnMoKTtiPXBhcnNlVmFsdWUoYikuYWJzKCk7aWYoYS5lcXVhbHMoYikpcmV0dXJuIGE7aWYoYS5pc1plcm8oKSlyZXR1cm4gYjtpZihiLmlzWmVybygpKXJldHVybiBhO3ZhciBjPUludGVnZXJbMV0sZCx0O3doaWxlKGEuaXNFdmVuKCkmJmIuaXNFdmVuKCkpe2Q9bWluKHJvdWdoTE9CKGEpLHJvdWdoTE9CKGIpKTthPWEuZGl2aWRlKGQpO2I9Yi5kaXZpZGUoZCk7Yz1jLm11bHRpcGx5KGQpfXdoaWxlKGEuaXNFdmVuKCkpe2E9YS5kaXZpZGUocm91Z2hMT0IoYSkpfWRve3doaWxlKGIuaXNFdmVuKCkpe2I9Yi5kaXZpZGUocm91Z2hMT0IoYikpfWlmKGEuZ3JlYXRlcihiKSl7dD1iO2I9YTthPXR9Yj1iLnN1YnRyYWN0KGEpfXdoaWxlKCFiLmlzWmVybygpKTtyZXR1cm4gYy5pc1VuaXQoKT9hOmEubXVsdGlwbHkoYyl9ZnVuY3Rpb24gbGNtKGEsYil7YT1wYXJzZVZhbHVlKGEpLmFicygpO2I9cGFyc2VWYWx1ZShiKS5hYnMoKTtyZXR1cm4gYS5kaXZpZGUoZ2NkKGEsYikpLm11bHRpcGx5KGIpfWZ1bmN0aW9uIHJhbmRCZXR3ZWVuKGEsYil7YT1wYXJzZVZhbHVlKGEpO2I9cGFyc2VWYWx1ZShiKTt2YXIgbG93PW1pbihhLGIpLGhpZ2g9bWF4KGEsYik7dmFyIHJhbmdlPWhpZ2guc3VidHJhY3QobG93KS5hZGQoMSk7aWYocmFuZ2UuaXNTbWFsbClyZXR1cm4gbG93LmFkZChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqcmFuZ2UpKTt2YXIgZGlnaXRzPXRvQmFzZShyYW5nZSxCQVNFKS52YWx1ZTt2YXIgcmVzdWx0PVtdLHJlc3RyaWN0ZWQ9dHJ1ZTtmb3IodmFyIGk9MDtpPGRpZ2l0cy5sZW5ndGg7aSsrKXt2YXIgdG9wPXJlc3RyaWN0ZWQ/ZGlnaXRzW2ldOkJBU0U7dmFyIGRpZ2l0PXRydW5jYXRlKE1hdGgucmFuZG9tKCkqdG9wKTtyZXN1bHQucHVzaChkaWdpdCk7aWYoZGlnaXQ8dG9wKXJlc3RyaWN0ZWQ9ZmFsc2V9cmV0dXJuIGxvdy5hZGQoSW50ZWdlci5mcm9tQXJyYXkocmVzdWx0LEJBU0UsZmFsc2UpKX12YXIgcGFyc2VCYXNlPWZ1bmN0aW9uKHRleHQsYmFzZSxhbHBoYWJldCxjYXNlU2Vuc2l0aXZlKXthbHBoYWJldD1hbHBoYWJldHx8REVGQVVMVF9BTFBIQUJFVDt0ZXh0PVN0cmluZyh0ZXh0KTtpZighY2FzZVNlbnNpdGl2ZSl7dGV4dD10ZXh0LnRvTG93ZXJDYXNlKCk7YWxwaGFiZXQ9YWxwaGFiZXQudG9Mb3dlckNhc2UoKX12YXIgbGVuZ3RoPXRleHQubGVuZ3RoO3ZhciBpO3ZhciBhYnNCYXNlPU1hdGguYWJzKGJhc2UpO3ZhciBhbHBoYWJldFZhbHVlcz17fTtmb3IoaT0wO2k8YWxwaGFiZXQubGVuZ3RoO2krKyl7YWxwaGFiZXRWYWx1ZXNbYWxwaGFiZXRbaV1dPWl9Zm9yKGk9MDtpPGxlbmd0aDtpKyspe3ZhciBjPXRleHRbaV07aWYoYz09PSItIiljb250aW51ZTtpZihjIGluIGFscGhhYmV0VmFsdWVzKXtpZihhbHBoYWJldFZhbHVlc1tjXT49YWJzQmFzZSl7aWYoYz09PSIxIiYmYWJzQmFzZT09PTEpY29udGludWU7dGhyb3cgbmV3IEVycm9yKGMrIiBpcyBub3QgYSB2YWxpZCBkaWdpdCBpbiBiYXNlICIrYmFzZSsiLiIpfX19YmFzZT1wYXJzZVZhbHVlKGJhc2UpO3ZhciBkaWdpdHM9W107dmFyIGlzTmVnYXRpdmU9dGV4dFswXT09PSItIjtmb3IoaT1pc05lZ2F0aXZlPzE6MDtpPHRleHQubGVuZ3RoO2krKyl7dmFyIGM9dGV4dFtpXTtpZihjIGluIGFscGhhYmV0VmFsdWVzKWRpZ2l0cy5wdXNoKHBhcnNlVmFsdWUoYWxwaGFiZXRWYWx1ZXNbY10pKTtlbHNlIGlmKGM9PT0iPCIpe3ZhciBzdGFydD1pO2Rve2krK313aGlsZSh0ZXh0W2ldIT09Ij4iJiZpPHRleHQubGVuZ3RoKTtkaWdpdHMucHVzaChwYXJzZVZhbHVlKHRleHQuc2xpY2Uoc3RhcnQrMSxpKSkpfWVsc2UgdGhyb3cgbmV3IEVycm9yKGMrIiBpcyBub3QgYSB2YWxpZCBjaGFyYWN0ZXIiKX1yZXR1cm4gcGFyc2VCYXNlRnJvbUFycmF5KGRpZ2l0cyxiYXNlLGlzTmVnYXRpdmUpfTtmdW5jdGlvbiBwYXJzZUJhc2VGcm9tQXJyYXkoZGlnaXRzLGJhc2UsaXNOZWdhdGl2ZSl7dmFyIHZhbD1JbnRlZ2VyWzBdLHBvdz1JbnRlZ2VyWzFdLGk7Zm9yKGk9ZGlnaXRzLmxlbmd0aC0xO2k+PTA7aS0tKXt2YWw9dmFsLmFkZChkaWdpdHNbaV0udGltZXMocG93KSk7cG93PXBvdy50aW1lcyhiYXNlKX1yZXR1cm4gaXNOZWdhdGl2ZT92YWwubmVnYXRlKCk6dmFsfWZ1bmN0aW9uIHN0cmluZ2lmeShkaWdpdCxhbHBoYWJldCl7YWxwaGFiZXQ9YWxwaGFiZXR8fERFRkFVTFRfQUxQSEFCRVQ7aWYoZGlnaXQ8YWxwaGFiZXQubGVuZ3RoKXtyZXR1cm4gYWxwaGFiZXRbZGlnaXRdfXJldHVybiI8IitkaWdpdCsiPiJ9ZnVuY3Rpb24gdG9CYXNlKG4sYmFzZSl7YmFzZT1iaWdJbnQoYmFzZSk7aWYoYmFzZS5pc1plcm8oKSl7aWYobi5pc1plcm8oKSlyZXR1cm57dmFsdWU6WzBdLGlzTmVnYXRpdmU6ZmFsc2V9O3Rocm93IG5ldyBFcnJvcigiQ2Fubm90IGNvbnZlcnQgbm9uemVybyBudW1iZXJzIHRvIGJhc2UgMC4iKX1pZihiYXNlLmVxdWFscygtMSkpe2lmKG4uaXNaZXJvKCkpcmV0dXJue3ZhbHVlOlswXSxpc05lZ2F0aXZlOmZhbHNlfTtpZihuLmlzTmVnYXRpdmUoKSlyZXR1cm57dmFsdWU6W10uY29uY2F0LmFwcGx5KFtdLEFycmF5LmFwcGx5KG51bGwsQXJyYXkoLW4udG9KU051bWJlcigpKSkubWFwKEFycmF5LnByb3RvdHlwZS52YWx1ZU9mLFsxLDBdKSksaXNOZWdhdGl2ZTpmYWxzZX07dmFyIGFycj1BcnJheS5hcHBseShudWxsLEFycmF5KG4udG9KU051bWJlcigpLTEpKS5tYXAoQXJyYXkucHJvdG90eXBlLnZhbHVlT2YsWzAsMV0pO2Fyci51bnNoaWZ0KFsxXSk7cmV0dXJue3ZhbHVlOltdLmNvbmNhdC5hcHBseShbXSxhcnIpLGlzTmVnYXRpdmU6ZmFsc2V9fXZhciBuZWc9ZmFsc2U7aWYobi5pc05lZ2F0aXZlKCkmJmJhc2UuaXNQb3NpdGl2ZSgpKXtuZWc9dHJ1ZTtuPW4uYWJzKCl9aWYoYmFzZS5pc1VuaXQoKSl7aWYobi5pc1plcm8oKSlyZXR1cm57dmFsdWU6WzBdLGlzTmVnYXRpdmU6ZmFsc2V9O3JldHVybnt2YWx1ZTpBcnJheS5hcHBseShudWxsLEFycmF5KG4udG9KU051bWJlcigpKSkubWFwKE51bWJlci5wcm90b3R5cGUudmFsdWVPZiwxKSxpc05lZ2F0aXZlOm5lZ319dmFyIG91dD1bXTt2YXIgbGVmdD1uLGRpdm1vZDt3aGlsZShsZWZ0LmlzTmVnYXRpdmUoKXx8bGVmdC5jb21wYXJlQWJzKGJhc2UpPj0wKXtkaXZtb2Q9bGVmdC5kaXZtb2QoYmFzZSk7bGVmdD1kaXZtb2QucXVvdGllbnQ7dmFyIGRpZ2l0PWRpdm1vZC5yZW1haW5kZXI7aWYoZGlnaXQuaXNOZWdhdGl2ZSgpKXtkaWdpdD1iYXNlLm1pbnVzKGRpZ2l0KS5hYnMoKTtsZWZ0PWxlZnQubmV4dCgpfW91dC5wdXNoKGRpZ2l0LnRvSlNOdW1iZXIoKSl9b3V0LnB1c2gobGVmdC50b0pTTnVtYmVyKCkpO3JldHVybnt2YWx1ZTpvdXQucmV2ZXJzZSgpLGlzTmVnYXRpdmU6bmVnfX1mdW5jdGlvbiB0b0Jhc2VTdHJpbmcobixiYXNlLGFscGhhYmV0KXt2YXIgYXJyPXRvQmFzZShuLGJhc2UpO3JldHVybihhcnIuaXNOZWdhdGl2ZT8iLSI6IiIpK2Fyci52YWx1ZS5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHN0cmluZ2lmeSh4LGFscGhhYmV0KX0pLmpvaW4oIiIpfUJpZ0ludGVnZXIucHJvdG90eXBlLnRvQXJyYXk9ZnVuY3Rpb24ocmFkaXgpe3JldHVybiB0b0Jhc2UodGhpcyxyYWRpeCl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUudG9BcnJheT1mdW5jdGlvbihyYWRpeCl7cmV0dXJuIHRvQmFzZSh0aGlzLHJhZGl4KX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS50b0FycmF5PWZ1bmN0aW9uKHJhZGl4KXtyZXR1cm4gdG9CYXNlKHRoaXMscmFkaXgpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbihyYWRpeCxhbHBoYWJldCl7aWYocmFkaXg9PT11bmRlZmluZWQpcmFkaXg9MTA7aWYocmFkaXghPT0xMClyZXR1cm4gdG9CYXNlU3RyaW5nKHRoaXMscmFkaXgsYWxwaGFiZXQpO3ZhciB2PXRoaXMudmFsdWUsbD12Lmxlbmd0aCxzdHI9U3RyaW5nKHZbLS1sXSksemVyb3M9IjAwMDAwMDAiLGRpZ2l0O3doaWxlKC0tbD49MCl7ZGlnaXQ9U3RyaW5nKHZbbF0pO3N0cis9emVyb3Muc2xpY2UoZGlnaXQubGVuZ3RoKStkaWdpdH12YXIgc2lnbj10aGlzLnNpZ24/Ii0iOiIiO3JldHVybiBzaWduK3N0cn07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbihyYWRpeCxhbHBoYWJldCl7aWYocmFkaXg9PT11bmRlZmluZWQpcmFkaXg9MTA7aWYocmFkaXghPTEwKXJldHVybiB0b0Jhc2VTdHJpbmcodGhpcyxyYWRpeCxhbHBoYWJldCk7cmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS50b1N0cmluZz1TbWFsbEludGVnZXIucHJvdG90eXBlLnRvU3RyaW5nO05hdGl2ZUJpZ0ludC5wcm90b3R5cGUudG9KU09OPUJpZ0ludGVnZXIucHJvdG90eXBlLnRvSlNPTj1TbWFsbEludGVnZXIucHJvdG90eXBlLnRvSlNPTj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRvU3RyaW5nKCl9O0JpZ0ludGVnZXIucHJvdG90eXBlLnZhbHVlT2Y9ZnVuY3Rpb24oKXtyZXR1cm4gcGFyc2VJbnQodGhpcy50b1N0cmluZygpLDEwKX07QmlnSW50ZWdlci5wcm90b3R5cGUudG9KU051bWJlcj1CaWdJbnRlZ2VyLnByb3RvdHlwZS52YWx1ZU9mO1NtYWxsSW50ZWdlci5wcm90b3R5cGUudmFsdWVPZj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZhbHVlfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnRvSlNOdW1iZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS52YWx1ZU9mO05hdGl2ZUJpZ0ludC5wcm90b3R5cGUudmFsdWVPZj1OYXRpdmVCaWdJbnQucHJvdG90eXBlLnRvSlNOdW1iZXI9ZnVuY3Rpb24oKXtyZXR1cm4gcGFyc2VJbnQodGhpcy50b1N0cmluZygpLDEwKX07ZnVuY3Rpb24gcGFyc2VTdHJpbmdWYWx1ZSh2KXtpZihpc1ByZWNpc2UoK3YpKXt2YXIgeD0rdjtpZih4PT09dHJ1bmNhdGUoeCkpcmV0dXJuIHN1cHBvcnRzTmF0aXZlQmlnSW50P25ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHgpKTpuZXcgU21hbGxJbnRlZ2VyKHgpO3Rocm93IG5ldyBFcnJvcigiSW52YWxpZCBpbnRlZ2VyOiAiK3YpfXZhciBzaWduPXZbMF09PT0iLSI7aWYoc2lnbil2PXYuc2xpY2UoMSk7dmFyIHNwbGl0PXYuc3BsaXQoL2UvaSk7aWYoc3BsaXQubGVuZ3RoPjIpdGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIGludGVnZXI6ICIrc3BsaXQuam9pbigiZSIpKTtpZihzcGxpdC5sZW5ndGg9PT0yKXt2YXIgZXhwPXNwbGl0WzFdO2lmKGV4cFswXT09PSIrIilleHA9ZXhwLnNsaWNlKDEpO2V4cD0rZXhwO2lmKGV4cCE9PXRydW5jYXRlKGV4cCl8fCFpc1ByZWNpc2UoZXhwKSl0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgaW50ZWdlcjogIitleHArIiBpcyBub3QgYSB2YWxpZCBleHBvbmVudC4iKTt2YXIgdGV4dD1zcGxpdFswXTt2YXIgZGVjaW1hbFBsYWNlPXRleHQuaW5kZXhPZigiLiIpO2lmKGRlY2ltYWxQbGFjZT49MCl7ZXhwLT10ZXh0Lmxlbmd0aC1kZWNpbWFsUGxhY2UtMTt0ZXh0PXRleHQuc2xpY2UoMCxkZWNpbWFsUGxhY2UpK3RleHQuc2xpY2UoZGVjaW1hbFBsYWNlKzEpfWlmKGV4cDwwKXRocm93IG5ldyBFcnJvcigiQ2Fubm90IGluY2x1ZGUgbmVnYXRpdmUgZXhwb25lbnQgcGFydCBmb3IgaW50ZWdlcnMiKTt0ZXh0Kz1uZXcgQXJyYXkoZXhwKzEpLmpvaW4oIjAiKTt2PXRleHR9dmFyIGlzVmFsaWQ9L14oWzAtOV1bMC05XSopJC8udGVzdCh2KTtpZighaXNWYWxpZCl0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgaW50ZWdlcjogIit2KTtpZihzdXBwb3J0c05hdGl2ZUJpZ0ludCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHNpZ24/Ii0iK3Y6dikpfXZhciByPVtdLG1heD12Lmxlbmd0aCxsPUxPR19CQVNFLG1pbj1tYXgtbDt3aGlsZShtYXg+MCl7ci5wdXNoKCt2LnNsaWNlKG1pbixtYXgpKTttaW4tPWw7aWYobWluPDApbWluPTA7bWF4LT1sfXRyaW0ocik7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHIsc2lnbil9ZnVuY3Rpb24gcGFyc2VOdW1iZXJWYWx1ZSh2KXtpZihzdXBwb3J0c05hdGl2ZUJpZ0ludCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHYpKX1pZihpc1ByZWNpc2Uodikpe2lmKHYhPT10cnVuY2F0ZSh2KSl0aHJvdyBuZXcgRXJyb3IodisiIGlzIG5vdCBhbiBpbnRlZ2VyLiIpO3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKHYpfXJldHVybiBwYXJzZVN0cmluZ1ZhbHVlKHYudG9TdHJpbmcoKSl9ZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KXtpZih0eXBlb2Ygdj09PSJudW1iZXIiKXtyZXR1cm4gcGFyc2VOdW1iZXJWYWx1ZSh2KX1pZih0eXBlb2Ygdj09PSJzdHJpbmciKXtyZXR1cm4gcGFyc2VTdHJpbmdWYWx1ZSh2KX1pZih0eXBlb2Ygdj09PSJiaWdpbnQiKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh2KX1yZXR1cm4gdn1mb3IodmFyIGk9MDtpPDFlMztpKyspe0ludGVnZXJbaV09cGFyc2VWYWx1ZShpKTtpZihpPjApSW50ZWdlclstaV09cGFyc2VWYWx1ZSgtaSl9SW50ZWdlci5vbmU9SW50ZWdlclsxXTtJbnRlZ2VyLnplcm89SW50ZWdlclswXTtJbnRlZ2VyLm1pbnVzT25lPUludGVnZXJbLTFdO0ludGVnZXIubWF4PW1heDtJbnRlZ2VyLm1pbj1taW47SW50ZWdlci5nY2Q9Z2NkO0ludGVnZXIubGNtPWxjbTtJbnRlZ2VyLmlzSW5zdGFuY2U9ZnVuY3Rpb24oeCl7cmV0dXJuIHggaW5zdGFuY2VvZiBCaWdJbnRlZ2VyfHx4IGluc3RhbmNlb2YgU21hbGxJbnRlZ2VyfHx4IGluc3RhbmNlb2YgTmF0aXZlQmlnSW50fTtJbnRlZ2VyLnJhbmRCZXR3ZWVuPXJhbmRCZXR3ZWVuO0ludGVnZXIuZnJvbUFycmF5PWZ1bmN0aW9uKGRpZ2l0cyxiYXNlLGlzTmVnYXRpdmUpe3JldHVybiBwYXJzZUJhc2VGcm9tQXJyYXkoZGlnaXRzLm1hcChwYXJzZVZhbHVlKSxwYXJzZVZhbHVlKGJhc2V8fDEwKSxpc05lZ2F0aXZlKX07cmV0dXJuIEludGVnZXJ9KCk7aWYodHlwZW9mIG1vZHVsZSE9PSJ1bmRlZmluZWQiJiZtb2R1bGUuaGFzT3duUHJvcGVydHkoImV4cG9ydHMiKSl7bW9kdWxlLmV4cG9ydHM9YmlnSW50fWlmKHR5cGVvZiBkZWZpbmU9PT0iZnVuY3Rpb24iJiZkZWZpbmUuYW1kKXtkZWZpbmUoImJpZy1pbnRlZ2VyIixbXSxmdW5jdGlvbigpe3JldHVybiBiaWdJbnR9KX19LHt9XSwyNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7fSx7fV0sMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpeyJ1c2Ugc3RyaWN0Ijt2YXIgYmFzZTY0PXJlcXVpcmUoImJhc2U2NC1qcyIpO3ZhciBpZWVlNzU0PXJlcXVpcmUoImllZWU3NTQiKTtleHBvcnRzLkJ1ZmZlcj1CdWZmZXI7ZXhwb3J0cy5TbG93QnVmZmVyPVNsb3dCdWZmZXI7ZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUz01MDt2YXIgS19NQVhfTEVOR1RIPTIxNDc0ODM2NDc7ZXhwb3J0cy5rTWF4TGVuZ3RoPUtfTUFYX0xFTkdUSDtCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVD10eXBlZEFycmF5U3VwcG9ydCgpO2lmKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCYmdHlwZW9mIGNvbnNvbGUhPT0idW5kZWZpbmVkIiYmdHlwZW9mIGNvbnNvbGUuZXJyb3I9PT0iZnVuY3Rpb24iKXtjb25zb2xlLmVycm9yKCJUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgIisiYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4iKX1mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCgpe3RyeXt2YXIgYXJyPW5ldyBVaW50OEFycmF5KDEpO2Fyci5fX3Byb3RvX189e19fcHJvdG9fXzpVaW50OEFycmF5LnByb3RvdHlwZSxmb286ZnVuY3Rpb24oKXtyZXR1cm4gNDJ9fTtyZXR1cm4gYXJyLmZvbygpPT09NDJ9Y2F0Y2goZSl7cmV0dXJuIGZhbHNlfX1PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwicGFyZW50Iix7ZW51bWVyYWJsZTp0cnVlLGdldDpmdW5jdGlvbigpe2lmKCFCdWZmZXIuaXNCdWZmZXIodGhpcykpcmV0dXJuIHVuZGVmaW5lZDtyZXR1cm4gdGhpcy5idWZmZXJ9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsIm9mZnNldCIse2VudW1lcmFibGU6dHJ1ZSxnZXQ6ZnVuY3Rpb24oKXtpZighQnVmZmVyLmlzQnVmZmVyKHRoaXMpKXJldHVybiB1bmRlZmluZWQ7cmV0dXJuIHRoaXMuYnl0ZU9mZnNldH19KTtmdW5jdGlvbiBjcmVhdGVCdWZmZXIobGVuZ3RoKXtpZihsZW5ndGg+S19NQVhfTEVOR1RIKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlICInK2xlbmd0aCsnIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gInNpemUiJyl9dmFyIGJ1Zj1uZXcgVWludDhBcnJheShsZW5ndGgpO2J1Zi5fX3Byb3RvX189QnVmZmVyLnByb3RvdHlwZTtyZXR1cm4gYnVmfWZ1bmN0aW9uIEJ1ZmZlcihhcmcsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpe2lmKHR5cGVvZiBhcmc9PT0ibnVtYmVyIil7aWYodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQ9PT0ic3RyaW5nIil7dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlICJzdHJpbmciIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuIFJlY2VpdmVkIHR5cGUgbnVtYmVyJyl9cmV0dXJuIGFsbG9jVW5zYWZlKGFyZyl9cmV0dXJuIGZyb20oYXJnLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX1pZih0eXBlb2YgU3ltYm9sIT09InVuZGVmaW5lZCImJlN5bWJvbC5zcGVjaWVzIT1udWxsJiZCdWZmZXJbU3ltYm9sLnNwZWNpZXNdPT09QnVmZmVyKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLFN5bWJvbC5zcGVjaWVzLHt2YWx1ZTpudWxsLGNvbmZpZ3VyYWJsZTp0cnVlLGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6ZmFsc2V9KX1CdWZmZXIucG9vbFNpemU9ODE5MjtmdW5jdGlvbiBmcm9tKHZhbHVlLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtpZih0eXBlb2YgdmFsdWU9PT0ic3RyaW5nIil7cmV0dXJuIGZyb21TdHJpbmcodmFsdWUsZW5jb2RpbmdPck9mZnNldCl9aWYoQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSl7cmV0dXJuIGZyb21BcnJheUxpa2UodmFsdWUpfWlmKHZhbHVlPT1udWxsKXt0aHJvdyBUeXBlRXJyb3IoIlRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICIrIm9yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICIrdHlwZW9mIHZhbHVlKX1pZihpc0luc3RhbmNlKHZhbHVlLEFycmF5QnVmZmVyKXx8dmFsdWUmJmlzSW5zdGFuY2UodmFsdWUuYnVmZmVyLEFycmF5QnVmZmVyKSl7cmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9aWYodHlwZW9mIHZhbHVlPT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSAidmFsdWUiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlIG51bWJlcicpfXZhciB2YWx1ZU9mPXZhbHVlLnZhbHVlT2YmJnZhbHVlLnZhbHVlT2YoKTtpZih2YWx1ZU9mIT1udWxsJiZ2YWx1ZU9mIT09dmFsdWUpe3JldHVybiBCdWZmZXIuZnJvbSh2YWx1ZU9mLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX12YXIgYj1mcm9tT2JqZWN0KHZhbHVlKTtpZihiKXJldHVybiBiO2lmKHR5cGVvZiBTeW1ib2whPT0idW5kZWZpbmVkIiYmU3ltYm9sLnRvUHJpbWl0aXZlIT1udWxsJiZ0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXT09PSJmdW5jdGlvbiIpe3JldHVybiBCdWZmZXIuZnJvbSh2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdKCJzdHJpbmciKSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9dGhyb3cgbmV3IFR5cGVFcnJvcigiVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgIisib3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgIit0eXBlb2YgdmFsdWUpfUJ1ZmZlci5mcm9tPWZ1bmN0aW9uKHZhbHVlLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtyZXR1cm4gZnJvbSh2YWx1ZSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9O0J1ZmZlci5wcm90b3R5cGUuX19wcm90b19fPVVpbnQ4QXJyYXkucHJvdG90eXBlO0J1ZmZlci5fX3Byb3RvX189VWludDhBcnJheTtmdW5jdGlvbiBhc3NlcnRTaXplKHNpemUpe2lmKHR5cGVvZiBzaXplIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJzaXplIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJyl9ZWxzZSBpZihzaXplPDApe3Rocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgIicrc2l6ZSsnIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gInNpemUiJyl9fWZ1bmN0aW9uIGFsbG9jKHNpemUsZmlsbCxlbmNvZGluZyl7YXNzZXJ0U2l6ZShzaXplKTtpZihzaXplPD0wKXtyZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpfWlmKGZpbGwhPT11bmRlZmluZWQpe3JldHVybiB0eXBlb2YgZW5jb2Rpbmc9PT0ic3RyaW5nIj9jcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLGVuY29kaW5nKTpjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsKX1yZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpfUJ1ZmZlci5hbGxvYz1mdW5jdGlvbihzaXplLGZpbGwsZW5jb2Rpbmcpe3JldHVybiBhbGxvYyhzaXplLGZpbGwsZW5jb2RpbmcpfTtmdW5jdGlvbiBhbGxvY1Vuc2FmZShzaXplKXthc3NlcnRTaXplKHNpemUpO3JldHVybiBjcmVhdGVCdWZmZXIoc2l6ZTwwPzA6Y2hlY2tlZChzaXplKXwwKX1CdWZmZXIuYWxsb2NVbnNhZmU9ZnVuY3Rpb24oc2l6ZSl7cmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpfTtCdWZmZXIuYWxsb2NVbnNhZmVTbG93PWZ1bmN0aW9uKHNpemUpe3JldHVybiBhbGxvY1Vuc2FmZShzaXplKX07ZnVuY3Rpb24gZnJvbVN0cmluZyhzdHJpbmcsZW5jb2Rpbmcpe2lmKHR5cGVvZiBlbmNvZGluZyE9PSJzdHJpbmcifHxlbmNvZGluZz09PSIiKXtlbmNvZGluZz0idXRmOCJ9aWYoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSl7dGhyb3cgbmV3IFR5cGVFcnJvcigiVW5rbm93biBlbmNvZGluZzogIitlbmNvZGluZyl9dmFyIGxlbmd0aD1ieXRlTGVuZ3RoKHN0cmluZyxlbmNvZGluZyl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW5ndGgpO3ZhciBhY3R1YWw9YnVmLndyaXRlKHN0cmluZyxlbmNvZGluZyk7aWYoYWN0dWFsIT09bGVuZ3RoKXtidWY9YnVmLnNsaWNlKDAsYWN0dWFsKX1yZXR1cm4gYnVmfWZ1bmN0aW9uIGZyb21BcnJheUxpa2UoYXJyYXkpe3ZhciBsZW5ndGg9YXJyYXkubGVuZ3RoPDA/MDpjaGVja2VkKGFycmF5Lmxlbmd0aCl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW5ndGgpO2Zvcih2YXIgaT0wO2k8bGVuZ3RoO2krPTEpe2J1ZltpXT1hcnJheVtpXSYyNTV9cmV0dXJuIGJ1Zn1mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIoYXJyYXksYnl0ZU9mZnNldCxsZW5ndGgpe2lmKGJ5dGVPZmZzZXQ8MHx8YXJyYXkuYnl0ZUxlbmd0aDxieXRlT2Zmc2V0KXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignIm9mZnNldCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJyl9aWYoYXJyYXkuYnl0ZUxlbmd0aDxieXRlT2Zmc2V0KyhsZW5ndGh8fDApKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignImxlbmd0aCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJyl9dmFyIGJ1ZjtpZihieXRlT2Zmc2V0PT09dW5kZWZpbmVkJiZsZW5ndGg9PT11bmRlZmluZWQpe2J1Zj1uZXcgVWludDhBcnJheShhcnJheSl9ZWxzZSBpZihsZW5ndGg9PT11bmRlZmluZWQpe2J1Zj1uZXcgVWludDhBcnJheShhcnJheSxieXRlT2Zmc2V0KX1lbHNle2J1Zj1uZXcgVWludDhBcnJheShhcnJheSxieXRlT2Zmc2V0LGxlbmd0aCl9YnVmLl9fcHJvdG9fXz1CdWZmZXIucHJvdG90eXBlO3JldHVybiBidWZ9ZnVuY3Rpb24gZnJvbU9iamVjdChvYmope2lmKEJ1ZmZlci5pc0J1ZmZlcihvYmopKXt2YXIgbGVuPWNoZWNrZWQob2JqLmxlbmd0aCl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW4pO2lmKGJ1Zi5sZW5ndGg9PT0wKXtyZXR1cm4gYnVmfW9iai5jb3B5KGJ1ZiwwLDAsbGVuKTtyZXR1cm4gYnVmfWlmKG9iai5sZW5ndGghPT11bmRlZmluZWQpe2lmKHR5cGVvZiBvYmoubGVuZ3RoIT09Im51bWJlciJ8fG51bWJlcklzTmFOKG9iai5sZW5ndGgpKXtyZXR1cm4gY3JlYXRlQnVmZmVyKDApfXJldHVybiBmcm9tQXJyYXlMaWtlKG9iail9aWYob2JqLnR5cGU9PT0iQnVmZmVyIiYmQXJyYXkuaXNBcnJheShvYmouZGF0YSkpe3JldHVybiBmcm9tQXJyYXlMaWtlKG9iai5kYXRhKX19ZnVuY3Rpb24gY2hlY2tlZChsZW5ndGgpe2lmKGxlbmd0aD49S19NQVhfTEVOR1RIKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcigiQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAiKyJzaXplOiAweCIrS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSsiIGJ5dGVzIil9cmV0dXJuIGxlbmd0aHwwfWZ1bmN0aW9uIFNsb3dCdWZmZXIobGVuZ3RoKXtpZigrbGVuZ3RoIT1sZW5ndGgpe2xlbmd0aD0wfXJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aCl9QnVmZmVyLmlzQnVmZmVyPWZ1bmN0aW9uIGlzQnVmZmVyKGIpe3JldHVybiBiIT1udWxsJiZiLl9pc0J1ZmZlcj09PXRydWUmJmIhPT1CdWZmZXIucHJvdG90eXBlfTtCdWZmZXIuY29tcGFyZT1mdW5jdGlvbiBjb21wYXJlKGEsYil7aWYoaXNJbnN0YW5jZShhLFVpbnQ4QXJyYXkpKWE9QnVmZmVyLmZyb20oYSxhLm9mZnNldCxhLmJ5dGVMZW5ndGgpO2lmKGlzSW5zdGFuY2UoYixVaW50OEFycmF5KSliPUJ1ZmZlci5mcm9tKGIsYi5vZmZzZXQsYi5ieXRlTGVuZ3RoKTtpZighQnVmZmVyLmlzQnVmZmVyKGEpfHwhQnVmZmVyLmlzQnVmZmVyKGIpKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgImJ1ZjEiLCAiYnVmMiIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknKX1pZihhPT09YilyZXR1cm4gMDt2YXIgeD1hLmxlbmd0aDt2YXIgeT1iLmxlbmd0aDtmb3IodmFyIGk9MCxsZW49TWF0aC5taW4oeCx5KTtpPGxlbjsrK2kpe2lmKGFbaV0hPT1iW2ldKXt4PWFbaV07eT1iW2ldO2JyZWFrfX1pZih4PHkpcmV0dXJuLTE7aWYoeTx4KXJldHVybiAxO3JldHVybiAwfTtCdWZmZXIuaXNFbmNvZGluZz1mdW5jdGlvbiBpc0VuY29kaW5nKGVuY29kaW5nKXtzd2l0Y2goU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKXtjYXNlImhleCI6Y2FzZSJ1dGY4IjpjYXNlInV0Zi04IjpjYXNlImFzY2lpIjpjYXNlImxhdGluMSI6Y2FzZSJiaW5hcnkiOmNhc2UiYmFzZTY0IjpjYXNlInVjczIiOmNhc2UidWNzLTIiOmNhc2UidXRmMTZsZSI6Y2FzZSJ1dGYtMTZsZSI6cmV0dXJuIHRydWU7ZGVmYXVsdDpyZXR1cm4gZmFsc2V9fTtCdWZmZXIuY29uY2F0PWZ1bmN0aW9uIGNvbmNhdChsaXN0LGxlbmd0aCl7aWYoIUFycmF5LmlzQXJyYXkobGlzdCkpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJsaXN0IiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKX1pZihsaXN0Lmxlbmd0aD09PTApe3JldHVybiBCdWZmZXIuYWxsb2MoMCl9dmFyIGk7aWYobGVuZ3RoPT09dW5kZWZpbmVkKXtsZW5ndGg9MDtmb3IoaT0wO2k8bGlzdC5sZW5ndGg7KytpKXtsZW5ndGgrPWxpc3RbaV0ubGVuZ3RofX12YXIgYnVmZmVyPUJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpO3ZhciBwb3M9MDtmb3IoaT0wO2k8bGlzdC5sZW5ndGg7KytpKXt2YXIgYnVmPWxpc3RbaV07aWYoaXNJbnN0YW5jZShidWYsVWludDhBcnJheSkpe2J1Zj1CdWZmZXIuZnJvbShidWYpfWlmKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSl7dGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3QiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpfWJ1Zi5jb3B5KGJ1ZmZlcixwb3MpO3Bvcys9YnVmLmxlbmd0aH1yZXR1cm4gYnVmZmVyfTtmdW5jdGlvbiBieXRlTGVuZ3RoKHN0cmluZyxlbmNvZGluZyl7aWYoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpe3JldHVybiBzdHJpbmcubGVuZ3RofWlmKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpfHxpc0luc3RhbmNlKHN0cmluZyxBcnJheUJ1ZmZlcikpe3JldHVybiBzdHJpbmcuYnl0ZUxlbmd0aH1pZih0eXBlb2Ygc3RyaW5nIT09InN0cmluZyIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSAic3RyaW5nIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBvciBBcnJheUJ1ZmZlci4gJysiUmVjZWl2ZWQgdHlwZSAiK3R5cGVvZiBzdHJpbmcpfXZhciBsZW49c3RyaW5nLmxlbmd0aDt2YXIgbXVzdE1hdGNoPWFyZ3VtZW50cy5sZW5ndGg+MiYmYXJndW1lbnRzWzJdPT09dHJ1ZTtpZighbXVzdE1hdGNoJiZsZW49PT0wKXJldHVybiAwO3ZhciBsb3dlcmVkQ2FzZT1mYWxzZTtmb3IoOzspe3N3aXRjaChlbmNvZGluZyl7Y2FzZSJhc2NpaSI6Y2FzZSJsYXRpbjEiOmNhc2UiYmluYXJ5IjpyZXR1cm4gbGVuO2Nhc2UidXRmOCI6Y2FzZSJ1dGYtOCI6cmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoO2Nhc2UidWNzMiI6Y2FzZSJ1Y3MtMiI6Y2FzZSJ1dGYxNmxlIjpjYXNlInV0Zi0xNmxlIjpyZXR1cm4gbGVuKjI7Y2FzZSJoZXgiOnJldHVybiBsZW4+Pj4xO2Nhc2UiYmFzZTY0IjpyZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aDtkZWZhdWx0OmlmKGxvd2VyZWRDYXNlKXtyZXR1cm4gbXVzdE1hdGNoPy0xOnV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RofWVuY29kaW5nPSgiIitlbmNvZGluZykudG9Mb3dlckNhc2UoKTtsb3dlcmVkQ2FzZT10cnVlfX19QnVmZmVyLmJ5dGVMZW5ndGg9Ynl0ZUxlbmd0aDtmdW5jdGlvbiBzbG93VG9TdHJpbmcoZW5jb2Rpbmcsc3RhcnQsZW5kKXt2YXIgbG93ZXJlZENhc2U9ZmFsc2U7aWYoc3RhcnQ9PT11bmRlZmluZWR8fHN0YXJ0PDApe3N0YXJ0PTB9aWYoc3RhcnQ+dGhpcy5sZW5ndGgpe3JldHVybiIifWlmKGVuZD09PXVuZGVmaW5lZHx8ZW5kPnRoaXMubGVuZ3RoKXtlbmQ9dGhpcy5sZW5ndGh9aWYoZW5kPD0wKXtyZXR1cm4iIn1lbmQ+Pj49MDtzdGFydD4+Pj0wO2lmKGVuZDw9c3RhcnQpe3JldHVybiIifWlmKCFlbmNvZGluZyllbmNvZGluZz0idXRmOCI7d2hpbGUodHJ1ZSl7c3dpdGNoKGVuY29kaW5nKXtjYXNlImhleCI6cmV0dXJuIGhleFNsaWNlKHRoaXMsc3RhcnQsZW5kKTtjYXNlInV0ZjgiOmNhc2UidXRmLTgiOnJldHVybiB1dGY4U2xpY2UodGhpcyxzdGFydCxlbmQpO2Nhc2UiYXNjaWkiOnJldHVybiBhc2NpaVNsaWNlKHRoaXMsc3RhcnQsZW5kKTtjYXNlImxhdGluMSI6Y2FzZSJiaW5hcnkiOnJldHVybiBsYXRpbjFTbGljZSh0aGlzLHN0YXJ0LGVuZCk7Y2FzZSJiYXNlNjQiOnJldHVybiBiYXNlNjRTbGljZSh0aGlzLHN0YXJ0LGVuZCk7Y2FzZSJ1Y3MyIjpjYXNlInVjcy0yIjpjYXNlInV0ZjE2bGUiOmNhc2UidXRmLTE2bGUiOnJldHVybiB1dGYxNmxlU2xpY2UodGhpcyxzdGFydCxlbmQpO2RlZmF1bHQ6aWYobG93ZXJlZENhc2UpdGhyb3cgbmV3IFR5cGVFcnJvcigiVW5rbm93biBlbmNvZGluZzogIitlbmNvZGluZyk7ZW5jb2Rpbmc9KGVuY29kaW5nKyIiKS50b0xvd2VyQ2FzZSgpO2xvd2VyZWRDYXNlPXRydWV9fX1CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlcj10cnVlO2Z1bmN0aW9uIHN3YXAoYixuLG0pe3ZhciBpPWJbbl07YltuXT1iW21dO2JbbV09aX1CdWZmZXIucHJvdG90eXBlLnN3YXAxNj1mdW5jdGlvbiBzd2FwMTYoKXt2YXIgbGVuPXRoaXMubGVuZ3RoO2lmKGxlbiUyIT09MCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkJ1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzIil9Zm9yKHZhciBpPTA7aTxsZW47aSs9Mil7c3dhcCh0aGlzLGksaSsxKX1yZXR1cm4gdGhpc307QnVmZmVyLnByb3RvdHlwZS5zd2FwMzI9ZnVuY3Rpb24gc3dhcDMyKCl7dmFyIGxlbj10aGlzLmxlbmd0aDtpZihsZW4lNCE9PTApe3Rocm93IG5ldyBSYW5nZUVycm9yKCJCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cyIpfWZvcih2YXIgaT0wO2k8bGVuO2krPTQpe3N3YXAodGhpcyxpLGkrMyk7c3dhcCh0aGlzLGkrMSxpKzIpfXJldHVybiB0aGlzfTtCdWZmZXIucHJvdG90eXBlLnN3YXA2ND1mdW5jdGlvbiBzd2FwNjQoKXt2YXIgbGVuPXRoaXMubGVuZ3RoO2lmKGxlbiU4IT09MCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkJ1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzIil9Zm9yKHZhciBpPTA7aTxsZW47aSs9OCl7c3dhcCh0aGlzLGksaSs3KTtzd2FwKHRoaXMsaSsxLGkrNik7c3dhcCh0aGlzLGkrMixpKzUpO3N3YXAodGhpcyxpKzMsaSs0KX1yZXR1cm4gdGhpc307QnVmZmVyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbiB0b1N0cmluZygpe3ZhciBsZW5ndGg9dGhpcy5sZW5ndGg7aWYobGVuZ3RoPT09MClyZXR1cm4iIjtpZihhcmd1bWVudHMubGVuZ3RoPT09MClyZXR1cm4gdXRmOFNsaWNlKHRoaXMsMCxsZW5ndGgpO3JldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtCdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nPUJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmc7QnVmZmVyLnByb3RvdHlwZS5lcXVhbHM9ZnVuY3Rpb24gZXF1YWxzKGIpe2lmKCFCdWZmZXIuaXNCdWZmZXIoYikpdGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciIpO2lmKHRoaXM9PT1iKXJldHVybiB0cnVlO3JldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLGIpPT09MH07QnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0PWZ1bmN0aW9uIGluc3BlY3QoKXt2YXIgc3RyPSIiO3ZhciBtYXg9ZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUztzdHI9dGhpcy50b1N0cmluZygiaGV4IiwwLG1heCkucmVwbGFjZSgvKC57Mn0pL2csIiQxICIpLnRyaW0oKTtpZih0aGlzLmxlbmd0aD5tYXgpc3RyKz0iIC4uLiAiO3JldHVybiI8QnVmZmVyICIrc3RyKyI+In07QnVmZmVyLnByb3RvdHlwZS5jb21wYXJlPWZ1bmN0aW9uIGNvbXBhcmUodGFyZ2V0LHN0YXJ0LGVuZCx0aGlzU3RhcnQsdGhpc0VuZCl7aWYoaXNJbnN0YW5jZSh0YXJnZXQsVWludDhBcnJheSkpe3RhcmdldD1CdWZmZXIuZnJvbSh0YXJnZXQsdGFyZ2V0Lm9mZnNldCx0YXJnZXQuYnl0ZUxlbmd0aCl9aWYoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgInRhcmdldCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheS4gJysiUmVjZWl2ZWQgdHlwZSAiK3R5cGVvZiB0YXJnZXQpfWlmKHN0YXJ0PT09dW5kZWZpbmVkKXtzdGFydD0wfWlmKGVuZD09PXVuZGVmaW5lZCl7ZW5kPXRhcmdldD90YXJnZXQubGVuZ3RoOjB9aWYodGhpc1N0YXJ0PT09dW5kZWZpbmVkKXt0aGlzU3RhcnQ9MH1pZih0aGlzRW5kPT09dW5kZWZpbmVkKXt0aGlzRW5kPXRoaXMubGVuZ3RofWlmKHN0YXJ0PDB8fGVuZD50YXJnZXQubGVuZ3RofHx0aGlzU3RhcnQ8MHx8dGhpc0VuZD50aGlzLmxlbmd0aCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIm91dCBvZiByYW5nZSBpbmRleCIpfWlmKHRoaXNTdGFydD49dGhpc0VuZCYmc3RhcnQ+PWVuZCl7cmV0dXJuIDB9aWYodGhpc1N0YXJ0Pj10aGlzRW5kKXtyZXR1cm4tMX1pZihzdGFydD49ZW5kKXtyZXR1cm4gMX1zdGFydD4+Pj0wO2VuZD4+Pj0wO3RoaXNTdGFydD4+Pj0wO3RoaXNFbmQ+Pj49MDtpZih0aGlzPT09dGFyZ2V0KXJldHVybiAwO3ZhciB4PXRoaXNFbmQtdGhpc1N0YXJ0O3ZhciB5PWVuZC1zdGFydDt2YXIgbGVuPU1hdGgubWluKHgseSk7dmFyIHRoaXNDb3B5PXRoaXMuc2xpY2UodGhpc1N0YXJ0LHRoaXNFbmQpO3ZhciB0YXJnZXRDb3B5PXRhcmdldC5zbGljZShzdGFydCxlbmQpO2Zvcih2YXIgaT0wO2k8bGVuOysraSl7aWYodGhpc0NvcHlbaV0hPT10YXJnZXRDb3B5W2ldKXt4PXRoaXNDb3B5W2ldO3k9dGFyZ2V0Q29weVtpXTticmVha319aWYoeDx5KXJldHVybi0xO2lmKHk8eClyZXR1cm4gMTtyZXR1cm4gMH07ZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YoYnVmZmVyLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil7aWYoYnVmZmVyLmxlbmd0aD09PTApcmV0dXJuLTE7aWYodHlwZW9mIGJ5dGVPZmZzZXQ9PT0ic3RyaW5nIil7ZW5jb2Rpbmc9Ynl0ZU9mZnNldDtieXRlT2Zmc2V0PTB9ZWxzZSBpZihieXRlT2Zmc2V0PjIxNDc0ODM2NDcpe2J5dGVPZmZzZXQ9MjE0NzQ4MzY0N31lbHNlIGlmKGJ5dGVPZmZzZXQ8LTIxNDc0ODM2NDgpe2J5dGVPZmZzZXQ9LTIxNDc0ODM2NDh9Ynl0ZU9mZnNldD0rYnl0ZU9mZnNldDtpZihudW1iZXJJc05hTihieXRlT2Zmc2V0KSl7Ynl0ZU9mZnNldD1kaXI/MDpidWZmZXIubGVuZ3RoLTF9aWYoYnl0ZU9mZnNldDwwKWJ5dGVPZmZzZXQ9YnVmZmVyLmxlbmd0aCtieXRlT2Zmc2V0O2lmKGJ5dGVPZmZzZXQ+PWJ1ZmZlci5sZW5ndGgpe2lmKGRpcilyZXR1cm4tMTtlbHNlIGJ5dGVPZmZzZXQ9YnVmZmVyLmxlbmd0aC0xfWVsc2UgaWYoYnl0ZU9mZnNldDwwKXtpZihkaXIpYnl0ZU9mZnNldD0wO2Vsc2UgcmV0dXJuLTF9aWYodHlwZW9mIHZhbD09PSJzdHJpbmciKXt2YWw9QnVmZmVyLmZyb20odmFsLGVuY29kaW5nKX1pZihCdWZmZXIuaXNCdWZmZXIodmFsKSl7aWYodmFsLmxlbmd0aD09PTApe3JldHVybi0xfXJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil9ZWxzZSBpZih0eXBlb2YgdmFsPT09Im51bWJlciIpe3ZhbD12YWwmMjU1O2lmKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mPT09ImZ1bmN0aW9uIil7aWYoZGlyKXtyZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlcix2YWwsYnl0ZU9mZnNldCl9ZWxzZXtyZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsdmFsLGJ5dGVPZmZzZXQpfX1yZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlcixbdmFsXSxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil9dGhyb3cgbmV3IFR5cGVFcnJvcigidmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyIil9ZnVuY3Rpb24gYXJyYXlJbmRleE9mKGFycix2YWwsYnl0ZU9mZnNldCxlbmNvZGluZyxkaXIpe3ZhciBpbmRleFNpemU9MTt2YXIgYXJyTGVuZ3RoPWFyci5sZW5ndGg7dmFyIHZhbExlbmd0aD12YWwubGVuZ3RoO2lmKGVuY29kaW5nIT09dW5kZWZpbmVkKXtlbmNvZGluZz1TdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCk7aWYoZW5jb2Rpbmc9PT0idWNzMiJ8fGVuY29kaW5nPT09InVjcy0yInx8ZW5jb2Rpbmc9PT0idXRmMTZsZSJ8fGVuY29kaW5nPT09InV0Zi0xNmxlIil7aWYoYXJyLmxlbmd0aDwyfHx2YWwubGVuZ3RoPDIpe3JldHVybi0xfWluZGV4U2l6ZT0yO2Fyckxlbmd0aC89Mjt2YWxMZW5ndGgvPTI7Ynl0ZU9mZnNldC89Mn19ZnVuY3Rpb24gcmVhZChidWYsaSl7aWYoaW5kZXhTaXplPT09MSl7cmV0dXJuIGJ1ZltpXX1lbHNle3JldHVybiBidWYucmVhZFVJbnQxNkJFKGkqaW5kZXhTaXplKX19dmFyIGk7aWYoZGlyKXt2YXIgZm91bmRJbmRleD0tMTtmb3IoaT1ieXRlT2Zmc2V0O2k8YXJyTGVuZ3RoO2krKyl7aWYocmVhZChhcnIsaSk9PT1yZWFkKHZhbCxmb3VuZEluZGV4PT09LTE/MDppLWZvdW5kSW5kZXgpKXtpZihmb3VuZEluZGV4PT09LTEpZm91bmRJbmRleD1pO2lmKGktZm91bmRJbmRleCsxPT09dmFsTGVuZ3RoKXJldHVybiBmb3VuZEluZGV4KmluZGV4U2l6ZX1lbHNle2lmKGZvdW5kSW5kZXghPT0tMSlpLT1pLWZvdW5kSW5kZXg7Zm91bmRJbmRleD0tMX19fWVsc2V7aWYoYnl0ZU9mZnNldCt2YWxMZW5ndGg+YXJyTGVuZ3RoKWJ5dGVPZmZzZXQ9YXJyTGVuZ3RoLXZhbExlbmd0aDtmb3IoaT1ieXRlT2Zmc2V0O2k+PTA7aS0tKXt2YXIgZm91bmQ9dHJ1ZTtmb3IodmFyIGo9MDtqPHZhbExlbmd0aDtqKyspe2lmKHJlYWQoYXJyLGkraikhPT1yZWFkKHZhbCxqKSl7Zm91bmQ9ZmFsc2U7YnJlYWt9fWlmKGZvdW5kKXJldHVybiBpfX1yZXR1cm4tMX1CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzPWZ1bmN0aW9uIGluY2x1ZGVzKHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nKXtyZXR1cm4gdGhpcy5pbmRleE9mKHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nKSE9PS0xfTtCdWZmZXIucHJvdG90eXBlLmluZGV4T2Y9ZnVuY3Rpb24gaW5kZXhPZih2YWwsYnl0ZU9mZnNldCxlbmNvZGluZyl7cmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsdmFsLGJ5dGVPZmZzZXQsZW5jb2RpbmcsdHJ1ZSl9O0J1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2Y9ZnVuY3Rpb24gbGFzdEluZGV4T2YodmFsLGJ5dGVPZmZzZXQsZW5jb2Rpbmcpe3JldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGZhbHNlKX07ZnVuY3Rpb24gaGV4V3JpdGUoYnVmLHN0cmluZyxvZmZzZXQsbGVuZ3RoKXtvZmZzZXQ9TnVtYmVyKG9mZnNldCl8fDA7dmFyIHJlbWFpbmluZz1idWYubGVuZ3RoLW9mZnNldDtpZighbGVuZ3RoKXtsZW5ndGg9cmVtYWluaW5nfWVsc2V7bGVuZ3RoPU51bWJlcihsZW5ndGgpO2lmKGxlbmd0aD5yZW1haW5pbmcpe2xlbmd0aD1yZW1haW5pbmd9fXZhciBzdHJMZW49c3RyaW5nLmxlbmd0aDtpZihsZW5ndGg+c3RyTGVuLzIpe2xlbmd0aD1zdHJMZW4vMn1mb3IodmFyIGk9MDtpPGxlbmd0aDsrK2kpe3ZhciBwYXJzZWQ9cGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpKjIsMiksMTYpO2lmKG51bWJlcklzTmFOKHBhcnNlZCkpcmV0dXJuIGk7YnVmW29mZnNldCtpXT1wYXJzZWR9cmV0dXJuIGl9ZnVuY3Rpb24gdXRmOFdyaXRlKGJ1ZixzdHJpbmcsb2Zmc2V0LGxlbmd0aCl7cmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLGJ1Zi5sZW5ndGgtb2Zmc2V0KSxidWYsb2Zmc2V0LGxlbmd0aCl9ZnVuY3Rpb24gYXNjaWlXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLGJ1ZixvZmZzZXQsbGVuZ3RoKX1mdW5jdGlvbiBsYXRpbjFXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBhc2NpaVdyaXRlKGJ1ZixzdHJpbmcsb2Zmc2V0LGxlbmd0aCl9ZnVuY3Rpb24gYmFzZTY0V3JpdGUoYnVmLHN0cmluZyxvZmZzZXQsbGVuZ3RoKXtyZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksYnVmLG9mZnNldCxsZW5ndGgpfWZ1bmN0aW9uIHVjczJXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyxidWYubGVuZ3RoLW9mZnNldCksYnVmLG9mZnNldCxsZW5ndGgpfUJ1ZmZlci5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24gd3JpdGUoc3RyaW5nLG9mZnNldCxsZW5ndGgsZW5jb2Rpbmcpe2lmKG9mZnNldD09PXVuZGVmaW5lZCl7ZW5jb2Rpbmc9InV0ZjgiO2xlbmd0aD10aGlzLmxlbmd0aDtvZmZzZXQ9MH1lbHNlIGlmKGxlbmd0aD09PXVuZGVmaW5lZCYmdHlwZW9mIG9mZnNldD09PSJzdHJpbmciKXtlbmNvZGluZz1vZmZzZXQ7bGVuZ3RoPXRoaXMubGVuZ3RoO29mZnNldD0wfWVsc2UgaWYoaXNGaW5pdGUob2Zmc2V0KSl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoaXNGaW5pdGUobGVuZ3RoKSl7bGVuZ3RoPWxlbmd0aD4+PjA7aWYoZW5jb2Rpbmc9PT11bmRlZmluZWQpZW5jb2Rpbmc9InV0ZjgifWVsc2V7ZW5jb2Rpbmc9bGVuZ3RoO2xlbmd0aD11bmRlZmluZWR9fWVsc2V7dGhyb3cgbmV3IEVycm9yKCJCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCIpfXZhciByZW1haW5pbmc9dGhpcy5sZW5ndGgtb2Zmc2V0O2lmKGxlbmd0aD09PXVuZGVmaW5lZHx8bGVuZ3RoPnJlbWFpbmluZylsZW5ndGg9cmVtYWluaW5nO2lmKHN0cmluZy5sZW5ndGg+MCYmKGxlbmd0aDwwfHxvZmZzZXQ8MCl8fG9mZnNldD50aGlzLmxlbmd0aCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkF0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzIil9aWYoIWVuY29kaW5nKWVuY29kaW5nPSJ1dGY4Ijt2YXIgbG93ZXJlZENhc2U9ZmFsc2U7Zm9yKDs7KXtzd2l0Y2goZW5jb2Rpbmcpe2Nhc2UiaGV4IjpyZXR1cm4gaGV4V3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7Y2FzZSJ1dGY4IjpjYXNlInV0Zi04IjpyZXR1cm4gdXRmOFdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UiYXNjaWkiOnJldHVybiBhc2NpaVdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UibGF0aW4xIjpjYXNlImJpbmFyeSI6cmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UiYmFzZTY0IjpyZXR1cm4gYmFzZTY0V3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7Y2FzZSJ1Y3MyIjpjYXNlInVjcy0yIjpjYXNlInV0ZjE2bGUiOmNhc2UidXRmLTE2bGUiOnJldHVybiB1Y3MyV3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7ZGVmYXVsdDppZihsb3dlcmVkQ2FzZSl0aHJvdyBuZXcgVHlwZUVycm9yKCJVbmtub3duIGVuY29kaW5nOiAiK2VuY29kaW5nKTtlbmNvZGluZz0oIiIrZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCk7bG93ZXJlZENhc2U9dHJ1ZX19fTtCdWZmZXIucHJvdG90eXBlLnRvSlNPTj1mdW5jdGlvbiB0b0pTT04oKXtyZXR1cm57dHlwZToiQnVmZmVyIixkYXRhOkFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2Fycnx8dGhpcywwKX19O2Z1bmN0aW9uIGJhc2U2NFNsaWNlKGJ1ZixzdGFydCxlbmQpe2lmKHN0YXJ0PT09MCYmZW5kPT09YnVmLmxlbmd0aCl7cmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zil9ZWxzZXtyZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LGVuZCkpfX1mdW5jdGlvbiB1dGY4U2xpY2UoYnVmLHN0YXJ0LGVuZCl7ZW5kPU1hdGgubWluKGJ1Zi5sZW5ndGgsZW5kKTt2YXIgcmVzPVtdO3ZhciBpPXN0YXJ0O3doaWxlKGk8ZW5kKXt2YXIgZmlyc3RCeXRlPWJ1ZltpXTt2YXIgY29kZVBvaW50PW51bGw7dmFyIGJ5dGVzUGVyU2VxdWVuY2U9Zmlyc3RCeXRlPjIzOT80OmZpcnN0Qnl0ZT4yMjM/MzpmaXJzdEJ5dGU+MTkxPzI6MTtpZihpK2J5dGVzUGVyU2VxdWVuY2U8PWVuZCl7dmFyIHNlY29uZEJ5dGUsdGhpcmRCeXRlLGZvdXJ0aEJ5dGUsdGVtcENvZGVQb2ludDtzd2l0Y2goYnl0ZXNQZXJTZXF1ZW5jZSl7Y2FzZSAxOmlmKGZpcnN0Qnl0ZTwxMjgpe2NvZGVQb2ludD1maXJzdEJ5dGV9YnJlYWs7Y2FzZSAyOnNlY29uZEJ5dGU9YnVmW2krMV07aWYoKHNlY29uZEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjMxKTw8NnxzZWNvbmRCeXRlJjYzO2lmKHRlbXBDb2RlUG9pbnQ+MTI3KXtjb2RlUG9pbnQ9dGVtcENvZGVQb2ludH19YnJlYWs7Y2FzZSAzOnNlY29uZEJ5dGU9YnVmW2krMV07dGhpcmRCeXRlPWJ1ZltpKzJdO2lmKChzZWNvbmRCeXRlJjE5Mik9PT0xMjgmJih0aGlyZEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjE1KTw8MTJ8KHNlY29uZEJ5dGUmNjMpPDw2fHRoaXJkQnl0ZSY2MztpZih0ZW1wQ29kZVBvaW50PjIwNDcmJih0ZW1wQ29kZVBvaW50PDU1Mjk2fHx0ZW1wQ29kZVBvaW50PjU3MzQzKSl7Y29kZVBvaW50PXRlbXBDb2RlUG9pbnR9fWJyZWFrO2Nhc2UgNDpzZWNvbmRCeXRlPWJ1ZltpKzFdO3RoaXJkQnl0ZT1idWZbaSsyXTtmb3VydGhCeXRlPWJ1ZltpKzNdO2lmKChzZWNvbmRCeXRlJjE5Mik9PT0xMjgmJih0aGlyZEJ5dGUmMTkyKT09PTEyOCYmKGZvdXJ0aEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjE1KTw8MTh8KHNlY29uZEJ5dGUmNjMpPDwxMnwodGhpcmRCeXRlJjYzKTw8Nnxmb3VydGhCeXRlJjYzO2lmKHRlbXBDb2RlUG9pbnQ+NjU1MzUmJnRlbXBDb2RlUG9pbnQ8MTExNDExMil7Y29kZVBvaW50PXRlbXBDb2RlUG9pbnR9fX19aWYoY29kZVBvaW50PT09bnVsbCl7Y29kZVBvaW50PTY1NTMzO2J5dGVzUGVyU2VxdWVuY2U9MX1lbHNlIGlmKGNvZGVQb2ludD42NTUzNSl7Y29kZVBvaW50LT02NTUzNjtyZXMucHVzaChjb2RlUG9pbnQ+Pj4xMCYxMDIzfDU1Mjk2KTtjb2RlUG9pbnQ9NTYzMjB8Y29kZVBvaW50JjEwMjN9cmVzLnB1c2goY29kZVBvaW50KTtpKz1ieXRlc1BlclNlcXVlbmNlfXJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKX12YXIgTUFYX0FSR1VNRU5UU19MRU5HVEg9NDA5NjtmdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkoY29kZVBvaW50cyl7dmFyIGxlbj1jb2RlUG9pbnRzLmxlbmd0aDtpZihsZW48PU1BWF9BUkdVTUVOVFNfTEVOR1RIKXtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsY29kZVBvaW50cyl9dmFyIHJlcz0iIjt2YXIgaT0wO3doaWxlKGk8bGVuKXtyZXMrPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLGNvZGVQb2ludHMuc2xpY2UoaSxpKz1NQVhfQVJHVU1FTlRTX0xFTkdUSCkpfXJldHVybiByZXN9ZnVuY3Rpb24gYXNjaWlTbGljZShidWYsc3RhcnQsZW5kKXt2YXIgcmV0PSIiO2VuZD1NYXRoLm1pbihidWYubGVuZ3RoLGVuZCk7Zm9yKHZhciBpPXN0YXJ0O2k8ZW5kOysraSl7cmV0Kz1TdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSYxMjcpfXJldHVybiByZXR9ZnVuY3Rpb24gbGF0aW4xU2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIHJldD0iIjtlbmQ9TWF0aC5taW4oYnVmLmxlbmd0aCxlbmQpO2Zvcih2YXIgaT1zdGFydDtpPGVuZDsrK2kpe3JldCs9U3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pfXJldHVybiByZXR9ZnVuY3Rpb24gaGV4U2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIGxlbj1idWYubGVuZ3RoO2lmKCFzdGFydHx8c3RhcnQ8MClzdGFydD0wO2lmKCFlbmR8fGVuZDwwfHxlbmQ+bGVuKWVuZD1sZW47dmFyIG91dD0iIjtmb3IodmFyIGk9c3RhcnQ7aTxlbmQ7KytpKXtvdXQrPXRvSGV4KGJ1ZltpXSl9cmV0dXJuIG91dH1mdW5jdGlvbiB1dGYxNmxlU2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIGJ5dGVzPWJ1Zi5zbGljZShzdGFydCxlbmQpO3ZhciByZXM9IiI7Zm9yKHZhciBpPTA7aTxieXRlcy5sZW5ndGg7aSs9Mil7cmVzKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldK2J5dGVzW2krMV0qMjU2KX1yZXR1cm4gcmVzfUJ1ZmZlci5wcm90b3R5cGUuc2xpY2U9ZnVuY3Rpb24gc2xpY2Uoc3RhcnQsZW5kKXt2YXIgbGVuPXRoaXMubGVuZ3RoO3N0YXJ0PX5+c3RhcnQ7ZW5kPWVuZD09PXVuZGVmaW5lZD9sZW46fn5lbmQ7aWYoc3RhcnQ8MCl7c3RhcnQrPWxlbjtpZihzdGFydDwwKXN0YXJ0PTB9ZWxzZSBpZihzdGFydD5sZW4pe3N0YXJ0PWxlbn1pZihlbmQ8MCl7ZW5kKz1sZW47aWYoZW5kPDApZW5kPTB9ZWxzZSBpZihlbmQ+bGVuKXtlbmQ9bGVufWlmKGVuZDxzdGFydCllbmQ9c3RhcnQ7dmFyIG5ld0J1Zj10aGlzLnN1YmFycmF5KHN0YXJ0LGVuZCk7bmV3QnVmLl9fcHJvdG9fXz1CdWZmZXIucHJvdG90eXBlO3JldHVybiBuZXdCdWZ9O2Z1bmN0aW9uIGNoZWNrT2Zmc2V0KG9mZnNldCxleHQsbGVuZ3RoKXtpZihvZmZzZXQlMSE9PTB8fG9mZnNldDwwKXRocm93IG5ldyBSYW5nZUVycm9yKCJvZmZzZXQgaXMgbm90IHVpbnQiKTtpZihvZmZzZXQrZXh0Pmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCIpfUJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRT1mdW5jdGlvbiByZWFkVUludExFKG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsYnl0ZUxlbmd0aCx0aGlzLmxlbmd0aCk7dmFyIHZhbD10aGlzW29mZnNldF07dmFyIG11bD0xO3ZhciBpPTA7d2hpbGUoKytpPGJ5dGVMZW5ndGgmJihtdWwqPTI1Nikpe3ZhbCs9dGhpc1tvZmZzZXQraV0qbXVsfXJldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRT1mdW5jdGlvbiByZWFkVUludEJFKG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7Y2hlY2tPZmZzZXQob2Zmc2V0LGJ5dGVMZW5ndGgsdGhpcy5sZW5ndGgpfXZhciB2YWw9dGhpc1tvZmZzZXQrLS1ieXRlTGVuZ3RoXTt2YXIgbXVsPTE7d2hpbGUoYnl0ZUxlbmd0aD4wJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0Ky0tYnl0ZUxlbmd0aF0qbXVsfXJldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4PWZ1bmN0aW9uIHJlYWRVSW50OChvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsMSx0aGlzLmxlbmd0aCk7cmV0dXJuIHRoaXNbb2Zmc2V0XX07QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEU9ZnVuY3Rpb24gcmVhZFVJbnQxNkxFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCwyLHRoaXMubGVuZ3RoKTtyZXR1cm4gdGhpc1tvZmZzZXRdfHRoaXNbb2Zmc2V0KzFdPDw4fTtCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRT1mdW5jdGlvbiByZWFkVUludDE2QkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDIsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF08PDh8dGhpc1tvZmZzZXQrMV19O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFPWZ1bmN0aW9uIHJlYWRVSW50MzJMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsNCx0aGlzLmxlbmd0aCk7cmV0dXJuKHRoaXNbb2Zmc2V0XXx0aGlzW29mZnNldCsxXTw8OHx0aGlzW29mZnNldCsyXTw8MTYpK3RoaXNbb2Zmc2V0KzNdKjE2Nzc3MjE2fTtCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRT1mdW5jdGlvbiByZWFkVUludDMyQkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDQsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF0qMTY3NzcyMTYrKHRoaXNbb2Zmc2V0KzFdPDwxNnx0aGlzW29mZnNldCsyXTw8OHx0aGlzW29mZnNldCszXSl9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludExFPWZ1bmN0aW9uIHJlYWRJbnRMRShvZmZzZXQsYnl0ZUxlbmd0aCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7Ynl0ZUxlbmd0aD1ieXRlTGVuZ3RoPj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LGJ5dGVMZW5ndGgsdGhpcy5sZW5ndGgpO3ZhciB2YWw9dGhpc1tvZmZzZXRdO3ZhciBtdWw9MTt2YXIgaT0wO3doaWxlKCsraTxieXRlTGVuZ3RoJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0K2ldKm11bH1tdWwqPTEyODtpZih2YWw+PW11bCl2YWwtPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKTtyZXR1cm4gdmFsfTtCdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRT1mdW5jdGlvbiByZWFkSW50QkUob2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2J5dGVMZW5ndGg9Ynl0ZUxlbmd0aD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCxieXRlTGVuZ3RoLHRoaXMubGVuZ3RoKTt2YXIgaT1ieXRlTGVuZ3RoO3ZhciBtdWw9MTt2YXIgdmFsPXRoaXNbb2Zmc2V0Ky0taV07d2hpbGUoaT4wJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0Ky0taV0qbXVsfW11bCo9MTI4O2lmKHZhbD49bXVsKXZhbC09TWF0aC5wb3coMiw4KmJ5dGVMZW5ndGgpO3JldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDg9ZnVuY3Rpb24gcmVhZEludDgob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDEsdGhpcy5sZW5ndGgpO2lmKCEodGhpc1tvZmZzZXRdJjEyOCkpcmV0dXJuIHRoaXNbb2Zmc2V0XTtyZXR1cm4oMjU1LXRoaXNbb2Zmc2V0XSsxKSotMX07QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRT1mdW5jdGlvbiByZWFkSW50MTZMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsMix0aGlzLmxlbmd0aCk7dmFyIHZhbD10aGlzW29mZnNldF18dGhpc1tvZmZzZXQrMV08PDg7cmV0dXJuIHZhbCYzMjc2OD92YWx8NDI5NDkwMTc2MDp2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkU9ZnVuY3Rpb24gcmVhZEludDE2QkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDIsdGhpcy5sZW5ndGgpO3ZhciB2YWw9dGhpc1tvZmZzZXQrMV18dGhpc1tvZmZzZXRdPDw4O3JldHVybiB2YWwmMzI3Njg/dmFsfDQyOTQ5MDE3NjA6dmFsfTtCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFPWZ1bmN0aW9uIHJlYWRJbnQzMkxFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw0LHRoaXMubGVuZ3RoKTtyZXR1cm4gdGhpc1tvZmZzZXRdfHRoaXNbb2Zmc2V0KzFdPDw4fHRoaXNbb2Zmc2V0KzJdPDwxNnx0aGlzW29mZnNldCszXTw8MjR9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkU9ZnVuY3Rpb24gcmVhZEludDMyQkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDQsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF08PDI0fHRoaXNbb2Zmc2V0KzFdPDwxNnx0aGlzW29mZnNldCsyXTw8OHx0aGlzW29mZnNldCszXX07QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRT1mdW5jdGlvbiByZWFkRmxvYXRMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsNCx0aGlzLmxlbmd0aCk7cmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLG9mZnNldCx0cnVlLDIzLDQpfTtCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFPWZ1bmN0aW9uIHJlYWRGbG9hdEJFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw0LHRoaXMubGVuZ3RoKTtyZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsb2Zmc2V0LGZhbHNlLDIzLDQpfTtCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRT1mdW5jdGlvbiByZWFkRG91YmxlTEUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDgsdGhpcy5sZW5ndGgpO3JldHVybiBpZWVlNzU0LnJlYWQodGhpcyxvZmZzZXQsdHJ1ZSw1Miw4KX07QnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkU9ZnVuY3Rpb24gcmVhZERvdWJsZUJFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw4LHRoaXMubGVuZ3RoKTtyZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsb2Zmc2V0LGZhbHNlLDUyLDgpfTtmdW5jdGlvbiBjaGVja0ludChidWYsdmFsdWUsb2Zmc2V0LGV4dCxtYXgsbWluKXtpZighQnVmZmVyLmlzQnVmZmVyKGJ1ZikpdGhyb3cgbmV3IFR5cGVFcnJvcignImJ1ZmZlciIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpO2lmKHZhbHVlPm1heHx8dmFsdWU8bWluKXRocm93IG5ldyBSYW5nZUVycm9yKCcidmFsdWUiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKTtpZihvZmZzZXQrZXh0PmJ1Zi5sZW5ndGgpdGhyb3cgbmV3IFJhbmdlRXJyb3IoIkluZGV4IG91dCBvZiByYW5nZSIpfUJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEU9ZnVuY3Rpb24gd3JpdGVVSW50TEUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7dmFyIG1heEJ5dGVzPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKS0xO2NoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbWF4Qnl0ZXMsMCl9dmFyIG11bD0xO3ZhciBpPTA7dGhpc1tvZmZzZXRdPXZhbHVlJjI1NTt3aGlsZSgrK2k8Ynl0ZUxlbmd0aCYmKG11bCo9MjU2KSl7dGhpc1tvZmZzZXQraV09dmFsdWUvbXVsJjI1NX1yZXR1cm4gb2Zmc2V0K2J5dGVMZW5ndGh9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkU9ZnVuY3Rpb24gd3JpdGVVSW50QkUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7dmFyIG1heEJ5dGVzPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKS0xO2NoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbWF4Qnl0ZXMsMCl9dmFyIGk9Ynl0ZUxlbmd0aC0xO3ZhciBtdWw9MTt0aGlzW29mZnNldCtpXT12YWx1ZSYyNTU7d2hpbGUoLS1pPj0wJiYobXVsKj0yNTYpKXt0aGlzW29mZnNldCtpXT12YWx1ZS9tdWwmMjU1fXJldHVybiBvZmZzZXQrYnl0ZUxlbmd0aH07QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4PWZ1bmN0aW9uIHdyaXRlVUludDgodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDEsMjU1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7cmV0dXJuIG9mZnNldCsxfTtCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEU9ZnVuY3Rpb24gd3JpdGVVSW50MTZMRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsMiw2NTUzNSwwKTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+ODtyZXR1cm4gb2Zmc2V0KzJ9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRT1mdW5jdGlvbiB3cml0ZVVJbnQxNkJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCwyLDY1NTM1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZT4+Pjg7dGhpc1tvZmZzZXQrMV09dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrMn07QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFPWZ1bmN0aW9uIHdyaXRlVUludDMyTEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDQsNDI5NDk2NzI5NSwwKTt0aGlzW29mZnNldCszXT12YWx1ZT4+PjI0O3RoaXNbb2Zmc2V0KzJdPXZhbHVlPj4+MTY7dGhpc1tvZmZzZXQrMV09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7cmV0dXJuIG9mZnNldCs0fTtCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkU9ZnVuY3Rpb24gd3JpdGVVSW50MzJCRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsNCw0Mjk0OTY3Mjk1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZT4+PjI0O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+MTY7dGhpc1tvZmZzZXQrMl09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0KzNdPXZhbHVlJjI1NTtyZXR1cm4gb2Zmc2V0KzR9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRT1mdW5jdGlvbiB3cml0ZUludExFKHZhbHVlLG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KXt2YXIgbGltaXQ9TWF0aC5wb3coMiw4KmJ5dGVMZW5ndGgtMSk7Y2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsYnl0ZUxlbmd0aCxsaW1pdC0xLC1saW1pdCl9dmFyIGk9MDt2YXIgbXVsPTE7dmFyIHN1Yj0wO3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7d2hpbGUoKytpPGJ5dGVMZW5ndGgmJihtdWwqPTI1Nikpe2lmKHZhbHVlPDAmJnN1Yj09PTAmJnRoaXNbb2Zmc2V0K2ktMV0hPT0wKXtzdWI9MX10aGlzW29mZnNldCtpXT0odmFsdWUvbXVsPj4wKS1zdWImMjU1fXJldHVybiBvZmZzZXQrYnl0ZUxlbmd0aH07QnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFPWZ1bmN0aW9uIHdyaXRlSW50QkUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpe3ZhciBsaW1pdD1NYXRoLnBvdygyLDgqYnl0ZUxlbmd0aC0xKTtjaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCxieXRlTGVuZ3RoLGxpbWl0LTEsLWxpbWl0KX12YXIgaT1ieXRlTGVuZ3RoLTE7dmFyIG11bD0xO3ZhciBzdWI9MDt0aGlzW29mZnNldCtpXT12YWx1ZSYyNTU7d2hpbGUoLS1pPj0wJiYobXVsKj0yNTYpKXtpZih2YWx1ZTwwJiZzdWI9PT0wJiZ0aGlzW29mZnNldCtpKzFdIT09MCl7c3ViPTF9dGhpc1tvZmZzZXQraV09KHZhbHVlL211bD4+MCktc3ViJjI1NX1yZXR1cm4gb2Zmc2V0K2J5dGVMZW5ndGh9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4PWZ1bmN0aW9uIHdyaXRlSW50OCh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsMSwxMjcsLTEyOCk7aWYodmFsdWU8MCl2YWx1ZT0yNTUrdmFsdWUrMTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrMX07QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEU9ZnVuY3Rpb24gd3JpdGVJbnQxNkxFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCwyLDMyNzY3LC0zMjc2OCk7dGhpc1tvZmZzZXRdPXZhbHVlJjI1NTt0aGlzW29mZnNldCsxXT12YWx1ZT4+Pjg7cmV0dXJuIG9mZnNldCsyfTtCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRT1mdW5jdGlvbiB3cml0ZUludDE2QkUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDIsMzI3NjcsLTMyNzY4KTt0aGlzW29mZnNldF09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0KzFdPXZhbHVlJjI1NTtyZXR1cm4gb2Zmc2V0KzJ9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFPWZ1bmN0aW9uIHdyaXRlSW50MzJMRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsNCwyMTQ3NDgzNjQ3LC0yMTQ3NDgzNjQ4KTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+ODt0aGlzW29mZnNldCsyXT12YWx1ZT4+PjE2O3RoaXNbb2Zmc2V0KzNdPXZhbHVlPj4+MjQ7cmV0dXJuIG9mZnNldCs0fTtCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRT1mdW5jdGlvbiB3cml0ZUludDMyQkUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDQsMjE0NzQ4MzY0NywtMjE0NzQ4MzY0OCk7aWYodmFsdWU8MCl2YWx1ZT00Mjk0OTY3Mjk1K3ZhbHVlKzE7dGhpc1tvZmZzZXRdPXZhbHVlPj4+MjQ7dGhpc1tvZmZzZXQrMV09dmFsdWU+Pj4xNjt0aGlzW29mZnNldCsyXT12YWx1ZT4+Pjg7dGhpc1tvZmZzZXQrM109dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrNH07ZnVuY3Rpb24gY2hlY2tJRUVFNzU0KGJ1Zix2YWx1ZSxvZmZzZXQsZXh0LG1heCxtaW4pe2lmKG9mZnNldCtleHQ+YnVmLmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiSW5kZXggb3V0IG9mIHJhbmdlIik7aWYob2Zmc2V0PDApdGhyb3cgbmV3IFJhbmdlRXJyb3IoIkluZGV4IG91dCBvZiByYW5nZSIpfWZ1bmN0aW9uIHdyaXRlRmxvYXQoYnVmLHZhbHVlLG9mZnNldCxsaXR0bGVFbmRpYW4sbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpe2NoZWNrSUVFRTc1NChidWYsdmFsdWUsb2Zmc2V0LDQsMzQwMjgyMzQ2NjM4NTI4ODZlMjIsLTM0MDI4MjM0NjYzODUyODg2ZTIyKX1pZWVlNzU0LndyaXRlKGJ1Zix2YWx1ZSxvZmZzZXQsbGl0dGxlRW5kaWFuLDIzLDQpO3JldHVybiBvZmZzZXQrNH1CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRT1mdW5jdGlvbiB3cml0ZUZsb2F0TEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXtyZXR1cm4gd3JpdGVGbG9hdCh0aGlzLHZhbHVlLG9mZnNldCx0cnVlLG5vQXNzZXJ0KX07QnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkU9ZnVuY3Rpb24gd3JpdGVGbG9hdEJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7cmV0dXJuIHdyaXRlRmxvYXQodGhpcyx2YWx1ZSxvZmZzZXQsZmFsc2Usbm9Bc3NlcnQpfTtmdW5jdGlvbiB3cml0ZURvdWJsZShidWYsdmFsdWUsb2Zmc2V0LGxpdHRsZUVuZGlhbixub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCl7Y2hlY2tJRUVFNzU0KGJ1Zix2YWx1ZSxvZmZzZXQsOCwxNzk3NjkzMTM0ODYyMzE1N2UyOTIsLTE3OTc2OTMxMzQ4NjIzMTU3ZTI5Mil9aWVlZTc1NC53cml0ZShidWYsdmFsdWUsb2Zmc2V0LGxpdHRsZUVuZGlhbiw1Miw4KTtyZXR1cm4gb2Zmc2V0Kzh9QnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFPWZ1bmN0aW9uIHdyaXRlRG91YmxlTEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXtyZXR1cm4gd3JpdGVEb3VibGUodGhpcyx2YWx1ZSxvZmZzZXQsdHJ1ZSxub0Fzc2VydCl9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRT1mdW5jdGlvbiB3cml0ZURvdWJsZUJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7cmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsdmFsdWUsb2Zmc2V0LGZhbHNlLG5vQXNzZXJ0KX07QnVmZmVyLnByb3RvdHlwZS5jb3B5PWZ1bmN0aW9uIGNvcHkodGFyZ2V0LHRhcmdldFN0YXJ0LHN0YXJ0LGVuZCl7aWYoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IHNob3VsZCBiZSBhIEJ1ZmZlciIpO2lmKCFzdGFydClzdGFydD0wO2lmKCFlbmQmJmVuZCE9PTApZW5kPXRoaXMubGVuZ3RoO2lmKHRhcmdldFN0YXJ0Pj10YXJnZXQubGVuZ3RoKXRhcmdldFN0YXJ0PXRhcmdldC5sZW5ndGg7aWYoIXRhcmdldFN0YXJ0KXRhcmdldFN0YXJ0PTA7aWYoZW5kPjAmJmVuZDxzdGFydCllbmQ9c3RhcnQ7aWYoZW5kPT09c3RhcnQpcmV0dXJuIDA7aWYodGFyZ2V0Lmxlbmd0aD09PTB8fHRoaXMubGVuZ3RoPT09MClyZXR1cm4gMDtpZih0YXJnZXRTdGFydDwwKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcigidGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcyIpfWlmKHN0YXJ0PDB8fHN0YXJ0Pj10aGlzLmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiSW5kZXggb3V0IG9mIHJhbmdlIik7aWYoZW5kPDApdGhyb3cgbmV3IFJhbmdlRXJyb3IoInNvdXJjZUVuZCBvdXQgb2YgYm91bmRzIik7aWYoZW5kPnRoaXMubGVuZ3RoKWVuZD10aGlzLmxlbmd0aDtpZih0YXJnZXQubGVuZ3RoLXRhcmdldFN0YXJ0PGVuZC1zdGFydCl7ZW5kPXRhcmdldC5sZW5ndGgtdGFyZ2V0U3RhcnQrc3RhcnR9dmFyIGxlbj1lbmQtc3RhcnQ7aWYodGhpcz09PXRhcmdldCYmdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW49PT0iZnVuY3Rpb24iKXt0aGlzLmNvcHlXaXRoaW4odGFyZ2V0U3RhcnQsc3RhcnQsZW5kKX1lbHNlIGlmKHRoaXM9PT10YXJnZXQmJnN0YXJ0PHRhcmdldFN0YXJ0JiZ0YXJnZXRTdGFydDxlbmQpe2Zvcih2YXIgaT1sZW4tMTtpPj0wOy0taSl7dGFyZ2V0W2krdGFyZ2V0U3RhcnRdPXRoaXNbaStzdGFydF19fWVsc2V7VWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwodGFyZ2V0LHRoaXMuc3ViYXJyYXkoc3RhcnQsZW5kKSx0YXJnZXRTdGFydCl9cmV0dXJuIGxlbn07QnVmZmVyLnByb3RvdHlwZS5maWxsPWZ1bmN0aW9uIGZpbGwodmFsLHN0YXJ0LGVuZCxlbmNvZGluZyl7aWYodHlwZW9mIHZhbD09PSJzdHJpbmciKXtpZih0eXBlb2Ygc3RhcnQ9PT0ic3RyaW5nIil7ZW5jb2Rpbmc9c3RhcnQ7c3RhcnQ9MDtlbmQ9dGhpcy5sZW5ndGh9ZWxzZSBpZih0eXBlb2YgZW5kPT09InN0cmluZyIpe2VuY29kaW5nPWVuZDtlbmQ9dGhpcy5sZW5ndGh9aWYoZW5jb2RpbmchPT11bmRlZmluZWQmJnR5cGVvZiBlbmNvZGluZyE9PSJzdHJpbmciKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nIil9aWYodHlwZW9mIGVuY29kaW5nPT09InN0cmluZyImJiFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpe3Rocm93IG5ldyBUeXBlRXJyb3IoIlVua25vd24gZW5jb2Rpbmc6ICIrZW5jb2RpbmcpfWlmKHZhbC5sZW5ndGg9PT0xKXt2YXIgY29kZT12YWwuY2hhckNvZGVBdCgwKTtpZihlbmNvZGluZz09PSJ1dGY4IiYmY29kZTwxMjh8fGVuY29kaW5nPT09ImxhdGluMSIpe3ZhbD1jb2RlfX19ZWxzZSBpZih0eXBlb2YgdmFsPT09Im51bWJlciIpe3ZhbD12YWwmMjU1fWlmKHN0YXJ0PDB8fHRoaXMubGVuZ3RoPHN0YXJ0fHx0aGlzLmxlbmd0aDxlbmQpe3Rocm93IG5ldyBSYW5nZUVycm9yKCJPdXQgb2YgcmFuZ2UgaW5kZXgiKX1pZihlbmQ8PXN0YXJ0KXtyZXR1cm4gdGhpc31zdGFydD1zdGFydD4+PjA7ZW5kPWVuZD09PXVuZGVmaW5lZD90aGlzLmxlbmd0aDplbmQ+Pj4wO2lmKCF2YWwpdmFsPTA7dmFyIGk7aWYodHlwZW9mIHZhbD09PSJudW1iZXIiKXtmb3IoaT1zdGFydDtpPGVuZDsrK2kpe3RoaXNbaV09dmFsfX1lbHNle3ZhciBieXRlcz1CdWZmZXIuaXNCdWZmZXIodmFsKT92YWw6QnVmZmVyLmZyb20odmFsLGVuY29kaW5nKTt2YXIgbGVuPWJ5dGVzLmxlbmd0aDtpZihsZW49PT0wKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgdmFsdWUgIicrdmFsKyciIGlzIGludmFsaWQgZm9yIGFyZ3VtZW50ICJ2YWx1ZSInKX1mb3IoaT0wO2k8ZW5kLXN0YXJ0OysraSl7dGhpc1tpK3N0YXJ0XT1ieXRlc1tpJWxlbl19fXJldHVybiB0aGlzfTt2YXIgSU5WQUxJRF9CQVNFNjRfUkU9L1teKy8wLTlBLVphLXotX10vZztmdW5jdGlvbiBiYXNlNjRjbGVhbihzdHIpe3N0cj1zdHIuc3BsaXQoIj0iKVswXTtzdHI9c3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCIiKTtpZihzdHIubGVuZ3RoPDIpcmV0dXJuIiI7d2hpbGUoc3RyLmxlbmd0aCU0IT09MCl7c3RyPXN0cisiPSJ9cmV0dXJuIHN0cn1mdW5jdGlvbiB0b0hleChuKXtpZihuPDE2KXJldHVybiIwIituLnRvU3RyaW5nKDE2KTtyZXR1cm4gbi50b1N0cmluZygxNil9ZnVuY3Rpb24gdXRmOFRvQnl0ZXMoc3RyaW5nLHVuaXRzKXt1bml0cz11bml0c3x8SW5maW5pdHk7dmFyIGNvZGVQb2ludDt2YXIgbGVuZ3RoPXN0cmluZy5sZW5ndGg7dmFyIGxlYWRTdXJyb2dhdGU9bnVsbDt2YXIgYnl0ZXM9W107Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXtjb2RlUG9pbnQ9c3RyaW5nLmNoYXJDb2RlQXQoaSk7aWYoY29kZVBvaW50PjU1Mjk1JiZjb2RlUG9pbnQ8NTczNDQpe2lmKCFsZWFkU3Vycm9nYXRlKXtpZihjb2RlUG9pbnQ+NTYzMTkpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSk7Y29udGludWV9ZWxzZSBpZihpKzE9PT1sZW5ndGgpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSk7Y29udGludWV9bGVhZFN1cnJvZ2F0ZT1jb2RlUG9pbnQ7Y29udGludWV9aWYoY29kZVBvaW50PDU2MzIwKXtpZigodW5pdHMtPTMpPi0xKWJ5dGVzLnB1c2goMjM5LDE5MSwxODkpO2xlYWRTdXJyb2dhdGU9Y29kZVBvaW50O2NvbnRpbnVlfWNvZGVQb2ludD0obGVhZFN1cnJvZ2F0ZS01NTI5Njw8MTB8Y29kZVBvaW50LTU2MzIwKSs2NTUzNn1lbHNlIGlmKGxlYWRTdXJyb2dhdGUpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSl9bGVhZFN1cnJvZ2F0ZT1udWxsO2lmKGNvZGVQb2ludDwxMjgpe2lmKCh1bml0cy09MSk8MClicmVhaztieXRlcy5wdXNoKGNvZGVQb2ludCl9ZWxzZSBpZihjb2RlUG9pbnQ8MjA0OCl7aWYoKHVuaXRzLT0yKTwwKWJyZWFrO2J5dGVzLnB1c2goY29kZVBvaW50Pj42fDE5Mixjb2RlUG9pbnQmNjN8MTI4KX1lbHNlIGlmKGNvZGVQb2ludDw2NTUzNil7aWYoKHVuaXRzLT0zKTwwKWJyZWFrO2J5dGVzLnB1c2goY29kZVBvaW50Pj4xMnwyMjQsY29kZVBvaW50Pj42JjYzfDEyOCxjb2RlUG9pbnQmNjN8MTI4KX1lbHNlIGlmKGNvZGVQb2ludDwxMTE0MTEyKXtpZigodW5pdHMtPTQpPDApYnJlYWs7Ynl0ZXMucHVzaChjb2RlUG9pbnQ+PjE4fDI0MCxjb2RlUG9pbnQ+PjEyJjYzfDEyOCxjb2RlUG9pbnQ+PjYmNjN8MTI4LGNvZGVQb2ludCY2M3wxMjgpfWVsc2V7dGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIGNvZGUgcG9pbnQiKX19cmV0dXJuIGJ5dGVzfWZ1bmN0aW9uIGFzY2lpVG9CeXRlcyhzdHIpe3ZhciBieXRlQXJyYXk9W107Zm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoOysraSl7Ynl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkmMjU1KX1yZXR1cm4gYnl0ZUFycmF5fWZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzKHN0cix1bml0cyl7dmFyIGMsaGksbG87dmFyIGJ5dGVBcnJheT1bXTtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXtpZigodW5pdHMtPTIpPDApYnJlYWs7Yz1zdHIuY2hhckNvZGVBdChpKTtoaT1jPj44O2xvPWMlMjU2O2J5dGVBcnJheS5wdXNoKGxvKTtieXRlQXJyYXkucHVzaChoaSl9cmV0dXJuIGJ5dGVBcnJheX1mdW5jdGlvbiBiYXNlNjRUb0J5dGVzKHN0cil7cmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKX1mdW5jdGlvbiBibGl0QnVmZmVyKHNyYyxkc3Qsb2Zmc2V0LGxlbmd0aCl7Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXtpZihpK29mZnNldD49ZHN0Lmxlbmd0aHx8aT49c3JjLmxlbmd0aClicmVhaztkc3RbaStvZmZzZXRdPXNyY1tpXX1yZXR1cm4gaX1mdW5jdGlvbiBpc0luc3RhbmNlKG9iaix0eXBlKXtyZXR1cm4gb2JqIGluc3RhbmNlb2YgdHlwZXx8b2JqIT1udWxsJiZvYmouY29uc3RydWN0b3IhPW51bGwmJm9iai5jb25zdHJ1Y3Rvci5uYW1lIT1udWxsJiZvYmouY29uc3RydWN0b3IubmFtZT09PXR5cGUubmFtZX1mdW5jdGlvbiBudW1iZXJJc05hTihvYmope3JldHVybiBvYmohPT1vYmp9fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiYmFzZTY0LWpzIjoyNCxidWZmZXI6MjcsaWVlZTc1NDozNX1dLDI4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBUcmFuc2Zvcm09cmVxdWlyZSgic3RyZWFtIikuVHJhbnNmb3JtO3ZhciBTdHJpbmdEZWNvZGVyPXJlcXVpcmUoInN0cmluZ19kZWNvZGVyIikuU3RyaW5nRGVjb2Rlcjt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTtmdW5jdGlvbiBDaXBoZXJCYXNlKGhhc2hNb2RlKXtUcmFuc2Zvcm0uY2FsbCh0aGlzKTt0aGlzLmhhc2hNb2RlPXR5cGVvZiBoYXNoTW9kZT09PSJzdHJpbmciO2lmKHRoaXMuaGFzaE1vZGUpe3RoaXNbaGFzaE1vZGVdPXRoaXMuX2ZpbmFsT3JEaWdlc3R9ZWxzZXt0aGlzLmZpbmFsPXRoaXMuX2ZpbmFsT3JEaWdlc3R9aWYodGhpcy5fZmluYWwpe3RoaXMuX19maW5hbD10aGlzLl9maW5hbDt0aGlzLl9maW5hbD1udWxsfXRoaXMuX2RlY29kZXI9bnVsbDt0aGlzLl9lbmNvZGluZz1udWxsfWluaGVyaXRzKENpcGhlckJhc2UsVHJhbnNmb3JtKTtDaXBoZXJCYXNlLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oZGF0YSxpbnB1dEVuYyxvdXRwdXRFbmMpe2lmKHR5cGVvZiBkYXRhPT09InN0cmluZyIpe2RhdGE9QnVmZmVyLmZyb20oZGF0YSxpbnB1dEVuYyl9dmFyIG91dERhdGE9dGhpcy5fdXBkYXRlKGRhdGEpO2lmKHRoaXMuaGFzaE1vZGUpcmV0dXJuIHRoaXM7aWYob3V0cHV0RW5jKXtvdXREYXRhPXRoaXMuX3RvU3RyaW5nKG91dERhdGEsb3V0cHV0RW5jKX1yZXR1cm4gb3V0RGF0YX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuc2V0QXV0b1BhZGRpbmc9ZnVuY3Rpb24oKXt9O0NpcGhlckJhc2UucHJvdG90eXBlLmdldEF1dGhUYWc9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoInRyeWluZyB0byBnZXQgYXV0aCB0YWcgaW4gdW5zdXBwb3J0ZWQgc3RhdGUiKX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuc2V0QXV0aFRhZz1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcigidHJ5aW5nIHRvIHNldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZSIpfTtDaXBoZXJCYXNlLnByb3RvdHlwZS5zZXRBQUQ9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoInRyeWluZyB0byBzZXQgYWFkIGluIHVuc3VwcG9ydGVkIHN0YXRlIil9O0NpcGhlckJhc2UucHJvdG90eXBlLl90cmFuc2Zvcm09ZnVuY3Rpb24oZGF0YSxfLG5leHQpe3ZhciBlcnI7dHJ5e2lmKHRoaXMuaGFzaE1vZGUpe3RoaXMuX3VwZGF0ZShkYXRhKX1lbHNle3RoaXMucHVzaCh0aGlzLl91cGRhdGUoZGF0YSkpfX1jYXRjaChlKXtlcnI9ZX1maW5hbGx5e25leHQoZXJyKX19O0NpcGhlckJhc2UucHJvdG90eXBlLl9mbHVzaD1mdW5jdGlvbihkb25lKXt2YXIgZXJyO3RyeXt0aGlzLnB1c2godGhpcy5fX2ZpbmFsKCkpfWNhdGNoKGUpe2Vycj1lfWRvbmUoZXJyKX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuX2ZpbmFsT3JEaWdlc3Q9ZnVuY3Rpb24ob3V0cHV0RW5jKXt2YXIgb3V0RGF0YT10aGlzLl9fZmluYWwoKXx8QnVmZmVyLmFsbG9jKDApO2lmKG91dHB1dEVuYyl7b3V0RGF0YT10aGlzLl90b1N0cmluZyhvdXREYXRhLG91dHB1dEVuYyx0cnVlKX1yZXR1cm4gb3V0RGF0YX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuX3RvU3RyaW5nPWZ1bmN0aW9uKHZhbHVlLGVuYyxmaW4pe2lmKCF0aGlzLl9kZWNvZGVyKXt0aGlzLl9kZWNvZGVyPW5ldyBTdHJpbmdEZWNvZGVyKGVuYyk7dGhpcy5fZW5jb2Rpbmc9ZW5jfWlmKHRoaXMuX2VuY29kaW5nIT09ZW5jKXRocm93IG5ldyBFcnJvcigiY2FuJ3Qgc3dpdGNoIGVuY29kaW5ncyIpO3ZhciBvdXQ9dGhpcy5fZGVjb2Rlci53cml0ZSh2YWx1ZSk7aWYoZmluKXtvdXQrPXRoaXMuX2RlY29kZXIuZW5kKCl9cmV0dXJuIG91dH07bW9kdWxlLmV4cG9ydHM9Q2lwaGVyQmFzZX0se2luaGVyaXRzOjM2LCJzYWZlLWJ1ZmZlciI6ODIsc3RyZWFtOjEwMSxzdHJpbmdfZGVjb2RlcjoxMDJ9XSwyOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9e09fUkRPTkxZOjAsT19XUk9OTFk6MSxPX1JEV1I6MixTX0lGTVQ6NjE0NDAsU19JRlJFRzozMjc2OCxTX0lGRElSOjE2Mzg0LFNfSUZDSFI6ODE5MixTX0lGQkxLOjI0NTc2LFNfSUZJRk86NDA5NixTX0lGTE5LOjQwOTYwLFNfSUZTT0NLOjQ5MTUyLE9fQ1JFQVQ6NTEyLE9fRVhDTDoyMDQ4LE9fTk9DVFRZOjEzMTA3MixPX1RSVU5DOjEwMjQsT19BUFBFTkQ6OCxPX0RJUkVDVE9SWToxMDQ4NTc2LE9fTk9GT0xMT1c6MjU2LE9fU1lOQzoxMjgsT19TWU1MSU5LOjIwOTcxNTIsT19OT05CTE9DSzo0LFNfSVJXWFU6NDQ4LFNfSVJVU1I6MjU2LFNfSVdVU1I6MTI4LFNfSVhVU1I6NjQsU19JUldYRzo1NixTX0lSR1JQOjMyLFNfSVdHUlA6MTYsU19JWEdSUDo4LFNfSVJXWE86NyxTX0lST1RIOjQsU19JV09USDoyLFNfSVhPVEg6MSxFMkJJRzo3LEVBQ0NFUzoxMyxFQUREUklOVVNFOjQ4LEVBRERSTk9UQVZBSUw6NDksRUFGTk9TVVBQT1JUOjQ3LEVBR0FJTjozNSxFQUxSRUFEWTozNyxFQkFERjo5LEVCQURNU0c6OTQsRUJVU1k6MTYsRUNBTkNFTEVEOjg5LEVDSElMRDoxMCxFQ09OTkFCT1JURUQ6NTMsRUNPTk5SRUZVU0VEOjYxLEVDT05OUkVTRVQ6NTQsRURFQURMSzoxMSxFREVTVEFERFJSRVE6MzksRURPTTozMyxFRFFVT1Q6NjksRUVYSVNUOjE3LEVGQVVMVDoxNCxFRkJJRzoyNyxFSE9TVFVOUkVBQ0g6NjUsRUlEUk06OTAsRUlMU0VROjkyLEVJTlBST0dSRVNTOjM2LEVJTlRSOjQsRUlOVkFMOjIyLEVJTzo1LEVJU0NPTk46NTYsRUlTRElSOjIxLEVMT09QOjYyLEVNRklMRToyNCxFTUxJTks6MzEsRU1TR1NJWkU6NDAsRU1VTFRJSE9QOjk1LEVOQU1FVE9PTE9ORzo2MyxFTkVURE9XTjo1MCxFTkVUUkVTRVQ6NTIsRU5FVFVOUkVBQ0g6NTEsRU5GSUxFOjIzLEVOT0JVRlM6NTUsRU5PREFUQTo5NixFTk9ERVY6MTksRU5PRU5UOjIsRU5PRVhFQzo4LEVOT0xDSzo3NyxFTk9MSU5LOjk3LEVOT01FTToxMixFTk9NU0c6OTEsRU5PUFJPVE9PUFQ6NDIsRU5PU1BDOjI4LEVOT1NSOjk4LEVOT1NUUjo5OSxFTk9TWVM6NzgsRU5PVENPTk46NTcsRU5PVERJUjoyMCxFTk9URU1QVFk6NjYsRU5PVFNPQ0s6MzgsRU5PVFNVUDo0NSxFTk9UVFk6MjUsRU5YSU86NixFT1BOT1RTVVBQOjEwMixFT1ZFUkZMT1c6ODQsRVBFUk06MSxFUElQRTozMixFUFJPVE86MTAwLEVQUk9UT05PU1VQUE9SVDo0MyxFUFJPVE9UWVBFOjQxLEVSQU5HRTozNCxFUk9GUzozMCxFU1BJUEU6MjksRVNSQ0g6MyxFU1RBTEU6NzAsRVRJTUU6MTAxLEVUSU1FRE9VVDo2MCxFVFhUQlNZOjI2LEVXT1VMREJMT0NLOjM1LEVYREVWOjE4LFNJR0hVUDoxLFNJR0lOVDoyLFNJR1FVSVQ6MyxTSUdJTEw6NCxTSUdUUkFQOjUsU0lHQUJSVDo2LFNJR0lPVDo2LFNJR0JVUzoxMCxTSUdGUEU6OCxTSUdLSUxMOjksU0lHVVNSMTozMCxTSUdTRUdWOjExLFNJR1VTUjI6MzEsU0lHUElQRToxMyxTSUdBTFJNOjE0LFNJR1RFUk06MTUsU0lHQ0hMRDoyMCxTSUdDT05UOjE5LFNJR1NUT1A6MTcsU0lHVFNUUDoxOCxTSUdUVElOOjIxLFNJR1RUT1U6MjIsU0lHVVJHOjE2LFNJR1hDUFU6MjQsU0lHWEZTWjoyNSxTSUdWVEFMUk06MjYsU0lHUFJPRjoyNyxTSUdXSU5DSDoyOCxTSUdJTzoyMyxTSUdTWVM6MTIsU1NMX09QX0FMTDoyMTQ3NDg2NzE5LFNTTF9PUF9BTExPV19VTlNBRkVfTEVHQUNZX1JFTkVHT1RJQVRJT046MjYyMTQ0LFNTTF9PUF9DSVBIRVJfU0VSVkVSX1BSRUZFUkVOQ0U6NDE5NDMwNCxTU0xfT1BfQ0lTQ09fQU5ZQ09OTkVDVDozMjc2OCxTU0xfT1BfQ09PS0lFX0VYQ0hBTkdFOjgxOTIsU1NMX09QX0NSWVBUT1BST19UTFNFWFRfQlVHOjIxNDc0ODM2NDgsU1NMX09QX0RPTlRfSU5TRVJUX0VNUFRZX0ZSQUdNRU5UUzoyMDQ4LFNTTF9PUF9FUEhFTUVSQUxfUlNBOjAsU1NMX09QX0xFR0FDWV9TRVJWRVJfQ09OTkVDVDo0LFNTTF9PUF9NSUNST1NPRlRfQklHX1NTTFYzX0JVRkZFUjozMixTU0xfT1BfTUlDUk9TT0ZUX1NFU1NfSURfQlVHOjEsU1NMX09QX01TSUVfU1NMVjJfUlNBX1BBRERJTkc6MCxTU0xfT1BfTkVUU0NBUEVfQ0FfRE5fQlVHOjUzNjg3MDkxMixTU0xfT1BfTkVUU0NBUEVfQ0hBTExFTkdFX0JVRzoyLFNTTF9PUF9ORVRTQ0FQRV9ERU1PX0NJUEhFUl9DSEFOR0VfQlVHOjEwNzM3NDE4MjQsU1NMX09QX05FVFNDQVBFX1JFVVNFX0NJUEhFUl9DSEFOR0VfQlVHOjgsU1NMX09QX05PX0NPTVBSRVNTSU9OOjEzMTA3MixTU0xfT1BfTk9fUVVFUllfTVRVOjQwOTYsU1NMX09QX05PX1NFU1NJT05fUkVTVU1QVElPTl9PTl9SRU5FR09USUFUSU9OOjY1NTM2LFNTTF9PUF9OT19TU0x2MjoxNjc3NzIxNixTU0xfT1BfTk9fU1NMdjM6MzM1NTQ0MzIsU1NMX09QX05PX1RJQ0tFVDoxNjM4NCxTU0xfT1BfTk9fVExTdjE6NjcxMDg4NjQsU1NMX09QX05PX1RMU3YxXzE6MjY4NDM1NDU2LFNTTF9PUF9OT19UTFN2MV8yOjEzNDIxNzcyOCxTU0xfT1BfUEtDUzFfQ0hFQ0tfMTowLFNTTF9PUF9QS0NTMV9DSEVDS18yOjAsU1NMX09QX1NJTkdMRV9ESF9VU0U6MTA0ODU3NixTU0xfT1BfU0lOR0xFX0VDREhfVVNFOjUyNDI4OCxTU0xfT1BfU1NMRUFZXzA4MF9DTElFTlRfREhfQlVHOjEyOCxTU0xfT1BfU1NMUkVGMl9SRVVTRV9DRVJUX1RZUEVfQlVHOjAsU1NMX09QX1RMU19CTE9DS19QQURESU5HX0JVRzo1MTIsU1NMX09QX1RMU19ENV9CVUc6MjU2LFNTTF9PUF9UTFNfUk9MTEJBQ0tfQlVHOjgzODg2MDgsRU5HSU5FX01FVEhPRF9EU0E6MixFTkdJTkVfTUVUSE9EX0RIOjQsRU5HSU5FX01FVEhPRF9SQU5EOjgsRU5HSU5FX01FVEhPRF9FQ0RIOjE2LEVOR0lORV9NRVRIT0RfRUNEU0E6MzIsRU5HSU5FX01FVEhPRF9DSVBIRVJTOjY0LEVOR0lORV9NRVRIT0RfRElHRVNUUzoxMjgsRU5HSU5FX01FVEhPRF9TVE9SRToyNTYsRU5HSU5FX01FVEhPRF9QS0VZX01FVEhTOjUxMixFTkdJTkVfTUVUSE9EX1BLRVlfQVNOMV9NRVRIUzoxMDI0LEVOR0lORV9NRVRIT0RfQUxMOjY1NTM1LEVOR0lORV9NRVRIT0RfTk9ORTowLERIX0NIRUNLX1BfTk9UX1NBRkVfUFJJTUU6MixESF9DSEVDS19QX05PVF9QUklNRToxLERIX1VOQUJMRV9UT19DSEVDS19HRU5FUkFUT1I6NCxESF9OT1RfU1VJVEFCTEVfR0VORVJBVE9SOjgsTlBOX0VOQUJMRUQ6MSxSU0FfUEtDUzFfUEFERElORzoxLFJTQV9TU0xWMjNfUEFERElORzoyLFJTQV9OT19QQURESU5HOjMsUlNBX1BLQ1MxX09BRVBfUEFERElORzo0LFJTQV9YOTMxX1BBRERJTkc6NSxSU0FfUEtDUzFfUFNTX1BBRERJTkc6NixQT0lOVF9DT05WRVJTSU9OX0NPTVBSRVNTRUQ6MixQT0lOVF9DT05WRVJTSU9OX1VOQ09NUFJFU1NFRDo0LFBPSU5UX0NPTlZFUlNJT05fSFlCUklEOjYsRl9PSzowLFJfT0s6NCxXX09LOjIsWF9PSzoxLFVWX1VEUF9SRVVTRUFERFI6NH19LHt9XSwzMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7ZnVuY3Rpb24gaXNBcnJheShhcmcpe2lmKEFycmF5LmlzQXJyYXkpe3JldHVybiBBcnJheS5pc0FycmF5KGFyZyl9cmV0dXJuIG9iamVjdFRvU3RyaW5nKGFyZyk9PT0iW29iamVjdCBBcnJheV0ifWV4cG9ydHMuaXNBcnJheT1pc0FycmF5O2Z1bmN0aW9uIGlzQm9vbGVhbihhcmcpe3JldHVybiB0eXBlb2YgYXJnPT09ImJvb2xlYW4ifWV4cG9ydHMuaXNCb29sZWFuPWlzQm9vbGVhbjtmdW5jdGlvbiBpc051bGwoYXJnKXtyZXR1cm4gYXJnPT09bnVsbH1leHBvcnRzLmlzTnVsbD1pc051bGw7ZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKXtyZXR1cm4gYXJnPT1udWxsfWV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQ9aXNOdWxsT3JVbmRlZmluZWQ7ZnVuY3Rpb24gaXNOdW1iZXIoYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJudW1iZXIifWV4cG9ydHMuaXNOdW1iZXI9aXNOdW1iZXI7ZnVuY3Rpb24gaXNTdHJpbmcoYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJzdHJpbmcifWV4cG9ydHMuaXNTdHJpbmc9aXNTdHJpbmc7ZnVuY3Rpb24gaXNTeW1ib2woYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJzeW1ib2wifWV4cG9ydHMuaXNTeW1ib2w9aXNTeW1ib2w7ZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKXtyZXR1cm4gYXJnPT09dm9pZCAwfWV4cG9ydHMuaXNVbmRlZmluZWQ9aXNVbmRlZmluZWQ7ZnVuY3Rpb24gaXNSZWdFeHAocmUpe3JldHVybiBvYmplY3RUb1N0cmluZyhyZSk9PT0iW29iamVjdCBSZWdFeHBdIn1leHBvcnRzLmlzUmVnRXhwPWlzUmVnRXhwO2Z1bmN0aW9uIGlzT2JqZWN0KGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ib2JqZWN0IiYmYXJnIT09bnVsbH1leHBvcnRzLmlzT2JqZWN0PWlzT2JqZWN0O2Z1bmN0aW9uIGlzRGF0ZShkKXtyZXR1cm4gb2JqZWN0VG9TdHJpbmcoZCk9PT0iW29iamVjdCBEYXRlXSJ9ZXhwb3J0cy5pc0RhdGU9aXNEYXRlO2Z1bmN0aW9uIGlzRXJyb3IoZSl7cmV0dXJuIG9iamVjdFRvU3RyaW5nKGUpPT09IltvYmplY3QgRXJyb3JdInx8ZSBpbnN0YW5jZW9mIEVycm9yfWV4cG9ydHMuaXNFcnJvcj1pc0Vycm9yO2Z1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJmdW5jdGlvbiJ9ZXhwb3J0cy5pc0Z1bmN0aW9uPWlzRnVuY3Rpb247ZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKXtyZXR1cm4gYXJnPT09bnVsbHx8dHlwZW9mIGFyZz09PSJib29sZWFuInx8dHlwZW9mIGFyZz09PSJudW1iZXIifHx0eXBlb2YgYXJnPT09InN0cmluZyJ8fHR5cGVvZiBhcmc9PT0ic3ltYm9sInx8dHlwZW9mIGFyZz09PSJ1bmRlZmluZWQifWV4cG9ydHMuaXNQcmltaXRpdmU9aXNQcmltaXRpdmU7ZXhwb3J0cy5pc0J1ZmZlcj1CdWZmZXIuaXNCdWZmZXI7ZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobyl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKX19KS5jYWxsKHRoaXMse2lzQnVmZmVyOnJlcXVpcmUoIi4uLy4uL2lzLWJ1ZmZlci9pbmRleC5qcyIpfSl9LHsiLi4vLi4vaXMtYnVmZmVyL2luZGV4LmpzIjozN31dLDMxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIE1ENT1yZXF1aXJlKCJtZDUuanMiKTt2YXIgUklQRU1EMTYwPXJlcXVpcmUoInJpcGVtZDE2MCIpO3ZhciBzaGE9cmVxdWlyZSgic2hhLmpzIik7dmFyIEJhc2U9cmVxdWlyZSgiY2lwaGVyLWJhc2UiKTtmdW5jdGlvbiBIYXNoKGhhc2gpe0Jhc2UuY2FsbCh0aGlzLCJkaWdlc3QiKTt0aGlzLl9oYXNoPWhhc2h9aW5oZXJpdHMoSGFzaCxCYXNlKTtIYXNoLnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKGRhdGEpe3RoaXMuX2hhc2gudXBkYXRlKGRhdGEpfTtIYXNoLnByb3RvdHlwZS5fZmluYWw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faGFzaC5kaWdlc3QoKX07bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gY3JlYXRlSGFzaChhbGcpe2FsZz1hbGcudG9Mb3dlckNhc2UoKTtpZihhbGc9PT0ibWQ1IilyZXR1cm4gbmV3IE1ENTtpZihhbGc9PT0icm1kMTYwInx8YWxnPT09InJpcGVtZDE2MCIpcmV0dXJuIG5ldyBSSVBFTUQxNjA7cmV0dXJuIG5ldyBIYXNoKHNoYShhbGcpKX19LHsiY2lwaGVyLWJhc2UiOjI4LGluaGVyaXRzOjM2LCJtZDUuanMiOjM5LHJpcGVtZDE2MDo4MSwic2hhLmpzIjo5NH1dLDMyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgTUQ1PXJlcXVpcmUoIm1kNS5qcyIpO21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKGJ1ZmZlcil7cmV0dXJuKG5ldyBNRDUpLnVwZGF0ZShidWZmZXIpLmRpZ2VzdCgpfX0seyJtZDUuanMiOjM5fV0sMzM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBvYmplY3RDcmVhdGU9T2JqZWN0LmNyZWF0ZXx8b2JqZWN0Q3JlYXRlUG9seWZpbGw7dmFyIG9iamVjdEtleXM9T2JqZWN0LmtleXN8fG9iamVjdEtleXNQb2x5ZmlsbDt2YXIgYmluZD1GdW5jdGlvbi5wcm90b3R5cGUuYmluZHx8ZnVuY3Rpb25CaW5kUG9seWZpbGw7ZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCl7aWYoIXRoaXMuX2V2ZW50c3x8IU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCJfZXZlbnRzIikpe3RoaXMuX2V2ZW50cz1vYmplY3RDcmVhdGUobnVsbCk7dGhpcy5fZXZlbnRzQ291bnQ9MH10aGlzLl9tYXhMaXN0ZW5lcnM9dGhpcy5fbWF4TGlzdGVuZXJzfHx1bmRlZmluZWR9bW9kdWxlLmV4cG9ydHM9RXZlbnRFbWl0dGVyO0V2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXI9RXZlbnRFbWl0dGVyO0V2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cz11bmRlZmluZWQ7RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzPXVuZGVmaW5lZDt2YXIgZGVmYXVsdE1heExpc3RlbmVycz0xMDt2YXIgaGFzRGVmaW5lUHJvcGVydHk7dHJ5e3ZhciBvPXt9O2lmKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSlPYmplY3QuZGVmaW5lUHJvcGVydHkobywieCIse3ZhbHVlOjB9KTtoYXNEZWZpbmVQcm9wZXJ0eT1vLng9PT0wfWNhdGNoKGVycil7aGFzRGVmaW5lUHJvcGVydHk9ZmFsc2V9aWYoaGFzRGVmaW5lUHJvcGVydHkpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIsImRlZmF1bHRNYXhMaXN0ZW5lcnMiLHtlbnVtZXJhYmxlOnRydWUsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnN9LHNldDpmdW5jdGlvbihhcmcpe2lmKHR5cGVvZiBhcmchPT0ibnVtYmVyInx8YXJnPDB8fGFyZyE9PWFyZyl0aHJvdyBuZXcgVHlwZUVycm9yKCciZGVmYXVsdE1heExpc3RlbmVycyIgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO2RlZmF1bHRNYXhMaXN0ZW5lcnM9YXJnfX0pfWVsc2V7RXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM9ZGVmYXVsdE1heExpc3RlbmVyc31FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycz1mdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobil7aWYodHlwZW9mIG4hPT0ibnVtYmVyInx8bjwwfHxpc05hTihuKSl0aHJvdyBuZXcgVHlwZUVycm9yKCcibiIgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO3RoaXMuX21heExpc3RlbmVycz1uO3JldHVybiB0aGlzfTtmdW5jdGlvbiAkZ2V0TWF4TGlzdGVuZXJzKHRoYXQpe2lmKHRoYXQuX21heExpc3RlbmVycz09PXVuZGVmaW5lZClyZXR1cm4gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7cmV0dXJuIHRoYXQuX21heExpc3RlbmVyc31FdmVudEVtaXR0ZXIucHJvdG90eXBlLmdldE1heExpc3RlbmVycz1mdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKXtyZXR1cm4gJGdldE1heExpc3RlbmVycyh0aGlzKX07ZnVuY3Rpb24gZW1pdE5vbmUoaGFuZGxlcixpc0ZuLHNlbGYpe2lmKGlzRm4paGFuZGxlci5jYWxsKHNlbGYpO2Vsc2V7dmFyIGxlbj1oYW5kbGVyLmxlbmd0aDt2YXIgbGlzdGVuZXJzPWFycmF5Q2xvbmUoaGFuZGxlcixsZW4pO2Zvcih2YXIgaT0wO2k8bGVuOysraSlsaXN0ZW5lcnNbaV0uY2FsbChzZWxmKX19ZnVuY3Rpb24gZW1pdE9uZShoYW5kbGVyLGlzRm4sc2VsZixhcmcxKXtpZihpc0ZuKWhhbmRsZXIuY2FsbChzZWxmLGFyZzEpO2Vsc2V7dmFyIGxlbj1oYW5kbGVyLmxlbmd0aDt2YXIgbGlzdGVuZXJzPWFycmF5Q2xvbmUoaGFuZGxlcixsZW4pO2Zvcih2YXIgaT0wO2k8bGVuOysraSlsaXN0ZW5lcnNbaV0uY2FsbChzZWxmLGFyZzEpfX1mdW5jdGlvbiBlbWl0VHdvKGhhbmRsZXIsaXNGbixzZWxmLGFyZzEsYXJnMil7aWYoaXNGbiloYW5kbGVyLmNhbGwoc2VsZixhcmcxLGFyZzIpO2Vsc2V7dmFyIGxlbj1oYW5kbGVyLmxlbmd0aDt2YXIgbGlzdGVuZXJzPWFycmF5Q2xvbmUoaGFuZGxlcixsZW4pO2Zvcih2YXIgaT0wO2k8bGVuOysraSlsaXN0ZW5lcnNbaV0uY2FsbChzZWxmLGFyZzEsYXJnMil9fWZ1bmN0aW9uIGVtaXRUaHJlZShoYW5kbGVyLGlzRm4sc2VsZixhcmcxLGFyZzIsYXJnMyl7aWYoaXNGbiloYW5kbGVyLmNhbGwoc2VsZixhcmcxLGFyZzIsYXJnMyk7ZWxzZXt2YXIgbGVuPWhhbmRsZXIubGVuZ3RoO3ZhciBsaXN0ZW5lcnM9YXJyYXlDbG9uZShoYW5kbGVyLGxlbik7Zm9yKHZhciBpPTA7aTxsZW47KytpKWxpc3RlbmVyc1tpXS5jYWxsKHNlbGYsYXJnMSxhcmcyLGFyZzMpfX1mdW5jdGlvbiBlbWl0TWFueShoYW5kbGVyLGlzRm4sc2VsZixhcmdzKXtpZihpc0ZuKWhhbmRsZXIuYXBwbHkoc2VsZixhcmdzKTtlbHNle3ZhciBsZW49aGFuZGxlci5sZW5ndGg7dmFyIGxpc3RlbmVycz1hcnJheUNsb25lKGhhbmRsZXIsbGVuKTtmb3IodmFyIGk9MDtpPGxlbjsrK2kpbGlzdGVuZXJzW2ldLmFwcGx5KHNlbGYsYXJncyl9fUV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbiBlbWl0KHR5cGUpe3ZhciBlcixoYW5kbGVyLGxlbixhcmdzLGksZXZlbnRzO3ZhciBkb0Vycm9yPXR5cGU9PT0iZXJyb3IiO2V2ZW50cz10aGlzLl9ldmVudHM7aWYoZXZlbnRzKWRvRXJyb3I9ZG9FcnJvciYmZXZlbnRzLmVycm9yPT1udWxsO2Vsc2UgaWYoIWRvRXJyb3IpcmV0dXJuIGZhbHNlO2lmKGRvRXJyb3Ipe2lmKGFyZ3VtZW50cy5sZW5ndGg+MSllcj1hcmd1bWVudHNbMV07aWYoZXIgaW5zdGFuY2VvZiBFcnJvcil7dGhyb3cgZXJ9ZWxzZXt2YXIgZXJyPW5ldyBFcnJvcignVW5oYW5kbGVkICJlcnJvciIgZXZlbnQuICgnK2VyKyIpIik7ZXJyLmNvbnRleHQ9ZXI7dGhyb3cgZXJyfXJldHVybiBmYWxzZX1oYW5kbGVyPWV2ZW50c1t0eXBlXTtpZighaGFuZGxlcilyZXR1cm4gZmFsc2U7dmFyIGlzRm49dHlwZW9mIGhhbmRsZXI9PT0iZnVuY3Rpb24iO2xlbj1hcmd1bWVudHMubGVuZ3RoO3N3aXRjaChsZW4pe2Nhc2UgMTplbWl0Tm9uZShoYW5kbGVyLGlzRm4sdGhpcyk7YnJlYWs7Y2FzZSAyOmVtaXRPbmUoaGFuZGxlcixpc0ZuLHRoaXMsYXJndW1lbnRzWzFdKTticmVhaztjYXNlIDM6ZW1pdFR3byhoYW5kbGVyLGlzRm4sdGhpcyxhcmd1bWVudHNbMV0sYXJndW1lbnRzWzJdKTticmVhaztjYXNlIDQ6ZW1pdFRocmVlKGhhbmRsZXIsaXNGbix0aGlzLGFyZ3VtZW50c1sxXSxhcmd1bWVudHNbMl0sYXJndW1lbnRzWzNdKTticmVhaztkZWZhdWx0OmFyZ3M9bmV3IEFycmF5KGxlbi0xKTtmb3IoaT0xO2k8bGVuO2krKylhcmdzW2ktMV09YXJndW1lbnRzW2ldO2VtaXRNYW55KGhhbmRsZXIsaXNGbix0aGlzLGFyZ3MpfXJldHVybiB0cnVlfTtmdW5jdGlvbiBfYWRkTGlzdGVuZXIodGFyZ2V0LHR5cGUsbGlzdGVuZXIscHJlcGVuZCl7dmFyIG07dmFyIGV2ZW50czt2YXIgZXhpc3Rpbmc7aWYodHlwZW9mIGxpc3RlbmVyIT09ImZ1bmN0aW9uIil0aHJvdyBuZXcgVHlwZUVycm9yKCcibGlzdGVuZXIiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO2V2ZW50cz10YXJnZXQuX2V2ZW50cztpZighZXZlbnRzKXtldmVudHM9dGFyZ2V0Ll9ldmVudHM9b2JqZWN0Q3JlYXRlKG51bGwpO3RhcmdldC5fZXZlbnRzQ291bnQ9MH1lbHNle2lmKGV2ZW50cy5uZXdMaXN0ZW5lcil7dGFyZ2V0LmVtaXQoIm5ld0xpc3RlbmVyIix0eXBlLGxpc3RlbmVyLmxpc3RlbmVyP2xpc3RlbmVyLmxpc3RlbmVyOmxpc3RlbmVyKTtldmVudHM9dGFyZ2V0Ll9ldmVudHN9ZXhpc3Rpbmc9ZXZlbnRzW3R5cGVdfWlmKCFleGlzdGluZyl7ZXhpc3Rpbmc9ZXZlbnRzW3R5cGVdPWxpc3RlbmVyOysrdGFyZ2V0Ll9ldmVudHNDb3VudH1lbHNle2lmKHR5cGVvZiBleGlzdGluZz09PSJmdW5jdGlvbiIpe2V4aXN0aW5nPWV2ZW50c1t0eXBlXT1wcmVwZW5kP1tsaXN0ZW5lcixleGlzdGluZ106W2V4aXN0aW5nLGxpc3RlbmVyXX1lbHNle2lmKHByZXBlbmQpe2V4aXN0aW5nLnVuc2hpZnQobGlzdGVuZXIpfWVsc2V7ZXhpc3RpbmcucHVzaChsaXN0ZW5lcil9fWlmKCFleGlzdGluZy53YXJuZWQpe209JGdldE1heExpc3RlbmVycyh0YXJnZXQpO2lmKG0mJm0+MCYmZXhpc3RpbmcubGVuZ3RoPm0pe2V4aXN0aW5nLndhcm5lZD10cnVlO3ZhciB3PW5ldyBFcnJvcigiUG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrIGRldGVjdGVkLiAiK2V4aXN0aW5nLmxlbmd0aCsnICInK1N0cmluZyh0eXBlKSsnIiBsaXN0ZW5lcnMgJysiYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICIrImluY3JlYXNlIGxpbWl0LiIpO3cubmFtZT0iTWF4TGlzdGVuZXJzRXhjZWVkZWRXYXJuaW5nIjt3LmVtaXR0ZXI9dGFyZ2V0O3cudHlwZT10eXBlO3cuY291bnQ9ZXhpc3RpbmcubGVuZ3RoO2lmKHR5cGVvZiBjb25zb2xlPT09Im9iamVjdCImJmNvbnNvbGUud2Fybil7Y29uc29sZS53YXJuKCIlczogJXMiLHcubmFtZSx3Lm1lc3NhZ2UpfX19fXJldHVybiB0YXJnZXR9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcj1mdW5jdGlvbiBhZGRMaXN0ZW5lcih0eXBlLGxpc3RlbmVyKXtyZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsdHlwZSxsaXN0ZW5lcixmYWxzZSl9O0V2ZW50RW1pdHRlci5wcm90b3R5cGUub249RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtFdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRMaXN0ZW5lcj1mdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSxsaXN0ZW5lcil7cmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLHR5cGUsbGlzdGVuZXIsdHJ1ZSl9O2Z1bmN0aW9uIG9uY2VXcmFwcGVyKCl7aWYoIXRoaXMuZmlyZWQpe3RoaXMudGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHRoaXMudHlwZSx0aGlzLndyYXBGbik7dGhpcy5maXJlZD10cnVlO3N3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtjYXNlIDA6cmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCk7Y2FzZSAxOnJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQsYXJndW1lbnRzWzBdKTtjYXNlIDI6cmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCxhcmd1bWVudHNbMF0sYXJndW1lbnRzWzFdKTtjYXNlIDM6cmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCxhcmd1bWVudHNbMF0sYXJndW1lbnRzWzFdLGFyZ3VtZW50c1syXSk7ZGVmYXVsdDp2YXIgYXJncz1uZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7Zm9yKHZhciBpPTA7aTxhcmdzLmxlbmd0aDsrK2kpYXJnc1tpXT1hcmd1bWVudHNbaV07dGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCxhcmdzKX19fWZ1bmN0aW9uIF9vbmNlV3JhcCh0YXJnZXQsdHlwZSxsaXN0ZW5lcil7dmFyIHN0YXRlPXtmaXJlZDpmYWxzZSx3cmFwRm46dW5kZWZpbmVkLHRhcmdldDp0YXJnZXQsdHlwZTp0eXBlLGxpc3RlbmVyOmxpc3RlbmVyfTt2YXIgd3JhcHBlZD1iaW5kLmNhbGwob25jZVdyYXBwZXIsc3RhdGUpO3dyYXBwZWQubGlzdGVuZXI9bGlzdGVuZXI7c3RhdGUud3JhcEZuPXdyYXBwZWQ7cmV0dXJuIHdyYXBwZWR9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlPWZ1bmN0aW9uIG9uY2UodHlwZSxsaXN0ZW5lcil7aWYodHlwZW9mIGxpc3RlbmVyIT09ImZ1bmN0aW9uIil0aHJvdyBuZXcgVHlwZUVycm9yKCcibGlzdGVuZXIiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO3RoaXMub24odHlwZSxfb25jZVdyYXAodGhpcyx0eXBlLGxpc3RlbmVyKSk7cmV0dXJuIHRoaXN9O0V2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZE9uY2VMaXN0ZW5lcj1mdW5jdGlvbiBwcmVwZW5kT25jZUxpc3RlbmVyKHR5cGUsbGlzdGVuZXIpe2lmKHR5cGVvZiBsaXN0ZW5lciE9PSJmdW5jdGlvbiIpdGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3RlbmVyIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTt0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLF9vbmNlV3JhcCh0aGlzLHR5cGUsbGlzdGVuZXIpKTtyZXR1cm4gdGhpc307RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcj1mdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLGxpc3RlbmVyKXt2YXIgbGlzdCxldmVudHMscG9zaXRpb24saSxvcmlnaW5hbExpc3RlbmVyO2lmKHR5cGVvZiBsaXN0ZW5lciE9PSJmdW5jdGlvbiIpdGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3RlbmVyIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtldmVudHM9dGhpcy5fZXZlbnRzO2lmKCFldmVudHMpcmV0dXJuIHRoaXM7bGlzdD1ldmVudHNbdHlwZV07aWYoIWxpc3QpcmV0dXJuIHRoaXM7aWYobGlzdD09PWxpc3RlbmVyfHxsaXN0Lmxpc3RlbmVyPT09bGlzdGVuZXIpe2lmKC0tdGhpcy5fZXZlbnRzQ291bnQ9PT0wKXRoaXMuX2V2ZW50cz1vYmplY3RDcmVhdGUobnVsbCk7ZWxzZXtkZWxldGUgZXZlbnRzW3R5cGVdO2lmKGV2ZW50cy5yZW1vdmVMaXN0ZW5lcil0aGlzLmVtaXQoInJlbW92ZUxpc3RlbmVyIix0eXBlLGxpc3QubGlzdGVuZXJ8fGxpc3RlbmVyKX19ZWxzZSBpZih0eXBlb2YgbGlzdCE9PSJmdW5jdGlvbiIpe3Bvc2l0aW9uPS0xO2ZvcihpPWxpc3QubGVuZ3RoLTE7aT49MDtpLS0pe2lmKGxpc3RbaV09PT1saXN0ZW5lcnx8bGlzdFtpXS5saXN0ZW5lcj09PWxpc3RlbmVyKXtvcmlnaW5hbExpc3RlbmVyPWxpc3RbaV0ubGlzdGVuZXI7cG9zaXRpb249aTticmVha319aWYocG9zaXRpb248MClyZXR1cm4gdGhpcztpZihwb3NpdGlvbj09PTApbGlzdC5zaGlmdCgpO2Vsc2Ugc3BsaWNlT25lKGxpc3QscG9zaXRpb24pO2lmKGxpc3QubGVuZ3RoPT09MSlldmVudHNbdHlwZV09bGlzdFswXTtpZihldmVudHMucmVtb3ZlTGlzdGVuZXIpdGhpcy5lbWl0KCJyZW1vdmVMaXN0ZW5lciIsdHlwZSxvcmlnaW5hbExpc3RlbmVyfHxsaXN0ZW5lcil9cmV0dXJuIHRoaXN9O0V2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzPWZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyh0eXBlKXt2YXIgbGlzdGVuZXJzLGV2ZW50cyxpO2V2ZW50cz10aGlzLl9ldmVudHM7aWYoIWV2ZW50cylyZXR1cm4gdGhpcztpZighZXZlbnRzLnJlbW92ZUxpc3RlbmVyKXtpZihhcmd1bWVudHMubGVuZ3RoPT09MCl7dGhpcy5fZXZlbnRzPW9iamVjdENyZWF0ZShudWxsKTt0aGlzLl9ldmVudHNDb3VudD0wfWVsc2UgaWYoZXZlbnRzW3R5cGVdKXtpZigtLXRoaXMuX2V2ZW50c0NvdW50PT09MCl0aGlzLl9ldmVudHM9b2JqZWN0Q3JlYXRlKG51bGwpO2Vsc2UgZGVsZXRlIGV2ZW50c1t0eXBlXX1yZXR1cm4gdGhpc31pZihhcmd1bWVudHMubGVuZ3RoPT09MCl7dmFyIGtleXM9b2JqZWN0S2V5cyhldmVudHMpO3ZhciBrZXk7Zm9yKGk9MDtpPGtleXMubGVuZ3RoOysraSl7a2V5PWtleXNbaV07aWYoa2V5PT09InJlbW92ZUxpc3RlbmVyIiljb250aW51ZTt0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpfXRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCJyZW1vdmVMaXN0ZW5lciIpO3RoaXMuX2V2ZW50cz1vYmplY3RDcmVhdGUobnVsbCk7dGhpcy5fZXZlbnRzQ291bnQ9MDtyZXR1cm4gdGhpc31saXN0ZW5lcnM9ZXZlbnRzW3R5cGVdO2lmKHR5cGVvZiBsaXN0ZW5lcnM9PT0iZnVuY3Rpb24iKXt0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsbGlzdGVuZXJzKX1lbHNlIGlmKGxpc3RlbmVycyl7Zm9yKGk9bGlzdGVuZXJzLmxlbmd0aC0xO2k+PTA7aS0tKXt0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsbGlzdGVuZXJzW2ldKX19cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIF9saXN0ZW5lcnModGFyZ2V0LHR5cGUsdW53cmFwKXt2YXIgZXZlbnRzPXRhcmdldC5fZXZlbnRzO2lmKCFldmVudHMpcmV0dXJuW107dmFyIGV2bGlzdGVuZXI9ZXZlbnRzW3R5cGVdO2lmKCFldmxpc3RlbmVyKXJldHVybltdO2lmKHR5cGVvZiBldmxpc3RlbmVyPT09ImZ1bmN0aW9uIilyZXR1cm4gdW53cmFwP1tldmxpc3RlbmVyLmxpc3RlbmVyfHxldmxpc3RlbmVyXTpbZXZsaXN0ZW5lcl07cmV0dXJuIHVud3JhcD91bndyYXBMaXN0ZW5lcnMoZXZsaXN0ZW5lcik6YXJyYXlDbG9uZShldmxpc3RlbmVyLGV2bGlzdGVuZXIubGVuZ3RoKX1FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycz1mdW5jdGlvbiBsaXN0ZW5lcnModHlwZSl7cmV0dXJuIF9saXN0ZW5lcnModGhpcyx0eXBlLHRydWUpfTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycz1mdW5jdGlvbiByYXdMaXN0ZW5lcnModHlwZSl7cmV0dXJuIF9saXN0ZW5lcnModGhpcyx0eXBlLGZhbHNlKX07RXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQ9ZnVuY3Rpb24oZW1pdHRlcix0eXBlKXtpZih0eXBlb2YgZW1pdHRlci5saXN0ZW5lckNvdW50PT09ImZ1bmN0aW9uIil7cmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKX1lbHNle3JldHVybiBsaXN0ZW5lckNvdW50LmNhbGwoZW1pdHRlcix0eXBlKX19O0V2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudD1saXN0ZW5lckNvdW50O2Z1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSl7dmFyIGV2ZW50cz10aGlzLl9ldmVudHM7aWYoZXZlbnRzKXt2YXIgZXZsaXN0ZW5lcj1ldmVudHNbdHlwZV07aWYodHlwZW9mIGV2bGlzdGVuZXI9PT0iZnVuY3Rpb24iKXtyZXR1cm4gMX1lbHNlIGlmKGV2bGlzdGVuZXIpe3JldHVybiBldmxpc3RlbmVyLmxlbmd0aH19cmV0dXJuIDB9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzPWZ1bmN0aW9uIGV2ZW50TmFtZXMoKXtyZXR1cm4gdGhpcy5fZXZlbnRzQ291bnQ+MD9SZWZsZWN0Lm93bktleXModGhpcy5fZXZlbnRzKTpbXX07ZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsaW5kZXgpe2Zvcih2YXIgaT1pbmRleCxrPWkrMSxuPWxpc3QubGVuZ3RoO2s8bjtpKz0xLGsrPTEpbGlzdFtpXT1saXN0W2tdO2xpc3QucG9wKCl9ZnVuY3Rpb24gYXJyYXlDbG9uZShhcnIsbil7dmFyIGNvcHk9bmV3IEFycmF5KG4pO2Zvcih2YXIgaT0wO2k8bjsrK2kpY29weVtpXT1hcnJbaV07cmV0dXJuIGNvcHl9ZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycil7dmFyIHJldD1uZXcgQXJyYXkoYXJyLmxlbmd0aCk7Zm9yKHZhciBpPTA7aTxyZXQubGVuZ3RoOysraSl7cmV0W2ldPWFycltpXS5saXN0ZW5lcnx8YXJyW2ldfXJldHVybiByZXR9ZnVuY3Rpb24gb2JqZWN0Q3JlYXRlUG9seWZpbGwocHJvdG8pe3ZhciBGPWZ1bmN0aW9uKCl7fTtGLnByb3RvdHlwZT1wcm90bztyZXR1cm4gbmV3IEZ9ZnVuY3Rpb24gb2JqZWN0S2V5c1BvbHlmaWxsKG9iail7dmFyIGtleXM9W107Zm9yKHZhciBrIGluIG9iailpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLGspKXtrZXlzLnB1c2goayl9cmV0dXJuIGt9ZnVuY3Rpb24gZnVuY3Rpb25CaW5kUG9seWZpbGwoY29udGV4dCl7dmFyIGZuPXRoaXM7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsYXJndW1lbnRzKX19fSx7fV0sMzQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBUcmFuc2Zvcm09cmVxdWlyZSgic3RyZWFtIikuVHJhbnNmb3JtO3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO2Z1bmN0aW9uIHRocm93SWZOb3RTdHJpbmdPckJ1ZmZlcih2YWwscHJlZml4KXtpZighQnVmZmVyLmlzQnVmZmVyKHZhbCkmJnR5cGVvZiB2YWwhPT0ic3RyaW5nIil7dGhyb3cgbmV3IFR5cGVFcnJvcihwcmVmaXgrIiBtdXN0IGJlIGEgc3RyaW5nIG9yIGEgYnVmZmVyIil9fWZ1bmN0aW9uIEhhc2hCYXNlKGJsb2NrU2l6ZSl7VHJhbnNmb3JtLmNhbGwodGhpcyk7dGhpcy5fYmxvY2s9QnVmZmVyLmFsbG9jVW5zYWZlKGJsb2NrU2l6ZSk7dGhpcy5fYmxvY2tTaXplPWJsb2NrU2l6ZTt0aGlzLl9ibG9ja09mZnNldD0wO3RoaXMuX2xlbmd0aD1bMCwwLDAsMF07dGhpcy5fZmluYWxpemVkPWZhbHNlfWluaGVyaXRzKEhhc2hCYXNlLFRyYW5zZm9ybSk7SGFzaEJhc2UucHJvdG90eXBlLl90cmFuc2Zvcm09ZnVuY3Rpb24oY2h1bmssZW5jb2RpbmcsY2FsbGJhY2spe3ZhciBlcnJvcj1udWxsO3RyeXt0aGlzLnVwZGF0ZShjaHVuayxlbmNvZGluZyl9Y2F0Y2goZXJyKXtlcnJvcj1lcnJ9Y2FsbGJhY2soZXJyb3IpfTtIYXNoQmFzZS5wcm90b3R5cGUuX2ZsdXNoPWZ1bmN0aW9uKGNhbGxiYWNrKXt2YXIgZXJyb3I9bnVsbDt0cnl7dGhpcy5wdXNoKHRoaXMuZGlnZXN0KCkpfWNhdGNoKGVycil7ZXJyb3I9ZXJyfWNhbGxiYWNrKGVycm9yKX07SGFzaEJhc2UucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihkYXRhLGVuY29kaW5nKXt0aHJvd0lmTm90U3RyaW5nT3JCdWZmZXIoZGF0YSwiRGF0YSIpO2lmKHRoaXMuX2ZpbmFsaXplZCl0aHJvdyBuZXcgRXJyb3IoIkRpZ2VzdCBhbHJlYWR5IGNhbGxlZCIpO2lmKCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpZGF0YT1CdWZmZXIuZnJvbShkYXRhLGVuY29kaW5nKTt2YXIgYmxvY2s9dGhpcy5fYmxvY2s7dmFyIG9mZnNldD0wO3doaWxlKHRoaXMuX2Jsb2NrT2Zmc2V0K2RhdGEubGVuZ3RoLW9mZnNldD49dGhpcy5fYmxvY2tTaXplKXtmb3IodmFyIGk9dGhpcy5fYmxvY2tPZmZzZXQ7aTx0aGlzLl9ibG9ja1NpemU7KWJsb2NrW2krK109ZGF0YVtvZmZzZXQrK107dGhpcy5fdXBkYXRlKCk7dGhpcy5fYmxvY2tPZmZzZXQ9MH13aGlsZShvZmZzZXQ8ZGF0YS5sZW5ndGgpYmxvY2tbdGhpcy5fYmxvY2tPZmZzZXQrK109ZGF0YVtvZmZzZXQrK107Zm9yKHZhciBqPTAsY2Fycnk9ZGF0YS5sZW5ndGgqODtjYXJyeT4wOysrail7dGhpcy5fbGVuZ3RoW2pdKz1jYXJyeTtjYXJyeT10aGlzLl9sZW5ndGhbal0vNDI5NDk2NzI5NnwwO2lmKGNhcnJ5PjApdGhpcy5fbGVuZ3RoW2pdLT00Mjk0OTY3Mjk2KmNhcnJ5fXJldHVybiB0aGlzfTtIYXNoQmFzZS5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcigiX3VwZGF0ZSBpcyBub3QgaW1wbGVtZW50ZWQiKX07SGFzaEJhc2UucHJvdG90eXBlLmRpZ2VzdD1mdW5jdGlvbihlbmNvZGluZyl7aWYodGhpcy5fZmluYWxpemVkKXRocm93IG5ldyBFcnJvcigiRGlnZXN0IGFscmVhZHkgY2FsbGVkIik7dGhpcy5fZmluYWxpemVkPXRydWU7dmFyIGRpZ2VzdD10aGlzLl9kaWdlc3QoKTtpZihlbmNvZGluZyE9PXVuZGVmaW5lZClkaWdlc3Q9ZGlnZXN0LnRvU3RyaW5nKGVuY29kaW5nKTt0aGlzLl9ibG9jay5maWxsKDApO3RoaXMuX2Jsb2NrT2Zmc2V0PTA7Zm9yKHZhciBpPTA7aTw0OysraSl0aGlzLl9sZW5ndGhbaV09MDtyZXR1cm4gZGlnZXN0fTtIYXNoQmFzZS5wcm90b3R5cGUuX2RpZ2VzdD1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcigiX2RpZ2VzdCBpcyBub3QgaW1wbGVtZW50ZWQiKX07bW9kdWxlLmV4cG9ydHM9SGFzaEJhc2V9LHtpbmhlcml0czozNiwic2FmZS1idWZmZXIiOjgyLHN0cmVhbToxMDF9XSwzNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7ZXhwb3J0cy5yZWFkPWZ1bmN0aW9uKGJ1ZmZlcixvZmZzZXQsaXNMRSxtTGVuLG5CeXRlcyl7dmFyIGUsbTt2YXIgZUxlbj1uQnl0ZXMqOC1tTGVuLTE7dmFyIGVNYXg9KDE8PGVMZW4pLTE7dmFyIGVCaWFzPWVNYXg+PjE7dmFyIG5CaXRzPS03O3ZhciBpPWlzTEU/bkJ5dGVzLTE6MDt2YXIgZD1pc0xFPy0xOjE7dmFyIHM9YnVmZmVyW29mZnNldCtpXTtpKz1kO2U9cyYoMTw8LW5CaXRzKS0xO3M+Pj0tbkJpdHM7bkJpdHMrPWVMZW47Zm9yKDtuQml0cz4wO2U9ZSoyNTYrYnVmZmVyW29mZnNldCtpXSxpKz1kLG5CaXRzLT04KXt9bT1lJigxPDwtbkJpdHMpLTE7ZT4+PS1uQml0cztuQml0cys9bUxlbjtmb3IoO25CaXRzPjA7bT1tKjI1NitidWZmZXJbb2Zmc2V0K2ldLGkrPWQsbkJpdHMtPTgpe31pZihlPT09MCl7ZT0xLWVCaWFzfWVsc2UgaWYoZT09PWVNYXgpe3JldHVybiBtP05hTjoocz8tMToxKSpJbmZpbml0eX1lbHNle209bStNYXRoLnBvdygyLG1MZW4pO2U9ZS1lQmlhc31yZXR1cm4ocz8tMToxKSptKk1hdGgucG93KDIsZS1tTGVuKX07ZXhwb3J0cy53cml0ZT1mdW5jdGlvbihidWZmZXIsdmFsdWUsb2Zmc2V0LGlzTEUsbUxlbixuQnl0ZXMpe3ZhciBlLG0sYzt2YXIgZUxlbj1uQnl0ZXMqOC1tTGVuLTE7dmFyIGVNYXg9KDE8PGVMZW4pLTE7dmFyIGVCaWFzPWVNYXg+PjE7dmFyIHJ0PW1MZW49PT0yMz9NYXRoLnBvdygyLC0yNCktTWF0aC5wb3coMiwtNzcpOjA7dmFyIGk9aXNMRT8wOm5CeXRlcy0xO3ZhciBkPWlzTEU/MTotMTt2YXIgcz12YWx1ZTwwfHx2YWx1ZT09PTAmJjEvdmFsdWU8MD8xOjA7dmFsdWU9TWF0aC5hYnModmFsdWUpO2lmKGlzTmFOKHZhbHVlKXx8dmFsdWU9PT1JbmZpbml0eSl7bT1pc05hTih2YWx1ZSk/MTowO2U9ZU1heH1lbHNle2U9TWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkvTWF0aC5MTjIpO2lmKHZhbHVlKihjPU1hdGgucG93KDIsLWUpKTwxKXtlLS07Yyo9Mn1pZihlK2VCaWFzPj0xKXt2YWx1ZSs9cnQvY31lbHNle3ZhbHVlKz1ydCpNYXRoLnBvdygyLDEtZUJpYXMpfWlmKHZhbHVlKmM+PTIpe2UrKztjLz0yfWlmKGUrZUJpYXM+PWVNYXgpe209MDtlPWVNYXh9ZWxzZSBpZihlK2VCaWFzPj0xKXttPSh2YWx1ZSpjLTEpKk1hdGgucG93KDIsbUxlbik7ZT1lK2VCaWFzfWVsc2V7bT12YWx1ZSpNYXRoLnBvdygyLGVCaWFzLTEpKk1hdGgucG93KDIsbUxlbik7ZT0wfX1mb3IoO21MZW4+PTg7YnVmZmVyW29mZnNldCtpXT1tJjI1NSxpKz1kLG0vPTI1NixtTGVuLT04KXt9ZT1lPDxtTGVufG07ZUxlbis9bUxlbjtmb3IoO2VMZW4+MDtidWZmZXJbb2Zmc2V0K2ldPWUmMjU1LGkrPWQsZS89MjU2LGVMZW4tPTgpe31idWZmZXJbb2Zmc2V0K2ktZF18PXMqMTI4fX0se31dLDM2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtpZih0eXBlb2YgT2JqZWN0LmNyZWF0ZT09PSJmdW5jdGlvbiIpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGluaGVyaXRzKGN0b3Isc3VwZXJDdG9yKXtpZihzdXBlckN0b3Ipe2N0b3Iuc3VwZXJfPXN1cGVyQ3RvcjtjdG9yLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTpjdG9yLGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZX19KX19fWVsc2V7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaW5oZXJpdHMoY3RvcixzdXBlckN0b3Ipe2lmKHN1cGVyQ3Rvcil7Y3Rvci5zdXBlcl89c3VwZXJDdG9yO3ZhciBUZW1wQ3Rvcj1mdW5jdGlvbigpe307VGVtcEN0b3IucHJvdG90eXBlPXN1cGVyQ3Rvci5wcm90b3R5cGU7Y3Rvci5wcm90b3R5cGU9bmV3IFRlbXBDdG9yO2N0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yPWN0b3J9fX19LHt9XSwzNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24ob2JqKXtyZXR1cm4gb2JqIT1udWxsJiYoaXNCdWZmZXIob2JqKXx8aXNTbG93QnVmZmVyKG9iail8fCEhb2JqLl9pc0J1ZmZlcil9O2Z1bmN0aW9uIGlzQnVmZmVyKG9iail7cmV0dXJuISFvYmouY29uc3RydWN0b3ImJnR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXI9PT0iZnVuY3Rpb24iJiZvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKX1mdW5jdGlvbiBpc1Nsb3dCdWZmZXIob2JqKXtyZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRT09PSJmdW5jdGlvbiImJnR5cGVvZiBvYmouc2xpY2U9PT0iZnVuY3Rpb24iJiZpc0J1ZmZlcihvYmouc2xpY2UoMCwwKSl9fSx7fV0sMzg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciB0b1N0cmluZz17fS50b1N0cmluZzttb2R1bGUuZXhwb3J0cz1BcnJheS5pc0FycmF5fHxmdW5jdGlvbihhcnIpe3JldHVybiB0b1N0cmluZy5jYWxsKGFycik9PSJbb2JqZWN0IEFycmF5XSJ9fSx7fV0sMzk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaEJhc2U9cmVxdWlyZSgiaGFzaC1iYXNlIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgQVJSQVkxNj1uZXcgQXJyYXkoMTYpO2Z1bmN0aW9uIE1ENSgpe0hhc2hCYXNlLmNhbGwodGhpcyw2NCk7dGhpcy5fYT0xNzMyNTg0MTkzO3RoaXMuX2I9NDAyMzIzMzQxNzt0aGlzLl9jPTI1NjIzODMxMDI7dGhpcy5fZD0yNzE3MzM4Nzh9aW5oZXJpdHMoTUQ1LEhhc2hCYXNlKTtNRDUucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oKXt2YXIgTT1BUlJBWTE2O2Zvcih2YXIgaT0wO2k8MTY7KytpKU1baV09dGhpcy5fYmxvY2sucmVhZEludDMyTEUoaSo0KTt2YXIgYT10aGlzLl9hO3ZhciBiPXRoaXMuX2I7dmFyIGM9dGhpcy5fYzt2YXIgZD10aGlzLl9kO2E9Zm5GKGEsYixjLGQsTVswXSwzNjE0MDkwMzYwLDcpO2Q9Zm5GKGQsYSxiLGMsTVsxXSwzOTA1NDAyNzEwLDEyKTtjPWZuRihjLGQsYSxiLE1bMl0sNjA2MTA1ODE5LDE3KTtiPWZuRihiLGMsZCxhLE1bM10sMzI1MDQ0MTk2NiwyMik7YT1mbkYoYSxiLGMsZCxNWzRdLDQxMTg1NDgzOTksNyk7ZD1mbkYoZCxhLGIsYyxNWzVdLDEyMDAwODA0MjYsMTIpO2M9Zm5GKGMsZCxhLGIsTVs2XSwyODIxNzM1OTU1LDE3KTtiPWZuRihiLGMsZCxhLE1bN10sNDI0OTI2MTMxMywyMik7YT1mbkYoYSxiLGMsZCxNWzhdLDE3NzAwMzU0MTYsNyk7ZD1mbkYoZCxhLGIsYyxNWzldLDIzMzY1NTI4NzksMTIpO2M9Zm5GKGMsZCxhLGIsTVsxMF0sNDI5NDkyNTIzMywxNyk7Yj1mbkYoYixjLGQsYSxNWzExXSwyMzA0NTYzMTM0LDIyKTthPWZuRihhLGIsYyxkLE1bMTJdLDE4MDQ2MDM2ODIsNyk7ZD1mbkYoZCxhLGIsYyxNWzEzXSw0MjU0NjI2MTk1LDEyKTtjPWZuRihjLGQsYSxiLE1bMTRdLDI3OTI5NjUwMDYsMTcpO2I9Zm5GKGIsYyxkLGEsTVsxNV0sMTIzNjUzNTMyOSwyMik7YT1mbkcoYSxiLGMsZCxNWzFdLDQxMjkxNzA3ODYsNSk7ZD1mbkcoZCxhLGIsYyxNWzZdLDMyMjU0NjU2NjQsOSk7Yz1mbkcoYyxkLGEsYixNWzExXSw2NDM3MTc3MTMsMTQpO2I9Zm5HKGIsYyxkLGEsTVswXSwzOTIxMDY5OTk0LDIwKTthPWZuRyhhLGIsYyxkLE1bNV0sMzU5MzQwODYwNSw1KTtkPWZuRyhkLGEsYixjLE1bMTBdLDM4MDE2MDgzLDkpO2M9Zm5HKGMsZCxhLGIsTVsxNV0sMzYzNDQ4ODk2MSwxNCk7Yj1mbkcoYixjLGQsYSxNWzRdLDM4ODk0Mjk0NDgsMjApO2E9Zm5HKGEsYixjLGQsTVs5XSw1Njg0NDY0MzgsNSk7ZD1mbkcoZCxhLGIsYyxNWzE0XSwzMjc1MTYzNjA2LDkpO2M9Zm5HKGMsZCxhLGIsTVszXSw0MTA3NjAzMzM1LDE0KTtiPWZuRyhiLGMsZCxhLE1bOF0sMTE2MzUzMTUwMSwyMCk7YT1mbkcoYSxiLGMsZCxNWzEzXSwyODUwMjg1ODI5LDUpO2Q9Zm5HKGQsYSxiLGMsTVsyXSw0MjQzNTYzNTEyLDkpO2M9Zm5HKGMsZCxhLGIsTVs3XSwxNzM1MzI4NDczLDE0KTtiPWZuRyhiLGMsZCxhLE1bMTJdLDIzNjgzNTk1NjIsMjApO2E9Zm5IKGEsYixjLGQsTVs1XSw0Mjk0NTg4NzM4LDQpO2Q9Zm5IKGQsYSxiLGMsTVs4XSwyMjcyMzkyODMzLDExKTtjPWZuSChjLGQsYSxiLE1bMTFdLDE4MzkwMzA1NjIsMTYpO2I9Zm5IKGIsYyxkLGEsTVsxNF0sNDI1OTY1Nzc0MCwyMyk7YT1mbkgoYSxiLGMsZCxNWzFdLDI3NjM5NzUyMzYsNCk7ZD1mbkgoZCxhLGIsYyxNWzRdLDEyNzI4OTMzNTMsMTEpO2M9Zm5IKGMsZCxhLGIsTVs3XSw0MTM5NDY5NjY0LDE2KTtiPWZuSChiLGMsZCxhLE1bMTBdLDMyMDAyMzY2NTYsMjMpO2E9Zm5IKGEsYixjLGQsTVsxM10sNjgxMjc5MTc0LDQpO2Q9Zm5IKGQsYSxiLGMsTVswXSwzOTM2NDMwMDc0LDExKTtjPWZuSChjLGQsYSxiLE1bM10sMzU3MjQ0NTMxNywxNik7Yj1mbkgoYixjLGQsYSxNWzZdLDc2MDI5MTg5LDIzKTthPWZuSChhLGIsYyxkLE1bOV0sMzY1NDYwMjgwOSw0KTtkPWZuSChkLGEsYixjLE1bMTJdLDM4NzMxNTE0NjEsMTEpO2M9Zm5IKGMsZCxhLGIsTVsxNV0sNTMwNzQyNTIwLDE2KTtiPWZuSChiLGMsZCxhLE1bMl0sMzI5OTYyODY0NSwyMyk7YT1mbkkoYSxiLGMsZCxNWzBdLDQwOTYzMzY0NTIsNik7ZD1mbkkoZCxhLGIsYyxNWzddLDExMjY4OTE0MTUsMTApO2M9Zm5JKGMsZCxhLGIsTVsxNF0sMjg3ODYxMjM5MSwxNSk7Yj1mbkkoYixjLGQsYSxNWzVdLDQyMzc1MzMyNDEsMjEpO2E9Zm5JKGEsYixjLGQsTVsxMl0sMTcwMDQ4NTU3MSw2KTtkPWZuSShkLGEsYixjLE1bM10sMjM5OTk4MDY5MCwxMCk7Yz1mbkkoYyxkLGEsYixNWzEwXSw0MjkzOTE1NzczLDE1KTtiPWZuSShiLGMsZCxhLE1bMV0sMjI0MDA0NDQ5NywyMSk7YT1mbkkoYSxiLGMsZCxNWzhdLDE4NzMzMTMzNTksNik7ZD1mbkkoZCxhLGIsYyxNWzE1XSw0MjY0MzU1NTUyLDEwKTtjPWZuSShjLGQsYSxiLE1bNl0sMjczNDc2ODkxNiwxNSk7Yj1mbkkoYixjLGQsYSxNWzEzXSwxMzA5MTUxNjQ5LDIxKTthPWZuSShhLGIsYyxkLE1bNF0sNDE0OTQ0NDIyNiw2KTtkPWZuSShkLGEsYixjLE1bMTFdLDMxNzQ3NTY5MTcsMTApO2M9Zm5JKGMsZCxhLGIsTVsyXSw3MTg3ODcyNTksMTUpO2I9Zm5JKGIsYyxkLGEsTVs5XSwzOTUxNDgxNzQ1LDIxKTt0aGlzLl9hPXRoaXMuX2ErYXwwO3RoaXMuX2I9dGhpcy5fYitifDA7dGhpcy5fYz10aGlzLl9jK2N8MDt0aGlzLl9kPXRoaXMuX2QrZHwwfTtNRDUucHJvdG90eXBlLl9kaWdlc3Q9ZnVuY3Rpb24oKXt0aGlzLl9ibG9ja1t0aGlzLl9ibG9ja09mZnNldCsrXT0xMjg7aWYodGhpcy5fYmxvY2tPZmZzZXQ+NTYpe3RoaXMuX2Jsb2NrLmZpbGwoMCx0aGlzLl9ibG9ja09mZnNldCw2NCk7dGhpcy5fdXBkYXRlKCk7dGhpcy5fYmxvY2tPZmZzZXQ9MH10aGlzLl9ibG9jay5maWxsKDAsdGhpcy5fYmxvY2tPZmZzZXQsNTYpO3RoaXMuX2Jsb2NrLndyaXRlVUludDMyTEUodGhpcy5fbGVuZ3RoWzBdLDU2KTt0aGlzLl9ibG9jay53cml0ZVVJbnQzMkxFKHRoaXMuX2xlbmd0aFsxXSw2MCk7dGhpcy5fdXBkYXRlKCk7dmFyIGJ1ZmZlcj1CdWZmZXIuYWxsb2NVbnNhZmUoMTYpO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fYSwwKTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2IsNCk7YnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9jLDgpO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fZCwxMik7cmV0dXJuIGJ1ZmZlcn07ZnVuY3Rpb24gcm90bCh4LG4pe3JldHVybiB4PDxufHg+Pj4zMi1ufWZ1bmN0aW9uIGZuRihhLGIsYyxkLG0sayxzKXtyZXR1cm4gcm90bChhKyhiJmN8fmImZCkrbStrfDAscykrYnwwfWZ1bmN0aW9uIGZuRyhhLGIsYyxkLG0sayxzKXtyZXR1cm4gcm90bChhKyhiJmR8YyZ+ZCkrbStrfDAscykrYnwwfWZ1bmN0aW9uIGZuSChhLGIsYyxkLG0sayxzKXtyZXR1cm4gcm90bChhKyhiXmNeZCkrbStrfDAscykrYnwwfWZ1bmN0aW9uIGZuSShhLGIsYyxkLG0sayxzKXtyZXR1cm4gcm90bChhKyhjXihifH5kKSkrbStrfDAscykrYnwwfW1vZHVsZS5leHBvcnRzPU1ENX0seyJoYXNoLWJhc2UiOjM0LGluaGVyaXRzOjM2LCJzYWZlLWJ1ZmZlciI6ODJ9XSw0MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7aWYoIUFycmF5QnVmZmVyWyJpc1ZpZXciXSl7QXJyYXlCdWZmZXIuaXNWaWV3PWZ1bmN0aW9uIGlzVmlldyhhKXtyZXR1cm4gYSE9PW51bGwmJnR5cGVvZiBhPT09Im9iamVjdCImJmFbImJ1ZmZlciJdaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcn19fSx7fV0sNDE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0IjtleHBvcnRzLl9fZXNNb2R1bGU9dHJ1ZTt2YXIgTGlnaHRNYXBJbXBsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gTGlnaHRNYXBJbXBsKCl7dGhpcy5yZWNvcmQ9W119TGlnaHRNYXBJbXBsLnByb3RvdHlwZS5oYXM9ZnVuY3Rpb24oa2V5KXtyZXR1cm4gdGhpcy5yZWNvcmQubWFwKGZ1bmN0aW9uKF9hKXt2YXIgX2tleT1fYVswXTtyZXR1cm4gX2tleX0pLmluZGV4T2Yoa2V5KT49MH07TGlnaHRNYXBJbXBsLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oa2V5KXt2YXIgZW50cnk9dGhpcy5yZWNvcmQuZmlsdGVyKGZ1bmN0aW9uKF9hKXt2YXIgX2tleT1fYVswXTtyZXR1cm4gX2tleT09PWtleX0pWzBdO2lmKGVudHJ5PT09dW5kZWZpbmVkKXtyZXR1cm4gdW5kZWZpbmVkfXJldHVybiBlbnRyeVsxXX07TGlnaHRNYXBJbXBsLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oa2V5LHZhbHVlKXt2YXIgZW50cnk9dGhpcy5yZWNvcmQuZmlsdGVyKGZ1bmN0aW9uKF9hKXt2YXIgX2tleT1fYVswXTtyZXR1cm4gX2tleT09PWtleX0pWzBdO2lmKGVudHJ5PT09dW5kZWZpbmVkKXt0aGlzLnJlY29yZC5wdXNoKFtrZXksdmFsdWVdKX1lbHNle2VudHJ5WzFdPXZhbHVlfXJldHVybiB0aGlzfTtMaWdodE1hcEltcGwucHJvdG90eXBlWyJkZWxldGUiXT1mdW5jdGlvbihrZXkpe3ZhciBpbmRleD10aGlzLnJlY29yZC5tYXAoZnVuY3Rpb24oX2Epe3ZhciBrZXk9X2FbMF07cmV0dXJuIGtleX0pLmluZGV4T2Yoa2V5KTtpZihpbmRleDwwKXtyZXR1cm4gZmFsc2V9dGhpcy5yZWNvcmQuc3BsaWNlKGluZGV4LDEpO3JldHVybiB0cnVlfTtMaWdodE1hcEltcGwucHJvdG90eXBlLmtleXM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZWNvcmQubWFwKGZ1bmN0aW9uKF9hKXt2YXIga2V5PV9hWzBdO3JldHVybiBrZXl9KX07cmV0dXJuIExpZ2h0TWFwSW1wbH0oKTtleHBvcnRzLlBvbHlmaWxsPXR5cGVvZiBNYXAhPT0idW5kZWZpbmVkIj9NYXA6TGlnaHRNYXBJbXBsfSx7fV0sNDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBjb25zdGFudHM9cmVxdWlyZSgiY29uc3RhbnRzIik7dmFyIHJzYT1yZXF1aXJlKCIuL2xpYnMvcnNhLmpzIik7dmFyIF89cmVxdWlyZSgiLi91dGlscyIpLl87dmFyIHV0aWxzPXJlcXVpcmUoIi4vdXRpbHMiKTt2YXIgc2NoZW1lcz1yZXF1aXJlKCIuL3NjaGVtZXMvc2NoZW1lcy5qcyIpO3ZhciBmb3JtYXRzPXJlcXVpcmUoIi4vZm9ybWF0cy9mb3JtYXRzLmpzIik7dmFyIHNlZWRyYW5kb209cmVxdWlyZSgic2VlZHJhbmRvbSIpO2lmKHR5cGVvZiBjb25zdGFudHMuUlNBX05PX1BBRERJTkc9PT0idW5kZWZpbmVkIil7Y29uc3RhbnRzLlJTQV9OT19QQURESU5HPTN9bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24oKXt2YXIgU1VQUE9SVEVEX0hBU0hfQUxHT1JJVEhNUz17bm9kZTEwOlsibWQ0IiwibWQ1IiwicmlwZW1kMTYwIiwic2hhMSIsInNoYTIyNCIsInNoYTI1NiIsInNoYTM4NCIsInNoYTUxMiJdLG5vZGU6WyJtZDQiLCJtZDUiLCJyaXBlbWQxNjAiLCJzaGExIiwic2hhMjI0Iiwic2hhMjU2Iiwic2hhMzg0Iiwic2hhNTEyIl0saW9qczpbIm1kNCIsIm1kNSIsInJpcGVtZDE2MCIsInNoYTEiLCJzaGEyMjQiLCJzaGEyNTYiLCJzaGEzODQiLCJzaGE1MTIiXSxicm93c2VyOlsibWQ1IiwicmlwZW1kMTYwIiwic2hhMSIsInNoYTI1NiIsInNoYTUxMiJdfTt2YXIgREVGQVVMVF9FTkNSWVBUSU9OX1NDSEVNRT0icGtjczFfb2FlcCI7dmFyIERFRkFVTFRfU0lHTklOR19TQ0hFTUU9InBrY3MxIjt2YXIgREVGQVVMVF9FWFBPUlRfRk9STUFUPSJwcml2YXRlIjt2YXIgRVhQT1JUX0ZPUk1BVF9BTElBU0VTPXtwcml2YXRlOiJwa2NzMS1wcml2YXRlLXBlbSIsInByaXZhdGUtZGVyIjoicGtjczEtcHJpdmF0ZS1kZXIiLHB1YmxpYzoicGtjczgtcHVibGljLXBlbSIsInB1YmxpYy1kZXIiOiJwa2NzOC1wdWJsaWMtZGVyIn07ZnVuY3Rpb24gTm9kZVJTQShrZXksZm9ybWF0LG9wdGlvbnMpe2lmKCEodGhpcyBpbnN0YW5jZW9mIE5vZGVSU0EpKXtyZXR1cm4gbmV3IE5vZGVSU0Eoa2V5LGZvcm1hdCxvcHRpb25zKX1pZihfLmlzT2JqZWN0KGZvcm1hdCkpe29wdGlvbnM9Zm9ybWF0O2Zvcm1hdD11bmRlZmluZWR9dGhpcy4kb3B0aW9ucz17c2lnbmluZ1NjaGVtZTpERUZBVUxUX1NJR05JTkdfU0NIRU1FLHNpZ25pbmdTY2hlbWVPcHRpb25zOntoYXNoOiJzaGEyNTYiLHNhbHRMZW5ndGg6bnVsbH0sZW5jcnlwdGlvblNjaGVtZTpERUZBVUxUX0VOQ1JZUFRJT05fU0NIRU1FLGVuY3J5cHRpb25TY2hlbWVPcHRpb25zOntoYXNoOiJzaGExIixsYWJlbDpudWxsfSxlbnZpcm9ubWVudDp1dGlscy5kZXRlY3RFbnZpcm9ubWVudCgpLHJzYVV0aWxzOnRoaXN9O3RoaXMua2V5UGFpcj1uZXcgcnNhLktleTt0aGlzLiRjYWNoZT17fTtpZihCdWZmZXIuaXNCdWZmZXIoa2V5KXx8Xy5pc1N0cmluZyhrZXkpKXt0aGlzLmltcG9ydEtleShrZXksZm9ybWF0KX1lbHNlIGlmKF8uaXNPYmplY3Qoa2V5KSl7dGhpcy5nZW5lcmF0ZUtleVBhaXIoa2V5LmIsa2V5LmUpfXRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKX1Ob2RlUlNBLmdlbmVyYXRlS2V5UGFpckZyb21TZWVkPWZ1bmN0aW9uIGdlbmVyYXRlS2V5UGFpckZyb21TZWVkKHNlZWQsYml0cyxleHAsZW52aXJvbm1lbnQpe3ZhciByYW5kb21CYWNrdXA9TWF0aC5yYW5kb207aWYoc2VlZCE9PW51bGwpe01hdGgucmFuZG9tPWZ1bmN0aW9uKCl7dmFyIHByZXY9dW5kZWZpbmVkO2Z1bmN0aW9uIHJhbmRvbSgpe3ByZXY9c2VlZHJhbmRvbShwcmV2PT09dW5kZWZpbmVkP0J1ZmZlci5mcm9tKHNlZWQuYnVmZmVyLHNlZWQuYnl0ZU9mZnNldCxzZWVkLmxlbmd0aCkudG9TdHJpbmcoImhleCIpOnByZXYudG9GaXhlZCgxMikse2dsb2JhbDpmYWxzZX0pLnF1aWNrKCk7cmV0dXJuIHByZXZ9cmFuZG9tLmlzU2VlZGVkPXRydWU7cmV0dXJuIHJhbmRvbX0oKX12YXIgb3B0aW9ucz11bmRlZmluZWQ7aWYoZW52aXJvbm1lbnQhPT11bmRlZmluZWQpe29wdGlvbnM9e2Vudmlyb25tZW50OmVudmlyb25tZW50fX12YXIgbm9kZVJTQT1uZXcgTm9kZVJTQSh1bmRlZmluZWQsdW5kZWZpbmVkLG9wdGlvbnMpO25vZGVSU0EuZ2VuZXJhdGVLZXlQYWlyKGJpdHMsZXhwKTtNYXRoLnJhbmRvbT1yYW5kb21CYWNrdXA7cmV0dXJuIG5vZGVSU0F9O05vZGVSU0EucHJvdG90eXBlLnNldE9wdGlvbnM9ZnVuY3Rpb24ob3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTtpZihvcHRpb25zLmVudmlyb25tZW50KXt0aGlzLiRvcHRpb25zLmVudmlyb25tZW50PW9wdGlvbnMuZW52aXJvbm1lbnR9aWYob3B0aW9ucy5zaWduaW5nU2NoZW1lKXtpZihfLmlzU3RyaW5nKG9wdGlvbnMuc2lnbmluZ1NjaGVtZSkpe3ZhciBzaWduaW5nU2NoZW1lPW9wdGlvbnMuc2lnbmluZ1NjaGVtZS50b0xvd2VyQ2FzZSgpLnNwbGl0KCItIik7aWYoc2lnbmluZ1NjaGVtZS5sZW5ndGg9PTEpe2lmKFNVUFBPUlRFRF9IQVNIX0FMR09SSVRITVMubm9kZS5pbmRleE9mKHNpZ25pbmdTY2hlbWVbMF0pPi0xKXt0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zPXtoYXNoOnNpZ25pbmdTY2hlbWVbMF19O3RoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZT1ERUZBVUxUX1NJR05JTkdfU0NIRU1FfWVsc2V7dGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lPXNpZ25pbmdTY2hlbWVbMF07dGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucz17aGFzaDpudWxsfX19ZWxzZXt0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zPXtoYXNoOnNpZ25pbmdTY2hlbWVbMV19O3RoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZT1zaWduaW5nU2NoZW1lWzBdfX1lbHNlIGlmKF8uaXNPYmplY3Qob3B0aW9ucy5zaWduaW5nU2NoZW1lKSl7dGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lPW9wdGlvbnMuc2lnbmluZ1NjaGVtZS5zY2hlbWV8fERFRkFVTFRfU0lHTklOR19TQ0hFTUU7dGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucz1fLm9taXQob3B0aW9ucy5zaWduaW5nU2NoZW1lLCJzY2hlbWUiKX1pZighc2NoZW1lcy5pc1NpZ25hdHVyZSh0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWUpKXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQgc2lnbmluZyBzY2hlbWUiKX1pZih0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLmhhc2gmJlNVUFBPUlRFRF9IQVNIX0FMR09SSVRITVNbdGhpcy4kb3B0aW9ucy5lbnZpcm9ubWVudF0uaW5kZXhPZih0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLmhhc2gpPT09LTEpe3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBoYXNoaW5nIGFsZ29yaXRobSBmb3IgIit0aGlzLiRvcHRpb25zLmVudmlyb25tZW50KyIgZW52aXJvbm1lbnQiKX19aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lKXtpZihfLmlzU3RyaW5nKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZSkpe3RoaXMuJG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZT1vcHRpb25zLmVuY3J5cHRpb25TY2hlbWUudG9Mb3dlckNhc2UoKTt0aGlzLiRvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zPXt9fWVsc2UgaWYoXy5pc09iamVjdChvcHRpb25zLmVuY3J5cHRpb25TY2hlbWUpKXt0aGlzLiRvcHRpb25zLmVuY3J5cHRpb25TY2hlbWU9b3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lLnNjaGVtZXx8REVGQVVMVF9FTkNSWVBUSU9OX1NDSEVNRTt0aGlzLiRvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zPV8ub21pdChvcHRpb25zLmVuY3J5cHRpb25TY2hlbWUsInNjaGVtZSIpfWlmKCFzY2hlbWVzLmlzRW5jcnlwdGlvbih0aGlzLiRvcHRpb25zLmVuY3J5cHRpb25TY2hlbWUpKXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQgZW5jcnlwdGlvbiBzY2hlbWUiKX1pZih0aGlzLiRvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLmhhc2gmJlNVUFBPUlRFRF9IQVNIX0FMR09SSVRITVNbdGhpcy4kb3B0aW9ucy5lbnZpcm9ubWVudF0uaW5kZXhPZih0aGlzLiRvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLmhhc2gpPT09LTEpe3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBoYXNoaW5nIGFsZ29yaXRobSBmb3IgIit0aGlzLiRvcHRpb25zLmVudmlyb25tZW50KyIgZW52aXJvbm1lbnQiKX19dGhpcy5rZXlQYWlyLnNldE9wdGlvbnModGhpcy4kb3B0aW9ucyl9O05vZGVSU0EucHJvdG90eXBlLmdlbmVyYXRlS2V5UGFpcj1mdW5jdGlvbihiaXRzLGV4cCl7Yml0cz1iaXRzfHwyMDQ4O2V4cD1leHB8fDY1NTM3O2lmKGJpdHMlOCE9PTApe3Rocm93IEVycm9yKCJLZXkgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgOC4iKX10aGlzLmtleVBhaXIuZ2VuZXJhdGUoYml0cyxleHAudG9TdHJpbmcoMTYpKTt0aGlzLiRjYWNoZT17fTtyZXR1cm4gdGhpc307Tm9kZVJTQS5wcm90b3R5cGUuaW1wb3J0S2V5PWZ1bmN0aW9uKGtleURhdGEsZm9ybWF0KXtpZigha2V5RGF0YSl7dGhyb3cgRXJyb3IoIkVtcHR5IGtleSBnaXZlbiIpfWlmKGZvcm1hdCl7Zm9ybWF0PUVYUE9SVF9GT1JNQVRfQUxJQVNFU1tmb3JtYXRdfHxmb3JtYXR9aWYoIWZvcm1hdHMuZGV0ZWN0QW5kSW1wb3J0KHRoaXMua2V5UGFpcixrZXlEYXRhLGZvcm1hdCkmJmZvcm1hdD09PXVuZGVmaW5lZCl7dGhyb3cgRXJyb3IoIktleSBmb3JtYXQgbXVzdCBiZSBzcGVjaWZpZWQiKX10aGlzLiRjYWNoZT17fTtyZXR1cm4gdGhpc307Tm9kZVJTQS5wcm90b3R5cGUuZXhwb3J0S2V5PWZ1bmN0aW9uKGZvcm1hdCl7Zm9ybWF0PWZvcm1hdHx8REVGQVVMVF9FWFBPUlRfRk9STUFUO2Zvcm1hdD1FWFBPUlRfRk9STUFUX0FMSUFTRVNbZm9ybWF0XXx8Zm9ybWF0O2lmKCF0aGlzLiRjYWNoZVtmb3JtYXRdKXt0aGlzLiRjYWNoZVtmb3JtYXRdPWZvcm1hdHMuZGV0ZWN0QW5kRXhwb3J0KHRoaXMua2V5UGFpcixmb3JtYXQpfXJldHVybiB0aGlzLiRjYWNoZVtmb3JtYXRdfTtOb2RlUlNBLnByb3RvdHlwZS5pc1ByaXZhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5rZXlQYWlyLmlzUHJpdmF0ZSgpfTtOb2RlUlNBLnByb3RvdHlwZS5pc1B1YmxpYz1mdW5jdGlvbihzdHJpY3Qpe3JldHVybiB0aGlzLmtleVBhaXIuaXNQdWJsaWMoc3RyaWN0KX07Tm9kZVJTQS5wcm90b3R5cGUuaXNFbXB0eT1mdW5jdGlvbihzdHJpY3Qpe3JldHVybiEodGhpcy5rZXlQYWlyLm58fHRoaXMua2V5UGFpci5lfHx0aGlzLmtleVBhaXIuZCl9O05vZGVSU0EucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24oYnVmZmVyLGVuY29kaW5nLHNvdXJjZV9lbmNvZGluZyl7cmV0dXJuIHRoaXMuJCRlbmNyeXB0S2V5KGZhbHNlLGJ1ZmZlcixlbmNvZGluZyxzb3VyY2VfZW5jb2RpbmcpfTtOb2RlUlNBLnByb3RvdHlwZS5kZWNyeXB0PWZ1bmN0aW9uKGJ1ZmZlcixlbmNvZGluZyl7cmV0dXJuIHRoaXMuJCRkZWNyeXB0S2V5KGZhbHNlLGJ1ZmZlcixlbmNvZGluZyl9O05vZGVSU0EucHJvdG90eXBlLmVuY3J5cHRQcml2YXRlPWZ1bmN0aW9uKGJ1ZmZlcixlbmNvZGluZyxzb3VyY2VfZW5jb2Rpbmcpe3JldHVybiB0aGlzLiQkZW5jcnlwdEtleSh0cnVlLGJ1ZmZlcixlbmNvZGluZyxzb3VyY2VfZW5jb2RpbmcpfTtOb2RlUlNBLnByb3RvdHlwZS5kZWNyeXB0UHVibGljPWZ1bmN0aW9uKGJ1ZmZlcixlbmNvZGluZyl7cmV0dXJuIHRoaXMuJCRkZWNyeXB0S2V5KHRydWUsYnVmZmVyLGVuY29kaW5nKX07Tm9kZVJTQS5wcm90b3R5cGUuJCRlbmNyeXB0S2V5PWZ1bmN0aW9uKHVzZVByaXZhdGUsYnVmZmVyLGVuY29kaW5nLHNvdXJjZV9lbmNvZGluZyl7dHJ5e3ZhciByZXM9dGhpcy5rZXlQYWlyLmVuY3J5cHQodGhpcy4kZ2V0RGF0YUZvckVuY3J5cHQoYnVmZmVyLHNvdXJjZV9lbmNvZGluZyksdXNlUHJpdmF0ZSk7aWYoZW5jb2Rpbmc9PSJidWZmZXIifHwhZW5jb2Rpbmcpe3JldHVybiByZXN9ZWxzZXtyZXR1cm4gcmVzLnRvU3RyaW5nKGVuY29kaW5nKX19Y2F0Y2goZSl7dGhyb3cgRXJyb3IoIkVycm9yIGR1cmluZyBlbmNyeXB0aW9uLiBPcmlnaW5hbCBlcnJvcjogIitlLnN0YWNrKX19O05vZGVSU0EucHJvdG90eXBlLiQkZGVjcnlwdEtleT1mdW5jdGlvbih1c2VQdWJsaWMsYnVmZmVyLGVuY29kaW5nKXt0cnl7YnVmZmVyPV8uaXNTdHJpbmcoYnVmZmVyKT9CdWZmZXIuZnJvbShidWZmZXIsImJhc2U2NCIpOmJ1ZmZlcjt2YXIgcmVzPXRoaXMua2V5UGFpci5kZWNyeXB0KGJ1ZmZlcix1c2VQdWJsaWMpO2lmKHJlcz09PW51bGwpe3Rocm93IEVycm9yKCJLZXkgZGVjcnlwdCBtZXRob2QgcmV0dXJucyBudWxsLiIpfXJldHVybiB0aGlzLiRnZXREZWNyeXB0ZWREYXRhKHJlcyxlbmNvZGluZyl9Y2F0Y2goZSl7dGhyb3cgRXJyb3IoIkVycm9yIGR1cmluZyBkZWNyeXB0aW9uIChwcm9iYWJseSBpbmNvcnJlY3Qga2V5KS4gT3JpZ2luYWwgZXJyb3I6ICIrZS5zdGFjayl9fTtOb2RlUlNBLnByb3RvdHlwZS5zaWduPWZ1bmN0aW9uKGJ1ZmZlcixlbmNvZGluZyxzb3VyY2VfZW5jb2Rpbmcpe2lmKCF0aGlzLmlzUHJpdmF0ZSgpKXt0aHJvdyBFcnJvcigiVGhpcyBpcyBub3QgcHJpdmF0ZSBrZXkiKX12YXIgcmVzPXRoaXMua2V5UGFpci5zaWduKHRoaXMuJGdldERhdGFGb3JFbmNyeXB0KGJ1ZmZlcixzb3VyY2VfZW5jb2RpbmcpKTtpZihlbmNvZGluZyYmZW5jb2RpbmchPSJidWZmZXIiKXtyZXM9cmVzLnRvU3RyaW5nKGVuY29kaW5nKX1yZXR1cm4gcmVzfTtOb2RlUlNBLnByb3RvdHlwZS52ZXJpZnk9ZnVuY3Rpb24oYnVmZmVyLHNpZ25hdHVyZSxzb3VyY2VfZW5jb2Rpbmcsc2lnbmF0dXJlX2VuY29kaW5nKXtpZighdGhpcy5pc1B1YmxpYygpKXt0aHJvdyBFcnJvcigiVGhpcyBpcyBub3QgcHVibGljIGtleSIpfXNpZ25hdHVyZV9lbmNvZGluZz0hc2lnbmF0dXJlX2VuY29kaW5nfHxzaWduYXR1cmVfZW5jb2Rpbmc9PSJidWZmZXIiP251bGw6c2lnbmF0dXJlX2VuY29kaW5nO3JldHVybiB0aGlzLmtleVBhaXIudmVyaWZ5KHRoaXMuJGdldERhdGFGb3JFbmNyeXB0KGJ1ZmZlcixzb3VyY2VfZW5jb2RpbmcpLHNpZ25hdHVyZSxzaWduYXR1cmVfZW5jb2RpbmcpfTtOb2RlUlNBLnByb3RvdHlwZS5nZXRLZXlTaXplPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMua2V5UGFpci5rZXlTaXplfTtOb2RlUlNBLnByb3RvdHlwZS5nZXRNYXhNZXNzYWdlU2l6ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmtleVBhaXIubWF4TWVzc2FnZUxlbmd0aH07Tm9kZVJTQS5wcm90b3R5cGUuJGdldERhdGFGb3JFbmNyeXB0PWZ1bmN0aW9uKGJ1ZmZlcixlbmNvZGluZyl7aWYoXy5pc1N0cmluZyhidWZmZXIpfHxfLmlzTnVtYmVyKGJ1ZmZlcikpe3JldHVybiBCdWZmZXIuZnJvbSgiIitidWZmZXIsZW5jb2Rpbmd8fCJ1dGY4Iil9ZWxzZSBpZihCdWZmZXIuaXNCdWZmZXIoYnVmZmVyKSl7cmV0dXJuIGJ1ZmZlcn1lbHNlIGlmKF8uaXNPYmplY3QoYnVmZmVyKSl7cmV0dXJuIEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGJ1ZmZlcikpfWVsc2V7dGhyb3cgRXJyb3IoIlVuZXhwZWN0ZWQgZGF0YSB0eXBlIil9fTtOb2RlUlNBLnByb3RvdHlwZS4kZ2V0RGVjcnlwdGVkRGF0YT1mdW5jdGlvbihidWZmZXIsZW5jb2Rpbmcpe2VuY29kaW5nPWVuY29kaW5nfHwiYnVmZmVyIjtpZihlbmNvZGluZz09ImJ1ZmZlciIpe3JldHVybiBidWZmZXJ9ZWxzZSBpZihlbmNvZGluZz09Impzb24iKXtyZXR1cm4gSlNPTi5wYXJzZShidWZmZXIudG9TdHJpbmcoKSl9ZWxzZXtyZXR1cm4gYnVmZmVyLnRvU3RyaW5nKGVuY29kaW5nKX19O3JldHVybiBOb2RlUlNBfSgpfSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi9mb3JtYXRzL2Zvcm1hdHMuanMiOjQ5LCIuL2xpYnMvcnNhLmpzIjo1MywiLi9zY2hlbWVzL3NjaGVtZXMuanMiOjU3LCIuL3V0aWxzIjo1OCxidWZmZXI6MjcsY29uc3RhbnRzOjI5LHNlZWRyYW5kb206ODV9XSw0MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7InVzZSBzdHJpY3QiO3ZhciB1dGlscz1yZXF1aXJlKCIuL3V0aWxzIik7dmFyIHN0YW5kYWxvbmVDcmVhdGVIYXNoPXJlcXVpcmUoImNyZWF0ZS1oYXNoIik7dmFyIGdldE5vZGVDcnlwdG89ZnVuY3Rpb24oKXt2YXIgbm9kZUNyeXB0bz11bmRlZmluZWQ7cmV0dXJuIGZ1bmN0aW9uKCl7aWYobm9kZUNyeXB0bz09PXVuZGVmaW5lZCl7bm9kZUNyeXB0bz1yZXF1aXJlKCJjcnlwdG8iKyIiKX1yZXR1cm4gbm9kZUNyeXB0b319KCk7bW9kdWxlLmV4cG9ydHM9e307bW9kdWxlLmV4cG9ydHMuY3JlYXRlSGFzaD1mdW5jdGlvbigpe2lmKHV0aWxzLmRldGVjdEVudmlyb25tZW50KCk9PT0ibm9kZSIpe3RyeXt2YXIgbm9kZUNyeXB0bz1nZXROb2RlQ3J5cHRvKCk7cmV0dXJuIG5vZGVDcnlwdG8uY3JlYXRlSGFzaC5iaW5kKG5vZGVDcnlwdG8pfWNhdGNoKGVycm9yKXt9fXJldHVybiBzdGFuZGFsb25lQ3JlYXRlSGFzaH0oKTtbImNyZWF0ZVNpZ24iLCJjcmVhdGVWZXJpZnkiXS5mb3JFYWNoKGZ1bmN0aW9uKGZuTmFtZSl7bW9kdWxlLmV4cG9ydHNbZm5OYW1lXT1mdW5jdGlvbigpe3ZhciBub2RlQ3J5cHRvPWdldE5vZGVDcnlwdG8oKTtub2RlQ3J5cHRvW2ZuTmFtZV0uYXBwbHkobm9kZUNyeXB0byxhcmd1bWVudHMpfX0pO21vZHVsZS5leHBvcnRzLnJhbmRvbUJ5dGVzPWZ1bmN0aW9uKCl7dmFyIGJyb3dzZXJHZXRSYW5kb21WYWx1ZXM9ZnVuY3Rpb24oKXtpZih0eXBlb2YgY3J5cHRvPT09Im9iamVjdCImJiEhY3J5cHRvLmdldFJhbmRvbVZhbHVlcyl7cmV0dXJuIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pfWVsc2UgaWYodHlwZW9mIG1zQ3J5cHRvPT09Im9iamVjdCImJiEhbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKXtyZXR1cm4gbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pfWVsc2UgaWYodHlwZW9mIHNlbGY9PT0ib2JqZWN0IiYmdHlwZW9mIHNlbGYuY3J5cHRvPT09Im9iamVjdCImJiEhc2VsZi5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKXtyZXR1cm4gc2VsZi5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoc2VsZi5jcnlwdG8pfWVsc2V7cmV0dXJuIHVuZGVmaW5lZH19KCk7dmFyIGdldFJhbmRvbVZhbHVlcz1mdW5jdGlvbigpe3ZhciBub25DcnlwdG9ncmFwaGljR2V0UmFuZG9tVmFsdWU9ZnVuY3Rpb24oYWJ2KXt2YXIgbD1hYnYubGVuZ3RoO3doaWxlKGwtLSl7YWJ2W2xdPU1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyNTYpfXJldHVybiBhYnZ9O3JldHVybiBmdW5jdGlvbihhYnYpe2lmKE1hdGgucmFuZG9tLmlzU2VlZGVkKXtyZXR1cm4gbm9uQ3J5cHRvZ3JhcGhpY0dldFJhbmRvbVZhbHVlKGFidil9ZWxzZXtpZighIWJyb3dzZXJHZXRSYW5kb21WYWx1ZXMpe3JldHVybiBicm93c2VyR2V0UmFuZG9tVmFsdWVzKGFidil9ZWxzZXtyZXR1cm4gbm9uQ3J5cHRvZ3JhcGhpY0dldFJhbmRvbVZhbHVlKGFidil9fX19KCk7dmFyIE1BWF9CWVRFUz02NTUzNjt2YXIgTUFYX1VJTlQzMj00Mjk0OTY3Mjk1O3JldHVybiBmdW5jdGlvbiByYW5kb21CeXRlcyhzaXplKXtpZighTWF0aC5yYW5kb20uaXNTZWVkZWQmJiFicm93c2VyR2V0UmFuZG9tVmFsdWVzKXt0cnl7dmFyIG5vZGVCdWZmZXJJbnN0PWdldE5vZGVDcnlwdG8oKS5yYW5kb21CeXRlcyhzaXplKTtyZXR1cm4gQnVmZmVyLmZyb20obm9kZUJ1ZmZlckluc3QuYnVmZmVyLG5vZGVCdWZmZXJJbnN0LmJ5dGVPZmZzZXQsbm9kZUJ1ZmZlckluc3QubGVuZ3RoKX1jYXRjaChlcnJvcil7fX1pZihzaXplPk1BWF9VSU5UMzIpdGhyb3cgbmV3IFJhbmdlRXJyb3IoInJlcXVlc3RlZCB0b28gbWFueSByYW5kb20gYnl0ZXMiKTt2YXIgYnl0ZXM9QnVmZmVyLmFsbG9jVW5zYWZlKHNpemUpO2lmKHNpemU+MCl7aWYoc2l6ZT5NQVhfQllURVMpe2Zvcih2YXIgZ2VuZXJhdGVkPTA7Z2VuZXJhdGVkPHNpemU7Z2VuZXJhdGVkKz1NQVhfQllURVMpe2dldFJhbmRvbVZhbHVlcyhieXRlcy5zbGljZShnZW5lcmF0ZWQsZ2VuZXJhdGVkK01BWF9CWVRFUykpfX1lbHNle2dldFJhbmRvbVZhbHVlcyhieXRlcyl9fXJldHVybiBieXRlc319KCl9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuL3V0aWxzIjo1OCxidWZmZXI6MjcsImNyZWF0ZS1oYXNoIjozMX1dLDQ0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz17Z2V0RW5naW5lOmZ1bmN0aW9uKGtleVBhaXIsb3B0aW9ucyl7dmFyIGVuZ2luZT1yZXF1aXJlKCIuL2pzLmpzIik7aWYob3B0aW9ucy5lbnZpcm9ubWVudD09PSJub2RlIil7dmFyIGNyeXB0PXJlcXVpcmUoImNyeXB0byIrIiIpO2lmKHR5cGVvZiBjcnlwdC5wdWJsaWNFbmNyeXB0PT09ImZ1bmN0aW9uIiYmdHlwZW9mIGNyeXB0LnByaXZhdGVEZWNyeXB0PT09ImZ1bmN0aW9uIil7aWYodHlwZW9mIGNyeXB0LnByaXZhdGVFbmNyeXB0PT09ImZ1bmN0aW9uIiYmdHlwZW9mIGNyeXB0LnB1YmxpY0RlY3J5cHQ9PT0iZnVuY3Rpb24iKXtlbmdpbmU9cmVxdWlyZSgiLi9pby5qcyIpfWVsc2V7ZW5naW5lPXJlcXVpcmUoIi4vbm9kZTEyLmpzIil9fX1yZXR1cm4gZW5naW5lKGtleVBhaXIsb3B0aW9ucyl9fX0seyIuL2lvLmpzIjo0NSwiLi9qcy5qcyI6NDYsIi4vbm9kZTEyLmpzIjo0N31dLDQ1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgY3J5cHRvPXJlcXVpcmUoImNyeXB0byIrIiIpO3ZhciBjb25zdGFudHM9cmVxdWlyZSgiY29uc3RhbnRzIik7dmFyIHNjaGVtZXM9cmVxdWlyZSgiLi4vc2NoZW1lcy9zY2hlbWVzLmpzIik7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24oa2V5UGFpcixvcHRpb25zKXt2YXIgcGtjczFTY2hlbWU9c2NoZW1lcy5wa2NzMS5tYWtlU2NoZW1lKGtleVBhaXIsb3B0aW9ucyk7cmV0dXJue2VuY3J5cHQ6ZnVuY3Rpb24oYnVmZmVyLHVzZVByaXZhdGUpe3ZhciBwYWRkaW5nO2lmKHVzZVByaXZhdGUpe3BhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9QQURESU5HO2lmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZyl7cGFkZGluZz1vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmd9cmV0dXJuIGNyeXB0by5wcml2YXRlRW5jcnlwdCh7a2V5Om9wdGlvbnMucnNhVXRpbHMuZXhwb3J0S2V5KCJwcml2YXRlIikscGFkZGluZzpwYWRkaW5nfSxidWZmZXIpfWVsc2V7cGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX09BRVBfUEFERElORztpZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWU9PT0icGtjczEiKXtwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfUEFERElOR31pZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmcpe3BhZGRpbmc9b3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nfXZhciBkYXRhPWJ1ZmZlcjtpZihwYWRkaW5nPT09Y29uc3RhbnRzLlJTQV9OT19QQURESU5HKXtkYXRhPXBrY3MxU2NoZW1lLnBrY3MwcGFkKGJ1ZmZlcil9cmV0dXJuIGNyeXB0by5wdWJsaWNFbmNyeXB0KHtrZXk6b3B0aW9ucy5yc2FVdGlscy5leHBvcnRLZXkoInB1YmxpYyIpLHBhZGRpbmc6cGFkZGluZ30sZGF0YSl9fSxkZWNyeXB0OmZ1bmN0aW9uKGJ1ZmZlcix1c2VQdWJsaWMpe3ZhciBwYWRkaW5nO2lmKHVzZVB1YmxpYyl7cGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX1BBRERJTkc7aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nKXtwYWRkaW5nPW9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZ31yZXR1cm4gY3J5cHRvLnB1YmxpY0RlY3J5cHQoe2tleTpvcHRpb25zLnJzYVV0aWxzLmV4cG9ydEtleSgicHVibGljIikscGFkZGluZzpwYWRkaW5nfSxidWZmZXIpfWVsc2V7cGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX09BRVBfUEFERElORztpZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWU9PT0icGtjczEiKXtwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfUEFERElOR31pZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmcpe3BhZGRpbmc9b3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nfXZhciByZXM9Y3J5cHRvLnByaXZhdGVEZWNyeXB0KHtrZXk6b3B0aW9ucy5yc2FVdGlscy5leHBvcnRLZXkoInByaXZhdGUiKSxwYWRkaW5nOnBhZGRpbmd9LGJ1ZmZlcik7aWYocGFkZGluZz09PWNvbnN0YW50cy5SU0FfTk9fUEFERElORyl7cmV0dXJuIHBrY3MxU2NoZW1lLnBrY3MwdW5wYWQocmVzKX1yZXR1cm4gcmVzfX19fX0seyIuLi9zY2hlbWVzL3NjaGVtZXMuanMiOjU3LGNvbnN0YW50czoyOX1dLDQ2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgQmlnSW50ZWdlcj1yZXF1aXJlKCIuLi9saWJzL2pzYm4uanMiKTt2YXIgc2NoZW1lcz1yZXF1aXJlKCIuLi9zY2hlbWVzL3NjaGVtZXMuanMiKTttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihrZXlQYWlyLG9wdGlvbnMpe3ZhciBwa2NzMVNjaGVtZT1zY2hlbWVzLnBrY3MxLm1ha2VTY2hlbWUoa2V5UGFpcixvcHRpb25zKTtyZXR1cm57ZW5jcnlwdDpmdW5jdGlvbihidWZmZXIsdXNlUHJpdmF0ZSl7dmFyIG0sYztpZih1c2VQcml2YXRlKXttPW5ldyBCaWdJbnRlZ2VyKHBrY3MxU2NoZW1lLmVuY1BhZChidWZmZXIse3R5cGU6MX0pKTtjPWtleVBhaXIuJGRvUHJpdmF0ZShtKX1lbHNle209bmV3IEJpZ0ludGVnZXIoa2V5UGFpci5lbmNyeXB0aW9uU2NoZW1lLmVuY1BhZChidWZmZXIpKTtjPWtleVBhaXIuJGRvUHVibGljKG0pfXJldHVybiBjLnRvQnVmZmVyKGtleVBhaXIuZW5jcnlwdGVkRGF0YUxlbmd0aCl9LGRlY3J5cHQ6ZnVuY3Rpb24oYnVmZmVyLHVzZVB1YmxpYyl7dmFyIG0sYz1uZXcgQmlnSW50ZWdlcihidWZmZXIpO2lmKHVzZVB1YmxpYyl7bT1rZXlQYWlyLiRkb1B1YmxpYyhjKTtyZXR1cm4gcGtjczFTY2hlbWUuZW5jVW5QYWQobS50b0J1ZmZlcihrZXlQYWlyLmVuY3J5cHRlZERhdGFMZW5ndGgpLHt0eXBlOjF9KX1lbHNle209a2V5UGFpci4kZG9Qcml2YXRlKGMpO3JldHVybiBrZXlQYWlyLmVuY3J5cHRpb25TY2hlbWUuZW5jVW5QYWQobS50b0J1ZmZlcihrZXlQYWlyLmVuY3J5cHRlZERhdGFMZW5ndGgpKX19fX19LHsiLi4vbGlicy9qc2JuLmpzIjo1MiwiLi4vc2NoZW1lcy9zY2hlbWVzLmpzIjo1N31dLDQ3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgY3J5cHRvPXJlcXVpcmUoImNyeXB0byIrIiIpO3ZhciBjb25zdGFudHM9cmVxdWlyZSgiY29uc3RhbnRzIik7dmFyIHNjaGVtZXM9cmVxdWlyZSgiLi4vc2NoZW1lcy9zY2hlbWVzLmpzIik7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24oa2V5UGFpcixvcHRpb25zKXt2YXIganNFbmdpbmU9cmVxdWlyZSgiLi9qcy5qcyIpKGtleVBhaXIsb3B0aW9ucyk7dmFyIHBrY3MxU2NoZW1lPXNjaGVtZXMucGtjczEubWFrZVNjaGVtZShrZXlQYWlyLG9wdGlvbnMpO3JldHVybntlbmNyeXB0OmZ1bmN0aW9uKGJ1ZmZlcix1c2VQcml2YXRlKXtpZih1c2VQcml2YXRlKXtyZXR1cm4ganNFbmdpbmUuZW5jcnlwdChidWZmZXIsdXNlUHJpdmF0ZSl9dmFyIHBhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9PQUVQX1BBRERJTkc7aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lPT09InBrY3MxIil7cGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX1BBRERJTkd9aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nKXtwYWRkaW5nPW9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZ312YXIgZGF0YT1idWZmZXI7aWYocGFkZGluZz09PWNvbnN0YW50cy5SU0FfTk9fUEFERElORyl7ZGF0YT1wa2NzMVNjaGVtZS5wa2NzMHBhZChidWZmZXIpfXJldHVybiBjcnlwdG8ucHVibGljRW5jcnlwdCh7a2V5Om9wdGlvbnMucnNhVXRpbHMuZXhwb3J0S2V5KCJwdWJsaWMiKSxwYWRkaW5nOnBhZGRpbmd9LGRhdGEpfSxkZWNyeXB0OmZ1bmN0aW9uKGJ1ZmZlcix1c2VQdWJsaWMpe2lmKHVzZVB1YmxpYyl7cmV0dXJuIGpzRW5naW5lLmRlY3J5cHQoYnVmZmVyLHVzZVB1YmxpYyl9dmFyIHBhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9PQUVQX1BBRERJTkc7aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lPT09InBrY3MxIil7cGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX1BBRERJTkd9aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nKXtwYWRkaW5nPW9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZ312YXIgcmVzPWNyeXB0by5wcml2YXRlRGVjcnlwdCh7a2V5Om9wdGlvbnMucnNhVXRpbHMuZXhwb3J0S2V5KCJwcml2YXRlIikscGFkZGluZzpwYWRkaW5nfSxidWZmZXIpO2lmKHBhZGRpbmc9PT1jb25zdGFudHMuUlNBX05PX1BBRERJTkcpe3JldHVybiBwa2NzMVNjaGVtZS5wa2NzMHVucGFkKHJlcyl9cmV0dXJuIHJlc319fX0seyIuLi9zY2hlbWVzL3NjaGVtZXMuanMiOjU3LCIuL2pzLmpzIjo0Nixjb25zdGFudHM6Mjl9XSw0ODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIF89cmVxdWlyZSgiLi4vdXRpbHMiKS5fO21vZHVsZS5leHBvcnRzPXtwcml2YXRlRXhwb3J0OmZ1bmN0aW9uKGtleSxvcHRpb25zKXtyZXR1cm57bjprZXkubi50b0J1ZmZlcigpLGU6a2V5LmUsZDprZXkuZC50b0J1ZmZlcigpLHA6a2V5LnAudG9CdWZmZXIoKSxxOmtleS5xLnRvQnVmZmVyKCksZG1wMTprZXkuZG1wMS50b0J1ZmZlcigpLGRtcTE6a2V5LmRtcTEudG9CdWZmZXIoKSxjb2VmZjprZXkuY29lZmYudG9CdWZmZXIoKX19LHByaXZhdGVJbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEsb3B0aW9ucyl7aWYoZGF0YS5uJiZkYXRhLmUmJmRhdGEuZCYmZGF0YS5wJiZkYXRhLnEmJmRhdGEuZG1wMSYmZGF0YS5kbXExJiZkYXRhLmNvZWZmKXtrZXkuc2V0UHJpdmF0ZShkYXRhLm4sZGF0YS5lLGRhdGEuZCxkYXRhLnAsZGF0YS5xLGRhdGEuZG1wMSxkYXRhLmRtcTEsZGF0YS5jb2VmZil9ZWxzZXt0aHJvdyBFcnJvcigiSW52YWxpZCBrZXkgZGF0YSIpfX0scHVibGljRXhwb3J0OmZ1bmN0aW9uKGtleSxvcHRpb25zKXtyZXR1cm57bjprZXkubi50b0J1ZmZlcigpLGU6a2V5LmV9fSxwdWJsaWNJbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEsb3B0aW9ucyl7aWYoZGF0YS5uJiZkYXRhLmUpe2tleS5zZXRQdWJsaWMoZGF0YS5uLGRhdGEuZSl9ZWxzZXt0aHJvdyBFcnJvcigiSW52YWxpZCBrZXkgZGF0YSIpfX0sYXV0b0ltcG9ydDpmdW5jdGlvbihrZXksZGF0YSl7aWYoZGF0YS5uJiZkYXRhLmUpe2lmKGRhdGEuZCYmZGF0YS5wJiZkYXRhLnEmJmRhdGEuZG1wMSYmZGF0YS5kbXExJiZkYXRhLmNvZWZmKXttb2R1bGUuZXhwb3J0cy5wcml2YXRlSW1wb3J0KGtleSxkYXRhKTtyZXR1cm4gdHJ1ZX1lbHNle21vZHVsZS5leHBvcnRzLnB1YmxpY0ltcG9ydChrZXksZGF0YSk7cmV0dXJuIHRydWV9fXJldHVybiBmYWxzZX19fSx7Ii4uL3V0aWxzIjo1OH1dLDQ5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtmdW5jdGlvbiBmb3JtYXRQYXJzZShmb3JtYXQpe2Zvcm1hdD1mb3JtYXQuc3BsaXQoIi0iKTt2YXIga2V5VHlwZT0icHJpdmF0ZSI7dmFyIGtleU9wdD17dHlwZToiZGVmYXVsdCJ9O2Zvcih2YXIgaT0xO2k8Zm9ybWF0Lmxlbmd0aDtpKyspe2lmKGZvcm1hdFtpXSl7c3dpdGNoKGZvcm1hdFtpXSl7Y2FzZSJwdWJsaWMiOmtleVR5cGU9Zm9ybWF0W2ldO2JyZWFrO2Nhc2UicHJpdmF0ZSI6a2V5VHlwZT1mb3JtYXRbaV07YnJlYWs7Y2FzZSJwZW0iOmtleU9wdC50eXBlPWZvcm1hdFtpXTticmVhaztjYXNlImRlciI6a2V5T3B0LnR5cGU9Zm9ybWF0W2ldO2JyZWFrfX19cmV0dXJue3NjaGVtZTpmb3JtYXRbMF0sa2V5VHlwZTprZXlUeXBlLGtleU9wdDprZXlPcHR9fW1vZHVsZS5leHBvcnRzPXtwa2NzMTpyZXF1aXJlKCIuL3BrY3MxIikscGtjczg6cmVxdWlyZSgiLi9wa2NzOCIpLGNvbXBvbmVudHM6cmVxdWlyZSgiLi9jb21wb25lbnRzIiksaXNQcml2YXRlRXhwb3J0OmZ1bmN0aW9uKGZvcm1hdCl7cmV0dXJuIG1vZHVsZS5leHBvcnRzW2Zvcm1hdF0mJnR5cGVvZiBtb2R1bGUuZXhwb3J0c1tmb3JtYXRdLnByaXZhdGVFeHBvcnQ9PT0iZnVuY3Rpb24ifSxpc1ByaXZhdGVJbXBvcnQ6ZnVuY3Rpb24oZm9ybWF0KXtyZXR1cm4gbW9kdWxlLmV4cG9ydHNbZm9ybWF0XSYmdHlwZW9mIG1vZHVsZS5leHBvcnRzW2Zvcm1hdF0ucHJpdmF0ZUltcG9ydD09PSJmdW5jdGlvbiJ9LGlzUHVibGljRXhwb3J0OmZ1bmN0aW9uKGZvcm1hdCl7cmV0dXJuIG1vZHVsZS5leHBvcnRzW2Zvcm1hdF0mJnR5cGVvZiBtb2R1bGUuZXhwb3J0c1tmb3JtYXRdLnB1YmxpY0V4cG9ydD09PSJmdW5jdGlvbiJ9LGlzUHVibGljSW1wb3J0OmZ1bmN0aW9uKGZvcm1hdCl7cmV0dXJuIG1vZHVsZS5leHBvcnRzW2Zvcm1hdF0mJnR5cGVvZiBtb2R1bGUuZXhwb3J0c1tmb3JtYXRdLnB1YmxpY0ltcG9ydD09PSJmdW5jdGlvbiJ9LGRldGVjdEFuZEltcG9ydDpmdW5jdGlvbihrZXksZGF0YSxmb3JtYXQpe2lmKGZvcm1hdD09PXVuZGVmaW5lZCl7Zm9yKHZhciBzY2hlbWUgaW4gbW9kdWxlLmV4cG9ydHMpe2lmKHR5cGVvZiBtb2R1bGUuZXhwb3J0c1tzY2hlbWVdLmF1dG9JbXBvcnQ9PT0iZnVuY3Rpb24iJiZtb2R1bGUuZXhwb3J0c1tzY2hlbWVdLmF1dG9JbXBvcnQoa2V5LGRhdGEpKXtyZXR1cm4gdHJ1ZX19fWVsc2UgaWYoZm9ybWF0KXt2YXIgZm10PWZvcm1hdFBhcnNlKGZvcm1hdCk7aWYobW9kdWxlLmV4cG9ydHNbZm10LnNjaGVtZV0pe2lmKGZtdC5rZXlUeXBlPT09InByaXZhdGUiKXttb2R1bGUuZXhwb3J0c1tmbXQuc2NoZW1lXS5wcml2YXRlSW1wb3J0KGtleSxkYXRhLGZtdC5rZXlPcHQpfWVsc2V7bW9kdWxlLmV4cG9ydHNbZm10LnNjaGVtZV0ucHVibGljSW1wb3J0KGtleSxkYXRhLGZtdC5rZXlPcHQpfX1lbHNle3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBrZXkgZm9ybWF0Iil9fXJldHVybiBmYWxzZX0sZGV0ZWN0QW5kRXhwb3J0OmZ1bmN0aW9uKGtleSxmb3JtYXQpe2lmKGZvcm1hdCl7dmFyIGZtdD1mb3JtYXRQYXJzZShmb3JtYXQpO2lmKG1vZHVsZS5leHBvcnRzW2ZtdC5zY2hlbWVdKXtpZihmbXQua2V5VHlwZT09PSJwcml2YXRlIil7aWYoIWtleS5pc1ByaXZhdGUoKSl7dGhyb3cgRXJyb3IoIlRoaXMgaXMgbm90IHByaXZhdGUga2V5Iil9cmV0dXJuIG1vZHVsZS5leHBvcnRzW2ZtdC5zY2hlbWVdLnByaXZhdGVFeHBvcnQoa2V5LGZtdC5rZXlPcHQpfWVsc2V7aWYoIWtleS5pc1B1YmxpYygpKXt0aHJvdyBFcnJvcigiVGhpcyBpcyBub3QgcHVibGljIGtleSIpfXJldHVybiBtb2R1bGUuZXhwb3J0c1tmbXQuc2NoZW1lXS5wdWJsaWNFeHBvcnQoa2V5LGZtdC5rZXlPcHQpfX1lbHNle3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBrZXkgZm9ybWF0Iil9fX19fSx7Ii4vY29tcG9uZW50cyI6NDgsIi4vcGtjczEiOjUwLCIuL3BrY3M4Ijo1MX1dLDUwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgYmVyPXJlcXVpcmUoImFzbjEiKS5CZXI7dmFyIF89cmVxdWlyZSgiLi4vdXRpbHMiKS5fO3ZhciB1dGlscz1yZXF1aXJlKCIuLi91dGlscyIpO3ZhciBQUklWQVRFX09QRU5JTkdfQk9VTkRBUlk9Ii0tLS0tQkVHSU4gUlNBIFBSSVZBVEUgS0VZLS0tLS0iO3ZhciBQUklWQVRFX0NMT1NJTkdfQk9VTkRBUlk9Ii0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tIjt2YXIgUFVCTElDX09QRU5JTkdfQk9VTkRBUlk9Ii0tLS0tQkVHSU4gUlNBIFBVQkxJQyBLRVktLS0tLSI7dmFyIFBVQkxJQ19DTE9TSU5HX0JPVU5EQVJZPSItLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0tIjttb2R1bGUuZXhwb3J0cz17cHJpdmF0ZUV4cG9ydDpmdW5jdGlvbihrZXksb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgbj1rZXkubi50b0J1ZmZlcigpO3ZhciBkPWtleS5kLnRvQnVmZmVyKCk7dmFyIHA9a2V5LnAudG9CdWZmZXIoKTt2YXIgcT1rZXkucS50b0J1ZmZlcigpO3ZhciBkbXAxPWtleS5kbXAxLnRvQnVmZmVyKCk7dmFyIGRtcTE9a2V5LmRtcTEudG9CdWZmZXIoKTt2YXIgY29lZmY9a2V5LmNvZWZmLnRvQnVmZmVyKCk7dmFyIGxlbmd0aD1uLmxlbmd0aCtkLmxlbmd0aCtwLmxlbmd0aCtxLmxlbmd0aCtkbXAxLmxlbmd0aCtkbXExLmxlbmd0aCtjb2VmZi5sZW5ndGgrNTEyO3ZhciB3cml0ZXI9bmV3IGJlci5Xcml0ZXIoe3NpemU6bGVuZ3RofSk7d3JpdGVyLnN0YXJ0U2VxdWVuY2UoKTt3cml0ZXIud3JpdGVJbnQoMCk7d3JpdGVyLndyaXRlQnVmZmVyKG4sMik7d3JpdGVyLndyaXRlSW50KGtleS5lKTt3cml0ZXIud3JpdGVCdWZmZXIoZCwyKTt3cml0ZXIud3JpdGVCdWZmZXIocCwyKTt3cml0ZXIud3JpdGVCdWZmZXIocSwyKTt3cml0ZXIud3JpdGVCdWZmZXIoZG1wMSwyKTt3cml0ZXIud3JpdGVCdWZmZXIoZG1xMSwyKTt3cml0ZXIud3JpdGVCdWZmZXIoY29lZmYsMik7d3JpdGVyLmVuZFNlcXVlbmNlKCk7aWYob3B0aW9ucy50eXBlPT09ImRlciIpe3JldHVybiB3cml0ZXIuYnVmZmVyfWVsc2V7cmV0dXJuIFBSSVZBVEVfT1BFTklOR19CT1VOREFSWSsiXG4iK3V0aWxzLmxpbmVicmsod3JpdGVyLmJ1ZmZlci50b1N0cmluZygiYmFzZTY0IiksNjQpKyJcbiIrUFJJVkFURV9DTE9TSU5HX0JPVU5EQVJZfX0scHJpdmF0ZUltcG9ydDpmdW5jdGlvbihrZXksZGF0YSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBidWZmZXI7aWYob3B0aW9ucy50eXBlIT09ImRlciIpe2lmKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSl7ZGF0YT1kYXRhLnRvU3RyaW5nKCJ1dGY4Iil9aWYoXy5pc1N0cmluZyhkYXRhKSl7dmFyIHBlbT11dGlscy50cmltU3Vycm91bmRpbmdUZXh0KGRhdGEsUFJJVkFURV9PUEVOSU5HX0JPVU5EQVJZLFBSSVZBVEVfQ0xPU0lOR19CT1VOREFSWSkucmVwbGFjZSgvXHMrfFxuXHJ8XG58XHIkL2dtLCIiKTtidWZmZXI9QnVmZmVyLmZyb20ocGVtLCJiYXNlNjQiKX1lbHNle3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBrZXkgZm9ybWF0Iil9fWVsc2UgaWYoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKXtidWZmZXI9ZGF0YX1lbHNle3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBrZXkgZm9ybWF0Iil9dmFyIHJlYWRlcj1uZXcgYmVyLlJlYWRlcihidWZmZXIpO3JlYWRlci5yZWFkU2VxdWVuY2UoKTtyZWFkZXIucmVhZFN0cmluZygyLHRydWUpO2tleS5zZXRQcml2YXRlKHJlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSkscmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKSxyZWFkZXIucmVhZFN0cmluZygyLHRydWUpLHJlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSkscmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKSxyZWFkZXIucmVhZFN0cmluZygyLHRydWUpLHJlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSkscmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKSl9LHB1YmxpY0V4cG9ydDpmdW5jdGlvbihrZXksb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgbj1rZXkubi50b0J1ZmZlcigpO3ZhciBsZW5ndGg9bi5sZW5ndGgrNTEyO3ZhciBib2R5V3JpdGVyPW5ldyBiZXIuV3JpdGVyKHtzaXplOmxlbmd0aH0pO2JvZHlXcml0ZXIuc3RhcnRTZXF1ZW5jZSgpO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIobiwyKTtib2R5V3JpdGVyLndyaXRlSW50KGtleS5lKTtib2R5V3JpdGVyLmVuZFNlcXVlbmNlKCk7aWYob3B0aW9ucy50eXBlPT09ImRlciIpe3JldHVybiBib2R5V3JpdGVyLmJ1ZmZlcn1lbHNle3JldHVybiBQVUJMSUNfT1BFTklOR19CT1VOREFSWSsiXG4iK3V0aWxzLmxpbmVicmsoYm9keVdyaXRlci5idWZmZXIudG9TdHJpbmcoImJhc2U2NCIpLDY0KSsiXG4iK1BVQkxJQ19DTE9TSU5HX0JPVU5EQVJZfX0scHVibGljSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhLG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGJ1ZmZlcjtpZihvcHRpb25zLnR5cGUhPT0iZGVyIil7aWYoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKXtkYXRhPWRhdGEudG9TdHJpbmcoInV0ZjgiKX1pZihfLmlzU3RyaW5nKGRhdGEpKXt2YXIgcGVtPXV0aWxzLnRyaW1TdXJyb3VuZGluZ1RleHQoZGF0YSxQVUJMSUNfT1BFTklOR19CT1VOREFSWSxQVUJMSUNfQ0xPU0lOR19CT1VOREFSWSkucmVwbGFjZSgvXHMrfFxuXHJ8XG58XHIkL2dtLCIiKTtidWZmZXI9QnVmZmVyLmZyb20ocGVtLCJiYXNlNjQiKX19ZWxzZSBpZihCdWZmZXIuaXNCdWZmZXIoZGF0YSkpe2J1ZmZlcj1kYXRhfWVsc2V7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGtleSBmb3JtYXQiKX12YXIgYm9keT1uZXcgYmVyLlJlYWRlcihidWZmZXIpO2JvZHkucmVhZFNlcXVlbmNlKCk7a2V5LnNldFB1YmxpYyhib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSl9LGF1dG9JbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEpe2lmKC9eW1xTXHNdKi0tLS0tQkVHSU4gUlNBIFBSSVZBVEUgS0VZLS0tLS1ccyooPz0oKFtBLVphLXowLTkrLz1dK1xzKikrKSlcMS0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tW1xTXHNdKiQvZy50ZXN0KGRhdGEpKXttb2R1bGUuZXhwb3J0cy5wcml2YXRlSW1wb3J0KGtleSxkYXRhKTtyZXR1cm4gdHJ1ZX1pZigvXltcU1xzXSotLS0tLUJFR0lOIFJTQSBQVUJMSUMgS0VZLS0tLS1ccyooPz0oKFtBLVphLXowLTkrLz1dK1xzKikrKSlcMS0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS1bXFNcc10qJC9nLnRlc3QoZGF0YSkpe21vZHVsZS5leHBvcnRzLnB1YmxpY0ltcG9ydChrZXksZGF0YSk7cmV0dXJuIHRydWV9cmV0dXJuIGZhbHNlfX19KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi91dGlscyI6NTgsYXNuMToxOSxidWZmZXI6Mjd9XSw1MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIGJlcj1yZXF1aXJlKCJhc24xIikuQmVyO3ZhciBfPXJlcXVpcmUoIi4uL3V0aWxzIikuXzt2YXIgUFVCTElDX1JTQV9PSUQ9IjEuMi44NDAuMTEzNTQ5LjEuMS4xIjt2YXIgdXRpbHM9cmVxdWlyZSgiLi4vdXRpbHMiKTt2YXIgUFJJVkFURV9PUEVOSU5HX0JPVU5EQVJZPSItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS0iO3ZhciBQUklWQVRFX0NMT1NJTkdfQk9VTkRBUlk9Ii0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0iO3ZhciBQVUJMSUNfT1BFTklOR19CT1VOREFSWT0iLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0iO3ZhciBQVUJMSUNfQ0xPU0lOR19CT1VOREFSWT0iLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tIjttb2R1bGUuZXhwb3J0cz17cHJpdmF0ZUV4cG9ydDpmdW5jdGlvbihrZXksb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgbj1rZXkubi50b0J1ZmZlcigpO3ZhciBkPWtleS5kLnRvQnVmZmVyKCk7dmFyIHA9a2V5LnAudG9CdWZmZXIoKTt2YXIgcT1rZXkucS50b0J1ZmZlcigpO3ZhciBkbXAxPWtleS5kbXAxLnRvQnVmZmVyKCk7dmFyIGRtcTE9a2V5LmRtcTEudG9CdWZmZXIoKTt2YXIgY29lZmY9a2V5LmNvZWZmLnRvQnVmZmVyKCk7dmFyIGxlbmd0aD1uLmxlbmd0aCtkLmxlbmd0aCtwLmxlbmd0aCtxLmxlbmd0aCtkbXAxLmxlbmd0aCtkbXExLmxlbmd0aCtjb2VmZi5sZW5ndGgrNTEyO3ZhciBib2R5V3JpdGVyPW5ldyBiZXIuV3JpdGVyKHtzaXplOmxlbmd0aH0pO2JvZHlXcml0ZXIuc3RhcnRTZXF1ZW5jZSgpO2JvZHlXcml0ZXIud3JpdGVJbnQoMCk7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihuLDIpO2JvZHlXcml0ZXIud3JpdGVJbnQoa2V5LmUpO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIoZCwyKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKHAsMik7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihxLDIpO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIoZG1wMSwyKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKGRtcTEsMik7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihjb2VmZiwyKTtib2R5V3JpdGVyLmVuZFNlcXVlbmNlKCk7dmFyIHdyaXRlcj1uZXcgYmVyLldyaXRlcih7c2l6ZTpsZW5ndGh9KTt3cml0ZXIuc3RhcnRTZXF1ZW5jZSgpO3dyaXRlci53cml0ZUludCgwKTt3cml0ZXIuc3RhcnRTZXF1ZW5jZSgpO3dyaXRlci53cml0ZU9JRChQVUJMSUNfUlNBX09JRCk7d3JpdGVyLndyaXRlTnVsbCgpO3dyaXRlci5lbmRTZXF1ZW5jZSgpO3dyaXRlci53cml0ZUJ1ZmZlcihib2R5V3JpdGVyLmJ1ZmZlciw0KTt3cml0ZXIuZW5kU2VxdWVuY2UoKTtpZihvcHRpb25zLnR5cGU9PT0iZGVyIil7cmV0dXJuIHdyaXRlci5idWZmZXJ9ZWxzZXtyZXR1cm4gUFJJVkFURV9PUEVOSU5HX0JPVU5EQVJZKyJcbiIrdXRpbHMubGluZWJyayh3cml0ZXIuYnVmZmVyLnRvU3RyaW5nKCJiYXNlNjQiKSw2NCkrIlxuIitQUklWQVRFX0NMT1NJTkdfQk9VTkRBUll9fSxwcml2YXRlSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhLG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGJ1ZmZlcjtpZihvcHRpb25zLnR5cGUhPT0iZGVyIil7aWYoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKXtkYXRhPWRhdGEudG9TdHJpbmcoInV0ZjgiKX1pZihfLmlzU3RyaW5nKGRhdGEpKXt2YXIgcGVtPXV0aWxzLnRyaW1TdXJyb3VuZGluZ1RleHQoZGF0YSxQUklWQVRFX09QRU5JTkdfQk9VTkRBUlksUFJJVkFURV9DTE9TSU5HX0JPVU5EQVJZKS5yZXBsYWNlKCItLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tIiwiIikucmVwbGFjZSgvXHMrfFxuXHJ8XG58XHIkL2dtLCIiKTtidWZmZXI9QnVmZmVyLmZyb20ocGVtLCJiYXNlNjQiKX1lbHNle3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBrZXkgZm9ybWF0Iil9fWVsc2UgaWYoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKXtidWZmZXI9ZGF0YX1lbHNle3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBrZXkgZm9ybWF0Iil9dmFyIHJlYWRlcj1uZXcgYmVyLlJlYWRlcihidWZmZXIpO3JlYWRlci5yZWFkU2VxdWVuY2UoKTtyZWFkZXIucmVhZEludCgwKTt2YXIgaGVhZGVyPW5ldyBiZXIuUmVhZGVyKHJlYWRlci5yZWFkU3RyaW5nKDQ4LHRydWUpKTtpZihoZWFkZXIucmVhZE9JRCg2LHRydWUpIT09UFVCTElDX1JTQV9PSUQpe3Rocm93IEVycm9yKCJJbnZhbGlkIFB1YmxpYyBrZXkgZm9ybWF0Iil9dmFyIGJvZHk9bmV3IGJlci5SZWFkZXIocmVhZGVyLnJlYWRTdHJpbmcoNCx0cnVlKSk7Ym9keS5yZWFkU2VxdWVuY2UoKTtib2R5LnJlYWRTdHJpbmcoMix0cnVlKTtrZXkuc2V0UHJpdmF0ZShib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSl9LHB1YmxpY0V4cG9ydDpmdW5jdGlvbihrZXksb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgbj1rZXkubi50b0J1ZmZlcigpO3ZhciBsZW5ndGg9bi5sZW5ndGgrNTEyO3ZhciBib2R5V3JpdGVyPW5ldyBiZXIuV3JpdGVyKHtzaXplOmxlbmd0aH0pO2JvZHlXcml0ZXIud3JpdGVCeXRlKDApO2JvZHlXcml0ZXIuc3RhcnRTZXF1ZW5jZSgpO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIobiwyKTtib2R5V3JpdGVyLndyaXRlSW50KGtleS5lKTtib2R5V3JpdGVyLmVuZFNlcXVlbmNlKCk7dmFyIHdyaXRlcj1uZXcgYmVyLldyaXRlcih7c2l6ZTpsZW5ndGh9KTt3cml0ZXIuc3RhcnRTZXF1ZW5jZSgpO3dyaXRlci5zdGFydFNlcXVlbmNlKCk7d3JpdGVyLndyaXRlT0lEKFBVQkxJQ19SU0FfT0lEKTt3cml0ZXIud3JpdGVOdWxsKCk7d3JpdGVyLmVuZFNlcXVlbmNlKCk7d3JpdGVyLndyaXRlQnVmZmVyKGJvZHlXcml0ZXIuYnVmZmVyLDMpO3dyaXRlci5lbmRTZXF1ZW5jZSgpO2lmKG9wdGlvbnMudHlwZT09PSJkZXIiKXtyZXR1cm4gd3JpdGVyLmJ1ZmZlcn1lbHNle3JldHVybiBQVUJMSUNfT1BFTklOR19CT1VOREFSWSsiXG4iK3V0aWxzLmxpbmVicmsod3JpdGVyLmJ1ZmZlci50b1N0cmluZygiYmFzZTY0IiksNjQpKyJcbiIrUFVCTElDX0NMT1NJTkdfQk9VTkRBUll9fSxwdWJsaWNJbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEsb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgYnVmZmVyO2lmKG9wdGlvbnMudHlwZSE9PSJkZXIiKXtpZihCdWZmZXIuaXNCdWZmZXIoZGF0YSkpe2RhdGE9ZGF0YS50b1N0cmluZygidXRmOCIpfWlmKF8uaXNTdHJpbmcoZGF0YSkpe3ZhciBwZW09dXRpbHMudHJpbVN1cnJvdW5kaW5nVGV4dChkYXRhLFBVQkxJQ19PUEVOSU5HX0JPVU5EQVJZLFBVQkxJQ19DTE9TSU5HX0JPVU5EQVJZKS5yZXBsYWNlKC9ccyt8XG5ccnxcbnxcciQvZ20sIiIpO2J1ZmZlcj1CdWZmZXIuZnJvbShwZW0sImJhc2U2NCIpfX1lbHNlIGlmKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSl7YnVmZmVyPWRhdGF9ZWxzZXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQga2V5IGZvcm1hdCIpfXZhciByZWFkZXI9bmV3IGJlci5SZWFkZXIoYnVmZmVyKTtyZWFkZXIucmVhZFNlcXVlbmNlKCk7dmFyIGhlYWRlcj1uZXcgYmVyLlJlYWRlcihyZWFkZXIucmVhZFN0cmluZyg0OCx0cnVlKSk7aWYoaGVhZGVyLnJlYWRPSUQoNix0cnVlKSE9PVBVQkxJQ19SU0FfT0lEKXt0aHJvdyBFcnJvcigiSW52YWxpZCBQdWJsaWMga2V5IGZvcm1hdCIpfXZhciBib2R5PW5ldyBiZXIuUmVhZGVyKHJlYWRlci5yZWFkU3RyaW5nKDMsdHJ1ZSkpO2JvZHkucmVhZEJ5dGUoKTtib2R5LnJlYWRTZXF1ZW5jZSgpO2tleS5zZXRQdWJsaWMoYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSkpfSxhdXRvSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhKXtpZigvXltcU1xzXSotLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1ccyooPz0oKFtBLVphLXowLTkrLz1dK1xzKikrKSlcMS0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1bXFNcc10qJC9nLnRlc3QoZGF0YSkpe21vZHVsZS5leHBvcnRzLnByaXZhdGVJbXBvcnQoa2V5LGRhdGEpO3JldHVybiB0cnVlfWlmKC9eW1xTXHNdKi0tLS0tQkVHSU4gUFVCTElDIEtFWS0tLS0tXHMqKD89KChbQS1aYS16MC05Ky89XStccyopKykpXDEtLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1bXFNcc10qJC9nLnRlc3QoZGF0YSkpe21vZHVsZS5leHBvcnRzLnB1YmxpY0ltcG9ydChrZXksZGF0YSk7cmV0dXJuIHRydWV9cmV0dXJuIGZhbHNlfX19KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi91dGlscyI6NTgsYXNuMToxOSxidWZmZXI6Mjd9XSw1MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIGNyeXB0PXJlcXVpcmUoIi4uL2NyeXB0byIpO3ZhciBfPXJlcXVpcmUoIi4uL3V0aWxzIikuXzt2YXIgcGV0ZXJPbHNvbl9CaWdJbnRlZ2VyU3RhdGljPXJlcXVpcmUoImJpZy1pbnRlZ2VyIik7dmFyIGRiaXRzO3ZhciBjYW5hcnk9MHhkZWFkYmVlZmNhZmU7dmFyIGpfbG09KGNhbmFyeSYxNjc3NzIxNSk9PTE1NzE1MDcwO2Z1bmN0aW9uIEJpZ0ludGVnZXIoYSxiKXtpZihhIT1udWxsKXtpZigibnVtYmVyIj09dHlwZW9mIGEpe3RoaXMuZnJvbU51bWJlcihhLGIpfWVsc2UgaWYoQnVmZmVyLmlzQnVmZmVyKGEpKXt0aGlzLmZyb21CdWZmZXIoYSl9ZWxzZSBpZihiPT1udWxsJiYic3RyaW5nIiE9dHlwZW9mIGEpe3RoaXMuZnJvbUJ5dGVBcnJheShhKX1lbHNle3RoaXMuZnJvbVN0cmluZyhhLGIpfX19ZnVuY3Rpb24gbmJpKCl7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKG51bGwpfWZ1bmN0aW9uIGFtMShpLHgsdyxqLGMsbil7d2hpbGUoLS1uPj0wKXt2YXIgdj14KnRoaXNbaSsrXSt3W2pdK2M7Yz1NYXRoLmZsb29yKHYvNjcxMDg4NjQpO3dbaisrXT12JjY3MTA4ODYzfXJldHVybiBjfWZ1bmN0aW9uIGFtMihpLHgsdyxqLGMsbil7dmFyIHhsPXgmMzI3NjcseGg9eD4+MTU7d2hpbGUoLS1uPj0wKXt2YXIgbD10aGlzW2ldJjMyNzY3O3ZhciBoPXRoaXNbaSsrXT4+MTU7dmFyIG09eGgqbCtoKnhsO2w9eGwqbCsoKG0mMzI3NjcpPDwxNSkrd1tqXSsoYyYxMDczNzQxODIzKTtjPShsPj4+MzApKyhtPj4+MTUpK3hoKmgrKGM+Pj4zMCk7d1tqKytdPWwmMTA3Mzc0MTgyM31yZXR1cm4gY31mdW5jdGlvbiBhbTMoaSx4LHcsaixjLG4pe3ZhciB4bD14JjE2MzgzLHhoPXg+PjE0O3doaWxlKC0tbj49MCl7dmFyIGw9dGhpc1tpXSYxNjM4Mzt2YXIgaD10aGlzW2krK10+PjE0O3ZhciBtPXhoKmwraCp4bDtsPXhsKmwrKChtJjE2MzgzKTw8MTQpK3dbal0rYztjPShsPj4yOCkrKG0+PjE0KSt4aCpoO3dbaisrXT1sJjI2ODQzNTQ1NX1yZXR1cm4gY31CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbT1hbTM7ZGJpdHM9Mjg7QmlnSW50ZWdlci5wcm90b3R5cGUuREI9ZGJpdHM7QmlnSW50ZWdlci5wcm90b3R5cGUuRE09KDE8PGRiaXRzKS0xO0JpZ0ludGVnZXIucHJvdG90eXBlLkRWPTE8PGRiaXRzO3ZhciBCSV9GUD01MjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5GVj1NYXRoLnBvdygyLEJJX0ZQKTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5GMT1CSV9GUC1kYml0cztCaWdJbnRlZ2VyLnByb3RvdHlwZS5GMj0yKmRiaXRzLUJJX0ZQO3ZhciBCSV9STT0iMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Ijt2YXIgQklfUkM9bmV3IEFycmF5O3ZhciBycix2djtycj0iMCIuY2hhckNvZGVBdCgwKTtmb3IodnY9MDt2djw9OTsrK3Z2KUJJX1JDW3JyKytdPXZ2O3JyPSJhIi5jaGFyQ29kZUF0KDApO2Zvcih2dj0xMDt2djwzNjsrK3Z2KUJJX1JDW3JyKytdPXZ2O3JyPSJBIi5jaGFyQ29kZUF0KDApO2Zvcih2dj0xMDt2djwzNjsrK3Z2KUJJX1JDW3JyKytdPXZ2O2Z1bmN0aW9uIGludDJjaGFyKG4pe3JldHVybiBCSV9STS5jaGFyQXQobil9ZnVuY3Rpb24gaW50QXQocyxpKXt2YXIgYz1CSV9SQ1tzLmNoYXJDb2RlQXQoaSldO3JldHVybiBjPT1udWxsPy0xOmN9ZnVuY3Rpb24gYm5wQ29weVRvKHIpe2Zvcih2YXIgaT10aGlzLnQtMTtpPj0wOy0taSlyW2ldPXRoaXNbaV07ci50PXRoaXMudDtyLnM9dGhpcy5zfWZ1bmN0aW9uIGJucEZyb21JbnQoeCl7dGhpcy50PTE7dGhpcy5zPXg8MD8tMTowO2lmKHg+MCl0aGlzWzBdPXg7ZWxzZSBpZih4PC0xKXRoaXNbMF09eCtEVjtlbHNlIHRoaXMudD0wfWZ1bmN0aW9uIG5idihpKXt2YXIgcj1uYmkoKTtyLmZyb21JbnQoaSk7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5wRnJvbVN0cmluZyhkYXRhLHJhZGl4LHVuc2lnbmVkKXt2YXIgaztzd2l0Y2gocmFkaXgpe2Nhc2UgMjprPTE7YnJlYWs7Y2FzZSA0Oms9MjticmVhaztjYXNlIDg6az0zO2JyZWFrO2Nhc2UgMTY6az00O2JyZWFrO2Nhc2UgMzI6az01O2JyZWFrO2Nhc2UgMjU2Oms9ODticmVhaztkZWZhdWx0OnRoaXMuZnJvbVJhZGl4KGRhdGEscmFkaXgpO3JldHVybn10aGlzLnQ9MDt0aGlzLnM9MDt2YXIgaT1kYXRhLmxlbmd0aDt2YXIgbWk9ZmFsc2U7dmFyIHNoPTA7d2hpbGUoLS1pPj0wKXt2YXIgeD1rPT04P2RhdGFbaV0mMjU1OmludEF0KGRhdGEsaSk7aWYoeDwwKXtpZihkYXRhLmNoYXJBdChpKT09Ii0iKW1pPXRydWU7Y29udGludWV9bWk9ZmFsc2U7aWYoc2g9PT0wKXRoaXNbdGhpcy50KytdPXg7ZWxzZSBpZihzaCtrPnRoaXMuREIpe3RoaXNbdGhpcy50LTFdfD0oeCYoMTw8dGhpcy5EQi1zaCktMSk8PHNoO3RoaXNbdGhpcy50KytdPXg+PnRoaXMuREItc2h9ZWxzZSB0aGlzW3RoaXMudC0xXXw9eDw8c2g7c2grPWs7aWYoc2g+PXRoaXMuREIpc2gtPXRoaXMuREJ9aWYoIXVuc2lnbmVkJiZrPT04JiYoZGF0YVswXSYxMjgpIT0wKXt0aGlzLnM9LTE7aWYoc2g+MCl0aGlzW3RoaXMudC0xXXw9KDE8PHRoaXMuREItc2gpLTE8PHNofXRoaXMuY2xhbXAoKTtpZihtaSlCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcyx0aGlzKX1mdW5jdGlvbiBibnBGcm9tQnl0ZUFycmF5KGEsdW5zaWduZWQpe3RoaXMuZnJvbVN0cmluZyhhLDI1Nix1bnNpZ25lZCl9ZnVuY3Rpb24gYm5wRnJvbUJ1ZmZlcihhKXt0aGlzLmZyb21TdHJpbmcoYSwyNTYsdHJ1ZSl9ZnVuY3Rpb24gYm5wQ2xhbXAoKXt2YXIgYz10aGlzLnMmdGhpcy5ETTt3aGlsZSh0aGlzLnQ+MCYmdGhpc1t0aGlzLnQtMV09PWMpLS10aGlzLnR9ZnVuY3Rpb24gYm5Ub1N0cmluZyhiKXtpZih0aGlzLnM8MClyZXR1cm4iLSIrdGhpcy5uZWdhdGUoKS50b1N0cmluZyhiKTt2YXIgaztpZihiPT0xNilrPTQ7ZWxzZSBpZihiPT04KWs9MztlbHNlIGlmKGI9PTIpaz0xO2Vsc2UgaWYoYj09MzIpaz01O2Vsc2UgaWYoYj09NClrPTI7ZWxzZSByZXR1cm4gdGhpcy50b1JhZGl4KGIpO3ZhciBrbT0oMTw8ayktMSxkLG09ZmFsc2Uscj0iIixpPXRoaXMudDt2YXIgcD10aGlzLkRCLWkqdGhpcy5EQiVrO2lmKGktLSA+MCl7aWYocDx0aGlzLkRCJiYoZD10aGlzW2ldPj5wKT4wKXttPXRydWU7cj1pbnQyY2hhcihkKX13aGlsZShpPj0wKXtpZihwPGspe2Q9KHRoaXNbaV0mKDE8PHApLTEpPDxrLXA7ZHw9dGhpc1stLWldPj4ocCs9dGhpcy5EQi1rKX1lbHNle2Q9dGhpc1tpXT4+KHAtPWspJmttO2lmKHA8PTApe3ArPXRoaXMuREI7LS1pfX1pZihkPjApbT10cnVlO2lmKG0pcis9aW50MmNoYXIoZCl9fXJldHVybiBtP3I6IjAifWZ1bmN0aW9uIGJuTmVnYXRlKCl7dmFyIHI9bmJpKCk7QmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMscik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5BYnMoKXtyZXR1cm4gdGhpcy5zPDA/dGhpcy5uZWdhdGUoKTp0aGlzfWZ1bmN0aW9uIGJuQ29tcGFyZVRvKGEpe3ZhciByPXRoaXMucy1hLnM7aWYociE9MClyZXR1cm4gcjt2YXIgaT10aGlzLnQ7cj1pLWEudDtpZihyIT0wKXJldHVybiB0aGlzLnM8MD8tcjpyO3doaWxlKC0taT49MClpZigocj10aGlzW2ldLWFbaV0pIT0wKXJldHVybiByO3JldHVybiAwfWZ1bmN0aW9uIG5iaXRzKHgpe3ZhciByPTEsdDtpZigodD14Pj4+MTYpIT0wKXt4PXQ7cis9MTZ9aWYoKHQ9eD4+OCkhPTApe3g9dDtyKz04fWlmKCh0PXg+PjQpIT0wKXt4PXQ7cis9NH1pZigodD14Pj4yKSE9MCl7eD10O3IrPTJ9aWYoKHQ9eD4+MSkhPTApe3g9dDtyKz0xfXJldHVybiByfWZ1bmN0aW9uIGJuQml0TGVuZ3RoKCl7aWYodGhpcy50PD0wKXJldHVybiAwO3JldHVybiB0aGlzLkRCKih0aGlzLnQtMSkrbmJpdHModGhpc1t0aGlzLnQtMV1edGhpcy5zJnRoaXMuRE0pfWZ1bmN0aW9uIGJucERMU2hpZnRUbyhuLHIpe3ZhciBpO2ZvcihpPXRoaXMudC0xO2k+PTA7LS1pKXJbaStuXT10aGlzW2ldO2ZvcihpPW4tMTtpPj0wOy0taSlyW2ldPTA7ci50PXRoaXMudCtuO3Iucz10aGlzLnN9ZnVuY3Rpb24gYm5wRFJTaGlmdFRvKG4scil7Zm9yKHZhciBpPW47aTx0aGlzLnQ7KytpKXJbaS1uXT10aGlzW2ldO3IudD1NYXRoLm1heCh0aGlzLnQtbiwwKTtyLnM9dGhpcy5zfWZ1bmN0aW9uIGJucExTaGlmdFRvKG4scil7dmFyIGJzPW4ldGhpcy5EQjt2YXIgY2JzPXRoaXMuREItYnM7dmFyIGJtPSgxPDxjYnMpLTE7dmFyIGRzPU1hdGguZmxvb3Iobi90aGlzLkRCKSxjPXRoaXMuczw8YnMmdGhpcy5ETSxpO2ZvcihpPXRoaXMudC0xO2k+PTA7LS1pKXtyW2krZHMrMV09dGhpc1tpXT4+Y2JzfGM7Yz0odGhpc1tpXSZibSk8PGJzfWZvcihpPWRzLTE7aT49MDstLWkpcltpXT0wO3JbZHNdPWM7ci50PXRoaXMudCtkcysxO3Iucz10aGlzLnM7ci5jbGFtcCgpfWZ1bmN0aW9uIGJucFJTaGlmdFRvKG4scil7ci5zPXRoaXMuczt2YXIgZHM9TWF0aC5mbG9vcihuL3RoaXMuREIpO2lmKGRzPj10aGlzLnQpe3IudD0wO3JldHVybn12YXIgYnM9biV0aGlzLkRCO3ZhciBjYnM9dGhpcy5EQi1iczt2YXIgYm09KDE8PGJzKS0xO3JbMF09dGhpc1tkc10+PmJzO2Zvcih2YXIgaT1kcysxO2k8dGhpcy50OysraSl7cltpLWRzLTFdfD0odGhpc1tpXSZibSk8PGNicztyW2ktZHNdPXRoaXNbaV0+PmJzfWlmKGJzPjApclt0aGlzLnQtZHMtMV18PSh0aGlzLnMmYm0pPDxjYnM7ci50PXRoaXMudC1kcztyLmNsYW1wKCl9ZnVuY3Rpb24gYm5wU3ViVG8oYSxyKXt2YXIgaT0wLGM9MCxtPU1hdGgubWluKGEudCx0aGlzLnQpO3doaWxlKGk8bSl7Yys9dGhpc1tpXS1hW2ldO3JbaSsrXT1jJnRoaXMuRE07Yz4+PXRoaXMuREJ9aWYoYS50PHRoaXMudCl7Yy09YS5zO3doaWxlKGk8dGhpcy50KXtjKz10aGlzW2ldO3JbaSsrXT1jJnRoaXMuRE07Yz4+PXRoaXMuREJ9Yys9dGhpcy5zfWVsc2V7Yys9dGhpcy5zO3doaWxlKGk8YS50KXtjLT1hW2ldO3JbaSsrXT1jJnRoaXMuRE07Yz4+PXRoaXMuREJ9Yy09YS5zfXIucz1jPDA/LTE6MDtpZihjPC0xKXJbaSsrXT10aGlzLkRWK2M7ZWxzZSBpZihjPjApcltpKytdPWM7ci50PWk7ci5jbGFtcCgpfWZ1bmN0aW9uIGJucE11bHRpcGx5VG8oYSxyKXt2YXIgeD10aGlzLmFicygpLHk9YS5hYnMoKTt2YXIgaT14LnQ7ci50PWkreS50O3doaWxlKC0taT49MClyW2ldPTA7Zm9yKGk9MDtpPHkudDsrK2kpcltpK3gudF09eC5hbSgwLHlbaV0scixpLDAseC50KTtyLnM9MDtyLmNsYW1wKCk7aWYodGhpcy5zIT1hLnMpQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIscil9ZnVuY3Rpb24gYm5wU3F1YXJlVG8ocil7dmFyIHg9dGhpcy5hYnMoKTt2YXIgaT1yLnQ9Mip4LnQ7d2hpbGUoLS1pPj0wKXJbaV09MDtmb3IoaT0wO2k8eC50LTE7KytpKXt2YXIgYz14LmFtKGkseFtpXSxyLDIqaSwwLDEpO2lmKChyW2kreC50XSs9eC5hbShpKzEsMip4W2ldLHIsMippKzEsYyx4LnQtaS0xKSk+PXguRFYpe3JbaSt4LnRdLT14LkRWO3JbaSt4LnQrMV09MX19aWYoci50PjApcltyLnQtMV0rPXguYW0oaSx4W2ldLHIsMippLDAsMSk7ci5zPTA7ci5jbGFtcCgpfWZ1bmN0aW9uIGJucERpdlJlbVRvKG0scSxyKXt2YXIgcG09bS5hYnMoKTtpZihwbS50PD0wKXJldHVybjt2YXIgcHQ9dGhpcy5hYnMoKTtpZihwdC50PHBtLnQpe2lmKHEhPW51bGwpcS5mcm9tSW50KDApO2lmKHIhPW51bGwpdGhpcy5jb3B5VG8ocik7cmV0dXJufWlmKHI9PW51bGwpcj1uYmkoKTt2YXIgeT1uYmkoKSx0cz10aGlzLnMsbXM9bS5zO3ZhciBuc2g9dGhpcy5EQi1uYml0cyhwbVtwbS50LTFdKTtpZihuc2g+MCl7cG0ubFNoaWZ0VG8obnNoLHkpO3B0LmxTaGlmdFRvKG5zaCxyKX1lbHNle3BtLmNvcHlUbyh5KTtwdC5jb3B5VG8ocil9dmFyIHlzPXkudDt2YXIgeTA9eVt5cy0xXTtpZih5MD09PTApcmV0dXJuO3ZhciB5dD15MCooMTw8dGhpcy5GMSkrKHlzPjE/eVt5cy0yXT4+dGhpcy5GMjowKTt2YXIgZDE9dGhpcy5GVi95dCxkMj0oMTw8dGhpcy5GMSkveXQsZT0xPDx0aGlzLkYyO3ZhciBpPXIudCxqPWkteXMsdD1xPT1udWxsP25iaSgpOnE7eS5kbFNoaWZ0VG8oaix0KTtpZihyLmNvbXBhcmVUbyh0KT49MCl7cltyLnQrK109MTtyLnN1YlRvKHQscil9QmlnSW50ZWdlci5PTkUuZGxTaGlmdFRvKHlzLHQpO3Quc3ViVG8oeSx5KTt3aGlsZSh5LnQ8eXMpeVt5LnQrK109MDt3aGlsZSgtLWo+PTApe3ZhciBxZD1yWy0taV09PXkwP3RoaXMuRE06TWF0aC5mbG9vcihyW2ldKmQxKyhyW2ktMV0rZSkqZDIpO2lmKChyW2ldKz15LmFtKDAscWQscixqLDAseXMpKTxxZCl7eS5kbFNoaWZ0VG8oaix0KTtyLnN1YlRvKHQscik7d2hpbGUocltpXTwtLXFkKXIuc3ViVG8odCxyKX19aWYocSE9bnVsbCl7ci5kclNoaWZ0VG8oeXMscSk7aWYodHMhPW1zKUJpZ0ludGVnZXIuWkVSTy5zdWJUbyhxLHEpfXIudD15cztyLmNsYW1wKCk7aWYobnNoPjApci5yU2hpZnRUbyhuc2gscik7aWYodHM8MClCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ocixyKX1mdW5jdGlvbiBibk1vZChhKXt2YXIgcj1uYmkoKTt0aGlzLmFicygpLmRpdlJlbVRvKGEsbnVsbCxyKTtpZih0aGlzLnM8MCYmci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKT4wKWEuc3ViVG8ocixyKTtyZXR1cm4gcn1mdW5jdGlvbiBDbGFzc2ljKG0pe3RoaXMubT1tfWZ1bmN0aW9uIGNDb252ZXJ0KHgpe2lmKHguczwwfHx4LmNvbXBhcmVUbyh0aGlzLm0pPj0wKXJldHVybiB4Lm1vZCh0aGlzLm0pO2Vsc2UgcmV0dXJuIHh9ZnVuY3Rpb24gY1JldmVydCh4KXtyZXR1cm4geH1mdW5jdGlvbiBjUmVkdWNlKHgpe3guZGl2UmVtVG8odGhpcy5tLG51bGwseCl9ZnVuY3Rpb24gY011bFRvKHgseSxyKXt4Lm11bHRpcGx5VG8oeSxyKTt0aGlzLnJlZHVjZShyKX1mdW5jdGlvbiBjU3FyVG8oeCxyKXt4LnNxdWFyZVRvKHIpO3RoaXMucmVkdWNlKHIpfUNsYXNzaWMucHJvdG90eXBlLmNvbnZlcnQ9Y0NvbnZlcnQ7Q2xhc3NpYy5wcm90b3R5cGUucmV2ZXJ0PWNSZXZlcnQ7Q2xhc3NpYy5wcm90b3R5cGUucmVkdWNlPWNSZWR1Y2U7Q2xhc3NpYy5wcm90b3R5cGUubXVsVG89Y011bFRvO0NsYXNzaWMucHJvdG90eXBlLnNxclRvPWNTcXJUbztmdW5jdGlvbiBibnBJbnZEaWdpdCgpe2lmKHRoaXMudDwxKXJldHVybiAwO3ZhciB4PXRoaXNbMF07aWYoKHgmMSk9PT0wKXJldHVybiAwO3ZhciB5PXgmMzt5PXkqKDItKHgmMTUpKnkpJjE1O3k9eSooMi0oeCYyNTUpKnkpJjI1NTt5PXkqKDItKCh4JjY1NTM1KSp5JjY1NTM1KSkmNjU1MzU7eT15KigyLXgqeSV0aGlzLkRWKSV0aGlzLkRWO3JldHVybiB5PjA/dGhpcy5EVi15Oi15fWZ1bmN0aW9uIE1vbnRnb21lcnkobSl7dGhpcy5tPW07dGhpcy5tcD1tLmludkRpZ2l0KCk7dGhpcy5tcGw9dGhpcy5tcCYzMjc2Nzt0aGlzLm1waD10aGlzLm1wPj4xNTt0aGlzLnVtPSgxPDxtLkRCLTE1KS0xO3RoaXMubXQyPTIqbS50fWZ1bmN0aW9uIG1vbnRDb252ZXJ0KHgpe3ZhciByPW5iaSgpO3guYWJzKCkuZGxTaGlmdFRvKHRoaXMubS50LHIpO3IuZGl2UmVtVG8odGhpcy5tLG51bGwscik7aWYoeC5zPDAmJnIuY29tcGFyZVRvKEJpZ0ludGVnZXIuWkVSTyk+MCl0aGlzLm0uc3ViVG8ocixyKTtyZXR1cm4gcn1mdW5jdGlvbiBtb250UmV2ZXJ0KHgpe3ZhciByPW5iaSgpO3guY29weVRvKHIpO3RoaXMucmVkdWNlKHIpO3JldHVybiByfWZ1bmN0aW9uIG1vbnRSZWR1Y2UoeCl7d2hpbGUoeC50PD10aGlzLm10Mil4W3gudCsrXT0wO2Zvcih2YXIgaT0wO2k8dGhpcy5tLnQ7KytpKXt2YXIgaj14W2ldJjMyNzY3O3ZhciB1MD1qKnRoaXMubXBsKygoaip0aGlzLm1waCsoeFtpXT4+MTUpKnRoaXMubXBsJnRoaXMudW0pPDwxNSkmeC5ETTtqPWkrdGhpcy5tLnQ7eFtqXSs9dGhpcy5tLmFtKDAsdTAseCxpLDAsdGhpcy5tLnQpO3doaWxlKHhbal0+PXguRFYpe3hbal0tPXguRFY7eFsrK2pdKyt9fXguY2xhbXAoKTt4LmRyU2hpZnRUbyh0aGlzLm0udCx4KTtpZih4LmNvbXBhcmVUbyh0aGlzLm0pPj0wKXguc3ViVG8odGhpcy5tLHgpfWZ1bmN0aW9uIG1vbnRTcXJUbyh4LHIpe3guc3F1YXJlVG8ocik7dGhpcy5yZWR1Y2Uocil9ZnVuY3Rpb24gbW9udE11bFRvKHgseSxyKXt4Lm11bHRpcGx5VG8oeSxyKTt0aGlzLnJlZHVjZShyKX1Nb250Z29tZXJ5LnByb3RvdHlwZS5jb252ZXJ0PW1vbnRDb252ZXJ0O01vbnRnb21lcnkucHJvdG90eXBlLnJldmVydD1tb250UmV2ZXJ0O01vbnRnb21lcnkucHJvdG90eXBlLnJlZHVjZT1tb250UmVkdWNlO01vbnRnb21lcnkucHJvdG90eXBlLm11bFRvPW1vbnRNdWxUbztNb250Z29tZXJ5LnByb3RvdHlwZS5zcXJUbz1tb250U3FyVG87ZnVuY3Rpb24gYm5wSXNFdmVuKCl7cmV0dXJuKHRoaXMudD4wP3RoaXNbMF0mMTp0aGlzLnMpPT09MH1mdW5jdGlvbiBibnBFeHAoZSx6KXtpZihlPjQyOTQ5NjcyOTV8fGU8MSlyZXR1cm4gQmlnSW50ZWdlci5PTkU7dmFyIHI9bmJpKCkscjI9bmJpKCksZz16LmNvbnZlcnQodGhpcyksaT1uYml0cyhlKS0xO2cuY29weVRvKHIpO3doaWxlKC0taT49MCl7ei5zcXJUbyhyLHIyKTtpZigoZSYxPDxpKT4wKXoubXVsVG8ocjIsZyxyKTtlbHNle3ZhciB0PXI7cj1yMjtyMj10fX1yZXR1cm4gei5yZXZlcnQocil9ZnVuY3Rpb24gYm5Nb2RQb3dJbnQoZSxtKXt2YXIgejtpZihlPDI1Nnx8bS5pc0V2ZW4oKSl6PW5ldyBDbGFzc2ljKG0pO2Vsc2Ugej1uZXcgTW9udGdvbWVyeShtKTtyZXR1cm4gdGhpcy5leHAoZSx6KX1mdW5jdGlvbiBibkNsb25lKCl7dmFyIHI9bmJpKCk7dGhpcy5jb3B5VG8ocik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5JbnRWYWx1ZSgpe2lmKHRoaXMuczwwKXtpZih0aGlzLnQ9PTEpcmV0dXJuIHRoaXNbMF0tdGhpcy5EVjtlbHNlIGlmKHRoaXMudD09PTApcmV0dXJuLTF9ZWxzZSBpZih0aGlzLnQ9PTEpcmV0dXJuIHRoaXNbMF07ZWxzZSBpZih0aGlzLnQ9PT0wKXJldHVybiAwO3JldHVybih0aGlzWzFdJigxPDwzMi10aGlzLkRCKS0xKTw8dGhpcy5EQnx0aGlzWzBdfWZ1bmN0aW9uIGJuQnl0ZVZhbHVlKCl7cmV0dXJuIHRoaXMudD09MD90aGlzLnM6dGhpc1swXTw8MjQ+PjI0fWZ1bmN0aW9uIGJuU2hvcnRWYWx1ZSgpe3JldHVybiB0aGlzLnQ9PTA/dGhpcy5zOnRoaXNbMF08PDE2Pj4xNn1mdW5jdGlvbiBibnBDaHVua1NpemUocil7cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5MTjIqdGhpcy5EQi9NYXRoLmxvZyhyKSl9ZnVuY3Rpb24gYm5TaWdOdW0oKXtpZih0aGlzLnM8MClyZXR1cm4tMTtlbHNlIGlmKHRoaXMudDw9MHx8dGhpcy50PT0xJiZ0aGlzWzBdPD0wKXJldHVybiAwO2Vsc2UgcmV0dXJuIDF9ZnVuY3Rpb24gYm5wVG9SYWRpeChiKXtpZihiPT1udWxsKWI9MTA7aWYodGhpcy5zaWdudW0oKT09PTB8fGI8Mnx8Yj4zNilyZXR1cm4iMCI7dmFyIGNzPXRoaXMuY2h1bmtTaXplKGIpO3ZhciBhPU1hdGgucG93KGIsY3MpO3ZhciBkPW5idihhKSx5PW5iaSgpLHo9bmJpKCkscj0iIjt0aGlzLmRpdlJlbVRvKGQseSx6KTt3aGlsZSh5LnNpZ251bSgpPjApe3I9KGErei5pbnRWYWx1ZSgpKS50b1N0cmluZyhiKS5zdWJzdHIoMSkrcjt5LmRpdlJlbVRvKGQseSx6KX1yZXR1cm4gei5pbnRWYWx1ZSgpLnRvU3RyaW5nKGIpK3J9ZnVuY3Rpb24gYm5wRnJvbVJhZGl4KHMsYil7dGhpcy5mcm9tSW50KDApO2lmKGI9PW51bGwpYj0xMDt2YXIgY3M9dGhpcy5jaHVua1NpemUoYik7dmFyIGQ9TWF0aC5wb3coYixjcyksbWk9ZmFsc2Usaj0wLHc9MDtmb3IodmFyIGk9MDtpPHMubGVuZ3RoOysraSl7dmFyIHg9aW50QXQocyxpKTtpZih4PDApe2lmKHMuY2hhckF0KGkpPT0iLSImJnRoaXMuc2lnbnVtKCk9PT0wKW1pPXRydWU7Y29udGludWV9dz1iKncreDtpZigrK2o+PWNzKXt0aGlzLmRNdWx0aXBseShkKTt0aGlzLmRBZGRPZmZzZXQodywwKTtqPTA7dz0wfX1pZihqPjApe3RoaXMuZE11bHRpcGx5KE1hdGgucG93KGIsaikpO3RoaXMuZEFkZE9mZnNldCh3LDApfWlmKG1pKUJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLHRoaXMpfWZ1bmN0aW9uIGJucEZyb21OdW1iZXIoYSxiKXtpZigibnVtYmVyIj09dHlwZW9mIGIpe2lmKGE8Mil0aGlzLmZyb21JbnQoMSk7ZWxzZXt0aGlzLmZyb21OdW1iZXIoYSk7aWYoIXRoaXMudGVzdEJpdChhLTEpKXRoaXMuYml0d2lzZVRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhLTEpLG9wX29yLHRoaXMpO2lmKHRoaXMuaXNFdmVuKCkpdGhpcy5kQWRkT2Zmc2V0KDEsMCk7d2hpbGUoIXRoaXMuaXNQcm9iYWJsZVByaW1lKGIpKXt0aGlzLmRBZGRPZmZzZXQoMiwwKTtpZih0aGlzLmJpdExlbmd0aCgpPmEpdGhpcy5zdWJUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYS0xKSx0aGlzKX19fWVsc2V7dmFyIHg9Y3J5cHQucmFuZG9tQnl0ZXMoKGE+PjMpKzEpO3ZhciB0PWEmNztpZih0PjApeFswXSY9KDE8PHQpLTE7ZWxzZSB4WzBdPTA7dGhpcy5mcm9tQnl0ZUFycmF5KHgpfX1mdW5jdGlvbiBiblRvQnl0ZUFycmF5KCl7dmFyIGk9dGhpcy50LHI9bmV3IEFycmF5O3JbMF09dGhpcy5zO3ZhciBwPXRoaXMuREItaSp0aGlzLkRCJTgsZCxrPTA7aWYoaS0tID4wKXtpZihwPHRoaXMuREImJihkPXRoaXNbaV0+PnApIT0odGhpcy5zJnRoaXMuRE0pPj5wKXJbaysrXT1kfHRoaXMuczw8dGhpcy5EQi1wO3doaWxlKGk+PTApe2lmKHA8OCl7ZD0odGhpc1tpXSYoMTw8cCktMSk8PDgtcDtkfD10aGlzWy0taV0+PihwKz10aGlzLkRCLTgpfWVsc2V7ZD10aGlzW2ldPj4ocC09OCkmMjU1O2lmKHA8PTApe3ArPXRoaXMuREI7LS1pfX1pZigoZCYxMjgpIT0wKWR8PS0yNTY7aWYoaz09PTAmJih0aGlzLnMmMTI4KSE9KGQmMTI4KSkrK2s7aWYoaz4wfHxkIT10aGlzLnMpcltrKytdPWR9fXJldHVybiByfWZ1bmN0aW9uIGJuVG9CdWZmZXIodHJpbU9yU2l6ZSl7dmFyIHJlcz1CdWZmZXIuZnJvbSh0aGlzLnRvQnl0ZUFycmF5KCkpO2lmKHRyaW1PclNpemU9PT10cnVlJiZyZXNbMF09PT0wKXtyZXM9cmVzLnNsaWNlKDEpfWVsc2UgaWYoXy5pc051bWJlcih0cmltT3JTaXplKSl7aWYocmVzLmxlbmd0aD50cmltT3JTaXplKXtmb3IodmFyIGk9MDtpPHJlcy5sZW5ndGgtdHJpbU9yU2l6ZTtpKyspe2lmKHJlc1tpXSE9PTApe3JldHVybiBudWxsfX1yZXR1cm4gcmVzLnNsaWNlKHJlcy5sZW5ndGgtdHJpbU9yU2l6ZSl9ZWxzZSBpZihyZXMubGVuZ3RoPHRyaW1PclNpemUpe3ZhciBwYWRkZWQ9QnVmZmVyLmFsbG9jKHRyaW1PclNpemUpO3BhZGRlZC5maWxsKDAsMCx0cmltT3JTaXplLXJlcy5sZW5ndGgpO3Jlcy5jb3B5KHBhZGRlZCx0cmltT3JTaXplLXJlcy5sZW5ndGgpO3JldHVybiBwYWRkZWR9fXJldHVybiByZXN9ZnVuY3Rpb24gYm5FcXVhbHMoYSl7cmV0dXJuIHRoaXMuY29tcGFyZVRvKGEpPT0wfWZ1bmN0aW9uIGJuTWluKGEpe3JldHVybiB0aGlzLmNvbXBhcmVUbyhhKTwwP3RoaXM6YX1mdW5jdGlvbiBibk1heChhKXtyZXR1cm4gdGhpcy5jb21wYXJlVG8oYSk+MD90aGlzOmF9ZnVuY3Rpb24gYm5wQml0d2lzZVRvKGEsb3Ascil7dmFyIGksZixtPU1hdGgubWluKGEudCx0aGlzLnQpO2ZvcihpPTA7aTxtOysraSlyW2ldPW9wKHRoaXNbaV0sYVtpXSk7aWYoYS50PHRoaXMudCl7Zj1hLnMmdGhpcy5ETTtmb3IoaT1tO2k8dGhpcy50OysraSlyW2ldPW9wKHRoaXNbaV0sZik7ci50PXRoaXMudH1lbHNle2Y9dGhpcy5zJnRoaXMuRE07Zm9yKGk9bTtpPGEudDsrK2kpcltpXT1vcChmLGFbaV0pO3IudD1hLnR9ci5zPW9wKHRoaXMucyxhLnMpO3IuY2xhbXAoKX1mdW5jdGlvbiBvcF9hbmQoeCx5KXtyZXR1cm4geCZ5fWZ1bmN0aW9uIGJuQW5kKGEpe3ZhciByPW5iaSgpO3RoaXMuYml0d2lzZVRvKGEsb3BfYW5kLHIpO3JldHVybiByfWZ1bmN0aW9uIG9wX29yKHgseSl7cmV0dXJuIHh8eX1mdW5jdGlvbiBibk9yKGEpe3ZhciByPW5iaSgpO3RoaXMuYml0d2lzZVRvKGEsb3Bfb3Iscik7cmV0dXJuIHJ9ZnVuY3Rpb24gb3BfeG9yKHgseSl7cmV0dXJuIHheeX1mdW5jdGlvbiBiblhvcihhKXt2YXIgcj1uYmkoKTt0aGlzLmJpdHdpc2VUbyhhLG9wX3hvcixyKTtyZXR1cm4gcn1mdW5jdGlvbiBvcF9hbmRub3QoeCx5KXtyZXR1cm4geCZ+eX1mdW5jdGlvbiBibkFuZE5vdChhKXt2YXIgcj1uYmkoKTt0aGlzLmJpdHdpc2VUbyhhLG9wX2FuZG5vdCxyKTtyZXR1cm4gcn1mdW5jdGlvbiBibk5vdCgpe3ZhciByPW5iaSgpO2Zvcih2YXIgaT0wO2k8dGhpcy50OysraSlyW2ldPXRoaXMuRE0mfnRoaXNbaV07ci50PXRoaXMudDtyLnM9fnRoaXMucztyZXR1cm4gcn1mdW5jdGlvbiBiblNoaWZ0TGVmdChuKXt2YXIgcj1uYmkoKTtpZihuPDApdGhpcy5yU2hpZnRUbygtbixyKTtlbHNlIHRoaXMubFNoaWZ0VG8obixyKTtyZXR1cm4gcn1mdW5jdGlvbiBiblNoaWZ0UmlnaHQobil7dmFyIHI9bmJpKCk7aWYobjwwKXRoaXMubFNoaWZ0VG8oLW4scik7ZWxzZSB0aGlzLnJTaGlmdFRvKG4scik7cmV0dXJuIHJ9ZnVuY3Rpb24gbGJpdCh4KXtpZih4PT09MClyZXR1cm4tMTt2YXIgcj0wO2lmKCh4JjY1NTM1KT09PTApe3g+Pj0xNjtyKz0xNn1pZigoeCYyNTUpPT09MCl7eD4+PTg7cis9OH1pZigoeCYxNSk9PT0wKXt4Pj49NDtyKz00fWlmKCh4JjMpPT09MCl7eD4+PTI7cis9Mn1pZigoeCYxKT09PTApKytyO3JldHVybiByfWZ1bmN0aW9uIGJuR2V0TG93ZXN0U2V0Qml0KCl7Zm9yKHZhciBpPTA7aTx0aGlzLnQ7KytpKWlmKHRoaXNbaV0hPTApcmV0dXJuIGkqdGhpcy5EQitsYml0KHRoaXNbaV0pO2lmKHRoaXMuczwwKXJldHVybiB0aGlzLnQqdGhpcy5EQjtyZXR1cm4tMX1mdW5jdGlvbiBjYml0KHgpe3ZhciByPTA7d2hpbGUoeCE9MCl7eCY9eC0xOysrcn1yZXR1cm4gcn1mdW5jdGlvbiBibkJpdENvdW50KCl7dmFyIHI9MCx4PXRoaXMucyZ0aGlzLkRNO2Zvcih2YXIgaT0wO2k8dGhpcy50OysraSlyKz1jYml0KHRoaXNbaV1eeCk7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5UZXN0Qml0KG4pe3ZhciBqPU1hdGguZmxvb3Iobi90aGlzLkRCKTtpZihqPj10aGlzLnQpcmV0dXJuIHRoaXMucyE9MDtyZXR1cm4odGhpc1tqXSYxPDxuJXRoaXMuREIpIT0wfWZ1bmN0aW9uIGJucENoYW5nZUJpdChuLG9wKXt2YXIgcj1CaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQobik7dGhpcy5iaXR3aXNlVG8ocixvcCxyKTtyZXR1cm4gcn1mdW5jdGlvbiBiblNldEJpdChuKXtyZXR1cm4gdGhpcy5jaGFuZ2VCaXQobixvcF9vcil9ZnVuY3Rpb24gYm5DbGVhckJpdChuKXtyZXR1cm4gdGhpcy5jaGFuZ2VCaXQobixvcF9hbmRub3QpfWZ1bmN0aW9uIGJuRmxpcEJpdChuKXtyZXR1cm4gdGhpcy5jaGFuZ2VCaXQobixvcF94b3IpfWZ1bmN0aW9uIGJucEFkZFRvKGEscil7dmFyIGk9MCxjPTAsbT1NYXRoLm1pbihhLnQsdGhpcy50KTt3aGlsZShpPG0pe2MrPXRoaXNbaV0rYVtpXTtyW2krK109YyZ0aGlzLkRNO2M+Pj10aGlzLkRCfWlmKGEudDx0aGlzLnQpe2MrPWEuczt3aGlsZShpPHRoaXMudCl7Yys9dGhpc1tpXTtyW2krK109YyZ0aGlzLkRNO2M+Pj10aGlzLkRCfWMrPXRoaXMuc31lbHNle2MrPXRoaXMuczt3aGlsZShpPGEudCl7Yys9YVtpXTtyW2krK109YyZ0aGlzLkRNO2M+Pj10aGlzLkRCfWMrPWEuc31yLnM9YzwwPy0xOjA7aWYoYz4wKXJbaSsrXT1jO2Vsc2UgaWYoYzwtMSlyW2krK109dGhpcy5EVitjO3IudD1pO3IuY2xhbXAoKX1mdW5jdGlvbiBibkFkZChhKXt2YXIgcj1uYmkoKTt0aGlzLmFkZFRvKGEscik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5TdWJ0cmFjdChhKXt2YXIgcj1uYmkoKTt0aGlzLnN1YlRvKGEscik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5NdWx0aXBseShhKXt2YXIgcj1uYmkoKTt0aGlzLm11bHRpcGx5VG8oYSxyKTtyZXR1cm4gcn1mdW5jdGlvbiBiblNxdWFyZSgpe3ZhciByPW5iaSgpO3RoaXMuc3F1YXJlVG8ocik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5EaXZpZGUoYSl7dmFyIHI9bmJpKCk7dGhpcy5kaXZSZW1UbyhhLHIsbnVsbCk7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5SZW1haW5kZXIoYSl7dmFyIHI9bmJpKCk7dGhpcy5kaXZSZW1UbyhhLG51bGwscik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5EaXZpZGVBbmRSZW1haW5kZXIoYSl7dmFyIHE9bmJpKCkscj1uYmkoKTt0aGlzLmRpdlJlbVRvKGEscSxyKTtyZXR1cm4gbmV3IEFycmF5KHEscil9ZnVuY3Rpb24gYm5wRE11bHRpcGx5KG4pe3RoaXNbdGhpcy50XT10aGlzLmFtKDAsbi0xLHRoaXMsMCwwLHRoaXMudCk7Kyt0aGlzLnQ7dGhpcy5jbGFtcCgpfWZ1bmN0aW9uIGJucERBZGRPZmZzZXQobix3KXtpZihuPT09MClyZXR1cm47d2hpbGUodGhpcy50PD13KXRoaXNbdGhpcy50KytdPTA7dGhpc1t3XSs9bjt3aGlsZSh0aGlzW3ddPj10aGlzLkRWKXt0aGlzW3ddLT10aGlzLkRWO2lmKCsrdz49dGhpcy50KXRoaXNbdGhpcy50KytdPTA7Kyt0aGlzW3ddfX1mdW5jdGlvbiBOdWxsRXhwKCl7fWZ1bmN0aW9uIG5Ob3AoeCl7cmV0dXJuIHh9ZnVuY3Rpb24gbk11bFRvKHgseSxyKXt4Lm11bHRpcGx5VG8oeSxyKX1mdW5jdGlvbiBuU3FyVG8oeCxyKXt4LnNxdWFyZVRvKHIpfU51bGxFeHAucHJvdG90eXBlLmNvbnZlcnQ9bk5vcDtOdWxsRXhwLnByb3RvdHlwZS5yZXZlcnQ9bk5vcDtOdWxsRXhwLnByb3RvdHlwZS5tdWxUbz1uTXVsVG87TnVsbEV4cC5wcm90b3R5cGUuc3FyVG89blNxclRvO2Z1bmN0aW9uIGJuUG93KGUpe3JldHVybiB0aGlzLmV4cChlLG5ldyBOdWxsRXhwKX1mdW5jdGlvbiBibnBNdWx0aXBseUxvd2VyVG8oYSxuLHIpe3ZhciBpPU1hdGgubWluKHRoaXMudCthLnQsbik7ci5zPTA7ci50PWk7d2hpbGUoaT4wKXJbLS1pXT0wO3ZhciBqO2ZvcihqPXIudC10aGlzLnQ7aTxqOysraSlyW2krdGhpcy50XT10aGlzLmFtKDAsYVtpXSxyLGksMCx0aGlzLnQpO2ZvcihqPU1hdGgubWluKGEudCxuKTtpPGo7KytpKXRoaXMuYW0oMCxhW2ldLHIsaSwwLG4taSk7ci5jbGFtcCgpfWZ1bmN0aW9uIGJucE11bHRpcGx5VXBwZXJUbyhhLG4scil7LS1uO3ZhciBpPXIudD10aGlzLnQrYS50LW47ci5zPTA7d2hpbGUoLS1pPj0wKXJbaV09MDtmb3IoaT1NYXRoLm1heChuLXRoaXMudCwwKTtpPGEudDsrK2kpclt0aGlzLnQraS1uXT10aGlzLmFtKG4taSxhW2ldLHIsMCwwLHRoaXMudCtpLW4pO3IuY2xhbXAoKTtyLmRyU2hpZnRUbygxLHIpfWZ1bmN0aW9uIEJhcnJldHQobSl7dGhpcy5yMj1uYmkoKTt0aGlzLnEzPW5iaSgpO0JpZ0ludGVnZXIuT05FLmRsU2hpZnRUbygyKm0udCx0aGlzLnIyKTt0aGlzLm11PXRoaXMucjIuZGl2aWRlKG0pO3RoaXMubT1tfWZ1bmN0aW9uIGJhcnJldHRDb252ZXJ0KHgpe2lmKHguczwwfHx4LnQ+Mip0aGlzLm0udClyZXR1cm4geC5tb2QodGhpcy5tKTtlbHNlIGlmKHguY29tcGFyZVRvKHRoaXMubSk8MClyZXR1cm4geDtlbHNle3ZhciByPW5iaSgpO3guY29weVRvKHIpO3RoaXMucmVkdWNlKHIpO3JldHVybiByfX1mdW5jdGlvbiBiYXJyZXR0UmV2ZXJ0KHgpe3JldHVybiB4fWZ1bmN0aW9uIGJhcnJldHRSZWR1Y2UoeCl7eC5kclNoaWZ0VG8odGhpcy5tLnQtMSx0aGlzLnIyKTtpZih4LnQ+dGhpcy5tLnQrMSl7eC50PXRoaXMubS50KzE7eC5jbGFtcCgpfXRoaXMubXUubXVsdGlwbHlVcHBlclRvKHRoaXMucjIsdGhpcy5tLnQrMSx0aGlzLnEzKTt0aGlzLm0ubXVsdGlwbHlMb3dlclRvKHRoaXMucTMsdGhpcy5tLnQrMSx0aGlzLnIyKTt3aGlsZSh4LmNvbXBhcmVUbyh0aGlzLnIyKTwwKXguZEFkZE9mZnNldCgxLHRoaXMubS50KzEpO3guc3ViVG8odGhpcy5yMix4KTt3aGlsZSh4LmNvbXBhcmVUbyh0aGlzLm0pPj0wKXguc3ViVG8odGhpcy5tLHgpfWZ1bmN0aW9uIGJhcnJldHRTcXJUbyh4LHIpe3guc3F1YXJlVG8ocik7dGhpcy5yZWR1Y2Uocil9ZnVuY3Rpb24gYmFycmV0dE11bFRvKHgseSxyKXt4Lm11bHRpcGx5VG8oeSxyKTt0aGlzLnJlZHVjZShyKX1CYXJyZXR0LnByb3RvdHlwZS5jb252ZXJ0PWJhcnJldHRDb252ZXJ0O0JhcnJldHQucHJvdG90eXBlLnJldmVydD1iYXJyZXR0UmV2ZXJ0O0JhcnJldHQucHJvdG90eXBlLnJlZHVjZT1iYXJyZXR0UmVkdWNlO0JhcnJldHQucHJvdG90eXBlLm11bFRvPWJhcnJldHRNdWxUbztCYXJyZXR0LnByb3RvdHlwZS5zcXJUbz1iYXJyZXR0U3FyVG87ZnVuY3Rpb24gYm5Nb2RQb3coZSxtKXtyZXR1cm4gZ2V0T3B0aW1hbEltcGwoKS5hcHBseSh0aGlzLFtlLG1dKX1CaWdJbnRlZ2VyLm1vZFBvd0ltcGw9dW5kZWZpbmVkO0JpZ0ludGVnZXIuc2V0TW9kUG93SW1wbD1mdW5jdGlvbihhdXRob3JOYW1lKXtCaWdJbnRlZ2VyLm1vZFBvd0ltcGw9ZnVuY3Rpb24oKXtzd2l0Y2goYXV0aG9yTmFtZSl7Y2FzZSJQZXRlciBPbHNvbiI6cmV0dXJuIGJuTW9kUG93X3BldGVyT2xzb247Y2FzZSJUb20gV3UiOnJldHVybiBibk1vZFBvd190b21XdX19KCl9O3ZhciBnZXRPcHRpbWFsSW1wbD1mdW5jdGlvbigpe3t2YXIgcmVzdWx0PUJpZ0ludGVnZXIubW9kUG93SW1wbDtpZihyZXN1bHQhPT11bmRlZmluZWQpe3JldHVybiByZXN1bHR9fXZhciB4PW5ldyBCaWdJbnRlZ2VyKCI0MzMzMzcwNzkyMzAwODM5MjE0ODgwNzgzNjQ3NTYwIiwxMCk7dmFyIGU9bmV3IEJpZ0ludGVnZXIoIjM3MDc5MjMwMDgzOTIxNDg4MDc4MzY0NzU2MDk0MTkiLDEwKTt2YXIgbT1uZXcgQmlnSW50ZWdlcigiMTQ4MzE2OTIwMzM1Njg1OTUyMzEzNDU5MDI0Mzc2MCIsMTApO3ZhciBzdGFydD1EYXRlLm5vdygpO2JuTW9kUG93X3BldGVyT2xzb24uYXBwbHkoeCxbZSxtXSk7dmFyIGR1cmF0aW9uUGV0ZXJPbHNvbj1EYXRlLm5vdygpLXN0YXJ0O3N0YXJ0PURhdGUubm93KCk7Ym5Nb2RQb3dfdG9tV3UuYXBwbHkoeCxbZSxtXSk7dmFyIGR1cmF0aW9uVG9tV3U9RGF0ZS5ub3coKS1zdGFydDtCaWdJbnRlZ2VyLm1vZFBvd0ltcGw9ZHVyYXRpb25QZXRlck9sc29uPGR1cmF0aW9uVG9tV3U/Ym5Nb2RQb3dfcGV0ZXJPbHNvbjpibk1vZFBvd190b21XdTtyZXR1cm4gZ2V0T3B0aW1hbEltcGwoKX07ZnVuY3Rpb24gYm5Nb2RQb3dfcGV0ZXJPbHNvbihlLG0pe3ZhciBwb1RoaXM9cGV0ZXJPbHNvbl9CaWdJbnRlZ2VyU3RhdGljKHRoaXMudG9TdHJpbmcoMTApLDEwKTt2YXIgcG9FPXBldGVyT2xzb25fQmlnSW50ZWdlclN0YXRpYyhlLnRvU3RyaW5nKDEwKSwxMCk7dmFyIHBvTT1wZXRlck9sc29uX0JpZ0ludGVnZXJTdGF0aWMobS50b1N0cmluZygxMCksMTApO3ZhciBwb091dD1wb1RoaXMubW9kUG93KHBvRSxwb00pO3ZhciBvdXQ9bmV3IEJpZ0ludGVnZXIocG9PdXQudG9TdHJpbmcoMTApLDEwKTtyZXR1cm4gb3V0fWZ1bmN0aW9uIGJuTW9kUG93X3RvbVd1KGUsbSl7dmFyIGk9ZS5iaXRMZW5ndGgoKSxrLHI9bmJ2KDEpLHo7aWYoaTw9MClyZXR1cm4gcjtlbHNlIGlmKGk8MTgpaz0xO2Vsc2UgaWYoaTw0OClrPTM7ZWxzZSBpZihpPDE0NClrPTQ7ZWxzZSBpZihpPDc2OClrPTU7ZWxzZSBrPTY7aWYoaTw4KXo9bmV3IENsYXNzaWMobSk7ZWxzZSBpZihtLmlzRXZlbigpKXo9bmV3IEJhcnJldHQobSk7ZWxzZSB6PW5ldyBNb250Z29tZXJ5KG0pO3ZhciBnPW5ldyBBcnJheSxuPTMsazE9ay0xLGttPSgxPDxrKS0xO2dbMV09ei5jb252ZXJ0KHRoaXMpO2lmKGs+MSl7dmFyIGcyPW5iaSgpO3ouc3FyVG8oZ1sxXSxnMik7d2hpbGUobjw9a20pe2dbbl09bmJpKCk7ei5tdWxUbyhnMixnW24tMl0sZ1tuXSk7bis9Mn19dmFyIGo9ZS50LTEsdyxpczE9dHJ1ZSxyMj1uYmkoKSx0O2k9bmJpdHMoZVtqXSktMTt3aGlsZShqPj0wKXtpZihpPj1rMSl3PWVbal0+PmktazEma207ZWxzZXt3PShlW2pdJigxPDxpKzEpLTEpPDxrMS1pO2lmKGo+MCl3fD1lW2otMV0+PnRoaXMuREIraS1rMX1uPWs7d2hpbGUoKHcmMSk9PT0wKXt3Pj49MTstLW59aWYoKGktPW4pPDApe2krPXRoaXMuREI7LS1qfWlmKGlzMSl7Z1t3XS5jb3B5VG8ocik7aXMxPWZhbHNlfWVsc2V7d2hpbGUobj4xKXt6LnNxclRvKHIscjIpO3ouc3FyVG8ocjIscik7bi09Mn1pZihuPjApei5zcXJUbyhyLHIyKTtlbHNle3Q9cjtyPXIyO3IyPXR9ei5tdWxUbyhyMixnW3ddLHIpfXdoaWxlKGo+PTAmJihlW2pdJjE8PGkpPT09MCl7ei5zcXJUbyhyLHIyKTt0PXI7cj1yMjtyMj10O2lmKC0taTwwKXtpPXRoaXMuREItMTstLWp9fX1yZXR1cm4gei5yZXZlcnQocil9ZnVuY3Rpb24gYm5HQ0QoYSl7dmFyIHg9dGhpcy5zPDA/dGhpcy5uZWdhdGUoKTp0aGlzLmNsb25lKCk7dmFyIHk9YS5zPDA/YS5uZWdhdGUoKTphLmNsb25lKCk7aWYoeC5jb21wYXJlVG8oeSk8MCl7dmFyIHQ9eDt4PXk7eT10fXZhciBpPXguZ2V0TG93ZXN0U2V0Qml0KCksZz15LmdldExvd2VzdFNldEJpdCgpO2lmKGc8MClyZXR1cm4geDtpZihpPGcpZz1pO2lmKGc+MCl7eC5yU2hpZnRUbyhnLHgpO3kuclNoaWZ0VG8oZyx5KX13aGlsZSh4LnNpZ251bSgpPjApe2lmKChpPXguZ2V0TG93ZXN0U2V0Qml0KCkpPjApeC5yU2hpZnRUbyhpLHgpO2lmKChpPXkuZ2V0TG93ZXN0U2V0Qml0KCkpPjApeS5yU2hpZnRUbyhpLHkpO2lmKHguY29tcGFyZVRvKHkpPj0wKXt4LnN1YlRvKHkseCk7eC5yU2hpZnRUbygxLHgpfWVsc2V7eS5zdWJUbyh4LHkpO3kuclNoaWZ0VG8oMSx5KX19aWYoZz4wKXkubFNoaWZ0VG8oZyx5KTtyZXR1cm4geX1mdW5jdGlvbiBibnBNb2RJbnQobil7aWYobjw9MClyZXR1cm4gMDt2YXIgZD10aGlzLkRWJW4scj10aGlzLnM8MD9uLTE6MDtpZih0aGlzLnQ+MClpZihkPT09MClyPXRoaXNbMF0lbjtlbHNlIGZvcih2YXIgaT10aGlzLnQtMTtpPj0wOy0taSlyPShkKnIrdGhpc1tpXSklbjtyZXR1cm4gcn1mdW5jdGlvbiBibk1vZEludmVyc2UobSl7dmFyIGFjPW0uaXNFdmVuKCk7aWYodGhpcy5pc0V2ZW4oKSYmYWN8fG0uc2lnbnVtKCk9PT0wKXJldHVybiBCaWdJbnRlZ2VyLlpFUk87dmFyIHU9bS5jbG9uZSgpLHY9dGhpcy5jbG9uZSgpO3ZhciBhPW5idigxKSxiPW5idigwKSxjPW5idigwKSxkPW5idigxKTt3aGlsZSh1LnNpZ251bSgpIT0wKXt3aGlsZSh1LmlzRXZlbigpKXt1LnJTaGlmdFRvKDEsdSk7aWYoYWMpe2lmKCFhLmlzRXZlbigpfHwhYi5pc0V2ZW4oKSl7YS5hZGRUbyh0aGlzLGEpO2Iuc3ViVG8obSxiKX1hLnJTaGlmdFRvKDEsYSl9ZWxzZSBpZighYi5pc0V2ZW4oKSliLnN1YlRvKG0sYik7Yi5yU2hpZnRUbygxLGIpfXdoaWxlKHYuaXNFdmVuKCkpe3YuclNoaWZ0VG8oMSx2KTtpZihhYyl7aWYoIWMuaXNFdmVuKCl8fCFkLmlzRXZlbigpKXtjLmFkZFRvKHRoaXMsYyk7ZC5zdWJUbyhtLGQpfWMuclNoaWZ0VG8oMSxjKX1lbHNlIGlmKCFkLmlzRXZlbigpKWQuc3ViVG8obSxkKTtkLnJTaGlmdFRvKDEsZCl9aWYodS5jb21wYXJlVG8odik+PTApe3Uuc3ViVG8odix1KTtpZihhYylhLnN1YlRvKGMsYSk7Yi5zdWJUbyhkLGIpfWVsc2V7di5zdWJUbyh1LHYpO2lmKGFjKWMuc3ViVG8oYSxjKTtkLnN1YlRvKGIsZCl9fWlmKHYuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSE9MClyZXR1cm4gQmlnSW50ZWdlci5aRVJPO2lmKGQuY29tcGFyZVRvKG0pPj0wKXJldHVybiBkLnN1YnRyYWN0KG0pO2lmKGQuc2lnbnVtKCk8MClkLmFkZFRvKG0sZCk7ZWxzZSByZXR1cm4gZDtpZihkLnNpZ251bSgpPDApcmV0dXJuIGQuYWRkKG0pO2Vsc2UgcmV0dXJuIGR9dmFyIGxvd3ByaW1lcz1bMiwzLDUsNywxMSwxMywxNywxOSwyMywyOSwzMSwzNyw0MSw0Myw0Nyw1Myw1OSw2MSw2Nyw3MSw3Myw3OSw4Myw4OSw5NywxMDEsMTAzLDEwNywxMDksMTEzLDEyNywxMzEsMTM3LDEzOSwxNDksMTUxLDE1NywxNjMsMTY3LDE3MywxNzksMTgxLDE5MSwxOTMsMTk3LDE5OSwyMTEsMjIzLDIyNywyMjksMjMzLDIzOSwyNDEsMjUxLDI1NywyNjMsMjY5LDI3MSwyNzcsMjgxLDI4MywyOTMsMzA3LDMxMSwzMTMsMzE3LDMzMSwzMzcsMzQ3LDM0OSwzNTMsMzU5LDM2NywzNzMsMzc5LDM4MywzODksMzk3LDQwMSw0MDksNDE5LDQyMSw0MzEsNDMzLDQzOSw0NDMsNDQ5LDQ1Nyw0NjEsNDYzLDQ2Nyw0NzksNDg3LDQ5MSw0OTksNTAzLDUwOSw1MjEsNTIzLDU0MSw1NDcsNTU3LDU2Myw1NjksNTcxLDU3Nyw1ODcsNTkzLDU5OSw2MDEsNjA3LDYxMyw2MTcsNjE5LDYzMSw2NDEsNjQzLDY0Nyw2NTMsNjU5LDY2MSw2NzMsNjc3LDY4Myw2OTEsNzAxLDcwOSw3MTksNzI3LDczMyw3MzksNzQzLDc1MSw3NTcsNzYxLDc2OSw3NzMsNzg3LDc5Nyw4MDksODExLDgyMSw4MjMsODI3LDgyOSw4MzksODUzLDg1Nyw4NTksODYzLDg3Nyw4ODEsODgzLDg4Nyw5MDcsOTExLDkxOSw5MjksOTM3LDk0MSw5NDcsOTUzLDk2Nyw5NzEsOTc3LDk4Myw5OTEsOTk3XTt2YXIgbHBsaW09KDE8PDI2KS9sb3dwcmltZXNbbG93cHJpbWVzLmxlbmd0aC0xXTtmdW5jdGlvbiBibklzUHJvYmFibGVQcmltZSh0KXt2YXIgaSx4PXRoaXMuYWJzKCk7aWYoeC50PT0xJiZ4WzBdPD1sb3dwcmltZXNbbG93cHJpbWVzLmxlbmd0aC0xXSl7Zm9yKGk9MDtpPGxvd3ByaW1lcy5sZW5ndGg7KytpKWlmKHhbMF09PWxvd3ByaW1lc1tpXSlyZXR1cm4gdHJ1ZTtyZXR1cm4gZmFsc2V9aWYoeC5pc0V2ZW4oKSlyZXR1cm4gZmFsc2U7aT0xO3doaWxlKGk8bG93cHJpbWVzLmxlbmd0aCl7dmFyIG09bG93cHJpbWVzW2ldLGo9aSsxO3doaWxlKGo8bG93cHJpbWVzLmxlbmd0aCYmbTxscGxpbSltKj1sb3dwcmltZXNbaisrXTttPXgubW9kSW50KG0pO3doaWxlKGk8ailpZihtJWxvd3ByaW1lc1tpKytdPT09MClyZXR1cm4gZmFsc2V9cmV0dXJuIHgubWlsbGVyUmFiaW4odCl9ZnVuY3Rpb24gYm5wTWlsbGVyUmFiaW4odCl7dmFyIG4xPXRoaXMuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpO3ZhciBrPW4xLmdldExvd2VzdFNldEJpdCgpO2lmKGs8PTApcmV0dXJuIGZhbHNlO3ZhciByPW4xLnNoaWZ0UmlnaHQoayk7dD10KzE+PjE7aWYodD5sb3dwcmltZXMubGVuZ3RoKXQ9bG93cHJpbWVzLmxlbmd0aDt2YXIgYT1uYmkoKTtmb3IodmFyIGk9MDtpPHQ7KytpKXthLmZyb21JbnQobG93cHJpbWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpsb3dwcmltZXMubGVuZ3RoKV0pO3ZhciB5PWEubW9kUG93KHIsdGhpcyk7aWYoeS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpIT0wJiZ5LmNvbXBhcmVUbyhuMSkhPTApe3ZhciBqPTE7d2hpbGUoaisrPGsmJnkuY29tcGFyZVRvKG4xKSE9MCl7eT15Lm1vZFBvd0ludCgyLHRoaXMpO2lmKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKT09PTApcmV0dXJuIGZhbHNlfWlmKHkuY29tcGFyZVRvKG4xKSE9MClyZXR1cm4gZmFsc2V9fXJldHVybiB0cnVlfUJpZ0ludGVnZXIucHJvdG90eXBlLmNvcHlUbz1ibnBDb3B5VG87QmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbUludD1ibnBGcm9tSW50O0JpZ0ludGVnZXIucHJvdG90eXBlLmZyb21TdHJpbmc9Ym5wRnJvbVN0cmluZztCaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tQnl0ZUFycmF5PWJucEZyb21CeXRlQXJyYXk7QmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbUJ1ZmZlcj1ibnBGcm9tQnVmZmVyO0JpZ0ludGVnZXIucHJvdG90eXBlLmNsYW1wPWJucENsYW1wO0JpZ0ludGVnZXIucHJvdG90eXBlLmRsU2hpZnRUbz1ibnBETFNoaWZ0VG87QmlnSW50ZWdlci5wcm90b3R5cGUuZHJTaGlmdFRvPWJucERSU2hpZnRUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5sU2hpZnRUbz1ibnBMU2hpZnRUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5yU2hpZnRUbz1ibnBSU2hpZnRUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5zdWJUbz1ibnBTdWJUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseVRvPWJucE11bHRpcGx5VG87QmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlVG89Ym5wU3F1YXJlVG87QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2UmVtVG89Ym5wRGl2UmVtVG87QmlnSW50ZWdlci5wcm90b3R5cGUuaW52RGlnaXQ9Ym5wSW52RGlnaXQ7QmlnSW50ZWdlci5wcm90b3R5cGUuaXNFdmVuPWJucElzRXZlbjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5leHA9Ym5wRXhwO0JpZ0ludGVnZXIucHJvdG90eXBlLmNodW5rU2l6ZT1ibnBDaHVua1NpemU7QmlnSW50ZWdlci5wcm90b3R5cGUudG9SYWRpeD1ibnBUb1JhZGl4O0JpZ0ludGVnZXIucHJvdG90eXBlLmZyb21SYWRpeD1ibnBGcm9tUmFkaXg7QmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbU51bWJlcj1ibnBGcm9tTnVtYmVyO0JpZ0ludGVnZXIucHJvdG90eXBlLmJpdHdpc2VUbz1ibnBCaXR3aXNlVG87QmlnSW50ZWdlci5wcm90b3R5cGUuY2hhbmdlQml0PWJucENoYW5nZUJpdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGRUbz1ibnBBZGRUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5kTXVsdGlwbHk9Ym5wRE11bHRpcGx5O0JpZ0ludGVnZXIucHJvdG90eXBlLmRBZGRPZmZzZXQ9Ym5wREFkZE9mZnNldDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseUxvd2VyVG89Ym5wTXVsdGlwbHlMb3dlclRvO0JpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5VXBwZXJUbz1ibnBNdWx0aXBseVVwcGVyVG87QmlnSW50ZWdlci5wcm90b3R5cGUubW9kSW50PWJucE1vZEludDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5taWxsZXJSYWJpbj1ibnBNaWxsZXJSYWJpbjtCaWdJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZz1iblRvU3RyaW5nO0JpZ0ludGVnZXIucHJvdG90eXBlLm5lZ2F0ZT1ibk5lZ2F0ZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hYnM9Ym5BYnM7QmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZVRvPWJuQ29tcGFyZVRvO0JpZ0ludGVnZXIucHJvdG90eXBlLmJpdExlbmd0aD1ibkJpdExlbmd0aDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2Q9Ym5Nb2Q7QmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93SW50PWJuTW9kUG93SW50O0JpZ0ludGVnZXIucHJvdG90eXBlLmNsb25lPWJuQ2xvbmU7QmlnSW50ZWdlci5wcm90b3R5cGUuaW50VmFsdWU9Ym5JbnRWYWx1ZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5ieXRlVmFsdWU9Ym5CeXRlVmFsdWU7QmlnSW50ZWdlci5wcm90b3R5cGUuc2hvcnRWYWx1ZT1iblNob3J0VmFsdWU7QmlnSW50ZWdlci5wcm90b3R5cGUuc2lnbnVtPWJuU2lnTnVtO0JpZ0ludGVnZXIucHJvdG90eXBlLnRvQnl0ZUFycmF5PWJuVG9CeXRlQXJyYXk7QmlnSW50ZWdlci5wcm90b3R5cGUudG9CdWZmZXI9Ym5Ub0J1ZmZlcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5lcXVhbHM9Ym5FcXVhbHM7QmlnSW50ZWdlci5wcm90b3R5cGUubWluPWJuTWluO0JpZ0ludGVnZXIucHJvdG90eXBlLm1heD1ibk1heDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQ9Ym5BbmQ7QmlnSW50ZWdlci5wcm90b3R5cGUub3I9Ym5PcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS54b3I9Ym5Yb3I7QmlnSW50ZWdlci5wcm90b3R5cGUuYW5kTm90PWJuQW5kTm90O0JpZ0ludGVnZXIucHJvdG90eXBlLm5vdD1ibk5vdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdExlZnQ9Ym5TaGlmdExlZnQ7QmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRSaWdodD1iblNoaWZ0UmlnaHQ7QmlnSW50ZWdlci5wcm90b3R5cGUuZ2V0TG93ZXN0U2V0Qml0PWJuR2V0TG93ZXN0U2V0Qml0O0JpZ0ludGVnZXIucHJvdG90eXBlLmJpdENvdW50PWJuQml0Q291bnQ7QmlnSW50ZWdlci5wcm90b3R5cGUudGVzdEJpdD1iblRlc3RCaXQ7QmlnSW50ZWdlci5wcm90b3R5cGUuc2V0Qml0PWJuU2V0Qml0O0JpZ0ludGVnZXIucHJvdG90eXBlLmNsZWFyQml0PWJuQ2xlYXJCaXQ7QmlnSW50ZWdlci5wcm90b3R5cGUuZmxpcEJpdD1ibkZsaXBCaXQ7QmlnSW50ZWdlci5wcm90b3R5cGUuYWRkPWJuQWRkO0JpZ0ludGVnZXIucHJvdG90eXBlLnN1YnRyYWN0PWJuU3VidHJhY3Q7QmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHk9Ym5NdWx0aXBseTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGU9Ym5EaXZpZGU7QmlnSW50ZWdlci5wcm90b3R5cGUucmVtYWluZGVyPWJuUmVtYWluZGVyO0JpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZUFuZFJlbWFpbmRlcj1ibkRpdmlkZUFuZFJlbWFpbmRlcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3c9Ym5Nb2RQb3c7QmlnSW50ZWdlci5wcm90b3R5cGUubW9kSW52ZXJzZT1ibk1vZEludmVyc2U7QmlnSW50ZWdlci5wcm90b3R5cGUucG93PWJuUG93O0JpZ0ludGVnZXIucHJvdG90eXBlLmdjZD1ibkdDRDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1Byb2JhYmxlUHJpbWU9Ym5Jc1Byb2JhYmxlUHJpbWU7QmlnSW50ZWdlci5pbnQyY2hhcj1pbnQyY2hhcjtCaWdJbnRlZ2VyLlpFUk89bmJ2KDApO0JpZ0ludGVnZXIuT05FPW5idigxKTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zcXVhcmU9Ym5TcXVhcmU7bW9kdWxlLmV4cG9ydHM9QmlnSW50ZWdlcn0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4uL2NyeXB0byI6NDMsIi4uL3V0aWxzIjo1OCwiYmlnLWludGVnZXIiOjI1LGJ1ZmZlcjoyN31dLDUzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgXz1yZXF1aXJlKCIuLi91dGlscyIpLl87dmFyIEJpZ0ludGVnZXI9cmVxdWlyZSgiLi9qc2JuLmpzIik7dmFyIHV0aWxzPXJlcXVpcmUoIi4uL3V0aWxzLmpzIik7dmFyIHNjaGVtZXM9cmVxdWlyZSgiLi4vc2NoZW1lcy9zY2hlbWVzLmpzIik7dmFyIGVuY3J5cHRFbmdpbmVzPXJlcXVpcmUoIi4uL2VuY3J5cHRFbmdpbmVzL2VuY3J5cHRFbmdpbmVzLmpzIik7ZXhwb3J0cy5CaWdJbnRlZ2VyPUJpZ0ludGVnZXI7bW9kdWxlLmV4cG9ydHMuS2V5PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gUlNBS2V5KCl7dGhpcy5uPW51bGw7dGhpcy5lPTA7dGhpcy5kPW51bGw7dGhpcy5wPW51bGw7dGhpcy5xPW51bGw7dGhpcy5kbXAxPW51bGw7dGhpcy5kbXExPW51bGw7dGhpcy5jb2VmZj1udWxsfVJTQUtleS5wcm90b3R5cGUuc2V0T3B0aW9ucz1mdW5jdGlvbihvcHRpb25zKXt2YXIgc2lnbmluZ1NjaGVtZVByb3ZpZGVyPXNjaGVtZXNbb3B0aW9ucy5zaWduaW5nU2NoZW1lXTt2YXIgZW5jcnlwdGlvblNjaGVtZVByb3ZpZGVyPXNjaGVtZXNbb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lXTtpZihzaWduaW5nU2NoZW1lUHJvdmlkZXI9PT1lbmNyeXB0aW9uU2NoZW1lUHJvdmlkZXIpe3RoaXMuc2lnbmluZ1NjaGVtZT10aGlzLmVuY3J5cHRpb25TY2hlbWU9ZW5jcnlwdGlvblNjaGVtZVByb3ZpZGVyLm1ha2VTY2hlbWUodGhpcyxvcHRpb25zKX1lbHNle3RoaXMuZW5jcnlwdGlvblNjaGVtZT1lbmNyeXB0aW9uU2NoZW1lUHJvdmlkZXIubWFrZVNjaGVtZSh0aGlzLG9wdGlvbnMpO3RoaXMuc2lnbmluZ1NjaGVtZT1zaWduaW5nU2NoZW1lUHJvdmlkZXIubWFrZVNjaGVtZSh0aGlzLG9wdGlvbnMpfXRoaXMuZW5jcnlwdEVuZ2luZT1lbmNyeXB0RW5naW5lcy5nZXRFbmdpbmUodGhpcyxvcHRpb25zKX07UlNBS2V5LnByb3RvdHlwZS5nZW5lcmF0ZT1mdW5jdGlvbihCLEUpe3ZhciBxcz1CPj4xO3RoaXMuZT1wYXJzZUludChFLDE2KTt2YXIgZWU9bmV3IEJpZ0ludGVnZXIoRSwxNik7d2hpbGUodHJ1ZSl7d2hpbGUodHJ1ZSl7dGhpcy5wPW5ldyBCaWdJbnRlZ2VyKEItcXMsMSk7aWYodGhpcy5wLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKS5nY2QoZWUpLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSk9PT0wJiZ0aGlzLnAuaXNQcm9iYWJsZVByaW1lKDEwKSlicmVha313aGlsZSh0cnVlKXt0aGlzLnE9bmV3IEJpZ0ludGVnZXIocXMsMSk7aWYodGhpcy5xLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKS5nY2QoZWUpLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSk9PT0wJiZ0aGlzLnEuaXNQcm9iYWJsZVByaW1lKDEwKSlicmVha31pZih0aGlzLnAuY29tcGFyZVRvKHRoaXMucSk8PTApe3ZhciB0PXRoaXMucDt0aGlzLnA9dGhpcy5xO3RoaXMucT10fXZhciBwMT10aGlzLnAuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpO3ZhciBxMT10aGlzLnEuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpO3ZhciBwaGk9cDEubXVsdGlwbHkocTEpO2lmKHBoaS5nY2QoZWUpLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSk9PT0wKXt0aGlzLm49dGhpcy5wLm11bHRpcGx5KHRoaXMucSk7aWYodGhpcy5uLmJpdExlbmd0aCgpPEIpe2NvbnRpbnVlfXRoaXMuZD1lZS5tb2RJbnZlcnNlKHBoaSk7dGhpcy5kbXAxPXRoaXMuZC5tb2QocDEpO3RoaXMuZG1xMT10aGlzLmQubW9kKHExKTt0aGlzLmNvZWZmPXRoaXMucS5tb2RJbnZlcnNlKHRoaXMucCk7YnJlYWt9fXRoaXMuJCRyZWNhbGN1bGF0ZUNhY2hlKCl9O1JTQUtleS5wcm90b3R5cGUuc2V0UHJpdmF0ZT1mdW5jdGlvbihOLEUsRCxQLFEsRFAsRFEsQyl7aWYoTiYmRSYmRCYmTi5sZW5ndGg+MCYmKF8uaXNOdW1iZXIoRSl8fEUubGVuZ3RoPjApJiZELmxlbmd0aD4wKXt0aGlzLm49bmV3IEJpZ0ludGVnZXIoTik7dGhpcy5lPV8uaXNOdW1iZXIoRSk/RTp1dGlscy5nZXQzMkludEZyb21CdWZmZXIoRSwwKTt0aGlzLmQ9bmV3IEJpZ0ludGVnZXIoRCk7aWYoUCYmUSYmRFAmJkRRJiZDKXt0aGlzLnA9bmV3IEJpZ0ludGVnZXIoUCk7dGhpcy5xPW5ldyBCaWdJbnRlZ2VyKFEpO3RoaXMuZG1wMT1uZXcgQmlnSW50ZWdlcihEUCk7dGhpcy5kbXExPW5ldyBCaWdJbnRlZ2VyKERRKTt0aGlzLmNvZWZmPW5ldyBCaWdJbnRlZ2VyKEMpfWVsc2V7fXRoaXMuJCRyZWNhbGN1bGF0ZUNhY2hlKCl9ZWxzZXt0aHJvdyBFcnJvcigiSW52YWxpZCBSU0EgcHJpdmF0ZSBrZXkiKX19O1JTQUtleS5wcm90b3R5cGUuc2V0UHVibGljPWZ1bmN0aW9uKE4sRSl7aWYoTiYmRSYmTi5sZW5ndGg+MCYmKF8uaXNOdW1iZXIoRSl8fEUubGVuZ3RoPjApKXt0aGlzLm49bmV3IEJpZ0ludGVnZXIoTik7dGhpcy5lPV8uaXNOdW1iZXIoRSk/RTp1dGlscy5nZXQzMkludEZyb21CdWZmZXIoRSwwKTt0aGlzLiQkcmVjYWxjdWxhdGVDYWNoZSgpfWVsc2V7dGhyb3cgRXJyb3IoIkludmFsaWQgUlNBIHB1YmxpYyBrZXkiKX19O1JTQUtleS5wcm90b3R5cGUuJGRvUHJpdmF0ZT1mdW5jdGlvbih4KXtpZih0aGlzLnB8fHRoaXMucSl7cmV0dXJuIHgubW9kUG93KHRoaXMuZCx0aGlzLm4pfXZhciB4cD14Lm1vZCh0aGlzLnApLm1vZFBvdyh0aGlzLmRtcDEsdGhpcy5wKTt2YXIgeHE9eC5tb2QodGhpcy5xKS5tb2RQb3codGhpcy5kbXExLHRoaXMucSk7d2hpbGUoeHAuY29tcGFyZVRvKHhxKTwwKXt4cD14cC5hZGQodGhpcy5wKX1yZXR1cm4geHAuc3VidHJhY3QoeHEpLm11bHRpcGx5KHRoaXMuY29lZmYpLm1vZCh0aGlzLnApLm11bHRpcGx5KHRoaXMucSkuYWRkKHhxKX07UlNBS2V5LnByb3RvdHlwZS4kZG9QdWJsaWM9ZnVuY3Rpb24oeCl7cmV0dXJuIHgubW9kUG93SW50KHRoaXMuZSx0aGlzLm4pfTtSU0FLZXkucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24oYnVmZmVyLHVzZVByaXZhdGUpe3ZhciBidWZmZXJzPVtdO3ZhciByZXN1bHRzPVtdO3ZhciBidWZmZXJTaXplPWJ1ZmZlci5sZW5ndGg7dmFyIGJ1ZmZlcnNDb3VudD1NYXRoLmNlaWwoYnVmZmVyU2l6ZS90aGlzLm1heE1lc3NhZ2VMZW5ndGgpfHwxO3ZhciBkaXZpZGVkU2l6ZT1NYXRoLmNlaWwoYnVmZmVyU2l6ZS9idWZmZXJzQ291bnR8fDEpO2lmKGJ1ZmZlcnNDb3VudD09MSl7YnVmZmVycy5wdXNoKGJ1ZmZlcil9ZWxzZXtmb3IodmFyIGJ1Zk51bT0wO2J1Zk51bTxidWZmZXJzQ291bnQ7YnVmTnVtKyspe2J1ZmZlcnMucHVzaChidWZmZXIuc2xpY2UoYnVmTnVtKmRpdmlkZWRTaXplLChidWZOdW0rMSkqZGl2aWRlZFNpemUpKX19Zm9yKHZhciBpPTA7aTxidWZmZXJzLmxlbmd0aDtpKyspe3Jlc3VsdHMucHVzaCh0aGlzLmVuY3J5cHRFbmdpbmUuZW5jcnlwdChidWZmZXJzW2ldLHVzZVByaXZhdGUpKX1yZXR1cm4gQnVmZmVyLmNvbmNhdChyZXN1bHRzKX07UlNBS2V5LnByb3RvdHlwZS5kZWNyeXB0PWZ1bmN0aW9uKGJ1ZmZlcix1c2VQdWJsaWMpe2lmKGJ1ZmZlci5sZW5ndGgldGhpcy5lbmNyeXB0ZWREYXRhTGVuZ3RoPjApe3Rocm93IEVycm9yKCJJbmNvcnJlY3QgZGF0YSBvciBrZXkiKX12YXIgcmVzdWx0PVtdO3ZhciBvZmZzZXQ9MDt2YXIgbGVuZ3RoPTA7dmFyIGJ1ZmZlcnNDb3VudD1idWZmZXIubGVuZ3RoL3RoaXMuZW5jcnlwdGVkRGF0YUxlbmd0aDtmb3IodmFyIGk9MDtpPGJ1ZmZlcnNDb3VudDtpKyspe29mZnNldD1pKnRoaXMuZW5jcnlwdGVkRGF0YUxlbmd0aDtsZW5ndGg9b2Zmc2V0K3RoaXMuZW5jcnlwdGVkRGF0YUxlbmd0aDtyZXN1bHQucHVzaCh0aGlzLmVuY3J5cHRFbmdpbmUuZGVjcnlwdChidWZmZXIuc2xpY2Uob2Zmc2V0LE1hdGgubWluKGxlbmd0aCxidWZmZXIubGVuZ3RoKSksdXNlUHVibGljKSl9cmV0dXJuIEJ1ZmZlci5jb25jYXQocmVzdWx0KX07UlNBS2V5LnByb3RvdHlwZS5zaWduPWZ1bmN0aW9uKGJ1ZmZlcil7cmV0dXJuIHRoaXMuc2lnbmluZ1NjaGVtZS5zaWduLmFwcGx5KHRoaXMuc2lnbmluZ1NjaGVtZSxhcmd1bWVudHMpfTtSU0FLZXkucHJvdG90eXBlLnZlcmlmeT1mdW5jdGlvbihidWZmZXIsc2lnbmF0dXJlLHNpZ25hdHVyZV9lbmNvZGluZyl7cmV0dXJuIHRoaXMuc2lnbmluZ1NjaGVtZS52ZXJpZnkuYXBwbHkodGhpcy5zaWduaW5nU2NoZW1lLGFyZ3VtZW50cyl9O1JTQUtleS5wcm90b3R5cGUuaXNQcml2YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubiYmdGhpcy5lJiZ0aGlzLmR8fGZhbHNlfTtSU0FLZXkucHJvdG90eXBlLmlzUHVibGljPWZ1bmN0aW9uKHN0cmljdCl7cmV0dXJuIHRoaXMubiYmdGhpcy5lJiYhKHN0cmljdCYmdGhpcy5kKXx8ZmFsc2V9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShSU0FLZXkucHJvdG90eXBlLCJrZXlTaXplIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2FjaGUua2V5Qml0TGVuZ3RofX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShSU0FLZXkucHJvdG90eXBlLCJlbmNyeXB0ZWREYXRhTGVuZ3RoIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2FjaGUua2V5Qnl0ZUxlbmd0aH19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUlNBS2V5LnByb3RvdHlwZSwibWF4TWVzc2FnZUxlbmd0aCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVuY3J5cHRpb25TY2hlbWUubWF4TWVzc2FnZUxlbmd0aCgpfX0pO1JTQUtleS5wcm90b3R5cGUuJCRyZWNhbGN1bGF0ZUNhY2hlPWZ1bmN0aW9uKCl7dGhpcy5jYWNoZT10aGlzLmNhY2hlfHx7fTt0aGlzLmNhY2hlLmtleUJpdExlbmd0aD10aGlzLm4uYml0TGVuZ3RoKCk7dGhpcy5jYWNoZS5rZXlCeXRlTGVuZ3RoPXRoaXMuY2FjaGUua2V5Qml0TGVuZ3RoKzY+PjN9O3JldHVybiBSU0FLZXl9KCl9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi9lbmNyeXB0RW5naW5lcy9lbmNyeXB0RW5naW5lcy5qcyI6NDQsIi4uL3NjaGVtZXMvc2NoZW1lcy5qcyI6NTcsIi4uL3V0aWxzIjo1OCwiLi4vdXRpbHMuanMiOjU4LCIuL2pzYm4uanMiOjUyLGJ1ZmZlcjoyN31dLDU0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgY3J5cHQ9cmVxdWlyZSgiLi4vY3J5cHRvIik7bW9kdWxlLmV4cG9ydHM9e2lzRW5jcnlwdGlvbjp0cnVlLGlzU2lnbmF0dXJlOmZhbHNlfTttb2R1bGUuZXhwb3J0cy5kaWdlc3RMZW5ndGg9e21kNDoxNixtZDU6MTYscmlwZW1kMTYwOjIwLHJtZDE2MDoyMCxzaGExOjIwLHNoYTIyNDoyOCxzaGEyNTY6MzIsc2hhMzg0OjQ4LHNoYTUxMjo2NH07dmFyIERFRkFVTFRfSEFTSF9GVU5DVElPTj0ic2hhMSI7bW9kdWxlLmV4cG9ydHMuZW1lX29hZXBfbWdmMT1mdW5jdGlvbihzZWVkLG1hc2tMZW5ndGgsaGFzaEZ1bmN0aW9uKXtoYXNoRnVuY3Rpb249aGFzaEZ1bmN0aW9ufHxERUZBVUxUX0hBU0hfRlVOQ1RJT047dmFyIGhMZW49bW9kdWxlLmV4cG9ydHMuZGlnZXN0TGVuZ3RoW2hhc2hGdW5jdGlvbl07dmFyIGNvdW50PU1hdGguY2VpbChtYXNrTGVuZ3RoL2hMZW4pO3ZhciBUPUJ1ZmZlci5hbGxvYyhoTGVuKmNvdW50KTt2YXIgYz1CdWZmZXIuYWxsb2MoNCk7Zm9yKHZhciBpPTA7aTxjb3VudDsrK2kpe3ZhciBoYXNoPWNyeXB0LmNyZWF0ZUhhc2goaGFzaEZ1bmN0aW9uKTtoYXNoLnVwZGF0ZShzZWVkKTtjLndyaXRlVUludDMyQkUoaSwwKTtoYXNoLnVwZGF0ZShjKTtoYXNoLmRpZ2VzdCgpLmNvcHkoVCxpKmhMZW4pfXJldHVybiBULnNsaWNlKDAsbWFza0xlbmd0aCl9O21vZHVsZS5leHBvcnRzLm1ha2VTY2hlbWU9ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe2Z1bmN0aW9uIFNjaGVtZShrZXksb3B0aW9ucyl7dGhpcy5rZXk9a2V5O3RoaXMub3B0aW9ucz1vcHRpb25zfVNjaGVtZS5wcm90b3R5cGUubWF4TWVzc2FnZUxlbmd0aD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoLTIqbW9kdWxlLmV4cG9ydHMuZGlnZXN0TGVuZ3RoW3RoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT05dLTJ9O1NjaGVtZS5wcm90b3R5cGUuZW5jUGFkPWZ1bmN0aW9uKGJ1ZmZlcil7dmFyIGhhc2g9dGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTjt2YXIgbWdmPXRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5tZ2Z8fG1vZHVsZS5leHBvcnRzLmVtZV9vYWVwX21nZjE7dmFyIGxhYmVsPXRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5sYWJlbHx8QnVmZmVyLmFsbG9jKDApO3ZhciBlbUxlbj10aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoO3ZhciBoTGVuPW1vZHVsZS5leHBvcnRzLmRpZ2VzdExlbmd0aFtoYXNoXTtpZihidWZmZXIubGVuZ3RoPmVtTGVuLTIqaExlbi0yKXt0aHJvdyBuZXcgRXJyb3IoIk1lc3NhZ2UgaXMgdG9vIGxvbmcgdG8gZW5jb2RlIGludG8gYW4gZW5jb2RlZCBtZXNzYWdlIHdpdGggYSBsZW5ndGggb2YgIitlbUxlbisiIGJ5dGVzLCBpbmNyZWFzZSIrImVtTGVuIHRvIGZpeCB0aGlzIGVycm9yIChtaW5pbXVtIHZhbHVlIGZvciBnaXZlbiBwYXJhbWV0ZXJzIGFuZCBvcHRpb25zOiAiKyhlbUxlbi0yKmhMZW4tMikrIikiKX12YXIgbEhhc2g9Y3J5cHQuY3JlYXRlSGFzaChoYXNoKTtsSGFzaC51cGRhdGUobGFiZWwpO2xIYXNoPWxIYXNoLmRpZ2VzdCgpO3ZhciBQUz1CdWZmZXIuYWxsb2MoZW1MZW4tYnVmZmVyLmxlbmd0aC0yKmhMZW4tMSk7UFMuZmlsbCgwKTtQU1tQUy5sZW5ndGgtMV09MTt2YXIgREI9QnVmZmVyLmNvbmNhdChbbEhhc2gsUFMsYnVmZmVyXSk7dmFyIHNlZWQ9Y3J5cHQucmFuZG9tQnl0ZXMoaExlbik7dmFyIG1hc2s9bWdmKHNlZWQsREIubGVuZ3RoLGhhc2gpO2Zvcih2YXIgaT0wO2k8REIubGVuZ3RoO2krKyl7REJbaV1ePW1hc2tbaV19bWFzaz1tZ2YoREIsaExlbixoYXNoKTtmb3IoaT0wO2k8c2VlZC5sZW5ndGg7aSsrKXtzZWVkW2ldXj1tYXNrW2ldfXZhciBlbT1CdWZmZXIuYWxsb2MoMStzZWVkLmxlbmd0aCtEQi5sZW5ndGgpO2VtWzBdPTA7c2VlZC5jb3B5KGVtLDEpO0RCLmNvcHkoZW0sMStzZWVkLmxlbmd0aCk7cmV0dXJuIGVtfTtTY2hlbWUucHJvdG90eXBlLmVuY1VuUGFkPWZ1bmN0aW9uKGJ1ZmZlcil7dmFyIGhhc2g9dGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTjt2YXIgbWdmPXRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5tZ2Z8fG1vZHVsZS5leHBvcnRzLmVtZV9vYWVwX21nZjE7dmFyIGxhYmVsPXRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5sYWJlbHx8QnVmZmVyLmFsbG9jKDApO3ZhciBoTGVuPW1vZHVsZS5leHBvcnRzLmRpZ2VzdExlbmd0aFtoYXNoXTtpZihidWZmZXIubGVuZ3RoPDIqaExlbisyKXt0aHJvdyBuZXcgRXJyb3IoIkVycm9yIGRlY29kaW5nIG1lc3NhZ2UsIHRoZSBzdXBwbGllZCBtZXNzYWdlIGlzIG5vdCBsb25nIGVub3VnaCB0byBiZSBhIHZhbGlkIE9BRVAgZW5jb2RlZCBtZXNzYWdlIil9dmFyIHNlZWQ9YnVmZmVyLnNsaWNlKDEsaExlbisxKTt2YXIgREI9YnVmZmVyLnNsaWNlKDEraExlbik7dmFyIG1hc2s9bWdmKERCLGhMZW4saGFzaCk7Zm9yKHZhciBpPTA7aTxzZWVkLmxlbmd0aDtpKyspe3NlZWRbaV1ePW1hc2tbaV19bWFzaz1tZ2Yoc2VlZCxEQi5sZW5ndGgsaGFzaCk7Zm9yKGk9MDtpPERCLmxlbmd0aDtpKyspe0RCW2ldXj1tYXNrW2ldfXZhciBsSGFzaD1jcnlwdC5jcmVhdGVIYXNoKGhhc2gpO2xIYXNoLnVwZGF0ZShsYWJlbCk7bEhhc2g9bEhhc2guZGlnZXN0KCk7dmFyIGxIYXNoRU09REIuc2xpY2UoMCxoTGVuKTtpZihsSGFzaEVNLnRvU3RyaW5nKCJoZXgiKSE9bEhhc2gudG9TdHJpbmcoImhleCIpKXt0aHJvdyBuZXcgRXJyb3IoIkVycm9yIGRlY29kaW5nIG1lc3NhZ2UsIHRoZSBsSGFzaCBjYWxjdWxhdGVkIGZyb20gdGhlIGxhYmVsIHByb3ZpZGVkIGFuZCB0aGUgbEhhc2ggaW4gdGhlIGVuY3J5cHRlZCBkYXRhIGRvIG5vdCBtYXRjaC4iKX1pPWhMZW47d2hpbGUoREJbaSsrXT09PTAmJmk8REIubGVuZ3RoKTtpZihEQltpLTFdIT0xKXt0aHJvdyBuZXcgRXJyb3IoIkVycm9yIGRlY29kaW5nIG1lc3NhZ2UsIHRoZXJlIGlzIG5vIHBhZGRpbmcgbWVzc2FnZSBzZXBhcmF0b3IgYnl0ZSIpfXJldHVybiBEQi5zbGljZShpKX07cmV0dXJuIG5ldyBTY2hlbWUoa2V5LG9wdGlvbnMpfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4uL2NyeXB0byI6NDMsYnVmZmVyOjI3fV0sNTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBCaWdJbnRlZ2VyPXJlcXVpcmUoIi4uL2xpYnMvanNibiIpO3ZhciBjcnlwdD1yZXF1aXJlKCIuLi9jcnlwdG8iKTt2YXIgY29uc3RhbnRzPXJlcXVpcmUoImNvbnN0YW50cyIpO3ZhciBTSUdOX0lORk9fSEVBRD17bWQyOkJ1ZmZlci5mcm9tKCIzMDIwMzAwYzA2MDgyYTg2NDg4NmY3MGQwMjAyMDUwMDA0MTAiLCJoZXgiKSxtZDU6QnVmZmVyLmZyb20oIjMwMjAzMDBjMDYwODJhODY0ODg2ZjcwZDAyMDUwNTAwMDQxMCIsImhleCIpLHNoYTE6QnVmZmVyLmZyb20oIjMwMjEzMDA5MDYwNTJiMGUwMzAyMWEwNTAwMDQxNCIsImhleCIpLHNoYTIyNDpCdWZmZXIuZnJvbSgiMzAyZDMwMGQwNjA5NjA4NjQ4MDE2NTAzMDQwMjA0MDUwMDA0MWMiLCJoZXgiKSxzaGEyNTY6QnVmZmVyLmZyb20oIjMwMzEzMDBkMDYwOTYwODY0ODAxNjUwMzA0MDIwMTA1MDAwNDIwIiwiaGV4Iiksc2hhMzg0OkJ1ZmZlci5mcm9tKCIzMDQxMzAwZDA2MDk2MDg2NDgwMTY1MDMwNDAyMDIwNTAwMDQzMCIsImhleCIpLHNoYTUxMjpCdWZmZXIuZnJvbSgiMzA1MTMwMGQwNjA5NjA4NjQ4MDE2NTAzMDQwMjAzMDUwMDA0NDAiLCJoZXgiKSxyaXBlbWQxNjA6QnVmZmVyLmZyb20oIjMwMjEzMDA5MDYwNTJiMjQwMzAyMDEwNTAwMDQxNCIsImhleCIpLHJtZDE2MDpCdWZmZXIuZnJvbSgiMzAyMTMwMDkwNjA1MmIyNDAzMDIwMTA1MDAwNDE0IiwiaGV4Iil9O3ZhciBTSUdOX0FMR19UT19IQVNIX0FMSUFTRVM9e3JpcGVtZDE2MDoicm1kMTYwIn07dmFyIERFRkFVTFRfSEFTSF9GVU5DVElPTj0ic2hhMjU2Ijttb2R1bGUuZXhwb3J0cz17aXNFbmNyeXB0aW9uOnRydWUsaXNTaWduYXR1cmU6dHJ1ZX07bW9kdWxlLmV4cG9ydHMubWFrZVNjaGVtZT1mdW5jdGlvbihrZXksb3B0aW9ucyl7ZnVuY3Rpb24gU2NoZW1lKGtleSxvcHRpb25zKXt0aGlzLmtleT1rZXk7dGhpcy5vcHRpb25zPW9wdGlvbnN9U2NoZW1lLnByb3RvdHlwZS5tYXhNZXNzYWdlTGVuZ3RoPWZ1bmN0aW9uKCl7aWYodGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZ0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZz09Y29uc3RhbnRzLlJTQV9OT19QQURESU5HKXtyZXR1cm4gdGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aH1yZXR1cm4gdGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aC0xMX07U2NoZW1lLnByb3RvdHlwZS5lbmNQYWQ9ZnVuY3Rpb24oYnVmZmVyLG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGZpbGxlZDtpZihidWZmZXIubGVuZ3RoPnRoaXMua2V5Lm1heE1lc3NhZ2VMZW5ndGgpe3Rocm93IG5ldyBFcnJvcigiTWVzc2FnZSB0b28gbG9uZyBmb3IgUlNBIChuPSIrdGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aCsiLCBsPSIrYnVmZmVyLmxlbmd0aCsiKSIpfWlmKHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmdGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmc9PWNvbnN0YW50cy5SU0FfTk9fUEFERElORyl7ZmlsbGVkPUJ1ZmZlci5hbGxvYyh0aGlzLmtleS5tYXhNZXNzYWdlTGVuZ3RoLWJ1ZmZlci5sZW5ndGgpO2ZpbGxlZC5maWxsKDApO3JldHVybiBCdWZmZXIuY29uY2F0KFtmaWxsZWQsYnVmZmVyXSl9aWYob3B0aW9ucy50eXBlPT09MSl7ZmlsbGVkPUJ1ZmZlci5hbGxvYyh0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoLWJ1ZmZlci5sZW5ndGgtMSk7ZmlsbGVkLmZpbGwoMjU1LDAsZmlsbGVkLmxlbmd0aC0xKTtmaWxsZWRbMF09MTtmaWxsZWRbZmlsbGVkLmxlbmd0aC0xXT0wO3JldHVybiBCdWZmZXIuY29uY2F0KFtmaWxsZWQsYnVmZmVyXSl9ZWxzZXtmaWxsZWQ9QnVmZmVyLmFsbG9jKHRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgtYnVmZmVyLmxlbmd0aCk7ZmlsbGVkWzBdPTA7ZmlsbGVkWzFdPTI7dmFyIHJhbmQ9Y3J5cHQucmFuZG9tQnl0ZXMoZmlsbGVkLmxlbmd0aC0zKTtmb3IodmFyIGk9MDtpPHJhbmQubGVuZ3RoO2krKyl7dmFyIHI9cmFuZFtpXTt3aGlsZShyPT09MCl7cj1jcnlwdC5yYW5kb21CeXRlcygxKVswXX1maWxsZWRbaSsyXT1yfWZpbGxlZFtmaWxsZWQubGVuZ3RoLTFdPTA7cmV0dXJuIEJ1ZmZlci5jb25jYXQoW2ZpbGxlZCxidWZmZXJdKX19O1NjaGVtZS5wcm90b3R5cGUuZW5jVW5QYWQ9ZnVuY3Rpb24oYnVmZmVyLG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGk9MDtpZih0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJnRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nPT1jb25zdGFudHMuUlNBX05PX1BBRERJTkcpe3ZhciB1blBhZDtpZih0eXBlb2YgYnVmZmVyLmxhc3RJbmRleE9mPT0iZnVuY3Rpb24iKXt1blBhZD1idWZmZXIuc2xpY2UoYnVmZmVyLmxhc3RJbmRleE9mKCJcMCIpKzEsYnVmZmVyLmxlbmd0aCl9ZWxzZXt1blBhZD1idWZmZXIuc2xpY2UoU3RyaW5nLnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwiXDAiKSsxLGJ1ZmZlci5sZW5ndGgpfXJldHVybiB1blBhZH1pZihidWZmZXIubGVuZ3RoPDQpe3JldHVybiBudWxsfWlmKG9wdGlvbnMudHlwZT09PTEpe2lmKGJ1ZmZlclswXSE9PTAmJmJ1ZmZlclsxXSE9PTEpe3JldHVybiBudWxsfWk9Mzt3aGlsZShidWZmZXJbaV0hPT0wKXtpZihidWZmZXJbaV0hPTI1NXx8KytpPj1idWZmZXIubGVuZ3RoKXtyZXR1cm4gbnVsbH19fWVsc2V7aWYoYnVmZmVyWzBdIT09MCYmYnVmZmVyWzFdIT09Mil7cmV0dXJuIG51bGx9aT0zO3doaWxlKGJ1ZmZlcltpXSE9PTApe2lmKCsraT49YnVmZmVyLmxlbmd0aCl7cmV0dXJuIG51bGx9fX1yZXR1cm4gYnVmZmVyLnNsaWNlKGkrMSxidWZmZXIubGVuZ3RoKX07U2NoZW1lLnByb3RvdHlwZS5zaWduPWZ1bmN0aW9uKGJ1ZmZlcil7dmFyIGhhc2hBbGdvcml0aG09dGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTjtpZih0aGlzLm9wdGlvbnMuZW52aXJvbm1lbnQ9PT0iYnJvd3NlciIpe2hhc2hBbGdvcml0aG09U0lHTl9BTEdfVE9fSEFTSF9BTElBU0VTW2hhc2hBbGdvcml0aG1dfHxoYXNoQWxnb3JpdGhtO3ZhciBoYXNoZXI9Y3J5cHQuY3JlYXRlSGFzaChoYXNoQWxnb3JpdGhtKTtoYXNoZXIudXBkYXRlKGJ1ZmZlcik7dmFyIGhhc2g9dGhpcy5wa2NzMXBhZChoYXNoZXIuZGlnZXN0KCksaGFzaEFsZ29yaXRobSk7dmFyIHJlcz10aGlzLmtleS4kZG9Qcml2YXRlKG5ldyBCaWdJbnRlZ2VyKGhhc2gpKS50b0J1ZmZlcih0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoKTtyZXR1cm4gcmVzfWVsc2V7dmFyIHNpZ25lcj1jcnlwdC5jcmVhdGVTaWduKCJSU0EtIitoYXNoQWxnb3JpdGhtLnRvVXBwZXJDYXNlKCkpO3NpZ25lci51cGRhdGUoYnVmZmVyKTtyZXR1cm4gc2lnbmVyLnNpZ24odGhpcy5vcHRpb25zLnJzYVV0aWxzLmV4cG9ydEtleSgicHJpdmF0ZSIpKX19O1NjaGVtZS5wcm90b3R5cGUudmVyaWZ5PWZ1bmN0aW9uKGJ1ZmZlcixzaWduYXR1cmUsc2lnbmF0dXJlX2VuY29kaW5nKXtjb25zb2xlLmxvZygidmVyaWZ5Iik7aWYodGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZ0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZz09Y29uc3RhbnRzLlJTQV9OT19QQURESU5HKXtyZXR1cm4gZmFsc2V9dmFyIGhhc2hBbGdvcml0aG09dGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTjtpZih0aGlzLm9wdGlvbnMuZW52aXJvbm1lbnQ9PT0iYnJvd3NlciIpe2hhc2hBbGdvcml0aG09U0lHTl9BTEdfVE9fSEFTSF9BTElBU0VTW2hhc2hBbGdvcml0aG1dfHxoYXNoQWxnb3JpdGhtO2lmKHNpZ25hdHVyZV9lbmNvZGluZyl7c2lnbmF0dXJlPUJ1ZmZlci5mcm9tKHNpZ25hdHVyZSxzaWduYXR1cmVfZW5jb2RpbmcpfXZhciBoYXNoZXI9Y3J5cHQuY3JlYXRlSGFzaChoYXNoQWxnb3JpdGhtKTtoYXNoZXIudXBkYXRlKGJ1ZmZlcik7dmFyIGhhc2g9dGhpcy5wa2NzMXBhZChoYXNoZXIuZGlnZXN0KCksaGFzaEFsZ29yaXRobSk7dmFyIG09dGhpcy5rZXkuJGRvUHVibGljKG5ldyBCaWdJbnRlZ2VyKHNpZ25hdHVyZSkpO3JldHVybiBtLnRvQnVmZmVyKCkudG9TdHJpbmcoImhleCIpPT1oYXNoLnRvU3RyaW5nKCJoZXgiKX1lbHNle3ZhciB2ZXJpZmllcj1jcnlwdC5jcmVhdGVWZXJpZnkoIlJTQS0iK2hhc2hBbGdvcml0aG0udG9VcHBlckNhc2UoKSk7dmVyaWZpZXIudXBkYXRlKGJ1ZmZlcik7cmV0dXJuIHZlcmlmaWVyLnZlcmlmeSh0aGlzLm9wdGlvbnMucnNhVXRpbHMuZXhwb3J0S2V5KCJwdWJsaWMiKSxzaWduYXR1cmUsc2lnbmF0dXJlX2VuY29kaW5nKX19O1NjaGVtZS5wcm90b3R5cGUucGtjczBwYWQ9ZnVuY3Rpb24oYnVmZmVyKXt2YXIgZmlsbGVkPUJ1ZmZlci5hbGxvYyh0aGlzLmtleS5tYXhNZXNzYWdlTGVuZ3RoLWJ1ZmZlci5sZW5ndGgpO2ZpbGxlZC5maWxsKDApO3JldHVybiBCdWZmZXIuY29uY2F0KFtmaWxsZWQsYnVmZmVyXSl9O1NjaGVtZS5wcm90b3R5cGUucGtjczB1bnBhZD1mdW5jdGlvbihidWZmZXIpe3ZhciB1blBhZDtpZih0eXBlb2YgYnVmZmVyLmxhc3RJbmRleE9mPT0iZnVuY3Rpb24iKXt1blBhZD1idWZmZXIuc2xpY2UoYnVmZmVyLmxhc3RJbmRleE9mKCJcMCIpKzEsYnVmZmVyLmxlbmd0aCl9ZWxzZXt1blBhZD1idWZmZXIuc2xpY2UoU3RyaW5nLnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwiXDAiKSsxLGJ1ZmZlci5sZW5ndGgpfXJldHVybiB1blBhZH07U2NoZW1lLnByb3RvdHlwZS5wa2NzMXBhZD1mdW5jdGlvbihoYXNoQnVmLGhhc2hBbGdvcml0aG0pe3ZhciBkaWdlc3Q9U0lHTl9JTkZPX0hFQURbaGFzaEFsZ29yaXRobV07aWYoIWRpZ2VzdCl7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGhhc2ggYWxnb3JpdGhtIil9dmFyIGRhdGE9QnVmZmVyLmNvbmNhdChbZGlnZXN0LGhhc2hCdWZdKTtpZihkYXRhLmxlbmd0aCsxMD50aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoKXt0aHJvdyBFcnJvcigiS2V5IGlzIHRvbyBzaG9ydCBmb3Igc2lnbmluZyBhbGdvcml0aG0gKCIraGFzaEFsZ29yaXRobSsiKSIpfXZhciBmaWxsZWQ9QnVmZmVyLmFsbG9jKHRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgtZGF0YS5sZW5ndGgtMSk7ZmlsbGVkLmZpbGwoMjU1LDAsZmlsbGVkLmxlbmd0aC0xKTtmaWxsZWRbMF09MTtmaWxsZWRbZmlsbGVkLmxlbmd0aC0xXT0wO3ZhciByZXM9QnVmZmVyLmNvbmNhdChbZmlsbGVkLGRhdGFdKTtyZXR1cm4gcmVzfTtyZXR1cm4gbmV3IFNjaGVtZShrZXksb3B0aW9ucyl9fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vY3J5cHRvIjo0MywiLi4vbGlicy9qc2JuIjo1MixidWZmZXI6MjcsY29uc3RhbnRzOjI5fV0sNTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBCaWdJbnRlZ2VyPXJlcXVpcmUoIi4uL2xpYnMvanNibiIpO3ZhciBjcnlwdD1yZXF1aXJlKCIuLi9jcnlwdG8iKTttb2R1bGUuZXhwb3J0cz17aXNFbmNyeXB0aW9uOmZhbHNlLGlzU2lnbmF0dXJlOnRydWV9O3ZhciBERUZBVUxUX0hBU0hfRlVOQ1RJT049InNoYTEiO3ZhciBERUZBVUxUX1NBTFRfTEVOR1RIPTIwO21vZHVsZS5leHBvcnRzLm1ha2VTY2hlbWU9ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe3ZhciBPQUVQPXJlcXVpcmUoIi4vc2NoZW1lcyIpLnBrY3MxX29hZXA7ZnVuY3Rpb24gU2NoZW1lKGtleSxvcHRpb25zKXt0aGlzLmtleT1rZXk7dGhpcy5vcHRpb25zPW9wdGlvbnN9U2NoZW1lLnByb3RvdHlwZS5zaWduPWZ1bmN0aW9uKGJ1ZmZlcil7dmFyIG1IYXNoPWNyeXB0LmNyZWF0ZUhhc2godGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTik7bUhhc2gudXBkYXRlKGJ1ZmZlcik7dmFyIGVuY29kZWQ9dGhpcy5lbXNhX3Bzc19lbmNvZGUobUhhc2guZGlnZXN0KCksdGhpcy5rZXkua2V5U2l6ZS0xKTtyZXR1cm4gdGhpcy5rZXkuJGRvUHJpdmF0ZShuZXcgQmlnSW50ZWdlcihlbmNvZGVkKSkudG9CdWZmZXIodGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aCl9O1NjaGVtZS5wcm90b3R5cGUudmVyaWZ5PWZ1bmN0aW9uKGJ1ZmZlcixzaWduYXR1cmUsc2lnbmF0dXJlX2VuY29kaW5nKXtpZihzaWduYXR1cmVfZW5jb2Rpbmcpe3NpZ25hdHVyZT1CdWZmZXIuZnJvbShzaWduYXR1cmUsc2lnbmF0dXJlX2VuY29kaW5nKX1zaWduYXR1cmU9bmV3IEJpZ0ludGVnZXIoc2lnbmF0dXJlKTt2YXIgZW1MZW49TWF0aC5jZWlsKCh0aGlzLmtleS5rZXlTaXplLTEpLzgpO3ZhciBtPXRoaXMua2V5LiRkb1B1YmxpYyhzaWduYXR1cmUpLnRvQnVmZmVyKGVtTGVuKTt2YXIgbUhhc2g9Y3J5cHQuY3JlYXRlSGFzaCh0aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OKTttSGFzaC51cGRhdGUoYnVmZmVyKTtyZXR1cm4gdGhpcy5lbXNhX3Bzc192ZXJpZnkobUhhc2guZGlnZXN0KCksbSx0aGlzLmtleS5rZXlTaXplLTEpfTtTY2hlbWUucHJvdG90eXBlLmVtc2FfcHNzX2VuY29kZT1mdW5jdGlvbihtSGFzaCxlbUJpdHMpe3ZhciBoYXNoPXRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT047dmFyIG1nZj10aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMubWdmfHxPQUVQLmVtZV9vYWVwX21nZjE7dmFyIHNMZW49dGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLnNhbHRMZW5ndGh8fERFRkFVTFRfU0FMVF9MRU5HVEg7dmFyIGhMZW49T0FFUC5kaWdlc3RMZW5ndGhbaGFzaF07dmFyIGVtTGVuPU1hdGguY2VpbChlbUJpdHMvOCk7aWYoZW1MZW48aExlbitzTGVuKzIpe3Rocm93IG5ldyBFcnJvcigiT3V0cHV0IGxlbmd0aCBwYXNzZWQgdG8gZW1CaXRzKCIrZW1CaXRzKyIpIGlzIHRvbyBzbWFsbCBmb3IgdGhlIG9wdGlvbnMgIisic3BlY2lmaWVkKCIraGFzaCsiLCAiK3NMZW4rIikuIFRvIGZpeCB0aGlzIGlzc3VlIGluY3JlYXNlIHRoZSB2YWx1ZSBvZiBlbUJpdHMuIChtaW5pbXVtIHNpemU6ICIrKDgqaExlbis4KnNMZW4rOSkrIikiKX12YXIgc2FsdD1jcnlwdC5yYW5kb21CeXRlcyhzTGVuKTt2YXIgTWFwb3N0cm9waGU9QnVmZmVyLmFsbG9jKDgraExlbitzTGVuKTtNYXBvc3Ryb3BoZS5maWxsKDAsMCw4KTttSGFzaC5jb3B5KE1hcG9zdHJvcGhlLDgpO3NhbHQuY29weShNYXBvc3Ryb3BoZSw4K21IYXNoLmxlbmd0aCk7dmFyIEg9Y3J5cHQuY3JlYXRlSGFzaChoYXNoKTtILnVwZGF0ZShNYXBvc3Ryb3BoZSk7SD1ILmRpZ2VzdCgpO3ZhciBQUz1CdWZmZXIuYWxsb2MoZW1MZW4tc2FsdC5sZW5ndGgtaExlbi0yKTtQUy5maWxsKDApO3ZhciBEQj1CdWZmZXIuYWxsb2MoUFMubGVuZ3RoKzErc2FsdC5sZW5ndGgpO1BTLmNvcHkoREIpO0RCW1BTLmxlbmd0aF09MTtzYWx0LmNvcHkoREIsUFMubGVuZ3RoKzEpO3ZhciBkYk1hc2s9bWdmKEgsREIubGVuZ3RoLGhhc2gpO3ZhciBtYXNrZWREQj1CdWZmZXIuYWxsb2MoREIubGVuZ3RoKTtmb3IodmFyIGk9MDtpPGRiTWFzay5sZW5ndGg7aSsrKXttYXNrZWREQltpXT1EQltpXV5kYk1hc2tbaV19dmFyIGJpdHM9OCplbUxlbi1lbUJpdHM7dmFyIG1hc2s9MjU1XjI1NT4+OC1iaXRzPDw4LWJpdHM7bWFza2VkREJbMF09bWFza2VkREJbMF0mbWFzazt2YXIgRU09QnVmZmVyLmFsbG9jKG1hc2tlZERCLmxlbmd0aCtILmxlbmd0aCsxKTttYXNrZWREQi5jb3B5KEVNLDApO0guY29weShFTSxtYXNrZWREQi5sZW5ndGgpO0VNW0VNLmxlbmd0aC0xXT0xODg7cmV0dXJuIEVNfTtTY2hlbWUucHJvdG90eXBlLmVtc2FfcHNzX3ZlcmlmeT1mdW5jdGlvbihtSGFzaCxFTSxlbUJpdHMpe3ZhciBoYXNoPXRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT047dmFyIG1nZj10aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMubWdmfHxPQUVQLmVtZV9vYWVwX21nZjE7dmFyIHNMZW49dGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLnNhbHRMZW5ndGh8fERFRkFVTFRfU0FMVF9MRU5HVEg7dmFyIGhMZW49T0FFUC5kaWdlc3RMZW5ndGhbaGFzaF07dmFyIGVtTGVuPU1hdGguY2VpbChlbUJpdHMvOCk7aWYoZW1MZW48aExlbitzTGVuKzJ8fEVNW0VNLmxlbmd0aC0xXSE9MTg4KXtyZXR1cm4gZmFsc2V9dmFyIERCPUJ1ZmZlci5hbGxvYyhlbUxlbi1oTGVuLTEpO0VNLmNvcHkoREIsMCwwLGVtTGVuLWhMZW4tMSk7dmFyIG1hc2s9MDtmb3IodmFyIGk9MCxiaXRzPTgqZW1MZW4tZW1CaXRzO2k8Yml0cztpKyspe21hc2t8PTE8PDctaX1pZigoREJbMF0mbWFzaykhPT0wKXtyZXR1cm4gZmFsc2V9dmFyIEg9RU0uc2xpY2UoZW1MZW4taExlbi0xLGVtTGVuLTEpO3ZhciBkYk1hc2s9bWdmKEgsREIubGVuZ3RoLGhhc2gpO2ZvcihpPTA7aTxEQi5sZW5ndGg7aSsrKXtEQltpXV49ZGJNYXNrW2ldfWJpdHM9OCplbUxlbi1lbUJpdHM7bWFzaz0yNTVeMjU1Pj44LWJpdHM8PDgtYml0cztEQlswXT1EQlswXSZtYXNrO2ZvcihpPTA7REJbaV09PT0wJiZpPERCLmxlbmd0aDtpKyspO2lmKERCW2ldIT0xKXtyZXR1cm4gZmFsc2V9dmFyIHNhbHQ9REIuc2xpY2UoREIubGVuZ3RoLXNMZW4pO3ZhciBNYXBvc3Ryb3BoZT1CdWZmZXIuYWxsb2MoOCtoTGVuK3NMZW4pO01hcG9zdHJvcGhlLmZpbGwoMCwwLDgpO21IYXNoLmNvcHkoTWFwb3N0cm9waGUsOCk7c2FsdC5jb3B5KE1hcG9zdHJvcGhlLDgrbUhhc2gubGVuZ3RoKTt2YXIgSGFwb3N0cm9waGU9Y3J5cHQuY3JlYXRlSGFzaChoYXNoKTtIYXBvc3Ryb3BoZS51cGRhdGUoTWFwb3N0cm9waGUpO0hhcG9zdHJvcGhlPUhhcG9zdHJvcGhlLmRpZ2VzdCgpO3JldHVybiBILnRvU3RyaW5nKCJoZXgiKT09PUhhcG9zdHJvcGhlLnRvU3RyaW5nKCJoZXgiKX07cmV0dXJuIG5ldyBTY2hlbWUoa2V5LG9wdGlvbnMpfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4uL2NyeXB0byI6NDMsIi4uL2xpYnMvanNibiI6NTIsIi4vc2NoZW1lcyI6NTcsYnVmZmVyOjI3fV0sNTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXtwa2NzMTpyZXF1aXJlKCIuL3BrY3MxIikscGtjczFfb2FlcDpyZXF1aXJlKCIuL29hZXAiKSxwc3M6cmVxdWlyZSgiLi9wc3MiKSxpc0VuY3J5cHRpb246ZnVuY3Rpb24oc2NoZW1lKXtyZXR1cm4gbW9kdWxlLmV4cG9ydHNbc2NoZW1lXSYmbW9kdWxlLmV4cG9ydHNbc2NoZW1lXS5pc0VuY3J5cHRpb259LGlzU2lnbmF0dXJlOmZ1bmN0aW9uKHNjaGVtZSl7cmV0dXJuIG1vZHVsZS5leHBvcnRzW3NjaGVtZV0mJm1vZHVsZS5leHBvcnRzW3NjaGVtZV0uaXNTaWduYXR1cmV9fX0seyIuL29hZXAiOjU0LCIuL3BrY3MxIjo1NSwiLi9wc3MiOjU2fV0sNTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzLmxpbmVicms9ZnVuY3Rpb24oc3RyLG1heExlbil7dmFyIHJlcz0iIjt2YXIgaT0wO3doaWxlKGkrbWF4TGVuPHN0ci5sZW5ndGgpe3Jlcys9c3RyLnN1YnN0cmluZyhpLGkrbWF4TGVuKSsiXG4iO2krPW1heExlbn1yZXR1cm4gcmVzK3N0ci5zdWJzdHJpbmcoaSxzdHIubGVuZ3RoKX07bW9kdWxlLmV4cG9ydHMuZGV0ZWN0RW52aXJvbm1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQifHx0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiJiYhIXNlbGYucG9zdE1lc3NhZ2U/ImJyb3dzZXIiOiJub2RlIn07bW9kdWxlLmV4cG9ydHMuZ2V0MzJJbnRGcm9tQnVmZmVyPWZ1bmN0aW9uKGJ1ZmZlcixvZmZzZXQpe29mZnNldD1vZmZzZXR8fDA7dmFyIHNpemU9MDtpZigoc2l6ZT1idWZmZXIubGVuZ3RoLW9mZnNldCk+MCl7aWYoc2l6ZT49NCl7cmV0dXJuIGJ1ZmZlci5yZWFkVUludDMyQkUob2Zmc2V0KX1lbHNle3ZhciByZXM9MDtmb3IodmFyIGk9b2Zmc2V0K3NpemUsZD0wO2k+b2Zmc2V0O2ktLSxkKz0yKXtyZXMrPWJ1ZmZlcltpLTFdKk1hdGgucG93KDE2LGQpfXJldHVybiByZXN9fWVsc2V7cmV0dXJuIE5hTn19O21vZHVsZS5leHBvcnRzLl89e2lzT2JqZWN0OmZ1bmN0aW9uKHZhbHVlKXt2YXIgdHlwZT10eXBlb2YgdmFsdWU7cmV0dXJuISF2YWx1ZSYmKHR5cGU9PSJvYmplY3QifHx0eXBlPT0iZnVuY3Rpb24iKX0saXNTdHJpbmc6ZnVuY3Rpb24odmFsdWUpe3JldHVybiB0eXBlb2YgdmFsdWU9PSJzdHJpbmcifHx2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZ30saXNOdW1iZXI6ZnVuY3Rpb24odmFsdWUpe3JldHVybiB0eXBlb2YgdmFsdWU9PSJudW1iZXIifHwhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpJiZpc0Zpbml0ZSh2YWx1ZSl9LG9taXQ6ZnVuY3Rpb24ob2JqLHJlbW92ZVByb3Ape3ZhciBuZXdPYmo9e307Zm9yKHZhciBwcm9wIGluIG9iail7aWYoIW9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKXx8cHJvcD09PXJlbW92ZVByb3Ape2NvbnRpbnVlfW5ld09ialtwcm9wXT1vYmpbcHJvcF19cmV0dXJuIG5ld09ian19O21vZHVsZS5leHBvcnRzLnRyaW1TdXJyb3VuZGluZ1RleHQ9ZnVuY3Rpb24oZGF0YSxvcGVuaW5nLGNsb3Npbmcpe3ZhciB0cmltU3RhcnRJbmRleD0wO3ZhciB0cmltRW5kSW5kZXg9ZGF0YS5sZW5ndGg7dmFyIG9wZW5pbmdCb3VuZGFyeUluZGV4PWRhdGEuaW5kZXhPZihvcGVuaW5nKTtpZihvcGVuaW5nQm91bmRhcnlJbmRleD49MCl7dHJpbVN0YXJ0SW5kZXg9b3BlbmluZ0JvdW5kYXJ5SW5kZXgrb3BlbmluZy5sZW5ndGh9dmFyIGNsb3NpbmdCb3VuZGFyeUluZGV4PWRhdGEuaW5kZXhPZihjbG9zaW5nLG9wZW5pbmdCb3VuZGFyeUluZGV4KTtpZihjbG9zaW5nQm91bmRhcnlJbmRleD49MCl7dHJpbUVuZEluZGV4PWNsb3NpbmdCb3VuZGFyeUluZGV4fXJldHVybiBkYXRhLnN1YnN0cmluZyh0cmltU3RhcnRJbmRleCx0cmltRW5kSW5kZXgpfX0se31dLDU5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIGdldE93blByb3BlcnR5U3ltYm9scz1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO3ZhciBoYXNPd25Qcm9wZXJ0eT1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O3ZhciBwcm9wSXNFbnVtZXJhYmxlPU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7ZnVuY3Rpb24gdG9PYmplY3QodmFsKXtpZih2YWw9PT1udWxsfHx2YWw9PT11bmRlZmluZWQpe3Rocm93IG5ldyBUeXBlRXJyb3IoIk9iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkIil9cmV0dXJuIE9iamVjdCh2YWwpfWZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpe3RyeXtpZighT2JqZWN0LmFzc2lnbil7cmV0dXJuIGZhbHNlfXZhciB0ZXN0MT1uZXcgU3RyaW5nKCJhYmMiKTt0ZXN0MVs1XT0iZGUiO2lmKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QxKVswXT09PSI1Iil7cmV0dXJuIGZhbHNlfXZhciB0ZXN0Mj17fTtmb3IodmFyIGk9MDtpPDEwO2krKyl7dGVzdDJbIl8iK1N0cmluZy5mcm9tQ2hhckNvZGUoaSldPWl9dmFyIG9yZGVyMj1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uKG4pe3JldHVybiB0ZXN0MltuXX0pO2lmKG9yZGVyMi5qb2luKCIiKSE9PSIwMTIzNDU2Nzg5Iil7cmV0dXJuIGZhbHNlfXZhciB0ZXN0Mz17fTsiYWJjZGVmZ2hpamtsbW5vcHFyc3QiLnNwbGl0KCIiKS5mb3JFYWNoKGZ1bmN0aW9uKGxldHRlcil7dGVzdDNbbGV0dGVyXT1sZXR0ZXJ9KTtpZihPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LHRlc3QzKSkuam9pbigiIikhPT0iYWJjZGVmZ2hpamtsbW5vcHFyc3QiKXtyZXR1cm4gZmFsc2V9cmV0dXJuIHRydWV9Y2F0Y2goZXJyKXtyZXR1cm4gZmFsc2V9fW1vZHVsZS5leHBvcnRzPXNob3VsZFVzZU5hdGl2ZSgpP09iamVjdC5hc3NpZ246ZnVuY3Rpb24odGFyZ2V0LHNvdXJjZSl7dmFyIGZyb207dmFyIHRvPXRvT2JqZWN0KHRhcmdldCk7dmFyIHN5bWJvbHM7Zm9yKHZhciBzPTE7czxhcmd1bWVudHMubGVuZ3RoO3MrKyl7ZnJvbT1PYmplY3QoYXJndW1lbnRzW3NdKTtmb3IodmFyIGtleSBpbiBmcm9tKXtpZihoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sa2V5KSl7dG9ba2V5XT1mcm9tW2tleV19fWlmKGdldE93blByb3BlcnR5U3ltYm9scyl7c3ltYm9scz1nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7Zm9yKHZhciBpPTA7aTxzeW1ib2xzLmxlbmd0aDtpKyspe2lmKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLHN5bWJvbHNbaV0pKXt0b1tzeW1ib2xzW2ldXT1mcm9tW3N5bWJvbHNbaV1dfX19fXJldHVybiB0b319LHt9XSw2MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7ZXhwb3J0cy5wYmtkZjI9cmVxdWlyZSgiLi9saWIvYXN5bmMiKTtleHBvcnRzLnBia2RmMlN5bmM9cmVxdWlyZSgiLi9saWIvc3luYyIpfSx7Ii4vbGliL2FzeW5jIjo2MSwiLi9saWIvc3luYyI6NjR9XSw2MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MsZ2xvYmFsKXt2YXIgY2hlY2tQYXJhbWV0ZXJzPXJlcXVpcmUoIi4vcHJlY29uZGl0aW9uIik7dmFyIGRlZmF1bHRFbmNvZGluZz1yZXF1aXJlKCIuL2RlZmF1bHQtZW5jb2RpbmciKTt2YXIgc3luYz1yZXF1aXJlKCIuL3N5bmMiKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBaRVJPX0JVRjt2YXIgc3VidGxlPWdsb2JhbC5jcnlwdG8mJmdsb2JhbC5jcnlwdG8uc3VidGxlO3ZhciB0b0Jyb3dzZXI9e3NoYToiU0hBLTEiLCJzaGEtMSI6IlNIQS0xIixzaGExOiJTSEEtMSIsc2hhMjU2OiJTSEEtMjU2Iiwic2hhLTI1NiI6IlNIQS0yNTYiLHNoYTM4NDoiU0hBLTM4NCIsInNoYS0zODQiOiJTSEEtMzg0Iiwic2hhLTUxMiI6IlNIQS01MTIiLHNoYTUxMjoiU0hBLTUxMiJ9O3ZhciBjaGVja3M9W107ZnVuY3Rpb24gY2hlY2tOYXRpdmUoYWxnbyl7aWYoZ2xvYmFsLnByb2Nlc3MmJiFnbG9iYWwucHJvY2Vzcy5icm93c2VyKXtyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKX1pZighc3VidGxlfHwhc3VidGxlLmltcG9ydEtleXx8IXN1YnRsZS5kZXJpdmVCaXRzKXtyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKX1pZihjaGVja3NbYWxnb10hPT11bmRlZmluZWQpe3JldHVybiBjaGVja3NbYWxnb119WkVST19CVUY9WkVST19CVUZ8fEJ1ZmZlci5hbGxvYyg4KTt2YXIgcHJvbT1icm93c2VyUGJrZGYyKFpFUk9fQlVGLFpFUk9fQlVGLDEwLDEyOCxhbGdvKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIHRydWV9KS5jYXRjaChmdW5jdGlvbigpe3JldHVybiBmYWxzZX0pO2NoZWNrc1thbGdvXT1wcm9tO3JldHVybiBwcm9tfWZ1bmN0aW9uIGJyb3dzZXJQYmtkZjIocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGxlbmd0aCxhbGdvKXtyZXR1cm4gc3VidGxlLmltcG9ydEtleSgicmF3IixwYXNzd29yZCx7bmFtZToiUEJLREYyIn0sZmFsc2UsWyJkZXJpdmVCaXRzIl0pLnRoZW4oZnVuY3Rpb24oa2V5KXtyZXR1cm4gc3VidGxlLmRlcml2ZUJpdHMoe25hbWU6IlBCS0RGMiIsc2FsdDpzYWx0LGl0ZXJhdGlvbnM6aXRlcmF0aW9ucyxoYXNoOntuYW1lOmFsZ299fSxrZXksbGVuZ3RoPDwzKX0pLnRoZW4oZnVuY3Rpb24ocmVzKXtyZXR1cm4gQnVmZmVyLmZyb20ocmVzKX0pfWZ1bmN0aW9uIHJlc29sdmVQcm9taXNlKHByb21pc2UsY2FsbGJhY2spe3Byb21pc2UudGhlbihmdW5jdGlvbihvdXQpe3Byb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXtjYWxsYmFjayhudWxsLG91dCl9KX0sZnVuY3Rpb24oZSl7cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe2NhbGxiYWNrKGUpfSl9KX1tb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsa2V5bGVuLGRpZ2VzdCxjYWxsYmFjayl7aWYodHlwZW9mIGRpZ2VzdD09PSJmdW5jdGlvbiIpe2NhbGxiYWNrPWRpZ2VzdDtkaWdlc3Q9dW5kZWZpbmVkfWRpZ2VzdD1kaWdlc3R8fCJzaGExIjt2YXIgYWxnbz10b0Jyb3dzZXJbZGlnZXN0LnRvTG93ZXJDYXNlKCldO2lmKCFhbGdvfHx0eXBlb2YgZ2xvYmFsLlByb21pc2UhPT0iZnVuY3Rpb24iKXtyZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe3ZhciBvdXQ7dHJ5e291dD1zeW5jKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxrZXlsZW4sZGlnZXN0KX1jYXRjaChlKXtyZXR1cm4gY2FsbGJhY2soZSl9Y2FsbGJhY2sobnVsbCxvdXQpfSl9Y2hlY2tQYXJhbWV0ZXJzKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxrZXlsZW4pO2lmKHR5cGVvZiBjYWxsYmFjayE9PSJmdW5jdGlvbiIpdGhyb3cgbmV3IEVycm9yKCJObyBjYWxsYmFjayBwcm92aWRlZCB0byBwYmtkZjIiKTtpZighQnVmZmVyLmlzQnVmZmVyKHBhc3N3b3JkKSlwYXNzd29yZD1CdWZmZXIuZnJvbShwYXNzd29yZCxkZWZhdWx0RW5jb2RpbmcpO2lmKCFCdWZmZXIuaXNCdWZmZXIoc2FsdCkpc2FsdD1CdWZmZXIuZnJvbShzYWx0LGRlZmF1bHRFbmNvZGluZyk7cmVzb2x2ZVByb21pc2UoY2hlY2tOYXRpdmUoYWxnbykudGhlbihmdW5jdGlvbihyZXNwKXtpZihyZXNwKXJldHVybiBicm93c2VyUGJrZGYyKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxrZXlsZW4sYWxnbyk7cmV0dXJuIHN5bmMocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGtleWxlbixkaWdlc3QpfSksY2FsbGJhY2spfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJfcHJvY2VzcyIpLHR5cGVvZiBnbG9iYWwhPT0idW5kZWZpbmVkIj9nbG9iYWw6dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIj9zZWxmOnR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkIj93aW5kb3c6e30pfSx7Ii4vZGVmYXVsdC1lbmNvZGluZyI6NjIsIi4vcHJlY29uZGl0aW9uIjo2MywiLi9zeW5jIjo2NCxfcHJvY2Vzczo2Niwic2FmZS1idWZmZXIiOjgyfV0sNjI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihwcm9jZXNzKXt2YXIgZGVmYXVsdEVuY29kaW5nO2lmKHByb2Nlc3MuYnJvd3Nlcil7ZGVmYXVsdEVuY29kaW5nPSJ1dGYtOCJ9ZWxzZXt2YXIgcFZlcnNpb25NYWpvcj1wYXJzZUludChwcm9jZXNzLnZlcnNpb24uc3BsaXQoIi4iKVswXS5zbGljZSgxKSwxMCk7ZGVmYXVsdEVuY29kaW5nPXBWZXJzaW9uTWFqb3I+PTY/InV0Zi04IjoiYmluYXJ5In1tb2R1bGUuZXhwb3J0cz1kZWZhdWx0RW5jb2Rpbmd9KS5jYWxsKHRoaXMscmVxdWlyZSgiX3Byb2Nlc3MiKSl9LHtfcHJvY2Vzczo2Nn1dLDYzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgTUFYX0FMTE9DPU1hdGgucG93KDIsMzApLTE7ZnVuY3Rpb24gY2hlY2tCdWZmZXIoYnVmLG5hbWUpe2lmKHR5cGVvZiBidWYhPT0ic3RyaW5nIiYmIUJ1ZmZlci5pc0J1ZmZlcihidWYpKXt0aHJvdyBuZXcgVHlwZUVycm9yKG5hbWUrIiBtdXN0IGJlIGEgYnVmZmVyIG9yIHN0cmluZyIpfX1tb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsa2V5bGVuKXtjaGVja0J1ZmZlcihwYXNzd29yZCwiUGFzc3dvcmQiKTtjaGVja0J1ZmZlcihzYWx0LCJTYWx0Iik7aWYodHlwZW9mIGl0ZXJhdGlvbnMhPT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiSXRlcmF0aW9ucyBub3QgYSBudW1iZXIiKX1pZihpdGVyYXRpb25zPDApe3Rocm93IG5ldyBUeXBlRXJyb3IoIkJhZCBpdGVyYXRpb25zIil9aWYodHlwZW9mIGtleWxlbiE9PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJLZXkgbGVuZ3RoIG5vdCBhIG51bWJlciIpfWlmKGtleWxlbjwwfHxrZXlsZW4+TUFYX0FMTE9DfHxrZXlsZW4hPT1rZXlsZW4pe3Rocm93IG5ldyBUeXBlRXJyb3IoIkJhZCBrZXkgbGVuZ3RoIil9fX0pLmNhbGwodGhpcyx7aXNCdWZmZXI6cmVxdWlyZSgiLi4vLi4vaXMtYnVmZmVyL2luZGV4LmpzIil9KX0seyIuLi8uLi9pcy1idWZmZXIvaW5kZXguanMiOjM3fV0sNjQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBtZDU9cmVxdWlyZSgiY3JlYXRlLWhhc2gvbWQ1Iik7dmFyIFJJUEVNRDE2MD1yZXF1aXJlKCJyaXBlbWQxNjAiKTt2YXIgc2hhPXJlcXVpcmUoInNoYS5qcyIpO3ZhciBjaGVja1BhcmFtZXRlcnM9cmVxdWlyZSgiLi9wcmVjb25kaXRpb24iKTt2YXIgZGVmYXVsdEVuY29kaW5nPXJlcXVpcmUoIi4vZGVmYXVsdC1lbmNvZGluZyIpO3ZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7dmFyIFpFUk9TPUJ1ZmZlci5hbGxvYygxMjgpO3ZhciBzaXplcz17bWQ1OjE2LHNoYTE6MjAsc2hhMjI0OjI4LHNoYTI1NjozMixzaGEzODQ6NDgsc2hhNTEyOjY0LHJtZDE2MDoyMCxyaXBlbWQxNjA6MjB9O2Z1bmN0aW9uIEhtYWMoYWxnLGtleSxzYWx0TGVuKXt2YXIgaGFzaD1nZXREaWdlc3QoYWxnKTt2YXIgYmxvY2tzaXplPWFsZz09PSJzaGE1MTIifHxhbGc9PT0ic2hhMzg0Ij8xMjg6NjQ7aWYoa2V5Lmxlbmd0aD5ibG9ja3NpemUpe2tleT1oYXNoKGtleSl9ZWxzZSBpZihrZXkubGVuZ3RoPGJsb2Nrc2l6ZSl7a2V5PUJ1ZmZlci5jb25jYXQoW2tleSxaRVJPU10sYmxvY2tzaXplKX12YXIgaXBhZD1CdWZmZXIuYWxsb2NVbnNhZmUoYmxvY2tzaXplK3NpemVzW2FsZ10pO3ZhciBvcGFkPUJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja3NpemUrc2l6ZXNbYWxnXSk7Zm9yKHZhciBpPTA7aTxibG9ja3NpemU7aSsrKXtpcGFkW2ldPWtleVtpXV41NDtvcGFkW2ldPWtleVtpXV45Mn12YXIgaXBhZDE9QnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZStzYWx0TGVuKzQpO2lwYWQuY29weShpcGFkMSwwLDAsYmxvY2tzaXplKTt0aGlzLmlwYWQxPWlwYWQxO3RoaXMuaXBhZDI9aXBhZDt0aGlzLm9wYWQ9b3BhZDt0aGlzLmFsZz1hbGc7dGhpcy5ibG9ja3NpemU9YmxvY2tzaXplO3RoaXMuaGFzaD1oYXNoO3RoaXMuc2l6ZT1zaXplc1thbGddfUhtYWMucHJvdG90eXBlLnJ1bj1mdW5jdGlvbihkYXRhLGlwYWQpe2RhdGEuY29weShpcGFkLHRoaXMuYmxvY2tzaXplKTt2YXIgaD10aGlzLmhhc2goaXBhZCk7aC5jb3B5KHRoaXMub3BhZCx0aGlzLmJsb2Nrc2l6ZSk7cmV0dXJuIHRoaXMuaGFzaCh0aGlzLm9wYWQpfTtmdW5jdGlvbiBnZXREaWdlc3QoYWxnKXtmdW5jdGlvbiBzaGFGdW5jKGRhdGEpe3JldHVybiBzaGEoYWxnKS51cGRhdGUoZGF0YSkuZGlnZXN0KCl9ZnVuY3Rpb24gcm1kMTYwRnVuYyhkYXRhKXtyZXR1cm4obmV3IFJJUEVNRDE2MCkudXBkYXRlKGRhdGEpLmRpZ2VzdCgpfWlmKGFsZz09PSJybWQxNjAifHxhbGc9PT0icmlwZW1kMTYwIilyZXR1cm4gcm1kMTYwRnVuYztpZihhbGc9PT0ibWQ1IilyZXR1cm4gbWQ1O3JldHVybiBzaGFGdW5jfWZ1bmN0aW9uIHBia2RmMihwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsa2V5bGVuLGRpZ2VzdCl7Y2hlY2tQYXJhbWV0ZXJzKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxrZXlsZW4pO2lmKCFCdWZmZXIuaXNCdWZmZXIocGFzc3dvcmQpKXBhc3N3b3JkPUJ1ZmZlci5mcm9tKHBhc3N3b3JkLGRlZmF1bHRFbmNvZGluZyk7aWYoIUJ1ZmZlci5pc0J1ZmZlcihzYWx0KSlzYWx0PUJ1ZmZlci5mcm9tKHNhbHQsZGVmYXVsdEVuY29kaW5nKTtkaWdlc3Q9ZGlnZXN0fHwic2hhMSI7dmFyIGhtYWM9bmV3IEhtYWMoZGlnZXN0LHBhc3N3b3JkLHNhbHQubGVuZ3RoKTt2YXIgREs9QnVmZmVyLmFsbG9jVW5zYWZlKGtleWxlbik7dmFyIGJsb2NrMT1CdWZmZXIuYWxsb2NVbnNhZmUoc2FsdC5sZW5ndGgrNCk7c2FsdC5jb3B5KGJsb2NrMSwwLDAsc2FsdC5sZW5ndGgpO3ZhciBkZXN0UG9zPTA7dmFyIGhMZW49c2l6ZXNbZGlnZXN0XTt2YXIgbD1NYXRoLmNlaWwoa2V5bGVuL2hMZW4pO2Zvcih2YXIgaT0xO2k8PWw7aSsrKXtibG9jazEud3JpdGVVSW50MzJCRShpLHNhbHQubGVuZ3RoKTt2YXIgVD1obWFjLnJ1bihibG9jazEsaG1hYy5pcGFkMSk7dmFyIFU9VDtmb3IodmFyIGo9MTtqPGl0ZXJhdGlvbnM7aisrKXtVPWhtYWMucnVuKFUsaG1hYy5pcGFkMik7Zm9yKHZhciBrPTA7azxoTGVuO2srKylUW2tdXj1VW2tdfVQuY29weShESyxkZXN0UG9zKTtkZXN0UG9zKz1oTGVufXJldHVybiBES31tb2R1bGUuZXhwb3J0cz1wYmtkZjJ9LHsiLi9kZWZhdWx0LWVuY29kaW5nIjo2MiwiLi9wcmVjb25kaXRpb24iOjYzLCJjcmVhdGUtaGFzaC9tZDUiOjMyLHJpcGVtZDE2MDo4MSwic2FmZS1idWZmZXIiOjgyLCJzaGEuanMiOjk0fV0sNjU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihwcm9jZXNzKXsidXNlIHN0cmljdCI7aWYodHlwZW9mIHByb2Nlc3M9PT0idW5kZWZpbmVkInx8IXByb2Nlc3MudmVyc2lvbnx8cHJvY2Vzcy52ZXJzaW9uLmluZGV4T2YoInYwLiIpPT09MHx8cHJvY2Vzcy52ZXJzaW9uLmluZGV4T2YoInYxLiIpPT09MCYmcHJvY2Vzcy52ZXJzaW9uLmluZGV4T2YoInYxLjguIikhPT0wKXttb2R1bGUuZXhwb3J0cz17bmV4dFRpY2s6bmV4dFRpY2t9fWVsc2V7bW9kdWxlLmV4cG9ydHM9cHJvY2Vzc31mdW5jdGlvbiBuZXh0VGljayhmbixhcmcxLGFyZzIsYXJnMyl7aWYodHlwZW9mIGZuIT09ImZ1bmN0aW9uIil7dGhyb3cgbmV3IFR5cGVFcnJvcignImNhbGxiYWNrIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKX12YXIgbGVuPWFyZ3VtZW50cy5sZW5ndGg7dmFyIGFyZ3MsaTtzd2l0Y2gobGVuKXtjYXNlIDA6Y2FzZSAxOnJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZuKTtjYXNlIDI6cmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gYWZ0ZXJUaWNrT25lKCl7Zm4uY2FsbChudWxsLGFyZzEpfSk7Y2FzZSAzOnJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGlja1R3bygpe2ZuLmNhbGwobnVsbCxhcmcxLGFyZzIpfSk7Y2FzZSA0OnJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGlja1RocmVlKCl7Zm4uY2FsbChudWxsLGFyZzEsYXJnMixhcmczKX0pO2RlZmF1bHQ6YXJncz1uZXcgQXJyYXkobGVuLTEpO2k9MDt3aGlsZShpPGFyZ3MubGVuZ3RoKXthcmdzW2krK109YXJndW1lbnRzW2ldfXJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGljaygpe2ZuLmFwcGx5KG51bGwsYXJncyl9KX19fSkuY2FsbCh0aGlzLHJlcXVpcmUoIl9wcm9jZXNzIikpfSx7X3Byb2Nlc3M6NjZ9XSw2NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIHByb2Nlc3M9bW9kdWxlLmV4cG9ydHM9e307dmFyIGNhY2hlZFNldFRpbWVvdXQ7dmFyIGNhY2hlZENsZWFyVGltZW91dDtmdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCl7dGhyb3cgbmV3IEVycm9yKCJzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkIil9ZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCgpe3Rocm93IG5ldyBFcnJvcigiY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkIil9KGZ1bmN0aW9uKCl7dHJ5e2lmKHR5cGVvZiBzZXRUaW1lb3V0PT09ImZ1bmN0aW9uIil7Y2FjaGVkU2V0VGltZW91dD1zZXRUaW1lb3V0fWVsc2V7Y2FjaGVkU2V0VGltZW91dD1kZWZhdWx0U2V0VGltb3V0fX1jYXRjaChlKXtjYWNoZWRTZXRUaW1lb3V0PWRlZmF1bHRTZXRUaW1vdXR9dHJ5e2lmKHR5cGVvZiBjbGVhclRpbWVvdXQ9PT0iZnVuY3Rpb24iKXtjYWNoZWRDbGVhclRpbWVvdXQ9Y2xlYXJUaW1lb3V0fWVsc2V7Y2FjaGVkQ2xlYXJUaW1lb3V0PWRlZmF1bHRDbGVhclRpbWVvdXR9fWNhdGNoKGUpe2NhY2hlZENsZWFyVGltZW91dD1kZWZhdWx0Q2xlYXJUaW1lb3V0fX0pKCk7ZnVuY3Rpb24gcnVuVGltZW91dChmdW4pe2lmKGNhY2hlZFNldFRpbWVvdXQ9PT1zZXRUaW1lb3V0KXtyZXR1cm4gc2V0VGltZW91dChmdW4sMCl9aWYoKGNhY2hlZFNldFRpbWVvdXQ9PT1kZWZhdWx0U2V0VGltb3V0fHwhY2FjaGVkU2V0VGltZW91dCkmJnNldFRpbWVvdXQpe2NhY2hlZFNldFRpbWVvdXQ9c2V0VGltZW91dDtyZXR1cm4gc2V0VGltZW91dChmdW4sMCl9dHJ5e3JldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwwKX1jYXRjaChlKXt0cnl7cmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLGZ1biwwKX1jYXRjaChlKXtyZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsZnVuLDApfX19ZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcil7aWYoY2FjaGVkQ2xlYXJUaW1lb3V0PT09Y2xlYXJUaW1lb3V0KXtyZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcil9aWYoKGNhY2hlZENsZWFyVGltZW91dD09PWRlZmF1bHRDbGVhclRpbWVvdXR8fCFjYWNoZWRDbGVhclRpbWVvdXQpJiZjbGVhclRpbWVvdXQpe2NhY2hlZENsZWFyVGltZW91dD1jbGVhclRpbWVvdXQ7cmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpfXRyeXtyZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcil9Y2F0Y2goZSl7dHJ5e3JldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLG1hcmtlcil9Y2F0Y2goZSl7cmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsbWFya2VyKX19fXZhciBxdWV1ZT1bXTt2YXIgZHJhaW5pbmc9ZmFsc2U7dmFyIGN1cnJlbnRRdWV1ZTt2YXIgcXVldWVJbmRleD0tMTtmdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKXtpZighZHJhaW5pbmd8fCFjdXJyZW50UXVldWUpe3JldHVybn1kcmFpbmluZz1mYWxzZTtpZihjdXJyZW50UXVldWUubGVuZ3RoKXtxdWV1ZT1jdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKX1lbHNle3F1ZXVlSW5kZXg9LTF9aWYocXVldWUubGVuZ3RoKXtkcmFpblF1ZXVlKCl9fWZ1bmN0aW9uIGRyYWluUXVldWUoKXtpZihkcmFpbmluZyl7cmV0dXJufXZhciB0aW1lb3V0PXJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtkcmFpbmluZz10cnVlO3ZhciBsZW49cXVldWUubGVuZ3RoO3doaWxlKGxlbil7Y3VycmVudFF1ZXVlPXF1ZXVlO3F1ZXVlPVtdO3doaWxlKCsrcXVldWVJbmRleDxsZW4pe2lmKGN1cnJlbnRRdWV1ZSl7Y3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpfX1xdWV1ZUluZGV4PS0xO2xlbj1xdWV1ZS5sZW5ndGh9Y3VycmVudFF1ZXVlPW51bGw7ZHJhaW5pbmc9ZmFsc2U7cnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpfXByb2Nlc3MubmV4dFRpY2s9ZnVuY3Rpb24oZnVuKXt2YXIgYXJncz1uZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aC0xKTtpZihhcmd1bWVudHMubGVuZ3RoPjEpe2Zvcih2YXIgaT0xO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspe2FyZ3NbaS0xXT1hcmd1bWVudHNbaV19fXF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLGFyZ3MpKTtpZihxdWV1ZS5sZW5ndGg9PT0xJiYhZHJhaW5pbmcpe3J1blRpbWVvdXQoZHJhaW5RdWV1ZSl9fTtmdW5jdGlvbiBJdGVtKGZ1bixhcnJheSl7dGhpcy5mdW49ZnVuO3RoaXMuYXJyYXk9YXJyYXl9SXRlbS5wcm90b3R5cGUucnVuPWZ1bmN0aW9uKCl7dGhpcy5mdW4uYXBwbHkobnVsbCx0aGlzLmFycmF5KX07cHJvY2Vzcy50aXRsZT0iYnJvd3NlciI7cHJvY2Vzcy5icm93c2VyPXRydWU7cHJvY2Vzcy5lbnY9e307cHJvY2Vzcy5hcmd2PVtdO3Byb2Nlc3MudmVyc2lvbj0iIjtwcm9jZXNzLnZlcnNpb25zPXt9O2Z1bmN0aW9uIG5vb3AoKXt9cHJvY2Vzcy5vbj1ub29wO3Byb2Nlc3MuYWRkTGlzdGVuZXI9bm9vcDtwcm9jZXNzLm9uY2U9bm9vcDtwcm9jZXNzLm9mZj1ub29wO3Byb2Nlc3MucmVtb3ZlTGlzdGVuZXI9bm9vcDtwcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycz1ub29wO3Byb2Nlc3MuZW1pdD1ub29wO3Byb2Nlc3MucHJlcGVuZExpc3RlbmVyPW5vb3A7cHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyPW5vb3A7cHJvY2Vzcy5saXN0ZW5lcnM9ZnVuY3Rpb24obmFtZSl7cmV0dXJuW119O3Byb2Nlc3MuYmluZGluZz1mdW5jdGlvbihuYW1lKXt0aHJvdyBuZXcgRXJyb3IoInByb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkIil9O3Byb2Nlc3MuY3dkPWZ1bmN0aW9uKCl7cmV0dXJuIi8ifTtwcm9jZXNzLmNoZGlyPWZ1bmN0aW9uKGRpcil7dGhyb3cgbmV3IEVycm9yKCJwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQiKX07cHJvY2Vzcy51bWFzaz1mdW5jdGlvbigpe3JldHVybiAwfX0se31dLDY3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1yZXF1aXJlKCIuL2xpYi9fc3RyZWFtX2R1cGxleC5qcyIpfSx7Ii4vbGliL19zdHJlYW1fZHVwbGV4LmpzIjo2OH1dLDY4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIHBuYT1yZXF1aXJlKCJwcm9jZXNzLW5leHRpY2stYXJncyIpO3ZhciBvYmplY3RLZXlzPU9iamVjdC5rZXlzfHxmdW5jdGlvbihvYmope3ZhciBrZXlzPVtdO2Zvcih2YXIga2V5IGluIG9iail7a2V5cy5wdXNoKGtleSl9cmV0dXJuIGtleXN9O21vZHVsZS5leHBvcnRzPUR1cGxleDt2YXIgdXRpbD1yZXF1aXJlKCJjb3JlLXV0aWwtaXMiKTt1dGlsLmluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIFJlYWRhYmxlPXJlcXVpcmUoIi4vX3N0cmVhbV9yZWFkYWJsZSIpO3ZhciBXcml0YWJsZT1yZXF1aXJlKCIuL19zdHJlYW1fd3JpdGFibGUiKTt1dGlsLmluaGVyaXRzKER1cGxleCxSZWFkYWJsZSk7e3ZhciBrZXlzPW9iamVjdEtleXMoV3JpdGFibGUucHJvdG90eXBlKTtmb3IodmFyIHY9MDt2PGtleXMubGVuZ3RoO3YrKyl7dmFyIG1ldGhvZD1rZXlzW3ZdO2lmKCFEdXBsZXgucHJvdG90eXBlW21ldGhvZF0pRHVwbGV4LnByb3RvdHlwZVttZXRob2RdPVdyaXRhYmxlLnByb3RvdHlwZVttZXRob2RdfX1mdW5jdGlvbiBEdXBsZXgob3B0aW9ucyl7aWYoISh0aGlzIGluc3RhbmNlb2YgRHVwbGV4KSlyZXR1cm4gbmV3IER1cGxleChvcHRpb25zKTtSZWFkYWJsZS5jYWxsKHRoaXMsb3B0aW9ucyk7V3JpdGFibGUuY2FsbCh0aGlzLG9wdGlvbnMpO2lmKG9wdGlvbnMmJm9wdGlvbnMucmVhZGFibGU9PT1mYWxzZSl0aGlzLnJlYWRhYmxlPWZhbHNlO2lmKG9wdGlvbnMmJm9wdGlvbnMud3JpdGFibGU9PT1mYWxzZSl0aGlzLndyaXRhYmxlPWZhbHNlO3RoaXMuYWxsb3dIYWxmT3Blbj10cnVlO2lmKG9wdGlvbnMmJm9wdGlvbnMuYWxsb3dIYWxmT3Blbj09PWZhbHNlKXRoaXMuYWxsb3dIYWxmT3Blbj1mYWxzZTt0aGlzLm9uY2UoImVuZCIsb25lbmQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShEdXBsZXgucHJvdG90eXBlLCJ3cml0YWJsZUhpZ2hXYXRlck1hcmsiLHtlbnVtZXJhYmxlOmZhbHNlLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl93cml0YWJsZVN0YXRlLmhpZ2hXYXRlck1hcmt9fSk7ZnVuY3Rpb24gb25lbmQoKXtpZih0aGlzLmFsbG93SGFsZk9wZW58fHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQpcmV0dXJuO3BuYS5uZXh0VGljayhvbkVuZE5ULHRoaXMpfWZ1bmN0aW9uIG9uRW5kTlQoc2VsZil7c2VsZi5lbmQoKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoRHVwbGV4LnByb3RvdHlwZSwiZGVzdHJveWVkIix7Z2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5fcmVhZGFibGVTdGF0ZT09PXVuZGVmaW5lZHx8dGhpcy5fd3JpdGFibGVTdGF0ZT09PXVuZGVmaW5lZCl7cmV0dXJuIGZhbHNlfXJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZCYmdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWR9LHNldDpmdW5jdGlvbih2YWx1ZSl7aWYodGhpcy5fcmVhZGFibGVTdGF0ZT09PXVuZGVmaW5lZHx8dGhpcy5fd3JpdGFibGVTdGF0ZT09PXVuZGVmaW5lZCl7cmV0dXJufXRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkPXZhbHVlO3RoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkPXZhbHVlfX0pO0R1cGxleC5wcm90b3R5cGUuX2Rlc3Ryb3k9ZnVuY3Rpb24oZXJyLGNiKXt0aGlzLnB1c2gobnVsbCk7dGhpcy5lbmQoKTtwbmEubmV4dFRpY2soY2IsZXJyKX19LHsiLi9fc3RyZWFtX3JlYWRhYmxlIjo3MCwiLi9fc3RyZWFtX3dyaXRhYmxlIjo3MiwiY29yZS11dGlsLWlzIjozMCxpbmhlcml0czozNiwicHJvY2Vzcy1uZXh0aWNrLWFyZ3MiOjY1fV0sNjk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijttb2R1bGUuZXhwb3J0cz1QYXNzVGhyb3VnaDt2YXIgVHJhbnNmb3JtPXJlcXVpcmUoIi4vX3N0cmVhbV90cmFuc2Zvcm0iKTt2YXIgdXRpbD1yZXF1aXJlKCJjb3JlLXV0aWwtaXMiKTt1dGlsLmluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dXRpbC5pbmhlcml0cyhQYXNzVGhyb3VnaCxUcmFuc2Zvcm0pO2Z1bmN0aW9uIFBhc3NUaHJvdWdoKG9wdGlvbnMpe2lmKCEodGhpcyBpbnN0YW5jZW9mIFBhc3NUaHJvdWdoKSlyZXR1cm4gbmV3IFBhc3NUaHJvdWdoKG9wdGlvbnMpO1RyYW5zZm9ybS5jYWxsKHRoaXMsb3B0aW9ucyl9UGFzc1Rocm91Z2gucHJvdG90eXBlLl90cmFuc2Zvcm09ZnVuY3Rpb24oY2h1bmssZW5jb2RpbmcsY2Ipe2NiKG51bGwsY2h1bmspfX0seyIuL19zdHJlYW1fdHJhbnNmb3JtIjo3MSwiY29yZS11dGlsLWlzIjozMCxpbmhlcml0czozNn1dLDcwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24ocHJvY2VzcyxnbG9iYWwpeyJ1c2Ugc3RyaWN0Ijt2YXIgcG5hPXJlcXVpcmUoInByb2Nlc3MtbmV4dGljay1hcmdzIik7bW9kdWxlLmV4cG9ydHM9UmVhZGFibGU7dmFyIGlzQXJyYXk9cmVxdWlyZSgiaXNhcnJheSIpO3ZhciBEdXBsZXg7UmVhZGFibGUuUmVhZGFibGVTdGF0ZT1SZWFkYWJsZVN0YXRlO3ZhciBFRT1yZXF1aXJlKCJldmVudHMiKS5FdmVudEVtaXR0ZXI7dmFyIEVFbGlzdGVuZXJDb3VudD1mdW5jdGlvbihlbWl0dGVyLHR5cGUpe3JldHVybiBlbWl0dGVyLmxpc3RlbmVycyh0eXBlKS5sZW5ndGh9O3ZhciBTdHJlYW09cmVxdWlyZSgiLi9pbnRlcm5hbC9zdHJlYW1zL3N0cmVhbSIpO3ZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7dmFyIE91clVpbnQ4QXJyYXk9Z2xvYmFsLlVpbnQ4QXJyYXl8fGZ1bmN0aW9uKCl7fTtmdW5jdGlvbiBfdWludDhBcnJheVRvQnVmZmVyKGNodW5rKXtyZXR1cm4gQnVmZmVyLmZyb20oY2h1bmspfWZ1bmN0aW9uIF9pc1VpbnQ4QXJyYXkob2JqKXtyZXR1cm4gQnVmZmVyLmlzQnVmZmVyKG9iail8fG9iaiBpbnN0YW5jZW9mIE91clVpbnQ4QXJyYXl9dmFyIHV0aWw9cmVxdWlyZSgiY29yZS11dGlsLWlzIik7dXRpbC5pbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBkZWJ1Z1V0aWw9cmVxdWlyZSgidXRpbCIpO3ZhciBkZWJ1Zz12b2lkIDA7aWYoZGVidWdVdGlsJiZkZWJ1Z1V0aWwuZGVidWdsb2cpe2RlYnVnPWRlYnVnVXRpbC5kZWJ1Z2xvZygic3RyZWFtIil9ZWxzZXtkZWJ1Zz1mdW5jdGlvbigpe319dmFyIEJ1ZmZlckxpc3Q9cmVxdWlyZSgiLi9pbnRlcm5hbC9zdHJlYW1zL0J1ZmZlckxpc3QiKTt2YXIgZGVzdHJveUltcGw9cmVxdWlyZSgiLi9pbnRlcm5hbC9zdHJlYW1zL2Rlc3Ryb3kiKTt2YXIgU3RyaW5nRGVjb2Rlcjt1dGlsLmluaGVyaXRzKFJlYWRhYmxlLFN0cmVhbSk7dmFyIGtQcm94eUV2ZW50cz1bImVycm9yIiwiY2xvc2UiLCJkZXN0cm95IiwicGF1c2UiLCJyZXN1bWUiXTtmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIoZW1pdHRlcixldmVudCxmbil7aWYodHlwZW9mIGVtaXR0ZXIucHJlcGVuZExpc3RlbmVyPT09ImZ1bmN0aW9uIilyZXR1cm4gZW1pdHRlci5wcmVwZW5kTGlzdGVuZXIoZXZlbnQsZm4pO2lmKCFlbWl0dGVyLl9ldmVudHN8fCFlbWl0dGVyLl9ldmVudHNbZXZlbnRdKWVtaXR0ZXIub24oZXZlbnQsZm4pO2Vsc2UgaWYoaXNBcnJheShlbWl0dGVyLl9ldmVudHNbZXZlbnRdKSllbWl0dGVyLl9ldmVudHNbZXZlbnRdLnVuc2hpZnQoZm4pO2Vsc2UgZW1pdHRlci5fZXZlbnRzW2V2ZW50XT1bZm4sZW1pdHRlci5fZXZlbnRzW2V2ZW50XV19ZnVuY3Rpb24gUmVhZGFibGVTdGF0ZShvcHRpb25zLHN0cmVhbSl7RHVwbGV4PUR1cGxleHx8cmVxdWlyZSgiLi9fc3RyZWFtX2R1cGxleCIpO29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGlzRHVwbGV4PXN0cmVhbSBpbnN0YW5jZW9mIER1cGxleDt0aGlzLm9iamVjdE1vZGU9ISFvcHRpb25zLm9iamVjdE1vZGU7aWYoaXNEdXBsZXgpdGhpcy5vYmplY3RNb2RlPXRoaXMub2JqZWN0TW9kZXx8ISFvcHRpb25zLnJlYWRhYmxlT2JqZWN0TW9kZTt2YXIgaHdtPW9wdGlvbnMuaGlnaFdhdGVyTWFyazt2YXIgcmVhZGFibGVId209b3B0aW9ucy5yZWFkYWJsZUhpZ2hXYXRlck1hcms7dmFyIGRlZmF1bHRId209dGhpcy5vYmplY3RNb2RlPzE2OjE2KjEwMjQ7aWYoaHdtfHxod209PT0wKXRoaXMuaGlnaFdhdGVyTWFyaz1od207ZWxzZSBpZihpc0R1cGxleCYmKHJlYWRhYmxlSHdtfHxyZWFkYWJsZUh3bT09PTApKXRoaXMuaGlnaFdhdGVyTWFyaz1yZWFkYWJsZUh3bTtlbHNlIHRoaXMuaGlnaFdhdGVyTWFyaz1kZWZhdWx0SHdtO3RoaXMuaGlnaFdhdGVyTWFyaz1NYXRoLmZsb29yKHRoaXMuaGlnaFdhdGVyTWFyayk7dGhpcy5idWZmZXI9bmV3IEJ1ZmZlckxpc3Q7dGhpcy5sZW5ndGg9MDt0aGlzLnBpcGVzPW51bGw7dGhpcy5waXBlc0NvdW50PTA7dGhpcy5mbG93aW5nPW51bGw7dGhpcy5lbmRlZD1mYWxzZTt0aGlzLmVuZEVtaXR0ZWQ9ZmFsc2U7dGhpcy5yZWFkaW5nPWZhbHNlO3RoaXMuc3luYz10cnVlO3RoaXMubmVlZFJlYWRhYmxlPWZhbHNlO3RoaXMuZW1pdHRlZFJlYWRhYmxlPWZhbHNlO3RoaXMucmVhZGFibGVMaXN0ZW5pbmc9ZmFsc2U7dGhpcy5yZXN1bWVTY2hlZHVsZWQ9ZmFsc2U7dGhpcy5kZXN0cm95ZWQ9ZmFsc2U7dGhpcy5kZWZhdWx0RW5jb2Rpbmc9b3B0aW9ucy5kZWZhdWx0RW5jb2Rpbmd8fCJ1dGY4Ijt0aGlzLmF3YWl0RHJhaW49MDt0aGlzLnJlYWRpbmdNb3JlPWZhbHNlO3RoaXMuZGVjb2Rlcj1udWxsO3RoaXMuZW5jb2Rpbmc9bnVsbDtpZihvcHRpb25zLmVuY29kaW5nKXtpZighU3RyaW5nRGVjb2RlcilTdHJpbmdEZWNvZGVyPXJlcXVpcmUoInN0cmluZ19kZWNvZGVyLyIpLlN0cmluZ0RlY29kZXI7dGhpcy5kZWNvZGVyPW5ldyBTdHJpbmdEZWNvZGVyKG9wdGlvbnMuZW5jb2RpbmcpO3RoaXMuZW5jb2Rpbmc9b3B0aW9ucy5lbmNvZGluZ319ZnVuY3Rpb24gUmVhZGFibGUob3B0aW9ucyl7RHVwbGV4PUR1cGxleHx8cmVxdWlyZSgiLi9fc3RyZWFtX2R1cGxleCIpO2lmKCEodGhpcyBpbnN0YW5jZW9mIFJlYWRhYmxlKSlyZXR1cm4gbmV3IFJlYWRhYmxlKG9wdGlvbnMpO3RoaXMuX3JlYWRhYmxlU3RhdGU9bmV3IFJlYWRhYmxlU3RhdGUob3B0aW9ucyx0aGlzKTt0aGlzLnJlYWRhYmxlPXRydWU7aWYob3B0aW9ucyl7aWYodHlwZW9mIG9wdGlvbnMucmVhZD09PSJmdW5jdGlvbiIpdGhpcy5fcmVhZD1vcHRpb25zLnJlYWQ7aWYodHlwZW9mIG9wdGlvbnMuZGVzdHJveT09PSJmdW5jdGlvbiIpdGhpcy5fZGVzdHJveT1vcHRpb25zLmRlc3Ryb3l9U3RyZWFtLmNhbGwodGhpcyl9T2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlLnByb3RvdHlwZSwiZGVzdHJveWVkIix7Z2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5fcmVhZGFibGVTdGF0ZT09PXVuZGVmaW5lZCl7cmV0dXJuIGZhbHNlfXJldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZH0sc2V0OmZ1bmN0aW9uKHZhbHVlKXtpZighdGhpcy5fcmVhZGFibGVTdGF0ZSl7cmV0dXJufXRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkPXZhbHVlfX0pO1JlYWRhYmxlLnByb3RvdHlwZS5kZXN0cm95PWRlc3Ryb3lJbXBsLmRlc3Ryb3k7UmVhZGFibGUucHJvdG90eXBlLl91bmRlc3Ryb3k9ZGVzdHJveUltcGwudW5kZXN0cm95O1JlYWRhYmxlLnByb3RvdHlwZS5fZGVzdHJveT1mdW5jdGlvbihlcnIsY2Ipe3RoaXMucHVzaChudWxsKTtjYihlcnIpfTtSZWFkYWJsZS5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihjaHVuayxlbmNvZGluZyl7dmFyIHN0YXRlPXRoaXMuX3JlYWRhYmxlU3RhdGU7dmFyIHNraXBDaHVua0NoZWNrO2lmKCFzdGF0ZS5vYmplY3RNb2RlKXtpZih0eXBlb2YgY2h1bms9PT0ic3RyaW5nIil7ZW5jb2Rpbmc9ZW5jb2Rpbmd8fHN0YXRlLmRlZmF1bHRFbmNvZGluZztpZihlbmNvZGluZyE9PXN0YXRlLmVuY29kaW5nKXtjaHVuaz1CdWZmZXIuZnJvbShjaHVuayxlbmNvZGluZyk7ZW5jb2Rpbmc9IiJ9c2tpcENodW5rQ2hlY2s9dHJ1ZX19ZWxzZXtza2lwQ2h1bmtDaGVjaz10cnVlfXJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsY2h1bmssZW5jb2RpbmcsZmFsc2Usc2tpcENodW5rQ2hlY2spfTtSZWFkYWJsZS5wcm90b3R5cGUudW5zaGlmdD1mdW5jdGlvbihjaHVuayl7cmV0dXJuIHJlYWRhYmxlQWRkQ2h1bmsodGhpcyxjaHVuayxudWxsLHRydWUsZmFsc2UpfTtmdW5jdGlvbiByZWFkYWJsZUFkZENodW5rKHN0cmVhbSxjaHVuayxlbmNvZGluZyxhZGRUb0Zyb250LHNraXBDaHVua0NoZWNrKXt2YXIgc3RhdGU9c3RyZWFtLl9yZWFkYWJsZVN0YXRlO2lmKGNodW5rPT09bnVsbCl7c3RhdGUucmVhZGluZz1mYWxzZTtvbkVvZkNodW5rKHN0cmVhbSxzdGF0ZSl9ZWxzZXt2YXIgZXI7aWYoIXNraXBDaHVua0NoZWNrKWVyPWNodW5rSW52YWxpZChzdGF0ZSxjaHVuayk7aWYoZXIpe3N0cmVhbS5lbWl0KCJlcnJvciIsZXIpfWVsc2UgaWYoc3RhdGUub2JqZWN0TW9kZXx8Y2h1bmsmJmNodW5rLmxlbmd0aD4wKXtpZih0eXBlb2YgY2h1bmshPT0ic3RyaW5nIiYmIXN0YXRlLm9iamVjdE1vZGUmJk9iamVjdC5nZXRQcm90b3R5cGVPZihjaHVuaykhPT1CdWZmZXIucHJvdG90eXBlKXtjaHVuaz1fdWludDhBcnJheVRvQnVmZmVyKGNodW5rKX1pZihhZGRUb0Zyb250KXtpZihzdGF0ZS5lbmRFbWl0dGVkKXN0cmVhbS5lbWl0KCJlcnJvciIsbmV3IEVycm9yKCJzdHJlYW0udW5zaGlmdCgpIGFmdGVyIGVuZCBldmVudCIpKTtlbHNlIGFkZENodW5rKHN0cmVhbSxzdGF0ZSxjaHVuayx0cnVlKX1lbHNlIGlmKHN0YXRlLmVuZGVkKXtzdHJlYW0uZW1pdCgiZXJyb3IiLG5ldyBFcnJvcigic3RyZWFtLnB1c2goKSBhZnRlciBFT0YiKSl9ZWxzZXtzdGF0ZS5yZWFkaW5nPWZhbHNlO2lmKHN0YXRlLmRlY29kZXImJiFlbmNvZGluZyl7Y2h1bms9c3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7aWYoc3RhdGUub2JqZWN0TW9kZXx8Y2h1bmsubGVuZ3RoIT09MClhZGRDaHVuayhzdHJlYW0sc3RhdGUsY2h1bmssZmFsc2UpO2Vsc2UgbWF5YmVSZWFkTW9yZShzdHJlYW0sc3RhdGUpfWVsc2V7YWRkQ2h1bmsoc3RyZWFtLHN0YXRlLGNodW5rLGZhbHNlKX19fWVsc2UgaWYoIWFkZFRvRnJvbnQpe3N0YXRlLnJlYWRpbmc9ZmFsc2V9fXJldHVybiBuZWVkTW9yZURhdGEoc3RhdGUpfWZ1bmN0aW9uIGFkZENodW5rKHN0cmVhbSxzdGF0ZSxjaHVuayxhZGRUb0Zyb250KXtpZihzdGF0ZS5mbG93aW5nJiZzdGF0ZS5sZW5ndGg9PT0wJiYhc3RhdGUuc3luYyl7c3RyZWFtLmVtaXQoImRhdGEiLGNodW5rKTtzdHJlYW0ucmVhZCgwKX1lbHNle3N0YXRlLmxlbmd0aCs9c3RhdGUub2JqZWN0TW9kZT8xOmNodW5rLmxlbmd0aDtpZihhZGRUb0Zyb250KXN0YXRlLmJ1ZmZlci51bnNoaWZ0KGNodW5rKTtlbHNlIHN0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtpZihzdGF0ZS5uZWVkUmVhZGFibGUpZW1pdFJlYWRhYmxlKHN0cmVhbSl9bWF5YmVSZWFkTW9yZShzdHJlYW0sc3RhdGUpfWZ1bmN0aW9uIGNodW5rSW52YWxpZChzdGF0ZSxjaHVuayl7dmFyIGVyO2lmKCFfaXNVaW50OEFycmF5KGNodW5rKSYmdHlwZW9mIGNodW5rIT09InN0cmluZyImJmNodW5rIT09dW5kZWZpbmVkJiYhc3RhdGUub2JqZWN0TW9kZSl7ZXI9bmV3IFR5cGVFcnJvcigiSW52YWxpZCBub24tc3RyaW5nL2J1ZmZlciBjaHVuayIpfXJldHVybiBlcn1mdW5jdGlvbiBuZWVkTW9yZURhdGEoc3RhdGUpe3JldHVybiFzdGF0ZS5lbmRlZCYmKHN0YXRlLm5lZWRSZWFkYWJsZXx8c3RhdGUubGVuZ3RoPHN0YXRlLmhpZ2hXYXRlck1hcmt8fHN0YXRlLmxlbmd0aD09PTApfVJlYWRhYmxlLnByb3RvdHlwZS5pc1BhdXNlZD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmc9PT1mYWxzZX07UmVhZGFibGUucHJvdG90eXBlLnNldEVuY29kaW5nPWZ1bmN0aW9uKGVuYyl7aWYoIVN0cmluZ0RlY29kZXIpU3RyaW5nRGVjb2Rlcj1yZXF1aXJlKCJzdHJpbmdfZGVjb2Rlci8iKS5TdHJpbmdEZWNvZGVyO3RoaXMuX3JlYWRhYmxlU3RhdGUuZGVjb2Rlcj1uZXcgU3RyaW5nRGVjb2RlcihlbmMpO3RoaXMuX3JlYWRhYmxlU3RhdGUuZW5jb2Rpbmc9ZW5jO3JldHVybiB0aGlzfTt2YXIgTUFYX0hXTT04Mzg4NjA4O2Z1bmN0aW9uIGNvbXB1dGVOZXdIaWdoV2F0ZXJNYXJrKG4pe2lmKG4+PU1BWF9IV00pe249TUFYX0hXTX1lbHNle24tLTtufD1uPj4+MTtufD1uPj4+MjtufD1uPj4+NDtufD1uPj4+ODtufD1uPj4+MTY7bisrfXJldHVybiBufWZ1bmN0aW9uIGhvd011Y2hUb1JlYWQobixzdGF0ZSl7aWYobjw9MHx8c3RhdGUubGVuZ3RoPT09MCYmc3RhdGUuZW5kZWQpcmV0dXJuIDA7aWYoc3RhdGUub2JqZWN0TW9kZSlyZXR1cm4gMTtpZihuIT09bil7aWYoc3RhdGUuZmxvd2luZyYmc3RhdGUubGVuZ3RoKXJldHVybiBzdGF0ZS5idWZmZXIuaGVhZC5kYXRhLmxlbmd0aDtlbHNlIHJldHVybiBzdGF0ZS5sZW5ndGh9aWYobj5zdGF0ZS5oaWdoV2F0ZXJNYXJrKXN0YXRlLmhpZ2hXYXRlck1hcms9Y29tcHV0ZU5ld0hpZ2hXYXRlck1hcmsobik7aWYobjw9c3RhdGUubGVuZ3RoKXJldHVybiBuO2lmKCFzdGF0ZS5lbmRlZCl7c3RhdGUubmVlZFJlYWRhYmxlPXRydWU7cmV0dXJuIDB9cmV0dXJuIHN0YXRlLmxlbmd0aH1SZWFkYWJsZS5wcm90b3R5cGUucmVhZD1mdW5jdGlvbihuKXtkZWJ1ZygicmVhZCIsbik7bj1wYXJzZUludChuLDEwKTt2YXIgc3RhdGU9dGhpcy5fcmVhZGFibGVTdGF0ZTt2YXIgbk9yaWc9bjtpZihuIT09MClzdGF0ZS5lbWl0dGVkUmVhZGFibGU9ZmFsc2U7aWYobj09PTAmJnN0YXRlLm5lZWRSZWFkYWJsZSYmKHN0YXRlLmxlbmd0aD49c3RhdGUuaGlnaFdhdGVyTWFya3x8c3RhdGUuZW5kZWQpKXtkZWJ1ZygicmVhZDogZW1pdFJlYWRhYmxlIixzdGF0ZS5sZW5ndGgsc3RhdGUuZW5kZWQpO2lmKHN0YXRlLmxlbmd0aD09PTAmJnN0YXRlLmVuZGVkKWVuZFJlYWRhYmxlKHRoaXMpO2Vsc2UgZW1pdFJlYWRhYmxlKHRoaXMpO3JldHVybiBudWxsfW49aG93TXVjaFRvUmVhZChuLHN0YXRlKTtpZihuPT09MCYmc3RhdGUuZW5kZWQpe2lmKHN0YXRlLmxlbmd0aD09PTApZW5kUmVhZGFibGUodGhpcyk7cmV0dXJuIG51bGx9dmFyIGRvUmVhZD1zdGF0ZS5uZWVkUmVhZGFibGU7ZGVidWcoIm5lZWQgcmVhZGFibGUiLGRvUmVhZCk7aWYoc3RhdGUubGVuZ3RoPT09MHx8c3RhdGUubGVuZ3RoLW48c3RhdGUuaGlnaFdhdGVyTWFyayl7ZG9SZWFkPXRydWU7ZGVidWcoImxlbmd0aCBsZXNzIHRoYW4gd2F0ZXJtYXJrIixkb1JlYWQpfWlmKHN0YXRlLmVuZGVkfHxzdGF0ZS5yZWFkaW5nKXtkb1JlYWQ9ZmFsc2U7ZGVidWcoInJlYWRpbmcgb3IgZW5kZWQiLGRvUmVhZCl9ZWxzZSBpZihkb1JlYWQpe2RlYnVnKCJkbyByZWFkIik7c3RhdGUucmVhZGluZz10cnVlO3N0YXRlLnN5bmM9dHJ1ZTtpZihzdGF0ZS5sZW5ndGg9PT0wKXN0YXRlLm5lZWRSZWFkYWJsZT10cnVlO3RoaXMuX3JlYWQoc3RhdGUuaGlnaFdhdGVyTWFyayk7c3RhdGUuc3luYz1mYWxzZTtpZighc3RhdGUucmVhZGluZyluPWhvd011Y2hUb1JlYWQobk9yaWcsc3RhdGUpfXZhciByZXQ7aWYobj4wKXJldD1mcm9tTGlzdChuLHN0YXRlKTtlbHNlIHJldD1udWxsO2lmKHJldD09PW51bGwpe3N0YXRlLm5lZWRSZWFkYWJsZT10cnVlO249MH1lbHNle3N0YXRlLmxlbmd0aC09bn1pZihzdGF0ZS5sZW5ndGg9PT0wKXtpZighc3RhdGUuZW5kZWQpc3RhdGUubmVlZFJlYWRhYmxlPXRydWU7aWYobk9yaWchPT1uJiZzdGF0ZS5lbmRlZCllbmRSZWFkYWJsZSh0aGlzKX1pZihyZXQhPT1udWxsKXRoaXMuZW1pdCgiZGF0YSIscmV0KTtyZXR1cm4gcmV0fTtmdW5jdGlvbiBvbkVvZkNodW5rKHN0cmVhbSxzdGF0ZSl7aWYoc3RhdGUuZW5kZWQpcmV0dXJuO2lmKHN0YXRlLmRlY29kZXIpe3ZhciBjaHVuaz1zdGF0ZS5kZWNvZGVyLmVuZCgpO2lmKGNodW5rJiZjaHVuay5sZW5ndGgpe3N0YXRlLmJ1ZmZlci5wdXNoKGNodW5rKTtzdGF0ZS5sZW5ndGgrPXN0YXRlLm9iamVjdE1vZGU/MTpjaHVuay5sZW5ndGh9fXN0YXRlLmVuZGVkPXRydWU7ZW1pdFJlYWRhYmxlKHN0cmVhbSl9ZnVuY3Rpb24gZW1pdFJlYWRhYmxlKHN0cmVhbSl7dmFyIHN0YXRlPXN0cmVhbS5fcmVhZGFibGVTdGF0ZTtzdGF0ZS5uZWVkUmVhZGFibGU9ZmFsc2U7aWYoIXN0YXRlLmVtaXR0ZWRSZWFkYWJsZSl7ZGVidWcoImVtaXRSZWFkYWJsZSIsc3RhdGUuZmxvd2luZyk7c3RhdGUuZW1pdHRlZFJlYWRhYmxlPXRydWU7aWYoc3RhdGUuc3luYylwbmEubmV4dFRpY2soZW1pdFJlYWRhYmxlXyxzdHJlYW0pO2Vsc2UgZW1pdFJlYWRhYmxlXyhzdHJlYW0pfX1mdW5jdGlvbiBlbWl0UmVhZGFibGVfKHN0cmVhbSl7ZGVidWcoImVtaXQgcmVhZGFibGUiKTtzdHJlYW0uZW1pdCgicmVhZGFibGUiKTtmbG93KHN0cmVhbSl9ZnVuY3Rpb24gbWF5YmVSZWFkTW9yZShzdHJlYW0sc3RhdGUpe2lmKCFzdGF0ZS5yZWFkaW5nTW9yZSl7c3RhdGUucmVhZGluZ01vcmU9dHJ1ZTtwbmEubmV4dFRpY2sobWF5YmVSZWFkTW9yZV8sc3RyZWFtLHN0YXRlKX19ZnVuY3Rpb24gbWF5YmVSZWFkTW9yZV8oc3RyZWFtLHN0YXRlKXt2YXIgbGVuPXN0YXRlLmxlbmd0aDt3aGlsZSghc3RhdGUucmVhZGluZyYmIXN0YXRlLmZsb3dpbmcmJiFzdGF0ZS5lbmRlZCYmc3RhdGUubGVuZ3RoPHN0YXRlLmhpZ2hXYXRlck1hcmspe2RlYnVnKCJtYXliZVJlYWRNb3JlIHJlYWQgMCIpO3N0cmVhbS5yZWFkKDApO2lmKGxlbj09PXN0YXRlLmxlbmd0aClicmVhaztlbHNlIGxlbj1zdGF0ZS5sZW5ndGh9c3RhdGUucmVhZGluZ01vcmU9ZmFsc2V9UmVhZGFibGUucHJvdG90eXBlLl9yZWFkPWZ1bmN0aW9uKG4pe3RoaXMuZW1pdCgiZXJyb3IiLG5ldyBFcnJvcigiX3JlYWQoKSBpcyBub3QgaW1wbGVtZW50ZWQiKSl9O1JlYWRhYmxlLnByb3RvdHlwZS5waXBlPWZ1bmN0aW9uKGRlc3QscGlwZU9wdHMpe3ZhciBzcmM9dGhpczt2YXIgc3RhdGU9dGhpcy5fcmVhZGFibGVTdGF0ZTtzd2l0Y2goc3RhdGUucGlwZXNDb3VudCl7Y2FzZSAwOnN0YXRlLnBpcGVzPWRlc3Q7YnJlYWs7Y2FzZSAxOnN0YXRlLnBpcGVzPVtzdGF0ZS5waXBlcyxkZXN0XTticmVhaztkZWZhdWx0OnN0YXRlLnBpcGVzLnB1c2goZGVzdCk7YnJlYWt9c3RhdGUucGlwZXNDb3VudCs9MTtkZWJ1ZygicGlwZSBjb3VudD0lZCBvcHRzPSVqIixzdGF0ZS5waXBlc0NvdW50LHBpcGVPcHRzKTt2YXIgZG9FbmQ9KCFwaXBlT3B0c3x8cGlwZU9wdHMuZW5kIT09ZmFsc2UpJiZkZXN0IT09cHJvY2Vzcy5zdGRvdXQmJmRlc3QhPT1wcm9jZXNzLnN0ZGVycjt2YXIgZW5kRm49ZG9FbmQ/b25lbmQ6dW5waXBlO2lmKHN0YXRlLmVuZEVtaXR0ZWQpcG5hLm5leHRUaWNrKGVuZEZuKTtlbHNlIHNyYy5vbmNlKCJlbmQiLGVuZEZuKTtkZXN0Lm9uKCJ1bnBpcGUiLG9udW5waXBlKTtmdW5jdGlvbiBvbnVucGlwZShyZWFkYWJsZSx1bnBpcGVJbmZvKXtkZWJ1Zygib251bnBpcGUiKTtpZihyZWFkYWJsZT09PXNyYyl7aWYodW5waXBlSW5mbyYmdW5waXBlSW5mby5oYXNVbnBpcGVkPT09ZmFsc2Upe3VucGlwZUluZm8uaGFzVW5waXBlZD10cnVlO2NsZWFudXAoKX19fWZ1bmN0aW9uIG9uZW5kKCl7ZGVidWcoIm9uZW5kIik7ZGVzdC5lbmQoKX12YXIgb25kcmFpbj1waXBlT25EcmFpbihzcmMpO2Rlc3Qub24oImRyYWluIixvbmRyYWluKTt2YXIgY2xlYW5lZFVwPWZhbHNlO2Z1bmN0aW9uIGNsZWFudXAoKXtkZWJ1ZygiY2xlYW51cCIpO2Rlc3QucmVtb3ZlTGlzdGVuZXIoImNsb3NlIixvbmNsb3NlKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJmaW5pc2giLG9uZmluaXNoKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJkcmFpbiIsb25kcmFpbik7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZXJyb3IiLG9uZXJyb3IpO2Rlc3QucmVtb3ZlTGlzdGVuZXIoInVucGlwZSIsb251bnBpcGUpO3NyYy5yZW1vdmVMaXN0ZW5lcigiZW5kIixvbmVuZCk7c3JjLnJlbW92ZUxpc3RlbmVyKCJlbmQiLHVucGlwZSk7c3JjLnJlbW92ZUxpc3RlbmVyKCJkYXRhIixvbmRhdGEpO2NsZWFuZWRVcD10cnVlO2lmKHN0YXRlLmF3YWl0RHJhaW4mJighZGVzdC5fd3JpdGFibGVTdGF0ZXx8ZGVzdC5fd3JpdGFibGVTdGF0ZS5uZWVkRHJhaW4pKW9uZHJhaW4oKX12YXIgaW5jcmVhc2VkQXdhaXREcmFpbj1mYWxzZTtzcmMub24oImRhdGEiLG9uZGF0YSk7ZnVuY3Rpb24gb25kYXRhKGNodW5rKXtkZWJ1Zygib25kYXRhIik7aW5jcmVhc2VkQXdhaXREcmFpbj1mYWxzZTt2YXIgcmV0PWRlc3Qud3JpdGUoY2h1bmspO2lmKGZhbHNlPT09cmV0JiYhaW5jcmVhc2VkQXdhaXREcmFpbil7aWYoKHN0YXRlLnBpcGVzQ291bnQ9PT0xJiZzdGF0ZS5waXBlcz09PWRlc3R8fHN0YXRlLnBpcGVzQ291bnQ+MSYmaW5kZXhPZihzdGF0ZS5waXBlcyxkZXN0KSE9PS0xKSYmIWNsZWFuZWRVcCl7ZGVidWcoImZhbHNlIHdyaXRlIHJlc3BvbnNlLCBwYXVzZSIsc3JjLl9yZWFkYWJsZVN0YXRlLmF3YWl0RHJhaW4pO3NyYy5fcmVhZGFibGVTdGF0ZS5hd2FpdERyYWluKys7aW5jcmVhc2VkQXdhaXREcmFpbj10cnVlfXNyYy5wYXVzZSgpfX1mdW5jdGlvbiBvbmVycm9yKGVyKXtkZWJ1Zygib25lcnJvciIsZXIpO3VucGlwZSgpO2Rlc3QucmVtb3ZlTGlzdGVuZXIoImVycm9yIixvbmVycm9yKTtpZihFRWxpc3RlbmVyQ291bnQoZGVzdCwiZXJyb3IiKT09PTApZGVzdC5lbWl0KCJlcnJvciIsZXIpfXByZXBlbmRMaXN0ZW5lcihkZXN0LCJlcnJvciIsb25lcnJvcik7ZnVuY3Rpb24gb25jbG9zZSgpe2Rlc3QucmVtb3ZlTGlzdGVuZXIoImZpbmlzaCIsb25maW5pc2gpO3VucGlwZSgpfWRlc3Qub25jZSgiY2xvc2UiLG9uY2xvc2UpO2Z1bmN0aW9uIG9uZmluaXNoKCl7ZGVidWcoIm9uZmluaXNoIik7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiY2xvc2UiLG9uY2xvc2UpO3VucGlwZSgpfWRlc3Qub25jZSgiZmluaXNoIixvbmZpbmlzaCk7ZnVuY3Rpb24gdW5waXBlKCl7ZGVidWcoInVucGlwZSIpO3NyYy51bnBpcGUoZGVzdCl9ZGVzdC5lbWl0KCJwaXBlIixzcmMpO2lmKCFzdGF0ZS5mbG93aW5nKXtkZWJ1ZygicGlwZSByZXN1bWUiKTtzcmMucmVzdW1lKCl9cmV0dXJuIGRlc3R9O2Z1bmN0aW9uIHBpcGVPbkRyYWluKHNyYyl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIHN0YXRlPXNyYy5fcmVhZGFibGVTdGF0ZTtkZWJ1ZygicGlwZU9uRHJhaW4iLHN0YXRlLmF3YWl0RHJhaW4pO2lmKHN0YXRlLmF3YWl0RHJhaW4pc3RhdGUuYXdhaXREcmFpbi0tO2lmKHN0YXRlLmF3YWl0RHJhaW49PT0wJiZFRWxpc3RlbmVyQ291bnQoc3JjLCJkYXRhIikpe3N0YXRlLmZsb3dpbmc9dHJ1ZTtmbG93KHNyYyl9fX1SZWFkYWJsZS5wcm90b3R5cGUudW5waXBlPWZ1bmN0aW9uKGRlc3Qpe3ZhciBzdGF0ZT10aGlzLl9yZWFkYWJsZVN0YXRlO3ZhciB1bnBpcGVJbmZvPXtoYXNVbnBpcGVkOmZhbHNlfTtpZihzdGF0ZS5waXBlc0NvdW50PT09MClyZXR1cm4gdGhpcztpZihzdGF0ZS5waXBlc0NvdW50PT09MSl7aWYoZGVzdCYmZGVzdCE9PXN0YXRlLnBpcGVzKXJldHVybiB0aGlzO2lmKCFkZXN0KWRlc3Q9c3RhdGUucGlwZXM7c3RhdGUucGlwZXM9bnVsbDtzdGF0ZS5waXBlc0NvdW50PTA7c3RhdGUuZmxvd2luZz1mYWxzZTtpZihkZXN0KWRlc3QuZW1pdCgidW5waXBlIix0aGlzLHVucGlwZUluZm8pO3JldHVybiB0aGlzfWlmKCFkZXN0KXt2YXIgZGVzdHM9c3RhdGUucGlwZXM7dmFyIGxlbj1zdGF0ZS5waXBlc0NvdW50O3N0YXRlLnBpcGVzPW51bGw7c3RhdGUucGlwZXNDb3VudD0wO3N0YXRlLmZsb3dpbmc9ZmFsc2U7Zm9yKHZhciBpPTA7aTxsZW47aSsrKXtkZXN0c1tpXS5lbWl0KCJ1bnBpcGUiLHRoaXMsdW5waXBlSW5mbyl9cmV0dXJuIHRoaXN9dmFyIGluZGV4PWluZGV4T2Yoc3RhdGUucGlwZXMsZGVzdCk7aWYoaW5kZXg9PT0tMSlyZXR1cm4gdGhpcztzdGF0ZS5waXBlcy5zcGxpY2UoaW5kZXgsMSk7c3RhdGUucGlwZXNDb3VudC09MTtpZihzdGF0ZS5waXBlc0NvdW50PT09MSlzdGF0ZS5waXBlcz1zdGF0ZS5waXBlc1swXTtkZXN0LmVtaXQoInVucGlwZSIsdGhpcyx1bnBpcGVJbmZvKTtyZXR1cm4gdGhpc307UmVhZGFibGUucHJvdG90eXBlLm9uPWZ1bmN0aW9uKGV2LGZuKXt2YXIgcmVzPVN0cmVhbS5wcm90b3R5cGUub24uY2FsbCh0aGlzLGV2LGZuKTtpZihldj09PSJkYXRhIil7aWYodGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nIT09ZmFsc2UpdGhpcy5yZXN1bWUoKX1lbHNlIGlmKGV2PT09InJlYWRhYmxlIil7dmFyIHN0YXRlPXRoaXMuX3JlYWRhYmxlU3RhdGU7aWYoIXN0YXRlLmVuZEVtaXR0ZWQmJiFzdGF0ZS5yZWFkYWJsZUxpc3RlbmluZyl7c3RhdGUucmVhZGFibGVMaXN0ZW5pbmc9c3RhdGUubmVlZFJlYWRhYmxlPXRydWU7c3RhdGUuZW1pdHRlZFJlYWRhYmxlPWZhbHNlO2lmKCFzdGF0ZS5yZWFkaW5nKXtwbmEubmV4dFRpY2soblJlYWRpbmdOZXh0VGljayx0aGlzKX1lbHNlIGlmKHN0YXRlLmxlbmd0aCl7ZW1pdFJlYWRhYmxlKHRoaXMpfX19cmV0dXJuIHJlc307UmVhZGFibGUucHJvdG90eXBlLmFkZExpc3RlbmVyPVJlYWRhYmxlLnByb3RvdHlwZS5vbjtmdW5jdGlvbiBuUmVhZGluZ05leHRUaWNrKHNlbGYpe2RlYnVnKCJyZWFkYWJsZSBuZXh0dGljayByZWFkIDAiKTtzZWxmLnJlYWQoMCl9UmVhZGFibGUucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbigpe3ZhciBzdGF0ZT10aGlzLl9yZWFkYWJsZVN0YXRlO2lmKCFzdGF0ZS5mbG93aW5nKXtkZWJ1ZygicmVzdW1lIik7c3RhdGUuZmxvd2luZz10cnVlO3Jlc3VtZSh0aGlzLHN0YXRlKX1yZXR1cm4gdGhpc307ZnVuY3Rpb24gcmVzdW1lKHN0cmVhbSxzdGF0ZSl7aWYoIXN0YXRlLnJlc3VtZVNjaGVkdWxlZCl7c3RhdGUucmVzdW1lU2NoZWR1bGVkPXRydWU7cG5hLm5leHRUaWNrKHJlc3VtZV8sc3RyZWFtLHN0YXRlKX19ZnVuY3Rpb24gcmVzdW1lXyhzdHJlYW0sc3RhdGUpe2lmKCFzdGF0ZS5yZWFkaW5nKXtkZWJ1ZygicmVzdW1lIHJlYWQgMCIpO3N0cmVhbS5yZWFkKDApfXN0YXRlLnJlc3VtZVNjaGVkdWxlZD1mYWxzZTtzdGF0ZS5hd2FpdERyYWluPTA7c3RyZWFtLmVtaXQoInJlc3VtZSIpO2Zsb3coc3RyZWFtKTtpZihzdGF0ZS5mbG93aW5nJiYhc3RhdGUucmVhZGluZylzdHJlYW0ucmVhZCgwKX1SZWFkYWJsZS5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oKXtkZWJ1ZygiY2FsbCBwYXVzZSBmbG93aW5nPSVqIix0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpO2lmKGZhbHNlIT09dGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nKXtkZWJ1ZygicGF1c2UiKTt0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmc9ZmFsc2U7dGhpcy5lbWl0KCJwYXVzZSIpfXJldHVybiB0aGlzfTtmdW5jdGlvbiBmbG93KHN0cmVhbSl7dmFyIHN0YXRlPXN0cmVhbS5fcmVhZGFibGVTdGF0ZTtkZWJ1ZygiZmxvdyIsc3RhdGUuZmxvd2luZyk7d2hpbGUoc3RhdGUuZmxvd2luZyYmc3RyZWFtLnJlYWQoKSE9PW51bGwpe319UmVhZGFibGUucHJvdG90eXBlLndyYXA9ZnVuY3Rpb24oc3RyZWFtKXt2YXIgX3RoaXM9dGhpczt2YXIgc3RhdGU9dGhpcy5fcmVhZGFibGVTdGF0ZTt2YXIgcGF1c2VkPWZhbHNlO3N0cmVhbS5vbigiZW5kIixmdW5jdGlvbigpe2RlYnVnKCJ3cmFwcGVkIGVuZCIpO2lmKHN0YXRlLmRlY29kZXImJiFzdGF0ZS5lbmRlZCl7dmFyIGNodW5rPXN0YXRlLmRlY29kZXIuZW5kKCk7aWYoY2h1bmsmJmNodW5rLmxlbmd0aClfdGhpcy5wdXNoKGNodW5rKX1fdGhpcy5wdXNoKG51bGwpfSk7c3RyZWFtLm9uKCJkYXRhIixmdW5jdGlvbihjaHVuayl7ZGVidWcoIndyYXBwZWQgZGF0YSIpO2lmKHN0YXRlLmRlY29kZXIpY2h1bms9c3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7aWYoc3RhdGUub2JqZWN0TW9kZSYmKGNodW5rPT09bnVsbHx8Y2h1bms9PT11bmRlZmluZWQpKXJldHVybjtlbHNlIGlmKCFzdGF0ZS5vYmplY3RNb2RlJiYoIWNodW5rfHwhY2h1bmsubGVuZ3RoKSlyZXR1cm47dmFyIHJldD1fdGhpcy5wdXNoKGNodW5rKTtpZighcmV0KXtwYXVzZWQ9dHJ1ZTtzdHJlYW0ucGF1c2UoKX19KTtmb3IodmFyIGkgaW4gc3RyZWFtKXtpZih0aGlzW2ldPT09dW5kZWZpbmVkJiZ0eXBlb2Ygc3RyZWFtW2ldPT09ImZ1bmN0aW9uIil7dGhpc1tpXT1mdW5jdGlvbihtZXRob2Qpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBzdHJlYW1bbWV0aG9kXS5hcHBseShzdHJlYW0sYXJndW1lbnRzKX19KGkpfX1mb3IodmFyIG49MDtuPGtQcm94eUV2ZW50cy5sZW5ndGg7bisrKXtzdHJlYW0ub24oa1Byb3h5RXZlbnRzW25dLHRoaXMuZW1pdC5iaW5kKHRoaXMsa1Byb3h5RXZlbnRzW25dKSl9dGhpcy5fcmVhZD1mdW5jdGlvbihuKXtkZWJ1Zygid3JhcHBlZCBfcmVhZCIsbik7aWYocGF1c2VkKXtwYXVzZWQ9ZmFsc2U7c3RyZWFtLnJlc3VtZSgpfX07cmV0dXJuIHRoaXN9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZS5wcm90b3R5cGUsInJlYWRhYmxlSGlnaFdhdGVyTWFyayIse2VudW1lcmFibGU6ZmFsc2UsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuaGlnaFdhdGVyTWFya319KTtSZWFkYWJsZS5fZnJvbUxpc3Q9ZnJvbUxpc3Q7ZnVuY3Rpb24gZnJvbUxpc3QobixzdGF0ZSl7aWYoc3RhdGUubGVuZ3RoPT09MClyZXR1cm4gbnVsbDt2YXIgcmV0O2lmKHN0YXRlLm9iamVjdE1vZGUpcmV0PXN0YXRlLmJ1ZmZlci5zaGlmdCgpO2Vsc2UgaWYoIW58fG4+PXN0YXRlLmxlbmd0aCl7aWYoc3RhdGUuZGVjb2RlcilyZXQ9c3RhdGUuYnVmZmVyLmpvaW4oIiIpO2Vsc2UgaWYoc3RhdGUuYnVmZmVyLmxlbmd0aD09PTEpcmV0PXN0YXRlLmJ1ZmZlci5oZWFkLmRhdGE7ZWxzZSByZXQ9c3RhdGUuYnVmZmVyLmNvbmNhdChzdGF0ZS5sZW5ndGgpO3N0YXRlLmJ1ZmZlci5jbGVhcigpfWVsc2V7cmV0PWZyb21MaXN0UGFydGlhbChuLHN0YXRlLmJ1ZmZlcixzdGF0ZS5kZWNvZGVyKX1yZXR1cm4gcmV0fWZ1bmN0aW9uIGZyb21MaXN0UGFydGlhbChuLGxpc3QsaGFzU3RyaW5ncyl7dmFyIHJldDtpZihuPGxpc3QuaGVhZC5kYXRhLmxlbmd0aCl7cmV0PWxpc3QuaGVhZC5kYXRhLnNsaWNlKDAsbik7bGlzdC5oZWFkLmRhdGE9bGlzdC5oZWFkLmRhdGEuc2xpY2Uobil9ZWxzZSBpZihuPT09bGlzdC5oZWFkLmRhdGEubGVuZ3RoKXtyZXQ9bGlzdC5zaGlmdCgpfWVsc2V7cmV0PWhhc1N0cmluZ3M/Y29weUZyb21CdWZmZXJTdHJpbmcobixsaXN0KTpjb3B5RnJvbUJ1ZmZlcihuLGxpc3QpfXJldHVybiByZXR9ZnVuY3Rpb24gY29weUZyb21CdWZmZXJTdHJpbmcobixsaXN0KXt2YXIgcD1saXN0LmhlYWQ7dmFyIGM9MTt2YXIgcmV0PXAuZGF0YTtuLT1yZXQubGVuZ3RoO3doaWxlKHA9cC5uZXh0KXt2YXIgc3RyPXAuZGF0YTt2YXIgbmI9bj5zdHIubGVuZ3RoP3N0ci5sZW5ndGg6bjtpZihuYj09PXN0ci5sZW5ndGgpcmV0Kz1zdHI7ZWxzZSByZXQrPXN0ci5zbGljZSgwLG4pO24tPW5iO2lmKG49PT0wKXtpZihuYj09PXN0ci5sZW5ndGgpeysrYztpZihwLm5leHQpbGlzdC5oZWFkPXAubmV4dDtlbHNlIGxpc3QuaGVhZD1saXN0LnRhaWw9bnVsbH1lbHNle2xpc3QuaGVhZD1wO3AuZGF0YT1zdHIuc2xpY2UobmIpfWJyZWFrfSsrY31saXN0Lmxlbmd0aC09YztyZXR1cm4gcmV0fWZ1bmN0aW9uIGNvcHlGcm9tQnVmZmVyKG4sbGlzdCl7dmFyIHJldD1CdWZmZXIuYWxsb2NVbnNhZmUobik7dmFyIHA9bGlzdC5oZWFkO3ZhciBjPTE7cC5kYXRhLmNvcHkocmV0KTtuLT1wLmRhdGEubGVuZ3RoO3doaWxlKHA9cC5uZXh0KXt2YXIgYnVmPXAuZGF0YTt2YXIgbmI9bj5idWYubGVuZ3RoP2J1Zi5sZW5ndGg6bjtidWYuY29weShyZXQscmV0Lmxlbmd0aC1uLDAsbmIpO24tPW5iO2lmKG49PT0wKXtpZihuYj09PWJ1Zi5sZW5ndGgpeysrYztpZihwLm5leHQpbGlzdC5oZWFkPXAubmV4dDtlbHNlIGxpc3QuaGVhZD1saXN0LnRhaWw9bnVsbH1lbHNle2xpc3QuaGVhZD1wO3AuZGF0YT1idWYuc2xpY2UobmIpfWJyZWFrfSsrY31saXN0Lmxlbmd0aC09YztyZXR1cm4gcmV0fWZ1bmN0aW9uIGVuZFJlYWRhYmxlKHN0cmVhbSl7dmFyIHN0YXRlPXN0cmVhbS5fcmVhZGFibGVTdGF0ZTtpZihzdGF0ZS5sZW5ndGg+MCl0aHJvdyBuZXcgRXJyb3IoJyJlbmRSZWFkYWJsZSgpIiBjYWxsZWQgb24gbm9uLWVtcHR5IHN0cmVhbScpO2lmKCFzdGF0ZS5lbmRFbWl0dGVkKXtzdGF0ZS5lbmRlZD10cnVlO3BuYS5uZXh0VGljayhlbmRSZWFkYWJsZU5ULHN0YXRlLHN0cmVhbSl9fWZ1bmN0aW9uIGVuZFJlYWRhYmxlTlQoc3RhdGUsc3RyZWFtKXtpZighc3RhdGUuZW5kRW1pdHRlZCYmc3RhdGUubGVuZ3RoPT09MCl7c3RhdGUuZW5kRW1pdHRlZD10cnVlO3N0cmVhbS5yZWFkYWJsZT1mYWxzZTtzdHJlYW0uZW1pdCgiZW5kIil9fWZ1bmN0aW9uIGluZGV4T2YoeHMseCl7Zm9yKHZhciBpPTAsbD14cy5sZW5ndGg7aTxsO2krKyl7aWYoeHNbaV09PT14KXJldHVybiBpfXJldHVybi0xfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJfcHJvY2VzcyIpLHR5cGVvZiBnbG9iYWwhPT0idW5kZWZpbmVkIj9nbG9iYWw6dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIj9zZWxmOnR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkIj93aW5kb3c6e30pfSx7Ii4vX3N0cmVhbV9kdXBsZXgiOjY4LCIuL2ludGVybmFsL3N0cmVhbXMvQnVmZmVyTGlzdCI6NzMsIi4vaW50ZXJuYWwvc3RyZWFtcy9kZXN0cm95Ijo3NCwiLi9pbnRlcm5hbC9zdHJlYW1zL3N0cmVhbSI6NzUsX3Byb2Nlc3M6NjYsImNvcmUtdXRpbC1pcyI6MzAsZXZlbnRzOjMzLGluaGVyaXRzOjM2LGlzYXJyYXk6MzgsInByb2Nlc3MtbmV4dGljay1hcmdzIjo2NSwic2FmZS1idWZmZXIiOjc2LCJzdHJpbmdfZGVjb2Rlci8iOjEwMix1dGlsOjI2fV0sNzE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijttb2R1bGUuZXhwb3J0cz1UcmFuc2Zvcm07dmFyIER1cGxleD1yZXF1aXJlKCIuL19zdHJlYW1fZHVwbGV4Iik7dmFyIHV0aWw9cmVxdWlyZSgiY29yZS11dGlsLWlzIik7dXRpbC5pbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3V0aWwuaW5oZXJpdHMoVHJhbnNmb3JtLER1cGxleCk7ZnVuY3Rpb24gYWZ0ZXJUcmFuc2Zvcm0oZXIsZGF0YSl7dmFyIHRzPXRoaXMuX3RyYW5zZm9ybVN0YXRlO3RzLnRyYW5zZm9ybWluZz1mYWxzZTt2YXIgY2I9dHMud3JpdGVjYjtpZighY2Ipe3JldHVybiB0aGlzLmVtaXQoImVycm9yIixuZXcgRXJyb3IoIndyaXRlIGNhbGxiYWNrIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyIpKX10cy53cml0ZWNodW5rPW51bGw7dHMud3JpdGVjYj1udWxsO2lmKGRhdGEhPW51bGwpdGhpcy5wdXNoKGRhdGEpO2NiKGVyKTt2YXIgcnM9dGhpcy5fcmVhZGFibGVTdGF0ZTtycy5yZWFkaW5nPWZhbHNlO2lmKHJzLm5lZWRSZWFkYWJsZXx8cnMubGVuZ3RoPHJzLmhpZ2hXYXRlck1hcmspe3RoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayl9fWZ1bmN0aW9uIFRyYW5zZm9ybShvcHRpb25zKXtpZighKHRoaXMgaW5zdGFuY2VvZiBUcmFuc2Zvcm0pKXJldHVybiBuZXcgVHJhbnNmb3JtKG9wdGlvbnMpO0R1cGxleC5jYWxsKHRoaXMsb3B0aW9ucyk7dGhpcy5fdHJhbnNmb3JtU3RhdGU9e2FmdGVyVHJhbnNmb3JtOmFmdGVyVHJhbnNmb3JtLmJpbmQodGhpcyksbmVlZFRyYW5zZm9ybTpmYWxzZSx0cmFuc2Zvcm1pbmc6ZmFsc2Usd3JpdGVjYjpudWxsLHdyaXRlY2h1bms6bnVsbCx3cml0ZWVuY29kaW5nOm51bGx9O3RoaXMuX3JlYWRhYmxlU3RhdGUubmVlZFJlYWRhYmxlPXRydWU7dGhpcy5fcmVhZGFibGVTdGF0ZS5zeW5jPWZhbHNlO2lmKG9wdGlvbnMpe2lmKHR5cGVvZiBvcHRpb25zLnRyYW5zZm9ybT09PSJmdW5jdGlvbiIpdGhpcy5fdHJhbnNmb3JtPW9wdGlvbnMudHJhbnNmb3JtO2lmKHR5cGVvZiBvcHRpb25zLmZsdXNoPT09ImZ1bmN0aW9uIil0aGlzLl9mbHVzaD1vcHRpb25zLmZsdXNofXRoaXMub24oInByZWZpbmlzaCIscHJlZmluaXNoKX1mdW5jdGlvbiBwcmVmaW5pc2goKXt2YXIgX3RoaXM9dGhpcztpZih0eXBlb2YgdGhpcy5fZmx1c2g9PT0iZnVuY3Rpb24iKXt0aGlzLl9mbHVzaChmdW5jdGlvbihlcixkYXRhKXtkb25lKF90aGlzLGVyLGRhdGEpfSl9ZWxzZXtkb25lKHRoaXMsbnVsbCxudWxsKX19VHJhbnNmb3JtLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nKXt0aGlzLl90cmFuc2Zvcm1TdGF0ZS5uZWVkVHJhbnNmb3JtPWZhbHNlO3JldHVybiBEdXBsZXgucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLGNodW5rLGVuY29kaW5nKX07VHJhbnNmb3JtLnByb3RvdHlwZS5fdHJhbnNmb3JtPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXt0aHJvdyBuZXcgRXJyb3IoIl90cmFuc2Zvcm0oKSBpcyBub3QgaW1wbGVtZW50ZWQiKX07VHJhbnNmb3JtLnByb3RvdHlwZS5fd3JpdGU9ZnVuY3Rpb24oY2h1bmssZW5jb2RpbmcsY2Ipe3ZhciB0cz10aGlzLl90cmFuc2Zvcm1TdGF0ZTt0cy53cml0ZWNiPWNiO3RzLndyaXRlY2h1bms9Y2h1bms7dHMud3JpdGVlbmNvZGluZz1lbmNvZGluZztpZighdHMudHJhbnNmb3JtaW5nKXt2YXIgcnM9dGhpcy5fcmVhZGFibGVTdGF0ZTtpZih0cy5uZWVkVHJhbnNmb3JtfHxycy5uZWVkUmVhZGFibGV8fHJzLmxlbmd0aDxycy5oaWdoV2F0ZXJNYXJrKXRoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayl9fTtUcmFuc2Zvcm0ucHJvdG90eXBlLl9yZWFkPWZ1bmN0aW9uKG4pe3ZhciB0cz10aGlzLl90cmFuc2Zvcm1TdGF0ZTtpZih0cy53cml0ZWNodW5rIT09bnVsbCYmdHMud3JpdGVjYiYmIXRzLnRyYW5zZm9ybWluZyl7dHMudHJhbnNmb3JtaW5nPXRydWU7dGhpcy5fdHJhbnNmb3JtKHRzLndyaXRlY2h1bmssdHMud3JpdGVlbmNvZGluZyx0cy5hZnRlclRyYW5zZm9ybSl9ZWxzZXt0cy5uZWVkVHJhbnNmb3JtPXRydWV9fTtUcmFuc2Zvcm0ucHJvdG90eXBlLl9kZXN0cm95PWZ1bmN0aW9uKGVycixjYil7dmFyIF90aGlzMj10aGlzO0R1cGxleC5wcm90b3R5cGUuX2Rlc3Ryb3kuY2FsbCh0aGlzLGVycixmdW5jdGlvbihlcnIyKXtjYihlcnIyKTtfdGhpczIuZW1pdCgiY2xvc2UiKX0pfTtmdW5jdGlvbiBkb25lKHN0cmVhbSxlcixkYXRhKXtpZihlcilyZXR1cm4gc3RyZWFtLmVtaXQoImVycm9yIixlcik7aWYoZGF0YSE9bnVsbClzdHJlYW0ucHVzaChkYXRhKTtpZihzdHJlYW0uX3dyaXRhYmxlU3RhdGUubGVuZ3RoKXRocm93IG5ldyBFcnJvcigiQ2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHdzLmxlbmd0aCAhPSAwIik7aWYoc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZS50cmFuc2Zvcm1pbmcpdGhyb3cgbmV3IEVycm9yKCJDYWxsaW5nIHRyYW5zZm9ybSBkb25lIHdoZW4gc3RpbGwgdHJhbnNmb3JtaW5nIik7cmV0dXJuIHN0cmVhbS5wdXNoKG51bGwpfX0seyIuL19zdHJlYW1fZHVwbGV4Ijo2OCwiY29yZS11dGlsLWlzIjozMCxpbmhlcml0czozNn1dLDcyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24ocHJvY2VzcyxnbG9iYWwsc2V0SW1tZWRpYXRlKXsidXNlIHN0cmljdCI7dmFyIHBuYT1yZXF1aXJlKCJwcm9jZXNzLW5leHRpY2stYXJncyIpO21vZHVsZS5leHBvcnRzPVdyaXRhYmxlO2Z1bmN0aW9uIFdyaXRlUmVxKGNodW5rLGVuY29kaW5nLGNiKXt0aGlzLmNodW5rPWNodW5rO3RoaXMuZW5jb2Rpbmc9ZW5jb2Rpbmc7dGhpcy5jYWxsYmFjaz1jYjt0aGlzLm5leHQ9bnVsbH1mdW5jdGlvbiBDb3JrZWRSZXF1ZXN0KHN0YXRlKXt2YXIgX3RoaXM9dGhpczt0aGlzLm5leHQ9bnVsbDt0aGlzLmVudHJ5PW51bGw7dGhpcy5maW5pc2g9ZnVuY3Rpb24oKXtvbkNvcmtlZEZpbmlzaChfdGhpcyxzdGF0ZSl9fXZhciBhc3luY1dyaXRlPSFwcm9jZXNzLmJyb3dzZXImJlsidjAuMTAiLCJ2MC45LiJdLmluZGV4T2YocHJvY2Vzcy52ZXJzaW9uLnNsaWNlKDAsNSkpPi0xP3NldEltbWVkaWF0ZTpwbmEubmV4dFRpY2s7dmFyIER1cGxleDtXcml0YWJsZS5Xcml0YWJsZVN0YXRlPVdyaXRhYmxlU3RhdGU7dmFyIHV0aWw9cmVxdWlyZSgiY29yZS11dGlsLWlzIik7dXRpbC5pbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBpbnRlcm5hbFV0aWw9e2RlcHJlY2F0ZTpyZXF1aXJlKCJ1dGlsLWRlcHJlY2F0ZSIpfTt2YXIgU3RyZWFtPXJlcXVpcmUoIi4vaW50ZXJuYWwvc3RyZWFtcy9zdHJlYW0iKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBPdXJVaW50OEFycmF5PWdsb2JhbC5VaW50OEFycmF5fHxmdW5jdGlvbigpe307ZnVuY3Rpb24gX3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuayl7cmV0dXJuIEJ1ZmZlci5mcm9tKGNodW5rKX1mdW5jdGlvbiBfaXNVaW50OEFycmF5KG9iail7cmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopfHxvYmogaW5zdGFuY2VvZiBPdXJVaW50OEFycmF5fXZhciBkZXN0cm95SW1wbD1yZXF1aXJlKCIuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveSIpO3V0aWwuaW5oZXJpdHMoV3JpdGFibGUsU3RyZWFtKTtmdW5jdGlvbiBub3AoKXt9ZnVuY3Rpb24gV3JpdGFibGVTdGF0ZShvcHRpb25zLHN0cmVhbSl7RHVwbGV4PUR1cGxleHx8cmVxdWlyZSgiLi9fc3RyZWFtX2R1cGxleCIpO29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGlzRHVwbGV4PXN0cmVhbSBpbnN0YW5jZW9mIER1cGxleDt0aGlzLm9iamVjdE1vZGU9ISFvcHRpb25zLm9iamVjdE1vZGU7aWYoaXNEdXBsZXgpdGhpcy5vYmplY3RNb2RlPXRoaXMub2JqZWN0TW9kZXx8ISFvcHRpb25zLndyaXRhYmxlT2JqZWN0TW9kZTt2YXIgaHdtPW9wdGlvbnMuaGlnaFdhdGVyTWFyazt2YXIgd3JpdGFibGVId209b3B0aW9ucy53cml0YWJsZUhpZ2hXYXRlck1hcms7dmFyIGRlZmF1bHRId209dGhpcy5vYmplY3RNb2RlPzE2OjE2KjEwMjQ7aWYoaHdtfHxod209PT0wKXRoaXMuaGlnaFdhdGVyTWFyaz1od207ZWxzZSBpZihpc0R1cGxleCYmKHdyaXRhYmxlSHdtfHx3cml0YWJsZUh3bT09PTApKXRoaXMuaGlnaFdhdGVyTWFyaz13cml0YWJsZUh3bTtlbHNlIHRoaXMuaGlnaFdhdGVyTWFyaz1kZWZhdWx0SHdtO3RoaXMuaGlnaFdhdGVyTWFyaz1NYXRoLmZsb29yKHRoaXMuaGlnaFdhdGVyTWFyayk7dGhpcy5maW5hbENhbGxlZD1mYWxzZTt0aGlzLm5lZWREcmFpbj1mYWxzZTt0aGlzLmVuZGluZz1mYWxzZTt0aGlzLmVuZGVkPWZhbHNlO3RoaXMuZmluaXNoZWQ9ZmFsc2U7dGhpcy5kZXN0cm95ZWQ9ZmFsc2U7dmFyIG5vRGVjb2RlPW9wdGlvbnMuZGVjb2RlU3RyaW5ncz09PWZhbHNlO3RoaXMuZGVjb2RlU3RyaW5ncz0hbm9EZWNvZGU7dGhpcy5kZWZhdWx0RW5jb2Rpbmc9b3B0aW9ucy5kZWZhdWx0RW5jb2Rpbmd8fCJ1dGY4Ijt0aGlzLmxlbmd0aD0wO3RoaXMud3JpdGluZz1mYWxzZTt0aGlzLmNvcmtlZD0wO3RoaXMuc3luYz10cnVlO3RoaXMuYnVmZmVyUHJvY2Vzc2luZz1mYWxzZTt0aGlzLm9ud3JpdGU9ZnVuY3Rpb24oZXIpe29ud3JpdGUoc3RyZWFtLGVyKX07dGhpcy53cml0ZWNiPW51bGw7dGhpcy53cml0ZWxlbj0wO3RoaXMuYnVmZmVyZWRSZXF1ZXN0PW51bGw7dGhpcy5sYXN0QnVmZmVyZWRSZXF1ZXN0PW51bGw7dGhpcy5wZW5kaW5nY2I9MDt0aGlzLnByZWZpbmlzaGVkPWZhbHNlO3RoaXMuZXJyb3JFbWl0dGVkPWZhbHNlO3RoaXMuYnVmZmVyZWRSZXF1ZXN0Q291bnQ9MDt0aGlzLmNvcmtlZFJlcXVlc3RzRnJlZT1uZXcgQ29ya2VkUmVxdWVzdCh0aGlzKX1Xcml0YWJsZVN0YXRlLnByb3RvdHlwZS5nZXRCdWZmZXI9ZnVuY3Rpb24gZ2V0QnVmZmVyKCl7dmFyIGN1cnJlbnQ9dGhpcy5idWZmZXJlZFJlcXVlc3Q7dmFyIG91dD1bXTt3aGlsZShjdXJyZW50KXtvdXQucHVzaChjdXJyZW50KTtjdXJyZW50PWN1cnJlbnQubmV4dH1yZXR1cm4gb3V0fTsoZnVuY3Rpb24oKXt0cnl7T2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlU3RhdGUucHJvdG90eXBlLCJidWZmZXIiLHtnZXQ6aW50ZXJuYWxVdGlsLmRlcHJlY2F0ZShmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEJ1ZmZlcigpfSwiX3dyaXRhYmxlU3RhdGUuYnVmZmVyIGlzIGRlcHJlY2F0ZWQuIFVzZSBfd3JpdGFibGVTdGF0ZS5nZXRCdWZmZXIgIisiaW5zdGVhZC4iLCJERVAwMDAzIil9KX1jYXRjaChfKXt9fSkoKTt2YXIgcmVhbEhhc0luc3RhbmNlO2lmKHR5cGVvZiBTeW1ib2w9PT0iZnVuY3Rpb24iJiZTeW1ib2wuaGFzSW5zdGFuY2UmJnR5cGVvZiBGdW5jdGlvbi5wcm90b3R5cGVbU3ltYm9sLmhhc0luc3RhbmNlXT09PSJmdW5jdGlvbiIpe3JlYWxIYXNJbnN0YW5jZT1GdW5jdGlvbi5wcm90b3R5cGVbU3ltYm9sLmhhc0luc3RhbmNlXTtPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGFibGUsU3ltYm9sLmhhc0luc3RhbmNlLHt2YWx1ZTpmdW5jdGlvbihvYmplY3Qpe2lmKHJlYWxIYXNJbnN0YW5jZS5jYWxsKHRoaXMsb2JqZWN0KSlyZXR1cm4gdHJ1ZTtpZih0aGlzIT09V3JpdGFibGUpcmV0dXJuIGZhbHNlO3JldHVybiBvYmplY3QmJm9iamVjdC5fd3JpdGFibGVTdGF0ZSBpbnN0YW5jZW9mIFdyaXRhYmxlU3RhdGV9fSl9ZWxzZXtyZWFsSGFzSW5zdGFuY2U9ZnVuY3Rpb24ob2JqZWN0KXtyZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgdGhpc319ZnVuY3Rpb24gV3JpdGFibGUob3B0aW9ucyl7RHVwbGV4PUR1cGxleHx8cmVxdWlyZSgiLi9fc3RyZWFtX2R1cGxleCIpO2lmKCFyZWFsSGFzSW5zdGFuY2UuY2FsbChXcml0YWJsZSx0aGlzKSYmISh0aGlzIGluc3RhbmNlb2YgRHVwbGV4KSl7cmV0dXJuIG5ldyBXcml0YWJsZShvcHRpb25zKX10aGlzLl93cml0YWJsZVN0YXRlPW5ldyBXcml0YWJsZVN0YXRlKG9wdGlvbnMsdGhpcyk7dGhpcy53cml0YWJsZT10cnVlO2lmKG9wdGlvbnMpe2lmKHR5cGVvZiBvcHRpb25zLndyaXRlPT09ImZ1bmN0aW9uIil0aGlzLl93cml0ZT1vcHRpb25zLndyaXRlO2lmKHR5cGVvZiBvcHRpb25zLndyaXRldj09PSJmdW5jdGlvbiIpdGhpcy5fd3JpdGV2PW9wdGlvbnMud3JpdGV2O2lmKHR5cGVvZiBvcHRpb25zLmRlc3Ryb3k9PT0iZnVuY3Rpb24iKXRoaXMuX2Rlc3Ryb3k9b3B0aW9ucy5kZXN0cm95O2lmKHR5cGVvZiBvcHRpb25zLmZpbmFsPT09ImZ1bmN0aW9uIil0aGlzLl9maW5hbD1vcHRpb25zLmZpbmFsfVN0cmVhbS5jYWxsKHRoaXMpfVdyaXRhYmxlLnByb3RvdHlwZS5waXBlPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KCJlcnJvciIsbmV3IEVycm9yKCJDYW5ub3QgcGlwZSwgbm90IHJlYWRhYmxlIikpfTtmdW5jdGlvbiB3cml0ZUFmdGVyRW5kKHN0cmVhbSxjYil7dmFyIGVyPW5ldyBFcnJvcigid3JpdGUgYWZ0ZXIgZW5kIik7c3RyZWFtLmVtaXQoImVycm9yIixlcik7cG5hLm5leHRUaWNrKGNiLGVyKX1mdW5jdGlvbiB2YWxpZENodW5rKHN0cmVhbSxzdGF0ZSxjaHVuayxjYil7dmFyIHZhbGlkPXRydWU7dmFyIGVyPWZhbHNlO2lmKGNodW5rPT09bnVsbCl7ZXI9bmV3IFR5cGVFcnJvcigiTWF5IG5vdCB3cml0ZSBudWxsIHZhbHVlcyB0byBzdHJlYW0iKX1lbHNlIGlmKHR5cGVvZiBjaHVuayE9PSJzdHJpbmciJiZjaHVuayE9PXVuZGVmaW5lZCYmIXN0YXRlLm9iamVjdE1vZGUpe2VyPW5ldyBUeXBlRXJyb3IoIkludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsiKX1pZihlcil7c3RyZWFtLmVtaXQoImVycm9yIixlcik7cG5hLm5leHRUaWNrKGNiLGVyKTt2YWxpZD1mYWxzZX1yZXR1cm4gdmFsaWR9V3JpdGFibGUucHJvdG90eXBlLndyaXRlPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXt2YXIgc3RhdGU9dGhpcy5fd3JpdGFibGVTdGF0ZTt2YXIgcmV0PWZhbHNlO3ZhciBpc0J1Zj0hc3RhdGUub2JqZWN0TW9kZSYmX2lzVWludDhBcnJheShjaHVuayk7aWYoaXNCdWYmJiFCdWZmZXIuaXNCdWZmZXIoY2h1bmspKXtjaHVuaz1fdWludDhBcnJheVRvQnVmZmVyKGNodW5rKX1pZih0eXBlb2YgZW5jb2Rpbmc9PT0iZnVuY3Rpb24iKXtjYj1lbmNvZGluZztlbmNvZGluZz1udWxsfWlmKGlzQnVmKWVuY29kaW5nPSJidWZmZXIiO2Vsc2UgaWYoIWVuY29kaW5nKWVuY29kaW5nPXN0YXRlLmRlZmF1bHRFbmNvZGluZztpZih0eXBlb2YgY2IhPT0iZnVuY3Rpb24iKWNiPW5vcDtpZihzdGF0ZS5lbmRlZCl3cml0ZUFmdGVyRW5kKHRoaXMsY2IpO2Vsc2UgaWYoaXNCdWZ8fHZhbGlkQ2h1bmsodGhpcyxzdGF0ZSxjaHVuayxjYikpe3N0YXRlLnBlbmRpbmdjYisrO3JldD13cml0ZU9yQnVmZmVyKHRoaXMsc3RhdGUsaXNCdWYsY2h1bmssZW5jb2RpbmcsY2IpfXJldHVybiByZXR9O1dyaXRhYmxlLnByb3RvdHlwZS5jb3JrPWZ1bmN0aW9uKCl7dmFyIHN0YXRlPXRoaXMuX3dyaXRhYmxlU3RhdGU7c3RhdGUuY29ya2VkKyt9O1dyaXRhYmxlLnByb3RvdHlwZS51bmNvcms9ZnVuY3Rpb24oKXt2YXIgc3RhdGU9dGhpcy5fd3JpdGFibGVTdGF0ZTtpZihzdGF0ZS5jb3JrZWQpe3N0YXRlLmNvcmtlZC0tO2lmKCFzdGF0ZS53cml0aW5nJiYhc3RhdGUuY29ya2VkJiYhc3RhdGUuZmluaXNoZWQmJiFzdGF0ZS5idWZmZXJQcm9jZXNzaW5nJiZzdGF0ZS5idWZmZXJlZFJlcXVlc3QpY2xlYXJCdWZmZXIodGhpcyxzdGF0ZSl9fTtXcml0YWJsZS5wcm90b3R5cGUuc2V0RGVmYXVsdEVuY29kaW5nPWZ1bmN0aW9uIHNldERlZmF1bHRFbmNvZGluZyhlbmNvZGluZyl7aWYodHlwZW9mIGVuY29kaW5nPT09InN0cmluZyIpZW5jb2Rpbmc9ZW5jb2RpbmcudG9Mb3dlckNhc2UoKTtpZighKFsiaGV4IiwidXRmOCIsInV0Zi04IiwiYXNjaWkiLCJiaW5hcnkiLCJiYXNlNjQiLCJ1Y3MyIiwidWNzLTIiLCJ1dGYxNmxlIiwidXRmLTE2bGUiLCJyYXciXS5pbmRleE9mKChlbmNvZGluZysiIikudG9Mb3dlckNhc2UoKSk+LTEpKXRocm93IG5ldyBUeXBlRXJyb3IoIlVua25vd24gZW5jb2Rpbmc6ICIrZW5jb2RpbmcpO3RoaXMuX3dyaXRhYmxlU3RhdGUuZGVmYXVsdEVuY29kaW5nPWVuY29kaW5nO3JldHVybiB0aGlzfTtmdW5jdGlvbiBkZWNvZGVDaHVuayhzdGF0ZSxjaHVuayxlbmNvZGluZyl7aWYoIXN0YXRlLm9iamVjdE1vZGUmJnN0YXRlLmRlY29kZVN0cmluZ3MhPT1mYWxzZSYmdHlwZW9mIGNodW5rPT09InN0cmluZyIpe2NodW5rPUJ1ZmZlci5mcm9tKGNodW5rLGVuY29kaW5nKX1yZXR1cm4gY2h1bmt9T2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwid3JpdGFibGVIaWdoV2F0ZXJNYXJrIix7ZW51bWVyYWJsZTpmYWxzZSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZS5oaWdoV2F0ZXJNYXJrfX0pO2Z1bmN0aW9uIHdyaXRlT3JCdWZmZXIoc3RyZWFtLHN0YXRlLGlzQnVmLGNodW5rLGVuY29kaW5nLGNiKXtpZighaXNCdWYpe3ZhciBuZXdDaHVuaz1kZWNvZGVDaHVuayhzdGF0ZSxjaHVuayxlbmNvZGluZyk7aWYoY2h1bmshPT1uZXdDaHVuayl7aXNCdWY9dHJ1ZTtlbmNvZGluZz0iYnVmZmVyIjtjaHVuaz1uZXdDaHVua319dmFyIGxlbj1zdGF0ZS5vYmplY3RNb2RlPzE6Y2h1bmsubGVuZ3RoO3N0YXRlLmxlbmd0aCs9bGVuO3ZhciByZXQ9c3RhdGUubGVuZ3RoPHN0YXRlLmhpZ2hXYXRlck1hcms7aWYoIXJldClzdGF0ZS5uZWVkRHJhaW49dHJ1ZTtpZihzdGF0ZS53cml0aW5nfHxzdGF0ZS5jb3JrZWQpe3ZhciBsYXN0PXN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q7c3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdD17Y2h1bms6Y2h1bmssZW5jb2Rpbmc6ZW5jb2RpbmcsaXNCdWY6aXNCdWYsY2FsbGJhY2s6Y2IsbmV4dDpudWxsfTtpZihsYXN0KXtsYXN0Lm5leHQ9c3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdH1lbHNle3N0YXRlLmJ1ZmZlcmVkUmVxdWVzdD1zdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0fXN0YXRlLmJ1ZmZlcmVkUmVxdWVzdENvdW50Kz0xfWVsc2V7ZG9Xcml0ZShzdHJlYW0sc3RhdGUsZmFsc2UsbGVuLGNodW5rLGVuY29kaW5nLGNiKX1yZXR1cm4gcmV0fWZ1bmN0aW9uIGRvV3JpdGUoc3RyZWFtLHN0YXRlLHdyaXRldixsZW4sY2h1bmssZW5jb2RpbmcsY2Ipe3N0YXRlLndyaXRlbGVuPWxlbjtzdGF0ZS53cml0ZWNiPWNiO3N0YXRlLndyaXRpbmc9dHJ1ZTtzdGF0ZS5zeW5jPXRydWU7aWYod3JpdGV2KXN0cmVhbS5fd3JpdGV2KGNodW5rLHN0YXRlLm9ud3JpdGUpO2Vsc2Ugc3RyZWFtLl93cml0ZShjaHVuayxlbmNvZGluZyxzdGF0ZS5vbndyaXRlKTtzdGF0ZS5zeW5jPWZhbHNlfWZ1bmN0aW9uIG9ud3JpdGVFcnJvcihzdHJlYW0sc3RhdGUsc3luYyxlcixjYil7LS1zdGF0ZS5wZW5kaW5nY2I7aWYoc3luYyl7cG5hLm5leHRUaWNrKGNiLGVyKTtwbmEubmV4dFRpY2soZmluaXNoTWF5YmUsc3RyZWFtLHN0YXRlKTtzdHJlYW0uX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkPXRydWU7c3RyZWFtLmVtaXQoImVycm9yIixlcil9ZWxzZXtjYihlcik7c3RyZWFtLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZD10cnVlO3N0cmVhbS5lbWl0KCJlcnJvciIsZXIpO2ZpbmlzaE1heWJlKHN0cmVhbSxzdGF0ZSl9fWZ1bmN0aW9uIG9ud3JpdGVTdGF0ZVVwZGF0ZShzdGF0ZSl7c3RhdGUud3JpdGluZz1mYWxzZTtzdGF0ZS53cml0ZWNiPW51bGw7c3RhdGUubGVuZ3RoLT1zdGF0ZS53cml0ZWxlbjtzdGF0ZS53cml0ZWxlbj0wfWZ1bmN0aW9uIG9ud3JpdGUoc3RyZWFtLGVyKXt2YXIgc3RhdGU9c3RyZWFtLl93cml0YWJsZVN0YXRlO3ZhciBzeW5jPXN0YXRlLnN5bmM7dmFyIGNiPXN0YXRlLndyaXRlY2I7b253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKTtpZihlcilvbndyaXRlRXJyb3Ioc3RyZWFtLHN0YXRlLHN5bmMsZXIsY2IpO2Vsc2V7dmFyIGZpbmlzaGVkPW5lZWRGaW5pc2goc3RhdGUpO2lmKCFmaW5pc2hlZCYmIXN0YXRlLmNvcmtlZCYmIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcmJnN0YXRlLmJ1ZmZlcmVkUmVxdWVzdCl7Y2xlYXJCdWZmZXIoc3RyZWFtLHN0YXRlKX1pZihzeW5jKXthc3luY1dyaXRlKGFmdGVyV3JpdGUsc3RyZWFtLHN0YXRlLGZpbmlzaGVkLGNiKX1lbHNle2FmdGVyV3JpdGUoc3RyZWFtLHN0YXRlLGZpbmlzaGVkLGNiKX19fWZ1bmN0aW9uIGFmdGVyV3JpdGUoc3RyZWFtLHN0YXRlLGZpbmlzaGVkLGNiKXtpZighZmluaXNoZWQpb253cml0ZURyYWluKHN0cmVhbSxzdGF0ZSk7c3RhdGUucGVuZGluZ2NiLS07Y2IoKTtmaW5pc2hNYXliZShzdHJlYW0sc3RhdGUpfWZ1bmN0aW9uIG9ud3JpdGVEcmFpbihzdHJlYW0sc3RhdGUpe2lmKHN0YXRlLmxlbmd0aD09PTAmJnN0YXRlLm5lZWREcmFpbil7c3RhdGUubmVlZERyYWluPWZhbHNlO3N0cmVhbS5lbWl0KCJkcmFpbiIpfX1mdW5jdGlvbiBjbGVhckJ1ZmZlcihzdHJlYW0sc3RhdGUpe3N0YXRlLmJ1ZmZlclByb2Nlc3Npbmc9dHJ1ZTt2YXIgZW50cnk9c3RhdGUuYnVmZmVyZWRSZXF1ZXN0O2lmKHN0cmVhbS5fd3JpdGV2JiZlbnRyeSYmZW50cnkubmV4dCl7dmFyIGw9c3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQ7dmFyIGJ1ZmZlcj1uZXcgQXJyYXkobCk7dmFyIGhvbGRlcj1zdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWU7aG9sZGVyLmVudHJ5PWVudHJ5O3ZhciBjb3VudD0wO3ZhciBhbGxCdWZmZXJzPXRydWU7d2hpbGUoZW50cnkpe2J1ZmZlcltjb3VudF09ZW50cnk7aWYoIWVudHJ5LmlzQnVmKWFsbEJ1ZmZlcnM9ZmFsc2U7ZW50cnk9ZW50cnkubmV4dDtjb3VudCs9MX1idWZmZXIuYWxsQnVmZmVycz1hbGxCdWZmZXJzO2RvV3JpdGUoc3RyZWFtLHN0YXRlLHRydWUsc3RhdGUubGVuZ3RoLGJ1ZmZlciwiIixob2xkZXIuZmluaXNoKTtzdGF0ZS5wZW5kaW5nY2IrKztzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0PW51bGw7aWYoaG9sZGVyLm5leHQpe3N0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZT1ob2xkZXIubmV4dDtob2xkZXIubmV4dD1udWxsfWVsc2V7c3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlPW5ldyBDb3JrZWRSZXF1ZXN0KHN0YXRlKX1zdGF0ZS5idWZmZXJlZFJlcXVlc3RDb3VudD0wfWVsc2V7d2hpbGUoZW50cnkpe3ZhciBjaHVuaz1lbnRyeS5jaHVuazt2YXIgZW5jb2Rpbmc9ZW50cnkuZW5jb2Rpbmc7dmFyIGNiPWVudHJ5LmNhbGxiYWNrO3ZhciBsZW49c3RhdGUub2JqZWN0TW9kZT8xOmNodW5rLmxlbmd0aDtkb1dyaXRlKHN0cmVhbSxzdGF0ZSxmYWxzZSxsZW4sY2h1bmssZW5jb2RpbmcsY2IpO2VudHJ5PWVudHJ5Lm5leHQ7c3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQtLTtpZihzdGF0ZS53cml0aW5nKXticmVha319aWYoZW50cnk9PT1udWxsKXN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q9bnVsbH1zdGF0ZS5idWZmZXJlZFJlcXVlc3Q9ZW50cnk7c3RhdGUuYnVmZmVyUHJvY2Vzc2luZz1mYWxzZX1Xcml0YWJsZS5wcm90b3R5cGUuX3dyaXRlPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXtjYihuZXcgRXJyb3IoIl93cml0ZSgpIGlzIG5vdCBpbXBsZW1lbnRlZCIpKX07V3JpdGFibGUucHJvdG90eXBlLl93cml0ZXY9bnVsbDtXcml0YWJsZS5wcm90b3R5cGUuZW5kPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXt2YXIgc3RhdGU9dGhpcy5fd3JpdGFibGVTdGF0ZTtpZih0eXBlb2YgY2h1bms9PT0iZnVuY3Rpb24iKXtjYj1jaHVuaztjaHVuaz1udWxsO2VuY29kaW5nPW51bGx9ZWxzZSBpZih0eXBlb2YgZW5jb2Rpbmc9PT0iZnVuY3Rpb24iKXtjYj1lbmNvZGluZztlbmNvZGluZz1udWxsfWlmKGNodW5rIT09bnVsbCYmY2h1bmshPT11bmRlZmluZWQpdGhpcy53cml0ZShjaHVuayxlbmNvZGluZyk7aWYoc3RhdGUuY29ya2VkKXtzdGF0ZS5jb3JrZWQ9MTt0aGlzLnVuY29yaygpfWlmKCFzdGF0ZS5lbmRpbmcmJiFzdGF0ZS5maW5pc2hlZCllbmRXcml0YWJsZSh0aGlzLHN0YXRlLGNiKX07ZnVuY3Rpb24gbmVlZEZpbmlzaChzdGF0ZSl7cmV0dXJuIHN0YXRlLmVuZGluZyYmc3RhdGUubGVuZ3RoPT09MCYmc3RhdGUuYnVmZmVyZWRSZXF1ZXN0PT09bnVsbCYmIXN0YXRlLmZpbmlzaGVkJiYhc3RhdGUud3JpdGluZ31mdW5jdGlvbiBjYWxsRmluYWwoc3RyZWFtLHN0YXRlKXtzdHJlYW0uX2ZpbmFsKGZ1bmN0aW9uKGVycil7c3RhdGUucGVuZGluZ2NiLS07aWYoZXJyKXtzdHJlYW0uZW1pdCgiZXJyb3IiLGVycil9c3RhdGUucHJlZmluaXNoZWQ9dHJ1ZTtzdHJlYW0uZW1pdCgicHJlZmluaXNoIik7ZmluaXNoTWF5YmUoc3RyZWFtLHN0YXRlKX0pfWZ1bmN0aW9uIHByZWZpbmlzaChzdHJlYW0sc3RhdGUpe2lmKCFzdGF0ZS5wcmVmaW5pc2hlZCYmIXN0YXRlLmZpbmFsQ2FsbGVkKXtpZih0eXBlb2Ygc3RyZWFtLl9maW5hbD09PSJmdW5jdGlvbiIpe3N0YXRlLnBlbmRpbmdjYisrO3N0YXRlLmZpbmFsQ2FsbGVkPXRydWU7cG5hLm5leHRUaWNrKGNhbGxGaW5hbCxzdHJlYW0sc3RhdGUpfWVsc2V7c3RhdGUucHJlZmluaXNoZWQ9dHJ1ZTtzdHJlYW0uZW1pdCgicHJlZmluaXNoIil9fX1mdW5jdGlvbiBmaW5pc2hNYXliZShzdHJlYW0sc3RhdGUpe3ZhciBuZWVkPW5lZWRGaW5pc2goc3RhdGUpO2lmKG5lZWQpe3ByZWZpbmlzaChzdHJlYW0sc3RhdGUpO2lmKHN0YXRlLnBlbmRpbmdjYj09PTApe3N0YXRlLmZpbmlzaGVkPXRydWU7c3RyZWFtLmVtaXQoImZpbmlzaCIpfX1yZXR1cm4gbmVlZH1mdW5jdGlvbiBlbmRXcml0YWJsZShzdHJlYW0sc3RhdGUsY2Ipe3N0YXRlLmVuZGluZz10cnVlO2ZpbmlzaE1heWJlKHN0cmVhbSxzdGF0ZSk7aWYoY2Ipe2lmKHN0YXRlLmZpbmlzaGVkKXBuYS5uZXh0VGljayhjYik7ZWxzZSBzdHJlYW0ub25jZSgiZmluaXNoIixjYil9c3RhdGUuZW5kZWQ9dHJ1ZTtzdHJlYW0ud3JpdGFibGU9ZmFsc2V9ZnVuY3Rpb24gb25Db3JrZWRGaW5pc2goY29ya1JlcSxzdGF0ZSxlcnIpe3ZhciBlbnRyeT1jb3JrUmVxLmVudHJ5O2NvcmtSZXEuZW50cnk9bnVsbDt3aGlsZShlbnRyeSl7dmFyIGNiPWVudHJ5LmNhbGxiYWNrO3N0YXRlLnBlbmRpbmdjYi0tO2NiKGVycik7ZW50cnk9ZW50cnkubmV4dH1pZihzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWUpe3N0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZS5uZXh0PWNvcmtSZXF9ZWxzZXtzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWU9Y29ya1JlcX19T2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwiZGVzdHJveWVkIix7Z2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5fd3JpdGFibGVTdGF0ZT09PXVuZGVmaW5lZCl7cmV0dXJuIGZhbHNlfXJldHVybiB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZH0sc2V0OmZ1bmN0aW9uKHZhbHVlKXtpZighdGhpcy5fd3JpdGFibGVTdGF0ZSl7cmV0dXJufXRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkPXZhbHVlfX0pO1dyaXRhYmxlLnByb3RvdHlwZS5kZXN0cm95PWRlc3Ryb3lJbXBsLmRlc3Ryb3k7V3JpdGFibGUucHJvdG90eXBlLl91bmRlc3Ryb3k9ZGVzdHJveUltcGwudW5kZXN0cm95O1dyaXRhYmxlLnByb3RvdHlwZS5fZGVzdHJveT1mdW5jdGlvbihlcnIsY2Ipe3RoaXMuZW5kKCk7Y2IoZXJyKX19KS5jYWxsKHRoaXMscmVxdWlyZSgiX3Byb2Nlc3MiKSx0eXBlb2YgZ2xvYmFsIT09InVuZGVmaW5lZCI/Z2xvYmFsOnR5cGVvZiBzZWxmIT09InVuZGVmaW5lZCI/c2VsZjp0eXBlb2Ygd2luZG93IT09InVuZGVmaW5lZCI/d2luZG93Ont9LHJlcXVpcmUoInRpbWVycyIpLnNldEltbWVkaWF0ZSl9LHsiLi9fc3RyZWFtX2R1cGxleCI6NjgsIi4vaW50ZXJuYWwvc3RyZWFtcy9kZXN0cm95Ijo3NCwiLi9pbnRlcm5hbC9zdHJlYW1zL3N0cmVhbSI6NzUsX3Byb2Nlc3M6NjYsImNvcmUtdXRpbC1pcyI6MzAsaW5oZXJpdHM6MzYsInByb2Nlc3MtbmV4dGljay1hcmdzIjo2NSwic2FmZS1idWZmZXIiOjc2LHRpbWVyczoxMDQsInV0aWwtZGVwcmVjYXRlIjoxMDV9XSw3MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSxDb25zdHJ1Y3Rvcil7aWYoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSl7dGhyb3cgbmV3IFR5cGVFcnJvcigiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uIil9fXZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7dmFyIHV0aWw9cmVxdWlyZSgidXRpbCIpO2Z1bmN0aW9uIGNvcHlCdWZmZXIoc3JjLHRhcmdldCxvZmZzZXQpe3NyYy5jb3B5KHRhcmdldCxvZmZzZXQpfW1vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gQnVmZmVyTGlzdCgpe19jbGFzc0NhbGxDaGVjayh0aGlzLEJ1ZmZlckxpc3QpO3RoaXMuaGVhZD1udWxsO3RoaXMudGFpbD1udWxsO3RoaXMubGVuZ3RoPTB9QnVmZmVyTGlzdC5wcm90b3R5cGUucHVzaD1mdW5jdGlvbiBwdXNoKHYpe3ZhciBlbnRyeT17ZGF0YTp2LG5leHQ6bnVsbH07aWYodGhpcy5sZW5ndGg+MCl0aGlzLnRhaWwubmV4dD1lbnRyeTtlbHNlIHRoaXMuaGVhZD1lbnRyeTt0aGlzLnRhaWw9ZW50cnk7Kyt0aGlzLmxlbmd0aH07QnVmZmVyTGlzdC5wcm90b3R5cGUudW5zaGlmdD1mdW5jdGlvbiB1bnNoaWZ0KHYpe3ZhciBlbnRyeT17ZGF0YTp2LG5leHQ6dGhpcy5oZWFkfTtpZih0aGlzLmxlbmd0aD09PTApdGhpcy50YWlsPWVudHJ5O3RoaXMuaGVhZD1lbnRyeTsrK3RoaXMubGVuZ3RofTtCdWZmZXJMaXN0LnByb3RvdHlwZS5zaGlmdD1mdW5jdGlvbiBzaGlmdCgpe2lmKHRoaXMubGVuZ3RoPT09MClyZXR1cm47dmFyIHJldD10aGlzLmhlYWQuZGF0YTtpZih0aGlzLmxlbmd0aD09PTEpdGhpcy5oZWFkPXRoaXMudGFpbD1udWxsO2Vsc2UgdGhpcy5oZWFkPXRoaXMuaGVhZC5uZXh0Oy0tdGhpcy5sZW5ndGg7cmV0dXJuIHJldH07QnVmZmVyTGlzdC5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24gY2xlYXIoKXt0aGlzLmhlYWQ9dGhpcy50YWlsPW51bGw7dGhpcy5sZW5ndGg9MH07QnVmZmVyTGlzdC5wcm90b3R5cGUuam9pbj1mdW5jdGlvbiBqb2luKHMpe2lmKHRoaXMubGVuZ3RoPT09MClyZXR1cm4iIjt2YXIgcD10aGlzLmhlYWQ7dmFyIHJldD0iIitwLmRhdGE7d2hpbGUocD1wLm5leHQpe3JldCs9cytwLmRhdGF9cmV0dXJuIHJldH07QnVmZmVyTGlzdC5wcm90b3R5cGUuY29uY2F0PWZ1bmN0aW9uIGNvbmNhdChuKXtpZih0aGlzLmxlbmd0aD09PTApcmV0dXJuIEJ1ZmZlci5hbGxvYygwKTtpZih0aGlzLmxlbmd0aD09PTEpcmV0dXJuIHRoaXMuaGVhZC5kYXRhO3ZhciByZXQ9QnVmZmVyLmFsbG9jVW5zYWZlKG4+Pj4wKTt2YXIgcD10aGlzLmhlYWQ7dmFyIGk9MDt3aGlsZShwKXtjb3B5QnVmZmVyKHAuZGF0YSxyZXQsaSk7aSs9cC5kYXRhLmxlbmd0aDtwPXAubmV4dH1yZXR1cm4gcmV0fTtyZXR1cm4gQnVmZmVyTGlzdH0oKTtpZih1dGlsJiZ1dGlsLmluc3BlY3QmJnV0aWwuaW5zcGVjdC5jdXN0b20pe21vZHVsZS5leHBvcnRzLnByb3RvdHlwZVt1dGlsLmluc3BlY3QuY3VzdG9tXT1mdW5jdGlvbigpe3ZhciBvYmo9dXRpbC5pbnNwZWN0KHtsZW5ndGg6dGhpcy5sZW5ndGh9KTtyZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lKyIgIitvYmp9fX0seyJzYWZlLWJ1ZmZlciI6NzYsdXRpbDoyNn1dLDc0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIHBuYT1yZXF1aXJlKCJwcm9jZXNzLW5leHRpY2stYXJncyIpO2Z1bmN0aW9uIGRlc3Ryb3koZXJyLGNiKXt2YXIgX3RoaXM9dGhpczt2YXIgcmVhZGFibGVEZXN0cm95ZWQ9dGhpcy5fcmVhZGFibGVTdGF0ZSYmdGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQ7dmFyIHdyaXRhYmxlRGVzdHJveWVkPXRoaXMuX3dyaXRhYmxlU3RhdGUmJnRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkO2lmKHJlYWRhYmxlRGVzdHJveWVkfHx3cml0YWJsZURlc3Ryb3llZCl7aWYoY2Ipe2NiKGVycil9ZWxzZSBpZihlcnImJighdGhpcy5fd3JpdGFibGVTdGF0ZXx8IXRoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkKSl7cG5hLm5leHRUaWNrKGVtaXRFcnJvck5ULHRoaXMsZXJyKX1yZXR1cm4gdGhpc31pZih0aGlzLl9yZWFkYWJsZVN0YXRlKXt0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZD10cnVlfWlmKHRoaXMuX3dyaXRhYmxlU3RhdGUpe3RoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkPXRydWV9dGhpcy5fZGVzdHJveShlcnJ8fG51bGwsZnVuY3Rpb24oZXJyKXtpZighY2ImJmVycil7cG5hLm5leHRUaWNrKGVtaXRFcnJvck5ULF90aGlzLGVycik7aWYoX3RoaXMuX3dyaXRhYmxlU3RhdGUpe190aGlzLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZD10cnVlfX1lbHNlIGlmKGNiKXtjYihlcnIpfX0pO3JldHVybiB0aGlzfWZ1bmN0aW9uIHVuZGVzdHJveSgpe2lmKHRoaXMuX3JlYWRhYmxlU3RhdGUpe3RoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkPWZhbHNlO3RoaXMuX3JlYWRhYmxlU3RhdGUucmVhZGluZz1mYWxzZTt0aGlzLl9yZWFkYWJsZVN0YXRlLmVuZGVkPWZhbHNlO3RoaXMuX3JlYWRhYmxlU3RhdGUuZW5kRW1pdHRlZD1mYWxzZX1pZih0aGlzLl93cml0YWJsZVN0YXRlKXt0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZD1mYWxzZTt0aGlzLl93cml0YWJsZVN0YXRlLmVuZGVkPWZhbHNlO3RoaXMuX3dyaXRhYmxlU3RhdGUuZW5kaW5nPWZhbHNlO3RoaXMuX3dyaXRhYmxlU3RhdGUuZmluaXNoZWQ9ZmFsc2U7dGhpcy5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQ9ZmFsc2V9fWZ1bmN0aW9uIGVtaXRFcnJvck5UKHNlbGYsZXJyKXtzZWxmLmVtaXQoImVycm9yIixlcnIpfW1vZHVsZS5leHBvcnRzPXtkZXN0cm95OmRlc3Ryb3ksdW5kZXN0cm95OnVuZGVzdHJveX19LHsicHJvY2Vzcy1uZXh0aWNrLWFyZ3MiOjY1fV0sNzU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXJlcXVpcmUoImV2ZW50cyIpLkV2ZW50RW1pdHRlcn0se2V2ZW50czozM31dLDc2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgYnVmZmVyPXJlcXVpcmUoImJ1ZmZlciIpO3ZhciBCdWZmZXI9YnVmZmVyLkJ1ZmZlcjtmdW5jdGlvbiBjb3B5UHJvcHMoc3JjLGRzdCl7Zm9yKHZhciBrZXkgaW4gc3JjKXtkc3Rba2V5XT1zcmNba2V5XX19aWYoQnVmZmVyLmZyb20mJkJ1ZmZlci5hbGxvYyYmQnVmZmVyLmFsbG9jVW5zYWZlJiZCdWZmZXIuYWxsb2NVbnNhZmVTbG93KXttb2R1bGUuZXhwb3J0cz1idWZmZXJ9ZWxzZXtjb3B5UHJvcHMoYnVmZmVyLGV4cG9ydHMpO2V4cG9ydHMuQnVmZmVyPVNhZmVCdWZmZXJ9ZnVuY3Rpb24gU2FmZUJ1ZmZlcihhcmcsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpe3JldHVybiBCdWZmZXIoYXJnLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX1jb3B5UHJvcHMoQnVmZmVyLFNhZmVCdWZmZXIpO1NhZmVCdWZmZXIuZnJvbT1mdW5jdGlvbihhcmcsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpe2lmKHR5cGVvZiBhcmc9PT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXIiKX1yZXR1cm4gQnVmZmVyKGFyZyxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9O1NhZmVCdWZmZXIuYWxsb2M9ZnVuY3Rpb24oc2l6ZSxmaWxsLGVuY29kaW5nKXtpZih0eXBlb2Ygc2l6ZSE9PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyIil9dmFyIGJ1Zj1CdWZmZXIoc2l6ZSk7aWYoZmlsbCE9PXVuZGVmaW5lZCl7aWYodHlwZW9mIGVuY29kaW5nPT09InN0cmluZyIpe2J1Zi5maWxsKGZpbGwsZW5jb2RpbmcpfWVsc2V7YnVmLmZpbGwoZmlsbCl9fWVsc2V7YnVmLmZpbGwoMCl9cmV0dXJuIGJ1Zn07U2FmZUJ1ZmZlci5hbGxvY1Vuc2FmZT1mdW5jdGlvbihzaXplKXtpZih0eXBlb2Ygc2l6ZSE9PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyIil9cmV0dXJuIEJ1ZmZlcihzaXplKX07U2FmZUJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3c9ZnVuY3Rpb24oc2l6ZSl7aWYodHlwZW9mIHNpemUhPT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlciIpfXJldHVybiBidWZmZXIuU2xvd0J1ZmZlcihzaXplKX19LHtidWZmZXI6Mjd9XSw3NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgiLi9yZWFkYWJsZSIpLlBhc3NUaHJvdWdofSx7Ii4vcmVhZGFibGUiOjc4fV0sNzg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe2V4cG9ydHM9bW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgiLi9saWIvX3N0cmVhbV9yZWFkYWJsZS5qcyIpO2V4cG9ydHMuU3RyZWFtPWV4cG9ydHM7ZXhwb3J0cy5SZWFkYWJsZT1leHBvcnRzO2V4cG9ydHMuV3JpdGFibGU9cmVxdWlyZSgiLi9saWIvX3N0cmVhbV93cml0YWJsZS5qcyIpO2V4cG9ydHMuRHVwbGV4PXJlcXVpcmUoIi4vbGliL19zdHJlYW1fZHVwbGV4LmpzIik7ZXhwb3J0cy5UcmFuc2Zvcm09cmVxdWlyZSgiLi9saWIvX3N0cmVhbV90cmFuc2Zvcm0uanMiKTtleHBvcnRzLlBhc3NUaHJvdWdoPXJlcXVpcmUoIi4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanMiKX0seyIuL2xpYi9fc3RyZWFtX2R1cGxleC5qcyI6NjgsIi4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanMiOjY5LCIuL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzIjo3MCwiLi9saWIvX3N0cmVhbV90cmFuc2Zvcm0uanMiOjcxLCIuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzIjo3Mn1dLDc5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1yZXF1aXJlKCIuL3JlYWRhYmxlIikuVHJhbnNmb3JtfSx7Ii4vcmVhZGFibGUiOjc4fV0sODA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXJlcXVpcmUoIi4vbGliL19zdHJlYW1fd3JpdGFibGUuanMiKX0seyIuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzIjo3Mn1dLDgxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJidWZmZXIiKS5CdWZmZXI7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIEhhc2hCYXNlPXJlcXVpcmUoImhhc2gtYmFzZSIpO3ZhciBBUlJBWTE2PW5ldyBBcnJheSgxNik7dmFyIHpsPVswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDcsNCwxMywxLDEwLDYsMTUsMywxMiwwLDksNSwyLDE0LDExLDgsMywxMCwxNCw0LDksMTUsOCwxLDIsNywwLDYsMTMsMTEsNSwxMiwxLDksMTEsMTAsMCw4LDEyLDQsMTMsMyw3LDE1LDE0LDUsNiwyLDQsMCw1LDksNywxMiwyLDEwLDE0LDEsMyw4LDExLDYsMTUsMTNdO3ZhciB6cj1bNSwxNCw3LDAsOSwyLDExLDQsMTMsNiwxNSw4LDEsMTAsMywxMiw2LDExLDMsNywwLDEzLDUsMTAsMTQsMTUsOCwxMiw0LDksMSwyLDE1LDUsMSwzLDcsMTQsNiw5LDExLDgsMTIsMiwxMCwwLDQsMTMsOCw2LDQsMSwzLDExLDE1LDAsNSwxMiwyLDEzLDksNywxMCwxNCwxMiwxNSwxMCw0LDEsNSw4LDcsNiwyLDEzLDE0LDAsMyw5LDExXTt2YXIgc2w9WzExLDE0LDE1LDEyLDUsOCw3LDksMTEsMTMsMTQsMTUsNiw3LDksOCw3LDYsOCwxMywxMSw5LDcsMTUsNywxMiwxNSw5LDExLDcsMTMsMTIsMTEsMTMsNiw3LDE0LDksMTMsMTUsMTQsOCwxMyw2LDUsMTIsNyw1LDExLDEyLDE0LDE1LDE0LDE1LDksOCw5LDE0LDUsNiw4LDYsNSwxMiw5LDE1LDUsMTEsNiw4LDEzLDEyLDUsMTIsMTMsMTQsMTEsOCw1LDZdO3ZhciBzcj1bOCw5LDksMTEsMTMsMTUsMTUsNSw3LDcsOCwxMSwxNCwxNCwxMiw2LDksMTMsMTUsNywxMiw4LDksMTEsNyw3LDEyLDcsNiwxNSwxMywxMSw5LDcsMTUsMTEsOCw2LDYsMTQsMTIsMTMsNSwxNCwxMywxMyw3LDUsMTUsNSw4LDExLDE0LDE0LDYsMTQsNiw5LDEyLDksMTIsNSwxNSw4LDgsNSwxMiw5LDEyLDUsMTQsNiw4LDEzLDYsNSwxNSwxMywxMSwxMV07dmFyIGhsPVswLDE1MTg1MDAyNDksMTg1OTc3NTM5MywyNDAwOTU5NzA4LDI4NDA4NTM4MzhdO3ZhciBocj1bMTM1MjgyOTkyNiwxNTQ4NjAzNjg0LDE4MzYwNzI2OTEsMjA1Mzk5NDIxNywwXTtmdW5jdGlvbiBSSVBFTUQxNjAoKXtIYXNoQmFzZS5jYWxsKHRoaXMsNjQpO3RoaXMuX2E9MTczMjU4NDE5Mzt0aGlzLl9iPTQwMjMyMzM0MTc7dGhpcy5fYz0yNTYyMzgzMTAyO3RoaXMuX2Q9MjcxNzMzODc4O3RoaXMuX2U9MzI4NTM3NzUyMH1pbmhlcml0cyhSSVBFTUQxNjAsSGFzaEJhc2UpO1JJUEVNRDE2MC5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbigpe3ZhciB3b3Jkcz1BUlJBWTE2O2Zvcih2YXIgaj0wO2o8MTY7KytqKXdvcmRzW2pdPXRoaXMuX2Jsb2NrLnJlYWRJbnQzMkxFKGoqNCk7dmFyIGFsPXRoaXMuX2F8MDt2YXIgYmw9dGhpcy5fYnwwO3ZhciBjbD10aGlzLl9jfDA7dmFyIGRsPXRoaXMuX2R8MDt2YXIgZWw9dGhpcy5fZXwwO3ZhciBhcj10aGlzLl9hfDA7dmFyIGJyPXRoaXMuX2J8MDt2YXIgY3I9dGhpcy5fY3wwO3ZhciBkcj10aGlzLl9kfDA7dmFyIGVyPXRoaXMuX2V8MDtmb3IodmFyIGk9MDtpPDgwO2krPTEpe3ZhciB0bDt2YXIgdHI7aWYoaTwxNil7dGw9Zm4xKGFsLGJsLGNsLGRsLGVsLHdvcmRzW3psW2ldXSxobFswXSxzbFtpXSk7dHI9Zm41KGFyLGJyLGNyLGRyLGVyLHdvcmRzW3pyW2ldXSxoclswXSxzcltpXSl9ZWxzZSBpZihpPDMyKXt0bD1mbjIoYWwsYmwsY2wsZGwsZWwsd29yZHNbemxbaV1dLGhsWzFdLHNsW2ldKTt0cj1mbjQoYXIsYnIsY3IsZHIsZXIsd29yZHNbenJbaV1dLGhyWzFdLHNyW2ldKX1lbHNlIGlmKGk8NDgpe3RsPWZuMyhhbCxibCxjbCxkbCxlbCx3b3Jkc1t6bFtpXV0saGxbMl0sc2xbaV0pO3RyPWZuMyhhcixicixjcixkcixlcix3b3Jkc1t6cltpXV0saHJbMl0sc3JbaV0pfWVsc2UgaWYoaTw2NCl7dGw9Zm40KGFsLGJsLGNsLGRsLGVsLHdvcmRzW3psW2ldXSxobFszXSxzbFtpXSk7dHI9Zm4yKGFyLGJyLGNyLGRyLGVyLHdvcmRzW3pyW2ldXSxoclszXSxzcltpXSl9ZWxzZXt0bD1mbjUoYWwsYmwsY2wsZGwsZWwsd29yZHNbemxbaV1dLGhsWzRdLHNsW2ldKTt0cj1mbjEoYXIsYnIsY3IsZHIsZXIsd29yZHNbenJbaV1dLGhyWzRdLHNyW2ldKX1hbD1lbDtlbD1kbDtkbD1yb3RsKGNsLDEwKTtjbD1ibDtibD10bDthcj1lcjtlcj1kcjtkcj1yb3RsKGNyLDEwKTtjcj1icjticj10cn12YXIgdD10aGlzLl9iK2NsK2RyfDA7dGhpcy5fYj10aGlzLl9jK2RsK2VyfDA7dGhpcy5fYz10aGlzLl9kK2VsK2FyfDA7dGhpcy5fZD10aGlzLl9lK2FsK2JyfDA7dGhpcy5fZT10aGlzLl9hK2JsK2NyfDA7dGhpcy5fYT10fTtSSVBFTUQxNjAucHJvdG90eXBlLl9kaWdlc3Q9ZnVuY3Rpb24oKXt0aGlzLl9ibG9ja1t0aGlzLl9ibG9ja09mZnNldCsrXT0xMjg7aWYodGhpcy5fYmxvY2tPZmZzZXQ+NTYpe3RoaXMuX2Jsb2NrLmZpbGwoMCx0aGlzLl9ibG9ja09mZnNldCw2NCk7dGhpcy5fdXBkYXRlKCk7dGhpcy5fYmxvY2tPZmZzZXQ9MH10aGlzLl9ibG9jay5maWxsKDAsdGhpcy5fYmxvY2tPZmZzZXQsNTYpO3RoaXMuX2Jsb2NrLndyaXRlVUludDMyTEUodGhpcy5fbGVuZ3RoWzBdLDU2KTt0aGlzLl9ibG9jay53cml0ZVVJbnQzMkxFKHRoaXMuX2xlbmd0aFsxXSw2MCk7dGhpcy5fdXBkYXRlKCk7dmFyIGJ1ZmZlcj1CdWZmZXIuYWxsb2M/QnVmZmVyLmFsbG9jKDIwKTpuZXcgQnVmZmVyKDIwKTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2EsMCk7YnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9iLDQpO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fYyw4KTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2QsMTIpO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fZSwxNik7cmV0dXJuIGJ1ZmZlcn07ZnVuY3Rpb24gcm90bCh4LG4pe3JldHVybiB4PDxufHg+Pj4zMi1ufWZ1bmN0aW9uIGZuMShhLGIsYyxkLGUsbSxrLHMpe3JldHVybiByb3RsKGErKGJeY15kKSttK2t8MCxzKStlfDB9ZnVuY3Rpb24gZm4yKGEsYixjLGQsZSxtLGsscyl7cmV0dXJuIHJvdGwoYSsoYiZjfH5iJmQpK20ra3wwLHMpK2V8MH1mdW5jdGlvbiBmbjMoYSxiLGMsZCxlLG0sayxzKXtyZXR1cm4gcm90bChhKygoYnx+YyleZCkrbStrfDAscykrZXwwfWZ1bmN0aW9uIGZuNChhLGIsYyxkLGUsbSxrLHMpe3JldHVybiByb3RsKGErKGImZHxjJn5kKSttK2t8MCxzKStlfDB9ZnVuY3Rpb24gZm41KGEsYixjLGQsZSxtLGsscyl7cmV0dXJuIHJvdGwoYSsoYl4oY3x+ZCkpK20ra3wwLHMpK2V8MH1tb2R1bGUuZXhwb3J0cz1SSVBFTUQxNjB9LHtidWZmZXI6MjcsImhhc2gtYmFzZSI6MzQsaW5oZXJpdHM6MzZ9XSw4MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGJ1ZmZlcj1yZXF1aXJlKCJidWZmZXIiKTt2YXIgQnVmZmVyPWJ1ZmZlci5CdWZmZXI7ZnVuY3Rpb24gY29weVByb3BzKHNyYyxkc3Qpe2Zvcih2YXIga2V5IGluIHNyYyl7ZHN0W2tleV09c3JjW2tleV19fWlmKEJ1ZmZlci5mcm9tJiZCdWZmZXIuYWxsb2MmJkJ1ZmZlci5hbGxvY1Vuc2FmZSYmQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyl7bW9kdWxlLmV4cG9ydHM9YnVmZmVyfWVsc2V7Y29weVByb3BzKGJ1ZmZlcixleHBvcnRzKTtleHBvcnRzLkJ1ZmZlcj1TYWZlQnVmZmVyfWZ1bmN0aW9uIFNhZmVCdWZmZXIoYXJnLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtyZXR1cm4gQnVmZmVyKGFyZyxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9U2FmZUJ1ZmZlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShCdWZmZXIucHJvdG90eXBlKTtjb3B5UHJvcHMoQnVmZmVyLFNhZmVCdWZmZXIpO1NhZmVCdWZmZXIuZnJvbT1mdW5jdGlvbihhcmcsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpe2lmKHR5cGVvZiBhcmc9PT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXIiKX1yZXR1cm4gQnVmZmVyKGFyZyxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9O1NhZmVCdWZmZXIuYWxsb2M9ZnVuY3Rpb24oc2l6ZSxmaWxsLGVuY29kaW5nKXtpZih0eXBlb2Ygc2l6ZSE9PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyIil9dmFyIGJ1Zj1CdWZmZXIoc2l6ZSk7aWYoZmlsbCE9PXVuZGVmaW5lZCl7aWYodHlwZW9mIGVuY29kaW5nPT09InN0cmluZyIpe2J1Zi5maWxsKGZpbGwsZW5jb2RpbmcpfWVsc2V7YnVmLmZpbGwoZmlsbCl9fWVsc2V7YnVmLmZpbGwoMCl9cmV0dXJuIGJ1Zn07U2FmZUJ1ZmZlci5hbGxvY1Vuc2FmZT1mdW5jdGlvbihzaXplKXtpZih0eXBlb2Ygc2l6ZSE9PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyIil9cmV0dXJuIEJ1ZmZlcihzaXplKX07U2FmZUJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3c9ZnVuY3Rpb24oc2l6ZSl7aWYodHlwZW9mIHNpemUhPT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlciIpfXJldHVybiBidWZmZXIuU2xvd0J1ZmZlcihzaXplKX19LHtidWZmZXI6Mjd9XSw4MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MpeyJ1c2Ugc3RyaWN0Ijt2YXIgYnVmZmVyPXJlcXVpcmUoImJ1ZmZlciIpO3ZhciBCdWZmZXI9YnVmZmVyLkJ1ZmZlcjt2YXIgc2FmZXI9e307dmFyIGtleTtmb3Ioa2V5IGluIGJ1ZmZlcil7aWYoIWJ1ZmZlci5oYXNPd25Qcm9wZXJ0eShrZXkpKWNvbnRpbnVlO2lmKGtleT09PSJTbG93QnVmZmVyInx8a2V5PT09IkJ1ZmZlciIpY29udGludWU7c2FmZXJba2V5XT1idWZmZXJba2V5XX12YXIgU2FmZXI9c2FmZXIuQnVmZmVyPXt9O2ZvcihrZXkgaW4gQnVmZmVyKXtpZighQnVmZmVyLmhhc093blByb3BlcnR5KGtleSkpY29udGludWU7aWYoa2V5PT09ImFsbG9jVW5zYWZlInx8a2V5PT09ImFsbG9jVW5zYWZlU2xvdyIpY29udGludWU7U2FmZXJba2V5XT1CdWZmZXJba2V5XX1zYWZlci5CdWZmZXIucHJvdG90eXBlPUJ1ZmZlci5wcm90b3R5cGU7aWYoIVNhZmVyLmZyb218fFNhZmVyLmZyb209PT1VaW50OEFycmF5LmZyb20pe1NhZmVyLmZyb209ZnVuY3Rpb24odmFsdWUsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpe2lmKHR5cGVvZiB2YWx1ZT09PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgInZhbHVlIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSAnK3R5cGVvZiB2YWx1ZSl9aWYodmFsdWUmJnR5cGVvZiB2YWx1ZS5sZW5ndGg9PT0idW5kZWZpbmVkIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgIit0eXBlb2YgdmFsdWUpfXJldHVybiBCdWZmZXIodmFsdWUsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpfX1pZighU2FmZXIuYWxsb2Mpe1NhZmVyLmFsbG9jPWZ1bmN0aW9uKHNpemUsZmlsbCxlbmNvZGluZyl7aWYodHlwZW9mIHNpemUhPT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlICJzaXplIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlICcrdHlwZW9mIHNpemUpfWlmKHNpemU8MHx8c2l6ZT49MiooMTw8MzApKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlICInK3NpemUrJyIgaXMgaW52YWxpZCBmb3Igb3B0aW9uICJzaXplIicpfXZhciBidWY9QnVmZmVyKHNpemUpO2lmKCFmaWxsfHxmaWxsLmxlbmd0aD09PTApe2J1Zi5maWxsKDApfWVsc2UgaWYodHlwZW9mIGVuY29kaW5nPT09InN0cmluZyIpe2J1Zi5maWxsKGZpbGwsZW5jb2RpbmcpfWVsc2V7YnVmLmZpbGwoZmlsbCl9cmV0dXJuIGJ1Zn19aWYoIXNhZmVyLmtTdHJpbmdNYXhMZW5ndGgpe3RyeXtzYWZlci5rU3RyaW5nTWF4TGVuZ3RoPXByb2Nlc3MuYmluZGluZygiYnVmZmVyIikua1N0cmluZ01heExlbmd0aH1jYXRjaChlKXt9fWlmKCFzYWZlci5jb25zdGFudHMpe3NhZmVyLmNvbnN0YW50cz17TUFYX0xFTkdUSDpzYWZlci5rTWF4TGVuZ3RofTtpZihzYWZlci5rU3RyaW5nTWF4TGVuZ3RoKXtzYWZlci5jb25zdGFudHMuTUFYX1NUUklOR19MRU5HVEg9c2FmZXIua1N0cmluZ01heExlbmd0aH19bW9kdWxlLmV4cG9ydHM9c2FmZXJ9KS5jYWxsKHRoaXMscmVxdWlyZSgiX3Byb2Nlc3MiKSl9LHtfcHJvY2Vzczo2NixidWZmZXI6Mjd9XSw4NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIHBia2RmMj1yZXF1aXJlKCJwYmtkZjIiKTt2YXIgTUFYX1ZBTFVFPTIxNDc0ODM2NDc7ZnVuY3Rpb24gc2NyeXB0KGtleSxzYWx0LE4scixwLGRrTGVuLHByb2dyZXNzQ2FsbGJhY2spe2lmKE49PT0wfHwoTiZOLTEpIT09MCl0aHJvdyBFcnJvcigiTiBtdXN0IGJlID4gMCBhbmQgYSBwb3dlciBvZiAyIik7aWYoTj5NQVhfVkFMVUUvMTI4L3IpdGhyb3cgRXJyb3IoIlBhcmFtZXRlciBOIGlzIHRvbyBsYXJnZSIpO2lmKHI+TUFYX1ZBTFVFLzEyOC9wKXRocm93IEVycm9yKCJQYXJhbWV0ZXIgciBpcyB0b28gbGFyZ2UiKTt2YXIgWFk9bmV3IEJ1ZmZlcigyNTYqcik7dmFyIFY9bmV3IEJ1ZmZlcigxMjgqcipOKTt2YXIgQjMyPW5ldyBJbnQzMkFycmF5KDE2KTt2YXIgeD1uZXcgSW50MzJBcnJheSgxNik7dmFyIF9YPW5ldyBCdWZmZXIoNjQpO3ZhciBCPXBia2RmMi5wYmtkZjJTeW5jKGtleSxzYWx0LDEscCoxMjgqciwic2hhMjU2Iik7dmFyIHRpY2tDYWxsYmFjaztpZihwcm9ncmVzc0NhbGxiYWNrKXt2YXIgdG90YWxPcHM9cCpOKjI7dmFyIGN1cnJlbnRPcD0wO3RpY2tDYWxsYmFjaz1mdW5jdGlvbigpeysrY3VycmVudE9wO2lmKGN1cnJlbnRPcCUxZTM9PT0wKXtwcm9ncmVzc0NhbGxiYWNrKHtjdXJyZW50OmN1cnJlbnRPcCx0b3RhbDp0b3RhbE9wcyxwZXJjZW50OmN1cnJlbnRPcC90b3RhbE9wcyoxMDB9KX19fWZvcih2YXIgaT0wO2k8cDtpKyspe3NtaXgoQixpKjEyOCpyLHIsTixWLFhZKX1yZXR1cm4gcGJrZGYyLnBia2RmMlN5bmMoa2V5LEIsMSxka0xlbiwic2hhMjU2Iik7ZnVuY3Rpb24gc21peChCLEJpLHIsTixWLFhZKXt2YXIgWGk9MDt2YXIgWWk9MTI4KnI7dmFyIGk7Qi5jb3B5KFhZLFhpLEJpLEJpK1lpKTtmb3IoaT0wO2k8TjtpKyspe1hZLmNvcHkoVixpKllpLFhpLFhpK1lpKTtibG9ja21peF9zYWxzYTgoWFksWGksWWkscik7aWYodGlja0NhbGxiYWNrKXRpY2tDYWxsYmFjaygpfWZvcihpPTA7aTxOO2krKyl7dmFyIG9mZnNldD1YaSsoMipyLTEpKjY0O3ZhciBqPVhZLnJlYWRVSW50MzJMRShvZmZzZXQpJk4tMTtibG9ja3hvcihWLGoqWWksWFksWGksWWkpO2Jsb2NrbWl4X3NhbHNhOChYWSxYaSxZaSxyKTtpZih0aWNrQ2FsbGJhY2spdGlja0NhbGxiYWNrKCl9WFkuY29weShCLEJpLFhpLFhpK1lpKX1mdW5jdGlvbiBibG9ja21peF9zYWxzYTgoQlksQmksWWkscil7dmFyIGk7YXJyYXljb3B5KEJZLEJpKygyKnItMSkqNjQsX1gsMCw2NCk7Zm9yKGk9MDtpPDIqcjtpKyspe2Jsb2NreG9yKEJZLGkqNjQsX1gsMCw2NCk7c2Fsc2EyMF84KF9YKTthcnJheWNvcHkoX1gsMCxCWSxZaStpKjY0LDY0KX1mb3IoaT0wO2k8cjtpKyspe2FycmF5Y29weShCWSxZaStpKjIqNjQsQlksQmkraSo2NCw2NCl9Zm9yKGk9MDtpPHI7aSsrKXthcnJheWNvcHkoQlksWWkrKGkqMisxKSo2NCxCWSxCaSsoaStyKSo2NCw2NCl9fWZ1bmN0aW9uIFIoYSxiKXtyZXR1cm4gYTw8YnxhPj4+MzItYn1mdW5jdGlvbiBzYWxzYTIwXzgoQil7dmFyIGk7Zm9yKGk9MDtpPDE2O2krKyl7QjMyW2ldPShCW2kqNCswXSYyNTUpPDwwO0IzMltpXXw9KEJbaSo0KzFdJjI1NSk8PDg7QjMyW2ldfD0oQltpKjQrMl0mMjU1KTw8MTY7QjMyW2ldfD0oQltpKjQrM10mMjU1KTw8MjR9YXJyYXljb3B5KEIzMiwwLHgsMCwxNik7Zm9yKGk9ODtpPjA7aS09Mil7eFs0XV49Uih4WzBdK3hbMTJdLDcpO3hbOF1ePVIoeFs0XSt4WzBdLDkpO3hbMTJdXj1SKHhbOF0reFs0XSwxMyk7eFswXV49Uih4WzEyXSt4WzhdLDE4KTt4WzldXj1SKHhbNV0reFsxXSw3KTt4WzEzXV49Uih4WzldK3hbNV0sOSk7eFsxXV49Uih4WzEzXSt4WzldLDEzKTt4WzVdXj1SKHhbMV0reFsxM10sMTgpO3hbMTRdXj1SKHhbMTBdK3hbNl0sNyk7eFsyXV49Uih4WzE0XSt4WzEwXSw5KTt4WzZdXj1SKHhbMl0reFsxNF0sMTMpO3hbMTBdXj1SKHhbNl0reFsyXSwxOCk7eFszXV49Uih4WzE1XSt4WzExXSw3KTt4WzddXj1SKHhbM10reFsxNV0sOSk7eFsxMV1ePVIoeFs3XSt4WzNdLDEzKTt4WzE1XV49Uih4WzExXSt4WzddLDE4KTt4WzFdXj1SKHhbMF0reFszXSw3KTt4WzJdXj1SKHhbMV0reFswXSw5KTt4WzNdXj1SKHhbMl0reFsxXSwxMyk7eFswXV49Uih4WzNdK3hbMl0sMTgpO3hbNl1ePVIoeFs1XSt4WzRdLDcpO3hbN11ePVIoeFs2XSt4WzVdLDkpO3hbNF1ePVIoeFs3XSt4WzZdLDEzKTt4WzVdXj1SKHhbNF0reFs3XSwxOCk7eFsxMV1ePVIoeFsxMF0reFs5XSw3KTt4WzhdXj1SKHhbMTFdK3hbMTBdLDkpO3hbOV1ePVIoeFs4XSt4WzExXSwxMyk7eFsxMF1ePVIoeFs5XSt4WzhdLDE4KTt4WzEyXV49Uih4WzE1XSt4WzE0XSw3KTt4WzEzXV49Uih4WzEyXSt4WzE1XSw5KTt4WzE0XV49Uih4WzEzXSt4WzEyXSwxMyk7eFsxNV1ePVIoeFsxNF0reFsxM10sMTgpfWZvcihpPTA7aTwxNjsrK2kpQjMyW2ldPXhbaV0rQjMyW2ldO2ZvcihpPTA7aTwxNjtpKyspe3ZhciBiaT1pKjQ7QltiaSswXT1CMzJbaV0+PjAmMjU1O0JbYmkrMV09QjMyW2ldPj44JjI1NTtCW2JpKzJdPUIzMltpXT4+MTYmMjU1O0JbYmkrM109QjMyW2ldPj4yNCYyNTV9fWZ1bmN0aW9uIGJsb2NreG9yKFMsU2ksRCxEaSxsZW4pe2Zvcih2YXIgaT0wO2k8bGVuO2krKyl7RFtEaStpXV49U1tTaStpXX19fWZ1bmN0aW9uIGFycmF5Y29weShzcmMsc3JjUG9zLGRlc3QsZGVzdFBvcyxsZW5ndGgpe2lmKEJ1ZmZlci5pc0J1ZmZlcihzcmMpJiZCdWZmZXIuaXNCdWZmZXIoZGVzdCkpe3NyYy5jb3B5KGRlc3QsZGVzdFBvcyxzcmNQb3Msc3JjUG9zK2xlbmd0aCl9ZWxzZXt3aGlsZShsZW5ndGgtLSl7ZGVzdFtkZXN0UG9zKytdPXNyY1tzcmNQb3MrK119fX1tb2R1bGUuZXhwb3J0cz1zY3J5cHR9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0se2J1ZmZlcjoyNyxwYmtkZjI6NjB9XSw4NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGFsZWE9cmVxdWlyZSgiLi9saWIvYWxlYSIpO3ZhciB4b3IxMjg9cmVxdWlyZSgiLi9saWIveG9yMTI4Iik7dmFyIHhvcndvdz1yZXF1aXJlKCIuL2xpYi94b3J3b3ciKTt2YXIgeG9yc2hpZnQ3PXJlcXVpcmUoIi4vbGliL3hvcnNoaWZ0NyIpO3ZhciB4b3I0MDk2PXJlcXVpcmUoIi4vbGliL3hvcjQwOTYiKTt2YXIgdHljaGVpPXJlcXVpcmUoIi4vbGliL3R5Y2hlaSIpO3ZhciBzcj1yZXF1aXJlKCIuL3NlZWRyYW5kb20iKTtzci5hbGVhPWFsZWE7c3IueG9yMTI4PXhvcjEyODtzci54b3J3b3c9eG9yd293O3NyLnhvcnNoaWZ0Nz14b3JzaGlmdDc7c3IueG9yNDA5Nj14b3I0MDk2O3NyLnR5Y2hlaT10eWNoZWk7bW9kdWxlLmV4cG9ydHM9c3J9LHsiLi9saWIvYWxlYSI6ODYsIi4vbGliL3R5Y2hlaSI6ODcsIi4vbGliL3hvcjEyOCI6ODgsIi4vbGliL3hvcjQwOTYiOjg5LCIuL2xpYi94b3JzaGlmdDciOjkwLCIuL2xpYi94b3J3b3ciOjkxLCIuL3NlZWRyYW5kb20iOjkyfV0sODY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwsbW9kdWxlLGRlZmluZSl7ZnVuY3Rpb24gQWxlYShzZWVkKXt2YXIgbWU9dGhpcyxtYXNoPU1hc2goKTttZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIHQ9MjA5MTYzOSptZS5zMCttZS5jKjIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7bWUuczA9bWUuczE7bWUuczE9bWUuczI7cmV0dXJuIG1lLnMyPXQtKG1lLmM9dHwwKX07bWUuYz0xO21lLnMwPW1hc2goIiAiKTttZS5zMT1tYXNoKCIgIik7bWUuczI9bWFzaCgiICIpO21lLnMwLT1tYXNoKHNlZWQpO2lmKG1lLnMwPDApe21lLnMwKz0xfW1lLnMxLT1tYXNoKHNlZWQpO2lmKG1lLnMxPDApe21lLnMxKz0xfW1lLnMyLT1tYXNoKHNlZWQpO2lmKG1lLnMyPDApe21lLnMyKz0xfW1hc2g9bnVsbH1mdW5jdGlvbiBjb3B5KGYsdCl7dC5jPWYuYzt0LnMwPWYuczA7dC5zMT1mLnMxO3QuczI9Zi5zMjtyZXR1cm4gdH1mdW5jdGlvbiBpbXBsKHNlZWQsb3B0cyl7dmFyIHhnPW5ldyBBbGVhKHNlZWQpLHN0YXRlPW9wdHMmJm9wdHMuc3RhdGUscHJuZz14Zy5uZXh0O3BybmcuaW50MzI9ZnVuY3Rpb24oKXtyZXR1cm4geGcubmV4dCgpKjQyOTQ5NjcyOTZ8MH07cHJuZy5kb3VibGU9ZnVuY3Rpb24oKXtyZXR1cm4gcHJuZygpKyhwcm5nKCkqMjA5NzE1MnwwKSoxMTEwMjIzMDI0NjI1MTU2NWUtMzJ9O3BybmcucXVpY2s9cHJuZztpZihzdGF0ZSl7aWYodHlwZW9mIHN0YXRlPT0ib2JqZWN0Iiljb3B5KHN0YXRlLHhnKTtwcm5nLnN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGNvcHkoeGcse30pfX1yZXR1cm4gcHJuZ31mdW5jdGlvbiBNYXNoKCl7dmFyIG49NDAyMjg3MTE5Nzt2YXIgbWFzaD1mdW5jdGlvbihkYXRhKXtkYXRhPVN0cmluZyhkYXRhKTtmb3IodmFyIGk9MDtpPGRhdGEubGVuZ3RoO2krKyl7bis9ZGF0YS5jaGFyQ29kZUF0KGkpO3ZhciBoPS4wMjUxOTYwMzI4MjQxNjkzOCpuO249aD4+PjA7aC09bjtoKj1uO249aD4+PjA7aC09bjtuKz1oKjQyOTQ5NjcyOTZ9cmV0dXJuKG4+Pj4wKSoyLjMyODMwNjQzNjUzODY5NjNlLTEwfTtyZXR1cm4gbWFzaH1pZihtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXttb2R1bGUuZXhwb3J0cz1pbXBsfWVsc2UgaWYoZGVmaW5lJiZkZWZpbmUuYW1kKXtkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gaW1wbH0pfWVsc2V7dGhpcy5hbGVhPWltcGx9fSkodGhpcyx0eXBlb2YgbW9kdWxlPT0ib2JqZWN0IiYmbW9kdWxlLHR5cGVvZiBkZWZpbmU9PSJmdW5jdGlvbiImJmRlZmluZSl9LHt9XSw4NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCxtb2R1bGUsZGVmaW5lKXtmdW5jdGlvbiBYb3JHZW4oc2VlZCl7dmFyIG1lPXRoaXMsc3Ryc2VlZD0iIjttZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIGI9bWUuYixjPW1lLmMsZD1tZS5kLGE9bWUuYTtiPWI8PDI1XmI+Pj43XmM7Yz1jLWR8MDtkPWQ8PDI0XmQ+Pj44XmE7YT1hLWJ8MDttZS5iPWI9Yjw8MjBeYj4+PjEyXmM7bWUuYz1jPWMtZHwwO21lLmQ9ZDw8MTZeYz4+PjE2XmE7cmV0dXJuIG1lLmE9YS1ifDB9O21lLmE9MDttZS5iPTA7bWUuYz0yNjU0NDM1NzY5fDA7bWUuZD0xMzY3MTMwNTUxO2lmKHNlZWQ9PT1NYXRoLmZsb29yKHNlZWQpKXttZS5hPXNlZWQvNDI5NDk2NzI5NnwwO21lLmI9c2VlZHwwfWVsc2V7c3Ryc2VlZCs9c2VlZH1mb3IodmFyIGs9MDtrPHN0cnNlZWQubGVuZ3RoKzIwO2srKyl7bWUuYl49c3Ryc2VlZC5jaGFyQ29kZUF0KGspfDA7bWUubmV4dCgpfX1mdW5jdGlvbiBjb3B5KGYsdCl7dC5hPWYuYTt0LmI9Zi5iO3QuYz1mLmM7dC5kPWYuZDtyZXR1cm4gdH1mdW5jdGlvbiBpbXBsKHNlZWQsb3B0cyl7dmFyIHhnPW5ldyBYb3JHZW4oc2VlZCksc3RhdGU9b3B0cyYmb3B0cy5zdGF0ZSxwcm5nPWZ1bmN0aW9uKCl7cmV0dXJuKHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTZ9O3BybmcuZG91YmxlPWZ1bmN0aW9uKCl7ZG97dmFyIHRvcD14Zy5uZXh0KCk+Pj4xMSxib3Q9KHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTYscmVzdWx0PSh0b3ArYm90KS8oMTw8MjEpfXdoaWxlKHJlc3VsdD09PTApO3JldHVybiByZXN1bHR9O3BybmcuaW50MzI9eGcubmV4dDtwcm5nLnF1aWNrPXBybmc7aWYoc3RhdGUpe2lmKHR5cGVvZiBzdGF0ZT09Im9iamVjdCIpY29weShzdGF0ZSx4Zyk7cHJuZy5zdGF0ZT1mdW5jdGlvbigpe3JldHVybiBjb3B5KHhnLHt9KX19cmV0dXJuIHBybmd9aWYobW9kdWxlJiZtb2R1bGUuZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9aW1wbH1lbHNlIGlmKGRlZmluZSYmZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGltcGx9KX1lbHNle3RoaXMudHljaGVpPWltcGx9fSkodGhpcyx0eXBlb2YgbW9kdWxlPT0ib2JqZWN0IiYmbW9kdWxlLHR5cGVvZiBkZWZpbmU9PSJmdW5jdGlvbiImJmRlZmluZSl9LHt9XSw4ODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCxtb2R1bGUsZGVmaW5lKXtmdW5jdGlvbiBYb3JHZW4oc2VlZCl7dmFyIG1lPXRoaXMsc3Ryc2VlZD0iIjttZS54PTA7bWUueT0wO21lLno9MDttZS53PTA7bWUubmV4dD1mdW5jdGlvbigpe3ZhciB0PW1lLnhebWUueDw8MTE7bWUueD1tZS55O21lLnk9bWUuejttZS56PW1lLnc7cmV0dXJuIG1lLndePW1lLnc+Pj4xOV50XnQ+Pj44fTtpZihzZWVkPT09KHNlZWR8MCkpe21lLng9c2VlZH1lbHNle3N0cnNlZWQrPXNlZWR9Zm9yKHZhciBrPTA7azxzdHJzZWVkLmxlbmd0aCs2NDtrKyspe21lLnhePXN0cnNlZWQuY2hhckNvZGVBdChrKXwwO21lLm5leHQoKX19ZnVuY3Rpb24gY29weShmLHQpe3QueD1mLng7dC55PWYueTt0Lno9Zi56O3Qudz1mLnc7cmV0dXJuIHR9ZnVuY3Rpb24gaW1wbChzZWVkLG9wdHMpe3ZhciB4Zz1uZXcgWG9yR2VuKHNlZWQpLHN0YXRlPW9wdHMmJm9wdHMuc3RhdGUscHJuZz1mdW5jdGlvbigpe3JldHVybih4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2fTtwcm5nLmRvdWJsZT1mdW5jdGlvbigpe2Rve3ZhciB0b3A9eGcubmV4dCgpPj4+MTEsYm90PSh4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2LHJlc3VsdD0odG9wK2JvdCkvKDE8PDIxKX13aGlsZShyZXN1bHQ9PT0wKTtyZXR1cm4gcmVzdWx0fTtwcm5nLmludDMyPXhnLm5leHQ7cHJuZy5xdWljaz1wcm5nO2lmKHN0YXRlKXtpZih0eXBlb2Ygc3RhdGU9PSJvYmplY3QiKWNvcHkoc3RhdGUseGcpO3Bybmcuc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gY29weSh4Zyx7fSl9fXJldHVybiBwcm5nfWlmKG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWltcGx9ZWxzZSBpZihkZWZpbmUmJmRlZmluZS5hbWQpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBpbXBsfSl9ZWxzZXt0aGlzLnhvcjEyOD1pbXBsfX0pKHRoaXMsdHlwZW9mIG1vZHVsZT09Im9iamVjdCImJm1vZHVsZSx0eXBlb2YgZGVmaW5lPT0iZnVuY3Rpb24iJiZkZWZpbmUpfSx7fV0sODk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwsbW9kdWxlLGRlZmluZSl7ZnVuY3Rpb24gWG9yR2VuKHNlZWQpe3ZhciBtZT10aGlzO21lLm5leHQ9ZnVuY3Rpb24oKXt2YXIgdz1tZS53LFg9bWUuWCxpPW1lLmksdCx2O21lLnc9dz13KzE2NDA1MzE1Mjd8MDt2PVhbaSszNCYxMjddO3Q9WFtpPWkrMSYxMjddO3ZePXY8PDEzO3RePXQ8PDE3O3ZePXY+Pj4xNTt0Xj10Pj4+MTI7dj1YW2ldPXZedDttZS5pPWk7cmV0dXJuIHYrKHdedz4+PjE2KXwwfTtmdW5jdGlvbiBpbml0KG1lLHNlZWQpe3ZhciB0LHYsaSxqLHcsWD1bXSxsaW1pdD0xMjg7aWYoc2VlZD09PShzZWVkfDApKXt2PXNlZWQ7c2VlZD1udWxsfWVsc2V7c2VlZD1zZWVkKyJcMCI7dj0wO2xpbWl0PU1hdGgubWF4KGxpbWl0LHNlZWQubGVuZ3RoKX1mb3IoaT0wLGo9LTMyO2o8bGltaXQ7KytqKXtpZihzZWVkKXZePXNlZWQuY2hhckNvZGVBdCgoaiszMiklc2VlZC5sZW5ndGgpO2lmKGo9PT0wKXc9djt2Xj12PDwxMDt2Xj12Pj4+MTU7dl49djw8NDt2Xj12Pj4+MTM7aWYoaj49MCl7dz13KzE2NDA1MzE1Mjd8MDt0PVhbaiYxMjddXj12K3c7aT0wPT10P2krMTowfX1pZihpPj0xMjgpe1hbKHNlZWQmJnNlZWQubGVuZ3RofHwwKSYxMjddPS0xfWk9MTI3O2ZvcihqPTQqMTI4O2o+MDstLWope3Y9WFtpKzM0JjEyN107dD1YW2k9aSsxJjEyN107dl49djw8MTM7dF49dDw8MTc7dl49dj4+PjE1O3RePXQ+Pj4xMjtYW2ldPXZedH1tZS53PXc7bWUuWD1YO21lLmk9aX1pbml0KG1lLHNlZWQpfWZ1bmN0aW9uIGNvcHkoZix0KXt0Lmk9Zi5pO3Qudz1mLnc7dC5YPWYuWC5zbGljZSgpO3JldHVybiB0fWZ1bmN0aW9uIGltcGwoc2VlZCxvcHRzKXtpZihzZWVkPT1udWxsKXNlZWQ9K25ldyBEYXRlO3ZhciB4Zz1uZXcgWG9yR2VuKHNlZWQpLHN0YXRlPW9wdHMmJm9wdHMuc3RhdGUscHJuZz1mdW5jdGlvbigpe3JldHVybih4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2fTtwcm5nLmRvdWJsZT1mdW5jdGlvbigpe2Rve3ZhciB0b3A9eGcubmV4dCgpPj4+MTEsYm90PSh4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2LHJlc3VsdD0odG9wK2JvdCkvKDE8PDIxKX13aGlsZShyZXN1bHQ9PT0wKTtyZXR1cm4gcmVzdWx0fTtwcm5nLmludDMyPXhnLm5leHQ7cHJuZy5xdWljaz1wcm5nO2lmKHN0YXRlKXtpZihzdGF0ZS5YKWNvcHkoc3RhdGUseGcpO3Bybmcuc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gY29weSh4Zyx7fSl9fXJldHVybiBwcm5nfWlmKG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWltcGx9ZWxzZSBpZihkZWZpbmUmJmRlZmluZS5hbWQpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBpbXBsfSl9ZWxzZXt0aGlzLnhvcjQwOTY9aW1wbH19KSh0aGlzLHR5cGVvZiBtb2R1bGU9PSJvYmplY3QiJiZtb2R1bGUsdHlwZW9mIGRlZmluZT09ImZ1bmN0aW9uIiYmZGVmaW5lKX0se31dLDkwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsLG1vZHVsZSxkZWZpbmUpe2Z1bmN0aW9uIFhvckdlbihzZWVkKXt2YXIgbWU9dGhpczttZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIFg9bWUueCxpPW1lLmksdCx2LHc7dD1YW2ldO3RePXQ+Pj43O3Y9dF50PDwyNDt0PVhbaSsxJjddO3ZePXRedD4+PjEwO3Q9WFtpKzMmN107dl49dF50Pj4+Mzt0PVhbaSs0JjddO3ZePXRedDw8Nzt0PVhbaSs3JjddO3Q9dF50PDwxMzt2Xj10XnQ8PDk7WFtpXT12O21lLmk9aSsxJjc7cmV0dXJuIHZ9O2Z1bmN0aW9uIGluaXQobWUsc2VlZCl7dmFyIGosdyxYPVtdO2lmKHNlZWQ9PT0oc2VlZHwwKSl7dz1YWzBdPXNlZWR9ZWxzZXtzZWVkPSIiK3NlZWQ7Zm9yKGo9MDtqPHNlZWQubGVuZ3RoOysrail7WFtqJjddPVhbaiY3XTw8MTVec2VlZC5jaGFyQ29kZUF0KGopK1hbaisxJjddPDwxM319d2hpbGUoWC5sZW5ndGg8OClYLnB1c2goMCk7Zm9yKGo9MDtqPDgmJlhbal09PT0wOysraik7aWYoaj09OCl3PVhbN109LTE7ZWxzZSB3PVhbal07bWUueD1YO21lLmk9MDtmb3Ioaj0yNTY7aj4wOy0tail7bWUubmV4dCgpfX1pbml0KG1lLHNlZWQpfWZ1bmN0aW9uIGNvcHkoZix0KXt0Lng9Zi54LnNsaWNlKCk7dC5pPWYuaTtyZXR1cm4gdH1mdW5jdGlvbiBpbXBsKHNlZWQsb3B0cyl7aWYoc2VlZD09bnVsbClzZWVkPStuZXcgRGF0ZTt2YXIgeGc9bmV3IFhvckdlbihzZWVkKSxzdGF0ZT1vcHRzJiZvcHRzLnN0YXRlLHBybmc9ZnVuY3Rpb24oKXtyZXR1cm4oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5Nn07cHJuZy5kb3VibGU9ZnVuY3Rpb24oKXtkb3t2YXIgdG9wPXhnLm5leHQoKT4+PjExLGJvdD0oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5NixyZXN1bHQ9KHRvcCtib3QpLygxPDwyMSl9d2hpbGUocmVzdWx0PT09MCk7cmV0dXJuIHJlc3VsdH07cHJuZy5pbnQzMj14Zy5uZXh0O3BybmcucXVpY2s9cHJuZztpZihzdGF0ZSl7aWYoc3RhdGUueCljb3B5KHN0YXRlLHhnKTtwcm5nLnN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGNvcHkoeGcse30pfX1yZXR1cm4gcHJuZ31pZihtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXttb2R1bGUuZXhwb3J0cz1pbXBsfWVsc2UgaWYoZGVmaW5lJiZkZWZpbmUuYW1kKXtkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gaW1wbH0pfWVsc2V7dGhpcy54b3JzaGlmdDc9aW1wbH19KSh0aGlzLHR5cGVvZiBtb2R1bGU9PSJvYmplY3QiJiZtb2R1bGUsdHlwZW9mIGRlZmluZT09ImZ1bmN0aW9uIiYmZGVmaW5lKX0se31dLDkxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsLG1vZHVsZSxkZWZpbmUpe2Z1bmN0aW9uIFhvckdlbihzZWVkKXt2YXIgbWU9dGhpcyxzdHJzZWVkPSIiO21lLm5leHQ9ZnVuY3Rpb24oKXt2YXIgdD1tZS54Xm1lLng+Pj4yO21lLng9bWUueTttZS55PW1lLno7bWUuej1tZS53O21lLnc9bWUudjtyZXR1cm4obWUuZD1tZS5kKzM2MjQzN3wwKSsobWUudj1tZS52Xm1lLnY8PDReKHRedDw8MSkpfDB9O21lLng9MDttZS55PTA7bWUuej0wO21lLnc9MDttZS52PTA7aWYoc2VlZD09PShzZWVkfDApKXttZS54PXNlZWR9ZWxzZXtzdHJzZWVkKz1zZWVkfWZvcih2YXIgaz0wO2s8c3Ryc2VlZC5sZW5ndGgrNjQ7aysrKXttZS54Xj1zdHJzZWVkLmNoYXJDb2RlQXQoayl8MDtpZihrPT1zdHJzZWVkLmxlbmd0aCl7bWUuZD1tZS54PDwxMF5tZS54Pj4+NH1tZS5uZXh0KCl9fWZ1bmN0aW9uIGNvcHkoZix0KXt0Lng9Zi54O3QueT1mLnk7dC56PWYuejt0Lnc9Zi53O3Qudj1mLnY7dC5kPWYuZDtyZXR1cm4gdH1mdW5jdGlvbiBpbXBsKHNlZWQsb3B0cyl7dmFyIHhnPW5ldyBYb3JHZW4oc2VlZCksc3RhdGU9b3B0cyYmb3B0cy5zdGF0ZSxwcm5nPWZ1bmN0aW9uKCl7cmV0dXJuKHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTZ9O3BybmcuZG91YmxlPWZ1bmN0aW9uKCl7ZG97dmFyIHRvcD14Zy5uZXh0KCk+Pj4xMSxib3Q9KHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTYscmVzdWx0PSh0b3ArYm90KS8oMTw8MjEpfXdoaWxlKHJlc3VsdD09PTApO3JldHVybiByZXN1bHR9O3BybmcuaW50MzI9eGcubmV4dDtwcm5nLnF1aWNrPXBybmc7aWYoc3RhdGUpe2lmKHR5cGVvZiBzdGF0ZT09Im9iamVjdCIpY29weShzdGF0ZSx4Zyk7cHJuZy5zdGF0ZT1mdW5jdGlvbigpe3JldHVybiBjb3B5KHhnLHt9KX19cmV0dXJuIHBybmd9aWYobW9kdWxlJiZtb2R1bGUuZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9aW1wbH1lbHNlIGlmKGRlZmluZSYmZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGltcGx9KX1lbHNle3RoaXMueG9yd293PWltcGx9fSkodGhpcyx0eXBlb2YgbW9kdWxlPT0ib2JqZWN0IiYmbW9kdWxlLHR5cGVvZiBkZWZpbmU9PSJmdW5jdGlvbiImJmRlZmluZSl9LHt9XSw5MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHBvb2wsbWF0aCl7dmFyIGdsb2JhbD0oMCxldmFsKSgidGhpcyIpLHdpZHRoPTI1NixjaHVua3M9NixkaWdpdHM9NTIscm5nbmFtZT0icmFuZG9tIixzdGFydGRlbm9tPW1hdGgucG93KHdpZHRoLGNodW5rcyksc2lnbmlmaWNhbmNlPW1hdGgucG93KDIsZGlnaXRzKSxvdmVyZmxvdz1zaWduaWZpY2FuY2UqMixtYXNrPXdpZHRoLTEsbm9kZWNyeXB0bztmdW5jdGlvbiBzZWVkcmFuZG9tKHNlZWQsb3B0aW9ucyxjYWxsYmFjayl7dmFyIGtleT1bXTtvcHRpb25zPW9wdGlvbnM9PXRydWU/e2VudHJvcHk6dHJ1ZX06b3B0aW9uc3x8e307dmFyIHNob3J0c2VlZD1taXhrZXkoZmxhdHRlbihvcHRpb25zLmVudHJvcHk/W3NlZWQsdG9zdHJpbmcocG9vbCldOnNlZWQ9PW51bGw/YXV0b3NlZWQoKTpzZWVkLDMpLGtleSk7dmFyIGFyYzQ9bmV3IEFSQzQoa2V5KTt2YXIgcHJuZz1mdW5jdGlvbigpe3ZhciBuPWFyYzQuZyhjaHVua3MpLGQ9c3RhcnRkZW5vbSx4PTA7d2hpbGUobjxzaWduaWZpY2FuY2Upe249KG4reCkqd2lkdGg7ZCo9d2lkdGg7eD1hcmM0LmcoMSl9d2hpbGUobj49b3ZlcmZsb3cpe24vPTI7ZC89Mjt4Pj4+PTF9cmV0dXJuKG4reCkvZH07cHJuZy5pbnQzMj1mdW5jdGlvbigpe3JldHVybiBhcmM0LmcoNCl8MH07cHJuZy5xdWljaz1mdW5jdGlvbigpe3JldHVybiBhcmM0LmcoNCkvNDI5NDk2NzI5Nn07cHJuZy5kb3VibGU9cHJuZzttaXhrZXkodG9zdHJpbmcoYXJjNC5TKSxwb29sKTtyZXR1cm4ob3B0aW9ucy5wYXNzfHxjYWxsYmFja3x8ZnVuY3Rpb24ocHJuZyxzZWVkLGlzX21hdGhfY2FsbCxzdGF0ZSl7aWYoc3RhdGUpe2lmKHN0YXRlLlMpe2NvcHkoc3RhdGUsYXJjNCl9cHJuZy5zdGF0ZT1mdW5jdGlvbigpe3JldHVybiBjb3B5KGFyYzQse30pfX1pZihpc19tYXRoX2NhbGwpe21hdGhbcm5nbmFtZV09cHJuZztyZXR1cm4gc2VlZH1lbHNlIHJldHVybiBwcm5nfSkocHJuZyxzaG9ydHNlZWQsImdsb2JhbCJpbiBvcHRpb25zP29wdGlvbnMuZ2xvYmFsOnRoaXM9PW1hdGgsb3B0aW9ucy5zdGF0ZSl9ZnVuY3Rpb24gQVJDNChrZXkpe3ZhciB0LGtleWxlbj1rZXkubGVuZ3RoLG1lPXRoaXMsaT0wLGo9bWUuaT1tZS5qPTAscz1tZS5TPVtdO2lmKCFrZXlsZW4pe2tleT1ba2V5bGVuKytdfXdoaWxlKGk8d2lkdGgpe3NbaV09aSsrfWZvcihpPTA7aTx3aWR0aDtpKyspe3NbaV09c1tqPW1hc2smaitrZXlbaSVrZXlsZW5dKyh0PXNbaV0pXTtzW2pdPXR9KG1lLmc9ZnVuY3Rpb24oY291bnQpe3ZhciB0LHI9MCxpPW1lLmksaj1tZS5qLHM9bWUuUzt3aGlsZShjb3VudC0tKXt0PXNbaT1tYXNrJmkrMV07cj1yKndpZHRoK3NbbWFzayYoc1tpXT1zW2o9bWFzayZqK3RdKSsoc1tqXT10KV19bWUuaT1pO21lLmo9ajtyZXR1cm4gcn0pKHdpZHRoKX1mdW5jdGlvbiBjb3B5KGYsdCl7dC5pPWYuaTt0Lmo9Zi5qO3QuUz1mLlMuc2xpY2UoKTtyZXR1cm4gdH1mdW5jdGlvbiBmbGF0dGVuKG9iaixkZXB0aCl7dmFyIHJlc3VsdD1bXSx0eXA9dHlwZW9mIG9iaixwcm9wO2lmKGRlcHRoJiZ0eXA9PSJvYmplY3QiKXtmb3IocHJvcCBpbiBvYmope3RyeXtyZXN1bHQucHVzaChmbGF0dGVuKG9ialtwcm9wXSxkZXB0aC0xKSl9Y2F0Y2goZSl7fX19cmV0dXJuIHJlc3VsdC5sZW5ndGg/cmVzdWx0OnR5cD09InN0cmluZyI/b2JqOm9iaisiXDAifWZ1bmN0aW9uIG1peGtleShzZWVkLGtleSl7dmFyIHN0cmluZ3NlZWQ9c2VlZCsiIixzbWVhcixqPTA7d2hpbGUoajxzdHJpbmdzZWVkLmxlbmd0aCl7a2V5W21hc2smal09bWFzayYoc21lYXJePWtleVttYXNrJmpdKjE5KStzdHJpbmdzZWVkLmNoYXJDb2RlQXQoaisrKX1yZXR1cm4gdG9zdHJpbmcoa2V5KX1mdW5jdGlvbiBhdXRvc2VlZCgpe3RyeXt2YXIgb3V0O2lmKG5vZGVjcnlwdG8mJihvdXQ9bm9kZWNyeXB0by5yYW5kb21CeXRlcykpe291dD1vdXQod2lkdGgpfWVsc2V7b3V0PW5ldyBVaW50OEFycmF5KHdpZHRoKTsoZ2xvYmFsLmNyeXB0b3x8Z2xvYmFsLm1zQ3J5cHRvKS5nZXRSYW5kb21WYWx1ZXMob3V0KX1yZXR1cm4gdG9zdHJpbmcob3V0KX1jYXRjaChlKXt2YXIgYnJvd3Nlcj1nbG9iYWwubmF2aWdhdG9yLHBsdWdpbnM9YnJvd3NlciYmYnJvd3Nlci5wbHVnaW5zO3JldHVyblsrbmV3IERhdGUsZ2xvYmFsLHBsdWdpbnMsZ2xvYmFsLnNjcmVlbix0b3N0cmluZyhwb29sKV19fWZ1bmN0aW9uIHRvc3RyaW5nKGEpe3JldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KDAsYSl9bWl4a2V5KG1hdGgucmFuZG9tKCkscG9vbCk7aWYodHlwZW9mIG1vZHVsZT09Im9iamVjdCImJm1vZHVsZS5leHBvcnRzKXttb2R1bGUuZXhwb3J0cz1zZWVkcmFuZG9tO3RyeXtub2RlY3J5cHRvPXJlcXVpcmUoImNyeXB0byIpfWNhdGNoKGV4KXt9fWVsc2UgaWYodHlwZW9mIGRlZmluZT09ImZ1bmN0aW9uIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIHNlZWRyYW5kb219KX1lbHNle21hdGhbInNlZWQiK3JuZ25hbWVdPXNlZWRyYW5kb219fSkoW10sTWF0aCl9LHtjcnlwdG86MjZ9XSw5MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjtmdW5jdGlvbiBIYXNoKGJsb2NrU2l6ZSxmaW5hbFNpemUpe3RoaXMuX2Jsb2NrPUJ1ZmZlci5hbGxvYyhibG9ja1NpemUpO3RoaXMuX2ZpbmFsU2l6ZT1maW5hbFNpemU7dGhpcy5fYmxvY2tTaXplPWJsb2NrU2l6ZTt0aGlzLl9sZW49MH1IYXNoLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oZGF0YSxlbmMpe2lmKHR5cGVvZiBkYXRhPT09InN0cmluZyIpe2VuYz1lbmN8fCJ1dGY4IjtkYXRhPUJ1ZmZlci5mcm9tKGRhdGEsZW5jKX12YXIgYmxvY2s9dGhpcy5fYmxvY2s7dmFyIGJsb2NrU2l6ZT10aGlzLl9ibG9ja1NpemU7dmFyIGxlbmd0aD1kYXRhLmxlbmd0aDt2YXIgYWNjdW09dGhpcy5fbGVuO2Zvcih2YXIgb2Zmc2V0PTA7b2Zmc2V0PGxlbmd0aDspe3ZhciBhc3NpZ25lZD1hY2N1bSVibG9ja1NpemU7dmFyIHJlbWFpbmRlcj1NYXRoLm1pbihsZW5ndGgtb2Zmc2V0LGJsb2NrU2l6ZS1hc3NpZ25lZCk7Zm9yKHZhciBpPTA7aTxyZW1haW5kZXI7aSsrKXtibG9ja1thc3NpZ25lZCtpXT1kYXRhW29mZnNldCtpXX1hY2N1bSs9cmVtYWluZGVyO29mZnNldCs9cmVtYWluZGVyO2lmKGFjY3VtJWJsb2NrU2l6ZT09PTApe3RoaXMuX3VwZGF0ZShibG9jayl9fXRoaXMuX2xlbis9bGVuZ3RoO3JldHVybiB0aGlzfTtIYXNoLnByb3RvdHlwZS5kaWdlc3Q9ZnVuY3Rpb24oZW5jKXt2YXIgcmVtPXRoaXMuX2xlbiV0aGlzLl9ibG9ja1NpemU7dGhpcy5fYmxvY2tbcmVtXT0xMjg7dGhpcy5fYmxvY2suZmlsbCgwLHJlbSsxKTtpZihyZW0+PXRoaXMuX2ZpbmFsU2l6ZSl7dGhpcy5fdXBkYXRlKHRoaXMuX2Jsb2NrKTt0aGlzLl9ibG9jay5maWxsKDApfXZhciBiaXRzPXRoaXMuX2xlbio4O2lmKGJpdHM8PTQyOTQ5NjcyOTUpe3RoaXMuX2Jsb2NrLndyaXRlVUludDMyQkUoYml0cyx0aGlzLl9ibG9ja1NpemUtNCl9ZWxzZXt2YXIgbG93Qml0cz0oYml0cyY0Mjk0OTY3Mjk1KT4+PjA7dmFyIGhpZ2hCaXRzPShiaXRzLWxvd0JpdHMpLzQyOTQ5NjcyOTY7dGhpcy5fYmxvY2sud3JpdGVVSW50MzJCRShoaWdoQml0cyx0aGlzLl9ibG9ja1NpemUtOCk7dGhpcy5fYmxvY2sud3JpdGVVSW50MzJCRShsb3dCaXRzLHRoaXMuX2Jsb2NrU2l6ZS00KX10aGlzLl91cGRhdGUodGhpcy5fYmxvY2spO3ZhciBoYXNoPXRoaXMuX2hhc2goKTtyZXR1cm4gZW5jP2hhc2gudG9TdHJpbmcoZW5jKTpoYXNofTtIYXNoLnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKCJfdXBkYXRlIG11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MiKX07bW9kdWxlLmV4cG9ydHM9SGFzaH0seyJzYWZlLWJ1ZmZlciI6ODJ9XSw5NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gU0hBKGFsZ29yaXRobSl7YWxnb3JpdGhtPWFsZ29yaXRobS50b0xvd2VyQ2FzZSgpO3ZhciBBbGdvcml0aG09ZXhwb3J0c1thbGdvcml0aG1dO2lmKCFBbGdvcml0aG0pdGhyb3cgbmV3IEVycm9yKGFsZ29yaXRobSsiIGlzIG5vdCBzdXBwb3J0ZWQgKHdlIGFjY2VwdCBwdWxsIHJlcXVlc3RzKSIpO3JldHVybiBuZXcgQWxnb3JpdGhtfTtleHBvcnRzLnNoYT1yZXF1aXJlKCIuL3NoYSIpO2V4cG9ydHMuc2hhMT1yZXF1aXJlKCIuL3NoYTEiKTtleHBvcnRzLnNoYTIyND1yZXF1aXJlKCIuL3NoYTIyNCIpO2V4cG9ydHMuc2hhMjU2PXJlcXVpcmUoIi4vc2hhMjU2Iik7ZXhwb3J0cy5zaGEzODQ9cmVxdWlyZSgiLi9zaGEzODQiKTtleHBvcnRzLnNoYTUxMj1yZXF1aXJlKCIuL3NoYTUxMiIpfSx7Ii4vc2hhIjo5NSwiLi9zaGExIjo5NiwiLi9zaGEyMjQiOjk3LCIuL3NoYTI1NiI6OTgsIi4vc2hhMzg0Ijo5OSwiLi9zaGE1MTIiOjEwMH1dLDk1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBLPVsxNTE4NTAwMjQ5LDE4NTk3NzUzOTMsMjQwMDk1OTcwOHwwLDMzOTU0Njk3ODJ8MF07dmFyIFc9bmV3IEFycmF5KDgwKTtmdW5jdGlvbiBTaGEoKXt0aGlzLmluaXQoKTt0aGlzLl93PVc7SGFzaC5jYWxsKHRoaXMsNjQsNTYpfWluaGVyaXRzKFNoYSxIYXNoKTtTaGEucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLl9hPTE3MzI1ODQxOTM7dGhpcy5fYj00MDIzMjMzNDE3O3RoaXMuX2M9MjU2MjM4MzEwMjt0aGlzLl9kPTI3MTczMzg3ODt0aGlzLl9lPTMyODUzNzc1MjA7cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIHJvdGw1KG51bSl7cmV0dXJuIG51bTw8NXxudW0+Pj4yN31mdW5jdGlvbiByb3RsMzAobnVtKXtyZXR1cm4gbnVtPDwzMHxudW0+Pj4yfWZ1bmN0aW9uIGZ0KHMsYixjLGQpe2lmKHM9PT0wKXJldHVybiBiJmN8fmImZDtpZihzPT09MilyZXR1cm4gYiZjfGImZHxjJmQ7cmV0dXJuIGJeY15kfVNoYS5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihNKXt2YXIgVz10aGlzLl93O3ZhciBhPXRoaXMuX2F8MDt2YXIgYj10aGlzLl9ifDA7dmFyIGM9dGhpcy5fY3wwO3ZhciBkPXRoaXMuX2R8MDt2YXIgZT10aGlzLl9lfDA7Zm9yKHZhciBpPTA7aTwxNjsrK2kpV1tpXT1NLnJlYWRJbnQzMkJFKGkqNCk7Zm9yKDtpPDgwOysraSlXW2ldPVdbaS0zXV5XW2ktOF1eV1tpLTE0XV5XW2ktMTZdO2Zvcih2YXIgaj0wO2o8ODA7KytqKXt2YXIgcz1+fihqLzIwKTt2YXIgdD1yb3RsNShhKStmdChzLGIsYyxkKStlK1dbal0rS1tzXXwwO2U9ZDtkPWM7Yz1yb3RsMzAoYik7Yj1hO2E9dH10aGlzLl9hPWErdGhpcy5fYXwwO3RoaXMuX2I9Yit0aGlzLl9ifDA7dGhpcy5fYz1jK3RoaXMuX2N8MDt0aGlzLl9kPWQrdGhpcy5fZHwwO3RoaXMuX2U9ZSt0aGlzLl9lfDB9O1NoYS5wcm90b3R5cGUuX2hhc2g9ZnVuY3Rpb24oKXt2YXIgSD1CdWZmZXIuYWxsb2NVbnNhZmUoMjApO0gud3JpdGVJbnQzMkJFKHRoaXMuX2F8MCwwKTtILndyaXRlSW50MzJCRSh0aGlzLl9ifDAsNCk7SC53cml0ZUludDMyQkUodGhpcy5fY3wwLDgpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2R8MCwxMik7SC53cml0ZUludDMyQkUodGhpcy5fZXwwLDE2KTtyZXR1cm4gSH07bW9kdWxlLmV4cG9ydHM9U2hhfSx7Ii4vaGFzaCI6OTMsaW5oZXJpdHM6MzYsInNhZmUtYnVmZmVyIjo4Mn1dLDk2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBLPVsxNTE4NTAwMjQ5LDE4NTk3NzUzOTMsMjQwMDk1OTcwOHwwLDMzOTU0Njk3ODJ8MF07dmFyIFc9bmV3IEFycmF5KDgwKTtmdW5jdGlvbiBTaGExKCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDY0LDU2KX1pbmhlcml0cyhTaGExLEhhc2gpO1NoYTEucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLl9hPTE3MzI1ODQxOTM7dGhpcy5fYj00MDIzMjMzNDE3O3RoaXMuX2M9MjU2MjM4MzEwMjt0aGlzLl9kPTI3MTczMzg3ODt0aGlzLl9lPTMyODUzNzc1MjA7cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIHJvdGwxKG51bSl7cmV0dXJuIG51bTw8MXxudW0+Pj4zMX1mdW5jdGlvbiByb3RsNShudW0pe3JldHVybiBudW08PDV8bnVtPj4+Mjd9ZnVuY3Rpb24gcm90bDMwKG51bSl7cmV0dXJuIG51bTw8MzB8bnVtPj4+Mn1mdW5jdGlvbiBmdChzLGIsYyxkKXtpZihzPT09MClyZXR1cm4gYiZjfH5iJmQ7aWYocz09PTIpcmV0dXJuIGImY3xiJmR8YyZkO3JldHVybiBiXmNeZH1TaGExLnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKE0pe3ZhciBXPXRoaXMuX3c7dmFyIGE9dGhpcy5fYXwwO3ZhciBiPXRoaXMuX2J8MDt2YXIgYz10aGlzLl9jfDA7dmFyIGQ9dGhpcy5fZHwwO3ZhciBlPXRoaXMuX2V8MDtmb3IodmFyIGk9MDtpPDE2OysraSlXW2ldPU0ucmVhZEludDMyQkUoaSo0KTtmb3IoO2k8ODA7KytpKVdbaV09cm90bDEoV1tpLTNdXldbaS04XV5XW2ktMTRdXldbaS0xNl0pO2Zvcih2YXIgaj0wO2o8ODA7KytqKXt2YXIgcz1+fihqLzIwKTt2YXIgdD1yb3RsNShhKStmdChzLGIsYyxkKStlK1dbal0rS1tzXXwwO2U9ZDtkPWM7Yz1yb3RsMzAoYik7Yj1hO2E9dH10aGlzLl9hPWErdGhpcy5fYXwwO3RoaXMuX2I9Yit0aGlzLl9ifDA7dGhpcy5fYz1jK3RoaXMuX2N8MDt0aGlzLl9kPWQrdGhpcy5fZHwwO3RoaXMuX2U9ZSt0aGlzLl9lfDB9O1NoYTEucHJvdG90eXBlLl9oYXNoPWZ1bmN0aW9uKCl7dmFyIEg9QnVmZmVyLmFsbG9jVW5zYWZlKDIwKTtILndyaXRlSW50MzJCRSh0aGlzLl9hfDAsMCk7SC53cml0ZUludDMyQkUodGhpcy5fYnwwLDQpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2N8MCw4KTtILndyaXRlSW50MzJCRSh0aGlzLl9kfDAsMTIpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2V8MCwxNik7cmV0dXJuIEh9O21vZHVsZS5leHBvcnRzPVNoYTF9LHsiLi9oYXNoIjo5Myxpbmhlcml0czozNiwic2FmZS1idWZmZXIiOjgyfV0sOTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBTaGEyNTY9cmVxdWlyZSgiLi9zaGEyNTYiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBXPW5ldyBBcnJheSg2NCk7ZnVuY3Rpb24gU2hhMjI0KCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDY0LDU2KX1pbmhlcml0cyhTaGEyMjQsU2hhMjU2KTtTaGEyMjQucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLl9hPTMyMzgzNzEwMzI7dGhpcy5fYj05MTQxNTA2NjM7dGhpcy5fYz04MTI3MDI5OTk7dGhpcy5fZD00MTQ0OTEyNjk3O3RoaXMuX2U9NDI5MDc3NTg1Nzt0aGlzLl9mPTE3NTA2MDMwMjU7dGhpcy5fZz0xNjk0MDc2ODM5O3RoaXMuX2g9MzIwNDA3NTQyODtyZXR1cm4gdGhpc307U2hhMjI0LnByb3RvdHlwZS5faGFzaD1mdW5jdGlvbigpe3ZhciBIPUJ1ZmZlci5hbGxvY1Vuc2FmZSgyOCk7SC53cml0ZUludDMyQkUodGhpcy5fYSwwKTtILndyaXRlSW50MzJCRSh0aGlzLl9iLDQpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2MsOCk7SC53cml0ZUludDMyQkUodGhpcy5fZCwxMik7SC53cml0ZUludDMyQkUodGhpcy5fZSwxNik7SC53cml0ZUludDMyQkUodGhpcy5fZiwyMCk7SC53cml0ZUludDMyQkUodGhpcy5fZywyNCk7cmV0dXJuIEh9O21vZHVsZS5leHBvcnRzPVNoYTIyNH0seyIuL2hhc2giOjkzLCIuL3NoYTI1NiI6OTgsaW5oZXJpdHM6MzYsInNhZmUtYnVmZmVyIjo4Mn1dLDk4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBLPVsxMTE2MzUyNDA4LDE4OTk0NDc0NDEsMzA0OTMyMzQ3MSwzOTIxMDA5NTczLDk2MTk4NzE2MywxNTA4OTcwOTkzLDI0NTM2MzU3NDgsMjg3MDc2MzIyMSwzNjI0MzgxMDgwLDMxMDU5ODQwMSw2MDcyMjUyNzgsMTQyNjg4MTk4NywxOTI1MDc4Mzg4LDIxNjIwNzgyMDYsMjYxNDg4ODEwMywzMjQ4MjIyNTgwLDM4MzUzOTA0MDEsNDAyMjIyNDc3NCwyNjQzNDcwNzgsNjA0ODA3NjI4LDc3MDI1NTk4MywxMjQ5MTUwMTIyLDE1NTUwODE2OTIsMTk5NjA2NDk4NiwyNTU0MjIwODgyLDI4MjE4MzQzNDksMjk1Mjk5NjgwOCwzMjEwMzEzNjcxLDMzMzY1NzE4OTEsMzU4NDUyODcxMSwxMTM5MjY5OTMsMzM4MjQxODk1LDY2NjMwNzIwNSw3NzM1Mjk5MTIsMTI5NDc1NzM3MiwxMzk2MTgyMjkxLDE2OTUxODM3MDAsMTk4NjY2MTA1MSwyMTc3MDI2MzUwLDI0NTY5NTYwMzcsMjczMDQ4NTkyMSwyODIwMzAyNDExLDMyNTk3MzA4MDAsMzM0NTc2NDc3MSwzNTE2MDY1ODE3LDM2MDAzNTI4MDQsNDA5NDU3MTkwOSwyNzU0MjMzNDQsNDMwMjI3NzM0LDUwNjk0ODYxNiw2NTkwNjA1NTYsODgzOTk3ODc3LDk1ODEzOTU3MSwxMzIyODIyMjE4LDE1MzcwMDIwNjMsMTc0Nzg3Mzc3OSwxOTU1NTYyMjIyLDIwMjQxMDQ4MTUsMjIyNzczMDQ1MiwyMzYxODUyNDI0LDI0Mjg0MzY0NzQsMjc1NjczNDE4NywzMjA0MDMxNDc5LDMzMjkzMjUyOThdO3ZhciBXPW5ldyBBcnJheSg2NCk7ZnVuY3Rpb24gU2hhMjU2KCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDY0LDU2KX1pbmhlcml0cyhTaGEyNTYsSGFzaCk7U2hhMjU2LnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dGhpcy5fYT0xNzc5MDMzNzAzO3RoaXMuX2I9MzE0NDEzNDI3Nzt0aGlzLl9jPTEwMTM5MDQyNDI7dGhpcy5fZD0yNzczNDgwNzYyO3RoaXMuX2U9MTM1OTg5MzExOTt0aGlzLl9mPTI2MDA4MjI5MjQ7dGhpcy5fZz01Mjg3MzQ2MzU7dGhpcy5faD0xNTQxNDU5MjI1O3JldHVybiB0aGlzfTtmdW5jdGlvbiBjaCh4LHkseil7cmV0dXJuIHpeeCYoeV56KX1mdW5jdGlvbiBtYWooeCx5LHope3JldHVybiB4Jnl8eiYoeHx5KX1mdW5jdGlvbiBzaWdtYTAoeCl7cmV0dXJuKHg+Pj4yfHg8PDMwKV4oeD4+PjEzfHg8PDE5KV4oeD4+PjIyfHg8PDEwKX1mdW5jdGlvbiBzaWdtYTEoeCl7cmV0dXJuKHg+Pj42fHg8PDI2KV4oeD4+PjExfHg8PDIxKV4oeD4+PjI1fHg8PDcpfWZ1bmN0aW9uIGdhbW1hMCh4KXtyZXR1cm4oeD4+Pjd8eDw8MjUpXih4Pj4+MTh8eDw8MTQpXng+Pj4zfWZ1bmN0aW9uIGdhbW1hMSh4KXtyZXR1cm4oeD4+PjE3fHg8PDE1KV4oeD4+PjE5fHg8PDEzKV54Pj4+MTB9U2hhMjU2LnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKE0pe3ZhciBXPXRoaXMuX3c7dmFyIGE9dGhpcy5fYXwwO3ZhciBiPXRoaXMuX2J8MDt2YXIgYz10aGlzLl9jfDA7dmFyIGQ9dGhpcy5fZHwwO3ZhciBlPXRoaXMuX2V8MDt2YXIgZj10aGlzLl9mfDA7dmFyIGc9dGhpcy5fZ3wwO3ZhciBoPXRoaXMuX2h8MDtmb3IodmFyIGk9MDtpPDE2OysraSlXW2ldPU0ucmVhZEludDMyQkUoaSo0KTtmb3IoO2k8NjQ7KytpKVdbaV09Z2FtbWExKFdbaS0yXSkrV1tpLTddK2dhbW1hMChXW2ktMTVdKStXW2ktMTZdfDA7Zm9yKHZhciBqPTA7ajw2NDsrK2ope3ZhciBUMT1oK3NpZ21hMShlKStjaChlLGYsZykrS1tqXStXW2pdfDA7dmFyIFQyPXNpZ21hMChhKSttYWooYSxiLGMpfDA7aD1nO2c9ZjtmPWU7ZT1kK1QxfDA7ZD1jO2M9YjtiPWE7YT1UMStUMnwwfXRoaXMuX2E9YSt0aGlzLl9hfDA7dGhpcy5fYj1iK3RoaXMuX2J8MDt0aGlzLl9jPWMrdGhpcy5fY3wwO3RoaXMuX2Q9ZCt0aGlzLl9kfDA7dGhpcy5fZT1lK3RoaXMuX2V8MDt0aGlzLl9mPWYrdGhpcy5fZnwwO3RoaXMuX2c9Zyt0aGlzLl9nfDA7dGhpcy5faD1oK3RoaXMuX2h8MH07U2hhMjU2LnByb3RvdHlwZS5faGFzaD1mdW5jdGlvbigpe3ZhciBIPUJ1ZmZlci5hbGxvY1Vuc2FmZSgzMik7SC53cml0ZUludDMyQkUodGhpcy5fYSwwKTtILndyaXRlSW50MzJCRSh0aGlzLl9iLDQpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2MsOCk7SC53cml0ZUludDMyQkUodGhpcy5fZCwxMik7SC53cml0ZUludDMyQkUodGhpcy5fZSwxNik7SC53cml0ZUludDMyQkUodGhpcy5fZiwyMCk7SC53cml0ZUludDMyQkUodGhpcy5fZywyNCk7SC53cml0ZUludDMyQkUodGhpcy5faCwyOCk7cmV0dXJuIEh9O21vZHVsZS5leHBvcnRzPVNoYTI1Nn0seyIuL2hhc2giOjkzLGluaGVyaXRzOjM2LCJzYWZlLWJ1ZmZlciI6ODJ9XSw5OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIFNIQTUxMj1yZXF1aXJlKCIuL3NoYTUxMiIpO3ZhciBIYXNoPXJlcXVpcmUoIi4vaGFzaCIpO3ZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7dmFyIFc9bmV3IEFycmF5KDE2MCk7ZnVuY3Rpb24gU2hhMzg0KCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDEyOCwxMTIpfWluaGVyaXRzKFNoYTM4NCxTSEE1MTIpO1NoYTM4NC5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3RoaXMuX2FoPTM0MTgwNzAzNjU7dGhpcy5fYmg9MTY1NDI3MDI1MDt0aGlzLl9jaD0yNDM4NTI5MzcwO3RoaXMuX2RoPTM1NTQ2MjM2MDt0aGlzLl9laD0xNzMxNDA1NDE1O3RoaXMuX2ZoPTIzOTQxODAyMzE7dGhpcy5fZ2g9MzY3NTAwODUyNTt0aGlzLl9oaD0xMjAzMDYyODEzO3RoaXMuX2FsPTMyMzgzNzEwMzI7dGhpcy5fYmw9OTE0MTUwNjYzO3RoaXMuX2NsPTgxMjcwMjk5OTt0aGlzLl9kbD00MTQ0OTEyNjk3O3RoaXMuX2VsPTQyOTA3NzU4NTc7dGhpcy5fZmw9MTc1MDYwMzAyNTt0aGlzLl9nbD0xNjk0MDc2ODM5O3RoaXMuX2hsPTMyMDQwNzU0Mjg7cmV0dXJuIHRoaXN9O1NoYTM4NC5wcm90b3R5cGUuX2hhc2g9ZnVuY3Rpb24oKXt2YXIgSD1CdWZmZXIuYWxsb2NVbnNhZmUoNDgpO2Z1bmN0aW9uIHdyaXRlSW50NjRCRShoLGwsb2Zmc2V0KXtILndyaXRlSW50MzJCRShoLG9mZnNldCk7SC53cml0ZUludDMyQkUobCxvZmZzZXQrNCl9d3JpdGVJbnQ2NEJFKHRoaXMuX2FoLHRoaXMuX2FsLDApO3dyaXRlSW50NjRCRSh0aGlzLl9iaCx0aGlzLl9ibCw4KTt3cml0ZUludDY0QkUodGhpcy5fY2gsdGhpcy5fY2wsMTYpO3dyaXRlSW50NjRCRSh0aGlzLl9kaCx0aGlzLl9kbCwyNCk7d3JpdGVJbnQ2NEJFKHRoaXMuX2VoLHRoaXMuX2VsLDMyKTt3cml0ZUludDY0QkUodGhpcy5fZmgsdGhpcy5fZmwsNDApO3JldHVybiBIfTttb2R1bGUuZXhwb3J0cz1TaGEzODR9LHsiLi9oYXNoIjo5MywiLi9zaGE1MTIiOjEwMCxpbmhlcml0czozNiwic2FmZS1idWZmZXIiOjgyfV0sMTAwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBLPVsxMTE2MzUyNDA4LDM2MDk3Njc0NTgsMTg5OTQ0NzQ0MSw2MDI4OTE3MjUsMzA0OTMyMzQ3MSwzOTY0NDg0Mzk5LDM5MjEwMDk1NzMsMjE3MzI5NTU0OCw5NjE5ODcxNjMsNDA4MTYyODQ3MiwxNTA4OTcwOTkzLDMwNTM4MzQyNjUsMjQ1MzYzNTc0OCwyOTM3NjcxNTc5LDI4NzA3NjMyMjEsMzY2NDYwOTU2MCwzNjI0MzgxMDgwLDI3MzQ4ODMzOTQsMzEwNTk4NDAxLDExNjQ5OTY1NDIsNjA3MjI1Mjc4LDEzMjM2MTA3NjQsMTQyNjg4MTk4NywzNTkwMzA0OTk0LDE5MjUwNzgzODgsNDA2ODE4MjM4MywyMTYyMDc4MjA2LDk5MTMzNjExMywyNjE0ODg4MTAzLDYzMzgwMzMxNywzMjQ4MjIyNTgwLDM0Nzk3NzQ4NjgsMzgzNTM5MDQwMSwyNjY2NjEzNDU4LDQwMjIyMjQ3NzQsOTQ0NzExMTM5LDI2NDM0NzA3OCwyMzQxMjYyNzczLDYwNDgwNzYyOCwyMDA3ODAwOTMzLDc3MDI1NTk4MywxNDk1OTkwOTAxLDEyNDkxNTAxMjIsMTg1NjQzMTIzNSwxNTU1MDgxNjkyLDMxNzUyMTgxMzIsMTk5NjA2NDk4NiwyMTk4OTUwODM3LDI1NTQyMjA4ODIsMzk5OTcxOTMzOSwyODIxODM0MzQ5LDc2Njc4NDAxNiwyOTUyOTk2ODA4LDI1NjY1OTQ4NzksMzIxMDMxMzY3MSwzMjAzMzM3OTU2LDMzMzY1NzE4OTEsMTAzNDQ1NzAyNiwzNTg0NTI4NzExLDI0NjY5NDg5MDEsMTEzOTI2OTkzLDM3NTgzMjYzODMsMzM4MjQxODk1LDE2ODcxNzkzNiw2NjYzMDcyMDUsMTE4ODE3OTk2NCw3NzM1Mjk5MTIsMTU0NjA0NTczNCwxMjk0NzU3MzcyLDE1MjI4MDU0ODUsMTM5NjE4MjI5MSwyNjQzODMzODIzLDE2OTUxODM3MDAsMjM0MzUyNzM5MCwxOTg2NjYxMDUxLDEwMTQ0Nzc0ODAsMjE3NzAyNjM1MCwxMjA2NzU5MTQyLDI0NTY5NTYwMzcsMzQ0MDc3NjI3LDI3MzA0ODU5MjEsMTI5MDg2MzQ2MCwyODIwMzAyNDExLDMxNTg0NTQyNzMsMzI1OTczMDgwMCwzNTA1OTUyNjU3LDMzNDU3NjQ3NzEsMTA2MjE3MDA4LDM1MTYwNjU4MTcsMzYwNjAwODM0NCwzNjAwMzUyODA0LDE0MzI3MjU3NzYsNDA5NDU3MTkwOSwxNDY3MDMxNTk0LDI3NTQyMzM0NCw4NTExNjk3MjAsNDMwMjI3NzM0LDMxMDA4MjM3NTIsNTA2OTQ4NjE2LDEzNjMyNTgxOTUsNjU5MDYwNTU2LDM3NTA2ODU1OTMsODgzOTk3ODc3LDM3ODUwNTAyODAsOTU4MTM5NTcxLDMzMTgzMDc0MjcsMTMyMjgyMjIxOCwzODEyNzIzNDAzLDE1MzcwMDIwNjMsMjAwMzAzNDk5NSwxNzQ3ODczNzc5LDM2MDIwMzY4OTksMTk1NTU2MjIyMiwxNTc1OTkwMDEyLDIwMjQxMDQ4MTUsMTEyNTU5MjkyOCwyMjI3NzMwNDUyLDI3MTY5MDQzMDYsMjM2MTg1MjQyNCw0NDI3NzYwNDQsMjQyODQzNjQ3NCw1OTM2OTgzNDQsMjc1NjczNDE4NywzNzMzMTEwMjQ5LDMyMDQwMzE0NzksMjk5OTM1MTU3MywzMzI5MzI1Mjk4LDM4MTU5MjA0MjcsMzM5MTU2OTYxNCwzOTI4MzgzOTAwLDM1MTUyNjcyNzEsNTY2MjgwNzExLDM5NDAxODc2MDYsMzQ1NDA2OTUzNCw0MTE4NjMwMjcxLDQwMDAyMzk5OTIsMTE2NDE4NDc0LDE5MTQxMzg1NTQsMTc0MjkyNDIxLDI3MzEwNTUyNzAsMjg5MzgwMzU2LDMyMDM5OTMwMDYsNDYwMzkzMjY5LDMyMDYyMDMxNSw2ODU0NzE3MzMsNTg3NDk2ODM2LDg1MjE0Mjk3MSwxMDg2NzkyODUxLDEwMTcwMzYyOTgsMzY1NTQzMTAwLDExMjYwMDA1ODAsMjYxODI5NzY3NiwxMjg4MDMzNDcwLDM0MDk4NTUxNTgsMTUwMTUwNTk0OCw0MjM0NTA5ODY2LDE2MDcxNjc5MTUsOTg3MTY3NDY4LDE4MTY0MDIzMTYsMTI0NjE4OTU5MV07dmFyIFc9bmV3IEFycmF5KDE2MCk7ZnVuY3Rpb24gU2hhNTEyKCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDEyOCwxMTIpfWluaGVyaXRzKFNoYTUxMixIYXNoKTtTaGE1MTIucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLl9haD0xNzc5MDMzNzAzO3RoaXMuX2JoPTMxNDQxMzQyNzc7dGhpcy5fY2g9MTAxMzkwNDI0Mjt0aGlzLl9kaD0yNzczNDgwNzYyO3RoaXMuX2VoPTEzNTk4OTMxMTk7dGhpcy5fZmg9MjYwMDgyMjkyNDt0aGlzLl9naD01Mjg3MzQ2MzU7dGhpcy5faGg9MTU0MTQ1OTIyNTt0aGlzLl9hbD00MDg5MjM1NzIwO3RoaXMuX2JsPTIyMjc4NzM1OTU7dGhpcy5fY2w9NDI3MTE3NTcyMzt0aGlzLl9kbD0xNTk1NzUwMTI5O3RoaXMuX2VsPTI5MTc1NjUxMzc7dGhpcy5fZmw9NzI1NTExMTk5O3RoaXMuX2dsPTQyMTUzODk1NDc7dGhpcy5faGw9MzI3MDMzMjA5O3JldHVybiB0aGlzfTtmdW5jdGlvbiBDaCh4LHkseil7cmV0dXJuIHpeeCYoeV56KX1mdW5jdGlvbiBtYWooeCx5LHope3JldHVybiB4Jnl8eiYoeHx5KX1mdW5jdGlvbiBzaWdtYTAoeCx4bCl7cmV0dXJuKHg+Pj4yOHx4bDw8NCleKHhsPj4+Mnx4PDwzMCleKHhsPj4+N3x4PDwyNSl9ZnVuY3Rpb24gc2lnbWExKHgseGwpe3JldHVybih4Pj4+MTR8eGw8PDE4KV4oeD4+PjE4fHhsPDwxNCleKHhsPj4+OXx4PDwyMyl9ZnVuY3Rpb24gR2FtbWEwKHgseGwpe3JldHVybih4Pj4+MXx4bDw8MzEpXih4Pj4+OHx4bDw8MjQpXng+Pj43fWZ1bmN0aW9uIEdhbW1hMGwoeCx4bCl7cmV0dXJuKHg+Pj4xfHhsPDwzMSleKHg+Pj44fHhsPDwyNCleKHg+Pj43fHhsPDwyNSl9ZnVuY3Rpb24gR2FtbWExKHgseGwpe3JldHVybih4Pj4+MTl8eGw8PDEzKV4oeGw+Pj4yOXx4PDwzKV54Pj4+Nn1mdW5jdGlvbiBHYW1tYTFsKHgseGwpe3JldHVybih4Pj4+MTl8eGw8PDEzKV4oeGw+Pj4yOXx4PDwzKV4oeD4+PjZ8eGw8PDI2KX1mdW5jdGlvbiBnZXRDYXJyeShhLGIpe3JldHVybiBhPj4+MDxiPj4+MD8xOjB9U2hhNTEyLnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKE0pe3ZhciBXPXRoaXMuX3c7dmFyIGFoPXRoaXMuX2FofDA7dmFyIGJoPXRoaXMuX2JofDA7dmFyIGNoPXRoaXMuX2NofDA7dmFyIGRoPXRoaXMuX2RofDA7dmFyIGVoPXRoaXMuX2VofDA7dmFyIGZoPXRoaXMuX2ZofDA7dmFyIGdoPXRoaXMuX2dofDA7dmFyIGhoPXRoaXMuX2hofDA7dmFyIGFsPXRoaXMuX2FsfDA7dmFyIGJsPXRoaXMuX2JsfDA7dmFyIGNsPXRoaXMuX2NsfDA7dmFyIGRsPXRoaXMuX2RsfDA7dmFyIGVsPXRoaXMuX2VsfDA7dmFyIGZsPXRoaXMuX2ZsfDA7dmFyIGdsPXRoaXMuX2dsfDA7dmFyIGhsPXRoaXMuX2hsfDA7Zm9yKHZhciBpPTA7aTwzMjtpKz0yKXtXW2ldPU0ucmVhZEludDMyQkUoaSo0KTtXW2krMV09TS5yZWFkSW50MzJCRShpKjQrNCl9Zm9yKDtpPDE2MDtpKz0yKXt2YXIgeGg9V1tpLTE1KjJdO3ZhciB4bD1XW2ktMTUqMisxXTt2YXIgZ2FtbWEwPUdhbW1hMCh4aCx4bCk7dmFyIGdhbW1hMGw9R2FtbWEwbCh4bCx4aCk7eGg9V1tpLTIqMl07eGw9V1tpLTIqMisxXTt2YXIgZ2FtbWExPUdhbW1hMSh4aCx4bCk7dmFyIGdhbW1hMWw9R2FtbWExbCh4bCx4aCk7dmFyIFdpN2g9V1tpLTcqMl07dmFyIFdpN2w9V1tpLTcqMisxXTt2YXIgV2kxNmg9V1tpLTE2KjJdO3ZhciBXaTE2bD1XW2ktMTYqMisxXTt2YXIgV2lsPWdhbW1hMGwrV2k3bHwwO3ZhciBXaWg9Z2FtbWEwK1dpN2grZ2V0Q2FycnkoV2lsLGdhbW1hMGwpfDA7V2lsPVdpbCtnYW1tYTFsfDA7V2loPVdpaCtnYW1tYTErZ2V0Q2FycnkoV2lsLGdhbW1hMWwpfDA7V2lsPVdpbCtXaTE2bHwwO1dpaD1XaWgrV2kxNmgrZ2V0Q2FycnkoV2lsLFdpMTZsKXwwO1dbaV09V2loO1dbaSsxXT1XaWx9Zm9yKHZhciBqPTA7ajwxNjA7ais9Mil7V2loPVdbal07V2lsPVdbaisxXTt2YXIgbWFqaD1tYWooYWgsYmgsY2gpO3ZhciBtYWpsPW1haihhbCxibCxjbCk7dmFyIHNpZ21hMGg9c2lnbWEwKGFoLGFsKTt2YXIgc2lnbWEwbD1zaWdtYTAoYWwsYWgpO3ZhciBzaWdtYTFoPXNpZ21hMShlaCxlbCk7dmFyIHNpZ21hMWw9c2lnbWExKGVsLGVoKTt2YXIgS2loPUtbal07dmFyIEtpbD1LW2orMV07dmFyIGNoaD1DaChlaCxmaCxnaCk7dmFyIGNobD1DaChlbCxmbCxnbCk7dmFyIHQxbD1obCtzaWdtYTFsfDA7dmFyIHQxaD1oaCtzaWdtYTFoK2dldENhcnJ5KHQxbCxobCl8MDt0MWw9dDFsK2NobHwwO3QxaD10MWgrY2hoK2dldENhcnJ5KHQxbCxjaGwpfDA7dDFsPXQxbCtLaWx8MDt0MWg9dDFoK0tpaCtnZXRDYXJyeSh0MWwsS2lsKXwwO3QxbD10MWwrV2lsfDA7dDFoPXQxaCtXaWgrZ2V0Q2FycnkodDFsLFdpbCl8MDt2YXIgdDJsPXNpZ21hMGwrbWFqbHwwO3ZhciB0Mmg9c2lnbWEwaCttYWpoK2dldENhcnJ5KHQybCxzaWdtYTBsKXwwO2hoPWdoO2hsPWdsO2doPWZoO2dsPWZsO2ZoPWVoO2ZsPWVsO2VsPWRsK3QxbHwwO2VoPWRoK3QxaCtnZXRDYXJyeShlbCxkbCl8MDtkaD1jaDtkbD1jbDtjaD1iaDtjbD1ibDtiaD1haDtibD1hbDthbD10MWwrdDJsfDA7YWg9dDFoK3QyaCtnZXRDYXJyeShhbCx0MWwpfDB9dGhpcy5fYWw9dGhpcy5fYWwrYWx8MDt0aGlzLl9ibD10aGlzLl9ibCtibHwwO3RoaXMuX2NsPXRoaXMuX2NsK2NsfDA7dGhpcy5fZGw9dGhpcy5fZGwrZGx8MDt0aGlzLl9lbD10aGlzLl9lbCtlbHwwO3RoaXMuX2ZsPXRoaXMuX2ZsK2ZsfDA7dGhpcy5fZ2w9dGhpcy5fZ2wrZ2x8MDt0aGlzLl9obD10aGlzLl9obCtobHwwO3RoaXMuX2FoPXRoaXMuX2FoK2FoK2dldENhcnJ5KHRoaXMuX2FsLGFsKXwwO3RoaXMuX2JoPXRoaXMuX2JoK2JoK2dldENhcnJ5KHRoaXMuX2JsLGJsKXwwO3RoaXMuX2NoPXRoaXMuX2NoK2NoK2dldENhcnJ5KHRoaXMuX2NsLGNsKXwwO3RoaXMuX2RoPXRoaXMuX2RoK2RoK2dldENhcnJ5KHRoaXMuX2RsLGRsKXwwO3RoaXMuX2VoPXRoaXMuX2VoK2VoK2dldENhcnJ5KHRoaXMuX2VsLGVsKXwwO3RoaXMuX2ZoPXRoaXMuX2ZoK2ZoK2dldENhcnJ5KHRoaXMuX2ZsLGZsKXwwO3RoaXMuX2doPXRoaXMuX2doK2doK2dldENhcnJ5KHRoaXMuX2dsLGdsKXwwO3RoaXMuX2hoPXRoaXMuX2hoK2hoK2dldENhcnJ5KHRoaXMuX2hsLGhsKXwwfTtTaGE1MTIucHJvdG90eXBlLl9oYXNoPWZ1bmN0aW9uKCl7dmFyIEg9QnVmZmVyLmFsbG9jVW5zYWZlKDY0KTtmdW5jdGlvbiB3cml0ZUludDY0QkUoaCxsLG9mZnNldCl7SC53cml0ZUludDMyQkUoaCxvZmZzZXQpO0gud3JpdGVJbnQzMkJFKGwsb2Zmc2V0KzQpfXdyaXRlSW50NjRCRSh0aGlzLl9haCx0aGlzLl9hbCwwKTt3cml0ZUludDY0QkUodGhpcy5fYmgsdGhpcy5fYmwsOCk7d3JpdGVJbnQ2NEJFKHRoaXMuX2NoLHRoaXMuX2NsLDE2KTt3cml0ZUludDY0QkUodGhpcy5fZGgsdGhpcy5fZGwsMjQpO3dyaXRlSW50NjRCRSh0aGlzLl9laCx0aGlzLl9lbCwzMik7d3JpdGVJbnQ2NEJFKHRoaXMuX2ZoLHRoaXMuX2ZsLDQwKTt3cml0ZUludDY0QkUodGhpcy5fZ2gsdGhpcy5fZ2wsNDgpO3dyaXRlSW50NjRCRSh0aGlzLl9oaCx0aGlzLl9obCw1Nik7cmV0dXJuIEh9O21vZHVsZS5leHBvcnRzPVNoYTUxMn0seyIuL2hhc2giOjkzLGluaGVyaXRzOjM2LCJzYWZlLWJ1ZmZlciI6ODJ9XSwxMDE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPVN0cmVhbTt2YXIgRUU9cmVxdWlyZSgiZXZlbnRzIikuRXZlbnRFbWl0dGVyO3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO2luaGVyaXRzKFN0cmVhbSxFRSk7U3RyZWFtLlJlYWRhYmxlPXJlcXVpcmUoInJlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qcyIpO1N0cmVhbS5Xcml0YWJsZT1yZXF1aXJlKCJyZWFkYWJsZS1zdHJlYW0vd3JpdGFibGUuanMiKTtTdHJlYW0uRHVwbGV4PXJlcXVpcmUoInJlYWRhYmxlLXN0cmVhbS9kdXBsZXguanMiKTtTdHJlYW0uVHJhbnNmb3JtPXJlcXVpcmUoInJlYWRhYmxlLXN0cmVhbS90cmFuc2Zvcm0uanMiKTtTdHJlYW0uUGFzc1Rocm91Z2g9cmVxdWlyZSgicmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzIik7U3RyZWFtLlN0cmVhbT1TdHJlYW07ZnVuY3Rpb24gU3RyZWFtKCl7RUUuY2FsbCh0aGlzKX1TdHJlYW0ucHJvdG90eXBlLnBpcGU9ZnVuY3Rpb24oZGVzdCxvcHRpb25zKXt2YXIgc291cmNlPXRoaXM7ZnVuY3Rpb24gb25kYXRhKGNodW5rKXtpZihkZXN0LndyaXRhYmxlKXtpZihmYWxzZT09PWRlc3Qud3JpdGUoY2h1bmspJiZzb3VyY2UucGF1c2Upe3NvdXJjZS5wYXVzZSgpfX19c291cmNlLm9uKCJkYXRhIixvbmRhdGEpO2Z1bmN0aW9uIG9uZHJhaW4oKXtpZihzb3VyY2UucmVhZGFibGUmJnNvdXJjZS5yZXN1bWUpe3NvdXJjZS5yZXN1bWUoKX19ZGVzdC5vbigiZHJhaW4iLG9uZHJhaW4pO2lmKCFkZXN0Ll9pc1N0ZGlvJiYoIW9wdGlvbnN8fG9wdGlvbnMuZW5kIT09ZmFsc2UpKXtzb3VyY2Uub24oImVuZCIsb25lbmQpO3NvdXJjZS5vbigiY2xvc2UiLG9uY2xvc2UpfXZhciBkaWRPbkVuZD1mYWxzZTtmdW5jdGlvbiBvbmVuZCgpe2lmKGRpZE9uRW5kKXJldHVybjtkaWRPbkVuZD10cnVlO2Rlc3QuZW5kKCl9ZnVuY3Rpb24gb25jbG9zZSgpe2lmKGRpZE9uRW5kKXJldHVybjtkaWRPbkVuZD10cnVlO2lmKHR5cGVvZiBkZXN0LmRlc3Ryb3k9PT0iZnVuY3Rpb24iKWRlc3QuZGVzdHJveSgpfWZ1bmN0aW9uIG9uZXJyb3IoZXIpe2NsZWFudXAoKTtpZihFRS5saXN0ZW5lckNvdW50KHRoaXMsImVycm9yIik9PT0wKXt0aHJvdyBlcn19c291cmNlLm9uKCJlcnJvciIsb25lcnJvcik7ZGVzdC5vbigiZXJyb3IiLG9uZXJyb3IpO2Z1bmN0aW9uIGNsZWFudXAoKXtzb3VyY2UucmVtb3ZlTGlzdGVuZXIoImRhdGEiLG9uZGF0YSk7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZHJhaW4iLG9uZHJhaW4pO3NvdXJjZS5yZW1vdmVMaXN0ZW5lcigiZW5kIixvbmVuZCk7c291cmNlLnJlbW92ZUxpc3RlbmVyKCJjbG9zZSIsb25jbG9zZSk7c291cmNlLnJlbW92ZUxpc3RlbmVyKCJlcnJvciIsb25lcnJvcik7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZXJyb3IiLG9uZXJyb3IpO3NvdXJjZS5yZW1vdmVMaXN0ZW5lcigiZW5kIixjbGVhbnVwKTtzb3VyY2UucmVtb3ZlTGlzdGVuZXIoImNsb3NlIixjbGVhbnVwKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJjbG9zZSIsY2xlYW51cCl9c291cmNlLm9uKCJlbmQiLGNsZWFudXApO3NvdXJjZS5vbigiY2xvc2UiLGNsZWFudXApO2Rlc3Qub24oImNsb3NlIixjbGVhbnVwKTtkZXN0LmVtaXQoInBpcGUiLHNvdXJjZSk7cmV0dXJuIGRlc3R9fSx7ZXZlbnRzOjMzLGluaGVyaXRzOjM2LCJyZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzIjo2NywicmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzIjo3NywicmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLmpzIjo3OCwicmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybS5qcyI6NzksInJlYWRhYmxlLXN0cmVhbS93cml0YWJsZS5qcyI6ODB9XSwxMDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBpc0VuY29kaW5nPUJ1ZmZlci5pc0VuY29kaW5nfHxmdW5jdGlvbihlbmNvZGluZyl7ZW5jb2Rpbmc9IiIrZW5jb2Rpbmc7c3dpdGNoKGVuY29kaW5nJiZlbmNvZGluZy50b0xvd2VyQ2FzZSgpKXtjYXNlImhleCI6Y2FzZSJ1dGY4IjpjYXNlInV0Zi04IjpjYXNlImFzY2lpIjpjYXNlImJpbmFyeSI6Y2FzZSJiYXNlNjQiOmNhc2UidWNzMiI6Y2FzZSJ1Y3MtMiI6Y2FzZSJ1dGYxNmxlIjpjYXNlInV0Zi0xNmxlIjpjYXNlInJhdyI6cmV0dXJuIHRydWU7ZGVmYXVsdDpyZXR1cm4gZmFsc2V9fTtmdW5jdGlvbiBfbm9ybWFsaXplRW5jb2RpbmcoZW5jKXtpZighZW5jKXJldHVybiJ1dGY4Ijt2YXIgcmV0cmllZDt3aGlsZSh0cnVlKXtzd2l0Y2goZW5jKXtjYXNlInV0ZjgiOmNhc2UidXRmLTgiOnJldHVybiJ1dGY4IjtjYXNlInVjczIiOmNhc2UidWNzLTIiOmNhc2UidXRmMTZsZSI6Y2FzZSJ1dGYtMTZsZSI6cmV0dXJuInV0ZjE2bGUiO2Nhc2UibGF0aW4xIjpjYXNlImJpbmFyeSI6cmV0dXJuImxhdGluMSI7Y2FzZSJiYXNlNjQiOmNhc2UiYXNjaWkiOmNhc2UiaGV4IjpyZXR1cm4gZW5jO2RlZmF1bHQ6aWYocmV0cmllZClyZXR1cm47ZW5jPSgiIitlbmMpLnRvTG93ZXJDYXNlKCk7cmV0cmllZD10cnVlfX19ZnVuY3Rpb24gbm9ybWFsaXplRW5jb2RpbmcoZW5jKXt2YXIgbmVuYz1fbm9ybWFsaXplRW5jb2RpbmcoZW5jKTtpZih0eXBlb2YgbmVuYyE9PSJzdHJpbmciJiYoQnVmZmVyLmlzRW5jb2Rpbmc9PT1pc0VuY29kaW5nfHwhaXNFbmNvZGluZyhlbmMpKSl0aHJvdyBuZXcgRXJyb3IoIlVua25vd24gZW5jb2Rpbmc6ICIrZW5jKTtyZXR1cm4gbmVuY3x8ZW5jfWV4cG9ydHMuU3RyaW5nRGVjb2Rlcj1TdHJpbmdEZWNvZGVyO2Z1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2Rpbmcpe3RoaXMuZW5jb2Rpbmc9bm9ybWFsaXplRW5jb2RpbmcoZW5jb2RpbmcpO3ZhciBuYjtzd2l0Y2godGhpcy5lbmNvZGluZyl7Y2FzZSJ1dGYxNmxlIjp0aGlzLnRleHQ9dXRmMTZUZXh0O3RoaXMuZW5kPXV0ZjE2RW5kO25iPTQ7YnJlYWs7Y2FzZSJ1dGY4Ijp0aGlzLmZpbGxMYXN0PXV0ZjhGaWxsTGFzdDtuYj00O2JyZWFrO2Nhc2UiYmFzZTY0Ijp0aGlzLnRleHQ9YmFzZTY0VGV4dDt0aGlzLmVuZD1iYXNlNjRFbmQ7bmI9MzticmVhaztkZWZhdWx0OnRoaXMud3JpdGU9c2ltcGxlV3JpdGU7dGhpcy5lbmQ9c2ltcGxlRW5kO3JldHVybn10aGlzLmxhc3ROZWVkPTA7dGhpcy5sYXN0VG90YWw9MDt0aGlzLmxhc3RDaGFyPUJ1ZmZlci5hbGxvY1Vuc2FmZShuYil9U3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24oYnVmKXtpZihidWYubGVuZ3RoPT09MClyZXR1cm4iIjt2YXIgcjt2YXIgaTtpZih0aGlzLmxhc3ROZWVkKXtyPXRoaXMuZmlsbExhc3QoYnVmKTtpZihyPT09dW5kZWZpbmVkKXJldHVybiIiO2k9dGhpcy5sYXN0TmVlZDt0aGlzLmxhc3ROZWVkPTB9ZWxzZXtpPTB9aWYoaTxidWYubGVuZ3RoKXJldHVybiByP3IrdGhpcy50ZXh0KGJ1ZixpKTp0aGlzLnRleHQoYnVmLGkpO3JldHVybiByfHwiIn07U3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kPXV0ZjhFbmQ7U3RyaW5nRGVjb2Rlci5wcm90b3R5cGUudGV4dD11dGY4VGV4dDtTdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5maWxsTGFzdD1mdW5jdGlvbihidWYpe2lmKHRoaXMubGFzdE5lZWQ8PWJ1Zi5sZW5ndGgpe2J1Zi5jb3B5KHRoaXMubGFzdENoYXIsdGhpcy5sYXN0VG90YWwtdGhpcy5sYXN0TmVlZCwwLHRoaXMubGFzdE5lZWQpO3JldHVybiB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsMCx0aGlzLmxhc3RUb3RhbCl9YnVmLmNvcHkodGhpcy5sYXN0Q2hhcix0aGlzLmxhc3RUb3RhbC10aGlzLmxhc3ROZWVkLDAsYnVmLmxlbmd0aCk7dGhpcy5sYXN0TmVlZC09YnVmLmxlbmd0aH07ZnVuY3Rpb24gdXRmOENoZWNrQnl0ZShieXRlKXtpZihieXRlPD0xMjcpcmV0dXJuIDA7ZWxzZSBpZihieXRlPj41PT09NilyZXR1cm4gMjtlbHNlIGlmKGJ5dGU+PjQ9PT0xNClyZXR1cm4gMztlbHNlIGlmKGJ5dGU+PjM9PT0zMClyZXR1cm4gNDtyZXR1cm4gYnl0ZT4+Nj09PTI/LTE6LTJ9ZnVuY3Rpb24gdXRmOENoZWNrSW5jb21wbGV0ZShzZWxmLGJ1ZixpKXt2YXIgaj1idWYubGVuZ3RoLTE7aWYoajxpKXJldHVybiAwO3ZhciBuYj11dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7aWYobmI+PTApe2lmKG5iPjApc2VsZi5sYXN0TmVlZD1uYi0xO3JldHVybiBuYn1pZigtLWo8aXx8bmI9PT0tMilyZXR1cm4gMDtuYj11dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7aWYobmI+PTApe2lmKG5iPjApc2VsZi5sYXN0TmVlZD1uYi0yO3JldHVybiBuYn1pZigtLWo8aXx8bmI9PT0tMilyZXR1cm4gMDtuYj11dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7aWYobmI+PTApe2lmKG5iPjApe2lmKG5iPT09MiluYj0wO2Vsc2Ugc2VsZi5sYXN0TmVlZD1uYi0zfXJldHVybiBuYn1yZXR1cm4gMH1mdW5jdGlvbiB1dGY4Q2hlY2tFeHRyYUJ5dGVzKHNlbGYsYnVmLHApe2lmKChidWZbMF0mMTkyKSE9PTEyOCl7c2VsZi5sYXN0TmVlZD0wO3JldHVybiLvv70ifWlmKHNlbGYubGFzdE5lZWQ+MSYmYnVmLmxlbmd0aD4xKXtpZigoYnVmWzFdJjE5MikhPT0xMjgpe3NlbGYubGFzdE5lZWQ9MTtyZXR1cm4i77+9In1pZihzZWxmLmxhc3ROZWVkPjImJmJ1Zi5sZW5ndGg+Mil7aWYoKGJ1ZlsyXSYxOTIpIT09MTI4KXtzZWxmLmxhc3ROZWVkPTI7cmV0dXJuIu+/vSJ9fX19ZnVuY3Rpb24gdXRmOEZpbGxMYXN0KGJ1Zil7dmFyIHA9dGhpcy5sYXN0VG90YWwtdGhpcy5sYXN0TmVlZDt2YXIgcj11dGY4Q2hlY2tFeHRyYUJ5dGVzKHRoaXMsYnVmLHApO2lmKHIhPT11bmRlZmluZWQpcmV0dXJuIHI7aWYodGhpcy5sYXN0TmVlZDw9YnVmLmxlbmd0aCl7YnVmLmNvcHkodGhpcy5sYXN0Q2hhcixwLDAsdGhpcy5sYXN0TmVlZCk7cmV0dXJuIHRoaXMubGFzdENoYXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywwLHRoaXMubGFzdFRvdGFsKX1idWYuY29weSh0aGlzLmxhc3RDaGFyLHAsMCxidWYubGVuZ3RoKTt0aGlzLmxhc3ROZWVkLT1idWYubGVuZ3RofWZ1bmN0aW9uIHV0ZjhUZXh0KGJ1ZixpKXt2YXIgdG90YWw9dXRmOENoZWNrSW5jb21wbGV0ZSh0aGlzLGJ1ZixpKTtpZighdGhpcy5sYXN0TmVlZClyZXR1cm4gYnVmLnRvU3RyaW5nKCJ1dGY4IixpKTt0aGlzLmxhc3RUb3RhbD10b3RhbDt2YXIgZW5kPWJ1Zi5sZW5ndGgtKHRvdGFsLXRoaXMubGFzdE5lZWQpO2J1Zi5jb3B5KHRoaXMubGFzdENoYXIsMCxlbmQpO3JldHVybiBidWYudG9TdHJpbmcoInV0ZjgiLGksZW5kKX1mdW5jdGlvbiB1dGY4RW5kKGJ1Zil7dmFyIHI9YnVmJiZidWYubGVuZ3RoP3RoaXMud3JpdGUoYnVmKToiIjtpZih0aGlzLmxhc3ROZWVkKXJldHVybiByKyLvv70iO3JldHVybiByfWZ1bmN0aW9uIHV0ZjE2VGV4dChidWYsaSl7aWYoKGJ1Zi5sZW5ndGgtaSklMj09PTApe3ZhciByPWJ1Zi50b1N0cmluZygidXRmMTZsZSIsaSk7aWYocil7dmFyIGM9ci5jaGFyQ29kZUF0KHIubGVuZ3RoLTEpO2lmKGM+PTU1Mjk2JiZjPD01NjMxOSl7dGhpcy5sYXN0TmVlZD0yO3RoaXMubGFzdFRvdGFsPTQ7dGhpcy5sYXN0Q2hhclswXT1idWZbYnVmLmxlbmd0aC0yXTt0aGlzLmxhc3RDaGFyWzFdPWJ1ZltidWYubGVuZ3RoLTFdO3JldHVybiByLnNsaWNlKDAsLTEpfX1yZXR1cm4gcn10aGlzLmxhc3ROZWVkPTE7dGhpcy5sYXN0VG90YWw9Mjt0aGlzLmxhc3RDaGFyWzBdPWJ1ZltidWYubGVuZ3RoLTFdO3JldHVybiBidWYudG9TdHJpbmcoInV0ZjE2bGUiLGksYnVmLmxlbmd0aC0xKX1mdW5jdGlvbiB1dGYxNkVuZChidWYpe3ZhciByPWJ1ZiYmYnVmLmxlbmd0aD90aGlzLndyaXRlKGJ1Zik6IiI7aWYodGhpcy5sYXN0TmVlZCl7dmFyIGVuZD10aGlzLmxhc3RUb3RhbC10aGlzLmxhc3ROZWVkO3JldHVybiByK3RoaXMubGFzdENoYXIudG9TdHJpbmcoInV0ZjE2bGUiLDAsZW5kKX1yZXR1cm4gcn1mdW5jdGlvbiBiYXNlNjRUZXh0KGJ1ZixpKXt2YXIgbj0oYnVmLmxlbmd0aC1pKSUzO2lmKG49PT0wKXJldHVybiBidWYudG9TdHJpbmcoImJhc2U2NCIsaSk7dGhpcy5sYXN0TmVlZD0zLW47dGhpcy5sYXN0VG90YWw9MztpZihuPT09MSl7dGhpcy5sYXN0Q2hhclswXT1idWZbYnVmLmxlbmd0aC0xXX1lbHNle3RoaXMubGFzdENoYXJbMF09YnVmW2J1Zi5sZW5ndGgtMl07dGhpcy5sYXN0Q2hhclsxXT1idWZbYnVmLmxlbmd0aC0xXX1yZXR1cm4gYnVmLnRvU3RyaW5nKCJiYXNlNjQiLGksYnVmLmxlbmd0aC1uKX1mdW5jdGlvbiBiYXNlNjRFbmQoYnVmKXt2YXIgcj1idWYmJmJ1Zi5sZW5ndGg/dGhpcy53cml0ZShidWYpOiIiO2lmKHRoaXMubGFzdE5lZWQpcmV0dXJuIHIrdGhpcy5sYXN0Q2hhci50b1N0cmluZygiYmFzZTY0IiwwLDMtdGhpcy5sYXN0TmVlZCk7cmV0dXJuIHJ9ZnVuY3Rpb24gc2ltcGxlV3JpdGUoYnVmKXtyZXR1cm4gYnVmLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpfWZ1bmN0aW9uIHNpbXBsZUVuZChidWYpe3JldHVybiBidWYmJmJ1Zi5sZW5ndGg/dGhpcy53cml0ZShidWYpOiIifX0seyJzYWZlLWJ1ZmZlciI6MTAzfV0sMTAzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXthcmd1bWVudHNbNF1bNzZdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKX0se2J1ZmZlcjoyNyxkdXA6NzZ9XSwxMDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihzZXRJbW1lZGlhdGUsY2xlYXJJbW1lZGlhdGUpe3ZhciBuZXh0VGljaz1yZXF1aXJlKCJwcm9jZXNzL2Jyb3dzZXIuanMiKS5uZXh0VGljazt2YXIgYXBwbHk9RnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O3ZhciBzbGljZT1BcnJheS5wcm90b3R5cGUuc2xpY2U7dmFyIGltbWVkaWF0ZUlkcz17fTt2YXIgbmV4dEltbWVkaWF0ZUlkPTA7ZXhwb3J0cy5zZXRUaW1lb3V0PWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCx3aW5kb3csYXJndW1lbnRzKSxjbGVhclRpbWVvdXQpfTtleHBvcnRzLnNldEludGVydmFsPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsd2luZG93LGFyZ3VtZW50cyksY2xlYXJJbnRlcnZhbCl9O2V4cG9ydHMuY2xlYXJUaW1lb3V0PWV4cG9ydHMuY2xlYXJJbnRlcnZhbD1mdW5jdGlvbih0aW1lb3V0KXt0aW1lb3V0LmNsb3NlKCl9O2Z1bmN0aW9uIFRpbWVvdXQoaWQsY2xlYXJGbil7dGhpcy5faWQ9aWQ7dGhpcy5fY2xlYXJGbj1jbGVhckZufVRpbWVvdXQucHJvdG90eXBlLnVucmVmPVRpbWVvdXQucHJvdG90eXBlLnJlZj1mdW5jdGlvbigpe307VGltZW91dC5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXt0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LHRoaXMuX2lkKX07ZXhwb3J0cy5lbnJvbGw9ZnVuY3Rpb24oaXRlbSxtc2Vjcyl7Y2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO2l0ZW0uX2lkbGVUaW1lb3V0PW1zZWNzfTtleHBvcnRzLnVuZW5yb2xsPWZ1bmN0aW9uKGl0ZW0pe2NsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtpdGVtLl9pZGxlVGltZW91dD0tMX07ZXhwb3J0cy5fdW5yZWZBY3RpdmU9ZXhwb3J0cy5hY3RpdmU9ZnVuY3Rpb24oaXRlbSl7Y2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO3ZhciBtc2Vjcz1pdGVtLl9pZGxlVGltZW91dDtpZihtc2Vjcz49MCl7aXRlbS5faWRsZVRpbWVvdXRJZD1zZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpe2lmKGl0ZW0uX29uVGltZW91dClpdGVtLl9vblRpbWVvdXQoKX0sbXNlY3MpfX07ZXhwb3J0cy5zZXRJbW1lZGlhdGU9dHlwZW9mIHNldEltbWVkaWF0ZT09PSJmdW5jdGlvbiI/c2V0SW1tZWRpYXRlOmZ1bmN0aW9uKGZuKXt2YXIgaWQ9bmV4dEltbWVkaWF0ZUlkKys7dmFyIGFyZ3M9YXJndW1lbnRzLmxlbmd0aDwyP2ZhbHNlOnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO2ltbWVkaWF0ZUlkc1tpZF09dHJ1ZTtuZXh0VGljayhmdW5jdGlvbiBvbk5leHRUaWNrKCl7aWYoaW1tZWRpYXRlSWRzW2lkXSl7aWYoYXJncyl7Zm4uYXBwbHkobnVsbCxhcmdzKX1lbHNle2ZuLmNhbGwobnVsbCl9ZXhwb3J0cy5jbGVhckltbWVkaWF0ZShpZCl9fSk7cmV0dXJuIGlkfTtleHBvcnRzLmNsZWFySW1tZWRpYXRlPXR5cGVvZiBjbGVhckltbWVkaWF0ZT09PSJmdW5jdGlvbiI/Y2xlYXJJbW1lZGlhdGU6ZnVuY3Rpb24oaWQpe2RlbGV0ZSBpbW1lZGlhdGVJZHNbaWRdfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJ0aW1lcnMiKS5zZXRJbW1lZGlhdGUscmVxdWlyZSgidGltZXJzIikuY2xlYXJJbW1lZGlhdGUpfSx7InByb2Nlc3MvYnJvd3Nlci5qcyI6NjYsdGltZXJzOjEwNH1dLDEwNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCl7bW9kdWxlLmV4cG9ydHM9ZGVwcmVjYXRlO2Z1bmN0aW9uIGRlcHJlY2F0ZShmbixtc2cpe2lmKGNvbmZpZygibm9EZXByZWNhdGlvbiIpKXtyZXR1cm4gZm59dmFyIHdhcm5lZD1mYWxzZTtmdW5jdGlvbiBkZXByZWNhdGVkKCl7aWYoIXdhcm5lZCl7aWYoY29uZmlnKCJ0aHJvd0RlcHJlY2F0aW9uIikpe3Rocm93IG5ldyBFcnJvcihtc2cpfWVsc2UgaWYoY29uZmlnKCJ0cmFjZURlcHJlY2F0aW9uIikpe2NvbnNvbGUudHJhY2UobXNnKX1lbHNle2NvbnNvbGUud2Fybihtc2cpfXdhcm5lZD10cnVlfXJldHVybiBmbi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9cmV0dXJuIGRlcHJlY2F0ZWR9ZnVuY3Rpb24gY29uZmlnKG5hbWUpe3RyeXtpZighZ2xvYmFsLmxvY2FsU3RvcmFnZSlyZXR1cm4gZmFsc2V9Y2F0Y2goXyl7cmV0dXJuIGZhbHNlfXZhciB2YWw9Z2xvYmFsLmxvY2FsU3RvcmFnZVtuYW1lXTtpZihudWxsPT12YWwpcmV0dXJuIGZhbHNlO3JldHVybiBTdHJpbmcodmFsKS50b0xvd2VyQ2FzZSgpPT09InRydWUifX0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsIT09InVuZGVmaW5lZCI/Z2xvYmFsOnR5cGVvZiBzZWxmIT09InVuZGVmaW5lZCI/c2VsZjp0eXBlb2Ygd2luZG93IT09InVuZGVmaW5lZCI/d2luZG93Ont9KX0se31dfSx7fSxbMl0pOw==","base64").toString("utf8");
})();
var __cryptoLib;
eval(bundle_source);
__export(require("../sync/types"));
__export(require("./serializer"));
var toBuffer_1 = require("../sync/utils/toBuffer");
exports.toBuffer = toBuffer_1.toBuffer;
var isMultithreadingEnabled = (function () {
    switch (environnement_1.environnement.type) {
        case "BROWSER": return (typeof Worker !== "undefined" &&
            typeof URL !== "undefined" &&
            typeof Blob !== "undefined");
        case "LIQUID CORE": return false;
        case "NODE": return true;
    }
})();
function disableMultithreading() {
    isMultithreadingEnabled = false;
}
exports.disableMultithreading = disableMultithreading;
var WorkerThreadId;
(function (WorkerThreadId) {
    function generate() {
        return { "type": "WORKER THREAD ID" };
    }
    WorkerThreadId.generate = generate;
})(WorkerThreadId = exports.WorkerThreadId || (exports.WorkerThreadId = {}));
var _a = (function () {
    var spawn = WorkerThread_1.WorkerThread.factory(bundle_source, function () { return isMultithreadingEnabled; });
    var map = new Map_1.Polyfill();
    return [
        function (workerThreadId) {
            var workerThread = map.get(workerThreadId);
            if (workerThread === undefined) {
                workerThread = spawn();
                map.set(workerThreadId, workerThread);
            }
            return workerThread;
        },
        function (workerThreadId) {
            var match = workerThreadId === undefined ?
                (function () { return true; })
                :
                    (function (o) { return o === workerThreadId; });
            for (var _i = 0, _a = Array.from(map.keys()); _i < _a.length; _i++) {
                var workerThreadId_1 = _a[_i];
                if (!match(workerThreadId_1)) {
                    continue;
                }
                map.get(workerThreadId_1).terminate();
                map.delete(workerThreadId_1);
            }
        },
        function () { return Array.from(map.keys()); }
    ];
})(), getWorkerThread = _a[0], terminateWorkerThreads = _a[1], listWorkerThreadIds = _a[2];
exports.terminateWorkerThreads = terminateWorkerThreads;
function preSpawnWorkerThread(workerThreadId) {
    getWorkerThread(workerThreadId);
}
exports.preSpawnWorkerThread = preSpawnWorkerThread;
var workerThreadPool;
(function (workerThreadPool) {
    var Id;
    (function (Id) {
        function generate() {
            return { "type": "WORKER THREAD POOL ID" };
        }
        Id.generate = generate;
    })(Id = workerThreadPool.Id || (workerThreadPool.Id = {}));
    var map = new Map_1.Polyfill();
    function preSpawn(workerThreadPoolId, poolSize) {
        if (!map.has(workerThreadPoolId)) {
            map.set(workerThreadPoolId, new Set_1.Polyfill());
        }
        for (var i = 1; i <= poolSize; i++) {
            var workerThreadId = WorkerThreadId.generate();
            map.get(workerThreadPoolId).add(workerThreadId);
            preSpawnWorkerThread(workerThreadId);
        }
    }
    workerThreadPool.preSpawn = preSpawn;
    function listIds(workerThreadPoolId) {
        var set = map.get(workerThreadPoolId) || new Set_1.Polyfill();
        return listWorkerThreadIds()
            .filter(function (workerThreadId) { return set.has(workerThreadId); });
    }
    workerThreadPool.listIds = listIds;
    function terminate(workerThreadPoolId) {
        for (var _i = 0, _a = listIds(workerThreadPoolId); _i < _a.length; _i++) {
            var workerThreadId = _a[_i];
            terminateWorkerThreads(workerThreadId);
        }
    }
    workerThreadPool.terminate = terminate;
})(workerThreadPool = exports.workerThreadPool || (exports.workerThreadPool = {}));
var getCounter = (function () {
    var counter = 0;
    return function () { return counter++; };
})();
var defaultWorkerPoolIds = {
    "aes": workerThreadPool.Id.generate(),
    "plain": workerThreadPool.Id.generate(),
    "rsa": workerThreadPool.Id.generate()
};
function cipherFactoryPool(params, workerThreadPoolId) {
    var _this = this;
    if (workerThreadPoolId === undefined) {
        workerThreadPoolId = defaultWorkerPoolIds[params.cipherName];
        workerThreadPool.preSpawn(workerThreadPoolId, 4);
    }
    else if (workerThreadPool.listIds(workerThreadPoolId).length === 0) {
        throw new Error("No thread in the pool");
    }
    var runExclusiveFunctions = workerThreadPool.listIds(workerThreadPoolId)
        .map(function (workerThreadId) {
        var cipher = cipherFactoryPool.cipherFactory(params, workerThreadId);
        return runExclusive.build(function (method, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, cipher[method](data)];
        }); }); });
    });
    return (function () {
        var _a = ["encrypt", "decrypt"]
            .map(function (method) { return function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, runExclusiveFunctions
                        .map(function (runExclusiveFunction) { return [
                        runExclusive.getQueuedCallCount(runExclusiveFunction),
                        runExclusiveFunction
                    ]; })
                        .sort(function (_a, _b) {
                        var n1 = _a[0];
                        var n2 = _b[0];
                        return n1 - n2;
                    })[0][1](method, data)];
            });
        }); }; }), encrypt = _a[0], decrypt = _a[1];
        switch (params.components) {
            case "EncryptorDecryptor": return { encrypt: encrypt, decrypt: decrypt };
            case "Decryptor": return { decrypt: decrypt };
            case "Encryptor": return { encrypt: encrypt };
        }
    })();
}
(function (cipherFactoryPool) {
    function cipherFactory(params, workerThreadId) {
        var cipherInstanceRef = getCounter();
        var appWorker = getWorkerThread(workerThreadId);
        appWorker.send((function () {
            var action = __assign({ "action": "CipherFactory", cipherInstanceRef: cipherInstanceRef }, params);
            return action;
        })());
        return (function () {
            var _a = ["encrypt", "decrypt"]
                .map(function (method) { return (function (data) { return cipherFactory.encryptOrDecrypt(cipherInstanceRef, method, data, workerThreadId); }); }), encrypt = _a[0], decrypt = _a[1];
            switch (params.components) {
                case "EncryptorDecryptor": return { encrypt: encrypt, decrypt: decrypt };
                case "Decryptor": return { decrypt: decrypt };
                case "Encryptor": return { encrypt: encrypt };
            }
        })();
    }
    cipherFactoryPool.cipherFactory = cipherFactory;
    (function (cipherFactory) {
        function encryptOrDecrypt(cipherInstanceRef, method, input, workerThreadId) {
            return __awaiter(this, void 0, void 0, function () {
                var actionId, appWorker, output;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            actionId = getCounter();
                            appWorker = getWorkerThread(workerThreadId);
                            appWorker.send((function () {
                                var action = {
                                    "action": "EncryptOrDecrypt",
                                    actionId: actionId,
                                    cipherInstanceRef: cipherInstanceRef,
                                    method: method,
                                    input: input
                                };
                                return action;
                            })(), [input.buffer]);
                            return [4 /*yield*/, appWorker.evtResponse.waitFor(function (response) {
                                    return response.actionId === actionId;
                                })];
                        case 1:
                            output = (_a.sent()).output;
                            return [2 /*return*/, output];
                    }
                });
            });
        }
        cipherFactory.encryptOrDecrypt = encryptOrDecrypt;
    })(cipherFactory = cipherFactoryPool.cipherFactory || (cipherFactoryPool.cipherFactory = {}));
})(cipherFactoryPool || (cipherFactoryPool = {}));
exports.plain = (function () {
    var encryptorDecryptorFactory = function (workerThreadPoolId) {
        return cipherFactoryPool({
            "cipherName": "plain",
            "components": "EncryptorDecryptor",
            "params": []
        }, workerThreadPoolId);
    };
    return __assign({ encryptorDecryptorFactory: encryptorDecryptorFactory }, __cryptoLib.plain);
})();
exports.aes = (function () {
    var encryptorDecryptorFactory = function (key, workerThreadPoolId) {
        return cipherFactoryPool({
            "cipherName": "aes",
            "components": "EncryptorDecryptor",
            "params": [key]
        }, workerThreadPoolId);
    };
    return __assign({ encryptorDecryptorFactory: encryptorDecryptorFactory }, __cryptoLib.aes);
})();
exports.rsa = (function () {
    var encryptorFactory = function (encryptKey, workerThreadPoolId) {
        return cipherFactoryPool({
            "cipherName": "rsa",
            "components": "Encryptor",
            "params": [encryptKey]
        }, workerThreadPoolId);
    };
    var decryptorFactory = function (decryptKey, workerThreadPoolId) {
        return cipherFactoryPool({
            "cipherName": "rsa",
            "components": "Decryptor",
            "params": [decryptKey]
        }, workerThreadPoolId);
    };
    function encryptorDecryptorFactory(encryptKey, decryptKey, workerThreadPoolId) {
        return cipherFactoryPool({
            "cipherName": "rsa",
            "components": "EncryptorDecryptor",
            "params": [encryptKey, decryptKey]
        }, workerThreadPoolId);
    }
    var generateKeys = function (seed, keysLengthBytes, workerThreadId) { return __awaiter(_this, void 0, void 0, function () {
        var wasWorkerThreadIdSpecified, actionId, appWorker, outputs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wasWorkerThreadIdSpecified = workerThreadId !== undefined;
                    workerThreadId = workerThreadId !== undefined ?
                        workerThreadId :
                        WorkerThreadId.generate();
                    actionId = getCounter();
                    appWorker = getWorkerThread(workerThreadId);
                    appWorker.send((function () {
                        var action = {
                            "action": "GenerateRsaKeys",
                            actionId: actionId,
                            "params": [seed, keysLengthBytes]
                        };
                        return action;
                    })());
                    return [4 /*yield*/, appWorker.evtResponse.waitFor(function (response) {
                            return response.actionId === actionId;
                        })];
                case 1:
                    outputs = (_a.sent()).outputs;
                    if (!wasWorkerThreadIdSpecified) {
                        terminateWorkerThreads(workerThreadId);
                    }
                    return [2 /*return*/, outputs];
            }
        });
    }); };
    return __assign({ encryptorFactory: encryptorFactory,
        decryptorFactory: decryptorFactory,
        encryptorDecryptorFactory: encryptorDecryptorFactory,
        generateKeys: generateKeys }, __cryptoLib.rsa);
})();
exports.scrypt = (function () {
    var hash = function (text, salt, params, progress, workerThreadId) {
        if (params === void 0) { params = {}; }
        if (progress === void 0) { progress = (function () { }); }
        return __awaiter(_this, void 0, void 0, function () {
            var actionId, wasWorkerThreadIdSpecified, appWorker, boundTo, digest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        actionId = getCounter();
                        wasWorkerThreadIdSpecified = workerThreadId !== undefined;
                        workerThreadId = workerThreadId !== undefined ?
                            workerThreadId :
                            WorkerThreadId.generate();
                        appWorker = getWorkerThread(workerThreadId);
                        appWorker.send((function () {
                            var action = {
                                "action": "ScryptHash",
                                actionId: actionId,
                                "params": [text, salt, params]
                            };
                            return action;
                        })());
                        boundTo = {};
                        appWorker.evtResponse.attach(function (response) { return (response.actionId === actionId &&
                            "percent" in response); }, boundTo, function (_a) {
                            var percent = _a.percent;
                            return progress(percent);
                        });
                        return [4 /*yield*/, appWorker.evtResponse.waitFor(function (response) { return (response.actionId === actionId &&
                                "digest" in response); })];
                    case 1:
                        digest = (_a.sent()).digest;
                        appWorker.evtResponse.detach(boundTo);
                        if (!wasWorkerThreadIdSpecified) {
                            terminateWorkerThreads(workerThreadId);
                        }
                        return [2 /*return*/, digest];
                }
            });
        });
    };
    return __assign({ hash: hash }, __cryptoLib.scrypt);
})();

}).call(this,require("buffer").Buffer)
},{"../sync/types":33,"../sync/utils/environnement":34,"../sync/utils/toBuffer":35,"./WorkerThread":26,"./serializer":31,"buffer":25,"minimal-polyfills/dist/lib/Array.from":40,"minimal-polyfills/dist/lib/Map":41,"minimal-polyfills/dist/lib/Set":42,"path":43,"run-exclusive":45}],31:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"../sync/utils/toBuffer":35,"buffer":25,"dup":7,"transfer-tools/dist/lib/JSON_CUSTOM":48}],32:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environnement_1 = require("../utils/environnement");
var toBuffer_1 = require("../utils/toBuffer");
var transfer;
(function (transfer) {
    var SerializableUint8Array;
    (function (SerializableUint8Array) {
        function match(value) {
            return (value instanceof Object &&
                value.type === "Uint8Array" &&
                typeof value.data === "string");
        }
        SerializableUint8Array.match = match;
        function build(value) {
            return {
                "type": "Uint8Array",
                "data": toBuffer_1.toBuffer(value).toString("binary")
            };
        }
        SerializableUint8Array.build = build;
        function restore(value) {
            return Buffer.from(value.data, "binary");
        }
        SerializableUint8Array.restore = restore;
    })(SerializableUint8Array || (SerializableUint8Array = {}));
    function prepare(threadMessage) {
        if (environnement_1.environnement.type !== "NODE") {
            throw new Error("only for node");
        }
        var message = (function () {
            if (threadMessage instanceof Uint8Array) {
                return SerializableUint8Array.build(threadMessage);
            }
            else if (threadMessage instanceof Array) {
                return threadMessage.map(function (entry) { return prepare(entry); });
            }
            else if (threadMessage instanceof Object) {
                var out = {};
                for (var key in threadMessage) {
                    out[key] = prepare(threadMessage[key]);
                }
                return out;
            }
            else {
                return threadMessage;
            }
        })();
        return message;
    }
    transfer.prepare = prepare;
    function restore(message) {
        if (environnement_1.environnement.type !== "NODE") {
            throw new Error("only for node");
        }
        var threadMessage = (function () {
            if (SerializableUint8Array.match(message)) {
                return SerializableUint8Array.restore(message);
            }
            else if (message instanceof Array) {
                return message.map(function (entry) { return restore(entry); });
            }
            else if (message instanceof Object) {
                var out = {};
                for (var key in message) {
                    out[key] = restore(message[key]);
                }
                return out;
            }
            else {
                return message;
            }
        })();
        return threadMessage;
    }
    transfer.restore = restore;
})(transfer = exports.transfer || (exports.transfer = {}));

}).call(this,require("buffer").Buffer)
},{"../utils/environnement":34,"../utils/toBuffer":35,"buffer":25}],33:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toBuffer_1 = require("./utils/toBuffer");
var RsaKey;
(function (RsaKey) {
    function stringify(rsaKey) {
        return JSON.stringify([rsaKey.format, toBuffer_1.toBuffer(rsaKey.data).toString("base64")]);
    }
    RsaKey.stringify = stringify;
    function parse(stringifiedRsaKey) {
        var _a = JSON.parse(stringifiedRsaKey), format = _a[0], strData = _a[1];
        return { format: format, "data": new Uint8Array(Buffer.from(strData, "base64")) };
    }
    RsaKey.parse = parse;
    var Public;
    (function (Public) {
        function match(rsaKey) {
            return rsaKey.format === "pkcs1-public-der";
        }
        Public.match = match;
    })(Public = RsaKey.Public || (RsaKey.Public = {}));
    var Private;
    (function (Private) {
        function match(rsaKey) {
            return rsaKey.format === "pkcs1-private-der";
        }
        Private.match = match;
    })(Private = RsaKey.Private || (RsaKey.Private = {}));
})(RsaKey = exports.RsaKey || (exports.RsaKey = {}));

}).call(this,require("buffer").Buffer)
},{"./utils/toBuffer":35,"buffer":25}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environnement = (function () {
    if (typeof window !== "undefined") {
        return {
            "type": "BROWSER",
            "isMainThread": true
        };
    }
    else if (typeof self !== "undefined" && !!self.postMessage) {
        return {
            "type": "BROWSER",
            "isMainThread": false
        };
    }
    else if (typeof setTimeout === "undefined") {
        return {
            "type": "LIQUID CORE",
            "isMainThread": true
        };
    }
    else {
        //NOTE: We do not check process.send because browserify hide it.
        return {
            "type": "NODE",
            "isMainThread": undefined
        };
    }
})();

},{}],35:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"buffer":25,"dup":8}],36:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],37:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./implementation":36,"dup":10}],38:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"function-bind":37}],39:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],40:[function(require,module,exports){
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
    Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
            return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
            var number = Number(value);
            if (isNaN(number)) {
                return 0;
            }
            if (number === 0 || !isFinite(number)) {
                return number;
            }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };
        // The length property of the from method is 1.
        return function from(arrayLike /*, mapFn, thisArg */) {
            // 1. Let C be the this value.
            var C = this;
            // 2. Let items be ToObject(arrayLike).
            var items = Object(arrayLike);
            // 3. ReturnIfAbrupt(items).
            if (arrayLike == null) {
                throw new TypeError('Array.from requires an array-like object - not null or undefined');
            }
            // 4. If mapfn is undefined, then let mapping be false.
            var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
            var T;
            if (typeof mapFn !== 'undefined') {
                // 5. else
                // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                if (!isCallable(mapFn)) {
                    throw new TypeError('Array.from: when provided, the second argument must be a function');
                }
                // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }
            // 10. Let lenValue be Get(items, "length").
            // 11. Let len be ToLength(lenValue).
            var len = toLength(items.length);
            // 13. If IsConstructor(C) is true, then
            // 13. a. Let A be the result of calling the [[Construct]] internal method 
            // of C with an argument list containing the single item len.
            // 14. a. Else, Let A be ArrayCreate(len).
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);
            // 16. Let k be 0.
            var k = 0;
            // 17. Repeat, while k < len… (also steps a - h)
            var kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                }
                else {
                    A[k] = kValue;
                }
                k += 1;
            }
            // 18. Let putStatus be Put(A, "length", len, true).
            A.length = len;
            // 20. Return A.
            return A;
        };
    }());
}

},{}],41:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var LightMapImpl = /** @class */ (function () {
    function LightMapImpl() {
        this.record = [];
    }
    LightMapImpl.prototype.has = function (key) {
        return this.record
            .map(function (_a) {
            var _key = _a[0];
            return _key;
        })
            .indexOf(key) >= 0;
    };
    LightMapImpl.prototype.get = function (key) {
        var entry = this.record
            .filter(function (_a) {
            var _key = _a[0];
            return _key === key;
        })[0];
        if (entry === undefined) {
            return undefined;
        }
        return entry[1];
    };
    LightMapImpl.prototype.set = function (key, value) {
        var entry = this.record
            .filter(function (_a) {
            var _key = _a[0];
            return _key === key;
        })[0];
        if (entry === undefined) {
            this.record.push([key, value]);
        }
        else {
            entry[1] = value;
        }
        return this;
    };
    LightMapImpl.prototype["delete"] = function (key) {
        var index = this.record.map(function (_a) {
            var key = _a[0];
            return key;
        }).indexOf(key);
        if (index < 0) {
            return false;
        }
        this.record.splice(index, 1);
        return true;
    };
    LightMapImpl.prototype.keys = function () {
        return this.record.map(function (_a) {
            var key = _a[0];
            return key;
        });
    };
    return LightMapImpl;
}());
exports.Polyfill = typeof Map !== "undefined" ? Map : LightMapImpl;

},{}],42:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Map_1 = require("./Map");
var LightSetImpl = /** @class */ (function () {
    function LightSetImpl(values) {
        this.map = new Map_1.Polyfill();
        if (values === undefined) {
            return;
        }
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            this.add(value);
        }
    }
    LightSetImpl.prototype.has = function (value) {
        return this.map.has(value);
    };
    LightSetImpl.prototype.add = function (value) {
        this.map.set(value, true);
        return this;
    };
    LightSetImpl.prototype.values = function () {
        return this.map.keys();
    };
    LightSetImpl.prototype["delete"] = function (value) {
        return this.map["delete"](value);
    };
    return LightSetImpl;
}());
exports.LightSetImpl = LightSetImpl;
exports.Polyfill = typeof Set !== "undefined" ? Set : LightSetImpl;

},{"./Map":41}],43:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":44}],44:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],45:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var ExecQueue = /** @class */ (function () {
    function ExecQueue() {
        this.queuedCalls = [];
        this.isRunning = false;
        this.prComplete = Promise.resolve();
    }
    //TODO: move where it is used.
    ExecQueue.prototype.cancelAllQueuedCalls = function () {
        var n;
        this.queuedCalls.splice(0, n = this.queuedCalls.length);
        return n;
    };
    return ExecQueue;
}());
var globalContext = {};
var clusters = new WeakMap();
//console.log("Map version");
//export const clusters = new Map<Object, Map<GroupRef,ExecQueue>>();
function getOrCreateExecQueue(context, groupRef) {
    var execQueueByGroup = clusters.get(context);
    if (!execQueueByGroup) {
        execQueueByGroup = new WeakMap();
        clusters.set(context, execQueueByGroup);
    }
    var execQueue = execQueueByGroup.get(groupRef);
    if (!execQueue) {
        execQueue = new ExecQueue();
        execQueueByGroup.set(groupRef, execQueue);
    }
    return execQueue;
}
function createGroupRef() {
    return new Array(0);
}
exports.createGroupRef = createGroupRef;
function build() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    switch (inputs.length) {
        case 1: return buildFnPromise(true, createGroupRef(), inputs[0]);
        case 2: return buildFnPromise(true, inputs[0], inputs[1]);
    }
}
exports.build = build;
function buildMethod() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    switch (inputs.length) {
        case 1: return buildFnPromise(false, createGroupRef(), inputs[0]);
        case 2: return buildFnPromise(false, inputs[0], inputs[1]);
    }
}
exports.buildMethod = buildMethod;
/**
 *
 * Get the number of queued call of a run-exclusive function.
 * Note that if you call a runExclusive function and call this
 * directly after it will return 0 as there is one function call
 * running but 0 queued.
 *
 * The classInstanceObject parameter is to provide only for the run-exclusive
 * function created with 'buildMethod[Cb].
 *
 * */
function getQueuedCallCount(runExclusiveFunction, classInstanceObject) {
    var execQueue = getExecQueueByFunctionAndContext(runExclusiveFunction, classInstanceObject);
    return execQueue ? execQueue.queuedCalls.length : 0;
}
exports.getQueuedCallCount = getQueuedCallCount;
/**
 *
 * Cancel all queued calls of a run-exclusive function.
 * Note that the current running call will not be cancelled.
 *
 * The classInstanceObject parameter is to provide only for the run-exclusive
 * function created with 'buildMethod[Cb].
 *
 */
function cancelAllQueuedCalls(runExclusiveFunction, classInstanceObject) {
    var execQueue = getExecQueueByFunctionAndContext(runExclusiveFunction, classInstanceObject);
    return execQueue ? execQueue.cancelAllQueuedCalls() : 0;
}
exports.cancelAllQueuedCalls = cancelAllQueuedCalls;
/**
 * Tell if a run-exclusive function has an instance of it's call currently being
 * performed.
 *
 * The classInstanceObject parameter is to provide only for the run-exclusive
 * function created with 'buildMethod[Cb].
 */
function isRunning(runExclusiveFunction, classInstanceObject) {
    var execQueue = getExecQueueByFunctionAndContext(runExclusiveFunction, classInstanceObject);
    return execQueue ? execQueue.isRunning : false;
}
exports.isRunning = isRunning;
/**
 * Return a promise that resolve when all the current queued call of a runExclusive functions
 * have completed.
 *
 * The classInstanceObject parameter is to provide only for the run-exclusive
 * function created with 'buildMethod[Cb].
 */
function getPrComplete(runExclusiveFunction, classInstanceObject) {
    var execQueue = getExecQueueByFunctionAndContext(runExclusiveFunction, classInstanceObject);
    return execQueue ? execQueue.prComplete : Promise.resolve();
}
exports.getPrComplete = getPrComplete;
var groupByRunExclusiveFunction = new WeakMap();
function getExecQueueByFunctionAndContext(runExclusiveFunction, context) {
    if (context === void 0) { context = globalContext; }
    var groupRef = groupByRunExclusiveFunction.get(runExclusiveFunction);
    if (!groupRef) {
        throw Error("Not a run exclusiveFunction");
    }
    var execQueueByGroup = clusters.get(context);
    if (!execQueueByGroup) {
        return undefined;
    }
    return execQueueByGroup.get(groupRef);
}
function buildFnPromise(isGlobal, groupRef, fun) {
    var execQueue;
    var runExclusiveFunction = (function () {
        var _this = this;
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        if (!isGlobal) {
            if (!(this instanceof Object)) {
                throw new Error("Run exclusive, <this> should be an object");
            }
            execQueue = getOrCreateExecQueue(this, groupRef);
        }
        return new Promise(function (resolve, reject) {
            var onPrCompleteResolve;
            execQueue.prComplete = new Promise(function (resolve) {
                return onPrCompleteResolve = function () { return resolve(); };
            });
            var onComplete = function (result) {
                onPrCompleteResolve();
                execQueue.isRunning = false;
                if (execQueue.queuedCalls.length) {
                    execQueue.queuedCalls.shift()();
                }
                if ("data" in result) {
                    resolve(result.data);
                }
                else {
                    reject(result.reason);
                }
            };
            (function callee() {
                var _this = this;
                var inputs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    inputs[_i] = arguments[_i];
                }
                if (execQueue.isRunning) {
                    execQueue.queuedCalls.push(function () { return callee.apply(_this, inputs); });
                    return;
                }
                execQueue.isRunning = true;
                try {
                    fun.apply(this, inputs)
                        .then(function (data) { return onComplete({ data: data }); })["catch"](function (reason) { return onComplete({ reason: reason }); });
                }
                catch (error) {
                    onComplete({ "reason": error });
                }
            }).apply(_this, inputs);
        });
    });
    if (isGlobal) {
        execQueue = getOrCreateExecQueue(globalContext, groupRef);
    }
    groupByRunExclusiveFunction.set(runExclusiveFunction, groupRef);
    return runExclusiveFunction;
}
function buildCb() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    switch (inputs.length) {
        case 1: return buildFnCallback(true, createGroupRef(), inputs[0]);
        case 2: return buildFnCallback(true, inputs[0], inputs[1]);
    }
}
exports.buildCb = buildCb;
function buildMethodCb() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    switch (inputs.length) {
        case 1: return buildFnCallback(false, createGroupRef(), inputs[0]);
        case 2: return buildFnCallback(false, inputs[0], inputs[1]);
    }
}
exports.buildMethodCb = buildMethodCb;
function buildFnCallback(isGlobal, groupRef, fun) {
    var execQueue;
    var runExclusiveFunction = (function () {
        var _this = this;
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        if (!isGlobal) {
            if (!(this instanceof Object)) {
                throw new Error("Run exclusive, <this> should be an object");
            }
            execQueue = getOrCreateExecQueue(this, groupRef);
        }
        var callback = undefined;
        if (inputs.length && typeof inputs[inputs.length - 1] === "function") {
            callback = inputs.pop();
        }
        var onPrCompleteResolve;
        execQueue.prComplete = new Promise(function (resolve) {
            return onPrCompleteResolve = function () { return resolve(); };
        });
        var onComplete = function () {
            var inputs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                inputs[_i] = arguments[_i];
            }
            onPrCompleteResolve();
            execQueue.isRunning = false;
            if (execQueue.queuedCalls.length) {
                execQueue.queuedCalls.shift()();
            }
            if (callback) {
                callback.apply(_this, inputs);
            }
        };
        onComplete.hasCallback = !!callback;
        (function callee() {
            var _this = this;
            var inputs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                inputs[_i] = arguments[_i];
            }
            if (execQueue.isRunning) {
                execQueue.queuedCalls.push(function () { return callee.apply(_this, inputs); });
                return;
            }
            execQueue.isRunning = true;
            try {
                fun.apply(this, __spread(inputs, [onComplete]));
            }
            catch (error) {
                error.message += " ( This exception should not have been thrown, miss use of run-exclusive buildCb )";
                throw error;
            }
        }).apply(this, inputs);
    });
    if (isGlobal) {
        execQueue = getOrCreateExecQueue(globalContext, groupRef);
    }
    groupByRunExclusiveFunction.set(runExclusiveFunction, groupRef);
    return runExclusiveFunction;
}

},{}],46:[function(require,module,exports){
'use strict'
/* eslint no-proto: 0 */
module.exports = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties)

function setProtoOf (obj, proto) {
  obj.__proto__ = proto
  return obj
}

function mixinProperties (obj, proto) {
  for (var prop in proto) {
    if (!obj.hasOwnProperty(prop)) {
      obj[prop] = proto[prop]
    }
  }
  return obj
}

},{}],47:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12,"has":38}],48:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13,"super-json":47}],49:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var SyncEventBase_1 = require("./SyncEventBase");
var SyncEvent = /** @class */ (function (_super) {
    __extends(SyncEvent, _super);
    function SyncEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.evtAttach = new SyncEventBase_1.SyncEventBase();
        return _this;
    }
    SyncEvent.prototype.addHandler = function (attachParams, implicitAttachParams) {
        var handler = _super.prototype.addHandler.call(this, attachParams, implicitAttachParams);
        this.evtAttach.post(handler);
        return handler;
    };
    return SyncEvent;
}(SyncEventBase_1.SyncEventBase));
exports.SyncEvent = SyncEvent;
var VoidSyncEvent = /** @class */ (function (_super) {
    __extends(VoidSyncEvent, _super);
    function VoidSyncEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VoidSyncEvent.prototype.post = function () {
        return _super.prototype.post.call(this, undefined);
    };
    return VoidSyncEvent;
}(SyncEvent));
exports.VoidSyncEvent = VoidSyncEvent;

},{"./SyncEventBase":50}],50:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var SyncEventBaseProtected_1 = require("./SyncEventBaseProtected");
function matchPostable(o) {
    return o instanceof Object && typeof o.post === "function";
}
function isCallable(o) {
    if (typeof o !== "function")
        return false;
    var prototype = o["prototype"];
    if (!prototype)
        return true;
    var methods = Object.getOwnPropertyNames(prototype);
    if (methods.length !== 1)
        return false;
    var name = o.name;
    if (!name)
        return true;
    if (name[0].toUpperCase() === name[0])
        return false;
    return true;
}
/** SyncEvent without evtAttach property */
var SyncEventBase = /** @class */ (function (_super) {
    __extends(SyncEventBase, _super);
    function SyncEventBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultParams = {
            "matcher": function matchAll() { return true; },
            "boundTo": _this,
            "timeout": undefined,
            "callback": undefined
        };
        return _this;
    }
    SyncEventBase.prototype.getDefaultParams = function () {
        return __assign({}, this.defaultParams);
    };
    SyncEventBase.prototype.readParams = function (inputs) {
        var out = this.getDefaultParams();
        var n = inputs.length;
        if (!n)
            return out;
        //[ matcher, boundTo, timeout, callback ]
        //[ matcher, boundTo, callback ]
        //[ matcher, timeout, callback ]
        //[ boundTo, timeout, callback ]
        //[ matcher, callback ]
        //[ boundTo, callback ]
        //[ timeout, callback ]
        //[ callback ]
        //[ matcher, timeout, evt ]
        //[ matcher, evt ]
        //[ timeout, evt ]
        //[ evt ]
        if (matchPostable(inputs[n - 1])) {
            out.boundTo = inputs[n - 1];
            inputs[n - 1] = inputs[n - 1].post;
        }
        //[ matcher, boundTo, timeout, callback ]
        //[ matcher, boundTo, callback ]
        //[ matcher, timeout, callback ]
        //[ boundTo, timeout, callback ]
        //[ matcher, callback ]
        //[ boundTo, callback ]
        //[ timeout, callback ]
        //[ callback ]
        if (n === 4) {
            //[ matcher, boundTo, timeout, callback ]
            var p1 = inputs[0], p2 = inputs[1], p3 = inputs[2], p4 = inputs[3];
            out.matcher = p1;
            out.boundTo = p2;
            out.timeout = p3;
            out.callback = p4;
        }
        else if (n === 3) {
            //[ matcher, boundTo, callback ]
            //[ matcher, timeout, callback ]
            //[ boundTo, timeout, callback ]
            var p1 = inputs[0], p2 = inputs[1], p3 = inputs[2];
            if (typeof p2 === "number") {
                //[ matcher, timeout, callback ]
                //[ boundTo, timeout, callback ]
                out.timeout = p2;
                out.callback = p3;
                if (isCallable(p1)) {
                    //[ matcher, timeout, callback ]
                    out.matcher = p1;
                }
                else {
                    //[ boundTo, timeout, callback ]
                    out.boundTo = p1;
                }
            }
            else {
                //[ matcher, boundTo, callback ]
                out.matcher = p1;
                out.boundTo = p2;
                out.callback = p3;
            }
        }
        else if (n === 2) {
            //[ matcher, callback ]
            //[ boundTo, callback ]
            //[ timeout, callback ]
            var p1 = inputs[0], p2 = inputs[1];
            if (typeof p1 === "number") {
                //[ timeout, callback ]
                out.timeout = p1;
                out.callback = p2;
            }
            else {
                //[ matcher, callback ]
                //[ boundTo, callback ]
                out.callback = p2;
                if (isCallable(p1)) {
                    out.matcher = p1;
                }
                else {
                    out.boundTo = p1;
                }
            }
        }
        else if (n === 1) {
            //[ callback ]
            var p = inputs[0];
            out.callback = p;
        }
        return out;
    };
    SyncEventBase.prototype.waitFor = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        var params = this.getDefaultParams();
        var n = inputs.length;
        if (n === 2) {
            var p1 = inputs[0], p2 = inputs[1];
            params.matcher = p1;
            params.timeout = p2;
        }
        else {
            var p = inputs[0];
            if (isCallable(p)) {
                params.matcher = p;
            }
            else {
                params.timeout = p;
            }
        }
        return _super.prototype.__waitFor.call(this, params);
    };
    SyncEventBase.prototype.attach = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        return this.__attach(this.readParams(inputs));
    };
    SyncEventBase.prototype.attachOnce = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        return this.__attachOnce(this.readParams(inputs));
    };
    SyncEventBase.prototype.attachExtract = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        return this.__attachExtract(this.readParams(inputs));
    };
    SyncEventBase.prototype.attachPrepend = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        return this.__attachPrepend(this.readParams(inputs));
    };
    SyncEventBase.prototype.attachOncePrepend = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        return this.__attachOncePrepend(this.readParams(inputs));
    };
    SyncEventBase.prototype.attachOnceExtract = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        return this.__attachOnceExtract(this.readParams(inputs));
    };
    return SyncEventBase;
}(SyncEventBaseProtected_1.SyncEventBaseProtected));
exports.SyncEventBase = SyncEventBase;

},{"./SyncEventBaseProtected":51}],51:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var runExclusive = require("run-exclusive");
var defs_1 = require("./defs");
/** SyncEvent without evtAttach property and without overload */
var SyncEventBaseProtected = /** @class */ (function () {
    function SyncEventBaseProtected() {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        var _this = this;
        this.tick = 0;
        this.postCount = 0;
        this.traceId = null;
        this.handlers = [];
        this.handlerTriggers = new Map();
        this.postAsync = runExclusive.buildCb(function (data, postTick, releaseLock) {
            var isHandled = false;
            for (var _i = 0, _a = _this.handlers.slice(); _i < _a.length; _i++) {
                var handler = _a[_i];
                var async = handler.async, matcher = handler.matcher;
                if (!async || !matcher(data))
                    continue;
                var handlerTrigger = _this.handlerTriggers.get(handler);
                if (!handlerTrigger)
                    continue;
                if (handlerTrigger.handlerTick > postTick)
                    continue;
                isHandled = true;
                handlerTrigger.trigger(data);
            }
            if (!isHandled) {
                releaseLock();
            }
            else {
                var handlersDump_1 = _this.handlers.slice();
                setTimeout(function () {
                    for (var _i = 0, _a = _this.handlers; _i < _a.length; _i++) {
                        var handler = _a[_i];
                        var async = handler.async;
                        if (!async)
                            continue;
                        if (handlersDump_1.indexOf(handler) >= 0)
                            continue;
                        _this.handlerTriggers.get(handler).handlerTick = postTick;
                    }
                    releaseLock();
                }, 0);
            }
        });
        if (!inputs.length)
            return;
        var eventEmitter = inputs[0], eventName = inputs[1];
        var formatter = inputs[2] || this.defaultFormatter;
        eventEmitter.on(eventName, function () {
            var inputs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                inputs[_i] = arguments[_i];
            }
            return _this.post(formatter.apply(null, inputs));
        });
    }
    SyncEventBaseProtected.prototype.defaultFormatter = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        return inputs[0];
    };
    SyncEventBaseProtected.prototype.enableTrace = function (id, formatter, log) {
        this.traceId = id;
        if (!!formatter) {
            this.traceFormatter = formatter;
        }
        else {
            this.traceFormatter = function (data) {
                try {
                    return JSON.stringify(data, null, 2);
                }
                catch (_a) {
                    return "" + data;
                }
            };
        }
        if (!!log) {
            this.log = log;
        }
        else {
            this.log = function () {
                var inputs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    inputs[_i] = arguments[_i];
                }
                return console.log.apply(console, inputs);
            };
        }
    };
    SyncEventBaseProtected.prototype.disableTrace = function () {
        this.traceId = null;
    };
    SyncEventBaseProtected.prototype.addHandler = function (attachParams, implicitAttachParams) {
        var _this = this;
        var handler = __assign({}, attachParams, implicitAttachParams, { "detach": null, "promise": null });
        handler.promise = new Promise(function (resolve, reject) {
            var timer = undefined;
            if (typeof handler.timeout === "number") {
                timer = setTimeout(function () {
                    timer = undefined;
                    handler.detach();
                    reject(new defs_1.EvtError.Timeout(handler.timeout));
                }, handler.timeout);
            }
            handler.detach = function () {
                var index = _this.handlers.indexOf(handler);
                if (index < 0)
                    return false;
                _this.handlers.splice(index, 1);
                _this.handlerTriggers["delete"](handler);
                if (timer) {
                    clearTimeout(timer);
                    reject(new defs_1.EvtError.Detached());
                }
                return true;
            };
            var handlerTick = _this.tick++;
            var trigger = function (data) {
                var callback = handler.callback, once = handler.once;
                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }
                if (once)
                    handler.detach();
                if (callback)
                    callback.call(handler.boundTo, data);
                resolve(data);
            };
            _this.handlerTriggers.set(handler, { handlerTick: handlerTick, trigger: trigger });
        });
        if (handler.prepend) {
            var i = void 0;
            for (i = 0; i < this.handlers.length; i++) {
                if (this.handlers[i].extract)
                    continue;
                else
                    break;
            }
            this.handlers.splice(i, 0, handler);
        }
        else {
            this.handlers.push(handler);
        }
        return handler;
    };
    SyncEventBaseProtected.prototype.trace = function (data) {
        if (this.traceId === null) {
            return;
        }
        var message = "(" + this.traceId + ") ";
        var isExtracted = !!this.handlers.find(function (_a) {
            var extract = _a.extract, matcher = _a.matcher;
            return extract && matcher(data);
        });
        if (isExtracted) {
            message += "extracted ";
        }
        else {
            var handlerCount = this.handlers
                .filter(function (_a) {
                var extract = _a.extract, matcher = _a.matcher;
                return !extract && matcher(data);
            })
                .length;
            message += handlerCount + " handler" + ((handlerCount > 1) ? "s" : "") + " => ";
        }
        this.log(message + this.traceFormatter(data));
    };
    SyncEventBaseProtected.prototype.post = function (data) {
        this.trace(data);
        this.postCount++;
        var postTick = this.tick++;
        var isExtracted = this.postSync(data);
        if (!isExtracted) {
            this.postAsync(data, postTick);
        }
        return this.postCount;
    };
    SyncEventBaseProtected.prototype.postSync = function (data) {
        for (var _i = 0, _a = this.handlers.slice(); _i < _a.length; _i++) {
            var handler = _a[_i];
            var async = handler.async, matcher = handler.matcher, extract = handler.extract;
            if (async || !matcher(data))
                continue;
            var handlerTrigger = this.handlerTriggers.get(handler);
            if (!handlerTrigger)
                continue;
            handlerTrigger.trigger(data);
            if (extract)
                return true;
        }
        return false;
    };
    SyncEventBaseProtected.prototype.__waitFor = function (attachParams) {
        return this.addHandler(attachParams, {
            "async": true,
            "extract": false,
            "once": true,
            "prepend": false
        }).promise;
    };
    SyncEventBaseProtected.prototype.__attach = function (attachParams) {
        return this.addHandler(attachParams, {
            "async": false,
            "extract": false,
            "once": false,
            "prepend": false
        }).promise;
    };
    SyncEventBaseProtected.prototype.__attachExtract = function (attachParams) {
        return this.addHandler(attachParams, {
            "async": false,
            "extract": true,
            "once": false,
            "prepend": true
        }).promise;
    };
    SyncEventBaseProtected.prototype.__attachPrepend = function (attachParams) {
        return this.addHandler(attachParams, {
            "async": false,
            "extract": false,
            "once": false,
            "prepend": true
        }).promise;
    };
    SyncEventBaseProtected.prototype.__attachOnce = function (attachParams) {
        return this.addHandler(attachParams, {
            "async": false,
            "extract": false,
            "once": true,
            "prepend": false
        }).promise;
    };
    SyncEventBaseProtected.prototype.__attachOncePrepend = function (attachParams) {
        return this.addHandler(attachParams, {
            "async": false,
            "extract": false,
            "once": true,
            "prepend": true
        }).promise;
    };
    SyncEventBaseProtected.prototype.__attachOnceExtract = function (attachParams) {
        return this.addHandler(attachParams, {
            "async": false,
            "extract": true,
            "once": true,
            "prepend": true
        }).promise;
    };
    SyncEventBaseProtected.prototype.getHandlers = function () { return this.handlers.slice(); };
    /** Detach every handler bound to a given object or all handlers, return the detached handlers */
    SyncEventBaseProtected.prototype.detach = function (boundTo) {
        var detachedHandlers = [];
        for (var _i = 0, _a = this.handlers.slice(); _i < _a.length; _i++) {
            var handler = _a[_i];
            if (boundTo === undefined || handler.boundTo === boundTo) {
                handler.detach();
                detachedHandlers.push(handler);
            }
        }
        return detachedHandlers;
    };
    return SyncEventBaseProtected;
}());
exports.SyncEventBaseProtected = SyncEventBaseProtected;

},{"./defs":52,"run-exclusive":45}],52:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var setPrototypeOf = require("setprototypeof");
var EvtError;
(function (EvtError) {
    var Timeout = /** @class */ (function (_super) {
        __extends(Timeout, _super);
        function Timeout(timeout) {
            var _newTarget = this.constructor;
            var _this = _super.call(this, "Evt timeout after " + timeout + "ms") || this;
            _this.timeout = timeout;
            setPrototypeOf(_this, _newTarget.prototype);
            return _this;
        }
        return Timeout;
    }(Error));
    EvtError.Timeout = Timeout;
    var Detached = /** @class */ (function (_super) {
        __extends(Detached, _super);
        function Detached() {
            var _newTarget = this.constructor;
            var _this = _super.call(this, "Evt handler detached") || this;
            setPrototypeOf(_this, _newTarget.prototype);
            return _this;
        }
        return Detached;
    }(Error));
    EvtError.Detached = Detached;
})(EvtError = exports.EvtError || (exports.EvtError = {}));

},{"setprototypeof":46}],53:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var SyncEvent_1 = require("./SyncEvent");
exports.SyncEvent = SyncEvent_1.SyncEvent;
exports.VoidSyncEvent = SyncEvent_1.VoidSyncEvent;
var defs_1 = require("./defs");
exports.EvtError = defs_1.EvtError;

},{"./SyncEvent":49,"./defs":52}],"semasim-mobile":[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./bundledData"));
__export(require("./buildUrl"));
__export(require("./encryptOrDecrypt"));
var mobile_1 = require("./UserSimInfos/mobile");
var parseUserSimInfos = mobile_1.UserSimInfos.parse;
exports.parseUserSimInfos = parseUserSimInfos;

},{"./UserSimInfos/mobile":18,"./buildUrl":19,"./bundledData":20,"./encryptOrDecrypt":21}]},{},[]);
