# Meteor-NATS

[NATS](http://nats.io) is a pub-sub messaging system.  This package wraps the [NodeJS](http://nodejs.org) 
[nats](http://github.com/nats-io/node-nats) client for use with [Meteor](http://meteor.com).

## Caveats

### TLS
`node-nats` does not support NodeJS v0.10.x, so until Meteor gets support for modern versions
of NodeJS, we have to do some kludge-work to get this going.

Even then, **THIS VERSION WILL NOT WORK WITH TLS** due to incompatibilities, despite the fact
that the code is present.  Because this package is exported only on the server side, you can
still use TLS between your Meteor client and server.  It is only the NATS client which cannot
use TLS.

Follow meteor/meteor#5124 to see when this can be fixed.  Then we can use the Npm package without
the kludgy direct modification of the upstream client.

### Hot code reload

During development, the hot code reload on the server will not properly close your client
connections or subscriptions.  As such, you will probably want to add a `SIGTERM` listener
for each client:

```javascript
var nc = connectNats();
nc.once('connect',Meteor.bindEnvironment(function() {
   process.once('SIGTERM',function() {
      return nc && nc.close && nc.close();
   })
}));
```

## Basic Usage

Add the package to your Meteor project with:
```sh
meteor add cycore:nats
```

The `nats` global is made available for use by the Meteor server, but in general, you
should not interact with it directly.  Instead, use the wrapper `natsConnect()` to obtain
a wrapped copy of the nats client connection.  The documentation on for the Node client
should generally be correct for everything else, once you have the wrapped client connection.

```javascript
var nc = natsConnect() // use all default values; connect to localhost:4222 as the NATS server
// or
var nc = natsConnect({
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
var sid = nc.request('myReq:4329', function(resp) {
   console.log("Got a response in msg stream: " + resp);
});

// Request with automatic unsubscribe
nc.request('help', null /* queue Id */, {max: 1}, function(resp) {
   console.log('Got a response for the helpReq: ' + resp);
});

// Reply handler
nc.subscribe('help', function(req, replyTo) {
   nc.publish(replyTo, 'Here is some food.');
});

// Close the client connection
nc.close();
```

See the [node-nats](http://github.com/nats-io/node-nats) for more information.
