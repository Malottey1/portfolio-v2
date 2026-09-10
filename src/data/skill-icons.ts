// Maps each skill name (must match src/data/skills.ts exactly) to a logo
// asset in public/images/skills/. Reuses the old portfolio's own
// program-logos where the skill still applies, and pulls the rest from
// devicon (MIT-licensed) for skills added since. Skills with no widely
// recognized product mark (techniques, not tools) are left unmapped and
// fall back to a text label in the grid.
export const skillIcons: Record<string, string> = {
	Python: '/images/skills/python.png',
	Java: '/images/skills/java.png',
	JavaScript: '/images/skills/javascript.png',
	TypeScript: '/images/skills/typescript.svg',
	'C++': '/images/skills/cpp.png',
	SQL: '/images/skills/sql.png',
	Dart: '/images/skills/dart.png',
	R: '/images/skills/r.png',
	React: '/images/skills/react.png',
	'Next.js': '/images/skills/nextjs.svg',
	'Node/Express': '/images/skills/nodejs.svg',
	Django: '/images/skills/django.svg',
	Flask: '/images/skills/flask.png',
	FastAPI: '/images/skills/fastapi.svg',
	Flutter: '/images/skills/flutter.png',
	'.NET': '/images/skills/dotnet.svg',
	PostgreSQL: '/images/skills/postgresql.svg',
	MySQL: '/images/skills/mysql.svg',
	MongoDB: '/images/skills/mongodb.svg',
	Prisma: '/images/skills/prisma.svg',
	Firebase: '/images/skills/firebase.svg',
	'AWS (EC2, ECS)': '/images/skills/aws.png',
	Docker: '/images/skills/docker.png',
	'GitHub Actions': '/images/skills/githubactions.svg',
	Prometheus: '/images/skills/prometheus.png',
	Grafana: '/images/skills/grafana.png',
	NGINX: '/images/skills/nginx.svg',
	Git: '/images/skills/git.png',
	PyTorch: '/images/skills/pytorch.svg',
};
