import * as cryptoLib from "crypto-lib";
import { types as gwTypes } from "../gateway";
/** Return Record<string, string> stringified */
export declare function smuggleBundledDataInHeaders<T extends gwTypes.BundledData.ClientToServer>(data: T, towardSimEncryptKeyStr: string): Record<string, string>;
export declare namespace smuggleBundledDataInHeaders {
    const encryptorMap: Map<string, cryptoLib.Sync<cryptoLib.Encryptor>>;
}
export declare function extractBundledDataFromHeaders<T extends gwTypes.BundledData.ServerToClient>(getHeaderValue: (headerName: string) => string | null, towardUserDecryptKeyStr: string): T;
export declare namespace extractBundledDataFromHeaders {
    const decryptorMap: Map<string, cryptoLib.Sync<cryptoLib.Decryptor>>;
}
