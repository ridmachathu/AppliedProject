// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

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
            throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        const productCategory = decodeURIComponent(event.pathParameters.category);
        console.info("searching for: ", productCategory);

        const params = {
            TableName: tableName,
            FilterExpression: 'category = :productCategory',
            ExpressionAttributeValues: { ':productCategory': productCategory }
        };
        const data = await docClient.scan(params).promise();

        return common.getAPIResponseObj(event, data.Items, "Get all Products for category is success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }

}