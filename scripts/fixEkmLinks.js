const links = {
  "$ekm-blog^": "https://my-exotic-fruit.28.ekm.shop/blogs",
  "$ekm-contact-us^": "https://my-exotic-fruit.28.ekm.shop/about-us-134-c.asp#contact-us",
  "$ekm-bespoke-sourcing^" : "https://my-exotic-fruit.28.ekm.shop/bespoke-sourcing-132-c.asp"
};

function fixBody(file, script, files) {
  for (const [placeholder, url] of Object.entries(links)) {
    file.body = file.body.replaceAll(placeholder, url);
  }

  return file.body;
}

module.exports = { fixBody };