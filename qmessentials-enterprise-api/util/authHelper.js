const bcrypt = require('bcryptjs');
const config = require('../config');
const jwt = require('jsonwebtoken');
const util = require('util');

exports.isCorrectPassword = async function (user, submittedPassword) {
    return await bcrypt.compare(submittedPassword, user.password);
};

exports.hashPassword = async function (plainTextPassword) {
    return bcrypt.hash(plainTextPassword, 10);
}

exports.getToken = function (userId) {
    return jwt.sign(userId, config.jwtSecret);
}

exports.getAuthenticatedUserId = async function (authorizationHeader) {	
    const verify = util.promisify(jwt.verify);
    const token = /^Bearer (.*)$/.exec(authorizationHeader)[1];
    const secret = config.jwtSecret;
    const decodedValue = await verify(token, secret);
    return decodedValue;
        
}



function verifyLogin(req, res, next) {
		var token = /^Bearer (.*)$/.exec(req.headers.authorization)[1];
		if (!token) {
			console.log('Token not found');
			res.sendStatus(403);
		}
		else {
			jwt.verify(token, jwtSecret, (error, decodedValue) => {
				if (error) {
					console.log(error);
					res.sendStatus(403);
				}
				else {
					res.locals.userId = decodedValue;					
					next();
				}
			});
		}
	};