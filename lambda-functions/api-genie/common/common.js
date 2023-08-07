

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

const getFormattedDateForToday = () => {
    const now = new Date();
    // getting the date for the format of YYYYMMDD
    const year = now.getFullYear().toString();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);
    const date = `${year}${month}${day}`;

    return date;
}

exports.getAPIResponseObj = getAPIResponseObj;
exports.getFormattedDateForToday = getFormattedDateForToday;