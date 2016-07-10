var CronJob = require('cron').CronJob;
var sqlite = require('sqlite3');

var cp = require('child_process');
var reader = cp.fork('/home/pi/Repos/waterworld/reader');

var config = [];
var database;
var readJob, waterJob;

// Callback for measurement read done
reader.on('message', function(value) {
  console.log('Read value: ' + value);
  database.run('INSERT INTO MEASUREMENTS (MEASURED, VALUE) VALUES (?, ?)',
    new Date().toISOString(),
    value,
    function(err) {
    });

});

function readJob() {
  reader.send('read');
  console.log('Ran readJob');
}

function waterJob() {
  console.log('Ran waterJob');
}

module.exports = {
      
    initConfig: function(cfg, db) {
        config = cfg;
        database = db;
    },
    
    startJobs: function() {
        console.log('Started cronjobs...');
        //setInterval(waterJob, 10000);
        setInterval(readJob, 10000);
    }
    
}

