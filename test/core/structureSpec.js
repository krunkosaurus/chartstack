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
