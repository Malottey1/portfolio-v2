// Flat, layered background — sky, distant hills, clouds. No gradients, no
// texture noise; everything drawn from the same fixed palette. Hills are
// drawn before the tilemap so the ground line naturally clips their base,
// reading as depth without needing an actual scroll-rate-separated camera
// yet (that lands with real multi-screen levels in the content pass).
const SKY = '#5c94fc';
const CLOUD = '#f8f8f8';
const HILL_FAR = '#3a9b3a';
const HILL_NEAR = '#256b25';

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
	ctx.beginPath();
	ctx.arc(x, y, 6, 0, Math.PI * 2);
	ctx.arc(x + 7, y - 3, 8, 0, Math.PI * 2);
	ctx.arc(x + 15, y, 6, 0, Math.PI * 2);
	ctx.fill();
}

function drawHill(ctx: CanvasRenderingContext2D, cx: number, baseY: number, radius: number) {
	ctx.beginPath();
	ctx.arc(cx, baseY, radius, Math.PI, 0);
	ctx.fill();
}

export function drawBackground(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	cameraX = 0,
) {
	ctx.fillStyle = SKY;
	ctx.fillRect(0, 0, width, height);

	// Cheap parallax: distant layers move at a fraction of camera speed.
	const farX = -cameraX * 0.25;
	const nearX = -cameraX * 0.4;
	const cloudX = -cameraX * 0.12;

	ctx.fillStyle = HILL_FAR;
	for (const base of [40, 170, 290, 420, 550, 680, 810]) {
		drawHill(ctx, base + farX, height - 8, 55);
	}

	ctx.fillStyle = HILL_NEAR;
	for (const base of [90, 230, 320, 470, 600, 740]) {
		drawHill(ctx, base + nearX, height - 4, 45);
	}

	ctx.fillStyle = CLOUD;
	for (const [bx, by] of [
		[40, 28],
		[170, 18],
		[260, 34],
		[420, 24],
		[560, 16],
		[700, 30],
	] as const) {
		drawCloud(ctx, bx + cloudX, by);
	}
}
