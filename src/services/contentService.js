const fsExtra = require('fs-extra');
const path = require('path');

const ApiError = require('../common/ApiError');
const config = require('../common/config');
const logger = require('../common/logger');
const Service = require('./Service');

const FILE_RESOLVE_TOKEN = 'file://';
const ROOT_PAGES_FOLDER = 'pages';

/**
 * Content logic related service.
 */
class ContentService extends Service {
	constructor () {
		super();

		if (!(config.dataStore && config.dataStore.BUCKET_PATH !== null)) {
			throw new ApiError(ApiError.SERVICE_ERROR, '"config.dataStore.BUCKET_PATH" is not defined, to use this service, path to the bucket is required.');
		}
		this._PAGES_BUCKET_PATH = path.join(config.dataStore.BUCKET_PATH, ROOT_PAGES_FOLDER);
	}

	/**
	 * Returns a single page object based on the pagePath.
	 *
	 * @param {String} pagePath Path to the page
	 * @returns {Promise<Page>} The page promise object
	 */
	async getPageByPagePath (pagePath) {
		try {
			const page = await this._fetchPageFromBucket(pagePath);
			return page;
		} catch (error) {
			logger.error(error);
		}
	}

	/**
	 * Returns the pages that match the page types query criteria.
	 *
	 * @param {Array<String>} pageTypesQuery Types to filter
	 * @returns {Promise<Array<Page>>} Filtered pages
	 */
	async getPagesByPageTypes (pageTypesQuery = []) {
		try {
			const allPages = await this._fetchAllPagesFromBucket('/', true);
			const filteredPages = allPages.filter(page => {
				const pageTypes = page.meta && page.meta.types || [];
				for (const typeQuery of pageTypesQuery) {
					if (pageTypes.indexOf(typeQuery) !== -1) {
						return true;
					}
				}
				return false;
			});
			return filteredPages;
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
			const rawContentDescription = await fsExtra.readFile(`${ pageFilesPath }.json`, 'utf-8');
			const contentDescription = JSON.parse(rawContentDescription);
			const pageData = await this._resolveFileReferences(pageFullPath, contentDescription);
			const page = {
				path: pagePath.replace(/\\/g, '/'),
				...pageData,
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
	 * @param {Boolean} deepSearch Flag to search in inner directories
	 * @returns {Promise<Array<Page>>} Array of sub pages promise
	 */
	async _fetchAllPagesFromBucket (pagePath, deepSearch = false) {
		const pageFullPath = path.join(this._PAGES_BUCKET_PATH, pagePath);
		try {
			const subPageIds = (await fsExtra.readdir(pageFullPath)).filter(async item => {
				const stats = await fsExtra.lstat(path.join(pageFullPath, item));
				return stats.isDirectory();
			});
			const pagePromises = [];
			for (const subPageId of subPageIds) {
				const subPagePath = path.join(pagePath, subPageId);
				pagePromises.push(this._fetchPageFromBucket(subPagePath));
				if (deepSearch) {
					pagePromises.push(this._fetchAllPagesFromBucket(subPagePath, true));
				}
			}
			const resolvedPagePromises = (await Promise.all(pagePromises)).filter(page => page !== null);
			const pages = [];
			for (const resolvedPagePromise of resolvedPagePromises) {
				if (Array.isArray(resolvedPagePromise)) {
					pages.push(...resolvedPagePromise);
				} else {
					pages.push(resolvedPagePromise);
				}
			}
			return pages;
		} catch (error) {
			if (!error.code === 'ENOENT') {
				logger.error(error);
			}
			return null;
		}
	}

	/**
	 * Looks for file references in the description and loads the content.
	 *
	 * @param {String} rootPath Root path of the resolve entry
	 * @param {Object} description Object to parse for file tokens
	 * @returns {Promise<Object>} The resolved object
	 */
	async _resolveFileReferences (rootPath, description) {
		const resolvedObject = {};
		for (const prop in description) {
			if (description.hasOwnProperty(prop)) {
				const propValue = description[prop];
				if (typeof propValue === 'object') {
					resolvedObject[prop] = Array.isArray(propValue) ? propValue : await this._resolveFileReferences(rootPath, propValue);
				} else if (propValue.startsWith(FILE_RESOLVE_TOKEN)) {
					const filePath = propValue.substring(FILE_RESOLVE_TOKEN.length);
					try {
						const resolvedRawData = await fsExtra.readFile(path.join(rootPath, filePath), 'utf-8');
						if (!filePath.endsWith('.json')) {
							resolvedObject[prop] = resolvedRawData;
						} else {
							resolvedObject[prop] = await this._resolveFileReferences(rootPath, JSON.parse(resolvedRawData));
						}
					} catch (error) {
						if (!error.code === 'ENOENT') {
							logger.error(error);
						}
						resolvedObject[prop] = null;
					}
				} else {
					resolvedObject[prop] = propValue;
				}
			}
		}
		return resolvedObject;
	}
}

const contentService = new ContentService();
module.exports = contentService;
