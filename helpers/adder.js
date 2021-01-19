/**
 * Adds the bits specified in the arguments
 * @param {number} bit1 - A 0 or 1 value
 * @param {number} bit2 - A 0 or 1 value
 * @param {number} carryIn - A 0 or 1 value
 * @return {{carryOut: number, sum: number}} The sum bit and the carry-out bit
 */
function fullAdder(bit1, bit2, carryIn){
    return {
        carryOut: (bit1 & bit2) | (bit2 & carryIn) | (carryIn & bit1),
        sum: bit1 ^ bit2 ^ carryIn
    }
}

/**
 * Adds two binary value. The binary operands must have the same length
 * @param {number[]} binary1 - The first binary addend
 * @param {number[]} binary2 - The second binary addend
 * @return {{carryOut: number, sum: number[]}} The sum and the carry-out bit
 */
module.exports.binaryAdder = function(binary1, binary2){
    let sum = [];
    let carry = 0;
    binary1 = binary1.slice();
    binary2 = binary2.slice();

    while(binary1.length > 0){
        let result = fullAdder(binary1.pop(), binary2.pop(), carry);
        sum.unshift(result.sum);
        carry = result.carryOut;
    }

    return {carryOut: carry, sum}
}