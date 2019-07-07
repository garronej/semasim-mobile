

import { getEncryptorStatic, getDecryptorStatic } from "./encryptorDecryptorFactoryStatic";
import * as gateway from "../gateway";
import { types as gwTypes } from "../gateway";


/** Return Record<string, string> stringified */
export function smuggleBundledDataInHeaders<T extends gwTypes.BundledData.ClientToServer>(
    data: T,
    towardSimEncryptKeyStr: string
): Record<string, string> {

    return gateway.smuggleBundledDataInHeaders(
        data,
        getEncryptorStatic(towardSimEncryptKeyStr)
    );

}


//NOTE: The headers need to be extracted first in the main thread.
export const buildBundledDataSipHeaders = gateway.BundledDataSipHeaders.build;

export function extractBundledDataFromHeaders<T extends gwTypes.BundledData.ServerToClient>(
    bundledDataSipHeaders: gateway.BundledDataSipHeaders,
    towardUserDecryptKeyStr: string
): T {

    return gateway.extractBundledDataFromHeaders<T>(
        bundledDataSipHeaders,
        getDecryptorStatic(towardUserDecryptKeyStr)
    );

}


