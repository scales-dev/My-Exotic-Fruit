const fs = require("fs");
const path = require("path");
const changedFile = process.argv[2];

const FILES = getAllFiles("src");

const HEAD = fs.readFileSync("./components/head.html");

const SCRIPTS = fs.readdirSync("./scripts")
    .filter(file => file.endsWith(".js"))
    .map(file => ({
        name: file,
        module: require("./scripts/" + file)
    }));

function getAllFiles(dir) {
    const files = [];
    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            files.push(...getAllFiles(filePath));
        }
        else files.push(filePath);
    }

    return files;
}

function recompileProject() {
    for (const file of FILES) {
        recompileFile(file);
    }
}

function recompileFile(file) {
    let fileContent = fs.readFileSync(file);

    let headText = HEAD;

    // add all the head text first
    for (const script of SCRIPTS) {
        if (typeof script.module.applyHead === "function") {
            headText += script.module.applyHead(fileContent, file);
        }
    }

    // close head tag
    headText += "\n</head>\n<body>\n"

    // then fix the body
    for (const script of SCRIPTS) {
        if (typeof script.module.fixBody === "function") {
            fileContent = script.module.fixBody(fileContent, file);
        }
    }

    const OUTPUT_PATH = file.replace("src", "build");
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, headText + fileContent + "\n</body>\n</html>");
}

function applyHead(fileContent, filePath) {
    return "";
}

function fixBody(fileContent, filePath) {
    return fileContent;
}

if (!changedFile) {
    recompileProject();
}