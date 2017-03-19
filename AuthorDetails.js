var request = require('request');
var parse = require('parse-link-header');

var token = "token " + "";
var userId = "sshankjha";

var urlRoot = "https://api.github.com";

getAuthors(userId);

function getAuthors(userName)
{

    var options = {
        url: urlRoot + '/repos/OODD-Mozilla/ToolRepository/commits',
        method: 'GET',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": token
        }
    };

    // Send a http request to url and specify a callback that will be called upon its return.
    request(options, function (error, response, body)
    {
        var obj = JSON.parse(body);

        for( var i = 0; i < obj.length; i++ )
        {
            var name = obj[i].commit.author;
            console.log( name );
        }
    });

}