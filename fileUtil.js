const HEADER_TERMINATOR = "$end-head^";
const BODY_TERMINATOR = "$end-body^";
const fs = require("fs");
const path = require("path");

function getFile(path) {
  const content = fs.readFileSync(path);

  let contentString = content.toString();

  const splitHead = contentString.indexOf(HEADER_TERMINATOR);
  const splitBody = contentString.indexOf(BODY_TERMINATOR);

  const headIndex = splitHead === -1 ? 0 : splitHead;
  const bodyIndex = splitBody === -1 ? contentString.length : splitBody;


  const head = contentString.substring(0, headIndex);
  const body = contentString.substring(headIndex + 1 + HEADER_TERMINATOR.length, bodyIndex);
  const scripts = contentString.substring(bodyIndex + 1 + BODY_TERMINATOR.length);

  const pathNoSrc = path.replace("src/", "");
  const pathCount = (pathNoSrc.match(/\//g) || []).length;

  let name = pathCount == 0 ? "home" : path.split("/").at(-2);
  path = path.replace("src/", "");

  return {
    name: name,
    path: path,
    outputPath: "build/" + path,
    pathCount: pathCount,
    content: content,
    head: head,
    body: body,
    scripts: scripts
  }
}

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

module.exports = { getFile, getAllFiles };