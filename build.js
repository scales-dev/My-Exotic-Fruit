const fs = require("fs");
const path = require("path");
const changedFile = process.argv[2];

const FILES = getAllFiles("src");

const HEAD = fs.readFileSync("./components/head.html");
const HEADER_TERMINATOR = "$end-head"

const SCRIPTS = fs.readdirSync("./scripts")
    .filter(file => file.endsWith(".js"))
    .map(file => (require("./scripts/" + file)));

function getAllFiles(dir) {
    const files = [];
    for (const file of fs.readdirSync(dir)) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) files.push(...getAllFiles(filePath));
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
    const split = fileContent.indexOf(HEADER_TERMINATOR);
    if (split !== -1) fileContent = fileContent.toString().substring(split + 1 + HEADER_TERMINATOR.length);

    let headText = HEAD;

    // add all the head text first
    for (const script of SCRIPTS) {
        if (script.applyHead) {
            headText += script.applyHead(fileContent, file);
        }
    }

    // close head tag
    headText += "\n</head>\n<body>\n"

    // then fix the body
    for (const script of SCRIPTS) {
        if (script.fixBody) {
            fileContent = script.fixBody(fileContent, file);
        }
    }

    const OUTPUT_PATH = file.replace("src", "build");
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, headText + fileContent + "\n</body>\n</html>");
}

if (!changedFile) {
    recompileProject();
}