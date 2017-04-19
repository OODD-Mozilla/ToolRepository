var jsonfile = require('jsonfile');
var authorsFile = 'authors.json';

function getAuthors() {
	try {
		var authorsFromFile = jsonfile.readFileSync(authorsFile);
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

function saveAuthors(authors) {
	jsonfile.writeFileSync(authorsFile, authors);
}

module.exports = {
	getAuthors: getAuthors,
	saveAuthors: saveAuthors
}