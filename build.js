const COMPONENTS_PATH = "components";

const fs = require("fs");
const path = require("path");
const changedFile = process.argv[2];
const FIX_STATE_PATH = ".fix-state.json";

const { getAllFiles } = require("./scripts/utils/fileUtils");

const SCRIPTS = fs.readdirSync("./scripts")
    .filter(file => file.endsWith(".js"))
    .map(file => ({
        name: file,
        module: require("./scripts/" + file)
    }));
const fixState = loadFixState();

if (!changedFile || changedFile.substring(0, changedFile.lastIndexOf("/")).includes(COMPONENTS_PATH)) {
    buildAll()
}

else {
    const fileContent = fs.readFileSync(changedFile, "utf8");
    const fixedFile = fixComponents(fileContent, changedFile);

    if (fixedFile.hasChanges) {
        buildAll();
    }
    else {
        writeBuildFile(changedFile, fixedFile.content);
    }
}

function buildAll() {
    for (const file of getAllFiles("src")) {
        buildFile(file);
    }

    saveFixState();
}

function buildFile(file) {
    const fileContent = fs.readFileSync(file, "utf8");
    const fixedFile = fixComponents(fileContent, file);

    writeBuildFile(file, fixedFile.content);
}

function writeBuildFile(file, content) {
    const outputFilePath = file.replace("src/", "build/");

    // make sure the folder path exists
    fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });

    // output the fixed file!
    fs.writeFileSync(outputFilePath, content);
}

function fixComponents(fileContent, file) {
    let hasChanges = false;

    for (const script of SCRIPTS) {
        if (typeof script.module.fix === "function") {
            fileContent = script.module.fix(fileContent, file);

            if (fixState[script.name]?.[file] !== fileContent) {
                hasChanges = true;
            }

            if (!fixState[script.name]) {
                fixState[script.name] = {};
            }
            fixState[script.name][file] = fileContent;
        }
    }

    return { content: fileContent, hasChanges };
}

function loadFixState() {
    if (!fs.existsSync(FIX_STATE_PATH)) {
        return {};
    }

    return JSON.parse(fs.readFileSync(FIX_STATE_PATH, "utf8"));
}

function saveFixState() {
    fs.mkdirSync(path.dirname(FIX_STATE_PATH), { recursive: true });
    fs.writeFileSync(FIX_STATE_PATH, JSON.stringify(fixState, null, 2) + "\n");
}

function fix(fileContent, file) {
    return fileContent;
}

module.exports = { fix };