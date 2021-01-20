/**
 * Shifts two binary values to the left
 * @param {number[]} A - A of the non restoring division
 * @param {number[]} Q - Q of the non restoring division
 */
module.exports.shift = function (A, Q){
	let QShift = Q.shift();
	Q.push(0);
	A.shift();
	A.push(Qshift);	
}