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
console.log(token);
var userId = "kbrey"; // github user

var urlRoot = "https://api.github.com";
var organization = "OODD-Mozilla"; // name of the desired organization
var urls = [];
var folderName = [];

var repoNums;


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
function tryingToClone(i) {
	nodeGit.Clone(urls[i], mypath + "/" + folderName[i], {}).then(function(repo) {
		//console.log("\nCloned " + path.basename(urls[i]) + " to " + repo.workdir());
	}).catch(function(err) {
		//console.log(err);
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

//clone repos using url array - Call the function here




/**
* Adding test case 1 - correct arguments
* clone all 6 repos in the organization
* returns true to indicate success 
*/
function testClone(callback) {
	getOrgRepos(organization, function(urls) {

		if (fsExistsSync(mypath)) {
			execSync("rm -r ./tmp");
		}

		for (var i = 0; i < urls.length; i++) {
			tryingToClone(i);

		}
		callback();
	});

}

function SuccessMessage() {
	console.log("Test Case 1:\nSuccessfully cloned " + urls.length + " repos");
	return true;
}

/**
* Adding test case 2 - incorrect argument  [ wrong organization name]
* clone all 6 repos in the organization
* returns false to indicate failure
*/
function testWrongOrg(callback) {
	var fakeOrgName = 'DNE';
	getOrgRepos( fakeOrgName, function(urls) {

		if (fsExistsSync(mypath)) {
			execSync("rm -r ./tmp");
		}

		for (var i = 0; i < urls.length; i++) {
			tryingToClone(i);

		}
		callback(fakeOrgName);
	});

}

function FailMessage(content) {
	console.log("Test Case 2:\nSorry no repos were cloned from " + content + " organization");
	return false;
}


function testCase1(){
	testClone(SuccessMessage);
}
function testCase2() {
	testWrongOrg(FailMessage);
}


testCase1();
testCase2();
//When using MOCHA & CHAI
//module.exports.testCase1 = testCase1;
//module.exports.testCase2 = testCase2;
