require('dotenv').config();

const config = {
    databaseEndpoint: process.env.DATABASE_ENDPOINT,
    databaseName: process.env.DATABASE_NAME,
    jwtSecret: process.env.JWT_SECRET,
    awsQueueRegion: process.env.AWS_QUEUE_REGION,
    awsSqsApiVersion: process.env.AWS_SQS_API_VERSION,
    bulkIntakeQueueUrl: process.env.BULK_INTAKE_QUEUE_URL,
    toReportingQueueUrl: process.env.TO_REPORTING_QUEUE_URL
};

module.exports = config;