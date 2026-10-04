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
    const safeCode = typeof roomCode === 'string' ? roomCode : String(roomCode || '');
    const code = (safeCode || this.generateRoomCode()).trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    const finalCode = code || this.generateRoomCode();
    if (!this.rooms.has(finalCode)) {
      const room = new GameRoom(finalCode, this.io);
      this.rooms.set(finalCode, room);
    }
    return this.rooms.get(finalCode);
  }

  getRoom(roomCode) {
    if (typeof roomCode !== 'string' && typeof roomCode !== 'number') return null;
    const sanitized = String(roomCode).trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
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
