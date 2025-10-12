import { STask } from "obsidian-dataview";
import { SMarkdownPage } from "obsidian-dataview";
import { DataviewApi } from "obsidian-dataview";

const PROJECTS_ROOT = "";

const stripTaskText = (task: STask) =>
	task.tags.length === 0
		? task.text
		: task.text.substring(0, task.text.indexOf(task.tags[0])).trim();

const _getPriorityIndicator = (task: STask) => {
	if (task.priority && task.priority >= 4) {
		return "🔴";
	} else if (task.priority && task.priority >= 2) {
		return "🟠";
	} else {
		return "🔵";
	}
};

const _getTimeIndicators = (task: STask) => {
	let timeIndicatorString = "";
	if (task.target) {
		timeIndicatorString += `(🎯${task.target.month}/${task.target.day})`;
	}
	if (task.due) {
		timeIndicatorString += `(📆${task.due.month}/${task.due.day})`;
	}
	return timeIndicatorString;
};

const renderText = (task: STask, page: SMarkdownPage, tagsToOmit: string[]) => {
	const link = `[[${page.file.name}]]`;
	let tags = task.tags.toString().replace(",", " ");
	tagsToOmit.forEach((omission) => {
		tags = tags.replace(omission, "");
	});
	tags = tags.trim();
	const prefix = _getPriorityIndicator(task);
	const timeIndicators = _getTimeIndicators(task);
	return `${prefix} **${link}**: ${stripTaskText(task)} ${tags} ${timeIndicators}`;
};

const getTaskPriority = (task: STask, page: SMarkdownPage) => {
	let taskPriority = 0;
	for (const c of task.text) {
		if (c === "!") {
			++taskPriority;
		}
	}
	taskPriority += page.priority ? page.priority : 0;
	return taskPriority;
};

interface RenderTasksConfig {
	rootPage: string;
	match: (task: STask, page: SMarkdownPage) => boolean;
	omitInDisplay: string[];
}

const renderTasks = (dv: DataviewApi, config: RenderTasksConfig) => {
	const rootPage = config.rootPage;
	const match = config.match;
	// const omitInDisplay = config.omitInDisplay;

	const pages = dv.pages(`"${rootPage}"`);
	const tasks = [];

	for (const page of pages) {
		for (const task of page.file.tasks) {
			if (match(task, page)) {
				task.priority = getTaskPriority(task, page);
				task.visual = renderText(task, page, []);
				tasks.push(task);
			}
		}
	}

	tasks.sort((a, b) => b.priority - a.priority);

	dv.taskList(tasks, false);
};

const renderNextActions = (dv: DataviewApi, config: RenderTasksConfig) => {
	renderTasks(dv, {
		rootPage: PROJECTS_ROOT,
		match: config.match,
		omitInDisplay: ["#next"],
	});
};

export interface TkdvLegacyApi {
	PROJECTS_ROOT: string;
	renderTasks: (dv: DataviewApi, config: RenderTasksConfig) => void;
	renderNextActions: (dv: DataviewApi, config: RenderTasksConfig) => void;
}

export const tkdvLegacy = {
	renderTasks,
	renderNextActions,
	PROJECTS_ROOT,
};
