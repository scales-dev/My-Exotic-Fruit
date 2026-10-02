function fixBody(file, script, files) {
    return file.body + script.component;
}

module.exports = {fixBody};