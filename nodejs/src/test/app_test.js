var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var neo4jHelper = require('../neo4jHelper.js');

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function () {
    before(function (done) {
        // run incase after case failed
        neo4jHelper.dropDb(function (err, result) {
            if (err) return err;
            done();
        });
    });

    describe('/addConnection', function () {
        var email1 = "you@gmail.com";
        var email2 = "me@gmail.com";
        it('should send a request of 1 email address', function (done) {
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ friends: [email1] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.false;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number');
                    expect(res.body.code).to.equal(3);

                    expect(res.body).to.have.property('connectionMade');
                    expect(res.body.connectionMade).to.be.a('array').to.have.lengthOf(0);
                    
                    expect(res.body).to.have.property('connectionExist');
                    expect(res.body.connectionExist).to.be.a('array').to.have.lengthOf(0);

                    done();
                }).catch(function (err) {
                    done(err);
                });
        });

        it('should send 2 email address', function (done) {
            chai.request(app)
                .post('/addConnection')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ friends: [email1, email2] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number');

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
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ friends: [email1, email2] })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');

                    expect(res.body).to.have.property('success');
                    expect(res.body.success).to.be.true;

                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.be.a('string');

                    expect(res.body).to.have.property('code');
                    expect(res.body.code).to.be.a('number');

                    expect(res.body).to.have.property('connectionMade');
                    expect(res.body.connectionMade).to.be.a('array').to.have.lengthOf(0);
                    
                    expect(res.body).to.have.property('connectionExist');
                    expect(res.body.connectionExist).to.be.a('array').to.have.lengthOf(1);
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
    });
});