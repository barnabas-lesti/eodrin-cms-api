// const ApiError = require('../common/ApiError');
const Service = require('./Service');

/**
 * Post logic related service.
 */
class PostService extends Service {
	/**
	 * Searches for a post with the provided postId.
	 *
	 * @param {number} postId Post ID
	 * @returns {Promise<Post>} Found post
	 * @throws {ApiError} Cause of the failure
	 */
	async getPost (/* postId */) {
		// TODO: implement changes
		return null;
	}

	/**
	 * Searches for posts with the provided query.
	 *
	 * @param {any} query Post query
	 * @returns {Promise<[Post]>} Found posts
	 * @throws {ApiError} Cause of the failure
	 */
	async getPosts (/* query */) {
		// TODO: implement changes
		return null;
	}
}

const postService = new PostService();
module.exports = postService;
