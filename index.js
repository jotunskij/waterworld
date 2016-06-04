var express = require('express');
var basicAuth = require('basic-auth-connect');
var bodyParser = require('body-parser');
var path = require('path');
var rpio = require('rpio');
var CronJob = require('cron').CronJob;
var sqlite = require('sqlite3');
var request = require('request');
var moment = require('moment');

var cp = require('child_process');
var reader = cp.fork('./reader');

/*
  watering statuses:
  done, queued, accepted, denied, running

  Psuedo:
  cronjob start get_value
  cronjob start water_queue_handler
    
  get_value.read_value():
    write_value_to_db
    if should_water():
      add_queued_watering_to_db()
      cronjob stop get_value
      send_notifications()
    
  water_queue_handler.check_for_jobs():
    if job.queued:
      send_notifications()
      job.status = accepted
    if job.accepted && job.time <= now:
      start_watering()
      timeout(stop_watering)  
      job.status = done
  
  if config_changed():
    reload_cron_jobs()
    
*/    

// Db stuff
var db = new sqlite.Database('waterworld.db', sqlite.OPEN_READWRITE);

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

// Callback for measurement read done
reader.on('message', function(m) {
  console.log('received: ' + m);
});

// API routes
app.get('/measurement/current', function (req, res) {
  res.json({'value' : readValue()});
});

app.get('/measurement/test', function(req, res) {
  reader.send('read');
  res.json({'status': 'done'});
});

app.get('/weather', function(req, res) {
  request('http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/59.318412/lon/17.670079/data.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let result = JSON.parse(body);
      for (var i = 0; i < result.timeseries.length; i++) {
        result.timeseries[i].validTime = moment(result.timeseries[i].validTime).format('YYYY-MM-DD HH:mm:ss');          
      }
      res.json(result);
    }
  });    
});

app.get('/config', function(req, res) {
  var ret = []
  db.all('SELECT * FROM CONFIG', function(err, rows) {
    rows.forEach(function(row) {
      ret.push({name : row.NAME, value: row.VALUE});
    });
    res.json(ret);  
  });
});

app.post('/config', function(req, res) {
  db.run('UPDATE CONFIG SET VALUE=? WHERE NAME=?', req.body.value, req.body.name, function(err) {
    if (err) {
      req.json({err: err});
    }
  });
  res.json({true: true});    
});

// Server startup
app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});

// Close pins on exit
process.on('exit', function() {
    db.close();
  }
);

