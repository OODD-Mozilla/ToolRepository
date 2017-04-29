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
var sinceDate = "24-APR-2017"

// Require Tools
var CloneTool = require("../tools/CloneTool.js");
var InitTool = require("../tools/InitTool.js");
var PullRequestTool = require("../tools/PullRequestTool.js");

// Load mock data
var data = require("./mock.json");
var mockingOn = true;

describe('testToolSuite', function() {

	///////////////////////////////////////
	// MOCHA TEST SUITE FOR CloneTool.js
	///////////////////////////////////////
	describe('testCloneTool', function() {

		if (mockingOn) {
			var invalidOrg = nock("https://api.github.com").persist()
				.get("/orgs/invalidOrg/repos")
				.reply(404, JSON.stringify(data.invalidRequest));

			var validRepo = nock("https://api.github.com").persist()
				.get("/orgs/OODD-Mozilla/repos")
				.reply(200, JSON.stringify(data.getRepos));


			var getFromIssues = nock("https://api.github.com").persist()
				.get("/orgs/OODD-Mozilla/issues?filter=all&state=closed&sort=closed_at&since=24-APR-2017")
				.reply(200, JSON.stringify(data.getPullRequests_ToolRepository));

			var getIssuesInvalidOrg = nock("https://api.github.com").persist()
				.get("/orgs/invalidOrg/issues?filter=all&state=closed&sort=closed_at&since=24-APR-2017")
				.reply(200, JSON.stringify(data.invalidRequest));


		}

		var folderPath = mypath + "/clonetest";
		describe('#run(org, token, folderPath)', function() {

			it('should handle invalid organization', function(done) {

				return CloneTool.run("invalidOrg", token, folderPath)
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
	// MOCHA TEST SUITE FOR InitTool.js
	////////////////////////////////////////
	describe('testInitTool', function() {

		var folderPath = mypath + "/authortest";

		before(function(done) {
			CloneTool.run(organization, token, folderPath)
				.then(done)
				.catch(this.skip)
		});

		describe('#run(folderPath)', function() {

			it('should handle invalid path', function(done) {
				return InitTool.run("NonexistentPath", initUntilDate)
					.then(function() {
						// Have to wrap in set timeout, otherwise get weird promise interference
						setTimeout(function() {
							assert.isOk(false, "The InitTool should not have accepted the bad path.");
							done();
						});
					})
					.catch(function(e) {
						assert.isOk(true, "The InitTool rejected the bad path, as expected.");
						done();
					});
			});

			//TODO: decouple from clone tool folder
			it('should find 2 authors in OODD-Mozilla organization', function(done) {
				return InitTool.run(folderPath, initUntilDate)
					.then(function() {
						var authors = AuthorUtils.getAuthors(folderPath);
						assert.equal(authors.length, 2, "Authors file has expected number of authors");
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
				.then(function() {
					InitTool.run(folderPath, initUntilDate)
						.then(function() {
							setTimeout(function() {
								assert.isOk(true, "The InitTool terminated properly.");
								done();
							});
						})
						.catch(function(e) {
							setTimeout(function() {
								assert.isOk(false, "Authors not initialized.");
								done();
								this.skip();
							});
						});
				})
				.catch(this.skip);
		});

		describe('#run(org, token, localReposPath)', function() {

			it('should handle invalid organization', function(done) {
				return PullRequestTool.run("invalidOrg", token, folderPath, sinceDate)
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
				return PullRequestTool.run("OODD-Mozilla", "invalidKey", folderPath, sinceDate)
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
				return PullRequestTool.run(organization, token, folderPath, sinceDate)
					.then(function(newAuthors) {
						// Have to wrap in set timeout, otherwise get weird promise interference
						setTimeout(function() {
							assert.equal(newAuthors.length, 1, "The PullRequestTool should have found one new author");
							var authors = AuthorUtils.getAuthors(folderPath);
							assert.equal(authors.length, 3, "Authors file should have another author.");
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