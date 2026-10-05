import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';

const QUICK_REACTIONS = ['👏', '🔥', '😂', '💡', '🤔', '🎉'];

/**
 * ⚡ Bolt Optimization:
 * Memoize ChatFeed component with React.memo so it skips re-rendering on every
 * second-by-second timer_tick state update when message/player props are unchanged.
 */
function ChatFeed({ messages, onSendMessage, onSendReaction, currentPlayer, isPlaying }) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '380px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.65)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="var(--c-seafoam-dark)" />
          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>Team Chat & Guesses</span>
        </div>
        {isPlaying && (
          <span style={{
            fontSize: '0.72rem',
            background: 'var(--c-sage-bg)',
            color: 'var(--c-sage-dark)',
            border: '1px solid var(--c-sage-border)',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontWeight: 800
          }}>
            Live
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        padding: '14px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.45)'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginTop: 'auto',
            marginBottom: 'auto'
          }}>
            💬 Say hi to your team! Your chat and guesses will appear here.
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentPlayer?.id;

            if (m.type === 'system') {
              return (
                <div key={m.id} style={{
                  textAlign: 'center',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  background: 'var(--c-vanilla-bg)',
                  border: '1px solid var(--c-vanilla-border)',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  margin: '2px 0'
                }}>
                  {m.text}
                </div>
              );
            }

            if (m.type === 'correct') {
              return (
                <div key={m.id} style={{
                  background: 'var(--c-sage-bg)',
                  border: '1.5px solid var(--c-sage-border)',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--c-sage-dark)',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{m.avatar}</span>
                  <div>
                    <span style={{ color: 'var(--c-sage-dark)' }}>{m.senderName}: </span>
                    <span>{m.text}</span>
                  </div>
                </div>
              );
            }

            if (m.type === 'guess') {
              return (
                <div key={m.id} style={{
                  background: m.isClose ? 'var(--c-rose-bg)' : '#ffffff',
                  border: m.isClose ? '1.5px dashed var(--c-rose)' : '1px solid var(--border-color)',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <span>{m.avatar}</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{m.senderName}:</span>
                  <span style={{ color: 'var(--text-primary)', fontStyle: 'italic', fontWeight: 600 }}>"{m.text}"</span>
                  {m.isClose && (
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: '0.72rem',
                      color: 'var(--c-rose-dark)',
                      background: '#ffffff',
                      border: '1px solid var(--c-rose-border)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      fontWeight: 800
                    }}>
                      So Close! 🔥
                    </span>
                  )}
                </div>
              );
            }

            // Normal chat message
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <div style={{
                  fontSize: '1.3rem',
                  flexShrink: 0
                }}>
                  {m.avatar}
                </div>
                <div style={{
                  maxWidth: '78%',
                  background: isMe ? 'var(--c-seafoam-bg)' : '#ffffff',
                  border: isMe ? '1.5px solid var(--c-seafoam-border)' : '1px solid var(--border-color)',
                  borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '8px 14px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{
                    fontSize: '0.72rem',
                    color: isMe ? 'var(--c-seafoam-dark)' : 'var(--text-muted)',
                    fontWeight: 800,
                    marginBottom: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}>
                    <span>{m.senderName}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{m.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500, wordBreak: 'break-word' }}>
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emoji Reactions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderTop: '1px solid var(--border-color)',
        background: '#fcfbf9',
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, marginRight: '4px' }}>React:</span>
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onSendReaction(emoji)}
            aria-label={`Send ${emoji} reaction`}
            title={`React with ${emoji}`}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '3px 8px',
              fontSize: '1.1rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.1s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{
        display: 'flex',
        gap: '8px',
        padding: '10px 14px',
        borderTop: '1px solid var(--border-color)',
        background: '#ffffff'
      }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isPlaying ? "Chat or guess here..." : "Type a message to team..."}
          style={{
            flex: 1,
            padding: '9px 14px',
            borderRadius: '10px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color-strong)',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            fontWeight: 500
          }}
        />
        <button
          type="submit"
          aria-label="Send message"
          title="Send message"
          style={{
            background: 'linear-gradient(135deg, #a3c7bb 0%, #bcd4a5 100%)',
            color: '#1c1917',
            border: 'none',
            borderRadius: '10px',
            padding: '9px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(163, 199, 187, 0.4)'
          }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}

export default React.memo(ChatFeed);
