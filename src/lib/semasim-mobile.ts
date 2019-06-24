
import { UserSimInfos } from "./UserSimInfos/mobile";
import { 
    smuggleBundledDataInHeaders, 
    extractBundledDataFromHeaders 
} from "./bundledData";

const parseUserSimInfos= UserSimInfos.parse;

export { 
    parseUserSimInfos,
    smuggleBundledDataInHeaders,
    extractBundledDataFromHeaders
}
