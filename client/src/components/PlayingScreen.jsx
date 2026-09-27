import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock, CheckCircle2, FastForward, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function PlayingScreen({
  roomState,
  currentUserId,
  onSubmitAnswer,
  onSkipRound,
  isHost
}) {
  const [guess, setGuess] = useState('');
  const inputRef = useRef(null);

  const { puzzle, timeLeft, currentRound, totalRounds, players, answeredCount, totalPlayerCount, settings } = roomState;
  const me = players.find((p) => p.id === currentUserId);

  useEffect(() => {
    inputRef.current?.focus();
    setGuess('');
  }, [currentRound]);

  // Tick sound when time <= 5
  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      sounds.playTick();
    }
  }, [timeLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = guess.trim();
    if (!trimmed) return;

    sounds.init();
    onSubmitAnswer(trimmed);
    setGuess('');
  };

  const isTimeCritical = timeLeft <= 10;
  // Timer color mapping using the 5 pastel colors:
  // Normal: Sage #bcd4a5
  // Warning: Peach #e8b5a2
  // Critical: Rose #d19999
  const timerBg = timeLeft > 20 ? 'var(--c-sage-bg)' : timeLeft > 10 ? 'var(--c-peach-bg)' : 'var(--c-rose-bg)';
  const timerBorder = timeLeft > 20 ? 'var(--c-sage-border)' : timeLeft > 10 ? 'var(--c-peach-border)' : 'var(--c-rose-border)';
  const timerColor = timeLeft > 20 ? 'var(--c-sage-dark)' : timeLeft > 10 ? 'var(--c-peach-dark)' : 'var(--c-rose-dark)';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%'
    }}>
      {/* Top Game Bar */}
      <div className="glass-panel" style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Round & Category (Seafoam #a3c7bb) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--c-seafoam-bg)',
            border: '1px solid var(--c-seafoam-border)',
            padding: '5px 14px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.88rem',
            color: 'var(--c-seafoam-dark)',
            fontFamily: 'var(--font-display)'
          }}>
            ROUND {currentRound} / {totalRounds}
          </div>
          {puzzle?.category && (
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              padding: '5px 12px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              fontWeight: 700
            }}>
              Category: <span style={{ color: 'var(--text-primary)' }}>{puzzle.category}</span>
            </div>
          )}
        </div>

        {/* Center: Submission Tracker (Peach #e8b5a2) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--c-peach-bg)',
          border: '1px solid var(--c-peach-border)',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span style={{ color: 'var(--c-peach-dark)', fontWeight: 700 }}>Answers Keyed In:</span>
          <strong style={{ color: answeredCount === totalPlayerCount ? 'var(--c-sage-dark)' : 'var(--c-peach-dark)', fontWeight: 800 }}>
            {answeredCount} / {totalPlayerCount}
          </strong>
          {/* Mini Avatar status dots */}
          <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
            {players.map((p) => (
              <span
                key={p.id}
                title={`${p.name}: ${p.hasAnswered ? 'Submitted answer' : 'Still thinking'}`}
                style={{
                  fontSize: '0.95rem',
                  opacity: p.hasAnswered ? 1 : 0.35,
                  filter: p.hasAnswered ? 'none' : 'grayscale(100%)',
                  transform: p.hasAnswered ? 'scale(1.15)' : 'scale(0.9)',
                  transition: 'all 0.2s'
                }}
              >
                {p.avatar}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Timer & Host Skip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: timerBg,
            border: `1.5px solid ${timerBorder}`,
            padding: '6px 14px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-sm)',
            animation: isTimeCritical ? 'pulse-subtle 1s infinite' : 'none'
          }}>
            <Clock size={16} color={timerColor} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.15rem',
              color: timerColor,
              minWidth: '32px'
            }}>
              {timeLeft}s
            </span>
          </div>

          {isHost && (
            <button
              onClick={onSkipRound}
              title="Skip this puzzle (Host only)"
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <FastForward size={14} color="var(--text-secondary)" /> Skip
            </button>
          )}
        </div>
      </div>

      {/* Main Puzzle Showcase Card */}
      <div className="glass-panel" style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Puzzle Image Display */}
        {puzzle?.image ? (
          <div style={{
            width: '100%',
            maxWidth: '380px',
            aspectRatio: '1 / 1',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(41, 37, 36, 0.10)',
            border: '3px solid #ffffff',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px'
          }}>
            <img
              src={puzzle.image}
              alt={`Rebus Puzzle #${puzzle.id}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        ) : (
          <div style={{ height: '300px', display: 'flex', alignItems: 'center' }}>Loading puzzle...</div>
        )}

        {/* Letter Count & Blanks Helper in Charcoal */}
        {puzzle?.letter_pattern && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '14px'
          }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '0.28em',
              color: 'var(--text-primary)',
              textAlign: 'center'
            }}>
              {puzzle.letter_pattern}
            </div>
            {puzzle.word_lengths && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Word lengths: {puzzle.word_lengths.join(', ')} letters
              </span>
            )}
          </div>
        )}

        {/* Contextual Hint in Vanilla #ebd9b3 */}
        {puzzle?.hint && (
          <div style={{
            background: 'var(--c-vanilla-bg)',
            border: '1px solid var(--c-vanilla-border)',
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '0.84rem',
            color: 'var(--c-vanilla-dark)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={16} color="var(--c-vanilla-dark)" />
            <span>Hint: <em>{puzzle.hint}</em></span>
          </div>
        )}

        {/* Answer Status Feedback Banner */}
        <div style={{ width: '100%', maxWidth: '520px', marginBottom: '16px' }}>
          {me?.isCorrect ? (
            <div style={{
              padding: '12px 18px',
              borderRadius: '14px',
              background: 'var(--c-sage-bg)',
              border: '1.5px solid var(--c-sage-border)',
              color: 'var(--c-sage-dark)',
              fontWeight: 800,
              fontSize: '0.92rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <CheckCircle2 size={20} color="var(--c-sage-dark)" />
              <span>You solved it correctly! Fantastic work!</span>
            </div>
          ) : me?.hasAnswered ? (
            <div style={{
              padding: '12px 18px',
              borderRadius: '14px',
              background: 'var(--c-seafoam-bg)',
              border: '1.5px solid var(--c-seafoam-border)',
              color: 'var(--c-seafoam-dark)',
              fontWeight: 700,
              fontSize: '0.88rem',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <CheckCircle2 size={18} color="var(--c-seafoam-dark)" />
              <span>Your answer is locked in! Waiting for teammates or first correct solve...</span>
            </div>
          ) : (
            <div style={{
              padding: '6px 12px',
              textAlign: 'center',
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              fontWeight: 600
            }}>
              Type your guess and hit Enter. First to solve or all answering moves the round!
            </div>
          )}
        </div>

        {/* Dedicated Answer Submission Box */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: '10px',
            width: '100%',
            maxWidth: '520px'
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={me?.isCorrect}
            placeholder={me?.isCorrect ? "You got it right!" : "Type your answer here..."}
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: '14px',
              background: '#ffffff',
              border: '2px solid var(--c-seafoam)',
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(41, 37, 36, 0.05)'
            }}
          />
          <button
            type="submit"
            disabled={me?.isCorrect || !guess.trim()}
            style={{
              padding: '0 26px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #d19999 0%, #e8b5a2 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.98rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 6px 18px rgba(209, 153, 153, 0.45)',
              opacity: (me?.isCorrect || !guess.trim()) ? 0.5 : 1,
              cursor: (me?.isCorrect || !guess.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            <span>Submit</span>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
