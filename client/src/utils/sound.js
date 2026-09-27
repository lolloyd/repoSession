// High quality Web Audio API sound synthesizer
// Completely self-contained, no external audio files required!

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('rebus_sound_muted') === 'true';
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('rebus_sound_muted', this.muted);
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, startTime = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime + startTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    } catch {
      // AudioContext policy catch
    }
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    // Happy major triad: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    this.playTone(523.25, 'triangle', 0.15, 0.15, 0);
    this.playTone(659.25, 'triangle', 0.15, 0.15, 0.08);
    this.playTone(783.99, 'triangle', 0.2, 0.15, 0.16);
    this.playTone(1046.50, 'sine', 0.35, 0.2, 0.24);
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    // Gentle low error bump
    this.playTone(220, 'sawtooth', 0.12, 0.08, 0);
    this.playTone(180, 'sawtooth', 0.18, 0.08, 0.1);
  }

  playClose() {
    if (this.muted) return;
    this.init();
    // Curious questioning upward beep
    this.playTone(440, 'sine', 0.1, 0.1, 0);
    this.playTone(554.37, 'sine', 0.15, 0.1, 0.09);
  }

  playTick() {
    if (this.muted) return;
    this.init();
    // Subtle wooden clock tick
    this.playTone(800, 'triangle', 0.04, 0.05, 0);
  }

  playGameStart() {
    if (this.muted) return;
    this.init();
    this.playTone(392.00, 'triangle', 0.12, 0.15, 0);
    this.playTone(523.25, 'triangle', 0.12, 0.15, 0.1);
    this.playTone(659.25, 'triangle', 0.15, 0.15, 0.2);
    this.playTone(783.99, 'sine', 0.3, 0.2, 0.3);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.2, 0.15, idx * 0.12);
    });
  }
}

export const sounds = new SoundEffects();
