import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Users, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

export default function Navbar({ roomCode, playerCount, onOpenRules }) {
  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState(sounds.muted);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSound = () => {
    const isMuted = sounds.toggleMute();
    setMuted(isMuted);
    if (!isMuted) {
      sounds.playTone(520, 'sine', 0.1, 0.12);
    }
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #a3c7bb 0%, #bcd4a5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          boxShadow: '0 4px 12px rgba(163, 199, 187, 0.35)'
        }}>
          🧩
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}>
              RebusTeams
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'var(--c-vanilla-bg)',
              color: 'var(--c-vanilla-dark)',
              border: '1px solid var(--c-vanilla-border)',
              padding: '2px 8px',
              borderRadius: '9999px'
            }}>
              Pastel Edition
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Virtual Team Brain Teaser
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {roomCode && (
          <>
            {/* Room Code Badge (#a3c7bb Seafoam tint) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--c-seafoam-bg)',
              border: '1px solid var(--c-seafoam-border)',
              padding: '6px 14px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--c-seafoam-dark)', fontWeight: 700 }}>ROOM:</span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                color: 'var(--c-seafoam-dark)',
                letterSpacing: '0.06em'
              }}>
                {roomCode}
              </span>
              <button
                onClick={handleCopyLink}
                aria-label="Copy invite link for room"
                title="Copy Invite Link for Teammates"
                style={{
                  background: copied ? 'var(--c-sage)' : '#ffffff',
                  color: copied ? '#ffffff' : 'var(--c-seafoam-dark)',
                  border: copied ? '1px solid var(--c-sage)' : '1px solid var(--c-seafoam-border)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginLeft: '4px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Invite'}</span>
              </button>
            </div>

            {/* Players count (#bcd4a5 Sage tint) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--c-sage-bg)',
              border: '1px solid var(--c-sage-border)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              color: 'var(--c-sage-dark)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Users size={16} color="var(--c-sage-dark)" />
              <span style={{ fontWeight: 800, color: 'var(--c-sage-dark)' }}>{playerCount}</span>
            </div>
          </>
        )}

        {/* How to Play */}
        <button
          onClick={onOpenRules}
          title="How to Play"
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 700,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <HelpCircle size={16} color="var(--c-rose-dark)" />
          <span>Rules</span>
        </button>

        {/* Mute button */}
        <button
          onClick={handleToggleSound}
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
          title={muted ? 'Unmute Sound' : 'Mute Sound'}
          style={{
            background: '#ffffff',
            border: '1px solid var(--border-color)',
            color: muted ? 'var(--text-light)' : 'var(--c-seafoam-dark)',
            borderRadius: '12px',
            padding: '8px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </header>
  );
}
