import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import LoginScreen from './components/LoginScreen';
import LobbyScreen from './components/LobbyScreen';
import PlayingScreen from './components/PlayingScreen';
import Scoreboard from './components/Scoreboard';
import ChatFeed from './components/ChatFeed';
import RoundEndOverlay from './components/RoundEndOverlay';
import GameOverScreen from './components/GameOverScreen';
import HowToPlayModal from './components/HowToPlayModal';
import { sounds } from './utils/sound';

export default function App() {
  const [socket, setSocket] = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showRules, setShowRules] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [reactions, setReactions] = useState([]);

  // Check URL query parameters for ?room=CODE
  const urlParams = new URLSearchParams(window.location.search);
  const initialRoomCode = urlParams.get('room') || '';

  useEffect(() => {
    // Initialize Socket.io connection
    const newSocket = io({
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to game server, socket ID:', newSocket.id);
    });

    newSocket.on('join_success', ({ roomCode, playerId }) => {
      setCurrentUserId(playerId);
      // Update browser URL without reload to support sharing
      const newUrl = `${window.location.pathname}?room=${roomCode}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    });

    newSocket.on('room_state', (state) => {
      setRoomState(state);
    });

    newSocket.on('timer_tick', ({ timeLeft }) => {
      setRoomState((prev) => (prev ? { ...prev, timeLeft } : prev));
    });

    newSocket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('chat_history', (history) => {
      setMessages(history || []);
    });

    newSocket.on('guess_feedback', ({ message, isClose }) => {
      if (isClose) {
        sounds.playClose();
      }
      setFeedbackToast(message);
      setTimeout(() => setFeedbackToast(null), 3500);
    });

    newSocket.on('player_reaction', ({ emoji, playerName }) => {
      const id = Date.now() + Math.random();
      const x = Math.floor(Math.random() * 60) + 20; // 20% to 80% horizontal
      setReactions((prev) => [...prev, { id, emoji, playerName, x }]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 1800);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ⚡ Bolt Optimization: Memoize handlers with useCallback so React.memo child components
  // (Navbar, ChatFeed, Scoreboard) don't re-render when timer ticks update roomState.
  const handleOpenRules = useCallback(() => setShowRules(true), []);

  const handleJoinRoom = useCallback(({ roomCode, playerName, avatar }) => {
    if (socket) {
      socket.emit('join_room', { roomCode, playerName, avatar });
    }
  }, [socket]);

  const handleStartGame = useCallback(() => {
    if (socket) {
      socket.emit('start_game');
    }
  }, [socket]);

  const handleSubmitAnswer = useCallback((answer) => {
    if (socket) {
      socket.emit('submit_answer', { answer });
    }
  }, [socket]);

  const handleSendChat = useCallback((text) => {
    if (socket) {
      socket.emit('send_chat', { text });
    }
  }, [socket]);

  const handleSendReaction = useCallback((emoji) => {
    if (socket) {
      socket.emit('send_reaction', { emoji });
    }
  }, [socket]);

  const handleUpdateSettings = useCallback((settings) => {
    if (socket) {
      socket.emit('update_settings', settings);
    }
  }, [socket]);

  const handleAddBot = useCallback(() => {
    if (socket) {
      socket.emit('add_bot');
    }
  }, [socket]);

  const handleRemoveBot = useCallback((botId) => {
    if (socket) {
      socket.emit('remove_bot', { botId });
    }
  }, [socket]);

  const handleSkipRound = useCallback(() => {
    if (socket) {
      socket.emit('skip_round');
    }
  }, [socket]);

  const handleResetLobby = useCallback(() => {
    if (socket) {
      socket.emit('reset_lobby');
    }
  }, [socket]);

  const isHost = roomState?.hostId === currentUserId;
  const currentPlayer = useMemo(
    () => roomState?.players.find((p) => p.id === currentUserId),
    [roomState?.players, currentUserId]
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        roomCode={roomState?.roomCode}
        playerCount={roomState?.players.length || 0}
        onOpenRules={handleOpenRules}
        gameState={roomState?.state}
      />

      {/* Floating Reactions Layer */}
      {reactions.map((r) => (
        <div
          key={r.id}
          className="floating-reaction"
          style={{ left: `${r.x}%`, bottom: '100px' }}
        >
          {r.emoji}
        </div>
      ))}

      {/* Feedback Toast */}
      {feedbackToast && (
        <div
          className="animate-pop"
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--c-rose)',
            color: '#ffffff',
            border: '1.5px solid rgba(255, 255, 255, 0.6)',
            padding: '10px 20px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 10px 25px rgba(209, 153, 153, 0.45)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🔥</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main View Area */}
      <main style={{ flex: 1, padding: '16px' }}>
        {!roomState ? (
          /* 1. Login & Join View */
          <LoginScreen
            onJoinRoom={handleJoinRoom}
            initialRoomCode={initialRoomCode}
          />
        ) : roomState.state === 'lobby' ? (
          /* 2. Lobby View with Sidebar Chat */
          <div>
            <LobbyScreen
              roomCode={roomState.roomCode}
              players={roomState.players}
              currentUserId={currentUserId}
              isHost={isHost}
              settings={roomState.settings}
              onStartGame={handleStartGame}
              onUpdateSettings={handleUpdateSettings}
              onAddBot={handleAddBot}
              onRemoveBot={handleRemoveBot}
            />
            {/* Lobby Chat at bottom */}
            <div style={{ maxWidth: '960px', margin: '20px auto 0 auto' }}>
              <ChatFeed
                messages={messages}
                onSendMessage={handleSendChat}
                onSendReaction={handleSendReaction}
                currentPlayer={currentPlayer}
                isPlaying={false}
              />
            </div>
          </div>
        ) : roomState.state === 'game_over' ? (
          /* 3. Game Over Podium View */
          <GameOverScreen
            roomState={roomState}
            currentUserId={currentUserId}
            onResetLobby={handleResetLobby}
            isHost={isHost}
          />
        ) : (
          /* 4. Active Gameplay View (Playing & Round End) */
          <div style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)',
            gap: '20px',
            alignItems: 'start'
          }}>
            {/* Center: Puzzle & Answering Arena */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <PlayingScreen
                roomState={roomState}
                currentUserId={currentUserId}
                onSubmitAnswer={handleSubmitAnswer}
                onSkipRound={handleSkipRound}
                isHost={isHost}
              />

              {/* Round End Overlay */}
              {roomState.state === 'round_end' && (
                <RoundEndOverlay
                  roomState={roomState}
                  onSkipRound={handleSkipRound}
                  isHost={isHost}
                />
              )}
            </div>

            {/* Right: Team Scoreboard & Live Team Chat */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Scoreboard
                players={roomState.players}
                currentUserId={currentUserId}
                isPlaying={roomState.state === 'playing'}
              />

              <div style={{ height: '420px' }}>
                <ChatFeed
                  messages={messages}
                  onSendMessage={handleSendChat}
                  onSendReaction={handleSendReaction}
                  currentPlayer={currentPlayer}
                  isPlaying={roomState.state === 'playing'}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Rules Modal */}
      {showRules && (
        <HowToPlayModal onClose={() => setShowRules(false)} />
      )}
    </div>
  );
}
