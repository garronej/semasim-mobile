"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cryptoLib = require("crypto-lib");
var encryptorMap = new Map();
function getEncryptorStatic(encryptKeyStr) {
    var encryptor = encryptorMap.get(encryptKeyStr);
    if (encryptor === undefined) {
        encryptor = cryptoLib.rsa.syncEncryptorFactory(cryptoLib.RsaKey.parse(encryptKeyStr));
        encryptorMap.set(encryptKeyStr, encryptor);
    }
    return encryptor;
}
exports.getEncryptorStatic = getEncryptorStatic;
var decryptorMap = new Map();
function getDecryptorStatic(decryptKeyStr) {
    var decryptor = decryptorMap.get(decryptKeyStr);
    if (decryptor === undefined) {
        decryptor = cryptoLib.rsa.syncDecryptorFactory(cryptoLib.RsaKey.parse(decryptKeyStr));
        decryptorMap.set(decryptKeyStr, decryptor);
    }
    return decryptor;
}
exports.getDecryptorStatic = getDecryptorStatic;
