const { assert } = require('chai');

const contentService = require('../../src/services/contentService');

describe('ContentService', () => {
	describe('_fetchPageFromBucket', () => {
		it('should return a page object if page exists with the given path', async () => {
			const page = await contentService._fetchPageFromBucket('/home');
			assert.isDefined(page);
			assert.isNotNull(page);
		});

		it('should return null if page does not exist', async () => {
			const page = await contentService._fetchPageFromBucket('not-here');
			assert.isNull(page);
		});

		it('should resolve "file://" described fields', async () => {
			const page = await contentService._fetchPageFromBucket('/home');
			assert.isDefined(page);
			assert.isNotNull(page);
			assert.notEqual(page.template.data.mainContent, 'file://main-content.md');
		});
	});

	describe('getSettings', () => {
		it('should return a settings object', async () => {
			const settings = await contentService.getSettings();
			assert.isDefined(settings);
		});
	});
});
