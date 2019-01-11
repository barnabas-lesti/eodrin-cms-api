/**
 * Responds to the client based on the response locals payload.
 *
 * @return {void}
 */
const responder = () => (req, res) => {
	const {
		data,
		error,
	} = res.locals;

	let responsePayload;
	let status;

	if (error) {
		responsePayload = error;
		status = 500;
	} else if (data !== undefined) {
		responsePayload = data;
		status = 200;
	} else {
		status = 404;
	}

	res.status(status).json(responsePayload);
	return;
};

module.exports = responder;
