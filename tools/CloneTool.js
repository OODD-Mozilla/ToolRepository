var nodegit = require('nodegit');
var fs = require('fs-extra');
const execSync = require('child_process').execSync;
var GitHubUtils = require("../utils/GitHubUtils");

/********** PUBLIC ***********/
// Clones the repos in org to localReposPath
// Returns a promise that all repositories have been cloned successfully
function cloneRepos(org, token, folderPath) {
	cleanRepoFolder(folderPath);
	var localReposPath = folderPath + "/repos";
	return new Promise(function(resolve, reject){
		GitHubUtils.getOrgRepos(org, token, function(repos) {
			var allPromises = [];
			repos.forEach(function(repo){
				allPromises.push(cloneRepo(localReposPath, repo.name, repo.clone_url));
			});
			Promise.all(allPromises).then(resolve).catch(reject);
		});
	});
}

module.exports = {
	run: cloneRepos
}

/********** PRIVATE ***********/
// Helper method that clones a repo given the path, name, and clone url
// Returns a promise that the repo was cloned successfully
function cloneRepo(reposPath, name, url) {
	return new Promise(function(resolve, reject){
		nodegit.Clone(url, reposPath + "/" + name, {}).then(function(repo) {
			resolve("Successfully cloned " + name + ".");
		}).catch(function(err) {
			reject("Error cloning " + name + ".");
		});
	});
}

// Removes the repository folder, if it exists
function cleanRepoFolder(localReposPath) {
	try {
		fs.accessSync(localReposPath);
		try {
			//execSync("rm -r '" + localReposPath + "'");
			fs.removeSync(localReposPath) // check if path needs singlequotes
		} catch (e) {
			console.log("Problem removing repo folder. " + e);
		}
	} catch (e) {} // Folder doesn't exist
}


