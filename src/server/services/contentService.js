import path from 'path';
import fsExtra from 'fs-extra';

import config from '../common/config';
import logger from '../common/logger';
import Service from './Service';

const PAGES_BUCKET_PATH = path.join(config.dataStore.BUCKET_PATH, 'pages');

/**
 * Content logic related service.
 */
class ContentService extends Service {
	/**
	 * Searches for a post with the provided postId.
	 *
	 * @param {String} pagePath Path to the page
	 * @returns {Promise<Page>} Found page
	 * @throws {ApiError} Cause of the failure
	 */
	async getPage (pagePath) {
		try {
			const page = await this._fetchPage(pagePath);
			return page;
		} catch (error) {
			logger.error(error);
		}
	}

	/**
	 * Retrieves global settings for the application.
	 * @returns {Object} Settings object
	 */
	async getSettings () {
		const settingsJsonPath = `${ config.dataStore.BUCKET_PATH }/settings.json`;
		try {
			const settings = {
				baseHref: config.common.VIEW_PATH,
				...JSON.parse(await fsExtra.readFile(settingsJsonPath, 'utf-8')),
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
	 * @param {Object} options Options for the function
	 * @returns {Page} Page object
	 */
	async _fetchPage (pagePath, options = {}) {
		const pagePathFragments = pagePath.split(/[/\\]/g);
		const pageId = pagePathFragments[pagePathFragments.length - 1];
		const pageFullPath = path.join(PAGES_BUCKET_PATH, pagePath);
		const pageFilesPath = path.join(pageFullPath, pageId);
		try {
			const [ mdContent, rawMetaData, subPages ] = await Promise.all([
				fsExtra.readFile(`${ pageFilesPath }.md`, 'utf-8'),
				fsExtra.readFile(`${ pageFilesPath }.json`, 'utf-8'),
				!options.dontGetSubPages ? this._fetchSubPages(pagePath) : Promise.resolve(),
			]);
			const content = mdContent;
			const metaData = JSON.parse(rawMetaData);

			const page = {
				pagePath: pagePath.replace(/\\/g, '/'),
				content,
				subPages,
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
	 * @returns {Array<Page>} Array of sub pages
	 */
	async _fetchSubPages (pagePath) {
		const pageFullPath = path.join(PAGES_BUCKET_PATH, pagePath);
		const subPageIds = (await fsExtra.readdir(pageFullPath)).filter(item => !(item.endsWith('.md') || item.endsWith('.json')));
		const subPagePromises = [];
		for (const subPageId of subPageIds) {
			const subPagePath = path.join(pagePath, subPageId);
			subPagePromises.push(this._fetchPage(subPagePath, { dontGetSubPages: true }));
		}
		const subPages = (await Promise.all(subPagePromises)).filter(subPage => subPage !== null);
		return subPages;
	}
}

const contentService = new ContentService();
export default contentService;
