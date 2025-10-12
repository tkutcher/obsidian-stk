import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { tkdvLegacy } from "./tk-dataview-legacy";
import { TkdvLegacyApi } from "./tk-dataview-legacy";
import { TkDataviewApi } from "./tk-dataview";
import { TkTaskCompletionFeature } from "./task-completion";

export interface OBSIDIAN_STK_API {
	dv: TkDataviewApi;
	dvLegacy: TkdvLegacyApi;
}

declare global {
	// noinspection JSUnusedGlobalSymbols
	interface Window {
		tk: OBSIDIAN_STK_API;
	}
}

export class ObsidianStkPlugin extends Plugin {
	private taskCompletion: TkTaskCompletionFeature;

	private setupWindow() {
		window.tk = window.tk || {};
		window.tk.dvLegacy = tkdvLegacy;
		window.tk.dv = new TkDataviewApi();
	}

	async onload() {
		this.setupWindow();
		this.taskCompletion = new TkTaskCompletionFeature(this);

		await this.taskCompletion.onload();
	}

	onunload() {}
}
