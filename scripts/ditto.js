function fixBody(file, script, files) {
  /* matches for
    $ditto
    anything
    ditto^
  */
  return file.body.replace(
    /[\s]*\$ditto(.*?)[\s]*ditto\^/gs, 
    (_, content) => content + content
  );
}

module.exports = { fixBody };