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
  },
  {
    "store": "saveonfoods",
    "class": "food",
    "type": "fruits vegetables",
    "category": "fresh vegetables",
    "links": [
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-vegetables-id-30694",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-vegetables-id-30694?page=2&skip=30",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-vegetables-id-30694?page=3&skip=60",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/fruits-%26-vegetables/fresh-vegetables-id-30694?page=4&skip=90"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "food",
    "type": "meat",
    "category": "bacon sausages hot dogs",
    "links": [
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/deli-%26-ready-made-meals/meat-id-30727",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/deli-%26-ready-made-meals/meat-id-30727?page=2&skip=30",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/deli-%26-ready-made-meals/meat-id-30727?page=3&skip=60"
      
    ]
  },
  {
    "store": "saveonfoods",
    "class": "food",
    "type":"dairy and eggs",
    "category":"milk and cream",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/milk-%26-creams-id-30930",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/milk-%26-creams-id-30930?page=2&skip=30",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/milk-%26-creams-id-30930?page=3&skip=60",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/milk-%26-creams-id-30930?page=3&skip=90"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "food",
    "type":"dairy and eggs",
    "category":"egg and egg substitutes",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/eggs-%26-substitutes-id-30919"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "food",
    "type":"dairy and eggs",
    "category":"milk and cream",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/milk-%26-creams-id-30930",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/milk-%26-creams-id-30930?page=2&skip=30",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/milk-%26-creams-id-30930?page=3&skip=60",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dairy-%26-eggs/milk-%26-creams-id-30930?page=3&skip=90"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "food",
    "type":"bakery",
    "category":"Bagels Buns Rolls",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/bakery/bagels-%26-english-muffins-id-30847",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/bakery/bagels-%26-english-muffins-id-30847?page=2&skip=30"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "food",
    "type":"bakery",
    "category":"breakfast",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/pantry/breakfast-id-30481",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/pantry/breakfast-id-30481?page=2&skip=30"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "baby",
    "type":"diapers and potty training",
    "category":"diapers",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/baby-care/diapers-id-31086",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/baby-care/diapers-id-31086?page=2&skip=30"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "baby",
    "type":"baby care",
    "category":"baby food",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/baby-care/baby-food-id-31077",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/baby-care/baby-food-id-31077?page=2&skip=30"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "home and kitchen",
    "type":"kitchen",
    "category":"cookware",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/kitchen-%26-dining/cookware-id-31355",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/kitchen-%26-dining/cookware-id-31355?page=2&skip=30"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "home and kitchen",
    "type":"appliances",
    "category":"air conditioners and fans",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/appliances/heating-%26-cooling-appliances-id-31313"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "pet food and supplies",
    "type":"dogs",
    "category":"dog dry food",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dog/dry-dog-food-id-31296",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/dog/dry-dog-food-id-31296?page=2&skip=30"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "pet food and supplies",
    "type":"cats",
    "category":"cat dry food",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/cat/dry-cat-food-id-31290"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "health and beauty",
    "type":"health care",
    "category":"cough and cold",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/health-%26-beauty/medicine-%26-health-id-31239",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/health-%26-beauty/medicine-%26-health-id-31239?page=2&skip=30"
    ]
  },
  {
    "store": "saveonfoods",
    "class": "health and beauty",
    "type":"bath and body",
    "category":"bathing accessories",
    "links":[
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/personal-care/bath-%26-body-care-id-31118",
      "https://www.saveonfoods.com/sm/pickup/rsid/1982/categories/personal-care/bath-%26-body-care-id-31118?page=2&skip=30"
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