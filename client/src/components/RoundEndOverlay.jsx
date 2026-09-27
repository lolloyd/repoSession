import React, { useEffect, useState } from 'react';
import { Trophy, Clock, FastForward, Users } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function RoundEndOverlay({
  roomState,
  onSkipRound,
  isHost
}) {
  const { puzzle, roundWinner, roundEndReason } = roomState;
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    if (roundEndReason === 'solved') {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [roundEndReason]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(251, 249, 245, 0.88)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div className="glass-panel animate-pop" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '36px 32px',
        textAlign: 'center',
        background: '#ffffff',
        border: '2px solid var(--border-color)',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Banner reason */}
        {roundEndReason === 'solved' && roundWinner ? (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--c-sage-bg)',
              border: '1.5px solid var(--c-sage-border)',
              color: 'var(--c-sage-dark)',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '10px'
            }}>
              <Trophy size={16} color="var(--c-sage-dark)" /> ROUND WINNER!
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--text-primary)'
            }}>
              <span style={{ fontSize: '2.2rem' }}>{roundWinner.avatar}</span>
              <span>{roundWinner.name} solved it!</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--c-sage-dark)', fontWeight: 700, marginTop: '4px' }}>
              +{roundWinner.pointsAwarded} pts (100 base + {roundWinner.speedBonus} speed bonus)
            </div>
          </div>
        ) : roundEndReason === 'all_answered' ? (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--c-peach-bg)',
              border: '1.5px solid var(--c-peach-border)',
              color: 'var(--c-peach-dark)',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '10px'
            }}>
              <Users size={16} color="var(--c-peach-dark)" /> ALL ANSWERS KEYED IN!
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Everyone Submitted Their Answer
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Nobody got the exact match, but everyone made their guess!
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--c-rose-bg)',
              border: '1.5px solid var(--c-rose-border)',
              color: 'var(--c-rose-dark)',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '10px'
            }}>
              <Clock size={16} color="var(--c-rose-dark)" /> TIME'S UP!
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Round Time Expired
            </h2>
          </div>
        )}

        {/* Puzzle Card & Reveal */}
        <div style={{
          background: 'var(--c-vanilla-bg)',
          border: '1.5px solid var(--c-vanilla-border)',
          borderRadius: '18px',
          padding: '22px',
          margin: '20px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          {puzzle?.image && (
            <img
              src={puzzle.image}
              alt="Solved Puzzle"
              style={{
                width: '160px',
                height: '160px',
                objectFit: 'contain',
                borderRadius: '16px',
                border: '2px solid #ffffff',
                background: '#ffffff',
                boxShadow: 'var(--shadow-md)'
              }}
            />
          )}

          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--c-vanilla-dark)', fontWeight: 800, letterSpacing: '0.05em' }}>
              The Correct Answer Was:
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.9rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
              marginTop: '2px'
            }}>
              {puzzle?.answer || 'Revealed Answer'}
            </div>
            {puzzle?.hint && (
              <div style={{ fontSize: '0.88rem', color: 'var(--c-vanilla-dark)', marginTop: '4px' }}>
                Meaning: <em>{puzzle.hint}</em>
              </div>
            )}
          </div>
        </div>

        {/* Footer Next Round countdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Next round starting in <strong style={{ color: 'var(--c-seafoam-dark)', fontSize: '1.05rem' }}>{countdown}s</strong>
          </div>

          {isHost && (
            <button
              onClick={onSkipRound}
              style={{
                background: 'var(--c-seafoam-bg)',
                border: '1px solid var(--c-seafoam-border)',
                color: 'var(--c-seafoam-dark)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>Next Round Now</span>
              <FastForward size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
