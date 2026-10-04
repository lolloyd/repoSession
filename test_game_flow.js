const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const ioClient = require('./client/node_modules/socket.io-client');
const RoomManager = require('./server/roomManager');
const allPuzzles = require('./server/data/puzzles.json');

async function runTest() {
  console.log('🚀 Starting Automated Multiplayer Game Flow Test...');
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });
  const roomManager = new RoomManager(io);

  io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
      const { roomCode, playerName, avatar } = data || {};
      const { room, player } = roomManager.joinRoom(socket, roomCode, playerName, avatar);
      socket.emit('join_success', { roomCode: room.roomCode, playerId: player.id });
    });
    socket.on('start_game', () => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (room) room.startGame(socket.id);
    });
    socket.on('submit_answer', (data) => {
      const { answer } = data || {};
      const room = roomManager.getRoomBySocket(socket.id);
      if (room) room.processAnswer(socket.id, answer);
    });
    socket.on('send_reaction', (data) => {
      const { emoji } = data || {};
      const room = roomManager.getRoomBySocket(socket.id);
      if (room) room.sendReaction(socket.id, emoji);
    });
    socket.on('skip_round', () => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (room) room.skipToNext(socket.id);
    });
    socket.on('update_settings', (settings) => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (room) room.updateSettings(settings, socket.id);
    });
    socket.on('add_bot', () => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (room) room.addBot(socket.id);
    });
    socket.on('remove_bot', (data) => {
      const { botId } = data || {};
      const room = roomManager.getRoomBySocket(socket.id);
      if (room) room.removeBot(botId, socket.id);
    });
    socket.on('disconnect', () => {
      roomManager.leaveRoom(socket);
    });
  });

  const TEST_PORT = 3999;
  await new Promise(resolve => server.listen(TEST_PORT, resolve));
  console.log(`Server listening on port ${TEST_PORT}`);

  const client1 = ioClient(`http://localhost:${TEST_PORT}`);
  const client2 = ioClient(`http://localhost:${TEST_PORT}`);

  let p1State = null;
  let p2State = null;

  client1.on('room_state', (s) => { p1State = s; });
  client2.on('room_state', (s) => { p2State = s; });

  await new Promise(r => setTimeout(r, 200));

  // Step 1: Join room
  console.log('1. Joining room TESTROOM...');
  client1.emit('join_room', { roomCode: 'TESTROOM', playerName: 'Alice', avatar: '🦊' });
  await new Promise(r => setTimeout(r, 200));
  client2.emit('join_room', { roomCode: 'TESTROOM', playerName: 'Bob', avatar: '🦁' });
  await new Promise(r => setTimeout(r, 300));

  if (p1State.players.length !== 2) throw new Error('Failed to join 2 players');
  console.log('✓ Both players joined room successfully.');

  // Step 1.5: Security Authorization - Non-host cannot add/remove bots while in lobby
  console.log('1.5 Testing Security Authorization for Bot Management in Lobby...');
  // Bob (client2) is not host and tries to add a bot
  client2.emit('add_bot');
  await new Promise(r => setTimeout(r, 200));
  if (p1State.players.some(p => p.isBot)) {
    throw new Error('Non-host player was allowed to add a bot!');
  }

  // Alice (client1) is host and adds a bot
  client1.emit('add_bot');
  await new Promise(r => setTimeout(r, 200));
  const botPlayer = p1State.players.find(p => p.isBot);
  if (!botPlayer) {
    throw new Error('Host was unable to add a bot!');
  }

  // Bob tries to remove the bot
  client2.emit('remove_bot', { botId: botPlayer.id });
  await new Promise(r => setTimeout(r, 200));
  if (!p1State.players.some(p => p.id === botPlayer.id)) {
    throw new Error('Non-host player was allowed to remove a bot!');
  }

  // Alice removes the bot
  client1.emit('remove_bot', { botId: botPlayer.id });
  await new Promise(r => setTimeout(r, 200));
  if (p1State.players.some(p => p.id === botPlayer.id)) {
    throw new Error('Host was unable to remove a bot!');
  }

  console.log('✓ VERIFIED: Bot management correctly restricted to host only in lobby!');

  // Step 2: Start Game
  console.log('2. Alice (Host) starts the game...');
  client1.emit('start_game');
  await new Promise(r => setTimeout(r, 400));

  if (p1State.state !== 'playing') throw new Error('Game did not enter playing state');
  console.log(`✓ Game is playing! Current round: ${p1State.currentRound}, puzzle #${p1State.puzzle.id}`);
  console.log(`  Answers sanitized: answer field is hidden (${p1State.puzzle.answer === undefined})`);

  // Step 3: Test "Everyone keyed in an answer" condition
  console.log('3. Testing Condition: "Round ends when everyone keyed in their answer"...');
  console.log('   Alice submits wrong guess: "Wrong Apple"');
  client1.emit('submit_answer', { answer: 'Wrong Apple' });
  await new Promise(r => setTimeout(r, 300));

  console.log(`   After Alice answered: answeredCount=${p1State.answeredCount}/2, state=${p1State.state}`);
  if (p1State.state !== 'playing') throw new Error('Round ended prematurely before all answered!');

  console.log('   Bob submits wrong guess: "Wrong Banana"');
  client2.emit('submit_answer', { answer: 'Wrong Banana' });
  await new Promise(r => setTimeout(r, 500));

  console.log(`   After Bob answered: state=${p1State.state}, reason=${p1State.roundEndReason}`);
  if (p1State.state !== 'round_end' || p1State.roundEndReason !== 'all_answered') {
    throw new Error('Round did not end when all players keyed in an answer!');
  }
  console.log(`✓ VERIFIED: Round ended with reason "${p1State.roundEndReason}" because all 2 players answered!`);
  console.log(`  Revealed answer: "${p1State.puzzle.answer}"`);

  // Step 4: Advance to next round and test "Until one person gets correct answer"
  console.log('4. Advancing to next round...');
  client1.emit('skip_round');
  await new Promise(r => setTimeout(r, 400));

  if (p1State.state !== 'playing') throw new Error('Failed to advance to next round');
  console.log(`✓ Round ${p1State.currentRound} started. Puzzle #${p1State.puzzle.id}`);

  // Find the correct answer for current puzzle from full dataset
  const currentPuzzleData = allPuzzles.find(p => p.id === p1State.puzzle.id);
  const correctAnswer = currentPuzzleData.answer;

  console.log('5. Testing Condition: "Round ends when one person gets the correct answer"...');
  console.log(`   Alice submits the correct answer: "${correctAnswer}"`);
  client1.emit('submit_answer', { answer: correctAnswer });
  await new Promise(r => setTimeout(r, 500));

  console.log(`   After Alice answered correctly: state=${p1State.state}, reason=${p1State.roundEndReason}`);
  if (p1State.state !== 'round_end' || p1State.roundEndReason !== 'solved') {
    throw new Error('Round did not end immediately upon correct answer!');
  }
  if (!p1State.roundWinner || p1State.roundWinner.name !== 'Alice') {
    throw new Error('Winner was not designated to Alice');
  }

  console.log(`✓ VERIFIED: Round ended immediately! Solver: ${p1State.roundWinner.name} (+${p1State.roundWinner.pointsAwarded} pts)`);
  const alicePlayer = p1State.players.find(p => p.name === 'Alice');
  console.log(`✓ Alice score: ${alicePlayer.score} pts, streak: ${alicePlayer.streak}`);

  // Step 6: Security - Malformed payload resilience check
  console.log('6. Testing Security Resilience with malformed socket inputs...');
  client1.emit('submit_answer', null);
  client1.emit('submit_answer', { answer: 12345 });
  client1.emit('send_reaction', null);
  client1.emit('send_reaction', { emoji: 9999 });
  client1.emit('update_settings', null);
  client1.emit('update_settings', { totalRounds: 'invalid', roundTime: -100, categoryFilter: 123 });
  client1.emit('update_settings', { totalRounds: 5, roundTime: 30, showHints: false });
  await new Promise(r => setTimeout(r, 200));
  if (p1State.settings.totalRounds !== 5 || p1State.settings.roundTime !== 30 || p1State.settings.showHints !== false) {
    throw new Error('Valid settings update failed after malformed attempts');
  }
  console.log('✓ VERIFIED: Server survived malformed inputs and settings without crashing!');


  // Cleanup
  client1.disconnect();
  client2.disconnect();
  server.close();
  console.log('\n🎉 ALL MULTIPLAYER GAME ENGINE TESTS PASSED PERFECTLY!');
  process.exit(0);
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
