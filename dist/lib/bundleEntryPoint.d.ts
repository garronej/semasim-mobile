import { UserSimInfos } from "./UserSimInfos/mobile";
import { smuggleBundledDataInHeaders, extractBundledDataFromHeaders } from "./bundledData";
declare const bundleExport: {
    "parseUserSimInfos": typeof UserSimInfos.parse;
    smuggleBundledDataInHeaders: typeof smuggleBundledDataInHeaders;
    extractBundledDataFromHeaders: typeof extractBundledDataFromHeaders;
};
export declare type BundleExport = typeof bundleExport;
export {};
