import type { Collectible } from './level';

// Bright, animated per the brief's "flashing/bobbing/pulsing so the eye goes
// straight to it" — a small diamond that bobs vertically and pulses in size.
export function drawCollectible(ctx: CanvasRenderingContext2D, c: Collectible, time: number) {
	if (c.collected) return;

	const bob = Math.sin(time * 3 + c.x) * 2;
	const pulse = 1 + Math.sin(time * 5 + c.x) * 0.12;
	const cx = c.x + c.width / 2;
	const cy = c.y + c.height / 2 + bob;
	const r = (c.width / 2) * pulse;

	ctx.fillStyle = '#0f0f0f';
	drawDiamond(ctx, cx, cy, r + 1.5);
	ctx.fillStyle = '#ffd43b';
	drawDiamond(ctx, cx, cy, r);
	ctx.fillStyle = '#f8f8f8';
	drawDiamond(ctx, cx - r * 0.15, cy - r * 0.15, r * 0.35);
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
	ctx.beginPath();
	ctx.moveTo(cx, cy - r);
	ctx.lineTo(cx + r, cy);
	ctx.lineTo(cx, cy + r);
	ctx.lineTo(cx - r, cy);
	ctx.closePath();
	ctx.fill();
}

export function rectsOverlap(
	a: { x: number; y: number; width: number; height: number },
	b: { x: number; y: number; width: number; height: number },
): boolean {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
