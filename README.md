# My Exotic Fruit

## Developing
Edit the src files and open the matching file in your build folder in your browser to see live changes.

### Setup in WebStorm:

Create a new file watcher:
- File type: `any`
- Scope: create `new`, with pattern `file:src//**`
- Program: `node`
- Arguments: `build.js "$FilePathRelativeToProjectRoot$"`
- Working directory: `$ProjectFileDir$`

### Setup in VS Code

Press `CTRL+P`, enter `ext install appulate.filewatcher` and enable the plugin.

## Build pipeline
I like static websites, but I do NOT enjoy updating headers/footers for every file, 
so I thought this would be a simple way around.
I was informed about svelte, but I'm sure I didn't overcomplicate this too much.

### How it works
- When updating a file, build.js is called with the changed file passed as the argument.
- If the file is HTML, we compile the edited file.
  - To recompile the whole project run `node build.js`
- Compiling each HTML file is done in stages:
  1. Read the file to get to get a file class.
    - A file class is defined as 
    ```javascript
    {
        name: "name of file",
        path: "relative path to file",
        outputPath: "build/"+path,
        pathCount: "how deep the file is from project dir",
        content: "full file content",
        head: "text before $end-head^",
        body: "text after $end-head^"
    }
    ```
  2. The component for the script is fetched from "components/name.html" if it exists.
  3. Call "fixBody#file, component, files" from all scripts. file.body is set to the return value. This should be used for:
    - Adding a header to every file
    - Replacing placeholder text, e.g. "company-name" with a variable
    - Adding in huge chunks of generated code, e.g., products from a csv file
    - Adding a footer to every file
    - Adding JS scripts to every file
  4. Call "applyHead#file, component, files" from all scripts. The return text is appended to file.head; This should be used for:
    - Apply SEO tags
    - Import style sheets
    - Give the page an embed
    - ETC. anything you would put in a <head> tag
  5. Write the head.html and headContent, close the head tag and open the body tag, and write the edited fileContent to the file
- Non-HTML files are output as is
- The output goes in the "build" folder, which you can open in your browser to see live 

### How to use it
- Scripts are put in the "scripts" folder and can use both `function applyHead(file, component, files)` and `function fixBody(file, component, files)`
- The script should then export these functions with `module.exports = {fixBody};`

Example script which adds a <header> block to every file with a picture and links to other files tagged as categories
```javascript
function fixBody(file, component, files) {
    /* component is read from "components/header.html", it contains:
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
    return component
    // different pages have a different relative path to the logo
    .replace("$logo^", getLogo(file))
    .replace("$nav-bar", getNavBar(file, files));
}

function getNavBar(currentFile, files) {
    let navElements = "";
    // loop through all index.html files 
    for (const otherFile of files) {
        // allows us to choose which index.html files are included in the navbar, by putting $is-category^ before the header.
        if (!otherFile.head.includes("$is-category^")) continue;

        // check if the file is the file we are in, and give a special class to be rendered differently if needed
        const selectedHeader = otherFile == currentFile ? ` class="selected-header"`:"";
        // get the relative path to the file
        const href = otherFile == currentFile ? "":` href="${"../".repeat(currentFile.pathCount) + otherFile.path}"`;

        // create an `a` tag with the name of the folder containing the index.html
        navElements += `<a${selectedHeader}${href}>${otherFile.name}</a>\n`

    }

    return navElements + "\n";
}

function getLogo(currentFile) {
    // all images are stored in the images folder, because I think that makes them easier to find.
    return "../".repeat(currentFile.pathCount) + "images/logo.jpg"
}

module.exports = {fixBody};
```