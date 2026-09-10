// Hand-authored pixel-art sprites, defined as small string grids rather than
// binary image assets — this is the same fixed 16-color palette used
// everywhere in the game, and never sampled outside it. One character = one
// pixel at the game's native resolution.
export const PALETTE: Record<string, string> = {
	K: '#0f0f0f', // outline
	W: '#f8f8f8', // white / highlight
	U: '#5c94fc', // sky blue
	B: '#8b5a2b', // ground light
	N: '#5c3a1a', // ground dark
	G: '#3a9b3a', // grass light
	X: '#256b25', // grass dark
	R: '#b04a3a', // brick light
	E: '#7a2f22', // brick dark
	S: '#a56b3c', // skin light
	D: '#7a4a28', // skin dark
	H: '#9a9a9e', // hair (gray)
	C: '#3d4147', // shirt light (charcoal)
	L: '#1c1e21', // shirt dark (charcoal)
	Y: '#ffd43b', // accent yellow
	P: '#52585f', // gray (pants/shoes/stone)
};

export type PixelGrid = string[];

// The player itself is drawn from a real image (see player-sprite.ts), not
// a hand-authored grid — everything else in the arcade still uses this
// fixed-palette pixel-art system.

export const TILE_GROUND: PixelGrid = [
	'KKKKKKKKKKKKKKKK',
	'KGGGGGGGGGGGGGGK',
	'KGXGGGXGGGGXGGGK',
	'KBBBBBBBBBBBBBBK',
	'KBNBBBBNBBBBNBBK',
	'KBBBBBBBBBBBBBBK',
	'KBBNBBBBBBNBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KBNBBBBNBBBBNBBK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KBNBBBBBBBBNBBBK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KKKKKKKKKKKKKKKK',
];

export const TILE_PLATFORM: PixelGrid = [
	'KKKKKKKKKKKKKKKK',
	'KRRRRRRRRRRRRRRK',
	'KREEERERREEERERK',
	'KRRRRRRRRRRRRRRK',
	'KEERREEEERREEERK',
	'KRRRRRRRRRRRRRRK',
	'KRREEEERREEEERRK',
	'KRRRRRRRRRRRRRRK',
	'KKKKKKKKKKKKKKKK',
];

// Original wooden crate — reuses the ground tile's own brown/dark-brown
// pair rather than introducing new colors; the plank-seam pattern is what
// makes it read as a distinct prop, not a new hue. Deliberately not a green
// pipe or anything else evoking existing platformer IP.
export const TILE_CRATE: PixelGrid = [
	'KKKKKKKKKKKKKKKK',
	'KNBBBBBBBBBBBBNK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KNNNNNNNNNNNNNNK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KNNNNNNNNNNNNNNK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KBBBBBBBBBBBBBBK',
	'KNBBBBBBBBBBBBNK',
	'KKKKKKKKKKKKKKKK',
];

// HUD icon for the inventory/skills screens — a satchel with a clasp,
// reusing the ground tile's brown/dark-brown pair so no new palette
// colors are introduced.
export const ICON_INVENTORY: PixelGrid = [
	'...KKKKKKKK...',
	'..KBBBBBBBKK..',
	'.KBBBBBBBBBNK.',
	'KBBBBBBBBBBNKK',
	'KBBBBBBBBBBBNK',
	'KBBBKKKKBBBBNK',
	'KBBKNNNNKBBBNK',
	'KBBKNNNNKBBBNK',
	'KBBBKKKKBBBBNK',
	'KBBBBBBBBBBBNK',
	'KBBBBBBBBBBBNK',
	'KBBBBBBBBBBBNK',
	'KBBBBBBBBBBBNK',
	'.KKKKKKKKKKKK.',
];

export function drawGrid(
	ctx: CanvasRenderingContext2D,
	grid: PixelGrid,
	x: number,
	y: number,
	flipX = false,
) {
	const h = grid.length;
	const w = grid[0].length;
	for (let row = 0; row < h; row++) {
		const line = grid[row];
		for (let col = 0; col < w; col++) {
			const ch = flipX ? line[w - 1 - col] : line[col];
			if (ch === '.') continue;
			const color = PALETTE[ch];
			if (!color) continue;
			ctx.fillStyle = color;
			ctx.fillRect(Math.round(x + col), Math.round(y + row), 1, 1);
		}
	}
}

// Tiles a fixed-size pixel-art grid across an arbitrary-sized rect, clipping
// partial tiles at the edges so platforms of any width/height stay crisp.
export function drawTiled(
	ctx: CanvasRenderingContext2D,
	grid: PixelGrid,
	rectX: number,
	rectY: number,
	rectW: number,
	rectH: number,
) {
	const tileH = grid.length;
	const tileW = grid[0].length;
	ctx.save();
	ctx.beginPath();
	ctx.rect(rectX, rectY, rectW, rectH);
	ctx.clip();
	for (let ty = rectY; ty < rectY + rectH; ty += tileH) {
		for (let tx = rectX; tx < rectX + rectW; tx += tileW) {
			drawGrid(ctx, grid, tx, ty);
		}
	}
	ctx.restore();
}
