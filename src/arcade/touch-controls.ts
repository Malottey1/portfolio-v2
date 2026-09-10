import type { InputAction } from './input';

// On-screen d-pad + action buttons, shown only on coarse-pointer (touch)
// devices — a mouse/trackpad user never sees these. Each button drives the
// same InputAction set the keyboard does via setVirtual, so the rest of the
// game never needs to know which input source is active.
export function createTouchControls(
	setAction: (action: InputAction, active: boolean) => void,
): () => void {
	if (!window.matchMedia('(pointer: coarse)').matches) {
		return () => {};
	}

	const root = document.createElement('div');
	root.setAttribute('aria-hidden', 'true');
	Object.assign(root.style, {
		position: 'fixed',
		inset: '0',
		zIndex: '20',
		pointerEvents: 'none',
	});

	function makeButton(label: string, style: Partial<CSSStyleDeclaration>) {
		const btn = document.createElement('button');
		btn.textContent = label;
		Object.assign(btn.style, {
			position: 'absolute',
			width: '56px',
			height: '56px',
			borderRadius: '50%',
			border: '2px solid rgba(255,255,255,0.6)',
			background: 'rgba(15,15,15,0.55)',
			color: '#f8f8f8',
			fontFamily: 'monospace',
			fontWeight: 'bold',
			fontSize: '16px',
			pointerEvents: 'auto',
			touchAction: 'none',
			userSelect: 'none',
			WebkitUserSelect: 'none',
			...style,
		});
		root.appendChild(btn);
		return btn;
	}

	function bind(btn: HTMLButtonElement, action: InputAction) {
		const down = (e: PointerEvent) => {
			e.preventDefault();
			btn.style.background = 'rgba(255,255,255,0.35)';
			setAction(action, true);
		};
		const up = (e: PointerEvent) => {
			e.preventDefault();
			btn.style.background = 'rgba(15,15,15,0.55)';
			setAction(action, false);
		};
		btn.addEventListener('pointerdown', down);
		btn.addEventListener('pointerup', up);
		btn.addEventListener('pointercancel', up);
		btn.addEventListener('pointerleave', up);
	}

	const left = makeButton('◀', { left: '16px', bottom: '24px' });
	const right = makeButton('▶', { left: '80px', bottom: '24px' });
	const jump = makeButton('▲', { right: '16px', bottom: '32px', width: '68px', height: '68px' });
	const cancel = makeButton('X', { right: '96px', bottom: '32px' });
	const inventory = makeButton('I', { right: '16px', bottom: '112px' });
	const skills = makeButton('K', { right: '96px', bottom: '112px' });

	bind(left, 'left');
	bind(right, 'right');
	bind(cancel, 'cancel');
	bind(inventory, 'inventory');
	bind(skills, 'skills');

	// Jump also confirms (opens a project link) so one button covers both
	// gameplay and menu contexts on touch.
	const jumpDown = (e: PointerEvent) => {
		e.preventDefault();
		jump.style.background = 'rgba(255,255,255,0.35)';
		setAction('jump', true);
		setAction('confirm', true);
	};
	const jumpUp = (e: PointerEvent) => {
		e.preventDefault();
		jump.style.background = 'rgba(15,15,15,0.55)';
		setAction('jump', false);
		setAction('confirm', false);
	};
	jump.addEventListener('pointerdown', jumpDown);
	jump.addEventListener('pointerup', jumpUp);
	jump.addEventListener('pointercancel', jumpUp);
	jump.addEventListener('pointerleave', jumpUp);

	document.body.appendChild(root);

	return () => {
		root.remove();
	};
}
