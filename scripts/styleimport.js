function applyHead(file, script, files) {
    const matches = file.body.matchAll(/class="[^"]*?(\$[\w-]+)/g);

    const styles = new Set();
    styles.add(getStyleLink("base", file.pathCount));

    for (const match of matches) {
        styles.add(getStyleLink(match[1], file.pathCount));
    }

    return [...styles].join("");
}

function getStyleLink(name, pathCount) {
    const className = "../".repeat(pathCount) + "style/" + name.replace("$", "");

    return `\n<link rel="stylesheet" href="${className}.css">`;
}

module.exports = { applyHead };