
import * as buildTools from "frontend-build-tools";
import * as path from "path";

(async () => {

    const module_dir_path= path.join(__dirname, "..", "..");

    await buildTools.browserify(
        [ "--require", `${path.join(module_dir_path, "dist", "lib", "semasim-mobile.js")}:semasim-mobile`  ],
        [ "--outfile", path.join(module_dir_path, "res", "raw", "semasim-mobile.js") ]
    );

})();

