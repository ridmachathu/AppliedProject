const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');

async function scrapeWebpage(store, url) {
  try {
    // const response = await axios.get(url);


    const browser = await puppeteer.launch();

    // Open a new browser page
    const page = await browser.newPage();

    // Navigate to the webpage
    await page.goto(url);
    // await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('#pageMain > div > div > div > div.CategoriesContainer--41glgw.iZUEda > div > section.FilterData--digkuz.ckgJCM > section.Content--ttviix.efTUXH');
    // Get the webpage content
    const content = await page.content();

    await browser.close();

    const $ = cheerio.load(content);

    // const selected = $('html body div[id="root"] ');
    const selected = $('[aria-labelledby="productGrid__title"]');

    let root = HTMLParser.parse(selected.html());
    let count = 0;
    await asyncForEach(root.childNodes[3].childNodes, async (child) => {
      let node = child.childNodes[0];
      let brand, productId, title, packageSize, imageUrl, price, priceBefore;

      imageUrl = node.childNodes[0].childNodes[0].rawAttributes.src;
      price = node.childNodes[1].childNodes[1].childNodes[0].rawText.trim();

      productId = node.childNodes[1].childNodes[2].childNodes[0].childNodes[0].id.trim();
      if (productId === '') {
        productId = node.childNodes[1].childNodes[2].childNodes[0].childNodes[1].id.trim();

        title = node.childNodes[1].childNodes[2].childNodes[0].childNodes[1].rawText.trim();
        brand = node.childNodes[1].childNodes[2].childNodes[0].childNodes[0].rawText.trim();
        packageSize = node.childNodes[1].childNodes[2].childNodes[0].childNodes[2].rawText.trim();
      } else {
        title = node.childNodes[1].childNodes[2].childNodes[0].childNodes[0].rawText.trim();
        packageSize = node.childNodes[1].childNodes[2].childNodes[0].childNodes[1].rawText.trim();
      }

      if (node.childNodes[1].childNodes[1].childNodes.length > 1) {
        priceBefore = node.childNodes[1].childNodes[1].childNodes[1].rawText.trim();
      }

      let payload = cleanseProduct(productId, title, brand, imageUrl, price, priceBefore, packageSize, store);

      const res = await axios.post('https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products', payload);
      console.log(res.data.data.id);
      count++
    })

    console.log("Products updated: ", count);

  } catch (error) {
    console.error('Error:', error);
  }
}

function cleanseProduct(id, title, brand, image, price, priceBefore, packageSize, store) {
  let priceBreak, priceBeforeBreak, tags;
  priceBreak = price.split("$")[1];

  if (priceBefore) {
    priceBeforeBreak = priceBefore.split("$")[1];
  } else {
    priceBeforeBreak = 0;
  }

  let catBreak = store.category.split(" ");
  let nameBreak = title.split(" ");
  let typeBreak = store.type.split(" ");

  tags = [...catBreak, ...nameBreak, ...typeBreak, store.class]

  return {
    id: id,
    title: title,
    brand: brand || "",
    imageUrl: image,
    price: parseFloat(priceBreak),
    priceBefore: parseFloat(priceBeforeBreak),
    packageSize: packageSize,
    tags: tags,
    store: store.store,
    productClass: store.class,
    productType: store.type,
    category: store.category,
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const weblinks = [
  {
    "store": "saveonfoods",
    "class": "food",
    "type":"fruits vegetables",
    "category":"fresh fruites",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-fruit-id-30682?page=1",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-fruit-id-30682?page=2&skip=30",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-fruit-id-30682?page=3&skip=60",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-fruit-id-30682?page=4&skip=90"
    ]
  }
];

async function main() {
  console.log("Starting the webscraper...");
  await asyncForEach(weblinks, async (store) => {
    await asyncForEach(store.links, async (storeLink) => {
      await scrapeWebpage(store, storeLink);
    })
  });
}

main();