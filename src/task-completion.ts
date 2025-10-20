import { Plugin, TFile } from "obsidian";

export class TkTaskCompletionFeature {
	private static readonly COMPLETED_WHEN_PROPERTY = "completed_when";
	private static readonly TASK_COMPLETED_CHECK = /^(\s*-\s\[x])/;
	private static readonly HAS_COMPLETION_METADATA = new RegExp(
		`\\[${TkTaskCompletionFeature.COMPLETED_WHEN_PROPERTY}::.*\\]`,
	);

	constructor(private plugin: Plugin) {}

	async onload() {
		// Register event: whenever a file's metadata changes (i.e., content updated)
		this.plugin.registerEvent(
			this.plugin.app.metadataCache.on("changed", (file) => {
				// Run asynchronously so multiple quick edits don't cause overlap
				this.handleFileChange(file);
			}),
		);
	}

	async handleFileChange(file: TFile) {
		if (!file.path.endsWith(".md")) return;

		// Read current content
		const content = await this.plugin.app.vault.read(file);
		const lines = content.split("\n");
		let modified = false;

		const newLines = lines.map((line) => {
			// Only handle lines that match and are missing the metadata
			if (
				TkTaskCompletionFeature.TASK_COMPLETED_CHECK.test(line) &&
				!TkTaskCompletionFeature.HAS_COMPLETION_METADATA.test(line)
			) {
				modified = true;
				const now = new Date();
				// Append inline metadata cleanly with a space separator
				return (
					line.trimEnd() +
					` [${TkTaskCompletionFeature.COMPLETED_WHEN_PROPERTY}:: ${now.toLocaleDateString()}]`
				);
			}

			return line;
		});

		if (modified) {
			// Write back the modified file contents
			await this.plugin.app.vault.modify(file, newLines.join("\n"));
		}
	}
}
