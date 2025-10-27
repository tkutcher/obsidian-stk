import { STask } from "obsidian-dataview";
import { DataviewApi } from "obsidian-dataview";

type _STask = STask & {
	tags: string[];
};

const standardTaskDisplay = (task: TkTask) => {
	const priority = task.getPriority();
	const priorityEmojis = ["🔵", "🔵", "🔵", "🟠", "🔴", "🚨"];
	const priorityEmoji =
		priority < priorityEmojis.length ? priorityEmojis[priority] : "🔴";
	return `${priorityEmoji} ${task.textWithoutExtra}`;
};

class TkTask {
	constructor(private _task: _STask) {}

	get tags() {
		return this._task.tags;
	}

	get text() {
		return this._task.text;
	}

	get completed(): boolean {
		return this._task.completed;
	}

	get textWithoutExtra() {
		let result = this.text;
		for (const tag of this.tags) {
			result = result.replace(tag, "");
		}
		result = result.replace(/!/g, "");
		result = result.replace(/\[[^\]]*\]/g, "");
		return result.trim();
	}

	hasTag(t: string): boolean {
		return this.tags.some((t2: string) => t2 === t);
	}

	unwrap(display: (task: TkTask) => string): STask {
		return { ...this._task, visual: display(this) };
	}

	private countExclamationPoints(): number {
		let count = 0;
		for (const char of this.text) {
			if (char === "!") {
				count++;
			}
		}
		return count;
	}

	getPriority(): number {
		return this.countExclamationPoints();
	}

	display() {
		return standardTaskDisplay(this);
	}
}

export interface TkTaskQuery {
	pagesQuery: string;
	taskMatch: (task: TkTask) => boolean;
	display?: (task: TkTask) => string;
}

export class TkDataviewApi {
	constructor() {}

	// TODO - see if we can get the dataview object without having to pass
	//  it in for each call.

	queryTasks(dv: DataviewApi, query: TkTaskQuery): Promise<void> {
		const display = query.display ?? standardTaskDisplay;
		const tasks = dv
			.pages(query.pagesQuery)
			.flatMap<STask>((page) => page.file.tasks ?? [])
			.map<TkTask>((task) => new TkTask(task))
			.filter((task) => query.taskMatch(task))
			.sort((task) => task.getPriority(), "desc")
			.map<STask>((task) => task.unwrap(display));
		// @ts-ignore - Something wrong with types for this?
		return dv.taskList(tasks, false);
	}
}
