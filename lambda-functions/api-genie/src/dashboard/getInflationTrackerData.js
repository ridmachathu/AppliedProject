// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const PRODUCT_PRICE_HISTORY_TABLE_NAME = process.env.PRODUCT_PRICE_HISTORY_TABLE_NAME;
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

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
            throw new Error(`getStats only accept GET method, you tried: ${event.httpMethod}`);
        }
        // All log statements are written to CloudWatch
        console.info('received:', event);

        const productId = event.pathParameters.id;

        const daysToCheck = 30;
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const now = today.getTime();
        const thirty_days_back = today.setDate(today.getDate() - daysToCheck);

        let retrivedItems = [];
        let lastEvaluatedKey = "";
        let lastCosmosResult;

        while (lastEvaluatedKey !== undefined) {
            console.log("LastEvaluatedKey: ",lastEvaluatedKey, typeof lastEvaluatedKey);
            
            let params = {
                TableName: PRODUCT_PRICE_HISTORY_TABLE_NAME,
                FilterExpression: 'product_id = :product_id AND createDateTime >= :thirtyDaysBack AND createDateTime <= :today',
                ExpressionAttributeValues: {
                    ':product_id': productId,
                    ':thirtyDaysBack': thirty_days_back,
                    ':today': now
                },
                ExclusiveStartKey: lastEvaluatedKey === "" ? null : lastEvaluatedKey
            };
            console.log("DynamoDB params: ", params);
            lastCosmosResult = await docClient.scan(params).promise();
            retrivedItems = retrivedItems.concat(lastCosmosResult.Items);

            console.log("Items received: ",retrivedItems.length);
            console.log("LastEvaluatedKey: ",lastCosmosResult.LastEvaluatedKey, typeof lastCosmosResult.LastEvaluatedKey);
            lastEvaluatedKey = lastCosmosResult.LastEvaluatedKey;
        }
        console.log("Continuing further...");

        // get product object to get the title
        const params2 = {
            TableName: PRODUCTS_TABLE_NAME,
            Key: { id: productId },
        };
        const data2 = await docClient.get(params2).promise();
        const product = data2.Item;

        let cdata = getChartData(retrivedItems, daysToCheck, today);

        const chartData = {
            series: [
                {
                    name: product.title,
                    data: cdata.values
                }
            ],
            labels: cdata.labels,
            data: lastCosmosResult,
            cdata: cdata,
            retrivedItems: retrivedItems,
            today: now,
            thirty_days_back: thirty_days_back
        }

        return common.getAPIResponseObj(event, chartData, "Get Price History for Product is a success", 200);
    } catch (error) {
        console.info(`error: `, error);
        return common.getAPIResponseObj(event, error, error.message, 400);
    }

}

const nthNumber = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

const getChartData = (data, days, today) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let records = [];
    let labels = [];
    let values = [];
    for (let index = 0; index <= days; index++) {
        let date = new Date(new Date().setHours(0, 0, 0, 0));
        let actualDate = date.setDate(date.getDate() - (days - index))
        records.push({
            "date": date,
            "actualDate": actualDate,
            "label": `${("0" + date.getDate()).slice(-2)} ${months[date.getMonth()]} ${date.getFullYear()}`,
            "value": 0
        })
    }
    //"label": `${date.getDate()}${nthNumber(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`,

    data.forEach(rec => {
        records.forEach(record => {
            if (rec.createDateTime === record.actualDate) {
                record.value = rec.price;
            }
        });
    });

    records.forEach(record => {
        labels.push(record.label);
        values.push(record.value)
    });

    return { labels, values };
}