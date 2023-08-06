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

        const query = event.queryStringParameters.query;
        const store = event.queryStringParameters.store;
        const onlyDeals = event.queryStringParameters.onlyDeals;

        console.info('Query to search: ', query);
        console.info('Store to search: ', store);
        console.info('Search only deals: ', onlyDeals);

        const qparams = getQueryParams(query, store, onlyDeals);

        const params = {
            TableName: tableName,
            FilterExpression: qparams.FilterExpression,
            ExpressionAttributeValues: qparams.ExpressionAttributeValues,
            ExpressionAttributeNames: qparams.ExpressionAttributeNames
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

function getQueryParams(querystring, storename, onlyDeals) {
    onlyDeals = (onlyDeals === 'true');

    console.log("Function params: ")
    console.info('querystring: ', querystring, typeof querystring);
    console.info('storename: ', storename, typeof storename);
    console.info('onlyDeals: ', onlyDeals, typeof onlyDeals);

    let defaultFilter = "";
    let defaultAttributes = {}
    let defaultAttributeNames = {}

    if (storename === '' && onlyDeals === false) {
        console.log("Scenario 1");
        defaultFilter = "contains (#tags, :query)";
        defaultAttributes = {
            ':query': querystring
        }
        defaultAttributeNames = {
            '#tags': 'tags'
        }
    } else if (storename !== '' && onlyDeals === false) {
        console.log("Scenario 2");
        defaultFilter = "contains (#tags, :query) AND #storeName = :store";
        defaultAttributes = {
            ':query': querystring,
            ':store': storename
        }
        defaultAttributeNames = {
            '#tags': 'tags',
            '#storeName': 'store',
        }
    } else if (storename === '' && onlyDeals === true) {
        console.log("Scenario 3");
        defaultFilter = "contains (#tags, :query) AND #priceBefore <> :zero";
        defaultAttributes = {
            ':query': querystring,
            ':zero': 0
        }
        defaultAttributeNames = {
            '#tags': 'tags',
            '#priceBefore': 'priceBefore'
        }
    } else if (storename !== '' && onlyDeals === true) {
        console.log("Scenario 4");
        defaultFilter = "contains (#tags, :query) AND #storeName = :store AND #priceBefore <> :zero";
        defaultAttributes = {
            ':query': querystring,
            ':store': storename,
            ':zero': 0
        }
        defaultAttributeNames = {
            '#tags': 'tags',
            '#storeName': 'store',
            '#priceBefore': 'priceBefore'
        }
    }

    let returnPayload = {
        FilterExpression: defaultFilter,
        ExpressionAttributeValues: defaultAttributes,
        ExpressionAttributeNames: defaultAttributeNames
    }
    console.log("Selected qparams: ", returnPayload);
    return returnPayload
}