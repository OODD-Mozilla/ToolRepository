var GitHubUtils = require('../utils/GitHubUtils');
var AuthorUtils = require('../utils/AuthorUtils');
var request = require('request');
var _ = require('underscore');
var folderPath = "C:/Users/shash/WebstormProjects/OODD/ToolRepository/toolfolder";
var oldAuthors = AuthorUtils.getAuthors(folderPath);

/********** PUBLIC ***********/
function addAuthors(org, token, callback) {
    GitHubUtils.getOrgRepos(org, token, function (repos) {
            var newAuthors = [];
            //console.log("Repos count: "+ repos.length);
            repos.forEach(function (repo) {
                //console.log("Repo URL: "+ repo.url);
                GitHubUtils.getCommitsUrlFromAllPulls(repo.url, token, function (commitsUrls) {
                    commitsUrls.forEach(function (pullCommitsUrl) {
                        //console.log(pullCommitsUrl);
                        getAuthorsFromCommits(pullCommitsUrl, token, function (authors) {
                            console.log("Authors fetched: " + authors);
                            newAuthors = newAuthors.concat(authors);
                            //callback(authors);
                        });
                    });
                });
            });
            console.log("Returning: " + newAuthors);
            callback(newAuthors);
        }
    );
}


module.exports = {
    run: addAuthors
};

/********** PRIVATE ***********/
//Fetches author from specified pull requests
function getAuthorsFromCommits(pullCommitsUrl, token, callback) {
    var authors = [];
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
                authors.push(obj[i].commit.author.email);

            }
            callback(authors);
        }
    });
}

addAuthors('OODD-Mozilla', "token " + process.env.GITHUB_KEY, function (newAuthors) {
    console.log("Final New Authors: " + newAuthors);
    var uniqueNewAuthors = AuthorUtils.uniqueArray(newAuthors);
    var diff = _.difference(uniqueNewAuthors, oldAuthors);
    if (diff.length > 0) {
        console.log("New authors :" + diff)
        oldAuthors = oldAuthors.concat(uniqueNewAuthors);
    }
});