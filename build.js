const HEADER_TERMINATOR = "$end-head"

const fs = require("fs");
const path = require("path");
const changedFile = process.argv[2];

const FILES = getAllFiles("src");
const HEAD = fs.readFileSync("./components/head.html");

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

function getFile(path) {
    const content = fs.readFileSync(path);
    
    let body = content.toString();
    const split = body.indexOf(HEADER_TERMINATOR);
    let head = "";
    if (split !== -1) {
        head = body.substring(0, split);
        body = body.substring(split + 1 + HEADER_TERMINATOR.length);
    }

    const pathCount = (path.match(/\//g) || []).length - 1;

    let name = pathCount == 0 ? "home" : path.split("/").at(-2);
    path = path.replace("src/", "");

    return {
        name: name,
        path: path,
        outputPath: "build/"+path,
        pathCount: pathCount,
        content: content,
        head: head,
        body: body
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
        fs.mkdirSync(path.dirname(file.outputPath), { recursive: true });
        fs.writeFileSync(file.outputPath, file.content);

        return;
    }

    let head = HEAD;

    // fix the body
    for (const scriptFile of SCRIPTS) {
        if (scriptFile.script.fixBody) {
            file.body = scriptFile.script.fixBody(file, scriptFile.component, FILES);
        }
    }

    // and apply the head text after, as it can be affected by the body
    for (const scriptFile of SCRIPTS) {
        if (scriptFile.script.applyHead) {
            head += scriptFile.script.applyHead(file, scriptFile.component, FILES) + "\n";
        }
    }

    head += "\n</head>\n<body>\n"
    file.body += "\n</body>\n</html>"

    fs.mkdirSync(path.dirname(file.outputPath), { recursive: true });
    fs.writeFileSync(file.outputPath, head + file.body);
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