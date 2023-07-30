// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { v4: uuid } = require('uuid');
const common = require('../../common/common');

// Get the DynamoDB table name from environment variables
const tableName = process.env.PRODUCTS_TABLE_NAME;
const productPriceHistoryTableName = process.env.PRODUCT_PRICE_HISTORY_TABLE_NAME;
/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        // Get id and name from the body of the request
        const body = JSON.parse(event.body);

        if (!_validateBody(body)) {
            throw new Error(`Please fill the required fields: id, title, price, store, class, type, category, imageUrl`);
        }

        let tags = body.tags.filter(item => {
            if (item !== "") {
                return true;
            }
        });
        
        tags = tags.map(word => {
            word = word.toLowerCase();
            word = word.replace(/[^a-zA-Z0-9 ]/g, '');
            word = word.trim();
            return word;
        });
        // removed duplicates on tags
        tags = [...new Set(tags)]

        // record to update the current product details
        const payload = {
            id: body.id,
            title: body.title,
            brand: body.brand,
            imageUrl: body.imageUrl,
            price: body.price,
            priceBefore: body.priceBefore,
            packageSize: body.packageSize,
            tags: tags,
            store: body.store,
            productClass: body.productClass,
            productType: body.productType,
            category: body.category,
            description: body.description,
            lateUpdatedDateTime: Date.now()
        }
        const params = {
            TableName: tableName,
            Item: payload
        };
        const result = await docClient.put(params).promise();

        // record to update the historical data in the price history table
        const now = new Date();
        // getting the date for the format of YYYYMMDD
        const year = now.getFullYear().toString();
        const month = ("0" + (now.getMonth() + 1)).slice(-2);
        const day = ("0" + now.getDate()).slice(-2);
        const date = `${year}${month}${day}`;
        
        const historyRecordId = body.id + ":" + date;
        const priceHistoryRecord = {
            id: historyRecordId,
            date: date,
            product_id: body.id,
            price: body.price,
            createDateTime: new Date(new Date().setHours(0,0,0,0)).getTime(),
            store: body.store,
            year: year,
            month: month,
            day: day
        }
        const historyParams = {
            TableName: productPriceHistoryTableName,
            Item: priceHistoryRecord
        };
        const result2 = await docClient.put(historyParams).promise();


        return common.getAPIResponseObj(event, payload, "Product creation success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};

function _validateBody(body) {
    let isValid = true;
    if (body.id === undefined || body.id === "") {
        isValid = false;
    } else if (body.title === undefined || body.title === "") {
        isValid = false;
    } else if (body.price === undefined || body.price === 0) {
        isValid = false;
    } else if (body.store === undefined || body.store === "") {
        isValid = false;
    } else if (body.productClass === undefined || body.productClass === "") {
        isValid = false;
    } else if (body.productType === undefined || body.productType === "") {
        isValid = false;
    } else if (body.category === undefined || body.category === "") {
        isValid = false;
    } else if (body.imageUrl === undefined || body.imageUrl === "") {
        isValid = false;
    }
    return isValid;
}