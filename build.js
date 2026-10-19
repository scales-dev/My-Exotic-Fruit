const fs = require("fs");
const path = require("path");

const { execSync } = require("child_process");

const fileUtil = require("./fileUtil");

const changedFile = process.argv[2];

const FILES = fileUtil.getAllFiles("src");

const SCRIPTS = fs.readdirSync("./scripts")
  .filter(file => file.endsWith(".js"))
  .map(file => {
    const name = path.basename(file, ".js");
    const componentPath = `./components/${name}.html`;

    const dataFile = fs.existsSync("./data")
      ? fs.readdirSync("./data").find(dataFile => path.parse(dataFile).name === name)
      : null;
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

  let head = "";

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

  // lastly, we might want to do other stuff, go do that.
  for (const scriptFile of SCRIPTS) {
    if (!scriptFile.script.applyPost) continue;

    scriptFile.script.applyPost(file, scriptFile, FILES);
  }

  // todo: automate opening/closing these tags in head.html component
  head += "\n</head>\n<body>\n"
  file.body += "\n</body>\n</html>"

  const fileContent = (head + file.body + file.scripts)
    .replaceAll(/^\$[^^]*\^$/gm, "")

  fs.mkdirSync(path.dirname(file.outputPath), { recursive: true });
  fs.writeFileSync(file.outputPath, fileContent);
}

if (!changedFile) {
  recompileProject();
}
else {
  recompileFile(fileUtil.getFile(changedFile));
}

execSync("node build-embed");