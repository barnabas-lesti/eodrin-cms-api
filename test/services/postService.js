const { assert, expect } = require('chai');

const ApiError = require('../../src/ApiError');
const database = require('../../src/database');
const postService = require('../../src/services/postService');

describe('PostService', () => {
	const existingPostId = 234;
	const existingPostPostType = 'article';

	before(async () => {
		await database.connect();
		await database.clearCollection(postService.getModel());
	});

	after(async () => {
		await database.clearCollection(postService.getModel());
		await database.disconnect();
	});

	describe('createPost', () => {
		it('should save a new post to the database and return a promise with the '
			+ 'created post if the provided post object was valid', async () => {
			const validPostToCreate = {
				postId: existingPostId,
				postType: existingPostPostType,
			};
			const createdPost = await postService.createPost(validPostToCreate);
			assert.isObject(createdPost);
		});
		it('should throw an error with type REQUIRED_FIELDS_MISSING if the provided '
			+ 'post object has missing required properties', async () => {
			const postWithFieldsMissing = {
				postId: 232,
			};
			let post = null;
			let fieldsMissingError;
			try {
				post = await postService.createPost(postWithFieldsMissing);
			} catch (error) {
				fieldsMissingError = error;
			}
			assert.isNull(post);
			assert.isDefined(fieldsMissingError);
			expect(fieldsMissingError.type).to.equal(ApiError.REQUIRED_FIELDS_MISSING);
		});
		it('should throw an error with type IDENTIFIER_TAKEN if the provided '
			+ 'posts postId is already taken', async () => {
			const postWithAlreadyTakenPostId = {
				postId: existingPostId,
				postType: existingPostPostType,
			};
			let post = null;
			let idTakenError;
			try {
				post = await postService.createPost(postWithAlreadyTakenPostId);
			} catch (error) {
				idTakenError = error;
			}
			assert.isNull(post);
			assert.isDefined(idTakenError);
			expect(idTakenError.type).to.equal(ApiError.IDENTIFIER_TAKEN);
		});
	});

	describe('getPost', () => {
		it('should return a promise with the post if found', async () => {
			const existingPostPostId = existingPostId;
			let post;
			let anErrorThatShouldNotBeHere = null;
			try {
				post = await postService.getPost(existingPostPostId);
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isDefined(post);
			expect(post.postId).to.equal(existingPostPostId);
		});
		it('should return a promise with null if post was not found', async () => {
			const nonExistingPostPostId = -10;
			let post;
			let anErrorThatShouldNotBeHere = null;
			try {
				post = await postService.getPost(nonExistingPostPostId);
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isNull(post);
		});
	});

	describe('getPosts', () => {
		it('should return a promise with an array containing posts', async () => {
			const existingPostPostId = existingPostId;
			let posts;
			let anErrorThatShouldNotBeHere = null;
			try {
				posts = await postService.getPosts({ postId: existingPostPostId });
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isArray(posts);
			expect(posts.length).to.equal(1);
		});
		it('should return a promise with an empty array if no posts are found with the given query', async () => {
			const nonExistingPostPostId = -10;
			let posts;
			let anErrorThatShouldNotBeHere = null;
			try {
				posts = await postService.getPosts({ postId: nonExistingPostPostId });
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isArray(posts);
			expect(posts.length).to.equal(0);
		});
	});

	describe('updatePost', () => {
		it('should update a post and return a promise with the post if the update '
			+ 'is valid', async () => {
			const postId = existingPostId;
			const update = {
				content: 'Updated Post!',
			};
			let updatedPost;
			let anErrorThatShouldNotBeHere = null;
			try {
				updatedPost = await postService.updatePost(postId, update);
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isDefined(updatedPost);
			expect(updatedPost.content).to.equal(update.content);
		});
		it('should not update readonly fields like the postId', async () => {
			const postId = existingPostId;
			const update = {
				content: 'Updated the post again...',
				postId: -256,
			};
			let updatedPost;
			let anErrorThatShouldNotBeHere = null;
			try {
				updatedPost = await postService.updatePost(postId, update);
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isDefined(updatedPost);
			expect(updatedPost.postId).to.equal(postId);
		});
		it('should return a promise with null if post was not found', async () => {
			const nonExistingPostPostId = -10;
			let success;
			let anErrorThatShouldNotBeHere = null;
			try {
				success = await postService.updatePost(nonExistingPostPostId, {});
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isNull(success);
		});
	});

	describe('deletePost', () => {
		it('should delete a post and return a promise with boolean true', async () => {
			const existingPostPostId = existingPostId;
			let success;
			let anErrorThatShouldNotBeHere = null;
			try {
				success = await postService.deletePost(existingPostPostId);
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isDefined(success);
			expect(success).to.equal(true);
		});
		it('should return a promise with null if post was not found', async () => {
			const nonExistingPostPostId = -134;
			let success;
			let anErrorThatShouldNotBeHere = null;
			try {
				success = await postService.deletePost(nonExistingPostPostId);
			} catch (error) {
				anErrorThatShouldNotBeHere = error;
			}
			assert.isNull(anErrorThatShouldNotBeHere);
			assert.isNull(success);
		});
	});
});
