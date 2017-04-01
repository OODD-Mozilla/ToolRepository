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

### RUN TEST CASES ####


For testing gitApi.js - first fix the lines below before executing the command


*Fix lines 12, 13, 18 as mentioned above before trying to run it.*
~~~~
node gitApi.js
~~~~


| Test ID      | Description                                                                                                                                                                                                                                                               | Expected                                                      | Actual                                                        | Pass/Fail |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|---------------------------------------------------------------|-----------|
| testClone    | (1) The getRepos method with the OODD-Mozilla as the organization name (2) The call to this method with that argument leads to 6 repos to be cloned (3) The repos are created in /tmp folder (4) run node gitApi.js command  Currently - testCase1() method in gitApi.js  | << on console>> Test Case 1: Successfully clone 6 repos       | << on console>> Test Case 1: Successfully clone 6 repos       | pass      |
| testWrongOrg | (1) The getRepos method with the DNE as the organization name (2) The call to this method with cause a response with error from GITHUB API (3) run node gitApi.js command  Currently - testCase2() method in gitApi.js                                                    | Test Case 2: Sorry no repos were cloned from DNE organization | Test Case 2: Sorry no repos were cloned from DNE organization | pass      |
|              |                                                                                                                                                                                                                                                                           |                                                               |                                                               |           |

