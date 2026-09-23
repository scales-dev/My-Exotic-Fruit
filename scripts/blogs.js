const fs = require("fs");
const path = require("path");

function fixBody(file, script, files) {
    if (!file.body.includes("$blogs^")) return file.body;
    return file.body.replace("$blogs^", getBlogs(script));
}

function getBlogs(script) {
    let blogs = "";

    for (const folder of fs.readdirSync("./blogs")) {
        const folderPath = path.join("./blogs", folder);
        const blogSvg = fs.readdirSync(folderPath).find(file => file.endsWith(".svg"));

        const fileName = path.basename(blogSvg, ".svg");

        blogs += script.component
            .replaceAll("$blog-name^", fileName.split("$")[0])
            .replaceAll("$blog-description^", fileName.split("$")[1])
            .replaceAll("$blog-link^", path.basename(folder))
            .replaceAll("$blog-svg^", blogSvg);
    }

    return blogs;

}

module.exports = { fixBody };