import * as gateway from "../gateway";
import { types as gwTypes } from "../gateway";
/** Return Record<string, string> stringified */
export declare function smuggleBundledDataInHeaders<T extends gwTypes.BundledData.ClientToServer>(data: T, towardSimEncryptKeyStr: string): Record<string, string>;
export declare const buildBundledDataSipHeaders: typeof gateway.BundledDataSipHeaders.build;
export declare function extractBundledDataFromHeaders<T extends gwTypes.BundledData.ServerToClient>(bundledDataSipHeaders: gateway.BundledDataSipHeaders, towardUserDecryptKeyStr: string): T;
