const links = {
  "$ekm-blog^": "https://my-exotic-fruit.28.ekm.shop/blogs"
};

function fixBody(file, script, files) {
  for (const [placeholder, url] of Object.entries(links)) {
    file.body = file.body.replaceAll(placeholder, url);
  }

  return file.body;
}

module.exports = { fixBody };