var expect = require('chai').expect;
var neo4jHelper = require('../neo4jHelper.js');

describe('neo4jFunc Test', function () {
	before(function (done) {
		// run incase after case failed
		neo4jHelper.dropDb(function (err, result) {
			if (err) { done(err); }
			else { done(); };
		});
	});

	var userEmail = "youjun89@gmail.com";
	var followerEmail = "youjun9@gmail.com";
	var extraEmail = "me@gmail.com";
	var extraEmail2 = "us@gmail.com";

	describe('findRelation()', function () {
		before(function (done) {
			// run incase after case failed
			neo4jHelper.createConnection(function (err, node) {
				if (err) { done(err); }
				else { done(); };
			}, userEmail, followerEmail)
		});

		it('find relation between 2 nodes exist', function (done) {
			neo4jHelper.findRelation(function (err, records) {
				if (err) { done(err); }
				else {
					expect(records).to.have.length.above(0);
					done();
				};

			}, userEmail, followerEmail)
		});
	});

	describe('findUnblockConnectionByList()', function () {
		before(function (done) {
			// run incase after case failed
			neo4jHelper.createConnection(function (err, node) {
				if (err) { done(err); }
				else {
					neo4jHelper.createConnection(function (err, node) {
						if (err) { done(err); }
						else { done(); };
					}, userEmail, extraEmail)
				};
			}, userEmail, extraEmail)
		});

		it('find list of email that has not block user email', function (done) {
			neo4jHelper.findUnblockConnectionByList(function (err, records,jsonResponse) {
				if (err) { done(err); }
				else { 
					expect(records).to.be.a('array').to.have.lengthOf(2);
					done(); 
				};
			}, userEmail, [followerEmail,extraEmail,extraEmail,extraEmail2])
		});
	});

	describe('findConnectOrSubscriptioneNodes()', function () {
		it('find list of email that is connected or subscribe to userEmail', function (done) {
			neo4jHelper.findConnectOrSubscriptioneNodes(function (err, records,jsonResponse) {
				if (err) { done(err); }
				else { 
					// records.map(record => { // Iterate through records
					// 	console.log(record.get("email"))
					// });
					expect(records).to.be.a('array').to.have.lengthOf(2);
					done(); 
				};
			}, userEmail, [followerEmail,extraEmail,extraEmail2])
		});
	});
});