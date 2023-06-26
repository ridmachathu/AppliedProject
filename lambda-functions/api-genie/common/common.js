

const getAPIResponseObj = (event, data, message, status) => {
    response = {
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        statusCode: status,
        body: JSON.stringify({ "data": data, "message": message, "statusCode": status })
    };
    console.info(`response from: ${event.path} statusCode: ${status} body: `, JSON.stringify(data));
    return response;
}

exports.getAPIResponseObj = getAPIResponseObj;