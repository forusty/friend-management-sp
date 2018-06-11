'use strict';
var express = require('express');
var app = express();
var neo4jHelper = require('./neo4jHelper.js');

app.get('/add', function (req, res, next) {
    var node = {
        name: 'Darth Vader #1' + parseInt(Math.random() * 100),
        sex: 'male'
    };
    neo4jHelper.insertNode(function (err, node) {
        if (err) return next(err);
        res.json(node);
    }, node)
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