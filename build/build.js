const fse = require("fs-extra");
const path = require("path");

const outDir = path.join(__dirname, "../out");
const targets = getBuildFiles();

prepOutFolder();

console.log("Building...");
for(let i = 0; i < targets.length; i++) {
	let file = path.join(__dirname, "../src", targets[i]);
	const err = compileFile(file);
	
	if(err) console.log(`Failed to build ${file}`);
	else console.log(`Built '${file}'`);
}

console.log("\nInserting loader...");
insertLoader();

console.log("\nDone");

function getBuildFiles() {
	try {
		const data = fse.readFileSync(path.join(__dirname, "buildTargets.txt"), "utf8");
		if(data.replace(/\s/gi, "") === "") { //remove all whitespace
			abort("No build targets");
		}
		
		let lines = data.split("\n");
		
		let targets = [];
		for(let i = 0; i < lines.length; i++) {
			let line = lines[i].trim();
			
			if(line === "") continue;
			else targets.push(line);
		}
		
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
}
function insertLoader() {
	fse.copyFileSync(path.join(__dirname, "loader.html"), path.join(outDir, "/index.html"));
}

function abort(err) {
	console.log(err);
	process.exit(1);
}
