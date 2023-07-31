// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
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

        // if (!_validateBody(body)) {
        //     throw new Error(`Please fill the required fields: items`);
        // }

        // const id = event.pathParameters.id;

        const getparams = {
            TableName: tableName,
            Key: { id: body.id },
        };
        const data = await docClient.get(getparams).promise();
        const item = data.Item;

        var plistId = item.items.split(",")

        const plistIdafterdeleted = plistId.filter(function (pid) {
            return pid !== body.pid;
        });
        item.items = "";
        for (let i = 0; i < plistIdafterdeleted.length; i++) {
            if(item.items == ""){
                item.items = plistIdafterdeleted[i];
            }
            else{
                item.items = item.items + "," + plistIdafterdeleted[i];
            } 
        }

        const payload = {
            id: item.id,
            userId: item.userId,
            listtype: item.listtype,
            listname: item.listname,
            items: item.items,
            createDateTime: item.createDateTime
        }

        const paramsUpdate = {
            TableName: tableName,
            Item: payload
        };

        const result = await docClient.put(paramsUpdate).promise();

        return common.getAPIResponseObj(event, payload, "Shopping list update success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};

// function _validateBody(body) {
//     let isValid = true;
//     if (body.items === undefined || body.items === "") {
//         isValid = false;
//     } 
//     return isValid;
// }