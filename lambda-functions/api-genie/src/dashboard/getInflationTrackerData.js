// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables

const INFLATION_TRACKER_TABLE_NAME = process.env.INFLATION_TRACKER_TABLE_NAME;

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

        const daysToCheck = 30;
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const now = today.getTime();
        const thirty_days_back = today.setDate(today.getDate() - daysToCheck);

        let retrivedItems = [];
        let lastEvaluatedKey = "";
        let lastCosmosResult;

        while (lastEvaluatedKey !== undefined) {
            console.log("LastEvaluatedKey: ", lastEvaluatedKey, typeof lastEvaluatedKey);

            let params = {
                TableName: INFLATION_TRACKER_TABLE_NAME,
                FilterExpression: 'createDateTime >= :thirtyDaysBack AND createDateTime <= :today',
                ExpressionAttributeValues: {
                    ':thirtyDaysBack': thirty_days_back,
                    ':today': now
                },
                ExclusiveStartKey: lastEvaluatedKey === "" ? null : lastEvaluatedKey
            };
            console.log("DynamoDB params: ", params);
            lastCosmosResult = await docClient.scan(params).promise();
            retrivedItems = retrivedItems.concat(lastCosmosResult.Items);

            console.log("Items received: ", retrivedItems.length);
            console.log("LastEvaluatedKey: ", lastCosmosResult.LastEvaluatedKey, typeof lastCosmosResult.LastEvaluatedKey);
            lastEvaluatedKey = lastCosmosResult.LastEvaluatedKey;
        }
        console.log("Continuing further...");

        let cdata = getChartData(retrivedItems, daysToCheck, today);

        const chartData = {
            series: cdata.series,
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

const getChartData = (data, days, today) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let records = [];
    let labels = [];
    let values = [];
    let superstore = [];
    let saveonfoods = [];

    let date = new Date(new Date().setHours(0, 0, 0, 0));
    console.log("Today: ", date.getTime())

    for (let index = 0; index <= days; index++) {
        let date = new Date(new Date().setHours(0, 0, 0, 0));
        let actualDate = date.setDate(date.getDate() - (days - index))
        records.push({
            "date": date,
            "actualDate": actualDate,
            "label": `${("0" + date.getDate()).slice(-2)} ${months[date.getMonth()]} ${date.getFullYear()}`,
            "data": {}
        })
    }

    data.forEach(rec => {
        records.forEach(record => {
            if (rec.createDateTime === record.actualDate) {
                record.data.superstore = {
                    name: "superstore",
                    data: rec.superstore.total
                }
                record.data.saveonfoods = {
                    name: "saveonfoods",
                    data: rec.saveonfoods.total
                }
            }
        });
    });

    records.forEach(record => {
        console.log(record);
        labels.push(record.label);

        if (record.data.superstore) {
            superstore.push(record.data.superstore.data.toFixed(2))
        } else {
            superstore.push(0)
        }

        if (record.data.saveonfoods) {
            saveonfoods.push(record.data.saveonfoods.data.toFixed(2))
        } else {
            saveonfoods.push(0)
        }

    });

    return {
        labels, series: [
            {
                "name": "superstore",
                "data": superstore
            },
            {
                "name": "saveonfoods",
                "data": saveonfoods
            },
        ]
    };
}