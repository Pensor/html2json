const fs = require("fs");
const cheerio = require("cheerio");

const html = fs.readFileSync("content.html", "utf8");

const $ = cheerio.load(html, null, false);

let array = $.root().children().toArray();

let fileName;

let result = [];

array.forEach(element => {
  if (element.name == "h1") {
    result.push({ type: "pageTitle", content: $(element).text() });
    fileName = $(element).text().toLowerCase().split(" ")[0];
  }
  if (element.name == "h3") {
    if ($(element).text() === "PRODUCTION") {
      result.push({ type: "invite" });
    } else {
      result.push({ type: "line" });
    }
    result.push({
      type: "title",
      content: $(element).text(),
      anchor: $(element).text().toLowerCase(),
    });
  }

  if (element.name == "p") {
    result.push({ type: "text", content: [$(element).html()] });
  }
});

fs.writeFileSync(`${fileName}.json`, JSON.stringify(result, null, 4));

console.log(`${fileName}.json file created`)
