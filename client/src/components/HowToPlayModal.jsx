import React from 'react';
import { X, Lightbulb, CheckCircle2, Trophy } from 'lucide-react';

export default function HowToPlayModal({ onClose }) {
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
      zIndex: 110,
      padding: '20px'
    }}>
      <div className="glass-panel animate-pop" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '30px',
        background: '#ffffff',
        border: '1.5px solid var(--border-color)',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--bg-primary)',
            border: 'none',
            color: 'var(--text-secondary)',
            borderRadius: '10px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--c-rose-bg) 0%, var(--c-seafoam-bg) 100%)',
            border: '1.5px solid var(--c-rose-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            🧩
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>How to Play Rebus</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Virtual team game guide</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
          {/* Section 1: Sage #bcd4a5 */}
          <div style={{
            background: 'var(--c-sage-bg)',
            border: '1px solid var(--c-sage-border)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--c-sage-dark)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={16} color="var(--c-sage-dark)" /> What is a Rebus Puzzle?
            </h3>
            <p style={{ color: 'var(--c-sage-dark)', lineHeight: '1.5' }}>
              A Rebus is a visual word puzzle that uses letters, spatial positioning, font size, and symbols to depict a common word or idiom.
            </p>
            <div style={{ marginTop: '8px', fontSize: '0.82rem', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', color: 'var(--text-primary)', border: '1px solid var(--c-sage-border)' }}>
              <em>Example:</em> "Get it" repeated 4 times = <strong>"Forget it"</strong> (Four-get it!)
              <br />
              <em>Example:</em> "Try" next to "stand" over "2" = <strong>"Try to understand"</strong>
            </div>
          </div>

          {/* Section 2: Seafoam #a3c7bb */}
          <div style={{
            background: 'var(--c-seafoam-bg)',
            border: '1px solid var(--c-seafoam-border)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--c-seafoam-dark)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--c-seafoam-dark)" /> Round Advancing Rules
            </h3>
            <p style={{ color: 'var(--c-seafoam-dark)', lineHeight: '1.5' }}>
              A puzzle round ends immediately when:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', color: 'var(--c-seafoam-dark)', lineHeight: '1.6' }}>
              <li><strong>One person gets the correct answer:</strong> That player wins round points and reveals the answer.</li>
              <li><strong>OR everyone keys in their answer:</strong> If every player in the room submits an answer, the round concludes and the answer is revealed.</li>
              <li><strong>Time runs out:</strong> If the countdown timer hits 0 before either happens.</li>
            </ul>
          </div>

          {/* Section 3: Vanilla #ebd9b3 */}
          <div style={{
            background: 'var(--c-vanilla-bg)',
            border: '1px solid var(--c-vanilla-border)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--c-vanilla-dark)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trophy size={16} color="var(--c-vanilla-dark)" /> Scoring & Speed Bonus
            </h3>
            <p style={{ color: 'var(--c-vanilla-dark)', lineHeight: '1.5' }}>
              • <strong>100 Base Points</strong> for solving the puzzle correctly.
              <br />
              • <strong>Speed Bonus:</strong> You earn 2 bonus points for every remaining second on the clock!
              <br />
              • <strong>Close Calls:</strong> If you are within 1-2 letters of the right answer, you'll receive a helpful "So Close!" prompt.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '22px',
            padding: '13px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #d19999 0%, #e8b5a2 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.98rem',
            boxShadow: '0 4px 14px rgba(209, 153, 153, 0.4)'
          }}
        >
          Got It, Let's Play!
        </button>
      </div>
    </div>
  );
}
