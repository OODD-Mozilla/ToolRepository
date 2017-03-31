var request = require('request');
var nodeGit = require('nodegit');
var slash = require('slash');
var path = require('path');
var fs = require('fs');
const execSync = require('child_process').execSync;

var mypath = slash(__dirname);
mypath += "/tmp"

/** fill your credentials in for now **/
var token = "token " + "";
var userId = "Nikhila-B"; // github user

var urlRoot = "https://api.github.com";
var organization = "OODD-Mozilla";
var urls = [];
var folderName =[];


function getOrgRepos(org, callback) {

    //to be used while making http call
    var options = {

		url: urlRoot + '/orgs/' + org + '/repos',
		method: 'GET',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		}
	};

    //make http call using request library
    request(options, function(error, response, body) {
		if (error) {
			console.log("Error in getting all repos ", error);
		} else {

			fillUrlArray(body);
			callback(urls);
		}
	});

}

//adds url of all the repos found in given organization to an array
function fillUrlArray(body) {
	var obj = JSON.parse(body);
	for (var i = 0; i < obj.length; i++) {
		var name = obj[i].name;
		var clone_url = obj[i].clone_url;
		urls.push(clone_url);
		folderName.push(name);

	}
}


//clones repo to local directory
function tryingToClone(i){
	nodeGit.Clone(urls[i], mypath + "/" + folderName[i], {}).then(function(repo){
	 console.log("cloned " + path.basename(urls[i]) + " to " + repo.workdir());
 }).catch(function(err){
	 	console.log(err);
	 });
}

//checks if repo already exists locally
function fsExistsSync(myDir) {
  try {
    fs.accessSync(myDir);
    return true;
  } catch (e) {
    return false;
  }
}

//clone repos using url array
getOrgRepos(organization, function(urls) {
	if(fsExistsSync(mypath)) {
		execSync("rm -r ./tmp");
	}
	for(var i = 0; i < urls.length ; i++){
			tryingToClone(i);

	}
});