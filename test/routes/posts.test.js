const ifUserIsNotLoggedIn = require('../common/ifUserIsNotLoggedIn');
const { requester, expect } = require('../suite');

const ApiError = require('../../src/ApiError');
const Post = require('../../src/models/Post');
const authService = require('../../src/services/authService');
const postService = require('../../src/services/postService');

const postsFixture = {
	existingPost: {
		content: 'Initial content.',
		postId: 1000,
		postType: 'article',
	},
	newPost: {
		postId: 1999,
		postType: 'article',
	},
	requiredFieldsMissingPost: {
		postId: 2999,
	},
	updatedPost: {
		content: 'Updated content here!',
		postId: 3999,
		postType: 'tutorial',
	},
};

describe('POSTS', () => {
	let authToken;

	beforeEach(async () => {
		await Post.deleteMany().exec();
		await postService.createPost(postsFixture.existingPost);
		authToken = await authService.createAuthToken('test@mail.com');
	});

	afterEach(async () => {
		await Post.deleteMany().exec();
	});

	describe('POST /api/posts', () => {
		it('should: return the created post', done => {
			requester
				.post('/api/posts')
				.set('Authorization', `Bearer ${ authToken }`)
				.send(postsFixture.newPost)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.postId).to.equal(postsFixture.newPost.postId);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.post('/api/posts'));

		it(`if identifier is taken: should: have status 400 and "type" field with value "${ ApiError.IDENTIFIER_TAKEN }"`, done => {
			requester.post('/api/posts')
				.set('Authorization', `Bearer ${ authToken }`)
				.send(postsFixture.existingPost)
				.end((err, res) => {
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
				.send(postsFixture.requiredFieldsMissingPost)
				.end((err, res) => {
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
				.get(`/api/posts/${ postsFixture.existingPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.get(`/api/posts/${ postsFixture.existingPost.postId }`));

		it('if posts was not found, should: have status 404', done => {
			requester
				.get(`/api/posts/${ postsFixture.newPost.postId }`)
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
				.patch(`/api/posts/${ postsFixture.existingPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.send(postsFixture.updatedPost)
				.end((err, res) => {
					expect(res).to.have.status(200);
					expect(res.body).to.be.an('object');
					expect(res.body.content).to.not.equal(postsFixture.existingPost.content);
					expect(res.body.content).to.equal(postsFixture.updatedPost.content);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.patch(`/api/posts/${ postsFixture.existingPost.postId }`));

		it('if post was not found, should: have status 404', done => {
			requester
				.patch(`/api/posts/${ postsFixture.newPost.postId }`)
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
				.delete(`/api/posts/${ postsFixture.existingPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(200);
					done();
				});
		});

		ifUserIsNotLoggedIn(requester.delete(`/api/posts/${ postsFixture.existingPost.postId }`));

		it('if post was not found, should: have status 404', done => {
			requester
				.delete(`/api/posts/${ postsFixture.newPost.postId }`)
				.set('Authorization', `Bearer ${ authToken }`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});
});
