// For EKM pages its easiest to be able to copy paste in a full single html file which has no other dependencies.
// so this script make all the links link to our cloudflare site which hosts the style sheets/images
// because I thought this was easier and cleaner than embedding the images/css into the file.

// todo: handle css/js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const fileUtil = require("./fileUtil");

const BASE_URL = "https://my-exotic-fruit.myexoticfruit.workers.dev/";


const shadowScript =
  `<script>
  class StyleBlocker extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      const widgetClasses = $widgets^;

      const widgets = widgetClasses
        .map(className => this.embedWidget(className))
        .filter(Boolean);

      // move EVERYTHING (except external widgets) into the shadow realm 
      // or smth idk https://matthewjamestaylor.com/style-blocker
      [...this.childNodes].forEach(node => {
        if (!widgets.includes(node)) {
          this.shadowRoot.appendChild(node);
        }
      });
    }

    embedWidget(className) {
      const widget = this.querySelector("." + className);

      if (!widget) return null;

      const slot = document.createElement("slot");
      slot.name = className;

      widget.parentNode.replaceChild(slot, widget);

      widget.slot = className;
      this.appendChild(widget);

      return widget;
    }
  }

  customElements.define("style-blocker", StyleBlocker);
</script>`

fs.rmSync("ekmBuild", { recursive: true, force: true })
execSync("node build");

for (const file of fileUtil.getAllFiles("./build")) {
  const srcFile = fileUtil.getFile(file.path.replace("build", "src"))
  stripFile(file, srcFile);
}

function stripFile(builtFile, srcFile) {
  if (!srcFile || path.basename(builtFile.path) !== "index.html") return;

  let builtFileBody = builtFile.content.toString();

  builtFileBody = builtFileBody.split("<body>")[1];
  builtFileBody = builtFileBody.split("</body>")[0];

  // matches src="name/" but not src="any:" 
  // if there is a : before the first / its likely a link alr
  builtFileBody = builtFileBody.replaceAll(/src\s*=\s*"([^":]*)"/g, (match, captured) => {
    return match.replace(captured, fixLocalLink(captured, builtFile.path))
  });

  // ditto but for href
  builtFileBody = builtFileBody.replaceAll(/href\s*=\s*"([^":]*)"/g, (match, captured) => {
    return match.replace(captured, fixLocalLink(captured, builtFile.path))
  });

  const output = builtFile.path.replace("build", "ekmBuild");
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, applyShadow(builtFileBody, srcFile.scripts));
}

// local link will be in the form "../images/logo.jpg"
// file will be in the form "build/about-us/x/y/index.html"
// we only care about the path, eg. "about-us/x/y"
// if a ref has a "../" then we make the link "about-us/x"
// we can then append the localLink after, making it "about-us/x/images/logo.jpg"
function fixLocalLink(localLink, file) {
  let filePath = "/" + file.toString()
    .replace("build", "")
    .replace("/index.html", "")
    .replace("index.html", "");
  while (localLink.includes("../")) {
    localLink = localLink.replace("../", "");
    filePath = filePath.split("/").at(-2);
  }

  return BASE_URL + localLink + filePath;
}

function applyShadow(body, scripts) {
  return `<style-blocker>
${body}
</style-blocker>
${addScripts(scripts)}`
}

function addScripts(scripts) {
  const widgetsTag = scripts.match(/\$widgets\s*=\s*[^\^]*?\^/g)?.[0];

  scripts = scripts.replace(widgetsTag, "");

  const widgets = widgetsTag ? widgetsTag
    .split("=")[1]
    .replace("^", "")
    .trim()
    .split(",")
    .map(widget => `"${widget}"`)
    : [];

  return scripts + shadowScript.replace("$widgets^", `[${widgets.join(",")}]`);
}