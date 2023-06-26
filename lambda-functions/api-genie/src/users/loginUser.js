// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const passwordHash = require('password-hash');
const common = require('../../common/common');
var jwt = require('jsonwebtoken');

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;
const signKey = process.env.SIGN_KEY;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'POST') {
            throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);
        const body = JSON.parse(event.body);

        if (!_validateBody(body)) {
            throw new Error(`Please fill both email and password fields`);
        }

        const getparams = {
            TableName: tableName,
            FilterExpression: 'email = :this_user',
            ExpressionAttributeValues: { ':this_user': body.email }
        };
        const existingUser = await docClient.scan(getparams).promise();
        if (existingUser.Items !== undefined && existingUser.Items?.length == 0) {
            throw new Error(`There is no user registered for the given email address`);
        }

        const user = existingUser.Items[0];
        if (passwordHash.verify(body.password, user.password)) {
            delete user.password;

            var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: user
            }, signKey);

            let resp = {
                token: token,
                user: user
            }
            return common.getAPIResponseObj(event, resp, "User login success", 200);
        }
        return common.getAPIResponseObj(event, {}, "Invaid email or password", 400);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};

function _validateBody(body) {
    let isValid = true;
    if (body.email === undefined || body.email === "") {
        isValid = false;
    } else if (body.password === undefined || body.password === "") {
        isValid = false;
    }
    return isValid;
}