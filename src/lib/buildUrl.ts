
import { buildUrl, availablePages } from "../frontend";
import { webApiPath } from "../gateway";
import * as webApiDeclaration from "../web_api_declaration";

export type BaseDomain = "semasim.com" | "dev.semasim.com";

/** absolutePath should be preceded of "/" eg: "/api/linphonerc" or "/login" */
const buildUrlPath = (baseDomain: BaseDomain, absolutePath: string) => `https://web.${baseDomain}${absolutePath}`;

export function buildLoginPageUrl(baseDomain: BaseDomain, email?: string) {

    return buildUrl<availablePages.urlParams.Login>(
        buildUrlPath(baseDomain, `/${availablePages.PageName.login}`),
        { "webview": "true", email }
    );

}

export const buildLinphonercUrl = (() => {

    const { methodName } = webApiDeclaration.linphonerc;
    type Params = webApiDeclaration.linphonerc.Params;

    return (
        baseDomain: BaseDomain,
        params: Params
    ) => buildUrl(
        buildUrlPath(baseDomain, `${webApiPath}/${methodName}`),
        params
    );

})();

export function buildManagerPageUrl(baseDomain: BaseDomain) {
    return buildUrlPath(baseDomain, `/${availablePages.PageName.manager}`);
}

export function buildWebviewphoneUrl(baseDomain: BaseDomain){
    return buildUrlPath(baseDomain, `/${availablePages.PageName.webviewphone}`);
}
