// Dependencies
var chai = require("chai");
var assert = chai.assert;
var nock = require("nock");
var slash = require('slash');
var AuthorUtils = require('../utils/AuthorUtils.js');

// Setup
var mypath = slash(__dirname);
if (process.env.GITHUB_KEY == undefined) { //Make sure token is set
	console.log("Please set GITHUB_KEY environment variable to your github token.");
	process.exit(1);
}
var token = "token " + process.env.GITHUB_KEY;
var organization = "OODD-Mozilla";
var initUntilDate = "18-MAR-2017";

// Require Tools
var CloneTool = require("../tools/CloneTool.js");
var AuthorTool = require("../tools/AuthorTool.js");
var PullRequestTool = require("../tools/PullRequestTool.js");

// Load mock data
var data = require("./mock.json");
var mockingOn = false;

describe('testToolSuite', function() {

	///////////////////////////////////////
	// MOCHA TEST SUITE FOR CloneTool.js
	///////////////////////////////////////
	describe('testCloneTool', function() {

		var folderPath = mypath + "/clonetest";


		describe('#run(org, token, folderPath)', function() {

			if (mockingOn) {
				nock("https://api.github.com")
					.get("/repos/testuser/Hello-World/issues/0")
					.reply(200, JSON.stringify(data.issueList[0]));
			}

			it('should handle invalid organization', function(done) {
				return CloneTool.run("invalid org",  token, folderPath)
					.then(function() {
						// Have to wrap in set timeout, otherwise get weird promise interference
						setTimeout(function() {
							assert.isOk(false, "The CloneTool should not have cloned from invalid organization.");
							done();
						});
					})
					.catch(function(e) {
						assert.isOk(true, "The CloneTool rejected the bad organization.");
						done();
					});
			});


			it('should handle invalid token', function(done) {
				return CloneTool.run(organization, "wrong token", folderPath)
					.then(function() {
						// Have to wrap in set timeout, otherwise get weird promise interference
						setTimeout(function() {
							assert.isOk(false, "The CloneTool should not have cloned from invalid git token.");
							done();
						});
					})
					.catch(function(e) {
						assert.isOk(true, 'CloneTool rejected since the git token cannot be null');
						done();
					});
			});

			it('should clone 2 repos for OODD-Mozilla', function(done) {
				return CloneTool.run(organization, token, folderPath)
					.then(function() {
						setTimeout(function() {
							assert.isOk(true, "The CloneTool should have run successfully.");
							done();
						});
					})
					.catch(function(e) {
						setTimeout(function() {
							assert.isOk(false, 'The CloneTool should not have failed.');
							done();
						});
					});
			});

		});

	});

	////////////////////////////////////////
	// MOCHA TEST SUITE FOR AuthorTool.js
	////////////////////////////////////////
	describe('testAuthorTool', function() {

		var folderPath = mypath + "/authortest";

		before(function(done) {
			CloneTool.run(organization, token, folderPath)
				.then(done)
				.catch(this.skip)
		});

		describe('#run(folderPath)', function() {

			it('should handle invalid path', function(done) {
				return AuthorTool.run("NonexistentPath")
					.then(function() {
						// Have to wrap in set timeout, otherwise get weird promise interference
						setTimeout(function() {
							assert.isOk(false, "The AuthorTool should not have accepted the bad path.");
							done();
						});
					})
					.catch(function(e) {
						assert.isOk(true, "The AuthorTool rejected the bad path, as expected.");
						done();
					});
			});

			//TODO: decouple from clone tool folder
			it('should find 6 authors in OODD-Mozilla organization', function(done) {
				return AuthorTool.run(folderPath)
					.then(function() {
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
	describe('testPullRequestTool', function() {

		var folderPath = mypath + "/pullRequesttest";

		before(function(done) {
			CloneTool.run(organization, token, folderPath)
				.then(function(){
					AuthorTool.run(folderPath, initUntilDate).then(done).catch(this.skip);
				})
				.catch(this.skip);
		});

		describe('#run(org, token, localReposPath)', function() {

			it('should handle invalid organization', function(done) {
				return PullRequestTool.run("invalidOrg", token)
					.then(function() {
						// Have to wrap in set timeout, otherwise get weird promise interference
						setTimeout(function() {
							assert.isOk(false, "The PullRequestTool should not have accepted the invalid organization.");
							done();
						});
					})
					.catch(function(e) {
						assert.isOk(true, "The PullRequestTool rejected the bad organization,as expected.");
						done();
					});

			});

			it('should handle invalid token', function(done) {
				return PullRequestTool.run("OODD-Mozilla", "invalidKey")
					.then(function() {
						// Have to wrap in set timeout, otherwise get weird promise interference
						setTimeout(function() {
							assert.isOk(false, "The PullRequestTool should not have accepted the invalid gitToken");
							done();
						});
					})
					.catch(function(e) {
						assert.isOk(true, "The PullRequestTool rejected the bad git token, as expected.");
						done();
					});
			});

			it('should find 1 new author from new pull request', function(done) {
				var authors = AuthorUtils.getAuthors(folderPath);
				assert.equal(authors.length, 2, "Authors file should have two authors initially.");
				return PullRequestTool.run(organization, token, folderPath)
					.then(function(newAuthors) {
						// Have to wrap in set timeout, otherwise get weird promise interference
						setTimeout(function() {
							assert.equal(newAuthors.length, 1, "The PullRequestTool should have found one new author");
							var authors = AuthorUtils.getAuthors(folderPath);
							assert.equal(authors.length, 3, "Authors file should have two authors initially.");
							done();
						});
					})
					.catch(function(e) {
						setTimeout(function() {
							assert.isOk(false, "The tool should have run successfully.");
							done();
						});
					});
			});

		});

	});

});
