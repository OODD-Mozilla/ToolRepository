
## Project Description
Part of Mozilla[dev-servp] Open Source Project with these [specifications](https://github.com/servo/servo/wiki/Report-new-contributors-project)

## Wikipedia Documentation 
Find a detailed [wikipedia](http://wiki.expertiza.ncsu.edu/index.php/M1705) page on the project 



## Tool # 1: Clone Tool
Location: `tools/CloneTool.js`

* Clones all repositories in the given organization into the specified folder
* Parameters
  * folderPath - the path to the folder that will hold the repos folder, where the repositories will be cloned
  * token - the GITHUB token, required to use the GitHub API
  * organization - the organization whose repositories will be cloned
  * Returns a promise that is resolved if all repositories are clones successfully, and is rejected otherwise


## Tool # 2: Initialization Tool
Location: `tools/InitTool.js`

* Creates / Updates a JSON file with the authors for the repositories in the given path
* Parameters
  * folderPath - the path to the folder that holds repos, the folder with the local repositories, cloned by the CloneTool.
  * untilDate - date to analyze authors until, in form DD-MMM-YYYY, e.g. 25-APR-2017
  * Returns a promise that is resolved if the authors are saved to authors.json, and is rejected otherwise


## Tool # 3: Pull Request Tool
Location: `tools/PullRequestTool.js`

* Gives a list of authors of closed pull requests that are not listed in authors.json
* Parameters
  * folderPath - the path to the folder that has the repositories and authors
  * token - the GITHUB token, required to use the GitHub API
  * organization - the organization whose repositories will be cloned
  * Returns a promise that is resolved with new authors, or rejected if something goes wrong

## Other Files
* `package.json`
Contains all the npm package dependencies that were used in the project
* `Main.js`
A class that provides an option to run all the three tools by typing `node Main.js`

## Using the Tools
All tools return a JavaScript promise, which allows for flexible use and chaining. We created a driver program, Main.js, to provide an example and a way to quickly use the tools. It runs the tools in sequence, CloneTool, InitTool, and PullRequest tool, and provides them with the necessary parameters, including folder to put the repositories and authors. To use the driver, you must change the parameters to match your needs. 

Additionally, you will need to create a GitHub token and set your GITHUB_KEY environment variable to it. Please see the Reference section for more information.

The necessary commands in Git Bash are as follows:

~~~~
export GITHUB_KEY=<your token here>
git clone https://github.com/OODD-Mozilla/ToolRepository.git
cd ToolRepository
npm install  
<change parameters in Main.js>
node Main.js
~~~~

## Testing
* `test.js` 
Contains the mocha test suites for the three tools mentioned above
**Mock testing** can be toggled on or off using the variable on Line 25
* `mock.json`
Contains mock data as json object used for testing purposes
* referemce
Just a files which has the github api calls used in the project that were used for getting the mock data

To run the test suite, execute:
~~~~
npm test
~~~~

All tests can be found in test/test.js. To turn mocking on or off, you can set the isMocking flag in test.js on line 25.

#### White-box Testing
We created 2-3 tests per tool, covering equivalence classes and exception cases. We ensured the tools properly handle bad input, including invalid organization or GitHub token.
 
#### Black-box Testing
TODO: put the test plan table images here


### References
* To generate a github api token: https://github.com/blog/1509-personal-api-tokens
* To add it as an environment variable: https://nycda.com/blog/using-environment-variables-to-safely-store-api-credentials
