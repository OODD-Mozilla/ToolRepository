var fs = require('fs');
const exec = require('child_process').exec;
var AuthorUtils = require('../utils/AuthorUtils.js');

/********** PUBLIC ***********/
function initAuthors(pathToRepos) {
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
	})
}

module.exports = {
	initAuthors: initAuthors
}

/********** PRIVATE ***********/
function getLocalAuthors(pathToRepo, handler){
	//TODO: use nodegit instead
    exec("git log --format=%aN | sort -u", {cwd: pathToRepo}, function(err, stdout, stderr){
        if (err) {
            console.error(err);
            return;
        }
        var authors = stdout.split("\n");
        handler(authors.slice(0,authors.length-1));
    });
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

/********** HELPERS ***********/
function uniqueArray(array) {
	return array.filter(function(elem, pos) {
	    return array.indexOf(elem) == pos;
	});
}