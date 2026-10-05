function applyHead(file, script, files) {
  const redirect = file.head.match(/\$redirect="([^"]*)"\^/);

  if (!redirect) return "";

  return script.component.replace("$redirect^", redirect[1]);
}

module.exports = { applyHead };