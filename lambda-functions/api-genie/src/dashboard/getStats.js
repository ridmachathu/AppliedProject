// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const common = require('../../common/common');

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`getStats only accept GET method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        const params = {
            TableName: PRODUCTS_TABLE_NAME
        };
        const data = await docClient.scan(params).promise();
        const items = data.Items;

        // find the products which are with deals
        let productsWithDeals = 0;
        items.forEach(product => {
            if(product.priceBefore !== 0){
                productsWithDeals++;
            }
        });

        const stats = {
            total_number_of_products: items.length,
            total_number_of_products_with_deals: productsWithDeals
        }

        return common.getAPIResponseObj(event, stats, "Get Dashboard Stats is a success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }

}
