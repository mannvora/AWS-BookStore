const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");

const EVENT_BUS_NAME = "QR_EVENT_BUS";
const client = new EventBridgeClient();

module.exports.handler = async (event) => {
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error("Error parsing event body:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid request body" })
        };
    }

    const entry = {
        EventBusName: EVENT_BUS_NAME,
        Detail: JSON.stringify({
            vehicleNo: body.vehicleNo,
            NIC: body.nic
        }),
        Source: "fuel-app",
        DetailType: "user-signup"
    };

    try {
        const command = new PutEventsCommand({ Entries: [entry] });
        const output = await client.send(command);
        
        return {
            statusCode: 200,
            body: JSON.stringify(output)
        };
    } catch (error) {
        console.error("Error putting event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to process request" })
        };
    }
};