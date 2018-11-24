const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');

const config = require('./config');
const database = require('./database');
const logger = require('./logger');

const responder = require('./middlewares/responder');

const app = express();

// Before routes middlewares
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const routesDir = path.join(__dirname, 'routes');
// eslint-disable-next-line no-sync
const files = fs.readdirSync(routesDir);
for (const file of files) {
	app.use('/api', require(path.join(routesDir, file)));
}

// After routes middlewares
app.use(responder.middleware());

// Connecting to the database and starting the server
database.connect();
const server = app.listen(config.PORT, () => {
	const { address, port } = server.address();
	logger.info(`API Server started: ${ address + port }`);
});

module.exports = app;
