const fs = require("fs");
const path = require("path");
const changedFile = process.argv[2];

const filePath = path.resolve(__dirname, changedFile);
const outputFilePath = filePath.replace("/src/", "/build/");

fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });

const content = fs.readFileSync(filePath, "utf8");
fs.writeFileSync(outputFilePath, content);