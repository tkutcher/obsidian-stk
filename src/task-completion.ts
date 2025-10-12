import { Plugin, TFile } from "obsidian";

export class TkTaskCompletionFeature {
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
			// Match completed Markdown tasks that do NOT already have a [completed_when:: ...] tag
			// The negative lookahead avoids re-triggering on already-tagged lines
			const completedTaskPattern =
				/^(\s*-\s\[x\]\s.*?)(?:(?:\s\[completed_when::.*\])|$)/;

			// Only handle lines that match and are missing the metadata
			if (
				line.match(/^(\s*-\s\[x\])/) &&
				!/\[completed_when::.*\]/.test(line)
			) {
				modified = true;
				const today = new Date().toISOString().slice(0, 10);
				// Append inline metadata cleanly with a space separator
				return line.trimEnd() + ` [completed_when:: ${today}]`;
			}

			return line;
		});

		if (modified) {
			// Write back the modified file contents
			await this.plugin.app.vault.modify(file, newLines.join("\n"));
		}
	}
}
