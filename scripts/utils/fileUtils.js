const fs = require("fs");
const path = require("path");

const COMPONENTS_PATH = "components";

function getAllFiles(dir) {
    const files = [];
    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            if (filePath.endsWith(COMPONENTS_PATH)) continue;

            files.push(...getAllFiles(filePath));
        }
        else files.push(filePath);
    }

    return files;
}

module.exports = { getAllFiles };
