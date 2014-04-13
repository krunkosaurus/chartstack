describe('Chartstack structure', function(){
    it('should have document.createElement', function(){
      expect(document.createElement).to.be.a('function');
    });

    it('should have chartstack', function(){
      expect(chartstack).to.be.an('object');
    });
});
