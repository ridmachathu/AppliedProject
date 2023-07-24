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
    await page.waitForSelector('#site-content > div > div > div.css-0 > div.css-15f73ke > div:nth-child(1) > div > div');
    // Get the webpage content
    const content = await page.content();

    await browser.close();

    const $ = cheerio.load(content);

    // const selected = $('html body div[id="root"] ');
    const selected = $('[data-testid="product-grid"]');

    let root = HTMLParser.parse(selected.html());
    let count = 0;
    await asyncForEach(root.childNodes, async (child) => {
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

// Replace the URL with your desired webpage
// const page = {
//   category: "Fresh Vegetables",
//   url: 'https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195?page=5'
// };
const page = {
  category: "Fresh Fruits",
  url: 'https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-fruits/c/28194?page=3'
};
// const url = 'https://www.walmart.ca/search?q=apple%20juice';

const weblinks = [
  {
    "store": "superstore",
    "class": "food",
    "type":"fruits vegetables",
    "category":"fresh vegetables",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195?page=1",
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195?page=2",
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195?page=3",
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195?page=4",
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195?page=5",
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195?page=6"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"fruits vegetables",
    "category":"fresh fruites",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-fruits/c/28194?page=1",
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-fruits/c/28194?page=2",
      "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-fruits/c/28194?page=3"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"meat",
    "category":"bacon sausages hot dogs",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/meat/bacon-sausages-hot-dogs/c/28170",
      "https://www.realcanadiansuperstore.ca/food/meat/bacon-sausages-hot-dogs/c/28170?page=2",
      "https://www.realcanadiansuperstore.ca/food/meat/bacon-sausages-hot-dogs/c/28170?page=3",
      "https://www.realcanadiansuperstore.ca/food/meat/bacon-sausages-hot-dogs/c/28170?page=4"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"meat",
    "category":"chicken and turkey",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/meat/chicken-turkey/c/28214",
      "https://www.realcanadiansuperstore.ca/food/meat/chicken-turkey/c/28214?page=2",
      "https://www.realcanadiansuperstore.ca/food/meat/chicken-turkey/c/28214?page=3",
      "https://www.realcanadiansuperstore.ca/food/meat/chicken-turkey/c/28214?page=4"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"meat",
    "category":"pork",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/meat/pork/c/28215",
      "https://www.realcanadiansuperstore.ca/food/meat/pork/c/28215?page=2"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"meat",
    "category":"beef",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/meat/beef/c/28174",
      "https://www.realcanadiansuperstore.ca/food/meat/beef/c/28174?page=2",
      "https://www.realcanadiansuperstore.ca/food/meat/beef/c/28174?page=3"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"dairy and eggs",
    "category":"egg and egg substitutes",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/dairy-eggs/egg-egg-substitutes/c/28222"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"dairy and eggs",
    "category":"milk and cream",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/dairy-eggs/milk-cream/c/28224",
      "https://www.realcanadiansuperstore.ca/food/dairy-eggs/milk-cream/c/28224?page=2",
      "https://www.realcanadiansuperstore.ca/food/dairy-eggs/milk-cream/c/28224?page=3",
      "https://www.realcanadiansuperstore.ca/food/dairy-eggs/milk-cream/c/28224?page=4"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"natural foods",
    "category":"condiments and sauces",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/dairy-eggs/milk-cream/c/28224"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"natural foods",
    "category":"oil and vinegar",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/natural-foods/oil-vinegar/c/29926"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"bakery",
    "category":"Bagels Buns Rolls",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/bakery/bagels-buns-rolls/c/28147",
      "https://www.realcanadiansuperstore.ca/food/bakery/bagels-buns-rolls/c/28147?page=2"
    ]
  },
  {
    "store": "superstore",
    "class": "food",
    "type":"bakery",
    "category":"breakfast",
    "links":[
      "https://www.realcanadiansuperstore.ca/food/bakery/breakfast/c/28149",
      "https://www.realcanadiansuperstore.ca/food/bakery/breakfast/c/28149?page=2"
    ]
  },
  {
    "store": "superstore",
    "class": "home and kitchen",
    "type":"appliances",
    "category":"air conditioners and fans",
    "links":[
      "https://www.realcanadiansuperstore.ca/home-kitchen/appliances/air-conditioners-fans/c/28254"
    ]
  },
  {
    "store": "superstore",
    "class": "home and kitchen",
    "type":"Bath",
    "category":"toilet accessories",
    "links":[
      "https://www.realcanadiansuperstore.ca/home-kitchen/bath/toilet-accessories/c/28285",
      "https://www.realcanadiansuperstore.ca/home-kitchen/bath/toilet-accessories/c/28285?page=2",
      "https://www.realcanadiansuperstore.ca/home-kitchen/bath/toilet-accessories/c/28285?page=3"
    ]
  },
  {
    "store": "superstore",
    "class": "home and kitchen",
    "type":"kitchen",
    "category":"cookware",
    "links":[
      "https://www.realcanadiansuperstore.ca/home-kitchen/kitchen/cookware/c/28362",
      "https://www.realcanadiansuperstore.ca/home-kitchen/kitchen/cookware/c/28362?page=2"
    ]
  },
  {
    "store": "superstore",
    "class": "baby",
    "type":"diapers and potty training",
    "category":"diapers",
    "links":[
      "https://www.realcanadiansuperstore.ca/baby/diapers-potty-training/diapers/c/28159",
      "https://www.realcanadiansuperstore.ca/baby/diapers-potty-training/diapers/c/28159?page=2",
      "https://www.realcanadiansuperstore.ca/baby/diapers-potty-training/diapers/c/28159?page=3",
      "https://www.realcanadiansuperstore.ca/baby/diapers-potty-training/diapers/c/28159?page=4"
    ]
  },
  {
    "store": "superstore",
    "class": "health and beauty",
    "type":"health care",
    "category":"cough and cold",
    "links":[
      "https://www.realcanadiansuperstore.ca/health-beauty/health-care/cough-cold/c/29363",
      "https://www.realcanadiansuperstore.ca/health-beauty/health-care/cough-cold/c/29363?page=2",
      "https://www.realcanadiansuperstore.ca/health-beauty/health-care/cough-cold/c/29363?page=3"
    ]
  },
  {
    "store": "superstore",
    "class": "health and beauty",
    "type":"bath and body",
    "category":"bathing accessories",
    "links":[
      "https://www.realcanadiansuperstore.ca/health-beauty/bath-body/bathing-accessories/c/29348"
    ]
  },
  {
    "store": "superstore",
    "class": "pet food and supplies",
    "type":"dogs",
    "category":"dog dry food",
    "links":[
      "https://www.realcanadiansuperstore.ca/pet-food-supplies/dogs/dog-dry-food/c/31164",
      "https://www.realcanadiansuperstore.ca/pet-food-supplies/dogs/dog-dry-food/c/31164?page=2",
      "https://www.realcanadiansuperstore.ca/pet-food-supplies/dogs/dog-dry-food/c/31164?page=3"
    ]
  },
  {
    "store": "superstore",
    "class": "pet food and supplies",
    "type":"cats",
    "category":"cat dry food",
    "links":[
      "https://www.realcanadiansuperstore.ca/pet-food-supplies/cats/cat-dry-food/c/31073",
      "https://www.realcanadiansuperstore.ca/pet-food-supplies/cats/cat-dry-food/c/31073?page=2",
      "https://www.realcanadiansuperstore.ca/pet-food-supplies/cats/cat-dry-food/c/31073?page=3"
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