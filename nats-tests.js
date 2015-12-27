// Write your tests here!
// Here is an example.
Tinytest.add('example', function (test) {
  test.equal(true, true);
});

Tinytest.add('connect', function (test) {
   var nc = natsConnect();
   test.isNotNull(nc,'Returns a nats connection');
   test.isNotUndefined(nc.publish, 'connection has a publish method');
   nc.close();
});

Tinytest.add('publish', function(test) {
   var nc = natsConnect();
   nc.publish('toss', 'alpha');
   nc.close();
   test.ok();
});

Tinytest.addAsync('subscribe', function(test, done) {
   var codeword = "hello";
   var nc = natsConnect();
   var ssid = nc.subscribe('sub', {max:1}, function(msg) {
      console.log("Got it:",msg);
      test.equal(msg, codeword,'Receives proper message');
      nc.unsubscribe(ssid);
      nc.close();
      done();
   });
   nc.publish('sub', codeword);
   test.ok();
});

Tinytest.add('subscribe with multiple messages', function(test) {
   var count = 0;
   var nc = natsConnect();
   var ssid = nc.subscribe('countSub',function(msg) {
      count++;
   });
   nc.publish('countSub','test');
   nc.publish('countSub','test');
   nc.publish('countSub','test');

   test.equal(count,3);
   nc.close();
});

Tinytest.addAsync('request', function(test, done) {
   var checkVal = 'response';
   var nc = natsConnect();
   var ssid = nc.subscribe('reqResponder',function(msg, reply) {
      nc.publish(reply, checkVal);
   });
   nc.request('reqResponder','test', function(msg) {
      test.equal(msg, checkVal);
      nc.unsubscribe(ssid);
      nc.close();
      done();
   });
});
