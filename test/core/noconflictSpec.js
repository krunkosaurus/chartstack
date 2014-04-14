describe('Chartstack.noConflict', function(){
  var banana;

  it('should have .noConflict', function(){
    expect(chartstack.noConflict).to.be.a('function');
  });

  it('should allow us to move the chartstack namespace', function(){
    banana = chartstack.noConflict();
    expect(chartstack).to.be.undefined;
    expect(banana).to.be.an('object');

    // Move back for other tests.
    chartstack = banana.noConflict();
  });


});
