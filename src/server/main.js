import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';

import database from './database';
import apiRoutes from './routes/api';
import viewRoutes from './routes/view';

import config from './common/config';
import logger from './common/logger';
import responder from './middlewares/responder';

const app = express();
logger.info(`Using config: "${ config.common.ENV }"`);

// Before routes middlewares
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API routes
for (const route of apiRoutes) {
	app.use('/api', route(express.Router()));
}

// View routes
for (const route of viewRoutes) {
	app.use('/v', route(express.Router()));
}

// After routes middlewares
app.use(responder());

// Connecting to the database and starting the server
database.connect();
const server = app.listen(config.common.PORT, () => {
	const { address, port } = server.address();
	logger.info(`API Server started: ${ address + port }`);
});

export default app;
