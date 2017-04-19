var request = require('request');
var githubUrlRoot = "https://api.github.com";

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

	//TODO
	getOrgPullRequests: function(org, token, callback){
		return null;
	}
}