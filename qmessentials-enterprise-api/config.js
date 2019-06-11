require('dotenv').config();

const config = {
    databaseEndpoint: process.env.DATABASE_ENDPOINT,
    databaseName: process.env.DATABASE_NAME,
    jwtSecret: process.env.JWT_SECRET
};

module.exports = config;