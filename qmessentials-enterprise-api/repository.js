const MongoClient = require('mongodb');

const ObjectID = require('mongodb').ObjectID;

const config = require('./config');
const url = config.databaseEndpoint;
const dbName = config.databaseName;

module.exports = class repository {

    async listMetrics(filter) {
        console.log(url);
        const mongo = await MongoClient.connect(url,{ useNewUrlParser: true });
        const metrics = await (await mongo.db(dbName).collection('metrics').find(filter || {})).toArray();
        mongo.close();
        return metrics;
    }
    
}
