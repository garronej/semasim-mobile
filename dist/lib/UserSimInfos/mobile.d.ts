import * as type from "../UserSimInfos";
export declare type UserSimInfos = type.UserSimInfos;
export declare namespace UserSimInfos {
    /**
     *
     * @param contactsParameters  "enc_email=am9zZXBoLmdhcnJvbmUuZ2pAZ21haWwuY29t;iso=fr;number=0769365812"
     * (in ini: contact_parameters=enc_email=am9zZXBoLmdhcnJvbmUuZ2pAZ21haWwuY29t;iso=fr;number=0769365812 )
     *
     * return UserSimInfo stringified
     */
    function parse(contactsParameters: string): UserSimInfos;
}
