// The player's actual character art — composited from the user's own
// reference portrait (color layer + alpha silhouette), cropped to its
// bounding box and downscaled to the game's native pixel scale. Unlike the
// other sprites in this file, this one is a real image asset rather than a
// hand-authored palette grid, because the brief here was to use the exact
// character design, not a pixel-art reinterpretation of it.
export const PLAYER_SPRITE_SRC = '/images/arcade/player.png';
export const PLAYER_SPRITE_WIDTH = 15;
export const PLAYER_SPRITE_HEIGHT = 29;

let cached: HTMLImageElement | null = null;
export function getPlayerImage(): HTMLImageElement {
	if (!cached) {
		cached = new Image();
		cached.src = PLAYER_SPRITE_SRC;
	}
	return cached;
}
