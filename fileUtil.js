const HEADER_TERMINATOR = "$end-head^";
const fs = require("fs");
const path = require("path");

function getFile(path) {
  const content = fs.readFileSync(path);

  let body = content.toString();
  const split = body.indexOf(HEADER_TERMINATOR);
  let head = "";
  if (split !== -1) {
    head = body.substring(0, split);
    body = body.substring(split + 1 + HEADER_TERMINATOR.length);
  }

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
    body: body
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