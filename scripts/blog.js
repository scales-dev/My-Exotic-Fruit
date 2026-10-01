const fileUtil = require("../fileUtil");

function createFiles(files, script, fs, path) {
    for (const folder of fs.readdirSync("./blogs")) {
        const htmlPath = `blogs/${folder}/index.html`;
        const htmlOutputPath = `build/${htmlPath}`

        const html = script.component.replaceAll("$blog^", "blog.svg");

        fs.mkdirSync(path.dirname(htmlOutputPath), { recursive: true });
        fs.writeFileSync(htmlPath, html);

        files.push(fileUtil.getFile(`blogs/${folder}/index.html`));
        files.push(fileUtil.getFile(`blogs/${folder}/blog.svg`));
        files.push(fileUtil.getFile(`blogs/${folder}/icon.jpg`));
    }
}

module.exports = { createFiles };