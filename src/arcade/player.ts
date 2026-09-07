import { GAME_WIDTH, PHYSICS } from './constants';
import type { InputState } from './input';
import type { Rect } from './level';

function rectsOverlap(a: Rect, b: Rect): boolean {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export class Player {
	x: number;
	y: number;
	width = 12;
	height = 20;
	vx = 0;
	vy = 0;
	grounded = false;
	facing: 1 | -1 = 1;

	// Forgiveness timers, in seconds since the relevant event. Large initial
	// values just mean "hasn't happened recently".
	timeSinceGrounded = 999;
	timeSinceJumpPressed = 999;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	get rect(): Rect {
		return { x: this.x, y: this.y, width: this.width, height: this.height };
	}

	update(dt: number, input: InputState, platforms: Rect[]) {
		const jumpHeld = input.held.has('jump');
		const jumpPressed = input.pressedThisFrame.has('jump');
		const jumpReleased = input.releasedThisFrame.has('jump');
		const wantDir = (input.held.has('left') ? -1 : 0) + (input.held.has('right') ? 1 : 0);
		if (wantDir !== 0) this.facing = wantDir > 0 ? 1 : -1;

		// --- horizontal: accelerate/decelerate toward a target speed ---
		const targetSpeed = wantDir * PHYSICS.maxRunSpeed;
		let accel = PHYSICS.moveAccel;
		if (wantDir === 0) {
			accel = PHYSICS.moveDecel;
		} else if (Math.sign(this.vx) !== 0 && Math.sign(this.vx) !== wantDir) {
			accel = PHYSICS.turnAccel;
		}
		if (this.vx < targetSpeed) this.vx = Math.min(this.vx + accel * dt, targetSpeed);
		else if (this.vx > targetSpeed) this.vx = Math.max(this.vx - accel * dt, targetSpeed);

		// --- coyote time / jump buffer bookkeeping ---
		this.timeSinceJumpPressed = jumpPressed ? 0 : this.timeSinceJumpPressed + dt;
		this.timeSinceGrounded = this.grounded ? 0 : this.timeSinceGrounded + dt;

		const canCoyoteJump = this.timeSinceGrounded <= PHYSICS.coyoteTime;
		const hasBufferedJump = this.timeSinceJumpPressed <= PHYSICS.jumpBufferTime;

		if (hasBufferedJump && (this.grounded || canCoyoteJump)) {
			this.vy = PHYSICS.jumpVelocity;
			this.grounded = false;
			this.timeSinceJumpPressed = 999;
			this.timeSinceGrounded = 999;
		}

		// --- variable jump height: cut the ascent short on early release ---
		if (jumpReleased && this.vy < 0) {
			this.vy *= PHYSICS.jumpCutMultiplier;
		}

		// --- gravity (asymmetric rise/fall) ---
		const gravity = this.vy < 0 && jumpHeld ? PHYSICS.gravityRise : PHYSICS.gravityFall;
		this.vy = Math.min(this.vy + gravity * dt, PHYSICS.maxFallSpeed);

		this.moveAndCollide(dt, platforms);
		this.x = Math.max(0, Math.min(this.x, GAME_WIDTH - this.width));
	}

	private moveAndCollide(dt: number, platforms: Rect[]) {
		this.x += this.vx * dt;
		for (const p of platforms) {
			if (!rectsOverlap(this.rect, p)) continue;
			if (this.vx > 0) this.x = p.x - this.width;
			else if (this.vx < 0) this.x = p.x + p.width;
			this.vx = 0;
		}

		this.grounded = false;
		this.y += this.vy * dt;
		for (const p of platforms) {
			if (!rectsOverlap(this.rect, p)) continue;
			if (this.vy > 0) {
				this.y = p.y - this.height;
				this.grounded = true;
			} else if (this.vy < 0) {
				this.y = p.y + p.height;
			}
			this.vy = 0;
		}
	}
}
