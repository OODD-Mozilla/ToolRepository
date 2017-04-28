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
var folderPath = mypath + "/toolfolder";
if(process.env.GITHUB_KEY == undefined) { //Make sure token is set
	console.log("Please set GITHUB_KEY environment variable to your github token.");
	process.exit(1);
}
var token = "token " + process.env.GITHUB_KEY;
var organization = "OODD-Mozilla";
var initUntilDate = "18-MAR-2017";

// Run the tools
/***** Clone Tool ******/
var clonePromise = CloneTool.run(organization, token, folderPath);
clonePromise.then(function() {
	console.log("Repositories cloned successfully.");

	/***** Author Tool ******/
	var authorPromise = AuthorTool.run(folderPath, initUntilDate);
	authorPromise.then(function(initialAuthors) {
		console.log("Local authors initialized successfully.");
		console.log("Initial authors: " + initialAuthors);
		/***** Pull Request Tool ******/
		PullRequestTool.run(organization, token, folderPath, function(authors){
			console.log("New authors: " + authors);
		});
		
	});
});

