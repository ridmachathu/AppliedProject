// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { v4: uuid } = require('uuid');
const common = require('../../common/common');

// Get the DynamoDB table name from environment variables
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const INFLATION_TRACKER_TABLE_NAME = process.env.INFLATION_TRACKER_TABLE_NAME;
/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.handler = async (event) => {
    try {
        if (event.httpMethod !== 'GET') {
            throw new Error(`postMethod only accepts GET method, you tried: ${event.httpMethod} method.`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        // these are the product ids of the items we use to track shopping list in each store
        let saveOnFoodsList = [
            "productCard_title__00068700011078",
            "productCard_title__00068721704430",
            "productCard_title__00033383007410",
            "productCard_title__00057393700178",
            "productCard_title__00062639306885",
            "productCard_title__00036000535938",
            "productCard_title__00039978359520"
        ]

        let superStoreList = [
            "20962884_EA",
            "20563427_EA",
            "21195877001_EA",
            "21027220_EA",
            "21021565_EA",
            "21456640_EA",
            "21127426_EA"
        ]

        let SFQueryParams = { RequestItems: {} };
        SFQueryParams.RequestItems[PRODUCTS_TABLE_NAME] = {
            Keys: getProductIdList(saveOnFoodsList)
        };
        const SFResults = await docClient.batchGet(SFQueryParams).promise();
        const SFProducts = SFResults.Responses[PRODUCTS_TABLE_NAME];

        let SSqueryParams = { RequestItems: {} };
        SSqueryParams.RequestItems[PRODUCTS_TABLE_NAME] = {
            Keys: getProductIdList(superStoreList)
        };
        const SSResults = await docClient.batchGet(SSqueryParams).promise();
        const SSProducts = SSResults.Responses[PRODUCTS_TABLE_NAME];

        let inflationRecord = {
            saveonfoods: getStoreRecord(SFProducts),
            superstore: getStoreRecord(SSProducts),
            createDateTime: new Date(new Date().setHours(0,0,0,0)).getTime(),
            id: common.getFormattedDateForToday()
        }

        const itparams = {
            TableName: INFLATION_TRACKER_TABLE_NAME,
            Item: inflationRecord
        };
        const result2 = await docClient.put(itparams).promise();

        let resp = {
            SFProducts: SFProducts,
            SSProducts: SSProducts,
            inflationRecord: inflationRecord
        }

        return common.getAPIResponseObj(event, resp, "Inflation tracking is a success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }
};

function getProductIdList(list) {
    let payload = [];
    list.forEach(element => {
        payload.push({ 'id': element });
    });
    return payload;
}

function getStoreRecord(products) {
    let totalPrice = 0;
    let productIds = [];
    products.forEach(product => {
        totalPrice = totalPrice + product.price,
        productIds.push(product.id);
    });
    return {
        total: totalPrice,
        productIds: productIds
    }
}