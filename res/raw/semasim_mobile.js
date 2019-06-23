var __global=global;
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/* NOTE: Used in the browser. */
Object.defineProperty(exports, "__esModule", { value: true });
var cryptoLib = require("crypto-lib");
var urlSafeBase64encoderDecoder_1 = require("./urlSafeBase64encoderDecoder");
//NOTE: Transpiled to ES3.
var stringTransform = require("transfer-tools/dist/lib/stringTransform");
var header = function (i) { return "Bundled-Data-" + i; };
function smuggleBundledDataInHeaders(data, encryptor, headers) {
    if (headers === void 0) { headers = {}; }
    var followUp = function (value) {
        var split = stringTransform.textSplit(125, urlSafeBase64encoderDecoder_1.urlSafeB64.enc(value));
        for (var i = 0; i < split.length; i++) {
            headers[header(i)] = split[i];
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
        var key = header(i++);
        var part = headers[key] || headers[key.toLowerCase()];
        if (!!part) {
            split.push(part);
        }
        else {
            break;
        }
    }
    if (!split.length) {
        throw new Error("No bundled data in header");
    }
    return cryptoLib.decryptThenParseFactory(decryptor)(urlSafeBase64encoderDecoder_1.urlSafeB64.dec(split.join("")));
}
exports.extractBundledDataFromHeaders = extractBundledDataFromHeaders;

},{"./urlSafeBase64encoderDecoder":2,"crypto-lib":8,"transfer-tools/dist/lib/stringTransform":21}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//NOTE: Transpiled to ES3.
var stringTransform = require("transfer-tools/dist/lib/stringTransform");
exports.urlSafeB64 = stringTransform.transcode("base64", {
    "=": "_",
    "/": "-"
});

},{"transfer-tools/dist/lib/stringTransform":21}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environnement_1 = require("../sync/environnement");
var web_1 = require("./WorkerThread/web");
var node_1 = require("./WorkerThread/node");
var simulated_1 = require("./WorkerThread/simulated");
var WorkerThread;
(function (WorkerThread) {
    function factory(source, isMultithreadingEnabled) {
        return function () { return isMultithreadingEnabled() ?
            environnement_1.isBrowser() ?
                web_1.spawn(source) :
                node_1.spawn(source)
            :
                simulated_1.spawn(source); };
    }
    WorkerThread.factory = factory;
})(WorkerThread = exports.WorkerThread || (exports.WorkerThread = {}));

},{"../sync/environnement":12,"./WorkerThread/node":5,"./WorkerThread/simulated":6,"./WorkerThread/web":7}],5:[function(require,module,exports){
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
},{"../../sync/_worker_thread/ThreadMessage":11,"buffer":33,"path":48,"ts-events-extended":26}],6:[function(require,module,exports){
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

},{"ts-events-extended":26}],7:[function(require,module,exports){
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

},{"ts-events-extended":26}],8:[function(require,module,exports){
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
var environnement_1 = require("../sync/environnement");
var bundle_source = (function () {
    
    var path = require("path");
    return Buffer("KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoIkNhbm5vdCBmaW5kIG1vZHVsZSAnIitpKyInIik7dGhyb3cgYS5jb2RlPSJNT0RVTEVfTk9UX0ZPVU5EIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpKHsxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7dmFyIGVudmlyb25uZW1lbnQ9cmVxdWlyZSgiLi4vZW52aXJvbm5lbWVudCIpO3ZhciB0eXBlc18xPXJlcXVpcmUoIi4uL3R5cGVzIik7dmFyIHRyYW5zZmVyOyhmdW5jdGlvbih0cmFuc2Zlcil7dmFyIFNlcmlhbGl6YWJsZVVpbnQ4QXJyYXk7KGZ1bmN0aW9uKFNlcmlhbGl6YWJsZVVpbnQ4QXJyYXkpe2Z1bmN0aW9uIG1hdGNoKHZhbHVlKXtyZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QmJnZhbHVlLnR5cGU9PT0iVWludDhBcnJheSImJnR5cGVvZiB2YWx1ZS5kYXRhPT09InN0cmluZyJ9U2VyaWFsaXphYmxlVWludDhBcnJheS5tYXRjaD1tYXRjaDtmdW5jdGlvbiBidWlsZCh2YWx1ZSl7cmV0dXJue3R5cGU6IlVpbnQ4QXJyYXkiLGRhdGE6dHlwZXNfMS50b0J1ZmZlcih2YWx1ZSkudG9TdHJpbmcoImJpbmFyeSIpfX1TZXJpYWxpemFibGVVaW50OEFycmF5LmJ1aWxkPWJ1aWxkO2Z1bmN0aW9uIHJlc3RvcmUodmFsdWUpe3JldHVybiBCdWZmZXIuZnJvbSh2YWx1ZS5kYXRhLCJiaW5hcnkiKX1TZXJpYWxpemFibGVVaW50OEFycmF5LnJlc3RvcmU9cmVzdG9yZX0pKFNlcmlhbGl6YWJsZVVpbnQ4QXJyYXl8fChTZXJpYWxpemFibGVVaW50OEFycmF5PXt9KSk7ZnVuY3Rpb24gcHJlcGFyZSh0aHJlYWRNZXNzYWdlKXtpZihlbnZpcm9ubmVtZW50LmlzQnJvd3NlcigpKXt0aHJvdyBuZXcgRXJyb3IoIm9ubHkgZm9yIG5vZGUiKX12YXIgbWVzc2FnZT1mdW5jdGlvbigpe2lmKHRocmVhZE1lc3NhZ2UgaW5zdGFuY2VvZiBVaW50OEFycmF5KXtyZXR1cm4gU2VyaWFsaXphYmxlVWludDhBcnJheS5idWlsZCh0aHJlYWRNZXNzYWdlKX1lbHNlIGlmKHRocmVhZE1lc3NhZ2UgaW5zdGFuY2VvZiBBcnJheSl7cmV0dXJuIHRocmVhZE1lc3NhZ2UubWFwKGZ1bmN0aW9uKGVudHJ5KXtyZXR1cm4gcHJlcGFyZShlbnRyeSl9KX1lbHNlIGlmKHRocmVhZE1lc3NhZ2UgaW5zdGFuY2VvZiBPYmplY3Qpe3ZhciBvdXQ9e307Zm9yKHZhciBrZXkgaW4gdGhyZWFkTWVzc2FnZSl7b3V0W2tleV09cHJlcGFyZSh0aHJlYWRNZXNzYWdlW2tleV0pfXJldHVybiBvdXR9ZWxzZXtyZXR1cm4gdGhyZWFkTWVzc2FnZX19KCk7cmV0dXJuIG1lc3NhZ2V9dHJhbnNmZXIucHJlcGFyZT1wcmVwYXJlO2Z1bmN0aW9uIHJlc3RvcmUobWVzc2FnZSl7aWYoZW52aXJvbm5lbWVudC5pc0Jyb3dzZXIoKSl7dGhyb3cgbmV3IEVycm9yKCJvbmx5IGZvciBub2RlIil9dmFyIHRocmVhZE1lc3NhZ2U9ZnVuY3Rpb24oKXtpZihTZXJpYWxpemFibGVVaW50OEFycmF5Lm1hdGNoKG1lc3NhZ2UpKXtyZXR1cm4gU2VyaWFsaXphYmxlVWludDhBcnJheS5yZXN0b3JlKG1lc3NhZ2UpfWVsc2UgaWYobWVzc2FnZSBpbnN0YW5jZW9mIEFycmF5KXtyZXR1cm4gbWVzc2FnZS5tYXAoZnVuY3Rpb24oZW50cnkpe3JldHVybiByZXN0b3JlKGVudHJ5KX0pfWVsc2UgaWYobWVzc2FnZSBpbnN0YW5jZW9mIE9iamVjdCl7dmFyIG91dD17fTtmb3IodmFyIGtleSBpbiBtZXNzYWdlKXtvdXRba2V5XT1yZXN0b3JlKG1lc3NhZ2Vba2V5XSl9cmV0dXJuIG91dH1lbHNle3JldHVybiBtZXNzYWdlfX0oKTtyZXR1cm4gdGhyZWFkTWVzc2FnZX10cmFuc2Zlci5yZXN0b3JlPXJlc3RvcmV9KSh0cmFuc2Zlcj1leHBvcnRzLnRyYW5zZmVyfHwoZXhwb3J0cy50cmFuc2Zlcj17fSkpfSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vZW52aXJvbm5lbWVudCI6NiwiLi4vdHlwZXMiOjksYnVmZmVyOjI1fV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO3ZhciBjcnlwdG9MaWI9cmVxdWlyZSgiLi4vaW5kZXgiKTt2YXIgZW52aXJvbm5lbWVudD1yZXF1aXJlKCIuLi9lbnZpcm9ubmVtZW50Iik7dmFyIFRocmVhZE1lc3NhZ2VfMT1yZXF1aXJlKCIuL1RocmVhZE1lc3NhZ2UiKTtpZihmdW5jdGlvbigpe2lmKHR5cGVvZiBfX3NpbXVsYXRlZE1haW5UaHJlYWRBcGkhPT0idW5kZWZpbmVkIil7cmV0dXJuIGZhbHNlfXZhciBpc01haW5UaGVhZD1lbnZpcm9ubmVtZW50LmlzQnJvd3NlcigpP3R5cGVvZiBkb2N1bWVudCE9PSJ1bmRlZmluZWQiOnR5cGVvZiBfX3Byb2Nlc3Nfbm9kZT09PSJ1bmRlZmluZWQiO3JldHVybiBpc01haW5UaGVhZH0oKSl7X19jcnlwdG9MaWI9Y3J5cHRvTGlifWVsc2V7dmFyIG1haW5UaHJlYWRBcGlfMT10eXBlb2YgX19zaW11bGF0ZWRNYWluVGhyZWFkQXBpIT09InVuZGVmaW5lZCI/X19zaW11bGF0ZWRNYWluVGhyZWFkQXBpOmVudmlyb25uZW1lbnQuaXNCcm93c2VyKCk/e3NlbmRSZXNwb25zZTpzZWxmLnBvc3RNZXNzYWdlLmJpbmQoc2VsZiksc2V0QWN0aW9uTGlzdGVuZXI6ZnVuY3Rpb24oYWN0aW9uTGlzdGVuZXIpe3JldHVybiBhZGRFdmVudExpc3RlbmVyKCJtZXNzYWdlIixmdW5jdGlvbihfYSl7dmFyIGRhdGE9X2EuZGF0YTtyZXR1cm4gYWN0aW9uTGlzdGVuZXIoZGF0YSl9KX19OntzZW5kUmVzcG9uc2U6ZnVuY3Rpb24ocmVzcG9uc2Upe3JldHVybiBfX3Byb2Nlc3Nfbm9kZS5zZW5kKFRocmVhZE1lc3NhZ2VfMS50cmFuc2Zlci5wcmVwYXJlKHJlc3BvbnNlKSl9LHNldEFjdGlvbkxpc3RlbmVyOmZ1bmN0aW9uKGFjdGlvbkxpc3RlbmVyKXtyZXR1cm4gX19wcm9jZXNzX25vZGUub24oIm1lc3NhZ2UiLGZ1bmN0aW9uKG1lc3NhZ2Upe3JldHVybiBhY3Rpb25MaXN0ZW5lcihUaHJlYWRNZXNzYWdlXzEudHJhbnNmZXIucmVzdG9yZShtZXNzYWdlKSl9KX19O3ZhciBjaXBoZXJJbnN0YW5jZXNfMT1uZXcgTWFwO21haW5UaHJlYWRBcGlfMS5zZXRBY3Rpb25MaXN0ZW5lcihmdW5jdGlvbihhY3Rpb24pe3ZhciBfYSxfYjtzd2l0Y2goYWN0aW9uLmFjdGlvbil7Y2FzZSJHZW5lcmF0ZVJzYUtleXMiOm1haW5UaHJlYWRBcGlfMS5zZW5kUmVzcG9uc2UoZnVuY3Rpb24oKXt2YXIgX2E7dmFyIHJlc3BvbnNlPXthY3Rpb25JZDphY3Rpb24uYWN0aW9uSWQsb3V0cHV0czooX2E9Y3J5cHRvTGliLnJzYSkuc3luY0dlbmVyYXRlS2V5cy5hcHBseShfYSxhY3Rpb24ucGFyYW1zKX07cmV0dXJuIHJlc3BvbnNlfSgpKTticmVhaztjYXNlIkNpcGhlckZhY3RvcnkiOmNpcGhlckluc3RhbmNlc18xLnNldChhY3Rpb24uY2lwaGVySW5zdGFuY2VSZWYsKF9hPWNyeXB0b0xpYlthY3Rpb24uY2lwaGVyTmFtZV0pW2Z1bmN0aW9uKCl7c3dpdGNoKGFjdGlvbi5jb21wb25lbnRzKXtjYXNlIkRlY3J5cHRvciI6cmV0dXJuInN5bmNEZWNyeXB0b3JGYWN0b3J5IjtjYXNlIkVuY3J5cHRvciI6cmV0dXJuInN5bmNFbmNyeXB0b3JGYWN0b3J5IjtjYXNlIkVuY3J5cHRvckRlY3J5cHRvciI6cmV0dXJuInN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5In19KCldLmFwcGx5KF9hLGFjdGlvbi5wYXJhbXMpKTticmVhaztjYXNlIkVuY3J5cHRPckRlY3J5cHQiOnt2YXIgb3V0cHV0XzE9Y2lwaGVySW5zdGFuY2VzXzEuZ2V0KGFjdGlvbi5jaXBoZXJJbnN0YW5jZVJlZilbYWN0aW9uLm1ldGhvZF0oYWN0aW9uLmlucHV0KTttYWluVGhyZWFkQXBpXzEuc2VuZFJlc3BvbnNlKGZ1bmN0aW9uKCl7dmFyIHJlc3BvbnNlPXthY3Rpb25JZDphY3Rpb24uYWN0aW9uSWQsb3V0cHV0Om91dHB1dF8xfTtyZXR1cm4gcmVzcG9uc2V9KCksW291dHB1dF8xLmJ1ZmZlcl0pfWJyZWFrO2Nhc2UiU2NyeXB0SGFzaCI6e3ZhciBkaWdlc3RfMT0oX2I9Y3J5cHRvTGliLnNjcnlwdCkuc3luY0hhc2guYXBwbHkoX2IsYWN0aW9uLnBhcmFtcy5jb25jYXQoW2Z1bmN0aW9uKHBlcmNlbnQpe3JldHVybiBtYWluVGhyZWFkQXBpXzEuc2VuZFJlc3BvbnNlKGZ1bmN0aW9uKCl7dmFyIHJlc3BvbnNlPXthY3Rpb25JZDphY3Rpb24uYWN0aW9uSWQscGVyY2VudDpwZXJjZW50fTtyZXR1cm4gcmVzcG9uc2V9KCkpfV0pKTttYWluVGhyZWFkQXBpXzEuc2VuZFJlc3BvbnNlKGZ1bmN0aW9uKCl7dmFyIHJlc3BvbnNlPXthY3Rpb25JZDphY3Rpb24uYWN0aW9uSWQsZGlnZXN0OmRpZ2VzdF8xfTtyZXR1cm4gcmVzcG9uc2V9KCksW2RpZ2VzdF8xLmJ1ZmZlcl0pfWJyZWFrfX0pfX0seyIuLi9lbnZpcm9ubmVtZW50Ijo2LCIuLi9pbmRleCI6NywiLi9UaHJlYWRNZXNzYWdlIjoxfV0sMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO3ZhciBhZXNqcz1yZXF1aXJlKCJhZXMtanMiKTt2YXIgdXRpbHNfMT1yZXF1aXJlKCIuLi91dGlscyIpO2Z1bmN0aW9uIHN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5KGtleSl7cmV0dXJue2VuY3J5cHQ6ZnVuY3Rpb24oKXt2YXIgZ2V0SXY9ZnVuY3Rpb24oKXt2YXIgaXYwPXV0aWxzXzEucmFuZG9tQnl0ZXMoMTYpO3JldHVybiBmdW5jdGlvbigpe3JldHVybiB1dGlsc18xLmxlZnRTaGlmdChpdjApfX0oKTtyZXR1cm4gZnVuY3Rpb24ocGxhaW5EYXRhKXt2YXIgaXY9Z2V0SXYoKTt2YXIgb3JpZ2luYWxMZW5ndGhBc0J5dGU9dXRpbHNfMS5hZGRQYWRkaW5nKCJMRUZUIix1dGlsc18xLm51bWJlclRvVWludDhBcnJheShwbGFpbkRhdGEubGVuZ3RoKSw0KTt2YXIgcGxhaW5EYXRhTXVsdGlwbGVPZjE2Qnl0ZXM9dXRpbHNfMS5hZGRQYWRkaW5nKCJSSUdIVCIscGxhaW5EYXRhLHBsYWluRGF0YS5sZW5ndGgrKDE2LXBsYWluRGF0YS5sZW5ndGglMTYpKTt2YXIgZW5jcnlwdGVkRGF0YVBheWxvYWQ9bmV3IGFlc2pzLk1vZGVPZk9wZXJhdGlvbi5jYmMoa2V5LGl2KS5lbmNyeXB0KHBsYWluRGF0YU11bHRpcGxlT2YxNkJ5dGVzKTtyZXR1cm4gdXRpbHNfMS5jb25jYXRVaW50OEFycmF5KGl2LG9yaWdpbmFsTGVuZ3RoQXNCeXRlLGVuY3J5cHRlZERhdGFQYXlsb2FkKX19KCksZGVjcnlwdDpmdW5jdGlvbihlbmNyeXB0ZWREYXRhKXt2YXIgaXY9ZW5jcnlwdGVkRGF0YS5zbGljZSgwLDE2KTt2YXIgb3JpZ2luYWxMZW5ndGhBc0J5dGU9ZW5jcnlwdGVkRGF0YS5zbGljZSgxNiwxNis0KTt2YXIgb3JpZ2luYWxMZW5ndGg9dXRpbHNfMS51aW50OEFycmF5VG9OdW1iZXIob3JpZ2luYWxMZW5ndGhBc0J5dGUpO3JldHVybiBuZXcgYWVzanMuTW9kZU9mT3BlcmF0aW9uLmNiYyhrZXksaXYpLmRlY3J5cHQoZW5jcnlwdGVkRGF0YS5zbGljZSgxNis0KSkuc2xpY2UoMCxvcmlnaW5hbExlbmd0aCl9fX1leHBvcnRzLnN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5PXN5bmNFbmNyeXB0b3JEZWNyeXB0b3JGYWN0b3J5O2Z1bmN0aW9uIGdlbmVyYXRlS2V5KCl7cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KXtyZXR1cm4gdXRpbHNfMS5yYW5kb21CeXRlcygzMixmdW5jdGlvbihlcnIsYnVmKXtpZighIWVycil7cmVqZWN0KGVycil9ZWxzZXtyZXNvbHZlKGJ1Zil9fSl9KX1leHBvcnRzLmdlbmVyYXRlS2V5PWdlbmVyYXRlS2V5O2Z1bmN0aW9uIGdldFRlc3RLZXkoKXtyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBVaW50OEFycmF5KFswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDIzLDI0LDI1LDI2LDI3LDI4LDI5LDMwLDMxXSkpfWV4cG9ydHMuZ2V0VGVzdEtleT1nZXRUZXN0S2V5fSx7Ii4uL3V0aWxzIjoxMCwiYWVzLWpzIjoxMX1dLDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTtmdW5jdGlvbiBzeW5jRW5jcnlwdG9yRGVjcnlwdG9yRmFjdG9yeSgpe3JldHVybntlbmNyeXB0OmZ1bmN0aW9uKHBsYWluRGF0YSl7cmV0dXJuIHBsYWluRGF0YX0sZGVjcnlwdDpmdW5jdGlvbihlbmNyeXB0ZWREYXRhKXtyZXR1cm4gZW5jcnlwdGVkRGF0YX19fWV4cG9ydHMuc3luY0VuY3J5cHRvckRlY3J5cHRvckZhY3Rvcnk9c3luY0VuY3J5cHRvckRlY3J5cHRvckZhY3Rvcnl9LHt9XSw1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXsidXNlIHN0cmljdCI7dmFyIF9fYXNzaWduPXRoaXMmJnRoaXMuX19hc3NpZ258fGZ1bmN0aW9uKCl7X19hc3NpZ249T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24odCl7Zm9yKHZhciBzLGk9MSxuPWFyZ3VtZW50cy5sZW5ndGg7aTxuO2krKyl7cz1hcmd1bWVudHNbaV07Zm9yKHZhciBwIGluIHMpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMscCkpdFtwXT1zW3BdfXJldHVybiB0fTtyZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcyxhcmd1bWVudHMpfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOnRydWV9KTt2YXIgdHlwZXNfMT1yZXF1aXJlKCIuLi90eXBlcyIpO3ZhciBOb2RlUlNBPXJlcXVpcmUoIm5vZGUtcnNhIik7dmFyIGVudmlyb25uZW1lbnRfMT1yZXF1aXJlKCIuLi9lbnZpcm9ubmVtZW50Iik7dmFyIGdldEVudmlyb25tZW50PWZ1bmN0aW9uKCl7cmV0dXJuIGVudmlyb25uZW1lbnRfMS5pc0Jyb3dzZXIoKT8iYnJvd3NlciI6Im5vZGUifTt2YXIgbmV3Tm9kZVJTQT1mdW5jdGlvbihrZXkpe3JldHVybiBuZXcgTm9kZVJTQShCdWZmZXIuZnJvbShrZXkuZGF0YSksa2V5LmZvcm1hdCx7ZW52aXJvbm1lbnQ6Z2V0RW52aXJvbm1lbnQoKX0pfTt2YXIgdG9SZWFsQnVmZmVyPWZ1bmN0aW9uKGRhdGEpe3JldHVybiBkYXRhIGluc3RhbmNlb2YgQnVmZmVyfHxPYmplY3QuZ2V0UHJvdG90eXBlT2YoZGF0YSkubmFtZT09PSJCdWZmZXIiP2RhdGE6QnVmZmVyLmZyb20oZGF0YSl9O2Z1bmN0aW9uIHN5bmNFbmNyeXB0b3JGYWN0b3J5KGVuY3J5cHRLZXkpe3JldHVybntlbmNyeXB0OmZ1bmN0aW9uKCl7dmFyIGVuY3J5cHROb2RlUlNBPW5ld05vZGVSU0EoZW5jcnlwdEtleSk7dmFyIGVuY3J5cHRNZXRob2Q9dHlwZXNfMS5Sc2FLZXkuUHJpdmF0ZS5tYXRjaChlbmNyeXB0S2V5KT8iZW5jcnlwdFByaXZhdGUiOiJlbmNyeXB0IjtyZXR1cm4gZnVuY3Rpb24ocGxhaW5EYXRhKXtyZXR1cm4gZW5jcnlwdE5vZGVSU0FbZW5jcnlwdE1ldGhvZF0odG9SZWFsQnVmZmVyKHBsYWluRGF0YSkpfX0oKX19ZXhwb3J0cy5zeW5jRW5jcnlwdG9yRmFjdG9yeT1zeW5jRW5jcnlwdG9yRmFjdG9yeTtmdW5jdGlvbiBzeW5jRGVjcnlwdG9yRmFjdG9yeShkZWNyeXB0S2V5KXtyZXR1cm57ZGVjcnlwdDpmdW5jdGlvbigpe3ZhciBkZWNyeXB0Tm9kZVJTQT1uZXdOb2RlUlNBKGRlY3J5cHRLZXkpO3ZhciBkZWNyeXB0TWV0aG9kPXR5cGVzXzEuUnNhS2V5LlB1YmxpYy5tYXRjaChkZWNyeXB0S2V5KT8iZGVjcnlwdFB1YmxpYyI6ImRlY3J5cHQiO3JldHVybiBmdW5jdGlvbihlbmNyeXB0ZWREYXRhKXtyZXR1cm4gZGVjcnlwdE5vZGVSU0FbZGVjcnlwdE1ldGhvZF0odG9SZWFsQnVmZmVyKGVuY3J5cHRlZERhdGEpKX19KCl9fWV4cG9ydHMuc3luY0RlY3J5cHRvckZhY3Rvcnk9c3luY0RlY3J5cHRvckZhY3Rvcnk7ZnVuY3Rpb24gc3luY0VuY3J5cHRvckRlY3J5cHRvckZhY3RvcnkoZW5jcnlwdEtleSxkZWNyeXB0S2V5KXtyZXR1cm4gX19hc3NpZ24oe30sc3luY0VuY3J5cHRvckZhY3RvcnkoZW5jcnlwdEtleSksc3luY0RlY3J5cHRvckZhY3RvcnkoZGVjcnlwdEtleSkpfWV4cG9ydHMuc3luY0VuY3J5cHRvckRlY3J5cHRvckZhY3Rvcnk9c3luY0VuY3J5cHRvckRlY3J5cHRvckZhY3Rvcnk7ZnVuY3Rpb24gc3luY0dlbmVyYXRlS2V5cyhzZWVkLGtleXNMZW5ndGhCeXRlcyl7aWYoa2V5c0xlbmd0aEJ5dGVzPT09dm9pZCAwKXtrZXlzTGVuZ3RoQnl0ZXM9ODB9dmFyIG5vZGVSU0E9Tm9kZVJTQS5nZW5lcmF0ZUtleVBhaXJGcm9tU2VlZChzZWVkLDgqa2V5c0xlbmd0aEJ5dGVzLHVuZGVmaW5lZCxnZXRFbnZpcm9ubWVudCgpKTtmdW5jdGlvbiBidWlsZEtleShmb3JtYXQpe3JldHVybntmb3JtYXQ6Zm9ybWF0LGRhdGE6bm9kZVJTQS5leHBvcnRLZXkoZm9ybWF0KX19cmV0dXJue3B1YmxpY0tleTpidWlsZEtleSgicGtjczEtcHVibGljLWRlciIpLHByaXZhdGVLZXk6YnVpbGRLZXkoInBrY3MxLXByaXZhdGUtZGVyIil9fWV4cG9ydHMuc3luY0dlbmVyYXRlS2V5cz1zeW5jR2VuZXJhdGVLZXlzfSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vZW52aXJvbm5lbWVudCI6NiwiLi4vdHlwZXMiOjksYnVmZmVyOjI1LCJub2RlLXJzYSI6Mzh9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7ZnVuY3Rpb24gaXNCcm93c2VyKCl7cmV0dXJuIHR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkInx8dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIiYmISFzZWxmLnBvc3RNZXNzYWdlfWV4cG9ydHMuaXNCcm93c2VyPWlzQnJvd3Nlcn0se31dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0IjtmdW5jdGlvbiBfX2V4cG9ydChtKXtmb3IodmFyIHAgaW4gbSlpZighZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSlleHBvcnRzW3BdPW1bcF19T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7X19leHBvcnQocmVxdWlyZSgiLi90eXBlcyIpKTt2YXIgc2NyeXB0PXJlcXVpcmUoIi4vc2NyeXB0Iik7ZXhwb3J0cy5zY3J5cHQ9c2NyeXB0O3ZhciBhZXM9cmVxdWlyZSgiLi9jaXBoZXIvYWVzIik7ZXhwb3J0cy5hZXM9YWVzO3ZhciByc2E9cmVxdWlyZSgiLi9jaXBoZXIvcnNhIik7ZXhwb3J0cy5yc2E9cnNhO3ZhciBwbGFpbj1yZXF1aXJlKCIuL2NpcGhlci9wbGFpbiIpO2V4cG9ydHMucGxhaW49cGxhaW59LHsiLi9jaXBoZXIvYWVzIjozLCIuL2NpcGhlci9wbGFpbiI6NCwiLi9jaXBoZXIvcnNhIjo1LCIuL3NjcnlwdCI6OCwiLi90eXBlcyI6OX1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgX19hc3NpZ249dGhpcyYmdGhpcy5fX2Fzc2lnbnx8ZnVuY3Rpb24oKXtfX2Fzc2lnbj1PYmplY3QuYXNzaWdufHxmdW5jdGlvbih0KXtmb3IodmFyIHMsaT0xLG49YXJndW1lbnRzLmxlbmd0aDtpPG47aSsrKXtzPWFyZ3VtZW50c1tpXTtmb3IodmFyIHAgaW4gcylpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocyxwKSl0W3BdPXNbcF19cmV0dXJuIHR9O3JldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO3ZhciBzY3J5cHRzeT1yZXF1aXJlKCJzY3J5cHRzeSIpO2V4cG9ydHMuZGVmYXVsdFBhcmFtcz17bjoxMyxyOjgscDoxLGRpZ2VzdExlbmd0aEJ5dGVzOjI1NH07ZnVuY3Rpb24gc3luY0hhc2godGV4dCxzYWx0LHBhcmFtcyxwcm9ncmVzcyl7aWYocGFyYW1zPT09dm9pZCAwKXtwYXJhbXM9e319dmFyIF9hPWZ1bmN0aW9uKCl7dmFyIG91dD1fX2Fzc2lnbih7fSxleHBvcnRzLmRlZmF1bHRQYXJhbXMpO09iamVjdC5rZXlzKHBhcmFtcykuZmlsdGVyKGZ1bmN0aW9uKGtleSl7cmV0dXJuIHBhcmFtc1trZXldIT09dW5kZWZpbmVkfSkuZm9yRWFjaChmdW5jdGlvbihrZXkpe3JldHVybiBvdXRba2V5XT1wYXJhbXNba2V5XX0pO3JldHVybiBvdXR9KCksbj1fYS5uLHI9X2EucixwPV9hLnAsZGlnZXN0TGVuZ3RoQnl0ZXM9X2EuZGlnZXN0TGVuZ3RoQnl0ZXM7cmV0dXJuIHNjcnlwdHN5KHRleHQsc2FsdCxNYXRoLnBvdygyLG4pLHIscCxkaWdlc3RMZW5ndGhCeXRlcyxwcm9ncmVzcyE9PXVuZGVmaW5lZD9mdW5jdGlvbihfYSl7dmFyIHBlcmNlbnQ9X2EucGVyY2VudDtyZXR1cm4gcHJvZ3Jlc3MocGVyY2VudCl9OnVuZGVmaW5lZCl9ZXhwb3J0cy5zeW5jSGFzaD1zeW5jSGFzaH0se3NjcnlwdHN5OjgwfV0sOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7InVzZSBzdHJpY3QiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6dHJ1ZX0pO2Z1bmN0aW9uIHRvQnVmZmVyKHVpbnQ4QXJyYXkpe3JldHVybiBCdWZmZXIuZnJvbSh1aW50OEFycmF5LmJ1ZmZlcix1aW50OEFycmF5LmJ5dGVPZmZzZXQsdWludDhBcnJheS5sZW5ndGgpfWV4cG9ydHMudG9CdWZmZXI9dG9CdWZmZXI7dmFyIFJzYUtleTsoZnVuY3Rpb24oUnNhS2V5KXtmdW5jdGlvbiBzdHJpbmdpZnkocnNhS2V5KXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoW3JzYUtleS5mb3JtYXQsdG9CdWZmZXIocnNhS2V5LmRhdGEpLnRvU3RyaW5nKCJiYXNlNjQiKV0pfVJzYUtleS5zdHJpbmdpZnk9c3RyaW5naWZ5O2Z1bmN0aW9uIHBhcnNlKHN0cmluZ2lmaWVkUnNhS2V5KXt2YXIgX2E9SlNPTi5wYXJzZShzdHJpbmdpZmllZFJzYUtleSksZm9ybWF0PV9hWzBdLHN0ckRhdGE9X2FbMV07cmV0dXJue2Zvcm1hdDpmb3JtYXQsZGF0YTpuZXcgVWludDhBcnJheShCdWZmZXIuZnJvbShzdHJEYXRhLCJiYXNlNjQiKSl9fVJzYUtleS5wYXJzZT1wYXJzZTt2YXIgUHVibGljOyhmdW5jdGlvbihQdWJsaWMpe2Z1bmN0aW9uIG1hdGNoKHJzYUtleSl7cmV0dXJuIHJzYUtleS5mb3JtYXQ9PT0icGtjczEtcHVibGljLWRlciJ9UHVibGljLm1hdGNoPW1hdGNofSkoUHVibGljPVJzYUtleS5QdWJsaWN8fChSc2FLZXkuUHVibGljPXt9KSk7dmFyIFByaXZhdGU7KGZ1bmN0aW9uKFByaXZhdGUpe2Z1bmN0aW9uIG1hdGNoKHJzYUtleSl7cmV0dXJuIHJzYUtleS5mb3JtYXQ9PT0icGtjczEtcHJpdmF0ZS1kZXIifVByaXZhdGUubWF0Y2g9bWF0Y2h9KShQcml2YXRlPVJzYUtleS5Qcml2YXRlfHwoUnNhS2V5LlByaXZhdGU9e30pKX0pKFJzYUtleT1leHBvcnRzLlJzYUtleXx8KGV4cG9ydHMuUnNhS2V5PXt9KSl9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0se2J1ZmZlcjoyNX1dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTp0cnVlfSk7dmFyIGVudmlyb25uZW1lbnRfMT1yZXF1aXJlKCIuL2Vudmlyb25uZW1lbnQiKTt2YXIgcmFuZG9tYnl0ZXM9cmVxdWlyZSgicmFuZG9tYnl0ZXMiKTtleHBvcnRzLnJhbmRvbUJ5dGVzPWVudmlyb25uZW1lbnRfMS5pc0Jyb3dzZXIoKT9yYW5kb21ieXRlczpmdW5jdGlvbigpe3ZhciBub2RlQ3J5cHRvPXJlcXVpcmUoIiIrImNyeXB0byIpO3JldHVybiBub2RlQ3J5cHRvLnJhbmRvbUJ5dGVzLmJpbmQobm9kZUNyeXB0byl9KCk7ZnVuY3Rpb24gY29uY2F0VWludDhBcnJheSgpe3ZhciB1aW50OEFycmF5cz1bXTtmb3IodmFyIF9pPTA7X2k8YXJndW1lbnRzLmxlbmd0aDtfaSsrKXt1aW50OEFycmF5c1tfaV09YXJndW1lbnRzW19pXX12YXIgb3V0PW5ldyBVaW50OEFycmF5KHVpbnQ4QXJyYXlzLm1hcChmdW5jdGlvbihfYSl7dmFyIGxlbmd0aD1fYS5sZW5ndGg7cmV0dXJuIGxlbmd0aH0pLnJlZHVjZShmdW5jdGlvbihwcmV2LGN1cnIpe3JldHVybiBwcmV2K2N1cnJ9LDApKTt2YXIgb2Zmc2V0PTA7Zm9yKHZhciBpPTA7aTx1aW50OEFycmF5cy5sZW5ndGg7aSsrKXt2YXIgdWludDhBcnJheT11aW50OEFycmF5c1tpXTtvdXQuc2V0KHVpbnQ4QXJyYXksb2Zmc2V0KTtvZmZzZXQrPXVpbnQ4QXJyYXkubGVuZ3RofXJldHVybiBvdXR9ZXhwb3J0cy5jb25jYXRVaW50OEFycmF5PWNvbmNhdFVpbnQ4QXJyYXk7ZnVuY3Rpb24gYWRkUGFkZGluZyhwb3NpdGlvbix1aW50OEFycmF5LHRhcmdldExlbmd0aEJ5dGVzKXt2YXIgcGFkZGluZ0J5dGVzPW5ldyBVaW50OEFycmF5KHRhcmdldExlbmd0aEJ5dGVzLXVpbnQ4QXJyYXkubGVuZ3RoKS5maWxsKDApO3JldHVybiBjb25jYXRVaW50OEFycmF5LmFwcGx5KHZvaWQgMCxmdW5jdGlvbigpe3N3aXRjaChwb3NpdGlvbil7Y2FzZSJMRUZUIjpyZXR1cm5bcGFkZGluZ0J5dGVzLHVpbnQ4QXJyYXldO2Nhc2UiUklHSFQiOnJldHVyblt1aW50OEFycmF5LHBhZGRpbmdCeXRlc119fSgpKX1leHBvcnRzLmFkZFBhZGRpbmc9YWRkUGFkZGluZztmdW5jdGlvbiBudW1iZXJUb1VpbnQ4QXJyYXkobil7dmFyIHN0cj1uLnRvU3RyaW5nKDE2KTt2YXIgYXJyPVtdO3ZhciBjdXJyPSIiO2Zvcih2YXIgaT1zdHIubGVuZ3RoLTE7aT49MDtpLS0pe2N1cnI9c3RyW2ldK2N1cnI7aWYoY3Vyci5sZW5ndGg9PT0yfHxpPT09MCl7YXJyPVtwYXJzZUludChjdXJyLDE2KV0uY29uY2F0KGFycik7Y3Vycj0iIn19cmV0dXJuIG5ldyBVaW50OEFycmF5KGFycil9ZXhwb3J0cy5udW1iZXJUb1VpbnQ4QXJyYXk9bnVtYmVyVG9VaW50OEFycmF5O2Z1bmN0aW9uIHVpbnQ4QXJyYXlUb051bWJlcih1aW50OEFycmF5KXt2YXIgbj0wO3ZhciBleHA9MDtmb3IodmFyIGk9dWludDhBcnJheS5sZW5ndGgtMTtpPj0wO2ktLSl7bis9dWludDhBcnJheVtpXSpNYXRoLnBvdygyNTYsZXhwKyspfXJldHVybiBufWV4cG9ydHMudWludDhBcnJheVRvTnVtYmVyPXVpbnQ4QXJyYXlUb051bWJlcjtmdW5jdGlvbiBsZWZ0U2hpZnQodWludDhBcnJheSl7dmFyIGM9dHJ1ZTtmb3IodmFyIGk9dWludDhBcnJheS5sZW5ndGgtMTtjJiZpPj0wO2ktLSl7aWYoKyt1aW50OEFycmF5W2ldIT09MjU2KXtjPWZhbHNlfX1yZXR1cm4gdWludDhBcnJheX1leHBvcnRzLmxlZnRTaGlmdD1sZWZ0U2hpZnR9LHsiLi9lbnZpcm9ubmVtZW50Ijo2LHJhbmRvbWJ5dGVzOjYzfV0sMTE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihyb290KXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gY2hlY2tJbnQodmFsdWUpe3JldHVybiBwYXJzZUludCh2YWx1ZSk9PT12YWx1ZX1mdW5jdGlvbiBjaGVja0ludHMoYXJyYXlpc2gpe2lmKCFjaGVja0ludChhcnJheWlzaC5sZW5ndGgpKXtyZXR1cm4gZmFsc2V9Zm9yKHZhciBpPTA7aTxhcnJheWlzaC5sZW5ndGg7aSsrKXtpZighY2hlY2tJbnQoYXJyYXlpc2hbaV0pfHxhcnJheWlzaFtpXTwwfHxhcnJheWlzaFtpXT4yNTUpe3JldHVybiBmYWxzZX19cmV0dXJuIHRydWV9ZnVuY3Rpb24gY29lcmNlQXJyYXkoYXJnLGNvcHkpe2lmKGFyZy5idWZmZXImJmFyZy5uYW1lPT09IlVpbnQ4QXJyYXkiKXtpZihjb3B5KXtpZihhcmcuc2xpY2Upe2FyZz1hcmcuc2xpY2UoKX1lbHNle2FyZz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmcpfX1yZXR1cm4gYXJnfWlmKEFycmF5LmlzQXJyYXkoYXJnKSl7aWYoIWNoZWNrSW50cyhhcmcpKXt0aHJvdyBuZXcgRXJyb3IoIkFycmF5IGNvbnRhaW5zIGludmFsaWQgdmFsdWU6ICIrYXJnKX1yZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJnKX1pZihjaGVja0ludChhcmcubGVuZ3RoKSYmY2hlY2tJbnRzKGFyZykpe3JldHVybiBuZXcgVWludDhBcnJheShhcmcpfXRocm93IG5ldyBFcnJvcigidW5zdXBwb3J0ZWQgYXJyYXktbGlrZSBvYmplY3QiKX1mdW5jdGlvbiBjcmVhdGVBcnJheShsZW5ndGgpe3JldHVybiBuZXcgVWludDhBcnJheShsZW5ndGgpfWZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2VBcnJheSx0YXJnZXRBcnJheSx0YXJnZXRTdGFydCxzb3VyY2VTdGFydCxzb3VyY2VFbmQpe2lmKHNvdXJjZVN0YXJ0IT1udWxsfHxzb3VyY2VFbmQhPW51bGwpe2lmKHNvdXJjZUFycmF5LnNsaWNlKXtzb3VyY2VBcnJheT1zb3VyY2VBcnJheS5zbGljZShzb3VyY2VTdGFydCxzb3VyY2VFbmQpfWVsc2V7c291cmNlQXJyYXk9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoc291cmNlQXJyYXksc291cmNlU3RhcnQsc291cmNlRW5kKX19dGFyZ2V0QXJyYXkuc2V0KHNvdXJjZUFycmF5LHRhcmdldFN0YXJ0KX12YXIgY29udmVydFV0Zjg9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0b0J5dGVzKHRleHQpe3ZhciByZXN1bHQ9W10saT0wO3RleHQ9ZW5jb2RlVVJJKHRleHQpO3doaWxlKGk8dGV4dC5sZW5ndGgpe3ZhciBjPXRleHQuY2hhckNvZGVBdChpKyspO2lmKGM9PT0zNyl7cmVzdWx0LnB1c2gocGFyc2VJbnQodGV4dC5zdWJzdHIoaSwyKSwxNikpO2krPTJ9ZWxzZXtyZXN1bHQucHVzaChjKX19cmV0dXJuIGNvZXJjZUFycmF5KHJlc3VsdCl9ZnVuY3Rpb24gZnJvbUJ5dGVzKGJ5dGVzKXt2YXIgcmVzdWx0PVtdLGk9MDt3aGlsZShpPGJ5dGVzLmxlbmd0aCl7dmFyIGM9Ynl0ZXNbaV07aWYoYzwxMjgpe3Jlc3VsdC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYykpO2krK31lbHNlIGlmKGM+MTkxJiZjPDIyNCl7cmVzdWx0LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZSgoYyYzMSk8PDZ8Ynl0ZXNbaSsxXSY2MykpO2krPTJ9ZWxzZXtyZXN1bHQucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKChjJjE1KTw8MTJ8KGJ5dGVzW2krMV0mNjMpPDw2fGJ5dGVzW2krMl0mNjMpKTtpKz0zfX1yZXR1cm4gcmVzdWx0LmpvaW4oIiIpfXJldHVybnt0b0J5dGVzOnRvQnl0ZXMsZnJvbUJ5dGVzOmZyb21CeXRlc319KCk7dmFyIGNvbnZlcnRIZXg9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0b0J5dGVzKHRleHQpe3ZhciByZXN1bHQ9W107Zm9yKHZhciBpPTA7aTx0ZXh0Lmxlbmd0aDtpKz0yKXtyZXN1bHQucHVzaChwYXJzZUludCh0ZXh0LnN1YnN0cihpLDIpLDE2KSl9cmV0dXJuIHJlc3VsdH12YXIgSGV4PSIwMTIzNDU2Nzg5YWJjZGVmIjtmdW5jdGlvbiBmcm9tQnl0ZXMoYnl0ZXMpe3ZhciByZXN1bHQ9W107Zm9yKHZhciBpPTA7aTxieXRlcy5sZW5ndGg7aSsrKXt2YXIgdj1ieXRlc1tpXTtyZXN1bHQucHVzaChIZXhbKHYmMjQwKT4+NF0rSGV4W3YmMTVdKX1yZXR1cm4gcmVzdWx0LmpvaW4oIiIpfXJldHVybnt0b0J5dGVzOnRvQnl0ZXMsZnJvbUJ5dGVzOmZyb21CeXRlc319KCk7dmFyIG51bWJlck9mUm91bmRzPXsxNjoxMCwyNDoxMiwzMjoxNH07dmFyIHJjb249WzEsMiw0LDgsMTYsMzIsNjQsMTI4LDI3LDU0LDEwOCwyMTYsMTcxLDc3LDE1NCw0Nyw5NCwxODgsOTksMTk4LDE1MSw1MywxMDYsMjEyLDE3OSwxMjUsMjUwLDIzOSwxOTcsMTQ1XTt2YXIgUz1bOTksMTI0LDExOSwxMjMsMjQyLDEwNywxMTEsMTk3LDQ4LDEsMTAzLDQzLDI1NCwyMTUsMTcxLDExOCwyMDIsMTMwLDIwMSwxMjUsMjUwLDg5LDcxLDI0MCwxNzMsMjEyLDE2MiwxNzUsMTU2LDE2NCwxMTQsMTkyLDE4MywyNTMsMTQ3LDM4LDU0LDYzLDI0NywyMDQsNTIsMTY1LDIyOSwyNDEsMTEzLDIxNiw0OSwyMSw0LDE5OSwzNSwxOTUsMjQsMTUwLDUsMTU0LDcsMTgsMTI4LDIyNiwyMzUsMzksMTc4LDExNyw5LDEzMSw0NCwyNiwyNywxMTAsOTAsMTYwLDgyLDU5LDIxNCwxNzksNDEsMjI3LDQ3LDEzMiw4MywyMDksMCwyMzcsMzIsMjUyLDE3Nyw5MSwxMDYsMjAzLDE5MCw1Nyw3NCw3Niw4OCwyMDcsMjA4LDIzOSwxNzAsMjUxLDY3LDc3LDUxLDEzMyw2OSwyNDksMiwxMjcsODAsNjAsMTU5LDE2OCw4MSwxNjMsNjQsMTQzLDE0NiwxNTcsNTYsMjQ1LDE4OCwxODIsMjE4LDMzLDE2LDI1NSwyNDMsMjEwLDIwNSwxMiwxOSwyMzYsOTUsMTUxLDY4LDIzLDE5NiwxNjcsMTI2LDYxLDEwMCw5MywyNSwxMTUsOTYsMTI5LDc5LDIyMCwzNCw0MiwxNDQsMTM2LDcwLDIzOCwxODQsMjAsMjIyLDk0LDExLDIxOSwyMjQsNTAsNTgsMTAsNzMsNiwzNiw5MiwxOTQsMjExLDE3Miw5OCwxNDUsMTQ5LDIyOCwxMjEsMjMxLDIwMCw1NSwxMDksMTQxLDIxMyw3OCwxNjksMTA4LDg2LDI0NCwyMzQsMTAxLDEyMiwxNzQsOCwxODYsMTIwLDM3LDQ2LDI4LDE2NiwxODAsMTk4LDIzMiwyMjEsMTE2LDMxLDc1LDE4OSwxMzksMTM4LDExMiw2MiwxODEsMTAyLDcyLDMsMjQ2LDE0LDk3LDUzLDg3LDE4NSwxMzQsMTkzLDI5LDE1OCwyMjUsMjQ4LDE1MiwxNywxMDUsMjE3LDE0MiwxNDgsMTU1LDMwLDEzNSwyMzMsMjA2LDg1LDQwLDIyMywxNDAsMTYxLDEzNywxMywxOTEsMjMwLDY2LDEwNCw2NSwxNTMsNDUsMTUsMTc2LDg0LDE4NywyMl07dmFyIFNpPVs4Miw5LDEwNiwyMTMsNDgsNTQsMTY1LDU2LDE5MSw2NCwxNjMsMTU4LDEyOSwyNDMsMjE1LDI1MSwxMjQsMjI3LDU3LDEzMCwxNTUsNDcsMjU1LDEzNSw1MiwxNDIsNjcsNjgsMTk2LDIyMiwyMzMsMjAzLDg0LDEyMywxNDgsNTAsMTY2LDE5NCwzNSw2MSwyMzgsNzYsMTQ5LDExLDY2LDI1MCwxOTUsNzgsOCw0NiwxNjEsMTAyLDQwLDIxNywzNiwxNzgsMTE4LDkxLDE2Miw3MywxMDksMTM5LDIwOSwzNywxMTQsMjQ4LDI0NiwxMDAsMTM0LDEwNCwxNTIsMjIsMjEyLDE2NCw5MiwyMDQsOTMsMTAxLDE4MiwxNDYsMTA4LDExMiw3Miw4MCwyNTMsMjM3LDE4NSwyMTgsOTQsMjEsNzAsODcsMTY3LDE0MSwxNTcsMTMyLDE0NCwyMTYsMTcxLDAsMTQwLDE4OCwyMTEsMTAsMjQ3LDIyOCw4OCw1LDE4NCwxNzksNjksNiwyMDgsNDQsMzAsMTQzLDIwMiw2MywxNSwyLDE5MywxNzUsMTg5LDMsMSwxOSwxMzgsMTA3LDU4LDE0NSwxNyw2NSw3OSwxMDMsMjIwLDIzNCwxNTEsMjQyLDIwNywyMDYsMjQwLDE4MCwyMzAsMTE1LDE1MCwxNzIsMTE2LDM0LDIzMSwxNzMsNTMsMTMzLDIyNiwyNDksNTUsMjMyLDI4LDExNywyMjMsMTEwLDcxLDI0MSwyNiwxMTMsMjksNDEsMTk3LDEzNywxMTEsMTgzLDk4LDE0LDE3MCwyNCwxOTAsMjcsMjUyLDg2LDYyLDc1LDE5OCwyMTAsMTIxLDMyLDE1NCwyMTksMTkyLDI1NCwxMjAsMjA1LDkwLDI0NCwzMSwyMjEsMTY4LDUxLDEzNiw3LDE5OSw0OSwxNzcsMTgsMTYsODksMzksMTI4LDIzNiw5NSw5Niw4MSwxMjcsMTY5LDI1LDE4MSw3NCwxMyw0NSwyMjksMTIyLDE1OSwxNDcsMjAxLDE1NiwyMzksMTYwLDIyNCw1OSw3NywxNzQsNDIsMjQ1LDE3NiwyMDAsMjM1LDE4Nyw2MCwxMzEsODMsMTUzLDk3LDIzLDQzLDQsMTI2LDE4NiwxMTksMjE0LDM4LDIyNSwxMDUsMjAsOTksODUsMzMsMTIsMTI1XTt2YXIgVDE9WzMzMjg0MDIzNDEsNDE2ODkwNzkwOCw0MDAwODA2ODA5LDQxMzUyODc2OTMsNDI5NDExMTc1NywzNTk3MzY0MTU3LDM3MzE4NDUwNDEsMjQ0NTY1NzQyOCwxNjEzNzcwODMyLDMzNjIwMjI3LDM0NjI4ODMyNDEsMTQ0NTY2OTc1NywzODkyMjQ4MDg5LDMwNTA4MjE0NzQsMTMwMzA5NjI5NCwzOTY3MTg2NTg2LDI0MTI0MzE5NDEsNTI4NjQ2ODEzLDIzMTE3MDI4NDgsNDIwMjUyODEzNSw0MDI2MjAyNjQ1LDI5OTIyMDAxNzEsMjM4NzAzNjEwNSw0MjI2ODcxMzA3LDExMDE5MDEyOTIsMzAxNzA2OTY3MSwxNjA0NDk0MDc3LDExNjkxNDE3MzgsNTk3NDY2MzAzLDE0MDMyOTkwNjMsMzgzMjcwNTY4NiwyNjEzMTAwNjM1LDE5NzQ5NzQ0MDIsMzc5MTUxOTAwNCwxMDMzMDgxNzc0LDEyNzc1Njg2MTgsMTgxNTQ5MjE4NiwyMTE4MDc0MTc3LDQxMjY2Njg1NDYsMjIxMTIzNjk0MywxNzQ4MjUxNzQwLDEzNjk4MTA0MjAsMzUyMTUwNDU2NCw0MTkzMzgyNjY0LDM3OTkwODU0NTksMjg4MzExNTEyMywxNjQ3MzkxMDU5LDcwNjAyNDc2NywxMzQ0ODA5MDgsMjUxMjg5Nzg3NCwxMTc2NzA3OTQxLDI2NDY4NTI0NDYsODA2ODg1NDE2LDkzMjYxNTg0MSwxNjgxMDExMzUsNzk4NjYxMzAxLDIzNTM0MTU3Nyw2MDUxNjQwODYsNDYxNDA2MzYzLDM3NTYxODgyMjEsMzQ1NDc5MDQzOCwxMzExMTg4ODQxLDIxNDI0MTc2MTMsMzkzMzU2NjM2NywzMDI1ODIwNDMsNDk1MTU4MTc0LDE0NzkyODk5NzIsODc0MTI1ODcwLDkwNzc0NjA5MywzNjk4MjI0ODE4LDMwMjU4MjAzOTgsMTUzNzI1MzYyNywyNzU2ODU4NjE0LDE5ODM1OTMyOTMsMzA4NDMxMDExMywyMTA4OTI4OTc0LDEzNzg0MjkzMDcsMzcyMjY5OTU4MiwxNTgwMTUwNjQxLDMyNzQ1MTc5OSwyNzkwNDc4ODM3LDMxMTc1MzU1OTIsMCwzMjUzNTk1NDM2LDEwNzU4NDcyNjQsMzgyNTAwNzY0NywyMDQxNjg4NTIwLDMwNTk0NDA2MjEsMzU2Mzc0MzkzNCwyMzc4OTQzMzAyLDE3NDA1NTM5NDUsMTkxNjM1Mjg0MywyNDg3ODk2Nzk4LDI1NTUxMzcyMzYsMjk1ODU3OTk0NCwyMjQ0OTg4NzQ2LDMxNTEwMjQyMzUsMzMyMDgzNTg4MiwxMzM2NTg0OTMzLDM5OTI3MTQwMDYsMjI1MjU1NTIwNSwyNTg4NzU3NDYzLDE3MTQ2MzE1MDksMjkzOTYzMTU2LDIzMTk3OTU2NjMsMzkyNTQ3MzU1Miw2NzI0MDQ1NCw0MjY5NzY4NTc3LDI2ODk2MTgxNjAsMjAxNzIxMzUwOCw2MzEyMTgxMDYsMTI2OTM0NDQ4MywyNzIzMjM4Mzg3LDE1NzEwMDU0MzgsMjE1MTY5NDUyOCw5MzI5NDQ3NCwxMDY2NTcwNDEzLDU2Mzk3NzY2MCwxODgyNzMyNjE2LDQwNTk0MjgxMDAsMTY3MzMxMzUwMywyMDA4NDYzMDQxLDI5NTAzNTU1NzMsMTEwOTQ2NzQ5MSw1Mzc5MjM2MzIsMzg1ODc1OTQ1MCw0MjYwNjIzMTE4LDMyMTgyNjQ2ODUsMjE3Nzc0ODMwMCw0MDM0NDI3MDgsNjM4Nzg0MzA5LDMyODcwODQwNzksMzE5MzkyMTUwNSw4OTkxMjcyMDIsMjI4NjE3NTQzNiw3NzMyNjUyMDksMjQ3OTE0NjA3MSwxNDM3MDUwODY2LDQyMzYxNDgzNTQsMjA1MDgzMzczNSwzMzYyMDIyNTcyLDMxMjY2ODEwNjMsODQwNTA1NjQzLDM4NjYzMjU5MDksMzIyNzU0MTY2NCw0Mjc5MTc3MjAsMjY1NTk5NzkwNSwyNzQ5MTYwNTc1LDExNDMwODc3MTgsMTQxMjA0OTUzNCw5OTkzMjk5NjMsMTkzNDk3MjE5LDIzNTM0MTU4ODIsMzM1NDMyNDUyMSwxODA3MjY4MDUxLDY3MjQwNDU0MCwyODE2NDAxMDE3LDMxNjAzMDEyODIsMzY5ODIyNDkzLDI5MTY4NjY5MzQsMzY4ODk0Nzc3MSwxNjgxMDExMjg2LDE5NDk5NzMwNzAsMzM2MjAyMjcwLDI0NTQyNzY1NzEsMjAxNzIxMzU0LDEyMTAzMjgxNzIsMzA5MzA2MDgzNiwyNjgwMzQxMDg1LDMxODQ3NzYwNDYsMTEzNTM4OTkzNSwzMjk0NzgyMTE4LDk2NTg0MTMyMCw4MzE4ODY3NTYsMzU1NDk5MzIwNyw0MDY4MDQ3MjQzLDM1ODg3NDUwMTAsMjM0NTE5MTQ5MSwxODQ5MTEyNDA5LDM2NjQ2MDQ1OTksMjYwNTQwMjgsMjk4MzU4MTAyOCwyNjIyMzc3NjgyLDEyMzU4NTU4NDAsMzYzMDk4NDM3MiwyODkxMzM5NTE0LDQwOTI5MTY3NDMsMzQ4ODI3OTA3NywzMzk1NjQyNzk5LDQxMDE2Njc0NzAsMTIwMjYzMDM3NywyNjg5NjE4MTYsMTg3NDUwODUwMSw0MDM0NDI3MDE2LDEyNDM5NDgzOTksMTU0NjUzMDQxOCw5NDEzNjYzMDgsMTQ3MDUzOTUwNSwxOTQxMjIyNTk5LDI1NDYzODY1MTMsMzQyMTAzODYyNywyNzE1NjcxOTMyLDM4OTk5NDYxNDAsMTA0MjIyNjk3NywyNTIxNTE3MDIxLDE2Mzk4MjQ4NjAsMjI3MjQ5MDMwLDI2MDczNzY2OSwzNzY1NDY1MjMyLDIwODQ0NTM5NTQsMTkwNzczMzk1NiwzNDI5MjYzMDE4LDI0MjA2NTYzNDQsMTAwODYwNjc3LDQxNjAxNTcxODUsNDcwNjgzMTU0LDMyNjExNjE4OTEsMTc4MTg3MTk2NywyOTI0OTU5NzM3LDE3NzM3Nzk0MDgsMzk0NjkyMjQxLDI1Nzk2MTE5OTIsOTc0OTg2NTM1LDY2NDcwNjc0NSwzNjU1NDU5MTI4LDM5NTg5NjIxOTUsNzMxNDIwODUxLDU3MTU0Mzg1OSwzNTMwMTIzNzA3LDI4NDk2MjY0ODAsMTI2NzgzMTEzLDg2NTM3NTM5OSw3NjUxNzI2NjIsMTAwODYwNjc1NCwzNjEyMDM2MDIsMzM4NzU0OTk4NCwyMjc4NDc3Mzg1LDI4NTc3MTkyOTUsMTM0NDgwOTA4MCwyNzgyOTEyMzc4LDU5NTQyNjcxLDE1MDM3NjQ5ODQsMTYwMDA4NTc2LDQzNzA2MjkzNSwxNzA3MDY1MzA2LDM2MjIyMzM2NDksMjIxODkzNDk4MiwzNDk2NTAzNDgwLDIxODUzMTQ3NTUsNjk3OTMyMjA4LDE1MTI5MTAxOTksNTA0MzAzMzc3LDIwNzUxNzcxNjMsMjgyNDA5OTA2OCwxODQxMDE5ODYyLDczOTY0NDk4Nl07dmFyIFQyPVsyNzgxMjQyMjExLDIyMzA4NzczMDgsMjU4MjU0MjE5OSwyMzgxNzQwOTIzLDIzNDg3NzY4MiwzMTg0OTQ2MDI3LDI5ODQxNDQ3NTEsMTQxODgzOTQ5MywxMzQ4NDgxMDcyLDUwNDYyOTc3LDI4NDg4NzYzOTEsMjEwMjc5OTE0Nyw0MzQ2MzQ0OTQsMTY1NjA4NDQzOSwzODYzODQ5ODk5LDI1OTkxODgwODYsMTE2NzA1MTQ2NiwyNjM2MDg3OTM4LDEwODI3NzE5MTMsMjI4MTM0MDI4NSwzNjgwNDg4OTAsMzk1NDMzNDA0MSwzMzgxNTQ0Nzc1LDIwMTA2MDU5MiwzOTYzNzI3Mjc3LDE3Mzk4Mzg2NzYsNDI1MDkwMzIwMiwzOTMwNDM1NTAzLDMyMDY3ODIxMDgsNDE0OTQ1Mzk4OCwyNTMxNTUzOTA2LDE1MzY5MzQwODAsMzI2MjQ5NDY0Nyw0ODQ1NzI2NjksMjkyMzI3MTA1OSwxNzgzMzc1Mzk4LDE1MTcwNDEyMDYsMTA5ODc5Mjc2Nyw0OTY3NDIzMSwxMzM0MDM3NzA4LDE1NTAzMzI5ODAsNDA5ODk5MTUyNSw4ODYxNzExMDksMTUwNTk4MTI5LDI0ODEwOTA5MjksMTk0MDY0MjAwOCwxMzk4OTQ0MDQ5LDEwNTk3MjI1MTcsMjAxODUxOTA4LDEzODU1NDc3MTksMTY5OTA5NTMzMSwxNTg3Mzk3NTcxLDY3NDI0MDUzNiwyNzA0Nzc0ODA2LDI1MjMxNDg4NSwzMDM5Nzk1ODY2LDE1MTkxNDI0Nyw5MDgzMzM1ODYsMjYwMjI3MDg0OCwxMDM4MDgyNzg2LDY1MTAyOTQ4MywxNzY2NzI5NTExLDM0NDc2OTgwOTgsMjY4Mjk0MjgzNyw0NTQxNjY3OTMsMjY1MjczNDMzOSwxOTUxOTM1NTMyLDc3NTE2NjQ5MCw3NTg1MjA2MDMsMzAwMDc5MDYzOCw0MDA0Nzk3MDE4LDQyMTcwODYxMTIsNDEzNzk2NDExNCwxMjk5NTk0MDQzLDE2Mzk0MzgwMzgsMzQ2NDM0NDQ5OSwyMDY4OTgyMDU3LDEwNTQ3MjkxODcsMTkwMTk5Nzg3MSwyNTM0NjM4NzI0LDQxMjEzMTgyMjcsMTc1NzAwODMzNywwLDc1MDkwNjg2MSwxNjE0ODE1MjY0LDUzNTAzNTEzMiwzMzYzNDE4NTQ1LDM5ODgxNTExMzEsMzIwMTU5MTkxNCwxMTgzNjk3ODY3LDM2NDc0NTQ5MTAsMTI2NTc3Njk1MywzNzM0MjYwMjk4LDM1NjY3NTA3OTYsMzkwMzg3MTA2NCwxMjUwMjgzNDcxLDE4MDc0NzA4MDAsNzE3NjE1MDg3LDM4NDcyMDM0OTgsMzg0Njk1MjkxLDMzMTM5MTA1OTUsMzYxNzIxMzc3MywxNDMyNzYxMTM5LDI0ODQxNzYyNjEsMzQ4MTk0NTQxMywyODM3NjkzMzcsMTAwOTI1OTU0LDIxODA5Mzk2NDcsNDAzNzAzODE2MCwxMTQ4NzMwNDI4LDMxMjMwMjc4NzEsMzgxMzM4NjQwOCw0MDg3NTAxMTM3LDQyNjc1NDk2MDMsMzIyOTYzMDUyOCwyMzE1NjIwMjM5LDI5MDY2MjQ2NTgsMzE1NjMxOTY0NSwxMjE1MzEzOTc2LDgyOTY2MDA1LDM3NDc4NTU1NDgsMzI0NTg0ODI0NiwxOTc0NDU5MDk4LDE2NjUyNzgyNDEsODA3NDA3NjMyLDQ1MTI4MDg5NSwyNTE1MjQwODMsMTg0MTI4Nzg5MCwxMjgzNTc1MjQ1LDMzNzEyMDI2OCw4OTE2ODc2OTksODAxMzY5MzI0LDM3ODczNDk4NTUsMjcyMTQyMTIwNywzNDMxNDgyNDM2LDk1OTMyMTg3OSwxNDY5MzAxOTU2LDQwNjU2OTk3NTEsMjE5NzU4NTUzNCwxMTk5MTkzNDA1LDI4OTg4MTQwNTIsMzg4Nzc1MDQ5Myw3MjQ3MDM1MTMsMjUxNDkwODAxOSwyNjk2OTYyMTQ0LDI1NTE4MDgzODUsMzUxNjgxMzEzNSwyMTQxNDQ1MzQwLDE3MTU3NDEyMTgsMjExOTQ0NTAzNCwyODcyODA3NTY4LDIxOTg1NzExNDQsMzM5ODE5MDY2Miw3MDA5Njg2ODYsMzU0NzA1MjIxNiwxMDA5MjU5NTQwLDIwNDEwNDQ3MDIsMzgwMzk5NTc0Miw0ODc5ODM4ODMsMTk5MTEwNTQ5OSwxMDA0MjY1Njk2LDE0NDk0MDcwMjYsMTMxNjIzOTkzMCw1MDQ2Mjk3NzAsMzY4Mzc5NzMyMSwxNjg1NjAxMzQsMTgxNjY2NzE3MiwzODM3Mjg3NTE2LDE1NzA3NTExNzAsMTg1NzkzNDI5MSw0MDE0MTg5NzQwLDI3OTc4ODgwOTgsMjgyMjM0NTEwNSwyNzU0NzEyOTgxLDkzNjYzMzU3MiwyMzQ3OTIzODMzLDg1Mjg3OTMzNSwxMTMzMjM0Mzc2LDE1MDAzOTUzMTksMzA4NDU0NTM4OSwyMzQ4OTEyMDEzLDE2ODkzNzYyMTMsMzUzMzQ1OTAyMiwzNzYyOTIzOTQ1LDMwMzQwODI0MTIsNDIwNTU5ODI5NCwxMzM0Mjg0NjgsNjM0MzgzMDgyLDI5NDkyNzcwMjksMjM5ODM4NjgxMCwzOTEzNzg5MTAyLDQwMzcwMzgxNiwzNTgwODY5MzA2LDIyOTc0NjA4NTYsMTg2NzEzMDE0OSwxOTE4NjQzNzU4LDYwNzY1Njk4OCw0MDQ5MDUzMzUwLDMzNDYyNDg4ODQsMTM2ODkwMTMxOCw2MDA1NjU5OTIsMjA5MDk4Mjg3NywyNjMyNDc5ODYwLDU1NzcxOTMyNywzNzE3NjE0NDExLDM2OTczOTMwODUsMjI0OTAzNDYzNSwyMjMyMzg4MjM0LDI0MzA2Mjc5NTIsMTExNTQzODY1NCwzMjk1Nzg2NDIxLDI4NjU1MjIyNzgsMzYzMzMzNDM0NCw4NDI4MDA2NywzMzAyNzgzMCwzMDM4Mjg0OTQsMjc0NzQyNTEyMSwxNjAwNzk1OTU3LDQxODg5NTI0MDcsMzQ5NjU4OTc1MywyNDM0MjM4MDg2LDE0ODY0NzE2MTcsNjU4MTE5OTY1LDMxMDYzODE0NzAsOTUzODAzMjMzLDMzNDIzMTgwMCwzMDA1OTc4Nzc2LDg1Nzg3MDYwOSwzMTUxMTI4OTM3LDE4OTAxNzk1NDUsMjI5ODk3MzgzOCwyODA1MTc1NDQ0LDMwNTY0NDIyNjcsNTc0MzY1MjE0LDI0NTA4ODQ0ODcsNTUwMTAzNTI5LDEyMzM2MzcwNzAsNDI4OTM1MzA0NSwyMDE4NTE5MDgwLDIwNTc2OTExMDMsMjM5OTM3NDQ3Niw0MTY2NjIzNjQ5LDIxNDgxMDg2ODEsMzg3NTgzMjQ1LDM2NjQxMDEzMTEsODM2MjMyOTM0LDMzMzA1NTY0ODIsMzEwMDY2NTk2MCwzMjgwMDkzNTA1LDI5NTU1MTYzMTMsMjAwMjM5ODUwOSwyODcxODI2MDcsMzQxMzg4MTAwOCw0MjM4ODkwMDY4LDM1OTc1MTU3MDcsOTc1OTY3NzY2XTt2YXIgVDM9WzE2NzE4MDg2MTEsMjA4OTA4OTE0OCwyMDA2NTc2NzU5LDIwNzI5MDEyNDMsNDA2MTAwMzc2MiwxODA3NjAzMzA3LDE4NzM5Mjc3OTEsMzMxMDY1Mzg5Myw4MTA1NzM4NzIsMTY5NzQzMzcsMTczOTE4MTY3MSw3Mjk2MzQzNDcsNDI2MzExMDY1NCwzNjEzNTcwNTE5LDI4ODM5OTcwOTksMTk4OTg2NDU2NiwzMzkzNTU2NDI2LDIxOTEzMzUyOTgsMzM3NjQ0OTk5MywyMTA2MDYzNDg1LDQxOTU3NDE2OTAsMTUwODYxODg0MSwxMjA0MzkxNDk1LDQwMjczMTcyMzIsMjkxNzk0MTY3NywzNTYzNTY2MDM2LDI3MzQ1MTQwODIsMjk1MTM2NjA2MywyNjI5NzcyMTg4LDI3Njc2NzIyMjgsMTkyMjQ5MTUwNiwzMjI3MjI5MTIwLDMwODI5NzQ2NDcsNDI0NjUyODUwOSwyNDc3NjY5Nzc5LDY0NDUwMDUxOCw5MTE4OTU2MDYsMTA2MTI1Njc2Nyw0MTQ0MTY2MzkxLDM0Mjc3NjMxNDgsODc4NDcxMjIwLDI3ODQyNTIzMjUsMzg0NTQ0NDA2OSw0MDQzODk3MzI5LDE5MDU1MTcxNjksMzYzMTQ1OTI4OCw4Mjc1NDgyMDksMzU2NDYxMDc3LDY3ODk3MzQ4LDMzNDQwNzgyNzksNTkzODM5NjUxLDMyNzc3NTc4OTEsNDA1Mjg2OTM2LDI1MjcxNDc5MjYsODQ4NzE2ODUsMjU5NTU2NTQ2NiwxMTgwMzM5MjcsMzA1NTM4MDY2LDIxNTc2NDg3NjgsMzc5NTcwNTgyNiwzOTQ1MTg4ODQzLDY2MTIxMjcxMSwyOTk5ODEyMDE4LDE5NzM0MTQ1MTcsMTUyNzY5MDMzLDIyMDgxNzc1MzksNzQ1ODIyMjUyLDQzOTIzNTYxMCw0NTU5NDc4MDMsMTg1NzIxNTU5OCwxNTI1NTkzMTc4LDI3MDA4Mjc1NTIsMTM5MTg5NTYzNCw5OTQ5MzIyODMsMzU5NjcyODI3OCwzMDE2NjU0MjU5LDY5NTk0NzgxNywzODEyNTQ4MDY3LDc5NTk1ODgzMSwyMjI0NDkzNDQ0LDE0MDg2MDc4MjcsMzUxMzMwMTQ1NywwLDM5NzkxMzM0MjEsNTQzMTc4Nzg0LDQyMjk5NDg0MTIsMjk4MjcwNTU4NSwxNTQyMzA1MzcxLDE3OTA4OTExMTQsMzQxMDM5ODY2NywzMjAxOTE4OTEwLDk2MTI0NTc1MywxMjU2MTAwOTM4LDEyODkwMDEwMzYsMTQ5MTY0NDUwNCwzNDc3NzY3NjMxLDM0OTY3MjEzNjAsNDAxMjU1NzgwNywyODY3MTU0ODU4LDQyMTI1ODM5MzEsMTEzNzAxODQzNSwxMzA1OTc1MzczLDg2MTIzNDczOSwyMjQxMDczNTQxLDExNzEyMjkyNTMsNDE3ODYzNTI1NywzMzk0ODY3NCwyMTM5MjI1NzI3LDEzNTc5NDY5NjAsMTAxMTEyMDE4OCwyNjc5Nzc2NjcxLDI4MzM0NjgzMjgsMTM3NDkyMTI5NywyNzUxMzU2MzIzLDEwODYzNTc1NjgsMjQwODE4NzI3OSwyNDYwODI3NTM4LDI2NDYzNTIyODUsOTQ0MjcxNDE2LDQxMTA3NDIwMDUsMzE2ODc1NjY2OCwzMDY2MTMyNDA2LDM2NjUxNDU4MTgsNTYwMTUzMTIxLDI3MTU4OTM5Miw0Mjc5OTUyODk1LDQwNzc4NDYwMDMsMzUzMDQwNzg5MCwzNDQ0MzQzMjQ1LDIwMjY0MzQ2OCwzMjIyNTAyNTksMzk2MjU1MzMyNCwxNjA4NjI5ODU1LDI1NDM5OTAxNjcsMTE1NDI1NDkxNiwzODk2MjMzMTksMzI5NDA3Mzc5NiwyODE3Njc2NzExLDIxMjI1MTM1MzQsMTAyODA5NDUyNSwxNjg5MDQ1MDkyLDE1NzU0Njc2MTMsNDIyMjYxMjczLDE5MzkyMDM2OTksMTYyMTE0Nzc0NCwyMTc0MjI4ODY1LDEzMzkxMzc2MTUsMzY5OTM1MjU0MCw1NzcxMjc0NTgsNzEyOTIyMTU0LDI0MjcxNDEwMDgsMjI5MDI4OTU0NCwxMTg3Njc5MzAyLDM5OTU3MTU1NjYsMzEwMDg2MzQxNiwzMzk0ODY3NDAsMzczMjUxNDc4MiwxNTkxOTE3NjYyLDE4NjQ1NTU2MywzNjgxOTg4MDU5LDM3NjIwMTkyOTYsODQ0NTIyNTQ2LDk3ODIyMDA5MCwxNjk3NDMzNzAsMTIzOTEyNjYwMSwxMDEzMjE3MzQsNjExMDc2MTMyLDE1NTg0OTMyNzYsMzI2MDkxNTY1MCwzNTQ3MjUwMTMxLDI5MDEzNjE1ODAsMTY1NTA5NjQxOCwyNDQzNzIxMTA1LDI1MTA1NjU3ODEsMzgyODg2Mzk3MiwyMDM5MjE0NzEzLDM4Nzg4Njg0NTUsMzM1OTg2OTg5Niw5Mjg2MDc3OTksMTg0MDc2NTU0OSwyMzc0NzYyODkzLDM1ODAxNDYxMzMsMTMyMjQyNTQyMiwyODUwMDQ4NDI1LDE4MjM3OTEyMTIsMTQ1OTI2ODY5NCw0MDk0MTYxOTA4LDM5MjgzNDY2MDIsMTcwNjAxOTQyOSwyMDU2MTg5MDUwLDI5MzQ1MjM4MjIsMTM1Nzk0Njk2LDMxMzQ1NDk5NDYsMjAyMjI0MDM3Niw2MjgwNTA0NjksNzc5MjQ2NjM4LDQ3MjEzNTcwOCwyODAwODM0NDcwLDMwMzI5NzAxNjQsMzMyNzIzNjAzOCwzODk0NjYwMDcyLDM3MTU5MzI2MzcsMTk1NjQ0MDE4MCw1MjIyNzIyODcsMTI3MjgxMzEzMSwzMTg1MzM2NzY1LDIzNDA4MTgzMTUsMjMyMzk3NjA3NCwxODg4NTQyODMyLDEwNDQ1NDQ1NzQsMzA0OTU1MDI2MSwxNzIyNDY5NDc4LDEyMjIxNTIyNjQsNTA2NjA4NjcsNDEyNzMyNDE1MCwyMzYwNjc4NTQsMTYzODEyMjA4MSw4OTU0NDU1NTcsMTQ3NTk4MDg4NywzMTE3NDQzNTEzLDIyNTc2NTU2ODYsMzI0MzgwOTIxNyw0ODkxMTAwNDUsMjY2MjkzNDQzMCwzNzc4NTk5MzkzLDQxNjIwNTUxNjAsMjU2MTg3ODkzNiwyODg1NjM3MjksMTc3MzkxNjc3NywzNjQ4MDM5Mzg1LDIzOTEzNDUwMzgsMjQ5Mzk4NTY4NCwyNjEyNDA3NzA3LDUwNTU2MDA5NCwyMjc0NDk3OTI3LDM5MTEyNDAxNjksMzQ2MDkyNTM5MCwxNDQyODE4NjQ1LDY3ODk3MzQ4MCwzNzQ5MzU3MDIzLDIzNTgxODI3OTYsMjcxNzQwNzY0OSwyMzA2ODY5NjQxLDIxOTYxNzgwNSwzMjE4NzYxMTUxLDM4NjIwMjYyMTQsMTEyMDMwNjI0MiwxNzU2OTQyNDQwLDExMDMzMzE5MDUsMjU3ODQ1OTAzMyw3NjI3OTY1ODksMjUyNzgwMDQ3LDI5NjYxMjU0ODgsMTQyNTg0NDMwOCwzMTUxMzkyMTg3LDM3MjkxMTEyNl07dmFyIFQ0PVsxNjY3NDc0ODg2LDIwODg1MzUyODgsMjAwNDMyNjg5NCwyMDcxNjk0ODM4LDQwNzU5NDk1NjcsMTgwMjIyMzA2MiwxODY5NTkxMDA2LDMzMTgwNDM3OTMsODA4NDcyNjcyLDE2ODQzNTIyLDE3MzQ4NDY5MjYsNzI0MjcwNDIyLDQyNzgwNjU2MzksMzYyMTIxNjk0OSwyODgwMTY5NTQ5LDE5ODc0ODQzOTYsMzQwMjI1MzcxMSwyMTg5NTk3OTgzLDMzODU0MDk2NzMsMjEwNTM3ODgxMCw0MjEwNjkzNjE1LDE0OTkwNjUyNjYsMTE5NTg4Njk5MCw0MDQyMjYzNTQ3LDI5MTM4NTY1NzcsMzU3MDY4OTk3MSwyNzI4NTkwNjg3LDI5NDc1NDE1NzMsMjYyNzUxODI0MywyNzYyMjc0NjQzLDE5MjAxMTIzNTYsMzIzMzgzMTgzNSwzMDgyMjczMzk3LDQyNjEyMjM2NDksMjQ3NTkyOTE0OSw2NDAwNTE3ODgsOTA5NTMxNzU2LDEwNjExMTAxNDIsNDE2MDE2MDUwMSwzNDM1OTQxNzYzLDg3NTg0Njc2MCwyNzc5MTE2NjI1LDM4NTcwMDM3MjksNDA1OTEwNTUyOSwxOTAzMjY4ODM0LDM2MzgwNjQwNDMsODI1MzE2MTk0LDM1MzcxMzk2Miw2NzM3NDA4OCwzMzUxNzI4Nzg5LDU4OTUyMjI0NiwzMjg0MzYwODYxLDQwNDIzNjMzNiwyNTI2NDU0MDcxLDg0MjE3NjEwLDI1OTM4MzAxOTEsMTE3OTAxNTgyLDMwMzE4MzM5NiwyMTU1OTExOTYzLDM4MDY0Nzc3OTEsMzk1ODA1NjY1Myw2NTY4OTQyODYsMjk5ODA2MjQ2MywxOTcwNjQyOTIyLDE1MTU5MTY5OCwyMjA2NDQwOTg5LDc0MTExMDg3Miw0Mzc5MjMzODAsNDU0NzY1ODc4LDE4NTI3NDg1MDgsMTUxNTkwODc4OCwyNjk0OTA0NjY3LDEzODExNjg4MDQsOTkzNzQyMTk4LDM2MDQzNzM5NDMsMzAxNDkwNTQ2OSw2OTA1ODQ0MDIsMzgyMzMyMDc5Nyw3OTE2MzgzNjYsMjIyMzI4MTkzOSwxMzk4MDExMzAyLDM1MjAxNjE5NzcsMCwzOTkxNzQzNjgxLDUzODk5MjcwNCw0MjQ0MzgxNjY3LDI5ODEyMTg0MjUsMTUzMjc1MTI4NiwxNzg1MzgwNTY0LDM0MTkwOTY3MTcsMzIwMDE3ODUzNSw5NjAwNTYxNzgsMTI0NjQyMDYyOCwxMjgwMTAzNTc2LDE0ODIyMjE3NDQsMzQ4NjQ2ODc0MSwzNTAzMzE5OTk1LDQwMjU0Mjg2NzcsMjg2MzMyNjU0Myw0MjI3NTM2NjIxLDExMjg1MTQ5NTAsMTI5Njk0NzA5OCw4NTkwMDIyMTQsMjI0MDEyMzkyMSwxMTYyMjAzMDE4LDQxOTM4NDk1NzcsMzM2ODcwNDQsMjEzOTA2Mjc4MiwxMzQ3NDgxNzYwLDEwMTA1ODI2NDgsMjY3ODA0NTIyMSwyODI5NjQwNTIzLDEzNjQzMjUyODIsMjc0NTQzMzY5MywxMDc3OTg1NDA4LDI0MDg1NDg4NjksMjQ1OTA4NjE0MywyNjQ0MzYwMjI1LDk0MzIxMjY1Niw0MTI2NDc1NTA1LDMxNjY0OTQ1NjMsMzA2NTQzMDM5MSwzNjcxNzUwMDYzLDU1NTgzNjIyNiwyNjk0OTYzNTIsNDI5NDkwODY0NSw0MDkyNzkyNTczLDM1MzcwMDYwMTUsMzQ1Mjc4Mzc0NSwyMDIxMTgxNjgsMzIwMDI1ODk0LDM5NzQ5MDE2OTksMTYwMDExOTIzMCwyNTQzMjk3MDc3LDExNDUzNTk0OTYsMzg3Mzk3OTM0LDMzMDEyMDE4MTEsMjgxMjgwMTYyMSwyMTIyMjIwMjg0LDEwMjc0MjYxNzAsMTY4NDMxOTQzMiwxNTY2NDM1MjU4LDQyMTA3OTg1OCwxOTM2OTU0ODU0LDE2MTY5NDUzNDQsMjE3Mjc1Mzk0NSwxMzMwNjMxMDcwLDM3MDU0MzgxMTUsNTcyNjc5NzQ4LDcwNzQyNzkyNCwyNDI1NDAwMTIzLDIyOTA2NDc4MTksMTE3OTA0NDQ5Miw0MDA4NTg1NjcxLDMwOTkxMjA0OTEsMzM2ODcwNDQwLDM3MzkxMjIwODcsMTU4MzI3NjczMiwxODUyNzc3MTgsMzY4ODU5MzA2OSwzNzcyNzkxNzcxLDg0MjE1OTcxNiw5NzY4OTk3MDAsMTY4NDM1MjIwLDEyMjk1NzcxMDYsMTAxMDU5MDg0LDYwNjM2Njc5MiwxNTQ5NTkxNzM2LDMyNjc1MTc4NTUsMzU1Mzg0OTAyMSwyODk3MDE0NTk1LDE2NTA2MzIzODgsMjQ0MjI0MjEwNSwyNTA5NjEyMDgxLDM4NDAxNjE3NDcsMjAzODAwODgxOCwzODkwNjg4NzI1LDMzNjg1Njc2OTEsOTI2Mzc0MjU0LDE4MzU5MDcwMzQsMjM3NDg2Mzg3MywzNTg3NTMxOTUzLDEzMTM3ODg1NzIsMjg0NjQ4MjUwNSwxODE5MDYzNTEyLDE0NDg1NDA4NDQsNDEwOTYzMzUyMywzOTQxMjEzNjQ3LDE3MDExNjI5NTQsMjA1NDg1MjM0MCwyOTMwNjk4NTY3LDEzNDc0ODE3NiwzMTMyODA2NTExLDIwMjExNjUyOTYsNjIzMjEwMzE0LDc3NDc5NTg2OCw0NzE2MDYzMjgsMjc5NTk1ODYxNSwzMDMxNzQ2NDE5LDMzMzQ4ODU3ODMsMzkwNzUyNzYyNywzNzIyMjgwMDk3LDE5NTM3OTk0MDAsNTIyMTMzODIyLDEyNjMyNjMxMjYsMzE4MzMzNjU0NSwyMzQxMTc2ODQ1LDIzMjQzMzM4MzksMTg4NjQyNTMxMiwxMDQ0MjY3NjQ0LDMwNDg1ODg0MDEsMTcxODAwNDQyOCwxMjEyNzMzNTg0LDUwNTI5NTQyLDQxNDMzMTc0OTUsMjM1ODAzMTY0LDE2MzM3ODg4NjYsODkyNjkwMjgyLDE0NjUzODMzNDIsMzExNTk2MjQ3MywyMjU2OTY1OTExLDMyNTA2NzM4MTcsNDg4NDQ5ODUwLDI2NjEyMDIyMTUsMzc4OTYzMzc1Myw0MTc3MDA3NTk1LDI1NjAxNDQxNzEsMjg2MzM5ODc0LDE3Njg1MzcwNDIsMzY1NDkwNjAyNSwyMzkxNzA1ODYzLDI0OTI3NzAwOTksMjYxMDY3MzE5Nyw1MDUyOTEzMjQsMjI3MzgwODkxNywzOTI0MzY5NjA5LDM0Njk2MjU3MzUsMTQzMTY5OTM3MCw2NzM3NDA4ODAsMzc1NTk2NTA5MywyMzU4MDIxODkxLDI3MTE3NDY2NDksMjMwNzQ4OTgwMSwyMTg5NjE2OTAsMzIxNzAyMTU0MSwzODczODQ1NzE5LDExMTE2NzI0NTIsMTc1MTY5MzUyMCwxMDk0ODI4OTMwLDI1NzY5ODYxNTMsNzU3OTU0Mzk0LDI1MjY0NTY2MiwyOTY0Mzc2NDQzLDE0MTQ4NTU4NDgsMzE0OTY0OTUxNywzNzA1NTU0MzZdO3ZhciBUNT1bMTM3NDk4ODExMiwyMTE4MjE0OTk1LDQzNzc1NzEyMyw5NzU2NTg2NDYsMTAwMTA4OTk5NSw1MzA0MDA3NTMsMjkwMjA4Nzg1MSwxMjczMTY4Nzg3LDU0MDA4MDcyNSwyOTEwMjE5NzY2LDIyOTUxMDEwNzMsNDExMDU2ODQ4NSwxMzQwNDYzMTAwLDMzMDc5MTYyNDcsNjQxMDI1MTUyLDMwNDMxNDA0OTUsMzczNjE2NDkzNyw2MzI5NTM3MDMsMTE3Mjk2NzA2NCwxNTc2OTc2NjA5LDMyNzQ2NjcyNjYsMjE2OTMwMzA1OCwyMzcwMjEzNzk1LDE4MDkwNTQxNTAsNTk3Mjc4NDcsMzYxOTI5ODc3LDMyMTE2MjMxNDcsMjUwNTIwMjEzOCwzNTY5MjU1MjEzLDE0ODQwMDU4NDMsMTIzOTQ0Mzc1MywyMzk1NTg4Njc2LDE5NzU2ODM0MzQsNDEwMjk3NzkxMiwyNTcyNjk3MTk1LDY2NjQ2NDczMywzMjAyNDM3MDQ2LDQwMzU0ODkwNDcsMzM3NDM2MTcwMiwyMTEwNjY3NDQ0LDE2NzU1Nzc4ODAsMzg0MzY5OTA3NCwyNTM4NjgxMTg0LDE2NDk2MzkyMzcsMjk3NjE1MTUyMCwzMTQ0Mzk2NDIwLDQyNjk5MDc5OTYsNDE3ODA2MjIyOCwxODgzNzkzNDk2LDI0MDM3Mjg2NjUsMjQ5NzYwNDc0MywxMzgzODU2MzExLDI4NzY0OTQ2MjcsMTkxNzUxODU2MiwzODEwNDk2MzQzLDE3MTY4OTA0MTAsMzAwMTc1NTY1NSw4MDA0NDA4MzUsMjI2MTA4OTE3OCwzNTQzNTk5MjY5LDgwNzk2MjYxMCw1OTk3NjIzNTQsMzM3NzgzNjIsMzk3NzY3NTM1NiwyMzI4ODI4OTcxLDI4MDk3NzExNTQsNDA3NzM4NDQzMiwxMzE1NTYyMTQ1LDE3MDg4NDgzMzMsMTAxMDM5ODI5LDM1MDk4NzExMzUsMzI5OTI3ODQ3NCw4NzU0NTEyOTMsMjczMzg1NjE2MCw5Mjk4NzY5OCwyNzY3NjQ1NTU3LDE5MzE5NTA2NSwxMDgwMDk0NjM0LDE1ODQ1MDQ1ODIsMzE3ODEwNjk2MSwxMDQyMzg1NjU3LDI1MzEwNjc0NTMsMzcxMTgyOTQyMiwxMzA2OTY3MzY2LDI0MzgyMzc2MjEsMTkwODY5NDI3Nyw2NzU1NjQ2MywxNjE1ODYxMjQ3LDQyOTQ1NjE2NCwzNjAyNzcwMzI3LDIzMDI2OTAyNTIsMTc0MjMxNTEyNywyOTY4MDExNDUzLDEyNjQ1NDY2NCwzODc3MTk4NjQ4LDIwNDMyMTE0ODMsMjcwOTI2MDg3MSwyMDg0NzA0MjMzLDQxNjk0MDgyMDEsMCwxNTk0MTc5ODcsODQxNzM5NTkyLDUwNDQ1OTQzNiwxODE3ODY2ODMwLDQyNDU2MTg2ODMsMjYwMzg4OTUwLDEwMzQ4Njc5OTgsOTA4OTMzNDE1LDE2ODgxMDg1MiwxNzUwOTAyMzA1LDI2MDY0NTM5NjksNjA3NTMwNTU0LDIwMjAwODQ5NywyNDcyMDExNTM1LDMwMzU1MzUwNTgsNDYzMTgwMTkwLDIxNjAxMTcwNzEsMTY0MTgxNjIyNiwxNTE3NzY3NTI5LDQ3MDk0ODM3NCwzODAxMzMyMjM0LDMyMzE3MjIyMTMsMTAwODkxODU5NSwzMDM3NjUyNzcsMjM1NDc0MTg3LDQwNjkyNDY4OTMsNzY2OTQ1NDY1LDMzNzU1Mzg2NCwxNDc1NDE4NTAxLDI5NDM2ODIzODAsNDAwMzA2MTE3OSwyNzQzMDM0MTA5LDQxNDQwNDc3NzUsMTU1MTAzNzg4NCwxMTQ3NTUwNjYxLDE1NDMyMDg1MDAsMjMzNjQzNDU1MCwzNDA4MTE5NTE2LDMwNjkwNDk5NjAsMzEwMjAxMTc0NywzNjEwMzY5MjI2LDExMTM4MTgzODQsMzI4NjcxODA4LDIyMjc1NzMwMjQsMjIzNjIyODczMywzNTM1NDg2NDU2LDI5MzU1NjY4NjUsMzM0MTM5NDI4NSw0OTY5MDYwNTksMzcwMjY2NTQ1OSwyMjY5MDY4NjAsMjAwOTE5NTQ3Miw3MzMxNTY5NzIsMjg0MjczNzA0OSwyOTQ5MzA2ODIsMTIwNjQ3Nzg1OCwyODM1MTIzMzk2LDI3MDAwOTkzNTQsMTQ1MTA0NDA1Niw1NzM4MDQ3ODMsMjI2OTcyODQ1NSwzNjQ0Mzc5NTg1LDIzNjIwOTAyMzgsMjU2NDAzMzMzNCwyODAxMTA3NDA3LDI3NzYyOTI5MDQsMzY2OTQ2MjU2NiwxMDY4MzUxMzk2LDc0MjAzOTAxMiwxMzUwMDc4OTg5LDE3ODQ2NjMxOTUsMTQxNzU2MTY5OCw0MTM2NDQwNzcwLDI0MzAxMjIyMTYsNzc1NTUwODE0LDIxOTM4NjI2NDUsMjY3MzcwNTE1MCwxNzc1Mjc2OTI0LDE4NzYyNDE4MzMsMzQ3NTMxMzMzMSwzMzY2NzU0NjE5LDI3MDA0MDQ4NywzOTAyNTYzMTgyLDM2NzgxMjQ5MjMsMzQ0MTg1MDM3NywxODUxMzMyODUyLDM5Njk1NjIzNjksMjIwMzAzMjIzMiwzODY4NTUyODA1LDI4Njg4OTc0MDYsNTY2MDIxODk2LDQwMTExOTA1MDIsMzEzNTc0MDg4OSwxMjQ4ODAyNTEwLDM5MzYyOTEyODQsNjk5NDMyMTUwLDgzMjg3NzIzMSw3MDg3ODA4NDksMzMzMjc0MDE0NCw4OTk4MzU1ODQsMTk1MTMxNzA0Nyw0MjM2NDI5OTkwLDM3Njc1ODY5OTIsODY2NjM3ODQ1LDQwNDM2MTAxODYsMTEwNjA0MTU5MSwyMTQ0MTYxODA2LDM5NTQ0MTcxMSwxOTg0ODEyNjg1LDExMzk3ODE3MDksMzQzMzcxMjk4MCwzODM1MDM2ODk1LDI2NjQ1NDM3MTUsMTI4MjA1MDA3NSwzMjQwODk0MzkyLDExODEwNDUxMTksMjY0MDI0MzIwNCwyNTk2NTkxNyw0MjAzMTgxMTcxLDQyMTE4MTg3OTgsMzAwOTg3OTM4NiwyNDYzODc5NzYyLDM5MTAxNjE5NzEsMTg0Mjc1OTQ0MywyNTk3ODA2NDc2LDkzMzMwMTM3MCwxNTA5NDMwNDE0LDM5NDM5MDY0NDEsMzQ2NzE5MjMwMiwzMDc2NjM5MDI5LDM3NzY3Njc0NjksMjA1MTUxODc4MCwyNjMxMDY1NDMzLDE0NDE5NTI1NzUsNDA0MDE2NzYxLDE5NDI0MzU3NzUsMTQwODc0OTAzNCwxNjEwNDU5NzM5LDM3NDUzNDUzMDAsMjAxNzc3ODU2NiwzNDAwNTI4NzY5LDMxMTA2NTA5NDIsOTQxODk2NzQ4LDMyNjU0Nzg3NTEsMzcxMDQ5MzMwLDMxNjg5MzcyMjgsNjc1MDM5NjI3LDQyNzkwODAyNTcsOTY3MzExNzI5LDEzNTA1MDIwNiwzNjM1NzMzNjYwLDE2ODM0MDcyNDgsMjA3NjkzNTI2NSwzNTc2ODcwNTEyLDEyMTUwNjExMDgsMzUwMTc0MTg5MF07dmFyIFQ2PVsxMzQ3NTQ4MzI3LDE0MDA3ODMyMDUsMzI3MzI2NzEwOCwyNTIwMzkzNTY2LDM0MDk2ODUzNTUsNDA0NTM4MDkzMywyODgwMjQwMjE2LDI0NzEyMjQwNjcsMTQyODE3MzA1MCw0MTM4NTYzMTgxLDI0NDE2NjE1NTgsNjM2ODEzOTAwLDQyMzMwOTQ2MTUsMzYyMDAyMjk4NywyMTQ5OTg3NjUyLDI0MTEwMjkxNTUsMTIzOTMzMTE2MiwxNzMwNTI1NzIzLDI1NTQ3MTg3MzQsMzc4MTAzMzY2NCw0NjM0NjEwMSwzMTA0NjM3MjgsMjc0Mzk0NDg1NSwzMzI4OTU1Mzg1LDM4NzU3NzAyMDcsMjUwMTIxODk3MiwzOTU1MTkxMTYyLDM2NjcyMTkwMzMsNzY4OTE3MTIzLDM1NDU3ODk0NzMsNjkyNzA3NDMzLDExNTAyMDg0NTYsMTc4NjEwMjQwOSwyMDI5MjkzMTc3LDE4MDUyMTE3MTAsMzcxMDM2ODExMywzMDY1OTYyODMxLDQwMTYzOTU5NywxNzI0NDU3MTMyLDMwMjgxNDM2NzQsNDA5MTk4NDEwLDIxOTYwNTI1MjksMTYyMDUyOTQ1OSwxMTY0MDcxODA3LDM3Njk3MjE5NzUsMjIyNjg3NTMxMCw0ODY0NDEzNzYsMjQ5OTM0ODUyMywxNDgzNzUzNTc2LDQyODgxOTk2NSwyMjc0NjgwNDI4LDMwNzU2MzYyMTYsNTk4NDM4ODY3LDM3OTkxNDExMjIsMTQ3NDUwMjU0Myw3MTEzNDk2NzUsMTI5MTY2MTIwLDUzNDU4MzcwLDI1OTI1MjM2NDMsMjc4MjA4MjgyNCw0MDYzMjQyMzc1LDI5ODg2ODcyNjksMzEyMDY5NDEyMiwxNTU5MDQxNjY2LDczMDUxNzI3NiwyNDYwNDQ5MjA0LDQwNDI0NTkxMjIsMjcwNjI3MDY5MCwzNDQ2MDA0NDY4LDM1NzM5NDE2OTQsNTMzODA0MTMwLDIzMjgxNDM2MTQsMjYzNzQ0MjY0MywyNjk1MDMzNjg1LDgzOTIyNDAzMywxOTczNzQ1Mzg3LDk1NzA1NTk4MCwyODU2MzQ1ODM5LDEwNjg1Mjc2NywxMzcxMzY4OTc2LDQxODE1OTg2MDIsMTAzMzI5NzE1OCwyOTMzNzM0OTE3LDExNzk1MTA0NjEsMzA0NjIwMDQ2MSw5MTM0MTkxNywxODYyNTM0ODY4LDQyODQ1MDIwMzcsNjA1NjU3MzM5LDI1NDc0MzI5MzcsMzQzMTU0Njk0NywyMDAzMjk0NjIyLDMxODI0ODc2MTgsMjI4MjE5NTMzOSw5NTQ2Njk0MDMsMzY4MjE5MTU5OCwxMjAxNzY1Mzg2LDM5MTcyMzQ3MDMsMzM4ODUwNzE2NiwwLDIxOTg0MzgwMjIsMTIxMTI0NzU5NywyODg3NjUxNjk2LDEzMTU3MjM4OTAsNDIyNzY2NTY2MywxNDQzODU3NzIwLDUwNzM1ODkzMyw2NTc4NjE5NDUsMTY3ODM4MTAxNyw1NjA0ODc1OTAsMzUxNjYxOTYwNCw5NzU0NTE2OTQsMjk3MDM1NjMyNywyNjEzMTQ1MzUsMzUzNTA3MjkxOCwyNjUyNjA5NDI1LDEzMzM4MzgwMjEsMjcyNDMyMjMzNiwxNzY3NTM2NDU5LDM3MDkzODM5NCwxODI2MjExMTQsMzg1NDYwNjM3OCwxMTI4MDE0NTYwLDQ4NzcyNTg0NywxODU0NjkxOTcsMjkxODM1Mzg2MywzMTA2NzgwODQwLDMzNTY3NjE3NjksMjIzNzEzMzA4MSwxMjg2NTY3MTc1LDMxNTI5NzYzNDksNDI1NTM1MDYyNCwyNjgzNzY1MDMwLDMxNjAxNzUzNDksMzMwOTU5NDE3MSw4Nzg0NDMzOTAsMTk4ODgzODE4NSwzNzA0MzAwNDg2LDE3NTY4MTg5NDAsMTY3MzA2MTYxNywzNDAzMTAwNjM2LDI3Mjc4NjMwOSwxMDc1MDI1Njk4LDU0NTU3MjM2OSwyMTA1ODg3MjY4LDQxNzQ1NjAwNjEsMjk2Njc5NzMwLDE4NDE3Njg4NjUsMTI2MDIzMjIzOSw0MDkxMzI3MDI0LDM5NjAzMDkzMzAsMzQ5NzUwOTM0NywxODE0ODAzMjIyLDI1NzgwMTg0ODksNDE5NTQ1NjA3Miw1NzUxMzgxNDgsMzI5OTQwOTAzNiw0NDY3NTQ4NzksMzYyOTU0Njc5Niw0MDExOTk2MDQ4LDMzNDc1MzIxMTAsMzI1MjIzODU0NSw0MjcwNjM5Nzc4LDkxNTk4NTQxOSwzNDgzODI1NTM3LDY4MTkzMzUzNCw2NTE4NjgwNDYsMjc1NTYzNjY3MSwzODI4MTAzODM3LDIyMzM3NzU1NCwyNjA3NDM5ODIwLDE2NDk3MDQ1MTgsMzI3MDkzNzg3NSwzOTAxODA2Nzc2LDE1ODAwODc3OTksNDExODk4NzY5NSwzMTk4MTE1MjAwLDIwODczMDk0NTksMjg0MjY3ODU3MywzMDE2Njk3MTA2LDEwMDMwMDcxMjksMjgwMjg0OTkxNywxODYwNzM4MTQ3LDIwNzc5NjUyNDMsMTY0NDM5NjcyLDQxMDA4NzI0NzIsMzIyODMzMTksMjgyNzE3Nzg4MiwxNzA5NjEwMzUwLDIxMjUxMzU4NDYsMTM2NDI4NzUxLDM4NzQ0MjgzOTIsMzY1MjkwNDg1OSwzNDYwOTg0NjMwLDM1NzIxNDU5MjksMzU5MzA1NjM4MCwyOTM5MjY2MjI2LDgyNDg1MjI1OSw4MTgzMjQ4ODQsMzIyNDc0MDQ1NCw5MzAzNjkyMTIsMjgwMTU2NjQxMCwyOTY3NTA3MTUyLDM1NTcwNjg0MCwxMjU3MzA5MzM2LDQxNDgyOTI4MjYsMjQzMjU2NjU2LDc5MDA3Mzg0NiwyMzczMzQwNjMwLDEyOTYyOTc5MDQsMTQyMjY5OTA4NSwzNzU2Mjk5NzgwLDM4MTg4MzY0MDUsNDU3OTkyODQwLDMwOTk2Njc0ODcsMjEzNTMxOTg4OSw3NzQyMjMxNCwxNTYwMzgyNTE3LDE5NDU3OTg1MTYsNzg4MjA0MzUzLDE1MjE3MDY3ODEsMTM4NTM1NjI0Miw4NzA5MTIwODYsMzI1OTY1MzgzLDIzNTg5NTc5MjEsMjA1MDQ2NjA2MCwyMzg4MjYwODg0LDIzMTM4ODQ0NzYsNDAwNjUyMTEyNyw5MDEyMTA1NjksMzk5MDk1MzE4OSwxMDE0NjQ2NzA1LDE1MDM0NDk4MjMsMTA2MjU5NzIzNSwyMDMxNjIxMzI2LDMyMTIwMzU4OTUsMzkzMTM3MTQ2OSwxNTMzMDE3NTE0LDM1MDE3NDU3NSwyMjU2MDI4ODkxLDIxNzc1NDQxNzksMTA1MjMzODM3Miw3NDE4NzY3ODgsMTYwNjU5MTI5NiwxOTE0MDUyMDM1LDIxMzcwNTI1MywyMzM0NjY5ODk3LDExMDcyMzQxOTcsMTg5OTYwMzk2OSwzNzI1MDY5NDkxLDI2MzE0NDc3ODAsMjQyMjQ5NDkxMywxNjM1NTAyOTgwLDE4OTMwMjAzNDIsMTk1MDkwMzM4OCwxMTIwOTc0OTM1XTt2YXIgVDc9WzI4MDcwNTg5MzIsMTY5OTk3MDYyNSwyNzY0MjQ5NjIzLDE1ODY5MDM1OTEsMTgwODQ4MTE5NSwxMTczNDMwMTczLDE0ODc2NDU5NDYsNTk5ODQ4NjcsNDE5OTg4MjgwMCwxODQ0ODgyODA2LDE5ODkyNDkyMjgsMTI3NzU1NTk3MCwzNjIzNjM2OTY1LDM0MTk5MTU1NjIsMTE0OTI0OTA3NywyNzQ0MTA0MjkwLDE1MTQ3OTA1NzcsNDU5NzQ0Njk4LDI0NDg2MDM5NCwzMjM1OTk1MTM0LDE5NjMxMTUzMTEsNDAyNzc0NDU4OCwyNTQ0MDc4MTUwLDQxOTA1MzA1MTUsMTYwODk3NTI0NywyNjI3MDE2MDgyLDIwNjIyNzAzMTcsMTUwNzQ5NzI5OCwyMjAwODE4ODc4LDU2NzQ5ODg2OCwxNzY0MzEzNTY4LDMzNTk5MzYyMDEsMjMwNTQ1NTU1NCwyMDM3OTcwMDYyLDEwNDcyMzllMywxOTEwMzE5MDMzLDEzMzczNzY0ODEsMjkwNDAyNzI3MiwyODkyNDE3MzEyLDk4NDkwNzIxNCwxMjQzMTEyNDE1LDgzMDY2MTkxNCw4NjE5NjgyMDksMjEzNTI1MzU4NywyMDExMjE0MTgwLDI5Mjc5MzQzMTUsMjY4NjI1NDcyMSw3MzExODMzNjgsMTc1MDYyNjM3Niw0MjQ2MzEwNzI1LDE4MjA4MjQ3OTgsNDE3Mjc2Mzc3MSwzNTQyMzMwMjI3LDQ4Mzk0ODI3LDI0MDQ5MDE2NjMsMjg3MTY4MjY0NSw2NzE1OTMxOTUsMzI1NDk4ODcyNSwyMDczNzI0NjEzLDE0NTA4NTIzOSwyMjgwNzk2MjAwLDI3Nzk5MTUxOTksMTc5MDU3NTEwNywyMTg3MTI4MDg2LDQ3MjYxNTYzMSwzMDI5NTEwMDA5LDQwNzU4NzcxMjcsMzgwMjIyMjE4NSw0MTA3MTAxNjU4LDMyMDE2MzE3NDksMTY0NjI1MjM0MCw0MjcwNTA3MTc0LDE0MDI4MTE0MzgsMTQzNjU5MDgzNSwzNzc4MTUxODE4LDM5NTAzNTU3MDIsMzk2MzE2MTQ3NSw0MDIwOTEyMjI0LDI2Njc5OTQ3MzcsMjczNzkyMzY2LDIzMzE1OTAxNzcsMTA0Njk5NjEzLDk1MzQ1OTgyLDMxNzU1MDEyODYsMjM3NzQ4NjY3NiwxNTYwNjM3ODkyLDM1NjQwNDUzMTgsMzY5MDU3ODcyLDQyMTM0NDcwNjQsMzkxOTA0MjIzNywxMTM3NDc3OTUyLDI2NTg2MjU0OTcsMTExOTcyNzg0OCwyMzQwOTQ3ODQ5LDE1MzA0NTU4MzMsNDAwNzM2MDk2OCwxNzI0NjY1NTYsMjY2OTU5OTM4LDUxNjU1MjgzNiwwLDIyNTY3MzQ1OTIsMzk4MDkzMTYyNywxODkwMzI4MDgxLDE5MTc3NDIxNzAsNDI5NDcwNDM5OCw5NDUxNjQxNjUsMzU3NTUyODg3OCw5NTg4NzEwODUsMzY0NzIxMjA0NywyNzg3MjA3MjYwLDE0MjMwMjI5MzksNzc1NTYyMjk0LDE3Mzk2NTYyMDIsMzg3NjU1NzY1NSwyNTMwMzkxMjc4LDI0NDMwNTgwNzUsMzMxMDMyMTg1Niw1NDc1MTI3OTYsMTI2NTE5NTYzOSw0Mzc2NTY1OTQsMzEyMTI3NTUzOSw3MTk3MDAxMjgsMzc2MjUwMjY5MCwzODc3ODExNDcsMjE4ODI4Mjk3LDMzNTAwNjU4MDMsMjgzMDcwODE1MCwyODQ4NDYxODU0LDQyODE2OTIwMSwxMjI0NjYxNjUsMzcyMDA4MTA0OSwxNjI3MjM1MTk5LDY0ODAxNzY2NSw0MTIyNzYyMzU0LDEwMDI3ODM4NDYsMjExNzM2MDYzNSw2OTU2MzQ3NTUsMzMzNjM1ODY5MSw0MjM0NzIxMDA1LDQwNDk4NDQ0NTIsMzcwNDI4MDg4MSwyMjMyNDM1Mjk5LDU3NDYyNDY2MywyODczNDM4MTQsNjEyMjA1ODk4LDEwMzk3MTcwNTEsODQwMDE5NzA1LDI3MDgzMjYxODUsNzkzNDUxOTM0LDgyMTI4ODExNCwxMzkxMjAxNjcwLDM4MjIwOTAxNzcsMzc2MTg3ODI3LDMxMTM4NTUzNDQsMTIyNDM0ODA1MiwxNjc5OTY4MjMzLDIzNjE2OTg1NTYsMTA1ODcwOTc0NCw3NTIzNzU0MjEsMjQzMTU5MDk2MywxMzIxNjk5MTQ1LDM1MTkxNDIyMDAsMjczNDU5MTE3OCwxODgxMjc0NDQsMjE3Nzg2OTU1NywzNzI3MjA1NzU0LDIzODQ5MTEwMzEsMzIxNTIxMjQ2MSwyNjQ4OTc2NDQyLDI0NTAzNDYxMDQsMzQzMjczNzM3NSwxMTgwODQ5Mjc4LDMzMTU0NDIwNSwzMTAyMjQ5MTc2LDQxNTAxNDQ1NjksMjk1MjEwMjU5NSwyMTU5OTc2Mjg1LDI0NzQ0MDQzMDQsNzY2MDc4OTMzLDMxMzc3Mzg2MSwyNTcwODMyMDQ0LDIxMDgxMDA2MzIsMTY2ODIxMjg5MiwzMTQ1NDU2NDQzLDIwMTM5MDgyNjIsNDE4NjcyMjE3LDMwNzAzNTY2MzQsMjU5NDczNDkyNywxODUyMTcxOTI1LDM4NjcwNjA5OTEsMzQ3MzQxNjYzNiwzOTA3NDQ4NTk3LDI2MTQ3Mzc2MzksOTE5NDg5MTM1LDE2NDk0ODYzOSwyMDk0NDEwMTYwLDI5OTc4MjU5NTYsNTkwNDI0NjM5LDI0ODYyMjQ1NDksMTcyMzg3MjY3NCwzMTU3NzUwODYyLDMzOTk5NDEyNTAsMzUwMTI1Mjc1MiwzNjI1MjY4MTM1LDI1NTUwNDgxOTYsMzY3MzYzNzM1NiwxMzQzMTI3NTAxLDQxMzAyODEzNjEsMzU5OTU5NTA4NSwyOTU3ODUzNjc5LDEyOTc0MDMwNTAsODE3ODE5MTAsMzA1MTU5MzQyNSwyMjgzNDkwNDEwLDUzMjIwMTc3MiwxMzY3Mjk1NTg5LDM5MjYxNzA5NzQsODk1Mjg3NjkyLDE5NTM3NTc4MzEsMTA5MzU5Nzk2Myw0OTI0ODM0MzEsMzUyODYyNjkwNywxNDQ2MjQyNTc2LDExOTI0NTU2MzgsMTYzNjYwNDYzMSwyMDkzMzYyMjUsMzQ0ODczNDY0LDEwMTU2NzE1NzEsNjY5OTYxODk3LDMzNzU3NDA3NjksMzg1NzU3MjEyNCwyOTczNTMwNjk1LDM3NDcxOTIwMTgsMTkzMzUzMDYxMCwzNDY0MDQyNTE2LDkzNTI5Mzg5NSwzNDU0Njg2MTk5LDI4NTgxMTUwNjksMTg2MzYzODg0NSwzNjgzMDIyOTE2LDQwODUzNjk1MTksMzI5MjQ0NTAzMiw4NzUzMTMxODgsMTA4MDAxNzU3MSwzMjc5MDMzODg1LDYyMTU5MTc3OCwxMjMzODU2NTcyLDI1MDQxMzAzMTcsMjQxOTc1NDQsMzAxNzY3MjcxNiwzODM1NDg0MzQwLDMyNDc0NjU1NTgsMjIyMDk4MTE5NSwzMDYwODQ3OTIyLDE1NTExMjQ1ODgsMTQ2Mzk5NjYwMF07dmFyIFQ4PVs0MTA0NjA1Nzc3LDEwOTcxNTk1NTAsMzk2NjczODE4LDY2MDUxMDI2NiwyODc1OTY4MzE1LDI2Mzg2MDY2MjMsNDIwMDExNTExNiwzODA4NjYyMzQ3LDgyMTcxMjE2MCwxOTg2OTE4MDYxLDM0MzAzMjI1NjgsMzg1NDQ4ODUsMzg1NjEzNzI5NSw3MTgwMDIxMTcsODkzNjgxNzAyLDE2NTQ4ODYzMjUsMjk3NTQ4NDM4MiwzMTIyMzU4MDUzLDM5MjY4MjUwMjksNDI3NDA1MzQ2OSw3OTYxOTc1NzEsMTI5MDgwMTc5MywxMTg0MzQyOTI1LDM1NTYzNjE4MzUsMjQwNTQyNjk0NywyNDU5NzM1MzE3LDE4MzY3NzIyODcsMTM4MTYyMDM3MywzMTk2MjY3OTg4LDE5NDgzNzM4NDgsMzc2NDk4ODIzMywzMzg1MzQ1MTY2LDMyNjM3ODU1ODksMjM5MDMyNTQ5MiwxNDgwNDg1Nzg1LDMxMTEyNDcxNDMsMzc4MDA5NzcyNiwyMjkzMDQ1MjMyLDU0ODE2OTQxNywzNDU5OTUzNzg5LDM3NDYxNzUwNzUsNDM5NDUyMzg5LDEzNjIzMjE1NTksMTQwMDg0OTc2MiwxNjg1NTc3OTA1LDE4MDY1OTkzNTUsMjE3NDc1NDA0NiwxMzcwNzM5MTMsMTIxNDc5NzkzNiwxMTc0MjE1MDU1LDM3MzE2NTQ1NDgsMjA3OTg5NzQyNiwxOTQzMjE3MDY3LDEyNTg0ODAyNDIsNTI5NDg3ODQzLDE0MzcyODA4NzAsMzk0NTI2OTE3MCwzMDQ5MzkwODk1LDMzMTMyMTIwMzgsOTIzMzEzNjE5LDY3OTk5OGUzLDMyMTUzMDcyOTksNTczMjYwODIsMzc3NjQyMjIxLDM0NzQ3Mjk4NjYsMjA0MTg3NzE1OSwxMzMzNjE5MDcsMTc3NjQ2MDExMCwzNjczNDc2NDUzLDk2MzkyNDU0LDg3ODg0NTkwNSwyODAxNjk5NTI0LDc3NzIzMTY2OCw0MDgyNDc1MTcwLDIzMzAwMTQyMTMsNDE0MjYyNjIxMiwyMjEzMjk2Mzk1LDE2MjYzMTk0MjQsMTkwNjI0NzI2MiwxODQ2NTYzMjYxLDU2Mjc1NTkwMiwzNzA4MTczNzE4LDEwNDA1NTk4MzcsMzg3MTE2Mzk4MSwxNDE4NTczMjAxLDMyOTQ0MzA1NzcsMTE0NTg1MzQ4LDEzNDM2MTg5MTIsMjU2NjU5NTYwOSwzMTg2MjAyNTgyLDEwNzgxODUwOTcsMzY1MTA0MTEyNywzODk2Njg4MDQ4LDIzMDc2MjI5MTksNDI1NDA4NzQzLDMzNzEwOTY5NTMsMjA4MTA0ODQ4MSwxMTA4MzM5MDY4LDIyMTY2MTAyOTYsMCwyMTU2Mjk5MDE3LDczNjk3MDgwMiwyOTI1OTY3NjYsMTUxNzQ0MDYyMCwyNTE2NTcyMTMsMjIzNTA2MTc3NSwyOTMzMjAyNDkzLDc1ODcyMDMxMCwyNjU5MDUxNjIsMTU1NDM5MTQwMCwxNTMyMjg1MzM5LDkwODk5OTIwNCwxNzQ1Njc2OTIsMTQ3NDc2MDU5NSw0MDAyODYxNzQ4LDI2MTAwMTE2NzUsMzIzNDE1NjQxNiwzNjkzMTI2MjQxLDIwMDE0MzA4NzQsMzAzNjk5NDg0LDI0Nzg0NDMyMzQsMjY4NzE2NTg4OCw1ODUxMjI2MjAsNDU0NDk5NjAyLDE1MTg0OTc0MiwyMzQ1MTE5MjE4LDMwNjQ1MTA3NjUsNTE0NDQzMjg0LDQwNDQ5ODE1OTEsMTk2MzQxMjY1NSwyNTgxNDQ1NjE0LDIxMzcwNjI4MTksMTkzMDg1MzUsMTkyODcwNzE2NCwxNzE1MTkzMTU2LDQyMTkzNTIxNTUsMTEyNjc5MDc5NSw2MDAyMzUyMTEsMzk5Mjc0MjA3MCwzODQxMDI0OTUyLDgzNjU1MzQzMSwxNjY5NjY0ODM0LDI1MzU2MDQyNDMsMzMyMzAxMTIwNCwxMjQzOTA1NDEzLDMxNDE0MDA3ODYsNDE4MDgwODExMCw2OTg0NDUyNTUsMjY1Mzg5OTU0OSwyOTg5NTUyNjA0LDIyNTM1ODEzMjUsMzI1MjkzMjcyNywzMDA0NTkxMTQ3LDE4OTEyMTE2ODksMjQ4NzgxMDU3NywzOTE1NjUzNzAzLDQyMzcwODM4MTYsNDAzMDY2NzQyNCwyMTAwMDkwOTY2LDg2NTEzNjQxOCwxMjI5ODk5NjU1LDk1MzI3MDc0NSwzMzk5Njc5NjI4LDM1NTc1MDQ2NjQsNDExODkyNTIyMiwyMDYxMzc5NzQ5LDMwNzk1NDY1ODYsMjkxNTAxNzc5MSw5ODM0MjYwOTIsMjAyMjgzNzU4NCwxNjA3MjQ0NjUwLDIxMTg1NDE5MDgsMjM2Njg4MjU1MCwzNjM1OTk2ODE2LDk3MjUxMjgxNCwzMjgzMDg4NzcwLDE1Njg3MTg0OTUsMzQ5OTMyNjU2OSwzNTc2NTM5NTAzLDYyMTk4MjY3MSwyODk1NzIzNDY0LDQxMDg4Nzk1MiwyNjIzNzYyMTUyLDEwMDIxNDI2ODMsNjQ1NDAxMDM3LDE0OTQ4MDc2NjIsMjU5NTY4NDg0NCwxMzM1NTM1NzQ3LDI1MDcwNDAyMzAsNDI5MzI5NTc4NiwzMTY3Njg0NjQxLDM2NzU4NTAwNywzODg1NzUwNzE0LDE4NjU4NjI3MzAsMjY2ODIyMTY3NCwyOTYwOTcxMzA1LDI3NjMxNzM2ODEsMTA1OTI3MDk1NCwyNzc3OTUyNDU0LDI3MjQ2NDI4NjksMTMyMDk1NzgxMiwyMTk0MzE5MTAwLDI0Mjk1OTU4NzIsMjgxNTk1NjI3NSw3NzA4OTUyMSwzOTczNzczMTIxLDM0NDQ1NzU4NzEsMjQ0ODgzMDIzMSwxMzA1OTA2NTUwLDQwMjEzMDg3MzksMjg1NzE5NDcwMCwyNTE2OTAxODYwLDM1MTgzNTg0MzAsMTc4NzMwNDc4MCw3NDAyNzY0MTcsMTY5OTgzOTgxNCwxNTkyMzk0OTA5LDIzNTIzMDc0NTcsMjI3MjU1NjAyNiwxODg4MjEyNDMsMTcyOTk3NzAxMSwzNjg3OTk0MDAyLDI3NDA4NDg0MSwzNTk0OTgyMjUzLDM2MTM0OTQ0MjYsMjcwMTk0OTQ5NSw0MTYyMDk2NzI5LDMyMjczNDU3MSwyODM3OTY2NTQyLDE2NDA1NzY0MzksNDg0ODMwNjg5LDEyMDI3OTc2OTAsMzUzNzg1MjgyOCw0MDY3NjM5MTI1LDM0OTA3NTczNiwzMzQyMzE5NDc1LDQxNTc0NjcyMTksNDI1NTgwMDE1OSwxMDMwNjkwMDE1LDExNTUyMzc0OTYsMjk1MTk3MTI3NCwxNzU3NjkxNTc3LDYwNzM5ODk2OCwyNzM4OTA1MDI2LDQ5OTM0Nzk5MCwzNzk0MDc4OTA4LDEwMTE0NTI3MTIsMjI3ODg1NTY3LDI4MTg2NjY4MDksMjEzMTE0Mzc2LDMwMzQ4ODEyNDAsMTQ1NTUyNTk4OCwzNDE0NDUwNTU1LDg1MDgxNzIzNywxODE3OTk4NDA4LDMwOTI3MjY0ODBdO3ZhciBVMT1bMCwyMzU0NzQxODcsNDcwOTQ4Mzc0LDMwMzc2NTI3Nyw5NDE4OTY3NDgsOTA4OTMzNDE1LDYwNzUzMDU1NCw3MDg3ODA4NDksMTg4Mzc5MzQ5NiwyMTE4MjE0OTk1LDE4MTc4NjY4MzAsMTY0OTYzOTIzNywxMjE1MDYxMTA4LDExODEwNDUxMTksMTQxNzU2MTY5OCwxNTE3NzY3NTI5LDM3Njc1ODY5OTIsNDAwMzA2MTE3OSw0MjM2NDI5OTkwLDQwNjkyNDY4OTMsMzYzNTczMzY2MCwzNjAyNzcwMzI3LDMyOTkyNzg0NzQsMzQwMDUyODc2OSwyNDMwMTIyMjE2LDI2NjQ1NDM3MTUsMjM2MjA5MDIzOCwyMTkzODYyNjQ1LDI4MzUxMjMzOTYsMjgwMTEwNzQwNywzMDM1NTM1MDU4LDMxMzU3NDA4ODksMzY3ODEyNDkyMywzNTc2ODcwNTEyLDMzNDEzOTQyODUsMzM3NDM2MTcwMiwzODEwNDk2MzQzLDM5Nzc2NzUzNTYsNDI3OTA4MDI1Nyw0MDQzNjEwMTg2LDI4NzY0OTQ2MjcsMjc3NjI5MjkwNCwzMDc2NjM5MDI5LDMxMTA2NTA5NDIsMjQ3MjAxMTUzNSwyNjQwMjQzMjA0LDI0MDM3Mjg2NjUsMjE2OTMwMzA1OCwxMDAxMDg5OTk1LDg5OTgzNTU4NCw2NjY0NjQ3MzMsNjk5NDMyMTUwLDU5NzI3ODQ3LDIyNjkwNjg2MCw1MzA0MDA3NTMsMjk0OTMwNjgyLDEyNzMxNjg3ODcsMTE3Mjk2NzA2NCwxNDc1NDE4NTAxLDE1MDk0MzA0MTQsMTk0MjQzNTc3NSwyMTEwNjY3NDQ0LDE4NzYyNDE4MzMsMTY0MTgxNjIyNiwyOTEwMjE5NzY2LDI3NDMwMzQxMDksMjk3NjE1MTUyMCwzMjExNjIzMTQ3LDI1MDUyMDIxMzgsMjYwNjQ1Mzk2OSwyMzAyNjkwMjUyLDIyNjk3Mjg0NTUsMzcxMTgyOTQyMiwzNTQzNTk5MjY5LDMyNDA4OTQzOTIsMzQ3NTMxMzMzMSwzODQzNjk5MDc0LDM5NDM5MDY0NDEsNDE3ODA2MjIyOCw0MTQ0MDQ3Nzc1LDEzMDY5NjczNjYsMTEzOTc4MTcwOSwxMzc0OTg4MTEyLDE2MTA0NTk3MzksMTk3NTY4MzQzNCwyMDc2OTM1MjY1LDE3NzUyNzY5MjQsMTc0MjMxNTEyNywxMDM0ODY3OTk4LDg2NjYzNzg0NSw1NjYwMjE4OTYsODAwNDQwODM1LDkyOTg3Njk4LDE5MzE5NTA2NSw0Mjk0NTYxNjQsMzk1NDQxNzExLDE5ODQ4MTI2ODUsMjAxNzc3ODU2NiwxNzg0NjYzMTk1LDE2ODM0MDcyNDgsMTMxNTU2MjE0NSwxMDgwMDk0NjM0LDEzODM4NTYzMTEsMTU1MTAzNzg4NCwxMDEwMzk4MjksMTM1MDUwMjA2LDQzNzc1NzEyMywzMzc1NTM4NjQsMTA0MjM4NTY1Nyw4MDc5NjI2MTAsNTczODA0NzgzLDc0MjAzOTAxMiwyNTMxMDY3NDUzLDI1NjQwMzMzMzQsMjMyODgyODk3MSwyMjI3NTczMDI0LDI5MzU1NjY4NjUsMjcwMDA5OTM1NCwzMDAxNzU1NjU1LDMxNjg5MzcyMjgsMzg2ODU1MjgwNSwzOTAyNTYzMTgyLDQyMDMxODExNzEsNDEwMjk3NzkxMiwzNzM2MTY0OTM3LDM1MDE3NDE4OTAsMzI2NTQ3ODc1MSwzNDMzNzEyOTgwLDExMDYwNDE1OTEsMTM0MDQ2MzEwMCwxNTc2OTc2NjA5LDE0MDg3NDkwMzQsMjA0MzIxMTQ4MywyMDA5MTk1NDcyLDE3MDg4NDgzMzMsMTgwOTA1NDE1MCw4MzI4NzcyMzEsMTA2ODM1MTM5Niw3NjY5NDU0NjUsNTk5NzYyMzU0LDE1OTQxNzk4NywxMjY0NTQ2NjQsMzYxOTI5ODc3LDQ2MzE4MDE5MCwyNzA5MjYwODcxLDI5NDM2ODIzODAsMzE3ODEwNjk2MSwzMDA5ODc5Mzg2LDI1NzI2OTcxOTUsMjUzODY4MTE4NCwyMjM2MjI4NzMzLDIzMzY0MzQ1NTAsMzUwOTg3MTEzNSwzNzQ1MzQ1MzAwLDM0NDE4NTAzNzcsMzI3NDY2NzI2NiwzOTEwMTYxOTcxLDM4NzcxOTg2NDgsNDExMDU2ODQ4NSw0MjExODE4Nzk4LDI1OTc4MDY0NzYsMjQ5NzYwNDc0MywyMjYxMDg5MTc4LDIyOTUxMDEwNzMsMjczMzg1NjE2MCwyOTAyMDg3ODUxLDMyMDI0MzcwNDYsMjk2ODAxMTQ1MywzOTM2MjkxMjg0LDM4MzUwMzY4OTUsNDEzNjQ0MDc3MCw0MTY5NDA4MjAxLDM1MzU0ODY0NTYsMzcwMjY2NTQ1OSwzNDY3MTkyMzAyLDMyMzE3MjIyMTMsMjA1MTUxODc4MCwxOTUxMzE3MDQ3LDE3MTY4OTA0MTAsMTc1MDkwMjMwNSwxMTEzODE4Mzg0LDEyODIwNTAwNzUsMTU4NDUwNDU4MiwxMzUwMDc4OTg5LDE2ODgxMDg1Miw2NzU1NjQ2MywzNzEwNDkzMzAsNDA0MDE2NzYxLDg0MTczOTU5MiwxMDA4OTE4NTk1LDc3NTU1MDgxNCw1NDAwODA3MjUsMzk2OTU2MjM2OSwzODAxMzMyMjM0LDQwMzU0ODkwNDcsNDI2OTkwNzk5NiwzNTY5MjU1MjEzLDM2Njk0NjI1NjYsMzM2Njc1NDYxOSwzMzMyNzQwMTQ0LDI2MzEwNjU0MzMsMjQ2Mzg3OTc2MiwyMTYwMTE3MDcxLDIzOTU1ODg2NzYsMjc2NzY0NTU1NywyODY4ODk3NDA2LDMxMDIwMTE3NDcsMzA2OTA0OTk2MCwyMDIwMDg0OTcsMzM3NzgzNjIsMjcwMDQwNDg3LDUwNDQ1OTQzNiw4NzU0NTEyOTMsOTc1NjU4NjQ2LDY3NTAzOTYyNyw2NDEwMjUxNTIsMjA4NDcwNDIzMywxOTE3NTE4NTYyLDE2MTU4NjEyNDcsMTg1MTMzMjg1MiwxMTQ3NTUwNjYxLDEyNDg4MDI1MTAsMTQ4NDAwNTg0MywxNDUxMDQ0MDU2LDkzMzMwMTM3MCw5NjczMTE3MjksNzMzMTU2OTcyLDYzMjk1MzcwMywyNjAzODg5NTAsMjU5NjU5MTcsMzI4NjcxODA4LDQ5NjkwNjA1OSwxMjA2NDc3ODU4LDEyMzk0NDM3NTMsMTU0MzIwODUwMCwxNDQxOTUyNTc1LDIxNDQxNjE4MDYsMTkwODY5NDI3NywxNjc1NTc3ODgwLDE4NDI3NTk0NDMsMzYxMDM2OTIyNiwzNjQ0Mzc5NTg1LDM0MDgxMTk1MTYsMzMwNzkxNjI0Nyw0MDExMTkwNTAyLDM3NzY3Njc0NjksNDA3NzM4NDQzMiw0MjQ1NjE4NjgzLDI4MDk3NzExNTQsMjg0MjczNzA0OSwzMTQ0Mzk2NDIwLDMwNDMxNDA0OTUsMjY3MzcwNTE1MCwyNDM4MjM3NjIxLDIyMDMwMzIyMzIsMjM3MDIxMzc5NV07dmFyIFUyPVswLDE4NTQ2OTE5NywzNzA5MzgzOTQsNDg3NzI1ODQ3LDc0MTg3Njc4OCw2NTc4NjE5NDUsOTc1NDUxNjk0LDgyNDg1MjI1OSwxNDgzNzUzNTc2LDE0MDA3ODMyMDUsMTMxNTcyMzg5MCwxMTY0MDcxODA3LDE5NTA5MDMzODgsMjEzNTMxOTg4OSwxNjQ5NzA0NTE4LDE3Njc1MzY0NTksMjk2NzUwNzE1MiwzMTUyOTc2MzQ5LDI4MDE1NjY0MTAsMjkxODM1Mzg2MywyNjMxNDQ3NzgwLDI1NDc0MzI5MzcsMjMyODE0MzYxNCwyMTc3NTQ0MTc5LDM5MDE4MDY3NzYsMzgxODgzNjQwNSw0MjcwNjM5Nzc4LDQxMTg5ODc2OTUsMzI5OTQwOTAzNiwzNDgzODI1NTM3LDM1MzUwNzI5MTgsMzY1MjkwNDg1OSwyMDc3OTY1MjQzLDE4OTMwMjAzNDIsMTg0MTc2ODg2NSwxNzI0NDU3MTMyLDE0NzQ1MDI1NDMsMTU1OTA0MTY2NiwxMTA3MjM0MTk3LDEyNTczMDkzMzYsNTk4NDM4ODY3LDY4MTkzMzUzNCw5MDEyMTA1NjksMTA1MjMzODM3MiwyNjEzMTQ1MzUsNzc0MjIzMTQsNDI4ODE5OTY1LDMxMDQ2MzcyOCwzNDA5Njg1MzU1LDMyMjQ3NDA0NTQsMzcxMDM2ODExMywzNTkzMDU2MzgwLDM4NzU3NzAyMDcsMzk2MDMwOTMzMCw0MDQ1MzgwOTMzLDQxOTU0NTYwNzIsMjQ3MTIyNDA2NywyNTU0NzE4NzM0LDIyMzcxMzMwODEsMjM4ODI2MDg4NCwzMjEyMDM1ODk1LDMwMjgxNDM2NzQsMjg0MjY3ODU3MywyNzI0MzIyMzM2LDQxMzg1NjMxODEsNDI1NTM1MDYyNCwzNzY5NzIxOTc1LDM5NTUxOTExNjIsMzY2NzIxOTAzMywzNTE2NjE5NjA0LDM0MzE1NDY5NDcsMzM0NzUzMjExMCwyOTMzNzM0OTE3LDI3ODIwODI4MjQsMzA5OTY2NzQ4NywzMDE2Njk3MTA2LDIxOTYwNTI1MjksMjMxMzg4NDQ3NiwyNDk5MzQ4NTIzLDI2ODM3NjUwMzAsMTE3OTUxMDQ2MSwxMjk2Mjk3OTA0LDEzNDc1NDgzMjcsMTUzMzAxNzUxNCwxNzg2MTAyNDA5LDE2MzU1MDI5ODAsMjA4NzMwOTQ1OSwyMDAzMjk0NjIyLDUwNzM1ODkzMywzNTU3MDY4NDAsMTM2NDI4NzUxLDUzNDU4MzcwLDgzOTIyNDAzMyw5NTcwNTU5ODAsNjA1NjU3MzM5LDc5MDA3Mzg0NiwyMzczMzQwNjMwLDIyNTYwMjg4OTEsMjYwNzQzOTgyMCwyNDIyNDk0OTEzLDI3MDYyNzA2OTAsMjg1NjM0NTgzOSwzMDc1NjM2MjE2LDMxNjAxNzUzNDksMzU3Mzk0MTY5NCwzNzI1MDY5NDkxLDMyNzMyNjcxMDgsMzM1Njc2MTc2OSw0MTgxNTk4NjAyLDQwNjMyNDIzNzUsNDAxMTk5NjA0OCwzODI4MTAzODM3LDEwMzMyOTcxNTgsOTE1OTg1NDE5LDczMDUxNzI3Niw1NDU1NzIzNjksMjk2Njc5NzMwLDQ0Njc1NDg3OSwxMjkxNjYxMjAsMjEzNzA1MjUzLDE3MDk2MTAzNTAsMTg2MDczODE0NywxOTQ1Nzk4NTE2LDIwMjkyOTMxNzcsMTIzOTMzMTE2MiwxMTIwOTc0OTM1LDE2MDY1OTEyOTYsMTQyMjY5OTA4NSw0MTQ4MjkyODI2LDQyMzMwOTQ2MTUsMzc4MTAzMzY2NCwzOTMxMzcxNDY5LDM2ODIxOTE1OTgsMzQ5NzUwOTM0NywzNDQ2MDA0NDY4LDMzMjg5NTUzODUsMjkzOTI2NjIyNiwyNzU1NjM2NjcxLDMxMDY3ODA4NDAsMjk4ODY4NzI2OSwyMTk4NDM4MDIyLDIyODIxOTUzMzksMjUwMTIxODk3MiwyNjUyNjA5NDI1LDEyMDE3NjUzODYsMTI4NjU2NzE3NSwxMzcxMzY4OTc2LDE1MjE3MDY3ODEsMTgwNTIxMTcxMCwxNjIwNTI5NDU5LDIxMDU4ODcyNjgsMTk4ODgzODE4NSw1MzM4MDQxMzAsMzUwMTc0NTc1LDE2NDQzOTY3Miw0NjM0NjEwMSw4NzA5MTIwODYsOTU0NjY5NDAzLDYzNjgxMzkwMCw3ODgyMDQzNTMsMjM1ODk1NzkyMSwyMjc0NjgwNDI4LDI1OTI1MjM2NDMsMjQ0MTY2MTU1OCwyNjk1MDMzNjg1LDI4ODAyNDAyMTYsMzA2NTk2MjgzMSwzMTgyNDg3NjE4LDM1NzIxNDU5MjksMzc1NjI5OTc4MCwzMjcwOTM3ODc1LDMzODg1MDcxNjYsNDE3NDU2MDA2MSw0MDkxMzI3MDI0LDQwMDY1MjExMjcsMzg1NDYwNjM3OCwxMDE0NjQ2NzA1LDkzMDM2OTIxMiw3MTEzNDk2NzUsNTYwNDg3NTkwLDI3Mjc4NjMwOSw0NTc5OTI4NDAsMTA2ODUyNzY3LDIyMzM3NzU1NCwxNjc4MzgxMDE3LDE4NjI1MzQ4NjgsMTkxNDA1MjAzNSwyMDMxNjIxMzI2LDEyMTEyNDc1OTcsMTEyODAxNDU2MCwxNTgwMDg3Nzk5LDE0MjgxNzMwNTAsMzIyODMzMTksMTgyNjIxMTE0LDQwMTYzOTU5Nyw0ODY0NDEzNzYsNzY4OTE3MTIzLDY1MTg2ODA0NiwxMDAzMDA3MTI5LDgxODMyNDg4NCwxNTAzNDQ5ODIzLDEzODUzNTYyNDIsMTMzMzgzODAyMSwxMTUwMjA4NDU2LDE5NzM3NDUzODcsMjEyNTEzNTg0NiwxNjczMDYxNjE3LDE3NTY4MTg5NDAsMjk3MDM1NjMyNywzMTIwNjk0MTIyLDI4MDI4NDk5MTcsMjg4NzY1MTY5NiwyNjM3NDQyNjQzLDI1MjAzOTM1NjYsMjMzNDY2OTg5NywyMTQ5OTg3NjUyLDM5MTcyMzQ3MDMsMzc5OTE0MTEyMiw0Mjg0NTAyMDM3LDQxMDA4NzI0NzIsMzMwOTU5NDE3MSwzNDYwOTg0NjMwLDM1NDU3ODk0NzMsMzYyOTU0Njc5NiwyMDUwNDY2MDYwLDE4OTk2MDM5NjksMTgxNDgwMzIyMiwxNzMwNTI1NzIzLDE0NDM4NTc3MjAsMTU2MDM4MjUxNywxMDc1MDI1Njk4LDEyNjAyMzIyMzksNTc1MTM4MTQ4LDY5MjcwNzQzMyw4Nzg0NDMzOTAsMTA2MjU5NzIzNSwyNDMyNTY2NTYsOTEzNDE5MTcsNDA5MTk4NDEwLDMyNTk2NTM4MywzNDAzMTAwNjM2LDMyNTIyMzg1NDUsMzcwNDMwMDQ4NiwzNjIwMDIyOTg3LDM4NzQ0MjgzOTIsMzk5MDk1MzE4OSw0MDQyNDU5MTIyLDQyMjc2NjU2NjMsMjQ2MDQ0OTIwNCwyNTc4MDE4NDg5LDIyMjY4NzUzMTAsMjQxMTAyOTE1NSwzMTk4MTE1MjAwLDMwNDYyMDA0NjEsMjgyNzE3Nzg4MiwyNzQzOTQ0ODU1XTt2YXIgVTM9WzAsMjE4ODI4Mjk3LDQzNzY1NjU5NCwzODc3ODExNDcsODc1MzEzMTg4LDk1ODg3MTA4NSw3NzU1NjIyOTQsNTkwNDI0NjM5LDE3NTA2MjYzNzYsMTY5OTk3MDYyNSwxOTE3NzQyMTcwLDIxMzUyNTM1ODcsMTU1MTEyNDU4OCwxMzY3Mjk1NTg5LDExODA4NDkyNzgsMTI2NTE5NTYzOSwzNTAxMjUyNzUyLDM3MjAwODEwNDksMzM5OTk0MTI1MCwzMzUwMDY1ODAzLDM4MzU0ODQzNDAsMzkxOTA0MjIzNyw0MjcwNTA3MTc0LDQwODUzNjk1MTksMzEwMjI0OTE3NiwzMDUxNTkzNDI1LDI3MzQ1OTExNzgsMjk1MjEwMjU5NSwyMzYxNjk4NTU2LDIxNzc4Njk1NTcsMjUzMDM5MTI3OCwyNjE0NzM3NjM5LDMxNDU0NTY0NDMsMzA2MDg0NzkyMiwyNzA4MzI2MTg1LDI4OTI0MTczMTIsMjQwNDkwMTY2MywyMTg3MTI4MDg2LDI1MDQxMzAzMTcsMjU1NTA0ODE5NiwzNTQyMzMwMjI3LDM3MjcyMDU3NTQsMzM3NTc0MDc2OSwzMjkyNDQ1MDMyLDM4NzY1NTc2NTUsMzkyNjE3MDk3NCw0MjQ2MzEwNzI1LDQwMjc3NDQ1ODgsMTgwODQ4MTE5NSwxNzIzODcyNjc0LDE5MTAzMTkwMzMsMjA5NDQxMDE2MCwxNjA4OTc1MjQ3LDEzOTEyMDE2NzAsMTE3MzQzMDE3MywxMjI0MzQ4MDUyLDU5OTg0ODY3LDI0NDg2MDM5NCw0MjgxNjkyMDEsMzQ0ODczNDY0LDkzNTI5Mzg5NSw5ODQ5MDcyMTQsNzY2MDc4OTMzLDU0NzUxMjc5NiwxODQ0ODgyODA2LDE2MjcyMzUxOTksMjAxMTIxNDE4MCwyMDYyMjcwMzE3LDE1MDc0OTcyOTgsMTQyMzAyMjkzOSwxMTM3NDc3OTUyLDEzMjE2OTkxNDUsOTUzNDU5ODIsMTQ1MDg1MjM5LDUzMjIwMTc3MiwzMTM3NzM4NjEsODMwNjYxOTE0LDEwMTU2NzE1NzEsNzMxMTgzMzY4LDY0ODAxNzY2NSwzMTc1NTAxMjg2LDI5NTc4NTM2NzksMjgwNzA1ODkzMiwyODU4MTE1MDY5LDIzMDU0NTU1NTQsMjIyMDk4MTE5NSwyNDc0NDA0MzA0LDI2NTg2MjU0OTcsMzU3NTUyODg3OCwzNjI1MjY4MTM1LDM0NzM0MTY2MzYsMzI1NDk4ODcyNSwzNzc4MTUxODE4LDM5NjMxNjE0NzUsNDIxMzQ0NzA2NCw0MTMwMjgxMzYxLDM1OTk1OTUwODUsMzY4MzAyMjkxNiwzNDMyNzM3Mzc1LDMyNDc0NjU1NTgsMzgwMjIyMjE4NSw0MDIwOTEyMjI0LDQxNzI3NjM3NzEsNDEyMjc2MjM1NCwzMjAxNjMxNzQ5LDMwMTc2NzI3MTYsMjc2NDI0OTYyMywyODQ4NDYxODU0LDIzMzE1OTAxNzcsMjI4MDc5NjIwMCwyNDMxNTkwOTYzLDI2NDg5NzY0NDIsMTA0Njk5NjEzLDE4ODEyNzQ0NCw0NzI2MTU2MzEsMjg3MzQzODE0LDg0MDAxOTcwNSwxMDU4NzA5NzQ0LDY3MTU5MzE5NSw2MjE1OTE3NzgsMTg1MjE3MTkyNSwxNjY4MjEyODkyLDE5NTM3NTc4MzEsMjAzNzk3MDA2MiwxNTE0NzkwNTc3LDE0NjM5OTY2MDAsMTA4MDAxNzU3MSwxMjk3NDAzMDUwLDM2NzM2MzczNTYsMzYyMzYzNjk2NSwzMjM1OTk1MTM0LDM0NTQ2ODYxOTksNDAwNzM2MDk2OCwzODIyMDkwMTc3LDQxMDcxMDE2NTgsNDE5MDUzMDUxNSwyOTk3ODI1OTU2LDMyMTUyMTI0NjEsMjgzMDcwODE1MCwyNzc5OTE1MTk5LDIyNTY3MzQ1OTIsMjM0MDk0Nzg0OSwyNjI3MDE2MDgyLDI0NDMwNTgwNzUsMTcyNDY2NTU2LDEyMjQ2NjE2NSwyNzM3OTIzNjYsNDkyNDgzNDMxLDEwNDcyMzllMyw4NjE5NjgyMDksNjEyMjA1ODk4LDY5NTYzNDc1NSwxNjQ2MjUyMzQwLDE4NjM2Mzg4NDUsMjAxMzkwODI2MiwxOTYzMTE1MzExLDE0NDYyNDI1NzYsMTUzMDQ1NTgzMywxMjc3NTU1OTcwLDEwOTM1OTc5NjMsMTYzNjYwNDYzMSwxODIwODI0Nzk4LDIwNzM3MjQ2MTMsMTk4OTI0OTIyOCwxNDM2NTkwODM1LDE0ODc2NDU5NDYsMTMzNzM3NjQ4MSwxMTE5NzI3ODQ4LDE2NDk0ODYzOSw4MTc4MTkxMCwzMzE1NDQyMDUsNTE2NTUyODM2LDEwMzk3MTcwNTEsODIxMjg4MTE0LDY2OTk2MTg5Nyw3MTk3MDAxMjgsMjk3MzUzMDY5NSwzMTU3NzUwODYyLDI4NzE2ODI2NDUsMjc4NzIwNzI2MCwyMjMyNDM1Mjk5LDIyODM0OTA0MTAsMjY2Nzk5NDczNywyNDUwMzQ2MTA0LDM2NDcyMTIwNDcsMzU2NDA0NTMxOCwzMjc5MDMzODg1LDM0NjQwNDI1MTYsMzk4MDkzMTYyNywzNzYyNTAyNjkwLDQxNTAxNDQ1NjksNDE5OTg4MjgwMCwzMDcwMzU2NjM0LDMxMjEyNzU1MzksMjkwNDAyNzI3MiwyNjg2MjU0NzIxLDIyMDA4MTg4NzgsMjM4NDkxMTAzMSwyNTcwODMyMDQ0LDI0ODYyMjQ1NDksMzc0NzE5MjAxOCwzNTI4NjI2OTA3LDMzMTAzMjE4NTYsMzM1OTkzNjIwMSwzOTUwMzU1NzAyLDM4NjcwNjA5OTEsNDA0OTg0NDQ1Miw0MjM0NzIxMDA1LDE3Mzk2NTYyMDIsMTc5MDU3NTEwNywyMTA4MTAwNjMyLDE4OTAzMjgwODEsMTQwMjgxMTQzOCwxNTg2OTAzNTkxLDEyMzM4NTY1NzIsMTE0OTI0OTA3NywyNjY5NTk5MzgsNDgzOTQ4MjcsMzY5MDU3ODcyLDQxODY3MjIxNywxMDAyNzgzODQ2LDkxOTQ4OTEzNSw1Njc0OTg4NjgsNzUyMzc1NDIxLDIwOTMzNjIyNSwyNDE5NzU0NCwzNzYxODc4MjcsNDU5NzQ0Njk4LDk0NTE2NDE2NSw4OTUyODc2OTIsNTc0NjI0NjYzLDc5MzQ1MTkzNCwxNjc5OTY4MjMzLDE3NjQzMTM1NjgsMjExNzM2MDYzNSwxOTMzNTMwNjEwLDEzNDMxMjc1MDEsMTU2MDYzNzg5MiwxMjQzMTEyNDE1LDExOTI0NTU2MzgsMzcwNDI4MDg4MSwzNTE5MTQyMjAwLDMzMzYzNTg2OTEsMzQxOTkxNTU2MiwzOTA3NDQ4NTk3LDM4NTc1NzIxMjQsNDA3NTg3NzEyNyw0Mjk0NzA0Mzk4LDMwMjk1MTAwMDksMzExMzg1NTM0NCwyOTI3OTM0MzE1LDI3NDQxMDQyOTAsMjE1OTk3NjI4NSwyMzc3NDg2Njc2LDI1OTQ3MzQ5MjcsMjU0NDA3ODE1MF07dmFyIFU0PVswLDE1MTg0OTc0MiwzMDM2OTk0ODQsNDU0NDk5NjAyLDYwNzM5ODk2OCw3NTg3MjAzMTAsOTA4OTk5MjA0LDEwNTkyNzA5NTQsMTIxNDc5NzkzNiwxMDk3MTU5NTUwLDE1MTc0NDA2MjAsMTQwMDg0OTc2MiwxODE3OTk4NDA4LDE2OTk4Mzk4MTQsMjExODU0MTkwOCwyMDAxNDMwODc0LDI0Mjk1OTU4NzIsMjU4MTQ0NTYxNCwyMTk0MzE5MTAwLDIzNDUxMTkyMTgsMzAzNDg4MTI0MCwzMTg2MjAyNTgyLDI4MDE2OTk1MjQsMjk1MTk3MTI3NCwzNjM1OTk2ODE2LDM1MTgzNTg0MzAsMzM5OTY3OTYyOCwzMjgzMDg4NzcwLDQyMzcwODM4MTYsNDExODkyNTIyMiw0MDAyODYxNzQ4LDM4ODU3NTA3MTQsMTAwMjE0MjY4Myw4NTA4MTcyMzcsNjk4NDQ1MjU1LDU0ODE2OTQxNyw1Mjk0ODc4NDMsMzc3NjQyMjIxLDIyNzg4NTU2Nyw3NzA4OTUyMSwxOTQzMjE3MDY3LDIwNjEzNzk3NDksMTY0MDU3NjQzOSwxNzU3NjkxNTc3LDE0NzQ3NjA1OTUsMTU5MjM5NDkwOSwxMTc0MjE1MDU1LDEyOTA4MDE3OTMsMjg3NTk2ODMxNSwyNzI0NjQyODY5LDMxMTEyNDcxNDMsMjk2MDk3MTMwNSwyNDA1NDI2OTQ3LDIyNTM1ODEzMjUsMjYzODYwNjYyMywyNDg3ODEwNTc3LDM4MDg2NjIzNDcsMzkyNjgyNTAyOSw0MDQ0OTgxNTkxLDQxNjIwOTY3MjksMzM0MjMxOTQ3NSwzNDU5OTUzNzg5LDM1NzY1Mzk1MDMsMzY5MzEyNjI0MSwxOTg2OTE4MDYxLDIxMzcwNjI4MTksMTY4NTU3NzkwNSwxODM2NzcyMjg3LDEzODE2MjAzNzMsMTUzMjI4NTMzOSwxMDc4MTg1MDk3LDEyMjk4OTk2NTUsMTA0MDU1OTgzNyw5MjMzMTM2MTksNzQwMjc2NDE3LDYyMTk4MjY3MSw0Mzk0NTIzODksMzIyNzM0NTcxLDEzNzA3MzkxMywxOTMwODUzNSwzODcxMTYzOTgxLDQwMjEzMDg3MzksNDEwNDYwNTc3Nyw0MjU1ODAwMTU5LDMyNjM3ODU1ODksMzQxNDQ1MDU1NSwzNDk5MzI2NTY5LDM2NTEwNDExMjcsMjkzMzIwMjQ5MywyODE1OTU2Mjc1LDMxNjc2ODQ2NDEsMzA0OTM5MDg5NSwyMzMwMDE0MjEzLDIyMTMyOTYzOTUsMjU2NjU5NTYwOSwyNDQ4ODMwMjMxLDEzMDU5MDY1NTAsMTE1NTIzNzQ5NiwxNjA3MjQ0NjUwLDE0NTU1MjU5ODgsMTc3NjQ2MDExMCwxNjI2MzE5NDI0LDIwNzk4OTc0MjYsMTkyODcwNzE2NCw5NjM5MjQ1NCwyMTMxMTQzNzYsMzk2NjczODE4LDUxNDQ0MzI4NCw1NjI3NTU5MDIsNjc5OTk4ZTMsODY1MTM2NDE4LDk4MzQyNjA5MiwzNzA4MTczNzE4LDM1NTc1MDQ2NjQsMzQ3NDcyOTg2NiwzMzIzMDExMjA0LDQxODA4MDgxMTAsNDAzMDY2NzQyNCwzOTQ1MjY5MTcwLDM3OTQwNzg5MDgsMjUwNzA0MDIzMCwyNjIzNzYyMTUyLDIyNzI1NTYwMjYsMjM5MDMyNTQ5MiwyOTc1NDg0MzgyLDMwOTI3MjY0ODAsMjczODkwNTAyNiwyODU3MTk0NzAwLDM5NzM3NzMxMjEsMzg1NjEzNzI5NSw0Mjc0MDUzNDY5LDQxNTc0NjcyMTksMzM3MTA5Njk1MywzMjUyOTMyNzI3LDM2NzM0NzY0NTMsMzU1NjM2MTgzNSwyNzYzMTczNjgxLDI5MTUwMTc3OTEsMzA2NDUxMDc2NSwzMjE1MzA3Mjk5LDIxNTYyOTkwMTcsMjMwNzYyMjkxOSwyNDU5NzM1MzE3LDI2MTAwMTE2NzUsMjA4MTA0ODQ4MSwxOTYzNDEyNjU1LDE4NDY1NjMyNjEsMTcyOTk3NzAxMSwxNDgwNDg1Nzg1LDEzNjIzMjE1NTksMTI0MzkwNTQxMywxMTI2NzkwNzk1LDg3ODg0NTkwNSwxMDMwNjkwMDE1LDY0NTQwMTAzNyw3OTYxOTc1NzEsMjc0MDg0ODQxLDQyNTQwODc0MywzODU0NDg4NSwxODg4MjEyNDMsMzYxMzQ5NDQyNiwzNzMxNjU0NTQ4LDMzMTMyMTIwMzgsMzQzMDMyMjU2OCw0MDgyNDc1MTcwLDQyMDAxMTUxMTYsMzc4MDA5NzcyNiwzODk2Njg4MDQ4LDI2NjgyMjE2NzQsMjUxNjkwMTg2MCwyMzY2ODgyNTUwLDIyMTY2MTAyOTYsMzE0MTQwMDc4NiwyOTg5NTUyNjA0LDI4Mzc5NjY1NDIsMjY4NzE2NTg4OCwxMjAyNzk3NjkwLDEzMjA5NTc4MTIsMTQzNzI4MDg3MCwxNTU0MzkxNDAwLDE2Njk2NjQ4MzQsMTc4NzMwNDc4MCwxOTA2MjQ3MjYyLDIwMjI4Mzc1ODQsMjY1OTA1MTYyLDExNDU4NTM0OCw0OTkzNDc5OTAsMzQ5MDc1NzM2LDczNjk3MDgwMiw1ODUxMjI2MjAsOTcyNTEyODE0LDgyMTcxMjE2MCwyNTk1Njg0ODQ0LDI0Nzg0NDMyMzQsMjI5MzA0NTIzMiwyMTc0NzU0MDQ2LDMxOTYyNjc5ODgsMzA3OTU0NjU4NiwyODk1NzIzNDY0LDI3Nzc5NTI0NTQsMzUzNzg1MjgyOCwzNjg3OTk0MDAyLDMyMzQxNTY0MTYsMzM4NTM0NTE2Niw0MTQyNjI2MjEyLDQyOTMyOTU3ODYsMzg0MTAyNDk1MiwzOTkyNzQyMDcwLDE3NDU2NzY5Miw1NzMyNjA4Miw0MTA4ODc5NTIsMjkyNTk2NzY2LDc3NzIzMTY2OCw2NjA1MTAyNjYsMTAxMTQ1MjcxMiw4OTM2ODE3MDIsMTEwODMzOTA2OCwxMjU4NDgwMjQyLDEzNDM2MTg5MTIsMTQ5NDgwNzY2MiwxNzE1MTkzMTU2LDE4NjU4NjI3MzAsMTk0ODM3Mzg0OCwyMTAwMDkwOTY2LDI3MDE5NDk0OTUsMjgxODY2NjgwOSwzMDA0NTkxMTQ3LDMxMjIzNTgwNTMsMjIzNTA2MTc3NSwyMzUyMzA3NDU3LDI1MzU2MDQyNDMsMjY1Mzg5OTU0OSwzOTE1NjUzNzAzLDM3NjQ5ODgyMzMsNDIxOTM1MjE1NSw0MDY3NjM5MTI1LDM0NDQ1NzU4NzEsMzI5NDQzMDU3NywzNzQ2MTc1MDc1LDM1OTQ5ODIyNTMsODM2NTUzNDMxLDk1MzI3MDc0NSw2MDAyMzUyMTEsNzE4MDAyMTE3LDM2NzU4NTAwNyw0ODQ4MzA2ODksMTMzMzYxOTA3LDI1MTY1NzIxMywyMDQxODc3MTU5LDE4OTEyMTE2ODksMTgwNjU5OTM1NSwxNjU0ODg2MzI1LDE1Njg3MTg0OTUsMTQxODU3MzIwMSwxMzM1NTM1NzQ3LDExODQzNDI5MjVdO2Z1bmN0aW9uIGNvbnZlcnRUb0ludDMyKGJ5dGVzKXt2YXIgcmVzdWx0PVtdO2Zvcih2YXIgaT0wO2k8Ynl0ZXMubGVuZ3RoO2krPTQpe3Jlc3VsdC5wdXNoKGJ5dGVzW2ldPDwyNHxieXRlc1tpKzFdPDwxNnxieXRlc1tpKzJdPDw4fGJ5dGVzW2krM10pfXJldHVybiByZXN1bHR9dmFyIEFFUz1mdW5jdGlvbihrZXkpe2lmKCEodGhpcyBpbnN0YW5jZW9mIEFFUykpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCJrZXkiLHt2YWx1ZTpjb2VyY2VBcnJheShrZXksdHJ1ZSl9KTt0aGlzLl9wcmVwYXJlKCl9O0FFUy5wcm90b3R5cGUuX3ByZXBhcmU9ZnVuY3Rpb24oKXt2YXIgcm91bmRzPW51bWJlck9mUm91bmRzW3RoaXMua2V5Lmxlbmd0aF07aWYocm91bmRzPT1udWxsKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQga2V5IHNpemUgKG11c3QgYmUgMTYsIDI0IG9yIDMyIGJ5dGVzKSIpfXRoaXMuX0tlPVtdO3RoaXMuX0tkPVtdO2Zvcih2YXIgaT0wO2k8PXJvdW5kcztpKyspe3RoaXMuX0tlLnB1c2goWzAsMCwwLDBdKTt0aGlzLl9LZC5wdXNoKFswLDAsMCwwXSl9dmFyIHJvdW5kS2V5Q291bnQ9KHJvdW5kcysxKSo0O3ZhciBLQz10aGlzLmtleS5sZW5ndGgvNDt2YXIgdGs9Y29udmVydFRvSW50MzIodGhpcy5rZXkpO3ZhciBpbmRleDtmb3IodmFyIGk9MDtpPEtDO2krKyl7aW5kZXg9aT4+Mjt0aGlzLl9LZVtpbmRleF1baSU0XT10a1tpXTt0aGlzLl9LZFtyb3VuZHMtaW5kZXhdW2klNF09dGtbaV19dmFyIHJjb25wb2ludGVyPTA7dmFyIHQ9S0MsdHQ7d2hpbGUodDxyb3VuZEtleUNvdW50KXt0dD10a1tLQy0xXTt0a1swXV49U1t0dD4+MTYmMjU1XTw8MjReU1t0dD4+OCYyNTVdPDwxNl5TW3R0JjI1NV08PDheU1t0dD4+MjQmMjU1XV5yY29uW3Jjb25wb2ludGVyXTw8MjQ7cmNvbnBvaW50ZXIrPTE7aWYoS0MhPTgpe2Zvcih2YXIgaT0xO2k8S0M7aSsrKXt0a1tpXV49dGtbaS0xXX19ZWxzZXtmb3IodmFyIGk9MTtpPEtDLzI7aSsrKXt0a1tpXV49dGtbaS0xXX10dD10a1tLQy8yLTFdO3RrW0tDLzJdXj1TW3R0JjI1NV1eU1t0dD4+OCYyNTVdPDw4XlNbdHQ+PjE2JjI1NV08PDE2XlNbdHQ+PjI0JjI1NV08PDI0O2Zvcih2YXIgaT1LQy8yKzE7aTxLQztpKyspe3RrW2ldXj10a1tpLTFdfX12YXIgaT0wLHIsYzt3aGlsZShpPEtDJiZ0PHJvdW5kS2V5Q291bnQpe3I9dD4+MjtjPXQlNDt0aGlzLl9LZVtyXVtjXT10a1tpXTt0aGlzLl9LZFtyb3VuZHMtcl1bY109dGtbaSsrXTt0Kyt9fWZvcih2YXIgcj0xO3I8cm91bmRzO3IrKyl7Zm9yKHZhciBjPTA7Yzw0O2MrKyl7dHQ9dGhpcy5fS2Rbcl1bY107dGhpcy5fS2Rbcl1bY109VTFbdHQ+PjI0JjI1NV1eVTJbdHQ+PjE2JjI1NV1eVTNbdHQ+PjgmMjU1XV5VNFt0dCYyNTVdfX19O0FFUy5wcm90b3R5cGUuZW5jcnlwdD1mdW5jdGlvbihwbGFpbnRleHQpe2lmKHBsYWludGV4dC5sZW5ndGghPTE2KXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpIil9dmFyIHJvdW5kcz10aGlzLl9LZS5sZW5ndGgtMTt2YXIgYT1bMCwwLDAsMF07dmFyIHQ9Y29udmVydFRvSW50MzIocGxhaW50ZXh0KTtmb3IodmFyIGk9MDtpPDQ7aSsrKXt0W2ldXj10aGlzLl9LZVswXVtpXX1mb3IodmFyIHI9MTtyPHJvdW5kcztyKyspe2Zvcih2YXIgaT0wO2k8NDtpKyspe2FbaV09VDFbdFtpXT4+MjQmMjU1XV5UMlt0WyhpKzEpJTRdPj4xNiYyNTVdXlQzW3RbKGkrMiklNF0+PjgmMjU1XV5UNFt0WyhpKzMpJTRdJjI1NV1edGhpcy5fS2Vbcl1baV19dD1hLnNsaWNlKCl9dmFyIHJlc3VsdD1jcmVhdGVBcnJheSgxNiksdHQ7Zm9yKHZhciBpPTA7aTw0O2krKyl7dHQ9dGhpcy5fS2Vbcm91bmRzXVtpXTtyZXN1bHRbNCppXT0oU1t0W2ldPj4yNCYyNTVdXnR0Pj4yNCkmMjU1O3Jlc3VsdFs0KmkrMV09KFNbdFsoaSsxKSU0XT4+MTYmMjU1XV50dD4+MTYpJjI1NTtyZXN1bHRbNCppKzJdPShTW3RbKGkrMiklNF0+PjgmMjU1XV50dD4+OCkmMjU1O3Jlc3VsdFs0KmkrM109KFNbdFsoaSszKSU0XSYyNTVdXnR0KSYyNTV9cmV0dXJuIHJlc3VsdH07QUVTLnByb3RvdHlwZS5kZWNyeXB0PWZ1bmN0aW9uKGNpcGhlcnRleHQpe2lmKGNpcGhlcnRleHQubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSAxNiBieXRlcykiKX12YXIgcm91bmRzPXRoaXMuX0tkLmxlbmd0aC0xO3ZhciBhPVswLDAsMCwwXTt2YXIgdD1jb252ZXJ0VG9JbnQzMihjaXBoZXJ0ZXh0KTtmb3IodmFyIGk9MDtpPDQ7aSsrKXt0W2ldXj10aGlzLl9LZFswXVtpXX1mb3IodmFyIHI9MTtyPHJvdW5kcztyKyspe2Zvcih2YXIgaT0wO2k8NDtpKyspe2FbaV09VDVbdFtpXT4+MjQmMjU1XV5UNlt0WyhpKzMpJTRdPj4xNiYyNTVdXlQ3W3RbKGkrMiklNF0+PjgmMjU1XV5UOFt0WyhpKzEpJTRdJjI1NV1edGhpcy5fS2Rbcl1baV19dD1hLnNsaWNlKCl9dmFyIHJlc3VsdD1jcmVhdGVBcnJheSgxNiksdHQ7Zm9yKHZhciBpPTA7aTw0O2krKyl7dHQ9dGhpcy5fS2Rbcm91bmRzXVtpXTtyZXN1bHRbNCppXT0oU2lbdFtpXT4+MjQmMjU1XV50dD4+MjQpJjI1NTtyZXN1bHRbNCppKzFdPShTaVt0WyhpKzMpJTRdPj4xNiYyNTVdXnR0Pj4xNikmMjU1O3Jlc3VsdFs0KmkrMl09KFNpW3RbKGkrMiklNF0+PjgmMjU1XV50dD4+OCkmMjU1O3Jlc3VsdFs0KmkrM109KFNpW3RbKGkrMSklNF0mMjU1XV50dCkmMjU1fXJldHVybiByZXN1bHR9O3ZhciBNb2RlT2ZPcGVyYXRpb25FQ0I9ZnVuY3Rpb24oa2V5KXtpZighKHRoaXMgaW5zdGFuY2VvZiBNb2RlT2ZPcGVyYXRpb25FQ0IpKXt0aHJvdyBFcnJvcigiQUVTIG11c3QgYmUgaW5zdGFuaXRhdGVkIHdpdGggYG5ld2AiKX10aGlzLmRlc2NyaXB0aW9uPSJFbGVjdHJvbmljIENvZGUgQmxvY2siO3RoaXMubmFtZT0iZWNiIjt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25FQ0IucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXtwbGFpbnRleHQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0KTtpZihwbGFpbnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIHBsYWludGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBjaXBoZXJ0ZXh0PWNyZWF0ZUFycmF5KHBsYWludGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPTE2KXtjb3B5QXJyYXkocGxhaW50ZXh0LGJsb2NrLDAsaSxpKzE2KTtibG9jaz10aGlzLl9hZXMuZW5jcnlwdChibG9jayk7Y29weUFycmF5KGJsb2NrLGNpcGhlcnRleHQsaSl9cmV0dXJuIGNpcGhlcnRleHR9O01vZGVPZk9wZXJhdGlvbkVDQi5wcm90b3R5cGUuZGVjcnlwdD1mdW5jdGlvbihjaXBoZXJ0ZXh0KXtjaXBoZXJ0ZXh0PWNvZXJjZUFycmF5KGNpcGhlcnRleHQpO2lmKGNpcGhlcnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSBtdWx0aXBsZSBvZiAxNiBieXRlcykiKX12YXIgcGxhaW50ZXh0PWNyZWF0ZUFycmF5KGNpcGhlcnRleHQubGVuZ3RoKTt2YXIgYmxvY2s9Y3JlYXRlQXJyYXkoMTYpO2Zvcih2YXIgaT0wO2k8Y2lwaGVydGV4dC5sZW5ndGg7aSs9MTYpe2NvcHlBcnJheShjaXBoZXJ0ZXh0LGJsb2NrLDAsaSxpKzE2KTtibG9jaz10aGlzLl9hZXMuZGVjcnlwdChibG9jayk7Y29weUFycmF5KGJsb2NrLHBsYWludGV4dCxpKX1yZXR1cm4gcGxhaW50ZXh0fTt2YXIgTW9kZU9mT3BlcmF0aW9uQ0JDPWZ1bmN0aW9uKGtleSxpdil7aWYoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ0JDKSl7dGhyb3cgRXJyb3IoIkFFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgIil9dGhpcy5kZXNjcmlwdGlvbj0iQ2lwaGVyIEJsb2NrIENoYWluaW5nIjt0aGlzLm5hbWU9ImNiYyI7aWYoIWl2KXtpdj1jcmVhdGVBcnJheSgxNil9ZWxzZSBpZihpdi5sZW5ndGghPTE2KXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgaW5pdGlhbGF0aW9uIHZlY3RvciBzaXplIChtdXN0IGJlIDE2IGJ5dGVzKSIpfXRoaXMuX2xhc3RDaXBoZXJibG9jaz1jb2VyY2VBcnJheShpdix0cnVlKTt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25DQkMucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXtwbGFpbnRleHQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0KTtpZihwbGFpbnRleHQubGVuZ3RoJTE2IT09MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIHBsYWludGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBjaXBoZXJ0ZXh0PWNyZWF0ZUFycmF5KHBsYWludGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPTE2KXtjb3B5QXJyYXkocGxhaW50ZXh0LGJsb2NrLDAsaSxpKzE2KTtmb3IodmFyIGo9MDtqPDE2O2orKyl7YmxvY2tbal1ePXRoaXMuX2xhc3RDaXBoZXJibG9ja1tqXX10aGlzLl9sYXN0Q2lwaGVyYmxvY2s9dGhpcy5fYWVzLmVuY3J5cHQoYmxvY2spO2NvcHlBcnJheSh0aGlzLl9sYXN0Q2lwaGVyYmxvY2ssY2lwaGVydGV4dCxpKX1yZXR1cm4gY2lwaGVydGV4dH07TW9kZU9mT3BlcmF0aW9uQ0JDLnByb3RvdHlwZS5kZWNyeXB0PWZ1bmN0aW9uKGNpcGhlcnRleHQpe2NpcGhlcnRleHQ9Y29lcmNlQXJyYXkoY2lwaGVydGV4dCk7aWYoY2lwaGVydGV4dC5sZW5ndGglMTYhPT0wKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgY2lwaGVydGV4dCBzaXplIChtdXN0IGJlIG11bHRpcGxlIG9mIDE2IGJ5dGVzKSIpfXZhciBwbGFpbnRleHQ9Y3JlYXRlQXJyYXkoY2lwaGVydGV4dC5sZW5ndGgpO3ZhciBibG9jaz1jcmVhdGVBcnJheSgxNik7Zm9yKHZhciBpPTA7aTxjaXBoZXJ0ZXh0Lmxlbmd0aDtpKz0xNil7Y29weUFycmF5KGNpcGhlcnRleHQsYmxvY2ssMCxpLGkrMTYpO2Jsb2NrPXRoaXMuX2Flcy5kZWNyeXB0KGJsb2NrKTtmb3IodmFyIGo9MDtqPDE2O2orKyl7cGxhaW50ZXh0W2kral09YmxvY2tbal1edGhpcy5fbGFzdENpcGhlcmJsb2NrW2pdfWNvcHlBcnJheShjaXBoZXJ0ZXh0LHRoaXMuX2xhc3RDaXBoZXJibG9jaywwLGksaSsxNil9cmV0dXJuIHBsYWludGV4dH07dmFyIE1vZGVPZk9wZXJhdGlvbkNGQj1mdW5jdGlvbihrZXksaXYsc2VnbWVudFNpemUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbkNGQikpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfXRoaXMuZGVzY3JpcHRpb249IkNpcGhlciBGZWVkYmFjayI7dGhpcy5uYW1lPSJjZmIiO2lmKCFpdil7aXY9Y3JlYXRlQXJyYXkoMTYpfWVsc2UgaWYoaXYubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGluaXRpYWxhdGlvbiB2ZWN0b3Igc2l6ZSAobXVzdCBiZSAxNiBzaXplKSIpfWlmKCFzZWdtZW50U2l6ZSl7c2VnbWVudFNpemU9MX10aGlzLnNlZ21lbnRTaXplPXNlZ21lbnRTaXplO3RoaXMuX3NoaWZ0UmVnaXN0ZXI9Y29lcmNlQXJyYXkoaXYsdHJ1ZSk7dGhpcy5fYWVzPW5ldyBBRVMoa2V5KX07TW9kZU9mT3BlcmF0aW9uQ0ZCLnByb3RvdHlwZS5lbmNyeXB0PWZ1bmN0aW9uKHBsYWludGV4dCl7aWYocGxhaW50ZXh0Lmxlbmd0aCV0aGlzLnNlZ21lbnRTaXplIT0wKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgcGxhaW50ZXh0IHNpemUgKG11c3QgYmUgc2VnbWVudFNpemUgYnl0ZXMpIil9dmFyIGVuY3J5cHRlZD1jb2VyY2VBcnJheShwbGFpbnRleHQsdHJ1ZSk7dmFyIHhvclNlZ21lbnQ7Zm9yKHZhciBpPTA7aTxlbmNyeXB0ZWQubGVuZ3RoO2krPXRoaXMuc2VnbWVudFNpemUpe3hvclNlZ21lbnQ9dGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fc2hpZnRSZWdpc3Rlcik7Zm9yKHZhciBqPTA7ajx0aGlzLnNlZ21lbnRTaXplO2orKyl7ZW5jcnlwdGVkW2kral1ePXhvclNlZ21lbnRbal19Y29weUFycmF5KHRoaXMuX3NoaWZ0UmVnaXN0ZXIsdGhpcy5fc2hpZnRSZWdpc3RlciwwLHRoaXMuc2VnbWVudFNpemUpO2NvcHlBcnJheShlbmNyeXB0ZWQsdGhpcy5fc2hpZnRSZWdpc3RlciwxNi10aGlzLnNlZ21lbnRTaXplLGksaSt0aGlzLnNlZ21lbnRTaXplKX1yZXR1cm4gZW5jcnlwdGVkfTtNb2RlT2ZPcGVyYXRpb25DRkIucHJvdG90eXBlLmRlY3J5cHQ9ZnVuY3Rpb24oY2lwaGVydGV4dCl7aWYoY2lwaGVydGV4dC5sZW5ndGgldGhpcy5zZWdtZW50U2l6ZSE9MCl7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGNpcGhlcnRleHQgc2l6ZSAobXVzdCBiZSBzZWdtZW50U2l6ZSBieXRlcykiKX12YXIgcGxhaW50ZXh0PWNvZXJjZUFycmF5KGNpcGhlcnRleHQsdHJ1ZSk7dmFyIHhvclNlZ21lbnQ7Zm9yKHZhciBpPTA7aTxwbGFpbnRleHQubGVuZ3RoO2krPXRoaXMuc2VnbWVudFNpemUpe3hvclNlZ21lbnQ9dGhpcy5fYWVzLmVuY3J5cHQodGhpcy5fc2hpZnRSZWdpc3Rlcik7Zm9yKHZhciBqPTA7ajx0aGlzLnNlZ21lbnRTaXplO2orKyl7cGxhaW50ZXh0W2kral1ePXhvclNlZ21lbnRbal19Y29weUFycmF5KHRoaXMuX3NoaWZ0UmVnaXN0ZXIsdGhpcy5fc2hpZnRSZWdpc3RlciwwLHRoaXMuc2VnbWVudFNpemUpO2NvcHlBcnJheShjaXBoZXJ0ZXh0LHRoaXMuX3NoaWZ0UmVnaXN0ZXIsMTYtdGhpcy5zZWdtZW50U2l6ZSxpLGkrdGhpcy5zZWdtZW50U2l6ZSl9cmV0dXJuIHBsYWludGV4dH07dmFyIE1vZGVPZk9wZXJhdGlvbk9GQj1mdW5jdGlvbihrZXksaXYpe2lmKCEodGhpcyBpbnN0YW5jZW9mIE1vZGVPZk9wZXJhdGlvbk9GQikpe3Rocm93IEVycm9yKCJBRVMgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfXRoaXMuZGVzY3JpcHRpb249Ik91dHB1dCBGZWVkYmFjayI7dGhpcy5uYW1lPSJvZmIiO2lmKCFpdil7aXY9Y3JlYXRlQXJyYXkoMTYpfWVsc2UgaWYoaXYubGVuZ3RoIT0xNil7dGhyb3cgbmV3IEVycm9yKCJpbnZhbGlkIGluaXRpYWxhdGlvbiB2ZWN0b3Igc2l6ZSAobXVzdCBiZSAxNiBieXRlcykiKX10aGlzLl9sYXN0UHJlY2lwaGVyPWNvZXJjZUFycmF5KGl2LHRydWUpO3RoaXMuX2xhc3RQcmVjaXBoZXJJbmRleD0xNjt0aGlzLl9hZXM9bmV3IEFFUyhrZXkpfTtNb2RlT2ZPcGVyYXRpb25PRkIucHJvdG90eXBlLmVuY3J5cHQ9ZnVuY3Rpb24ocGxhaW50ZXh0KXt2YXIgZW5jcnlwdGVkPWNvZXJjZUFycmF5KHBsYWludGV4dCx0cnVlKTtmb3IodmFyIGk9MDtpPGVuY3J5cHRlZC5sZW5ndGg7aSsrKXtpZih0aGlzLl9sYXN0UHJlY2lwaGVySW5kZXg9PT0xNil7dGhpcy5fbGFzdFByZWNpcGhlcj10aGlzLl9hZXMuZW5jcnlwdCh0aGlzLl9sYXN0UHJlY2lwaGVyKTt0aGlzLl9sYXN0UHJlY2lwaGVySW5kZXg9MH1lbmNyeXB0ZWRbaV1ePXRoaXMuX2xhc3RQcmVjaXBoZXJbdGhpcy5fbGFzdFByZWNpcGhlckluZGV4KytdfXJldHVybiBlbmNyeXB0ZWR9O01vZGVPZk9wZXJhdGlvbk9GQi5wcm90b3R5cGUuZGVjcnlwdD1Nb2RlT2ZPcGVyYXRpb25PRkIucHJvdG90eXBlLmVuY3J5cHQ7dmFyIENvdW50ZXI9ZnVuY3Rpb24oaW5pdGlhbFZhbHVlKXtpZighKHRoaXMgaW5zdGFuY2VvZiBDb3VudGVyKSl7dGhyb3cgRXJyb3IoIkNvdW50ZXIgbXVzdCBiZSBpbnN0YW5pdGF0ZWQgd2l0aCBgbmV3YCIpfWlmKGluaXRpYWxWYWx1ZSE9PTAmJiFpbml0aWFsVmFsdWUpe2luaXRpYWxWYWx1ZT0xfWlmKHR5cGVvZiBpbml0aWFsVmFsdWU9PT0ibnVtYmVyIil7dGhpcy5fY291bnRlcj1jcmVhdGVBcnJheSgxNik7dGhpcy5zZXRWYWx1ZShpbml0aWFsVmFsdWUpfWVsc2V7dGhpcy5zZXRCeXRlcyhpbml0aWFsVmFsdWUpfX07Q291bnRlci5wcm90b3R5cGUuc2V0VmFsdWU9ZnVuY3Rpb24odmFsdWUpe2lmKHR5cGVvZiB2YWx1ZSE9PSJudW1iZXIifHxwYXJzZUludCh2YWx1ZSkhPXZhbHVlKXt0aHJvdyBuZXcgRXJyb3IoImludmFsaWQgY291bnRlciB2YWx1ZSAobXVzdCBiZSBhbiBpbnRlZ2VyKSIpfWlmKHZhbHVlPk51bWJlci5NQVhfU0FGRV9JTlRFR0VSKXt0aHJvdyBuZXcgRXJyb3IoImludGVnZXIgdmFsdWUgb3V0IG9mIHNhZmUgcmFuZ2UiKX1mb3IodmFyIGluZGV4PTE1O2luZGV4Pj0wOy0taW5kZXgpe3RoaXMuX2NvdW50ZXJbaW5kZXhdPXZhbHVlJTI1Njt2YWx1ZT1wYXJzZUludCh2YWx1ZS8yNTYpfX07Q291bnRlci5wcm90b3R5cGUuc2V0Qnl0ZXM9ZnVuY3Rpb24oYnl0ZXMpe2J5dGVzPWNvZXJjZUFycmF5KGJ5dGVzLHRydWUpO2lmKGJ5dGVzLmxlbmd0aCE9MTYpe3Rocm93IG5ldyBFcnJvcigiaW52YWxpZCBjb3VudGVyIGJ5dGVzIHNpemUgKG11c3QgYmUgMTYgYnl0ZXMpIil9dGhpcy5fY291bnRlcj1ieXRlc307Q291bnRlci5wcm90b3R5cGUuaW5jcmVtZW50PWZ1bmN0aW9uKCl7Zm9yKHZhciBpPTE1O2k+PTA7aS0tKXtpZih0aGlzLl9jb3VudGVyW2ldPT09MjU1KXt0aGlzLl9jb3VudGVyW2ldPTB9ZWxzZXt0aGlzLl9jb3VudGVyW2ldKys7YnJlYWt9fX07dmFyIE1vZGVPZk9wZXJhdGlvbkNUUj1mdW5jdGlvbihrZXksY291bnRlcil7aWYoISh0aGlzIGluc3RhbmNlb2YgTW9kZU9mT3BlcmF0aW9uQ1RSKSl7dGhyb3cgRXJyb3IoIkFFUyBtdXN0IGJlIGluc3Rhbml0YXRlZCB3aXRoIGBuZXdgIil9dGhpcy5kZXNjcmlwdGlvbj0iQ291bnRlciI7dGhpcy5uYW1lPSJjdHIiO2lmKCEoY291bnRlciBpbnN0YW5jZW9mIENvdW50ZXIpKXtjb3VudGVyPW5ldyBDb3VudGVyKGNvdW50ZXIpfXRoaXMuX2NvdW50ZXI9Y291bnRlcjt0aGlzLl9yZW1haW5pbmdDb3VudGVyPW51bGw7dGhpcy5fcmVtYWluaW5nQ291bnRlckluZGV4PTE2O3RoaXMuX2Flcz1uZXcgQUVTKGtleSl9O01vZGVPZk9wZXJhdGlvbkNUUi5wcm90b3R5cGUuZW5jcnlwdD1mdW5jdGlvbihwbGFpbnRleHQpe3ZhciBlbmNyeXB0ZWQ9Y29lcmNlQXJyYXkocGxhaW50ZXh0LHRydWUpO2Zvcih2YXIgaT0wO2k8ZW5jcnlwdGVkLmxlbmd0aDtpKyspe2lmKHRoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleD09PTE2KXt0aGlzLl9yZW1haW5pbmdDb3VudGVyPXRoaXMuX2Flcy5lbmNyeXB0KHRoaXMuX2NvdW50ZXIuX2NvdW50ZXIpO3RoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleD0wO3RoaXMuX2NvdW50ZXIuaW5jcmVtZW50KCl9ZW5jcnlwdGVkW2ldXj10aGlzLl9yZW1haW5pbmdDb3VudGVyW3RoaXMuX3JlbWFpbmluZ0NvdW50ZXJJbmRleCsrXX1yZXR1cm4gZW5jcnlwdGVkfTtNb2RlT2ZPcGVyYXRpb25DVFIucHJvdG90eXBlLmRlY3J5cHQ9TW9kZU9mT3BlcmF0aW9uQ1RSLnByb3RvdHlwZS5lbmNyeXB0O2Z1bmN0aW9uIHBrY3M3cGFkKGRhdGEpe2RhdGE9Y29lcmNlQXJyYXkoZGF0YSx0cnVlKTt2YXIgcGFkZGVyPTE2LWRhdGEubGVuZ3RoJTE2O3ZhciByZXN1bHQ9Y3JlYXRlQXJyYXkoZGF0YS5sZW5ndGgrcGFkZGVyKTtjb3B5QXJyYXkoZGF0YSxyZXN1bHQpO2Zvcih2YXIgaT1kYXRhLmxlbmd0aDtpPHJlc3VsdC5sZW5ndGg7aSsrKXtyZXN1bHRbaV09cGFkZGVyfXJldHVybiByZXN1bHR9ZnVuY3Rpb24gcGtjczdzdHJpcChkYXRhKXtkYXRhPWNvZXJjZUFycmF5KGRhdGEsdHJ1ZSk7aWYoZGF0YS5sZW5ndGg8MTYpe3Rocm93IG5ldyBFcnJvcigiUEtDUyM3IGludmFsaWQgbGVuZ3RoIil9dmFyIHBhZGRlcj1kYXRhW2RhdGEubGVuZ3RoLTFdO2lmKHBhZGRlcj4xNil7dGhyb3cgbmV3IEVycm9yKCJQS0NTIzcgcGFkZGluZyBieXRlIG91dCBvZiByYW5nZSIpfXZhciBsZW5ndGg9ZGF0YS5sZW5ndGgtcGFkZGVyO2Zvcih2YXIgaT0wO2k8cGFkZGVyO2krKyl7aWYoZGF0YVtsZW5ndGgraV0hPT1wYWRkZXIpe3Rocm93IG5ldyBFcnJvcigiUEtDUyM3IGludmFsaWQgcGFkZGluZyBieXRlIil9fXZhciByZXN1bHQ9Y3JlYXRlQXJyYXkobGVuZ3RoKTtjb3B5QXJyYXkoZGF0YSxyZXN1bHQsMCwwLGxlbmd0aCk7cmV0dXJuIHJlc3VsdH12YXIgYWVzanM9e0FFUzpBRVMsQ291bnRlcjpDb3VudGVyLE1vZGVPZk9wZXJhdGlvbjp7ZWNiOk1vZGVPZk9wZXJhdGlvbkVDQixjYmM6TW9kZU9mT3BlcmF0aW9uQ0JDLGNmYjpNb2RlT2ZPcGVyYXRpb25DRkIsb2ZiOk1vZGVPZk9wZXJhdGlvbk9GQixjdHI6TW9kZU9mT3BlcmF0aW9uQ1RSfSx1dGlsczp7aGV4OmNvbnZlcnRIZXgsdXRmODpjb252ZXJ0VXRmOH0scGFkZGluZzp7cGtjczc6e3BhZDpwa2NzN3BhZCxzdHJpcDpwa2NzN3N0cmlwfX0sX2FycmF5VGVzdDp7Y29lcmNlQXJyYXk6Y29lcmNlQXJyYXksY3JlYXRlQXJyYXk6Y3JlYXRlQXJyYXksY29weUFycmF5OmNvcHlBcnJheX19O2lmKHR5cGVvZiBleHBvcnRzIT09InVuZGVmaW5lZCIpe21vZHVsZS5leHBvcnRzPWFlc2pzfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PSJmdW5jdGlvbiImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmdW5jdGlvbigpe3JldHVybiBhZXNqc30pfWVsc2V7aWYocm9vdC5hZXNqcyl7YWVzanMuX2Flc2pzPXJvb3QuYWVzanN9cm9vdC5hZXNqcz1hZXNqc319KSh0aGlzKX0se31dLDEyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz17bmV3SW52YWxpZEFzbjFFcnJvcjpmdW5jdGlvbihtc2cpe3ZhciBlPW5ldyBFcnJvcjtlLm5hbWU9IkludmFsaWRBc24xRXJyb3IiO2UubWVzc2FnZT1tc2d8fCIiO3JldHVybiBlfX19LHt9XSwxMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGVycm9ycz1yZXF1aXJlKCIuL2Vycm9ycyIpO3ZhciB0eXBlcz1yZXF1aXJlKCIuL3R5cGVzIik7dmFyIFJlYWRlcj1yZXF1aXJlKCIuL3JlYWRlciIpO3ZhciBXcml0ZXI9cmVxdWlyZSgiLi93cml0ZXIiKTttb2R1bGUuZXhwb3J0cz17UmVhZGVyOlJlYWRlcixXcml0ZXI6V3JpdGVyfTtmb3IodmFyIHQgaW4gdHlwZXMpe2lmKHR5cGVzLmhhc093blByb3BlcnR5KHQpKW1vZHVsZS5leHBvcnRzW3RdPXR5cGVzW3RdfWZvcih2YXIgZSBpbiBlcnJvcnMpe2lmKGVycm9ycy5oYXNPd25Qcm9wZXJ0eShlKSltb2R1bGUuZXhwb3J0c1tlXT1lcnJvcnNbZV19fSx7Ii4vZXJyb3JzIjoxMiwiLi9yZWFkZXIiOjE0LCIuL3R5cGVzIjoxNSwiLi93cml0ZXIiOjE2fV0sMTQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBhc3NlcnQ9cmVxdWlyZSgiYXNzZXJ0Iik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlci1idWZmZXIiKS5CdWZmZXI7dmFyIEFTTjE9cmVxdWlyZSgiLi90eXBlcyIpO3ZhciBlcnJvcnM9cmVxdWlyZSgiLi9lcnJvcnMiKTt2YXIgbmV3SW52YWxpZEFzbjFFcnJvcj1lcnJvcnMubmV3SW52YWxpZEFzbjFFcnJvcjtmdW5jdGlvbiBSZWFkZXIoZGF0YSl7aWYoIWRhdGF8fCFCdWZmZXIuaXNCdWZmZXIoZGF0YSkpdGhyb3cgbmV3IFR5cGVFcnJvcigiZGF0YSBtdXN0IGJlIGEgbm9kZSBCdWZmZXIiKTt0aGlzLl9idWY9ZGF0YTt0aGlzLl9zaXplPWRhdGEubGVuZ3RoO3RoaXMuX2xlbj0wO3RoaXMuX29mZnNldD0wfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkZXIucHJvdG90eXBlLCJsZW5ndGgiLHtlbnVtZXJhYmxlOnRydWUsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2xlbn19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwib2Zmc2V0Iix7ZW51bWVyYWJsZTp0cnVlLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9vZmZzZXR9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWRlci5wcm90b3R5cGUsInJlbWFpbiIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9zaXplLXRoaXMuX29mZnNldH19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGVyLnByb3RvdHlwZSwiYnVmZmVyIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2J1Zi5zbGljZSh0aGlzLl9vZmZzZXQpfX0pO1JlYWRlci5wcm90b3R5cGUucmVhZEJ5dGU9ZnVuY3Rpb24ocGVlayl7aWYodGhpcy5fc2l6ZS10aGlzLl9vZmZzZXQ8MSlyZXR1cm4gbnVsbDt2YXIgYj10aGlzLl9idWZbdGhpcy5fb2Zmc2V0XSYyNTU7aWYoIXBlZWspdGhpcy5fb2Zmc2V0Kz0xO3JldHVybiBifTtSZWFkZXIucHJvdG90eXBlLnBlZWs9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZWFkQnl0ZSh0cnVlKX07UmVhZGVyLnByb3RvdHlwZS5yZWFkTGVuZ3RoPWZ1bmN0aW9uKG9mZnNldCl7aWYob2Zmc2V0PT09dW5kZWZpbmVkKW9mZnNldD10aGlzLl9vZmZzZXQ7aWYob2Zmc2V0Pj10aGlzLl9zaXplKXJldHVybiBudWxsO3ZhciBsZW5CPXRoaXMuX2J1ZltvZmZzZXQrK10mMjU1O2lmKGxlbkI9PT1udWxsKXJldHVybiBudWxsO2lmKChsZW5CJjEyOCk9PT0xMjgpe2xlbkImPTEyNztpZihsZW5CPT09MCl0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCJJbmRlZmluaXRlIGxlbmd0aCBub3Qgc3VwcG9ydGVkIik7aWYobGVuQj40KXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoImVuY29kaW5nIHRvbyBsb25nIik7aWYodGhpcy5fc2l6ZS1vZmZzZXQ8bGVuQilyZXR1cm4gbnVsbDt0aGlzLl9sZW49MDtmb3IodmFyIGk9MDtpPGxlbkI7aSsrKXRoaXMuX2xlbj0odGhpcy5fbGVuPDw4KSsodGhpcy5fYnVmW29mZnNldCsrXSYyNTUpfWVsc2V7dGhpcy5fbGVuPWxlbkJ9cmV0dXJuIG9mZnNldH07UmVhZGVyLnByb3RvdHlwZS5yZWFkU2VxdWVuY2U9ZnVuY3Rpb24odGFnKXt2YXIgc2VxPXRoaXMucGVlaygpO2lmKHNlcT09PW51bGwpcmV0dXJuIG51bGw7aWYodGFnIT09dW5kZWZpbmVkJiZ0YWchPT1zZXEpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiRXhwZWN0ZWQgMHgiK3RhZy50b1N0cmluZygxNikrIjogZ290IDB4IitzZXEudG9TdHJpbmcoMTYpKTt2YXIgbz10aGlzLnJlYWRMZW5ndGgodGhpcy5fb2Zmc2V0KzEpO2lmKG89PT1udWxsKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO3JldHVybiBzZXF9O1JlYWRlci5wcm90b3R5cGUucmVhZEludD1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkVGFnKEFTTjEuSW50ZWdlcil9O1JlYWRlci5wcm90b3R5cGUucmVhZEJvb2xlYW49ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVhZFRhZyhBU04xLkJvb2xlYW4pPT09MD9mYWxzZTp0cnVlfTtSZWFkZXIucHJvdG90eXBlLnJlYWRFbnVtZXJhdGlvbj1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkVGFnKEFTTjEuRW51bWVyYXRpb24pfTtSZWFkZXIucHJvdG90eXBlLnJlYWRTdHJpbmc9ZnVuY3Rpb24odGFnLHJldGJ1Zil7aWYoIXRhZyl0YWc9QVNOMS5PY3RldFN0cmluZzt2YXIgYj10aGlzLnBlZWsoKTtpZihiPT09bnVsbClyZXR1cm4gbnVsbDtpZihiIT09dGFnKXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IoIkV4cGVjdGVkIDB4Iit0YWcudG9TdHJpbmcoMTYpKyI6IGdvdCAweCIrYi50b1N0cmluZygxNikpO3ZhciBvPXRoaXMucmVhZExlbmd0aCh0aGlzLl9vZmZzZXQrMSk7aWYobz09PW51bGwpcmV0dXJuIG51bGw7aWYodGhpcy5sZW5ndGg+dGhpcy5fc2l6ZS1vKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO2lmKHRoaXMubGVuZ3RoPT09MClyZXR1cm4gcmV0YnVmP0J1ZmZlci5hbGxvYygwKToiIjt2YXIgc3RyPXRoaXMuX2J1Zi5zbGljZSh0aGlzLl9vZmZzZXQsdGhpcy5fb2Zmc2V0K3RoaXMubGVuZ3RoKTt0aGlzLl9vZmZzZXQrPXRoaXMubGVuZ3RoO3JldHVybiByZXRidWY/c3RyOnN0ci50b1N0cmluZygidXRmOCIpfTtSZWFkZXIucHJvdG90eXBlLnJlYWRPSUQ9ZnVuY3Rpb24odGFnKXtpZighdGFnKXRhZz1BU04xLk9JRDt2YXIgYj10aGlzLnJlYWRTdHJpbmcodGFnLHRydWUpO2lmKGI9PT1udWxsKXJldHVybiBudWxsO3ZhciB2YWx1ZXM9W107dmFyIHZhbHVlPTA7Zm9yKHZhciBpPTA7aTxiLmxlbmd0aDtpKyspe3ZhciBieXRlPWJbaV0mMjU1O3ZhbHVlPDw9Nzt2YWx1ZSs9Ynl0ZSYxMjc7aWYoKGJ5dGUmMTI4KT09PTApe3ZhbHVlcy5wdXNoKHZhbHVlKTt2YWx1ZT0wfX12YWx1ZT12YWx1ZXMuc2hpZnQoKTt2YWx1ZXMudW5zaGlmdCh2YWx1ZSU0MCk7dmFsdWVzLnVuc2hpZnQodmFsdWUvNDA+PjApO3JldHVybiB2YWx1ZXMuam9pbigiLiIpfTtSZWFkZXIucHJvdG90eXBlLl9yZWFkVGFnPWZ1bmN0aW9uKHRhZyl7YXNzZXJ0Lm9rKHRhZyE9PXVuZGVmaW5lZCk7dmFyIGI9dGhpcy5wZWVrKCk7aWYoYj09PW51bGwpcmV0dXJuIG51bGw7aWYoYiE9PXRhZyl0aHJvdyBuZXdJbnZhbGlkQXNuMUVycm9yKCJFeHBlY3RlZCAweCIrdGFnLnRvU3RyaW5nKDE2KSsiOiBnb3QgMHgiK2IudG9TdHJpbmcoMTYpKTt2YXIgbz10aGlzLnJlYWRMZW5ndGgodGhpcy5fb2Zmc2V0KzEpO2lmKG89PT1udWxsKXJldHVybiBudWxsO2lmKHRoaXMubGVuZ3RoPjQpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiSW50ZWdlciB0b28gbG9uZzogIit0aGlzLmxlbmd0aCk7aWYodGhpcy5sZW5ndGg+dGhpcy5fc2l6ZS1vKXJldHVybiBudWxsO3RoaXMuX29mZnNldD1vO3ZhciBmYj10aGlzLl9idWZbdGhpcy5fb2Zmc2V0XTt2YXIgdmFsdWU9MDtmb3IodmFyIGk9MDtpPHRoaXMubGVuZ3RoO2krKyl7dmFsdWU8PD04O3ZhbHVlfD10aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdJjI1NX1pZigoZmImMTI4KT09PTEyOCYmaSE9PTQpdmFsdWUtPTE8PGkqODtyZXR1cm4gdmFsdWU+PjB9O21vZHVsZS5leHBvcnRzPVJlYWRlcn0seyIuL2Vycm9ycyI6MTIsIi4vdHlwZXMiOjE1LGFzc2VydDoxOCwic2FmZXItYnVmZmVyIjo3OX1dLDE1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz17RU9DOjAsQm9vbGVhbjoxLEludGVnZXI6MixCaXRTdHJpbmc6MyxPY3RldFN0cmluZzo0LE51bGw6NSxPSUQ6NixPYmplY3REZXNjcmlwdG9yOjcsRXh0ZXJuYWw6OCxSZWFsOjksRW51bWVyYXRpb246MTAsUERWOjExLFV0ZjhTdHJpbmc6MTIsUmVsYXRpdmVPSUQ6MTMsU2VxdWVuY2U6MTYsU2V0OjE3LE51bWVyaWNTdHJpbmc6MTgsUHJpbnRhYmxlU3RyaW5nOjE5LFQ2MVN0cmluZzoyMCxWaWRlb3RleFN0cmluZzoyMSxJQTVTdHJpbmc6MjIsVVRDVGltZToyMyxHZW5lcmFsaXplZFRpbWU6MjQsR3JhcGhpY1N0cmluZzoyNSxWaXNpYmxlU3RyaW5nOjI2LEdlbmVyYWxTdHJpbmc6MjgsVW5pdmVyc2FsU3RyaW5nOjI5LENoYXJhY3RlclN0cmluZzozMCxCTVBTdHJpbmc6MzEsQ29uc3RydWN0b3I6MzIsQ29udGV4dDoxMjh9fSx7fV0sMTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBhc3NlcnQ9cmVxdWlyZSgiYXNzZXJ0Iik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlci1idWZmZXIiKS5CdWZmZXI7dmFyIEFTTjE9cmVxdWlyZSgiLi90eXBlcyIpO3ZhciBlcnJvcnM9cmVxdWlyZSgiLi9lcnJvcnMiKTt2YXIgbmV3SW52YWxpZEFzbjFFcnJvcj1lcnJvcnMubmV3SW52YWxpZEFzbjFFcnJvcjt2YXIgREVGQVVMVF9PUFRTPXtzaXplOjEwMjQsZ3Jvd3RoRmFjdG9yOjh9O2Z1bmN0aW9uIG1lcmdlKGZyb20sdG8pe2Fzc2VydC5vayhmcm9tKTthc3NlcnQuZXF1YWwodHlwZW9mIGZyb20sIm9iamVjdCIpO2Fzc2VydC5vayh0byk7YXNzZXJ0LmVxdWFsKHR5cGVvZiB0bywib2JqZWN0Iik7dmFyIGtleXM9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZnJvbSk7a2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7aWYodG9ba2V5XSlyZXR1cm47dmFyIHZhbHVlPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZnJvbSxrZXkpO09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0byxrZXksdmFsdWUpfSk7cmV0dXJuIHRvfWZ1bmN0aW9uIFdyaXRlcihvcHRpb25zKXtvcHRpb25zPW1lcmdlKERFRkFVTFRfT1BUUyxvcHRpb25zfHx7fSk7dGhpcy5fYnVmPUJ1ZmZlci5hbGxvYyhvcHRpb25zLnNpemV8fDEwMjQpO3RoaXMuX3NpemU9dGhpcy5fYnVmLmxlbmd0aDt0aGlzLl9vZmZzZXQ9MDt0aGlzLl9vcHRpb25zPW9wdGlvbnM7dGhpcy5fc2VxPVtdfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcml0ZXIucHJvdG90eXBlLCJidWZmZXIiLHtnZXQ6ZnVuY3Rpb24oKXtpZih0aGlzLl9zZXEubGVuZ3RoKXRocm93IG5ld0ludmFsaWRBc24xRXJyb3IodGhpcy5fc2VxLmxlbmd0aCsiIHVuZW5kZWQgc2VxdWVuY2UocykiKTtyZXR1cm4gdGhpcy5fYnVmLnNsaWNlKDAsdGhpcy5fb2Zmc2V0KX19KTtXcml0ZXIucHJvdG90eXBlLndyaXRlQnl0ZT1mdW5jdGlvbihiKXtpZih0eXBlb2YgYiE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTt0aGlzLl9lbnN1cmUoMSk7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT1ifTtXcml0ZXIucHJvdG90eXBlLndyaXRlSW50PWZ1bmN0aW9uKGksdGFnKXtpZih0eXBlb2YgaSE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuSW50ZWdlcjt2YXIgc3o9NDt3aGlsZSgoKGkmNDI4NjU3ODY4OCk9PT0wfHwoaSY0Mjg2NTc4Njg4KT09PTQyODY1Nzg2ODg+PjApJiZzej4xKXtzei0tO2k8PD04fWlmKHN6PjQpdGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiQkVSIGludHMgY2Fubm90IGJlID4gMHhmZmZmZmZmZiIpO3RoaXMuX2Vuc3VyZSgyK3N6KTt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPXRhZzt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPXN6O3doaWxlKHN6LS0gPjApe3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109KGkmNDI3ODE5MDA4MCk+Pj4yNDtpPDw9OH19O1dyaXRlci5wcm90b3R5cGUud3JpdGVOdWxsPWZ1bmN0aW9uKCl7dGhpcy53cml0ZUJ5dGUoQVNOMS5OdWxsKTt0aGlzLndyaXRlQnl0ZSgwKX07V3JpdGVyLnByb3RvdHlwZS53cml0ZUVudW1lcmF0aW9uPWZ1bmN0aW9uKGksdGFnKXtpZih0eXBlb2YgaSE9PSJudW1iZXIiKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IG11c3QgYmUgYSBOdW1iZXIiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuRW51bWVyYXRpb247cmV0dXJuIHRoaXMud3JpdGVJbnQoaSx0YWcpfTtXcml0ZXIucHJvdG90eXBlLndyaXRlQm9vbGVhbj1mdW5jdGlvbihiLHRhZyl7aWYodHlwZW9mIGIhPT0iYm9vbGVhbiIpdGhyb3cgbmV3IFR5cGVFcnJvcigiYXJndW1lbnQgbXVzdCBiZSBhIEJvb2xlYW4iKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuQm9vbGVhbjt0aGlzLl9lbnN1cmUoMyk7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT10YWc7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT0xO3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109Yj8yNTU6MH07V3JpdGVyLnByb3RvdHlwZS53cml0ZVN0cmluZz1mdW5jdGlvbihzLHRhZyl7aWYodHlwZW9mIHMhPT0ic3RyaW5nIil0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nICh3YXM6ICIrdHlwZW9mIHMrIikiKTtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuT2N0ZXRTdHJpbmc7dmFyIGxlbj1CdWZmZXIuYnl0ZUxlbmd0aChzKTt0aGlzLndyaXRlQnl0ZSh0YWcpO3RoaXMud3JpdGVMZW5ndGgobGVuKTtpZihsZW4pe3RoaXMuX2Vuc3VyZShsZW4pO3RoaXMuX2J1Zi53cml0ZShzLHRoaXMuX29mZnNldCk7dGhpcy5fb2Zmc2V0Kz1sZW59fTtXcml0ZXIucHJvdG90eXBlLndyaXRlQnVmZmVyPWZ1bmN0aW9uKGJ1Zix0YWcpe2lmKHR5cGVvZiB0YWchPT0ibnVtYmVyIil0aHJvdyBuZXcgVHlwZUVycm9yKCJ0YWcgbXVzdCBiZSBhIG51bWJlciIpO2lmKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSl0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgYnVmZmVyIik7dGhpcy53cml0ZUJ5dGUodGFnKTt0aGlzLndyaXRlTGVuZ3RoKGJ1Zi5sZW5ndGgpO3RoaXMuX2Vuc3VyZShidWYubGVuZ3RoKTtidWYuY29weSh0aGlzLl9idWYsdGhpcy5fb2Zmc2V0LDAsYnVmLmxlbmd0aCk7dGhpcy5fb2Zmc2V0Kz1idWYubGVuZ3RofTtXcml0ZXIucHJvdG90eXBlLndyaXRlU3RyaW5nQXJyYXk9ZnVuY3Rpb24oc3RyaW5ncyl7aWYoIXN0cmluZ3MgaW5zdGFuY2VvZiBBcnJheSl0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5W1N0cmluZ10iKTt2YXIgc2VsZj10aGlzO3N0cmluZ3MuZm9yRWFjaChmdW5jdGlvbihzKXtzZWxmLndyaXRlU3RyaW5nKHMpfSl9O1dyaXRlci5wcm90b3R5cGUud3JpdGVPSUQ9ZnVuY3Rpb24ocyx0YWcpe2lmKHR5cGVvZiBzIT09InN0cmluZyIpdGhyb3cgbmV3IFR5cGVFcnJvcigiYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZyIpO2lmKHR5cGVvZiB0YWchPT0ibnVtYmVyIil0YWc9QVNOMS5PSUQ7aWYoIS9eKFswLTldK1wuKXszLH1bMC05XSskLy50ZXN0KHMpKXRocm93IG5ldyBFcnJvcigiYXJndW1lbnQgaXMgbm90IGEgdmFsaWQgT0lEIHN0cmluZyIpO2Z1bmN0aW9uIGVuY29kZU9jdGV0KGJ5dGVzLG9jdGV0KXtpZihvY3RldDwxMjgpe2J5dGVzLnB1c2gob2N0ZXQpfWVsc2UgaWYob2N0ZXQ8MTYzODQpe2J5dGVzLnB1c2gob2N0ZXQ+Pj43fDEyOCk7Ynl0ZXMucHVzaChvY3RldCYxMjcpfWVsc2UgaWYob2N0ZXQ8MjA5NzE1Mil7Ynl0ZXMucHVzaChvY3RldD4+PjE0fDEyOCk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj43fDEyOCkmMjU1KTtieXRlcy5wdXNoKG9jdGV0JjEyNyl9ZWxzZSBpZihvY3RldDwyNjg0MzU0NTYpe2J5dGVzLnB1c2gob2N0ZXQ+Pj4yMXwxMjgpO2J5dGVzLnB1c2goKG9jdGV0Pj4+MTR8MTI4KSYyNTUpO2J5dGVzLnB1c2goKG9jdGV0Pj4+N3wxMjgpJjI1NSk7Ynl0ZXMucHVzaChvY3RldCYxMjcpfWVsc2V7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4yOHwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4yMXwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj4xNHwxMjgpJjI1NSk7Ynl0ZXMucHVzaCgob2N0ZXQ+Pj43fDEyOCkmMjU1KTtieXRlcy5wdXNoKG9jdGV0JjEyNyl9fXZhciB0bXA9cy5zcGxpdCgiLiIpO3ZhciBieXRlcz1bXTtieXRlcy5wdXNoKHBhcnNlSW50KHRtcFswXSwxMCkqNDArcGFyc2VJbnQodG1wWzFdLDEwKSk7dG1wLnNsaWNlKDIpLmZvckVhY2goZnVuY3Rpb24oYil7ZW5jb2RlT2N0ZXQoYnl0ZXMscGFyc2VJbnQoYiwxMCkpfSk7dmFyIHNlbGY9dGhpczt0aGlzLl9lbnN1cmUoMitieXRlcy5sZW5ndGgpO3RoaXMud3JpdGVCeXRlKHRhZyk7dGhpcy53cml0ZUxlbmd0aChieXRlcy5sZW5ndGgpO2J5dGVzLmZvckVhY2goZnVuY3Rpb24oYil7c2VsZi53cml0ZUJ5dGUoYil9KX07V3JpdGVyLnByb3RvdHlwZS53cml0ZUxlbmd0aD1mdW5jdGlvbihsZW4pe2lmKHR5cGVvZiBsZW4hPT0ibnVtYmVyIil0aHJvdyBuZXcgVHlwZUVycm9yKCJhcmd1bWVudCBtdXN0IGJlIGEgTnVtYmVyIik7dGhpcy5fZW5zdXJlKDQpO2lmKGxlbjw9MTI3KXt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPWxlbn1lbHNlIGlmKGxlbjw9MjU1KXt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPTEyOTt0aGlzLl9idWZbdGhpcy5fb2Zmc2V0KytdPWxlbn1lbHNlIGlmKGxlbjw9NjU1MzUpe3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109MTMwO3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVuPj44O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVufWVsc2UgaWYobGVuPD0xNjc3NzIxNSl7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT0xMzE7dGhpcy5fYnVmW3RoaXMuX29mZnNldCsrXT1sZW4+PjE2O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVuPj44O3RoaXMuX2J1Zlt0aGlzLl9vZmZzZXQrK109bGVufWVsc2V7dGhyb3cgbmV3SW52YWxpZEFzbjFFcnJvcigiTGVuZ3RoIHRvbyBsb25nICg+IDQgYnl0ZXMpIil9fTtXcml0ZXIucHJvdG90eXBlLnN0YXJ0U2VxdWVuY2U9ZnVuY3Rpb24odGFnKXtpZih0eXBlb2YgdGFnIT09Im51bWJlciIpdGFnPUFTTjEuU2VxdWVuY2V8QVNOMS5Db25zdHJ1Y3Rvcjt0aGlzLndyaXRlQnl0ZSh0YWcpO3RoaXMuX3NlcS5wdXNoKHRoaXMuX29mZnNldCk7dGhpcy5fZW5zdXJlKDMpO3RoaXMuX29mZnNldCs9M307V3JpdGVyLnByb3RvdHlwZS5lbmRTZXF1ZW5jZT1mdW5jdGlvbigpe3ZhciBzZXE9dGhpcy5fc2VxLnBvcCgpO3ZhciBzdGFydD1zZXErMzt2YXIgbGVuPXRoaXMuX29mZnNldC1zdGFydDtpZihsZW48PTEyNyl7dGhpcy5fc2hpZnQoc3RhcnQsbGVuLC0yKTt0aGlzLl9idWZbc2VxXT1sZW59ZWxzZSBpZihsZW48PTI1NSl7dGhpcy5fc2hpZnQoc3RhcnQsbGVuLC0xKTt0aGlzLl9idWZbc2VxXT0xMjk7dGhpcy5fYnVmW3NlcSsxXT1sZW59ZWxzZSBpZihsZW48PTY1NTM1KXt0aGlzLl9idWZbc2VxXT0xMzA7dGhpcy5fYnVmW3NlcSsxXT1sZW4+Pjg7dGhpcy5fYnVmW3NlcSsyXT1sZW59ZWxzZSBpZihsZW48PTE2Nzc3MjE1KXt0aGlzLl9zaGlmdChzdGFydCxsZW4sMSk7dGhpcy5fYnVmW3NlcV09MTMxO3RoaXMuX2J1ZltzZXErMV09bGVuPj4xNjt0aGlzLl9idWZbc2VxKzJdPWxlbj4+ODt0aGlzLl9idWZbc2VxKzNdPWxlbn1lbHNle3Rocm93IG5ld0ludmFsaWRBc24xRXJyb3IoIlNlcXVlbmNlIHRvbyBsb25nIil9fTtXcml0ZXIucHJvdG90eXBlLl9zaGlmdD1mdW5jdGlvbihzdGFydCxsZW4sc2hpZnQpe2Fzc2VydC5vayhzdGFydCE9PXVuZGVmaW5lZCk7YXNzZXJ0Lm9rKGxlbiE9PXVuZGVmaW5lZCk7YXNzZXJ0Lm9rKHNoaWZ0KTt0aGlzLl9idWYuY29weSh0aGlzLl9idWYsc3RhcnQrc2hpZnQsc3RhcnQsc3RhcnQrbGVuKTt0aGlzLl9vZmZzZXQrPXNoaWZ0fTtXcml0ZXIucHJvdG90eXBlLl9lbnN1cmU9ZnVuY3Rpb24obGVuKXthc3NlcnQub2sobGVuKTtpZih0aGlzLl9zaXplLXRoaXMuX29mZnNldDxsZW4pe3ZhciBzej10aGlzLl9zaXplKnRoaXMuX29wdGlvbnMuZ3Jvd3RoRmFjdG9yO2lmKHN6LXRoaXMuX29mZnNldDxsZW4pc3orPWxlbjt2YXIgYnVmPUJ1ZmZlci5hbGxvYyhzeik7dGhpcy5fYnVmLmNvcHkoYnVmLDAsMCx0aGlzLl9vZmZzZXQpO3RoaXMuX2J1Zj1idWY7dGhpcy5fc2l6ZT1zen19O21vZHVsZS5leHBvcnRzPVdyaXRlcn0seyIuL2Vycm9ycyI6MTIsIi4vdHlwZXMiOjE1LGFzc2VydDoxOCwic2FmZXItYnVmZmVyIjo3OX1dLDE3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgQmVyPXJlcXVpcmUoIi4vYmVyL2luZGV4Iik7bW9kdWxlLmV4cG9ydHM9e0JlcjpCZXIsQmVyUmVhZGVyOkJlci5SZWFkZXIsQmVyV3JpdGVyOkJlci5Xcml0ZXJ9fSx7Ii4vYmVyL2luZGV4IjoxM31dLDE4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsKXsidXNlIHN0cmljdCI7dmFyIG9iamVjdEFzc2lnbj1yZXF1aXJlKCJvYmplY3QtYXNzaWduIik7ZnVuY3Rpb24gY29tcGFyZShhLGIpe2lmKGE9PT1iKXtyZXR1cm4gMH12YXIgeD1hLmxlbmd0aDt2YXIgeT1iLmxlbmd0aDtmb3IodmFyIGk9MCxsZW49TWF0aC5taW4oeCx5KTtpPGxlbjsrK2kpe2lmKGFbaV0hPT1iW2ldKXt4PWFbaV07eT1iW2ldO2JyZWFrfX1pZih4PHkpe3JldHVybi0xfWlmKHk8eCl7cmV0dXJuIDF9cmV0dXJuIDB9ZnVuY3Rpb24gaXNCdWZmZXIoYil7aWYoZ2xvYmFsLkJ1ZmZlciYmdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXI9PT0iZnVuY3Rpb24iKXtyZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKX1yZXR1cm4hIShiIT1udWxsJiZiLl9pc0J1ZmZlcil9dmFyIHV0aWw9cmVxdWlyZSgidXRpbC8iKTt2YXIgaGFzT3duPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7dmFyIHBTbGljZT1BcnJheS5wcm90b3R5cGUuc2xpY2U7dmFyIGZ1bmN0aW9uc0hhdmVOYW1lcz1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbiBmb28oKXt9Lm5hbWU9PT0iZm9vIn0oKTtmdW5jdGlvbiBwVG9TdHJpbmcob2JqKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iail9ZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zil7aWYoaXNCdWZmZXIoYXJyYnVmKSl7cmV0dXJuIGZhbHNlfWlmKHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIhPT0iZnVuY3Rpb24iKXtyZXR1cm4gZmFsc2V9aWYodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldz09PSJmdW5jdGlvbiIpe3JldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKX1pZighYXJyYnVmKXtyZXR1cm4gZmFsc2V9aWYoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpe3JldHVybiB0cnVlfWlmKGFycmJ1Zi5idWZmZXImJmFycmJ1Zi5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7cmV0dXJuIHRydWV9cmV0dXJuIGZhbHNlfXZhciBhc3NlcnQ9bW9kdWxlLmV4cG9ydHM9b2s7dmFyIHJlZ2V4PS9ccypmdW5jdGlvblxzKyhbXlwoXHNdKilccyovO2Z1bmN0aW9uIGdldE5hbWUoZnVuYyl7aWYoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSl7cmV0dXJufWlmKGZ1bmN0aW9uc0hhdmVOYW1lcyl7cmV0dXJuIGZ1bmMubmFtZX12YXIgc3RyPWZ1bmMudG9TdHJpbmcoKTt2YXIgbWF0Y2g9c3RyLm1hdGNoKHJlZ2V4KTtyZXR1cm4gbWF0Y2gmJm1hdGNoWzFdfWFzc2VydC5Bc3NlcnRpb25FcnJvcj1mdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKXt0aGlzLm5hbWU9IkFzc2VydGlvbkVycm9yIjt0aGlzLmFjdHVhbD1vcHRpb25zLmFjdHVhbDt0aGlzLmV4cGVjdGVkPW9wdGlvbnMuZXhwZWN0ZWQ7dGhpcy5vcGVyYXRvcj1vcHRpb25zLm9wZXJhdG9yO2lmKG9wdGlvbnMubWVzc2FnZSl7dGhpcy5tZXNzYWdlPW9wdGlvbnMubWVzc2FnZTt0aGlzLmdlbmVyYXRlZE1lc3NhZ2U9ZmFsc2V9ZWxzZXt0aGlzLm1lc3NhZ2U9Z2V0TWVzc2FnZSh0aGlzKTt0aGlzLmdlbmVyYXRlZE1lc3NhZ2U9dHJ1ZX12YXIgc3RhY2tTdGFydEZ1bmN0aW9uPW9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9ufHxmYWlsO2lmKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKXtFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLHN0YWNrU3RhcnRGdW5jdGlvbil9ZWxzZXt2YXIgZXJyPW5ldyBFcnJvcjtpZihlcnIuc3RhY2spe3ZhciBvdXQ9ZXJyLnN0YWNrO3ZhciBmbl9uYW1lPWdldE5hbWUoc3RhY2tTdGFydEZ1bmN0aW9uKTt2YXIgaWR4PW91dC5pbmRleE9mKCJcbiIrZm5fbmFtZSk7aWYoaWR4Pj0wKXt2YXIgbmV4dF9saW5lPW91dC5pbmRleE9mKCJcbiIsaWR4KzEpO291dD1vdXQuc3Vic3RyaW5nKG5leHRfbGluZSsxKX10aGlzLnN0YWNrPW91dH19fTt1dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvcixFcnJvcik7ZnVuY3Rpb24gdHJ1bmNhdGUocyxuKXtpZih0eXBlb2Ygcz09PSJzdHJpbmciKXtyZXR1cm4gcy5sZW5ndGg8bj9zOnMuc2xpY2UoMCxuKX1lbHNle3JldHVybiBzfX1mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZyl7aWYoZnVuY3Rpb25zSGF2ZU5hbWVzfHwhdXRpbC5pc0Z1bmN0aW9uKHNvbWV0aGluZykpe3JldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKX12YXIgcmF3bmFtZT1nZXROYW1lKHNvbWV0aGluZyk7dmFyIG5hbWU9cmF3bmFtZT8iOiAiK3Jhd25hbWU6IiI7cmV0dXJuIltGdW5jdGlvbiIrbmFtZSsiXSJ9ZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKXtyZXR1cm4gdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmFjdHVhbCksMTI4KSsiICIrc2VsZi5vcGVyYXRvcisiICIrdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwxMjgpfWZ1bmN0aW9uIGZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Usb3BlcmF0b3Isc3RhY2tTdGFydEZ1bmN0aW9uKXt0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHttZXNzYWdlOm1lc3NhZ2UsYWN0dWFsOmFjdHVhbCxleHBlY3RlZDpleHBlY3RlZCxvcGVyYXRvcjpvcGVyYXRvcixzdGFja1N0YXJ0RnVuY3Rpb246c3RhY2tTdGFydEZ1bmN0aW9ufSl9YXNzZXJ0LmZhaWw9ZmFpbDtmdW5jdGlvbiBvayh2YWx1ZSxtZXNzYWdlKXtpZighdmFsdWUpZmFpbCh2YWx1ZSx0cnVlLG1lc3NhZ2UsIj09Iixhc3NlcnQub2spfWFzc2VydC5vaz1vazthc3NlcnQuZXF1YWw9ZnVuY3Rpb24gZXF1YWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Upe2lmKGFjdHVhbCE9ZXhwZWN0ZWQpZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiPT0iLGFzc2VydC5lcXVhbCl9O2Fzc2VydC5ub3RFcXVhbD1mdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsPT1leHBlY3RlZCl7ZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiIT0iLGFzc2VydC5ub3RFcXVhbCl9fTthc3NlcnQuZGVlcEVxdWFsPWZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoIV9kZWVwRXF1YWwoYWN0dWFsLGV4cGVjdGVkLGZhbHNlKSl7ZmFpbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSwiZGVlcEVxdWFsIixhc3NlcnQuZGVlcEVxdWFsKX19O2Fzc2VydC5kZWVwU3RyaWN0RXF1YWw9ZnVuY3Rpb24gZGVlcFN0cmljdEVxdWFsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlKXtpZighX2RlZXBFcXVhbChhY3R1YWwsZXhwZWN0ZWQsdHJ1ZSkpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsImRlZXBTdHJpY3RFcXVhbCIsYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCl9fTtmdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxzdHJpY3QsbWVtb3Mpe2lmKGFjdHVhbD09PWV4cGVjdGVkKXtyZXR1cm4gdHJ1ZX1lbHNlIGlmKGlzQnVmZmVyKGFjdHVhbCkmJmlzQnVmZmVyKGV4cGVjdGVkKSl7cmV0dXJuIGNvbXBhcmUoYWN0dWFsLGV4cGVjdGVkKT09PTB9ZWxzZSBpZih1dGlsLmlzRGF0ZShhY3R1YWwpJiZ1dGlsLmlzRGF0ZShleHBlY3RlZCkpe3JldHVybiBhY3R1YWwuZ2V0VGltZSgpPT09ZXhwZWN0ZWQuZ2V0VGltZSgpfWVsc2UgaWYodXRpbC5pc1JlZ0V4cChhY3R1YWwpJiZ1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSl7cmV0dXJuIGFjdHVhbC5zb3VyY2U9PT1leHBlY3RlZC5zb3VyY2UmJmFjdHVhbC5nbG9iYWw9PT1leHBlY3RlZC5nbG9iYWwmJmFjdHVhbC5tdWx0aWxpbmU9PT1leHBlY3RlZC5tdWx0aWxpbmUmJmFjdHVhbC5sYXN0SW5kZXg9PT1leHBlY3RlZC5sYXN0SW5kZXgmJmFjdHVhbC5pZ25vcmVDYXNlPT09ZXhwZWN0ZWQuaWdub3JlQ2FzZX1lbHNlIGlmKChhY3R1YWw9PT1udWxsfHx0eXBlb2YgYWN0dWFsIT09Im9iamVjdCIpJiYoZXhwZWN0ZWQ9PT1udWxsfHx0eXBlb2YgZXhwZWN0ZWQhPT0ib2JqZWN0Iikpe3JldHVybiBzdHJpY3Q/YWN0dWFsPT09ZXhwZWN0ZWQ6YWN0dWFsPT1leHBlY3RlZH1lbHNlIGlmKGlzVmlldyhhY3R1YWwpJiZpc1ZpZXcoZXhwZWN0ZWQpJiZwVG9TdHJpbmcoYWN0dWFsKT09PXBUb1N0cmluZyhleHBlY3RlZCkmJiEoYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5fHxhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDY0QXJyYXkpKXtyZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKT09PTB9ZWxzZSBpZihpc0J1ZmZlcihhY3R1YWwpIT09aXNCdWZmZXIoZXhwZWN0ZWQpKXtyZXR1cm4gZmFsc2V9ZWxzZXttZW1vcz1tZW1vc3x8e2FjdHVhbDpbXSxleHBlY3RlZDpbXX07dmFyIGFjdHVhbEluZGV4PW1lbW9zLmFjdHVhbC5pbmRleE9mKGFjdHVhbCk7aWYoYWN0dWFsSW5kZXghPT0tMSl7aWYoYWN0dWFsSW5kZXg9PT1tZW1vcy5leHBlY3RlZC5pbmRleE9mKGV4cGVjdGVkKSl7cmV0dXJuIHRydWV9fW1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7bWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7cmV0dXJuIG9iakVxdWl2KGFjdHVhbCxleHBlY3RlZCxzdHJpY3QsbWVtb3MpfX1mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3Qpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KT09IltvYmplY3QgQXJndW1lbnRzXSJ9ZnVuY3Rpb24gb2JqRXF1aXYoYSxiLHN0cmljdCxhY3R1YWxWaXNpdGVkT2JqZWN0cyl7aWYoYT09PW51bGx8fGE9PT11bmRlZmluZWR8fGI9PT1udWxsfHxiPT09dW5kZWZpbmVkKXJldHVybiBmYWxzZTtpZih1dGlsLmlzUHJpbWl0aXZlKGEpfHx1dGlsLmlzUHJpbWl0aXZlKGIpKXJldHVybiBhPT09YjtpZihzdHJpY3QmJk9iamVjdC5nZXRQcm90b3R5cGVPZihhKSE9PU9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlyZXR1cm4gZmFsc2U7dmFyIGFJc0FyZ3M9aXNBcmd1bWVudHMoYSk7dmFyIGJJc0FyZ3M9aXNBcmd1bWVudHMoYik7aWYoYUlzQXJncyYmIWJJc0FyZ3N8fCFhSXNBcmdzJiZiSXNBcmdzKXJldHVybiBmYWxzZTtpZihhSXNBcmdzKXthPXBTbGljZS5jYWxsKGEpO2I9cFNsaWNlLmNhbGwoYik7cmV0dXJuIF9kZWVwRXF1YWwoYSxiLHN0cmljdCl9dmFyIGthPW9iamVjdEtleXMoYSk7dmFyIGtiPW9iamVjdEtleXMoYik7dmFyIGtleSxpO2lmKGthLmxlbmd0aCE9PWtiLmxlbmd0aClyZXR1cm4gZmFsc2U7a2Euc29ydCgpO2tiLnNvcnQoKTtmb3IoaT1rYS5sZW5ndGgtMTtpPj0wO2ktLSl7aWYoa2FbaV0hPT1rYltpXSlyZXR1cm4gZmFsc2V9Zm9yKGk9a2EubGVuZ3RoLTE7aT49MDtpLS0pe2tleT1rYVtpXTtpZighX2RlZXBFcXVhbChhW2tleV0sYltrZXldLHN0cmljdCxhY3R1YWxWaXNpdGVkT2JqZWN0cykpcmV0dXJuIGZhbHNlfXJldHVybiB0cnVlfWFzc2VydC5ub3REZWVwRXF1YWw9ZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlKXtpZihfZGVlcEVxdWFsKGFjdHVhbCxleHBlY3RlZCxmYWxzZSkpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIm5vdERlZXBFcXVhbCIsYXNzZXJ0Lm5vdERlZXBFcXVhbCl9fTthc3NlcnQubm90RGVlcFN0cmljdEVxdWFsPW5vdERlZXBTdHJpY3RFcXVhbDtmdW5jdGlvbiBub3REZWVwU3RyaWN0RXF1YWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2Upe2lmKF9kZWVwRXF1YWwoYWN0dWFsLGV4cGVjdGVkLHRydWUpKXtmYWlsKGFjdHVhbCxleHBlY3RlZCxtZXNzYWdlLCJub3REZWVwU3RyaWN0RXF1YWwiLG5vdERlZXBTdHJpY3RFcXVhbCl9fWFzc2VydC5zdHJpY3RFcXVhbD1mdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsIT09ZXhwZWN0ZWQpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIj09PSIsYXNzZXJ0LnN0cmljdEVxdWFsKX19O2Fzc2VydC5ub3RTdHJpY3RFcXVhbD1mdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsZXhwZWN0ZWQsbWVzc2FnZSl7aWYoYWN0dWFsPT09ZXhwZWN0ZWQpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLG1lc3NhZ2UsIiE9PSIsYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKX19O2Z1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCxleHBlY3RlZCl7aWYoIWFjdHVhbHx8IWV4cGVjdGVkKXtyZXR1cm4gZmFsc2V9aWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKT09IltvYmplY3QgUmVnRXhwXSIpe3JldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCl9dHJ5e2lmKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKXtyZXR1cm4gdHJ1ZX19Y2F0Y2goZSl7fWlmKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKXtyZXR1cm4gZmFsc2V9cmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sYWN0dWFsKT09PXRydWV9ZnVuY3Rpb24gX3RyeUJsb2NrKGJsb2NrKXt2YXIgZXJyb3I7dHJ5e2Jsb2NrKCl9Y2F0Y2goZSl7ZXJyb3I9ZX1yZXR1cm4gZXJyb3J9ZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdyxibG9jayxleHBlY3RlZCxtZXNzYWdlKXt2YXIgYWN0dWFsO2lmKHR5cGVvZiBibG9jayE9PSJmdW5jdGlvbiIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJibG9jayIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyl9aWYodHlwZW9mIGV4cGVjdGVkPT09InN0cmluZyIpe21lc3NhZ2U9ZXhwZWN0ZWQ7ZXhwZWN0ZWQ9bnVsbH1hY3R1YWw9X3RyeUJsb2NrKGJsb2NrKTttZXNzYWdlPShleHBlY3RlZCYmZXhwZWN0ZWQubmFtZT8iICgiK2V4cGVjdGVkLm5hbWUrIikuIjoiLiIpKyhtZXNzYWdlPyIgIittZXNzYWdlOiIuIik7aWYoc2hvdWxkVGhyb3cmJiFhY3R1YWwpe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLCJNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbiIrbWVzc2FnZSl9dmFyIHVzZXJQcm92aWRlZE1lc3NhZ2U9dHlwZW9mIG1lc3NhZ2U9PT0ic3RyaW5nIjt2YXIgaXNVbndhbnRlZEV4Y2VwdGlvbj0hc2hvdWxkVGhyb3cmJnV0aWwuaXNFcnJvcihhY3R1YWwpO3ZhciBpc1VuZXhwZWN0ZWRFeGNlcHRpb249IXNob3VsZFRocm93JiZhY3R1YWwmJiFleHBlY3RlZDtpZihpc1Vud2FudGVkRXhjZXB0aW9uJiZ1c2VyUHJvdmlkZWRNZXNzYWdlJiZleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsZXhwZWN0ZWQpfHxpc1VuZXhwZWN0ZWRFeGNlcHRpb24pe2ZhaWwoYWN0dWFsLGV4cGVjdGVkLCJHb3QgdW53YW50ZWQgZXhjZXB0aW9uIittZXNzYWdlKX1pZihzaG91bGRUaHJvdyYmYWN0dWFsJiZleHBlY3RlZCYmIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCxleHBlY3RlZCl8fCFzaG91bGRUaHJvdyYmYWN0dWFsKXt0aHJvdyBhY3R1YWx9fWFzc2VydC50aHJvd3M9ZnVuY3Rpb24oYmxvY2ssZXJyb3IsbWVzc2FnZSl7X3Rocm93cyh0cnVlLGJsb2NrLGVycm9yLG1lc3NhZ2UpfTthc3NlcnQuZG9lc05vdFRocm93PWZ1bmN0aW9uKGJsb2NrLGVycm9yLG1lc3NhZ2Upe190aHJvd3MoZmFsc2UsYmxvY2ssZXJyb3IsbWVzc2FnZSl9O2Fzc2VydC5pZkVycm9yPWZ1bmN0aW9uKGVycil7aWYoZXJyKXRocm93IGVycn07ZnVuY3Rpb24gc3RyaWN0KHZhbHVlLG1lc3NhZ2Upe2lmKCF2YWx1ZSlmYWlsKHZhbHVlLHRydWUsbWVzc2FnZSwiPT0iLHN0cmljdCl9YXNzZXJ0LnN0cmljdD1vYmplY3RBc3NpZ24oc3RyaWN0LGFzc2VydCx7ZXF1YWw6YXNzZXJ0LnN0cmljdEVxdWFsLGRlZXBFcXVhbDphc3NlcnQuZGVlcFN0cmljdEVxdWFsLG5vdEVxdWFsOmFzc2VydC5ub3RTdHJpY3RFcXVhbCxub3REZWVwRXF1YWw6YXNzZXJ0Lm5vdERlZXBTdHJpY3RFcXVhbH0pO2Fzc2VydC5zdHJpY3Quc3RyaWN0PWFzc2VydC5zdHJpY3Q7dmFyIG9iamVjdEtleXM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uKG9iail7dmFyIGtleXM9W107Zm9yKHZhciBrZXkgaW4gb2JqKXtpZihoYXNPd24uY2FsbChvYmosa2V5KSlrZXlzLnB1c2goa2V5KX1yZXR1cm4ga2V5c319KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCE9PSJ1bmRlZmluZWQiP2dsb2JhbDp0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiP3dpbmRvdzp7fSl9LHsib2JqZWN0LWFzc2lnbiI6NTUsInV0aWwvIjoyMX1dLDE5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtpZih0eXBlb2YgT2JqZWN0LmNyZWF0ZT09PSJmdW5jdGlvbiIpe21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGluaGVyaXRzKGN0b3Isc3VwZXJDdG9yKXtjdG9yLnN1cGVyXz1zdXBlckN0b3I7Y3Rvci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6Y3RvcixlbnVtZXJhYmxlOmZhbHNlLHdyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWV9fSl9fWVsc2V7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaW5oZXJpdHMoY3RvcixzdXBlckN0b3Ipe2N0b3Iuc3VwZXJfPXN1cGVyQ3Rvcjt2YXIgVGVtcEN0b3I9ZnVuY3Rpb24oKXt9O1RlbXBDdG9yLnByb3RvdHlwZT1zdXBlckN0b3IucHJvdG90eXBlO2N0b3IucHJvdG90eXBlPW5ldyBUZW1wQ3RvcjtjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1jdG9yfX19LHt9XSwyMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24gaXNCdWZmZXIoYXJnKXtyZXR1cm4gYXJnJiZ0eXBlb2YgYXJnPT09Im9iamVjdCImJnR5cGVvZiBhcmcuY29weT09PSJmdW5jdGlvbiImJnR5cGVvZiBhcmcuZmlsbD09PSJmdW5jdGlvbiImJnR5cGVvZiBhcmcucmVhZFVJbnQ4PT09ImZ1bmN0aW9uIn19LHt9XSwyMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MsZ2xvYmFsKXt2YXIgZm9ybWF0UmVnRXhwPS8lW3NkaiVdL2c7ZXhwb3J0cy5mb3JtYXQ9ZnVuY3Rpb24oZil7aWYoIWlzU3RyaW5nKGYpKXt2YXIgb2JqZWN0cz1bXTtmb3IodmFyIGk9MDtpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXtvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKX1yZXR1cm4gb2JqZWN0cy5qb2luKCIgIil9dmFyIGk9MTt2YXIgYXJncz1hcmd1bWVudHM7dmFyIGxlbj1hcmdzLmxlbmd0aDt2YXIgc3RyPVN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCxmdW5jdGlvbih4KXtpZih4PT09IiUlIilyZXR1cm4iJSI7aWYoaT49bGVuKXJldHVybiB4O3N3aXRjaCh4KXtjYXNlIiVzIjpyZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7Y2FzZSIlZCI6cmV0dXJuIE51bWJlcihhcmdzW2krK10pO2Nhc2UiJWoiOnRyeXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKX1jYXRjaChfKXtyZXR1cm4iW0NpcmN1bGFyXSJ9ZGVmYXVsdDpyZXR1cm4geH19KTtmb3IodmFyIHg9YXJnc1tpXTtpPGxlbjt4PWFyZ3NbKytpXSl7aWYoaXNOdWxsKHgpfHwhaXNPYmplY3QoeCkpe3N0cis9IiAiK3h9ZWxzZXtzdHIrPSIgIitpbnNwZWN0KHgpfX1yZXR1cm4gc3RyfTtleHBvcnRzLmRlcHJlY2F0ZT1mdW5jdGlvbihmbixtc2cpe2lmKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLG1zZykuYXBwbHkodGhpcyxhcmd1bWVudHMpfX1pZihwcm9jZXNzLm5vRGVwcmVjYXRpb249PT10cnVlKXtyZXR1cm4gZm59dmFyIHdhcm5lZD1mYWxzZTtmdW5jdGlvbiBkZXByZWNhdGVkKCl7aWYoIXdhcm5lZCl7aWYocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKXt0aHJvdyBuZXcgRXJyb3IobXNnKX1lbHNlIGlmKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbil7Y29uc29sZS50cmFjZShtc2cpfWVsc2V7Y29uc29sZS5lcnJvcihtc2cpfXdhcm5lZD10cnVlfXJldHVybiBmbi5hcHBseSh0aGlzLGFyZ3VtZW50cyl9cmV0dXJuIGRlcHJlY2F0ZWR9O3ZhciBkZWJ1Z3M9e307dmFyIGRlYnVnRW52aXJvbjtleHBvcnRzLmRlYnVnbG9nPWZ1bmN0aW9uKHNldCl7aWYoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlkZWJ1Z0Vudmlyb249cHJvY2Vzcy5lbnYuTk9ERV9ERUJVR3x8IiI7c2V0PXNldC50b1VwcGVyQ2FzZSgpO2lmKCFkZWJ1Z3Nbc2V0XSl7aWYobmV3IFJlZ0V4cCgiXFxiIitzZXQrIlxcYiIsImkiKS50ZXN0KGRlYnVnRW52aXJvbikpe3ZhciBwaWQ9cHJvY2Vzcy5waWQ7ZGVidWdzW3NldF09ZnVuY3Rpb24oKXt2YXIgbXNnPWV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKTtjb25zb2xlLmVycm9yKCIlcyAlZDogJXMiLHNldCxwaWQsbXNnKX19ZWxzZXtkZWJ1Z3Nbc2V0XT1mdW5jdGlvbigpe319fXJldHVybiBkZWJ1Z3Nbc2V0XX07ZnVuY3Rpb24gaW5zcGVjdChvYmosb3B0cyl7dmFyIGN0eD17c2VlbjpbXSxzdHlsaXplOnN0eWxpemVOb0NvbG9yfTtpZihhcmd1bWVudHMubGVuZ3RoPj0zKWN0eC5kZXB0aD1hcmd1bWVudHNbMl07aWYoYXJndW1lbnRzLmxlbmd0aD49NCljdHguY29sb3JzPWFyZ3VtZW50c1szXTtpZihpc0Jvb2xlYW4ob3B0cykpe2N0eC5zaG93SGlkZGVuPW9wdHN9ZWxzZSBpZihvcHRzKXtleHBvcnRzLl9leHRlbmQoY3R4LG9wdHMpfWlmKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSljdHguc2hvd0hpZGRlbj1mYWxzZTtpZihpc1VuZGVmaW5lZChjdHguZGVwdGgpKWN0eC5kZXB0aD0yO2lmKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKWN0eC5jb2xvcnM9ZmFsc2U7aWYoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKWN0eC5jdXN0b21JbnNwZWN0PXRydWU7aWYoY3R4LmNvbG9ycyljdHguc3R5bGl6ZT1zdHlsaXplV2l0aENvbG9yO3JldHVybiBmb3JtYXRWYWx1ZShjdHgsb2JqLGN0eC5kZXB0aCl9ZXhwb3J0cy5pbnNwZWN0PWluc3BlY3Q7aW5zcGVjdC5jb2xvcnM9e2JvbGQ6WzEsMjJdLGl0YWxpYzpbMywyM10sdW5kZXJsaW5lOls0LDI0XSxpbnZlcnNlOls3LDI3XSx3aGl0ZTpbMzcsMzldLGdyZXk6WzkwLDM5XSxibGFjazpbMzAsMzldLGJsdWU6WzM0LDM5XSxjeWFuOlszNiwzOV0sZ3JlZW46WzMyLDM5XSxtYWdlbnRhOlszNSwzOV0scmVkOlszMSwzOV0seWVsbG93OlszMywzOV19O2luc3BlY3Quc3R5bGVzPXtzcGVjaWFsOiJjeWFuIixudW1iZXI6InllbGxvdyIsYm9vbGVhbjoieWVsbG93Iix1bmRlZmluZWQ6ImdyZXkiLG51bGw6ImJvbGQiLHN0cmluZzoiZ3JlZW4iLGRhdGU6Im1hZ2VudGEiLHJlZ2V4cDoicmVkIn07ZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsc3R5bGVUeXBlKXt2YXIgc3R5bGU9aW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtpZihzdHlsZSl7cmV0dXJuIhtbIitpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0rIm0iK3N0cisiG1siK2luc3BlY3QuY29sb3JzW3N0eWxlXVsxXSsibSJ9ZWxzZXtyZXR1cm4gc3RyfX1mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsc3R5bGVUeXBlKXtyZXR1cm4gc3RyfWZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KXt2YXIgaGFzaD17fTthcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCxpZHgpe2hhc2hbdmFsXT10cnVlfSk7cmV0dXJuIGhhc2h9ZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyl7aWYoY3R4LmN1c3RvbUluc3BlY3QmJnZhbHVlJiZpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpJiZ2YWx1ZS5pbnNwZWN0IT09ZXhwb3J0cy5pbnNwZWN0JiYhKHZhbHVlLmNvbnN0cnVjdG9yJiZ2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGU9PT12YWx1ZSkpe3ZhciByZXQ9dmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsY3R4KTtpZighaXNTdHJpbmcocmV0KSl7cmV0PWZvcm1hdFZhbHVlKGN0eCxyZXQscmVjdXJzZVRpbWVzKX1yZXR1cm4gcmV0fXZhciBwcmltaXRpdmU9Zm9ybWF0UHJpbWl0aXZlKGN0eCx2YWx1ZSk7aWYocHJpbWl0aXZlKXtyZXR1cm4gcHJpbWl0aXZlfXZhciBrZXlzPU9iamVjdC5rZXlzKHZhbHVlKTt2YXIgdmlzaWJsZUtleXM9YXJyYXlUb0hhc2goa2V5cyk7aWYoY3R4LnNob3dIaWRkZW4pe2tleXM9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpfWlmKGlzRXJyb3IodmFsdWUpJiYoa2V5cy5pbmRleE9mKCJtZXNzYWdlIik+PTB8fGtleXMuaW5kZXhPZigiZGVzY3JpcHRpb24iKT49MCkpe3JldHVybiBmb3JtYXRFcnJvcih2YWx1ZSl9aWYoa2V5cy5sZW5ndGg9PT0wKXtpZihpc0Z1bmN0aW9uKHZhbHVlKSl7dmFyIG5hbWU9dmFsdWUubmFtZT8iOiAiK3ZhbHVlLm5hbWU6IiI7cmV0dXJuIGN0eC5zdHlsaXplKCJbRnVuY3Rpb24iK25hbWUrIl0iLCJzcGVjaWFsIil9aWYoaXNSZWdFeHAodmFsdWUpKXtyZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwicmVnZXhwIil9aWYoaXNEYXRlKHZhbHVlKSl7cmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCJkYXRlIil9aWYoaXNFcnJvcih2YWx1ZSkpe3JldHVybiBmb3JtYXRFcnJvcih2YWx1ZSl9fXZhciBiYXNlPSIiLGFycmF5PWZhbHNlLGJyYWNlcz1bInsiLCJ9Il07aWYoaXNBcnJheSh2YWx1ZSkpe2FycmF5PXRydWU7YnJhY2VzPVsiWyIsIl0iXX1pZihpc0Z1bmN0aW9uKHZhbHVlKSl7dmFyIG49dmFsdWUubmFtZT8iOiAiK3ZhbHVlLm5hbWU6IiI7YmFzZT0iIFtGdW5jdGlvbiIrbisiXSJ9aWYoaXNSZWdFeHAodmFsdWUpKXtiYXNlPSIgIitSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpfWlmKGlzRGF0ZSh2YWx1ZSkpe2Jhc2U9IiAiK0RhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpfWlmKGlzRXJyb3IodmFsdWUpKXtiYXNlPSIgIitmb3JtYXRFcnJvcih2YWx1ZSl9aWYoa2V5cy5sZW5ndGg9PT0wJiYoIWFycmF5fHx2YWx1ZS5sZW5ndGg9PTApKXtyZXR1cm4gYnJhY2VzWzBdK2Jhc2UrYnJhY2VzWzFdfWlmKHJlY3Vyc2VUaW1lczwwKXtpZihpc1JlZ0V4cCh2YWx1ZSkpe3JldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCJyZWdleHAiKX1lbHNle3JldHVybiBjdHguc3R5bGl6ZSgiW09iamVjdF0iLCJzcGVjaWFsIil9fWN0eC5zZWVuLnB1c2godmFsdWUpO3ZhciBvdXRwdXQ7aWYoYXJyYXkpe291dHB1dD1mb3JtYXRBcnJheShjdHgsdmFsdWUscmVjdXJzZVRpbWVzLHZpc2libGVLZXlzLGtleXMpfWVsc2V7b3V0cHV0PWtleXMubWFwKGZ1bmN0aW9uKGtleSl7cmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCx2YWx1ZSxyZWN1cnNlVGltZXMsdmlzaWJsZUtleXMsa2V5LGFycmF5KX0pfWN0eC5zZWVuLnBvcCgpO3JldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsYmFzZSxicmFjZXMpfWZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsdmFsdWUpe2lmKGlzVW5kZWZpbmVkKHZhbHVlKSlyZXR1cm4gY3R4LnN0eWxpemUoInVuZGVmaW5lZCIsInVuZGVmaW5lZCIpO2lmKGlzU3RyaW5nKHZhbHVlKSl7dmFyIHNpbXBsZT0iJyIrSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL14ifCIkL2csIiIpLnJlcGxhY2UoLycvZywiXFwnIikucmVwbGFjZSgvXFwiL2csJyInKSsiJyI7cmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwic3RyaW5nIil9aWYoaXNOdW1iZXIodmFsdWUpKXJldHVybiBjdHguc3R5bGl6ZSgiIit2YWx1ZSwibnVtYmVyIik7aWYoaXNCb29sZWFuKHZhbHVlKSlyZXR1cm4gY3R4LnN0eWxpemUoIiIrdmFsdWUsImJvb2xlYW4iKTtpZihpc051bGwodmFsdWUpKXJldHVybiBjdHguc3R5bGl6ZSgibnVsbCIsIm51bGwiKX1mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSl7cmV0dXJuIlsiK0Vycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSsiXSJ9ZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXlzKXt2YXIgb3V0cHV0PVtdO2Zvcih2YXIgaT0wLGw9dmFsdWUubGVuZ3RoO2k8bDsrK2kpe2lmKGhhc093blByb3BlcnR5KHZhbHVlLFN0cmluZyhpKSkpe291dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCx2YWx1ZSxyZWN1cnNlVGltZXMsdmlzaWJsZUtleXMsU3RyaW5nKGkpLHRydWUpKX1lbHNle291dHB1dC5wdXNoKCIiKX19a2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7aWYoIWtleS5tYXRjaCgvXlxkKyQvKSl7b3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXksdHJ1ZSkpfX0pO3JldHVybiBvdXRwdXR9ZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LHZhbHVlLHJlY3Vyc2VUaW1lcyx2aXNpYmxlS2V5cyxrZXksYXJyYXkpe3ZhciBuYW1lLHN0cixkZXNjO2Rlc2M9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSxrZXkpfHx7dmFsdWU6dmFsdWVba2V5XX07aWYoZGVzYy5nZXQpe2lmKGRlc2Muc2V0KXtzdHI9Y3R4LnN0eWxpemUoIltHZXR0ZXIvU2V0dGVyXSIsInNwZWNpYWwiKX1lbHNle3N0cj1jdHguc3R5bGl6ZSgiW0dldHRlcl0iLCJzcGVjaWFsIil9fWVsc2V7aWYoZGVzYy5zZXQpe3N0cj1jdHguc3R5bGl6ZSgiW1NldHRlcl0iLCJzcGVjaWFsIil9fWlmKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cyxrZXkpKXtuYW1lPSJbIitrZXkrIl0ifWlmKCFzdHIpe2lmKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSk8MCl7aWYoaXNOdWxsKHJlY3Vyc2VUaW1lcykpe3N0cj1mb3JtYXRWYWx1ZShjdHgsZGVzYy52YWx1ZSxudWxsKX1lbHNle3N0cj1mb3JtYXRWYWx1ZShjdHgsZGVzYy52YWx1ZSxyZWN1cnNlVGltZXMtMSl9aWYoc3RyLmluZGV4T2YoIlxuIik+LTEpe2lmKGFycmF5KXtzdHI9c3RyLnNwbGl0KCJcbiIpLm1hcChmdW5jdGlvbihsaW5lKXtyZXR1cm4iICAiK2xpbmV9KS5qb2luKCJcbiIpLnN1YnN0cigyKX1lbHNle3N0cj0iXG4iK3N0ci5zcGxpdCgiXG4iKS5tYXAoZnVuY3Rpb24obGluZSl7cmV0dXJuIiAgICIrbGluZX0pLmpvaW4oIlxuIil9fX1lbHNle3N0cj1jdHguc3R5bGl6ZSgiW0NpcmN1bGFyXSIsInNwZWNpYWwiKX19aWYoaXNVbmRlZmluZWQobmFtZSkpe2lmKGFycmF5JiZrZXkubWF0Y2goL15cZCskLykpe3JldHVybiBzdHJ9bmFtZT1KU09OLnN0cmluZ2lmeSgiIitrZXkpO2lmKG5hbWUubWF0Y2goL14iKFthLXpBLVpfXVthLXpBLVpfMC05XSopIiQvKSl7bmFtZT1uYW1lLnN1YnN0cigxLG5hbWUubGVuZ3RoLTIpO25hbWU9Y3R4LnN0eWxpemUobmFtZSwibmFtZSIpfWVsc2V7bmFtZT1uYW1lLnJlcGxhY2UoLycvZywiXFwnIikucmVwbGFjZSgvXFwiL2csJyInKS5yZXBsYWNlKC8oXiJ8IiQpL2csIiciKTtuYW1lPWN0eC5zdHlsaXplKG5hbWUsInN0cmluZyIpfX1yZXR1cm4gbmFtZSsiOiAiK3N0cn1mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsYmFzZSxicmFjZXMpe3ZhciBudW1MaW5lc0VzdD0wO3ZhciBsZW5ndGg9b3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LGN1cil7bnVtTGluZXNFc3QrKztpZihjdXIuaW5kZXhPZigiXG4iKT49MCludW1MaW5lc0VzdCsrO3JldHVybiBwcmV2K2N1ci5yZXBsYWNlKC9cdTAwMWJcW1xkXGQ/bS9nLCIiKS5sZW5ndGgrMX0sMCk7aWYobGVuZ3RoPjYwKXtyZXR1cm4gYnJhY2VzWzBdKyhiYXNlPT09IiI/IiI6YmFzZSsiXG4gIikrIiAiK291dHB1dC5qb2luKCIsXG4gICIpKyIgIiticmFjZXNbMV19cmV0dXJuIGJyYWNlc1swXStiYXNlKyIgIitvdXRwdXQuam9pbigiLCAiKSsiICIrYnJhY2VzWzFdfWZ1bmN0aW9uIGlzQXJyYXkoYXIpe3JldHVybiBBcnJheS5pc0FycmF5KGFyKX1leHBvcnRzLmlzQXJyYXk9aXNBcnJheTtmdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJib29sZWFuIn1leHBvcnRzLmlzQm9vbGVhbj1pc0Jvb2xlYW47ZnVuY3Rpb24gaXNOdWxsKGFyZyl7cmV0dXJuIGFyZz09PW51bGx9ZXhwb3J0cy5pc051bGw9aXNOdWxsO2Z1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09bnVsbH1leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkPWlzTnVsbE9yVW5kZWZpbmVkO2Z1bmN0aW9uIGlzTnVtYmVyKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ibnVtYmVyIn1leHBvcnRzLmlzTnVtYmVyPWlzTnVtYmVyO2Z1bmN0aW9uIGlzU3RyaW5nKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3RyaW5nIn1leHBvcnRzLmlzU3RyaW5nPWlzU3RyaW5nO2Z1bmN0aW9uIGlzU3ltYm9sKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3ltYm9sIn1leHBvcnRzLmlzU3ltYm9sPWlzU3ltYm9sO2Z1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09PXZvaWQgMH1leHBvcnRzLmlzVW5kZWZpbmVkPWlzVW5kZWZpbmVkO2Z1bmN0aW9uIGlzUmVnRXhwKHJlKXtyZXR1cm4gaXNPYmplY3QocmUpJiZvYmplY3RUb1N0cmluZyhyZSk9PT0iW29iamVjdCBSZWdFeHBdIn1leHBvcnRzLmlzUmVnRXhwPWlzUmVnRXhwO2Z1bmN0aW9uIGlzT2JqZWN0KGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ib2JqZWN0IiYmYXJnIT09bnVsbH1leHBvcnRzLmlzT2JqZWN0PWlzT2JqZWN0O2Z1bmN0aW9uIGlzRGF0ZShkKXtyZXR1cm4gaXNPYmplY3QoZCkmJm9iamVjdFRvU3RyaW5nKGQpPT09IltvYmplY3QgRGF0ZV0ifWV4cG9ydHMuaXNEYXRlPWlzRGF0ZTtmdW5jdGlvbiBpc0Vycm9yKGUpe3JldHVybiBpc09iamVjdChlKSYmKG9iamVjdFRvU3RyaW5nKGUpPT09IltvYmplY3QgRXJyb3JdInx8ZSBpbnN0YW5jZW9mIEVycm9yKX1leHBvcnRzLmlzRXJyb3I9aXNFcnJvcjtmdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0iZnVuY3Rpb24ifWV4cG9ydHMuaXNGdW5jdGlvbj1pc0Z1bmN0aW9uO2Z1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZyl7cmV0dXJuIGFyZz09PW51bGx8fHR5cGVvZiBhcmc9PT0iYm9vbGVhbiJ8fHR5cGVvZiBhcmc9PT0ibnVtYmVyInx8dHlwZW9mIGFyZz09PSJzdHJpbmcifHx0eXBlb2YgYXJnPT09InN5bWJvbCJ8fHR5cGVvZiBhcmc9PT0idW5kZWZpbmVkIn1leHBvcnRzLmlzUHJpbWl0aXZlPWlzUHJpbWl0aXZlO2V4cG9ydHMuaXNCdWZmZXI9cmVxdWlyZSgiLi9zdXBwb3J0L2lzQnVmZmVyIik7ZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobyl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKX1mdW5jdGlvbiBwYWQobil7cmV0dXJuIG48MTA/IjAiK24udG9TdHJpbmcoMTApOm4udG9TdHJpbmcoMTApfXZhciBtb250aHM9WyJKYW4iLCJGZWIiLCJNYXIiLCJBcHIiLCJNYXkiLCJKdW4iLCJKdWwiLCJBdWciLCJTZXAiLCJPY3QiLCJOb3YiLCJEZWMiXTtmdW5jdGlvbiB0aW1lc3RhbXAoKXt2YXIgZD1uZXcgRGF0ZTt2YXIgdGltZT1bcGFkKGQuZ2V0SG91cnMoKSkscGFkKGQuZ2V0TWludXRlcygpKSxwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCI6Iik7cmV0dXJuW2QuZ2V0RGF0ZSgpLG1vbnRoc1tkLmdldE1vbnRoKCldLHRpbWVdLmpvaW4oIiAiKX1leHBvcnRzLmxvZz1mdW5jdGlvbigpe2NvbnNvbGUubG9nKCIlcyAtICVzIix0aW1lc3RhbXAoKSxleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLGFyZ3VtZW50cykpfTtleHBvcnRzLmluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7ZXhwb3J0cy5fZXh0ZW5kPWZ1bmN0aW9uKG9yaWdpbixhZGQpe2lmKCFhZGR8fCFpc09iamVjdChhZGQpKXJldHVybiBvcmlnaW47dmFyIGtleXM9T2JqZWN0LmtleXMoYWRkKTt2YXIgaT1rZXlzLmxlbmd0aDt3aGlsZShpLS0pe29yaWdpbltrZXlzW2ldXT1hZGRba2V5c1tpXV19cmV0dXJuIG9yaWdpbn07ZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLHByb3Ape3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLHByb3ApfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJfcHJvY2VzcyIpLHR5cGVvZiBnbG9iYWwhPT0idW5kZWZpbmVkIj9nbG9iYWw6dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIj9zZWxmOnR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkIj93aW5kb3c6e30pfSx7Ii4vc3VwcG9ydC9pc0J1ZmZlciI6MjAsX3Byb2Nlc3M6NjIsaW5oZXJpdHM6MTl9XSwyMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO2V4cG9ydHMuYnl0ZUxlbmd0aD1ieXRlTGVuZ3RoO2V4cG9ydHMudG9CeXRlQXJyYXk9dG9CeXRlQXJyYXk7ZXhwb3J0cy5mcm9tQnl0ZUFycmF5PWZyb21CeXRlQXJyYXk7dmFyIGxvb2t1cD1bXTt2YXIgcmV2TG9va3VwPVtdO3ZhciBBcnI9dHlwZW9mIFVpbnQ4QXJyYXkhPT0idW5kZWZpbmVkIj9VaW50OEFycmF5OkFycmF5O3ZhciBjb2RlPSJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvIjtmb3IodmFyIGk9MCxsZW49Y29kZS5sZW5ndGg7aTxsZW47KytpKXtsb29rdXBbaV09Y29kZVtpXTtyZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXT1pfXJldkxvb2t1cFsiLSIuY2hhckNvZGVBdCgwKV09NjI7cmV2TG9va3VwWyJfIi5jaGFyQ29kZUF0KDApXT02MztmdW5jdGlvbiBnZXRMZW5zKGI2NCl7dmFyIGxlbj1iNjQubGVuZ3RoO2lmKGxlbiU0PjApe3Rocm93IG5ldyBFcnJvcigiSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCIpfXZhciB2YWxpZExlbj1iNjQuaW5kZXhPZigiPSIpO2lmKHZhbGlkTGVuPT09LTEpdmFsaWRMZW49bGVuO3ZhciBwbGFjZUhvbGRlcnNMZW49dmFsaWRMZW49PT1sZW4/MDo0LXZhbGlkTGVuJTQ7cmV0dXJuW3ZhbGlkTGVuLHBsYWNlSG9sZGVyc0xlbl19ZnVuY3Rpb24gYnl0ZUxlbmd0aChiNjQpe3ZhciBsZW5zPWdldExlbnMoYjY0KTt2YXIgdmFsaWRMZW49bGVuc1swXTt2YXIgcGxhY2VIb2xkZXJzTGVuPWxlbnNbMV07cmV0dXJuKHZhbGlkTGVuK3BsYWNlSG9sZGVyc0xlbikqMy80LXBsYWNlSG9sZGVyc0xlbn1mdW5jdGlvbiBfYnl0ZUxlbmd0aChiNjQsdmFsaWRMZW4scGxhY2VIb2xkZXJzTGVuKXtyZXR1cm4odmFsaWRMZW4rcGxhY2VIb2xkZXJzTGVuKSozLzQtcGxhY2VIb2xkZXJzTGVufWZ1bmN0aW9uIHRvQnl0ZUFycmF5KGI2NCl7dmFyIHRtcDt2YXIgbGVucz1nZXRMZW5zKGI2NCk7dmFyIHZhbGlkTGVuPWxlbnNbMF07dmFyIHBsYWNlSG9sZGVyc0xlbj1sZW5zWzFdO3ZhciBhcnI9bmV3IEFycihfYnl0ZUxlbmd0aChiNjQsdmFsaWRMZW4scGxhY2VIb2xkZXJzTGVuKSk7dmFyIGN1ckJ5dGU9MDt2YXIgbGVuPXBsYWNlSG9sZGVyc0xlbj4wP3ZhbGlkTGVuLTQ6dmFsaWRMZW47Zm9yKHZhciBpPTA7aTxsZW47aSs9NCl7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDE4fHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzEpXTw8MTJ8cmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkrMildPDw2fHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzMpXTthcnJbY3VyQnl0ZSsrXT10bXA+PjE2JjI1NTthcnJbY3VyQnl0ZSsrXT10bXA+PjgmMjU1O2FycltjdXJCeXRlKytdPXRtcCYyNTV9aWYocGxhY2VIb2xkZXJzTGVuPT09Mil7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDJ8cmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkrMSldPj40O2FycltjdXJCeXRlKytdPXRtcCYyNTV9aWYocGxhY2VIb2xkZXJzTGVuPT09MSl7dG1wPXJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV08PDEwfHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKzEpXTw8NHxyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSsyKV0+PjI7YXJyW2N1ckJ5dGUrK109dG1wPj44JjI1NTthcnJbY3VyQnl0ZSsrXT10bXAmMjU1fXJldHVybiBhcnJ9ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0KG51bSl7cmV0dXJuIGxvb2t1cFtudW0+PjE4JjYzXStsb29rdXBbbnVtPj4xMiY2M10rbG9va3VwW251bT4+NiY2M10rbG9va3VwW251bSY2M119ZnVuY3Rpb24gZW5jb2RlQ2h1bmsodWludDgsc3RhcnQsZW5kKXt2YXIgdG1wO3ZhciBvdXRwdXQ9W107Zm9yKHZhciBpPXN0YXJ0O2k8ZW5kO2krPTMpe3RtcD0odWludDhbaV08PDE2JjE2NzExNjgwKSsodWludDhbaSsxXTw8OCY2NTI4MCkrKHVpbnQ4W2krMl0mMjU1KTtvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSl9cmV0dXJuIG91dHB1dC5qb2luKCIiKX1mdW5jdGlvbiBmcm9tQnl0ZUFycmF5KHVpbnQ4KXt2YXIgdG1wO3ZhciBsZW49dWludDgubGVuZ3RoO3ZhciBleHRyYUJ5dGVzPWxlbiUzO3ZhciBwYXJ0cz1bXTt2YXIgbWF4Q2h1bmtMZW5ndGg9MTYzODM7Zm9yKHZhciBpPTAsbGVuMj1sZW4tZXh0cmFCeXRlcztpPGxlbjI7aSs9bWF4Q2h1bmtMZW5ndGgpe3BhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsaSxpK21heENodW5rTGVuZ3RoPmxlbjI/bGVuMjppK21heENodW5rTGVuZ3RoKSl9aWYoZXh0cmFCeXRlcz09PTEpe3RtcD11aW50OFtsZW4tMV07cGFydHMucHVzaChsb29rdXBbdG1wPj4yXStsb29rdXBbdG1wPDw0JjYzXSsiPT0iKX1lbHNlIGlmKGV4dHJhQnl0ZXM9PT0yKXt0bXA9KHVpbnQ4W2xlbi0yXTw8OCkrdWludDhbbGVuLTFdO3BhcnRzLnB1c2gobG9va3VwW3RtcD4+MTBdK2xvb2t1cFt0bXA+PjQmNjNdK2xvb2t1cFt0bXA8PDImNjNdKyI9Iil9cmV0dXJuIHBhcnRzLmpvaW4oIiIpfX0se31dLDIzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgYmlnSW50PWZ1bmN0aW9uKHVuZGVmaW5lZCl7InVzZSBzdHJpY3QiO3ZhciBCQVNFPTFlNyxMT0dfQkFTRT03LE1BWF9JTlQ9OTAwNzE5OTI1NDc0MDk5MixNQVhfSU5UX0FSUj1zbWFsbFRvQXJyYXkoTUFYX0lOVCksREVGQVVMVF9BTFBIQUJFVD0iMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6Ijt2YXIgc3VwcG9ydHNOYXRpdmVCaWdJbnQ9dHlwZW9mIEJpZ0ludD09PSJmdW5jdGlvbiI7ZnVuY3Rpb24gSW50ZWdlcih2LHJhZGl4LGFscGhhYmV0LGNhc2VTZW5zaXRpdmUpe2lmKHR5cGVvZiB2PT09InVuZGVmaW5lZCIpcmV0dXJuIEludGVnZXJbMF07aWYodHlwZW9mIHJhZGl4IT09InVuZGVmaW5lZCIpcmV0dXJuK3JhZGl4PT09MTAmJiFhbHBoYWJldD9wYXJzZVZhbHVlKHYpOnBhcnNlQmFzZSh2LHJhZGl4LGFscGhhYmV0LGNhc2VTZW5zaXRpdmUpO3JldHVybiBwYXJzZVZhbHVlKHYpfWZ1bmN0aW9uIEJpZ0ludGVnZXIodmFsdWUsc2lnbil7dGhpcy52YWx1ZT12YWx1ZTt0aGlzLnNpZ249c2lnbjt0aGlzLmlzU21hbGw9ZmFsc2V9QmlnSW50ZWdlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gU21hbGxJbnRlZ2VyKHZhbHVlKXt0aGlzLnZhbHVlPXZhbHVlO3RoaXMuc2lnbj12YWx1ZTwwO3RoaXMuaXNTbWFsbD10cnVlfVNtYWxsSW50ZWdlci5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gTmF0aXZlQmlnSW50KHZhbHVlKXt0aGlzLnZhbHVlPXZhbHVlfU5hdGl2ZUJpZ0ludC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShJbnRlZ2VyLnByb3RvdHlwZSk7ZnVuY3Rpb24gaXNQcmVjaXNlKG4pe3JldHVybi1NQVhfSU5UPG4mJm48TUFYX0lOVH1mdW5jdGlvbiBzbWFsbFRvQXJyYXkobil7aWYobjwxZTcpcmV0dXJuW25dO2lmKG48MWUxNClyZXR1cm5bbiUxZTcsTWF0aC5mbG9vcihuLzFlNyldO3JldHVybltuJTFlNyxNYXRoLmZsb29yKG4vMWU3KSUxZTcsTWF0aC5mbG9vcihuLzFlMTQpXX1mdW5jdGlvbiBhcnJheVRvU21hbGwoYXJyKXt0cmltKGFycik7dmFyIGxlbmd0aD1hcnIubGVuZ3RoO2lmKGxlbmd0aDw0JiZjb21wYXJlQWJzKGFycixNQVhfSU5UX0FSUik8MCl7c3dpdGNoKGxlbmd0aCl7Y2FzZSAwOnJldHVybiAwO2Nhc2UgMTpyZXR1cm4gYXJyWzBdO2Nhc2UgMjpyZXR1cm4gYXJyWzBdK2FyclsxXSpCQVNFO2RlZmF1bHQ6cmV0dXJuIGFyclswXSsoYXJyWzFdK2FyclsyXSpCQVNFKSpCQVNFfX1yZXR1cm4gYXJyfWZ1bmN0aW9uIHRyaW0odil7dmFyIGk9di5sZW5ndGg7d2hpbGUodlstLWldPT09MCk7di5sZW5ndGg9aSsxfWZ1bmN0aW9uIGNyZWF0ZUFycmF5KGxlbmd0aCl7dmFyIHg9bmV3IEFycmF5KGxlbmd0aCk7dmFyIGk9LTE7d2hpbGUoKytpPGxlbmd0aCl7eFtpXT0wfXJldHVybiB4fWZ1bmN0aW9uIHRydW5jYXRlKG4pe2lmKG4+MClyZXR1cm4gTWF0aC5mbG9vcihuKTtyZXR1cm4gTWF0aC5jZWlsKG4pfWZ1bmN0aW9uIGFkZChhLGIpe3ZhciBsX2E9YS5sZW5ndGgsbF9iPWIubGVuZ3RoLHI9bmV3IEFycmF5KGxfYSksY2Fycnk9MCxiYXNlPUJBU0Usc3VtLGk7Zm9yKGk9MDtpPGxfYjtpKyspe3N1bT1hW2ldK2JbaV0rY2Fycnk7Y2Fycnk9c3VtPj1iYXNlPzE6MDtyW2ldPXN1bS1jYXJyeSpiYXNlfXdoaWxlKGk8bF9hKXtzdW09YVtpXStjYXJyeTtjYXJyeT1zdW09PT1iYXNlPzE6MDtyW2krK109c3VtLWNhcnJ5KmJhc2V9aWYoY2Fycnk+MClyLnB1c2goY2FycnkpO3JldHVybiByfWZ1bmN0aW9uIGFkZEFueShhLGIpe2lmKGEubGVuZ3RoPj1iLmxlbmd0aClyZXR1cm4gYWRkKGEsYik7cmV0dXJuIGFkZChiLGEpfWZ1bmN0aW9uIGFkZFNtYWxsKGEsY2Fycnkpe3ZhciBsPWEubGVuZ3RoLHI9bmV3IEFycmF5KGwpLGJhc2U9QkFTRSxzdW0saTtmb3IoaT0wO2k8bDtpKyspe3N1bT1hW2ldLWJhc2UrY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihzdW0vYmFzZSk7cltpXT1zdW0tY2FycnkqYmFzZTtjYXJyeSs9MX13aGlsZShjYXJyeT4wKXtyW2krK109Y2FycnklYmFzZTtjYXJyeT1NYXRoLmZsb29yKGNhcnJ5L2Jhc2UpfXJldHVybiByfUJpZ0ludGVnZXIucHJvdG90eXBlLmFkZD1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO2lmKHRoaXMuc2lnbiE9PW4uc2lnbil7cmV0dXJuIHRoaXMuc3VidHJhY3Qobi5uZWdhdGUoKSl9dmFyIGE9dGhpcy52YWx1ZSxiPW4udmFsdWU7aWYobi5pc1NtYWxsKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoYWRkU21hbGwoYSxNYXRoLmFicyhiKSksdGhpcy5zaWduKX1yZXR1cm4gbmV3IEJpZ0ludGVnZXIoYWRkQW55KGEsYiksdGhpcy5zaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUucGx1cz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGQ7U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KTt2YXIgYT10aGlzLnZhbHVlO2lmKGE8MCE9PW4uc2lnbil7cmV0dXJuIHRoaXMuc3VidHJhY3Qobi5uZWdhdGUoKSl9dmFyIGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe2lmKGlzUHJlY2lzZShhK2IpKXJldHVybiBuZXcgU21hbGxJbnRlZ2VyKGErYik7Yj1zbWFsbFRvQXJyYXkoTWF0aC5hYnMoYikpfXJldHVybiBuZXcgQmlnSW50ZWdlcihhZGRTbWFsbChiLE1hdGguYWJzKGEpKSxhPDApfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnBsdXM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5hZGQ7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZStwYXJzZVZhbHVlKHYpLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5wbHVzPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUuYWRkO2Z1bmN0aW9uIHN1YnRyYWN0KGEsYil7dmFyIGFfbD1hLmxlbmd0aCxiX2w9Yi5sZW5ndGgscj1uZXcgQXJyYXkoYV9sKSxib3Jyb3c9MCxiYXNlPUJBU0UsaSxkaWZmZXJlbmNlO2ZvcihpPTA7aTxiX2w7aSsrKXtkaWZmZXJlbmNlPWFbaV0tYm9ycm93LWJbaV07aWYoZGlmZmVyZW5jZTwwKXtkaWZmZXJlbmNlKz1iYXNlO2JvcnJvdz0xfWVsc2UgYm9ycm93PTA7cltpXT1kaWZmZXJlbmNlfWZvcihpPWJfbDtpPGFfbDtpKyspe2RpZmZlcmVuY2U9YVtpXS1ib3Jyb3c7aWYoZGlmZmVyZW5jZTwwKWRpZmZlcmVuY2UrPWJhc2U7ZWxzZXtyW2krK109ZGlmZmVyZW5jZTticmVha31yW2ldPWRpZmZlcmVuY2V9Zm9yKDtpPGFfbDtpKyspe3JbaV09YVtpXX10cmltKHIpO3JldHVybiByfWZ1bmN0aW9uIHN1YnRyYWN0QW55KGEsYixzaWduKXt2YXIgdmFsdWU7aWYoY29tcGFyZUFicyhhLGIpPj0wKXt2YWx1ZT1zdWJ0cmFjdChhLGIpfWVsc2V7dmFsdWU9c3VidHJhY3QoYixhKTtzaWduPSFzaWdufXZhbHVlPWFycmF5VG9TbWFsbCh2YWx1ZSk7aWYodHlwZW9mIHZhbHVlPT09Im51bWJlciIpe2lmKHNpZ24pdmFsdWU9LXZhbHVlO3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKHZhbHVlKX1yZXR1cm4gbmV3IEJpZ0ludGVnZXIodmFsdWUsc2lnbil9ZnVuY3Rpb24gc3VidHJhY3RTbWFsbChhLGIsc2lnbil7dmFyIGw9YS5sZW5ndGgscj1uZXcgQXJyYXkobCksY2Fycnk9LWIsYmFzZT1CQVNFLGksZGlmZmVyZW5jZTtmb3IoaT0wO2k8bDtpKyspe2RpZmZlcmVuY2U9YVtpXStjYXJyeTtjYXJyeT1NYXRoLmZsb29yKGRpZmZlcmVuY2UvYmFzZSk7ZGlmZmVyZW5jZSU9YmFzZTtyW2ldPWRpZmZlcmVuY2U8MD9kaWZmZXJlbmNlK2Jhc2U6ZGlmZmVyZW5jZX1yPWFycmF5VG9TbWFsbChyKTtpZih0eXBlb2Ygcj09PSJudW1iZXIiKXtpZihzaWduKXI9LXI7cmV0dXJuIG5ldyBTbWFsbEludGVnZXIocil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHIsc2lnbil9QmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3Q9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KTtpZih0aGlzLnNpZ24hPT1uLnNpZ24pe3JldHVybiB0aGlzLmFkZChuLm5lZ2F0ZSgpKX12YXIgYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZihuLmlzU21hbGwpcmV0dXJuIHN1YnRyYWN0U21hbGwoYSxNYXRoLmFicyhiKSx0aGlzLnNpZ24pO3JldHVybiBzdWJ0cmFjdEFueShhLGIsdGhpcy5zaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUubWludXM9QmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3Q7U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5zdWJ0cmFjdD1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO3ZhciBhPXRoaXMudmFsdWU7aWYoYTwwIT09bi5zaWduKXtyZXR1cm4gdGhpcy5hZGQobi5uZWdhdGUoKSl9dmFyIGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKGEtYil9cmV0dXJuIHN1YnRyYWN0U21hbGwoYixNYXRoLmFicyhhKSxhPj0wKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5taW51cz1TbWFsbEludGVnZXIucHJvdG90eXBlLnN1YnRyYWN0O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc3VidHJhY3Q9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZS1wYXJzZVZhbHVlKHYpLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5taW51cz1OYXRpdmVCaWdJbnQucHJvdG90eXBlLnN1YnRyYWN0O0JpZ0ludGVnZXIucHJvdG90eXBlLm5lZ2F0ZT1mdW5jdGlvbigpe3JldHVybiBuZXcgQmlnSW50ZWdlcih0aGlzLnZhbHVlLCF0aGlzLnNpZ24pfTtTbWFsbEludGVnZXIucHJvdG90eXBlLm5lZ2F0ZT1mdW5jdGlvbigpe3ZhciBzaWduPXRoaXMuc2lnbjt2YXIgc21hbGw9bmV3IFNtYWxsSW50ZWdlcigtdGhpcy52YWx1ZSk7c21hbGwuc2lnbj0hc2lnbjtyZXR1cm4gc21hbGx9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubmVnYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoLXRoaXMudmFsdWUpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hYnM9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIodGhpcy52YWx1ZSxmYWxzZSl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuYWJzPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBTbWFsbEludGVnZXIoTWF0aC5hYnModGhpcy52YWx1ZSkpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmFicz1mdW5jdGlvbigpe3JldHVybiBuZXcgTmF0aXZlQmlnSW50KHRoaXMudmFsdWU+PTA/dGhpcy52YWx1ZTotdGhpcy52YWx1ZSl9O2Z1bmN0aW9uIG11bHRpcGx5TG9uZyhhLGIpe3ZhciBhX2w9YS5sZW5ndGgsYl9sPWIubGVuZ3RoLGw9YV9sK2JfbCxyPWNyZWF0ZUFycmF5KGwpLGJhc2U9QkFTRSxwcm9kdWN0LGNhcnJ5LGksYV9pLGJfajtmb3IoaT0wO2k8YV9sOysraSl7YV9pPWFbaV07Zm9yKHZhciBqPTA7ajxiX2w7KytqKXtiX2o9YltqXTtwcm9kdWN0PWFfaSpiX2orcltpK2pdO2NhcnJ5PU1hdGguZmxvb3IocHJvZHVjdC9iYXNlKTtyW2kral09cHJvZHVjdC1jYXJyeSpiYXNlO3JbaStqKzFdKz1jYXJyeX19dHJpbShyKTtyZXR1cm4gcn1mdW5jdGlvbiBtdWx0aXBseVNtYWxsKGEsYil7dmFyIGw9YS5sZW5ndGgscj1uZXcgQXJyYXkobCksYmFzZT1CQVNFLGNhcnJ5PTAscHJvZHVjdCxpO2ZvcihpPTA7aTxsO2krKyl7cHJvZHVjdD1hW2ldKmIrY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihwcm9kdWN0L2Jhc2UpO3JbaV09cHJvZHVjdC1jYXJyeSpiYXNlfXdoaWxlKGNhcnJ5PjApe3JbaSsrXT1jYXJyeSViYXNlO2NhcnJ5PU1hdGguZmxvb3IoY2FycnkvYmFzZSl9cmV0dXJuIHJ9ZnVuY3Rpb24gc2hpZnRMZWZ0KHgsbil7dmFyIHI9W107d2hpbGUobi0tID4wKXIucHVzaCgwKTtyZXR1cm4gci5jb25jYXQoeCl9ZnVuY3Rpb24gbXVsdGlwbHlLYXJhdHN1YmEoeCx5KXt2YXIgbj1NYXRoLm1heCh4Lmxlbmd0aCx5Lmxlbmd0aCk7aWYobjw9MzApcmV0dXJuIG11bHRpcGx5TG9uZyh4LHkpO249TWF0aC5jZWlsKG4vMik7dmFyIGI9eC5zbGljZShuKSxhPXguc2xpY2UoMCxuKSxkPXkuc2xpY2UobiksYz15LnNsaWNlKDAsbik7dmFyIGFjPW11bHRpcGx5S2FyYXRzdWJhKGEsYyksYmQ9bXVsdGlwbHlLYXJhdHN1YmEoYixkKSxhYmNkPW11bHRpcGx5S2FyYXRzdWJhKGFkZEFueShhLGIpLGFkZEFueShjLGQpKTt2YXIgcHJvZHVjdD1hZGRBbnkoYWRkQW55KGFjLHNoaWZ0TGVmdChzdWJ0cmFjdChzdWJ0cmFjdChhYmNkLGFjKSxiZCksbikpLHNoaWZ0TGVmdChiZCwyKm4pKTt0cmltKHByb2R1Y3QpO3JldHVybiBwcm9kdWN0fWZ1bmN0aW9uIHVzZUthcmF0c3ViYShsMSxsMil7cmV0dXJuLS4wMTIqbDEtLjAxMipsMisxNWUtNipsMSpsMj4wfUJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5PWZ1bmN0aW9uKHYpe3ZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZSxzaWduPXRoaXMuc2lnbiE9PW4uc2lnbixhYnM7aWYobi5pc1NtYWxsKXtpZihiPT09MClyZXR1cm4gSW50ZWdlclswXTtpZihiPT09MSlyZXR1cm4gdGhpcztpZihiPT09LTEpcmV0dXJuIHRoaXMubmVnYXRlKCk7YWJzPU1hdGguYWJzKGIpO2lmKGFiczxCQVNFKXtyZXR1cm4gbmV3IEJpZ0ludGVnZXIobXVsdGlwbHlTbWFsbChhLGFicyksc2lnbil9Yj1zbWFsbFRvQXJyYXkoYWJzKX1pZih1c2VLYXJhdHN1YmEoYS5sZW5ndGgsYi5sZW5ndGgpKXJldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseUthcmF0c3ViYShhLGIpLHNpZ24pO3JldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseUxvbmcoYSxiKSxzaWduKX07QmlnSW50ZWdlci5wcm90b3R5cGUudGltZXM9QmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHk7ZnVuY3Rpb24gbXVsdGlwbHlTbWFsbEFuZEFycmF5KGEsYixzaWduKXtpZihhPEJBU0Upe3JldHVybiBuZXcgQmlnSW50ZWdlcihtdWx0aXBseVNtYWxsKGIsYSksc2lnbil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKG11bHRpcGx5TG9uZyhiLHNtYWxsVG9BcnJheShhKSksc2lnbil9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5fbXVsdGlwbHlCeVNtYWxsPWZ1bmN0aW9uKGEpe2lmKGlzUHJlY2lzZShhLnZhbHVlKnRoaXMudmFsdWUpKXtyZXR1cm4gbmV3IFNtYWxsSW50ZWdlcihhLnZhbHVlKnRoaXMudmFsdWUpfXJldHVybiBtdWx0aXBseVNtYWxsQW5kQXJyYXkoTWF0aC5hYnMoYS52YWx1ZSksc21hbGxUb0FycmF5KE1hdGguYWJzKHRoaXMudmFsdWUpKSx0aGlzLnNpZ24hPT1hLnNpZ24pfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5fbXVsdGlwbHlCeVNtYWxsPWZ1bmN0aW9uKGEpe2lmKGEudmFsdWU9PT0wKXJldHVybiBJbnRlZ2VyWzBdO2lmKGEudmFsdWU9PT0xKXJldHVybiB0aGlzO2lmKGEudmFsdWU9PT0tMSlyZXR1cm4gdGhpcy5uZWdhdGUoKTtyZXR1cm4gbXVsdGlwbHlTbWFsbEFuZEFycmF5KE1hdGguYWJzKGEudmFsdWUpLHRoaXMudmFsdWUsdGhpcy5zaWduIT09YS5zaWduKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbih2KXtyZXR1cm4gcGFyc2VWYWx1ZSh2KS5fbXVsdGlwbHlCeVNtYWxsKHRoaXMpfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnRpbWVzPVNtYWxsSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHk7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5tdWx0aXBseT1mdW5jdGlvbih2KXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlKnBhcnNlVmFsdWUodikudmFsdWUpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLnRpbWVzPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubXVsdGlwbHk7ZnVuY3Rpb24gc3F1YXJlKGEpe3ZhciBsPWEubGVuZ3RoLHI9Y3JlYXRlQXJyYXkobCtsKSxiYXNlPUJBU0UscHJvZHVjdCxjYXJyeSxpLGFfaSxhX2o7Zm9yKGk9MDtpPGw7aSsrKXthX2k9YVtpXTtjYXJyeT0wLWFfaSphX2k7Zm9yKHZhciBqPWk7ajxsO2orKyl7YV9qPWFbal07cHJvZHVjdD0yKihhX2kqYV9qKStyW2kral0rY2Fycnk7Y2Fycnk9TWF0aC5mbG9vcihwcm9kdWN0L2Jhc2UpO3JbaStqXT1wcm9kdWN0LWNhcnJ5KmJhc2V9cltpK2xdPWNhcnJ5fXRyaW0ocik7cmV0dXJuIHJ9QmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHNxdWFyZSh0aGlzLnZhbHVlKSxmYWxzZSl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlPWZ1bmN0aW9uKCl7dmFyIHZhbHVlPXRoaXMudmFsdWUqdGhpcy52YWx1ZTtpZihpc1ByZWNpc2UodmFsdWUpKXJldHVybiBuZXcgU21hbGxJbnRlZ2VyKHZhbHVlKTtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoc3F1YXJlKHNtYWxsVG9BcnJheShNYXRoLmFicyh0aGlzLnZhbHVlKSkpLGZhbHNlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5zcXVhcmU9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZSp0aGlzLnZhbHVlKX07ZnVuY3Rpb24gZGl2TW9kMShhLGIpe3ZhciBhX2w9YS5sZW5ndGgsYl9sPWIubGVuZ3RoLGJhc2U9QkFTRSxyZXN1bHQ9Y3JlYXRlQXJyYXkoYi5sZW5ndGgpLGRpdmlzb3JNb3N0U2lnbmlmaWNhbnREaWdpdD1iW2JfbC0xXSxsYW1iZGE9TWF0aC5jZWlsKGJhc2UvKDIqZGl2aXNvck1vc3RTaWduaWZpY2FudERpZ2l0KSkscmVtYWluZGVyPW11bHRpcGx5U21hbGwoYSxsYW1iZGEpLGRpdmlzb3I9bXVsdGlwbHlTbWFsbChiLGxhbWJkYSkscXVvdGllbnREaWdpdCxzaGlmdCxjYXJyeSxib3Jyb3csaSxsLHE7aWYocmVtYWluZGVyLmxlbmd0aDw9YV9sKXJlbWFpbmRlci5wdXNoKDApO2Rpdmlzb3IucHVzaCgwKTtkaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQ9ZGl2aXNvcltiX2wtMV07Zm9yKHNoaWZ0PWFfbC1iX2w7c2hpZnQ+PTA7c2hpZnQtLSl7cXVvdGllbnREaWdpdD1iYXNlLTE7aWYocmVtYWluZGVyW3NoaWZ0K2JfbF0hPT1kaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQpe3F1b3RpZW50RGlnaXQ9TWF0aC5mbG9vcigocmVtYWluZGVyW3NoaWZ0K2JfbF0qYmFzZStyZW1haW5kZXJbc2hpZnQrYl9sLTFdKS9kaXZpc29yTW9zdFNpZ25pZmljYW50RGlnaXQpfWNhcnJ5PTA7Ym9ycm93PTA7bD1kaXZpc29yLmxlbmd0aDtmb3IoaT0wO2k8bDtpKyspe2NhcnJ5Kz1xdW90aWVudERpZ2l0KmRpdmlzb3JbaV07cT1NYXRoLmZsb29yKGNhcnJ5L2Jhc2UpO2JvcnJvdys9cmVtYWluZGVyW3NoaWZ0K2ldLShjYXJyeS1xKmJhc2UpO2NhcnJ5PXE7aWYoYm9ycm93PDApe3JlbWFpbmRlcltzaGlmdCtpXT1ib3Jyb3crYmFzZTtib3Jyb3c9LTF9ZWxzZXtyZW1haW5kZXJbc2hpZnQraV09Ym9ycm93O2JvcnJvdz0wfX13aGlsZShib3Jyb3chPT0wKXtxdW90aWVudERpZ2l0LT0xO2NhcnJ5PTA7Zm9yKGk9MDtpPGw7aSsrKXtjYXJyeSs9cmVtYWluZGVyW3NoaWZ0K2ldLWJhc2UrZGl2aXNvcltpXTtpZihjYXJyeTwwKXtyZW1haW5kZXJbc2hpZnQraV09Y2FycnkrYmFzZTtjYXJyeT0wfWVsc2V7cmVtYWluZGVyW3NoaWZ0K2ldPWNhcnJ5O2NhcnJ5PTF9fWJvcnJvdys9Y2Fycnl9cmVzdWx0W3NoaWZ0XT1xdW90aWVudERpZ2l0fXJlbWFpbmRlcj1kaXZNb2RTbWFsbChyZW1haW5kZXIsbGFtYmRhKVswXTtyZXR1cm5bYXJyYXlUb1NtYWxsKHJlc3VsdCksYXJyYXlUb1NtYWxsKHJlbWFpbmRlcildfWZ1bmN0aW9uIGRpdk1vZDIoYSxiKXt2YXIgYV9sPWEubGVuZ3RoLGJfbD1iLmxlbmd0aCxyZXN1bHQ9W10scGFydD1bXSxiYXNlPUJBU0UsZ3Vlc3MseGxlbixoaWdoeCxoaWdoeSxjaGVjazt3aGlsZShhX2wpe3BhcnQudW5zaGlmdChhWy0tYV9sXSk7dHJpbShwYXJ0KTtpZihjb21wYXJlQWJzKHBhcnQsYik8MCl7cmVzdWx0LnB1c2goMCk7Y29udGludWV9eGxlbj1wYXJ0Lmxlbmd0aDtoaWdoeD1wYXJ0W3hsZW4tMV0qYmFzZStwYXJ0W3hsZW4tMl07aGlnaHk9YltiX2wtMV0qYmFzZStiW2JfbC0yXTtpZih4bGVuPmJfbCl7aGlnaHg9KGhpZ2h4KzEpKmJhc2V9Z3Vlc3M9TWF0aC5jZWlsKGhpZ2h4L2hpZ2h5KTtkb3tjaGVjaz1tdWx0aXBseVNtYWxsKGIsZ3Vlc3MpO2lmKGNvbXBhcmVBYnMoY2hlY2sscGFydCk8PTApYnJlYWs7Z3Vlc3MtLX13aGlsZShndWVzcyk7cmVzdWx0LnB1c2goZ3Vlc3MpO3BhcnQ9c3VidHJhY3QocGFydCxjaGVjayl9cmVzdWx0LnJldmVyc2UoKTtyZXR1cm5bYXJyYXlUb1NtYWxsKHJlc3VsdCksYXJyYXlUb1NtYWxsKHBhcnQpXX1mdW5jdGlvbiBkaXZNb2RTbWFsbCh2YWx1ZSxsYW1iZGEpe3ZhciBsZW5ndGg9dmFsdWUubGVuZ3RoLHF1b3RpZW50PWNyZWF0ZUFycmF5KGxlbmd0aCksYmFzZT1CQVNFLGkscSxyZW1haW5kZXIsZGl2aXNvcjtyZW1haW5kZXI9MDtmb3IoaT1sZW5ndGgtMTtpPj0wOy0taSl7ZGl2aXNvcj1yZW1haW5kZXIqYmFzZSt2YWx1ZVtpXTtxPXRydW5jYXRlKGRpdmlzb3IvbGFtYmRhKTtyZW1haW5kZXI9ZGl2aXNvci1xKmxhbWJkYTtxdW90aWVudFtpXT1xfDB9cmV0dXJuW3F1b3RpZW50LHJlbWFpbmRlcnwwXX1mdW5jdGlvbiBkaXZNb2RBbnkoc2VsZix2KXt2YXIgdmFsdWUsbj1wYXJzZVZhbHVlKHYpO2lmKHN1cHBvcnRzTmF0aXZlQmlnSW50KXtyZXR1cm5bbmV3IE5hdGl2ZUJpZ0ludChzZWxmLnZhbHVlL24udmFsdWUpLG5ldyBOYXRpdmVCaWdJbnQoc2VsZi52YWx1ZSVuLnZhbHVlKV19dmFyIGE9c2VsZi52YWx1ZSxiPW4udmFsdWU7dmFyIHF1b3RpZW50O2lmKGI9PT0wKXRocm93IG5ldyBFcnJvcigiQ2Fubm90IGRpdmlkZSBieSB6ZXJvIik7aWYoc2VsZi5pc1NtYWxsKXtpZihuLmlzU21hbGwpe3JldHVybltuZXcgU21hbGxJbnRlZ2VyKHRydW5jYXRlKGEvYikpLG5ldyBTbWFsbEludGVnZXIoYSViKV19cmV0dXJuW0ludGVnZXJbMF0sc2VsZl19aWYobi5pc1NtYWxsKXtpZihiPT09MSlyZXR1cm5bc2VsZixJbnRlZ2VyWzBdXTtpZihiPT0tMSlyZXR1cm5bc2VsZi5uZWdhdGUoKSxJbnRlZ2VyWzBdXTt2YXIgYWJzPU1hdGguYWJzKGIpO2lmKGFiczxCQVNFKXt2YWx1ZT1kaXZNb2RTbWFsbChhLGFicyk7cXVvdGllbnQ9YXJyYXlUb1NtYWxsKHZhbHVlWzBdKTt2YXIgcmVtYWluZGVyPXZhbHVlWzFdO2lmKHNlbGYuc2lnbilyZW1haW5kZXI9LXJlbWFpbmRlcjtpZih0eXBlb2YgcXVvdGllbnQ9PT0ibnVtYmVyIil7aWYoc2VsZi5zaWduIT09bi5zaWduKXF1b3RpZW50PS1xdW90aWVudDtyZXR1cm5bbmV3IFNtYWxsSW50ZWdlcihxdW90aWVudCksbmV3IFNtYWxsSW50ZWdlcihyZW1haW5kZXIpXX1yZXR1cm5bbmV3IEJpZ0ludGVnZXIocXVvdGllbnQsc2VsZi5zaWduIT09bi5zaWduKSxuZXcgU21hbGxJbnRlZ2VyKHJlbWFpbmRlcildfWI9c21hbGxUb0FycmF5KGFicyl9dmFyIGNvbXBhcmlzb249Y29tcGFyZUFicyhhLGIpO2lmKGNvbXBhcmlzb249PT0tMSlyZXR1cm5bSW50ZWdlclswXSxzZWxmXTtpZihjb21wYXJpc29uPT09MClyZXR1cm5bSW50ZWdlcltzZWxmLnNpZ249PT1uLnNpZ24/MTotMV0sSW50ZWdlclswXV07aWYoYS5sZW5ndGgrYi5sZW5ndGg8PTIwMCl2YWx1ZT1kaXZNb2QxKGEsYik7ZWxzZSB2YWx1ZT1kaXZNb2QyKGEsYik7cXVvdGllbnQ9dmFsdWVbMF07dmFyIHFTaWduPXNlbGYuc2lnbiE9PW4uc2lnbixtb2Q9dmFsdWVbMV0sbVNpZ249c2VsZi5zaWduO2lmKHR5cGVvZiBxdW90aWVudD09PSJudW1iZXIiKXtpZihxU2lnbilxdW90aWVudD0tcXVvdGllbnQ7cXVvdGllbnQ9bmV3IFNtYWxsSW50ZWdlcihxdW90aWVudCl9ZWxzZSBxdW90aWVudD1uZXcgQmlnSW50ZWdlcihxdW90aWVudCxxU2lnbik7aWYodHlwZW9mIG1vZD09PSJudW1iZXIiKXtpZihtU2lnbiltb2Q9LW1vZDttb2Q9bmV3IFNtYWxsSW50ZWdlcihtb2QpfWVsc2UgbW9kPW5ldyBCaWdJbnRlZ2VyKG1vZCxtU2lnbik7cmV0dXJuW3F1b3RpZW50LG1vZF19QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2bW9kPWZ1bmN0aW9uKHYpe3ZhciByZXN1bHQ9ZGl2TW9kQW55KHRoaXMsdik7cmV0dXJue3F1b3RpZW50OnJlc3VsdFswXSxyZW1haW5kZXI6cmVzdWx0WzFdfX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5kaXZtb2Q9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5kaXZtb2Q9QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2bW9kO0JpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZT1mdW5jdGlvbih2KXtyZXR1cm4gZGl2TW9kQW55KHRoaXMsdilbMF19O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUub3Zlcj1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmRpdmlkZT1mdW5jdGlvbih2KXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlL3BhcnNlVmFsdWUodikudmFsdWUpfTtTbWFsbEludGVnZXIucHJvdG90eXBlLm92ZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGU9QmlnSW50ZWdlci5wcm90b3R5cGUub3Zlcj1CaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGU7QmlnSW50ZWdlci5wcm90b3R5cGUubW9kPWZ1bmN0aW9uKHYpe3JldHVybiBkaXZNb2RBbnkodGhpcyx2KVsxXX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5tb2Q9TmF0aXZlQmlnSW50LnByb3RvdHlwZS5yZW1haW5kZXI9ZnVuY3Rpb24odil7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQodGhpcy52YWx1ZSVwYXJzZVZhbHVlKHYpLnZhbHVlKX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5yZW1haW5kZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5tb2Q9QmlnSW50ZWdlci5wcm90b3R5cGUucmVtYWluZGVyPUJpZ0ludGVnZXIucHJvdG90eXBlLm1vZDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5wb3c9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KSxhPXRoaXMudmFsdWUsYj1uLnZhbHVlLHZhbHVlLHgseTtpZihiPT09MClyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09MClyZXR1cm4gSW50ZWdlclswXTtpZihhPT09MSlyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09LTEpcmV0dXJuIG4uaXNFdmVuKCk/SW50ZWdlclsxXTpJbnRlZ2VyWy0xXTtpZihuLnNpZ24pe3JldHVybiBJbnRlZ2VyWzBdfWlmKCFuLmlzU21hbGwpdGhyb3cgbmV3IEVycm9yKCJUaGUgZXhwb25lbnQgIituLnRvU3RyaW5nKCkrIiBpcyB0b28gbGFyZ2UuIik7aWYodGhpcy5pc1NtYWxsKXtpZihpc1ByZWNpc2UodmFsdWU9TWF0aC5wb3coYSxiKSkpcmV0dXJuIG5ldyBTbWFsbEludGVnZXIodHJ1bmNhdGUodmFsdWUpKX14PXRoaXM7eT1JbnRlZ2VyWzFdO3doaWxlKHRydWUpe2lmKGImMT09PTEpe3k9eS50aW1lcyh4KTstLWJ9aWYoYj09PTApYnJlYWs7Yi89Mjt4PXguc3F1YXJlKCl9cmV0dXJuIHl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUucG93PUJpZ0ludGVnZXIucHJvdG90eXBlLnBvdztOYXRpdmVCaWdJbnQucHJvdG90eXBlLnBvdz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpO3ZhciBhPXRoaXMudmFsdWUsYj1uLnZhbHVlO3ZhciBfMD1CaWdJbnQoMCksXzE9QmlnSW50KDEpLF8yPUJpZ0ludCgyKTtpZihiPT09XzApcmV0dXJuIEludGVnZXJbMV07aWYoYT09PV8wKXJldHVybiBJbnRlZ2VyWzBdO2lmKGE9PT1fMSlyZXR1cm4gSW50ZWdlclsxXTtpZihhPT09QmlnSW50KC0xKSlyZXR1cm4gbi5pc0V2ZW4oKT9JbnRlZ2VyWzFdOkludGVnZXJbLTFdO2lmKG4uaXNOZWdhdGl2ZSgpKXJldHVybiBuZXcgTmF0aXZlQmlnSW50KF8wKTt2YXIgeD10aGlzO3ZhciB5PUludGVnZXJbMV07d2hpbGUodHJ1ZSl7aWYoKGImXzEpPT09XzEpe3k9eS50aW1lcyh4KTstLWJ9aWYoYj09PV8wKWJyZWFrO2IvPV8yO3g9eC5zcXVhcmUoKX1yZXR1cm4geX07QmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93PWZ1bmN0aW9uKGV4cCxtb2Qpe2V4cD1wYXJzZVZhbHVlKGV4cCk7bW9kPXBhcnNlVmFsdWUobW9kKTtpZihtb2QuaXNaZXJvKCkpdGhyb3cgbmV3IEVycm9yKCJDYW5ub3QgdGFrZSBtb2RQb3cgd2l0aCBtb2R1bHVzIDAiKTt2YXIgcj1JbnRlZ2VyWzFdLGJhc2U9dGhpcy5tb2QobW9kKTtpZihleHAuaXNOZWdhdGl2ZSgpKXtleHA9ZXhwLm11bHRpcGx5KEludGVnZXJbLTFdKTtiYXNlPWJhc2UubW9kSW52KG1vZCl9d2hpbGUoZXhwLmlzUG9zaXRpdmUoKSl7aWYoYmFzZS5pc1plcm8oKSlyZXR1cm4gSW50ZWdlclswXTtpZihleHAuaXNPZGQoKSlyPXIubXVsdGlwbHkoYmFzZSkubW9kKG1vZCk7ZXhwPWV4cC5kaXZpZGUoMik7YmFzZT1iYXNlLnNxdWFyZSgpLm1vZChtb2QpfXJldHVybiByfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm1vZFBvdz1TbWFsbEludGVnZXIucHJvdG90eXBlLm1vZFBvdz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3c7ZnVuY3Rpb24gY29tcGFyZUFicyhhLGIpe2lmKGEubGVuZ3RoIT09Yi5sZW5ndGgpe3JldHVybiBhLmxlbmd0aD5iLmxlbmd0aD8xOi0xfWZvcih2YXIgaT1hLmxlbmd0aC0xO2k+PTA7aS0tKXtpZihhW2ldIT09YltpXSlyZXR1cm4gYVtpXT5iW2ldPzE6LTF9cmV0dXJuIDB9QmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZUFicz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpLGE9dGhpcy52YWx1ZSxiPW4udmFsdWU7aWYobi5pc1NtYWxsKXJldHVybiAxO3JldHVybiBjb21wYXJlQWJzKGEsYil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZUFicz1mdW5jdGlvbih2KXt2YXIgbj1wYXJzZVZhbHVlKHYpLGE9TWF0aC5hYnModGhpcy52YWx1ZSksYj1uLnZhbHVlO2lmKG4uaXNTbWFsbCl7Yj1NYXRoLmFicyhiKTtyZXR1cm4gYT09PWI/MDphPmI/MTotMX1yZXR1cm4tMX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5jb21wYXJlQWJzPWZ1bmN0aW9uKHYpe3ZhciBhPXRoaXMudmFsdWU7dmFyIGI9cGFyc2VWYWx1ZSh2KS52YWx1ZTthPWE+PTA/YTotYTtiPWI+PTA/YjotYjtyZXR1cm4gYT09PWI/MDphPmI/MTotMX07QmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZT1mdW5jdGlvbih2KXtpZih2PT09SW5maW5pdHkpe3JldHVybi0xfWlmKHY9PT0tSW5maW5pdHkpe3JldHVybiAxfXZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZih0aGlzLnNpZ24hPT1uLnNpZ24pe3JldHVybiBuLnNpZ24/MTotMX1pZihuLmlzU21hbGwpe3JldHVybiB0aGlzLnNpZ24/LTE6MX1yZXR1cm4gY29tcGFyZUFicyhhLGIpKih0aGlzLnNpZ24/LTE6MSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb21wYXJlO1NtYWxsSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZT1mdW5jdGlvbih2KXtpZih2PT09SW5maW5pdHkpe3JldHVybi0xfWlmKHY9PT0tSW5maW5pdHkpe3JldHVybiAxfXZhciBuPXBhcnNlVmFsdWUodiksYT10aGlzLnZhbHVlLGI9bi52YWx1ZTtpZihuLmlzU21hbGwpe3JldHVybiBhPT1iPzA6YT5iPzE6LTF9aWYoYTwwIT09bi5zaWduKXtyZXR1cm4gYTwwPy0xOjF9cmV0dXJuIGE8MD8xOi0xfTtTbWFsbEludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbz1TbWFsbEludGVnZXIucHJvdG90eXBlLmNvbXBhcmU7TmF0aXZlQmlnSW50LnByb3RvdHlwZS5jb21wYXJlPWZ1bmN0aW9uKHYpe2lmKHY9PT1JbmZpbml0eSl7cmV0dXJuLTF9aWYodj09PS1JbmZpbml0eSl7cmV0dXJuIDF9dmFyIGE9dGhpcy52YWx1ZTt2YXIgYj1wYXJzZVZhbHVlKHYpLnZhbHVlO3JldHVybiBhPT09Yj8wOmE+Yj8xOi0xfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmNvbXBhcmVUbz1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmNvbXBhcmU7QmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik9PT0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmVxPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUuZXF1YWxzPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5lcXVhbHM9QmlnSW50ZWdlci5wcm90b3R5cGUuZXE9QmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzO0JpZ0ludGVnZXIucHJvdG90eXBlLm5vdEVxdWFscz1mdW5jdGlvbih2KXtyZXR1cm4gdGhpcy5jb21wYXJlKHYpIT09MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5uZXE9TmF0aXZlQmlnSW50LnByb3RvdHlwZS5ub3RFcXVhbHM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5uZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5ub3RFcXVhbHM9QmlnSW50ZWdlci5wcm90b3R5cGUubmVxPUJpZ0ludGVnZXIucHJvdG90eXBlLm5vdEVxdWFscztCaWdJbnRlZ2VyLnByb3RvdHlwZS5ncmVhdGVyPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik+MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5ndD1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmdyZWF0ZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5ndD1TbWFsbEludGVnZXIucHJvdG90eXBlLmdyZWF0ZXI9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3Q9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3JlYXRlcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXI9ZnVuY3Rpb24odil7cmV0dXJuIHRoaXMuY29tcGFyZSh2KTwwfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmx0PU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVzc2VyPVNtYWxsSW50ZWdlci5wcm90b3R5cGUubHQ9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXI9QmlnSW50ZWdlci5wcm90b3R5cGUubHQ9QmlnSW50ZWdlci5wcm90b3R5cGUubGVzc2VyO0JpZ0ludGVnZXIucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1mdW5jdGlvbih2KXtyZXR1cm4gdGhpcy5jb21wYXJlKHYpPj0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmdlcT1OYXRpdmVCaWdJbnQucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1TbWFsbEludGVnZXIucHJvdG90eXBlLmdlcT1TbWFsbEludGVnZXIucHJvdG90eXBlLmdyZWF0ZXJPckVxdWFscz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5nZXE9QmlnSW50ZWdlci5wcm90b3R5cGUuZ3JlYXRlck9yRXF1YWxzO0JpZ0ludGVnZXIucHJvdG90eXBlLmxlc3Nlck9yRXF1YWxzPWZ1bmN0aW9uKHYpe3JldHVybiB0aGlzLmNvbXBhcmUodik8PTB9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVxPU5hdGl2ZUJpZ0ludC5wcm90b3R5cGUubGVzc2VyT3JFcXVhbHM9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXE9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5sZXNzZXJPckVxdWFscz1CaWdJbnRlZ2VyLnByb3RvdHlwZS5sZXE9QmlnSW50ZWdlci5wcm90b3R5cGUubGVzc2VyT3JFcXVhbHM7QmlnSW50ZWdlci5wcm90b3R5cGUuaXNFdmVuPWZ1bmN0aW9uKCl7cmV0dXJuKHRoaXMudmFsdWVbMF0mMSk9PT0wfTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzRXZlbj1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJjEpPT09MH07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc0V2ZW49ZnVuY3Rpb24oKXtyZXR1cm4odGhpcy52YWx1ZSZCaWdJbnQoMSkpPT09QmlnSW50KDApfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlWzBdJjEpPT09MX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJjEpPT09MX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc09kZD1mdW5jdGlvbigpe3JldHVybih0aGlzLnZhbHVlJkJpZ0ludCgxKSk9PT1CaWdJbnQoMSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLmlzUG9zaXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4hdGhpcy5zaWdufTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzUG9zaXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZT4wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzUG9zaXRpdmU9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc1Bvc2l0aXZlO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzTmVnYXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zaWdufTtTbWFsbEludGVnZXIucHJvdG90eXBlLmlzTmVnYXRpdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZTwwfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzTmVnYXRpdmU9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc05lZ2F0aXZlO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzVW5pdD1mdW5jdGlvbigpe3JldHVybiBmYWxzZX07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5pc1VuaXQ9ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5hYnModGhpcy52YWx1ZSk9PT0xfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzVW5pdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFicygpLnZhbHVlPT09QmlnSW50KDEpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1plcm89ZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2V9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNaZXJvPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmFsdWU9PT0wfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmlzWmVybz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZhbHVlPT09QmlnSW50KDApfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5PWZ1bmN0aW9uKHYpe3ZhciBuPXBhcnNlVmFsdWUodik7aWYobi5pc1plcm8oKSlyZXR1cm4gZmFsc2U7aWYobi5pc1VuaXQoKSlyZXR1cm4gdHJ1ZTtpZihuLmNvbXBhcmVBYnMoMik9PT0wKXJldHVybiB0aGlzLmlzRXZlbigpO3JldHVybiB0aGlzLm1vZChuKS5pc1plcm8oKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5PVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNEaXZpc2libGVCeT1CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0RpdmlzaWJsZUJ5O2Z1bmN0aW9uIGlzQmFzaWNQcmltZSh2KXt2YXIgbj12LmFicygpO2lmKG4uaXNVbml0KCkpcmV0dXJuIGZhbHNlO2lmKG4uZXF1YWxzKDIpfHxuLmVxdWFscygzKXx8bi5lcXVhbHMoNSkpcmV0dXJuIHRydWU7aWYobi5pc0V2ZW4oKXx8bi5pc0RpdmlzaWJsZUJ5KDMpfHxuLmlzRGl2aXNpYmxlQnkoNSkpcmV0dXJuIGZhbHNlO2lmKG4ubGVzc2VyKDQ5KSlyZXR1cm4gdHJ1ZX1mdW5jdGlvbiBtaWxsZXJSYWJpblRlc3QobixhKXt2YXIgblByZXY9bi5wcmV2KCksYj1uUHJldixyPTAsZCx0LGkseDt3aGlsZShiLmlzRXZlbigpKWI9Yi5kaXZpZGUoMikscisrO25leHQ6Zm9yKGk9MDtpPGEubGVuZ3RoO2krKyl7aWYobi5sZXNzZXIoYVtpXSkpY29udGludWU7eD1iaWdJbnQoYVtpXSkubW9kUG93KGIsbik7aWYoeC5pc1VuaXQoKXx8eC5lcXVhbHMoblByZXYpKWNvbnRpbnVlO2ZvcihkPXItMTtkIT0wO2QtLSl7eD14LnNxdWFyZSgpLm1vZChuKTtpZih4LmlzVW5pdCgpKXJldHVybiBmYWxzZTtpZih4LmVxdWFscyhuUHJldikpY29udGludWUgbmV4dH1yZXR1cm4gZmFsc2V9cmV0dXJuIHRydWV9QmlnSW50ZWdlci5wcm90b3R5cGUuaXNQcmltZT1mdW5jdGlvbihzdHJpY3Qpe3ZhciBpc1ByaW1lPWlzQmFzaWNQcmltZSh0aGlzKTtpZihpc1ByaW1lIT09dW5kZWZpbmVkKXJldHVybiBpc1ByaW1lO3ZhciBuPXRoaXMuYWJzKCk7dmFyIGJpdHM9bi5iaXRMZW5ndGgoKTtpZihiaXRzPD02NClyZXR1cm4gbWlsbGVyUmFiaW5UZXN0KG4sWzIsMyw1LDcsMTEsMTMsMTcsMTksMjMsMjksMzEsMzddKTt2YXIgbG9nTj1NYXRoLmxvZygyKSpiaXRzLnRvSlNOdW1iZXIoKTt2YXIgdD1NYXRoLmNlaWwoc3RyaWN0PT09dHJ1ZT8yKk1hdGgucG93KGxvZ04sMik6bG9nTik7Zm9yKHZhciBhPVtdLGk9MDtpPHQ7aSsrKXthLnB1c2goYmlnSW50KGkrMikpfXJldHVybiBtaWxsZXJSYWJpblRlc3QobixhKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5pc1ByaW1lPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNQcmltZT1CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1ByaW1lO0JpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZT1mdW5jdGlvbihpdGVyYXRpb25zKXt2YXIgaXNQcmltZT1pc0Jhc2ljUHJpbWUodGhpcyk7aWYoaXNQcmltZSE9PXVuZGVmaW5lZClyZXR1cm4gaXNQcmltZTt2YXIgbj10aGlzLmFicygpO3ZhciB0PWl0ZXJhdGlvbnM9PT11bmRlZmluZWQ/NTppdGVyYXRpb25zO2Zvcih2YXIgYT1bXSxpPTA7aTx0O2krKyl7YS5wdXNoKGJpZ0ludC5yYW5kQmV0d2VlbigyLG4ubWludXMoMikpKX1yZXR1cm4gbWlsbGVyUmFiaW5UZXN0KG4sYSl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lPVNtYWxsSW50ZWdlci5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lPUJpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnY9ZnVuY3Rpb24obil7dmFyIHQ9YmlnSW50Lnplcm8sbmV3VD1iaWdJbnQub25lLHI9cGFyc2VWYWx1ZShuKSxuZXdSPXRoaXMuYWJzKCkscSxsYXN0VCxsYXN0Ujt3aGlsZSghbmV3Ui5pc1plcm8oKSl7cT1yLmRpdmlkZShuZXdSKTtsYXN0VD10O2xhc3RSPXI7dD1uZXdUO3I9bmV3UjtuZXdUPWxhc3RULnN1YnRyYWN0KHEubXVsdGlwbHkobmV3VCkpO25ld1I9bGFzdFIuc3VidHJhY3QocS5tdWx0aXBseShuZXdSKSl9aWYoIXIuaXNVbml0KCkpdGhyb3cgbmV3IEVycm9yKHRoaXMudG9TdHJpbmcoKSsiIGFuZCAiK24udG9TdHJpbmcoKSsiIGFyZSBub3QgY28tcHJpbWUiKTtpZih0LmNvbXBhcmUoMCk9PT0tMSl7dD10LmFkZChuKX1pZih0aGlzLmlzTmVnYXRpdmUoKSl7cmV0dXJuIHQubmVnYXRlKCl9cmV0dXJuIHR9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubW9kSW52PVNtYWxsSW50ZWdlci5wcm90b3R5cGUubW9kSW52PUJpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIHZhbHVlPXRoaXMudmFsdWU7aWYodGhpcy5zaWduKXtyZXR1cm4gc3VidHJhY3RTbWFsbCh2YWx1ZSwxLHRoaXMuc2lnbil9cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKGFkZFNtYWxsKHZhbHVlLDEpLHRoaXMuc2lnbil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUubmV4dD1mdW5jdGlvbigpe3ZhciB2YWx1ZT10aGlzLnZhbHVlO2lmKHZhbHVlKzE8TUFYX0lOVClyZXR1cm4gbmV3IFNtYWxsSW50ZWdlcih2YWx1ZSsxKTtyZXR1cm4gbmV3IEJpZ0ludGVnZXIoTUFYX0lOVF9BUlIsZmFsc2UpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm5leHQ9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlK0JpZ0ludCgxKSl9O0JpZ0ludGVnZXIucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXt2YXIgdmFsdWU9dGhpcy52YWx1ZTtpZih0aGlzLnNpZ24pe3JldHVybiBuZXcgQmlnSW50ZWdlcihhZGRTbWFsbCh2YWx1ZSwxKSx0cnVlKX1yZXR1cm4gc3VidHJhY3RTbWFsbCh2YWx1ZSwxLHRoaXMuc2lnbil9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUucHJldj1mdW5jdGlvbigpe3ZhciB2YWx1ZT10aGlzLnZhbHVlO2lmKHZhbHVlLTE+LU1BWF9JTlQpcmV0dXJuIG5ldyBTbWFsbEludGVnZXIodmFsdWUtMSk7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKE1BWF9JTlRfQVJSLHRydWUpfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLnByZXY9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh0aGlzLnZhbHVlLUJpZ0ludCgxKSl9O3ZhciBwb3dlcnNPZlR3bz1bMV07d2hpbGUoMipwb3dlcnNPZlR3b1twb3dlcnNPZlR3by5sZW5ndGgtMV08PUJBU0UpcG93ZXJzT2ZUd28ucHVzaCgyKnBvd2Vyc09mVHdvW3Bvd2Vyc09mVHdvLmxlbmd0aC0xXSk7dmFyIHBvd2VyczJMZW5ndGg9cG93ZXJzT2ZUd28ubGVuZ3RoLGhpZ2hlc3RQb3dlcjI9cG93ZXJzT2ZUd29bcG93ZXJzMkxlbmd0aC0xXTtmdW5jdGlvbiBzaGlmdF9pc1NtYWxsKG4pe3JldHVybiBNYXRoLmFicyhuKTw9QkFTRX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdExlZnQ9ZnVuY3Rpb24odil7dmFyIG49cGFyc2VWYWx1ZSh2KS50b0pTTnVtYmVyKCk7aWYoIXNoaWZ0X2lzU21hbGwobikpe3Rocm93IG5ldyBFcnJvcihTdHJpbmcobikrIiBpcyB0b28gbGFyZ2UgZm9yIHNoaWZ0aW5nLiIpfWlmKG48MClyZXR1cm4gdGhpcy5zaGlmdFJpZ2h0KC1uKTt2YXIgcmVzdWx0PXRoaXM7aWYocmVzdWx0LmlzWmVybygpKXJldHVybiByZXN1bHQ7d2hpbGUobj49cG93ZXJzMkxlbmd0aCl7cmVzdWx0PXJlc3VsdC5tdWx0aXBseShoaWdoZXN0UG93ZXIyKTtuLT1wb3dlcnMyTGVuZ3RoLTF9cmV0dXJuIHJlc3VsdC5tdWx0aXBseShwb3dlcnNPZlR3b1tuXSl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc2hpZnRMZWZ0PVNtYWxsSW50ZWdlci5wcm90b3R5cGUuc2hpZnRMZWZ0PUJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0TGVmdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdFJpZ2h0PWZ1bmN0aW9uKHYpe3ZhciByZW1RdW87dmFyIG49cGFyc2VWYWx1ZSh2KS50b0pTTnVtYmVyKCk7aWYoIXNoaWZ0X2lzU21hbGwobikpe3Rocm93IG5ldyBFcnJvcihTdHJpbmcobikrIiBpcyB0b28gbGFyZ2UgZm9yIHNoaWZ0aW5nLiIpfWlmKG48MClyZXR1cm4gdGhpcy5zaGlmdExlZnQoLW4pO3ZhciByZXN1bHQ9dGhpczt3aGlsZShuPj1wb3dlcnMyTGVuZ3RoKXtpZihyZXN1bHQuaXNaZXJvKCl8fHJlc3VsdC5pc05lZ2F0aXZlKCkmJnJlc3VsdC5pc1VuaXQoKSlyZXR1cm4gcmVzdWx0O3JlbVF1bz1kaXZNb2RBbnkocmVzdWx0LGhpZ2hlc3RQb3dlcjIpO3Jlc3VsdD1yZW1RdW9bMV0uaXNOZWdhdGl2ZSgpP3JlbVF1b1swXS5wcmV2KCk6cmVtUXVvWzBdO24tPXBvd2VyczJMZW5ndGgtMX1yZW1RdW89ZGl2TW9kQW55KHJlc3VsdCxwb3dlcnNPZlR3b1tuXSk7cmV0dXJuIHJlbVF1b1sxXS5pc05lZ2F0aXZlKCk/cmVtUXVvWzBdLnByZXYoKTpyZW1RdW9bMF19O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUuc2hpZnRSaWdodD1TbWFsbEludGVnZXIucHJvdG90eXBlLnNoaWZ0UmlnaHQ9QmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRSaWdodDtmdW5jdGlvbiBiaXR3aXNlKHgseSxmbil7eT1wYXJzZVZhbHVlKHkpO3ZhciB4U2lnbj14LmlzTmVnYXRpdmUoKSx5U2lnbj15LmlzTmVnYXRpdmUoKTt2YXIgeFJlbT14U2lnbj94Lm5vdCgpOngseVJlbT15U2lnbj95Lm5vdCgpOnk7dmFyIHhEaWdpdD0wLHlEaWdpdD0wO3ZhciB4RGl2TW9kPW51bGwseURpdk1vZD1udWxsO3ZhciByZXN1bHQ9W107d2hpbGUoIXhSZW0uaXNaZXJvKCl8fCF5UmVtLmlzWmVybygpKXt4RGl2TW9kPWRpdk1vZEFueSh4UmVtLGhpZ2hlc3RQb3dlcjIpO3hEaWdpdD14RGl2TW9kWzFdLnRvSlNOdW1iZXIoKTtpZih4U2lnbil7eERpZ2l0PWhpZ2hlc3RQb3dlcjItMS14RGlnaXR9eURpdk1vZD1kaXZNb2RBbnkoeVJlbSxoaWdoZXN0UG93ZXIyKTt5RGlnaXQ9eURpdk1vZFsxXS50b0pTTnVtYmVyKCk7aWYoeVNpZ24pe3lEaWdpdD1oaWdoZXN0UG93ZXIyLTEteURpZ2l0fXhSZW09eERpdk1vZFswXTt5UmVtPXlEaXZNb2RbMF07cmVzdWx0LnB1c2goZm4oeERpZ2l0LHlEaWdpdCkpfXZhciBzdW09Zm4oeFNpZ24/MTowLHlTaWduPzE6MCkhPT0wP2JpZ0ludCgtMSk6YmlnSW50KDApO2Zvcih2YXIgaT1yZXN1bHQubGVuZ3RoLTE7aT49MDtpLT0xKXtzdW09c3VtLm11bHRpcGx5KGhpZ2hlc3RQb3dlcjIpLmFkZChiaWdJbnQocmVzdWx0W2ldKSl9cmV0dXJuIHN1bX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5ub3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uZWdhdGUoKS5wcmV2KCl9O05hdGl2ZUJpZ0ludC5wcm90b3R5cGUubm90PVNtYWxsSW50ZWdlci5wcm90b3R5cGUubm90PUJpZ0ludGVnZXIucHJvdG90eXBlLm5vdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQ9ZnVuY3Rpb24obil7cmV0dXJuIGJpdHdpc2UodGhpcyxuLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEmYn0pfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLmFuZD1TbWFsbEludGVnZXIucHJvdG90eXBlLmFuZD1CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQ7QmlnSW50ZWdlci5wcm90b3R5cGUub3I9ZnVuY3Rpb24obil7cmV0dXJuIGJpdHdpc2UodGhpcyxuLGZ1bmN0aW9uKGEsYil7cmV0dXJuIGF8Yn0pfTtOYXRpdmVCaWdJbnQucHJvdG90eXBlLm9yPVNtYWxsSW50ZWdlci5wcm90b3R5cGUub3I9QmlnSW50ZWdlci5wcm90b3R5cGUub3I7QmlnSW50ZWdlci5wcm90b3R5cGUueG9yPWZ1bmN0aW9uKG4pe3JldHVybiBiaXR3aXNlKHRoaXMsbixmdW5jdGlvbihhLGIpe3JldHVybiBhXmJ9KX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS54b3I9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS54b3I9QmlnSW50ZWdlci5wcm90b3R5cGUueG9yO3ZhciBMT0JNQVNLX0k9MTw8MzAsTE9CTUFTS19CST0oQkFTRSYtQkFTRSkqKEJBU0UmLUJBU0UpfExPQk1BU0tfSTtmdW5jdGlvbiByb3VnaExPQihuKXt2YXIgdj1uLnZhbHVlLHg9dHlwZW9mIHY9PT0ibnVtYmVyIj92fExPQk1BU0tfSTp0eXBlb2Ygdj09PSJiaWdpbnQiP3Z8QmlnSW50KExPQk1BU0tfSSk6dlswXSt2WzFdKkJBU0V8TE9CTUFTS19CSTtyZXR1cm4geCYteH1mdW5jdGlvbiBpbnRlZ2VyTG9nYXJpdGhtKHZhbHVlLGJhc2Upe2lmKGJhc2UuY29tcGFyZVRvKHZhbHVlKTw9MCl7dmFyIHRtcD1pbnRlZ2VyTG9nYXJpdGhtKHZhbHVlLGJhc2Uuc3F1YXJlKGJhc2UpKTt2YXIgcD10bXAucDt2YXIgZT10bXAuZTt2YXIgdD1wLm11bHRpcGx5KGJhc2UpO3JldHVybiB0LmNvbXBhcmVUbyh2YWx1ZSk8PTA/e3A6dCxlOmUqMisxfTp7cDpwLGU6ZSoyfX1yZXR1cm57cDpiaWdJbnQoMSksZTowfX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGg9ZnVuY3Rpb24oKXt2YXIgbj10aGlzO2lmKG4uY29tcGFyZVRvKGJpZ0ludCgwKSk8MCl7bj1uLm5lZ2F0ZSgpLnN1YnRyYWN0KGJpZ0ludCgxKSl9aWYobi5jb21wYXJlVG8oYmlnSW50KDApKT09PTApe3JldHVybiBiaWdJbnQoMCl9cmV0dXJuIGJpZ0ludChpbnRlZ2VyTG9nYXJpdGhtKG4sYmlnSW50KDIpKS5lKS5hZGQoYmlnSW50KDEpKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS5iaXRMZW5ndGg9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGg9QmlnSW50ZWdlci5wcm90b3R5cGUuYml0TGVuZ3RoO2Z1bmN0aW9uIG1heChhLGIpe2E9cGFyc2VWYWx1ZShhKTtiPXBhcnNlVmFsdWUoYik7cmV0dXJuIGEuZ3JlYXRlcihiKT9hOmJ9ZnVuY3Rpb24gbWluKGEsYil7YT1wYXJzZVZhbHVlKGEpO2I9cGFyc2VWYWx1ZShiKTtyZXR1cm4gYS5sZXNzZXIoYik/YTpifWZ1bmN0aW9uIGdjZChhLGIpe2E9cGFyc2VWYWx1ZShhKS5hYnMoKTtiPXBhcnNlVmFsdWUoYikuYWJzKCk7aWYoYS5lcXVhbHMoYikpcmV0dXJuIGE7aWYoYS5pc1plcm8oKSlyZXR1cm4gYjtpZihiLmlzWmVybygpKXJldHVybiBhO3ZhciBjPUludGVnZXJbMV0sZCx0O3doaWxlKGEuaXNFdmVuKCkmJmIuaXNFdmVuKCkpe2Q9bWluKHJvdWdoTE9CKGEpLHJvdWdoTE9CKGIpKTthPWEuZGl2aWRlKGQpO2I9Yi5kaXZpZGUoZCk7Yz1jLm11bHRpcGx5KGQpfXdoaWxlKGEuaXNFdmVuKCkpe2E9YS5kaXZpZGUocm91Z2hMT0IoYSkpfWRve3doaWxlKGIuaXNFdmVuKCkpe2I9Yi5kaXZpZGUocm91Z2hMT0IoYikpfWlmKGEuZ3JlYXRlcihiKSl7dD1iO2I9YTthPXR9Yj1iLnN1YnRyYWN0KGEpfXdoaWxlKCFiLmlzWmVybygpKTtyZXR1cm4gYy5pc1VuaXQoKT9hOmEubXVsdGlwbHkoYyl9ZnVuY3Rpb24gbGNtKGEsYil7YT1wYXJzZVZhbHVlKGEpLmFicygpO2I9cGFyc2VWYWx1ZShiKS5hYnMoKTtyZXR1cm4gYS5kaXZpZGUoZ2NkKGEsYikpLm11bHRpcGx5KGIpfWZ1bmN0aW9uIHJhbmRCZXR3ZWVuKGEsYil7YT1wYXJzZVZhbHVlKGEpO2I9cGFyc2VWYWx1ZShiKTt2YXIgbG93PW1pbihhLGIpLGhpZ2g9bWF4KGEsYik7dmFyIHJhbmdlPWhpZ2guc3VidHJhY3QobG93KS5hZGQoMSk7aWYocmFuZ2UuaXNTbWFsbClyZXR1cm4gbG93LmFkZChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqcmFuZ2UpKTt2YXIgZGlnaXRzPXRvQmFzZShyYW5nZSxCQVNFKS52YWx1ZTt2YXIgcmVzdWx0PVtdLHJlc3RyaWN0ZWQ9dHJ1ZTtmb3IodmFyIGk9MDtpPGRpZ2l0cy5sZW5ndGg7aSsrKXt2YXIgdG9wPXJlc3RyaWN0ZWQ/ZGlnaXRzW2ldOkJBU0U7dmFyIGRpZ2l0PXRydW5jYXRlKE1hdGgucmFuZG9tKCkqdG9wKTtyZXN1bHQucHVzaChkaWdpdCk7aWYoZGlnaXQ8dG9wKXJlc3RyaWN0ZWQ9ZmFsc2V9cmV0dXJuIGxvdy5hZGQoSW50ZWdlci5mcm9tQXJyYXkocmVzdWx0LEJBU0UsZmFsc2UpKX12YXIgcGFyc2VCYXNlPWZ1bmN0aW9uKHRleHQsYmFzZSxhbHBoYWJldCxjYXNlU2Vuc2l0aXZlKXthbHBoYWJldD1hbHBoYWJldHx8REVGQVVMVF9BTFBIQUJFVDt0ZXh0PVN0cmluZyh0ZXh0KTtpZighY2FzZVNlbnNpdGl2ZSl7dGV4dD10ZXh0LnRvTG93ZXJDYXNlKCk7YWxwaGFiZXQ9YWxwaGFiZXQudG9Mb3dlckNhc2UoKX12YXIgbGVuZ3RoPXRleHQubGVuZ3RoO3ZhciBpO3ZhciBhYnNCYXNlPU1hdGguYWJzKGJhc2UpO3ZhciBhbHBoYWJldFZhbHVlcz17fTtmb3IoaT0wO2k8YWxwaGFiZXQubGVuZ3RoO2krKyl7YWxwaGFiZXRWYWx1ZXNbYWxwaGFiZXRbaV1dPWl9Zm9yKGk9MDtpPGxlbmd0aDtpKyspe3ZhciBjPXRleHRbaV07aWYoYz09PSItIiljb250aW51ZTtpZihjIGluIGFscGhhYmV0VmFsdWVzKXtpZihhbHBoYWJldFZhbHVlc1tjXT49YWJzQmFzZSl7aWYoYz09PSIxIiYmYWJzQmFzZT09PTEpY29udGludWU7dGhyb3cgbmV3IEVycm9yKGMrIiBpcyBub3QgYSB2YWxpZCBkaWdpdCBpbiBiYXNlICIrYmFzZSsiLiIpfX19YmFzZT1wYXJzZVZhbHVlKGJhc2UpO3ZhciBkaWdpdHM9W107dmFyIGlzTmVnYXRpdmU9dGV4dFswXT09PSItIjtmb3IoaT1pc05lZ2F0aXZlPzE6MDtpPHRleHQubGVuZ3RoO2krKyl7dmFyIGM9dGV4dFtpXTtpZihjIGluIGFscGhhYmV0VmFsdWVzKWRpZ2l0cy5wdXNoKHBhcnNlVmFsdWUoYWxwaGFiZXRWYWx1ZXNbY10pKTtlbHNlIGlmKGM9PT0iPCIpe3ZhciBzdGFydD1pO2Rve2krK313aGlsZSh0ZXh0W2ldIT09Ij4iJiZpPHRleHQubGVuZ3RoKTtkaWdpdHMucHVzaChwYXJzZVZhbHVlKHRleHQuc2xpY2Uoc3RhcnQrMSxpKSkpfWVsc2UgdGhyb3cgbmV3IEVycm9yKGMrIiBpcyBub3QgYSB2YWxpZCBjaGFyYWN0ZXIiKX1yZXR1cm4gcGFyc2VCYXNlRnJvbUFycmF5KGRpZ2l0cyxiYXNlLGlzTmVnYXRpdmUpfTtmdW5jdGlvbiBwYXJzZUJhc2VGcm9tQXJyYXkoZGlnaXRzLGJhc2UsaXNOZWdhdGl2ZSl7dmFyIHZhbD1JbnRlZ2VyWzBdLHBvdz1JbnRlZ2VyWzFdLGk7Zm9yKGk9ZGlnaXRzLmxlbmd0aC0xO2k+PTA7aS0tKXt2YWw9dmFsLmFkZChkaWdpdHNbaV0udGltZXMocG93KSk7cG93PXBvdy50aW1lcyhiYXNlKX1yZXR1cm4gaXNOZWdhdGl2ZT92YWwubmVnYXRlKCk6dmFsfWZ1bmN0aW9uIHN0cmluZ2lmeShkaWdpdCxhbHBoYWJldCl7YWxwaGFiZXQ9YWxwaGFiZXR8fERFRkFVTFRfQUxQSEFCRVQ7aWYoZGlnaXQ8YWxwaGFiZXQubGVuZ3RoKXtyZXR1cm4gYWxwaGFiZXRbZGlnaXRdfXJldHVybiI8IitkaWdpdCsiPiJ9ZnVuY3Rpb24gdG9CYXNlKG4sYmFzZSl7YmFzZT1iaWdJbnQoYmFzZSk7aWYoYmFzZS5pc1plcm8oKSl7aWYobi5pc1plcm8oKSlyZXR1cm57dmFsdWU6WzBdLGlzTmVnYXRpdmU6ZmFsc2V9O3Rocm93IG5ldyBFcnJvcigiQ2Fubm90IGNvbnZlcnQgbm9uemVybyBudW1iZXJzIHRvIGJhc2UgMC4iKX1pZihiYXNlLmVxdWFscygtMSkpe2lmKG4uaXNaZXJvKCkpcmV0dXJue3ZhbHVlOlswXSxpc05lZ2F0aXZlOmZhbHNlfTtpZihuLmlzTmVnYXRpdmUoKSlyZXR1cm57dmFsdWU6W10uY29uY2F0LmFwcGx5KFtdLEFycmF5LmFwcGx5KG51bGwsQXJyYXkoLW4udG9KU051bWJlcigpKSkubWFwKEFycmF5LnByb3RvdHlwZS52YWx1ZU9mLFsxLDBdKSksaXNOZWdhdGl2ZTpmYWxzZX07dmFyIGFycj1BcnJheS5hcHBseShudWxsLEFycmF5KG4udG9KU051bWJlcigpLTEpKS5tYXAoQXJyYXkucHJvdG90eXBlLnZhbHVlT2YsWzAsMV0pO2Fyci51bnNoaWZ0KFsxXSk7cmV0dXJue3ZhbHVlOltdLmNvbmNhdC5hcHBseShbXSxhcnIpLGlzTmVnYXRpdmU6ZmFsc2V9fXZhciBuZWc9ZmFsc2U7aWYobi5pc05lZ2F0aXZlKCkmJmJhc2UuaXNQb3NpdGl2ZSgpKXtuZWc9dHJ1ZTtuPW4uYWJzKCl9aWYoYmFzZS5pc1VuaXQoKSl7aWYobi5pc1plcm8oKSlyZXR1cm57dmFsdWU6WzBdLGlzTmVnYXRpdmU6ZmFsc2V9O3JldHVybnt2YWx1ZTpBcnJheS5hcHBseShudWxsLEFycmF5KG4udG9KU051bWJlcigpKSkubWFwKE51bWJlci5wcm90b3R5cGUudmFsdWVPZiwxKSxpc05lZ2F0aXZlOm5lZ319dmFyIG91dD1bXTt2YXIgbGVmdD1uLGRpdm1vZDt3aGlsZShsZWZ0LmlzTmVnYXRpdmUoKXx8bGVmdC5jb21wYXJlQWJzKGJhc2UpPj0wKXtkaXZtb2Q9bGVmdC5kaXZtb2QoYmFzZSk7bGVmdD1kaXZtb2QucXVvdGllbnQ7dmFyIGRpZ2l0PWRpdm1vZC5yZW1haW5kZXI7aWYoZGlnaXQuaXNOZWdhdGl2ZSgpKXtkaWdpdD1iYXNlLm1pbnVzKGRpZ2l0KS5hYnMoKTtsZWZ0PWxlZnQubmV4dCgpfW91dC5wdXNoKGRpZ2l0LnRvSlNOdW1iZXIoKSl9b3V0LnB1c2gobGVmdC50b0pTTnVtYmVyKCkpO3JldHVybnt2YWx1ZTpvdXQucmV2ZXJzZSgpLGlzTmVnYXRpdmU6bmVnfX1mdW5jdGlvbiB0b0Jhc2VTdHJpbmcobixiYXNlLGFscGhhYmV0KXt2YXIgYXJyPXRvQmFzZShuLGJhc2UpO3JldHVybihhcnIuaXNOZWdhdGl2ZT8iLSI6IiIpK2Fyci52YWx1ZS5tYXAoZnVuY3Rpb24oeCl7cmV0dXJuIHN0cmluZ2lmeSh4LGFscGhhYmV0KX0pLmpvaW4oIiIpfUJpZ0ludGVnZXIucHJvdG90eXBlLnRvQXJyYXk9ZnVuY3Rpb24ocmFkaXgpe3JldHVybiB0b0Jhc2UodGhpcyxyYWRpeCl9O1NtYWxsSW50ZWdlci5wcm90b3R5cGUudG9BcnJheT1mdW5jdGlvbihyYWRpeCl7cmV0dXJuIHRvQmFzZSh0aGlzLHJhZGl4KX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS50b0FycmF5PWZ1bmN0aW9uKHJhZGl4KXtyZXR1cm4gdG9CYXNlKHRoaXMscmFkaXgpfTtCaWdJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbihyYWRpeCxhbHBoYWJldCl7aWYocmFkaXg9PT11bmRlZmluZWQpcmFkaXg9MTA7aWYocmFkaXghPT0xMClyZXR1cm4gdG9CYXNlU3RyaW5nKHRoaXMscmFkaXgsYWxwaGFiZXQpO3ZhciB2PXRoaXMudmFsdWUsbD12Lmxlbmd0aCxzdHI9U3RyaW5nKHZbLS1sXSksemVyb3M9IjAwMDAwMDAiLGRpZ2l0O3doaWxlKC0tbD49MCl7ZGlnaXQ9U3RyaW5nKHZbbF0pO3N0cis9emVyb3Muc2xpY2UoZGlnaXQubGVuZ3RoKStkaWdpdH12YXIgc2lnbj10aGlzLnNpZ24/Ii0iOiIiO3JldHVybiBzaWduK3N0cn07U21hbGxJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbihyYWRpeCxhbHBoYWJldCl7aWYocmFkaXg9PT11bmRlZmluZWQpcmFkaXg9MTA7aWYocmFkaXghPTEwKXJldHVybiB0b0Jhc2VTdHJpbmcodGhpcyxyYWRpeCxhbHBoYWJldCk7cmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlKX07TmF0aXZlQmlnSW50LnByb3RvdHlwZS50b1N0cmluZz1TbWFsbEludGVnZXIucHJvdG90eXBlLnRvU3RyaW5nO05hdGl2ZUJpZ0ludC5wcm90b3R5cGUudG9KU09OPUJpZ0ludGVnZXIucHJvdG90eXBlLnRvSlNPTj1TbWFsbEludGVnZXIucHJvdG90eXBlLnRvSlNPTj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRvU3RyaW5nKCl9O0JpZ0ludGVnZXIucHJvdG90eXBlLnZhbHVlT2Y9ZnVuY3Rpb24oKXtyZXR1cm4gcGFyc2VJbnQodGhpcy50b1N0cmluZygpLDEwKX07QmlnSW50ZWdlci5wcm90b3R5cGUudG9KU051bWJlcj1CaWdJbnRlZ2VyLnByb3RvdHlwZS52YWx1ZU9mO1NtYWxsSW50ZWdlci5wcm90b3R5cGUudmFsdWVPZj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZhbHVlfTtTbWFsbEludGVnZXIucHJvdG90eXBlLnRvSlNOdW1iZXI9U21hbGxJbnRlZ2VyLnByb3RvdHlwZS52YWx1ZU9mO05hdGl2ZUJpZ0ludC5wcm90b3R5cGUudmFsdWVPZj1OYXRpdmVCaWdJbnQucHJvdG90eXBlLnRvSlNOdW1iZXI9ZnVuY3Rpb24oKXtyZXR1cm4gcGFyc2VJbnQodGhpcy50b1N0cmluZygpLDEwKX07ZnVuY3Rpb24gcGFyc2VTdHJpbmdWYWx1ZSh2KXtpZihpc1ByZWNpc2UoK3YpKXt2YXIgeD0rdjtpZih4PT09dHJ1bmNhdGUoeCkpcmV0dXJuIHN1cHBvcnRzTmF0aXZlQmlnSW50P25ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHgpKTpuZXcgU21hbGxJbnRlZ2VyKHgpO3Rocm93IG5ldyBFcnJvcigiSW52YWxpZCBpbnRlZ2VyOiAiK3YpfXZhciBzaWduPXZbMF09PT0iLSI7aWYoc2lnbil2PXYuc2xpY2UoMSk7dmFyIHNwbGl0PXYuc3BsaXQoL2UvaSk7aWYoc3BsaXQubGVuZ3RoPjIpdGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIGludGVnZXI6ICIrc3BsaXQuam9pbigiZSIpKTtpZihzcGxpdC5sZW5ndGg9PT0yKXt2YXIgZXhwPXNwbGl0WzFdO2lmKGV4cFswXT09PSIrIilleHA9ZXhwLnNsaWNlKDEpO2V4cD0rZXhwO2lmKGV4cCE9PXRydW5jYXRlKGV4cCl8fCFpc1ByZWNpc2UoZXhwKSl0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgaW50ZWdlcjogIitleHArIiBpcyBub3QgYSB2YWxpZCBleHBvbmVudC4iKTt2YXIgdGV4dD1zcGxpdFswXTt2YXIgZGVjaW1hbFBsYWNlPXRleHQuaW5kZXhPZigiLiIpO2lmKGRlY2ltYWxQbGFjZT49MCl7ZXhwLT10ZXh0Lmxlbmd0aC1kZWNpbWFsUGxhY2UtMTt0ZXh0PXRleHQuc2xpY2UoMCxkZWNpbWFsUGxhY2UpK3RleHQuc2xpY2UoZGVjaW1hbFBsYWNlKzEpfWlmKGV4cDwwKXRocm93IG5ldyBFcnJvcigiQ2Fubm90IGluY2x1ZGUgbmVnYXRpdmUgZXhwb25lbnQgcGFydCBmb3IgaW50ZWdlcnMiKTt0ZXh0Kz1uZXcgQXJyYXkoZXhwKzEpLmpvaW4oIjAiKTt2PXRleHR9dmFyIGlzVmFsaWQ9L14oWzAtOV1bMC05XSopJC8udGVzdCh2KTtpZighaXNWYWxpZCl0aHJvdyBuZXcgRXJyb3IoIkludmFsaWQgaW50ZWdlcjogIit2KTtpZihzdXBwb3J0c05hdGl2ZUJpZ0ludCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHNpZ24/Ii0iK3Y6dikpfXZhciByPVtdLG1heD12Lmxlbmd0aCxsPUxPR19CQVNFLG1pbj1tYXgtbDt3aGlsZShtYXg+MCl7ci5wdXNoKCt2LnNsaWNlKG1pbixtYXgpKTttaW4tPWw7aWYobWluPDApbWluPTA7bWF4LT1sfXRyaW0ocik7cmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHIsc2lnbil9ZnVuY3Rpb24gcGFyc2VOdW1iZXJWYWx1ZSh2KXtpZihzdXBwb3J0c05hdGl2ZUJpZ0ludCl7cmV0dXJuIG5ldyBOYXRpdmVCaWdJbnQoQmlnSW50KHYpKX1pZihpc1ByZWNpc2Uodikpe2lmKHYhPT10cnVuY2F0ZSh2KSl0aHJvdyBuZXcgRXJyb3IodisiIGlzIG5vdCBhbiBpbnRlZ2VyLiIpO3JldHVybiBuZXcgU21hbGxJbnRlZ2VyKHYpfXJldHVybiBwYXJzZVN0cmluZ1ZhbHVlKHYudG9TdHJpbmcoKSl9ZnVuY3Rpb24gcGFyc2VWYWx1ZSh2KXtpZih0eXBlb2Ygdj09PSJudW1iZXIiKXtyZXR1cm4gcGFyc2VOdW1iZXJWYWx1ZSh2KX1pZih0eXBlb2Ygdj09PSJzdHJpbmciKXtyZXR1cm4gcGFyc2VTdHJpbmdWYWx1ZSh2KX1pZih0eXBlb2Ygdj09PSJiaWdpbnQiKXtyZXR1cm4gbmV3IE5hdGl2ZUJpZ0ludCh2KX1yZXR1cm4gdn1mb3IodmFyIGk9MDtpPDFlMztpKyspe0ludGVnZXJbaV09cGFyc2VWYWx1ZShpKTtpZihpPjApSW50ZWdlclstaV09cGFyc2VWYWx1ZSgtaSl9SW50ZWdlci5vbmU9SW50ZWdlclsxXTtJbnRlZ2VyLnplcm89SW50ZWdlclswXTtJbnRlZ2VyLm1pbnVzT25lPUludGVnZXJbLTFdO0ludGVnZXIubWF4PW1heDtJbnRlZ2VyLm1pbj1taW47SW50ZWdlci5nY2Q9Z2NkO0ludGVnZXIubGNtPWxjbTtJbnRlZ2VyLmlzSW5zdGFuY2U9ZnVuY3Rpb24oeCl7cmV0dXJuIHggaW5zdGFuY2VvZiBCaWdJbnRlZ2VyfHx4IGluc3RhbmNlb2YgU21hbGxJbnRlZ2VyfHx4IGluc3RhbmNlb2YgTmF0aXZlQmlnSW50fTtJbnRlZ2VyLnJhbmRCZXR3ZWVuPXJhbmRCZXR3ZWVuO0ludGVnZXIuZnJvbUFycmF5PWZ1bmN0aW9uKGRpZ2l0cyxiYXNlLGlzTmVnYXRpdmUpe3JldHVybiBwYXJzZUJhc2VGcm9tQXJyYXkoZGlnaXRzLm1hcChwYXJzZVZhbHVlKSxwYXJzZVZhbHVlKGJhc2V8fDEwKSxpc05lZ2F0aXZlKX07cmV0dXJuIEludGVnZXJ9KCk7aWYodHlwZW9mIG1vZHVsZSE9PSJ1bmRlZmluZWQiJiZtb2R1bGUuaGFzT3duUHJvcGVydHkoImV4cG9ydHMiKSl7bW9kdWxlLmV4cG9ydHM9YmlnSW50fWlmKHR5cGVvZiBkZWZpbmU9PT0iZnVuY3Rpb24iJiZkZWZpbmUuYW1kKXtkZWZpbmUoImJpZy1pbnRlZ2VyIixbXSxmdW5jdGlvbigpe3JldHVybiBiaWdJbnR9KX19LHt9XSwyNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7fSx7fV0sMjU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpeyJ1c2Ugc3RyaWN0Ijt2YXIgYmFzZTY0PXJlcXVpcmUoImJhc2U2NC1qcyIpO3ZhciBpZWVlNzU0PXJlcXVpcmUoImllZWU3NTQiKTtleHBvcnRzLkJ1ZmZlcj1CdWZmZXI7ZXhwb3J0cy5TbG93QnVmZmVyPVNsb3dCdWZmZXI7ZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUz01MDt2YXIgS19NQVhfTEVOR1RIPTIxNDc0ODM2NDc7ZXhwb3J0cy5rTWF4TGVuZ3RoPUtfTUFYX0xFTkdUSDtCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVD10eXBlZEFycmF5U3VwcG9ydCgpO2lmKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCYmdHlwZW9mIGNvbnNvbGUhPT0idW5kZWZpbmVkIiYmdHlwZW9mIGNvbnNvbGUuZXJyb3I9PT0iZnVuY3Rpb24iKXtjb25zb2xlLmVycm9yKCJUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgIisiYGJ1ZmZlcmAgdjUueC4gVXNlIGBidWZmZXJgIHY0LnggaWYgeW91IHJlcXVpcmUgb2xkIGJyb3dzZXIgc3VwcG9ydC4iKX1mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCgpe3RyeXt2YXIgYXJyPW5ldyBVaW50OEFycmF5KDEpO2Fyci5fX3Byb3RvX189e19fcHJvdG9fXzpVaW50OEFycmF5LnByb3RvdHlwZSxmb286ZnVuY3Rpb24oKXtyZXR1cm4gNDJ9fTtyZXR1cm4gYXJyLmZvbygpPT09NDJ9Y2F0Y2goZSl7cmV0dXJuIGZhbHNlfX1PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwicGFyZW50Iix7ZW51bWVyYWJsZTp0cnVlLGdldDpmdW5jdGlvbigpe2lmKCFCdWZmZXIuaXNCdWZmZXIodGhpcykpcmV0dXJuIHVuZGVmaW5lZDtyZXR1cm4gdGhpcy5idWZmZXJ9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsIm9mZnNldCIse2VudW1lcmFibGU6dHJ1ZSxnZXQ6ZnVuY3Rpb24oKXtpZighQnVmZmVyLmlzQnVmZmVyKHRoaXMpKXJldHVybiB1bmRlZmluZWQ7cmV0dXJuIHRoaXMuYnl0ZU9mZnNldH19KTtmdW5jdGlvbiBjcmVhdGVCdWZmZXIobGVuZ3RoKXtpZihsZW5ndGg+S19NQVhfTEVOR1RIKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlICInK2xlbmd0aCsnIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gInNpemUiJyl9dmFyIGJ1Zj1uZXcgVWludDhBcnJheShsZW5ndGgpO2J1Zi5fX3Byb3RvX189QnVmZmVyLnByb3RvdHlwZTtyZXR1cm4gYnVmfWZ1bmN0aW9uIEJ1ZmZlcihhcmcsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpe2lmKHR5cGVvZiBhcmc9PT0ibnVtYmVyIil7aWYodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQ9PT0ic3RyaW5nIil7dGhyb3cgbmV3IFR5cGVFcnJvcignVGhlICJzdHJpbmciIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuIFJlY2VpdmVkIHR5cGUgbnVtYmVyJyl9cmV0dXJuIGFsbG9jVW5zYWZlKGFyZyl9cmV0dXJuIGZyb20oYXJnLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX1pZih0eXBlb2YgU3ltYm9sIT09InVuZGVmaW5lZCImJlN5bWJvbC5zcGVjaWVzIT1udWxsJiZCdWZmZXJbU3ltYm9sLnNwZWNpZXNdPT09QnVmZmVyKXtPYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLFN5bWJvbC5zcGVjaWVzLHt2YWx1ZTpudWxsLGNvbmZpZ3VyYWJsZTp0cnVlLGVudW1lcmFibGU6ZmFsc2Usd3JpdGFibGU6ZmFsc2V9KX1CdWZmZXIucG9vbFNpemU9ODE5MjtmdW5jdGlvbiBmcm9tKHZhbHVlLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtpZih0eXBlb2YgdmFsdWU9PT0ic3RyaW5nIil7cmV0dXJuIGZyb21TdHJpbmcodmFsdWUsZW5jb2RpbmdPck9mZnNldCl9aWYoQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSl7cmV0dXJuIGZyb21BcnJheUxpa2UodmFsdWUpfWlmKHZhbHVlPT1udWxsKXt0aHJvdyBUeXBlRXJyb3IoIlRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICIrIm9yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICIrdHlwZW9mIHZhbHVlKX1pZihpc0luc3RhbmNlKHZhbHVlLEFycmF5QnVmZmVyKXx8dmFsdWUmJmlzSW5zdGFuY2UodmFsdWUuYnVmZmVyLEFycmF5QnVmZmVyKSl7cmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9aWYodHlwZW9mIHZhbHVlPT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSAidmFsdWUiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlIG51bWJlcicpfXZhciB2YWx1ZU9mPXZhbHVlLnZhbHVlT2YmJnZhbHVlLnZhbHVlT2YoKTtpZih2YWx1ZU9mIT1udWxsJiZ2YWx1ZU9mIT09dmFsdWUpe3JldHVybiBCdWZmZXIuZnJvbSh2YWx1ZU9mLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX12YXIgYj1mcm9tT2JqZWN0KHZhbHVlKTtpZihiKXJldHVybiBiO2lmKHR5cGVvZiBTeW1ib2whPT0idW5kZWZpbmVkIiYmU3ltYm9sLnRvUHJpbWl0aXZlIT1udWxsJiZ0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXT09PSJmdW5jdGlvbiIpe3JldHVybiBCdWZmZXIuZnJvbSh2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdKCJzdHJpbmciKSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9dGhyb3cgbmV3IFR5cGVFcnJvcigiVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgIisib3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgIit0eXBlb2YgdmFsdWUpfUJ1ZmZlci5mcm9tPWZ1bmN0aW9uKHZhbHVlLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKXtyZXR1cm4gZnJvbSh2YWx1ZSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9O0J1ZmZlci5wcm90b3R5cGUuX19wcm90b19fPVVpbnQ4QXJyYXkucHJvdG90eXBlO0J1ZmZlci5fX3Byb3RvX189VWludDhBcnJheTtmdW5jdGlvbiBhc3NlcnRTaXplKHNpemUpe2lmKHR5cGVvZiBzaXplIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJzaXplIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJyl9ZWxzZSBpZihzaXplPDApe3Rocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgIicrc2l6ZSsnIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gInNpemUiJyl9fWZ1bmN0aW9uIGFsbG9jKHNpemUsZmlsbCxlbmNvZGluZyl7YXNzZXJ0U2l6ZShzaXplKTtpZihzaXplPD0wKXtyZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpfWlmKGZpbGwhPT11bmRlZmluZWQpe3JldHVybiB0eXBlb2YgZW5jb2Rpbmc9PT0ic3RyaW5nIj9jcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsLGVuY29kaW5nKTpjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsKX1yZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpfUJ1ZmZlci5hbGxvYz1mdW5jdGlvbihzaXplLGZpbGwsZW5jb2Rpbmcpe3JldHVybiBhbGxvYyhzaXplLGZpbGwsZW5jb2RpbmcpfTtmdW5jdGlvbiBhbGxvY1Vuc2FmZShzaXplKXthc3NlcnRTaXplKHNpemUpO3JldHVybiBjcmVhdGVCdWZmZXIoc2l6ZTwwPzA6Y2hlY2tlZChzaXplKXwwKX1CdWZmZXIuYWxsb2NVbnNhZmU9ZnVuY3Rpb24oc2l6ZSl7cmV0dXJuIGFsbG9jVW5zYWZlKHNpemUpfTtCdWZmZXIuYWxsb2NVbnNhZmVTbG93PWZ1bmN0aW9uKHNpemUpe3JldHVybiBhbGxvY1Vuc2FmZShzaXplKX07ZnVuY3Rpb24gZnJvbVN0cmluZyhzdHJpbmcsZW5jb2Rpbmcpe2lmKHR5cGVvZiBlbmNvZGluZyE9PSJzdHJpbmcifHxlbmNvZGluZz09PSIiKXtlbmNvZGluZz0idXRmOCJ9aWYoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSl7dGhyb3cgbmV3IFR5cGVFcnJvcigiVW5rbm93biBlbmNvZGluZzogIitlbmNvZGluZyl9dmFyIGxlbmd0aD1ieXRlTGVuZ3RoKHN0cmluZyxlbmNvZGluZyl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW5ndGgpO3ZhciBhY3R1YWw9YnVmLndyaXRlKHN0cmluZyxlbmNvZGluZyk7aWYoYWN0dWFsIT09bGVuZ3RoKXtidWY9YnVmLnNsaWNlKDAsYWN0dWFsKX1yZXR1cm4gYnVmfWZ1bmN0aW9uIGZyb21BcnJheUxpa2UoYXJyYXkpe3ZhciBsZW5ndGg9YXJyYXkubGVuZ3RoPDA/MDpjaGVja2VkKGFycmF5Lmxlbmd0aCl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW5ndGgpO2Zvcih2YXIgaT0wO2k8bGVuZ3RoO2krPTEpe2J1ZltpXT1hcnJheVtpXSYyNTV9cmV0dXJuIGJ1Zn1mdW5jdGlvbiBmcm9tQXJyYXlCdWZmZXIoYXJyYXksYnl0ZU9mZnNldCxsZW5ndGgpe2lmKGJ5dGVPZmZzZXQ8MHx8YXJyYXkuYnl0ZUxlbmd0aDxieXRlT2Zmc2V0KXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignIm9mZnNldCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJyl9aWYoYXJyYXkuYnl0ZUxlbmd0aDxieXRlT2Zmc2V0KyhsZW5ndGh8fDApKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcignImxlbmd0aCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJyl9dmFyIGJ1ZjtpZihieXRlT2Zmc2V0PT09dW5kZWZpbmVkJiZsZW5ndGg9PT11bmRlZmluZWQpe2J1Zj1uZXcgVWludDhBcnJheShhcnJheSl9ZWxzZSBpZihsZW5ndGg9PT11bmRlZmluZWQpe2J1Zj1uZXcgVWludDhBcnJheShhcnJheSxieXRlT2Zmc2V0KX1lbHNle2J1Zj1uZXcgVWludDhBcnJheShhcnJheSxieXRlT2Zmc2V0LGxlbmd0aCl9YnVmLl9fcHJvdG9fXz1CdWZmZXIucHJvdG90eXBlO3JldHVybiBidWZ9ZnVuY3Rpb24gZnJvbU9iamVjdChvYmope2lmKEJ1ZmZlci5pc0J1ZmZlcihvYmopKXt2YXIgbGVuPWNoZWNrZWQob2JqLmxlbmd0aCl8MDt2YXIgYnVmPWNyZWF0ZUJ1ZmZlcihsZW4pO2lmKGJ1Zi5sZW5ndGg9PT0wKXtyZXR1cm4gYnVmfW9iai5jb3B5KGJ1ZiwwLDAsbGVuKTtyZXR1cm4gYnVmfWlmKG9iai5sZW5ndGghPT11bmRlZmluZWQpe2lmKHR5cGVvZiBvYmoubGVuZ3RoIT09Im51bWJlciJ8fG51bWJlcklzTmFOKG9iai5sZW5ndGgpKXtyZXR1cm4gY3JlYXRlQnVmZmVyKDApfXJldHVybiBmcm9tQXJyYXlMaWtlKG9iail9aWYob2JqLnR5cGU9PT0iQnVmZmVyIiYmQXJyYXkuaXNBcnJheShvYmouZGF0YSkpe3JldHVybiBmcm9tQXJyYXlMaWtlKG9iai5kYXRhKX19ZnVuY3Rpb24gY2hlY2tlZChsZW5ndGgpe2lmKGxlbmd0aD49S19NQVhfTEVOR1RIKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcigiQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAiKyJzaXplOiAweCIrS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSsiIGJ5dGVzIil9cmV0dXJuIGxlbmd0aHwwfWZ1bmN0aW9uIFNsb3dCdWZmZXIobGVuZ3RoKXtpZigrbGVuZ3RoIT1sZW5ndGgpe2xlbmd0aD0wfXJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aCl9QnVmZmVyLmlzQnVmZmVyPWZ1bmN0aW9uIGlzQnVmZmVyKGIpe3JldHVybiBiIT1udWxsJiZiLl9pc0J1ZmZlcj09PXRydWUmJmIhPT1CdWZmZXIucHJvdG90eXBlfTtCdWZmZXIuY29tcGFyZT1mdW5jdGlvbiBjb21wYXJlKGEsYil7aWYoaXNJbnN0YW5jZShhLFVpbnQ4QXJyYXkpKWE9QnVmZmVyLmZyb20oYSxhLm9mZnNldCxhLmJ5dGVMZW5ndGgpO2lmKGlzSW5zdGFuY2UoYixVaW50OEFycmF5KSliPUJ1ZmZlci5mcm9tKGIsYi5vZmZzZXQsYi5ieXRlTGVuZ3RoKTtpZighQnVmZmVyLmlzQnVmZmVyKGEpfHwhQnVmZmVyLmlzQnVmZmVyKGIpKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgImJ1ZjEiLCAiYnVmMiIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknKX1pZihhPT09YilyZXR1cm4gMDt2YXIgeD1hLmxlbmd0aDt2YXIgeT1iLmxlbmd0aDtmb3IodmFyIGk9MCxsZW49TWF0aC5taW4oeCx5KTtpPGxlbjsrK2kpe2lmKGFbaV0hPT1iW2ldKXt4PWFbaV07eT1iW2ldO2JyZWFrfX1pZih4PHkpcmV0dXJuLTE7aWYoeTx4KXJldHVybiAxO3JldHVybiAwfTtCdWZmZXIuaXNFbmNvZGluZz1mdW5jdGlvbiBpc0VuY29kaW5nKGVuY29kaW5nKXtzd2l0Y2goU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKXtjYXNlImhleCI6Y2FzZSJ1dGY4IjpjYXNlInV0Zi04IjpjYXNlImFzY2lpIjpjYXNlImxhdGluMSI6Y2FzZSJiaW5hcnkiOmNhc2UiYmFzZTY0IjpjYXNlInVjczIiOmNhc2UidWNzLTIiOmNhc2UidXRmMTZsZSI6Y2FzZSJ1dGYtMTZsZSI6cmV0dXJuIHRydWU7ZGVmYXVsdDpyZXR1cm4gZmFsc2V9fTtCdWZmZXIuY29uY2F0PWZ1bmN0aW9uIGNvbmNhdChsaXN0LGxlbmd0aCl7aWYoIUFycmF5LmlzQXJyYXkobGlzdCkpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJsaXN0IiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKX1pZihsaXN0Lmxlbmd0aD09PTApe3JldHVybiBCdWZmZXIuYWxsb2MoMCl9dmFyIGk7aWYobGVuZ3RoPT09dW5kZWZpbmVkKXtsZW5ndGg9MDtmb3IoaT0wO2k8bGlzdC5sZW5ndGg7KytpKXtsZW5ndGgrPWxpc3RbaV0ubGVuZ3RofX12YXIgYnVmZmVyPUJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpO3ZhciBwb3M9MDtmb3IoaT0wO2k8bGlzdC5sZW5ndGg7KytpKXt2YXIgYnVmPWxpc3RbaV07aWYoaXNJbnN0YW5jZShidWYsVWludDhBcnJheSkpe2J1Zj1CdWZmZXIuZnJvbShidWYpfWlmKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSl7dGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3QiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpfWJ1Zi5jb3B5KGJ1ZmZlcixwb3MpO3Bvcys9YnVmLmxlbmd0aH1yZXR1cm4gYnVmZmVyfTtmdW5jdGlvbiBieXRlTGVuZ3RoKHN0cmluZyxlbmNvZGluZyl7aWYoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpe3JldHVybiBzdHJpbmcubGVuZ3RofWlmKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpfHxpc0luc3RhbmNlKHN0cmluZyxBcnJheUJ1ZmZlcikpe3JldHVybiBzdHJpbmcuYnl0ZUxlbmd0aH1pZih0eXBlb2Ygc3RyaW5nIT09InN0cmluZyIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSAic3RyaW5nIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBvciBBcnJheUJ1ZmZlci4gJysiUmVjZWl2ZWQgdHlwZSAiK3R5cGVvZiBzdHJpbmcpfXZhciBsZW49c3RyaW5nLmxlbmd0aDt2YXIgbXVzdE1hdGNoPWFyZ3VtZW50cy5sZW5ndGg+MiYmYXJndW1lbnRzWzJdPT09dHJ1ZTtpZighbXVzdE1hdGNoJiZsZW49PT0wKXJldHVybiAwO3ZhciBsb3dlcmVkQ2FzZT1mYWxzZTtmb3IoOzspe3N3aXRjaChlbmNvZGluZyl7Y2FzZSJhc2NpaSI6Y2FzZSJsYXRpbjEiOmNhc2UiYmluYXJ5IjpyZXR1cm4gbGVuO2Nhc2UidXRmOCI6Y2FzZSJ1dGYtOCI6cmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoO2Nhc2UidWNzMiI6Y2FzZSJ1Y3MtMiI6Y2FzZSJ1dGYxNmxlIjpjYXNlInV0Zi0xNmxlIjpyZXR1cm4gbGVuKjI7Y2FzZSJoZXgiOnJldHVybiBsZW4+Pj4xO2Nhc2UiYmFzZTY0IjpyZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aDtkZWZhdWx0OmlmKGxvd2VyZWRDYXNlKXtyZXR1cm4gbXVzdE1hdGNoPy0xOnV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RofWVuY29kaW5nPSgiIitlbmNvZGluZykudG9Mb3dlckNhc2UoKTtsb3dlcmVkQ2FzZT10cnVlfX19QnVmZmVyLmJ5dGVMZW5ndGg9Ynl0ZUxlbmd0aDtmdW5jdGlvbiBzbG93VG9TdHJpbmcoZW5jb2Rpbmcsc3RhcnQsZW5kKXt2YXIgbG93ZXJlZENhc2U9ZmFsc2U7aWYoc3RhcnQ9PT11bmRlZmluZWR8fHN0YXJ0PDApe3N0YXJ0PTB9aWYoc3RhcnQ+dGhpcy5sZW5ndGgpe3JldHVybiIifWlmKGVuZD09PXVuZGVmaW5lZHx8ZW5kPnRoaXMubGVuZ3RoKXtlbmQ9dGhpcy5sZW5ndGh9aWYoZW5kPD0wKXtyZXR1cm4iIn1lbmQ+Pj49MDtzdGFydD4+Pj0wO2lmKGVuZDw9c3RhcnQpe3JldHVybiIifWlmKCFlbmNvZGluZyllbmNvZGluZz0idXRmOCI7d2hpbGUodHJ1ZSl7c3dpdGNoKGVuY29kaW5nKXtjYXNlImhleCI6cmV0dXJuIGhleFNsaWNlKHRoaXMsc3RhcnQsZW5kKTtjYXNlInV0ZjgiOmNhc2UidXRmLTgiOnJldHVybiB1dGY4U2xpY2UodGhpcyxzdGFydCxlbmQpO2Nhc2UiYXNjaWkiOnJldHVybiBhc2NpaVNsaWNlKHRoaXMsc3RhcnQsZW5kKTtjYXNlImxhdGluMSI6Y2FzZSJiaW5hcnkiOnJldHVybiBsYXRpbjFTbGljZSh0aGlzLHN0YXJ0LGVuZCk7Y2FzZSJiYXNlNjQiOnJldHVybiBiYXNlNjRTbGljZSh0aGlzLHN0YXJ0LGVuZCk7Y2FzZSJ1Y3MyIjpjYXNlInVjcy0yIjpjYXNlInV0ZjE2bGUiOmNhc2UidXRmLTE2bGUiOnJldHVybiB1dGYxNmxlU2xpY2UodGhpcyxzdGFydCxlbmQpO2RlZmF1bHQ6aWYobG93ZXJlZENhc2UpdGhyb3cgbmV3IFR5cGVFcnJvcigiVW5rbm93biBlbmNvZGluZzogIitlbmNvZGluZyk7ZW5jb2Rpbmc9KGVuY29kaW5nKyIiKS50b0xvd2VyQ2FzZSgpO2xvd2VyZWRDYXNlPXRydWV9fX1CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlcj10cnVlO2Z1bmN0aW9uIHN3YXAoYixuLG0pe3ZhciBpPWJbbl07YltuXT1iW21dO2JbbV09aX1CdWZmZXIucHJvdG90eXBlLnN3YXAxNj1mdW5jdGlvbiBzd2FwMTYoKXt2YXIgbGVuPXRoaXMubGVuZ3RoO2lmKGxlbiUyIT09MCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkJ1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzIil9Zm9yKHZhciBpPTA7aTxsZW47aSs9Mil7c3dhcCh0aGlzLGksaSsxKX1yZXR1cm4gdGhpc307QnVmZmVyLnByb3RvdHlwZS5zd2FwMzI9ZnVuY3Rpb24gc3dhcDMyKCl7dmFyIGxlbj10aGlzLmxlbmd0aDtpZihsZW4lNCE9PTApe3Rocm93IG5ldyBSYW5nZUVycm9yKCJCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cyIpfWZvcih2YXIgaT0wO2k8bGVuO2krPTQpe3N3YXAodGhpcyxpLGkrMyk7c3dhcCh0aGlzLGkrMSxpKzIpfXJldHVybiB0aGlzfTtCdWZmZXIucHJvdG90eXBlLnN3YXA2ND1mdW5jdGlvbiBzd2FwNjQoKXt2YXIgbGVuPXRoaXMubGVuZ3RoO2lmKGxlbiU4IT09MCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkJ1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzIil9Zm9yKHZhciBpPTA7aTxsZW47aSs9OCl7c3dhcCh0aGlzLGksaSs3KTtzd2FwKHRoaXMsaSsxLGkrNik7c3dhcCh0aGlzLGkrMixpKzUpO3N3YXAodGhpcyxpKzMsaSs0KX1yZXR1cm4gdGhpc307QnVmZmVyLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbiB0b1N0cmluZygpe3ZhciBsZW5ndGg9dGhpcy5sZW5ndGg7aWYobGVuZ3RoPT09MClyZXR1cm4iIjtpZihhcmd1bWVudHMubGVuZ3RoPT09MClyZXR1cm4gdXRmOFNsaWNlKHRoaXMsMCxsZW5ndGgpO3JldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcyxhcmd1bWVudHMpfTtCdWZmZXIucHJvdG90eXBlLnRvTG9jYWxlU3RyaW5nPUJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmc7QnVmZmVyLnByb3RvdHlwZS5lcXVhbHM9ZnVuY3Rpb24gZXF1YWxzKGIpe2lmKCFCdWZmZXIuaXNCdWZmZXIoYikpdGhyb3cgbmV3IFR5cGVFcnJvcigiQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciIpO2lmKHRoaXM9PT1iKXJldHVybiB0cnVlO3JldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLGIpPT09MH07QnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0PWZ1bmN0aW9uIGluc3BlY3QoKXt2YXIgc3RyPSIiO3ZhciBtYXg9ZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUztzdHI9dGhpcy50b1N0cmluZygiaGV4IiwwLG1heCkucmVwbGFjZSgvKC57Mn0pL2csIiQxICIpLnRyaW0oKTtpZih0aGlzLmxlbmd0aD5tYXgpc3RyKz0iIC4uLiAiO3JldHVybiI8QnVmZmVyICIrc3RyKyI+In07QnVmZmVyLnByb3RvdHlwZS5jb21wYXJlPWZ1bmN0aW9uIGNvbXBhcmUodGFyZ2V0LHN0YXJ0LGVuZCx0aGlzU3RhcnQsdGhpc0VuZCl7aWYoaXNJbnN0YW5jZSh0YXJnZXQsVWludDhBcnJheSkpe3RhcmdldD1CdWZmZXIuZnJvbSh0YXJnZXQsdGFyZ2V0Lm9mZnNldCx0YXJnZXQuYnl0ZUxlbmd0aCl9aWYoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgInRhcmdldCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheS4gJysiUmVjZWl2ZWQgdHlwZSAiK3R5cGVvZiB0YXJnZXQpfWlmKHN0YXJ0PT09dW5kZWZpbmVkKXtzdGFydD0wfWlmKGVuZD09PXVuZGVmaW5lZCl7ZW5kPXRhcmdldD90YXJnZXQubGVuZ3RoOjB9aWYodGhpc1N0YXJ0PT09dW5kZWZpbmVkKXt0aGlzU3RhcnQ9MH1pZih0aGlzRW5kPT09dW5kZWZpbmVkKXt0aGlzRW5kPXRoaXMubGVuZ3RofWlmKHN0YXJ0PDB8fGVuZD50YXJnZXQubGVuZ3RofHx0aGlzU3RhcnQ8MHx8dGhpc0VuZD50aGlzLmxlbmd0aCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIm91dCBvZiByYW5nZSBpbmRleCIpfWlmKHRoaXNTdGFydD49dGhpc0VuZCYmc3RhcnQ+PWVuZCl7cmV0dXJuIDB9aWYodGhpc1N0YXJ0Pj10aGlzRW5kKXtyZXR1cm4tMX1pZihzdGFydD49ZW5kKXtyZXR1cm4gMX1zdGFydD4+Pj0wO2VuZD4+Pj0wO3RoaXNTdGFydD4+Pj0wO3RoaXNFbmQ+Pj49MDtpZih0aGlzPT09dGFyZ2V0KXJldHVybiAwO3ZhciB4PXRoaXNFbmQtdGhpc1N0YXJ0O3ZhciB5PWVuZC1zdGFydDt2YXIgbGVuPU1hdGgubWluKHgseSk7dmFyIHRoaXNDb3B5PXRoaXMuc2xpY2UodGhpc1N0YXJ0LHRoaXNFbmQpO3ZhciB0YXJnZXRDb3B5PXRhcmdldC5zbGljZShzdGFydCxlbmQpO2Zvcih2YXIgaT0wO2k8bGVuOysraSl7aWYodGhpc0NvcHlbaV0hPT10YXJnZXRDb3B5W2ldKXt4PXRoaXNDb3B5W2ldO3k9dGFyZ2V0Q29weVtpXTticmVha319aWYoeDx5KXJldHVybi0xO2lmKHk8eClyZXR1cm4gMTtyZXR1cm4gMH07ZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YoYnVmZmVyLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil7aWYoYnVmZmVyLmxlbmd0aD09PTApcmV0dXJuLTE7aWYodHlwZW9mIGJ5dGVPZmZzZXQ9PT0ic3RyaW5nIil7ZW5jb2Rpbmc9Ynl0ZU9mZnNldDtieXRlT2Zmc2V0PTB9ZWxzZSBpZihieXRlT2Zmc2V0PjIxNDc0ODM2NDcpe2J5dGVPZmZzZXQ9MjE0NzQ4MzY0N31lbHNlIGlmKGJ5dGVPZmZzZXQ8LTIxNDc0ODM2NDgpe2J5dGVPZmZzZXQ9LTIxNDc0ODM2NDh9Ynl0ZU9mZnNldD0rYnl0ZU9mZnNldDtpZihudW1iZXJJc05hTihieXRlT2Zmc2V0KSl7Ynl0ZU9mZnNldD1kaXI/MDpidWZmZXIubGVuZ3RoLTF9aWYoYnl0ZU9mZnNldDwwKWJ5dGVPZmZzZXQ9YnVmZmVyLmxlbmd0aCtieXRlT2Zmc2V0O2lmKGJ5dGVPZmZzZXQ+PWJ1ZmZlci5sZW5ndGgpe2lmKGRpcilyZXR1cm4tMTtlbHNlIGJ5dGVPZmZzZXQ9YnVmZmVyLmxlbmd0aC0xfWVsc2UgaWYoYnl0ZU9mZnNldDwwKXtpZihkaXIpYnl0ZU9mZnNldD0wO2Vsc2UgcmV0dXJuLTF9aWYodHlwZW9mIHZhbD09PSJzdHJpbmciKXt2YWw9QnVmZmVyLmZyb20odmFsLGVuY29kaW5nKX1pZihCdWZmZXIuaXNCdWZmZXIodmFsKSl7aWYodmFsLmxlbmd0aD09PTApe3JldHVybi0xfXJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil9ZWxzZSBpZih0eXBlb2YgdmFsPT09Im51bWJlciIpe3ZhbD12YWwmMjU1O2lmKHR5cGVvZiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mPT09ImZ1bmN0aW9uIil7aWYoZGlyKXtyZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlcix2YWwsYnl0ZU9mZnNldCl9ZWxzZXtyZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsdmFsLGJ5dGVPZmZzZXQpfX1yZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlcixbdmFsXSxieXRlT2Zmc2V0LGVuY29kaW5nLGRpcil9dGhyb3cgbmV3IFR5cGVFcnJvcigidmFsIG11c3QgYmUgc3RyaW5nLCBudW1iZXIgb3IgQnVmZmVyIil9ZnVuY3Rpb24gYXJyYXlJbmRleE9mKGFycix2YWwsYnl0ZU9mZnNldCxlbmNvZGluZyxkaXIpe3ZhciBpbmRleFNpemU9MTt2YXIgYXJyTGVuZ3RoPWFyci5sZW5ndGg7dmFyIHZhbExlbmd0aD12YWwubGVuZ3RoO2lmKGVuY29kaW5nIT09dW5kZWZpbmVkKXtlbmNvZGluZz1TdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCk7aWYoZW5jb2Rpbmc9PT0idWNzMiJ8fGVuY29kaW5nPT09InVjcy0yInx8ZW5jb2Rpbmc9PT0idXRmMTZsZSJ8fGVuY29kaW5nPT09InV0Zi0xNmxlIil7aWYoYXJyLmxlbmd0aDwyfHx2YWwubGVuZ3RoPDIpe3JldHVybi0xfWluZGV4U2l6ZT0yO2Fyckxlbmd0aC89Mjt2YWxMZW5ndGgvPTI7Ynl0ZU9mZnNldC89Mn19ZnVuY3Rpb24gcmVhZChidWYsaSl7aWYoaW5kZXhTaXplPT09MSl7cmV0dXJuIGJ1ZltpXX1lbHNle3JldHVybiBidWYucmVhZFVJbnQxNkJFKGkqaW5kZXhTaXplKX19dmFyIGk7aWYoZGlyKXt2YXIgZm91bmRJbmRleD0tMTtmb3IoaT1ieXRlT2Zmc2V0O2k8YXJyTGVuZ3RoO2krKyl7aWYocmVhZChhcnIsaSk9PT1yZWFkKHZhbCxmb3VuZEluZGV4PT09LTE/MDppLWZvdW5kSW5kZXgpKXtpZihmb3VuZEluZGV4PT09LTEpZm91bmRJbmRleD1pO2lmKGktZm91bmRJbmRleCsxPT09dmFsTGVuZ3RoKXJldHVybiBmb3VuZEluZGV4KmluZGV4U2l6ZX1lbHNle2lmKGZvdW5kSW5kZXghPT0tMSlpLT1pLWZvdW5kSW5kZXg7Zm91bmRJbmRleD0tMX19fWVsc2V7aWYoYnl0ZU9mZnNldCt2YWxMZW5ndGg+YXJyTGVuZ3RoKWJ5dGVPZmZzZXQ9YXJyTGVuZ3RoLXZhbExlbmd0aDtmb3IoaT1ieXRlT2Zmc2V0O2k+PTA7aS0tKXt2YXIgZm91bmQ9dHJ1ZTtmb3IodmFyIGo9MDtqPHZhbExlbmd0aDtqKyspe2lmKHJlYWQoYXJyLGkraikhPT1yZWFkKHZhbCxqKSl7Zm91bmQ9ZmFsc2U7YnJlYWt9fWlmKGZvdW5kKXJldHVybiBpfX1yZXR1cm4tMX1CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzPWZ1bmN0aW9uIGluY2x1ZGVzKHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nKXtyZXR1cm4gdGhpcy5pbmRleE9mKHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nKSE9PS0xfTtCdWZmZXIucHJvdG90eXBlLmluZGV4T2Y9ZnVuY3Rpb24gaW5kZXhPZih2YWwsYnl0ZU9mZnNldCxlbmNvZGluZyl7cmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsdmFsLGJ5dGVPZmZzZXQsZW5jb2RpbmcsdHJ1ZSl9O0J1ZmZlci5wcm90b3R5cGUubGFzdEluZGV4T2Y9ZnVuY3Rpb24gbGFzdEluZGV4T2YodmFsLGJ5dGVPZmZzZXQsZW5jb2Rpbmcpe3JldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLHZhbCxieXRlT2Zmc2V0LGVuY29kaW5nLGZhbHNlKX07ZnVuY3Rpb24gaGV4V3JpdGUoYnVmLHN0cmluZyxvZmZzZXQsbGVuZ3RoKXtvZmZzZXQ9TnVtYmVyKG9mZnNldCl8fDA7dmFyIHJlbWFpbmluZz1idWYubGVuZ3RoLW9mZnNldDtpZighbGVuZ3RoKXtsZW5ndGg9cmVtYWluaW5nfWVsc2V7bGVuZ3RoPU51bWJlcihsZW5ndGgpO2lmKGxlbmd0aD5yZW1haW5pbmcpe2xlbmd0aD1yZW1haW5pbmd9fXZhciBzdHJMZW49c3RyaW5nLmxlbmd0aDtpZihsZW5ndGg+c3RyTGVuLzIpe2xlbmd0aD1zdHJMZW4vMn1mb3IodmFyIGk9MDtpPGxlbmd0aDsrK2kpe3ZhciBwYXJzZWQ9cGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpKjIsMiksMTYpO2lmKG51bWJlcklzTmFOKHBhcnNlZCkpcmV0dXJuIGk7YnVmW29mZnNldCtpXT1wYXJzZWR9cmV0dXJuIGl9ZnVuY3Rpb24gdXRmOFdyaXRlKGJ1ZixzdHJpbmcsb2Zmc2V0LGxlbmd0aCl7cmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLGJ1Zi5sZW5ndGgtb2Zmc2V0KSxidWYsb2Zmc2V0LGxlbmd0aCl9ZnVuY3Rpb24gYXNjaWlXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLGJ1ZixvZmZzZXQsbGVuZ3RoKX1mdW5jdGlvbiBsYXRpbjFXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBhc2NpaVdyaXRlKGJ1ZixzdHJpbmcsb2Zmc2V0LGxlbmd0aCl9ZnVuY3Rpb24gYmFzZTY0V3JpdGUoYnVmLHN0cmluZyxvZmZzZXQsbGVuZ3RoKXtyZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksYnVmLG9mZnNldCxsZW5ndGgpfWZ1bmN0aW9uIHVjczJXcml0ZShidWYsc3RyaW5nLG9mZnNldCxsZW5ndGgpe3JldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyxidWYubGVuZ3RoLW9mZnNldCksYnVmLG9mZnNldCxsZW5ndGgpfUJ1ZmZlci5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24gd3JpdGUoc3RyaW5nLG9mZnNldCxsZW5ndGgsZW5jb2Rpbmcpe2lmKG9mZnNldD09PXVuZGVmaW5lZCl7ZW5jb2Rpbmc9InV0ZjgiO2xlbmd0aD10aGlzLmxlbmd0aDtvZmZzZXQ9MH1lbHNlIGlmKGxlbmd0aD09PXVuZGVmaW5lZCYmdHlwZW9mIG9mZnNldD09PSJzdHJpbmciKXtlbmNvZGluZz1vZmZzZXQ7bGVuZ3RoPXRoaXMubGVuZ3RoO29mZnNldD0wfWVsc2UgaWYoaXNGaW5pdGUob2Zmc2V0KSl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoaXNGaW5pdGUobGVuZ3RoKSl7bGVuZ3RoPWxlbmd0aD4+PjA7aWYoZW5jb2Rpbmc9PT11bmRlZmluZWQpZW5jb2Rpbmc9InV0ZjgifWVsc2V7ZW5jb2Rpbmc9bGVuZ3RoO2xlbmd0aD11bmRlZmluZWR9fWVsc2V7dGhyb3cgbmV3IEVycm9yKCJCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCIpfXZhciByZW1haW5pbmc9dGhpcy5sZW5ndGgtb2Zmc2V0O2lmKGxlbmd0aD09PXVuZGVmaW5lZHx8bGVuZ3RoPnJlbWFpbmluZylsZW5ndGg9cmVtYWluaW5nO2lmKHN0cmluZy5sZW5ndGg+MCYmKGxlbmd0aDwwfHxvZmZzZXQ8MCl8fG9mZnNldD50aGlzLmxlbmd0aCl7dGhyb3cgbmV3IFJhbmdlRXJyb3IoIkF0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzIil9aWYoIWVuY29kaW5nKWVuY29kaW5nPSJ1dGY4Ijt2YXIgbG93ZXJlZENhc2U9ZmFsc2U7Zm9yKDs7KXtzd2l0Y2goZW5jb2Rpbmcpe2Nhc2UiaGV4IjpyZXR1cm4gaGV4V3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7Y2FzZSJ1dGY4IjpjYXNlInV0Zi04IjpyZXR1cm4gdXRmOFdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UiYXNjaWkiOnJldHVybiBhc2NpaVdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UibGF0aW4xIjpjYXNlImJpbmFyeSI6cmV0dXJuIGxhdGluMVdyaXRlKHRoaXMsc3RyaW5nLG9mZnNldCxsZW5ndGgpO2Nhc2UiYmFzZTY0IjpyZXR1cm4gYmFzZTY0V3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7Y2FzZSJ1Y3MyIjpjYXNlInVjcy0yIjpjYXNlInV0ZjE2bGUiOmNhc2UidXRmLTE2bGUiOnJldHVybiB1Y3MyV3JpdGUodGhpcyxzdHJpbmcsb2Zmc2V0LGxlbmd0aCk7ZGVmYXVsdDppZihsb3dlcmVkQ2FzZSl0aHJvdyBuZXcgVHlwZUVycm9yKCJVbmtub3duIGVuY29kaW5nOiAiK2VuY29kaW5nKTtlbmNvZGluZz0oIiIrZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCk7bG93ZXJlZENhc2U9dHJ1ZX19fTtCdWZmZXIucHJvdG90eXBlLnRvSlNPTj1mdW5jdGlvbiB0b0pTT04oKXtyZXR1cm57dHlwZToiQnVmZmVyIixkYXRhOkFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2Fycnx8dGhpcywwKX19O2Z1bmN0aW9uIGJhc2U2NFNsaWNlKGJ1ZixzdGFydCxlbmQpe2lmKHN0YXJ0PT09MCYmZW5kPT09YnVmLmxlbmd0aCl7cmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zil9ZWxzZXtyZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LGVuZCkpfX1mdW5jdGlvbiB1dGY4U2xpY2UoYnVmLHN0YXJ0LGVuZCl7ZW5kPU1hdGgubWluKGJ1Zi5sZW5ndGgsZW5kKTt2YXIgcmVzPVtdO3ZhciBpPXN0YXJ0O3doaWxlKGk8ZW5kKXt2YXIgZmlyc3RCeXRlPWJ1ZltpXTt2YXIgY29kZVBvaW50PW51bGw7dmFyIGJ5dGVzUGVyU2VxdWVuY2U9Zmlyc3RCeXRlPjIzOT80OmZpcnN0Qnl0ZT4yMjM/MzpmaXJzdEJ5dGU+MTkxPzI6MTtpZihpK2J5dGVzUGVyU2VxdWVuY2U8PWVuZCl7dmFyIHNlY29uZEJ5dGUsdGhpcmRCeXRlLGZvdXJ0aEJ5dGUsdGVtcENvZGVQb2ludDtzd2l0Y2goYnl0ZXNQZXJTZXF1ZW5jZSl7Y2FzZSAxOmlmKGZpcnN0Qnl0ZTwxMjgpe2NvZGVQb2ludD1maXJzdEJ5dGV9YnJlYWs7Y2FzZSAyOnNlY29uZEJ5dGU9YnVmW2krMV07aWYoKHNlY29uZEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjMxKTw8NnxzZWNvbmRCeXRlJjYzO2lmKHRlbXBDb2RlUG9pbnQ+MTI3KXtjb2RlUG9pbnQ9dGVtcENvZGVQb2ludH19YnJlYWs7Y2FzZSAzOnNlY29uZEJ5dGU9YnVmW2krMV07dGhpcmRCeXRlPWJ1ZltpKzJdO2lmKChzZWNvbmRCeXRlJjE5Mik9PT0xMjgmJih0aGlyZEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjE1KTw8MTJ8KHNlY29uZEJ5dGUmNjMpPDw2fHRoaXJkQnl0ZSY2MztpZih0ZW1wQ29kZVBvaW50PjIwNDcmJih0ZW1wQ29kZVBvaW50PDU1Mjk2fHx0ZW1wQ29kZVBvaW50PjU3MzQzKSl7Y29kZVBvaW50PXRlbXBDb2RlUG9pbnR9fWJyZWFrO2Nhc2UgNDpzZWNvbmRCeXRlPWJ1ZltpKzFdO3RoaXJkQnl0ZT1idWZbaSsyXTtmb3VydGhCeXRlPWJ1ZltpKzNdO2lmKChzZWNvbmRCeXRlJjE5Mik9PT0xMjgmJih0aGlyZEJ5dGUmMTkyKT09PTEyOCYmKGZvdXJ0aEJ5dGUmMTkyKT09PTEyOCl7dGVtcENvZGVQb2ludD0oZmlyc3RCeXRlJjE1KTw8MTh8KHNlY29uZEJ5dGUmNjMpPDwxMnwodGhpcmRCeXRlJjYzKTw8Nnxmb3VydGhCeXRlJjYzO2lmKHRlbXBDb2RlUG9pbnQ+NjU1MzUmJnRlbXBDb2RlUG9pbnQ8MTExNDExMil7Y29kZVBvaW50PXRlbXBDb2RlUG9pbnR9fX19aWYoY29kZVBvaW50PT09bnVsbCl7Y29kZVBvaW50PTY1NTMzO2J5dGVzUGVyU2VxdWVuY2U9MX1lbHNlIGlmKGNvZGVQb2ludD42NTUzNSl7Y29kZVBvaW50LT02NTUzNjtyZXMucHVzaChjb2RlUG9pbnQ+Pj4xMCYxMDIzfDU1Mjk2KTtjb2RlUG9pbnQ9NTYzMjB8Y29kZVBvaW50JjEwMjN9cmVzLnB1c2goY29kZVBvaW50KTtpKz1ieXRlc1BlclNlcXVlbmNlfXJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKX12YXIgTUFYX0FSR1VNRU5UU19MRU5HVEg9NDA5NjtmdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkoY29kZVBvaW50cyl7dmFyIGxlbj1jb2RlUG9pbnRzLmxlbmd0aDtpZihsZW48PU1BWF9BUkdVTUVOVFNfTEVOR1RIKXtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsY29kZVBvaW50cyl9dmFyIHJlcz0iIjt2YXIgaT0wO3doaWxlKGk8bGVuKXtyZXMrPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLGNvZGVQb2ludHMuc2xpY2UoaSxpKz1NQVhfQVJHVU1FTlRTX0xFTkdUSCkpfXJldHVybiByZXN9ZnVuY3Rpb24gYXNjaWlTbGljZShidWYsc3RhcnQsZW5kKXt2YXIgcmV0PSIiO2VuZD1NYXRoLm1pbihidWYubGVuZ3RoLGVuZCk7Zm9yKHZhciBpPXN0YXJ0O2k8ZW5kOysraSl7cmV0Kz1TdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSYxMjcpfXJldHVybiByZXR9ZnVuY3Rpb24gbGF0aW4xU2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIHJldD0iIjtlbmQ9TWF0aC5taW4oYnVmLmxlbmd0aCxlbmQpO2Zvcih2YXIgaT1zdGFydDtpPGVuZDsrK2kpe3JldCs9U3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pfXJldHVybiByZXR9ZnVuY3Rpb24gaGV4U2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIGxlbj1idWYubGVuZ3RoO2lmKCFzdGFydHx8c3RhcnQ8MClzdGFydD0wO2lmKCFlbmR8fGVuZDwwfHxlbmQ+bGVuKWVuZD1sZW47dmFyIG91dD0iIjtmb3IodmFyIGk9c3RhcnQ7aTxlbmQ7KytpKXtvdXQrPXRvSGV4KGJ1ZltpXSl9cmV0dXJuIG91dH1mdW5jdGlvbiB1dGYxNmxlU2xpY2UoYnVmLHN0YXJ0LGVuZCl7dmFyIGJ5dGVzPWJ1Zi5zbGljZShzdGFydCxlbmQpO3ZhciByZXM9IiI7Zm9yKHZhciBpPTA7aTxieXRlcy5sZW5ndGg7aSs9Mil7cmVzKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldK2J5dGVzW2krMV0qMjU2KX1yZXR1cm4gcmVzfUJ1ZmZlci5wcm90b3R5cGUuc2xpY2U9ZnVuY3Rpb24gc2xpY2Uoc3RhcnQsZW5kKXt2YXIgbGVuPXRoaXMubGVuZ3RoO3N0YXJ0PX5+c3RhcnQ7ZW5kPWVuZD09PXVuZGVmaW5lZD9sZW46fn5lbmQ7aWYoc3RhcnQ8MCl7c3RhcnQrPWxlbjtpZihzdGFydDwwKXN0YXJ0PTB9ZWxzZSBpZihzdGFydD5sZW4pe3N0YXJ0PWxlbn1pZihlbmQ8MCl7ZW5kKz1sZW47aWYoZW5kPDApZW5kPTB9ZWxzZSBpZihlbmQ+bGVuKXtlbmQ9bGVufWlmKGVuZDxzdGFydCllbmQ9c3RhcnQ7dmFyIG5ld0J1Zj10aGlzLnN1YmFycmF5KHN0YXJ0LGVuZCk7bmV3QnVmLl9fcHJvdG9fXz1CdWZmZXIucHJvdG90eXBlO3JldHVybiBuZXdCdWZ9O2Z1bmN0aW9uIGNoZWNrT2Zmc2V0KG9mZnNldCxleHQsbGVuZ3RoKXtpZihvZmZzZXQlMSE9PTB8fG9mZnNldDwwKXRocm93IG5ldyBSYW5nZUVycm9yKCJvZmZzZXQgaXMgbm90IHVpbnQiKTtpZihvZmZzZXQrZXh0Pmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCIpfUJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRT1mdW5jdGlvbiByZWFkVUludExFKG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsYnl0ZUxlbmd0aCx0aGlzLmxlbmd0aCk7dmFyIHZhbD10aGlzW29mZnNldF07dmFyIG11bD0xO3ZhciBpPTA7d2hpbGUoKytpPGJ5dGVMZW5ndGgmJihtdWwqPTI1Nikpe3ZhbCs9dGhpc1tvZmZzZXQraV0qbXVsfXJldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRT1mdW5jdGlvbiByZWFkVUludEJFKG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7Y2hlY2tPZmZzZXQob2Zmc2V0LGJ5dGVMZW5ndGgsdGhpcy5sZW5ndGgpfXZhciB2YWw9dGhpc1tvZmZzZXQrLS1ieXRlTGVuZ3RoXTt2YXIgbXVsPTE7d2hpbGUoYnl0ZUxlbmd0aD4wJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0Ky0tYnl0ZUxlbmd0aF0qbXVsfXJldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4PWZ1bmN0aW9uIHJlYWRVSW50OChvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsMSx0aGlzLmxlbmd0aCk7cmV0dXJuIHRoaXNbb2Zmc2V0XX07QnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEU9ZnVuY3Rpb24gcmVhZFVJbnQxNkxFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCwyLHRoaXMubGVuZ3RoKTtyZXR1cm4gdGhpc1tvZmZzZXRdfHRoaXNbb2Zmc2V0KzFdPDw4fTtCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRT1mdW5jdGlvbiByZWFkVUludDE2QkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDIsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF08PDh8dGhpc1tvZmZzZXQrMV19O0J1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFPWZ1bmN0aW9uIHJlYWRVSW50MzJMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsNCx0aGlzLmxlbmd0aCk7cmV0dXJuKHRoaXNbb2Zmc2V0XXx0aGlzW29mZnNldCsxXTw8OHx0aGlzW29mZnNldCsyXTw8MTYpK3RoaXNbb2Zmc2V0KzNdKjE2Nzc3MjE2fTtCdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRT1mdW5jdGlvbiByZWFkVUludDMyQkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDQsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF0qMTY3NzcyMTYrKHRoaXNbb2Zmc2V0KzFdPDwxNnx0aGlzW29mZnNldCsyXTw8OHx0aGlzW29mZnNldCszXSl9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludExFPWZ1bmN0aW9uIHJlYWRJbnRMRShvZmZzZXQsYnl0ZUxlbmd0aCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7Ynl0ZUxlbmd0aD1ieXRlTGVuZ3RoPj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LGJ5dGVMZW5ndGgsdGhpcy5sZW5ndGgpO3ZhciB2YWw9dGhpc1tvZmZzZXRdO3ZhciBtdWw9MTt2YXIgaT0wO3doaWxlKCsraTxieXRlTGVuZ3RoJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0K2ldKm11bH1tdWwqPTEyODtpZih2YWw+PW11bCl2YWwtPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKTtyZXR1cm4gdmFsfTtCdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRT1mdW5jdGlvbiByZWFkSW50QkUob2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2J5dGVMZW5ndGg9Ynl0ZUxlbmd0aD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCxieXRlTGVuZ3RoLHRoaXMubGVuZ3RoKTt2YXIgaT1ieXRlTGVuZ3RoO3ZhciBtdWw9MTt2YXIgdmFsPXRoaXNbb2Zmc2V0Ky0taV07d2hpbGUoaT4wJiYobXVsKj0yNTYpKXt2YWwrPXRoaXNbb2Zmc2V0Ky0taV0qbXVsfW11bCo9MTI4O2lmKHZhbD49bXVsKXZhbC09TWF0aC5wb3coMiw4KmJ5dGVMZW5ndGgpO3JldHVybiB2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDg9ZnVuY3Rpb24gcmVhZEludDgob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDEsdGhpcy5sZW5ndGgpO2lmKCEodGhpc1tvZmZzZXRdJjEyOCkpcmV0dXJuIHRoaXNbb2Zmc2V0XTtyZXR1cm4oMjU1LXRoaXNbb2Zmc2V0XSsxKSotMX07QnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRT1mdW5jdGlvbiByZWFkSW50MTZMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsMix0aGlzLmxlbmd0aCk7dmFyIHZhbD10aGlzW29mZnNldF18dGhpc1tvZmZzZXQrMV08PDg7cmV0dXJuIHZhbCYzMjc2OD92YWx8NDI5NDkwMTc2MDp2YWx9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkU9ZnVuY3Rpb24gcmVhZEludDE2QkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDIsdGhpcy5sZW5ndGgpO3ZhciB2YWw9dGhpc1tvZmZzZXQrMV18dGhpc1tvZmZzZXRdPDw4O3JldHVybiB2YWwmMzI3Njg/dmFsfDQyOTQ5MDE3NjA6dmFsfTtCdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFPWZ1bmN0aW9uIHJlYWRJbnQzMkxFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw0LHRoaXMubGVuZ3RoKTtyZXR1cm4gdGhpc1tvZmZzZXRdfHRoaXNbb2Zmc2V0KzFdPDw4fHRoaXNbb2Zmc2V0KzJdPDwxNnx0aGlzW29mZnNldCszXTw8MjR9O0J1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkU9ZnVuY3Rpb24gcmVhZEludDMyQkUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDQsdGhpcy5sZW5ndGgpO3JldHVybiB0aGlzW29mZnNldF08PDI0fHRoaXNbb2Zmc2V0KzFdPDwxNnx0aGlzW29mZnNldCsyXTw8OHx0aGlzW29mZnNldCszXX07QnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRT1mdW5jdGlvbiByZWFkRmxvYXRMRShvZmZzZXQsbm9Bc3NlcnQpe29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja09mZnNldChvZmZzZXQsNCx0aGlzLmxlbmd0aCk7cmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLG9mZnNldCx0cnVlLDIzLDQpfTtCdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFPWZ1bmN0aW9uIHJlYWRGbG9hdEJFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw0LHRoaXMubGVuZ3RoKTtyZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsb2Zmc2V0LGZhbHNlLDIzLDQpfTtCdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRT1mdW5jdGlvbiByZWFkRG91YmxlTEUob2Zmc2V0LG5vQXNzZXJ0KXtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tPZmZzZXQob2Zmc2V0LDgsdGhpcy5sZW5ndGgpO3JldHVybiBpZWVlNzU0LnJlYWQodGhpcyxvZmZzZXQsdHJ1ZSw1Miw4KX07QnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkU9ZnVuY3Rpb24gcmVhZERvdWJsZUJFKG9mZnNldCxub0Fzc2VydCl7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrT2Zmc2V0KG9mZnNldCw4LHRoaXMubGVuZ3RoKTtyZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsb2Zmc2V0LGZhbHNlLDUyLDgpfTtmdW5jdGlvbiBjaGVja0ludChidWYsdmFsdWUsb2Zmc2V0LGV4dCxtYXgsbWluKXtpZighQnVmZmVyLmlzQnVmZmVyKGJ1ZikpdGhyb3cgbmV3IFR5cGVFcnJvcignImJ1ZmZlciIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpO2lmKHZhbHVlPm1heHx8dmFsdWU8bWluKXRocm93IG5ldyBSYW5nZUVycm9yKCcidmFsdWUiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKTtpZihvZmZzZXQrZXh0PmJ1Zi5sZW5ndGgpdGhyb3cgbmV3IFJhbmdlRXJyb3IoIkluZGV4IG91dCBvZiByYW5nZSIpfUJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEU9ZnVuY3Rpb24gd3JpdGVVSW50TEUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7dmFyIG1heEJ5dGVzPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKS0xO2NoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbWF4Qnl0ZXMsMCl9dmFyIG11bD0xO3ZhciBpPTA7dGhpc1tvZmZzZXRdPXZhbHVlJjI1NTt3aGlsZSgrK2k8Ynl0ZUxlbmd0aCYmKG11bCo9MjU2KSl7dGhpc1tvZmZzZXQraV09dmFsdWUvbXVsJjI1NX1yZXR1cm4gb2Zmc2V0K2J5dGVMZW5ndGh9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkU9ZnVuY3Rpb24gd3JpdGVVSW50QkUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtieXRlTGVuZ3RoPWJ5dGVMZW5ndGg+Pj4wO2lmKCFub0Fzc2VydCl7dmFyIG1heEJ5dGVzPU1hdGgucG93KDIsOCpieXRlTGVuZ3RoKS0xO2NoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbWF4Qnl0ZXMsMCl9dmFyIGk9Ynl0ZUxlbmd0aC0xO3ZhciBtdWw9MTt0aGlzW29mZnNldCtpXT12YWx1ZSYyNTU7d2hpbGUoLS1pPj0wJiYobXVsKj0yNTYpKXt0aGlzW29mZnNldCtpXT12YWx1ZS9tdWwmMjU1fXJldHVybiBvZmZzZXQrYnl0ZUxlbmd0aH07QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4PWZ1bmN0aW9uIHdyaXRlVUludDgodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDEsMjU1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7cmV0dXJuIG9mZnNldCsxfTtCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEU9ZnVuY3Rpb24gd3JpdGVVSW50MTZMRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsMiw2NTUzNSwwKTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+ODtyZXR1cm4gb2Zmc2V0KzJ9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRT1mdW5jdGlvbiB3cml0ZVVJbnQxNkJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCwyLDY1NTM1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZT4+Pjg7dGhpc1tvZmZzZXQrMV09dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrMn07QnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFPWZ1bmN0aW9uIHdyaXRlVUludDMyTEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDQsNDI5NDk2NzI5NSwwKTt0aGlzW29mZnNldCszXT12YWx1ZT4+PjI0O3RoaXNbb2Zmc2V0KzJdPXZhbHVlPj4+MTY7dGhpc1tvZmZzZXQrMV09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7cmV0dXJuIG9mZnNldCs0fTtCdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkU9ZnVuY3Rpb24gd3JpdGVVSW50MzJCRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsNCw0Mjk0OTY3Mjk1LDApO3RoaXNbb2Zmc2V0XT12YWx1ZT4+PjI0O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+MTY7dGhpc1tvZmZzZXQrMl09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0KzNdPXZhbHVlJjI1NTtyZXR1cm4gb2Zmc2V0KzR9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRT1mdW5jdGlvbiB3cml0ZUludExFKHZhbHVlLG9mZnNldCxieXRlTGVuZ3RoLG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KXt2YXIgbGltaXQ9TWF0aC5wb3coMiw4KmJ5dGVMZW5ndGgtMSk7Y2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsYnl0ZUxlbmd0aCxsaW1pdC0xLC1saW1pdCl9dmFyIGk9MDt2YXIgbXVsPTE7dmFyIHN1Yj0wO3RoaXNbb2Zmc2V0XT12YWx1ZSYyNTU7d2hpbGUoKytpPGJ5dGVMZW5ndGgmJihtdWwqPTI1Nikpe2lmKHZhbHVlPDAmJnN1Yj09PTAmJnRoaXNbb2Zmc2V0K2ktMV0hPT0wKXtzdWI9MX10aGlzW29mZnNldCtpXT0odmFsdWUvbXVsPj4wKS1zdWImMjU1fXJldHVybiBvZmZzZXQrYnl0ZUxlbmd0aH07QnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFPWZ1bmN0aW9uIHdyaXRlSW50QkUodmFsdWUsb2Zmc2V0LGJ5dGVMZW5ndGgsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpe3ZhciBsaW1pdD1NYXRoLnBvdygyLDgqYnl0ZUxlbmd0aC0xKTtjaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCxieXRlTGVuZ3RoLGxpbWl0LTEsLWxpbWl0KX12YXIgaT1ieXRlTGVuZ3RoLTE7dmFyIG11bD0xO3ZhciBzdWI9MDt0aGlzW29mZnNldCtpXT12YWx1ZSYyNTU7d2hpbGUoLS1pPj0wJiYobXVsKj0yNTYpKXtpZih2YWx1ZTwwJiZzdWI9PT0wJiZ0aGlzW29mZnNldCtpKzFdIT09MCl7c3ViPTF9dGhpc1tvZmZzZXQraV09KHZhbHVlL211bD4+MCktc3ViJjI1NX1yZXR1cm4gb2Zmc2V0K2J5dGVMZW5ndGh9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4PWZ1bmN0aW9uIHdyaXRlSW50OCh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsMSwxMjcsLTEyOCk7aWYodmFsdWU8MCl2YWx1ZT0yNTUrdmFsdWUrMTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrMX07QnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEU9ZnVuY3Rpb24gd3JpdGVJbnQxNkxFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCljaGVja0ludCh0aGlzLHZhbHVlLG9mZnNldCwyLDMyNzY3LC0zMjc2OCk7dGhpc1tvZmZzZXRdPXZhbHVlJjI1NTt0aGlzW29mZnNldCsxXT12YWx1ZT4+Pjg7cmV0dXJuIG9mZnNldCsyfTtCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRT1mdW5jdGlvbiB3cml0ZUludDE2QkUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDIsMzI3NjcsLTMyNzY4KTt0aGlzW29mZnNldF09dmFsdWU+Pj44O3RoaXNbb2Zmc2V0KzFdPXZhbHVlJjI1NTtyZXR1cm4gb2Zmc2V0KzJ9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFPWZ1bmN0aW9uIHdyaXRlSW50MzJMRSh2YWx1ZSxvZmZzZXQsbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpY2hlY2tJbnQodGhpcyx2YWx1ZSxvZmZzZXQsNCwyMTQ3NDgzNjQ3LC0yMTQ3NDgzNjQ4KTt0aGlzW29mZnNldF09dmFsdWUmMjU1O3RoaXNbb2Zmc2V0KzFdPXZhbHVlPj4+ODt0aGlzW29mZnNldCsyXT12YWx1ZT4+PjE2O3RoaXNbb2Zmc2V0KzNdPXZhbHVlPj4+MjQ7cmV0dXJuIG9mZnNldCs0fTtCdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRT1mdW5jdGlvbiB3cml0ZUludDMyQkUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXt2YWx1ZT0rdmFsdWU7b2Zmc2V0PW9mZnNldD4+PjA7aWYoIW5vQXNzZXJ0KWNoZWNrSW50KHRoaXMsdmFsdWUsb2Zmc2V0LDQsMjE0NzQ4MzY0NywtMjE0NzQ4MzY0OCk7aWYodmFsdWU8MCl2YWx1ZT00Mjk0OTY3Mjk1K3ZhbHVlKzE7dGhpc1tvZmZzZXRdPXZhbHVlPj4+MjQ7dGhpc1tvZmZzZXQrMV09dmFsdWU+Pj4xNjt0aGlzW29mZnNldCsyXT12YWx1ZT4+Pjg7dGhpc1tvZmZzZXQrM109dmFsdWUmMjU1O3JldHVybiBvZmZzZXQrNH07ZnVuY3Rpb24gY2hlY2tJRUVFNzU0KGJ1Zix2YWx1ZSxvZmZzZXQsZXh0LG1heCxtaW4pe2lmKG9mZnNldCtleHQ+YnVmLmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiSW5kZXggb3V0IG9mIHJhbmdlIik7aWYob2Zmc2V0PDApdGhyb3cgbmV3IFJhbmdlRXJyb3IoIkluZGV4IG91dCBvZiByYW5nZSIpfWZ1bmN0aW9uIHdyaXRlRmxvYXQoYnVmLHZhbHVlLG9mZnNldCxsaXR0bGVFbmRpYW4sbm9Bc3NlcnQpe3ZhbHVlPSt2YWx1ZTtvZmZzZXQ9b2Zmc2V0Pj4+MDtpZighbm9Bc3NlcnQpe2NoZWNrSUVFRTc1NChidWYsdmFsdWUsb2Zmc2V0LDQsMzQwMjgyMzQ2NjM4NTI4ODZlMjIsLTM0MDI4MjM0NjYzODUyODg2ZTIyKX1pZWVlNzU0LndyaXRlKGJ1Zix2YWx1ZSxvZmZzZXQsbGl0dGxlRW5kaWFuLDIzLDQpO3JldHVybiBvZmZzZXQrNH1CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRT1mdW5jdGlvbiB3cml0ZUZsb2F0TEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXtyZXR1cm4gd3JpdGVGbG9hdCh0aGlzLHZhbHVlLG9mZnNldCx0cnVlLG5vQXNzZXJ0KX07QnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkU9ZnVuY3Rpb24gd3JpdGVGbG9hdEJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7cmV0dXJuIHdyaXRlRmxvYXQodGhpcyx2YWx1ZSxvZmZzZXQsZmFsc2Usbm9Bc3NlcnQpfTtmdW5jdGlvbiB3cml0ZURvdWJsZShidWYsdmFsdWUsb2Zmc2V0LGxpdHRsZUVuZGlhbixub0Fzc2VydCl7dmFsdWU9K3ZhbHVlO29mZnNldD1vZmZzZXQ+Pj4wO2lmKCFub0Fzc2VydCl7Y2hlY2tJRUVFNzU0KGJ1Zix2YWx1ZSxvZmZzZXQsOCwxNzk3NjkzMTM0ODYyMzE1N2UyOTIsLTE3OTc2OTMxMzQ4NjIzMTU3ZTI5Mil9aWVlZTc1NC53cml0ZShidWYsdmFsdWUsb2Zmc2V0LGxpdHRsZUVuZGlhbiw1Miw4KTtyZXR1cm4gb2Zmc2V0Kzh9QnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFPWZ1bmN0aW9uIHdyaXRlRG91YmxlTEUodmFsdWUsb2Zmc2V0LG5vQXNzZXJ0KXtyZXR1cm4gd3JpdGVEb3VibGUodGhpcyx2YWx1ZSxvZmZzZXQsdHJ1ZSxub0Fzc2VydCl9O0J1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRT1mdW5jdGlvbiB3cml0ZURvdWJsZUJFKHZhbHVlLG9mZnNldCxub0Fzc2VydCl7cmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsdmFsdWUsb2Zmc2V0LGZhbHNlLG5vQXNzZXJ0KX07QnVmZmVyLnByb3RvdHlwZS5jb3B5PWZ1bmN0aW9uIGNvcHkodGFyZ2V0LHRhcmdldFN0YXJ0LHN0YXJ0LGVuZCl7aWYoIUJ1ZmZlci5pc0J1ZmZlcih0YXJnZXQpKXRocm93IG5ldyBUeXBlRXJyb3IoImFyZ3VtZW50IHNob3VsZCBiZSBhIEJ1ZmZlciIpO2lmKCFzdGFydClzdGFydD0wO2lmKCFlbmQmJmVuZCE9PTApZW5kPXRoaXMubGVuZ3RoO2lmKHRhcmdldFN0YXJ0Pj10YXJnZXQubGVuZ3RoKXRhcmdldFN0YXJ0PXRhcmdldC5sZW5ndGg7aWYoIXRhcmdldFN0YXJ0KXRhcmdldFN0YXJ0PTA7aWYoZW5kPjAmJmVuZDxzdGFydCllbmQ9c3RhcnQ7aWYoZW5kPT09c3RhcnQpcmV0dXJuIDA7aWYodGFyZ2V0Lmxlbmd0aD09PTB8fHRoaXMubGVuZ3RoPT09MClyZXR1cm4gMDtpZih0YXJnZXRTdGFydDwwKXt0aHJvdyBuZXcgUmFuZ2VFcnJvcigidGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcyIpfWlmKHN0YXJ0PDB8fHN0YXJ0Pj10aGlzLmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcigiSW5kZXggb3V0IG9mIHJhbmdlIik7aWYoZW5kPDApdGhyb3cgbmV3IFJhbmdlRXJyb3IoInNvdXJjZUVuZCBvdXQgb2YgYm91bmRzIik7aWYoZW5kPnRoaXMubGVuZ3RoKWVuZD10aGlzLmxlbmd0aDtpZih0YXJnZXQubGVuZ3RoLXRhcmdldFN0YXJ0PGVuZC1zdGFydCl7ZW5kPXRhcmdldC5sZW5ndGgtdGFyZ2V0U3RhcnQrc3RhcnR9dmFyIGxlbj1lbmQtc3RhcnQ7aWYodGhpcz09PXRhcmdldCYmdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW49PT0iZnVuY3Rpb24iKXt0aGlzLmNvcHlXaXRoaW4odGFyZ2V0U3RhcnQsc3RhcnQsZW5kKX1lbHNlIGlmKHRoaXM9PT10YXJnZXQmJnN0YXJ0PHRhcmdldFN0YXJ0JiZ0YXJnZXRTdGFydDxlbmQpe2Zvcih2YXIgaT1sZW4tMTtpPj0wOy0taSl7dGFyZ2V0W2krdGFyZ2V0U3RhcnRdPXRoaXNbaStzdGFydF19fWVsc2V7VWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwodGFyZ2V0LHRoaXMuc3ViYXJyYXkoc3RhcnQsZW5kKSx0YXJnZXRTdGFydCl9cmV0dXJuIGxlbn07QnVmZmVyLnByb3RvdHlwZS5maWxsPWZ1bmN0aW9uIGZpbGwodmFsLHN0YXJ0LGVuZCxlbmNvZGluZyl7aWYodHlwZW9mIHZhbD09PSJzdHJpbmciKXtpZih0eXBlb2Ygc3RhcnQ9PT0ic3RyaW5nIil7ZW5jb2Rpbmc9c3RhcnQ7c3RhcnQ9MDtlbmQ9dGhpcy5sZW5ndGh9ZWxzZSBpZih0eXBlb2YgZW5kPT09InN0cmluZyIpe2VuY29kaW5nPWVuZDtlbmQ9dGhpcy5sZW5ndGh9aWYoZW5jb2RpbmchPT11bmRlZmluZWQmJnR5cGVvZiBlbmNvZGluZyE9PSJzdHJpbmciKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nIil9aWYodHlwZW9mIGVuY29kaW5nPT09InN0cmluZyImJiFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpe3Rocm93IG5ldyBUeXBlRXJyb3IoIlVua25vd24gZW5jb2Rpbmc6ICIrZW5jb2RpbmcpfWlmKHZhbC5sZW5ndGg9PT0xKXt2YXIgY29kZT12YWwuY2hhckNvZGVBdCgwKTtpZihlbmNvZGluZz09PSJ1dGY4IiYmY29kZTwxMjh8fGVuY29kaW5nPT09ImxhdGluMSIpe3ZhbD1jb2RlfX19ZWxzZSBpZih0eXBlb2YgdmFsPT09Im51bWJlciIpe3ZhbD12YWwmMjU1fWlmKHN0YXJ0PDB8fHRoaXMubGVuZ3RoPHN0YXJ0fHx0aGlzLmxlbmd0aDxlbmQpe3Rocm93IG5ldyBSYW5nZUVycm9yKCJPdXQgb2YgcmFuZ2UgaW5kZXgiKX1pZihlbmQ8PXN0YXJ0KXtyZXR1cm4gdGhpc31zdGFydD1zdGFydD4+PjA7ZW5kPWVuZD09PXVuZGVmaW5lZD90aGlzLmxlbmd0aDplbmQ+Pj4wO2lmKCF2YWwpdmFsPTA7dmFyIGk7aWYodHlwZW9mIHZhbD09PSJudW1iZXIiKXtmb3IoaT1zdGFydDtpPGVuZDsrK2kpe3RoaXNbaV09dmFsfX1lbHNle3ZhciBieXRlcz1CdWZmZXIuaXNCdWZmZXIodmFsKT92YWw6QnVmZmVyLmZyb20odmFsLGVuY29kaW5nKTt2YXIgbGVuPWJ5dGVzLmxlbmd0aDtpZihsZW49PT0wKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgdmFsdWUgIicrdmFsKyciIGlzIGludmFsaWQgZm9yIGFyZ3VtZW50ICJ2YWx1ZSInKX1mb3IoaT0wO2k8ZW5kLXN0YXJ0OysraSl7dGhpc1tpK3N0YXJ0XT1ieXRlc1tpJWxlbl19fXJldHVybiB0aGlzfTt2YXIgSU5WQUxJRF9CQVNFNjRfUkU9L1teKy8wLTlBLVphLXotX10vZztmdW5jdGlvbiBiYXNlNjRjbGVhbihzdHIpe3N0cj1zdHIuc3BsaXQoIj0iKVswXTtzdHI9c3RyLnRyaW0oKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCIiKTtpZihzdHIubGVuZ3RoPDIpcmV0dXJuIiI7d2hpbGUoc3RyLmxlbmd0aCU0IT09MCl7c3RyPXN0cisiPSJ9cmV0dXJuIHN0cn1mdW5jdGlvbiB0b0hleChuKXtpZihuPDE2KXJldHVybiIwIituLnRvU3RyaW5nKDE2KTtyZXR1cm4gbi50b1N0cmluZygxNil9ZnVuY3Rpb24gdXRmOFRvQnl0ZXMoc3RyaW5nLHVuaXRzKXt1bml0cz11bml0c3x8SW5maW5pdHk7dmFyIGNvZGVQb2ludDt2YXIgbGVuZ3RoPXN0cmluZy5sZW5ndGg7dmFyIGxlYWRTdXJyb2dhdGU9bnVsbDt2YXIgYnl0ZXM9W107Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXtjb2RlUG9pbnQ9c3RyaW5nLmNoYXJDb2RlQXQoaSk7aWYoY29kZVBvaW50PjU1Mjk1JiZjb2RlUG9pbnQ8NTczNDQpe2lmKCFsZWFkU3Vycm9nYXRlKXtpZihjb2RlUG9pbnQ+NTYzMTkpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSk7Y29udGludWV9ZWxzZSBpZihpKzE9PT1sZW5ndGgpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSk7Y29udGludWV9bGVhZFN1cnJvZ2F0ZT1jb2RlUG9pbnQ7Y29udGludWV9aWYoY29kZVBvaW50PDU2MzIwKXtpZigodW5pdHMtPTMpPi0xKWJ5dGVzLnB1c2goMjM5LDE5MSwxODkpO2xlYWRTdXJyb2dhdGU9Y29kZVBvaW50O2NvbnRpbnVlfWNvZGVQb2ludD0obGVhZFN1cnJvZ2F0ZS01NTI5Njw8MTB8Y29kZVBvaW50LTU2MzIwKSs2NTUzNn1lbHNlIGlmKGxlYWRTdXJyb2dhdGUpe2lmKCh1bml0cy09Myk+LTEpYnl0ZXMucHVzaCgyMzksMTkxLDE4OSl9bGVhZFN1cnJvZ2F0ZT1udWxsO2lmKGNvZGVQb2ludDwxMjgpe2lmKCh1bml0cy09MSk8MClicmVhaztieXRlcy5wdXNoKGNvZGVQb2ludCl9ZWxzZSBpZihjb2RlUG9pbnQ8MjA0OCl7aWYoKHVuaXRzLT0yKTwwKWJyZWFrO2J5dGVzLnB1c2goY29kZVBvaW50Pj42fDE5Mixjb2RlUG9pbnQmNjN8MTI4KX1lbHNlIGlmKGNvZGVQb2ludDw2NTUzNil7aWYoKHVuaXRzLT0zKTwwKWJyZWFrO2J5dGVzLnB1c2goY29kZVBvaW50Pj4xMnwyMjQsY29kZVBvaW50Pj42JjYzfDEyOCxjb2RlUG9pbnQmNjN8MTI4KX1lbHNlIGlmKGNvZGVQb2ludDwxMTE0MTEyKXtpZigodW5pdHMtPTQpPDApYnJlYWs7Ynl0ZXMucHVzaChjb2RlUG9pbnQ+PjE4fDI0MCxjb2RlUG9pbnQ+PjEyJjYzfDEyOCxjb2RlUG9pbnQ+PjYmNjN8MTI4LGNvZGVQb2ludCY2M3wxMjgpfWVsc2V7dGhyb3cgbmV3IEVycm9yKCJJbnZhbGlkIGNvZGUgcG9pbnQiKX19cmV0dXJuIGJ5dGVzfWZ1bmN0aW9uIGFzY2lpVG9CeXRlcyhzdHIpe3ZhciBieXRlQXJyYXk9W107Zm9yKHZhciBpPTA7aTxzdHIubGVuZ3RoOysraSl7Ynl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkmMjU1KX1yZXR1cm4gYnl0ZUFycmF5fWZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzKHN0cix1bml0cyl7dmFyIGMsaGksbG87dmFyIGJ5dGVBcnJheT1bXTtmb3IodmFyIGk9MDtpPHN0ci5sZW5ndGg7KytpKXtpZigodW5pdHMtPTIpPDApYnJlYWs7Yz1zdHIuY2hhckNvZGVBdChpKTtoaT1jPj44O2xvPWMlMjU2O2J5dGVBcnJheS5wdXNoKGxvKTtieXRlQXJyYXkucHVzaChoaSl9cmV0dXJuIGJ5dGVBcnJheX1mdW5jdGlvbiBiYXNlNjRUb0J5dGVzKHN0cil7cmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKX1mdW5jdGlvbiBibGl0QnVmZmVyKHNyYyxkc3Qsb2Zmc2V0LGxlbmd0aCl7Zm9yKHZhciBpPTA7aTxsZW5ndGg7KytpKXtpZihpK29mZnNldD49ZHN0Lmxlbmd0aHx8aT49c3JjLmxlbmd0aClicmVhaztkc3RbaStvZmZzZXRdPXNyY1tpXX1yZXR1cm4gaX1mdW5jdGlvbiBpc0luc3RhbmNlKG9iaix0eXBlKXtyZXR1cm4gb2JqIGluc3RhbmNlb2YgdHlwZXx8b2JqIT1udWxsJiZvYmouY29uc3RydWN0b3IhPW51bGwmJm9iai5jb25zdHJ1Y3Rvci5uYW1lIT1udWxsJiZvYmouY29uc3RydWN0b3IubmFtZT09PXR5cGUubmFtZX1mdW5jdGlvbiBudW1iZXJJc05hTihvYmope3JldHVybiBvYmohPT1vYmp9fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiYmFzZTY0LWpzIjoyMixidWZmZXI6MjUsaWVlZTc1NDozM31dLDI2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBUcmFuc2Zvcm09cmVxdWlyZSgic3RyZWFtIikuVHJhbnNmb3JtO3ZhciBTdHJpbmdEZWNvZGVyPXJlcXVpcmUoInN0cmluZ19kZWNvZGVyIikuU3RyaW5nRGVjb2Rlcjt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTtmdW5jdGlvbiBDaXBoZXJCYXNlKGhhc2hNb2RlKXtUcmFuc2Zvcm0uY2FsbCh0aGlzKTt0aGlzLmhhc2hNb2RlPXR5cGVvZiBoYXNoTW9kZT09PSJzdHJpbmciO2lmKHRoaXMuaGFzaE1vZGUpe3RoaXNbaGFzaE1vZGVdPXRoaXMuX2ZpbmFsT3JEaWdlc3R9ZWxzZXt0aGlzLmZpbmFsPXRoaXMuX2ZpbmFsT3JEaWdlc3R9aWYodGhpcy5fZmluYWwpe3RoaXMuX19maW5hbD10aGlzLl9maW5hbDt0aGlzLl9maW5hbD1udWxsfXRoaXMuX2RlY29kZXI9bnVsbDt0aGlzLl9lbmNvZGluZz1udWxsfWluaGVyaXRzKENpcGhlckJhc2UsVHJhbnNmb3JtKTtDaXBoZXJCYXNlLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oZGF0YSxpbnB1dEVuYyxvdXRwdXRFbmMpe2lmKHR5cGVvZiBkYXRhPT09InN0cmluZyIpe2RhdGE9QnVmZmVyLmZyb20oZGF0YSxpbnB1dEVuYyl9dmFyIG91dERhdGE9dGhpcy5fdXBkYXRlKGRhdGEpO2lmKHRoaXMuaGFzaE1vZGUpcmV0dXJuIHRoaXM7aWYob3V0cHV0RW5jKXtvdXREYXRhPXRoaXMuX3RvU3RyaW5nKG91dERhdGEsb3V0cHV0RW5jKX1yZXR1cm4gb3V0RGF0YX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuc2V0QXV0b1BhZGRpbmc9ZnVuY3Rpb24oKXt9O0NpcGhlckJhc2UucHJvdG90eXBlLmdldEF1dGhUYWc9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoInRyeWluZyB0byBnZXQgYXV0aCB0YWcgaW4gdW5zdXBwb3J0ZWQgc3RhdGUiKX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuc2V0QXV0aFRhZz1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcigidHJ5aW5nIHRvIHNldCBhdXRoIHRhZyBpbiB1bnN1cHBvcnRlZCBzdGF0ZSIpfTtDaXBoZXJCYXNlLnByb3RvdHlwZS5zZXRBQUQ9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoInRyeWluZyB0byBzZXQgYWFkIGluIHVuc3VwcG9ydGVkIHN0YXRlIil9O0NpcGhlckJhc2UucHJvdG90eXBlLl90cmFuc2Zvcm09ZnVuY3Rpb24oZGF0YSxfLG5leHQpe3ZhciBlcnI7dHJ5e2lmKHRoaXMuaGFzaE1vZGUpe3RoaXMuX3VwZGF0ZShkYXRhKX1lbHNle3RoaXMucHVzaCh0aGlzLl91cGRhdGUoZGF0YSkpfX1jYXRjaChlKXtlcnI9ZX1maW5hbGx5e25leHQoZXJyKX19O0NpcGhlckJhc2UucHJvdG90eXBlLl9mbHVzaD1mdW5jdGlvbihkb25lKXt2YXIgZXJyO3RyeXt0aGlzLnB1c2godGhpcy5fX2ZpbmFsKCkpfWNhdGNoKGUpe2Vycj1lfWRvbmUoZXJyKX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuX2ZpbmFsT3JEaWdlc3Q9ZnVuY3Rpb24ob3V0cHV0RW5jKXt2YXIgb3V0RGF0YT10aGlzLl9fZmluYWwoKXx8QnVmZmVyLmFsbG9jKDApO2lmKG91dHB1dEVuYyl7b3V0RGF0YT10aGlzLl90b1N0cmluZyhvdXREYXRhLG91dHB1dEVuYyx0cnVlKX1yZXR1cm4gb3V0RGF0YX07Q2lwaGVyQmFzZS5wcm90b3R5cGUuX3RvU3RyaW5nPWZ1bmN0aW9uKHZhbHVlLGVuYyxmaW4pe2lmKCF0aGlzLl9kZWNvZGVyKXt0aGlzLl9kZWNvZGVyPW5ldyBTdHJpbmdEZWNvZGVyKGVuYyk7dGhpcy5fZW5jb2Rpbmc9ZW5jfWlmKHRoaXMuX2VuY29kaW5nIT09ZW5jKXRocm93IG5ldyBFcnJvcigiY2FuJ3Qgc3dpdGNoIGVuY29kaW5ncyIpO3ZhciBvdXQ9dGhpcy5fZGVjb2Rlci53cml0ZSh2YWx1ZSk7aWYoZmluKXtvdXQrPXRoaXMuX2RlY29kZXIuZW5kKCl9cmV0dXJuIG91dH07bW9kdWxlLmV4cG9ydHM9Q2lwaGVyQmFzZX0se2luaGVyaXRzOjM0LCJzYWZlLWJ1ZmZlciI6Nzgsc3RyZWFtOjk3LHN0cmluZ19kZWNvZGVyOjk4fV0sMjc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXtPX1JET05MWTowLE9fV1JPTkxZOjEsT19SRFdSOjIsU19JRk1UOjYxNDQwLFNfSUZSRUc6MzI3NjgsU19JRkRJUjoxNjM4NCxTX0lGQ0hSOjgxOTIsU19JRkJMSzoyNDU3NixTX0lGSUZPOjQwOTYsU19JRkxOSzo0MDk2MCxTX0lGU09DSzo0OTE1MixPX0NSRUFUOjUxMixPX0VYQ0w6MjA0OCxPX05PQ1RUWToxMzEwNzIsT19UUlVOQzoxMDI0LE9fQVBQRU5EOjgsT19ESVJFQ1RPUlk6MTA0ODU3NixPX05PRk9MTE9XOjI1NixPX1NZTkM6MTI4LE9fU1lNTElOSzoyMDk3MTUyLE9fTk9OQkxPQ0s6NCxTX0lSV1hVOjQ0OCxTX0lSVVNSOjI1NixTX0lXVVNSOjEyOCxTX0lYVVNSOjY0LFNfSVJXWEc6NTYsU19JUkdSUDozMixTX0lXR1JQOjE2LFNfSVhHUlA6OCxTX0lSV1hPOjcsU19JUk9USDo0LFNfSVdPVEg6MixTX0lYT1RIOjEsRTJCSUc6NyxFQUNDRVM6MTMsRUFERFJJTlVTRTo0OCxFQUREUk5PVEFWQUlMOjQ5LEVBRk5PU1VQUE9SVDo0NyxFQUdBSU46MzUsRUFMUkVBRFk6MzcsRUJBREY6OSxFQkFETVNHOjk0LEVCVVNZOjE2LEVDQU5DRUxFRDo4OSxFQ0hJTEQ6MTAsRUNPTk5BQk9SVEVEOjUzLEVDT05OUkVGVVNFRDo2MSxFQ09OTlJFU0VUOjU0LEVERUFETEs6MTEsRURFU1RBRERSUkVROjM5LEVET006MzMsRURRVU9UOjY5LEVFWElTVDoxNyxFRkFVTFQ6MTQsRUZCSUc6MjcsRUhPU1RVTlJFQUNIOjY1LEVJRFJNOjkwLEVJTFNFUTo5MixFSU5QUk9HUkVTUzozNixFSU5UUjo0LEVJTlZBTDoyMixFSU86NSxFSVNDT05OOjU2LEVJU0RJUjoyMSxFTE9PUDo2MixFTUZJTEU6MjQsRU1MSU5LOjMxLEVNU0dTSVpFOjQwLEVNVUxUSUhPUDo5NSxFTkFNRVRPT0xPTkc6NjMsRU5FVERPV046NTAsRU5FVFJFU0VUOjUyLEVORVRVTlJFQUNIOjUxLEVORklMRToyMyxFTk9CVUZTOjU1LEVOT0RBVEE6OTYsRU5PREVWOjE5LEVOT0VOVDoyLEVOT0VYRUM6OCxFTk9MQ0s6NzcsRU5PTElOSzo5NyxFTk9NRU06MTIsRU5PTVNHOjkxLEVOT1BST1RPT1BUOjQyLEVOT1NQQzoyOCxFTk9TUjo5OCxFTk9TVFI6OTksRU5PU1lTOjc4LEVOT1RDT05OOjU3LEVOT1RESVI6MjAsRU5PVEVNUFRZOjY2LEVOT1RTT0NLOjM4LEVOT1RTVVA6NDUsRU5PVFRZOjI1LEVOWElPOjYsRU9QTk9UU1VQUDoxMDIsRU9WRVJGTE9XOjg0LEVQRVJNOjEsRVBJUEU6MzIsRVBST1RPOjEwMCxFUFJPVE9OT1NVUFBPUlQ6NDMsRVBST1RPVFlQRTo0MSxFUkFOR0U6MzQsRVJPRlM6MzAsRVNQSVBFOjI5LEVTUkNIOjMsRVNUQUxFOjcwLEVUSU1FOjEwMSxFVElNRURPVVQ6NjAsRVRYVEJTWToyNixFV09VTERCTE9DSzozNSxFWERFVjoxOCxTSUdIVVA6MSxTSUdJTlQ6MixTSUdRVUlUOjMsU0lHSUxMOjQsU0lHVFJBUDo1LFNJR0FCUlQ6NixTSUdJT1Q6NixTSUdCVVM6MTAsU0lHRlBFOjgsU0lHS0lMTDo5LFNJR1VTUjE6MzAsU0lHU0VHVjoxMSxTSUdVU1IyOjMxLFNJR1BJUEU6MTMsU0lHQUxSTToxNCxTSUdURVJNOjE1LFNJR0NITEQ6MjAsU0lHQ09OVDoxOSxTSUdTVE9QOjE3LFNJR1RTVFA6MTgsU0lHVFRJTjoyMSxTSUdUVE9VOjIyLFNJR1VSRzoxNixTSUdYQ1BVOjI0LFNJR1hGU1o6MjUsU0lHVlRBTFJNOjI2LFNJR1BST0Y6MjcsU0lHV0lOQ0g6MjgsU0lHSU86MjMsU0lHU1lTOjEyLFNTTF9PUF9BTEw6MjE0NzQ4NjcxOSxTU0xfT1BfQUxMT1dfVU5TQUZFX0xFR0FDWV9SRU5FR09USUFUSU9OOjI2MjE0NCxTU0xfT1BfQ0lQSEVSX1NFUlZFUl9QUkVGRVJFTkNFOjQxOTQzMDQsU1NMX09QX0NJU0NPX0FOWUNPTk5FQ1Q6MzI3NjgsU1NMX09QX0NPT0tJRV9FWENIQU5HRTo4MTkyLFNTTF9PUF9DUllQVE9QUk9fVExTRVhUX0JVRzoyMTQ3NDgzNjQ4LFNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFM6MjA0OCxTU0xfT1BfRVBIRU1FUkFMX1JTQTowLFNTTF9PUF9MRUdBQ1lfU0VSVkVSX0NPTk5FQ1Q6NCxTU0xfT1BfTUlDUk9TT0ZUX0JJR19TU0xWM19CVUZGRVI6MzIsU1NMX09QX01JQ1JPU09GVF9TRVNTX0lEX0JVRzoxLFNTTF9PUF9NU0lFX1NTTFYyX1JTQV9QQURESU5HOjAsU1NMX09QX05FVFNDQVBFX0NBX0ROX0JVRzo1MzY4NzA5MTIsU1NMX09QX05FVFNDQVBFX0NIQUxMRU5HRV9CVUc6MixTU0xfT1BfTkVUU0NBUEVfREVNT19DSVBIRVJfQ0hBTkdFX0JVRzoxMDczNzQxODI0LFNTTF9PUF9ORVRTQ0FQRV9SRVVTRV9DSVBIRVJfQ0hBTkdFX0JVRzo4LFNTTF9PUF9OT19DT01QUkVTU0lPTjoxMzEwNzIsU1NMX09QX05PX1FVRVJZX01UVTo0MDk2LFNTTF9PUF9OT19TRVNTSU9OX1JFU1VNUFRJT05fT05fUkVORUdPVElBVElPTjo2NTUzNixTU0xfT1BfTk9fU1NMdjI6MTY3NzcyMTYsU1NMX09QX05PX1NTTHYzOjMzNTU0NDMyLFNTTF9PUF9OT19USUNLRVQ6MTYzODQsU1NMX09QX05PX1RMU3YxOjY3MTA4ODY0LFNTTF9PUF9OT19UTFN2MV8xOjI2ODQzNTQ1NixTU0xfT1BfTk9fVExTdjFfMjoxMzQyMTc3MjgsU1NMX09QX1BLQ1MxX0NIRUNLXzE6MCxTU0xfT1BfUEtDUzFfQ0hFQ0tfMjowLFNTTF9PUF9TSU5HTEVfREhfVVNFOjEwNDg1NzYsU1NMX09QX1NJTkdMRV9FQ0RIX1VTRTo1MjQyODgsU1NMX09QX1NTTEVBWV8wODBfQ0xJRU5UX0RIX0JVRzoxMjgsU1NMX09QX1NTTFJFRjJfUkVVU0VfQ0VSVF9UWVBFX0JVRzowLFNTTF9PUF9UTFNfQkxPQ0tfUEFERElOR19CVUc6NTEyLFNTTF9PUF9UTFNfRDVfQlVHOjI1NixTU0xfT1BfVExTX1JPTExCQUNLX0JVRzo4Mzg4NjA4LEVOR0lORV9NRVRIT0RfRFNBOjIsRU5HSU5FX01FVEhPRF9ESDo0LEVOR0lORV9NRVRIT0RfUkFORDo4LEVOR0lORV9NRVRIT0RfRUNESDoxNixFTkdJTkVfTUVUSE9EX0VDRFNBOjMyLEVOR0lORV9NRVRIT0RfQ0lQSEVSUzo2NCxFTkdJTkVfTUVUSE9EX0RJR0VTVFM6MTI4LEVOR0lORV9NRVRIT0RfU1RPUkU6MjU2LEVOR0lORV9NRVRIT0RfUEtFWV9NRVRIUzo1MTIsRU5HSU5FX01FVEhPRF9QS0VZX0FTTjFfTUVUSFM6MTAyNCxFTkdJTkVfTUVUSE9EX0FMTDo2NTUzNSxFTkdJTkVfTUVUSE9EX05PTkU6MCxESF9DSEVDS19QX05PVF9TQUZFX1BSSU1FOjIsREhfQ0hFQ0tfUF9OT1RfUFJJTUU6MSxESF9VTkFCTEVfVE9fQ0hFQ0tfR0VORVJBVE9SOjQsREhfTk9UX1NVSVRBQkxFX0dFTkVSQVRPUjo4LE5QTl9FTkFCTEVEOjEsUlNBX1BLQ1MxX1BBRERJTkc6MSxSU0FfU1NMVjIzX1BBRERJTkc6MixSU0FfTk9fUEFERElORzozLFJTQV9QS0NTMV9PQUVQX1BBRERJTkc6NCxSU0FfWDkzMV9QQURESU5HOjUsUlNBX1BLQ1MxX1BTU19QQURESU5HOjYsUE9JTlRfQ09OVkVSU0lPTl9DT01QUkVTU0VEOjIsUE9JTlRfQ09OVkVSU0lPTl9VTkNPTVBSRVNTRUQ6NCxQT0lOVF9DT05WRVJTSU9OX0hZQlJJRDo2LEZfT0s6MCxSX09LOjQsV19PSzoyLFhfT0s6MSxVVl9VRFBfUkVVU0VBRERSOjR9fSx7fV0sMjg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe2Z1bmN0aW9uIGlzQXJyYXkoYXJnKXtpZihBcnJheS5pc0FycmF5KXtyZXR1cm4gQXJyYXkuaXNBcnJheShhcmcpfXJldHVybiBvYmplY3RUb1N0cmluZyhhcmcpPT09IltvYmplY3QgQXJyYXldIn1leHBvcnRzLmlzQXJyYXk9aXNBcnJheTtmdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKXtyZXR1cm4gdHlwZW9mIGFyZz09PSJib29sZWFuIn1leHBvcnRzLmlzQm9vbGVhbj1pc0Jvb2xlYW47ZnVuY3Rpb24gaXNOdWxsKGFyZyl7cmV0dXJuIGFyZz09PW51bGx9ZXhwb3J0cy5pc051bGw9aXNOdWxsO2Z1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09bnVsbH1leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkPWlzTnVsbE9yVW5kZWZpbmVkO2Z1bmN0aW9uIGlzTnVtYmVyKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ibnVtYmVyIn1leHBvcnRzLmlzTnVtYmVyPWlzTnVtYmVyO2Z1bmN0aW9uIGlzU3RyaW5nKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3RyaW5nIn1leHBvcnRzLmlzU3RyaW5nPWlzU3RyaW5nO2Z1bmN0aW9uIGlzU3ltYm9sKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0ic3ltYm9sIn1leHBvcnRzLmlzU3ltYm9sPWlzU3ltYm9sO2Z1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZyl7cmV0dXJuIGFyZz09PXZvaWQgMH1leHBvcnRzLmlzVW5kZWZpbmVkPWlzVW5kZWZpbmVkO2Z1bmN0aW9uIGlzUmVnRXhwKHJlKXtyZXR1cm4gb2JqZWN0VG9TdHJpbmcocmUpPT09IltvYmplY3QgUmVnRXhwXSJ9ZXhwb3J0cy5pc1JlZ0V4cD1pc1JlZ0V4cDtmdW5jdGlvbiBpc09iamVjdChhcmcpe3JldHVybiB0eXBlb2YgYXJnPT09Im9iamVjdCImJmFyZyE9PW51bGx9ZXhwb3J0cy5pc09iamVjdD1pc09iamVjdDtmdW5jdGlvbiBpc0RhdGUoZCl7cmV0dXJuIG9iamVjdFRvU3RyaW5nKGQpPT09IltvYmplY3QgRGF0ZV0ifWV4cG9ydHMuaXNEYXRlPWlzRGF0ZTtmdW5jdGlvbiBpc0Vycm9yKGUpe3JldHVybiBvYmplY3RUb1N0cmluZyhlKT09PSJbb2JqZWN0IEVycm9yXSJ8fGUgaW5zdGFuY2VvZiBFcnJvcn1leHBvcnRzLmlzRXJyb3I9aXNFcnJvcjtmdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZyl7cmV0dXJuIHR5cGVvZiBhcmc9PT0iZnVuY3Rpb24ifWV4cG9ydHMuaXNGdW5jdGlvbj1pc0Z1bmN0aW9uO2Z1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZyl7cmV0dXJuIGFyZz09PW51bGx8fHR5cGVvZiBhcmc9PT0iYm9vbGVhbiJ8fHR5cGVvZiBhcmc9PT0ibnVtYmVyInx8dHlwZW9mIGFyZz09PSJzdHJpbmcifHx0eXBlb2YgYXJnPT09InN5bWJvbCJ8fHR5cGVvZiBhcmc9PT0idW5kZWZpbmVkIn1leHBvcnRzLmlzUHJpbWl0aXZlPWlzUHJpbWl0aXZlO2V4cG9ydHMuaXNCdWZmZXI9QnVmZmVyLmlzQnVmZmVyO2Z1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyl9fSkuY2FsbCh0aGlzLHtpc0J1ZmZlcjpyZXF1aXJlKCIuLi8uLi9pcy1idWZmZXIvaW5kZXguanMiKX0pfSx7Ii4uLy4uL2lzLWJ1ZmZlci9pbmRleC5qcyI6MzV9XSwyOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBNRDU9cmVxdWlyZSgibWQ1LmpzIik7dmFyIFJJUEVNRDE2MD1yZXF1aXJlKCJyaXBlbWQxNjAiKTt2YXIgc2hhPXJlcXVpcmUoInNoYS5qcyIpO3ZhciBCYXNlPXJlcXVpcmUoImNpcGhlci1iYXNlIik7ZnVuY3Rpb24gSGFzaChoYXNoKXtCYXNlLmNhbGwodGhpcywiZGlnZXN0Iik7dGhpcy5faGFzaD1oYXNofWluaGVyaXRzKEhhc2gsQmFzZSk7SGFzaC5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihkYXRhKXt0aGlzLl9oYXNoLnVwZGF0ZShkYXRhKX07SGFzaC5wcm90b3R5cGUuX2ZpbmFsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2hhc2guZGlnZXN0KCl9O21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uIGNyZWF0ZUhhc2goYWxnKXthbGc9YWxnLnRvTG93ZXJDYXNlKCk7aWYoYWxnPT09Im1kNSIpcmV0dXJuIG5ldyBNRDU7aWYoYWxnPT09InJtZDE2MCJ8fGFsZz09PSJyaXBlbWQxNjAiKXJldHVybiBuZXcgUklQRU1EMTYwO3JldHVybiBuZXcgSGFzaChzaGEoYWxnKSl9fSx7ImNpcGhlci1iYXNlIjoyNixpbmhlcml0czozNCwibWQ1LmpzIjozNyxyaXBlbWQxNjA6NzcsInNoYS5qcyI6OTB9XSwzMDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIE1ENT1yZXF1aXJlKCJtZDUuanMiKTttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihidWZmZXIpe3JldHVybihuZXcgTUQ1KS51cGRhdGUoYnVmZmVyKS5kaWdlc3QoKX19LHsibWQ1LmpzIjozN31dLDMxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgb2JqZWN0Q3JlYXRlPU9iamVjdC5jcmVhdGV8fG9iamVjdENyZWF0ZVBvbHlmaWxsO3ZhciBvYmplY3RLZXlzPU9iamVjdC5rZXlzfHxvYmplY3RLZXlzUG9seWZpbGw7dmFyIGJpbmQ9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmR8fGZ1bmN0aW9uQmluZFBvbHlmaWxsO2Z1bmN0aW9uIEV2ZW50RW1pdHRlcigpe2lmKCF0aGlzLl9ldmVudHN8fCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcywiX2V2ZW50cyIpKXt0aGlzLl9ldmVudHM9b2JqZWN0Q3JlYXRlKG51bGwpO3RoaXMuX2V2ZW50c0NvdW50PTB9dGhpcy5fbWF4TGlzdGVuZXJzPXRoaXMuX21heExpc3RlbmVyc3x8dW5kZWZpbmVkfW1vZHVsZS5leHBvcnRzPUV2ZW50RW1pdHRlcjtFdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyPUV2ZW50RW1pdHRlcjtFdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHM9dW5kZWZpbmVkO0V2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycz11bmRlZmluZWQ7dmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnM9MTA7dmFyIGhhc0RlZmluZVByb3BlcnR5O3RyeXt2YXIgbz17fTtpZihPYmplY3QuZGVmaW5lUHJvcGVydHkpT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIngiLHt2YWx1ZTowfSk7aGFzRGVmaW5lUHJvcGVydHk9by54PT09MH1jYXRjaChlcnIpe2hhc0RlZmluZVByb3BlcnR5PWZhbHNlfWlmKGhhc0RlZmluZVByb3BlcnR5KXtPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCJkZWZhdWx0TWF4TGlzdGVuZXJzIix7ZW51bWVyYWJsZTp0cnVlLGdldDpmdW5jdGlvbigpe3JldHVybiBkZWZhdWx0TWF4TGlzdGVuZXJzfSxzZXQ6ZnVuY3Rpb24oYXJnKXtpZih0eXBlb2YgYXJnIT09Im51bWJlciJ8fGFyZzwwfHxhcmchPT1hcmcpdGhyb3cgbmV3IFR5cGVFcnJvcignImRlZmF1bHRNYXhMaXN0ZW5lcnMiIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtkZWZhdWx0TWF4TGlzdGVuZXJzPWFyZ319KX1lbHNle0V2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzPWRlZmF1bHRNYXhMaXN0ZW5lcnN9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnM9ZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pe2lmKHR5cGVvZiBuIT09Im51bWJlciJ8fG48MHx8aXNOYU4obikpdGhyb3cgbmV3IFR5cGVFcnJvcignIm4iIGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTt0aGlzLl9tYXhMaXN0ZW5lcnM9bjtyZXR1cm4gdGhpc307ZnVuY3Rpb24gJGdldE1heExpc3RlbmVycyh0aGF0KXtpZih0aGF0Ll9tYXhMaXN0ZW5lcnM9PT11bmRlZmluZWQpcmV0dXJuIEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO3JldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnN9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnM9ZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCl7cmV0dXJuICRnZXRNYXhMaXN0ZW5lcnModGhpcyl9O2Z1bmN0aW9uIGVtaXROb25lKGhhbmRsZXIsaXNGbixzZWxmKXtpZihpc0ZuKWhhbmRsZXIuY2FsbChzZWxmKTtlbHNle3ZhciBsZW49aGFuZGxlci5sZW5ndGg7dmFyIGxpc3RlbmVycz1hcnJheUNsb25lKGhhbmRsZXIsbGVuKTtmb3IodmFyIGk9MDtpPGxlbjsrK2kpbGlzdGVuZXJzW2ldLmNhbGwoc2VsZil9fWZ1bmN0aW9uIGVtaXRPbmUoaGFuZGxlcixpc0ZuLHNlbGYsYXJnMSl7aWYoaXNGbiloYW5kbGVyLmNhbGwoc2VsZixhcmcxKTtlbHNle3ZhciBsZW49aGFuZGxlci5sZW5ndGg7dmFyIGxpc3RlbmVycz1hcnJheUNsb25lKGhhbmRsZXIsbGVuKTtmb3IodmFyIGk9MDtpPGxlbjsrK2kpbGlzdGVuZXJzW2ldLmNhbGwoc2VsZixhcmcxKX19ZnVuY3Rpb24gZW1pdFR3byhoYW5kbGVyLGlzRm4sc2VsZixhcmcxLGFyZzIpe2lmKGlzRm4paGFuZGxlci5jYWxsKHNlbGYsYXJnMSxhcmcyKTtlbHNle3ZhciBsZW49aGFuZGxlci5sZW5ndGg7dmFyIGxpc3RlbmVycz1hcnJheUNsb25lKGhhbmRsZXIsbGVuKTtmb3IodmFyIGk9MDtpPGxlbjsrK2kpbGlzdGVuZXJzW2ldLmNhbGwoc2VsZixhcmcxLGFyZzIpfX1mdW5jdGlvbiBlbWl0VGhyZWUoaGFuZGxlcixpc0ZuLHNlbGYsYXJnMSxhcmcyLGFyZzMpe2lmKGlzRm4paGFuZGxlci5jYWxsKHNlbGYsYXJnMSxhcmcyLGFyZzMpO2Vsc2V7dmFyIGxlbj1oYW5kbGVyLmxlbmd0aDt2YXIgbGlzdGVuZXJzPWFycmF5Q2xvbmUoaGFuZGxlcixsZW4pO2Zvcih2YXIgaT0wO2k8bGVuOysraSlsaXN0ZW5lcnNbaV0uY2FsbChzZWxmLGFyZzEsYXJnMixhcmczKX19ZnVuY3Rpb24gZW1pdE1hbnkoaGFuZGxlcixpc0ZuLHNlbGYsYXJncyl7aWYoaXNGbiloYW5kbGVyLmFwcGx5KHNlbGYsYXJncyk7ZWxzZXt2YXIgbGVuPWhhbmRsZXIubGVuZ3RoO3ZhciBsaXN0ZW5lcnM9YXJyYXlDbG9uZShoYW5kbGVyLGxlbik7Zm9yKHZhciBpPTA7aTxsZW47KytpKWxpc3RlbmVyc1tpXS5hcHBseShzZWxmLGFyZ3MpfX1FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQ9ZnVuY3Rpb24gZW1pdCh0eXBlKXt2YXIgZXIsaGFuZGxlcixsZW4sYXJncyxpLGV2ZW50czt2YXIgZG9FcnJvcj10eXBlPT09ImVycm9yIjtldmVudHM9dGhpcy5fZXZlbnRzO2lmKGV2ZW50cylkb0Vycm9yPWRvRXJyb3ImJmV2ZW50cy5lcnJvcj09bnVsbDtlbHNlIGlmKCFkb0Vycm9yKXJldHVybiBmYWxzZTtpZihkb0Vycm9yKXtpZihhcmd1bWVudHMubGVuZ3RoPjEpZXI9YXJndW1lbnRzWzFdO2lmKGVyIGluc3RhbmNlb2YgRXJyb3Ipe3Rocm93IGVyfWVsc2V7dmFyIGVycj1uZXcgRXJyb3IoJ1VuaGFuZGxlZCAiZXJyb3IiIGV2ZW50LiAoJytlcisiKSIpO2Vyci5jb250ZXh0PWVyO3Rocm93IGVycn1yZXR1cm4gZmFsc2V9aGFuZGxlcj1ldmVudHNbdHlwZV07aWYoIWhhbmRsZXIpcmV0dXJuIGZhbHNlO3ZhciBpc0ZuPXR5cGVvZiBoYW5kbGVyPT09ImZ1bmN0aW9uIjtsZW49YXJndW1lbnRzLmxlbmd0aDtzd2l0Y2gobGVuKXtjYXNlIDE6ZW1pdE5vbmUoaGFuZGxlcixpc0ZuLHRoaXMpO2JyZWFrO2Nhc2UgMjplbWl0T25lKGhhbmRsZXIsaXNGbix0aGlzLGFyZ3VtZW50c1sxXSk7YnJlYWs7Y2FzZSAzOmVtaXRUd28oaGFuZGxlcixpc0ZuLHRoaXMsYXJndW1lbnRzWzFdLGFyZ3VtZW50c1syXSk7YnJlYWs7Y2FzZSA0OmVtaXRUaHJlZShoYW5kbGVyLGlzRm4sdGhpcyxhcmd1bWVudHNbMV0sYXJndW1lbnRzWzJdLGFyZ3VtZW50c1szXSk7YnJlYWs7ZGVmYXVsdDphcmdzPW5ldyBBcnJheShsZW4tMSk7Zm9yKGk9MTtpPGxlbjtpKyspYXJnc1tpLTFdPWFyZ3VtZW50c1tpXTtlbWl0TWFueShoYW5kbGVyLGlzRm4sdGhpcyxhcmdzKX1yZXR1cm4gdHJ1ZX07ZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCx0eXBlLGxpc3RlbmVyLHByZXBlbmQpe3ZhciBtO3ZhciBldmVudHM7dmFyIGV4aXN0aW5nO2lmKHR5cGVvZiBsaXN0ZW5lciE9PSJmdW5jdGlvbiIpdGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3RlbmVyIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtldmVudHM9dGFyZ2V0Ll9ldmVudHM7aWYoIWV2ZW50cyl7ZXZlbnRzPXRhcmdldC5fZXZlbnRzPW9iamVjdENyZWF0ZShudWxsKTt0YXJnZXQuX2V2ZW50c0NvdW50PTB9ZWxzZXtpZihldmVudHMubmV3TGlzdGVuZXIpe3RhcmdldC5lbWl0KCJuZXdMaXN0ZW5lciIsdHlwZSxsaXN0ZW5lci5saXN0ZW5lcj9saXN0ZW5lci5saXN0ZW5lcjpsaXN0ZW5lcik7ZXZlbnRzPXRhcmdldC5fZXZlbnRzfWV4aXN0aW5nPWV2ZW50c1t0eXBlXX1pZighZXhpc3Rpbmcpe2V4aXN0aW5nPWV2ZW50c1t0eXBlXT1saXN0ZW5lcjsrK3RhcmdldC5fZXZlbnRzQ291bnR9ZWxzZXtpZih0eXBlb2YgZXhpc3Rpbmc9PT0iZnVuY3Rpb24iKXtleGlzdGluZz1ldmVudHNbdHlwZV09cHJlcGVuZD9bbGlzdGVuZXIsZXhpc3RpbmddOltleGlzdGluZyxsaXN0ZW5lcl19ZWxzZXtpZihwcmVwZW5kKXtleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKX1lbHNle2V4aXN0aW5nLnB1c2gobGlzdGVuZXIpfX1pZighZXhpc3Rpbmcud2FybmVkKXttPSRnZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtpZihtJiZtPjAmJmV4aXN0aW5nLmxlbmd0aD5tKXtleGlzdGluZy53YXJuZWQ9dHJ1ZTt2YXIgdz1uZXcgRXJyb3IoIlBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gIitleGlzdGluZy5sZW5ndGgrJyAiJytTdHJpbmcodHlwZSkrJyIgbGlzdGVuZXJzICcrImFkZGVkLiBVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byAiKyJpbmNyZWFzZSBsaW1pdC4iKTt3Lm5hbWU9Ik1heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyI7dy5lbWl0dGVyPXRhcmdldDt3LnR5cGU9dHlwZTt3LmNvdW50PWV4aXN0aW5nLmxlbmd0aDtpZih0eXBlb2YgY29uc29sZT09PSJvYmplY3QiJiZjb25zb2xlLndhcm4pe2NvbnNvbGUud2FybigiJXM6ICVzIix3Lm5hbWUsdy5tZXNzYWdlKX19fX1yZXR1cm4gdGFyZ2V0fUV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI9ZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSxsaXN0ZW5lcil7cmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLHR5cGUsbGlzdGVuZXIsZmFsc2UpfTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uPUV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXI9ZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsbGlzdGVuZXIpe3JldHVybiBfYWRkTGlzdGVuZXIodGhpcyx0eXBlLGxpc3RlbmVyLHRydWUpfTtmdW5jdGlvbiBvbmNlV3JhcHBlcigpe2lmKCF0aGlzLmZpcmVkKXt0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsdGhpcy53cmFwRm4pO3RoaXMuZmlyZWQ9dHJ1ZTtzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7Y2FzZSAwOnJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQpO2Nhc2UgMTpyZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0LGFyZ3VtZW50c1swXSk7Y2FzZSAyOnJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQsYXJndW1lbnRzWzBdLGFyZ3VtZW50c1sxXSk7Y2FzZSAzOnJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQsYXJndW1lbnRzWzBdLGFyZ3VtZW50c1sxXSxhcmd1bWVudHNbMl0pO2RlZmF1bHQ6dmFyIGFyZ3M9bmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpO2Zvcih2YXIgaT0wO2k8YXJncy5sZW5ndGg7KytpKWFyZ3NbaV09YXJndW1lbnRzW2ldO3RoaXMubGlzdGVuZXIuYXBwbHkodGhpcy50YXJnZXQsYXJncyl9fX1mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LHR5cGUsbGlzdGVuZXIpe3ZhciBzdGF0ZT17ZmlyZWQ6ZmFsc2Usd3JhcEZuOnVuZGVmaW5lZCx0YXJnZXQ6dGFyZ2V0LHR5cGU6dHlwZSxsaXN0ZW5lcjpsaXN0ZW5lcn07dmFyIHdyYXBwZWQ9YmluZC5jYWxsKG9uY2VXcmFwcGVyLHN0YXRlKTt3cmFwcGVkLmxpc3RlbmVyPWxpc3RlbmVyO3N0YXRlLndyYXBGbj13cmFwcGVkO3JldHVybiB3cmFwcGVkfUV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZT1mdW5jdGlvbiBvbmNlKHR5cGUsbGlzdGVuZXIpe2lmKHR5cGVvZiBsaXN0ZW5lciE9PSJmdW5jdGlvbiIpdGhyb3cgbmV3IFR5cGVFcnJvcignImxpc3RlbmVyIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTt0aGlzLm9uKHR5cGUsX29uY2VXcmFwKHRoaXMsdHlwZSxsaXN0ZW5lcikpO3JldHVybiB0aGlzfTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXI9ZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLGxpc3RlbmVyKXtpZih0eXBlb2YgbGlzdGVuZXIhPT0iZnVuY3Rpb24iKXRocm93IG5ldyBUeXBlRXJyb3IoJyJsaXN0ZW5lciIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7dGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSxfb25jZVdyYXAodGhpcyx0eXBlLGxpc3RlbmVyKSk7cmV0dXJuIHRoaXN9O0V2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI9ZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSxsaXN0ZW5lcil7dmFyIGxpc3QsZXZlbnRzLHBvc2l0aW9uLGksb3JpZ2luYWxMaXN0ZW5lcjtpZih0eXBlb2YgbGlzdGVuZXIhPT0iZnVuY3Rpb24iKXRocm93IG5ldyBUeXBlRXJyb3IoJyJsaXN0ZW5lciIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7ZXZlbnRzPXRoaXMuX2V2ZW50cztpZighZXZlbnRzKXJldHVybiB0aGlzO2xpc3Q9ZXZlbnRzW3R5cGVdO2lmKCFsaXN0KXJldHVybiB0aGlzO2lmKGxpc3Q9PT1saXN0ZW5lcnx8bGlzdC5saXN0ZW5lcj09PWxpc3RlbmVyKXtpZigtLXRoaXMuX2V2ZW50c0NvdW50PT09MCl0aGlzLl9ldmVudHM9b2JqZWN0Q3JlYXRlKG51bGwpO2Vsc2V7ZGVsZXRlIGV2ZW50c1t0eXBlXTtpZihldmVudHMucmVtb3ZlTGlzdGVuZXIpdGhpcy5lbWl0KCJyZW1vdmVMaXN0ZW5lciIsdHlwZSxsaXN0Lmxpc3RlbmVyfHxsaXN0ZW5lcil9fWVsc2UgaWYodHlwZW9mIGxpc3QhPT0iZnVuY3Rpb24iKXtwb3NpdGlvbj0tMTtmb3IoaT1saXN0Lmxlbmd0aC0xO2k+PTA7aS0tKXtpZihsaXN0W2ldPT09bGlzdGVuZXJ8fGxpc3RbaV0ubGlzdGVuZXI9PT1saXN0ZW5lcil7b3JpZ2luYWxMaXN0ZW5lcj1saXN0W2ldLmxpc3RlbmVyO3Bvc2l0aW9uPWk7YnJlYWt9fWlmKHBvc2l0aW9uPDApcmV0dXJuIHRoaXM7aWYocG9zaXRpb249PT0wKWxpc3Quc2hpZnQoKTtlbHNlIHNwbGljZU9uZShsaXN0LHBvc2l0aW9uKTtpZihsaXN0Lmxlbmd0aD09PTEpZXZlbnRzW3R5cGVdPWxpc3RbMF07aWYoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKXRoaXMuZW1pdCgicmVtb3ZlTGlzdGVuZXIiLHR5cGUsb3JpZ2luYWxMaXN0ZW5lcnx8bGlzdGVuZXIpfXJldHVybiB0aGlzfTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycz1mdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSl7dmFyIGxpc3RlbmVycyxldmVudHMsaTtldmVudHM9dGhpcy5fZXZlbnRzO2lmKCFldmVudHMpcmV0dXJuIHRoaXM7aWYoIWV2ZW50cy5yZW1vdmVMaXN0ZW5lcil7aWYoYXJndW1lbnRzLmxlbmd0aD09PTApe3RoaXMuX2V2ZW50cz1vYmplY3RDcmVhdGUobnVsbCk7dGhpcy5fZXZlbnRzQ291bnQ9MH1lbHNlIGlmKGV2ZW50c1t0eXBlXSl7aWYoLS10aGlzLl9ldmVudHNDb3VudD09PTApdGhpcy5fZXZlbnRzPW9iamVjdENyZWF0ZShudWxsKTtlbHNlIGRlbGV0ZSBldmVudHNbdHlwZV19cmV0dXJuIHRoaXN9aWYoYXJndW1lbnRzLmxlbmd0aD09PTApe3ZhciBrZXlzPW9iamVjdEtleXMoZXZlbnRzKTt2YXIga2V5O2ZvcihpPTA7aTxrZXlzLmxlbmd0aDsrK2kpe2tleT1rZXlzW2ldO2lmKGtleT09PSJyZW1vdmVMaXN0ZW5lciIpY29udGludWU7dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KX10aGlzLnJlbW92ZUFsbExpc3RlbmVycygicmVtb3ZlTGlzdGVuZXIiKTt0aGlzLl9ldmVudHM9b2JqZWN0Q3JlYXRlKG51bGwpO3RoaXMuX2V2ZW50c0NvdW50PTA7cmV0dXJuIHRoaXN9bGlzdGVuZXJzPWV2ZW50c1t0eXBlXTtpZih0eXBlb2YgbGlzdGVuZXJzPT09ImZ1bmN0aW9uIil7dGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLGxpc3RlbmVycyl9ZWxzZSBpZihsaXN0ZW5lcnMpe2ZvcihpPWxpc3RlbmVycy5sZW5ndGgtMTtpPj0wO2ktLSl7dGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLGxpc3RlbmVyc1tpXSl9fXJldHVybiB0aGlzfTtmdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCx0eXBlLHVud3JhcCl7dmFyIGV2ZW50cz10YXJnZXQuX2V2ZW50cztpZighZXZlbnRzKXJldHVybltdO3ZhciBldmxpc3RlbmVyPWV2ZW50c1t0eXBlXTtpZighZXZsaXN0ZW5lcilyZXR1cm5bXTtpZih0eXBlb2YgZXZsaXN0ZW5lcj09PSJmdW5jdGlvbiIpcmV0dXJuIHVud3JhcD9bZXZsaXN0ZW5lci5saXN0ZW5lcnx8ZXZsaXN0ZW5lcl06W2V2bGlzdGVuZXJdO3JldHVybiB1bndyYXA/dW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpOmFycmF5Q2xvbmUoZXZsaXN0ZW5lcixldmxpc3RlbmVyLmxlbmd0aCl9RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnM9ZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpe3JldHVybiBfbGlzdGVuZXJzKHRoaXMsdHlwZSx0cnVlKX07RXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnM9ZnVuY3Rpb24gcmF3TGlzdGVuZXJzKHR5cGUpe3JldHVybiBfbGlzdGVuZXJzKHRoaXMsdHlwZSxmYWxzZSl9O0V2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50PWZ1bmN0aW9uKGVtaXR0ZXIsdHlwZSl7aWYodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudD09PSJmdW5jdGlvbiIpe3JldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSl9ZWxzZXtyZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsdHlwZSl9fTtFdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQ9bGlzdGVuZXJDb3VudDtmdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpe3ZhciBldmVudHM9dGhpcy5fZXZlbnRzO2lmKGV2ZW50cyl7dmFyIGV2bGlzdGVuZXI9ZXZlbnRzW3R5cGVdO2lmKHR5cGVvZiBldmxpc3RlbmVyPT09ImZ1bmN0aW9uIil7cmV0dXJuIDF9ZWxzZSBpZihldmxpc3RlbmVyKXtyZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGh9fXJldHVybiAwfUV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcz1mdW5jdGlvbiBldmVudE5hbWVzKCl7cmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50PjA/UmVmbGVjdC5vd25LZXlzKHRoaXMuX2V2ZW50cyk6W119O2Z1bmN0aW9uIHNwbGljZU9uZShsaXN0LGluZGV4KXtmb3IodmFyIGk9aW5kZXgsaz1pKzEsbj1saXN0Lmxlbmd0aDtrPG47aSs9MSxrKz0xKWxpc3RbaV09bGlzdFtrXTtsaXN0LnBvcCgpfWZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLG4pe3ZhciBjb3B5PW5ldyBBcnJheShuKTtmb3IodmFyIGk9MDtpPG47KytpKWNvcHlbaV09YXJyW2ldO3JldHVybiBjb3B5fWZ1bmN0aW9uIHVud3JhcExpc3RlbmVycyhhcnIpe3ZhciByZXQ9bmV3IEFycmF5KGFyci5sZW5ndGgpO2Zvcih2YXIgaT0wO2k8cmV0Lmxlbmd0aDsrK2kpe3JldFtpXT1hcnJbaV0ubGlzdGVuZXJ8fGFycltpXX1yZXR1cm4gcmV0fWZ1bmN0aW9uIG9iamVjdENyZWF0ZVBvbHlmaWxsKHByb3RvKXt2YXIgRj1mdW5jdGlvbigpe307Ri5wcm90b3R5cGU9cHJvdG87cmV0dXJuIG5ldyBGfWZ1bmN0aW9uIG9iamVjdEtleXNQb2x5ZmlsbChvYmope3ZhciBrZXlzPVtdO2Zvcih2YXIgayBpbiBvYmopaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaixrKSl7a2V5cy5wdXNoKGspfXJldHVybiBrfWZ1bmN0aW9uIGZ1bmN0aW9uQmluZFBvbHlmaWxsKGNvbnRleHQpe3ZhciBmbj10aGlzO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBmbi5hcHBseShjb250ZXh0LGFyZ3VtZW50cyl9fX0se31dLDMyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgVHJhbnNmb3JtPXJlcXVpcmUoInN0cmVhbSIpLlRyYW5zZm9ybTt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTtmdW5jdGlvbiB0aHJvd0lmTm90U3RyaW5nT3JCdWZmZXIodmFsLHByZWZpeCl7aWYoIUJ1ZmZlci5pc0J1ZmZlcih2YWwpJiZ0eXBlb2YgdmFsIT09InN0cmluZyIpe3Rocm93IG5ldyBUeXBlRXJyb3IocHJlZml4KyIgbXVzdCBiZSBhIHN0cmluZyBvciBhIGJ1ZmZlciIpfX1mdW5jdGlvbiBIYXNoQmFzZShibG9ja1NpemUpe1RyYW5zZm9ybS5jYWxsKHRoaXMpO3RoaXMuX2Jsb2NrPUJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja1NpemUpO3RoaXMuX2Jsb2NrU2l6ZT1ibG9ja1NpemU7dGhpcy5fYmxvY2tPZmZzZXQ9MDt0aGlzLl9sZW5ndGg9WzAsMCwwLDBdO3RoaXMuX2ZpbmFsaXplZD1mYWxzZX1pbmhlcml0cyhIYXNoQmFzZSxUcmFuc2Zvcm0pO0hhc2hCYXNlLnByb3RvdHlwZS5fdHJhbnNmb3JtPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNhbGxiYWNrKXt2YXIgZXJyb3I9bnVsbDt0cnl7dGhpcy51cGRhdGUoY2h1bmssZW5jb2RpbmcpfWNhdGNoKGVycil7ZXJyb3I9ZXJyfWNhbGxiYWNrKGVycm9yKX07SGFzaEJhc2UucHJvdG90eXBlLl9mbHVzaD1mdW5jdGlvbihjYWxsYmFjayl7dmFyIGVycm9yPW51bGw7dHJ5e3RoaXMucHVzaCh0aGlzLmRpZ2VzdCgpKX1jYXRjaChlcnIpe2Vycm9yPWVycn1jYWxsYmFjayhlcnJvcil9O0hhc2hCYXNlLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oZGF0YSxlbmNvZGluZyl7dGhyb3dJZk5vdFN0cmluZ09yQnVmZmVyKGRhdGEsIkRhdGEiKTtpZih0aGlzLl9maW5hbGl6ZWQpdGhyb3cgbmV3IEVycm9yKCJEaWdlc3QgYWxyZWFkeSBjYWxsZWQiKTtpZighQnVmZmVyLmlzQnVmZmVyKGRhdGEpKWRhdGE9QnVmZmVyLmZyb20oZGF0YSxlbmNvZGluZyk7dmFyIGJsb2NrPXRoaXMuX2Jsb2NrO3ZhciBvZmZzZXQ9MDt3aGlsZSh0aGlzLl9ibG9ja09mZnNldCtkYXRhLmxlbmd0aC1vZmZzZXQ+PXRoaXMuX2Jsb2NrU2l6ZSl7Zm9yKHZhciBpPXRoaXMuX2Jsb2NrT2Zmc2V0O2k8dGhpcy5fYmxvY2tTaXplOylibG9ja1tpKytdPWRhdGFbb2Zmc2V0KytdO3RoaXMuX3VwZGF0ZSgpO3RoaXMuX2Jsb2NrT2Zmc2V0PTB9d2hpbGUob2Zmc2V0PGRhdGEubGVuZ3RoKWJsb2NrW3RoaXMuX2Jsb2NrT2Zmc2V0KytdPWRhdGFbb2Zmc2V0KytdO2Zvcih2YXIgaj0wLGNhcnJ5PWRhdGEubGVuZ3RoKjg7Y2Fycnk+MDsrK2ope3RoaXMuX2xlbmd0aFtqXSs9Y2Fycnk7Y2Fycnk9dGhpcy5fbGVuZ3RoW2pdLzQyOTQ5NjcyOTZ8MDtpZihjYXJyeT4wKXRoaXMuX2xlbmd0aFtqXS09NDI5NDk2NzI5NipjYXJyeX1yZXR1cm4gdGhpc307SGFzaEJhc2UucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoIl91cGRhdGUgaXMgbm90IGltcGxlbWVudGVkIil9O0hhc2hCYXNlLnByb3RvdHlwZS5kaWdlc3Q9ZnVuY3Rpb24oZW5jb2Rpbmcpe2lmKHRoaXMuX2ZpbmFsaXplZCl0aHJvdyBuZXcgRXJyb3IoIkRpZ2VzdCBhbHJlYWR5IGNhbGxlZCIpO3RoaXMuX2ZpbmFsaXplZD10cnVlO3ZhciBkaWdlc3Q9dGhpcy5fZGlnZXN0KCk7aWYoZW5jb2RpbmchPT11bmRlZmluZWQpZGlnZXN0PWRpZ2VzdC50b1N0cmluZyhlbmNvZGluZyk7dGhpcy5fYmxvY2suZmlsbCgwKTt0aGlzLl9ibG9ja09mZnNldD0wO2Zvcih2YXIgaT0wO2k8NDsrK2kpdGhpcy5fbGVuZ3RoW2ldPTA7cmV0dXJuIGRpZ2VzdH07SGFzaEJhc2UucHJvdG90eXBlLl9kaWdlc3Q9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoIl9kaWdlc3QgaXMgbm90IGltcGxlbWVudGVkIil9O21vZHVsZS5leHBvcnRzPUhhc2hCYXNlfSx7aW5oZXJpdHM6MzQsInNhZmUtYnVmZmVyIjo3OCxzdHJlYW06OTd9XSwzMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7ZXhwb3J0cy5yZWFkPWZ1bmN0aW9uKGJ1ZmZlcixvZmZzZXQsaXNMRSxtTGVuLG5CeXRlcyl7dmFyIGUsbTt2YXIgZUxlbj1uQnl0ZXMqOC1tTGVuLTE7dmFyIGVNYXg9KDE8PGVMZW4pLTE7dmFyIGVCaWFzPWVNYXg+PjE7dmFyIG5CaXRzPS03O3ZhciBpPWlzTEU/bkJ5dGVzLTE6MDt2YXIgZD1pc0xFPy0xOjE7dmFyIHM9YnVmZmVyW29mZnNldCtpXTtpKz1kO2U9cyYoMTw8LW5CaXRzKS0xO3M+Pj0tbkJpdHM7bkJpdHMrPWVMZW47Zm9yKDtuQml0cz4wO2U9ZSoyNTYrYnVmZmVyW29mZnNldCtpXSxpKz1kLG5CaXRzLT04KXt9bT1lJigxPDwtbkJpdHMpLTE7ZT4+PS1uQml0cztuQml0cys9bUxlbjtmb3IoO25CaXRzPjA7bT1tKjI1NitidWZmZXJbb2Zmc2V0K2ldLGkrPWQsbkJpdHMtPTgpe31pZihlPT09MCl7ZT0xLWVCaWFzfWVsc2UgaWYoZT09PWVNYXgpe3JldHVybiBtP05hTjoocz8tMToxKSpJbmZpbml0eX1lbHNle209bStNYXRoLnBvdygyLG1MZW4pO2U9ZS1lQmlhc31yZXR1cm4ocz8tMToxKSptKk1hdGgucG93KDIsZS1tTGVuKX07ZXhwb3J0cy53cml0ZT1mdW5jdGlvbihidWZmZXIsdmFsdWUsb2Zmc2V0LGlzTEUsbUxlbixuQnl0ZXMpe3ZhciBlLG0sYzt2YXIgZUxlbj1uQnl0ZXMqOC1tTGVuLTE7dmFyIGVNYXg9KDE8PGVMZW4pLTE7dmFyIGVCaWFzPWVNYXg+PjE7dmFyIHJ0PW1MZW49PT0yMz9NYXRoLnBvdygyLC0yNCktTWF0aC5wb3coMiwtNzcpOjA7dmFyIGk9aXNMRT8wOm5CeXRlcy0xO3ZhciBkPWlzTEU/MTotMTt2YXIgcz12YWx1ZTwwfHx2YWx1ZT09PTAmJjEvdmFsdWU8MD8xOjA7dmFsdWU9TWF0aC5hYnModmFsdWUpO2lmKGlzTmFOKHZhbHVlKXx8dmFsdWU9PT1JbmZpbml0eSl7bT1pc05hTih2YWx1ZSk/MTowO2U9ZU1heH1lbHNle2U9TWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkvTWF0aC5MTjIpO2lmKHZhbHVlKihjPU1hdGgucG93KDIsLWUpKTwxKXtlLS07Yyo9Mn1pZihlK2VCaWFzPj0xKXt2YWx1ZSs9cnQvY31lbHNle3ZhbHVlKz1ydCpNYXRoLnBvdygyLDEtZUJpYXMpfWlmKHZhbHVlKmM+PTIpe2UrKztjLz0yfWlmKGUrZUJpYXM+PWVNYXgpe209MDtlPWVNYXh9ZWxzZSBpZihlK2VCaWFzPj0xKXttPSh2YWx1ZSpjLTEpKk1hdGgucG93KDIsbUxlbik7ZT1lK2VCaWFzfWVsc2V7bT12YWx1ZSpNYXRoLnBvdygyLGVCaWFzLTEpKk1hdGgucG93KDIsbUxlbik7ZT0wfX1mb3IoO21MZW4+PTg7YnVmZmVyW29mZnNldCtpXT1tJjI1NSxpKz1kLG0vPTI1NixtTGVuLT04KXt9ZT1lPDxtTGVufG07ZUxlbis9bUxlbjtmb3IoO2VMZW4+MDtidWZmZXJbb2Zmc2V0K2ldPWUmMjU1LGkrPWQsZS89MjU2LGVMZW4tPTgpe31idWZmZXJbb2Zmc2V0K2ktZF18PXMqMTI4fX0se31dLDM0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXthcmd1bWVudHNbNF1bMTldWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKX0se2R1cDoxOX1dLDM1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1mdW5jdGlvbihvYmope3JldHVybiBvYmohPW51bGwmJihpc0J1ZmZlcihvYmopfHxpc1Nsb3dCdWZmZXIob2JqKXx8ISFvYmouX2lzQnVmZmVyKX07ZnVuY3Rpb24gaXNCdWZmZXIob2JqKXtyZXR1cm4hIW9iai5jb25zdHJ1Y3RvciYmdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcj09PSJmdW5jdGlvbiImJm9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopfWZ1bmN0aW9uIGlzU2xvd0J1ZmZlcihvYmope3JldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFPT09ImZ1bmN0aW9uIiYmdHlwZW9mIG9iai5zbGljZT09PSJmdW5jdGlvbiImJmlzQnVmZmVyKG9iai5zbGljZSgwLDApKX19LHt9XSwzNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIHRvU3RyaW5nPXt9LnRvU3RyaW5nO21vZHVsZS5leHBvcnRzPUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGFycil7cmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKT09IltvYmplY3QgQXJyYXldIn19LHt9XSwzNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBIYXNoQmFzZT1yZXF1aXJlKCJoYXNoLWJhc2UiKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBBUlJBWTE2PW5ldyBBcnJheSgxNik7ZnVuY3Rpb24gTUQ1KCl7SGFzaEJhc2UuY2FsbCh0aGlzLDY0KTt0aGlzLl9hPTE3MzI1ODQxOTM7dGhpcy5fYj00MDIzMjMzNDE3O3RoaXMuX2M9MjU2MjM4MzEwMjt0aGlzLl9kPTI3MTczMzg3OH1pbmhlcml0cyhNRDUsSGFzaEJhc2UpO01ENS5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbigpe3ZhciBNPUFSUkFZMTY7Zm9yKHZhciBpPTA7aTwxNjsrK2kpTVtpXT10aGlzLl9ibG9jay5yZWFkSW50MzJMRShpKjQpO3ZhciBhPXRoaXMuX2E7dmFyIGI9dGhpcy5fYjt2YXIgYz10aGlzLl9jO3ZhciBkPXRoaXMuX2Q7YT1mbkYoYSxiLGMsZCxNWzBdLDM2MTQwOTAzNjAsNyk7ZD1mbkYoZCxhLGIsYyxNWzFdLDM5MDU0MDI3MTAsMTIpO2M9Zm5GKGMsZCxhLGIsTVsyXSw2MDYxMDU4MTksMTcpO2I9Zm5GKGIsYyxkLGEsTVszXSwzMjUwNDQxOTY2LDIyKTthPWZuRihhLGIsYyxkLE1bNF0sNDExODU0ODM5OSw3KTtkPWZuRihkLGEsYixjLE1bNV0sMTIwMDA4MDQyNiwxMik7Yz1mbkYoYyxkLGEsYixNWzZdLDI4MjE3MzU5NTUsMTcpO2I9Zm5GKGIsYyxkLGEsTVs3XSw0MjQ5MjYxMzEzLDIyKTthPWZuRihhLGIsYyxkLE1bOF0sMTc3MDAzNTQxNiw3KTtkPWZuRihkLGEsYixjLE1bOV0sMjMzNjU1Mjg3OSwxMik7Yz1mbkYoYyxkLGEsYixNWzEwXSw0Mjk0OTI1MjMzLDE3KTtiPWZuRihiLGMsZCxhLE1bMTFdLDIzMDQ1NjMxMzQsMjIpO2E9Zm5GKGEsYixjLGQsTVsxMl0sMTgwNDYwMzY4Miw3KTtkPWZuRihkLGEsYixjLE1bMTNdLDQyNTQ2MjYxOTUsMTIpO2M9Zm5GKGMsZCxhLGIsTVsxNF0sMjc5Mjk2NTAwNiwxNyk7Yj1mbkYoYixjLGQsYSxNWzE1XSwxMjM2NTM1MzI5LDIyKTthPWZuRyhhLGIsYyxkLE1bMV0sNDEyOTE3MDc4Niw1KTtkPWZuRyhkLGEsYixjLE1bNl0sMzIyNTQ2NTY2NCw5KTtjPWZuRyhjLGQsYSxiLE1bMTFdLDY0MzcxNzcxMywxNCk7Yj1mbkcoYixjLGQsYSxNWzBdLDM5MjEwNjk5OTQsMjApO2E9Zm5HKGEsYixjLGQsTVs1XSwzNTkzNDA4NjA1LDUpO2Q9Zm5HKGQsYSxiLGMsTVsxMF0sMzgwMTYwODMsOSk7Yz1mbkcoYyxkLGEsYixNWzE1XSwzNjM0NDg4OTYxLDE0KTtiPWZuRyhiLGMsZCxhLE1bNF0sMzg4OTQyOTQ0OCwyMCk7YT1mbkcoYSxiLGMsZCxNWzldLDU2ODQ0NjQzOCw1KTtkPWZuRyhkLGEsYixjLE1bMTRdLDMyNzUxNjM2MDYsOSk7Yz1mbkcoYyxkLGEsYixNWzNdLDQxMDc2MDMzMzUsMTQpO2I9Zm5HKGIsYyxkLGEsTVs4XSwxMTYzNTMxNTAxLDIwKTthPWZuRyhhLGIsYyxkLE1bMTNdLDI4NTAyODU4MjksNSk7ZD1mbkcoZCxhLGIsYyxNWzJdLDQyNDM1NjM1MTIsOSk7Yz1mbkcoYyxkLGEsYixNWzddLDE3MzUzMjg0NzMsMTQpO2I9Zm5HKGIsYyxkLGEsTVsxMl0sMjM2ODM1OTU2MiwyMCk7YT1mbkgoYSxiLGMsZCxNWzVdLDQyOTQ1ODg3MzgsNCk7ZD1mbkgoZCxhLGIsYyxNWzhdLDIyNzIzOTI4MzMsMTEpO2M9Zm5IKGMsZCxhLGIsTVsxMV0sMTgzOTAzMDU2MiwxNik7Yj1mbkgoYixjLGQsYSxNWzE0XSw0MjU5NjU3NzQwLDIzKTthPWZuSChhLGIsYyxkLE1bMV0sMjc2Mzk3NTIzNiw0KTtkPWZuSChkLGEsYixjLE1bNF0sMTI3Mjg5MzM1MywxMSk7Yz1mbkgoYyxkLGEsYixNWzddLDQxMzk0Njk2NjQsMTYpO2I9Zm5IKGIsYyxkLGEsTVsxMF0sMzIwMDIzNjY1NiwyMyk7YT1mbkgoYSxiLGMsZCxNWzEzXSw2ODEyNzkxNzQsNCk7ZD1mbkgoZCxhLGIsYyxNWzBdLDM5MzY0MzAwNzQsMTEpO2M9Zm5IKGMsZCxhLGIsTVszXSwzNTcyNDQ1MzE3LDE2KTtiPWZuSChiLGMsZCxhLE1bNl0sNzYwMjkxODksMjMpO2E9Zm5IKGEsYixjLGQsTVs5XSwzNjU0NjAyODA5LDQpO2Q9Zm5IKGQsYSxiLGMsTVsxMl0sMzg3MzE1MTQ2MSwxMSk7Yz1mbkgoYyxkLGEsYixNWzE1XSw1MzA3NDI1MjAsMTYpO2I9Zm5IKGIsYyxkLGEsTVsyXSwzMjk5NjI4NjQ1LDIzKTthPWZuSShhLGIsYyxkLE1bMF0sNDA5NjMzNjQ1Miw2KTtkPWZuSShkLGEsYixjLE1bN10sMTEyNjg5MTQxNSwxMCk7Yz1mbkkoYyxkLGEsYixNWzE0XSwyODc4NjEyMzkxLDE1KTtiPWZuSShiLGMsZCxhLE1bNV0sNDIzNzUzMzI0MSwyMSk7YT1mbkkoYSxiLGMsZCxNWzEyXSwxNzAwNDg1NTcxLDYpO2Q9Zm5JKGQsYSxiLGMsTVszXSwyMzk5OTgwNjkwLDEwKTtjPWZuSShjLGQsYSxiLE1bMTBdLDQyOTM5MTU3NzMsMTUpO2I9Zm5JKGIsYyxkLGEsTVsxXSwyMjQwMDQ0NDk3LDIxKTthPWZuSShhLGIsYyxkLE1bOF0sMTg3MzMxMzM1OSw2KTtkPWZuSShkLGEsYixjLE1bMTVdLDQyNjQzNTU1NTIsMTApO2M9Zm5JKGMsZCxhLGIsTVs2XSwyNzM0NzY4OTE2LDE1KTtiPWZuSShiLGMsZCxhLE1bMTNdLDEzMDkxNTE2NDksMjEpO2E9Zm5JKGEsYixjLGQsTVs0XSw0MTQ5NDQ0MjI2LDYpO2Q9Zm5JKGQsYSxiLGMsTVsxMV0sMzE3NDc1NjkxNywxMCk7Yz1mbkkoYyxkLGEsYixNWzJdLDcxODc4NzI1OSwxNSk7Yj1mbkkoYixjLGQsYSxNWzldLDM5NTE0ODE3NDUsMjEpO3RoaXMuX2E9dGhpcy5fYSthfDA7dGhpcy5fYj10aGlzLl9iK2J8MDt0aGlzLl9jPXRoaXMuX2MrY3wwO3RoaXMuX2Q9dGhpcy5fZCtkfDB9O01ENS5wcm90b3R5cGUuX2RpZ2VzdD1mdW5jdGlvbigpe3RoaXMuX2Jsb2NrW3RoaXMuX2Jsb2NrT2Zmc2V0KytdPTEyODtpZih0aGlzLl9ibG9ja09mZnNldD41Nil7dGhpcy5fYmxvY2suZmlsbCgwLHRoaXMuX2Jsb2NrT2Zmc2V0LDY0KTt0aGlzLl91cGRhdGUoKTt0aGlzLl9ibG9ja09mZnNldD0wfXRoaXMuX2Jsb2NrLmZpbGwoMCx0aGlzLl9ibG9ja09mZnNldCw1Nik7dGhpcy5fYmxvY2sud3JpdGVVSW50MzJMRSh0aGlzLl9sZW5ndGhbMF0sNTYpO3RoaXMuX2Jsb2NrLndyaXRlVUludDMyTEUodGhpcy5fbGVuZ3RoWzFdLDYwKTt0aGlzLl91cGRhdGUoKTt2YXIgYnVmZmVyPUJ1ZmZlci5hbGxvY1Vuc2FmZSgxNik7YnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9hLDApO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fYiw0KTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2MsOCk7YnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9kLDEyKTtyZXR1cm4gYnVmZmVyfTtmdW5jdGlvbiByb3RsKHgsbil7cmV0dXJuIHg8PG58eD4+PjMyLW59ZnVuY3Rpb24gZm5GKGEsYixjLGQsbSxrLHMpe3JldHVybiByb3RsKGErKGImY3x+YiZkKSttK2t8MCxzKStifDB9ZnVuY3Rpb24gZm5HKGEsYixjLGQsbSxrLHMpe3JldHVybiByb3RsKGErKGImZHxjJn5kKSttK2t8MCxzKStifDB9ZnVuY3Rpb24gZm5IKGEsYixjLGQsbSxrLHMpe3JldHVybiByb3RsKGErKGJeY15kKSttK2t8MCxzKStifDB9ZnVuY3Rpb24gZm5JKGEsYixjLGQsbSxrLHMpe3JldHVybiByb3RsKGErKGNeKGJ8fmQpKSttK2t8MCxzKStifDB9bW9kdWxlLmV4cG9ydHM9TUQ1fSx7Imhhc2gtYmFzZSI6MzIsaW5oZXJpdHM6MzQsInNhZmUtYnVmZmVyIjo3OH1dLDM4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgY29uc3RhbnRzPXJlcXVpcmUoImNvbnN0YW50cyIpO3ZhciByc2E9cmVxdWlyZSgiLi9saWJzL3JzYS5qcyIpO3ZhciBfPXJlcXVpcmUoIi4vdXRpbHMiKS5fO3ZhciB1dGlscz1yZXF1aXJlKCIuL3V0aWxzIik7dmFyIHNjaGVtZXM9cmVxdWlyZSgiLi9zY2hlbWVzL3NjaGVtZXMuanMiKTt2YXIgZm9ybWF0cz1yZXF1aXJlKCIuL2Zvcm1hdHMvZm9ybWF0cy5qcyIpO3ZhciBzZWVkcmFuZG9tPXJlcXVpcmUoInNlZWRyYW5kb20iKTtpZih0eXBlb2YgY29uc3RhbnRzLlJTQV9OT19QQURESU5HPT09InVuZGVmaW5lZCIpe2NvbnN0YW50cy5SU0FfTk9fUEFERElORz0zfW1vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKCl7dmFyIFNVUFBPUlRFRF9IQVNIX0FMR09SSVRITVM9e25vZGUxMDpbIm1kNCIsIm1kNSIsInJpcGVtZDE2MCIsInNoYTEiLCJzaGEyMjQiLCJzaGEyNTYiLCJzaGEzODQiLCJzaGE1MTIiXSxub2RlOlsibWQ0IiwibWQ1IiwicmlwZW1kMTYwIiwic2hhMSIsInNoYTIyNCIsInNoYTI1NiIsInNoYTM4NCIsInNoYTUxMiJdLGlvanM6WyJtZDQiLCJtZDUiLCJyaXBlbWQxNjAiLCJzaGExIiwic2hhMjI0Iiwic2hhMjU2Iiwic2hhMzg0Iiwic2hhNTEyIl0sYnJvd3NlcjpbIm1kNSIsInJpcGVtZDE2MCIsInNoYTEiLCJzaGEyNTYiLCJzaGE1MTIiXX07dmFyIERFRkFVTFRfRU5DUllQVElPTl9TQ0hFTUU9InBrY3MxX29hZXAiO3ZhciBERUZBVUxUX1NJR05JTkdfU0NIRU1FPSJwa2NzMSI7dmFyIERFRkFVTFRfRVhQT1JUX0ZPUk1BVD0icHJpdmF0ZSI7dmFyIEVYUE9SVF9GT1JNQVRfQUxJQVNFUz17cHJpdmF0ZToicGtjczEtcHJpdmF0ZS1wZW0iLCJwcml2YXRlLWRlciI6InBrY3MxLXByaXZhdGUtZGVyIixwdWJsaWM6InBrY3M4LXB1YmxpYy1wZW0iLCJwdWJsaWMtZGVyIjoicGtjczgtcHVibGljLWRlciJ9O2Z1bmN0aW9uIE5vZGVSU0Eoa2V5LGZvcm1hdCxvcHRpb25zKXtpZighKHRoaXMgaW5zdGFuY2VvZiBOb2RlUlNBKSl7cmV0dXJuIG5ldyBOb2RlUlNBKGtleSxmb3JtYXQsb3B0aW9ucyl9aWYoXy5pc09iamVjdChmb3JtYXQpKXtvcHRpb25zPWZvcm1hdDtmb3JtYXQ9dW5kZWZpbmVkfXRoaXMuJG9wdGlvbnM9e3NpZ25pbmdTY2hlbWU6REVGQVVMVF9TSUdOSU5HX1NDSEVNRSxzaWduaW5nU2NoZW1lT3B0aW9uczp7aGFzaDoic2hhMjU2IixzYWx0TGVuZ3RoOm51bGx9LGVuY3J5cHRpb25TY2hlbWU6REVGQVVMVF9FTkNSWVBUSU9OX1NDSEVNRSxlbmNyeXB0aW9uU2NoZW1lT3B0aW9uczp7aGFzaDoic2hhMSIsbGFiZWw6bnVsbH0sZW52aXJvbm1lbnQ6dXRpbHMuZGV0ZWN0RW52aXJvbm1lbnQoKSxyc2FVdGlsczp0aGlzfTt0aGlzLmtleVBhaXI9bmV3IHJzYS5LZXk7dGhpcy4kY2FjaGU9e307aWYoQnVmZmVyLmlzQnVmZmVyKGtleSl8fF8uaXNTdHJpbmcoa2V5KSl7dGhpcy5pbXBvcnRLZXkoa2V5LGZvcm1hdCl9ZWxzZSBpZihfLmlzT2JqZWN0KGtleSkpe3RoaXMuZ2VuZXJhdGVLZXlQYWlyKGtleS5iLGtleS5lKX10aGlzLnNldE9wdGlvbnMob3B0aW9ucyl9Tm9kZVJTQS5nZW5lcmF0ZUtleVBhaXJGcm9tU2VlZD1mdW5jdGlvbiBnZW5lcmF0ZUtleVBhaXJGcm9tU2VlZChzZWVkLGJpdHMsZXhwLGVudmlyb25tZW50KXt2YXIgcmFuZG9tQmFja3VwPU1hdGgucmFuZG9tO2lmKHNlZWQhPT1udWxsKXtNYXRoLnJhbmRvbT1mdW5jdGlvbigpe3ZhciBwcmV2PXVuZGVmaW5lZDtmdW5jdGlvbiByYW5kb20oKXtwcmV2PXNlZWRyYW5kb20ocHJldj09PXVuZGVmaW5lZD9CdWZmZXIuZnJvbShzZWVkLmJ1ZmZlcixzZWVkLmJ5dGVPZmZzZXQsc2VlZC5sZW5ndGgpLnRvU3RyaW5nKCJoZXgiKTpwcmV2LnRvRml4ZWQoMTIpLHtnbG9iYWw6ZmFsc2V9KS5xdWljaygpO3JldHVybiBwcmV2fXJhbmRvbS5pc1NlZWRlZD10cnVlO3JldHVybiByYW5kb219KCl9dmFyIG9wdGlvbnM9dW5kZWZpbmVkO2lmKGVudmlyb25tZW50IT09dW5kZWZpbmVkKXtvcHRpb25zPXtlbnZpcm9ubWVudDplbnZpcm9ubWVudH19dmFyIG5vZGVSU0E9bmV3IE5vZGVSU0EodW5kZWZpbmVkLHVuZGVmaW5lZCxvcHRpb25zKTtub2RlUlNBLmdlbmVyYXRlS2V5UGFpcihiaXRzLGV4cCk7TWF0aC5yYW5kb209cmFuZG9tQmFja3VwO3JldHVybiBub2RlUlNBfTtOb2RlUlNBLnByb3RvdHlwZS5zZXRPcHRpb25zPWZ1bmN0aW9uKG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307aWYob3B0aW9ucy5lbnZpcm9ubWVudCl7dGhpcy4kb3B0aW9ucy5lbnZpcm9ubWVudD1vcHRpb25zLmVudmlyb25tZW50fWlmKG9wdGlvbnMuc2lnbmluZ1NjaGVtZSl7aWYoXy5pc1N0cmluZyhvcHRpb25zLnNpZ25pbmdTY2hlbWUpKXt2YXIgc2lnbmluZ1NjaGVtZT1vcHRpb25zLnNpZ25pbmdTY2hlbWUudG9Mb3dlckNhc2UoKS5zcGxpdCgiLSIpO2lmKHNpZ25pbmdTY2hlbWUubGVuZ3RoPT0xKXtpZihTVVBQT1JURURfSEFTSF9BTEdPUklUSE1TLm5vZGUuaW5kZXhPZihzaWduaW5nU2NoZW1lWzBdKT4tMSl7dGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucz17aGFzaDpzaWduaW5nU2NoZW1lWzBdfTt0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWU9REVGQVVMVF9TSUdOSU5HX1NDSEVNRX1lbHNle3RoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZT1zaWduaW5nU2NoZW1lWzBdO3RoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnM9e2hhc2g6bnVsbH19fWVsc2V7dGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucz17aGFzaDpzaWduaW5nU2NoZW1lWzFdfTt0aGlzLiRvcHRpb25zLnNpZ25pbmdTY2hlbWU9c2lnbmluZ1NjaGVtZVswXX19ZWxzZSBpZihfLmlzT2JqZWN0KG9wdGlvbnMuc2lnbmluZ1NjaGVtZSkpe3RoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZT1vcHRpb25zLnNpZ25pbmdTY2hlbWUuc2NoZW1lfHxERUZBVUxUX1NJR05JTkdfU0NIRU1FO3RoaXMuJG9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnM9Xy5vbWl0KG9wdGlvbnMuc2lnbmluZ1NjaGVtZSwic2NoZW1lIil9aWYoIXNjaGVtZXMuaXNTaWduYXR1cmUodGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lKSl7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIHNpZ25pbmcgc2NoZW1lIil9aWYodGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5oYXNoJiZTVVBQT1JURURfSEFTSF9BTEdPUklUSE1TW3RoaXMuJG9wdGlvbnMuZW52aXJvbm1lbnRdLmluZGV4T2YodGhpcy4kb3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5oYXNoKT09PS0xKXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQgaGFzaGluZyBhbGdvcml0aG0gZm9yICIrdGhpcy4kb3B0aW9ucy5lbnZpcm9ubWVudCsiIGVudmlyb25tZW50Iil9fWlmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZSl7aWYoXy5pc1N0cmluZyhvcHRpb25zLmVuY3J5cHRpb25TY2hlbWUpKXt0aGlzLiRvcHRpb25zLmVuY3J5cHRpb25TY2hlbWU9b3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lLnRvTG93ZXJDYXNlKCk7dGhpcy4kb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucz17fX1lbHNlIGlmKF8uaXNPYmplY3Qob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lKSl7dGhpcy4kb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lPW9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZS5zY2hlbWV8fERFRkFVTFRfRU5DUllQVElPTl9TQ0hFTUU7dGhpcy4kb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucz1fLm9taXQob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lLCJzY2hlbWUiKX1pZighc2NoZW1lcy5pc0VuY3J5cHRpb24odGhpcy4kb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lKSl7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGVuY3J5cHRpb24gc2NoZW1lIil9aWYodGhpcy4kb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5oYXNoJiZTVVBQT1JURURfSEFTSF9BTEdPUklUSE1TW3RoaXMuJG9wdGlvbnMuZW52aXJvbm1lbnRdLmluZGV4T2YodGhpcy4kb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5oYXNoKT09PS0xKXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQgaGFzaGluZyBhbGdvcml0aG0gZm9yICIrdGhpcy4kb3B0aW9ucy5lbnZpcm9ubWVudCsiIGVudmlyb25tZW50Iil9fXRoaXMua2V5UGFpci5zZXRPcHRpb25zKHRoaXMuJG9wdGlvbnMpfTtOb2RlUlNBLnByb3RvdHlwZS5nZW5lcmF0ZUtleVBhaXI9ZnVuY3Rpb24oYml0cyxleHApe2JpdHM9Yml0c3x8MjA0ODtleHA9ZXhwfHw2NTUzNztpZihiaXRzJTghPT0wKXt0aHJvdyBFcnJvcigiS2V5IHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDguIil9dGhpcy5rZXlQYWlyLmdlbmVyYXRlKGJpdHMsZXhwLnRvU3RyaW5nKDE2KSk7dGhpcy4kY2FjaGU9e307cmV0dXJuIHRoaXN9O05vZGVSU0EucHJvdG90eXBlLmltcG9ydEtleT1mdW5jdGlvbihrZXlEYXRhLGZvcm1hdCl7aWYoIWtleURhdGEpe3Rocm93IEVycm9yKCJFbXB0eSBrZXkgZ2l2ZW4iKX1pZihmb3JtYXQpe2Zvcm1hdD1FWFBPUlRfRk9STUFUX0FMSUFTRVNbZm9ybWF0XXx8Zm9ybWF0fWlmKCFmb3JtYXRzLmRldGVjdEFuZEltcG9ydCh0aGlzLmtleVBhaXIsa2V5RGF0YSxmb3JtYXQpJiZmb3JtYXQ9PT11bmRlZmluZWQpe3Rocm93IEVycm9yKCJLZXkgZm9ybWF0IG11c3QgYmUgc3BlY2lmaWVkIil9dGhpcy4kY2FjaGU9e307cmV0dXJuIHRoaXN9O05vZGVSU0EucHJvdG90eXBlLmV4cG9ydEtleT1mdW5jdGlvbihmb3JtYXQpe2Zvcm1hdD1mb3JtYXR8fERFRkFVTFRfRVhQT1JUX0ZPUk1BVDtmb3JtYXQ9RVhQT1JUX0ZPUk1BVF9BTElBU0VTW2Zvcm1hdF18fGZvcm1hdDtpZighdGhpcy4kY2FjaGVbZm9ybWF0XSl7dGhpcy4kY2FjaGVbZm9ybWF0XT1mb3JtYXRzLmRldGVjdEFuZEV4cG9ydCh0aGlzLmtleVBhaXIsZm9ybWF0KX1yZXR1cm4gdGhpcy4kY2FjaGVbZm9ybWF0XX07Tm9kZVJTQS5wcm90b3R5cGUuaXNQcml2YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMua2V5UGFpci5pc1ByaXZhdGUoKX07Tm9kZVJTQS5wcm90b3R5cGUuaXNQdWJsaWM9ZnVuY3Rpb24oc3RyaWN0KXtyZXR1cm4gdGhpcy5rZXlQYWlyLmlzUHVibGljKHN0cmljdCl9O05vZGVSU0EucHJvdG90eXBlLmlzRW1wdHk9ZnVuY3Rpb24oc3RyaWN0KXtyZXR1cm4hKHRoaXMua2V5UGFpci5ufHx0aGlzLmtleVBhaXIuZXx8dGhpcy5rZXlQYWlyLmQpfTtOb2RlUlNBLnByb3RvdHlwZS5lbmNyeXB0PWZ1bmN0aW9uKGJ1ZmZlcixlbmNvZGluZyxzb3VyY2VfZW5jb2Rpbmcpe3JldHVybiB0aGlzLiQkZW5jcnlwdEtleShmYWxzZSxidWZmZXIsZW5jb2Rpbmcsc291cmNlX2VuY29kaW5nKX07Tm9kZVJTQS5wcm90b3R5cGUuZGVjcnlwdD1mdW5jdGlvbihidWZmZXIsZW5jb2Rpbmcpe3JldHVybiB0aGlzLiQkZGVjcnlwdEtleShmYWxzZSxidWZmZXIsZW5jb2RpbmcpfTtOb2RlUlNBLnByb3RvdHlwZS5lbmNyeXB0UHJpdmF0ZT1mdW5jdGlvbihidWZmZXIsZW5jb2Rpbmcsc291cmNlX2VuY29kaW5nKXtyZXR1cm4gdGhpcy4kJGVuY3J5cHRLZXkodHJ1ZSxidWZmZXIsZW5jb2Rpbmcsc291cmNlX2VuY29kaW5nKX07Tm9kZVJTQS5wcm90b3R5cGUuZGVjcnlwdFB1YmxpYz1mdW5jdGlvbihidWZmZXIsZW5jb2Rpbmcpe3JldHVybiB0aGlzLiQkZGVjcnlwdEtleSh0cnVlLGJ1ZmZlcixlbmNvZGluZyl9O05vZGVSU0EucHJvdG90eXBlLiQkZW5jcnlwdEtleT1mdW5jdGlvbih1c2VQcml2YXRlLGJ1ZmZlcixlbmNvZGluZyxzb3VyY2VfZW5jb2Rpbmcpe3RyeXt2YXIgcmVzPXRoaXMua2V5UGFpci5lbmNyeXB0KHRoaXMuJGdldERhdGFGb3JFbmNyeXB0KGJ1ZmZlcixzb3VyY2VfZW5jb2RpbmcpLHVzZVByaXZhdGUpO2lmKGVuY29kaW5nPT0iYnVmZmVyInx8IWVuY29kaW5nKXtyZXR1cm4gcmVzfWVsc2V7cmV0dXJuIHJlcy50b1N0cmluZyhlbmNvZGluZyl9fWNhdGNoKGUpe3Rocm93IEVycm9yKCJFcnJvciBkdXJpbmcgZW5jcnlwdGlvbi4gT3JpZ2luYWwgZXJyb3I6ICIrZS5zdGFjayl9fTtOb2RlUlNBLnByb3RvdHlwZS4kJGRlY3J5cHRLZXk9ZnVuY3Rpb24odXNlUHVibGljLGJ1ZmZlcixlbmNvZGluZyl7dHJ5e2J1ZmZlcj1fLmlzU3RyaW5nKGJ1ZmZlcik/QnVmZmVyLmZyb20oYnVmZmVyLCJiYXNlNjQiKTpidWZmZXI7dmFyIHJlcz10aGlzLmtleVBhaXIuZGVjcnlwdChidWZmZXIsdXNlUHVibGljKTtpZihyZXM9PT1udWxsKXt0aHJvdyBFcnJvcigiS2V5IGRlY3J5cHQgbWV0aG9kIHJldHVybnMgbnVsbC4iKX1yZXR1cm4gdGhpcy4kZ2V0RGVjcnlwdGVkRGF0YShyZXMsZW5jb2RpbmcpfWNhdGNoKGUpe3Rocm93IEVycm9yKCJFcnJvciBkdXJpbmcgZGVjcnlwdGlvbiAocHJvYmFibHkgaW5jb3JyZWN0IGtleSkuIE9yaWdpbmFsIGVycm9yOiAiK2Uuc3RhY2spfX07Tm9kZVJTQS5wcm90b3R5cGUuc2lnbj1mdW5jdGlvbihidWZmZXIsZW5jb2Rpbmcsc291cmNlX2VuY29kaW5nKXtpZighdGhpcy5pc1ByaXZhdGUoKSl7dGhyb3cgRXJyb3IoIlRoaXMgaXMgbm90IHByaXZhdGUga2V5Iil9dmFyIHJlcz10aGlzLmtleVBhaXIuc2lnbih0aGlzLiRnZXREYXRhRm9yRW5jcnlwdChidWZmZXIsc291cmNlX2VuY29kaW5nKSk7aWYoZW5jb2RpbmcmJmVuY29kaW5nIT0iYnVmZmVyIil7cmVzPXJlcy50b1N0cmluZyhlbmNvZGluZyl9cmV0dXJuIHJlc307Tm9kZVJTQS5wcm90b3R5cGUudmVyaWZ5PWZ1bmN0aW9uKGJ1ZmZlcixzaWduYXR1cmUsc291cmNlX2VuY29kaW5nLHNpZ25hdHVyZV9lbmNvZGluZyl7aWYoIXRoaXMuaXNQdWJsaWMoKSl7dGhyb3cgRXJyb3IoIlRoaXMgaXMgbm90IHB1YmxpYyBrZXkiKX1zaWduYXR1cmVfZW5jb2Rpbmc9IXNpZ25hdHVyZV9lbmNvZGluZ3x8c2lnbmF0dXJlX2VuY29kaW5nPT0iYnVmZmVyIj9udWxsOnNpZ25hdHVyZV9lbmNvZGluZztyZXR1cm4gdGhpcy5rZXlQYWlyLnZlcmlmeSh0aGlzLiRnZXREYXRhRm9yRW5jcnlwdChidWZmZXIsc291cmNlX2VuY29kaW5nKSxzaWduYXR1cmUsc2lnbmF0dXJlX2VuY29kaW5nKX07Tm9kZVJTQS5wcm90b3R5cGUuZ2V0S2V5U2l6ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmtleVBhaXIua2V5U2l6ZX07Tm9kZVJTQS5wcm90b3R5cGUuZ2V0TWF4TWVzc2FnZVNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5rZXlQYWlyLm1heE1lc3NhZ2VMZW5ndGh9O05vZGVSU0EucHJvdG90eXBlLiRnZXREYXRhRm9yRW5jcnlwdD1mdW5jdGlvbihidWZmZXIsZW5jb2Rpbmcpe2lmKF8uaXNTdHJpbmcoYnVmZmVyKXx8Xy5pc051bWJlcihidWZmZXIpKXtyZXR1cm4gQnVmZmVyLmZyb20oIiIrYnVmZmVyLGVuY29kaW5nfHwidXRmOCIpfWVsc2UgaWYoQnVmZmVyLmlzQnVmZmVyKGJ1ZmZlcikpe3JldHVybiBidWZmZXJ9ZWxzZSBpZihfLmlzT2JqZWN0KGJ1ZmZlcikpe3JldHVybiBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShidWZmZXIpKX1lbHNle3Rocm93IEVycm9yKCJVbmV4cGVjdGVkIGRhdGEgdHlwZSIpfX07Tm9kZVJTQS5wcm90b3R5cGUuJGdldERlY3J5cHRlZERhdGE9ZnVuY3Rpb24oYnVmZmVyLGVuY29kaW5nKXtlbmNvZGluZz1lbmNvZGluZ3x8ImJ1ZmZlciI7aWYoZW5jb2Rpbmc9PSJidWZmZXIiKXtyZXR1cm4gYnVmZmVyfWVsc2UgaWYoZW5jb2Rpbmc9PSJqc29uIil7cmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyLnRvU3RyaW5nKCkpfWVsc2V7cmV0dXJuIGJ1ZmZlci50b1N0cmluZyhlbmNvZGluZyl9fTtyZXR1cm4gTm9kZVJTQX0oKX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4vZm9ybWF0cy9mb3JtYXRzLmpzIjo0NSwiLi9saWJzL3JzYS5qcyI6NDksIi4vc2NoZW1lcy9zY2hlbWVzLmpzIjo1MywiLi91dGlscyI6NTQsYnVmZmVyOjI1LGNvbnN0YW50czoyNyxzZWVkcmFuZG9tOjgxfV0sMzk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpeyJ1c2Ugc3RyaWN0Ijt2YXIgdXRpbHM9cmVxdWlyZSgiLi91dGlscyIpO3ZhciBzdGFuZGFsb25lQ3JlYXRlSGFzaD1yZXF1aXJlKCJjcmVhdGUtaGFzaCIpO3ZhciBnZXROb2RlQ3J5cHRvPWZ1bmN0aW9uKCl7dmFyIG5vZGVDcnlwdG89dW5kZWZpbmVkO3JldHVybiBmdW5jdGlvbigpe2lmKG5vZGVDcnlwdG89PT11bmRlZmluZWQpe25vZGVDcnlwdG89cmVxdWlyZSgiY3J5cHRvIisiIil9cmV0dXJuIG5vZGVDcnlwdG99fSgpO21vZHVsZS5leHBvcnRzPXt9O21vZHVsZS5leHBvcnRzLmNyZWF0ZUhhc2g9ZnVuY3Rpb24oKXtpZih1dGlscy5kZXRlY3RFbnZpcm9ubWVudCgpPT09Im5vZGUiKXt0cnl7dmFyIG5vZGVDcnlwdG89Z2V0Tm9kZUNyeXB0bygpO3JldHVybiBub2RlQ3J5cHRvLmNyZWF0ZUhhc2guYmluZChub2RlQ3J5cHRvKX1jYXRjaChlcnJvcil7fX1yZXR1cm4gc3RhbmRhbG9uZUNyZWF0ZUhhc2h9KCk7WyJjcmVhdGVTaWduIiwiY3JlYXRlVmVyaWZ5Il0uZm9yRWFjaChmdW5jdGlvbihmbk5hbWUpe21vZHVsZS5leHBvcnRzW2ZuTmFtZV09ZnVuY3Rpb24oKXt2YXIgbm9kZUNyeXB0bz1nZXROb2RlQ3J5cHRvKCk7bm9kZUNyeXB0b1tmbk5hbWVdLmFwcGx5KG5vZGVDcnlwdG8sYXJndW1lbnRzKX19KTttb2R1bGUuZXhwb3J0cy5yYW5kb21CeXRlcz1mdW5jdGlvbigpe3ZhciBicm93c2VyR2V0UmFuZG9tVmFsdWVzPWZ1bmN0aW9uKCl7aWYodHlwZW9mIGNyeXB0bz09PSJvYmplY3QiJiYhIWNyeXB0by5nZXRSYW5kb21WYWx1ZXMpe3JldHVybiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKX1lbHNlIGlmKHR5cGVvZiBtc0NyeXB0bz09PSJvYmplY3QiJiYhIW1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyl7cmV0dXJuIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKX1lbHNlIGlmKHR5cGVvZiBzZWxmPT09Im9iamVjdCImJnR5cGVvZiBzZWxmLmNyeXB0bz09PSJvYmplY3QiJiYhIXNlbGYuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyl7cmV0dXJuIHNlbGYuY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKHNlbGYuY3J5cHRvKX1lbHNle3JldHVybiB1bmRlZmluZWR9fSgpO3ZhciBnZXRSYW5kb21WYWx1ZXM9ZnVuY3Rpb24oKXt2YXIgbm9uQ3J5cHRvZ3JhcGhpY0dldFJhbmRvbVZhbHVlPWZ1bmN0aW9uKGFidil7dmFyIGw9YWJ2Lmxlbmd0aDt3aGlsZShsLS0pe2FidltsXT1NYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMjU2KX1yZXR1cm4gYWJ2fTtyZXR1cm4gZnVuY3Rpb24oYWJ2KXtpZihNYXRoLnJhbmRvbS5pc1NlZWRlZCl7cmV0dXJuIG5vbkNyeXB0b2dyYXBoaWNHZXRSYW5kb21WYWx1ZShhYnYpfWVsc2V7aWYoISFicm93c2VyR2V0UmFuZG9tVmFsdWVzKXtyZXR1cm4gYnJvd3NlckdldFJhbmRvbVZhbHVlcyhhYnYpfWVsc2V7cmV0dXJuIG5vbkNyeXB0b2dyYXBoaWNHZXRSYW5kb21WYWx1ZShhYnYpfX19fSgpO3ZhciBNQVhfQllURVM9NjU1MzY7dmFyIE1BWF9VSU5UMzI9NDI5NDk2NzI5NTtyZXR1cm4gZnVuY3Rpb24gcmFuZG9tQnl0ZXMoc2l6ZSl7aWYoIU1hdGgucmFuZG9tLmlzU2VlZGVkJiYhYnJvd3NlckdldFJhbmRvbVZhbHVlcyl7dHJ5e3ZhciBub2RlQnVmZmVySW5zdD1nZXROb2RlQ3J5cHRvKCkucmFuZG9tQnl0ZXMoc2l6ZSk7cmV0dXJuIEJ1ZmZlci5mcm9tKG5vZGVCdWZmZXJJbnN0LmJ1ZmZlcixub2RlQnVmZmVySW5zdC5ieXRlT2Zmc2V0LG5vZGVCdWZmZXJJbnN0Lmxlbmd0aCl9Y2F0Y2goZXJyb3Ipe319aWYoc2l6ZT5NQVhfVUlOVDMyKXRocm93IG5ldyBSYW5nZUVycm9yKCJyZXF1ZXN0ZWQgdG9vIG1hbnkgcmFuZG9tIGJ5dGVzIik7dmFyIGJ5dGVzPUJ1ZmZlci5hbGxvY1Vuc2FmZShzaXplKTtpZihzaXplPjApe2lmKHNpemU+TUFYX0JZVEVTKXtmb3IodmFyIGdlbmVyYXRlZD0wO2dlbmVyYXRlZDxzaXplO2dlbmVyYXRlZCs9TUFYX0JZVEVTKXtnZXRSYW5kb21WYWx1ZXMoYnl0ZXMuc2xpY2UoZ2VuZXJhdGVkLGdlbmVyYXRlZCtNQVhfQllURVMpKX19ZWxzZXtnZXRSYW5kb21WYWx1ZXMoYnl0ZXMpfX1yZXR1cm4gYnl0ZXN9fSgpfSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi91dGlscyI6NTQsYnVmZmVyOjI1LCJjcmVhdGUtaGFzaCI6Mjl9XSw0MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9e2dldEVuZ2luZTpmdW5jdGlvbihrZXlQYWlyLG9wdGlvbnMpe3ZhciBlbmdpbmU9cmVxdWlyZSgiLi9qcy5qcyIpO2lmKG9wdGlvbnMuZW52aXJvbm1lbnQ9PT0ibm9kZSIpe3ZhciBjcnlwdD1yZXF1aXJlKCJjcnlwdG8iKyIiKTtpZih0eXBlb2YgY3J5cHQucHVibGljRW5jcnlwdD09PSJmdW5jdGlvbiImJnR5cGVvZiBjcnlwdC5wcml2YXRlRGVjcnlwdD09PSJmdW5jdGlvbiIpe2lmKHR5cGVvZiBjcnlwdC5wcml2YXRlRW5jcnlwdD09PSJmdW5jdGlvbiImJnR5cGVvZiBjcnlwdC5wdWJsaWNEZWNyeXB0PT09ImZ1bmN0aW9uIil7ZW5naW5lPXJlcXVpcmUoIi4vaW8uanMiKX1lbHNle2VuZ2luZT1yZXF1aXJlKCIuL25vZGUxMi5qcyIpfX19cmV0dXJuIGVuZ2luZShrZXlQYWlyLG9wdGlvbnMpfX19LHsiLi9pby5qcyI6NDEsIi4vanMuanMiOjQyLCIuL25vZGUxMi5qcyI6NDN9XSw0MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGNyeXB0bz1yZXF1aXJlKCJjcnlwdG8iKyIiKTt2YXIgY29uc3RhbnRzPXJlcXVpcmUoImNvbnN0YW50cyIpO3ZhciBzY2hlbWVzPXJlcXVpcmUoIi4uL3NjaGVtZXMvc2NoZW1lcy5qcyIpO21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKGtleVBhaXIsb3B0aW9ucyl7dmFyIHBrY3MxU2NoZW1lPXNjaGVtZXMucGtjczEubWFrZVNjaGVtZShrZXlQYWlyLG9wdGlvbnMpO3JldHVybntlbmNyeXB0OmZ1bmN0aW9uKGJ1ZmZlcix1c2VQcml2YXRlKXt2YXIgcGFkZGluZztpZih1c2VQcml2YXRlKXtwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfUEFERElORztpZihvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZvcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmcpe3BhZGRpbmc9b3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nfXJldHVybiBjcnlwdG8ucHJpdmF0ZUVuY3J5cHQoe2tleTpvcHRpb25zLnJzYVV0aWxzLmV4cG9ydEtleSgicHJpdmF0ZSIpLHBhZGRpbmc6cGFkZGluZ30sYnVmZmVyKX1lbHNle3BhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9PQUVQX1BBRERJTkc7aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lPT09InBrY3MxIil7cGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX1BBRERJTkd9aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nKXtwYWRkaW5nPW9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZ312YXIgZGF0YT1idWZmZXI7aWYocGFkZGluZz09PWNvbnN0YW50cy5SU0FfTk9fUEFERElORyl7ZGF0YT1wa2NzMVNjaGVtZS5wa2NzMHBhZChidWZmZXIpfXJldHVybiBjcnlwdG8ucHVibGljRW5jcnlwdCh7a2V5Om9wdGlvbnMucnNhVXRpbHMuZXhwb3J0S2V5KCJwdWJsaWMiKSxwYWRkaW5nOnBhZGRpbmd9LGRhdGEpfX0sZGVjcnlwdDpmdW5jdGlvbihidWZmZXIsdXNlUHVibGljKXt2YXIgcGFkZGluZztpZih1c2VQdWJsaWMpe3BhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9QQURESU5HO2lmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZyl7cGFkZGluZz1vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmd9cmV0dXJuIGNyeXB0by5wdWJsaWNEZWNyeXB0KHtrZXk6b3B0aW9ucy5yc2FVdGlscy5leHBvcnRLZXkoInB1YmxpYyIpLHBhZGRpbmc6cGFkZGluZ30sYnVmZmVyKX1lbHNle3BhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9PQUVQX1BBRERJTkc7aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lPT09InBrY3MxIil7cGFkZGluZz1jb25zdGFudHMuUlNBX1BLQ1MxX1BBRERJTkd9aWYob3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmb3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nKXtwYWRkaW5nPW9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZ312YXIgcmVzPWNyeXB0by5wcml2YXRlRGVjcnlwdCh7a2V5Om9wdGlvbnMucnNhVXRpbHMuZXhwb3J0S2V5KCJwcml2YXRlIikscGFkZGluZzpwYWRkaW5nfSxidWZmZXIpO2lmKHBhZGRpbmc9PT1jb25zdGFudHMuUlNBX05PX1BBRERJTkcpe3JldHVybiBwa2NzMVNjaGVtZS5wa2NzMHVucGFkKHJlcyl9cmV0dXJuIHJlc319fX19LHsiLi4vc2NoZW1lcy9zY2hlbWVzLmpzIjo1Myxjb25zdGFudHM6Mjd9XSw0MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIEJpZ0ludGVnZXI9cmVxdWlyZSgiLi4vbGlicy9qc2JuLmpzIik7dmFyIHNjaGVtZXM9cmVxdWlyZSgiLi4vc2NoZW1lcy9zY2hlbWVzLmpzIik7bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24oa2V5UGFpcixvcHRpb25zKXt2YXIgcGtjczFTY2hlbWU9c2NoZW1lcy5wa2NzMS5tYWtlU2NoZW1lKGtleVBhaXIsb3B0aW9ucyk7cmV0dXJue2VuY3J5cHQ6ZnVuY3Rpb24oYnVmZmVyLHVzZVByaXZhdGUpe3ZhciBtLGM7aWYodXNlUHJpdmF0ZSl7bT1uZXcgQmlnSW50ZWdlcihwa2NzMVNjaGVtZS5lbmNQYWQoYnVmZmVyLHt0eXBlOjF9KSk7Yz1rZXlQYWlyLiRkb1ByaXZhdGUobSl9ZWxzZXttPW5ldyBCaWdJbnRlZ2VyKGtleVBhaXIuZW5jcnlwdGlvblNjaGVtZS5lbmNQYWQoYnVmZmVyKSk7Yz1rZXlQYWlyLiRkb1B1YmxpYyhtKX1yZXR1cm4gYy50b0J1ZmZlcihrZXlQYWlyLmVuY3J5cHRlZERhdGFMZW5ndGgpfSxkZWNyeXB0OmZ1bmN0aW9uKGJ1ZmZlcix1c2VQdWJsaWMpe3ZhciBtLGM9bmV3IEJpZ0ludGVnZXIoYnVmZmVyKTtpZih1c2VQdWJsaWMpe209a2V5UGFpci4kZG9QdWJsaWMoYyk7cmV0dXJuIHBrY3MxU2NoZW1lLmVuY1VuUGFkKG0udG9CdWZmZXIoa2V5UGFpci5lbmNyeXB0ZWREYXRhTGVuZ3RoKSx7dHlwZToxfSl9ZWxzZXttPWtleVBhaXIuJGRvUHJpdmF0ZShjKTtyZXR1cm4ga2V5UGFpci5lbmNyeXB0aW9uU2NoZW1lLmVuY1VuUGFkKG0udG9CdWZmZXIoa2V5UGFpci5lbmNyeXB0ZWREYXRhTGVuZ3RoKSl9fX19fSx7Ii4uL2xpYnMvanNibi5qcyI6NDgsIi4uL3NjaGVtZXMvc2NoZW1lcy5qcyI6NTN9XSw0MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGNyeXB0bz1yZXF1aXJlKCJjcnlwdG8iKyIiKTt2YXIgY29uc3RhbnRzPXJlcXVpcmUoImNvbnN0YW50cyIpO3ZhciBzY2hlbWVzPXJlcXVpcmUoIi4uL3NjaGVtZXMvc2NoZW1lcy5qcyIpO21vZHVsZS5leHBvcnRzPWZ1bmN0aW9uKGtleVBhaXIsb3B0aW9ucyl7dmFyIGpzRW5naW5lPXJlcXVpcmUoIi4vanMuanMiKShrZXlQYWlyLG9wdGlvbnMpO3ZhciBwa2NzMVNjaGVtZT1zY2hlbWVzLnBrY3MxLm1ha2VTY2hlbWUoa2V5UGFpcixvcHRpb25zKTtyZXR1cm57ZW5jcnlwdDpmdW5jdGlvbihidWZmZXIsdXNlUHJpdmF0ZSl7aWYodXNlUHJpdmF0ZSl7cmV0dXJuIGpzRW5naW5lLmVuY3J5cHQoYnVmZmVyLHVzZVByaXZhdGUpfXZhciBwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfT0FFUF9QQURESU5HO2lmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZT09PSJwa2NzMSIpe3BhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9QQURESU5HfWlmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZyl7cGFkZGluZz1vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmd9dmFyIGRhdGE9YnVmZmVyO2lmKHBhZGRpbmc9PT1jb25zdGFudHMuUlNBX05PX1BBRERJTkcpe2RhdGE9cGtjczFTY2hlbWUucGtjczBwYWQoYnVmZmVyKX1yZXR1cm4gY3J5cHRvLnB1YmxpY0VuY3J5cHQoe2tleTpvcHRpb25zLnJzYVV0aWxzLmV4cG9ydEtleSgicHVibGljIikscGFkZGluZzpwYWRkaW5nfSxkYXRhKX0sZGVjcnlwdDpmdW5jdGlvbihidWZmZXIsdXNlUHVibGljKXtpZih1c2VQdWJsaWMpe3JldHVybiBqc0VuZ2luZS5kZWNyeXB0KGJ1ZmZlcix1c2VQdWJsaWMpfXZhciBwYWRkaW5nPWNvbnN0YW50cy5SU0FfUEtDUzFfT0FFUF9QQURESU5HO2lmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZT09PSJwa2NzMSIpe3BhZGRpbmc9Y29uc3RhbnRzLlJTQV9QS0NTMV9QQURESU5HfWlmKG9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZyl7cGFkZGluZz1vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmd9dmFyIHJlcz1jcnlwdG8ucHJpdmF0ZURlY3J5cHQoe2tleTpvcHRpb25zLnJzYVV0aWxzLmV4cG9ydEtleSgicHJpdmF0ZSIpLHBhZGRpbmc6cGFkZGluZ30sYnVmZmVyKTtpZihwYWRkaW5nPT09Y29uc3RhbnRzLlJTQV9OT19QQURESU5HKXtyZXR1cm4gcGtjczFTY2hlbWUucGtjczB1bnBhZChyZXMpfXJldHVybiByZXN9fX19LHsiLi4vc2NoZW1lcy9zY2hlbWVzLmpzIjo1MywiLi9qcy5qcyI6NDIsY29uc3RhbnRzOjI3fV0sNDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBfPXJlcXVpcmUoIi4uL3V0aWxzIikuXzttb2R1bGUuZXhwb3J0cz17cHJpdmF0ZUV4cG9ydDpmdW5jdGlvbihrZXksb3B0aW9ucyl7cmV0dXJue246a2V5Lm4udG9CdWZmZXIoKSxlOmtleS5lLGQ6a2V5LmQudG9CdWZmZXIoKSxwOmtleS5wLnRvQnVmZmVyKCkscTprZXkucS50b0J1ZmZlcigpLGRtcDE6a2V5LmRtcDEudG9CdWZmZXIoKSxkbXExOmtleS5kbXExLnRvQnVmZmVyKCksY29lZmY6a2V5LmNvZWZmLnRvQnVmZmVyKCl9fSxwcml2YXRlSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhLG9wdGlvbnMpe2lmKGRhdGEubiYmZGF0YS5lJiZkYXRhLmQmJmRhdGEucCYmZGF0YS5xJiZkYXRhLmRtcDEmJmRhdGEuZG1xMSYmZGF0YS5jb2VmZil7a2V5LnNldFByaXZhdGUoZGF0YS5uLGRhdGEuZSxkYXRhLmQsZGF0YS5wLGRhdGEucSxkYXRhLmRtcDEsZGF0YS5kbXExLGRhdGEuY29lZmYpfWVsc2V7dGhyb3cgRXJyb3IoIkludmFsaWQga2V5IGRhdGEiKX19LHB1YmxpY0V4cG9ydDpmdW5jdGlvbihrZXksb3B0aW9ucyl7cmV0dXJue246a2V5Lm4udG9CdWZmZXIoKSxlOmtleS5lfX0scHVibGljSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhLG9wdGlvbnMpe2lmKGRhdGEubiYmZGF0YS5lKXtrZXkuc2V0UHVibGljKGRhdGEubixkYXRhLmUpfWVsc2V7dGhyb3cgRXJyb3IoIkludmFsaWQga2V5IGRhdGEiKX19LGF1dG9JbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEpe2lmKGRhdGEubiYmZGF0YS5lKXtpZihkYXRhLmQmJmRhdGEucCYmZGF0YS5xJiZkYXRhLmRtcDEmJmRhdGEuZG1xMSYmZGF0YS5jb2VmZil7bW9kdWxlLmV4cG9ydHMucHJpdmF0ZUltcG9ydChrZXksZGF0YSk7cmV0dXJuIHRydWV9ZWxzZXttb2R1bGUuZXhwb3J0cy5wdWJsaWNJbXBvcnQoa2V5LGRhdGEpO3JldHVybiB0cnVlfX1yZXR1cm4gZmFsc2V9fX0seyIuLi91dGlscyI6NTR9XSw0NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7ZnVuY3Rpb24gZm9ybWF0UGFyc2UoZm9ybWF0KXtmb3JtYXQ9Zm9ybWF0LnNwbGl0KCItIik7dmFyIGtleVR5cGU9InByaXZhdGUiO3ZhciBrZXlPcHQ9e3R5cGU6ImRlZmF1bHQifTtmb3IodmFyIGk9MTtpPGZvcm1hdC5sZW5ndGg7aSsrKXtpZihmb3JtYXRbaV0pe3N3aXRjaChmb3JtYXRbaV0pe2Nhc2UicHVibGljIjprZXlUeXBlPWZvcm1hdFtpXTticmVhaztjYXNlInByaXZhdGUiOmtleVR5cGU9Zm9ybWF0W2ldO2JyZWFrO2Nhc2UicGVtIjprZXlPcHQudHlwZT1mb3JtYXRbaV07YnJlYWs7Y2FzZSJkZXIiOmtleU9wdC50eXBlPWZvcm1hdFtpXTticmVha319fXJldHVybntzY2hlbWU6Zm9ybWF0WzBdLGtleVR5cGU6a2V5VHlwZSxrZXlPcHQ6a2V5T3B0fX1tb2R1bGUuZXhwb3J0cz17cGtjczE6cmVxdWlyZSgiLi9wa2NzMSIpLHBrY3M4OnJlcXVpcmUoIi4vcGtjczgiKSxjb21wb25lbnRzOnJlcXVpcmUoIi4vY29tcG9uZW50cyIpLGlzUHJpdmF0ZUV4cG9ydDpmdW5jdGlvbihmb3JtYXQpe3JldHVybiBtb2R1bGUuZXhwb3J0c1tmb3JtYXRdJiZ0eXBlb2YgbW9kdWxlLmV4cG9ydHNbZm9ybWF0XS5wcml2YXRlRXhwb3J0PT09ImZ1bmN0aW9uIn0saXNQcml2YXRlSW1wb3J0OmZ1bmN0aW9uKGZvcm1hdCl7cmV0dXJuIG1vZHVsZS5leHBvcnRzW2Zvcm1hdF0mJnR5cGVvZiBtb2R1bGUuZXhwb3J0c1tmb3JtYXRdLnByaXZhdGVJbXBvcnQ9PT0iZnVuY3Rpb24ifSxpc1B1YmxpY0V4cG9ydDpmdW5jdGlvbihmb3JtYXQpe3JldHVybiBtb2R1bGUuZXhwb3J0c1tmb3JtYXRdJiZ0eXBlb2YgbW9kdWxlLmV4cG9ydHNbZm9ybWF0XS5wdWJsaWNFeHBvcnQ9PT0iZnVuY3Rpb24ifSxpc1B1YmxpY0ltcG9ydDpmdW5jdGlvbihmb3JtYXQpe3JldHVybiBtb2R1bGUuZXhwb3J0c1tmb3JtYXRdJiZ0eXBlb2YgbW9kdWxlLmV4cG9ydHNbZm9ybWF0XS5wdWJsaWNJbXBvcnQ9PT0iZnVuY3Rpb24ifSxkZXRlY3RBbmRJbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEsZm9ybWF0KXtpZihmb3JtYXQ9PT11bmRlZmluZWQpe2Zvcih2YXIgc2NoZW1lIGluIG1vZHVsZS5leHBvcnRzKXtpZih0eXBlb2YgbW9kdWxlLmV4cG9ydHNbc2NoZW1lXS5hdXRvSW1wb3J0PT09ImZ1bmN0aW9uIiYmbW9kdWxlLmV4cG9ydHNbc2NoZW1lXS5hdXRvSW1wb3J0KGtleSxkYXRhKSl7cmV0dXJuIHRydWV9fX1lbHNlIGlmKGZvcm1hdCl7dmFyIGZtdD1mb3JtYXRQYXJzZShmb3JtYXQpO2lmKG1vZHVsZS5leHBvcnRzW2ZtdC5zY2hlbWVdKXtpZihmbXQua2V5VHlwZT09PSJwcml2YXRlIil7bW9kdWxlLmV4cG9ydHNbZm10LnNjaGVtZV0ucHJpdmF0ZUltcG9ydChrZXksZGF0YSxmbXQua2V5T3B0KX1lbHNle21vZHVsZS5leHBvcnRzW2ZtdC5zY2hlbWVdLnB1YmxpY0ltcG9ydChrZXksZGF0YSxmbXQua2V5T3B0KX19ZWxzZXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQga2V5IGZvcm1hdCIpfX1yZXR1cm4gZmFsc2V9LGRldGVjdEFuZEV4cG9ydDpmdW5jdGlvbihrZXksZm9ybWF0KXtpZihmb3JtYXQpe3ZhciBmbXQ9Zm9ybWF0UGFyc2UoZm9ybWF0KTtpZihtb2R1bGUuZXhwb3J0c1tmbXQuc2NoZW1lXSl7aWYoZm10LmtleVR5cGU9PT0icHJpdmF0ZSIpe2lmKCFrZXkuaXNQcml2YXRlKCkpe3Rocm93IEVycm9yKCJUaGlzIGlzIG5vdCBwcml2YXRlIGtleSIpfXJldHVybiBtb2R1bGUuZXhwb3J0c1tmbXQuc2NoZW1lXS5wcml2YXRlRXhwb3J0KGtleSxmbXQua2V5T3B0KX1lbHNle2lmKCFrZXkuaXNQdWJsaWMoKSl7dGhyb3cgRXJyb3IoIlRoaXMgaXMgbm90IHB1YmxpYyBrZXkiKX1yZXR1cm4gbW9kdWxlLmV4cG9ydHNbZm10LnNjaGVtZV0ucHVibGljRXhwb3J0KGtleSxmbXQua2V5T3B0KX19ZWxzZXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQga2V5IGZvcm1hdCIpfX19fX0seyIuL2NvbXBvbmVudHMiOjQ0LCIuL3BrY3MxIjo0NiwiLi9wa2NzOCI6NDd9XSw0NjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIGJlcj1yZXF1aXJlKCJhc24xIikuQmVyO3ZhciBfPXJlcXVpcmUoIi4uL3V0aWxzIikuXzt2YXIgdXRpbHM9cmVxdWlyZSgiLi4vdXRpbHMiKTt2YXIgUFJJVkFURV9PUEVOSU5HX0JPVU5EQVJZPSItLS0tLUJFR0lOIFJTQSBQUklWQVRFIEtFWS0tLS0tIjt2YXIgUFJJVkFURV9DTE9TSU5HX0JPVU5EQVJZPSItLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLSI7dmFyIFBVQkxJQ19PUEVOSU5HX0JPVU5EQVJZPSItLS0tLUJFR0lOIFJTQSBQVUJMSUMgS0VZLS0tLS0iO3ZhciBQVUJMSUNfQ0xPU0lOR19CT1VOREFSWT0iLS0tLS1FTkQgUlNBIFBVQkxJQyBLRVktLS0tLSI7bW9kdWxlLmV4cG9ydHM9e3ByaXZhdGVFeHBvcnQ6ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIG49a2V5Lm4udG9CdWZmZXIoKTt2YXIgZD1rZXkuZC50b0J1ZmZlcigpO3ZhciBwPWtleS5wLnRvQnVmZmVyKCk7dmFyIHE9a2V5LnEudG9CdWZmZXIoKTt2YXIgZG1wMT1rZXkuZG1wMS50b0J1ZmZlcigpO3ZhciBkbXExPWtleS5kbXExLnRvQnVmZmVyKCk7dmFyIGNvZWZmPWtleS5jb2VmZi50b0J1ZmZlcigpO3ZhciBsZW5ndGg9bi5sZW5ndGgrZC5sZW5ndGgrcC5sZW5ndGgrcS5sZW5ndGgrZG1wMS5sZW5ndGgrZG1xMS5sZW5ndGgrY29lZmYubGVuZ3RoKzUxMjt2YXIgd3JpdGVyPW5ldyBiZXIuV3JpdGVyKHtzaXplOmxlbmd0aH0pO3dyaXRlci5zdGFydFNlcXVlbmNlKCk7d3JpdGVyLndyaXRlSW50KDApO3dyaXRlci53cml0ZUJ1ZmZlcihuLDIpO3dyaXRlci53cml0ZUludChrZXkuZSk7d3JpdGVyLndyaXRlQnVmZmVyKGQsMik7d3JpdGVyLndyaXRlQnVmZmVyKHAsMik7d3JpdGVyLndyaXRlQnVmZmVyKHEsMik7d3JpdGVyLndyaXRlQnVmZmVyKGRtcDEsMik7d3JpdGVyLndyaXRlQnVmZmVyKGRtcTEsMik7d3JpdGVyLndyaXRlQnVmZmVyKGNvZWZmLDIpO3dyaXRlci5lbmRTZXF1ZW5jZSgpO2lmKG9wdGlvbnMudHlwZT09PSJkZXIiKXtyZXR1cm4gd3JpdGVyLmJ1ZmZlcn1lbHNle3JldHVybiBQUklWQVRFX09QRU5JTkdfQk9VTkRBUlkrIlxuIit1dGlscy5saW5lYnJrKHdyaXRlci5idWZmZXIudG9TdHJpbmcoImJhc2U2NCIpLDY0KSsiXG4iK1BSSVZBVEVfQ0xPU0lOR19CT1VOREFSWX19LHByaXZhdGVJbXBvcnQ6ZnVuY3Rpb24oa2V5LGRhdGEsb3B0aW9ucyl7b3B0aW9ucz1vcHRpb25zfHx7fTt2YXIgYnVmZmVyO2lmKG9wdGlvbnMudHlwZSE9PSJkZXIiKXtpZihCdWZmZXIuaXNCdWZmZXIoZGF0YSkpe2RhdGE9ZGF0YS50b1N0cmluZygidXRmOCIpfWlmKF8uaXNTdHJpbmcoZGF0YSkpe3ZhciBwZW09dXRpbHMudHJpbVN1cnJvdW5kaW5nVGV4dChkYXRhLFBSSVZBVEVfT1BFTklOR19CT1VOREFSWSxQUklWQVRFX0NMT1NJTkdfQk9VTkRBUlkpLnJlcGxhY2UoL1xzK3xcblxyfFxufFxyJC9nbSwiIik7YnVmZmVyPUJ1ZmZlci5mcm9tKHBlbSwiYmFzZTY0Iil9ZWxzZXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQga2V5IGZvcm1hdCIpfX1lbHNlIGlmKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSl7YnVmZmVyPWRhdGF9ZWxzZXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQga2V5IGZvcm1hdCIpfXZhciByZWFkZXI9bmV3IGJlci5SZWFkZXIoYnVmZmVyKTtyZWFkZXIucmVhZFNlcXVlbmNlKCk7cmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKTtrZXkuc2V0UHJpdmF0ZShyZWFkZXIucmVhZFN0cmluZygyLHRydWUpLHJlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSkscmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKSxyZWFkZXIucmVhZFN0cmluZygyLHRydWUpLHJlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSkscmVhZGVyLnJlYWRTdHJpbmcoMix0cnVlKSxyZWFkZXIucmVhZFN0cmluZygyLHRydWUpLHJlYWRlci5yZWFkU3RyaW5nKDIsdHJ1ZSkpfSxwdWJsaWNFeHBvcnQ6ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIG49a2V5Lm4udG9CdWZmZXIoKTt2YXIgbGVuZ3RoPW4ubGVuZ3RoKzUxMjt2YXIgYm9keVdyaXRlcj1uZXcgYmVyLldyaXRlcih7c2l6ZTpsZW5ndGh9KTtib2R5V3JpdGVyLnN0YXJ0U2VxdWVuY2UoKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKG4sMik7Ym9keVdyaXRlci53cml0ZUludChrZXkuZSk7Ym9keVdyaXRlci5lbmRTZXF1ZW5jZSgpO2lmKG9wdGlvbnMudHlwZT09PSJkZXIiKXtyZXR1cm4gYm9keVdyaXRlci5idWZmZXJ9ZWxzZXtyZXR1cm4gUFVCTElDX09QRU5JTkdfQk9VTkRBUlkrIlxuIit1dGlscy5saW5lYnJrKGJvZHlXcml0ZXIuYnVmZmVyLnRvU3RyaW5nKCJiYXNlNjQiKSw2NCkrIlxuIitQVUJMSUNfQ0xPU0lOR19CT1VOREFSWX19LHB1YmxpY0ltcG9ydDpmdW5jdGlvbihrZXksZGF0YSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBidWZmZXI7aWYob3B0aW9ucy50eXBlIT09ImRlciIpe2lmKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSl7ZGF0YT1kYXRhLnRvU3RyaW5nKCJ1dGY4Iil9aWYoXy5pc1N0cmluZyhkYXRhKSl7dmFyIHBlbT11dGlscy50cmltU3Vycm91bmRpbmdUZXh0KGRhdGEsUFVCTElDX09QRU5JTkdfQk9VTkRBUlksUFVCTElDX0NMT1NJTkdfQk9VTkRBUlkpLnJlcGxhY2UoL1xzK3xcblxyfFxufFxyJC9nbSwiIik7YnVmZmVyPUJ1ZmZlci5mcm9tKHBlbSwiYmFzZTY0Iil9fWVsc2UgaWYoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKXtidWZmZXI9ZGF0YX1lbHNle3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBrZXkgZm9ybWF0Iil9dmFyIGJvZHk9bmV3IGJlci5SZWFkZXIoYnVmZmVyKTtib2R5LnJlYWRTZXF1ZW5jZSgpO2tleS5zZXRQdWJsaWMoYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSkpfSxhdXRvSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhKXtpZigvXltcU1xzXSotLS0tLUJFR0lOIFJTQSBQUklWQVRFIEtFWS0tLS0tXHMqKD89KChbQS1aYS16MC05Ky89XStccyopKykpXDEtLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLVtcU1xzXSokL2cudGVzdChkYXRhKSl7bW9kdWxlLmV4cG9ydHMucHJpdmF0ZUltcG9ydChrZXksZGF0YSk7cmV0dXJuIHRydWV9aWYoL15bXFNcc10qLS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tXHMqKD89KChbQS1aYS16MC05Ky89XStccyopKykpXDEtLS0tLUVORCBSU0EgUFVCTElDIEtFWS0tLS0tW1xTXHNdKiQvZy50ZXN0KGRhdGEpKXttb2R1bGUuZXhwb3J0cy5wdWJsaWNJbXBvcnQoa2V5LGRhdGEpO3JldHVybiB0cnVlfXJldHVybiBmYWxzZX19fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vdXRpbHMiOjU0LGFzbjE6MTcsYnVmZmVyOjI1fV0sNDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBiZXI9cmVxdWlyZSgiYXNuMSIpLkJlcjt2YXIgXz1yZXF1aXJlKCIuLi91dGlscyIpLl87dmFyIFBVQkxJQ19SU0FfT0lEPSIxLjIuODQwLjExMzU0OS4xLjEuMSI7dmFyIHV0aWxzPXJlcXVpcmUoIi4uL3V0aWxzIik7dmFyIFBSSVZBVEVfT1BFTklOR19CT1VOREFSWT0iLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tIjt2YXIgUFJJVkFURV9DTE9TSU5HX0JPVU5EQVJZPSItLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tIjt2YXIgUFVCTElDX09QRU5JTkdfQk9VTkRBUlk9Ii0tLS0tQkVHSU4gUFVCTElDIEtFWS0tLS0tIjt2YXIgUFVCTElDX0NMT1NJTkdfQk9VTkRBUlk9Ii0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLSI7bW9kdWxlLmV4cG9ydHM9e3ByaXZhdGVFeHBvcnQ6ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIG49a2V5Lm4udG9CdWZmZXIoKTt2YXIgZD1rZXkuZC50b0J1ZmZlcigpO3ZhciBwPWtleS5wLnRvQnVmZmVyKCk7dmFyIHE9a2V5LnEudG9CdWZmZXIoKTt2YXIgZG1wMT1rZXkuZG1wMS50b0J1ZmZlcigpO3ZhciBkbXExPWtleS5kbXExLnRvQnVmZmVyKCk7dmFyIGNvZWZmPWtleS5jb2VmZi50b0J1ZmZlcigpO3ZhciBsZW5ndGg9bi5sZW5ndGgrZC5sZW5ndGgrcC5sZW5ndGgrcS5sZW5ndGgrZG1wMS5sZW5ndGgrZG1xMS5sZW5ndGgrY29lZmYubGVuZ3RoKzUxMjt2YXIgYm9keVdyaXRlcj1uZXcgYmVyLldyaXRlcih7c2l6ZTpsZW5ndGh9KTtib2R5V3JpdGVyLnN0YXJ0U2VxdWVuY2UoKTtib2R5V3JpdGVyLndyaXRlSW50KDApO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIobiwyKTtib2R5V3JpdGVyLndyaXRlSW50KGtleS5lKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKGQsMik7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihwLDIpO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIocSwyKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKGRtcDEsMik7Ym9keVdyaXRlci53cml0ZUJ1ZmZlcihkbXExLDIpO2JvZHlXcml0ZXIud3JpdGVCdWZmZXIoY29lZmYsMik7Ym9keVdyaXRlci5lbmRTZXF1ZW5jZSgpO3ZhciB3cml0ZXI9bmV3IGJlci5Xcml0ZXIoe3NpemU6bGVuZ3RofSk7d3JpdGVyLnN0YXJ0U2VxdWVuY2UoKTt3cml0ZXIud3JpdGVJbnQoMCk7d3JpdGVyLnN0YXJ0U2VxdWVuY2UoKTt3cml0ZXIud3JpdGVPSUQoUFVCTElDX1JTQV9PSUQpO3dyaXRlci53cml0ZU51bGwoKTt3cml0ZXIuZW5kU2VxdWVuY2UoKTt3cml0ZXIud3JpdGVCdWZmZXIoYm9keVdyaXRlci5idWZmZXIsNCk7d3JpdGVyLmVuZFNlcXVlbmNlKCk7aWYob3B0aW9ucy50eXBlPT09ImRlciIpe3JldHVybiB3cml0ZXIuYnVmZmVyfWVsc2V7cmV0dXJuIFBSSVZBVEVfT1BFTklOR19CT1VOREFSWSsiXG4iK3V0aWxzLmxpbmVicmsod3JpdGVyLmJ1ZmZlci50b1N0cmluZygiYmFzZTY0IiksNjQpKyJcbiIrUFJJVkFURV9DTE9TSU5HX0JPVU5EQVJZfX0scHJpdmF0ZUltcG9ydDpmdW5jdGlvbihrZXksZGF0YSxvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBidWZmZXI7aWYob3B0aW9ucy50eXBlIT09ImRlciIpe2lmKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSl7ZGF0YT1kYXRhLnRvU3RyaW5nKCJ1dGY4Iil9aWYoXy5pc1N0cmluZyhkYXRhKSl7dmFyIHBlbT11dGlscy50cmltU3Vycm91bmRpbmdUZXh0KGRhdGEsUFJJVkFURV9PUEVOSU5HX0JPVU5EQVJZLFBSSVZBVEVfQ0xPU0lOR19CT1VOREFSWSkucmVwbGFjZSgiLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLSIsIiIpLnJlcGxhY2UoL1xzK3xcblxyfFxufFxyJC9nbSwiIik7YnVmZmVyPUJ1ZmZlci5mcm9tKHBlbSwiYmFzZTY0Iil9ZWxzZXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQga2V5IGZvcm1hdCIpfX1lbHNlIGlmKEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSl7YnVmZmVyPWRhdGF9ZWxzZXt0aHJvdyBFcnJvcigiVW5zdXBwb3J0ZWQga2V5IGZvcm1hdCIpfXZhciByZWFkZXI9bmV3IGJlci5SZWFkZXIoYnVmZmVyKTtyZWFkZXIucmVhZFNlcXVlbmNlKCk7cmVhZGVyLnJlYWRJbnQoMCk7dmFyIGhlYWRlcj1uZXcgYmVyLlJlYWRlcihyZWFkZXIucmVhZFN0cmluZyg0OCx0cnVlKSk7aWYoaGVhZGVyLnJlYWRPSUQoNix0cnVlKSE9PVBVQkxJQ19SU0FfT0lEKXt0aHJvdyBFcnJvcigiSW52YWxpZCBQdWJsaWMga2V5IGZvcm1hdCIpfXZhciBib2R5PW5ldyBiZXIuUmVhZGVyKHJlYWRlci5yZWFkU3RyaW5nKDQsdHJ1ZSkpO2JvZHkucmVhZFNlcXVlbmNlKCk7Ym9keS5yZWFkU3RyaW5nKDIsdHJ1ZSk7a2V5LnNldFByaXZhdGUoYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSksYm9keS5yZWFkU3RyaW5nKDIsdHJ1ZSkpfSxwdWJsaWNFeHBvcnQ6ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIG49a2V5Lm4udG9CdWZmZXIoKTt2YXIgbGVuZ3RoPW4ubGVuZ3RoKzUxMjt2YXIgYm9keVdyaXRlcj1uZXcgYmVyLldyaXRlcih7c2l6ZTpsZW5ndGh9KTtib2R5V3JpdGVyLndyaXRlQnl0ZSgwKTtib2R5V3JpdGVyLnN0YXJ0U2VxdWVuY2UoKTtib2R5V3JpdGVyLndyaXRlQnVmZmVyKG4sMik7Ym9keVdyaXRlci53cml0ZUludChrZXkuZSk7Ym9keVdyaXRlci5lbmRTZXF1ZW5jZSgpO3ZhciB3cml0ZXI9bmV3IGJlci5Xcml0ZXIoe3NpemU6bGVuZ3RofSk7d3JpdGVyLnN0YXJ0U2VxdWVuY2UoKTt3cml0ZXIuc3RhcnRTZXF1ZW5jZSgpO3dyaXRlci53cml0ZU9JRChQVUJMSUNfUlNBX09JRCk7d3JpdGVyLndyaXRlTnVsbCgpO3dyaXRlci5lbmRTZXF1ZW5jZSgpO3dyaXRlci53cml0ZUJ1ZmZlcihib2R5V3JpdGVyLmJ1ZmZlciwzKTt3cml0ZXIuZW5kU2VxdWVuY2UoKTtpZihvcHRpb25zLnR5cGU9PT0iZGVyIil7cmV0dXJuIHdyaXRlci5idWZmZXJ9ZWxzZXtyZXR1cm4gUFVCTElDX09QRU5JTkdfQk9VTkRBUlkrIlxuIit1dGlscy5saW5lYnJrKHdyaXRlci5idWZmZXIudG9TdHJpbmcoImJhc2U2NCIpLDY0KSsiXG4iK1BVQkxJQ19DTE9TSU5HX0JPVU5EQVJZfX0scHVibGljSW1wb3J0OmZ1bmN0aW9uKGtleSxkYXRhLG9wdGlvbnMpe29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGJ1ZmZlcjtpZihvcHRpb25zLnR5cGUhPT0iZGVyIil7aWYoQnVmZmVyLmlzQnVmZmVyKGRhdGEpKXtkYXRhPWRhdGEudG9TdHJpbmcoInV0ZjgiKX1pZihfLmlzU3RyaW5nKGRhdGEpKXt2YXIgcGVtPXV0aWxzLnRyaW1TdXJyb3VuZGluZ1RleHQoZGF0YSxQVUJMSUNfT1BFTklOR19CT1VOREFSWSxQVUJMSUNfQ0xPU0lOR19CT1VOREFSWSkucmVwbGFjZSgvXHMrfFxuXHJ8XG58XHIkL2dtLCIiKTtidWZmZXI9QnVmZmVyLmZyb20ocGVtLCJiYXNlNjQiKX19ZWxzZSBpZihCdWZmZXIuaXNCdWZmZXIoZGF0YSkpe2J1ZmZlcj1kYXRhfWVsc2V7dGhyb3cgRXJyb3IoIlVuc3VwcG9ydGVkIGtleSBmb3JtYXQiKX12YXIgcmVhZGVyPW5ldyBiZXIuUmVhZGVyKGJ1ZmZlcik7cmVhZGVyLnJlYWRTZXF1ZW5jZSgpO3ZhciBoZWFkZXI9bmV3IGJlci5SZWFkZXIocmVhZGVyLnJlYWRTdHJpbmcoNDgsdHJ1ZSkpO2lmKGhlYWRlci5yZWFkT0lEKDYsdHJ1ZSkhPT1QVUJMSUNfUlNBX09JRCl7dGhyb3cgRXJyb3IoIkludmFsaWQgUHVibGljIGtleSBmb3JtYXQiKX12YXIgYm9keT1uZXcgYmVyLlJlYWRlcihyZWFkZXIucmVhZFN0cmluZygzLHRydWUpKTtib2R5LnJlYWRCeXRlKCk7Ym9keS5yZWFkU2VxdWVuY2UoKTtrZXkuc2V0UHVibGljKGJvZHkucmVhZFN0cmluZygyLHRydWUpLGJvZHkucmVhZFN0cmluZygyLHRydWUpKX0sYXV0b0ltcG9ydDpmdW5jdGlvbihrZXksZGF0YSl7aWYoL15bXFNcc10qLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXHMqKD89KChbQS1aYS16MC05Ky89XStccyopKykpXDEtLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tW1xTXHNdKiQvZy50ZXN0KGRhdGEpKXttb2R1bGUuZXhwb3J0cy5wcml2YXRlSW1wb3J0KGtleSxkYXRhKTtyZXR1cm4gdHJ1ZX1pZigvXltcU1xzXSotLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxzKig/PSgoW0EtWmEtejAtOSsvPV0rXHMqKSspKVwxLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tW1xTXHNdKiQvZy50ZXN0KGRhdGEpKXttb2R1bGUuZXhwb3J0cy5wdWJsaWNJbXBvcnQoa2V5LGRhdGEpO3JldHVybiB0cnVlfXJldHVybiBmYWxzZX19fSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vdXRpbHMiOjU0LGFzbjE6MTcsYnVmZmVyOjI1fV0sNDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihCdWZmZXIpe3ZhciBjcnlwdD1yZXF1aXJlKCIuLi9jcnlwdG8iKTt2YXIgXz1yZXF1aXJlKCIuLi91dGlscyIpLl87dmFyIHBldGVyT2xzb25fQmlnSW50ZWdlclN0YXRpYz1yZXF1aXJlKCJiaWctaW50ZWdlciIpO3ZhciBkYml0czt2YXIgY2FuYXJ5PTB4ZGVhZGJlZWZjYWZlO3ZhciBqX2xtPShjYW5hcnkmMTY3NzcyMTUpPT0xNTcxNTA3MDtmdW5jdGlvbiBCaWdJbnRlZ2VyKGEsYil7aWYoYSE9bnVsbCl7aWYoIm51bWJlciI9PXR5cGVvZiBhKXt0aGlzLmZyb21OdW1iZXIoYSxiKX1lbHNlIGlmKEJ1ZmZlci5pc0J1ZmZlcihhKSl7dGhpcy5mcm9tQnVmZmVyKGEpfWVsc2UgaWYoYj09bnVsbCYmInN0cmluZyIhPXR5cGVvZiBhKXt0aGlzLmZyb21CeXRlQXJyYXkoYSl9ZWxzZXt0aGlzLmZyb21TdHJpbmcoYSxiKX19fWZ1bmN0aW9uIG5iaSgpe3JldHVybiBuZXcgQmlnSW50ZWdlcihudWxsKX1mdW5jdGlvbiBhbTEoaSx4LHcsaixjLG4pe3doaWxlKC0tbj49MCl7dmFyIHY9eCp0aGlzW2krK10rd1tqXStjO2M9TWF0aC5mbG9vcih2LzY3MTA4ODY0KTt3W2orK109diY2NzEwODg2M31yZXR1cm4gY31mdW5jdGlvbiBhbTIoaSx4LHcsaixjLG4pe3ZhciB4bD14JjMyNzY3LHhoPXg+PjE1O3doaWxlKC0tbj49MCl7dmFyIGw9dGhpc1tpXSYzMjc2Nzt2YXIgaD10aGlzW2krK10+PjE1O3ZhciBtPXhoKmwraCp4bDtsPXhsKmwrKChtJjMyNzY3KTw8MTUpK3dbal0rKGMmMTA3Mzc0MTgyMyk7Yz0obD4+PjMwKSsobT4+PjE1KSt4aCpoKyhjPj4+MzApO3dbaisrXT1sJjEwNzM3NDE4MjN9cmV0dXJuIGN9ZnVuY3Rpb24gYW0zKGkseCx3LGosYyxuKXt2YXIgeGw9eCYxNjM4Myx4aD14Pj4xNDt3aGlsZSgtLW4+PTApe3ZhciBsPXRoaXNbaV0mMTYzODM7dmFyIGg9dGhpc1tpKytdPj4xNDt2YXIgbT14aCpsK2gqeGw7bD14bCpsKygobSYxNjM4Myk8PDE0KSt3W2pdK2M7Yz0obD4+MjgpKyhtPj4xNCkreGgqaDt3W2orK109bCYyNjg0MzU0NTV9cmV0dXJuIGN9QmlnSW50ZWdlci5wcm90b3R5cGUuYW09YW0zO2RiaXRzPTI4O0JpZ0ludGVnZXIucHJvdG90eXBlLkRCPWRiaXRzO0JpZ0ludGVnZXIucHJvdG90eXBlLkRNPSgxPDxkYml0cyktMTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5EVj0xPDxkYml0czt2YXIgQklfRlA9NTI7QmlnSW50ZWdlci5wcm90b3R5cGUuRlY9TWF0aC5wb3coMixCSV9GUCk7QmlnSW50ZWdlci5wcm90b3R5cGUuRjE9QklfRlAtZGJpdHM7QmlnSW50ZWdlci5wcm90b3R5cGUuRjI9MipkYml0cy1CSV9GUDt2YXIgQklfUk09IjAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eiI7dmFyIEJJX1JDPW5ldyBBcnJheTt2YXIgcnIsdnY7cnI9IjAiLmNoYXJDb2RlQXQoMCk7Zm9yKHZ2PTA7dnY8PTk7Kyt2dilCSV9SQ1tycisrXT12djtycj0iYSIuY2hhckNvZGVBdCgwKTtmb3IodnY9MTA7dnY8MzY7Kyt2dilCSV9SQ1tycisrXT12djtycj0iQSIuY2hhckNvZGVBdCgwKTtmb3IodnY9MTA7dnY8MzY7Kyt2dilCSV9SQ1tycisrXT12djtmdW5jdGlvbiBpbnQyY2hhcihuKXtyZXR1cm4gQklfUk0uY2hhckF0KG4pfWZ1bmN0aW9uIGludEF0KHMsaSl7dmFyIGM9QklfUkNbcy5jaGFyQ29kZUF0KGkpXTtyZXR1cm4gYz09bnVsbD8tMTpjfWZ1bmN0aW9uIGJucENvcHlUbyhyKXtmb3IodmFyIGk9dGhpcy50LTE7aT49MDstLWkpcltpXT10aGlzW2ldO3IudD10aGlzLnQ7ci5zPXRoaXMuc31mdW5jdGlvbiBibnBGcm9tSW50KHgpe3RoaXMudD0xO3RoaXMucz14PDA/LTE6MDtpZih4PjApdGhpc1swXT14O2Vsc2UgaWYoeDwtMSl0aGlzWzBdPXgrRFY7ZWxzZSB0aGlzLnQ9MH1mdW5jdGlvbiBuYnYoaSl7dmFyIHI9bmJpKCk7ci5mcm9tSW50KGkpO3JldHVybiByfWZ1bmN0aW9uIGJucEZyb21TdHJpbmcoZGF0YSxyYWRpeCx1bnNpZ25lZCl7dmFyIGs7c3dpdGNoKHJhZGl4KXtjYXNlIDI6az0xO2JyZWFrO2Nhc2UgNDprPTI7YnJlYWs7Y2FzZSA4Oms9MzticmVhaztjYXNlIDE2Oms9NDticmVhaztjYXNlIDMyOms9NTticmVhaztjYXNlIDI1NjprPTg7YnJlYWs7ZGVmYXVsdDp0aGlzLmZyb21SYWRpeChkYXRhLHJhZGl4KTtyZXR1cm59dGhpcy50PTA7dGhpcy5zPTA7dmFyIGk9ZGF0YS5sZW5ndGg7dmFyIG1pPWZhbHNlO3ZhciBzaD0wO3doaWxlKC0taT49MCl7dmFyIHg9az09OD9kYXRhW2ldJjI1NTppbnRBdChkYXRhLGkpO2lmKHg8MCl7aWYoZGF0YS5jaGFyQXQoaSk9PSItIiltaT10cnVlO2NvbnRpbnVlfW1pPWZhbHNlO2lmKHNoPT09MCl0aGlzW3RoaXMudCsrXT14O2Vsc2UgaWYoc2graz50aGlzLkRCKXt0aGlzW3RoaXMudC0xXXw9KHgmKDE8PHRoaXMuREItc2gpLTEpPDxzaDt0aGlzW3RoaXMudCsrXT14Pj50aGlzLkRCLXNofWVsc2UgdGhpc1t0aGlzLnQtMV18PXg8PHNoO3NoKz1rO2lmKHNoPj10aGlzLkRCKXNoLT10aGlzLkRCfWlmKCF1bnNpZ25lZCYmaz09OCYmKGRhdGFbMF0mMTI4KSE9MCl7dGhpcy5zPS0xO2lmKHNoPjApdGhpc1t0aGlzLnQtMV18PSgxPDx0aGlzLkRCLXNoKS0xPDxzaH10aGlzLmNsYW1wKCk7aWYobWkpQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsdGhpcyl9ZnVuY3Rpb24gYm5wRnJvbUJ5dGVBcnJheShhLHVuc2lnbmVkKXt0aGlzLmZyb21TdHJpbmcoYSwyNTYsdW5zaWduZWQpfWZ1bmN0aW9uIGJucEZyb21CdWZmZXIoYSl7dGhpcy5mcm9tU3RyaW5nKGEsMjU2LHRydWUpfWZ1bmN0aW9uIGJucENsYW1wKCl7dmFyIGM9dGhpcy5zJnRoaXMuRE07d2hpbGUodGhpcy50PjAmJnRoaXNbdGhpcy50LTFdPT1jKS0tdGhpcy50fWZ1bmN0aW9uIGJuVG9TdHJpbmcoYil7aWYodGhpcy5zPDApcmV0dXJuIi0iK3RoaXMubmVnYXRlKCkudG9TdHJpbmcoYik7dmFyIGs7aWYoYj09MTYpaz00O2Vsc2UgaWYoYj09OClrPTM7ZWxzZSBpZihiPT0yKWs9MTtlbHNlIGlmKGI9PTMyKWs9NTtlbHNlIGlmKGI9PTQpaz0yO2Vsc2UgcmV0dXJuIHRoaXMudG9SYWRpeChiKTt2YXIga209KDE8PGspLTEsZCxtPWZhbHNlLHI9IiIsaT10aGlzLnQ7dmFyIHA9dGhpcy5EQi1pKnRoaXMuREIlaztpZihpLS0gPjApe2lmKHA8dGhpcy5EQiYmKGQ9dGhpc1tpXT4+cCk+MCl7bT10cnVlO3I9aW50MmNoYXIoZCl9d2hpbGUoaT49MCl7aWYocDxrKXtkPSh0aGlzW2ldJigxPDxwKS0xKTw8ay1wO2R8PXRoaXNbLS1pXT4+KHArPXRoaXMuREItayl9ZWxzZXtkPXRoaXNbaV0+PihwLT1rKSZrbTtpZihwPD0wKXtwKz10aGlzLkRCOy0taX19aWYoZD4wKW09dHJ1ZTtpZihtKXIrPWludDJjaGFyKGQpfX1yZXR1cm4gbT9yOiIwIn1mdW5jdGlvbiBibk5lZ2F0ZSgpe3ZhciByPW5iaSgpO0JpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLHIpO3JldHVybiByfWZ1bmN0aW9uIGJuQWJzKCl7cmV0dXJuIHRoaXMuczwwP3RoaXMubmVnYXRlKCk6dGhpc31mdW5jdGlvbiBibkNvbXBhcmVUbyhhKXt2YXIgcj10aGlzLnMtYS5zO2lmKHIhPTApcmV0dXJuIHI7dmFyIGk9dGhpcy50O3I9aS1hLnQ7aWYociE9MClyZXR1cm4gdGhpcy5zPDA/LXI6cjt3aGlsZSgtLWk+PTApaWYoKHI9dGhpc1tpXS1hW2ldKSE9MClyZXR1cm4gcjtyZXR1cm4gMH1mdW5jdGlvbiBuYml0cyh4KXt2YXIgcj0xLHQ7aWYoKHQ9eD4+PjE2KSE9MCl7eD10O3IrPTE2fWlmKCh0PXg+PjgpIT0wKXt4PXQ7cis9OH1pZigodD14Pj40KSE9MCl7eD10O3IrPTR9aWYoKHQ9eD4+MikhPTApe3g9dDtyKz0yfWlmKCh0PXg+PjEpIT0wKXt4PXQ7cis9MX1yZXR1cm4gcn1mdW5jdGlvbiBibkJpdExlbmd0aCgpe2lmKHRoaXMudDw9MClyZXR1cm4gMDtyZXR1cm4gdGhpcy5EQioodGhpcy50LTEpK25iaXRzKHRoaXNbdGhpcy50LTFdXnRoaXMucyZ0aGlzLkRNKX1mdW5jdGlvbiBibnBETFNoaWZ0VG8obixyKXt2YXIgaTtmb3IoaT10aGlzLnQtMTtpPj0wOy0taSlyW2krbl09dGhpc1tpXTtmb3IoaT1uLTE7aT49MDstLWkpcltpXT0wO3IudD10aGlzLnQrbjtyLnM9dGhpcy5zfWZ1bmN0aW9uIGJucERSU2hpZnRUbyhuLHIpe2Zvcih2YXIgaT1uO2k8dGhpcy50OysraSlyW2ktbl09dGhpc1tpXTtyLnQ9TWF0aC5tYXgodGhpcy50LW4sMCk7ci5zPXRoaXMuc31mdW5jdGlvbiBibnBMU2hpZnRUbyhuLHIpe3ZhciBicz1uJXRoaXMuREI7dmFyIGNicz10aGlzLkRCLWJzO3ZhciBibT0oMTw8Y2JzKS0xO3ZhciBkcz1NYXRoLmZsb29yKG4vdGhpcy5EQiksYz10aGlzLnM8PGJzJnRoaXMuRE0saTtmb3IoaT10aGlzLnQtMTtpPj0wOy0taSl7cltpK2RzKzFdPXRoaXNbaV0+PmNic3xjO2M9KHRoaXNbaV0mYm0pPDxic31mb3IoaT1kcy0xO2k+PTA7LS1pKXJbaV09MDtyW2RzXT1jO3IudD10aGlzLnQrZHMrMTtyLnM9dGhpcy5zO3IuY2xhbXAoKX1mdW5jdGlvbiBibnBSU2hpZnRUbyhuLHIpe3Iucz10aGlzLnM7dmFyIGRzPU1hdGguZmxvb3Iobi90aGlzLkRCKTtpZihkcz49dGhpcy50KXtyLnQ9MDtyZXR1cm59dmFyIGJzPW4ldGhpcy5EQjt2YXIgY2JzPXRoaXMuREItYnM7dmFyIGJtPSgxPDxicyktMTtyWzBdPXRoaXNbZHNdPj5icztmb3IodmFyIGk9ZHMrMTtpPHRoaXMudDsrK2kpe3JbaS1kcy0xXXw9KHRoaXNbaV0mYm0pPDxjYnM7cltpLWRzXT10aGlzW2ldPj5ic31pZihicz4wKXJbdGhpcy50LWRzLTFdfD0odGhpcy5zJmJtKTw8Y2JzO3IudD10aGlzLnQtZHM7ci5jbGFtcCgpfWZ1bmN0aW9uIGJucFN1YlRvKGEscil7dmFyIGk9MCxjPTAsbT1NYXRoLm1pbihhLnQsdGhpcy50KTt3aGlsZShpPG0pe2MrPXRoaXNbaV0tYVtpXTtyW2krK109YyZ0aGlzLkRNO2M+Pj10aGlzLkRCfWlmKGEudDx0aGlzLnQpe2MtPWEuczt3aGlsZShpPHRoaXMudCl7Yys9dGhpc1tpXTtyW2krK109YyZ0aGlzLkRNO2M+Pj10aGlzLkRCfWMrPXRoaXMuc31lbHNle2MrPXRoaXMuczt3aGlsZShpPGEudCl7Yy09YVtpXTtyW2krK109YyZ0aGlzLkRNO2M+Pj10aGlzLkRCfWMtPWEuc31yLnM9YzwwPy0xOjA7aWYoYzwtMSlyW2krK109dGhpcy5EVitjO2Vsc2UgaWYoYz4wKXJbaSsrXT1jO3IudD1pO3IuY2xhbXAoKX1mdW5jdGlvbiBibnBNdWx0aXBseVRvKGEscil7dmFyIHg9dGhpcy5hYnMoKSx5PWEuYWJzKCk7dmFyIGk9eC50O3IudD1pK3kudDt3aGlsZSgtLWk+PTApcltpXT0wO2ZvcihpPTA7aTx5LnQ7KytpKXJbaSt4LnRdPXguYW0oMCx5W2ldLHIsaSwwLHgudCk7ci5zPTA7ci5jbGFtcCgpO2lmKHRoaXMucyE9YS5zKUJpZ0ludGVnZXIuWkVSTy5zdWJUbyhyLHIpfWZ1bmN0aW9uIGJucFNxdWFyZVRvKHIpe3ZhciB4PXRoaXMuYWJzKCk7dmFyIGk9ci50PTIqeC50O3doaWxlKC0taT49MClyW2ldPTA7Zm9yKGk9MDtpPHgudC0xOysraSl7dmFyIGM9eC5hbShpLHhbaV0sciwyKmksMCwxKTtpZigocltpK3gudF0rPXguYW0oaSsxLDIqeFtpXSxyLDIqaSsxLGMseC50LWktMSkpPj14LkRWKXtyW2kreC50XS09eC5EVjtyW2kreC50KzFdPTF9fWlmKHIudD4wKXJbci50LTFdKz14LmFtKGkseFtpXSxyLDIqaSwwLDEpO3Iucz0wO3IuY2xhbXAoKX1mdW5jdGlvbiBibnBEaXZSZW1UbyhtLHEscil7dmFyIHBtPW0uYWJzKCk7aWYocG0udDw9MClyZXR1cm47dmFyIHB0PXRoaXMuYWJzKCk7aWYocHQudDxwbS50KXtpZihxIT1udWxsKXEuZnJvbUludCgwKTtpZihyIT1udWxsKXRoaXMuY29weVRvKHIpO3JldHVybn1pZihyPT1udWxsKXI9bmJpKCk7dmFyIHk9bmJpKCksdHM9dGhpcy5zLG1zPW0uczt2YXIgbnNoPXRoaXMuREItbmJpdHMocG1bcG0udC0xXSk7aWYobnNoPjApe3BtLmxTaGlmdFRvKG5zaCx5KTtwdC5sU2hpZnRUbyhuc2gscil9ZWxzZXtwbS5jb3B5VG8oeSk7cHQuY29weVRvKHIpfXZhciB5cz15LnQ7dmFyIHkwPXlbeXMtMV07aWYoeTA9PT0wKXJldHVybjt2YXIgeXQ9eTAqKDE8PHRoaXMuRjEpKyh5cz4xP3lbeXMtMl0+PnRoaXMuRjI6MCk7dmFyIGQxPXRoaXMuRlYveXQsZDI9KDE8PHRoaXMuRjEpL3l0LGU9MTw8dGhpcy5GMjt2YXIgaT1yLnQsaj1pLXlzLHQ9cT09bnVsbD9uYmkoKTpxO3kuZGxTaGlmdFRvKGosdCk7aWYoci5jb21wYXJlVG8odCk+PTApe3Jbci50KytdPTE7ci5zdWJUbyh0LHIpfUJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbyh5cyx0KTt0LnN1YlRvKHkseSk7d2hpbGUoeS50PHlzKXlbeS50KytdPTA7d2hpbGUoLS1qPj0wKXt2YXIgcWQ9clstLWldPT15MD90aGlzLkRNOk1hdGguZmxvb3IocltpXSpkMSsocltpLTFdK2UpKmQyKTtpZigocltpXSs9eS5hbSgwLHFkLHIsaiwwLHlzKSk8cWQpe3kuZGxTaGlmdFRvKGosdCk7ci5zdWJUbyh0LHIpO3doaWxlKHJbaV08LS1xZClyLnN1YlRvKHQscil9fWlmKHEhPW51bGwpe3IuZHJTaGlmdFRvKHlzLHEpO2lmKHRzIT1tcylCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ocSxxKX1yLnQ9eXM7ci5jbGFtcCgpO2lmKG5zaD4wKXIuclNoaWZ0VG8obnNoLHIpO2lmKHRzPDApQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIscil9ZnVuY3Rpb24gYm5Nb2QoYSl7dmFyIHI9bmJpKCk7dGhpcy5hYnMoKS5kaXZSZW1UbyhhLG51bGwscik7aWYodGhpcy5zPDAmJnIuY29tcGFyZVRvKEJpZ0ludGVnZXIuWkVSTyk+MClhLnN1YlRvKHIscik7cmV0dXJuIHJ9ZnVuY3Rpb24gQ2xhc3NpYyhtKXt0aGlzLm09bX1mdW5jdGlvbiBjQ29udmVydCh4KXtpZih4LnM8MHx8eC5jb21wYXJlVG8odGhpcy5tKT49MClyZXR1cm4geC5tb2QodGhpcy5tKTtlbHNlIHJldHVybiB4fWZ1bmN0aW9uIGNSZXZlcnQoeCl7cmV0dXJuIHh9ZnVuY3Rpb24gY1JlZHVjZSh4KXt4LmRpdlJlbVRvKHRoaXMubSxudWxsLHgpfWZ1bmN0aW9uIGNNdWxUbyh4LHkscil7eC5tdWx0aXBseVRvKHkscik7dGhpcy5yZWR1Y2Uocil9ZnVuY3Rpb24gY1NxclRvKHgscil7eC5zcXVhcmVUbyhyKTt0aGlzLnJlZHVjZShyKX1DbGFzc2ljLnByb3RvdHlwZS5jb252ZXJ0PWNDb252ZXJ0O0NsYXNzaWMucHJvdG90eXBlLnJldmVydD1jUmV2ZXJ0O0NsYXNzaWMucHJvdG90eXBlLnJlZHVjZT1jUmVkdWNlO0NsYXNzaWMucHJvdG90eXBlLm11bFRvPWNNdWxUbztDbGFzc2ljLnByb3RvdHlwZS5zcXJUbz1jU3FyVG87ZnVuY3Rpb24gYm5wSW52RGlnaXQoKXtpZih0aGlzLnQ8MSlyZXR1cm4gMDt2YXIgeD10aGlzWzBdO2lmKCh4JjEpPT09MClyZXR1cm4gMDt2YXIgeT14JjM7eT15KigyLSh4JjE1KSp5KSYxNTt5PXkqKDItKHgmMjU1KSp5KSYyNTU7eT15KigyLSgoeCY2NTUzNSkqeSY2NTUzNSkpJjY1NTM1O3k9eSooMi14KnkldGhpcy5EVikldGhpcy5EVjtyZXR1cm4geT4wP3RoaXMuRFYteToteX1mdW5jdGlvbiBNb250Z29tZXJ5KG0pe3RoaXMubT1tO3RoaXMubXA9bS5pbnZEaWdpdCgpO3RoaXMubXBsPXRoaXMubXAmMzI3Njc7dGhpcy5tcGg9dGhpcy5tcD4+MTU7dGhpcy51bT0oMTw8bS5EQi0xNSktMTt0aGlzLm10Mj0yKm0udH1mdW5jdGlvbiBtb250Q29udmVydCh4KXt2YXIgcj1uYmkoKTt4LmFicygpLmRsU2hpZnRUbyh0aGlzLm0udCxyKTtyLmRpdlJlbVRvKHRoaXMubSxudWxsLHIpO2lmKHguczwwJiZyLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLlpFUk8pPjApdGhpcy5tLnN1YlRvKHIscik7cmV0dXJuIHJ9ZnVuY3Rpb24gbW9udFJldmVydCh4KXt2YXIgcj1uYmkoKTt4LmNvcHlUbyhyKTt0aGlzLnJlZHVjZShyKTtyZXR1cm4gcn1mdW5jdGlvbiBtb250UmVkdWNlKHgpe3doaWxlKHgudDw9dGhpcy5tdDIpeFt4LnQrK109MDtmb3IodmFyIGk9MDtpPHRoaXMubS50OysraSl7dmFyIGo9eFtpXSYzMjc2Nzt2YXIgdTA9aip0aGlzLm1wbCsoKGoqdGhpcy5tcGgrKHhbaV0+PjE1KSp0aGlzLm1wbCZ0aGlzLnVtKTw8MTUpJnguRE07aj1pK3RoaXMubS50O3hbal0rPXRoaXMubS5hbSgwLHUwLHgsaSwwLHRoaXMubS50KTt3aGlsZSh4W2pdPj14LkRWKXt4W2pdLT14LkRWO3hbKytqXSsrfX14LmNsYW1wKCk7eC5kclNoaWZ0VG8odGhpcy5tLnQseCk7aWYoeC5jb21wYXJlVG8odGhpcy5tKT49MCl4LnN1YlRvKHRoaXMubSx4KX1mdW5jdGlvbiBtb250U3FyVG8oeCxyKXt4LnNxdWFyZVRvKHIpO3RoaXMucmVkdWNlKHIpfWZ1bmN0aW9uIG1vbnRNdWxUbyh4LHkscil7eC5tdWx0aXBseVRvKHkscik7dGhpcy5yZWR1Y2Uocil9TW9udGdvbWVyeS5wcm90b3R5cGUuY29udmVydD1tb250Q29udmVydDtNb250Z29tZXJ5LnByb3RvdHlwZS5yZXZlcnQ9bW9udFJldmVydDtNb250Z29tZXJ5LnByb3RvdHlwZS5yZWR1Y2U9bW9udFJlZHVjZTtNb250Z29tZXJ5LnByb3RvdHlwZS5tdWxUbz1tb250TXVsVG87TW9udGdvbWVyeS5wcm90b3R5cGUuc3FyVG89bW9udFNxclRvO2Z1bmN0aW9uIGJucElzRXZlbigpe3JldHVybih0aGlzLnQ+MD90aGlzWzBdJjE6dGhpcy5zKT09PTB9ZnVuY3Rpb24gYm5wRXhwKGUseil7aWYoZT40Mjk0OTY3Mjk1fHxlPDEpcmV0dXJuIEJpZ0ludGVnZXIuT05FO3ZhciByPW5iaSgpLHIyPW5iaSgpLGc9ei5jb252ZXJ0KHRoaXMpLGk9bmJpdHMoZSktMTtnLmNvcHlUbyhyKTt3aGlsZSgtLWk+PTApe3ouc3FyVG8ocixyMik7aWYoKGUmMTw8aSk+MCl6Lm11bFRvKHIyLGcscik7ZWxzZXt2YXIgdD1yO3I9cjI7cjI9dH19cmV0dXJuIHoucmV2ZXJ0KHIpfWZ1bmN0aW9uIGJuTW9kUG93SW50KGUsbSl7dmFyIHo7aWYoZTwyNTZ8fG0uaXNFdmVuKCkpej1uZXcgQ2xhc3NpYyhtKTtlbHNlIHo9bmV3IE1vbnRnb21lcnkobSk7cmV0dXJuIHRoaXMuZXhwKGUseil9ZnVuY3Rpb24gYm5DbG9uZSgpe3ZhciByPW5iaSgpO3RoaXMuY29weVRvKHIpO3JldHVybiByfWZ1bmN0aW9uIGJuSW50VmFsdWUoKXtpZih0aGlzLnM8MCl7aWYodGhpcy50PT0xKXJldHVybiB0aGlzWzBdLXRoaXMuRFY7ZWxzZSBpZih0aGlzLnQ9PT0wKXJldHVybi0xfWVsc2UgaWYodGhpcy50PT0xKXJldHVybiB0aGlzWzBdO2Vsc2UgaWYodGhpcy50PT09MClyZXR1cm4gMDtyZXR1cm4odGhpc1sxXSYoMTw8MzItdGhpcy5EQiktMSk8PHRoaXMuREJ8dGhpc1swXX1mdW5jdGlvbiBibkJ5dGVWYWx1ZSgpe3JldHVybiB0aGlzLnQ9PTA/dGhpcy5zOnRoaXNbMF08PDI0Pj4yNH1mdW5jdGlvbiBiblNob3J0VmFsdWUoKXtyZXR1cm4gdGhpcy50PT0wP3RoaXMuczp0aGlzWzBdPDwxNj4+MTZ9ZnVuY3Rpb24gYm5wQ2h1bmtTaXplKHIpe3JldHVybiBNYXRoLmZsb29yKE1hdGguTE4yKnRoaXMuREIvTWF0aC5sb2cocikpfWZ1bmN0aW9uIGJuU2lnTnVtKCl7aWYodGhpcy5zPDApcmV0dXJuLTE7ZWxzZSBpZih0aGlzLnQ8PTB8fHRoaXMudD09MSYmdGhpc1swXTw9MClyZXR1cm4gMDtlbHNlIHJldHVybiAxfWZ1bmN0aW9uIGJucFRvUmFkaXgoYil7aWYoYj09bnVsbCliPTEwO2lmKHRoaXMuc2lnbnVtKCk9PT0wfHxiPDJ8fGI+MzYpcmV0dXJuIjAiO3ZhciBjcz10aGlzLmNodW5rU2l6ZShiKTt2YXIgYT1NYXRoLnBvdyhiLGNzKTt2YXIgZD1uYnYoYSkseT1uYmkoKSx6PW5iaSgpLHI9IiI7dGhpcy5kaXZSZW1UbyhkLHkseik7d2hpbGUoeS5zaWdudW0oKT4wKXtyPShhK3ouaW50VmFsdWUoKSkudG9TdHJpbmcoYikuc3Vic3RyKDEpK3I7eS5kaXZSZW1UbyhkLHkseil9cmV0dXJuIHouaW50VmFsdWUoKS50b1N0cmluZyhiKStyfWZ1bmN0aW9uIGJucEZyb21SYWRpeChzLGIpe3RoaXMuZnJvbUludCgwKTtpZihiPT1udWxsKWI9MTA7dmFyIGNzPXRoaXMuY2h1bmtTaXplKGIpO3ZhciBkPU1hdGgucG93KGIsY3MpLG1pPWZhbHNlLGo9MCx3PTA7Zm9yKHZhciBpPTA7aTxzLmxlbmd0aDsrK2kpe3ZhciB4PWludEF0KHMsaSk7aWYoeDwwKXtpZihzLmNoYXJBdChpKT09Ii0iJiZ0aGlzLnNpZ251bSgpPT09MCltaT10cnVlO2NvbnRpbnVlfXc9Yip3K3g7aWYoKytqPj1jcyl7dGhpcy5kTXVsdGlwbHkoZCk7dGhpcy5kQWRkT2Zmc2V0KHcsMCk7aj0wO3c9MH19aWYoaj4wKXt0aGlzLmRNdWx0aXBseShNYXRoLnBvdyhiLGopKTt0aGlzLmRBZGRPZmZzZXQodywwKX1pZihtaSlCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcyx0aGlzKX1mdW5jdGlvbiBibnBGcm9tTnVtYmVyKGEsYil7aWYoIm51bWJlciI9PXR5cGVvZiBiKXtpZihhPDIpdGhpcy5mcm9tSW50KDEpO2Vsc2V7dGhpcy5mcm9tTnVtYmVyKGEpO2lmKCF0aGlzLnRlc3RCaXQoYS0xKSl0aGlzLmJpdHdpc2VUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYS0xKSxvcF9vcix0aGlzKTtpZih0aGlzLmlzRXZlbigpKXRoaXMuZEFkZE9mZnNldCgxLDApO3doaWxlKCF0aGlzLmlzUHJvYmFibGVQcmltZShiKSl7dGhpcy5kQWRkT2Zmc2V0KDIsMCk7aWYodGhpcy5iaXRMZW5ndGgoKT5hKXRoaXMuc3ViVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEtMSksdGhpcyl9fX1lbHNle3ZhciB4PWNyeXB0LnJhbmRvbUJ5dGVzKChhPj4zKSsxKTt2YXIgdD1hJjc7aWYodD4wKXhbMF0mPSgxPDx0KS0xO2Vsc2UgeFswXT0wO3RoaXMuZnJvbUJ5dGVBcnJheSh4KX19ZnVuY3Rpb24gYm5Ub0J5dGVBcnJheSgpe3ZhciBpPXRoaXMudCxyPW5ldyBBcnJheTtyWzBdPXRoaXMuczt2YXIgcD10aGlzLkRCLWkqdGhpcy5EQiU4LGQsaz0wO2lmKGktLSA+MCl7aWYocDx0aGlzLkRCJiYoZD10aGlzW2ldPj5wKSE9KHRoaXMucyZ0aGlzLkRNKT4+cClyW2srK109ZHx0aGlzLnM8PHRoaXMuREItcDt3aGlsZShpPj0wKXtpZihwPDgpe2Q9KHRoaXNbaV0mKDE8PHApLTEpPDw4LXA7ZHw9dGhpc1stLWldPj4ocCs9dGhpcy5EQi04KX1lbHNle2Q9dGhpc1tpXT4+KHAtPTgpJjI1NTtpZihwPD0wKXtwKz10aGlzLkRCOy0taX19aWYoKGQmMTI4KSE9MClkfD0tMjU2O2lmKGs9PT0wJiYodGhpcy5zJjEyOCkhPShkJjEyOCkpKytrO2lmKGs+MHx8ZCE9dGhpcy5zKXJbaysrXT1kfX1yZXR1cm4gcn1mdW5jdGlvbiBiblRvQnVmZmVyKHRyaW1PclNpemUpe3ZhciByZXM9QnVmZmVyLmZyb20odGhpcy50b0J5dGVBcnJheSgpKTtpZih0cmltT3JTaXplPT09dHJ1ZSYmcmVzWzBdPT09MCl7cmVzPXJlcy5zbGljZSgxKX1lbHNlIGlmKF8uaXNOdW1iZXIodHJpbU9yU2l6ZSkpe2lmKHJlcy5sZW5ndGg+dHJpbU9yU2l6ZSl7Zm9yKHZhciBpPTA7aTxyZXMubGVuZ3RoLXRyaW1PclNpemU7aSsrKXtpZihyZXNbaV0hPT0wKXtyZXR1cm4gbnVsbH19cmV0dXJuIHJlcy5zbGljZShyZXMubGVuZ3RoLXRyaW1PclNpemUpfWVsc2UgaWYocmVzLmxlbmd0aDx0cmltT3JTaXplKXt2YXIgcGFkZGVkPUJ1ZmZlci5hbGxvYyh0cmltT3JTaXplKTtwYWRkZWQuZmlsbCgwLDAsdHJpbU9yU2l6ZS1yZXMubGVuZ3RoKTtyZXMuY29weShwYWRkZWQsdHJpbU9yU2l6ZS1yZXMubGVuZ3RoKTtyZXR1cm4gcGFkZGVkfX1yZXR1cm4gcmVzfWZ1bmN0aW9uIGJuRXF1YWxzKGEpe3JldHVybiB0aGlzLmNvbXBhcmVUbyhhKT09MH1mdW5jdGlvbiBibk1pbihhKXtyZXR1cm4gdGhpcy5jb21wYXJlVG8oYSk8MD90aGlzOmF9ZnVuY3Rpb24gYm5NYXgoYSl7cmV0dXJuIHRoaXMuY29tcGFyZVRvKGEpPjA/dGhpczphfWZ1bmN0aW9uIGJucEJpdHdpc2VUbyhhLG9wLHIpe3ZhciBpLGYsbT1NYXRoLm1pbihhLnQsdGhpcy50KTtmb3IoaT0wO2k8bTsrK2kpcltpXT1vcCh0aGlzW2ldLGFbaV0pO2lmKGEudDx0aGlzLnQpe2Y9YS5zJnRoaXMuRE07Zm9yKGk9bTtpPHRoaXMudDsrK2kpcltpXT1vcCh0aGlzW2ldLGYpO3IudD10aGlzLnR9ZWxzZXtmPXRoaXMucyZ0aGlzLkRNO2ZvcihpPW07aTxhLnQ7KytpKXJbaV09b3AoZixhW2ldKTtyLnQ9YS50fXIucz1vcCh0aGlzLnMsYS5zKTtyLmNsYW1wKCl9ZnVuY3Rpb24gb3BfYW5kKHgseSl7cmV0dXJuIHgmeX1mdW5jdGlvbiBibkFuZChhKXt2YXIgcj1uYmkoKTt0aGlzLmJpdHdpc2VUbyhhLG9wX2FuZCxyKTtyZXR1cm4gcn1mdW5jdGlvbiBvcF9vcih4LHkpe3JldHVybiB4fHl9ZnVuY3Rpb24gYm5PcihhKXt2YXIgcj1uYmkoKTt0aGlzLmJpdHdpc2VUbyhhLG9wX29yLHIpO3JldHVybiByfWZ1bmN0aW9uIG9wX3hvcih4LHkpe3JldHVybiB4Xnl9ZnVuY3Rpb24gYm5Yb3IoYSl7dmFyIHI9bmJpKCk7dGhpcy5iaXR3aXNlVG8oYSxvcF94b3Iscik7cmV0dXJuIHJ9ZnVuY3Rpb24gb3BfYW5kbm90KHgseSl7cmV0dXJuIHgmfnl9ZnVuY3Rpb24gYm5BbmROb3QoYSl7dmFyIHI9bmJpKCk7dGhpcy5iaXR3aXNlVG8oYSxvcF9hbmRub3Qscik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5Ob3QoKXt2YXIgcj1uYmkoKTtmb3IodmFyIGk9MDtpPHRoaXMudDsrK2kpcltpXT10aGlzLkRNJn50aGlzW2ldO3IudD10aGlzLnQ7ci5zPX50aGlzLnM7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5TaGlmdExlZnQobil7dmFyIHI9bmJpKCk7aWYobjwwKXRoaXMuclNoaWZ0VG8oLW4scik7ZWxzZSB0aGlzLmxTaGlmdFRvKG4scik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5TaGlmdFJpZ2h0KG4pe3ZhciByPW5iaSgpO2lmKG48MCl0aGlzLmxTaGlmdFRvKC1uLHIpO2Vsc2UgdGhpcy5yU2hpZnRUbyhuLHIpO3JldHVybiByfWZ1bmN0aW9uIGxiaXQoeCl7aWYoeD09PTApcmV0dXJuLTE7dmFyIHI9MDtpZigoeCY2NTUzNSk9PT0wKXt4Pj49MTY7cis9MTZ9aWYoKHgmMjU1KT09PTApe3g+Pj04O3IrPTh9aWYoKHgmMTUpPT09MCl7eD4+PTQ7cis9NH1pZigoeCYzKT09PTApe3g+Pj0yO3IrPTJ9aWYoKHgmMSk9PT0wKSsrcjtyZXR1cm4gcn1mdW5jdGlvbiBibkdldExvd2VzdFNldEJpdCgpe2Zvcih2YXIgaT0wO2k8dGhpcy50OysraSlpZih0aGlzW2ldIT0wKXJldHVybiBpKnRoaXMuREIrbGJpdCh0aGlzW2ldKTtpZih0aGlzLnM8MClyZXR1cm4gdGhpcy50KnRoaXMuREI7cmV0dXJuLTF9ZnVuY3Rpb24gY2JpdCh4KXt2YXIgcj0wO3doaWxlKHghPTApe3gmPXgtMTsrK3J9cmV0dXJuIHJ9ZnVuY3Rpb24gYm5CaXRDb3VudCgpe3ZhciByPTAseD10aGlzLnMmdGhpcy5ETTtmb3IodmFyIGk9MDtpPHRoaXMudDsrK2kpcis9Y2JpdCh0aGlzW2ldXngpO3JldHVybiByfWZ1bmN0aW9uIGJuVGVzdEJpdChuKXt2YXIgaj1NYXRoLmZsb29yKG4vdGhpcy5EQik7aWYoaj49dGhpcy50KXJldHVybiB0aGlzLnMhPTA7cmV0dXJuKHRoaXNbal0mMTw8biV0aGlzLkRCKSE9MH1mdW5jdGlvbiBibnBDaGFuZ2VCaXQobixvcCl7dmFyIHI9QmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KG4pO3RoaXMuYml0d2lzZVRvKHIsb3Ascik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5TZXRCaXQobil7cmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sb3Bfb3IpfWZ1bmN0aW9uIGJuQ2xlYXJCaXQobil7cmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sb3BfYW5kbm90KX1mdW5jdGlvbiBibkZsaXBCaXQobil7cmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sb3BfeG9yKX1mdW5jdGlvbiBibnBBZGRUbyhhLHIpe3ZhciBpPTAsYz0wLG09TWF0aC5taW4oYS50LHRoaXMudCk7d2hpbGUoaTxtKXtjKz10aGlzW2ldK2FbaV07cltpKytdPWMmdGhpcy5ETTtjPj49dGhpcy5EQn1pZihhLnQ8dGhpcy50KXtjKz1hLnM7d2hpbGUoaTx0aGlzLnQpe2MrPXRoaXNbaV07cltpKytdPWMmdGhpcy5ETTtjPj49dGhpcy5EQn1jKz10aGlzLnN9ZWxzZXtjKz10aGlzLnM7d2hpbGUoaTxhLnQpe2MrPWFbaV07cltpKytdPWMmdGhpcy5ETTtjPj49dGhpcy5EQn1jKz1hLnN9ci5zPWM8MD8tMTowO2lmKGM+MClyW2krK109YztlbHNlIGlmKGM8LTEpcltpKytdPXRoaXMuRFYrYztyLnQ9aTtyLmNsYW1wKCl9ZnVuY3Rpb24gYm5BZGQoYSl7dmFyIHI9bmJpKCk7dGhpcy5hZGRUbyhhLHIpO3JldHVybiByfWZ1bmN0aW9uIGJuU3VidHJhY3QoYSl7dmFyIHI9bmJpKCk7dGhpcy5zdWJUbyhhLHIpO3JldHVybiByfWZ1bmN0aW9uIGJuTXVsdGlwbHkoYSl7dmFyIHI9bmJpKCk7dGhpcy5tdWx0aXBseVRvKGEscik7cmV0dXJuIHJ9ZnVuY3Rpb24gYm5TcXVhcmUoKXt2YXIgcj1uYmkoKTt0aGlzLnNxdWFyZVRvKHIpO3JldHVybiByfWZ1bmN0aW9uIGJuRGl2aWRlKGEpe3ZhciByPW5iaSgpO3RoaXMuZGl2UmVtVG8oYSxyLG51bGwpO3JldHVybiByfWZ1bmN0aW9uIGJuUmVtYWluZGVyKGEpe3ZhciByPW5iaSgpO3RoaXMuZGl2UmVtVG8oYSxudWxsLHIpO3JldHVybiByfWZ1bmN0aW9uIGJuRGl2aWRlQW5kUmVtYWluZGVyKGEpe3ZhciBxPW5iaSgpLHI9bmJpKCk7dGhpcy5kaXZSZW1UbyhhLHEscik7cmV0dXJuIG5ldyBBcnJheShxLHIpfWZ1bmN0aW9uIGJucERNdWx0aXBseShuKXt0aGlzW3RoaXMudF09dGhpcy5hbSgwLG4tMSx0aGlzLDAsMCx0aGlzLnQpOysrdGhpcy50O3RoaXMuY2xhbXAoKX1mdW5jdGlvbiBibnBEQWRkT2Zmc2V0KG4sdyl7aWYobj09PTApcmV0dXJuO3doaWxlKHRoaXMudDw9dyl0aGlzW3RoaXMudCsrXT0wO3RoaXNbd10rPW47d2hpbGUodGhpc1t3XT49dGhpcy5EVil7dGhpc1t3XS09dGhpcy5EVjtpZigrK3c+PXRoaXMudCl0aGlzW3RoaXMudCsrXT0wOysrdGhpc1t3XX19ZnVuY3Rpb24gTnVsbEV4cCgpe31mdW5jdGlvbiBuTm9wKHgpe3JldHVybiB4fWZ1bmN0aW9uIG5NdWxUbyh4LHkscil7eC5tdWx0aXBseVRvKHkscil9ZnVuY3Rpb24gblNxclRvKHgscil7eC5zcXVhcmVUbyhyKX1OdWxsRXhwLnByb3RvdHlwZS5jb252ZXJ0PW5Ob3A7TnVsbEV4cC5wcm90b3R5cGUucmV2ZXJ0PW5Ob3A7TnVsbEV4cC5wcm90b3R5cGUubXVsVG89bk11bFRvO051bGxFeHAucHJvdG90eXBlLnNxclRvPW5TcXJUbztmdW5jdGlvbiBiblBvdyhlKXtyZXR1cm4gdGhpcy5leHAoZSxuZXcgTnVsbEV4cCl9ZnVuY3Rpb24gYm5wTXVsdGlwbHlMb3dlclRvKGEsbixyKXt2YXIgaT1NYXRoLm1pbih0aGlzLnQrYS50LG4pO3Iucz0wO3IudD1pO3doaWxlKGk+MClyWy0taV09MDt2YXIgajtmb3Ioaj1yLnQtdGhpcy50O2k8ajsrK2kpcltpK3RoaXMudF09dGhpcy5hbSgwLGFbaV0scixpLDAsdGhpcy50KTtmb3Ioaj1NYXRoLm1pbihhLnQsbik7aTxqOysraSl0aGlzLmFtKDAsYVtpXSxyLGksMCxuLWkpO3IuY2xhbXAoKX1mdW5jdGlvbiBibnBNdWx0aXBseVVwcGVyVG8oYSxuLHIpey0tbjt2YXIgaT1yLnQ9dGhpcy50K2EudC1uO3Iucz0wO3doaWxlKC0taT49MClyW2ldPTA7Zm9yKGk9TWF0aC5tYXgobi10aGlzLnQsMCk7aTxhLnQ7KytpKXJbdGhpcy50K2ktbl09dGhpcy5hbShuLWksYVtpXSxyLDAsMCx0aGlzLnQraS1uKTtyLmNsYW1wKCk7ci5kclNoaWZ0VG8oMSxyKX1mdW5jdGlvbiBCYXJyZXR0KG0pe3RoaXMucjI9bmJpKCk7dGhpcy5xMz1uYmkoKTtCaWdJbnRlZ2VyLk9ORS5kbFNoaWZ0VG8oMiptLnQsdGhpcy5yMik7dGhpcy5tdT10aGlzLnIyLmRpdmlkZShtKTt0aGlzLm09bX1mdW5jdGlvbiBiYXJyZXR0Q29udmVydCh4KXtpZih4LnM8MHx8eC50PjIqdGhpcy5tLnQpcmV0dXJuIHgubW9kKHRoaXMubSk7ZWxzZSBpZih4LmNvbXBhcmVUbyh0aGlzLm0pPDApcmV0dXJuIHg7ZWxzZXt2YXIgcj1uYmkoKTt4LmNvcHlUbyhyKTt0aGlzLnJlZHVjZShyKTtyZXR1cm4gcn19ZnVuY3Rpb24gYmFycmV0dFJldmVydCh4KXtyZXR1cm4geH1mdW5jdGlvbiBiYXJyZXR0UmVkdWNlKHgpe3guZHJTaGlmdFRvKHRoaXMubS50LTEsdGhpcy5yMik7aWYoeC50PnRoaXMubS50KzEpe3gudD10aGlzLm0udCsxO3guY2xhbXAoKX10aGlzLm11Lm11bHRpcGx5VXBwZXJUbyh0aGlzLnIyLHRoaXMubS50KzEsdGhpcy5xMyk7dGhpcy5tLm11bHRpcGx5TG93ZXJUbyh0aGlzLnEzLHRoaXMubS50KzEsdGhpcy5yMik7d2hpbGUoeC5jb21wYXJlVG8odGhpcy5yMik8MCl4LmRBZGRPZmZzZXQoMSx0aGlzLm0udCsxKTt4LnN1YlRvKHRoaXMucjIseCk7d2hpbGUoeC5jb21wYXJlVG8odGhpcy5tKT49MCl4LnN1YlRvKHRoaXMubSx4KX1mdW5jdGlvbiBiYXJyZXR0U3FyVG8oeCxyKXt4LnNxdWFyZVRvKHIpO3RoaXMucmVkdWNlKHIpfWZ1bmN0aW9uIGJhcnJldHRNdWxUbyh4LHkscil7eC5tdWx0aXBseVRvKHkscik7dGhpcy5yZWR1Y2Uocil9QmFycmV0dC5wcm90b3R5cGUuY29udmVydD1iYXJyZXR0Q29udmVydDtCYXJyZXR0LnByb3RvdHlwZS5yZXZlcnQ9YmFycmV0dFJldmVydDtCYXJyZXR0LnByb3RvdHlwZS5yZWR1Y2U9YmFycmV0dFJlZHVjZTtCYXJyZXR0LnByb3RvdHlwZS5tdWxUbz1iYXJyZXR0TXVsVG87QmFycmV0dC5wcm90b3R5cGUuc3FyVG89YmFycmV0dFNxclRvO2Z1bmN0aW9uIGJuTW9kUG93KGUsbSl7cmV0dXJuIGdldE9wdGltYWxJbXBsKCkuYXBwbHkodGhpcyxbZSxtXSl9QmlnSW50ZWdlci5tb2RQb3dJbXBsPXVuZGVmaW5lZDtCaWdJbnRlZ2VyLnNldE1vZFBvd0ltcGw9ZnVuY3Rpb24oYXV0aG9yTmFtZSl7QmlnSW50ZWdlci5tb2RQb3dJbXBsPWZ1bmN0aW9uKCl7c3dpdGNoKGF1dGhvck5hbWUpe2Nhc2UiUGV0ZXIgT2xzb24iOnJldHVybiBibk1vZFBvd19wZXRlck9sc29uO2Nhc2UiVG9tIFd1IjpyZXR1cm4gYm5Nb2RQb3dfdG9tV3V9fSgpfTt2YXIgZ2V0T3B0aW1hbEltcGw9ZnVuY3Rpb24oKXt7dmFyIHJlc3VsdD1CaWdJbnRlZ2VyLm1vZFBvd0ltcGw7aWYocmVzdWx0IT09dW5kZWZpbmVkKXtyZXR1cm4gcmVzdWx0fX12YXIgeD1uZXcgQmlnSW50ZWdlcigiNDMzMzM3MDc5MjMwMDgzOTIxNDg4MDc4MzY0NzU2MCIsMTApO3ZhciBlPW5ldyBCaWdJbnRlZ2VyKCIzNzA3OTIzMDA4MzkyMTQ4ODA3ODM2NDc1NjA5NDE5IiwxMCk7dmFyIG09bmV3IEJpZ0ludGVnZXIoIjE0ODMxNjkyMDMzNTY4NTk1MjMxMzQ1OTAyNDM3NjAiLDEwKTt2YXIgc3RhcnQ9RGF0ZS5ub3coKTtibk1vZFBvd19wZXRlck9sc29uLmFwcGx5KHgsW2UsbV0pO3ZhciBkdXJhdGlvblBldGVyT2xzb249RGF0ZS5ub3coKS1zdGFydDtzdGFydD1EYXRlLm5vdygpO2JuTW9kUG93X3RvbVd1LmFwcGx5KHgsW2UsbV0pO3ZhciBkdXJhdGlvblRvbVd1PURhdGUubm93KCktc3RhcnQ7QmlnSW50ZWdlci5tb2RQb3dJbXBsPWR1cmF0aW9uUGV0ZXJPbHNvbjxkdXJhdGlvblRvbVd1P2JuTW9kUG93X3BldGVyT2xzb246Ym5Nb2RQb3dfdG9tV3U7cmV0dXJuIGdldE9wdGltYWxJbXBsKCl9O2Z1bmN0aW9uIGJuTW9kUG93X3BldGVyT2xzb24oZSxtKXt2YXIgcG9UaGlzPXBldGVyT2xzb25fQmlnSW50ZWdlclN0YXRpYyh0aGlzLnRvU3RyaW5nKDEwKSwxMCk7dmFyIHBvRT1wZXRlck9sc29uX0JpZ0ludGVnZXJTdGF0aWMoZS50b1N0cmluZygxMCksMTApO3ZhciBwb009cGV0ZXJPbHNvbl9CaWdJbnRlZ2VyU3RhdGljKG0udG9TdHJpbmcoMTApLDEwKTt2YXIgcG9PdXQ9cG9UaGlzLm1vZFBvdyhwb0UscG9NKTt2YXIgb3V0PW5ldyBCaWdJbnRlZ2VyKHBvT3V0LnRvU3RyaW5nKDEwKSwxMCk7cmV0dXJuIG91dH1mdW5jdGlvbiBibk1vZFBvd190b21XdShlLG0pe3ZhciBpPWUuYml0TGVuZ3RoKCksayxyPW5idigxKSx6O2lmKGk8PTApcmV0dXJuIHI7ZWxzZSBpZihpPDE4KWs9MTtlbHNlIGlmKGk8NDgpaz0zO2Vsc2UgaWYoaTwxNDQpaz00O2Vsc2UgaWYoaTw3Njgpaz01O2Vsc2Ugaz02O2lmKGk8OCl6PW5ldyBDbGFzc2ljKG0pO2Vsc2UgaWYobS5pc0V2ZW4oKSl6PW5ldyBCYXJyZXR0KG0pO2Vsc2Ugej1uZXcgTW9udGdvbWVyeShtKTt2YXIgZz1uZXcgQXJyYXksbj0zLGsxPWstMSxrbT0oMTw8ayktMTtnWzFdPXouY29udmVydCh0aGlzKTtpZihrPjEpe3ZhciBnMj1uYmkoKTt6LnNxclRvKGdbMV0sZzIpO3doaWxlKG48PWttKXtnW25dPW5iaSgpO3oubXVsVG8oZzIsZ1tuLTJdLGdbbl0pO24rPTJ9fXZhciBqPWUudC0xLHcsaXMxPXRydWUscjI9bmJpKCksdDtpPW5iaXRzKGVbal0pLTE7d2hpbGUoaj49MCl7aWYoaT49azEpdz1lW2pdPj5pLWsxJmttO2Vsc2V7dz0oZVtqXSYoMTw8aSsxKS0xKTw8azEtaTtpZihqPjApd3w9ZVtqLTFdPj50aGlzLkRCK2ktazF9bj1rO3doaWxlKCh3JjEpPT09MCl7dz4+PTE7LS1ufWlmKChpLT1uKTwwKXtpKz10aGlzLkRCOy0tan1pZihpczEpe2dbd10uY29weVRvKHIpO2lzMT1mYWxzZX1lbHNle3doaWxlKG4+MSl7ei5zcXJUbyhyLHIyKTt6LnNxclRvKHIyLHIpO24tPTJ9aWYobj4wKXouc3FyVG8ocixyMik7ZWxzZXt0PXI7cj1yMjtyMj10fXoubXVsVG8ocjIsZ1t3XSxyKX13aGlsZShqPj0wJiYoZVtqXSYxPDxpKT09PTApe3ouc3FyVG8ocixyMik7dD1yO3I9cjI7cjI9dDtpZigtLWk8MCl7aT10aGlzLkRCLTE7LS1qfX19cmV0dXJuIHoucmV2ZXJ0KHIpfWZ1bmN0aW9uIGJuR0NEKGEpe3ZhciB4PXRoaXMuczwwP3RoaXMubmVnYXRlKCk6dGhpcy5jbG9uZSgpO3ZhciB5PWEuczwwP2EubmVnYXRlKCk6YS5jbG9uZSgpO2lmKHguY29tcGFyZVRvKHkpPDApe3ZhciB0PXg7eD15O3k9dH12YXIgaT14LmdldExvd2VzdFNldEJpdCgpLGc9eS5nZXRMb3dlc3RTZXRCaXQoKTtpZihnPDApcmV0dXJuIHg7aWYoaTxnKWc9aTtpZihnPjApe3guclNoaWZ0VG8oZyx4KTt5LnJTaGlmdFRvKGcseSl9d2hpbGUoeC5zaWdudW0oKT4wKXtpZigoaT14LmdldExvd2VzdFNldEJpdCgpKT4wKXguclNoaWZ0VG8oaSx4KTtpZigoaT15LmdldExvd2VzdFNldEJpdCgpKT4wKXkuclNoaWZ0VG8oaSx5KTtpZih4LmNvbXBhcmVUbyh5KT49MCl7eC5zdWJUbyh5LHgpO3guclNoaWZ0VG8oMSx4KX1lbHNle3kuc3ViVG8oeCx5KTt5LnJTaGlmdFRvKDEseSl9fWlmKGc+MCl5LmxTaGlmdFRvKGcseSk7cmV0dXJuIHl9ZnVuY3Rpb24gYm5wTW9kSW50KG4pe2lmKG48PTApcmV0dXJuIDA7dmFyIGQ9dGhpcy5EViVuLHI9dGhpcy5zPDA/bi0xOjA7aWYodGhpcy50PjApaWYoZD09PTApcj10aGlzWzBdJW47ZWxzZSBmb3IodmFyIGk9dGhpcy50LTE7aT49MDstLWkpcj0oZCpyK3RoaXNbaV0pJW47cmV0dXJuIHJ9ZnVuY3Rpb24gYm5Nb2RJbnZlcnNlKG0pe3ZhciBhYz1tLmlzRXZlbigpO2lmKHRoaXMuaXNFdmVuKCkmJmFjfHxtLnNpZ251bSgpPT09MClyZXR1cm4gQmlnSW50ZWdlci5aRVJPO3ZhciB1PW0uY2xvbmUoKSx2PXRoaXMuY2xvbmUoKTt2YXIgYT1uYnYoMSksYj1uYnYoMCksYz1uYnYoMCksZD1uYnYoMSk7d2hpbGUodS5zaWdudW0oKSE9MCl7d2hpbGUodS5pc0V2ZW4oKSl7dS5yU2hpZnRUbygxLHUpO2lmKGFjKXtpZighYS5pc0V2ZW4oKXx8IWIuaXNFdmVuKCkpe2EuYWRkVG8odGhpcyxhKTtiLnN1YlRvKG0sYil9YS5yU2hpZnRUbygxLGEpfWVsc2UgaWYoIWIuaXNFdmVuKCkpYi5zdWJUbyhtLGIpO2IuclNoaWZ0VG8oMSxiKX13aGlsZSh2LmlzRXZlbigpKXt2LnJTaGlmdFRvKDEsdik7aWYoYWMpe2lmKCFjLmlzRXZlbigpfHwhZC5pc0V2ZW4oKSl7Yy5hZGRUbyh0aGlzLGMpO2Quc3ViVG8obSxkKX1jLnJTaGlmdFRvKDEsYyl9ZWxzZSBpZighZC5pc0V2ZW4oKSlkLnN1YlRvKG0sZCk7ZC5yU2hpZnRUbygxLGQpfWlmKHUuY29tcGFyZVRvKHYpPj0wKXt1LnN1YlRvKHYsdSk7aWYoYWMpYS5zdWJUbyhjLGEpO2Iuc3ViVG8oZCxiKX1lbHNle3Yuc3ViVG8odSx2KTtpZihhYyljLnN1YlRvKGEsYyk7ZC5zdWJUbyhiLGQpfX1pZih2LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkhPTApcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztpZihkLmNvbXBhcmVUbyhtKT49MClyZXR1cm4gZC5zdWJ0cmFjdChtKTtpZihkLnNpZ251bSgpPDApZC5hZGRUbyhtLGQpO2Vsc2UgcmV0dXJuIGQ7aWYoZC5zaWdudW0oKTwwKXJldHVybiBkLmFkZChtKTtlbHNlIHJldHVybiBkfXZhciBsb3dwcmltZXM9WzIsMyw1LDcsMTEsMTMsMTcsMTksMjMsMjksMzEsMzcsNDEsNDMsNDcsNTMsNTksNjEsNjcsNzEsNzMsNzksODMsODksOTcsMTAxLDEwMywxMDcsMTA5LDExMywxMjcsMTMxLDEzNywxMzksMTQ5LDE1MSwxNTcsMTYzLDE2NywxNzMsMTc5LDE4MSwxOTEsMTkzLDE5NywxOTksMjExLDIyMywyMjcsMjI5LDIzMywyMzksMjQxLDI1MSwyNTcsMjYzLDI2OSwyNzEsMjc3LDI4MSwyODMsMjkzLDMwNywzMTEsMzEzLDMxNywzMzEsMzM3LDM0NywzNDksMzUzLDM1OSwzNjcsMzczLDM3OSwzODMsMzg5LDM5Nyw0MDEsNDA5LDQxOSw0MjEsNDMxLDQzMyw0MzksNDQzLDQ0OSw0NTcsNDYxLDQ2Myw0NjcsNDc5LDQ4Nyw0OTEsNDk5LDUwMyw1MDksNTIxLDUyMyw1NDEsNTQ3LDU1Nyw1NjMsNTY5LDU3MSw1NzcsNTg3LDU5Myw1OTksNjAxLDYwNyw2MTMsNjE3LDYxOSw2MzEsNjQxLDY0Myw2NDcsNjUzLDY1OSw2NjEsNjczLDY3Nyw2ODMsNjkxLDcwMSw3MDksNzE5LDcyNyw3MzMsNzM5LDc0Myw3NTEsNzU3LDc2MSw3NjksNzczLDc4Nyw3OTcsODA5LDgxMSw4MjEsODIzLDgyNyw4MjksODM5LDg1Myw4NTcsODU5LDg2Myw4NzcsODgxLDg4Myw4ODcsOTA3LDkxMSw5MTksOTI5LDkzNyw5NDEsOTQ3LDk1Myw5NjcsOTcxLDk3Nyw5ODMsOTkxLDk5N107dmFyIGxwbGltPSgxPDwyNikvbG93cHJpbWVzW2xvd3ByaW1lcy5sZW5ndGgtMV07ZnVuY3Rpb24gYm5Jc1Byb2JhYmxlUHJpbWUodCl7dmFyIGkseD10aGlzLmFicygpO2lmKHgudD09MSYmeFswXTw9bG93cHJpbWVzW2xvd3ByaW1lcy5sZW5ndGgtMV0pe2ZvcihpPTA7aTxsb3dwcmltZXMubGVuZ3RoOysraSlpZih4WzBdPT1sb3dwcmltZXNbaV0pcmV0dXJuIHRydWU7cmV0dXJuIGZhbHNlfWlmKHguaXNFdmVuKCkpcmV0dXJuIGZhbHNlO2k9MTt3aGlsZShpPGxvd3ByaW1lcy5sZW5ndGgpe3ZhciBtPWxvd3ByaW1lc1tpXSxqPWkrMTt3aGlsZShqPGxvd3ByaW1lcy5sZW5ndGgmJm08bHBsaW0pbSo9bG93cHJpbWVzW2orK107bT14Lm1vZEludChtKTt3aGlsZShpPGopaWYobSVsb3dwcmltZXNbaSsrXT09PTApcmV0dXJuIGZhbHNlfXJldHVybiB4Lm1pbGxlclJhYmluKHQpfWZ1bmN0aW9uIGJucE1pbGxlclJhYmluKHQpe3ZhciBuMT10aGlzLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTt2YXIgaz1uMS5nZXRMb3dlc3RTZXRCaXQoKTtpZihrPD0wKXJldHVybiBmYWxzZTt2YXIgcj1uMS5zaGlmdFJpZ2h0KGspO3Q9dCsxPj4xO2lmKHQ+bG93cHJpbWVzLmxlbmd0aCl0PWxvd3ByaW1lcy5sZW5ndGg7dmFyIGE9bmJpKCk7Zm9yKHZhciBpPTA7aTx0OysraSl7YS5mcm9tSW50KGxvd3ByaW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqbG93cHJpbWVzLmxlbmd0aCldKTt2YXIgeT1hLm1vZFBvdyhyLHRoaXMpO2lmKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSE9MCYmeS5jb21wYXJlVG8objEpIT0wKXt2YXIgaj0xO3doaWxlKGorKzxrJiZ5LmNvbXBhcmVUbyhuMSkhPTApe3k9eS5tb2RQb3dJbnQoMix0aGlzKTtpZih5LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSk9PT0wKXJldHVybiBmYWxzZX1pZih5LmNvbXBhcmVUbyhuMSkhPTApcmV0dXJuIGZhbHNlfX1yZXR1cm4gdHJ1ZX1CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb3B5VG89Ym5wQ29weVRvO0JpZ0ludGVnZXIucHJvdG90eXBlLmZyb21JbnQ9Ym5wRnJvbUludDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tU3RyaW5nPWJucEZyb21TdHJpbmc7QmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbUJ5dGVBcnJheT1ibnBGcm9tQnl0ZUFycmF5O0JpZ0ludGVnZXIucHJvdG90eXBlLmZyb21CdWZmZXI9Ym5wRnJvbUJ1ZmZlcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGFtcD1ibnBDbGFtcDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5kbFNoaWZ0VG89Ym5wRExTaGlmdFRvO0JpZ0ludGVnZXIucHJvdG90eXBlLmRyU2hpZnRUbz1ibnBEUlNoaWZ0VG87QmlnSW50ZWdlci5wcm90b3R5cGUubFNoaWZ0VG89Ym5wTFNoaWZ0VG87QmlnSW50ZWdlci5wcm90b3R5cGUuclNoaWZ0VG89Ym5wUlNoaWZ0VG87QmlnSW50ZWdlci5wcm90b3R5cGUuc3ViVG89Ym5wU3ViVG87QmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlUbz1ibnBNdWx0aXBseVRvO0JpZ0ludGVnZXIucHJvdG90eXBlLnNxdWFyZVRvPWJucFNxdWFyZVRvO0JpZ0ludGVnZXIucHJvdG90eXBlLmRpdlJlbVRvPWJucERpdlJlbVRvO0JpZ0ludGVnZXIucHJvdG90eXBlLmludkRpZ2l0PWJucEludkRpZ2l0O0JpZ0ludGVnZXIucHJvdG90eXBlLmlzRXZlbj1ibnBJc0V2ZW47QmlnSW50ZWdlci5wcm90b3R5cGUuZXhwPWJucEV4cDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5jaHVua1NpemU9Ym5wQ2h1bmtTaXplO0JpZ0ludGVnZXIucHJvdG90eXBlLnRvUmFkaXg9Ym5wVG9SYWRpeDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tUmFkaXg9Ym5wRnJvbVJhZGl4O0JpZ0ludGVnZXIucHJvdG90eXBlLmZyb21OdW1iZXI9Ym5wRnJvbU51bWJlcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXR3aXNlVG89Ym5wQml0d2lzZVRvO0JpZ0ludGVnZXIucHJvdG90eXBlLmNoYW5nZUJpdD1ibnBDaGFuZ2VCaXQ7QmlnSW50ZWdlci5wcm90b3R5cGUuYWRkVG89Ym5wQWRkVG87QmlnSW50ZWdlci5wcm90b3R5cGUuZE11bHRpcGx5PWJucERNdWx0aXBseTtCaWdJbnRlZ2VyLnByb3RvdHlwZS5kQWRkT2Zmc2V0PWJucERBZGRPZmZzZXQ7QmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlMb3dlclRvPWJucE11bHRpcGx5TG93ZXJUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseVVwcGVyVG89Ym5wTXVsdGlwbHlVcHBlclRvO0JpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludD1ibnBNb2RJbnQ7QmlnSW50ZWdlci5wcm90b3R5cGUubWlsbGVyUmFiaW49Ym5wTWlsbGVyUmFiaW47QmlnSW50ZWdlci5wcm90b3R5cGUudG9TdHJpbmc9Ym5Ub1N0cmluZztCaWdJbnRlZ2VyLnByb3RvdHlwZS5uZWdhdGU9Ym5OZWdhdGU7QmlnSW50ZWdlci5wcm90b3R5cGUuYWJzPWJuQWJzO0JpZ0ludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbz1ibkNvbXBhcmVUbztCaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGg9Ym5CaXRMZW5ndGg7QmlnSW50ZWdlci5wcm90b3R5cGUubW9kPWJuTW9kO0JpZ0ludGVnZXIucHJvdG90eXBlLm1vZFBvd0ludD1ibk1vZFBvd0ludDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5jbG9uZT1ibkNsb25lO0JpZ0ludGVnZXIucHJvdG90eXBlLmludFZhbHVlPWJuSW50VmFsdWU7QmlnSW50ZWdlci5wcm90b3R5cGUuYnl0ZVZhbHVlPWJuQnl0ZVZhbHVlO0JpZ0ludGVnZXIucHJvdG90eXBlLnNob3J0VmFsdWU9Ym5TaG9ydFZhbHVlO0JpZ0ludGVnZXIucHJvdG90eXBlLnNpZ251bT1iblNpZ051bTtCaWdJbnRlZ2VyLnByb3RvdHlwZS50b0J5dGVBcnJheT1iblRvQnl0ZUFycmF5O0JpZ0ludGVnZXIucHJvdG90eXBlLnRvQnVmZmVyPWJuVG9CdWZmZXI7QmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzPWJuRXF1YWxzO0JpZ0ludGVnZXIucHJvdG90eXBlLm1pbj1ibk1pbjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5tYXg9Ym5NYXg7QmlnSW50ZWdlci5wcm90b3R5cGUuYW5kPWJuQW5kO0JpZ0ludGVnZXIucHJvdG90eXBlLm9yPWJuT3I7QmlnSW50ZWdlci5wcm90b3R5cGUueG9yPWJuWG9yO0JpZ0ludGVnZXIucHJvdG90eXBlLmFuZE5vdD1ibkFuZE5vdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5ub3Q9Ym5Ob3Q7QmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRMZWZ0PWJuU2hpZnRMZWZ0O0JpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0UmlnaHQ9Ym5TaGlmdFJpZ2h0O0JpZ0ludGVnZXIucHJvdG90eXBlLmdldExvd2VzdFNldEJpdD1ibkdldExvd2VzdFNldEJpdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRDb3VudD1ibkJpdENvdW50O0JpZ0ludGVnZXIucHJvdG90eXBlLnRlc3RCaXQ9Ym5UZXN0Qml0O0JpZ0ludGVnZXIucHJvdG90eXBlLnNldEJpdD1iblNldEJpdDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGVhckJpdD1ibkNsZWFyQml0O0JpZ0ludGVnZXIucHJvdG90eXBlLmZsaXBCaXQ9Ym5GbGlwQml0O0JpZ0ludGVnZXIucHJvdG90eXBlLmFkZD1ibkFkZDtCaWdJbnRlZ2VyLnByb3RvdHlwZS5zdWJ0cmFjdD1iblN1YnRyYWN0O0JpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5PWJuTXVsdGlwbHk7QmlnSW50ZWdlci5wcm90b3R5cGUuZGl2aWRlPWJuRGl2aWRlO0JpZ0ludGVnZXIucHJvdG90eXBlLnJlbWFpbmRlcj1iblJlbWFpbmRlcjtCaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGVBbmRSZW1haW5kZXI9Ym5EaXZpZGVBbmRSZW1haW5kZXI7QmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93PWJuTW9kUG93O0JpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludmVyc2U9Ym5Nb2RJbnZlcnNlO0JpZ0ludGVnZXIucHJvdG90eXBlLnBvdz1iblBvdztCaWdJbnRlZ2VyLnByb3RvdHlwZS5nY2Q9Ym5HQ0Q7QmlnSW50ZWdlci5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lPWJuSXNQcm9iYWJsZVByaW1lO0JpZ0ludGVnZXIuaW50MmNoYXI9aW50MmNoYXI7QmlnSW50ZWdlci5aRVJPPW5idigwKTtCaWdJbnRlZ2VyLk9ORT1uYnYoMSk7QmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlPWJuU3F1YXJlO21vZHVsZS5leHBvcnRzPUJpZ0ludGVnZXJ9KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi9jcnlwdG8iOjM5LCIuLi91dGlscyI6NTQsImJpZy1pbnRlZ2VyIjoyMyxidWZmZXI6MjV9XSw0OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIF89cmVxdWlyZSgiLi4vdXRpbHMiKS5fO3ZhciBCaWdJbnRlZ2VyPXJlcXVpcmUoIi4vanNibi5qcyIpO3ZhciB1dGlscz1yZXF1aXJlKCIuLi91dGlscy5qcyIpO3ZhciBzY2hlbWVzPXJlcXVpcmUoIi4uL3NjaGVtZXMvc2NoZW1lcy5qcyIpO3ZhciBlbmNyeXB0RW5naW5lcz1yZXF1aXJlKCIuLi9lbmNyeXB0RW5naW5lcy9lbmNyeXB0RW5naW5lcy5qcyIpO2V4cG9ydHMuQmlnSW50ZWdlcj1CaWdJbnRlZ2VyO21vZHVsZS5leHBvcnRzLktleT1mdW5jdGlvbigpe2Z1bmN0aW9uIFJTQUtleSgpe3RoaXMubj1udWxsO3RoaXMuZT0wO3RoaXMuZD1udWxsO3RoaXMucD1udWxsO3RoaXMucT1udWxsO3RoaXMuZG1wMT1udWxsO3RoaXMuZG1xMT1udWxsO3RoaXMuY29lZmY9bnVsbH1SU0FLZXkucHJvdG90eXBlLnNldE9wdGlvbnM9ZnVuY3Rpb24ob3B0aW9ucyl7dmFyIHNpZ25pbmdTY2hlbWVQcm92aWRlcj1zY2hlbWVzW29wdGlvbnMuc2lnbmluZ1NjaGVtZV07dmFyIGVuY3J5cHRpb25TY2hlbWVQcm92aWRlcj1zY2hlbWVzW29wdGlvbnMuZW5jcnlwdGlvblNjaGVtZV07aWYoc2lnbmluZ1NjaGVtZVByb3ZpZGVyPT09ZW5jcnlwdGlvblNjaGVtZVByb3ZpZGVyKXt0aGlzLnNpZ25pbmdTY2hlbWU9dGhpcy5lbmNyeXB0aW9uU2NoZW1lPWVuY3J5cHRpb25TY2hlbWVQcm92aWRlci5tYWtlU2NoZW1lKHRoaXMsb3B0aW9ucyl9ZWxzZXt0aGlzLmVuY3J5cHRpb25TY2hlbWU9ZW5jcnlwdGlvblNjaGVtZVByb3ZpZGVyLm1ha2VTY2hlbWUodGhpcyxvcHRpb25zKTt0aGlzLnNpZ25pbmdTY2hlbWU9c2lnbmluZ1NjaGVtZVByb3ZpZGVyLm1ha2VTY2hlbWUodGhpcyxvcHRpb25zKX10aGlzLmVuY3J5cHRFbmdpbmU9ZW5jcnlwdEVuZ2luZXMuZ2V0RW5naW5lKHRoaXMsb3B0aW9ucyl9O1JTQUtleS5wcm90b3R5cGUuZ2VuZXJhdGU9ZnVuY3Rpb24oQixFKXt2YXIgcXM9Qj4+MTt0aGlzLmU9cGFyc2VJbnQoRSwxNik7dmFyIGVlPW5ldyBCaWdJbnRlZ2VyKEUsMTYpO3doaWxlKHRydWUpe3doaWxlKHRydWUpe3RoaXMucD1uZXcgQmlnSW50ZWdlcihCLXFzLDEpO2lmKHRoaXMucC5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSkuZ2NkKGVlKS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpPT09MCYmdGhpcy5wLmlzUHJvYmFibGVQcmltZSgxMCkpYnJlYWt9d2hpbGUodHJ1ZSl7dGhpcy5xPW5ldyBCaWdJbnRlZ2VyKHFzLDEpO2lmKHRoaXMucS5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSkuZ2NkKGVlKS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpPT09MCYmdGhpcy5xLmlzUHJvYmFibGVQcmltZSgxMCkpYnJlYWt9aWYodGhpcy5wLmNvbXBhcmVUbyh0aGlzLnEpPD0wKXt2YXIgdD10aGlzLnA7dGhpcy5wPXRoaXMucTt0aGlzLnE9dH12YXIgcDE9dGhpcy5wLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTt2YXIgcTE9dGhpcy5xLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTt2YXIgcGhpPXAxLm11bHRpcGx5KHExKTtpZihwaGkuZ2NkKGVlKS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpPT09MCl7dGhpcy5uPXRoaXMucC5tdWx0aXBseSh0aGlzLnEpO2lmKHRoaXMubi5iaXRMZW5ndGgoKTxCKXtjb250aW51ZX10aGlzLmQ9ZWUubW9kSW52ZXJzZShwaGkpO3RoaXMuZG1wMT10aGlzLmQubW9kKHAxKTt0aGlzLmRtcTE9dGhpcy5kLm1vZChxMSk7dGhpcy5jb2VmZj10aGlzLnEubW9kSW52ZXJzZSh0aGlzLnApO2JyZWFrfX10aGlzLiQkcmVjYWxjdWxhdGVDYWNoZSgpfTtSU0FLZXkucHJvdG90eXBlLnNldFByaXZhdGU9ZnVuY3Rpb24oTixFLEQsUCxRLERQLERRLEMpe2lmKE4mJkUmJkQmJk4ubGVuZ3RoPjAmJihfLmlzTnVtYmVyKEUpfHxFLmxlbmd0aD4wKSYmRC5sZW5ndGg+MCl7dGhpcy5uPW5ldyBCaWdJbnRlZ2VyKE4pO3RoaXMuZT1fLmlzTnVtYmVyKEUpP0U6dXRpbHMuZ2V0MzJJbnRGcm9tQnVmZmVyKEUsMCk7dGhpcy5kPW5ldyBCaWdJbnRlZ2VyKEQpO2lmKFAmJlEmJkRQJiZEUSYmQyl7dGhpcy5wPW5ldyBCaWdJbnRlZ2VyKFApO3RoaXMucT1uZXcgQmlnSW50ZWdlcihRKTt0aGlzLmRtcDE9bmV3IEJpZ0ludGVnZXIoRFApO3RoaXMuZG1xMT1uZXcgQmlnSW50ZWdlcihEUSk7dGhpcy5jb2VmZj1uZXcgQmlnSW50ZWdlcihDKX1lbHNle310aGlzLiQkcmVjYWxjdWxhdGVDYWNoZSgpfWVsc2V7dGhyb3cgRXJyb3IoIkludmFsaWQgUlNBIHByaXZhdGUga2V5Iil9fTtSU0FLZXkucHJvdG90eXBlLnNldFB1YmxpYz1mdW5jdGlvbihOLEUpe2lmKE4mJkUmJk4ubGVuZ3RoPjAmJihfLmlzTnVtYmVyKEUpfHxFLmxlbmd0aD4wKSl7dGhpcy5uPW5ldyBCaWdJbnRlZ2VyKE4pO3RoaXMuZT1fLmlzTnVtYmVyKEUpP0U6dXRpbHMuZ2V0MzJJbnRGcm9tQnVmZmVyKEUsMCk7dGhpcy4kJHJlY2FsY3VsYXRlQ2FjaGUoKX1lbHNle3Rocm93IEVycm9yKCJJbnZhbGlkIFJTQSBwdWJsaWMga2V5Iil9fTtSU0FLZXkucHJvdG90eXBlLiRkb1ByaXZhdGU9ZnVuY3Rpb24oeCl7aWYodGhpcy5wfHx0aGlzLnEpe3JldHVybiB4Lm1vZFBvdyh0aGlzLmQsdGhpcy5uKX12YXIgeHA9eC5tb2QodGhpcy5wKS5tb2RQb3codGhpcy5kbXAxLHRoaXMucCk7dmFyIHhxPXgubW9kKHRoaXMucSkubW9kUG93KHRoaXMuZG1xMSx0aGlzLnEpO3doaWxlKHhwLmNvbXBhcmVUbyh4cSk8MCl7eHA9eHAuYWRkKHRoaXMucCl9cmV0dXJuIHhwLnN1YnRyYWN0KHhxKS5tdWx0aXBseSh0aGlzLmNvZWZmKS5tb2QodGhpcy5wKS5tdWx0aXBseSh0aGlzLnEpLmFkZCh4cSl9O1JTQUtleS5wcm90b3R5cGUuJGRvUHVibGljPWZ1bmN0aW9uKHgpe3JldHVybiB4Lm1vZFBvd0ludCh0aGlzLmUsdGhpcy5uKX07UlNBS2V5LnByb3RvdHlwZS5lbmNyeXB0PWZ1bmN0aW9uKGJ1ZmZlcix1c2VQcml2YXRlKXt2YXIgYnVmZmVycz1bXTt2YXIgcmVzdWx0cz1bXTt2YXIgYnVmZmVyU2l6ZT1idWZmZXIubGVuZ3RoO3ZhciBidWZmZXJzQ291bnQ9TWF0aC5jZWlsKGJ1ZmZlclNpemUvdGhpcy5tYXhNZXNzYWdlTGVuZ3RoKXx8MTt2YXIgZGl2aWRlZFNpemU9TWF0aC5jZWlsKGJ1ZmZlclNpemUvYnVmZmVyc0NvdW50fHwxKTtpZihidWZmZXJzQ291bnQ9PTEpe2J1ZmZlcnMucHVzaChidWZmZXIpfWVsc2V7Zm9yKHZhciBidWZOdW09MDtidWZOdW08YnVmZmVyc0NvdW50O2J1Zk51bSsrKXtidWZmZXJzLnB1c2goYnVmZmVyLnNsaWNlKGJ1Zk51bSpkaXZpZGVkU2l6ZSwoYnVmTnVtKzEpKmRpdmlkZWRTaXplKSl9fWZvcih2YXIgaT0wO2k8YnVmZmVycy5sZW5ndGg7aSsrKXtyZXN1bHRzLnB1c2godGhpcy5lbmNyeXB0RW5naW5lLmVuY3J5cHQoYnVmZmVyc1tpXSx1c2VQcml2YXRlKSl9cmV0dXJuIEJ1ZmZlci5jb25jYXQocmVzdWx0cyl9O1JTQUtleS5wcm90b3R5cGUuZGVjcnlwdD1mdW5jdGlvbihidWZmZXIsdXNlUHVibGljKXtpZihidWZmZXIubGVuZ3RoJXRoaXMuZW5jcnlwdGVkRGF0YUxlbmd0aD4wKXt0aHJvdyBFcnJvcigiSW5jb3JyZWN0IGRhdGEgb3Iga2V5Iil9dmFyIHJlc3VsdD1bXTt2YXIgb2Zmc2V0PTA7dmFyIGxlbmd0aD0wO3ZhciBidWZmZXJzQ291bnQ9YnVmZmVyLmxlbmd0aC90aGlzLmVuY3J5cHRlZERhdGFMZW5ndGg7Zm9yKHZhciBpPTA7aTxidWZmZXJzQ291bnQ7aSsrKXtvZmZzZXQ9aSp0aGlzLmVuY3J5cHRlZERhdGFMZW5ndGg7bGVuZ3RoPW9mZnNldCt0aGlzLmVuY3J5cHRlZERhdGFMZW5ndGg7cmVzdWx0LnB1c2godGhpcy5lbmNyeXB0RW5naW5lLmRlY3J5cHQoYnVmZmVyLnNsaWNlKG9mZnNldCxNYXRoLm1pbihsZW5ndGgsYnVmZmVyLmxlbmd0aCkpLHVzZVB1YmxpYykpfXJldHVybiBCdWZmZXIuY29uY2F0KHJlc3VsdCl9O1JTQUtleS5wcm90b3R5cGUuc2lnbj1mdW5jdGlvbihidWZmZXIpe3JldHVybiB0aGlzLnNpZ25pbmdTY2hlbWUuc2lnbi5hcHBseSh0aGlzLnNpZ25pbmdTY2hlbWUsYXJndW1lbnRzKX07UlNBS2V5LnByb3RvdHlwZS52ZXJpZnk9ZnVuY3Rpb24oYnVmZmVyLHNpZ25hdHVyZSxzaWduYXR1cmVfZW5jb2Rpbmcpe3JldHVybiB0aGlzLnNpZ25pbmdTY2hlbWUudmVyaWZ5LmFwcGx5KHRoaXMuc2lnbmluZ1NjaGVtZSxhcmd1bWVudHMpfTtSU0FLZXkucHJvdG90eXBlLmlzUHJpdmF0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm4mJnRoaXMuZSYmdGhpcy5kfHxmYWxzZX07UlNBS2V5LnByb3RvdHlwZS5pc1B1YmxpYz1mdW5jdGlvbihzdHJpY3Qpe3JldHVybiB0aGlzLm4mJnRoaXMuZSYmIShzdHJpY3QmJnRoaXMuZCl8fGZhbHNlfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUlNBS2V5LnByb3RvdHlwZSwia2V5U2l6ZSIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNhY2hlLmtleUJpdExlbmd0aH19KTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUlNBS2V5LnByb3RvdHlwZSwiZW5jcnlwdGVkRGF0YUxlbmd0aCIse2dldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNhY2hlLmtleUJ5dGVMZW5ndGh9fSk7T2JqZWN0LmRlZmluZVByb3BlcnR5KFJTQUtleS5wcm90b3R5cGUsIm1heE1lc3NhZ2VMZW5ndGgiLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbmNyeXB0aW9uU2NoZW1lLm1heE1lc3NhZ2VMZW5ndGgoKX19KTtSU0FLZXkucHJvdG90eXBlLiQkcmVjYWxjdWxhdGVDYWNoZT1mdW5jdGlvbigpe3RoaXMuY2FjaGU9dGhpcy5jYWNoZXx8e307dGhpcy5jYWNoZS5rZXlCaXRMZW5ndGg9dGhpcy5uLmJpdExlbmd0aCgpO3RoaXMuY2FjaGUua2V5Qnl0ZUxlbmd0aD10aGlzLmNhY2hlLmtleUJpdExlbmd0aCs2Pj4zfTtyZXR1cm4gUlNBS2V5fSgpfSkuY2FsbCh0aGlzLHJlcXVpcmUoImJ1ZmZlciIpLkJ1ZmZlcil9LHsiLi4vZW5jcnlwdEVuZ2luZXMvZW5jcnlwdEVuZ2luZXMuanMiOjQwLCIuLi9zY2hlbWVzL3NjaGVtZXMuanMiOjUzLCIuLi91dGlscyI6NTQsIi4uL3V0aWxzLmpzIjo1NCwiLi9qc2JuLmpzIjo0OCxidWZmZXI6MjV9XSw1MDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIGNyeXB0PXJlcXVpcmUoIi4uL2NyeXB0byIpO21vZHVsZS5leHBvcnRzPXtpc0VuY3J5cHRpb246dHJ1ZSxpc1NpZ25hdHVyZTpmYWxzZX07bW9kdWxlLmV4cG9ydHMuZGlnZXN0TGVuZ3RoPXttZDQ6MTYsbWQ1OjE2LHJpcGVtZDE2MDoyMCxybWQxNjA6MjAsc2hhMToyMCxzaGEyMjQ6Mjgsc2hhMjU2OjMyLHNoYTM4NDo0OCxzaGE1MTI6NjR9O3ZhciBERUZBVUxUX0hBU0hfRlVOQ1RJT049InNoYTEiO21vZHVsZS5leHBvcnRzLmVtZV9vYWVwX21nZjE9ZnVuY3Rpb24oc2VlZCxtYXNrTGVuZ3RoLGhhc2hGdW5jdGlvbil7aGFzaEZ1bmN0aW9uPWhhc2hGdW5jdGlvbnx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OO3ZhciBoTGVuPW1vZHVsZS5leHBvcnRzLmRpZ2VzdExlbmd0aFtoYXNoRnVuY3Rpb25dO3ZhciBjb3VudD1NYXRoLmNlaWwobWFza0xlbmd0aC9oTGVuKTt2YXIgVD1CdWZmZXIuYWxsb2MoaExlbipjb3VudCk7dmFyIGM9QnVmZmVyLmFsbG9jKDQpO2Zvcih2YXIgaT0wO2k8Y291bnQ7KytpKXt2YXIgaGFzaD1jcnlwdC5jcmVhdGVIYXNoKGhhc2hGdW5jdGlvbik7aGFzaC51cGRhdGUoc2VlZCk7Yy53cml0ZVVJbnQzMkJFKGksMCk7aGFzaC51cGRhdGUoYyk7aGFzaC5kaWdlc3QoKS5jb3B5KFQsaSpoTGVuKX1yZXR1cm4gVC5zbGljZSgwLG1hc2tMZW5ndGgpfTttb2R1bGUuZXhwb3J0cy5tYWtlU2NoZW1lPWZ1bmN0aW9uKGtleSxvcHRpb25zKXtmdW5jdGlvbiBTY2hlbWUoa2V5LG9wdGlvbnMpe3RoaXMua2V5PWtleTt0aGlzLm9wdGlvbnM9b3B0aW9uc31TY2hlbWUucHJvdG90eXBlLm1heE1lc3NhZ2VMZW5ndGg9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aC0yKm1vZHVsZS5leHBvcnRzLmRpZ2VzdExlbmd0aFt0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OXS0yfTtTY2hlbWUucHJvdG90eXBlLmVuY1BhZD1mdW5jdGlvbihidWZmZXIpe3ZhciBoYXNoPXRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT047dmFyIG1nZj10aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMubWdmfHxtb2R1bGUuZXhwb3J0cy5lbWVfb2FlcF9tZ2YxO3ZhciBsYWJlbD10aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMubGFiZWx8fEJ1ZmZlci5hbGxvYygwKTt2YXIgZW1MZW49dGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aDt2YXIgaExlbj1tb2R1bGUuZXhwb3J0cy5kaWdlc3RMZW5ndGhbaGFzaF07aWYoYnVmZmVyLmxlbmd0aD5lbUxlbi0yKmhMZW4tMil7dGhyb3cgbmV3IEVycm9yKCJNZXNzYWdlIGlzIHRvbyBsb25nIHRvIGVuY29kZSBpbnRvIGFuIGVuY29kZWQgbWVzc2FnZSB3aXRoIGEgbGVuZ3RoIG9mICIrZW1MZW4rIiBieXRlcywgaW5jcmVhc2UiKyJlbUxlbiB0byBmaXggdGhpcyBlcnJvciAobWluaW11bSB2YWx1ZSBmb3IgZ2l2ZW4gcGFyYW1ldGVycyBhbmQgb3B0aW9uczogIisoZW1MZW4tMipoTGVuLTIpKyIpIil9dmFyIGxIYXNoPWNyeXB0LmNyZWF0ZUhhc2goaGFzaCk7bEhhc2gudXBkYXRlKGxhYmVsKTtsSGFzaD1sSGFzaC5kaWdlc3QoKTt2YXIgUFM9QnVmZmVyLmFsbG9jKGVtTGVuLWJ1ZmZlci5sZW5ndGgtMipoTGVuLTEpO1BTLmZpbGwoMCk7UFNbUFMubGVuZ3RoLTFdPTE7dmFyIERCPUJ1ZmZlci5jb25jYXQoW2xIYXNoLFBTLGJ1ZmZlcl0pO3ZhciBzZWVkPWNyeXB0LnJhbmRvbUJ5dGVzKGhMZW4pO3ZhciBtYXNrPW1nZihzZWVkLERCLmxlbmd0aCxoYXNoKTtmb3IodmFyIGk9MDtpPERCLmxlbmd0aDtpKyspe0RCW2ldXj1tYXNrW2ldfW1hc2s9bWdmKERCLGhMZW4saGFzaCk7Zm9yKGk9MDtpPHNlZWQubGVuZ3RoO2krKyl7c2VlZFtpXV49bWFza1tpXX12YXIgZW09QnVmZmVyLmFsbG9jKDErc2VlZC5sZW5ndGgrREIubGVuZ3RoKTtlbVswXT0wO3NlZWQuY29weShlbSwxKTtEQi5jb3B5KGVtLDErc2VlZC5sZW5ndGgpO3JldHVybiBlbX07U2NoZW1lLnByb3RvdHlwZS5lbmNVblBhZD1mdW5jdGlvbihidWZmZXIpe3ZhciBoYXNoPXRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT047dmFyIG1nZj10aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMubWdmfHxtb2R1bGUuZXhwb3J0cy5lbWVfb2FlcF9tZ2YxO3ZhciBsYWJlbD10aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMubGFiZWx8fEJ1ZmZlci5hbGxvYygwKTt2YXIgaExlbj1tb2R1bGUuZXhwb3J0cy5kaWdlc3RMZW5ndGhbaGFzaF07aWYoYnVmZmVyLmxlbmd0aDwyKmhMZW4rMil7dGhyb3cgbmV3IEVycm9yKCJFcnJvciBkZWNvZGluZyBtZXNzYWdlLCB0aGUgc3VwcGxpZWQgbWVzc2FnZSBpcyBub3QgbG9uZyBlbm91Z2ggdG8gYmUgYSB2YWxpZCBPQUVQIGVuY29kZWQgbWVzc2FnZSIpfXZhciBzZWVkPWJ1ZmZlci5zbGljZSgxLGhMZW4rMSk7dmFyIERCPWJ1ZmZlci5zbGljZSgxK2hMZW4pO3ZhciBtYXNrPW1nZihEQixoTGVuLGhhc2gpO2Zvcih2YXIgaT0wO2k8c2VlZC5sZW5ndGg7aSsrKXtzZWVkW2ldXj1tYXNrW2ldfW1hc2s9bWdmKHNlZWQsREIubGVuZ3RoLGhhc2gpO2ZvcihpPTA7aTxEQi5sZW5ndGg7aSsrKXtEQltpXV49bWFza1tpXX12YXIgbEhhc2g9Y3J5cHQuY3JlYXRlSGFzaChoYXNoKTtsSGFzaC51cGRhdGUobGFiZWwpO2xIYXNoPWxIYXNoLmRpZ2VzdCgpO3ZhciBsSGFzaEVNPURCLnNsaWNlKDAsaExlbik7aWYobEhhc2hFTS50b1N0cmluZygiaGV4IikhPWxIYXNoLnRvU3RyaW5nKCJoZXgiKSl7dGhyb3cgbmV3IEVycm9yKCJFcnJvciBkZWNvZGluZyBtZXNzYWdlLCB0aGUgbEhhc2ggY2FsY3VsYXRlZCBmcm9tIHRoZSBsYWJlbCBwcm92aWRlZCBhbmQgdGhlIGxIYXNoIGluIHRoZSBlbmNyeXB0ZWQgZGF0YSBkbyBub3QgbWF0Y2guIil9aT1oTGVuO3doaWxlKERCW2krK109PT0wJiZpPERCLmxlbmd0aCk7aWYoREJbaS0xXSE9MSl7dGhyb3cgbmV3IEVycm9yKCJFcnJvciBkZWNvZGluZyBtZXNzYWdlLCB0aGVyZSBpcyBubyBwYWRkaW5nIG1lc3NhZ2Ugc2VwYXJhdG9yIGJ5dGUiKX1yZXR1cm4gREIuc2xpY2UoaSl9O3JldHVybiBuZXcgU2NoZW1lKGtleSxvcHRpb25zKX19KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi9jcnlwdG8iOjM5LGJ1ZmZlcjoyNX1dLDUxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgQmlnSW50ZWdlcj1yZXF1aXJlKCIuLi9saWJzL2pzYm4iKTt2YXIgY3J5cHQ9cmVxdWlyZSgiLi4vY3J5cHRvIik7dmFyIGNvbnN0YW50cz1yZXF1aXJlKCJjb25zdGFudHMiKTt2YXIgU0lHTl9JTkZPX0hFQUQ9e21kMjpCdWZmZXIuZnJvbSgiMzAyMDMwMGMwNjA4MmE4NjQ4ODZmNzBkMDIwMjA1MDAwNDEwIiwiaGV4IiksbWQ1OkJ1ZmZlci5mcm9tKCIzMDIwMzAwYzA2MDgyYTg2NDg4NmY3MGQwMjA1MDUwMDA0MTAiLCJoZXgiKSxzaGExOkJ1ZmZlci5mcm9tKCIzMDIxMzAwOTA2MDUyYjBlMDMwMjFhMDUwMDA0MTQiLCJoZXgiKSxzaGEyMjQ6QnVmZmVyLmZyb20oIjMwMmQzMDBkMDYwOTYwODY0ODAxNjUwMzA0MDIwNDA1MDAwNDFjIiwiaGV4Iiksc2hhMjU2OkJ1ZmZlci5mcm9tKCIzMDMxMzAwZDA2MDk2MDg2NDgwMTY1MDMwNDAyMDEwNTAwMDQyMCIsImhleCIpLHNoYTM4NDpCdWZmZXIuZnJvbSgiMzA0MTMwMGQwNjA5NjA4NjQ4MDE2NTAzMDQwMjAyMDUwMDA0MzAiLCJoZXgiKSxzaGE1MTI6QnVmZmVyLmZyb20oIjMwNTEzMDBkMDYwOTYwODY0ODAxNjUwMzA0MDIwMzA1MDAwNDQwIiwiaGV4IikscmlwZW1kMTYwOkJ1ZmZlci5mcm9tKCIzMDIxMzAwOTA2MDUyYjI0MDMwMjAxMDUwMDA0MTQiLCJoZXgiKSxybWQxNjA6QnVmZmVyLmZyb20oIjMwMjEzMDA5MDYwNTJiMjQwMzAyMDEwNTAwMDQxNCIsImhleCIpfTt2YXIgU0lHTl9BTEdfVE9fSEFTSF9BTElBU0VTPXtyaXBlbWQxNjA6InJtZDE2MCJ9O3ZhciBERUZBVUxUX0hBU0hfRlVOQ1RJT049InNoYTI1NiI7bW9kdWxlLmV4cG9ydHM9e2lzRW5jcnlwdGlvbjp0cnVlLGlzU2lnbmF0dXJlOnRydWV9O21vZHVsZS5leHBvcnRzLm1ha2VTY2hlbWU9ZnVuY3Rpb24oa2V5LG9wdGlvbnMpe2Z1bmN0aW9uIFNjaGVtZShrZXksb3B0aW9ucyl7dGhpcy5rZXk9a2V5O3RoaXMub3B0aW9ucz1vcHRpb25zfVNjaGVtZS5wcm90b3R5cGUubWF4TWVzc2FnZUxlbmd0aD1mdW5jdGlvbigpe2lmKHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmdGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmc9PWNvbnN0YW50cy5SU0FfTk9fUEFERElORyl7cmV0dXJuIHRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGh9cmV0dXJuIHRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgtMTF9O1NjaGVtZS5wcm90b3R5cGUuZW5jUGFkPWZ1bmN0aW9uKGJ1ZmZlcixvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBmaWxsZWQ7aWYoYnVmZmVyLmxlbmd0aD50aGlzLmtleS5tYXhNZXNzYWdlTGVuZ3RoKXt0aHJvdyBuZXcgRXJyb3IoIk1lc3NhZ2UgdG9vIGxvbmcgZm9yIFJTQSAobj0iK3RoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgrIiwgbD0iK2J1ZmZlci5sZW5ndGgrIikiKX1pZih0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMmJnRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucy5wYWRkaW5nPT1jb25zdGFudHMuUlNBX05PX1BBRERJTkcpe2ZpbGxlZD1CdWZmZXIuYWxsb2ModGhpcy5rZXkubWF4TWVzc2FnZUxlbmd0aC1idWZmZXIubGVuZ3RoKTtmaWxsZWQuZmlsbCgwKTtyZXR1cm4gQnVmZmVyLmNvbmNhdChbZmlsbGVkLGJ1ZmZlcl0pfWlmKG9wdGlvbnMudHlwZT09PTEpe2ZpbGxlZD1CdWZmZXIuYWxsb2ModGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aC1idWZmZXIubGVuZ3RoLTEpO2ZpbGxlZC5maWxsKDI1NSwwLGZpbGxlZC5sZW5ndGgtMSk7ZmlsbGVkWzBdPTE7ZmlsbGVkW2ZpbGxlZC5sZW5ndGgtMV09MDtyZXR1cm4gQnVmZmVyLmNvbmNhdChbZmlsbGVkLGJ1ZmZlcl0pfWVsc2V7ZmlsbGVkPUJ1ZmZlci5hbGxvYyh0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoLWJ1ZmZlci5sZW5ndGgpO2ZpbGxlZFswXT0wO2ZpbGxlZFsxXT0yO3ZhciByYW5kPWNyeXB0LnJhbmRvbUJ5dGVzKGZpbGxlZC5sZW5ndGgtMyk7Zm9yKHZhciBpPTA7aTxyYW5kLmxlbmd0aDtpKyspe3ZhciByPXJhbmRbaV07d2hpbGUocj09PTApe3I9Y3J5cHQucmFuZG9tQnl0ZXMoMSlbMF19ZmlsbGVkW2krMl09cn1maWxsZWRbZmlsbGVkLmxlbmd0aC0xXT0wO3JldHVybiBCdWZmZXIuY29uY2F0KFtmaWxsZWQsYnVmZmVyXSl9fTtTY2hlbWUucHJvdG90eXBlLmVuY1VuUGFkPWZ1bmN0aW9uKGJ1ZmZlcixvcHRpb25zKXtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBpPTA7aWYodGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zJiZ0aGlzLm9wdGlvbnMuZW5jcnlwdGlvblNjaGVtZU9wdGlvbnMucGFkZGluZz09Y29uc3RhbnRzLlJTQV9OT19QQURESU5HKXt2YXIgdW5QYWQ7aWYodHlwZW9mIGJ1ZmZlci5sYXN0SW5kZXhPZj09ImZ1bmN0aW9uIil7dW5QYWQ9YnVmZmVyLnNsaWNlKGJ1ZmZlci5sYXN0SW5kZXhPZigiXDAiKSsxLGJ1ZmZlci5sZW5ndGgpfWVsc2V7dW5QYWQ9YnVmZmVyLnNsaWNlKFN0cmluZy5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIlwwIikrMSxidWZmZXIubGVuZ3RoKX1yZXR1cm4gdW5QYWR9aWYoYnVmZmVyLmxlbmd0aDw0KXtyZXR1cm4gbnVsbH1pZihvcHRpb25zLnR5cGU9PT0xKXtpZihidWZmZXJbMF0hPT0wJiZidWZmZXJbMV0hPT0xKXtyZXR1cm4gbnVsbH1pPTM7d2hpbGUoYnVmZmVyW2ldIT09MCl7aWYoYnVmZmVyW2ldIT0yNTV8fCsraT49YnVmZmVyLmxlbmd0aCl7cmV0dXJuIG51bGx9fX1lbHNle2lmKGJ1ZmZlclswXSE9PTAmJmJ1ZmZlclsxXSE9PTIpe3JldHVybiBudWxsfWk9Mzt3aGlsZShidWZmZXJbaV0hPT0wKXtpZigrK2k+PWJ1ZmZlci5sZW5ndGgpe3JldHVybiBudWxsfX19cmV0dXJuIGJ1ZmZlci5zbGljZShpKzEsYnVmZmVyLmxlbmd0aCl9O1NjaGVtZS5wcm90b3R5cGUuc2lnbj1mdW5jdGlvbihidWZmZXIpe3ZhciBoYXNoQWxnb3JpdGhtPXRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT047aWYodGhpcy5vcHRpb25zLmVudmlyb25tZW50PT09ImJyb3dzZXIiKXtoYXNoQWxnb3JpdGhtPVNJR05fQUxHX1RPX0hBU0hfQUxJQVNFU1toYXNoQWxnb3JpdGhtXXx8aGFzaEFsZ29yaXRobTt2YXIgaGFzaGVyPWNyeXB0LmNyZWF0ZUhhc2goaGFzaEFsZ29yaXRobSk7aGFzaGVyLnVwZGF0ZShidWZmZXIpO3ZhciBoYXNoPXRoaXMucGtjczFwYWQoaGFzaGVyLmRpZ2VzdCgpLGhhc2hBbGdvcml0aG0pO3ZhciByZXM9dGhpcy5rZXkuJGRvUHJpdmF0ZShuZXcgQmlnSW50ZWdlcihoYXNoKSkudG9CdWZmZXIodGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aCk7cmV0dXJuIHJlc31lbHNle3ZhciBzaWduZXI9Y3J5cHQuY3JlYXRlU2lnbigiUlNBLSIraGFzaEFsZ29yaXRobS50b1VwcGVyQ2FzZSgpKTtzaWduZXIudXBkYXRlKGJ1ZmZlcik7cmV0dXJuIHNpZ25lci5zaWduKHRoaXMub3B0aW9ucy5yc2FVdGlscy5leHBvcnRLZXkoInByaXZhdGUiKSl9fTtTY2hlbWUucHJvdG90eXBlLnZlcmlmeT1mdW5jdGlvbihidWZmZXIsc2lnbmF0dXJlLHNpZ25hdHVyZV9lbmNvZGluZyl7Y29uc29sZS5sb2coInZlcmlmeSIpO2lmKHRoaXMub3B0aW9ucy5lbmNyeXB0aW9uU2NoZW1lT3B0aW9ucyYmdGhpcy5vcHRpb25zLmVuY3J5cHRpb25TY2hlbWVPcHRpb25zLnBhZGRpbmc9PWNvbnN0YW50cy5SU0FfTk9fUEFERElORyl7cmV0dXJuIGZhbHNlfXZhciBoYXNoQWxnb3JpdGhtPXRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT047aWYodGhpcy5vcHRpb25zLmVudmlyb25tZW50PT09ImJyb3dzZXIiKXtoYXNoQWxnb3JpdGhtPVNJR05fQUxHX1RPX0hBU0hfQUxJQVNFU1toYXNoQWxnb3JpdGhtXXx8aGFzaEFsZ29yaXRobTtpZihzaWduYXR1cmVfZW5jb2Rpbmcpe3NpZ25hdHVyZT1CdWZmZXIuZnJvbShzaWduYXR1cmUsc2lnbmF0dXJlX2VuY29kaW5nKX12YXIgaGFzaGVyPWNyeXB0LmNyZWF0ZUhhc2goaGFzaEFsZ29yaXRobSk7aGFzaGVyLnVwZGF0ZShidWZmZXIpO3ZhciBoYXNoPXRoaXMucGtjczFwYWQoaGFzaGVyLmRpZ2VzdCgpLGhhc2hBbGdvcml0aG0pO3ZhciBtPXRoaXMua2V5LiRkb1B1YmxpYyhuZXcgQmlnSW50ZWdlcihzaWduYXR1cmUpKTtyZXR1cm4gbS50b0J1ZmZlcigpLnRvU3RyaW5nKCJoZXgiKT09aGFzaC50b1N0cmluZygiaGV4Iil9ZWxzZXt2YXIgdmVyaWZpZXI9Y3J5cHQuY3JlYXRlVmVyaWZ5KCJSU0EtIitoYXNoQWxnb3JpdGhtLnRvVXBwZXJDYXNlKCkpO3ZlcmlmaWVyLnVwZGF0ZShidWZmZXIpO3JldHVybiB2ZXJpZmllci52ZXJpZnkodGhpcy5vcHRpb25zLnJzYVV0aWxzLmV4cG9ydEtleSgicHVibGljIiksc2lnbmF0dXJlLHNpZ25hdHVyZV9lbmNvZGluZyl9fTtTY2hlbWUucHJvdG90eXBlLnBrY3MwcGFkPWZ1bmN0aW9uKGJ1ZmZlcil7dmFyIGZpbGxlZD1CdWZmZXIuYWxsb2ModGhpcy5rZXkubWF4TWVzc2FnZUxlbmd0aC1idWZmZXIubGVuZ3RoKTtmaWxsZWQuZmlsbCgwKTtyZXR1cm4gQnVmZmVyLmNvbmNhdChbZmlsbGVkLGJ1ZmZlcl0pfTtTY2hlbWUucHJvdG90eXBlLnBrY3MwdW5wYWQ9ZnVuY3Rpb24oYnVmZmVyKXt2YXIgdW5QYWQ7aWYodHlwZW9mIGJ1ZmZlci5sYXN0SW5kZXhPZj09ImZ1bmN0aW9uIil7dW5QYWQ9YnVmZmVyLnNsaWNlKGJ1ZmZlci5sYXN0SW5kZXhPZigiXDAiKSsxLGJ1ZmZlci5sZW5ndGgpfWVsc2V7dW5QYWQ9YnVmZmVyLnNsaWNlKFN0cmluZy5wcm90b3R5cGUubGFzdEluZGV4T2YuY2FsbChidWZmZXIsIlwwIikrMSxidWZmZXIubGVuZ3RoKX1yZXR1cm4gdW5QYWR9O1NjaGVtZS5wcm90b3R5cGUucGtjczFwYWQ9ZnVuY3Rpb24oaGFzaEJ1ZixoYXNoQWxnb3JpdGhtKXt2YXIgZGlnZXN0PVNJR05fSU5GT19IRUFEW2hhc2hBbGdvcml0aG1dO2lmKCFkaWdlc3Qpe3Rocm93IEVycm9yKCJVbnN1cHBvcnRlZCBoYXNoIGFsZ29yaXRobSIpfXZhciBkYXRhPUJ1ZmZlci5jb25jYXQoW2RpZ2VzdCxoYXNoQnVmXSk7aWYoZGF0YS5sZW5ndGgrMTA+dGhpcy5rZXkuZW5jcnlwdGVkRGF0YUxlbmd0aCl7dGhyb3cgRXJyb3IoIktleSBpcyB0b28gc2hvcnQgZm9yIHNpZ25pbmcgYWxnb3JpdGhtICgiK2hhc2hBbGdvcml0aG0rIikiKX12YXIgZmlsbGVkPUJ1ZmZlci5hbGxvYyh0aGlzLmtleS5lbmNyeXB0ZWREYXRhTGVuZ3RoLWRhdGEubGVuZ3RoLTEpO2ZpbGxlZC5maWxsKDI1NSwwLGZpbGxlZC5sZW5ndGgtMSk7ZmlsbGVkWzBdPTE7ZmlsbGVkW2ZpbGxlZC5sZW5ndGgtMV09MDt2YXIgcmVzPUJ1ZmZlci5jb25jYXQoW2ZpbGxlZCxkYXRhXSk7cmV0dXJuIHJlc307cmV0dXJuIG5ldyBTY2hlbWUoa2V5LG9wdGlvbnMpfX0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7Ii4uL2NyeXB0byI6MzksIi4uL2xpYnMvanNibiI6NDgsYnVmZmVyOjI1LGNvbnN0YW50czoyN31dLDUyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgQmlnSW50ZWdlcj1yZXF1aXJlKCIuLi9saWJzL2pzYm4iKTt2YXIgY3J5cHQ9cmVxdWlyZSgiLi4vY3J5cHRvIik7bW9kdWxlLmV4cG9ydHM9e2lzRW5jcnlwdGlvbjpmYWxzZSxpc1NpZ25hdHVyZTp0cnVlfTt2YXIgREVGQVVMVF9IQVNIX0ZVTkNUSU9OPSJzaGExIjt2YXIgREVGQVVMVF9TQUxUX0xFTkdUSD0yMDttb2R1bGUuZXhwb3J0cy5tYWtlU2NoZW1lPWZ1bmN0aW9uKGtleSxvcHRpb25zKXt2YXIgT0FFUD1yZXF1aXJlKCIuL3NjaGVtZXMiKS5wa2NzMV9vYWVwO2Z1bmN0aW9uIFNjaGVtZShrZXksb3B0aW9ucyl7dGhpcy5rZXk9a2V5O3RoaXMub3B0aW9ucz1vcHRpb25zfVNjaGVtZS5wcm90b3R5cGUuc2lnbj1mdW5jdGlvbihidWZmZXIpe3ZhciBtSGFzaD1jcnlwdC5jcmVhdGVIYXNoKHRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5oYXNofHxERUZBVUxUX0hBU0hfRlVOQ1RJT04pO21IYXNoLnVwZGF0ZShidWZmZXIpO3ZhciBlbmNvZGVkPXRoaXMuZW1zYV9wc3NfZW5jb2RlKG1IYXNoLmRpZ2VzdCgpLHRoaXMua2V5LmtleVNpemUtMSk7cmV0dXJuIHRoaXMua2V5LiRkb1ByaXZhdGUobmV3IEJpZ0ludGVnZXIoZW5jb2RlZCkpLnRvQnVmZmVyKHRoaXMua2V5LmVuY3J5cHRlZERhdGFMZW5ndGgpfTtTY2hlbWUucHJvdG90eXBlLnZlcmlmeT1mdW5jdGlvbihidWZmZXIsc2lnbmF0dXJlLHNpZ25hdHVyZV9lbmNvZGluZyl7aWYoc2lnbmF0dXJlX2VuY29kaW5nKXtzaWduYXR1cmU9QnVmZmVyLmZyb20oc2lnbmF0dXJlLHNpZ25hdHVyZV9lbmNvZGluZyl9c2lnbmF0dXJlPW5ldyBCaWdJbnRlZ2VyKHNpZ25hdHVyZSk7dmFyIGVtTGVuPU1hdGguY2VpbCgodGhpcy5rZXkua2V5U2l6ZS0xKS84KTt2YXIgbT10aGlzLmtleS4kZG9QdWJsaWMoc2lnbmF0dXJlKS50b0J1ZmZlcihlbUxlbik7dmFyIG1IYXNoPWNyeXB0LmNyZWF0ZUhhc2godGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLmhhc2h8fERFRkFVTFRfSEFTSF9GVU5DVElPTik7bUhhc2gudXBkYXRlKGJ1ZmZlcik7cmV0dXJuIHRoaXMuZW1zYV9wc3NfdmVyaWZ5KG1IYXNoLmRpZ2VzdCgpLG0sdGhpcy5rZXkua2V5U2l6ZS0xKX07U2NoZW1lLnByb3RvdHlwZS5lbXNhX3Bzc19lbmNvZGU9ZnVuY3Rpb24obUhhc2gsZW1CaXRzKXt2YXIgaGFzaD10aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OO3ZhciBtZ2Y9dGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLm1nZnx8T0FFUC5lbWVfb2FlcF9tZ2YxO3ZhciBzTGVuPXRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5zYWx0TGVuZ3RofHxERUZBVUxUX1NBTFRfTEVOR1RIO3ZhciBoTGVuPU9BRVAuZGlnZXN0TGVuZ3RoW2hhc2hdO3ZhciBlbUxlbj1NYXRoLmNlaWwoZW1CaXRzLzgpO2lmKGVtTGVuPGhMZW4rc0xlbisyKXt0aHJvdyBuZXcgRXJyb3IoIk91dHB1dCBsZW5ndGggcGFzc2VkIHRvIGVtQml0cygiK2VtQml0cysiKSBpcyB0b28gc21hbGwgZm9yIHRoZSBvcHRpb25zICIrInNwZWNpZmllZCgiK2hhc2grIiwgIitzTGVuKyIpLiBUbyBmaXggdGhpcyBpc3N1ZSBpbmNyZWFzZSB0aGUgdmFsdWUgb2YgZW1CaXRzLiAobWluaW11bSBzaXplOiAiKyg4KmhMZW4rOCpzTGVuKzkpKyIpIil9dmFyIHNhbHQ9Y3J5cHQucmFuZG9tQnl0ZXMoc0xlbik7dmFyIE1hcG9zdHJvcGhlPUJ1ZmZlci5hbGxvYyg4K2hMZW4rc0xlbik7TWFwb3N0cm9waGUuZmlsbCgwLDAsOCk7bUhhc2guY29weShNYXBvc3Ryb3BoZSw4KTtzYWx0LmNvcHkoTWFwb3N0cm9waGUsOCttSGFzaC5sZW5ndGgpO3ZhciBIPWNyeXB0LmNyZWF0ZUhhc2goaGFzaCk7SC51cGRhdGUoTWFwb3N0cm9waGUpO0g9SC5kaWdlc3QoKTt2YXIgUFM9QnVmZmVyLmFsbG9jKGVtTGVuLXNhbHQubGVuZ3RoLWhMZW4tMik7UFMuZmlsbCgwKTt2YXIgREI9QnVmZmVyLmFsbG9jKFBTLmxlbmd0aCsxK3NhbHQubGVuZ3RoKTtQUy5jb3B5KERCKTtEQltQUy5sZW5ndGhdPTE7c2FsdC5jb3B5KERCLFBTLmxlbmd0aCsxKTt2YXIgZGJNYXNrPW1nZihILERCLmxlbmd0aCxoYXNoKTt2YXIgbWFza2VkREI9QnVmZmVyLmFsbG9jKERCLmxlbmd0aCk7Zm9yKHZhciBpPTA7aTxkYk1hc2subGVuZ3RoO2krKyl7bWFza2VkREJbaV09REJbaV1eZGJNYXNrW2ldfXZhciBiaXRzPTgqZW1MZW4tZW1CaXRzO3ZhciBtYXNrPTI1NV4yNTU+PjgtYml0czw8OC1iaXRzO21hc2tlZERCWzBdPW1hc2tlZERCWzBdJm1hc2s7dmFyIEVNPUJ1ZmZlci5hbGxvYyhtYXNrZWREQi5sZW5ndGgrSC5sZW5ndGgrMSk7bWFza2VkREIuY29weShFTSwwKTtILmNvcHkoRU0sbWFza2VkREIubGVuZ3RoKTtFTVtFTS5sZW5ndGgtMV09MTg4O3JldHVybiBFTX07U2NoZW1lLnByb3RvdHlwZS5lbXNhX3Bzc192ZXJpZnk9ZnVuY3Rpb24obUhhc2gsRU0sZW1CaXRzKXt2YXIgaGFzaD10aGlzLm9wdGlvbnMuc2lnbmluZ1NjaGVtZU9wdGlvbnMuaGFzaHx8REVGQVVMVF9IQVNIX0ZVTkNUSU9OO3ZhciBtZ2Y9dGhpcy5vcHRpb25zLnNpZ25pbmdTY2hlbWVPcHRpb25zLm1nZnx8T0FFUC5lbWVfb2FlcF9tZ2YxO3ZhciBzTGVuPXRoaXMub3B0aW9ucy5zaWduaW5nU2NoZW1lT3B0aW9ucy5zYWx0TGVuZ3RofHxERUZBVUxUX1NBTFRfTEVOR1RIO3ZhciBoTGVuPU9BRVAuZGlnZXN0TGVuZ3RoW2hhc2hdO3ZhciBlbUxlbj1NYXRoLmNlaWwoZW1CaXRzLzgpO2lmKGVtTGVuPGhMZW4rc0xlbisyfHxFTVtFTS5sZW5ndGgtMV0hPTE4OCl7cmV0dXJuIGZhbHNlfXZhciBEQj1CdWZmZXIuYWxsb2MoZW1MZW4taExlbi0xKTtFTS5jb3B5KERCLDAsMCxlbUxlbi1oTGVuLTEpO3ZhciBtYXNrPTA7Zm9yKHZhciBpPTAsYml0cz04KmVtTGVuLWVtQml0cztpPGJpdHM7aSsrKXttYXNrfD0xPDw3LWl9aWYoKERCWzBdJm1hc2spIT09MCl7cmV0dXJuIGZhbHNlfXZhciBIPUVNLnNsaWNlKGVtTGVuLWhMZW4tMSxlbUxlbi0xKTt2YXIgZGJNYXNrPW1nZihILERCLmxlbmd0aCxoYXNoKTtmb3IoaT0wO2k8REIubGVuZ3RoO2krKyl7REJbaV1ePWRiTWFza1tpXX1iaXRzPTgqZW1MZW4tZW1CaXRzO21hc2s9MjU1XjI1NT4+OC1iaXRzPDw4LWJpdHM7REJbMF09REJbMF0mbWFzaztmb3IoaT0wO0RCW2ldPT09MCYmaTxEQi5sZW5ndGg7aSsrKTtpZihEQltpXSE9MSl7cmV0dXJuIGZhbHNlfXZhciBzYWx0PURCLnNsaWNlKERCLmxlbmd0aC1zTGVuKTt2YXIgTWFwb3N0cm9waGU9QnVmZmVyLmFsbG9jKDgraExlbitzTGVuKTtNYXBvc3Ryb3BoZS5maWxsKDAsMCw4KTttSGFzaC5jb3B5KE1hcG9zdHJvcGhlLDgpO3NhbHQuY29weShNYXBvc3Ryb3BoZSw4K21IYXNoLmxlbmd0aCk7dmFyIEhhcG9zdHJvcGhlPWNyeXB0LmNyZWF0ZUhhc2goaGFzaCk7SGFwb3N0cm9waGUudXBkYXRlKE1hcG9zdHJvcGhlKTtIYXBvc3Ryb3BoZT1IYXBvc3Ryb3BoZS5kaWdlc3QoKTtyZXR1cm4gSC50b1N0cmluZygiaGV4Iik9PT1IYXBvc3Ryb3BoZS50b1N0cmluZygiaGV4Iil9O3JldHVybiBuZXcgU2NoZW1lKGtleSxvcHRpb25zKX19KS5jYWxsKHRoaXMscmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyKX0seyIuLi9jcnlwdG8iOjM5LCIuLi9saWJzL2pzYm4iOjQ4LCIuL3NjaGVtZXMiOjUzLGJ1ZmZlcjoyNX1dLDUzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz17cGtjczE6cmVxdWlyZSgiLi9wa2NzMSIpLHBrY3MxX29hZXA6cmVxdWlyZSgiLi9vYWVwIikscHNzOnJlcXVpcmUoIi4vcHNzIiksaXNFbmNyeXB0aW9uOmZ1bmN0aW9uKHNjaGVtZSl7cmV0dXJuIG1vZHVsZS5leHBvcnRzW3NjaGVtZV0mJm1vZHVsZS5leHBvcnRzW3NjaGVtZV0uaXNFbmNyeXB0aW9ufSxpc1NpZ25hdHVyZTpmdW5jdGlvbihzY2hlbWUpe3JldHVybiBtb2R1bGUuZXhwb3J0c1tzY2hlbWVdJiZtb2R1bGUuZXhwb3J0c1tzY2hlbWVdLmlzU2lnbmF0dXJlfX19LHsiLi9vYWVwIjo1MCwiLi9wa2NzMSI6NTEsIi4vcHNzIjo1Mn1dLDU0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cy5saW5lYnJrPWZ1bmN0aW9uKHN0cixtYXhMZW4pe3ZhciByZXM9IiI7dmFyIGk9MDt3aGlsZShpK21heExlbjxzdHIubGVuZ3RoKXtyZXMrPXN0ci5zdWJzdHJpbmcoaSxpK21heExlbikrIlxuIjtpKz1tYXhMZW59cmV0dXJuIHJlcytzdHIuc3Vic3RyaW5nKGksc3RyLmxlbmd0aCl9O21vZHVsZS5leHBvcnRzLmRldGVjdEVudmlyb25tZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHR5cGVvZiB3aW5kb3chPT0idW5kZWZpbmVkInx8dHlwZW9mIHNlbGYhPT0idW5kZWZpbmVkIiYmISFzZWxmLnBvc3RNZXNzYWdlPyJicm93c2VyIjoibm9kZSJ9O21vZHVsZS5leHBvcnRzLmdldDMySW50RnJvbUJ1ZmZlcj1mdW5jdGlvbihidWZmZXIsb2Zmc2V0KXtvZmZzZXQ9b2Zmc2V0fHwwO3ZhciBzaXplPTA7aWYoKHNpemU9YnVmZmVyLmxlbmd0aC1vZmZzZXQpPjApe2lmKHNpemU+PTQpe3JldHVybiBidWZmZXIucmVhZFVJbnQzMkJFKG9mZnNldCl9ZWxzZXt2YXIgcmVzPTA7Zm9yKHZhciBpPW9mZnNldCtzaXplLGQ9MDtpPm9mZnNldDtpLS0sZCs9Mil7cmVzKz1idWZmZXJbaS0xXSpNYXRoLnBvdygxNixkKX1yZXR1cm4gcmVzfX1lbHNle3JldHVybiBOYU59fTttb2R1bGUuZXhwb3J0cy5fPXtpc09iamVjdDpmdW5jdGlvbih2YWx1ZSl7dmFyIHR5cGU9dHlwZW9mIHZhbHVlO3JldHVybiEhdmFsdWUmJih0eXBlPT0ib2JqZWN0Inx8dHlwZT09ImZ1bmN0aW9uIil9LGlzU3RyaW5nOmZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gdHlwZW9mIHZhbHVlPT0ic3RyaW5nInx8dmFsdWUgaW5zdGFuY2VvZiBTdHJpbmd9LGlzTnVtYmVyOmZ1bmN0aW9uKHZhbHVlKXtyZXR1cm4gdHlwZW9mIHZhbHVlPT0ibnVtYmVyInx8IWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSYmaXNGaW5pdGUodmFsdWUpfSxvbWl0OmZ1bmN0aW9uKG9iaixyZW1vdmVQcm9wKXt2YXIgbmV3T2JqPXt9O2Zvcih2YXIgcHJvcCBpbiBvYmope2lmKCFvYmouaGFzT3duUHJvcGVydHkocHJvcCl8fHByb3A9PT1yZW1vdmVQcm9wKXtjb250aW51ZX1uZXdPYmpbcHJvcF09b2JqW3Byb3BdfXJldHVybiBuZXdPYmp9fTttb2R1bGUuZXhwb3J0cy50cmltU3Vycm91bmRpbmdUZXh0PWZ1bmN0aW9uKGRhdGEsb3BlbmluZyxjbG9zaW5nKXt2YXIgdHJpbVN0YXJ0SW5kZXg9MDt2YXIgdHJpbUVuZEluZGV4PWRhdGEubGVuZ3RoO3ZhciBvcGVuaW5nQm91bmRhcnlJbmRleD1kYXRhLmluZGV4T2Yob3BlbmluZyk7aWYob3BlbmluZ0JvdW5kYXJ5SW5kZXg+PTApe3RyaW1TdGFydEluZGV4PW9wZW5pbmdCb3VuZGFyeUluZGV4K29wZW5pbmcubGVuZ3RofXZhciBjbG9zaW5nQm91bmRhcnlJbmRleD1kYXRhLmluZGV4T2YoY2xvc2luZyxvcGVuaW5nQm91bmRhcnlJbmRleCk7aWYoY2xvc2luZ0JvdW5kYXJ5SW5kZXg+PTApe3RyaW1FbmRJbmRleD1jbG9zaW5nQm91bmRhcnlJbmRleH1yZXR1cm4gZGF0YS5zdWJzdHJpbmcodHJpbVN0YXJ0SW5kZXgsdHJpbUVuZEluZGV4KX19LHt9XSw1NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO3ZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczt2YXIgaGFzT3duUHJvcGVydHk9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTt2YXIgcHJvcElzRW51bWVyYWJsZT1PYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO2Z1bmN0aW9uIHRvT2JqZWN0KHZhbCl7aWYodmFsPT09bnVsbHx8dmFsPT09dW5kZWZpbmVkKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCIpfXJldHVybiBPYmplY3QodmFsKX1mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKXt0cnl7aWYoIU9iamVjdC5hc3NpZ24pe3JldHVybiBmYWxzZX12YXIgdGVzdDE9bmV3IFN0cmluZygiYWJjIik7dGVzdDFbNV09ImRlIjtpZihPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF09PT0iNSIpe3JldHVybiBmYWxzZX12YXIgdGVzdDI9e307Zm9yKHZhciBpPTA7aTwxMDtpKyspe3Rlc3QyWyJfIitTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXT1pfXZhciBvcmRlcjI9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDIpLm1hcChmdW5jdGlvbihuKXtyZXR1cm4gdGVzdDJbbl19KTtpZihvcmRlcjIuam9pbigiIikhPT0iMDEyMzQ1Njc4OSIpe3JldHVybiBmYWxzZX12YXIgdGVzdDM9e307ImFiY2RlZmdoaWprbG1ub3BxcnN0Ii5zcGxpdCgiIikuZm9yRWFjaChmdW5jdGlvbihsZXR0ZXIpe3Rlc3QzW2xldHRlcl09bGV0dGVyfSk7aWYoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSx0ZXN0MykpLmpvaW4oIiIpIT09ImFiY2RlZmdoaWprbG1ub3BxcnN0Iil7cmV0dXJuIGZhbHNlfXJldHVybiB0cnVlfWNhdGNoKGVycil7cmV0dXJuIGZhbHNlfX1tb2R1bGUuZXhwb3J0cz1zaG91bGRVc2VOYXRpdmUoKT9PYmplY3QuYXNzaWduOmZ1bmN0aW9uKHRhcmdldCxzb3VyY2Upe3ZhciBmcm9tO3ZhciB0bz10b09iamVjdCh0YXJnZXQpO3ZhciBzeW1ib2xzO2Zvcih2YXIgcz0xO3M8YXJndW1lbnRzLmxlbmd0aDtzKyspe2Zyb209T2JqZWN0KGFyZ3VtZW50c1tzXSk7Zm9yKHZhciBrZXkgaW4gZnJvbSl7aWYoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLGtleSkpe3RvW2tleV09ZnJvbVtrZXldfX1pZihnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpe3N5bWJvbHM9Z2V0T3duUHJvcGVydHlTeW1ib2xzKGZyb20pO2Zvcih2YXIgaT0wO2k8c3ltYm9scy5sZW5ndGg7aSsrKXtpZihwcm9wSXNFbnVtZXJhYmxlLmNhbGwoZnJvbSxzeW1ib2xzW2ldKSl7dG9bc3ltYm9sc1tpXV09ZnJvbVtzeW1ib2xzW2ldXX19fX1yZXR1cm4gdG99fSx7fV0sNTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe2V4cG9ydHMucGJrZGYyPXJlcXVpcmUoIi4vbGliL2FzeW5jIik7ZXhwb3J0cy5wYmtkZjJTeW5jPXJlcXVpcmUoIi4vbGliL3N5bmMiKX0seyIuL2xpYi9hc3luYyI6NTcsIi4vbGliL3N5bmMiOjYwfV0sNTc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihwcm9jZXNzLGdsb2JhbCl7dmFyIGNoZWNrUGFyYW1ldGVycz1yZXF1aXJlKCIuL3ByZWNvbmRpdGlvbiIpO3ZhciBkZWZhdWx0RW5jb2Rpbmc9cmVxdWlyZSgiLi9kZWZhdWx0LWVuY29kaW5nIik7dmFyIHN5bmM9cmVxdWlyZSgiLi9zeW5jIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgWkVST19CVUY7dmFyIHN1YnRsZT1nbG9iYWwuY3J5cHRvJiZnbG9iYWwuY3J5cHRvLnN1YnRsZTt2YXIgdG9Ccm93c2VyPXtzaGE6IlNIQS0xIiwic2hhLTEiOiJTSEEtMSIsc2hhMToiU0hBLTEiLHNoYTI1NjoiU0hBLTI1NiIsInNoYS0yNTYiOiJTSEEtMjU2IixzaGEzODQ6IlNIQS0zODQiLCJzaGEtMzg0IjoiU0hBLTM4NCIsInNoYS01MTIiOiJTSEEtNTEyIixzaGE1MTI6IlNIQS01MTIifTt2YXIgY2hlY2tzPVtdO2Z1bmN0aW9uIGNoZWNrTmF0aXZlKGFsZ28pe2lmKGdsb2JhbC5wcm9jZXNzJiYhZ2xvYmFsLnByb2Nlc3MuYnJvd3Nlcil7cmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSl9aWYoIXN1YnRsZXx8IXN1YnRsZS5pbXBvcnRLZXl8fCFzdWJ0bGUuZGVyaXZlQml0cyl7cmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSl9aWYoY2hlY2tzW2FsZ29dIT09dW5kZWZpbmVkKXtyZXR1cm4gY2hlY2tzW2FsZ29dfVpFUk9fQlVGPVpFUk9fQlVGfHxCdWZmZXIuYWxsb2MoOCk7dmFyIHByb209YnJvd3NlclBia2RmMihaRVJPX0JVRixaRVJPX0JVRiwxMCwxMjgsYWxnbykudGhlbihmdW5jdGlvbigpe3JldHVybiB0cnVlfSkuY2F0Y2goZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2V9KTtjaGVja3NbYWxnb109cHJvbTtyZXR1cm4gcHJvbX1mdW5jdGlvbiBicm93c2VyUGJrZGYyKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxsZW5ndGgsYWxnbyl7cmV0dXJuIHN1YnRsZS5pbXBvcnRLZXkoInJhdyIscGFzc3dvcmQse25hbWU6IlBCS0RGMiJ9LGZhbHNlLFsiZGVyaXZlQml0cyJdKS50aGVuKGZ1bmN0aW9uKGtleSl7cmV0dXJuIHN1YnRsZS5kZXJpdmVCaXRzKHtuYW1lOiJQQktERjIiLHNhbHQ6c2FsdCxpdGVyYXRpb25zOml0ZXJhdGlvbnMsaGFzaDp7bmFtZTphbGdvfX0sa2V5LGxlbmd0aDw8Myl9KS50aGVuKGZ1bmN0aW9uKHJlcyl7cmV0dXJuIEJ1ZmZlci5mcm9tKHJlcyl9KX1mdW5jdGlvbiByZXNvbHZlUHJvbWlzZShwcm9taXNlLGNhbGxiYWNrKXtwcm9taXNlLnRoZW4oZnVuY3Rpb24ob3V0KXtwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7Y2FsbGJhY2sobnVsbCxvdXQpfSl9LGZ1bmN0aW9uKGUpe3Byb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXtjYWxsYmFjayhlKX0pfSl9bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24ocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGtleWxlbixkaWdlc3QsY2FsbGJhY2spe2lmKHR5cGVvZiBkaWdlc3Q9PT0iZnVuY3Rpb24iKXtjYWxsYmFjaz1kaWdlc3Q7ZGlnZXN0PXVuZGVmaW5lZH1kaWdlc3Q9ZGlnZXN0fHwic2hhMSI7dmFyIGFsZ289dG9Ccm93c2VyW2RpZ2VzdC50b0xvd2VyQ2FzZSgpXTtpZighYWxnb3x8dHlwZW9mIGdsb2JhbC5Qcm9taXNlIT09ImZ1bmN0aW9uIil7cmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXt2YXIgb3V0O3RyeXtvdXQ9c3luYyhwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsa2V5bGVuLGRpZ2VzdCl9Y2F0Y2goZSl7cmV0dXJuIGNhbGxiYWNrKGUpfWNhbGxiYWNrKG51bGwsb3V0KX0pfWNoZWNrUGFyYW1ldGVycyhwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsa2V5bGVuKTtpZih0eXBlb2YgY2FsbGJhY2shPT0iZnVuY3Rpb24iKXRocm93IG5ldyBFcnJvcigiTm8gY2FsbGJhY2sgcHJvdmlkZWQgdG8gcGJrZGYyIik7aWYoIUJ1ZmZlci5pc0J1ZmZlcihwYXNzd29yZCkpcGFzc3dvcmQ9QnVmZmVyLmZyb20ocGFzc3dvcmQsZGVmYXVsdEVuY29kaW5nKTtpZighQnVmZmVyLmlzQnVmZmVyKHNhbHQpKXNhbHQ9QnVmZmVyLmZyb20oc2FsdCxkZWZhdWx0RW5jb2RpbmcpO3Jlc29sdmVQcm9taXNlKGNoZWNrTmF0aXZlKGFsZ28pLnRoZW4oZnVuY3Rpb24ocmVzcCl7aWYocmVzcClyZXR1cm4gYnJvd3NlclBia2RmMihwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsa2V5bGVuLGFsZ28pO3JldHVybiBzeW5jKHBhc3N3b3JkLHNhbHQsaXRlcmF0aW9ucyxrZXlsZW4sZGlnZXN0KX0pLGNhbGxiYWNrKX19KS5jYWxsKHRoaXMscmVxdWlyZSgiX3Byb2Nlc3MiKSx0eXBlb2YgZ2xvYmFsIT09InVuZGVmaW5lZCI/Z2xvYmFsOnR5cGVvZiBzZWxmIT09InVuZGVmaW5lZCI/c2VsZjp0eXBlb2Ygd2luZG93IT09InVuZGVmaW5lZCI/d2luZG93Ont9KX0seyIuL2RlZmF1bHQtZW5jb2RpbmciOjU4LCIuL3ByZWNvbmRpdGlvbiI6NTksIi4vc3luYyI6NjAsX3Byb2Nlc3M6NjIsInNhZmUtYnVmZmVyIjo3OH1dLDU4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24ocHJvY2Vzcyl7dmFyIGRlZmF1bHRFbmNvZGluZztpZihwcm9jZXNzLmJyb3dzZXIpe2RlZmF1bHRFbmNvZGluZz0idXRmLTgifWVsc2V7dmFyIHBWZXJzaW9uTWFqb3I9cGFyc2VJbnQocHJvY2Vzcy52ZXJzaW9uLnNwbGl0KCIuIilbMF0uc2xpY2UoMSksMTApO2RlZmF1bHRFbmNvZGluZz1wVmVyc2lvbk1ham9yPj02PyJ1dGYtOCI6ImJpbmFyeSJ9bW9kdWxlLmV4cG9ydHM9ZGVmYXVsdEVuY29kaW5nfSkuY2FsbCh0aGlzLHJlcXVpcmUoIl9wcm9jZXNzIikpfSx7X3Byb2Nlc3M6NjJ9XSw1OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKEJ1ZmZlcil7dmFyIE1BWF9BTExPQz1NYXRoLnBvdygyLDMwKS0xO2Z1bmN0aW9uIGNoZWNrQnVmZmVyKGJ1ZixuYW1lKXtpZih0eXBlb2YgYnVmIT09InN0cmluZyImJiFCdWZmZXIuaXNCdWZmZXIoYnVmKSl7dGhyb3cgbmV3IFR5cGVFcnJvcihuYW1lKyIgbXVzdCBiZSBhIGJ1ZmZlciBvciBzdHJpbmciKX19bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24ocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGtleWxlbil7Y2hlY2tCdWZmZXIocGFzc3dvcmQsIlBhc3N3b3JkIik7Y2hlY2tCdWZmZXIoc2FsdCwiU2FsdCIpO2lmKHR5cGVvZiBpdGVyYXRpb25zIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoIkl0ZXJhdGlvbnMgbm90IGEgbnVtYmVyIil9aWYoaXRlcmF0aW9uczwwKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJCYWQgaXRlcmF0aW9ucyIpfWlmKHR5cGVvZiBrZXlsZW4hPT0ibnVtYmVyIil7dGhyb3cgbmV3IFR5cGVFcnJvcigiS2V5IGxlbmd0aCBub3QgYSBudW1iZXIiKX1pZihrZXlsZW48MHx8a2V5bGVuPk1BWF9BTExPQ3x8a2V5bGVuIT09a2V5bGVuKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJCYWQga2V5IGxlbmd0aCIpfX19KS5jYWxsKHRoaXMse2lzQnVmZmVyOnJlcXVpcmUoIi4uLy4uL2lzLWJ1ZmZlci9pbmRleC5qcyIpfSl9LHsiLi4vLi4vaXMtYnVmZmVyL2luZGV4LmpzIjozNX1dLDYwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgbWQ1PXJlcXVpcmUoImNyZWF0ZS1oYXNoL21kNSIpO3ZhciBSSVBFTUQxNjA9cmVxdWlyZSgicmlwZW1kMTYwIik7dmFyIHNoYT1yZXF1aXJlKCJzaGEuanMiKTt2YXIgY2hlY2tQYXJhbWV0ZXJzPXJlcXVpcmUoIi4vcHJlY29uZGl0aW9uIik7dmFyIGRlZmF1bHRFbmNvZGluZz1yZXF1aXJlKCIuL2RlZmF1bHQtZW5jb2RpbmciKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBaRVJPUz1CdWZmZXIuYWxsb2MoMTI4KTt2YXIgc2l6ZXM9e21kNToxNixzaGExOjIwLHNoYTIyNDoyOCxzaGEyNTY6MzIsc2hhMzg0OjQ4LHNoYTUxMjo2NCxybWQxNjA6MjAscmlwZW1kMTYwOjIwfTtmdW5jdGlvbiBIbWFjKGFsZyxrZXksc2FsdExlbil7dmFyIGhhc2g9Z2V0RGlnZXN0KGFsZyk7dmFyIGJsb2Nrc2l6ZT1hbGc9PT0ic2hhNTEyInx8YWxnPT09InNoYTM4NCI/MTI4OjY0O2lmKGtleS5sZW5ndGg+YmxvY2tzaXplKXtrZXk9aGFzaChrZXkpfWVsc2UgaWYoa2V5Lmxlbmd0aDxibG9ja3NpemUpe2tleT1CdWZmZXIuY29uY2F0KFtrZXksWkVST1NdLGJsb2Nrc2l6ZSl9dmFyIGlwYWQ9QnVmZmVyLmFsbG9jVW5zYWZlKGJsb2Nrc2l6ZStzaXplc1thbGddKTt2YXIgb3BhZD1CdWZmZXIuYWxsb2NVbnNhZmUoYmxvY2tzaXplK3NpemVzW2FsZ10pO2Zvcih2YXIgaT0wO2k8YmxvY2tzaXplO2krKyl7aXBhZFtpXT1rZXlbaV1eNTQ7b3BhZFtpXT1rZXlbaV1eOTJ9dmFyIGlwYWQxPUJ1ZmZlci5hbGxvY1Vuc2FmZShibG9ja3NpemUrc2FsdExlbis0KTtpcGFkLmNvcHkoaXBhZDEsMCwwLGJsb2Nrc2l6ZSk7dGhpcy5pcGFkMT1pcGFkMTt0aGlzLmlwYWQyPWlwYWQ7dGhpcy5vcGFkPW9wYWQ7dGhpcy5hbGc9YWxnO3RoaXMuYmxvY2tzaXplPWJsb2Nrc2l6ZTt0aGlzLmhhc2g9aGFzaDt0aGlzLnNpemU9c2l6ZXNbYWxnXX1IbWFjLnByb3RvdHlwZS5ydW49ZnVuY3Rpb24oZGF0YSxpcGFkKXtkYXRhLmNvcHkoaXBhZCx0aGlzLmJsb2Nrc2l6ZSk7dmFyIGg9dGhpcy5oYXNoKGlwYWQpO2guY29weSh0aGlzLm9wYWQsdGhpcy5ibG9ja3NpemUpO3JldHVybiB0aGlzLmhhc2godGhpcy5vcGFkKX07ZnVuY3Rpb24gZ2V0RGlnZXN0KGFsZyl7ZnVuY3Rpb24gc2hhRnVuYyhkYXRhKXtyZXR1cm4gc2hhKGFsZykudXBkYXRlKGRhdGEpLmRpZ2VzdCgpfWZ1bmN0aW9uIHJtZDE2MEZ1bmMoZGF0YSl7cmV0dXJuKG5ldyBSSVBFTUQxNjApLnVwZGF0ZShkYXRhKS5kaWdlc3QoKX1pZihhbGc9PT0icm1kMTYwInx8YWxnPT09InJpcGVtZDE2MCIpcmV0dXJuIHJtZDE2MEZ1bmM7aWYoYWxnPT09Im1kNSIpcmV0dXJuIG1kNTtyZXR1cm4gc2hhRnVuY31mdW5jdGlvbiBwYmtkZjIocGFzc3dvcmQsc2FsdCxpdGVyYXRpb25zLGtleWxlbixkaWdlc3Qpe2NoZWNrUGFyYW1ldGVycyhwYXNzd29yZCxzYWx0LGl0ZXJhdGlvbnMsa2V5bGVuKTtpZighQnVmZmVyLmlzQnVmZmVyKHBhc3N3b3JkKSlwYXNzd29yZD1CdWZmZXIuZnJvbShwYXNzd29yZCxkZWZhdWx0RW5jb2RpbmcpO2lmKCFCdWZmZXIuaXNCdWZmZXIoc2FsdCkpc2FsdD1CdWZmZXIuZnJvbShzYWx0LGRlZmF1bHRFbmNvZGluZyk7ZGlnZXN0PWRpZ2VzdHx8InNoYTEiO3ZhciBobWFjPW5ldyBIbWFjKGRpZ2VzdCxwYXNzd29yZCxzYWx0Lmxlbmd0aCk7dmFyIERLPUJ1ZmZlci5hbGxvY1Vuc2FmZShrZXlsZW4pO3ZhciBibG9jazE9QnVmZmVyLmFsbG9jVW5zYWZlKHNhbHQubGVuZ3RoKzQpO3NhbHQuY29weShibG9jazEsMCwwLHNhbHQubGVuZ3RoKTt2YXIgZGVzdFBvcz0wO3ZhciBoTGVuPXNpemVzW2RpZ2VzdF07dmFyIGw9TWF0aC5jZWlsKGtleWxlbi9oTGVuKTtmb3IodmFyIGk9MTtpPD1sO2krKyl7YmxvY2sxLndyaXRlVUludDMyQkUoaSxzYWx0Lmxlbmd0aCk7dmFyIFQ9aG1hYy5ydW4oYmxvY2sxLGhtYWMuaXBhZDEpO3ZhciBVPVQ7Zm9yKHZhciBqPTE7ajxpdGVyYXRpb25zO2orKyl7VT1obWFjLnJ1bihVLGhtYWMuaXBhZDIpO2Zvcih2YXIgaz0wO2s8aExlbjtrKyspVFtrXV49VVtrXX1ULmNvcHkoREssZGVzdFBvcyk7ZGVzdFBvcys9aExlbn1yZXR1cm4gREt9bW9kdWxlLmV4cG9ydHM9cGJrZGYyfSx7Ii4vZGVmYXVsdC1lbmNvZGluZyI6NTgsIi4vcHJlY29uZGl0aW9uIjo1OSwiY3JlYXRlLWhhc2gvbWQ1IjozMCxyaXBlbWQxNjA6NzcsInNhZmUtYnVmZmVyIjo3OCwic2hhLmpzIjo5MH1dLDYxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24ocHJvY2Vzcyl7InVzZSBzdHJpY3QiO2lmKCFwcm9jZXNzLnZlcnNpb258fHByb2Nlc3MudmVyc2lvbi5pbmRleE9mKCJ2MC4iKT09PTB8fHByb2Nlc3MudmVyc2lvbi5pbmRleE9mKCJ2MS4iKT09PTAmJnByb2Nlc3MudmVyc2lvbi5pbmRleE9mKCJ2MS44LiIpIT09MCl7bW9kdWxlLmV4cG9ydHM9e25leHRUaWNrOm5leHRUaWNrfX1lbHNle21vZHVsZS5leHBvcnRzPXByb2Nlc3N9ZnVuY3Rpb24gbmV4dFRpY2soZm4sYXJnMSxhcmcyLGFyZzMpe2lmKHR5cGVvZiBmbiE9PSJmdW5jdGlvbiIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJyJjYWxsYmFjayIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyl9dmFyIGxlbj1hcmd1bWVudHMubGVuZ3RoO3ZhciBhcmdzLGk7c3dpdGNoKGxlbil7Y2FzZSAwOmNhc2UgMTpyZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmbik7Y2FzZSAyOnJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uIGFmdGVyVGlja09uZSgpe2ZuLmNhbGwobnVsbCxhcmcxKX0pO2Nhc2UgMzpyZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiBhZnRlclRpY2tUd28oKXtmbi5jYWxsKG51bGwsYXJnMSxhcmcyKX0pO2Nhc2UgNDpyZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiBhZnRlclRpY2tUaHJlZSgpe2ZuLmNhbGwobnVsbCxhcmcxLGFyZzIsYXJnMyl9KTtkZWZhdWx0OmFyZ3M9bmV3IEFycmF5KGxlbi0xKTtpPTA7d2hpbGUoaTxhcmdzLmxlbmd0aCl7YXJnc1tpKytdPWFyZ3VtZW50c1tpXX1yZXR1cm4gcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiBhZnRlclRpY2soKXtmbi5hcHBseShudWxsLGFyZ3MpfSl9fX0pLmNhbGwodGhpcyxyZXF1aXJlKCJfcHJvY2VzcyIpKX0se19wcm9jZXNzOjYyfV0sNjI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBwcm9jZXNzPW1vZHVsZS5leHBvcnRzPXt9O3ZhciBjYWNoZWRTZXRUaW1lb3V0O3ZhciBjYWNoZWRDbGVhclRpbWVvdXQ7ZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpe3Rocm93IG5ldyBFcnJvcigic2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCIpfWZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQoKXt0aHJvdyBuZXcgRXJyb3IoImNsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCIpfShmdW5jdGlvbigpe3RyeXtpZih0eXBlb2Ygc2V0VGltZW91dD09PSJmdW5jdGlvbiIpe2NhY2hlZFNldFRpbWVvdXQ9c2V0VGltZW91dH1lbHNle2NhY2hlZFNldFRpbWVvdXQ9ZGVmYXVsdFNldFRpbW91dH19Y2F0Y2goZSl7Y2FjaGVkU2V0VGltZW91dD1kZWZhdWx0U2V0VGltb3V0fXRyeXtpZih0eXBlb2YgY2xlYXJUaW1lb3V0PT09ImZ1bmN0aW9uIil7Y2FjaGVkQ2xlYXJUaW1lb3V0PWNsZWFyVGltZW91dH1lbHNle2NhY2hlZENsZWFyVGltZW91dD1kZWZhdWx0Q2xlYXJUaW1lb3V0fX1jYXRjaChlKXtjYWNoZWRDbGVhclRpbWVvdXQ9ZGVmYXVsdENsZWFyVGltZW91dH19KSgpO2Z1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKXtpZihjYWNoZWRTZXRUaW1lb3V0PT09c2V0VGltZW91dCl7cmV0dXJuIHNldFRpbWVvdXQoZnVuLDApfWlmKChjYWNoZWRTZXRUaW1lb3V0PT09ZGVmYXVsdFNldFRpbW91dHx8IWNhY2hlZFNldFRpbWVvdXQpJiZzZXRUaW1lb3V0KXtjYWNoZWRTZXRUaW1lb3V0PXNldFRpbWVvdXQ7cmV0dXJuIHNldFRpbWVvdXQoZnVuLDApfXRyeXtyZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sMCl9Y2F0Y2goZSl7dHJ5e3JldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCxmdW4sMCl9Y2F0Y2goZSl7cmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLGZ1biwwKX19fWZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpe2lmKGNhY2hlZENsZWFyVGltZW91dD09PWNsZWFyVGltZW91dCl7cmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpfWlmKChjYWNoZWRDbGVhclRpbWVvdXQ9PT1kZWZhdWx0Q2xlYXJUaW1lb3V0fHwhY2FjaGVkQ2xlYXJUaW1lb3V0KSYmY2xlYXJUaW1lb3V0KXtjYWNoZWRDbGVhclRpbWVvdXQ9Y2xlYXJUaW1lb3V0O3JldHVybiBjbGVhclRpbWVvdXQobWFya2VyKX10cnl7cmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpfWNhdGNoKGUpe3RyeXtyZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCxtYXJrZXIpfWNhdGNoKGUpe3JldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLG1hcmtlcil9fX12YXIgcXVldWU9W107dmFyIGRyYWluaW5nPWZhbHNlO3ZhciBjdXJyZW50UXVldWU7dmFyIHF1ZXVlSW5kZXg9LTE7ZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCl7aWYoIWRyYWluaW5nfHwhY3VycmVudFF1ZXVlKXtyZXR1cm59ZHJhaW5pbmc9ZmFsc2U7aWYoY3VycmVudFF1ZXVlLmxlbmd0aCl7cXVldWU9Y3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSl9ZWxzZXtxdWV1ZUluZGV4PS0xfWlmKHF1ZXVlLmxlbmd0aCl7ZHJhaW5RdWV1ZSgpfX1mdW5jdGlvbiBkcmFpblF1ZXVlKCl7aWYoZHJhaW5pbmcpe3JldHVybn12YXIgdGltZW91dD1ydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7ZHJhaW5pbmc9dHJ1ZTt2YXIgbGVuPXF1ZXVlLmxlbmd0aDt3aGlsZShsZW4pe2N1cnJlbnRRdWV1ZT1xdWV1ZTtxdWV1ZT1bXTt3aGlsZSgrK3F1ZXVlSW5kZXg8bGVuKXtpZihjdXJyZW50UXVldWUpe2N1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKX19cXVldWVJbmRleD0tMTtsZW49cXVldWUubGVuZ3RofWN1cnJlbnRRdWV1ZT1udWxsO2RyYWluaW5nPWZhbHNlO3J1bkNsZWFyVGltZW91dCh0aW1lb3V0KX1wcm9jZXNzLm5leHRUaWNrPWZ1bmN0aW9uKGZ1bil7dmFyIGFyZ3M9bmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgtMSk7aWYoYXJndW1lbnRzLmxlbmd0aD4xKXtmb3IodmFyIGk9MTtpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXthcmdzW2ktMV09YXJndW1lbnRzW2ldfX1xdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1bixhcmdzKSk7aWYocXVldWUubGVuZ3RoPT09MSYmIWRyYWluaW5nKXtydW5UaW1lb3V0KGRyYWluUXVldWUpfX07ZnVuY3Rpb24gSXRlbShmdW4sYXJyYXkpe3RoaXMuZnVuPWZ1bjt0aGlzLmFycmF5PWFycmF5fUl0ZW0ucHJvdG90eXBlLnJ1bj1mdW5jdGlvbigpe3RoaXMuZnVuLmFwcGx5KG51bGwsdGhpcy5hcnJheSl9O3Byb2Nlc3MudGl0bGU9ImJyb3dzZXIiO3Byb2Nlc3MuYnJvd3Nlcj10cnVlO3Byb2Nlc3MuZW52PXt9O3Byb2Nlc3MuYXJndj1bXTtwcm9jZXNzLnZlcnNpb249IiI7cHJvY2Vzcy52ZXJzaW9ucz17fTtmdW5jdGlvbiBub29wKCl7fXByb2Nlc3Mub249bm9vcDtwcm9jZXNzLmFkZExpc3RlbmVyPW5vb3A7cHJvY2Vzcy5vbmNlPW5vb3A7cHJvY2Vzcy5vZmY9bm9vcDtwcm9jZXNzLnJlbW92ZUxpc3RlbmVyPW5vb3A7cHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnM9bm9vcDtwcm9jZXNzLmVtaXQ9bm9vcDtwcm9jZXNzLnByZXBlbmRMaXN0ZW5lcj1ub29wO3Byb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lcj1ub29wO3Byb2Nlc3MubGlzdGVuZXJzPWZ1bmN0aW9uKG5hbWUpe3JldHVybltdfTtwcm9jZXNzLmJpbmRpbmc9ZnVuY3Rpb24obmFtZSl7dGhyb3cgbmV3IEVycm9yKCJwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCIpfTtwcm9jZXNzLmN3ZD1mdW5jdGlvbigpe3JldHVybiIvIn07cHJvY2Vzcy5jaGRpcj1mdW5jdGlvbihkaXIpe3Rocm93IG5ldyBFcnJvcigicHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkIil9O3Byb2Nlc3MudW1hc2s9ZnVuY3Rpb24oKXtyZXR1cm4gMH19LHt9XSw2MzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MsZ2xvYmFsKXsidXNlIHN0cmljdCI7dmFyIE1BWF9CWVRFUz02NTUzNjt2YXIgTUFYX1VJTlQzMj00Mjk0OTY3Mjk1O2Z1bmN0aW9uIG9sZEJyb3dzZXIoKXt0aHJvdyBuZXcgRXJyb3IoIlNlY3VyZSByYW5kb20gbnVtYmVyIGdlbmVyYXRpb24gaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXIuXG5Vc2UgQ2hyb21lLCBGaXJlZm94IG9yIEludGVybmV0IEV4cGxvcmVyIDExIil9dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgY3J5cHRvPWdsb2JhbC5jcnlwdG98fGdsb2JhbC5tc0NyeXB0bztpZihjcnlwdG8mJmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpe21vZHVsZS5leHBvcnRzPXJhbmRvbUJ5dGVzfWVsc2V7bW9kdWxlLmV4cG9ydHM9b2xkQnJvd3Nlcn1mdW5jdGlvbiByYW5kb21CeXRlcyhzaXplLGNiKXtpZihzaXplPk1BWF9VSU5UMzIpdGhyb3cgbmV3IFJhbmdlRXJyb3IoInJlcXVlc3RlZCB0b28gbWFueSByYW5kb20gYnl0ZXMiKTt2YXIgYnl0ZXM9QnVmZmVyLmFsbG9jVW5zYWZlKHNpemUpO2lmKHNpemU+MCl7aWYoc2l6ZT5NQVhfQllURVMpe2Zvcih2YXIgZ2VuZXJhdGVkPTA7Z2VuZXJhdGVkPHNpemU7Z2VuZXJhdGVkKz1NQVhfQllURVMpe2NyeXB0by5nZXRSYW5kb21WYWx1ZXMoYnl0ZXMuc2xpY2UoZ2VuZXJhdGVkLGdlbmVyYXRlZCtNQVhfQllURVMpKX19ZWxzZXtjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGJ5dGVzKX19aWYodHlwZW9mIGNiPT09ImZ1bmN0aW9uIil7cmV0dXJuIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXtjYihudWxsLGJ5dGVzKX0pfXJldHVybiBieXRlc319KS5jYWxsKHRoaXMscmVxdWlyZSgiX3Byb2Nlc3MiKSx0eXBlb2YgZ2xvYmFsIT09InVuZGVmaW5lZCI/Z2xvYmFsOnR5cGVvZiBzZWxmIT09InVuZGVmaW5lZCI/c2VsZjp0eXBlb2Ygd2luZG93IT09InVuZGVmaW5lZCI/d2luZG93Ont9KX0se19wcm9jZXNzOjYyLCJzYWZlLWJ1ZmZlciI6Nzh9XSw2NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgiLi9saWIvX3N0cmVhbV9kdXBsZXguanMiKX0seyIuL2xpYi9fc3RyZWFtX2R1cGxleC5qcyI6NjV9XSw2NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO3ZhciBwbmE9cmVxdWlyZSgicHJvY2Vzcy1uZXh0aWNrLWFyZ3MiKTt2YXIgb2JqZWN0S2V5cz1PYmplY3Qua2V5c3x8ZnVuY3Rpb24ob2JqKXt2YXIga2V5cz1bXTtmb3IodmFyIGtleSBpbiBvYmope2tleXMucHVzaChrZXkpfXJldHVybiBrZXlzfTttb2R1bGUuZXhwb3J0cz1EdXBsZXg7dmFyIHV0aWw9cmVxdWlyZSgiY29yZS11dGlsLWlzIik7dXRpbC5pbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBSZWFkYWJsZT1yZXF1aXJlKCIuL19zdHJlYW1fcmVhZGFibGUiKTt2YXIgV3JpdGFibGU9cmVxdWlyZSgiLi9fc3RyZWFtX3dyaXRhYmxlIik7dXRpbC5pbmhlcml0cyhEdXBsZXgsUmVhZGFibGUpO3t2YXIga2V5cz1vYmplY3RLZXlzKFdyaXRhYmxlLnByb3RvdHlwZSk7Zm9yKHZhciB2PTA7djxrZXlzLmxlbmd0aDt2Kyspe3ZhciBtZXRob2Q9a2V5c1t2XTtpZighRHVwbGV4LnByb3RvdHlwZVttZXRob2RdKUR1cGxleC5wcm90b3R5cGVbbWV0aG9kXT1Xcml0YWJsZS5wcm90b3R5cGVbbWV0aG9kXX19ZnVuY3Rpb24gRHVwbGV4KG9wdGlvbnMpe2lmKCEodGhpcyBpbnN0YW5jZW9mIER1cGxleCkpcmV0dXJuIG5ldyBEdXBsZXgob3B0aW9ucyk7UmVhZGFibGUuY2FsbCh0aGlzLG9wdGlvbnMpO1dyaXRhYmxlLmNhbGwodGhpcyxvcHRpb25zKTtpZihvcHRpb25zJiZvcHRpb25zLnJlYWRhYmxlPT09ZmFsc2UpdGhpcy5yZWFkYWJsZT1mYWxzZTtpZihvcHRpb25zJiZvcHRpb25zLndyaXRhYmxlPT09ZmFsc2UpdGhpcy53cml0YWJsZT1mYWxzZTt0aGlzLmFsbG93SGFsZk9wZW49dHJ1ZTtpZihvcHRpb25zJiZvcHRpb25zLmFsbG93SGFsZk9wZW49PT1mYWxzZSl0aGlzLmFsbG93SGFsZk9wZW49ZmFsc2U7dGhpcy5vbmNlKCJlbmQiLG9uZW5kKX1PYmplY3QuZGVmaW5lUHJvcGVydHkoRHVwbGV4LnByb3RvdHlwZSwid3JpdGFibGVIaWdoV2F0ZXJNYXJrIix7ZW51bWVyYWJsZTpmYWxzZSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZS5oaWdoV2F0ZXJNYXJrfX0pO2Z1bmN0aW9uIG9uZW5kKCl7aWYodGhpcy5hbGxvd0hhbGZPcGVufHx0aGlzLl93cml0YWJsZVN0YXRlLmVuZGVkKXJldHVybjtwbmEubmV4dFRpY2sob25FbmROVCx0aGlzKX1mdW5jdGlvbiBvbkVuZE5UKHNlbGYpe3NlbGYuZW5kKCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KER1cGxleC5wcm90b3R5cGUsImRlc3Ryb3llZCIse2dldDpmdW5jdGlvbigpe2lmKHRoaXMuX3JlYWRhYmxlU3RhdGU9PT11bmRlZmluZWR8fHRoaXMuX3dyaXRhYmxlU3RhdGU9PT11bmRlZmluZWQpe3JldHVybiBmYWxzZX1yZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQmJnRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkfSxzZXQ6ZnVuY3Rpb24odmFsdWUpe2lmKHRoaXMuX3JlYWRhYmxlU3RhdGU9PT11bmRlZmluZWR8fHRoaXMuX3dyaXRhYmxlU3RhdGU9PT11bmRlZmluZWQpe3JldHVybn10aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZD12YWx1ZTt0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZD12YWx1ZX19KTtEdXBsZXgucHJvdG90eXBlLl9kZXN0cm95PWZ1bmN0aW9uKGVycixjYil7dGhpcy5wdXNoKG51bGwpO3RoaXMuZW5kKCk7cG5hLm5leHRUaWNrKGNiLGVycil9fSx7Ii4vX3N0cmVhbV9yZWFkYWJsZSI6NjcsIi4vX3N0cmVhbV93cml0YWJsZSI6NjksImNvcmUtdXRpbC1pcyI6MjgsaW5oZXJpdHM6MzQsInByb2Nlc3MtbmV4dGljay1hcmdzIjo2MX1dLDY2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7bW9kdWxlLmV4cG9ydHM9UGFzc1Rocm91Z2g7dmFyIFRyYW5zZm9ybT1yZXF1aXJlKCIuL19zdHJlYW1fdHJhbnNmb3JtIik7dmFyIHV0aWw9cmVxdWlyZSgiY29yZS11dGlsLWlzIik7dXRpbC5pbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3V0aWwuaW5oZXJpdHMoUGFzc1Rocm91Z2gsVHJhbnNmb3JtKTtmdW5jdGlvbiBQYXNzVGhyb3VnaChvcHRpb25zKXtpZighKHRoaXMgaW5zdGFuY2VvZiBQYXNzVGhyb3VnaCkpcmV0dXJuIG5ldyBQYXNzVGhyb3VnaChvcHRpb25zKTtUcmFuc2Zvcm0uY2FsbCh0aGlzLG9wdGlvbnMpfVBhc3NUaHJvdWdoLnByb3RvdHlwZS5fdHJhbnNmb3JtPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXtjYihudWxsLGNodW5rKX19LHsiLi9fc3RyZWFtX3RyYW5zZm9ybSI6NjgsImNvcmUtdXRpbC1pcyI6MjgsaW5oZXJpdHM6MzR9XSw2NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHByb2Nlc3MsZ2xvYmFsKXsidXNlIHN0cmljdCI7dmFyIHBuYT1yZXF1aXJlKCJwcm9jZXNzLW5leHRpY2stYXJncyIpO21vZHVsZS5leHBvcnRzPVJlYWRhYmxlO3ZhciBpc0FycmF5PXJlcXVpcmUoImlzYXJyYXkiKTt2YXIgRHVwbGV4O1JlYWRhYmxlLlJlYWRhYmxlU3RhdGU9UmVhZGFibGVTdGF0ZTt2YXIgRUU9cmVxdWlyZSgiZXZlbnRzIikuRXZlbnRFbWl0dGVyO3ZhciBFRWxpc3RlbmVyQ291bnQ9ZnVuY3Rpb24oZW1pdHRlcix0eXBlKXtyZXR1cm4gZW1pdHRlci5saXN0ZW5lcnModHlwZSkubGVuZ3RofTt2YXIgU3RyZWFtPXJlcXVpcmUoIi4vaW50ZXJuYWwvc3RyZWFtcy9zdHJlYW0iKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBPdXJVaW50OEFycmF5PWdsb2JhbC5VaW50OEFycmF5fHxmdW5jdGlvbigpe307ZnVuY3Rpb24gX3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuayl7cmV0dXJuIEJ1ZmZlci5mcm9tKGNodW5rKX1mdW5jdGlvbiBfaXNVaW50OEFycmF5KG9iail7cmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopfHxvYmogaW5zdGFuY2VvZiBPdXJVaW50OEFycmF5fXZhciB1dGlsPXJlcXVpcmUoImNvcmUtdXRpbC1pcyIpO3V0aWwuaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgZGVidWdVdGlsPXJlcXVpcmUoInV0aWwiKTt2YXIgZGVidWc9dm9pZCAwO2lmKGRlYnVnVXRpbCYmZGVidWdVdGlsLmRlYnVnbG9nKXtkZWJ1Zz1kZWJ1Z1V0aWwuZGVidWdsb2coInN0cmVhbSIpfWVsc2V7ZGVidWc9ZnVuY3Rpb24oKXt9fXZhciBCdWZmZXJMaXN0PXJlcXVpcmUoIi4vaW50ZXJuYWwvc3RyZWFtcy9CdWZmZXJMaXN0Iik7dmFyIGRlc3Ryb3lJbXBsPXJlcXVpcmUoIi4vaW50ZXJuYWwvc3RyZWFtcy9kZXN0cm95Iik7dmFyIFN0cmluZ0RlY29kZXI7dXRpbC5pbmhlcml0cyhSZWFkYWJsZSxTdHJlYW0pO3ZhciBrUHJveHlFdmVudHM9WyJlcnJvciIsImNsb3NlIiwiZGVzdHJveSIsInBhdXNlIiwicmVzdW1lIl07ZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKGVtaXR0ZXIsZXZlbnQsZm4pe2lmKHR5cGVvZiBlbWl0dGVyLnByZXBlbmRMaXN0ZW5lcj09PSJmdW5jdGlvbiIpcmV0dXJuIGVtaXR0ZXIucHJlcGVuZExpc3RlbmVyKGV2ZW50LGZuKTtpZighZW1pdHRlci5fZXZlbnRzfHwhZW1pdHRlci5fZXZlbnRzW2V2ZW50XSllbWl0dGVyLm9uKGV2ZW50LGZuKTtlbHNlIGlmKGlzQXJyYXkoZW1pdHRlci5fZXZlbnRzW2V2ZW50XSkpZW1pdHRlci5fZXZlbnRzW2V2ZW50XS51bnNoaWZ0KGZuKTtlbHNlIGVtaXR0ZXIuX2V2ZW50c1tldmVudF09W2ZuLGVtaXR0ZXIuX2V2ZW50c1tldmVudF1dfWZ1bmN0aW9uIFJlYWRhYmxlU3RhdGUob3B0aW9ucyxzdHJlYW0pe0R1cGxleD1EdXBsZXh8fHJlcXVpcmUoIi4vX3N0cmVhbV9kdXBsZXgiKTtvcHRpb25zPW9wdGlvbnN8fHt9O3ZhciBpc0R1cGxleD1zdHJlYW0gaW5zdGFuY2VvZiBEdXBsZXg7dGhpcy5vYmplY3RNb2RlPSEhb3B0aW9ucy5vYmplY3RNb2RlO2lmKGlzRHVwbGV4KXRoaXMub2JqZWN0TW9kZT10aGlzLm9iamVjdE1vZGV8fCEhb3B0aW9ucy5yZWFkYWJsZU9iamVjdE1vZGU7dmFyIGh3bT1vcHRpb25zLmhpZ2hXYXRlck1hcms7dmFyIHJlYWRhYmxlSHdtPW9wdGlvbnMucmVhZGFibGVIaWdoV2F0ZXJNYXJrO3ZhciBkZWZhdWx0SHdtPXRoaXMub2JqZWN0TW9kZT8xNjoxNioxMDI0O2lmKGh3bXx8aHdtPT09MCl0aGlzLmhpZ2hXYXRlck1hcms9aHdtO2Vsc2UgaWYoaXNEdXBsZXgmJihyZWFkYWJsZUh3bXx8cmVhZGFibGVId209PT0wKSl0aGlzLmhpZ2hXYXRlck1hcms9cmVhZGFibGVId207ZWxzZSB0aGlzLmhpZ2hXYXRlck1hcms9ZGVmYXVsdEh3bTt0aGlzLmhpZ2hXYXRlck1hcms9TWF0aC5mbG9vcih0aGlzLmhpZ2hXYXRlck1hcmspO3RoaXMuYnVmZmVyPW5ldyBCdWZmZXJMaXN0O3RoaXMubGVuZ3RoPTA7dGhpcy5waXBlcz1udWxsO3RoaXMucGlwZXNDb3VudD0wO3RoaXMuZmxvd2luZz1udWxsO3RoaXMuZW5kZWQ9ZmFsc2U7dGhpcy5lbmRFbWl0dGVkPWZhbHNlO3RoaXMucmVhZGluZz1mYWxzZTt0aGlzLnN5bmM9dHJ1ZTt0aGlzLm5lZWRSZWFkYWJsZT1mYWxzZTt0aGlzLmVtaXR0ZWRSZWFkYWJsZT1mYWxzZTt0aGlzLnJlYWRhYmxlTGlzdGVuaW5nPWZhbHNlO3RoaXMucmVzdW1lU2NoZWR1bGVkPWZhbHNlO3RoaXMuZGVzdHJveWVkPWZhbHNlO3RoaXMuZGVmYXVsdEVuY29kaW5nPW9wdGlvbnMuZGVmYXVsdEVuY29kaW5nfHwidXRmOCI7dGhpcy5hd2FpdERyYWluPTA7dGhpcy5yZWFkaW5nTW9yZT1mYWxzZTt0aGlzLmRlY29kZXI9bnVsbDt0aGlzLmVuY29kaW5nPW51bGw7aWYob3B0aW9ucy5lbmNvZGluZyl7aWYoIVN0cmluZ0RlY29kZXIpU3RyaW5nRGVjb2Rlcj1yZXF1aXJlKCJzdHJpbmdfZGVjb2Rlci8iKS5TdHJpbmdEZWNvZGVyO3RoaXMuZGVjb2Rlcj1uZXcgU3RyaW5nRGVjb2RlcihvcHRpb25zLmVuY29kaW5nKTt0aGlzLmVuY29kaW5nPW9wdGlvbnMuZW5jb2Rpbmd9fWZ1bmN0aW9uIFJlYWRhYmxlKG9wdGlvbnMpe0R1cGxleD1EdXBsZXh8fHJlcXVpcmUoIi4vX3N0cmVhbV9kdXBsZXgiKTtpZighKHRoaXMgaW5zdGFuY2VvZiBSZWFkYWJsZSkpcmV0dXJuIG5ldyBSZWFkYWJsZShvcHRpb25zKTt0aGlzLl9yZWFkYWJsZVN0YXRlPW5ldyBSZWFkYWJsZVN0YXRlKG9wdGlvbnMsdGhpcyk7dGhpcy5yZWFkYWJsZT10cnVlO2lmKG9wdGlvbnMpe2lmKHR5cGVvZiBvcHRpb25zLnJlYWQ9PT0iZnVuY3Rpb24iKXRoaXMuX3JlYWQ9b3B0aW9ucy5yZWFkO2lmKHR5cGVvZiBvcHRpb25zLmRlc3Ryb3k9PT0iZnVuY3Rpb24iKXRoaXMuX2Rlc3Ryb3k9b3B0aW9ucy5kZXN0cm95fVN0cmVhbS5jYWxsKHRoaXMpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFkYWJsZS5wcm90b3R5cGUsImRlc3Ryb3llZCIse2dldDpmdW5jdGlvbigpe2lmKHRoaXMuX3JlYWRhYmxlU3RhdGU9PT11bmRlZmluZWQpe3JldHVybiBmYWxzZX1yZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWR9LHNldDpmdW5jdGlvbih2YWx1ZSl7aWYoIXRoaXMuX3JlYWRhYmxlU3RhdGUpe3JldHVybn10aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZD12YWx1ZX19KTtSZWFkYWJsZS5wcm90b3R5cGUuZGVzdHJveT1kZXN0cm95SW1wbC5kZXN0cm95O1JlYWRhYmxlLnByb3RvdHlwZS5fdW5kZXN0cm95PWRlc3Ryb3lJbXBsLnVuZGVzdHJveTtSZWFkYWJsZS5wcm90b3R5cGUuX2Rlc3Ryb3k9ZnVuY3Rpb24oZXJyLGNiKXt0aGlzLnB1c2gobnVsbCk7Y2IoZXJyKX07UmVhZGFibGUucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oY2h1bmssZW5jb2Rpbmcpe3ZhciBzdGF0ZT10aGlzLl9yZWFkYWJsZVN0YXRlO3ZhciBza2lwQ2h1bmtDaGVjaztpZighc3RhdGUub2JqZWN0TW9kZSl7aWYodHlwZW9mIGNodW5rPT09InN0cmluZyIpe2VuY29kaW5nPWVuY29kaW5nfHxzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7aWYoZW5jb2RpbmchPT1zdGF0ZS5lbmNvZGluZyl7Y2h1bms9QnVmZmVyLmZyb20oY2h1bmssZW5jb2RpbmcpO2VuY29kaW5nPSIifXNraXBDaHVua0NoZWNrPXRydWV9fWVsc2V7c2tpcENodW5rQ2hlY2s9dHJ1ZX1yZXR1cm4gcmVhZGFibGVBZGRDaHVuayh0aGlzLGNodW5rLGVuY29kaW5nLGZhbHNlLHNraXBDaHVua0NoZWNrKX07UmVhZGFibGUucHJvdG90eXBlLnVuc2hpZnQ9ZnVuY3Rpb24oY2h1bmspe3JldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsY2h1bmssbnVsbCx0cnVlLGZhbHNlKX07ZnVuY3Rpb24gcmVhZGFibGVBZGRDaHVuayhzdHJlYW0sY2h1bmssZW5jb2RpbmcsYWRkVG9Gcm9udCxza2lwQ2h1bmtDaGVjayl7dmFyIHN0YXRlPXN0cmVhbS5fcmVhZGFibGVTdGF0ZTtpZihjaHVuaz09PW51bGwpe3N0YXRlLnJlYWRpbmc9ZmFsc2U7b25Fb2ZDaHVuayhzdHJlYW0sc3RhdGUpfWVsc2V7dmFyIGVyO2lmKCFza2lwQ2h1bmtDaGVjayllcj1jaHVua0ludmFsaWQoc3RhdGUsY2h1bmspO2lmKGVyKXtzdHJlYW0uZW1pdCgiZXJyb3IiLGVyKX1lbHNlIGlmKHN0YXRlLm9iamVjdE1vZGV8fGNodW5rJiZjaHVuay5sZW5ndGg+MCl7aWYodHlwZW9mIGNodW5rIT09InN0cmluZyImJiFzdGF0ZS5vYmplY3RNb2RlJiZPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2h1bmspIT09QnVmZmVyLnByb3RvdHlwZSl7Y2h1bms9X3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuayl9aWYoYWRkVG9Gcm9udCl7aWYoc3RhdGUuZW5kRW1pdHRlZClzdHJlYW0uZW1pdCgiZXJyb3IiLG5ldyBFcnJvcigic3RyZWFtLnVuc2hpZnQoKSBhZnRlciBlbmQgZXZlbnQiKSk7ZWxzZSBhZGRDaHVuayhzdHJlYW0sc3RhdGUsY2h1bmssdHJ1ZSl9ZWxzZSBpZihzdGF0ZS5lbmRlZCl7c3RyZWFtLmVtaXQoImVycm9yIixuZXcgRXJyb3IoInN0cmVhbS5wdXNoKCkgYWZ0ZXIgRU9GIikpfWVsc2V7c3RhdGUucmVhZGluZz1mYWxzZTtpZihzdGF0ZS5kZWNvZGVyJiYhZW5jb2Rpbmcpe2NodW5rPXN0YXRlLmRlY29kZXIud3JpdGUoY2h1bmspO2lmKHN0YXRlLm9iamVjdE1vZGV8fGNodW5rLmxlbmd0aCE9PTApYWRkQ2h1bmsoc3RyZWFtLHN0YXRlLGNodW5rLGZhbHNlKTtlbHNlIG1heWJlUmVhZE1vcmUoc3RyZWFtLHN0YXRlKX1lbHNle2FkZENodW5rKHN0cmVhbSxzdGF0ZSxjaHVuayxmYWxzZSl9fX1lbHNlIGlmKCFhZGRUb0Zyb250KXtzdGF0ZS5yZWFkaW5nPWZhbHNlfX1yZXR1cm4gbmVlZE1vcmVEYXRhKHN0YXRlKX1mdW5jdGlvbiBhZGRDaHVuayhzdHJlYW0sc3RhdGUsY2h1bmssYWRkVG9Gcm9udCl7aWYoc3RhdGUuZmxvd2luZyYmc3RhdGUubGVuZ3RoPT09MCYmIXN0YXRlLnN5bmMpe3N0cmVhbS5lbWl0KCJkYXRhIixjaHVuayk7c3RyZWFtLnJlYWQoMCl9ZWxzZXtzdGF0ZS5sZW5ndGgrPXN0YXRlLm9iamVjdE1vZGU/MTpjaHVuay5sZW5ndGg7aWYoYWRkVG9Gcm9udClzdGF0ZS5idWZmZXIudW5zaGlmdChjaHVuayk7ZWxzZSBzdGF0ZS5idWZmZXIucHVzaChjaHVuayk7aWYoc3RhdGUubmVlZFJlYWRhYmxlKWVtaXRSZWFkYWJsZShzdHJlYW0pfW1heWJlUmVhZE1vcmUoc3RyZWFtLHN0YXRlKX1mdW5jdGlvbiBjaHVua0ludmFsaWQoc3RhdGUsY2h1bmspe3ZhciBlcjtpZighX2lzVWludDhBcnJheShjaHVuaykmJnR5cGVvZiBjaHVuayE9PSJzdHJpbmciJiZjaHVuayE9PXVuZGVmaW5lZCYmIXN0YXRlLm9iamVjdE1vZGUpe2VyPW5ldyBUeXBlRXJyb3IoIkludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsiKX1yZXR1cm4gZXJ9ZnVuY3Rpb24gbmVlZE1vcmVEYXRhKHN0YXRlKXtyZXR1cm4hc3RhdGUuZW5kZWQmJihzdGF0ZS5uZWVkUmVhZGFibGV8fHN0YXRlLmxlbmd0aDxzdGF0ZS5oaWdoV2F0ZXJNYXJrfHxzdGF0ZS5sZW5ndGg9PT0wKX1SZWFkYWJsZS5wcm90b3R5cGUuaXNQYXVzZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nPT09ZmFsc2V9O1JlYWRhYmxlLnByb3RvdHlwZS5zZXRFbmNvZGluZz1mdW5jdGlvbihlbmMpe2lmKCFTdHJpbmdEZWNvZGVyKVN0cmluZ0RlY29kZXI9cmVxdWlyZSgic3RyaW5nX2RlY29kZXIvIikuU3RyaW5nRGVjb2Rlcjt0aGlzLl9yZWFkYWJsZVN0YXRlLmRlY29kZXI9bmV3IFN0cmluZ0RlY29kZXIoZW5jKTt0aGlzLl9yZWFkYWJsZVN0YXRlLmVuY29kaW5nPWVuYztyZXR1cm4gdGhpc307dmFyIE1BWF9IV009ODM4ODYwODtmdW5jdGlvbiBjb21wdXRlTmV3SGlnaFdhdGVyTWFyayhuKXtpZihuPj1NQVhfSFdNKXtuPU1BWF9IV019ZWxzZXtuLS07bnw9bj4+PjE7bnw9bj4+PjI7bnw9bj4+PjQ7bnw9bj4+Pjg7bnw9bj4+PjE2O24rK31yZXR1cm4gbn1mdW5jdGlvbiBob3dNdWNoVG9SZWFkKG4sc3RhdGUpe2lmKG48PTB8fHN0YXRlLmxlbmd0aD09PTAmJnN0YXRlLmVuZGVkKXJldHVybiAwO2lmKHN0YXRlLm9iamVjdE1vZGUpcmV0dXJuIDE7aWYobiE9PW4pe2lmKHN0YXRlLmZsb3dpbmcmJnN0YXRlLmxlbmd0aClyZXR1cm4gc3RhdGUuYnVmZmVyLmhlYWQuZGF0YS5sZW5ndGg7ZWxzZSByZXR1cm4gc3RhdGUubGVuZ3RofWlmKG4+c3RhdGUuaGlnaFdhdGVyTWFyaylzdGF0ZS5oaWdoV2F0ZXJNYXJrPWNvbXB1dGVOZXdIaWdoV2F0ZXJNYXJrKG4pO2lmKG48PXN0YXRlLmxlbmd0aClyZXR1cm4gbjtpZighc3RhdGUuZW5kZWQpe3N0YXRlLm5lZWRSZWFkYWJsZT10cnVlO3JldHVybiAwfXJldHVybiBzdGF0ZS5sZW5ndGh9UmVhZGFibGUucHJvdG90eXBlLnJlYWQ9ZnVuY3Rpb24obil7ZGVidWcoInJlYWQiLG4pO249cGFyc2VJbnQobiwxMCk7dmFyIHN0YXRlPXRoaXMuX3JlYWRhYmxlU3RhdGU7dmFyIG5PcmlnPW47aWYobiE9PTApc3RhdGUuZW1pdHRlZFJlYWRhYmxlPWZhbHNlO2lmKG49PT0wJiZzdGF0ZS5uZWVkUmVhZGFibGUmJihzdGF0ZS5sZW5ndGg+PXN0YXRlLmhpZ2hXYXRlck1hcmt8fHN0YXRlLmVuZGVkKSl7ZGVidWcoInJlYWQ6IGVtaXRSZWFkYWJsZSIsc3RhdGUubGVuZ3RoLHN0YXRlLmVuZGVkKTtpZihzdGF0ZS5sZW5ndGg9PT0wJiZzdGF0ZS5lbmRlZCllbmRSZWFkYWJsZSh0aGlzKTtlbHNlIGVtaXRSZWFkYWJsZSh0aGlzKTtyZXR1cm4gbnVsbH1uPWhvd011Y2hUb1JlYWQobixzdGF0ZSk7aWYobj09PTAmJnN0YXRlLmVuZGVkKXtpZihzdGF0ZS5sZW5ndGg9PT0wKWVuZFJlYWRhYmxlKHRoaXMpO3JldHVybiBudWxsfXZhciBkb1JlYWQ9c3RhdGUubmVlZFJlYWRhYmxlO2RlYnVnKCJuZWVkIHJlYWRhYmxlIixkb1JlYWQpO2lmKHN0YXRlLmxlbmd0aD09PTB8fHN0YXRlLmxlbmd0aC1uPHN0YXRlLmhpZ2hXYXRlck1hcmspe2RvUmVhZD10cnVlO2RlYnVnKCJsZW5ndGggbGVzcyB0aGFuIHdhdGVybWFyayIsZG9SZWFkKX1pZihzdGF0ZS5lbmRlZHx8c3RhdGUucmVhZGluZyl7ZG9SZWFkPWZhbHNlO2RlYnVnKCJyZWFkaW5nIG9yIGVuZGVkIixkb1JlYWQpfWVsc2UgaWYoZG9SZWFkKXtkZWJ1ZygiZG8gcmVhZCIpO3N0YXRlLnJlYWRpbmc9dHJ1ZTtzdGF0ZS5zeW5jPXRydWU7aWYoc3RhdGUubGVuZ3RoPT09MClzdGF0ZS5uZWVkUmVhZGFibGU9dHJ1ZTt0aGlzLl9yZWFkKHN0YXRlLmhpZ2hXYXRlck1hcmspO3N0YXRlLnN5bmM9ZmFsc2U7aWYoIXN0YXRlLnJlYWRpbmcpbj1ob3dNdWNoVG9SZWFkKG5PcmlnLHN0YXRlKX12YXIgcmV0O2lmKG4+MClyZXQ9ZnJvbUxpc3QobixzdGF0ZSk7ZWxzZSByZXQ9bnVsbDtpZihyZXQ9PT1udWxsKXtzdGF0ZS5uZWVkUmVhZGFibGU9dHJ1ZTtuPTB9ZWxzZXtzdGF0ZS5sZW5ndGgtPW59aWYoc3RhdGUubGVuZ3RoPT09MCl7aWYoIXN0YXRlLmVuZGVkKXN0YXRlLm5lZWRSZWFkYWJsZT10cnVlO2lmKG5PcmlnIT09biYmc3RhdGUuZW5kZWQpZW5kUmVhZGFibGUodGhpcyl9aWYocmV0IT09bnVsbCl0aGlzLmVtaXQoImRhdGEiLHJldCk7cmV0dXJuIHJldH07ZnVuY3Rpb24gb25Fb2ZDaHVuayhzdHJlYW0sc3RhdGUpe2lmKHN0YXRlLmVuZGVkKXJldHVybjtpZihzdGF0ZS5kZWNvZGVyKXt2YXIgY2h1bms9c3RhdGUuZGVjb2Rlci5lbmQoKTtpZihjaHVuayYmY2h1bmsubGVuZ3RoKXtzdGF0ZS5idWZmZXIucHVzaChjaHVuayk7c3RhdGUubGVuZ3RoKz1zdGF0ZS5vYmplY3RNb2RlPzE6Y2h1bmsubGVuZ3RofX1zdGF0ZS5lbmRlZD10cnVlO2VtaXRSZWFkYWJsZShzdHJlYW0pfWZ1bmN0aW9uIGVtaXRSZWFkYWJsZShzdHJlYW0pe3ZhciBzdGF0ZT1zdHJlYW0uX3JlYWRhYmxlU3RhdGU7c3RhdGUubmVlZFJlYWRhYmxlPWZhbHNlO2lmKCFzdGF0ZS5lbWl0dGVkUmVhZGFibGUpe2RlYnVnKCJlbWl0UmVhZGFibGUiLHN0YXRlLmZsb3dpbmcpO3N0YXRlLmVtaXR0ZWRSZWFkYWJsZT10cnVlO2lmKHN0YXRlLnN5bmMpcG5hLm5leHRUaWNrKGVtaXRSZWFkYWJsZV8sc3RyZWFtKTtlbHNlIGVtaXRSZWFkYWJsZV8oc3RyZWFtKX19ZnVuY3Rpb24gZW1pdFJlYWRhYmxlXyhzdHJlYW0pe2RlYnVnKCJlbWl0IHJlYWRhYmxlIik7c3RyZWFtLmVtaXQoInJlYWRhYmxlIik7ZmxvdyhzdHJlYW0pfWZ1bmN0aW9uIG1heWJlUmVhZE1vcmUoc3RyZWFtLHN0YXRlKXtpZighc3RhdGUucmVhZGluZ01vcmUpe3N0YXRlLnJlYWRpbmdNb3JlPXRydWU7cG5hLm5leHRUaWNrKG1heWJlUmVhZE1vcmVfLHN0cmVhbSxzdGF0ZSl9fWZ1bmN0aW9uIG1heWJlUmVhZE1vcmVfKHN0cmVhbSxzdGF0ZSl7dmFyIGxlbj1zdGF0ZS5sZW5ndGg7d2hpbGUoIXN0YXRlLnJlYWRpbmcmJiFzdGF0ZS5mbG93aW5nJiYhc3RhdGUuZW5kZWQmJnN0YXRlLmxlbmd0aDxzdGF0ZS5oaWdoV2F0ZXJNYXJrKXtkZWJ1ZygibWF5YmVSZWFkTW9yZSByZWFkIDAiKTtzdHJlYW0ucmVhZCgwKTtpZihsZW49PT1zdGF0ZS5sZW5ndGgpYnJlYWs7ZWxzZSBsZW49c3RhdGUubGVuZ3RofXN0YXRlLnJlYWRpbmdNb3JlPWZhbHNlfVJlYWRhYmxlLnByb3RvdHlwZS5fcmVhZD1mdW5jdGlvbihuKXt0aGlzLmVtaXQoImVycm9yIixuZXcgRXJyb3IoIl9yZWFkKCkgaXMgbm90IGltcGxlbWVudGVkIikpfTtSZWFkYWJsZS5wcm90b3R5cGUucGlwZT1mdW5jdGlvbihkZXN0LHBpcGVPcHRzKXt2YXIgc3JjPXRoaXM7dmFyIHN0YXRlPXRoaXMuX3JlYWRhYmxlU3RhdGU7c3dpdGNoKHN0YXRlLnBpcGVzQ291bnQpe2Nhc2UgMDpzdGF0ZS5waXBlcz1kZXN0O2JyZWFrO2Nhc2UgMTpzdGF0ZS5waXBlcz1bc3RhdGUucGlwZXMsZGVzdF07YnJlYWs7ZGVmYXVsdDpzdGF0ZS5waXBlcy5wdXNoKGRlc3QpO2JyZWFrfXN0YXRlLnBpcGVzQ291bnQrPTE7ZGVidWcoInBpcGUgY291bnQ9JWQgb3B0cz0laiIsc3RhdGUucGlwZXNDb3VudCxwaXBlT3B0cyk7dmFyIGRvRW5kPSghcGlwZU9wdHN8fHBpcGVPcHRzLmVuZCE9PWZhbHNlKSYmZGVzdCE9PXByb2Nlc3Muc3Rkb3V0JiZkZXN0IT09cHJvY2Vzcy5zdGRlcnI7dmFyIGVuZEZuPWRvRW5kP29uZW5kOnVucGlwZTtpZihzdGF0ZS5lbmRFbWl0dGVkKXBuYS5uZXh0VGljayhlbmRGbik7ZWxzZSBzcmMub25jZSgiZW5kIixlbmRGbik7ZGVzdC5vbigidW5waXBlIixvbnVucGlwZSk7ZnVuY3Rpb24gb251bnBpcGUocmVhZGFibGUsdW5waXBlSW5mbyl7ZGVidWcoIm9udW5waXBlIik7aWYocmVhZGFibGU9PT1zcmMpe2lmKHVucGlwZUluZm8mJnVucGlwZUluZm8uaGFzVW5waXBlZD09PWZhbHNlKXt1bnBpcGVJbmZvLmhhc1VucGlwZWQ9dHJ1ZTtjbGVhbnVwKCl9fX1mdW5jdGlvbiBvbmVuZCgpe2RlYnVnKCJvbmVuZCIpO2Rlc3QuZW5kKCl9dmFyIG9uZHJhaW49cGlwZU9uRHJhaW4oc3JjKTtkZXN0Lm9uKCJkcmFpbiIsb25kcmFpbik7dmFyIGNsZWFuZWRVcD1mYWxzZTtmdW5jdGlvbiBjbGVhbnVwKCl7ZGVidWcoImNsZWFudXAiKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJjbG9zZSIsb25jbG9zZSk7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZmluaXNoIixvbmZpbmlzaCk7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiZHJhaW4iLG9uZHJhaW4pO2Rlc3QucmVtb3ZlTGlzdGVuZXIoImVycm9yIixvbmVycm9yKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJ1bnBpcGUiLG9udW5waXBlKTtzcmMucmVtb3ZlTGlzdGVuZXIoImVuZCIsb25lbmQpO3NyYy5yZW1vdmVMaXN0ZW5lcigiZW5kIix1bnBpcGUpO3NyYy5yZW1vdmVMaXN0ZW5lcigiZGF0YSIsb25kYXRhKTtjbGVhbmVkVXA9dHJ1ZTtpZihzdGF0ZS5hd2FpdERyYWluJiYoIWRlc3QuX3dyaXRhYmxlU3RhdGV8fGRlc3QuX3dyaXRhYmxlU3RhdGUubmVlZERyYWluKSlvbmRyYWluKCl9dmFyIGluY3JlYXNlZEF3YWl0RHJhaW49ZmFsc2U7c3JjLm9uKCJkYXRhIixvbmRhdGEpO2Z1bmN0aW9uIG9uZGF0YShjaHVuayl7ZGVidWcoIm9uZGF0YSIpO2luY3JlYXNlZEF3YWl0RHJhaW49ZmFsc2U7dmFyIHJldD1kZXN0LndyaXRlKGNodW5rKTtpZihmYWxzZT09PXJldCYmIWluY3JlYXNlZEF3YWl0RHJhaW4pe2lmKChzdGF0ZS5waXBlc0NvdW50PT09MSYmc3RhdGUucGlwZXM9PT1kZXN0fHxzdGF0ZS5waXBlc0NvdW50PjEmJmluZGV4T2Yoc3RhdGUucGlwZXMsZGVzdCkhPT0tMSkmJiFjbGVhbmVkVXApe2RlYnVnKCJmYWxzZSB3cml0ZSByZXNwb25zZSwgcGF1c2UiLHNyYy5fcmVhZGFibGVTdGF0ZS5hd2FpdERyYWluKTtzcmMuX3JlYWRhYmxlU3RhdGUuYXdhaXREcmFpbisrO2luY3JlYXNlZEF3YWl0RHJhaW49dHJ1ZX1zcmMucGF1c2UoKX19ZnVuY3Rpb24gb25lcnJvcihlcil7ZGVidWcoIm9uZXJyb3IiLGVyKTt1bnBpcGUoKTtkZXN0LnJlbW92ZUxpc3RlbmVyKCJlcnJvciIsb25lcnJvcik7aWYoRUVsaXN0ZW5lckNvdW50KGRlc3QsImVycm9yIik9PT0wKWRlc3QuZW1pdCgiZXJyb3IiLGVyKX1wcmVwZW5kTGlzdGVuZXIoZGVzdCwiZXJyb3IiLG9uZXJyb3IpO2Z1bmN0aW9uIG9uY2xvc2UoKXtkZXN0LnJlbW92ZUxpc3RlbmVyKCJmaW5pc2giLG9uZmluaXNoKTt1bnBpcGUoKX1kZXN0Lm9uY2UoImNsb3NlIixvbmNsb3NlKTtmdW5jdGlvbiBvbmZpbmlzaCgpe2RlYnVnKCJvbmZpbmlzaCIpO2Rlc3QucmVtb3ZlTGlzdGVuZXIoImNsb3NlIixvbmNsb3NlKTt1bnBpcGUoKX1kZXN0Lm9uY2UoImZpbmlzaCIsb25maW5pc2gpO2Z1bmN0aW9uIHVucGlwZSgpe2RlYnVnKCJ1bnBpcGUiKTtzcmMudW5waXBlKGRlc3QpfWRlc3QuZW1pdCgicGlwZSIsc3JjKTtpZighc3RhdGUuZmxvd2luZyl7ZGVidWcoInBpcGUgcmVzdW1lIik7c3JjLnJlc3VtZSgpfXJldHVybiBkZXN0fTtmdW5jdGlvbiBwaXBlT25EcmFpbihzcmMpe3JldHVybiBmdW5jdGlvbigpe3ZhciBzdGF0ZT1zcmMuX3JlYWRhYmxlU3RhdGU7ZGVidWcoInBpcGVPbkRyYWluIixzdGF0ZS5hd2FpdERyYWluKTtpZihzdGF0ZS5hd2FpdERyYWluKXN0YXRlLmF3YWl0RHJhaW4tLTtpZihzdGF0ZS5hd2FpdERyYWluPT09MCYmRUVsaXN0ZW5lckNvdW50KHNyYywiZGF0YSIpKXtzdGF0ZS5mbG93aW5nPXRydWU7ZmxvdyhzcmMpfX19UmVhZGFibGUucHJvdG90eXBlLnVucGlwZT1mdW5jdGlvbihkZXN0KXt2YXIgc3RhdGU9dGhpcy5fcmVhZGFibGVTdGF0ZTt2YXIgdW5waXBlSW5mbz17aGFzVW5waXBlZDpmYWxzZX07aWYoc3RhdGUucGlwZXNDb3VudD09PTApcmV0dXJuIHRoaXM7aWYoc3RhdGUucGlwZXNDb3VudD09PTEpe2lmKGRlc3QmJmRlc3QhPT1zdGF0ZS5waXBlcylyZXR1cm4gdGhpcztpZighZGVzdClkZXN0PXN0YXRlLnBpcGVzO3N0YXRlLnBpcGVzPW51bGw7c3RhdGUucGlwZXNDb3VudD0wO3N0YXRlLmZsb3dpbmc9ZmFsc2U7aWYoZGVzdClkZXN0LmVtaXQoInVucGlwZSIsdGhpcyx1bnBpcGVJbmZvKTtyZXR1cm4gdGhpc31pZighZGVzdCl7dmFyIGRlc3RzPXN0YXRlLnBpcGVzO3ZhciBsZW49c3RhdGUucGlwZXNDb3VudDtzdGF0ZS5waXBlcz1udWxsO3N0YXRlLnBpcGVzQ291bnQ9MDtzdGF0ZS5mbG93aW5nPWZhbHNlO2Zvcih2YXIgaT0wO2k8bGVuO2krKyl7ZGVzdHNbaV0uZW1pdCgidW5waXBlIix0aGlzLHVucGlwZUluZm8pfXJldHVybiB0aGlzfXZhciBpbmRleD1pbmRleE9mKHN0YXRlLnBpcGVzLGRlc3QpO2lmKGluZGV4PT09LTEpcmV0dXJuIHRoaXM7c3RhdGUucGlwZXMuc3BsaWNlKGluZGV4LDEpO3N0YXRlLnBpcGVzQ291bnQtPTE7aWYoc3RhdGUucGlwZXNDb3VudD09PTEpc3RhdGUucGlwZXM9c3RhdGUucGlwZXNbMF07ZGVzdC5lbWl0KCJ1bnBpcGUiLHRoaXMsdW5waXBlSW5mbyk7cmV0dXJuIHRoaXN9O1JlYWRhYmxlLnByb3RvdHlwZS5vbj1mdW5jdGlvbihldixmbil7dmFyIHJlcz1TdHJlYW0ucHJvdG90eXBlLm9uLmNhbGwodGhpcyxldixmbik7aWYoZXY9PT0iZGF0YSIpe2lmKHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyE9PWZhbHNlKXRoaXMucmVzdW1lKCl9ZWxzZSBpZihldj09PSJyZWFkYWJsZSIpe3ZhciBzdGF0ZT10aGlzLl9yZWFkYWJsZVN0YXRlO2lmKCFzdGF0ZS5lbmRFbWl0dGVkJiYhc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcpe3N0YXRlLnJlYWRhYmxlTGlzdGVuaW5nPXN0YXRlLm5lZWRSZWFkYWJsZT10cnVlO3N0YXRlLmVtaXR0ZWRSZWFkYWJsZT1mYWxzZTtpZighc3RhdGUucmVhZGluZyl7cG5hLm5leHRUaWNrKG5SZWFkaW5nTmV4dFRpY2ssdGhpcyl9ZWxzZSBpZihzdGF0ZS5sZW5ndGgpe2VtaXRSZWFkYWJsZSh0aGlzKX19fXJldHVybiByZXN9O1JlYWRhYmxlLnByb3RvdHlwZS5hZGRMaXN0ZW5lcj1SZWFkYWJsZS5wcm90b3R5cGUub247ZnVuY3Rpb24gblJlYWRpbmdOZXh0VGljayhzZWxmKXtkZWJ1ZygicmVhZGFibGUgbmV4dHRpY2sgcmVhZCAwIik7c2VsZi5yZWFkKDApfVJlYWRhYmxlLnByb3RvdHlwZS5yZXN1bWU9ZnVuY3Rpb24oKXt2YXIgc3RhdGU9dGhpcy5fcmVhZGFibGVTdGF0ZTtpZighc3RhdGUuZmxvd2luZyl7ZGVidWcoInJlc3VtZSIpO3N0YXRlLmZsb3dpbmc9dHJ1ZTtyZXN1bWUodGhpcyxzdGF0ZSl9cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIHJlc3VtZShzdHJlYW0sc3RhdGUpe2lmKCFzdGF0ZS5yZXN1bWVTY2hlZHVsZWQpe3N0YXRlLnJlc3VtZVNjaGVkdWxlZD10cnVlO3BuYS5uZXh0VGljayhyZXN1bWVfLHN0cmVhbSxzdGF0ZSl9fWZ1bmN0aW9uIHJlc3VtZV8oc3RyZWFtLHN0YXRlKXtpZighc3RhdGUucmVhZGluZyl7ZGVidWcoInJlc3VtZSByZWFkIDAiKTtzdHJlYW0ucmVhZCgwKX1zdGF0ZS5yZXN1bWVTY2hlZHVsZWQ9ZmFsc2U7c3RhdGUuYXdhaXREcmFpbj0wO3N0cmVhbS5lbWl0KCJyZXN1bWUiKTtmbG93KHN0cmVhbSk7aWYoc3RhdGUuZmxvd2luZyYmIXN0YXRlLnJlYWRpbmcpc3RyZWFtLnJlYWQoMCl9UmVhZGFibGUucHJvdG90eXBlLnBhdXNlPWZ1bmN0aW9uKCl7ZGVidWcoImNhbGwgcGF1c2UgZmxvd2luZz0laiIsdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nKTtpZihmYWxzZSE9PXRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyl7ZGVidWcoInBhdXNlIik7dGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nPWZhbHNlO3RoaXMuZW1pdCgicGF1c2UiKX1yZXR1cm4gdGhpc307ZnVuY3Rpb24gZmxvdyhzdHJlYW0pe3ZhciBzdGF0ZT1zdHJlYW0uX3JlYWRhYmxlU3RhdGU7ZGVidWcoImZsb3ciLHN0YXRlLmZsb3dpbmcpO3doaWxlKHN0YXRlLmZsb3dpbmcmJnN0cmVhbS5yZWFkKCkhPT1udWxsKXt9fVJlYWRhYmxlLnByb3RvdHlwZS53cmFwPWZ1bmN0aW9uKHN0cmVhbSl7dmFyIF90aGlzPXRoaXM7dmFyIHN0YXRlPXRoaXMuX3JlYWRhYmxlU3RhdGU7dmFyIHBhdXNlZD1mYWxzZTtzdHJlYW0ub24oImVuZCIsZnVuY3Rpb24oKXtkZWJ1Zygid3JhcHBlZCBlbmQiKTtpZihzdGF0ZS5kZWNvZGVyJiYhc3RhdGUuZW5kZWQpe3ZhciBjaHVuaz1zdGF0ZS5kZWNvZGVyLmVuZCgpO2lmKGNodW5rJiZjaHVuay5sZW5ndGgpX3RoaXMucHVzaChjaHVuayl9X3RoaXMucHVzaChudWxsKX0pO3N0cmVhbS5vbigiZGF0YSIsZnVuY3Rpb24oY2h1bmspe2RlYnVnKCJ3cmFwcGVkIGRhdGEiKTtpZihzdGF0ZS5kZWNvZGVyKWNodW5rPXN0YXRlLmRlY29kZXIud3JpdGUoY2h1bmspO2lmKHN0YXRlLm9iamVjdE1vZGUmJihjaHVuaz09PW51bGx8fGNodW5rPT09dW5kZWZpbmVkKSlyZXR1cm47ZWxzZSBpZighc3RhdGUub2JqZWN0TW9kZSYmKCFjaHVua3x8IWNodW5rLmxlbmd0aCkpcmV0dXJuO3ZhciByZXQ9X3RoaXMucHVzaChjaHVuayk7aWYoIXJldCl7cGF1c2VkPXRydWU7c3RyZWFtLnBhdXNlKCl9fSk7Zm9yKHZhciBpIGluIHN0cmVhbSl7aWYodGhpc1tpXT09PXVuZGVmaW5lZCYmdHlwZW9mIHN0cmVhbVtpXT09PSJmdW5jdGlvbiIpe3RoaXNbaV09ZnVuY3Rpb24obWV0aG9kKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gc3RyZWFtW21ldGhvZF0uYXBwbHkoc3RyZWFtLGFyZ3VtZW50cyl9fShpKX19Zm9yKHZhciBuPTA7bjxrUHJveHlFdmVudHMubGVuZ3RoO24rKyl7c3RyZWFtLm9uKGtQcm94eUV2ZW50c1tuXSx0aGlzLmVtaXQuYmluZCh0aGlzLGtQcm94eUV2ZW50c1tuXSkpfXRoaXMuX3JlYWQ9ZnVuY3Rpb24obil7ZGVidWcoIndyYXBwZWQgX3JlYWQiLG4pO2lmKHBhdXNlZCl7cGF1c2VkPWZhbHNlO3N0cmVhbS5yZXN1bWUoKX19O3JldHVybiB0aGlzfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhZGFibGUucHJvdG90eXBlLCJyZWFkYWJsZUhpZ2hXYXRlck1hcmsiLHtlbnVtZXJhYmxlOmZhbHNlLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9yZWFkYWJsZVN0YXRlLmhpZ2hXYXRlck1hcmt9fSk7UmVhZGFibGUuX2Zyb21MaXN0PWZyb21MaXN0O2Z1bmN0aW9uIGZyb21MaXN0KG4sc3RhdGUpe2lmKHN0YXRlLmxlbmd0aD09PTApcmV0dXJuIG51bGw7dmFyIHJldDtpZihzdGF0ZS5vYmplY3RNb2RlKXJldD1zdGF0ZS5idWZmZXIuc2hpZnQoKTtlbHNlIGlmKCFufHxuPj1zdGF0ZS5sZW5ndGgpe2lmKHN0YXRlLmRlY29kZXIpcmV0PXN0YXRlLmJ1ZmZlci5qb2luKCIiKTtlbHNlIGlmKHN0YXRlLmJ1ZmZlci5sZW5ndGg9PT0xKXJldD1zdGF0ZS5idWZmZXIuaGVhZC5kYXRhO2Vsc2UgcmV0PXN0YXRlLmJ1ZmZlci5jb25jYXQoc3RhdGUubGVuZ3RoKTtzdGF0ZS5idWZmZXIuY2xlYXIoKX1lbHNle3JldD1mcm9tTGlzdFBhcnRpYWwobixzdGF0ZS5idWZmZXIsc3RhdGUuZGVjb2Rlcil9cmV0dXJuIHJldH1mdW5jdGlvbiBmcm9tTGlzdFBhcnRpYWwobixsaXN0LGhhc1N0cmluZ3Mpe3ZhciByZXQ7aWYobjxsaXN0LmhlYWQuZGF0YS5sZW5ndGgpe3JldD1saXN0LmhlYWQuZGF0YS5zbGljZSgwLG4pO2xpc3QuaGVhZC5kYXRhPWxpc3QuaGVhZC5kYXRhLnNsaWNlKG4pfWVsc2UgaWYobj09PWxpc3QuaGVhZC5kYXRhLmxlbmd0aCl7cmV0PWxpc3Quc2hpZnQoKX1lbHNle3JldD1oYXNTdHJpbmdzP2NvcHlGcm9tQnVmZmVyU3RyaW5nKG4sbGlzdCk6Y29weUZyb21CdWZmZXIobixsaXN0KX1yZXR1cm4gcmV0fWZ1bmN0aW9uIGNvcHlGcm9tQnVmZmVyU3RyaW5nKG4sbGlzdCl7dmFyIHA9bGlzdC5oZWFkO3ZhciBjPTE7dmFyIHJldD1wLmRhdGE7bi09cmV0Lmxlbmd0aDt3aGlsZShwPXAubmV4dCl7dmFyIHN0cj1wLmRhdGE7dmFyIG5iPW4+c3RyLmxlbmd0aD9zdHIubGVuZ3RoOm47aWYobmI9PT1zdHIubGVuZ3RoKXJldCs9c3RyO2Vsc2UgcmV0Kz1zdHIuc2xpY2UoMCxuKTtuLT1uYjtpZihuPT09MCl7aWYobmI9PT1zdHIubGVuZ3RoKXsrK2M7aWYocC5uZXh0KWxpc3QuaGVhZD1wLm5leHQ7ZWxzZSBsaXN0LmhlYWQ9bGlzdC50YWlsPW51bGx9ZWxzZXtsaXN0LmhlYWQ9cDtwLmRhdGE9c3RyLnNsaWNlKG5iKX1icmVha30rK2N9bGlzdC5sZW5ndGgtPWM7cmV0dXJuIHJldH1mdW5jdGlvbiBjb3B5RnJvbUJ1ZmZlcihuLGxpc3Qpe3ZhciByZXQ9QnVmZmVyLmFsbG9jVW5zYWZlKG4pO3ZhciBwPWxpc3QuaGVhZDt2YXIgYz0xO3AuZGF0YS5jb3B5KHJldCk7bi09cC5kYXRhLmxlbmd0aDt3aGlsZShwPXAubmV4dCl7dmFyIGJ1Zj1wLmRhdGE7dmFyIG5iPW4+YnVmLmxlbmd0aD9idWYubGVuZ3RoOm47YnVmLmNvcHkocmV0LHJldC5sZW5ndGgtbiwwLG5iKTtuLT1uYjtpZihuPT09MCl7aWYobmI9PT1idWYubGVuZ3RoKXsrK2M7aWYocC5uZXh0KWxpc3QuaGVhZD1wLm5leHQ7ZWxzZSBsaXN0LmhlYWQ9bGlzdC50YWlsPW51bGx9ZWxzZXtsaXN0LmhlYWQ9cDtwLmRhdGE9YnVmLnNsaWNlKG5iKX1icmVha30rK2N9bGlzdC5sZW5ndGgtPWM7cmV0dXJuIHJldH1mdW5jdGlvbiBlbmRSZWFkYWJsZShzdHJlYW0pe3ZhciBzdGF0ZT1zdHJlYW0uX3JlYWRhYmxlU3RhdGU7aWYoc3RhdGUubGVuZ3RoPjApdGhyb3cgbmV3IEVycm9yKCciZW5kUmVhZGFibGUoKSIgY2FsbGVkIG9uIG5vbi1lbXB0eSBzdHJlYW0nKTtpZighc3RhdGUuZW5kRW1pdHRlZCl7c3RhdGUuZW5kZWQ9dHJ1ZTtwbmEubmV4dFRpY2soZW5kUmVhZGFibGVOVCxzdGF0ZSxzdHJlYW0pfX1mdW5jdGlvbiBlbmRSZWFkYWJsZU5UKHN0YXRlLHN0cmVhbSl7aWYoIXN0YXRlLmVuZEVtaXR0ZWQmJnN0YXRlLmxlbmd0aD09PTApe3N0YXRlLmVuZEVtaXR0ZWQ9dHJ1ZTtzdHJlYW0ucmVhZGFibGU9ZmFsc2U7c3RyZWFtLmVtaXQoImVuZCIpfX1mdW5jdGlvbiBpbmRleE9mKHhzLHgpe2Zvcih2YXIgaT0wLGw9eHMubGVuZ3RoO2k8bDtpKyspe2lmKHhzW2ldPT09eClyZXR1cm4gaX1yZXR1cm4tMX19KS5jYWxsKHRoaXMscmVxdWlyZSgiX3Byb2Nlc3MiKSx0eXBlb2YgZ2xvYmFsIT09InVuZGVmaW5lZCI/Z2xvYmFsOnR5cGVvZiBzZWxmIT09InVuZGVmaW5lZCI/c2VsZjp0eXBlb2Ygd2luZG93IT09InVuZGVmaW5lZCI/d2luZG93Ont9KX0seyIuL19zdHJlYW1fZHVwbGV4Ijo2NSwiLi9pbnRlcm5hbC9zdHJlYW1zL0J1ZmZlckxpc3QiOjcwLCIuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveSI6NzEsIi4vaW50ZXJuYWwvc3RyZWFtcy9zdHJlYW0iOjcyLF9wcm9jZXNzOjYyLCJjb3JlLXV0aWwtaXMiOjI4LGV2ZW50czozMSxpbmhlcml0czozNCxpc2FycmF5OjM2LCJwcm9jZXNzLW5leHRpY2stYXJncyI6NjEsInNhZmUtYnVmZmVyIjo3OCwic3RyaW5nX2RlY29kZXIvIjo5OCx1dGlsOjI0fV0sNjg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijttb2R1bGUuZXhwb3J0cz1UcmFuc2Zvcm07dmFyIER1cGxleD1yZXF1aXJlKCIuL19zdHJlYW1fZHVwbGV4Iik7dmFyIHV0aWw9cmVxdWlyZSgiY29yZS11dGlsLWlzIik7dXRpbC5pbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3V0aWwuaW5oZXJpdHMoVHJhbnNmb3JtLER1cGxleCk7ZnVuY3Rpb24gYWZ0ZXJUcmFuc2Zvcm0oZXIsZGF0YSl7dmFyIHRzPXRoaXMuX3RyYW5zZm9ybVN0YXRlO3RzLnRyYW5zZm9ybWluZz1mYWxzZTt2YXIgY2I9dHMud3JpdGVjYjtpZighY2Ipe3JldHVybiB0aGlzLmVtaXQoImVycm9yIixuZXcgRXJyb3IoIndyaXRlIGNhbGxiYWNrIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyIpKX10cy53cml0ZWNodW5rPW51bGw7dHMud3JpdGVjYj1udWxsO2lmKGRhdGEhPW51bGwpdGhpcy5wdXNoKGRhdGEpO2NiKGVyKTt2YXIgcnM9dGhpcy5fcmVhZGFibGVTdGF0ZTtycy5yZWFkaW5nPWZhbHNlO2lmKHJzLm5lZWRSZWFkYWJsZXx8cnMubGVuZ3RoPHJzLmhpZ2hXYXRlck1hcmspe3RoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayl9fWZ1bmN0aW9uIFRyYW5zZm9ybShvcHRpb25zKXtpZighKHRoaXMgaW5zdGFuY2VvZiBUcmFuc2Zvcm0pKXJldHVybiBuZXcgVHJhbnNmb3JtKG9wdGlvbnMpO0R1cGxleC5jYWxsKHRoaXMsb3B0aW9ucyk7dGhpcy5fdHJhbnNmb3JtU3RhdGU9e2FmdGVyVHJhbnNmb3JtOmFmdGVyVHJhbnNmb3JtLmJpbmQodGhpcyksbmVlZFRyYW5zZm9ybTpmYWxzZSx0cmFuc2Zvcm1pbmc6ZmFsc2Usd3JpdGVjYjpudWxsLHdyaXRlY2h1bms6bnVsbCx3cml0ZWVuY29kaW5nOm51bGx9O3RoaXMuX3JlYWRhYmxlU3RhdGUubmVlZFJlYWRhYmxlPXRydWU7dGhpcy5fcmVhZGFibGVTdGF0ZS5zeW5jPWZhbHNlO2lmKG9wdGlvbnMpe2lmKHR5cGVvZiBvcHRpb25zLnRyYW5zZm9ybT09PSJmdW5jdGlvbiIpdGhpcy5fdHJhbnNmb3JtPW9wdGlvbnMudHJhbnNmb3JtO2lmKHR5cGVvZiBvcHRpb25zLmZsdXNoPT09ImZ1bmN0aW9uIil0aGlzLl9mbHVzaD1vcHRpb25zLmZsdXNofXRoaXMub24oInByZWZpbmlzaCIscHJlZmluaXNoKX1mdW5jdGlvbiBwcmVmaW5pc2goKXt2YXIgX3RoaXM9dGhpcztpZih0eXBlb2YgdGhpcy5fZmx1c2g9PT0iZnVuY3Rpb24iKXt0aGlzLl9mbHVzaChmdW5jdGlvbihlcixkYXRhKXtkb25lKF90aGlzLGVyLGRhdGEpfSl9ZWxzZXtkb25lKHRoaXMsbnVsbCxudWxsKX19VHJhbnNmb3JtLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nKXt0aGlzLl90cmFuc2Zvcm1TdGF0ZS5uZWVkVHJhbnNmb3JtPWZhbHNlO3JldHVybiBEdXBsZXgucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLGNodW5rLGVuY29kaW5nKX07VHJhbnNmb3JtLnByb3RvdHlwZS5fdHJhbnNmb3JtPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXt0aHJvdyBuZXcgRXJyb3IoIl90cmFuc2Zvcm0oKSBpcyBub3QgaW1wbGVtZW50ZWQiKX07VHJhbnNmb3JtLnByb3RvdHlwZS5fd3JpdGU9ZnVuY3Rpb24oY2h1bmssZW5jb2RpbmcsY2Ipe3ZhciB0cz10aGlzLl90cmFuc2Zvcm1TdGF0ZTt0cy53cml0ZWNiPWNiO3RzLndyaXRlY2h1bms9Y2h1bms7dHMud3JpdGVlbmNvZGluZz1lbmNvZGluZztpZighdHMudHJhbnNmb3JtaW5nKXt2YXIgcnM9dGhpcy5fcmVhZGFibGVTdGF0ZTtpZih0cy5uZWVkVHJhbnNmb3JtfHxycy5uZWVkUmVhZGFibGV8fHJzLmxlbmd0aDxycy5oaWdoV2F0ZXJNYXJrKXRoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayl9fTtUcmFuc2Zvcm0ucHJvdG90eXBlLl9yZWFkPWZ1bmN0aW9uKG4pe3ZhciB0cz10aGlzLl90cmFuc2Zvcm1TdGF0ZTtpZih0cy53cml0ZWNodW5rIT09bnVsbCYmdHMud3JpdGVjYiYmIXRzLnRyYW5zZm9ybWluZyl7dHMudHJhbnNmb3JtaW5nPXRydWU7dGhpcy5fdHJhbnNmb3JtKHRzLndyaXRlY2h1bmssdHMud3JpdGVlbmNvZGluZyx0cy5hZnRlclRyYW5zZm9ybSl9ZWxzZXt0cy5uZWVkVHJhbnNmb3JtPXRydWV9fTtUcmFuc2Zvcm0ucHJvdG90eXBlLl9kZXN0cm95PWZ1bmN0aW9uKGVycixjYil7dmFyIF90aGlzMj10aGlzO0R1cGxleC5wcm90b3R5cGUuX2Rlc3Ryb3kuY2FsbCh0aGlzLGVycixmdW5jdGlvbihlcnIyKXtjYihlcnIyKTtfdGhpczIuZW1pdCgiY2xvc2UiKX0pfTtmdW5jdGlvbiBkb25lKHN0cmVhbSxlcixkYXRhKXtpZihlcilyZXR1cm4gc3RyZWFtLmVtaXQoImVycm9yIixlcik7aWYoZGF0YSE9bnVsbClzdHJlYW0ucHVzaChkYXRhKTtpZihzdHJlYW0uX3dyaXRhYmxlU3RhdGUubGVuZ3RoKXRocm93IG5ldyBFcnJvcigiQ2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHdzLmxlbmd0aCAhPSAwIik7aWYoc3RyZWFtLl90cmFuc2Zvcm1TdGF0ZS50cmFuc2Zvcm1pbmcpdGhyb3cgbmV3IEVycm9yKCJDYWxsaW5nIHRyYW5zZm9ybSBkb25lIHdoZW4gc3RpbGwgdHJhbnNmb3JtaW5nIik7cmV0dXJuIHN0cmVhbS5wdXNoKG51bGwpfX0seyIuL19zdHJlYW1fZHVwbGV4Ijo2NSwiY29yZS11dGlsLWlzIjoyOCxpbmhlcml0czozNH1dLDY5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24ocHJvY2VzcyxnbG9iYWwsc2V0SW1tZWRpYXRlKXsidXNlIHN0cmljdCI7dmFyIHBuYT1yZXF1aXJlKCJwcm9jZXNzLW5leHRpY2stYXJncyIpO21vZHVsZS5leHBvcnRzPVdyaXRhYmxlO2Z1bmN0aW9uIFdyaXRlUmVxKGNodW5rLGVuY29kaW5nLGNiKXt0aGlzLmNodW5rPWNodW5rO3RoaXMuZW5jb2Rpbmc9ZW5jb2Rpbmc7dGhpcy5jYWxsYmFjaz1jYjt0aGlzLm5leHQ9bnVsbH1mdW5jdGlvbiBDb3JrZWRSZXF1ZXN0KHN0YXRlKXt2YXIgX3RoaXM9dGhpczt0aGlzLm5leHQ9bnVsbDt0aGlzLmVudHJ5PW51bGw7dGhpcy5maW5pc2g9ZnVuY3Rpb24oKXtvbkNvcmtlZEZpbmlzaChfdGhpcyxzdGF0ZSl9fXZhciBhc3luY1dyaXRlPSFwcm9jZXNzLmJyb3dzZXImJlsidjAuMTAiLCJ2MC45LiJdLmluZGV4T2YocHJvY2Vzcy52ZXJzaW9uLnNsaWNlKDAsNSkpPi0xP3NldEltbWVkaWF0ZTpwbmEubmV4dFRpY2s7dmFyIER1cGxleDtXcml0YWJsZS5Xcml0YWJsZVN0YXRlPVdyaXRhYmxlU3RhdGU7dmFyIHV0aWw9cmVxdWlyZSgiY29yZS11dGlsLWlzIik7dXRpbC5pbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBpbnRlcm5hbFV0aWw9e2RlcHJlY2F0ZTpyZXF1aXJlKCJ1dGlsLWRlcHJlY2F0ZSIpfTt2YXIgU3RyZWFtPXJlcXVpcmUoIi4vaW50ZXJuYWwvc3RyZWFtcy9zdHJlYW0iKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBPdXJVaW50OEFycmF5PWdsb2JhbC5VaW50OEFycmF5fHxmdW5jdGlvbigpe307ZnVuY3Rpb24gX3VpbnQ4QXJyYXlUb0J1ZmZlcihjaHVuayl7cmV0dXJuIEJ1ZmZlci5mcm9tKGNodW5rKX1mdW5jdGlvbiBfaXNVaW50OEFycmF5KG9iail7cmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihvYmopfHxvYmogaW5zdGFuY2VvZiBPdXJVaW50OEFycmF5fXZhciBkZXN0cm95SW1wbD1yZXF1aXJlKCIuL2ludGVybmFsL3N0cmVhbXMvZGVzdHJveSIpO3V0aWwuaW5oZXJpdHMoV3JpdGFibGUsU3RyZWFtKTtmdW5jdGlvbiBub3AoKXt9ZnVuY3Rpb24gV3JpdGFibGVTdGF0ZShvcHRpb25zLHN0cmVhbSl7RHVwbGV4PUR1cGxleHx8cmVxdWlyZSgiLi9fc3RyZWFtX2R1cGxleCIpO29wdGlvbnM9b3B0aW9uc3x8e307dmFyIGlzRHVwbGV4PXN0cmVhbSBpbnN0YW5jZW9mIER1cGxleDt0aGlzLm9iamVjdE1vZGU9ISFvcHRpb25zLm9iamVjdE1vZGU7aWYoaXNEdXBsZXgpdGhpcy5vYmplY3RNb2RlPXRoaXMub2JqZWN0TW9kZXx8ISFvcHRpb25zLndyaXRhYmxlT2JqZWN0TW9kZTt2YXIgaHdtPW9wdGlvbnMuaGlnaFdhdGVyTWFyazt2YXIgd3JpdGFibGVId209b3B0aW9ucy53cml0YWJsZUhpZ2hXYXRlck1hcms7dmFyIGRlZmF1bHRId209dGhpcy5vYmplY3RNb2RlPzE2OjE2KjEwMjQ7aWYoaHdtfHxod209PT0wKXRoaXMuaGlnaFdhdGVyTWFyaz1od207ZWxzZSBpZihpc0R1cGxleCYmKHdyaXRhYmxlSHdtfHx3cml0YWJsZUh3bT09PTApKXRoaXMuaGlnaFdhdGVyTWFyaz13cml0YWJsZUh3bTtlbHNlIHRoaXMuaGlnaFdhdGVyTWFyaz1kZWZhdWx0SHdtO3RoaXMuaGlnaFdhdGVyTWFyaz1NYXRoLmZsb29yKHRoaXMuaGlnaFdhdGVyTWFyayk7dGhpcy5maW5hbENhbGxlZD1mYWxzZTt0aGlzLm5lZWREcmFpbj1mYWxzZTt0aGlzLmVuZGluZz1mYWxzZTt0aGlzLmVuZGVkPWZhbHNlO3RoaXMuZmluaXNoZWQ9ZmFsc2U7dGhpcy5kZXN0cm95ZWQ9ZmFsc2U7dmFyIG5vRGVjb2RlPW9wdGlvbnMuZGVjb2RlU3RyaW5ncz09PWZhbHNlO3RoaXMuZGVjb2RlU3RyaW5ncz0hbm9EZWNvZGU7dGhpcy5kZWZhdWx0RW5jb2Rpbmc9b3B0aW9ucy5kZWZhdWx0RW5jb2Rpbmd8fCJ1dGY4Ijt0aGlzLmxlbmd0aD0wO3RoaXMud3JpdGluZz1mYWxzZTt0aGlzLmNvcmtlZD0wO3RoaXMuc3luYz10cnVlO3RoaXMuYnVmZmVyUHJvY2Vzc2luZz1mYWxzZTt0aGlzLm9ud3JpdGU9ZnVuY3Rpb24oZXIpe29ud3JpdGUoc3RyZWFtLGVyKX07dGhpcy53cml0ZWNiPW51bGw7dGhpcy53cml0ZWxlbj0wO3RoaXMuYnVmZmVyZWRSZXF1ZXN0PW51bGw7dGhpcy5sYXN0QnVmZmVyZWRSZXF1ZXN0PW51bGw7dGhpcy5wZW5kaW5nY2I9MDt0aGlzLnByZWZpbmlzaGVkPWZhbHNlO3RoaXMuZXJyb3JFbWl0dGVkPWZhbHNlO3RoaXMuYnVmZmVyZWRSZXF1ZXN0Q291bnQ9MDt0aGlzLmNvcmtlZFJlcXVlc3RzRnJlZT1uZXcgQ29ya2VkUmVxdWVzdCh0aGlzKX1Xcml0YWJsZVN0YXRlLnByb3RvdHlwZS5nZXRCdWZmZXI9ZnVuY3Rpb24gZ2V0QnVmZmVyKCl7dmFyIGN1cnJlbnQ9dGhpcy5idWZmZXJlZFJlcXVlc3Q7dmFyIG91dD1bXTt3aGlsZShjdXJyZW50KXtvdXQucHVzaChjdXJyZW50KTtjdXJyZW50PWN1cnJlbnQubmV4dH1yZXR1cm4gb3V0fTsoZnVuY3Rpb24oKXt0cnl7T2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlU3RhdGUucHJvdG90eXBlLCJidWZmZXIiLHtnZXQ6aW50ZXJuYWxVdGlsLmRlcHJlY2F0ZShmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEJ1ZmZlcigpfSwiX3dyaXRhYmxlU3RhdGUuYnVmZmVyIGlzIGRlcHJlY2F0ZWQuIFVzZSBfd3JpdGFibGVTdGF0ZS5nZXRCdWZmZXIgIisiaW5zdGVhZC4iLCJERVAwMDAzIil9KX1jYXRjaChfKXt9fSkoKTt2YXIgcmVhbEhhc0luc3RhbmNlO2lmKHR5cGVvZiBTeW1ib2w9PT0iZnVuY3Rpb24iJiZTeW1ib2wuaGFzSW5zdGFuY2UmJnR5cGVvZiBGdW5jdGlvbi5wcm90b3R5cGVbU3ltYm9sLmhhc0luc3RhbmNlXT09PSJmdW5jdGlvbiIpe3JlYWxIYXNJbnN0YW5jZT1GdW5jdGlvbi5wcm90b3R5cGVbU3ltYm9sLmhhc0luc3RhbmNlXTtPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JpdGFibGUsU3ltYm9sLmhhc0luc3RhbmNlLHt2YWx1ZTpmdW5jdGlvbihvYmplY3Qpe2lmKHJlYWxIYXNJbnN0YW5jZS5jYWxsKHRoaXMsb2JqZWN0KSlyZXR1cm4gdHJ1ZTtpZih0aGlzIT09V3JpdGFibGUpcmV0dXJuIGZhbHNlO3JldHVybiBvYmplY3QmJm9iamVjdC5fd3JpdGFibGVTdGF0ZSBpbnN0YW5jZW9mIFdyaXRhYmxlU3RhdGV9fSl9ZWxzZXtyZWFsSGFzSW5zdGFuY2U9ZnVuY3Rpb24ob2JqZWN0KXtyZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgdGhpc319ZnVuY3Rpb24gV3JpdGFibGUob3B0aW9ucyl7RHVwbGV4PUR1cGxleHx8cmVxdWlyZSgiLi9fc3RyZWFtX2R1cGxleCIpO2lmKCFyZWFsSGFzSW5zdGFuY2UuY2FsbChXcml0YWJsZSx0aGlzKSYmISh0aGlzIGluc3RhbmNlb2YgRHVwbGV4KSl7cmV0dXJuIG5ldyBXcml0YWJsZShvcHRpb25zKX10aGlzLl93cml0YWJsZVN0YXRlPW5ldyBXcml0YWJsZVN0YXRlKG9wdGlvbnMsdGhpcyk7dGhpcy53cml0YWJsZT10cnVlO2lmKG9wdGlvbnMpe2lmKHR5cGVvZiBvcHRpb25zLndyaXRlPT09ImZ1bmN0aW9uIil0aGlzLl93cml0ZT1vcHRpb25zLndyaXRlO2lmKHR5cGVvZiBvcHRpb25zLndyaXRldj09PSJmdW5jdGlvbiIpdGhpcy5fd3JpdGV2PW9wdGlvbnMud3JpdGV2O2lmKHR5cGVvZiBvcHRpb25zLmRlc3Ryb3k9PT0iZnVuY3Rpb24iKXRoaXMuX2Rlc3Ryb3k9b3B0aW9ucy5kZXN0cm95O2lmKHR5cGVvZiBvcHRpb25zLmZpbmFsPT09ImZ1bmN0aW9uIil0aGlzLl9maW5hbD1vcHRpb25zLmZpbmFsfVN0cmVhbS5jYWxsKHRoaXMpfVdyaXRhYmxlLnByb3RvdHlwZS5waXBlPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KCJlcnJvciIsbmV3IEVycm9yKCJDYW5ub3QgcGlwZSwgbm90IHJlYWRhYmxlIikpfTtmdW5jdGlvbiB3cml0ZUFmdGVyRW5kKHN0cmVhbSxjYil7dmFyIGVyPW5ldyBFcnJvcigid3JpdGUgYWZ0ZXIgZW5kIik7c3RyZWFtLmVtaXQoImVycm9yIixlcik7cG5hLm5leHRUaWNrKGNiLGVyKX1mdW5jdGlvbiB2YWxpZENodW5rKHN0cmVhbSxzdGF0ZSxjaHVuayxjYil7dmFyIHZhbGlkPXRydWU7dmFyIGVyPWZhbHNlO2lmKGNodW5rPT09bnVsbCl7ZXI9bmV3IFR5cGVFcnJvcigiTWF5IG5vdCB3cml0ZSBudWxsIHZhbHVlcyB0byBzdHJlYW0iKX1lbHNlIGlmKHR5cGVvZiBjaHVuayE9PSJzdHJpbmciJiZjaHVuayE9PXVuZGVmaW5lZCYmIXN0YXRlLm9iamVjdE1vZGUpe2VyPW5ldyBUeXBlRXJyb3IoIkludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmsiKX1pZihlcil7c3RyZWFtLmVtaXQoImVycm9yIixlcik7cG5hLm5leHRUaWNrKGNiLGVyKTt2YWxpZD1mYWxzZX1yZXR1cm4gdmFsaWR9V3JpdGFibGUucHJvdG90eXBlLndyaXRlPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXt2YXIgc3RhdGU9dGhpcy5fd3JpdGFibGVTdGF0ZTt2YXIgcmV0PWZhbHNlO3ZhciBpc0J1Zj0hc3RhdGUub2JqZWN0TW9kZSYmX2lzVWludDhBcnJheShjaHVuayk7aWYoaXNCdWYmJiFCdWZmZXIuaXNCdWZmZXIoY2h1bmspKXtjaHVuaz1fdWludDhBcnJheVRvQnVmZmVyKGNodW5rKX1pZih0eXBlb2YgZW5jb2Rpbmc9PT0iZnVuY3Rpb24iKXtjYj1lbmNvZGluZztlbmNvZGluZz1udWxsfWlmKGlzQnVmKWVuY29kaW5nPSJidWZmZXIiO2Vsc2UgaWYoIWVuY29kaW5nKWVuY29kaW5nPXN0YXRlLmRlZmF1bHRFbmNvZGluZztpZih0eXBlb2YgY2IhPT0iZnVuY3Rpb24iKWNiPW5vcDtpZihzdGF0ZS5lbmRlZCl3cml0ZUFmdGVyRW5kKHRoaXMsY2IpO2Vsc2UgaWYoaXNCdWZ8fHZhbGlkQ2h1bmsodGhpcyxzdGF0ZSxjaHVuayxjYikpe3N0YXRlLnBlbmRpbmdjYisrO3JldD13cml0ZU9yQnVmZmVyKHRoaXMsc3RhdGUsaXNCdWYsY2h1bmssZW5jb2RpbmcsY2IpfXJldHVybiByZXR9O1dyaXRhYmxlLnByb3RvdHlwZS5jb3JrPWZ1bmN0aW9uKCl7dmFyIHN0YXRlPXRoaXMuX3dyaXRhYmxlU3RhdGU7c3RhdGUuY29ya2VkKyt9O1dyaXRhYmxlLnByb3RvdHlwZS51bmNvcms9ZnVuY3Rpb24oKXt2YXIgc3RhdGU9dGhpcy5fd3JpdGFibGVTdGF0ZTtpZihzdGF0ZS5jb3JrZWQpe3N0YXRlLmNvcmtlZC0tO2lmKCFzdGF0ZS53cml0aW5nJiYhc3RhdGUuY29ya2VkJiYhc3RhdGUuZmluaXNoZWQmJiFzdGF0ZS5idWZmZXJQcm9jZXNzaW5nJiZzdGF0ZS5idWZmZXJlZFJlcXVlc3QpY2xlYXJCdWZmZXIodGhpcyxzdGF0ZSl9fTtXcml0YWJsZS5wcm90b3R5cGUuc2V0RGVmYXVsdEVuY29kaW5nPWZ1bmN0aW9uIHNldERlZmF1bHRFbmNvZGluZyhlbmNvZGluZyl7aWYodHlwZW9mIGVuY29kaW5nPT09InN0cmluZyIpZW5jb2Rpbmc9ZW5jb2RpbmcudG9Mb3dlckNhc2UoKTtpZighKFsiaGV4IiwidXRmOCIsInV0Zi04IiwiYXNjaWkiLCJiaW5hcnkiLCJiYXNlNjQiLCJ1Y3MyIiwidWNzLTIiLCJ1dGYxNmxlIiwidXRmLTE2bGUiLCJyYXciXS5pbmRleE9mKChlbmNvZGluZysiIikudG9Mb3dlckNhc2UoKSk+LTEpKXRocm93IG5ldyBUeXBlRXJyb3IoIlVua25vd24gZW5jb2Rpbmc6ICIrZW5jb2RpbmcpO3RoaXMuX3dyaXRhYmxlU3RhdGUuZGVmYXVsdEVuY29kaW5nPWVuY29kaW5nO3JldHVybiB0aGlzfTtmdW5jdGlvbiBkZWNvZGVDaHVuayhzdGF0ZSxjaHVuayxlbmNvZGluZyl7aWYoIXN0YXRlLm9iamVjdE1vZGUmJnN0YXRlLmRlY29kZVN0cmluZ3MhPT1mYWxzZSYmdHlwZW9mIGNodW5rPT09InN0cmluZyIpe2NodW5rPUJ1ZmZlci5mcm9tKGNodW5rLGVuY29kaW5nKX1yZXR1cm4gY2h1bmt9T2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwid3JpdGFibGVIaWdoV2F0ZXJNYXJrIix7ZW51bWVyYWJsZTpmYWxzZSxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fd3JpdGFibGVTdGF0ZS5oaWdoV2F0ZXJNYXJrfX0pO2Z1bmN0aW9uIHdyaXRlT3JCdWZmZXIoc3RyZWFtLHN0YXRlLGlzQnVmLGNodW5rLGVuY29kaW5nLGNiKXtpZighaXNCdWYpe3ZhciBuZXdDaHVuaz1kZWNvZGVDaHVuayhzdGF0ZSxjaHVuayxlbmNvZGluZyk7aWYoY2h1bmshPT1uZXdDaHVuayl7aXNCdWY9dHJ1ZTtlbmNvZGluZz0iYnVmZmVyIjtjaHVuaz1uZXdDaHVua319dmFyIGxlbj1zdGF0ZS5vYmplY3RNb2RlPzE6Y2h1bmsubGVuZ3RoO3N0YXRlLmxlbmd0aCs9bGVuO3ZhciByZXQ9c3RhdGUubGVuZ3RoPHN0YXRlLmhpZ2hXYXRlck1hcms7aWYoIXJldClzdGF0ZS5uZWVkRHJhaW49dHJ1ZTtpZihzdGF0ZS53cml0aW5nfHxzdGF0ZS5jb3JrZWQpe3ZhciBsYXN0PXN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q7c3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdD17Y2h1bms6Y2h1bmssZW5jb2Rpbmc6ZW5jb2RpbmcsaXNCdWY6aXNCdWYsY2FsbGJhY2s6Y2IsbmV4dDpudWxsfTtpZihsYXN0KXtsYXN0Lm5leHQ9c3RhdGUubGFzdEJ1ZmZlcmVkUmVxdWVzdH1lbHNle3N0YXRlLmJ1ZmZlcmVkUmVxdWVzdD1zdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0fXN0YXRlLmJ1ZmZlcmVkUmVxdWVzdENvdW50Kz0xfWVsc2V7ZG9Xcml0ZShzdHJlYW0sc3RhdGUsZmFsc2UsbGVuLGNodW5rLGVuY29kaW5nLGNiKX1yZXR1cm4gcmV0fWZ1bmN0aW9uIGRvV3JpdGUoc3RyZWFtLHN0YXRlLHdyaXRldixsZW4sY2h1bmssZW5jb2RpbmcsY2Ipe3N0YXRlLndyaXRlbGVuPWxlbjtzdGF0ZS53cml0ZWNiPWNiO3N0YXRlLndyaXRpbmc9dHJ1ZTtzdGF0ZS5zeW5jPXRydWU7aWYod3JpdGV2KXN0cmVhbS5fd3JpdGV2KGNodW5rLHN0YXRlLm9ud3JpdGUpO2Vsc2Ugc3RyZWFtLl93cml0ZShjaHVuayxlbmNvZGluZyxzdGF0ZS5vbndyaXRlKTtzdGF0ZS5zeW5jPWZhbHNlfWZ1bmN0aW9uIG9ud3JpdGVFcnJvcihzdHJlYW0sc3RhdGUsc3luYyxlcixjYil7LS1zdGF0ZS5wZW5kaW5nY2I7aWYoc3luYyl7cG5hLm5leHRUaWNrKGNiLGVyKTtwbmEubmV4dFRpY2soZmluaXNoTWF5YmUsc3RyZWFtLHN0YXRlKTtzdHJlYW0uX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkPXRydWU7c3RyZWFtLmVtaXQoImVycm9yIixlcil9ZWxzZXtjYihlcik7c3RyZWFtLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZD10cnVlO3N0cmVhbS5lbWl0KCJlcnJvciIsZXIpO2ZpbmlzaE1heWJlKHN0cmVhbSxzdGF0ZSl9fWZ1bmN0aW9uIG9ud3JpdGVTdGF0ZVVwZGF0ZShzdGF0ZSl7c3RhdGUud3JpdGluZz1mYWxzZTtzdGF0ZS53cml0ZWNiPW51bGw7c3RhdGUubGVuZ3RoLT1zdGF0ZS53cml0ZWxlbjtzdGF0ZS53cml0ZWxlbj0wfWZ1bmN0aW9uIG9ud3JpdGUoc3RyZWFtLGVyKXt2YXIgc3RhdGU9c3RyZWFtLl93cml0YWJsZVN0YXRlO3ZhciBzeW5jPXN0YXRlLnN5bmM7dmFyIGNiPXN0YXRlLndyaXRlY2I7b253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKTtpZihlcilvbndyaXRlRXJyb3Ioc3RyZWFtLHN0YXRlLHN5bmMsZXIsY2IpO2Vsc2V7dmFyIGZpbmlzaGVkPW5lZWRGaW5pc2goc3RhdGUpO2lmKCFmaW5pc2hlZCYmIXN0YXRlLmNvcmtlZCYmIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcmJnN0YXRlLmJ1ZmZlcmVkUmVxdWVzdCl7Y2xlYXJCdWZmZXIoc3RyZWFtLHN0YXRlKX1pZihzeW5jKXthc3luY1dyaXRlKGFmdGVyV3JpdGUsc3RyZWFtLHN0YXRlLGZpbmlzaGVkLGNiKX1lbHNle2FmdGVyV3JpdGUoc3RyZWFtLHN0YXRlLGZpbmlzaGVkLGNiKX19fWZ1bmN0aW9uIGFmdGVyV3JpdGUoc3RyZWFtLHN0YXRlLGZpbmlzaGVkLGNiKXtpZighZmluaXNoZWQpb253cml0ZURyYWluKHN0cmVhbSxzdGF0ZSk7c3RhdGUucGVuZGluZ2NiLS07Y2IoKTtmaW5pc2hNYXliZShzdHJlYW0sc3RhdGUpfWZ1bmN0aW9uIG9ud3JpdGVEcmFpbihzdHJlYW0sc3RhdGUpe2lmKHN0YXRlLmxlbmd0aD09PTAmJnN0YXRlLm5lZWREcmFpbil7c3RhdGUubmVlZERyYWluPWZhbHNlO3N0cmVhbS5lbWl0KCJkcmFpbiIpfX1mdW5jdGlvbiBjbGVhckJ1ZmZlcihzdHJlYW0sc3RhdGUpe3N0YXRlLmJ1ZmZlclByb2Nlc3Npbmc9dHJ1ZTt2YXIgZW50cnk9c3RhdGUuYnVmZmVyZWRSZXF1ZXN0O2lmKHN0cmVhbS5fd3JpdGV2JiZlbnRyeSYmZW50cnkubmV4dCl7dmFyIGw9c3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQ7dmFyIGJ1ZmZlcj1uZXcgQXJyYXkobCk7dmFyIGhvbGRlcj1zdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWU7aG9sZGVyLmVudHJ5PWVudHJ5O3ZhciBjb3VudD0wO3ZhciBhbGxCdWZmZXJzPXRydWU7d2hpbGUoZW50cnkpe2J1ZmZlcltjb3VudF09ZW50cnk7aWYoIWVudHJ5LmlzQnVmKWFsbEJ1ZmZlcnM9ZmFsc2U7ZW50cnk9ZW50cnkubmV4dDtjb3VudCs9MX1idWZmZXIuYWxsQnVmZmVycz1hbGxCdWZmZXJzO2RvV3JpdGUoc3RyZWFtLHN0YXRlLHRydWUsc3RhdGUubGVuZ3RoLGJ1ZmZlciwiIixob2xkZXIuZmluaXNoKTtzdGF0ZS5wZW5kaW5nY2IrKztzdGF0ZS5sYXN0QnVmZmVyZWRSZXF1ZXN0PW51bGw7aWYoaG9sZGVyLm5leHQpe3N0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZT1ob2xkZXIubmV4dDtob2xkZXIubmV4dD1udWxsfWVsc2V7c3RhdGUuY29ya2VkUmVxdWVzdHNGcmVlPW5ldyBDb3JrZWRSZXF1ZXN0KHN0YXRlKX1zdGF0ZS5idWZmZXJlZFJlcXVlc3RDb3VudD0wfWVsc2V7d2hpbGUoZW50cnkpe3ZhciBjaHVuaz1lbnRyeS5jaHVuazt2YXIgZW5jb2Rpbmc9ZW50cnkuZW5jb2Rpbmc7dmFyIGNiPWVudHJ5LmNhbGxiYWNrO3ZhciBsZW49c3RhdGUub2JqZWN0TW9kZT8xOmNodW5rLmxlbmd0aDtkb1dyaXRlKHN0cmVhbSxzdGF0ZSxmYWxzZSxsZW4sY2h1bmssZW5jb2RpbmcsY2IpO2VudHJ5PWVudHJ5Lm5leHQ7c3RhdGUuYnVmZmVyZWRSZXF1ZXN0Q291bnQtLTtpZihzdGF0ZS53cml0aW5nKXticmVha319aWYoZW50cnk9PT1udWxsKXN0YXRlLmxhc3RCdWZmZXJlZFJlcXVlc3Q9bnVsbH1zdGF0ZS5idWZmZXJlZFJlcXVlc3Q9ZW50cnk7c3RhdGUuYnVmZmVyUHJvY2Vzc2luZz1mYWxzZX1Xcml0YWJsZS5wcm90b3R5cGUuX3dyaXRlPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXtjYihuZXcgRXJyb3IoIl93cml0ZSgpIGlzIG5vdCBpbXBsZW1lbnRlZCIpKX07V3JpdGFibGUucHJvdG90eXBlLl93cml0ZXY9bnVsbDtXcml0YWJsZS5wcm90b3R5cGUuZW5kPWZ1bmN0aW9uKGNodW5rLGVuY29kaW5nLGNiKXt2YXIgc3RhdGU9dGhpcy5fd3JpdGFibGVTdGF0ZTtpZih0eXBlb2YgY2h1bms9PT0iZnVuY3Rpb24iKXtjYj1jaHVuaztjaHVuaz1udWxsO2VuY29kaW5nPW51bGx9ZWxzZSBpZih0eXBlb2YgZW5jb2Rpbmc9PT0iZnVuY3Rpb24iKXtjYj1lbmNvZGluZztlbmNvZGluZz1udWxsfWlmKGNodW5rIT09bnVsbCYmY2h1bmshPT11bmRlZmluZWQpdGhpcy53cml0ZShjaHVuayxlbmNvZGluZyk7aWYoc3RhdGUuY29ya2VkKXtzdGF0ZS5jb3JrZWQ9MTt0aGlzLnVuY29yaygpfWlmKCFzdGF0ZS5lbmRpbmcmJiFzdGF0ZS5maW5pc2hlZCllbmRXcml0YWJsZSh0aGlzLHN0YXRlLGNiKX07ZnVuY3Rpb24gbmVlZEZpbmlzaChzdGF0ZSl7cmV0dXJuIHN0YXRlLmVuZGluZyYmc3RhdGUubGVuZ3RoPT09MCYmc3RhdGUuYnVmZmVyZWRSZXF1ZXN0PT09bnVsbCYmIXN0YXRlLmZpbmlzaGVkJiYhc3RhdGUud3JpdGluZ31mdW5jdGlvbiBjYWxsRmluYWwoc3RyZWFtLHN0YXRlKXtzdHJlYW0uX2ZpbmFsKGZ1bmN0aW9uKGVycil7c3RhdGUucGVuZGluZ2NiLS07aWYoZXJyKXtzdHJlYW0uZW1pdCgiZXJyb3IiLGVycil9c3RhdGUucHJlZmluaXNoZWQ9dHJ1ZTtzdHJlYW0uZW1pdCgicHJlZmluaXNoIik7ZmluaXNoTWF5YmUoc3RyZWFtLHN0YXRlKX0pfWZ1bmN0aW9uIHByZWZpbmlzaChzdHJlYW0sc3RhdGUpe2lmKCFzdGF0ZS5wcmVmaW5pc2hlZCYmIXN0YXRlLmZpbmFsQ2FsbGVkKXtpZih0eXBlb2Ygc3RyZWFtLl9maW5hbD09PSJmdW5jdGlvbiIpe3N0YXRlLnBlbmRpbmdjYisrO3N0YXRlLmZpbmFsQ2FsbGVkPXRydWU7cG5hLm5leHRUaWNrKGNhbGxGaW5hbCxzdHJlYW0sc3RhdGUpfWVsc2V7c3RhdGUucHJlZmluaXNoZWQ9dHJ1ZTtzdHJlYW0uZW1pdCgicHJlZmluaXNoIil9fX1mdW5jdGlvbiBmaW5pc2hNYXliZShzdHJlYW0sc3RhdGUpe3ZhciBuZWVkPW5lZWRGaW5pc2goc3RhdGUpO2lmKG5lZWQpe3ByZWZpbmlzaChzdHJlYW0sc3RhdGUpO2lmKHN0YXRlLnBlbmRpbmdjYj09PTApe3N0YXRlLmZpbmlzaGVkPXRydWU7c3RyZWFtLmVtaXQoImZpbmlzaCIpfX1yZXR1cm4gbmVlZH1mdW5jdGlvbiBlbmRXcml0YWJsZShzdHJlYW0sc3RhdGUsY2Ipe3N0YXRlLmVuZGluZz10cnVlO2ZpbmlzaE1heWJlKHN0cmVhbSxzdGF0ZSk7aWYoY2Ipe2lmKHN0YXRlLmZpbmlzaGVkKXBuYS5uZXh0VGljayhjYik7ZWxzZSBzdHJlYW0ub25jZSgiZmluaXNoIixjYil9c3RhdGUuZW5kZWQ9dHJ1ZTtzdHJlYW0ud3JpdGFibGU9ZmFsc2V9ZnVuY3Rpb24gb25Db3JrZWRGaW5pc2goY29ya1JlcSxzdGF0ZSxlcnIpe3ZhciBlbnRyeT1jb3JrUmVxLmVudHJ5O2NvcmtSZXEuZW50cnk9bnVsbDt3aGlsZShlbnRyeSl7dmFyIGNiPWVudHJ5LmNhbGxiYWNrO3N0YXRlLnBlbmRpbmdjYi0tO2NiKGVycik7ZW50cnk9ZW50cnkubmV4dH1pZihzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWUpe3N0YXRlLmNvcmtlZFJlcXVlc3RzRnJlZS5uZXh0PWNvcmtSZXF9ZWxzZXtzdGF0ZS5jb3JrZWRSZXF1ZXN0c0ZyZWU9Y29ya1JlcX19T2JqZWN0LmRlZmluZVByb3BlcnR5KFdyaXRhYmxlLnByb3RvdHlwZSwiZGVzdHJveWVkIix7Z2V0OmZ1bmN0aW9uKCl7aWYodGhpcy5fd3JpdGFibGVTdGF0ZT09PXVuZGVmaW5lZCl7cmV0dXJuIGZhbHNlfXJldHVybiB0aGlzLl93cml0YWJsZVN0YXRlLmRlc3Ryb3llZH0sc2V0OmZ1bmN0aW9uKHZhbHVlKXtpZighdGhpcy5fd3JpdGFibGVTdGF0ZSl7cmV0dXJufXRoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkPXZhbHVlfX0pO1dyaXRhYmxlLnByb3RvdHlwZS5kZXN0cm95PWRlc3Ryb3lJbXBsLmRlc3Ryb3k7V3JpdGFibGUucHJvdG90eXBlLl91bmRlc3Ryb3k9ZGVzdHJveUltcGwudW5kZXN0cm95O1dyaXRhYmxlLnByb3RvdHlwZS5fZGVzdHJveT1mdW5jdGlvbihlcnIsY2Ipe3RoaXMuZW5kKCk7Y2IoZXJyKX19KS5jYWxsKHRoaXMscmVxdWlyZSgiX3Byb2Nlc3MiKSx0eXBlb2YgZ2xvYmFsIT09InVuZGVmaW5lZCI/Z2xvYmFsOnR5cGVvZiBzZWxmIT09InVuZGVmaW5lZCI/c2VsZjp0eXBlb2Ygd2luZG93IT09InVuZGVmaW5lZCI/d2luZG93Ont9LHJlcXVpcmUoInRpbWVycyIpLnNldEltbWVkaWF0ZSl9LHsiLi9fc3RyZWFtX2R1cGxleCI6NjUsIi4vaW50ZXJuYWwvc3RyZWFtcy9kZXN0cm95Ijo3MSwiLi9pbnRlcm5hbC9zdHJlYW1zL3N0cmVhbSI6NzIsX3Byb2Nlc3M6NjIsImNvcmUtdXRpbC1pcyI6MjgsaW5oZXJpdHM6MzQsInByb2Nlc3MtbmV4dGljay1hcmdzIjo2MSwic2FmZS1idWZmZXIiOjc4LHRpbWVyczo5OSwidXRpbC1kZXByZWNhdGUiOjEwMH1dLDcwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsidXNlIHN0cmljdCI7ZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLENvbnN0cnVjdG9yKXtpZighKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24iKX19dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgdXRpbD1yZXF1aXJlKCJ1dGlsIik7ZnVuY3Rpb24gY29weUJ1ZmZlcihzcmMsdGFyZ2V0LG9mZnNldCl7c3JjLmNvcHkodGFyZ2V0LG9mZnNldCl9bW9kdWxlLmV4cG9ydHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBCdWZmZXJMaXN0KCl7X2NsYXNzQ2FsbENoZWNrKHRoaXMsQnVmZmVyTGlzdCk7dGhpcy5oZWFkPW51bGw7dGhpcy50YWlsPW51bGw7dGhpcy5sZW5ndGg9MH1CdWZmZXJMaXN0LnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uIHB1c2godil7dmFyIGVudHJ5PXtkYXRhOnYsbmV4dDpudWxsfTtpZih0aGlzLmxlbmd0aD4wKXRoaXMudGFpbC5uZXh0PWVudHJ5O2Vsc2UgdGhpcy5oZWFkPWVudHJ5O3RoaXMudGFpbD1lbnRyeTsrK3RoaXMubGVuZ3RofTtCdWZmZXJMaXN0LnByb3RvdHlwZS51bnNoaWZ0PWZ1bmN0aW9uIHVuc2hpZnQodil7dmFyIGVudHJ5PXtkYXRhOnYsbmV4dDp0aGlzLmhlYWR9O2lmKHRoaXMubGVuZ3RoPT09MCl0aGlzLnRhaWw9ZW50cnk7dGhpcy5oZWFkPWVudHJ5OysrdGhpcy5sZW5ndGh9O0J1ZmZlckxpc3QucHJvdG90eXBlLnNoaWZ0PWZ1bmN0aW9uIHNoaWZ0KCl7aWYodGhpcy5sZW5ndGg9PT0wKXJldHVybjt2YXIgcmV0PXRoaXMuaGVhZC5kYXRhO2lmKHRoaXMubGVuZ3RoPT09MSl0aGlzLmhlYWQ9dGhpcy50YWlsPW51bGw7ZWxzZSB0aGlzLmhlYWQ9dGhpcy5oZWFkLm5leHQ7LS10aGlzLmxlbmd0aDtyZXR1cm4gcmV0fTtCdWZmZXJMaXN0LnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbiBjbGVhcigpe3RoaXMuaGVhZD10aGlzLnRhaWw9bnVsbDt0aGlzLmxlbmd0aD0wfTtCdWZmZXJMaXN0LnByb3RvdHlwZS5qb2luPWZ1bmN0aW9uIGpvaW4ocyl7aWYodGhpcy5sZW5ndGg9PT0wKXJldHVybiIiO3ZhciBwPXRoaXMuaGVhZDt2YXIgcmV0PSIiK3AuZGF0YTt3aGlsZShwPXAubmV4dCl7cmV0Kz1zK3AuZGF0YX1yZXR1cm4gcmV0fTtCdWZmZXJMaXN0LnByb3RvdHlwZS5jb25jYXQ9ZnVuY3Rpb24gY29uY2F0KG4pe2lmKHRoaXMubGVuZ3RoPT09MClyZXR1cm4gQnVmZmVyLmFsbG9jKDApO2lmKHRoaXMubGVuZ3RoPT09MSlyZXR1cm4gdGhpcy5oZWFkLmRhdGE7dmFyIHJldD1CdWZmZXIuYWxsb2NVbnNhZmUobj4+PjApO3ZhciBwPXRoaXMuaGVhZDt2YXIgaT0wO3doaWxlKHApe2NvcHlCdWZmZXIocC5kYXRhLHJldCxpKTtpKz1wLmRhdGEubGVuZ3RoO3A9cC5uZXh0fXJldHVybiByZXR9O3JldHVybiBCdWZmZXJMaXN0fSgpO2lmKHV0aWwmJnV0aWwuaW5zcGVjdCYmdXRpbC5pbnNwZWN0LmN1c3RvbSl7bW9kdWxlLmV4cG9ydHMucHJvdG90eXBlW3V0aWwuaW5zcGVjdC5jdXN0b21dPWZ1bmN0aW9uKCl7dmFyIG9iaj11dGlsLmluc3BlY3Qoe2xlbmd0aDp0aGlzLmxlbmd0aH0pO3JldHVybiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUrIiAiK29ian19fSx7InNhZmUtYnVmZmVyIjo3OCx1dGlsOjI0fV0sNzE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgcG5hPXJlcXVpcmUoInByb2Nlc3MtbmV4dGljay1hcmdzIik7ZnVuY3Rpb24gZGVzdHJveShlcnIsY2Ipe3ZhciBfdGhpcz10aGlzO3ZhciByZWFkYWJsZURlc3Ryb3llZD10aGlzLl9yZWFkYWJsZVN0YXRlJiZ0aGlzLl9yZWFkYWJsZVN0YXRlLmRlc3Ryb3llZDt2YXIgd3JpdGFibGVEZXN0cm95ZWQ9dGhpcy5fd3JpdGFibGVTdGF0ZSYmdGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQ7aWYocmVhZGFibGVEZXN0cm95ZWR8fHdyaXRhYmxlRGVzdHJveWVkKXtpZihjYil7Y2IoZXJyKX1lbHNlIGlmKGVyciYmKCF0aGlzLl93cml0YWJsZVN0YXRlfHwhdGhpcy5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQpKXtwbmEubmV4dFRpY2soZW1pdEVycm9yTlQsdGhpcyxlcnIpfXJldHVybiB0aGlzfWlmKHRoaXMuX3JlYWRhYmxlU3RhdGUpe3RoaXMuX3JlYWRhYmxlU3RhdGUuZGVzdHJveWVkPXRydWV9aWYodGhpcy5fd3JpdGFibGVTdGF0ZSl7dGhpcy5fd3JpdGFibGVTdGF0ZS5kZXN0cm95ZWQ9dHJ1ZX10aGlzLl9kZXN0cm95KGVycnx8bnVsbCxmdW5jdGlvbihlcnIpe2lmKCFjYiYmZXJyKXtwbmEubmV4dFRpY2soZW1pdEVycm9yTlQsX3RoaXMsZXJyKTtpZihfdGhpcy5fd3JpdGFibGVTdGF0ZSl7X3RoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkPXRydWV9fWVsc2UgaWYoY2Ipe2NiKGVycil9fSk7cmV0dXJuIHRoaXN9ZnVuY3Rpb24gdW5kZXN0cm95KCl7aWYodGhpcy5fcmVhZGFibGVTdGF0ZSl7dGhpcy5fcmVhZGFibGVTdGF0ZS5kZXN0cm95ZWQ9ZmFsc2U7dGhpcy5fcmVhZGFibGVTdGF0ZS5yZWFkaW5nPWZhbHNlO3RoaXMuX3JlYWRhYmxlU3RhdGUuZW5kZWQ9ZmFsc2U7dGhpcy5fcmVhZGFibGVTdGF0ZS5lbmRFbWl0dGVkPWZhbHNlfWlmKHRoaXMuX3dyaXRhYmxlU3RhdGUpe3RoaXMuX3dyaXRhYmxlU3RhdGUuZGVzdHJveWVkPWZhbHNlO3RoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQ9ZmFsc2U7dGhpcy5fd3JpdGFibGVTdGF0ZS5lbmRpbmc9ZmFsc2U7dGhpcy5fd3JpdGFibGVTdGF0ZS5maW5pc2hlZD1mYWxzZTt0aGlzLl93cml0YWJsZVN0YXRlLmVycm9yRW1pdHRlZD1mYWxzZX19ZnVuY3Rpb24gZW1pdEVycm9yTlQoc2VsZixlcnIpe3NlbGYuZW1pdCgiZXJyb3IiLGVycil9bW9kdWxlLmV4cG9ydHM9e2Rlc3Ryb3k6ZGVzdHJveSx1bmRlc3Ryb3k6dW5kZXN0cm95fX0seyJwcm9jZXNzLW5leHRpY2stYXJncyI6NjF9XSw3MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgiZXZlbnRzIikuRXZlbnRFbWl0dGVyfSx7ZXZlbnRzOjMxfV0sNzM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXJlcXVpcmUoIi4vcmVhZGFibGUiKS5QYXNzVGhyb3VnaH0seyIuL3JlYWRhYmxlIjo3NH1dLDc0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtleHBvcnRzPW1vZHVsZS5leHBvcnRzPXJlcXVpcmUoIi4vbGliL19zdHJlYW1fcmVhZGFibGUuanMiKTtleHBvcnRzLlN0cmVhbT1leHBvcnRzO2V4cG9ydHMuUmVhZGFibGU9ZXhwb3J0cztleHBvcnRzLldyaXRhYmxlPXJlcXVpcmUoIi4vbGliL19zdHJlYW1fd3JpdGFibGUuanMiKTtleHBvcnRzLkR1cGxleD1yZXF1aXJlKCIuL2xpYi9fc3RyZWFtX2R1cGxleC5qcyIpO2V4cG9ydHMuVHJhbnNmb3JtPXJlcXVpcmUoIi4vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzIik7ZXhwb3J0cy5QYXNzVGhyb3VnaD1yZXF1aXJlKCIuL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzIil9LHsiLi9saWIvX3N0cmVhbV9kdXBsZXguanMiOjY1LCIuL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzIjo2NiwiLi9saWIvX3N0cmVhbV9yZWFkYWJsZS5qcyI6NjcsIi4vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzIjo2OCwiLi9saWIvX3N0cmVhbV93cml0YWJsZS5qcyI6Njl9XSw3NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9cmVxdWlyZSgiLi9yZWFkYWJsZSIpLlRyYW5zZm9ybX0seyIuL3JlYWRhYmxlIjo3NH1dLDc2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1yZXF1aXJlKCIuL2xpYi9fc3RyZWFtX3dyaXRhYmxlLmpzIil9LHsiLi9saWIvX3N0cmVhbV93cml0YWJsZS5qcyI6Njl9XSw3NzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7InVzZSBzdHJpY3QiO3ZhciBCdWZmZXI9cmVxdWlyZSgiYnVmZmVyIikuQnVmZmVyO3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBIYXNoQmFzZT1yZXF1aXJlKCJoYXNoLWJhc2UiKTt2YXIgQVJSQVkxNj1uZXcgQXJyYXkoMTYpO3ZhciB6bD1bMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSw3LDQsMTMsMSwxMCw2LDE1LDMsMTIsMCw5LDUsMiwxNCwxMSw4LDMsMTAsMTQsNCw5LDE1LDgsMSwyLDcsMCw2LDEzLDExLDUsMTIsMSw5LDExLDEwLDAsOCwxMiw0LDEzLDMsNywxNSwxNCw1LDYsMiw0LDAsNSw5LDcsMTIsMiwxMCwxNCwxLDMsOCwxMSw2LDE1LDEzXTt2YXIgenI9WzUsMTQsNywwLDksMiwxMSw0LDEzLDYsMTUsOCwxLDEwLDMsMTIsNiwxMSwzLDcsMCwxMyw1LDEwLDE0LDE1LDgsMTIsNCw5LDEsMiwxNSw1LDEsMyw3LDE0LDYsOSwxMSw4LDEyLDIsMTAsMCw0LDEzLDgsNiw0LDEsMywxMSwxNSwwLDUsMTIsMiwxMyw5LDcsMTAsMTQsMTIsMTUsMTAsNCwxLDUsOCw3LDYsMiwxMywxNCwwLDMsOSwxMV07dmFyIHNsPVsxMSwxNCwxNSwxMiw1LDgsNyw5LDExLDEzLDE0LDE1LDYsNyw5LDgsNyw2LDgsMTMsMTEsOSw3LDE1LDcsMTIsMTUsOSwxMSw3LDEzLDEyLDExLDEzLDYsNywxNCw5LDEzLDE1LDE0LDgsMTMsNiw1LDEyLDcsNSwxMSwxMiwxNCwxNSwxNCwxNSw5LDgsOSwxNCw1LDYsOCw2LDUsMTIsOSwxNSw1LDExLDYsOCwxMywxMiw1LDEyLDEzLDE0LDExLDgsNSw2XTt2YXIgc3I9WzgsOSw5LDExLDEzLDE1LDE1LDUsNyw3LDgsMTEsMTQsMTQsMTIsNiw5LDEzLDE1LDcsMTIsOCw5LDExLDcsNywxMiw3LDYsMTUsMTMsMTEsOSw3LDE1LDExLDgsNiw2LDE0LDEyLDEzLDUsMTQsMTMsMTMsNyw1LDE1LDUsOCwxMSwxNCwxNCw2LDE0LDYsOSwxMiw5LDEyLDUsMTUsOCw4LDUsMTIsOSwxMiw1LDE0LDYsOCwxMyw2LDUsMTUsMTMsMTEsMTFdO3ZhciBobD1bMCwxNTE4NTAwMjQ5LDE4NTk3NzUzOTMsMjQwMDk1OTcwOCwyODQwODUzODM4XTt2YXIgaHI9WzEzNTI4Mjk5MjYsMTU0ODYwMzY4NCwxODM2MDcyNjkxLDIwNTM5OTQyMTcsMF07ZnVuY3Rpb24gUklQRU1EMTYwKCl7SGFzaEJhc2UuY2FsbCh0aGlzLDY0KTt0aGlzLl9hPTE3MzI1ODQxOTM7dGhpcy5fYj00MDIzMjMzNDE3O3RoaXMuX2M9MjU2MjM4MzEwMjt0aGlzLl9kPTI3MTczMzg3ODt0aGlzLl9lPTMyODUzNzc1MjB9aW5oZXJpdHMoUklQRU1EMTYwLEhhc2hCYXNlKTtSSVBFTUQxNjAucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oKXt2YXIgd29yZHM9QVJSQVkxNjtmb3IodmFyIGo9MDtqPDE2Oysrail3b3Jkc1tqXT10aGlzLl9ibG9jay5yZWFkSW50MzJMRShqKjQpO3ZhciBhbD10aGlzLl9hfDA7dmFyIGJsPXRoaXMuX2J8MDt2YXIgY2w9dGhpcy5fY3wwO3ZhciBkbD10aGlzLl9kfDA7dmFyIGVsPXRoaXMuX2V8MDt2YXIgYXI9dGhpcy5fYXwwO3ZhciBicj10aGlzLl9ifDA7dmFyIGNyPXRoaXMuX2N8MDt2YXIgZHI9dGhpcy5fZHwwO3ZhciBlcj10aGlzLl9lfDA7Zm9yKHZhciBpPTA7aTw4MDtpKz0xKXt2YXIgdGw7dmFyIHRyO2lmKGk8MTYpe3RsPWZuMShhbCxibCxjbCxkbCxlbCx3b3Jkc1t6bFtpXV0saGxbMF0sc2xbaV0pO3RyPWZuNShhcixicixjcixkcixlcix3b3Jkc1t6cltpXV0saHJbMF0sc3JbaV0pfWVsc2UgaWYoaTwzMil7dGw9Zm4yKGFsLGJsLGNsLGRsLGVsLHdvcmRzW3psW2ldXSxobFsxXSxzbFtpXSk7dHI9Zm40KGFyLGJyLGNyLGRyLGVyLHdvcmRzW3pyW2ldXSxoclsxXSxzcltpXSl9ZWxzZSBpZihpPDQ4KXt0bD1mbjMoYWwsYmwsY2wsZGwsZWwsd29yZHNbemxbaV1dLGhsWzJdLHNsW2ldKTt0cj1mbjMoYXIsYnIsY3IsZHIsZXIsd29yZHNbenJbaV1dLGhyWzJdLHNyW2ldKX1lbHNlIGlmKGk8NjQpe3RsPWZuNChhbCxibCxjbCxkbCxlbCx3b3Jkc1t6bFtpXV0saGxbM10sc2xbaV0pO3RyPWZuMihhcixicixjcixkcixlcix3b3Jkc1t6cltpXV0saHJbM10sc3JbaV0pfWVsc2V7dGw9Zm41KGFsLGJsLGNsLGRsLGVsLHdvcmRzW3psW2ldXSxobFs0XSxzbFtpXSk7dHI9Zm4xKGFyLGJyLGNyLGRyLGVyLHdvcmRzW3pyW2ldXSxocls0XSxzcltpXSl9YWw9ZWw7ZWw9ZGw7ZGw9cm90bChjbCwxMCk7Y2w9Ymw7Ymw9dGw7YXI9ZXI7ZXI9ZHI7ZHI9cm90bChjciwxMCk7Y3I9YnI7YnI9dHJ9dmFyIHQ9dGhpcy5fYitjbCtkcnwwO3RoaXMuX2I9dGhpcy5fYytkbCtlcnwwO3RoaXMuX2M9dGhpcy5fZCtlbCthcnwwO3RoaXMuX2Q9dGhpcy5fZSthbCticnwwO3RoaXMuX2U9dGhpcy5fYStibCtjcnwwO3RoaXMuX2E9dH07UklQRU1EMTYwLnByb3RvdHlwZS5fZGlnZXN0PWZ1bmN0aW9uKCl7dGhpcy5fYmxvY2tbdGhpcy5fYmxvY2tPZmZzZXQrK109MTI4O2lmKHRoaXMuX2Jsb2NrT2Zmc2V0PjU2KXt0aGlzLl9ibG9jay5maWxsKDAsdGhpcy5fYmxvY2tPZmZzZXQsNjQpO3RoaXMuX3VwZGF0ZSgpO3RoaXMuX2Jsb2NrT2Zmc2V0PTB9dGhpcy5fYmxvY2suZmlsbCgwLHRoaXMuX2Jsb2NrT2Zmc2V0LDU2KTt0aGlzLl9ibG9jay53cml0ZVVJbnQzMkxFKHRoaXMuX2xlbmd0aFswXSw1Nik7dGhpcy5fYmxvY2sud3JpdGVVSW50MzJMRSh0aGlzLl9sZW5ndGhbMV0sNjApO3RoaXMuX3VwZGF0ZSgpO3ZhciBidWZmZXI9QnVmZmVyLmFsbG9jP0J1ZmZlci5hbGxvYygyMCk6bmV3IEJ1ZmZlcigyMCk7YnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9hLDApO2J1ZmZlci53cml0ZUludDMyTEUodGhpcy5fYiw0KTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2MsOCk7YnVmZmVyLndyaXRlSW50MzJMRSh0aGlzLl9kLDEyKTtidWZmZXIud3JpdGVJbnQzMkxFKHRoaXMuX2UsMTYpO3JldHVybiBidWZmZXJ9O2Z1bmN0aW9uIHJvdGwoeCxuKXtyZXR1cm4geDw8bnx4Pj4+MzItbn1mdW5jdGlvbiBmbjEoYSxiLGMsZCxlLG0sayxzKXtyZXR1cm4gcm90bChhKyhiXmNeZCkrbStrfDAscykrZXwwfWZ1bmN0aW9uIGZuMihhLGIsYyxkLGUsbSxrLHMpe3JldHVybiByb3RsKGErKGImY3x+YiZkKSttK2t8MCxzKStlfDB9ZnVuY3Rpb24gZm4zKGEsYixjLGQsZSxtLGsscyl7cmV0dXJuIHJvdGwoYSsoKGJ8fmMpXmQpK20ra3wwLHMpK2V8MH1mdW5jdGlvbiBmbjQoYSxiLGMsZCxlLG0sayxzKXtyZXR1cm4gcm90bChhKyhiJmR8YyZ+ZCkrbStrfDAscykrZXwwfWZ1bmN0aW9uIGZuNShhLGIsYyxkLGUsbSxrLHMpe3JldHVybiByb3RsKGErKGJeKGN8fmQpKSttK2t8MCxzKStlfDB9bW9kdWxlLmV4cG9ydHM9UklQRU1EMTYwfSx7YnVmZmVyOjI1LCJoYXNoLWJhc2UiOjMyLGluaGVyaXRzOjM0fV0sNzg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBidWZmZXI9cmVxdWlyZSgiYnVmZmVyIik7dmFyIEJ1ZmZlcj1idWZmZXIuQnVmZmVyO2Z1bmN0aW9uIGNvcHlQcm9wcyhzcmMsZHN0KXtmb3IodmFyIGtleSBpbiBzcmMpe2RzdFtrZXldPXNyY1trZXldfX1pZihCdWZmZXIuZnJvbSYmQnVmZmVyLmFsbG9jJiZCdWZmZXIuYWxsb2NVbnNhZmUmJkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cpe21vZHVsZS5leHBvcnRzPWJ1ZmZlcn1lbHNle2NvcHlQcm9wcyhidWZmZXIsZXhwb3J0cyk7ZXhwb3J0cy5CdWZmZXI9U2FmZUJ1ZmZlcn1mdW5jdGlvbiBTYWZlQnVmZmVyKGFyZyxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl7cmV0dXJuIEJ1ZmZlcihhcmcsZW5jb2RpbmdPck9mZnNldCxsZW5ndGgpfWNvcHlQcm9wcyhCdWZmZXIsU2FmZUJ1ZmZlcik7U2FmZUJ1ZmZlci5mcm9tPWZ1bmN0aW9uKGFyZyxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl7aWYodHlwZW9mIGFyZz09PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJBcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlciIpfXJldHVybiBCdWZmZXIoYXJnLGVuY29kaW5nT3JPZmZzZXQsbGVuZ3RoKX07U2FmZUJ1ZmZlci5hbGxvYz1mdW5jdGlvbihzaXplLGZpbGwsZW5jb2Rpbmcpe2lmKHR5cGVvZiBzaXplIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoIkFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXIiKX12YXIgYnVmPUJ1ZmZlcihzaXplKTtpZihmaWxsIT09dW5kZWZpbmVkKXtpZih0eXBlb2YgZW5jb2Rpbmc9PT0ic3RyaW5nIil7YnVmLmZpbGwoZmlsbCxlbmNvZGluZyl9ZWxzZXtidWYuZmlsbChmaWxsKX19ZWxzZXtidWYuZmlsbCgwKX1yZXR1cm4gYnVmfTtTYWZlQnVmZmVyLmFsbG9jVW5zYWZlPWZ1bmN0aW9uKHNpemUpe2lmKHR5cGVvZiBzaXplIT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoIkFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXIiKX1yZXR1cm4gQnVmZmVyKHNpemUpfTtTYWZlQnVmZmVyLmFsbG9jVW5zYWZlU2xvdz1mdW5jdGlvbihzaXplKXtpZih0eXBlb2Ygc2l6ZSE9PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyIil9cmV0dXJuIGJ1ZmZlci5TbG93QnVmZmVyKHNpemUpfX0se2J1ZmZlcjoyNX1dLDc5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24ocHJvY2Vzcyl7InVzZSBzdHJpY3QiO3ZhciBidWZmZXI9cmVxdWlyZSgiYnVmZmVyIik7dmFyIEJ1ZmZlcj1idWZmZXIuQnVmZmVyO3ZhciBzYWZlcj17fTt2YXIga2V5O2ZvcihrZXkgaW4gYnVmZmVyKXtpZighYnVmZmVyLmhhc093blByb3BlcnR5KGtleSkpY29udGludWU7aWYoa2V5PT09IlNsb3dCdWZmZXIifHxrZXk9PT0iQnVmZmVyIiljb250aW51ZTtzYWZlcltrZXldPWJ1ZmZlcltrZXldfXZhciBTYWZlcj1zYWZlci5CdWZmZXI9e307Zm9yKGtleSBpbiBCdWZmZXIpe2lmKCFCdWZmZXIuaGFzT3duUHJvcGVydHkoa2V5KSljb250aW51ZTtpZihrZXk9PT0iYWxsb2NVbnNhZmUifHxrZXk9PT0iYWxsb2NVbnNhZmVTbG93Iiljb250aW51ZTtTYWZlcltrZXldPUJ1ZmZlcltrZXldfXNhZmVyLkJ1ZmZlci5wcm90b3R5cGU9QnVmZmVyLnByb3RvdHlwZTtpZighU2FmZXIuZnJvbXx8U2FmZXIuZnJvbT09PVVpbnQ4QXJyYXkuZnJvbSl7U2FmZXIuZnJvbT1mdW5jdGlvbih2YWx1ZSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl7aWYodHlwZW9mIHZhbHVlPT09Im51bWJlciIpe3Rocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSAidmFsdWUiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlICcrdHlwZW9mIHZhbHVlKX1pZih2YWx1ZSYmdHlwZW9mIHZhbHVlLmxlbmd0aD09PSJ1bmRlZmluZWQiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCJUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAiK3R5cGVvZiB2YWx1ZSl9cmV0dXJuIEJ1ZmZlcih2YWx1ZSxlbmNvZGluZ09yT2Zmc2V0LGxlbmd0aCl9fWlmKCFTYWZlci5hbGxvYyl7U2FmZXIuYWxsb2M9ZnVuY3Rpb24oc2l6ZSxmaWxsLGVuY29kaW5nKXtpZih0eXBlb2Ygc2l6ZSE9PSJudW1iZXIiKXt0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgInNpemUiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBudW1iZXIuIFJlY2VpdmVkIHR5cGUgJyt0eXBlb2Ygc2l6ZSl9aWYoc2l6ZTwwfHxzaXplPj0yKigxPDwzMCkpe3Rocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgIicrc2l6ZSsnIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gInNpemUiJyl9dmFyIGJ1Zj1CdWZmZXIoc2l6ZSk7aWYoIWZpbGx8fGZpbGwubGVuZ3RoPT09MCl7YnVmLmZpbGwoMCl9ZWxzZSBpZih0eXBlb2YgZW5jb2Rpbmc9PT0ic3RyaW5nIil7YnVmLmZpbGwoZmlsbCxlbmNvZGluZyl9ZWxzZXtidWYuZmlsbChmaWxsKX1yZXR1cm4gYnVmfX1pZighc2FmZXIua1N0cmluZ01heExlbmd0aCl7dHJ5e3NhZmVyLmtTdHJpbmdNYXhMZW5ndGg9cHJvY2Vzcy5iaW5kaW5nKCJidWZmZXIiKS5rU3RyaW5nTWF4TGVuZ3RofWNhdGNoKGUpe319aWYoIXNhZmVyLmNvbnN0YW50cyl7c2FmZXIuY29uc3RhbnRzPXtNQVhfTEVOR1RIOnNhZmVyLmtNYXhMZW5ndGh9O2lmKHNhZmVyLmtTdHJpbmdNYXhMZW5ndGgpe3NhZmVyLmNvbnN0YW50cy5NQVhfU1RSSU5HX0xFTkdUSD1zYWZlci5rU3RyaW5nTWF4TGVuZ3RofX1tb2R1bGUuZXhwb3J0cz1zYWZlcn0pLmNhbGwodGhpcyxyZXF1aXJlKCJfcHJvY2VzcyIpKX0se19wcm9jZXNzOjYyLGJ1ZmZlcjoyNX1dLDgwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oQnVmZmVyKXt2YXIgcGJrZGYyPXJlcXVpcmUoInBia2RmMiIpO3ZhciBNQVhfVkFMVUU9MjE0NzQ4MzY0NztmdW5jdGlvbiBzY3J5cHQoa2V5LHNhbHQsTixyLHAsZGtMZW4scHJvZ3Jlc3NDYWxsYmFjayl7aWYoTj09PTB8fChOJk4tMSkhPT0wKXRocm93IEVycm9yKCJOIG11c3QgYmUgPiAwIGFuZCBhIHBvd2VyIG9mIDIiKTtpZihOPk1BWF9WQUxVRS8xMjgvcil0aHJvdyBFcnJvcigiUGFyYW1ldGVyIE4gaXMgdG9vIGxhcmdlIik7aWYocj5NQVhfVkFMVUUvMTI4L3ApdGhyb3cgRXJyb3IoIlBhcmFtZXRlciByIGlzIHRvbyBsYXJnZSIpO3ZhciBYWT1uZXcgQnVmZmVyKDI1NipyKTt2YXIgVj1uZXcgQnVmZmVyKDEyOCpyKk4pO3ZhciBCMzI9bmV3IEludDMyQXJyYXkoMTYpO3ZhciB4PW5ldyBJbnQzMkFycmF5KDE2KTt2YXIgX1g9bmV3IEJ1ZmZlcig2NCk7dmFyIEI9cGJrZGYyLnBia2RmMlN5bmMoa2V5LHNhbHQsMSxwKjEyOCpyLCJzaGEyNTYiKTt2YXIgdGlja0NhbGxiYWNrO2lmKHByb2dyZXNzQ2FsbGJhY2spe3ZhciB0b3RhbE9wcz1wKk4qMjt2YXIgY3VycmVudE9wPTA7dGlja0NhbGxiYWNrPWZ1bmN0aW9uKCl7KytjdXJyZW50T3A7aWYoY3VycmVudE9wJTFlMz09PTApe3Byb2dyZXNzQ2FsbGJhY2soe2N1cnJlbnQ6Y3VycmVudE9wLHRvdGFsOnRvdGFsT3BzLHBlcmNlbnQ6Y3VycmVudE9wL3RvdGFsT3BzKjEwMH0pfX19Zm9yKHZhciBpPTA7aTxwO2krKyl7c21peChCLGkqMTI4KnIscixOLFYsWFkpfXJldHVybiBwYmtkZjIucGJrZGYyU3luYyhrZXksQiwxLGRrTGVuLCJzaGEyNTYiKTtmdW5jdGlvbiBzbWl4KEIsQmkscixOLFYsWFkpe3ZhciBYaT0wO3ZhciBZaT0xMjgqcjt2YXIgaTtCLmNvcHkoWFksWGksQmksQmkrWWkpO2ZvcihpPTA7aTxOO2krKyl7WFkuY29weShWLGkqWWksWGksWGkrWWkpO2Jsb2NrbWl4X3NhbHNhOChYWSxYaSxZaSxyKTtpZih0aWNrQ2FsbGJhY2spdGlja0NhbGxiYWNrKCl9Zm9yKGk9MDtpPE47aSsrKXt2YXIgb2Zmc2V0PVhpKygyKnItMSkqNjQ7dmFyIGo9WFkucmVhZFVJbnQzMkxFKG9mZnNldCkmTi0xO2Jsb2NreG9yKFYsaipZaSxYWSxYaSxZaSk7YmxvY2ttaXhfc2Fsc2E4KFhZLFhpLFlpLHIpO2lmKHRpY2tDYWxsYmFjayl0aWNrQ2FsbGJhY2soKX1YWS5jb3B5KEIsQmksWGksWGkrWWkpfWZ1bmN0aW9uIGJsb2NrbWl4X3NhbHNhOChCWSxCaSxZaSxyKXt2YXIgaTthcnJheWNvcHkoQlksQmkrKDIqci0xKSo2NCxfWCwwLDY0KTtmb3IoaT0wO2k8MipyO2krKyl7YmxvY2t4b3IoQlksaSo2NCxfWCwwLDY0KTtzYWxzYTIwXzgoX1gpO2FycmF5Y29weShfWCwwLEJZLFlpK2kqNjQsNjQpfWZvcihpPTA7aTxyO2krKyl7YXJyYXljb3B5KEJZLFlpK2kqMio2NCxCWSxCaStpKjY0LDY0KX1mb3IoaT0wO2k8cjtpKyspe2FycmF5Y29weShCWSxZaSsoaSoyKzEpKjY0LEJZLEJpKyhpK3IpKjY0LDY0KX19ZnVuY3Rpb24gUihhLGIpe3JldHVybiBhPDxifGE+Pj4zMi1ifWZ1bmN0aW9uIHNhbHNhMjBfOChCKXt2YXIgaTtmb3IoaT0wO2k8MTY7aSsrKXtCMzJbaV09KEJbaSo0KzBdJjI1NSk8PDA7QjMyW2ldfD0oQltpKjQrMV0mMjU1KTw8ODtCMzJbaV18PShCW2kqNCsyXSYyNTUpPDwxNjtCMzJbaV18PShCW2kqNCszXSYyNTUpPDwyNH1hcnJheWNvcHkoQjMyLDAseCwwLDE2KTtmb3IoaT04O2k+MDtpLT0yKXt4WzRdXj1SKHhbMF0reFsxMl0sNyk7eFs4XV49Uih4WzRdK3hbMF0sOSk7eFsxMl1ePVIoeFs4XSt4WzRdLDEzKTt4WzBdXj1SKHhbMTJdK3hbOF0sMTgpO3hbOV1ePVIoeFs1XSt4WzFdLDcpO3hbMTNdXj1SKHhbOV0reFs1XSw5KTt4WzFdXj1SKHhbMTNdK3hbOV0sMTMpO3hbNV1ePVIoeFsxXSt4WzEzXSwxOCk7eFsxNF1ePVIoeFsxMF0reFs2XSw3KTt4WzJdXj1SKHhbMTRdK3hbMTBdLDkpO3hbNl1ePVIoeFsyXSt4WzE0XSwxMyk7eFsxMF1ePVIoeFs2XSt4WzJdLDE4KTt4WzNdXj1SKHhbMTVdK3hbMTFdLDcpO3hbN11ePVIoeFszXSt4WzE1XSw5KTt4WzExXV49Uih4WzddK3hbM10sMTMpO3hbMTVdXj1SKHhbMTFdK3hbN10sMTgpO3hbMV1ePVIoeFswXSt4WzNdLDcpO3hbMl1ePVIoeFsxXSt4WzBdLDkpO3hbM11ePVIoeFsyXSt4WzFdLDEzKTt4WzBdXj1SKHhbM10reFsyXSwxOCk7eFs2XV49Uih4WzVdK3hbNF0sNyk7eFs3XV49Uih4WzZdK3hbNV0sOSk7eFs0XV49Uih4WzddK3hbNl0sMTMpO3hbNV1ePVIoeFs0XSt4WzddLDE4KTt4WzExXV49Uih4WzEwXSt4WzldLDcpO3hbOF1ePVIoeFsxMV0reFsxMF0sOSk7eFs5XV49Uih4WzhdK3hbMTFdLDEzKTt4WzEwXV49Uih4WzldK3hbOF0sMTgpO3hbMTJdXj1SKHhbMTVdK3hbMTRdLDcpO3hbMTNdXj1SKHhbMTJdK3hbMTVdLDkpO3hbMTRdXj1SKHhbMTNdK3hbMTJdLDEzKTt4WzE1XV49Uih4WzE0XSt4WzEzXSwxOCl9Zm9yKGk9MDtpPDE2OysraSlCMzJbaV09eFtpXStCMzJbaV07Zm9yKGk9MDtpPDE2O2krKyl7dmFyIGJpPWkqNDtCW2JpKzBdPUIzMltpXT4+MCYyNTU7QltiaSsxXT1CMzJbaV0+PjgmMjU1O0JbYmkrMl09QjMyW2ldPj4xNiYyNTU7QltiaSszXT1CMzJbaV0+PjI0JjI1NX19ZnVuY3Rpb24gYmxvY2t4b3IoUyxTaSxELERpLGxlbil7Zm9yKHZhciBpPTA7aTxsZW47aSsrKXtEW0RpK2ldXj1TW1NpK2ldfX19ZnVuY3Rpb24gYXJyYXljb3B5KHNyYyxzcmNQb3MsZGVzdCxkZXN0UG9zLGxlbmd0aCl7aWYoQnVmZmVyLmlzQnVmZmVyKHNyYykmJkJ1ZmZlci5pc0J1ZmZlcihkZXN0KSl7c3JjLmNvcHkoZGVzdCxkZXN0UG9zLHNyY1BvcyxzcmNQb3MrbGVuZ3RoKX1lbHNle3doaWxlKGxlbmd0aC0tKXtkZXN0W2Rlc3RQb3MrK109c3JjW3NyY1BvcysrXX19fW1vZHVsZS5leHBvcnRzPXNjcnlwdH0pLmNhbGwodGhpcyxyZXF1aXJlKCJidWZmZXIiKS5CdWZmZXIpfSx7YnVmZmVyOjI1LHBia2RmMjo1Nn1dLDgxOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgYWxlYT1yZXF1aXJlKCIuL2xpYi9hbGVhIik7dmFyIHhvcjEyOD1yZXF1aXJlKCIuL2xpYi94b3IxMjgiKTt2YXIgeG9yd293PXJlcXVpcmUoIi4vbGliL3hvcndvdyIpO3ZhciB4b3JzaGlmdDc9cmVxdWlyZSgiLi9saWIveG9yc2hpZnQ3Iik7dmFyIHhvcjQwOTY9cmVxdWlyZSgiLi9saWIveG9yNDA5NiIpO3ZhciB0eWNoZWk9cmVxdWlyZSgiLi9saWIvdHljaGVpIik7dmFyIHNyPXJlcXVpcmUoIi4vc2VlZHJhbmRvbSIpO3NyLmFsZWE9YWxlYTtzci54b3IxMjg9eG9yMTI4O3NyLnhvcndvdz14b3J3b3c7c3IueG9yc2hpZnQ3PXhvcnNoaWZ0Nztzci54b3I0MDk2PXhvcjQwOTY7c3IudHljaGVpPXR5Y2hlaTttb2R1bGUuZXhwb3J0cz1zcn0seyIuL2xpYi9hbGVhIjo4MiwiLi9saWIvdHljaGVpIjo4MywiLi9saWIveG9yMTI4Ijo4NCwiLi9saWIveG9yNDA5NiI6ODUsIi4vbGliL3hvcnNoaWZ0NyI6ODYsIi4vbGliL3hvcndvdyI6ODcsIi4vc2VlZHJhbmRvbSI6ODh9XSw4MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCxtb2R1bGUsZGVmaW5lKXtmdW5jdGlvbiBBbGVhKHNlZWQpe3ZhciBtZT10aGlzLG1hc2g9TWFzaCgpO21lLm5leHQ9ZnVuY3Rpb24oKXt2YXIgdD0yMDkxNjM5Km1lLnMwK21lLmMqMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDttZS5zMD1tZS5zMTttZS5zMT1tZS5zMjtyZXR1cm4gbWUuczI9dC0obWUuYz10fDApfTttZS5jPTE7bWUuczA9bWFzaCgiICIpO21lLnMxPW1hc2goIiAiKTttZS5zMj1tYXNoKCIgIik7bWUuczAtPW1hc2goc2VlZCk7aWYobWUuczA8MCl7bWUuczArPTF9bWUuczEtPW1hc2goc2VlZCk7aWYobWUuczE8MCl7bWUuczErPTF9bWUuczItPW1hc2goc2VlZCk7aWYobWUuczI8MCl7bWUuczIrPTF9bWFzaD1udWxsfWZ1bmN0aW9uIGNvcHkoZix0KXt0LmM9Zi5jO3QuczA9Zi5zMDt0LnMxPWYuczE7dC5zMj1mLnMyO3JldHVybiB0fWZ1bmN0aW9uIGltcGwoc2VlZCxvcHRzKXt2YXIgeGc9bmV3IEFsZWEoc2VlZCksc3RhdGU9b3B0cyYmb3B0cy5zdGF0ZSxwcm5nPXhnLm5leHQ7cHJuZy5pbnQzMj1mdW5jdGlvbigpe3JldHVybiB4Zy5uZXh0KCkqNDI5NDk2NzI5NnwwfTtwcm5nLmRvdWJsZT1mdW5jdGlvbigpe3JldHVybiBwcm5nKCkrKHBybmcoKSoyMDk3MTUyfDApKjExMTAyMjMwMjQ2MjUxNTY1ZS0zMn07cHJuZy5xdWljaz1wcm5nO2lmKHN0YXRlKXtpZih0eXBlb2Ygc3RhdGU9PSJvYmplY3QiKWNvcHkoc3RhdGUseGcpO3Bybmcuc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gY29weSh4Zyx7fSl9fXJldHVybiBwcm5nfWZ1bmN0aW9uIE1hc2goKXt2YXIgbj00MDIyODcxMTk3O3ZhciBtYXNoPWZ1bmN0aW9uKGRhdGEpe2RhdGE9U3RyaW5nKGRhdGEpO2Zvcih2YXIgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKXtuKz1kYXRhLmNoYXJDb2RlQXQoaSk7dmFyIGg9LjAyNTE5NjAzMjgyNDE2OTM4Km47bj1oPj4+MDtoLT1uO2gqPW47bj1oPj4+MDtoLT1uO24rPWgqNDI5NDk2NzI5Nn1yZXR1cm4obj4+PjApKjIuMzI4MzA2NDM2NTM4Njk2M2UtMTB9O3JldHVybiBtYXNofWlmKG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWltcGx9ZWxzZSBpZihkZWZpbmUmJmRlZmluZS5hbWQpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBpbXBsfSl9ZWxzZXt0aGlzLmFsZWE9aW1wbH19KSh0aGlzLHR5cGVvZiBtb2R1bGU9PSJvYmplY3QiJiZtb2R1bGUsdHlwZW9mIGRlZmluZT09ImZ1bmN0aW9uIiYmZGVmaW5lKX0se31dLDgzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsLG1vZHVsZSxkZWZpbmUpe2Z1bmN0aW9uIFhvckdlbihzZWVkKXt2YXIgbWU9dGhpcyxzdHJzZWVkPSIiO21lLm5leHQ9ZnVuY3Rpb24oKXt2YXIgYj1tZS5iLGM9bWUuYyxkPW1lLmQsYT1tZS5hO2I9Yjw8MjVeYj4+PjdeYztjPWMtZHwwO2Q9ZDw8MjReZD4+PjheYTthPWEtYnwwO21lLmI9Yj1iPDwyMF5iPj4+MTJeYzttZS5jPWM9Yy1kfDA7bWUuZD1kPDwxNl5jPj4+MTZeYTtyZXR1cm4gbWUuYT1hLWJ8MH07bWUuYT0wO21lLmI9MDttZS5jPTI2NTQ0MzU3Njl8MDttZS5kPTEzNjcxMzA1NTE7aWYoc2VlZD09PU1hdGguZmxvb3Ioc2VlZCkpe21lLmE9c2VlZC80Mjk0OTY3Mjk2fDA7bWUuYj1zZWVkfDB9ZWxzZXtzdHJzZWVkKz1zZWVkfWZvcih2YXIgaz0wO2s8c3Ryc2VlZC5sZW5ndGgrMjA7aysrKXttZS5iXj1zdHJzZWVkLmNoYXJDb2RlQXQoayl8MDttZS5uZXh0KCl9fWZ1bmN0aW9uIGNvcHkoZix0KXt0LmE9Zi5hO3QuYj1mLmI7dC5jPWYuYzt0LmQ9Zi5kO3JldHVybiB0fWZ1bmN0aW9uIGltcGwoc2VlZCxvcHRzKXt2YXIgeGc9bmV3IFhvckdlbihzZWVkKSxzdGF0ZT1vcHRzJiZvcHRzLnN0YXRlLHBybmc9ZnVuY3Rpb24oKXtyZXR1cm4oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5Nn07cHJuZy5kb3VibGU9ZnVuY3Rpb24oKXtkb3t2YXIgdG9wPXhnLm5leHQoKT4+PjExLGJvdD0oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5NixyZXN1bHQ9KHRvcCtib3QpLygxPDwyMSl9d2hpbGUocmVzdWx0PT09MCk7cmV0dXJuIHJlc3VsdH07cHJuZy5pbnQzMj14Zy5uZXh0O3BybmcucXVpY2s9cHJuZztpZihzdGF0ZSl7aWYodHlwZW9mIHN0YXRlPT0ib2JqZWN0Iiljb3B5KHN0YXRlLHhnKTtwcm5nLnN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGNvcHkoeGcse30pfX1yZXR1cm4gcHJuZ31pZihtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXttb2R1bGUuZXhwb3J0cz1pbXBsfWVsc2UgaWYoZGVmaW5lJiZkZWZpbmUuYW1kKXtkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gaW1wbH0pfWVsc2V7dGhpcy50eWNoZWk9aW1wbH19KSh0aGlzLHR5cGVvZiBtb2R1bGU9PSJvYmplY3QiJiZtb2R1bGUsdHlwZW9mIGRlZmluZT09ImZ1bmN0aW9uIiYmZGVmaW5lKX0se31dLDg0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24oZ2xvYmFsLG1vZHVsZSxkZWZpbmUpe2Z1bmN0aW9uIFhvckdlbihzZWVkKXt2YXIgbWU9dGhpcyxzdHJzZWVkPSIiO21lLng9MDttZS55PTA7bWUuej0wO21lLnc9MDttZS5uZXh0PWZ1bmN0aW9uKCl7dmFyIHQ9bWUueF5tZS54PDwxMTttZS54PW1lLnk7bWUueT1tZS56O21lLno9bWUudztyZXR1cm4gbWUud149bWUudz4+PjE5XnRedD4+Pjh9O2lmKHNlZWQ9PT0oc2VlZHwwKSl7bWUueD1zZWVkfWVsc2V7c3Ryc2VlZCs9c2VlZH1mb3IodmFyIGs9MDtrPHN0cnNlZWQubGVuZ3RoKzY0O2srKyl7bWUueF49c3Ryc2VlZC5jaGFyQ29kZUF0KGspfDA7bWUubmV4dCgpfX1mdW5jdGlvbiBjb3B5KGYsdCl7dC54PWYueDt0Lnk9Zi55O3Quej1mLno7dC53PWYudztyZXR1cm4gdH1mdW5jdGlvbiBpbXBsKHNlZWQsb3B0cyl7dmFyIHhnPW5ldyBYb3JHZW4oc2VlZCksc3RhdGU9b3B0cyYmb3B0cy5zdGF0ZSxwcm5nPWZ1bmN0aW9uKCl7cmV0dXJuKHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTZ9O3BybmcuZG91YmxlPWZ1bmN0aW9uKCl7ZG97dmFyIHRvcD14Zy5uZXh0KCk+Pj4xMSxib3Q9KHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTYscmVzdWx0PSh0b3ArYm90KS8oMTw8MjEpfXdoaWxlKHJlc3VsdD09PTApO3JldHVybiByZXN1bHR9O3BybmcuaW50MzI9eGcubmV4dDtwcm5nLnF1aWNrPXBybmc7aWYoc3RhdGUpe2lmKHR5cGVvZiBzdGF0ZT09Im9iamVjdCIpY29weShzdGF0ZSx4Zyk7cHJuZy5zdGF0ZT1mdW5jdGlvbigpe3JldHVybiBjb3B5KHhnLHt9KX19cmV0dXJuIHBybmd9aWYobW9kdWxlJiZtb2R1bGUuZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9aW1wbH1lbHNlIGlmKGRlZmluZSYmZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGltcGx9KX1lbHNle3RoaXMueG9yMTI4PWltcGx9fSkodGhpcyx0eXBlb2YgbW9kdWxlPT0ib2JqZWN0IiYmbW9kdWxlLHR5cGVvZiBkZWZpbmU9PSJmdW5jdGlvbiImJmRlZmluZSl9LHt9XSw4NTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKGdsb2JhbCxtb2R1bGUsZGVmaW5lKXtmdW5jdGlvbiBYb3JHZW4oc2VlZCl7dmFyIG1lPXRoaXM7bWUubmV4dD1mdW5jdGlvbigpe3ZhciB3PW1lLncsWD1tZS5YLGk9bWUuaSx0LHY7bWUudz13PXcrMTY0MDUzMTUyN3wwO3Y9WFtpKzM0JjEyN107dD1YW2k9aSsxJjEyN107dl49djw8MTM7dF49dDw8MTc7dl49dj4+PjE1O3RePXQ+Pj4xMjt2PVhbaV09dl50O21lLmk9aTtyZXR1cm4gdisod153Pj4+MTYpfDB9O2Z1bmN0aW9uIGluaXQobWUsc2VlZCl7dmFyIHQsdixpLGosdyxYPVtdLGxpbWl0PTEyODtpZihzZWVkPT09KHNlZWR8MCkpe3Y9c2VlZDtzZWVkPW51bGx9ZWxzZXtzZWVkPXNlZWQrIlwwIjt2PTA7bGltaXQ9TWF0aC5tYXgobGltaXQsc2VlZC5sZW5ndGgpfWZvcihpPTAsaj0tMzI7ajxsaW1pdDsrK2ope2lmKHNlZWQpdl49c2VlZC5jaGFyQ29kZUF0KChqKzMyKSVzZWVkLmxlbmd0aCk7aWYoaj09PTApdz12O3ZePXY8PDEwO3ZePXY+Pj4xNTt2Xj12PDw0O3ZePXY+Pj4xMztpZihqPj0wKXt3PXcrMTY0MDUzMTUyN3wwO3Q9WFtqJjEyN11ePXYrdztpPTA9PXQ/aSsxOjB9fWlmKGk+PTEyOCl7WFsoc2VlZCYmc2VlZC5sZW5ndGh8fDApJjEyN109LTF9aT0xMjc7Zm9yKGo9NCoxMjg7aj4wOy0tail7dj1YW2krMzQmMTI3XTt0PVhbaT1pKzEmMTI3XTt2Xj12PDwxMzt0Xj10PDwxNzt2Xj12Pj4+MTU7dF49dD4+PjEyO1hbaV09dl50fW1lLnc9dzttZS5YPVg7bWUuaT1pfWluaXQobWUsc2VlZCl9ZnVuY3Rpb24gY29weShmLHQpe3QuaT1mLmk7dC53PWYudzt0Llg9Zi5YLnNsaWNlKCk7cmV0dXJuIHR9ZnVuY3Rpb24gaW1wbChzZWVkLG9wdHMpe2lmKHNlZWQ9PW51bGwpc2VlZD0rbmV3IERhdGU7dmFyIHhnPW5ldyBYb3JHZW4oc2VlZCksc3RhdGU9b3B0cyYmb3B0cy5zdGF0ZSxwcm5nPWZ1bmN0aW9uKCl7cmV0dXJuKHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTZ9O3BybmcuZG91YmxlPWZ1bmN0aW9uKCl7ZG97dmFyIHRvcD14Zy5uZXh0KCk+Pj4xMSxib3Q9KHhnLm5leHQoKT4+PjApLzQyOTQ5NjcyOTYscmVzdWx0PSh0b3ArYm90KS8oMTw8MjEpfXdoaWxlKHJlc3VsdD09PTApO3JldHVybiByZXN1bHR9O3BybmcuaW50MzI9eGcubmV4dDtwcm5nLnF1aWNrPXBybmc7aWYoc3RhdGUpe2lmKHN0YXRlLlgpY29weShzdGF0ZSx4Zyk7cHJuZy5zdGF0ZT1mdW5jdGlvbigpe3JldHVybiBjb3B5KHhnLHt9KX19cmV0dXJuIHBybmd9aWYobW9kdWxlJiZtb2R1bGUuZXhwb3J0cyl7bW9kdWxlLmV4cG9ydHM9aW1wbH1lbHNlIGlmKGRlZmluZSYmZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGltcGx9KX1lbHNle3RoaXMueG9yNDA5Nj1pbXBsfX0pKHRoaXMsdHlwZW9mIG1vZHVsZT09Im9iamVjdCImJm1vZHVsZSx0eXBlb2YgZGVmaW5lPT0iZnVuY3Rpb24iJiZkZWZpbmUpfSx7fV0sODY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwsbW9kdWxlLGRlZmluZSl7ZnVuY3Rpb24gWG9yR2VuKHNlZWQpe3ZhciBtZT10aGlzO21lLm5leHQ9ZnVuY3Rpb24oKXt2YXIgWD1tZS54LGk9bWUuaSx0LHYsdzt0PVhbaV07dF49dD4+Pjc7dj10XnQ8PDI0O3Q9WFtpKzEmN107dl49dF50Pj4+MTA7dD1YW2krMyY3XTt2Xj10XnQ+Pj4zO3Q9WFtpKzQmN107dl49dF50PDw3O3Q9WFtpKzcmN107dD10XnQ8PDEzO3ZePXRedDw8OTtYW2ldPXY7bWUuaT1pKzEmNztyZXR1cm4gdn07ZnVuY3Rpb24gaW5pdChtZSxzZWVkKXt2YXIgaix3LFg9W107aWYoc2VlZD09PShzZWVkfDApKXt3PVhbMF09c2VlZH1lbHNle3NlZWQ9IiIrc2VlZDtmb3Ioaj0wO2o8c2VlZC5sZW5ndGg7KytqKXtYW2omN109WFtqJjddPDwxNV5zZWVkLmNoYXJDb2RlQXQoaikrWFtqKzEmN108PDEzfX13aGlsZShYLmxlbmd0aDw4KVgucHVzaCgwKTtmb3Ioaj0wO2o8OCYmWFtqXT09PTA7KytqKTtpZihqPT04KXc9WFs3XT0tMTtlbHNlIHc9WFtqXTttZS54PVg7bWUuaT0wO2ZvcihqPTI1NjtqPjA7LS1qKXttZS5uZXh0KCl9fWluaXQobWUsc2VlZCl9ZnVuY3Rpb24gY29weShmLHQpe3QueD1mLnguc2xpY2UoKTt0Lmk9Zi5pO3JldHVybiB0fWZ1bmN0aW9uIGltcGwoc2VlZCxvcHRzKXtpZihzZWVkPT1udWxsKXNlZWQ9K25ldyBEYXRlO3ZhciB4Zz1uZXcgWG9yR2VuKHNlZWQpLHN0YXRlPW9wdHMmJm9wdHMuc3RhdGUscHJuZz1mdW5jdGlvbigpe3JldHVybih4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2fTtwcm5nLmRvdWJsZT1mdW5jdGlvbigpe2Rve3ZhciB0b3A9eGcubmV4dCgpPj4+MTEsYm90PSh4Zy5uZXh0KCk+Pj4wKS80Mjk0OTY3Mjk2LHJlc3VsdD0odG9wK2JvdCkvKDE8PDIxKX13aGlsZShyZXN1bHQ9PT0wKTtyZXR1cm4gcmVzdWx0fTtwcm5nLmludDMyPXhnLm5leHQ7cHJuZy5xdWljaz1wcm5nO2lmKHN0YXRlKXtpZihzdGF0ZS54KWNvcHkoc3RhdGUseGcpO3Bybmcuc3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gY29weSh4Zyx7fSl9fXJldHVybiBwcm5nfWlmKG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMpe21vZHVsZS5leHBvcnRzPWltcGx9ZWxzZSBpZihkZWZpbmUmJmRlZmluZS5hbWQpe2RlZmluZShmdW5jdGlvbigpe3JldHVybiBpbXBsfSl9ZWxzZXt0aGlzLnhvcnNoaWZ0Nz1pbXBsfX0pKHRoaXMsdHlwZW9mIG1vZHVsZT09Im9iamVjdCImJm1vZHVsZSx0eXBlb2YgZGVmaW5lPT0iZnVuY3Rpb24iJiZkZWZpbmUpfSx7fV0sODc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwsbW9kdWxlLGRlZmluZSl7ZnVuY3Rpb24gWG9yR2VuKHNlZWQpe3ZhciBtZT10aGlzLHN0cnNlZWQ9IiI7bWUubmV4dD1mdW5jdGlvbigpe3ZhciB0PW1lLnhebWUueD4+PjI7bWUueD1tZS55O21lLnk9bWUuejttZS56PW1lLnc7bWUudz1tZS52O3JldHVybihtZS5kPW1lLmQrMzYyNDM3fDApKyhtZS52PW1lLnZebWUudjw8NF4odF50PDwxKSl8MH07bWUueD0wO21lLnk9MDttZS56PTA7bWUudz0wO21lLnY9MDtpZihzZWVkPT09KHNlZWR8MCkpe21lLng9c2VlZH1lbHNle3N0cnNlZWQrPXNlZWR9Zm9yKHZhciBrPTA7azxzdHJzZWVkLmxlbmd0aCs2NDtrKyspe21lLnhePXN0cnNlZWQuY2hhckNvZGVBdChrKXwwO2lmKGs9PXN0cnNlZWQubGVuZ3RoKXttZS5kPW1lLng8PDEwXm1lLng+Pj40fW1lLm5leHQoKX19ZnVuY3Rpb24gY29weShmLHQpe3QueD1mLng7dC55PWYueTt0Lno9Zi56O3Qudz1mLnc7dC52PWYudjt0LmQ9Zi5kO3JldHVybiB0fWZ1bmN0aW9uIGltcGwoc2VlZCxvcHRzKXt2YXIgeGc9bmV3IFhvckdlbihzZWVkKSxzdGF0ZT1vcHRzJiZvcHRzLnN0YXRlLHBybmc9ZnVuY3Rpb24oKXtyZXR1cm4oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5Nn07cHJuZy5kb3VibGU9ZnVuY3Rpb24oKXtkb3t2YXIgdG9wPXhnLm5leHQoKT4+PjExLGJvdD0oeGcubmV4dCgpPj4+MCkvNDI5NDk2NzI5NixyZXN1bHQ9KHRvcCtib3QpLygxPDwyMSl9d2hpbGUocmVzdWx0PT09MCk7cmV0dXJuIHJlc3VsdH07cHJuZy5pbnQzMj14Zy5uZXh0O3BybmcucXVpY2s9cHJuZztpZihzdGF0ZSl7aWYodHlwZW9mIHN0YXRlPT0ib2JqZWN0Iiljb3B5KHN0YXRlLHhnKTtwcm5nLnN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGNvcHkoeGcse30pfX1yZXR1cm4gcHJuZ31pZihtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXttb2R1bGUuZXhwb3J0cz1pbXBsfWVsc2UgaWYoZGVmaW5lJiZkZWZpbmUuYW1kKXtkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gaW1wbH0pfWVsc2V7dGhpcy54b3J3b3c9aW1wbH19KSh0aGlzLHR5cGVvZiBtb2R1bGU9PSJvYmplY3QiJiZtb2R1bGUsdHlwZW9mIGRlZmluZT09ImZ1bmN0aW9uIiYmZGVmaW5lKX0se31dLDg4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsoZnVuY3Rpb24ocG9vbCxtYXRoKXt2YXIgZ2xvYmFsPSgwLGV2YWwpKCJ0aGlzIiksd2lkdGg9MjU2LGNodW5rcz02LGRpZ2l0cz01MixybmduYW1lPSJyYW5kb20iLHN0YXJ0ZGVub209bWF0aC5wb3cod2lkdGgsY2h1bmtzKSxzaWduaWZpY2FuY2U9bWF0aC5wb3coMixkaWdpdHMpLG92ZXJmbG93PXNpZ25pZmljYW5jZSoyLG1hc2s9d2lkdGgtMSxub2RlY3J5cHRvO2Z1bmN0aW9uIHNlZWRyYW5kb20oc2VlZCxvcHRpb25zLGNhbGxiYWNrKXt2YXIga2V5PVtdO29wdGlvbnM9b3B0aW9ucz09dHJ1ZT97ZW50cm9weTp0cnVlfTpvcHRpb25zfHx7fTt2YXIgc2hvcnRzZWVkPW1peGtleShmbGF0dGVuKG9wdGlvbnMuZW50cm9weT9bc2VlZCx0b3N0cmluZyhwb29sKV06c2VlZD09bnVsbD9hdXRvc2VlZCgpOnNlZWQsMyksa2V5KTt2YXIgYXJjND1uZXcgQVJDNChrZXkpO3ZhciBwcm5nPWZ1bmN0aW9uKCl7dmFyIG49YXJjNC5nKGNodW5rcyksZD1zdGFydGRlbm9tLHg9MDt3aGlsZShuPHNpZ25pZmljYW5jZSl7bj0obit4KSp3aWR0aDtkKj13aWR0aDt4PWFyYzQuZygxKX13aGlsZShuPj1vdmVyZmxvdyl7bi89MjtkLz0yO3g+Pj49MX1yZXR1cm4obit4KS9kfTtwcm5nLmludDMyPWZ1bmN0aW9uKCl7cmV0dXJuIGFyYzQuZyg0KXwwfTtwcm5nLnF1aWNrPWZ1bmN0aW9uKCl7cmV0dXJuIGFyYzQuZyg0KS80Mjk0OTY3Mjk2fTtwcm5nLmRvdWJsZT1wcm5nO21peGtleSh0b3N0cmluZyhhcmM0LlMpLHBvb2wpO3JldHVybihvcHRpb25zLnBhc3N8fGNhbGxiYWNrfHxmdW5jdGlvbihwcm5nLHNlZWQsaXNfbWF0aF9jYWxsLHN0YXRlKXtpZihzdGF0ZSl7aWYoc3RhdGUuUyl7Y29weShzdGF0ZSxhcmM0KX1wcm5nLnN0YXRlPWZ1bmN0aW9uKCl7cmV0dXJuIGNvcHkoYXJjNCx7fSl9fWlmKGlzX21hdGhfY2FsbCl7bWF0aFtybmduYW1lXT1wcm5nO3JldHVybiBzZWVkfWVsc2UgcmV0dXJuIHBybmd9KShwcm5nLHNob3J0c2VlZCwiZ2xvYmFsImluIG9wdGlvbnM/b3B0aW9ucy5nbG9iYWw6dGhpcz09bWF0aCxvcHRpb25zLnN0YXRlKX1mdW5jdGlvbiBBUkM0KGtleSl7dmFyIHQsa2V5bGVuPWtleS5sZW5ndGgsbWU9dGhpcyxpPTAsaj1tZS5pPW1lLmo9MCxzPW1lLlM9W107aWYoIWtleWxlbil7a2V5PVtrZXlsZW4rK119d2hpbGUoaTx3aWR0aCl7c1tpXT1pKyt9Zm9yKGk9MDtpPHdpZHRoO2krKyl7c1tpXT1zW2o9bWFzayZqK2tleVtpJWtleWxlbl0rKHQ9c1tpXSldO3Nbal09dH0obWUuZz1mdW5jdGlvbihjb3VudCl7dmFyIHQscj0wLGk9bWUuaSxqPW1lLmoscz1tZS5TO3doaWxlKGNvdW50LS0pe3Q9c1tpPW1hc2smaSsxXTtyPXIqd2lkdGgrc1ttYXNrJihzW2ldPXNbaj1tYXNrJmordF0pKyhzW2pdPXQpXX1tZS5pPWk7bWUuaj1qO3JldHVybiByfSkod2lkdGgpfWZ1bmN0aW9uIGNvcHkoZix0KXt0Lmk9Zi5pO3Quaj1mLmo7dC5TPWYuUy5zbGljZSgpO3JldHVybiB0fWZ1bmN0aW9uIGZsYXR0ZW4ob2JqLGRlcHRoKXt2YXIgcmVzdWx0PVtdLHR5cD10eXBlb2Ygb2JqLHByb3A7aWYoZGVwdGgmJnR5cD09Im9iamVjdCIpe2Zvcihwcm9wIGluIG9iail7dHJ5e3Jlc3VsdC5wdXNoKGZsYXR0ZW4ob2JqW3Byb3BdLGRlcHRoLTEpKX1jYXRjaChlKXt9fX1yZXR1cm4gcmVzdWx0Lmxlbmd0aD9yZXN1bHQ6dHlwPT0ic3RyaW5nIj9vYmo6b2JqKyJcMCJ9ZnVuY3Rpb24gbWl4a2V5KHNlZWQsa2V5KXt2YXIgc3RyaW5nc2VlZD1zZWVkKyIiLHNtZWFyLGo9MDt3aGlsZShqPHN0cmluZ3NlZWQubGVuZ3RoKXtrZXlbbWFzayZqXT1tYXNrJihzbWVhcl49a2V5W21hc2smal0qMTkpK3N0cmluZ3NlZWQuY2hhckNvZGVBdChqKyspfXJldHVybiB0b3N0cmluZyhrZXkpfWZ1bmN0aW9uIGF1dG9zZWVkKCl7dHJ5e3ZhciBvdXQ7aWYobm9kZWNyeXB0byYmKG91dD1ub2RlY3J5cHRvLnJhbmRvbUJ5dGVzKSl7b3V0PW91dCh3aWR0aCl9ZWxzZXtvdXQ9bmV3IFVpbnQ4QXJyYXkod2lkdGgpOyhnbG9iYWwuY3J5cHRvfHxnbG9iYWwubXNDcnlwdG8pLmdldFJhbmRvbVZhbHVlcyhvdXQpfXJldHVybiB0b3N0cmluZyhvdXQpfWNhdGNoKGUpe3ZhciBicm93c2VyPWdsb2JhbC5uYXZpZ2F0b3IscGx1Z2lucz1icm93c2VyJiZicm93c2VyLnBsdWdpbnM7cmV0dXJuWytuZXcgRGF0ZSxnbG9iYWwscGx1Z2lucyxnbG9iYWwuc2NyZWVuLHRvc3RyaW5nKHBvb2wpXX19ZnVuY3Rpb24gdG9zdHJpbmcoYSl7cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoMCxhKX1taXhrZXkobWF0aC5yYW5kb20oKSxwb29sKTtpZih0eXBlb2YgbW9kdWxlPT0ib2JqZWN0IiYmbW9kdWxlLmV4cG9ydHMpe21vZHVsZS5leHBvcnRzPXNlZWRyYW5kb207dHJ5e25vZGVjcnlwdG89cmVxdWlyZSgiY3J5cHRvIil9Y2F0Y2goZXgpe319ZWxzZSBpZih0eXBlb2YgZGVmaW5lPT0iZnVuY3Rpb24iJiZkZWZpbmUuYW1kKXtkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gc2VlZHJhbmRvbX0pfWVsc2V7bWF0aFsic2VlZCIrcm5nbmFtZV09c2VlZHJhbmRvbX19KShbXSxNYXRoKX0se2NyeXB0bzoyNH1dLDg5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO2Z1bmN0aW9uIEhhc2goYmxvY2tTaXplLGZpbmFsU2l6ZSl7dGhpcy5fYmxvY2s9QnVmZmVyLmFsbG9jKGJsb2NrU2l6ZSk7dGhpcy5fZmluYWxTaXplPWZpbmFsU2l6ZTt0aGlzLl9ibG9ja1NpemU9YmxvY2tTaXplO3RoaXMuX2xlbj0wfUhhc2gucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihkYXRhLGVuYyl7aWYodHlwZW9mIGRhdGE9PT0ic3RyaW5nIil7ZW5jPWVuY3x8InV0ZjgiO2RhdGE9QnVmZmVyLmZyb20oZGF0YSxlbmMpfXZhciBibG9jaz10aGlzLl9ibG9jazt2YXIgYmxvY2tTaXplPXRoaXMuX2Jsb2NrU2l6ZTt2YXIgbGVuZ3RoPWRhdGEubGVuZ3RoO3ZhciBhY2N1bT10aGlzLl9sZW47Zm9yKHZhciBvZmZzZXQ9MDtvZmZzZXQ8bGVuZ3RoOyl7dmFyIGFzc2lnbmVkPWFjY3VtJWJsb2NrU2l6ZTt2YXIgcmVtYWluZGVyPU1hdGgubWluKGxlbmd0aC1vZmZzZXQsYmxvY2tTaXplLWFzc2lnbmVkKTtmb3IodmFyIGk9MDtpPHJlbWFpbmRlcjtpKyspe2Jsb2NrW2Fzc2lnbmVkK2ldPWRhdGFbb2Zmc2V0K2ldfWFjY3VtKz1yZW1haW5kZXI7b2Zmc2V0Kz1yZW1haW5kZXI7aWYoYWNjdW0lYmxvY2tTaXplPT09MCl7dGhpcy5fdXBkYXRlKGJsb2NrKX19dGhpcy5fbGVuKz1sZW5ndGg7cmV0dXJuIHRoaXN9O0hhc2gucHJvdG90eXBlLmRpZ2VzdD1mdW5jdGlvbihlbmMpe3ZhciByZW09dGhpcy5fbGVuJXRoaXMuX2Jsb2NrU2l6ZTt0aGlzLl9ibG9ja1tyZW1dPTEyODt0aGlzLl9ibG9jay5maWxsKDAscmVtKzEpO2lmKHJlbT49dGhpcy5fZmluYWxTaXplKXt0aGlzLl91cGRhdGUodGhpcy5fYmxvY2spO3RoaXMuX2Jsb2NrLmZpbGwoMCl9dmFyIGJpdHM9dGhpcy5fbGVuKjg7aWYoYml0czw9NDI5NDk2NzI5NSl7dGhpcy5fYmxvY2sud3JpdGVVSW50MzJCRShiaXRzLHRoaXMuX2Jsb2NrU2l6ZS00KX1lbHNle3ZhciBsb3dCaXRzPShiaXRzJjQyOTQ5NjcyOTUpPj4+MDt2YXIgaGlnaEJpdHM9KGJpdHMtbG93Qml0cykvNDI5NDk2NzI5Njt0aGlzLl9ibG9jay53cml0ZVVJbnQzMkJFKGhpZ2hCaXRzLHRoaXMuX2Jsb2NrU2l6ZS04KTt0aGlzLl9ibG9jay53cml0ZVVJbnQzMkJFKGxvd0JpdHMsdGhpcy5fYmxvY2tTaXplLTQpfXRoaXMuX3VwZGF0ZSh0aGlzLl9ibG9jayk7dmFyIGhhc2g9dGhpcy5faGFzaCgpO3JldHVybiBlbmM/aGFzaC50b1N0cmluZyhlbmMpOmhhc2h9O0hhc2gucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoIl91cGRhdGUgbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcyIpfTttb2R1bGUuZXhwb3J0cz1IYXNofSx7InNhZmUtYnVmZmVyIjo3OH1dLDkwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1mdW5jdGlvbiBTSEEoYWxnb3JpdGhtKXthbGdvcml0aG09YWxnb3JpdGhtLnRvTG93ZXJDYXNlKCk7dmFyIEFsZ29yaXRobT1leHBvcnRzW2FsZ29yaXRobV07aWYoIUFsZ29yaXRobSl0aHJvdyBuZXcgRXJyb3IoYWxnb3JpdGhtKyIgaXMgbm90IHN1cHBvcnRlZCAod2UgYWNjZXB0IHB1bGwgcmVxdWVzdHMpIik7cmV0dXJuIG5ldyBBbGdvcml0aG19O2V4cG9ydHMuc2hhPXJlcXVpcmUoIi4vc2hhIik7ZXhwb3J0cy5zaGExPXJlcXVpcmUoIi4vc2hhMSIpO2V4cG9ydHMuc2hhMjI0PXJlcXVpcmUoIi4vc2hhMjI0Iik7ZXhwb3J0cy5zaGEyNTY9cmVxdWlyZSgiLi9zaGEyNTYiKTtleHBvcnRzLnNoYTM4ND1yZXF1aXJlKCIuL3NoYTM4NCIpO2V4cG9ydHMuc2hhNTEyPXJlcXVpcmUoIi4vc2hhNTEyIil9LHsiLi9zaGEiOjkxLCIuL3NoYTEiOjkyLCIuL3NoYTIyNCI6OTMsIi4vc2hhMjU2Ijo5NCwiLi9zaGEzODQiOjk1LCIuL3NoYTUxMiI6OTZ9XSw5MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIEhhc2g9cmVxdWlyZSgiLi9oYXNoIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgSz1bMTUxODUwMDI0OSwxODU5Nzc1MzkzLDI0MDA5NTk3MDh8MCwzMzk1NDY5NzgyfDBdO3ZhciBXPW5ldyBBcnJheSg4MCk7ZnVuY3Rpb24gU2hhKCl7dGhpcy5pbml0KCk7dGhpcy5fdz1XO0hhc2guY2FsbCh0aGlzLDY0LDU2KX1pbmhlcml0cyhTaGEsSGFzaCk7U2hhLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dGhpcy5fYT0xNzMyNTg0MTkzO3RoaXMuX2I9NDAyMzIzMzQxNzt0aGlzLl9jPTI1NjIzODMxMDI7dGhpcy5fZD0yNzE3MzM4Nzg7dGhpcy5fZT0zMjg1Mzc3NTIwO3JldHVybiB0aGlzfTtmdW5jdGlvbiByb3RsNShudW0pe3JldHVybiBudW08PDV8bnVtPj4+Mjd9ZnVuY3Rpb24gcm90bDMwKG51bSl7cmV0dXJuIG51bTw8MzB8bnVtPj4+Mn1mdW5jdGlvbiBmdChzLGIsYyxkKXtpZihzPT09MClyZXR1cm4gYiZjfH5iJmQ7aWYocz09PTIpcmV0dXJuIGImY3xiJmR8YyZkO3JldHVybiBiXmNeZH1TaGEucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oTSl7dmFyIFc9dGhpcy5fdzt2YXIgYT10aGlzLl9hfDA7dmFyIGI9dGhpcy5fYnwwO3ZhciBjPXRoaXMuX2N8MDt2YXIgZD10aGlzLl9kfDA7dmFyIGU9dGhpcy5fZXwwO2Zvcih2YXIgaT0wO2k8MTY7KytpKVdbaV09TS5yZWFkSW50MzJCRShpKjQpO2Zvcig7aTw4MDsrK2kpV1tpXT1XW2ktM11eV1tpLThdXldbaS0xNF1eV1tpLTE2XTtmb3IodmFyIGo9MDtqPDgwOysrail7dmFyIHM9fn4oai8yMCk7dmFyIHQ9cm90bDUoYSkrZnQocyxiLGMsZCkrZStXW2pdK0tbc118MDtlPWQ7ZD1jO2M9cm90bDMwKGIpO2I9YTthPXR9dGhpcy5fYT1hK3RoaXMuX2F8MDt0aGlzLl9iPWIrdGhpcy5fYnwwO3RoaXMuX2M9Yyt0aGlzLl9jfDA7dGhpcy5fZD1kK3RoaXMuX2R8MDt0aGlzLl9lPWUrdGhpcy5fZXwwfTtTaGEucHJvdG90eXBlLl9oYXNoPWZ1bmN0aW9uKCl7dmFyIEg9QnVmZmVyLmFsbG9jVW5zYWZlKDIwKTtILndyaXRlSW50MzJCRSh0aGlzLl9hfDAsMCk7SC53cml0ZUludDMyQkUodGhpcy5fYnwwLDQpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2N8MCw4KTtILndyaXRlSW50MzJCRSh0aGlzLl9kfDAsMTIpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2V8MCwxNik7cmV0dXJuIEh9O21vZHVsZS5leHBvcnRzPVNoYX0seyIuL2hhc2giOjg5LGluaGVyaXRzOjM0LCJzYWZlLWJ1ZmZlciI6Nzh9XSw5MjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIEhhc2g9cmVxdWlyZSgiLi9oYXNoIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgSz1bMTUxODUwMDI0OSwxODU5Nzc1MzkzLDI0MDA5NTk3MDh8MCwzMzk1NDY5NzgyfDBdO3ZhciBXPW5ldyBBcnJheSg4MCk7ZnVuY3Rpb24gU2hhMSgpe3RoaXMuaW5pdCgpO3RoaXMuX3c9VztIYXNoLmNhbGwodGhpcyw2NCw1Nil9aW5oZXJpdHMoU2hhMSxIYXNoKTtTaGExLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dGhpcy5fYT0xNzMyNTg0MTkzO3RoaXMuX2I9NDAyMzIzMzQxNzt0aGlzLl9jPTI1NjIzODMxMDI7dGhpcy5fZD0yNzE3MzM4Nzg7dGhpcy5fZT0zMjg1Mzc3NTIwO3JldHVybiB0aGlzfTtmdW5jdGlvbiByb3RsMShudW0pe3JldHVybiBudW08PDF8bnVtPj4+MzF9ZnVuY3Rpb24gcm90bDUobnVtKXtyZXR1cm4gbnVtPDw1fG51bT4+PjI3fWZ1bmN0aW9uIHJvdGwzMChudW0pe3JldHVybiBudW08PDMwfG51bT4+PjJ9ZnVuY3Rpb24gZnQocyxiLGMsZCl7aWYocz09PTApcmV0dXJuIGImY3x+YiZkO2lmKHM9PT0yKXJldHVybiBiJmN8YiZkfGMmZDtyZXR1cm4gYl5jXmR9U2hhMS5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihNKXt2YXIgVz10aGlzLl93O3ZhciBhPXRoaXMuX2F8MDt2YXIgYj10aGlzLl9ifDA7dmFyIGM9dGhpcy5fY3wwO3ZhciBkPXRoaXMuX2R8MDt2YXIgZT10aGlzLl9lfDA7Zm9yKHZhciBpPTA7aTwxNjsrK2kpV1tpXT1NLnJlYWRJbnQzMkJFKGkqNCk7Zm9yKDtpPDgwOysraSlXW2ldPXJvdGwxKFdbaS0zXV5XW2ktOF1eV1tpLTE0XV5XW2ktMTZdKTtmb3IodmFyIGo9MDtqPDgwOysrail7dmFyIHM9fn4oai8yMCk7dmFyIHQ9cm90bDUoYSkrZnQocyxiLGMsZCkrZStXW2pdK0tbc118MDtlPWQ7ZD1jO2M9cm90bDMwKGIpO2I9YTthPXR9dGhpcy5fYT1hK3RoaXMuX2F8MDt0aGlzLl9iPWIrdGhpcy5fYnwwO3RoaXMuX2M9Yyt0aGlzLl9jfDA7dGhpcy5fZD1kK3RoaXMuX2R8MDt0aGlzLl9lPWUrdGhpcy5fZXwwfTtTaGExLnByb3RvdHlwZS5faGFzaD1mdW5jdGlvbigpe3ZhciBIPUJ1ZmZlci5hbGxvY1Vuc2FmZSgyMCk7SC53cml0ZUludDMyQkUodGhpcy5fYXwwLDApO0gud3JpdGVJbnQzMkJFKHRoaXMuX2J8MCw0KTtILndyaXRlSW50MzJCRSh0aGlzLl9jfDAsOCk7SC53cml0ZUludDMyQkUodGhpcy5fZHwwLDEyKTtILndyaXRlSW50MzJCRSh0aGlzLl9lfDAsMTYpO3JldHVybiBIfTttb2R1bGUuZXhwb3J0cz1TaGExfSx7Ii4vaGFzaCI6ODksaW5oZXJpdHM6MzQsInNhZmUtYnVmZmVyIjo3OH1dLDkzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTt2YXIgU2hhMjU2PXJlcXVpcmUoIi4vc2hhMjU2Iik7dmFyIEhhc2g9cmVxdWlyZSgiLi9oYXNoIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgVz1uZXcgQXJyYXkoNjQpO2Z1bmN0aW9uIFNoYTIyNCgpe3RoaXMuaW5pdCgpO3RoaXMuX3c9VztIYXNoLmNhbGwodGhpcyw2NCw1Nil9aW5oZXJpdHMoU2hhMjI0LFNoYTI1Nik7U2hhMjI0LnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dGhpcy5fYT0zMjM4MzcxMDMyO3RoaXMuX2I9OTE0MTUwNjYzO3RoaXMuX2M9ODEyNzAyOTk5O3RoaXMuX2Q9NDE0NDkxMjY5Nzt0aGlzLl9lPTQyOTA3NzU4NTc7dGhpcy5fZj0xNzUwNjAzMDI1O3RoaXMuX2c9MTY5NDA3NjgzOTt0aGlzLl9oPTMyMDQwNzU0Mjg7cmV0dXJuIHRoaXN9O1NoYTIyNC5wcm90b3R5cGUuX2hhc2g9ZnVuY3Rpb24oKXt2YXIgSD1CdWZmZXIuYWxsb2NVbnNhZmUoMjgpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2EsMCk7SC53cml0ZUludDMyQkUodGhpcy5fYiw0KTtILndyaXRlSW50MzJCRSh0aGlzLl9jLDgpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2QsMTIpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2UsMTYpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2YsMjApO0gud3JpdGVJbnQzMkJFKHRoaXMuX2csMjQpO3JldHVybiBIfTttb2R1bGUuZXhwb3J0cz1TaGEyMjR9LHsiLi9oYXNoIjo4OSwiLi9zaGEyNTYiOjk0LGluaGVyaXRzOjM0LCJzYWZlLWJ1ZmZlciI6Nzh9XSw5NDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIGluaGVyaXRzPXJlcXVpcmUoImluaGVyaXRzIik7dmFyIEhhc2g9cmVxdWlyZSgiLi9oYXNoIik7dmFyIEJ1ZmZlcj1yZXF1aXJlKCJzYWZlLWJ1ZmZlciIpLkJ1ZmZlcjt2YXIgSz1bMTExNjM1MjQwOCwxODk5NDQ3NDQxLDMwNDkzMjM0NzEsMzkyMTAwOTU3Myw5NjE5ODcxNjMsMTUwODk3MDk5MywyNDUzNjM1NzQ4LDI4NzA3NjMyMjEsMzYyNDM4MTA4MCwzMTA1OTg0MDEsNjA3MjI1Mjc4LDE0MjY4ODE5ODcsMTkyNTA3ODM4OCwyMTYyMDc4MjA2LDI2MTQ4ODgxMDMsMzI0ODIyMjU4MCwzODM1MzkwNDAxLDQwMjIyMjQ3NzQsMjY0MzQ3MDc4LDYwNDgwNzYyOCw3NzAyNTU5ODMsMTI0OTE1MDEyMiwxNTU1MDgxNjkyLDE5OTYwNjQ5ODYsMjU1NDIyMDg4MiwyODIxODM0MzQ5LDI5NTI5OTY4MDgsMzIxMDMxMzY3MSwzMzM2NTcxODkxLDM1ODQ1Mjg3MTEsMTEzOTI2OTkzLDMzODI0MTg5NSw2NjYzMDcyMDUsNzczNTI5OTEyLDEyOTQ3NTczNzIsMTM5NjE4MjI5MSwxNjk1MTgzNzAwLDE5ODY2NjEwNTEsMjE3NzAyNjM1MCwyNDU2OTU2MDM3LDI3MzA0ODU5MjEsMjgyMDMwMjQxMSwzMjU5NzMwODAwLDMzNDU3NjQ3NzEsMzUxNjA2NTgxNywzNjAwMzUyODA0LDQwOTQ1NzE5MDksMjc1NDIzMzQ0LDQzMDIyNzczNCw1MDY5NDg2MTYsNjU5MDYwNTU2LDg4Mzk5Nzg3Nyw5NTgxMzk1NzEsMTMyMjgyMjIxOCwxNTM3MDAyMDYzLDE3NDc4NzM3NzksMTk1NTU2MjIyMiwyMDI0MTA0ODE1LDIyMjc3MzA0NTIsMjM2MTg1MjQyNCwyNDI4NDM2NDc0LDI3NTY3MzQxODcsMzIwNDAzMTQ3OSwzMzI5MzI1Mjk4XTt2YXIgVz1uZXcgQXJyYXkoNjQpO2Z1bmN0aW9uIFNoYTI1Nigpe3RoaXMuaW5pdCgpO3RoaXMuX3c9VztIYXNoLmNhbGwodGhpcyw2NCw1Nil9aW5oZXJpdHMoU2hhMjU2LEhhc2gpO1NoYTI1Ni5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3RoaXMuX2E9MTc3OTAzMzcwMzt0aGlzLl9iPTMxNDQxMzQyNzc7dGhpcy5fYz0xMDEzOTA0MjQyO3RoaXMuX2Q9Mjc3MzQ4MDc2Mjt0aGlzLl9lPTEzNTk4OTMxMTk7dGhpcy5fZj0yNjAwODIyOTI0O3RoaXMuX2c9NTI4NzM0NjM1O3RoaXMuX2g9MTU0MTQ1OTIyNTtyZXR1cm4gdGhpc307ZnVuY3Rpb24gY2goeCx5LHope3JldHVybiB6XngmKHleeil9ZnVuY3Rpb24gbWFqKHgseSx6KXtyZXR1cm4geCZ5fHomKHh8eSl9ZnVuY3Rpb24gc2lnbWEwKHgpe3JldHVybih4Pj4+Mnx4PDwzMCleKHg+Pj4xM3x4PDwxOSleKHg+Pj4yMnx4PDwxMCl9ZnVuY3Rpb24gc2lnbWExKHgpe3JldHVybih4Pj4+Nnx4PDwyNileKHg+Pj4xMXx4PDwyMSleKHg+Pj4yNXx4PDw3KX1mdW5jdGlvbiBnYW1tYTAoeCl7cmV0dXJuKHg+Pj43fHg8PDI1KV4oeD4+PjE4fHg8PDE0KV54Pj4+M31mdW5jdGlvbiBnYW1tYTEoeCl7cmV0dXJuKHg+Pj4xN3x4PDwxNSleKHg+Pj4xOXx4PDwxMyleeD4+PjEwfVNoYTI1Ni5wcm90b3R5cGUuX3VwZGF0ZT1mdW5jdGlvbihNKXt2YXIgVz10aGlzLl93O3ZhciBhPXRoaXMuX2F8MDt2YXIgYj10aGlzLl9ifDA7dmFyIGM9dGhpcy5fY3wwO3ZhciBkPXRoaXMuX2R8MDt2YXIgZT10aGlzLl9lfDA7dmFyIGY9dGhpcy5fZnwwO3ZhciBnPXRoaXMuX2d8MDt2YXIgaD10aGlzLl9ofDA7Zm9yKHZhciBpPTA7aTwxNjsrK2kpV1tpXT1NLnJlYWRJbnQzMkJFKGkqNCk7Zm9yKDtpPDY0OysraSlXW2ldPWdhbW1hMShXW2ktMl0pK1dbaS03XStnYW1tYTAoV1tpLTE1XSkrV1tpLTE2XXwwO2Zvcih2YXIgaj0wO2o8NjQ7KytqKXt2YXIgVDE9aCtzaWdtYTEoZSkrY2goZSxmLGcpK0tbal0rV1tqXXwwO3ZhciBUMj1zaWdtYTAoYSkrbWFqKGEsYixjKXwwO2g9ZztnPWY7Zj1lO2U9ZCtUMXwwO2Q9YztjPWI7Yj1hO2E9VDErVDJ8MH10aGlzLl9hPWErdGhpcy5fYXwwO3RoaXMuX2I9Yit0aGlzLl9ifDA7dGhpcy5fYz1jK3RoaXMuX2N8MDt0aGlzLl9kPWQrdGhpcy5fZHwwO3RoaXMuX2U9ZSt0aGlzLl9lfDA7dGhpcy5fZj1mK3RoaXMuX2Z8MDt0aGlzLl9nPWcrdGhpcy5fZ3wwO3RoaXMuX2g9aCt0aGlzLl9ofDB9O1NoYTI1Ni5wcm90b3R5cGUuX2hhc2g9ZnVuY3Rpb24oKXt2YXIgSD1CdWZmZXIuYWxsb2NVbnNhZmUoMzIpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2EsMCk7SC53cml0ZUludDMyQkUodGhpcy5fYiw0KTtILndyaXRlSW50MzJCRSh0aGlzLl9jLDgpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2QsMTIpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2UsMTYpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2YsMjApO0gud3JpdGVJbnQzMkJFKHRoaXMuX2csMjQpO0gud3JpdGVJbnQzMkJFKHRoaXMuX2gsMjgpO3JldHVybiBIfTttb2R1bGUuZXhwb3J0cz1TaGEyNTZ9LHsiLi9oYXNoIjo4OSxpbmhlcml0czozNCwic2FmZS1idWZmZXIiOjc4fV0sOTU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBTSEE1MTI9cmVxdWlyZSgiLi9zaGE1MTIiKTt2YXIgSGFzaD1yZXF1aXJlKCIuL2hhc2giKTt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBXPW5ldyBBcnJheSgxNjApO2Z1bmN0aW9uIFNoYTM4NCgpe3RoaXMuaW5pdCgpO3RoaXMuX3c9VztIYXNoLmNhbGwodGhpcywxMjgsMTEyKX1pbmhlcml0cyhTaGEzODQsU0hBNTEyKTtTaGEzODQucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0aGlzLl9haD0zNDE4MDcwMzY1O3RoaXMuX2JoPTE2NTQyNzAyNTA7dGhpcy5fY2g9MjQzODUyOTM3MDt0aGlzLl9kaD0zNTU0NjIzNjA7dGhpcy5fZWg9MTczMTQwNTQxNTt0aGlzLl9maD0yMzk0MTgwMjMxO3RoaXMuX2doPTM2NzUwMDg1MjU7dGhpcy5faGg9MTIwMzA2MjgxMzt0aGlzLl9hbD0zMjM4MzcxMDMyO3RoaXMuX2JsPTkxNDE1MDY2Mzt0aGlzLl9jbD04MTI3MDI5OTk7dGhpcy5fZGw9NDE0NDkxMjY5Nzt0aGlzLl9lbD00MjkwNzc1ODU3O3RoaXMuX2ZsPTE3NTA2MDMwMjU7dGhpcy5fZ2w9MTY5NDA3NjgzOTt0aGlzLl9obD0zMjA0MDc1NDI4O3JldHVybiB0aGlzfTtTaGEzODQucHJvdG90eXBlLl9oYXNoPWZ1bmN0aW9uKCl7dmFyIEg9QnVmZmVyLmFsbG9jVW5zYWZlKDQ4KTtmdW5jdGlvbiB3cml0ZUludDY0QkUoaCxsLG9mZnNldCl7SC53cml0ZUludDMyQkUoaCxvZmZzZXQpO0gud3JpdGVJbnQzMkJFKGwsb2Zmc2V0KzQpfXdyaXRlSW50NjRCRSh0aGlzLl9haCx0aGlzLl9hbCwwKTt3cml0ZUludDY0QkUodGhpcy5fYmgsdGhpcy5fYmwsOCk7d3JpdGVJbnQ2NEJFKHRoaXMuX2NoLHRoaXMuX2NsLDE2KTt3cml0ZUludDY0QkUodGhpcy5fZGgsdGhpcy5fZGwsMjQpO3dyaXRlSW50NjRCRSh0aGlzLl9laCx0aGlzLl9lbCwzMik7d3JpdGVJbnQ2NEJFKHRoaXMuX2ZoLHRoaXMuX2ZsLDQwKTtyZXR1cm4gSH07bW9kdWxlLmV4cG9ydHM9U2hhMzg0fSx7Ii4vaGFzaCI6ODksIi4vc2hhNTEyIjo5Nixpbmhlcml0czozNCwic2FmZS1idWZmZXIiOjc4fV0sOTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBpbmhlcml0cz1yZXF1aXJlKCJpbmhlcml0cyIpO3ZhciBIYXNoPXJlcXVpcmUoIi4vaGFzaCIpO3ZhciBCdWZmZXI9cmVxdWlyZSgic2FmZS1idWZmZXIiKS5CdWZmZXI7dmFyIEs9WzExMTYzNTI0MDgsMzYwOTc2NzQ1OCwxODk5NDQ3NDQxLDYwMjg5MTcyNSwzMDQ5MzIzNDcxLDM5NjQ0ODQzOTksMzkyMTAwOTU3MywyMTczMjk1NTQ4LDk2MTk4NzE2Myw0MDgxNjI4NDcyLDE1MDg5NzA5OTMsMzA1MzgzNDI2NSwyNDUzNjM1NzQ4LDI5Mzc2NzE1NzksMjg3MDc2MzIyMSwzNjY0NjA5NTYwLDM2MjQzODEwODAsMjczNDg4MzM5NCwzMTA1OTg0MDEsMTE2NDk5NjU0Miw2MDcyMjUyNzgsMTMyMzYxMDc2NCwxNDI2ODgxOTg3LDM1OTAzMDQ5OTQsMTkyNTA3ODM4OCw0MDY4MTgyMzgzLDIxNjIwNzgyMDYsOTkxMzM2MTEzLDI2MTQ4ODgxMDMsNjMzODAzMzE3LDMyNDgyMjI1ODAsMzQ3OTc3NDg2OCwzODM1MzkwNDAxLDI2NjY2MTM0NTgsNDAyMjIyNDc3NCw5NDQ3MTExMzksMjY0MzQ3MDc4LDIzNDEyNjI3NzMsNjA0ODA3NjI4LDIwMDc4MDA5MzMsNzcwMjU1OTgzLDE0OTU5OTA5MDEsMTI0OTE1MDEyMiwxODU2NDMxMjM1LDE1NTUwODE2OTIsMzE3NTIxODEzMiwxOTk2MDY0OTg2LDIxOTg5NTA4MzcsMjU1NDIyMDg4MiwzOTk5NzE5MzM5LDI4MjE4MzQzNDksNzY2Nzg0MDE2LDI5NTI5OTY4MDgsMjU2NjU5NDg3OSwzMjEwMzEzNjcxLDMyMDMzMzc5NTYsMzMzNjU3MTg5MSwxMDM0NDU3MDI2LDM1ODQ1Mjg3MTEsMjQ2Njk0ODkwMSwxMTM5MjY5OTMsMzc1ODMyNjM4MywzMzgyNDE4OTUsMTY4NzE3OTM2LDY2NjMwNzIwNSwxMTg4MTc5OTY0LDc3MzUyOTkxMiwxNTQ2MDQ1NzM0LDEyOTQ3NTczNzIsMTUyMjgwNTQ4NSwxMzk2MTgyMjkxLDI2NDM4MzM4MjMsMTY5NTE4MzcwMCwyMzQzNTI3MzkwLDE5ODY2NjEwNTEsMTAxNDQ3NzQ4MCwyMTc3MDI2MzUwLDEyMDY3NTkxNDIsMjQ1Njk1NjAzNywzNDQwNzc2MjcsMjczMDQ4NTkyMSwxMjkwODYzNDYwLDI4MjAzMDI0MTEsMzE1ODQ1NDI3MywzMjU5NzMwODAwLDM1MDU5NTI2NTcsMzM0NTc2NDc3MSwxMDYyMTcwMDgsMzUxNjA2NTgxNywzNjA2MDA4MzQ0LDM2MDAzNTI4MDQsMTQzMjcyNTc3Niw0MDk0NTcxOTA5LDE0NjcwMzE1OTQsMjc1NDIzMzQ0LDg1MTE2OTcyMCw0MzAyMjc3MzQsMzEwMDgyMzc1Miw1MDY5NDg2MTYsMTM2MzI1ODE5NSw2NTkwNjA1NTYsMzc1MDY4NTU5Myw4ODM5OTc4NzcsMzc4NTA1MDI4MCw5NTgxMzk1NzEsMzMxODMwNzQyNywxMzIyODIyMjE4LDM4MTI3MjM0MDMsMTUzNzAwMjA2MywyMDAzMDM0OTk1LDE3NDc4NzM3NzksMzYwMjAzNjg5OSwxOTU1NTYyMjIyLDE1NzU5OTAwMTIsMjAyNDEwNDgxNSwxMTI1NTkyOTI4LDIyMjc3MzA0NTIsMjcxNjkwNDMwNiwyMzYxODUyNDI0LDQ0Mjc3NjA0NCwyNDI4NDM2NDc0LDU5MzY5ODM0NCwyNzU2NzM0MTg3LDM3MzMxMTAyNDksMzIwNDAzMTQ3OSwyOTk5MzUxNTczLDMzMjkzMjUyOTgsMzgxNTkyMDQyNywzMzkxNTY5NjE0LDM5MjgzODM5MDAsMzUxNTI2NzI3MSw1NjYyODA3MTEsMzk0MDE4NzYwNiwzNDU0MDY5NTM0LDQxMTg2MzAyNzEsNDAwMDIzOTk5MiwxMTY0MTg0NzQsMTkxNDEzODU1NCwxNzQyOTI0MjEsMjczMTA1NTI3MCwyODkzODAzNTYsMzIwMzk5MzAwNiw0NjAzOTMyNjksMzIwNjIwMzE1LDY4NTQ3MTczMyw1ODc0OTY4MzYsODUyMTQyOTcxLDEwODY3OTI4NTEsMTAxNzAzNjI5OCwzNjU1NDMxMDAsMTEyNjAwMDU4MCwyNjE4Mjk3Njc2LDEyODgwMzM0NzAsMzQwOTg1NTE1OCwxNTAxNTA1OTQ4LDQyMzQ1MDk4NjYsMTYwNzE2NzkxNSw5ODcxNjc0NjgsMTgxNjQwMjMxNiwxMjQ2MTg5NTkxXTt2YXIgVz1uZXcgQXJyYXkoMTYwKTtmdW5jdGlvbiBTaGE1MTIoKXt0aGlzLmluaXQoKTt0aGlzLl93PVc7SGFzaC5jYWxsKHRoaXMsMTI4LDExMil9aW5oZXJpdHMoU2hhNTEyLEhhc2gpO1NoYTUxMi5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3RoaXMuX2FoPTE3NzkwMzM3MDM7dGhpcy5fYmg9MzE0NDEzNDI3Nzt0aGlzLl9jaD0xMDEzOTA0MjQyO3RoaXMuX2RoPTI3NzM0ODA3NjI7dGhpcy5fZWg9MTM1OTg5MzExOTt0aGlzLl9maD0yNjAwODIyOTI0O3RoaXMuX2doPTUyODczNDYzNTt0aGlzLl9oaD0xNTQxNDU5MjI1O3RoaXMuX2FsPTQwODkyMzU3MjA7dGhpcy5fYmw9MjIyNzg3MzU5NTt0aGlzLl9jbD00MjcxMTc1NzIzO3RoaXMuX2RsPTE1OTU3NTAxMjk7dGhpcy5fZWw9MjkxNzU2NTEzNzt0aGlzLl9mbD03MjU1MTExOTk7dGhpcy5fZ2w9NDIxNTM4OTU0Nzt0aGlzLl9obD0zMjcwMzMyMDk7cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIENoKHgseSx6KXtyZXR1cm4gel54Jih5XnopfWZ1bmN0aW9uIG1haih4LHkseil7cmV0dXJuIHgmeXx6Jih4fHkpfWZ1bmN0aW9uIHNpZ21hMCh4LHhsKXtyZXR1cm4oeD4+PjI4fHhsPDw0KV4oeGw+Pj4yfHg8PDMwKV4oeGw+Pj43fHg8PDI1KX1mdW5jdGlvbiBzaWdtYTEoeCx4bCl7cmV0dXJuKHg+Pj4xNHx4bDw8MTgpXih4Pj4+MTh8eGw8PDE0KV4oeGw+Pj45fHg8PDIzKX1mdW5jdGlvbiBHYW1tYTAoeCx4bCl7cmV0dXJuKHg+Pj4xfHhsPDwzMSleKHg+Pj44fHhsPDwyNCleeD4+Pjd9ZnVuY3Rpb24gR2FtbWEwbCh4LHhsKXtyZXR1cm4oeD4+PjF8eGw8PDMxKV4oeD4+Pjh8eGw8PDI0KV4oeD4+Pjd8eGw8PDI1KX1mdW5jdGlvbiBHYW1tYTEoeCx4bCl7cmV0dXJuKHg+Pj4xOXx4bDw8MTMpXih4bD4+PjI5fHg8PDMpXng+Pj42fWZ1bmN0aW9uIEdhbW1hMWwoeCx4bCl7cmV0dXJuKHg+Pj4xOXx4bDw8MTMpXih4bD4+PjI5fHg8PDMpXih4Pj4+Nnx4bDw8MjYpfWZ1bmN0aW9uIGdldENhcnJ5KGEsYil7cmV0dXJuIGE+Pj4wPGI+Pj4wPzE6MH1TaGE1MTIucHJvdG90eXBlLl91cGRhdGU9ZnVuY3Rpb24oTSl7dmFyIFc9dGhpcy5fdzt2YXIgYWg9dGhpcy5fYWh8MDt2YXIgYmg9dGhpcy5fYmh8MDt2YXIgY2g9dGhpcy5fY2h8MDt2YXIgZGg9dGhpcy5fZGh8MDt2YXIgZWg9dGhpcy5fZWh8MDt2YXIgZmg9dGhpcy5fZmh8MDt2YXIgZ2g9dGhpcy5fZ2h8MDt2YXIgaGg9dGhpcy5faGh8MDt2YXIgYWw9dGhpcy5fYWx8MDt2YXIgYmw9dGhpcy5fYmx8MDt2YXIgY2w9dGhpcy5fY2x8MDt2YXIgZGw9dGhpcy5fZGx8MDt2YXIgZWw9dGhpcy5fZWx8MDt2YXIgZmw9dGhpcy5fZmx8MDt2YXIgZ2w9dGhpcy5fZ2x8MDt2YXIgaGw9dGhpcy5faGx8MDtmb3IodmFyIGk9MDtpPDMyO2krPTIpe1dbaV09TS5yZWFkSW50MzJCRShpKjQpO1dbaSsxXT1NLnJlYWRJbnQzMkJFKGkqNCs0KX1mb3IoO2k8MTYwO2krPTIpe3ZhciB4aD1XW2ktMTUqMl07dmFyIHhsPVdbaS0xNSoyKzFdO3ZhciBnYW1tYTA9R2FtbWEwKHhoLHhsKTt2YXIgZ2FtbWEwbD1HYW1tYTBsKHhsLHhoKTt4aD1XW2ktMioyXTt4bD1XW2ktMioyKzFdO3ZhciBnYW1tYTE9R2FtbWExKHhoLHhsKTt2YXIgZ2FtbWExbD1HYW1tYTFsKHhsLHhoKTt2YXIgV2k3aD1XW2ktNyoyXTt2YXIgV2k3bD1XW2ktNyoyKzFdO3ZhciBXaTE2aD1XW2ktMTYqMl07dmFyIFdpMTZsPVdbaS0xNioyKzFdO3ZhciBXaWw9Z2FtbWEwbCtXaTdsfDA7dmFyIFdpaD1nYW1tYTArV2k3aCtnZXRDYXJyeShXaWwsZ2FtbWEwbCl8MDtXaWw9V2lsK2dhbW1hMWx8MDtXaWg9V2loK2dhbW1hMStnZXRDYXJyeShXaWwsZ2FtbWExbCl8MDtXaWw9V2lsK1dpMTZsfDA7V2loPVdpaCtXaTE2aCtnZXRDYXJyeShXaWwsV2kxNmwpfDA7V1tpXT1XaWg7V1tpKzFdPVdpbH1mb3IodmFyIGo9MDtqPDE2MDtqKz0yKXtXaWg9V1tqXTtXaWw9V1tqKzFdO3ZhciBtYWpoPW1haihhaCxiaCxjaCk7dmFyIG1hamw9bWFqKGFsLGJsLGNsKTt2YXIgc2lnbWEwaD1zaWdtYTAoYWgsYWwpO3ZhciBzaWdtYTBsPXNpZ21hMChhbCxhaCk7dmFyIHNpZ21hMWg9c2lnbWExKGVoLGVsKTt2YXIgc2lnbWExbD1zaWdtYTEoZWwsZWgpO3ZhciBLaWg9S1tqXTt2YXIgS2lsPUtbaisxXTt2YXIgY2hoPUNoKGVoLGZoLGdoKTt2YXIgY2hsPUNoKGVsLGZsLGdsKTt2YXIgdDFsPWhsK3NpZ21hMWx8MDt2YXIgdDFoPWhoK3NpZ21hMWgrZ2V0Q2FycnkodDFsLGhsKXwwO3QxbD10MWwrY2hsfDA7dDFoPXQxaCtjaGgrZ2V0Q2FycnkodDFsLGNobCl8MDt0MWw9dDFsK0tpbHwwO3QxaD10MWgrS2loK2dldENhcnJ5KHQxbCxLaWwpfDA7dDFsPXQxbCtXaWx8MDt0MWg9dDFoK1dpaCtnZXRDYXJyeSh0MWwsV2lsKXwwO3ZhciB0Mmw9c2lnbWEwbCttYWpsfDA7dmFyIHQyaD1zaWdtYTBoK21hamgrZ2V0Q2FycnkodDJsLHNpZ21hMGwpfDA7aGg9Z2g7aGw9Z2w7Z2g9Zmg7Z2w9Zmw7Zmg9ZWg7Zmw9ZWw7ZWw9ZGwrdDFsfDA7ZWg9ZGgrdDFoK2dldENhcnJ5KGVsLGRsKXwwO2RoPWNoO2RsPWNsO2NoPWJoO2NsPWJsO2JoPWFoO2JsPWFsO2FsPXQxbCt0Mmx8MDthaD10MWgrdDJoK2dldENhcnJ5KGFsLHQxbCl8MH10aGlzLl9hbD10aGlzLl9hbCthbHwwO3RoaXMuX2JsPXRoaXMuX2JsK2JsfDA7dGhpcy5fY2w9dGhpcy5fY2wrY2x8MDt0aGlzLl9kbD10aGlzLl9kbCtkbHwwO3RoaXMuX2VsPXRoaXMuX2VsK2VsfDA7dGhpcy5fZmw9dGhpcy5fZmwrZmx8MDt0aGlzLl9nbD10aGlzLl9nbCtnbHwwO3RoaXMuX2hsPXRoaXMuX2hsK2hsfDA7dGhpcy5fYWg9dGhpcy5fYWgrYWgrZ2V0Q2FycnkodGhpcy5fYWwsYWwpfDA7dGhpcy5fYmg9dGhpcy5fYmgrYmgrZ2V0Q2FycnkodGhpcy5fYmwsYmwpfDA7dGhpcy5fY2g9dGhpcy5fY2grY2grZ2V0Q2FycnkodGhpcy5fY2wsY2wpfDA7dGhpcy5fZGg9dGhpcy5fZGgrZGgrZ2V0Q2FycnkodGhpcy5fZGwsZGwpfDA7dGhpcy5fZWg9dGhpcy5fZWgrZWgrZ2V0Q2FycnkodGhpcy5fZWwsZWwpfDA7dGhpcy5fZmg9dGhpcy5fZmgrZmgrZ2V0Q2FycnkodGhpcy5fZmwsZmwpfDA7dGhpcy5fZ2g9dGhpcy5fZ2grZ2grZ2V0Q2FycnkodGhpcy5fZ2wsZ2wpfDA7dGhpcy5faGg9dGhpcy5faGgraGgrZ2V0Q2FycnkodGhpcy5faGwsaGwpfDB9O1NoYTUxMi5wcm90b3R5cGUuX2hhc2g9ZnVuY3Rpb24oKXt2YXIgSD1CdWZmZXIuYWxsb2NVbnNhZmUoNjQpO2Z1bmN0aW9uIHdyaXRlSW50NjRCRShoLGwsb2Zmc2V0KXtILndyaXRlSW50MzJCRShoLG9mZnNldCk7SC53cml0ZUludDMyQkUobCxvZmZzZXQrNCl9d3JpdGVJbnQ2NEJFKHRoaXMuX2FoLHRoaXMuX2FsLDApO3dyaXRlSW50NjRCRSh0aGlzLl9iaCx0aGlzLl9ibCw4KTt3cml0ZUludDY0QkUodGhpcy5fY2gsdGhpcy5fY2wsMTYpO3dyaXRlSW50NjRCRSh0aGlzLl9kaCx0aGlzLl9kbCwyNCk7d3JpdGVJbnQ2NEJFKHRoaXMuX2VoLHRoaXMuX2VsLDMyKTt3cml0ZUludDY0QkUodGhpcy5fZmgsdGhpcy5fZmwsNDApO3dyaXRlSW50NjRCRSh0aGlzLl9naCx0aGlzLl9nbCw0OCk7d3JpdGVJbnQ2NEJFKHRoaXMuX2hoLHRoaXMuX2hsLDU2KTtyZXR1cm4gSH07bW9kdWxlLmV4cG9ydHM9U2hhNTEyfSx7Ii4vaGFzaCI6ODksaW5oZXJpdHM6MzQsInNhZmUtYnVmZmVyIjo3OH1dLDk3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXttb2R1bGUuZXhwb3J0cz1TdHJlYW07dmFyIEVFPXJlcXVpcmUoImV2ZW50cyIpLkV2ZW50RW1pdHRlcjt2YXIgaW5oZXJpdHM9cmVxdWlyZSgiaW5oZXJpdHMiKTtpbmhlcml0cyhTdHJlYW0sRUUpO1N0cmVhbS5SZWFkYWJsZT1yZXF1aXJlKCJyZWFkYWJsZS1zdHJlYW0vcmVhZGFibGUuanMiKTtTdHJlYW0uV3JpdGFibGU9cmVxdWlyZSgicmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlLmpzIik7U3RyZWFtLkR1cGxleD1yZXF1aXJlKCJyZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzIik7U3RyZWFtLlRyYW5zZm9ybT1yZXF1aXJlKCJyZWFkYWJsZS1zdHJlYW0vdHJhbnNmb3JtLmpzIik7U3RyZWFtLlBhc3NUaHJvdWdoPXJlcXVpcmUoInJlYWRhYmxlLXN0cmVhbS9wYXNzdGhyb3VnaC5qcyIpO1N0cmVhbS5TdHJlYW09U3RyZWFtO2Z1bmN0aW9uIFN0cmVhbSgpe0VFLmNhbGwodGhpcyl9U3RyZWFtLnByb3RvdHlwZS5waXBlPWZ1bmN0aW9uKGRlc3Qsb3B0aW9ucyl7dmFyIHNvdXJjZT10aGlzO2Z1bmN0aW9uIG9uZGF0YShjaHVuayl7aWYoZGVzdC53cml0YWJsZSl7aWYoZmFsc2U9PT1kZXN0LndyaXRlKGNodW5rKSYmc291cmNlLnBhdXNlKXtzb3VyY2UucGF1c2UoKX19fXNvdXJjZS5vbigiZGF0YSIsb25kYXRhKTtmdW5jdGlvbiBvbmRyYWluKCl7aWYoc291cmNlLnJlYWRhYmxlJiZzb3VyY2UucmVzdW1lKXtzb3VyY2UucmVzdW1lKCl9fWRlc3Qub24oImRyYWluIixvbmRyYWluKTtpZighZGVzdC5faXNTdGRpbyYmKCFvcHRpb25zfHxvcHRpb25zLmVuZCE9PWZhbHNlKSl7c291cmNlLm9uKCJlbmQiLG9uZW5kKTtzb3VyY2Uub24oImNsb3NlIixvbmNsb3NlKX12YXIgZGlkT25FbmQ9ZmFsc2U7ZnVuY3Rpb24gb25lbmQoKXtpZihkaWRPbkVuZClyZXR1cm47ZGlkT25FbmQ9dHJ1ZTtkZXN0LmVuZCgpfWZ1bmN0aW9uIG9uY2xvc2UoKXtpZihkaWRPbkVuZClyZXR1cm47ZGlkT25FbmQ9dHJ1ZTtpZih0eXBlb2YgZGVzdC5kZXN0cm95PT09ImZ1bmN0aW9uIilkZXN0LmRlc3Ryb3koKX1mdW5jdGlvbiBvbmVycm9yKGVyKXtjbGVhbnVwKCk7aWYoRUUubGlzdGVuZXJDb3VudCh0aGlzLCJlcnJvciIpPT09MCl7dGhyb3cgZXJ9fXNvdXJjZS5vbigiZXJyb3IiLG9uZXJyb3IpO2Rlc3Qub24oImVycm9yIixvbmVycm9yKTtmdW5jdGlvbiBjbGVhbnVwKCl7c291cmNlLnJlbW92ZUxpc3RlbmVyKCJkYXRhIixvbmRhdGEpO2Rlc3QucmVtb3ZlTGlzdGVuZXIoImRyYWluIixvbmRyYWluKTtzb3VyY2UucmVtb3ZlTGlzdGVuZXIoImVuZCIsb25lbmQpO3NvdXJjZS5yZW1vdmVMaXN0ZW5lcigiY2xvc2UiLG9uY2xvc2UpO3NvdXJjZS5yZW1vdmVMaXN0ZW5lcigiZXJyb3IiLG9uZXJyb3IpO2Rlc3QucmVtb3ZlTGlzdGVuZXIoImVycm9yIixvbmVycm9yKTtzb3VyY2UucmVtb3ZlTGlzdGVuZXIoImVuZCIsY2xlYW51cCk7c291cmNlLnJlbW92ZUxpc3RlbmVyKCJjbG9zZSIsY2xlYW51cCk7ZGVzdC5yZW1vdmVMaXN0ZW5lcigiY2xvc2UiLGNsZWFudXApfXNvdXJjZS5vbigiZW5kIixjbGVhbnVwKTtzb3VyY2Uub24oImNsb3NlIixjbGVhbnVwKTtkZXN0Lm9uKCJjbG9zZSIsY2xlYW51cCk7ZGVzdC5lbWl0KCJwaXBlIixzb3VyY2UpO3JldHVybiBkZXN0fX0se2V2ZW50czozMSxpbmhlcml0czozNCwicmVhZGFibGUtc3RyZWFtL2R1cGxleC5qcyI6NjQsInJlYWRhYmxlLXN0cmVhbS9wYXNzdGhyb3VnaC5qcyI6NzMsInJlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qcyI6NzQsInJlYWRhYmxlLXN0cmVhbS90cmFuc2Zvcm0uanMiOjc1LCJyZWFkYWJsZS1zdHJlYW0vd3JpdGFibGUuanMiOjc2fV0sOTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyJ1c2Ugc3RyaWN0Ijt2YXIgQnVmZmVyPXJlcXVpcmUoInNhZmUtYnVmZmVyIikuQnVmZmVyO3ZhciBpc0VuY29kaW5nPUJ1ZmZlci5pc0VuY29kaW5nfHxmdW5jdGlvbihlbmNvZGluZyl7ZW5jb2Rpbmc9IiIrZW5jb2Rpbmc7c3dpdGNoKGVuY29kaW5nJiZlbmNvZGluZy50b0xvd2VyQ2FzZSgpKXtjYXNlImhleCI6Y2FzZSJ1dGY4IjpjYXNlInV0Zi04IjpjYXNlImFzY2lpIjpjYXNlImJpbmFyeSI6Y2FzZSJiYXNlNjQiOmNhc2UidWNzMiI6Y2FzZSJ1Y3MtMiI6Y2FzZSJ1dGYxNmxlIjpjYXNlInV0Zi0xNmxlIjpjYXNlInJhdyI6cmV0dXJuIHRydWU7ZGVmYXVsdDpyZXR1cm4gZmFsc2V9fTtmdW5jdGlvbiBfbm9ybWFsaXplRW5jb2RpbmcoZW5jKXtpZighZW5jKXJldHVybiJ1dGY4Ijt2YXIgcmV0cmllZDt3aGlsZSh0cnVlKXtzd2l0Y2goZW5jKXtjYXNlInV0ZjgiOmNhc2UidXRmLTgiOnJldHVybiJ1dGY4IjtjYXNlInVjczIiOmNhc2UidWNzLTIiOmNhc2UidXRmMTZsZSI6Y2FzZSJ1dGYtMTZsZSI6cmV0dXJuInV0ZjE2bGUiO2Nhc2UibGF0aW4xIjpjYXNlImJpbmFyeSI6cmV0dXJuImxhdGluMSI7Y2FzZSJiYXNlNjQiOmNhc2UiYXNjaWkiOmNhc2UiaGV4IjpyZXR1cm4gZW5jO2RlZmF1bHQ6aWYocmV0cmllZClyZXR1cm47ZW5jPSgiIitlbmMpLnRvTG93ZXJDYXNlKCk7cmV0cmllZD10cnVlfX19ZnVuY3Rpb24gbm9ybWFsaXplRW5jb2RpbmcoZW5jKXt2YXIgbmVuYz1fbm9ybWFsaXplRW5jb2RpbmcoZW5jKTtpZih0eXBlb2YgbmVuYyE9PSJzdHJpbmciJiYoQnVmZmVyLmlzRW5jb2Rpbmc9PT1pc0VuY29kaW5nfHwhaXNFbmNvZGluZyhlbmMpKSl0aHJvdyBuZXcgRXJyb3IoIlVua25vd24gZW5jb2Rpbmc6ICIrZW5jKTtyZXR1cm4gbmVuY3x8ZW5jfWV4cG9ydHMuU3RyaW5nRGVjb2Rlcj1TdHJpbmdEZWNvZGVyO2Z1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2Rpbmcpe3RoaXMuZW5jb2Rpbmc9bm9ybWFsaXplRW5jb2RpbmcoZW5jb2RpbmcpO3ZhciBuYjtzd2l0Y2godGhpcy5lbmNvZGluZyl7Y2FzZSJ1dGYxNmxlIjp0aGlzLnRleHQ9dXRmMTZUZXh0O3RoaXMuZW5kPXV0ZjE2RW5kO25iPTQ7YnJlYWs7Y2FzZSJ1dGY4Ijp0aGlzLmZpbGxMYXN0PXV0ZjhGaWxsTGFzdDtuYj00O2JyZWFrO2Nhc2UiYmFzZTY0Ijp0aGlzLnRleHQ9YmFzZTY0VGV4dDt0aGlzLmVuZD1iYXNlNjRFbmQ7bmI9MzticmVhaztkZWZhdWx0OnRoaXMud3JpdGU9c2ltcGxlV3JpdGU7dGhpcy5lbmQ9c2ltcGxlRW5kO3JldHVybn10aGlzLmxhc3ROZWVkPTA7dGhpcy5sYXN0VG90YWw9MDt0aGlzLmxhc3RDaGFyPUJ1ZmZlci5hbGxvY1Vuc2FmZShuYil9U3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24oYnVmKXtpZihidWYubGVuZ3RoPT09MClyZXR1cm4iIjt2YXIgcjt2YXIgaTtpZih0aGlzLmxhc3ROZWVkKXtyPXRoaXMuZmlsbExhc3QoYnVmKTtpZihyPT09dW5kZWZpbmVkKXJldHVybiIiO2k9dGhpcy5sYXN0TmVlZDt0aGlzLmxhc3ROZWVkPTB9ZWxzZXtpPTB9aWYoaTxidWYubGVuZ3RoKXJldHVybiByP3IrdGhpcy50ZXh0KGJ1ZixpKTp0aGlzLnRleHQoYnVmLGkpO3JldHVybiByfHwiIn07U3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kPXV0ZjhFbmQ7U3RyaW5nRGVjb2Rlci5wcm90b3R5cGUudGV4dD11dGY4VGV4dDtTdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5maWxsTGFzdD1mdW5jdGlvbihidWYpe2lmKHRoaXMubGFzdE5lZWQ8PWJ1Zi5sZW5ndGgpe2J1Zi5jb3B5KHRoaXMubGFzdENoYXIsdGhpcy5sYXN0VG90YWwtdGhpcy5sYXN0TmVlZCwwLHRoaXMubGFzdE5lZWQpO3JldHVybiB0aGlzLmxhc3RDaGFyLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcsMCx0aGlzLmxhc3RUb3RhbCl9YnVmLmNvcHkodGhpcy5sYXN0Q2hhcix0aGlzLmxhc3RUb3RhbC10aGlzLmxhc3ROZWVkLDAsYnVmLmxlbmd0aCk7dGhpcy5sYXN0TmVlZC09YnVmLmxlbmd0aH07ZnVuY3Rpb24gdXRmOENoZWNrQnl0ZShieXRlKXtpZihieXRlPD0xMjcpcmV0dXJuIDA7ZWxzZSBpZihieXRlPj41PT09NilyZXR1cm4gMjtlbHNlIGlmKGJ5dGU+PjQ9PT0xNClyZXR1cm4gMztlbHNlIGlmKGJ5dGU+PjM9PT0zMClyZXR1cm4gNDtyZXR1cm4gYnl0ZT4+Nj09PTI/LTE6LTJ9ZnVuY3Rpb24gdXRmOENoZWNrSW5jb21wbGV0ZShzZWxmLGJ1ZixpKXt2YXIgaj1idWYubGVuZ3RoLTE7aWYoajxpKXJldHVybiAwO3ZhciBuYj11dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7aWYobmI+PTApe2lmKG5iPjApc2VsZi5sYXN0TmVlZD1uYi0xO3JldHVybiBuYn1pZigtLWo8aXx8bmI9PT0tMilyZXR1cm4gMDtuYj11dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7aWYobmI+PTApe2lmKG5iPjApc2VsZi5sYXN0TmVlZD1uYi0yO3JldHVybiBuYn1pZigtLWo8aXx8bmI9PT0tMilyZXR1cm4gMDtuYj11dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7aWYobmI+PTApe2lmKG5iPjApe2lmKG5iPT09MiluYj0wO2Vsc2Ugc2VsZi5sYXN0TmVlZD1uYi0zfXJldHVybiBuYn1yZXR1cm4gMH1mdW5jdGlvbiB1dGY4Q2hlY2tFeHRyYUJ5dGVzKHNlbGYsYnVmLHApe2lmKChidWZbMF0mMTkyKSE9PTEyOCl7c2VsZi5sYXN0TmVlZD0wO3JldHVybiLvv70ifWlmKHNlbGYubGFzdE5lZWQ+MSYmYnVmLmxlbmd0aD4xKXtpZigoYnVmWzFdJjE5MikhPT0xMjgpe3NlbGYubGFzdE5lZWQ9MTtyZXR1cm4i77+9In1pZihzZWxmLmxhc3ROZWVkPjImJmJ1Zi5sZW5ndGg+Mil7aWYoKGJ1ZlsyXSYxOTIpIT09MTI4KXtzZWxmLmxhc3ROZWVkPTI7cmV0dXJuIu+/vSJ9fX19ZnVuY3Rpb24gdXRmOEZpbGxMYXN0KGJ1Zil7dmFyIHA9dGhpcy5sYXN0VG90YWwtdGhpcy5sYXN0TmVlZDt2YXIgcj11dGY4Q2hlY2tFeHRyYUJ5dGVzKHRoaXMsYnVmLHApO2lmKHIhPT11bmRlZmluZWQpcmV0dXJuIHI7aWYodGhpcy5sYXN0TmVlZDw9YnVmLmxlbmd0aCl7YnVmLmNvcHkodGhpcy5sYXN0Q2hhcixwLDAsdGhpcy5sYXN0TmVlZCk7cmV0dXJuIHRoaXMubGFzdENoYXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywwLHRoaXMubGFzdFRvdGFsKX1idWYuY29weSh0aGlzLmxhc3RDaGFyLHAsMCxidWYubGVuZ3RoKTt0aGlzLmxhc3ROZWVkLT1idWYubGVuZ3RofWZ1bmN0aW9uIHV0ZjhUZXh0KGJ1ZixpKXt2YXIgdG90YWw9dXRmOENoZWNrSW5jb21wbGV0ZSh0aGlzLGJ1ZixpKTtpZighdGhpcy5sYXN0TmVlZClyZXR1cm4gYnVmLnRvU3RyaW5nKCJ1dGY4IixpKTt0aGlzLmxhc3RUb3RhbD10b3RhbDt2YXIgZW5kPWJ1Zi5sZW5ndGgtKHRvdGFsLXRoaXMubGFzdE5lZWQpO2J1Zi5jb3B5KHRoaXMubGFzdENoYXIsMCxlbmQpO3JldHVybiBidWYudG9TdHJpbmcoInV0ZjgiLGksZW5kKX1mdW5jdGlvbiB1dGY4RW5kKGJ1Zil7dmFyIHI9YnVmJiZidWYubGVuZ3RoP3RoaXMud3JpdGUoYnVmKToiIjtpZih0aGlzLmxhc3ROZWVkKXJldHVybiByKyLvv70iO3JldHVybiByfWZ1bmN0aW9uIHV0ZjE2VGV4dChidWYsaSl7aWYoKGJ1Zi5sZW5ndGgtaSklMj09PTApe3ZhciByPWJ1Zi50b1N0cmluZygidXRmMTZsZSIsaSk7aWYocil7dmFyIGM9ci5jaGFyQ29kZUF0KHIubGVuZ3RoLTEpO2lmKGM+PTU1Mjk2JiZjPD01NjMxOSl7dGhpcy5sYXN0TmVlZD0yO3RoaXMubGFzdFRvdGFsPTQ7dGhpcy5sYXN0Q2hhclswXT1idWZbYnVmLmxlbmd0aC0yXTt0aGlzLmxhc3RDaGFyWzFdPWJ1ZltidWYubGVuZ3RoLTFdO3JldHVybiByLnNsaWNlKDAsLTEpfX1yZXR1cm4gcn10aGlzLmxhc3ROZWVkPTE7dGhpcy5sYXN0VG90YWw9Mjt0aGlzLmxhc3RDaGFyWzBdPWJ1ZltidWYubGVuZ3RoLTFdO3JldHVybiBidWYudG9TdHJpbmcoInV0ZjE2bGUiLGksYnVmLmxlbmd0aC0xKX1mdW5jdGlvbiB1dGYxNkVuZChidWYpe3ZhciByPWJ1ZiYmYnVmLmxlbmd0aD90aGlzLndyaXRlKGJ1Zik6IiI7aWYodGhpcy5sYXN0TmVlZCl7dmFyIGVuZD10aGlzLmxhc3RUb3RhbC10aGlzLmxhc3ROZWVkO3JldHVybiByK3RoaXMubGFzdENoYXIudG9TdHJpbmcoInV0ZjE2bGUiLDAsZW5kKX1yZXR1cm4gcn1mdW5jdGlvbiBiYXNlNjRUZXh0KGJ1ZixpKXt2YXIgbj0oYnVmLmxlbmd0aC1pKSUzO2lmKG49PT0wKXJldHVybiBidWYudG9TdHJpbmcoImJhc2U2NCIsaSk7dGhpcy5sYXN0TmVlZD0zLW47dGhpcy5sYXN0VG90YWw9MztpZihuPT09MSl7dGhpcy5sYXN0Q2hhclswXT1idWZbYnVmLmxlbmd0aC0xXX1lbHNle3RoaXMubGFzdENoYXJbMF09YnVmW2J1Zi5sZW5ndGgtMl07dGhpcy5sYXN0Q2hhclsxXT1idWZbYnVmLmxlbmd0aC0xXX1yZXR1cm4gYnVmLnRvU3RyaW5nKCJiYXNlNjQiLGksYnVmLmxlbmd0aC1uKX1mdW5jdGlvbiBiYXNlNjRFbmQoYnVmKXt2YXIgcj1idWYmJmJ1Zi5sZW5ndGg/dGhpcy53cml0ZShidWYpOiIiO2lmKHRoaXMubGFzdE5lZWQpcmV0dXJuIHIrdGhpcy5sYXN0Q2hhci50b1N0cmluZygiYmFzZTY0IiwwLDMtdGhpcy5sYXN0TmVlZCk7cmV0dXJuIHJ9ZnVuY3Rpb24gc2ltcGxlV3JpdGUoYnVmKXtyZXR1cm4gYnVmLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpfWZ1bmN0aW9uIHNpbXBsZUVuZChidWYpe3JldHVybiBidWYmJmJ1Zi5sZW5ndGg/dGhpcy53cml0ZShidWYpOiIifX0seyJzYWZlLWJ1ZmZlciI6Nzh9XSw5OTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7KGZ1bmN0aW9uKHNldEltbWVkaWF0ZSxjbGVhckltbWVkaWF0ZSl7dmFyIG5leHRUaWNrPXJlcXVpcmUoInByb2Nlc3MvYnJvd3Nlci5qcyIpLm5leHRUaWNrO3ZhciBhcHBseT1GdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7dmFyIHNsaWNlPUFycmF5LnByb3RvdHlwZS5zbGljZTt2YXIgaW1tZWRpYXRlSWRzPXt9O3ZhciBuZXh0SW1tZWRpYXRlSWQ9MDtleHBvcnRzLnNldFRpbWVvdXQ9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LHdpbmRvdyxhcmd1bWVudHMpLGNsZWFyVGltZW91dCl9O2V4cG9ydHMuc2V0SW50ZXJ2YWw9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCx3aW5kb3csYXJndW1lbnRzKSxjbGVhckludGVydmFsKX07ZXhwb3J0cy5jbGVhclRpbWVvdXQ9ZXhwb3J0cy5jbGVhckludGVydmFsPWZ1bmN0aW9uKHRpbWVvdXQpe3RpbWVvdXQuY2xvc2UoKX07ZnVuY3Rpb24gVGltZW91dChpZCxjbGVhckZuKXt0aGlzLl9pZD1pZDt0aGlzLl9jbGVhckZuPWNsZWFyRm59VGltZW91dC5wcm90b3R5cGUudW5yZWY9VGltZW91dC5wcm90b3R5cGUucmVmPWZ1bmN0aW9uKCl7fTtUaW1lb3V0LnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3RoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csdGhpcy5faWQpfTtleHBvcnRzLmVucm9sbD1mdW5jdGlvbihpdGVtLG1zZWNzKXtjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7aXRlbS5faWRsZVRpbWVvdXQ9bXNlY3N9O2V4cG9ydHMudW5lbnJvbGw9ZnVuY3Rpb24oaXRlbSl7Y2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO2l0ZW0uX2lkbGVUaW1lb3V0PS0xfTtleHBvcnRzLl91bnJlZkFjdGl2ZT1leHBvcnRzLmFjdGl2ZT1mdW5jdGlvbihpdGVtKXtjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7dmFyIG1zZWNzPWl0ZW0uX2lkbGVUaW1lb3V0O2lmKG1zZWNzPj0wKXtpdGVtLl9pZGxlVGltZW91dElkPXNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCl7aWYoaXRlbS5fb25UaW1lb3V0KWl0ZW0uX29uVGltZW91dCgpfSxtc2Vjcyl9fTtleHBvcnRzLnNldEltbWVkaWF0ZT10eXBlb2Ygc2V0SW1tZWRpYXRlPT09ImZ1bmN0aW9uIj9zZXRJbW1lZGlhdGU6ZnVuY3Rpb24oZm4pe3ZhciBpZD1uZXh0SW1tZWRpYXRlSWQrKzt2YXIgYXJncz1hcmd1bWVudHMubGVuZ3RoPDI/ZmFsc2U6c2xpY2UuY2FsbChhcmd1bWVudHMsMSk7aW1tZWRpYXRlSWRzW2lkXT10cnVlO25leHRUaWNrKGZ1bmN0aW9uIG9uTmV4dFRpY2soKXtpZihpbW1lZGlhdGVJZHNbaWRdKXtpZihhcmdzKXtmbi5hcHBseShudWxsLGFyZ3MpfWVsc2V7Zm4uY2FsbChudWxsKX1leHBvcnRzLmNsZWFySW1tZWRpYXRlKGlkKX19KTtyZXR1cm4gaWR9O2V4cG9ydHMuY2xlYXJJbW1lZGlhdGU9dHlwZW9mIGNsZWFySW1tZWRpYXRlPT09ImZ1bmN0aW9uIj9jbGVhckltbWVkaWF0ZTpmdW5jdGlvbihpZCl7ZGVsZXRlIGltbWVkaWF0ZUlkc1tpZF19fSkuY2FsbCh0aGlzLHJlcXVpcmUoInRpbWVycyIpLnNldEltbWVkaWF0ZSxyZXF1aXJlKCJ0aW1lcnMiKS5jbGVhckltbWVkaWF0ZSl9LHsicHJvY2Vzcy9icm93c2VyLmpzIjo2Mix0aW1lcnM6OTl9XSwxMDA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpeyhmdW5jdGlvbihnbG9iYWwpe21vZHVsZS5leHBvcnRzPWRlcHJlY2F0ZTtmdW5jdGlvbiBkZXByZWNhdGUoZm4sbXNnKXtpZihjb25maWcoIm5vRGVwcmVjYXRpb24iKSl7cmV0dXJuIGZufXZhciB3YXJuZWQ9ZmFsc2U7ZnVuY3Rpb24gZGVwcmVjYXRlZCgpe2lmKCF3YXJuZWQpe2lmKGNvbmZpZygidGhyb3dEZXByZWNhdGlvbiIpKXt0aHJvdyBuZXcgRXJyb3IobXNnKX1lbHNlIGlmKGNvbmZpZygidHJhY2VEZXByZWNhdGlvbiIpKXtjb25zb2xlLnRyYWNlKG1zZyl9ZWxzZXtjb25zb2xlLndhcm4obXNnKX13YXJuZWQ9dHJ1ZX1yZXR1cm4gZm4uYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiBkZXByZWNhdGVkfWZ1bmN0aW9uIGNvbmZpZyhuYW1lKXt0cnl7aWYoIWdsb2JhbC5sb2NhbFN0b3JhZ2UpcmV0dXJuIGZhbHNlfWNhdGNoKF8pe3JldHVybiBmYWxzZX12YXIgdmFsPWdsb2JhbC5sb2NhbFN0b3JhZ2VbbmFtZV07aWYobnVsbD09dmFsKXJldHVybiBmYWxzZTtyZXR1cm4gU3RyaW5nKHZhbCkudG9Mb3dlckNhc2UoKT09PSJ0cnVlIn19KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCE9PSJ1bmRlZmluZWQiP2dsb2JhbDp0eXBlb2Ygc2VsZiE9PSJ1bmRlZmluZWQiP3NlbGY6dHlwZW9mIHdpbmRvdyE9PSJ1bmRlZmluZWQiP3dpbmRvdzp7fSl9LHt9XX0se30sWzJdKTs=","base64").toString("utf8");
})();
var __cryptoLib;
eval(bundle_source);
__export(require("../sync/types"));
__export(require("./serializer"));
var isMultithreadingEnabled = environnement_1.isBrowser() ? (typeof Worker !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof Blob !== "undefined") : true;
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
},{"../sync/environnement":12,"../sync/types":13,"./WorkerThread":4,"./polyfills":9,"./serializer":10,"buffer":33,"path":48,"run-exclusive":17}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../sync/types");
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
            (new Array(9 + Math.floor(Math.random() * 50)))
                .fill(" ")
                .join("")
        ].join(""), "utf8"));
        var finalize = function (value) { return types_1.toBuffer(value).toString(stringRepresentationEncoding); };
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
        var finalize = function (value) { return parse(types_1.toBuffer(value).toString("utf8")); };
        return matchPromise(prOrValue) ?
            prOrValue.then(function (value) { return finalize(value); }) :
            finalize(prOrValue);
    };
}
exports.decryptThenParseFactory = decryptThenParseFactory;

}).call(this,require("buffer").Buffer)
},{"../sync/types":13,"buffer":33,"transfer-tools/dist/lib/JSON_CUSTOM":20}],11:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environnement = require("../environnement");
var types_1 = require("../types");
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
                "data": types_1.toBuffer(value).toString("binary")
            };
        }
        SerializableUint8Array.build = build;
        function restore(value) {
            return Buffer.from(value.data, "binary");
        }
        SerializableUint8Array.restore = restore;
    })(SerializableUint8Array || (SerializableUint8Array = {}));
    function prepare(threadMessage) {
        if (environnement.isBrowser()) {
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
        if (environnement.isBrowser()) {
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
},{"../environnement":12,"../types":13,"buffer":33}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isBrowser() {
    return (typeof window !== "undefined" ||
        typeof self !== "undefined" && !!self.postMessage);
}
exports.isBrowser = isBrowser;

},{}],13:[function(require,module,exports){
(function (Buffer){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * NOTE: Does not guaranty that the returned object is an acutal
 * buffer instance, just that the to string method can be called
 * as on the Buffer prototype. ( even if the current implementation does)
 */
function toBuffer(uint8Array) {
    return Buffer.from(uint8Array.buffer, uint8Array.byteOffset, uint8Array.length);
}
exports.toBuffer = toBuffer;
var RsaKey;
(function (RsaKey) {
    function stringify(rsaKey) {
        return JSON.stringify([rsaKey.format, toBuffer(rsaKey.data).toString("base64")]);
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
},{"buffer":33}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":14}],16:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":15}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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
},{"has":16}],20:[function(require,module,exports){
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

},{"super-json":19}],21:[function(require,module,exports){
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
},{"buffer":33}],22:[function(require,module,exports){
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

},{"./SyncEventBase":23}],23:[function(require,module,exports){
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

},{"./SyncEventBaseProtected":24}],24:[function(require,module,exports){
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

},{"./defs":25,"run-exclusive":17}],25:[function(require,module,exports){
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

},{"setprototypeof":18}],26:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var SyncEvent_1 = require("./SyncEvent");
exports.SyncEvent = SyncEvent_1.SyncEvent;
exports.VoidSyncEvent = SyncEvent_1.VoidSyncEvent;
var defs_1 = require("./defs");
exports.EvtError = defs_1.EvtError;

},{"./SyncEvent":22,"./defs":25}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("../../gateway/dist/lib/types");
exports.types = types;
var bundledData_1 = require("../../gateway/dist/lib/misc/bundledData");
exports.smuggleBundledDataInHeaders = bundledData_1.smuggleBundledDataInHeaders;
exports.extractBundledDataFromHeaders = bundledData_1.extractBundledDataFromHeaders;
var urlSafeBase64encoderDecoder_1 = require("../../gateway/dist/lib/misc/urlSafeBase64encoderDecoder");
exports.urlSafeB64 = urlSafeBase64encoderDecoder_1.urlSafeB64;

},{"../../gateway/dist/lib/misc/bundledData":1,"../../gateway/dist/lib/misc/urlSafeBase64encoderDecoder":2,"../../gateway/dist/lib/types":3}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserSimInfos;
(function (UserSimInfos) {
    UserSimInfos.key = "user_sim_infos";
})(UserSimInfos = exports.UserSimInfos || (exports.UserSimInfos = {}));
;

},{}],29:[function(require,module,exports){
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

},{"../../gateway":27,"../UserSimInfos":28}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobile_1 = require("./UserSimInfos/mobile");
var bundledData_1 = require("./bundledData");
var bundleExport = {
    "parseUserSimInfos": mobile_1.UserSimInfos.parse,
    smuggleBundledDataInHeaders: bundledData_1.smuggleBundledDataInHeaders,
    extractBundledDataFromHeaders: bundledData_1.extractBundledDataFromHeaders
};
Object.assign(__global, bundleExport);

},{"./UserSimInfos/mobile":29,"./bundledData":31}],31:[function(require,module,exports){
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
function extractBundledDataFromHeaders(headers, towardUserDecryptKeyStr) {
    var decryptorMap = extractBundledDataFromHeaders.decryptorMap;
    var decryptor = decryptorMap.get(towardUserDecryptKeyStr);
    if (decryptor === undefined) {
        decryptor = cryptoLib.rsa.syncDecryptorFactory(cryptoLib.RsaKey.parse(towardUserDecryptKeyStr));
        decryptorMap.set(towardUserDecryptKeyStr, decryptor);
    }
    return gateway.extractBundledDataFromHeaders(headers, decryptor);
}
exports.extractBundledDataFromHeaders = extractBundledDataFromHeaders;
(function (extractBundledDataFromHeaders) {
    extractBundledDataFromHeaders.decryptorMap = new Map();
})(extractBundledDataFromHeaders = exports.extractBundledDataFromHeaders || (exports.extractBundledDataFromHeaders = {}));

},{"../gateway":27,"crypto-lib":38}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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
},{"base64-js":32,"buffer":33,"ieee754":47}],34:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"../sync/environnement":42,"./WorkerThread/node":35,"./WorkerThread/simulated":36,"./WorkerThread/web":37,"dup":4}],35:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"../../sync/_worker_thread/ThreadMessage":41,"buffer":33,"dup":5,"path":48,"ts-events-extended":58}],36:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6,"ts-events-extended":58}],37:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7,"ts-events-extended":58}],38:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"../sync/environnement":42,"../sync/types":43,"./WorkerThread":34,"./polyfills":39,"./serializer":40,"buffer":33,"dup":8,"path":48,"run-exclusive":50}],39:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],40:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"../sync/types":43,"buffer":33,"dup":10,"transfer-tools/dist/lib/JSON_CUSTOM":53}],41:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"../environnement":42,"../types":43,"buffer":33,"dup":11}],42:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],43:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"buffer":33,"dup":13}],44:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],45:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./implementation":44,"dup":15}],46:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16,"function-bind":45}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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
},{"_process":49}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],51:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],52:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19,"has":46}],53:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20,"super-json":52}],54:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"./SyncEventBase":55,"dup":22}],55:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./SyncEventBaseProtected":56,"dup":23}],56:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./defs":57,"dup":24,"run-exclusive":50}],57:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25,"setprototypeof":51}],58:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"./SyncEvent":54,"./defs":57,"dup":26}]},{},[30]);
