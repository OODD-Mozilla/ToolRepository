/************************ Dependencies ************************
 * GITHUB_KEY environment variable is set to github token
 **************************************************************/
// Imports
var slash = require('slash');

// Load Tools
var CloneTool = require("./tools/CloneTool.js");
var AuthorTool = require("./tools/AuthorTool.js");
var PullRequestTool = require("./tools/PullRequestTool.js");

// Setup
var mypath = slash(__dirname);
var localReposPath = mypath + "/repos";
if(process.env.GITHUB_KEY == undefined) { //Make sure token is set
	console.log("Please set GITHUB_KEY environment variable to your github token.");
	process.exit(1);
}
var token = "token " + process.env.GITHUB_KEY;
var organization = "OODD-Mozilla";

// Run the tools
/***** Clone Tool ******/
var clonePromise = CloneTool.run(organization, token, localReposPath);
clonePromise.then(function() {
	console.log("Repositories cloned successfully.");

	/***** Author Tool ******/
	var authorPromise = AuthorTool.run(localReposPath);
	authorPromise.then(function() {
		console.log("Local authors initialized successfully.");

		/***** Pull Request Tool ******/
		var pullRequestPromise = PullRequestTool.run(localReposPath);
		pullRequestPromise.then(function() {
			console.log("Pull request authors added successfully.");
		});
	});
});

