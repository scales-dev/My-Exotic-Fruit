function createFiles(files, script, fs, path) {
    for (const folder of fs.readdirSync("./blogs")) {
        const blogPath = path.join("blogs", folder);
        const sourcePath = path.join("./blogs", folder);
        const svgFile = fs.readdirSync(sourcePath).find(file => file.endsWith(".svg"));

        const htmlPath = path.join(blogPath, "index.html");

        const htmlOutputPath = path.join("build", htmlPath);
        const html = script.component.replaceAll("$blog^", path.join(folder, svgFile));
        const svg = fs.readFileSync(path.join(sourcePath, svgFile));

        fs.mkdirSync(path.dirname(htmlOutputPath), { recursive: true });
        fs.cpSync(sourcePath, path.join("build", blogPath), { recursive: true });
        fs.writeFileSync(htmlOutputPath, html);

        const svgPath = path.join(blogPath, svgFile);
        const pathCount = (svgPath.match(/\//g) || []).length - 1;

        files.push({
            name: svgFile,
            path: svgPath,
            outputPath: path.join("build", svgPath),
            pathCount: pathCount,
            content: svg,
            head: "",
            body: svg.toString()
        });

        files.push({
            name: "index.html",
            path: htmlPath,
            outputPath: htmlOutputPath,
            pathCount: pathCount,
            content: Buffer.from(html),
            head: "",
            body: html
        });

    }

}

module.exports = { createFiles };