/**
 * Responds to the client based on the response locals payload.
 *
 * @return {void}
 */
export default function responder () {
	return (req, res) => {
		const { data, error, view } = res.locals;

		if (error) {
			res.status(500).json(error);
		} else if (view) {
			res.send(view);
		} else if (data) {
			res.status(200).json(data);
		} else {
			res.status(404).json();
		}
		return;
	};
}
