function clean(fileContent, file) {
  console.log(fileContent)
  return fileContent.replaceAll(
    /\$img:([^\^]*)\^/g,
    (_, imagename) =>
    `${"../".repeat(file.pathCount)}images/${imagename}`
  );
}

module.exports = { clean };