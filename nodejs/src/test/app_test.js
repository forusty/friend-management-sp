var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var neo4jHelper = require('../neo4jHelper.js');

require("./neo4j_test.js");

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function () {
    var email1 = "you@gmail.com";
    var email2 = "me@gmail.com";
    var email3 = "us@gmail.com";
    var email4 = "one@gmail.com";
    before(function (done) {
        // run incase after case failed
        neo4jHelper.dropDb(function (err, result) {
            if (err) return err;
            done();
        });
    });

    describe('/addConnection', function () {
        after(function (done) {
            // runs after all tests in this block
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/json')
                .send({ friends: [email1, email3] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send 2 email address', function (done) {
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/json')
                .send({ friends: [email1, email2] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('connectionMade');
                    expect(res.body.connectionMade).to.be.a('array').to.have.lengthOf(1);

                    expect(res.body).to.have.property('connectionExist');
                    expect(res.body.connectionExist).to.be.a('array').to.have.lengthOf(0);
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send the same 2 email address', function (done) {
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/json')
                .send({ friends: [email1, email2] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('connectionMade');
                    expect(res.body.connectionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('connectionExist');
                    expect(res.body.connectionExist).to.be.a('array').to.have.lengthOf(1);
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request with no friends key', function (done) {
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/json')
                .send()
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    expect(res.body).to.have.property('connectionMade');
                    expect(res.body.connectionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('connectionExist');
                    expect(res.body.connectionExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
        
        it('should send a request of 0 email address', function (done) {
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/json')
                .send({ friends: [] })
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(3);

                    expect(res.body).to.have.property('connectionMade');
                    expect(res.body.connectionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('connectionExist');
                    expect(res.body.connectionExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request of 1 email address', function (done) {
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/json')
                .send({ friends: [email1] })
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(3);

                    expect(res.body).to.have.property('connectionMade');
                    expect(res.body.connectionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('connectionExist');
                    expect(res.body.connectionExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
    });

    describe('/blockConnection', function () {
        it('should send requestor and target', function (done) {
            chai.request(app)
                .post('/blockConnection')
                .set('content-type', 'application/json')
                .send({ requestor: email2, target: email3 })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('blocksMade');
                    expect(res.body.blocksMade).to.be.a('array').to.have.lengthOf(1);

                    expect(res.body).to.have.property('blocksExist');
                    expect(res.body.blocksExist).to.be.a('array').to.have.lengthOf(0);
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send the same requestor and target', function (done) {
            chai.request(app)
                .post('/blockConnection')
                .set('content-type', 'application/json')
                .send({ requestor: email2, target: email3 })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('blocksMade');
                    expect(res.body.blocksMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('blocksExist');
                    expect(res.body.blocksExist).to.be.a('array').to.have.lengthOf(1);
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should create a connection between 2 blocked contacts', function (done) {
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/json')
                .send({ friends: [email2, email3] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(5);

                    expect(res.body).to.have.property('connectionMade');
                    expect(res.body.connectionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('connectionExist');
                    expect(res.body.connectionExist).to.be.a('array').to.have.lengthOf(0);
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request with no requestor or target key', function (done) {
            chai.request(app)
                .post('/blockConnection')
                .set('content-type', 'application/json')
                .send()
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    expect(res.body).to.have.property('blocksMade');
                    expect(res.body.blocksMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('blocksExist');
                    expect(res.body.blocksExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
        
        it('should send a request with only requestor', function (done) {
            chai.request(app)
                .post('/blockConnection')
                .set('content-type', 'application/json')
                .send({ requestor: email3 })
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    expect(res.body).to.have.property('blocksMade');
                    expect(res.body.blocksMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('blocksExist');
                    expect(res.body.blocksExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
        
        it('should send a request with only target', function (done) {
            chai.request(app)
                .post('/blockConnection')
                .set('content-type', 'application/json')
                .send({ target: email4 })
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    expect(res.body).to.have.property('blocksMade');
                    expect(res.body.blocksMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('blocksExist');
                    expect(res.body.blocksExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
    });

    describe('/getFriendList', function () {
        it('should send a request of valid email address', function (done) {
            chai.request(app)
                .post('/getFriendList')
                .set('content-type', 'application/json')
                .send({ email: email1 })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('friends');
                    expect(res.body.friends).to.be.a('array').to.have.lengthOf(2);

                    expect(res.body).to.have.property('count');
                    expect(res.body.count).to.be.a('number').to.equal(2);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request of invalid email address', function (done) {
            chai.request(app)
                .post('/getFriendList')
                .set('content-type', 'application/json')
                .send({ email: email1 + "-invalid" })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('friends');
                    expect(res.body.friends).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('count');
                    expect(res.body.count).to.be.a('number').to.be.equal(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request with no email field', function (done) {
            chai.request(app)
                .post('/getFriendList')
                .set('content-type', 'application/json')
                .send()
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request with empty email value', function (done) {
            chai.request(app)
                .post('/getFriendList')
                .set('content-type', 'application/json')
                .send({email:''})
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
    });

    describe('/getCommonFriendList', function () {
        before(function (done) {
            // create another connection before testing
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/json')
                .send({ friends: [email2, email4] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;
                    chai.request(app)
                        .post('/addConnection')
                        .set('content-type', 'application/json')
                        .send({ friends: [email3, email4] })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('object');

                            expect(res.body).to.have.property('success');
                            expect(res.body.success).to.be.true;
                            done();
                        }).catch(function (err) {
                            done(err);
                        });
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request of 2 valid email address', function (done) {
            chai.request(app)
                .post('/getCommonFriendList')
                .set('content-type', 'application/json')
                .send({ friends: [email2,email3] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('friends');
                    expect(res.body.friends).to.be.a('array').to.have.lengthOf(2);

                    expect(res.body).to.have.property('count');
                    expect(res.body.count).to.be.a('number').to.equal(2);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request of 2 invalid email address', function (done) {
            chai.request(app)
                .post('/getCommonFriendList')
                .set('content-type', 'application/json')
                .send({ friends: [email1,email3] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('friends');
                    expect(res.body.friends).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('count');
                    expect(res.body.count).to.be.a('number').to.equal(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request with no email address', function (done) {
            chai.request(app)
                .post('/getCommonFriendList')
                .set('content-type', 'application/json')
                .send()
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request with 1 email address', function (done) {
            chai.request(app)
                .post('/getCommonFriendList')
                .set('content-type', 'application/json')
                .send({friends:[email1]})
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(3);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
    });

    describe('/addSubscription', function () {
        // after(function (done) {
        //     // runs after all tests in this block
        //     chai.request(app)
        //         .post('/addConnection')
        //         .set('content-type', 'application/json')
        //         .send({ friends: [email1, email3] })
        //         .then(function (res) {
        //             expect(res).to.have.status(200);
        //             expect(res.body).to.be.a('object');

        //             expect(res.body).to.have.property('success');
        //             expect(res.body.success).to.be.true;
        //             done();
        //         }).catch(function (err) {
        //             done(err);
        //         });
        // });

        it('should send requestor and target', function (done) {
            chai.request(app)
                .post('/addSubscription')
                .set('content-type', 'application/json')
                .send({ requestor: email1, target: email2 })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('subscriptionMade');
                    expect(res.body.subscriptionMade).to.be.a('array').to.have.lengthOf(1);

                    expect(res.body).to.have.property('subscriptionExist');
                    expect(res.body.subscriptionExist).to.be.a('array').to.have.lengthOf(0);
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send the same requestor and target', function (done) {
            chai.request(app)
                .post('/addSubscription')
                .set('content-type', 'application/json')
                .send({ requestor: email1, target: email2 })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(0);

                    expect(res.body).to.have.property('subscriptionMade');
                    expect(res.body.subscriptionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('subscriptionExist');
                    expect(res.body.subscriptionExist).to.be.a('array').to.have.lengthOf(1);
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send a request with no requestor or target key', function (done) {
            chai.request(app)
                .post('/addSubscription')
                .set('content-type', 'application/json')
                .send()
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    expect(res.body).to.have.property('subscriptionMade');
                    expect(res.body.subscriptionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('subscriptionExist');
                    expect(res.body.subscriptionExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
        
        it('should send a request with only requestor', function (done) {
            chai.request(app)
                .post('/addSubscription')
                .set('content-type', 'application/json')
                .send({ requestor: email1 })
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    expect(res.body).to.have.property('subscriptionMade');
                    expect(res.body.subscriptionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('subscriptionExist');
                    expect(res.body.subscriptionExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
        
        it('should send a request with only target', function (done) {
            chai.request(app)
                .post('/addSubscription')
                .set('content-type', 'application/json')
                .send({ target: email1 })
                .then(function (res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number').to.equal(4);

                    expect(res.body).to.have.property('subscriptionMade');
                    expect(res.body.subscriptionMade).to.be.a('array').to.have.lengthOf(0);

                    expect(res.body).to.have.property('subscriptionExist');
                    expect(res.body.subscriptionExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
    });
});