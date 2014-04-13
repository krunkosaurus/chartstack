describe('Chartstack defaults', function(){
    it('should have default object', function(){
      expect(chartstack.defaults).to.be.an('object');
    });

    it('should have some default properties', function(){
      expect(chartstack.defaults.labels).to.be.true;
    });
})
