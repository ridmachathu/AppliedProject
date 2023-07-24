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
            throw new Error(`getAllLists only accept GET method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        const query = event.queryStringParameters.query;
        console.info('Query to search:', query);

        const params = {
            TableName: tableName,
            FilterExpression: "contains (listname, :query)",
            ExpressionAttributeValues: {
                ':query': query
            }
        };
        const data = await docClient.scan(params).promise();

        console.log("dynamodb res: ", data);
        const items = data.Items;

        return common.getAPIResponseObj(event, items, "Search Products success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }

}
