"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("../../gateway/dist/lib/types");
exports.types = types;
var bundledData_1 = require("../../gateway/dist/lib/misc/bundledData");
exports.smuggleBundledDataInHeaders = bundledData_1.smuggleBundledDataInHeaders;
exports.extractBundledDataFromHeaders = bundledData_1.extractBundledDataFromHeaders;
var urlSafeBase64encoderDecoder_1 = require("../../gateway/dist/lib/misc/urlSafeBase64encoderDecoder");
exports.urlSafeB64 = urlSafeBase64encoderDecoder_1.urlSafeB64;
