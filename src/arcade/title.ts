import { drawBackground } from './background';
import { getPlayerImage, PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT } from './player-sprite';

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

	const playerImg = getPlayerImage();
	if (playerImg.complete && playerImg.naturalWidth > 0) {
		ctx.drawImage(playerImg, cx - PLAYER_SPRITE_WIDTH / 2, 68, PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT);
	}

	if (blinkOn) {
		ctx.font = 'bold 12px monospace';
		outlinedText(ctx, 'PRESS SPACE TO START', cx, 130, '#f8f8f8');
	}

	ctx.font = 'bold 9px monospace';
	outlinedText(ctx, 'V: PROJECTS   K: SKILLS — NO PLAY REQUIRED', cx, 148, '#5c94fc');

	ctx.font = '9px monospace';
	outlinedText(ctx, 'ARROWS / WASD MOVE   SPACE / UP JUMP', cx, 166, '#f8f8f8');
}
