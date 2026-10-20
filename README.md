# TODO:
- Make the following pages:
  - Japanese Fruits
  - Working with Brands
  - Trade buyers
  - Guest amenity
  - Seasonal products page?
- Fix css not loading for people...?
- Update the EKM site:
  - Decide best categories
  - Redesign home page
    - Start by advertising best categories
    - Fill in "your weekly seasonal update"
    - Banner video for footer
  - Redesign category pages
    - 8 best sellers, 2 promos, then rest
  - Redesign "shop online" tab
    - Less categories, perhaps 12
    - Each category should have sub-categories
    - Promo on right of shop online dropdown
  - Update product display
    - Give each product USPs... (ollama save me)
    - Make product maps allow several continents
    - Make descriptions allow new lines...?
  - Make each tab not actually a category, instead redirect to a non category page
  - Make product summaries shorter (120 characters)
  - Figure out why style doesn't load for some people
  - Banner pictures for all categories
  - Pick 2 promos for the footer
  - Make payment work on site
  - Negotiate cost of higher tier
  - Decide on footer tabs

# My Exotic Fruit

A static website with a custom build pipeline for shared components, generated content, SEO, and other reusable functionality.

## Developing

Edit the files in `src/`.

The corresponding files are automatically compiled into `build/`. Open the matching file in `build/` in your browser to see the changes.

I've sadly grown to prefer tab's being 2 space characters, I'm sure you can figure out how to make your IDE do that.

Throughout this project I define variables with $name^ so that I always match a full string.
- Regex does ^name$ to match whole strings
- I use them backwards because I think `/^\$string\^$/` looks nicer than `/^\^string\$$/`

### Setup in WebStorm

Create a new File Watcher:

- **File type:** `Any`
- **Scope:** Create a new scope with the pattern `file:src//*`
- **Program:** `node`
- **Arguments:** `build.js "$FilePathRelativeToProjectRoot$"`
- **Working directory:** `$ProjectFileDir$`

### Setup in VS Code

Install the File Watcher extension:

1. Press `Ctrl+P`
2. Enter: `ext install appulate.filewatcher`
3. Enable the extension.

The watcher should run `node build.js <changed file>`

## Build pipeline

### Todo:
- applyPost isnt documented
- createFiles isnt documented (or even used)
- Finish build-embed
  - It isnt mentioned yet in the readme
  - Entire site embed in a frame, like iframe, but not scrolling separately
  - Make build embed not require external requests to style sheets/images

I like static websites, but I do NOT enjoy updating headers/footers for every file,
so I thought this would be a simple way around.
I was informed about svelte, but I'm sure I didn't overcomplicate this too much.

### Project structure


| Path       | Use                                 |
| ---------- | :---------------------------------- |
| src        | Source HTML and other website files |
| components | Reusable HTML components            |
| scripts    | Build scripts                       |
| build      | Generated website                   |
| build.js   | Build system                        |

### How it works

- When updating a file, build.js is called with the changed file passed as the argument.
- If the file is HTML, we compile the edited file.
- To recompile the whole project run `node build.js`
- Compiling each HTML file is done in stages:

1. Read the file to get a file class; a file class is defined as
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

2. The component for the script is fetched from `components/[name].html` if it exists, ditto for data in `data/[name].any`
3. Call `fixBody#file, script, files` from all scripts. file.body is set to the return value. This should be used for:
    - Adding a header to every file
    - Replacing placeholder text, e.g. "company-name" with a variable
    - Adding in huge chunks of generated code, e.g., products from a csv file
    - Adding a footer to every file
    - Adding JS scripts to every file

4. Call `applyHead#file, script, files` from all scripts. The return text is appended to file.head; This should be used for:
    - Apply SEO tags
    - Import style sheets
    - Give the page an embed
    - ETC. anything you would put in a `<head>` tag

5. Write the `head.html` and `headContent`, close the head tag and open the body tag, and write the edited `fileContent` to the file
    - Non-HTML files are output as is
    - The output goes in the "build" folder, which you can open in your browser to see live

- In a full recompile we call `createFiles#files, script, fs, path` from every script. This can be used for:
    - Create individual pages for every blog
    - Create individual pages for every item in a shop

### How to use

A script can export either or both of:
```javascript
function fixBody(file, script, files) {
    // modify the body
}

function applyHead(file, script, files) {
    // modify the head
}

module.exports = {
    fixBody,
    applyHead
};
```

Example `header.js` script which adds a `<header>` block to every file with a picture and links to other files tagged as categories.
```javascript
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
    .replace("$nav-bar", getNavBar(file, files))
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

Where the component in `header.html` is:
```html
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
```