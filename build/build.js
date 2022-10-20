const fs = require("fs");

var files = getBuildFiles();

console.log("Building Files:");
files.forEach((file) => console.log(file));

for(let i = 0; i < files.length; i++) {
	let file = files[i];
	
	
}

function getBuildFiles() {
	try {
		const data = fs.readFileSync("./build/buildTargets.txt", "utf8");
		
		let targets = [];
		let line = "";
		for(var i = 0; i < data.length; i++) {
			var c = data.charAt(i);
			
			if(c == "\n") {
				targets.push(line);
				line =  "";
			}
			else line += c;
		}
		targets.push(line);
		
		return targets;
	}
	catch(err) {abort(err);}
}
function abort(err) {
	console.log(err);
	process.exit(1);
}
function setCursorPos(line, column) {
	console.log(`\033[<${line}>;<${column}>H`);
}