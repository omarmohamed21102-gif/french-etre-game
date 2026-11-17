// sound.js - Web Audio API Sound Generator & French Speech Synthesis
// Zero external assets needed; 100% offline & fast!

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.speechEnabled = true;
        this.frenchVoice = null;

        // Initialize speech synthesis voices
        if ('speechSynthesis' in window) {
            this.initSpeech();
            window.speechSynthesis.onvoiceschanged = () => this.initSpeech();
        }
    }

    getAudioContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    initSpeech() {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        // Look for native French voices
        this.frenchVoice = voices.find(v => v.lang === 'fr-FR' || v.lang.startsWith('fr')) || null;
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    // Play a friendly success chime
    playSuccess() {
        if (this.muted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.3);
        });
    }

    // Play error buzz
    playError() {
        if (this.muted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.25);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
    }

    // Play pop sound for bubbles / balloon
    playPop() {
        if (this.muted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Play card flip sound
    playFlip() {
        if (this.muted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.07);
    }

    // Play victory fanfare
    playVictory() {
        if (this.muted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const melody = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 523.25, d: 0.12 }, // C5
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.25 }, // E5
            { f: 783.99, d: 0.25 }, // G5
            { f: 1046.50, d: 0.50 } // C6
        ];

        let offset = 0;
        melody.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, now + offset);

            gain.gain.setValueAtTime(0, now + offset);
            gain.gain.linearRampToValueAtTime(0.25, now + offset + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + offset);
            osc.stop(now + offset + note.d + 0.05);

            offset += note.d + 0.03;
        });
    }

    // Play tick sound for timer
    playTick() {
        if (this.muted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
    }

    // Speak French text using Web Speech API
    speakFrench(text, rate = 0.85) {
        if (!('speechSynthesis' in window) || this.muted) return;

        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = rate; // slightly slower for language learners
        utterance.pitch = 1.0;

        if (this.frenchVoice) {
            utterance.voice = this.frenchVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
}

// Global Sound instance
window.soundMgr = new SoundEngine();

// Ensure AudioContext resumes seamlessly on first user interaction
document.addEventListener('pointerdown', () => {
    if (window.soundMgr) {
        window.soundMgr.getAudioContext();
    }
}, { once: true });

