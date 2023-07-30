// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { v4: uuid } = require('uuid');
const common = require('../../common/common');

// Get the DynamoDB table name from environment variables
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

        const historyParams = {
            TableName: productPriceHistoryTableName,
            Item: body
        };
        const result2 = await docClient.put(historyParams).promise();


        return common.getAPIResponseObj(event, result2, "Product creation success", 200);
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