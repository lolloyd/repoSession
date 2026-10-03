import React, { memo } from 'react';
import { Trophy, Flame, CheckCircle, Clock, Crown } from 'lucide-react';

/**
 * ⚡ Bolt Optimization:
 * Memoize Scoreboard to avoid re-rendering every second during timer ticks when player scores/statuses haven't changed.
 */
function Scoreboard({ players, currentUserId, isPlaying }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="glass-panel" style={{
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '10px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="var(--c-peach-dark)" />
          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>Team Leaderboard</span>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          {players.length} {players.length === 1 ? 'Player' : 'Players'}
        </span>
      </div>

      {/* Players List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sortedPlayers.map((p, idx) => {
          const isMe = p.id === currentUserId;
          const isLeader = idx === 0 && p.score > 0;

          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '14px',
                background: isMe ? 'var(--c-seafoam-bg)' : '#ffffff',
                border: isMe ? '2px solid var(--c-seafoam)' : '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Left info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: isLeader ? 'var(--c-peach-dark)' : 'var(--text-muted)',
                  width: '18px',
                  textAlign: 'center'
                }}>
                  {idx + 1}
                </span>

                <div style={{
                  fontSize: '1.5rem',
                  position: 'relative'
                }}>
                  {p.avatar}
                  {p.isHost && (
                    <span style={{ position: 'absolute', top: '-8px', right: '-6px' }} title="Room Host">
                      <Crown size={12} color="var(--c-vanilla-dark)" fill="var(--c-vanilla-dark)" />
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontWeight: isMe ? 800 : 700,
                      fontSize: '0.88rem',
                      color: isMe ? 'var(--c-seafoam-dark)' : 'var(--text-primary)'
                    }}>
                      {p.name} {isMe && '(You)'}
                    </span>
                    {p.isBot && (
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: '#f5f5f4',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        color: 'var(--text-muted)'
                      }}>
                        AI
                      </span>
                    )}
                  </div>

                  {/* Status during gameplay */}
                  {isPlaying && (
                    <div style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      {p.isCorrect ? (
                        <span style={{ color: 'var(--c-sage-dark)', fontWeight: 700 }}>Solved! 🎉</span>
                      ) : p.hasAnswered ? (
                        <span style={{ color: 'var(--c-seafoam-dark)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                          <CheckCircle size={11} color="var(--c-seafoam-dark)" /> Answered
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} /> Thinking...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right info: Score + Streak */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {p.streak > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '0.75rem',
                    color: 'var(--c-rose-dark)',
                    background: 'var(--c-rose-bg)',
                    border: '1px solid var(--c-rose-border)',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontWeight: 800
                  }} title={`${p.streak} answers in a row!`}>
                    <Flame size={12} fill="var(--c-rose-dark)" color="var(--c-rose-dark)" />
                    <span>{p.streak}</span>
                  </div>
                )}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: isLeader ? 'var(--c-peach-dark)' : 'var(--text-primary)'
                }}>
                  {p.score} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>pts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(Scoreboard);
