const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const database = require('./database');
const routes = require('./routes');

const config = require('./common/config');
const logger = require('./common/logger');
const responder = require('./middlewares/responder');

class App {
	constructor () {
		this._app = express();
		logger.info(`Using config: "${ config.common.ENV }"`);

		// Before routes middlewares
		this._app.use(cors());
		this._app.use(bodyParser.urlencoded({ extended: true }));
		this._app.use(bodyParser.json());

		// Setting up routes
		for (const route of routes) {
			this._app.use('/api', route(express.Router()));
		}

		// After routes middlewares
		this._app.use(responder());
	}

	/**
	 * Starts the server.
	 *
	 * @returns {void}
	 */
	async start () {
		database.connect();
		const server = this._app.listen(config.common.PORT, () => {
			const { address, port } = server.address();
			logger.info(`API Server started: ${ address + port }`);
			return server;
		});
	}
}

const app = new App();
module.exports = app;
