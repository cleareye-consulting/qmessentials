const MongoClient = require('mongodb');

const ObjectID = require('mongodb').ObjectID;

const config = require('../config');
const url = config.databaseEndpoint;
const dbName = config.databaseName;

module.exports = class repository {

    async saveRecord(record, type) {
        console.log('Saving record');
        console.log(record);
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });        
        if (record._id) {
            const id = record._id;
            delete record._id;
            await mongo.db(dbName).collection(type).replaceOne(
                {
                    _id: ObjectID(id)
                },
                record,
                {}
            )
        }
        else {
            await mongo.db(dbName).collection('metrics').insertOne(record);  
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

    async saveMetric(metric) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        if (metric._id) {
            await mongo.db(dbName).collection('metrics').updateOne(
                {
                    _id: ObjectID(metric._id)
                },
                {
                    $set: {
                        "availableQualifiers": metric.availableQualifiers,
                        "availableUnits": metric.availableUnits,
                        "resultType": metric.resultType,
                        "hasMultipleResults": metric.hasMultipleResults,
                        "industryStandards": metric.industryStandards,
                        "methodologyReferences": metric.methodologyReferences,
                        "isActive": metric.isActive
                    }
                },
                {}
            );
        }
        else {
            await mongo.db(dbName).collection('metrics').insertOne(metric);  
        }                
        mongo.close();
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

    async saveTestPlan(testPlan) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        if (testPlan._id) {
            await mongo.db(dbName).collection('testPlans').updateOne(
                {
                    _id: ObjectID(testPlan._id)
                },
                {
                    $set: {
                        "isActive": testPlan.isActive
                    }
                },
                {}
            );
        }
        else {
            await mongo.db(dbName).collection('testPlans').insertOne(testPlan);  
        }                
        mongo.close();
    }    

    async listTestPlanMetrics(filter) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        if (filter) {
            filter = JSON.parse(filter);
        }        
        if (filter && filter["_id"]) {
            filter["_id"] = ObjectID(filter["_id"]);
        }
        const testPlanMetrics = await (await mongo.db(dbName).collection('testPlanMetrics').find(filter || {})).toArray();
        mongo.close();
        return testPlanMetrics;
    }

    async saveTestPlanMetric(testPlanMetric) {
        const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
        // const testPlanMetricWithSameOrder = await mongo.db(dbName).collection('testPlanMetrics').findOne({ "order": testPlanMetric.order });
        // if (testPlanMetricWithSameOrder) {
        //     await mongo.db(dbName).collection('testPlanMetrics').updateMany(
        //         {
        //             "order": {"$gt": testPlanMetric.order},
        //             "$inc": {
        //                 "order": 1
        //             }
        //         }
        //     );
        // }
        if (testPlanMetric._id) {
            await mongo.db(dbName).collection('testPlanMetrics').updateOne(
                {
                    _id: ObjectID(testPlanMetric._id)
                },
                {
                    $set: {
                        "order": testPlanMetric.order,
                        "qualifiers": testPlanMetric.qualifiers,
                        "usageCode": testPlanMetric.usageCode,
                        "criteria": testPlanMetric.criteria,
                        "unit": testPlanMetric.unit,
                        "isNullable": testPlanMetric.isNullable,
                        "isActive": testPlanMetric.isActive
                    }
                },
                {}
            );
        }
        else {
            await mongo.db(dbName).collection('testPlanMetrics').insertOne(testPlanMetric);  
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
