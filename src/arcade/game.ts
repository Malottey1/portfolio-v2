import { GAME_WIDTH, GAME_HEIGHT, PHYSICS } from './constants';
import { InputState } from './input';
import { Player } from './player';
import { generateLevel } from './level';
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
import { drawCollectible, rectsOverlap } from './collectibles';
import { drawProjectPanel, drawInventory, drawAllProjectsList } from './ui';
import type { ProjectSummary } from './project-types';

const WALK_FRAME_TIME = 0.14;
const TITLE_BLINK_TIME = 0.5;

type GameState = 'title' | 'titleList' | 'playing' | 'panel' | 'inventory';

export function startGame(
	canvas: HTMLCanvasElement,
	debugEl: HTMLElement | null,
	projects: ProjectSummary[],
) {
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

	const projectsBySlug = new Map(projects.map((p) => [p.slug, p]));
	const level = generateLevel(projects.map((p) => p.slug));
	const input = new InputState();
	const player = new Player(level.spawn.x, level.spawn.y);
	const collectedSlugs = new Set<string>();
	let currentProject: ProjectSummary | null = null;

	let state: GameState = 'title';
	let titleBlinkTimer = 0;
	let titleBlinkOn = true;

	let walkTimer = 0;
	let walkFrame = 0;
	let elapsed = 0;

	const TILE_BY_TYPE = {
		ground: TILE_GROUND,
		platform: TILE_PLATFORM,
		crate: TILE_CRATE,
	} as const;

	function cameraX() {
		const maxCam = Math.max(0, level.width - GAME_WIDTH);
		return Math.max(0, Math.min(player.x + player.width / 2 - GAME_WIDTH / 2, maxCam));
	}

	function renderPlaying() {
		if (!ctx) return;
		const camX = cameraX();
		drawBackground(ctx, GAME_WIDTH, GAME_HEIGHT, camX);

		ctx.save();
		ctx.translate(-camX, 0);

		for (const p of level.platforms) {
			drawTiled(ctx, TILE_BY_TYPE[p.type ?? 'ground'], p.x, p.y, p.width, p.height);
		}
		for (const c of level.collectibles) drawCollectible(ctx, c, elapsed);

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

		ctx.restore();

		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.font = 'bold 8px monospace';
		ctx.fillStyle = '#0f0f0f';
		ctx.fillText('I: INVENTORY', 9, 5);
		ctx.fillStyle = '#f8f8f8';
		ctx.fillText('I: INVENTORY', 8, 4);
	}

	function updateDebug() {
		if (!debugEl) return;
		debugEl.textContent =
			`state=${state} ` +
			`x=${player.x.toFixed(1)} y=${player.y.toFixed(1)} ` +
			`vx=${player.vx.toFixed(1)} vy=${player.vy.toFixed(1)} ` +
			`grounded=${player.grounded} collected=${collectedSlugs.size}/${projects.length}`;
	}

	const FIXED_DT = PHYSICS.fixedDt;
	let accumulator = 0;
	let lastTime = performance.now();
	let rafId = 0;

	function resumePlaying() {
		state = 'playing';
		accumulator = 0;
		lastTime = performance.now();
	}

	function frame(now: number) {
		let delta = (now - lastTime) / 1000;
		lastTime = now;
		delta = Math.min(delta, 0.25); // avoid spiral of death after a stalled tab
		elapsed += delta;

		input.beginFrame();

		if (state === 'title') {
			titleBlinkTimer += delta;
			if (titleBlinkTimer >= TITLE_BLINK_TIME) {
				titleBlinkTimer -= TITLE_BLINK_TIME;
				titleBlinkOn = !titleBlinkOn;
			}
			if (input.pressedThisFrame.has('jump')) resumePlaying();
			else if (input.pressedThisFrame.has('view')) state = 'titleList';
			if (ctx) drawTitleScreen(ctx, GAME_WIDTH, GAME_HEIGHT, titleBlinkOn);
		} else if (state === 'titleList') {
			if (input.pressedThisFrame.has('cancel')) state = 'title';
			if (ctx) drawAllProjectsList(ctx, projects);
		} else if (state === 'playing') {
			accumulator += delta;
			while (accumulator >= FIXED_DT) {
				player.update(FIXED_DT, input, level.platforms);

				for (const c of level.collectibles) {
					if (!c.collected && rectsOverlap(player.rect, c)) {
						c.collected = true;
						collectedSlugs.add(c.projectSlug);
						currentProject = projectsBySlug.get(c.projectSlug) ?? null;
						if (currentProject) state = 'panel';
					}
				}

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
				if (state !== 'playing') break; // a collectible opened the panel mid-step
			}
			renderPlaying();
			if (input.pressedThisFrame.has('inventory')) state = 'inventory';
		} else if (state === 'panel') {
			renderPlaying();
			if (currentProject && ctx) drawProjectPanel(ctx, currentProject);
			if (input.pressedThisFrame.has('cancel')) resumePlaying();
			else if (input.pressedThisFrame.has('confirm') && currentProject) {
				const link = currentProject.links.demo ?? currentProject.links.repo;
				if (link) window.open(link, '_blank', 'noopener,noreferrer');
			}
		} else if (state === 'inventory') {
			renderPlaying();
			if (ctx) drawInventory(ctx, projects, collectedSlugs);
			if (input.pressedThisFrame.has('cancel')) resumePlaying();
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
