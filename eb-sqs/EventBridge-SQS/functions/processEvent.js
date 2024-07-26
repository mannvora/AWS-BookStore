module.exports.handler = async(event) => {
    let records = event.Records;
    let batchItemFailures = [];

    if(records.length) {
        for(const record of records) {
            try {
                const parseBody =JSON.parse(record.body);
                console.log("Processing Vehicle Details " + parseBody.detail.vehicleNo);
                console.log("Processing is succesfful!!" + record.messageId);
            } catch (err) {
                batchItemFailures.push({
                    itemIdentifier: record.messageId
                })
            }
        }
    }

    return  { batchItemFailures };
}