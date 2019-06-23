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
