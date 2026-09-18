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
            .replaceAll("$CATEGORY_PATH^", product.CATEGORY_PATH)
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

module.exports = {fixBody};