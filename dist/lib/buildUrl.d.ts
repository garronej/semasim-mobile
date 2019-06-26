import * as webApiDeclaration from "../web_api_declaration";
export declare type BaseDomain = "semasim.com" | "dev.semasim.com";
export declare function buildLoginPageUrl(baseDomain: BaseDomain, email?: string): string;
export declare const buildLinphonercUrl: (baseDomain: BaseDomain, params: webApiDeclaration.linphonerc.Params) => string;
export declare function buildManagerPageUrl(baseDomain: BaseDomain): string;
export declare function buildWebviewphoneUrl(baseDomain: BaseDomain): string;
export declare function buildSubscriptionPageUrl(baseDomain: BaseDomain): string;
