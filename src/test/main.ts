
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

eval(
    fs.readFileSync(
        path.join(__dirname, "..", "..", "res", "raw", "semasim_mobile.js")
    ).toString("utf8")
);

const bundleExport: import("../lib/bundleEntryPoint").BundleExport = global as any;

{

    const userSimInfos: UserSimInfos = {
        "iso": "fr",
        "number": "+33636786385",
        "towardSimEncryptKeyStr": "xxxxxxxxx"
    };

    const contactParam = UserSimInfos.buildContactParam(userSimInfos);

    const recoveredUserSimInfos = bundleExport.parseUserSimInfos(
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

    console.log( towardSimEncryptKeyStr );

    const bundledData: gwTypes.BundledData.ClientToServer.Message = {
        "type": "MESSAGE",
        "appendPromotionalMessage": true,
        "exactSendDate": new Date(),
        "text": "hello world"
    };

    const headers = bundleExport.smuggleBundledDataInHeaders<typeof bundledData>(
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
        bundleExport.extractBundledDataFromHeaders(
            record,
            towardUserDecryptKeyStr
        );

    recoveredBundledData.pduDate = new Date(recoveredBundledData.pduDate);

    ttTesting.assertSame(recoveredBundledData, bundledData);

    console.log("PASS bundledData gateway -> mobile");

}

