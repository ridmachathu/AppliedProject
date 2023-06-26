const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');

async function scrapeWebpage(url) {
  try {
    // const response = await axios.get(url);


    const browser = await puppeteer.launch();

    // Open a new browser page
    const page = await browser.newPage();

    // Navigate to the webpage
    await page.goto(url);
    // await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForSelector('#site-content > div > div > div.css-0 > div.css-15f73ke > div:nth-child(1) > div > div');
    // Get the webpage content
    const content = await page.content();

    await browser.close();

    const $ = cheerio.load(content);

    // const selected = $('html body div[id="root"] ');
    const selected = $('[data-testid="product-grid"]');

    let root = HTMLParser.parse(selected.html());
    let count = 0;
    asyncForEach(root.childNodes, async (child) => {
      let node = child.childNodes[0].childNodes[0];
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

      let payload = cleanseProduct(productId, title, brand, imageUrl, price, priceBefore, packageSize);

      const res = await axios.post('https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/products', payload);
      console.log(res.data.id);
      count++
    })

    console.log("Products updated: ", count);

  } catch (error) {
    console.error('Error:', error);
  }
}

function cleanseProduct(id, title, brand, image, price, priceBefore, packageSize){
  let priceBreak, priceBeforeBreak;
  priceBreak = price.split("$")[1];

  if(priceBefore){
    priceBeforeBreak = priceBefore.split("$")[1];
  } else {
    priceBeforeBreak = 0;
  }

  return {
    id: id,
    title: title,
    brand: brand || "",
    imageUrl: image,
    price: parseFloat(priceBreak),
    priceBefore: parseFloat(priceBeforeBreak),
    packageSize: packageSize
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Replace the URL with your desired webpage
const url = 'https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195?page=1';
// const url = 'https://www.walmart.ca/search?q=apple%20juice';

scrapeWebpage(url);