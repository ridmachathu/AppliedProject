const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
var HTMLParser = require('node-html-parser');
const common = require('./common')


async function main() {
  console.log("Starting to back fill product...");

  const days = 30;
  const product_id = '20738571_EA';
  const date_string = '202307'

  let itemsToInsert = [];
  let payload = {
    "id": product_id + ":" + date_string,
    "createDateTime": 1690675200000,
    "date": date_string,
    "day": "30",
    "month": "07",
    "price": 3.78,
    "product_id": product_id,
    "store": "superstore",
    "year": "2023"
  }
  let newDate = payload.createDateTime;


  for (let index = 0; index < days; index++) {

    let day = ("0" + (days - index)).slice(-2);
    let constructedDate = date_string + day;

    payload.day = day;
    payload.id = product_id + ":" + constructedDate;
    payload.date = constructedDate;
    payload.price = generateRandomNumber();
    payload.createDateTime = newDate;

    itemsToInsert.push(Object.assign({}, payload));

    newDate = newDate - 86400000;
  }

  // console.log(itemsToInsert);

  await common.AsyncForEach(itemsToInsert, async (child) => {

    try {
      const res = await axios.post('https://5ju7e1jmij.execute-api.ca-central-1.amazonaws.com/Prod/dashboard/stat', child);
      console.log("Added ", child.id);      
    } catch (error) {
      console.log(error)
    }

  });




}

main();

function generateRandomNumber() {
  var min = 2.50,
    max = 3.78,
    highlightedNumber = Math.random() * (max - min) + min;

  return parseFloat(highlightedNumber.toFixed(2));
};
