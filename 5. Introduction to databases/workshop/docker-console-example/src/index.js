const name = process.argv[2];
if (name) {
	console.log(`Hello, ${name}`);
} else {
	console.error('Name not specified');
	process.exit(1);
}
