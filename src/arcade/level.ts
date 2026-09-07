export interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
	type?: 'ground' | 'platform' | 'crate';
}

export interface Collectible {
	x: number;
	y: number;
	width: number;
	height: number;
	projectSlug: string;
	collected: boolean;
}

export interface Level {
	platforms: Rect[];
	collectibles: Collectible[];
	width: number;
	spawn: { x: number; y: number };
}

const GROUND_Y = 160;
const SEGMENT_WIDTH = 70;
const GAP_WIDTH = 32;
const ITEM_SIZE = 12;

// Tile-based, generated from the reusable ground/platform/crate set rather
// than hand-placed — one segment per project, in content-collection order.
// Every third segment opens with a gap (tests the running-jump skills the
// core loop was built for); every fourth raises the collectible onto a
// platform for visual variety. Nothing here is punishing: gaps are well
// within the jump arc established in the core-feel stage, and every project
// is also reachable from the inventory/bypass list without playing at all.
export function generateLevel(projectSlugs: string[]): Level {
	const platforms: Rect[] = [];
	const collectibles: Collectible[] = [];
	let x = 0;

	for (let i = 0; i < projectSlugs.length; i++) {
		if (i > 0 && i % 3 === 0) x += GAP_WIDTH;

		const raised = i % 4 === 3;
		platforms.push({ x, y: GROUND_Y, width: SEGMENT_WIDTH, height: 20, type: 'ground' });

		if (raised) {
			const plat = { x: x + 14, y: GROUND_Y - 40, width: SEGMENT_WIDTH - 28, height: 12, type: 'platform' as const };
			platforms.push(plat);
			collectibles.push({
				x: plat.x + plat.width / 2 - ITEM_SIZE / 2,
				y: plat.y - ITEM_SIZE - 2,
				width: ITEM_SIZE,
				height: ITEM_SIZE,
				projectSlug: projectSlugs[i],
				collected: false,
			});
		} else {
			collectibles.push({
				x: x + SEGMENT_WIDTH / 2 - ITEM_SIZE / 2,
				y: GROUND_Y - ITEM_SIZE - 4,
				width: ITEM_SIZE,
				height: ITEM_SIZE,
				projectSlug: projectSlugs[i],
				collected: false,
			});
		}

		x += SEGMENT_WIDTH;
	}

	return { platforms, collectibles, width: x, spawn: { x: 6, y: 140 } };
}
