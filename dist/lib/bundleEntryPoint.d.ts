import { UserSimInfos } from "./UserSimInfos/mobile";
import { smuggleBundledDataInHeaders, extractBundledDataFromHeaders } from "./bundledData";
declare const __lib: {
    "parseUserSimInfos": typeof UserSimInfos.parse;
    smuggleBundledDataInHeaders: typeof smuggleBundledDataInHeaders;
    extractBundledDataFromHeaders: typeof extractBundledDataFromHeaders;
};
export declare type Lib = typeof __lib;
export {};
