var GitHubUtils = require('../utils/GitHubUtils');
var AuthorUtils = require('../utils/AuthorUtils');
var request = require('request');
var _ = require('underscore');
//var folderPath = "C:/Users/shash/WebstormProjects/OODD/ToolRepository/toolfolder";


/********** PUBLIC ***********/
function addAuthors(org, token, folderPath, callback) {
    var oldAuthors = AuthorUtils.getAuthors(folderPath);
    GitHubUtils.getOrgRepos(org, token, function (repos) {
        var newAuthors = [];
        var donePromise = new Promise(function(resolveDone, rejectDone) {

            // Repo Promises
            var repoPromises = [];
            repos.forEach(function (repo) {
                var repoPromise = new Promise(function(resolveRepo, rejectRepo) {
                    GitHubUtils.getCommitsUrlFromAllPulls(repo.url, token, function (commitsUrls) {

                        // Commit Promises
                        var commitPromises = [];
                        commitsUrls.forEach(function (pullCommitsUrl) {
                            var commitPromise = new Promise(function(resolveCommit, rejectCommit) {
                                getAuthorsFromCommits(pullCommitsUrl, token, function (authors) {
                                    //console.log("Authors fetched: " + authors);
                                    newAuthors = newAuthors.concat(authors);
                                    resolveCommit();
                                });
                            });
                            commitPromises.push(commitPromise); 
                        });
                        Promise.all(commitPromises).then(resolveRepo).catch(rejectRepo);

                    });
                });
                repoPromises.push(repoPromise);
            });
            Promise.all(repoPromises).then(resolveDone).catch(rejectDone);

        });
        donePromise.then(function(){
            var uniqueNewAuthors = AuthorUtils.uniqueArray(newAuthors);
            var diff = _.difference(uniqueNewAuthors, oldAuthors);
            callback(diff);
        });
    });
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
                authors.push(obj[i].commit.author.name);
            }
            callback(authors);
        }
    });
}

// addAuthors('OODD-Mozilla', "token " + process.env.GITHUB_KEY, function (newAuthors) {
//     console.log("Final New Authors: " + newAuthors);
//     var uniqueNewAuthors = AuthorUtils.uniqueArray(newAuthors);
//     var diff = _.difference(uniqueNewAuthors, oldAuthors);
//     if (diff.length > 0) {
//         console.log("New authors :" + diff)
//         oldAuthors = oldAuthors.concat(uniqueNewAuthors);
//     }
// });