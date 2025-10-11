import { STask } from "obsidian-dataview";
import { SMarkdownPage } from "obsidian-dataview";
import { DataviewApi } from "obsidian-dataview";

class TkTask {
	constructor(private _task: STask) {}
}

export class TkDataviewApi {
	constructor() {}

	queryTasks(query: string) {
		console.log("query: " + query);
	}
}
