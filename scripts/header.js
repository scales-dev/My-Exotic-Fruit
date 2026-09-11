function fixBody(file, component, files) {
    return component
    .replace("$logo^", getLogo(file))
    .replace("$nav-bar", getNavBar(file, files));
}

function getNavBar(currentFile, files) {
    let navElements = "";
    for (const otherFile of files) {
        if (!otherFile.head.includes("$is-category^")) continue;

        const selectedHeader = otherFile == currentFile ? ` class="selected-header"`:"";
        const href = otherFile == currentFile ? "":` href="${"../".repeat(currentFile.pathCount) + otherFile.path}"`;

        navElements += `<a${selectedHeader}${href}>${otherFile.name}</a>\n`

    }

    return navElements + "\n";
}

function getLogo(currentFile) {
    return "../".repeat(currentFile.pathCount) + "images/logo.jpg"
}

module.exports = {fixBody};