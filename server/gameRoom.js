const { checkAnswer } = require('./matcher');
const allPuzzles = require('./data/puzzles.json');

const BOT_NAMES = ['Bot Charlie 🤖', 'Bot Maya 🐱', 'Bot Alex 🦊', 'Bot Sam 🦉', 'Bot Jordan ⚡'];

class GameRoom {
  constructor(roomCode, io) {
    this.roomCode = roomCode;
    this.io = io;
    this.players = new Map(); // socketId -> player
    this.hostId = null;
    this.state = 'lobby'; // 'lobby' | 'playing' | 'round_end' | 'game_over'
    
    this.settings = {
      totalRounds: 10,
      roundTime: 45, // seconds
      showHints: true,
      categoryFilter: 'All'
    };

    this.rounds = [];
    this.currentRoundIndex = -1;
    this.currentPuzzle = null;
    this.timeLeft = 0;
    this.timerInterval = null;
    this.roundEndTimeout = null;
    this.botTimeouts = [];

    this.roundWinner = null;
    this.roundEndReason = null; // 'solved' | 'all_answered' | 'timeout'
    this.chatMessages = [];
  }

  // --- Player Management ---
  addPlayer(socketId, name, avatar) {
    if (this.players.size >= 24) {
      throw new Error('Room is full (maximum 24 players)');
    }
    const isFirst = this.players.size === 0;
    const safeName = typeof name === 'string' ? name : String(name || '');
    const player = {
      id: socketId,
      name: safeName.trim().slice(0, 24) || `Player ${this.players.size + 1}`,
      avatar: typeof avatar === 'string' ? avatar.slice(0, 8) : '🦊',
      score: 0,
      roundsWon: 0,
      streak: 0,
      hasAnswered: false,
      lastGuess: null,
      isCorrect: false,
      isHost: isFirst,
      isBot: false,
      connected: true
    };

    this.players.set(socketId, player);
    if (isFirst || !this.hostId) {
      this.hostId = socketId;
      player.isHost = true;
    }

    this.addSystemMessage(`${player.name} joined the room!`);
    this.broadcastState();
    return player;
  }

  removePlayer(socketId) {
    const player = this.players.get(socketId);
    if (!player) return;

    this.addSystemMessage(`${player.name} left the game.`);
    this.players.delete(socketId);

    // If host left, designate a new host
    if (this.hostId === socketId) {
      const remaining = Array.from(this.players.values()).filter(p => !p.isBot);
      if (remaining.length > 0) {
        this.hostId = remaining[0].id;
        remaining[0].isHost = true;
        this.addSystemMessage(`${remaining[0].name} is now the host.`);
      } else {
        this.hostId = null;
      }
    }

    // If playing, check if all remaining players have answered
    if (this.state === 'playing') {
      this.checkAllAnsweredCondition();
    }

    this.broadcastState();
  }

