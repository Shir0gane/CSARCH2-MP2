const extension = require("../helpers/extension.js");

/**
 * Converts the division operands in req.query to arrays. If length are unequal,
 * zero-extends the shorter binary value to equal the length of the longer binary value.
 * If error is encounted during operation, sends a 500 response to the browser
 */
module.exports.convertStringToArray = function(req, res, next){
    try{
        let dividend = req.query.dividend;
        let divisor = req.query.divisor;
        dividend = dividend.split("");
        divisor = divisor.split("");
        dividend = dividend.map((bit) => Number(bit));
        divisor = divisor.map((bit) => Number(bit));
        if(dividend.length !== divisor.length){
            if(dividend.length > divisor.length){
                divisor = extension.zeroExtend(divisor, dividend.length)
            }else{
                dividend = extension.zeroExtend(dividend, divisor.length)
            }
        }
        req.query.dividend = dividend;
        req.query.divisor = divisor;
        next();
    }catch(err){
        res.status(500).send({message: "Internal Server Error."});
    }
}

/**
 * Checks if the dividend and divisor in req.query are strings containing only zeros and ones.
 * If so, calls the next middleware; otherwise, sends a 400 response.
 * If error is encounted during operation, sends a 500 response
 */
module.exports.checkOperands = function(req, res, next){
    try{
        let binaryRegex = /^[0-1]{1,}$/
        if(!binaryRegex.test(req.query.dividend)){
            res.status(400).send({message: "Dividend is not a valid binary value."});
        }else if(!binaryRegex.test(req.query.divisor)){
            res.status(400).send({message: "Divisor is not a valid binary value."});
        }else{
            next();
        }
    }catch(err){
        res.status(500).send({message: "Internal Server Error."});
    }
}