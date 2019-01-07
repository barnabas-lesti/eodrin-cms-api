import fs from 'fs-extra';
import path from 'path';

import ApiError from '../common/ApiError';
import config from '../common/config';
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
			throw new ApiError(ApiError.SERVICE_ERROR);
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
				fs.readFile(`${ pageFilesPath }.md`, 'utf-8'),
				fs.readFile(`${ pageFilesPath }.json`, 'utf-8'),
				!options.dontGetSubPages ? this._fetchSubPages(pagePath) : Promise.resolve(),
			]);
			const content = mdContent;
			const metaData = JSON.parse(rawMetaData);

			const page = {
				content,
				subPages,
				...metaData,
			};
			return page;
		} catch (error) {
			if (error.code === 'ENOENT') {
				return null;
			}
			throw new ApiError(ApiError.SERVICE_ERROR);
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
		const subPageIds = (await fs.readdir(pageFullPath)).filter(item => !(item.endsWith('.md') || item.endsWith('.json')));
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
