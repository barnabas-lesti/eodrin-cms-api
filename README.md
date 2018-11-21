# Eodrin CMS API

## Description
Backend API for Eodrin CMS.

## Development
### Workstation/Server dependencies
- [NodeJS (LTS)](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/lang/en/)
  - You can use NPM, but yarn is preferred (at least for me)
- [Git](https://git-scm.com/)
  - Although not required for the app, it's a must for development and publishing changes
- [MongoDB](https://www.mongodb.com)
  - ... or you can connect to an already existing public database
  - The `mongo` command should be available via cmd, adding it to the path might be required
  - Create the DB and a user for the app
```js
// By default ('./env/default.yaml') the app will try to connect to a local database "eodrin"
use eodrin
db.createUser({ user: "admin", pwd: "admin", roles: [{ role: "readWrite", db: "eodrin" }] })

// Tests ('./env/test.yaml') use the local test database "eodrin_test"
use eodrin_test
db.createUser({ user: "admin", pwd: "admin", roles: [{ role: "readWrite", db: "eodrin_test" }] })
```

### Commands and scripts
```bash
# Install dependencies:
yarn

# Start the server and reload when files change:
yarn serve

# Lint the source code
yarn lint
# ... to fix trivial errors:
yarn lint --fix

# Run tests
yarn test
```

### Useful tools
- [VSCode](https://code.visualstudio.com/) - My preferred code editor with the following extensions:
  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [GitHub for Desktop](https://desktop.github.com/) - Desktop application for Git
- [Postman](https://www.getpostman.com/) - Test API endpoints, request headers, etc.
- [Mocky](https://www.mocky.io/) - Create mock data reachable on public URL-s

### Articles
- App structure: https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
- Performance best practices: https://expressjs.com/en/advanced/best-practice-performance.html
- Testing NodeJS:
  - https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
  - https://hackernoon.com/testing-node-js-in-2018-10a04dd77391
- Example test suite by [Stream](https://getstream.io): https://github.com/GetStream/Winds/tree/master/api/test

## Conventions

### Commits
- Every commit needs to go on a separated branch
- The branch needs to be originated from the **staging** branch
- Branch name pattern: \<issuePrimaryLabel\>/\<issueNumber\>-\<issueTitle\>
  - Eg.: `quality/#2-implement-test-framework-skeleton`
- The last commit on the branch needs to mention the related issue and [automatically close it](https://help.github.com/articles/closing-issues-using-keywords/)
  - Eg.: `Resolves #2 - Implemented test framework base`)
- Production ready features need to be merged to the **master** branch with a **Pull request** created on GitHub

### Configuration files
- Configuration files that contain sensitive information (like the mongoUri or the application secret) should be git ignored
- On workstations and servers the appropriate env configuration file needs to be created

### Module handling
- Where possible a default module should be exported
```js
const config = {
	// ...
};

module.exports = config;
```
- If more modules are exported (like in a `index.js` file), named exporting is preferred
```js
const Post = require('./Post');
const User = require('./User');

module.exports = {
	Post,
	User,
};
```

### Services should be singletons
- There are a lot of ways to create singletons in ES6, but the app uses the **export a single instance patter**
- The class it self should not be exported, just the instance of the class
```js
class DbService {
	// ...
}

const dbService = new DbService();
module.exports = dbService;
```

### Asynchronous code
- The app _should use **async/await**_ where it's possible, _not the **Promise** class_.
- Error handling _should be done via **try/catch**_, _not the **catch** function_.
```js
async connect() {
	const options  = dbConfig;

	logService.info('Connecting to database...');
	try {
		await mongoose.connect(config.MONGO_URI, options);
		logService.info('Connected to database');
	} catch (error) {
		logService.error(`Could not connect to database with URI: "${config.MONGO_URI}"`);
	}
}
```
