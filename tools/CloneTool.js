var nodegit = require('nodegit');
var fs = require('fs');
const execSync = require('child_process').execSync;
var GitUtils = require("../utils/GitUtils");

/********** PUBLIC ***********/
function cloneRepos(org, token, localReposPath) {
	cleanRepoFolder();
	GitUtils.getOrgRepos(org, token, function(repos) {
		repos.forEach(function(repo){
			cloneRepo(localReposPath, repo.name, repo.clone_url);
		});
	});
}
module.exports = {
	cloneRepos:cloneRepos
}

/********** PRIVATE ***********/
//clones repo to local directory
function cloneRepo(reposPath, name, url) {
	nodegit.Clone(url, reposPath + "/" + name, {}).then(function(repo) {
		//console.log("\nCloned " + path.basename(urls[i]) + " to " + repo.workdir());
	}).catch(function(err) {
		//console.log(err);
	});
}

//checks if repo already exists locally
function cleanRepoFolder(myDir) {
	try {
		fs.accessSync(myDir);
		execSync("rm -r ./tmp");
		return true;
	} catch (e) {
		return false;
	}
}


