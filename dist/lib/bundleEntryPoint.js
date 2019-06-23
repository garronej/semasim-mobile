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
