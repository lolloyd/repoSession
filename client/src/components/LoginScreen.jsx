import React, { useState, useEffect } from 'react';
import { Users, Sparkles, ArrowRight, Dice5 } from 'lucide-react';
import { sounds } from '../utils/sound';

const AVATARS = ['🦊', '🐱', '🦁', '🐼', '🦉', '🦄', '🤖', '🚀', '⚡', '🍕', '🎨', '☕'];

export default function LoginScreen({ onJoinRoom, initialRoomCode }) {
  const [name, setName] = useState(() => localStorage.getItem('rebus_player_name') || '');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('rebus_player_avatar') || '🦊');
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [mode, setMode] = useState(initialRoomCode ? 'join' : 'create');

  useEffect(() => {
    if (initialRoomCode) {
      setRoomCode(initialRoomCode);
      setMode('join');
    }
  }, [initialRoomCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim() || 'Puzzle Master';
    localStorage.setItem('rebus_player_name', trimmedName);
    localStorage.setItem('rebus_player_avatar', avatar);

    let targetCode = roomCode.trim().toUpperCase();
    if (mode === 'create' && !targetCode) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      targetCode = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    sounds.init();
    sounds.playTone(523, 'triangle', 0.1, 0.15);
    onJoinRoom({ roomCode: targetCode, playerName: trimmedName, avatar });
  };

  const handleRandomizeAvatar = () => {
    const next = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    setAvatar(next);
  };

  return (
    <div style={{
      maxWidth: '520px',
      margin: '40px auto',
      padding: '0 20px',
      width: '100%'
    }}>
      <div className="glass-panel" style={{ padding: '36px 30px', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--c-rose-bg)',
            border: '1px solid var(--c-rose-border)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            color: 'var(--c-rose-dark)',
            fontWeight: 800,
            marginBottom: '14px'
          }}>
            <Sparkles size={14} /> Team Building & Trivia
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.1rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '6px',
            color: 'var(--text-primary)'
          }}>
            Join the Rebus Arena
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Compete in real time against your teammates to solve visual rebus puzzles!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avatar Selection */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Pick Your Avatar
              </label>
              <button
                type="button"
                onClick={handleRandomizeAvatar}
                style={{
                  background: 'none',
                  color: 'var(--c-seafoam-dark)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Dice5 size={14} /> Random
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px'
            }}>
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  aria-label={`Select avatar ${av}`}
                  title={`Select ${av}`}
                  style={{
                    background: avatar === av ? 'var(--c-seafoam-bg)' : '#ffffff',
                    border: avatar === av ? '2px solid var(--c-seafoam)' : '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '8px 0',
                    fontSize: '1.5rem',
                    transform: avatar === av ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: avatar === av ? '0 4px 12px rgba(163, 199, 187, 0.4)' : 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Player Name */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              marginBottom: '8px'
            }}>
              Your Name / Team Handle
            </label>
            <input
              type="text"
              required
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sarah (Product), Alex, David"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1.5px solid var(--border-color-strong)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--c-seafoam)';
                e.target.style.boxShadow = '0 0 0 3px rgba(163, 199, 187, 0.35)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color-strong)';
                e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
              }}
            />
          </div>

          {/* Mode Switch: Create vs Join (Using #ebd9b3 Vanilla & #ffffff) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'var(--c-vanilla-bg)',
            border: '1px solid var(--c-vanilla-border)',
            padding: '5px',
            borderRadius: '14px',
            marginBottom: '18px'
          }}>
            <button
              type="button"
              onClick={() => setMode('create')}
              style={{
                padding: '9px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                background: mode === 'create' ? '#ffffff' : 'transparent',
                color: mode === 'create' ? 'var(--c-vanilla-dark)' : 'var(--text-muted)',
                boxShadow: mode === 'create' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Create New Room
            </button>
            <button
              type="button"
              onClick={() => setMode('join')}
              style={{
                padding: '9px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.88rem',
                background: mode === 'join' ? '#ffffff' : 'transparent',
                color: mode === 'join' ? 'var(--c-vanilla-dark)' : 'var(--text-muted)',
                boxShadow: mode === 'join' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Join Existing Room
            </button>
          </div>

          {/* Room Code Field */}
          {mode === 'join' ? (
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}>
                Room Code
              </label>
              <input
                type="text"
                required
                maxLength={12}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. TEAM7, ABCDE"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1.5px solid var(--border-color-strong)',
                  color: 'var(--c-seafoam-dark)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
                }}
              />
            </div>
          ) : (
            <div style={{
              marginBottom: '24px',
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--c-sage-bg)',
              border: '1px dashed var(--c-sage)',
              fontSize: '0.86rem',
              color: 'var(--c-sage-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Users size={18} color="var(--c-sage-dark)" />
              <span>A shareable team room code will be generated for your coworkers.</span>
            </div>
          )}

          {/* Submit Button with Palette Gradient: Rose -> Peach */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #d19999 0%, #e8b5a2 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.02rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(209, 153, 153, 0.45)'
            }}
          >
            <span>{mode === 'create' ? 'Create Team Room' : 'Enter Team Room'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        💡 96 rebus visual puzzles included from the official workbook.
      </div>
    </div>
  );
}
