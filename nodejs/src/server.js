'use strict';
var express = require('express');
var app = express();
var neo4jHelper = require('./neo4jHelper.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/add', function (req, res, next) {
    var node = {
        name: 'Darth Vader #1' + parseInt(Math.random() * 10),
        sex: 'male'
    };
    neo4jHelper.insertNode(function (err, node) {
        if (err) return next(err);
        res.json(node);
    }, node)
});

/**
 * 0 - No error
 * 1 - Generic Error Code
 * 2 - Neo4J DB not up (ServiceUnavailable)
 * 3 - Less than 2 email address given
 */
app.post('/addConnection', function (req, res, next) {
    var friends = req.body.friends;
    var jsonResponse = {
        connectionMade: [],
        connectionExist: []
    };

    if (friends.length < 2) {
        jsonResponse.success = false;
        jsonResponse.message = "A connection takes two. Please provide more than two email address :)";
        jsonResponse.code = 3;
        return res.json(jsonResponse)
    }

    neo4jHelper.findRelation(function (err, records, userEmail, followerEmail, jsonResponse) {
        if (err) return next(err);
        // when connection dosen't exist
        if (records.length === 0) {
            neo4jHelper.createRelation(function (err, node) {
                if (err) {
                    if (err.code === 'ServiceUnavailable') {
                        jsonResponse.message = "Our hamsters powering the site is currently taking a break. Please try again later.";
                        jsonResponse.code = 2;
                    }
                    else {
                        jsonResponse.message = "It seems that Bill has forgotten to pay our power bill. Please try again in awhile.";
                        jsonResponse.code = 1;
                    }
                    jsonResponse.success = false;
                    return res.json(jsonResponse)
                }
                else {
                    jsonResponse.connectionMade.push([userEmail, followerEmail]);
                    jsonResponse.success = true;
                    jsonResponse.message = "Connections Created";
                    jsonResponse.code = 0;
                    return res.json(jsonResponse)
                }
            }, userEmail, followerEmail, jsonResponse)
        }
        // when connection exist
        else if (records.length > 0) {
            jsonResponse.connectionExist.push([userEmail, followerEmail]);
            jsonResponse.success = true;
            jsonResponse.message = "Connections Exist";
            jsonResponse.code = 0;
            return res.json(jsonResponse)
        }
        // handles edge case where error did not trigger of records neither 0 or more than 0 eg. -1
        else {
            return next(err);
        }
    }, friends[0], friends[1], jsonResponse)
})

app.get('/addRelation', function (req, res, next) {
    neo4jHelper.findRelation(function (err, records) {
        if (err) return next(err);
        var result = {};
        if (records.length > 0) {
            result.status = "success";
            result.message = "Relationship Exist";
            res.json(result);
        }
        else if (records.length === 0) {
            neo4jHelper.createRelation(function (err, node) {
                if (err) {
                    result.status = "unsuccessful";
                    result.message = "Relationship Not Created";
                }
                else {
                    result.status = "success";
                    result.message = "Relationship Created";
                }
                res.json(result);
            }, "youjun89@gmail.com", "youjun9@gmail.com")
        }
        // handles edge case where error did not trigger of records neither 0 or more than 0 eg. -1
        else {
            result.status = "unsuccessful";
            result.message = "Unknown Error";
            res.json(result);
        }

    }, "youjun89@gmail.com", "youjun9@gmail.com")
});

app.get('/tools/drop', function (req, res, next) {
    neo4jHelper.dropDb(function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ "success": false, "message": "Uh-oh, Something terrible has went wrong!", "error_code": -1 });
});

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.listen(8080, function () {
    console.log('started');
});

module.exports = app