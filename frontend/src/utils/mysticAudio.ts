class MysticAudio {
  private ctx: AudioContext | null = null;

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  // ১. কার্ডে হোভার করলে ডার্ক উইন্ড/সাব-বাস সাউন্ড
  playHover() {
    try {
      this.init();
      if (!this.ctx) return;

      // Resume context if suspended (common browser security behavior)
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('AudioContext playHover block bypassed:', e);
    }
  }

  // ২. কার্ড ফ্লিপ বা কুকি ভাঙার সময় মেটালিক গথিক ড্রপ সাউন্ড
  playReveal(mode: 'cursed' | 'blessed' = 'cursed') {
    try {
      this.init();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = mode === 'cursed' ? 'sawtooth' : 'triangle';
      
      // Cursed: লো পিচ ডার্ক থুড | Blessed: হাই পিচ সেলিস্টিয়াল চাইম
      const startFreq = mode === 'cursed' ? 120 : 520;
      const endFreq = mode === 'cursed' ? 30 : 260;

      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('AudioContext playReveal block bypassed:', e);
    }
  }
}

export const mysticAudio = new MysticAudio();
