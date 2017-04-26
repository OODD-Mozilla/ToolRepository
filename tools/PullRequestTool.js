var GitHubUtils = require('../utils/GitHubUtils');
var request = require('request');

/********** PUBLIC ***********/
function addAuthors(org, token) {
    return new Promise(function (resolve, reject) {
        GitHubUtils.getOrgRepos(org, token, function (repos) {
            //console.log("Repos count: "+ repos.length);
            repos.forEach(function (repo) {
                //console.log("Repo URL: "+ repo.url);
                GitHubUtils.getCommitsUrlFromAllPulls(repo.url, token, function (commitsUrls) {
                    var allPromises = [];
                    commitsUrls.forEach(function (pullCommitsUrl) {
                        //console.log(pullCommitsUrl);
                        allPromises.push(getAuthorsFromCommits(pullCommitsUrl, token));
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
//Fetches author from specified pull requests
function getAuthorsFromCommits(pullCommitsUrl, token) {
    var options = {
        url: pullCommitsUrl,
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

addAuthors('OODD-Mozilla', "token " + process.env.GITHUB_KEY);