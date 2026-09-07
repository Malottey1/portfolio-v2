export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
	type?: 'ground' | 'platform';
}

// Placeholder-art test level: solid ground, a gap (tests running jumps and
// coyote time), then a raised ledge just under max jump height (tests
// variable jump height — a short tap won't clear it, a full hold will).
export function createTestLevel(): Rect[] {
	return [
		{ x: 0, y: 160, width: 100, height: 20, type: 'ground' },
		{ x: 140, y: 160, width: 60, height: 20, type: 'ground' },
		{ x: 220, y: 108, width: 60, height: 12, type: 'platform' },
		{ x: 280, y: 160, width: 40, height: 20, type: 'ground' },
	];
}

export const PLAYER_SPAWN = { x: 20, y: 140 };
