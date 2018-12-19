const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');

const config = require('./common/config');
const logger = require('./common/logger');
const database = require('./database');

const responderMiddleware = require('./middlewares/responderMiddleware');


const app = express();
logger.info(`Using config: "${ config.common.ENV }"`);

// Before routes middlewares
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load routes
const routesDir = path.join(__dirname, 'routes');
/* eslint-disable-next-line no-sync */
const files = fs.readdirSync(routesDir);
for (const fileName of files) {
	if (fileName.endsWith('.js') && fileName[0] !== '_') {
		const route = require(path.join(routesDir, fileName));
		app.use('/api', route(express.Router()));
	}
}

// After routes middlewares
app.use(responderMiddleware());

// Connecting to the database and starting the server
database.connect();
const server = app.listen(config.common.PORT, () => {
	const { address, port } = server.address();
	logger.info(`API Server started: ${ address + port }`);
});

module.exports = app;
