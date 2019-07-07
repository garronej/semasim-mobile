import * as cryptoLib from "crypto-lib";
export declare function getEncryptorStatic(encryptKeyStr: string): cryptoLib.Sync<cryptoLib.Encryptor>;
export declare function getDecryptorStatic(decryptKeyStr: string): cryptoLib.Sync<cryptoLib.Decryptor>;
