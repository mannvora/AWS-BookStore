const AWS = require("aws-sdk");
const DynamoDB = new AWS.DynamoDB.DocumentClient({ 
  region: 'us-east-1',
  maxRetries: 30,
  httpOptions: {
   timeout: 5000 
  }
});
const notesTableName = process.env.NOTES_TABLE_NAME;

const outputResponse = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message
    })
  }
}

exports.createNote = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const notesId = data.id;

  console.log("TableName is", notesTableName)

  try {
    const params = {
      TableName: "Notes",
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: "attribute_not_exists(notesId)"
    }

    await DynamoDB.put(params).promise();
    callback(null, outputResponse(201, 'Success! The note has been added'));
  } catch (err) {
    callback(null, outputResponse(500, 'Oops!! Something went wrong: ' + err.message));
  }
};

exports.updateNote = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (event.body) {
    const data = JSON.parse(event.body);
    const notesId = data.id;

    try {
      const params = {
        TableName: "Notes",
        Key: { notesId },
        UpdateExpression: 'set #title = :title, #body = :body',
        ExpressionAttributeNames: {
          '#title': 'title',
          '#body': 'body'
        },
        ExpressionAttributeValues: {
          ':title': data.title,
          ':body': data.body
        },
        ConditionExpression: 'attribute_exists(notesId)'
      }

      await DynamoDB.update(params).promise();
      callback(null, outputResponse(200, 'Success! The note has been updated'));
    } catch (err) {
      callback(null, outputResponse(500, 'Oops!! Something went wrong: ' + err.message));
    }
  } else {
    return outputResponse(400, 'Invalid event source');
  }
};

exports.deleteNote = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (event.body) {
    const data = JSON.parse(event.body);
    const notesId = data.id;

    try {
      const params = {
        TableName: "Notes",
        Key: { notesId },
        ConditionExpression: 'attribute_exists(notesId)'
      }

      await DynamoDB.delete(params).promise();
      callback(null, outputResponse(200, 'Success! The note has been deleted'));
    } catch (err) {
      callback(null, outputResponse(500, 'Oops!! Something went wrong: ' + err.message));
    }
  } else {
    return outputResponse(400, 'Invalid event source');
  }
};

exports.getAllNotes = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: "Notes"
    }

    await DynamoDB.scan(params).promise()
    callback(null, outputResponse(200, 'Success! Here are all the notes!!'));
  } catch(err) {
    console.log(err);
    callback(null, outputResponse(500, 'Internal server Error' + err.message)); 
  }
};