var express = require('express');
var router = express.Router();
var neo4jHelper = require('./neo4jHelper.js');

router.post('/addConnection', function (req, res, next) {
    var jsonResponse = {
        connectionMade: [],
        connectionExist: []
    };

    if (typeof req.body.friends === 'undefined') {
        res.status(400);
        jsonResponse.message = "Please provide an email address";
        jsonResponse.success = false;
        jsonResponse.code = 4;
        return res.send(jsonResponse);
    }

    var friends = req.body.friends;
    if (friends.length < 2) {
        res.status(400);
        jsonResponse.success = false;
        jsonResponse.message = "A connection takes two. Please provide 2 email addresses :)";
        jsonResponse.code = 3;
        return res.json(jsonResponse)
    }

    neo4jHelper.findRelation(function (err, records, userEmail, followerEmail, jsonResponse) {
        if (err) return dbConnectionError(err, res);
        // when connection dosen't exist
        if (records.length === 0) {
            neo4jHelper.findBlockConnection(function (err, records, userEmail, followerEmail, jsonResponse) {
                if (err) return dbConnectionError(err, res);
                // connects are ok to be added
                if (records.length === 0) {
                    neo4jHelper.createConnection(function (err, node) {
                        if (err) return dbConnectionError(err, res);
                        jsonResponse.connectionMade.push([userEmail, followerEmail]);
                        jsonResponse.success = true;
                        jsonResponse.message = "Connections Created";
                        jsonResponse.code = 0;
                        return res.json(jsonResponse)
                    }, userEmail, followerEmail, jsonResponse)
                }
                else {
                    jsonResponse.success = false;
                    jsonResponse.message = "Connects cannot be added for block contacts";
                    jsonResponse.code = 5;
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
    }, friends[0], friends[1], jsonResponse)
})

router.post('/getFriendList', function (req, res, next) {
    if (typeof req.body.email === 'undefined' || req.body.email === '') {
        res.status(400);
        var jsonResponse = {};
        jsonResponse.message = "Please provide an email address";
        jsonResponse.success = false;
        jsonResponse.code = 4;
        return res.send(jsonResponse);
    }

    var email = req.body.email;
    neo4jHelper.findFollowNode(function (err, records) {
        if (err) return dbConnectionError(err, res);
        var jsonResponse = {
            friends: [],
            count: 0
        };
        if (records.length > 0) {
            jsonResponse.count = records.length;

            var friends = [];
            records.map(record => { // Iterate through records
                friends.push(record.get("email"));
                // console.log( record._fields ); // Access the name property from the RETURN statement
            });
            jsonResponse.friends = friends;
            jsonResponse.message = "Here are all your friends";
            jsonResponse.code = 0;
        }
        else {
            jsonResponse.message = "It seems like you have no friends :(";
            jsonResponse.code = 0;
        }

        jsonResponse.success = true;
        return res.send(jsonResponse);
    }, email)
})

router.post('/getCommonFriendList', function (req, res, next) {
    if (typeof req.body.friends === 'undefined') {
        res.status(400);
        var jsonResponse = {};
        jsonResponse.message = "Please provide an email address.";
        jsonResponse.success = false;
        jsonResponse.code = 4;
        return res.send(jsonResponse);
    }
    else if (req.body.friends.length < 2) {
        res.status(400);
        var jsonResponse = {};
        jsonResponse.message = "Need one more emaill address to find common friends.";
        jsonResponse.success = false;
        jsonResponse.code = 3;
        return res.send(jsonResponse);
    }

    var friends = req.body.friends;
    neo4jHelper.findCommonNode(function (err, records) {
        if (err) return dbConnectionError(err, res);
        var jsonResponse = {
            friends: [],
            count: 0
        };
        if (records.length > 0) {
            jsonResponse.count = records.length;

            var friends = [];
            records.map(record => { // Iterate through records
                friends.push(record.get("email"));
            });
            jsonResponse.friends = friends;
            jsonResponse.message = "Here are all your common friends";
            jsonResponse.code = 0;
        }
        else {
            jsonResponse.message = "It seems like you have no common friends :(";
            jsonResponse.code = 0;
        }

        jsonResponse.success = true;
        return res.send(jsonResponse);
    }, friends[0], friends[1])
})

router.post('/addSubscription', function (req, res, next) {
    var jsonResponse = {
        subscriptionMade: [],
        subscriptionExist: []
    };

    if (typeof req.body.requestor === 'undefined' || req.body.requestor === '' ||
        typeof req.body.target === 'undefined' || typeof req.body.target === '') {
        res.status(400);
        jsonResponse.message = "Target/Requestor field is missing or empty.";
        jsonResponse.success = false;
        jsonResponse.code = 4;
        return res.send(jsonResponse);
    }

    var requestor = req.body.requestor;
    var target = req.body.target;

    neo4jHelper.findSubscription(function (err, records, requestor, target, jsonResponse) {
        if (err) return dbConnectionError(err, res);
        // when connection dosen't exist
        if (records.length === 0) {
            neo4jHelper.createSubscription(function (err, node) {
                if (err) return dbConnectionError(err, res);
                jsonResponse.subscriptionMade.push([requestor, target]);
                jsonResponse.success = true;
                jsonResponse.message = "Subscription Created";
                jsonResponse.code = 0;
                return res.json(jsonResponse)
            }, requestor, target, jsonResponse)
        }
        // when connection exist
        else if (records.length > 0) {
            jsonResponse.subscriptionExist.push([requestor, target]);
            jsonResponse.success = true;
            jsonResponse.message = "Subscription Exist";
            jsonResponse.code = 0;
            return res.json(jsonResponse)
        }
    }, requestor, target, jsonResponse)
})

router.post('/blockConnection', function (req, res, next) {
    var jsonResponse = {
        blocksMade: [],
        blocksExist: []
    };

    if (typeof req.body.requestor === 'undefined' || req.body.requestor === '' ||
        typeof req.body.target === 'undefined' || typeof req.body.target === '') {
        res.status(400);
        jsonResponse.message = "Target/Requestor field is missing or empty.";
        jsonResponse.success = false;
        jsonResponse.code = 4;
        return res.send(jsonResponse);
    }

    var requestor = req.body.requestor;
    var target = req.body.target;

    neo4jHelper.findBlockConnection(function (err, records, requestor, target, jsonResponse) {
        if (err) return dbConnectionError(err, res);
        // when connection dosen't exist
        if (records.length === 0) {
            neo4jHelper.createBlockConnection(function (err, node) {
                if (err) return dbConnectionError(err, res);
                jsonResponse.blocksMade.push([requestor, target]);
                jsonResponse.success = true;
                jsonResponse.message = "Successfully block user";
                jsonResponse.code = 0;
                return res.json(jsonResponse)
            }, requestor, target, jsonResponse)
        }
        // when connection exist
        else if (records.length > 0) {
            jsonResponse.blocksExist.push([requestor, target]);
            jsonResponse.success = true;
            jsonResponse.message = "User has already been blocked";
            jsonResponse.code = 0;
            return res.json(jsonResponse)
        }
    }, requestor, target, jsonResponse)
})

router.post('/getUpdateEmailList', function (req, res, next) {
    var jsonResponse = {
        recipients: [],
        success: false
    };

    if (typeof req.body.sender === 'undefined' || req.body.sender === '' ||
        typeof req.body.text === 'undefined') {
        res.status(400);
        jsonResponse.message = "Sender/Text field is missing or empty.";
        jsonResponse.code = 4;
        return res.send(jsonResponse);
    }

    var sender = req.body.sender;
    var text = req.body.text;

    var textList = text.split(" ");

    var mentionList = [];
    textList.forEach(function (text) {
        if (validateEmail(text)) mentionList.push(text);
    });

    neo4jHelper.findConnectOrSubscriptioneNodes(function (err, records, jsonResponse) {
        if (err) return dbConnectionError(err, res);
        records.map(record => { // Iterate through records
            mentionList.push(record.get("email"))
        });
        neo4jHelper.findUnblockConnectionByList(function (err, records, jsonResponse) {
            if (err) return dbConnectionError(err, res);
            records.map(record => { // Iterate through records
                jsonResponse.recipients.push(record.get("email"))
            });
            jsonResponse.success = true;
            jsonResponse.message = "Updates Email List Created";
            jsonResponse.code = 0;
            return res.json(jsonResponse)
        }, sender, mentionList, jsonResponse)
    }, sender, jsonResponse)
})

router.get('/tools/drop', function (req, res, next) {
    neo4jHelper.dropDb(function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
});

function dbConnectionError(err, res) {
    res.status(400);
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

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = router;