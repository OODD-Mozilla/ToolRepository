var jsonfile = require('jsonfile');
var authorsFile = '/authors.json';

function getAuthors(folderPath) {
	try {
		var authorsFromFile = jsonfile.readFileSync(folderPath + authorsFile);
		return authorsFromFile;	
	} catch(e) {
		if(e.code == "ENOENT") {
			return []; //File doesn't exist yet
		} else {
			console.log("Unable to read authors: " + e);
			process.exit(1);
		}
	}
}

function saveAuthors(folderPath, authors) {
	jsonfile.writeFileSync(folderPath + authorsFile, authors);
}

module.exports = {
	getAuthors: getAuthors,
	saveAuthors: saveAuthors
}