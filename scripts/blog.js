const fileUtil = require("../fileUtil");

function createFiles(files, script, fs, path) {
    for (const folder of fs.readdirSync("./blogs")) {
        const blogPath = path.join("blogs", folder);
        const sourcePath = path.join("./blogs", folder);

        const htmlPath = path.join(blogPath, "index.html");
        const htmlOutputPath = path.join("build", htmlPath);

        const html = script.component.replaceAll("$blog^", "blog.svg");

        fs.mkdirSync(path.dirname(htmlOutputPath), { recursive: true });
        fs.writeFileSync(htmlPath, html);

        files.push(fileUtil.getFile(`./blogs/${folder}/index.html`));
        files.push(fileUtil.getFile(`./blogs/${folder}/blog.svg`));
        files.push(fileUtil.getFile(`./blogs/${folder}/icon.jpg`));
    }
}

module.exports = { createFiles };