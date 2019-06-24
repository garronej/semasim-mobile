
import * as fs from "fs";
import * as path from "path";
import { UserSimInfos } from "../lib/UserSimInfos/backend";
import * as ttTesting from "transfer-tools/dist/lib/testing";
import * as cryptoLib from "crypto-lib";
import {
    types as gwTypes,
    extractBundledDataFromHeaders,
    smuggleBundledDataInHeaders
} from "../gateway";

//NOTE: Simulate LiquidCore
global.setTimeout= undefined as any;

const real_require= require;

//NOTE: Make sure we do not need node crypto
require= function(module_name: string){

    if( module_name === "crypto" ){
        throw new Error("crypto not available");
    }

    return real_require(module_name);

} as any;

eval(
    fs.readFileSync(
        path.join(__dirname, "..", "..", "res", "raw", "semasim-mobile.js")
    ).toString("utf8")
);

const lib: typeof import("../lib/semasim-mobile")= require("semasim-mobile");

{

    const userSimInfos: UserSimInfos = {
        "iso": "fr",
        "number": "+33636786385",
        "towardSimEncryptKeyStr": "xxxxxxxxx"
    };

    const contactParam = UserSimInfos.buildContactParam(userSimInfos);

    const recoveredUserSimInfos = lib.parseUserSimInfos(
        `foo=bar;${contactParam};bar=baz`
    );

    ttTesting.assertSame(
        recoveredUserSimInfos,
        userSimInfos
    );

    console.log("PASS UserSimsInfos");

}


{

    const { publicKey, privateKey: towardSimDecryptKey } = cryptoLib.rsa.syncGenerateKeys(null, 80);


    const towardSimEncryptKeyStr = cryptoLib.RsaKey.stringify(publicKey);

    const bundledData: gwTypes.BundledData.ClientToServer.Message = {
        "type": "MESSAGE",
        "appendPromotionalMessage": true,
        "exactSendDate": new Date(),
        "text": "hello world"
    };

    const headers = lib.smuggleBundledDataInHeaders<typeof bundledData>(
        bundledData,
        towardSimEncryptKeyStr
    );

    const recoveredBundledData = extractBundledDataFromHeaders(
        headers,
        cryptoLib.rsa.syncDecryptorFactory(towardSimDecryptKey)
    );

    ttTesting.assertSame(recoveredBundledData, bundledData);

    console.log("PASS bundledData mobile -> gateway");

}

{

    const { publicKey: towardUserEncryptKey, privateKey } = cryptoLib.rsa.syncGenerateKeys(null, 80);

    const towardUserDecryptKeyStr = cryptoLib.RsaKey.stringify(privateKey);

    const bundledData: gwTypes.BundledData.ServerToClient.Message = {
        "type": "MESSAGE",
        "text": "hello world",
        "pduDate": new Date()
    };

    const record = smuggleBundledDataInHeaders(
        bundledData,
        cryptoLib.rsa.syncEncryptorFactory(towardUserEncryptKey)
    );

    const recoveredBundledData: typeof bundledData =
        lib.extractBundledDataFromHeaders(
            record,
            towardUserDecryptKeyStr
        );

    recoveredBundledData.pduDate = new Date(recoveredBundledData.pduDate);

    ttTesting.assertSame(recoveredBundledData, bundledData);

    console.log("PASS bundledData gateway -> mobile");

}

