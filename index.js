var express = require('express');
var basicAuth = require('basic-auth-connect');
var bodyParser = require('body-parser');
var path = require('path');
var rpio = require('rpio');
var CronJob = require('node-cron').CronJob;

// GPIO stuff
const M_PIN = 7;
var hertz = 0;

/*gpio.setup(M_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);

function readValue(onDone) {
  hertz = 0;
  gpio.on('change', valueIncrementor);
  setTimeout(function() {
    gpio.removeEventListener('change', valueIncrementor);
    onDone();
  }, 1000);
}

function valueIncrementor(channel, value) {
  if (value) {
    hertz++;
  }
}*/

// Express stuff
var app = express();
app.use(basicAuth('test', 'test'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// API cache and access stuff
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// API routes
app.get('/measurement/current', function (req, res) {
  res.json({'value' : 1});
/*  readValue(function() {
    res.json({ 'value' : hertz });
  });*/
});

// Server startup
app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});

// Close pins on exit
process.on('exit', gpio.destroy(function() {
    console.log('All pins unexported');
  })
);