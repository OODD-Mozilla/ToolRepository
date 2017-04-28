var request = require('request');
var githubUrlRoot = "https://api.github.com";

function getOptions(url, token) {
    return  {
        url: url,
        method: 'GET',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": token
        }
    };
}

function sendRequest(url, token, callback) {
    request(getOptions(url, token), function (error, response, body) {
        if (error) {
            console.log("Error in GitHub request", error);
        } else {
            callback(response, body);
        }
    });
}

module.exports = {

    //Returns the list of repos for particular org
    getOrgRepos: function (org, token, callback) {
        var url = githubUrlRoot + '/orgs/' + org + '/repos';
        sendRequest(url, token, function(response, body){
            if(response.statusCode != 200) {
                callback(null);
                return;
            }
            callback(JSON.parse(body));
        });
    },

    //to be used to all the closed pull requests' URL from specified repo
    getCommitsUrlFromAllPulls: function (repoUrl, token, callback) {
        var url = repoUrl + '/pulls?state=closed';
        sendRequest(url, token, function(response, body){
            var obj = JSON.parse(body);
            var commitsUrlList = [];
            for (var i = 0; i < obj.length; i++) {
                commitsUrlList.push(obj[i].commits_url);
            }
            callback(commitsUrlList);
        });
    },

    //Gets authors from commit
    getAuthorsFromCommit : function(commitUrl, token, callback) {
        sendRequest(commitUrl, token, function (response, body) {
            body = JSON.parse(body);
            var authors = [];
            for (var i = 0; i < body.length; i++) {
                authors.push(body[i].commit.author.name);
            }
            callback(authors);
        });
    }

};