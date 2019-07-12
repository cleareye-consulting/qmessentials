const AWS = require('aws-sdk');
const config = require('../config');
const { promisify } = require('../utility');

AWS.config.update({region: config.awsQueueRegion});

exports.readFromBulkIntakeQueue = () => {
    const sqs = new AWS.SQS({ apiVersion: config.awsSqsApiVersion });
    const params = {
        QueueUrl: config.readFromBulkIntakeQueue,
        AttributeNames: [ All ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [ All ],
        VisibilityTimeout: 0,
        WaitTimeSeconds: 20
    };
    const receive = promisify(sqs.receiveMessage);
    return receive(params);
}

exports.writeToReportingDatabaseQueue = async (messageType, message) => {
    const sqs = new AWS.SQS({ apiVersion: config.awsSqsApiVersion });
    const params = {
        MessageAttributes: {
            "MessageType": {
                DataType: "String",
                StringValue: messageType
            }
        },
        MessageAttributes: JSON.stringify(message),
        QueueUrl: config.toReportingQueueUrl
    };
    const send = promisify(sqs.sendMessage);
    return send(params);
}

