var chai = require("chai");
var assert = chai.assert;
var nock = require("nock");
var slash = require('slash')
// Setup
var mypath = slash(__dirname);
var localReposPath = mypath + "/repos";
if(process.env.GITHUB_KEY == undefined) { //Make sure token is set
	console.log("Please set GITHUB_KEY environment variable to your github token.");
	process.exit(1);
}
var token = "token " + process.env.GITHUB_KEY;
var organization = "OODD-Mozilla";

// Require Tools
var CloneTool = require("../tools/CloneTool.js");
var AuthorTool = require("../tools/AuthorTool.js");
var PullRequestTool = require("../tools/PullRequestTool.js");

// Load mock data
var data = require("./mock.json");
var mockingOn = true;

describe('testToolSuite', function(){

	///////////////////////////////////////
	// MOCHA TEST SUITE FOR CloneTool.js
	///////////////////////////////////////
	describe('testCloneTool', function(){

		describe('#run(org, token, localReposPath)', function(){

			if(mockingOn) {
				nock("https://api.github.com")
				.get("/repos/testuser/Hello-World/issues/0")
				.reply(200, JSON.stringify(data.issueList[0]) );
			}
			
			it('should handle invalid organization', function(done) {
				assert.isNull(localReposPath,'Not an organization');
				assert.isUndefined(localReposPath,'Invalid Oorganization');
			});

			it('should handle invalid token', function(done) {
                assert.isNull(token,'Token cannot be null');
                assert.notEqual(token,process.env.GITHUB_KEY,'Invalid Token');
			});

			it('should clone 2 repos for OODD-Mozilla', function(done) {
                //assert.
			});

		});

	});

	////////////////////////////////////////
	// MOCHA TEST SUITE FOR AuthorTool.js
	////////////////////////////////////////
	describe('testAuthorTool', function(){

		describe('#run(pathToRepos)', function(){

			if(mockingOn) {
				nock("https://api.github.com")
				.get("/repos/testuser/Hello-World/issues/0")
				.reply(200, JSON.stringify(data.issueList[0]) );
			}

			it('should handle invalid path', function(done) {

			});

			it('should add 9 authors', function(done) {

			});

		});

	});

	////////////////////////////////////////////
	// MOCHA TEST SUITE FOR PullRequestTool.js
	////////////////////////////////////////////
	describe('testPullRequestTool', function(){

		describe('#run(org, token, localReposPath)', function(){

			if(mockingOn) {
				nock("https://api.github.com")
				.get("/repos/testuser/Hello-World/issues/0")
				.reply(200, JSON.stringify(data.issueList[0]) );
			}

			it('should handle invalid organization', function(done) {

			});

			it('should handle invalid token', function(done) {

			});

			it('should find 1 new author from new pull request', function(done) {

			});

		});

	});

});