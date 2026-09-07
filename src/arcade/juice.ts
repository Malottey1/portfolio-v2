interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	color: string;
}

// Squash/stretch, particle puffs, hit-stop, and screen shake — small, fast,
// never cartoonish. Screen shake is skipped entirely under
// prefers-reduced-motion; everything else here is a quick (<0.4s) reaction
// to player action, not ambient motion, so it stays on.
export class Juice {
	scaleX = 1;
	scaleY = 1;
	shakeX = 0;
	shakeY = 0;
	hitStopTimer = 0;

	private particles: Particle[] = [];
	private shakeTimer = 0;
	private shakeStrength = 0;

	constructor(private reducedMotion: boolean) {}

	private spawnBurst(x: number, y: number, count: number, color: string, speed: number) {
		for (let i = 0; i < count; i++) {
			const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
			const s = speed * (0.5 + Math.random() * 0.5);
			this.particles.push({
				x,
				y,
				vx: Math.cos(angle) * s,
				vy: Math.sin(angle) * s - 20,
				life: 0.4,
				maxLife: 0.4,
				color,
			});
		}
	}

	triggerJump() {
		this.scaleX = 0.8;
		this.scaleY = 1.25;
	}

	triggerLand(fallSpeed: number, x: number, y: number) {
		const hard = fallSpeed > 250;
		this.scaleX = hard ? 1.4 : 1.15;
		this.scaleY = hard ? 0.6 : 0.85;
		this.spawnBurst(x, y, hard ? 8 : 4, '#f8f8f8', hard ? 50 : 28);
		if (hard) {
			this.hitStopTimer = 0.04;
			if (!this.reducedMotion) {
				this.shakeTimer = 0.15;
				this.shakeStrength = 2;
			}
		}
	}

	triggerCollect(x: number, y: number) {
		this.spawnBurst(x, y, 10, '#ffd43b', 55);
		if (!this.reducedMotion) {
			this.shakeTimer = 0.12;
			this.shakeStrength = 1.5;
		}
	}

	// Returns the dt to actually simulate this step — 0 during a hit-stop
	// freeze frame, otherwise the input dt unchanged.
	consumeHitStop(dt: number): number {
		if (this.hitStopTimer > 0) {
			this.hitStopTimer -= dt;
			return 0;
		}
		return dt;
	}

	update(dt: number) {
		const ease = Math.min(1, dt * 10);
		this.scaleX += (1 - this.scaleX) * ease;
		this.scaleY += (1 - this.scaleY) * ease;

		for (const p of this.particles) {
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.vy += 120 * dt;
			p.life -= dt;
		}
		this.particles = this.particles.filter((p) => p.life > 0);

		if (this.shakeTimer > 0) {
			this.shakeTimer -= dt;
			this.shakeX = (Math.random() * 2 - 1) * this.shakeStrength;
			this.shakeY = (Math.random() * 2 - 1) * this.shakeStrength;
		} else {
			this.shakeX = 0;
			this.shakeY = 0;
		}
	}

	drawParticles(ctx: CanvasRenderingContext2D) {
		for (const p of this.particles) {
			ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
			ctx.fillStyle = p.color;
			ctx.fillRect(Math.round(p.x - 1), Math.round(p.y - 1), 2, 2);
		}
		ctx.globalAlpha = 1;
	}
}
