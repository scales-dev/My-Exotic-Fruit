const COMPONENTS_PATH = "components";

const fs = require("fs");
const path = require("path");
const changedFile = process.argv[2];

if (changedFile.substring(0, changedFile.lastIndexOf("/")).includes(COMPONENTS_PATH)) {
    buildDir("src")
}

else {
    buildFile(changedFile);
}

function buildDir(dir) {
    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            if (filePath.endsWith(COMPONENTS_PATH)) continue;
            buildDir(filePath);
        }
        else buildFile(filePath);
    }
}

function buildFile(file) {
    const fileContent = fs.readFileSync(file, "utf8");
    const outputFilePath = file.replace("src/", "build/");

    // make sure the folder path exists
    fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });

    // output the fixed file!
    fs.writeFileSync(outputFilePath, fixComponents(fileContent));
}

function getComponent(componentName) {
    return fs.readFileSync("src/" + COMPONENTS_PATH + "/" + componentName, "utf8");
}

function fixComponents(fileContent) {
    return fileContent.replace(
        /<!--\s*include:([^\s]+)\s*-->/g,
        (match, componentName) => getComponent(componentName)
    );
}