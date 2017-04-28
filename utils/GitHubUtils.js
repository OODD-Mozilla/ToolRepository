var request = require('request');
var githubUrlRoot = "https://api.github.com";

module.exports = {

    //Returns the list of repos for particular org
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
                if(response.statusCode != 200) {
                    callback(null);
                    return;
                }
                callback(JSON.parse(body));
            }
        });
    },

    //to be used to all the closed pull requests' URL from specified repo
    getCommitsUrlFromAllPulls: function (repoUrl, token, callback) {
        //to be used while making http call
        var options = {
            url: repoUrl + '/pulls?state=closed',
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
                var commitsUrlList = [];
                for (var i = 0; i < obj.length; i++) {
                    commitsUrlList.push(obj[i].commits_url);
                }
                callback(commitsUrlList);
            }
        });
    }
};