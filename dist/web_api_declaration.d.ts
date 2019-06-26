import { types as gwTypes } from "./gateway";
export declare namespace linphonerc {
    const methodName = "linphonerc";
    type Params = {
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
