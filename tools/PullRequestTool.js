var GitHubUtils = require('../utils/GitHubUtils');
var request = require('request');

/********** PUBLIC ***********/
function addAuthors(org, token) {
    return new Promise(function (resolve, reject) {
        org = 'OODD-Mozilla';
        var token = "token " + process.env.GITHUB_KEY;
        GitHubUtils.getOrgRepos(org, token, function (repos) {
            console.log("Repos count: "+ repos.length);
            repos.forEach(function (repo) {
                console.log("Repo URL: "+ repo.url);
                GitHubUtils.getCommitsPerPull(repo.url, token, function (commitsPerPull) {
                    var allPromises = [];
                    commitsPerPull.forEach(function (commits) {
                        console.log(commits);
                        allPromises.push(getAuthorsFromCommits(commits, token));
                    });
                    Promise.all(allPromises).then(resolve).catch(reject);
                });
            });
        });
    });
}
module.exports = {
    run: addAuthors
};

/********** PRIVATE ***********/

function getAuthorsFromCommits(commit, token) {
    var options = {
        url: commit,
        method: 'GET',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": token
        }
    };

    //make http call using request library
    request(options, function (error, response, body) {
        if (error) {
            console.log("Error in getting all pull requests", error);
        } else {
            var obj = JSON.parse(body);
            for (var i = 0; i < obj.length; i++) {
                //It is displaying the author's email for now
                //Need to change it later
                console.log(obj[i].commit.author.email);
            }
        }
    });
}

addAuthors('');