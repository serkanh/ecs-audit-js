/**
 * Gets the resource name from arn
 * @param {string} arn
 * @returns {string}
 */
const getName = (arn) => {
	return arn
		.toString()
		.split('/')[1]

}

console.log(getName('arn:aws:ecs:us-east-1:174076265606:cluster/dev'))