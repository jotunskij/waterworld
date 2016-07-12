var express = require('express');
var basicAuth = require('basic-auth-connect');
var bodyParser = require('body-parser');
var path = require('path');
var rpio = require('rpio');
var CronJob = require('cron').CronJob;
var sqlite = require('sqlite3');
var request = require('request');
var moment = require('moment');
var config = require('/home/pi/Repos/waterworld/config');
var jobs = require('/home/pi/Repos/waterworld/cronjobs');
var schedule = require('/home/pi/Repos/waterworld/schedule');
var mailer = require('/home/pi/Repos/waterworld/mailer');
var watering = require('/home/pi/Repos/waterworld/watering');

// rpio
const IO_PIN = 12;
rpio.open(IO_PIN, rpio.OUTPUT, rpio.LOW);

// Db stuff
var db = new sqlite.Database('/home/pi/Repos/waterworld/waterworld.db', sqlite.OPEN_READWRITE);

// Express stuff
let app = express();
app.use(basicAuth('test', 'test'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// API cache and access stuff
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// API routes
app.get('/measurements', function (req, res) {
  res.json({'value' : 0});
});

app.get('/weather', function(req, res) {
  request('http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/17.670079/lat/59.318412/data.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let result = JSON.parse(body);
      for (var i = 0; i < result.timeSeries.length; i++) {
        result.timeSeries[i].validTime = moment(result.timeSeries[i].validTime).format('YYYY-MM-DD HH:mm:ss');
      }
      res.json(result);
    }
  });    
});

app.get('/watering', function(req, res){
  watering.getWatering(function(waterings) {
    res.json(waterings);
  });
});

app.get('/schedule', function(req, res){
  schedule.getSchedules(function(schedules) {
    res.json(schedules);
  });
});

app.post('/schedule', function(req, res) {
  schedule.saveSchedule(req.body);
  res.json({true: true});
});

app.get('/config', function(req, res) {
  config.getConfig(function(cfg) {
    res.json(cfg);  
  });
});

app.post('/config', function(req, res) {
  config.saveConfig(req.body.name, req.body.value);
  res.json({true: true});    
});

var wateringInterval;

function correctDay(schedule, date) {
  switch(date.getDay()) {
    case 0:
      return schedule.sunday;
      break;
    case 1:
      return schedule.monday;
      break;
    case 2:
      return schedule.tuesday;
      break;
    case 3:
      return schedule.wednesday;
      break;
    case 4:
      return schedule.thursday;
      break;
    case 5:
      return schedule.friday;
      break;
    case 6:
      return schedule.saturday;
      break;
    default:
      return 0;
      break;
  }
}

function startWatering(schedule) {
  clearInterval(wateringInterval);
  rpio.write(IO_PIN, rpio.HIGH);
  mailer.sendWaterMail();
  watering.addWatering(function(utcDate) {
    setTimeout(resetWatering.bind(null, utcDate), schedule.duration * 1000 * 60);
  });
}

function shouldWaterNow(schedule) {
  var cDate = new Date();
  var sTime = ("0" + cDate.getHours()).slice(-2) + ":" + ("0" + cDate.getMinutes()).slice(-2);

  return (schedule.time == sTime &&
    schedule.active == 1 &&
    correctDay(schedule, cDate) == 1);
}

function checkSchedule() {
  console.log("Checking schedules for jobs: " + sTime);
  schedule.getSchedules(function(schedules) {
    for (var i = 0; i < schedules.length; i++) {
      var schedule = schedules[i];
      if (shouldWaterNow(schedule)) {
        startWatering(schedule);
      }
    }
  });
}

function resetWatering(startTime) {
  rpio.write(IO_PIN, rpio.LOW);
  if (startTime) {
    watering.endWatering(startTime);
  }
  wateringInterval = setInterval(checkSchedule, 5000);
}

// Server startup
app.listen(3000, function () {
  resetWatering();
  console.log('Server listening on port 3000!');
});

function shutdown() {
  console.log('Shutdown detected. Closing db and sending LOW signal to IO_PIN');
  rpio.write(IO_PIN, rpio.LOW);
  db.close();
}

process.on('exit', function() {
    shutdown();
});

process.on('uncaughtException', function (err) {
  shutdown();
});

