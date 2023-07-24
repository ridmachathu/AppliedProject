const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');
const common = require('./common')

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

    let processedProductIDs = [];
    await common.AsyncForEach(root.childNodes[3].childNodes, async (child) => {
      let article = child.childNodes[0];
      let id = article.childNodes[0].id.trim();

      if(!processedProductIDs.includes(id)){
      
        let brand, productId, title, packageSize, imageUrl, price, priceBefore, description;

        imageUrl = article.childNodes[4].childNodes[0].childNodes[0].rawAttributes.src;
  
        let _titleText = article.childNodes[7].childNodes[0].childNodes[0].rawText.trim();
        let _titleTextSplits = _titleText.split("-");
  
        brand = _titleTextSplits[0].trim();
        title = _titleTextSplits[1].trim();
  
        price = article.childNodes[9].childNodes[0].childNodes[0].rawText.trim();
  
        packageSize = "";
        if (article.childNodes[9].childNodes[1].childNodes.length > 0) {
          packageSize = article.childNodes[9].childNodes[1].childNodes[0].rawText.trim();
        }
  
        priceBefore = "";
        if (article.childNodes[9].childNodes[0].childNodes.length > 1) {
          priceBefore = article.childNodes[9].childNodes[0].childNodes[1].rawText.trim();
        }
  
        productId = article.childNodes[0].id.trim();
        description = article.childNodes[0].childNodes[1].rawText.trim();
  
        let payload = common.CleanseProduct(productId, title, brand, imageUrl, price, priceBefore, packageSize, store, description);
  
        const res = await axios.post('https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products', payload);
        console.log(res.data.data.id);

        processedProductIDs.push(productId);
        count++
      }
    })

    console.log("Products updated: ", count);

  } catch (error) {
    console.error('Error:', error);
  }
}

const weblinks = [
  {
    "store": "saveonfoods",
    "class": "food",
    "type": "fruits vegetables",
    "category": "fresh fruites",
    "links": [
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-fruit-id-30682?page=1",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-fruit-id-30682?page=2&skip=30",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-fruit-id-30682?page=3&skip=60",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-fruit-id-30682?page=4&skip=90"
    ]
  }
];

async function main() {
  console.log("Starting the webscraper...");
  await common.AsyncForEach(weblinks, async (store) => {
    await common.AsyncForEach(store.links, async (storeLink) => {
      await scrapeWebpage(store, storeLink);
    })
  });
}

main();