const repository = require('../util/repository');
const authHelper = require('../util/authHelper');

exports.logIn = async function (req, res) {
    try {
        const db = new repository();
        const user = await db.selectUser(req.body.userId);
        if (!(await authHelper.isCorrectPassword(user, req.body.password))) {
            console.warn('Login failure for user ' + req.body.userId);
            res.sendStatus(403);
        }
        const token = authHelper.getToken(user.userId);
        res.json(token);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

exports.select = async function (req, res) {
    try {
        const db = new repository();
        const user = await db.selectUser(req.body.userId);
        delete user.password;
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

exports.save = async function (req, res) {
    try {
        const db = new repository();
        const user = req.body;
        user.password = await authHelper.hashPassword(user.password);
        await db.saveUser(user);
        res.sendStatus(200);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};