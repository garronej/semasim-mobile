

declare const __global: typeof global;

import { UserSimInfos } from "./UserSimInfos/mobile";
import { 
    smuggleBundledDataInHeaders, 
    extractBundledDataFromHeaders 
} from "./bundledData";

const bundleExport= {
    "parseUserSimInfos": UserSimInfos.parse,
    smuggleBundledDataInHeaders,
    extractBundledDataFromHeaders
};

//Exported only for help in tests.
export type BundleExport = typeof bundleExport;

Object.assign(__global, bundleExport);
