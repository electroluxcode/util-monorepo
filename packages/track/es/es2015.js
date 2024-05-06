const registry = new FinalizationRegistry(() => {
	console.log(`Array gets garbage collected at ${counter}`);
	arrayCollected = true;
});
