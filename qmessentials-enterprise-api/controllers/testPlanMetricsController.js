const repository = require('../util/repository');

exports.list = async function (req, res) {
    try {
        const db = new repository();
        const testPlans = await db.listTestPlanMetrics(req.query.filter);
        res.json(testPlans);
    }  
    catch (error) {
        console.error(error);
        res.sendStatus(500);        
    }
};

exports.save = async function (req, res) {
    try {
        const db = new repository();
        await db.saveTestPlanMetric(req.body);
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};