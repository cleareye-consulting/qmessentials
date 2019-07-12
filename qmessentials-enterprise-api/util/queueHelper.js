const AWS = require('aws-sdk');
const config = require('../config');

AWS.config.update({region: config.awsQueueRegion});

exports.readFromBulkIntakeQueue = async () => {
    const sqs = new AWS.SQS({ apiVersion: config.awsSqsApiVersion });
    const params = {
        QueueUrl: config.bulkIntakeQueueUrl,
        AttributeNames: [ 'All' ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: ['All'],
        WaitTimeSeconds: 20
    };
    const promise = new Promise((resolve, reject) => {
        sqs.receiveMessage(params, async (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                let messages = [];
                for(let message of data.Messages) {
                    messages.push(message);
                    await deleteMessage(message.ReceiptHandle);
                }
                resolve(data);
            }
        });
    })    
    return promise;
}

const deleteMessage = async handle => {
    const sqs = new AWS.SQS({ apiVersion: config.awsSqsApiVersion });
    const params = {
        QueueUrl: config.bulkIntakeQueueUrl,
        ReceiptHandle: handle
    };
    const promise = new Promise((resolve, reject) => {
        sqs.deleteMessage(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });        
    });
    return promise;
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
    const promise = new Promise((resolve, reject) => {
        sqs.sendMessage(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
    return promise;
}

