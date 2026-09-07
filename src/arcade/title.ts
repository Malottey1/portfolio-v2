import { drawBackground } from './background';
import { PLAYER_IDLE, drawGrid } from './sprites';

function outlinedText(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	fill: string,
) {
	ctx.fillStyle = '#0f0f0f';
	for (const [ox, oy] of [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	]) {
		ctx.fillText(text, x + ox, y + oy);
	}
	ctx.fillStyle = fill;
	ctx.fillText(text, x, y);
}

export function drawTitleScreen(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	blinkOn: boolean,
) {
	drawBackground(ctx, width, height);

	const cx = width / 2;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	ctx.font = 'bold 22px monospace';
	outlinedText(ctx, "MALCOLM'S WORLD", cx, 40, '#ffd43b');

	ctx.font = '10px monospace';
	outlinedText(ctx, 'A PLAYABLE PORTFOLIO', cx, 58, '#f8f8f8');

	drawGrid(ctx, PLAYER_IDLE, cx - PLAYER_IDLE[0].length / 2, 68, false);

	if (blinkOn) {
		ctx.font = 'bold 12px monospace';
		outlinedText(ctx, 'PRESS SPACE TO START', cx, 148, '#f8f8f8');
	}

	ctx.font = '9px monospace';
	outlinedText(ctx, 'ARROWS / WASD MOVE   SPACE / UP JUMP', cx, 168, '#f8f8f8');
}
