import { UserSimInfos } from "./UserSimInfos/mobile";
import { smuggleBundledDataInHeaders, extractBundledDataFromHeaders } from "./bundledData";
declare const parseUserSimInfos: typeof UserSimInfos.parse;
export { parseUserSimInfos, smuggleBundledDataInHeaders, extractBundledDataFromHeaders };
