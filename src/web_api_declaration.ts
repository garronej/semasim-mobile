import { types as gwTypes } from "./gateway";

export namespace linphonerc {

    export const methodName = "linphonerc";

    export type Params = {
        email: string;
        secret: string;
    } | {
        email: string;
        secret: string;
        uuid: string;
        platform: gwTypes.Ua.Platform;
        push_token: string;
    };

}
