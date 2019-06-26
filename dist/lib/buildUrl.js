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
function buildSubscriptionPageUrl(baseDomain) {
    return buildUrlPath(baseDomain, "/" + frontend_1.availablePages.PageName.subscription);
}
exports.buildSubscriptionPageUrl = buildSubscriptionPageUrl;
