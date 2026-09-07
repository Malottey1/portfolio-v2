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
	H: '#2b1d14', // hair
	C: '#e8a33d', // shirt light
	L: '#b8792a', // shirt dark
	Y: '#ffd43b', // accent yellow
	P: '#52585f', // gray (pants/shoes/stone)
};

export type PixelGrid = string[];

// Player, standing/idle pose. Big head, small body, thick outline, exaggerated
// proportions per the brief — derived from the existing "programmer" sprite's
// proportions and outline technique, redrawn with an afro instead of
// glasses+short hair so it reads as the same identity as the chrome head.
export const PLAYER_IDLE: PixelGrid = [
	'......KK......',
	'.....KHHK.....',
	'....KHHHHK....',
	'...KHHHHHHK...',
	'..KHHHHHHHHK..',
	'KHHHHHHHHHHHHK',
	'KHHSSSSSSSSHHK',
	'KHSSKSSSSKSSHK',
	'KHSSSSSSSSSSHK',
	'KHSSDDSSDDSSHK',
	'KSSSSSSSSSSSSK',
	'.KSSSSSSSSSSK.',
	'KCCCCCCCCCCCCK',
	'KCCLLCCCCLLCCK',
	'KCCCCCCCCCCCCK',
	'KCCCCCCCCCCCCK',
	'KCCPPCCCCPPCCK',
	'KCCCCCCCCCCCCK',
	'KPPPP....PPPPK',
	'KPPPP....PPPPK',
	'KKPPP....PPPKK',
	'.KKPP....PPKK.',
];

// Walk cycle: two frames, legs alternating. Reuses the idle torso/head
// unchanged (only the leg rows differ) to keep the silhouette stable while
// moving, per "readable at a glance while moving."
export const PLAYER_WALK_1: PixelGrid = [
	...PLAYER_IDLE.slice(0, 18),
	'KPP.......PPPK',
	'KPPP.....PPPPK',
	'.KPP....PPPKK.',
	'..KP....PKK...',
];

export const PLAYER_WALK_2: PixelGrid = [
	...PLAYER_IDLE.slice(0, 18),
	'KPPP.....PPPPK',
	'KPPPP....PPPPK',
	'.KKPP....PPK..',
	'...KP....PK...',
];

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
