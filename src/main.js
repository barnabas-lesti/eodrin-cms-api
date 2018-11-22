const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');

// const config = require('./config');
const database = require('./database');
// const logger = require('./logger');

const users = require('./routers/users');

const app = express();

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO
app.use('/api', users);

app.listen = function (...args) {
	database.connect();
	app.listen(...args);
};

module.exports = app;
