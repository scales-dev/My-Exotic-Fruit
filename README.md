# My Exotic Fruit

---

## Developing
Edit the src files and open the matching file in your build folder in your browser to see live changes.

### Setup in WebStorm:

Create a new file watcher:
- File type: `any`
- scope: create `new`, with pattern `file:src//**`
- program: `node`
- arguments: `build.js "$FilePathRelativeToProjectRoot$"`
- working directory: `$ProjectFileDir$`

### Setup in VS Code

Press `CTRL+P` and enter `ext install appulate.filewatcher`
Enable the plugin.

## Build pipeline
I like static websites, but I do NOT enjoy updating headers/footers for every file, 
so I thought this would be a simple way around.
I was informed about svelte, but I'm sure I didn't overcomplicate this too much.

### How it works
- When updating a file, build.js is called with the changed file passed as the argument.
- If the file is HTML, we compile the edited file.
  - To recompile the whole project run `node build.js`
- Compiling each HTML file is done in stages:
  1. Read the file to get variables: headerContent (all lines before $end-header) and fileContent (all other lines).
  2. Call "fixBody#fileContent, filePath" from all scripts. fileContent is set to the return value. This should be used for:
      - Adding a header to every file
      - Replacing placeholder text, e.g. "company-name" with a variable
      - Adding in huge chunks of generated code, e.g., products from a csv file
      - Adding a footer to every file
      - Adding JS scripts to every file
  3. Call "applyHead#fileContent, filePath" from all scripts. The return text is appended to headContent. This should be used for:
     - Apply SEO tags
     - Import style sheets
     - Give the page an embed
     - ETC. anything you would put in a <head> tag
  4. Write the head.html and headContent, close the head tag and open the body tag, and write the edited fileContent to the file
- Non-HTML files are output as is
- The output goes in the "build" folder, which you can open in your browser to see live changes