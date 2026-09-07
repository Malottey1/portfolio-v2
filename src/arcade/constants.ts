// Fixed internal render resolution — everything is designed against these
// units, then scaled up by whole-number factors at render time.
export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 180;

export const PHYSICS = {
	fixedDt: 1 / 60,

	// Horizontal movement: acceleration/friction curves, not a binary
	// max-speed snap. turnAccel is higher than moveAccel so reversing
	// direction feels responsive rather than sluggish.
	moveAccel: 600,
	moveDecel: 800,
	turnAccel: 1000,
	maxRunSpeed: 90,

	// Asymmetric gravity: lighter while ascending with jump held (floatier
	// rise), heavier while falling (snappier descent). This is what makes a
	// jump arc feel intentional rather than like a binary hop.
	gravityRise: 500,
	gravityFall: 900,
	jumpVelocity: -230,
	// Releasing jump early while still ascending cuts upward velocity by
	// this factor, producing the variable jump height.
	jumpCutMultiplier: 0.5,
	maxFallSpeed: 400,

	// Forgiveness windows, both in seconds.
	coyoteTime: 0.1,
	jumpBufferTime: 0.12,
};
