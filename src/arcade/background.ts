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

export function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
	ctx.fillStyle = SKY;
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = HILL_FAR;
	drawHill(ctx, 40, height - 8, 55);
	drawHill(ctx, 170, height - 8, 70);
	drawHill(ctx, 290, height - 8, 50);

	ctx.fillStyle = HILL_NEAR;
	drawHill(ctx, 90, height - 4, 45);
	drawHill(ctx, 230, height - 4, 60);
	drawHill(ctx, 320, height - 4, 40);

	ctx.fillStyle = CLOUD;
	drawCloud(ctx, 40, 28);
	drawCloud(ctx, 170, 18);
	drawCloud(ctx, 260, 34);
}
