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

        const productClass = event.pathParameters.class;

        const params = {
            TableName: tableName,
            FilterExpression: 'productClass = :productClass',
            ExpressionAttributeValues: { ':productClass': productClass }
        };
        const data = await docClient.scan(params).promise();

        let items = [...new Set(data.Items.map(record => record.productType))];

        // filter null values
        items = items.filter(val => val);

        return common.getAPIResponseObj(event, items, "Get all Products types for class is success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }

}
