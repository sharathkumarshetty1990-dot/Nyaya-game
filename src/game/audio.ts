/**
 * Standalone Audio Synthesis Engine using the Web Audio API.
 * Synthesizes sound effects and interactive tension backing tracks without external assets.
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private backgroundLoopInterval: any = null;
  private currentPressure: number = 0;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopPressureBackingTrack();
    } else {
      this.startPressureBackingTrack(this.currentPressure);
    }
    return this.isMuted;
  }

  getIsMuted() {
    return this.isMuted;
  }

  playObjection() {
    if (this.isMuted) return;
    try {
      const audioCtx = this.initCtx();
      const now = audioCtx.currentTime;

      // Create a dramatic sliding saw wave for absolute tactical impact
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      // Sweeping frequency upward then slamming down
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.5);

      // Add a metallic sub-resonance
      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(70, now);
      subOsc.frequency.linearRampToValueAtTime(45, now + 0.4);

      subGain.gain.setValueAtTime(0.3, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);

      subOsc.start(now);
      subOsc.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio Synthesis context failure on playObjection', e);
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    try {
      const audioCtx = this.initCtx();
      const now = audioCtx.currentTime;

      // Arpeggiated crisp modular synthesiser sound
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C E G C E G
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const noteStart = now + idx * 0.08;
        const noteEnd = noteStart + 0.25;

        gainNode.gain.setValueAtTime(0.0, noteStart);
        gainNode.gain.linearRampToValueAtTime(0.15, noteStart + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(noteStart);
        osc.stop(noteEnd);
      });
    } catch (e) {
      console.warn('Audio Synthesis failure on playSuccess', e);
    }
  }

  playBuzzer() {
    if (this.isMuted) return;
    try {
      const audioCtx = this.initCtx();
      const now = audioCtx.currentTime;

      // Dual-oscillator unpleasant detuned saw wave buzzer
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.value = 130; // low detuned
      
      osc2.type = 'sawtooth';
      osc2.frequency.value = 133; // slightly detuned

      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gainNode.gain.setValueAtTime(0.25, now + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio Synthesis failure on playBuzzer', e);
    }
  }

  playGavel() {
    if (this.isMuted) return;
    try {
      const audioCtx = this.initCtx();
      const now = audioCtx.currentTime;

      // Heavy woody impact + high resonance transient
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

      gainNode.gain.setValueAtTime(0.8, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.35);

      // Higher sharp click to simulate direct hammer touch
      const clickOsc = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(450, now);
      clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

      clickGain.gain.setValueAtTime(0.2, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      clickOsc.connect(clickGain);
      clickGain.connect(audioCtx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.06);
    } catch (e) {
      console.warn('Audio Synthesis context failure on playGavel', e);
    }
  }

  /**
   * Schedules a looping interactive low heartbeat pulse.
   * Rate increases exponentially with high pressure level to induce physical anxiety.
   */
  startPressureBackingTrack(pressure: number) {
    this.currentPressure = pressure;
    if (this.isMuted) return;

    this.stopPressureBackingTrack();

    // Map 0-100 pressure to loop interval (1500ms down to 400ms)
    const intervalMs = Math.max(380, 1500 - (pressure * 11.5));

    const triggerDoubleHeartbeat = () => {
      try {
        const audioCtx = this.initCtx();
        const now = audioCtx.currentTime;

        // Peak volume scales slightly with higher pressure
        const vol = Math.min(0.28, 0.12 + (pressure / 100) * 0.15);

        // Beat 1 (lub)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, now);
        osc1.frequency.linearRampToValueAtTime(45, now + 0.12);
        gain1.gain.setValueAtTime(0.0, now);
        gain1.gain.linearRampToValueAtTime(vol, now + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.16);

        // Beat 2 (dub) - offset by 150ms
        const delay = 0.15;
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(51, now + delay);
        osc2.frequency.linearRampToValueAtTime(40, now + delay + 0.15);
        gain2.gain.setValueAtTime(0.0, now + delay);
        gain2.gain.linearRampToValueAtTime(vol * 0.85, now + delay + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start(now + delay);
        osc2.stop(now + delay + 0.2);
      } catch (err) {
        // Suppress failure logs during background operations
      }
    };

    // Trigger initial
    triggerDoubleHeartbeat();
    
    // Schedule repeating
    this.backgroundLoopInterval = setInterval(() => {
      triggerDoubleHeartbeat();
    }, intervalMs);
  }

  updatePressure(pressure: number) {
    this.currentPressure = pressure;
    if (this.backgroundLoopInterval) {
      // Re-trigger backing track to refresh tempo calculation
      this.startPressureBackingTrack(pressure);
    }
  }

  stopPressureBackingTrack() {
    if (this.backgroundLoopInterval) {
      clearInterval(this.backgroundLoopInterval);
      this.backgroundLoopInterval = null;
    }
  }
}

export const audioService = new SoundManager();
