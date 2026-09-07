import { GAME_WIDTH, GAME_HEIGHT, PHYSICS } from './constants';
import { InputState } from './input';
import { Player } from './player';
import { createTestLevel, PLAYER_SPAWN } from './level';
import {
	PLAYER_IDLE,
	PLAYER_WALK_1,
	PLAYER_WALK_2,
	PLAYER_JUMP,
	TILE_GROUND,
	TILE_PLATFORM,
	TILE_CRATE,
	drawGrid,
	drawTiled,
} from './sprites';
import { drawBackground } from './background';
import { drawTitleScreen } from './title';

const WALK_FRAME_TIME = 0.14;
const TITLE_BLINK_TIME = 0.5;

type GameState = 'title' | 'playing';

export function startGame(canvas: HTMLCanvasElement, debugEl: HTMLElement | null) {
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.imageSmoothingEnabled = false;

	canvas.width = GAME_WIDTH;
	canvas.height = GAME_HEIGHT;

	function resize() {
		const scale = Math.max(
			1,
			Math.floor(Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT)),
		);
		canvas.style.width = `${GAME_WIDTH * scale}px`;
		canvas.style.height = `${GAME_HEIGHT * scale}px`;
	}
	resize();
	window.addEventListener('resize', resize);

	const input = new InputState();
	const platforms = createTestLevel();
	const player = new Player(PLAYER_SPAWN.x, PLAYER_SPAWN.y);

	let state: GameState = 'title';
	let titleBlinkTimer = 0;
	let titleBlinkOn = true;

	let walkTimer = 0;
	let walkFrame = 0;

	const TILE_BY_TYPE = {
		ground: TILE_GROUND,
		platform: TILE_PLATFORM,
		crate: TILE_CRATE,
	} as const;

	function renderPlaying() {
		if (!ctx) return;
		drawBackground(ctx, GAME_WIDTH, GAME_HEIGHT);

		for (const p of platforms) {
			drawTiled(ctx, TILE_BY_TYPE[p.type ?? 'ground'], p.x, p.y, p.width, p.height);
		}

		const moving = Math.abs(player.vx) > 5 && player.grounded;
		const sprite = !player.grounded
			? PLAYER_JUMP
			: moving
				? walkFrame === 0
					? PLAYER_WALK_1
					: PLAYER_WALK_2
				: PLAYER_IDLE;

		const spriteX = player.x + player.width / 2 - sprite[0].length / 2;
		const spriteY = player.y + player.height - sprite.length;
		drawGrid(ctx, sprite, spriteX, spriteY, player.facing === -1);
	}

	function updateDebug() {
		if (!debugEl) return;
		debugEl.textContent =
			`state=${state} ` +
			`x=${player.x.toFixed(1)} y=${player.y.toFixed(1)} ` +
			`vx=${player.vx.toFixed(1)} vy=${player.vy.toFixed(1)} ` +
			`grounded=${player.grounded} ` +
			`coyote=${player.timeSinceGrounded.toFixed(3)} ` +
			`buffer=${player.timeSinceJumpPressed.toFixed(3)}`;
	}

	const FIXED_DT = PHYSICS.fixedDt;
	let accumulator = 0;
	let lastTime = performance.now();
	let rafId = 0;

	function frame(now: number) {
		let delta = (now - lastTime) / 1000;
		lastTime = now;
		delta = Math.min(delta, 0.25); // avoid spiral of death after a stalled tab

		input.beginFrame();

		if (state === 'title') {
			titleBlinkTimer += delta;
			if (titleBlinkTimer >= TITLE_BLINK_TIME) {
				titleBlinkTimer -= TITLE_BLINK_TIME;
				titleBlinkOn = !titleBlinkOn;
			}
			if (input.pressedThisFrame.has('jump')) {
				state = 'playing';
				accumulator = 0;
				lastTime = now;
			}
			if (ctx) drawTitleScreen(ctx, GAME_WIDTH, GAME_HEIGHT, titleBlinkOn);
		} else {
			accumulator += delta;
			while (accumulator >= FIXED_DT) {
				player.update(FIXED_DT, input, platforms);

				if (player.grounded && Math.abs(player.vx) > 5) {
					walkTimer += FIXED_DT;
					if (walkTimer >= WALK_FRAME_TIME) {
						walkTimer -= WALK_FRAME_TIME;
						walkFrame = walkFrame === 0 ? 1 : 0;
					}
				} else {
					walkTimer = 0;
					walkFrame = 0;
				}

				accumulator -= FIXED_DT;
			}
			renderPlaying();
		}

		updateDebug();
		rafId = requestAnimationFrame(frame);
	}

	rafId = requestAnimationFrame(frame);

	return () => {
		cancelAnimationFrame(rafId);
		window.removeEventListener('resize', resize);
		input.destroy();
	};
}
