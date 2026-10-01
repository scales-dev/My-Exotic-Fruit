const fs = require("fs");
const path = require("path");

const fileUtil = require("./fileUtil");

const changedFile = process.argv[2];

const FILES = fileUtil.getAllFiles("src");
const HEAD = fs.readFileSync("./components/head.html");

const SCRIPTS = fs.readdirSync("./scripts")
    .filter(file => file.endsWith(".js"))
    .map(file => {
        const name = path.basename(file, ".js");
        const componentPath = `./components/${name}.html`;

        const dataFile = fs.readdirSync("./data").find(dataFile => path.parse(dataFile).name === name);
        const dataPath = dataFile ? "./data/" + dataFile : null;

        return {
            script: require("./scripts/" + file),
            component: fs.existsSync(componentPath) ? fs.readFileSync(componentPath).toString() : "",
            data: dataPath ? fs.readFileSync(dataPath).toString() : ""
        };
    });

function recompileProject() {
    fs.rmSync("build", { recursive: true, force: true });
    for (const scriptFile of SCRIPTS) {
        if (!scriptFile.script.createFiles) continue;
        
        scriptFile.script.createFiles(FILES, scriptFile, fs, path);
    }
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
        if (!scriptFile.script.fixBody) continue;
        
        file.body = scriptFile.script.fixBody(file, scriptFile, FILES);
    }

    // and apply the head text after, as it can be affected by the body
    for (const scriptFile of SCRIPTS) {
        if (!scriptFile.script.applyHead) continue;

        head += scriptFile.script.applyHead(file, scriptFile, FILES) + "\n";
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
    recompileFile(fileUtil.getFile(changedFile));
}