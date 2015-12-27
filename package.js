Package.describe({
  name: 'cycore:nats',
  version: '0.0.3',
  // Brief, one-line summary of the package.
  summary: 'NATS client library for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/CyCoreSystems/meteor-nats.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
//   "nats": "0.5.0" // upstream NATS library does not support NodeJS <v0.12.x
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript','server');
  api.addFiles('nats.js','server');
  api.export('nats','server');
  api.export('natsConnect','server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cycore:nats', 'server');
  api.addFiles('nats-tests.js', 'server');
});
