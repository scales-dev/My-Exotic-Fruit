const fs = require("fs");
const path = require("path");

const postcss = require("postcss");

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
  if (file.path.endsWith(".css")) {
    fs.mkdirSync(path.dirname(file.outputPath), { recursive: true });

    fs.writeFileSync(
      file.outputPath,
      important(file.content.toString())
    );

    return;
  }

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

  head += "\n</head>\n<body>\n"

  file.body = `<div class="custom">\n${file.body}\n</div>`;
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


function important(css) {

  function isKeyframeDecl(decl) {
    let parent = decl.parent;

    while (parent) {
      if (
        parent.type === "atrule" &&
        (
          parent.name === "keyframes" ||
          parent.name === "-webkit-keyframes"
        )
      ) {
        return true;
      }

      parent = parent.parent;
    }

    return false;
  }

  function addImportant(root) {
    root.walkDecls(decl => {
      if (isKeyframeDecl(decl)) {
        return;
      }

      if (!decl.important) {
        decl.important = true;
      }
    });
  }

  return postcss([
    root => {

      const custom = postcss.root();
      const global = postcss.root();

      root.each(node => {
        if (
          node.type === "atrule" &&
          node.name === "font-face"
        ) {
          global.append(node.clone());
          return;
        }

        if (
          node.type === "atrule" &&
          (
            node.name === "keyframes" ||
            node.name === "-webkit-keyframes"
          )
        ) {
          global.append(node.clone());
          return;
        }

        if (
          node.type === "rule" &&
          node.selector === ":root"
        ) {
          global.append(node.clone());
          return;
        }
        if (
          node.type === "rule" &&
          node.selector === "body"
        ) {
          const bodyClone = node.clone();

          addImportant(bodyClone);

          global.append(bodyClone);

          node.each(child => {
            custom.append(child.clone());
          });

          return;
        }

        custom.append(node.clone());
      });
      addImportant(custom);

      root.removeAll();

      global.each(node => {
        root.append(node);
      });

      const customRule = postcss.rule({
        selector: ".custom"
      });

      custom.each(node => {
        customRule.append(node);
      });

      root.append(customRule);
    }
  ]).process(css, { from: undefined }).css;
}