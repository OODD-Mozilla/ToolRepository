var GitHubUtils = require('../utils/GitHubUtils');
var AuthorUtils = require('../utils/AuthorUtils');
var request = require('request');
var _ = require('underscore');
//var folderPath = "C:/Users/shash/WebstormProjects/OODD/ToolRepository/toolfolder";


/********** PUBLIC ***********/
function addAuthors(org, token, folderPath, pullSinceDate, callback) {
    var oldAuthors = AuthorUtils.getAuthors(folderPath);
    var newAuthors = [];

    return new Promise(function(resolveDone, rejectDone) {
        GitHubUtils.getOrgRepos(org, token, function (repos) {

            if(!repos){
                rejectDone("Error getting repos for organization.");
                return;
            }

            // Repo Promises
            var repoPromises = [];
            repos.forEach(function (repo) {
                var repoPromise = new Promise(function(resolveRepo, rejectRepo) {
                    GitHubUtils.getCommitsUrlFromAllPulls(repo.url, token, pullSinceDate, function (commitsUrls) {

                        // Commit Promises
                        var commitPromises = [];
                        commitsUrls.forEach(function (pullCommitsUrl) {
                            var commitPromise = new Promise(function(resolveCommit, rejectCommit) {
                                GitHubUtils.getAuthorsFromCommit(pullCommitsUrl, token, function (authors) {
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
            // When all repos have been analyzed, resolve done promise with new authors
            Promise.all(repoPromises).then(function(){
                var uniqueNewAuthors = AuthorUtils.uniqueArray(newAuthors);
                var diff = _.difference(uniqueNewAuthors, oldAuthors);
                var allAuthors = oldAuthors.concat(diff);
                AuthorUtils.saveAuthors(folderPath, allAuthors);
                resolveDone(diff);
            }).catch(rejectDone);

        });
        
    });
}

module.exports = {
    run: addAuthors
};