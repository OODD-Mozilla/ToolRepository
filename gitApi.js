var request = require('request');
var nodeGit = require('nodegit');
var slash = require('slash');
var path = require('path');
var fs = require('fs');
const execSync = require('child_process').execSync;

var mypath = slash(__dirname);
mypath += "/tmp"

/** fill your credentials in for now **/
var token = "token " + process.env.GITHUB_KEY;
var userId = ""; // github user


// NCSU Enterprise endpoint: https://github.ncsu.edu/api/v3
var urlRoot = "https://api.github.com";
var organization = "OODD-Mozilla"; // name of the desired organization
var urls = [];
var folderName =[];


function getOrgRepos(org, callback) {

	var options = {

		url: urlRoot + '/orgs/' + org + '/repos',
		method: 'GET',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		}
	};

	request(options, function(error, response, body) {
		if (error) {
			console.log("Error in getting all repos ", error);
		} else {

			fillUrlArray(body);
			callback(urls);
		}
	});

}


function fillUrlArray(body) {
	var obj = JSON.parse(body);
	for (var i = 0; i < obj.length; i++) {
		var name = obj[i].name;
		var clone_url = obj[i].clone_url;
		urls.push(clone_url);
		folderName.push(name);

	}
}


function tryingToClone(i){
	nodeGit.Clone(urls[i], mypath + "/" + folderName[i], {}).then(function(repo){
	 console.log("cloned " + path.basename(urls[i]) + " to " + repo.workdir());
 }).catch(function(err){
	 	console.log(err);
	 });
}

function fsExistsSync(myDir) {
  try {
    fs.accessSync(myDir);
    return true;
  } catch (e) {
    return false;
  }
}

getOrgRepos(organization, function(urls) {
	if(fsExistsSync(mypath)) {
		execSync("rm -r ./tmp");
	}
	for(var i = 0; i < urls.length ; i++){
			tryingToClone(i);

	}
});