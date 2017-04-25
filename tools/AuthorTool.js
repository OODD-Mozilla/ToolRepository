var fs = require('fs');
var shell = require('shelljs');
const exec = require('child_process').exec;
var AuthorUtils = require('../utils/AuthorUtils.js');

/********** PUBLIC ***********/
// Initializes authors for all repositories in pathToRepos
// returns a promise that authors were saved successfully
function initAuthors(pathToRepos) {
	return new Promise(function(resolve, reject){
		var knownAuthors = AuthorUtils.getAuthors();
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
			AuthorUtils.saveAuthors(uniqueArray(knownAuthors));
			resolve();
		}).catch(reject);
	});
}

module.exports = {
	run: initAuthors
}

/********** PRIVATE ***********/
// Gets the authors for a local repository
// handler - callback function that is passed the authors
function getLocalAuthors(pathToRepo, handler){
	//TODO: use nodegit instead

	//https://github.com/shelljs/shelljs
	//shell.exec(git log --format=%aN).exec(sort -u) - try to see if this works?
    exec("git log --format=%aN | sort -u", {cwd: pathToRepo}, function(err, stdout, stderr){
        if (err) {
            console.error(err);
            return;
        }
        var authors = stdout.split("\n");
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
		process.exit(1);
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