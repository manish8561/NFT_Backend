let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
var assert = require('assert');
chai.use(chaiHttp);

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});