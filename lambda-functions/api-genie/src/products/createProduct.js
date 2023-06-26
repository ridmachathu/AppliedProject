// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { v4: uuid } = require('uuid');

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);

    const payload = {
        id: body.id,
        title: body.title,
        brand: body.brand,
        imageUrl: body.imageUrl,
        price: body.price,
        priceBefore: body.priceBefore,
        packageSize: body.packageSize,
        tags: body.tags,
        store: body.store,
        class: body.class,
        type: body.type,
        category: body.category,
        lateUpdatedDateTime: Date.now()
    }

    let response = {};

    try {
        const params = {
            TableName: tableName,
            Item: payload
        };

        const result = await docClient.put(params).promise();

        response = {
            statusCode: 200,
            body: JSON.stringify(payload)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Unable to call DynamoDB. Table resource not found."
        };
    }
    
    response.headers = {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
    }
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
