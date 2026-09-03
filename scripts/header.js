const fs = require("fs");
const { getAllFiles } = require("./utils/fileUtils");
const path = require("node:path");

function getCategories() {
    const categories = [];
    for (const file of getAllFiles("src")) {
        const fileContent = fs.readFileSync(file, "utf8");
        if (!fileContent.startsWith("is-category:true")) continue

        categories.push(file)
    }
    return categories;
}

const CATEGORIES = getCategories();
const HEADER_COMPONENT = fs.readFileSync("src/components/header.html", "utf8");

function getHref(categoryFile, currentFile) {
    const categoryPath = path.relative("src", categoryFile).split(path.sep).join(path.posix.sep);
    const currentDirectory = path.dirname(path.relative("src", currentFile))
        .split(path.sep)
        .join(path.posix.sep);

    if (path.posix.basename(categoryPath) === "index.html") {
        const categoryDirectory = path.posix.dirname(categoryPath);
        const relativeDirectory = path.posix.relative(currentDirectory, categoryDirectory);
        return relativeDirectory ? relativeDirectory + "/" : "./";
    }

    const relativePath = path.posix.relative(currentDirectory, categoryPath);
    return relativePath || "./";
}

function getPageName(file) {
    const pageDirectory = path.dirname(file);
    const pageName = path.basename(pageDirectory);
    return pageName === "src" ? "home" : pageName;
}

function buildHeader(currentFile) {
    let header = "";
    for (const file of CATEGORIES) {
        const pageName = getPageName(file);

        header += "<a href='" + getHref(file, currentFile) + "'>" + pageName + "</a>\n";
    }

    return HEADER_COMPONENT.replace("header-categories", header);
}

function fix(fileContent, currentFile) {
    return buildHeader(currentFile) + "\n" + fileContent.replace("is-category:true", "");
}

module.exports = { fix };