const fs = require('fs')
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { shuffleWord, getRandom } = require('./word')

const score = {
  jose: 0,
  aji: 0,
}

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
    currentWord = parse[getRandom(1, 49)].word // answer
    shuffle = shuffleWord(currentWord) // hasil shufflean

    let payload = { currentWord, shuffle }
    // console.log(payload, '<<<<<<<<<<<<di app.js')
    io.emit('newQuestion', payload)
  })

  socket.on('checkAnswer', function (payload) {
    console.log(payload)
    if (payload.answer == currentWord ) {
      score[payload.player] += 10 
    } else {
      score[payload.player] += 0 
    }
    io.emit('serverPlayers', score)
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000');
});