function applyHead(file, script, files) {
    return script.component
        .replaceAll("$icon^", `${"../".repeat(file.pathCount)}/images/logo.jpg`);
}

module.exports = { applyHead };