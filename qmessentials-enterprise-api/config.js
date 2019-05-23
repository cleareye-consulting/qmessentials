require('dotenv').config();

const config = {
    databaseEndpoint: process.env.DATABASE_ENDPOINT,
    databaseName: process.env.DATABASE_NAME,
};

module.exports = config;