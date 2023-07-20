// Backend code using Express.js and Socket.IO
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  }
});

const SIZE = 15;
const WIN_LENGTH = 5;

let games = {};

io.on('connection', (socket) => {
  socket.on('createGame', (gameId) => {
    console.log('create game!');
    if (games[gameId]) {
      if (games[gameId].players.length < 2) {
        // Second player joining the existing game
        console.log('Second player joining the existing game');
        games[gameId].players.push(socket.id);
        // Second player is 'White'
        games[gameId].currentPlayer = 'White';
        socket.join(gameId);
        // Notify players that game is ready
        io.to(gameId).emit('gameReady', games[gameId]);

        io.to(gameId).emit('gameUpdate', games[gameId]);

        // Update the game state on the client side
        games[gameId].currentPlayer = 'Black';
        io.to(gameId).emit('gameUpdate', games[gameId]);
      } else {
        // Game is full, cannot join
        socket.emit('err', 'Game is full');
      }
    } else {
      // First player creating a new game
      console.log('First player creating a new game');
      games[gameId] = {
        players: [socket.id],
        grid: Array(SIZE).fill().map(() => Array(SIZE).fill(null)),
        currentPlayer: 'Black',  // First player is 'Black'
        winner: null
      };
      socket.join(gameId);
      // Update the game state on the client side
      io.to(gameId).emit('gameUpdate', games[gameId]);
    }
  });

  socket.on('joinGame', (gameId) => {
    if(!games[gameId] || games[gameId].players.length >= 2) return;
    games[gameId].players.push(socket.id);
    socket.join(gameId);
    io.to(gameId).emit('gameReady');
  });

  socket.on('makeMove', ({ gameId, row, col }) => {
    let game = games[gameId];
    if(!game || game.currentPlayer !== (game.players[0] === socket.id ? 'Black' : 'White') || game.grid[row][col] !== null) return;

    game.grid[row][col] = game.currentPlayer;
    game.currentPlayer = game.currentPlayer === 'Black' ? 'White' : 'Black'; // Swap players
    game.winner = checkWinner(game.grid);

    io.to(gameId).emit('gameUpdate', game);

    if(game.winner) {
      // If there's a winner, reset the game state
      games[gameId] = {
        players: [],
        grid: Array(SIZE).fill().map(() => Array(SIZE).fill(null)),
        currentPlayer: 'Black',
        winner: null
      };
    }
  });
});

function checkWinner(grid) {
  for(let i = 0; i < SIZE; i++) {
    for(let j = 0; j < SIZE; j++) {
      if(grid[i][j] !== null && (
        checkLine(grid, i, j, 1, 0, grid[i][j]) ||
        checkLine(grid, i, j, 0, 1, grid[i][j]) ||
        checkLine(grid, i, j, 1, 1, grid[i][j]) ||
        checkLine(grid, i, j, 1, -1, grid[i][j])
      )) {
        return grid[i][j];
      }
    }
  }

  return null;
}

function checkLine(grid, x, y, dx, dy, color) {
  for(let i = 0; i < WIN_LENGTH; i++) {
    const nx = x + dx * i;
    const ny = y + dy * i;
    if(nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || grid[nx][ny] !== color) {
      return false;
    }
  }

  return true;
}

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
