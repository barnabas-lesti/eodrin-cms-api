const ifUserIsNotLoggedIn = require('../common/ifUserIsNotLoggedIn');
const { requester, expect } = require('../suite');

const ApiError = require('../../src/ApiError');
const database = require('../../src/database');
const Post = require('../../src/models/Post');
const authService = require('../../src/services/authService');
const postService = require('../../src/services/postService');

describe('POSTS', () => {
	const existingPost = {
		content: 'Initial content.',
		postId: 1000,
		postType: 'article',
	};
	const newPost = {
		postId: 1999,
		postType: 'article',
	};
	const requiredFieldsMissingPost = {
		postId: 2999,
	};
	const updatedPost = {
		content: 'Updated content here!',
		postId: 3999,
		postType: 'tutorial',
	};

	let authToken;

	beforeEach(async () => {
		await database.clearCollection(Post);
		await postService.createPost(existingPost);
		authToken = await authService.createAuthToken('test@mail.com');
	});

	afterEach(async () => {
		await database.clearCollection(Post);
	});

	describe('POST /api/posts', () => {
		it('should: return the created post', done => {
			requester
				.post('/api/posts')
				.set('Authorization', `Bearer ${ authToken }`)
				.send(newPost)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.postId).to.equal(newPost.postId);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.post('/api/posts'));

		it(`if identifier is taken: should: have status 400, "type" field with value "${ ApiError.IDENTIFIER_TAKEN }"`, done => {
			requester
				.post('/api/posts')
				.set('Authorization', `Bearer ${ authToken }`)
				.send(existingPost)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(400);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.IDENTIFIER_TAKEN);
					done();
				});
		});

		it(`if required fields are missing: should: have status 400, "type" field with value "${ ApiError.REQUIRED_FIELDS_MISSING }"`, done => {
			requester
				.post('/api/posts')
				.set('Authorization', `Bearer ${ authToken }`)
				.send(requiredFieldsMissingPost)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(400);
					expect(res.body).to.be.an('object');
					expect(res.body.type).to.equal(ApiError.REQUIRED_FIELDS_MISSING);
					done();
				});
		});
	});

	describe('GET /api/posts', () => {
		it('should: return an array of posts, have status 200, body be an array, contain 1 post', done => {
			requester
				.get('/api/posts')
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('array');
					expect(res.body.length).to.equal(1);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.get('/api/posts'));
	});

	describe('GET /api/posts/:postId', () => {
		it('should: return the post, have status 200', done => {
			requester
				.get(`/api/posts/${ existingPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.get(`/api/posts/${ existingPost.postId }`));

		it('if posts was not found, should: have status 404', done => {
			requester
				.get(`/api/posts/${ newPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('PATCH /api/posts/:postId', () => {
		it('should: update the post, return the updated post', done => {
			requester
				.patch(`/api/posts/${ existingPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.send(updatedPost)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.content).to.not.equal(existingPost.content);
					expect(res.body.content).to.equal(updatedPost.content);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.patch(`/api/posts/${ existingPost.postId }`));

		it('if post was not found, should: have status 404', done => {
			requester
				.patch(`/api/posts/${ newPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('DELETE /api/posts/:postId', () => {
		it('should delete a post without any errors', done => {
			requester
				.delete(`/api/posts/${ existingPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res).to.have.status(200);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.delete(`/api/posts/${ existingPost.postId }`));

		it('if post was not found, should: have status 404', done => {
			requester
				.delete(`/api/posts/${ newPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});
});
