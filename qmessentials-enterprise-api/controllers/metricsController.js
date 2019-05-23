const repository = require('../repository');

exports.list = async function (req, res) {
    try {
        const db = new repository();
        const metrics = await db.listMetrics(req.query.filter);
        res.json(metrics);
    }  
    catch (error) {
        console.log(error);
        res.sendStatus(500);        
    }
};