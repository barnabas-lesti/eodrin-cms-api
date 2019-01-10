const { assert } = require('chai');

const contentService = require('../../src/services/contentService');

describe('ContentService', () => {

	describe('getPost', () => {
		it('should return a post object if post exists', async () => {
			const existingPostId = 'article-1';
			const existingPostGroupId = 'articles';
			const existingPost = await contentService.getPost(existingPostId, existingPostGroupId);
			assert.isDefined(existingPost);
		});

		it('should return null if post does not exists', async () => {
			const nonExistingPostId = 'article-10';
			const existingPostGroupId = 'articles';
			const notAPostButNull = await contentService.getPost(nonExistingPostId, existingPostGroupId);
			assert.isNull(notAPostButNull);
		});
	});

	describe('getPosts', () => {
		it('should return an array of post objects of the provided postGroup type if posts exists', async () => {
			const existingPostGroupId = 'articles';
			const existingPosts = await contentService.getPosts(existingPostGroupId);
			assert.isDefined(existingPosts);
			assert.isArray(existingPosts);
		});

		it('should return an array of postGroups if postGroupId is not provided and postGroups exist', async () => {
			const postGroups = await contentService.getPosts();
			assert.isDefined(postGroups);
			assert.isArray(postGroups);
		});

		it('should return null if posts were not found', async () => {
			const nonExistingPostGroupId = 'im-not-here';
			const notPostsButNull = await contentService.getPosts(nonExistingPostGroupId);
			assert.isNull(notPostsButNull);
		});
	});

	describe('getStaticPage', () => {
		it('should return a page object if page exists', async () => {
			const existingPageId = 'home';
			const existingPage = await contentService.getStaticPage(existingPageId);
			assert.isDefined(existingPage);
		});

		it('should return nul if page does not exists', async () => {
			const nonExistingPageId = 'not-home';
			const thisIsABigNull = await contentService.getStaticPage(nonExistingPageId);
			assert.isNull(thisIsABigNull);
		});
	});

	describe('getSettings', () => {
		it('should return a settings object', async () => {
			const settings = await contentService.getSettings();
			assert.isDefined(settings);
		});
	});
});
