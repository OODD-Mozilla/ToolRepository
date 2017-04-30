var request = require('request');
var githubUrlRoot = "https://api.github.com";

//helper function of sendRequest.
//Sets options like url and token which is used
//during request.
function getOptions(url, token) {
    return {
        url: url,
        method: 'GET',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": token
        }
    };
}

//helper function to send request
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
        sendRequest(url, token, function (response, body) {
            if (response.statusCode != 200) {
                callback(null);
                return;
            }
            callback(JSON.parse(body));
        });
    },

    //gets all the closed pull requests' URL from specified organization since the specified date
    getPullsUrlForOrg: function (org, token, pullSinceDate, callback) {
        var url = githubUrlRoot + '/orgs/' + org + '/issues?filter=all&state=closed&sort=closed_at&since=' + pullSinceDate;
        sendRequest(url, token, function (response, body) {
            var obj = JSON.parse(body);
            var pullsUrlList = [];
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].pull_request != null) {
                    pullsUrlList.push(obj[i].pull_request.url);
                }
            }
            callback(pullsUrlList);
        });
    },

    //Gets authors from all the commits of given pull
    getAuthorsFromPull: function (pullUrl, token, callback) {
        sendRequest(pullUrl + "/commits", token, function (response, body) {
            var obj = JSON.parse(body);
            var authors = [];
            for (var i = 0; i < obj.length; i++) {
                authors.push(obj[i].commit.author.name);
            }
            callback(authors);
        });
    }
};