  addBot() {
    if (this.state !== 'lobby' || this.players.size >= 24) return;
    const existingBots = Array.from(this.players.values()).filter(p => p.isBot);
    const botName = BOT_NAMES[existingBots.length % BOT_NAMES.length];
    const botId = `bot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const bot = {
      id: botId,
      name: botName,
      avatar: '🤖',
      score: 0,
      roundsWon: 0,
      streak: 0,
      hasAnswered: false,
      lastGuess: null,
      isCorrect: false,
      isHost: false,
      isBot: true,
      connected: true
    };

    this.players.set(botId, bot);
    this.addSystemMessage(`${bot.name} was added to the room.`);
    this.broadcastState();
  }

  removeBot(botId) {
    const bot = this.players.get(botId);
    if (bot && bot.isBot) {
      this.players.delete(botId);
      this.addSystemMessage(`${bot.name} was removed.`);
      this.broadcastState();
    }
  }

  updateSettings(newSettings, socketId) {
    if (socketId !== this.hostId) return;
    // Security: Validate settings object structure to prevent state corruption or server DoS
    if (!newSettings || typeof newSettings !== 'object' || Array.isArray(newSettings)) return;

    const safeSettings = {};

    if (typeof newSettings.totalRounds === 'number' && Number.isInteger(newSettings.totalRounds)) {
      safeSettings.totalRounds = Math.max(1, Math.min(50, newSettings.totalRounds));
    }

    if (typeof newSettings.roundTime === 'number' && Number.isFinite(newSettings.roundTime)) {
      safeSettings.roundTime = Math.max(10, Math.min(300, Math.floor(newSettings.roundTime)));
    }

    if (typeof newSettings.showHints === 'boolean') {
      safeSettings.showHints = newSettings.showHints;
    }

    if (typeof newSettings.categoryFilter === 'string') {
      safeSettings.categoryFilter = newSettings.categoryFilter.trim().slice(0, 30);
    }

    this.settings = { ...this.settings, ...safeSettings };
    this.broadcastState();
  }

  // --- Game Flow ---
  startGame(socketId) {
    if (socketId !== this.hostId) return;
    if (this.players.size < 1) return;

    // Reset scores
    for (const player of this.players.values()) {
      player.score = 0;
      player.roundsWon = 0;
      player.streak = 0;
    }

    // Select random puzzles for the game
    const shuffled = [...allPuzzles].sort(() => Math.random() - 0.5);
    const roundCount = Math.min(this.settings.totalRounds, shuffled.length);
    this.rounds = shuffled.slice(0, roundCount);
    this.currentRoundIndex = 0;

    this.addSystemMessage(`🎮 Game started! ${roundCount} rounds total. Get ready!`);
    this.startRound();
  }

  startRound() {
    this.clearTimers();
    this.state = 'playing';
    this.roundWinner = null;
    this.roundEndReason = null;
    this.timeLeft = this.settings.roundTime;

    // Reset player round answers
    for (const player of this.players.values()) {
      player.hasAnswered = false;
      player.lastGuess = null;
      player.isCorrect = false;
    }

    this.currentPuzzle = this.rounds[this.currentRoundIndex];
    this.broadcastState();

    // Start countdown
    this.timerInterval = setInterval(() => {
      this.timeLeft -= 1;
      this.io.to(this.roomCode).emit('timer_tick', { timeLeft: this.timeLeft });

      if (this.timeLeft <= 0) {
        this.endRound('timeout');
      }
    }, 1000);

    // Schedule bot answers
    this.scheduleBots();
  }

  scheduleBots() {
    const bots = Array.from(this.players.values()).filter(p => p.isBot);
    bots.forEach(bot => {
      // Pick a random delay within round time (between 12s and roundTime - 5s)
      const maxDelay = Math.max(12, this.settings.roundTime - 5);
      const delay = Math.floor(Math.random() * (maxDelay - 10) + 10) * 1000;

      const timeout = setTimeout(() => {
        if (this.state !== 'playing' || bot.hasAnswered) return;

        // 35% chance to answer correctly, 65% funny plausible guess
        const willSolve = Math.random() < 0.35;
        let guess = '';
        if (willSolve) {
          guess = this.currentPuzzle.answer;
        } else {
          const fakeGuesses = [
            'Looking closely...',
            'Coffee break?',
            'Over the top',
            'Cross roads',
            'Double vision',
            'Brain freeze',
            'Teamwork'
          ];
          guess = fakeGuesses[Math.floor(Math.random() * fakeGuesses.length)];
        }

        this.processAnswer(bot.id, guess);
      }, delay);

      this.botTimeouts.push(timeout);
    });
  }

  processAnswer(socketId, guessText) {
    if (this.state !== 'playing') return;
    const player = this.players.get(socketId);
    if (!player) return;

    const trimmed = typeof guessText === 'string' ? guessText.trim().slice(0, 200) : (typeof guessText === 'number' ? String(guessText).trim() : '');
    if (!trimmed) return;

    // Player already answered correctly this round
    if (player.isCorrect) return;

    const { isCorrect, isClose } = checkAnswer(trimmed, this.currentPuzzle);
    player.lastGuess = trimmed;

    if (isCorrect) {
      // Player got it correct!
      player.hasAnswered = true;
      player.isCorrect = true;
      player.roundsWon += 1;
      player.streak += 1;

      // Speed bonus: 100 base + 2 points per remaining second
      const speedBonus = Math.max(0, Math.floor(this.timeLeft * 2));
      const points = 100 + speedBonus;
      player.score += points;

      this.roundWinner = {
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        pointsAwarded: points,
        speedBonus,
        timeTaken: this.settings.roundTime - this.timeLeft
      };

      this.addChat({
        senderId: player.id,
        senderName: player.name,
        avatar: player.avatar,
        text: `💡 Solved it! "${trimmed}" (+${points} pts)`,
        type: 'correct'
      });

      // User requirement: "until one person gets the correct answer"
      this.endRound('solved');
    } else {
      // Player submitted an answer (even if incorrect)
      player.hasAnswered = true;

      if (isClose) {
        // Send close notification
        this.io.to(player.id).emit('guess_feedback', {
          isClose: true,
          message: `"${trimmed}" is SO close! Check spelling or word form.`
        });
      }

      this.addChat({
        senderId: player.id,
        senderName: player.name,
        avatar: player.avatar,
        text: trimmed,
        type: 'guess',
        isClose
      });

      // User requirement: "or until everyone keyed in their answer"
      this.checkAllAnsweredCondition();
    }

    this.broadcastState();
  }

  checkAllAnsweredCondition() {
    if (this.state !== 'playing') return;

    const activePlayers = Array.from(this.players.values()).filter(p => p.connected);
    if (activePlayers.length === 0) return;

    const allAnswered = activePlayers.every(p => p.hasAnswered);
    if (allAnswered) {
      this.endRound('all_answered');
    }
  }

  endRound(reason) {
    if (this.state !== 'playing') return;
    this.clearTimers();
    this.state = 'round_end';
    this.roundEndReason = reason;

    // Reset streaks for players who didn't get it right
    for (const player of this.players.values()) {
      if (!player.isCorrect) {
        player.streak = 0;
      }
    }

    // Prepare announcement
    if (reason === 'solved') {
      this.addSystemMessage(`🎉 ${this.roundWinner.name} solved it! The answer was: "${this.currentPuzzle.answer}"`);
    } else if (reason === 'all_answered') {
      this.addSystemMessage(`👥 Everyone keyed in an answer! The correct answer was: "${this.currentPuzzle.answer}"`);
    } else {
      this.addSystemMessage(`⏰ Time's up! The correct answer was: "${this.currentPuzzle.answer}"`);
    }

