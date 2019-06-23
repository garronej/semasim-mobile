
export type UserSimInfos = {
    iso: string | undefined;
    number: string | undefined; /** is phoneNumber */
    towardSimEncryptKeyStr: string;
};

export namespace UserSimInfos {

    export const key = "user_sim_infos";

};