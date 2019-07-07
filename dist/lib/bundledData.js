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
