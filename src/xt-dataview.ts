/* ========================================================================= */
/* ================================ API Start ============================== */

const PROJECTS_ROOT = "";

const stripTaskText = (task) =>
	task.tags.length === 0
		? task.text
		: task.text.substr(0, task.text.indexOf(task.tags[0])).trim();

const _getPriorityIndicator = (task) => {
	if (task.priority && task.priority >= 4) {
		return "🔴";
	} else if (task.priority && task.priority >= 2) {
		return "🟠";
	} else {
		return "🔵";
	}
};

const _getTimeIndicators = (task) => {
	let timeIndicatorString = "";
	if (task.target) {
		timeIndicatorString += `(🎯${task.target.month}/${task.target.day})`;
	}
	if (task.due) {
		timeIndicatorString += `(📆${task.due.month}/${task.due.day})`;
	}
	return timeIndicatorString;
};

const renderText = (task, page, tagsToOmit) => {
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

const getTaskPriority = (task, page) => {
	let taskPriority = 0;
	for (let c of task.text) {
		if (c === "!") {
			++taskPriority;
		}
	}
	taskPriority += page.priority ? page.priority : 0;
	return taskPriority;
};

const renderTasks = (dv, config) => {
	const rootPage = config.rootPage;
	const match = config.match;
	const omitInDisplay = config.omitInDisplay;

	const pages = dv.pages(`"${rootPage}"`);
	const tasks = [];

	for (const page of pages) {
		for (let task of page.file.tasks) {
			if (!task.completed && match(task, page)) {
				task.priority = getTaskPriority(task, page);
				task.text = renderText(task, page, omitInDisplay);
				tasks.push(task);
			}
		}
	}

	tasks.sort((a, b) => b.priority - a.priority);

	dv.taskList(tasks, false);
};

const renderNextActions = (dv, config) => {
	renderTasks(dv, {
		rootPage: PROJECTS_ROOT,
		match: config.match,
		omitInDisplay: ["#next"],
	});
};

export const tkdv = {
	renderTasks,
	renderNextActions,
	PROJECTS_ROOT,
};
