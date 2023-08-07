// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { v4: uuid } = require('uuid');
const common = require('../../common/common');

// Get the DynamoDB table name from environment variables
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`postMethod only accepts GET method, you tried: ${event.httpMethod} method.`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        let queryParams = { RequestItems: {} };
        queryParams.RequestItems[PRODUCTS_TABLE_NAME] = {
            Keys: [{ 'id': '20962884_EA' }, { 'id': 'productCard_title__00068700011078' }]
        };
        const result2 = await docClient.batchGet(queryParams).promise();


        return common.getAPIResponseObj(event, result2, "Inflation tracking is a success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};