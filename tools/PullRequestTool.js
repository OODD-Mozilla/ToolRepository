var GitHubUtils = require('../utils/GitHubUtils');
var request = require('request');

/********** PUBLIC ***********/
function addAuthors(org, token, localReposPath) {
    return new Promise(function (resolve, reject) {
        org = 'OODD-Mozilla';
        var repo = 'TestRepo';
        var token = "token 987629258795b3f0af057329a2d5f6e866f7602f";
        GitHubUtils.getCommitsPerPull(org, repo, token, function (commitsPerPull) {
            var allPromises = [];
            commitsPerPull.forEach(function (commits) {
                console.log(commits);
                allPromises.push(getAuthors(commits, token));
            });
            Promise.all(allPromises).then(resolve).catch(reject);
        });
    });
}

module.exports = {
    run: addAuthors
};

/********** PRIVATE ***********/

function getAuthors(commit, token) {
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
                console.log(obj[i].commit.author.email);
            }
        }
    });
}

addAuthors('')