
import * as cryptoLib from "crypto-lib";

const encryptorMap = new Map<
    string,
    cryptoLib.Sync<cryptoLib.Encryptor>
>();

export function getEncryptorStatic(encryptKeyStr: string): cryptoLib.Sync<cryptoLib.Encryptor> {

    let encryptor = encryptorMap.get(encryptKeyStr);

    if (encryptor === undefined) {

        encryptor = cryptoLib.rsa.syncEncryptorFactory(
            cryptoLib.RsaKey.parse(
                encryptKeyStr
            )
        );

        encryptorMap.set(encryptKeyStr, encryptor);

    }

    return encryptor;

}

const decryptorMap = new Map<
    string,
    cryptoLib.Sync<cryptoLib.Decryptor>
>();

export function getDecryptorStatic(decryptKeyStr: string): cryptoLib.Sync<cryptoLib.Decryptor> {

    let decryptor = decryptorMap.get(decryptKeyStr);

    if (decryptor === undefined) {

        decryptor = cryptoLib.rsa.syncDecryptorFactory(
            cryptoLib.RsaKey.parse(
                decryptKeyStr
            )
        );

        decryptorMap.set(decryptKeyStr, decryptor);

    }

    return decryptor;

}