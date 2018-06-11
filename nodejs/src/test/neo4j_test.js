var expect = require('chai').expect;
var neo4jHelper = require('../neo4jHelper.js');

describe('insertNode()', function () {
	it('insert a node pass', function (done) {
		var nodeTest = {
			sex: "male",
			name: "Darth Vader #125"
		};
		neo4jHelper.insertNode(function (err, node) {
			if (err) {
				console.log(err);
			};
			expect(node.sex).to.be.equal(nodeTest.sex);
			expect(node.name).to.be.equal(nodeTest.name);
			expect(node._id).to.be.a('integer');

			done();
		}, nodeTest)
	});

	// it('insert a node fail', function (done) {
	// 	var nodeTest = {
	// 		sex: "male",
	// 		name: "Darth Vader #125",
	// 		_id:123
	// 	};
	// 	neo4jHelper.insertNode(function (err, node) {
	// 		if (err) return err;
	// 		expect(node.sex).to.be.equal("female");
	// 		expect(node.name).to.be.equal("Darth Vader #123");
	// 		expect(node._id).to.be.a('string');
	// 		done();
	// 	}, nodeTest)
	// });
});
