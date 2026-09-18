const papa = require("papaparse");

function fixBody(file, script, files) {
    if (!file.body.includes("$shop^")) return file.body;
    return file.body.replace("$shop^", getShopItems(script));
}

function getShopItems(script) {

    const result = papa.parse(script.data, {
        header: true,
        delimiter: ",",
        skipEmptyLines: true
    });

    let output = "";
    for (const product of result.data) {
        if (product.TYPE === "Variant") continue;

        output += script.component
            .replaceAll("$NAME^", escapeHTML(product.NAME))
            .replaceAll("$IMAGE_PATH^", safePath(`${product.CATEGORY_PATH}/${product.NAME}/${product.NAME}0.webp`))
            .replaceAll("$ID^", product.ID);
    }

    return output;
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function safePathName(value) {

    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .replace(/'/g, "")
        .replace(/æ/g, "ae")
        .replace(/ß/g, "ss")
        .replace(/[^A-Za-z0-9._-]+/g, "-")
        .toLowerCase()
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}


function safePath(value) {

    return String(value)
        .split("/")
        .map(safePathName)
        .join("/");
}

module.exports = {fixBody};