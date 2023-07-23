// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { v4: uuid } = require('uuid');
const common = require('../../common/common');

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
        }
        console.info('received:', event);
        const body = JSON.parse(event.body);

        if (!_validateBody(body)) {
            throw new Error(`Please fill the required fields: listtype, listname, items`);
        }

        const payload = {
            id: uuid(),
            listtype: body.listtype,
            listname: body.listname,
            items: body.items,
            createDateTime: Date.now()
        }

        const params = {
            TableName: tableName,
            Item: payload
        };

        const result = await docClient.put(params).promise();

        return common.getAPIResponseObj(event, payload, "Shopping list creation success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};

function _validateBody(body) {
    let isValid = true;
    if (body.listtype === undefined || body.listtype === "") {
        isValid = false;
    } else if (body.listname === undefined || body.listname === "") {
        isValid = false;
    } else if (body.items === undefined || body.items === "") {
        isValid = false;
    // } else if (body.mobile === undefined || body.mobile === "") {
    //     isValid = false;
    // } else if (body.password === undefined || body.password === "") {
    //     isValid = false;
    }
    return isValid;
}