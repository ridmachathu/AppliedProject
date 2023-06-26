// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const passwordHash = require('password-hash');
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

    const user = {
        "id": "34a940c6-b3c0-4686-8acd-ebeeceaf8b31",
        "createDateTime": 1687741141399,
        "email": "jim@gmail.com",
        "nickname": "Jim",
        "role": "user"
       }
    response = {
        statusCode: 200,
        body: JSON.stringify({ "statusCode": 200, "data": user, "message": "Credentials are correct" })
    };

    // const payload = {
    //     id: uuid(),
    //     email: body.email,
    //     nickname: body.nickname,
    //     password: hashedPassword,
    //     createDateTime: Date.now()
    // }
    // // Creates a new item, or replaces an old item with a new item
    // // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    // let response = {};

    // try {
    //     const params = {
    //         TableName: tableName,
    //         Item: payload
    //     };

    //     const result = await docClient.put(params).promise();
    //     delete payload.password;

    //     response = {
    //         statusCode: 200,
    //         body: JSON.stringify(payload)
    //     };
    // } catch (ResourceNotFoundException) {
    //     response = {
    //         statusCode: 404,
    //         body: "Unable to call DynamoDB. Table resource not found."
    //     };
    // }
    response.headers = {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
    }
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};