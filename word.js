const fs = require('fs')

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


function shuffleWord(word) {

	let words = word.trim().split(' ');

	for(let i = 0; i<words.length; i++){
		for(let j = 0; j<getRandom(3, words[i].length+3); j++){

			let start = getRandom(0, words[i].length-1);
			let end = getRandom(start, words[i].length-1);

			words[i] = words[i].substring(0,start) + words[i].substring(start, end+1).split('').reverse().join('') + words[i].substring(end+1, words[i].length);
		}
	}

	return words.join(' ');
};

console.log(shuffleWord('manggis'));