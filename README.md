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
- If the file is css/js it output as is to the build file
- If the file is HTML 
    - First we check if the changes effect the output of any components
        - If any component is changed we recompile the whole project, first deleting the build folder.
        - Otherwise, just compile the affected file
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
- The output goes in the "build" folder, which you can open in your browser to see live changes