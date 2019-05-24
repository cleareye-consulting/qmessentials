const express = require('express');
const path = require('path');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const addRequestId = require('express-request-id')();
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(addRequestId);

morgan.token('id', function getId(req) {
    return req.id
});

var loggerFormat = ':id [:date[web]] ":method :url" :status :response-time';

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: process.stderr
}));

app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const loginsRouter = require('./routes/logins');
const usersRouter = require('./routes/users');
const metricsRouter = require('./routes/metrics');


app.use('/', indexRouter);
app.use('/logins', loginsRouter);

//Routes beyond this point require authentication

const authHelper = require('./util/authHelper');

const extractUserId = function (req, res, next) {
    if (!req.headers.authorization) {
		console.warn('Authorization header not found');
        res.send(403);
    }
    res.locals.userId = authHelper.getAuthenticatedUserId(req.headers.authorization);
};

app.use(extractUserId);

app.use('/users', usersRouter);
app.use('/metrics', metricsRouter);

module.exports = app;
