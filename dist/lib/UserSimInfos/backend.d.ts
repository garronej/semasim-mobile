import * as type from "../UserSimInfos";
export declare type UserSimInfos = type.UserSimInfos;
export declare namespace UserSimInfos {
    /** returns user_sim_infos=eyJ1c2VyRW1haWwiOiJqb3...cWw__ */
    function buildContactParam(userSimInfos: UserSimInfos): string;
}
