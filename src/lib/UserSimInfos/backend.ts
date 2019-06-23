
import { urlSafeB64 } from "../../gateway";

import * as type from "../UserSimInfos";

export type UserSimInfos= type.UserSimInfos;

export namespace UserSimInfos {

    /** returns user_sim_infos=eyJ1c2VyRW1haWwiOiJqb3...cWw__ */
    export function buildContactParam(userSimInfos: UserSimInfos) {
        return `${type.UserSimInfos.key}=${urlSafeB64.enc(JSON.stringify(userSimInfos))}`
    }

};