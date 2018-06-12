var expect = require('chai').expect;
var neo4jHelper = require('../neo4jHelper.js');

describe('neo4jFunc', function () {
	before(function (done) {
		// run incase after case failed
		neo4jHelper.dropDb(function (err, result) {
			if (err) return err;
			done();
		});
	});

	describe('insertNode()', function () {
		it('insert a node pass', function (done) {
			var nodeTest = {
				name: "Darth Vader #125",
				sex: "male"
			};
			neo4jHelper.insertNode(function (err, node) {
				if (err) {
					return err;
				};
				expect(node).to.deep.equal(nodeTest);
				expect(node.name).to.be.equal(nodeTest.name);
				expect(node.sex).to.be.a('string');
				expect(node.name).to.be.a('string');
				done();
			}, nodeTest)
		});

		it('insert same node again', function (done) {
			var nodeTest = {
				sex: "male",
				name: "Darth Vader #125"
			};
			neo4jHelper.insertNode(function (err, node) {
				if (err) {
					expect(err.code).to.be.equal("Neo.ClientError.Schema.ConstraintValidationFailed");
					done();
				};
				done();
			}, nodeTest)
		});
	})
	
	describe('findRelation()', function () {
		var userEmail = "youjun89@gmail.com";
		var followerEmail = "youjun9@gmail.com";

		before(function (done) {
			// run incase after case failed
			neo4jHelper.createRelation(function (err, node) {
				done();
			}, userEmail, followerEmail)
		});

		it('find relation between 2 nodes exist', function (done) {
			neo4jHelper.findRelation(function (err, records) {
				if (err) {
					return err;
				};
				expect(records).to.have.length.above(0);
				done();
			}, userEmail, followerEmail)
		});
	});
});