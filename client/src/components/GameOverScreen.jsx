import React, { useEffect, useMemo, memo } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Crown } from 'lucide-react';
import { sounds } from '../utils/sound';

function GameOverScreen({
  roomState,
  onResetLobby,
  isHost
}) {
  const { players } = roomState;
  const ranked = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players]
  );
  const winner = ranked[0];

  useEffect(() => {
    sounds.playVictory();
    // Confetti blast with the custom 5-color palette!
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#d19999', '#e8b5a2', '#ebd9b3', '#bcd4a5', '#a3c7bb']
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <div style={{
      maxWidth: '720px',
      margin: '24px auto',
      padding: '0 20px',
      width: '100%'
    }}>
      <div className="glass-panel animate-pop" style={{ padding: '38px 30px', textAlign: 'center' }}>
        {/* Celebration Header */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--c-vanilla-bg)',
          border: '1.5px solid var(--c-vanilla-border)',
          color: 'var(--c-vanilla-dark)',
          padding: '6px 18px',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 800,
          marginBottom: '14px'
        }}>
          <Trophy size={16} color="var(--c-vanilla-dark)" /> GAME OVER - FINAL RESULTS!
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.4rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          {winner && winner.score > 0 ? `${winner.name} Wins!` : 'Great Match, Team!'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
          Awesome puzzle solving! Here is how everyone stacked up on the leaderboard:
        </p>

        {/* Podium for Top 3 */}
        {ranked.length >= 2 && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '16px',
            margin: '24px 0 36px 0',
            padding: '0 10px'
          }}>
            {/* 2nd Place: Seafoam #a3c7bb */}
            {ranked[1] && (
              <div style={{
                flex: 1,
                maxWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{ranked[1].avatar}</div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                  {ranked[1].name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--c-seafoam-dark)', fontWeight: 700 }}>{ranked[1].score} pts</div>
                <div style={{
                  width: '100%',
                  height: '90px',
                  background: 'linear-gradient(180deg, var(--c-seafoam-bg) 0%, rgba(163, 199, 187, 0.45) 100%)',
                  border: '1.5px solid var(--c-seafoam-border)',
                  borderRadius: '16px 16px 0 0',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'var(--c-seafoam-dark)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  🥈 2nd
                </div>
              </div>
            )}

            {/* 1st Place: Vanilla #ebd9b3 */}
            {ranked[0] && (
              <div style={{
                flex: 1.1,
                maxWidth: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ position: 'relative' }}>
                  <Crown size={24} color="var(--c-vanilla-dark)" fill="var(--c-vanilla-dark)" style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)' }} />
                  <div style={{ fontSize: '3.2rem', marginBottom: '4px' }}>{ranked[0].avatar}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--c-vanilla-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                  {ranked[0].name}
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 800 }}>{ranked[0].score} pts</div>
                <div style={{
                  width: '100%',
                  height: '130px',
                  background: 'linear-gradient(180deg, var(--c-vanilla-bg) 0%, rgba(235, 217, 179, 0.55) 100%)',
                  border: '2px solid var(--c-vanilla-border)',
                  borderRadius: '20px 20px 0 0',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: 'var(--c-vanilla-dark)',
                  boxShadow: '0 8px 24px rgba(235, 217, 179, 0.45)'
                }}>
                  🥇 1st
                </div>
              </div>
            )}

            {/* 3rd Place: Peach #e8b5a2 */}
            {ranked[2] && (
              <div style={{
                flex: 1,
                maxWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>{ranked[2].avatar}</div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                  {ranked[2].name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--c-peach-dark)', fontWeight: 700 }}>{ranked[2].score} pts</div>
                <div style={{
                  width: '100%',
                  height: '70px',
                  background: 'linear-gradient(180deg, var(--c-peach-bg) 0%, rgba(232, 181, 162, 0.45) 100%)',
                  border: '1.5px solid var(--c-peach-border)',
                  borderRadius: '16px 16px 0 0',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--c-peach-dark)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  🥉 3rd
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Team Score List */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '14px',
          marginBottom: '26px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {ranked.map((p, idx) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderBottom: idx === ranked.length - 1 ? 'none' : '1px solid #f5f5f4'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-muted)', width: '20px' }}>
                  #{idx + 1}
                </span>
                <span style={{ fontSize: '1.4rem' }}>{p.avatar}</span>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{p.name}</span>
                {p.roundsWon > 0 && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-sage-dark)', background: 'var(--c-sage-bg)', border: '1px solid var(--c-sage-border)', padding: '2px 8px', borderRadius: '6px' }}>
                    {p.roundsWon} {p.roundsWon === 1 ? 'solve' : 'solves'}
                  </span>
                )}
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--c-seafoam-dark)' }}>
                {p.score} pts
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {isHost ? (
          <button
            onClick={onResetLobby}
            style={{
              padding: '15px 30px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #d19999 0%, #e8b5a2 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.02rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(209, 153, 153, 0.45)'
            }}
          >
            <RotateCcw size={18} />
            <span>Play Again with Fresh Puzzles</span>
          </button>
        ) : (
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Waiting for host to restart room for another match...
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(GameOverScreen);
