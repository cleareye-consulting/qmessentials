const MongoClient = require('mongodb');

const ObjectID = require('mongodb').ObjectID;

const config = require('../config');
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
        if (metric._id) {
            metric._id = ObjectID(metric._id);
            await mongo.db(dbName).collection('metrics').updateOne(metric._id, metric, {});
        }
        else {
            await mongo.db(dbName).collection('metrics').insertOne(metric);  
        }                
        mongo.close();
    }

    async selectUser(userId) {
        const mongo = await MongoClient.connect(url, {useNewUrlParser: true});
	    const user = await mongo.db(dbName).collection('users').findOne({ userId: userId });
        mongo.close();
        return user;
    }

    async saveUser(user) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        if (user._id) {
            user._id = ObjectID(user._id);
            await mongo.db(dbName).collection('users').updateOne(user._id, user, {});
        }
        else {
            await mongo.db(dbName).collection('users').insertOne(user);
        }
        
        mongo.close();
    }
    
}
