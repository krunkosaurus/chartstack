mocha.ui('bdd');
mocha.reporter('html');
expect = chai.expect;

describe('Google Charts', function(){
  it('should have Google loaded', function(){
    expect(google).is.an('object');
  });

});

if (window.mochaPhantomJS){
  mochaPhantomJS.run();
}else {
  mocha.run();
}
