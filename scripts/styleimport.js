function applyHead(fileContent, filePath, pathCount, component, files) {
    const matches = fileContent.matchAll(/class="[^"]*?(\$[\w-]+)/g);

    let styles = "";

    styles += getStyleLink("base", pathCount);

    for (const match of matches) {
        styles += getStyleLink(match[1], pathCount);
    }

    return styles ;
}

function getStyleLink(name, pathCount) {
    const className = "../".repeat(pathCount) + "style/" + name.replace("$", "");

    return `\n<link rel="stylesheet" href="${className}.css">`;
}

module.exports = {applyHead};