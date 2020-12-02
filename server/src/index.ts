import express from 'express'
import cors from 'cors'

// Using typescript syntax according to socket.io v3 documentation
import { createServer } from 'http';
import { Server, Socket } from 'socket.io'

const app = express()
const http = createServer(app)
const io = new Server(http, {
   cors: {
      origin: 'http://localhost:3010', // client side web address
      credentials: true
   }
})

let players: {id: string, symbol: string}[] = []
io.on("connection", function(socket: Socket) {

   // Handle new player
   socket.on("player-joined", function(id) {
      if(players.length === 2) return; // can't have more than 2 players right? :)

      if(players[0]) { // if there's already 1 player in the game
         const existingPlayerSymbol = players[0].symbol
         players.push({ id, symbol: existingPlayerSymbol === 'X' ? 'O' : 'X' })

      } else {
         players.push({ id, symbol: 'X' })
      }
      console.log('Player ' + players[players.length - 1].symbol + ' has joined the game')

      // first player who joined plays first
      io.emit("client-player-joined", { players, currentTurnId: players[0].id });
   });

   // Handle game board updates
   socket.on("update-board", function(board) {
      io.emit("client-update-board", board);
      console.log('board:', board)
   })

   // Handle updates about whose turn is it
   socket.on("update-current-turn", function(nextPlayerId) {
      io.emit("client-update-current-turn", nextPlayerId);
   })

   // Handle set winner
   socket.on("set-winner", function(winnerPlayer) {
      io.emit("client-set-winner", winnerPlayer);
   })

   // Inform the second player when his opponent disconnects
   socket.on('disconnect', function() {
      players = players.filter(player => {
         if(player.id !== socket.id) {
            return true
         }
         console.log('Player ' + player.symbol + ' has disconnected')
         return false
      })
      io.emit('client-player-disconnected', players)
   })
});

http.listen(8001, function() {
   console.log("Listening on *:8001");
});

app.disable('x-powered-by')
app.use(cors())
