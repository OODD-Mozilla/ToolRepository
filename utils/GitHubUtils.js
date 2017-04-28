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
    getCommitsUrlFromAllPulls: function (repoUrl, token, pullSinceDate, callback) {
        var url = repoUrl + '/pulls?state=closed&sort=closed_at&direction=desc';
        sendRequest(url, token, function(response, body){
            var obj = JSON.parse(body);
            var commitsUrlList = [];
            for (var i = 0; i < obj.length; i++) {
                var closedDate = new Date(obj[i].closed_at);
                var sinceDate = new Date(pullSinceDate);
                //console.log("Closed: " + closedDate);
                //console.log("Since: " + since);
                if (closedDate > sinceDate) {
                  //  console.log("Closed > Since");
                    commitsUrlList.push(obj[i].commits_url);
                } else {
                    //console.log("Closed <= Since")
                    break;
                }
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