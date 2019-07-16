const repository = require('../util/repository');

exports.list = async function (req, res) {
    try {
        const db = new repository();
        const metrics = await db.listMetrics(req.query.filter);
        res.json(metrics);
    }  
    catch (error) {
        console.error(error);
        res.sendStatus(500);        
    }
};

exports.save = async function (req, res) {
    try {
        res.locals.queueHelper.addToWriteQueue({ type: 'metrics', content: req.body });
        res.sendStatus(200);
    }  
    catch (error) {
        console.error(error);
        res.sendStatus(500);        
    }
}