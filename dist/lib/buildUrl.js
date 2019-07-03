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
