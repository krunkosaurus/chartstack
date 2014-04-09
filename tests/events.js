function a(){}
function Bob(){}
Bob.prototype = new chartstack.Event();
var bob = new Bob();
bob.on('hi', function(){
  console.log(1);
});

bob.on('hi', function(){
  console.log(2);
});

bob.on('sigh', function(){
  console.log(3);
});

bob.on('sigh', function(){
  console.log('sthis', this);
  console.log(4);
  console.log('arguments', arguments);
});

bob.on('bye', function(){
  console.log(5);
});

bob.trigger('sigh', 'hey', 'sup');

bob.off('hi');
bob.on('sigh', a);
bob.on('sigh', function(){});
bob.off('sigh', a);

var Jane = function(){};
Jane.prototype = new chartstack.Event();

var jane = new Jane();
jane.on('hello', function(){
  console.log('hello from jane!');
});

jane.trigger('hello');
//bob.off('hisdfsdf');
jane.off();
