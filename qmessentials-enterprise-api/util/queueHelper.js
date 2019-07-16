const AWS = require('aws-sdk');
const config = require('../config');
const Bull = require('bull');
const repository = require('./repository');

AWS.config.update({ region: config.awsQueueRegion });

exports.initiateWriteQueue = () => {
    writeQueue = new Bull('write-queue');
    const db = new repository();
    writeQueue.process(async job => {
        try {
            await db.saveRecord(job.data.content, job.data.type);
            await this.writeToReportingDatabaseQueue(job.data.type, job.data.content);
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }
    });
}

exports.addToWriteQueue = message => {
    writeQueue.add(message);
}

exports.initiateBulkIntake = () => {
    const getBulkInserts = async () => {
        try {
            const messages = await this.readFromBulkIntakeQueue();            
            if (messages) {
                for (let message of messages) {                    
                    writeQueue.add({ type: message.MessageAttributes.type.StringValue, content: JSON.parse(message.Body) });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        setImmediate(getBulkInserts);
    }
    setImmediate(getBulkInserts);
}

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
                if (!data.Messages) {
                    resolve();
                }
                else {
                    let messages = [];
                    for (let message of data.Messages) {
                        messages.push(message);
                        await deleteMessage(message.ReceiptHandle);
                    }
                    resolve(data.Messages);
                }
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
            "type": {
                DataType: "String",
                StringValue: messageType
            }
        },
        MessageBody: JSON.stringify(message),
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

