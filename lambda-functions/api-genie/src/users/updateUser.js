// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const passwordHash = require('password-hash');
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
            throw new Error(`updateUser only accept POST method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);
        const body = JSON.parse(event.body);

        if (!_validateBody(body)) {
            throw new Error(`Please fill the required fields: firstname, lastname, mobile`);
        }

        // const id = event.pathParameters.id;

        const getparams = {
            TableName: tableName,
            Key: { id: body.id },
        };
        const data = await docClient.get(getparams).promise();
        const item = data.Item;

        item.firstname = body.firstname;
        item.lastname = body.lastname;
        item.mobile = body.mobile;
        item.latitude = body.latitude;
        item.longitude = body.longitude;

        const payload = {
            id: item.id,
            email: item.email,
            firstname: item.firstname,
            lastname: item.lastname,
            mobile: item.mobile,
            password: item.password,
            role: "user",
            latitude : item.latitude,
            longitude : item.longitude,
            createDateTime: item.createDateTime
        }

        const paramsUpdate = {
            TableName: tableName,
            Item: payload
        };

        const result = await docClient.put(paramsUpdate).promise();
        //item.password = "";
        delete payload.password;

        return common.getAPIResponseObj(event, payload, "User update success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};

function _validateBody(body) {
    let isValid = true;
    if (body.firstname === undefined || body.firstname === "") {
        isValid = false;
    } else if (body.lastname === undefined || body.lastname === "") {
        isValid = false;
    // } else if (body.email === undefined || body.email === "") {
    //     isValid = false;
    } else if (body.mobile === undefined || body.mobile === "") {
        isValid = false;
    // } else if (body.password === undefined || body.password === "") {
    //     isValid = false;
    }
    return isValid;
}