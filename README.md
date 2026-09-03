# My Exotic Fruit

---

## Setup in WebStorm:

### Create new file watcher:
- File type: `any`
- scope: create `new`, with pattern `file:src//*`
- program: `node`
- arguments: `build.js "$FilePathRelativeToProjectRoot$"`
- working directory: `Project root`

## Build pipeline
- When updating a file build.js is called with the changed file passed
- If the file is HTML we compile the edited file, to recompile the whole project run `node build.js`
- Compiling each HTML file is done in stages:
  1. Write the head.html component to the file
  2. Call "applyHead#fileContent,filePath" from all scripts which returns text which is appended to the head.html, which should be used for:
     - Apply SEO tags
     - Import style sheets
     - Give the page an embed
     - ETC. anything you would put in a <head> tag
  3. Close the head tag and open body tag
  4. Call "fixBody#fileContent,filePath" which should return the full fileContent with appended/replaced text, called in a random order, which should be used for:
     - Adding a header to every file
     - Replacing placeholder text, eg. "company-name" with a variable
     - Adding in huge chunks of generated code, eg. products from a csv file
     - Adding a footer to every file
     - Adding JS scripts to every file
  5. Output the head.html, with all applyHead's added + the content of the file after $end-head.
- Non HTML files are output as is
- The output goes in the "build" folder, which you can open in your browser to see live changes