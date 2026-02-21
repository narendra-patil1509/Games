const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '.')));

const rooms = {};

// Game Constants
const BOARD_SIZE = 100;
const LADDERS = { 5: 26 };
const SNAKES = { 31: 8 };

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', ({ roomId, playerName }) => {
        if (!roomId || !playerName) return;

        socket.join(roomId);

        if (!rooms[roomId]) {
            rooms[roomId] = {
                id: roomId,
                players: [],
                currentTurnIndex: 0,
                gameState: 'waiting', // waiting, playing, finished
                logs: []
            };
        }

        const room = rooms[roomId];

        // Check if player already exists (re-joining)
        let player = room.players.find(p => p.name === playerName);
        if (player) {
            player.id = socket.id;
            player.online = true;
        } else {
            // New player
            if (room.gameState !== 'waiting') {
                socket.emit('error', 'Game already in progress');
                return;
            }
            if (room.players.length >= 4) {
                socket.emit('error', 'Room full');
                return;
            }

            player = {
                id: socket.id,
                name: playerName,
                position: 1,
                color: getPlayerColor(room.players.length),
                online: true,
                winner: false
            };
            room.players.push(player);
        }

        socket.playerName = playerName;
        socket.roomId = roomId;

        io.to(roomId).emit('roomUpdate', {
            players: room.players,
            currentTurn: room.players[room.currentTurnIndex]?.name,
            gameState: room.gameState
        });

        console.log(`${playerName} joined room ${roomId}`);
    });

    socket.on('startGame', () => {
        const room = rooms[socket.roomId];
        if (room && room.players.length >= 2) {
            room.gameState = 'playing';
            io.to(socket.roomId).emit('gameStateChanged', 'playing');
            io.to(socket.roomId).emit('roomUpdate', {
                players: room.players,
                currentTurn: room.players[room.currentTurnIndex]?.name,
                gameState: room.gameState
            });
        }
    });

    socket.on('rollDice', () => {
        const room = rooms[socket.roomId];
        if (!room || room.gameState !== 'playing') return;

        const currentPlayer = room.players[room.currentTurnIndex];
        if (currentPlayer.id !== socket.id) return;

        const roll = Math.floor(Math.random() * 6) + 1;
        let nextPosition = currentPlayer.position + roll;

        // Snake/Ladder Logic
        if (nextPosition > BOARD_SIZE) {
            nextPosition = currentPlayer.position; // Can't move beyond 100
        }

        if (LADDERS[nextPosition]) {
            nextPosition = LADDERS[nextPosition];
        } else if (SNAKES[nextPosition]) {
            nextPosition = SNAKES[nextPosition];
        }

        currentPlayer.position = nextPosition;

        if (currentPlayer.position === BOARD_SIZE) {
            currentPlayer.winner = true;

            // Check if game should end (Requirement 3: 2-player game ends if one wins)
            const remainingPlayers = room.players.filter(p => !p.winner);
            if (remainingPlayers.length === 1 && room.players.length === 2) {
                room.gameState = 'finished';
            } else if (remainingPlayers.length === 0) {
                room.gameState = 'finished';
            }
        }

        io.to(socket.roomId).emit('diceRolled', {
            playerName: currentPlayer.name,
            roll: roll,
            newPosition: nextPosition
        });

        // Determine next turn
        if (roll !== 6 && room.gameState === 'playing') {
            room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;
            // Skip finished/offline players if necessary, but keep host logic simple
            let skipCount = 0;
            while (room.players[room.currentTurnIndex].winner && skipCount < room.players.length) {
                room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;
                skipCount++;
            }
        }

        io.to(socket.roomId).emit('roomUpdate', {
            players: room.players,
            currentTurn: room.players[room.currentTurnIndex]?.name,
            gameState: room.gameState
        });
    });

    socket.on('quitGame', () => {
        const room = rooms[socket.roomId];
        if (room) {
            room.players = room.players.filter(p => p.id !== socket.id);
            socket.leave(socket.roomId);

            // Re-index turn if necessary
            if (room.currentTurnIndex >= room.players.length) {
                room.currentTurnIndex = 0;
            }

            io.to(socket.roomId).emit('roomUpdate', {
                players: room.players,
                currentTurn: room.players[room.currentTurnIndex]?.name,
                gameState: room.gameState
            });

            checkRoomCleanup(socket.roomId);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const room = rooms[socket.roomId];
        if (room) {
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.online = false;
            }
            checkRoomCleanup(socket.roomId);
        }
    });
});

function checkRoomCleanup(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    const onlinePlayers = room.players.filter(p => p.online);
    if (onlinePlayers.length < 2 && room.players.length <= 2) {
        // Wait for potential refresh
        setTimeout(() => {
            const latestRoom = rooms[roomId];
            if (latestRoom && latestRoom.players.filter(p => p.online).length < 2 && latestRoom.players.length <= 2) {
                delete rooms[roomId];
                console.log(`Room ${roomId} deleted.`);
            }
        }, 5000);
    }
}

function getPlayerColor(index) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
    return colors[index] || '#ffffff';
}

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
