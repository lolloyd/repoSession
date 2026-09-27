import React from 'react';
import { Play, Users, Settings, Plus, Trash2, Sparkles, Share2, Check } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function LobbyScreen({
  roomCode,
  players,
  currentUserId,
  isHost,
  settings,
  onStartGame,
  onUpdateSettings,
  onAddBot,
  onRemoveBot
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    sounds.playGameStart();
    onStartGame();
  };

  return (
    <div style={{
      maxWidth: '980px',
      margin: '24px auto',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)',
      gap: '24px'
    }}>
      {/* Left: Team Members Gathering */}
      <div className="glass-panel" style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Room Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Users size={20} color="var(--c-seafoam-dark)" />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Team Room Lobby
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Gather your teammates or invite coworkers via link.
            </p>
          </div>

          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: copied ? 'var(--c-sage-bg)' : 'var(--c-seafoam-bg)',
              border: copied ? '1px solid var(--c-sage-border)' : '1px solid var(--c-seafoam-border)',
              color: copied ? 'var(--c-sage-dark)' : 'var(--c-seafoam-dark)',
              padding: '8px 14px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? 'Link Copied!' : 'Share Room Link'}</span>
          </button>
        </div>

        {/* Players Grid */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              Connected Players ({players.length})
            </span>
            {isHost && (
              <button
                onClick={onAddBot}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color-strong)',
                  color: 'var(--c-seafoam-dark)',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Plus size={13} /> Add AI Teammate
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px'
          }}>
            {players.map((p) => {
              const isMe = p.id === currentUserId;
              return (
                <div
                  key={p.id}
                  style={{
                    background: isMe ? 'var(--c-seafoam-bg)' : '#ffffff',
                    border: isMe ? '2px solid var(--c-seafoam)' : '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    position: 'relative',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ fontSize: '2.1rem', flexShrink: 0 }}>
                    {p.avatar}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      color: isMe ? 'var(--c-seafoam-dark)' : 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {p.name} {isMe && '(You)'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {p.isHost ? '👑 Host' : p.isBot ? '🤖 AI Teammate' : 'Ready'}
                    </div>
                  </div>

                  {isHost && p.isBot && (
                    <button
                      onClick={() => onRemoveBot(p.id)}
                      aria-label={`Remove ${p.name}`}
                      title="Remove AI Teammate"
                      style={{
                        background: 'none',
                        color: 'var(--c-rose-dark)',
                        padding: '4px'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rule Highlight Card in Sage (#bcd4a5) */}
        <div style={{
          background: 'var(--c-sage-bg)',
          border: '1.5px solid var(--c-sage-border)',
          borderRadius: '16px',
          padding: '16px 18px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Sparkles size={20} color="var(--c-sage-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--c-sage-dark)', marginBottom: '2px' }}>
              How This Battle Works:
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--c-sage-dark)', lineHeight: '1.5', opacity: 0.95 }}>
              Each rebus puzzle appears on screen. The round ends immediately when{' '}
              <strong>one person gets the correct answer</strong> OR when{' '}
              <strong>everyone has keyed in their answer</strong>! Fast answers earn speed bonuses.
            </p>
          </div>
        </div>

        {/* Start Game Action (Gradient: Sage #bcd4a5 -> Seafoam #a3c7bb) */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          {isHost ? (
            <button
              onClick={handleStart}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #bcd4a5 0%, #a3c7bb 100%)',
                color: '#1c1917',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.15rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(163, 199, 187, 0.45)'
              }}
            >
              <Play size={20} fill="#1c1917" />
              <span>Start Team Game</span>
            </button>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '14px',
              background: '#f5f5f4',
              borderRadius: '14px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}>
              ⏳ Waiting for the room host to start the game...
            </div>
          )}
        </div>
      </div>

      {/* Right: Room Settings & Rules */}
      <div className="glass-panel" style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
          <Settings size={18} color="var(--c-peach-dark)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Game Settings</h3>
        </div>

        {/* Rounds Setting */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Number of Puzzles
            </label>
            <span style={{ fontWeight: 800, color: 'var(--c-peach-dark)' }}>{settings.totalRounds} Rounds</span>
          </div>
          {isHost ? (
            <input
              type="range"
              min={3}
              max={25}
              step={1}
              value={settings.totalRounds}
              onChange={(e) => onUpdateSettings({ totalRounds: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--c-peach)' }}
            />
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Set by host</div>
          )}
        </div>

        {/* Round Timer Setting */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Time per Puzzle
            </label>
            <span style={{ fontWeight: 800, color: 'var(--c-peach-dark)' }}>{settings.roundTime}s</span>
          </div>
          {isHost ? (
            <input
              type="range"
              min={20}
              max={90}
              step={5}
              value={settings.roundTime}
              onChange={(e) => onUpdateSettings({ roundTime: parseInt(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--c-peach)' }}
            />
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Set by host</div>
          )}
        </div>

        {/* Hints Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>Show Letter Blanks</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Displays pattern like: _ _ _ _ _ _ _ _</div>
          </div>
          {isHost ? (
            <input
              type="checkbox"
              checked={settings.showHints}
              onChange={(e) => onUpdateSettings({ showHints: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: 'var(--c-seafoam)', cursor: 'pointer' }}
            />
          ) : (
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: settings.showHints ? 'var(--c-sage-dark)' : 'var(--text-muted)' }}>
              {settings.showHints ? 'Enabled' : 'Disabled'}
            </span>
          )}
        </div>

        {/* Quick Tips in Vanilla #ebd9b3 */}
        <div style={{
          marginTop: 'auto',
          padding: '14px',
          background: 'var(--c-vanilla-bg)',
          border: '1px solid var(--c-vanilla-border)',
          borderRadius: '14px',
          fontSize: '0.82rem',
          color: 'var(--c-vanilla-dark)',
          lineHeight: '1.5'
        }}>
          💡 <strong>Pro-tip for Teams:</strong> You can type guesses into the answer box or directly in the chat room to keep the team banter high!
        </div>
      </div>
    </div>
  );
}
