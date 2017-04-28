var fs = require('fs');
const exec = require('child_process').exec;
var AuthorUtils = require('../utils/AuthorUtils.js');

/********** PUBLIC ***********/
// Initializes authors for all repositories in pathToRepos
// folder path: path to repos/ and where authors will be saved
// untilDate: date you want commits until, in form DD-MMM-YYYY, e.g. 25-APR-2017
// returns a promise that authors were saved successfully
function initAuthors(folderPath, untilDate) {
	return new Promise(function(resolve, reject){
		var pathToRepos = folderPath + "/repos";
		var knownAuthors = AuthorUtils.getAuthors(folderPath);
		var allPromises = [];
		var repoPaths = getRepoPaths(pathToRepos);
		if(repoPaths == null) {
			reject("Invalid repo path.");
		}
			
		repoPaths.forEach(function(path){
			var p = new Promise(function(resolve, reject){
				getLocalAuthors(path, untilDate, function(authors) {
					knownAuthors = knownAuthors.concat(authors);
					resolve();
				});
			});
			allPromises.push(p);
		});
		Promise.all(allPromises).then(function(){
			knownAuthors = uniqueArray(knownAuthors);
			AuthorUtils.saveAuthors(folderPath, knownAuthors);
			resolve(knownAuthors);
		}).catch(reject);
	});
}

module.exports = {
	run: initAuthors
}

/********** PRIVATE ***********/
// Gets the authors for a local repository
// handler - callback function that is passed the authors
function getLocalAuthors(pathToRepo, untilDate, handler){
	//https://github.com/shelljs/shelljs
	/*var authors = shell.cd(pathToRepo).exec("git log --format=%aN");
	authors = uniqueArray(authors).slice(0, authors.length-1);*/
    exec("git log --format=%aN --until='"+untilDate+"'" , {cwd: pathToRepo}, function(err, stdout, stderr){
        if (err) {
            console.error(err);
            return;
        }
        var authors = uniqueArray(stdout.split("\n"));
        handler(authors.slice(0,authors.length-1));
    });
}

// Gets all repository paths in pathToRepos directory
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
		return null;
	}	
}

/********** HELPERS ***********/
// Removes duplicates from an array
// Returns array without duplicates
function uniqueArray(array) {
	return array.filter(function(elem, pos) {
	    return array.indexOf(elem) == pos;
	});
}