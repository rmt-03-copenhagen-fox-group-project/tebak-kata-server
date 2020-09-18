const fs = require('fs')
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { shuffleWord, getRandom } = require('./word')

let score = {
}

let correct = []
let counter = 0
const submitted = new Set([])

let data = fs.readFileSync('./wordlist.json', 'UTF-8')
let parse = JSON.parse(data)
let currentWord = ''
let shuffle = ''

io.on('connect', function(socket) {
  console.log('a user connected')
  socket.emit('init', score)

  socket.on('newPlayer', function(player) {
    console.log(player)
    score[player] = 0
    io.emit('serverPlayers', score)
  })

  socket.on('getQuestion', function () {
    currentWord = parse[getRandom(1, 49)].word.toLowerCase() // answer
    shuffle = shuffleWord(currentWord) // hasil shufflean

    let payload = { currentWord, shuffle, score }
    // console.log(payload, '<<<<<<<<<<<<di app.js')
    counter++
    io.emit('newQuestion', payload)
  })

  socket.on('checkAnswer', function (payload) {
    
    if(submitted.has(payload.player)){
      return
    }

    submitted.add(payload.player)

    if (payload.answer == currentWord ) {
      score[payload.player] += 10
      correct.push(true)
    } else {
      score[payload.player] += 0
      correct.push(false) 
    }

    if(counter === 5){
      const [playerA, playerB] = Object.keys(score)
      if(score[playerA] === score[playerB]){
        io.emit('gameOverWithDraw', score)
        return
      }

      
      const winner = score[playerA] > score[playerB] ? playerA : playerB

      counter = 0
      io.emit("gameOverWithWinner", {...score, winner})
    }

    if(correct.some(e => e === true) || correct.length === 2){
      currentWord = parse[getRandom(1, 49)].word.toLowerCase() // answer
      shuffle = shuffleWord(currentWord) // hasil shufflean

      let data = { currentWord, shuffle }
      correct = []
      submitted.clear()
      io.emit('newQuestion', { ...data, score})
      counter++
      return 
    }

    io.emit('serverPlayers', score)
  })

  socket.on("exit", () => {
    correct = []
    submitted.clear()
    score = {}
    io.emit('exit')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});