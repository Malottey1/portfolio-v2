// Synthesized chiptune audio via Web Audio oscillators — no audio files, so
// no licensing questions and no bundle weight. Muted by default; nothing
// creates an AudioContext (let alone plays a sound) until the player
// explicitly unmutes, satisfying "never autoplay sound" at the API level,
// not just at zero volume.
class ChiptuneAudio {
	muted = true;

	private ctx: AudioContext | null = null;
	private masterGain: GainNode | null = null;
	private ambientTimer: number | null = null;
	private ambientStep = 0;
	private readonly ambientPattern = [220, 262, 330, 262, 196, 247, 294, 247];

	private ensureContext(): AudioContext {
		if (this.ctx) return this.ctx;
		const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		this.ctx = new AC();
		this.masterGain = this.ctx.createGain();
		this.masterGain.gain.value = 0.25;
		this.masterGain.connect(this.ctx.destination);
		return this.ctx;
	}

	private tone(freq: number, duration: number, type: OscillatorType = 'square', delay = 0, gainScale = 1) {
		if (this.muted) return;
		const ctx = this.ensureContext();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.value = freq;
		const t0 = ctx.currentTime + delay;
		gain.gain.setValueAtTime(0.0001, t0);
		gain.gain.exponentialRampToValueAtTime(0.3 * gainScale, t0 + 0.01);
		gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
		osc.connect(gain);
		gain.connect(this.masterGain!);
		osc.start(t0);
		osc.stop(t0 + duration + 0.02);
	}

	playJump() {
		this.tone(440, 0.09, 'square');
		this.tone(660, 0.08, 'square', 0.05);
	}

	playLand() {
		this.tone(150, 0.07, 'square');
	}

	playCollect() {
		this.tone(880, 0.08, 'square');
		this.tone(1320, 0.12, 'square', 0.06);
	}

	playSelect() {
		this.tone(520, 0.05, 'square');
	}

	startAmbient() {
		if (this.ambientTimer !== null) return;
		this.ambientTimer = window.setInterval(() => {
			const freq = this.ambientPattern[this.ambientStep % this.ambientPattern.length];
			this.tone(freq, 0.18, 'triangle', 0, 0.5);
			this.ambientStep++;
		}, 260);
	}

	setMuted(muted: boolean) {
		this.muted = muted;
		if (!muted) {
			const ctx = this.ensureContext();
			if (ctx.state === 'suspended') ctx.resume();
		}
		window.dispatchEvent(new CustomEvent('arcade-mute-change', { detail: { muted } }));
	}

	toggleMute() {
		this.setMuted(!this.muted);
		return this.muted;
	}
}

export const audio = new ChiptuneAudio();
