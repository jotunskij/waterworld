var express = require('express');
var basicAuth = require('basic-auth-connect');
var bodyParser = require('body-parser');
var path = require('path');
var rpio = require('rpio');
var CronJob = require('cron').CronJob;

// GPIO stuff
const M_PIN = 7;
var hertz = 0;
var buf = new Buffer(100000);
rpio.open(M_PIN, rpio.OUTPUT);

function readValue() {
  var d1 = new Date();
  var n1 = d1.getTime();
  rpio.readbuf(M_PIN, buf);
  var d2 = new Date();
  var n2 = d2.getTime();
  var execMs = n2 - n1;
  var tmp = new Array(buf.length); /* 0.8 compat */
  for (i = 0; i < buf.length; i++) {
    tmp[i] = buf[i];
  }
  var str = tmp.join('').replace(/0+/g, '0').replace(/1+/g, '1');
  var edges = (str.match(/1/g) || []).length;
  return (edges / (execMs / 1000));  
}

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
  res.json({'value' : readValue()});
});

// Server startup
app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});

// Close pins on exit
/*process.on('exit', gpio.destroy(function() {
    console.log('All pins unexported');
  })
);*/

