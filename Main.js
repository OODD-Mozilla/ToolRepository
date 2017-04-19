/****** Dependencies ******
 * GITHUB_KEY environment variable is set to github token
 **************************/

var slash = require('slash');

// Load Tools
var CloneTool = require("./tools/CloneTool.js");
var AuthorTool = require("./tools/AuthorTool.js");
var PullRequestTool = require("./tools/PullRequestTool.js");

// Setup
var mypath = slash(__dirname);
var localReposPath = mypath + "/repos";
var token = "token " + process.env.GITHUB_KEY;
var organization = "OODD-Mozilla";

/***** Clone Tool ******/
//TODO: return promise so author tool can use
//CloneTool.cloneRepos(organization, token, localReposPath);

/***** Author Tool ******/
AuthorTool.initAuthors(localReposPath);

/***** Pull Request Tool ******/