const ApiError = require('../ApiError');
const CRUDService = require('./CRUDService');
const Post = require('./models/Post');

/**
 * Post logic related service.
 */
class PostService extends CRUDService {
	constructor () {
		super(Post);

		this.requiredFields = [
			'postId',
			'postType',
		];
		this.readOnlyFields = [
			'postId',
		];
	}

	/**
	 * Creates a new post and saves it in the database.
	 *
	 * @param {Post} post Post to save
	 * @returns {Promise<Post>} Created post
	 * @throws {ApiError} Cause of the failure
	 */
	async createPost (post) {
		try {
			const createdPost = await Post.create(post);
			return createdPost;
		} catch (error) {
			this.logger.error(error);
			if (error.code === 11000) {
				throw new ApiError(ApiError.IDENTIFIER_TAKEN);
			} else if (error.message && error.message.indexOf('is required') !== -1) {
				throw new ApiError(ApiError.REQUIRED_FIELDS_MISSING, this.requiredFields);
			} else {
				throw new ApiError(ApiError.SERVICE_ERROR);
			}
		}
	}

	/**
	 * Searches for a post with the provided postId.
	 *
	 * @param {string} postId Post ID
	 * @returns {Promise<Post>} Found post
	 * @throws {ApiError} Cause of the failure
	 */
	async getPost (postId) {
		try {
			const post = await Post.findOne({ postId });
			return post;
		} catch (error) {
			this.logger.error(error);
			throw new ApiError(ApiError.SERVICE_ERROR);
		}
	}

	/**
	 * Searches for posts with the provided query.
	 *
	 * @param {any} query Post query
	 * @returns {Promise<[Post]>} Found posts
	 * @throws {ApiError} Cause of the failure
	 */
	async getPosts (query) {
		try {
			const posts = await Post.find(query);
			return posts;
		} catch (error) {
			this.logger.error(error);
			throw new ApiError(ApiError.SERVICE_ERROR);
		}
	}

	/**
	 * Update the post with the provided data.
	 *
	 * @param {string} postId Post ID
	 * @param {Post} update Updated post data
	 * @returns {Promise<Post>} Updated post
	 * @throws {ApiError} Cause of the failure
	 */
	async updatePost (postId, update) {
		const sanitizedUpdate = this.sanitizeUpdate(update);
		try {
			const updatedPost = await Post.findOneAndUpdate({ postId }, sanitizedUpdate, { new: true });
			return updatedPost;
		} catch (error) {
			this.logger.error(error);
			throw new ApiError(ApiError.SERVICE_ERROR);
		}
	}

	/**
	 * Deletes a post based on the provided postId.
	 *
	 * @param {string} postId Post ID
	 * @returns {Promise<true|null>} True if post was found, null if not
	 * @throws {ApiError} Cause of the failure
	 */
	async deletePost (postId) {
		try {
			const result = await Post.findOneAndDelete({ postId });
			return result !== null ? true : null;
		} catch (error) {
			this.logger.error(error);
			throw new ApiError(ApiError.SERVICE_ERROR);
		}
	}
}

const postService = new PostService();
module.exports = postService;
