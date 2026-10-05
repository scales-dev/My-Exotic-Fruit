// For EKM pages its easiest to be able to copy paste in a full single html file which has no other dependencies.
// so this script make all the links link to our cloudflare site which hosts the style sheets/images
// because I thought this was easier and cleaner than embedding the images/css into the file.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BASE_URL = "https://my-exotic-fruit.myexoticfruit.workers.dev/";

fs.rmSync("ekmBuild", { recursive: true, force: true })
execSync("node build");
stripFolder("./build")

function stripFolder(folderPath) {
  for (const file of fs.readdirSync(folderPath)) {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      stripFolder(filePath);
      continue;
    }

    stripFile(filePath);
  }
}

function stripFile(file) {
  if (path.basename(file) !== "index.html") return;

  let fileContent = fs.readFileSync(file).toString();

  fileContent = fileContent.split("<body>")[1];
  fileContent = fileContent.split("</body>")[0];

  // matches src="name/" but not src="any:" 
  // if there is a : before the first / its likely a link alr
  fileContent = fileContent.replaceAll(/src\s*=\s*"([^":]*)"/g, (match, captured) => {
    return match.replace(captured, fixLocalLink(captured, file))
  });

  // ditto but for href
  fileContent = fileContent.replaceAll(/href\s*=\s*"([^":]*)"/g, (match, captured) => {
    return match.replace(captured, fixLocalLink(captured, file))
  });

  const output = file.replace("build", "ekmBuild");
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, fileContent);
}

// local link will be in the form "../images/logo.jpg"
// file will be in the form "build/about-us/x/y/index.html"
// we only care about the path, eg. "about-us/x/y"
// if a ref has a "../" then we make the link "about-us/x"
// we can then append the localLink after, making it "about-us/x/images/logo.jpg"
function fixLocalLink(localLink, file) {
  let filePath = file.toString()
    .replace("build", "")
    .replace("/index.html", "")
    .replace("index.html", "");
  while (localLink.includes("../")) {
    localLink = localLink.replace("../", "");
    filePath = filePath.split("/").at(-2);
  }

  return BASE_URL + localLink + filePath;
}