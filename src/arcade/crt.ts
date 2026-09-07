// Subtle scanlines + vignette. Cheap: a handful of 1px fillRects and one
// radial gradient, well under budget for a 320x180 canvas at 60fps.
let vignette: CanvasGradient | null = null;

export function drawCrtOverlay(ctx: CanvasRenderingContext2D, width: number, height: number) {
	ctx.save();
	ctx.globalAlpha = 0.06;
	ctx.fillStyle = '#000000';
	for (let y = 0; y < height; y += 2) {
		ctx.fillRect(0, y, width, 1);
	}
	ctx.restore();

	if (!vignette) {
		vignette = ctx.createRadialGradient(
			width / 2,
			height / 2,
			height * 0.35,
			width / 2,
			height / 2,
			height * 0.9,
		);
		vignette.addColorStop(0, 'rgba(0,0,0,0)');
		vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
	}
	ctx.save();
	ctx.fillStyle = vignette;
	ctx.fillRect(0, 0, width, height);
	ctx.restore();
}
