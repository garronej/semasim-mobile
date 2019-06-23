
import * as cryptoLib from "crypto-lib";

import * as gateway from "../gateway";
import { types as gwTypes } from "../gateway";


/** Return Record<string, string> stringified */
export function smuggleBundledDataInHeaders<T extends gwTypes.BundledData.ClientToServer>(
    data: T,
    towardSimEncryptKeyStr: string
): Record<string, string> {

    const { encryptorMap } = smuggleBundledDataInHeaders;

    let encryptor = encryptorMap.get(towardSimEncryptKeyStr);

    if (encryptor === undefined) {

        encryptor = cryptoLib.rsa.syncEncryptorFactory(
            cryptoLib.RsaKey.parse(
                towardSimEncryptKeyStr
            )
        );

        encryptorMap.set(towardSimEncryptKeyStr, encryptor);

    }

    return gateway.smuggleBundledDataInHeaders(
        data,
        encryptor
    );

}

export namespace smuggleBundledDataInHeaders {

    export const encryptorMap = new Map<
        string,
        cryptoLib.Sync<cryptoLib.Encryptor>
    >();


}


export function extractBundledDataFromHeaders<T extends gwTypes.BundledData.ServerToClient>(
    headers: Record<string,string>,
    towardUserDecryptKeyStr: string
): T {

    const { decryptorMap } = extractBundledDataFromHeaders;

    let decryptor = decryptorMap.get(towardUserDecryptKeyStr);

    if (decryptor === undefined) {

        decryptor = cryptoLib.rsa.syncDecryptorFactory(
            cryptoLib.RsaKey.parse(
                towardUserDecryptKeyStr
            )
        );

        decryptorMap.set(towardUserDecryptKeyStr, decryptor);

    }

    return gateway.extractBundledDataFromHeaders<T>(
        headers,
        decryptor
    );

}

export namespace extractBundledDataFromHeaders {

    export const decryptorMap = new Map<
        string,
        cryptoLib.Sync<cryptoLib.Decryptor>
    >();

}

