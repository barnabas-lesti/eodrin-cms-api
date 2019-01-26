const fsExtra = require('fs-extra');
const path = require('path');

const ApiError = require('../common/ApiError');
const config = require('../common/config');
const logger = require('../common/logger');
const Service = require('./Service');

const PAGES_FOLDER = 'pages';

/**
 * Page logic related service.
 */
class ContentService extends Service {
	constructor () {
		super();

		if (!(config.dataStore && config.dataStore.BUCKET_PATH !== null)) {
			throw new ApiError(ApiError.SERVICE_ERROR, '"config.dataStore.BUCKET_PATH" is not defined, to use this service, path to the bucket is required.');
		}
		this._PAGES_BUCKET_PATH = path.join(config.dataStore.BUCKET_PATH, PAGES_FOLDER);
	}

	/**
	 * Returns a page object based on the page path.
	 *
	 * @param {String} pagePath Path to the page
	 * @returns {Promise<Page>} The page promise object
	 */
	async getPageFromBucketByPagePath (pagePath) {
		try {
			const page = await this._fetchPageFromBucket(pagePath);
			return page;
		} catch (error) {
			logger.error(error);
		}
	}

	/**
	 * Returns a list of pages based on provided page path.
	 *
	 * @param {String} pagePath Path to the parent page
	 * @returns {Promise<Array<Page>>} The pages array promise
	 */
	async getSubPagesFromBucketByPagePath (pagePath) {
		try {
			const subPages = await this._fetchSubPagesFromBucket(pagePath);
			return subPages;
		} catch (error) {
			logger.error(error);
		}
	}

	/**
	 * Retrieves global settings for the application.
	 *
	 * @returns {Promise<Object>} Settings object promise
	 */
	async getSettings () {
		const settingsJsonPath = `${ config.dataStore.BUCKET_PATH }/settings.json`;
		try {
			const settingsFromBucket = JSON.parse(await fsExtra.readFile(settingsJsonPath, 'utf-8'));
			const settings = {
				baseHref: config.common.VIEW_PATH,
				...settingsFromBucket,
			};
			return settings;
		} catch (error) {
			if (error.code !== 'ENOENT') {
				logger.error(error);
			}
			return null;
		}
	}

	/**
	 * Fetches the page from the bucket, based on the provided page path.
	 *
	 * @param {String} pagePath Path to the page
	 * @returns {Promise<Page>} Page promise
	 */
	async _fetchPageFromBucket (pagePath) {
		const pagePathFragments = pagePath.split(/[/\\]/g);
		const pageId = pagePathFragments[pagePathFragments.length - 1];
		const pageFullPath = path.join(this._PAGES_BUCKET_PATH, pagePath);
		const pageFilesPath = path.join(pageFullPath, pageId);
		try {
			const [ content, rawMetaData ] = await Promise.all([
				fsExtra.readFile(`${ pageFilesPath }.md`, 'utf-8'),
				fsExtra.readFile(`${ pageFilesPath }.json`, 'utf-8'),
			]);

			const metaData = JSON.parse(rawMetaData);
			const page = {
				content,
				pagePath: pagePath.replace(/\\/g, '/'),
				...metaData,
			};
			return page;
		} catch (error) {
			if (!error.code === 'ENOENT') {
				logger.error(error);
			}
			return null;
		}
	}

	/**
	 * Fetches sub pages for the given parent page.
	 *
	 * @param {String} pagePath Path to the parent page
	 * @returns {Promise<Array<Page>>} Array of sub pages promise
	 */
	async _fetchSubPagesFromBucket (pagePath) {
		const pageFullPath = path.join(this._PAGES_BUCKET_PATH, pagePath);
		try {
			const subPageIds = (await fsExtra.readdir(pageFullPath)).filter(item => !(item.endsWith('.md') || item.endsWith('.json')));
			const subPagePromises = [];
			for (const subPageId of subPageIds) {
				const subPagePath = path.join(pagePath, subPageId);
				subPagePromises.push(this._fetchPageFromBucket(subPagePath));
			}
			const subPages = (await Promise.all(subPagePromises)).filter(subPage => subPage !== null);
			return subPages;
		} catch (error) {
			if (!error.code === 'ENOENT') {
				logger.error(error);
			}
			return null;
		}

	}
}

const contentService = new ContentService();
module.exports = contentService;
