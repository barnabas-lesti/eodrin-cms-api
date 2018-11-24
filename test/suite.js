const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../src/app');

chai.use(chaiHttp);

const { expect } = chai;
const requester = chai.request(app).keepOpen();

module.exports = {
	expect,
	requester,
};
