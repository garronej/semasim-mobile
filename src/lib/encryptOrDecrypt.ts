
import { getEncryptorStatic, getDecryptorStatic } from "./encryptorDecryptorFactoryStatic";
import * as cryptoLib from "crypto-lib";

/** Return outputDataB64 */
export function encryptOrDecrypt(
    action: "ENCRYPT" | "DECRYPT",
    keyStr: string,
    inputDataB64: string
): string {

    return cryptoLib.toBuffer(
        ((inputData: Uint8Array) => {
            switch (action) {
                case "ENCRYPT": return getEncryptorStatic(keyStr).encrypt(inputData);
                case "DECRYPT": return getDecryptorStatic(keyStr).decrypt(inputData);
            }
        })(Buffer.from(inputDataB64, "base64"))
    ).toString("base64");
}
