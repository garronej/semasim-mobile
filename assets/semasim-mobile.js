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
var cryptoLib = require("crypto-lib");
var urlSafeBase64encoderDecoder_1 = require("./urlSafeBase64encoderDecoder");
//NOTE: Transpiled to ES3.
var stringTransform = require("transfer-tools/dist/lib/stringTransform");
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
    var prValueOrValue = cryptoLib.stringifyThenEncryptFactory(encryptor)(data);
    return (typeof prValueOrValue === "string" ?
        followUp(prValueOrValue) :
        prValueOrValue.then(function (value) { return followUp(value); }));
}
exports.smuggleBundledDataInHeaders = smuggleBundledDataInHeaders;
function extractBundledDataFromHeaders(headers, decryptor) {
    var split = [];
    var i = 0;
    while (true) {
        var key = getIndexedHeaderName(i++);
        var part = headers[key] || headers[key.toLowerCase()];
        if (!part) {
            break;
        }
        split.push(part);
    }
    if (!split.length) {
        throw new Error("No bundled data in header");
    }
    return cryptoLib.decryptThenParseFactory(decryptor)(urlSafeBase64encoderDecoder_1.urlSafeB64.dec(split.join("")));
}
exports.extractBundledDataFromHeaders = extractBundledDataFromHeaders;

},{"./urlSafeBase64encoderDecoder":4,"crypto-lib":11,"transfer-tools/dist/lib/stringTransform":25}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//NOTE: Transpiled to ES3.
var stringTransform = require("transfer-tools/dist/lib/stringTransform");
exports.urlSafeB64 = stringTransform.transcode("base64", {
    "=": "_",
    "/": "-"
});

},{"transfer-tools/dist/lib/stringTransform":25}],5:[function(require,module,exports){
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

},{"../sync/utils/environnement":16,"./WorkerThread/node":8,"./WorkerThread/simulated":9,"./WorkerThread/web":10}],8:[function(require,module,exports){
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
},{"../../sync/_worker_thread/ThreadMessage":14,"buffer":39,"path":55,"ts-events-extended":30}],9:[function(require,module,exports){
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

},{"ts-events-extended":30}],10:[function(require,module,exports){
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

},{"ts-events-extended":30}],11:[function(require,module,exports){
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
var polyfills_1 = require("./polyfills");
var runExclusive = require("run-exclusive");
var WorkerThread_1 = require("./WorkerThread");
var environnement_1 = require("../sync/utils/environnement");
var bundle_source = (function () {
    
    var path = require("path");
    return Buffer("KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoIkNhbm5vdCBmaW5kIG1vZHVsZSAnIitpKyInIik7dGhyb3cgYS5jb2RlPSJNT0RVTEVfTk9UX0ZPVU5EIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7dmFyIGVudmlyb25uZW1lbnRfMT1yZXF1aXJlKCIuLi91dGlscy9lbnZpcm9ubmVtZW50Iik7dmFyIHRvQnVmZmVyXzE9cmVxdWlyZSgiLi4vdXRpbHMvdG9CdWZmZXIiKTt2YXIgdHJhbnNmZXI7KGZ1bmN0aW9uKHRyYW5zZmVyKXt2YXIgU2VyaWFsaXphYmxlVWludDhBcnJheTsoZnVuY3Rpb24oU2VyaWFsaXphYmxlVWludDhBcnJheSl7ZnVuY3Rpb24gbWF0Y2godmFsdWUpe3JldHVybiB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCYmdmFsdWUudHlwZT09PSJVaW50OEFycmF5IiYmdHlwZW9mIHZhbHVlLmRhdGE9PT0ic3RyaW5nIn1TZXJpYWxpemFibGVVaW50OEFycmF5Lm1hdGNoPW1hdGNoO2Z1bmN0aW9uIGJ1aWxkKHZhbHVlKXtyZXR1cm57dHlwZToiVWludDhBcnJheSIsZGF0YTp0b0J1ZmZlcl8xLnRvQnVmZmVyKHZhbHVlKS50b1N0cmluZygiYmluYXJ5Iil9fVNlcmlhbGl6YWJsZVVpbnQ4QXJyYXkuYnVpbGQ9YnVpbGQ7ZnVuY3Rpb24gcmVzdG9yZSh2YWx1ZSl7cmV0dXJuIEJ1ZmZlci5mcm9tKHZhbHVlLmRhdGEsImJpbmFyeSIpfVNlcmlhbGl6YWJsZVVpbnQ4QXJyYXkucmVzdG9yZT1yZXN0b3JlfSkoU2VyaWFsaXphYmxlVWludDhBcnJheXx8KFNlcmlhbGl6YWJsZVVpbnQ4QXJyYXk9e30pKTtmdW5jdGlvbiBwcmVwYXJlKHRocmVhZE1lc3NhZ2Upe2lmKGVudmlyb25uZW1lbnRfMS5lbnZpcm9ubmVtZW50LnR5cGUhPT0iTk9ERSIpe3Rocm93IG5ldyBFcnJvcigib25seSBmb3Igbm9kZSIpfXZhciBtZXNzYWdlPWZ1bmN0aW9uKCl7aWYodGhyZWFkTWVzc2FnZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpe3JldHVybiBTZXJpYWxpemFibGVVaW50OEFycmF5LmJ1aWxkKHRocmVhZE1lc3NhZ2UpfWVsc2UgaWYodGhyZWFkTWVzc2FnZSBpbnN0YW5jZW9mIEFycmF5KXtyZXR1cm4gdGhyZWFkTWVzc2FnZS5tYXAoZnVuY3Rpb24oZW50cnkpe3JldHVybiBwcmVwYXJlKGVudHJ5KX0pfWVsc2UgaWYodGhyZWFkTWVzc2FnZSBpbnN0YW5jZW9mIE9iamVjdCl7dmFyIG91dD17fTtmb3IodmFyIGtleSBpbiB0aHJlYWRNZXNzYWdlKXtvdXRba2V5XT1wcmVwYXJlKHRocmVhZE1lc3NhZ2Vba2V5XSl9cmV0dXJuIG91dH1lbHNle3JldHVybiB0aHJlYWRNZXNzYWdlfX0oKTtyZXR1cm4gbWVzc2FnZX10cmFuc2Zlci5wcmVwYXJlPXByZXBhcmU7ZnVuY3Rpb24gcmVzdG9yZShtZXNzYWdlKXtpZihlbnZpcm9ubmVtZW50XzEuZW52aXJvbm5lbWVudC50eXBlIT09Ik5PREUiKXt0aHJvdyBuZXcgRXJyb3IoIm9ubHkgZm9yIG5vZGUiKX12YXIgdGhyZWFkTWVzc2FnZT1mdW5jdGlvbigpe2lmKFNlcmlhbGl6YWJsZVVpbnQ4QXJyYXkubWF0Y2gobWVzc2FnZSkpe3JldHVybiBTZXJpYWxpemFibGVVaW50OEFycmF5LnJlc3RvcmUobWVzc2FnZSl9ZWxzZSBpZihtZXNzYWdlIGluc3RhbmNlb2YgQXJyYXkpe3JldHVybiBtZXNzYWdlLm1hcChmdW5jdGlvbihlbnRyeSl7cmV0dXJuIHJlc3RvcmUoZW50cnkpfSl9ZWxzZSBpZihtZXNzYWdlIGluc3RhbmNlb2YgT2JqZWN0KXt2YXIgb3V0PXt9O2Zvcih2YXIga2V5IGluIG1lc3NhZ2Upe291dFtrZXldPXJlc3RvcmUobWVzc2FnZVtrZXldKX1yZXR1cm4gb3V0fWVsc2V7cmV0dXJuIG1lc3NhZ2V9fSgpO3JldHVybiB0aHJlYWRNZXNzYWdlfXRyYW5zZmVyLnJlc3RvcmU9cmVzdG9yZX0pKHRyYW5zZmVyPWV4cG9ydHMudHJhbnNmZXJ8fChleHBvcnRzLnRyYW5zZmVyPXt9KSl9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi91dGlscy9lbnZpcm9ubmVtZW50IjoxMCwiLi4vdXRpbHMvdG9CdWZmZXIiOjEyLGJ1ZmZlcjoyN31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTt2YXIgY3J5cHRvTGliPXJlcXVpcmUoIi4uL2luZGV4Iik7dmFyIGVudmlyb25uZW1lbnRfMT1yZXF1aXJlKCIuLi91dGlscy9lbnZpcm9ubmVtZW50Iik7dmFyIFRocmVhZE1lc3NhZ2VfMT1yZXF1aXJlKCIuL1RocmVhZE1lc3NhZ2UiKTtpZihmdW5jdGlvbigpe2lmKHR5cGVvZiBfX3NpbXVsYXRlZE1haW5UaHJlYWRBcGkhPT0idW5kZWZpbmVkIil7cmV0dXJuIGZhbHNlfXZhciBpc01haW5UaGVhZD1lbnZpcm9ubmVtZW50XzEuZW52aXJvbm5lbWVudC5pc01haW5UaHJlYWQhPT11bmRlZmluZWQ/ZW52aXJvbm5lbWVudF8xLmVudmlyb25uZW1lbnQuaXNNYWluVGhyZWFkOnR5cGVvZiBfX3Byb2Nlc3Nfbm9kZT09PSJ1bmRlZmluZWQiO3JldHVybiBpc01haW5UaGVhZH0oKSl7X19jcnlwdG9MaWI9Y3J5cHRvTGlifWVsc2V7dmFyIG1haW5UaHJlYWRBcGlfMT10eXBlb2YgX19zaW11bGF0ZWRNYWluVGhyZWFkQXBpIT09InVuZGVmaW5lZCI/X19zaW11bGF0ZWRNYWluVGhyZWFkQXBpOnR5cGVvZiBfX3Byb2Nlc3Nfbm9kZT09PSJ1bmRlZmluZWQiP3tzZW5kUmVzcG9uc2U6c2VsZi5wb3N0TWVzc2FnZS5iaW5kKHNlbGYpLHNldEFjdGlvbkxpc3RlbmVyOmZ1bmN0aW9uKGFjdGlvbkxpc3RlbmVyKXtyZXR1cm4gYWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsZnVuY3Rpb24oX2Epe3ZhciBkYXRhPV9hLmRhdGE7cmV0dXJuIGFjdGlvbkxpc3RlbmVyKGRhdGEpfSl9fTp7c2VuZFJlc3BvbnNlOmZ1bmN0aW9uKHJlc3BvbnNlKXtyZXR1cm4gX19wcm9jZXNzX25vZGUuc2VuZChUaHJlYWRNZXNzYWdlXzEudHJhbnNmZXIucHJlcGFyZShyZXNwb25zZSkpfSxzZXRBY3Rpb25MaXN0ZW5lcjpmdW5jdGlvbihhY3Rpb25MaXN0ZW5lcil7cmV0dXJuIF9fcHJvY2Vzc19ub2RlLm9uKCJtZXNzYWdlIixmdW5jdGlvbihtZXNzYWdlKXtyZXR1cm4gYWN0aW9uTGlzdGVuZXIoVGhyZWFkTWVzc2FnZV8xLnRyYW5zZmVyLnJlc3RvcmUobWVzc2FnZSkpfSl9fTt2YXIgY2lwaGVySW5zdGFuY2VzXzE9bmV3IE1hcDttYWluVGhyZWFkQXBpXzEuc2V0QWN0aW9uTGlzdGVuZXIoZnVuY3Rpb24oYWN0aW9uKXt2YXIgX2EsX2I7c3dpdGNoKGFjdGlvbi5hY3Rpb24pe2Nhc2UiR2VuZXJhdGVSc2FLZXlzIjptYWluVGhyZWFkQXBpXzEuc2VuZFJlc3BvbnNlKGZ1bmN0aW9uKCl7dmFyIF9hO3ZhciByZXNwb25zZT17YWN0aW9uSWQ6YWN0aW9uLmFjdGlvbklkLG91dHB1dHM6KF9hPWNyeXB0b0xpYi5yc2EpLnN5bmNHZW5lcmF0ZUtleXMuYXBwbHkoX2EsYWN0aW9uLnBhcmFtcyl9O3JldHVybiByZXNwb25zZX0oKSk7YnJlYWs7Y2FzZSJDaXBoZXJGYWN0b3J5IjpjaXBoZXJJbnN0YW5jZXNfMS5zZXQoYWN0aW9uLmNpcGhlckluc3RhbmNlUmVmLChfYT1jcnlwdG9MaWJbYWN0aW9uLmNpcGhlck5hbWVdKVtmdW5jdGlvbigpe3N3aXRjaChhY3Rpb24uY29tcG9uZW50cyl7Y2FzZSJEZWNyeXB0b3IiOnJldHVybiJzeW5jRGVjcnlwdG9yRmFjdG9yeSI7Y2FzZSJFbmNyeXB0b3IiOnJldHVybiJzeW5jRW5jcnlwdG9yRmFjdG9yeSI7Y2FzZSJFbmNyeXB0b3JEZWNyeXB0b3IiOnJldHVybiJzeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeSJ9fSgpXS5hcHBseShfYSxhY3Rpb24ucGFyYW1zKSk7YnJlYWs7Y2FzZSJFbmNyeXB0T3JEZWNyeXB0Ijp7dmFyIG91dHB1dF8xPWNpcGhlckluc3RhbmNlc18xLmdldChhY3Rpb24uY2lwaGVySW5zdGFuY2VSZWYpW2FjdGlvbi5tZXRob2RdKGFjdGlvbi5pbnB1dCk7bWFpblRocmVhZEFwaV8xLnNlbmRSZXNwb25zZShmdW5jdGlvbigpe3ZhciByZXNwb25zZT17YWN0aW9uSWQ6YWN0aW9uLmFjdGlvbklkLG91dHB1dDpvdXRwdXRfMX07cmV0dXJuIHJlc3BvbnNlfSgpLFtvdXRwdXRfMS5idWZmZXJdKX1icmVhaztjYXNlIlNjcnlwdEhhc2giOnt2YXIgZGlnZXN0XzE9KF9iPWNyeXB0b0xpYi5zY3J5cHQpLnN5bmNIYXNoLmFwcGx5KF9iLGFjdGlvbi5wYXJhbXMuY29uY2F0KFtmdW5jdGlvbihwZXJjZW50KXtyZXR1cm4gbWFpblRocmVhZEFwaV8xLnNlbmRSZXNwb25zZShmdW5jdGlvbigpe3ZhciByZXNwb25zZT17YWN0aW9uSWQ6YWN0aW9uLmFjdGlvbklkLHBlcmNlbnQ6cGVyY2VudH07cmV0dXJuIHJlc3BvbnNlfSgpKX1dKSk7bWFpblRocmVhZEFwaV8xLnNlbmRSZXNwb25zZShmdW5jdGlvbigpe3ZhciByZXNwb25zZT17YWN0aW9uSWQ6YWN0aW9uLmFjdGlvbklkLGRpZ2VzdDpkaWdlc3RfMX07cmV0dXJuIHJlc3BvbnNlfSgpLFtkaWdlc3RfMS5idWZmZXJdKX1icmVha319KX19LHsiLi4vaW5kZXgiOjYsIi4uL3V0aWxzL2Vudmlyb25uZW1lbnQiOjEwLCIuL1RocmVhZE1lc3NhZ2UiOjF9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7dmFyIGFlc2pzPXJlcXVpcmUoImFlcy1qcyIpO3ZhciByYW5kb21CeXRlc18xPXJlcXVpcmUoIi4uL3V0aWxzL3JhbmRvbUJ5dGVzIik7dmFyIGJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzE9cmVxdWlyZSgiLi4vdXRpbHMvYmluYXJ5RGF0YU1hbmlwdWxhdGlvbnMiKTtmdW5jdGlvbiBzeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeShrZXkpe3JldHVybntlbmNyeXB0OmZ1bmN0aW9uKCl7dmFyIGdldEl2PWZ1bmN0aW9uKCl7dmFyIGl2MD1yYW5kb21CeXRlc18xLnJhbmRvbUJ5dGVzKDE2KTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYmluYXJ5RGF0YU1hbmlwdWxhdGlvbnNfMS5sZWZ0U2hpZnQoaXYwKX19KCk7cmV0dXJuIGZ1bmN0aW9uKHBsYWluRGF0YSl7dmFyIGl2PWdldEl2KCk7dmFyIG9yaWdpbmFsTGVuZ3RoQXNCeXRlPWJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzEuYWRkUGFkZGluZygiTEVGVCIsYmluYXJ5RGF0YU1hbmlwdWxhdGlvbnNfMS5udW1iZXJUb1VpbnQ4QXJyYXkocGxhaW5EYXRhLmxlbmd0aCksNCk7dmFyIHBsYWluRGF0YU11bHRpcGxlT2YxNkJ5dGVzPWJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzEuYWRkUGFkZGluZygiUklHSFQiLHBsYWluRGF0YSxwbGFpbkRhdGEubGVuZ3RoKygxNi1wbGFpbkRhdGEubGVuZ3RoJTE2KSk7dmFyIGVuY3J5cHRlZERhdGFQYXlsb2FkPW5ldyBhZXNqcy5Nb2RlT2ZPcGVyYXRpb24uY2JjKGtleSxpdikuZW5jcnlwdChwbGFpbkRhdGFNdWx0aXBsZU9mMTZCeXRlcyk7cmV0dXJuIGJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzEuY29uY2F0VWludDhBcnJheShpdixvcmlnaW5hbExlbmd0aEFzQnl0ZSxlbmNyeXB0ZWREYXRhUGF5bG9hZCl9fSgpLGRlY3J5cHQ6ZnVuY3Rpb24oZW5jcnlwdGVkRGF0YSl7dmFyIGl2PWVuY3J5cHRlZERhdGEuc2xpY2UoMCwxNik7dmFyIG9yaWdpbmFsTGVuZ3RoQXNCeXRlPWVuY3J5cHRlZERhdGEuc2xpY2UoMTYsMTYrNCk7dmFyIG9yaWdpbmFsTGVuZ3RoPWJpbmFyeURhdGFNYW5pcHVsYXRpb25zXzEudWludDhBcnJheVRvTnVtYmVyKG9yaWdpbmFsTGVuZ3RoQXNCeXRlKTtyZXR1cm4gbmV3IGFlc2pzLk1vZGVPZk9wZXJhdGlvbi5jYmMoa2V5LGl2KS5kZWNyeXB0KGVuY3J5cHRlZERhdGEuc2xpY2UoMTYrNCkpLnNsaWNlKDAsb3JpZ2luYWxMZW5ndGgpfX19ZXhwb3J0cy5zeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeT1zeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeTtmdW5jdGlvbiBnZW5lcmF0ZUtleSgpe3JldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCl7cmV0dXJuIHJhbmRvbUJ5dGVzXzEucmFuZG9tQnl0ZXMoMzIsZnVuY3Rpb24oZXJyLGJ1Zil7aWYoISFlcnIpe3JlamVjdChlcnIpfWVsc2V7cmVzb2x2ZShidWYpfX0pfSl9ZXhwb3J0cy5nZW5lcmF0ZUtleT1nZW5lcmF0ZUtleTtmdW5jdGlvbiBnZXRUZXN0S2V5KCl7cmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgVWludDhBcnJheShbMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMCwyMSwyMiwyMywyNCwyNSwyNiwyNywyOCwyOSwzMCwzMV0pKX1leHBvcnRzLmdldFRlc3RLZXk9Z2V0VGVzdEtleX0seyIuLi91dGlscy9iaW5hcnlEYXRhTWFuaXB1bGF0aW9ucyI6OSwiLi4vdXRpbHMvcmFuZG9tQnl0ZXMiOjExLCJhZXMtanMiOjEzfV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO2Z1bmN0aW9uIHN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5KCl7cmV0dXJue2VuY3J5cHQ6ZnVuY3Rpb24ocGxhaW5EYXRhKXtyZXR1cm4gcGxhaW5EYXRhfSxkZWNyeXB0OmZ1bmN0aW9uKGVuY3J5cHRlZERhdGEpe3JldHVybiBlbmNyeXB0ZWREYXRhfX19ZXhwb3J0cy5zeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeT1zeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeX0se31dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpeyJ1c2Ugc3RyaWN0Ijt2YXIgX19hc3NpZ249dGhpcyYmdGhpcy5fX2Fzc2lnbnx8ZnVuY3Rpb24oKXtfX2Fzc2lnbj1PYmplY3QuYXNzaWdufHxmdW5jdGlvbih0KXtmb3IodmFyIHMsaT0xLG49YXJndW1lbnRzLmxlbmd0aDtpPG47aSsrKXtzPWFyZ3VtZW50c1tpXTtmb3IodmFyIHAgaW4gcylpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocyxwKSl0W3BdPXNbcF19cmV0dXJuIHR9O3JldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO3ZhciB0eXBlc18xPXJlcXVpcmUoIi4uL3R5cGVzIik7dmFyIE5vZGVSU0E9cmVxdWlyZSgibm9kZS1yc2EiKTt2YXIgZW52aXJvbm5lbWVudF8xPXJlcXVpcmUoIi4uL3V0aWxzL2Vudmlyb25uZW1lbnQiKTt2YXIgdG9CdWZmZXJfMT1yZXF1aXJlKCIuLi91dGlscy90b0J1ZmZlciIpO3ZhciB0YXJnZXRlZEVudmlyb25uZW1lbnQ9ZW52aXJvbm5lbWVudF8xLmVudmlyb25uZW1lbnQudHlwZT09PSJOT0RFIj8ibm9kZSI6ImJyb3dzZXIiO3ZhciBuZXdOb2RlUlNBPWZ1bmN0aW9uKGtleSl7cmV0dXJuIG5ldyBOb2RlUlNBKEJ1ZmZlci5mcm9tKGtleS5kYXRhKSxrZXkuZm9ybWF0LHtlbnZpcm9ubWVudDp0YXJnZXRlZEVudmlyb25uZW1lbnR9KX07ZnVuY3Rpb24gc3luY0VuY3J5cHRvckZhY3RvcnkoZW5jcnlwdEtleSl7cmV0dXJue2VuY3J5cHQ6ZnVuY3Rpb24oKXt2YXIgZW5jcnlwdE5vZGVSU0E9bmV3Tm9kZVJTQShlbmNyeXB0S2V5KTt2YXIgZW5jcnlwdE1ldGhvZD10eXBlc18xLlJzYUtleS5Qcml2YXRlLm1hdGNoKGVuY3J5cHRLZXkpPyJlbmNyeXB0UHJpdmF0ZSI6ImVuY3J5cHQiO3JldHVybiBmdW5jdGlvbihwbGFpbkRhdGEpe3JldHVybiBlbmNyeXB0Tm9kZVJTQVtlbmNyeXB0TWV0aG9kXSh0b0J1ZmZlcl8xLnRvQnVmZmVyKHBsYWluRGF0YSkpfX0oKX19ZXhwb3J0cy5zeW5jRW5jcnlwdG9yRmFjdG9yeT1zeW5jRW5jcnlwdG9yRmFjdG9yeTtmdW5jdGlvbiBzeW5jRGVjcnlwdG9yRmFjdG9yeShkZWNyeXB0S2V5KXtyZXR1cm57ZGVjcnlwdDpmdW5jdGlvbigpe3ZhciBkZWNyeXB0Tm9kZVJTQT1uZXdOb2RlUlNBKGRlY3J5cHRLZXkpO3ZhciBkZWNyeXB0TWV0aG9kPXR5cGVzXzEuUnNhS2V5LlB1YmxpYy5tYXRjaChkZWNyeXB0S2V5KT8iZGVjcnlwdFB1YmxpYyI6ImRlY3J5cHQiO3JldHVybiBmdW5jdGlvbihlbmNyeXB0ZWREYXRhKXtyZXR1cm4gZGVjcnlwdE5vZGVSU0FbZGVjcnlwdE1ldGhvZF0odG9CdWZmZXJfMS50b0J1ZmZlcihlbmNyeXB0ZWREYXRhKSl9fSgpfX1leHBvcnRzLnN5bmNEZWNyeXB0b3JGYWN0b3J5PXN5bmNEZWNyeXB0b3JGYWN0b3J5O2Z1bmN0aW9uIHN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5KGVuY3J5cHRLZXksZGVjcnlwdEtleSl7cmV0dXJuIF9fYXNzaWduKHt9LHN5bmNFbmNyeXB0b3JGYWN0b3J5KGVuY3J5cHRLZXkpLHN5bmNEZWNyeXB0b3JGYWN0b3J5KGRlY3J5cHRLZXkpKX1leHBvcnRzLnN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5PXN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5O2Z1bmN0aW9uIHN5bmNHZW5lcmF0ZUtleXMoc2VlZCxrZXlzTGVuZ3RoQnl0ZXMpe2lmKGtleXNMZW5ndGhCeXRlcz09PXZvaWQgMCl7a2V5c0xlbmd0aEJ5dGVzPTgwfXZhciBub2RlUlNBPU5vZGVSU0EuZ2VuZXJhdGVLZXlQYWlyRnJvbVNlZWQoc2VlZCw4KmtleXNMZW5ndGhCeXRlcyx1bmRlZmluZWQsdGFyZ2V0ZWRFbnZpcm9ubmVtZW50KTtmdW5jdGlvbiBidWlsZEtleShmb3JtYXQpe3JldHVybntmb3JtYXQ6Zm9ybWF0LGRhdGE6bm9kZVJTQS5leHBvcnRLZXkoZm9ybWF0KX19cmV0dXJue3B1YmxpY0tleTpidWlsZEtleSgicGtjczEtcHVibGljLWRlciIpLHByaXZhdGVLZXk6YnVpbGRLZXkoInBrY3MxLXByaXZhdGUtZGVyIil9fWV4cG9ydHMuc3luY0dlbmVyYXRlS2V5cz1zeW5jR2VuZXJhdGVLZXlzfSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vdHlwZXMiOjgsIi4uL3V0aWxzL2Vudmlyb25uZW1lbnQiOjEwLCIuLi91dGlscy90b0J1ZmZlciI6MTIsYnVmZmVyOjI3LCJub2RlLXJzYSI6NDB9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gX19leHBvcnQobSl7Zm9yKHZhciBwIGluIG0paWYoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpZXhwb3J0c1twXT1tW3BdfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO19fZXhwb3J0KHJlcXVpcmUoIi4vdHlwZXMiKSk7dmFyIHNjcnlwdD1yZXF1aXJlKCIuL3NjcnlwdCIpO2V4cG9ydHMuc2NyeXB0PXNjcnlwdDt2YXIgYWVzPXJlcXVpcmUoIi4vY2lwaGVyL2FlcyIpO2V4cG9ydHMuYWVzPWFlczt2YXIgcnNhPXJlcXVpcmUoIi4vY2lwaGVyL3JzYSIpO2V4cG9ydHMucnNhPXJzYTt2YXIgcGxhaW49cmVxdWlyZSgiLi9jaXBoZXIvcGxhaW4iKTtleHBvcnRzLnBsYWluPXBsYWlufSx7Ii4vY2lwaGVyL2FlcyI6MywiLi9jaXBoZXIvcGxhaW4iOjQsIi4vY2lwaGVyL3JzYSI6NSwiLi9zY3J5cHQiOjcsIi4vdHlwZXMiOjh9XSw3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIF9fYXNzaWduPXRoaXMmJnRoaXMuX19hc3NpZ258fGZ1bmN0aW9uKCl7X19hc3NpZ249T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24odCl7Zm9yKHZhciBzLGk9MSxuPWFyZ3VtZW50cy5sZW5ndGg7aTxuO2krKyl7cz1hcmd1bWVudHNbaV07Zm9yKHZhciBwIGluIHMpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMscCkpdFtwXT1zW3BdfXJldHVybiB0fTtyZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcyxhcmd1bWVudHMpfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTt2YXIgc2NyeXB0c3k9cmVxdWlyZSgic2NyeXB0c3kiKTtleHBvcnRzLmRlZmF1bHRQYXJhbXM9e246MTMscjo4LHA6MSxkaWdlc3RMZW5ndGhCeXRlczoyNTR9O2Z1bmN0aW9uIHN5bmNIYXNoKHRleHQsc2FsdCxwYXJhbXMscHJvZ3Jlc3Mpe2lmKHBhcmFtcz09PXZvaWQgMCl7cGFyYW1zPXt9fXZhciBfYT1mdW5jdGlvbigpe3ZhciBvdXQ9X19hc3NpZ24oe30sZXhwb3J0cy5kZWZhdWx0UGFyYW1zKTtPYmplY3Qua2V5cyhwYXJhbXMpLmZpbHRlcihmdW5jdGlvbihrZXkpe3JldHVybiBwYXJhbXNba2V5XSE9PXVuZGVmaW5lZH0pLmZvckVhY2goZnVuY3Rpb24oa2V5KXtyZXR1cm4gb3V0W2tleV09cGFyYW1zW2tleV19KTtyZXR1cm4gb3V0fSgpLG49X2EubixyPV9hLnIscD1fYS5wLGRpZ2VzdExlbmd0aEJ5dGVzPV9hLmRpZ2VzdExlbmd0aEJ5dGVzO3JldHVybiBzY3J5cHRzeSh0ZXh0LHNhbHQsTWF0aC5wb3coMixuKSxyLHAsZGlnZXN0TGVuZ3RoQnl0ZXMscHJvZ3Jlc3MhPT11bmRlZmluZWQ/ZnVuY3Rpb24oX2Epe3ZhciBwZXJjZW50PV9hLnBlcmNlbnQ7cmV0dXJuIHByb2dyZXNzKHBlcmNlbnQpfTp1bmRlZmluZWQpfWV4cG9ydHMuc3luY0hhc2g9c3luY0hhc2h9LHtzY3J5cHRzeTo4MX1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpeyJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTt2YXIgdG9CdWZmZXJfMT1yZXF1aXJlKCIuL3V0aWxzL3RvQnVmZmVyIik7dmFyIFJzYUtleTsoZnVuY3Rpb24oUnNhS2V5KXtmdW5jdGlvbiBzdHJpbmdpZnkocnNhS2V5KXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoW3JzYUtleS5mb3JtYXQsdG9CdWZmZXJfMS50b0J1ZmZlcihyc2FLZXkuZGF0YSkudG9TdHJpbmcoImJhc2U2NCIpXSl9UnNhS2V5LnN0cmluZ2lmeT1zdHJpbmdpZnk7ZnVuY3Rpb24gcGFyc2Uoc3RyaW5naWZpZWRSc2FLZXkpe3ZhciBfYT1KU09OLnBhcnNlKHN0cmluZ2lmaWVkUnNhS2V5KSxmb3JtYXQ9X2FbMF0sc3RyRGF0YT1fYVsxXTtyZXR1cm57Zm9ybWF0OmZvcm1hdCxkYXRhOm5ldyBVaW50OEFycmF5KEJ1ZmZlci5mcm9tKHN0ckRhdGEsImJhc2U2NCIpKX19UnNhS2V5LnBhcnNlPXBhcnNlO3ZhciBQdWJsaWM7KGZ1bmN0aW9uKFB1YmxpYyl7ZnVuY3Rpb24gbWF0Y2gocnNhS2V5KXtyZXR1cm4gcnNhS2V5LmZvcm1hdD09PSJwa2NzMS1wdWJsaWMtZGVyIn1QdWJsaWMubWF0Y2g9bWF0Y2h9KShQdWJsaWM9UnNhS2V5LlB1YmxpY3x8KFJzYUtleS5QdWJsaWM9e30pKTt2YXIgUHJpdmF0ZTsoZnVuY3Rpb24oUHJpdmF0ZSl7ZnVuY3Rpb24gbWF0Y2gocnNhS2V5KXtyZXR1cm4gcnNhS2V5LmZvcm1hdD09PSJwa2NzMS1wcml2YXRlLWRlciJ9UHJpdmF0ZS5tYXRjaD1tYXRjaH0pKFByaXZhdGU9UnNhS2V5LlByaXZhdGV8fChSc2FLZXkuUHJpdmF0ZT17fSkpfSkoUnNhS2V5PWV4cG9ydHMuUnNhS2V5fHwoZXhwb3J0cy5Sc2FLZXk9e30pKX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4vdXRpbHMvdG9CdWZmZXIiOjEyLGJ1ZmZlcjoyN31dLDk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTtmdW5jdGlvbiBjb25jYXRVaW50OEFycmF5KCl7dmFyIHVpbnQ4QXJyYXlzPVtdO2Zvcih2YXIgX2k9MDtfaTxhcmd1bWVudHMubGVuZ3RoO19pKyspe3VpbnQ4QXJyYXlzW19pXT1hcmd1bWVudHNbX2ldfXZhciBvdXQ9bmV3IFVpbnQ4QXJyYXkodWludDhBcnJheXMubWFwKGZ1bmN0aW9uKF9hKXt2YXIgbGVuZ3RoPV9hLmxlbmd0aDtyZXR1cm4gbGVuZ3RofSkucmVkdWNlKGZ1bmN0aW9uKHByZXYsY3Vycil7cmV0dXJuIHByZXYrY3Vycn0sMCkpO3ZhciBvZmZzZXQ9MDtmb3IodmFyIGk9MDtpPHVpbnQ4QXJyYXlzLmxlbmd0aDtpKyspe3ZhciB1aW50OEFycmF5PXVpbnQ4QXJyYXlzW2ldO291dC5zZXQodWludDhBcnJheSxvZmZzZXQpO29mZnNldCs9dWludDhBcnJheS5sZW5ndGh9cmV0dXJuIG91dH1leHBvcnRzLmNvbmNhdFVpbnQ4QXJyYXk9Y29uY2F0VWludDhBcnJheTtmdW5jdGlvbiBhZGRQYWRkaW5nKHBvc2l0aW9uLHVpbnQ4QXJyYXksdGFyZ2V0TGVuZ3RoQnl0ZXMpe3ZhciBwYWRkaW5nQnl0ZXM9bmV3IFVpbnQ4QXJyYXkodGFyZ2V0TGVuZ3RoQnl0ZXMtdWludDhBcnJheS5sZW5ndGgpLmZpbGwoMCk7cmV0dXJuIGNvbmNhdFVpbnQ4QXJyYXkuYXBwbHkodm9pZCAwLGZ1bmN0aW9uKCl7c3dpdGNoKHBvc2l0aW9uKXtjYXNlIkxFRlQiOnJldHVybltwYWRkaW5nQnl0ZXMsdWludDhBcnJheV07Y2FzZSJSSUdIVCI6cmV0dXJuW3VpbnQ4QXJyYXkscGFkZGluZ0J5dGVzXX19KCkpfWV4cG9ydHMuYWRkUGFkZGluZz1hZGRQYWRkaW5nO2Z1bmN0aW9uIG51bWJlclRvVWludDhBcnJheShuKXt2YXIgc3RyPW4udG9TdHJpbmcoMTYpO3ZhciBhcnI9W107dmFyIGN1cnI9IiI7Zm9yKHZhciBpPXN0ci5sZW5ndGgtMTtpPj0wO2ktLSl7Y3Vycj1zdHJbaV0rY3VycjtpZihjdXJyLmxlbmd0aD09PTJ8fGk9PT0wKXthcnI9W3BhcnNlSW50KGN1cnIsMTYpXS5jb25jYXQoYXJyKTtjdXJyPSIifX1yZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJyKX1leHBvcnRzLm51bWJlclRvVWludDhBcnJheT1udW1iZXJUb1VpbnQ4QXJyYXk7ZnVuY3Rpb24gdWludDhBcnJheVRvTnVtYmVyKHVpbnQ4QXJyYXkpe3ZhciBuPTA7dmFyIGV4cD0wO2Zvcih2YXIgaT11aW50OEFycmF5Lmxlbmd0aC0xO2k+PTA7aS0tKXtuKz11aW50OEFycmF5W2ldKk1hdGgucG93KDI1NixleHArKyl9cmV0dXJuIG59ZXhwb3J0cy51aW50OEFycmF5VG9OdW1iZXI9dWludDhBcnJheVRvTnVtYmVyO2Z1bmN0aW9uIGxlZnRTaGlmdCh1aW50OEFycmF5KXt2YXIgYz10cnVlO2Zvcih2YXIgaT11aW50OEFycmF5Lmxlbmd0aC0xO2MmJmk+PTA7aS0tKXtpZigrK3VpbnQ4QXJyYXlbaV0hPT0yNTYpe2M9ZmFsc2V9fXJldHVybiB1aW50OEFycmF5fWV4cG9ydHMubGVmdFNoaWZ0PWxlZnRTaGlmdH0se31dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7ZXhwb3J0cy5lbnZpcm9ubmVtZW50PWZ1bmN0aW9uKCl7aWYodHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiKXtyZXR1cm57dHlwZToiQlJPV1NFUiIsaXNNYWluVGhyZWFkOnRydWV9fWVsc2UgaWYodHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIiYmISFzZWxmLnBvc3RNZXNzYWdlKXtyZXR1cm57dHlwZToiQlJPV1NFUiIsaXNNYWluVGhyZWFkOmZhbHNlfX1lbHNlIGlmKHR5cGVvZiBzZXRUaW1lb3V0PT09InVuZGVmaW5lZCIpe3JldHVybnt0eXBlOiJMSVFVSUQgQ09SRSIsaXNNYWluVGhyZWFkOnRydWV9fWVsc2V7cmV0dXJue3R5cGU6Ik5PREUiLGlzTWFpblRocmVhZDp1bmRlZmluZWR9fX0oKX0se31dLDExOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7dmFyIGVudmlyb25uZW1lbnRfMT1yZXF1aXJlKCIuL2Vudmlyb25uZW1lbnQiKTtmdW5jdGlvbiByYW5kb21CeXRlcyhzaXplLGNhbGxiYWNrKXt2YXIgTUFYX1VJTlQzMj1yYW5kb21CeXRlcy5NQVhfVUlOVDMyLE1BWF9CWVRFUz1yYW5kb21CeXRlcy5NQVhfQllURVMsZ2V0UmFuZG9tVmFsdWVzPXJhbmRvbUJ5dGVzLmdldFJhbmRvbVZhbHVlcyxnZXROb2RlUmFuZG9tQnl0ZXM9cmFuZG9tQnl0ZXMuZ2V0Tm9kZVJhbmRvbUJ5dGVzO2lmKGVudmlyb25uZW1lbnRfMS5lbnZpcm9ubmVtZW50LnR5cGU9PT0iTk9ERSIpe3ZhciBub2RlQnVmZmVySW5zdD1nZXROb2RlUmFuZG9tQnl0ZXMoKShzaXplKTtyZXR1cm4gQnVmZmVyLmZyb20obm9kZUJ1ZmZlckluc3QuYnVmZmVyLG5vZGVCdWZmZXJJbnN0LmJ5dGVPZmZzZXQsbm9kZUJ1ZmZlckluc3QubGVuZ3RoKX1pZihzaXplPk1BWF9VSU5UMzIpe3Rocm93IG5ldyBSYW5nZUVycm9yKCJyZXF1ZXN0ZWQgdG9vIG1hbnkgcmFuZG9tIGJ5dGVzIil9dmFyIGJ5dGVzPUJ1ZmZlci5hbGxvY1Vuc2FmZShzaXplKTtpZihzaXplPjApe2lmKHNpemU+TUFYX0JZVEVTKXtmb3IodmFyIGdlbmVyYXRlZD0wO2dlbmVyYXRlZDxzaXplO2dlbmVyYXRlZCs9TUFYX0JZVEVTKXtnZXRSYW5kb21WYWx1ZXMoYnl0ZXMuc2xpY2UoZ2VuZXJhdGVkLGdlbmVyYXRlZCtNQVhfQllURVMpKX19ZWxzZXtnZXRSYW5kb21WYWx1ZXMoYnl0ZXMpfX1pZih0eXBlb2YgY2FsbGJhY2s9PT0iZnVuY3Rpb24iKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7cmV0dXJuIGNhbGxiYWNrKG51bGwsYnl0ZXMpfSwwKTtyZXR1cm59cmV0dXJuIGJ5dGVzfWV4cG9ydHMucmFuZG9tQnl0ZXM9cmFuZG9tQnl0ZXM7KGZ1bmN0aW9uKHJhbmRvbUJ5dGVzKXtyYW5kb21CeXRlcy5NQVhfQllURVM9NjU1MzY7cmFuZG9tQnl0ZXMuTUFYX1VJTlQzMj00Mjk0OTY3Mjk1O3JhbmRvbUJ5dGVzLmdldFJhbmRvbVZhbHVlcz1mdW5jdGlvbigpe3ZhciBub25DcnlwdG9ncmFwaGljR2V0UmFuZG9tVmFsdWU9ZnVuY3Rpb24oYWJ2KXt2YXIgbD1hYnYubGVuZ3RoO3doaWxlKGwtLSl7YWJ2W2xdPU1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyNTYpfXJldHVybiBhYnZ9O3ZhciBicm93c2VyR2V0UmFuZG9tVmFsdWVzPWZ1bmN0aW9uKCl7aWYodHlwZW9mIGNyeXB0bz09PSJvYmplY3QiJiYhIWNyeXB0by5nZXRSYW5kb21WYWx1ZXMpe3JldHVybiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKX1lbHNlIGlmKHR5cGVvZiBtc0NyeXB0bz09PSJvYmplY3QiJiYhIW1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyl7cmV0dXJuIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKX1lbHNlIGlmKHR5cGVvZiBzZWxmPT09Im9iamVjdCImJnR5cGVvZiBzZWxmLmNyeXB0bz09PSJvYmplY3QiJiYhIXNlbGYuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyl7cmV0dXJuIHNlbGYuY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKHNlbGYuY3J5cHRvKX1lbHNle3JldHVybiB1bmRlZmluZWR9fSgpO3JldHVybiEhYnJvd3NlckdldFJhbmRvbVZhbHVlcz9icm93c2VyR2V0UmFuZG9tVmFsdWVzOm5vbkNyeXB0b2dyYXBoaWNHZXRSYW5kb21WYWx1ZX0oKTtyYW5kb21CeXRlcy5nZXROb2RlUmFuZG9tQnl0ZXM9ZnVuY3Rpb24oKXt2YXIgbm9kZVJhbmRvbUJ5dGVzPXVuZGVmaW5lZDtyZXR1cm4gZnVuY3Rpb24oKXtpZihub2RlUmFuZG9tQnl0ZXM9PT11bmRlZmluZWQpe25vZGVSYW5kb21CeXRlcz1yZXF1aXJlKCJjcnlwdG8iKyIiKS5yYW5kb21CeXRlc31yZXR1cm4gbm9kZVJhbmRvbUJ5dGVzfX0oKX0pKHJhbmRvbUJ5dGVzPWV4cG9ydHMucmFuZG9tQnl0ZXN8fChleHBvcnRzLnJhbmRvbUJ5dGVzPXt9KSl9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuL2Vudmlyb25uZW1lbnQiOjEwLGJ1ZmZlcjoyN31dLDEyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7ZnVuY3Rpb24gdG9CdWZmZXIodWludDhBcnJheSl7cmV0dXJuIEJ1ZmZlci5mcm9tKHVpbnQ4QXJyYXkuYnVmZmVyLHVpbnQ4QXJyYXkuYnl0ZU9mZnNldCx1aW50OEFycmF5Lmxlbmd0aCl9ZXhwb3J0cy50b0J1ZmZlcj10b0J1ZmZlcn0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7YnVmZmVyOjI3fV0sMTM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihyb290KXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gY2hlY2tJbnQodmFsdWUpe3JldHVybiBwYXJzZUludCh2YWx1ZSk9PT12YWx1ZX1mdW5jdGlvbiBjaGVja0ludHMoYXJyYXlpc2gpe2lmKCFjaGVja0ludChhcnJheWlzaC5sZW5ndGgpKXtyZXR1cm4gZmFsc2V9Zm9yKHZhciBpPTA7aTxhcnJheWlzaC5sZW5ndGg7aSsrKXtpZighY2hlY2tJbnQoYXJyYXlpc2hbaV0pfHxhcnJheWlzaFtpXTwwfHxhcnJheWlzaFtpXT4yNTUpe3JldHVybiBmYWxzZX19cmV0dXJuIHRydWV9ZnVuY3Rpb24gY29lcmNlQXJyYXkoYXJnLGNvcHkpe2lmKGFyZy5idWZmZXImJmFyZy5uYW1lPT09IlVpbnQ4QXJyYXkiKXtpZihjb3B5KXtpZihhcmcuc2xpY2Upe2FyZz1hcmcuc2xpY2UoKX1lbHNle2FyZz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmcpfX1yZXR1cm4gYXJnfWlmKEFycmF5LmlzQXJyYXkoYXJnKSl7aWYoIWNoZWNrSW50cyhhcmcpKXt0aHJvdyBuZXcgRXJyb3IoIkFycmF5IGNvbnRhaW5zIGludmFsaWQgdmFsdWU6ICIrYXJnKX1yZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJnKX1pZihjaGVja0ludChhcmcubGVuZ3RoKSYmY2hlY2tJbnRzKGFyZykpe3JldHVybiBuZXcgVWludDhBcnJheShhcmcpfXRocm93IG5ldyBFcnJvcigidW5zdXBwb3J0ZWQgYXJyYXktbGlrZSBvYmplY3QiKX1mdW5jdGlvbiBjcmVhdGVBcnJheShsZW5ndGgpe3JldHVybiBuZXcgVWludDhBcnJheShsZW5ndGgpfWZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2VBcnJheSx0YXJnZXRBcnJheSx0YXJnZXRTdGFydCxzb3VyY2VTdGFydCxzb3VyY2VFbmQpe2lmKHNvdXJjZVN0YXJ0IT1udWxsfHxzb3VyY2VFbmQhPW51bGwpe2lmKHNvdXJjZUFycmF5LnNsaWNlKXtzb3VyY2VBcnJheT1zb3VyY2VBcnJheS5zbGljZShzb3VyY2VTdGFydCxzb3VyY2VFbmQpfWVsc2V7c291cmNlQXJyYXk9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc291cmNlQXJyYXksc291cmNlU3RhcnQsc291cmNlRW5kKX19dGFyZ2V0QXJyYXkuc2V0KHNvdXJjZUFycmF5LHRhcmdldFN0YXJ0KX12YXIgY29udmVydFV0Zjg9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0b0J5dGVzKHRleHQpe3ZhciByZXN1bHQ9W10saT0wO3RleHQ9ZW5jb2RlVVJJKHRleHQpO3doaWxlKGk8dGV4dC5sZW5ndGgpe3ZhciBjPXRleHQuY2hhckNvZGVBdChpKyspO2lmKGM9PT0zNyl7cmVzdWx0LnB1c2gocGFyc2VJbnQodGV4dC5zdWJzdHIoaSwyKSwxNikpO2krPTJ9ZWxzZXtyZXN1bHQucHVzaChjKX19cmV0dXJuIGNvZXJjZUFycmF5KHJlc3VsdCl9ZnVuY3Rpb24gZnJvbUJ5dGVzKGJ5dGVzKXt2YXIgcmVzdWx0PVtdLGk9MDt3aGlsZShpPGJ5dGVzLmxlbmd0aCl7dmFyIGM9Ynl0ZXNbaV07aWYoYzwxMjgpe3Jlc3VsdC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYykpO2krK31lbHNlIGlmKGM+MTkxJiZjPDIyNCl7cmVzdWx0LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZSgoYyYzMSk8PDZ8Ynl0ZXNbaSsxXSY2MykpO2krPTJ9ZWxzZXtyZXN1bHQucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKChjJjE1KTw8MTJ8KGJ5dGVzW2krMV0mNjMpPDw2fGJ5dGVzW2krMl0mNjMpKTtpKz0zfX1yZXR1cm4gcmVzdWx0LmpvaW4oIiIpfXJldHVybnt0b0J5dGVzOnRvQnl0ZXMsZnJvbUJ5dGVzOmZyb21CeXRlc319KCk7dmFyIGNvbnZlcnRIZXg9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0b0J5dGVzKHRleHQpe3ZhciByZXN1bHQ9W107Zm9yKHZhciBpPTA7aTx0ZXh0Lmxlbmd0aDtpKz0yKXtyZXN1bHQucHVzaChwYXJzZUludCh0ZXh0LnN1YnN0cihpLDIpLDE2KSl9cmV0dXJuIHJlc3VsdH12YXIgSGV4PSIwMTIzNDU2Nzg5YWJjZGVmIjtmdW5jdGlvbiBmcm9tQnl0ZXMoYnl0ZXMpe3ZhciByZXN1bHQ9W107Zm9yKHZhciBpPTA7aTxieXRlcy5sZW5ndGg7aSsrKXt2YXIgdj1ieXRlc1tpXTtyZXN1bHQucHVzaChIZXhbKHYmMjQwKT4+NF0rSGV4W3YmMTVdKX1yZXR1cm4gcmVzdWx0LmpvaW4oIiIpfXJldHVybnt0b0J5dGVzOnRvQnl0ZXMsZnJvbUJ5dGVzOmZyb21CeXRlc319KCk7dmFyIG51bWJlck9mUm91bmRzPXsxNjoxMCwyNDoxMiwzMjoxNH07dmFyIHJjb249WzEsMiw0LDgsMTYsMzIsNjQsMTI4LDI3LDU0LDEwOCwyMTYsMTcxLDc3LDE1NCw0Nyw5NCwxODgsOTksMTk4LDE1MSw1MywxMDYsMjEyLDE3OSwxMjUsMjUwLDIzOSwxOTcsMTQ1XTt2YXIgUz1bOTksMTI0LDExOSwxMjMsMjQyLDEwNywxMTEsMTk3LDQ4LDEsMTAzLDQzLDI1NCwyMTUsMTcxLDExOCwyMDIsMTMwLDIwMSwxMjUsMjUwLDg5LDcxLDI0MCwxNzMsMjEyLDE2MiwxNzUsMTU2LDE2NCwxMTQsMTkyLDE4MywyNTMsMTQ3LDM4LDU0LDYzLDI0NywyMDQsNTIsMTY1LDIyOSwyNDEsMTEzLDIxNiw0OSwyMSw0LDE5OSwzNSwxOTUsMjQsMTUwLDUsMTU0LDcsMTgsMTI4LDIyNiwyMzUsMzksMTc4LDExNyw5LDEzMSw0NCwyNiwyNywxMTAsOTAsMTYwLDgyLDU5LDIxNCwxNzksNDEsMjI3LDQ3LDEzMiw4MywyMDksMCwyMzcsMzIsMjUyLDE3Nyw5MSwxMDYsMjAzLDE5MCw1Nyw3NCw3Niw4OCwyMDcsMjA4LDIzOSwxNzAsMjUxLDY3LDc3LDUxLDEzMyw2OSwyNDksMiwxMjcsODAsNjAsMTU5LDE2OCw4MSwxNjMsNjQsMTQzLDE0NiwxNTcsNTYsMjQ1LDE4OCwxODIsMjE4LDMzLDE2LDI1NSwyNDMsMjEwLDIwNSwxMiwxOSwyMzYsOTUsMTUxLDY4LDIzLDE5NiwxNjcsMTI2LDYxLDEwMCw5MywyNSwxMTUsOTYsMTI5LDc5LDIyMCwzNCw0MiwxNDQsMTM2LDcwLDIzOCwxODQsMjAsMjIyLDk0LDExLDIxOSwyMjQsNTAsNTgsMTAsNzMsNiwzNiw5MiwxOTQsMjExLDE3Miw5OCwxNDUsMTQ5LDIyOCwxMjEsMjMxLDIwMCw1NSwxMDksMTQxLDIxMyw3OCwxNjksMTA4LDg2LDI0NCwyMzQsMTAxLDEyMiwxNzQsOCwxODYsMTIwLDM3LDQ2LDI4LDE2NiwxODAsMTk4LDIzMiwyMjEsMTE2LDMxLDc1LDE4OSwxMzksMTM4LDExMiw2MiwxODEsMTAyLDcyLDMsMjQ2LDE0LDk3LDUzLDg3LDE4NSwxMzQsMTkzLDI5LDE1OCwyMjUsMjQ4LDE1MiwxNywxMDUsMjE3LDE0MiwxNDgsMTU1LDMwLDEzNSwyMzMsMjA2LDg1LDQwLDIyMywxNDAsMTYxLDEzNywxMywxOTEsMjMwLDY2LDEwNCw2NSwxNTMsNDUsMTUsMTc2LDg0LDE4NywyMl07dmFyIFNpPVs4Miw5LDEwNiwyMTMsNDgsNTQsMTY1LDU2LDE5MSw2NCwxNjMsMTU4LDEyOSwyNDMsMjE1LDI1MSwxMjQsMjI3LDU3LDEzMCwxNTUsNDcsMjU1LDEzNSw1MiwxNDIsNjcsNjgsMTk2LDIyMiwyMzMsMjAzLDg0LDEyMywxNDgsNTAsMTY2LDE5NCwzNSw2MSwyMzgsNzYsMTQ5LDExLDY2LDI1MCwxOTUsNzgsOCw0NiwxNjEsMTAyLDQwLDIxNywzNiwxNzgsMTE4LDkxLDE2Miw3MywxMDksMTM5LDIwOSwzNywxMTQsMjQ4LDI0NiwxMDAsMTM0LDEwNCwxNTIsMjIsMjEyLDE2NCw5MiwyMDQsOTMsMTAxLDE4MiwxNDYsMTA4LDExMiw3Miw4MCwyNTMsMjM3LDE4NSwyMTgsOTQsMjEsNzAsODcsMTY3LDE0MSwxNTcsMTMyLDE0NCwyMTYsMTcxLDAsMTQwLDE4OCwyMTEsMTAsMjQ3LDIyOCw4OCw1LDE4NCwxNzksNjksNiwyMDgsNDQsMzAsMTQzLDIwMiw2MywxNSwyLDE5MywxNzUsMTg5LDMsMSwxOSwxMzgsMTA3LDU4LDE0NSwxNyw2NSw3OSwxMDMsMjIwLDIzNCwxNTEsMjQyLDIwNywyMDYsMjQwLDE4MCwyMzAsMTE1LDE1MCwxNzIsMTE2LDM0LDIzMSwxNzMsNTMsMTMzLDIyNiwyNDksNTUsMjMyLDI4LDExNywyMjMsMTEwLDcxLDI0MSwyNiwxMTMsMjksNDEsMTk3LDEzNywxMTEsMTgzLDk4LDE0LDE3MCwyNCwxOTAsMjcsMjUyLDg2LDYyLDc1LDE5OCwyMTAsMTIxLDMyLDE1NCwyMTksMTkyLDI1NCwxMjAsMjA1LDkwLDI0NCwzMSwyMjEsMTY4LDUxLDEzNiw3LDE5OSw0OSwxNzcsMTgsMTYsODksMzksMTI4LDIzNiw5NSw5Niw4MSwxMjcsMTY5LDI1LDE4MSw3NCwxMyw0NSwyMjksMTIyLDE1OSwxNDcsMjAxLDE1NiwyMzksMTYwLDIyNCw1OSw3NywxNzQsNDIsMjQ1LDE3NiwyMDAsMjM1LDE4Nyw2MCwxMzEsODMsMTUzLDk3LDIzLDQzLDQsMTI2LDE4NiwxMTksMjE0LDM4LDIyNSwxMDUsMjAsOTksODUsMzMsMTIsMTI1XTt2YXIgVDE9WzMzMjg0MDIzNDEsNDE2ODkwNzkwOCw0MDAwODA2ODA5LDQxMzUyODc2OTMsNDI5NDExMTc1NywzNTk3MzY0MTU3LDM3MzE4NDUwNDEsMjQ0NTY1NzQyOCwxNjEzNzcwODMyLDMzNjIwMjI3LDM0NjI4ODMyNDEsMTQ0NTY2OTc1NywzODkyMjQ4MDg5LDMwNTA4MjE0NzQsMTMwMzA5NjI5NCwzOTY3MTg2NTg2LDI0MTI0MzE5NDEsNTI4NjQ2ODEzLDIzMTE3MDI4NDgsNDIwMjUyODEzNSw0MDI2MjAyNjQ1LDI5OTIyMDAxNzEsMjM4NzAzNjEwNSw0MjI2ODcxMzA3LDExMDE5MDEyOTIsMzAxNzA2OTY3MSwxNjA0NDk0MDc3LDExNjkxNDE3MzgsNTk3NDY2MzAzLDE0MDMyOTkwNjMsMzgzMjcwNTY4NiwyNjEzMTAwNjM1LDE5NzQ5NzQ0MDIsMzc5MTUxOTAwNCwxMDMzMDgxNzc0LDEyNzc1Njg2MTgsMTgxNTQ5MjE4NiwyMTE4MDc0MTc3LDQxMjY2Njg1NDYsMjIxMTIzNjk0MywxNzQ4MjUxNzQwLDEzNjk4MTA0MjAsMzUyMTUwNDU2NCw0MTkzMzgyNjY0LDM3OTkwODU0NTksMjg4MzExNTEyMywxNjQ3MzkxMDU5LDcwNjAyNDc2NywxMzQ0ODA5MDgsMjUxMjg5Nzg3NCwxMTc2NzA3OTQxLDI2NDY4NTI0NDYsODA2ODg1NDE2LDkzMjYxNTg0MSwxNjgxMDExMzUsNzk4NjYxMzAxLDIzNTM0MTU3Nyw2MDUxNjQwODYsNDYxNDA2MzYzLDM3NTYxODgyMjEsMzQ1NDc5MDQzOCwxMzExMTg4ODQxLDIxNDI0MTc2MTMsMzkzMzU2NjM2NywzMDI1ODIwNDMsNDk1MTU4MTc0LDE0NzkyODk5NzIsODc0MTI1ODcwLDkwNzc0NjA5MywzNjk4MjI0ODE4LDMwMjU4MjAzOTgsMTUzNzI1MzYyNywyNzU2ODU4NjE0LDE5ODM1OTMyOTMsMzA4NDMxMDExMywyMTA4OTI4OTc0LDEzNzg0MjkzMDcsMzcyMjY5OTU4MiwxNTgwMTUwNjQxLDMyNzQ1MTc5OSwyNzkwNDc4ODM3LDMxMTc1MzU1OTIsMCwzMjUzNTk1NDM2LDEwNzU4NDcyNjQsMzgyNTAwNzY0NywyMDQxNjg4NTIwLDMwNTk0NDA2MjEsMzU2Mzc0MzkzNCwyMzc4OTQzMzAyLDE3NDA1NTM5NDUsMTkxNjM1Mjg0MywyNDg3ODk2Nzk4LDI1NTUxMzcyMzYsMjk1ODU3OTk0NCwyMjQ0OTg4NzQ2LDMxNTEwMjQyMzUsMzMyMDgzNTg4MiwxMzM2NTg0OTMzLDM5OTI3MTQwMDYsMjI1MjU1NTIwNSwyNTg4NzU3NDYzLDE3MTQ2MzE1MDksMjkzOTYzMTU2LDIzMTk3OTU2NjMsMzkyNTQ3MzU1Miw2NzI0MDQ1NCw0MjY5NzY4NTc3LDI2ODk2MTgxNjAsMjAxNzIxMzUwOCw2MzEyMTgxMDYsMTI2OTM0NDQ4MywyNzIzMjM4Mzg3LDE1NzEwMDU0MzgsMjE1MTY5NDUyOCw5MzI5NDQ3NCwxMDY2NTcwNDEzLDU2Mzk3NzY2MCwxODgyNzMyNjE2LDQwNTk0MjgxMDAsMTY3MzMxMzUwMywyMDA4NDYzMDQxLDI5NTAzNTU1NzMsMTEwOTQ2NzQ5MSw1Mzc5MjM2MzIsMzg1ODc1OTQ1MCw0MjYwNjIzMTE4LDMyMTgyNjQ2ODUsMjE3Nzc0ODMwMCw0MDM0NDI3MDgsNjM4Nzg0MzA5LDMyODcwODQwNzksMzE5MzkyMTUwNSw4OTkxMjcyMDIsMjI4NjE3NTQzNiw3NzMyNjUyMDksMjQ3OTE0NjA3MSwxNDM3MDUwODY2LDQyMzYxNDgzNTQsMjA1MDgzMzczNSwzMzYyMDIyNTcyLDMxMjY2ODEwNjMsODQwNTA1NjQzLDM4NjYzMjU5MDksMzIyNzU0MTY2NCw0Mjc5MTc3MjAsMjY1NTk5NzkwNSwyNzQ5MTYwNTc1LDExNDMwODc3MTgsMTQxMjA0OTUzNCw5OTkzMjk5NjMsMTkzNDk3MjE5LDIzNTM0MTU4ODIsMzM1NDMyNDUyMSwxODA3MjY4MDUxLDY3MjQwNDU0MCwyODE2NDAxMDE3LDMxNjAzMDEyODIsMzY5ODIyNDkzLDI5MTY4NjY5MzQsMzY4ODk0Nzc3MSwxNjgxMDExMjg2LDE5NDk5NzMwNzAsMzM2MjAyMjcwLDI0NTQyNzY1NzEsMjAxNzIxMzU0LDEyMTAzMjgxNzIsMzA5MzA2MDgzNiwyNjgwMzQxMDg1LDMxODQ3NzYwNDYsMTEzNTM4OTkzNSwzMjk0NzgyMTE4LDk2NTg0MTMyMCw4MzE4ODY3NTYsMzU1NDk5MzIwNyw0MDY4MDQ3MjQzLDM1ODg3NDUwMTAsMjM0NTE5MTQ5MSwxODQ5MTEyNDA5LDM2NjQ2MDQ1OTksMjYwNTQwMjgsMjk4MzU4MTAyOCwyNjIyMzc3NjgyLDEyMzU4NTU4NDAsMzYzMDk4NDM3MiwyODkxMzM5NTE0LDQwOTI5MTY3NDMsMzQ4ODI3OTA3NywzMzk1NjQyNzk5LDQxMDE2Njc0NzAsMTIwMjYzMDM3NywyNjg5NjE4MTYsMTg3NDUwODUwMSw0MDM0NDI3MDE2LDEyNDM5NDgzOTksMTU0NjUzMDQxOCw5NDEzNjYzMDgsMTQ3MDUzOTUwNSwxOTQxMjIyNTk5LDI1NDYzODY1MTMsMzQyMTAzODYyNywyNzE1NjcxOTMyLDM4OTk5NDYxNDAsMTA0MjIyNjk3NywyNTIxNTE3MDIxLDE2Mzk4MjQ4NjAsMjI3MjQ5MDMwLDI2MDczNzY2OSwzNzY1NDY1MjMyLDIwODQ0NTM5NTQsMTkwNzczMzk1NiwzNDI5MjYzMDE4LDI0MjA2NTYzNDQsMTAwODYwNjc3LDQxNjAxNTcxODUsNDcwNjgzMTU0LDMyNjExNjE4OTEsMTc4MTg3MTk2NywyOTI0OTU5NzM3LDE3NzM3Nzk0MDgsMzk0NjkyMjQxLDI1Nzk2MTE5OTIsOTc0OTg2NTM1LDY2NDcwNjc0NSwzNjU1NDU5MTI4LDM5NTg5NjIxOTUsNzMxNDIwODUxLDU3MTU0Mzg1OSwzNTMwMTIzNzA3LDI4NDk2MjY0ODAsMTI2NzgzMTEzLDg2NTM3NTM5OSw3NjUxNzI2NjIsMTAwODYwNjc1NCwzNjEyMDM2MDIsMzM4NzU0OTk4NCwyMjc4NDc3Mzg1LDI4NTc3MTkyOTUsMTM0NDgwOTA4MCwyNzgyOTEyMzc4LDU5NTQyNjcxLDE1MDM3NjQ5ODQsMTYwMDA4NTc2LDQzNzA2MjkzNSwxNzA3MDY1MzA2LDM2MjIyMzM2NDksMjIxODkzNDk4MiwzNDk2NTAzNDgwLDIxODUzMTQ3NTUsNjk3OTMyMjA4LDE1MTI5MTAxOTksNTA0MzAzMzc3LDIwNzUxNzcxNjMsMjgyNDA5OTA2OCwxODQxMDE5ODYyLDczOTY0NDk4Nl07dmFyIFQyPVsyNzgxMjQyMjExLDIyMzA4NzczMDgsMjU4MjU0MjE5OSwyMzgxNzQwOTIzLDIzNDg3NzY4MiwzMTg0OTQ2MDI3LDI5ODQxNDQ3NTEsMTQxODgzOTQ5MywxMzQ4NDgxMDcyLDUwNDYyOTc3LDI4NDg4NzYzOTEsMjEwMjc5OTE0Nyw0MzQ2MzQ0OTQsMTY1NjA4NDQzOSwzODYzODQ5ODk5LDI1OTkxODgwODYsMTE2NzA1MTQ2NiwyNjM2MDg3OTM4LDEwODI3NzE5MTMsMjI4MTM0MDI4NSwzNjgwNDg4OTAsMzk1NDMzNDA0MSwzMzgxNTQ0Nzc1LDIwMTA2MDU5MiwzOTYzNzI3Mjc3LDE3Mzk4Mzg2NzYsNDI1MDkwMzIwMiwzOTMwNDM1NTAzLDMyMDY3ODIxMDgsNDE0OTQ1Mzk4OCwyNTMxNTUzOTA2LDE1MzY5MzQwODAsMzI2MjQ5NDY0Nyw0ODQ1NzI2NjksMjkyMzI3MTA1OSwxNzgzMzc1Mzk4LDE1MTcwNDEyMDYsMTA5ODc5Mjc2Nyw0OTY3NDIzMSwxMzM0MDM3NzA4LDE1NTAzMzI5ODAsNDA5ODk5MTUyNSw4ODYxNzExMDksMTUwNTk4MTI5LDI0ODEwOTA5MjksMTk0MDY0MjAwOCwxMzk4OTQ0MDQ5LDEwNTk3MjI1MTcsMjAxODUxOTA4LDEzODU1NDc3MTksMTY5OTA5NTMzMSwxNTg3Mzk3NTcxLDY3NDI0MDUzNiwyNzA0Nzc0ODA2LDI1MjMxNDg4NSwzMDM5Nzk1ODY2LDE1MTkxNDI0Nyw5MDgzMzM1ODYsMjYwMjI3MDg0OCwxMDM4MDgyNzg2LDY1MTAyOTQ4MywxNzY2NzI5NTExLDM0NDc2OTgwOTgsMjY4Mjk0MjgzNyw0NTQxNjY3OTMsMjY1MjczNDMzOSwxOTUxOTM1NTMyLDc3NTE2NjQ5MCw3NTg1MjA2MDMsMzAwMDc5MDYzOCw0MDA0Nzk3MDE4LDQyMTcwODYxMTIsNDEzNzk2NDExNCwxMjk5NTk0MDQzLDE2Mzk0MzgwMzgsMzQ2NDM0NDQ5OSwyMDY4OTgyMDU3LDEwNTQ3MjkxODcsMTkwMTk5Nzg3MSwyNTM0NjM4NzI0LDQxMjEzMTgyMjcsMTc1NzAwODMzNywwLDc1MDkwNjg2MSwxNjE0ODE1MjY0LDUzNTAzNTEzMiwzMzYzNDE4NTQ1LDM5ODgxNTExMzEsMzIwMTU5MTkxNCwxMTgzNjk3ODY3LDM2NDc0NTQ5MTAsMTI2NTc3Njk1MywzNzM0MjYwMjk4LDM1NjY3NTA3OTYsMzkwMzg3MTA2NCwxMjUwMjgzNDcxLDE4MDc0NzA4MDAsNzE3NjE1MDg3LDM4NDcyMDM0OTgsMzg0Njk1MjkxLDMzMTM5MTA1OTUsMzYxNzIxMzc3MywxNDMyNzYxMTM5LDI0ODQxNzYyNjEsMzQ4MTk0NTQxMywyODM3NjkzMzcsMTAwOTI1OTU0LDIxODA5Mzk2NDcsNDAzNzAzODE2MCwxMTQ4NzMwNDI4LDMxMjMwMjc4NzEsMzgxMzM4NjQwOCw0MDg3NTAxMTM3LDQyNjc1NDk2MDMsMzIyOTYzMDUyOCwyMzE1NjIwMjM5LDI5MDY2MjQ2NTgsMzE1NjMxOTY0NSwxMjE1MzEzOTc2LDgyOTY2MDA1LDM3NDc4NTU1NDgsMzI0NTg0ODI0NiwxOTc0NDU5MDk4LDE2NjUyNzgyNDEsODA3NDA3NjMyLDQ1MTI4MDg5NSwyNTE1MjQwODMsMTg0MTI4Nzg5MCwxMjgzNTc1MjQ1LDMzNzEyMDI2OCw4OTE2ODc2OTksODAxMzY5MzI0LDM3ODczNDk4NTUsMjcyMTQyMTIwNywzNDMxNDgyNDM2LDk1OTMyMTg3OSwxNDY5MzAxOTU2LDQwNjU2OTk3NTEsMjE5NzU4NTUzNCwxMTk5MTkzNDA1LDI4OTg4MTQwNTIsMzg4Nzc1MDQ5Myw3MjQ3MDM1MTMsMjUxNDkwODAxOSwyNjk2OTYyMTQ0LDI1NTE4MDgzODUsMzUxNjgxMzEzNSwyMTQxNDQ1MzQwLDE3MTU3NDEyMTgsMjExOTQ0NTAzNCwyODcyODA3NTY4LDIxOTg1NzExNDQsMzM5ODE5MDY2Miw3MDA5Njg2ODYsMzU0NzA1MjIxNiwxMDA5MjU5NTQwLDIwNDEwNDQ3MDIsMzgwMzk5NTc0Miw0ODc5ODM4ODMsMTk5MTEwNTQ5OSwxMDA0MjY1Njk2LDE0NDk0MDcwMjYsMTMxNjIzOTkzMCw1MDQ2Mjk3NzAsMzY4Mzc5NzMyMSwxNjg1NjAxMzQsMTgxNjY2NzE3MiwzODM3Mjg3NTE2LDE1NzA3NTExNzAsMTg1NzkzNDI5MSw0MDE0MTg5NzQwLDI3OTc4ODgwOTgsMjgyMjM0NTEwNSwyNzU0NzEyOTgxLDkzNjYzMzU3MiwyMzQ3OTIzODMzLDg1Mjg3OTMzNSwxMTMzMjM0Mzc2LDE1MDAzOTUzMTksMzA4NDU0NTM4OSwyMzQ4OTEyMDEzLDE2ODkzNzYyMTMsMzUzMzQ1OTAyMiwzNzYyOTIzOTQ1LDMwMzQwODI0MTIsNDIwNTU5ODI5NCwxMzM0Mjg0NjgsNjM0MzgzMDgyLDI5NDkyNzcwMjksMjM5ODM4NjgxMCwzOTEzNzg5MTAyLDQwMzcwMzgxNiwzNTgwODY5MzA2LDIyOTc0NjA4NTYsMTg2NzEzMDE0OSwxOTE4NjQzNzU4LDYwNzY1Njk4OCw0MDQ5MDUzMzUwLDMzNDYyNDg4ODQsMTM2ODkwMTMxOCw2MDA1NjU5OTIsMjA5MDk4Mjg3NywyNjMyNDc5ODYwLDU1NzcxOTMyNywzNzE3NjE0NDExLDM2OTczOTMwODUsMjI0OTAzNDYzNSwyMjMyMzg4MjM0LDI0MzA2Mjc5NTIsMTExNTQzODY1NCwzMjk1Nzg2NDIxLDI4NjU1MjIyNzgsMzYzMzMzNDM0NCw4NDI4MDA2NywzMzAyNzgzMCwzMDM4Mjg0OTQsMjc0NzQyNTEyMSwxNjAwNzk1OTU3LDQxODg5NTI0MDcsMzQ5NjU4OTc1MywyNDM0MjM4MDg2LDE0ODY0NzE2MTcsNjU4MTE5OTY1LDMxMDYzODE0NzAsOTUzODAzMjMzLDMzNDIzMTgwMCwzMDA1OTc4Nzc2LDg1Nzg3MDYwOSwzMTUxMTI4OTM3LDE4OTAxNzk1NDUsMjI5ODk3MzgzOCwyODA1MTc1NDQ0LDMwNTY0NDIyNjcsNTc0MzY1MjE0LDI0NTA4ODQ0ODcsNTUwMTAzNTI5LDEyMzM2MzcwNzAsNDI4OTM1MzA0NSwyMDE4NTE5MDgwLDIwNTc2OTExMDMsMjM5OTM3NDQ3Niw0MTY2NjIzNjQ5LDIxNDgxMDg2ODEsMzg3NTgzMjQ1LDM2NjQxMDEzMTEsODM2MjMyOTM0LDMzMzA1NTY0ODIsMzEwMDY2NTk2MCwzMjgwMDkzNTA1LDI5NTU1MTYzMTMsMjAwMjM5ODUwOSwyODcxODI2MDcsMzQxMzg4MTAwOCw0MjM4ODkwMDY4LDM1OTc1MTU3MDcsOTc1OTY3NzY2XTt2YXIgVDM9WzE2NzE4MDg2MTEsMjA4OTA4OTE0OCwyMDA2NTc2NzU5LDIwNzI5MDEyNDMsNDA2MTAwMzc2MiwxODA3NjAzMzA3LDE4NzM5Mjc3OTEsMzMxMDY1Mzg5Myw4MTA1NzM4NzIsMTY5NzQzMzcsMTczOTE4MTY3MSw3Mjk2MzQzNDcsNDI2MzExMDY1NCwzNjEzNTcwNTE5LDI4ODM5OTcwOTksMTk4OTg2NDU2NiwzMzkzNTU2NDI2LDIxOTEzMzUyOTgsMzM3NjQ0OTk5MywyMTA2MDYzNDg1LDQxOTU3NDE2OTAsMTUwODYxODg0MSwxMjA0MzkxNDk1LDQwMjczMTcyMzIsMjkxNzk0MTY3NywzNTYzNTY2MDM2LDI3MzQ1MTQwODIsMjk1MTM2NjA2MywyNjI5NzcyMTg4LDI3Njc2NzIyMjgsMTkyMjQ5MTUwNiwzMjI3MjI5MTIwLDMwODI5NzQ2NDcsNDI0NjUyODUwOSwyNDc3NjY5Nzc5LDY0NDUwMDUxOCw5MTE4OTU2MDYsMTA2MTI1Njc2Nyw0MTQ0MTY2MzkxLDM0Mjc3NjMxNDgsODc4NDcxMjIwLDI3ODQyNTIzMjUsMzg0NTQ0NDA2OSw0MDQzODk3MzI5LDE5MDU1MTcxNjksMzYzMTQ1OTI4OCw4Mjc1NDgyMDksMzU2NDYxMDc3LDY3ODk3MzQ4LDMzNDQwNzgyNzksNTkzODM5NjUxLDMyNzc3NTc4OTEsNDA1Mjg2OTM2LDI1MjcxNDc5MjYsODQ4NzE2ODUsMjU5NTU2NTQ2NiwxMTgwMzM5MjcsMzA1NTM4MDY2LDIxNTc2NDg3NjgsMzc5NTcwNTgyNiwzOTQ1MTg4ODQzLDY2MTIxMjcxMSwyOTk5ODEyMDE4LDE5NzM0MTQ1MTcsMTUyNzY5MDMzLDIyMDgxNzc1MzksNzQ1ODIyMjUyLDQzOTIzNTYxMCw0NTU5NDc4MDMsMTg1NzIxNTU5OCwxNTI1NTkzMTc4LDI3MDA4Mjc1NTIsMTM5MTg5NTYzNCw5OTQ5MzIyODMsMzU5NjcyODI3OCwzMDE2NjU0MjU5LDY5NTk0NzgxNywzODEyNTQ4MDY3LDc5NTk1ODgzMSwyMjI0NDkzNDQ0LDE0MDg2MDc4MjcsMzUxMzMwMTQ1NywwLDM5NzkxMzM0MjEsNTQzMTc4Nzg0LDQyMjk5NDg0MTIsMjk4MjcwNTU4NSwxNTQyMzA1MzcxLDE3OTA4OTExMTQsMzQxMDM5ODY2NywzMjAxOTE4OTEwLDk2MTI0NTc1MywxMjU2MTAwOTM4LDEyODkwMDEwMzYsMTQ5MTY0NDUwNCwzNDc3NzY3NjMxLDM0OTY3MjEzNjAsNDAxMjU1NzgwNywyODY3MTU0ODU4LDQyMTI1ODM5MzEsMTEzNzAxODQzNSwxMzA1OTc1MzczLDg2MTIzNDczOSwyMjQxMDczNTQxLDExNzEyMjkyNTMsNDE3ODYzNTI1NywzMzk0ODY3NCwyMTM5MjI1NzI3LDEzNTc5NDY5NjAsMTAxMTEyMDE4OCwyNjc5Nzc2NjcxLDI4MzM0NjgzMjgsMTM3NDkyMTI5NywyNzUxMzU2MzIzLDEwODYzNTc1NjgsMjQwODE4NzI3OSwyNDYwODI3NTM4LDI2NDYzNTIyODUsOTQ0MjcxNDE2LDQxMTA3NDIwMDUsMzE2ODc1NjY2OCwzMDY2MTMyNDA2LDM2NjUxNDU4MTgsNTYwMTUzMTIxLDI3MTU4OTM5Miw0Mjc5OTUyODk1LDQwNzc4NDYwMDMsMzUzMDQwNzg5MCwzNDQ0MzQzMjQ1LDIwMjY0MzQ2OCwzMjIyNTAyNTksMzk2MjU1MzMyNCwxNjA4NjI5ODU1LDI1NDM5OTAxNjcsMTE1NDI1NDkxNiwzODk2MjMzMTksMzI5NDA3Mzc5NiwyODE3Njc2NzExLDIxMjI1MTM1MzQsMTAyODA5NDUyNSwxNjg5MDQ1MDkyLDE1NzU0Njc2MTMsNDIyMjYxMjczLDE5MzkyMDM2OTksMTYyMTE0Nzc0NCwyMTc0MjI4ODY1LDEzMzkxMzc2MTUsMzY5OTM1MjU0MCw1NzcxMjc0NTgsNzEyOTIyMTU0LDI0MjcxNDEwMDgsMjI5MDI4OTU0NCwxMTg3Njc5MzAyLDM5OTU3MTU1NjYsMzEwMDg2MzQxNiwzMzk0ODY3NDAsMzczMjUxNDc4MiwxNTkxOTE3NjYyLDE4NjQ1NTU2MywzNjgxOTg4MDU5LDM3NjIwMTkyOTYsODQ0NTIyNTQ2LDk3ODIyMDA5MCwxNjk3NDMzNzAsMTIzOTEyNjYwMSwxMDEzMjE3MzQsNjExMDc2MTMyLDE1NTg0OTMyNzYsMzI2MDkxNTY1MCwzNTQ3MjUwMTMxLDI5MDEzNjE1ODAsMTY1NTA5NjQxOCwyNDQzNzIxMTA1LDI1MTA1NjU3ODEsMzgyODg2Mzk3MiwyMDM5MjE0NzEzLDM4Nzg4Njg0NTUsMzM1OTg2OTg5Niw5Mjg2MDc3OTksMTg0MDc2NTU0OSwyMzc0NzYyODkzLDM1ODAxNDYxMzMsMTMyMjQyNTQyMiwyODUwMDQ4NDI1LDE4MjM3OTEyMTIsMTQ1OTI2ODY5NCw0MDk0MTYxOTA4LDM5MjgzNDY2MDIsMTcwNjAxOTQyOSwyMDU2MTg5MDUwLDI5MzQ1MjM4MjIsMTM1Nzk0Njk2LDMxMzQ1NDk5NDYsMjAyMjI0MDM3Niw2MjgwNTA0NjksNzc5MjQ2NjM4LDQ3MjEzNTcwOCwyODAwODM0NDcwLDMwMzI5NzAxNjQsMzMyNzIzNjAzOCwzODk0NjYwMDcyLDM3MTU5MzI2MzcsMTk1NjQ0MDE4MCw1MjIyNzIyODcsMTI3MjgxMzEzMSwzMTg1MzM2NzY1LDIzNDA4MTgzMTUsMjMyMzk3NjA3NCwxODg4NTQyODMyLDEwNDQ1NDQ1NzQsMzA0OTU1MDI2MSwxNzIyNDY5NDc4LDEyMjIxNTIyNjQsNTA2NjA4NjcsNDEyNzMyNDE1MCwyMzYwNjc4NTQsMTYzODEyMjA4MSw4OTU0NDU1NTcsMTQ3NTk4MDg4NywzMTE3NDQzNTEzLDIyNTc2NTU2ODYsMzI0MzgwOTIxNyw0ODkxMTAwNDUsMjY2MjkzNDQzMCwzNzc4NTk5MzkzLDQxNjIwNTUxNjAsMjU2MTg3ODkzNiwyODg1NjM3MjksMTc3MzkxNjc3NywzNjQ4MDM5Mzg1LDIzOTEzNDUwMzgsMjQ5Mzk4NTY4NCwyNjEyNDA3NzA3LDUwNTU2MDA5NCwyMjc0NDk3OTI3LDM5MTEyNDAxNjksMzQ2MDkyNTM5MCwxNDQyODE4NjQ1LDY3ODk3MzQ4MCwzNzQ5MzU3MDIzLDIzNTgxODI3OTYsMjcxNzQwNzY0OSwyMzA2ODY5NjQxLDIxOTYxNzgwNSwzMjE4NzYxMTUxLDM4NjIwMjYyMTQsMTEyMDMwNjI0MiwxNzU2OTQyNDQwLDExMDMzMzE5MDUsMjU3ODQ1OTAzMyw3NjI3OTY1ODksMjUyNzgwMDQ3LDI5NjYxMjU0ODgsMTQyNTg0NDMwOCwzMTUxMzkyMTg3LDM3MjkxMTEyNl07dmFyIFQ0PVsxNjY3NDc0ODg2LDIwODg1MzUyODgsMjAwNDMyNjg5NCwyMDcxNjk0ODM4LDQwNzU5NDk1NjcsMTgwMjIyMzA2MiwxODY5NTkxMDA2LDMzMTgwNDM3OTMsODA4NDcyNjcyLDE2ODQzNTIyLDE3MzQ4NDY5MjYsNzI0MjcwNDIyLDQyNzgwNjU2MzksMzYyMTIxNjk0OSwyODgwMTY5NTQ5LDE5ODc0ODQzOTYsMzQwMjI1MzcxMSwyMTg5NTk3OTgzLDMzODU0MDk2NzMsMjEwNTM3ODgxMCw0MjEwNjkzNjE1LDE0OTkwNjUyNjYsMTE5NTg4Njk5MCw0MDQyMjYzNTQ3LDI5MTM4NTY1NzcsMzU3MDY4OTk3MSwyNzI4NTkwNjg3LDI5NDc1NDE1NzMsMjYyNzUxODI0MywyNzYyMjc0NjQzLDE5MjAxMTIzNTYsMzIzMzgzMTgzNSwzMDgyMjczMzk3LDQyNjEyMjM2NDksMjQ3NTkyOTE0OSw2NDAwNTE3ODgsOTA5NTMxNzU2LDEwNjExMTAxNDIsNDE2MDE2MDUwMSwzNDM1OTQxNzYzLDg3NTg0Njc2MCwyNzc5MTE2NjI1LDM4NTcwMDM3MjksNDA1OTEwNTUyOSwxOTAzMjY4ODM0LDM2MzgwNjQwNDMsODI1MzE2MTk0LDM1MzcxMzk2Miw2NzM3NDA4OCwzMzUxNzI4Nzg5LDU4OTUyMjI0NiwzMjg0MzYwODYxLDQwNDIzNjMzNiwyNTI2NDU0MDcxLDg0MjE3NjEwLDI1OTM4MzAxOTEsMTE3OTAxNTgyLDMwMzE4MzM5NiwyMTU1OTExOTYzLDM4MDY0Nzc3OTEsMzk1ODA1NjY1Myw2NTY4OTQyODYsMjk5ODA2MjQ2MywxOTcwNjQyOTIyLDE1MTU5MTY5OCwyMjA2NDQwOTg5LDc0MTExMDg3Miw0Mzc5MjMzODAsNDU0NzY1ODc4LDE4NTI3NDg1MDgsMTUxNTkwODc4OCwyNjk0OTA0NjY3LDEzODExNjg4MDQsOTkzNzQyMTk4LDM2MDQzNzM5NDMsMzAxNDkwNTQ2OSw2OTA1ODQ0MDIsMzgyMzMyMDc5Nyw3OTE2MzgzNjYsMjIyMzI4MTkzOSwxMzk4MDExMzAyLDM1MjAxNjE5NzcsMCwzOTkxNzQzNjgxLDUzODk5MjcwNCw0MjQ0MzgxNjY3LDI5ODEyMTg0MjUsMTUzMjc1MTI4NiwxNzg1MzgwNTY0LDM0MTkwOTY3MTcsMzIwMDE3ODUzNSw5NjAwNTYxNzgsMTI0NjQyMDYyOCwxMjgwMTAzNTc2LDE0ODIyMjE3NDQsMzQ4NjQ2ODc0MSwzNTAzMzE5OTk1LDQwMjU0Mjg2NzcsMjg2MzMyNjU0Myw0MjI3NTM2NjIxLDExMjg1MTQ5NTAsMTI5Njk0NzA5OCw4NTkwMDIyMTQsMjI0MDEyMzkyMSwxMTYyMjAzMDE4LDQxOTM4NDk1NzcsMzM2ODcwNDQsMjEzOTA2Mjc4MiwxMzQ3NDgxNzYwLDEwMTA1ODI2NDgsMjY3ODA0NTIyMSwyODI5NjQwNTIzLDEzNjQzMjUyODIsMjc0NTQzMzY5MywxMDc3OTg1NDA4LDI0MDg1NDg4NjksMjQ1OTA4NjE0MywyNjQ0MzYwMjI1LDk0MzIxMjY1Niw0MTI2NDc1NTA1LDMxNjY0OTQ1NjMsMzA2NTQzMDM5MSwzNjcxNzUwMDYzLDU1NTgzNjIyNiwyNjk0OTYzNTIsNDI5NDkwODY0NSw0MDkyNzkyNTczLDM1MzcwMDYwMTUsMzQ1Mjc4Mzc0NSwyMDIxMTgxNjgsMzIwMDI1ODk0LDM5NzQ5MDE2OTksMTYwMDExOTIzMCwyNTQzMjk3MDc3LDExNDUzNTk0OTYsMzg3Mzk3OTM0LDMzMDEyMDE4MTEsMjgxMjgwMTYyMSwyMTIyMjIwMjg0LDEwMjc0MjYxNzAsMTY4NDMxOTQzMiwxNTY2NDM1MjU4LDQyMTA3OTg1OCwxOTM2OTU0ODU0LDE2MTY5NDUzNDQsMjE3Mjc1Mzk0NSwxMzMwNjMxMDcwLDM3MDU0MzgxMTUsNTcyNjc5NzQ4LDcwNzQyNzkyNCwyNDI1NDAwMTIzLDIyOTA2NDc4MTksMTE3OTA0NDQ5Miw0MDA4NTg1NjcxLDMwOTkxMjA0OTEsMzM2ODcwNDQwLDM3MzkxMjIwODcsMTU4MzI3NjczMiwxODUyNzc3MTgsMzY4ODU5MzA2OSwzNzcyNzkxNzcxLDg0MjE1OTcxNiw5NzY4OTk3MDAsMTY4NDM1MjIwLDEyMjk1NzcxMDYsMTAxMDU5MDg0LDYwNjM2Njc5MiwxNTQ5NTkxNzM2LDMyNjc1MTc4NTUsMzU1Mzg0OTAyMSwyODk3MDE0NTk1LDE2NTA2MzIzODgsMjQ0MjI0MjEwNSwyNTA5NjEyMDgxLDM4NDAxNjE3NDcsMjAzODAwODgxOCwzODkwNjg4NzI1LDMzNjg1Njc2OTEsOTI2Mzc0MjU0LDE4MzU5MDcwMzQsMjM3NDg2Mzg3MywzNTg3NTMxOTUzLDEzMTM3ODg1NzIsMjg0NjQ4MjUwNSwxODE5MDYzNTEyLDE0NDg1NDA4NDQsNDEwOTYzMzUyMywzOTQxMjEzNjQ3LDE3MDExNjI5NTQsMjA1NDg1MjM0MCwyOTMwNjk4NTY3LDEzNDc0ODE3NiwzMTMyODA2NTExLDIwMjExNjUyOTYsNjIzMjEwMzE0LDc3NDc5NTg2OCw0NzE2MDYzMjgsMjc5NTk1ODYxNSwzMDMxNzQ2NDE5LDMzMzQ4ODU3ODMsMzkwNzUyNzYyNywzNzIyMjgwMDk3LDE5NTM3OTk0MDAsNTIyMTMzODIyLDEyNjMyNjMxMjYsMzE4MzMzNjU0NSwyMzQxMTc2ODQ1LDIzMjQzMzM4MzksMTg4NjQyNTMxMiwxMDQ0MjY3NjQ0LDMwNDg1ODg0MDEsMTcxODAwNDQyOCwxMjEyNzMzNTg0LDUwNTI5NTQyLDQxNDMzMTc0OTUsMjM1ODAzMTY0LDE2MzM3ODg4NjYsODkyNjkwMjgyLDE0NjUzODMzNDIsMzExNTk2MjQ3MywyMjU2OTY1OTExLDMyNTA2NzM4MTcsNDg4NDQ5ODUwLDI2NjEyMDIyMTUsMzc4OTYzMzc1Myw0MTc3MDA3NTk1LDI1NjAxNDQxNzEsMjg2MzM5ODc0LDE3Njg1MzcwNDIsMzY1NDkwNjAyNSwyMzkxNzA1ODYzLDI0OTI3NzAwOTksMjYxMDY3MzE5Nyw1MDUyOTEzMjQsMjI3MzgwODkxNywzOTI0MzY5NjA5LDM0Njk2MjU3MzUsMTQzMTY5OTM3MCw2NzM3NDA4ODAsMzc1NTk2NTA5MywyMzU4MDIxODkxLDI3MTE3NDY2NDksMjMwNzQ4OTgwMSwyMTg5NjE2OTAsMzIxNzAyMTU0MSwzODczODQ1NzE5LDExMTE2NzI0NTIsMTc1MTY5MzUyMCwxMDk0ODI4OTMwLDI1NzY5ODYxNTMsNzU3OTU0Mzk0LDI1MjY0NTY2MiwyOTY0Mzc2NDQzLDE0MTQ4NTU4NDgsMzE0OTY0OTUxNywzNzA1NTU0MzZdO3ZhciBUNT1bMTM3NDk4ODExMiwyMTE4MjE0OTk1LDQzNzc1NzEyMyw5NzU2NTg2NDYsMTAwMTA4OTk5NSw1MzA0MDA3NTMsMjkwMjA4Nzg1MSwxMjczMTY4Nzg3LDU0MDA4MDcyNSwyOTEwMjE5NzY2LDIyOTUxMDEwNzMsNDExMDU2ODQ4NSwxMzQwNDYzMTAwLDMzMDc5MTYyNDcsNjQxMDI1MTUyLDMwNDMxNDA0OTUsMzczNjE2NDkzNyw2MzI5NTM3MDMsMTE3Mjk2NzA2NCwxNTc2OTc2NjA5LDMyNzQ2NjcyNjYsMjE2OTMwMzA1OCwyMzcwMjEzNzk1LDE4MDkwNTQxNTAsNTk3Mjc4NDcsMzYxOTI5ODc3LDMyMTE2MjMxNDcsMjUwNTIwMjEzOCwzNTY5MjU1MjEzLDE0ODQwMDU4NDMsMTIzOTQ0Mzc1MywyMzk1NTg4Njc2LDE5NzU2ODM0MzQsNDEwMjk3NzkxMiwyNTcyNjk3MTk1LDY2NjQ2NDczMywzMjAyNDM3MDQ2LDQwMzU0ODkwNDcsMzM3NDM2MTcwMiwyMTEwNjY3NDQ0LDE2NzU1Nzc4ODAsMzg0MzY5OTA3NCwyNTM4NjgxMTg0LDE2NDk2MzkyMzcsMjk3NjE1MTUyMCwzMTQ0Mzk2NDIwLDQyNjk5MDc5OTYsNDE3ODA2MjIyOCwxODgzNzkzNDk2LDI0MDM3Mjg2NjUsMjQ5NzYwNDc0MywxMzgzODU2MzExLDI4NzY0OTQ2MjcsMTkxNzUxODU2MiwzODEwNDk2MzQzLDE3MTY4OTA0MTAsMzAwMTc1NTY1NSw4MDA0NDA4MzUsMjI2MTA4OTE3OCwzNTQzNTk5MjY5LDgwNzk2MjYxMCw1OTk3NjIzNTQsMzM3NzgzNjIsMzk3NzY3NTM1NiwyMzI4ODI4OTcxLDI4MDk3NzExNTQsNDA3NzM4NDQzMiwxMzE1NTYyMTQ1LDE3MDg4NDgzMzMsMTAxMDM5ODI5LDM1MDk4NzExMzUsMzI5OTI3ODQ3NCw4NzU0NTEyOTMsMjczMzg1NjE2MCw5Mjk4NzY5OCwyNzY3NjQ1NTU3LDE5MzE5NTA2NSwxMDgwMDk0NjM0LDE1ODQ1MDQ1ODIsMzE3ODEwNjk2MSwxMDQyMzg1NjU3LDI1MzEwNjc0NTMsMzcxMTgyOTQyMiwxMzA2OTY3MzY2LDI0MzgyMzc2MjEsMTkwODY5NDI3Nyw2NzU1NjQ2MywxNjE1ODYxMjQ3LDQyOTQ1NjE2NCwzNjAyNzcwMzI3LDIzMDI2OTAyNTIsMTc0MjMxNTEyNywyOTY4MDExNDUzLDEyNjQ1NDY2NCwzODc3MTk4NjQ4LDIwNDMyMTE0ODMsMjcwOTI2MDg3MSwyMDg0NzA0MjMzLDQxNjk0MDgyMDEsMCwxNTk0MTc5ODcsODQxNzM5NTkyLDUwNDQ1OTQzNiwxODE3ODY2ODMwLDQyNDU2MTg2ODMsMjYwMzg4OTUwLDEwMzQ4Njc5OTgsOTA4OTMzNDE1LDE2ODgxMDg1MiwxNzUwOTAyMzA1LDI2MDY0NTM5NjksNjA3NTMwNTU0LDIwMjAwODQ5NywyNDcyMDExNTM1LDMwMzU1MzUwNTgsNDYzMTgwMTkwLDIxNjAxMTcwNzEsMTY0MTgxNjIyNiwxNTE3NzY3NTI5LDQ3MDk0ODM3NCwzODAxMzMyMjM0LDMyMzE3MjIyMTMsMTAwODkxODU5NSwzMDM3NjUyNzcsMjM1NDc0MTg3LDQwNjkyNDY4OTMsNzY2OTQ1NDY1LDMzNzU1Mzg2NCwxNDc1NDE4NTAxLDI5NDM2ODIzODAsNDAwMzA2MTE3OSwyNzQzMDM0MTA5LDQxNDQwNDc3NzUsMTU1MTAzNzg4NCwxMTQ3NTUwNjYxLDE1NDMyMDg1MDAsMjMzNjQzNDU1MCwzNDA4MTE5NTE2LDMwNjkwNDk5NjAsMzEwMjAxMTc0NywzNjEwMzY5MjI2LDExMTM4MTgzODQsMzI4NjcxODA4LDIyMjc1NzMwMjQsMjIzNjIyODczMywzNTM1NDg2NDU2LDI5MzU1NjY4NjUsMzM0MTM5NDI4NSw0OTY5MDYwNTksMzcwMjY2NTQ1OSwyMjY5MDY4NjAsMjAwOTE5NTQ3Miw3MzMxNTY5NzIsMjg0MjczNzA0OSwyOTQ5MzA2ODIsMTIwNjQ3Nzg1OCwyODM1MTIzMzk2LDI3MDAwOTkzNTQsMTQ1MTA0NDA1Niw1NzM4MDQ3ODMsMjI2OTcyODQ1NSwzNjQ0Mzc5NTg1LDIzNjIwOTAyMzgsMjU2NDAzMzMzNCwyODAxMTA3NDA3LDI3NzYyOTI5MDQsMzY2OTQ2MjU2NiwxMDY4MzUxMzk2LDc0MjAzOTAxMiwxMzUwMDc4OTg5LDE3ODQ2NjMxOTUsMTQxNzU2MTY5OCw0MTM2NDQwNzcwLDI0MzAxMjIyMTYsNzc1NTUwODE0LDIxOTM4NjI2NDUsMjY3MzcwNTE1MCwxNzc1Mjc2OTI0LDE4NzYyNDE4MzMsMzQ3NTMxMzMzMSwzMzY2NzU0NjE5LDI3MDA0MDQ4NywzOTAyNTYzMTgyLDM2NzgxMjQ5MjMsMzQ0MTg1MDM3NywxODUxMzMyODUyLDM5Njk1NjIzNjksMjIwMzAzMjIzMiwzODY4NTUyODA1LDI4Njg4OTc0MDYsNTY2MDIxODk2LDQwMTExOTA1MDIsMzEzNTc0MDg4OSwxMjQ4ODAyNTEwLDM5MzYyOTEyODQsNjk5NDMyMTUwLDgzMjg3NzIzMSw3MDg3ODA4NDksMzMzMjc0MDE0NCw4OTk4MzU1ODQsMTk1MTMxNzA0Nyw0MjM2NDI5OTkwLDM3Njc1ODY5OTIsODY2NjM3ODQ1LDQwNDM2MTAxODYsMTEwNjA0MTU5MSwyMTQ0MTYxODA2LDM5NTQ0MTcxMSwxOTg0ODEyNjg1LDExMzk3ODE3MDksMzQzMzcxMjk4MCwzODM1MDM2ODk1LDI2NjQ1NDM3MTUsMTI4MjA1MDA3NSwzMjQwODk0MzkyLDExODEwNDUxMTksMjY0MDI0MzIwNCwyNTk2NTkxNyw0MjAzMTgxMTcxLDQyMTE4MTg3OTgsMzAwOTg3OTM4NiwyNDYzODc5NzYyLDM5MTAxNjE5NzEsMTg0Mjc1OTQ0MywyNTk3ODA2NDc2LDkzMzMwMTM3MCwxNTA5NDMwNDE0LDM5NDM5MDY0NDEsMzQ2NzE5MjMwMiwzMDc2NjM5MDI5LDM3NzY3Njc0NjksMjA1MTUxODc4MCwyNjMxMDY1NDMzLDE0NDE5NTI1NzUsNDA0MDE2NzYxLDE5NDI0MzU3NzUsMTQwODc0OTAzNCwxNjEwNDU5NzM5LDM3NDUzNDUzMDAsMjAxNzc3ODU2NiwzNDAwNTI4NzY5LDMxMTA2NTA5NDIsOTQxODk2NzQ4LDMyNjU0Nzg3NTEsMzcxMDQ5MzMwLDMxNjg5MzcyMjgsNjc1MDM5NjI3LDQyNzkwODAyNTcsOTY3MzExNzI5LDEzNTA1MDIwNiwzNjM1NzMzNjYwLDE2ODM0MDcyNDgsMjA3NjkzNTI2NSwzNTc2ODcwNTEyLDEyMTUwNjExMDgsMzUwMTc0MTg5MF07dmFyIFQ2PVsxMzQ3NTQ4MzI3LDE0MDA3ODMyMDUsMzI3MzI2NzEwOCwyNTIwMzkzNTY2LDM0MDk2ODUzNTUsNDA0NTM4MDkzMywyODgwMjQwMjE2LDI0NzEyMjQwNjcsMTQyODE3MzA1MCw0MTM4NTYzMTgxLDI0NDE2NjE1NTgsNjM2ODEzOTAwLDQyMzMwOTQ2MTUsMzYyMDAyMjk4NywyMTQ5OTg3NjUyLDI0MTEwMjkxNTUsMTIzOTMzMTE2MiwxNzMwNTI1NzIzLDI1NTQ3MTg3MzQsMzc4MTAzMzY2NCw0NjM0NjEwMSwzMTA0NjM3MjgsMjc0Mzk0NDg1NSwzMzI4OTU1Mzg1LDM4NzU3NzAyMDcsMjUwMTIxODk3MiwzOTU1MTkxMTYyLDM2NjcyMTkwMzMsNzY4OTE3MTIzLDM1NDU3ODk0NzMsNjkyNzA3NDMzLDExNTAyMDg0NTYsMTc4NjEwMjQwOSwyMDI5MjkzMTc3LDE4MDUyMTE3MTAsMzcxMDM2ODExMywzMDY1OTYyODMxLDQwMTYzOTU5NywxNzI0NDU3MTMyLDMwMjgxNDM2NzQsNDA5MTk4NDEwLDIxOTYwNTI1MjksMTYyMDUyOTQ1OSwxMTY0MDcxODA3LDM3Njk3MjE5NzUsMjIyNjg3NTMxMCw0ODY0NDEzNzYsMjQ5OTM0ODUyMywxNDgzNzUzNTc2LDQyODgxOTk2NSwyMjc0NjgwNDI4LDMwNzU2MzYyMTYsNTk4NDM4ODY3LDM3OTkxNDExMjIsMTQ3NDUwMjU0Myw3MTEzNDk2NzUsMTI5MTY2MTIwLDUzNDU4MzcwLDI1OTI1MjM2NDMsMjc4MjA4MjgyNCw0MDYzMjQyMzc1LDI5ODg2ODcyNjksMzEyMDY5NDEyMiwxNTU5MDQxNjY2LDczMDUxNzI3NiwyNDYwNDQ5MjA0LDQwNDI0NTkxMjIsMjcwNjI3MDY5MCwzNDQ2MDA0NDY4LDM1NzM5NDE2OTQsNTMzODA0MTMwLDIzMjgxNDM2MTQsMjYzNzQ0MjY0MywyNjk1MDMzNjg1LDgzOTIyNDAzMywxOTczNzQ1Mzg3LDk1NzA1NTk4MCwyODU2MzQ1ODM5LDEwNjg1Mjc2NywxMzcxMzY4OTc2LDQxODE1OTg2MDIsMTAzMzI5NzE1OCwyOTMzNzM0OTE3LDExNzk1MTA0NjEsMzA0NjIwMDQ2MSw5MTM0MTkxNywxODYyNTM0ODY4LDQyODQ1MDIwMzcsNjA1NjU3MzM5LDI1NDc0MzI5MzcsMzQzMTU0Njk0NywyMDAzMjk0NjIyLDMxODI0ODc2MTgsMjI4MjE5NTMzOSw5NTQ2Njk0MDMsMzY4MjE5MTU5OCwxMjAxNzY1Mzg2LDM5MTcyMzQ3MDMsMzM4ODUwNzE2NiwwLDIxOTg0MzgwMjIsMTIxMTI0NzU5NywyODg3NjUxNjk2LDEzMTU3MjM4OTAsNDIyNzY2NTY2MywxNDQzODU3NzIwLDUwNzM1ODkzMyw2NTc4NjE5NDUsMTY3ODM4MTAxNyw1NjA0ODc1OTAsMzUxNjYxOTYwNCw5NzU0NTE2OTQsMjk3MDM1NjMyNywyNjEzMTQ1MzUsMzUzNTA3MjkxOCwyNjUyNjA5NDI1LDEzMzM4MzgwMjEsMjcyNDMyMjMzNiwxNzY3NTM2NDU5LDM3MDkzODM5NCwxODI2MjExMTQsMzg1NDYwNjM3OCwxMTI4MDE0NTYwLDQ4NzcyNTg0NywxODU0NjkxOTcsMjkxODM1Mzg2MywzMTA2NzgwODQwLDMzNTY3NjE3NjksMjIzNzEzMzA4MSwxMjg2NTY3MTc1LDMxNTI5NzYzNDksNDI1NTM1MDYyNCwyNjgzNzY1MDMwLDMxNjAxNzUzNDksMzMwOTU5NDE3MSw4Nzg0NDMzOTAsMTk4ODgzODE4NSwzNzA0MzAwNDg2LDE3NTY4MTg5NDAsMTY3MzA2MTYxNywzNDAzMTAwNjM2LDI3Mjc4NjMwOSwxMDc1MDI1Njk4LDU0NTU3MjM2OSwyMTA1ODg3MjY4LDQxNzQ1NjAwNjEsMjk2Njc5NzMwLDE4NDE3Njg4NjUsMTI2MDIzMjIzOSw0MDkxMzI3MDI0LDM5NjAzMDkzMzAsMzQ5NzUwOTM0NywxODE0ODAzMjIyLDI1NzgwMTg0ODksNDE5NTQ1NjA3Miw1NzUxMzgxNDgsMzI5OTQwOTAzNiw0NDY3NTQ4NzksMzYyOTU0Njc5Niw0MDExOTk2MDQ4LDMzNDc1MzIxMTAsMzI1MjIzODU0NSw0MjcwNjM5Nzc4LDkxNTk4NTQxOSwzNDgzODI1NTM3LDY4MTkzMzUzNCw2NTE4NjgwNDYsMjc1NTYzNjY3MSwzODI4MTAzODM3LDIyMzM3NzU1NCwyNjA3NDM5ODIwLDE2NDk3MDQ1MTgsMzI3MDkzNzg3NSwzOTAxODA2Nzc2LDE1ODAwODc3OTksNDExODk4NzY5NSwzMTk4MTE1MjAwLDIwODczMDk0NTksMjg0MjY3ODU3MywzMDE2Njk3MTA2LDEwMDMwMDcxMjksMjgwMjg0OTkxNywxODYwNzM4MTQ3LDIwNzc5NjUyNDMsMTY0NDM5NjcyLDQxMDA4NzI0NzIsMzIyODMzMTksMjgyNzE3Nzg4MiwxNzA5NjEwMzUwLDIxMjUxMzU4NDYsMTM2NDI4NzUxLDM4NzQ0MjgzOTIsMzY1MjkwNDg1OSwzNDYwOTg0NjMwLDM1NzIxNDU5MjksMzU5MzA1NjM4MCwyOTM5MjY2MjI2LDgyNDg1MjI1OSw4MTgzMjQ4ODQsMzIyNDc0MDQ1NCw5MzAzNjkyMTIsMjgwMTU2NjQxMCwyOTY3NTA3MTUyLDM1NTcwNjg0MCwxMjU3MzA5MzM2LDQxNDgyOTI4MjYsMjQzMjU2NjU2LDc5MDA3Mzg0NiwyMzczMzQwNjMwLDEyOTYyOTc5MDQsMTQyMjY5OTA4NSwzNzU2Mjk5NzgwLDM4MTg4MzY0MDUsNDU3OTkyODQwLDMwOTk2Njc0ODcsMjEzNTMxOTg4OSw3NzQyMjMxNCwxNTYwMzgyNTE3LDE5NDU3OTg1MTYsNzg4MjA0MzUzLDE1MjE3MDY3ODEsMTM4NTM1NjI0Miw4NzA5MTIwODYsMzI1OTY1MzgzLDIzNTg5NTc5MjEsMjA1MDQ2NjA2MCwyMzg4MjYwODg0LDIzMTM4ODQ0NzYsNDAwNjUyMTEyNyw5MDEyMTA1NjksMzk5MDk1MzE4OSwxMDE0NjQ2NzA1LDE1MDM0NDk4MjMsMTA2MjU5NzIzNSwyMDMxNjIxMzI2LDMyMTIwMzU4OTUsMzkzMTM3MTQ2OSwxNTMzMDE3NTE0LDM1MDE3NDU3NSwyMjU2MDI4ODkxLDIxNzc1NDQxNzksMTA1MjMzODM3Miw3NDE4NzY3ODgsMTYwNjU5MTI5NiwxOTE0MDUyMDM1LDIxMzcwNTI1MywyMzM0NjY5ODk3LDExMDcyMzQxOTcsMTg5OTYwMzk2OSwzNzI1MDY5NDkxLDI2MzE0NDc3ODAsMjQyMjQ5NDkxMywxNjM1NTAyOTgwLDE4OTMwMjAzNDIsMTk1MDkwMzM4OCwxMTIwOTc0OTM1XTt2YXIgVDc9WzI4MDcwNTg5MzIsMTY5OTk3MDYyNSwyNzY0MjQ5NjIzLDE1ODY5MDM1OTEsMTgwODQ4MTE5NSwxMTczNDMwMTczLDE0ODc2NDU5NDYsNTk5ODQ4NjcsNDE5OTg4MjgwMCwxODQ0ODgyODA2LDE5ODkyNDkyMjgsMTI3NzU1NTk3MCwzNjIzNjM2OTY1LDM0MTk5MTU1NjIsMTE0OTI0OTA3NywyNzQ0MTA0MjkwLDE1MTQ3OTA1NzcsNDU5NzQ0Njk4LDI0NDg2MDM5NCwzMjM1OTk1MTM0LDE5NjMxMTUzMTEsNDAyNzc0NDU4OCwyNTQ0MDc4MTUwLDQxOTA1MzA1MTUsMTYwODk3NTI0NywyNjI3MDE2MDgyLDIwNjIyNzAzMTcsMTUwNzQ5NzI5OCwyMjAwODE4ODc4LDU2NzQ5ODg2OCwxNzY0MzEzNTY4LDMzNTk5MzYyMDEsMjMwNTQ1NTU1NCwyMDM3OTcwMDYyLDEwNDcyMzllMywxOTEwMzE5MDMzLDEzMzczNzY0ODEsMjkwNDAyNzI3MiwyODkyNDE3MzEyLDk4NDkwNzIxNCwxMjQzMTEyNDE1LDgzMDY2MTkxNCw4NjE5NjgyMDksMjEzNTI1MzU4NywyMDExMjE0MTgwLDI5Mjc5MzQzMTUsMjY4NjI1NDcyMSw3MzExODMzNjgsMTc1MDYyNjM3Niw0MjQ2MzEwNzI1LDE4MjA4MjQ3OTgsNDE3Mjc2Mzc3MSwzNTQyMzMwMjI3LDQ4Mzk0ODI3LDI0MDQ5MDE2NjMsMjg3MTY4MjY0NSw2NzE1OTMxOTUsMzI1NDk4ODcyNSwyMDczNzI0NjEzLDE0NTA4NTIzOSwyMjgwNzk2MjAwLDI3Nzk5MTUxOTksMTc5MDU3NTEwNywyMTg3MTI4MDg2LDQ3MjYxNTYzMSwzMDI5NTEwMDA5LDQwNzU4NzcxMjcsMzgwMjIyMjE4NSw0MTA3MTAxNjU4LDMyMDE2MzE3NDksMTY0NjI1MjM0MCw0MjcwNTA3MTc0LDE0MDI4MTE0MzgsMTQzNjU5MDgzNSwzNzc4MTUxODE4LDM5NTAzNTU3MDIsMzk2MzE2MTQ3NSw0MDIwOTEyMjI0LDI2Njc5OTQ3MzcsMjczNzkyMzY2LDIzMzE1OTAxNzcsMTA0Njk5NjEzLDk1MzQ1OTgyLDMxNzU1MDEyODYsMjM3NzQ4NjY3NiwxNTYwNjM3ODkyLDM1NjQwNDUzMTgsMzY5MDU3ODcyLDQyMTM0NDcwNjQsMzkxOTA0MjIzNywxMTM3NDc3OTUyLDI2NTg2MjU0OTcsMTExOTcyNzg0OCwyMzQwOTQ3ODQ5LDE1MzA0NTU4MzMsNDAwNzM2MDk2OCwxNzI0NjY1NTYsMjY2OTU5OTM4LDUxNjU1MjgzNiwwLDIyNTY3MzQ1OTIsMzk4MDkzMTYyNywxODkwMzI4MDgxLDE5MTc3NDIxNzAsNDI5NDcwNDM5OCw5NDUxNjQxNjUsMzU3NTUyODg3OCw5NTg4NzEwODUsMzY0NzIxMjA0NywyNzg3MjA3MjYwLDE0MjMwMjI5MzksNzc1NTYyMjk0LDE3Mzk2NTYyMDIsMzg3NjU1NzY1NSwyNTMwMzkxMjc4LDI0NDMwNTgwNzUsMzMxMDMyMTg1Niw1NDc1MTI3OTYsMTI2NTE5NTYzOSw0Mzc2NTY1OTQsMzEyMTI3NTUzOSw3MTk3MDAxMjgsMzc2MjUwMjY5MCwzODc3ODExNDcsMjE4ODI4Mjk3LDMzNTAwNjU4MDMsMjgzMDcwODE1MCwyODQ4NDYxODU0LDQyODE2OTIwMSwxMjI0NjYxNjUsMzcyMDA4MTA0OSwxNjI3MjM1MTk5LDY0ODAxNzY2NSw0MTIyNzYyMzU0LDEwMDI3ODM4NDYsMjExNzM2MDYzNSw2OTU2MzQ3NTUsMzMzNjM1ODY5MSw0MjM0NzIxMDA1LDQwNDk4NDQ0NTIsMzcwNDI4MDg4MSwyMjMyNDM1Mjk5LDU3NDYyNDY2MywyODczNDM4MTQsNjEyMjA1ODk4LDEwMzk3MTcwNTEsODQwMDE5NzA1LDI3MDgzMjYxODUsNzkzNDUxOTM0LDgyMTI4ODExNCwxMzkxMjAxNjcwLDM4MjIwOTAxNzcsMzc2MTg3ODI3LDMxMTM4NTUzNDQsMTIyNDM0ODA1MiwxNjc5OTY4MjMzLDIzNjE2OTg1NTYsMTA1ODcwOTc0NCw3NTIzNzU0MjEsMjQzMTU5MDk2MywxMzIxNjk5MTQ1LDM1MTkxNDIyMDAsMjczNDU5MTE3OCwxODgxMjc0NDQsMjE3Nzg2OTU1NywzNzI3MjA1NzU0LDIzODQ5MTEwMzEsMzIxNTIxMjQ2MSwyNjQ4OTc2NDQyLDI0NTAzNDYxMDQsMzQzMjczNzM3NSwxMTgwODQ5Mjc4LDMzMTU0NDIwNSwzMTAyMjQ5MTc2LDQxNTAxNDQ1NjksMjk1MjEwMjU5NSwyMTU5OTc2Mjg1LDI0NzQ0MDQzMDQsNzY2MDc4OTMzLDMxMzc3Mzg2MSwyNTcwODMyMDQ0LDIxMDgxMDA2MzIsMTY2ODIxMjg5MiwzMTQ1NDU2NDQzLDIwMTM5MDgyNjIsNDE4NjcyMjE3LDMwNzAzNTY2MzQsMjU5NDczNDkyNywxODUyMTcxOTI1LDM4NjcwNjA5OTEsMzQ3MzQxNjYzNiwzOTA3NDQ4NTk3LDI2MTQ3Mzc2MzksOTE5NDg5MTM1LDE2NDk0ODYzOSwyMDk0NDEwMTYwLDI5OTc4MjU5NTYsNTkwNDI0NjM5LDI0ODYyMjQ1NDksMTcyMzg3MjY3NCwzMTU3NzUwODYyLDMzOTk5NDEyNTAsMzUwMTI1Mjc1MiwzNjI1MjY4MTM1LDI1NTUwNDgxOTYsMzY3MzYzNzM1NiwxMzQzMTI3NTAxLDQxMzAyODEzNjEsMzU5OTU5NTA4NSwyOTU3ODUzNjc5LDEyOTc0MDMwNTAsODE3ODE5MTAsMzA1MTU5MzQyNSwyMjgzNDkwNDEwLDUzMjIwMTc3MiwxMzY3Mjk1NTg5LDM5MjYxNzA5NzQsODk1Mjg3NjkyLDE5NTM3NTc4MzEsMTA5MzU5Nzk2Myw0OTI0ODM0MzEsMzUyODYyNjkwNywxNDQ2MjQyNTc2LDExOTI0NTU2MzgsMTYzNjYwNDYzMSwyMDkzMzYyMjUsMzQ0ODczNDY0LDEwMTU2NzE1NzEsNjY5OTYxODk3LDMzNzU3NDA3NjksMzg1NzU3MjEyNCwyOTczNTMwNjk1LDM3NDcxOTIwMTgsMTkzMzUzMDYxMCwzNDY0MDQyNTE2LDkzNTI5Mzg5NSwzNDU0Njg2MTk5LDI4NTgxMTUwNjksMTg2MzYzODg0NSwzNjgzMDIyOTE2LDQwODUzNjk1MTksMzI5MjQ0NTAzMiw4NzUzMTMxODgsMTA4MDAxNzU3MSwzMjc5MDMzODg1LDYyMTU5MTc3OCwxMjMzODU2NTcyLDI1MDQxMzAzMTcsMjQxOTc1NDQsMzAxNzY3MjcxNiwzODM1NDg0MzQwLDMyNDc0NjU1NTgsMjIyMDk4MTE5NSwzMDYwODQ3OTIyLDE1NTExMjQ1ODgsMTQ2Mzk5NjYwMF07dmFyIFQ4PVs0MTA0NjA1Nzc3LDEwOTcxNTk1NTAsMzk2NjczODE4LDY2MDUxMDI2NiwyODc1OTY4MzE1LDI2Mzg2MDY2MjMsNDIwMDExNTExNiwzODA4NjYyMzQ3LDgyMTcxMjE2MCwxOTg2OTE4MDYxLDM0MzAzMjI1NjgsMzg1NDQ4ODUsMzg1NjEzNzI5NSw3MTgwMDIxMTcsODkzNjgxNzAyLDE2NTQ4ODYzMjUsMjk3NTQ4NDM4MiwzMTIyMzU4MDUzLDM5MjY4MjUwMjksNDI3NDA1MzQ2OSw3OTYxOTc1NzEsMTI5MDgwMTc5MywxMTg0MzQyOTI1LDM1NTYzNjE4MzUsMjQwNTQyNjk0NywyNDU5NzM1MzE3LDE4MzY3NzIyODcsMTM4MTYyMDM3MywzMTk2MjY3OTg4LDE5NDgzNzM4NDgsMzc2NDk4ODIzMywzMzg1MzQ1MTY2LDMyNjM3ODU1ODksMjM5MDMyNTQ5MiwxNDgwNDg1Nzg1LDMxMTEyNDcxNDMsMzc4MDA5NzcyNiwyMjkzMDQ1MjMyLDU0ODE2OTQxNywzNDU5OTUzNzg5LDM3NDYxNzUwNzUsNDM5NDUyMzg5LDEzNjIzMjE1NTksMTQwMDg0OTc2MiwxNjg1NTc3OTA1LDE4MDY1OTkzNTUsMjE3NDc1NDA0NiwxMzcwNzM5MTMsMTIxNDc5NzkzNiwxMTc0MjE1MDU1LDM3MzE2NTQ1NDgsMjA3OTg5NzQyNiwxOTQzMjE3MDY3LDEyNTg0ODAyNDIsNTI5NDg3ODQzLDE0MzcyODA4NzAsMzk0NTI2OTE3MCwzMDQ5MzkwODk1LDMzMTMyMTIwMzgsOTIzMzEzNjE5LDY3OTk5OGUzLDMyMTUzMDcyOTksNTczMjYwODIsMzc3NjQyMjIxLDM0NzQ3Mjk4NjYsMjA0MTg3NzE1OSwxMzMzNjE5MDcsMTc3NjQ2MDExMCwzNjczNDc2NDUzLDk2MzkyNDU0LDg3ODg0NTkwNSwyODAxNjk5NTI0LDc3NzIzMTY2OCw0MDgyNDc1MTcwLDIzMzAwMTQyMTMsNDE0MjYyNjIxMiwyMjEzMjk2Mzk1LDE2MjYzMTk0MjQsMTkwNjI0NzI2MiwxODQ2NTYzMjYxLDU2Mjc1NTkwMiwzNzA4MTczNzE4LDEwNDA1NTk4MzcsMzg3MTE2Mzk4MSwxNDE4NTczMjAxLDMyOTQ0MzA1NzcsMTE0NTg1MzQ4LDEzNDM2MTg5MTIsMjU2NjU5NTYwOSwzMTg2MjAyNTgyLDEwNzgxODUwOTcsMzY1MTA0MTEyNywzODk2Njg4MDQ4LDIzMDc2MjI5MTksNDI1NDA4NzQzLDMzNzEwOTY5NTMsMjA4MTA0ODQ4MSwxMTA4MzM5MDY4LDIyMTY2MTAyOTYsMCwyMTU2Mjk5MDE3LDczNjk3MDgwMiwyOTI1OTY3NjYsMTUxNzQ0MDYyMCwyNTE2NTcyMTMsMjIzNTA2MTc3NSwyOTMzMjAyNDkzLDc1ODcyMDMxMCwyNjU5MDUxNjIsMTU1NDM5MTQwMCwxNTMyMjg1MzM5LDkwODk5OTIwNCwxNzQ1Njc2OTIsMTQ3NDc2MDU5NSw0MDAyODYxNzQ4LDI2MTAwMTE2NzUsMzIzNDE1NjQxNiwzNjkzMTI2MjQxLDIwMDE0MzA4NzQsMzAzNjk5NDg0LDI0Nzg0NDMyMzQsMjY4NzE2NTg4OCw1ODUxMjI2MjAsNDU0NDk5NjAyLDE1MTg0OTc0MiwyMzQ1MTE5MjE4LDMwNjQ1MTA3NjUsNTE0NDQzMjg0LDQwNDQ5ODE1OTEsMTk2MzQxMjY1NSwyNTgxNDQ1NjE0LDIxMzcwNjI4MTksMTkzMDg1MzUsMTkyODcwNzE2NCwxNzE1MTkzMTU2LDQyMTkzNTIxNTUsMTEyNjc5MDc5NSw2MDAyMzUyMTEsMzk5Mjc0MjA3MCwzODQxMDI0OTUyLDgzNjU1MzQzMSwxNjY5NjY0ODM0LDI1MzU2MDQyNDMsMzMyMzAxMTIwNCwxMjQzOTA1NDEzLDMxNDE0MDA3ODYsNDE4MDgwODExMCw2OTg0NDUyNTUsMjY1Mzg5OTU0OSwyOTg5NTUyNjA0LDIyNTM1ODEzMjUsMzI1MjkzMjcyNywzMDA0NTkxMTQ3LDE4OTEyMTE2ODksMjQ4NzgxMDU3NywzOTE1NjUzNzAzLDQyMzcwODM4MTYsNDAzMDY2NzQyNCwyMTAwMDkwOTY2LDg2NTEzNjQxOCwxMjI5ODk5NjU1LDk1MzI3MDc0NSwzMzk5Njc5NjI4LDM1NTc1MDQ2NjQsNDExODkyNTIyMiwyMDYxMzc5NzQ5LDMwNzk1NDY1ODYsMjkxNTAxNzc5MSw5ODM0MjYwOTIsMjAyMjgzNzU4NCwxNjA3MjQ0NjUwLDIxMTg1NDE5MDgsMjM2Njg4MjU1MCwzNjM1OTk2ODE2LDk3MjUxMjgxNCwzMjgzMDg4NzcwLDE1Njg3MTg0OTUsMzQ5OTMyNjU2OSwzNTc2NTM5NTAzLDYyMTk4MjY3MSwyODk1NzIzNDY0LDQxMDg4Nzk1MiwyNjIzNzYyMTUyLDEwMDIxNDI2ODMsNjQ1NDAxMDM3LDE0OTQ4MDc2NjIsMjU5NTY4NDg0NCwxMzM1NTM1NzQ3LDI1MDcwNDAyMzAsNDI5MzI5NTc4NiwzMTY3Njg0NjQxLDM2NzU4NTAwNywzODg1NzUwNzE0LDE4NjU4NjI3MzAsMjY2ODIyMTY3NCwyOTYwOTcxMzA1LDI3NjMxNzM2ODEsMTA1OTI3MDk1NCwyNzc3OTUyNDU0LDI3MjQ2NDI4NjksMTMyMDk1NzgxMiwyMTk0MzE5MTAwLDI0Mjk1OTU4NzIsMjgxNTk1NjI3NSw3NzA4OTUyMSwzOTczNzczMTIxLDM0NDQ1NzU4NzEsMjQ0ODgzMDIzMSwxMzA1OTA2NTUwLDQwMjEzMDg3MzksMjg1NzE5NDcwMCwyNTE2OTAxODYwLDM1MTgzNTg0MzAsMTc4NzMwNDc4MCw3NDAyNzY0MTcsMTY5OTgzOTgxNCwxNTkyMzk0OTA5LDIzNTIzMDc0NTcsMjI3MjU1NjAyNiwxODg4MjEyNDMsMTcyOTk3NzAxMSwzNjg3OTk0MDAyLDI3NDA4NDg0MSwzNTk0OTgyMjUzLDM2MTM0OTQ0MjYsMjcwMTk0OTQ5NSw0MTYyMDk2NzI5LDMyMjczNDU3MSwyODM3OTY2NTQyLDE2NDA1NzY0MzksNDg0ODMwNjg5LDEyMDI3OTc2OTAsMzUzNzg1MjgyOCw0MDY3NjM5MTI1LDM0OTA3NTczNiwzMzQyMzE5NDc1LDQxNTc0NjcyMTksNDI1NTgwMDE1OSwxMDMwNjkwMDE1LDExNTUyMzc0OTYsMjk1MTk3MTI3NCwxNzU3NjkxNTc3LDYwNzM5ODk2OCwyNzM4OTA1MDI2LDQ5OTM0Nzk5MCwzNzk0MDc4OTA4LDEwMTE0NTI3MTIsMjI3ODg1NTY3LDI4MTg2NjY4MDksMjEzMTE0Mzc2LDMwMzQ4ODEyNDAsMTQ1NTUyNTk4OCwzNDE0NDUwNTU1LDg1MDgxNzIzNywxODE3OTk4NDA4LDMwOTI3MjY0ODBdO3ZhciBVMT1bMCwyMzU0NzQxODcsNDcwOTQ4Mzc0LDMwMzc2NTI3Nyw5NDE4OTY3NDgsOTA4OTMzNDE1LDYwNzUzMDU1NCw3MDg3ODA4NDksMTg4Mzc5MzQ5NiwyMTE4MjE0OTk1LDE4MTc4NjY4MzAsMTY0OTYzOTIzNywxMjE1MDYxMTA4LDExODEwNDUxMTksMTQxNzU2MTY5OCwxNTE3NzY3NTI5LDM3Njc1ODY5OTIsNDAwMzA2MTE3OSw0MjM2NDI5OTkwLDQwNjkyNDY4OTMsMzYzNTczMzY2MCwzNjAyNzcwMzI3LDMyOTkyNzg0NzQsMzQwMDUyODc2OSwyNDMwMTIyMjE2LDI2NjQ1NDM3MTUsMjM2MjA5MDIzOCwyMTkzODYyNjQ1LDI4MzUxMjMzOTYsMjgwMTEwNzQwNywzMDM1NTM1MDU4LDMxMzU3NDA4ODksMzY3ODEyNDkyMywzNTc2ODcwNTEyLDMzNDEzOTQyODUsMzM3NDM2MTcwMiwzODEwNDk2MzQzLDM5Nzc2NzUzNTYsNDI3OTA4MDI1Nyw0MDQzNjEwMTg2LDI4NzY0OTQ2MjcsMjc3NjI5MjkwNCwzMDc2NjM5MDI5LDMxMTA2NTA5NDIsMjQ3MjAxMTUzNSwyNjQwMjQzMjA0LDI0MDM3Mjg2NjUsMjE2OTMwMzA1OCwxMDAxMDg5OTk1LDg5OTgzNTU4NCw2NjY0NjQ3MzMsNjk5NDMyMTUwLDU5NzI3ODQ3LDIyNjkwNjg2MCw1MzA0MDA3NTMsMjk0OTMwNjgyLDEyNzMxNjg3ODcsMTE3Mjk2NzA2NCwxNDc1NDE4NTAxLDE1MDk0MzA0MTQsMTk0MjQzNTc3NSwyMTEwNjY3NDQ0LDE4NzYyNDE4MzMsMTY0MTgxNjIyNiwyOTEwMjE5NzY2LDI3NDMwMzQxMDksMjk3NjE1MTUyMCwzMjExNjIzMTQ3LDI1MDUyMDIxMzgsMjYwNjQ1Mzk2OSwyMzAyNjkwMjUyLDIyNjk3Mjg0NTUsMzcxMTgyOTQyMiwzNTQzNTk5MjY5LDMyNDA4OTQzOTIsMzQ3NTMxMzMzMSwzODQzNjk5MDc0LDM5NDM5MDY0NDEsNDE3ODA2MjIyOCw0MTQ0MDQ3Nzc1LDEzMDY5NjczNjYsMTEzOTc4MTcwOSwxMzc0OTg4MTEyLDE2MTA0NTk3MzksMTk3NTY4MzQzNCwyMDc2OTM1MjY1LDE3NzUyNzY5MjQsMTc0MjMxNTEyNywxMDM0ODY3OTk4LDg2NjYzNzg0NSw1NjYwMjE4OTYsODAwNDQwODM1LDkyOTg3Njk4LDE5MzE5NTA2NSw0Mjk0NTYxNjQsMzk1NDQxNzExLDE5ODQ4MTI2ODUsMjAxNzc3ODU2NiwxNzg0NjYzMTk1LDE2ODM0MDcyNDgsMTMxNTU2MjE0NSwxMDgwMDk0NjM0LDEzODM4NTYzMTEsMTU1MTAzNzg4NCwxMDEwMzk4MjksMTM1MDUwMjA2LDQzNzc1NzEyMywzMzc1NTM4NjQsMTA0MjM4NTY1Nyw4MDc5NjI2MTAsNTczODA0NzgzLDc0MjAzOTAxMiwyNTMxMDY3NDUzLDI1NjQwMzMzMzQsMjMyODgyODk3MSwyMjI3NTczMDI0LDI5MzU1NjY4NjUsMjcwMDA5OTM1NCwzMDAxNzU1NjU1LDMxNjg5MzcyMjgsMzg2ODU1MjgwNSwzOTAyNTYzMTgyLDQyMDMxODExNzEsNDEwMjk3NzkxMiwzNzM2MTY0OTM3LDM1MDE3NDE4OTAsMzI2NTQ3ODc1MSwzNDMzNzEyOTgwLDExMDYwNDE1OTEsMTM0MDQ2MzEwMCwxNTc2OTc2NjA5LDE0MDg3NDkwMzQsMjA0MzIxMTQ4MywyMDA5MTk1NDcyLDE3MDg4NDgzMzMsMTgwOTA1NDE1MCw4MzI4NzcyMzEsMTA2ODM1MTM5Niw3NjY5NDU0NjUsNTk5NzYyMzU0LDE1OTQxNzk4NywxMjY0NTQ2NjQsMzYxOTI5ODc3LDQ2MzE4MDE5MCwyNzA5MjYwODcxLDI5NDM2ODIzODAsMzE3ODEwNjk2MSwzMDA5ODc5Mzg2LDI1NzI2OTcxOTUsMjUzODY4MTE4NCwyMjM2MjI4NzMzLDIzMzY0MzQ1NTAsMzUwOTg3MTEzNSwzNzQ1MzQ1MzAwLDM0NDE4NTAzNzcsMzI3NDY2NzI2NiwzOTEwMTYxOTcxLDM4NzcxOTg2NDgsNDExMDU2ODQ4NSw0MjExODE4Nzk4LDI1OTc4MDY0NzYsMjQ5NzYwNDc0MywyMjYxMDg5MTc4LDIyOTUxMDEwNzMsMjczMzg1NjE2MCwyOTAyMDg3ODUxLDMyMDI0MzcwNDYsMjk2ODAxMTQ1MywzOTM2MjkxMjg0LDM4MzUwMzY4OTUsNDEzNjQ0MDc3MCw0MTY5NDA4MjAxLDM1MzU0ODY0NTYsMzcwMjY2NTQ1OSwzNDY3MTkyMzAyLDMyMzE3MjIyMTMsMjA1MTUxODc4MCwxOTUxMzE3MDQ3LDE3MTY4OTA0MTAsMTc1MDkwMjMwNSwxMTEzODE4Mzg0LDEyODIwNTAwNzUsMTU4NDUwNDU4MiwxMzUwMDc4OTg5LDE2ODgxMDg1Miw2NzU1NjQ2MywzNzEwNDkzMzAsNDA0MDE2NzYxLDg0MTczOTU5MiwxMDA4OTE4NTk1LDc3NTU1MDgxNCw1NDAwODA3MjUsMzk2OTU2MjM2OSwzODAxMzMyMjM0LDQwMzU0ODkwNDcsNDI2OTkwNzk5NiwzNTY5MjU1MjEzLDM2Njk0NjI1NjYsMzM2Njc1NDYxOSwzMzMyNzQwMTQ0LDI2MzEwNjU0MzMsMjQ2Mzg3OTc2MiwyMTYwMTE3MDcxLDIzOTU1ODg2NzYsMjc2NzY0NTU1NywyODY4ODk3NDA2LDMxMDIwMTE3NDcsMzA2OTA0OTk2MCwyMDIwMDg0OTcsMzM3NzgzNjIsMjcwMDQwNDg3LDUwNDQ1OTQzNiw4NzU0NTEyOTMsOTc1NjU4NjQ2LDY3NTAzOTYyNyw2NDEwMjUxNTIsMjA4NDcwNDIzMywxOTE3NTE4NTYyLDE2MTU4NjEyNDcsMTg1MTMzMjg1MiwxMTQ3NTUwNjYxLDEyNDg4MDI1MTAsMTQ4NDAwNTg0MywxNDUxMDQ0MDU2LDkzMzMwMTM3MCw5NjczMTE3MjksNzMzMTU2OTcyLDYzMjk1MzcwMywyNjAzODg5NTAsMjU5NjU5MTcsMzI4NjcxODA4LDQ5NjkwNjA1OSwxMjA2NDc3ODU4LDEyMzk0NDM3NTMsMTU0MzIwODUwMCwxNDQxOTUyNTc1LDIxNDQxNjE4MDYsMTkwODY5NDI3NywxNjc1NTc3ODgwLDE4NDI3NTk0NDMsMzYxMDM2OTIyNiwzNjQ0Mzc5NTg1LDM0MDgxMTk1MTYsMzMwNzkxNjI0Nyw0MDExMTkwNTAyLDM3NzY3Njc0NjksNDA3NzM4NDQzMiw0MjQ1NjE4NjgzLDI4MDk3NzExNTQsMjg0MjczNzA0OSwzMTQ0Mzk2NDIwLDMwNDMxNDA0OTUsMjY3MzcwNTE1MCwyNDM4MjM3NjIxLDIyMDMwMzIyMzIsMjM3MDIxMzc5NV07dmFyIFUyPVswLDE4NTQ2OTE5NywzNzA5MzgzOTQsNDg3NzI1ODQ3LDc0MTg3Njc4OCw2NTc4NjE5NDUsOTc1NDUxNjk0LDgyNDg1MjI1OSwxNDgzNzUzNTc2LDE0MDA3ODMyMDUsMTMxNTcyMzg5MCwxMTY0MDcxODA3LDE5NTA5MDMzODgsMjEzNTMxOTg4OSwxNjQ5NzA0NTE4LDE3Njc1MzY0NTksMjk2NzUwNzE1MiwzMTUyOTc2MzQ5LDI4MDE1NjY0MTAsMjkxODM1Mzg2MywyNjMxNDQ3NzgwLDI1NDc0MzI5MzcsMjMyODE0MzYxNCwyMTc3NTQ0MTc5LDM5MDE4MDY3NzYsMzgxODgzNjQwNSw0MjcwNjM5Nzc4LDQxMTg5ODc2OTUsMzI5OTQwOTAzNiwzNDgzODI1NTM3LDM1MzUwNzI5MTgsMzY1MjkwNDg1OSwyMDc3OTY1MjQzLDE4OTMwMjAzNDIsMTg0MTc2ODg2NSwxNzI0NDU3MTMyLDE0NzQ1MDI1NDMsMTU1OTA0MTY2NiwxMTA3MjM0MTk3LDEyNTczMDkzMzYsNTk4NDM4ODY3LDY4MTkzMzUzNCw5MDEyMTA1NjksMTA1MjMzODM3MiwyNjEzMTQ1MzUsNzc0MjIzMTQsNDI4ODE5OTY1LDMxMDQ2MzcyOCwzNDA5Njg1MzU1LDMyMjQ3NDA0NTQsMzcxMDM2ODExMywzNTkzMDU2MzgwLDM4NzU3NzAyMDcsMzk2MDMwOTMzMCw0MDQ1MzgwOTMzLDQxOTU0NTYwNzIsMjQ3MTIyNDA2NywyNTU0NzE4NzM0LDIyMzcxMzMwODEsMjM4ODI2MDg4NCwzMjEyMDM1ODk1LDMwMjgxNDM2NzQsMjg0MjY3ODU3MywyNzI0MzIyMzM2LDQxMzg1NjMxODEsNDI1NTM1MDYyNCwzNzY5NzIxOTc1LDM5NTUxOTExNjIsMzY2NzIxOTAzMywzNTE2NjE5NjA0LDM0MzE1NDY5NDcsMzM0NzUzMjExMCwyOTMzNzM0OTE3LDI3ODIwODI4MjQsMzA5OTY2NzQ4NywzMDE2Njk3MTA2LDIxOTYwNTI1MjksMjMxMzg4NDQ3NiwyNDk5MzQ4NTIzLDI2ODM3NjUwMzAsMTE3OTUxMDQ2MSwxMjk2Mjk3OTA0LDEzNDc1NDgzMjcsMTUzMzAxNzUxNCwxNzg2MTAyNDA5LDE2MzU1MDI5ODAsMjA4NzMwOTQ1OSwyMDAzMjk0NjIyLDUwNzM1ODkzMywzNTU3MDY4NDAsMTM2NDI4NzUxLDUzNDU4MzcwLDgzOTIyNDAzMyw5NTcwNTU5ODAsNjA1NjU3MzM5LDc5MDA3Mzg0NiwyMzczMzQwNjMwLDIyNTYwMjg4OTEsMjYwNzQzOTgyMCwyNDIyNDk0OTEzLDI3MDYyNzA2OTAsMjg1NjM0NTgzOSwzMDc1NjM2MjE2LDMxNjAxNzUzNDksMzU3Mzk0MTY5NCwzNzI1MDY5NDkxLDMyNzMyNjcxMDgsMzM1Njc2MTc2OSw0MTgxNTk4NjAyLDQwNjMyNDIzNzUsNDAxMTk5NjA0OCwzODI4MTAzODM3LDEwMzMyOTcxNTgsOTE1OTg1NDE5LDczMDUxNzI3Niw1NDU1NzIzNjksMjk2Njc5NzMwLDQ0Njc1NDg3OSwxMjkxNjYxMjAsMjEzNzA1MjUzLDE3MDk2MTAzNTAsMTg2MDczODE0NywxOTQ1Nzk4NTE2LDIwMjkyOTMxNzcsMTIzOTMzMTE2MiwxMTIwOTc0OTM1LDE2MDY1OTEyOTYsMTQyMjY5OTA4NSw0MTQ4MjkyODI2LDQyMzMwOTQ2MTUsMzc4MTAzMzY2NCwzOTMxMzcxNDY5LDM2ODIxOTE1OTgsMzQ5NzUwOTM0NywzNDQ2MDA0NDY4LDMzMjg5NTUzODUsMjkzOTI2NjIyNiwyNzU1NjM2NjcxLDMxMDY3ODA4NDAsMjk4ODY4NzI2OSwyMTk4NDM4MDIyLDIyODIxOTUzMzksMjUwMTIxODk3MiwyNjUyNjA5NDI1LDEyMDE3NjUzODYsMTI4NjU2NzE3NSwxMzcxMzY4OTc2LDE1MjE3MDY3ODEsMTgwNTIxMTcxMCwxNjIwNTI5NDU5LDIxMDU4ODcyNjgsMTk4ODgzODE4NSw1MzM4MDQxMzAsMzUwMTc0NTc1LDE2NDQzOTY3Miw0NjM0NjEwMSw4NzA5MTIwODYsOTU0NjY5NDAzLDYzNjgxMzkwMCw3ODgyMDQzNTMsMjM1ODk1NzkyMSwyMjc0NjgwNDI4LDI1OTI1MjM2NDMsMjQ0MTY2MTU1OCwyNjk1MDMzNjg1LDI4ODAyNDAyMTYsMzA2NTk2MjgzMSwzMTgyNDg3NjE4LDM1NzIxNDU5MjksMzc1NjI5OTc4MCwzMjcwOTM3ODc1LDMzODg1MDcxNjYsNDE3NDU2MDA2MSw0MDkxMzI3MDI0LDQwMDY1MjExMjcsMzg1NDYwNjM3OCwxMDE0NjQ2NzA1LDkzMDM2OTIxMiw3MTEzNDk2NzUsNTYwNDg3NTkwLDI3Mjc4NjMwOSw0NTc5OTI4NDAsMTA2ODUyNzY3LDIyMzM3NzU1NCwxNjc4MzgxMDE3LDE4NjI1MzQ4NjgsMTkxNDA1MjAzNSwyMDMxNjIxMzI2LDEyMTEyNDc1OTcsMTEyODAxNDU2MCwxNTgwMDg3Nzk5LDE0MjgxNzMwNTAsMzIyODMzMTksMTgyNjIxMTE0LDQwMTYzOTU5Nyw0ODY0NDEzNzYsNzY4OTE3MTIzLDY1MTg2ODA0NiwxMDAzMDA3MTI5LDgxODMyNDg4NCwxNTAzNDQ5ODIzLDEzODUzNTYyNDIsMTMzMzgzODAyMSwxMTUwMjA4NDU2LDE5NzM3NDUzODcsMjEyNTEzNTg0NiwxNjczMDYxNjE3LDE3NTY4MTg5NDAsMjk3MDM1NjMyNywzMTIwNjk0MTIyLDI4MDI4NDk5MTcsMjg4NzY1MTY5NiwyNjM3NDQyNjQzLDI1MjAzOTM1NjYsMjMzNDY2OTg5NywyMTQ5OTg3NjUyLDM5MTcyMzQ3MDMsMzc5OTE0MTEyMiw0Mjg0NTAyMDM3LDQxMDA4NzI0NzIsMzMwOTU5NDE3MSwzNDYwOTg0NjMwLDM1NDU3ODk0NzMsMzYyOTU0Njc5NiwyMDUwNDY2MDYwLDE4OTk2MDM5NjksMTgxNDgwMzIyMiwxNzMwNTI1NzIzLDE0NDM4NTc3MjAsMTU2MDM4MjUxNywxMDc1MDI1Njk4LDEyNjAyMzIyMzksNTc1MTM4MTQ4LDY5MjcwNzQzMyw4Nzg0NDMzOTAsMTA2MjU5NzIzNSwyNDMyNTY2NTYsOTEzNDE5MTcsNDA5MTk4NDEwLDMyNTk2NTM4MywzNDAzMTAwNjM2LDMyNTIyMzg1NDUsMzcwNDMwMDQ4NiwzNjIwMDIyOTg3LDM4NzQ0MjgzOTIsMzk5MDk1MzE4OSw0MDQyNDU5MTIyLDQyMjc2NjU2NjMsMjQ2MDQ0OTIwNCwyNTc4MDE4NDg5LDIyMjY4NzUzMTAsMjQxMTAyOTE1NSwzMTk4MTE1MjAwLDMwNDYyMDA0NjEsMjgyNzE3Nzg4MiwyNzQzOTQ0ODU1XTt2YXIgVTM9WzAsMjE4ODI4Mjk3LDQzNzY1NjU5NCwzODc3ODExNDcsODc1MzEzMTg4LDk1ODg3MTA4NSw3NzU1NjIyOTQsNTkwNDI0NjM5LDE3NTA2MjYzNzYsMTY5OTk3MDYyNSwxOTE3NzQyMTcwLDIxMzUyNTM1ODcsMTU1MTEyNDU4OCwxMzY3Mjk1NTg5LDExODA4NDkyNzgsMTI2NTE5NTYzOSwzNTAxMjUyNzUyLDM3MjAwODEwNDksMzM5OTk0MTI1MCwzMzUwMDY1ODAzLDM4MzU0ODQzNDAsMzkxOTA0MjIzNyw0MjcwNTA3MTc0LDQwODUzNjk1MTksMzEwMjI0OTE3NiwzMDUxNTkzNDI1LDI3MzQ1OTExNzgsMjk1MjEwMjU5NSwyMzYxNjk4NTU2LDIxNzc4Njk1NTcsMjUzMDM5MTI3OCwyNjE0NzM3NjM5LDMxNDU0NTY0NDMsMzA2MDg0NzkyMiwyNzA4MzI2MTg1LDI4OTI0MTczMTIsMjQwNDkwMTY2MywyMTg3MTI4MDg2LDI1MDQxMzAzMTcsMjU1NTA0ODE5NiwzNTQyMzMwMjI3LDM3MjcyMDU3NTQsMzM3NTc0MDc2OSwzMjkyNDQ1MDMyLDM4NzY1NTc2NTUsMzkyNjE3MDk3NCw0MjQ2MzEwNzI1LDQwMjc3NDQ1ODgsMTgwODQ4MTE5NSwxNzIzODcyNjc0LDE5MTAzMTkwMzMsMjA5NDQxMDE2MCwxNjA4OTc1MjQ3LDEzOTEyMDE2NzAsMTE3MzQzMDE3MywxMjI0MzQ4MDUyLDU5OTg0ODY3LDI0NDg2MDM5NCw0MjgxNjkyMDEsMzQ0ODczNDY0LDkzNTI5Mzg5NSw5ODQ5MDcyMTQsNzY2MDc4OTMzLDU0NzUxMjc5NiwxODQ0ODgyODA2LDE2MjcyMzUxOTksMjAxMTIxNDE4MCwyMDYyMjcwMzE3LDE1MDc0OTcyOTgsMTQyMzAyMjkzOSwxMTM3NDc3OTUyLDEzMjE2OTkxNDUsOTUzNDU5ODIsMTQ1MDg1MjM5LDUzMjIwMTc3MiwzMTM3NzM4NjEsODMwNjYxOTE0LDEwMTU2NzE1NzEsNzMxMTgzMzY4LDY0ODAxNzY2NSwzMTc1NTAxMjg2LDI5NTc4NTM2NzksMjgwNzA1ODkzMiwyODU4MTE1MDY5LDIzMDU0NTU1NTQsMjIyMDk4MTE5NSwyNDc0NDA0MzA0LDI2NTg2MjU0OTcsMzU3NTUyODg3OCwzNjI1MjY4MTM1LDM0NzM0MTY2MzYsMzI1NDk4ODcyNSwzNzc4MTUxODE4LDM5NjMxNjE0NzUsNDIxMzQ0NzA2NCw0MTMwMjgxMzYxLDM1OTk1OTUwODUsMzY4MzAyMjkxNiwzNDMyNzM3Mzc1LDMyNDc0NjU1NTgsMzgwMjIyMjE4NSw0MDIwOTEyMjI0LDQxNzI3NjM3NzEsNDEyMjc2MjM1NCwzMjAxNjMxNzQ5LDMwMTc2NzI3MTYsMjc2NDI0OTYyMywyODQ4NDYxODU0LDIzMzE1OTAxNzcsMjI4MDc5NjIwMCwyNDMxNTkwOTYzLDI2NDg5NzY0NDIsMTA0Njk5NjEzLDE4ODEyNzQ0NCw0NzI2MTU2MzEsMjg3MzQzODE0LDg0MDAxOTcwNSwxMDU4NzA5NzQ0LDY3MTU5MzE5NSw2MjE1OTE3NzgsMTg1MjE3MTkyNSwxNjY4MjEyODkyLDE5NTM3NTc4MzEsMjAzNzk3MDA2MiwxNTE0NzkwNTc3LDE0NjM5OTY2MDAsMTA4MDAxNzU3MSwxMjk3NDAzMDUwLDM2NzM2MzczNTYsMzYyMzYzNjk2NSwzMjM1OTk1MTM0LDM0NTQ2ODYxOTksNDAwNzM2MDk2OCwzODIyMDkwMTc3LDQxMDcxMDE2NTgsNDE5MDUzMDUxNSwyOTk3ODI1OTU2LDMyMTUyMTI0NjEsMjgzMDcwODE1MCwyNzc5OTE1MTk5LDIyNTY3MzQ1OTIsMjM0MDk0Nzg0OSwyNjI3MDE2MDgyLDI0NDMwNTgwNzUsMTcyNDY2NTU2LDEyMjQ2NjE2NSwyNzM3OTIzNjYsNDkyNDgzNDMxLDEwNDcyMzllMyw4NjE5NjgyMDksNjEyMjA1ODk4LDY5NTYzNDc1NSwxNjQ2MjUyMzQwLDE4NjM2Mzg4NDUsMjAxMzkwODI2MiwxOTYzMTE1MzExLDE0NDYyNDI1NzYsMTUzMDQ1NTgzMywxMjc3NTU1OTcwLDEwOTM1OTc5NjMsMTYzNjYwNDYzMSwxODIwODI0Nzk4LDIwNzM3MjQ2MTMsMTk4OTI0OTIyOCwxNDM2NTkwODM1LDE0ODc2NDU5NDYsMTMzNzM3NjQ4MSwxMTE5NzI3ODQ4LDE2NDk0ODYzOSw4MTc4MTkxMCwzMzE1NDQyMDUsNTE2NTUyODM2LDEwMzk3MTcwNTEsODIxMjg4MTE0LDY2OTk2MTg5Nyw3MTk3MDAxMjgsMjk3MzUzMDY5NSwzMTU3NzUwODYyLDI4NzE2ODI2NDUsMjc4NzIwNzI2MCwyMjMyNDM1Mjk5LDIyODM0OTA0MTAsMjY2Nzk5NDczNywyNDUwMzQ2MTA0LDM2NDcyMTIwNDcsMzU2NDA0NTMxOCwzMjc5MDMzODg1LDM0NjQwNDI1MTYsMzk4MDkzMTYyNywzNzYyNTAyNjkwLDQxNTAxNDQ1NjksNDE5OTg4MjgwMCwzMDcwMzU2NjM0LDMxMjEyNzU1MzksMjkwNDAyNzI3MiwyNjg2MjU0NzIxLDIyMDA4MTg4NzgsMjM4NDkxMTAzMSwyNTcwODMyMDQ0LDI0ODYyMjQ1NDksMzc0NzE5MjAxOCwzNTI4NjI2OTA3LDMzMTAzMjE4NTYsMzM1OTkzNjIwMSwzOTUwMzU1NzAyLDM4NjcwNjA5OTEsNDA0OTg0NDQ1Miw0MjM0NzIxMDA1LDE3Mzk2NTYyMDIsMTc5MDU3NTEwNywyMTA4MTAwNjMyLDE4OTAzMjgwODEsMTQwMjgxMTQzOCwxNTg2OTAzNTkxLDEyMzM4NTY1NzIsMTE0OTI0OTA3NywyNjY5NTk5MzgsNDgzOTQ4MjcsMzY5MDU3ODcyLDQxODY3MjIxNywxMDAyNzgzODQ2LDkxOTQ4OTEzNSw1Njc0OTg4NjgsNzUyMzc1NDIxLDIwOTMzNjIyNSwyNDE5NzU0NCwzNzYxODc4MjcsNDU5NzQ0Njk4LDk0NTE2NDE2NSw4OTUyODc2OTIsNTc0NjI0NjYzLDc5MzQ1MTkzNCwxNjc5OTY4MjMzLDE3NjQzMTM1NjgsMjExNzM2MDYzNSwxOTMzNTMwNjEwLDEzNDMxMjc1MDEsMTU2MDYzNzg5MiwxMjQzMTEyNDE1LDExOTI0NTU2MzgsMzcwNDI4MDg4MSwzNTE5MTQyMjAwLDMzMzYzNTg2OTEsMzQxOTkxNTU2MiwzOTA3NDQ4NTk3LDM4NTc1NzIxMjQsNDA3NTg3NzEyNyw0Mjk0NzA0Mzk4LDMwMjk1MTAwMDksMzExMzg1NTM0NCwyOTI3OTM0MzE1LDI3NDQxMDQyOTAsMjE1OTk3NjI4NSwyMzc3NDg2Njc2LDI1OTQ3MzQ5MjcsMjU0NDA3ODE1MF07dmFyIFU0PVswLDE1MTg0OTc0MiwzMDM2OTk0ODQsNDU0NDk5NjAyLDYwNzM5ODk2OCw3NTg3MjAzMTAsOTA4OTk5MjA0LDEwNTkyNzA5NTQsMTIxNDc5NzkzNiwxMDk3MTU5NTUwLDE1MTc0NDA2MjAsMTQwMDg0OTc2MiwxODE3OTk4NDA4LDE2OTk4Mzk4MTQsMjExODU0MTkwOCwyMDAxNDMwODc0LDI0Mjk1OTU4NzIsMjU4MTQ0NTYxNCwyMTk0MzE5MTAwLDIzNDUxMTkyMTgsMzAzNDg4MTI0MCwzMTg2MjAyNTgyLDI4MDE2OTk1MjQsMjk1MTk3MTI3NCwzNjM1OTk2ODE2LDM1MTgzNTg0MzAsMzM5OTY3OTYyOCwzMjgzMDg4NzcwLDQyMzcwODM4MTYsNDExODkyNTIyMiw0MDAyODYxNzQ4LDM4ODU3NTA3MTQsMTAwMjE0MjY4Myw4NTA4MTcyMzcsNjk4NDQ1MjU1LDU0ODE2OTQxNyw1Mjk0ODc4NDMsMzc3NjQyMjIxLDIyNzg4NTU2Nyw3NzA4OTUyMSwxOTQzMjE3MDY3LDIwNjEzNzk3NDksMTY0MDU3NjQzOSwxNzU3NjkxNTc3LDE0NzQ3NjA1OTUsMTU5MjM5NDkwOSwxMTc0MjE1MDU1LDEyOTA4MDE3OTMsMjg3NTk2ODMxNSwyNzI0NjQyODY5LDMxMTEyNDcxNDMsMjk2MDk3MTMwNSwyNDA1NDI2OTQ3LDIyNTM1ODEzMjUsMjYzODYwNjYyMywyNDg3ODEwNTc3LDM4MDg2NjIzNDcsMzkyNjgyNTAyOSw0MDQ0OTgxNTkxLDQxNjIwOTY3MjksMzM0MjMxOTQ3NSwzNDU5OTUzNzg5LDM1NzY1Mzk1MDMsMzY5MzEyNjI0MSwxOTg2OTE4MDYxLDIxMzcwNjI4MTksMTY4NTU3NzkwNSwxODM2NzcyMjg3LDEzODE2MjAzNzMsMTUzMjI4NTMzOSwxMDc4MTg1MDk3LDEyMjk4OTk2NTUsMTA0MDU1OTgzNyw5MjMzMTM2MTksNzQwMjc2NDE3LDYyMTk4MjY3MSw0Mzk0NTIzODksMzIyNzM0NTcxLDEzNzA3MzkxMywxOTMwODUzNSwzODcxMTYzOTgxLDQwMjEzMDg3MzksNDEwNDYwNTc3Nyw0MjU1ODAwMTU5LDMyNjM3ODU1ODksMzQxNDQ1MDU1NSwzNDk5MzI2NTY5LDM2NTEwNDExMjcsMjkzMzIwMjQ5MywyODE1OTU2Mjc1LDMxNjc2ODQ2NDEsMzA0OTM5MDg5NSwyMzMwMDE0MjEzLDIyMTMyOTYzOTUsMjU2NjU5NTYwOSwyNDQ4ODMwMjMxLDEzMDU5MDY1NTAsMTE1NTIzNzQ5NiwxNjA3MjQ0NjUwLDE0NTU1MjU5ODgsMTc3NjQ2MDExMCwxNjI2MzE5NDI0LDIwNzk4OTc0MjYsMTkyODcwNzE2NCw5NjM5MjQ1NCwyMTMxMTQzNzYsMzk2NjczODE4LDUxNDQ0MzI4NCw1NjI3NTU5MDIsNjc5OTk4ZTMsODY1MTM2NDE4LDk4MzQyNjA5MiwzNzA4MTczNzE4LDM1NTc1MDQ2NjQsMzQ3NDcyOTg2NiwzMzIzMDExMjA0LDQxODA4MDgxMTAsNDAzMDY2NzQyNCwzOTQ1MjY5MTcwLDM3OTQwNzg5MDgsMjUwNzA0MDIzMCwyNjIzNzYyMTUyLDIyNzI1NTYwMjYsMjM5MDMyNTQ5MiwyOTc1NDg0MzgyLDMwOTI3MjY0ODAsMjczODkwNTAyNiwyODU3MTk0NzAwLDM5NzM3NzMxMjEsMzg1NjEzNzI5NSw0Mjc0MDUzNDY5LDQxNTc0NjcyMTksMzM3MTA5Njk1MywzMjUyOTMyNzI3LDM2NzM0NzY0NTMsMzU1NjM2MTgzNSwyNzYzMTczNjgxLDI5MTUwMTc3OTEsMzA2NDUxMDc2NSwzMjE1MzA3Mjk5LDIxNTYyOTkwMTcsMjMwNzYyMjkxOSwyNDU5NzM1MzE3LDI2MTAwMTE2NzUsMjA4MTA0ODQ4MSwxOTYzNDEyNjU1LDE4NDY1NjMyNjEsMTcyOTk3NzAxMSwxNDgwNDg1Nzg1LDEzNjIzMjE1NTksMTI0MzkwNTQxMywxMTI2NzkwNzk1LDg3ODg0NTkwNSwxMDMwNjkwMDE1LDY0NTQwMTAzNyw3OTYxOTc1NzEsMjc0MDg0ODQxLDQyNTQwODc0MywzODU0NDg4NSwxODg4MjEyNDMsMzYxMzQ5NDQyNiwzNzMxNjU0NTQ4LDMzMTMyMTIwMzgsMzQzMDMyMjU2OCw0MDgyNDc1MTcwLDQyMDAxMTUxMTYsMzc4MDA5NzcyNiwzODk2Njg4MDQ4LDI2NjgyMjE2NzQsMjUxNjkwMTg2MCwyMzY2ODgyNTUwLDIyMTY2MTAyOTYsMzE0MTQwMDc4NiwyOTg5NTUyNjA0LDI4Mzc5NjY1NDIsMjY4NzE2NTg4OCwxMjAyNzk3NjkwLDEzMjA5NTc4MTIsMTQzNzI4MDg3MCwxNTU0MzkxNDAwLDE2Njk2NjQ4MzQsMTc4NzMwNDc4MCwxOTA2MjQ3MjYyLDIwMjI4Mzc1ODQsMjY1OTA1MTYyLDExNDU4NTM0OCw0OTkzNDc5OTAsMzQ5MDc1NzM2LDczNjk3MDgwMiw1ODUxMjI2MjAsOTcyNTEyODE0LDgyMTcxMjE2MCwyNTk1Njg0ODQ0LDI0Nzg0NDMyMzQsMjI5MzA0NTIzMiwyMTc0NzU0MDQ2LDMxOTYyNjc5ODgsMzA3OTU0NjU4NiwyODk1NzIzNDY0LDI3Nzc5NTI0NTQsMzUzNzg1MjgyOCwzNjg3OTk0MDAyLDMyMzQxNTY0MTYsMzM4NTM0NTE2Niw0MTQyNjI2MjEyLDQyOTMyOTU3ODYsMzg0MTAyNDk1MiwzOTkyNzQyMDcwLDE3NDU2NzY5Miw1NzMyNjA4Miw0MTA4ODc5NTIsMjkyNTk2NzY2LDc3NzIzMTY2OCw2NjA1MTAyNjYsMTAxMTQ1MjcxMiw4OTM2ODE3MDIsMTEwODMzOTA2OCwxMjU4NDgwMjQyLDEzNDM2MTg5MTIsMTQ5NDgwNzY2MiwxNzE1MTkzMTU2LDE4NjU4NjI3MzAsMTk0ODM3Mzg0OCwyMTAwMDkwOTY2LDI3MDE5NDk0OTUsMjgxODY2NjgwOSwzMDA0NTkxMTQ3LDMxMjIzNTgwNTMsMjIzNTA2MTc3NSwyMzUyMzA3NDU3LDI1MzU2MDQyNDMsMjY1Mzg5OTU0OSwzOTE1NjUzNzAzLDM3NjQ5ODgyMzMsNDIxOTM1MjE1NSw0MDY3NjM5MTI1LDM0NDQ1NzU4NzEsMzI5NDQzMDU3NywzNzQ2MTc1MDc1LDM1OTQ5ODIyNTMsODM2NTUzNDMxLDk1MzI3MDc0NSw2MDAyMzUyMTEsNzE4MDAyMTE3LDM2NzU4NTAwNyw0ODQ4MzA2ODksMTMzMzYxOTA3LDI1MTY1NzIxMywyMDQxODc3MTU5LDE4OTEyMTE2ODksMTgwNjU5OTM1NSwxNjU0ODg2MzI1LDE1Njg3MTg0OTUsMTQxODU3MzIwMSwxMzM1NTM1NzQ3LDExODQzNDI5MjVdO2Z1bmN0aW9uIGNvbnZlcnRUb0ludDMyKGJ5dGVzKXt2YXIgcmVzdWx0PVtdO2Zvcih2YXIgaT0wO2k8Ynl0ZXMubGVuZ3RoO2krPTQpe3Jlc3VsdC5wdXNoKGJ5dGVzW2ldPDwyNHxieXRlc1tpKzFdPDwxNnxieXRlc1tpKzJdPDw4fGJ5dGVzW2krM10pfXJldHVybiByZXN1bHR9dmFyIEFFUz1mdW5jdGlvbihrZXkpe2lmKCEodGhpcyBpbnN0YW5jZW9mIEFFUykpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJrZXkiLHt2YWx1ZTpjb2VyY2VBcnJheShrZXksdHJ1ZSl9KTt0aGlzLl9wcmVwYXJlKCl9O0FFUy5wcm90b3R5cGUuX3ByZXBhcmU9ZnVuY3Rpb24oKXt2YXIgcm91bmRzPW51bWJlck9mUm91bmRzW3RoaXMua2V5Lmxlbmd0aF07aWYocm91bmRzPT1udWxsKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQga2V5IHNpemUgKG11c3QgYmUgMTYsIDI0IG9yIDMyIGJ5dGVzKSIpfXRoaXMuX0tlPVtdO3RoaXMuX0tkPVtdO2Zvcih2YXIgaT0wO2k8PXJvdW5kcztpKyspe3RoaXMuX0tlLnB1c2goWzAsMCwwLDBdKTt0aGlzLl9LZC5wdXNoKFswLDAsMCwwXSl9dmFyIHJvdW5kS2V5Q291bnQ9KHJvdW5kcysxKSo0O3ZhciBLQz10aGlzLmtleS5sZW5ndGgvNDt2YXIgdGs9Y29udmVydFRvSW50MzIodGhpcy5rZXkpO3ZhciBpbmRleDtmb3IodmFyIGk9MDtpPEtDO2krKyl7aW5kZXg9aT4+Mjt0aGlzLl9LZVtpbmRleF1baSU0XT10a1tpXTt0aGlzLl9LZFtyb3VuZHMtaW5kZXhdW2klNF09dGtbaV19dmFyIHJjb25wb2ludGVyPTA7dmFyIHQ9S0MsdHQ7d2hpbGUodDxyb3VuZEtleUNvdW50KXt0dD10a1tLQy0xXTt0a1swXV49U1t0dD4+MTYmMjU1XTw8MjReU1t0dD4+OCYyNTVdPDwxNl5TW3R0JjI1NV08PDheU1t0dD4+MjQmMjU1XV5yY29uW3Jjb25wb2ludGVyXTw8MjQ7cmNvbnBvaW50ZXIrPTE7aWYoS0MhPTgpe2Zvcih2YXIgaT0xO2k8S0M7aSsrKXt0a1tpXV49dGtbaS0xXX19ZWxzZXtmb3IodmFyIGk9MTtpPEtDLzI7aSsrKXt0a1tpXV49dGtbaS0xXX10dD10a1tLQy8yLTFdO3RrW0tDLzJdXj1TW3R0JjI1NV1eU1t0dD4+OCYyNTVdPDw4XlNbdHQ+PjE2JjI1NV08PDE2XlNbdHQ+PjI0JjI1NV08PDI0O2Zvcih2YXIgaT1LQy8yKzE7aTxLQztpKyspe3RrW2ldXj10a1tpLTFdfX12YXIgaT0wLHIsYzt3aGlsZShpPEtDJiZ0PHJvdW5kS2V5Q291bnQpe3I9dD4+MjtjPXQlNDt0aGlzLl9LZVtyXVtjXT10a1tpXTt0aGlzLl9LZFtyb3VuZHMtcl1bY109dGtbaSsrXTt0Kyt9fWZvcih2YXIgcj0xO3I8cm91bmRzO3IrKyl7Zm9yKHZhciBjPTA7Yzw0O2MrKyl7dHQ9dGhpcy5fS2Rbcl1bY107dGhpcy5fS2Rbcl1bY109VTFbdHQ+PjI0JjI1NV1eVTJbdHQ+PjE2JjI1NV1eVTNbdHQ+PjgmMjU1XV5VNFt0dCYyNTVdfX19O0FFUy5wcm90b3R5cGUuZW5jcnlwdD1mdW5jdGlvbihwbGFpbnRleHQpe2lmKHBsYWludGV4dC5sZW5ndGghPTE2KXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpIil9dmFyIHJvdW5kcz10aGlzLl9LZS5sZW5ndGgtMTt2YXIgYT1bMCwwLDAsMF07dmFyIHQ9Y29udmVydFRvSW50MzIocGxhaW50ZXh0KTtmb3IodmFyIGk9MDtpPDQ7aSsrKXt0W2ldXj10aGlzLl9LZVswXVtpXX1mb3IodmFyIHI9MTtyPHJvdW5kcztyKyspe2Zvcih2YXIgaT0wO2k8NDtpKyspe2FbaV09VDFbdFtpXT4+MjQmMjU1XV5UMlt0WyhpKzEpJTRdPj4xNiYyNTVdXlQzW3RbKGkrMiklNF0+PjgmMjU1XV5UNFt0WyhpKzMpJTRdJjI1NV1edGhpcy5fS2Vbcl1baV19dD1hLnNsaWNlKCl9dmFyIHJlc3VsdD1jcmVhdGVBcnJheSgxNiksdHQ7Zm9yKHZhciBpPTA7aTw0O2krKyl7dHQ9dGhpcy5fS2Vbcm91bmRzXVtpXTtyZXN1bHRbNCppXT0oU1t0W2ldPj4yNCYyNTVdXnR0Pj4yNCkmMjU1O3Jlc3VsdFs0KmkrMV09KFNbdFsoaSsxKSU0XT4+MTYmMjU1XV50dD4+MTYpJjI1NTtyZXN1bHRbNCppKzJdPShTW3RbKGkrMiklNF0+PjgmMjU1XV50dD4+OCkmMjU1O3Jlc3VsdFs0KmkrM109KFNbdFsoaSszKSU0XSYyNTVdXnR0KSYyNTV9cmV0dXJuIHJlc3VsdH07QUVTLnByb3RvdHlwZS5kZWNyeXB0PWZ1bmN0aW9uKGNpcGhlcnRleHQpe2lmKGNpcGhlcnRleHQubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSAxNiBieXRlcykiKX12YXIgcm91bmRzPXRoaXMuX0tkLmxlbmd0aC0xO3ZhciBhPVswLDAsMCwwXTt2YXIgdD1jb252ZXJ0VG9JbnQzMihjaXBoZXJ0ZXh0KTtmb3IodmFyIGk9MDtpPDQ7aSsrKXt0W2ldXj10aGlzLl9LZFswXVtpXX1mb3IodmFyIHI9MTtyPHJvdW5kcztyKyspe2Zvcih2YXIgaT0wO2k8NDtpKyspe2FbaV09VDVbdFtpXT4+MjQmMjU1XV5UNlt0WyhpKzMpJTRdPj4xNiYyNTVdXlQ3W3RbKGkrMiklNF0+PjgmMjU1XV5UOFt0WyhpKzEpJTRdJjI1NV1edGhpcy5fS2Rbcl1baV19dD1hLnNsaWNlKCl9dmFyIHJlc3VsdD1jcmVhdGVBcnJheSgxNiksdHQ7Zm9yKHZhciBpPTA7aTw0O2krKyl7dHQ9dGhpcy5fS2Rbcm91bmRzXVtpXTtyZXN1bHRbNCppXT0oU2lbdFtpXT4+MjQmMjU1XV50dD4+MjQpJjI1NTtyZXN1bHRbNCppKzFdPShTaVt0WyhpKzMpJTRdPj4xNiYyNTVdXnR0Pj4xNikmMjU1O3Jlc3VsdFs0KmkrMl09KFNpW3RbKGkrMiklNF0+PjgmMjU1XV50dD4+OCkmMjU1O3Jlc3VsdFs0KmkrM109KFNpW3RbKGkrMSklNF0mMjU1XV50dCkmMjU1fXJldHVybiByZXN1bHR9O3ZhciBNb2RlT2ZPcGVyYXRpb25FQ0I9ZnVuY3Rpb24oa2V5KXtpZighKHRoaXMgaW5zdGFuY2VvZiBNb2RlT2ZPcGVyYXRpb25FQ0IpKXt0aHJvdyBFcnJvcigiQUVTIG11c3QgYmUgaW5zdGFuaXRhdGVkIHdpdGggYG5ld2AiKX10aGlzLmRlc2NyaXB0aW9uPSJFbGVjdHJvbmljIENvZGUgQmxvY2siO3RoaXMubmFtZT0iZWNiIjt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25FQ0IucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXtwbGFpbnRleHQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0KTtpZihwbGFpbnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIHBsYWludGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBjaXBoZXJ0ZXh0PWNyZWF0ZUFycmF5KHBsYWludGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPTE2KXtjb3B5QXJyYXkocGxhaW50ZXh0LGJsb2NrLDAsaSxpKzE2KTtibG9jaz10aGlzLl9hZXMuZW5jcnlwdChibG9jayk7Y29weUFycmF5KGJsb2NrLGNpcGhlcnRleHQsaSl9cmV0dXJuIGNpcGhlcnRleHR9O01vZGVPZk9wZXJhdGlvbkVDQi5wcm90b3R5cGUuZGVjcnlwdD1mdW5jdGlvbihjaXBoZXJ0ZXh0KXtjaXBoZXJ0ZXh0PWNvZXJjZUFycmF5KGNpcGhlcnRleHQpO2lmKGNpcGhlcnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSBtdWx0aXBsZSBvZiAxNiBieXRlcykiKX12YXIgcGxhaW50ZXh0PWNyZWF0ZUFycmF5KGNpcGhlcnRleHQubGVuZ3RoKTt2YXIgYmxvY2s9Y3JlYXRlQXJyYXkoMTYpO2Zvcih2YXIgaT0wO2k8Y2lwaGVydGV4dC5sZW5ndGg7aSs9MTYpe2NvcHlBcnJheShjaXBoZXJ0ZXh0LGJsb2NrLDAsaSxpKzE2KTtibG9jaz10aGlzLl9hZXMuZGVjcnlwdChibG9jayk7Y29weUFycmF5KGJsb2NrLHBsYWludGV4dCxpKX1yZXR1cm4gcGxhaW50ZXh0fTt2YXIgTW9kZU9mT3BlcmF0aW9uQ0JDPWZ1bmN0aW9uKGtleSxpdil7aWYoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ0JDKSl7dGhyb3cgRXJyb3IoIkFFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgIil9dGhpcy5kZXNjcmlwdGlvbj0iQ2lwaGVyIEJsb2NrIENoYWluaW5nIjt0aGlzLm5hbWU9ImNiYyI7aWYoIWl2KXtpdj1jcmVhdGVBcnJheSgxNil9ZWxzZSBpZihpdi5sZW5ndGghPTE2KXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgaW5pdGlhbGF0aW9uIHZlY3RvciBzaXplIChtdXN0IGJlIDE2IGJ5dGVzKSIpfXRoaXMuX2xhc3RDaXBoZXJibG9jaz1jb2VyY2VBcnJheShpdix0cnVlKTt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25DQkMucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXtwbGFpbnRleHQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0KTtpZihwbGFpbnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIHBsYWludGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBjaXBoZXJ0ZXh0PWNyZWF0ZUFycmF5KHBsYWludGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPTE2KXtjb3B5QXJyYXkocGxhaW50ZXh0LGJsb2NrLDAsaSxpKzE2KTtmb3IodmFyIGo9MDtqPDE2O2orKyl7YmxvY2tbal1ePXRoaXMuX2xhc3RDaXBoZXJibG9ja1tqXX10aGlzLl9sYXN0Q2lwaGVyYmxvY2s9dGhpcy5fYWVzLmVuY3J5cHQoYmxvY2spO2NvcHlBcnJheSh0aGlzLl9sYXN0Q2lwaGVyYmxvY2ssY2lwaGVydGV4dCxpKX1yZXR1cm4gY2lwaGVydGV4dH07TW9kZU9mT3BlcmF0aW9uQ0JDLnByb3RvdHlwZS5kZWNyeXB0PWZ1bmN0aW9uKGNpcGhlcnRleHQpe2NpcGhlcnRleHQ9Y29lcmNlQXJyYXkoY2lwaGVydGV4dCk7aWYoY2lwaGVydGV4dC5sZW5ndGglMTYhPT0wKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgY2lwaGVydGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBwbGFpbnRleHQ9Y3JlYXRlQXJyYXkoY2lwaGVydGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxjaXBoZXJ0ZXh0Lmxlbmd0aDtpKz0xNil7Y29weUFycmF5KGNpcGhlcnRleHQsYmxvY2ssMCxpLGkrMTYpO2Jsb2NrPXRoaXMuX2Flcy5kZWNyeXB0KGJsb2NrKTtmb3IodmFyIGo9MDtqPDE2O2orKyl7cGxhaW50ZXh0W2kral09YmxvY2tbal1edGhpcy5fbGFzdENpcGhlcmJsb2NrW2pdfWNvcHlBcnJheShjaXBoZXJ0ZXh0LHRoaXMuX2xhc3RDaXBoZXJibG9jaywwLGksaSsxNil9cmV0dXJuIHBsYWludGV4dH07dmFyIE1vZGVPZk9wZXJhdGlvbkNGQj1mdW5jdGlvbihrZXksaXYsc2VnbWVudFNpemUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbkNGQikpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfXRoaXMuZGVzY3JpcHRpb249IkNpcGhlciBGZWVkYmFjayI7dGhpcy5uYW1lPSJjZmIiO2lmKCFpdil7aXY9Y3JlYXRlQXJyYXkoMTYpfWVsc2UgaWYoaXYubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGluaXRpYWxhdGlvbiB2ZWN0b3Igc2l6ZSAobXVzdCBiZSAxNiBzaXplKSIpfWlmKCFzZWdtZW50U2l6ZSl7c2VnbWVudFNpemU9MX10aGlzLnNlZ21lbnRTaXplPXNlZ21lbnRTaXplO3RoaXMuX3NoaWZ0UmVnaXN0ZXI9Y29lcmNlQXJyYXkoaXYsdHJ1ZSk7dGhpcy5fYWVzPW5ldyBBRVMoa2V5KX07TW9kZU9mT3BlcmF0aW9uQ0ZCLnByb3RvdHlwZS5lbmNyeXB0PWZ1bmN0aW9uKHBsYWludGV4dCl7aWYocGxhaW50ZXh0Lmxlbmd0aCV0aGlzLnNlZ21lbnRTaXplIT0wKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgc2VnbWVudFNpemUgYnl0ZXMpIil9dmFyIGVuY3J5cHRlZD1jb2VyY2VBcnJheShwbGFpbnRleHQsdHJ1ZSk7dmFyIHhvclNlZ21lbnQ7Zm9yKHZhciBpPTA7aTxlbmNyeXB0ZWQubGVuZ3RoO2krPXRoaXMuc2VnbWVudFNpemUpe3hvclNlZ21lbnQ9dGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fc2hpZnRSZWdpc3Rlcik7Zm9yKHZhciBqPTA7ajx0aGlzLnNlZ21lbnRTaXplO2orKyl7ZW5jcnlwdGVkW2kral1ePXhvclNlZ21lbnRbal19Y29weUFycmF5KHRoaXMuX3NoaWZ0UmVnaXN0ZXIsdGhpcy5fc2hpZnRSZWdpc3RlciwwLHRoaXMuc2VnbWVudFNpemUpO2NvcHlBcnJheShlbmNyeXB0ZWQsdGhpcy5fc2hpZnRSZWdpc3RlciwxNi10aGlzLnNlZ21lbnRTaXplLGksaSt0aGlzLnNlZ21lbnRTaXplKX1yZXR1cm4gZW5jcnlwdGVkfTtNb2RlT2ZPcGVyYXRpb25DRkIucHJvdG90eXBlLmRlY3J5cHQ9ZnVuY3Rpb24oY2lwaGVydGV4dCl7aWYoY2lwaGVydGV4dC5sZW5ndGgldGhpcy5zZWdtZW50U2l6ZSE9MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSBzZWdtZW50U2l6ZSBieXRlcykiKX12YXIgcGxhaW50ZXh0PWNvZXJjZUFycmF5KGNpcGhlcnRleHQsdHJ1ZSk7dmFyIHhvclNlZ21lbnQ7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPXRoaXMuc2VnbWVudFNpemUpe3hvclNlZ21lbnQ9dGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fc2hpZnRSZWdpc3Rlcik7Zm9yKHZhciBqPTA7ajx0aGlzLnNlZ21lbnRTaXplO2orKyl7cGxhaW50ZXh0W2kral1ePXhvclNlZ21lbnRbal19Y29weUFycmF5KHRoaXMuX3NoaWZ0UmVnaXN0ZXIsdGhpcy5fc2hpZnRSZWdpc3RlciwwLHRoaXMuc2VnbWVudFNpemUpO2NvcHlBcnJheShjaXBoZXJ0ZXh0LHRoaXMuX3NoaWZ0UmVnaXN0ZXIsMTYtdGhpcy5zZWdtZW50U2l6ZSxpLGkrdGhpcy5zZWdtZW50U2l6ZSl9cmV0dXJuIHBsYWludGV4dH07dmFyIE1vZGVPZk9wZXJhdGlvbk9GQj1mdW5jdGlvbihrZXksaXYpe2lmKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbk9GQikpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfXRoaXMuZGVzY3JpcHRpb249Ik91dHB1dCBGZWVkYmFjayI7dGhpcy5uYW1lPSJvZmIiO2lmKCFpdil7aXY9Y3JlYXRlQXJyYXkoMTYpfWVsc2UgaWYoaXYubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGluaXRpYWxhdGlvbiB2ZWN0b3Igc2l6ZSAobXVzdCBiZSAxNiBieXRlcykiKX10aGlzLl9sYXN0UHJlY2lwaGVyPWNvZXJjZUFycmF5KGl2LHRydWUpO3RoaXMuX2xhc3RQcmVjaXBoZXJJbmRleD0xNjt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25PRkIucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXt2YXIgZW5jcnlwdGVkPWNvZXJjZUFycmF5KHBsYWludGV4dCx0cnVlKTtmb3IodmFyIGk9MDtpPGVuY3J5cHRlZC5sZW5ndGg7aSsrKXtpZih0aGlzLl9sYXN0UHJlY2lwaGVySW5kZXg9PT0xNil7dGhpcy5fbGFzdFByZWNpcGhlcj10aGlzLl9hZXMuZW5jcnlwdCh0aGlzLl9sYXN0UHJlY2lwaGVyKTt0aGlzLl9sYXN0UHJlY2lwaGVySW5kZXg9MH1lbmNyeXB0ZWRbaV1ePXRoaXMuX2xhc3RQcmVjaXBoZXJbdGhpcy5fbGFzdFByZWNpcGhlckluZGV4KytdfXJldHVybiBlbmNyeXB0ZWR9O01vZGVPZk9wZXJhdGlvbk9GQi5wcm90b3R5cGUuZGVjcnlwdD1Nb2RlT2ZPcGVyYXRpb25PRkIucHJvdG90eXBlLmVuY3J5cHQ7dmFyIENvdW50ZXI9ZnVuY3Rpb24oaW5pdGlhbFZhbHVlKXtpZighKHRoaXMgaW5zdGFuY2VvZiBDb3VudGVyKSl7dGhyb3cgRXJyb3IoIkNvdW50ZXIgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfWlmKGluaXRpYWxWYWx1ZSE9PTAmJiFpbml0aWFsVmFsdWUpe2luaXRpYWxWYWx1ZT0xfWlmKHR5cGVvZiBpbml0aWFsVmFsdWU9PT0ibnVtYmVyIil7dGhpcy5fY291bnRlcj1jcmVhdGVBcnJheSgxNik7dGhpcy5zZXRWYWx1ZShpbml0aWFsVmFsdWUpfWVsc2V7dGhpcy5zZXRCeXRlcyhpbml0aWFsVmFsdWUpfX07Q291bnRlci5wcm90b3R5cGUuc2V0VmFsdWU9ZnVuY3Rpb24odmFsdWUpe2lmKHR5cGVvZiB2YWx1ZSE9PSJudW1iZXIifHxwYXJzZUludCh2YWx1ZSkhPXZhbHVlKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgY291bnRlciB2YWx1ZSAobXVzdCBiZSBhbiBpbnRlZ2VyKSIpfWlmKHZhbHVlPk51bWJlci5NQVhfU0FGRV9JTlRFR0VSKXt0aHJvdyBuZXcgRXJyb3IoImludGVnZXIgdmFsdWUgb3V0IG9mIHNhZmUgcmFuZ2UiKX1mb3IodmFyIGluZGV4PTE1O2luZGV4Pj0wOy0taW5kZXgpe3RoaXMuX2NvdW50ZXJbaW5kZXhdPXZhbHVlJTI1Njt2YWx1ZT1wYXJzZUludCh2YWx1ZS8yNTYpfX07Q291bnRlci5wcm90b3R5cGUuc2V0Qnl0ZXM9ZnVuY3Rpb24oYnl0ZXMpe2J5dGVzPWNvZXJjZUFycmF5KGJ5dGVzLHRydWUpO2lmKGJ5dGVzLmxlbmd0aCE9MTYpe3Rocm93IG5ldyBFcnJvcigiaW52YWxpZCBjb3VudGVyIGJ5dGVzIHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpIil9dGhpcy5fY291bnRlcj1ieXRlc307Q291bnRlci5wcm90b3R5cGUuaW5jcmVtZW50PWZ1bmN0aW9uKCl7Zm9yKHZhciBpPTE1O2k+PTA7aS0tKXtpZih0aGlzLl9jb3VudGVyW2ldPT09MjU1KXt0aGlzLl9jb3VudGVyW2ldPTB9ZWxzZXt0aGlzLl9jb3VudGVyW2ldKys7YnJlYWt9fX07dmFyIE1vZGVPZk9wZXJhdGlvbkNUUj1mdW5jdGlvbihrZXksY291bnRlcil7aWYoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ1RSKSl7dGhyb3cgRXJyb3IoIkFFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgIil9dGhpcy5kZXNjcmlwdGlvbj0iQ291bnRlciI7dGhpcy5uYW1lPSJjdHIiO2lmKCEoY291bnRlciBpbnN0YW5jZW9mIENvdW50ZXIpKXtjb3VudGVyPW5ldyBDb3VudGVyKGNvdW50ZXIpfXRoaXMuX2NvdW50ZXI9Y291bnRlcjt0aGlzLl9yZW1haW5pbmdDb3VudGVyPW51bGw7dGhpcy5fcmVtYWluaW5nQ291bnRlckluZGV4PTE2O3RoaXMuX2Flcz1uZXcgQUVTKGtleSl9O01vZGVPZk9wZXJhdGlvbkNUUi5wcm90b3R5cGUuZW5jcnlwdD1mdW5jdGlvbihwbGFpbnRleHQpe3ZhciBlbmNyeXB0ZWQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0LHRydWUpO2Zvcih2YXIgaT0wO2k8ZW5jcnlwdGVkLmxlbmd0aDtpKyspe2lmKHRoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleD09PTE2KXt0aGlzLl9yZW1haW5pbmdDb3VudGVyPXRoaXMuX2Flcy5lbmNyeXB0KHRoaXMuX2NvdW50ZXIuX2NvdW50ZXIpO3RoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleD0wO3RoaXMuX2NvdW50ZXIuaW5jcmVtZW50KCl9ZW5jcnlwdGVkW2ldXj10aGlzLl9yZW1haW5pbmdDb3VudGVyW3RoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleCsrXX1yZXR1cm4gZW5jcnlwdGVkfTtNb2RlT2ZPcGVyYXRpb25DVFIucHJvdG90eXBlLmRlY3J5cHQ9TW9kZU9mT3BlcmF0aW9uQ1RSLnByb3RvdHlwZS5lbmNyeXB0O2Z1bmN0aW9uIHBrY3M3cGFkKGRhdGEpe2RhdGE9Y29lcmNlQXJyYXkoZGF0YSx0cnVlKTt2YXIgcGFkZGVyPTE2LWRhdGEubGVuZ3RoJTE2O3ZhciByZXN1bHQ9Y3JlYXRlQXJyYXkoZGF0YS5sZW5ndGgrcGFkZGVyKTtjb3B5QXJyYXkoZGF0YSxyZXN1bHQpO2Zvcih2YXIgaT1kYXRhLmxlbmd0aDtpPHJlc3VsdC5sZW5ndGg7aSsrKXtyZXN1bHRbaV09cGFkZGVyfXJldHVybiByZXN1bHR9ZnVuY3Rpb24gcGtjczdzdHJpcChkYXRhKXtkYXRhPWNvZXJjZUFycmF5KGRhdGEsdHJ1ZSk7aWYoZGF0YS5sZW5ndGg8MTYpe3Rocm93IG5ldyBFcnJvcigiUEtDUyM3IGludmFsaWQgbGVuZ3RoIil9dmFyIHBhZGRlcj1kYXRhW2RhdGEubGVuZ3RoLTFdO2lmKHBhZGRlcj4xNil7dGhyb3cgbmV3IEVycm9yKCJQS0NTIzcgcGFkZGluZyBieXRlIG91dCBvZiByYW5nZSIpfXZhciBsZW5ndGg9ZGF0YS5sZW5ndGgtcGFkZGVyO2Zvcih2YXIgaT0wO2k8cGFkZGVyO2krKyl7aWYoZGF0YVtsZW5ndGgraV0hPT1wYWRkZXIpe3Rocm93IG5ldyBFcnJvcigiUEtDUyM3IGludmFsaWQgcGFkZGluZyBieXRlIil9fXZhciByZXN1bHQ9Y3JlYXRlQXJyYXkobGVuZ3RoKTtjb3B5QXJyYXkoZGF0YSxyZXN1bHQsMCwwLGxlbmd0aCk7cmV0dXJuIHJlc3VsdH12YXIgYWVzanM9e0FFUzpBRVMsQ291bnRlcjpDb3VudGVyLE1vZGVPZk9wZXJhdGlvbjp7ZWNiOk1vZGVPZk9wZXJhdGlvbkVDQixjYmM6TW9kZU9mT3BlcmF0aW9uQ0JDLGNmYjpNb2RlT2ZPcGVyYXRpb25DRkIsb2ZiOk1vZGVPZk9wZXJhdGlvbk9GQixjdHI6TW9kZU9mT3BlcmF0aW9uQ1RSfSx1dGlsczp7aGV4OmNvbnZlcnRIZXgsdXRmODpjb252ZXJ0VXRmOH0scGFkZGluZzp7cGtjczc6e3BhZDpwa2NzN3BhZCxzdHJpcDpwa2NzN3N0cmlwfX0sX2FycmF5VGVzdDp7Y29lcmNlQXJyYXk6Y29lcmNlQXJyYXksY3JlYXRlQXJyYXk6Y3JlYXRlQXJyYXksY29weUFycmF5OmNvcHlBcnJheX19O2lmKHR5cGVvZiBleHBvcnRzIT09InVuZGVmaW5lZCIpe21vZHVsZS5leHBvcnRzPWFlc2pzfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PSJmdW5jdGlvbiImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmdW5jdGlvbigpe3JldHVybiBhZXNqc30pfWVsc2V7aWYocm9vdC5hZXNqcyl7YWVzanMuX2Flc2pzPXJvb3QuYWVzanN9cm9vdC5hZXNqcz1hZXNqc319KSh0aGlzKX0se31dLDE0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz17bmV3SW52YWxpZEFzbjFFcnJvcjpmdW5jdGlvbihtc2cpe3ZhciBlPW5ldyBFcnJvcjtlLm5hbWU9IkludmFsaWRBc24xRXJyb3IiO2UubWVzc2FnZT1tc2d8fCIiO3JldHVybiBlfX19LHt9XSwxNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGVycm9ycz1yZXF1aXJlKCIuL2Vycm9ycyIpO3ZhciB0eXBlcz1yZXF1aXJlKCIuL3R5cGVzIik7dmFyIFJlYWRlcj1yZXF1aXJlKCIuL3JlYWRlciIpO3ZhciBXcml0ZXI9cmVxdWlyZSgiLi93cml0ZXIiKTttb2R1bGUuZXhwb3J0cz17UmVhZGVyOlJlYWRlcixXcml0ZXI6V3JpdGVyfTtmb3IodmFyIHQgaW4gdHlwZXMpe2lmKHR5cGVzLmhhc093blByb3BlcnR5KHQpKW1vZHVsZS5leHBvcnRzW3RdPXR5cGVzW3RdfWZvcih2YXIgZSBpbiBlcnJvcnMpe2lmKGVycm9ycy5oYXNPd25Qcm9wZXJ0eShlKSltb2R1bGUuZXhwb3J0c1tlXT1lcnJvcnNbZV19fSx7Ii4vZXJyb3JzIjoxNCwiLi9yZWFkZXIiOjE2LCIuL3R5cGVzIjoxNywiLi93cml0ZXIiOjE4fV0sMTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBhc3NlcnQ9cmVxdWlyZSgiYXNzZXJ0Iik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlci1idWZmZXIiKS5CdWZmZXI7dmFyIEFTTjE9cmVxdWlyZSgiLi90eXBlcyIpO3ZhciBlcnJvcnM9cmVxdWlyZSgiLi9lcnJvcnMiKTt2YXIgbmV3SW52YWxpZEFzbjFFcnJvcj1lcnJvcnMubmV3SW52YWxpZEFzbjFFcnJvcjtmdW5jdGlvbiBSZWFkZXIoZGF0YSl7aWYoIWRhdGF8fCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpdGhyb3cgbmV3IFR5cGVFcnJvcigiZGF0YSBtdXN0IGJlIGEgbm9kZSBCdWZmZXIiKTt0aGlzLl9idWY9ZGF0YTt0aGlzLl9zaXplPWRhdGEubGVuZ3RoO3RoaXMuX2xlbj0wO3RoaXMuX29mZnNldD0wfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkZXIucHJvdG90eXBlLCJsZW5ndGgiLHtlbnVtZXJhYmxlOnRydWUsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xlbn19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwib2Zmc2V0Iix7ZW51bWVyYWJsZTp0cnVlLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9vZmZzZXR9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRlci5wcm90b3R5cGUsInJlbWFpbiIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zaXplLXRoaXMuX29mZnNldH19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwiYnVmZmVyIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2J1Zi5zbGljZSh0aGlzLl9vZmZzZXQpfX0pO1JlYWRlci5wcm90b3R5cGUucmVhZEJ5dGU9ZnVuY3Rpb24ocGVlayl7aWYodGhpcy5fc2l6ZS10aGlzLl9vZmZzZXQ8MSlyZXR1cm4gbnVsbDt2YXIgYj10aGlzLl9idWZbdGhpcy5fb2Zmc2V0XSYyNTU7aWYoIXBlZWspdGhpcy5fb2Zmc2V0Kz0xO3JldHVybiBifTtSZWFkZXIucHJvdG90eXBlLnBlZWs9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZWFkQnl0ZSh0cnVlKX07UmVhZGVyLnByb3RvdHlwZS5yZWFkTGVuZ3RoPWZ1bmN0aW9uKG9mZnNldCl7aWYob2Zmc2V0PT09dW5kZWZpbmVkKW9mZnNldD10aGlzLl9vZmZzZXQ7aWYob2Zmc2V0Pj10aGlzLl9zaXplKXJldHVybiBudWxsO3ZhciBsZW5CPXRoaXMuX2J1ZltvZmZzZXQrK10mMjU1O2lmKGxlbkI9PT1udWxsKXJldHVybiBudWxsO2lmKChsZW5CJjEyOCk9PT0xMjgpe2xlbkImPTEyNztpZihsZW5CPT09MCl0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCJJbmRlZmluaXRlIGxlbmd0aCBub3Qgc3VwcG9ydGVkIik7aWYobGVuQj40KXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoImVuY29kaW5nIHRvbyBsb25nIik7aWYodGhpcy5fc2l6ZS1vZmZzZXQ8bGVuQilyZXR1cm4gbnVsbDt0aGlzLl9sZW49MDtmb3IodmFyIGk9MDtpPGxlbkI7aSsrKXRoaXMuX2xlbj0odGhpcy5fbGVuPDw4KSsodGhpcy5fYnVmW29mZnNldCsrXSYyNTUpfWVsc2V7dGhpcy5fbGVuPWxlbkJ9cmV0dXJuIG9mZnNldH07UmVhZGVyLnByb3RvdHlwZS5yZWFkU2VxdWVuY2U9ZnVuY3Rpb24odGFnKXt2YXIgc2VxPXRoaXMucGVlaygpO2lmKHNlcT09PW51bGwpcmV0dXJuIG51bGw7aWYodGFnIT09dW5kZWZpbmVkJiZ0YWchPT1zZXEpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiRXhwZWN0ZWQgMHgiK3RhZy50b1N0cmluZygxNikrIjogZ290IDB4IitzZXEudG9TdHJpbmcoMTYpKTt2YXIgbz10aGlzLnJlYWRMZW5ndGgodGhpcy5fb2Zmc2V0KzEpO2lmKG89PT1udWxsKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO3JldHVybiBzZXF9O1JlYWRlci5wcm90b3R5cGUucmVhZEludD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkVGFnKEFTTjEuSW50ZWdlcil9O1JlYWRlci5wcm90b3R5cGUucmVhZEJvb2xlYW49ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVhZFRhZyhBU04xLkJvb2xlYW4pPT09MD9mYWxzZTp0cnVlfTtSZWFkZXIucHJvdG90eXBlLnJlYWRFbnVtZXJhdGlvbj1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkVGFnKEFTTjEuRW51bWVyYXRpb24pfTtSZWFkZXIucHJvdG90eXBlLnJlYWRTdHJpbmc9ZnVuY3Rpb24odGFnLHJldGJ1Zil7aWYoIXRhZyl0YWc9QVNOMS5PY3RldFN0cmluZzt2YXIgYj10aGlzLnBlZWsoKTtpZihiPT09bnVsbClyZXR1cm4gbnVsbDtpZihiIT09dGFnKXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoIkV4cGVjdGVkIDB4Iit0YWcudG9TdHJpbmcoMTYpKyI6IGdvdCAweCIrYi50b1N0cmluZygxNikpO3ZhciBvPXRoaXMucmVhZExlbmd0aCh0aGlzLl9vZmZzZXQrMSk7aWYobz09PW51bGwpcmV0dXJuIG51bGw7aWYodGhpcy5sZW5ndGg+dGhpcy5fc2l6ZS1vKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO2lmKHRoaXMubGVuZ3RoPT09MClyZXR1cm4gcmV0YnVmP0J1ZmZlci5hbGxvYygwKToiIjt2YXIgc3RyPXRoaXMuX2J1Zi5zbGljZSh0aGlzLl9vZmZzZXQsdGhpcy5fb2Zmc2V0K3RoaXMubGVuZ3RoKTt0aGlzLl9vZmZzZXQrPXRoaXMubGVuZ3RoO3JldHVybiByZXRidWY/c3RyOnN0ci50b1N0cmluZygidXRmOCIpfTtSZWFkZXIucHJvdG90eXBlLnJlYWRPSUQ9ZnVuY3Rpb24odGFnKXtpZighdGFnKXRhZz1BU04xLk9JRDt2YXIgYj10aGlzLnJlYWRTdHJpbmcodGFnLHRydWUpO2lmKGI9PT1udWxsKXJldHVybiBudWxsO3ZhciB2YWx1ZXM9W107dmFyIHZhbHVlPTA7Zm9yKHZhciBpPTA7aTxiLmxlbmd0aDtpKyspe3ZhciBieXRlPWJbaV0mMjU1O3ZhbHVlPDw9Nzt2YWx1ZSs9Ynl0ZSYxMjc7aWYoKGJ5dGUmMTI4KT09PTApe3ZhbHVlcy5wdXNoKHZhbHVlKTt2YWx1ZT0wfX12YWx1ZT12YWx1ZXMuc2hpZnQoKTt2YWx1ZXMudW5zaGlmdCh2YWx1ZSU0MCk7dmFsdWVzLnVuc2hpZnQodmFsdWUvNDA+PjApO3JldHVybiB2YWx1ZXMuam9pbigiLiIpfTtSZWFkZXIucHJvdG90eXBlLl9yZWFkVGFnPWZ1bmN0aW9uKHRhZyl7YXNzZXJ0Lm9rKHRhZyE9PXVuZGVmaW5lZCk7dmFyIGI9dGhpcy5wZWVrKCk7aWYoYj09PW51bGwpcmV0dXJuIG51bGw7aWYoYiE9PXRhZyl0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCJFeHBlY3RlZCAweCIrdGFnLnRvU3RyaW5nKDE2KSsiOiBnb3QgMHgiK2IudG9TdHJpbmcoMTYpKTt2YXIgbz10aGlzLnJlYWRMZW5ndGgodGhpcy5fb2Zmc2V0KzEpO2lmKG89PT1udWxsKXJldHVybiBudWxsO2lmKHRoaXMubGVuZ3RoPjQpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiSW50ZWdlciB0b28gbG9uZzogIit0aGlzLmxlbmd0aCk7aWYodGhpcy5sZW5ndGg+dGhpcy5fc2l6ZS1vKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO3ZhciBmYj10aGlzLl9idWZbdGhpcy5fb2Zmc2V0XTt2YXIgdmFsdWU9MDtmb3IodmFyIGk9MDtpPHRoaXMubGVuZ3RoO2krKyl7dmFsdWU8PD04O3ZhbHVlfD10aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdJjI1NX1pZigoZmImMTI4KT09PTEyOCYmaSE9PTQpdmFsdWUtPTE8PGkqODtyZXR1cm4gdmFsdWU+PjB9O21vZHVsZS5leHBvcnRzPVJlYWRlcn0seyIuL2Vycm9ycyI6MTQsIi4vdHlwZXMiOjE3LGFzc2VydDoyMCwic2FmZXItYnVmZmVyIjo4MH1dLDE3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz17RU9DOjAsQm9vbGVhbjoxLEludGVnZXI6MixCaXRTdHJpbmc6MyxPY3RldFN0cmluZzo0LE51bGw6NSxPSUQ6NixPYmplY3REZXNjcmlwdG9yOjcsRXh0ZXJuYWw6OCxSZWFsOjksRW51bWVyYXRpb246MTAsUERWOjExLFV0ZjhTdHJpbmc6MTIsUmVsYXRpdmVPSUQ6MTMsU2VxdWVuY2U6MTYsU2V0OjE3LE51bWVyaWNTdHJpbmc6MTgsUHJpbnRhYmxlU3RyaW5nOjE5LFQ2MVN0cmluZzoyMCxWaWRlb3RleFN0cmluZzoyMSxJQTVTdHJpbmc6MjIsVVRDVGltZToyMyxHZW5lcmFsaXplZFRpbWU6MjQsR3JhcGhpY1N0cmluZzoyNSxWaXNpYmxlU3RyaW5nOjI2LEdlbmVyYWxTdHJpbmc6MjgsVW5pdmVyc2FsU3RyaW5nOjI5LENoYXJhY3RlclN0cmluZzozMCxCTVBTdHJpbmc6MzEsQ29uc3RydWN0b3I6MzIsQ29udGV4dDoxMjh9fSx7fV0sMTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBhc3NlcnQ9cmVxdWlyZSgiYXNzZXJ0Iik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlci1idWZmZXIiKS5CdWZmZXI7dmFyIEFTTjE9cmVxdWlyZSgiLi90eXBlcyIpO3ZhciBlcnJvcnM9cmVxdWlyZSgiLi9lcnJvcnMiKTt2YXIgbmV3SW52YWxpZEFzbjFFcnJvcj1lcnJvcnMubmV3SW52YWxpZEFzbjFFcnJvcjt2YXIgREVGQVVMVF9PUFRTPXtzaXplOjEwMjQsZ3Jvd3RoRmFjdG9yOjh9O2Z1bmN0aW9uIG1lcmdlKGZyb20sdG8pe2Fzc2VydC5vayhmcm9tKTthc3NlcnQuZXF1YWwodHlwZW9mIGZyb20sIm9iamVjdCIpO2Fzc2VydC5vayh0byk7YXNzZXJ0LmVxdWFsKHR5cGVvZiB0bywib2JqZWN0Iik7dmFyIGtleXM9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZnJvbSk7a2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7aWYodG9ba2V5XSlyZXR1cm47dmFyIHZhbHVlPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZnJvbSxrZXkpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0byxrZXksdmFsdWUpfSk7cmV0dXJuIHRvfWZ1bmN0aW9uIFdyaXRlcihvcHRpb25zKXtvcHRpb25zPW1lcmdlKERFRkFVTFRfT1BUUyxvcHRpb25zfHx7fSk7dGhpcy5fYnVmPUJ1ZmZlci5hbGxvYyhvcHRpb25zLnNpemV8fDEwMjQpO3RoaXMuX3NpemU9dGhpcy5fYnVmLmxlbmd0aDt0aGlzLl9vZmZzZXQ9MDt0aGlzLl9vcHRpb25zPW9wdGlvbnM7dGhpcy5fc2VxPVtdfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0ZXIucHJvdG90eXBlLCJidWZmZXIiLHtnZXQ6ZnVuY3Rpb24oKXtpZih0aGlzLl9zZXEubGVuZ3RoKXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IodGhpcy5fc2VxLmxlbmd0aCsiIHVuZW5kZWQgc2VxdWVuY2UocykiKTtyZXR1cm4gdGhpcy5fYnVmLnNsaWNlKDAsdGhpcy5fb2Zmc2V0KX19KTtXcml0ZXIucHJvdG90eXBlLndyaXRlQnl0ZT1mdW5jdGlvbihiKXtpZih0eXBlb2YgYiE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTt0aGlzLl9lbnN1cmUoMSk7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT1ifTtXcml0ZXIucHJvdG90eXBlLndyaXRlSW50PWZ1bmN0aW9uKGksdGFnKXtpZih0eXBlb2YgaSE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuSW50ZWdlcjt2YXIgc3o9NDt3aGlsZSgoKGkmNDI4NjU3ODY4OCk9PT0wfHwoaSY0Mjg2NTc4Njg4KT09PTQyODY1Nzg2ODg+PjApJiZzej4xKXtzei0tO2k8PD04fWlmKHN6PjQpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiQkVSIGludHMgY2Fubm90IGJlID4gMHhmZmZmZmZmZiIpO3RoaXMuX2Vuc3VyZSgyK3N6KTt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPXRhZzt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPXN6O3doaWxlKHN6LS0gPjApe3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109KGkmNDI3ODE5MDA4MCk+Pj4yNDtpPDw9OH19O1dyaXRlci5wcm90b3R5cGUud3JpdGVOdWxsPWZ1bmN0aW9uKCl7dGhpcy53cml0ZUJ5dGUoQVNOMS5OdWxsKTt0aGlzLndyaXRlQnl0ZSgwKX07V3JpdGVyLnByb3RvdHlwZS53cml0ZUVudW1lcmF0aW9uPWZ1bmN0aW9uKGksdGFnKXtpZih0eXBlb2YgaSE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuRW51bWVyYXRpb247cmV0dXJuIHRoaXMud3JpdGVJbnQoaSx0YWcpfTtXcml0ZXIucHJvdG90eXBlLndyaXRlQm9vbGVhbj1mdW5jdGlvbihiLHRhZyl7aWYodHlwZW9mIGIhPT0iYm9vbGVhbiIpdGhyb3cgbmV3IFR5cGVFcnJvcigiYXJndW1lbnQgbXVzdCBiZSBhIEJvb2xlYW4iKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuQm9vbGVhbjt0aGlzLl9lbnN1cmUoMyk7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT10YWc7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT0xO3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109Yj8yNTU6MH07V3JpdGVyLnByb3RvdHlwZS53cml0ZVN0cmluZz1mdW5jdGlvbihzLHRhZyl7aWYodHlwZW9mIHMhPT0ic3RyaW5nIil0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nICh3YXM6ICIrdHlwZW9mIHMrIikiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuT2N0ZXRTdHJpbmc7dmFyIGxlbj1CdWZmZXIuYnl0ZUxlbmd0aChzKTt0aGlzLndyaXRlQnl0ZSh0YWcpO3RoaXMud3JpdGVMZW5ndGgobGVuKTtpZihsZW4pe3RoaXMuX2Vuc3VyZShsZW4pO3RoaXMuX2J1Zi53cml0ZShzLHRoaXMuX29mZnNldCk7dGhpcy5fb2Zmc2V0Kz1sZW59fTtXcml0ZXIucHJvdG90eXBlLndyaXRlQnVmZmVyPWZ1bmN0aW9uKGJ1Zix0YWcpe2lmKHR5cGVvZiB0YWchPT0ibnVtYmVyIil0aHJvdyBuZXcgVHlwZUVycm9yKCJ0YWcgbXVzdCBiZSBhIG51bWJlciIpO2lmKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSl0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgYnVmZmVyIik7dGhpcy53cml0ZUJ5dGUodGFnKTt0aGlzLndyaXRlTGVuZ3RoKGJ1Zi5sZW5ndGgpO3RoaXMuX2Vuc3VyZShidWYubGVuZ3RoKTtidWYuY29weSh0aGlzLl9idWYsdGhpcy5fb2Zmc2V0LDAsYnVmLmxlbmd0aCk7dGhpcy5fb2Zmc2V0Kz1idWYubGVuZ3RofTtXcml0ZXIucHJvdG90eXBlLndyaXRlU3RyaW5nQXJyYXk9ZnVuY3Rpb24oc3RyaW5ncyl7aWYoIXN0cmluZ3MgaW5zdGFuY2VvZiBBcnJheSl0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5W1N0cmluZ10iKTt2YXIgc2VsZj10aGlzO3N0cmluZ3MuZm9yRWFjaChmdW5jdGlvbihzKXtzZWxmLndyaXRlU3RyaW5nKHMpfSl9O1dyaXRlci5wcm90b3R5cGUud3JpdGVPSUQ9ZnVuY3Rpb24ocyx0YWcpe2lmKHR5cGVvZiBzIT09InN0cmluZyIpdGhyb3cgbmV3IFR5cGVFcnJvcigiYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZyIpO2lmKHR5cGVvZiB0YWchPT0ibnVtYmVyIil0YWc9QVNOMS5PSUQ7aWYoIS9eKFswLTldK1wuKXszLH1bMC05XSskLy50ZXN0KHMpKXRocm93IG5ldyBFcnJvcigiYXJndW1lbnQgaXMgbm90IGEgdmFsaWQgT0lEIHN0cmluZyIpO2Z1bmN0aW9uIGVuY29kZU9jdGV0KGJ5dGVzLG9jdGV0KXtpZihvY3RldDwxMjgpe2J5dGVzLnB1c2gob2N0ZXQpfWVsc2UgaWYob2N0ZXQ8MTYzODQpe2J5dGVzLnB1c2gob2N0ZXQ+Pj43fDEyOCk7Ynl0ZXMucHVzaChvY3RldCYxMjcpfWVsc2UgaWYob2N0ZXQ8MjA5NzE1Mil7Ynl0ZXMucHVzaChvY3RldD4+PjE0fDEyOCk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj43fDEyOCkmMjU1KTtieXRlcy5wdXNoKG9jdGV0JjEyNyl9ZWxzZSBpZihvY3RldDwyNjg0MzU0NTYpe2J5dGVzLnB1c2gob2N0ZXQ+Pj4yMXwxMjgpO2J5dGVzLnB1c2goKG9jdGV0Pj4+MTR8MTI4KSYyNTUpO2J5dGVzLnB1c2goKG9jdGV0Pj4+N3wxMjgpJjI1NSk7Ynl0ZXMucHVzaChvY3RldCYxMjcpfWVsc2V7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4yOHwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4yMXwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4xNHwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj43fDEyOCkmMjU1KTtieXRlcy5wdXNoKG9jdGV0JjEyNyl9fXZhciB0bXA9cy5zcGxpdCgiLiIpO3ZhciBieXRlcz1bXTtieXRlcy5wdXNoKHBhcnNlSW50KHRtcFswXSwxMCkqNDArcGFyc2VJbnQodG1wWzFdLDEwKSk7dG1wLnNsaWNlKDIpLmZvckVhY2goZnVuY3Rpb24oYil7ZW5jb2RlT2N0ZXQoYnl0ZXMscGFyc2VJbnQoYiwxMCkpfSk7dmFyIHNlbGY9dGhpczt0aGlzLl9lbnN1cmUoMitieXRlcy5sZW5ndGgpO3RoaXMud3JpdGVCeXRlKHRhZyk7dGhpcy53cml0ZUxlbmd0aChieXRlcy5sZW5ndGgpO2J5dGVzLmZvckVhY2goZnVuY3Rpb24oYil7c2VsZi53cml0ZUJ5dGUoYil9KX07V3JpdGVyLnByb3RvdHlwZS53cml0ZUxlbmd0aD1mdW5jdGlvbihsZW4pe2lmKHR5cGVvZiBsZW4hPT0ibnVtYmVyIil0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgTnVtYmVyIik7dGhpcy5fZW5zdXJlKDQpO2lmKGxlbjw9MTI3KXt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPWxlbn1lbHNlIGlmKGxlbjw9MjU1KXt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPTEyOTt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPWxlbn1lbHNlIGlmKGxlbjw9NjU1MzUpe3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109MTMwO3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVuPj44O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVufWVsc2UgaWYobGVuPD0xNjc3NzIxNSl7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT0xMzE7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT1sZW4+PjE2O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVuPj44O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVufWVsc2V7dGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiTGVuZ3RoIHRvbyBsb25nICg+IDQgYnl0ZXMpIil9fTtXcml0ZXIucHJvdG90eXBlLnN0YXJ0U2VxdWVuY2U9ZnVuY3Rpb24odGFnKXtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuU2VxdWVuY2V8QVNOMS5Db25zdHJ1Y3Rvcjt0aGlzLndyaXRlQnl0ZSh0YWcpO3RoaXMuX3NlcS5wdXNoKHRoaXMuX29mZnNldCk7dGhpcy5fZW5zdXJlKDMpO3RoaXMuX29mZnNldCs9M307V3JpdGVyLnByb3RvdHlwZS5lbmRTZXF1ZW5jZT1mdW5jdGlvbigpe3ZhciBzZXE9dGhpcy5fc2VxLnBvcCgpO3ZhciBzdGFydD1zZXErMzt2YXIgbGVuPXRoaXMuX29mZnNldC1zdGFydDtpZihsZW48PTEyNyl7dGhpcy5fc2hpZnQoc3RhcnQsbGVuLC0yKTt0aGlzLl9idWZbc2VxXT1sZW59ZWxzZSBpZihsZW48PTI1NSl7dGhpcy5fc2hpZnQoc3RhcnQsbGVuLC0xKTt0aGlzLl9idWZbc2VxXT0xMjk7dGhpcy5fYnVmW3NlcSsxXT1sZW59ZWxzZSBpZihsZW48PTY1NTM1KXt0aGlzLl9idWZbc2VxXT0xMzA7dGhpcy5fYnVmW3NlcSsxXT1sZW4+Pjg7dGhpcy5fYnVmW3NlcSsyXT1sZW59ZWxzZSBpZihsZW48PTE2Nzc3MjE1KXt0aGlzLl9zaGlmdChzdGFydCxsZW4sMSk7dGhpcy5fYnVmW3NlcV09MTMxO3RoaXMuX2J1ZltzZXErMV09bGVuPj4xNjt0aGlzLl9idWZbc2VxKzJdPWxlbj4+ODt0aGlzLl9idWZbc2VxKzNdPWxlbn1lbHNle3Rocm93IG5ld0ludmFsaWRBc24xRXJyb3IoIlNlcXVlbmNlIHRvbyBsb25nIil9fTtXcml0ZXIucHJvdG90eXBlLl9zaGlmdD1mdW5jdGlvbihzdGFydCxsZW4sc2hpZnQpe2Fzc2VydC5vayhzdGFydCE9PXVuZGVmaW5lZCk7YXNzZXJ0Lm9rKGxlbiE9PXVuZGVmaW5lZCk7YXNzZXJ0Lm9rKHNoaWZ0KTt0aGlzLl9idWYuY29weSh0aGlzLl9idWYsc3RhcnQrc2hpZnQsc3RhcnQsc3RhcnQrbGVuKTt0aGlzLl9vZmZzZXQrPXNoaWZ0fTtXcml0ZXIucHJvdG90eXBlLl9lbnN1cmU9ZnVuY3Rpb24obGVuKXthc3NlcnQub2sobGVuKTtpZih0aGlzLl9zaXplLXRoaXMuX29mZnNldDxsZW4pe3ZhciBzej10aGlzLl9zaXplKnRoaXMuX29wdGlvbnMuZ3Jvd3RoRmFjdG9yO2lmKHN6LXRoaXMuX29mZnNldDxsZW4pc3orPWxlbjt2YXIgYnVmPUJ1ZmZlci5hbGxvYyhzeik7dGhpcy5fYnVmLmNvcHkoYnVmLDAsMCx0aGlzLl9vZmZzZXQpO3RoaXMuX2J1Zj1idWY7dGhpcy5fc2l6ZT1zen19O21vZHVsZS5leHBvcnRzPVdyaXRlcn0seyIuL2Vycm9ycyI6MTQsIi4vdHlwZXMiOjE3LGFzc2VydDoyMCwic2FmZXItYnVmZmVyIjo4MH1dLDE5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgQmVyPXJlcXVpcmUoIi4vYmVyL2luZGV4Iik7bW9kdWxlLmV4cG9ydHM9e0JlcjpCZXIsQmVyUmVhZGVyOkJlci5SZWFkZXIsQmVyV3JpdGVyOkJlci5Xcml0ZXJ9fSx7Ii4vYmVyL2luZGV4IjoxNX1dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXsidXNlIHN0cmljdCI7dmFyIG9iamVjdEFzc2lnbj1yZXF1aXJlKCJvYmplY3QtYXNzaWduIik7ZnVuY3Rpb24gY29tcGFyZShhLGIpe2lmKGE9PT1iKXtyZXR1cm4gMH12YXIgeD1hLmxlbmd0aDt2YXIgeT1iLmxlbmd0aDtmb3IodmFyIGk9MCxsZW49TWF0aC5taW4oeCx5KTtpPGxlbjsrK2kpe2lmKGFbaV0hPT1iW2ldKXt4PWFbaV07eT1iW2ldO2JyZWFrfX1pZih4PHkpe3JldHVybi0xfWlmKHk8eCl7cmV0dXJuIDF9cmV0dXJuIDB9ZnVuY3Rpb24gaXNCdWZmZXIoYil7aWYoZ2xvYmFsLkJ1ZmZlciYmdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXI9PT0iZnVuY3Rpb24iKXtyZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKX1yZXR1cm4hIShiIT1udWxsJiZiLl9pc0J1ZmZlcil9dmFyIHV0aWw9cmVxdWlyZSgidXRpbC8iKTt2YXIgaGFzT3duPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7dmFyIHBTbGljZT1BcnJheS5wcm90b3R5cGUuc2xpY2U7dmFyIGZ1bmN0aW9uc0hhdmVOYW1lcz1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbiBmb28oKXt9Lm5hbWU9PT0iZm9vIn0oKTtmdW5jdGlvbiBwVG9TdHJpbmcob2JqKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iail9ZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zil7aWYoaXNCdWZmZXIoYXJyYnVmKSl7cmV0dXJuIGZhbHNlfWlmKHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIhPT0iZnVuY3Rpb24iKXtyZXR1cm4gZmFsc2V9aWYodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldz09PSJmdW5jdGlvbiIpe3JldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKX1pZighYXJyYnVmKXtyZXR1cm4gZmFsc2V9aWYoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpe3JldHVybiB0cnVlfWlmKGFycmJ1Zi5idWZmZXImJmFycmJ1Zi5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7cmV0dXJuIHRydWV9cmV0dXJuIGZhbHNlfXZhciBhc3NlcnQ9bW9kdWxlLmV4cG9ydHM9b2s7dmFyIHJlZ2V4PS9ccypmdW5jdGlvblxzKyhbXlwoXHNdKilccyovO2Z1bmN0aW9uIGdldE5hbWUoZnVuYyl7aWYoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSl7cmV0dXJufWlmKGZ1bmN0aW9uc0hhdmVOYW1lcyl7cmV0dXJuIGZ1bmMubmFtZX12YXIgc3RyPWZ1bmMudG9TdHJpbmcoKTt2YXIgbWF0Y2g9c3RyLm1hdGNoKHJlZ2V4KTtyZXR1cm4gbWF0Y2gmJm1hdGNoWzFdfWFzc2VydC5Bc3NlcnRpb25FcnJvcj1mdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKXt0aGlzLm5hbWU9IkFzc2VydGlvbkVycm9yIjt0aGlzLmFjdHVhbD1vcHRpb25zLmFjdHVhbDt0aGlzLmV4cGVjdGVkPW9wdGlvbnMuZXhwZWN0ZWQ7dGhpcy5vcGVyYXRvcj1vcHRpb25zLm9wZXJhdG9yO2lmKG9wdGlvbnMubWVzc2FnZSl7dGhpcy5tZXNzYWdlPW9wdGlvbnMubWVzc2FnZTt0aGlzLmdlbmVyYXRlZE1lc3NhZ2U9ZmFsc2V9ZWxzZXt0aGlzLm1lc3NhZ2U9Z2V0TWVzc2FnZSh0aGlzKTt0aGlzLmdlbmVyYXRlZE1lc3NhZ2U9dHJ1ZX12YXIgc3RhY2tTdGFydEZ1bmN0aW9uPW9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9ufHxmYWlsO2lmKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKXtFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLHN0YWNrU3RhcnRGdW5jdGlvbil9ZWxzZXt2YXIgZXJyPW5ldyBFcnJvcjtpZihlcnIuc3RhY2spe3ZhciBvdXQ9ZXJyLnN0YWNrO3ZhciBmbl9uYW1lPWdldE5hbWUoc3RhY2tTdGFydEZ1bmN0aW9uKTt2YXIgaWR4PW91dC5pbmRleE9mKCJcbiIrZm5fbmFtZSk7aWYoaWR4Pj0wKXt2YXIgbmV4dF9saW5lPW91dC5pbmRleE9mKCJcbiIsaWR4KzEpO291dD1vdXQuc3Vic3RyaW5nKG5leHRfbGluZSsxKX10aGlzLnN0YWNrPW91dH19fTt1dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvcixFcnJvcik7ZnVuY3Rpb24gdHJ1bmNhdGUocyxuKXtpZih0eXBlb2Ygcz09PSJzdHJpbmciKXtyZXR1cm4gcy5sZW5ndGg8bj9zOnMuc2xpY2UoMCxuKX1lbHNle3JldHVybiBzfX1mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZyl7aWYoZnVuY3Rpb25zSGF2ZU5hbWVzfHwhdXRpbC5pc0Z1bmN0aW9uKHNvbWV0aGluZykpe3JldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKX12YXIgcmF3bmFtZT1nZXROYW1lKHNvbWV0aGluZyk7dmFyIG5hbWU9cmF3bmFtZT8iOiAiK3Jhd25hbWU6IiI7cmV0dXJuIltGdW5jdGlvbiIrbmFtZSsiXSJ9ZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKXtyZXR1cm4gdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmFjdHVhbCksMTI4KSsiICIrc2VsZi5vcGVyYXRvcisiICIrdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwxMjgpfWZ1bmN0aW9uIGZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Usb3BlcmF0b3Isc3RhY2tTdGFydEZ1bmN0aW9uKXt0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHttZXNzYWdlOm1lc3NhZ2UsYWN0dWFsOmFjdHVhbCxleHBlY3RlZDpleHBlY3RlZCxvcGVyYXRvcjpvcGVyYXRvcixzdGFja1N0YXJ0RnVuY3Rpb246c3RhY2tTdGFydEZ1bmN0aW9ufSl9YXNzZXJ0LmZhaWw9ZmFpbDtmdW5jdGlvbiBvayh2YWx1ZSxtZXNzYWdlKXtpZighdmFsdWUpZmFpbCh2YWx1ZSx0cnVlLG1lc3NhZ2UsIj09Iixhc3NlcnQub2spfWFzc2VydC5vaz1vazthc3NlcnQuZXF1YWw9ZnVuY3Rpb24gZXF1YWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Upe2lmKGFjdHVhbCE9ZXhwZWN0ZWQpZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiPT0iLGFzc2VydC5lcXVhbCl9O2Fzc2VydC5ub3RFcXVhbD1mdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsPT1leHBlY3RlZCl7ZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiIT0iLGFzc2VydC5ub3RFcXVhbCl9fTthc3NlcnQuZGVlcEVxdWFsPWZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoIV9kZWVwRXF1YWwoYWN0dWFsLGV4cGVjdGVkLGZhbHNlKSl7ZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiZGVlcEVxdWFsIixhc3NlcnQuZGVlcEVxdWFsKX19O2Fzc2VydC5kZWVwU3RyaWN0RXF1YWw9ZnVuY3Rpb24gZGVlcFN0cmljdEVxdWFsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlKXtpZighX2RlZXBFcXVhbChhY3R1YWwsZXhwZWN0ZWQsdHJ1ZSkpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsImRlZXBTdHJpY3RFcXVhbCIsYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCl9fTtmdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxzdHJpY3QsbWVtb3Mpe2lmKGFjdHVhbD09PWV4cGVjdGVkKXtyZXR1cm4gdHJ1ZX1lbHNlIGlmKGlzQnVmZmVyKGFjdHVhbCkmJmlzQnVmZmVyKGV4cGVjdGVkKSl7cmV0dXJuIGNvbXBhcmUoYWN0dWFsLGV4cGVjdGVkKT09PTB9ZWxzZSBpZih1dGlsLmlzRGF0ZShhY3R1YWwpJiZ1dGlsLmlzRGF0ZShleHBlY3RlZCkpe3JldHVybiBhY3R1YWwuZ2V0VGltZSgpPT09ZXhwZWN0ZWQuZ2V0VGltZSgpfWVsc2UgaWYodXRpbC5pc1JlZ0V4cChhY3R1YWwpJiZ1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSl7cmV0dXJuIGFjdHVhbC5zb3VyY2U9PT1leHBlY3RlZC5zb3VyY2UmJmFjdHVhbC5nbG9iYWw9PT1leHBlY3RlZC5nbG9iYWwmJmFjdHVhbC5tdWx0aWxpbmU9PT1leHBlY3RlZC5tdWx0aWxpbmUmJmFjdHVhbC5sYXN0SW5kZXg9PT1leHBlY3RlZC5sYXN0SW5kZXgmJmFjdHVhbC5pZ25vcmVDYXNlPT09ZXhwZWN0ZWQuaWdub3JlQ2FzZX1lbHNlIGlmKChhY3R1YWw9PT1udWxsfHx0eXBlb2YgYWN0dWFsIT09Im9iamVjdCIpJiYoZXhwZWN0ZWQ9PT1udWxsfHx0eXBlb2YgZXhwZWN0ZWQhPT0ib2JqZWN0Iikpe3JldHVybiBzdHJpY3Q/YWN0dWFsPT09ZXhwZWN0ZWQ6YWN0dWFsPT1leHBlY3RlZH1lbHNlIGlmKGlzVmlldyhhY3R1YWwpJiZpc1ZpZXcoZXhwZWN0ZWQpJiZwVG9TdHJpbmcoYWN0dWFsKT09PXBUb1N0cmluZyhleHBlY3RlZCkmJiEoYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5fHxhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDY0QXJyYXkpKXtyZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKT09PTB9ZWxzZSBpZihpc0J1ZmZlcihhY3R1YWwpIT09aXNCdWZmZXIoZXhwZWN0ZWQpKXtyZXR1cm4gZmFsc2V9ZWxzZXttZW1vcz1tZW1vc3x8e2FjdHVhbDpbXSxleHBlY3RlZDpbXX07dmFyIGFjdHVhbEluZGV4PW1lbW9zLmFjdHVhbC5pbmRleE9mKGFjdHVhbCk7aWYoYWN0dWFsSW5kZXghPT0tMSl7aWYoYWN0dWFsSW5kZXg9PT1tZW1vcy5leHBlY3RlZC5pbmRleE9mKGV4cGVjdGVkKSl7cmV0dXJuIHRydWV9fW1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7bWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7cmV0dXJuIG9iakVxdWl2KGFjdHVhbCxleHBlY3RlZCxzdHJpY3QsbWVtb3MpfX1mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3Qpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KT09IltvYmplY3QgQXJndW1lbnRzXSJ9ZnVuY3Rpb24gb2JqRXF1aXYoYSxiLHN0cmljdCxhY3R1YWxWaXNpdGVkT2JqZWN0cyl7aWYoYT09PW51bGx8fGE9PT11bmRlZmluZWR8fGI9PT1udWxsfHxiPT09dW5kZWZpbmVkKXJldHVybiBmYWxzZTtpZih1dGlsLmlzUHJpbWl0aXZlKGEpfHx1dGlsLmlzUHJpbWl0aXZlKGIpKXJldHVybiBhPT09YjtpZihzdHJpY3QmJk9iamVjdC5nZXRQcm90b3R5cGVPZihhKSE9PU9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlyZXR1cm4gZmFsc2U7dmFyIGFJc0FyZ3M9aXNBcmd1bWVudHMoYSk7dmFyIGJJc0FyZ3M9aXNBcmd1bWVudHMoYik7aWYoYUlzQXJncyYmIWJJc0FyZ3N8fCFhSXNBcmdzJiZiSXNBcmdzKXJldHVybiBmYWxzZTtpZihhSXNBcmdzKXthPXBTbGljZS5jYWxsKGEpO2I9cFNsaWNlLmNhbGwoYik7cmV0dXJuIF9kZWVwRXF1YWwoYSxiLHN0cmljdCl9dmFyIGthPW9iamVjdEtleXMoYSk7dmFyIGtiPW9iamVjdEtleXMoYik7dmFyIGtleSxpO2lmKGthLmxlbmd0aCE9PWtiLmxlbmd0aClyZXR1cm4gZmFsc2U7a2Euc29ydCgpO2tiLnNvcnQoKTtmb3IoaT1rYS5sZW5ndGgtMTtpPj0wO2ktLSl7aWYoa2FbaV0hPT1rYltpXSlyZXR1cm4gZmFsc2V9Zm9yKGk9a2EubGVuZ3RoLTE7aT49MDtpLS0pe2tleT1rYVtpXTtpZighX2RlZXBFcXVhbChhW2tleV0sYltrZXldLHN0cmljdCxhY3R1YWxWaXNpdGVkT2JqZWN0cykpcmV0dXJuIGZhbHNlfXJldHVybiB0cnVlfWFzc2VydC5ub3REZWVwRXF1YWw9ZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlKXtpZihfZGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxmYWxzZSkpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIm5vdERlZXBFcXVhbCIsYXNzZXJ0Lm5vdERlZXBFcXVhbCl9fTthc3NlcnQubm90RGVlcFN0cmljdEVxdWFsPW5vdERlZXBTdHJpY3RFcXVhbDtmdW5jdGlvbiBub3REZWVwU3RyaWN0RXF1YWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Upe2lmKF9kZWVwRXF1YWwoYWN0dWFsLGV4cGVjdGVkLHRydWUpKXtmYWlsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlLCJub3REZWVwU3RyaWN0RXF1YWwiLG5vdERlZXBTdHJpY3RFcXVhbCl9fWFzc2VydC5zdHJpY3RFcXVhbD1mdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsIT09ZXhwZWN0ZWQpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIj09PSIsYXNzZXJ0LnN0cmljdEVxdWFsKX19O2Fzc2VydC5ub3RTdHJpY3RFcXVhbD1mdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsPT09ZXhwZWN0ZWQpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIiE9PSIsYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKX19O2Z1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCxleHBlY3RlZCl7aWYoIWFjdHVhbHx8IWV4cGVjdGVkKXtyZXR1cm4gZmFsc2V9aWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKT09IltvYmplY3QgUmVnRXhwXSIpe3JldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCl9dHJ5e2lmKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKXtyZXR1cm4gdHJ1ZX19Y2F0Y2goZSl7fWlmKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKXtyZXR1cm4gZmFsc2V9cmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sYWN0dWFsKT09PXRydWV9ZnVuY3Rpb24gX3RyeUJsb2NrKGJsb2NrKXt2YXIgZXJyb3I7dHJ5e2Jsb2NrKCl9Y2F0Y2goZSl7ZXJyb3I9ZX1yZXR1cm4gZXJyb3J9ZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdyxibG9jayxleHBlY3RlZCxtZXNzYWdlKXt2YXIgYWN0dWFsO2lmKHR5cGVvZiBibG9jayE9PSJmdW5jdGlvbiIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJibG9jayIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyl9aWYodHlwZW9mIGV4cGVjdGVkPT09InN0cmluZyIpe21lc3NhZ2U9ZXhwZWN0ZWQ7ZXhwZWN0ZWQ9bnVsbH1hY3R1YWw9X3RyeUJsb2NrKGJsb2NrKTttZXNzYWdlPShleHBlY3RlZCYmZXhwZWN0ZWQubmFtZT8iICgiK2V4cGVjdGVkLm5hbWUrIikuIjoiLiIpKyhtZXNzYWdlPyIgIittZXNzYWdlOiIuIik7aWYoc2hvdWxkVGhyb3cmJiFhY3R1YWwpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLCJNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbiIrbWVzc2FnZSl9dmFyIHVzZXJQcm92aWRlZE1lc3NhZ2U9dHlwZW9mIG1lc3NhZ2U9PT0ic3RyaW5nIjt2YXIgaXNVbndhbnRlZEV4Y2VwdGlvbj0hc2hvdWxkVGhyb3cmJnV0aWwuaXNFcnJvcihhY3R1YWwpO3ZhciBpc1VuZXhwZWN0ZWRFeGNlcHRpb249IXNob3VsZFRocm93JiZhY3R1YWwmJiFleHBlY3RlZDtpZihpc1Vud2FudGVkRXhjZXB0aW9uJiZ1c2VyUHJvdmlkZWRNZXNzYWdlJiZleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsZXhwZWN0ZWQpfHxpc1VuZXhwZWN0ZWRFeGNlcHRpb24pe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLCJHb3QgdW53YW50ZWQgZXhjZXB0aW9uIittZXNzYWdlKX1pZihzaG91bGRUaHJvdyYmYWN0dWFsJiZleHBlY3RlZCYmIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCxleHBlY3RlZCl8fCFzaG91bGRUaHJvdyYmYWN0dWFsKXt0aHJvdyBhY3R1YWx9fWFzc2VydC50aHJvd3M9ZnVuY3Rpb24oYmxvY2ssZXJyb3IsbWVzc2FnZSl7X3Rocm93cyh0cnVlLGJsb2NrLGVycm9yLG1lc3NhZ2UpfTthc3NlcnQuZG9lc05vdFRocm93PWZ1bmN0aW9uKGJsb2NrLGVycm9yLG1lc3NhZ2Upe190aHJvd3MoZmFsc2UsYmxvY2ssZXJyb3IsbWVzc2FnZSl9O2Fzc2VydC5pZkVycm9yPWZ1bmN0aW9uKGVycil7aWYoZXJyKXRocm93IGVycn07ZnVuY3Rpb24gc3RyaWN0KHZhbHVlLG1lc3NhZ2Upe2lmKCF2YWx1ZSlmYWlsKHZhbHVlLHRydWUsbWVzc2FnZSwiPT0iLHN0cmljdCl9YXNzZXJ0LnN0cmljdD1vYmplY3RBc3NpZ24oc3RyaWN0LGFzc2VydCx7ZXF1YWw6YXNzZXJ0LnN0cmljdEVxdWFsLGRlZXBFcXVhbDphc3NlcnQuZGVlcFN0cmljdEVxdWFsLG5vdEVxdWFsOmFzc2VydC5ub3RTdHJpY3RFcXVhbCxub3REZWVwRXF1YWw6YXNzZXJ0Lm5vdERlZXBTdHJpY3RFcXVhbH0pO2Fzc2VydC5zdHJpY3Quc3RyaWN0PWFzc2VydC5zdHJpY3Q7dmFyIG9iamVjdEtleXM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uKG9iail7dmFyIGtleXM9W107Zm9yKHZhciBrZXkgaW4gb2JqKXtpZihoYXNPd24uY2FsbChvYmosa2V5KSlrZXlzLnB1c2goa2V5KX1yZXR1cm4ga2V5c319KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCE9PSJ1bmRlZmluZWQiP2dsb2JhbDp0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiP3dpbmRvdzp7fSl9LHsib2JqZWN0LWFzc2lnbiI6NTcsInV0aWwvIjoyM31dLDIxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtpZih0eXBlb2YgT2JqZWN0LmNyZWF0ZT09PSJmdW5jdGlvbiIpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGluaGVyaXRzKGN0b3Isc3VwZXJDdG9yKXtjdG9yLnN1cGVyXz1zdXBlckN0b3I7Y3Rvci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6Y3RvcixlbnVtZXJhYmxlOmZhbHNlLHdyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWV9fSl9fWVsc2V7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaW5oZXJpdHMoY3RvcixzdXBlckN0b3Ipe2N0b3Iuc3VwZXJfPXN1cGVyQ3Rvcjt2YXIgVGVtcEN0b3I9ZnVuY3Rpb24oKXt9O1RlbXBDdG9yLnByb3RvdHlwZT1zdXBlckN0b3IucHJvdG90eXBlO2N0b3IucHJvdG90eXBlPW5ldyBUZW1wQ3RvcjtjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1jdG9yfX19LHt9XSwyMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaXNCdWZmZXIoYXJnKXtyZXR1cm4gYXJnJiZ0eXBlb2YgYXJnPT09Im9iamVjdCImJnR5cGVvZiBhcmcuY29weT09PSJmdW5jdGlvbiImJnR5cGVvZiBhcmcuZmlsbD09PSJmdW5jdGlvbiImJnR5cGVvZiBhcmcucmVhZFVJbnQ4PT09ImZ1bmN0aW9uIn19LHt9XSwyMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MsZ2xvYmFsKXt2YXIgZm9ybWF0UmVnRXhwPS8lW3NkaiVdL2c7ZXhwb3J0cy5mb3JtYXQ9ZnVuY3Rpb24oZil7aWYoIWlzU3RyaW5nKGYpKXt2YXIgb2JqZWN0cz1bXTtmb3IodmFyIGk9MDtpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXtvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKX1yZXR1cm4gb2JqZWN0cy5qb2luKCIgIil9dmFyIGk9MTt2YXIgYXJncz1hcmd1bWVudHM7dmFyIGxlbj1hcmdzLmxlbmd0aDt2YXIgc3RyPVN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCxmdW5jdGlvbih4KXtpZih4PT09IiUlIilyZXR1cm4iJSI7aWYoaT49bGVuKXJldHVybiB4O3N3aXRjaCh4KXtjYXNlIiVzIjpyZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7Y2FzZSIlZCI6cmV0dXJuIE51bWJlcihhcmdzW2krK10pO2Nhc2UiJWoiOnRyeXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKX1jYXRjaChfKXtyZXR1cm4iW0NpcmN1bGFyXSJ9ZGVmYXVsdDpyZXR1cm4geH19KTtmb3IodmFyIHg9YXJnc1tpXTtpPGxlbjt4PWFyZ3NbKytpXSl7aWYoaXNOdWxsKHgpfHwhaXNPYmplY3QoeCkpe3N0cis9IiAiK3h9ZWxzZXtzdHIrPSIgIitpbnNwZWN0KHgpfX1yZXR1cm4gc3RyfTtleHBvcnRzLmRlcHJlY2F0ZT1mdW5jdGlvbihmbixtc2cpe2lmKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLG1zZykuYXBwbHkodGhpcyxhcmd1bWVudHMpfX1pZihwcm9jZXNzLm5vRGVwcmVjYXRpb249PT10cnVlKXtyZXR1cm4gZm59dmFyIHdhcm5lZD1mYWxzZTtmdW5jdGlvbiBkZXByZWNhdGVkKCl7aWYoIXdhcm5lZCl7aWYocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKXt0aHJvdyBuZXcgRXJyb3IobXNnKX1lbHNlIGlmKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbil7Y29uc29sZS50cmFjZShtc2cpfWVsc2V7Y29uc29sZS5lcnJvcihtc2cpfXdhcm5lZD10cnVlfXJldHVybiBmbi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9cmV0dXJuIGRlcHJlY2F0ZWR9O3ZhciBkZWJ1Z3M9e307dmFyIGRlYnVnRW52aXJvbjtleHBvcnRzLmRlYnVnbG9nPWZ1bmN0aW9uKHNldCl7aWYoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlkZWJ1Z0Vudmlyb249cHJvY2Vzcy5lbnYuTk9ERV9ERUJVR3x8IiI7c2V0PXNldC50b1VwcGVyQ2FzZSgpO2lmKCFkZWJ1Z3Nbc2V0XSl7aWYobmV3IFJlZ0V4cCgiXFxiIitzZXQrIlxcYiIsImkiKS50ZXN0KGRlYnVnRW52aXJvbikpe3ZhciBwaWQ9cHJvY2Vzcy5waWQ7ZGVidWdzW3NldF09ZnVuY3Rpb24oKXt2YXIgbXNnPWV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKTtjb25zb2xlLmVycm9yKCIlcyAlZDogJXMiLHNldCxwaWQsbXNnKX19ZWxzZXtkZWJ1Z3Nbc2V0XT1mdW5jdGlvbigpe319fXJldHVybiBkZWJ1Z3Nbc2V0XX07ZnVuY3Rpb24gaW5zcGVjdChvYmosb3B0cyl7dmFyIGN0eD17c2VlbjpbXSxzdHlsaXplOnN0eWxpemVOb0NvbG9yfTtpZihhcmd1bWVudHMubGVuZ3RoPj0zKWN0eC5kZXB0aD1hcmd1bWVudHNbMl07aWYoYXJndW1lbnRzLmxlbmd0aD49NCljdHguY29sb3JzPWFyZ3VtZW50c1szXTtpZihpc0Jvb2xlYW4ob3B0cykpe2N0eC5zaG93SGlkZGVuPW9wdHN9ZWxzZSBpZihvcHRzKXtleHBvcnRzLl9leHRlbmQoY3R4LG9wdHMpfWlmKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSljdHguc2hvd0hpZGRlbj1mYWxzZTtpZihpc1VuZGVmaW5lZChjdHguZGVwdGgpKWN0eC5kZXB0aD0yO2lmKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKWN0eC5jb2xvcnM9ZmFsc2U7aWYoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKWN0eC5jdXN0b21JbnNwZWN0PXRydWU7aWYoY3R4LmNvbG9ycyljdHguc3R5bGl6ZT1zdHlsaXplV2l0aENvbG9yO3JldHVybiBmb3JtYXRWYWx1ZShjdHgsb2JqLGN0eC5kZXB0aCl9ZXhwb3J0cy5pbnNwZWN0PWluc3BlY3Q7aW5zcGVjdC5jb2xvcnM9e2JvbGQ6WzEsMjJdLGl0YWxpYzpbMywyM10sdW5kZXJsaW5lOls0LDI0XSxpbnZlcnNlOls3LDI3XSx3aGl0ZTpbMzcsMzldLGdyZXk6WzkwLDM5XSxibGFjazpbMzAsMzldLGJsdWU6WzM0LDM5XSxjeWFuOlszNiwzOV0sZ3JlZW46WzMyLDM5XSxtYWdlbnRhOlszNSwzOV0scmVkOlszMSwzOV0seWVsbG93OlszMywzOV19O2luc3BlY3Quc3R5bGVzPXtzcGVjaWFsOiJjeWFuIixudW1iZXI6InllbGxvdyIsYm9vbGVhbjoieWVsbG93Iix1bmRlZmluZWQ6ImdyZXkiLG51bGw6ImJvbGQiLHN0cmluZzoiZ3JlZW4iLGRhdGU6Im1hZ2VudGEiLHJlZ2V4cDoicmVkIn07ZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsc3R5bGVUeXBlKXt2YXIgc3R5bGU9aW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtpZihzdHlsZSl7cmV0dXJuIhtbIitpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0rIm0iK3N0cisiG1siK2luc3BlY3QuY29sb3JzW3N0eWxlXVsxXSsibSJ9ZWxzZXtyZXR1cm4gc3RyfX1mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsc3R5bGVUeXBlKXtyZXR1cm4gc3RyfWZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KXt2YXIgaGFzaD17fTthcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCxpZHgpe2hhc2hbdmFsXT10cnVlfSk7cmV0dXJuIGhhc2h9ZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyl7aWYoY3R4LmN1c3RvbUluc3BlY3QmJnZhbHVlJiZpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpJiZ2YWx1ZS5pbnNwZWN0IT09ZXhwb3J0cy5pbnNwZWN0JiYhKHZhbHVlLmNvbnN0cnVjdG9yJiZ2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGU9PT12YWx1ZSkpe3ZhciByZXQ9dmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsY3R4KTtpZighaXNTdHJpbmcocmV0KSl7cmV0PWZvcm1hdFZhbHVlKGN0eCxyZXQscmVjdXJzZVRpbWVzKX1yZXR1cm4gcmV0fXZhciBwcmltaXRpdmU9Zm9ybWF0UHJpbWl0aXZlKGN0eCx2YWx1ZSk7aWYocHJpbWl0aXZlKXtyZXR1cm4gcHJpbWl0aXZlfXZhciBrZXlzPU9iamVjdC5rZXlzKHZhbHVlKTt2YXIgdmlzaWJsZUtleXM9YXJyYXlUb0hhc2goa2V5cyk7aWYoY3R4LnNob3dIaWRkZW4pe2tleXM9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpfWlmKGlzRXJyb3IodmFsdWUpJiYoa2V5cy5pbmRleE9mKCJtZXNzYWdlIik+PTB8fGtleXMuaW5kZXhPZigiZGVzY3JpcHRpb24iKT49MCkpe3JldHVybiBmb3JtYXRFcnJvcih2YWx1ZSl9aWYoa2V5cy5sZW5ndGg9PT0wKXtpZihpc0Z1bmN0aW9uKHZhbHVlKSl7dmFyIG5hbWU9dmFsdWUubmFtZT8iOiAiK3ZhbHVlLm5hbWU6IiI7cmV0dXJuIGN0eC5zdHlsaXplKCJbRnVuY3Rpb24iK25hbWUrIl0iLCJzcGVjaWFsIil9aWYoaXNSZWdFeHAodmFsdWUpKXtyZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwicmVnZXhwIil9aWYoaXNEYXRlKHZhbHVlKSl7cmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCJkYXRlIil9aWYoaXNFcnJvcih2YWx1ZSkpe3JldHVybiBmb3JtYXRFcnJvcih2YWx1ZSl9fXZhciBiYXNlPSIiLGFycmF5PWZhbHNlLGJyYWNlcz1bInsiLCJ9Il07aWYoaXNBcnJheSh2YWx1ZSkpe2FycmF5PXRydWU7YnJhY2VzPVsiWyIsIl0iXX1pZihpc0Z1bmN0aW9uKHZhbHVlKSl7dmFyIG49dmFsdWUubmFtZT8iOiAiK3ZhbHVlLm5hbWU6IiI7YmFzZT0iIFtGdW5jdGlvbiIrbisiXSJ9aWYoaXNSZWdFeHAodmFsdWUpKXtiYXNlPSIgIitSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpfWlmKGlzRGF0ZSh2YWx1ZSkpe2Jhc2U9IiAiK0RhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpfWlmKGlzRXJyb3IodmFsdWUpKXtiYXNlPSIgIitmb3JtYXRFcnJvcih2YWx1ZSl9aWYoa2V5cy5sZW5ndGg9PT0wJiYoIWFycmF5fHx2YWx1ZS5sZW5ndGg9PTApKXtyZXR1cm4gYnJhY2VzWzBdK2Jhc2UrYnJhY2VzWzFdfWlmKHJlY3Vyc2VUaW1lczwwKXtpZihpc1JlZ0V4cCh2YWx1ZSkpe3JldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCJyZWdleHAiKX1lbHNle3JldHVybiBjdHguc3R5bGl6ZSgiW09iamVjdF0iLCJzcGVjaWFsIil9fWN0eC5zZWVuLnB1c2godmFsdWUpO3ZhciBvdXRwdXQ7aWYoYXJyYXkpe291dHB1dD1mb3JtYXRBcnJheShjdHgsdmFsdWUscmVjdXJzZVRpbWVzLHZpc2libGVLZXlzLGtleXMpfWVsc2V7b3V0cHV0PWtleXMubWFwKGZ1bmN0aW9uKGtleSl7cmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCx2YWx1ZSxyZWN1cnNlVGltZXMsdmlzaWJsZUtleXMsa2V5LGFycmF5KX0pfWN0eC5zZWVuLnBvcCgpO3JldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsYmFzZSxicmFjZXMpfWZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsdmFsdWUpe2lmKGlzVW5kZWZpbmVkKHZhbHVlKSlyZXR1cm4gY3R4LnN0eWxpemUoInVuZGVmaW5lZCIsInVuZGVmaW5lZCIpO2lmKGlzU3RyaW5nKHZhbHVlKSl7dmFyIHNpbXBsZT0iJyIrSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL14ifCIkL2csIiIpLnJlcGxhY2UoLycvZywiXFwnIikucmVwbGFjZSgvXFwiL2csJyInKSsiJyI7cmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwic3RyaW5nIil9aWYoaXNOdW1iZXIodmFsdWUpKXJldHVybiBjdHguc3R5bGl6ZSgiIit2YWx1ZSwibnVtYmVyIik7aWYoaXNCb29sZWFuKHZhbHVlKSlyZXR1cm4gY3R4LnN0eWxpemUoIiIrdmFsdWUsImJvb2xlYW4iKTtpZihpc051bGwodmFsdWUpKXJldHVybiBjdHguc3R5bGl6ZSgibnVsbCIsIm51bGwiKX1mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSl7cmV0dXJuIlsiK0Vycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSsiXSJ9ZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXlzKXt2YXIgb3V0cHV0PVtdO2Zvcih2YXIgaT0wLGw9dmFsdWUubGVuZ3RoO2k8bDsrK2kpe2lmKGhhc093blByb3BlcnR5KHZhbHVlLFN0cmluZyhpKSkpe291dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCx2YWx1ZSxyZWN1cnNlVGltZXMsdmlzaWJsZUtleXMsU3RyaW5nKGkpLHRydWUpKX1lbHNle291dHB1dC5wdXNoKCIiKX19a2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7aWYoIWtleS5tYXRjaCgvXlxkKyQvKSl7b3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXksdHJ1ZSkpfX0pO3JldHVybiBvdXRwdXR9ZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXksYXJyYXkpe3ZhciBuYW1lLHN0cixkZXNjO2Rlc2M9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSxrZXkpfHx7dmFsdWU6dmFsdWVba2V5XX07aWYoZGVzYy5nZXQpe2lmKGRlc2Muc2V0KXtzdHI9Y3R4LnN0eWxpemUoIltHZXR0ZXIvU2V0dGVyXSIsInNwZWNpYWwiKX1lbHNle3N0cj1jdHguc3R5bGl6ZSgiW0dldHRlcl0iLCJzcGVjaWFsIil9fWVsc2V7aWYoZGVzYy5zZXQpe3N0cj1jdHguc3R5bGl6ZSgiW1NldHRlcl0iLCJzcGVjaWFsIil9fWlmKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cyxrZXkpKXtuYW1lPSJbIitrZXkrIl0ifWlmKCFzdHIpe2lmKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSk8MCl7aWYoaXNOdWxsKHJlY3Vyc2VUaW1lcykpe3N0cj1mb3JtYXRWYWx1ZShjdHgsZGVzYy52YWx1ZSxudWxsKX1lbHNle3N0cj1mb3JtYXRWYWx1ZShjdHgsZGVzYy52YWx1ZSxyZWN1cnNlVGltZXMtMSl9aWYoc3RyLmluZGV4T2YoIlxuIik+LTEpe2lmKGFycmF5KXtzdHI9c3RyLnNwbGl0KCJcbiIpLm1hcChmdW5jdGlvbihsaW5lKXtyZXR1cm4iICAiK2xpbmV9KS5qb2luKCJcbiIpLnN1YnN0cigyKX1lbHNle3N0cj0iXG4iK3N0ci5zcGxpdCgiXG4iKS5tYXAoZnVuY3Rpb24obGluZSl7cmV0dXJuIiAgICIrbGluZX0pLmpvaW4oIlxuIil9fX1lbHNle3N0cj1jdHguc3R5bGl6ZSgiW0NpcmN1bGFyXSIsInNwZWNpYWwiKX19aWYoaXNVbmRlZmluZWQobmFtZSkpe2lmKGFycmF5JiZrZXkubWF0Y2goL15cZCskLykpe3JldHVybiBzdHJ9bmFtZT1KU09OLnN0cmluZ2lmeSgiIitrZXkpO2lmKG5hbWUubWF0Y2goL14iKFthLXpBLVpfXVthLXpBLVpfMC05XSopIiQvKSl7bmFtZT1uYW1lLnN1YnN0cigxLG5hbWUubGVuZ3RoLTIpO25hbWU9Y3R4LnN0eWxpemUobmFtZSwibmFtZSIpfWVsc2V7bmFtZT1uYW1lLnJlcGxhY2UoLycvZywiXFwnIikucmVwbGFjZSgvXFwiL2csJyInKS5yZXBsYWNlKC8oXiJ8IiQpL2csIiciKTtuYW1lPWN0eC5zdHlsaXplKG5hbWUsInN0cmluZyIpfX1yZXR1cm4gbmFtZSsiOiAiK3N0cn1mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsYmFzZSxicmFjZXMpe3ZhciBudW1MaW5lc0VzdD0wO3ZhciBsZW5ndGg9b3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LGN1cil7bnVtTGluZXNFc3QrKztpZihjdXIuaW5kZXhPZigiXG4iKT49MCludW1MaW5lc0VzdCsrO3JldHVybiBwcmV2K2N1ci5yZXBsYWNlKC9cdTAwMWJcW1xkXGQ/bS9nLCIiKS5sZW5ndGgrMX0sMCk7aWYobGVuZ3RoPjYwKXtyZXR1cm4gYnJhY2VzWzBdKyhiYXNlPT09IiI/IiI6YmFzZSsiXG4gIikrIiAiK291dHB1dC5qb2luKCIsXG4gICIpKyIgIiticmFjZXNbMV19cmV0dXJuIGJyYWNlc1swXStiYXNlKyIgIitvdXRwdXQuam9pbigiLCAiKSsiICIrYnJhY2VzWzFdfWZ1bmN0aW9uIGlzQXJyYXkoYXIpe3JldHVybiBBcnJheS5pc0FycmF5KGFyKX1leHBvcnRzLmlzQXJyYXk9aXNBcnJheTtmdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJib29sZWFuIn1leHBvcnRzLmlzQm9vbGVhbj1pc0Jvb2xlYW47ZnVuY3Rpb24gaXNOdWxsKGFyZyl7cmV0dXJuIGFyZz09PW51bGx9ZXhwb3J0cy5pc051bGw9aXNOdWxsO2Z1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09bnVsbH1leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkPWlzTnVsbE9yVW5kZWZpbmVkO2Z1bmN0aW9uIGlzTnVtYmVyKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ibnVtYmVyIn1leHBvcnRzLmlzTnVtYmVyPWlzTnVtYmVyO2Z1bmN0aW9uIGlzU3RyaW5nKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3RyaW5nIn1leHBvcnRzLmlzU3RyaW5nPWlzU3RyaW5nO2Z1bmN0aW9uIGlzU3ltYm9sKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3ltYm9sIn1leHBvcnRzLmlzU3ltYm9sPWlzU3ltYm9sO2Z1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09PXZvaWQgMH1leHBvcnRzLmlzVW5kZWZpbmVkPWlzVW5kZWZpbmVkO2Z1bmN0aW9uIGlzUmVnRXhwKHJlKXtyZXR1cm4gaXNPYmplY3QocmUpJiZvYmplY3RUb1N0cmluZyhyZSk9PT0iW29iamVjdCBSZWdFeHBdIn1leHBvcnRzLmlzUmVnRXhwPWlzUmVnRXhwO2Z1bmN0aW9uIGlzT2JqZWN0KGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ib2JqZWN0IiYmYXJnIT09bnVsbH1leHBvcnRzLmlzT2JqZWN0PWlzT2JqZWN0O2Z1bmN0aW9uIGlzRGF0ZShkKXtyZXR1cm4gaXNPYmplY3QoZCkmJm9iamVjdFRvU3RyaW5nKGQpPT09IltvYmplY3QgRGF0ZV0ifWV4cG9ydHMuaXNEYXRlPWlzRGF0ZTtmdW5jdGlvbiBpc0Vycm9yKGUpe3JldHVybiBpc09iamVjdChlKSYmKG9iamVjdFRvU3RyaW5nKGUpPT09IltvYmplY3QgRXJyb3JdInx8ZSBpbnN0YW5jZW9mIEVycm9yKX1leHBvcnRzLmlzRXJyb3I9aXNFcnJvcjtmdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0iZnVuY3Rpb24ifWV4cG9ydHMuaXNGdW5jdGlvbj1pc0Z1bmN0aW9uO2Z1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZyl7cmV0dXJuIGFyZz09PW51bGx8fHR5cGVvZiBhcmc9PT0iYm9vbGVhbiJ8fHR5cGVvZiBhcmc9PT0ibnVtYmVyInx8dHlwZW9mIGFyZz09PSJzdHJpbmcifHx0eXBlb2YgYXJnPT09InN5bWJvbCJ8fHR5cGVvZiBhcmc9PT0idW5kZWZpbmVkIn1leHBvcnRzLmlzUHJpbWl0aXZlPWlzUHJpbWl0aXZlO2V4cG9ydHMuaXNCdWZmZXI9cmVxdWlyZSgiLi9zdXBwb3J0L2lzQnVmZmVyIik7ZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobyl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKX1mdW5jdGlvbiBwYWQobil7cmV0dXJuIG48MTA/IjAiK24udG9TdHJpbmcoMTApOm4udG9TdHJpbmcoMTApfXZhciBtb250aHM9WyJKYW4iLCJGZWIiLCJNYXIiLCJBcHIiLCJNYXkiLCJKdW4iLCJKdWwiLCJBdWciLCJTZXAiLCJPY3QiLCJOb3YiLCJEZWMiXTtmdW5jdGlvbiB0aW1lc3RhbXAoKXt2YXIgZD1uZXcgRGF0ZTt2YXIgdGltZT1bcGFkKGQuZ2V0SG91cnMoKSkscGFkKGQuZ2V0TWludXRlcygpKSxwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCI6Iik7cmV0dXJuW2QuZ2V0RGF0ZSgpLG1vbnRoc1tkLmdldE1vbnRoKCldLHRpbWVdLmpvaW4oIiAiKX1leHBvcnRzLmxvZz1mdW5jdGlvbigpe2NvbnNvbGUubG9nKCIlcyAtICVzIix0aW1lc3RhbXAoKSxleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLGFyZ3VtZW50cykpfTtleHBvcnRzLmluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7ZXhwb3J0cy5fZXh0ZW5kPWZ1bmN0aW9uKG9yaWdpbixhZGQpe2lmKCFhZGR8fCFpc09iamVjdChhZGQpKXJldHVybiBvcmlnaW47dmFyIGtleXM9T2JqZWN0LmtleXMoYWRkKTt2YXIgaT1rZXlzLmxlbmd0aDt3aGlsZShpLS0pe29yaWdpbltrZXlzW2ldXT1hZGRba2V5c1tpXV19cmV0dXJuIG9yaWdpbn07ZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLHByb3Ape3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLHByb3ApfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJfcHJvY2VzcyIpLHR5cGVvZiBnbG9iYWwhPT0idW5kZWZpbmVkIj9nbG9iYWw6dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIj9zZWxmOnR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkIj93aW5kb3c6e30pfSx7Ii4vc3VwcG9ydC9pc0J1ZmZlciI6MjIsX3Byb2Nlc3M6NjQsaW5oZXJpdHM6MjF9XSwyNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO2V4cG9ydHMuYnl0ZUxlbmd0aD1ieXRlTGVuZ3RoO2V4cG9ydHMudG9CeXRlQXJyYXk9dG9CeXRlQXJyYXk7ZXhwb3J0cy5mcm9tQnl0ZUFycmF5PWZyb21CeXRlQXJyYXk7dmFyIGxvb2t1cD1bXTt2YXIgcmV2TG9va3VwPVtdO3ZhciBBcnI9dHlwZW9mIFVpbnQ4QXJyYXkhPT0idW5kZWZpbmVkIj9VaW50OEFycmF5OkFycmF5O3ZhciBjb2RlPSJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvIjtmb3IodmFyIGk9MCxsZW49Y29kZS5sZW5ndGg7aTxsZW47KytpKXtsb29rdXBbaV09Y29kZVtpXTtyZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXT1pfXJldkxvb2t1cFsiLSIuY2hhckNvZGVBdCgwKV09NjI7cmV2TG9va3VwWyJfIi5jaGFyQ29kZUF0KDApXT02MztmdW5jdGlvbiBnZXRMZW5zKGI2NCl7dmFyIGxlbj1iNjQubGVuZ3RoO2lmKGxlbiU0PjApe3Rocm93IG5ldyBFcnJvcigiSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCIpfXZhciB2YWxpZExlbj1iNjQuaW5kZXhPZigiPSIpO2lmKHZhbGlkTGVuPT09LTEpdmFsaWRMZW49bGVuO3ZhciBwbGFjZUhvbGRlcnNMZW49dmFsaWRMZW49PT1sZW4/MDo0LXZhbGlkTGVuJTQ7cmV0dXJuW3ZhbGlkTGVuLHBsYWNlSG9sZGVyc0xlbl19ZnVuY3Rpb24gYnl0ZUxlbmd0aChiNjQpe3ZhciBsZW5zPWdldExlbnMoYjY0KTt2YXIgdmFsaWRMZW49bGVuc1swXTt2YXIgcGxhY2VIb2xkZXJzTGVuPWxlbnNbMV07cmV0dXJuKHZhbGlkTGVuK3BsYWNlSG9sZGVyc0xlbikqMy80LXBsYWNlSG9sZGVyc0xlbn1mdW5jdGlvbiBfYnl0ZUxlbmd0aChiNjQsdmFsaWRMZW4scGxhY2VIb2xkZXJzTGVuKXtyZXR1cm4odmFsaWRMZW4rcGxhY2VIb2xkZXJzTGVuKSozLzQtcGxhY2VIb2xkZXJzTGVufWZ1bmN0aW9uIHRvQnl0ZUFycmF5KGI2NCl7dmFyIHRtcDt2YXIgbGVucz1nZXRMZW5zKGI2NCk7dmFyIHZhbGlkTGVuPWxlbnNbMF07dmFyIHBsYWNlSG9sZGVyc0xlbj1sZW5zWzFdO3ZhciBhcnI9bmV3IEFycihfYnl0ZUxlbmd0aChiNjQsdmFsaWRMZW4scGxhY2VIb2xkZXJzTGVuKSk7dmFyIGN1ckJ5dGU9MDt2YXIgbGVuPXBsYWNlSG9sZGVyc0xlbj4wP3ZhbGlkTGVuLTQ6dmFsaWRMZW47Zm9yKHZhciBpPTA7aTxsZW47aSs9NCl7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDE4fHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzEpXTw8MTJ8cmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkrMildPDw2fHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzMpXTthcnJbY3VyQnl0ZSsrXT10bXA+PjE2JjI1NTthcnJbY3VyQnl0ZSsrXT10bXA+PjgmMjU1O2FycltjdXJCeXRlKytdPXRtcCYyNTV9aWYocGxhY2VIb2xkZXJzTGVuPT09Mil7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDJ8cmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkrMSldPj40O2FycltjdXJCeXRlKytdPXRtcCYyNTV9aWYocGxhY2VIb2xkZXJzTGVuPT09MSl7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDEwfHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzEpXTw8NHxyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSsyKV0+PjI7YXJyW2N1ckJ5dGUrK109dG1wPj44JjI1NTthcnJbY3VyQnl0ZSsrXT10bXAmMjU1fXJldHVybiBhcnJ9ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0KG51bSl7cmV0dXJuIGxvb2t1cFtudW0+PjE4JjYzXStsb29rdXBbbnVtPj4xMiY2M10rbG9va3VwW251bT4+NiY2M10rbG9va3VwW251bSY2M119ZnVuY3Rpb24gZW5jb2RlQ2h1bmsodWludDgsc3RhcnQsZW5kKXt2YXIgdG1wO3ZhciBvdXRwdXQ9W107Zm9yKHZhciBpPXN0YXJ0O2k8ZW5kO2krPTMpe3RtcD0odWludDhbaV08PDE2JjE2NzExNjgwKSsodWludDhbaSsxXTw8OCY2NTI4MCkrKHVpbnQ4W2krMl0mMjU1KTtvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSl9cmV0dXJuIG91dHB1dC5qb2luKCIiKX1mdW5jdGlvbiBmcm9tQnl0ZUFycmF5KHVpbnQ4KXt2YXIgdG1wO3ZhciBsZW49dWludDgubGVuZ3RoO3ZhciBleHRyYUJ5dGVzPWxlbiUzO3ZhciBwYXJ0cz1bXTt2YXIgbWF4Q2h1bmtMZW5ndGg9MTYzODM7Zm9yKHZhciBpPTAsbGVuMj1sZW4tZXh0cmFCeXRlcztpPGxlbjI7aSs9bWF4Q2h1bmtMZW5ndGgpe3BhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsaSxpK21heENodW5rTGVuZ3RoPmxlbjI/bGVuMjppK21heENodW5rTGVuZ3RoKSl9aWYoZXh0cmFCeXRlcz09PTEpe3RtcD11aW50OFtsZW4tMV07cGFydHMucHVzaChsb29rdXBbdG1wPj4yXStsb29rdXBbdG1wPDw0JjYzXSsiPT0iKX1lbHNlIGlmKGV4dHJhQnl0ZXM9PT0yKXt0bXA9KHVpbnQ4W2xlbi0yXTw8OCkrdWludDhbbGVuLTFdO3BhcnRzLnB1c2gobG9va3VwW3RtcD4+MTBdK2xvb2t1cFt0bXA+PjQmNjNdK2xvb2t1cFt0bXA8PDImNjNdKyI9Iil9cmV0dXJuIHBhcnRzLmpvaW4oIiIpfX0se31dLDI1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgYmlnSW50PWZ1bmN0aW9uKHVuZGVmaW5lZCl7InVzZSBzdHJpY3QiO3ZhciBCQVNFPTFlNyxMT0dfQkFTRT03LE1BWF9JTlQ9OTAwNzE5OTI1NDc0MDk5MixNQVhfSU5UX0FSUj1zbWFsbFRvQXJyYXkoTUFYX0lOVCksREVGQVVMVF9BTFBIQUJFVD0iMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Ijt2YXIgc3VwcG9ydHNOYXRpdmVCaWdJbnQ9dHlwZW9mIEJpZ0ludD09PSJmdW5jdGlvbiI7ZnVuY3Rpb24gSW50ZWdlcih2LHJhZGl4LGFscGhhYmV0LGNhc2VTZW5zaXRpdmUpe2lmKHR5cGVvZiB2PT09InVuZGVmaW5lZCIpcmV0dXJuIEludGVnZXJbMF07aWYodHlwZW9mIHJhZGl4IT09InVuZGVmaW5lZCIpcmV0dXJuK3JhZGl4PT09MTAmJiFhbHBoYWJldD9wYXJzZVZhbHVlKHYpOnBhcnNlQmFzZSh2LHJhZGl4LGFscGhhYmV0LGNhc2VTZW5zaXRpdmUpO3JldHVybiBwYXJzZVZhbHVlKHYpfWZ1bmN0aW9uIEJpZ0ludGVnZXIodmFsdWUsc2lnbil7dGhpcy52YWx1ZT12YWx1ZTt0aGlzLnNpZ249c2lnbjt0aGlzLmlzU21hbGw9ZmFsc2V9QmlnSW50ZWdlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gU21hbGxJbnRlZ2VyKHZhbHVlKXt0aGlzLnZhbHVlPXZhbHVlO3RoaXMuc2lnbj12YWx1ZTwwO3RoaXMuaXNTbWFsbD10cnVlfVNtYWxsSW50ZWdlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gTmF0aXZlQmlnSW50KHZhbHVlKXt0aGlzLnZhbHVlPXZhbHVlfU5hdGl2ZUJpZ0ludC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gaXNQcmVjaXNlKG4pe3JldHVybi1NQVhfSU5UPG4mJm48TUFYX0lOVH1mdW5jdGlvbiBzbWFsbFRvQXJyYXkobil7aWYobjwxZTcpcmV0dXJuW25dO2lmKG48MWUxNClyZXR1cm5bbiUxZTcsTWF0aC5mbG9vcihuLzFlNyldO3JldHVybltuJTFlNyxNYXRoLmZsb29yKG4vMWU3KSUxZTcsTWF0aC5mbG9vcihuLzFlMTQpXX1mdW5jdGlvbiBhcnJheVRvU21hbGwoYXJyKXt0cmltKGFycik7dmFyIGxlbmd0aD1hcnIubGVuZ3RoO2lmKGxlbmd0aDw0JiZjb21wYXJlQWJzKGFycixNQVhfSU5UX0FSUik8MCl7c3dpdGNoKGxlbmd0aCl7Y2FzZSAwOnJldHVybiAwO2Nhc2UgMTpyZXR1cm4gYXJyWzBdO2Nhc2UgMjpyZXR1cm4gYXJyWzBdK2FyclsxXSpCQVNFO2RlZmF1bHQ6cmV0dXJuIGFyclswXSsoYXJyWzFdK2FyclsyXSpCQVNFKSpCQVNFfX1yZXR1cm4gYXJyfWZ1bmN0aW9uIHRyaW0odil7dmFyIGk9di5sZW5ndGg7d2hpbGUodlstLWldPT09MCk7di5sZW5ndGg9aSsxfWZ1bmN0aW9uIGNyZWF0ZUFycmF5KGxlbmd0aCl7dmFyIHg9bmV3IEFycmF5KGxlbmd0aCk7dmFyIGk9LTE7d2hpbGUoKytpPGxlbmd0aCl7eFtpXT0wfXJldHVybiB4fWZ1bmN0aW9uIHRydW5jYXRlKG4pe2lmKG4+MClyZXR1cm4gTWF0aC5mbG9vcihuKTtyZXR1cm4gTWF0aC5jZWlsKG4pfWZ1bmN0aW9uIGFkZChhLGIpe3ZhciBsX2E9YS5sZW5ndGgsbF9iPWIubGVuZ3RoLHI9bmV3IEFycmF5KGxfYSksY2Fycnk9MCxiYXNlPUJBU0Usc3VtLGk7Zm9yKGk9MDtpPGxfYjtpKyspe3N1bT1hW2ldK2JbaV0rY2Fycnk7Y2Fycnk9c3VtPj1iYXNlPzE6MDtyW2ldPXN1bS1jYXJyeSpiYXNlfXdoaWxlKGk8bF9hKXtzdW09YVtpXStjYXJyeTtjYXJyeT1zdW09PT1iYXNlPzE6MDtyW2krK109c3VtLWNhcnJ5KmJhc2V9aWYoY2Fycnk+MClyLnB1c2goY2FycnkpO3JldHVybiByfWZ1bmN0aW9uIGFkZEFueShhLGIpe2lmKGEubGVuZ3RoPj1iLmxlbmd0aClyZXR1cm4gYWRkKGEsYik7cmV0dXJuIGFkZChiLGEpfWZ1bmN0aW9uIGFkZFNtYWxsKGEsY2Fycnkpe3ZhciBsPWEubGVuZ3RoLHI9bmV3IEFycmF5KGwpLGJhc2U9QkFTRSxzdW0saTtmb3IoaT0wO2k8bDtpKyspe3N1bT1hW2ldLWJhc2UrY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihzdW0vYmFzZSk7cltpXT1zdW0tY2FycnkqYmFzZTtjYXJyeSs9MX13aGlsZShjYXJyeT4wKXtyW2krK109Y2FycnklYmFzZTtjYXJyeT1NYXRoLmZsb29yKGNhcnJ5L2Jhc2UpfXJldHVybiByfUJpZ0ludGVnZXIucHJvdG90eXBlLmFkZD1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO2lmKHRoaXMuc2lnbiE9PW4uc2lnbil7cmV0dXJuIHRoaXMuc3VidHJhY3Qobi5uZWdhdGUoKSl9dmFyIGE9dGhpcy52YWx1ZSxiPW4udmFsdWU7aWYobi5pc1NtYWxsKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoYWRkU21hbGwoYSxNYXRoLmFicyhiKSksdGhpcy5zaWduKX1yZXR1cm4gbmV3IEJpZ0ludGVnZXIoYWRkQW55KGEsYiksdGhpcy5zaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUucGx1cz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGQ7U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KTt2YXIgYT10aGlzLnZhbHVlO2lmKGE8MCE9PW4uc2lnbil7cmV0dXJuIHRoaXMuc3VidHJhY3Qobi5uZWdhdGUoKSl9dmFyIGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe2lmKGlzUHJlY2lzZShhK2IpKXJldHVybiBuZXcgU21hbGxJbnRlZ2VyKGErYik7Yj1zbWFsbFRvQXJyYXkoTWF0aC5hYnMoYikpfXJldHVybiBuZXcgQmlnSW50ZWdlcihhZGRTbWFsbChiLE1hdGguYWJzKGEpKSxhPDApfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnBsdXM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5hZGQ7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZStwYXJzZVZhbHVlKHYpLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5wbHVzPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUuYWRkO2Z1bmN0aW9uIHN1YnRyYWN0KGEsYil7dmFyIGFfbD1hLmxlbmd0aCxiX2w9Yi5sZW5ndGgscj1uZXcgQXJyYXkoYV9sKSxib3Jyb3c9MCxiYXNlPUJBU0UsaSxkaWZmZXJlbmNlO2ZvcihpPTA7aTxiX2w7aSsrKXtkaWZmZXJlbmNlPWFbaV0tYm9ycm93LWJbaV07aWYoZGlmZmVyZW5jZTwwKXtkaWZmZXJlbmNlKz1iYXNlO2JvcnJvdz0xfWVsc2UgYm9ycm93PTA7cltpXT1kaWZmZXJlbmNlfWZvcihpPWJfbDtpPGFfbDtpKyspe2RpZmZlcmVuY2U9YVtpXS1ib3Jyb3c7aWYoZGlmZmVyZW5jZTwwKWRpZmZlcmVuY2UrPWJhc2U7ZWxzZXtyW2krK109ZGlmZmVyZW5jZTticmVha31yW2ldPWRpZmZlcmVuY2V9Zm9yKDtpPGFfbDtpKyspe3JbaV09YVtpXX10cmltKHIpO3JldHVybiByfWZ1bmN0aW9uIHN1YnRyYWN0QW55KGEsYixzaWduKXt2YXIgdmFsdWU7aWYoY29tcGFyZUFicyhhLGIpPj0wKXt2YWx1ZT1zdWJ0cmFjdChhLGIpfWVsc2V7dmFsdWU9c3VidHJhY3QoYixhKTtzaWduPSFzaWdufXZhbHVlPWFycmF5VG9TbWFsbCh2YWx1ZSk7aWYodHlwZW9mIHZhbHVlPT09Im51bWJlciIpe2lmKHNpZ24pdmFsdWU9LXZhbHVlO3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKHZhbHVlKX1yZXR1cm4gbmV3IEJpZ0ludGVnZXIodmFsdWUsc2lnbil9ZnVuY3Rpb24gc3VidHJhY3RTbWFsbChhLGIsc2lnbil7dmFyIGw9YS5sZW5ndGgscj1uZXcgQXJyYXkobCksY2Fycnk9LWIsYmFzZT1CQVNFLGksZGlmZmVyZW5jZTtmb3IoaT0wO2k8bDtpKyspe2RpZmZlcmVuY2U9YVtpXStjYXJyeTtjYXJyeT1NYXRoLmZsb29yKGRpZmZlcmVuY2UvYmFzZSk7ZGlmZmVyZW5jZSU9YmFzZTtyW2ldPWRpZmZlcmVuY2U8MD9kaWZmZXJlbmNlK2Jhc2U6ZGlmZmVyZW5jZX1yPWFycmF5VG9TbWFsbChyKTtpZih0eXBlb2Ygcj09PSJudW1iZXIiKXtpZihzaWduKXI9LXI7cmV0dXJuIG5ldyBTbWFsbEludGVnZXIocil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHIsc2lnbil9QmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3Q9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KTtpZih0aGlzLnNpZ24hPT1uLnNpZ24pe3JldHVybiB0aGlzLmFkZChuLm5lZ2F0ZSgpKX12YXIgYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZihuLmlzU21hbGwpcmV0dXJuIHN1YnRyYWN0U21hbGwoYSxNYXRoLmFicyhiKSx0aGlzLnNpZ24pO3JldHVybiBzdWJ0cmFjdEFueShhLGIsdGhpcy5zaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUubWludXM9QmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3Q7U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5zdWJ0cmFjdD1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO3ZhciBhPXRoaXMudmFsdWU7aWYoYTwwIT09bi5zaWduKXtyZXR1cm4gdGhpcy5hZGQobi5uZWdhdGUoKSl9dmFyIGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKGEtYil9cmV0dXJuIHN1YnRyYWN0U21hbGwoYixNYXRoLmFicyhhKSxhPj0wKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5taW51cz1TbWFsbEludGVnZXIucHJvdG90eXBlLnN1YnRyYWN0O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc3VidHJhY3Q9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZS1wYXJzZVZhbHVlKHYpLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5taW51cz1OYXRpdmVCaWdJbnQucHJvdG90eXBlLnN1YnRyYWN0O0JpZ0ludGVnZXIucHJvdG90eXBlLm5lZ2F0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgQmlnSW50ZWdlcih0aGlzLnZhbHVlLCF0aGlzLnNpZ24pfTtTbWFsbEludGVnZXIucHJvdG90eXBlLm5lZ2F0ZT1mdW5jdGlvbigpe3ZhciBzaWduPXRoaXMuc2lnbjt2YXIgc21hbGw9bmV3IFNtYWxsSW50ZWdlcigtdGhpcy52YWx1ZSk7c21hbGwuc2lnbj0hc2lnbjtyZXR1cm4gc21hbGx9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubmVnYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoLXRoaXMudmFsdWUpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hYnM9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIodGhpcy52YWx1ZSxmYWxzZSl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuYWJzPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBTbWFsbEludGVnZXIoTWF0aC5hYnModGhpcy52YWx1ZSkpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmFicz1mdW5jdGlvbigpe3JldHVybiBuZXcgTmF0aXZlQmlnSW50KHRoaXMudmFsdWU+PTA/dGhpcy52YWx1ZTotdGhpcy52YWx1ZSl9O2Z1bmN0aW9uIG11bHRpcGx5TG9uZyhhLGIpe3ZhciBhX2w9YS5sZW5ndGgsYl9sPWIubGVuZ3RoLGw9YV9sK2JfbCxyPWNyZWF0ZUFycmF5KGwpLGJhc2U9QkFTRSxwcm9kdWN0LGNhcnJ5LGksYV9pLGJfajtmb3IoaT0wO2k8YV9sOysraSl7YV9pPWFbaV07Zm9yKHZhciBqPTA7ajxiX2w7KytqKXtiX2o9YltqXTtwcm9kdWN0PWFfaSpiX2orcltpK2pdO2NhcnJ5PU1hdGguZmxvb3IocHJvZHVjdC9iYXNlKTtyW2kral09cHJvZHVjdC1jYXJyeSpiYXNlO3JbaStqKzFdKz1jYXJyeX19dHJpbShyKTtyZXR1cm4gcn1mdW5jdGlvbiBtdWx0aXBseVNtYWxsKGEsYil7dmFyIGw9YS5sZW5ndGgscj1uZXcgQXJyYXkobCksYmFzZT1CQVNFLGNhcnJ5PTAscHJvZHVjdCxpO2ZvcihpPTA7aTxsO2krKyl7cHJvZHVjdD1hW2ldKmIrY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihwcm9kdWN0L2Jhc2UpO3JbaV09cHJvZHVjdC1jYXJyeSpiYXNlfXdoaWxlKGNhcnJ5PjApe3JbaSsrXT1jYXJyeSViYXNlO2NhcnJ5PU1hdGguZmxvb3IoY2FycnkvYmFzZSl9cmV0dXJuIHJ9ZnVuY3Rpb24gc2hpZnRMZWZ0KHgsbil7dmFyIHI9W107d2hpbGUobi0tID4wKXIucHVzaCgwKTtyZXR1cm4gci5jb25jYXQoeCl9ZnVuY3Rpb24gbXVsdGlwbHlLYXJhdHN1YmEoeCx5KXt2YXIgbj1NYXRoLm1heCh4Lmxlbmd0aCx5Lmxlbmd0aCk7aWYobjw9MzApcmV0dXJuIG11bHRpcGx5TG9uZyh4LHkpO249TWF0aC5jZWlsKG4vMik7dmFyIGI9eC5zbGljZShuKSxhPXguc2xpY2UoMCxuKSxkPXkuc2xpY2UobiksYz15LnNsaWNlKDAsbik7dmFyIGFjPW11bHRpcGx5S2FyYXRzdWJhKGEsYyksYmQ9bXVsdGlwbHlLYXJhdHN1YmEoYixkKSxhYmNkPW11bHRpcGx5S2FyYXRzdWJhKGFkZEFueShhLGIpLGFkZEFueShjLGQpKTt2YXIgcHJvZHVjdD1hZGRBbnkoYWRkQW55KGFjLHNoaWZ0TGVmdChzdWJ0cmFjdChzdWJ0cmFjdChhYmNkLGFjKSxiZCksbikpLHNoaWZ0TGVmdChiZCwyKm4pKTt0cmltKHByb2R1Y3QpO3JldHVybiBwcm9kdWN0fWZ1bmN0aW9uIHVzZUthcmF0c3ViYShsMSxsMil7cmV0dXJuLS4wMTIqbDEtLjAxMipsMisxNWUtNipsMSpsMj4wfUJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5PWZ1bmN0aW9uKHYpe3ZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZSxzaWduPXRoaXMuc2lnbiE9PW4uc2lnbixhYnM7aWYobi5pc1NtYWxsKXtpZihiPT09MClyZXR1cm4gSW50ZWdlclswXTtpZihiPT09MSlyZXR1cm4gdGhpcztpZihiPT09LTEpcmV0dXJuIHRoaXMubmVnYXRlKCk7YWJzPU1hdGguYWJzKGIpO2lmKGFiczxCQVNFKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIobXVsdGlwbHlTbWFsbChhLGFicyksc2lnbil9Yj1zbWFsbFRvQXJyYXkoYWJzKX1pZih1c2VLYXJhdHN1YmEoYS5sZW5ndGgsYi5sZW5ndGgpKXJldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseUthcmF0c3ViYShhLGIpLHNpZ24pO3JldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseUxvbmcoYSxiKSxzaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUudGltZXM9QmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHk7ZnVuY3Rpb24gbXVsdGlwbHlTbWFsbEFuZEFycmF5KGEsYixzaWduKXtpZihhPEJBU0Upe3JldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseVNtYWxsKGIsYSksc2lnbil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKG11bHRpcGx5TG9uZyhiLHNtYWxsVG9BcnJheShhKSksc2lnbil9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5fbXVsdGlwbHlCeVNtYWxsPWZ1bmN0aW9uKGEpe2lmKGlzUHJlY2lzZShhLnZhbHVlKnRoaXMudmFsdWUpKXtyZXR1cm4gbmV3IFNtYWxsSW50ZWdlcihhLnZhbHVlKnRoaXMudmFsdWUpfXJldHVybiBtdWx0aXBseVNtYWxsQW5kQXJyYXkoTWF0aC5hYnMoYS52YWx1ZSksc21hbGxUb0FycmF5KE1hdGguYWJzKHRoaXMudmFsdWUpKSx0aGlzLnNpZ24hPT1hLnNpZ24pfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5fbXVsdGlwbHlCeVNtYWxsPWZ1bmN0aW9uKGEpe2lmKGEudmFsdWU9PT0wKXJldHVybiBJbnRlZ2VyWzBdO2lmKGEudmFsdWU9PT0xKXJldHVybiB0aGlzO2lmKGEudmFsdWU9PT0tMSlyZXR1cm4gdGhpcy5uZWdhdGUoKTtyZXR1cm4gbXVsdGlwbHlTbWFsbEFuZEFycmF5KE1hdGguYWJzKGEudmFsdWUpLHRoaXMudmFsdWUsdGhpcy5zaWduIT09YS5zaWduKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbih2KXtyZXR1cm4gcGFyc2VWYWx1ZSh2KS5fbXVsdGlwbHlCeVNtYWxsKHRoaXMpfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnRpbWVzPVNtYWxsSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHk7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbih2KXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlKnBhcnNlVmFsdWUodikudmFsdWUpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLnRpbWVzPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubXVsdGlwbHk7ZnVuY3Rpb24gc3F1YXJlKGEpe3ZhciBsPWEubGVuZ3RoLHI9Y3JlYXRlQXJyYXkobCtsKSxiYXNlPUJBU0UscHJvZHVjdCxjYXJyeSxpLGFfaSxhX2o7Zm9yKGk9MDtpPGw7aSsrKXthX2k9YVtpXTtjYXJyeT0wLWFfaSphX2k7Zm9yKHZhciBqPWk7ajxsO2orKyl7YV9qPWFbal07cHJvZHVjdD0yKihhX2kqYV9qKStyW2kral0rY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihwcm9kdWN0L2Jhc2UpO3JbaStqXT1wcm9kdWN0LWNhcnJ5KmJhc2V9cltpK2xdPWNhcnJ5fXRyaW0ocik7cmV0dXJuIHJ9QmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHNxdWFyZSh0aGlzLnZhbHVlKSxmYWxzZSl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlPWZ1bmN0aW9uKCl7dmFyIHZhbHVlPXRoaXMudmFsdWUqdGhpcy52YWx1ZTtpZihpc1ByZWNpc2UodmFsdWUpKXJldHVybiBuZXcgU21hbGxJbnRlZ2VyKHZhbHVlKTtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoc3F1YXJlKHNtYWxsVG9BcnJheShNYXRoLmFicyh0aGlzLnZhbHVlKSkpLGZhbHNlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5zcXVhcmU9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZSp0aGlzLnZhbHVlKX07ZnVuY3Rpb24gZGl2TW9kMShhLGIpe3ZhciBhX2w9YS5sZW5ndGgsYl9sPWIubGVuZ3RoLGJhc2U9QkFTRSxyZXN1bHQ9Y3JlYXRlQXJyYXkoYi5sZW5ndGgpLGRpdmlzb3JNb3N0U2lnbmlmaWNhbnREaWdpdD1iW2JfbC0xXSxsYW1iZGE9TWF0aC5jZWlsKGJhc2UvKDIqZGl2aXNvck1vc3RTaWduaWZpY2FudERpZ2l0KSkscmVtYWluZGVyPW11bHRpcGx5U21hbGwoYSxsYW1iZGEpLGRpdmlzb3I9bXVsdGlwbHlTbWFsbChiLGxhbWJkYSkscXVvdGllbnREaWdpdCxzaGlmdCxjYXJyeSxib3Jyb3csaSxsLHE7aWYocmVtYWluZGVyLmxlbmd0aDw9YV9sKXJlbWFpbmRlci5wdXNoKDApO2Rpdmlzb3IucHVzaCgwKTtkaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQ9ZGl2aXNvcltiX2wtMV07Zm9yKHNoaWZ0PWFfbC1iX2w7c2hpZnQ+PTA7c2hpZnQtLSl7cXVvdGllbnREaWdpdD1iYXNlLTE7aWYocmVtYWluZGVyW3NoaWZ0K2JfbF0hPT1kaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQpe3F1b3RpZW50RGlnaXQ9TWF0aC5mbG9vcigocmVtYWluZGVyW3NoaWZ0K2JfbF0qYmFzZStyZW1haW5kZXJbc2hpZnQrYl9sLTFdKS9kaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQpfWNhcnJ5PTA7Ym9ycm93PTA7bD1kaXZpc29yLmxlbmd0aDtmb3IoaT0wO2k8bDtpKyspe2NhcnJ5Kz1xdW90aWVudERpZ2l0KmRpdmlzb3JbaV07cT1NYXRoLmZsb29yKGNhcnJ5L2Jhc2UpO2JvcnJvdys9cmVtYWluZGVyW3NoaWZ0K2ldLShjYXJyeS1xKmJhc2UpO2NhcnJ5PXE7aWYoYm9ycm93PDApe3JlbWFpbmRlcltzaGlmdCtpXT1ib3Jyb3crYmFzZTtib3Jyb3c9LTF9ZWxzZXtyZW1haW5kZXJbc2hpZnQraV09Ym9ycm93O2JvcnJvdz0wfX13aGlsZShib3Jyb3chPT0wKXtxdW90aWVudERpZ2l0LT0xO2NhcnJ5PTA7Zm9yKGk9MDtpPGw7aSsrKXtjYXJyeSs9cmVtYWluZGVyW3NoaWZ0K2ldLWJhc2UrZGl2aXNvcltpXTtpZihjYXJyeTwwKXtyZW1haW5kZXJbc2hpZnQraV09Y2FycnkrYmFzZTtjYXJyeT0wfWVsc2V7cmVtYWluZGVyW3NoaWZ0K2ldPWNhcnJ5O2NhcnJ5PTF9fWJvcnJvdys9Y2Fycnl9cmVzdWx0W3NoaWZ0XT1xdW90aWVudERpZ2l0fXJlbWFpbmRlcj1kaXZNb2RTbWFsbChyZW1haW5kZXIsbGFtYmRhKVswXTtyZXR1cm5bYXJyYXlUb1NtYWxsKHJlc3VsdCksYXJyYXlUb1NtYWxsKHJlbWFpbmRlcildfWZ1bmN0aW9uIGRpdk1vZDIoYSxiKXt2YXIgYV9sPWEubGVuZ3RoLGJfbD1iLmxlbmd0aCxyZXN1bHQ9W10scGFydD1bXSxiYXNlPUJBU0UsZ3Vlc3MseGxlbixoaWdoeCxoaWdoeSxjaGVjazt3aGlsZShhX2wpe3BhcnQudW5zaGlmdChhWy0tYV9sXSk7dHJpbShwYXJ0KTtpZihjb21wYXJlQWJzKHBhcnQsYik8MCl7cmVzdWx0LnB1c2goMCk7Y29udGludWV9eGxlbj1wYXJ0Lmxlbmd0aDtoaWdoeD1wYXJ0W3hsZW4tMV0qYmFzZStwYXJ0W3hsZW4tMl07aGlnaHk9YltiX2wtMV0qYmFzZStiW2JfbC0yXTtpZih4bGVuPmJfbCl7aGlnaHg9KGhpZ2h4KzEpKmJhc2V9Z3Vlc3M9TWF0aC5jZWlsKGhpZ2h4L2hpZ2h5KTtkb3tjaGVjaz1tdWx0aXBseVNtYWxsKGIsZ3Vlc3MpO2lmKGNvbXBhcmVBYnMoY2hlY2sscGFydCk8PTApYnJlYWs7Z3Vlc3MtLX13aGlsZShndWVzcyk7cmVzdWx0LnB1c2goZ3Vlc3MpO3BhcnQ9c3VidHJhY3QocGFydCxjaGVjayl9cmVzdWx0LnJldmVyc2UoKTtyZXR1cm5bYXJyYXlUb1NtYWxsKHJlc3VsdCksYXJyYXlUb1NtYWxsKHBhcnQpXX1mdW5jdGlvbiBkaXZNb2RTbWFsbCh2YWx1ZSxsYW1iZGEpe3ZhciBsZW5ndGg9dmFsdWUubGVuZ3RoLHF1b3RpZW50PWNyZWF0ZUFycmF5KGxlbmd0aCksYmFzZT1CQVNFLGkscSxyZW1haW5kZXIsZGl2aXNvcjtyZW1haW5kZXI9MDtmb3IoaT1sZW5ndGgtMTtpPj0wOy0taSl7ZGl2aXNvcj1yZW1haW5kZXIqYmFzZSt2YWx1ZVtpXTtxPXRydW5jYXRlKGRpdmlzb3IvbGFtYmRhKTtyZW1haW5kZXI9ZGl2aXNvci1xKmxhbWJkYTtxdW90aWVudFtpXT1xfDB9cmV0dXJuW3F1b3RpZW50LHJlbWFpbmRlcnwwXX1mdW5jdGlvbiBkaXZNb2RBbnkoc2VsZix2KXt2YXIgdmFsdWUsbj1wYXJzZVZhbHVlKHYpO2lmKHN1cHBvcnRzTmF0aXZlQmlnSW50KXtyZXR1cm5bbmV3IE5hdGl2ZUJpZ0ludChzZWxmLnZhbHVlL24udmFsdWUpLG5ldyBOYXRpdmVCaWdJbnQoc2VsZi52YWx1ZSVuLnZhbHVlKV19dmFyIGE9c2VsZi52YWx1ZSxiPW4udmFsdWU7dmFyIHF1b3RpZW50O2lmKGI9PT0wKXRocm93IG5ldyBFcnJvcigiQ2Fubm90IGRpdmlkZSBieSB6ZXJvIik7aWYoc2VsZi5pc1NtYWxsKXtpZihuLmlzU21hbGwpe3JldHVybltuZXcgU21hbGxJbnRlZ2VyKHRydW5jYXRlKGEvYikpLG5ldyBTbWFsbEludGVnZXIoYSViKV19cmV0dXJuW0ludGVnZXJbMF0sc2VsZl19aWYobi5pc1NtYWxsKXtpZihiPT09MSlyZXR1cm5bc2VsZixJbnRlZ2VyWzBdXTtpZihiPT0tMSlyZXR1cm5bc2VsZi5uZWdhdGUoKSxJbnRlZ2VyWzBdXTt2YXIgYWJzPU1hdGguYWJzKGIpO2lmKGFiczxCQVNFKXt2YWx1ZT1kaXZNb2RTbWFsbChhLGFicyk7cXVvdGllbnQ9YXJyYXlUb1NtYWxsKHZhbHVlWzBdKTt2YXIgcmVtYWluZGVyPXZhbHVlWzFdO2lmKHNlbGYuc2lnbilyZW1haW5kZXI9LXJlbWFpbmRlcjtpZih0eXBlb2YgcXVvdGllbnQ9PT0ibnVtYmVyIil7aWYoc2VsZi5zaWduIT09bi5zaWduKXF1b3RpZW50PS1xdW90aWVudDtyZXR1cm5bbmV3IFNtYWxsSW50ZWdlcihxdW90aWVudCksbmV3IFNtYWxsSW50ZWdlcihyZW1haW5kZXIpXX1yZXR1cm5bbmV3IEJpZ0ludGVnZXIocXVvdGllbnQsc2VsZi5zaWduIT09bi5zaWduKSxuZXcgU21hbGxJbnRlZ2VyKHJlbWFpbmRlcildfWI9c21hbGxUb0FycmF5KGFicyl9dmFyIGNvbXBhcmlzb249Y29tcGFyZUFicyhhLGIpO2lmKGNvbXBhcmlzb249PT0tMSlyZXR1cm5bSW50ZWdlclswXSxzZWxmXTtpZihjb21wYXJpc29uPT09MClyZXR1cm5bSW50ZWdlcltzZWxmLnNpZ249PT1uLnNpZ24/MTotMV0sSW50ZWdlclswXV07aWYoYS5sZW5ndGgrYi5sZW5ndGg8PTIwMCl2YWx1ZT1kaXZNb2QxKGEsYik7ZWxzZSB2YWx1ZT1kaXZNb2QyKGEsYik7cXVvdGllbnQ9dmFsdWVbMF07dmFyIHFTaWduPXNlbGYuc2lnbiE9PW4uc2lnbixtb2Q9dmFsdWVbMV0sbVNpZ249c2VsZi5zaWduO2lmKHR5cGVvZiBxdW90aWVudD09PSJudW1iZXIiKXtpZihxU2lnbilxdW90aWVudD0tcXVvdGllbnQ7cXVvdGllbnQ9bmV3IFNtYWxsSW50ZWdlcihxdW90aWVudCl9ZWxzZSBxdW90aWVudD1uZXcgQmlnSW50ZWdlcihxdW90aWVudCxxU2lnbik7aWYodHlwZW9mIG1vZD09PSJudW1iZXIiKXtpZihtU2lnbiltb2Q9LW1vZDttb2Q9bmV3IFNtYWxsSW50ZWdlcihtb2QpfWVsc2UgbW9kPW5ldyBCaWdJbnRlZ2VyKG1vZCxtU2lnbik7cmV0dXJuW3F1b3RpZW50LG1vZF19QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2bW9kPWZ1bmN0aW9uKHYpe3ZhciByZXN1bHQ9ZGl2TW9kQW55KHRoaXMsdik7cmV0dXJue3F1b3RpZW50OnJlc3VsdFswXSxyZW1haW5kZXI6cmVzdWx0WzFdfX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5kaXZtb2Q9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5kaXZtb2Q9QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2bW9kO0JpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZT1mdW5jdGlvbih2KXtyZXR1cm4gZGl2TW9kQW55KHRoaXMsdilbMF19O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUub3Zlcj1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmRpdmlkZT1mdW5jdGlvbih2KXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlL3BhcnNlVmFsdWUodikudmFsdWUpfTtTbWFsbEludGVnZXIucHJvdG90eXBlLm92ZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGU9QmlnSW50ZWdlci5wcm90b3R5cGUub3Zlcj1CaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGU7QmlnSW50ZWdlci5wcm90b3R5cGUubW9kPWZ1bmN0aW9uKHYpe3JldHVybiBkaXZNb2RBbnkodGhpcyx2KVsxXX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5tb2Q9TmF0aXZlQmlnSW50LnByb3RvdHlwZS5yZW1haW5kZXI9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZSVwYXJzZVZhbHVlKHYpLnZhbHVlKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5yZW1haW5kZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5tb2Q9QmlnSW50ZWdlci5wcm90b3R5cGUucmVtYWluZGVyPUJpZ0ludGVnZXIucHJvdG90eXBlLm1vZDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5wb3c9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KSxhPXRoaXMudmFsdWUsYj1uLnZhbHVlLHZhbHVlLHgseTtpZihiPT09MClyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09MClyZXR1cm4gSW50ZWdlclswXTtpZihhPT09MSlyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09LTEpcmV0dXJuIG4uaXNFdmVuKCk/SW50ZWdlclsxXTpJbnRlZ2VyWy0xXTtpZihuLnNpZ24pe3JldHVybiBJbnRlZ2VyWzBdfWlmKCFuLmlzU21hbGwpdGhyb3cgbmV3IEVycm9yKCJUaGUgZXhwb25lbnQgIituLnRvU3RyaW5nKCkrIiBpcyB0b28gbGFyZ2UuIik7aWYodGhpcy5pc1NtYWxsKXtpZihpc1ByZWNpc2UodmFsdWU9TWF0aC5wb3coYSxiKSkpcmV0dXJuIG5ldyBTbWFsbEludGVnZXIodHJ1bmNhdGUodmFsdWUpKX14PXRoaXM7eT1JbnRlZ2VyWzFdO3doaWxlKHRydWUpe2lmKGImMT09PTEpe3k9eS50aW1lcyh4KTstLWJ9aWYoYj09PTApYnJlYWs7Yi89Mjt4PXguc3F1YXJlKCl9cmV0dXJuIHl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUucG93PUJpZ0ludGVnZXIucHJvdG90eXBlLnBvdztOYXRpdmVCaWdJbnQucHJvdG90eXBlLnBvdz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO3ZhciBhPXRoaXMudmFsdWUsYj1uLnZhbHVlO3ZhciBfMD1CaWdJbnQoMCksXzE9QmlnSW50KDEpLF8yPUJpZ0ludCgyKTtpZihiPT09XzApcmV0dXJuIEludGVnZXJbMV07aWYoYT09PV8wKXJldHVybiBJbnRlZ2VyWzBdO2lmKGE9PT1fMSlyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09QmlnSW50KC0xKSlyZXR1cm4gbi5pc0V2ZW4oKT9JbnRlZ2VyWzFdOkludGVnZXJbLTFdO2lmKG4uaXNOZWdhdGl2ZSgpKXJldHVybiBuZXcgTmF0aXZlQmlnSW50KF8wKTt2YXIgeD10aGlzO3ZhciB5PUludGVnZXJbMV07d2hpbGUodHJ1ZSl7aWYoKGImXzEpPT09XzEpe3k9eS50aW1lcyh4KTstLWJ9aWYoYj09PV8wKWJyZWFrO2IvPV8yO3g9eC5zcXVhcmUoKX1yZXR1cm4geX07QmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93PWZ1bmN0aW9uKGV4cCxtb2Qpe2V4cD1wYXJzZVZhbHVlKGV4cCk7bW9kPXBhcnNlVmFsdWUobW9kKTtpZihtb2QuaXNaZXJvKCkpdGhyb3cgbmV3IEVycm9yKCJDYW5ub3QgdGFrZSBtb2RQb3cgd2l0aCBtb2R1bHVzIDAiKTt2YXIgcj1JbnRlZ2VyWzFdLGJhc2U9dGhpcy5tb2QobW9kKTtpZihleHAuaXNOZWdhdGl2ZSgpKXtleHA9ZXhwLm11bHRpcGx5KEludGVnZXJbLTFdKTtiYXNlPWJhc2UubW9kSW52KG1vZCl9d2hpbGUoZXhwLmlzUG9zaXRpdmUoKSl7aWYoYmFzZS5pc1plcm8oKSlyZXR1cm4gSW50ZWdlclswXTtpZihleHAuaXNPZGQoKSlyPXIubXVsdGlwbHkoYmFzZSkubW9kKG1vZCk7ZXhwPWV4cC5kaXZpZGUoMik7YmFzZT1iYXNlLnNxdWFyZSgpLm1vZChtb2QpfXJldHVybiByfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm1vZFBvdz1TbWFsbEludGVnZXIucHJvdG90eXBlLm1vZFBvdz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3c7ZnVuY3Rpb24gY29tcGFyZUFicyhhLGIpe2lmKGEubGVuZ3RoIT09Yi5sZW5ndGgpe3JldHVybiBhLmxlbmd0aD5iLmxlbmd0aD8xOi0xfWZvcih2YXIgaT1hLmxlbmd0aC0xO2k+PTA7aS0tKXtpZihhW2ldIT09YltpXSlyZXR1cm4gYVtpXT5iW2ldPzE6LTF9cmV0dXJuIDB9QmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZUFicz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpLGE9dGhpcy52YWx1ZSxiPW4udmFsdWU7aWYobi5pc1NtYWxsKXJldHVybiAxO3JldHVybiBjb21wYXJlQWJzKGEsYil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZUFicz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpLGE9TWF0aC5hYnModGhpcy52YWx1ZSksYj1uLnZhbHVlO2lmKG4uaXNTbWFsbCl7Yj1NYXRoLmFicyhiKTtyZXR1cm4gYT09PWI/MDphPmI/MTotMX1yZXR1cm4tMX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5jb21wYXJlQWJzPWZ1bmN0aW9uKHYpe3ZhciBhPXRoaXMudmFsdWU7dmFyIGI9cGFyc2VWYWx1ZSh2KS52YWx1ZTthPWE+PTA/YTotYTtiPWI+PTA/YjotYjtyZXR1cm4gYT09PWI/MDphPmI/MTotMX07QmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZT1mdW5jdGlvbih2KXtpZih2PT09SW5maW5pdHkpe3JldHVybi0xfWlmKHY9PT0tSW5maW5pdHkpe3JldHVybiAxfXZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZih0aGlzLnNpZ24hPT1uLnNpZ24pe3JldHVybiBuLnNpZ24/MTotMX1pZihuLmlzU21hbGwpe3JldHVybiB0aGlzLnNpZ24/LTE6MX1yZXR1cm4gY29tcGFyZUFicyhhLGIpKih0aGlzLnNpZ24/LTE6MSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb21wYXJlO1NtYWxsSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZT1mdW5jdGlvbih2KXtpZih2PT09SW5maW5pdHkpe3JldHVybi0xfWlmKHY9PT0tSW5maW5pdHkpe3JldHVybiAxfXZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe3JldHVybiBhPT1iPzA6YT5iPzE6LTF9aWYoYTwwIT09bi5zaWduKXtyZXR1cm4gYTwwPy0xOjF9cmV0dXJuIGE8MD8xOi0xfTtTbWFsbEludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbz1TbWFsbEludGVnZXIucHJvdG90eXBlLmNvbXBhcmU7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5jb21wYXJlPWZ1bmN0aW9uKHYpe2lmKHY9PT1JbmZpbml0eSl7cmV0dXJuLTF9aWYodj09PS1JbmZpbml0eSl7cmV0dXJuIDF9dmFyIGE9dGhpcy52YWx1ZTt2YXIgYj1wYXJzZVZhbHVlKHYpLnZhbHVlO3JldHVybiBhPT09Yj8wOmE+Yj8xOi0xfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmNvbXBhcmVUbz1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmNvbXBhcmU7QmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik9PT0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmVxPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUuZXF1YWxzPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5lcXVhbHM9QmlnSW50ZWdlci5wcm90b3R5cGUuZXE9QmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzO0JpZ0ludGVnZXIucHJvdG90eXBlLm5vdEVxdWFscz1mdW5jdGlvbih2KXtyZXR1cm4gdGhpcy5jb21wYXJlKHYpIT09MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5uZXE9TmF0aXZlQmlnSW50LnByb3RvdHlwZS5ub3RFcXVhbHM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5uZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5ub3RFcXVhbHM9QmlnSW50ZWdlci5wcm90b3R5cGUubmVxPUJpZ0ludGVnZXIucHJvdG90eXBlLm5vdEVxdWFscztCaWdJbnRlZ2VyLnByb3RvdHlwZS5ncmVhdGVyPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik+MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5ndD1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmdyZWF0ZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5ndD1TbWFsbEludGVnZXIucHJvdG90eXBlLmdyZWF0ZXI9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3Q9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3JlYXRlcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXI9ZnVuY3Rpb24odil7cmV0dXJuIHRoaXMuY29tcGFyZSh2KTwwfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmx0PU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVzc2VyPVNtYWxsSW50ZWdlci5wcm90b3R5cGUubHQ9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXI9QmlnSW50ZWdlci5wcm90b3R5cGUubHQ9QmlnSW50ZWdlci5wcm90b3R5cGUubGVzc2VyO0JpZ0ludGVnZXIucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1mdW5jdGlvbih2KXtyZXR1cm4gdGhpcy5jb21wYXJlKHYpPj0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmdlcT1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1TbWFsbEludGVnZXIucHJvdG90eXBlLmdlcT1TbWFsbEludGVnZXIucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5nZXE9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3JlYXRlck9yRXF1YWxzO0JpZ0ludGVnZXIucHJvdG90eXBlLmxlc3Nlck9yRXF1YWxzPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik8PTB9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVxPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVzc2VyT3JFcXVhbHM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXJPckVxdWFscz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5sZXE9QmlnSW50ZWdlci5wcm90b3R5cGUubGVzc2VyT3JFcXVhbHM7QmlnSW50ZWdlci5wcm90b3R5cGUuaXNFdmVuPWZ1bmN0aW9uKCl7cmV0dXJuKHRoaXMudmFsdWVbMF0mMSk9PT0wfTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzRXZlbj1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJjEpPT09MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc0V2ZW49ZnVuY3Rpb24oKXtyZXR1cm4odGhpcy52YWx1ZSZCaWdJbnQoMSkpPT09QmlnSW50KDApfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlWzBdJjEpPT09MX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJjEpPT09MX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJkJpZ0ludCgxKSk9PT1CaWdJbnQoMSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLmlzUG9zaXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4hdGhpcy5zaWdufTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzUG9zaXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZT4wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzUG9zaXRpdmU9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc1Bvc2l0aXZlO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzTmVnYXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zaWdufTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzTmVnYXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZTwwfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzTmVnYXRpdmU9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc05lZ2F0aXZlO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzVW5pdD1mdW5jdGlvbigpe3JldHVybiBmYWxzZX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc1VuaXQ9ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5hYnModGhpcy52YWx1ZSk9PT0xfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzVW5pdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFicygpLnZhbHVlPT09QmlnSW50KDEpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1plcm89ZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2V9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNaZXJvPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmFsdWU9PT0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzWmVybz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZhbHVlPT09QmlnSW50KDApfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5PWZ1bmN0aW9uKHYpe3ZhciBuPXBhcnNlVmFsdWUodik7aWYobi5pc1plcm8oKSlyZXR1cm4gZmFsc2U7aWYobi5pc1VuaXQoKSlyZXR1cm4gdHJ1ZTtpZihuLmNvbXBhcmVBYnMoMik9PT0wKXJldHVybiB0aGlzLmlzRXZlbigpO3JldHVybiB0aGlzLm1vZChuKS5pc1plcm8oKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5PVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNEaXZpc2libGVCeT1CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5O2Z1bmN0aW9uIGlzQmFzaWNQcmltZSh2KXt2YXIgbj12LmFicygpO2lmKG4uaXNVbml0KCkpcmV0dXJuIGZhbHNlO2lmKG4uZXF1YWxzKDIpfHxuLmVxdWFscygzKXx8bi5lcXVhbHMoNSkpcmV0dXJuIHRydWU7aWYobi5pc0V2ZW4oKXx8bi5pc0RpdmlzaWJsZUJ5KDMpfHxuLmlzRGl2aXNpYmxlQnkoNSkpcmV0dXJuIGZhbHNlO2lmKG4ubGVzc2VyKDQ5KSlyZXR1cm4gdHJ1ZX1mdW5jdGlvbiBtaWxsZXJSYWJpblRlc3QobixhKXt2YXIgblByZXY9bi5wcmV2KCksYj1uUHJldixyPTAsZCx0LGkseDt3aGlsZShiLmlzRXZlbigpKWI9Yi5kaXZpZGUoMikscisrO25leHQ6Zm9yKGk9MDtpPGEubGVuZ3RoO2krKyl7aWYobi5sZXNzZXIoYVtpXSkpY29udGludWU7eD1iaWdJbnQoYVtpXSkubW9kUG93KGIsbik7aWYoeC5pc1VuaXQoKXx8eC5lcXVhbHMoblByZXYpKWNvbnRpbnVlO2ZvcihkPXItMTtkIT0wO2QtLSl7eD14LnNxdWFyZSgpLm1vZChuKTtpZih4LmlzVW5pdCgpKXJldHVybiBmYWxzZTtpZih4LmVxdWFscyhuUHJldikpY29udGludWUgbmV4dH1yZXR1cm4gZmFsc2V9cmV0dXJuIHRydWV9QmlnSW50ZWdlci5wcm90b3R5cGUuaXNQcmltZT1mdW5jdGlvbihzdHJpY3Qpe3ZhciBpc1ByaW1lPWlzQmFzaWNQcmltZSh0aGlzKTtpZihpc1ByaW1lIT09dW5kZWZpbmVkKXJldHVybiBpc1ByaW1lO3ZhciBuPXRoaXMuYWJzKCk7dmFyIGJpdHM9bi5iaXRMZW5ndGgoKTtpZihiaXRzPD02NClyZXR1cm4gbWlsbGVyUmFiaW5UZXN0KG4sWzIsMyw1LDcsMTEsMTMsMTcsMTksMjMsMjksMzEsMzddKTt2YXIgbG9nTj1NYXRoLmxvZygyKSpiaXRzLnRvSlNOdW1iZXIoKTt2YXIgdD1NYXRoLmNlaWwoc3RyaWN0PT09dHJ1ZT8yKk1hdGgucG93KGxvZ04sMik6bG9nTik7Zm9yKHZhciBhPVtdLGk9MDtpPHQ7aSsrKXthLnB1c2goYmlnSW50KGkrMikpfXJldHVybiBtaWxsZXJSYWJpblRlc3QobixhKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc1ByaW1lPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNQcmltZT1CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1ByaW1lO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZT1mdW5jdGlvbihpdGVyYXRpb25zKXt2YXIgaXNQcmltZT1pc0Jhc2ljUHJpbWUodGhpcyk7aWYoaXNQcmltZSE9PXVuZGVmaW5lZClyZXR1cm4gaXNQcmltZTt2YXIgbj10aGlzLmFicygpO3ZhciB0PWl0ZXJhdGlvbnM9PT11bmRlZmluZWQ/NTppdGVyYXRpb25zO2Zvcih2YXIgYT1bXSxpPTA7aTx0O2krKyl7YS5wdXNoKGJpZ0ludC5yYW5kQmV0d2VlbigyLG4ubWludXMoMikpKX1yZXR1cm4gbWlsbGVyUmFiaW5UZXN0KG4sYSl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lPUJpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnY9ZnVuY3Rpb24obil7dmFyIHQ9YmlnSW50Lnplcm8sbmV3VD1iaWdJbnQub25lLHI9cGFyc2VWYWx1ZShuKSxuZXdSPXRoaXMuYWJzKCkscSxsYXN0VCxsYXN0Ujt3aGlsZSghbmV3Ui5pc1plcm8oKSl7cT1yLmRpdmlkZShuZXdSKTtsYXN0VD10O2xhc3RSPXI7dD1uZXdUO3I9bmV3UjtuZXdUPWxhc3RULnN1YnRyYWN0KHEubXVsdGlwbHkobmV3VCkpO25ld1I9bGFzdFIuc3VidHJhY3QocS5tdWx0aXBseShuZXdSKSl9aWYoIXIuaXNVbml0KCkpdGhyb3cgbmV3IEVycm9yKHRoaXMudG9TdHJpbmcoKSsiIGFuZCAiK24udG9TdHJpbmcoKSsiIGFyZSBub3QgY28tcHJpbWUiKTtpZih0LmNvbXBhcmUoMCk9PT0tMSl7dD10LmFkZChuKX1pZih0aGlzLmlzTmVnYXRpdmUoKSl7cmV0dXJuIHQubmVnYXRlKCl9cmV0dXJuIHR9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubW9kSW52PVNtYWxsSW50ZWdlci5wcm90b3R5cGUubW9kSW52PUJpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIHZhbHVlPXRoaXMudmFsdWU7aWYodGhpcy5zaWduKXtyZXR1cm4gc3VidHJhY3RTbWFsbCh2YWx1ZSwxLHRoaXMuc2lnbil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKGFkZFNtYWxsKHZhbHVlLDEpLHRoaXMuc2lnbil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe3ZhciB2YWx1ZT10aGlzLnZhbHVlO2lmKHZhbHVlKzE8TUFYX0lOVClyZXR1cm4gbmV3IFNtYWxsSW50ZWdlcih2YWx1ZSsxKTtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoTUFYX0lOVF9BUlIsZmFsc2UpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlK0JpZ0ludCgxKSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXt2YXIgdmFsdWU9dGhpcy52YWx1ZTtpZih0aGlzLnNpZ24pe3JldHVybiBuZXcgQmlnSW50ZWdlcihhZGRTbWFsbCh2YWx1ZSwxKSx0cnVlKX1yZXR1cm4gc3VidHJhY3RTbWFsbCh2YWx1ZSwxLHRoaXMuc2lnbil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe3ZhciB2YWx1ZT10aGlzLnZhbHVlO2lmKHZhbHVlLTE+LU1BWF9JTlQpcmV0dXJuIG5ldyBTbWFsbEludGVnZXIodmFsdWUtMSk7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKE1BWF9JTlRfQVJSLHRydWUpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlLUJpZ0ludCgxKSl9O3ZhciBwb3dlcnNPZlR3bz1bMV07d2hpbGUoMipwb3dlcnNPZlR3b1twb3dlcnNPZlR3by5sZW5ndGgtMV08PUJBU0UpcG93ZXJzT2ZUd28ucHVzaCgyKnBvd2Vyc09mVHdvW3Bvd2Vyc09mVHdvLmxlbmd0aC0xXSk7dmFyIHBvd2VyczJMZW5ndGg9cG93ZXJzT2ZUd28ubGVuZ3RoLGhpZ2hlc3RQb3dlcjI9cG93ZXJzT2ZUd29bcG93ZXJzMkxlbmd0aC0xXTtmdW5jdGlvbiBzaGlmdF9pc1NtYWxsKG4pe3JldHVybiBNYXRoLmFicyhuKTw9QkFTRX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdExlZnQ9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KS50b0pTTnVtYmVyKCk7aWYoIXNoaWZ0X2lzU21hbGwobikpe3Rocm93IG5ldyBFcnJvcihTdHJpbmcobikrIiBpcyB0b28gbGFyZ2UgZm9yIHNoaWZ0aW5nLiIpfWlmKG48MClyZXR1cm4gdGhpcy5zaGlmdFJpZ2h0KC1uKTt2YXIgcmVzdWx0PXRoaXM7aWYocmVzdWx0LmlzWmVybygpKXJldHVybiByZXN1bHQ7d2hpbGUobj49cG93ZXJzMkxlbmd0aCl7cmVzdWx0PXJlc3VsdC5tdWx0aXBseShoaWdoZXN0UG93ZXIyKTtuLT1wb3dlcnMyTGVuZ3RoLTF9cmV0dXJuIHJlc3VsdC5tdWx0aXBseShwb3dlcnNPZlR3b1tuXSl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc2hpZnRMZWZ0PVNtYWxsSW50ZWdlci5wcm90b3R5cGUuc2hpZnRMZWZ0PUJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0TGVmdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdFJpZ2h0PWZ1bmN0aW9uKHYpe3ZhciByZW1RdW87dmFyIG49cGFyc2VWYWx1ZSh2KS50b0pTTnVtYmVyKCk7aWYoIXNoaWZ0X2lzU21hbGwobikpe3Rocm93IG5ldyBFcnJvcihTdHJpbmcobikrIiBpcyB0b28gbGFyZ2UgZm9yIHNoaWZ0aW5nLiIpfWlmKG48MClyZXR1cm4gdGhpcy5zaGlmdExlZnQoLW4pO3ZhciByZXN1bHQ9dGhpczt3aGlsZShuPj1wb3dlcnMyTGVuZ3RoKXtpZihyZXN1bHQuaXNaZXJvKCl8fHJlc3VsdC5pc05lZ2F0aXZlKCkmJnJlc3VsdC5pc1VuaXQoKSlyZXR1cm4gcmVzdWx0O3JlbVF1bz1kaXZNb2RBbnkocmVzdWx0LGhpZ2hlc3RQb3dlcjIpO3Jlc3VsdD1yZW1RdW9bMV0uaXNOZWdhdGl2ZSgpP3JlbVF1b1swXS5wcmV2KCk6cmVtUXVvWzBdO24tPXBvd2VyczJMZW5ndGgtMX1yZW1RdW89ZGl2TW9kQW55KHJlc3VsdCxwb3dlcnNPZlR3b1tuXSk7cmV0dXJuIHJlbVF1b1sxXS5pc05lZ2F0aXZlKCk/cmVtUXVvWzBdLnByZXYoKTpyZW1RdW9bMF19O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc2hpZnRSaWdodD1TbWFsbEludGVnZXIucHJvdG90eXBlLnNoaWZ0UmlnaHQ9QmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRSaWdodDtmdW5jdGlvbiBiaXR3aXNlKHgseSxmbil7eT1wYXJzZVZhbHVlKHkpO3ZhciB4U2lnbj14LmlzTmVnYXRpdmUoKSx5U2lnbj15LmlzTmVnYXRpdmUoKTt2YXIgeFJlbT14U2lnbj94Lm5vdCgpOngseVJlbT15U2lnbj95Lm5vdCgpOnk7dmFyIHhEaWdpdD0wLHlEaWdpdD0wO3ZhciB4RGl2TW9kPW51bGwseURpdk1vZD1udWxsO3ZhciByZXN1bHQ9W107d2hpbGUoIXhSZW0uaXNaZXJvKCl8fCF5UmVtLmlzWmVybygpKXt4RGl2TW9kPWRpdk1vZEFueSh4UmVtLGhpZ2hlc3RQb3dlcjIpO3hEaWdpdD14RGl2TW9kWzFdLnRvSlNOdW1iZXIoKTtpZih4U2lnbil7eERpZ2l0PWhpZ2hlc3RQb3dlcjItMS14RGlnaXR9eURpdk1vZD1kaXZNb2RBbnkoeVJlbSxoaWdoZXN0UG93ZXIyKTt5RGlnaXQ9eURpdk1vZFsxXS50b0pTTnVtYmVyKCk7aWYoeVNpZ24pe3lEaWdpdD1oaWdoZXN0UG93ZXIyLTEteURpZ2l0fXhSZW09eERpdk1vZFswXTt5UmVtPXlEaXZNb2RbMF07cmVzdWx0LnB1c2goZm4oeERpZ2l0LHlEaWdpdCkpfXZhciBzdW09Zm4oeFNpZ24/MTowLHlTaWduPzE6MCkhPT0wP2JpZ0ludCgtMSk6YmlnSW50KDApO2Zvcih2YXIgaT1yZXN1bHQubGVuZ3RoLTE7aT49MDtpLT0xKXtzdW09c3VtLm11bHRpcGx5KGhpZ2hlc3RQb3dlcjIpLmFkZChiaWdJbnQocmVzdWx0W2ldKSl9cmV0dXJuIHN1bX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5ub3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uZWdhdGUoKS5wcmV2KCl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubm90PVNtYWxsSW50ZWdlci5wcm90b3R5cGUubm90PUJpZ0ludGVnZXIucHJvdG90eXBlLm5vdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQ9ZnVuY3Rpb24obil7cmV0dXJuIGJpdHdpc2UodGhpcyxuLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEmYn0pfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmFuZD1TbWFsbEludGVnZXIucHJvdG90eXBlLmFuZD1CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQ7QmlnSW50ZWdlci5wcm90b3R5cGUub3I9ZnVuY3Rpb24obil7cmV0dXJuIGJpdHdpc2UodGhpcyxuLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGF8Yn0pfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm9yPVNtYWxsSW50ZWdlci5wcm90b3R5cGUub3I9QmlnSW50ZWdlci5wcm90b3R5cGUub3I7QmlnSW50ZWdlci5wcm90b3R5cGUueG9yPWZ1bmN0aW9uKG4pe3JldHVybiBiaXR3aXNlKHRoaXMsbixmdW5jdGlvbihhLGIpe3JldHVybiBhXmJ9KX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS54b3I9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS54b3I9QmlnSW50ZWdlci5wcm90b3R5cGUueG9yO3ZhciBMT0JNQVNLX0k9MTw8MzAsTE9CTUFTS19CST0oQkFTRSYtQkFTRSkqKEJBU0UmLUJBU0UpfExPQk1BU0tfSTtmdW5jdGlvbiByb3VnaExPQihuKXt2YXIgdj1uLnZhbHVlLHg9dHlwZW9mIHY9PT0ibnVtYmVyIj92fExPQk1BU0tfSTp0eXBlb2Ygdj09PSJiaWdpbnQiP3Z8QmlnSW50KExPQk1BU0tfSSk6dlswXSt2WzFdKkJBU0V8TE9CTUFTS19CSTtyZXR1cm4geCYteH1mdW5jdGlvbiBpbnRlZ2VyTG9nYXJpdGhtKHZhbHVlLGJhc2Upe2lmKGJhc2UuY29tcGFyZVRvKHZhbHVlKTw9MCl7dmFyIHRtcD1pbnRlZ2VyTG9nYXJpdGhtKHZhbHVlLGJhc2Uuc3F1YXJlKGJhc2UpKTt2YXIgcD10bXAucDt2YXIgZT10bXAuZTt2YXIgdD1wLm11bHRpcGx5KGJhc2UpO3JldHVybiB0LmNvbXBhcmVUbyh2YWx1ZSk8PTA/e3A6dCxlOmUqMisxfTp7cDpwLGU6ZSoyfX1yZXR1cm57cDpiaWdJbnQoMSksZTowfX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGg9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO2lmKG4uY29tcGFyZVRvKGJpZ0ludCgwKSk8MCl7bj1uLm5lZ2F0ZSgpLnN1YnRyYWN0KGJpZ0ludCgxKSl9aWYobi5jb21wYXJlVG8oYmlnSW50KDApKT09PTApe3JldHVybiBiaWdJbnQoMCl9cmV0dXJuIGJpZ0ludChpbnRlZ2VyTG9nYXJpdGhtKG4sYmlnSW50KDIpKS5lKS5hZGQoYmlnSW50KDEpKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5iaXRMZW5ndGg9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGg9QmlnSW50ZWdlci5wcm90b3R5cGUuYml0TGVuZ3RoO2Z1bmN0aW9uIG1heChhLGIpe2E9cGFyc2VWYWx1ZShhKTtiPXBhcnNlVmFsdWUoYik7cmV0dXJuIGEuZ3JlYXRlcihiKT9hOmJ9ZnVuY3Rpb24gbWluKGEsYil7YT1wYXJzZVZhbHVlKGEpO2I9cGFyc2VWYWx1ZShiKTtyZXR1cm4gYS5sZXNzZXIoYik/YTpifWZ1bmN0aW9uIGdjZChhLGIpe2E9cGFyc2VWYWx1ZShhKS5hYnMoKTtiPXBhcnNlVmFsdWUoYikuYWJzKCk7aWYoYS5lcXVhbHMoYikpcmV0dXJuIGE7aWYoYS5pc1plcm8oKSlyZXR1cm4gYjtpZihiLmlzWmVybygpKXJldHVybiBhO3ZhciBjPUludGVnZXJbMV0sZCx0O3doaWxlKGEuaXNFdmVuKCkmJmIuaXNFdmVuKCkpe2Q9bWluKHJvdWdoTE9CKGEpLHJvdWdoTE9CKGIpKTthPWEuZGl2aWRlKGQpO2I9Yi5kaXZpZGUoZCk7Yz1jLm11bHRpcGx5KGQpfXdoaWxlKGEuaXNFdmVuKCkpe2E9YS5kaXZpZGUocm91Z2hMT0IoYSkpfWRve3doaWxlKGIuaXNFdmVuKCkpe2I9Yi5kaXZpZGUocm91Z2hMT0IoYikpfWlmKGEuZ3JlYXRlcihiKSl7dD1iO2I9YTthPXR9Yj1iLnN1YnRyYWN0KGEpfXdoaWxlKCFiLmlzWmVybygpKTtyZXR1cm4gYy5pc1VuaXQoKT9hOmEubXVsdGlwbHkoYyl9ZnVuY3Rpb24gbGNtKGEsYil7YT1wYXJzZVZhbHVlKGEpLmFicygpO2I9cGFyc2VWYWx1ZShiKS5hYnMoKTtyZXR1cm4gYS5kaXZpZGUoZ2NkKGEsYikpLm11bHRpcGx5KGIpfWZ1bmN0aW9uIHJhbmRCZXR3ZWVuKGEsYil7YT1wYXJzZVZhbHVlKGEpO2I9cGFyc2VWYWx1ZShiKTt2YXIgbG93PW1pbihhLGIpLGhpZ2g9bWF4KGEsYik7dmFyIHJhbmdlPWhpZ2guc3VidHJhY3QobG93KS5hZGQoMSk7aWYocmFuZ2UuaXNTbWFsbClyZXR1cm4gbG93LmFkZChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqcmFuZ2UpKTt2YXIgZGlnaXRzPXRvQmFzZShyYW5nZSxCQVNFKS52YWx1ZTt2YXIgcmVzdWx0PVtdLHJlc3RyaWN0ZWQ9dHJ1ZTtmb3IodmFyIGk9MDtpPGRpZ2l0cy5sZW5ndGg7aSsrKXt2YXIgdG9wPXJlc3RyaWN0ZWQ/ZGlnaXRzW2ldOkJBU0U7dmFyIGRpZ2l0PXRydW5jYXRlKE1hdGgucmFuZG9tKCkqdG9wKTtyZXN1bHQucHVzaChkaWdpdCk7aWYoZGlnaXQ8dG9wKXJlc3RyaWN0ZWQ9ZmFsc2V9cmV0dXJuIGxvdy5hZGQoSW50ZWdlci5mcm9tQXJyYXkocmVzdWx0LEJBU0UsZmFsc2UpKX12YXIgcGFyc2VCYXNlPWZ1bmN0aW9uKHRleHQsYmFzZSxhbHBoYWJldCxjYXNlU2Vuc2l0aXZlKXthbHBoYWJldD1hbHBoYWJldHx8REVGQVVMVF9BTFBIQUJFVDt0ZXh0PVN0cmluZyh0ZXh0KTtpZighY2FzZVNlbnNpdGl2ZSl7dGV4dD10ZXh0LnRvTG93ZXJDYXNlKCk7YWxwaGFiZXQ9YWxwaGFiZXQudG9Mb3dlckNhc2UoKX12YXIgbGVuZ3RoPXRleHQubGVuZ3RoO3ZhciBpO3ZhciBhYnNCYXNlPU1hdGguYWJzKGJhc2UpO3ZhciBhbHBoYWJldFZhbHVlcz17fTtmb3IoaT0wO2k8YWxwaGFiZXQubGVuZ3RoO2krKyl7YWxwaGFiZXRWYWx1ZXNbYWxwaGFiZXRbaV1dPWl9Zm9yKGk9MDtpPGxlbmd0aDtpKyspe3ZhciBjPXRleHRbaV07aWYoYz09PSItIiljb250aW51ZTtpZihjIGluIGFscGhhYmV0VmFsdWVzKXtpZihhbHBoYWJldFZhbHVlc1tjXT49YWJzQmFzZSl7aWYoYz09PSIxIiYmYWJzQmFzZT09PTEpY29udGludWU7dGhyb3cgbmV3IEVycm9yKGMrIiBpcyBub3QgYSB2YWxpZCBkaWdpdCBpbiBiYXNlICIrYmFzZSsiLiIpfX19YmFzZT1wYXJzZVZhbHVlKGJhc2UpO3ZhciBkaWdpdHM9W107dmFyIGlzTmVnYXRpdmU9dGV4dFswXT09PSItIjtmb3IoaT1pc05lZ2F0aXZlPzE6MDtpPHRleHQubGVuZ3RoO2krKyl7dmFyIGM9dGV4dFtpXTtpZihjIGluIGFscGhhYmV0VmFsdWVzKWRpZ2l0cy5wdXNoKHBhcnNlVmFsdWUoYWxwaGFiZXRWYWx1ZXNbY10pKTtlbHNlIGlmKGM9PT0iPCIpe3ZhciBzdGFydD1pO2Rve2krK313aGlsZSh0ZXh0W2ldIT09Ij4iJiZpPHRleHQubGVuZ3RoKTtkaWdpdHMucHVzaChwYXJzZVZhbHVlKHRleHQuc2xpY2Uoc3RhcnQrMSxpKSkpfWVsc2UgdGhyb3cgbmV3IEVycm9yKGMrIiBpcyBub3QgYSB2YWxpZCBjaGFyYWN0ZXIiKX1yZXR1cm4gcGFyc2VCYXNlRnJvbUFycmF5KGRpZ2l0cyxiYXNlLGlzTmVnYXRpdmUpfTtmdW5jdGlvbiBwYXJzZUJhc2VGcm9tQXJyYXkoZGlnaXRzLGJhc2UsaXNOZWdhdGl2ZSl7dmFyIHZhbD1JbnRlZ2VyWzBdLHBvdz1JbnRlZ2VyWzFdLGk7Zm9yKGk9ZGlnaXRzLmxlbmd0aC0xO2k+PTA7aS0tKXt2YWw9dmFsLmFkZChkaWdpdHNbaV0udGltZXMocG93KSk7cG93PXBvdy50aW1lcyhiYXNlKX1yZXR1cm4gaXNOZWdhdGl2ZT92YWwubmVnYXRlKCk6dmFsfWZ1bmN0aW9uIHN0cmluZ2lmeShkaWdpdCxhbHBoYWJldCl7YWxwaGFiZXQ9YWxwaGFiZXR8fERFRkFVTFRfQUxQSEFCRVQ7aWYoZGlnaXQ8YWxwaGFiZXQubGVuZ3RoKXtyZXR1cm4gYWxwaGFiZXRbZGlnaXRdfXJldHVybiI8IitkaWdpdCsiPiJ9ZnVuY3Rpb24gdG9CYXNlKG4sYmFzZSl7YmFzZT1iaWdJbnQoYmFzZSk7aWYoYmFzZS5pc1plcm8oKSl7aWYobi5pc1plcm8oKSlyZXR1cm57dmFsdWU6WzBdLGlzTmVnYXRpdmU6ZmFsc2V9O3Rocm93IG5ldyBFcnJvcigiQ2Fubm90IGNvbnZlcnQgbm9uemVybyBudW1iZXJzIHRvIGJhc2UgMC4iKX1pZihiYXNlLmVxdWFscygtMSkpe2lmKG4uaXNaZXJvKCkpcmV0dXJue3ZhbHVlOlswXSxpc05lZ2F0aXZlOmZhbHNlfTtpZihuLmlzTmVnYXRpdmUoKSlyZXR1cm57dmFsdWU6W10uY29uY2F0LmFwcGx5KFtdLEFycmF5LmFwcGx5KG51bGwsQXJyYXkoLW4udG9KU051bWJlcigpKSkubWFwKEFycmF5LnByb3RvdHlwZS52YWx1ZU9mLFsxLDBdKSksaXNOZWdhdGl2ZTpmYWxzZX07dmFyIGFycj1BcnJheS5hcHBseShudWxsLEFycmF5KG4udG9KU051bWJlcigpLTEpKS5tYXAoQXJyYXkucHJvdG90eXBlLnZhbHVlT2YsWzAsMV0pO2Fyci51bnNoaWZ0KFsxXSk7cmV0dXJue3ZhbHVlOltdLmNvbmNhdC5hcHBseShbXSxhcnIpLGlzTmVnYXRpdmU6ZmFsc2V9fXZhciBuZWc9ZmFsc2U7aWYobi5pc05lZ2F0aXZlKCkmJmJhc2UuaXNQb3NpdGl2ZSgpKXtuZWc9dHJ1ZTtuPW4uYWJzKCl9aWYoYmFzZS5pc1VuaXQoKSl7aWYobi5pc1plcm8oKSlyZXR1cm57dmFsdWU6WzBdLGlzTmVnYXRpdmU6ZmFsc2V9O3JldHVybnt2YWx1ZTpBcnJheS5hcHBseShudWxsLEFycmF5KG4udG9KU051bWJlcigpKSkubWFwKE51bWJlci5wcm90b3R5cGUudmFsdWVPZiwxKSxpc05lZ2F0aXZlOm5lZ319dmFyIG91dD1bXTt2YXIgbGVmdD1uLGRpdm1vZDt3aGlsZShsZWZ0LmlzTmVnYXRpdmUoKXx8bGVmdC5jb21wYXJlQWJzKGJhc2UpPj0wKXtkaXZtb2Q9bGVmdC5kaXZtb2QoYmFzZSk7bGVmdD1kaXZtb2QucXVvdGllbnQ7dmFyIGRpZ2l0PWRpdm1vZC5yZW1haW5kZXI7aWYoZGlnaXQuaXNOZWdhdGl2ZSgpKXtkaWdpdD1iYXNlLm1pbnVzKGRpZ2l0KS5hYnMoKTtsZWZ0PWxlZnQubmV4dCgpfW91dC5wdXNoKGRpZ2l0LnRvSlNOdW1iZXIoKSl9b3V0LnB1c2gobGVmdC50b0pTTnVtYmVyKCkpO3JldHVybnt2YWx1ZTpvdXQucmV2ZXJzZSgpLGlzTmVnYXRpdmU6bmVnfX1mdW5jdGlvbiB0b0Jhc2VTdHJpbmcobixiYXNlLGFscGhhYmV0KXt2YXIgYXJyPXRvQmFzZShuLGJhc2UpO3JldHVybihhcnIuaXNOZWdhdGl2ZT8iLSI6IiIpK2Fyci52YWx1ZS5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHN0cmluZ2lmeSh4LGFscGhhYmV0KX0pLmpvaW4oIiIpfUJpZ0ludGVnZXIucHJvdG90eXBlLnRvQXJyYXk9ZnVuY3Rpb24ocmFkaXgpe3JldHVybiB0b0Jhc2UodGhpcyxyYWRpeCl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUudG9BcnJheT1mdW5jdGlvbihyYWRpeCl7cmV0dXJuIHRvQmFzZSh0aGlzLHJhZGl4KX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS50b0FycmF5PWZ1bmN0aW9uKHJhZGl4KXtyZXR1cm4gdG9CYXNlKHRoaXMscmFkaXgpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbihyYWRpeCxhbHBoYWJldCl7aWYocmFkaXg9PT11bmRlZmluZWQpcmFkaXg9MTA7aWYocmFkaXghPT0xMClyZXR1cm4gdG9CYXNlU3RyaW5nKHRoaXMscmFkaXgsYWxwaGFiZXQpO3ZhciB2PXRoaXMudmFsdWUsbD12Lmxlbmd0aCxzdHI9U3RyaW5nKHZbLS1sXSksemVyb3M9IjAwMDAwMDAiLGRpZ2l0O3doaWxlKC0tbD49MCl7ZGlnaXQ9U3RyaW5nKHZbbF0pO3N0cis9emVyb3Muc2xpY2UoZGlnaXQubGVuZ3RoKStkaWdpdH12YXIgc2lnbj10aGlzLnNpZ24/Ii0iOiIiO3JldHVybiBzaWduK3N0cn07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbihyYWRpeCxhbHBoYWJldCl7aWYocmFkaXg9PT11bmRlZmluZWQpcmFkaXg9MTA7aWYocmFkaXghPTEwKXJldHVybiB0b0Jhc2VTdHJpbmcodGhpcyxyYWRpeCxhbHBoYWJldCk7cmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS50b1N0cmluZz1TbWFsbEludGVnZXIucHJvdG90eXBlLnRvU3RyaW5nO05hdGl2ZUJpZ0ludC5wcm90b3R5cGUudG9KU09OPUJpZ0ludGVnZXIucHJvdG90eXBlLnRvSlNPTj1TbWFsbEludGVnZXIucHJvdG90eXBlLnRvSlNPTj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRvU3RyaW5nKCl9O0JpZ0ludGVnZXIucHJvdG90eXBlLnZhbHVlT2Y9ZnVuY3Rpb24oKXtyZXR1cm4gcGFyc2VJbnQodGhpcy50b1N0cmluZygpLDEwKX07QmlnSW50ZWdlci5wcm90b3R5cGUudG9KU051bWJlcj1CaWdJbnRlZ2VyLnByb3RvdHlwZS52YWx1ZU9mO1NtYWxsSW50ZWdlci5wcm90b3R5cGUudmFsdWVPZj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZhbHVlfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnRvSlNOdW1iZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS52YWx1ZU9mO05hdGl2ZUJpZ0ludC5wcm90b3R5cGUudmFsdWVPZj1OYXRpdmVCaWdJbnQucHJvdG90eXBlLnRvSlNOdW1iZXI9ZnVuY3Rpb24oKXtyZXR1cm4gcGFyc2VJbnQodGhpcy50b1N0cmluZygpLDEwKX07ZnVuY3Rpb24gcGFyc2VTdHJpbmdWYWx1ZSh2KXtpZihpc1ByZWNpc2UoK3YpKXt2YXIgeD0rdjtpZih4PT09dHJ1bmNhdGUoeCkpcmV0dXJuIHN1cHBvcnRzTmF0aXZlQmlnSW50P25ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHgpKTpuZXcgU21hbGxJbnRlZ2VyKHgpO3Rocm93IG5ldyBFcnJvcigiSW52YWxpZCBpbnRlZ2VyOiAiK3YpfXZhciBzaWduPXZbMF09PT0iLSI7aWYoc2lnbil2PXYuc2xpY2UoMSk7dmFyIHNwbGl0PXYuc3BsaXQoL2UvaSk7aWYoc3BsaXQubGVuZ3RoPjIpdGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIGludGVnZXI6ICIrc3BsaXQuam9pbigiZSIpKTtpZihzcGxpdC5sZW5ndGg9PT0yKXt2YXIgZXhwPXNwbGl0WzFdO2lmKGV4cFswXT09PSIrIilleHA9ZXhwLnNsaWNlKDEpO2V4cD0rZXhwO2lmKGV4cCE9PXRydW5jYXRlKGV4cCl8fCFpc1ByZWNpc2UoZXhwKSl0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgaW50ZWdlcjogIitleHArIiBpcyBub3QgYSB2YWxpZCBleHBvbmVudC4iKTt2YXIgdGV4dD1zcGxpdFswXTt2YXIgZGVjaW1hbFBsYWNlPXRleHQuaW5kZXhPZigiLiIpO2lmKGRlY2ltYWxQbGFjZT49MCl7ZXhwLT10ZXh0Lmxlbmd0aC1kZWNpbWFsUGxhY2UtMTt0ZXh0PXRleHQuc2xpY2UoMCxkZWNpbWFsUGxhY2UpK3RleHQuc2xpY2UoZGVjaW1hbFBsYWNlKzEpfWlmKGV4cDwwKXRocm93IG5ldyBFcnJvcigiQ2Fubm90IGluY2x1ZGUgbmVnYXRpdmUgZXhwb25lbnQgcGFydCBmb3IgaW50ZWdlcnMiKTt0ZXh0Kz1uZXcgQXJyYXkoZXhwKzEpLmpvaW4oIjAiKTt2PXRleHR9dmFyIGlzVmFsaWQ9L14oWzAtOV1bMC05XSopJC8udGVzdCh2KTtpZighaXNWYWxpZCl0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgaW50ZWdlcjogIit2KTtpZihzdXBwb3J0c05hdGl2ZUJpZ0ludCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHNpZ24/Ii0iK3Y6dikpfXZhciByPVtdLG1heD12Lmxlbmd0aCxsPUxPR19CQVNFLG1pbj1tYXgtbDt3aGlsZShtYXg+MCl7ci5wdXNoKCt2LnNsaWNlKG1pbixtYXgpKTttaW4tPWw7aWYobWluPDApbWluPTA7bWF4LT1sfXRyaW0ocik7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHIsc2lnbil9ZnVuY3Rpb24gcGFyc2VOdW1iZXJWYWx1ZSh2KXtpZihzdXBwb3J0c05hdGl2ZUJpZ0ludCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHYpKX1pZihpc1ByZWNpc2Uodikpe2lmKHYhPT10cnVuY2F0ZSh2KSl0aHJvdyBuZXcgRXJyb3IodisiIGlzIG5vdCBhbiBpbnRlZ2VyLiIpO3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKHYpfXJldHVybiBwYXJzZVN0cmluZ1ZhbHVlKHYudG9TdHJpbmcoKSl9ZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KXtpZih0eXBlb2Ygdj09PSJudW1iZXIiKXtyZXR1cm4gcGFyc2VOdW1iZXJWYWx1ZSh2KX1pZih0eXBlb2Ygdj09PSJzdHJpbmciKXtyZXR1cm4gcGFyc2VTdHJpbmdWYWx1ZSh2KX1pZih0eXBlb2Ygdj09PSJiaWdpbnQiKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh2KX1yZXR1cm4gdn1mb3IodmFyIGk9MDtpPDFlMztpKyspe0ludGVnZXJbaV09cGFyc2VWYWx1ZShpKTtpZihpPjApSW50ZWdlclstaV09cGFyc2VWYWx1ZSgtaSl9SW50ZWdlci5vbmU9SW50ZWdlclsxXTtJbnRlZ2VyLnplcm89SW50ZWdlclswXTtJbnRlZ2VyLm1pbnVzT25lPUludGVnZXJbLTFdO0ludGVnZXIubWF4PW1heDtJbnRlZ2VyLm1pbj1taW47SW50ZWdlci5nY2Q9Z2NkO0ludGVnZXIubGNtPWxjbTtJbnRlZ2VyLmlzSW5zdGFuY2U9ZnVuY3Rpb24oeCl7cmV0dXJuIHggaW5zdGFuY2VvZiBCaWdJbnRlZ2VyfHx4IGluc3RhbmNlb2YgU21hbGxJbnRlZ2VyfHx4IGluc3RhbmNlb2YgTmF0aXZlQmlnSW50fTtJbnRlZ2VyLnJhbmRCZXR3ZWVuPXJhbmRCZXR3ZWVuO0ludGVnZXIuZnJvbUFycmF5PWZ1bmN0aW9uKGRpZ2l0cyxiYXNlLGlzTmVnYXRpdmUpe3JldHVybiBwYXJzZUJhc2VGcm9tQXJyYXkoZGlnaXRzLm1hcChwYXJzZVZhbHVlKSxwYXJzZVZhbHVlKGJhc2V8fDEwKSxpc05lZ2F0aXZlKX07cmV0dXJuIEludGVnZXJ9KCk7aWYodHlwZW9mIG1vZHVsZSE9PSJ1bmRlZmluZWQiJiZtb2R1bGUuaGFzT3duUHJvcGVydHkoImV4cG9ydHMiKSl7bW9kdWxlLmV4cG9ydHM9YmlnSW50fWlmKHR5cGVvZiBkZWZpbmU9PT0iZnVuY3Rpb24iJiZkZWZpbmUuYW1kKXtkZWZpbmUoImJpZy1pbnRlZ2VyIixbXSxmdW5jdGlvbigpe3JldHVybiBiaWdJbnR9KX19LHt9XSwyNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7fSx7fV0sMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpeyJ1c2Ugc3RyaWN0Ijt2YXIgYmFzZTY0PXJlcXVpcmUoImJhc2U2NC1qcyIpO3ZhciBpZWVlNzU0PXJlcXVpcmUoImllZWU3NTQiKTtleHBvcnRzLkJ1ZmZlcj1CdWZmZXI7ZXhwb3J0cy5TbG93QnVmZmVyPVNsb3dCdWZmZXI7ZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUz01MDt2YXIgS19NQVhfTEVOR1RIPTIxNDc0ODM2NDc7ZXhwb3J0cy5rTWF4TGVuZ3RoPUtfTUFYX0xFTkdUSDtCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVD10eXBlZEFycmF5U3VwcG9ydCgpO2lmKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCYmdHlwZW9mIGNvbnNvbGUhPT0idW5kZWZpbmVkIiYmdHlwZW9mIGNvbnNvbGUuZXJyb3I9PT0iZnVuY3Rpb24iKXtjb25zb2xlLmVycm9yKCJUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgIisiYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4iKX1mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCgpe3RyeXt2YXIgYXJyPW5ldyBVaW50OEFycmF5KDEpO2Fyci5fX3Byb3RvX189e19fcHJvdG9fXzpVaW50OEFycmF5LnByb3RvdHlwZSxmb286ZnVuY3Rpb24oKXtyZXR1cm4gNDJ9fTtyZXR1cm4gYXJyLmZvbygpPT09NDJ9Y2F0Y2goZSl7cmV0dXJuIGZhbHNlfX1PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwicGFyZW50Iix7ZW51bWVyYWJsZTp0cnVlLGdldDpmdW5jdGlvbigpe2lmKCFCdWZmZXIuaXNCdWZmZXIodGhpcykpcmV0dXJuIHVuZGVmaW5lZDtyZXR1cm4gdGhpcy5idWZmZXJ9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsIm9mZnNldCIse2VudW1lcmFibGU6dHJ1ZSxnZXQ6ZnVuY3Rpb24oKXtpZighQnVmZmVyLmlzQnVmZmVyKHRoaXMpKXJldHVybiB1bmRlZmluZWQ7cmV0dXJuIHRoaXMuYnl0ZU9mZnNldH19KTtmdW5jdGlvbiBjcmVhdGVCdWZmZXIobGVuZ3RoKXtpZihsZW5ndGg+S19NQVhfTEVOR1RIKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlICInK2xlbmd0aCsnIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gInNpemUiJyl9dmFyIGJ1Zj1uZXcgVWludDhBcnJheShsZW5ndGgpO2J1Zi5fX3Byb3RvX189QnVmZmVyLnByb3RvdHlwZTtyZXR1cm4gYnVmfWZ1bmN0aW9uIEJ1ZmZlcihhcmcsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpe2lmKHR5cGVvZiBhcmc9PT0ibnVtYmVyIil7aWYodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQ9PT0ic3RyaW5nIil7dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlICJzdHJpbmciIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuIFJlY2VpdmVkIHR5cGUgbnVtYmVyJyl9cmV0dXJuIGFsbG9jVW5zYWZlKGFyZyl9cmV0dXJuIGZyb20oYXJnLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX1pZih0eXBlb2YgU3ltYm9sIT09InVuZGVmaW5lZCImJlN5bWJvbC5zcGVjaWVzIT1udWxsJiZCdWZmZXJbU3ltYm9sLnNwZWNpZXNdPT09QnVmZmVyKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLFN5bWJvbC5zcGVjaWVzLHt2YWx1ZTpudWxsLGNvbmZpZ3VyYWJsZTp0cnVlLGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6ZmFsc2V9KX1CdWZmZXIucG9vbFNpemU9ODE5MjtmdW5jdGlvbiBmcm9tKHZhbHVlLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtpZih0eXBlb2YgdmFsdWU9PT0ic3RyaW5nIil7cmV0dXJuIGZyb21TdHJpbmcodmFsdWUsZW5jb2RpbmdPck9mZnNldCl9aWYoQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSl7cmV0dXJuIGZyb21BcnJheUxpa2UodmFsdWUpfWlmKHZhbHVlPT1udWxsKXt0aHJvdyBUeXBlRXJyb3IoIlRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICIrIm9yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICIrdHlwZW9mIHZhbHVlKX1pZihpc0luc3RhbmNlKHZhbHVlLEFycmF5QnVmZmVyKXx8dmFsdWUmJmlzSW5zdGFuY2UodmFsdWUuYnVmZmVyLEFycmF5QnVmZmVyKSl7cmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9aWYodHlwZW9mIHZhbHVlPT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSAidmFsdWUiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlIG51bWJlcicpfXZhciB2YWx1ZU9mPXZhbHVlLnZhbHVlT2YmJnZhbHVlLnZhbHVlT2YoKTtpZih2YWx1ZU9mIT1udWxsJiZ2YWx1ZU9mIT09dmFsdWUpe3JldHVybiBCdWZmZXIuZnJvbSh2YWx1ZU9mLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX12YXIgYj1mcm9tT2JqZWN0KHZhbHVlKTtpZihiKXJldHVybiBiO2lmKHR5cGVvZiBTeW1ib2whPT0idW5kZWZpbmVkIiYmU3ltYm9sLnRvUHJpbWl0aXZlIT1udWxsJiZ0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXT09PSJmdW5jdGlvbiIpe3JldHVybiBCdWZmZXIuZnJvbSh2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdKCJzdHJpbmciKSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9dGhyb3cgbmV3IFR5cGVFcnJvcigiVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgIisib3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgIit0eXBlb2YgdmFsdWUpfUJ1ZmZlci5mcm9tPWZ1bmN0aW9uKHZhbHVlLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtyZXR1cm4gZnJvbSh2YWx1ZSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9O0J1ZmZlci5wcm90b3R5cGUuX19wcm90b19fPVVpbnQ4QXJyYXkucHJvdG90eXBlO0J1ZmZlci5fX3Byb3RvX189VWludDhBcnJheTtmdW5jdGlvbiBhc3NlcnRTaXplKHNpemUpe2lmKHR5cGVvZiBzaXplIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJzaXplIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJyl9ZWxzZSBpZihzaXplPDApe3Rocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgIicrc2l6ZSsnIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gInNpemUiJyl9fWZ1bmN0aW9uIGFsbG9jKHNpemUsZmlsbCxlbmNvZGluZyl7YXNzZXJ0U2l6ZShzaXplKTtpZihzaXplPD0wKXtyZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpfWlmKGZpbGwhPT11bmRlZmluZWQpe3JldHVybiB0eXBlb2YgZW5jb2Rpbmc9PT0ic3RyaW5nIj9jcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLGVuY29kaW5nKTpjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsKX1yZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpfUJ1ZmZlci5hbGxvYz1mdW5jdGlvbihzaXplLGZpbGwsZW5jb2Rpbmcpe3JldHVybiBhbGxvYyhzaXplLGZpbGwsZW5jb2RpbmcpfTtmdW5jdGlvbiBhbGxvY1Vuc2FmZShzaXplKXthc3NlcnRTaXplKHNpemUpO3JldHVybiBjcmVhdGVCdWZmZXIoc2l6ZTwwPzA6Y2hlY2tlZChzaXplKXwwKX1CdWZmZXIuYWxsb2NVbnNhZmU9ZnVuY3Rpb24oc2l6ZSl7cmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpfTtCdWZmZXIuYWxsb2NVbnNhZmVTbG93PWZ1bmN0aW9uKHNpemUpe3JldHVybiBhbGxvY1Vuc2FmZShzaXplKX07ZnVuY3Rpb24gZnJvbVN0cmluZyhzdHJpbmcsZW5jb2Rpbmcpe2lmKHR5cGVvZiBlbmNvZGluZyE9PSJzdHJpbmcifHxlbmNvZGluZz09PSIiKXtlbmNvZGluZz0idXRmOCJ9aWYoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSl7dGhyb3cgbmV3IFR5cGVFcnJvcigiVW5rbm93biBlbmNvZGluZzogIitlbmNvZGluZyl9dmFyIGxlbmd0aD1ieXRlTGVuZ3RoKHN0cmluZyxlbmNvZGluZyl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW5ndGgpO3ZhciBhY3R1YWw9YnVmLndyaXRlKHN0cmluZyxlbmNvZGluZyk7aWYoYWN0dWFsIT09bGVuZ3RoKXtidWY9YnVmLnNsaWNlKDAsYWN0dWFsKX1yZXR1cm4gYnVmfWZ1bmN0aW9uIGZyb21BcnJheUxpa2UoYXJyYXkpe3ZhciBsZW5ndGg9YXJyYXkubGVuZ3RoPDA/MDpjaGVja2VkKGFycmF5Lmxlbmd0aCl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW5ndGgpO2Zvcih2YXIgaT0wO2k8bGVuZ3RoO2krPTEpe2J1ZltpXT1hcnJheVtpXSYyNTV9cmV0dXJuIGJ1Zn1mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIoYXJyYXksYnl0ZU9mZnNldCxsZW5ndGgpe2lmKGJ5dGVPZmZzZXQ8MHx8YXJyYXkuYnl0ZUxlbmd0aDxieXRlT2Zmc2V0KXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignIm9mZnNldCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJyl9aWYoYXJyYXkuYnl0ZUxlbmd0aDxieXRlT2Zmc2V0KyhsZW5ndGh8fDApKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignImxlbmd0aCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJyl9dmFyIGJ1ZjtpZihieXRlT2Zmc2V0PT09dW5kZWZpbmVkJiZsZW5ndGg9PT11bmRlZmluZWQpe2J1Zj1uZXcgVWludDhBcnJheShhcnJheSl9ZWxzZSBpZihsZW5ndGg9PT11bmRlZmluZWQpe2J1Zj1uZXcgVWludDhBcnJheShhcnJheSxieXRlT2Zmc2V0KX1lbHNle2J1Zj1uZXcgVWludDhBcnJheShhcnJheSxieXRlT2Zmc2V0LGxlbmd0aCl9YnVmLl9fcHJvdG9fXz1CdWZmZXIucHJvdG90eXBlO3JldHVybiBidWZ9ZnVuY3Rpb24gZnJvbU9iamVjdChvYmope2lmKEJ1ZmZlci5pc0J1ZmZlcihvYmopKXt2YXIgbGVuPWNoZWNrZWQob2JqLmxlbmd0aCl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW4pO2lmKGJ1Zi5sZW5ndGg9PT0wKXtyZXR1cm4gYnVmfW9iai5jb3B5KGJ1ZiwwLDAsbGVuKTtyZXR1cm4gYnVmfWlmKG9iai5sZW5ndGghPT11bmRlZmluZWQpe2lmKHR5cGVvZiBvYmoubGVuZ3RoIT09Im51bWJlciJ8fG51bWJlcklzTmFOKG9iai5sZW5ndGgpKXtyZXR1cm4gY3JlYXRlQnVmZmVyKDApfXJldHVybiBmcm9tQXJyYXlMaWtlKG9iail9aWYob2JqLnR5cGU9PT0iQnVmZmVyIiYmQXJyYXkuaXNBcnJheShvYmouZGF0YSkpe3JldHVybiBmcm9tQXJyYXlMaWtlKG9iai5kYXRhKX19ZnVuY3Rpb24gY2hlY2tlZChsZW5ndGgpe2lmKGxlbmd0aD49S19NQVhfTEVOR1RIKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcigiQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAiKyJzaXplOiAweCIrS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSsiIGJ5dGVzIil9cmV0dXJuIGxlbmd0aHwwfWZ1bmN0aW9uIFNsb3dCdWZmZXIobGVuZ3RoKXtpZigrbGVuZ3RoIT1sZW5ndGgpe2xlbmd0aD0wfXJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aCl9QnVmZmVyLmlzQnVmZmVyPWZ1bmN0aW9uIGlzQnVmZmVyKGIpe3JldHVybiBiIT1udWxsJiZiLl9pc0J1ZmZlcj09PXRydWUmJmIhPT1CdWZmZXIucHJvdG90eXBlfTtCdWZmZXIuY29tcGFyZT1mdW5jdGlvbiBjb21wYXJlKGEsYil7aWYoaXNJbnN0YW5jZShhLFVpbnQ4QXJyYXkpKWE9QnVmZmVyLmZyb20oYSxhLm9mZnNldCxhLmJ5dGVMZW5ndGgpO2lmKGlzSW5zdGFuY2UoYixVaW50OEFycmF5KSliPUJ1ZmZlci5mcm9tKGIsYi5vZmZzZXQsYi5ieXRlTGVuZ3RoKTtpZighQnVmZmVyLmlzQnVmZmVyKGEpfHwhQnVmZmVyLmlzQnVmZmVyKGIpKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgImJ1ZjEiLCAiYnVmMiIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknKX1pZihhPT09YilyZXR1cm4gMDt2YXIgeD1hLmxlbmd0aDt2YXIgeT1iLmxlbmd0aDtmb3IodmFyIGk9MCxsZW49TWF0aC5taW4oeCx5KTtpPGxlbjsrK2kpe2lmKGFbaV0hPT1iW2ldKXt4PWFbaV07eT1iW2ldO2JyZWFrfX1pZih4PHkpcmV0dXJuLTE7aWYoeTx4KXJldHVybiAxO3JldHVybiAwfTtCdWZmZXIuaXNFbmNvZGluZz1mdW5jdGlvbiBpc0VuY29kaW5nKGVuY29kaW5nKXtzd2l0Y2goU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKXtjYXNlImhleCI6Y2FzZSJ1dGY4IjpjYXNlInV0Zi04IjpjYXNlImFzY2lpIjpjYXNlImxhdGluMSI6Y2FzZSJiaW5hcnkiOmNhc2UiYmFzZTY0IjpjYXNlInVjczIiOmNhc2UidWNzLTIiOmNhc2UidXRmMTZsZSI6Y2FzZSJ1dGYtMTZsZSI6cmV0dXJuIHRydWU7ZGVmYXVsdDpyZXR1cm4gZmFsc2V9fTtCdWZmZXIuY29uY2F0PWZ1bmN0aW9uIGNvbmNhdChsaXN0LGxlbmd0aCl7aWYoIUFycmF5LmlzQXJyYXkobGlzdCkpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJsaXN0IiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKX1pZihsaXN0Lmxlbmd0aD09PTApe3JldHVybiBCdWZmZXIuYWxsb2MoMCl9dmFyIGk7aWYobGVuZ3RoPT09dW5kZWZpbmVkKXtsZW5ndGg9MDtmb3IoaT0wO2k8bGlzdC5sZW5ndGg7KytpKXtsZW5ndGgrPWxpc3RbaV0ubGVuZ3RofX12YXIgYnVmZmVyPUJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpO3ZhciBwb3M9MDtmb3IoaT0wO2k8bGlzdC5sZW5ndGg7KytpKXt2YXIgYnVmPWxpc3RbaV07aWYoaXNJbnN0YW5jZShidWYsVWludDhBcnJheSkpe2J1Zj1CdWZmZXIuZnJvbShidWYpfWlmKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSl7dGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3QiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpfWJ1Zi5jb3B5KGJ1ZmZlcixwb3MpO3Bvcys9YnVmLmxlbmd0aH1yZXR1cm4gYnVmZmVyfTtmdW5jdGlvbiBieXRlTGVuZ3RoKHN0cmluZyxlbmNvZGluZyl7aWYoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpe3JldHVybiBzdHJpbmcubGVuZ3RofWlmKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpfHxpc0luc3RhbmNlKHN0cmluZyxBcnJheUJ1ZmZlcikpe3JldHVybiBzdHJpbmcuYnl0ZUxlbmd0aH1pZih0eXBlb2Ygc3RyaW5nIT09InN0cmluZyIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSAic3RyaW5nIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBvciBBcnJheUJ1ZmZlci4gJysiUmVjZWl2ZWQgdHlwZSAiK3R5cGVvZiBzdHJpbmcpfXZhciBsZW49c3RyaW5nLmxlbmd0aDt2YXIgbXVzdE1hdGNoPWFyZ3VtZW50cy5sZW5ndGg+MiYmYXJndW1lbnRzWzJdPT09dHJ1ZTtpZighbXVzdE1hdGNoJiZsZW49PT0wKXJldHVybiAwO3ZhciBsb3dlcmVkQ2FzZT1mYWxzZTtmb3IoOzspe3N3aXRjaChlbmNvZGluZyl7Y2FzZSJhc2NpaSI6Y2FzZSJsYXRpbjEiOmNhc2UiYmluYXJ5IjpyZXR1cm4gbGVuO2Nhc2UidXRmOCI6Y2FzZSJ1dGYtOCI6cmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoO2Nhc2UidWNzMiI6Y2FzZSJ1Y3MtMiI6Y2FzZSJ1dGYxNmxlIjpjYXNlInV0Zi0xNmxlIjpyZXR1cm4gbGVuKjI7Y2FzZSJoZXgiOnJldHVybiBsZW4+Pj4xO2Nhc2UiYmFzZTY0IjpyZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aDtkZWZhdWx0OmlmKGxvd2VyZWRDYXNlKXtyZXR1cm4gbXVzdE1hdGNoPy0xOnV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RofWVuY29kaW5nPSgiIitlbmNvZGluZykudG9Mb3dlckNhc2UoKTtsb3dlcmVkQ2FzZT10cnVlfX19QnVmZmVyLmJ5dGVMZW5ndGg9Ynl0ZUxlbmd0aDtmdW5jdGlvbiBzbG93VG9TdHJpbmcoZW5jb2Rpbmcsc3RhcnQsZW5kKXt2YXIgbG93ZXJlZENhc2U9ZmFsc2U7aWYoc3RhcnQ9PT11bmRlZmluZWR8fHN0YXJ0PDApe3N0YXJ0PTB9aWYoc3RhcnQ+dGhpcy5sZW5ndGgpe3JldHVybiIifWlmKGVuZD09PXVuZGVmaW5lZHx8ZW5kPnRoaXMubGVuZ3RoKXtlbmQ9dGhpcy5sZW5ndGh9aWYoZW5kPD0wKXtyZXR1cm4iIn1lbmQ+Pj49MDtzdGFydD4+Pj0wO2lmKGVuZDw9c3RhcnQpe3JldHVybiIifWlmKCFlbmNvZGluZyllbmNvZGluZz0idXRmOCI7d2hpbGUodHJ1ZSl7c3dpdGNoKGVuY29kaW5nKXtjYXNlImhleCI6cmV0dXJuIGhleFNsaWNlKHRoaXMsc3RhcnQsZW5kKTtjYXNlInV0ZjgiOmNhc2UidXRmLTgiOnJldHVybiB1dGY4U2xpY2UodGhpcyxzdGFydCxlbmQpO2Nhc2UiYXNjaWkiOnJldHVybiBhc2NpaVNsaWNlKHRoaXMsc3RhcnQsZW5kKTtjYXNlImxhdGluMSI6Y2FzZSJiaW5hcnkiOnJldHVybiBsYXRpbjFTbGljZSh0aGlzLHN0YXJ0LGVuZCk7Y2FzZSJiYXNlNjQiOnJldHVybiBiYXNlNjRTbGljZSh0aGlzLHN0YXJ0LGVuZCk7Y2FzZSJ1Y3MyIjpjYXNlInVjcy0yIjpjYXNlInV0ZjE2bGUiOmNhc2UidXRmLTE2bGUiOnJldHVybiB1dGYxNmxlU2xpY2UodGhpcyxzdGFydCxlbmQpO2RlZmF1bHQ6aWYobG93ZXJlZENhc2UpdGhyb3cgbmV3IFR5cGVFcnJvcigiVW5rbm93biBlbmNvZGluZzogIitlbmNvZGluZyk7ZW5jb2Rpbmc9KGVuY29kaW5nKyIiKS50b0xvd2VyQ2FzZSgpO2xvd2VyZWRDYXNlPXRydWV9fX1CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlcj10cnVlO2Z1bmN0aW9uIHN3YXAoYixuLG0pe3ZhciBpPWJbbl07YltuXT1iW21dO2JbbV09aX1CdWZmZXIucHJvdG90eXBlLnN3YXAxNj1mdW5jdGlvbiBzd2FwMTYoKXt2YXIgbGVuPXRoaXMubGVuZ3RoO2lmKGxlbiUyIT09MCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkJ1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzIil9Zm9yKHZhciBpPTA7aTxsZW47aSs9Mil7c3dhcCh0aGlzLGksaSsxKX1yZXR1cm4gdGhpc307QnVmZmVyLnByb3RvdHlwZS5zd2FwMzI9ZnVuY3Rpb24gc3dhcDMyKCl7dmFyIGxlbj10aGlzLmxlbmd0aDtpZihsZW4lNCE9PTApe3Rocm93IG5ldyBSYW5nZUVycm9yKCJCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cyIpfWZvcih2YXIgaT0wO2k8bGVuO2krPTQpe3N3YXAodGhpcyxpLGkrMyk7c3dhcCh0aGlzLGkrMSxpKzIpfXJldHVybiB0aGlzfTtCdWZmZXIucHJvdG90eXBlLnN3YXA2ND1mdW5jdGlvbiBzd2FwNjQoKXt2YXIgbGVuPXRoaXMubGVuZ3RoO2lmKGxlbiU4IT09MCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkJ1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzIil9Zm9yKHZhciBpPTA7aTxsZW47aSs9OCl7c3dhcCh0aGlzLGksaSs3KTtzd2FwKHRoaXMsaSsxLGkrNik7c3dhcCh0aGlzLGkrMixpKzUpO3N3YXAodGhpcyxpKzMsaSs0KX1yZXR1cm4gdGhpc307QnVmZmVyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbiB0b1N0cmluZygpe3ZhciBsZW5ndGg9dGhpcy5sZW5ndGg7aWYobGVuZ3RoPT09MClyZXR1cm4iIjtpZihhcmd1bWVudHMubGVuZ3RoPT09MClyZXR1cm4gdXRmOFNsaWNlKHRoaXMsMCxsZW5ndGgpO3JldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtCdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nPUJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmc7QnVmZmVyLnByb3RvdHlwZS5lcXVhbHM9ZnVuY3Rpb24gZXF1YWxzKGIpe2lmKCFCdWZmZXIuaXNCdWZmZXIoYikpdGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciIpO2lmKHRoaXM9PT1iKXJldHVybiB0cnVlO3JldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLGIpPT09MH07QnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0PWZ1bmN0aW9uIGluc3BlY3QoKXt2YXIgc3RyPSIiO3ZhciBtYXg9ZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUztzdHI9dGhpcy50b1N0cmluZygiaGV4IiwwLG1heCkucmVwbGFjZSgvKC57Mn0pL2csIiQxICIpLnRyaW0oKTtpZih0aGlzLmxlbmd0aD5tYXgpc3RyKz0iIC4uLiAiO3JldHVybiI8QnVmZmVyICIrc3RyKyI+In07QnVmZmVyLnByb3RvdHlwZS5jb21wYXJlPWZ1bmN0aW9uIGNvbXBhcmUodGFyZ2V0LHN0YXJ0LGVuZCx0aGlzU3RhcnQsdGhpc0VuZCl7aWYoaXNJbnN0YW5jZSh0YXJnZXQsVWludDhBcnJheSkpe3RhcmdldD1CdWZmZXIuZnJvbSh0YXJnZXQsdGFyZ2V0Lm9mZnNldCx0YXJnZXQuYnl0ZUxlbmd0aCl9aWYoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgInRhcmdldCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheS4gJysiUmVjZWl2ZWQgdHlwZSAiK3R5cGVvZiB0YXJnZXQpfWlmKHN0YXJ0PT09dW5kZWZpbmVkKXtzdGFydD0wfWlmKGVuZD09PXVuZGVmaW5lZCl7ZW5kPXRhcmdldD90YXJnZXQubGVuZ3RoOjB9aWYodGhpc1N0YXJ0PT09dW5kZWZpbmVkKXt0aGlzU3RhcnQ9MH1pZih0aGlzRW5kPT09dW5kZWZpbmVkKXt0aGlzRW5kPXRoaXMubGVuZ3RofWlmKHN0YXJ0PDB8fGVuZD50YXJnZXQubGVuZ3RofHx0aGlzU3RhcnQ8MHx8dGhpc0VuZD50aGlzLmxlbmd0aCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIm91dCBvZiByYW5nZSBpbmRleCIpfWlmKHRoaXNTdGFydD49dGhpc0VuZCYmc3RhcnQ+PWVuZCl7cmV0dXJuIDB9aWYodGhpc1N0YXJ0Pj10aGlzRW5kKXtyZXR1cm4tMX1pZihzdGFydD49ZW5kKXtyZXR1cm4gMX1zdGFydD4+Pj0wO2VuZD4+Pj0wO3RoaXNTdGFydD4+Pj0wO3RoaXNFbmQ+Pj49MDtpZih0aGlzPT09dGFyZ2V0KXJldHVybiAwO3ZhciB4PXRoaXNFbmQtdGhpc1N0YXJ0O3ZhciB5PWVuZC1zdGFydDt2YXIgbGVuPU1hdGgubWluKHgseSk7dmFyIHRoaXNDb3B5PXRoaXMuc2xpY2UodGhpc1N0YXJ0LHRoaXNFbmQpO3ZhciB0YXJnZXRDb3B5PXRhcmdldC5zbGljZShzdGFydCxlbmQpO2Zvcih2YXIgaT0wO2k8bGVuOysraSl7aWYodGhpc0NvcHlbaV0hPT10YXJnZXRDb3B5W2ldKXt4PXRoaXNDb3B5W2ldO3k9dGFyZ2V0Q29weVtpXTticmVha319aWYoeDx5KXJldHVybi0xO2lmKHk8eClyZXR1cm4gMTtyZXR1cm4gMH07ZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YoYnVmZmVyLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil7aWYoYnVmZmVyLmxlbmd0aD09PTApcmV0dXJuLTE7aWYodHlwZW9mIGJ5dGVPZmZzZXQ9PT0ic3RyaW5nIil7ZW5jb2Rpbmc9Ynl0ZU9mZnNldDtieXRlT2Zmc2V0PTB9ZWxzZSBpZihieXRlT2Zmc2V0PjIxNDc0ODM2NDcpe2J5dGVPZmZzZXQ9MjE0NzQ4MzY0N31lbHNlIGlmKGJ5dGVPZmZzZXQ8LTIxNDc0ODM2NDgpe2J5dGVPZmZzZXQ9LTIxNDc0ODM2NDh9Ynl0ZU9mZnNldD0rYnl0ZU9mZnNldDtpZihudW1iZXJJc05hTihieXRlT2Zmc2V0KSl7Ynl0ZU9mZnNldD1kaXI/MDpidWZmZXIubGVuZ3RoLTF9aWYoYnl0ZU9mZnNldDwwKWJ5dGVPZmZzZXQ9YnVmZmVyLmxlbmd0aCtieXRlT2Zmc2V0O2lmKGJ5dGVPZmZzZXQ+PWJ1ZmZlci5sZW5ndGgpe2lmKGRpcilyZXR1cm4tMTtlbHNlIGJ5dGVPZmZzZXQ9YnVmZmVyLmxlbmd0aC0xfWVsc2UgaWYoYnl0ZU9mZnNldDwwKXtpZihkaXIpYnl0ZU9mZnNldD0wO2Vsc2UgcmV0dXJuLTF9aWYodHlwZW9mIHZhbD09PSJzdHJpbmciKXt2YWw9QnVmZmVyLmZyb20odmFsLGVuY29kaW5nKX1pZihCdWZmZXIuaXNCdWZmZXIodmFsKSl7aWYodmFsLmxlbmd0aD09PTApe3JldHVybi0xfXJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil9ZWxzZSBpZih0eXBlb2YgdmFsPT09Im51bWJlciIpe3ZhbD12YWwmMjU1O2lmKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mPT09ImZ1bmN0aW9uIil7aWYoZGlyKXtyZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlcix2YWwsYnl0ZU9mZnNldCl9ZWxzZXtyZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsdmFsLGJ5dGVPZmZzZXQpfX1yZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlcixbdmFsXSxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil9dGhyb3cgbmV3IFR5cGVFcnJvcigidmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyIil9ZnVuY3Rpb24gYXJyYXlJbmRleE9mKGFycix2YWwsYnl0ZU9mZnNldCxlbmNvZGluZyxkaXIpe3ZhciBpbmRleFNpemU9MTt2YXIgYXJyTGVuZ3RoPWFyci5sZW5ndGg7dmFyIHZhbExlbmd0aD12YWwubGVuZ3RoO2lmKGVuY29kaW5nIT09dW5kZWZpbmVkKXtlbmNvZGluZz1TdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCk7aWYoZW5jb2Rpbmc9PT0idWNzMiJ8fGVuY29kaW5nPT09InVjcy0yInx8ZW5jb2Rpbmc9PT0idXRmMTZsZSJ8fGVuY29kaW5nPT09InV0Zi0xNmxlIil7aWYoYXJyLmxlbmd0aDwyfHx2YWwubGVuZ3RoPDIpe3JldHVybi0xfWluZGV4U2l6ZT0yO2Fyckxlbmd0aC89Mjt2YWxMZW5ndGgvPTI7Ynl0ZU9mZnNldC89Mn19ZnVuY3Rpb24gcmVhZChidWYsaSl7aWYoaW5kZXhTaXplPT09MSl7cmV0dXJuIGJ1ZltpXX1lbHNle3JldHVybiBidWYucmVhZFVJbnQxNkJFKGkqaW5kZXhTaXplKX19dmFyIGk7aWYoZGlyKXt2YXIgZm91bmRJbmRleD0tMTtmb3IoaT1ieXRlT2Zmc2V0O2k8YXJyTGVuZ3RoO2krKyl7aWYocmVhZChhcnIsaSk9PT1yZWFkKHZhbCxmb3VuZEluZGV4PT09LTE/MDppLWZvdW5kSW5kZXgpKXtpZihmb3VuZEluZGV4PT09LTEpZm91bmRJbmRleD1pO2lmKGktZm91bmRJbmRleCsxPT09dmFsTGVuZ3RoKXJldHVybiBmb3VuZEluZGV4KmluZGV4U2l6ZX1lbHNle2lmKGZvdW5kSW5kZXghPT0tMSlpLT1pLWZvdW5kSW5kZXg7Zm91bmRJbmRleD0tMX19fWVsc2V7aWYoYnl0ZU9mZnNldCt2YWxMZW5ndGg+YXJyTGVuZ3RoKWJ5dGVPZmZzZXQ9YXJyTGVuZ3RoLXZhbExlbmd0aDtmb3IoaT1ieXRlT2Zmc2V0O2k+PTA7aS0tKXt2YXIgZm91bmQ9dHJ1ZTtmb3IodmFyIGo9MDtqPHZhbExlbmd0aDtqKyspe2lmKHJlYWQoYXJyLGkraikhPT1yZWFkKHZhbCxqKSl7Zm91bmQ9ZmFsc2U7YnJlYWt9fWlmKGZvdW5kKXJldHVybiBpfX1yZXR1cm4tMX1CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzPWZ1bmN0aW9uIGluY2x1ZGVzKHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nKXtyZXR1cm4gdGhpcy5pbmRleE9mKHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nKSE9PS0xfTtCdWZmZXIucHJvdG90eXBlLmluZGV4T2Y9ZnVuY3Rpb24gaW5kZXhPZih2YWwsYnl0ZU9mZnNldCxlbmNvZGluZyl7cmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsdmFsLGJ5dGVPZmZzZXQsZW5jb2RpbmcsdHJ1ZSl9O0J1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2Y9ZnVuY3Rpb24gbGFzdEluZGV4T2YodmFsLGJ5dGVPZmZzZXQsZW5jb2Rpbmcpe3JldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGZhbHNlKX07ZnVuY3Rpb24gaGV4V3JpdGUoYnVmLHN0cmluZyxvZmZzZXQsbGVuZ3RoKXtvZmZzZXQ9TnVtYmVyKG9mZnNldCl8fDA7dmFyIHJlbWFpbmluZz1idWYubGVuZ3RoLW9mZnNldDtpZighbGVuZ3RoKXtsZW5ndGg9cmVtYWluaW5nfWVsc2V7bGVuZ3RoPU51bWJlcihsZW5ndGgpO2lmKGxlbmd0aD5yZW1haW5pbmcpe2xlbmd0aD1yZW1haW5pbmd9fXZhciBzdHJMZW49c3RyaW5nLmxlbmd0aDtpZihsZW5ndGg+c3RyTGVuLzIpe2xlbmd0aD1zdHJMZW4vMn1mb3IodmFyIGk9MDtpPGxlbmd0aDsrK2kpe3ZhciBwYXJzZWQ9cGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpKjIsMiksMTYpO2lmKG51bWJlcklzTmFOKHBhcnNlZCkpcmV0dXJuIGk7YnVmW29mZnNldCtpXT1wYXJzZWR9cmV0dXJuIGl9ZnVuY3Rpb24gdXRmOFdyaXRlKGJ1ZixzdHJpbmcsb2Zmc2V0LGxlbmd0aCl7cmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLGJ1Zi5sZW5ndGgtb2Zmc2V0KSxidWYsb2Zmc2V0LGxlbmd0aCl9ZnVuY3Rpb24gYXNjaWlXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLGJ1ZixvZmZzZXQsbGVuZ3RoKX1mdW5jdGlvbiBsYXRpbjFXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBhc2NpaVdyaXRlKGJ1ZixzdHJpbmcsb2Zmc2V0LGxlbmd0aCl9ZnVuY3Rpb24gYmFzZTY0V3JpdGUoYnVmLHN0cmluZyxvZmZzZXQsbGVuZ3RoKXtyZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksYnVmLG9mZnNldCxsZW5ndGgpfWZ1bmN0aW9uIHVjczJXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyxidWYubGVuZ3RoLW9mZnNldCksYnVmLG9mZnNldCxsZW5ndGgpfUJ1ZmZlci5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24gd3JpdGUoc3RyaW5nLG9mZnNldCxsZW5ndGgsZW5jb2Rpbmcpe2lmKG9mZnNldD09PXVuZGVmaW5lZCl7ZW5jb2Rpbmc9InV0ZjgiO2xlbmd0aD10aGlzLmxlbmd0aDtvZmZzZXQ9MH1lbHNlIGlmKGxlbmd0aD09PXVuZGVmaW5lZCYmdHlwZW9mIG9mZnNldD09PSJzdHJpbmciKXtlbmNvZGluZz1vZmZzZXQ7bGVuZ3RoPXRoaXMubGVuZ3RoO29mZnNldD0wfWVsc2UgaWYoaXNGaW5pdGUob2Zmc2V0KSl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoaXNGaW5pdGUobGVuZ3RoKSl7bGVuZ3RoPWxlbmd0aD4+PjA7aWYoZW5jb2Rpbmc9PT11bmRlZmluZWQpZW5jb2Rpbmc9InV0ZjgifWVsc2V7ZW5jb2Rpbmc9bGVuZ3RoO2xlbmd0aD11bmRlZmluZWR9fWVsc2V7dGhyb3cgbmV3IEVycm9yKCJCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCIpfXZhciByZW1haW5pbmc9dGhpcy5sZW5ndGgtb2Zmc2V0O2lmKGxlbmd0aD09PXVuZGVmaW5lZHx8bGVuZ3RoPnJlbWFpbmluZylsZW5ndGg9cmVtYWluaW5nO2lmKHN0cmluZy5sZW5ndGg+MCYmKGxlbmd0aDwwfHxvZmZzZXQ8MCl8fG9mZnNldD50aGlzLmxlbmd0aCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkF0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzIil9aWYoIWVuY29kaW5nKWVuY29kaW5nPSJ1dGY4Ijt2YXIgbG93ZXJlZENhc2U9ZmFsc2U7Zm9yKDs7KXtzd2l0Y2goZW5jb2Rpbmcpe2Nhc2UiaGV4IjpyZXR1cm4gaGV4V3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7Y2FzZSJ1dGY4IjpjYXNlInV0Zi04IjpyZXR1cm4gdXRmOFdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UiYXNjaWkiOnJldHVybiBhc2NpaVdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UibGF0aW4xIjpjYXNlImJpbmFyeSI6cmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UiYmFzZTY0IjpyZXR1cm4gYmFzZTY0V3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7Y2FzZSJ1Y3MyIjpjYXNlInVjcy0yIjpjYXNlInV0ZjE2bGUiOmNhc2UidXRmLTE2bGUiOnJldHVybiB1Y3MyV3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7ZGVmYXVsdDppZihsb3dlcmVkQ2FzZSl0aHJvdyBuZXcgVHlwZUVycm9yKCJVbmtub3duIGVuY29kaW5nOiAiK2VuY29kaW5nKTtlbmNvZGluZz0oIiIrZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCk7bG93ZXJlZENhc2U9dHJ1ZX19fTtCdWZmZXIucHJvdG90eXBlLnRvSlNPTj1mdW5jdGlvbiB0b0pTT04oKXtyZXR1cm57dHlwZToiQnVmZmVyIixkYXRhOkFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2Fycnx8dGhpcywwKX19O2Z1bmN0aW9uIGJhc2U2NFNsaWNlKGJ1ZixzdGFydCxlbmQpe2lmKHN0YXJ0PT09MCYmZW5kPT09YnVmLmxlbmd0aCl7cmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zil9ZWxzZXtyZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LGVuZCkpfX1mdW5jdGlvbiB1dGY4U2xpY2UoYnVmLHN0YXJ0LGVuZCl7ZW5kPU1hdGgubWluKGJ1Zi5sZW5ndGgsZW5kKTt2YXIgcmVzPVtdO3ZhciBpPXN0YXJ0O3doaWxlKGk8ZW5kKXt2YXIgZmlyc3RCeXRlPWJ1ZltpXTt2YXIgY29kZVBvaW50PW51bGw7dmFyIGJ5dGVzUGVyU2VxdWVuY2U9Zmlyc3RCeXRlPjIzOT80OmZpcnN0Qnl0ZT4yMjM/MzpmaXJzdEJ5dGU+MTkxPzI6MTtpZihpK2J5dGVzUGVyU2VxdWVuY2U8PWVuZCl7dmFyIHNlY29uZEJ5dGUsdGhpcmRCeXRlLGZvdXJ0aEJ5dGUsdGVtcENvZGVQb2ludDtzd2l0Y2goYnl0ZXNQZXJTZXF1ZW5jZSl7Y2FzZSAxOmlmKGZpcnN0Qnl0ZTwxMjgpe2NvZGVQb2ludD1maXJzdEJ5dGV9YnJlYWs7Y2FzZSAyOnNlY29uZEJ5dGU9YnVmW2krMV07aWYoKHNlY29uZEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjMxKTw8NnxzZWNvbmRCeXRlJjYzO2lmKHRlbXBDb2RlUG9pbnQ+MTI3KXtjb2RlUG9pbnQ9dGVtcENvZGVQb2ludH19YnJlYWs7Y2FzZSAzOnNlY29uZEJ5dGU9YnVmW2krMV07dGhpcmRCeXRlPWJ1ZltpKzJdO2lmKChzZWNvbmRCeXRlJjE5Mik9PT0xMjgmJih0aGlyZEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjE1KTw8MTJ8KHNlY29uZEJ5dGUmNjMpPDw2fHRoaXJkQnl0ZSY2MztpZih0ZW1wQ29kZVBvaW50PjIwNDcmJih0ZW1wQ29kZVBvaW50PDU1Mjk2fHx0ZW1wQ29kZVBvaW50PjU3MzQzKSl7Y29kZVBvaW50PXRlbXBDb2RlUG9pbnR9fWJyZWFrO2Nhc2UgNDpzZWNvbmRCeXRlPWJ1ZltpKzFdO3RoaXJkQnl0ZT1idWZbaSsyXTtmb3VydGhCeXRlPWJ1ZltpKzNdO2lmKChzZWNvbmRCeXRlJjE5Mik9PT0xMjgmJih0aGlyZEJ5dGUmMTkyKT09PTEyOCYmKGZvdXJ0aEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjE1KTw8MTh8KHNlY29uZEJ5dGUmNjMpPDwxMnwodGhpcmRCeXRlJjYzKTw8Nnxmb3VydGhCeXRlJjYzO2lmKHRlbXBDb2RlUG9pbnQ+NjU1MzUmJnRlbXBDb2RlUG9pbnQ8MTExNDExMil7Y29kZVBvaW50PXRlbXBDb2RlUG9pbnR9fX19aWYoY29kZVBvaW50PT09bnVsbCl7Y29kZVBvaW50PTY1NTMzO2J5dGVzUGVyU2VxdWVuY2U9MX1lbHNlIGlmKGNvZGVQb2ludD42NTUzNSl7Y29kZVBvaW50LT02NTUzNjtyZXMucHVzaChjb2RlUG9pbnQ+Pj4xMCYxMDIzfDU1Mjk2KTtjb2RlUG9pbnQ9NTYzMjB8Y29kZVBvaW50JjEwMjN9cmVzLnB1c2goY29kZVBvaW50KTtpKz1ieXRlc1BlclNlcXVlbmNlfXJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKX12YXIgTUFYX0FSR1VNRU5UU19MRU5HVEg9NDA5NjtmdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkoY29kZVBvaW50cyl7dmFyIGxlbj1jb2RlUG9pbnRzLmxlbmd0aDtpZihsZW48PU1BWF9BUkdVTUVOVFNfTEVOR1RIKXtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsY29kZVBvaW50cyl9dmFyIHJlcz0iIjt2YXIgaT0wO3doaWxlKGk8bGVuKXtyZXMrPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLGNvZGVQb2ludHMuc2xpY2UoaSxpKz1NQVhfQVJHVU1FTlRTX0xFTkdUSCkpfXJldHVybiByZXN9ZnVuY3Rpb24gYXNjaWlTbGljZShidWYsc3RhcnQsZW5kKXt2YXIgcmV0PSIiO2VuZD1NYXRoLm1pbihidWYubGVuZ3RoLGVuZCk7Zm9yKHZhciBpPXN0YXJ0O2k8ZW5kOysraSl7cmV0Kz1TdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSYxMjcpfXJldHVybiByZXR9ZnVuY3Rpb24gbGF0aW4xU2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIHJldD0iIjtlbmQ9TWF0aC5taW4oYnVmLmxlbmd0aCxlbmQpO2Zvcih2YXIgaT1zdGFydDtpPGVuZDsrK2kpe3JldCs9U3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pfXJldHVybiByZXR9ZnVuY3Rpb24gaGV4U2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIGxlbj1idWYubGVuZ3RoO2lmKCFzdGFydHx8c3RhcnQ8MClzdGFydD0wO2lmKCFlbmR8fGVuZDwwfHxlbmQ+bGVuKWVuZD1sZW47dmFyIG91dD0iIjtmb3IodmFyIGk9c3RhcnQ7aTxlbmQ7KytpKXtvdXQrPXRvSGV4KGJ1ZltpXSl9cmV0dXJuIG91dH1mdW5jdGlvbiB1dGYxNmxlU2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIGJ5dGVzPWJ1Zi5zbGljZShzdGFydCxlbmQpO3ZhciByZXM9IiI7Zm9yKHZhciBpPTA7aTxieXRlcy5sZW5ndGg7aSs9Mil7cmVzKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldK2J5dGVzW2krMV0qMjU2KX1yZXR1cm4gcmVzfUJ1ZmZlci5wcm90b3R5cGUuc2xpY2U9ZnVuY3Rpb24gc2xpY2Uoc3RhcnQsZW5kKXt2YXIgbGVuPXRoaXMubGVuZ3RoO3N0YXJ0PX5+c3RhcnQ7ZW5kPWVuZD09PXVuZGVmaW5lZD9sZW46fn5lbmQ7aWYoc3RhcnQ8MCl7c3RhcnQrPWxlbjtpZihzdGFydDwwKXN0YXJ0PTB9ZWxzZSBpZihzdGFydD5sZW4pe3N0YXJ0PWxlbn1pZihlbmQ8MCl7ZW5kKz1sZW47aWYoZW5kPDApZW5kPTB9ZWxzZSBpZihlbmQ+bGVuKXtlbmQ9bGVufWlmKGVuZDxzdGFydCllbmQ9c3RhcnQ7dmFyIG5ld0J1Zj10aGlzLnN1YmFycmF5KHN0YXJ0LGVuZCk7bmV3QnVmLl9fcHJvdG9fXz1CdWZmZXIucHJvdG90eXBlO3JldHVybiBuZXdCdWZ9O2Z1bmN0aW9uIGNoZWNrT2Zmc2V0KG9mZnNldCxleHQsbGVuZ3RoKXtpZihvZmZzZXQlMSE9PTB8fG9mZnNldDwwKXRocm93IG5ldyBSYW5nZUVycm9yKCJvZmZzZXQgaXMgbm90IHVpbnQiKTtpZihvZmZzZXQrZXh0Pmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCIpfUJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRT1mdW5jdGlvbiByZWFkVUludExFKG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsYnl0ZUxlbmd0aCx0aGlzLmxlbmd0aCk7dmFyIHZhbD10aGlzW29mZnNldF07dmFyIG11bD0xO3ZhciBpPTA7d2hpbGUoKytpPGJ5dGVMZW5ndGgmJihtdWwqPTI1Nikpe3ZhbCs9dGhpc1tvZmZzZXQraV0qbXVsfXJldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRT1mdW5jdGlvbiByZWFkVUludEJFKG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7Y2hlY2tPZmZzZXQob2Zmc2V0LGJ5dGVMZW5ndGgsdGhpcy5sZW5ndGgpfXZhciB2YWw9dGhpc1tvZmZzZXQrLS1ieXRlTGVuZ3RoXTt2YXIgbXVsPTE7d2hpbGUoYnl0ZUxlbmd0aD4wJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0Ky0tYnl0ZUxlbmd0aF0qbXVsfXJldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4PWZ1bmN0aW9uIHJlYWRVSW50OChvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsMSx0aGlzLmxlbmd0aCk7cmV0dXJuIHRoaXNbb2Zmc2V0XX07QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEU9ZnVuY3Rpb24gcmVhZFVJbnQxNkxFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCwyLHRoaXMubGVuZ3RoKTtyZXR1cm4gdGhpc1tvZmZzZXRdfHRoaXNbb2Zmc2V0KzFdPDw4fTtCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRT1mdW5jdGlvbiByZWFkVUludDE2QkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDIsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF08PDh8dGhpc1tvZmZzZXQrMV19O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFPWZ1bmN0aW9uIHJlYWRVSW50MzJMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsNCx0aGlzLmxlbmd0aCk7cmV0dXJuKHRoaXNbb2Zmc2V0XXx0aGlzW29mZnNldCsxXTw8OHx0aGlzW29mZnNldCsyXTw8MTYpK3RoaXNbb2Zmc2V0KzNdKjE2Nzc3MjE2fTtCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRT1mdW5jdGlvbiByZWFkVUludDMyQkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDQsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF0qMTY3NzcyMTYrKHRoaXNbb2Zmc2V0KzFdPDwxNnx0aGlzW29mZnNldCsyXTw8OHx0aGlzW29mZnNldCszXSl9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludExFPWZ1bmN0aW9uIHJlYWRJbnRMRShvZmZzZXQsYnl0ZUxlbmd0aCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7Ynl0ZUxlbmd0aD1ieXRlTGVuZ3RoPj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LGJ5dGVMZW5ndGgsdGhpcy5sZW5ndGgpO3ZhciB2YWw9dGhpc1tvZmZzZXRdO3ZhciBtdWw9MTt2YXIgaT0wO3doaWxlKCsraTxieXRlTGVuZ3RoJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0K2ldKm11bH1tdWwqPTEyODtpZih2YWw+PW11bCl2YWwtPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKTtyZXR1cm4gdmFsfTtCdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRT1mdW5jdGlvbiByZWFkSW50QkUob2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2J5dGVMZW5ndGg9Ynl0ZUxlbmd0aD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCxieXRlTGVuZ3RoLHRoaXMubGVuZ3RoKTt2YXIgaT1ieXRlTGVuZ3RoO3ZhciBtdWw9MTt2YXIgdmFsPXRoaXNbb2Zmc2V0Ky0taV07d2hpbGUoaT4wJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0Ky0taV0qbXVsfW11bCo9MTI4O2lmKHZhbD49bXVsKXZhbC09TWF0aC5wb3coMiw4KmJ5dGVMZW5ndGgpO3JldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDg9ZnVuY3Rpb24gcmVhZEludDgob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDEsdGhpcy5sZW5ndGgpO2lmKCEodGhpc1tvZmZzZXRdJjEyOCkpcmV0dXJuIHRoaXNbb2Zmc2V0XTtyZXR1cm4oMjU1LXRoaXNbb2Zmc2V0XSsxKSotMX07QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRT1mdW5jdGlvbiByZWFkSW50MTZMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsMix0aGlzLmxlbmd0aCk7dmFyIHZhbD10aGlzW29mZnNldF18dGhpc1tvZmZzZXQrMV08PDg7cmV0dXJuIHZhbCYzMjc2OD92YWx8NDI5NDkwMTc2MDp2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkU9ZnVuY3Rpb24gcmVhZEludDE2QkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDIsdGhpcy5sZW5ndGgpO3ZhciB2YWw9dGhpc1tvZmZzZXQrMV18dGhpc1tvZmZzZXRdPDw4O3JldHVybiB2YWwmMzI3Njg/dmFsfDQyOTQ5MDE3NjA6dmFsfTtCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFPWZ1bmN0aW9uIHJlYWRJbnQzMkxFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw0LHRoaXMubGVuZ3RoKTtyZXR1cm4gdGhpc1tvZmZzZXRdfHRoaXNbb2Zmc2V0KzFdPDw4fHRoaXNbb2Zmc2V0KzJdPDwxNnx0aGlzW29mZnNldCszXTw8MjR9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkU9ZnVuY3Rpb24gcmVhZEludDMyQkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDQsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF08PDI0fHRoaXNbb2Zmc2V0KzFdPDwxNnx0aGlzW29mZnNldCsyXTw8OHx0aGlzW29mZnNldCszXX07QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRT1mdW5jdGlvbiByZWFkRmxvYXRMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsNCx0aGlzLmxlbmd0aCk7cmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLG9mZnNldCx0cnVlLDIzLDQpfTtCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFPWZ1bmN0aW9uIHJlYWRGbG9hdEJFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw0LHRoaXMubGVuZ3RoKTtyZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsb2Zmc2V0LGZhbHNlLDIzLDQpfTtCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRT1mdW5jdGlvbiByZWFkRG91YmxlTEUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDgsdGhpcy5sZW5ndGgpO3JldHVybiBpZWVlNzU0LnJlYWQodGhpcyxvZmZzZXQsdHJ1ZSw1Miw4KX07QnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkU9ZnVuY3Rpb24gcmVhZERvdWJsZUJFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw4LHRoaXMubGVuZ3RoKTtyZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsb2Zmc2V0LGZhbHNlLDUyLDgpfTtmdW5jdGlvbiBjaGVja0ludChidWYsdmFsdWUsb2Zmc2V0LGV4dCxtYXgsbWluKXtpZighQnVmZmVyLmlzQnVmZmVyKGJ1ZikpdGhyb3cgbmV3IFR5cGVFcnJvcignImJ1ZmZlciIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpO2lmKHZhbHVlPm1heHx8dmFsdWU8bWluKXRocm93IG5ldyBSYW5nZUVycm9yKCcidmFsdWUiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKTtpZihvZmZzZXQrZXh0PmJ1Zi5sZW5ndGgpdGhyb3cgbmV3IFJhbmdlRXJyb3IoIkluZGV4IG91dCBvZiByYW5nZSIpfUJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEU9ZnVuY3Rpb24gd3JpdGVVSW50TEUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7dmFyIG1heEJ5dGVzPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKS0xO2NoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbWF4Qnl0ZXMsMCl9dmFyIG11bD0xO3ZhciBpPTA7dGhpc1tvZmZzZXRdPXZhbHVlJjI1NTt3aGlsZSgrK2k8Ynl0ZUxlbmd0aCYmKG11bCo9MjU2KSl7dGhpc1tvZmZzZXQraV09dmFsdWUvbXVsJjI1NX1yZXR1cm4gb2Zmc2V0K2J5dGVMZW5ndGh9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkU9ZnVuY3Rpb24gd3JpdGVVSW50QkUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7dmFyIG1heEJ5dGVzPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKS0xO2NoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbWF4Qnl0ZXMsMCl9dmFyIGk9Ynl0ZUxlbmd0aC0xO3ZhciBtdWw9MTt0aGlzW29mZnNldCtpXT12YWx1ZSYyNTU7d2hpbGUoLS1pPj0wJiYobXVsKj0yNTYpKXt0aGlzW29mZnNldCtpXT12YWx1ZS9tdWwmMjU1fXJldHVybiBvZmZzZXQrYnl0ZUxlbmd0aH07QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4PWZ1bmN0aW9uIHdyaXRlVUludDgodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDEsMjU1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7cmV0dXJuIG9mZnNldCsxfTtCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEU9ZnVuY3Rpb24gd3JpdGVVSW50MTZMRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsMiw2NTUzNSwwKTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+ODtyZXR1cm4gb2Zmc2V0KzJ9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRT1mdW5jdGlvbiB3cml0ZVVJbnQxNkJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCwyLDY1NTM1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZT4+Pjg7dGhpc1tvZmZzZXQrMV09dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrMn07QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFPWZ1bmN0aW9uIHdyaXRlVUludDMyTEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDQsNDI5NDk2NzI5NSwwKTt0aGlzW29mZnNldCszXT12YWx1ZT4+PjI0O3RoaXNbb2Zmc2V0KzJdPXZhbHVlPj4+MTY7dGhpc1tvZmZzZXQrMV09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7cmV0dXJuIG9mZnNldCs0fTtCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkU9ZnVuY3Rpb24gd3JpdGVVSW50MzJCRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsNCw0Mjk0OTY3Mjk1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZT4+PjI0O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+MTY7dGhpc1tvZmZzZXQrMl09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0KzNdPXZhbHVlJjI1NTtyZXR1cm4gb2Zmc2V0KzR9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRT1mdW5jdGlvbiB3cml0ZUludExFKHZhbHVlLG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KXt2YXIgbGltaXQ9TWF0aC5wb3coMiw4KmJ5dGVMZW5ndGgtMSk7Y2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsYnl0ZUxlbmd0aCxsaW1pdC0xLC1saW1pdCl9dmFyIGk9MDt2YXIgbXVsPTE7dmFyIHN1Yj0wO3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7d2hpbGUoKytpPGJ5dGVMZW5ndGgmJihtdWwqPTI1Nikpe2lmKHZhbHVlPDAmJnN1Yj09PTAmJnRoaXNbb2Zmc2V0K2ktMV0hPT0wKXtzdWI9MX10aGlzW29mZnNldCtpXT0odmFsdWUvbXVsPj4wKS1zdWImMjU1fXJldHVybiBvZmZzZXQrYnl0ZUxlbmd0aH07QnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFPWZ1bmN0aW9uIHdyaXRlSW50QkUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpe3ZhciBsaW1pdD1NYXRoLnBvdygyLDgqYnl0ZUxlbmd0aC0xKTtjaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCxieXRlTGVuZ3RoLGxpbWl0LTEsLWxpbWl0KX12YXIgaT1ieXRlTGVuZ3RoLTE7dmFyIG11bD0xO3ZhciBzdWI9MDt0aGlzW29mZnNldCtpXT12YWx1ZSYyNTU7d2hpbGUoLS1pPj0wJiYobXVsKj0yNTYpKXtpZih2YWx1ZTwwJiZzdWI9PT0wJiZ0aGlzW29mZnNldCtpKzFdIT09MCl7c3ViPTF9dGhpc1tvZmZzZXQraV09KHZhbHVlL211bD4+MCktc3ViJjI1NX1yZXR1cm4gb2Zmc2V0K2J5dGVMZW5ndGh9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4PWZ1bmN0aW9uIHdyaXRlSW50OCh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsMSwxMjcsLTEyOCk7aWYodmFsdWU8MCl2YWx1ZT0yNTUrdmFsdWUrMTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrMX07QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEU9ZnVuY3Rpb24gd3JpdGVJbnQxNkxFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCwyLDMyNzY3LC0zMjc2OCk7dGhpc1tvZmZzZXRdPXZhbHVlJjI1NTt0aGlzW29mZnNldCsxXT12YWx1ZT4+Pjg7cmV0dXJuIG9mZnNldCsyfTtCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRT1mdW5jdGlvbiB3cml0ZUludDE2QkUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDIsMzI3NjcsLTMyNzY4KTt0aGlzW29mZnNldF09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0KzFdPXZhbHVlJjI1NTtyZXR1cm4gb2Zmc2V0KzJ9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFPWZ1bmN0aW9uIHdyaXRlSW50MzJMRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsNCwyMTQ3NDgzNjQ3LC0yMTQ3NDgzNjQ4KTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+ODt0aGlzW29mZnNldCsyXT12YWx1ZT4+PjE2O3RoaXNbb2Zmc2V0KzNdPXZhbHVlPj4+MjQ7cmV0dXJuIG9mZnNldCs0fTtCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRT1mdW5jdGlvbiB3cml0ZUludDMyQkUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDQsMjE0NzQ4MzY0NywtMjE0NzQ4MzY0OCk7aWYodmFsdWU8MCl2YWx1ZT00Mjk0OTY3Mjk1K3ZhbHVlKzE7dGhpc1tvZmZzZXRdPXZhbHVlPj4+MjQ7dGhpc1tvZmZzZXQrMV09dmFsdWU+Pj4xNjt0aGlzW29mZnNldCsyXT12YWx1ZT4+Pjg7dGhpc1tvZmZzZXQrM109dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrNH07ZnVuY3Rpb24gY2hlY2tJRUVFNzU0KGJ1Zix2YWx1ZSxvZmZzZXQsZXh0LG1heCxtaW4pe2lmKG9mZnNldCtleHQ+YnVmLmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiSW5kZXggb3V0IG9mIHJhbmdlIik7aWYob2Zmc2V0PDApdGhyb3cgbmV3IFJhbmdlRXJyb3IoIkluZGV4IG91dCBvZiByYW5nZSIpfWZ1bmN0aW9uIHdyaXRlRmxvYXQoYnVmLHZhbHVlLG9mZnNldCxsaXR0bGVFbmRpYW4sbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpe2NoZWNrSUVFRTc1NChidWYsdmFsdWUsb2Zmc2V0LDQsMzQwMjgyMzQ2NjM4NTI4ODZlMjIsLTM0MDI4MjM0NjYzODUyODg2ZTIyKX1pZWVlNzU0LndyaXRlKGJ1Zix2YWx1ZSxvZmZzZXQsbGl0dGxlRW5kaWFuLDIzLDQpO3JldHVybiBvZmZzZXQrNH1CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRT1mdW5jdGlvbiB3cml0ZUZsb2F0TEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXtyZXR1cm4gd3JpdGVGbG9hdCh0aGlzLHZhbHVlLG9mZnNldCx0cnVlLG5vQXNzZXJ0KX07QnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkU9ZnVuY3Rpb24gd3JpdGVGbG9hdEJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7cmV0dXJuIHdyaXRlRmxvYXQodGhpcyx2YWx1ZSxvZmZzZXQsZmFsc2Usbm9Bc3NlcnQpfTtmdW5jdGlvbiB3cml0ZURvdWJsZShidWYsdmFsdWUsb2Zmc2V0LGxpdHRsZUVuZGlhbixub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCl7Y2hlY2tJRUVFNzU0KGJ1Zix2YWx1ZSxvZmZzZXQsOCwxNzk3NjkzMTM0ODYyMzE1N2UyOTIsLTE3OTc2OTMxMzQ4NjIzMTU3ZTI5Mil9aWVlZTc1NC53cml0ZShidWYsdmFsdWUsb2Zmc2V0LGxpdHRsZUVuZGlhbiw1Miw4KTtyZXR1cm4gb2Zmc2V0Kzh9QnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFPWZ1bmN0aW9uIHdyaXRlRG91YmxlTEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXtyZXR1cm4gd3JpdGVEb3VibGUodGhpcyx2YWx1ZSxvZmZzZXQsdHJ1ZSxub0Fzc2VydCl9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRT1mdW5jdGlvbiB3cml0ZURvdWJsZUJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7cmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsdmFsdWUsb2Zmc2V0LGZhbHNlLG5vQXNzZXJ0KX07QnVmZmVyLnByb3RvdHlwZS5jb3B5PWZ1bmN0aW9uIGNvcHkodGFyZ2V0LHRhcmdldFN0YXJ0LHN0YXJ0LGVuZCl7aWYoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IHNob3VsZCBiZSBhIEJ1ZmZlciIpO2lmKCFzdGFydClzdGFydD0wO2lmKCFlbmQmJmVuZCE9PTApZW5kPXRoaXMubGVuZ3RoO2lmKHRhcmdldFN0YXJ0Pj10YXJnZXQubGVuZ3RoKXRhcmdldFN0YXJ0PXRhcmdldC5sZW5ndGg7aWYoIXRhcmdldFN0YXJ0KXRhcmdldFN0YXJ0PTA7aWYoZW5kPjAmJmVuZDxzdGFydCllbmQ9c3RhcnQ7aWYoZW5kPT09c3RhcnQpcmV0dXJuIDA7aWYodGFyZ2V0Lmxlbmd0aD09PTB8fHRoaXMubGVuZ3RoPT09MClyZXR1cm4gMDtpZih0YXJnZXRTdGFydDwwKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcigidGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcyIpfWlmKHN0YXJ0PDB8fHN0YXJ0Pj10aGlzLmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiSW5kZXggb3V0IG9mIHJhbmdlIik7aWYoZW5kPDApdGhyb3cgbmV3IFJhbmdlRXJyb3IoInNvdXJjZUVuZCBvdXQgb2YgYm91bmRzIik7aWYoZW5kPnRoaXMubGVuZ3RoKWVuZD10aGlzLmxlbmd0aDtpZih0YXJnZXQubGVuZ3RoLXRhcmdldFN0YXJ0PGVuZC1zdGFydCl7ZW5kPXRhcmdldC5sZW5ndGgtdGFyZ2V0U3RhcnQrc3RhcnR9dmFyIGxlbj1lbmQtc3RhcnQ7aWYodGhpcz09PXRhcmdldCYmdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW49PT0iZnVuY3Rpb24iKXt0aGlzLmNvcHlXaXRoaW4odGFyZ2V0U3RhcnQsc3RhcnQsZW5kKX1lbHNlIGlmKHRoaXM9PT10YXJnZXQmJnN0YXJ0PHRhcmdldFN0YXJ0JiZ0YXJnZXRTdGFydDxlbmQpe2Zvcih2YXIgaT1sZW4tMTtpPj0wOy0taSl7dGFyZ2V0W2krdGFyZ2V0U3RhcnRdPXRoaXNbaStzdGFydF19fWVsc2V7VWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwodGFyZ2V0LHRoaXMuc3ViYXJyYXkoc3RhcnQsZW5kKSx0YXJnZXRTdGFydCl9cmV0dXJuIGxlbn07QnVmZmVyLnByb3RvdHlwZS5maWxsPWZ1bmN0aW9uIGZpbGwodmFsLHN0YXJ0LGVuZCxlbmNvZGluZyl7aWYodHlwZW9mIHZhbD09PSJzdHJpbmciKXtpZih0eXBlb2Ygc3RhcnQ9PT0ic3RyaW5nIil7ZW5jb2Rpbmc9c3RhcnQ7c3RhcnQ9MDtlbmQ9dGhpcy5sZW5ndGh9ZWxzZSBpZih0eXBlb2YgZW5kPT09InN0cmluZyIpe2VuY29kaW5nPWVuZDtlbmQ9dGhpcy5sZW5ndGh9aWYoZW5jb2RpbmchPT11bmRlZmluZWQmJnR5cGVvZiBlbmNvZGluZyE9PSJzdHJpbmciKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nIil9aWYodHlwZW9mIGVuY29kaW5nPT09InN0cmluZyImJiFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpe3Rocm93IG5ldyBUeXBlRXJyb3IoIlVua25vd24gZW5jb2Rpbmc6ICIrZW5jb2RpbmcpfWlmKHZhbC5sZW5ndGg9PT0xKXt2YXIgY29kZT12YWwuY2hhckNvZGVBdCgwKTtpZihlbmNvZGluZz09PSJ1dGY4IiYmY29kZTwxMjh8fGVuY29kaW5nPT09ImxhdGluMSIpe3ZhbD1jb2RlfX19ZWxzZSBpZih0eXBlb2YgdmFsPT09Im51bWJlciIpe3ZhbD12YWwmMjU1fWlmKHN0YXJ0PDB8fHRoaXMubGVuZ3RoPHN0YXJ0fHx0aGlzLmxlbmd0aDxlbmQpe3Rocm93IG5ldyBSYW5nZUVycm9yKCJPdXQgb2YgcmFuZ2UgaW5kZXgiKX1pZihlbmQ8PXN0YXJ0KXtyZXR1cm4gdGhpc31zdGFydD1zdGFydD4+PjA7ZW5kPWVuZD09PXVuZGVmaW5lZD90aGlzLmxlbmd0aDplbmQ+Pj4wO2lmKCF2YWwpdmFsPTA7dmFyIGk7aWYodHlwZW9mIHZhbD09PSJudW1iZXIiKXtmb3IoaT1zdGFydDtpPGVuZDsrK2kpe3RoaXNbaV09dmFsfX1lbHNle3ZhciBieXRlcz1CdWZmZXIuaXNCdWZmZXIodmFsKT92YWw6QnVmZmVyLmZyb20odmFsLGVuY29kaW5nKTt2YXIgbGVuPWJ5dGVzLmxlbmd0aDtpZihsZW49PT0wKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgdmFsdWUgIicrdmFsKyciIGlzIGludmFsaWQgZm9yIGFyZ3VtZW50ICJ2YWx1ZSInKX1mb3IoaT0wO2k8ZW5kLXN0YXJ0OysraSl7dGhpc1tpK3N0YXJ0XT1ieXRlc1tpJWxlbl19fXJldHVybiB0aGlzfTt2YXIgSU5WQUxJRF9CQVNFNjRfUkU9L1teKy8wLTlBLVphLXotX10vZztmdW5jdGlvbiBiYXNlNjRjbGVhbihzdHIpe3N0cj1zdHIuc3BsaXQoIj0iKVswXTtzdHI9c3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCIiKTtpZihzdHIubGVuZ3RoPDIpcmV0dXJuIiI7d2hpbGUoc3RyLmxlbmd0aCU0IT09MCl7c3RyPXN0cisiPSJ9cmV0dXJuIHN0cn1mdW5jdGlvbiB0b0hleChuKXtpZihuPDE2KXJldHVybiIwIituLnRvU3RyaW5nKDE2KTtyZXR1cm4gbi50b1N0cmluZygxNil9ZnVuY3Rpb24gdXRmOFRvQnl0ZXMoc3RyaW5nLHVuaXRzKXt1bml0cz11bml0c3x8SW5maW5pdHk7dmFyIGNvZGVQb2ludDt2YXIgbGVuZ3RoPXN0cmluZy5sZW5ndGg7dmFyIGxlYWRTdXJyb2dhdGU9bnVsbDt2YXIgYnl0ZXM9W107Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXtjb2RlUG9pbnQ9c3RyaW5nLmNoYXJDb2RlQXQoaSk7aWYoY29kZVBvaW50PjU1Mjk1JiZjb2RlUG9pbnQ8NTczNDQpe2lmKCFsZWFkU3Vycm9nYXRlKXtpZihjb2RlUG9pbnQ+NTYzMTkpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSk7Y29udGludWV9ZWxzZSBpZihpKzE9PT1sZW5ndGgpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSk7Y29udGludWV9bGVhZFN1cnJvZ2F0ZT1jb2RlUG9pbnQ7Y29udGludWV9aWYoY29kZVBvaW50PDU2MzIwKXtpZigodW5pdHMtPTMpPi0xKWJ5dGVzLnB1c2goMjM5LDE5MSwxODkpO2xlYWRTdXJyb2dhdGU9Y29kZVBvaW50O2NvbnRpbnVlfWNvZGVQb2ludD0obGVhZFN1cnJvZ2F0ZS01NTI5Njw8MTB8Y29kZVBvaW50LTU2MzIwKSs2NTUzNn1lbHNlIGlmKGxlYWRTdXJyb2dhdGUpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSl9bGVhZFN1cnJvZ2F0ZT1udWxsO2lmKGNvZGVQb2ludDwxMjgpe2lmKCh1bml0cy09MSk8MClicmVhaztieXRlcy5wdXNoKGNvZGVQb2ludCl9ZWxzZSBpZihjb2RlUG9pbnQ8MjA0OCl7aWYoKHVuaXRzLT0yKTwwKWJyZWFrO2J5dGVzLnB1c2goY29kZVBvaW50Pj42fDE5Mixjb2RlUG9pbnQmNjN8MTI4KX1lbHNlIGlmKGNvZGVQb2ludDw2NTUzNil7aWYoKHVuaXRzLT0zKTwwKWJyZWFrO2J5dGVzLnB1c2goY29kZVBvaW50Pj4xMnwyMjQsY29kZVBvaW50Pj42JjYzfDEyOCxjb2RlUG9pbnQmNjN8MTI4KX1lbHNlIGlmKGNvZGVQb2ludDwxMTE0MTEyKXtpZigodW5pdHMtPTQpPDApYnJlYWs7Ynl0ZXMucHVzaChjb2RlUG9pbnQ+PjE4fDI0MCxjb2RlUG9pbnQ+PjEyJjYzfDEyOCxjb2RlUG9pbnQ+PjYmNjN8MTI4LGNvZGVQb2ludCY2M3wxMjgpfWVsc2V7dGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIGNvZGUgcG9pbnQiKX19cmV0dXJuIGJ5dGVzfWZ1bmN0aW9uIGFzY2lpVG9CeXRlcyhzdHIpe3ZhciBieXRlQXJyYXk9W107Zm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoOysraSl7Ynl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkmMjU1KX1yZXR1cm4gYnl0ZUFycmF5fWZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzKHN0cix1bml0cyl7dmFyIGMsaGksbG87dmFyIGJ5dGVBcnJheT1bXTtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXtpZigodW5pdHMtPTIpPDApYnJlYWs7Yz1zdHIuY2hhckNvZGVBdChpKTtoaT1jPj44O2xvPWMlMjU2O2J5dGVBcnJheS5wdXNoKGxvKTtieXRlQXJyYXkucHVzaChoaSl9cmV0dXJuIGJ5dGVBcnJheX1mdW5jdGlvbiBiYXNlNjRUb0J5dGVzKHN0cil7cmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKX1mdW5jdGlvbiBibGl0QnVmZmVyKHNyYyxkc3Qsb2Zmc2V0LGxlbmd0aCl7Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXtpZihpK29mZnNldD49ZHN0Lmxlbmd0aHx8aT49c3JjLmxlbmd0aClicmVhaztkc3RbaStvZmZzZXRdPXNyY1tpXX1yZXR1cm4gaX1mdW5jdGlvbiBpc0luc3RhbmNlKG9iaix0eXBlKXtyZXR1cm4gb2JqIGluc3RhbmNlb2YgdHlwZXx8b2JqIT1udWxsJiZvYmouY29uc3RydWN0b3IhPW51bGwmJm9iai5jb25zdHJ1Y3Rvci5uYW1lIT1udWxsJiZvYmouY29uc3RydWN0b3IubmFtZT09PXR5cGUubmFtZX1mdW5jdGlvbiBudW1iZXJJc05hTihvYmope3JldHVybiBvYmohPT1vYmp9fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiYmFzZTY0LWpzIjoyNCxidWZmZXI6MjcsaWVlZTc1NDozNX1dLDI4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBUcmFuc2Zvcm09cmVxdWlyZSgic3RyZWFtIikuVHJhbnNmb3JtO3ZhciBTdHJpbmdEZWNvZGVyPXJlcXVpcmUoInN0cmluZ19kZWNvZGVyIikuU3RyaW5nRGVjb2Rlcjt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTtmdW5jdGlvbiBDaXBoZXJCYXNlKGhhc2hNb2RlKXtUcmFuc2Zvcm0uY2FsbCh0aGlzKTt0aGlzLmhhc2hNb2RlPXR5cGVvZiBoYXNoTW9kZT09PSJzdHJpbmciO2lmKHRoaXMuaGFzaE1vZGUpe3RoaXNbaGFzaE1vZGVdPXRoaXMuX2ZpbmFsT3JEaWdlc3R9ZWxzZXt0aGlzLmZpbmFsPXRoaXMuX2ZpbmFsT3JEaWdlc3R9aWYodGhpcy5fZmluYWwpe3RoaXMuX19maW5hbD10aGlzLl9maW5hbDt0aGlzLl9maW5hbD1udWxsfXRoaXMuX2RlY29kZXI9bnVsbDt0aGlzLl9lbmNvZGluZz1udWxsfWluaGVyaXRzKENpcGhlckJhc2UsVHJhbnNmb3JtKTtDaXBoZXJCYXNlLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oZGF0YSxpbnB1dEVuYyxvdXRwdXRFbmMpe2lmKHR5cGVvZiBkYXRhPT09InN0cmluZyIpe2RhdGE9QnVmZmVyLmZyb20oZGF0YSxpbnB1dEVuYyl9dmFyIG91dERhdGE9dGhpcy5fdXBkYXRlKGRhdGEpO2lmKHRoaXMuaGFzaE1vZGUpcmV0dXJuIHRoaXM7aWYob3V0cHV0RW5jKXtvdXREYXRhPXRoaXMuX3RvU3RyaW5nKG91dERhdGEsb3V0cHV0RW5jKX1yZXR1cm4gb3V0RGF0YX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuc2V0QXV0b1BhZGRpbmc9ZnVuY3Rpb24oKXt9O0NpcGhlckJhc2UucHJvdG90eXBlLmdldEF1dGhUYWc9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoInRyeWluZyB0byBnZXQgYXV0aCB0YWcgaW4gdW5zdXBwb3J0ZWQgc3RhdGUiKX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuc2V0QXV0aFRhZz1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcigidHJ5aW5nIHRvIHNldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZSIpfTtDaXBoZXJCYXNlLnByb3RvdHlwZS5zZXRBQUQ9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoInRyeWluZyB0byBzZXQgYWFkIGluIHVuc3VwcG9ydGVkIHN0YXRlIil9O0NpcGhlckJhc2UucHJvdG90eXBlLl90cmFuc2Zvcm09ZnVuY3Rpb24oZGF0YSxfLG5leHQpe3ZhciBlcnI7dHJ5e2lmKHRoaXMuaGFzaE1vZGUpe3RoaXMuX3VwZGF0ZShkYXRhKX1lbHNle3RoaXMucHVzaCh0aGlzLl91cGRhdGUoZGF0YSkpfX1jYXRjaChlKXtlcnI9ZX1maW5hbGx5e25leHQoZXJyKX19O0NpcGhlckJhc2UucHJvdG90eXBlLl9mbHVzaD1mdW5jdGlvbihkb25lKXt2YXIgZXJyO3RyeXt0aGlzLnB1c2godGhpcy5fX2ZpbmFsKCkpfWNhdGNoKGUpe2Vycj1lfWRvbmUoZXJyKX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuX2ZpbmFsT3JEaWdlc3Q9ZnVuY3Rpb24ob3V0cHV0RW5jKXt2YXIgb3V0RGF0YT10aGlzLl9fZmluYWwoKXx8QnVmZmVyLmFsbG9jKDApO2lmKG91dHB1dEVuYyl7b3V0RGF0YT10aGlzLl90b1N0cmluZyhvdXREYXRhLG91dHB1dEVuYyx0cnVlKX1yZXR1cm4gb3V0RGF0YX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuX3RvU3RyaW5nPWZ1bmN0aW9uKHZhbHVlLGVuYyxmaW4pe2lmKCF0aGlzLl9kZWNvZGVyKXt0aGlzLl9kZWNvZGVyPW5ldyBTdHJpbmdEZWNvZGVyKGVuYyk7dGhpcy5fZW5jb2Rpbmc9ZW5jfWlmKHRoaXMuX2VuY29kaW5nIT09ZW5jKXRocm93IG5ldyBFcnJvcigiY2FuJ3Qgc3dpdGNoIGVuY29kaW5ncyIpO3ZhciBvdXQ9dGhpcy5fZGVjb2Rlci53cml0ZSh2YWx1ZSk7aWYoZmluKXtvdXQrPXRoaXMuX2RlY29kZXIuZW5kKCl9cmV0dXJuIG91dH07bW9kdWxlLmV4cG9ydHM9Q2lwaGVyQmFzZX0se2luaGVyaXRzOjM2LCJzYWZlLWJ1ZmZlciI6Nzksc3RyZWFtOjk4LHN0cmluZ19kZWNvZGVyOjk5fV0sMjk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXtPX1JET05MWTowLE9fV1JPTkxZOjEsT19SRFdSOjIsU19JRk1UOjYxNDQwLFNfSUZSRUc6MzI3NjgsU19JRkRJUjoxNjM4NCxTX0lGQ0hSOjgxOTIsU19JRkJMSzoyNDU3NixTX0lGSUZPOjQwOTYsU19JRkxOSzo0MDk2MCxTX0lGU09DSzo0OTE1MixPX0NSRUFUOjUxMixPX0VYQ0w6MjA0OCxPX05PQ1RUWToxMzEwNzIsT19UUlVOQzoxMDI0LE9fQVBQRU5EOjgsT19ESVJFQ1RPUlk6MTA0ODU3NixPX05PRk9MTE9XOjI1NixPX1NZTkM6MTI4LE9fU1lNTElOSzoyMDk3MTUyLE9fTk9OQkxPQ0s6NCxTX0lSV1hVOjQ0OCxTX0lSVVNSOjI1NixTX0lXVVNSOjEyOCxTX0lYVVNSOjY0LFNfSVJXWEc6NTYsU19JUkdSUDozMixTX0lXR1JQOjE2LFNfSVhHUlA6OCxTX0lSV1hPOjcsU19JUk9USDo0LFNfSVdPVEg6MixTX0lYT1RIOjEsRTJCSUc6NyxFQUNDRVM6MTMsRUFERFJJTlVTRTo0OCxFQUREUk5PVEFWQUlMOjQ5LEVBRk5PU1VQUE9SVDo0NyxFQUdBSU46MzUsRUFMUkVBRFk6MzcsRUJBREY6OSxFQkFETVNHOjk0LEVCVVNZOjE2LEVDQU5DRUxFRDo4OSxFQ0hJTEQ6MTAsRUNPTk5BQk9SVEVEOjUzLEVDT05OUkVGVVNFRDo2MSxFQ09OTlJFU0VUOjU0LEVERUFETEs6MTEsRURFU1RBRERSUkVROjM5LEVET006MzMsRURRVU9UOjY5LEVFWElTVDoxNyxFRkFVTFQ6MTQsRUZCSUc6MjcsRUhPU1RVTlJFQUNIOjY1LEVJRFJNOjkwLEVJTFNFUTo5MixFSU5QUk9HUkVTUzozNixFSU5UUjo0LEVJTlZBTDoyMixFSU86NSxFSVNDT05OOjU2LEVJU0RJUjoyMSxFTE9PUDo2MixFTUZJTEU6MjQsRU1MSU5LOjMxLEVNU0dTSVpFOjQwLEVNVUxUSUhPUDo5NSxFTkFNRVRPT0xPTkc6NjMsRU5FVERPV046NTAsRU5FVFJFU0VUOjUyLEVORVRVTlJFQUNIOjUxLEVORklMRToyMyxFTk9CVUZTOjU1LEVOT0RBVEE6OTYsRU5PREVWOjE5LEVOT0VOVDoyLEVOT0VYRUM6OCxFTk9MQ0s6NzcsRU5PTElOSzo5NyxFTk9NRU06MTIsRU5PTVNHOjkxLEVOT1BST1RPT1BUOjQyLEVOT1NQQzoyOCxFTk9TUjo5OCxFTk9TVFI6OTksRU5PU1lTOjc4LEVOT1RDT05OOjU3LEVOT1RESVI6MjAsRU5PVEVNUFRZOjY2LEVOT1RTT0NLOjM4LEVOT1RTVVA6NDUsRU5PVFRZOjI1LEVOWElPOjYsRU9QTk9UU1VQUDoxMDIsRU9WRVJGTE9XOjg0LEVQRVJNOjEsRVBJUEU6MzIsRVBST1RPOjEwMCxFUFJPVE9OT1NVUFBPUlQ6NDMsRVBST1RPVFlQRTo0MSxFUkFOR0U6MzQsRVJPRlM6MzAsRVNQSVBFOjI5LEVTUkNIOjMsRVNUQUxFOjcwLEVUSU1FOjEwMSxFVElNRURPVVQ6NjAsRVRYVEJTWToyNixFV09VTERCTE9DSzozNSxFWERFVjoxOCxTSUdIVVA6MSxTSUdJTlQ6MixTSUdRVUlUOjMsU0lHSUxMOjQsU0lHVFJBUDo1LFNJR0FCUlQ6NixTSUdJT1Q6NixTSUdCVVM6MTAsU0lHRlBFOjgsU0lHS0lMTDo5LFNJR1VTUjE6MzAsU0lHU0VHVjoxMSxTSUdVU1IyOjMxLFNJR1BJUEU6MTMsU0lHQUxSTToxNCxTSUdURVJNOjE1LFNJR0NITEQ6MjAsU0lHQ09OVDoxOSxTSUdTVE9QOjE3LFNJR1RTVFA6MTgsU0lHVFRJTjoyMSxTSUdUVE9VOjIyLFNJR1VSRzoxNixTSUdYQ1BVOjI0LFNJR1hGU1o6MjUsU0lHVlRBTFJNOjI2LFNJR1BST0Y6MjcsU0lHV0lOQ0g6MjgsU0lHSU86MjMsU0lHU1lTOjEyLFNTTF9PUF9BTEw6MjE0NzQ4NjcxOSxTU0xfT1BfQUxMT1dfVU5TQUZFX0xFR0FDWV9SRU5FR09USUFUSU9OOjI2MjE0NCxTU0xfT1BfQ0lQSEVSX1NFUlZFUl9QUkVGRVJFTkNFOjQxOTQzMDQsU1NMX09QX0NJU0NPX0FOWUNPTk5FQ1Q6MzI3NjgsU1NMX09QX0NPT0tJRV9FWENIQU5HRTo4MTkyLFNTTF9PUF9DUllQVE9QUk9fVExTRVhUX0JVRzoyMTQ3NDgzNjQ4LFNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFM6MjA0OCxTU0xfT1BfRVBIRU1FUkFMX1JTQTowLFNTTF9PUF9MRUdBQ1lfU0VSVkVSX0NPTk5FQ1Q6NCxTU0xfT1BfTUlDUk9TT0ZUX0JJR19TU0xWM19CVUZGRVI6MzIsU1NMX09QX01JQ1JPU09GVF9TRVNTX0lEX0JVRzoxLFNTTF9PUF9NU0lFX1NTTFYyX1JTQV9QQURESU5HOjAsU1NMX09QX05FVFNDQVBFX0NBX0ROX0JVRzo1MzY4NzA5MTIsU1NMX09QX05FVFNDQVBFX0NIQUxMRU5HRV9CVUc6MixTU0xfT1BfTkVUU0NBUEVfREVNT19DSVBIRVJfQ0hBTkdFX0JVRzoxMDczNzQxODI0LFNTTF9PUF9ORVRTQ0FQRV9SRVVTRV9DSVBIRVJfQ0hBTkdFX0JVRzo4LFNTTF9PUF9OT19DT01QUkVTU0lPTjoxMzEwNzIsU1NMX09QX05PX1FVRVJZX01UVTo0MDk2LFNTTF9PUF9OT19TRVNTSU9OX1JFU1VNUFRJT05fT05fUkVORUdPVElBVElPTjo2NTUzNixTU0xfT1BfTk9fU1NMdjI6MTY3NzcyMTYsU1NMX09QX05PX1NTTHYzOjMzNTU0NDMyLFNTTF9PUF9OT19USUNLRVQ6MTYzODQsU1NMX09QX05PX1RMU3YxOjY3MTA4ODY0LFNTTF9PUF9OT19UTFN2MV8xOjI2ODQzNTQ1NixTU0xfT1BfTk9fVExTdjFfMjoxMzQyMTc3MjgsU1NMX09QX1BLQ1MxX0NIRUNLXzE6MCxTU0xfT1BfUEtDUzFfQ0hFQ0tfMjowLFNTTF9PUF9TSU5HTEVfREhfVVNFOjEwNDg1NzYsU1NMX09QX1NJTkdMRV9FQ0RIX1VTRTo1MjQyODgsU1NMX09QX1NTTEVBWV8wODBfQ0xJRU5UX0RIX0JVRzoxMjgsU1NMX09QX1NTTFJFRjJfUkVVU0VfQ0VSVF9UWVBFX0JVRzowLFNTTF9PUF9UTFNfQkxPQ0tfUEFERElOR19CVUc6NTEyLFNTTF9PUF9UTFNfRDVfQlVHOjI1NixTU0xfT1BfVExTX1JPTExCQUNLX0JVRzo4Mzg4NjA4LEVOR0lORV9NRVRIT0RfRFNBOjIsRU5HSU5FX01FVEhPRF9ESDo0LEVOR0lORV9NRVRIT0RfUkFORDo4LEVOR0lORV9NRVRIT0RfRUNESDoxNixFTkdJTkVfTUVUSE9EX0VDRFNBOjMyLEVOR0lORV9NRVRIT0RfQ0lQSEVSUzo2NCxFTkdJTkVfTUVUSE9EX0RJR0VTVFM6MTI4LEVOR0lORV9NRVRIT0RfU1RPUkU6MjU2LEVOR0lORV9NRVRIT0RfUEtFWV9NRVRIUzo1MTIsRU5HSU5FX01FVEhPRF9QS0VZX0FTTjFfTUVUSFM6MTAyNCxFTkdJTkVfTUVUSE9EX0FMTDo2NTUzNSxFTkdJTkVfTUVUSE9EX05PTkU6MCxESF9DSEVDS19QX05PVF9TQUZFX1BSSU1FOjIsREhfQ0hFQ0tfUF9OT1RfUFJJTUU6MSxESF9VTkFCTEVfVE9fQ0hFQ0tfR0VORVJBVE9SOjQsREhfTk9UX1NVSVRBQkxFX0dFTkVSQVRPUjo4LE5QTl9FTkFCTEVEOjEsUlNBX1BLQ1MxX1BBRERJTkc6MSxSU0FfU1NMVjIzX1BBRERJTkc6MixSU0FfTk9fUEFERElORzozLFJTQV9QS0NTMV9PQUVQX1BBRERJTkc6NCxSU0FfWDkzMV9QQURESU5HOjUsUlNBX1BLQ1MxX1BTU19QQURESU5HOjYsUE9JTlRfQ09OVkVSU0lPTl9DT01QUkVTU0VEOjIsUE9JTlRfQ09OVkVSU0lPTl9VTkNPTVBSRVNTRUQ6NCxQT0lOVF9DT05WRVJTSU9OX0hZQlJJRDo2LEZfT0s6MCxSX09LOjQsV19PSzoyLFhfT0s6MSxVVl9VRFBfUkVVU0VBRERSOjR9fSx7fV0sMzA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe2Z1bmN0aW9uIGlzQXJyYXkoYXJnKXtpZihBcnJheS5pc0FycmF5KXtyZXR1cm4gQXJyYXkuaXNBcnJheShhcmcpfXJldHVybiBvYmplY3RUb1N0cmluZyhhcmcpPT09IltvYmplY3QgQXJyYXldIn1leHBvcnRzLmlzQXJyYXk9aXNBcnJheTtmdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJib29sZWFuIn1leHBvcnRzLmlzQm9vbGVhbj1pc0Jvb2xlYW47ZnVuY3Rpb24gaXNOdWxsKGFyZyl7cmV0dXJuIGFyZz09PW51bGx9ZXhwb3J0cy5pc051bGw9aXNOdWxsO2Z1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09bnVsbH1leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkPWlzTnVsbE9yVW5kZWZpbmVkO2Z1bmN0aW9uIGlzTnVtYmVyKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ibnVtYmVyIn1leHBvcnRzLmlzTnVtYmVyPWlzTnVtYmVyO2Z1bmN0aW9uIGlzU3RyaW5nKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3RyaW5nIn1leHBvcnRzLmlzU3RyaW5nPWlzU3RyaW5nO2Z1bmN0aW9uIGlzU3ltYm9sKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3ltYm9sIn1leHBvcnRzLmlzU3ltYm9sPWlzU3ltYm9sO2Z1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09PXZvaWQgMH1leHBvcnRzLmlzVW5kZWZpbmVkPWlzVW5kZWZpbmVkO2Z1bmN0aW9uIGlzUmVnRXhwKHJlKXtyZXR1cm4gb2JqZWN0VG9TdHJpbmcocmUpPT09IltvYmplY3QgUmVnRXhwXSJ9ZXhwb3J0cy5pc1JlZ0V4cD1pc1JlZ0V4cDtmdW5jdGlvbiBpc09iamVjdChhcmcpe3JldHVybiB0eXBlb2YgYXJnPT09Im9iamVjdCImJmFyZyE9PW51bGx9ZXhwb3J0cy5pc09iamVjdD1pc09iamVjdDtmdW5jdGlvbiBpc0RhdGUoZCl7cmV0dXJuIG9iamVjdFRvU3RyaW5nKGQpPT09IltvYmplY3QgRGF0ZV0ifWV4cG9ydHMuaXNEYXRlPWlzRGF0ZTtmdW5jdGlvbiBpc0Vycm9yKGUpe3JldHVybiBvYmplY3RUb1N0cmluZyhlKT09PSJbb2JqZWN0IEVycm9yXSJ8fGUgaW5zdGFuY2VvZiBFcnJvcn1leHBvcnRzLmlzRXJyb3I9aXNFcnJvcjtmdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0iZnVuY3Rpb24ifWV4cG9ydHMuaXNGdW5jdGlvbj1pc0Z1bmN0aW9uO2Z1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZyl7cmV0dXJuIGFyZz09PW51bGx8fHR5cGVvZiBhcmc9PT0iYm9vbGVhbiJ8fHR5cGVvZiBhcmc9PT0ibnVtYmVyInx8dHlwZW9mIGFyZz09PSJzdHJpbmcifHx0eXBlb2YgYXJnPT09InN5bWJvbCJ8fHR5cGVvZiBhcmc9PT0idW5kZWZpbmVkIn1leHBvcnRzLmlzUHJpbWl0aXZlPWlzUHJpbWl0aXZlO2V4cG9ydHMuaXNCdWZmZXI9QnVmZmVyLmlzQnVmZmVyO2Z1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyl9fSkuY2FsbCh0aGlzLHtpc0J1ZmZlcjpyZXF1aXJlKCIuLi8uLi9pcy1idWZmZXIvaW5kZXguanMiKX0pfSx7Ii4uLy4uL2lzLWJ1ZmZlci9pbmRleC5qcyI6Mzd9XSwzMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBNRDU9cmVxdWlyZSgibWQ1LmpzIik7dmFyIFJJUEVNRDE2MD1yZXF1aXJlKCJyaXBlbWQxNjAiKTt2YXIgc2hhPXJlcXVpcmUoInNoYS5qcyIpO3ZhciBCYXNlPXJlcXVpcmUoImNpcGhlci1iYXNlIik7ZnVuY3Rpb24gSGFzaChoYXNoKXtCYXNlLmNhbGwodGhpcywiZGlnZXN0Iik7dGhpcy5faGFzaD1oYXNofWluaGVyaXRzKEhhc2gsQmFzZSk7SGFzaC5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihkYXRhKXt0aGlzLl9oYXNoLnVwZGF0ZShkYXRhKX07SGFzaC5wcm90b3R5cGUuX2ZpbmFsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2hhc2guZGlnZXN0KCl9O21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGNyZWF0ZUhhc2goYWxnKXthbGc9YWxnLnRvTG93ZXJDYXNlKCk7aWYoYWxnPT09Im1kNSIpcmV0dXJuIG5ldyBNRDU7aWYoYWxnPT09InJtZDE2MCJ8fGFsZz09PSJyaXBlbWQxNjAiKXJldHVybiBuZXcgUklQRU1EMTYwO3JldHVybiBuZXcgSGFzaChzaGEoYWxnKSl9fSx7ImNpcGhlci1iYXNlIjoyOCxpbmhlcml0czozNiwibWQ1LmpzIjozOSxyaXBlbWQxNjA6NzgsInNoYS5qcyI6OTF9XSwzMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIE1ENT1yZXF1aXJlKCJtZDUuanMiKTttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihidWZmZXIpe3JldHVybihuZXcgTUQ1KS51cGRhdGUoYnVmZmVyKS5kaWdlc3QoKX19LHsibWQ1LmpzIjozOX1dLDMzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgb2JqZWN0Q3JlYXRlPU9iamVjdC5jcmVhdGV8fG9iamVjdENyZWF0ZVBvbHlmaWxsO3ZhciBvYmplY3RLZXlzPU9iamVjdC5rZXlzfHxvYmplY3RLZXlzUG9seWZpbGw7dmFyIGJpbmQ9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmR8fGZ1bmN0aW9uQmluZFBvbHlmaWxsO2Z1bmN0aW9uIEV2ZW50RW1pdHRlcigpe2lmKCF0aGlzLl9ldmVudHN8fCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcywiX2V2ZW50cyIpKXt0aGlzLl9ldmVudHM9b2JqZWN0Q3JlYXRlKG51bGwpO3RoaXMuX2V2ZW50c0NvdW50PTB9dGhpcy5fbWF4TGlzdGVuZXJzPXRoaXMuX21heExpc3RlbmVyc3x8dW5kZWZpbmVkfW1vZHVsZS5leHBvcnRzPUV2ZW50RW1pdHRlcjtFdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyPUV2ZW50RW1pdHRlcjtFdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHM9dW5kZWZpbmVkO0V2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycz11bmRlZmluZWQ7dmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnM9MTA7dmFyIGhhc0RlZmluZVByb3BlcnR5O3RyeXt2YXIgbz17fTtpZihPYmplY3QuZGVmaW5lUHJvcGVydHkpT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIngiLHt2YWx1ZTowfSk7aGFzRGVmaW5lUHJvcGVydHk9by54PT09MH1jYXRjaChlcnIpe2hhc0RlZmluZVByb3BlcnR5PWZhbHNlfWlmKGhhc0RlZmluZVByb3BlcnR5KXtPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCJkZWZhdWx0TWF4TGlzdGVuZXJzIix7ZW51bWVyYWJsZTp0cnVlLGdldDpmdW5jdGlvbigpe3JldHVybiBkZWZhdWx0TWF4TGlzdGVuZXJzfSxzZXQ6ZnVuY3Rpb24oYXJnKXtpZih0eXBlb2YgYXJnIT09Im51bWJlciJ8fGFyZzwwfHxhcmchPT1hcmcpdGhyb3cgbmV3IFR5cGVFcnJvcignImRlZmF1bHRNYXhMaXN0ZW5lcnMiIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtkZWZhdWx0TWF4TGlzdGVuZXJzPWFyZ319KX1lbHNle0V2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzPWRlZmF1bHRNYXhMaXN0ZW5lcnN9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnM9ZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pe2lmKHR5cGVvZiBuIT09Im51bWJlciJ8fG48MHx8aXNOYU4obikpdGhyb3cgbmV3IFR5cGVFcnJvcignIm4iIGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTt0aGlzLl9tYXhMaXN0ZW5lcnM9bjtyZXR1cm4gdGhpc307ZnVuY3Rpb24gJGdldE1heExpc3RlbmVycyh0aGF0KXtpZih0aGF0Ll9tYXhMaXN0ZW5lcnM9PT11bmRlZmluZWQpcmV0dXJuIEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO3JldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnN9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnM9ZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCl7cmV0dXJuICRnZXRNYXhMaXN0ZW5lcnModGhpcyl9O2Z1bmN0aW9uIGVtaXROb25lKGhhbmRsZXIsaXNGbixzZWxmKXtpZihpc0ZuKWhhbmRsZXIuY2FsbChzZWxmKTtlbHNle3ZhciBsZW49aGFuZGxlci5sZW5ndGg7dmFyIGxpc3RlbmVycz1hcnJheUNsb25lKGhhbmRsZXIsbGVuKTtmb3IodmFyIGk9MDtpPGxlbjsrK2kpbGlzdGVuZXJzW2ldLmNhbGwoc2VsZil9fWZ1bmN0aW9uIGVtaXRPbmUoaGFuZGxlcixpc0ZuLHNlbGYsYXJnMSl7aWYoaXNGbiloYW5kbGVyLmNhbGwoc2VsZixhcmcxKTtlbHNle3ZhciBsZW49aGFuZGxlci5sZW5ndGg7dmFyIGxpc3RlbmVycz1hcnJheUNsb25lKGhhbmRsZXIsbGVuKTtmb3IodmFyIGk9MDtpPGxlbjsrK2kpbGlzdGVuZXJzW2ldLmNhbGwoc2VsZixhcmcxKX19ZnVuY3Rpb24gZW1pdFR3byhoYW5kbGVyLGlzRm4sc2VsZixhcmcxLGFyZzIpe2lmKGlzRm4paGFuZGxlci5jYWxsKHNlbGYsYXJnMSxhcmcyKTtlbHNle3ZhciBsZW49aGFuZGxlci5sZW5ndGg7dmFyIGxpc3RlbmVycz1hcnJheUNsb25lKGhhbmRsZXIsbGVuKTtmb3IodmFyIGk9MDtpPGxlbjsrK2kpbGlzdGVuZXJzW2ldLmNhbGwoc2VsZixhcmcxLGFyZzIpfX1mdW5jdGlvbiBlbWl0VGhyZWUoaGFuZGxlcixpc0ZuLHNlbGYsYXJnMSxhcmcyLGFyZzMpe2lmKGlzRm4paGFuZGxlci5jYWxsKHNlbGYsYXJnMSxhcmcyLGFyZzMpO2Vsc2V7dmFyIGxlbj1oYW5kbGVyLmxlbmd0aDt2YXIgbGlzdGVuZXJzPWFycmF5Q2xvbmUoaGFuZGxlcixsZW4pO2Zvcih2YXIgaT0wO2k8bGVuOysraSlsaXN0ZW5lcnNbaV0uY2FsbChzZWxmLGFyZzEsYXJnMixhcmczKX19ZnVuY3Rpb24gZW1pdE1hbnkoaGFuZGxlcixpc0ZuLHNlbGYsYXJncyl7aWYoaXNGbiloYW5kbGVyLmFwcGx5KHNlbGYsYXJncyk7ZWxzZXt2YXIgbGVuPWhhbmRsZXIubGVuZ3RoO3ZhciBsaXN0ZW5lcnM9YXJyYXlDbG9uZShoYW5kbGVyLGxlbik7Zm9yKHZhciBpPTA7aTxsZW47KytpKWxpc3RlbmVyc1tpXS5hcHBseShzZWxmLGFyZ3MpfX1FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQ9ZnVuY3Rpb24gZW1pdCh0eXBlKXt2YXIgZXIsaGFuZGxlcixsZW4sYXJncyxpLGV2ZW50czt2YXIgZG9FcnJvcj10eXBlPT09ImVycm9yIjtldmVudHM9dGhpcy5fZXZlbnRzO2lmKGV2ZW50cylkb0Vycm9yPWRvRXJyb3ImJmV2ZW50cy5lcnJvcj09bnVsbDtlbHNlIGlmKCFkb0Vycm9yKXJldHVybiBmYWxzZTtpZihkb0Vycm9yKXtpZihhcmd1bWVudHMubGVuZ3RoPjEpZXI9YXJndW1lbnRzWzFdO2lmKGVyIGluc3RhbmNlb2YgRXJyb3Ipe3Rocm93IGVyfWVsc2V7dmFyIGVycj1uZXcgRXJyb3IoJ1VuaGFuZGxlZCAiZXJyb3IiIGV2ZW50LiAoJytlcisiKSIpO2Vyci5jb250ZXh0PWVyO3Rocm93IGVycn1yZXR1cm4gZmFsc2V9aGFuZGxlcj1ldmVudHNbdHlwZV07aWYoIWhhbmRsZXIpcmV0dXJuIGZhbHNlO3ZhciBpc0ZuPXR5cGVvZiBoYW5kbGVyPT09ImZ1bmN0aW9uIjtsZW49YXJndW1lbnRzLmxlbmd0aDtzd2l0Y2gobGVuKXtjYXNlIDE6ZW1pdE5vbmUoaGFuZGxlcixpc0ZuLHRoaXMpO2JyZWFrO2Nhc2UgMjplbWl0T25lKGhhbmRsZXIsaXNGbix0aGlzLGFyZ3VtZW50c1sxXSk7YnJlYWs7Y2FzZSAzOmVtaXRUd28oaGFuZGxlcixpc0ZuLHRoaXMsYXJndW1lbnRzWzFdLGFyZ3VtZW50c1syXSk7YnJlYWs7Y2FzZSA0OmVtaXRUaHJlZShoYW5kbGVyLGlzRm4sdGhpcyxhcmd1bWVudHNbMV0sYXJndW1lbnRzWzJdLGFyZ3VtZW50c1szXSk7YnJlYWs7ZGVmYXVsdDphcmdzPW5ldyBBcnJheShsZW4tMSk7Zm9yKGk9MTtpPGxlbjtpKyspYXJnc1tpLTFdPWFyZ3VtZW50c1tpXTtlbWl0TWFueShoYW5kbGVyLGlzRm4sdGhpcyxhcmdzKX1yZXR1cm4gdHJ1ZX07ZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCx0eXBlLGxpc3RlbmVyLHByZXBlbmQpe3ZhciBtO3ZhciBldmVudHM7dmFyIGV4aXN0aW5nO2lmKHR5cGVvZiBsaXN0ZW5lciE9PSJmdW5jdGlvbiIpdGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3RlbmVyIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtldmVudHM9dGFyZ2V0Ll9ldmVudHM7aWYoIWV2ZW50cyl7ZXZlbnRzPXRhcmdldC5fZXZlbnRzPW9iamVjdENyZWF0ZShudWxsKTt0YXJnZXQuX2V2ZW50c0NvdW50PTB9ZWxzZXtpZihldmVudHMubmV3TGlzdGVuZXIpe3RhcmdldC5lbWl0KCJuZXdMaXN0ZW5lciIsdHlwZSxsaXN0ZW5lci5saXN0ZW5lcj9saXN0ZW5lci5saXN0ZW5lcjpsaXN0ZW5lcik7ZXZlbnRzPXRhcmdldC5fZXZlbnRzfWV4aXN0aW5nPWV2ZW50c1t0eXBlXX1pZighZXhpc3Rpbmcpe2V4aXN0aW5nPWV2ZW50c1t0eXBlXT1saXN0ZW5lcjsrK3RhcmdldC5fZXZlbnRzQ291bnR9ZWxzZXtpZih0eXBlb2YgZXhpc3Rpbmc9PT0iZnVuY3Rpb24iKXtleGlzdGluZz1ldmVudHNbdHlwZV09cHJlcGVuZD9bbGlzdGVuZXIsZXhpc3RpbmddOltleGlzdGluZyxsaXN0ZW5lcl19ZWxzZXtpZihwcmVwZW5kKXtleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKX1lbHNle2V4aXN0aW5nLnB1c2gobGlzdGVuZXIpfX1pZighZXhpc3Rpbmcud2FybmVkKXttPSRnZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtpZihtJiZtPjAmJmV4aXN0aW5nLmxlbmd0aD5tKXtleGlzdGluZy53YXJuZWQ9dHJ1ZTt2YXIgdz1uZXcgRXJyb3IoIlBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gIitleGlzdGluZy5sZW5ndGgrJyAiJytTdHJpbmcodHlwZSkrJyIgbGlzdGVuZXJzICcrImFkZGVkLiBVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byAiKyJpbmNyZWFzZSBsaW1pdC4iKTt3Lm5hbWU9Ik1heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyI7dy5lbWl0dGVyPXRhcmdldDt3LnR5cGU9dHlwZTt3LmNvdW50PWV4aXN0aW5nLmxlbmd0aDtpZih0eXBlb2YgY29uc29sZT09PSJvYmplY3QiJiZjb25zb2xlLndhcm4pe2NvbnNvbGUud2FybigiJXM6ICVzIix3Lm5hbWUsdy5tZXNzYWdlKX19fX1yZXR1cm4gdGFyZ2V0fUV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI9ZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSxsaXN0ZW5lcil7cmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLHR5cGUsbGlzdGVuZXIsZmFsc2UpfTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uPUV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXI9ZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsbGlzdGVuZXIpe3JldHVybiBfYWRkTGlzdGVuZXIodGhpcyx0eXBlLGxpc3RlbmVyLHRydWUpfTtmdW5jdGlvbiBvbmNlV3JhcHBlcigpe2lmKCF0aGlzLmZpcmVkKXt0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsdGhpcy53cmFwRm4pO3RoaXMuZmlyZWQ9dHJ1ZTtzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7Y2FzZSAwOnJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQpO2Nhc2UgMTpyZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0LGFyZ3VtZW50c1swXSk7Y2FzZSAyOnJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQsYXJndW1lbnRzWzBdLGFyZ3VtZW50c1sxXSk7Y2FzZSAzOnJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQsYXJndW1lbnRzWzBdLGFyZ3VtZW50c1sxXSxhcmd1bWVudHNbMl0pO2RlZmF1bHQ6dmFyIGFyZ3M9bmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO2Zvcih2YXIgaT0wO2k8YXJncy5sZW5ndGg7KytpKWFyZ3NbaV09YXJndW1lbnRzW2ldO3RoaXMubGlzdGVuZXIuYXBwbHkodGhpcy50YXJnZXQsYXJncyl9fX1mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LHR5cGUsbGlzdGVuZXIpe3ZhciBzdGF0ZT17ZmlyZWQ6ZmFsc2Usd3JhcEZuOnVuZGVmaW5lZCx0YXJnZXQ6dGFyZ2V0LHR5cGU6dHlwZSxsaXN0ZW5lcjpsaXN0ZW5lcn07dmFyIHdyYXBwZWQ9YmluZC5jYWxsKG9uY2VXcmFwcGVyLHN0YXRlKTt3cmFwcGVkLmxpc3RlbmVyPWxpc3RlbmVyO3N0YXRlLndyYXBGbj13cmFwcGVkO3JldHVybiB3cmFwcGVkfUV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZT1mdW5jdGlvbiBvbmNlKHR5cGUsbGlzdGVuZXIpe2lmKHR5cGVvZiBsaXN0ZW5lciE9PSJmdW5jdGlvbiIpdGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3RlbmVyIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTt0aGlzLm9uKHR5cGUsX29uY2VXcmFwKHRoaXMsdHlwZSxsaXN0ZW5lcikpO3JldHVybiB0aGlzfTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXI9ZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLGxpc3RlbmVyKXtpZih0eXBlb2YgbGlzdGVuZXIhPT0iZnVuY3Rpb24iKXRocm93IG5ldyBUeXBlRXJyb3IoJyJsaXN0ZW5lciIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7dGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSxfb25jZVdyYXAodGhpcyx0eXBlLGxpc3RlbmVyKSk7cmV0dXJuIHRoaXN9O0V2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI9ZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSxsaXN0ZW5lcil7dmFyIGxpc3QsZXZlbnRzLHBvc2l0aW9uLGksb3JpZ2luYWxMaXN0ZW5lcjtpZih0eXBlb2YgbGlzdGVuZXIhPT0iZnVuY3Rpb24iKXRocm93IG5ldyBUeXBlRXJyb3IoJyJsaXN0ZW5lciIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7ZXZlbnRzPXRoaXMuX2V2ZW50cztpZighZXZlbnRzKXJldHVybiB0aGlzO2xpc3Q9ZXZlbnRzW3R5cGVdO2lmKCFsaXN0KXJldHVybiB0aGlzO2lmKGxpc3Q9PT1saXN0ZW5lcnx8bGlzdC5saXN0ZW5lcj09PWxpc3RlbmVyKXtpZigtLXRoaXMuX2V2ZW50c0NvdW50PT09MCl0aGlzLl9ldmVudHM9b2JqZWN0Q3JlYXRlKG51bGwpO2Vsc2V7ZGVsZXRlIGV2ZW50c1t0eXBlXTtpZihldmVudHMucmVtb3ZlTGlzdGVuZXIpdGhpcy5lbWl0KCJyZW1vdmVMaXN0ZW5lciIsdHlwZSxsaXN0Lmxpc3RlbmVyfHxsaXN0ZW5lcil9fWVsc2UgaWYodHlwZW9mIGxpc3QhPT0iZnVuY3Rpb24iKXtwb3NpdGlvbj0tMTtmb3IoaT1saXN0Lmxlbmd0aC0xO2k+PTA7aS0tKXtpZihsaXN0W2ldPT09bGlzdGVuZXJ8fGxpc3RbaV0ubGlzdGVuZXI9PT1saXN0ZW5lcil7b3JpZ2luYWxMaXN0ZW5lcj1saXN0W2ldLmxpc3RlbmVyO3Bvc2l0aW9uPWk7YnJlYWt9fWlmKHBvc2l0aW9uPDApcmV0dXJuIHRoaXM7aWYocG9zaXRpb249PT0wKWxpc3Quc2hpZnQoKTtlbHNlIHNwbGljZU9uZShsaXN0LHBvc2l0aW9uKTtpZihsaXN0Lmxlbmd0aD09PTEpZXZlbnRzW3R5cGVdPWxpc3RbMF07aWYoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKXRoaXMuZW1pdCgicmVtb3ZlTGlzdGVuZXIiLHR5cGUsb3JpZ2luYWxMaXN0ZW5lcnx8bGlzdGVuZXIpfXJldHVybiB0aGlzfTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycz1mdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSl7dmFyIGxpc3RlbmVycyxldmVudHMsaTtldmVudHM9dGhpcy5fZXZlbnRzO2lmKCFldmVudHMpcmV0dXJuIHRoaXM7aWYoIWV2ZW50cy5yZW1vdmVMaXN0ZW5lcil7aWYoYXJndW1lbnRzLmxlbmd0aD09PTApe3RoaXMuX2V2ZW50cz1vYmplY3RDcmVhdGUobnVsbCk7dGhpcy5fZXZlbnRzQ291bnQ9MH1lbHNlIGlmKGV2ZW50c1t0eXBlXSl7aWYoLS10aGlzLl9ldmVudHNDb3VudD09PTApdGhpcy5fZXZlbnRzPW9iamVjdENyZWF0ZShudWxsKTtlbHNlIGRlbGV0ZSBldmVudHNbdHlwZV19cmV0dXJuIHRoaXN9aWYoYXJndW1lbnRzLmxlbmd0aD09PTApe3ZhciBrZXlzPW9iamVjdEtleXMoZXZlbnRzKTt2YXIga2V5O2ZvcihpPTA7aTxrZXlzLmxlbmd0aDsrK2kpe2tleT1rZXlzW2ldO2lmKGtleT09PSJyZW1vdmVMaXN0ZW5lciIpY29udGludWU7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KX10aGlzLnJlbW92ZUFsbExpc3RlbmVycygicmVtb3ZlTGlzdGVuZXIiKTt0aGlzLl9ldmVudHM9b2JqZWN0Q3JlYXRlKG51bGwpO3RoaXMuX2V2ZW50c0NvdW50PTA7cmV0dXJuIHRoaXN9bGlzdGVuZXJzPWV2ZW50c1t0eXBlXTtpZih0eXBlb2YgbGlzdGVuZXJzPT09ImZ1bmN0aW9uIil7dGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLGxpc3RlbmVycyl9ZWxzZSBpZihsaXN0ZW5lcnMpe2ZvcihpPWxpc3RlbmVycy5sZW5ndGgtMTtpPj0wO2ktLSl7dGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLGxpc3RlbmVyc1tpXSl9fXJldHVybiB0aGlzfTtmdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCx0eXBlLHVud3JhcCl7dmFyIGV2ZW50cz10YXJnZXQuX2V2ZW50cztpZighZXZlbnRzKXJldHVybltdO3ZhciBldmxpc3RlbmVyPWV2ZW50c1t0eXBlXTtpZighZXZsaXN0ZW5lcilyZXR1cm5bXTtpZih0eXBlb2YgZXZsaXN0ZW5lcj09PSJmdW5jdGlvbiIpcmV0dXJuIHVud3JhcD9bZXZsaXN0ZW5lci5saXN0ZW5lcnx8ZXZsaXN0ZW5lcl06W2V2bGlzdGVuZXJdO3JldHVybiB1bndyYXA/dW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpOmFycmF5Q2xvbmUoZXZsaXN0ZW5lcixldmxpc3RlbmVyLmxlbmd0aCl9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnM9ZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpe3JldHVybiBfbGlzdGVuZXJzKHRoaXMsdHlwZSx0cnVlKX07RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnM9ZnVuY3Rpb24gcmF3TGlzdGVuZXJzKHR5cGUpe3JldHVybiBfbGlzdGVuZXJzKHRoaXMsdHlwZSxmYWxzZSl9O0V2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50PWZ1bmN0aW9uKGVtaXR0ZXIsdHlwZSl7aWYodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudD09PSJmdW5jdGlvbiIpe3JldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSl9ZWxzZXtyZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsdHlwZSl9fTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQ9bGlzdGVuZXJDb3VudDtmdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpe3ZhciBldmVudHM9dGhpcy5fZXZlbnRzO2lmKGV2ZW50cyl7dmFyIGV2bGlzdGVuZXI9ZXZlbnRzW3R5cGVdO2lmKHR5cGVvZiBldmxpc3RlbmVyPT09ImZ1bmN0aW9uIil7cmV0dXJuIDF9ZWxzZSBpZihldmxpc3RlbmVyKXtyZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGh9fXJldHVybiAwfUV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcz1mdW5jdGlvbiBldmVudE5hbWVzKCl7cmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50PjA/UmVmbGVjdC5vd25LZXlzKHRoaXMuX2V2ZW50cyk6W119O2Z1bmN0aW9uIHNwbGljZU9uZShsaXN0LGluZGV4KXtmb3IodmFyIGk9aW5kZXgsaz1pKzEsbj1saXN0Lmxlbmd0aDtrPG47aSs9MSxrKz0xKWxpc3RbaV09bGlzdFtrXTtsaXN0LnBvcCgpfWZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLG4pe3ZhciBjb3B5PW5ldyBBcnJheShuKTtmb3IodmFyIGk9MDtpPG47KytpKWNvcHlbaV09YXJyW2ldO3JldHVybiBjb3B5fWZ1bmN0aW9uIHVud3JhcExpc3RlbmVycyhhcnIpe3ZhciByZXQ9bmV3IEFycmF5KGFyci5sZW5ndGgpO2Zvcih2YXIgaT0wO2k8cmV0Lmxlbmd0aDsrK2kpe3JldFtpXT1hcnJbaV0ubGlzdGVuZXJ8fGFycltpXX1yZXR1cm4gcmV0fWZ1bmN0aW9uIG9iamVjdENyZWF0ZVBvbHlmaWxsKHByb3RvKXt2YXIgRj1mdW5jdGlvbigpe307Ri5wcm90b3R5cGU9cHJvdG87cmV0dXJuIG5ldyBGfWZ1bmN0aW9uIG9iamVjdEtleXNQb2x5ZmlsbChvYmope3ZhciBrZXlzPVtdO2Zvcih2YXIgayBpbiBvYmopaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaixrKSl7a2V5cy5wdXNoKGspfXJldHVybiBrfWZ1bmN0aW9uIGZ1bmN0aW9uQmluZFBvbHlmaWxsKGNvbnRleHQpe3ZhciBmbj10aGlzO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBmbi5hcHBseShjb250ZXh0LGFyZ3VtZW50cyl9fX0se31dLDM0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgVHJhbnNmb3JtPXJlcXVpcmUoInN0cmVhbSIpLlRyYW5zZm9ybTt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTtmdW5jdGlvbiB0aHJvd0lmTm90U3RyaW5nT3JCdWZmZXIodmFsLHByZWZpeCl7aWYoIUJ1ZmZlci5pc0J1ZmZlcih2YWwpJiZ0eXBlb2YgdmFsIT09InN0cmluZyIpe3Rocm93IG5ldyBUeXBlRXJyb3IocHJlZml4KyIgbXVzdCBiZSBhIHN0cmluZyBvciBhIGJ1ZmZlciIpfX1mdW5jdGlvbiBIYXNoQmFzZShibG9ja1NpemUpe1RyYW5zZm9ybS5jYWxsKHRoaXMpO3RoaXMuX2Jsb2NrPUJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja1NpemUpO3RoaXMuX2Jsb2NrU2l6ZT1ibG9ja1NpemU7dGhpcy5fYmxvY2tPZmZzZXQ9MDt0aGlzLl9sZW5ndGg9WzAsMCwwLDBdO3RoaXMuX2ZpbmFsaXplZD1mYWxzZX1pbmhlcml0cyhIYXNoQmFzZSxUcmFuc2Zvcm0pO0hhc2hCYXNlLnByb3RvdHlwZS5fdHJhbnNmb3JtPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNhbGxiYWNrKXt2YXIgZXJyb3I9bnVsbDt0cnl7dGhpcy51cGRhdGUoY2h1bmssZW5jb2RpbmcpfWNhdGNoKGVycil7ZXJyb3I9ZXJyfWNhbGxiYWNrKGVycm9yKX07SGFzaEJhc2UucHJvdG90eXBlLl9mbHVzaD1mdW5jdGlvbihjYWxsYmFjayl7dmFyIGVycm9yPW51bGw7dHJ5e3RoaXMucHVzaCh0aGlzLmRpZ2VzdCgpKX1jYXRjaChlcnIpe2Vycm9yPWVycn1jYWxsYmFjayhlcnJvcil9O0hhc2hCYXNlLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oZGF0YSxlbmNvZGluZyl7dGhyb3dJZk5vdFN0cmluZ09yQnVmZmVyKGRhdGEsIkRhdGEiKTtpZih0aGlzLl9maW5hbGl6ZWQpdGhyb3cgbmV3IEVycm9yKCJEaWdlc3QgYWxyZWFkeSBjYWxsZWQiKTtpZighQnVmZmVyLmlzQnVmZmVyKGRhdGEpKWRhdGE9QnVmZmVyLmZyb20oZGF0YSxlbmNvZGluZyk7dmFyIGJsb2NrPXRoaXMuX2Jsb2NrO3ZhciBvZmZzZXQ9MDt3aGlsZSh0aGlzLl9ibG9ja09mZnNldCtkYXRhLmxlbmd0aC1vZmZzZXQ+PXRoaXMuX2Jsb2NrU2l6ZSl7Zm9yKHZhciBpPXRoaXMuX2Jsb2NrT2Zmc2V0O2k8dGhpcy5fYmxvY2tTaXplOylibG9ja1tpKytdPWRhdGFbb2Zmc2V0KytdO3RoaXMuX3VwZGF0ZSgpO3RoaXMuX2Jsb2NrT2Zmc2V0PTB9d2hpbGUob2Zmc2V0PGRhdGEubGVuZ3RoKWJsb2NrW3RoaXMuX2Jsb2NrT2Zmc2V0KytdPWRhdGFbb2Zmc2V0KytdO2Zvcih2YXIgaj0wLGNhcnJ5PWRhdGEubGVuZ3RoKjg7Y2Fycnk+MDsrK2ope3RoaXMuX2xlbmd0aFtqXSs9Y2Fycnk7Y2Fycnk9dGhpcy5fbGVuZ3RoW2pdLzQyOTQ5NjcyOTZ8MDtpZihjYXJyeT4wKXRoaXMuX2xlbmd0aFtqXS09NDI5NDk2NzI5NipjYXJyeX1yZXR1cm4gdGhpc307SGFzaEJhc2UucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoIl91cGRhdGUgaXMgbm90IGltcGxlbWVudGVkIil9O0hhc2hCYXNlLnByb3RvdHlwZS5kaWdlc3Q9ZnVuY3Rpb24oZW5jb2Rpbmcpe2lmKHRoaXMuX2ZpbmFsaXplZCl0aHJvdyBuZXcgRXJyb3IoIkRpZ2VzdCBhbHJlYWR5IGNhbGxlZCIpO3RoaXMuX2ZpbmFsaXplZD10cnVlO3ZhciBkaWdlc3Q9dGhpcy5fZGlnZXN0KCk7aWYoZW5jb2RpbmchPT11bmRlZmluZWQpZGlnZXN0PWRpZ2VzdC50b1N0cmluZyhlbmNvZGluZyk7dGhpcy5fYmxvY2suZmlsbCgwKTt0aGlzLl9ibG9ja09mZnNldD0wO2Zvcih2YXIgaT0wO2k8NDsrK2kpdGhpcy5fbGVuZ3RoW2ldPTA7cmV0dXJuIGRpZ2VzdH07SGFzaEJhc2UucHJvdG90eXBlLl9kaWdlc3Q9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoIl9kaWdlc3QgaXMgbm90IGltcGxlbWVudGVkIil9O21vZHVsZS5leHBvcnRzPUhhc2hCYXNlfSx7aW5oZXJpdHM6MzYsInNhZmUtYnVmZmVyIjo3OSxzdHJlYW06OTh9XSwzNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7ZXhwb3J0cy5yZWFkPWZ1bmN0aW9uKGJ1ZmZlcixvZmZzZXQsaXNMRSxtTGVuLG5CeXRlcyl7dmFyIGUsbTt2YXIgZUxlbj1uQnl0ZXMqOC1tTGVuLTE7dmFyIGVNYXg9KDE8PGVMZW4pLTE7dmFyIGVCaWFzPWVNYXg+PjE7dmFyIG5CaXRzPS03O3ZhciBpPWlzTEU/bkJ5dGVzLTE6MDt2YXIgZD1pc0xFPy0xOjE7dmFyIHM9YnVmZmVyW29mZnNldCtpXTtpKz1kO2U9cyYoMTw8LW5CaXRzKS0xO3M+Pj0tbkJpdHM7bkJpdHMrPWVMZW47Zm9yKDtuQml0cz4wO2U9ZSoyNTYrYnVmZmVyW29mZnNldCtpXSxpKz1kLG5CaXRzLT04KXt9bT1lJigxPDwtbkJpdHMpLTE7ZT4+PS1uQml0cztuQml0cys9bUxlbjtmb3IoO25CaXRzPjA7bT1tKjI1NitidWZmZXJbb2Zmc2V0K2ldLGkrPWQsbkJpdHMtPTgpe31pZihlPT09MCl7ZT0xLWVCaWFzfWVsc2UgaWYoZT09PWVNYXgpe3JldHVybiBtP05hTjoocz8tMToxKSpJbmZpbml0eX1lbHNle209bStNYXRoLnBvdygyLG1MZW4pO2U9ZS1lQmlhc31yZXR1cm4ocz8tMToxKSptKk1hdGgucG93KDIsZS1tTGVuKX07ZXhwb3J0cy53cml0ZT1mdW5jdGlvbihidWZmZXIsdmFsdWUsb2Zmc2V0LGlzTEUsbUxlbixuQnl0ZXMpe3ZhciBlLG0sYzt2YXIgZUxlbj1uQnl0ZXMqOC1tTGVuLTE7dmFyIGVNYXg9KDE8PGVMZW4pLTE7dmFyIGVCaWFzPWVNYXg+PjE7dmFyIHJ0PW1MZW49PT0yMz9NYXRoLnBvdygyLC0yNCktTWF0aC5wb3coMiwtNzcpOjA7dmFyIGk9aXNMRT8wOm5CeXRlcy0xO3ZhciBkPWlzTEU/MTotMTt2YXIgcz12YWx1ZTwwfHx2YWx1ZT09PTAmJjEvdmFsdWU8MD8xOjA7dmFsdWU9TWF0aC5hYnModmFsdWUpO2lmKGlzTmFOKHZhbHVlKXx8dmFsdWU9PT1JbmZpbml0eSl7bT1pc05hTih2YWx1ZSk/MTowO2U9ZU1heH1lbHNle2U9TWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkvTWF0aC5MTjIpO2lmKHZhbHVlKihjPU1hdGgucG93KDIsLWUpKTwxKXtlLS07Yyo9Mn1pZihlK2VCaWFzPj0xKXt2YWx1ZSs9cnQvY31lbHNle3ZhbHVlKz1ydCpNYXRoLnBvdygyLDEtZUJpYXMpfWlmKHZhbHVlKmM+PTIpe2UrKztjLz0yfWlmKGUrZUJpYXM+PWVNYXgpe209MDtlPWVNYXh9ZWxzZSBpZihlK2VCaWFzPj0xKXttPSh2YWx1ZSpjLTEpKk1hdGgucG93KDIsbUxlbik7ZT1lK2VCaWFzfWVsc2V7bT12YWx1ZSpNYXRoLnBvdygyLGVCaWFzLTEpKk1hdGgucG93KDIsbUxlbik7ZT0wfX1mb3IoO21MZW4+PTg7YnVmZmVyW29mZnNldCtpXT1tJjI1NSxpKz1kLG0vPTI1NixtTGVuLT04KXt9ZT1lPDxtTGVufG07ZUxlbis9bUxlbjtmb3IoO2VMZW4+MDtidWZmZXJbb2Zmc2V0K2ldPWUmMjU1LGkrPWQsZS89MjU2LGVMZW4tPTgpe31idWZmZXJbb2Zmc2V0K2ktZF18PXMqMTI4fX0se31dLDM2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtpZih0eXBlb2YgT2JqZWN0LmNyZWF0ZT09PSJmdW5jdGlvbiIpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGluaGVyaXRzKGN0b3Isc3VwZXJDdG9yKXtpZihzdXBlckN0b3Ipe2N0b3Iuc3VwZXJfPXN1cGVyQ3RvcjtjdG9yLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTpjdG9yLGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZX19KX19fWVsc2V7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaW5oZXJpdHMoY3RvcixzdXBlckN0b3Ipe2lmKHN1cGVyQ3Rvcil7Y3Rvci5zdXBlcl89c3VwZXJDdG9yO3ZhciBUZW1wQ3Rvcj1mdW5jdGlvbigpe307VGVtcEN0b3IucHJvdG90eXBlPXN1cGVyQ3Rvci5wcm90b3R5cGU7Y3Rvci5wcm90b3R5cGU9bmV3IFRlbXBDdG9yO2N0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yPWN0b3J9fX19LHt9XSwzNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24ob2JqKXtyZXR1cm4gb2JqIT1udWxsJiYoaXNCdWZmZXIob2JqKXx8aXNTbG93QnVmZmVyKG9iail8fCEhb2JqLl9pc0J1ZmZlcil9O2Z1bmN0aW9uIGlzQnVmZmVyKG9iail7cmV0dXJuISFvYmouY29uc3RydWN0b3ImJnR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXI9PT0iZnVuY3Rpb24iJiZvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKX1mdW5jdGlvbiBpc1Nsb3dCdWZmZXIob2JqKXtyZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRT09PSJmdW5jdGlvbiImJnR5cGVvZiBvYmouc2xpY2U9PT0iZnVuY3Rpb24iJiZpc0J1ZmZlcihvYmouc2xpY2UoMCwwKSl9fSx7fV0sMzg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciB0b1N0cmluZz17fS50b1N0cmluZzttb2R1bGUuZXhwb3J0cz1BcnJheS5pc0FycmF5fHxmdW5jdGlvbihhcnIpe3JldHVybiB0b1N0cmluZy5jYWxsKGFycik9PSJbb2JqZWN0IEFycmF5XSJ9fSx7fV0sMzk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaEJhc2U9cmVxdWlyZSgiaGFzaC1iYXNlIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgQVJSQVkxNj1uZXcgQXJyYXkoMTYpO2Z1bmN0aW9uIE1ENSgpe0hhc2hCYXNlLmNhbGwodGhpcyw2NCk7dGhpcy5fYT0xNzMyNTg0MTkzO3RoaXMuX2I9NDAyMzIzMzQxNzt0aGlzLl9jPTI1NjIzODMxMDI7dGhpcy5fZD0yNzE3MzM4Nzh9aW5oZXJpdHMoTUQ1LEhhc2hCYXNlKTtNRDUucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oKXt2YXIgTT1BUlJBWTE2O2Zvcih2YXIgaT0wO2k8MTY7KytpKU1baV09dGhpcy5fYmxvY2sucmVhZEludDMyTEUoaSo0KTt2YXIgYT10aGlzLl9hO3ZhciBiPXRoaXMuX2I7dmFyIGM9dGhpcy5fYzt2YXIgZD10aGlzLl9kO2E9Zm5GKGEsYixjLGQsTVswXSwzNjE0MDkwMzYwLDcpO2Q9Zm5GKGQsYSxiLGMsTVsxXSwzOTA1NDAyNzEwLDEyKTtjPWZuRihjLGQsYSxiLE1bMl0sNjA2MTA1ODE5LDE3KTtiPWZuRihiLGMsZCxhLE1bM10sMzI1MDQ0MTk2NiwyMik7YT1mbkYoYSxiLGMsZCxNWzRdLDQxMTg1NDgzOTksNyk7ZD1mbkYoZCxhLGIsYyxNWzVdLDEyMDAwODA0MjYsMTIpO2M9Zm5GKGMsZCxhLGIsTVs2XSwyODIxNzM1OTU1LDE3KTtiPWZuRihiLGMsZCxhLE1bN10sNDI0OTI2MTMxMywyMik7YT1mbkYoYSxiLGMsZCxNWzhdLDE3NzAwMzU0MTYsNyk7ZD1mbkYoZCxhLGIsYyxNWzldLDIzMzY1NTI4NzksMTIpO2M9Zm5GKGMsZCxhLGIsTVsxMF0sNDI5NDkyNTIzMywxNyk7Yj1mbkYoYixjLGQsYSxNWzExXSwyMzA0NTYzMTM0LDIyKTthPWZuRihhLGIsYyxkLE1bMTJdLDE4MDQ2MDM2ODIsNyk7ZD1mbkYoZCxhLGIsYyxNWzEzXSw0MjU0NjI2MTk1LDEyKTtjPWZuRihjLGQsYSxiLE1bMTRdLDI3OTI5NjUwMDYsMTcpO2I9Zm5GKGIsYyxkLGEsTVsxNV0sMTIzNjUzNTMyOSwyMik7YT1mbkcoYSxiLGMsZCxNWzFdLDQxMjkxNzA3ODYsNSk7ZD1mbkcoZCxhLGIsYyxNWzZdLDMyMjU0NjU2NjQsOSk7Yz1mbkcoYyxkLGEsYixNWzExXSw2NDM3MTc3MTMsMTQpO2I9Zm5HKGIsYyxkLGEsTVswXSwzOTIxMDY5OTk0LDIwKTthPWZuRyhhLGIsYyxkLE1bNV0sMzU5MzQwODYwNSw1KTtkPWZuRyhkLGEsYixjLE1bMTBdLDM4MDE2MDgzLDkpO2M9Zm5HKGMsZCxhLGIsTVsxNV0sMzYzNDQ4ODk2MSwxNCk7Yj1mbkcoYixjLGQsYSxNWzRdLDM4ODk0Mjk0NDgsMjApO2E9Zm5HKGEsYixjLGQsTVs5XSw1Njg0NDY0MzgsNSk7ZD1mbkcoZCxhLGIsYyxNWzE0XSwzMjc1MTYzNjA2LDkpO2M9Zm5HKGMsZCxhLGIsTVszXSw0MTA3NjAzMzM1LDE0KTtiPWZuRyhiLGMsZCxhLE1bOF0sMTE2MzUzMTUwMSwyMCk7YT1mbkcoYSxiLGMsZCxNWzEzXSwyODUwMjg1ODI5LDUpO2Q9Zm5HKGQsYSxiLGMsTVsyXSw0MjQzNTYzNTEyLDkpO2M9Zm5HKGMsZCxhLGIsTVs3XSwxNzM1MzI4NDczLDE0KTtiPWZuRyhiLGMsZCxhLE1bMTJdLDIzNjgzNTk1NjIsMjApO2E9Zm5IKGEsYixjLGQsTVs1XSw0Mjk0NTg4NzM4LDQpO2Q9Zm5IKGQsYSxiLGMsTVs4XSwyMjcyMzkyODMzLDExKTtjPWZuSChjLGQsYSxiLE1bMTFdLDE4MzkwMzA1NjIsMTYpO2I9Zm5IKGIsYyxkLGEsTVsxNF0sNDI1OTY1Nzc0MCwyMyk7YT1mbkgoYSxiLGMsZCxNWzFdLDI3NjM5NzUyMzYsNCk7ZD1mbkgoZCxhLGIsYyxNWzRdLDEyNzI4OTMzNTMsMTEpO2M9Zm5IKGMsZCxhLGIsTVs3XSw0MTM5NDY5NjY0LDE2KTtiPWZuSChiLGMsZCxhLE1bMTBdLDMyMDAyMzY2NTYsMjMpO2E9Zm5IKGEsYixjLGQsTVsxM10sNjgxMjc5MTc0LDQpO2Q9Zm5IKGQsYSxiLGMsTVswXSwzOTM2NDMwMDc0LDExKTtjPWZuSChjLGQsYSxiLE1bM10sMzU3MjQ0NTMxNywxNik7Yj1mbkgoYixjLGQsYSxNWzZdLDc2MDI5MTg5LDIzKTthPWZuSChhLGIsYyxkLE1bOV0sMzY1NDYwMjgwOSw0KTtkPWZuSChkLGEsYixjLE1bMTJdLDM4NzMxNTE0NjEsMTEpO2M9Zm5IKGMsZCxhLGIsTVsxNV0sNTMwNzQyNTIwLDE2KTtiPWZuSChiLGMsZCxhLE1bMl0sMzI5OTYyODY0NSwyMyk7YT1mbkkoYSxiLGMsZCxNWzBdLDQwOTYzMzY0NTIsNik7ZD1mbkkoZCxhLGIsYyxNWzddLDExMjY4OTE0MTUsMTApO2M9Zm5JKGMsZCxhLGIsTVsxNF0sMjg3ODYxMjM5MSwxNSk7Yj1mbkkoYixjLGQsYSxNWzVdLDQyMzc1MzMyNDEsMjEpO2E9Zm5JKGEsYixjLGQsTVsxMl0sMTcwMDQ4NTU3MSw2KTtkPWZuSShkLGEsYixjLE1bM10sMjM5OTk4MDY5MCwxMCk7Yz1mbkkoYyxkLGEsYixNWzEwXSw0MjkzOTE1NzczLDE1KTtiPWZuSShiLGMsZCxhLE1bMV0sMjI0MDA0NDQ5NywyMSk7YT1mbkkoYSxiLGMsZCxNWzhdLDE4NzMzMTMzNTksNik7ZD1mbkkoZCxhLGIsYyxNWzE1XSw0MjY0MzU1NTUyLDEwKTtjPWZuSShjLGQsYSxiLE1bNl0sMjczNDc2ODkxNiwxNSk7Yj1mbkkoYixjLGQsYSxNWzEzXSwxMzA5MTUxNjQ5LDIxKTthPWZuSShhLGIsYyxkLE1bNF0sNDE0OTQ0NDIyNiw2KTtkPWZuSShkLGEsYixjLE1bMTFdLDMxNzQ3NTY5MTcsMTApO2M9Zm5JKGMsZCxhLGIsTVsyXSw3MTg3ODcyNTksMTUpO2I9Zm5JKGIsYyxkLGEsTVs5XSwzOTUxNDgxNzQ1LDIxKTt0aGlzLl9hPXRoaXMuX2ErYXwwO3RoaXMuX2I9dGhpcy5fYitifDA7dGhpcy5fYz10aGlzLl9jK2N8MDt0aGlzLl9kPXRoaXMuX2QrZHwwfTtNRDUucHJvdG90eXBlLl9kaWdlc3Q9ZnVuY3Rpb24oKXt0aGlzLl9ibG9ja1t0aGlzLl9ibG9ja09mZnNldCsrXT0xMjg7aWYodGhpcy5fYmxvY2tPZmZzZXQ+NTYpe3RoaXMuX2Jsb2NrLmZpbGwoMCx0aGlzLl9ibG9ja09mZnNldCw2NCk7dGhpcy5fdXBkYXRlKCk7dGhpcy5fYmxvY2tPZmZzZXQ9MH10aGlzLl9ibG9jay5maWxsKDAsdGhpcy5fYmxvY2tPZmZzZXQsNTYpO3RoaXMuX2Jsb2NrLndyaXRlVUludDMyTEUodGhpcy5fbGVuZ3RoWzBdLDU2KTt0aGlzLl9ibG9jay53cml0ZVVJbnQzMkxFKHRoaXMuX2xlbmd0aFsxXSw2MCk7dGhpcy5fdXBkYXRlKCk7dmFyIGJ1ZmZlcj1CdWZmZXIuYWxsb2NVbnNhZmUoMTYpO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fYSwwKTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2IsNCk7YnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9jLDgpO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fZCwxMik7cmV0dXJuIGJ1ZmZlcn07ZnVuY3Rpb24gcm90bCh4LG4pe3JldHVybiB4PDxufHg+Pj4zMi1ufWZ1bmN0aW9uIGZuRihhLGIsYyxkLG0sayxzKXtyZXR1cm4gcm90bChhKyhiJmN8fmImZCkrbStrfDAscykrYnwwfWZ1bmN0aW9uIGZuRyhhLGIsYyxkLG0sayxzKXtyZXR1cm4gcm90bChhKyhiJmR8YyZ+ZCkrbStrfDAscykrYnwwfWZ1bmN0aW9uIGZuSChhLGIsYyxkLG0sayxzKXtyZXR1cm4gcm90bChhKyhiXmNeZCkrbStrfDAscykrYnwwfWZ1bmN0aW9uIGZuSShhLGIsYyxkLG0sayxzKXtyZXR1cm4gcm90bChhKyhjXihifH5kKSkrbStrfDAscykrYnwwfW1vZHVsZS5leHBvcnRzPU1ENX0seyJoYXNoLWJhc2UiOjM0LGluaGVyaXRzOjM2LCJzYWZlLWJ1ZmZlciI6Nzl9XSw0MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIGNvbnN0YW50cz1yZXF1aXJlKCJjb25zdGFudHMiKTt2YXIgcnNhPXJlcXVpcmUoIi4vbGlicy9yc2EuanMiKTt2YXIgXz1yZXF1aXJlKCIuL3V0aWxzIikuXzt2YXIgdXRpbHM9cmVxdWlyZSgiLi91dGlscyIpO3ZhciBzY2hlbWVzPXJlcXVpcmUoIi4vc2NoZW1lcy9zY2hlbWVzLmpzIik7dmFyIGZvcm1hdHM9cmVxdWlyZSgiLi9mb3JtYXRzL2Zvcm1hdHMuanMiKTt2YXIgc2VlZHJhbmRvbT1yZXF1aXJlKCJzZWVkcmFuZG9tIik7aWYodHlwZW9mIGNvbnN0YW50cy5SU0FfTk9fUEFERElORz09PSJ1bmRlZmluZWQiKXtjb25zdGFudHMuUlNBX05PX1BBRERJTkc9M31tb2R1bGUuZXhwb3J0cz1mdW5jdGlvbigpe3ZhciBTVVBQT1JURURfSEFTSF9BTEdPUklUSE1TPXtub2RlMTA6WyJtZDQiLCJtZDUiLCJyaXBlbWQxNjAiLCJzaGExIiwic2hhMjI0Iiwic2hhMjU2Iiwic2hhMzg0Iiwic2hhNTEyIl0sbm9kZTpbIm1kNCIsIm1kNSIsInJpcGVtZDE2MCIsInNoYTEiLCJzaGEyMjQiLCJzaGEyNTYiLCJzaGEzODQiLCJzaGE1MTIiXSxpb2pzOlsibWQ0IiwibWQ1IiwicmlwZW1kMTYwIiwic2hhMSIsInNoYTIyNCIsInNoYTI1NiIsInNoYTM4NCIsInNoYTUxMiJdLGJyb3dzZXI6WyJtZDUiLCJyaXBlbWQxNjAiLCJzaGExIiwic2hhMjU2Iiwic2hhNTEyIl19O3ZhciBERUZBVUxUX0VOQ1JZUFRJT05fU0NIRU1FPSJwa2NzMV9vYWVwIjt2YXIgREVGQVVMVF9TSUdOSU5HX1NDSEVNRT0icGtjczEiO3ZhciBERUZBVUxUX0VYUE9SVF9GT1JNQVQ9InByaXZhdGUiO3ZhciBFWFBPUlRfRk9STUFUX0FMSUFTRVM9e3ByaXZhdGU6InBrY3MxLXByaXZhdGUtcGVtIiwicHJpdmF0ZS1kZXIiOiJwa2NzMS1wcml2YXRlLWRlciIscHVibGljOiJwa2NzOC1wdWJsaWMtcGVtIiwicHVibGljLWRlciI6InBrY3M4LXB1YmxpYy1kZXIifTtmdW5jdGlvbiBOb2RlUlNBKGtleSxmb3JtYXQsb3B0aW9ucyl7aWYoISh0aGlzIGluc3RhbmNlb2YgTm9kZVJTQSkpe3JldHVybiBuZXcgTm9kZVJTQShrZXksZm9ybWF0LG9wdGlvbnMpfWlmKF8uaXNPYmplY3QoZm9ybWF0KSl7b3B0aW9ucz1mb3JtYXQ7Zm9ybWF0PXVuZGVmaW5lZH10aGlzLiRvcHRpb25zPXtzaWduaW5nU2NoZW1lOkRFRkFVTFRfU0lHTklOR19TQ0hFTUUsc2lnbmluZ1NjaGVtZU9wdGlvbnM6e2hhc2g6InNoYTI1NiIsc2FsdExlbmd0aDpudWxsfSxlbmNyeXB0aW9uU2NoZW1lOkRFRkFVTFRfRU5DUllQVElPTl9TQ0hFTUUsZW5jcnlwdGlvblNjaGVtZU9wdGlvbnM6e2hhc2g6InNoYTEiLGxhYmVsOm51bGx9LGVudmlyb25tZW50OnV0aWxzLmRldGVjdEVudmlyb25tZW50KCkscnNhVXRpbHM6dGhpc307dGhpcy5rZXlQYWlyPW5ldyByc2EuS2V5O3RoaXMuJGNhY2hlPXt9O2lmKEJ1ZmZlci5pc0J1ZmZlcihrZXkpfHxfLmlzU3RyaW5nKGtleSkpe3RoaXMuaW1wb3J0S2V5KGtleSxmb3JtYXQpfWVsc2UgaWYoXy5pc09iamVjdChrZXkpKXt0aGlzLmdlbmVyYXRlS2V5UGFpcihrZXkuYixrZXkuZSl9dGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpfU5vZGVSU0EuZ2VuZXJhdGVLZXlQYWlyRnJvbVNlZWQ9ZnVuY3Rpb24gZ2VuZXJhdGVLZXlQYWlyRnJvbVNlZWQoc2VlZCxiaXRzLGV4cCxlbnZpcm9ubWVudCl7dmFyIHJhbmRvbUJhY2t1cD1NYXRoLnJhbmRvbTtpZihzZWVkIT09bnVsbCl7TWF0aC5yYW5kb209ZnVuY3Rpb24oKXt2YXIgcHJldj11bmRlZmluZWQ7ZnVuY3Rpb24gcmFuZG9tKCl7cHJldj1zZWVkcmFuZG9tKHByZXY9PT11bmRlZmluZWQ/QnVmZmVyLmZyb20oc2VlZC5idWZmZXIsc2VlZC5ieXRlT2Zmc2V0LHNlZWQubGVuZ3RoKS50b1N0cmluZygiaGV4Iik6cHJldi50b0ZpeGVkKDEyKSx7Z2xvYmFsOmZhbHNlfSkucXVpY2soKTtyZXR1cm4gcHJldn1yYW5kb20uaXNTZWVkZWQ9dHJ1ZTtyZXR1cm4gcmFuZG9tfSgpfXZhciBvcHRpb25zPXVuZGVmaW5lZDtpZihlbnZpcm9ubWVudCE9PXVuZGVmaW5lZCl7b3B0aW9ucz17ZW52aXJvbm1lbnQ6ZW52aXJvbm1lbnR9fXZhciBub2RlUlNBPW5ldyBOb2RlUlNBKHVuZGVmaW5lZCx1bmRlZmluZWQsb3B0aW9ucyk7bm9kZVJTQS5nZW5lcmF0ZUtleVBhaXIoYml0cyxleHApO01hdGgucmFuZG9tPXJhbmRvbUJhY2t1cDtyZXR1cm4gbm9kZVJTQX07Tm9kZVJTQS5wcm90b3R5cGUuc2V0T3B0aW9ucz1mdW5jdGlvbihvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O2lmKG9wdGlvbnMuZW52aXJvbm1lbnQpe3RoaXMuJG9wdGlvbnMuZW52aXJvbm1lbnQ9b3B0aW9ucy5lbnZpcm9ubWVudH1pZihvcHRpb25zLnNpZ25pbmdTY2hlbWUpe2lmKF8uaXNTdHJpbmcob3B0aW9ucy5zaWduaW5nU2NoZW1lKSl7dmFyIHNpZ25pbmdTY2hlbWU9b3B0aW9ucy5zaWduaW5nU2NoZW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoIi0iKTtpZihzaWduaW5nU2NoZW1lLmxlbmd0aD09MSl7aWYoU1VQUE9SVEVEX0hBU0hfQUxHT1JJVEhNUy5ub2RlLmluZGV4T2Yoc2lnbmluZ1NjaGVtZVswXSk+LTEpe3RoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnM9e2hhc2g6c2lnbmluZ1NjaGVtZVswXX07dGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lPURFRkFVTFRfU0lHTklOR19TQ0hFTUV9ZWxzZXt0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWU9c2lnbmluZ1NjaGVtZVswXTt0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zPXtoYXNoOm51bGx9fX1lbHNle3RoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnM9e2hhc2g6c2lnbmluZ1NjaGVtZVsxXX07dGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lPXNpZ25pbmdTY2hlbWVbMF19fWVsc2UgaWYoXy5pc09iamVjdChvcHRpb25zLnNpZ25pbmdTY2hlbWUpKXt0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWU9b3B0aW9ucy5zaWduaW5nU2NoZW1lLnNjaGVtZXx8REVGQVVMVF9TSUdOSU5HX1NDSEVNRTt0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zPV8ub21pdChvcHRpb25zLnNpZ25pbmdTY2hlbWUsInNjaGVtZSIpfWlmKCFzY2hlbWVzLmlzU2lnbmF0dXJlKHRoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZSkpe3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBzaWduaW5nIHNjaGVtZSIpfWlmKHRoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuaGFzaCYmU1VQUE9SVEVEX0hBU0hfQUxHT1JJVEhNU1t0aGlzLiRvcHRpb25zLmVudmlyb25tZW50XS5pbmRleE9mKHRoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuaGFzaCk9PT0tMSl7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGhhc2hpbmcgYWxnb3JpdGhtIGZvciAiK3RoaXMuJG9wdGlvbnMuZW52aXJvbm1lbnQrIiBlbnZpcm9ubWVudCIpfX1pZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWUpe2lmKF8uaXNTdHJpbmcob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lKSl7dGhpcy4kb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lPW9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZS50b0xvd2VyQ2FzZSgpO3RoaXMuJG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnM9e319ZWxzZSBpZihfLmlzT2JqZWN0KG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZSkpe3RoaXMuJG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZT1vcHRpb25zLmVuY3J5cHRpb25TY2hlbWUuc2NoZW1lfHxERUZBVUxUX0VOQ1JZUFRJT05fU0NIRU1FO3RoaXMuJG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnM9Xy5vbWl0KG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZSwic2NoZW1lIil9aWYoIXNjaGVtZXMuaXNFbmNyeXB0aW9uKHRoaXMuJG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZSkpe3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBlbmNyeXB0aW9uIHNjaGVtZSIpfWlmKHRoaXMuJG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMuaGFzaCYmU1VQUE9SVEVEX0hBU0hfQUxHT1JJVEhNU1t0aGlzLiRvcHRpb25zLmVudmlyb25tZW50XS5pbmRleE9mKHRoaXMuJG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMuaGFzaCk9PT0tMSl7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGhhc2hpbmcgYWxnb3JpdGhtIGZvciAiK3RoaXMuJG9wdGlvbnMuZW52aXJvbm1lbnQrIiBlbnZpcm9ubWVudCIpfX10aGlzLmtleVBhaXIuc2V0T3B0aW9ucyh0aGlzLiRvcHRpb25zKX07Tm9kZVJTQS5wcm90b3R5cGUuZ2VuZXJhdGVLZXlQYWlyPWZ1bmN0aW9uKGJpdHMsZXhwKXtiaXRzPWJpdHN8fDIwNDg7ZXhwPWV4cHx8NjU1Mzc7aWYoYml0cyU4IT09MCl7dGhyb3cgRXJyb3IoIktleSBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA4LiIpfXRoaXMua2V5UGFpci5nZW5lcmF0ZShiaXRzLGV4cC50b1N0cmluZygxNikpO3RoaXMuJGNhY2hlPXt9O3JldHVybiB0aGlzfTtOb2RlUlNBLnByb3RvdHlwZS5pbXBvcnRLZXk9ZnVuY3Rpb24oa2V5RGF0YSxmb3JtYXQpe2lmKCFrZXlEYXRhKXt0aHJvdyBFcnJvcigiRW1wdHkga2V5IGdpdmVuIil9aWYoZm9ybWF0KXtmb3JtYXQ9RVhQT1JUX0ZPUk1BVF9BTElBU0VTW2Zvcm1hdF18fGZvcm1hdH1pZighZm9ybWF0cy5kZXRlY3RBbmRJbXBvcnQodGhpcy5rZXlQYWlyLGtleURhdGEsZm9ybWF0KSYmZm9ybWF0PT09dW5kZWZpbmVkKXt0aHJvdyBFcnJvcigiS2V5IGZvcm1hdCBtdXN0IGJlIHNwZWNpZmllZCIpfXRoaXMuJGNhY2hlPXt9O3JldHVybiB0aGlzfTtOb2RlUlNBLnByb3RvdHlwZS5leHBvcnRLZXk9ZnVuY3Rpb24oZm9ybWF0KXtmb3JtYXQ9Zm9ybWF0fHxERUZBVUxUX0VYUE9SVF9GT1JNQVQ7Zm9ybWF0PUVYUE9SVF9GT1JNQVRfQUxJQVNFU1tmb3JtYXRdfHxmb3JtYXQ7aWYoIXRoaXMuJGNhY2hlW2Zvcm1hdF0pe3RoaXMuJGNhY2hlW2Zvcm1hdF09Zm9ybWF0cy5kZXRlY3RBbmRFeHBvcnQodGhpcy5rZXlQYWlyLGZvcm1hdCl9cmV0dXJuIHRoaXMuJGNhY2hlW2Zvcm1hdF19O05vZGVSU0EucHJvdG90eXBlLmlzUHJpdmF0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmtleVBhaXIuaXNQcml2YXRlKCl9O05vZGVSU0EucHJvdG90eXBlLmlzUHVibGljPWZ1bmN0aW9uKHN0cmljdCl7cmV0dXJuIHRoaXMua2V5UGFpci5pc1B1YmxpYyhzdHJpY3QpfTtOb2RlUlNBLnByb3RvdHlwZS5pc0VtcHR5PWZ1bmN0aW9uKHN0cmljdCl7cmV0dXJuISh0aGlzLmtleVBhaXIubnx8dGhpcy5rZXlQYWlyLmV8fHRoaXMua2V5UGFpci5kKX07Tm9kZVJTQS5wcm90b3R5cGUuZW5jcnlwdD1mdW5jdGlvbihidWZmZXIsZW5jb2Rpbmcsc291cmNlX2VuY29kaW5nKXtyZXR1cm4gdGhpcy4kJGVuY3J5cHRLZXkoZmFsc2UsYnVmZmVyLGVuY29kaW5nLHNvdXJjZV9lbmNvZGluZyl9O05vZGVSU0EucHJvdG90eXBlLmRlY3J5cHQ9ZnVuY3Rpb24oYnVmZmVyLGVuY29kaW5nKXtyZXR1cm4gdGhpcy4kJGRlY3J5cHRLZXkoZmFsc2UsYnVmZmVyLGVuY29kaW5nKX07Tm9kZVJTQS5wcm90b3R5cGUuZW5jcnlwdFByaXZhdGU9ZnVuY3Rpb24oYnVmZmVyLGVuY29kaW5nLHNvdXJjZV9lbmNvZGluZyl7cmV0dXJuIHRoaXMuJCRlbmNyeXB0S2V5KHRydWUsYnVmZmVyLGVuY29kaW5nLHNvdXJjZV9lbmNvZGluZyl9O05vZGVSU0EucHJvdG90eXBlLmRlY3J5cHRQdWJsaWM9ZnVuY3Rpb24oYnVmZmVyLGVuY29kaW5nKXtyZXR1cm4gdGhpcy4kJGRlY3J5cHRLZXkodHJ1ZSxidWZmZXIsZW5jb2RpbmcpfTtOb2RlUlNBLnByb3RvdHlwZS4kJGVuY3J5cHRLZXk9ZnVuY3Rpb24odXNlUHJpdmF0ZSxidWZmZXIsZW5jb2Rpbmcsc291cmNlX2VuY29kaW5nKXt0cnl7dmFyIHJlcz10aGlzLmtleVBhaXIuZW5jcnlwdCh0aGlzLiRnZXREYXRhRm9yRW5jcnlwdChidWZmZXIsc291cmNlX2VuY29kaW5nKSx1c2VQcml2YXRlKTtpZihlbmNvZGluZz09ImJ1ZmZlciJ8fCFlbmNvZGluZyl7cmV0dXJuIHJlc31lbHNle3JldHVybiByZXMudG9TdHJpbmcoZW5jb2RpbmcpfX1jYXRjaChlKXt0aHJvdyBFcnJvcigiRXJyb3IgZHVyaW5nIGVuY3J5cHRpb24uIE9yaWdpbmFsIGVycm9yOiAiK2Uuc3RhY2spfX07Tm9kZVJTQS5wcm90b3R5cGUuJCRkZWNyeXB0S2V5PWZ1bmN0aW9uKHVzZVB1YmxpYyxidWZmZXIsZW5jb2Rpbmcpe3RyeXtidWZmZXI9Xy5pc1N0cmluZyhidWZmZXIpP0J1ZmZlci5mcm9tKGJ1ZmZlciwiYmFzZTY0Iik6YnVmZmVyO3ZhciByZXM9dGhpcy5rZXlQYWlyLmRlY3J5cHQoYnVmZmVyLHVzZVB1YmxpYyk7aWYocmVzPT09bnVsbCl7dGhyb3cgRXJyb3IoIktleSBkZWNyeXB0IG1ldGhvZCByZXR1cm5zIG51bGwuIil9cmV0dXJuIHRoaXMuJGdldERlY3J5cHRlZERhdGEocmVzLGVuY29kaW5nKX1jYXRjaChlKXt0aHJvdyBFcnJvcigiRXJyb3IgZHVyaW5nIGRlY3J5cHRpb24gKHByb2JhYmx5IGluY29ycmVjdCBrZXkpLiBPcmlnaW5hbCBlcnJvcjogIitlLnN0YWNrKX19O05vZGVSU0EucHJvdG90eXBlLnNpZ249ZnVuY3Rpb24oYnVmZmVyLGVuY29kaW5nLHNvdXJjZV9lbmNvZGluZyl7aWYoIXRoaXMuaXNQcml2YXRlKCkpe3Rocm93IEVycm9yKCJUaGlzIGlzIG5vdCBwcml2YXRlIGtleSIpfXZhciByZXM9dGhpcy5rZXlQYWlyLnNpZ24odGhpcy4kZ2V0RGF0YUZvckVuY3J5cHQoYnVmZmVyLHNvdXJjZV9lbmNvZGluZykpO2lmKGVuY29kaW5nJiZlbmNvZGluZyE9ImJ1ZmZlciIpe3Jlcz1yZXMudG9TdHJpbmcoZW5jb2RpbmcpfXJldHVybiByZXN9O05vZGVSU0EucHJvdG90eXBlLnZlcmlmeT1mdW5jdGlvbihidWZmZXIsc2lnbmF0dXJlLHNvdXJjZV9lbmNvZGluZyxzaWduYXR1cmVfZW5jb2Rpbmcpe2lmKCF0aGlzLmlzUHVibGljKCkpe3Rocm93IEVycm9yKCJUaGlzIGlzIG5vdCBwdWJsaWMga2V5Iil9c2lnbmF0dXJlX2VuY29kaW5nPSFzaWduYXR1cmVfZW5jb2Rpbmd8fHNpZ25hdHVyZV9lbmNvZGluZz09ImJ1ZmZlciI/bnVsbDpzaWduYXR1cmVfZW5jb2Rpbmc7cmV0dXJuIHRoaXMua2V5UGFpci52ZXJpZnkodGhpcy4kZ2V0RGF0YUZvckVuY3J5cHQoYnVmZmVyLHNvdXJjZV9lbmNvZGluZyksc2lnbmF0dXJlLHNpZ25hdHVyZV9lbmNvZGluZyl9O05vZGVSU0EucHJvdG90eXBlLmdldEtleVNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5rZXlQYWlyLmtleVNpemV9O05vZGVSU0EucHJvdG90eXBlLmdldE1heE1lc3NhZ2VTaXplPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMua2V5UGFpci5tYXhNZXNzYWdlTGVuZ3RofTtOb2RlUlNBLnByb3RvdHlwZS4kZ2V0RGF0YUZvckVuY3J5cHQ9ZnVuY3Rpb24oYnVmZmVyLGVuY29kaW5nKXtpZihfLmlzU3RyaW5nKGJ1ZmZlcil8fF8uaXNOdW1iZXIoYnVmZmVyKSl7cmV0dXJuIEJ1ZmZlci5mcm9tKCIiK2J1ZmZlcixlbmNvZGluZ3x8InV0ZjgiKX1lbHNlIGlmKEJ1ZmZlci5pc0J1ZmZlcihidWZmZXIpKXtyZXR1cm4gYnVmZmVyfWVsc2UgaWYoXy5pc09iamVjdChidWZmZXIpKXtyZXR1cm4gQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkoYnVmZmVyKSl9ZWxzZXt0aHJvdyBFcnJvcigiVW5leHBlY3RlZCBkYXRhIHR5cGUiKX19O05vZGVSU0EucHJvdG90eXBlLiRnZXREZWNyeXB0ZWREYXRhPWZ1bmN0aW9uKGJ1ZmZlcixlbmNvZGluZyl7ZW5jb2Rpbmc9ZW5jb2Rpbmd8fCJidWZmZXIiO2lmKGVuY29kaW5nPT0iYnVmZmVyIil7cmV0dXJuIGJ1ZmZlcn1lbHNlIGlmKGVuY29kaW5nPT0ianNvbiIpe3JldHVybiBKU09OLnBhcnNlKGJ1ZmZlci50b1N0cmluZygpKX1lbHNle3JldHVybiBidWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpfX07cmV0dXJuIE5vZGVSU0F9KCl9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuL2Zvcm1hdHMvZm9ybWF0cy5qcyI6NDcsIi4vbGlicy9yc2EuanMiOjUxLCIuL3NjaGVtZXMvc2NoZW1lcy5qcyI6NTUsIi4vdXRpbHMiOjU2LGJ1ZmZlcjoyNyxjb25zdGFudHM6Mjksc2VlZHJhbmRvbTo4Mn1dLDQxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7dmFyIHV0aWxzPXJlcXVpcmUoIi4vdXRpbHMiKTt2YXIgc3RhbmRhbG9uZUNyZWF0ZUhhc2g9cmVxdWlyZSgiY3JlYXRlLWhhc2giKTt2YXIgZ2V0Tm9kZUNyeXB0bz1mdW5jdGlvbigpe3ZhciBub2RlQ3J5cHRvPXVuZGVmaW5lZDtyZXR1cm4gZnVuY3Rpb24oKXtpZihub2RlQ3J5cHRvPT09dW5kZWZpbmVkKXtub2RlQ3J5cHRvPXJlcXVpcmUoImNyeXB0byIrIiIpfXJldHVybiBub2RlQ3J5cHRvfX0oKTttb2R1bGUuZXhwb3J0cz17fTttb2R1bGUuZXhwb3J0cy5jcmVhdGVIYXNoPWZ1bmN0aW9uKCl7aWYodXRpbHMuZGV0ZWN0RW52aXJvbm1lbnQoKT09PSJub2RlIil7dHJ5e3ZhciBub2RlQ3J5cHRvPWdldE5vZGVDcnlwdG8oKTtyZXR1cm4gbm9kZUNyeXB0by5jcmVhdGVIYXNoLmJpbmQobm9kZUNyeXB0byl9Y2F0Y2goZXJyb3Ipe319cmV0dXJuIHN0YW5kYWxvbmVDcmVhdGVIYXNofSgpO1siY3JlYXRlU2lnbiIsImNyZWF0ZVZlcmlmeSJdLmZvckVhY2goZnVuY3Rpb24oZm5OYW1lKXttb2R1bGUuZXhwb3J0c1tmbk5hbWVdPWZ1bmN0aW9uKCl7dmFyIG5vZGVDcnlwdG89Z2V0Tm9kZUNyeXB0bygpO25vZGVDcnlwdG9bZm5OYW1lXS5hcHBseShub2RlQ3J5cHRvLGFyZ3VtZW50cyl9fSk7bW9kdWxlLmV4cG9ydHMucmFuZG9tQnl0ZXM9ZnVuY3Rpb24oKXt2YXIgYnJvd3NlckdldFJhbmRvbVZhbHVlcz1mdW5jdGlvbigpe2lmKHR5cGVvZiBjcnlwdG89PT0ib2JqZWN0IiYmISFjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKXtyZXR1cm4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0byl9ZWxzZSBpZih0eXBlb2YgbXNDcnlwdG89PT0ib2JqZWN0IiYmISFtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMpe3JldHVybiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0byl9ZWxzZSBpZih0eXBlb2Ygc2VsZj09PSJvYmplY3QiJiZ0eXBlb2Ygc2VsZi5jcnlwdG89PT0ib2JqZWN0IiYmISFzZWxmLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpe3JldHVybiBzZWxmLmNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChzZWxmLmNyeXB0byl9ZWxzZXtyZXR1cm4gdW5kZWZpbmVkfX0oKTt2YXIgZ2V0UmFuZG9tVmFsdWVzPWZ1bmN0aW9uKCl7dmFyIG5vbkNyeXB0b2dyYXBoaWNHZXRSYW5kb21WYWx1ZT1mdW5jdGlvbihhYnYpe3ZhciBsPWFidi5sZW5ndGg7d2hpbGUobC0tKXthYnZbbF09TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjI1Nil9cmV0dXJuIGFidn07cmV0dXJuIGZ1bmN0aW9uKGFidil7aWYoTWF0aC5yYW5kb20uaXNTZWVkZWQpe3JldHVybiBub25DcnlwdG9ncmFwaGljR2V0UmFuZG9tVmFsdWUoYWJ2KX1lbHNle2lmKCEhYnJvd3NlckdldFJhbmRvbVZhbHVlcyl7cmV0dXJuIGJyb3dzZXJHZXRSYW5kb21WYWx1ZXMoYWJ2KX1lbHNle3JldHVybiBub25DcnlwdG9ncmFwaGljR2V0UmFuZG9tVmFsdWUoYWJ2KX19fX0oKTt2YXIgTUFYX0JZVEVTPTY1NTM2O3ZhciBNQVhfVUlOVDMyPTQyOTQ5NjcyOTU7cmV0dXJuIGZ1bmN0aW9uIHJhbmRvbUJ5dGVzKHNpemUpe2lmKCFNYXRoLnJhbmRvbS5pc1NlZWRlZCYmIWJyb3dzZXJHZXRSYW5kb21WYWx1ZXMpe3RyeXt2YXIgbm9kZUJ1ZmZlckluc3Q9Z2V0Tm9kZUNyeXB0bygpLnJhbmRvbUJ5dGVzKHNpemUpO3JldHVybiBCdWZmZXIuZnJvbShub2RlQnVmZmVySW5zdC5idWZmZXIsbm9kZUJ1ZmZlckluc3QuYnl0ZU9mZnNldCxub2RlQnVmZmVySW5zdC5sZW5ndGgpfWNhdGNoKGVycm9yKXt9fWlmKHNpemU+TUFYX1VJTlQzMil0aHJvdyBuZXcgUmFuZ2VFcnJvcigicmVxdWVzdGVkIHRvbyBtYW55IHJhbmRvbSBieXRlcyIpO3ZhciBieXRlcz1CdWZmZXIuYWxsb2NVbnNhZmUoc2l6ZSk7aWYoc2l6ZT4wKXtpZihzaXplPk1BWF9CWVRFUyl7Zm9yKHZhciBnZW5lcmF0ZWQ9MDtnZW5lcmF0ZWQ8c2l6ZTtnZW5lcmF0ZWQrPU1BWF9CWVRFUyl7Z2V0UmFuZG9tVmFsdWVzKGJ5dGVzLnNsaWNlKGdlbmVyYXRlZCxnZW5lcmF0ZWQrTUFYX0JZVEVTKSl9fWVsc2V7Z2V0UmFuZG9tVmFsdWVzKGJ5dGVzKX19cmV0dXJuIGJ5dGVzfX0oKX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4vdXRpbHMiOjU2LGJ1ZmZlcjoyNywiY3JlYXRlLWhhc2giOjMxfV0sNDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXtnZXRFbmdpbmU6ZnVuY3Rpb24oa2V5UGFpcixvcHRpb25zKXt2YXIgZW5naW5lPXJlcXVpcmUoIi4vanMuanMiKTtpZihvcHRpb25zLmVudmlyb25tZW50PT09Im5vZGUiKXt2YXIgY3J5cHQ9cmVxdWlyZSgiY3J5cHRvIisiIik7aWYodHlwZW9mIGNyeXB0LnB1YmxpY0VuY3J5cHQ9PT0iZnVuY3Rpb24iJiZ0eXBlb2YgY3J5cHQucHJpdmF0ZURlY3J5cHQ9PT0iZnVuY3Rpb24iKXtpZih0eXBlb2YgY3J5cHQucHJpdmF0ZUVuY3J5cHQ9PT0iZnVuY3Rpb24iJiZ0eXBlb2YgY3J5cHQucHVibGljRGVjcnlwdD09PSJmdW5jdGlvbiIpe2VuZ2luZT1yZXF1aXJlKCIuL2lvLmpzIil9ZWxzZXtlbmdpbmU9cmVxdWlyZSgiLi9ub2RlMTIuanMiKX19fXJldHVybiBlbmdpbmUoa2V5UGFpcixvcHRpb25zKX19fSx7Ii4vaW8uanMiOjQzLCIuL2pzLmpzIjo0NCwiLi9ub2RlMTIuanMiOjQ1fV0sNDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBjcnlwdG89cmVxdWlyZSgiY3J5cHRvIisiIik7dmFyIGNvbnN0YW50cz1yZXF1aXJlKCJjb25zdGFudHMiKTt2YXIgc2NoZW1lcz1yZXF1aXJlKCIuLi9zY2hlbWVzL3NjaGVtZXMuanMiKTttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihrZXlQYWlyLG9wdGlvbnMpe3ZhciBwa2NzMVNjaGVtZT1zY2hlbWVzLnBrY3MxLm1ha2VTY2hlbWUoa2V5UGFpcixvcHRpb25zKTtyZXR1cm57ZW5jcnlwdDpmdW5jdGlvbihidWZmZXIsdXNlUHJpdmF0ZSl7dmFyIHBhZGRpbmc7aWYodXNlUHJpdmF0ZSl7cGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX1BBRERJTkc7aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nKXtwYWRkaW5nPW9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZ31yZXR1cm4gY3J5cHRvLnByaXZhdGVFbmNyeXB0KHtrZXk6b3B0aW9ucy5yc2FVdGlscy5leHBvcnRLZXkoInByaXZhdGUiKSxwYWRkaW5nOnBhZGRpbmd9LGJ1ZmZlcil9ZWxzZXtwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfT0FFUF9QQURESU5HO2lmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZT09PSJwa2NzMSIpe3BhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9QQURESU5HfWlmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZyl7cGFkZGluZz1vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmd9dmFyIGRhdGE9YnVmZmVyO2lmKHBhZGRpbmc9PT1jb25zdGFudHMuUlNBX05PX1BBRERJTkcpe2RhdGE9cGtjczFTY2hlbWUucGtjczBwYWQoYnVmZmVyKX1yZXR1cm4gY3J5cHRvLnB1YmxpY0VuY3J5cHQoe2tleTpvcHRpb25zLnJzYVV0aWxzLmV4cG9ydEtleSgicHVibGljIikscGFkZGluZzpwYWRkaW5nfSxkYXRhKX19LGRlY3J5cHQ6ZnVuY3Rpb24oYnVmZmVyLHVzZVB1YmxpYyl7dmFyIHBhZGRpbmc7aWYodXNlUHVibGljKXtwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfUEFERElORztpZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmcpe3BhZGRpbmc9b3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nfXJldHVybiBjcnlwdG8ucHVibGljRGVjcnlwdCh7a2V5Om9wdGlvbnMucnNhVXRpbHMuZXhwb3J0S2V5KCJwdWJsaWMiKSxwYWRkaW5nOnBhZGRpbmd9LGJ1ZmZlcil9ZWxzZXtwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfT0FFUF9QQURESU5HO2lmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZT09PSJwa2NzMSIpe3BhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9QQURESU5HfWlmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZyl7cGFkZGluZz1vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmd9dmFyIHJlcz1jcnlwdG8ucHJpdmF0ZURlY3J5cHQoe2tleTpvcHRpb25zLnJzYVV0aWxzLmV4cG9ydEtleSgicHJpdmF0ZSIpLHBhZGRpbmc6cGFkZGluZ30sYnVmZmVyKTtpZihwYWRkaW5nPT09Y29uc3RhbnRzLlJTQV9OT19QQURESU5HKXtyZXR1cm4gcGtjczFTY2hlbWUucGtjczB1bnBhZChyZXMpfXJldHVybiByZXN9fX19fSx7Ii4uL3NjaGVtZXMvc2NoZW1lcy5qcyI6NTUsY29uc3RhbnRzOjI5fV0sNDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBCaWdJbnRlZ2VyPXJlcXVpcmUoIi4uL2xpYnMvanNibi5qcyIpO3ZhciBzY2hlbWVzPXJlcXVpcmUoIi4uL3NjaGVtZXMvc2NoZW1lcy5qcyIpO21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKGtleVBhaXIsb3B0aW9ucyl7dmFyIHBrY3MxU2NoZW1lPXNjaGVtZXMucGtjczEubWFrZVNjaGVtZShrZXlQYWlyLG9wdGlvbnMpO3JldHVybntlbmNyeXB0OmZ1bmN0aW9uKGJ1ZmZlcix1c2VQcml2YXRlKXt2YXIgbSxjO2lmKHVzZVByaXZhdGUpe209bmV3IEJpZ0ludGVnZXIocGtjczFTY2hlbWUuZW5jUGFkKGJ1ZmZlcix7dHlwZToxfSkpO2M9a2V5UGFpci4kZG9Qcml2YXRlKG0pfWVsc2V7bT1uZXcgQmlnSW50ZWdlcihrZXlQYWlyLmVuY3J5cHRpb25TY2hlbWUuZW5jUGFkKGJ1ZmZlcikpO2M9a2V5UGFpci4kZG9QdWJsaWMobSl9cmV0dXJuIGMudG9CdWZmZXIoa2V5UGFpci5lbmNyeXB0ZWREYXRhTGVuZ3RoKX0sZGVjcnlwdDpmdW5jdGlvbihidWZmZXIsdXNlUHVibGljKXt2YXIgbSxjPW5ldyBCaWdJbnRlZ2VyKGJ1ZmZlcik7aWYodXNlUHVibGljKXttPWtleVBhaXIuJGRvUHVibGljKGMpO3JldHVybiBwa2NzMVNjaGVtZS5lbmNVblBhZChtLnRvQnVmZmVyKGtleVBhaXIuZW5jcnlwdGVkRGF0YUxlbmd0aCkse3R5cGU6MX0pfWVsc2V7bT1rZXlQYWlyLiRkb1ByaXZhdGUoYyk7cmV0dXJuIGtleVBhaXIuZW5jcnlwdGlvblNjaGVtZS5lbmNVblBhZChtLnRvQnVmZmVyKGtleVBhaXIuZW5jcnlwdGVkRGF0YUxlbmd0aCkpfX19fX0seyIuLi9saWJzL2pzYm4uanMiOjUwLCIuLi9zY2hlbWVzL3NjaGVtZXMuanMiOjU1fV0sNDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBjcnlwdG89cmVxdWlyZSgiY3J5cHRvIisiIik7dmFyIGNvbnN0YW50cz1yZXF1aXJlKCJjb25zdGFudHMiKTt2YXIgc2NoZW1lcz1yZXF1aXJlKCIuLi9zY2hlbWVzL3NjaGVtZXMuanMiKTttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihrZXlQYWlyLG9wdGlvbnMpe3ZhciBqc0VuZ2luZT1yZXF1aXJlKCIuL2pzLmpzIikoa2V5UGFpcixvcHRpb25zKTt2YXIgcGtjczFTY2hlbWU9c2NoZW1lcy5wa2NzMS5tYWtlU2NoZW1lKGtleVBhaXIsb3B0aW9ucyk7cmV0dXJue2VuY3J5cHQ6ZnVuY3Rpb24oYnVmZmVyLHVzZVByaXZhdGUpe2lmKHVzZVByaXZhdGUpe3JldHVybiBqc0VuZ2luZS5lbmNyeXB0KGJ1ZmZlcix1c2VQcml2YXRlKX12YXIgcGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX09BRVBfUEFERElORztpZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWU9PT0icGtjczEiKXtwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfUEFERElOR31pZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmcpe3BhZGRpbmc9b3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nfXZhciBkYXRhPWJ1ZmZlcjtpZihwYWRkaW5nPT09Y29uc3RhbnRzLlJTQV9OT19QQURESU5HKXtkYXRhPXBrY3MxU2NoZW1lLnBrY3MwcGFkKGJ1ZmZlcil9cmV0dXJuIGNyeXB0by5wdWJsaWNFbmNyeXB0KHtrZXk6b3B0aW9ucy5yc2FVdGlscy5leHBvcnRLZXkoInB1YmxpYyIpLHBhZGRpbmc6cGFkZGluZ30sZGF0YSl9LGRlY3J5cHQ6ZnVuY3Rpb24oYnVmZmVyLHVzZVB1YmxpYyl7aWYodXNlUHVibGljKXtyZXR1cm4ganNFbmdpbmUuZGVjcnlwdChidWZmZXIsdXNlUHVibGljKX12YXIgcGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX09BRVBfUEFERElORztpZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWU9PT0icGtjczEiKXtwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfUEFERElOR31pZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmcpe3BhZGRpbmc9b3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nfXZhciByZXM9Y3J5cHRvLnByaXZhdGVEZWNyeXB0KHtrZXk6b3B0aW9ucy5yc2FVdGlscy5leHBvcnRLZXkoInByaXZhdGUiKSxwYWRkaW5nOnBhZGRpbmd9LGJ1ZmZlcik7aWYocGFkZGluZz09PWNvbnN0YW50cy5SU0FfTk9fUEFERElORyl7cmV0dXJuIHBrY3MxU2NoZW1lLnBrY3MwdW5wYWQocmVzKX1yZXR1cm4gcmVzfX19fSx7Ii4uL3NjaGVtZXMvc2NoZW1lcy5qcyI6NTUsIi4vanMuanMiOjQ0LGNvbnN0YW50czoyOX1dLDQ2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgXz1yZXF1aXJlKCIuLi91dGlscyIpLl87bW9kdWxlLmV4cG9ydHM9e3ByaXZhdGVFeHBvcnQ6ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe3JldHVybntuOmtleS5uLnRvQnVmZmVyKCksZTprZXkuZSxkOmtleS5kLnRvQnVmZmVyKCkscDprZXkucC50b0J1ZmZlcigpLHE6a2V5LnEudG9CdWZmZXIoKSxkbXAxOmtleS5kbXAxLnRvQnVmZmVyKCksZG1xMTprZXkuZG1xMS50b0J1ZmZlcigpLGNvZWZmOmtleS5jb2VmZi50b0J1ZmZlcigpfX0scHJpdmF0ZUltcG9ydDpmdW5jdGlvbihrZXksZGF0YSxvcHRpb25zKXtpZihkYXRhLm4mJmRhdGEuZSYmZGF0YS5kJiZkYXRhLnAmJmRhdGEucSYmZGF0YS5kbXAxJiZkYXRhLmRtcTEmJmRhdGEuY29lZmYpe2tleS5zZXRQcml2YXRlKGRhdGEubixkYXRhLmUsZGF0YS5kLGRhdGEucCxkYXRhLnEsZGF0YS5kbXAxLGRhdGEuZG1xMSxkYXRhLmNvZWZmKX1lbHNle3Rocm93IEVycm9yKCJJbnZhbGlkIGtleSBkYXRhIil9fSxwdWJsaWNFeHBvcnQ6ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe3JldHVybntuOmtleS5uLnRvQnVmZmVyKCksZTprZXkuZX19LHB1YmxpY0ltcG9ydDpmdW5jdGlvbihrZXksZGF0YSxvcHRpb25zKXtpZihkYXRhLm4mJmRhdGEuZSl7a2V5LnNldFB1YmxpYyhkYXRhLm4sZGF0YS5lKX1lbHNle3Rocm93IEVycm9yKCJJbnZhbGlkIGtleSBkYXRhIil9fSxhdXRvSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhKXtpZihkYXRhLm4mJmRhdGEuZSl7aWYoZGF0YS5kJiZkYXRhLnAmJmRhdGEucSYmZGF0YS5kbXAxJiZkYXRhLmRtcTEmJmRhdGEuY29lZmYpe21vZHVsZS5leHBvcnRzLnByaXZhdGVJbXBvcnQoa2V5LGRhdGEpO3JldHVybiB0cnVlfWVsc2V7bW9kdWxlLmV4cG9ydHMucHVibGljSW1wb3J0KGtleSxkYXRhKTtyZXR1cm4gdHJ1ZX19cmV0dXJuIGZhbHNlfX19LHsiLi4vdXRpbHMiOjU2fV0sNDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe2Z1bmN0aW9uIGZvcm1hdFBhcnNlKGZvcm1hdCl7Zm9ybWF0PWZvcm1hdC5zcGxpdCgiLSIpO3ZhciBrZXlUeXBlPSJwcml2YXRlIjt2YXIga2V5T3B0PXt0eXBlOiJkZWZhdWx0In07Zm9yKHZhciBpPTE7aTxmb3JtYXQubGVuZ3RoO2krKyl7aWYoZm9ybWF0W2ldKXtzd2l0Y2goZm9ybWF0W2ldKXtjYXNlInB1YmxpYyI6a2V5VHlwZT1mb3JtYXRbaV07YnJlYWs7Y2FzZSJwcml2YXRlIjprZXlUeXBlPWZvcm1hdFtpXTticmVhaztjYXNlInBlbSI6a2V5T3B0LnR5cGU9Zm9ybWF0W2ldO2JyZWFrO2Nhc2UiZGVyIjprZXlPcHQudHlwZT1mb3JtYXRbaV07YnJlYWt9fX1yZXR1cm57c2NoZW1lOmZvcm1hdFswXSxrZXlUeXBlOmtleVR5cGUsa2V5T3B0OmtleU9wdH19bW9kdWxlLmV4cG9ydHM9e3BrY3MxOnJlcXVpcmUoIi4vcGtjczEiKSxwa2NzODpyZXF1aXJlKCIuL3BrY3M4IiksY29tcG9uZW50czpyZXF1aXJlKCIuL2NvbXBvbmVudHMiKSxpc1ByaXZhdGVFeHBvcnQ6ZnVuY3Rpb24oZm9ybWF0KXtyZXR1cm4gbW9kdWxlLmV4cG9ydHNbZm9ybWF0XSYmdHlwZW9mIG1vZHVsZS5leHBvcnRzW2Zvcm1hdF0ucHJpdmF0ZUV4cG9ydD09PSJmdW5jdGlvbiJ9LGlzUHJpdmF0ZUltcG9ydDpmdW5jdGlvbihmb3JtYXQpe3JldHVybiBtb2R1bGUuZXhwb3J0c1tmb3JtYXRdJiZ0eXBlb2YgbW9kdWxlLmV4cG9ydHNbZm9ybWF0XS5wcml2YXRlSW1wb3J0PT09ImZ1bmN0aW9uIn0saXNQdWJsaWNFeHBvcnQ6ZnVuY3Rpb24oZm9ybWF0KXtyZXR1cm4gbW9kdWxlLmV4cG9ydHNbZm9ybWF0XSYmdHlwZW9mIG1vZHVsZS5leHBvcnRzW2Zvcm1hdF0ucHVibGljRXhwb3J0PT09ImZ1bmN0aW9uIn0saXNQdWJsaWNJbXBvcnQ6ZnVuY3Rpb24oZm9ybWF0KXtyZXR1cm4gbW9kdWxlLmV4cG9ydHNbZm9ybWF0XSYmdHlwZW9mIG1vZHVsZS5leHBvcnRzW2Zvcm1hdF0ucHVibGljSW1wb3J0PT09ImZ1bmN0aW9uIn0sZGV0ZWN0QW5kSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhLGZvcm1hdCl7aWYoZm9ybWF0PT09dW5kZWZpbmVkKXtmb3IodmFyIHNjaGVtZSBpbiBtb2R1bGUuZXhwb3J0cyl7aWYodHlwZW9mIG1vZHVsZS5leHBvcnRzW3NjaGVtZV0uYXV0b0ltcG9ydD09PSJmdW5jdGlvbiImJm1vZHVsZS5leHBvcnRzW3NjaGVtZV0uYXV0b0ltcG9ydChrZXksZGF0YSkpe3JldHVybiB0cnVlfX19ZWxzZSBpZihmb3JtYXQpe3ZhciBmbXQ9Zm9ybWF0UGFyc2UoZm9ybWF0KTtpZihtb2R1bGUuZXhwb3J0c1tmbXQuc2NoZW1lXSl7aWYoZm10LmtleVR5cGU9PT0icHJpdmF0ZSIpe21vZHVsZS5leHBvcnRzW2ZtdC5zY2hlbWVdLnByaXZhdGVJbXBvcnQoa2V5LGRhdGEsZm10LmtleU9wdCl9ZWxzZXttb2R1bGUuZXhwb3J0c1tmbXQuc2NoZW1lXS5wdWJsaWNJbXBvcnQoa2V5LGRhdGEsZm10LmtleU9wdCl9fWVsc2V7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGtleSBmb3JtYXQiKX19cmV0dXJuIGZhbHNlfSxkZXRlY3RBbmRFeHBvcnQ6ZnVuY3Rpb24oa2V5LGZvcm1hdCl7aWYoZm9ybWF0KXt2YXIgZm10PWZvcm1hdFBhcnNlKGZvcm1hdCk7aWYobW9kdWxlLmV4cG9ydHNbZm10LnNjaGVtZV0pe2lmKGZtdC5rZXlUeXBlPT09InByaXZhdGUiKXtpZigha2V5LmlzUHJpdmF0ZSgpKXt0aHJvdyBFcnJvcigiVGhpcyBpcyBub3QgcHJpdmF0ZSBrZXkiKX1yZXR1cm4gbW9kdWxlLmV4cG9ydHNbZm10LnNjaGVtZV0ucHJpdmF0ZUV4cG9ydChrZXksZm10LmtleU9wdCl9ZWxzZXtpZigha2V5LmlzUHVibGljKCkpe3Rocm93IEVycm9yKCJUaGlzIGlzIG5vdCBwdWJsaWMga2V5Iil9cmV0dXJuIG1vZHVsZS5leHBvcnRzW2ZtdC5zY2hlbWVdLnB1YmxpY0V4cG9ydChrZXksZm10LmtleU9wdCl9fWVsc2V7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGtleSBmb3JtYXQiKX19fX19LHsiLi9jb21wb25lbnRzIjo0NiwiLi9wa2NzMSI6NDgsIi4vcGtjczgiOjQ5fV0sNDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBiZXI9cmVxdWlyZSgiYXNuMSIpLkJlcjt2YXIgXz1yZXF1aXJlKCIuLi91dGlscyIpLl87dmFyIHV0aWxzPXJlcXVpcmUoIi4uL3V0aWxzIik7dmFyIFBSSVZBVEVfT1BFTklOR19CT1VOREFSWT0iLS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLSI7dmFyIFBSSVZBVEVfQ0xPU0lOR19CT1VOREFSWT0iLS0tLS1FTkQgUlNBIFBSSVZBVEUgS0VZLS0tLS0iO3ZhciBQVUJMSUNfT1BFTklOR19CT1VOREFSWT0iLS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tIjt2YXIgUFVCTElDX0NMT1NJTkdfQk9VTkRBUlk9Ii0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0iO21vZHVsZS5leHBvcnRzPXtwcml2YXRlRXhwb3J0OmZ1bmN0aW9uKGtleSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBuPWtleS5uLnRvQnVmZmVyKCk7dmFyIGQ9a2V5LmQudG9CdWZmZXIoKTt2YXIgcD1rZXkucC50b0J1ZmZlcigpO3ZhciBxPWtleS5xLnRvQnVmZmVyKCk7dmFyIGRtcDE9a2V5LmRtcDEudG9CdWZmZXIoKTt2YXIgZG1xMT1rZXkuZG1xMS50b0J1ZmZlcigpO3ZhciBjb2VmZj1rZXkuY29lZmYudG9CdWZmZXIoKTt2YXIgbGVuZ3RoPW4ubGVuZ3RoK2QubGVuZ3RoK3AubGVuZ3RoK3EubGVuZ3RoK2RtcDEubGVuZ3RoK2RtcTEubGVuZ3RoK2NvZWZmLmxlbmd0aCs1MTI7dmFyIHdyaXRlcj1uZXcgYmVyLldyaXRlcih7c2l6ZTpsZW5ndGh9KTt3cml0ZXIuc3RhcnRTZXF1ZW5jZSgpO3dyaXRlci53cml0ZUludCgwKTt3cml0ZXIud3JpdGVCdWZmZXIobiwyKTt3cml0ZXIud3JpdGVJbnQoa2V5LmUpO3dyaXRlci53cml0ZUJ1ZmZlcihkLDIpO3dyaXRlci53cml0ZUJ1ZmZlcihwLDIpO3dyaXRlci53cml0ZUJ1ZmZlcihxLDIpO3dyaXRlci53cml0ZUJ1ZmZlcihkbXAxLDIpO3dyaXRlci53cml0ZUJ1ZmZlcihkbXExLDIpO3dyaXRlci53cml0ZUJ1ZmZlcihjb2VmZiwyKTt3cml0ZXIuZW5kU2VxdWVuY2UoKTtpZihvcHRpb25zLnR5cGU9PT0iZGVyIil7cmV0dXJuIHdyaXRlci5idWZmZXJ9ZWxzZXtyZXR1cm4gUFJJVkFURV9PUEVOSU5HX0JPVU5EQVJZKyJcbiIrdXRpbHMubGluZWJyayh3cml0ZXIuYnVmZmVyLnRvU3RyaW5nKCJiYXNlNjQiKSw2NCkrIlxuIitQUklWQVRFX0NMT1NJTkdfQk9VTkRBUll9fSxwcml2YXRlSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhLG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGJ1ZmZlcjtpZihvcHRpb25zLnR5cGUhPT0iZGVyIil7aWYoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKXtkYXRhPWRhdGEudG9TdHJpbmcoInV0ZjgiKX1pZihfLmlzU3RyaW5nKGRhdGEpKXt2YXIgcGVtPXV0aWxzLnRyaW1TdXJyb3VuZGluZ1RleHQoZGF0YSxQUklWQVRFX09QRU5JTkdfQk9VTkRBUlksUFJJVkFURV9DTE9TSU5HX0JPVU5EQVJZKS5yZXBsYWNlKC9ccyt8XG5ccnxcbnxcciQvZ20sIiIpO2J1ZmZlcj1CdWZmZXIuZnJvbShwZW0sImJhc2U2NCIpfWVsc2V7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGtleSBmb3JtYXQiKX19ZWxzZSBpZihCdWZmZXIuaXNCdWZmZXIoZGF0YSkpe2J1ZmZlcj1kYXRhfWVsc2V7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGtleSBmb3JtYXQiKX12YXIgcmVhZGVyPW5ldyBiZXIuUmVhZGVyKGJ1ZmZlcik7cmVhZGVyLnJlYWRTZXF1ZW5jZSgpO3JlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSk7a2V5LnNldFByaXZhdGUocmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKSxyZWFkZXIucmVhZFN0cmluZygyLHRydWUpLHJlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSkscmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKSxyZWFkZXIucmVhZFN0cmluZygyLHRydWUpLHJlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSkscmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKSxyZWFkZXIucmVhZFN0cmluZygyLHRydWUpKX0scHVibGljRXhwb3J0OmZ1bmN0aW9uKGtleSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBuPWtleS5uLnRvQnVmZmVyKCk7dmFyIGxlbmd0aD1uLmxlbmd0aCs1MTI7dmFyIGJvZHlXcml0ZXI9bmV3IGJlci5Xcml0ZXIoe3NpemU6bGVuZ3RofSk7Ym9keVdyaXRlci5zdGFydFNlcXVlbmNlKCk7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihuLDIpO2JvZHlXcml0ZXIud3JpdGVJbnQoa2V5LmUpO2JvZHlXcml0ZXIuZW5kU2VxdWVuY2UoKTtpZihvcHRpb25zLnR5cGU9PT0iZGVyIil7cmV0dXJuIGJvZHlXcml0ZXIuYnVmZmVyfWVsc2V7cmV0dXJuIFBVQkxJQ19PUEVOSU5HX0JPVU5EQVJZKyJcbiIrdXRpbHMubGluZWJyayhib2R5V3JpdGVyLmJ1ZmZlci50b1N0cmluZygiYmFzZTY0IiksNjQpKyJcbiIrUFVCTElDX0NMT1NJTkdfQk9VTkRBUll9fSxwdWJsaWNJbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEsb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgYnVmZmVyO2lmKG9wdGlvbnMudHlwZSE9PSJkZXIiKXtpZihCdWZmZXIuaXNCdWZmZXIoZGF0YSkpe2RhdGE9ZGF0YS50b1N0cmluZygidXRmOCIpfWlmKF8uaXNTdHJpbmcoZGF0YSkpe3ZhciBwZW09dXRpbHMudHJpbVN1cnJvdW5kaW5nVGV4dChkYXRhLFBVQkxJQ19PUEVOSU5HX0JPVU5EQVJZLFBVQkxJQ19DTE9TSU5HX0JPVU5EQVJZKS5yZXBsYWNlKC9ccyt8XG5ccnxcbnxcciQvZ20sIiIpO2J1ZmZlcj1CdWZmZXIuZnJvbShwZW0sImJhc2U2NCIpfX1lbHNlIGlmKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSl7YnVmZmVyPWRhdGF9ZWxzZXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQga2V5IGZvcm1hdCIpfXZhciBib2R5PW5ldyBiZXIuUmVhZGVyKGJ1ZmZlcik7Ym9keS5yZWFkU2VxdWVuY2UoKTtrZXkuc2V0UHVibGljKGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpKX0sYXV0b0ltcG9ydDpmdW5jdGlvbihrZXksZGF0YSl7aWYoL15bXFNcc10qLS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLVxzKig/PSgoW0EtWmEtejAtOSsvPV0rXHMqKSspKVwxLS0tLS1FTkQgUlNBIFBSSVZBVEUgS0VZLS0tLS1bXFNcc10qJC9nLnRlc3QoZGF0YSkpe21vZHVsZS5leHBvcnRzLnByaXZhdGVJbXBvcnQoa2V5LGRhdGEpO3JldHVybiB0cnVlfWlmKC9eW1xTXHNdKi0tLS0tQkVHSU4gUlNBIFBVQkxJQyBLRVktLS0tLVxzKig/PSgoW0EtWmEtejAtOSsvPV0rXHMqKSspKVwxLS0tLS1FTkQgUlNBIFBVQkxJQyBLRVktLS0tLVtcU1xzXSokL2cudGVzdChkYXRhKSl7bW9kdWxlLmV4cG9ydHMucHVibGljSW1wb3J0KGtleSxkYXRhKTtyZXR1cm4gdHJ1ZX1yZXR1cm4gZmFsc2V9fX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4uL3V0aWxzIjo1Nixhc24xOjE5LGJ1ZmZlcjoyN31dLDQ5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgYmVyPXJlcXVpcmUoImFzbjEiKS5CZXI7dmFyIF89cmVxdWlyZSgiLi4vdXRpbHMiKS5fO3ZhciBQVUJMSUNfUlNBX09JRD0iMS4yLjg0MC4xMTM1NDkuMS4xLjEiO3ZhciB1dGlscz1yZXF1aXJlKCIuLi91dGlscyIpO3ZhciBQUklWQVRFX09QRU5JTkdfQk9VTkRBUlk9Ii0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLSI7dmFyIFBSSVZBVEVfQ0xPU0lOR19CT1VOREFSWT0iLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLSI7dmFyIFBVQkxJQ19PUEVOSU5HX0JPVU5EQVJZPSItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLSI7dmFyIFBVQkxJQ19DTE9TSU5HX0JPVU5EQVJZPSItLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iO21vZHVsZS5leHBvcnRzPXtwcml2YXRlRXhwb3J0OmZ1bmN0aW9uKGtleSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBuPWtleS5uLnRvQnVmZmVyKCk7dmFyIGQ9a2V5LmQudG9CdWZmZXIoKTt2YXIgcD1rZXkucC50b0J1ZmZlcigpO3ZhciBxPWtleS5xLnRvQnVmZmVyKCk7dmFyIGRtcDE9a2V5LmRtcDEudG9CdWZmZXIoKTt2YXIgZG1xMT1rZXkuZG1xMS50b0J1ZmZlcigpO3ZhciBjb2VmZj1rZXkuY29lZmYudG9CdWZmZXIoKTt2YXIgbGVuZ3RoPW4ubGVuZ3RoK2QubGVuZ3RoK3AubGVuZ3RoK3EubGVuZ3RoK2RtcDEubGVuZ3RoK2RtcTEubGVuZ3RoK2NvZWZmLmxlbmd0aCs1MTI7dmFyIGJvZHlXcml0ZXI9bmV3IGJlci5Xcml0ZXIoe3NpemU6bGVuZ3RofSk7Ym9keVdyaXRlci5zdGFydFNlcXVlbmNlKCk7Ym9keVdyaXRlci53cml0ZUludCgwKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKG4sMik7Ym9keVdyaXRlci53cml0ZUludChrZXkuZSk7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihkLDIpO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIocCwyKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKHEsMik7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihkbXAxLDIpO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIoZG1xMSwyKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKGNvZWZmLDIpO2JvZHlXcml0ZXIuZW5kU2VxdWVuY2UoKTt2YXIgd3JpdGVyPW5ldyBiZXIuV3JpdGVyKHtzaXplOmxlbmd0aH0pO3dyaXRlci5zdGFydFNlcXVlbmNlKCk7d3JpdGVyLndyaXRlSW50KDApO3dyaXRlci5zdGFydFNlcXVlbmNlKCk7d3JpdGVyLndyaXRlT0lEKFBVQkxJQ19SU0FfT0lEKTt3cml0ZXIud3JpdGVOdWxsKCk7d3JpdGVyLmVuZFNlcXVlbmNlKCk7d3JpdGVyLndyaXRlQnVmZmVyKGJvZHlXcml0ZXIuYnVmZmVyLDQpO3dyaXRlci5lbmRTZXF1ZW5jZSgpO2lmKG9wdGlvbnMudHlwZT09PSJkZXIiKXtyZXR1cm4gd3JpdGVyLmJ1ZmZlcn1lbHNle3JldHVybiBQUklWQVRFX09QRU5JTkdfQk9VTkRBUlkrIlxuIit1dGlscy5saW5lYnJrKHdyaXRlci5idWZmZXIudG9TdHJpbmcoImJhc2U2NCIpLDY0KSsiXG4iK1BSSVZBVEVfQ0xPU0lOR19CT1VOREFSWX19LHByaXZhdGVJbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEsb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgYnVmZmVyO2lmKG9wdGlvbnMudHlwZSE9PSJkZXIiKXtpZihCdWZmZXIuaXNCdWZmZXIoZGF0YSkpe2RhdGE9ZGF0YS50b1N0cmluZygidXRmOCIpfWlmKF8uaXNTdHJpbmcoZGF0YSkpe3ZhciBwZW09dXRpbHMudHJpbVN1cnJvdW5kaW5nVGV4dChkYXRhLFBSSVZBVEVfT1BFTklOR19CT1VOREFSWSxQUklWQVRFX0NMT1NJTkdfQk9VTkRBUlkpLnJlcGxhY2UoIi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0iLCIiKS5yZXBsYWNlKC9ccyt8XG5ccnxcbnxcciQvZ20sIiIpO2J1ZmZlcj1CdWZmZXIuZnJvbShwZW0sImJhc2U2NCIpfWVsc2V7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGtleSBmb3JtYXQiKX19ZWxzZSBpZihCdWZmZXIuaXNCdWZmZXIoZGF0YSkpe2J1ZmZlcj1kYXRhfWVsc2V7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGtleSBmb3JtYXQiKX12YXIgcmVhZGVyPW5ldyBiZXIuUmVhZGVyKGJ1ZmZlcik7cmVhZGVyLnJlYWRTZXF1ZW5jZSgpO3JlYWRlci5yZWFkSW50KDApO3ZhciBoZWFkZXI9bmV3IGJlci5SZWFkZXIocmVhZGVyLnJlYWRTdHJpbmcoNDgsdHJ1ZSkpO2lmKGhlYWRlci5yZWFkT0lEKDYsdHJ1ZSkhPT1QVUJMSUNfUlNBX09JRCl7dGhyb3cgRXJyb3IoIkludmFsaWQgUHVibGljIGtleSBmb3JtYXQiKX12YXIgYm9keT1uZXcgYmVyLlJlYWRlcihyZWFkZXIucmVhZFN0cmluZyg0LHRydWUpKTtib2R5LnJlYWRTZXF1ZW5jZSgpO2JvZHkucmVhZFN0cmluZygyLHRydWUpO2tleS5zZXRQcml2YXRlKGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpKX0scHVibGljRXhwb3J0OmZ1bmN0aW9uKGtleSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBuPWtleS5uLnRvQnVmZmVyKCk7dmFyIGxlbmd0aD1uLmxlbmd0aCs1MTI7dmFyIGJvZHlXcml0ZXI9bmV3IGJlci5Xcml0ZXIoe3NpemU6bGVuZ3RofSk7Ym9keVdyaXRlci53cml0ZUJ5dGUoMCk7Ym9keVdyaXRlci5zdGFydFNlcXVlbmNlKCk7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihuLDIpO2JvZHlXcml0ZXIud3JpdGVJbnQoa2V5LmUpO2JvZHlXcml0ZXIuZW5kU2VxdWVuY2UoKTt2YXIgd3JpdGVyPW5ldyBiZXIuV3JpdGVyKHtzaXplOmxlbmd0aH0pO3dyaXRlci5zdGFydFNlcXVlbmNlKCk7d3JpdGVyLnN0YXJ0U2VxdWVuY2UoKTt3cml0ZXIud3JpdGVPSUQoUFVCTElDX1JTQV9PSUQpO3dyaXRlci53cml0ZU51bGwoKTt3cml0ZXIuZW5kU2VxdWVuY2UoKTt3cml0ZXIud3JpdGVCdWZmZXIoYm9keVdyaXRlci5idWZmZXIsMyk7d3JpdGVyLmVuZFNlcXVlbmNlKCk7aWYob3B0aW9ucy50eXBlPT09ImRlciIpe3JldHVybiB3cml0ZXIuYnVmZmVyfWVsc2V7cmV0dXJuIFBVQkxJQ19PUEVOSU5HX0JPVU5EQVJZKyJcbiIrdXRpbHMubGluZWJyayh3cml0ZXIuYnVmZmVyLnRvU3RyaW5nKCJiYXNlNjQiKSw2NCkrIlxuIitQVUJMSUNfQ0xPU0lOR19CT1VOREFSWX19LHB1YmxpY0ltcG9ydDpmdW5jdGlvbihrZXksZGF0YSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBidWZmZXI7aWYob3B0aW9ucy50eXBlIT09ImRlciIpe2lmKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSl7ZGF0YT1kYXRhLnRvU3RyaW5nKCJ1dGY4Iil9aWYoXy5pc1N0cmluZyhkYXRhKSl7dmFyIHBlbT11dGlscy50cmltU3Vycm91bmRpbmdUZXh0KGRhdGEsUFVCTElDX09QRU5JTkdfQk9VTkRBUlksUFVCTElDX0NMT1NJTkdfQk9VTkRBUlkpLnJlcGxhY2UoL1xzK3xcblxyfFxufFxyJC9nbSwiIik7YnVmZmVyPUJ1ZmZlci5mcm9tKHBlbSwiYmFzZTY0Iil9fWVsc2UgaWYoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKXtidWZmZXI9ZGF0YX1lbHNle3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBrZXkgZm9ybWF0Iil9dmFyIHJlYWRlcj1uZXcgYmVyLlJlYWRlcihidWZmZXIpO3JlYWRlci5yZWFkU2VxdWVuY2UoKTt2YXIgaGVhZGVyPW5ldyBiZXIuUmVhZGVyKHJlYWRlci5yZWFkU3RyaW5nKDQ4LHRydWUpKTtpZihoZWFkZXIucmVhZE9JRCg2LHRydWUpIT09UFVCTElDX1JTQV9PSUQpe3Rocm93IEVycm9yKCJJbnZhbGlkIFB1YmxpYyBrZXkgZm9ybWF0Iil9dmFyIGJvZHk9bmV3IGJlci5SZWFkZXIocmVhZGVyLnJlYWRTdHJpbmcoMyx0cnVlKSk7Ym9keS5yZWFkQnl0ZSgpO2JvZHkucmVhZFNlcXVlbmNlKCk7a2V5LnNldFB1YmxpYyhib2R5LnJlYWRTdHJpbmcoMix0cnVlKSxib2R5LnJlYWRTdHJpbmcoMix0cnVlKSl9LGF1dG9JbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEpe2lmKC9eW1xTXHNdKi0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxzKig/PSgoW0EtWmEtejAtOSsvPV0rXHMqKSspKVwxLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVtcU1xzXSokL2cudGVzdChkYXRhKSl7bW9kdWxlLmV4cG9ydHMucHJpdmF0ZUltcG9ydChrZXksZGF0YSk7cmV0dXJuIHRydWV9aWYoL15bXFNcc10qLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1ccyooPz0oKFtBLVphLXowLTkrLz1dK1xzKikrKSlcMS0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLVtcU1xzXSokL2cudGVzdChkYXRhKSl7bW9kdWxlLmV4cG9ydHMucHVibGljSW1wb3J0KGtleSxkYXRhKTtyZXR1cm4gdHJ1ZX1yZXR1cm4gZmFsc2V9fX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4uL3V0aWxzIjo1Nixhc24xOjE5LGJ1ZmZlcjoyN31dLDUwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgY3J5cHQ9cmVxdWlyZSgiLi4vY3J5cHRvIik7dmFyIF89cmVxdWlyZSgiLi4vdXRpbHMiKS5fO3ZhciBwZXRlck9sc29uX0JpZ0ludGVnZXJTdGF0aWM9cmVxdWlyZSgiYmlnLWludGVnZXIiKTt2YXIgZGJpdHM7dmFyIGNhbmFyeT0weGRlYWRiZWVmY2FmZTt2YXIgal9sbT0oY2FuYXJ5JjE2Nzc3MjE1KT09MTU3MTUwNzA7ZnVuY3Rpb24gQmlnSW50ZWdlcihhLGIpe2lmKGEhPW51bGwpe2lmKCJudW1iZXIiPT10eXBlb2YgYSl7dGhpcy5mcm9tTnVtYmVyKGEsYil9ZWxzZSBpZihCdWZmZXIuaXNCdWZmZXIoYSkpe3RoaXMuZnJvbUJ1ZmZlcihhKX1lbHNlIGlmKGI9PW51bGwmJiJzdHJpbmciIT10eXBlb2YgYSl7dGhpcy5mcm9tQnl0ZUFycmF5KGEpfWVsc2V7dGhpcy5mcm9tU3RyaW5nKGEsYil9fX1mdW5jdGlvbiBuYmkoKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIobnVsbCl9ZnVuY3Rpb24gYW0xKGkseCx3LGosYyxuKXt3aGlsZSgtLW4+PTApe3ZhciB2PXgqdGhpc1tpKytdK3dbal0rYztjPU1hdGguZmxvb3Iodi82NzEwODg2NCk7d1tqKytdPXYmNjcxMDg4NjN9cmV0dXJuIGN9ZnVuY3Rpb24gYW0yKGkseCx3LGosYyxuKXt2YXIgeGw9eCYzMjc2Nyx4aD14Pj4xNTt3aGlsZSgtLW4+PTApe3ZhciBsPXRoaXNbaV0mMzI3Njc7dmFyIGg9dGhpc1tpKytdPj4xNTt2YXIgbT14aCpsK2gqeGw7bD14bCpsKygobSYzMjc2Nyk8PDE1KSt3W2pdKyhjJjEwNzM3NDE4MjMpO2M9KGw+Pj4zMCkrKG0+Pj4xNSkreGgqaCsoYz4+PjMwKTt3W2orK109bCYxMDczNzQxODIzfXJldHVybiBjfWZ1bmN0aW9uIGFtMyhpLHgsdyxqLGMsbil7dmFyIHhsPXgmMTYzODMseGg9eD4+MTQ7d2hpbGUoLS1uPj0wKXt2YXIgbD10aGlzW2ldJjE2MzgzO3ZhciBoPXRoaXNbaSsrXT4+MTQ7dmFyIG09eGgqbCtoKnhsO2w9eGwqbCsoKG0mMTYzODMpPDwxNCkrd1tqXStjO2M9KGw+PjI4KSsobT4+MTQpK3hoKmg7d1tqKytdPWwmMjY4NDM1NDU1fXJldHVybiBjfUJpZ0ludGVnZXIucHJvdG90eXBlLmFtPWFtMztkYml0cz0yODtCaWdJbnRlZ2VyLnByb3RvdHlwZS5EQj1kYml0cztCaWdJbnRlZ2VyLnByb3RvdHlwZS5ETT0oMTw8ZGJpdHMpLTE7QmlnSW50ZWdlci5wcm90b3R5cGUuRFY9MTw8ZGJpdHM7dmFyIEJJX0ZQPTUyO0JpZ0ludGVnZXIucHJvdG90eXBlLkZWPU1hdGgucG93KDIsQklfRlApO0JpZ0ludGVnZXIucHJvdG90eXBlLkYxPUJJX0ZQLWRiaXRzO0JpZ0ludGVnZXIucHJvdG90eXBlLkYyPTIqZGJpdHMtQklfRlA7dmFyIEJJX1JNPSIwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoiO3ZhciBCSV9SQz1uZXcgQXJyYXk7dmFyIHJyLHZ2O3JyPSIwIi5jaGFyQ29kZUF0KDApO2Zvcih2dj0wO3Z2PD05OysrdnYpQklfUkNbcnIrK109dnY7cnI9ImEiLmNoYXJDb2RlQXQoMCk7Zm9yKHZ2PTEwO3Z2PDM2OysrdnYpQklfUkNbcnIrK109dnY7cnI9IkEiLmNoYXJDb2RlQXQoMCk7Zm9yKHZ2PTEwO3Z2PDM2OysrdnYpQklfUkNbcnIrK109dnY7ZnVuY3Rpb24gaW50MmNoYXIobil7cmV0dXJuIEJJX1JNLmNoYXJBdChuKX1mdW5jdGlvbiBpbnRBdChzLGkpe3ZhciBjPUJJX1JDW3MuY2hhckNvZGVBdChpKV07cmV0dXJuIGM9PW51bGw/LTE6Y31mdW5jdGlvbiBibnBDb3B5VG8ocil7Zm9yKHZhciBpPXRoaXMudC0xO2k+PTA7LS1pKXJbaV09dGhpc1tpXTtyLnQ9dGhpcy50O3Iucz10aGlzLnN9ZnVuY3Rpb24gYm5wRnJvbUludCh4KXt0aGlzLnQ9MTt0aGlzLnM9eDwwPy0xOjA7aWYoeD4wKXRoaXNbMF09eDtlbHNlIGlmKHg8LTEpdGhpc1swXT14K0RWO2Vsc2UgdGhpcy50PTB9ZnVuY3Rpb24gbmJ2KGkpe3ZhciByPW5iaSgpO3IuZnJvbUludChpKTtyZXR1cm4gcn1mdW5jdGlvbiBibnBGcm9tU3RyaW5nKGRhdGEscmFkaXgsdW5zaWduZWQpe3ZhciBrO3N3aXRjaChyYWRpeCl7Y2FzZSAyOms9MTticmVhaztjYXNlIDQ6az0yO2JyZWFrO2Nhc2UgODprPTM7YnJlYWs7Y2FzZSAxNjprPTQ7YnJlYWs7Y2FzZSAzMjprPTU7YnJlYWs7Y2FzZSAyNTY6az04O2JyZWFrO2RlZmF1bHQ6dGhpcy5mcm9tUmFkaXgoZGF0YSxyYWRpeCk7cmV0dXJufXRoaXMudD0wO3RoaXMucz0wO3ZhciBpPWRhdGEubGVuZ3RoO3ZhciBtaT1mYWxzZTt2YXIgc2g9MDt3aGlsZSgtLWk+PTApe3ZhciB4PWs9PTg/ZGF0YVtpXSYyNTU6aW50QXQoZGF0YSxpKTtpZih4PDApe2lmKGRhdGEuY2hhckF0KGkpPT0iLSIpbWk9dHJ1ZTtjb250aW51ZX1taT1mYWxzZTtpZihzaD09PTApdGhpc1t0aGlzLnQrK109eDtlbHNlIGlmKHNoK2s+dGhpcy5EQil7dGhpc1t0aGlzLnQtMV18PSh4JigxPDx0aGlzLkRCLXNoKS0xKTw8c2g7dGhpc1t0aGlzLnQrK109eD4+dGhpcy5EQi1zaH1lbHNlIHRoaXNbdGhpcy50LTFdfD14PDxzaDtzaCs9aztpZihzaD49dGhpcy5EQilzaC09dGhpcy5EQn1pZighdW5zaWduZWQmJms9PTgmJihkYXRhWzBdJjEyOCkhPTApe3RoaXMucz0tMTtpZihzaD4wKXRoaXNbdGhpcy50LTFdfD0oMTw8dGhpcy5EQi1zaCktMTw8c2h9dGhpcy5jbGFtcCgpO2lmKG1pKUJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLHRoaXMpfWZ1bmN0aW9uIGJucEZyb21CeXRlQXJyYXkoYSx1bnNpZ25lZCl7dGhpcy5mcm9tU3RyaW5nKGEsMjU2LHVuc2lnbmVkKX1mdW5jdGlvbiBibnBGcm9tQnVmZmVyKGEpe3RoaXMuZnJvbVN0cmluZyhhLDI1Nix0cnVlKX1mdW5jdGlvbiBibnBDbGFtcCgpe3ZhciBjPXRoaXMucyZ0aGlzLkRNO3doaWxlKHRoaXMudD4wJiZ0aGlzW3RoaXMudC0xXT09YyktLXRoaXMudH1mdW5jdGlvbiBiblRvU3RyaW5nKGIpe2lmKHRoaXMuczwwKXJldHVybiItIit0aGlzLm5lZ2F0ZSgpLnRvU3RyaW5nKGIpO3ZhciBrO2lmKGI9PTE2KWs9NDtlbHNlIGlmKGI9PTgpaz0zO2Vsc2UgaWYoYj09MilrPTE7ZWxzZSBpZihiPT0zMilrPTU7ZWxzZSBpZihiPT00KWs9MjtlbHNlIHJldHVybiB0aGlzLnRvUmFkaXgoYik7dmFyIGttPSgxPDxrKS0xLGQsbT1mYWxzZSxyPSIiLGk9dGhpcy50O3ZhciBwPXRoaXMuREItaSp0aGlzLkRCJWs7aWYoaS0tID4wKXtpZihwPHRoaXMuREImJihkPXRoaXNbaV0+PnApPjApe209dHJ1ZTtyPWludDJjaGFyKGQpfXdoaWxlKGk+PTApe2lmKHA8ayl7ZD0odGhpc1tpXSYoMTw8cCktMSk8PGstcDtkfD10aGlzWy0taV0+PihwKz10aGlzLkRCLWspfWVsc2V7ZD10aGlzW2ldPj4ocC09aykma207aWYocDw9MCl7cCs9dGhpcy5EQjstLWl9fWlmKGQ+MCltPXRydWU7aWYobSlyKz1pbnQyY2hhcihkKX19cmV0dXJuIG0/cjoiMCJ9ZnVuY3Rpb24gYm5OZWdhdGUoKXt2YXIgcj1uYmkoKTtCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcyxyKTtyZXR1cm4gcn1mdW5jdGlvbiBibkFicygpe3JldHVybiB0aGlzLnM8MD90aGlzLm5lZ2F0ZSgpOnRoaXN9ZnVuY3Rpb24gYm5Db21wYXJlVG8oYSl7dmFyIHI9dGhpcy5zLWEucztpZihyIT0wKXJldHVybiByO3ZhciBpPXRoaXMudDtyPWktYS50O2lmKHIhPTApcmV0dXJuIHRoaXMuczwwPy1yOnI7d2hpbGUoLS1pPj0wKWlmKChyPXRoaXNbaV0tYVtpXSkhPTApcmV0dXJuIHI7cmV0dXJuIDB9ZnVuY3Rpb24gbmJpdHMoeCl7dmFyIHI9MSx0O2lmKCh0PXg+Pj4xNikhPTApe3g9dDtyKz0xNn1pZigodD14Pj44KSE9MCl7eD10O3IrPTh9aWYoKHQ9eD4+NCkhPTApe3g9dDtyKz00fWlmKCh0PXg+PjIpIT0wKXt4PXQ7cis9Mn1pZigodD14Pj4xKSE9MCl7eD10O3IrPTF9cmV0dXJuIHJ9ZnVuY3Rpb24gYm5CaXRMZW5ndGgoKXtpZih0aGlzLnQ8PTApcmV0dXJuIDA7cmV0dXJuIHRoaXMuREIqKHRoaXMudC0xKStuYml0cyh0aGlzW3RoaXMudC0xXV50aGlzLnMmdGhpcy5ETSl9ZnVuY3Rpb24gYm5wRExTaGlmdFRvKG4scil7dmFyIGk7Zm9yKGk9dGhpcy50LTE7aT49MDstLWkpcltpK25dPXRoaXNbaV07Zm9yKGk9bi0xO2k+PTA7LS1pKXJbaV09MDtyLnQ9dGhpcy50K247ci5zPXRoaXMuc31mdW5jdGlvbiBibnBEUlNoaWZ0VG8obixyKXtmb3IodmFyIGk9bjtpPHRoaXMudDsrK2kpcltpLW5dPXRoaXNbaV07ci50PU1hdGgubWF4KHRoaXMudC1uLDApO3Iucz10aGlzLnN9ZnVuY3Rpb24gYm5wTFNoaWZ0VG8obixyKXt2YXIgYnM9biV0aGlzLkRCO3ZhciBjYnM9dGhpcy5EQi1iczt2YXIgYm09KDE8PGNicyktMTt2YXIgZHM9TWF0aC5mbG9vcihuL3RoaXMuREIpLGM9dGhpcy5zPDxicyZ0aGlzLkRNLGk7Zm9yKGk9dGhpcy50LTE7aT49MDstLWkpe3JbaStkcysxXT10aGlzW2ldPj5jYnN8YztjPSh0aGlzW2ldJmJtKTw8YnN9Zm9yKGk9ZHMtMTtpPj0wOy0taSlyW2ldPTA7cltkc109YztyLnQ9dGhpcy50K2RzKzE7ci5zPXRoaXMucztyLmNsYW1wKCl9ZnVuY3Rpb24gYm5wUlNoaWZ0VG8obixyKXtyLnM9dGhpcy5zO3ZhciBkcz1NYXRoLmZsb29yKG4vdGhpcy5EQik7aWYoZHM+PXRoaXMudCl7ci50PTA7cmV0dXJufXZhciBicz1uJXRoaXMuREI7dmFyIGNicz10aGlzLkRCLWJzO3ZhciBibT0oMTw8YnMpLTE7clswXT10aGlzW2RzXT4+YnM7Zm9yKHZhciBpPWRzKzE7aTx0aGlzLnQ7KytpKXtyW2ktZHMtMV18PSh0aGlzW2ldJmJtKTw8Y2JzO3JbaS1kc109dGhpc1tpXT4+YnN9aWYoYnM+MClyW3RoaXMudC1kcy0xXXw9KHRoaXMucyZibSk8PGNicztyLnQ9dGhpcy50LWRzO3IuY2xhbXAoKX1mdW5jdGlvbiBibnBTdWJUbyhhLHIpe3ZhciBpPTAsYz0wLG09TWF0aC5taW4oYS50LHRoaXMudCk7d2hpbGUoaTxtKXtjKz10aGlzW2ldLWFbaV07cltpKytdPWMmdGhpcy5ETTtjPj49dGhpcy5EQn1pZihhLnQ8dGhpcy50KXtjLT1hLnM7d2hpbGUoaTx0aGlzLnQpe2MrPXRoaXNbaV07cltpKytdPWMmdGhpcy5ETTtjPj49dGhpcy5EQn1jKz10aGlzLnN9ZWxzZXtjKz10aGlzLnM7d2hpbGUoaTxhLnQpe2MtPWFbaV07cltpKytdPWMmdGhpcy5ETTtjPj49dGhpcy5EQn1jLT1hLnN9ci5zPWM8MD8tMTowO2lmKGM8LTEpcltpKytdPXRoaXMuRFYrYztlbHNlIGlmKGM+MClyW2krK109YztyLnQ9aTtyLmNsYW1wKCl9ZnVuY3Rpb24gYm5wTXVsdGlwbHlUbyhhLHIpe3ZhciB4PXRoaXMuYWJzKCkseT1hLmFicygpO3ZhciBpPXgudDtyLnQ9aSt5LnQ7d2hpbGUoLS1pPj0wKXJbaV09MDtmb3IoaT0wO2k8eS50OysraSlyW2kreC50XT14LmFtKDAseVtpXSxyLGksMCx4LnQpO3Iucz0wO3IuY2xhbXAoKTtpZih0aGlzLnMhPWEucylCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ocixyKX1mdW5jdGlvbiBibnBTcXVhcmVUbyhyKXt2YXIgeD10aGlzLmFicygpO3ZhciBpPXIudD0yKngudDt3aGlsZSgtLWk+PTApcltpXT0wO2ZvcihpPTA7aTx4LnQtMTsrK2kpe3ZhciBjPXguYW0oaSx4W2ldLHIsMippLDAsMSk7aWYoKHJbaSt4LnRdKz14LmFtKGkrMSwyKnhbaV0sciwyKmkrMSxjLHgudC1pLTEpKT49eC5EVil7cltpK3gudF0tPXguRFY7cltpK3gudCsxXT0xfX1pZihyLnQ+MClyW3IudC0xXSs9eC5hbShpLHhbaV0sciwyKmksMCwxKTtyLnM9MDtyLmNsYW1wKCl9ZnVuY3Rpb24gYm5wRGl2UmVtVG8obSxxLHIpe3ZhciBwbT1tLmFicygpO2lmKHBtLnQ8PTApcmV0dXJuO3ZhciBwdD10aGlzLmFicygpO2lmKHB0LnQ8cG0udCl7aWYocSE9bnVsbClxLmZyb21JbnQoMCk7aWYociE9bnVsbCl0aGlzLmNvcHlUbyhyKTtyZXR1cm59aWYocj09bnVsbClyPW5iaSgpO3ZhciB5PW5iaSgpLHRzPXRoaXMucyxtcz1tLnM7dmFyIG5zaD10aGlzLkRCLW5iaXRzKHBtW3BtLnQtMV0pO2lmKG5zaD4wKXtwbS5sU2hpZnRUbyhuc2gseSk7cHQubFNoaWZ0VG8obnNoLHIpfWVsc2V7cG0uY29weVRvKHkpO3B0LmNvcHlUbyhyKX12YXIgeXM9eS50O3ZhciB5MD15W3lzLTFdO2lmKHkwPT09MClyZXR1cm47dmFyIHl0PXkwKigxPDx0aGlzLkYxKSsoeXM+MT95W3lzLTJdPj50aGlzLkYyOjApO3ZhciBkMT10aGlzLkZWL3l0LGQyPSgxPDx0aGlzLkYxKS95dCxlPTE8PHRoaXMuRjI7dmFyIGk9ci50LGo9aS15cyx0PXE9PW51bGw/bmJpKCk6cTt5LmRsU2hpZnRUbyhqLHQpO2lmKHIuY29tcGFyZVRvKHQpPj0wKXtyW3IudCsrXT0xO3Iuc3ViVG8odCxyKX1CaWdJbnRlZ2VyLk9ORS5kbFNoaWZ0VG8oeXMsdCk7dC5zdWJUbyh5LHkpO3doaWxlKHkudDx5cyl5W3kudCsrXT0wO3doaWxlKC0taj49MCl7dmFyIHFkPXJbLS1pXT09eTA/dGhpcy5ETTpNYXRoLmZsb29yKHJbaV0qZDErKHJbaS0xXStlKSpkMik7aWYoKHJbaV0rPXkuYW0oMCxxZCxyLGosMCx5cykpPHFkKXt5LmRsU2hpZnRUbyhqLHQpO3Iuc3ViVG8odCxyKTt3aGlsZShyW2ldPC0tcWQpci5zdWJUbyh0LHIpfX1pZihxIT1udWxsKXtyLmRyU2hpZnRUbyh5cyxxKTtpZih0cyE9bXMpQmlnSW50ZWdlci5aRVJPLnN1YlRvKHEscSl9ci50PXlzO3IuY2xhbXAoKTtpZihuc2g+MClyLnJTaGlmdFRvKG5zaCxyKTtpZih0czwwKUJpZ0ludGVnZXIuWkVSTy5zdWJUbyhyLHIpfWZ1bmN0aW9uIGJuTW9kKGEpe3ZhciByPW5iaSgpO3RoaXMuYWJzKCkuZGl2UmVtVG8oYSxudWxsLHIpO2lmKHRoaXMuczwwJiZyLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLlpFUk8pPjApYS5zdWJUbyhyLHIpO3JldHVybiByfWZ1bmN0aW9uIENsYXNzaWMobSl7dGhpcy5tPW19ZnVuY3Rpb24gY0NvbnZlcnQoeCl7aWYoeC5zPDB8fHguY29tcGFyZVRvKHRoaXMubSk+PTApcmV0dXJuIHgubW9kKHRoaXMubSk7ZWxzZSByZXR1cm4geH1mdW5jdGlvbiBjUmV2ZXJ0KHgpe3JldHVybiB4fWZ1bmN0aW9uIGNSZWR1Y2UoeCl7eC5kaXZSZW1Ubyh0aGlzLm0sbnVsbCx4KX1mdW5jdGlvbiBjTXVsVG8oeCx5LHIpe3gubXVsdGlwbHlUbyh5LHIpO3RoaXMucmVkdWNlKHIpfWZ1bmN0aW9uIGNTcXJUbyh4LHIpe3guc3F1YXJlVG8ocik7dGhpcy5yZWR1Y2Uocil9Q2xhc3NpYy5wcm90b3R5cGUuY29udmVydD1jQ29udmVydDtDbGFzc2ljLnByb3RvdHlwZS5yZXZlcnQ9Y1JldmVydDtDbGFzc2ljLnByb3RvdHlwZS5yZWR1Y2U9Y1JlZHVjZTtDbGFzc2ljLnByb3RvdHlwZS5tdWxUbz1jTXVsVG87Q2xhc3NpYy5wcm90b3R5cGUuc3FyVG89Y1NxclRvO2Z1bmN0aW9uIGJucEludkRpZ2l0KCl7aWYodGhpcy50PDEpcmV0dXJuIDA7dmFyIHg9dGhpc1swXTtpZigoeCYxKT09PTApcmV0dXJuIDA7dmFyIHk9eCYzO3k9eSooMi0oeCYxNSkqeSkmMTU7eT15KigyLSh4JjI1NSkqeSkmMjU1O3k9eSooMi0oKHgmNjU1MzUpKnkmNjU1MzUpKSY2NTUzNTt5PXkqKDIteCp5JXRoaXMuRFYpJXRoaXMuRFY7cmV0dXJuIHk+MD90aGlzLkRWLXk6LXl9ZnVuY3Rpb24gTW9udGdvbWVyeShtKXt0aGlzLm09bTt0aGlzLm1wPW0uaW52RGlnaXQoKTt0aGlzLm1wbD10aGlzLm1wJjMyNzY3O3RoaXMubXBoPXRoaXMubXA+PjE1O3RoaXMudW09KDE8PG0uREItMTUpLTE7dGhpcy5tdDI9MiptLnR9ZnVuY3Rpb24gbW9udENvbnZlcnQoeCl7dmFyIHI9bmJpKCk7eC5hYnMoKS5kbFNoaWZ0VG8odGhpcy5tLnQscik7ci5kaXZSZW1Ubyh0aGlzLm0sbnVsbCxyKTtpZih4LnM8MCYmci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKT4wKXRoaXMubS5zdWJUbyhyLHIpO3JldHVybiByfWZ1bmN0aW9uIG1vbnRSZXZlcnQoeCl7dmFyIHI9bmJpKCk7eC5jb3B5VG8ocik7dGhpcy5yZWR1Y2Uocik7cmV0dXJuIHJ9ZnVuY3Rpb24gbW9udFJlZHVjZSh4KXt3aGlsZSh4LnQ8PXRoaXMubXQyKXhbeC50KytdPTA7Zm9yKHZhciBpPTA7aTx0aGlzLm0udDsrK2kpe3ZhciBqPXhbaV0mMzI3Njc7dmFyIHUwPWoqdGhpcy5tcGwrKChqKnRoaXMubXBoKyh4W2ldPj4xNSkqdGhpcy5tcGwmdGhpcy51bSk8PDE1KSZ4LkRNO2o9aSt0aGlzLm0udDt4W2pdKz10aGlzLm0uYW0oMCx1MCx4LGksMCx0aGlzLm0udCk7d2hpbGUoeFtqXT49eC5EVil7eFtqXS09eC5EVjt4Wysral0rK319eC5jbGFtcCgpO3guZHJTaGlmdFRvKHRoaXMubS50LHgpO2lmKHguY29tcGFyZVRvKHRoaXMubSk+PTApeC5zdWJUbyh0aGlzLm0seCl9ZnVuY3Rpb24gbW9udFNxclRvKHgscil7eC5zcXVhcmVUbyhyKTt0aGlzLnJlZHVjZShyKX1mdW5jdGlvbiBtb250TXVsVG8oeCx5LHIpe3gubXVsdGlwbHlUbyh5LHIpO3RoaXMucmVkdWNlKHIpfU1vbnRnb21lcnkucHJvdG90eXBlLmNvbnZlcnQ9bW9udENvbnZlcnQ7TW9udGdvbWVyeS5wcm90b3R5cGUucmV2ZXJ0PW1vbnRSZXZlcnQ7TW9udGdvbWVyeS5wcm90b3R5cGUucmVkdWNlPW1vbnRSZWR1Y2U7TW9udGdvbWVyeS5wcm90b3R5cGUubXVsVG89bW9udE11bFRvO01vbnRnb21lcnkucHJvdG90eXBlLnNxclRvPW1vbnRTcXJUbztmdW5jdGlvbiBibnBJc0V2ZW4oKXtyZXR1cm4odGhpcy50PjA/dGhpc1swXSYxOnRoaXMucyk9PT0wfWZ1bmN0aW9uIGJucEV4cChlLHope2lmKGU+NDI5NDk2NzI5NXx8ZTwxKXJldHVybiBCaWdJbnRlZ2VyLk9ORTt2YXIgcj1uYmkoKSxyMj1uYmkoKSxnPXouY29udmVydCh0aGlzKSxpPW5iaXRzKGUpLTE7Zy5jb3B5VG8ocik7d2hpbGUoLS1pPj0wKXt6LnNxclRvKHIscjIpO2lmKChlJjE8PGkpPjApei5tdWxUbyhyMixnLHIpO2Vsc2V7dmFyIHQ9cjtyPXIyO3IyPXR9fXJldHVybiB6LnJldmVydChyKX1mdW5jdGlvbiBibk1vZFBvd0ludChlLG0pe3ZhciB6O2lmKGU8MjU2fHxtLmlzRXZlbigpKXo9bmV3IENsYXNzaWMobSk7ZWxzZSB6PW5ldyBNb250Z29tZXJ5KG0pO3JldHVybiB0aGlzLmV4cChlLHopfWZ1bmN0aW9uIGJuQ2xvbmUoKXt2YXIgcj1uYmkoKTt0aGlzLmNvcHlUbyhyKTtyZXR1cm4gcn1mdW5jdGlvbiBibkludFZhbHVlKCl7aWYodGhpcy5zPDApe2lmKHRoaXMudD09MSlyZXR1cm4gdGhpc1swXS10aGlzLkRWO2Vsc2UgaWYodGhpcy50PT09MClyZXR1cm4tMX1lbHNlIGlmKHRoaXMudD09MSlyZXR1cm4gdGhpc1swXTtlbHNlIGlmKHRoaXMudD09PTApcmV0dXJuIDA7cmV0dXJuKHRoaXNbMV0mKDE8PDMyLXRoaXMuREIpLTEpPDx0aGlzLkRCfHRoaXNbMF19ZnVuY3Rpb24gYm5CeXRlVmFsdWUoKXtyZXR1cm4gdGhpcy50PT0wP3RoaXMuczp0aGlzWzBdPDwyND4+MjR9ZnVuY3Rpb24gYm5TaG9ydFZhbHVlKCl7cmV0dXJuIHRoaXMudD09MD90aGlzLnM6dGhpc1swXTw8MTY+PjE2fWZ1bmN0aW9uIGJucENodW5rU2l6ZShyKXtyZXR1cm4gTWF0aC5mbG9vcihNYXRoLkxOMip0aGlzLkRCL01hdGgubG9nKHIpKX1mdW5jdGlvbiBiblNpZ051bSgpe2lmKHRoaXMuczwwKXJldHVybi0xO2Vsc2UgaWYodGhpcy50PD0wfHx0aGlzLnQ9PTEmJnRoaXNbMF08PTApcmV0dXJuIDA7ZWxzZSByZXR1cm4gMX1mdW5jdGlvbiBibnBUb1JhZGl4KGIpe2lmKGI9PW51bGwpYj0xMDtpZih0aGlzLnNpZ251bSgpPT09MHx8YjwyfHxiPjM2KXJldHVybiIwIjt2YXIgY3M9dGhpcy5jaHVua1NpemUoYik7dmFyIGE9TWF0aC5wb3coYixjcyk7dmFyIGQ9bmJ2KGEpLHk9bmJpKCksej1uYmkoKSxyPSIiO3RoaXMuZGl2UmVtVG8oZCx5LHopO3doaWxlKHkuc2lnbnVtKCk+MCl7cj0oYSt6LmludFZhbHVlKCkpLnRvU3RyaW5nKGIpLnN1YnN0cigxKStyO3kuZGl2UmVtVG8oZCx5LHopfXJldHVybiB6LmludFZhbHVlKCkudG9TdHJpbmcoYikrcn1mdW5jdGlvbiBibnBGcm9tUmFkaXgocyxiKXt0aGlzLmZyb21JbnQoMCk7aWYoYj09bnVsbCliPTEwO3ZhciBjcz10aGlzLmNodW5rU2l6ZShiKTt2YXIgZD1NYXRoLnBvdyhiLGNzKSxtaT1mYWxzZSxqPTAsdz0wO2Zvcih2YXIgaT0wO2k8cy5sZW5ndGg7KytpKXt2YXIgeD1pbnRBdChzLGkpO2lmKHg8MCl7aWYocy5jaGFyQXQoaSk9PSItIiYmdGhpcy5zaWdudW0oKT09PTApbWk9dHJ1ZTtjb250aW51ZX13PWIqdyt4O2lmKCsraj49Y3Mpe3RoaXMuZE11bHRpcGx5KGQpO3RoaXMuZEFkZE9mZnNldCh3LDApO2o9MDt3PTB9fWlmKGo+MCl7dGhpcy5kTXVsdGlwbHkoTWF0aC5wb3coYixqKSk7dGhpcy5kQWRkT2Zmc2V0KHcsMCl9aWYobWkpQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsdGhpcyl9ZnVuY3Rpb24gYm5wRnJvbU51bWJlcihhLGIpe2lmKCJudW1iZXIiPT10eXBlb2YgYil7aWYoYTwyKXRoaXMuZnJvbUludCgxKTtlbHNle3RoaXMuZnJvbU51bWJlcihhKTtpZighdGhpcy50ZXN0Qml0KGEtMSkpdGhpcy5iaXR3aXNlVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEtMSksb3Bfb3IsdGhpcyk7aWYodGhpcy5pc0V2ZW4oKSl0aGlzLmRBZGRPZmZzZXQoMSwwKTt3aGlsZSghdGhpcy5pc1Byb2JhYmxlUHJpbWUoYikpe3RoaXMuZEFkZE9mZnNldCgyLDApO2lmKHRoaXMuYml0TGVuZ3RoKCk+YSl0aGlzLnN1YlRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhLTEpLHRoaXMpfX19ZWxzZXt2YXIgeD1jcnlwdC5yYW5kb21CeXRlcygoYT4+MykrMSk7dmFyIHQ9YSY3O2lmKHQ+MCl4WzBdJj0oMTw8dCktMTtlbHNlIHhbMF09MDt0aGlzLmZyb21CeXRlQXJyYXkoeCl9fWZ1bmN0aW9uIGJuVG9CeXRlQXJyYXkoKXt2YXIgaT10aGlzLnQscj1uZXcgQXJyYXk7clswXT10aGlzLnM7dmFyIHA9dGhpcy5EQi1pKnRoaXMuREIlOCxkLGs9MDtpZihpLS0gPjApe2lmKHA8dGhpcy5EQiYmKGQ9dGhpc1tpXT4+cCkhPSh0aGlzLnMmdGhpcy5ETSk+PnApcltrKytdPWR8dGhpcy5zPDx0aGlzLkRCLXA7d2hpbGUoaT49MCl7aWYocDw4KXtkPSh0aGlzW2ldJigxPDxwKS0xKTw8OC1wO2R8PXRoaXNbLS1pXT4+KHArPXRoaXMuREItOCl9ZWxzZXtkPXRoaXNbaV0+PihwLT04KSYyNTU7aWYocDw9MCl7cCs9dGhpcy5EQjstLWl9fWlmKChkJjEyOCkhPTApZHw9LTI1NjtpZihrPT09MCYmKHRoaXMucyYxMjgpIT0oZCYxMjgpKSsraztpZihrPjB8fGQhPXRoaXMucylyW2srK109ZH19cmV0dXJuIHJ9ZnVuY3Rpb24gYm5Ub0J1ZmZlcih0cmltT3JTaXplKXt2YXIgcmVzPUJ1ZmZlci5mcm9tKHRoaXMudG9CeXRlQXJyYXkoKSk7aWYodHJpbU9yU2l6ZT09PXRydWUmJnJlc1swXT09PTApe3Jlcz1yZXMuc2xpY2UoMSl9ZWxzZSBpZihfLmlzTnVtYmVyKHRyaW1PclNpemUpKXtpZihyZXMubGVuZ3RoPnRyaW1PclNpemUpe2Zvcih2YXIgaT0wO2k8cmVzLmxlbmd0aC10cmltT3JTaXplO2krKyl7aWYocmVzW2ldIT09MCl7cmV0dXJuIG51bGx9fXJldHVybiByZXMuc2xpY2UocmVzLmxlbmd0aC10cmltT3JTaXplKX1lbHNlIGlmKHJlcy5sZW5ndGg8dHJpbU9yU2l6ZSl7dmFyIHBhZGRlZD1CdWZmZXIuYWxsb2ModHJpbU9yU2l6ZSk7cGFkZGVkLmZpbGwoMCwwLHRyaW1PclNpemUtcmVzLmxlbmd0aCk7cmVzLmNvcHkocGFkZGVkLHRyaW1PclNpemUtcmVzLmxlbmd0aCk7cmV0dXJuIHBhZGRlZH19cmV0dXJuIHJlc31mdW5jdGlvbiBibkVxdWFscyhhKXtyZXR1cm4gdGhpcy5jb21wYXJlVG8oYSk9PTB9ZnVuY3Rpb24gYm5NaW4oYSl7cmV0dXJuIHRoaXMuY29tcGFyZVRvKGEpPDA/dGhpczphfWZ1bmN0aW9uIGJuTWF4KGEpe3JldHVybiB0aGlzLmNvbXBhcmVUbyhhKT4wP3RoaXM6YX1mdW5jdGlvbiBibnBCaXR3aXNlVG8oYSxvcCxyKXt2YXIgaSxmLG09TWF0aC5taW4oYS50LHRoaXMudCk7Zm9yKGk9MDtpPG07KytpKXJbaV09b3AodGhpc1tpXSxhW2ldKTtpZihhLnQ8dGhpcy50KXtmPWEucyZ0aGlzLkRNO2ZvcihpPW07aTx0aGlzLnQ7KytpKXJbaV09b3AodGhpc1tpXSxmKTtyLnQ9dGhpcy50fWVsc2V7Zj10aGlzLnMmdGhpcy5ETTtmb3IoaT1tO2k8YS50OysraSlyW2ldPW9wKGYsYVtpXSk7ci50PWEudH1yLnM9b3AodGhpcy5zLGEucyk7ci5jbGFtcCgpfWZ1bmN0aW9uIG9wX2FuZCh4LHkpe3JldHVybiB4Jnl9ZnVuY3Rpb24gYm5BbmQoYSl7dmFyIHI9bmJpKCk7dGhpcy5iaXR3aXNlVG8oYSxvcF9hbmQscik7cmV0dXJuIHJ9ZnVuY3Rpb24gb3Bfb3IoeCx5KXtyZXR1cm4geHx5fWZ1bmN0aW9uIGJuT3IoYSl7dmFyIHI9bmJpKCk7dGhpcy5iaXR3aXNlVG8oYSxvcF9vcixyKTtyZXR1cm4gcn1mdW5jdGlvbiBvcF94b3IoeCx5KXtyZXR1cm4geF55fWZ1bmN0aW9uIGJuWG9yKGEpe3ZhciByPW5iaSgpO3RoaXMuYml0d2lzZVRvKGEsb3BfeG9yLHIpO3JldHVybiByfWZ1bmN0aW9uIG9wX2FuZG5vdCh4LHkpe3JldHVybiB4Jn55fWZ1bmN0aW9uIGJuQW5kTm90KGEpe3ZhciByPW5iaSgpO3RoaXMuYml0d2lzZVRvKGEsb3BfYW5kbm90LHIpO3JldHVybiByfWZ1bmN0aW9uIGJuTm90KCl7dmFyIHI9bmJpKCk7Zm9yKHZhciBpPTA7aTx0aGlzLnQ7KytpKXJbaV09dGhpcy5ETSZ+dGhpc1tpXTtyLnQ9dGhpcy50O3Iucz1+dGhpcy5zO3JldHVybiByfWZ1bmN0aW9uIGJuU2hpZnRMZWZ0KG4pe3ZhciByPW5iaSgpO2lmKG48MCl0aGlzLnJTaGlmdFRvKC1uLHIpO2Vsc2UgdGhpcy5sU2hpZnRUbyhuLHIpO3JldHVybiByfWZ1bmN0aW9uIGJuU2hpZnRSaWdodChuKXt2YXIgcj1uYmkoKTtpZihuPDApdGhpcy5sU2hpZnRUbygtbixyKTtlbHNlIHRoaXMuclNoaWZ0VG8obixyKTtyZXR1cm4gcn1mdW5jdGlvbiBsYml0KHgpe2lmKHg9PT0wKXJldHVybi0xO3ZhciByPTA7aWYoKHgmNjU1MzUpPT09MCl7eD4+PTE2O3IrPTE2fWlmKCh4JjI1NSk9PT0wKXt4Pj49ODtyKz04fWlmKCh4JjE1KT09PTApe3g+Pj00O3IrPTR9aWYoKHgmMyk9PT0wKXt4Pj49MjtyKz0yfWlmKCh4JjEpPT09MCkrK3I7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5HZXRMb3dlc3RTZXRCaXQoKXtmb3IodmFyIGk9MDtpPHRoaXMudDsrK2kpaWYodGhpc1tpXSE9MClyZXR1cm4gaSp0aGlzLkRCK2xiaXQodGhpc1tpXSk7aWYodGhpcy5zPDApcmV0dXJuIHRoaXMudCp0aGlzLkRCO3JldHVybi0xfWZ1bmN0aW9uIGNiaXQoeCl7dmFyIHI9MDt3aGlsZSh4IT0wKXt4Jj14LTE7KytyfXJldHVybiByfWZ1bmN0aW9uIGJuQml0Q291bnQoKXt2YXIgcj0wLHg9dGhpcy5zJnRoaXMuRE07Zm9yKHZhciBpPTA7aTx0aGlzLnQ7KytpKXIrPWNiaXQodGhpc1tpXV54KTtyZXR1cm4gcn1mdW5jdGlvbiBiblRlc3RCaXQobil7dmFyIGo9TWF0aC5mbG9vcihuL3RoaXMuREIpO2lmKGo+PXRoaXMudClyZXR1cm4gdGhpcy5zIT0wO3JldHVybih0aGlzW2pdJjE8PG4ldGhpcy5EQikhPTB9ZnVuY3Rpb24gYm5wQ2hhbmdlQml0KG4sb3Ape3ZhciByPUJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChuKTt0aGlzLmJpdHdpc2VUbyhyLG9wLHIpO3JldHVybiByfWZ1bmN0aW9uIGJuU2V0Qml0KG4pe3JldHVybiB0aGlzLmNoYW5nZUJpdChuLG9wX29yKX1mdW5jdGlvbiBibkNsZWFyQml0KG4pe3JldHVybiB0aGlzLmNoYW5nZUJpdChuLG9wX2FuZG5vdCl9ZnVuY3Rpb24gYm5GbGlwQml0KG4pe3JldHVybiB0aGlzLmNoYW5nZUJpdChuLG9wX3hvcil9ZnVuY3Rpb24gYm5wQWRkVG8oYSxyKXt2YXIgaT0wLGM9MCxtPU1hdGgubWluKGEudCx0aGlzLnQpO3doaWxlKGk8bSl7Yys9dGhpc1tpXSthW2ldO3JbaSsrXT1jJnRoaXMuRE07Yz4+PXRoaXMuREJ9aWYoYS50PHRoaXMudCl7Yys9YS5zO3doaWxlKGk8dGhpcy50KXtjKz10aGlzW2ldO3JbaSsrXT1jJnRoaXMuRE07Yz4+PXRoaXMuREJ9Yys9dGhpcy5zfWVsc2V7Yys9dGhpcy5zO3doaWxlKGk8YS50KXtjKz1hW2ldO3JbaSsrXT1jJnRoaXMuRE07Yz4+PXRoaXMuREJ9Yys9YS5zfXIucz1jPDA/LTE6MDtpZihjPjApcltpKytdPWM7ZWxzZSBpZihjPC0xKXJbaSsrXT10aGlzLkRWK2M7ci50PWk7ci5jbGFtcCgpfWZ1bmN0aW9uIGJuQWRkKGEpe3ZhciByPW5iaSgpO3RoaXMuYWRkVG8oYSxyKTtyZXR1cm4gcn1mdW5jdGlvbiBiblN1YnRyYWN0KGEpe3ZhciByPW5iaSgpO3RoaXMuc3ViVG8oYSxyKTtyZXR1cm4gcn1mdW5jdGlvbiBibk11bHRpcGx5KGEpe3ZhciByPW5iaSgpO3RoaXMubXVsdGlwbHlUbyhhLHIpO3JldHVybiByfWZ1bmN0aW9uIGJuU3F1YXJlKCl7dmFyIHI9bmJpKCk7dGhpcy5zcXVhcmVUbyhyKTtyZXR1cm4gcn1mdW5jdGlvbiBibkRpdmlkZShhKXt2YXIgcj1uYmkoKTt0aGlzLmRpdlJlbVRvKGEscixudWxsKTtyZXR1cm4gcn1mdW5jdGlvbiBiblJlbWFpbmRlcihhKXt2YXIgcj1uYmkoKTt0aGlzLmRpdlJlbVRvKGEsbnVsbCxyKTtyZXR1cm4gcn1mdW5jdGlvbiBibkRpdmlkZUFuZFJlbWFpbmRlcihhKXt2YXIgcT1uYmkoKSxyPW5iaSgpO3RoaXMuZGl2UmVtVG8oYSxxLHIpO3JldHVybiBuZXcgQXJyYXkocSxyKX1mdW5jdGlvbiBibnBETXVsdGlwbHkobil7dGhpc1t0aGlzLnRdPXRoaXMuYW0oMCxuLTEsdGhpcywwLDAsdGhpcy50KTsrK3RoaXMudDt0aGlzLmNsYW1wKCl9ZnVuY3Rpb24gYm5wREFkZE9mZnNldChuLHcpe2lmKG49PT0wKXJldHVybjt3aGlsZSh0aGlzLnQ8PXcpdGhpc1t0aGlzLnQrK109MDt0aGlzW3ddKz1uO3doaWxlKHRoaXNbd10+PXRoaXMuRFYpe3RoaXNbd10tPXRoaXMuRFY7aWYoKyt3Pj10aGlzLnQpdGhpc1t0aGlzLnQrK109MDsrK3RoaXNbd119fWZ1bmN0aW9uIE51bGxFeHAoKXt9ZnVuY3Rpb24gbk5vcCh4KXtyZXR1cm4geH1mdW5jdGlvbiBuTXVsVG8oeCx5LHIpe3gubXVsdGlwbHlUbyh5LHIpfWZ1bmN0aW9uIG5TcXJUbyh4LHIpe3guc3F1YXJlVG8ocil9TnVsbEV4cC5wcm90b3R5cGUuY29udmVydD1uTm9wO051bGxFeHAucHJvdG90eXBlLnJldmVydD1uTm9wO051bGxFeHAucHJvdG90eXBlLm11bFRvPW5NdWxUbztOdWxsRXhwLnByb3RvdHlwZS5zcXJUbz1uU3FyVG87ZnVuY3Rpb24gYm5Qb3coZSl7cmV0dXJuIHRoaXMuZXhwKGUsbmV3IE51bGxFeHApfWZ1bmN0aW9uIGJucE11bHRpcGx5TG93ZXJUbyhhLG4scil7dmFyIGk9TWF0aC5taW4odGhpcy50K2EudCxuKTtyLnM9MDtyLnQ9aTt3aGlsZShpPjApclstLWldPTA7dmFyIGo7Zm9yKGo9ci50LXRoaXMudDtpPGo7KytpKXJbaSt0aGlzLnRdPXRoaXMuYW0oMCxhW2ldLHIsaSwwLHRoaXMudCk7Zm9yKGo9TWF0aC5taW4oYS50LG4pO2k8ajsrK2kpdGhpcy5hbSgwLGFbaV0scixpLDAsbi1pKTtyLmNsYW1wKCl9ZnVuY3Rpb24gYm5wTXVsdGlwbHlVcHBlclRvKGEsbixyKXstLW47dmFyIGk9ci50PXRoaXMudCthLnQtbjtyLnM9MDt3aGlsZSgtLWk+PTApcltpXT0wO2ZvcihpPU1hdGgubWF4KG4tdGhpcy50LDApO2k8YS50OysraSlyW3RoaXMudCtpLW5dPXRoaXMuYW0obi1pLGFbaV0sciwwLDAsdGhpcy50K2ktbik7ci5jbGFtcCgpO3IuZHJTaGlmdFRvKDEscil9ZnVuY3Rpb24gQmFycmV0dChtKXt0aGlzLnIyPW5iaSgpO3RoaXMucTM9bmJpKCk7QmlnSW50ZWdlci5PTkUuZGxTaGlmdFRvKDIqbS50LHRoaXMucjIpO3RoaXMubXU9dGhpcy5yMi5kaXZpZGUobSk7dGhpcy5tPW19ZnVuY3Rpb24gYmFycmV0dENvbnZlcnQoeCl7aWYoeC5zPDB8fHgudD4yKnRoaXMubS50KXJldHVybiB4Lm1vZCh0aGlzLm0pO2Vsc2UgaWYoeC5jb21wYXJlVG8odGhpcy5tKTwwKXJldHVybiB4O2Vsc2V7dmFyIHI9bmJpKCk7eC5jb3B5VG8ocik7dGhpcy5yZWR1Y2Uocik7cmV0dXJuIHJ9fWZ1bmN0aW9uIGJhcnJldHRSZXZlcnQoeCl7cmV0dXJuIHh9ZnVuY3Rpb24gYmFycmV0dFJlZHVjZSh4KXt4LmRyU2hpZnRUbyh0aGlzLm0udC0xLHRoaXMucjIpO2lmKHgudD50aGlzLm0udCsxKXt4LnQ9dGhpcy5tLnQrMTt4LmNsYW1wKCl9dGhpcy5tdS5tdWx0aXBseVVwcGVyVG8odGhpcy5yMix0aGlzLm0udCsxLHRoaXMucTMpO3RoaXMubS5tdWx0aXBseUxvd2VyVG8odGhpcy5xMyx0aGlzLm0udCsxLHRoaXMucjIpO3doaWxlKHguY29tcGFyZVRvKHRoaXMucjIpPDApeC5kQWRkT2Zmc2V0KDEsdGhpcy5tLnQrMSk7eC5zdWJUbyh0aGlzLnIyLHgpO3doaWxlKHguY29tcGFyZVRvKHRoaXMubSk+PTApeC5zdWJUbyh0aGlzLm0seCl9ZnVuY3Rpb24gYmFycmV0dFNxclRvKHgscil7eC5zcXVhcmVUbyhyKTt0aGlzLnJlZHVjZShyKX1mdW5jdGlvbiBiYXJyZXR0TXVsVG8oeCx5LHIpe3gubXVsdGlwbHlUbyh5LHIpO3RoaXMucmVkdWNlKHIpfUJhcnJldHQucHJvdG90eXBlLmNvbnZlcnQ9YmFycmV0dENvbnZlcnQ7QmFycmV0dC5wcm90b3R5cGUucmV2ZXJ0PWJhcnJldHRSZXZlcnQ7QmFycmV0dC5wcm90b3R5cGUucmVkdWNlPWJhcnJldHRSZWR1Y2U7QmFycmV0dC5wcm90b3R5cGUubXVsVG89YmFycmV0dE11bFRvO0JhcnJldHQucHJvdG90eXBlLnNxclRvPWJhcnJldHRTcXJUbztmdW5jdGlvbiBibk1vZFBvdyhlLG0pe3JldHVybiBnZXRPcHRpbWFsSW1wbCgpLmFwcGx5KHRoaXMsW2UsbV0pfUJpZ0ludGVnZXIubW9kUG93SW1wbD11bmRlZmluZWQ7QmlnSW50ZWdlci5zZXRNb2RQb3dJbXBsPWZ1bmN0aW9uKGF1dGhvck5hbWUpe0JpZ0ludGVnZXIubW9kUG93SW1wbD1mdW5jdGlvbigpe3N3aXRjaChhdXRob3JOYW1lKXtjYXNlIlBldGVyIE9sc29uIjpyZXR1cm4gYm5Nb2RQb3dfcGV0ZXJPbHNvbjtjYXNlIlRvbSBXdSI6cmV0dXJuIGJuTW9kUG93X3RvbVd1fX0oKX07dmFyIGdldE9wdGltYWxJbXBsPWZ1bmN0aW9uKCl7e3ZhciByZXN1bHQ9QmlnSW50ZWdlci5tb2RQb3dJbXBsO2lmKHJlc3VsdCE9PXVuZGVmaW5lZCl7cmV0dXJuIHJlc3VsdH19dmFyIHg9bmV3IEJpZ0ludGVnZXIoIjQzMzMzNzA3OTIzMDA4MzkyMTQ4ODA3ODM2NDc1NjAiLDEwKTt2YXIgZT1uZXcgQmlnSW50ZWdlcigiMzcwNzkyMzAwODM5MjE0ODgwNzgzNjQ3NTYwOTQxOSIsMTApO3ZhciBtPW5ldyBCaWdJbnRlZ2VyKCIxNDgzMTY5MjAzMzU2ODU5NTIzMTM0NTkwMjQzNzYwIiwxMCk7dmFyIHN0YXJ0PURhdGUubm93KCk7Ym5Nb2RQb3dfcGV0ZXJPbHNvbi5hcHBseSh4LFtlLG1dKTt2YXIgZHVyYXRpb25QZXRlck9sc29uPURhdGUubm93KCktc3RhcnQ7c3RhcnQ9RGF0ZS5ub3coKTtibk1vZFBvd190b21XdS5hcHBseSh4LFtlLG1dKTt2YXIgZHVyYXRpb25Ub21XdT1EYXRlLm5vdygpLXN0YXJ0O0JpZ0ludGVnZXIubW9kUG93SW1wbD1kdXJhdGlvblBldGVyT2xzb248ZHVyYXRpb25Ub21XdT9ibk1vZFBvd19wZXRlck9sc29uOmJuTW9kUG93X3RvbVd1O3JldHVybiBnZXRPcHRpbWFsSW1wbCgpfTtmdW5jdGlvbiBibk1vZFBvd19wZXRlck9sc29uKGUsbSl7dmFyIHBvVGhpcz1wZXRlck9sc29uX0JpZ0ludGVnZXJTdGF0aWModGhpcy50b1N0cmluZygxMCksMTApO3ZhciBwb0U9cGV0ZXJPbHNvbl9CaWdJbnRlZ2VyU3RhdGljKGUudG9TdHJpbmcoMTApLDEwKTt2YXIgcG9NPXBldGVyT2xzb25fQmlnSW50ZWdlclN0YXRpYyhtLnRvU3RyaW5nKDEwKSwxMCk7dmFyIHBvT3V0PXBvVGhpcy5tb2RQb3cocG9FLHBvTSk7dmFyIG91dD1uZXcgQmlnSW50ZWdlcihwb091dC50b1N0cmluZygxMCksMTApO3JldHVybiBvdXR9ZnVuY3Rpb24gYm5Nb2RQb3dfdG9tV3UoZSxtKXt2YXIgaT1lLmJpdExlbmd0aCgpLGsscj1uYnYoMSksejtpZihpPD0wKXJldHVybiByO2Vsc2UgaWYoaTwxOClrPTE7ZWxzZSBpZihpPDQ4KWs9MztlbHNlIGlmKGk8MTQ0KWs9NDtlbHNlIGlmKGk8NzY4KWs9NTtlbHNlIGs9NjtpZihpPDgpej1uZXcgQ2xhc3NpYyhtKTtlbHNlIGlmKG0uaXNFdmVuKCkpej1uZXcgQmFycmV0dChtKTtlbHNlIHo9bmV3IE1vbnRnb21lcnkobSk7dmFyIGc9bmV3IEFycmF5LG49MyxrMT1rLTEsa209KDE8PGspLTE7Z1sxXT16LmNvbnZlcnQodGhpcyk7aWYoaz4xKXt2YXIgZzI9bmJpKCk7ei5zcXJUbyhnWzFdLGcyKTt3aGlsZShuPD1rbSl7Z1tuXT1uYmkoKTt6Lm11bFRvKGcyLGdbbi0yXSxnW25dKTtuKz0yfX12YXIgaj1lLnQtMSx3LGlzMT10cnVlLHIyPW5iaSgpLHQ7aT1uYml0cyhlW2pdKS0xO3doaWxlKGo+PTApe2lmKGk+PWsxKXc9ZVtqXT4+aS1rMSZrbTtlbHNle3c9KGVbal0mKDE8PGkrMSktMSk8PGsxLWk7aWYoaj4wKXd8PWVbai0xXT4+dGhpcy5EQitpLWsxfW49azt3aGlsZSgodyYxKT09PTApe3c+Pj0xOy0tbn1pZigoaS09bik8MCl7aSs9dGhpcy5EQjstLWp9aWYoaXMxKXtnW3ddLmNvcHlUbyhyKTtpczE9ZmFsc2V9ZWxzZXt3aGlsZShuPjEpe3ouc3FyVG8ocixyMik7ei5zcXJUbyhyMixyKTtuLT0yfWlmKG4+MCl6LnNxclRvKHIscjIpO2Vsc2V7dD1yO3I9cjI7cjI9dH16Lm11bFRvKHIyLGdbd10scil9d2hpbGUoaj49MCYmKGVbal0mMTw8aSk9PT0wKXt6LnNxclRvKHIscjIpO3Q9cjtyPXIyO3IyPXQ7aWYoLS1pPDApe2k9dGhpcy5EQi0xOy0tan19fXJldHVybiB6LnJldmVydChyKX1mdW5jdGlvbiBibkdDRChhKXt2YXIgeD10aGlzLnM8MD90aGlzLm5lZ2F0ZSgpOnRoaXMuY2xvbmUoKTt2YXIgeT1hLnM8MD9hLm5lZ2F0ZSgpOmEuY2xvbmUoKTtpZih4LmNvbXBhcmVUbyh5KTwwKXt2YXIgdD14O3g9eTt5PXR9dmFyIGk9eC5nZXRMb3dlc3RTZXRCaXQoKSxnPXkuZ2V0TG93ZXN0U2V0Qml0KCk7aWYoZzwwKXJldHVybiB4O2lmKGk8ZylnPWk7aWYoZz4wKXt4LnJTaGlmdFRvKGcseCk7eS5yU2hpZnRUbyhnLHkpfXdoaWxlKHguc2lnbnVtKCk+MCl7aWYoKGk9eC5nZXRMb3dlc3RTZXRCaXQoKSk+MCl4LnJTaGlmdFRvKGkseCk7aWYoKGk9eS5nZXRMb3dlc3RTZXRCaXQoKSk+MCl5LnJTaGlmdFRvKGkseSk7aWYoeC5jb21wYXJlVG8oeSk+PTApe3guc3ViVG8oeSx4KTt4LnJTaGlmdFRvKDEseCl9ZWxzZXt5LnN1YlRvKHgseSk7eS5yU2hpZnRUbygxLHkpfX1pZihnPjApeS5sU2hpZnRUbyhnLHkpO3JldHVybiB5fWZ1bmN0aW9uIGJucE1vZEludChuKXtpZihuPD0wKXJldHVybiAwO3ZhciBkPXRoaXMuRFYlbixyPXRoaXMuczwwP24tMTowO2lmKHRoaXMudD4wKWlmKGQ9PT0wKXI9dGhpc1swXSVuO2Vsc2UgZm9yKHZhciBpPXRoaXMudC0xO2k+PTA7LS1pKXI9KGQqcit0aGlzW2ldKSVuO3JldHVybiByfWZ1bmN0aW9uIGJuTW9kSW52ZXJzZShtKXt2YXIgYWM9bS5pc0V2ZW4oKTtpZih0aGlzLmlzRXZlbigpJiZhY3x8bS5zaWdudW0oKT09PTApcmV0dXJuIEJpZ0ludGVnZXIuWkVSTzt2YXIgdT1tLmNsb25lKCksdj10aGlzLmNsb25lKCk7dmFyIGE9bmJ2KDEpLGI9bmJ2KDApLGM9bmJ2KDApLGQ9bmJ2KDEpO3doaWxlKHUuc2lnbnVtKCkhPTApe3doaWxlKHUuaXNFdmVuKCkpe3UuclNoaWZ0VG8oMSx1KTtpZihhYyl7aWYoIWEuaXNFdmVuKCl8fCFiLmlzRXZlbigpKXthLmFkZFRvKHRoaXMsYSk7Yi5zdWJUbyhtLGIpfWEuclNoaWZ0VG8oMSxhKX1lbHNlIGlmKCFiLmlzRXZlbigpKWIuc3ViVG8obSxiKTtiLnJTaGlmdFRvKDEsYil9d2hpbGUodi5pc0V2ZW4oKSl7di5yU2hpZnRUbygxLHYpO2lmKGFjKXtpZighYy5pc0V2ZW4oKXx8IWQuaXNFdmVuKCkpe2MuYWRkVG8odGhpcyxjKTtkLnN1YlRvKG0sZCl9Yy5yU2hpZnRUbygxLGMpfWVsc2UgaWYoIWQuaXNFdmVuKCkpZC5zdWJUbyhtLGQpO2QuclNoaWZ0VG8oMSxkKX1pZih1LmNvbXBhcmVUbyh2KT49MCl7dS5zdWJUbyh2LHUpO2lmKGFjKWEuc3ViVG8oYyxhKTtiLnN1YlRvKGQsYil9ZWxzZXt2LnN1YlRvKHUsdik7aWYoYWMpYy5zdWJUbyhhLGMpO2Quc3ViVG8oYixkKX19aWYodi5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpIT0wKXJldHVybiBCaWdJbnRlZ2VyLlpFUk87aWYoZC5jb21wYXJlVG8obSk+PTApcmV0dXJuIGQuc3VidHJhY3QobSk7aWYoZC5zaWdudW0oKTwwKWQuYWRkVG8obSxkKTtlbHNlIHJldHVybiBkO2lmKGQuc2lnbnVtKCk8MClyZXR1cm4gZC5hZGQobSk7ZWxzZSByZXR1cm4gZH12YXIgbG93cHJpbWVzPVsyLDMsNSw3LDExLDEzLDE3LDE5LDIzLDI5LDMxLDM3LDQxLDQzLDQ3LDUzLDU5LDYxLDY3LDcxLDczLDc5LDgzLDg5LDk3LDEwMSwxMDMsMTA3LDEwOSwxMTMsMTI3LDEzMSwxMzcsMTM5LDE0OSwxNTEsMTU3LDE2MywxNjcsMTczLDE3OSwxODEsMTkxLDE5MywxOTcsMTk5LDIxMSwyMjMsMjI3LDIyOSwyMzMsMjM5LDI0MSwyNTEsMjU3LDI2MywyNjksMjcxLDI3NywyODEsMjgzLDI5MywzMDcsMzExLDMxMywzMTcsMzMxLDMzNywzNDcsMzQ5LDM1MywzNTksMzY3LDM3MywzNzksMzgzLDM4OSwzOTcsNDAxLDQwOSw0MTksNDIxLDQzMSw0MzMsNDM5LDQ0Myw0NDksNDU3LDQ2MSw0NjMsNDY3LDQ3OSw0ODcsNDkxLDQ5OSw1MDMsNTA5LDUyMSw1MjMsNTQxLDU0Nyw1NTcsNTYzLDU2OSw1NzEsNTc3LDU4Nyw1OTMsNTk5LDYwMSw2MDcsNjEzLDYxNyw2MTksNjMxLDY0MSw2NDMsNjQ3LDY1Myw2NTksNjYxLDY3Myw2NzcsNjgzLDY5MSw3MDEsNzA5LDcxOSw3MjcsNzMzLDczOSw3NDMsNzUxLDc1Nyw3NjEsNzY5LDc3Myw3ODcsNzk3LDgwOSw4MTEsODIxLDgyMyw4MjcsODI5LDgzOSw4NTMsODU3LDg1OSw4NjMsODc3LDg4MSw4ODMsODg3LDkwNyw5MTEsOTE5LDkyOSw5MzcsOTQxLDk0Nyw5NTMsOTY3LDk3MSw5NzcsOTgzLDk5MSw5OTddO3ZhciBscGxpbT0oMTw8MjYpL2xvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoLTFdO2Z1bmN0aW9uIGJuSXNQcm9iYWJsZVByaW1lKHQpe3ZhciBpLHg9dGhpcy5hYnMoKTtpZih4LnQ9PTEmJnhbMF08PWxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoLTFdKXtmb3IoaT0wO2k8bG93cHJpbWVzLmxlbmd0aDsrK2kpaWYoeFswXT09bG93cHJpbWVzW2ldKXJldHVybiB0cnVlO3JldHVybiBmYWxzZX1pZih4LmlzRXZlbigpKXJldHVybiBmYWxzZTtpPTE7d2hpbGUoaTxsb3dwcmltZXMubGVuZ3RoKXt2YXIgbT1sb3dwcmltZXNbaV0saj1pKzE7d2hpbGUoajxsb3dwcmltZXMubGVuZ3RoJiZtPGxwbGltKW0qPWxvd3ByaW1lc1tqKytdO209eC5tb2RJbnQobSk7d2hpbGUoaTxqKWlmKG0lbG93cHJpbWVzW2krK109PT0wKXJldHVybiBmYWxzZX1yZXR1cm4geC5taWxsZXJSYWJpbih0KX1mdW5jdGlvbiBibnBNaWxsZXJSYWJpbih0KXt2YXIgbjE9dGhpcy5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7dmFyIGs9bjEuZ2V0TG93ZXN0U2V0Qml0KCk7aWYoazw9MClyZXR1cm4gZmFsc2U7dmFyIHI9bjEuc2hpZnRSaWdodChrKTt0PXQrMT4+MTtpZih0Pmxvd3ByaW1lcy5sZW5ndGgpdD1sb3dwcmltZXMubGVuZ3RoO3ZhciBhPW5iaSgpO2Zvcih2YXIgaT0wO2k8dDsrK2kpe2EuZnJvbUludChsb3dwcmltZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKmxvd3ByaW1lcy5sZW5ndGgpXSk7dmFyIHk9YS5tb2RQb3cocix0aGlzKTtpZih5LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkhPTAmJnkuY29tcGFyZVRvKG4xKSE9MCl7dmFyIGo9MTt3aGlsZShqKys8ayYmeS5jb21wYXJlVG8objEpIT0wKXt5PXkubW9kUG93SW50KDIsdGhpcyk7aWYoeS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpPT09MClyZXR1cm4gZmFsc2V9aWYoeS5jb21wYXJlVG8objEpIT0wKXJldHVybiBmYWxzZX19cmV0dXJuIHRydWV9QmlnSW50ZWdlci5wcm90b3R5cGUuY29weVRvPWJucENvcHlUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tSW50PWJucEZyb21JbnQ7QmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVN0cmluZz1ibnBGcm9tU3RyaW5nO0JpZ0ludGVnZXIucHJvdG90eXBlLmZyb21CeXRlQXJyYXk9Ym5wRnJvbUJ5dGVBcnJheTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tQnVmZmVyPWJucEZyb21CdWZmZXI7QmlnSW50ZWdlci5wcm90b3R5cGUuY2xhbXA9Ym5wQ2xhbXA7QmlnSW50ZWdlci5wcm90b3R5cGUuZGxTaGlmdFRvPWJucERMU2hpZnRUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5kclNoaWZ0VG89Ym5wRFJTaGlmdFRvO0JpZ0ludGVnZXIucHJvdG90eXBlLmxTaGlmdFRvPWJucExTaGlmdFRvO0JpZ0ludGVnZXIucHJvdG90eXBlLnJTaGlmdFRvPWJucFJTaGlmdFRvO0JpZ0ludGVnZXIucHJvdG90eXBlLnN1YlRvPWJucFN1YlRvO0JpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5VG89Ym5wTXVsdGlwbHlUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5zcXVhcmVUbz1ibnBTcXVhcmVUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZSZW1Ubz1ibnBEaXZSZW1UbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnZEaWdpdD1ibnBJbnZEaWdpdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0V2ZW49Ym5wSXNFdmVuO0JpZ0ludGVnZXIucHJvdG90eXBlLmV4cD1ibnBFeHA7QmlnSW50ZWdlci5wcm90b3R5cGUuY2h1bmtTaXplPWJucENodW5rU2l6ZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS50b1JhZGl4PWJucFRvUmFkaXg7QmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVJhZGl4PWJucEZyb21SYWRpeDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tTnVtYmVyPWJucEZyb21OdW1iZXI7QmlnSW50ZWdlci5wcm90b3R5cGUuYml0d2lzZVRvPWJucEJpdHdpc2VUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5jaGFuZ2VCaXQ9Ym5wQ2hhbmdlQml0O0JpZ0ludGVnZXIucHJvdG90eXBlLmFkZFRvPWJucEFkZFRvO0JpZ0ludGVnZXIucHJvdG90eXBlLmRNdWx0aXBseT1ibnBETXVsdGlwbHk7QmlnSW50ZWdlci5wcm90b3R5cGUuZEFkZE9mZnNldD1ibnBEQWRkT2Zmc2V0O0JpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5TG93ZXJUbz1ibnBNdWx0aXBseUxvd2VyVG87QmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlVcHBlclRvPWJucE11bHRpcGx5VXBwZXJUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnQ9Ym5wTW9kSW50O0JpZ0ludGVnZXIucHJvdG90eXBlLm1pbGxlclJhYmluPWJucE1pbGxlclJhYmluO0JpZ0ludGVnZXIucHJvdG90eXBlLnRvU3RyaW5nPWJuVG9TdHJpbmc7QmlnSW50ZWdlci5wcm90b3R5cGUubmVnYXRlPWJuTmVnYXRlO0JpZ0ludGVnZXIucHJvdG90eXBlLmFicz1ibkFicztCaWdJbnRlZ2VyLnByb3RvdHlwZS5jb21wYXJlVG89Ym5Db21wYXJlVG87QmlnSW50ZWdlci5wcm90b3R5cGUuYml0TGVuZ3RoPWJuQml0TGVuZ3RoO0JpZ0ludGVnZXIucHJvdG90eXBlLm1vZD1ibk1vZDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3dJbnQ9Ym5Nb2RQb3dJbnQ7QmlnSW50ZWdlci5wcm90b3R5cGUuY2xvbmU9Ym5DbG9uZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnRWYWx1ZT1ibkludFZhbHVlO0JpZ0ludGVnZXIucHJvdG90eXBlLmJ5dGVWYWx1ZT1ibkJ5dGVWYWx1ZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaG9ydFZhbHVlPWJuU2hvcnRWYWx1ZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaWdudW09Ym5TaWdOdW07QmlnSW50ZWdlci5wcm90b3R5cGUudG9CeXRlQXJyYXk9Ym5Ub0J5dGVBcnJheTtCaWdJbnRlZ2VyLnByb3RvdHlwZS50b0J1ZmZlcj1iblRvQnVmZmVyO0JpZ0ludGVnZXIucHJvdG90eXBlLmVxdWFscz1ibkVxdWFscztCaWdJbnRlZ2VyLnByb3RvdHlwZS5taW49Ym5NaW47QmlnSW50ZWdlci5wcm90b3R5cGUubWF4PWJuTWF4O0JpZ0ludGVnZXIucHJvdG90eXBlLmFuZD1ibkFuZDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5vcj1ibk9yO0JpZ0ludGVnZXIucHJvdG90eXBlLnhvcj1iblhvcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmROb3Q9Ym5BbmROb3Q7QmlnSW50ZWdlci5wcm90b3R5cGUubm90PWJuTm90O0JpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0TGVmdD1iblNoaWZ0TGVmdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdFJpZ2h0PWJuU2hpZnRSaWdodDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5nZXRMb3dlc3RTZXRCaXQ9Ym5HZXRMb3dlc3RTZXRCaXQ7QmlnSW50ZWdlci5wcm90b3R5cGUuYml0Q291bnQ9Ym5CaXRDb3VudDtCaWdJbnRlZ2VyLnByb3RvdHlwZS50ZXN0Qml0PWJuVGVzdEJpdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zZXRCaXQ9Ym5TZXRCaXQ7QmlnSW50ZWdlci5wcm90b3R5cGUuY2xlYXJCaXQ9Ym5DbGVhckJpdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5mbGlwQml0PWJuRmxpcEJpdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGQ9Ym5BZGQ7QmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3Q9Ym5TdWJ0cmFjdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseT1ibk11bHRpcGx5O0JpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZT1ibkRpdmlkZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5yZW1haW5kZXI9Ym5SZW1haW5kZXI7QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2aWRlQW5kUmVtYWluZGVyPWJuRGl2aWRlQW5kUmVtYWluZGVyO0JpZ0ludGVnZXIucHJvdG90eXBlLm1vZFBvdz1ibk1vZFBvdztCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnZlcnNlPWJuTW9kSW52ZXJzZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5wb3c9Ym5Qb3c7QmlnSW50ZWdlci5wcm90b3R5cGUuZ2NkPWJuR0NEO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZT1ibklzUHJvYmFibGVQcmltZTtCaWdJbnRlZ2VyLmludDJjaGFyPWludDJjaGFyO0JpZ0ludGVnZXIuWkVSTz1uYnYoMCk7QmlnSW50ZWdlci5PTkU9bmJ2KDEpO0JpZ0ludGVnZXIucHJvdG90eXBlLnNxdWFyZT1iblNxdWFyZTttb2R1bGUuZXhwb3J0cz1CaWdJbnRlZ2VyfSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vY3J5cHRvIjo0MSwiLi4vdXRpbHMiOjU2LCJiaWctaW50ZWdlciI6MjUsYnVmZmVyOjI3fV0sNTE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBfPXJlcXVpcmUoIi4uL3V0aWxzIikuXzt2YXIgQmlnSW50ZWdlcj1yZXF1aXJlKCIuL2pzYm4uanMiKTt2YXIgdXRpbHM9cmVxdWlyZSgiLi4vdXRpbHMuanMiKTt2YXIgc2NoZW1lcz1yZXF1aXJlKCIuLi9zY2hlbWVzL3NjaGVtZXMuanMiKTt2YXIgZW5jcnlwdEVuZ2luZXM9cmVxdWlyZSgiLi4vZW5jcnlwdEVuZ2luZXMvZW5jcnlwdEVuZ2luZXMuanMiKTtleHBvcnRzLkJpZ0ludGVnZXI9QmlnSW50ZWdlcjttb2R1bGUuZXhwb3J0cy5LZXk9ZnVuY3Rpb24oKXtmdW5jdGlvbiBSU0FLZXkoKXt0aGlzLm49bnVsbDt0aGlzLmU9MDt0aGlzLmQ9bnVsbDt0aGlzLnA9bnVsbDt0aGlzLnE9bnVsbDt0aGlzLmRtcDE9bnVsbDt0aGlzLmRtcTE9bnVsbDt0aGlzLmNvZWZmPW51bGx9UlNBS2V5LnByb3RvdHlwZS5zZXRPcHRpb25zPWZ1bmN0aW9uKG9wdGlvbnMpe3ZhciBzaWduaW5nU2NoZW1lUHJvdmlkZXI9c2NoZW1lc1tvcHRpb25zLnNpZ25pbmdTY2hlbWVdO3ZhciBlbmNyeXB0aW9uU2NoZW1lUHJvdmlkZXI9c2NoZW1lc1tvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVdO2lmKHNpZ25pbmdTY2hlbWVQcm92aWRlcj09PWVuY3J5cHRpb25TY2hlbWVQcm92aWRlcil7dGhpcy5zaWduaW5nU2NoZW1lPXRoaXMuZW5jcnlwdGlvblNjaGVtZT1lbmNyeXB0aW9uU2NoZW1lUHJvdmlkZXIubWFrZVNjaGVtZSh0aGlzLG9wdGlvbnMpfWVsc2V7dGhpcy5lbmNyeXB0aW9uU2NoZW1lPWVuY3J5cHRpb25TY2hlbWVQcm92aWRlci5tYWtlU2NoZW1lKHRoaXMsb3B0aW9ucyk7dGhpcy5zaWduaW5nU2NoZW1lPXNpZ25pbmdTY2hlbWVQcm92aWRlci5tYWtlU2NoZW1lKHRoaXMsb3B0aW9ucyl9dGhpcy5lbmNyeXB0RW5naW5lPWVuY3J5cHRFbmdpbmVzLmdldEVuZ2luZSh0aGlzLG9wdGlvbnMpfTtSU0FLZXkucHJvdG90eXBlLmdlbmVyYXRlPWZ1bmN0aW9uKEIsRSl7dmFyIHFzPUI+PjE7dGhpcy5lPXBhcnNlSW50KEUsMTYpO3ZhciBlZT1uZXcgQmlnSW50ZWdlcihFLDE2KTt3aGlsZSh0cnVlKXt3aGlsZSh0cnVlKXt0aGlzLnA9bmV3IEJpZ0ludGVnZXIoQi1xcywxKTtpZih0aGlzLnAuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpLmdjZChlZSkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKT09PTAmJnRoaXMucC5pc1Byb2JhYmxlUHJpbWUoMTApKWJyZWFrfXdoaWxlKHRydWUpe3RoaXMucT1uZXcgQmlnSW50ZWdlcihxcywxKTtpZih0aGlzLnEuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpLmdjZChlZSkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKT09PTAmJnRoaXMucS5pc1Byb2JhYmxlUHJpbWUoMTApKWJyZWFrfWlmKHRoaXMucC5jb21wYXJlVG8odGhpcy5xKTw9MCl7dmFyIHQ9dGhpcy5wO3RoaXMucD10aGlzLnE7dGhpcy5xPXR9dmFyIHAxPXRoaXMucC5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7dmFyIHExPXRoaXMucS5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7dmFyIHBoaT1wMS5tdWx0aXBseShxMSk7aWYocGhpLmdjZChlZSkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKT09PTApe3RoaXMubj10aGlzLnAubXVsdGlwbHkodGhpcy5xKTtpZih0aGlzLm4uYml0TGVuZ3RoKCk8Qil7Y29udGludWV9dGhpcy5kPWVlLm1vZEludmVyc2UocGhpKTt0aGlzLmRtcDE9dGhpcy5kLm1vZChwMSk7dGhpcy5kbXExPXRoaXMuZC5tb2QocTEpO3RoaXMuY29lZmY9dGhpcy5xLm1vZEludmVyc2UodGhpcy5wKTticmVha319dGhpcy4kJHJlY2FsY3VsYXRlQ2FjaGUoKX07UlNBS2V5LnByb3RvdHlwZS5zZXRQcml2YXRlPWZ1bmN0aW9uKE4sRSxELFAsUSxEUCxEUSxDKXtpZihOJiZFJiZEJiZOLmxlbmd0aD4wJiYoXy5pc051bWJlcihFKXx8RS5sZW5ndGg+MCkmJkQubGVuZ3RoPjApe3RoaXMubj1uZXcgQmlnSW50ZWdlcihOKTt0aGlzLmU9Xy5pc051bWJlcihFKT9FOnV0aWxzLmdldDMySW50RnJvbUJ1ZmZlcihFLDApO3RoaXMuZD1uZXcgQmlnSW50ZWdlcihEKTtpZihQJiZRJiZEUCYmRFEmJkMpe3RoaXMucD1uZXcgQmlnSW50ZWdlcihQKTt0aGlzLnE9bmV3IEJpZ0ludGVnZXIoUSk7dGhpcy5kbXAxPW5ldyBCaWdJbnRlZ2VyKERQKTt0aGlzLmRtcTE9bmV3IEJpZ0ludGVnZXIoRFEpO3RoaXMuY29lZmY9bmV3IEJpZ0ludGVnZXIoQyl9ZWxzZXt9dGhpcy4kJHJlY2FsY3VsYXRlQ2FjaGUoKX1lbHNle3Rocm93IEVycm9yKCJJbnZhbGlkIFJTQSBwcml2YXRlIGtleSIpfX07UlNBS2V5LnByb3RvdHlwZS5zZXRQdWJsaWM9ZnVuY3Rpb24oTixFKXtpZihOJiZFJiZOLmxlbmd0aD4wJiYoXy5pc051bWJlcihFKXx8RS5sZW5ndGg+MCkpe3RoaXMubj1uZXcgQmlnSW50ZWdlcihOKTt0aGlzLmU9Xy5pc051bWJlcihFKT9FOnV0aWxzLmdldDMySW50RnJvbUJ1ZmZlcihFLDApO3RoaXMuJCRyZWNhbGN1bGF0ZUNhY2hlKCl9ZWxzZXt0aHJvdyBFcnJvcigiSW52YWxpZCBSU0EgcHVibGljIGtleSIpfX07UlNBS2V5LnByb3RvdHlwZS4kZG9Qcml2YXRlPWZ1bmN0aW9uKHgpe2lmKHRoaXMucHx8dGhpcy5xKXtyZXR1cm4geC5tb2RQb3codGhpcy5kLHRoaXMubil9dmFyIHhwPXgubW9kKHRoaXMucCkubW9kUG93KHRoaXMuZG1wMSx0aGlzLnApO3ZhciB4cT14Lm1vZCh0aGlzLnEpLm1vZFBvdyh0aGlzLmRtcTEsdGhpcy5xKTt3aGlsZSh4cC5jb21wYXJlVG8oeHEpPDApe3hwPXhwLmFkZCh0aGlzLnApfXJldHVybiB4cC5zdWJ0cmFjdCh4cSkubXVsdGlwbHkodGhpcy5jb2VmZikubW9kKHRoaXMucCkubXVsdGlwbHkodGhpcy5xKS5hZGQoeHEpfTtSU0FLZXkucHJvdG90eXBlLiRkb1B1YmxpYz1mdW5jdGlvbih4KXtyZXR1cm4geC5tb2RQb3dJbnQodGhpcy5lLHRoaXMubil9O1JTQUtleS5wcm90b3R5cGUuZW5jcnlwdD1mdW5jdGlvbihidWZmZXIsdXNlUHJpdmF0ZSl7dmFyIGJ1ZmZlcnM9W107dmFyIHJlc3VsdHM9W107dmFyIGJ1ZmZlclNpemU9YnVmZmVyLmxlbmd0aDt2YXIgYnVmZmVyc0NvdW50PU1hdGguY2VpbChidWZmZXJTaXplL3RoaXMubWF4TWVzc2FnZUxlbmd0aCl8fDE7dmFyIGRpdmlkZWRTaXplPU1hdGguY2VpbChidWZmZXJTaXplL2J1ZmZlcnNDb3VudHx8MSk7aWYoYnVmZmVyc0NvdW50PT0xKXtidWZmZXJzLnB1c2goYnVmZmVyKX1lbHNle2Zvcih2YXIgYnVmTnVtPTA7YnVmTnVtPGJ1ZmZlcnNDb3VudDtidWZOdW0rKyl7YnVmZmVycy5wdXNoKGJ1ZmZlci5zbGljZShidWZOdW0qZGl2aWRlZFNpemUsKGJ1Zk51bSsxKSpkaXZpZGVkU2l6ZSkpfX1mb3IodmFyIGk9MDtpPGJ1ZmZlcnMubGVuZ3RoO2krKyl7cmVzdWx0cy5wdXNoKHRoaXMuZW5jcnlwdEVuZ2luZS5lbmNyeXB0KGJ1ZmZlcnNbaV0sdXNlUHJpdmF0ZSkpfXJldHVybiBCdWZmZXIuY29uY2F0KHJlc3VsdHMpfTtSU0FLZXkucHJvdG90eXBlLmRlY3J5cHQ9ZnVuY3Rpb24oYnVmZmVyLHVzZVB1YmxpYyl7aWYoYnVmZmVyLmxlbmd0aCV0aGlzLmVuY3J5cHRlZERhdGFMZW5ndGg+MCl7dGhyb3cgRXJyb3IoIkluY29ycmVjdCBkYXRhIG9yIGtleSIpfXZhciByZXN1bHQ9W107dmFyIG9mZnNldD0wO3ZhciBsZW5ndGg9MDt2YXIgYnVmZmVyc0NvdW50PWJ1ZmZlci5sZW5ndGgvdGhpcy5lbmNyeXB0ZWREYXRhTGVuZ3RoO2Zvcih2YXIgaT0wO2k8YnVmZmVyc0NvdW50O2krKyl7b2Zmc2V0PWkqdGhpcy5lbmNyeXB0ZWREYXRhTGVuZ3RoO2xlbmd0aD1vZmZzZXQrdGhpcy5lbmNyeXB0ZWREYXRhTGVuZ3RoO3Jlc3VsdC5wdXNoKHRoaXMuZW5jcnlwdEVuZ2luZS5kZWNyeXB0KGJ1ZmZlci5zbGljZShvZmZzZXQsTWF0aC5taW4obGVuZ3RoLGJ1ZmZlci5sZW5ndGgpKSx1c2VQdWJsaWMpKX1yZXR1cm4gQnVmZmVyLmNvbmNhdChyZXN1bHQpfTtSU0FLZXkucHJvdG90eXBlLnNpZ249ZnVuY3Rpb24oYnVmZmVyKXtyZXR1cm4gdGhpcy5zaWduaW5nU2NoZW1lLnNpZ24uYXBwbHkodGhpcy5zaWduaW5nU2NoZW1lLGFyZ3VtZW50cyl9O1JTQUtleS5wcm90b3R5cGUudmVyaWZ5PWZ1bmN0aW9uKGJ1ZmZlcixzaWduYXR1cmUsc2lnbmF0dXJlX2VuY29kaW5nKXtyZXR1cm4gdGhpcy5zaWduaW5nU2NoZW1lLnZlcmlmeS5hcHBseSh0aGlzLnNpZ25pbmdTY2hlbWUsYXJndW1lbnRzKX07UlNBS2V5LnByb3RvdHlwZS5pc1ByaXZhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uJiZ0aGlzLmUmJnRoaXMuZHx8ZmFsc2V9O1JTQUtleS5wcm90b3R5cGUuaXNQdWJsaWM9ZnVuY3Rpb24oc3RyaWN0KXtyZXR1cm4gdGhpcy5uJiZ0aGlzLmUmJiEoc3RyaWN0JiZ0aGlzLmQpfHxmYWxzZX07T2JqZWN0LmRlZmluZVByb3BlcnR5KFJTQUtleS5wcm90b3R5cGUsImtleVNpemUiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jYWNoZS5rZXlCaXRMZW5ndGh9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KFJTQUtleS5wcm90b3R5cGUsImVuY3J5cHRlZERhdGFMZW5ndGgiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jYWNoZS5rZXlCeXRlTGVuZ3RofX0pO09iamVjdC5kZWZpbmVQcm9wZXJ0eShSU0FLZXkucHJvdG90eXBlLCJtYXhNZXNzYWdlTGVuZ3RoIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZW5jcnlwdGlvblNjaGVtZS5tYXhNZXNzYWdlTGVuZ3RoKCl9fSk7UlNBS2V5LnByb3RvdHlwZS4kJHJlY2FsY3VsYXRlQ2FjaGU9ZnVuY3Rpb24oKXt0aGlzLmNhY2hlPXRoaXMuY2FjaGV8fHt9O3RoaXMuY2FjaGUua2V5Qml0TGVuZ3RoPXRoaXMubi5iaXRMZW5ndGgoKTt0aGlzLmNhY2hlLmtleUJ5dGVMZW5ndGg9dGhpcy5jYWNoZS5rZXlCaXRMZW5ndGgrNj4+M307cmV0dXJuIFJTQUtleX0oKX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4uL2VuY3J5cHRFbmdpbmVzL2VuY3J5cHRFbmdpbmVzLmpzIjo0MiwiLi4vc2NoZW1lcy9zY2hlbWVzLmpzIjo1NSwiLi4vdXRpbHMiOjU2LCIuLi91dGlscy5qcyI6NTYsIi4vanNibi5qcyI6NTAsYnVmZmVyOjI3fV0sNTI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBjcnlwdD1yZXF1aXJlKCIuLi9jcnlwdG8iKTttb2R1bGUuZXhwb3J0cz17aXNFbmNyeXB0aW9uOnRydWUsaXNTaWduYXR1cmU6ZmFsc2V9O21vZHVsZS5leHBvcnRzLmRpZ2VzdExlbmd0aD17bWQ0OjE2LG1kNToxNixyaXBlbWQxNjA6MjAscm1kMTYwOjIwLHNoYTE6MjAsc2hhMjI0OjI4LHNoYTI1NjozMixzaGEzODQ6NDgsc2hhNTEyOjY0fTt2YXIgREVGQVVMVF9IQVNIX0ZVTkNUSU9OPSJzaGExIjttb2R1bGUuZXhwb3J0cy5lbWVfb2FlcF9tZ2YxPWZ1bmN0aW9uKHNlZWQsbWFza0xlbmd0aCxoYXNoRnVuY3Rpb24pe2hhc2hGdW5jdGlvbj1oYXNoRnVuY3Rpb258fERFRkFVTFRfSEFTSF9GVU5DVElPTjt2YXIgaExlbj1tb2R1bGUuZXhwb3J0cy5kaWdlc3RMZW5ndGhbaGFzaEZ1bmN0aW9uXTt2YXIgY291bnQ9TWF0aC5jZWlsKG1hc2tMZW5ndGgvaExlbik7dmFyIFQ9QnVmZmVyLmFsbG9jKGhMZW4qY291bnQpO3ZhciBjPUJ1ZmZlci5hbGxvYyg0KTtmb3IodmFyIGk9MDtpPGNvdW50OysraSl7dmFyIGhhc2g9Y3J5cHQuY3JlYXRlSGFzaChoYXNoRnVuY3Rpb24pO2hhc2gudXBkYXRlKHNlZWQpO2Mud3JpdGVVSW50MzJCRShpLDApO2hhc2gudXBkYXRlKGMpO2hhc2guZGlnZXN0KCkuY29weShULGkqaExlbil9cmV0dXJuIFQuc2xpY2UoMCxtYXNrTGVuZ3RoKX07bW9kdWxlLmV4cG9ydHMubWFrZVNjaGVtZT1mdW5jdGlvbihrZXksb3B0aW9ucyl7ZnVuY3Rpb24gU2NoZW1lKGtleSxvcHRpb25zKXt0aGlzLmtleT1rZXk7dGhpcy5vcHRpb25zPW9wdGlvbnN9U2NoZW1lLnByb3RvdHlwZS5tYXhNZXNzYWdlTGVuZ3RoPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgtMiptb2R1bGUuZXhwb3J0cy5kaWdlc3RMZW5ndGhbdGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTl0tMn07U2NoZW1lLnByb3RvdHlwZS5lbmNQYWQ9ZnVuY3Rpb24oYnVmZmVyKXt2YXIgaGFzaD10aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OO3ZhciBtZ2Y9dGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLm1nZnx8bW9kdWxlLmV4cG9ydHMuZW1lX29hZXBfbWdmMTt2YXIgbGFiZWw9dGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLmxhYmVsfHxCdWZmZXIuYWxsb2MoMCk7dmFyIGVtTGVuPXRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGg7dmFyIGhMZW49bW9kdWxlLmV4cG9ydHMuZGlnZXN0TGVuZ3RoW2hhc2hdO2lmKGJ1ZmZlci5sZW5ndGg+ZW1MZW4tMipoTGVuLTIpe3Rocm93IG5ldyBFcnJvcigiTWVzc2FnZSBpcyB0b28gbG9uZyB0byBlbmNvZGUgaW50byBhbiBlbmNvZGVkIG1lc3NhZ2Ugd2l0aCBhIGxlbmd0aCBvZiAiK2VtTGVuKyIgYnl0ZXMsIGluY3JlYXNlIisiZW1MZW4gdG8gZml4IHRoaXMgZXJyb3IgKG1pbmltdW0gdmFsdWUgZm9yIGdpdmVuIHBhcmFtZXRlcnMgYW5kIG9wdGlvbnM6ICIrKGVtTGVuLTIqaExlbi0yKSsiKSIpfXZhciBsSGFzaD1jcnlwdC5jcmVhdGVIYXNoKGhhc2gpO2xIYXNoLnVwZGF0ZShsYWJlbCk7bEhhc2g9bEhhc2guZGlnZXN0KCk7dmFyIFBTPUJ1ZmZlci5hbGxvYyhlbUxlbi1idWZmZXIubGVuZ3RoLTIqaExlbi0xKTtQUy5maWxsKDApO1BTW1BTLmxlbmd0aC0xXT0xO3ZhciBEQj1CdWZmZXIuY29uY2F0KFtsSGFzaCxQUyxidWZmZXJdKTt2YXIgc2VlZD1jcnlwdC5yYW5kb21CeXRlcyhoTGVuKTt2YXIgbWFzaz1tZ2Yoc2VlZCxEQi5sZW5ndGgsaGFzaCk7Zm9yKHZhciBpPTA7aTxEQi5sZW5ndGg7aSsrKXtEQltpXV49bWFza1tpXX1tYXNrPW1nZihEQixoTGVuLGhhc2gpO2ZvcihpPTA7aTxzZWVkLmxlbmd0aDtpKyspe3NlZWRbaV1ePW1hc2tbaV19dmFyIGVtPUJ1ZmZlci5hbGxvYygxK3NlZWQubGVuZ3RoK0RCLmxlbmd0aCk7ZW1bMF09MDtzZWVkLmNvcHkoZW0sMSk7REIuY29weShlbSwxK3NlZWQubGVuZ3RoKTtyZXR1cm4gZW19O1NjaGVtZS5wcm90b3R5cGUuZW5jVW5QYWQ9ZnVuY3Rpb24oYnVmZmVyKXt2YXIgaGFzaD10aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OO3ZhciBtZ2Y9dGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLm1nZnx8bW9kdWxlLmV4cG9ydHMuZW1lX29hZXBfbWdmMTt2YXIgbGFiZWw9dGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLmxhYmVsfHxCdWZmZXIuYWxsb2MoMCk7dmFyIGhMZW49bW9kdWxlLmV4cG9ydHMuZGlnZXN0TGVuZ3RoW2hhc2hdO2lmKGJ1ZmZlci5sZW5ndGg8MipoTGVuKzIpe3Rocm93IG5ldyBFcnJvcigiRXJyb3IgZGVjb2RpbmcgbWVzc2FnZSwgdGhlIHN1cHBsaWVkIG1lc3NhZ2UgaXMgbm90IGxvbmcgZW5vdWdoIHRvIGJlIGEgdmFsaWQgT0FFUCBlbmNvZGVkIG1lc3NhZ2UiKX12YXIgc2VlZD1idWZmZXIuc2xpY2UoMSxoTGVuKzEpO3ZhciBEQj1idWZmZXIuc2xpY2UoMStoTGVuKTt2YXIgbWFzaz1tZ2YoREIsaExlbixoYXNoKTtmb3IodmFyIGk9MDtpPHNlZWQubGVuZ3RoO2krKyl7c2VlZFtpXV49bWFza1tpXX1tYXNrPW1nZihzZWVkLERCLmxlbmd0aCxoYXNoKTtmb3IoaT0wO2k8REIubGVuZ3RoO2krKyl7REJbaV1ePW1hc2tbaV19dmFyIGxIYXNoPWNyeXB0LmNyZWF0ZUhhc2goaGFzaCk7bEhhc2gudXBkYXRlKGxhYmVsKTtsSGFzaD1sSGFzaC5kaWdlc3QoKTt2YXIgbEhhc2hFTT1EQi5zbGljZSgwLGhMZW4pO2lmKGxIYXNoRU0udG9TdHJpbmcoImhleCIpIT1sSGFzaC50b1N0cmluZygiaGV4Iikpe3Rocm93IG5ldyBFcnJvcigiRXJyb3IgZGVjb2RpbmcgbWVzc2FnZSwgdGhlIGxIYXNoIGNhbGN1bGF0ZWQgZnJvbSB0aGUgbGFiZWwgcHJvdmlkZWQgYW5kIHRoZSBsSGFzaCBpbiB0aGUgZW5jcnlwdGVkIGRhdGEgZG8gbm90IG1hdGNoLiIpfWk9aExlbjt3aGlsZShEQltpKytdPT09MCYmaTxEQi5sZW5ndGgpO2lmKERCW2ktMV0hPTEpe3Rocm93IG5ldyBFcnJvcigiRXJyb3IgZGVjb2RpbmcgbWVzc2FnZSwgdGhlcmUgaXMgbm8gcGFkZGluZyBtZXNzYWdlIHNlcGFyYXRvciBieXRlIil9cmV0dXJuIERCLnNsaWNlKGkpfTtyZXR1cm4gbmV3IFNjaGVtZShrZXksb3B0aW9ucyl9fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vY3J5cHRvIjo0MSxidWZmZXI6Mjd9XSw1MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIEJpZ0ludGVnZXI9cmVxdWlyZSgiLi4vbGlicy9qc2JuIik7dmFyIGNyeXB0PXJlcXVpcmUoIi4uL2NyeXB0byIpO3ZhciBjb25zdGFudHM9cmVxdWlyZSgiY29uc3RhbnRzIik7dmFyIFNJR05fSU5GT19IRUFEPXttZDI6QnVmZmVyLmZyb20oIjMwMjAzMDBjMDYwODJhODY0ODg2ZjcwZDAyMDIwNTAwMDQxMCIsImhleCIpLG1kNTpCdWZmZXIuZnJvbSgiMzAyMDMwMGMwNjA4MmE4NjQ4ODZmNzBkMDIwNTA1MDAwNDEwIiwiaGV4Iiksc2hhMTpCdWZmZXIuZnJvbSgiMzAyMTMwMDkwNjA1MmIwZTAzMDIxYTA1MDAwNDE0IiwiaGV4Iiksc2hhMjI0OkJ1ZmZlci5mcm9tKCIzMDJkMzAwZDA2MDk2MDg2NDgwMTY1MDMwNDAyMDQwNTAwMDQxYyIsImhleCIpLHNoYTI1NjpCdWZmZXIuZnJvbSgiMzAzMTMwMGQwNjA5NjA4NjQ4MDE2NTAzMDQwMjAxMDUwMDA0MjAiLCJoZXgiKSxzaGEzODQ6QnVmZmVyLmZyb20oIjMwNDEzMDBkMDYwOTYwODY0ODAxNjUwMzA0MDIwMjA1MDAwNDMwIiwiaGV4Iiksc2hhNTEyOkJ1ZmZlci5mcm9tKCIzMDUxMzAwZDA2MDk2MDg2NDgwMTY1MDMwNDAyMDMwNTAwMDQ0MCIsImhleCIpLHJpcGVtZDE2MDpCdWZmZXIuZnJvbSgiMzAyMTMwMDkwNjA1MmIyNDAzMDIwMTA1MDAwNDE0IiwiaGV4Iikscm1kMTYwOkJ1ZmZlci5mcm9tKCIzMDIxMzAwOTA2MDUyYjI0MDMwMjAxMDUwMDA0MTQiLCJoZXgiKX07dmFyIFNJR05fQUxHX1RPX0hBU0hfQUxJQVNFUz17cmlwZW1kMTYwOiJybWQxNjAifTt2YXIgREVGQVVMVF9IQVNIX0ZVTkNUSU9OPSJzaGEyNTYiO21vZHVsZS5leHBvcnRzPXtpc0VuY3J5cHRpb246dHJ1ZSxpc1NpZ25hdHVyZTp0cnVlfTttb2R1bGUuZXhwb3J0cy5tYWtlU2NoZW1lPWZ1bmN0aW9uKGtleSxvcHRpb25zKXtmdW5jdGlvbiBTY2hlbWUoa2V5LG9wdGlvbnMpe3RoaXMua2V5PWtleTt0aGlzLm9wdGlvbnM9b3B0aW9uc31TY2hlbWUucHJvdG90eXBlLm1heE1lc3NhZ2VMZW5ndGg9ZnVuY3Rpb24oKXtpZih0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJnRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nPT1jb25zdGFudHMuUlNBX05PX1BBRERJTkcpe3JldHVybiB0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RofXJldHVybiB0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoLTExfTtTY2hlbWUucHJvdG90eXBlLmVuY1BhZD1mdW5jdGlvbihidWZmZXIsb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgZmlsbGVkO2lmKGJ1ZmZlci5sZW5ndGg+dGhpcy5rZXkubWF4TWVzc2FnZUxlbmd0aCl7dGhyb3cgbmV3IEVycm9yKCJNZXNzYWdlIHRvbyBsb25nIGZvciBSU0EgKG49Iit0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoKyIsIGw9IitidWZmZXIubGVuZ3RoKyIpIil9aWYodGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZ0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZz09Y29uc3RhbnRzLlJTQV9OT19QQURESU5HKXtmaWxsZWQ9QnVmZmVyLmFsbG9jKHRoaXMua2V5Lm1heE1lc3NhZ2VMZW5ndGgtYnVmZmVyLmxlbmd0aCk7ZmlsbGVkLmZpbGwoMCk7cmV0dXJuIEJ1ZmZlci5jb25jYXQoW2ZpbGxlZCxidWZmZXJdKX1pZihvcHRpb25zLnR5cGU9PT0xKXtmaWxsZWQ9QnVmZmVyLmFsbG9jKHRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgtYnVmZmVyLmxlbmd0aC0xKTtmaWxsZWQuZmlsbCgyNTUsMCxmaWxsZWQubGVuZ3RoLTEpO2ZpbGxlZFswXT0xO2ZpbGxlZFtmaWxsZWQubGVuZ3RoLTFdPTA7cmV0dXJuIEJ1ZmZlci5jb25jYXQoW2ZpbGxlZCxidWZmZXJdKX1lbHNle2ZpbGxlZD1CdWZmZXIuYWxsb2ModGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aC1idWZmZXIubGVuZ3RoKTtmaWxsZWRbMF09MDtmaWxsZWRbMV09Mjt2YXIgcmFuZD1jcnlwdC5yYW5kb21CeXRlcyhmaWxsZWQubGVuZ3RoLTMpO2Zvcih2YXIgaT0wO2k8cmFuZC5sZW5ndGg7aSsrKXt2YXIgcj1yYW5kW2ldO3doaWxlKHI9PT0wKXtyPWNyeXB0LnJhbmRvbUJ5dGVzKDEpWzBdfWZpbGxlZFtpKzJdPXJ9ZmlsbGVkW2ZpbGxlZC5sZW5ndGgtMV09MDtyZXR1cm4gQnVmZmVyLmNvbmNhdChbZmlsbGVkLGJ1ZmZlcl0pfX07U2NoZW1lLnByb3RvdHlwZS5lbmNVblBhZD1mdW5jdGlvbihidWZmZXIsb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgaT0wO2lmKHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmdGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmc9PWNvbnN0YW50cy5SU0FfTk9fUEFERElORyl7dmFyIHVuUGFkO2lmKHR5cGVvZiBidWZmZXIubGFzdEluZGV4T2Y9PSJmdW5jdGlvbiIpe3VuUGFkPWJ1ZmZlci5zbGljZShidWZmZXIubGFzdEluZGV4T2YoIlwwIikrMSxidWZmZXIubGVuZ3RoKX1lbHNle3VuUGFkPWJ1ZmZlci5zbGljZShTdHJpbmcucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCJcMCIpKzEsYnVmZmVyLmxlbmd0aCl9cmV0dXJuIHVuUGFkfWlmKGJ1ZmZlci5sZW5ndGg8NCl7cmV0dXJuIG51bGx9aWYob3B0aW9ucy50eXBlPT09MSl7aWYoYnVmZmVyWzBdIT09MCYmYnVmZmVyWzFdIT09MSl7cmV0dXJuIG51bGx9aT0zO3doaWxlKGJ1ZmZlcltpXSE9PTApe2lmKGJ1ZmZlcltpXSE9MjU1fHwrK2k+PWJ1ZmZlci5sZW5ndGgpe3JldHVybiBudWxsfX19ZWxzZXtpZihidWZmZXJbMF0hPT0wJiZidWZmZXJbMV0hPT0yKXtyZXR1cm4gbnVsbH1pPTM7d2hpbGUoYnVmZmVyW2ldIT09MCl7aWYoKytpPj1idWZmZXIubGVuZ3RoKXtyZXR1cm4gbnVsbH19fXJldHVybiBidWZmZXIuc2xpY2UoaSsxLGJ1ZmZlci5sZW5ndGgpfTtTY2hlbWUucHJvdG90eXBlLnNpZ249ZnVuY3Rpb24oYnVmZmVyKXt2YXIgaGFzaEFsZ29yaXRobT10aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OO2lmKHRoaXMub3B0aW9ucy5lbnZpcm9ubWVudD09PSJicm93c2VyIil7aGFzaEFsZ29yaXRobT1TSUdOX0FMR19UT19IQVNIX0FMSUFTRVNbaGFzaEFsZ29yaXRobV18fGhhc2hBbGdvcml0aG07dmFyIGhhc2hlcj1jcnlwdC5jcmVhdGVIYXNoKGhhc2hBbGdvcml0aG0pO2hhc2hlci51cGRhdGUoYnVmZmVyKTt2YXIgaGFzaD10aGlzLnBrY3MxcGFkKGhhc2hlci5kaWdlc3QoKSxoYXNoQWxnb3JpdGhtKTt2YXIgcmVzPXRoaXMua2V5LiRkb1ByaXZhdGUobmV3IEJpZ0ludGVnZXIoaGFzaCkpLnRvQnVmZmVyKHRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgpO3JldHVybiByZXN9ZWxzZXt2YXIgc2lnbmVyPWNyeXB0LmNyZWF0ZVNpZ24oIlJTQS0iK2hhc2hBbGdvcml0aG0udG9VcHBlckNhc2UoKSk7c2lnbmVyLnVwZGF0ZShidWZmZXIpO3JldHVybiBzaWduZXIuc2lnbih0aGlzLm9wdGlvbnMucnNhVXRpbHMuZXhwb3J0S2V5KCJwcml2YXRlIikpfX07U2NoZW1lLnByb3RvdHlwZS52ZXJpZnk9ZnVuY3Rpb24oYnVmZmVyLHNpZ25hdHVyZSxzaWduYXR1cmVfZW5jb2Rpbmcpe2NvbnNvbGUubG9nKCJ2ZXJpZnkiKTtpZih0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJnRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nPT1jb25zdGFudHMuUlNBX05PX1BBRERJTkcpe3JldHVybiBmYWxzZX12YXIgaGFzaEFsZ29yaXRobT10aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OO2lmKHRoaXMub3B0aW9ucy5lbnZpcm9ubWVudD09PSJicm93c2VyIil7aGFzaEFsZ29yaXRobT1TSUdOX0FMR19UT19IQVNIX0FMSUFTRVNbaGFzaEFsZ29yaXRobV18fGhhc2hBbGdvcml0aG07aWYoc2lnbmF0dXJlX2VuY29kaW5nKXtzaWduYXR1cmU9QnVmZmVyLmZyb20oc2lnbmF0dXJlLHNpZ25hdHVyZV9lbmNvZGluZyl9dmFyIGhhc2hlcj1jcnlwdC5jcmVhdGVIYXNoKGhhc2hBbGdvcml0aG0pO2hhc2hlci51cGRhdGUoYnVmZmVyKTt2YXIgaGFzaD10aGlzLnBrY3MxcGFkKGhhc2hlci5kaWdlc3QoKSxoYXNoQWxnb3JpdGhtKTt2YXIgbT10aGlzLmtleS4kZG9QdWJsaWMobmV3IEJpZ0ludGVnZXIoc2lnbmF0dXJlKSk7cmV0dXJuIG0udG9CdWZmZXIoKS50b1N0cmluZygiaGV4Iik9PWhhc2gudG9TdHJpbmcoImhleCIpfWVsc2V7dmFyIHZlcmlmaWVyPWNyeXB0LmNyZWF0ZVZlcmlmeSgiUlNBLSIraGFzaEFsZ29yaXRobS50b1VwcGVyQ2FzZSgpKTt2ZXJpZmllci51cGRhdGUoYnVmZmVyKTtyZXR1cm4gdmVyaWZpZXIudmVyaWZ5KHRoaXMub3B0aW9ucy5yc2FVdGlscy5leHBvcnRLZXkoInB1YmxpYyIpLHNpZ25hdHVyZSxzaWduYXR1cmVfZW5jb2RpbmcpfX07U2NoZW1lLnByb3RvdHlwZS5wa2NzMHBhZD1mdW5jdGlvbihidWZmZXIpe3ZhciBmaWxsZWQ9QnVmZmVyLmFsbG9jKHRoaXMua2V5Lm1heE1lc3NhZ2VMZW5ndGgtYnVmZmVyLmxlbmd0aCk7ZmlsbGVkLmZpbGwoMCk7cmV0dXJuIEJ1ZmZlci5jb25jYXQoW2ZpbGxlZCxidWZmZXJdKX07U2NoZW1lLnByb3RvdHlwZS5wa2NzMHVucGFkPWZ1bmN0aW9uKGJ1ZmZlcil7dmFyIHVuUGFkO2lmKHR5cGVvZiBidWZmZXIubGFzdEluZGV4T2Y9PSJmdW5jdGlvbiIpe3VuUGFkPWJ1ZmZlci5zbGljZShidWZmZXIubGFzdEluZGV4T2YoIlwwIikrMSxidWZmZXIubGVuZ3RoKX1lbHNle3VuUGFkPWJ1ZmZlci5zbGljZShTdHJpbmcucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCJcMCIpKzEsYnVmZmVyLmxlbmd0aCl9cmV0dXJuIHVuUGFkfTtTY2hlbWUucHJvdG90eXBlLnBrY3MxcGFkPWZ1bmN0aW9uKGhhc2hCdWYsaGFzaEFsZ29yaXRobSl7dmFyIGRpZ2VzdD1TSUdOX0lORk9fSEVBRFtoYXNoQWxnb3JpdGhtXTtpZighZGlnZXN0KXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQgaGFzaCBhbGdvcml0aG0iKX12YXIgZGF0YT1CdWZmZXIuY29uY2F0KFtkaWdlc3QsaGFzaEJ1Zl0pO2lmKGRhdGEubGVuZ3RoKzEwPnRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgpe3Rocm93IEVycm9yKCJLZXkgaXMgdG9vIHNob3J0IGZvciBzaWduaW5nIGFsZ29yaXRobSAoIitoYXNoQWxnb3JpdGhtKyIpIil9dmFyIGZpbGxlZD1CdWZmZXIuYWxsb2ModGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aC1kYXRhLmxlbmd0aC0xKTtmaWxsZWQuZmlsbCgyNTUsMCxmaWxsZWQubGVuZ3RoLTEpO2ZpbGxlZFswXT0xO2ZpbGxlZFtmaWxsZWQubGVuZ3RoLTFdPTA7dmFyIHJlcz1CdWZmZXIuY29uY2F0KFtmaWxsZWQsZGF0YV0pO3JldHVybiByZXN9O3JldHVybiBuZXcgU2NoZW1lKGtleSxvcHRpb25zKX19KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi9jcnlwdG8iOjQxLCIuLi9saWJzL2pzYm4iOjUwLGJ1ZmZlcjoyNyxjb25zdGFudHM6Mjl9XSw1NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIEJpZ0ludGVnZXI9cmVxdWlyZSgiLi4vbGlicy9qc2JuIik7dmFyIGNyeXB0PXJlcXVpcmUoIi4uL2NyeXB0byIpO21vZHVsZS5leHBvcnRzPXtpc0VuY3J5cHRpb246ZmFsc2UsaXNTaWduYXR1cmU6dHJ1ZX07dmFyIERFRkFVTFRfSEFTSF9GVU5DVElPTj0ic2hhMSI7dmFyIERFRkFVTFRfU0FMVF9MRU5HVEg9MjA7bW9kdWxlLmV4cG9ydHMubWFrZVNjaGVtZT1mdW5jdGlvbihrZXksb3B0aW9ucyl7dmFyIE9BRVA9cmVxdWlyZSgiLi9zY2hlbWVzIikucGtjczFfb2FlcDtmdW5jdGlvbiBTY2hlbWUoa2V5LG9wdGlvbnMpe3RoaXMua2V5PWtleTt0aGlzLm9wdGlvbnM9b3B0aW9uc31TY2hlbWUucHJvdG90eXBlLnNpZ249ZnVuY3Rpb24oYnVmZmVyKXt2YXIgbUhhc2g9Y3J5cHQuY3JlYXRlSGFzaCh0aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OKTttSGFzaC51cGRhdGUoYnVmZmVyKTt2YXIgZW5jb2RlZD10aGlzLmVtc2FfcHNzX2VuY29kZShtSGFzaC5kaWdlc3QoKSx0aGlzLmtleS5rZXlTaXplLTEpO3JldHVybiB0aGlzLmtleS4kZG9Qcml2YXRlKG5ldyBCaWdJbnRlZ2VyKGVuY29kZWQpKS50b0J1ZmZlcih0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoKX07U2NoZW1lLnByb3RvdHlwZS52ZXJpZnk9ZnVuY3Rpb24oYnVmZmVyLHNpZ25hdHVyZSxzaWduYXR1cmVfZW5jb2Rpbmcpe2lmKHNpZ25hdHVyZV9lbmNvZGluZyl7c2lnbmF0dXJlPUJ1ZmZlci5mcm9tKHNpZ25hdHVyZSxzaWduYXR1cmVfZW5jb2RpbmcpfXNpZ25hdHVyZT1uZXcgQmlnSW50ZWdlcihzaWduYXR1cmUpO3ZhciBlbUxlbj1NYXRoLmNlaWwoKHRoaXMua2V5LmtleVNpemUtMSkvOCk7dmFyIG09dGhpcy5rZXkuJGRvUHVibGljKHNpZ25hdHVyZSkudG9CdWZmZXIoZW1MZW4pO3ZhciBtSGFzaD1jcnlwdC5jcmVhdGVIYXNoKHRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT04pO21IYXNoLnVwZGF0ZShidWZmZXIpO3JldHVybiB0aGlzLmVtc2FfcHNzX3ZlcmlmeShtSGFzaC5kaWdlc3QoKSxtLHRoaXMua2V5LmtleVNpemUtMSl9O1NjaGVtZS5wcm90b3R5cGUuZW1zYV9wc3NfZW5jb2RlPWZ1bmN0aW9uKG1IYXNoLGVtQml0cyl7dmFyIGhhc2g9dGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTjt2YXIgbWdmPXRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5tZ2Z8fE9BRVAuZW1lX29hZXBfbWdmMTt2YXIgc0xlbj10aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuc2FsdExlbmd0aHx8REVGQVVMVF9TQUxUX0xFTkdUSDt2YXIgaExlbj1PQUVQLmRpZ2VzdExlbmd0aFtoYXNoXTt2YXIgZW1MZW49TWF0aC5jZWlsKGVtQml0cy84KTtpZihlbUxlbjxoTGVuK3NMZW4rMil7dGhyb3cgbmV3IEVycm9yKCJPdXRwdXQgbGVuZ3RoIHBhc3NlZCB0byBlbUJpdHMoIitlbUJpdHMrIikgaXMgdG9vIHNtYWxsIGZvciB0aGUgb3B0aW9ucyAiKyJzcGVjaWZpZWQoIitoYXNoKyIsICIrc0xlbisiKS4gVG8gZml4IHRoaXMgaXNzdWUgaW5jcmVhc2UgdGhlIHZhbHVlIG9mIGVtQml0cy4gKG1pbmltdW0gc2l6ZTogIisoOCpoTGVuKzgqc0xlbis5KSsiKSIpfXZhciBzYWx0PWNyeXB0LnJhbmRvbUJ5dGVzKHNMZW4pO3ZhciBNYXBvc3Ryb3BoZT1CdWZmZXIuYWxsb2MoOCtoTGVuK3NMZW4pO01hcG9zdHJvcGhlLmZpbGwoMCwwLDgpO21IYXNoLmNvcHkoTWFwb3N0cm9waGUsOCk7c2FsdC5jb3B5KE1hcG9zdHJvcGhlLDgrbUhhc2gubGVuZ3RoKTt2YXIgSD1jcnlwdC5jcmVhdGVIYXNoKGhhc2gpO0gudXBkYXRlKE1hcG9zdHJvcGhlKTtIPUguZGlnZXN0KCk7dmFyIFBTPUJ1ZmZlci5hbGxvYyhlbUxlbi1zYWx0Lmxlbmd0aC1oTGVuLTIpO1BTLmZpbGwoMCk7dmFyIERCPUJ1ZmZlci5hbGxvYyhQUy5sZW5ndGgrMStzYWx0Lmxlbmd0aCk7UFMuY29weShEQik7REJbUFMubGVuZ3RoXT0xO3NhbHQuY29weShEQixQUy5sZW5ndGgrMSk7dmFyIGRiTWFzaz1tZ2YoSCxEQi5sZW5ndGgsaGFzaCk7dmFyIG1hc2tlZERCPUJ1ZmZlci5hbGxvYyhEQi5sZW5ndGgpO2Zvcih2YXIgaT0wO2k8ZGJNYXNrLmxlbmd0aDtpKyspe21hc2tlZERCW2ldPURCW2ldXmRiTWFza1tpXX12YXIgYml0cz04KmVtTGVuLWVtQml0czt2YXIgbWFzaz0yNTVeMjU1Pj44LWJpdHM8PDgtYml0czttYXNrZWREQlswXT1tYXNrZWREQlswXSZtYXNrO3ZhciBFTT1CdWZmZXIuYWxsb2MobWFza2VkREIubGVuZ3RoK0gubGVuZ3RoKzEpO21hc2tlZERCLmNvcHkoRU0sMCk7SC5jb3B5KEVNLG1hc2tlZERCLmxlbmd0aCk7RU1bRU0ubGVuZ3RoLTFdPTE4ODtyZXR1cm4gRU19O1NjaGVtZS5wcm90b3R5cGUuZW1zYV9wc3NfdmVyaWZ5PWZ1bmN0aW9uKG1IYXNoLEVNLGVtQml0cyl7dmFyIGhhc2g9dGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTjt2YXIgbWdmPXRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5tZ2Z8fE9BRVAuZW1lX29hZXBfbWdmMTt2YXIgc0xlbj10aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuc2FsdExlbmd0aHx8REVGQVVMVF9TQUxUX0xFTkdUSDt2YXIgaExlbj1PQUVQLmRpZ2VzdExlbmd0aFtoYXNoXTt2YXIgZW1MZW49TWF0aC5jZWlsKGVtQml0cy84KTtpZihlbUxlbjxoTGVuK3NMZW4rMnx8RU1bRU0ubGVuZ3RoLTFdIT0xODgpe3JldHVybiBmYWxzZX12YXIgREI9QnVmZmVyLmFsbG9jKGVtTGVuLWhMZW4tMSk7RU0uY29weShEQiwwLDAsZW1MZW4taExlbi0xKTt2YXIgbWFzaz0wO2Zvcih2YXIgaT0wLGJpdHM9OCplbUxlbi1lbUJpdHM7aTxiaXRzO2krKyl7bWFza3w9MTw8Ny1pfWlmKChEQlswXSZtYXNrKSE9PTApe3JldHVybiBmYWxzZX12YXIgSD1FTS5zbGljZShlbUxlbi1oTGVuLTEsZW1MZW4tMSk7dmFyIGRiTWFzaz1tZ2YoSCxEQi5sZW5ndGgsaGFzaCk7Zm9yKGk9MDtpPERCLmxlbmd0aDtpKyspe0RCW2ldXj1kYk1hc2tbaV19Yml0cz04KmVtTGVuLWVtQml0czttYXNrPTI1NV4yNTU+PjgtYml0czw8OC1iaXRzO0RCWzBdPURCWzBdJm1hc2s7Zm9yKGk9MDtEQltpXT09PTAmJmk8REIubGVuZ3RoO2krKyk7aWYoREJbaV0hPTEpe3JldHVybiBmYWxzZX12YXIgc2FsdD1EQi5zbGljZShEQi5sZW5ndGgtc0xlbik7dmFyIE1hcG9zdHJvcGhlPUJ1ZmZlci5hbGxvYyg4K2hMZW4rc0xlbik7TWFwb3N0cm9waGUuZmlsbCgwLDAsOCk7bUhhc2guY29weShNYXBvc3Ryb3BoZSw4KTtzYWx0LmNvcHkoTWFwb3N0cm9waGUsOCttSGFzaC5sZW5ndGgpO3ZhciBIYXBvc3Ryb3BoZT1jcnlwdC5jcmVhdGVIYXNoKGhhc2gpO0hhcG9zdHJvcGhlLnVwZGF0ZShNYXBvc3Ryb3BoZSk7SGFwb3N0cm9waGU9SGFwb3N0cm9waGUuZGlnZXN0KCk7cmV0dXJuIEgudG9TdHJpbmcoImhleCIpPT09SGFwb3N0cm9waGUudG9TdHJpbmcoImhleCIpfTtyZXR1cm4gbmV3IFNjaGVtZShrZXksb3B0aW9ucyl9fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vY3J5cHRvIjo0MSwiLi4vbGlicy9qc2JuIjo1MCwiLi9zY2hlbWVzIjo1NSxidWZmZXI6Mjd9XSw1NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9e3BrY3MxOnJlcXVpcmUoIi4vcGtjczEiKSxwa2NzMV9vYWVwOnJlcXVpcmUoIi4vb2FlcCIpLHBzczpyZXF1aXJlKCIuL3BzcyIpLGlzRW5jcnlwdGlvbjpmdW5jdGlvbihzY2hlbWUpe3JldHVybiBtb2R1bGUuZXhwb3J0c1tzY2hlbWVdJiZtb2R1bGUuZXhwb3J0c1tzY2hlbWVdLmlzRW5jcnlwdGlvbn0saXNTaWduYXR1cmU6ZnVuY3Rpb24oc2NoZW1lKXtyZXR1cm4gbW9kdWxlLmV4cG9ydHNbc2NoZW1lXSYmbW9kdWxlLmV4cG9ydHNbc2NoZW1lXS5pc1NpZ25hdHVyZX19fSx7Ii4vb2FlcCI6NTIsIi4vcGtjczEiOjUzLCIuL3BzcyI6NTR9XSw1NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHMubGluZWJyaz1mdW5jdGlvbihzdHIsbWF4TGVuKXt2YXIgcmVzPSIiO3ZhciBpPTA7d2hpbGUoaSttYXhMZW48c3RyLmxlbmd0aCl7cmVzKz1zdHIuc3Vic3RyaW5nKGksaSttYXhMZW4pKyJcbiI7aSs9bWF4TGVufXJldHVybiByZXMrc3RyLnN1YnN0cmluZyhpLHN0ci5sZW5ndGgpfTttb2R1bGUuZXhwb3J0cy5kZXRlY3RFbnZpcm9ubWVudD1mdW5jdGlvbigpe3JldHVybiB0eXBlb2Ygd2luZG93IT09InVuZGVmaW5lZCJ8fHR5cGVvZiBzZWxmIT09InVuZGVmaW5lZCImJiEhc2VsZi5wb3N0TWVzc2FnZT8iYnJvd3NlciI6Im5vZGUifTttb2R1bGUuZXhwb3J0cy5nZXQzMkludEZyb21CdWZmZXI9ZnVuY3Rpb24oYnVmZmVyLG9mZnNldCl7b2Zmc2V0PW9mZnNldHx8MDt2YXIgc2l6ZT0wO2lmKChzaXplPWJ1ZmZlci5sZW5ndGgtb2Zmc2V0KT4wKXtpZihzaXplPj00KXtyZXR1cm4gYnVmZmVyLnJlYWRVSW50MzJCRShvZmZzZXQpfWVsc2V7dmFyIHJlcz0wO2Zvcih2YXIgaT1vZmZzZXQrc2l6ZSxkPTA7aT5vZmZzZXQ7aS0tLGQrPTIpe3Jlcys9YnVmZmVyW2ktMV0qTWF0aC5wb3coMTYsZCl9cmV0dXJuIHJlc319ZWxzZXtyZXR1cm4gTmFOfX07bW9kdWxlLmV4cG9ydHMuXz17aXNPYmplY3Q6ZnVuY3Rpb24odmFsdWUpe3ZhciB0eXBlPXR5cGVvZiB2YWx1ZTtyZXR1cm4hIXZhbHVlJiYodHlwZT09Im9iamVjdCJ8fHR5cGU9PSJmdW5jdGlvbiIpfSxpc1N0cmluZzpmdW5jdGlvbih2YWx1ZSl7cmV0dXJuIHR5cGVvZiB2YWx1ZT09InN0cmluZyJ8fHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nfSxpc051bWJlcjpmdW5jdGlvbih2YWx1ZSl7cmV0dXJuIHR5cGVvZiB2YWx1ZT09Im51bWJlciJ8fCFpc05hTihwYXJzZUZsb2F0KHZhbHVlKSkmJmlzRmluaXRlKHZhbHVlKX0sb21pdDpmdW5jdGlvbihvYmoscmVtb3ZlUHJvcCl7dmFyIG5ld09iaj17fTtmb3IodmFyIHByb3AgaW4gb2JqKXtpZighb2JqLmhhc093blByb3BlcnR5KHByb3ApfHxwcm9wPT09cmVtb3ZlUHJvcCl7Y29udGludWV9bmV3T2JqW3Byb3BdPW9ialtwcm9wXX1yZXR1cm4gbmV3T2JqfX07bW9kdWxlLmV4cG9ydHMudHJpbVN1cnJvdW5kaW5nVGV4dD1mdW5jdGlvbihkYXRhLG9wZW5pbmcsY2xvc2luZyl7dmFyIHRyaW1TdGFydEluZGV4PTA7dmFyIHRyaW1FbmRJbmRleD1kYXRhLmxlbmd0aDt2YXIgb3BlbmluZ0JvdW5kYXJ5SW5kZXg9ZGF0YS5pbmRleE9mKG9wZW5pbmcpO2lmKG9wZW5pbmdCb3VuZGFyeUluZGV4Pj0wKXt0cmltU3RhcnRJbmRleD1vcGVuaW5nQm91bmRhcnlJbmRleCtvcGVuaW5nLmxlbmd0aH12YXIgY2xvc2luZ0JvdW5kYXJ5SW5kZXg9ZGF0YS5pbmRleE9mKGNsb3Npbmcsb3BlbmluZ0JvdW5kYXJ5SW5kZXgpO2lmKGNsb3NpbmdCb3VuZGFyeUluZGV4Pj0wKXt0cmltRW5kSW5kZXg9Y2xvc2luZ0JvdW5kYXJ5SW5kZXh9cmV0dXJuIGRhdGEuc3Vic3RyaW5nKHRyaW1TdGFydEluZGV4LHRyaW1FbmRJbmRleCl9fSx7fV0sNTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7dmFyIGhhc093blByb3BlcnR5PU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7dmFyIHByb3BJc0VudW1lcmFibGU9T2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtmdW5jdGlvbiB0b09iamVjdCh2YWwpe2lmKHZhbD09PW51bGx8fHZhbD09PXVuZGVmaW5lZCl7dGhyb3cgbmV3IFR5cGVFcnJvcigiT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQiKX1yZXR1cm4gT2JqZWN0KHZhbCl9ZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCl7dHJ5e2lmKCFPYmplY3QuYXNzaWduKXtyZXR1cm4gZmFsc2V9dmFyIHRlc3QxPW5ldyBTdHJpbmcoImFiYyIpO3Rlc3QxWzVdPSJkZSI7aWYoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdPT09IjUiKXtyZXR1cm4gZmFsc2V9dmFyIHRlc3QyPXt9O2Zvcih2YXIgaT0wO2k8MTA7aSsrKXt0ZXN0MlsiXyIrU3RyaW5nLmZyb21DaGFyQ29kZShpKV09aX12YXIgb3JkZXIyPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24obil7cmV0dXJuIHRlc3QyW25dfSk7aWYob3JkZXIyLmpvaW4oIiIpIT09IjAxMjM0NTY3ODkiKXtyZXR1cm4gZmFsc2V9dmFyIHRlc3QzPXt9OyJhYmNkZWZnaGlqa2xtbm9wcXJzdCIuc3BsaXQoIiIpLmZvckVhY2goZnVuY3Rpb24obGV0dGVyKXt0ZXN0M1tsZXR0ZXJdPWxldHRlcn0pO2lmKE9iamVjdC5rZXlzKE9iamVjdC5hc3NpZ24oe30sdGVzdDMpKS5qb2luKCIiKSE9PSJhYmNkZWZnaGlqa2xtbm9wcXJzdCIpe3JldHVybiBmYWxzZX1yZXR1cm4gdHJ1ZX1jYXRjaChlcnIpe3JldHVybiBmYWxzZX19bW9kdWxlLmV4cG9ydHM9c2hvdWxkVXNlTmF0aXZlKCk/T2JqZWN0LmFzc2lnbjpmdW5jdGlvbih0YXJnZXQsc291cmNlKXt2YXIgZnJvbTt2YXIgdG89dG9PYmplY3QodGFyZ2V0KTt2YXIgc3ltYm9scztmb3IodmFyIHM9MTtzPGFyZ3VtZW50cy5sZW5ndGg7cysrKXtmcm9tPU9iamVjdChhcmd1bWVudHNbc10pO2Zvcih2YXIga2V5IGluIGZyb20pe2lmKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSxrZXkpKXt0b1trZXldPWZyb21ba2V5XX19aWYoZ2V0T3duUHJvcGVydHlTeW1ib2xzKXtzeW1ib2xzPWdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtmb3IodmFyIGk9MDtpPHN5bWJvbHMubGVuZ3RoO2krKyl7aWYocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sc3ltYm9sc1tpXSkpe3RvW3N5bWJvbHNbaV1dPWZyb21bc3ltYm9sc1tpXV19fX19cmV0dXJuIHRvfX0se31dLDU4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtleHBvcnRzLnBia2RmMj1yZXF1aXJlKCIuL2xpYi9hc3luYyIpO2V4cG9ydHMucGJrZGYyU3luYz1yZXF1aXJlKCIuL2xpYi9zeW5jIil9LHsiLi9saWIvYXN5bmMiOjU5LCIuL2xpYi9zeW5jIjo2Mn1dLDU5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24ocHJvY2VzcyxnbG9iYWwpe3ZhciBjaGVja1BhcmFtZXRlcnM9cmVxdWlyZSgiLi9wcmVjb25kaXRpb24iKTt2YXIgZGVmYXVsdEVuY29kaW5nPXJlcXVpcmUoIi4vZGVmYXVsdC1lbmNvZGluZyIpO3ZhciBzeW5jPXJlcXVpcmUoIi4vc3luYyIpO3ZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7dmFyIFpFUk9fQlVGO3ZhciBzdWJ0bGU9Z2xvYmFsLmNyeXB0byYmZ2xvYmFsLmNyeXB0by5zdWJ0bGU7dmFyIHRvQnJvd3Nlcj17c2hhOiJTSEEtMSIsInNoYS0xIjoiU0hBLTEiLHNoYTE6IlNIQS0xIixzaGEyNTY6IlNIQS0yNTYiLCJzaGEtMjU2IjoiU0hBLTI1NiIsc2hhMzg0OiJTSEEtMzg0Iiwic2hhLTM4NCI6IlNIQS0zODQiLCJzaGEtNTEyIjoiU0hBLTUxMiIsc2hhNTEyOiJTSEEtNTEyIn07dmFyIGNoZWNrcz1bXTtmdW5jdGlvbiBjaGVja05hdGl2ZShhbGdvKXtpZihnbG9iYWwucHJvY2VzcyYmIWdsb2JhbC5wcm9jZXNzLmJyb3dzZXIpe3JldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpfWlmKCFzdWJ0bGV8fCFzdWJ0bGUuaW1wb3J0S2V5fHwhc3VidGxlLmRlcml2ZUJpdHMpe3JldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpfWlmKGNoZWNrc1thbGdvXSE9PXVuZGVmaW5lZCl7cmV0dXJuIGNoZWNrc1thbGdvXX1aRVJPX0JVRj1aRVJPX0JVRnx8QnVmZmVyLmFsbG9jKDgpO3ZhciBwcm9tPWJyb3dzZXJQYmtkZjIoWkVST19CVUYsWkVST19CVUYsMTAsMTI4LGFsZ28pLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gdHJ1ZX0pLmNhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuIGZhbHNlfSk7Y2hlY2tzW2FsZ29dPXByb207cmV0dXJuIHByb219ZnVuY3Rpb24gYnJvd3NlclBia2RmMihwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsbGVuZ3RoLGFsZ28pe3JldHVybiBzdWJ0bGUuaW1wb3J0S2V5KCJyYXciLHBhc3N3b3JkLHtuYW1lOiJQQktERjIifSxmYWxzZSxbImRlcml2ZUJpdHMiXSkudGhlbihmdW5jdGlvbihrZXkpe3JldHVybiBzdWJ0bGUuZGVyaXZlQml0cyh7bmFtZToiUEJLREYyIixzYWx0OnNhbHQsaXRlcmF0aW9uczppdGVyYXRpb25zLGhhc2g6e25hbWU6YWxnb319LGtleSxsZW5ndGg8PDMpfSkudGhlbihmdW5jdGlvbihyZXMpe3JldHVybiBCdWZmZXIuZnJvbShyZXMpfSl9ZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UocHJvbWlzZSxjYWxsYmFjayl7cHJvbWlzZS50aGVuKGZ1bmN0aW9uKG91dCl7cHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbigpe2NhbGxiYWNrKG51bGwsb3V0KX0pfSxmdW5jdGlvbihlKXtwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7Y2FsbGJhY2soZSl9KX0pfW1vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxrZXlsZW4sZGlnZXN0LGNhbGxiYWNrKXtpZih0eXBlb2YgZGlnZXN0PT09ImZ1bmN0aW9uIil7Y2FsbGJhY2s9ZGlnZXN0O2RpZ2VzdD11bmRlZmluZWR9ZGlnZXN0PWRpZ2VzdHx8InNoYTEiO3ZhciBhbGdvPXRvQnJvd3NlcltkaWdlc3QudG9Mb3dlckNhc2UoKV07aWYoIWFsZ298fHR5cGVvZiBnbG9iYWwuUHJvbWlzZSE9PSJmdW5jdGlvbiIpe3JldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7dmFyIG91dDt0cnl7b3V0PXN5bmMocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGtleWxlbixkaWdlc3QpfWNhdGNoKGUpe3JldHVybiBjYWxsYmFjayhlKX1jYWxsYmFjayhudWxsLG91dCl9KX1jaGVja1BhcmFtZXRlcnMocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGtleWxlbik7aWYodHlwZW9mIGNhbGxiYWNrIT09ImZ1bmN0aW9uIil0aHJvdyBuZXcgRXJyb3IoIk5vIGNhbGxiYWNrIHByb3ZpZGVkIHRvIHBia2RmMiIpO2lmKCFCdWZmZXIuaXNCdWZmZXIocGFzc3dvcmQpKXBhc3N3b3JkPUJ1ZmZlci5mcm9tKHBhc3N3b3JkLGRlZmF1bHRFbmNvZGluZyk7aWYoIUJ1ZmZlci5pc0J1ZmZlcihzYWx0KSlzYWx0PUJ1ZmZlci5mcm9tKHNhbHQsZGVmYXVsdEVuY29kaW5nKTtyZXNvbHZlUHJvbWlzZShjaGVja05hdGl2ZShhbGdvKS50aGVuKGZ1bmN0aW9uKHJlc3Ape2lmKHJlc3ApcmV0dXJuIGJyb3dzZXJQYmtkZjIocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGtleWxlbixhbGdvKTtyZXR1cm4gc3luYyhwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsa2V5bGVuLGRpZ2VzdCl9KSxjYWxsYmFjayl9fSkuY2FsbCh0aGlzLHJlcXVpcmUoIl9wcm9jZXNzIiksdHlwZW9mIGdsb2JhbCE9PSJ1bmRlZmluZWQiP2dsb2JhbDp0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiP3dpbmRvdzp7fSl9LHsiLi9kZWZhdWx0LWVuY29kaW5nIjo2MCwiLi9wcmVjb25kaXRpb24iOjYxLCIuL3N5bmMiOjYyLF9wcm9jZXNzOjY0LCJzYWZlLWJ1ZmZlciI6Nzl9XSw2MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3Mpe3ZhciBkZWZhdWx0RW5jb2Rpbmc7aWYocHJvY2Vzcy5icm93c2VyKXtkZWZhdWx0RW5jb2Rpbmc9InV0Zi04In1lbHNle3ZhciBwVmVyc2lvbk1ham9yPXBhcnNlSW50KHByb2Nlc3MudmVyc2lvbi5zcGxpdCgiLiIpWzBdLnNsaWNlKDEpLDEwKTtkZWZhdWx0RW5jb2Rpbmc9cFZlcnNpb25NYWpvcj49Nj8idXRmLTgiOiJiaW5hcnkifW1vZHVsZS5leHBvcnRzPWRlZmF1bHRFbmNvZGluZ30pLmNhbGwodGhpcyxyZXF1aXJlKCJfcHJvY2VzcyIpKX0se19wcm9jZXNzOjY0fV0sNjE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBNQVhfQUxMT0M9TWF0aC5wb3coMiwzMCktMTtmdW5jdGlvbiBjaGVja0J1ZmZlcihidWYsbmFtZSl7aWYodHlwZW9mIGJ1ZiE9PSJzdHJpbmciJiYhQnVmZmVyLmlzQnVmZmVyKGJ1Zikpe3Rocm93IG5ldyBUeXBlRXJyb3IobmFtZSsiIG11c3QgYmUgYSBidWZmZXIgb3Igc3RyaW5nIil9fW1vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxrZXlsZW4pe2NoZWNrQnVmZmVyKHBhc3N3b3JkLCJQYXNzd29yZCIpO2NoZWNrQnVmZmVyKHNhbHQsIlNhbHQiKTtpZih0eXBlb2YgaXRlcmF0aW9ucyE9PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJJdGVyYXRpb25zIG5vdCBhIG51bWJlciIpfWlmKGl0ZXJhdGlvbnM8MCl7dGhyb3cgbmV3IFR5cGVFcnJvcigiQmFkIGl0ZXJhdGlvbnMiKX1pZih0eXBlb2Yga2V5bGVuIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoIktleSBsZW5ndGggbm90IGEgbnVtYmVyIil9aWYoa2V5bGVuPDB8fGtleWxlbj5NQVhfQUxMT0N8fGtleWxlbiE9PWtleWxlbil7dGhyb3cgbmV3IFR5cGVFcnJvcigiQmFkIGtleSBsZW5ndGgiKX19fSkuY2FsbCh0aGlzLHtpc0J1ZmZlcjpyZXF1aXJlKCIuLi8uLi9pcy1idWZmZXIvaW5kZXguanMiKX0pfSx7Ii4uLy4uL2lzLWJ1ZmZlci9pbmRleC5qcyI6Mzd9XSw2MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIG1kNT1yZXF1aXJlKCJjcmVhdGUtaGFzaC9tZDUiKTt2YXIgUklQRU1EMTYwPXJlcXVpcmUoInJpcGVtZDE2MCIpO3ZhciBzaGE9cmVxdWlyZSgic2hhLmpzIik7dmFyIGNoZWNrUGFyYW1ldGVycz1yZXF1aXJlKCIuL3ByZWNvbmRpdGlvbiIpO3ZhciBkZWZhdWx0RW5jb2Rpbmc9cmVxdWlyZSgiLi9kZWZhdWx0LWVuY29kaW5nIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgWkVST1M9QnVmZmVyLmFsbG9jKDEyOCk7dmFyIHNpemVzPXttZDU6MTYsc2hhMToyMCxzaGEyMjQ6Mjgsc2hhMjU2OjMyLHNoYTM4NDo0OCxzaGE1MTI6NjQscm1kMTYwOjIwLHJpcGVtZDE2MDoyMH07ZnVuY3Rpb24gSG1hYyhhbGcsa2V5LHNhbHRMZW4pe3ZhciBoYXNoPWdldERpZ2VzdChhbGcpO3ZhciBibG9ja3NpemU9YWxnPT09InNoYTUxMiJ8fGFsZz09PSJzaGEzODQiPzEyODo2NDtpZihrZXkubGVuZ3RoPmJsb2Nrc2l6ZSl7a2V5PWhhc2goa2V5KX1lbHNlIGlmKGtleS5sZW5ndGg8YmxvY2tzaXplKXtrZXk9QnVmZmVyLmNvbmNhdChba2V5LFpFUk9TXSxibG9ja3NpemUpfXZhciBpcGFkPUJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja3NpemUrc2l6ZXNbYWxnXSk7dmFyIG9wYWQ9QnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZStzaXplc1thbGddKTtmb3IodmFyIGk9MDtpPGJsb2Nrc2l6ZTtpKyspe2lwYWRbaV09a2V5W2ldXjU0O29wYWRbaV09a2V5W2ldXjkyfXZhciBpcGFkMT1CdWZmZXIuYWxsb2NVbnNhZmUoYmxvY2tzaXplK3NhbHRMZW4rNCk7aXBhZC5jb3B5KGlwYWQxLDAsMCxibG9ja3NpemUpO3RoaXMuaXBhZDE9aXBhZDE7dGhpcy5pcGFkMj1pcGFkO3RoaXMub3BhZD1vcGFkO3RoaXMuYWxnPWFsZzt0aGlzLmJsb2Nrc2l6ZT1ibG9ja3NpemU7dGhpcy5oYXNoPWhhc2g7dGhpcy5zaXplPXNpemVzW2FsZ119SG1hYy5wcm90b3R5cGUucnVuPWZ1bmN0aW9uKGRhdGEsaXBhZCl7ZGF0YS5jb3B5KGlwYWQsdGhpcy5ibG9ja3NpemUpO3ZhciBoPXRoaXMuaGFzaChpcGFkKTtoLmNvcHkodGhpcy5vcGFkLHRoaXMuYmxvY2tzaXplKTtyZXR1cm4gdGhpcy5oYXNoKHRoaXMub3BhZCl9O2Z1bmN0aW9uIGdldERpZ2VzdChhbGcpe2Z1bmN0aW9uIHNoYUZ1bmMoZGF0YSl7cmV0dXJuIHNoYShhbGcpLnVwZGF0ZShkYXRhKS5kaWdlc3QoKX1mdW5jdGlvbiBybWQxNjBGdW5jKGRhdGEpe3JldHVybihuZXcgUklQRU1EMTYwKS51cGRhdGUoZGF0YSkuZGlnZXN0KCl9aWYoYWxnPT09InJtZDE2MCJ8fGFsZz09PSJyaXBlbWQxNjAiKXJldHVybiBybWQxNjBGdW5jO2lmKGFsZz09PSJtZDUiKXJldHVybiBtZDU7cmV0dXJuIHNoYUZ1bmN9ZnVuY3Rpb24gcGJrZGYyKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxrZXlsZW4sZGlnZXN0KXtjaGVja1BhcmFtZXRlcnMocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGtleWxlbik7aWYoIUJ1ZmZlci5pc0J1ZmZlcihwYXNzd29yZCkpcGFzc3dvcmQ9QnVmZmVyLmZyb20ocGFzc3dvcmQsZGVmYXVsdEVuY29kaW5nKTtpZighQnVmZmVyLmlzQnVmZmVyKHNhbHQpKXNhbHQ9QnVmZmVyLmZyb20oc2FsdCxkZWZhdWx0RW5jb2RpbmcpO2RpZ2VzdD1kaWdlc3R8fCJzaGExIjt2YXIgaG1hYz1uZXcgSG1hYyhkaWdlc3QscGFzc3dvcmQsc2FsdC5sZW5ndGgpO3ZhciBESz1CdWZmZXIuYWxsb2NVbnNhZmUoa2V5bGVuKTt2YXIgYmxvY2sxPUJ1ZmZlci5hbGxvY1Vuc2FmZShzYWx0Lmxlbmd0aCs0KTtzYWx0LmNvcHkoYmxvY2sxLDAsMCxzYWx0Lmxlbmd0aCk7dmFyIGRlc3RQb3M9MDt2YXIgaExlbj1zaXplc1tkaWdlc3RdO3ZhciBsPU1hdGguY2VpbChrZXlsZW4vaExlbik7Zm9yKHZhciBpPTE7aTw9bDtpKyspe2Jsb2NrMS53cml0ZVVJbnQzMkJFKGksc2FsdC5sZW5ndGgpO3ZhciBUPWhtYWMucnVuKGJsb2NrMSxobWFjLmlwYWQxKTt2YXIgVT1UO2Zvcih2YXIgaj0xO2o8aXRlcmF0aW9ucztqKyspe1U9aG1hYy5ydW4oVSxobWFjLmlwYWQyKTtmb3IodmFyIGs9MDtrPGhMZW47aysrKVRba11ePVVba119VC5jb3B5KERLLGRlc3RQb3MpO2Rlc3RQb3MrPWhMZW59cmV0dXJuIERLfW1vZHVsZS5leHBvcnRzPXBia2RmMn0seyIuL2RlZmF1bHQtZW5jb2RpbmciOjYwLCIuL3ByZWNvbmRpdGlvbiI6NjEsImNyZWF0ZS1oYXNoL21kNSI6MzIscmlwZW1kMTYwOjc4LCJzYWZlLWJ1ZmZlciI6NzksInNoYS5qcyI6OTF9XSw2MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MpeyJ1c2Ugc3RyaWN0IjtpZih0eXBlb2YgcHJvY2Vzcz09PSJ1bmRlZmluZWQifHwhcHJvY2Vzcy52ZXJzaW9ufHxwcm9jZXNzLnZlcnNpb24uaW5kZXhPZigidjAuIik9PT0wfHxwcm9jZXNzLnZlcnNpb24uaW5kZXhPZigidjEuIik9PT0wJiZwcm9jZXNzLnZlcnNpb24uaW5kZXhPZigidjEuOC4iKSE9PTApe21vZHVsZS5leHBvcnRzPXtuZXh0VGljazpuZXh0VGlja319ZWxzZXttb2R1bGUuZXhwb3J0cz1wcm9jZXNzfWZ1bmN0aW9uIG5leHRUaWNrKGZuLGFyZzEsYXJnMixhcmczKXtpZih0eXBlb2YgZm4hPT0iZnVuY3Rpb24iKXt0aHJvdyBuZXcgVHlwZUVycm9yKCciY2FsbGJhY2siIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpfXZhciBsZW49YXJndW1lbnRzLmxlbmd0aDt2YXIgYXJncyxpO3N3aXRjaChsZW4pe2Nhc2UgMDpjYXNlIDE6cmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZm4pO2Nhc2UgMjpyZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiBhZnRlclRpY2tPbmUoKXtmbi5jYWxsKG51bGwsYXJnMSl9KTtjYXNlIDM6cmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gYWZ0ZXJUaWNrVHdvKCl7Zm4uY2FsbChudWxsLGFyZzEsYXJnMil9KTtjYXNlIDQ6cmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gYWZ0ZXJUaWNrVGhyZWUoKXtmbi5jYWxsKG51bGwsYXJnMSxhcmcyLGFyZzMpfSk7ZGVmYXVsdDphcmdzPW5ldyBBcnJheShsZW4tMSk7aT0wO3doaWxlKGk8YXJncy5sZW5ndGgpe2FyZ3NbaSsrXT1hcmd1bWVudHNbaV19cmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gYWZ0ZXJUaWNrKCl7Zm4uYXBwbHkobnVsbCxhcmdzKX0pfX19KS5jYWxsKHRoaXMscmVxdWlyZSgiX3Byb2Nlc3MiKSl9LHtfcHJvY2Vzczo2NH1dLDY0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgcHJvY2Vzcz1tb2R1bGUuZXhwb3J0cz17fTt2YXIgY2FjaGVkU2V0VGltZW91dDt2YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O2Z1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKXt0aHJvdyBuZXcgRXJyb3IoInNldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQiKX1mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0KCl7dGhyb3cgbmV3IEVycm9yKCJjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQiKX0oZnVuY3Rpb24oKXt0cnl7aWYodHlwZW9mIHNldFRpbWVvdXQ9PT0iZnVuY3Rpb24iKXtjYWNoZWRTZXRUaW1lb3V0PXNldFRpbWVvdXR9ZWxzZXtjYWNoZWRTZXRUaW1lb3V0PWRlZmF1bHRTZXRUaW1vdXR9fWNhdGNoKGUpe2NhY2hlZFNldFRpbWVvdXQ9ZGVmYXVsdFNldFRpbW91dH10cnl7aWYodHlwZW9mIGNsZWFyVGltZW91dD09PSJmdW5jdGlvbiIpe2NhY2hlZENsZWFyVGltZW91dD1jbGVhclRpbWVvdXR9ZWxzZXtjYWNoZWRDbGVhclRpbWVvdXQ9ZGVmYXVsdENsZWFyVGltZW91dH19Y2F0Y2goZSl7Y2FjaGVkQ2xlYXJUaW1lb3V0PWRlZmF1bHRDbGVhclRpbWVvdXR9fSkoKTtmdW5jdGlvbiBydW5UaW1lb3V0KGZ1bil7aWYoY2FjaGVkU2V0VGltZW91dD09PXNldFRpbWVvdXQpe3JldHVybiBzZXRUaW1lb3V0KGZ1biwwKX1pZigoY2FjaGVkU2V0VGltZW91dD09PWRlZmF1bHRTZXRUaW1vdXR8fCFjYWNoZWRTZXRUaW1lb3V0KSYmc2V0VGltZW91dCl7Y2FjaGVkU2V0VGltZW91dD1zZXRUaW1lb3V0O3JldHVybiBzZXRUaW1lb3V0KGZ1biwwKX10cnl7cmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLDApfWNhdGNoKGUpe3RyeXtyZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsZnVuLDApfWNhdGNoKGUpe3JldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcyxmdW4sMCl9fX1mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKXtpZihjYWNoZWRDbGVhclRpbWVvdXQ9PT1jbGVhclRpbWVvdXQpe3JldHVybiBjbGVhclRpbWVvdXQobWFya2VyKX1pZigoY2FjaGVkQ2xlYXJUaW1lb3V0PT09ZGVmYXVsdENsZWFyVGltZW91dHx8IWNhY2hlZENsZWFyVGltZW91dCkmJmNsZWFyVGltZW91dCl7Y2FjaGVkQ2xlYXJUaW1lb3V0PWNsZWFyVGltZW91dDtyZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcil9dHJ5e3JldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKX1jYXRjaChlKXt0cnl7cmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsbWFya2VyKX1jYXRjaChlKXtyZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcyxtYXJrZXIpfX19dmFyIHF1ZXVlPVtdO3ZhciBkcmFpbmluZz1mYWxzZTt2YXIgY3VycmVudFF1ZXVlO3ZhciBxdWV1ZUluZGV4PS0xO2Z1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpe2lmKCFkcmFpbmluZ3x8IWN1cnJlbnRRdWV1ZSl7cmV0dXJufWRyYWluaW5nPWZhbHNlO2lmKGN1cnJlbnRRdWV1ZS5sZW5ndGgpe3F1ZXVlPWN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpfWVsc2V7cXVldWVJbmRleD0tMX1pZihxdWV1ZS5sZW5ndGgpe2RyYWluUXVldWUoKX19ZnVuY3Rpb24gZHJhaW5RdWV1ZSgpe2lmKGRyYWluaW5nKXtyZXR1cm59dmFyIHRpbWVvdXQ9cnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO2RyYWluaW5nPXRydWU7dmFyIGxlbj1xdWV1ZS5sZW5ndGg7d2hpbGUobGVuKXtjdXJyZW50UXVldWU9cXVldWU7cXVldWU9W107d2hpbGUoKytxdWV1ZUluZGV4PGxlbil7aWYoY3VycmVudFF1ZXVlKXtjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCl9fXF1ZXVlSW5kZXg9LTE7bGVuPXF1ZXVlLmxlbmd0aH1jdXJyZW50UXVldWU9bnVsbDtkcmFpbmluZz1mYWxzZTtydW5DbGVhclRpbWVvdXQodGltZW91dCl9cHJvY2Vzcy5uZXh0VGljaz1mdW5jdGlvbihmdW4pe3ZhciBhcmdzPW5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoLTEpO2lmKGFyZ3VtZW50cy5sZW5ndGg+MSl7Zm9yKHZhciBpPTE7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl7YXJnc1tpLTFdPWFyZ3VtZW50c1tpXX19cXVldWUucHVzaChuZXcgSXRlbShmdW4sYXJncykpO2lmKHF1ZXVlLmxlbmd0aD09PTEmJiFkcmFpbmluZyl7cnVuVGltZW91dChkcmFpblF1ZXVlKX19O2Z1bmN0aW9uIEl0ZW0oZnVuLGFycmF5KXt0aGlzLmZ1bj1mdW47dGhpcy5hcnJheT1hcnJheX1JdGVtLnByb3RvdHlwZS5ydW49ZnVuY3Rpb24oKXt0aGlzLmZ1bi5hcHBseShudWxsLHRoaXMuYXJyYXkpfTtwcm9jZXNzLnRpdGxlPSJicm93c2VyIjtwcm9jZXNzLmJyb3dzZXI9dHJ1ZTtwcm9jZXNzLmVudj17fTtwcm9jZXNzLmFyZ3Y9W107cHJvY2Vzcy52ZXJzaW9uPSIiO3Byb2Nlc3MudmVyc2lvbnM9e307ZnVuY3Rpb24gbm9vcCgpe31wcm9jZXNzLm9uPW5vb3A7cHJvY2Vzcy5hZGRMaXN0ZW5lcj1ub29wO3Byb2Nlc3Mub25jZT1ub29wO3Byb2Nlc3Mub2ZmPW5vb3A7cHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcj1ub29wO3Byb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzPW5vb3A7cHJvY2Vzcy5lbWl0PW5vb3A7cHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXI9bm9vcDtwcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXI9bm9vcDtwcm9jZXNzLmxpc3RlbmVycz1mdW5jdGlvbihuYW1lKXtyZXR1cm5bXX07cHJvY2Vzcy5iaW5kaW5nPWZ1bmN0aW9uKG5hbWUpe3Rocm93IG5ldyBFcnJvcigicHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQiKX07cHJvY2Vzcy5jd2Q9ZnVuY3Rpb24oKXtyZXR1cm4iLyJ9O3Byb2Nlc3MuY2hkaXI9ZnVuY3Rpb24oZGlyKXt0aHJvdyBuZXcgRXJyb3IoInByb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCIpfTtwcm9jZXNzLnVtYXNrPWZ1bmN0aW9uKCl7cmV0dXJuIDB9fSx7fV0sNjU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXJlcXVpcmUoIi4vbGliL19zdHJlYW1fZHVwbGV4LmpzIil9LHsiLi9saWIvX3N0cmVhbV9kdXBsZXguanMiOjY2fV0sNjY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgcG5hPXJlcXVpcmUoInByb2Nlc3MtbmV4dGljay1hcmdzIik7dmFyIG9iamVjdEtleXM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uKG9iail7dmFyIGtleXM9W107Zm9yKHZhciBrZXkgaW4gb2JqKXtrZXlzLnB1c2goa2V5KX1yZXR1cm4ga2V5c307bW9kdWxlLmV4cG9ydHM9RHVwbGV4O3ZhciB1dGlsPXJlcXVpcmUoImNvcmUtdXRpbC1pcyIpO3V0aWwuaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgUmVhZGFibGU9cmVxdWlyZSgiLi9fc3RyZWFtX3JlYWRhYmxlIik7dmFyIFdyaXRhYmxlPXJlcXVpcmUoIi4vX3N0cmVhbV93cml0YWJsZSIpO3V0aWwuaW5oZXJpdHMoRHVwbGV4LFJlYWRhYmxlKTt7dmFyIGtleXM9b2JqZWN0S2V5cyhXcml0YWJsZS5wcm90b3R5cGUpO2Zvcih2YXIgdj0wO3Y8a2V5cy5sZW5ndGg7disrKXt2YXIgbWV0aG9kPWtleXNbdl07aWYoIUR1cGxleC5wcm90b3R5cGVbbWV0aG9kXSlEdXBsZXgucHJvdG90eXBlW21ldGhvZF09V3JpdGFibGUucHJvdG90eXBlW21ldGhvZF19fWZ1bmN0aW9uIER1cGxleChvcHRpb25zKXtpZighKHRoaXMgaW5zdGFuY2VvZiBEdXBsZXgpKXJldHVybiBuZXcgRHVwbGV4KG9wdGlvbnMpO1JlYWRhYmxlLmNhbGwodGhpcyxvcHRpb25zKTtXcml0YWJsZS5jYWxsKHRoaXMsb3B0aW9ucyk7aWYob3B0aW9ucyYmb3B0aW9ucy5yZWFkYWJsZT09PWZhbHNlKXRoaXMucmVhZGFibGU9ZmFsc2U7aWYob3B0aW9ucyYmb3B0aW9ucy53cml0YWJsZT09PWZhbHNlKXRoaXMud3JpdGFibGU9ZmFsc2U7dGhpcy5hbGxvd0hhbGZPcGVuPXRydWU7aWYob3B0aW9ucyYmb3B0aW9ucy5hbGxvd0hhbGZPcGVuPT09ZmFsc2UpdGhpcy5hbGxvd0hhbGZPcGVuPWZhbHNlO3RoaXMub25jZSgiZW5kIixvbmVuZCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KER1cGxleC5wcm90b3R5cGUsIndyaXRhYmxlSGlnaFdhdGVyTWFyayIse2VudW1lcmFibGU6ZmFsc2UsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUuaGlnaFdhdGVyTWFya319KTtmdW5jdGlvbiBvbmVuZCgpe2lmKHRoaXMuYWxsb3dIYWxmT3Blbnx8dGhpcy5fd3JpdGFibGVTdGF0ZS5lbmRlZClyZXR1cm47cG5hLm5leHRUaWNrKG9uRW5kTlQsdGhpcyl9ZnVuY3Rpb24gb25FbmROVChzZWxmKXtzZWxmLmVuZCgpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShEdXBsZXgucHJvdG90eXBlLCJkZXN0cm95ZWQiLHtnZXQ6ZnVuY3Rpb24oKXtpZih0aGlzLl9yZWFkYWJsZVN0YXRlPT09dW5kZWZpbmVkfHx0aGlzLl93cml0YWJsZVN0YXRlPT09dW5kZWZpbmVkKXtyZXR1cm4gZmFsc2V9cmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkJiZ0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZH0sc2V0OmZ1bmN0aW9uKHZhbHVlKXtpZih0aGlzLl9yZWFkYWJsZVN0YXRlPT09dW5kZWZpbmVkfHx0aGlzLl93cml0YWJsZVN0YXRlPT09dW5kZWZpbmVkKXtyZXR1cm59dGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQ9dmFsdWU7dGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQ9dmFsdWV9fSk7RHVwbGV4LnByb3RvdHlwZS5fZGVzdHJveT1mdW5jdGlvbihlcnIsY2Ipe3RoaXMucHVzaChudWxsKTt0aGlzLmVuZCgpO3BuYS5uZXh0VGljayhjYixlcnIpfX0seyIuL19zdHJlYW1fcmVhZGFibGUiOjY4LCIuL19zdHJlYW1fd3JpdGFibGUiOjcwLCJjb3JlLXV0aWwtaXMiOjMwLGluaGVyaXRzOjM2LCJwcm9jZXNzLW5leHRpY2stYXJncyI6NjN9XSw2NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO21vZHVsZS5leHBvcnRzPVBhc3NUaHJvdWdoO3ZhciBUcmFuc2Zvcm09cmVxdWlyZSgiLi9fc3RyZWFtX3RyYW5zZm9ybSIpO3ZhciB1dGlsPXJlcXVpcmUoImNvcmUtdXRpbC1pcyIpO3V0aWwuaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt1dGlsLmluaGVyaXRzKFBhc3NUaHJvdWdoLFRyYW5zZm9ybSk7ZnVuY3Rpb24gUGFzc1Rocm91Z2gob3B0aW9ucyl7aWYoISh0aGlzIGluc3RhbmNlb2YgUGFzc1Rocm91Z2gpKXJldHVybiBuZXcgUGFzc1Rocm91Z2gob3B0aW9ucyk7VHJhbnNmb3JtLmNhbGwodGhpcyxvcHRpb25zKX1QYXNzVGhyb3VnaC5wcm90b3R5cGUuX3RyYW5zZm9ybT1mdW5jdGlvbihjaHVuayxlbmNvZGluZyxjYil7Y2IobnVsbCxjaHVuayl9fSx7Ii4vX3N0cmVhbV90cmFuc2Zvcm0iOjY5LCJjb3JlLXV0aWwtaXMiOjMwLGluaGVyaXRzOjM2fV0sNjg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihwcm9jZXNzLGdsb2JhbCl7InVzZSBzdHJpY3QiO3ZhciBwbmE9cmVxdWlyZSgicHJvY2Vzcy1uZXh0aWNrLWFyZ3MiKTttb2R1bGUuZXhwb3J0cz1SZWFkYWJsZTt2YXIgaXNBcnJheT1yZXF1aXJlKCJpc2FycmF5Iik7dmFyIER1cGxleDtSZWFkYWJsZS5SZWFkYWJsZVN0YXRlPVJlYWRhYmxlU3RhdGU7dmFyIEVFPXJlcXVpcmUoImV2ZW50cyIpLkV2ZW50RW1pdHRlcjt2YXIgRUVsaXN0ZW5lckNvdW50PWZ1bmN0aW9uKGVtaXR0ZXIsdHlwZSl7cmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJzKHR5cGUpLmxlbmd0aH07dmFyIFN0cmVhbT1yZXF1aXJlKCIuL2ludGVybmFsL3N0cmVhbXMvc3RyZWFtIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgT3VyVWludDhBcnJheT1nbG9iYWwuVWludDhBcnJheXx8ZnVuY3Rpb24oKXt9O2Z1bmN0aW9uIF91aW50OEFycmF5VG9CdWZmZXIoY2h1bmspe3JldHVybiBCdWZmZXIuZnJvbShjaHVuayl9ZnVuY3Rpb24gX2lzVWludDhBcnJheShvYmope3JldHVybiBCdWZmZXIuaXNCdWZmZXIob2JqKXx8b2JqIGluc3RhbmNlb2YgT3VyVWludDhBcnJheX12YXIgdXRpbD1yZXF1aXJlKCJjb3JlLXV0aWwtaXMiKTt1dGlsLmluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIGRlYnVnVXRpbD1yZXF1aXJlKCJ1dGlsIik7dmFyIGRlYnVnPXZvaWQgMDtpZihkZWJ1Z1V0aWwmJmRlYnVnVXRpbC5kZWJ1Z2xvZyl7ZGVidWc9ZGVidWdVdGlsLmRlYnVnbG9nKCJzdHJlYW0iKX1lbHNle2RlYnVnPWZ1bmN0aW9uKCl7fX12YXIgQnVmZmVyTGlzdD1yZXF1aXJlKCIuL2ludGVybmFsL3N0cmVhbXMvQnVmZmVyTGlzdCIpO3ZhciBkZXN0cm95SW1wbD1yZXF1aXJlKCIuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveSIpO3ZhciBTdHJpbmdEZWNvZGVyO3V0aWwuaW5oZXJpdHMoUmVhZGFibGUsU3RyZWFtKTt2YXIga1Byb3h5RXZlbnRzPVsiZXJyb3IiLCJjbG9zZSIsImRlc3Ryb3kiLCJwYXVzZSIsInJlc3VtZSJdO2Z1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcihlbWl0dGVyLGV2ZW50LGZuKXtpZih0eXBlb2YgZW1pdHRlci5wcmVwZW5kTGlzdGVuZXI9PT0iZnVuY3Rpb24iKXJldHVybiBlbWl0dGVyLnByZXBlbmRMaXN0ZW5lcihldmVudCxmbik7aWYoIWVtaXR0ZXIuX2V2ZW50c3x8IWVtaXR0ZXIuX2V2ZW50c1tldmVudF0pZW1pdHRlci5vbihldmVudCxmbik7ZWxzZSBpZihpc0FycmF5KGVtaXR0ZXIuX2V2ZW50c1tldmVudF0pKWVtaXR0ZXIuX2V2ZW50c1tldmVudF0udW5zaGlmdChmbik7ZWxzZSBlbWl0dGVyLl9ldmVudHNbZXZlbnRdPVtmbixlbWl0dGVyLl9ldmVudHNbZXZlbnRdXX1mdW5jdGlvbiBSZWFkYWJsZVN0YXRlKG9wdGlvbnMsc3RyZWFtKXtEdXBsZXg9RHVwbGV4fHxyZXF1aXJlKCIuL19zdHJlYW1fZHVwbGV4Iik7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgaXNEdXBsZXg9c3RyZWFtIGluc3RhbmNlb2YgRHVwbGV4O3RoaXMub2JqZWN0TW9kZT0hIW9wdGlvbnMub2JqZWN0TW9kZTtpZihpc0R1cGxleCl0aGlzLm9iamVjdE1vZGU9dGhpcy5vYmplY3RNb2RlfHwhIW9wdGlvbnMucmVhZGFibGVPYmplY3RNb2RlO3ZhciBod209b3B0aW9ucy5oaWdoV2F0ZXJNYXJrO3ZhciByZWFkYWJsZUh3bT1vcHRpb25zLnJlYWRhYmxlSGlnaFdhdGVyTWFyazt2YXIgZGVmYXVsdEh3bT10aGlzLm9iamVjdE1vZGU/MTY6MTYqMTAyNDtpZihod218fGh3bT09PTApdGhpcy5oaWdoV2F0ZXJNYXJrPWh3bTtlbHNlIGlmKGlzRHVwbGV4JiYocmVhZGFibGVId218fHJlYWRhYmxlSHdtPT09MCkpdGhpcy5oaWdoV2F0ZXJNYXJrPXJlYWRhYmxlSHdtO2Vsc2UgdGhpcy5oaWdoV2F0ZXJNYXJrPWRlZmF1bHRId207dGhpcy5oaWdoV2F0ZXJNYXJrPU1hdGguZmxvb3IodGhpcy5oaWdoV2F0ZXJNYXJrKTt0aGlzLmJ1ZmZlcj1uZXcgQnVmZmVyTGlzdDt0aGlzLmxlbmd0aD0wO3RoaXMucGlwZXM9bnVsbDt0aGlzLnBpcGVzQ291bnQ9MDt0aGlzLmZsb3dpbmc9bnVsbDt0aGlzLmVuZGVkPWZhbHNlO3RoaXMuZW5kRW1pdHRlZD1mYWxzZTt0aGlzLnJlYWRpbmc9ZmFsc2U7dGhpcy5zeW5jPXRydWU7dGhpcy5uZWVkUmVhZGFibGU9ZmFsc2U7dGhpcy5lbWl0dGVkUmVhZGFibGU9ZmFsc2U7dGhpcy5yZWFkYWJsZUxpc3RlbmluZz1mYWxzZTt0aGlzLnJlc3VtZVNjaGVkdWxlZD1mYWxzZTt0aGlzLmRlc3Ryb3llZD1mYWxzZTt0aGlzLmRlZmF1bHRFbmNvZGluZz1vcHRpb25zLmRlZmF1bHRFbmNvZGluZ3x8InV0ZjgiO3RoaXMuYXdhaXREcmFpbj0wO3RoaXMucmVhZGluZ01vcmU9ZmFsc2U7dGhpcy5kZWNvZGVyPW51bGw7dGhpcy5lbmNvZGluZz1udWxsO2lmKG9wdGlvbnMuZW5jb2Rpbmcpe2lmKCFTdHJpbmdEZWNvZGVyKVN0cmluZ0RlY29kZXI9cmVxdWlyZSgic3RyaW5nX2RlY29kZXIvIikuU3RyaW5nRGVjb2Rlcjt0aGlzLmRlY29kZXI9bmV3IFN0cmluZ0RlY29kZXIob3B0aW9ucy5lbmNvZGluZyk7dGhpcy5lbmNvZGluZz1vcHRpb25zLmVuY29kaW5nfX1mdW5jdGlvbiBSZWFkYWJsZShvcHRpb25zKXtEdXBsZXg9RHVwbGV4fHxyZXF1aXJlKCIuL19zdHJlYW1fZHVwbGV4Iik7aWYoISh0aGlzIGluc3RhbmNlb2YgUmVhZGFibGUpKXJldHVybiBuZXcgUmVhZGFibGUob3B0aW9ucyk7dGhpcy5fcmVhZGFibGVTdGF0ZT1uZXcgUmVhZGFibGVTdGF0ZShvcHRpb25zLHRoaXMpO3RoaXMucmVhZGFibGU9dHJ1ZTtpZihvcHRpb25zKXtpZih0eXBlb2Ygb3B0aW9ucy5yZWFkPT09ImZ1bmN0aW9uIil0aGlzLl9yZWFkPW9wdGlvbnMucmVhZDtpZih0eXBlb2Ygb3B0aW9ucy5kZXN0cm95PT09ImZ1bmN0aW9uIil0aGlzLl9kZXN0cm95PW9wdGlvbnMuZGVzdHJveX1TdHJlYW0uY2FsbCh0aGlzKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGUucHJvdG90eXBlLCJkZXN0cm95ZWQiLHtnZXQ6ZnVuY3Rpb24oKXtpZih0aGlzLl9yZWFkYWJsZVN0YXRlPT09dW5kZWZpbmVkKXtyZXR1cm4gZmFsc2V9cmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkfSxzZXQ6ZnVuY3Rpb24odmFsdWUpe2lmKCF0aGlzLl9yZWFkYWJsZVN0YXRlKXtyZXR1cm59dGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQ9dmFsdWV9fSk7UmVhZGFibGUucHJvdG90eXBlLmRlc3Ryb3k9ZGVzdHJveUltcGwuZGVzdHJveTtSZWFkYWJsZS5wcm90b3R5cGUuX3VuZGVzdHJveT1kZXN0cm95SW1wbC51bmRlc3Ryb3k7UmVhZGFibGUucHJvdG90eXBlLl9kZXN0cm95PWZ1bmN0aW9uKGVycixjYil7dGhpcy5wdXNoKG51bGwpO2NiKGVycil9O1JlYWRhYmxlLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nKXt2YXIgc3RhdGU9dGhpcy5fcmVhZGFibGVTdGF0ZTt2YXIgc2tpcENodW5rQ2hlY2s7aWYoIXN0YXRlLm9iamVjdE1vZGUpe2lmKHR5cGVvZiBjaHVuaz09PSJzdHJpbmciKXtlbmNvZGluZz1lbmNvZGluZ3x8c3RhdGUuZGVmYXVsdEVuY29kaW5nO2lmKGVuY29kaW5nIT09c3RhdGUuZW5jb2Rpbmcpe2NodW5rPUJ1ZmZlci5mcm9tKGNodW5rLGVuY29kaW5nKTtlbmNvZGluZz0iIn1za2lwQ2h1bmtDaGVjaz10cnVlfX1lbHNle3NraXBDaHVua0NoZWNrPXRydWV9cmV0dXJuIHJlYWRhYmxlQWRkQ2h1bmsodGhpcyxjaHVuayxlbmNvZGluZyxmYWxzZSxza2lwQ2h1bmtDaGVjayl9O1JlYWRhYmxlLnByb3RvdHlwZS51bnNoaWZ0PWZ1bmN0aW9uKGNodW5rKXtyZXR1cm4gcmVhZGFibGVBZGRDaHVuayh0aGlzLGNodW5rLG51bGwsdHJ1ZSxmYWxzZSl9O2Z1bmN0aW9uIHJlYWRhYmxlQWRkQ2h1bmsoc3RyZWFtLGNodW5rLGVuY29kaW5nLGFkZFRvRnJvbnQsc2tpcENodW5rQ2hlY2spe3ZhciBzdGF0ZT1zdHJlYW0uX3JlYWRhYmxlU3RhdGU7aWYoY2h1bms9PT1udWxsKXtzdGF0ZS5yZWFkaW5nPWZhbHNlO29uRW9mQ2h1bmsoc3RyZWFtLHN0YXRlKX1lbHNle3ZhciBlcjtpZighc2tpcENodW5rQ2hlY2spZXI9Y2h1bmtJbnZhbGlkKHN0YXRlLGNodW5rKTtpZihlcil7c3RyZWFtLmVtaXQoImVycm9yIixlcil9ZWxzZSBpZihzdGF0ZS5vYmplY3RNb2RlfHxjaHVuayYmY2h1bmsubGVuZ3RoPjApe2lmKHR5cGVvZiBjaHVuayE9PSJzdHJpbmciJiYhc3RhdGUub2JqZWN0TW9kZSYmT2JqZWN0LmdldFByb3RvdHlwZU9mKGNodW5rKSE9PUJ1ZmZlci5wcm90b3R5cGUpe2NodW5rPV91aW50OEFycmF5VG9CdWZmZXIoY2h1bmspfWlmKGFkZFRvRnJvbnQpe2lmKHN0YXRlLmVuZEVtaXR0ZWQpc3RyZWFtLmVtaXQoImVycm9yIixuZXcgRXJyb3IoInN0cmVhbS51bnNoaWZ0KCkgYWZ0ZXIgZW5kIGV2ZW50IikpO2Vsc2UgYWRkQ2h1bmsoc3RyZWFtLHN0YXRlLGNodW5rLHRydWUpfWVsc2UgaWYoc3RhdGUuZW5kZWQpe3N0cmVhbS5lbWl0KCJlcnJvciIsbmV3IEVycm9yKCJzdHJlYW0ucHVzaCgpIGFmdGVyIEVPRiIpKX1lbHNle3N0YXRlLnJlYWRpbmc9ZmFsc2U7aWYoc3RhdGUuZGVjb2RlciYmIWVuY29kaW5nKXtjaHVuaz1zdGF0ZS5kZWNvZGVyLndyaXRlKGNodW5rKTtpZihzdGF0ZS5vYmplY3RNb2RlfHxjaHVuay5sZW5ndGghPT0wKWFkZENodW5rKHN0cmVhbSxzdGF0ZSxjaHVuayxmYWxzZSk7ZWxzZSBtYXliZVJlYWRNb3JlKHN0cmVhbSxzdGF0ZSl9ZWxzZXthZGRDaHVuayhzdHJlYW0sc3RhdGUsY2h1bmssZmFsc2UpfX19ZWxzZSBpZighYWRkVG9Gcm9udCl7c3RhdGUucmVhZGluZz1mYWxzZX19cmV0dXJuIG5lZWRNb3JlRGF0YShzdGF0ZSl9ZnVuY3Rpb24gYWRkQ2h1bmsoc3RyZWFtLHN0YXRlLGNodW5rLGFkZFRvRnJvbnQpe2lmKHN0YXRlLmZsb3dpbmcmJnN0YXRlLmxlbmd0aD09PTAmJiFzdGF0ZS5zeW5jKXtzdHJlYW0uZW1pdCgiZGF0YSIsY2h1bmspO3N0cmVhbS5yZWFkKDApfWVsc2V7c3RhdGUubGVuZ3RoKz1zdGF0ZS5vYmplY3RNb2RlPzE6Y2h1bmsubGVuZ3RoO2lmKGFkZFRvRnJvbnQpc3RhdGUuYnVmZmVyLnVuc2hpZnQoY2h1bmspO2Vsc2Ugc3RhdGUuYnVmZmVyLnB1c2goY2h1bmspO2lmKHN0YXRlLm5lZWRSZWFkYWJsZSllbWl0UmVhZGFibGUoc3RyZWFtKX1tYXliZVJlYWRNb3JlKHN0cmVhbSxzdGF0ZSl9ZnVuY3Rpb24gY2h1bmtJbnZhbGlkKHN0YXRlLGNodW5rKXt2YXIgZXI7aWYoIV9pc1VpbnQ4QXJyYXkoY2h1bmspJiZ0eXBlb2YgY2h1bmshPT0ic3RyaW5nIiYmY2h1bmshPT11bmRlZmluZWQmJiFzdGF0ZS5vYmplY3RNb2RlKXtlcj1uZXcgVHlwZUVycm9yKCJJbnZhbGlkIG5vbi1zdHJpbmcvYnVmZmVyIGNodW5rIil9cmV0dXJuIGVyfWZ1bmN0aW9uIG5lZWRNb3JlRGF0YShzdGF0ZSl7cmV0dXJuIXN0YXRlLmVuZGVkJiYoc3RhdGUubmVlZFJlYWRhYmxlfHxzdGF0ZS5sZW5ndGg8c3RhdGUuaGlnaFdhdGVyTWFya3x8c3RhdGUubGVuZ3RoPT09MCl9UmVhZGFibGUucHJvdG90eXBlLmlzUGF1c2VkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZz09PWZhbHNlfTtSZWFkYWJsZS5wcm90b3R5cGUuc2V0RW5jb2Rpbmc9ZnVuY3Rpb24oZW5jKXtpZighU3RyaW5nRGVjb2RlcilTdHJpbmdEZWNvZGVyPXJlcXVpcmUoInN0cmluZ19kZWNvZGVyLyIpLlN0cmluZ0RlY29kZXI7dGhpcy5fcmVhZGFibGVTdGF0ZS5kZWNvZGVyPW5ldyBTdHJpbmdEZWNvZGVyKGVuYyk7dGhpcy5fcmVhZGFibGVTdGF0ZS5lbmNvZGluZz1lbmM7cmV0dXJuIHRoaXN9O3ZhciBNQVhfSFdNPTgzODg2MDg7ZnVuY3Rpb24gY29tcHV0ZU5ld0hpZ2hXYXRlck1hcmsobil7aWYobj49TUFYX0hXTSl7bj1NQVhfSFdNfWVsc2V7bi0tO258PW4+Pj4xO258PW4+Pj4yO258PW4+Pj40O258PW4+Pj44O258PW4+Pj4xNjtuKyt9cmV0dXJuIG59ZnVuY3Rpb24gaG93TXVjaFRvUmVhZChuLHN0YXRlKXtpZihuPD0wfHxzdGF0ZS5sZW5ndGg9PT0wJiZzdGF0ZS5lbmRlZClyZXR1cm4gMDtpZihzdGF0ZS5vYmplY3RNb2RlKXJldHVybiAxO2lmKG4hPT1uKXtpZihzdGF0ZS5mbG93aW5nJiZzdGF0ZS5sZW5ndGgpcmV0dXJuIHN0YXRlLmJ1ZmZlci5oZWFkLmRhdGEubGVuZ3RoO2Vsc2UgcmV0dXJuIHN0YXRlLmxlbmd0aH1pZihuPnN0YXRlLmhpZ2hXYXRlck1hcmspc3RhdGUuaGlnaFdhdGVyTWFyaz1jb21wdXRlTmV3SGlnaFdhdGVyTWFyayhuKTtpZihuPD1zdGF0ZS5sZW5ndGgpcmV0dXJuIG47aWYoIXN0YXRlLmVuZGVkKXtzdGF0ZS5uZWVkUmVhZGFibGU9dHJ1ZTtyZXR1cm4gMH1yZXR1cm4gc3RhdGUubGVuZ3RofVJlYWRhYmxlLnByb3RvdHlwZS5yZWFkPWZ1bmN0aW9uKG4pe2RlYnVnKCJyZWFkIixuKTtuPXBhcnNlSW50KG4sMTApO3ZhciBzdGF0ZT10aGlzLl9yZWFkYWJsZVN0YXRlO3ZhciBuT3JpZz1uO2lmKG4hPT0wKXN0YXRlLmVtaXR0ZWRSZWFkYWJsZT1mYWxzZTtpZihuPT09MCYmc3RhdGUubmVlZFJlYWRhYmxlJiYoc3RhdGUubGVuZ3RoPj1zdGF0ZS5oaWdoV2F0ZXJNYXJrfHxzdGF0ZS5lbmRlZCkpe2RlYnVnKCJyZWFkOiBlbWl0UmVhZGFibGUiLHN0YXRlLmxlbmd0aCxzdGF0ZS5lbmRlZCk7aWYoc3RhdGUubGVuZ3RoPT09MCYmc3RhdGUuZW5kZWQpZW5kUmVhZGFibGUodGhpcyk7ZWxzZSBlbWl0UmVhZGFibGUodGhpcyk7cmV0dXJuIG51bGx9bj1ob3dNdWNoVG9SZWFkKG4sc3RhdGUpO2lmKG49PT0wJiZzdGF0ZS5lbmRlZCl7aWYoc3RhdGUubGVuZ3RoPT09MCllbmRSZWFkYWJsZSh0aGlzKTtyZXR1cm4gbnVsbH12YXIgZG9SZWFkPXN0YXRlLm5lZWRSZWFkYWJsZTtkZWJ1ZygibmVlZCByZWFkYWJsZSIsZG9SZWFkKTtpZihzdGF0ZS5sZW5ndGg9PT0wfHxzdGF0ZS5sZW5ndGgtbjxzdGF0ZS5oaWdoV2F0ZXJNYXJrKXtkb1JlYWQ9dHJ1ZTtkZWJ1ZygibGVuZ3RoIGxlc3MgdGhhbiB3YXRlcm1hcmsiLGRvUmVhZCl9aWYoc3RhdGUuZW5kZWR8fHN0YXRlLnJlYWRpbmcpe2RvUmVhZD1mYWxzZTtkZWJ1ZygicmVhZGluZyBvciBlbmRlZCIsZG9SZWFkKX1lbHNlIGlmKGRvUmVhZCl7ZGVidWcoImRvIHJlYWQiKTtzdGF0ZS5yZWFkaW5nPXRydWU7c3RhdGUuc3luYz10cnVlO2lmKHN0YXRlLmxlbmd0aD09PTApc3RhdGUubmVlZFJlYWRhYmxlPXRydWU7dGhpcy5fcmVhZChzdGF0ZS5oaWdoV2F0ZXJNYXJrKTtzdGF0ZS5zeW5jPWZhbHNlO2lmKCFzdGF0ZS5yZWFkaW5nKW49aG93TXVjaFRvUmVhZChuT3JpZyxzdGF0ZSl9dmFyIHJldDtpZihuPjApcmV0PWZyb21MaXN0KG4sc3RhdGUpO2Vsc2UgcmV0PW51bGw7aWYocmV0PT09bnVsbCl7c3RhdGUubmVlZFJlYWRhYmxlPXRydWU7bj0wfWVsc2V7c3RhdGUubGVuZ3RoLT1ufWlmKHN0YXRlLmxlbmd0aD09PTApe2lmKCFzdGF0ZS5lbmRlZClzdGF0ZS5uZWVkUmVhZGFibGU9dHJ1ZTtpZihuT3JpZyE9PW4mJnN0YXRlLmVuZGVkKWVuZFJlYWRhYmxlKHRoaXMpfWlmKHJldCE9PW51bGwpdGhpcy5lbWl0KCJkYXRhIixyZXQpO3JldHVybiByZXR9O2Z1bmN0aW9uIG9uRW9mQ2h1bmsoc3RyZWFtLHN0YXRlKXtpZihzdGF0ZS5lbmRlZClyZXR1cm47aWYoc3RhdGUuZGVjb2Rlcil7dmFyIGNodW5rPXN0YXRlLmRlY29kZXIuZW5kKCk7aWYoY2h1bmsmJmNodW5rLmxlbmd0aCl7c3RhdGUuYnVmZmVyLnB1c2goY2h1bmspO3N0YXRlLmxlbmd0aCs9c3RhdGUub2JqZWN0TW9kZT8xOmNodW5rLmxlbmd0aH19c3RhdGUuZW5kZWQ9dHJ1ZTtlbWl0UmVhZGFibGUoc3RyZWFtKX1mdW5jdGlvbiBlbWl0UmVhZGFibGUoc3RyZWFtKXt2YXIgc3RhdGU9c3RyZWFtLl9yZWFkYWJsZVN0YXRlO3N0YXRlLm5lZWRSZWFkYWJsZT1mYWxzZTtpZighc3RhdGUuZW1pdHRlZFJlYWRhYmxlKXtkZWJ1ZygiZW1pdFJlYWRhYmxlIixzdGF0ZS5mbG93aW5nKTtzdGF0ZS5lbWl0dGVkUmVhZGFibGU9dHJ1ZTtpZihzdGF0ZS5zeW5jKXBuYS5uZXh0VGljayhlbWl0UmVhZGFibGVfLHN0cmVhbSk7ZWxzZSBlbWl0UmVhZGFibGVfKHN0cmVhbSl9fWZ1bmN0aW9uIGVtaXRSZWFkYWJsZV8oc3RyZWFtKXtkZWJ1ZygiZW1pdCByZWFkYWJsZSIpO3N0cmVhbS5lbWl0KCJyZWFkYWJsZSIpO2Zsb3coc3RyZWFtKX1mdW5jdGlvbiBtYXliZVJlYWRNb3JlKHN0cmVhbSxzdGF0ZSl7aWYoIXN0YXRlLnJlYWRpbmdNb3JlKXtzdGF0ZS5yZWFkaW5nTW9yZT10cnVlO3BuYS5uZXh0VGljayhtYXliZVJlYWRNb3JlXyxzdHJlYW0sc3RhdGUpfX1mdW5jdGlvbiBtYXliZVJlYWRNb3JlXyhzdHJlYW0sc3RhdGUpe3ZhciBsZW49c3RhdGUubGVuZ3RoO3doaWxlKCFzdGF0ZS5yZWFkaW5nJiYhc3RhdGUuZmxvd2luZyYmIXN0YXRlLmVuZGVkJiZzdGF0ZS5sZW5ndGg8c3RhdGUuaGlnaFdhdGVyTWFyayl7ZGVidWcoIm1heWJlUmVhZE1vcmUgcmVhZCAwIik7c3RyZWFtLnJlYWQoMCk7aWYobGVuPT09c3RhdGUubGVuZ3RoKWJyZWFrO2Vsc2UgbGVuPXN0YXRlLmxlbmd0aH1zdGF0ZS5yZWFkaW5nTW9yZT1mYWxzZX1SZWFkYWJsZS5wcm90b3R5cGUuX3JlYWQ9ZnVuY3Rpb24obil7dGhpcy5lbWl0KCJlcnJvciIsbmV3IEVycm9yKCJfcmVhZCgpIGlzIG5vdCBpbXBsZW1lbnRlZCIpKX07UmVhZGFibGUucHJvdG90eXBlLnBpcGU9ZnVuY3Rpb24oZGVzdCxwaXBlT3B0cyl7dmFyIHNyYz10aGlzO3ZhciBzdGF0ZT10aGlzLl9yZWFkYWJsZVN0YXRlO3N3aXRjaChzdGF0ZS5waXBlc0NvdW50KXtjYXNlIDA6c3RhdGUucGlwZXM9ZGVzdDticmVhaztjYXNlIDE6c3RhdGUucGlwZXM9W3N0YXRlLnBpcGVzLGRlc3RdO2JyZWFrO2RlZmF1bHQ6c3RhdGUucGlwZXMucHVzaChkZXN0KTticmVha31zdGF0ZS5waXBlc0NvdW50Kz0xO2RlYnVnKCJwaXBlIGNvdW50PSVkIG9wdHM9JWoiLHN0YXRlLnBpcGVzQ291bnQscGlwZU9wdHMpO3ZhciBkb0VuZD0oIXBpcGVPcHRzfHxwaXBlT3B0cy5lbmQhPT1mYWxzZSkmJmRlc3QhPT1wcm9jZXNzLnN0ZG91dCYmZGVzdCE9PXByb2Nlc3Muc3RkZXJyO3ZhciBlbmRGbj1kb0VuZD9vbmVuZDp1bnBpcGU7aWYoc3RhdGUuZW5kRW1pdHRlZClwbmEubmV4dFRpY2soZW5kRm4pO2Vsc2Ugc3JjLm9uY2UoImVuZCIsZW5kRm4pO2Rlc3Qub24oInVucGlwZSIsb251bnBpcGUpO2Z1bmN0aW9uIG9udW5waXBlKHJlYWRhYmxlLHVucGlwZUluZm8pe2RlYnVnKCJvbnVucGlwZSIpO2lmKHJlYWRhYmxlPT09c3JjKXtpZih1bnBpcGVJbmZvJiZ1bnBpcGVJbmZvLmhhc1VucGlwZWQ9PT1mYWxzZSl7dW5waXBlSW5mby5oYXNVbnBpcGVkPXRydWU7Y2xlYW51cCgpfX19ZnVuY3Rpb24gb25lbmQoKXtkZWJ1Zygib25lbmQiKTtkZXN0LmVuZCgpfXZhciBvbmRyYWluPXBpcGVPbkRyYWluKHNyYyk7ZGVzdC5vbigiZHJhaW4iLG9uZHJhaW4pO3ZhciBjbGVhbmVkVXA9ZmFsc2U7ZnVuY3Rpb24gY2xlYW51cCgpe2RlYnVnKCJjbGVhbnVwIik7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiY2xvc2UiLG9uY2xvc2UpO2Rlc3QucmVtb3ZlTGlzdGVuZXIoImZpbmlzaCIsb25maW5pc2gpO2Rlc3QucmVtb3ZlTGlzdGVuZXIoImRyYWluIixvbmRyYWluKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJlcnJvciIsb25lcnJvcik7ZGVzdC5yZW1vdmVMaXN0ZW5lcigidW5waXBlIixvbnVucGlwZSk7c3JjLnJlbW92ZUxpc3RlbmVyKCJlbmQiLG9uZW5kKTtzcmMucmVtb3ZlTGlzdGVuZXIoImVuZCIsdW5waXBlKTtzcmMucmVtb3ZlTGlzdGVuZXIoImRhdGEiLG9uZGF0YSk7Y2xlYW5lZFVwPXRydWU7aWYoc3RhdGUuYXdhaXREcmFpbiYmKCFkZXN0Ll93cml0YWJsZVN0YXRlfHxkZXN0Ll93cml0YWJsZVN0YXRlLm5lZWREcmFpbikpb25kcmFpbigpfXZhciBpbmNyZWFzZWRBd2FpdERyYWluPWZhbHNlO3NyYy5vbigiZGF0YSIsb25kYXRhKTtmdW5jdGlvbiBvbmRhdGEoY2h1bmspe2RlYnVnKCJvbmRhdGEiKTtpbmNyZWFzZWRBd2FpdERyYWluPWZhbHNlO3ZhciByZXQ9ZGVzdC53cml0ZShjaHVuayk7aWYoZmFsc2U9PT1yZXQmJiFpbmNyZWFzZWRBd2FpdERyYWluKXtpZigoc3RhdGUucGlwZXNDb3VudD09PTEmJnN0YXRlLnBpcGVzPT09ZGVzdHx8c3RhdGUucGlwZXNDb3VudD4xJiZpbmRleE9mKHN0YXRlLnBpcGVzLGRlc3QpIT09LTEpJiYhY2xlYW5lZFVwKXtkZWJ1ZygiZmFsc2Ugd3JpdGUgcmVzcG9uc2UsIHBhdXNlIixzcmMuX3JlYWRhYmxlU3RhdGUuYXdhaXREcmFpbik7c3JjLl9yZWFkYWJsZVN0YXRlLmF3YWl0RHJhaW4rKztpbmNyZWFzZWRBd2FpdERyYWluPXRydWV9c3JjLnBhdXNlKCl9fWZ1bmN0aW9uIG9uZXJyb3IoZXIpe2RlYnVnKCJvbmVycm9yIixlcik7dW5waXBlKCk7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZXJyb3IiLG9uZXJyb3IpO2lmKEVFbGlzdGVuZXJDb3VudChkZXN0LCJlcnJvciIpPT09MClkZXN0LmVtaXQoImVycm9yIixlcil9cHJlcGVuZExpc3RlbmVyKGRlc3QsImVycm9yIixvbmVycm9yKTtmdW5jdGlvbiBvbmNsb3NlKCl7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZmluaXNoIixvbmZpbmlzaCk7dW5waXBlKCl9ZGVzdC5vbmNlKCJjbG9zZSIsb25jbG9zZSk7ZnVuY3Rpb24gb25maW5pc2goKXtkZWJ1Zygib25maW5pc2giKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJjbG9zZSIsb25jbG9zZSk7dW5waXBlKCl9ZGVzdC5vbmNlKCJmaW5pc2giLG9uZmluaXNoKTtmdW5jdGlvbiB1bnBpcGUoKXtkZWJ1ZygidW5waXBlIik7c3JjLnVucGlwZShkZXN0KX1kZXN0LmVtaXQoInBpcGUiLHNyYyk7aWYoIXN0YXRlLmZsb3dpbmcpe2RlYnVnKCJwaXBlIHJlc3VtZSIpO3NyYy5yZXN1bWUoKX1yZXR1cm4gZGVzdH07ZnVuY3Rpb24gcGlwZU9uRHJhaW4oc3JjKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgc3RhdGU9c3JjLl9yZWFkYWJsZVN0YXRlO2RlYnVnKCJwaXBlT25EcmFpbiIsc3RhdGUuYXdhaXREcmFpbik7aWYoc3RhdGUuYXdhaXREcmFpbilzdGF0ZS5hd2FpdERyYWluLS07aWYoc3RhdGUuYXdhaXREcmFpbj09PTAmJkVFbGlzdGVuZXJDb3VudChzcmMsImRhdGEiKSl7c3RhdGUuZmxvd2luZz10cnVlO2Zsb3coc3JjKX19fVJlYWRhYmxlLnByb3RvdHlwZS51bnBpcGU9ZnVuY3Rpb24oZGVzdCl7dmFyIHN0YXRlPXRoaXMuX3JlYWRhYmxlU3RhdGU7dmFyIHVucGlwZUluZm89e2hhc1VucGlwZWQ6ZmFsc2V9O2lmKHN0YXRlLnBpcGVzQ291bnQ9PT0wKXJldHVybiB0aGlzO2lmKHN0YXRlLnBpcGVzQ291bnQ9PT0xKXtpZihkZXN0JiZkZXN0IT09c3RhdGUucGlwZXMpcmV0dXJuIHRoaXM7aWYoIWRlc3QpZGVzdD1zdGF0ZS5waXBlcztzdGF0ZS5waXBlcz1udWxsO3N0YXRlLnBpcGVzQ291bnQ9MDtzdGF0ZS5mbG93aW5nPWZhbHNlO2lmKGRlc3QpZGVzdC5lbWl0KCJ1bnBpcGUiLHRoaXMsdW5waXBlSW5mbyk7cmV0dXJuIHRoaXN9aWYoIWRlc3Qpe3ZhciBkZXN0cz1zdGF0ZS5waXBlczt2YXIgbGVuPXN0YXRlLnBpcGVzQ291bnQ7c3RhdGUucGlwZXM9bnVsbDtzdGF0ZS5waXBlc0NvdW50PTA7c3RhdGUuZmxvd2luZz1mYWxzZTtmb3IodmFyIGk9MDtpPGxlbjtpKyspe2Rlc3RzW2ldLmVtaXQoInVucGlwZSIsdGhpcyx1bnBpcGVJbmZvKX1yZXR1cm4gdGhpc312YXIgaW5kZXg9aW5kZXhPZihzdGF0ZS5waXBlcyxkZXN0KTtpZihpbmRleD09PS0xKXJldHVybiB0aGlzO3N0YXRlLnBpcGVzLnNwbGljZShpbmRleCwxKTtzdGF0ZS5waXBlc0NvdW50LT0xO2lmKHN0YXRlLnBpcGVzQ291bnQ9PT0xKXN0YXRlLnBpcGVzPXN0YXRlLnBpcGVzWzBdO2Rlc3QuZW1pdCgidW5waXBlIix0aGlzLHVucGlwZUluZm8pO3JldHVybiB0aGlzfTtSZWFkYWJsZS5wcm90b3R5cGUub249ZnVuY3Rpb24oZXYsZm4pe3ZhciByZXM9U3RyZWFtLnByb3RvdHlwZS5vbi5jYWxsKHRoaXMsZXYsZm4pO2lmKGV2PT09ImRhdGEiKXtpZih0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmchPT1mYWxzZSl0aGlzLnJlc3VtZSgpfWVsc2UgaWYoZXY9PT0icmVhZGFibGUiKXt2YXIgc3RhdGU9dGhpcy5fcmVhZGFibGVTdGF0ZTtpZighc3RhdGUuZW5kRW1pdHRlZCYmIXN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nKXtzdGF0ZS5yZWFkYWJsZUxpc3RlbmluZz1zdGF0ZS5uZWVkUmVhZGFibGU9dHJ1ZTtzdGF0ZS5lbWl0dGVkUmVhZGFibGU9ZmFsc2U7aWYoIXN0YXRlLnJlYWRpbmcpe3BuYS5uZXh0VGljayhuUmVhZGluZ05leHRUaWNrLHRoaXMpfWVsc2UgaWYoc3RhdGUubGVuZ3RoKXtlbWl0UmVhZGFibGUodGhpcyl9fX1yZXR1cm4gcmVzfTtSZWFkYWJsZS5wcm90b3R5cGUuYWRkTGlzdGVuZXI9UmVhZGFibGUucHJvdG90eXBlLm9uO2Z1bmN0aW9uIG5SZWFkaW5nTmV4dFRpY2soc2VsZil7ZGVidWcoInJlYWRhYmxlIG5leHR0aWNrIHJlYWQgMCIpO3NlbGYucmVhZCgwKX1SZWFkYWJsZS5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7dmFyIHN0YXRlPXRoaXMuX3JlYWRhYmxlU3RhdGU7aWYoIXN0YXRlLmZsb3dpbmcpe2RlYnVnKCJyZXN1bWUiKTtzdGF0ZS5mbG93aW5nPXRydWU7cmVzdW1lKHRoaXMsc3RhdGUpfXJldHVybiB0aGlzfTtmdW5jdGlvbiByZXN1bWUoc3RyZWFtLHN0YXRlKXtpZighc3RhdGUucmVzdW1lU2NoZWR1bGVkKXtzdGF0ZS5yZXN1bWVTY2hlZHVsZWQ9dHJ1ZTtwbmEubmV4dFRpY2socmVzdW1lXyxzdHJlYW0sc3RhdGUpfX1mdW5jdGlvbiByZXN1bWVfKHN0cmVhbSxzdGF0ZSl7aWYoIXN0YXRlLnJlYWRpbmcpe2RlYnVnKCJyZXN1bWUgcmVhZCAwIik7c3RyZWFtLnJlYWQoMCl9c3RhdGUucmVzdW1lU2NoZWR1bGVkPWZhbHNlO3N0YXRlLmF3YWl0RHJhaW49MDtzdHJlYW0uZW1pdCgicmVzdW1lIik7ZmxvdyhzdHJlYW0pO2lmKHN0YXRlLmZsb3dpbmcmJiFzdGF0ZS5yZWFkaW5nKXN0cmVhbS5yZWFkKDApfVJlYWRhYmxlLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbigpe2RlYnVnKCJjYWxsIHBhdXNlIGZsb3dpbmc9JWoiLHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyk7aWYoZmFsc2UhPT10aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpe2RlYnVnKCJwYXVzZSIpO3RoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZz1mYWxzZTt0aGlzLmVtaXQoInBhdXNlIil9cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIGZsb3coc3RyZWFtKXt2YXIgc3RhdGU9c3RyZWFtLl9yZWFkYWJsZVN0YXRlO2RlYnVnKCJmbG93IixzdGF0ZS5mbG93aW5nKTt3aGlsZShzdGF0ZS5mbG93aW5nJiZzdHJlYW0ucmVhZCgpIT09bnVsbCl7fX1SZWFkYWJsZS5wcm90b3R5cGUud3JhcD1mdW5jdGlvbihzdHJlYW0pe3ZhciBfdGhpcz10aGlzO3ZhciBzdGF0ZT10aGlzLl9yZWFkYWJsZVN0YXRlO3ZhciBwYXVzZWQ9ZmFsc2U7c3RyZWFtLm9uKCJlbmQiLGZ1bmN0aW9uKCl7ZGVidWcoIndyYXBwZWQgZW5kIik7aWYoc3RhdGUuZGVjb2RlciYmIXN0YXRlLmVuZGVkKXt2YXIgY2h1bms9c3RhdGUuZGVjb2Rlci5lbmQoKTtpZihjaHVuayYmY2h1bmsubGVuZ3RoKV90aGlzLnB1c2goY2h1bmspfV90aGlzLnB1c2gobnVsbCl9KTtzdHJlYW0ub24oImRhdGEiLGZ1bmN0aW9uKGNodW5rKXtkZWJ1Zygid3JhcHBlZCBkYXRhIik7aWYoc3RhdGUuZGVjb2RlciljaHVuaz1zdGF0ZS5kZWNvZGVyLndyaXRlKGNodW5rKTtpZihzdGF0ZS5vYmplY3RNb2RlJiYoY2h1bms9PT1udWxsfHxjaHVuaz09PXVuZGVmaW5lZCkpcmV0dXJuO2Vsc2UgaWYoIXN0YXRlLm9iamVjdE1vZGUmJighY2h1bmt8fCFjaHVuay5sZW5ndGgpKXJldHVybjt2YXIgcmV0PV90aGlzLnB1c2goY2h1bmspO2lmKCFyZXQpe3BhdXNlZD10cnVlO3N0cmVhbS5wYXVzZSgpfX0pO2Zvcih2YXIgaSBpbiBzdHJlYW0pe2lmKHRoaXNbaV09PT11bmRlZmluZWQmJnR5cGVvZiBzdHJlYW1baV09PT0iZnVuY3Rpb24iKXt0aGlzW2ldPWZ1bmN0aW9uKG1ldGhvZCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHN0cmVhbVttZXRob2RdLmFwcGx5KHN0cmVhbSxhcmd1bWVudHMpfX0oaSl9fWZvcih2YXIgbj0wO248a1Byb3h5RXZlbnRzLmxlbmd0aDtuKyspe3N0cmVhbS5vbihrUHJveHlFdmVudHNbbl0sdGhpcy5lbWl0LmJpbmQodGhpcyxrUHJveHlFdmVudHNbbl0pKX10aGlzLl9yZWFkPWZ1bmN0aW9uKG4pe2RlYnVnKCJ3cmFwcGVkIF9yZWFkIixuKTtpZihwYXVzZWQpe3BhdXNlZD1mYWxzZTtzdHJlYW0ucmVzdW1lKCl9fTtyZXR1cm4gdGhpc307T2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRhYmxlLnByb3RvdHlwZSwicmVhZGFibGVIaWdoV2F0ZXJNYXJrIix7ZW51bWVyYWJsZTpmYWxzZSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5oaWdoV2F0ZXJNYXJrfX0pO1JlYWRhYmxlLl9mcm9tTGlzdD1mcm9tTGlzdDtmdW5jdGlvbiBmcm9tTGlzdChuLHN0YXRlKXtpZihzdGF0ZS5sZW5ndGg9PT0wKXJldHVybiBudWxsO3ZhciByZXQ7aWYoc3RhdGUub2JqZWN0TW9kZSlyZXQ9c3RhdGUuYnVmZmVyLnNoaWZ0KCk7ZWxzZSBpZighbnx8bj49c3RhdGUubGVuZ3RoKXtpZihzdGF0ZS5kZWNvZGVyKXJldD1zdGF0ZS5idWZmZXIuam9pbigiIik7ZWxzZSBpZihzdGF0ZS5idWZmZXIubGVuZ3RoPT09MSlyZXQ9c3RhdGUuYnVmZmVyLmhlYWQuZGF0YTtlbHNlIHJldD1zdGF0ZS5idWZmZXIuY29uY2F0KHN0YXRlLmxlbmd0aCk7c3RhdGUuYnVmZmVyLmNsZWFyKCl9ZWxzZXtyZXQ9ZnJvbUxpc3RQYXJ0aWFsKG4sc3RhdGUuYnVmZmVyLHN0YXRlLmRlY29kZXIpfXJldHVybiByZXR9ZnVuY3Rpb24gZnJvbUxpc3RQYXJ0aWFsKG4sbGlzdCxoYXNTdHJpbmdzKXt2YXIgcmV0O2lmKG48bGlzdC5oZWFkLmRhdGEubGVuZ3RoKXtyZXQ9bGlzdC5oZWFkLmRhdGEuc2xpY2UoMCxuKTtsaXN0LmhlYWQuZGF0YT1saXN0LmhlYWQuZGF0YS5zbGljZShuKX1lbHNlIGlmKG49PT1saXN0LmhlYWQuZGF0YS5sZW5ndGgpe3JldD1saXN0LnNoaWZ0KCl9ZWxzZXtyZXQ9aGFzU3RyaW5ncz9jb3B5RnJvbUJ1ZmZlclN0cmluZyhuLGxpc3QpOmNvcHlGcm9tQnVmZmVyKG4sbGlzdCl9cmV0dXJuIHJldH1mdW5jdGlvbiBjb3B5RnJvbUJ1ZmZlclN0cmluZyhuLGxpc3Qpe3ZhciBwPWxpc3QuaGVhZDt2YXIgYz0xO3ZhciByZXQ9cC5kYXRhO24tPXJldC5sZW5ndGg7d2hpbGUocD1wLm5leHQpe3ZhciBzdHI9cC5kYXRhO3ZhciBuYj1uPnN0ci5sZW5ndGg/c3RyLmxlbmd0aDpuO2lmKG5iPT09c3RyLmxlbmd0aClyZXQrPXN0cjtlbHNlIHJldCs9c3RyLnNsaWNlKDAsbik7bi09bmI7aWYobj09PTApe2lmKG5iPT09c3RyLmxlbmd0aCl7KytjO2lmKHAubmV4dClsaXN0LmhlYWQ9cC5uZXh0O2Vsc2UgbGlzdC5oZWFkPWxpc3QudGFpbD1udWxsfWVsc2V7bGlzdC5oZWFkPXA7cC5kYXRhPXN0ci5zbGljZShuYil9YnJlYWt9KytjfWxpc3QubGVuZ3RoLT1jO3JldHVybiByZXR9ZnVuY3Rpb24gY29weUZyb21CdWZmZXIobixsaXN0KXt2YXIgcmV0PUJ1ZmZlci5hbGxvY1Vuc2FmZShuKTt2YXIgcD1saXN0LmhlYWQ7dmFyIGM9MTtwLmRhdGEuY29weShyZXQpO24tPXAuZGF0YS5sZW5ndGg7d2hpbGUocD1wLm5leHQpe3ZhciBidWY9cC5kYXRhO3ZhciBuYj1uPmJ1Zi5sZW5ndGg/YnVmLmxlbmd0aDpuO2J1Zi5jb3B5KHJldCxyZXQubGVuZ3RoLW4sMCxuYik7bi09bmI7aWYobj09PTApe2lmKG5iPT09YnVmLmxlbmd0aCl7KytjO2lmKHAubmV4dClsaXN0LmhlYWQ9cC5uZXh0O2Vsc2UgbGlzdC5oZWFkPWxpc3QudGFpbD1udWxsfWVsc2V7bGlzdC5oZWFkPXA7cC5kYXRhPWJ1Zi5zbGljZShuYil9YnJlYWt9KytjfWxpc3QubGVuZ3RoLT1jO3JldHVybiByZXR9ZnVuY3Rpb24gZW5kUmVhZGFibGUoc3RyZWFtKXt2YXIgc3RhdGU9c3RyZWFtLl9yZWFkYWJsZVN0YXRlO2lmKHN0YXRlLmxlbmd0aD4wKXRocm93IG5ldyBFcnJvcignImVuZFJlYWRhYmxlKCkiIGNhbGxlZCBvbiBub24tZW1wdHkgc3RyZWFtJyk7aWYoIXN0YXRlLmVuZEVtaXR0ZWQpe3N0YXRlLmVuZGVkPXRydWU7cG5hLm5leHRUaWNrKGVuZFJlYWRhYmxlTlQsc3RhdGUsc3RyZWFtKX19ZnVuY3Rpb24gZW5kUmVhZGFibGVOVChzdGF0ZSxzdHJlYW0pe2lmKCFzdGF0ZS5lbmRFbWl0dGVkJiZzdGF0ZS5sZW5ndGg9PT0wKXtzdGF0ZS5lbmRFbWl0dGVkPXRydWU7c3RyZWFtLnJlYWRhYmxlPWZhbHNlO3N0cmVhbS5lbWl0KCJlbmQiKX19ZnVuY3Rpb24gaW5kZXhPZih4cyx4KXtmb3IodmFyIGk9MCxsPXhzLmxlbmd0aDtpPGw7aSsrKXtpZih4c1tpXT09PXgpcmV0dXJuIGl9cmV0dXJuLTF9fSkuY2FsbCh0aGlzLHJlcXVpcmUoIl9wcm9jZXNzIiksdHlwZW9mIGdsb2JhbCE9PSJ1bmRlZmluZWQiP2dsb2JhbDp0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiP3dpbmRvdzp7fSl9LHsiLi9fc3RyZWFtX2R1cGxleCI6NjYsIi4vaW50ZXJuYWwvc3RyZWFtcy9CdWZmZXJMaXN0Ijo3MSwiLi9pbnRlcm5hbC9zdHJlYW1zL2Rlc3Ryb3kiOjcyLCIuL2ludGVybmFsL3N0cmVhbXMvc3RyZWFtIjo3MyxfcHJvY2Vzczo2NCwiY29yZS11dGlsLWlzIjozMCxldmVudHM6MzMsaW5oZXJpdHM6MzYsaXNhcnJheTozOCwicHJvY2Vzcy1uZXh0aWNrLWFyZ3MiOjYzLCJzYWZlLWJ1ZmZlciI6NzksInN0cmluZ19kZWNvZGVyLyI6OTksdXRpbDoyNn1dLDY5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7bW9kdWxlLmV4cG9ydHM9VHJhbnNmb3JtO3ZhciBEdXBsZXg9cmVxdWlyZSgiLi9fc3RyZWFtX2R1cGxleCIpO3ZhciB1dGlsPXJlcXVpcmUoImNvcmUtdXRpbC1pcyIpO3V0aWwuaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt1dGlsLmluaGVyaXRzKFRyYW5zZm9ybSxEdXBsZXgpO2Z1bmN0aW9uIGFmdGVyVHJhbnNmb3JtKGVyLGRhdGEpe3ZhciB0cz10aGlzLl90cmFuc2Zvcm1TdGF0ZTt0cy50cmFuc2Zvcm1pbmc9ZmFsc2U7dmFyIGNiPXRzLndyaXRlY2I7aWYoIWNiKXtyZXR1cm4gdGhpcy5lbWl0KCJlcnJvciIsbmV3IEVycm9yKCJ3cml0ZSBjYWxsYmFjayBjYWxsZWQgbXVsdGlwbGUgdGltZXMiKSl9dHMud3JpdGVjaHVuaz1udWxsO3RzLndyaXRlY2I9bnVsbDtpZihkYXRhIT1udWxsKXRoaXMucHVzaChkYXRhKTtjYihlcik7dmFyIHJzPXRoaXMuX3JlYWRhYmxlU3RhdGU7cnMucmVhZGluZz1mYWxzZTtpZihycy5uZWVkUmVhZGFibGV8fHJzLmxlbmd0aDxycy5oaWdoV2F0ZXJNYXJrKXt0aGlzLl9yZWFkKHJzLmhpZ2hXYXRlck1hcmspfX1mdW5jdGlvbiBUcmFuc2Zvcm0ob3B0aW9ucyl7aWYoISh0aGlzIGluc3RhbmNlb2YgVHJhbnNmb3JtKSlyZXR1cm4gbmV3IFRyYW5zZm9ybShvcHRpb25zKTtEdXBsZXguY2FsbCh0aGlzLG9wdGlvbnMpO3RoaXMuX3RyYW5zZm9ybVN0YXRlPXthZnRlclRyYW5zZm9ybTphZnRlclRyYW5zZm9ybS5iaW5kKHRoaXMpLG5lZWRUcmFuc2Zvcm06ZmFsc2UsdHJhbnNmb3JtaW5nOmZhbHNlLHdyaXRlY2I6bnVsbCx3cml0ZWNodW5rOm51bGwsd3JpdGVlbmNvZGluZzpudWxsfTt0aGlzLl9yZWFkYWJsZVN0YXRlLm5lZWRSZWFkYWJsZT10cnVlO3RoaXMuX3JlYWRhYmxlU3RhdGUuc3luYz1mYWxzZTtpZihvcHRpb25zKXtpZih0eXBlb2Ygb3B0aW9ucy50cmFuc2Zvcm09PT0iZnVuY3Rpb24iKXRoaXMuX3RyYW5zZm9ybT1vcHRpb25zLnRyYW5zZm9ybTtpZih0eXBlb2Ygb3B0aW9ucy5mbHVzaD09PSJmdW5jdGlvbiIpdGhpcy5fZmx1c2g9b3B0aW9ucy5mbHVzaH10aGlzLm9uKCJwcmVmaW5pc2giLHByZWZpbmlzaCl9ZnVuY3Rpb24gcHJlZmluaXNoKCl7dmFyIF90aGlzPXRoaXM7aWYodHlwZW9mIHRoaXMuX2ZsdXNoPT09ImZ1bmN0aW9uIil7dGhpcy5fZmx1c2goZnVuY3Rpb24oZXIsZGF0YSl7ZG9uZShfdGhpcyxlcixkYXRhKX0pfWVsc2V7ZG9uZSh0aGlzLG51bGwsbnVsbCl9fVRyYW5zZm9ybS5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihjaHVuayxlbmNvZGluZyl7dGhpcy5fdHJhbnNmb3JtU3RhdGUubmVlZFRyYW5zZm9ybT1mYWxzZTtyZXR1cm4gRHVwbGV4LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcyxjaHVuayxlbmNvZGluZyl9O1RyYW5zZm9ybS5wcm90b3R5cGUuX3RyYW5zZm9ybT1mdW5jdGlvbihjaHVuayxlbmNvZGluZyxjYil7dGhyb3cgbmV3IEVycm9yKCJfdHJhbnNmb3JtKCkgaXMgbm90IGltcGxlbWVudGVkIil9O1RyYW5zZm9ybS5wcm90b3R5cGUuX3dyaXRlPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXt2YXIgdHM9dGhpcy5fdHJhbnNmb3JtU3RhdGU7dHMud3JpdGVjYj1jYjt0cy53cml0ZWNodW5rPWNodW5rO3RzLndyaXRlZW5jb2Rpbmc9ZW5jb2Rpbmc7aWYoIXRzLnRyYW5zZm9ybWluZyl7dmFyIHJzPXRoaXMuX3JlYWRhYmxlU3RhdGU7aWYodHMubmVlZFRyYW5zZm9ybXx8cnMubmVlZFJlYWRhYmxlfHxycy5sZW5ndGg8cnMuaGlnaFdhdGVyTWFyayl0aGlzLl9yZWFkKHJzLmhpZ2hXYXRlck1hcmspfX07VHJhbnNmb3JtLnByb3RvdHlwZS5fcmVhZD1mdW5jdGlvbihuKXt2YXIgdHM9dGhpcy5fdHJhbnNmb3JtU3RhdGU7aWYodHMud3JpdGVjaHVuayE9PW51bGwmJnRzLndyaXRlY2ImJiF0cy50cmFuc2Zvcm1pbmcpe3RzLnRyYW5zZm9ybWluZz10cnVlO3RoaXMuX3RyYW5zZm9ybSh0cy53cml0ZWNodW5rLHRzLndyaXRlZW5jb2RpbmcsdHMuYWZ0ZXJUcmFuc2Zvcm0pfWVsc2V7dHMubmVlZFRyYW5zZm9ybT10cnVlfX07VHJhbnNmb3JtLnByb3RvdHlwZS5fZGVzdHJveT1mdW5jdGlvbihlcnIsY2Ipe3ZhciBfdGhpczI9dGhpcztEdXBsZXgucHJvdG90eXBlLl9kZXN0cm95LmNhbGwodGhpcyxlcnIsZnVuY3Rpb24oZXJyMil7Y2IoZXJyMik7X3RoaXMyLmVtaXQoImNsb3NlIil9KX07ZnVuY3Rpb24gZG9uZShzdHJlYW0sZXIsZGF0YSl7aWYoZXIpcmV0dXJuIHN0cmVhbS5lbWl0KCJlcnJvciIsZXIpO2lmKGRhdGEhPW51bGwpc3RyZWFtLnB1c2goZGF0YSk7aWYoc3RyZWFtLl93cml0YWJsZVN0YXRlLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoIkNhbGxpbmcgdHJhbnNmb3JtIGRvbmUgd2hlbiB3cy5sZW5ndGggIT0gMCIpO2lmKHN0cmVhbS5fdHJhbnNmb3JtU3RhdGUudHJhbnNmb3JtaW5nKXRocm93IG5ldyBFcnJvcigiQ2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHN0aWxsIHRyYW5zZm9ybWluZyIpO3JldHVybiBzdHJlYW0ucHVzaChudWxsKX19LHsiLi9fc3RyZWFtX2R1cGxleCI6NjYsImNvcmUtdXRpbC1pcyI6MzAsaW5oZXJpdHM6MzZ9XSw3MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MsZ2xvYmFsLHNldEltbWVkaWF0ZSl7InVzZSBzdHJpY3QiO3ZhciBwbmE9cmVxdWlyZSgicHJvY2Vzcy1uZXh0aWNrLWFyZ3MiKTttb2R1bGUuZXhwb3J0cz1Xcml0YWJsZTtmdW5jdGlvbiBXcml0ZVJlcShjaHVuayxlbmNvZGluZyxjYil7dGhpcy5jaHVuaz1jaHVuazt0aGlzLmVuY29kaW5nPWVuY29kaW5nO3RoaXMuY2FsbGJhY2s9Y2I7dGhpcy5uZXh0PW51bGx9ZnVuY3Rpb24gQ29ya2VkUmVxdWVzdChzdGF0ZSl7dmFyIF90aGlzPXRoaXM7dGhpcy5uZXh0PW51bGw7dGhpcy5lbnRyeT1udWxsO3RoaXMuZmluaXNoPWZ1bmN0aW9uKCl7b25Db3JrZWRGaW5pc2goX3RoaXMsc3RhdGUpfX12YXIgYXN5bmNXcml0ZT0hcHJvY2Vzcy5icm93c2VyJiZbInYwLjEwIiwidjAuOS4iXS5pbmRleE9mKHByb2Nlc3MudmVyc2lvbi5zbGljZSgwLDUpKT4tMT9zZXRJbW1lZGlhdGU6cG5hLm5leHRUaWNrO3ZhciBEdXBsZXg7V3JpdGFibGUuV3JpdGFibGVTdGF0ZT1Xcml0YWJsZVN0YXRlO3ZhciB1dGlsPXJlcXVpcmUoImNvcmUtdXRpbC1pcyIpO3V0aWwuaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgaW50ZXJuYWxVdGlsPXtkZXByZWNhdGU6cmVxdWlyZSgidXRpbC1kZXByZWNhdGUiKX07dmFyIFN0cmVhbT1yZXF1aXJlKCIuL2ludGVybmFsL3N0cmVhbXMvc3RyZWFtIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgT3VyVWludDhBcnJheT1nbG9iYWwuVWludDhBcnJheXx8ZnVuY3Rpb24oKXt9O2Z1bmN0aW9uIF91aW50OEFycmF5VG9CdWZmZXIoY2h1bmspe3JldHVybiBCdWZmZXIuZnJvbShjaHVuayl9ZnVuY3Rpb24gX2lzVWludDhBcnJheShvYmope3JldHVybiBCdWZmZXIuaXNCdWZmZXIob2JqKXx8b2JqIGluc3RhbmNlb2YgT3VyVWludDhBcnJheX12YXIgZGVzdHJveUltcGw9cmVxdWlyZSgiLi9pbnRlcm5hbC9zdHJlYW1zL2Rlc3Ryb3kiKTt1dGlsLmluaGVyaXRzKFdyaXRhYmxlLFN0cmVhbSk7ZnVuY3Rpb24gbm9wKCl7fWZ1bmN0aW9uIFdyaXRhYmxlU3RhdGUob3B0aW9ucyxzdHJlYW0pe0R1cGxleD1EdXBsZXh8fHJlcXVpcmUoIi4vX3N0cmVhbV9kdXBsZXgiKTtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBpc0R1cGxleD1zdHJlYW0gaW5zdGFuY2VvZiBEdXBsZXg7dGhpcy5vYmplY3RNb2RlPSEhb3B0aW9ucy5vYmplY3RNb2RlO2lmKGlzRHVwbGV4KXRoaXMub2JqZWN0TW9kZT10aGlzLm9iamVjdE1vZGV8fCEhb3B0aW9ucy53cml0YWJsZU9iamVjdE1vZGU7dmFyIGh3bT1vcHRpb25zLmhpZ2hXYXRlck1hcms7dmFyIHdyaXRhYmxlSHdtPW9wdGlvbnMud3JpdGFibGVIaWdoV2F0ZXJNYXJrO3ZhciBkZWZhdWx0SHdtPXRoaXMub2JqZWN0TW9kZT8xNjoxNioxMDI0O2lmKGh3bXx8aHdtPT09MCl0aGlzLmhpZ2hXYXRlck1hcms9aHdtO2Vsc2UgaWYoaXNEdXBsZXgmJih3cml0YWJsZUh3bXx8d3JpdGFibGVId209PT0wKSl0aGlzLmhpZ2hXYXRlck1hcms9d3JpdGFibGVId207ZWxzZSB0aGlzLmhpZ2hXYXRlck1hcms9ZGVmYXVsdEh3bTt0aGlzLmhpZ2hXYXRlck1hcms9TWF0aC5mbG9vcih0aGlzLmhpZ2hXYXRlck1hcmspO3RoaXMuZmluYWxDYWxsZWQ9ZmFsc2U7dGhpcy5uZWVkRHJhaW49ZmFsc2U7dGhpcy5lbmRpbmc9ZmFsc2U7dGhpcy5lbmRlZD1mYWxzZTt0aGlzLmZpbmlzaGVkPWZhbHNlO3RoaXMuZGVzdHJveWVkPWZhbHNlO3ZhciBub0RlY29kZT1vcHRpb25zLmRlY29kZVN0cmluZ3M9PT1mYWxzZTt0aGlzLmRlY29kZVN0cmluZ3M9IW5vRGVjb2RlO3RoaXMuZGVmYXVsdEVuY29kaW5nPW9wdGlvbnMuZGVmYXVsdEVuY29kaW5nfHwidXRmOCI7dGhpcy5sZW5ndGg9MDt0aGlzLndyaXRpbmc9ZmFsc2U7dGhpcy5jb3JrZWQ9MDt0aGlzLnN5bmM9dHJ1ZTt0aGlzLmJ1ZmZlclByb2Nlc3Npbmc9ZmFsc2U7dGhpcy5vbndyaXRlPWZ1bmN0aW9uKGVyKXtvbndyaXRlKHN0cmVhbSxlcil9O3RoaXMud3JpdGVjYj1udWxsO3RoaXMud3JpdGVsZW49MDt0aGlzLmJ1ZmZlcmVkUmVxdWVzdD1udWxsO3RoaXMubGFzdEJ1ZmZlcmVkUmVxdWVzdD1udWxsO3RoaXMucGVuZGluZ2NiPTA7dGhpcy5wcmVmaW5pc2hlZD1mYWxzZTt0aGlzLmVycm9yRW1pdHRlZD1mYWxzZTt0aGlzLmJ1ZmZlcmVkUmVxdWVzdENvdW50PTA7dGhpcy5jb3JrZWRSZXF1ZXN0c0ZyZWU9bmV3IENvcmtlZFJlcXVlc3QodGhpcyl9V3JpdGFibGVTdGF0ZS5wcm90b3R5cGUuZ2V0QnVmZmVyPWZ1bmN0aW9uIGdldEJ1ZmZlcigpe3ZhciBjdXJyZW50PXRoaXMuYnVmZmVyZWRSZXF1ZXN0O3ZhciBvdXQ9W107d2hpbGUoY3VycmVudCl7b3V0LnB1c2goY3VycmVudCk7Y3VycmVudD1jdXJyZW50Lm5leHR9cmV0dXJuIG91dH07KGZ1bmN0aW9uKCl7dHJ5e09iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZVN0YXRlLnByb3RvdHlwZSwiYnVmZmVyIix7Z2V0OmludGVybmFsVXRpbC5kZXByZWNhdGUoZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRCdWZmZXIoKX0sIl93cml0YWJsZVN0YXRlLmJ1ZmZlciBpcyBkZXByZWNhdGVkLiBVc2UgX3dyaXRhYmxlU3RhdGUuZ2V0QnVmZmVyICIrImluc3RlYWQuIiwiREVQMDAwMyIpfSl9Y2F0Y2goXyl7fX0pKCk7dmFyIHJlYWxIYXNJbnN0YW5jZTtpZih0eXBlb2YgU3ltYm9sPT09ImZ1bmN0aW9uIiYmU3ltYm9sLmhhc0luc3RhbmNlJiZ0eXBlb2YgRnVuY3Rpb24ucHJvdG90eXBlW1N5bWJvbC5oYXNJbnN0YW5jZV09PT0iZnVuY3Rpb24iKXtyZWFsSGFzSW5zdGFuY2U9RnVuY3Rpb24ucHJvdG90eXBlW1N5bWJvbC5oYXNJbnN0YW5jZV07T2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLFN5bWJvbC5oYXNJbnN0YW5jZSx7dmFsdWU6ZnVuY3Rpb24ob2JqZWN0KXtpZihyZWFsSGFzSW5zdGFuY2UuY2FsbCh0aGlzLG9iamVjdCkpcmV0dXJuIHRydWU7aWYodGhpcyE9PVdyaXRhYmxlKXJldHVybiBmYWxzZTtyZXR1cm4gb2JqZWN0JiZvYmplY3QuX3dyaXRhYmxlU3RhdGUgaW5zdGFuY2VvZiBXcml0YWJsZVN0YXRlfX0pfWVsc2V7cmVhbEhhc0luc3RhbmNlPWZ1bmN0aW9uKG9iamVjdCl7cmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIHRoaXN9fWZ1bmN0aW9uIFdyaXRhYmxlKG9wdGlvbnMpe0R1cGxleD1EdXBsZXh8fHJlcXVpcmUoIi4vX3N0cmVhbV9kdXBsZXgiKTtpZighcmVhbEhhc0luc3RhbmNlLmNhbGwoV3JpdGFibGUsdGhpcykmJiEodGhpcyBpbnN0YW5jZW9mIER1cGxleCkpe3JldHVybiBuZXcgV3JpdGFibGUob3B0aW9ucyl9dGhpcy5fd3JpdGFibGVTdGF0ZT1uZXcgV3JpdGFibGVTdGF0ZShvcHRpb25zLHRoaXMpO3RoaXMud3JpdGFibGU9dHJ1ZTtpZihvcHRpb25zKXtpZih0eXBlb2Ygb3B0aW9ucy53cml0ZT09PSJmdW5jdGlvbiIpdGhpcy5fd3JpdGU9b3B0aW9ucy53cml0ZTtpZih0eXBlb2Ygb3B0aW9ucy53cml0ZXY9PT0iZnVuY3Rpb24iKXRoaXMuX3dyaXRldj1vcHRpb25zLndyaXRldjtpZih0eXBlb2Ygb3B0aW9ucy5kZXN0cm95PT09ImZ1bmN0aW9uIil0aGlzLl9kZXN0cm95PW9wdGlvbnMuZGVzdHJveTtpZih0eXBlb2Ygb3B0aW9ucy5maW5hbD09PSJmdW5jdGlvbiIpdGhpcy5fZmluYWw9b3B0aW9ucy5maW5hbH1TdHJlYW0uY2FsbCh0aGlzKX1Xcml0YWJsZS5wcm90b3R5cGUucGlwZT1mdW5jdGlvbigpe3RoaXMuZW1pdCgiZXJyb3IiLG5ldyBFcnJvcigiQ2Fubm90IHBpcGUsIG5vdCByZWFkYWJsZSIpKX07ZnVuY3Rpb24gd3JpdGVBZnRlckVuZChzdHJlYW0sY2Ipe3ZhciBlcj1uZXcgRXJyb3IoIndyaXRlIGFmdGVyIGVuZCIpO3N0cmVhbS5lbWl0KCJlcnJvciIsZXIpO3BuYS5uZXh0VGljayhjYixlcil9ZnVuY3Rpb24gdmFsaWRDaHVuayhzdHJlYW0sc3RhdGUsY2h1bmssY2Ipe3ZhciB2YWxpZD10cnVlO3ZhciBlcj1mYWxzZTtpZihjaHVuaz09PW51bGwpe2VyPW5ldyBUeXBlRXJyb3IoIk1heSBub3Qgd3JpdGUgbnVsbCB2YWx1ZXMgdG8gc3RyZWFtIil9ZWxzZSBpZih0eXBlb2YgY2h1bmshPT0ic3RyaW5nIiYmY2h1bmshPT11bmRlZmluZWQmJiFzdGF0ZS5vYmplY3RNb2RlKXtlcj1uZXcgVHlwZUVycm9yKCJJbnZhbGlkIG5vbi1zdHJpbmcvYnVmZmVyIGNodW5rIil9aWYoZXIpe3N0cmVhbS5lbWl0KCJlcnJvciIsZXIpO3BuYS5uZXh0VGljayhjYixlcik7dmFsaWQ9ZmFsc2V9cmV0dXJuIHZhbGlkfVdyaXRhYmxlLnByb3RvdHlwZS53cml0ZT1mdW5jdGlvbihjaHVuayxlbmNvZGluZyxjYil7dmFyIHN0YXRlPXRoaXMuX3dyaXRhYmxlU3RhdGU7dmFyIHJldD1mYWxzZTt2YXIgaXNCdWY9IXN0YXRlLm9iamVjdE1vZGUmJl9pc1VpbnQ4QXJyYXkoY2h1bmspO2lmKGlzQnVmJiYhQnVmZmVyLmlzQnVmZmVyKGNodW5rKSl7Y2h1bms9X3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuayl9aWYodHlwZW9mIGVuY29kaW5nPT09ImZ1bmN0aW9uIil7Y2I9ZW5jb2Rpbmc7ZW5jb2Rpbmc9bnVsbH1pZihpc0J1ZillbmNvZGluZz0iYnVmZmVyIjtlbHNlIGlmKCFlbmNvZGluZyllbmNvZGluZz1zdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7aWYodHlwZW9mIGNiIT09ImZ1bmN0aW9uIiljYj1ub3A7aWYoc3RhdGUuZW5kZWQpd3JpdGVBZnRlckVuZCh0aGlzLGNiKTtlbHNlIGlmKGlzQnVmfHx2YWxpZENodW5rKHRoaXMsc3RhdGUsY2h1bmssY2IpKXtzdGF0ZS5wZW5kaW5nY2IrKztyZXQ9d3JpdGVPckJ1ZmZlcih0aGlzLHN0YXRlLGlzQnVmLGNodW5rLGVuY29kaW5nLGNiKX1yZXR1cm4gcmV0fTtXcml0YWJsZS5wcm90b3R5cGUuY29yaz1mdW5jdGlvbigpe3ZhciBzdGF0ZT10aGlzLl93cml0YWJsZVN0YXRlO3N0YXRlLmNvcmtlZCsrfTtXcml0YWJsZS5wcm90b3R5cGUudW5jb3JrPWZ1bmN0aW9uKCl7dmFyIHN0YXRlPXRoaXMuX3dyaXRhYmxlU3RhdGU7aWYoc3RhdGUuY29ya2VkKXtzdGF0ZS5jb3JrZWQtLTtpZighc3RhdGUud3JpdGluZyYmIXN0YXRlLmNvcmtlZCYmIXN0YXRlLmZpbmlzaGVkJiYhc3RhdGUuYnVmZmVyUHJvY2Vzc2luZyYmc3RhdGUuYnVmZmVyZWRSZXF1ZXN0KWNsZWFyQnVmZmVyKHRoaXMsc3RhdGUpfX07V3JpdGFibGUucHJvdG90eXBlLnNldERlZmF1bHRFbmNvZGluZz1mdW5jdGlvbiBzZXREZWZhdWx0RW5jb2RpbmcoZW5jb2Rpbmcpe2lmKHR5cGVvZiBlbmNvZGluZz09PSJzdHJpbmciKWVuY29kaW5nPWVuY29kaW5nLnRvTG93ZXJDYXNlKCk7aWYoIShbImhleCIsInV0ZjgiLCJ1dGYtOCIsImFzY2lpIiwiYmluYXJ5IiwiYmFzZTY0IiwidWNzMiIsInVjcy0yIiwidXRmMTZsZSIsInV0Zi0xNmxlIiwicmF3Il0uaW5kZXhPZigoZW5jb2RpbmcrIiIpLnRvTG93ZXJDYXNlKCkpPi0xKSl0aHJvdyBuZXcgVHlwZUVycm9yKCJVbmtub3duIGVuY29kaW5nOiAiK2VuY29kaW5nKTt0aGlzLl93cml0YWJsZVN0YXRlLmRlZmF1bHRFbmNvZGluZz1lbmNvZGluZztyZXR1cm4gdGhpc307ZnVuY3Rpb24gZGVjb2RlQ2h1bmsoc3RhdGUsY2h1bmssZW5jb2Rpbmcpe2lmKCFzdGF0ZS5vYmplY3RNb2RlJiZzdGF0ZS5kZWNvZGVTdHJpbmdzIT09ZmFsc2UmJnR5cGVvZiBjaHVuaz09PSJzdHJpbmciKXtjaHVuaz1CdWZmZXIuZnJvbShjaHVuayxlbmNvZGluZyl9cmV0dXJuIGNodW5rfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZS5wcm90b3R5cGUsIndyaXRhYmxlSGlnaFdhdGVyTWFyayIse2VudW1lcmFibGU6ZmFsc2UsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUuaGlnaFdhdGVyTWFya319KTtmdW5jdGlvbiB3cml0ZU9yQnVmZmVyKHN0cmVhbSxzdGF0ZSxpc0J1ZixjaHVuayxlbmNvZGluZyxjYil7aWYoIWlzQnVmKXt2YXIgbmV3Q2h1bms9ZGVjb2RlQ2h1bmsoc3RhdGUsY2h1bmssZW5jb2RpbmcpO2lmKGNodW5rIT09bmV3Q2h1bmspe2lzQnVmPXRydWU7ZW5jb2Rpbmc9ImJ1ZmZlciI7Y2h1bms9bmV3Q2h1bmt9fXZhciBsZW49c3RhdGUub2JqZWN0TW9kZT8xOmNodW5rLmxlbmd0aDtzdGF0ZS5sZW5ndGgrPWxlbjt2YXIgcmV0PXN0YXRlLmxlbmd0aDxzdGF0ZS5oaWdoV2F0ZXJNYXJrO2lmKCFyZXQpc3RhdGUubmVlZERyYWluPXRydWU7aWYoc3RhdGUud3JpdGluZ3x8c3RhdGUuY29ya2VkKXt2YXIgbGFzdD1zdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0O3N0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q9e2NodW5rOmNodW5rLGVuY29kaW5nOmVuY29kaW5nLGlzQnVmOmlzQnVmLGNhbGxiYWNrOmNiLG5leHQ6bnVsbH07aWYobGFzdCl7bGFzdC5uZXh0PXN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3R9ZWxzZXtzdGF0ZS5idWZmZXJlZFJlcXVlc3Q9c3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdH1zdGF0ZS5idWZmZXJlZFJlcXVlc3RDb3VudCs9MX1lbHNle2RvV3JpdGUoc3RyZWFtLHN0YXRlLGZhbHNlLGxlbixjaHVuayxlbmNvZGluZyxjYil9cmV0dXJuIHJldH1mdW5jdGlvbiBkb1dyaXRlKHN0cmVhbSxzdGF0ZSx3cml0ZXYsbGVuLGNodW5rLGVuY29kaW5nLGNiKXtzdGF0ZS53cml0ZWxlbj1sZW47c3RhdGUud3JpdGVjYj1jYjtzdGF0ZS53cml0aW5nPXRydWU7c3RhdGUuc3luYz10cnVlO2lmKHdyaXRldilzdHJlYW0uX3dyaXRldihjaHVuayxzdGF0ZS5vbndyaXRlKTtlbHNlIHN0cmVhbS5fd3JpdGUoY2h1bmssZW5jb2Rpbmcsc3RhdGUub253cml0ZSk7c3RhdGUuc3luYz1mYWxzZX1mdW5jdGlvbiBvbndyaXRlRXJyb3Ioc3RyZWFtLHN0YXRlLHN5bmMsZXIsY2Ipey0tc3RhdGUucGVuZGluZ2NiO2lmKHN5bmMpe3BuYS5uZXh0VGljayhjYixlcik7cG5hLm5leHRUaWNrKGZpbmlzaE1heWJlLHN0cmVhbSxzdGF0ZSk7c3RyZWFtLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZD10cnVlO3N0cmVhbS5lbWl0KCJlcnJvciIsZXIpfWVsc2V7Y2IoZXIpO3N0cmVhbS5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQ9dHJ1ZTtzdHJlYW0uZW1pdCgiZXJyb3IiLGVyKTtmaW5pc2hNYXliZShzdHJlYW0sc3RhdGUpfX1mdW5jdGlvbiBvbndyaXRlU3RhdGVVcGRhdGUoc3RhdGUpe3N0YXRlLndyaXRpbmc9ZmFsc2U7c3RhdGUud3JpdGVjYj1udWxsO3N0YXRlLmxlbmd0aC09c3RhdGUud3JpdGVsZW47c3RhdGUud3JpdGVsZW49MH1mdW5jdGlvbiBvbndyaXRlKHN0cmVhbSxlcil7dmFyIHN0YXRlPXN0cmVhbS5fd3JpdGFibGVTdGF0ZTt2YXIgc3luYz1zdGF0ZS5zeW5jO3ZhciBjYj1zdGF0ZS53cml0ZWNiO29ud3JpdGVTdGF0ZVVwZGF0ZShzdGF0ZSk7aWYoZXIpb253cml0ZUVycm9yKHN0cmVhbSxzdGF0ZSxzeW5jLGVyLGNiKTtlbHNle3ZhciBmaW5pc2hlZD1uZWVkRmluaXNoKHN0YXRlKTtpZighZmluaXNoZWQmJiFzdGF0ZS5jb3JrZWQmJiFzdGF0ZS5idWZmZXJQcm9jZXNzaW5nJiZzdGF0ZS5idWZmZXJlZFJlcXVlc3Qpe2NsZWFyQnVmZmVyKHN0cmVhbSxzdGF0ZSl9aWYoc3luYyl7YXN5bmNXcml0ZShhZnRlcldyaXRlLHN0cmVhbSxzdGF0ZSxmaW5pc2hlZCxjYil9ZWxzZXthZnRlcldyaXRlKHN0cmVhbSxzdGF0ZSxmaW5pc2hlZCxjYil9fX1mdW5jdGlvbiBhZnRlcldyaXRlKHN0cmVhbSxzdGF0ZSxmaW5pc2hlZCxjYil7aWYoIWZpbmlzaGVkKW9ud3JpdGVEcmFpbihzdHJlYW0sc3RhdGUpO3N0YXRlLnBlbmRpbmdjYi0tO2NiKCk7ZmluaXNoTWF5YmUoc3RyZWFtLHN0YXRlKX1mdW5jdGlvbiBvbndyaXRlRHJhaW4oc3RyZWFtLHN0YXRlKXtpZihzdGF0ZS5sZW5ndGg9PT0wJiZzdGF0ZS5uZWVkRHJhaW4pe3N0YXRlLm5lZWREcmFpbj1mYWxzZTtzdHJlYW0uZW1pdCgiZHJhaW4iKX19ZnVuY3Rpb24gY2xlYXJCdWZmZXIoc3RyZWFtLHN0YXRlKXtzdGF0ZS5idWZmZXJQcm9jZXNzaW5nPXRydWU7dmFyIGVudHJ5PXN0YXRlLmJ1ZmZlcmVkUmVxdWVzdDtpZihzdHJlYW0uX3dyaXRldiYmZW50cnkmJmVudHJ5Lm5leHQpe3ZhciBsPXN0YXRlLmJ1ZmZlcmVkUmVxdWVzdENvdW50O3ZhciBidWZmZXI9bmV3IEFycmF5KGwpO3ZhciBob2xkZXI9c3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlO2hvbGRlci5lbnRyeT1lbnRyeTt2YXIgY291bnQ9MDt2YXIgYWxsQnVmZmVycz10cnVlO3doaWxlKGVudHJ5KXtidWZmZXJbY291bnRdPWVudHJ5O2lmKCFlbnRyeS5pc0J1ZilhbGxCdWZmZXJzPWZhbHNlO2VudHJ5PWVudHJ5Lm5leHQ7Y291bnQrPTF9YnVmZmVyLmFsbEJ1ZmZlcnM9YWxsQnVmZmVycztkb1dyaXRlKHN0cmVhbSxzdGF0ZSx0cnVlLHN0YXRlLmxlbmd0aCxidWZmZXIsIiIsaG9sZGVyLmZpbmlzaCk7c3RhdGUucGVuZGluZ2NiKys7c3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdD1udWxsO2lmKGhvbGRlci5uZXh0KXtzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWU9aG9sZGVyLm5leHQ7aG9sZGVyLm5leHQ9bnVsbH1lbHNle3N0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZT1uZXcgQ29ya2VkUmVxdWVzdChzdGF0ZSl9c3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQ9MH1lbHNle3doaWxlKGVudHJ5KXt2YXIgY2h1bms9ZW50cnkuY2h1bms7dmFyIGVuY29kaW5nPWVudHJ5LmVuY29kaW5nO3ZhciBjYj1lbnRyeS5jYWxsYmFjazt2YXIgbGVuPXN0YXRlLm9iamVjdE1vZGU/MTpjaHVuay5sZW5ndGg7ZG9Xcml0ZShzdHJlYW0sc3RhdGUsZmFsc2UsbGVuLGNodW5rLGVuY29kaW5nLGNiKTtlbnRyeT1lbnRyeS5uZXh0O3N0YXRlLmJ1ZmZlcmVkUmVxdWVzdENvdW50LS07aWYoc3RhdGUud3JpdGluZyl7YnJlYWt9fWlmKGVudHJ5PT09bnVsbClzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0PW51bGx9c3RhdGUuYnVmZmVyZWRSZXF1ZXN0PWVudHJ5O3N0YXRlLmJ1ZmZlclByb2Nlc3Npbmc9ZmFsc2V9V3JpdGFibGUucHJvdG90eXBlLl93cml0ZT1mdW5jdGlvbihjaHVuayxlbmNvZGluZyxjYil7Y2IobmV3IEVycm9yKCJfd3JpdGUoKSBpcyBub3QgaW1wbGVtZW50ZWQiKSl9O1dyaXRhYmxlLnByb3RvdHlwZS5fd3JpdGV2PW51bGw7V3JpdGFibGUucHJvdG90eXBlLmVuZD1mdW5jdGlvbihjaHVuayxlbmNvZGluZyxjYil7dmFyIHN0YXRlPXRoaXMuX3dyaXRhYmxlU3RhdGU7aWYodHlwZW9mIGNodW5rPT09ImZ1bmN0aW9uIil7Y2I9Y2h1bms7Y2h1bms9bnVsbDtlbmNvZGluZz1udWxsfWVsc2UgaWYodHlwZW9mIGVuY29kaW5nPT09ImZ1bmN0aW9uIil7Y2I9ZW5jb2Rpbmc7ZW5jb2Rpbmc9bnVsbH1pZihjaHVuayE9PW51bGwmJmNodW5rIT09dW5kZWZpbmVkKXRoaXMud3JpdGUoY2h1bmssZW5jb2RpbmcpO2lmKHN0YXRlLmNvcmtlZCl7c3RhdGUuY29ya2VkPTE7dGhpcy51bmNvcmsoKX1pZighc3RhdGUuZW5kaW5nJiYhc3RhdGUuZmluaXNoZWQpZW5kV3JpdGFibGUodGhpcyxzdGF0ZSxjYil9O2Z1bmN0aW9uIG5lZWRGaW5pc2goc3RhdGUpe3JldHVybiBzdGF0ZS5lbmRpbmcmJnN0YXRlLmxlbmd0aD09PTAmJnN0YXRlLmJ1ZmZlcmVkUmVxdWVzdD09PW51bGwmJiFzdGF0ZS5maW5pc2hlZCYmIXN0YXRlLndyaXRpbmd9ZnVuY3Rpb24gY2FsbEZpbmFsKHN0cmVhbSxzdGF0ZSl7c3RyZWFtLl9maW5hbChmdW5jdGlvbihlcnIpe3N0YXRlLnBlbmRpbmdjYi0tO2lmKGVycil7c3RyZWFtLmVtaXQoImVycm9yIixlcnIpfXN0YXRlLnByZWZpbmlzaGVkPXRydWU7c3RyZWFtLmVtaXQoInByZWZpbmlzaCIpO2ZpbmlzaE1heWJlKHN0cmVhbSxzdGF0ZSl9KX1mdW5jdGlvbiBwcmVmaW5pc2goc3RyZWFtLHN0YXRlKXtpZighc3RhdGUucHJlZmluaXNoZWQmJiFzdGF0ZS5maW5hbENhbGxlZCl7aWYodHlwZW9mIHN0cmVhbS5fZmluYWw9PT0iZnVuY3Rpb24iKXtzdGF0ZS5wZW5kaW5nY2IrKztzdGF0ZS5maW5hbENhbGxlZD10cnVlO3BuYS5uZXh0VGljayhjYWxsRmluYWwsc3RyZWFtLHN0YXRlKX1lbHNle3N0YXRlLnByZWZpbmlzaGVkPXRydWU7c3RyZWFtLmVtaXQoInByZWZpbmlzaCIpfX19ZnVuY3Rpb24gZmluaXNoTWF5YmUoc3RyZWFtLHN0YXRlKXt2YXIgbmVlZD1uZWVkRmluaXNoKHN0YXRlKTtpZihuZWVkKXtwcmVmaW5pc2goc3RyZWFtLHN0YXRlKTtpZihzdGF0ZS5wZW5kaW5nY2I9PT0wKXtzdGF0ZS5maW5pc2hlZD10cnVlO3N0cmVhbS5lbWl0KCJmaW5pc2giKX19cmV0dXJuIG5lZWR9ZnVuY3Rpb24gZW5kV3JpdGFibGUoc3RyZWFtLHN0YXRlLGNiKXtzdGF0ZS5lbmRpbmc9dHJ1ZTtmaW5pc2hNYXliZShzdHJlYW0sc3RhdGUpO2lmKGNiKXtpZihzdGF0ZS5maW5pc2hlZClwbmEubmV4dFRpY2soY2IpO2Vsc2Ugc3RyZWFtLm9uY2UoImZpbmlzaCIsY2IpfXN0YXRlLmVuZGVkPXRydWU7c3RyZWFtLndyaXRhYmxlPWZhbHNlfWZ1bmN0aW9uIG9uQ29ya2VkRmluaXNoKGNvcmtSZXEsc3RhdGUsZXJyKXt2YXIgZW50cnk9Y29ya1JlcS5lbnRyeTtjb3JrUmVxLmVudHJ5PW51bGw7d2hpbGUoZW50cnkpe3ZhciBjYj1lbnRyeS5jYWxsYmFjaztzdGF0ZS5wZW5kaW5nY2ItLTtjYihlcnIpO2VudHJ5PWVudHJ5Lm5leHR9aWYoc3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlKXtzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWUubmV4dD1jb3JrUmVxfWVsc2V7c3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlPWNvcmtSZXF9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0YWJsZS5wcm90b3R5cGUsImRlc3Ryb3llZCIse2dldDpmdW5jdGlvbigpe2lmKHRoaXMuX3dyaXRhYmxlU3RhdGU9PT11bmRlZmluZWQpe3JldHVybiBmYWxzZX1yZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWR9LHNldDpmdW5jdGlvbih2YWx1ZSl7aWYoIXRoaXMuX3dyaXRhYmxlU3RhdGUpe3JldHVybn10aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZD12YWx1ZX19KTtXcml0YWJsZS5wcm90b3R5cGUuZGVzdHJveT1kZXN0cm95SW1wbC5kZXN0cm95O1dyaXRhYmxlLnByb3RvdHlwZS5fdW5kZXN0cm95PWRlc3Ryb3lJbXBsLnVuZGVzdHJveTtXcml0YWJsZS5wcm90b3R5cGUuX2Rlc3Ryb3k9ZnVuY3Rpb24oZXJyLGNiKXt0aGlzLmVuZCgpO2NiKGVycil9fSkuY2FsbCh0aGlzLHJlcXVpcmUoIl9wcm9jZXNzIiksdHlwZW9mIGdsb2JhbCE9PSJ1bmRlZmluZWQiP2dsb2JhbDp0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiP3dpbmRvdzp7fSxyZXF1aXJlKCJ0aW1lcnMiKS5zZXRJbW1lZGlhdGUpfSx7Ii4vX3N0cmVhbV9kdXBsZXgiOjY2LCIuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveSI6NzIsIi4vaW50ZXJuYWwvc3RyZWFtcy9zdHJlYW0iOjczLF9wcm9jZXNzOjY0LCJjb3JlLXV0aWwtaXMiOjMwLGluaGVyaXRzOjM2LCJwcm9jZXNzLW5leHRpY2stYXJncyI6NjMsInNhZmUtYnVmZmVyIjo3OSx0aW1lcnM6MTAwLCJ1dGlsLWRlcHJlY2F0ZSI6MTAxfV0sNzE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0IjtmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsQ29uc3RydWN0b3Ipe2lmKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3Rvcikpe3Rocm93IG5ldyBUeXBlRXJyb3IoIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbiIpfX12YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciB1dGlsPXJlcXVpcmUoInV0aWwiKTtmdW5jdGlvbiBjb3B5QnVmZmVyKHNyYyx0YXJnZXQsb2Zmc2V0KXtzcmMuY29weSh0YXJnZXQsb2Zmc2V0KX1tb2R1bGUuZXhwb3J0cz1mdW5jdGlvbigpe2Z1bmN0aW9uIEJ1ZmZlckxpc3QoKXtfY2xhc3NDYWxsQ2hlY2sodGhpcyxCdWZmZXJMaXN0KTt0aGlzLmhlYWQ9bnVsbDt0aGlzLnRhaWw9bnVsbDt0aGlzLmxlbmd0aD0wfUJ1ZmZlckxpc3QucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24gcHVzaCh2KXt2YXIgZW50cnk9e2RhdGE6dixuZXh0Om51bGx9O2lmKHRoaXMubGVuZ3RoPjApdGhpcy50YWlsLm5leHQ9ZW50cnk7ZWxzZSB0aGlzLmhlYWQ9ZW50cnk7dGhpcy50YWlsPWVudHJ5OysrdGhpcy5sZW5ndGh9O0J1ZmZlckxpc3QucHJvdG90eXBlLnVuc2hpZnQ9ZnVuY3Rpb24gdW5zaGlmdCh2KXt2YXIgZW50cnk9e2RhdGE6dixuZXh0OnRoaXMuaGVhZH07aWYodGhpcy5sZW5ndGg9PT0wKXRoaXMudGFpbD1lbnRyeTt0aGlzLmhlYWQ9ZW50cnk7Kyt0aGlzLmxlbmd0aH07QnVmZmVyTGlzdC5wcm90b3R5cGUuc2hpZnQ9ZnVuY3Rpb24gc2hpZnQoKXtpZih0aGlzLmxlbmd0aD09PTApcmV0dXJuO3ZhciByZXQ9dGhpcy5oZWFkLmRhdGE7aWYodGhpcy5sZW5ndGg9PT0xKXRoaXMuaGVhZD10aGlzLnRhaWw9bnVsbDtlbHNlIHRoaXMuaGVhZD10aGlzLmhlYWQubmV4dDstLXRoaXMubGVuZ3RoO3JldHVybiByZXR9O0J1ZmZlckxpc3QucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uIGNsZWFyKCl7dGhpcy5oZWFkPXRoaXMudGFpbD1udWxsO3RoaXMubGVuZ3RoPTB9O0J1ZmZlckxpc3QucHJvdG90eXBlLmpvaW49ZnVuY3Rpb24gam9pbihzKXtpZih0aGlzLmxlbmd0aD09PTApcmV0dXJuIiI7dmFyIHA9dGhpcy5oZWFkO3ZhciByZXQ9IiIrcC5kYXRhO3doaWxlKHA9cC5uZXh0KXtyZXQrPXMrcC5kYXRhfXJldHVybiByZXR9O0J1ZmZlckxpc3QucHJvdG90eXBlLmNvbmNhdD1mdW5jdGlvbiBjb25jYXQobil7aWYodGhpcy5sZW5ndGg9PT0wKXJldHVybiBCdWZmZXIuYWxsb2MoMCk7aWYodGhpcy5sZW5ndGg9PT0xKXJldHVybiB0aGlzLmhlYWQuZGF0YTt2YXIgcmV0PUJ1ZmZlci5hbGxvY1Vuc2FmZShuPj4+MCk7dmFyIHA9dGhpcy5oZWFkO3ZhciBpPTA7d2hpbGUocCl7Y29weUJ1ZmZlcihwLmRhdGEscmV0LGkpO2krPXAuZGF0YS5sZW5ndGg7cD1wLm5leHR9cmV0dXJuIHJldH07cmV0dXJuIEJ1ZmZlckxpc3R9KCk7aWYodXRpbCYmdXRpbC5pbnNwZWN0JiZ1dGlsLmluc3BlY3QuY3VzdG9tKXttb2R1bGUuZXhwb3J0cy5wcm90b3R5cGVbdXRpbC5pbnNwZWN0LmN1c3RvbV09ZnVuY3Rpb24oKXt2YXIgb2JqPXV0aWwuaW5zcGVjdCh7bGVuZ3RoOnRoaXMubGVuZ3RofSk7cmV0dXJuIHRoaXMuY29uc3RydWN0b3IubmFtZSsiICIrb2JqfX19LHsic2FmZS1idWZmZXIiOjc5LHV0aWw6MjZ9XSw3MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO3ZhciBwbmE9cmVxdWlyZSgicHJvY2Vzcy1uZXh0aWNrLWFyZ3MiKTtmdW5jdGlvbiBkZXN0cm95KGVycixjYil7dmFyIF90aGlzPXRoaXM7dmFyIHJlYWRhYmxlRGVzdHJveWVkPXRoaXMuX3JlYWRhYmxlU3RhdGUmJnRoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkO3ZhciB3cml0YWJsZURlc3Ryb3llZD10aGlzLl93cml0YWJsZVN0YXRlJiZ0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZDtpZihyZWFkYWJsZURlc3Ryb3llZHx8d3JpdGFibGVEZXN0cm95ZWQpe2lmKGNiKXtjYihlcnIpfWVsc2UgaWYoZXJyJiYoIXRoaXMuX3dyaXRhYmxlU3RhdGV8fCF0aGlzLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZCkpe3BuYS5uZXh0VGljayhlbWl0RXJyb3JOVCx0aGlzLGVycil9cmV0dXJuIHRoaXN9aWYodGhpcy5fcmVhZGFibGVTdGF0ZSl7dGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQ9dHJ1ZX1pZih0aGlzLl93cml0YWJsZVN0YXRlKXt0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZD10cnVlfXRoaXMuX2Rlc3Ryb3koZXJyfHxudWxsLGZ1bmN0aW9uKGVycil7aWYoIWNiJiZlcnIpe3BuYS5uZXh0VGljayhlbWl0RXJyb3JOVCxfdGhpcyxlcnIpO2lmKF90aGlzLl93cml0YWJsZVN0YXRlKXtfdGhpcy5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQ9dHJ1ZX19ZWxzZSBpZihjYil7Y2IoZXJyKX19KTtyZXR1cm4gdGhpc31mdW5jdGlvbiB1bmRlc3Ryb3koKXtpZih0aGlzLl9yZWFkYWJsZVN0YXRlKXt0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZD1mYWxzZTt0aGlzLl9yZWFkYWJsZVN0YXRlLnJlYWRpbmc9ZmFsc2U7dGhpcy5fcmVhZGFibGVTdGF0ZS5lbmRlZD1mYWxzZTt0aGlzLl9yZWFkYWJsZVN0YXRlLmVuZEVtaXR0ZWQ9ZmFsc2V9aWYodGhpcy5fd3JpdGFibGVTdGF0ZSl7dGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQ9ZmFsc2U7dGhpcy5fd3JpdGFibGVTdGF0ZS5lbmRlZD1mYWxzZTt0aGlzLl93cml0YWJsZVN0YXRlLmVuZGluZz1mYWxzZTt0aGlzLl93cml0YWJsZVN0YXRlLmZpbmlzaGVkPWZhbHNlO3RoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkPWZhbHNlfX1mdW5jdGlvbiBlbWl0RXJyb3JOVChzZWxmLGVycil7c2VsZi5lbWl0KCJlcnJvciIsZXJyKX1tb2R1bGUuZXhwb3J0cz17ZGVzdHJveTpkZXN0cm95LHVuZGVzdHJveTp1bmRlc3Ryb3l9fSx7InByb2Nlc3MtbmV4dGljay1hcmdzIjo2M31dLDczOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1yZXF1aXJlKCJldmVudHMiKS5FdmVudEVtaXR0ZXJ9LHtldmVudHM6MzN9XSw3NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgiLi9yZWFkYWJsZSIpLlBhc3NUaHJvdWdofSx7Ii4vcmVhZGFibGUiOjc1fV0sNzU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe2V4cG9ydHM9bW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgiLi9saWIvX3N0cmVhbV9yZWFkYWJsZS5qcyIpO2V4cG9ydHMuU3RyZWFtPWV4cG9ydHM7ZXhwb3J0cy5SZWFkYWJsZT1leHBvcnRzO2V4cG9ydHMuV3JpdGFibGU9cmVxdWlyZSgiLi9saWIvX3N0cmVhbV93cml0YWJsZS5qcyIpO2V4cG9ydHMuRHVwbGV4PXJlcXVpcmUoIi4vbGliL19zdHJlYW1fZHVwbGV4LmpzIik7ZXhwb3J0cy5UcmFuc2Zvcm09cmVxdWlyZSgiLi9saWIvX3N0cmVhbV90cmFuc2Zvcm0uanMiKTtleHBvcnRzLlBhc3NUaHJvdWdoPXJlcXVpcmUoIi4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanMiKX0seyIuL2xpYi9fc3RyZWFtX2R1cGxleC5qcyI6NjYsIi4vbGliL19zdHJlYW1fcGFzc3Rocm91Z2guanMiOjY3LCIuL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzIjo2OCwiLi9saWIvX3N0cmVhbV90cmFuc2Zvcm0uanMiOjY5LCIuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzIjo3MH1dLDc2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1yZXF1aXJlKCIuL3JlYWRhYmxlIikuVHJhbnNmb3JtfSx7Ii4vcmVhZGFibGUiOjc1fV0sNzc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXJlcXVpcmUoIi4vbGliL19zdHJlYW1fd3JpdGFibGUuanMiKX0seyIuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzIjo3MH1dLDc4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJidWZmZXIiKS5CdWZmZXI7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIEhhc2hCYXNlPXJlcXVpcmUoImhhc2gtYmFzZSIpO3ZhciBBUlJBWTE2PW5ldyBBcnJheSgxNik7dmFyIHpsPVswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDcsNCwxMywxLDEwLDYsMTUsMywxMiwwLDksNSwyLDE0LDExLDgsMywxMCwxNCw0LDksMTUsOCwxLDIsNywwLDYsMTMsMTEsNSwxMiwxLDksMTEsMTAsMCw4LDEyLDQsMTMsMyw3LDE1LDE0LDUsNiwyLDQsMCw1LDksNywxMiwyLDEwLDE0LDEsMyw4LDExLDYsMTUsMTNdO3ZhciB6cj1bNSwxNCw3LDAsOSwyLDExLDQsMTMsNiwxNSw4LDEsMTAsMywxMiw2LDExLDMsNywwLDEzLDUsMTAsMTQsMTUsOCwxMiw0LDksMSwyLDE1LDUsMSwzLDcsMTQsNiw5LDExLDgsMTIsMiwxMCwwLDQsMTMsOCw2LDQsMSwzLDExLDE1LDAsNSwxMiwyLDEzLDksNywxMCwxNCwxMiwxNSwxMCw0LDEsNSw4LDcsNiwyLDEzLDE0LDAsMyw5LDExXTt2YXIgc2w9WzExLDE0LDE1LDEyLDUsOCw3LDksMTEsMTMsMTQsMTUsNiw3LDksOCw3LDYsOCwxMywxMSw5LDcsMTUsNywxMiwxNSw5LDExLDcsMTMsMTIsMTEsMTMsNiw3LDE0LDksMTMsMTUsMTQsOCwxMyw2LDUsMTIsNyw1LDExLDEyLDE0LDE1LDE0LDE1LDksOCw5LDE0LDUsNiw4LDYsNSwxMiw5LDE1LDUsMTEsNiw4LDEzLDEyLDUsMTIsMTMsMTQsMTEsOCw1LDZdO3ZhciBzcj1bOCw5LDksMTEsMTMsMTUsMTUsNSw3LDcsOCwxMSwxNCwxNCwxMiw2LDksMTMsMTUsNywxMiw4LDksMTEsNyw3LDEyLDcsNiwxNSwxMywxMSw5LDcsMTUsMTEsOCw2LDYsMTQsMTIsMTMsNSwxNCwxMywxMyw3LDUsMTUsNSw4LDExLDE0LDE0LDYsMTQsNiw5LDEyLDksMTIsNSwxNSw4LDgsNSwxMiw5LDEyLDUsMTQsNiw4LDEzLDYsNSwxNSwxMywxMSwxMV07dmFyIGhsPVswLDE1MTg1MDAyNDksMTg1OTc3NTM5MywyNDAwOTU5NzA4LDI4NDA4NTM4MzhdO3ZhciBocj1bMTM1MjgyOTkyNiwxNTQ4NjAzNjg0LDE4MzYwNzI2OTEsMjA1Mzk5NDIxNywwXTtmdW5jdGlvbiBSSVBFTUQxNjAoKXtIYXNoQmFzZS5jYWxsKHRoaXMsNjQpO3RoaXMuX2E9MTczMjU4NDE5Mzt0aGlzLl9iPTQwMjMyMzM0MTc7dGhpcy5fYz0yNTYyMzgzMTAyO3RoaXMuX2Q9MjcxNzMzODc4O3RoaXMuX2U9MzI4NTM3NzUyMH1pbmhlcml0cyhSSVBFTUQxNjAsSGFzaEJhc2UpO1JJUEVNRDE2MC5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbigpe3ZhciB3b3Jkcz1BUlJBWTE2O2Zvcih2YXIgaj0wO2o8MTY7KytqKXdvcmRzW2pdPXRoaXMuX2Jsb2NrLnJlYWRJbnQzMkxFKGoqNCk7dmFyIGFsPXRoaXMuX2F8MDt2YXIgYmw9dGhpcy5fYnwwO3ZhciBjbD10aGlzLl9jfDA7dmFyIGRsPXRoaXMuX2R8MDt2YXIgZWw9dGhpcy5fZXwwO3ZhciBhcj10aGlzLl9hfDA7dmFyIGJyPXRoaXMuX2J8MDt2YXIgY3I9dGhpcy5fY3wwO3ZhciBkcj10aGlzLl9kfDA7dmFyIGVyPXRoaXMuX2V8MDtmb3IodmFyIGk9MDtpPDgwO2krPTEpe3ZhciB0bDt2YXIgdHI7aWYoaTwxNil7dGw9Zm4xKGFsLGJsLGNsLGRsLGVsLHdvcmRzW3psW2ldXSxobFswXSxzbFtpXSk7dHI9Zm41KGFyLGJyLGNyLGRyLGVyLHdvcmRzW3pyW2ldXSxoclswXSxzcltpXSl9ZWxzZSBpZihpPDMyKXt0bD1mbjIoYWwsYmwsY2wsZGwsZWwsd29yZHNbemxbaV1dLGhsWzFdLHNsW2ldKTt0cj1mbjQoYXIsYnIsY3IsZHIsZXIsd29yZHNbenJbaV1dLGhyWzFdLHNyW2ldKX1lbHNlIGlmKGk8NDgpe3RsPWZuMyhhbCxibCxjbCxkbCxlbCx3b3Jkc1t6bFtpXV0saGxbMl0sc2xbaV0pO3RyPWZuMyhhcixicixjcixkcixlcix3b3Jkc1t6cltpXV0saHJbMl0sc3JbaV0pfWVsc2UgaWYoaTw2NCl7dGw9Zm40KGFsLGJsLGNsLGRsLGVsLHdvcmRzW3psW2ldXSxobFszXSxzbFtpXSk7dHI9Zm4yKGFyLGJyLGNyLGRyLGVyLHdvcmRzW3pyW2ldXSxoclszXSxzcltpXSl9ZWxzZXt0bD1mbjUoYWwsYmwsY2wsZGwsZWwsd29yZHNbemxbaV1dLGhsWzRdLHNsW2ldKTt0cj1mbjEoYXIsYnIsY3IsZHIsZXIsd29yZHNbenJbaV1dLGhyWzRdLHNyW2ldKX1hbD1lbDtlbD1kbDtkbD1yb3RsKGNsLDEwKTtjbD1ibDtibD10bDthcj1lcjtlcj1kcjtkcj1yb3RsKGNyLDEwKTtjcj1icjticj10cn12YXIgdD10aGlzLl9iK2NsK2RyfDA7dGhpcy5fYj10aGlzLl9jK2RsK2VyfDA7dGhpcy5fYz10aGlzLl9kK2VsK2FyfDA7dGhpcy5fZD10aGlzLl9lK2FsK2JyfDA7dGhpcy5fZT10aGlzLl9hK2JsK2NyfDA7dGhpcy5fYT10fTtSSVBFTUQxNjAucHJvdG90eXBlLl9kaWdlc3Q9ZnVuY3Rpb24oKXt0aGlzLl9ibG9ja1t0aGlzLl9ibG9ja09mZnNldCsrXT0xMjg7aWYodGhpcy5fYmxvY2tPZmZzZXQ+NTYpe3RoaXMuX2Jsb2NrLmZpbGwoMCx0aGlzLl9ibG9ja09mZnNldCw2NCk7dGhpcy5fdXBkYXRlKCk7dGhpcy5fYmxvY2tPZmZzZXQ9MH10aGlzLl9ibG9jay5maWxsKDAsdGhpcy5fYmxvY2tPZmZzZXQsNTYpO3RoaXMuX2Jsb2NrLndyaXRlVUludDMyTEUodGhpcy5fbGVuZ3RoWzBdLDU2KTt0aGlzLl9ibG9jay53cml0ZVVJbnQzMkxFKHRoaXMuX2xlbmd0aFsxXSw2MCk7dGhpcy5fdXBkYXRlKCk7dmFyIGJ1ZmZlcj1CdWZmZXIuYWxsb2M/QnVmZmVyLmFsbG9jKDIwKTpuZXcgQnVmZmVyKDIwKTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2EsMCk7YnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9iLDQpO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fYyw4KTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2QsMTIpO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fZSwxNik7cmV0dXJuIGJ1ZmZlcn07ZnVuY3Rpb24gcm90bCh4LG4pe3JldHVybiB4PDxufHg+Pj4zMi1ufWZ1bmN0aW9uIGZuMShhLGIsYyxkLGUsbSxrLHMpe3JldHVybiByb3RsKGErKGJeY15kKSttK2t8MCxzKStlfDB9ZnVuY3Rpb24gZm4yKGEsYixjLGQsZSxtLGsscyl7cmV0dXJuIHJvdGwoYSsoYiZjfH5iJmQpK20ra3wwLHMpK2V8MH1mdW5jdGlvbiBmbjMoYSxiLGMsZCxlLG0sayxzKXtyZXR1cm4gcm90bChhKygoYnx+YyleZCkrbStrfDAscykrZXwwfWZ1bmN0aW9uIGZuNChhLGIsYyxkLGUsbSxrLHMpe3JldHVybiByb3RsKGErKGImZHxjJn5kKSttK2t8MCxzKStlfDB9ZnVuY3Rpb24gZm41KGEsYixjLGQsZSxtLGsscyl7cmV0dXJuIHJvdGwoYSsoYl4oY3x+ZCkpK20ra3wwLHMpK2V8MH1tb2R1bGUuZXhwb3J0cz1SSVBFTUQxNjB9LHtidWZmZXI6MjcsImhhc2gtYmFzZSI6MzQsaW5oZXJpdHM6MzZ9XSw3OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGJ1ZmZlcj1yZXF1aXJlKCJidWZmZXIiKTt2YXIgQnVmZmVyPWJ1ZmZlci5CdWZmZXI7ZnVuY3Rpb24gY29weVByb3BzKHNyYyxkc3Qpe2Zvcih2YXIga2V5IGluIHNyYyl7ZHN0W2tleV09c3JjW2tleV19fWlmKEJ1ZmZlci5mcm9tJiZCdWZmZXIuYWxsb2MmJkJ1ZmZlci5hbGxvY1Vuc2FmZSYmQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyl7bW9kdWxlLmV4cG9ydHM9YnVmZmVyfWVsc2V7Y29weVByb3BzKGJ1ZmZlcixleHBvcnRzKTtleHBvcnRzLkJ1ZmZlcj1TYWZlQnVmZmVyfWZ1bmN0aW9uIFNhZmVCdWZmZXIoYXJnLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtyZXR1cm4gQnVmZmVyKGFyZyxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9Y29weVByb3BzKEJ1ZmZlcixTYWZlQnVmZmVyKTtTYWZlQnVmZmVyLmZyb209ZnVuY3Rpb24oYXJnLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtpZih0eXBlb2YgYXJnPT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoIkFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyIil9cmV0dXJuIEJ1ZmZlcihhcmcsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpfTtTYWZlQnVmZmVyLmFsbG9jPWZ1bmN0aW9uKHNpemUsZmlsbCxlbmNvZGluZyl7aWYodHlwZW9mIHNpemUhPT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlciIpfXZhciBidWY9QnVmZmVyKHNpemUpO2lmKGZpbGwhPT11bmRlZmluZWQpe2lmKHR5cGVvZiBlbmNvZGluZz09PSJzdHJpbmciKXtidWYuZmlsbChmaWxsLGVuY29kaW5nKX1lbHNle2J1Zi5maWxsKGZpbGwpfX1lbHNle2J1Zi5maWxsKDApfXJldHVybiBidWZ9O1NhZmVCdWZmZXIuYWxsb2NVbnNhZmU9ZnVuY3Rpb24oc2l6ZSl7aWYodHlwZW9mIHNpemUhPT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlciIpfXJldHVybiBCdWZmZXIoc2l6ZSl9O1NhZmVCdWZmZXIuYWxsb2NVbnNhZmVTbG93PWZ1bmN0aW9uKHNpemUpe2lmKHR5cGVvZiBzaXplIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoIkFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXIiKX1yZXR1cm4gYnVmZmVyLlNsb3dCdWZmZXIoc2l6ZSl9fSx7YnVmZmVyOjI3fV0sODA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihwcm9jZXNzKXsidXNlIHN0cmljdCI7dmFyIGJ1ZmZlcj1yZXF1aXJlKCJidWZmZXIiKTt2YXIgQnVmZmVyPWJ1ZmZlci5CdWZmZXI7dmFyIHNhZmVyPXt9O3ZhciBrZXk7Zm9yKGtleSBpbiBidWZmZXIpe2lmKCFidWZmZXIuaGFzT3duUHJvcGVydHkoa2V5KSljb250aW51ZTtpZihrZXk9PT0iU2xvd0J1ZmZlciJ8fGtleT09PSJCdWZmZXIiKWNvbnRpbnVlO3NhZmVyW2tleV09YnVmZmVyW2tleV19dmFyIFNhZmVyPXNhZmVyLkJ1ZmZlcj17fTtmb3Ioa2V5IGluIEJ1ZmZlcil7aWYoIUJ1ZmZlci5oYXNPd25Qcm9wZXJ0eShrZXkpKWNvbnRpbnVlO2lmKGtleT09PSJhbGxvY1Vuc2FmZSJ8fGtleT09PSJhbGxvY1Vuc2FmZVNsb3ciKWNvbnRpbnVlO1NhZmVyW2tleV09QnVmZmVyW2tleV19c2FmZXIuQnVmZmVyLnByb3RvdHlwZT1CdWZmZXIucHJvdG90eXBlO2lmKCFTYWZlci5mcm9tfHxTYWZlci5mcm9tPT09VWludDhBcnJheS5mcm9tKXtTYWZlci5mcm9tPWZ1bmN0aW9uKHZhbHVlLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtpZih0eXBlb2YgdmFsdWU9PT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlICJ2YWx1ZSIgYXJndW1lbnQgbXVzdCBub3QgYmUgb2YgdHlwZSBudW1iZXIuIFJlY2VpdmVkIHR5cGUgJyt0eXBlb2YgdmFsdWUpfWlmKHZhbHVlJiZ0eXBlb2YgdmFsdWUubGVuZ3RoPT09InVuZGVmaW5lZCIpe3Rocm93IG5ldyBUeXBlRXJyb3IoIlRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksIG9yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICIrdHlwZW9mIHZhbHVlKX1yZXR1cm4gQnVmZmVyKHZhbHVlLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX19aWYoIVNhZmVyLmFsbG9jKXtTYWZlci5hbGxvYz1mdW5jdGlvbihzaXplLGZpbGwsZW5jb2Rpbmcpe2lmKHR5cGVvZiBzaXplIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSAic2l6ZSIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSAnK3R5cGVvZiBzaXplKX1pZihzaXplPDB8fHNpemU+PTIqKDE8PDMwKSl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSAiJytzaXplKyciIGlzIGludmFsaWQgZm9yIG9wdGlvbiAic2l6ZSInKX12YXIgYnVmPUJ1ZmZlcihzaXplKTtpZighZmlsbHx8ZmlsbC5sZW5ndGg9PT0wKXtidWYuZmlsbCgwKX1lbHNlIGlmKHR5cGVvZiBlbmNvZGluZz09PSJzdHJpbmciKXtidWYuZmlsbChmaWxsLGVuY29kaW5nKX1lbHNle2J1Zi5maWxsKGZpbGwpfXJldHVybiBidWZ9fWlmKCFzYWZlci5rU3RyaW5nTWF4TGVuZ3RoKXt0cnl7c2FmZXIua1N0cmluZ01heExlbmd0aD1wcm9jZXNzLmJpbmRpbmcoImJ1ZmZlciIpLmtTdHJpbmdNYXhMZW5ndGh9Y2F0Y2goZSl7fX1pZighc2FmZXIuY29uc3RhbnRzKXtzYWZlci5jb25zdGFudHM9e01BWF9MRU5HVEg6c2FmZXIua01heExlbmd0aH07aWYoc2FmZXIua1N0cmluZ01heExlbmd0aCl7c2FmZXIuY29uc3RhbnRzLk1BWF9TVFJJTkdfTEVOR1RIPXNhZmVyLmtTdHJpbmdNYXhMZW5ndGh9fW1vZHVsZS5leHBvcnRzPXNhZmVyfSkuY2FsbCh0aGlzLHJlcXVpcmUoIl9wcm9jZXNzIikpfSx7X3Byb2Nlc3M6NjQsYnVmZmVyOjI3fV0sODE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBwYmtkZjI9cmVxdWlyZSgicGJrZGYyIik7dmFyIE1BWF9WQUxVRT0yMTQ3NDgzNjQ3O2Z1bmN0aW9uIHNjcnlwdChrZXksc2FsdCxOLHIscCxka0xlbixwcm9ncmVzc0NhbGxiYWNrKXtpZihOPT09MHx8KE4mTi0xKSE9PTApdGhyb3cgRXJyb3IoIk4gbXVzdCBiZSA+IDAgYW5kIGEgcG93ZXIgb2YgMiIpO2lmKE4+TUFYX1ZBTFVFLzEyOC9yKXRocm93IEVycm9yKCJQYXJhbWV0ZXIgTiBpcyB0b28gbGFyZ2UiKTtpZihyPk1BWF9WQUxVRS8xMjgvcCl0aHJvdyBFcnJvcigiUGFyYW1ldGVyIHIgaXMgdG9vIGxhcmdlIik7dmFyIFhZPW5ldyBCdWZmZXIoMjU2KnIpO3ZhciBWPW5ldyBCdWZmZXIoMTI4KnIqTik7dmFyIEIzMj1uZXcgSW50MzJBcnJheSgxNik7dmFyIHg9bmV3IEludDMyQXJyYXkoMTYpO3ZhciBfWD1uZXcgQnVmZmVyKDY0KTt2YXIgQj1wYmtkZjIucGJrZGYyU3luYyhrZXksc2FsdCwxLHAqMTI4KnIsInNoYTI1NiIpO3ZhciB0aWNrQ2FsbGJhY2s7aWYocHJvZ3Jlc3NDYWxsYmFjayl7dmFyIHRvdGFsT3BzPXAqTioyO3ZhciBjdXJyZW50T3A9MDt0aWNrQ2FsbGJhY2s9ZnVuY3Rpb24oKXsrK2N1cnJlbnRPcDtpZihjdXJyZW50T3AlMWUzPT09MCl7cHJvZ3Jlc3NDYWxsYmFjayh7Y3VycmVudDpjdXJyZW50T3AsdG90YWw6dG90YWxPcHMscGVyY2VudDpjdXJyZW50T3AvdG90YWxPcHMqMTAwfSl9fX1mb3IodmFyIGk9MDtpPHA7aSsrKXtzbWl4KEIsaSoxMjgqcixyLE4sVixYWSl9cmV0dXJuIHBia2RmMi5wYmtkZjJTeW5jKGtleSxCLDEsZGtMZW4sInNoYTI1NiIpO2Z1bmN0aW9uIHNtaXgoQixCaSxyLE4sVixYWSl7dmFyIFhpPTA7dmFyIFlpPTEyOCpyO3ZhciBpO0IuY29weShYWSxYaSxCaSxCaStZaSk7Zm9yKGk9MDtpPE47aSsrKXtYWS5jb3B5KFYsaSpZaSxYaSxYaStZaSk7YmxvY2ttaXhfc2Fsc2E4KFhZLFhpLFlpLHIpO2lmKHRpY2tDYWxsYmFjayl0aWNrQ2FsbGJhY2soKX1mb3IoaT0wO2k8TjtpKyspe3ZhciBvZmZzZXQ9WGkrKDIqci0xKSo2NDt2YXIgaj1YWS5yZWFkVUludDMyTEUob2Zmc2V0KSZOLTE7YmxvY2t4b3IoVixqKllpLFhZLFhpLFlpKTtibG9ja21peF9zYWxzYTgoWFksWGksWWkscik7aWYodGlja0NhbGxiYWNrKXRpY2tDYWxsYmFjaygpfVhZLmNvcHkoQixCaSxYaSxYaStZaSl9ZnVuY3Rpb24gYmxvY2ttaXhfc2Fsc2E4KEJZLEJpLFlpLHIpe3ZhciBpO2FycmF5Y29weShCWSxCaSsoMipyLTEpKjY0LF9YLDAsNjQpO2ZvcihpPTA7aTwyKnI7aSsrKXtibG9ja3hvcihCWSxpKjY0LF9YLDAsNjQpO3NhbHNhMjBfOChfWCk7YXJyYXljb3B5KF9YLDAsQlksWWkraSo2NCw2NCl9Zm9yKGk9MDtpPHI7aSsrKXthcnJheWNvcHkoQlksWWkraSoyKjY0LEJZLEJpK2kqNjQsNjQpfWZvcihpPTA7aTxyO2krKyl7YXJyYXljb3B5KEJZLFlpKyhpKjIrMSkqNjQsQlksQmkrKGkrcikqNjQsNjQpfX1mdW5jdGlvbiBSKGEsYil7cmV0dXJuIGE8PGJ8YT4+PjMyLWJ9ZnVuY3Rpb24gc2Fsc2EyMF84KEIpe3ZhciBpO2ZvcihpPTA7aTwxNjtpKyspe0IzMltpXT0oQltpKjQrMF0mMjU1KTw8MDtCMzJbaV18PShCW2kqNCsxXSYyNTUpPDw4O0IzMltpXXw9KEJbaSo0KzJdJjI1NSk8PDE2O0IzMltpXXw9KEJbaSo0KzNdJjI1NSk8PDI0fWFycmF5Y29weShCMzIsMCx4LDAsMTYpO2ZvcihpPTg7aT4wO2ktPTIpe3hbNF1ePVIoeFswXSt4WzEyXSw3KTt4WzhdXj1SKHhbNF0reFswXSw5KTt4WzEyXV49Uih4WzhdK3hbNF0sMTMpO3hbMF1ePVIoeFsxMl0reFs4XSwxOCk7eFs5XV49Uih4WzVdK3hbMV0sNyk7eFsxM11ePVIoeFs5XSt4WzVdLDkpO3hbMV1ePVIoeFsxM10reFs5XSwxMyk7eFs1XV49Uih4WzFdK3hbMTNdLDE4KTt4WzE0XV49Uih4WzEwXSt4WzZdLDcpO3hbMl1ePVIoeFsxNF0reFsxMF0sOSk7eFs2XV49Uih4WzJdK3hbMTRdLDEzKTt4WzEwXV49Uih4WzZdK3hbMl0sMTgpO3hbM11ePVIoeFsxNV0reFsxMV0sNyk7eFs3XV49Uih4WzNdK3hbMTVdLDkpO3hbMTFdXj1SKHhbN10reFszXSwxMyk7eFsxNV1ePVIoeFsxMV0reFs3XSwxOCk7eFsxXV49Uih4WzBdK3hbM10sNyk7eFsyXV49Uih4WzFdK3hbMF0sOSk7eFszXV49Uih4WzJdK3hbMV0sMTMpO3hbMF1ePVIoeFszXSt4WzJdLDE4KTt4WzZdXj1SKHhbNV0reFs0XSw3KTt4WzddXj1SKHhbNl0reFs1XSw5KTt4WzRdXj1SKHhbN10reFs2XSwxMyk7eFs1XV49Uih4WzRdK3hbN10sMTgpO3hbMTFdXj1SKHhbMTBdK3hbOV0sNyk7eFs4XV49Uih4WzExXSt4WzEwXSw5KTt4WzldXj1SKHhbOF0reFsxMV0sMTMpO3hbMTBdXj1SKHhbOV0reFs4XSwxOCk7eFsxMl1ePVIoeFsxNV0reFsxNF0sNyk7eFsxM11ePVIoeFsxMl0reFsxNV0sOSk7eFsxNF1ePVIoeFsxM10reFsxMl0sMTMpO3hbMTVdXj1SKHhbMTRdK3hbMTNdLDE4KX1mb3IoaT0wO2k8MTY7KytpKUIzMltpXT14W2ldK0IzMltpXTtmb3IoaT0wO2k8MTY7aSsrKXt2YXIgYmk9aSo0O0JbYmkrMF09QjMyW2ldPj4wJjI1NTtCW2JpKzFdPUIzMltpXT4+OCYyNTU7QltiaSsyXT1CMzJbaV0+PjE2JjI1NTtCW2JpKzNdPUIzMltpXT4+MjQmMjU1fX1mdW5jdGlvbiBibG9ja3hvcihTLFNpLEQsRGksbGVuKXtmb3IodmFyIGk9MDtpPGxlbjtpKyspe0RbRGkraV1ePVNbU2kraV19fX1mdW5jdGlvbiBhcnJheWNvcHkoc3JjLHNyY1BvcyxkZXN0LGRlc3RQb3MsbGVuZ3RoKXtpZihCdWZmZXIuaXNCdWZmZXIoc3JjKSYmQnVmZmVyLmlzQnVmZmVyKGRlc3QpKXtzcmMuY29weShkZXN0LGRlc3RQb3Msc3JjUG9zLHNyY1BvcytsZW5ndGgpfWVsc2V7d2hpbGUobGVuZ3RoLS0pe2Rlc3RbZGVzdFBvcysrXT1zcmNbc3JjUG9zKytdfX19bW9kdWxlLmV4cG9ydHM9c2NyeXB0fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHtidWZmZXI6MjcscGJrZGYyOjU4fV0sODI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBhbGVhPXJlcXVpcmUoIi4vbGliL2FsZWEiKTt2YXIgeG9yMTI4PXJlcXVpcmUoIi4vbGliL3hvcjEyOCIpO3ZhciB4b3J3b3c9cmVxdWlyZSgiLi9saWIveG9yd293Iik7dmFyIHhvcnNoaWZ0Nz1yZXF1aXJlKCIuL2xpYi94b3JzaGlmdDciKTt2YXIgeG9yNDA5Nj1yZXF1aXJlKCIuL2xpYi94b3I0MDk2Iik7dmFyIHR5Y2hlaT1yZXF1aXJlKCIuL2xpYi90eWNoZWkiKTt2YXIgc3I9cmVxdWlyZSgiLi9zZWVkcmFuZG9tIik7c3IuYWxlYT1hbGVhO3NyLnhvcjEyOD14b3IxMjg7c3IueG9yd293PXhvcndvdztzci54b3JzaGlmdDc9eG9yc2hpZnQ3O3NyLnhvcjQwOTY9eG9yNDA5Njtzci50eWNoZWk9dHljaGVpO21vZHVsZS5leHBvcnRzPXNyfSx7Ii4vbGliL2FsZWEiOjgzLCIuL2xpYi90eWNoZWkiOjg0LCIuL2xpYi94b3IxMjgiOjg1LCIuL2xpYi94b3I0MDk2Ijo4NiwiLi9saWIveG9yc2hpZnQ3Ijo4NywiLi9saWIveG9yd293Ijo4OCwiLi9zZWVkcmFuZG9tIjo4OX1dLDgzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsLG1vZHVsZSxkZWZpbmUpe2Z1bmN0aW9uIEFsZWEoc2VlZCl7dmFyIG1lPXRoaXMsbWFzaD1NYXNoKCk7bWUubmV4dD1mdW5jdGlvbigpe3ZhciB0PTIwOTE2MzkqbWUuczArbWUuYyoyLjMyODMwNjQzNjUzODY5NjNlLTEwO21lLnMwPW1lLnMxO21lLnMxPW1lLnMyO3JldHVybiBtZS5zMj10LShtZS5jPXR8MCl9O21lLmM9MTttZS5zMD1tYXNoKCIgIik7bWUuczE9bWFzaCgiICIpO21lLnMyPW1hc2goIiAiKTttZS5zMC09bWFzaChzZWVkKTtpZihtZS5zMDwwKXttZS5zMCs9MX1tZS5zMS09bWFzaChzZWVkKTtpZihtZS5zMTwwKXttZS5zMSs9MX1tZS5zMi09bWFzaChzZWVkKTtpZihtZS5zMjwwKXttZS5zMis9MX1tYXNoPW51bGx9ZnVuY3Rpb24gY29weShmLHQpe3QuYz1mLmM7dC5zMD1mLnMwO3QuczE9Zi5zMTt0LnMyPWYuczI7cmV0dXJuIHR9ZnVuY3Rpb24gaW1wbChzZWVkLG9wdHMpe3ZhciB4Zz1uZXcgQWxlYShzZWVkKSxzdGF0ZT1vcHRzJiZvcHRzLnN0YXRlLHBybmc9eGcubmV4dDtwcm5nLmludDMyPWZ1bmN0aW9uKCl7cmV0dXJuIHhnLm5leHQoKSo0Mjk0OTY3Mjk2fDB9O3BybmcuZG91YmxlPWZ1bmN0aW9uKCl7cmV0dXJuIHBybmcoKSsocHJuZygpKjIwOTcxNTJ8MCkqMTExMDIyMzAyNDYyNTE1NjVlLTMyfTtwcm5nLnF1aWNrPXBybmc7aWYoc3RhdGUpe2lmKHR5cGVvZiBzdGF0ZT09Im9iamVjdCIpY29weShzdGF0ZSx4Zyk7cHJuZy5zdGF0ZT1mdW5jdGlvbigpe3JldHVybiBjb3B5KHhnLHt9KX19cmV0dXJuIHBybmd9ZnVuY3Rpb24gTWFzaCgpe3ZhciBuPTQwMjI4NzExOTc7dmFyIG1hc2g9ZnVuY3Rpb24oZGF0YSl7ZGF0YT1TdHJpbmcoZGF0YSk7Zm9yKHZhciBpPTA7aTxkYXRhLmxlbmd0aDtpKyspe24rPWRhdGEuY2hhckNvZGVBdChpKTt2YXIgaD0uMDI1MTk2MDMyODI0MTY5MzgqbjtuPWg+Pj4wO2gtPW47aCo9bjtuPWg+Pj4wO2gtPW47bis9aCo0Mjk0OTY3Mjk2fXJldHVybihuPj4+MCkqMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMH07cmV0dXJuIG1hc2h9aWYobW9kdWxlJiZtb2R1bGUuZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9aW1wbH1lbHNlIGlmKGRlZmluZSYmZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGltcGx9KX1lbHNle3RoaXMuYWxlYT1pbXBsfX0pKHRoaXMsdHlwZW9mIG1vZHVsZT09Im9iamVjdCImJm1vZHVsZSx0eXBlb2YgZGVmaW5lPT0iZnVuY3Rpb24iJiZkZWZpbmUpfSx7fV0sODQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwsbW9kdWxlLGRlZmluZSl7ZnVuY3Rpb24gWG9yR2VuKHNlZWQpe3ZhciBtZT10aGlzLHN0cnNlZWQ9IiI7bWUubmV4dD1mdW5jdGlvbigpe3ZhciBiPW1lLmIsYz1tZS5jLGQ9bWUuZCxhPW1lLmE7Yj1iPDwyNV5iPj4+N15jO2M9Yy1kfDA7ZD1kPDwyNF5kPj4+OF5hO2E9YS1ifDA7bWUuYj1iPWI8PDIwXmI+Pj4xMl5jO21lLmM9Yz1jLWR8MDttZS5kPWQ8PDE2XmM+Pj4xNl5hO3JldHVybiBtZS5hPWEtYnwwfTttZS5hPTA7bWUuYj0wO21lLmM9MjY1NDQzNTc2OXwwO21lLmQ9MTM2NzEzMDU1MTtpZihzZWVkPT09TWF0aC5mbG9vcihzZWVkKSl7bWUuYT1zZWVkLzQyOTQ5NjcyOTZ8MDttZS5iPXNlZWR8MH1lbHNle3N0cnNlZWQrPXNlZWR9Zm9yKHZhciBrPTA7azxzdHJzZWVkLmxlbmd0aCsyMDtrKyspe21lLmJePXN0cnNlZWQuY2hhckNvZGVBdChrKXwwO21lLm5leHQoKX19ZnVuY3Rpb24gY29weShmLHQpe3QuYT1mLmE7dC5iPWYuYjt0LmM9Zi5jO3QuZD1mLmQ7cmV0dXJuIHR9ZnVuY3Rpb24gaW1wbChzZWVkLG9wdHMpe3ZhciB4Zz1uZXcgWG9yR2VuKHNlZWQpLHN0YXRlPW9wdHMmJm9wdHMuc3RhdGUscHJuZz1mdW5jdGlvbigpe3JldHVybih4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2fTtwcm5nLmRvdWJsZT1mdW5jdGlvbigpe2Rve3ZhciB0b3A9eGcubmV4dCgpPj4+MTEsYm90PSh4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2LHJlc3VsdD0odG9wK2JvdCkvKDE8PDIxKX13aGlsZShyZXN1bHQ9PT0wKTtyZXR1cm4gcmVzdWx0fTtwcm5nLmludDMyPXhnLm5leHQ7cHJuZy5xdWljaz1wcm5nO2lmKHN0YXRlKXtpZih0eXBlb2Ygc3RhdGU9PSJvYmplY3QiKWNvcHkoc3RhdGUseGcpO3Bybmcuc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gY29weSh4Zyx7fSl9fXJldHVybiBwcm5nfWlmKG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWltcGx9ZWxzZSBpZihkZWZpbmUmJmRlZmluZS5hbWQpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBpbXBsfSl9ZWxzZXt0aGlzLnR5Y2hlaT1pbXBsfX0pKHRoaXMsdHlwZW9mIG1vZHVsZT09Im9iamVjdCImJm1vZHVsZSx0eXBlb2YgZGVmaW5lPT0iZnVuY3Rpb24iJiZkZWZpbmUpfSx7fV0sODU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwsbW9kdWxlLGRlZmluZSl7ZnVuY3Rpb24gWG9yR2VuKHNlZWQpe3ZhciBtZT10aGlzLHN0cnNlZWQ9IiI7bWUueD0wO21lLnk9MDttZS56PTA7bWUudz0wO21lLm5leHQ9ZnVuY3Rpb24oKXt2YXIgdD1tZS54Xm1lLng8PDExO21lLng9bWUueTttZS55PW1lLno7bWUuej1tZS53O3JldHVybiBtZS53Xj1tZS53Pj4+MTledF50Pj4+OH07aWYoc2VlZD09PShzZWVkfDApKXttZS54PXNlZWR9ZWxzZXtzdHJzZWVkKz1zZWVkfWZvcih2YXIgaz0wO2s8c3Ryc2VlZC5sZW5ndGgrNjQ7aysrKXttZS54Xj1zdHJzZWVkLmNoYXJDb2RlQXQoayl8MDttZS5uZXh0KCl9fWZ1bmN0aW9uIGNvcHkoZix0KXt0Lng9Zi54O3QueT1mLnk7dC56PWYuejt0Lnc9Zi53O3JldHVybiB0fWZ1bmN0aW9uIGltcGwoc2VlZCxvcHRzKXt2YXIgeGc9bmV3IFhvckdlbihzZWVkKSxzdGF0ZT1vcHRzJiZvcHRzLnN0YXRlLHBybmc9ZnVuY3Rpb24oKXtyZXR1cm4oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5Nn07cHJuZy5kb3VibGU9ZnVuY3Rpb24oKXtkb3t2YXIgdG9wPXhnLm5leHQoKT4+PjExLGJvdD0oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5NixyZXN1bHQ9KHRvcCtib3QpLygxPDwyMSl9d2hpbGUocmVzdWx0PT09MCk7cmV0dXJuIHJlc3VsdH07cHJuZy5pbnQzMj14Zy5uZXh0O3BybmcucXVpY2s9cHJuZztpZihzdGF0ZSl7aWYodHlwZW9mIHN0YXRlPT0ib2JqZWN0Iiljb3B5KHN0YXRlLHhnKTtwcm5nLnN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGNvcHkoeGcse30pfX1yZXR1cm4gcHJuZ31pZihtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXttb2R1bGUuZXhwb3J0cz1pbXBsfWVsc2UgaWYoZGVmaW5lJiZkZWZpbmUuYW1kKXtkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gaW1wbH0pfWVsc2V7dGhpcy54b3IxMjg9aW1wbH19KSh0aGlzLHR5cGVvZiBtb2R1bGU9PSJvYmplY3QiJiZtb2R1bGUsdHlwZW9mIGRlZmluZT09ImZ1bmN0aW9uIiYmZGVmaW5lKX0se31dLDg2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsLG1vZHVsZSxkZWZpbmUpe2Z1bmN0aW9uIFhvckdlbihzZWVkKXt2YXIgbWU9dGhpczttZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIHc9bWUudyxYPW1lLlgsaT1tZS5pLHQsdjttZS53PXc9dysxNjQwNTMxNTI3fDA7dj1YW2krMzQmMTI3XTt0PVhbaT1pKzEmMTI3XTt2Xj12PDwxMzt0Xj10PDwxNzt2Xj12Pj4+MTU7dF49dD4+PjEyO3Y9WFtpXT12XnQ7bWUuaT1pO3JldHVybiB2Kyh3Xnc+Pj4xNil8MH07ZnVuY3Rpb24gaW5pdChtZSxzZWVkKXt2YXIgdCx2LGksaix3LFg9W10sbGltaXQ9MTI4O2lmKHNlZWQ9PT0oc2VlZHwwKSl7dj1zZWVkO3NlZWQ9bnVsbH1lbHNle3NlZWQ9c2VlZCsiXDAiO3Y9MDtsaW1pdD1NYXRoLm1heChsaW1pdCxzZWVkLmxlbmd0aCl9Zm9yKGk9MCxqPS0zMjtqPGxpbWl0Oysrail7aWYoc2VlZCl2Xj1zZWVkLmNoYXJDb2RlQXQoKGorMzIpJXNlZWQubGVuZ3RoKTtpZihqPT09MCl3PXY7dl49djw8MTA7dl49dj4+PjE1O3ZePXY8PDQ7dl49dj4+PjEzO2lmKGo+PTApe3c9dysxNjQwNTMxNTI3fDA7dD1YW2omMTI3XV49dit3O2k9MD09dD9pKzE6MH19aWYoaT49MTI4KXtYWyhzZWVkJiZzZWVkLmxlbmd0aHx8MCkmMTI3XT0tMX1pPTEyNztmb3Ioaj00KjEyODtqPjA7LS1qKXt2PVhbaSszNCYxMjddO3Q9WFtpPWkrMSYxMjddO3ZePXY8PDEzO3RePXQ8PDE3O3ZePXY+Pj4xNTt0Xj10Pj4+MTI7WFtpXT12XnR9bWUudz13O21lLlg9WDttZS5pPWl9aW5pdChtZSxzZWVkKX1mdW5jdGlvbiBjb3B5KGYsdCl7dC5pPWYuaTt0Lnc9Zi53O3QuWD1mLlguc2xpY2UoKTtyZXR1cm4gdH1mdW5jdGlvbiBpbXBsKHNlZWQsb3B0cyl7aWYoc2VlZD09bnVsbClzZWVkPStuZXcgRGF0ZTt2YXIgeGc9bmV3IFhvckdlbihzZWVkKSxzdGF0ZT1vcHRzJiZvcHRzLnN0YXRlLHBybmc9ZnVuY3Rpb24oKXtyZXR1cm4oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5Nn07cHJuZy5kb3VibGU9ZnVuY3Rpb24oKXtkb3t2YXIgdG9wPXhnLm5leHQoKT4+PjExLGJvdD0oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5NixyZXN1bHQ9KHRvcCtib3QpLygxPDwyMSl9d2hpbGUocmVzdWx0PT09MCk7cmV0dXJuIHJlc3VsdH07cHJuZy5pbnQzMj14Zy5uZXh0O3BybmcucXVpY2s9cHJuZztpZihzdGF0ZSl7aWYoc3RhdGUuWCljb3B5KHN0YXRlLHhnKTtwcm5nLnN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGNvcHkoeGcse30pfX1yZXR1cm4gcHJuZ31pZihtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXttb2R1bGUuZXhwb3J0cz1pbXBsfWVsc2UgaWYoZGVmaW5lJiZkZWZpbmUuYW1kKXtkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gaW1wbH0pfWVsc2V7dGhpcy54b3I0MDk2PWltcGx9fSkodGhpcyx0eXBlb2YgbW9kdWxlPT0ib2JqZWN0IiYmbW9kdWxlLHR5cGVvZiBkZWZpbmU9PSJmdW5jdGlvbiImJmRlZmluZSl9LHt9XSw4NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCxtb2R1bGUsZGVmaW5lKXtmdW5jdGlvbiBYb3JHZW4oc2VlZCl7dmFyIG1lPXRoaXM7bWUubmV4dD1mdW5jdGlvbigpe3ZhciBYPW1lLngsaT1tZS5pLHQsdix3O3Q9WFtpXTt0Xj10Pj4+Nzt2PXRedDw8MjQ7dD1YW2krMSY3XTt2Xj10XnQ+Pj4xMDt0PVhbaSszJjddO3ZePXRedD4+PjM7dD1YW2krNCY3XTt2Xj10XnQ8PDc7dD1YW2krNyY3XTt0PXRedDw8MTM7dl49dF50PDw5O1hbaV09djttZS5pPWkrMSY3O3JldHVybiB2fTtmdW5jdGlvbiBpbml0KG1lLHNlZWQpe3ZhciBqLHcsWD1bXTtpZihzZWVkPT09KHNlZWR8MCkpe3c9WFswXT1zZWVkfWVsc2V7c2VlZD0iIitzZWVkO2ZvcihqPTA7ajxzZWVkLmxlbmd0aDsrK2ope1hbaiY3XT1YW2omN108PDE1XnNlZWQuY2hhckNvZGVBdChqKStYW2orMSY3XTw8MTN9fXdoaWxlKFgubGVuZ3RoPDgpWC5wdXNoKDApO2ZvcihqPTA7ajw4JiZYW2pdPT09MDsrK2opO2lmKGo9PTgpdz1YWzddPS0xO2Vsc2Ugdz1YW2pdO21lLng9WDttZS5pPTA7Zm9yKGo9MjU2O2o+MDstLWope21lLm5leHQoKX19aW5pdChtZSxzZWVkKX1mdW5jdGlvbiBjb3B5KGYsdCl7dC54PWYueC5zbGljZSgpO3QuaT1mLmk7cmV0dXJuIHR9ZnVuY3Rpb24gaW1wbChzZWVkLG9wdHMpe2lmKHNlZWQ9PW51bGwpc2VlZD0rbmV3IERhdGU7dmFyIHhnPW5ldyBYb3JHZW4oc2VlZCksc3RhdGU9b3B0cyYmb3B0cy5zdGF0ZSxwcm5nPWZ1bmN0aW9uKCl7cmV0dXJuKHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTZ9O3BybmcuZG91YmxlPWZ1bmN0aW9uKCl7ZG97dmFyIHRvcD14Zy5uZXh0KCk+Pj4xMSxib3Q9KHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTYscmVzdWx0PSh0b3ArYm90KS8oMTw8MjEpfXdoaWxlKHJlc3VsdD09PTApO3JldHVybiByZXN1bHR9O3BybmcuaW50MzI9eGcubmV4dDtwcm5nLnF1aWNrPXBybmc7aWYoc3RhdGUpe2lmKHN0YXRlLngpY29weShzdGF0ZSx4Zyk7cHJuZy5zdGF0ZT1mdW5jdGlvbigpe3JldHVybiBjb3B5KHhnLHt9KX19cmV0dXJuIHBybmd9aWYobW9kdWxlJiZtb2R1bGUuZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9aW1wbH1lbHNlIGlmKGRlZmluZSYmZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGltcGx9KX1lbHNle3RoaXMueG9yc2hpZnQ3PWltcGx9fSkodGhpcyx0eXBlb2YgbW9kdWxlPT0ib2JqZWN0IiYmbW9kdWxlLHR5cGVvZiBkZWZpbmU9PSJmdW5jdGlvbiImJmRlZmluZSl9LHt9XSw4ODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCxtb2R1bGUsZGVmaW5lKXtmdW5jdGlvbiBYb3JHZW4oc2VlZCl7dmFyIG1lPXRoaXMsc3Ryc2VlZD0iIjttZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIHQ9bWUueF5tZS54Pj4+MjttZS54PW1lLnk7bWUueT1tZS56O21lLno9bWUudzttZS53PW1lLnY7cmV0dXJuKG1lLmQ9bWUuZCszNjI0Mzd8MCkrKG1lLnY9bWUudl5tZS52PDw0Xih0XnQ8PDEpKXwwfTttZS54PTA7bWUueT0wO21lLno9MDttZS53PTA7bWUudj0wO2lmKHNlZWQ9PT0oc2VlZHwwKSl7bWUueD1zZWVkfWVsc2V7c3Ryc2VlZCs9c2VlZH1mb3IodmFyIGs9MDtrPHN0cnNlZWQubGVuZ3RoKzY0O2srKyl7bWUueF49c3Ryc2VlZC5jaGFyQ29kZUF0KGspfDA7aWYoaz09c3Ryc2VlZC5sZW5ndGgpe21lLmQ9bWUueDw8MTBebWUueD4+PjR9bWUubmV4dCgpfX1mdW5jdGlvbiBjb3B5KGYsdCl7dC54PWYueDt0Lnk9Zi55O3Quej1mLno7dC53PWYudzt0LnY9Zi52O3QuZD1mLmQ7cmV0dXJuIHR9ZnVuY3Rpb24gaW1wbChzZWVkLG9wdHMpe3ZhciB4Zz1uZXcgWG9yR2VuKHNlZWQpLHN0YXRlPW9wdHMmJm9wdHMuc3RhdGUscHJuZz1mdW5jdGlvbigpe3JldHVybih4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2fTtwcm5nLmRvdWJsZT1mdW5jdGlvbigpe2Rve3ZhciB0b3A9eGcubmV4dCgpPj4+MTEsYm90PSh4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2LHJlc3VsdD0odG9wK2JvdCkvKDE8PDIxKX13aGlsZShyZXN1bHQ9PT0wKTtyZXR1cm4gcmVzdWx0fTtwcm5nLmludDMyPXhnLm5leHQ7cHJuZy5xdWljaz1wcm5nO2lmKHN0YXRlKXtpZih0eXBlb2Ygc3RhdGU9PSJvYmplY3QiKWNvcHkoc3RhdGUseGcpO3Bybmcuc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gY29weSh4Zyx7fSl9fXJldHVybiBwcm5nfWlmKG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWltcGx9ZWxzZSBpZihkZWZpbmUmJmRlZmluZS5hbWQpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBpbXBsfSl9ZWxzZXt0aGlzLnhvcndvdz1pbXBsfX0pKHRoaXMsdHlwZW9mIG1vZHVsZT09Im9iamVjdCImJm1vZHVsZSx0eXBlb2YgZGVmaW5lPT0iZnVuY3Rpb24iJiZkZWZpbmUpfSx7fV0sODk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihwb29sLG1hdGgpe3ZhciBnbG9iYWw9KDAsZXZhbCkoInRoaXMiKSx3aWR0aD0yNTYsY2h1bmtzPTYsZGlnaXRzPTUyLHJuZ25hbWU9InJhbmRvbSIsc3RhcnRkZW5vbT1tYXRoLnBvdyh3aWR0aCxjaHVua3MpLHNpZ25pZmljYW5jZT1tYXRoLnBvdygyLGRpZ2l0cyksb3ZlcmZsb3c9c2lnbmlmaWNhbmNlKjIsbWFzaz13aWR0aC0xLG5vZGVjcnlwdG87ZnVuY3Rpb24gc2VlZHJhbmRvbShzZWVkLG9wdGlvbnMsY2FsbGJhY2spe3ZhciBrZXk9W107b3B0aW9ucz1vcHRpb25zPT10cnVlP3tlbnRyb3B5OnRydWV9Om9wdGlvbnN8fHt9O3ZhciBzaG9ydHNlZWQ9bWl4a2V5KGZsYXR0ZW4ob3B0aW9ucy5lbnRyb3B5P1tzZWVkLHRvc3RyaW5nKHBvb2wpXTpzZWVkPT1udWxsP2F1dG9zZWVkKCk6c2VlZCwzKSxrZXkpO3ZhciBhcmM0PW5ldyBBUkM0KGtleSk7dmFyIHBybmc9ZnVuY3Rpb24oKXt2YXIgbj1hcmM0LmcoY2h1bmtzKSxkPXN0YXJ0ZGVub20seD0wO3doaWxlKG48c2lnbmlmaWNhbmNlKXtuPShuK3gpKndpZHRoO2QqPXdpZHRoO3g9YXJjNC5nKDEpfXdoaWxlKG4+PW92ZXJmbG93KXtuLz0yO2QvPTI7eD4+Pj0xfXJldHVybihuK3gpL2R9O3BybmcuaW50MzI9ZnVuY3Rpb24oKXtyZXR1cm4gYXJjNC5nKDQpfDB9O3BybmcucXVpY2s9ZnVuY3Rpb24oKXtyZXR1cm4gYXJjNC5nKDQpLzQyOTQ5NjcyOTZ9O3BybmcuZG91YmxlPXBybmc7bWl4a2V5KHRvc3RyaW5nKGFyYzQuUykscG9vbCk7cmV0dXJuKG9wdGlvbnMucGFzc3x8Y2FsbGJhY2t8fGZ1bmN0aW9uKHBybmcsc2VlZCxpc19tYXRoX2NhbGwsc3RhdGUpe2lmKHN0YXRlKXtpZihzdGF0ZS5TKXtjb3B5KHN0YXRlLGFyYzQpfXBybmcuc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gY29weShhcmM0LHt9KX19aWYoaXNfbWF0aF9jYWxsKXttYXRoW3JuZ25hbWVdPXBybmc7cmV0dXJuIHNlZWR9ZWxzZSByZXR1cm4gcHJuZ30pKHBybmcsc2hvcnRzZWVkLCJnbG9iYWwiaW4gb3B0aW9ucz9vcHRpb25zLmdsb2JhbDp0aGlzPT1tYXRoLG9wdGlvbnMuc3RhdGUpfWZ1bmN0aW9uIEFSQzQoa2V5KXt2YXIgdCxrZXlsZW49a2V5Lmxlbmd0aCxtZT10aGlzLGk9MCxqPW1lLmk9bWUuaj0wLHM9bWUuUz1bXTtpZigha2V5bGVuKXtrZXk9W2tleWxlbisrXX13aGlsZShpPHdpZHRoKXtzW2ldPWkrK31mb3IoaT0wO2k8d2lkdGg7aSsrKXtzW2ldPXNbaj1tYXNrJmora2V5W2kla2V5bGVuXSsodD1zW2ldKV07c1tqXT10fShtZS5nPWZ1bmN0aW9uKGNvdW50KXt2YXIgdCxyPTAsaT1tZS5pLGo9bWUuaixzPW1lLlM7d2hpbGUoY291bnQtLSl7dD1zW2k9bWFzayZpKzFdO3I9cip3aWR0aCtzW21hc2smKHNbaV09c1tqPW1hc2smait0XSkrKHNbal09dCldfW1lLmk9aTttZS5qPWo7cmV0dXJuIHJ9KSh3aWR0aCl9ZnVuY3Rpb24gY29weShmLHQpe3QuaT1mLmk7dC5qPWYuajt0LlM9Zi5TLnNsaWNlKCk7cmV0dXJuIHR9ZnVuY3Rpb24gZmxhdHRlbihvYmosZGVwdGgpe3ZhciByZXN1bHQ9W10sdHlwPXR5cGVvZiBvYmoscHJvcDtpZihkZXB0aCYmdHlwPT0ib2JqZWN0Iil7Zm9yKHByb3AgaW4gb2JqKXt0cnl7cmVzdWx0LnB1c2goZmxhdHRlbihvYmpbcHJvcF0sZGVwdGgtMSkpfWNhdGNoKGUpe319fXJldHVybiByZXN1bHQubGVuZ3RoP3Jlc3VsdDp0eXA9PSJzdHJpbmciP29iajpvYmorIlwwIn1mdW5jdGlvbiBtaXhrZXkoc2VlZCxrZXkpe3ZhciBzdHJpbmdzZWVkPXNlZWQrIiIsc21lYXIsaj0wO3doaWxlKGo8c3RyaW5nc2VlZC5sZW5ndGgpe2tleVttYXNrJmpdPW1hc2smKHNtZWFyXj1rZXlbbWFzayZqXSoxOSkrc3RyaW5nc2VlZC5jaGFyQ29kZUF0KGorKyl9cmV0dXJuIHRvc3RyaW5nKGtleSl9ZnVuY3Rpb24gYXV0b3NlZWQoKXt0cnl7dmFyIG91dDtpZihub2RlY3J5cHRvJiYob3V0PW5vZGVjcnlwdG8ucmFuZG9tQnl0ZXMpKXtvdXQ9b3V0KHdpZHRoKX1lbHNle291dD1uZXcgVWludDhBcnJheSh3aWR0aCk7KGdsb2JhbC5jcnlwdG98fGdsb2JhbC5tc0NyeXB0bykuZ2V0UmFuZG9tVmFsdWVzKG91dCl9cmV0dXJuIHRvc3RyaW5nKG91dCl9Y2F0Y2goZSl7dmFyIGJyb3dzZXI9Z2xvYmFsLm5hdmlnYXRvcixwbHVnaW5zPWJyb3dzZXImJmJyb3dzZXIucGx1Z2lucztyZXR1cm5bK25ldyBEYXRlLGdsb2JhbCxwbHVnaW5zLGdsb2JhbC5zY3JlZW4sdG9zdHJpbmcocG9vbCldfX1mdW5jdGlvbiB0b3N0cmluZyhhKXtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseSgwLGEpfW1peGtleShtYXRoLnJhbmRvbSgpLHBvb2wpO2lmKHR5cGVvZiBtb2R1bGU9PSJvYmplY3QiJiZtb2R1bGUuZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9c2VlZHJhbmRvbTt0cnl7bm9kZWNyeXB0bz1yZXF1aXJlKCJjcnlwdG8iKX1jYXRjaChleCl7fX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PSJmdW5jdGlvbiImJmRlZmluZS5hbWQpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBzZWVkcmFuZG9tfSl9ZWxzZXttYXRoWyJzZWVkIitybmduYW1lXT1zZWVkcmFuZG9tfX0pKFtdLE1hdGgpfSx7Y3J5cHRvOjI2fV0sOTA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7ZnVuY3Rpb24gSGFzaChibG9ja1NpemUsZmluYWxTaXplKXt0aGlzLl9ibG9jaz1CdWZmZXIuYWxsb2MoYmxvY2tTaXplKTt0aGlzLl9maW5hbFNpemU9ZmluYWxTaXplO3RoaXMuX2Jsb2NrU2l6ZT1ibG9ja1NpemU7dGhpcy5fbGVuPTB9SGFzaC5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGRhdGEsZW5jKXtpZih0eXBlb2YgZGF0YT09PSJzdHJpbmciKXtlbmM9ZW5jfHwidXRmOCI7ZGF0YT1CdWZmZXIuZnJvbShkYXRhLGVuYyl9dmFyIGJsb2NrPXRoaXMuX2Jsb2NrO3ZhciBibG9ja1NpemU9dGhpcy5fYmxvY2tTaXplO3ZhciBsZW5ndGg9ZGF0YS5sZW5ndGg7dmFyIGFjY3VtPXRoaXMuX2xlbjtmb3IodmFyIG9mZnNldD0wO29mZnNldDxsZW5ndGg7KXt2YXIgYXNzaWduZWQ9YWNjdW0lYmxvY2tTaXplO3ZhciByZW1haW5kZXI9TWF0aC5taW4obGVuZ3RoLW9mZnNldCxibG9ja1NpemUtYXNzaWduZWQpO2Zvcih2YXIgaT0wO2k8cmVtYWluZGVyO2krKyl7YmxvY2tbYXNzaWduZWQraV09ZGF0YVtvZmZzZXQraV19YWNjdW0rPXJlbWFpbmRlcjtvZmZzZXQrPXJlbWFpbmRlcjtpZihhY2N1bSVibG9ja1NpemU9PT0wKXt0aGlzLl91cGRhdGUoYmxvY2spfX10aGlzLl9sZW4rPWxlbmd0aDtyZXR1cm4gdGhpc307SGFzaC5wcm90b3R5cGUuZGlnZXN0PWZ1bmN0aW9uKGVuYyl7dmFyIHJlbT10aGlzLl9sZW4ldGhpcy5fYmxvY2tTaXplO3RoaXMuX2Jsb2NrW3JlbV09MTI4O3RoaXMuX2Jsb2NrLmZpbGwoMCxyZW0rMSk7aWYocmVtPj10aGlzLl9maW5hbFNpemUpe3RoaXMuX3VwZGF0ZSh0aGlzLl9ibG9jayk7dGhpcy5fYmxvY2suZmlsbCgwKX12YXIgYml0cz10aGlzLl9sZW4qODtpZihiaXRzPD00Mjk0OTY3Mjk1KXt0aGlzLl9ibG9jay53cml0ZVVJbnQzMkJFKGJpdHMsdGhpcy5fYmxvY2tTaXplLTQpfWVsc2V7dmFyIGxvd0JpdHM9KGJpdHMmNDI5NDk2NzI5NSk+Pj4wO3ZhciBoaWdoQml0cz0oYml0cy1sb3dCaXRzKS80Mjk0OTY3Mjk2O3RoaXMuX2Jsb2NrLndyaXRlVUludDMyQkUoaGlnaEJpdHMsdGhpcy5fYmxvY2tTaXplLTgpO3RoaXMuX2Jsb2NrLndyaXRlVUludDMyQkUobG93Qml0cyx0aGlzLl9ibG9ja1NpemUtNCl9dGhpcy5fdXBkYXRlKHRoaXMuX2Jsb2NrKTt2YXIgaGFzaD10aGlzLl9oYXNoKCk7cmV0dXJuIGVuYz9oYXNoLnRvU3RyaW5nKGVuYyk6aGFzaH07SGFzaC5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcigiX3VwZGF0ZSBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzIil9O21vZHVsZS5leHBvcnRzPUhhc2h9LHsic2FmZS1idWZmZXIiOjc5fV0sOTE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBleHBvcnRzPW1vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIFNIQShhbGdvcml0aG0pe2FsZ29yaXRobT1hbGdvcml0aG0udG9Mb3dlckNhc2UoKTt2YXIgQWxnb3JpdGhtPWV4cG9ydHNbYWxnb3JpdGhtXTtpZighQWxnb3JpdGhtKXRocm93IG5ldyBFcnJvcihhbGdvcml0aG0rIiBpcyBub3Qgc3VwcG9ydGVkICh3ZSBhY2NlcHQgcHVsbCByZXF1ZXN0cykiKTtyZXR1cm4gbmV3IEFsZ29yaXRobX07ZXhwb3J0cy5zaGE9cmVxdWlyZSgiLi9zaGEiKTtleHBvcnRzLnNoYTE9cmVxdWlyZSgiLi9zaGExIik7ZXhwb3J0cy5zaGEyMjQ9cmVxdWlyZSgiLi9zaGEyMjQiKTtleHBvcnRzLnNoYTI1Nj1yZXF1aXJlKCIuL3NoYTI1NiIpO2V4cG9ydHMuc2hhMzg0PXJlcXVpcmUoIi4vc2hhMzg0Iik7ZXhwb3J0cy5zaGE1MTI9cmVxdWlyZSgiLi9zaGE1MTIiKX0seyIuL3NoYSI6OTIsIi4vc2hhMSI6OTMsIi4vc2hhMjI0Ijo5NCwiLi9zaGEyNTYiOjk1LCIuL3NoYTM4NCI6OTYsIi4vc2hhNTEyIjo5N31dLDkyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBLPVsxNTE4NTAwMjQ5LDE4NTk3NzUzOTMsMjQwMDk1OTcwOHwwLDMzOTU0Njk3ODJ8MF07dmFyIFc9bmV3IEFycmF5KDgwKTtmdW5jdGlvbiBTaGEoKXt0aGlzLmluaXQoKTt0aGlzLl93PVc7SGFzaC5jYWxsKHRoaXMsNjQsNTYpfWluaGVyaXRzKFNoYSxIYXNoKTtTaGEucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLl9hPTE3MzI1ODQxOTM7dGhpcy5fYj00MDIzMjMzNDE3O3RoaXMuX2M9MjU2MjM4MzEwMjt0aGlzLl9kPTI3MTczMzg3ODt0aGlzLl9lPTMyODUzNzc1MjA7cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIHJvdGw1KG51bSl7cmV0dXJuIG51bTw8NXxudW0+Pj4yN31mdW5jdGlvbiByb3RsMzAobnVtKXtyZXR1cm4gbnVtPDwzMHxudW0+Pj4yfWZ1bmN0aW9uIGZ0KHMsYixjLGQpe2lmKHM9PT0wKXJldHVybiBiJmN8fmImZDtpZihzPT09MilyZXR1cm4gYiZjfGImZHxjJmQ7cmV0dXJuIGJeY15kfVNoYS5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihNKXt2YXIgVz10aGlzLl93O3ZhciBhPXRoaXMuX2F8MDt2YXIgYj10aGlzLl9ifDA7dmFyIGM9dGhpcy5fY3wwO3ZhciBkPXRoaXMuX2R8MDt2YXIgZT10aGlzLl9lfDA7Zm9yKHZhciBpPTA7aTwxNjsrK2kpV1tpXT1NLnJlYWRJbnQzMkJFKGkqNCk7Zm9yKDtpPDgwOysraSlXW2ldPVdbaS0zXV5XW2ktOF1eV1tpLTE0XV5XW2ktMTZdO2Zvcih2YXIgaj0wO2o8ODA7KytqKXt2YXIgcz1+fihqLzIwKTt2YXIgdD1yb3RsNShhKStmdChzLGIsYyxkKStlK1dbal0rS1tzXXwwO2U9ZDtkPWM7Yz1yb3RsMzAoYik7Yj1hO2E9dH10aGlzLl9hPWErdGhpcy5fYXwwO3RoaXMuX2I9Yit0aGlzLl9ifDA7dGhpcy5fYz1jK3RoaXMuX2N8MDt0aGlzLl9kPWQrdGhpcy5fZHwwO3RoaXMuX2U9ZSt0aGlzLl9lfDB9O1NoYS5wcm90b3R5cGUuX2hhc2g9ZnVuY3Rpb24oKXt2YXIgSD1CdWZmZXIuYWxsb2NVbnNhZmUoMjApO0gud3JpdGVJbnQzMkJFKHRoaXMuX2F8MCwwKTtILndyaXRlSW50MzJCRSh0aGlzLl9ifDAsNCk7SC53cml0ZUludDMyQkUodGhpcy5fY3wwLDgpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2R8MCwxMik7SC53cml0ZUludDMyQkUodGhpcy5fZXwwLDE2KTtyZXR1cm4gSH07bW9kdWxlLmV4cG9ydHM9U2hhfSx7Ii4vaGFzaCI6OTAsaW5oZXJpdHM6MzYsInNhZmUtYnVmZmVyIjo3OX1dLDkzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBLPVsxNTE4NTAwMjQ5LDE4NTk3NzUzOTMsMjQwMDk1OTcwOHwwLDMzOTU0Njk3ODJ8MF07dmFyIFc9bmV3IEFycmF5KDgwKTtmdW5jdGlvbiBTaGExKCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDY0LDU2KX1pbmhlcml0cyhTaGExLEhhc2gpO1NoYTEucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLl9hPTE3MzI1ODQxOTM7dGhpcy5fYj00MDIzMjMzNDE3O3RoaXMuX2M9MjU2MjM4MzEwMjt0aGlzLl9kPTI3MTczMzg3ODt0aGlzLl9lPTMyODUzNzc1MjA7cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIHJvdGwxKG51bSl7cmV0dXJuIG51bTw8MXxudW0+Pj4zMX1mdW5jdGlvbiByb3RsNShudW0pe3JldHVybiBudW08PDV8bnVtPj4+Mjd9ZnVuY3Rpb24gcm90bDMwKG51bSl7cmV0dXJuIG51bTw8MzB8bnVtPj4+Mn1mdW5jdGlvbiBmdChzLGIsYyxkKXtpZihzPT09MClyZXR1cm4gYiZjfH5iJmQ7aWYocz09PTIpcmV0dXJuIGImY3xiJmR8YyZkO3JldHVybiBiXmNeZH1TaGExLnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKE0pe3ZhciBXPXRoaXMuX3c7dmFyIGE9dGhpcy5fYXwwO3ZhciBiPXRoaXMuX2J8MDt2YXIgYz10aGlzLl9jfDA7dmFyIGQ9dGhpcy5fZHwwO3ZhciBlPXRoaXMuX2V8MDtmb3IodmFyIGk9MDtpPDE2OysraSlXW2ldPU0ucmVhZEludDMyQkUoaSo0KTtmb3IoO2k8ODA7KytpKVdbaV09cm90bDEoV1tpLTNdXldbaS04XV5XW2ktMTRdXldbaS0xNl0pO2Zvcih2YXIgaj0wO2o8ODA7KytqKXt2YXIgcz1+fihqLzIwKTt2YXIgdD1yb3RsNShhKStmdChzLGIsYyxkKStlK1dbal0rS1tzXXwwO2U9ZDtkPWM7Yz1yb3RsMzAoYik7Yj1hO2E9dH10aGlzLl9hPWErdGhpcy5fYXwwO3RoaXMuX2I9Yit0aGlzLl9ifDA7dGhpcy5fYz1jK3RoaXMuX2N8MDt0aGlzLl9kPWQrdGhpcy5fZHwwO3RoaXMuX2U9ZSt0aGlzLl9lfDB9O1NoYTEucHJvdG90eXBlLl9oYXNoPWZ1bmN0aW9uKCl7dmFyIEg9QnVmZmVyLmFsbG9jVW5zYWZlKDIwKTtILndyaXRlSW50MzJCRSh0aGlzLl9hfDAsMCk7SC53cml0ZUludDMyQkUodGhpcy5fYnwwLDQpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2N8MCw4KTtILndyaXRlSW50MzJCRSh0aGlzLl9kfDAsMTIpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2V8MCwxNik7cmV0dXJuIEh9O21vZHVsZS5leHBvcnRzPVNoYTF9LHsiLi9oYXNoIjo5MCxpbmhlcml0czozNiwic2FmZS1idWZmZXIiOjc5fV0sOTQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBTaGEyNTY9cmVxdWlyZSgiLi9zaGEyNTYiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBXPW5ldyBBcnJheSg2NCk7ZnVuY3Rpb24gU2hhMjI0KCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDY0LDU2KX1pbmhlcml0cyhTaGEyMjQsU2hhMjU2KTtTaGEyMjQucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLl9hPTMyMzgzNzEwMzI7dGhpcy5fYj05MTQxNTA2NjM7dGhpcy5fYz04MTI3MDI5OTk7dGhpcy5fZD00MTQ0OTEyNjk3O3RoaXMuX2U9NDI5MDc3NTg1Nzt0aGlzLl9mPTE3NTA2MDMwMjU7dGhpcy5fZz0xNjk0MDc2ODM5O3RoaXMuX2g9MzIwNDA3NTQyODtyZXR1cm4gdGhpc307U2hhMjI0LnByb3RvdHlwZS5faGFzaD1mdW5jdGlvbigpe3ZhciBIPUJ1ZmZlci5hbGxvY1Vuc2FmZSgyOCk7SC53cml0ZUludDMyQkUodGhpcy5fYSwwKTtILndyaXRlSW50MzJCRSh0aGlzLl9iLDQpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2MsOCk7SC53cml0ZUludDMyQkUodGhpcy5fZCwxMik7SC53cml0ZUludDMyQkUodGhpcy5fZSwxNik7SC53cml0ZUludDMyQkUodGhpcy5fZiwyMCk7SC53cml0ZUludDMyQkUodGhpcy5fZywyNCk7cmV0dXJuIEh9O21vZHVsZS5leHBvcnRzPVNoYTIyNH0seyIuL2hhc2giOjkwLCIuL3NoYTI1NiI6OTUsaW5oZXJpdHM6MzYsInNhZmUtYnVmZmVyIjo3OX1dLDk1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBLPVsxMTE2MzUyNDA4LDE4OTk0NDc0NDEsMzA0OTMyMzQ3MSwzOTIxMDA5NTczLDk2MTk4NzE2MywxNTA4OTcwOTkzLDI0NTM2MzU3NDgsMjg3MDc2MzIyMSwzNjI0MzgxMDgwLDMxMDU5ODQwMSw2MDcyMjUyNzgsMTQyNjg4MTk4NywxOTI1MDc4Mzg4LDIxNjIwNzgyMDYsMjYxNDg4ODEwMywzMjQ4MjIyNTgwLDM4MzUzOTA0MDEsNDAyMjIyNDc3NCwyNjQzNDcwNzgsNjA0ODA3NjI4LDc3MDI1NTk4MywxMjQ5MTUwMTIyLDE1NTUwODE2OTIsMTk5NjA2NDk4NiwyNTU0MjIwODgyLDI4MjE4MzQzNDksMjk1Mjk5NjgwOCwzMjEwMzEzNjcxLDMzMzY1NzE4OTEsMzU4NDUyODcxMSwxMTM5MjY5OTMsMzM4MjQxODk1LDY2NjMwNzIwNSw3NzM1Mjk5MTIsMTI5NDc1NzM3MiwxMzk2MTgyMjkxLDE2OTUxODM3MDAsMTk4NjY2MTA1MSwyMTc3MDI2MzUwLDI0NTY5NTYwMzcsMjczMDQ4NTkyMSwyODIwMzAyNDExLDMyNTk3MzA4MDAsMzM0NTc2NDc3MSwzNTE2MDY1ODE3LDM2MDAzNTI4MDQsNDA5NDU3MTkwOSwyNzU0MjMzNDQsNDMwMjI3NzM0LDUwNjk0ODYxNiw2NTkwNjA1NTYsODgzOTk3ODc3LDk1ODEzOTU3MSwxMzIyODIyMjE4LDE1MzcwMDIwNjMsMTc0Nzg3Mzc3OSwxOTU1NTYyMjIyLDIwMjQxMDQ4MTUsMjIyNzczMDQ1MiwyMzYxODUyNDI0LDI0Mjg0MzY0NzQsMjc1NjczNDE4NywzMjA0MDMxNDc5LDMzMjkzMjUyOThdO3ZhciBXPW5ldyBBcnJheSg2NCk7ZnVuY3Rpb24gU2hhMjU2KCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDY0LDU2KX1pbmhlcml0cyhTaGEyNTYsSGFzaCk7U2hhMjU2LnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dGhpcy5fYT0xNzc5MDMzNzAzO3RoaXMuX2I9MzE0NDEzNDI3Nzt0aGlzLl9jPTEwMTM5MDQyNDI7dGhpcy5fZD0yNzczNDgwNzYyO3RoaXMuX2U9MTM1OTg5MzExOTt0aGlzLl9mPTI2MDA4MjI5MjQ7dGhpcy5fZz01Mjg3MzQ2MzU7dGhpcy5faD0xNTQxNDU5MjI1O3JldHVybiB0aGlzfTtmdW5jdGlvbiBjaCh4LHkseil7cmV0dXJuIHpeeCYoeV56KX1mdW5jdGlvbiBtYWooeCx5LHope3JldHVybiB4Jnl8eiYoeHx5KX1mdW5jdGlvbiBzaWdtYTAoeCl7cmV0dXJuKHg+Pj4yfHg8PDMwKV4oeD4+PjEzfHg8PDE5KV4oeD4+PjIyfHg8PDEwKX1mdW5jdGlvbiBzaWdtYTEoeCl7cmV0dXJuKHg+Pj42fHg8PDI2KV4oeD4+PjExfHg8PDIxKV4oeD4+PjI1fHg8PDcpfWZ1bmN0aW9uIGdhbW1hMCh4KXtyZXR1cm4oeD4+Pjd8eDw8MjUpXih4Pj4+MTh8eDw8MTQpXng+Pj4zfWZ1bmN0aW9uIGdhbW1hMSh4KXtyZXR1cm4oeD4+PjE3fHg8PDE1KV4oeD4+PjE5fHg8PDEzKV54Pj4+MTB9U2hhMjU2LnByb3RvdHlwZS5fdXBkYXRlPWZ1bmN0aW9uKE0pe3ZhciBXPXRoaXMuX3c7dmFyIGE9dGhpcy5fYXwwO3ZhciBiPXRoaXMuX2J8MDt2YXIgYz10aGlzLl9jfDA7dmFyIGQ9dGhpcy5fZHwwO3ZhciBlPXRoaXMuX2V8MDt2YXIgZj10aGlzLl9mfDA7dmFyIGc9dGhpcy5fZ3wwO3ZhciBoPXRoaXMuX2h8MDtmb3IodmFyIGk9MDtpPDE2OysraSlXW2ldPU0ucmVhZEludDMyQkUoaSo0KTtmb3IoO2k8NjQ7KytpKVdbaV09Z2FtbWExKFdbaS0yXSkrV1tpLTddK2dhbW1hMChXW2ktMTVdKStXW2ktMTZdfDA7Zm9yKHZhciBqPTA7ajw2NDsrK2ope3ZhciBUMT1oK3NpZ21hMShlKStjaChlLGYsZykrS1tqXStXW2pdfDA7dmFyIFQyPXNpZ21hMChhKSttYWooYSxiLGMpfDA7aD1nO2c9ZjtmPWU7ZT1kK1QxfDA7ZD1jO2M9YjtiPWE7YT1UMStUMnwwfXRoaXMuX2E9YSt0aGlzLl9hfDA7dGhpcy5fYj1iK3RoaXMuX2J8MDt0aGlzLl9jPWMrdGhpcy5fY3wwO3RoaXMuX2Q9ZCt0aGlzLl9kfDA7dGhpcy5fZT1lK3RoaXMuX2V8MDt0aGlzLl9mPWYrdGhpcy5fZnwwO3RoaXMuX2c9Zyt0aGlzLl9nfDA7dGhpcy5faD1oK3RoaXMuX2h8MH07U2hhMjU2LnByb3RvdHlwZS5faGFzaD1mdW5jdGlvbigpe3ZhciBIPUJ1ZmZlci5hbGxvY1Vuc2FmZSgzMik7SC53cml0ZUludDMyQkUodGhpcy5fYSwwKTtILndyaXRlSW50MzJCRSh0aGlzLl9iLDQpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2MsOCk7SC53cml0ZUludDMyQkUodGhpcy5fZCwxMik7SC53cml0ZUludDMyQkUodGhpcy5fZSwxNik7SC53cml0ZUludDMyQkUodGhpcy5fZiwyMCk7SC53cml0ZUludDMyQkUodGhpcy5fZywyNCk7SC53cml0ZUludDMyQkUodGhpcy5faCwyOCk7cmV0dXJuIEh9O21vZHVsZS5leHBvcnRzPVNoYTI1Nn0seyIuL2hhc2giOjkwLGluaGVyaXRzOjM2LCJzYWZlLWJ1ZmZlciI6Nzl9XSw5NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIFNIQTUxMj1yZXF1aXJlKCIuL3NoYTUxMiIpO3ZhciBIYXNoPXJlcXVpcmUoIi4vaGFzaCIpO3ZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7dmFyIFc9bmV3IEFycmF5KDE2MCk7ZnVuY3Rpb24gU2hhMzg0KCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDEyOCwxMTIpfWluaGVyaXRzKFNoYTM4NCxTSEE1MTIpO1NoYTM4NC5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3RoaXMuX2FoPTM0MTgwNzAzNjU7dGhpcy5fYmg9MTY1NDI3MDI1MDt0aGlzLl9jaD0yNDM4NTI5MzcwO3RoaXMuX2RoPTM1NTQ2MjM2MDt0aGlzLl9laD0xNzMxNDA1NDE1O3RoaXMuX2ZoPTIzOTQxODAyMzE7dGhpcy5fZ2g9MzY3NTAwODUyNTt0aGlzLl9oaD0xMjAzMDYyODEzO3RoaXMuX2FsPTMyMzgzNzEwMzI7dGhpcy5fYmw9OTE0MTUwNjYzO3RoaXMuX2NsPTgxMjcwMjk5OTt0aGlzLl9kbD00MTQ0OTEyNjk3O3RoaXMuX2VsPTQyOTA3NzU4NTc7dGhpcy5fZmw9MTc1MDYwMzAyNTt0aGlzLl9nbD0xNjk0MDc2ODM5O3RoaXMuX2hsPTMyMDQwNzU0Mjg7cmV0dXJuIHRoaXN9O1NoYTM4NC5wcm90b3R5cGUuX2hhc2g9ZnVuY3Rpb24oKXt2YXIgSD1CdWZmZXIuYWxsb2NVbnNhZmUoNDgpO2Z1bmN0aW9uIHdyaXRlSW50NjRCRShoLGwsb2Zmc2V0KXtILndyaXRlSW50MzJCRShoLG9mZnNldCk7SC53cml0ZUludDMyQkUobCxvZmZzZXQrNCl9d3JpdGVJbnQ2NEJFKHRoaXMuX2FoLHRoaXMuX2FsLDApO3dyaXRlSW50NjRCRSh0aGlzLl9iaCx0aGlzLl9ibCw4KTt3cml0ZUludDY0QkUodGhpcy5fY2gsdGhpcy5fY2wsMTYpO3dyaXRlSW50NjRCRSh0aGlzLl9kaCx0aGlzLl9kbCwyNCk7d3JpdGVJbnQ2NEJFKHRoaXMuX2VoLHRoaXMuX2VsLDMyKTt3cml0ZUludDY0QkUodGhpcy5fZmgsdGhpcy5fZmwsNDApO3JldHVybiBIfTttb2R1bGUuZXhwb3J0cz1TaGEzODR9LHsiLi9oYXNoIjo5MCwiLi9zaGE1MTIiOjk3LGluaGVyaXRzOjM2LCJzYWZlLWJ1ZmZlciI6Nzl9XSw5NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIEhhc2g9cmVxdWlyZSgiLi9oYXNoIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgSz1bMTExNjM1MjQwOCwzNjA5NzY3NDU4LDE4OTk0NDc0NDEsNjAyODkxNzI1LDMwNDkzMjM0NzEsMzk2NDQ4NDM5OSwzOTIxMDA5NTczLDIxNzMyOTU1NDgsOTYxOTg3MTYzLDQwODE2Mjg0NzIsMTUwODk3MDk5MywzMDUzODM0MjY1LDI0NTM2MzU3NDgsMjkzNzY3MTU3OSwyODcwNzYzMjIxLDM2NjQ2MDk1NjAsMzYyNDM4MTA4MCwyNzM0ODgzMzk0LDMxMDU5ODQwMSwxMTY0OTk2NTQyLDYwNzIyNTI3OCwxMzIzNjEwNzY0LDE0MjY4ODE5ODcsMzU5MDMwNDk5NCwxOTI1MDc4Mzg4LDQwNjgxODIzODMsMjE2MjA3ODIwNiw5OTEzMzYxMTMsMjYxNDg4ODEwMyw2MzM4MDMzMTcsMzI0ODIyMjU4MCwzNDc5Nzc0ODY4LDM4MzUzOTA0MDEsMjY2NjYxMzQ1OCw0MDIyMjI0Nzc0LDk0NDcxMTEzOSwyNjQzNDcwNzgsMjM0MTI2Mjc3Myw2MDQ4MDc2MjgsMjAwNzgwMDkzMyw3NzAyNTU5ODMsMTQ5NTk5MDkwMSwxMjQ5MTUwMTIyLDE4NTY0MzEyMzUsMTU1NTA4MTY5MiwzMTc1MjE4MTMyLDE5OTYwNjQ5ODYsMjE5ODk1MDgzNywyNTU0MjIwODgyLDM5OTk3MTkzMzksMjgyMTgzNDM0OSw3NjY3ODQwMTYsMjk1Mjk5NjgwOCwyNTY2NTk0ODc5LDMyMTAzMTM2NzEsMzIwMzMzNzk1NiwzMzM2NTcxODkxLDEwMzQ0NTcwMjYsMzU4NDUyODcxMSwyNDY2OTQ4OTAxLDExMzkyNjk5MywzNzU4MzI2MzgzLDMzODI0MTg5NSwxNjg3MTc5MzYsNjY2MzA3MjA1LDExODgxNzk5NjQsNzczNTI5OTEyLDE1NDYwNDU3MzQsMTI5NDc1NzM3MiwxNTIyODA1NDg1LDEzOTYxODIyOTEsMjY0MzgzMzgyMywxNjk1MTgzNzAwLDIzNDM1MjczOTAsMTk4NjY2MTA1MSwxMDE0NDc3NDgwLDIxNzcwMjYzNTAsMTIwNjc1OTE0MiwyNDU2OTU2MDM3LDM0NDA3NzYyNywyNzMwNDg1OTIxLDEyOTA4NjM0NjAsMjgyMDMwMjQxMSwzMTU4NDU0MjczLDMyNTk3MzA4MDAsMzUwNTk1MjY1NywzMzQ1NzY0NzcxLDEwNjIxNzAwOCwzNTE2MDY1ODE3LDM2MDYwMDgzNDQsMzYwMDM1MjgwNCwxNDMyNzI1Nzc2LDQwOTQ1NzE5MDksMTQ2NzAzMTU5NCwyNzU0MjMzNDQsODUxMTY5NzIwLDQzMDIyNzczNCwzMTAwODIzNzUyLDUwNjk0ODYxNiwxMzYzMjU4MTk1LDY1OTA2MDU1NiwzNzUwNjg1NTkzLDg4Mzk5Nzg3NywzNzg1MDUwMjgwLDk1ODEzOTU3MSwzMzE4MzA3NDI3LDEzMjI4MjIyMTgsMzgxMjcyMzQwMywxNTM3MDAyMDYzLDIwMDMwMzQ5OTUsMTc0Nzg3Mzc3OSwzNjAyMDM2ODk5LDE5NTU1NjIyMjIsMTU3NTk5MDAxMiwyMDI0MTA0ODE1LDExMjU1OTI5MjgsMjIyNzczMDQ1MiwyNzE2OTA0MzA2LDIzNjE4NTI0MjQsNDQyNzc2MDQ0LDI0Mjg0MzY0NzQsNTkzNjk4MzQ0LDI3NTY3MzQxODcsMzczMzExMDI0OSwzMjA0MDMxNDc5LDI5OTkzNTE1NzMsMzMyOTMyNTI5OCwzODE1OTIwNDI3LDMzOTE1Njk2MTQsMzkyODM4MzkwMCwzNTE1MjY3MjcxLDU2NjI4MDcxMSwzOTQwMTg3NjA2LDM0NTQwNjk1MzQsNDExODYzMDI3MSw0MDAwMjM5OTkyLDExNjQxODQ3NCwxOTE0MTM4NTU0LDE3NDI5MjQyMSwyNzMxMDU1MjcwLDI4OTM4MDM1NiwzMjAzOTkzMDA2LDQ2MDM5MzI2OSwzMjA2MjAzMTUsNjg1NDcxNzMzLDU4NzQ5NjgzNiw4NTIxNDI5NzEsMTA4Njc5Mjg1MSwxMDE3MDM2Mjk4LDM2NTU0MzEwMCwxMTI2MDAwNTgwLDI2MTgyOTc2NzYsMTI4ODAzMzQ3MCwzNDA5ODU1MTU4LDE1MDE1MDU5NDgsNDIzNDUwOTg2NiwxNjA3MTY3OTE1LDk4NzE2NzQ2OCwxODE2NDAyMzE2LDEyNDYxODk1OTFdO3ZhciBXPW5ldyBBcnJheSgxNjApO2Z1bmN0aW9uIFNoYTUxMigpe3RoaXMuaW5pdCgpO3RoaXMuX3c9VztIYXNoLmNhbGwodGhpcywxMjgsMTEyKX1pbmhlcml0cyhTaGE1MTIsSGFzaCk7U2hhNTEyLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dGhpcy5fYWg9MTc3OTAzMzcwMzt0aGlzLl9iaD0zMTQ0MTM0Mjc3O3RoaXMuX2NoPTEwMTM5MDQyNDI7dGhpcy5fZGg9Mjc3MzQ4MDc2Mjt0aGlzLl9laD0xMzU5ODkzMTE5O3RoaXMuX2ZoPTI2MDA4MjI5MjQ7dGhpcy5fZ2g9NTI4NzM0NjM1O3RoaXMuX2hoPTE1NDE0NTkyMjU7dGhpcy5fYWw9NDA4OTIzNTcyMDt0aGlzLl9ibD0yMjI3ODczNTk1O3RoaXMuX2NsPTQyNzExNzU3MjM7dGhpcy5fZGw9MTU5NTc1MDEyOTt0aGlzLl9lbD0yOTE3NTY1MTM3O3RoaXMuX2ZsPTcyNTUxMTE5OTt0aGlzLl9nbD00MjE1Mzg5NTQ3O3RoaXMuX2hsPTMyNzAzMzIwOTtyZXR1cm4gdGhpc307ZnVuY3Rpb24gQ2goeCx5LHope3JldHVybiB6XngmKHleeil9ZnVuY3Rpb24gbWFqKHgseSx6KXtyZXR1cm4geCZ5fHomKHh8eSl9ZnVuY3Rpb24gc2lnbWEwKHgseGwpe3JldHVybih4Pj4+Mjh8eGw8PDQpXih4bD4+PjJ8eDw8MzApXih4bD4+Pjd8eDw8MjUpfWZ1bmN0aW9uIHNpZ21hMSh4LHhsKXtyZXR1cm4oeD4+PjE0fHhsPDwxOCleKHg+Pj4xOHx4bDw8MTQpXih4bD4+Pjl8eDw8MjMpfWZ1bmN0aW9uIEdhbW1hMCh4LHhsKXtyZXR1cm4oeD4+PjF8eGw8PDMxKV4oeD4+Pjh8eGw8PDI0KV54Pj4+N31mdW5jdGlvbiBHYW1tYTBsKHgseGwpe3JldHVybih4Pj4+MXx4bDw8MzEpXih4Pj4+OHx4bDw8MjQpXih4Pj4+N3x4bDw8MjUpfWZ1bmN0aW9uIEdhbW1hMSh4LHhsKXtyZXR1cm4oeD4+PjE5fHhsPDwxMyleKHhsPj4+Mjl8eDw8MyleeD4+PjZ9ZnVuY3Rpb24gR2FtbWExbCh4LHhsKXtyZXR1cm4oeD4+PjE5fHhsPDwxMyleKHhsPj4+Mjl8eDw8MyleKHg+Pj42fHhsPDwyNil9ZnVuY3Rpb24gZ2V0Q2FycnkoYSxiKXtyZXR1cm4gYT4+PjA8Yj4+PjA/MTowfVNoYTUxMi5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihNKXt2YXIgVz10aGlzLl93O3ZhciBhaD10aGlzLl9haHwwO3ZhciBiaD10aGlzLl9iaHwwO3ZhciBjaD10aGlzLl9jaHwwO3ZhciBkaD10aGlzLl9kaHwwO3ZhciBlaD10aGlzLl9laHwwO3ZhciBmaD10aGlzLl9maHwwO3ZhciBnaD10aGlzLl9naHwwO3ZhciBoaD10aGlzLl9oaHwwO3ZhciBhbD10aGlzLl9hbHwwO3ZhciBibD10aGlzLl9ibHwwO3ZhciBjbD10aGlzLl9jbHwwO3ZhciBkbD10aGlzLl9kbHwwO3ZhciBlbD10aGlzLl9lbHwwO3ZhciBmbD10aGlzLl9mbHwwO3ZhciBnbD10aGlzLl9nbHwwO3ZhciBobD10aGlzLl9obHwwO2Zvcih2YXIgaT0wO2k8MzI7aSs9Mil7V1tpXT1NLnJlYWRJbnQzMkJFKGkqNCk7V1tpKzFdPU0ucmVhZEludDMyQkUoaSo0KzQpfWZvcig7aTwxNjA7aSs9Mil7dmFyIHhoPVdbaS0xNSoyXTt2YXIgeGw9V1tpLTE1KjIrMV07dmFyIGdhbW1hMD1HYW1tYTAoeGgseGwpO3ZhciBnYW1tYTBsPUdhbW1hMGwoeGwseGgpO3hoPVdbaS0yKjJdO3hsPVdbaS0yKjIrMV07dmFyIGdhbW1hMT1HYW1tYTEoeGgseGwpO3ZhciBnYW1tYTFsPUdhbW1hMWwoeGwseGgpO3ZhciBXaTdoPVdbaS03KjJdO3ZhciBXaTdsPVdbaS03KjIrMV07dmFyIFdpMTZoPVdbaS0xNioyXTt2YXIgV2kxNmw9V1tpLTE2KjIrMV07dmFyIFdpbD1nYW1tYTBsK1dpN2x8MDt2YXIgV2loPWdhbW1hMCtXaTdoK2dldENhcnJ5KFdpbCxnYW1tYTBsKXwwO1dpbD1XaWwrZ2FtbWExbHwwO1dpaD1XaWgrZ2FtbWExK2dldENhcnJ5KFdpbCxnYW1tYTFsKXwwO1dpbD1XaWwrV2kxNmx8MDtXaWg9V2loK1dpMTZoK2dldENhcnJ5KFdpbCxXaTE2bCl8MDtXW2ldPVdpaDtXW2krMV09V2lsfWZvcih2YXIgaj0wO2o8MTYwO2orPTIpe1dpaD1XW2pdO1dpbD1XW2orMV07dmFyIG1hamg9bWFqKGFoLGJoLGNoKTt2YXIgbWFqbD1tYWooYWwsYmwsY2wpO3ZhciBzaWdtYTBoPXNpZ21hMChhaCxhbCk7dmFyIHNpZ21hMGw9c2lnbWEwKGFsLGFoKTt2YXIgc2lnbWExaD1zaWdtYTEoZWgsZWwpO3ZhciBzaWdtYTFsPXNpZ21hMShlbCxlaCk7dmFyIEtpaD1LW2pdO3ZhciBLaWw9S1tqKzFdO3ZhciBjaGg9Q2goZWgsZmgsZ2gpO3ZhciBjaGw9Q2goZWwsZmwsZ2wpO3ZhciB0MWw9aGwrc2lnbWExbHwwO3ZhciB0MWg9aGgrc2lnbWExaCtnZXRDYXJyeSh0MWwsaGwpfDA7dDFsPXQxbCtjaGx8MDt0MWg9dDFoK2NoaCtnZXRDYXJyeSh0MWwsY2hsKXwwO3QxbD10MWwrS2lsfDA7dDFoPXQxaCtLaWgrZ2V0Q2FycnkodDFsLEtpbCl8MDt0MWw9dDFsK1dpbHwwO3QxaD10MWgrV2loK2dldENhcnJ5KHQxbCxXaWwpfDA7dmFyIHQybD1zaWdtYTBsK21hamx8MDt2YXIgdDJoPXNpZ21hMGgrbWFqaCtnZXRDYXJyeSh0Mmwsc2lnbWEwbCl8MDtoaD1naDtobD1nbDtnaD1maDtnbD1mbDtmaD1laDtmbD1lbDtlbD1kbCt0MWx8MDtlaD1kaCt0MWgrZ2V0Q2FycnkoZWwsZGwpfDA7ZGg9Y2g7ZGw9Y2w7Y2g9Ymg7Y2w9Ymw7Ymg9YWg7Ymw9YWw7YWw9dDFsK3QybHwwO2FoPXQxaCt0MmgrZ2V0Q2FycnkoYWwsdDFsKXwwfXRoaXMuX2FsPXRoaXMuX2FsK2FsfDA7dGhpcy5fYmw9dGhpcy5fYmwrYmx8MDt0aGlzLl9jbD10aGlzLl9jbCtjbHwwO3RoaXMuX2RsPXRoaXMuX2RsK2RsfDA7dGhpcy5fZWw9dGhpcy5fZWwrZWx8MDt0aGlzLl9mbD10aGlzLl9mbCtmbHwwO3RoaXMuX2dsPXRoaXMuX2dsK2dsfDA7dGhpcy5faGw9dGhpcy5faGwraGx8MDt0aGlzLl9haD10aGlzLl9haCthaCtnZXRDYXJyeSh0aGlzLl9hbCxhbCl8MDt0aGlzLl9iaD10aGlzLl9iaCtiaCtnZXRDYXJyeSh0aGlzLl9ibCxibCl8MDt0aGlzLl9jaD10aGlzLl9jaCtjaCtnZXRDYXJyeSh0aGlzLl9jbCxjbCl8MDt0aGlzLl9kaD10aGlzLl9kaCtkaCtnZXRDYXJyeSh0aGlzLl9kbCxkbCl8MDt0aGlzLl9laD10aGlzLl9laCtlaCtnZXRDYXJyeSh0aGlzLl9lbCxlbCl8MDt0aGlzLl9maD10aGlzLl9maCtmaCtnZXRDYXJyeSh0aGlzLl9mbCxmbCl8MDt0aGlzLl9naD10aGlzLl9naCtnaCtnZXRDYXJyeSh0aGlzLl9nbCxnbCl8MDt0aGlzLl9oaD10aGlzLl9oaCtoaCtnZXRDYXJyeSh0aGlzLl9obCxobCl8MH07U2hhNTEyLnByb3RvdHlwZS5faGFzaD1mdW5jdGlvbigpe3ZhciBIPUJ1ZmZlci5hbGxvY1Vuc2FmZSg2NCk7ZnVuY3Rpb24gd3JpdGVJbnQ2NEJFKGgsbCxvZmZzZXQpe0gud3JpdGVJbnQzMkJFKGgsb2Zmc2V0KTtILndyaXRlSW50MzJCRShsLG9mZnNldCs0KX13cml0ZUludDY0QkUodGhpcy5fYWgsdGhpcy5fYWwsMCk7d3JpdGVJbnQ2NEJFKHRoaXMuX2JoLHRoaXMuX2JsLDgpO3dyaXRlSW50NjRCRSh0aGlzLl9jaCx0aGlzLl9jbCwxNik7d3JpdGVJbnQ2NEJFKHRoaXMuX2RoLHRoaXMuX2RsLDI0KTt3cml0ZUludDY0QkUodGhpcy5fZWgsdGhpcy5fZWwsMzIpO3dyaXRlSW50NjRCRSh0aGlzLl9maCx0aGlzLl9mbCw0MCk7d3JpdGVJbnQ2NEJFKHRoaXMuX2doLHRoaXMuX2dsLDQ4KTt3cml0ZUludDY0QkUodGhpcy5faGgsdGhpcy5faGwsNTYpO3JldHVybiBIfTttb2R1bGUuZXhwb3J0cz1TaGE1MTJ9LHsiLi9oYXNoIjo5MCxpbmhlcml0czozNiwic2FmZS1idWZmZXIiOjc5fV0sOTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPVN0cmVhbTt2YXIgRUU9cmVxdWlyZSgiZXZlbnRzIikuRXZlbnRFbWl0dGVyO3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO2luaGVyaXRzKFN0cmVhbSxFRSk7U3RyZWFtLlJlYWRhYmxlPXJlcXVpcmUoInJlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qcyIpO1N0cmVhbS5Xcml0YWJsZT1yZXF1aXJlKCJyZWFkYWJsZS1zdHJlYW0vd3JpdGFibGUuanMiKTtTdHJlYW0uRHVwbGV4PXJlcXVpcmUoInJlYWRhYmxlLXN0cmVhbS9kdXBsZXguanMiKTtTdHJlYW0uVHJhbnNmb3JtPXJlcXVpcmUoInJlYWRhYmxlLXN0cmVhbS90cmFuc2Zvcm0uanMiKTtTdHJlYW0uUGFzc1Rocm91Z2g9cmVxdWlyZSgicmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzIik7U3RyZWFtLlN0cmVhbT1TdHJlYW07ZnVuY3Rpb24gU3RyZWFtKCl7RUUuY2FsbCh0aGlzKX1TdHJlYW0ucHJvdG90eXBlLnBpcGU9ZnVuY3Rpb24oZGVzdCxvcHRpb25zKXt2YXIgc291cmNlPXRoaXM7ZnVuY3Rpb24gb25kYXRhKGNodW5rKXtpZihkZXN0LndyaXRhYmxlKXtpZihmYWxzZT09PWRlc3Qud3JpdGUoY2h1bmspJiZzb3VyY2UucGF1c2Upe3NvdXJjZS5wYXVzZSgpfX19c291cmNlLm9uKCJkYXRhIixvbmRhdGEpO2Z1bmN0aW9uIG9uZHJhaW4oKXtpZihzb3VyY2UucmVhZGFibGUmJnNvdXJjZS5yZXN1bWUpe3NvdXJjZS5yZXN1bWUoKX19ZGVzdC5vbigiZHJhaW4iLG9uZHJhaW4pO2lmKCFkZXN0Ll9pc1N0ZGlvJiYoIW9wdGlvbnN8fG9wdGlvbnMuZW5kIT09ZmFsc2UpKXtzb3VyY2Uub24oImVuZCIsb25lbmQpO3NvdXJjZS5vbigiY2xvc2UiLG9uY2xvc2UpfXZhciBkaWRPbkVuZD1mYWxzZTtmdW5jdGlvbiBvbmVuZCgpe2lmKGRpZE9uRW5kKXJldHVybjtkaWRPbkVuZD10cnVlO2Rlc3QuZW5kKCl9ZnVuY3Rpb24gb25jbG9zZSgpe2lmKGRpZE9uRW5kKXJldHVybjtkaWRPbkVuZD10cnVlO2lmKHR5cGVvZiBkZXN0LmRlc3Ryb3k9PT0iZnVuY3Rpb24iKWRlc3QuZGVzdHJveSgpfWZ1bmN0aW9uIG9uZXJyb3IoZXIpe2NsZWFudXAoKTtpZihFRS5saXN0ZW5lckNvdW50KHRoaXMsImVycm9yIik9PT0wKXt0aHJvdyBlcn19c291cmNlLm9uKCJlcnJvciIsb25lcnJvcik7ZGVzdC5vbigiZXJyb3IiLG9uZXJyb3IpO2Z1bmN0aW9uIGNsZWFudXAoKXtzb3VyY2UucmVtb3ZlTGlzdGVuZXIoImRhdGEiLG9uZGF0YSk7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZHJhaW4iLG9uZHJhaW4pO3NvdXJjZS5yZW1vdmVMaXN0ZW5lcigiZW5kIixvbmVuZCk7c291cmNlLnJlbW92ZUxpc3RlbmVyKCJjbG9zZSIsb25jbG9zZSk7c291cmNlLnJlbW92ZUxpc3RlbmVyKCJlcnJvciIsb25lcnJvcik7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZXJyb3IiLG9uZXJyb3IpO3NvdXJjZS5yZW1vdmVMaXN0ZW5lcigiZW5kIixjbGVhbnVwKTtzb3VyY2UucmVtb3ZlTGlzdGVuZXIoImNsb3NlIixjbGVhbnVwKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJjbG9zZSIsY2xlYW51cCl9c291cmNlLm9uKCJlbmQiLGNsZWFudXApO3NvdXJjZS5vbigiY2xvc2UiLGNsZWFudXApO2Rlc3Qub24oImNsb3NlIixjbGVhbnVwKTtkZXN0LmVtaXQoInBpcGUiLHNvdXJjZSk7cmV0dXJuIGRlc3R9fSx7ZXZlbnRzOjMzLGluaGVyaXRzOjM2LCJyZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzIjo2NSwicmVhZGFibGUtc3RyZWFtL3Bhc3N0aHJvdWdoLmpzIjo3NCwicmVhZGFibGUtc3RyZWFtL3JlYWRhYmxlLmpzIjo3NSwicmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybS5qcyI6NzYsInJlYWRhYmxlLXN0cmVhbS93cml0YWJsZS5qcyI6Nzd9XSw5OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO3ZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7dmFyIGlzRW5jb2Rpbmc9QnVmZmVyLmlzRW5jb2Rpbmd8fGZ1bmN0aW9uKGVuY29kaW5nKXtlbmNvZGluZz0iIitlbmNvZGluZztzd2l0Y2goZW5jb2RpbmcmJmVuY29kaW5nLnRvTG93ZXJDYXNlKCkpe2Nhc2UiaGV4IjpjYXNlInV0ZjgiOmNhc2UidXRmLTgiOmNhc2UiYXNjaWkiOmNhc2UiYmluYXJ5IjpjYXNlImJhc2U2NCI6Y2FzZSJ1Y3MyIjpjYXNlInVjcy0yIjpjYXNlInV0ZjE2bGUiOmNhc2UidXRmLTE2bGUiOmNhc2UicmF3IjpyZXR1cm4gdHJ1ZTtkZWZhdWx0OnJldHVybiBmYWxzZX19O2Z1bmN0aW9uIF9ub3JtYWxpemVFbmNvZGluZyhlbmMpe2lmKCFlbmMpcmV0dXJuInV0ZjgiO3ZhciByZXRyaWVkO3doaWxlKHRydWUpe3N3aXRjaChlbmMpe2Nhc2UidXRmOCI6Y2FzZSJ1dGYtOCI6cmV0dXJuInV0ZjgiO2Nhc2UidWNzMiI6Y2FzZSJ1Y3MtMiI6Y2FzZSJ1dGYxNmxlIjpjYXNlInV0Zi0xNmxlIjpyZXR1cm4idXRmMTZsZSI7Y2FzZSJsYXRpbjEiOmNhc2UiYmluYXJ5IjpyZXR1cm4ibGF0aW4xIjtjYXNlImJhc2U2NCI6Y2FzZSJhc2NpaSI6Y2FzZSJoZXgiOnJldHVybiBlbmM7ZGVmYXVsdDppZihyZXRyaWVkKXJldHVybjtlbmM9KCIiK2VuYykudG9Mb3dlckNhc2UoKTtyZXRyaWVkPXRydWV9fX1mdW5jdGlvbiBub3JtYWxpemVFbmNvZGluZyhlbmMpe3ZhciBuZW5jPV9ub3JtYWxpemVFbmNvZGluZyhlbmMpO2lmKHR5cGVvZiBuZW5jIT09InN0cmluZyImJihCdWZmZXIuaXNFbmNvZGluZz09PWlzRW5jb2Rpbmd8fCFpc0VuY29kaW5nKGVuYykpKXRocm93IG5ldyBFcnJvcigiVW5rbm93biBlbmNvZGluZzogIitlbmMpO3JldHVybiBuZW5jfHxlbmN9ZXhwb3J0cy5TdHJpbmdEZWNvZGVyPVN0cmluZ0RlY29kZXI7ZnVuY3Rpb24gU3RyaW5nRGVjb2RlcihlbmNvZGluZyl7dGhpcy5lbmNvZGluZz1ub3JtYWxpemVFbmNvZGluZyhlbmNvZGluZyk7dmFyIG5iO3N3aXRjaCh0aGlzLmVuY29kaW5nKXtjYXNlInV0ZjE2bGUiOnRoaXMudGV4dD11dGYxNlRleHQ7dGhpcy5lbmQ9dXRmMTZFbmQ7bmI9NDticmVhaztjYXNlInV0ZjgiOnRoaXMuZmlsbExhc3Q9dXRmOEZpbGxMYXN0O25iPTQ7YnJlYWs7Y2FzZSJiYXNlNjQiOnRoaXMudGV4dD1iYXNlNjRUZXh0O3RoaXMuZW5kPWJhc2U2NEVuZDtuYj0zO2JyZWFrO2RlZmF1bHQ6dGhpcy53cml0ZT1zaW1wbGVXcml0ZTt0aGlzLmVuZD1zaW1wbGVFbmQ7cmV0dXJufXRoaXMubGFzdE5lZWQ9MDt0aGlzLmxhc3RUb3RhbD0wO3RoaXMubGFzdENoYXI9QnVmZmVyLmFsbG9jVW5zYWZlKG5iKX1TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS53cml0ZT1mdW5jdGlvbihidWYpe2lmKGJ1Zi5sZW5ndGg9PT0wKXJldHVybiIiO3ZhciByO3ZhciBpO2lmKHRoaXMubGFzdE5lZWQpe3I9dGhpcy5maWxsTGFzdChidWYpO2lmKHI9PT11bmRlZmluZWQpcmV0dXJuIiI7aT10aGlzLmxhc3ROZWVkO3RoaXMubGFzdE5lZWQ9MH1lbHNle2k9MH1pZihpPGJ1Zi5sZW5ndGgpcmV0dXJuIHI/cit0aGlzLnRleHQoYnVmLGkpOnRoaXMudGV4dChidWYsaSk7cmV0dXJuIHJ8fCIifTtTdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQ9dXRmOEVuZDtTdHJpbmdEZWNvZGVyLnByb3RvdHlwZS50ZXh0PXV0ZjhUZXh0O1N0cmluZ0RlY29kZXIucHJvdG90eXBlLmZpbGxMYXN0PWZ1bmN0aW9uKGJ1Zil7aWYodGhpcy5sYXN0TmVlZDw9YnVmLmxlbmd0aCl7YnVmLmNvcHkodGhpcy5sYXN0Q2hhcix0aGlzLmxhc3RUb3RhbC10aGlzLmxhc3ROZWVkLDAsdGhpcy5sYXN0TmVlZCk7cmV0dXJuIHRoaXMubGFzdENoYXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywwLHRoaXMubGFzdFRvdGFsKX1idWYuY29weSh0aGlzLmxhc3RDaGFyLHRoaXMubGFzdFRvdGFsLXRoaXMubGFzdE5lZWQsMCxidWYubGVuZ3RoKTt0aGlzLmxhc3ROZWVkLT1idWYubGVuZ3RofTtmdW5jdGlvbiB1dGY4Q2hlY2tCeXRlKGJ5dGUpe2lmKGJ5dGU8PTEyNylyZXR1cm4gMDtlbHNlIGlmKGJ5dGU+PjU9PT02KXJldHVybiAyO2Vsc2UgaWYoYnl0ZT4+ND09PTE0KXJldHVybiAzO2Vsc2UgaWYoYnl0ZT4+Mz09PTMwKXJldHVybiA0O3JldHVybiBieXRlPj42PT09Mj8tMTotMn1mdW5jdGlvbiB1dGY4Q2hlY2tJbmNvbXBsZXRlKHNlbGYsYnVmLGkpe3ZhciBqPWJ1Zi5sZW5ndGgtMTtpZihqPGkpcmV0dXJuIDA7dmFyIG5iPXV0ZjhDaGVja0J5dGUoYnVmW2pdKTtpZihuYj49MCl7aWYobmI+MClzZWxmLmxhc3ROZWVkPW5iLTE7cmV0dXJuIG5ifWlmKC0tajxpfHxuYj09PS0yKXJldHVybiAwO25iPXV0ZjhDaGVja0J5dGUoYnVmW2pdKTtpZihuYj49MCl7aWYobmI+MClzZWxmLmxhc3ROZWVkPW5iLTI7cmV0dXJuIG5ifWlmKC0tajxpfHxuYj09PS0yKXJldHVybiAwO25iPXV0ZjhDaGVja0J5dGUoYnVmW2pdKTtpZihuYj49MCl7aWYobmI+MCl7aWYobmI9PT0yKW5iPTA7ZWxzZSBzZWxmLmxhc3ROZWVkPW5iLTN9cmV0dXJuIG5ifXJldHVybiAwfWZ1bmN0aW9uIHV0ZjhDaGVja0V4dHJhQnl0ZXMoc2VsZixidWYscCl7aWYoKGJ1ZlswXSYxOTIpIT09MTI4KXtzZWxmLmxhc3ROZWVkPTA7cmV0dXJuIu+/vSJ9aWYoc2VsZi5sYXN0TmVlZD4xJiZidWYubGVuZ3RoPjEpe2lmKChidWZbMV0mMTkyKSE9PTEyOCl7c2VsZi5sYXN0TmVlZD0xO3JldHVybiLvv70ifWlmKHNlbGYubGFzdE5lZWQ+MiYmYnVmLmxlbmd0aD4yKXtpZigoYnVmWzJdJjE5MikhPT0xMjgpe3NlbGYubGFzdE5lZWQ9MjtyZXR1cm4i77+9In19fX1mdW5jdGlvbiB1dGY4RmlsbExhc3QoYnVmKXt2YXIgcD10aGlzLmxhc3RUb3RhbC10aGlzLmxhc3ROZWVkO3ZhciByPXV0ZjhDaGVja0V4dHJhQnl0ZXModGhpcyxidWYscCk7aWYociE9PXVuZGVmaW5lZClyZXR1cm4gcjtpZih0aGlzLmxhc3ROZWVkPD1idWYubGVuZ3RoKXtidWYuY29weSh0aGlzLmxhc3RDaGFyLHAsMCx0aGlzLmxhc3ROZWVkKTtyZXR1cm4gdGhpcy5sYXN0Q2hhci50b1N0cmluZyh0aGlzLmVuY29kaW5nLDAsdGhpcy5sYXN0VG90YWwpfWJ1Zi5jb3B5KHRoaXMubGFzdENoYXIscCwwLGJ1Zi5sZW5ndGgpO3RoaXMubGFzdE5lZWQtPWJ1Zi5sZW5ndGh9ZnVuY3Rpb24gdXRmOFRleHQoYnVmLGkpe3ZhciB0b3RhbD11dGY4Q2hlY2tJbmNvbXBsZXRlKHRoaXMsYnVmLGkpO2lmKCF0aGlzLmxhc3ROZWVkKXJldHVybiBidWYudG9TdHJpbmcoInV0ZjgiLGkpO3RoaXMubGFzdFRvdGFsPXRvdGFsO3ZhciBlbmQ9YnVmLmxlbmd0aC0odG90YWwtdGhpcy5sYXN0TmVlZCk7YnVmLmNvcHkodGhpcy5sYXN0Q2hhciwwLGVuZCk7cmV0dXJuIGJ1Zi50b1N0cmluZygidXRmOCIsaSxlbmQpfWZ1bmN0aW9uIHV0ZjhFbmQoYnVmKXt2YXIgcj1idWYmJmJ1Zi5sZW5ndGg/dGhpcy53cml0ZShidWYpOiIiO2lmKHRoaXMubGFzdE5lZWQpcmV0dXJuIHIrIu+/vSI7cmV0dXJuIHJ9ZnVuY3Rpb24gdXRmMTZUZXh0KGJ1ZixpKXtpZigoYnVmLmxlbmd0aC1pKSUyPT09MCl7dmFyIHI9YnVmLnRvU3RyaW5nKCJ1dGYxNmxlIixpKTtpZihyKXt2YXIgYz1yLmNoYXJDb2RlQXQoci5sZW5ndGgtMSk7aWYoYz49NTUyOTYmJmM8PTU2MzE5KXt0aGlzLmxhc3ROZWVkPTI7dGhpcy5sYXN0VG90YWw9NDt0aGlzLmxhc3RDaGFyWzBdPWJ1ZltidWYubGVuZ3RoLTJdO3RoaXMubGFzdENoYXJbMV09YnVmW2J1Zi5sZW5ndGgtMV07cmV0dXJuIHIuc2xpY2UoMCwtMSl9fXJldHVybiByfXRoaXMubGFzdE5lZWQ9MTt0aGlzLmxhc3RUb3RhbD0yO3RoaXMubGFzdENoYXJbMF09YnVmW2J1Zi5sZW5ndGgtMV07cmV0dXJuIGJ1Zi50b1N0cmluZygidXRmMTZsZSIsaSxidWYubGVuZ3RoLTEpfWZ1bmN0aW9uIHV0ZjE2RW5kKGJ1Zil7dmFyIHI9YnVmJiZidWYubGVuZ3RoP3RoaXMud3JpdGUoYnVmKToiIjtpZih0aGlzLmxhc3ROZWVkKXt2YXIgZW5kPXRoaXMubGFzdFRvdGFsLXRoaXMubGFzdE5lZWQ7cmV0dXJuIHIrdGhpcy5sYXN0Q2hhci50b1N0cmluZygidXRmMTZsZSIsMCxlbmQpfXJldHVybiByfWZ1bmN0aW9uIGJhc2U2NFRleHQoYnVmLGkpe3ZhciBuPShidWYubGVuZ3RoLWkpJTM7aWYobj09PTApcmV0dXJuIGJ1Zi50b1N0cmluZygiYmFzZTY0IixpKTt0aGlzLmxhc3ROZWVkPTMtbjt0aGlzLmxhc3RUb3RhbD0zO2lmKG49PT0xKXt0aGlzLmxhc3RDaGFyWzBdPWJ1ZltidWYubGVuZ3RoLTFdfWVsc2V7dGhpcy5sYXN0Q2hhclswXT1idWZbYnVmLmxlbmd0aC0yXTt0aGlzLmxhc3RDaGFyWzFdPWJ1ZltidWYubGVuZ3RoLTFdfXJldHVybiBidWYudG9TdHJpbmcoImJhc2U2NCIsaSxidWYubGVuZ3RoLW4pfWZ1bmN0aW9uIGJhc2U2NEVuZChidWYpe3ZhciByPWJ1ZiYmYnVmLmxlbmd0aD90aGlzLndyaXRlKGJ1Zik6IiI7aWYodGhpcy5sYXN0TmVlZClyZXR1cm4gcit0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKCJiYXNlNjQiLDAsMy10aGlzLmxhc3ROZWVkKTtyZXR1cm4gcn1mdW5jdGlvbiBzaW1wbGVXcml0ZShidWYpe3JldHVybiBidWYudG9TdHJpbmcodGhpcy5lbmNvZGluZyl9ZnVuY3Rpb24gc2ltcGxlRW5kKGJ1Zil7cmV0dXJuIGJ1ZiYmYnVmLmxlbmd0aD90aGlzLndyaXRlKGJ1Zik6IiJ9fSx7InNhZmUtYnVmZmVyIjo3OX1dLDEwMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHNldEltbWVkaWF0ZSxjbGVhckltbWVkaWF0ZSl7dmFyIG5leHRUaWNrPXJlcXVpcmUoInByb2Nlc3MvYnJvd3Nlci5qcyIpLm5leHRUaWNrO3ZhciBhcHBseT1GdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7dmFyIHNsaWNlPUFycmF5LnByb3RvdHlwZS5zbGljZTt2YXIgaW1tZWRpYXRlSWRzPXt9O3ZhciBuZXh0SW1tZWRpYXRlSWQ9MDtleHBvcnRzLnNldFRpbWVvdXQ9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LHdpbmRvdyxhcmd1bWVudHMpLGNsZWFyVGltZW91dCl9O2V4cG9ydHMuc2V0SW50ZXJ2YWw9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCx3aW5kb3csYXJndW1lbnRzKSxjbGVhckludGVydmFsKX07ZXhwb3J0cy5jbGVhclRpbWVvdXQ9ZXhwb3J0cy5jbGVhckludGVydmFsPWZ1bmN0aW9uKHRpbWVvdXQpe3RpbWVvdXQuY2xvc2UoKX07ZnVuY3Rpb24gVGltZW91dChpZCxjbGVhckZuKXt0aGlzLl9pZD1pZDt0aGlzLl9jbGVhckZuPWNsZWFyRm59VGltZW91dC5wcm90b3R5cGUudW5yZWY9VGltZW91dC5wcm90b3R5cGUucmVmPWZ1bmN0aW9uKCl7fTtUaW1lb3V0LnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3RoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csdGhpcy5faWQpfTtleHBvcnRzLmVucm9sbD1mdW5jdGlvbihpdGVtLG1zZWNzKXtjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7aXRlbS5faWRsZVRpbWVvdXQ9bXNlY3N9O2V4cG9ydHMudW5lbnJvbGw9ZnVuY3Rpb24oaXRlbSl7Y2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO2l0ZW0uX2lkbGVUaW1lb3V0PS0xfTtleHBvcnRzLl91bnJlZkFjdGl2ZT1leHBvcnRzLmFjdGl2ZT1mdW5jdGlvbihpdGVtKXtjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7dmFyIG1zZWNzPWl0ZW0uX2lkbGVUaW1lb3V0O2lmKG1zZWNzPj0wKXtpdGVtLl9pZGxlVGltZW91dElkPXNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCl7aWYoaXRlbS5fb25UaW1lb3V0KWl0ZW0uX29uVGltZW91dCgpfSxtc2Vjcyl9fTtleHBvcnRzLnNldEltbWVkaWF0ZT10eXBlb2Ygc2V0SW1tZWRpYXRlPT09ImZ1bmN0aW9uIj9zZXRJbW1lZGlhdGU6ZnVuY3Rpb24oZm4pe3ZhciBpZD1uZXh0SW1tZWRpYXRlSWQrKzt2YXIgYXJncz1hcmd1bWVudHMubGVuZ3RoPDI/ZmFsc2U6c2xpY2UuY2FsbChhcmd1bWVudHMsMSk7aW1tZWRpYXRlSWRzW2lkXT10cnVlO25leHRUaWNrKGZ1bmN0aW9uIG9uTmV4dFRpY2soKXtpZihpbW1lZGlhdGVJZHNbaWRdKXtpZihhcmdzKXtmbi5hcHBseShudWxsLGFyZ3MpfWVsc2V7Zm4uY2FsbChudWxsKX1leHBvcnRzLmNsZWFySW1tZWRpYXRlKGlkKX19KTtyZXR1cm4gaWR9O2V4cG9ydHMuY2xlYXJJbW1lZGlhdGU9dHlwZW9mIGNsZWFySW1tZWRpYXRlPT09ImZ1bmN0aW9uIj9jbGVhckltbWVkaWF0ZTpmdW5jdGlvbihpZCl7ZGVsZXRlIGltbWVkaWF0ZUlkc1tpZF19fSkuY2FsbCh0aGlzLHJlcXVpcmUoInRpbWVycyIpLnNldEltbWVkaWF0ZSxyZXF1aXJlKCJ0aW1lcnMiKS5jbGVhckltbWVkaWF0ZSl9LHsicHJvY2Vzcy9icm93c2VyLmpzIjo2NCx0aW1lcnM6MTAwfV0sMTAxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXttb2R1bGUuZXhwb3J0cz1kZXByZWNhdGU7ZnVuY3Rpb24gZGVwcmVjYXRlKGZuLG1zZyl7aWYoY29uZmlnKCJub0RlcHJlY2F0aW9uIikpe3JldHVybiBmbn12YXIgd2FybmVkPWZhbHNlO2Z1bmN0aW9uIGRlcHJlY2F0ZWQoKXtpZighd2FybmVkKXtpZihjb25maWcoInRocm93RGVwcmVjYXRpb24iKSl7dGhyb3cgbmV3IEVycm9yKG1zZyl9ZWxzZSBpZihjb25maWcoInRyYWNlRGVwcmVjYXRpb24iKSl7Y29uc29sZS50cmFjZShtc2cpfWVsc2V7Y29uc29sZS53YXJuKG1zZyl9d2FybmVkPXRydWV9cmV0dXJuIGZuLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gZGVwcmVjYXRlZH1mdW5jdGlvbiBjb25maWcobmFtZSl7dHJ5e2lmKCFnbG9iYWwubG9jYWxTdG9yYWdlKXJldHVybiBmYWxzZX1jYXRjaChfKXtyZXR1cm4gZmFsc2V9dmFyIHZhbD1nbG9iYWwubG9jYWxTdG9yYWdlW25hbWVdO2lmKG51bGw9PXZhbClyZXR1cm4gZmFsc2U7cmV0dXJuIFN0cmluZyh2YWwpLnRvTG93ZXJDYXNlKCk9PT0idHJ1ZSJ9fSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwhPT0idW5kZWZpbmVkIj9nbG9iYWw6dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIj9zZWxmOnR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkIj93aW5kb3c6e30pfSx7fV19LHt9LFsyXSk7","base64").toString("utf8");
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
    var map = new polyfills_1.Map();
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
    var map = new polyfills_1.Map();
    function preSpawn(workerThreadPoolId, poolSize) {
        if (!map.has(workerThreadPoolId)) {
            map.set(workerThreadPoolId, new polyfills_1.Set());
        }
        for (var i = 1; i <= poolSize; i++) {
            var workerThreadId = WorkerThreadId.generate();
            map.get(workerThreadPoolId).add(workerThreadId);
            preSpawnWorkerThread(workerThreadId);
        }
    }
    workerThreadPool.preSpawn = preSpawn;
    function listIds(workerThreadPoolId) {
        var set = map.get(workerThreadPoolId) || new polyfills_1.Set();
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
},{"../sync/types":15,"../sync/utils/environnement":16,"../sync/utils/toBuffer":17,"./WorkerThread":7,"./polyfills":12,"./serializer":13,"buffer":39,"path":55,"run-exclusive":21}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Map = /** @class */ (function () {
    function Map() {
        this.record = [];
    }
    Map.prototype.has = function (key) {
        return this.record
            .map(function (_a) {
            var _key = _a[0];
            return _key;
        })
            .indexOf(key) >= 0;
    };
    Map.prototype.get = function (key) {
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
    Map.prototype.set = function (key, value) {
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
    };
    Map.prototype.delete = function (key) {
        var index = this.record.map(function (_a) {
            var key = _a[0];
            return key;
        }).indexOf(key);
        if (index < 0) {
            return;
        }
        this.record.splice(index, 1);
    };
    Map.prototype.keys = function () {
        return this.record.map(function (_a) {
            var key = _a[0];
            return key;
        });
    };
    return Map;
}());
exports.Map = Map;
var Set = /** @class */ (function () {
    function Set() {
        this.map = new Map();
    }
    Set.prototype.has = function (value) {
        return this.map.has(value);
    };
    Set.prototype.add = function (value) {
        this.map.set(value, true);
    };
    Set.prototype.values = function () {
        return this.map.keys();
    };
    return Set;
}());
exports.Set = Set;

},{}],13:[function(require,module,exports){
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
},{"../sync/utils/toBuffer":17,"buffer":39,"transfer-tools/dist/lib/JSON_CUSTOM":24}],14:[function(require,module,exports){
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
},{"../utils/environnement":16,"../utils/toBuffer":17,"buffer":39}],15:[function(require,module,exports){
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
},{"./utils/toBuffer":17,"buffer":39}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
},{"buffer":39}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":18}],20:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":19}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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
},{"has":20}],24:[function(require,module,exports){
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

},{"super-json":23}],25:[function(require,module,exports){
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
},{"buffer":39}],26:[function(require,module,exports){
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

},{"./SyncEventBase":27}],27:[function(require,module,exports){
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

},{"./SyncEventBaseProtected":28}],28:[function(require,module,exports){
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

},{"./defs":29,"run-exclusive":21}],29:[function(require,module,exports){
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

},{"setprototypeof":22}],30:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var SyncEvent_1 = require("./SyncEvent");
exports.SyncEvent = SyncEvent_1.SyncEvent;
exports.VoidSyncEvent = SyncEvent_1.VoidSyncEvent;
var defs_1 = require("./defs");
exports.EvtError = defs_1.EvtError;

},{"./SyncEvent":26,"./defs":29}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urlGetParameters_1 = require("../../frontend/shared/dist/tools/urlGetParameters");
exports.buildUrl = urlGetParameters_1.buildUrl;
var availablePages = require("../../frontend/shared/dist/lib/availablePages");
exports.availablePages = availablePages;

},{"../../frontend/shared/dist/lib/availablePages":1,"../../frontend/shared/dist/tools/urlGetParameters":2}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("../../gateway/dist/lib/types");
exports.types = types;
var bundledData_1 = require("../../gateway/dist/lib/misc/bundledData");
exports.smuggleBundledDataInHeaders = bundledData_1.smuggleBundledDataInHeaders;
exports.extractBundledDataFromHeaders = bundledData_1.extractBundledDataFromHeaders;
var urlSafeBase64encoderDecoder_1 = require("../../gateway/dist/lib/misc/urlSafeBase64encoderDecoder");
exports.urlSafeB64 = urlSafeBase64encoderDecoder_1.urlSafeB64;
var web_api_declaration_1 = require("../../gateway/dist/web_api_declaration");
exports.webApiPath = web_api_declaration_1.apiPath;

},{"../../gateway/dist/lib/misc/bundledData":3,"../../gateway/dist/lib/misc/urlSafeBase64encoderDecoder":4,"../../gateway/dist/lib/types":5,"../../gateway/dist/web_api_declaration":6}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserSimInfos;
(function (UserSimInfos) {
    UserSimInfos.key = "user_sim_infos";
})(UserSimInfos = exports.UserSimInfos || (exports.UserSimInfos = {}));
;

},{}],34:[function(require,module,exports){
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

},{"../../gateway":32,"../UserSimInfos":33}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frontend_1 = require("../frontend");
var gateway_1 = require("../gateway");
var webApiDeclaration = require("../web_api_declaration");
/** absolutePath should be preceded of "/" eg: "/api/linphonerc" or "/login" */
var buildUrlPath = function (baseDomain, absolutePath) { return "https://web." + baseDomain + absolutePath; };
function buildLoginPageUrl(baseDomain, email) {
    return frontend_1.buildUrl(buildUrlPath(baseDomain, "/" + frontend_1.availablePages.PageName.login), { "webview": "true", email: email });
}
exports.buildLoginPageUrl = buildLoginPageUrl;
exports.buildLinphonercUrl = (function () {
    var methodName = webApiDeclaration.linphonerc.methodName;
    return function (baseDomain, params) { return frontend_1.buildUrl(buildUrlPath(baseDomain, gateway_1.webApiPath + "/" + methodName), params); };
})();
function buildManagerPageUrl(baseDomain) {
    return buildUrlPath(baseDomain, "/" + frontend_1.availablePages.PageName.manager);
}
exports.buildManagerPageUrl = buildManagerPageUrl;
function buildWebviewphoneUrl(baseDomain) {
    return buildUrlPath(baseDomain, "/" + frontend_1.availablePages.PageName.webviewphone);
}
exports.buildWebviewphoneUrl = buildWebviewphoneUrl;

},{"../frontend":31,"../gateway":32,"../web_api_declaration":37}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cryptoLib = require("crypto-lib");
var gateway = require("../gateway");
/** Return Record<string, string> stringified */
function smuggleBundledDataInHeaders(data, towardSimEncryptKeyStr) {
    var encryptorMap = smuggleBundledDataInHeaders.encryptorMap;
    var encryptor = encryptorMap.get(towardSimEncryptKeyStr);
    if (encryptor === undefined) {
        encryptor = cryptoLib.rsa.syncEncryptorFactory(cryptoLib.RsaKey.parse(towardSimEncryptKeyStr));
        encryptorMap.set(towardSimEncryptKeyStr, encryptor);
    }
    return gateway.smuggleBundledDataInHeaders(data, encryptor);
}
exports.smuggleBundledDataInHeaders = smuggleBundledDataInHeaders;
(function (smuggleBundledDataInHeaders) {
    smuggleBundledDataInHeaders.encryptorMap = new Map();
})(smuggleBundledDataInHeaders = exports.smuggleBundledDataInHeaders || (exports.smuggleBundledDataInHeaders = {}));
function extractBundledDataFromHeaders(getHeaderValue, towardUserDecryptKeyStr) {
    var decryptorMap = extractBundledDataFromHeaders.decryptorMap;
    var decryptor = decryptorMap.get(towardUserDecryptKeyStr);
    if (decryptor === undefined) {
        decryptor = cryptoLib.rsa.syncDecryptorFactory(cryptoLib.RsaKey.parse(towardUserDecryptKeyStr));
        decryptorMap.set(towardUserDecryptKeyStr, decryptor);
    }
    return gateway.extractBundledDataFromHeaders(new Proxy({}, { "get": function (_obj, prop) { return getHeaderValue(String(prop)) || undefined; } }), decryptor);
}
exports.extractBundledDataFromHeaders = extractBundledDataFromHeaders;
(function (extractBundledDataFromHeaders) {
    extractBundledDataFromHeaders.decryptorMap = new Map();
})(extractBundledDataFromHeaders = exports.extractBundledDataFromHeaders || (exports.extractBundledDataFromHeaders = {}));

},{"../gateway":32,"crypto-lib":44}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linphonerc;
(function (linphonerc) {
    linphonerc.methodName = "linphonerc";
})(linphonerc = exports.linphonerc || (exports.linphonerc = {}));

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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
},{"base64-js":38,"buffer":39,"ieee754":54}],40:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"../sync/utils/environnement":49,"./WorkerThread/node":41,"./WorkerThread/simulated":42,"./WorkerThread/web":43,"dup":7}],41:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"../../sync/_worker_thread/ThreadMessage":47,"buffer":39,"dup":8,"path":55,"ts-events-extended":65}],42:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9,"ts-events-extended":65}],43:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"ts-events-extended":65}],44:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"../sync/types":48,"../sync/utils/environnement":49,"../sync/utils/toBuffer":50,"./WorkerThread":40,"./polyfills":45,"./serializer":46,"buffer":39,"dup":11,"path":55,"run-exclusive":57}],45:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],46:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"../sync/utils/toBuffer":50,"buffer":39,"dup":13,"transfer-tools/dist/lib/JSON_CUSTOM":60}],47:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"../utils/environnement":49,"../utils/toBuffer":50,"buffer":39,"dup":14}],48:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./utils/toBuffer":50,"buffer":39,"dup":15}],49:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],50:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"buffer":39,"dup":17}],51:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],52:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"./implementation":51,"dup":19}],53:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"function-bind":52}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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
},{"_process":56}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],58:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],59:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23,"has":53}],60:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24,"super-json":59}],61:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"./SyncEventBase":62,"dup":26}],62:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"./SyncEventBaseProtected":63,"dup":27}],63:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./defs":64,"dup":28,"run-exclusive":57}],64:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29,"setprototypeof":58}],65:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"./SyncEvent":61,"./defs":64,"dup":30}],"semasim-mobile":[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./bundledData"));
__export(require("./buildUrl"));
var mobile_1 = require("./UserSimInfos/mobile");
var parseUserSimInfos = mobile_1.UserSimInfos.parse;
exports.parseUserSimInfos = parseUserSimInfos;

},{"./UserSimInfos/mobile":34,"./buildUrl":35,"./bundledData":36}]},{},[]);