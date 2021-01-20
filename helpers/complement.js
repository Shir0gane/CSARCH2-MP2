module.exports.twosComplement = function (array){
	let complementedArray = [];
	let carry = 1;
	array.forEach(function(element){
  		complementedArray.push(Number(!element));
	});
	for(let i=complementedArray.length; i >= 0; i--){
		if(complementedArray[i] === 1 && carry === 1)
    		complementedArray[i] = 0;
        
  		else if(complementedArray[i] ===0 && carry === 1){
    		complementedArray[i] = 1;
    		carry = 0;
  		}
	}
	return complementedArray;
}