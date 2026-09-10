import type { ProjectSummary } from './project-types';
import { ICON_INVENTORY, drawGrid } from './sprites';
import { skillIcons } from '../data/skill-icons';

type SkillGroup = { label: string; items: string[] };

// Cycles through 5 accent colors, one per skill category — Languages,
// Frameworks, Databases, Cloud & DevOps, AI/ML — so the grid still reads as
// grouped even for the handful of skills that fall back to a text label.
const GROUP_COLORS = ['#ffd43b', '#5c94fc', '#3a9b3a', '#b04a3a', '#f8f8f8'];

// Shortened labels for the text-fallback cells only (skills with no widely
// recognized logo) — the canonical, full names still show on the main
// site's Skills section.
const GRID_ABBREVIATIONS: Record<string, string> = {
	'Federated learning': 'FED LEARN',
	'LLM agents': 'LLM AGENTS',
};

// Real skill logos are loaded lazily and cached by src — the grid gets
// re-drawn every frame while open, so this avoids spinning up a fresh
// Image() (and re-triggering a network request) each time.
const imageCache = new Map<string, HTMLImageElement>();
function getImage(src: string): HTMLImageElement {
	let img = imageCache.get(src);
	if (!img) {
		img = new Image();
		img.src = src;
		imageCache.set(src, img);
	}
	return img;
}

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

	ctx.font = 'bold 8px monospace';
	ctx.fillStyle = '#c4c4cc';
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

	ctx.font = 'bold 8px monospace';
	ctx.fillStyle = '#f8f8f8';
	for (const line of wrapText(ctx, project.details ?? project.description, w - 16)) {
		ctx.fillText(line, x + 8, cursorY);
		cursorY += 10;
	}

	cursorY += 2;
	ctx.font = 'bold 8px monospace';
	ctx.fillStyle = '#4fcf4f';
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

	drawGrid(ctx, ICON_INVENTORY, 274, 10, false);

	ctx.font = 'bold 11px monospace';
	ctx.fillStyle = '#ffd43b';
	ctx.fillText(title, 18, 12);

	ctx.font = 'bold 8px monospace';
	let cy = 28;
	for (const item of items) {
		ctx.fillStyle = item.done ? '#4fcf4f' : '#c4c4cc';
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

// The tools & languages grid — the old site's original "Inventory" screen,
// reachable independently of the project-collectible inventory above.
// One cell per skill, tinted by category (Languages/Frameworks/Databases/
// Cloud & DevOps/AI-ML) so the grouping still reads without a header row.
export function drawSkillsGrid(ctx: CanvasRenderingContext2D, groups: SkillGroup[]) {
	const x = 10;
	const y = 6;
	const w = 300;
	const h = 168;
	panelFrame(ctx, x, y, w, h);

	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';

	drawGrid(ctx, ICON_INVENTORY, x + 264, y + 4, false);

	ctx.font = 'bold 11px monospace';
	ctx.fillStyle = '#ffd43b';
	ctx.fillText('SKILLS', x + 8, y + 6);

	const cols = 5;
	const cellW = (w - 16) / cols;
	const cellH = 19;
	const gridTop = y + 22;
	const iconSize = 14;

	let i = 0;
	for (const group of groups) {
		for (const item of group.items) {
			const col = i % cols;
			const row = Math.floor(i / cols);
			const cx = x + 8 + col * cellW;
			const cy = gridTop + row * cellH;
			const color = GROUP_COLORS[groups.indexOf(group)];

			const src = skillIcons[item];
			if (src) {
				const img = getImage(src);
				if (img.complete && img.naturalWidth > 0) {
					ctx.drawImage(img, cx, cy, iconSize, iconSize);
				} else {
					// Logo hasn't loaded yet — a category-colored placeholder
					// holds the cell's position so the grid doesn't jump once
					// it pops in a frame or two later.
					ctx.fillStyle = color;
					ctx.fillRect(cx, cy, iconSize, iconSize);
				}
			} else {
				ctx.fillStyle = color;
				ctx.fillRect(cx, cy, 3, cellH - 4);
				const label = (GRID_ABBREVIATIONS[item] ?? item).toUpperCase();
				ctx.font = 'bold 7px monospace';
				ctx.fillStyle = '#f8f8f8';
				ctx.fillText(label, cx + 6, cy + 3);
			}
			i++;
		}
	}

	ctx.font = 'bold 8px monospace';
	ctx.fillStyle = '#f8f8f8';
	ctx.fillText('ESC: CLOSE', x + 8, y + h - 10);
}
