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


const BASE = fs.readFileSync("./components/base.html").toString();

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

  // fix the body
  for (const scriptFile of SCRIPTS) {
    if (!scriptFile.script.fixBody) continue;

    file.body = scriptFile.script.fixBody(file, scriptFile, FILES);
  }

  // and apply the head text after, as it can be affected by the body
  for (const scriptFile of SCRIPTS) {
    if (!scriptFile.script.applyHead) continue;

    file.head += scriptFile.script.applyHead(file, scriptFile, FILES) + "\n";
  }

  // lastly, we might want to do other stuff, go do that.
  for (const scriptFile of SCRIPTS) {
    if (!scriptFile.script.applyPost) continue;

    scriptFile.script.applyPost(file, scriptFile, FILES);
  }

  const fileContent = applyClean(
    BASE
      .replace(/\s*\$head\^/g, file.head)
      .replace(/\s*\$body\^/g, file.body)
      .replace(/\s*\$scripts\^/g, file.scripts),
    file);

  fs.mkdirSync(path.dirname(file.outputPath), { recursive: true });
  fs.writeFileSync(file.outputPath, fileContent);
}

function applyClean(fileContent, file) {
  for (const scriptFile of SCRIPTS) {
    if (!scriptFile.script.clean) continue;

    fileContent = scriptFile.script.clean(fileContent, file);
  }

  // removes all tags eg. $text here^
  return fileContent.replaceAll(/[\s]*\$[^^]*\^[\s]/gm, "");
}

if (!changedFile) {
  recompileProject();
}
else {
  recompileFile(fileUtil.getFile(changedFile));
}

execSync("node build-embed");