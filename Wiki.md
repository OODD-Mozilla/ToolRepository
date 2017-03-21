
# CSC/ECE 517 Fall 2017/OSS M1705
## M1705 - Automatically report new contributors to all git repositories

### Introduction
 [1](https://en.wikipedia.org/wiki/Servo_(layout_engine))Servo is a browser layout engine developed by [Mozilla](http        yuyus://en.wikipedia.org/wiki/Mozilla). It is at it's early stage but can easily supply i.e. cntribute to Wikipedia and [Github](https://en.wikipedia.org/wiki/GitHub) successfully passes the [Acid2](https://en.wikipedia.org/wiki/Acid2) test. it aims to create parallel environment with different components which can be handled by small separate tasks.

### Scope
The scope of the project was to complete the initial steps mentioned [here](https://github.com/servo/servo/wiki/Report-new-contributors-project)  
The steps are as follows: 
 - create a github organization with several repositories that can be used for manual tests
 - create a tool that initializes a JSON file with the known authors for a local git repository
 - create a tool that clones every git repository in a given github organization (use the github API to retrieve this information)

### Project Description
The project requirement states the initail state to be able to track information across all repositories in the servo organization. The goal of this work is to build a system that uses the Github API to determine this information on a regular basis.We have did this in the following ways :  
#### Tool ### 1: JSON author file
* create a tool that initializes a JSON file with the known authors for a local git repository
* First, it fetches the author name from all the commits in a repository
* Then, adds it to set. Here we use set to avoid the duplication of authors if he/she have done more than 1 commits.
* Saves the set in a Json file.

#### Tool ### 2: Clone repositories Tool 
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

### Testing

### Design Patterns
Design patterns are not applicable as our task involved is just implementing a way to get all the contributors in a git repository. However, the [Project Description](https://github.com/OODD-Mozilla/ToolRepository/blob/master/Wiki.md#project-description) section below provides details of the steps as the way it was implemented.
### Conclusion
After understanding the GitHub API and the way Json object can be used to access and post the data of the new contributors in repository we have observed it can be automated and the steps to understand it are as shown in the article.
### References
 1.[https://en.wikipedia.org/wiki/Servo_(layout_engine)](https://en.wikipedia.org/wiki/Servo_(layout_engine))  
 2.[https://github.com/servo/servo/wiki/Report-new-contributors-project](https://github.com/servo/servo/wiki/Report-new-contributors-project)
