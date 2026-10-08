function fixBodyPOST(file, script, files) {
  return stripFile(file.body, file.path);
}

const BASE_URL = "https://my-exotic-fruit.myexoticfruit.workers.dev/";

function stripFile(fileContent, filePath) {
  // matches src="name/" but not src="any:" 
  // if there is a : before the first / its likely a link alr
  fileContent = fileContent.replaceAll(/src\s*=\s*"([^":]*)"/g, (match, captured) => {
    return match.replace(captured, fixLocalLink(captured, filePath))
  });

  // ditto but for href
  fileContent = fileContent.replaceAll(/href\s*=\s*"([^":]*)"/g, (match, captured) => {
    return match.replace(captured, fixLocalLink(captured, filePath))
  });

  return fileContent;
}

// local link will be in the form "../images/logo.jpg"
// file will be in the form "build/about-us/x/y/index.html"
// we only care about the path, eg. "about-us/x/y"
// if a ref has a "../" then we make the link "about-us/x"
// we can then append the localLink after, making it "about-us/x/images/logo.jpg"
function fixLocalLink(localLink, file) {
  let filePath = "/"+file.toString()
    .replace("/index.html", "")
    .replace("index.html", "");
  while (localLink.includes("../")) {
    localLink = localLink.replace("../", "");
    filePath = filePath.split("/").at(-2);
  }

  return BASE_URL + localLink + filePath;
}

module.exports = { fixBodyPOST };