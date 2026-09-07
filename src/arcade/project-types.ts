export interface ProjectSummary {
	slug: string;
	title: string;
	description: string;
	stack: string[];
	dateStart: string;
	dateEnd: string;
	role?: string;
	metric?: string;
	links: { repo?: string; demo?: string };
}
