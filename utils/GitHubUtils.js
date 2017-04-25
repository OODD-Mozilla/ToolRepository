var request = require('request');
var githubUrlRoot = "https://api.github.com";
var nock = require("nock");

module.exports = {

	getOrgRepos: function(org, token, callback) {
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
		request(options, function(error, response, body) {
			if (error) {
				console.log("Error in getting all repos ", error);
			} else {
				callback(JSON.parse(body));
			}
		});
	}, 

	//to be used to get closed pull requests from specified repo
	getOrgPullRequests: function(org, repo, token, callback){
        //to be used while making http call
        var options = {
            url: githubUrlRoot + '/repos/' + org + '/' + repo + '/pulls?state=closed',
            method: 'GET',
            headers: {
                "User-Agent": "EnableIssues",
                "content-type": "application/json",
                "Authorization": token
            }
        };

        //make http call using request library
        request(options, function(error, response, body) {
            if (error) {
                console.log("Error in getting all pull requests", error);
            } else {
                callback(JSON.parse(body));
            }
        });	}
}