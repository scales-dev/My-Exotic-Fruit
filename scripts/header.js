function fixBody(file, script, files) {
    /* script.component is read from "components/header.html", it contains:
    <header>
        <div>
            <a href="">
                <img loading="lazy" src="$logo^" alt="My Exotic Fruit logo">
            </a>
        </div>
        <div>
            $nav-bar
        </div>
    </header>
    */
    return script.component
    // different pages have a different relative path to the logo
    .replace("$logo^", getLogo(file))
    .replace("$nav-bar^", getNavBar(file, files))
    .replace("$home^", "../".repeat(file.pathCount))
    // we want the header before the body
    + file.body;
}

function getNavBar(currentFile, files) {
    let navElements = "";
    // loop through all index.html files 
    for (const otherFile of files) {
        // allows us to choose which index.html files are included in the navbar, by putting $is-category^ before the header.
        if (!otherFile.head.includes("$is-category^")) continue;

        // check if the file is the file we are in, and give a special class to be rendered differently if needed
        const selectedHeader = otherFile.path.split("/")[0] === currentFile.path.split("/")[0] ? ` class="selected-header"`:"";
        // get the relative path to the file
        const href = otherFile == currentFile ? "":` href="${"../".repeat(currentFile.pathCount) + otherFile.path}/"`;

        // create an `a` tag with the name of the folder containing the index.html
        navElements += `<a${selectedHeader}${href}>${otherFile.name}</a>\n`

    }

    return navElements + "\n";
}

function getLogo(currentFile) {
    // all images are stored in the images folder, because I think that makes them easier to find.
    return "../".repeat(currentFile.pathCount) + "images/logo.svg"
}

module.exports = {fixBody};