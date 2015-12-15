# Meteor-NATS

[NATS](http://nats.io) is a pub-sub messaging system.  This package wraps the [NodeJS](http://nodejs.org) 
[nats](http://github.com/nats-io/node-nats) client for use with [Meteor](http://meteor.com).

## Basic Usage

The `nats` global is made available for use by the Meteor server.  The documentation on for the Node client
should generally be correct, though it is likely that not all methods are implemented.

```javascript
var nc = nats.connect({
   // This connectionOptions object is entirely optional; null may take its place, as can
   // any of its properties be omitted.
   servers: ['nats://server1.tld:4222','nats://server2.example.com:4222'], // may be an array of strings or a simple string
   tls: true, // true, false, or an object of tlsOptions; defaults to false
      // tlsOptions: {
      //   rejectUnauthorized: true, // default: true
      //   ca: [ fs.readFileSync('ca.pem') ],
      //   key: fs.readFileSync('client.key'),
      //   cert: fs.readFileSync('client.cert')
      // }
   yieldTime: 10, // maximum processing time chunk before yielding to other transactions
   user: 'joeTheMeteor', // authentication username
   pass: 'joeHasAGreatPassword-Meteor', // authentication password
   reconnect: true, // Whether to reconnect on loss of connection
   // many more options; see node-nats code
});

// Simple publisher
nc.publish('mysubject', 'My Message!');

// Simple subscriber
var sid = nc.subscribe('another:subject', function(msg) {
   console.log("Received a message: " + msg);
});
Meteor.setTimeout(function() {
   nats.unsubscribe(sid);
}, 1000);

// Request stream
var sid = nats.request('myReq:4329', function(resp) {
   console.log("Got a response in msg stream: " + resp);
});

// Request with automatic unsubscribe
nats.request('helpReq', null /* queue Id */, {max: 1}, function(resp) {
   console.log('Got a response for the helpReq: ' + resp);
});

// Reply handler
nats.subscribe('help', function(req, replyTo) {
   nats.publish(replyTo, 'Here is some food.');
});

// Close the client connection
nats.close();
```

See the [node-nats](http://github.com/nats-io/node-nats) for more information.


_License_: MIT
