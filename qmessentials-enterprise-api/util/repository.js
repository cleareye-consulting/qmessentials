const MongoClient = require('mongodb');

const ObjectID = require('mongodb').ObjectID;

const config = require('../config');
const url = config.databaseEndpoint;
const dbName = config.databaseName;

module.exports = class repository {

    async saveRecord(record, type) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });        
        const localCopy = Object.assign({}, record);
        if (localCopy._id) {
            const id = localCopy._id;
            delete localCopy._id;
            await mongo.db(dbName).collection(type).replaceOne(
                {
                    _id: ObjectID(id)
                },
                localCopy,
                {}
            )
        }
        else {
            await mongo.db(dbName).collection(type).insertOne(localCopy);  
        }                
        mongo.close();
    }

    async listMetrics(filter) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        if (filter) {
            filter = JSON.parse(filter);
        }        
        if (filter && filter["_id"]) {
            filter["_id"] = ObjectID(filter["_id"]);
        }
        const metrics = await (await mongo.db(dbName).collection('metrics').find(filter || {})).toArray();
        mongo.close();
        return metrics;
    }

    async listTestPlans(filter) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        if (filter) {
            filter = JSON.parse(filter);
        }        
        if (filter && filter["_id"]) {
            filter["_id"] = ObjectID(filter["_id"]);
        }
        const testPlans = await (await mongo.db(dbName).collection('testPlans').find(filter || {})).toArray();
        mongo.close();
        return testPlans;
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
            await mongo.db(dbName).collection('users').updateOne(
                {
                    _id: ObjectID(user._id),
                },
                {
                    $set: {
                        "userId": user.userId,
                        "password": user.password,
                        "roles": user.roles,
                        "isActive": user.isActive
                    }
                },
                {}
            );
        }
        else {
            await mongo.db(dbName).collection('users').insertOne(user);
        }
        
        mongo.close();
    }
    
}
