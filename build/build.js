const fse = require("fs-extra");
const path = require("path");

function getBuildFiles() {
	try {
		let targets = fse.readdirSync(path.join(__dirname, "../src"), {recursive: true});
		targets = targets.filter((e) => e.indexOf(".") !== -1);
		
		return targets;
	}
	catch(err) {abort(err);}
}
function prepOutFolder() {
	fse.emptyDirSync(outDir); //will create dir if doesn't exist or empty it
}
function compileFile(file) {
	const data = fse.readFileSync(file, "utf8");
	
	let extension = path.extname(file);
	let base = path.basename(file);
	let filename = base.substring(0, base.lastIndexOf(extension)).concat(".enc").concat(extension);
	let sub = path.dirname(file).replace(path.join(__dirname, "../src"), "");
	
	let newPath = path.join(outDir, sub);
	
	fse.mkdirSync(newPath, {recursive: true});
	fse.writeFileSync(path.join(newPath, filename), btoa(data));
	
	return path.join(newPath, filename);
}
function insertLoader() {
	try {
		fse.accessSync(path.join(__dirname, "loader.html"), fse.constants.F_OK);
		fse.copyFileSync(path.join(__dirname, "loader.html"), path.join(outDir, "/index.html"));
	}
	catch(err) {abort("Missing loader.html");}
}
function insertResources() {
	try {
		fse.copySync(path.join(__dirname, "../res"), path.join(__dirname, "../out"));
	}
	catch(err) {}
}

function abort(err) {
	console.log(err);
	process.exit(1);
}

const outDir = path.join(__dirname, "../out");
const targets = getBuildFiles();

prepOutFolder();

console.log("Building...");
for(let i = 0; i < targets.length; i++) {
	let file = path.join(__dirname, "../src", targets[i]);
	
	let out = compileFile(file);
	
	console.log(`Built '${file}' -> '${out}'`);
}

console.log("\nInserting loader...");
insertLoader();

console.log("Inserting resources...");
insertResources();

console.log("Done");
