export * from "./bundledData";
export * from "./buildUrl";
import { UserSimInfos } from "./UserSimInfos/mobile";
declare const parseUserSimInfos: typeof UserSimInfos.parse;
export { parseUserSimInfos };
