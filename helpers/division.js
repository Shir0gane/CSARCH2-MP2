const adder = require("./adder");
const extension = require("./extension");
const shift = require("./shift");
const complement = require("./complement");

/**
 * Performs non-restoring division on the binary arguments.
 * @param {number[]} dividend - An array of 0s and 1s
 * @param {number[]} divisor - An array of 0s and 1s
 * @return {{quotient: number[], remainder: number[], solution: Object[]}} Returns the quotient
 * and remainder result. The solution contains the value of the A and Q registers after each iteration
 */
module.exports.nonRestoringDivision = function(dividend, divisor){
    let A = extension.zeroExtend([], dividend.length + 1);
    let M = extension.zeroExtend(divisor, divisor.length + 1);
    let Q = dividend.slice();
    let isPreviousPositive = true // Indicates if the value of A register is positive in the previous iteration
    let solution = [];

    let init = {
        A: A.slice(), 
        M: M.slice(), 
        Q: Q.slice()
    };

    for(let i=0; i<dividend.length; ++i){
        shift.shift(A, Q); // Shift left AQ

        if(isPreviousPositive){
            A = adder.binaryAdder(A, complement.twosComplement(M)).sum;
        }else{
            A = adder.binaryAdder(A, M).sum;
        }

        Q[Q.length  - 1] = Number(!A[0]);

        isPreviousPositive = (A[0] === 0)
        
        // Restore if last iteration and A is negative
        if(i === (dividend.length - 1) && !isPreviousPositive){
            A = adder.binaryAdder(A, M).sum;
        }

        solution.push({
            A: A.slice(),
            Q: Q.slice()
        });
    }

    return {
        init,
        remainder: A,
        quotient: Q,
        solution
    }
}