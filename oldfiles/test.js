var assert = require('assert');
var gitApi = require('./gitApi.js');



describe('Clone Repositories Tool', function() {

	// test case 1
  it('clone 6 repos in the OODD-Mozilla org', function(done) {
    var result = gitApi.testCase1();
    assert.equal(result, true, 'testClone(SuccessMessage exits with 1');
    done();
  });

  //test case 2

  it('fails because of wrong organization name', function(done) {
    var result = gitApi.testCase2();
    assert.equal(result, false, 'testClone(SuccessMessage exits with 1');
    done();
  });
});