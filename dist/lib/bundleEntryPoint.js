"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobile_1 = require("./UserSimInfos/mobile");
var bundledData_1 = require("./bundledData");
var __lib = {
    "parseUserSimInfos": mobile_1.UserSimInfos.parse,
    smuggleBundledDataInHeaders: bundledData_1.smuggleBundledDataInHeaders,
    extractBundledDataFromHeaders: bundledData_1.extractBundledDataFromHeaders
};
Object.assign(lib, __lib);
/*NOTE: Only needed for tests. LiquidCore does not introduce
node global object.
*/
if (nodeJsGlobal !== undefined) {
    Object.assign(nodeJsGlobal, { lib: lib });
}
