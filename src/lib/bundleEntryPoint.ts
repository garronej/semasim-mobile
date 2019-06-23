
import { UserSimInfos } from "./UserSimInfos/mobile";
import { 
    smuggleBundledDataInHeaders, 
    extractBundledDataFromHeaders 
} from "./bundledData";

const __lib= {
    "parseUserSimInfos": UserSimInfos.parse,
    smuggleBundledDataInHeaders,
    extractBundledDataFromHeaders
};

//Exported only for help in tests.
export type Lib = typeof __lib;

declare const lib: Lib;

Object.assign(lib, __lib);

declare const nodeJsGlobal: NodeJS.Global | undefined;

/*NOTE: Only needed for tests. LiquidCore does not introduce
node global object.
*/
if (nodeJsGlobal !== undefined) {
    Object.assign(nodeJsGlobal, { lib });
}

