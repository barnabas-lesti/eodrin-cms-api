const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const config = require('./common/config');
const logger = require('./common/logger');
const database = require('./database');
const responder = require('./middlewares/responder');
const routes = require('./routes');

class App {
	constructor () {
		this._app = express();
		logger.info(`Using config: "${ config.common.ENV }"`);

		this._app.use(cors());
		this._app.use(bodyParser.urlencoded({ extended: true }));
		this._app.use(bodyParser.json());
		this._app.use('/assets', express.static(`${ config.dataStore.BUCKET_PATH }/assets`));

		this._app.use('/api', morgan('common'));
		for (const route of routes) {
			this._app.use('/api', route(express.Router()));
		}

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
