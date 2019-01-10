process.env.NODE_ENV = 'test';

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

// const { requester } = require('./suite');

/**
 * Test packs (unit, integration, e2e, etc.)
 */
const packs = [
	{
		description: 'Unit Tests',
		type: 'unit',
	},
];

/**
 * Imports all tests from a specific type.
 *
 * @param {String} type Directory name basically...
 * @returns {void}
 */
function requireTests (type) {
	const dirPath = path.join(__dirname, type);
	const files = fs.readdirSync(dirPath);
	for (const file of files) {
		require(path.join(dirPath, file));
	}
}

describe('Eodrin API Tests', () => {
	const onlyArg = yargs.argv.only;
	const packArg = yargs.argv.pack;

	if (onlyArg) {
		const testFileName = onlyArg.indexOf('.test') == -1 ? `${ onlyArg }.test` : onlyArg;
		require(path.join(__dirname, testFileName));
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
