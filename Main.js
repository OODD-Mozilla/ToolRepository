/************************ Dependencies ************************
 * GITHUB_KEY environment variable is set to github token
 **************************************************************/
// Imports
var slash = require('slash');

// Load Tools
var CloneTool = require("./tools/CloneTool.js");
var InitTool = require("./tools/InitTool.js");
var PullRequestTool = require("./tools/PullRequestTool.js");

// Setup
var mypath = slash(__dirname);
var folderPath = mypath + "/toolfolder";
if(process.env.GITHUB_KEY == undefined) { //Make sure token is set
	console.log("Please set GITHUB_KEY environment variable to your github token.");
	process.exit(1);
}
var token = "token " + process.env.GITHUB_KEY;
var organization = "OODD-Mozilla";
var initUntilDate = "19-MAR-2017";
var pullSinceDate = "25-APR-2017"

// Run the tools
/***** Clone Tool ******/
var clonePromise = CloneTool.run(organization, token, folderPath);
clonePromise.then(function() {
	console.log("Repositories cloned successfully.");

	/***** Initialization Tool ******/
	var initPromise = InitTool.run(folderPath, initUntilDate);
	initPromise.then(function(initialAuthors) {
		console.log("Local authors initialized successfully.");

		console.log("Initial authors: " + initialAuthors);
		/***** Pull Request Tool ******/
		var pullRequestPromise = PullRequestTool.run(organization, token, folderPath, pullSinceDate);
		pullRequestPromise.then(function(newAuthors){
			console.log("New authors: " + newAuthors);
		});
		
	});
});

