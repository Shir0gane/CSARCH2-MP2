/**
 * Sign-extends the binary argument
 * @param {number[]} binary - The binary value to sign extend
 * @param {number} length - The target number of binary bits
 * @return {number[]} The sign extended binary value
 */
module.exports.signExtend = function(binary, length){
    let signExtended = binary.slice();
    let sign = binary[0];
    while(signExtended.length < length){
        signExtended.unshift(sign);
    }
    return signExtended;
}

/**
 * Zero-extends the binary argument
 * @param {number[0]} binary - The binary value to zero-extend 
 * @param {number} length - The target number of binary bits
 * @return {number[]} The zero-extended binary value
 */
module.exports.zeroExtend = function(binary, length){
    let zeroExtended = binary.slice();
    while(zeroExtended.length < length){
        zeroExtended.unshift(0);
    }
    return zeroExtended;
}