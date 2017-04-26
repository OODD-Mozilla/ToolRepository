var request = require('request');
var githubUrlRoot = "https://api.github.com";

module.exports = {

    getOrgRepos: function (org, token, callback) {
        //to be used while making http call
        var options = {
            url: githubUrlRoot + '/orgs/' + org + '/repos',
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
                console.log("Error in getting all repos ", error);
            } else {
                callback(JSON.parse(body));
            }
        });
    },

    //to be used to get closed pull requests from specified repo
    getCommitsPerPull: function (repo_url, token, callback) {
        //to be used while making http call
        var options = {
            url: repo_url + '/pulls?state=closed',
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
                console.log("Error in getting all pull requests ", error);
            } else {
                var obj = JSON.parse(body);
                var commitsPerPush = [];
                for (var i = 0; i < obj.length; i++) {
                    commitsPerPush.push(obj[i].commits_url);
                }
                callback(commitsPerPush);
            }
        });
    }
}