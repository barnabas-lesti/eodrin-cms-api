const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');

const database = require('./database');
const routes = require('./routes');

const config = require('./common/config');
const logger = require('./common/logger');
const responder = require('./middlewares/responder');

const app = express();
logger.info(`Using config: "${ config.common.ENV }"`);

// Before routes middlewares
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setting up routes
for (const route of routes) {
	app.use('/api', route(express.Router()));
}

// After routes middlewares
app.use(responder());

// Connecting to the database and starting the server
database.connect();
const server = app.listen(config.common.PORT, () => {
	const { address, port } = server.address();
	logger.info(`API Server started: ${ address + port }`);
});

module.exports = app;
