const fs = require("fs");
const { getAllFiles } = require("./utils/fileUtils");

const FOOTER_COMPONENT = fs.readFileSync("src/components/footer.html", "utf8");

function buildFooter() {
    let footer = "";

    return FOOTER_COMPONENT.replace("footer-categories", footer);
}

const FOOTER = buildFooter();

function fix(fileContent, file) {
    return fileContent.replace("is-footer:true", "") + "\n" + FOOTER;
}

module.exports = { fix };