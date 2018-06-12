'use strict';
var express = require('express');
var app = express();
var neo4jHelper = require('./neo4jHelper.js');

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

app.get('/addRelation', function (req, res, next) {
    neo4jHelper.findRelation(function (err, records) {
        if (err) return next(err);
        var result = {};
        if(records.length > 0)
        {
            result.status = "success";
            result.message = "Relationship Exist";
            res.json(result);
        }
        else if(records.length === 0){
            neo4jHelper.createRelation(function (err, node) {
                if (err)
                {
                    result.status = "unsuccessful";
                    result.message = "Relationship Not Created";
                }
                else{
                    result.status = "success";
                    result.message = "Relationship Created";
                }
                res.json(result);
            }, "youjun89@gmail.com","youjun9@gmail.com")
        }
        // handles edge case where error did not trigger of records neither 0 or more than 0 eg. -1
        else{
            result.status = "unsuccessful";
            result.message = "Unknown Error";
            res.json(result);
        }
        
    }, "youjun89@gmail.com","youjun9@gmail.com")
});

app.get('/tools/drop', function (req, res, next) {
    neo4jHelper.dropDb(function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

app.listen(8080, function () {
    console.log('started');
});