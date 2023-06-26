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
            throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
        }
        console.info('received:', event);
        const body = JSON.parse(event.body);

        if (!_validateBody(body)) {
            throw new Error(`Please fill the required fields: firstname, lastname, email, mobile and password`);
        }

        const getparams = {
            TableName: tableName,
            FilterExpression: 'email = :this_user',
            ExpressionAttributeValues: { ':this_user': body.email }
        };
        const existingUser = await docClient.scan(getparams).promise();
        if (existingUser.Items !== undefined && existingUser.Items?.length > 0) {
            throw new Error(`A user witht the same email is already in the system`);
        }

        var hashedPassword = passwordHash.generate(body.password);

        const payload = {
            id: uuid(),
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            mobile: body.mobile,
            password: hashedPassword,
            role: "user",
            createDateTime: Date.now()
        }

        const params = {
            TableName: tableName,
            Item: payload
        };

        const result = await docClient.put(params).promise();
        delete payload.password;

        return common.getAPIResponseObj(event, payload, "User creation success", 200);
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
    } else if (body.email === undefined || body.email === "") {
        isValid = false;
    } else if (body.mobile === undefined || body.mobile === "") {
        isValid = false;
    } else if (body.password === undefined || body.password === "") {
        isValid = false;
    }
    return isValid;
}