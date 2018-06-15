'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // loading of swagger docs
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res, next) {
    res.redirect('/api-docs');
});

app.use('/api', require('./api.js'));

app.use(function (req, res, next) {
    res.redirect('/api-docs');
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ "success": false, "message": "Uh-oh, Something terrible has went wrong!", "code": -1 });
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