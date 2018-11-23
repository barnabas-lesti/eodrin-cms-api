process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const packs = [
	{
		description: 'Integration Tests',
		type: 'integration',
	},
];

/**
 * Imports all tests from a specific library.
 *
 * @param {string} directory Directory name
 * @returns {void}
 */
function requireTests (directory) {
	const dirPath = path.join(__dirname, directory);
	const files = fs.readdirSync(dirPath);
	for (const file of files) {
		require(path.join(dirPath, file));
	}
}

describe('Eodrin API Tests', () => {
	const onlyArg = yargs.argv.only;
	const packArg = yargs.argv.pack;
	if (onlyArg) {
		require(path.join(__dirname, onlyArg));
	} else {
		for (const pack of packs) {
			if (!packArg || packArg === pack.type) {
				describe(pack.description, () => {
					requireTests(pack.type);
				});
			}
		}
	}
});