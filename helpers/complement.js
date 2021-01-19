function twosComplement(array){
	let complementedArray = [];
	let carry = 1;
	array.forEach(function(element){
  		complementedArray.push(Number(!element));
	});

	for(let i=0; i < complementedArray.length; i++){
		if(element === 1 && carry === 1)
    		complementedArray[index] = 0;
  		else if(element ===0 && carry === 1){
    		complementedArray[index] = 1;
    		carry = 0;
  		}
	}
	return complementedArray;
}