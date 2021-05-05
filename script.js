const fs = require("fs");
const cheerio = require("cheerio");

function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function createImage(brand, section, caption) {
  let image = {};

  if (caption) {
    image = {
      imageSrc: `/images/brands/${brand}/${capitalize(
        section
      )}_Placeholder.jpg`,
      caption: "Placeholder caption",
      captionPos: "right",
    };
  } else {
    image = {
      imageSrc: `/images/brands/${brand}/${capitalize(
        section
      )}_Placeholder.jpg`,
    };
  }
  return image;
}

let brand = process.argv[2] || "[brand]";

const html = fs.readFileSync("content.html", "utf8");

const $ = cheerio.load(html, null, false);

let array = $.root().children().toArray();

let fileName = brand;

let slider = [];
let body = [{ type: "pageTitle", content: brand.toUpperCase() }];

array.forEach(element => {
  if (element.name == "h3") {
    const text = $(element).text();

    if (text.toUpperCase() == "PRODUCTION") {
      body.push({ type: "invite" });
    } else {
      body.push({ type: "line" });
    }

    body.push({
      type: "title",
      content: text,
      anchor: text.toLowerCase(),
    });

    if (text.toUpperCase() == "STYLE") {
      let images = Array(4).fill(
        createImage(brand, capitalize(text), false),
        0,
        4
      );
      body.push({ type: "image", images });
    } else if (text.toUpperCase() == "HISTORY") {
      let images = [createImage(brand, capitalize(text), true)];
      body.push({ type: "image", images });
    }

    slider.push({ text: capitalize(text), link: `#${text.toLowerCase()}` });
  }

  if (element.name == "p") {
    body.push({ type: "text", content: [$(element).html()] });
  }
});

body.splice(2, 0, {
  type: "image",
  images: [createImage(brand, "Background", true)],
});

const data = {
  slider,
  body,
};

fs.writeFileSync(`${fileName}.json`, JSON.stringify(data, null, 2));

console.log(`${fileName}.json file created`);
