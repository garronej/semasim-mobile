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
