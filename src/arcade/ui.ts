import type { ProjectSummary } from './project-types';

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
	const words = text.split(' ');
	const lines: string[] = [];
	let current = '';
	for (const word of words) {
		const test = current ? `${current} ${word}` : word;
		if (current && ctx.measureText(test).width > maxWidth) {
			lines.push(current);
			current = word;
		} else {
			current = test;
		}
	}
	if (current) lines.push(current);
	return lines;
}

function panelFrame(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
	ctx.fillStyle = 'rgba(15, 15, 15, 0.55)';
	ctx.fillRect(0, 0, 320, 180);
	ctx.fillStyle = '#0b0b0d';
	ctx.fillRect(x, y, w, h);
	ctx.strokeStyle = '#f8f8f8';
	ctx.lineWidth = 2;
	ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
}

// The project detail panel — opened by walking into a collectible. Every
// field a recruiter needs (title, stack, dates, description, link) is text,
// no gameplay required to read once you're here.
export function drawProjectPanel(ctx: CanvasRenderingContext2D, project: ProjectSummary) {
	const x = 10;
	const y = 14;
	const w = 300;
	const h = 152;
	panelFrame(ctx, x, y, w, h);

	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	let cursorY = y + 8;

	ctx.font = 'bold 11px monospace';
	ctx.fillStyle = '#ffd43b';
	for (const line of wrapText(ctx, project.title.toUpperCase(), w - 16)) {
		ctx.fillText(line, x + 8, cursorY);
		cursorY += 12;
	}

	ctx.font = '8px monospace';
	ctx.fillStyle = '#a5a5aa';
	const meta = [project.dateStart, '–', project.dateEnd, project.role ? `· ${project.role}` : '']
		.filter(Boolean)
		.join(' ');
	ctx.fillText(meta, x + 8, cursorY);
	cursorY += 12;

	if (project.metric) {
		ctx.font = 'bold 9px monospace';
		ctx.fillStyle = '#5c94fc';
		ctx.fillText(project.metric, x + 8, cursorY);
		cursorY += 12;
	}

	ctx.font = '8px monospace';
	ctx.fillStyle = '#f8f8f8';
	for (const line of wrapText(ctx, project.description, w - 16)) {
		ctx.fillText(line, x + 8, cursorY);
		cursorY += 10;
	}

	cursorY += 2;
	ctx.font = '8px monospace';
	ctx.fillStyle = '#3a9b3a';
	ctx.fillText(project.stack.join(' · '), x + 8, cursorY);

	const link = project.links.demo ?? project.links.repo;
	ctx.font = 'bold 8px monospace';
	ctx.fillStyle = '#f8f8f8';
	const hint = link ? 'ENTER: OPEN LINK   ESC: CLOSE' : 'ESC: CLOSE';
	ctx.fillText(hint, x + 8, y + h - 16);
}

function drawList(
	ctx: CanvasRenderingContext2D,
	title: string,
	items: { label: string; done: boolean }[],
) {
	panelFrame(ctx, 10, 6, 300, 168);
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';

	ctx.font = 'bold 11px monospace';
	ctx.fillStyle = '#ffd43b';
	ctx.fillText(title, 18, 12);

	ctx.font = '8px monospace';
	let cy = 28;
	for (const item of items) {
		ctx.fillStyle = item.done ? '#3a9b3a' : '#a5a5aa';
		const mark = item.done ? '[x]' : '[ ]';
		ctx.fillText(`${mark} ${item.label}`, 18, cy);
		cy += 10;
	}

	ctx.font = 'bold 8px monospace';
	ctx.fillStyle = '#f8f8f8';
	ctx.fillText('ESC: CLOSE', 18, 166);
}

// The inventory screen — direct evolution of the old site's Inventory icon.
// Shows every collectible found so far.
export function drawInventory(ctx: CanvasRenderingContext2D, projects: ProjectSummary[], collectedSlugs: Set<string>) {
	drawList(
		ctx,
		`INVENTORY  (${collectedSlugs.size}/${projects.length})`,
		projects.map((p) => ({ label: p.title.toUpperCase(), done: collectedSlugs.has(p.slug) })),
	);
}

// The bypass list, reachable from the title screen without playing at all —
// every project, always fully visible regardless of collection state.
export function drawAllProjectsList(ctx: CanvasRenderingContext2D, projects: ProjectSummary[]) {
	drawList(
		ctx,
		'ALL PROJECTS',
		projects.map((p) => ({ label: p.title.toUpperCase(), done: true })),
	);
}