    this.broadcastState();

    // Auto advance to next round after 6 seconds
    this.roundEndTimeout = setTimeout(() => {
      this.nextRound();
    }, 6000);
  }

  skipToNext(socketId) {
    if (socketId !== this.hostId) return;
    if (this.state === 'round_end') {
      if (this.roundEndTimeout) clearTimeout(this.roundEndTimeout);
      this.nextRound();
    } else if (this.state === 'playing') {
      this.endRound('timeout');
    }
  }

  nextRound() {
    this.currentRoundIndex += 1;
    if (this.currentRoundIndex >= this.rounds.length) {
      this.endGame();
    } else {
      this.startRound();
    }
  }

  endGame() {
    this.clearTimers();
    this.state = 'game_over';

    // Rank players
    const ranked = Array.from(this.players.values()).sort((a, b) => b.score - a.score);
    const winner = ranked[0];

    if (winner && winner.score > 0) {
      this.addSystemMessage(`🏆 Game Over! Winner: ${winner.name} with ${winner.score} points!`);
    } else {
      this.addSystemMessage(`🏆 Game Over! Thanks for playing!`);
    }

    this.broadcastState();
  }

  resetToLobby(socketId) {
    if (socketId !== this.hostId) return;
    this.clearTimers();
    this.state = 'lobby';
    this.currentRoundIndex = -1;
    this.currentPuzzle = null;
    this.roundWinner = null;
    this.roundEndReason = null;

    for (const player of this.players.values()) {
      player.score = 0;
      player.roundsWon = 0;
      player.streak = 0;
      player.hasAnswered = false;
      player.lastGuess = null;
      player.isCorrect = false;
    }

    this.addSystemMessage('Room returned to lobby. Ready for another game!');
    this.broadcastState();
  }

  // --- Chat and Messages ---
  addChat(msg) {
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...msg
    };
    this.chatMessages.push(message);
    if (this.chatMessages.length > 80) {
      this.chatMessages.shift();
    }
    this.io.to(this.roomCode).emit('new_message', message);
  }

  addSystemMessage(text) {
    this.addChat({
      senderId: 'system',
      senderName: 'Host Robot',
      avatar: '📢',
      text,
      type: 'system'
    });
  }

  sendReaction(socketId, emoji) {
    const player = this.players.get(socketId);
    if (!player || typeof emoji !== 'string') return;
    const safeEmoji = emoji.trim().slice(0, 8);
    if (!safeEmoji) return;
    this.io.to(this.roomCode).emit('player_reaction', {
      playerId: player.id,
      playerName: player.name,
      avatar: player.avatar,
      emoji: safeEmoji
    });
  }

  clearTimers() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.roundEndTimeout) clearTimeout(this.roundEndTimeout);
    this.botTimeouts.forEach(t => clearTimeout(t));
    this.botTimeouts = [];
  }

  // --- State Broadcast ---
  getPublicState() {
    const playerList = Array.from(this.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      roundsWon: p.roundsWon,
      streak: p.streak,
      hasAnswered: p.hasAnswered,
      isCorrect: p.isCorrect,
      isHost: p.isHost,
      isBot: p.isBot
    }));

    // Mask puzzle answer during 'playing' state to prevent cheating via DevTools inspect
    let sanitizedPuzzle = null;
    if (this.currentPuzzle) {
      if (this.state === 'playing') {
        sanitizedPuzzle = {
          id: this.currentPuzzle.id,
          image: this.currentPuzzle.image,
          category: this.currentPuzzle.category,
          hint: this.settings.showHints ? this.currentPuzzle.hint : null,
          letter_pattern: this.settings.showHints ? this.currentPuzzle.letter_pattern : null,
          word_lengths: this.currentPuzzle.word_lengths
        };
      } else {
        // In round_end or game_over, reveal the full answer
        sanitizedPuzzle = this.currentPuzzle;
      }
    }

    return {
      roomCode: this.roomCode,
      state: this.state,
      hostId: this.hostId,
      players: playerList,
      settings: this.settings,
      currentRound: this.currentRoundIndex + 1,
      totalRounds: this.rounds.length || this.settings.totalRounds,
      puzzle: sanitizedPuzzle,
      timeLeft: this.timeLeft,
      roundWinner: this.roundWinner,
      roundEndReason: this.roundEndReason,
      answeredCount: playerList.filter(p => p.hasAnswered).length,
      totalPlayerCount: playerList.length
    };
  }

  broadcastState() {
    const state = this.getPublicState();
    this.io.to(this.roomCode).emit('room_state', state);
  }
}

module.exports = GameRoom;
