import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

interface StkPluginSettings {
	actionsRoot: string;
}

const DEFAULT_SETTINGS: StkPluginSettings = {
	actionsRoot: "",
};

export default class ObsidianStkPlugin extends Plugin {
	settings: StkPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new StkSettingsTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class StkSettingsTab extends PluginSettingTab {
	plugin: ObsidianStkPlugin;

	constructor(app: App, plugin: ObsidianStkPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("actionsRoot")
			.setDesc("Root to query tasks")
			.addText((text) =>
				text
					.setPlaceholder("Actions Root")
					.setValue(this.plugin.settings.actionsRoot)
					.onChange(async (value) => {
						this.plugin.settings.actionsRoot = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
