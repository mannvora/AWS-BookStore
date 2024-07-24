const EventBridge = require("aws-sdk/clients/eventbridge");

const EVENT_BUS_NAME = "QR_EVENT_BUS";

let eventBridge = new EventBridge();

module.exports.handler = async (event) => {
    let body = JSON.parse(event.body);

    let entry = {
        EventBusName: EVENT_BUS_NAME,
        Detail: JSON.stringify({
            vehicleNo: body.vehicleNo, //"CVX-4000",
            NIC: body.nic //"23457890S"
        }),
        Source: "fuel-app",
        DetailType: "user-signup"
    }

    try {
        let output = await eventBridge.putEvents({ Entries: [entry] }).promise()
    } catch(err) {
        console.log(err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(output)
    }
}