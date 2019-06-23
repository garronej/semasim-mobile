
import { urlSafeB64 } from "../../gateway";

import * as type from "../UserSimInfos";

export type UserSimInfos= type.UserSimInfos;

export namespace UserSimInfos {

    /**
     * 
     * @param contactsParameters  "enc_email=am9zZXBoLmdhcnJvbmUuZ2pAZ21haWwuY29t;iso=fr;number=0769365812"
     * (in ini: contact_parameters=enc_email=am9zZXBoLmdhcnJvbmUuZ2pAZ21haWwuY29t;iso=fr;number=0769365812 )
     * 
     * return UserSimInfo stringified
     */
    export function parse(contactsParameters: string): UserSimInfos {

        return JSON.parse(
            urlSafeB64.dec(
                contactsParameters.split(";")
                    .find(param => param.startsWith(type.UserSimInfos.key))!
                    .split("=")[1]
            )
        );

    }

};