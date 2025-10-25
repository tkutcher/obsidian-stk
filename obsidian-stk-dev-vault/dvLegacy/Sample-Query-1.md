
```dataviewjs
window.tk.dvLegacy.renderTasks(dv, {
	rootPage: "",
	match: (task, page) => task.completed_when?.equals(dv.luxon.DateTime.fromISO("2025-10-25")),  
	omitInDisplay: [],
})
```
