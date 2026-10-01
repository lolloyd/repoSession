const GameRoom = require('./gameRoom');

class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomCode -> GameRoom
    this.socketToRoom = new Map(); // socketId -> roomCode
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  getOrCreateRoom(roomCode) {
    const safeCode = typeof roomCode === 'string' || typeof roomCode === 'number' ? String(roomCode) : '';
    // Sanitize roomCode to uppercase alphanumeric characters, max 10 chars
    const sanitized = safeCode.replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase().slice(0, 10);
    const code = sanitized || this.generateRoomCode();
    if (!this.rooms.has(code)) {
      // Prevent unbounded room creation memory DoS
      if (this.rooms.size >= 1000) {
        throw new Error('Server room capacity reached');
      }
      const room = new GameRoom(code, this.io);
      this.rooms.set(code, room);
    }
    return this.rooms.get(code);
  }

  getRoom(roomCode) {
    if (typeof roomCode !== 'string' && typeof roomCode !== 'number') return null;
    const sanitized = String(roomCode).replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase().slice(0, 10);
    return this.rooms.get(sanitized);
  }

  getRoomBySocket(socketId) {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return null;
    return this.rooms.get(roomCode);
  }

  joinRoom(socket, roomCode, playerName, avatar) {
    // Leave previous room if any
    this.leaveRoom(socket);

    const room = this.getOrCreateRoom(roomCode);
    socket.join(room.roomCode);
    this.socketToRoom.set(socket.id, room.roomCode);

    const player = room.addPlayer(socket.id, playerName, avatar);
    return { room, player };
  }

  leaveRoom(socket) {
    const roomCode = this.socketToRoom.get(socket.id);
    if (!roomCode) return;

    const room = this.rooms.get(roomCode);
    if (room) {
      room.removePlayer(socket.id);
      socket.leave(roomCode);

      // Clean up empty rooms after 5 minutes if no human players remain
      const humanCount = Array.from(room.players.values()).filter(p => !p.isBot).length;
      if (humanCount === 0) {
        room.clearTimers();
        this.rooms.delete(roomCode);
      }
    }

    this.socketToRoom.delete(socket.id);
  }
}

module.exports = RoomManager;
