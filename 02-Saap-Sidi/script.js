const socket = io();

let myPlayerName = '';
let myRoomId = '';
let players = [];
let currentTurn = '';
let gameState = 'waiting';

// DOM Elements
const joinOverlay = document.getElementById('join-overlay');
const playerNameInput = document.getElementById('player-name');
const roomIdInput = document.getElementById('room-id');
const createBtn = document.getElementById('create-btn');
const joinBtn = document.getElementById('join-btn');
const currentRoomIdSpan = document.getElementById('current-room-id');
const currentPlayerTurnSpan = document.getElementById('current-player-turn');
const startGameBtn = document.getElementById('start-game-btn');
const quitGameBtn = document.getElementById('quit-game-btn');
const playersList = document.getElementById('players-list');
const rollDiceBtn = document.getElementById('btn');
const diceImage = document.getElementById("dImage");
const diceSound = new Audio("audio/diceSound.mp3");

// Persistence: Check if already in a room
window.onload = () => {
    const savedName = localStorage.getItem('playerName');
    const savedRoom = localStorage.getItem('roomId');
    if (savedName && savedRoom) {
        playerNameInput.value = savedName;
        roomIdInput.value = savedRoom;
    }
};

createBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
        myPlayerName = name;
        const generatedRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        myRoomId = generatedRoomId;
        localStorage.setItem('playerName', name);
        localStorage.setItem('roomId', myRoomId);
        socket.emit('joinRoom', { roomId: myRoomId, playerName: name });
        joinOverlay.style.display = 'none';
    } else {
        alert('Please enter your name');
    }
});

joinBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    const room = roomIdInput.value.trim().toUpperCase();
    if (name && room) {
        myPlayerName = name;
        myRoomId = room;
        localStorage.setItem('playerName', name);
        localStorage.setItem('roomId', room);
        socket.emit('joinRoom', { roomId: room, playerName: name });
        joinOverlay.style.display = 'none';
    } else {
        alert('Please enter both name and Room ID');
    }
});

rollDiceBtn.addEventListener('click', () => {
    if (currentTurn === myPlayerName && gameState === 'playing') {
        socket.emit('rollDice');
    }
});

startGameBtn.addEventListener('click', () => {
    socket.emit('startGame');
});

quitGameBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to quit?')) {
        socket.emit('quitGame');
        localStorage.removeItem('roomId');
        location.reload();
    }
});

socket.on('roomUpdate', (data) => {
    players = data.players;
    currentTurn = data.currentTurn;
    gameState = data.gameState;

    updateUI();
});

socket.on('diceRolled', (data) => {
    // Animate dice and move player
    animateDice(data.roll);
    movePlayer(data.playerName, data.newPosition);
});

socket.on('error', (msg) => {
    alert(msg);
    joinOverlay.style.display = 'flex';
});

function updateUI() {
    currentRoomIdSpan.innerText = myRoomId;
    currentPlayerTurnSpan.innerText = currentTurn || 'Waiting...';

    // Players list UI
    playersList.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.className = p.online ? 'player-online' : 'player-offline';
        if (p.name === currentTurn) div.classList.add('active-turn');
        div.innerText = `${p.name} ${p.name === myPlayerName ? '(You)' : ''} - Pos: ${p.position}`;
        playersList.appendChild(div);

        // Update board tokens
        const playerIndex = players.indexOf(p) + 1;
        const playerToken = document.getElementById(`player${playerIndex}`);
        if (playerToken) {
            playerToken.style.display = 'block';
            // Set color based on index or property if available
            const circle = document.getElementById(`circle${playerIndex}`);
            circle.style.borderColor = p.color || '#fff';

            // Only update position if not currently moving (animation will handle it)
            // But for initial load/sync:
            if (!playerToken.moving) {
                updateTokenPosition(playerToken, p.position);
            }
        }
    });

    // Start game button visibility (only for first player as host-like)
    if (gameState === 'waiting' && players.length >= 2 && players[0].name === myPlayerName) {
        startGameBtn.style.display = 'block';
    } else {
        startGameBtn.style.display = 'none';
    }

    // Disable roll button if not my turn OR if I already won
    const me = players.find(p => p.name === myPlayerName);
    if (currentTurn === myPlayerName && gameState === 'playing' && me && !me.winner) {
        rollDiceBtn.classList.remove('btn-disabled');
    } else {
        rollDiceBtn.classList.add('btn-disabled');
    }

    // Special message for winners
    if (me && me.winner) {
        currentPlayerTurnSpan.innerText = "You Won! 🎉";
    }
}

function updateTokenPosition(token, pos) {
    const box = document.getElementById('box' + pos);
    if (box) {
        token.style.top = (box.offsetTop + 12) + "px";
        token.style.left = (box.offsetLeft + 13) + "px";
    }
}

function animateDice(num) {
    // diceImage is now the #dImage cube element
    diceSound.currentTime = 0;
    diceSound.play();

    // Map each number to a specific rotation that brings the corresponding face to the front
    // Each case includes 720 degrees of extra rotation for a spinning effect
    let rotateX = 720;
    let rotateY = 720;

    switch (num) {
        case 1: // Front
            rotateX += 0;
            rotateY += 0;
            break;
        case 2: // Back
            rotateX += 0;
            rotateY += 180;
            break;
        case 3: // Right
            rotateX += 0;
            rotateY += -90;
            break;
        case 4: // Left
            rotateX += 0;
            rotateY += 90;
            break;
        case 5: // Top
            rotateX += -90;
            rotateY += 0;
            break;
        case 6: // Bottom
            rotateX += 90;
            rotateY += 0;
            break;
    }

    diceImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Optional: reset rotation after a while without transition to keep it "landing" naturally
    // but the next roll will calculate from a new base anyway if we just keep adding to it
    // For simplicity, we just set the final state.
}

function movePlayer(playerName, targetPos) {
    const player = players.find(p => p.name === playerName);
    const playerIndex = players.indexOf(player) + 1;
    const playerToken = document.getElementById(`player${playerIndex}`);

    if (!playerToken) return;

    playerToken.moving = true;

    // We could animate step-by-step for better UX
    // For now, let's just jump to the target after a short delay to match dice animation
    setTimeout(() => {
        updateTokenPosition(playerToken, targetPos);
        playerToken.moving = false;

        if (targetPos === 100) {
            showWinner(playerName);
        }
    }, 1000);
}

function showWinner(name) {
    const winnermsg = document.getElementById("winnermsg");
    const popup = document.querySelector('.popup');
    const confe = document.querySelector('#my-canvas');

    var confettiSettings = { target: 'my-canvas' };
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    popup.classList.add('active');
    confe.classList.add('active');
    winnermsg.innerText = `${name} is 🏆Winner🏆`;

    setTimeout(() => {
        popup.classList.remove('active');
        confe.classList.remove('active');
    }, 5000);
}
