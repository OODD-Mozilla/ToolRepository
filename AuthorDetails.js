var request = require('request');
var parse = require('parse-link-header');
var jsonfile = require('jsonfile');
var file = 'data.json';
var Set = require('Set');

var token = "token " + "";
var userId = "sshankjha";

var urlRoot = "https://api.github.com";

getAuthors(userId);

//fetches author from specified repo
function getAuthors(userName) {

    //to be used while making http call
    var options = {
        url: urlRoot + '/repos/OODD-Mozilla/ToolRepository/commits',
        method: 'GET',
        headers: {
            "User-Agent": "EnableIssues",
            "content-type": "application/json",
            "Authorization": token
        }
    };

    //make http call using request library
    request(options, function (error, response, body) {
        var obj = JSON.parse(body);
        var mySet = new Set();
        for (var i = 0; i < obj.length; i++) {
            var email = obj[i].commit.author.email;
            mySet.add(email);
        }

        console.log("NORMAL:\n", mySet);
        console.log("\n\nTOSTRING: \n", mySet.toString());

        jsonfile.writeFileSync(file, mySet, {spaces: 2});

        //code for manual testing
        /*var objRead = jsonfile.readFileSync(file);
        console.log("\n\nREAD:\n", objRead);
        var setRead = new Set(objRead.set);
        console.log("\nChecks: ");
        console.log(setRead.has('shashankjha.np@gmail.com'));
        console.log(setRead.contains('nikhi.bala12@gmail.com'));
        console.log(setRead.has('harshal@gmail.com'));*/

    });

}