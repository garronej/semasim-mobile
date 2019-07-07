"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var encryptorDecryptorFactoryStatic_1 = require("./encryptorDecryptorFactoryStatic");
var cryptoLib = require("crypto-lib");
/** Return outputDataB64 */
function encryptOrDecrypt(action, keyStr, inputDataB64) {
    return cryptoLib.toBuffer((function (inputData) {
        switch (action) {
            case "ENCRYPT": return encryptorDecryptorFactoryStatic_1.getEncryptorStatic(keyStr).encrypt(inputData);
            case "DECRYPT": return encryptorDecryptorFactoryStatic_1.getDecryptorStatic(keyStr).decrypt(inputData);
        }
    })(Buffer.from(inputDataB64, "base64"))).toString("base64");
}
exports.encryptOrDecrypt = encryptOrDecrypt;
