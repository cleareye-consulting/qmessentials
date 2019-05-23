const MongoClient = require('mongodb');

const ObjectID = require('mongodb').ObjectID;

const config = require('./config');
const url = config.databaseEndpoint;
const dbName = config.databaseName;

module.exports = class repository {

    async listMetrics(filter) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        if (filter) {
            filter = JSON.parse(filter);
        }        
        if (filter && filter["_id"]) {
            filter["_id"] = ObjectID(filter["_id"]);
        }
        console.log(filter);
        const metrics = await (await mongo.db(dbName).collection('metrics').find(filter || {})).toArray();
        mongo.close();
        return metrics;
    }

    async saveMetric(metric) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        metric._id = ObjectID(metric._id);
        await mongo.db(dbName).collection('metrics').save(metric);
        mongo.close();
    }
    
}
