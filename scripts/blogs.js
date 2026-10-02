const fs = require("fs");

function fixBody(file, script, files) {
    if (!file.body.includes("$blogs^")) return file.body;
    return file.body.replace("$blogs^", getBlogs(script));
}

function getBlogs(script) {
    let blogs = "";

    for (const folder of fs.readdirSync("./blogs")) {
        const info = JSON.parse(fs.readFileSync(`./blogs/${folder}/info.json`));

        blogs += script.component
            .replaceAll("$blog-name^", info.name)
            .replaceAll("$blog-description^", info.description)
            .replaceAll("$blog-day^", info.day)
            .replaceAll("$blog-author^", info.author)
            .replaceAll("$blog-category^", info.category)
            .replaceAll("$blog-link^", folder);

    }

    return blogs;

}

module.exports = { fixBody };