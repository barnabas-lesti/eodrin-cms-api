const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');

const config = require('./config');
const database = require('./database');
const logger = require('./logger');

// TODO
const users = require('./routes/users');

const app = express();

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO
app.use('/api', users);

// database.connect();
// app.listen(config.PORT);
// logger.info(`API listening on port ${ config.PORT }`);

module.exports = app;
