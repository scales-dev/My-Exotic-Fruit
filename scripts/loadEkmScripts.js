// todo: theres issues, lots of the scripts dont work.
const fs = require("fs");

function applyHead(file, script, files) {

    let scripts = "";

    for (const scriptFile of fs.readdirSync("./EkmScripts")) {

        let info = fs.readFileSync(
            `./EkmScripts/${scriptFile}`,
            "utf8"
        );

        info = `
try {
${info}
} catch (error) {
    console.error(
        "Error in EKM script: ${scriptFile}",
        error
    );
}
`;

        scripts += "<script>" + info + "</script>";

    }

    return scripts;

}

module.exports = { applyHead };