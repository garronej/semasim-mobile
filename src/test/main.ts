
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
        path.join(__dirname, "..", "..", "assets", "semasim-mobile.js")
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
        "exactSendDateTime": Date.now(),
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
        "pduDateTime": Date.now()
    };

    const record = smuggleBundledDataInHeaders(
        bundledData,
        cryptoLib.rsa.syncEncryptorFactory(towardUserEncryptKey)
    );

    const recoveredBundledData: typeof bundledData =
        lib.extractBundledDataFromHeaders(
            (headerName: string)=> record[headerName] || null,
            towardUserDecryptKeyStr
        );

    ttTesting.assertSame(recoveredBundledData, bundledData);

    console.log("PASS bundledData gateway -> mobile");

}

console.log("PASS");

{

    console.log("\nVisual URLs checks:");

    const baseDomain = "dev.semasim.com";

    const email = "joseph.garrone.gj@gmail.com";

    console.log([
        lib.buildLoginPageUrl(baseDomain, "joseph.garrone.gj@gmail.com"),
        lib.buildLoginPageUrl(baseDomain),
        lib.buildLinphonercUrl(baseDomain, ({ email, "secret": "ffffffffffffffff" })),
        lib.buildLinphonercUrl(
            baseDomain,
            {
                email,
                "secret": "ffffffffffffffff",
                "uuid": "4cf08b16-03da-41d9-a64a-26daa73c11e7",
                "platform": "android",
                "push_token": [
                    "f_l7SPs6o7A:APA91bF_c0VGlz3pQPwrgpFe9U0FRzc",
                    "VXlDmG97jt3DTzOlsjbUzsent-yeEz_QpQNhdO3Mbr-",
                    "4-XxcSmyKj_Hr-XY_-LefF3RhHsSekVsSeYN95PAtwR",
                    "Cpz-i1ytnc5DyMY8je4n69G"
                ].join("")
            }
        ),
        lib.buildManagerPageUrl(baseDomain),
        lib.buildWebviewphoneUrl(baseDomain),
        lib.buildSubscriptionPageUrl(baseDomain)
    ].join("\n"));

}

