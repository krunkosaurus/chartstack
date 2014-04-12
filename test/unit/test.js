describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
      var foo = 'bar';
      var tea = {flavors: 'sds'}


      expect(foo).to.be.a('string');
      expect(foo).to.equal('bar');
      expect(foo).to.have.length(3);
      expect(tea).to.have.property('flavors')
        .with.length(3);
    })

    it('should be awesome', function(){
      expect('to').to.equal('to');

    });
  })
})


/*
describe("A test suite", function() {
  beforeEach(function() {
  });
  afterEach(function() {
  });

  it('should fail', function() {
    expect(true).to.be.false;
  });
});
*/
