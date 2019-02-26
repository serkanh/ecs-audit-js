/**
 * Gets the resource name from arn
 * @param {string} arn
 * @returns {string}
 */
const splitArnName = (arn) => {
	return arn
		.toString()
		.split('/')[1]

}

module.exports = splitArnName;