mocha.ui('bdd');
mocha.reporter('html');
expect = chai.expect;

describe('Chartstack defaults', function(){
    it('should have default object', function(){
      expect(chartstack.defaults).to.be.an('object');
    });

    it('should have some default properties', function(){
      expect(chartstack.defaults.labels).to.be.true;
    });
})

describe('Chartstack structure', function(){
    it('should have document.createElement', function(){
      expect(document.createElement).to.be.a('function');
    });

    it('should have chartstack', function(){
      expect(chartstack).to.be.an('object');
    });

    it('should have .each,.is,.extend,.ready', function(){
      expect(chartstack.is).to.be.an('function');
      expect(chartstack.each).to.be.an('function');
      expect(chartstack.extend).to.be.an('function');
      expect(chartstack.ready).to.be.an('function');
    });
});

describe('Chartstack.noConflict', function(){
  var banana;

  it('should have .noConflict', function(){
    expect(chartstack.noConflict).to.be.a('function');
  });

  it('should allow us to move the chartstack namespace', function(){
    banana = chartstack.noConflict();
    expect(chartstack).to.be.undefined;
    // failing.
    expect(banana).to.be.an('function');

    // Move back for other tests.
    chartstack = banana.noConflict();
  });
});

if (window.mochaPhantomJS){
  mochaPhantomJS.run();
}else {
  mocha.run();
}
