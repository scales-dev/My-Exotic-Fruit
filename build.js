const fs = require("fs");
const path = require("path");
const changedFile = process.argv[2];

const FILES = getAllFiles("src");

const HEAD = fs.readFileSync("./components/head.html");
const HEADER_TERMINATOR = "$end-head"

const SCRIPTS = fs.readdirSync("./scripts")
    .filter(file => file.endsWith(".js"))
    .map(file => {
        const componentPath = "./components/" + file.replace(".js", ".html");

        return {
            script: require("./scripts/" + file),
            component: fs.existsSync(componentPath)
                ? fs.readFileSync(componentPath).toString()
                : ""
        };
    });

function getAllFiles(dir) {
    const files = [];

    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            files.push(...getAllFiles(filePath));
        } else {
            files.push(getFile(filePath));
        }
    }

    return files;
}

function getFile(filePath) {
    return {
        path: filePath,
        content: fs.readFileSync(filePath)
    }
}

function recompileProject() {
    fs.rmSync("build", { recursive: true, force: true });
    for (const file of FILES) {
        recompileFile(file);
    }
}

function recompileFile(file) {
    if (!file.path.endsWith(".html")) {
        const OUTPUT_PATH = file.path.replace("src", "build");
        fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
        fs.writeFileSync(OUTPUT_PATH, file.content);

        return;
    }


    let fileContent = file.content.toString();

    const split = fileContent.indexOf(HEADER_TERMINATOR);
    if (split !== -1) fileContent = fileContent.toString().substring(split + 1 + HEADER_TERMINATOR.length);

    const PATH_COUNT = (file.path.match(/\//g) || []).length - 1;

    let headText = HEAD;

    // fix the body
    for (const scriptFile of SCRIPTS) {
        if (scriptFile.script.fixBody) {
            fileContent = scriptFile.script.fixBody(fileContent, file.path, PATH_COUNT, scriptFile.component, FILES);
        }
    }

    // and apply the head text after, as it can be affected by the body
    for (const scriptFile of SCRIPTS) {
        if (scriptFile.script.applyHead) {
            headText += scriptFile.script.applyHead(fileContent, file.path, PATH_COUNT, scriptFile.component, FILES) + "\n";
        }
    }

    // close head tag
    headText += "\n</head>\n<body>\n"

    const OUTPUT_PATH = file.path.replace("src", "build");
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, headText + fileContent + "\n</body>\n</html>");
}

if (!changedFile) {
    recompileProject();
}
else {
    recompileFile(getFile(changedFile));
}

module.exports = {
    FILES
};