'use strict';

var geocoder = require('../geocoder.js'),
		expect = require("chai").expect;

exports['awesome'] = {
	setUp: function(done) {
		// setup here
		done();
	},
	'no args': function(test) {
		test.expect(1);
		// tests here
		test.equal(geos_import.awesome(), 'awesome', 'should be awesome.');
		test.done();
	},
};

 describe("#getCollection() for collection 'buildings' equals 'NS00087' (Sydney HO)", function() {

    var req, res;

    req = {
      model: model,
      query: {
        path: 'reference',
        value: 'NS00087'
      },
      params: {},
      collection: {
        name: collectionName
      }
    };

    it("should return an object containing an array of documents", function(done) {
      api.getCollection(req, res, function() {
        expect(req).to.have.deep.property('result.' + collectionName).that.is.a('Array');
        expect(req.result[collectionName].length).to.equal(1);
        expect(req.result[collectionName]).to.have.deep.property('[0].reference').that.equal('NS00087');
        done();
      });
    });

  });

