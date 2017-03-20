# ToolRepository

  
## Tool # 1: JSON author file 
* [Issue #3](../../issues/3)
* create a tool that initializes a JSON file with the known authors for a local git repository
* `AuthorDetails.js`


## Tool # 2: Clone repositories Tool 
* [Issue #4](../../issues/4)
* create a tool that clones every git repository in a given github organization (use the github API to retrieve this information)
* `package.json` has the dependencies needed to run both the tools.
* `gitApi.js` - clones the all the repos in the given organization inside `./tmp` folder
  * On line # 12 - define the GITAPI token as environment variable `GITHUB_KEY` **check references below for token**
  * On line # 13 - define the username of the git account user
  * On line # 18 - define the organization of interest from where repos need to be cloned
![Lines to be edited in gitApi.js](/images/capture.png)

~~~~
git clone https://github.com/OODD-Mozilla/ToolRepository.git
cd ToolRepository
npm install  
~~~~
### References
* To generate a github api token: https://github.com/blog/1509-personal-api-tokens
* To add it as an environment variable: https://nycda.com/blog/using-environment-variables-to-safely-store-api-credentials
Fix lines 12, 13, 18 as mentioned above before trying to run it.
~~~~
node gitApi.js
~~~~

