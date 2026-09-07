export type InputAction = 'left' | 'right' | 'jump' | 'view' | 'inventory' | 'confirm' | 'cancel' | 'mute';

// Arrow keys and WASD both map to the same actions, plus Space for jump.
const KEY_MAP: Record<string, InputAction> = {
	ArrowLeft: 'left',
	KeyA: 'left',
	ArrowRight: 'right',
	KeyD: 'right',
	ArrowUp: 'jump',
	KeyW: 'jump',
	Space: 'jump',
	KeyV: 'view',
	KeyI: 'inventory',
	Enter: 'confirm',
	Escape: 'cancel',
	KeyM: 'mute',
};

// Tracks held keys plus per-rendered-frame press/release edges. Edges are
// snapshotted once per requestAnimationFrame callback (via beginFrame), then
// held constant across however many fixed physics steps run that frame —
// see game.ts. This keeps a single real keypress from being seen as
// multiple presses if the accumulator ever runs more than one step.
export class InputState {
	held = new Set<InputAction>();
	pressedThisFrame = new Set<InputAction>();
	releasedThisFrame = new Set<InputAction>();

	private queueDown: InputAction[] = [];
	private queueUp: InputAction[] = [];

	constructor() {
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}

	private onKeyDown = (e: KeyboardEvent) => {
		const action = KEY_MAP[e.code];
		if (!action) return;
		e.preventDefault();
		if (!this.held.has(action)) this.queueDown.push(action);
		this.held.add(action);
	};

	private onKeyUp = (e: KeyboardEvent) => {
		const action = KEY_MAP[e.code];
		if (!action) return;
		e.preventDefault();
		this.held.delete(action);
		this.queueUp.push(action);
	};

	// Lets non-keyboard input (on-screen touch controls) drive the exact
	// same action set as the keyboard, so downstream code never needs to
	// know which one produced an action.
	setVirtual(action: InputAction, active: boolean) {
		if (active) {
			if (!this.held.has(action)) this.queueDown.push(action);
			this.held.add(action);
		} else {
			if (this.held.has(action)) this.queueUp.push(action);
			this.held.delete(action);
		}
	}

	beginFrame() {
		this.pressedThisFrame = new Set(this.queueDown);
		this.releasedThisFrame = new Set(this.queueUp);
		this.queueDown = [];
		this.queueUp = [];
	}

	destroy() {
		window.removeEventListener('keydown', this.onKeyDown);
		window.removeEventListener('keyup', this.onKeyUp);
	}
}
