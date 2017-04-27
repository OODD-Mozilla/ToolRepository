// Dependencies
var chai = require("chai");
var assert = chai.assert;
var nock = require("nock");
var slash = require('slash');
var AuthorUtils = require('../utils/AuthorUtils.js');

// Setup
var mypath = slash(__dirname);
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
var mockingOn = false;

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
		
		var folderPath = mypath + "/authortest";

		before(function (done) {
			CloneTool.run(organization, token, folderPath)
			.then(done)
			.catch(this.skip)
		});

		describe('#run(folderPath)', function(){

			it('should handle invalid path', function(done) {
				return AuthorTool.run("NonexistentPath")
				.then(function(){
					// Have to wrap in set timeout, otherwise get weird promise interference
					setTimeout(function() {
						assert.isOk(false, "The AuthorTool should not have accepted the bad path.");
						done();
					});
				})
				.catch(function(e){
					assert.isOk(true, "The AuthorTool rejected the bad path, as expected.");
					done();
				});
			});

			//TODO: decouple from clone tool folder
			it('should find 6 authors in OODD-Mozilla organization', function(done) {
				return AuthorTool.run(folderPath)
				.then(function(){
					var authors = AuthorUtils.getAuthors(folderPath);
					assert.equal(authors.length, 6, "Authors file has expected number of authors");
					done();
				})
				.catch(function(e) {
					// Have to wrap in set timeout, otherwise get weird promise interference
					setTimeout(function() {
						assert.isOk(false, "The valid path should not be rejected.");
						done();
					});
				});
			});

		});

	});

	////////////////////////////////////////////
	// MOCHA TEST SUITE FOR PullRequestTool.js
	////////////////////////////////////////////
	describe('testPullRequestTool', function(){

		var folderPath = mypath + "/pullRequesttest";

		before(function (done) {
			CloneTool.run(organization, token, folderPath)
			.then(done)
			.catch(this.skip)
		});
		


		describe('#run(org, token, localReposPath)', function(){

			it('should handle invalid organization', function(done) {
				return PullRequestTool.run("invalidOrg", process.env.GITHUB_KEY)
				.then(function()){
					// Have to wrap in set timeout, otherwise get weird promise interference
					setTimeout(function() {
						assert.isOk(false, "The PullRequestTool should not have accepted the invalid organization.");
						done();
					});
				})
				.catch(function(e){
					assert.isOk(true, "The PullRequestTool rejected the bad organization,as expected.");
					done();
				});

			});

			it('should handle invalid token', function(done) {
				return PullRequestTool.run("OODD-Mozilla", "invalidKey")
				.then(function()){
					// Have to wrap in set timeout, otherwise get weird promise interference
					setTimeout(function() {
						assert.isOk(false, "The PullRequestTool should not have accepted the invalid gitToken");
						done();
					});
				})
				.catch(function(e){
					assert.isOk(true, "The PullRequestTool rejected the bad git token, as expected.");
					done();
				});
			});

			it('should find 1 new author from new pull request', function(done) {

			});

		});

	});

});
