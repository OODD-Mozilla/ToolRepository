var fs = require('fs');
const exec = require('child_process').exec;
var pathToRepos = "tmp";
var jsonfile = require('jsonfile');
var authorsFile = 'authors.json';

function addAuthors() {
	var knownAuthors = loadAuthors();
	var allPromises = [];
	getRepoPaths(pathToRepos).forEach(function(path){
		var p = new Promise(function(resolve, reject){
			getLocalAuthors(path, function(authors) {
				knownAuthors = knownAuthors.concat(authors);
				resolve();
			});
		});
		allPromises.push(p);
	});
	Promise.all(allPromises).then(function(){
		writeAuthors(uniqueArray(knownAuthors));
	})
}

function getRepoPaths(pathToRepos) {
	try {
		var repoPaths = [];
		var repos = fs.readdirSync(pathToRepos);
		for (var i=0; i<repos.length; i++) {
	        repoPaths.push(pathToRepos + "/" + repos[i]);
	    }
		return repoPaths;
	} catch(e) {
		console.log("Unable to read repositories: " + e);
		process.exit(1);
	}	
}

function loadAuthors() {
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

function writeAuthors(authors) {
	jsonfile.writeFileSync(authorsFile, authors);
}

function getLocalAuthors(pathToRepo, handler){
    exec("git log --format=%aN | sort -u", {cwd: pathToRepo}, function(err, stdout, stderr){
        if (err) {
            console.error(err);
            return;
        }
        var authors = stdout.split("\n");
        handler(authors.slice(0,authors.length-1));
    });
}

function uniqueArray(array) {
	return array.filter(function(elem, pos) {
	    return array.indexOf(elem) == pos;
	});
}

addAuthors(); 