const fs = require('fs')


function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}; //outputNumber

let data = fs.readFileSync('./wordlist.json', 'UTF-8')
let parse = JSON.parse(data)

let currentWord = parse[getRandom(1, 49)].word // answer

let shuffle = shuffleWord(currentWord) // hasil shufflean

console.log(currentWord, "<<<< curent word")
console.log(shuffle, "<<<<shuffle word")


//function untuk acak huruf
function shuffleWord(word) {

    let words = word.toLowerCase().trim().split('\n');

    for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < getRandom(3, words[i].length + 3); j++) {

            let start = getRandom(0, words[i].length - 1);
            let end = getRandom(start, words[i].length - 1);

            words[i] = words[i].substring(0, start) + words[i].substring(start, end + 1).split('').reverse().join('') + words[i].substring(end + 1, words[i].length);
        }
    }

    return words.join(' ');
};

//console.log(shuffleWord());


//untuk cek jawaban
let answer = currentWord
let counter = 0
let score = 0
function checkAnswer(answer, currentWord) {
    return answer.trim().toLowerCase() === currentWord.trim().toLowerCase()
}

console.log(checkAnswer(answer, currentWord), ">>>>>> answer")



//untuk cek skor
function getScore(counter) {

    if (checkAnswer(answer, currentWord)) {
        counter++
        console.log(counter)
        score += (counter * 10)
    }
    //counter ++
    return score
}

console.log(getScore(counter))
console.log(score)


module.exports = { shuffleWord, checkAnswer, getScore}