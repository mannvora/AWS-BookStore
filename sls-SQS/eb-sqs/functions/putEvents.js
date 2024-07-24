const EventBridge = require("aws-sdk/clients/eventbridge");

const EVENT_BUS_NAME = process.env.EventBusName;

let eventBridge = new EventBridge();

module.exports.handler = async (event) => {
    let body = JSON.parse(event.body);

    let event = {
        EventBusName: EVENT_BUS_NAME,
        Detail: JSON.stringify({
            vehicleNo: body.vehicleNo, //"CVX-4000",
            NIC: body.nic //"23457890S"
        }),
        Source: "fuel-app",
        DetailType: "user-signup"
    }

    try {
        let output = await eventBridge.putEvents({ Entries: [] }).promise()
    } catch(err) {
        console.log(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(output)
    }
}