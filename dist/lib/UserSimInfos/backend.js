"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gateway_1 = require("../../gateway");
var type = require("../UserSimInfos");
var UserSimInfos;
(function (UserSimInfos) {
    /** returns user_sim_infos=eyJ1c2VyRW1haWwiOiJqb3...cWw__ */
    function buildContactParam(userSimInfos) {
        return type.UserSimInfos.key + "=" + gateway_1.urlSafeB64.enc(JSON.stringify(userSimInfos));
    }
    UserSimInfos.buildContactParam = buildContactParam;
})(UserSimInfos = exports.UserSimInfos || (exports.UserSimInfos = {}));
;
