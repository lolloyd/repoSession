const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const RoomManager = require('./roomManager');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const roomManager = new RoomManager(io);

app.use(cors());
app.use(express.json());

// Express security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve extracted puzzle images statically
app.use('/puzzles', express.static(path.join(__dirname, '../public/puzzles')));
app.use('/puzzles', express.static(path.join(__dirname, '../client/public/puzzles')));

// Serve client production build if present
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    activeRooms: roomManager.rooms.size,
    totalPuzzles: 96
  });
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Join or create room
  socket.on('join_room', (data) => {
    try {
      const { roomCode, playerName, avatar } = data || {};
      const { room, player } = roomManager.joinRoom(socket, roomCode, playerName, avatar);
      socket.emit('join_success', {
        roomCode: room.roomCode,
        playerId: player.id,
        isHost: player.isHost
      });
      // Send chat history
      socket.emit('chat_history', room.chatMessages);
      console.log(`[Room ${room.roomCode}] ${player.name} (${player.avatar}) joined`);
    } catch (err) {
      console.error('Error joining room:', err);
      socket.emit('error_message', 'Failed to join room');
    }
  });

  // Start game (host only)
  socket.on('start_game', () => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (room) {
      room.startGame(socket.id);
    }
  });

  // Submit answer
  socket.on('submit_answer', (data) => {
    const { answer } = data || {};
    const room = roomManager.getRoomBySocket(socket.id);
    if (room) {
      room.processAnswer(socket.id, answer);
    }
  });

  // Chat message (also processes as guess if game is playing)
  socket.on('send_chat', (data) => {
    const { text } = data || {};
    const room = roomManager.getRoomBySocket(socket.id);
    if (!room) return;

    const player = room.players.get(socket.id);
    if (!player) return;

    const trimmed = typeof text === 'string' ? text.trim().slice(0, 500) : (typeof text === 'number' ? String(text).trim() : '');
    if (!trimmed) return;

    // If game is playing and player hasn't answered correctly yet, check answer
    if (room.state === 'playing' && !player.isCorrect) {
      room.processAnswer(socket.id, trimmed);
    } else {
      // Normal chat message
      room.addChat({
        senderId: player.id,
        senderName: player.name,
        avatar: player.avatar,
        text: trimmed,
        type: 'chat'
      });
    }
  });

  // Emoji reaction
  socket.on('send_reaction', (data) => {
    const { emoji } = data || {};
    const room = roomManager.getRoomBySocket(socket.id);
    if (room) {
      room.sendReaction(socket.id, emoji);
    }
  });

  // Update room settings (host only)
  socket.on('update_settings', (settings) => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (room) {
      room.updateSettings(settings, socket.id);
    }
  });

  // Add AI bot teammate (host or player in lobby)
  socket.on('add_bot', () => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (room) {
      room.addBot();
    }
  });

  // Remove bot
  socket.on('remove_bot', (data) => {
    const { botId } = data || {};
    const room = roomManager.getRoomBySocket(socket.id);
    if (room) {
      room.removeBot(botId);
    }
  });

  // Skip or advance round (host only)
  socket.on('skip_round', () => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (room) {
      room.skipToNext(socket.id);
    }
  });

  // Reset game to lobby
  socket.on('reset_lobby', () => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (room) {
      room.resetToLobby(socket.id);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
    roomManager.leaveRoom(socket);
  });
});

// Fallback for single page app routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Rebus Puzzle Game Server is running. Client build in progress.');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🎯 Rebus Game Server listening on http://localhost:${PORT}`);
});
