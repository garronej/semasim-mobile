
import * as buildTools from "frontend-build-tools";
import * as path from "path";
import * as fs from "fs";

(async () => {

    const module_dir_path= path.join(__dirname, "..", "..");

    const bundle_file_path = path.join(module_dir_path, "res", "raw", "semasim_mobile.js");

    await buildTools.browserify(
        path.join(module_dir_path, "dist", "lib", "bundleEntryPoint.js"),
        bundle_file_path
    );

    fs.writeFileSync(
        bundle_file_path,
        Buffer.from(
            [
                "var __global=global;",
                fs.readFileSync(bundle_file_path).toString("utf8")
            ].join("\n"),
            "utf8"
        )
    );

})();

