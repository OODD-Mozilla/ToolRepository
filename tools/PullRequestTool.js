var GitHubUtils = require('../utils/GitHubUtils');
var AuthorUtils = require('../utils/AuthorUtils');
var request = require('request');
var _ = require('underscore');
//var folderPath = "C:/Users/shash/WebstormProjects/OODD/ToolRepository/toolfolder";


/********** PUBLIC ***********/
function addAuthors(org, token, folderPath, pullSinceDate) {
    //Get authors from local JSON file for comparison
    var oldAuthors = AuthorUtils.getAuthors(folderPath);
    var newAuthors = [];

    return new Promise(function (resolveDone, rejectDone) {
        //Commit Promises
        var commitPromises = [];
        GitHubUtils.getPullsUrlForOrg(org, token, pullSinceDate, function (pullsUrls) {
            if(!pullsUrls) {
                rejectDone();
                return;
            }
            pullsUrls.forEach(function (pullUrl) {
                var commitPromise = new Promise(function (resolveCommit, rejectCommit) {
                    GitHubUtils.getAuthorsFromPull(pullUrl, token, function (authors) {
                        newAuthors = newAuthors.concat(authors);
                        resolveCommit();
                    });
                });
                commitPromises.push(commitPromise);
            });
            // When all commits have been analyzed, resolve done promise with new authors
            Promise.all(commitPromises).then(function () {
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